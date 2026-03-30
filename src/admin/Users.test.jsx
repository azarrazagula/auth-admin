import { render, screen, waitFor } from '@testing-library/react';
import Users from './Users';
// import { BrowserRouter } from 'react-router-dom';

// Mock the global fetch
global.fetch = jest.fn();

const mockUser = {
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin'
};

const mockUsersData = {
  success: true,
  users: [
    {
      _id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'user',
      isVerified: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      role: 'user',
      isVerified: false,
      createdAt: new Date().toISOString()
    }
  ]
};

describe('Users Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders user list correctly', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockUsersData),
      })
    );

    render(
        <Users user={mockUser} onLogout={() => {}} />
    );

    // Should show loading initially
    expect(screen.getByText(/Loading users.../i)).toBeInTheDocument();

    // Wait for the users to be displayed
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  test('shows error message on fetch failure', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: false, message: 'API Error' }),
      })
    );

    render(
        <Users user={mockUser} onLogout={() => {}} />
    );

    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });

  test('filters users by search term', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockUsersData),
      })
    );

    render(
        <Users user={mockUser} onLogout={() => {}} />
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search profiles.../i);
    
    // Search for Jane
    const { fireEvent } = require('@testing-library/react');
    fireEvent.change(searchInput, { target: { value: 'Jane' } });

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });
});
