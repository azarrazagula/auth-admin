import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UsersList from './UsersList';

// Mock the global fetch
global.fetch = jest.fn();

const mockUsersData = {
  success: true,
  users: [
    {
      _id: 'u1',
      firstName: 'Alice',
      lastName: 'Wonder',
      email: 'alice@example.com',
      phoneNumber: '1112223333',
      isVerified: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    },
    {
      _id: 'u2',
      firstName: 'Charlie',
      lastName: 'Brown',
      email: 'charlie@example.com',
      phoneNumber: '4445556666',
      isVerified: false,
      createdAt: new Date().toISOString(),
      lastLogin: null
    }
  ]
};

describe('UsersList Component (Superadmin)', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
  });

  test('renders user list correctly in superadmin view', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockUsersData),
      })
    );

    render(<UsersList />);

    // Should show loading initially
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    // Wait for the users to be displayed
    await waitFor(() => {
      expect(screen.getByText('Alice Wonder')).toBeInTheDocument();
      expect(screen.getByText('Charlie Brown')).toBeInTheDocument();
    });

    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getAllByText('Verified').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Unverified').length).toBeGreaterThan(0);
  });

  test('filters users by search term', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockUsersData),
      })
    );

    render(<UsersList />);

    await waitFor(() => {
      expect(screen.getByText('Alice Wonder')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search by name or email.../i);
    fireEvent.change(searchInput, { target: { value: 'Charlie' } });

    expect(screen.queryByText('Alice Wonder')).not.toBeInTheDocument();
    expect(screen.getByText('Charlie Brown')).toBeInTheDocument();
  });

  test('shows error message on fetch failure', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: false, message: 'Superadmin Users API Error' }),
      })
    );

    render(<UsersList />);

    await waitFor(() => {
      expect(screen.getByText('Superadmin Users API Error')).toBeInTheDocument();
    });
  });
});
