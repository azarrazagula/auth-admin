import React, { useState } from 'react';
import './SuperAdmin.css';
import API_BASE_URL from '../config';

const SuperAdminLogin = ({ onLogin }) => {
  const [view, setView] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiBase = API_BASE_URL;
      const response = await fetch(`${apiBase}/api/superadmin/login`, {
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
      const apiBase = API_BASE_URL;
      const response = await fetch(`${apiBase}/api/superadmin/forgot-password`, {
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



  return (
    <div className="sa-container sa-login-page">
      <div className="sa-login-card">
        <div className="sa-header">
          <div className="sa-logo">💎</div>
          <h1>
            {view === 'forgotPassword' ? 'SuperAdmin Recovery' : 'SuperAdmin Portal'}
          </h1>
          <p>
            {view === 'forgotPassword' ? 'We will send a reset link to your email' : 'Access the master control panel'}
          </p>
        </div>

        {error && <div className="sa-badge sa-badge-danger" style={{ display: 'block', textAlign: 'center', marginBottom: '1rem', padding: '0.5rem' }}>{error}</div>}
        {successMsg && <div className="sa-badge sa-badge-success" style={{ display: 'block', textAlign: 'center', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#d4edda', color: '#155724' }}>{successMsg}</div>}

        {view === 'forgotPassword' ? (
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
                autoComplete="email"
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
                autoComplete="email"
              />
            </div>
            <div className="sa-form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>Password</label>
                <button type="button" onClick={() => { setView('forgotPassword'); setError(''); setSuccessMsg(''); }} style={{ fontSize: '0.8rem', color: '#6366f1', textDecoration: 'none', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}>Forgot Password?</button>
              </div>
              <input
                type="password"
                className="sa-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
                autoComplete="current-password"
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
