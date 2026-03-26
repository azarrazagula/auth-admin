import React, { useState, useEffect } from 'react';
import './Loginform.css';
import API_BASE_URL from '../config';

const Loginform = ({ onLogin }) => {
  const [mode, setMode] = useState('login'); // 'login', 'forgot', 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Check for token in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      setResetToken(token);
      setMode('reset');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    let url = '';
    const apiBase = API_BASE_URL;
    let method = 'POST';
    let body = {};

    if (mode === 'login') {
      url = `${apiBase}/api/admin/login`;
      body = { email, password };
    } else if (mode === 'forgot') {
      url = `${apiBase}/api/admin/forgot-password`;
      body = { email };
    } else if (mode === 'reset') {
      if (!resetToken) {
        setError('Reset token is required.');
        setLoading(false);
        return;
      }
      url = `${apiBase}/api/admin/reset-password/${resetToken}`;
      method = 'PUT';
      body = { password }; // Backend only needs the new password
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok || data.success) {
        if (mode === 'login') {
          localStorage.setItem('accessToken', data.accessToken);
          onLogin(data.admin || data.user);
        } else if (mode === 'forgot') {
          // In development, we get the token directly
          if (data.resetToken) {
            setResetToken(data.resetToken);
            setMessage(`Instruction: Copy the token below and click "Enter Token" to reset your password.`);
          } else {
            setMessage(data.message || 'Action successful!');
          }
        } else if (mode === 'reset') {
          setMessage(data.message || 'Action successful!');
          setTimeout(() => setMode('login'), 2000);
        }
      } else {
        setError(data.message || (data.errors ? data.errors[0].msg : 'Something went wrong.'));
      }
    } catch (err) {
      setError('Connection error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const renderLoginForm = () => (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          required
          autoComplete="email"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          required
          autoComplete="current-password"
        />
      </div>
      <button type="submit" className="auth-btn" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
      <div className="form-footer">
        <button type="button" className="link-btn" onClick={() => setMode('forgot')}>
          Forgot Password?
        </button>
      </div>
    </form>
  );

  const renderForgotForm = () => (
    <div className="auth-form-wrapper">
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Enter Registered Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            required
            disabled={!!resetToken}
            autoComplete="email"
          />
        </div>
        {!resetToken && (
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        )}
        <div className="form-footer">
          <button type="button" className="link-btn" onClick={() => {
            setMode('login');
            setResetToken('');
            setMessage('');
          }}>
            Back to Login
          </button>
        </div>
      </form>

      {resetToken && (
        <div className="token-display">
          <p className="token-label">Reset Token:</p>
          <div className="token-box">{resetToken}</div>
          <button className="auth-btn secondary" onClick={() => setMode('reset')}>
            Enter Token & Reset
          </button>
        </div>
      )}
    </div>
  );

  const renderResetForm = () => (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <label>Reset Token</label>
        <input
          type="text"
          value={resetToken}
          onChange={(e) => setResetToken(e.target.value)}
          placeholder="Enter the token sent to your email"
          required
        />
      </div>
      <div className="form-group">
        <label>New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          required
          autoComplete="new-password"
        />
      </div>
      <div className="form-group">
        <label>Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="********"
          required
          autoComplete="new-password"
        />
      </div>
      <button type="submit" className="auth-btn" disabled={loading}>
        {loading ? 'Updating...' : 'Update Password'}
      </button>
      <div className="form-footer">
        <button type="button" className="link-btn" onClick={() => setMode('login')}>
          Back to Login
        </button>
      </div>
    </form>
  );

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🛡️</div>
          <h1>
            {mode === 'login' && 'Admin Login'}
            {mode === 'forgot' && 'Forgot Password'}
            {mode === 'reset' && 'Reset Password'}
          </h1>
          <p>
            {mode === 'login' && 'Welcome back! Please enter your details.'}
            {mode === 'forgot' && 'No worries! We will send you instructions.'}
            {mode === 'reset' && 'Create a strong new password for your account.'}
          </p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-success">{message}</div>}

        {mode === 'login' && renderLoginForm()}
        {mode === 'forgot' && renderForgotForm()}
        {mode === 'reset' && renderResetForm()}

        {mode !== 'reset' && (
          <div className="mode-toggle">
            <button onClick={() => setMode('reset')} className="debug-btn">
              (Demo Reset Password Link)
            </button>
            <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
              <button 
                onClick={() => window.location.search = '?portal=superadmin'} 
                className="link-btn"
                style={{ color: '#6366f1', fontWeight: '600' }}
              >
                Go to SuperAdmin Portal 💎
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loginform;
