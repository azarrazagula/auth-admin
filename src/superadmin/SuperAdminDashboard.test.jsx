import { render, screen, fireEvent } from '@testing-library/react';
import SuperAdminDashboard from './SuperAdminDashboard';

// Mock sub-components so we only test the Dashboard logic
jest.mock('./AdminsList', () => () => <div data-testid="admins-content">Admins Content</div>);
jest.mock('./UsersList', () => () => <div data-testid="users-content">Users Content</div>);
jest.mock('./Stats', () => () => <div data-testid="stats-content">Stats Content</div>);

describe('SuperAdminDashboard Component', () => {
  const mockUser = { firstName: 'Super', lastName: 'Master' };
  const mockOnLogout = jest.fn();

  test('renders with default admins tab active', () => {
    render(<SuperAdminDashboard user={mockUser} onLogout={mockOnLogout} />);
    
    expect(screen.getByText('Super Master')).toBeInTheDocument();
    expect(screen.getByTestId('admins-content')).toBeInTheDocument();
    expect(screen.queryByTestId('users-content')).not.toBeInTheDocument();
  });

  test('switches content when tabs are clicked', () => {
    render(<SuperAdminDashboard user={mockUser} onLogout={mockOnLogout} />);
    
    // Switch to Users
    fireEvent.click(screen.getByText(/Users/i));
    expect(screen.getByTestId('users-content')).toBeInTheDocument();
    expect(screen.queryByTestId('admins-content')).not.toBeInTheDocument();

    // Switch to Statistics
    fireEvent.click(screen.getByText(/Statistics/i));
    expect(screen.getByTestId('stats-content')).toBeInTheDocument();
    expect(screen.queryByTestId('users-content')).not.toBeInTheDocument();
  });

  test('calls onLogout when logout button is clicked', () => {
    render(<SuperAdminDashboard user={mockUser} onLogout={mockOnLogout} />);
    
    fireEvent.click(screen.getByText(/Logout/i));
    expect(mockOnLogout).toHaveBeenCalled();
  });
});
