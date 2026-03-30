import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SuperAdminLogin from './SuperAdminLogin';

// Mock global fetch
global.fetch = jest.fn();

describe('SuperAdminLogin Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
  });

  test('renders login form by default', () => {
    render(<SuperAdminLogin onLogin={() => {}} />);
    expect(screen.getByText('SuperAdmin Portal')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('superadmin@example.com')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  test('successful login calls onLogin with admin data', async () => {
    const mockOnLogin = jest.fn();
    const mockAdmin = { id: 'sa1', email: 'superadmin@example.com', role: 'superadmin' };
    
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, accessToken: 'sa-token', admin: mockAdmin }),
      })
    );

    render(<SuperAdminLogin onLogin={mockOnLogin} />);

    fireEvent.change(screen.getByPlaceholderText('superadmin@example.com'), { target: { value: 'superadmin@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('********'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith(mockAdmin);
      expect(localStorage.getItem('sa_accessToken')).toBe('sa-token');
    });
  });

  test('shows error message on failed login', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ success: false, message: 'Invalid SuperAdmin credentials' }),
      })
    );

    render(<SuperAdminLogin onLogin={() => {}} />);

    fireEvent.change(screen.getByPlaceholderText('superadmin@example.com'), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('********'), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(screen.getByText('Invalid SuperAdmin credentials')).toBeInTheDocument();
    });
  });

  test('toggles to forgot password mode', () => {
    render(<SuperAdminLogin onLogin={() => {}} />);
    fireEvent.click(screen.getByText('Forgot Password?'));
    expect(screen.getByText('SuperAdmin Recovery')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('superadmin@example.com')).toBeInTheDocument();
    expect(screen.getByText('Send Reset Link')).toBeInTheDocument();
  });

  test('successful forgot password request shows success message', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'Recovery link sent!' }),
      })
    );

    render(<SuperAdminLogin onLogin={() => {}} />);
    fireEvent.click(screen.getByText('Forgot Password?'));
    fireEvent.change(screen.getByPlaceholderText('superadmin@example.com'), { target: { value: 'sa@test.com' } });
    fireEvent.click(screen.getByText('Send Reset Link'));

    await waitFor(() => {
      expect(screen.getByText('Recovery link sent!')).toBeInTheDocument();
    });
  });
});
