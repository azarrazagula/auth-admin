import { render, screen, waitFor } from '@testing-library/react';
import Stats from './Stats';

// Mock the global fetch
global.fetch = jest.fn();

const mockStatsData = {
  success: true,
  stats: {
    totalUsers: 150,
    totalAdmins: 5,
    verifiedUsers: 140,
    loginPercentage: '93%'
  }
};

describe('Stats Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
  });

  test('renders statistics correctly', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockStatsData),
      })
    );

    render(<Stats />);

    // Should show loading initially
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    // Wait for the stats to be displayed
    await waitFor(() => {
      expect(screen.getByText('150')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('140')).toBeInTheDocument();
    });

    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('93%')).toBeInTheDocument();
  });

  test('shows error message on fetch failure', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: false, message: 'Stats API Error' }),
      })
    );

    render(<Stats />);

    await waitFor(() => {
      expect(screen.getByText('Stats API Error')).toBeInTheDocument();
    });
  });
});
