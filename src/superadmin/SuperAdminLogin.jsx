import React, { useState } from 'react';
import './SuperAdmin.css';

const SuperAdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        onLogin(data.user);
      } else {
        setError(data.message || 'Invalid credentials');
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
            <label>Password</label>
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
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button 
            type="button" 
            onClick={() => window.location.href = '/'}
            className="sa-nav-item"
            style={{ margin: '0 auto', fontSize: '0.875rem' }}
          >
            Back to Standard Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
