import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Loginform from './Loginform';

// Mock the global fetch
global.fetch = jest.fn();

describe('Loginform Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders login form by default', () => {
    render(<Loginform onLogin={() => {}} />);
    expect(screen.getByText('Admin Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('admin@example.com')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  test('successful login calls onLogin with admin data', async () => {
    const mockOnLogin = jest.fn();
    const mockAdmin = { id: '1', email: 'admin@example.com', role: 'admin' };
    
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, accessToken: 'token', admin: mockAdmin }),
      })
    );

    render(<Loginform onLogin={mockOnLogin} />);

    fireEvent.change(screen.getByPlaceholderText('admin@example.com'), { target: { value: 'admin@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('********'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith(mockAdmin);
      expect(localStorage.getItem('accessToken')).toBe('token');
    });
  });

  test('shows error message on failed login', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ success: false, message: 'Invalid credentials' }),
      })
    );

    render(<Loginform onLogin={() => {}} />);

    fireEvent.change(screen.getByPlaceholderText('admin@example.com'), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('********'), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  test('toggles to forgot password mode', () => {
    render(<Loginform onLogin={() => {}} />);
    fireEvent.click(screen.getByText('Forgot Password?'));
    expect(screen.getByText('Forgot Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/9944171692/i)).toBeInTheDocument();
    expect(screen.getByText('Send OTP')).toBeInTheDocument();
  });

  test('successful OTP request displays OTP and reset button', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, otp: '123456' }),
      })
    );

    render(<Loginform onLogin={() => {}} />);
    fireEvent.click(screen.getByText('Forgot Password?'));
    fireEvent.change(screen.getByPlaceholderText(/9944171692/i), { target: { value: '9944171692' } });
    fireEvent.click(screen.getByText('Send OTP'));

    await waitFor(() => {
      expect(screen.getByText('123456')).toBeInTheDocument();
      expect(screen.getByText(/Enter OTP & Reset/i)).toBeInTheDocument();
    });
  });
});
