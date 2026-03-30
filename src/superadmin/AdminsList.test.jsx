import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminsList from './AdminsList';

// Mock the global fetch
global.fetch = jest.fn();

const mockAdminsData = {
  success: true,
  admins: [
    {
      _id: 'a1',
      firstName: 'Admin',
      lastName: 'One',
      email: 'admin1@example.com',
      phoneNumber: '1234567890',
      isVerified: true,
      lastLogin: new Date().toISOString(),
      role: 'admin'
    },
    {
      _id: 'a2',
      firstName: 'Admin',
      lastName: 'Two',
      email: 'admin2@example.com',
      phoneNumber: '0987654321',
      isVerified: false,
      lastLogin: null,
      role: 'admin'
    }
  ]
};

describe('AdminsList Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
  });

  test('renders admin list correctly', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockAdminsData),
      })
    );

    render(<AdminsList />);

    // Should show loading initially
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    // Wait for the admins to be displayed
    await waitFor(() => {
      expect(screen.getByText('Admin One')).toBeInTheDocument();
      expect(screen.getByText('Admin Two')).toBeInTheDocument();
    });

    expect(screen.getByText('admin1@example.com')).toBeInTheDocument();
    expect(screen.getByText('Verified')).toBeInTheDocument();
    expect(screen.getByText('Unverified')).toBeInTheDocument();
  });

  test('filters admins by search term', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockAdminsData),
      })
    );

    render(<AdminsList />);

    await waitFor(() => {
      expect(screen.getByText('Admin One')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search admins.../i);
    fireEvent.change(searchInput, { target: { value: 'Two' } });

    expect(screen.queryByText('Admin One')).not.toBeInTheDocument();
    expect(screen.getByText('Admin Two')).toBeInTheDocument();
  });

  test('toggles the add admin form correctly', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true, admins: [] }),
      })
    );

    render(<AdminsList />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });

    const addButton = screen.getByText('+ New Admin');
    fireEvent.click(addButton);

    expect(screen.getByText('Add New Administrator')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(screen.queryByText('Add New Administrator')).not.toBeInTheDocument();
  });
});
