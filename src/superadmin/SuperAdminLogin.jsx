import React, { useState, useEffect } from 'react';
import './SuperAdmin.css';

const SuperAdminLogin = ({ onLogin }) => {
  const [view, setView] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/superadmin/reset-password/')) {
      const token = path.split('/').pop();
      if (token) {
        setResetToken(token);
        setView('resetPassword');
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/api/superadmin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok || data.success) {
        localStorage.setItem('sa_accessToken', data.accessToken);
        onLogin(data.admin || data.user);
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await fetch('http://localhost:5001/api/superadmin/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok || data.success) {
        setSuccessMsg(data.message || 'Password reset link sent to your email.');
      } else {
        setError(data.message || 'Failed to request password reset');
      }
    } catch (err) {
      setError('Connection error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await fetch(`http://localhost:5001/api/superadmin/reset-password/${resetToken}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok || data.success) {
        alert(data.message || 'Password reset successful. Please login.');
        window.location.href = '/?portal=superadmin';
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Connection error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sa-container sa-login-page">
      <div className="sa-login-card">
        <div className="sa-header">
          <div className="sa-logo">💎</div>
          <h1>SuperAdmin Portal</h1>
          <p>Access the master control panel</p>
        </div>

        {error && <div className="sa-badge sa-badge-danger" style={{ display: 'block', textAlign: 'center', marginBottom: '1rem', padding: '0.5rem' }}>{error}</div>}
        {successMsg && <div className="sa-badge sa-badge-success" style={{ display: 'block', textAlign: 'center', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#d4edda', color: '#155724' }}>{successMsg}</div>}

        {view === 'resetPassword' ? (
          <form onSubmit={handleResetPassword}>
            <div className="sa-form-group">
              <label>New Password</label>
              <input
                type="password"
                className="sa-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="sa-form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                className="sa-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="sa-btn" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button type="button" onClick={() => window.location.href = '/?portal=superadmin'} className="sa-nav-item" style={{ fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}>Back to Login</button>
            </div>
          </form>
        ) : view === 'forgotPassword' ? (
          <form onSubmit={handleForgotPassword}>
            <div className="sa-form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="sa-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="superadmin@example.com"
                required
              />
            </div>
            <button type="submit" className="sa-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button type="button" onClick={() => { setView('login'); setError(''); setSuccessMsg(''); }} className="sa-nav-item" style={{ fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}>Back to Login</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="sa-form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="sa-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="superadmin@example.com"
                required
              />
            </div>
            <div className="sa-form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>Password</label>
                <a href="#" onClick={(e) => { e.preventDefault(); setView('forgotPassword'); setError(''); setSuccessMsg(''); }} style={{ fontSize: '0.8rem', color: '#6366f1', textDecoration: 'none' }}>Forgot Password?</a>
              </div>
              <input
                type="password"
                className="sa-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="sa-btn" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button 
                type="button" 
                onClick={() => window.location.href = '/'}
                className="sa-nav-item"
                style={{ margin: '0 auto', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Back to Standard Admin
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SuperAdminLogin;
