import React, { useState, useEffect } from 'react';
import './SuperAdmin.css';
import API_BASE_URL from '../config';

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const apiBase = API_BASE_URL;
      const response = await fetch(`${apiBase}/api/superadmin/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('sa_accessToken')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      } else {
        setError(data.message || 'Failed to fetch statistics');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="sa-page-header">
        <h2>System Statistics</h2>
        <button className="sa-btn sa-btn-sm" style={{ width: 'auto' }} onClick={fetchStats}>
          Refresh Stats
        </button>
      </div>

      {error && <div className="sa-badge sa-badge-danger" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div className="sa-stats-grid">
        <div className="sa-stat-card">
          <div className="sa-stat-label">Total Users</div>
          <div className="sa-stat-value">{stats?.totalUsers || 0}</div>
        </div>
        <div className="sa-stat-card">
          <div className="sa-stat-label">Total Admins</div>
          <div className="sa-stat-value">{stats?.totalAdmins || 0}</div>
        </div>
        <div className="sa-stat-card">
          <div className="sa-stat-label">Verified Users</div>
          <div className="sa-stat-value">{stats?.verifiedUsers || 0}</div>
        </div>
        <div className="sa-stat-card">
          <div className="sa-stat-label">Login Rate</div>
          <div className="sa-stat-value">{stats?.loginPercentage || '0%'}</div>
        </div>
      </div>

      <div className="sa-table-container" style={{ padding: '1.5rem' }}>
        <h3>System Overview</h3>
        <p style={{ color: 'var(--sa-text-muted)', marginBottom: '1rem' }}>Activity and system health metrics.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          <div className="sa-form-group">
            <label>API Status</label>
            <span className="sa-badge sa-badge-success">Operational</span>
          </div>
          <div className="sa-form-group">
            <label>Last Updated</label>
            <span style={{ color: 'var(--sa-text)' }}>{new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
