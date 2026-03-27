import React, { useState, useEffect } from 'react';
import './SuperAdmin.css';
import API_BASE_URL from '../config';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const apiBase = API_BASE_URL;
      const response = await fetch(`${apiBase}/api/superadmin/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('sa_accessToken')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading && users.length === 0) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div className="sa-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>User Management</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
             <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
             <input type="text" className="sa-input" placeholder="Search by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ paddingLeft: '2.5rem', width: '300px' }} />
          </div>
          <button className="sa-btn sa-btn-sm" style={{ width: 'auto' }} onClick={fetchUsers}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {error && <div className="sa-badge sa-badge-danger" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div className="sa-table-container">
        <table className="sa-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>DOB</th>
              <th>Status</th>
              <th>Verified</th>
              <th>Created At</th>
              <th>Last Login</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter(u => 
                `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
                u.email.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((user, idx) => (
              <tr key={user._id} style={{ animation: `saFadeIn 0.3s ease forwards ${idx * 0.05}s` }}>
                <td>{user.firstName} {user.lastName}</td>
                <td style={{ color: 'var(--primary)', fontWeight: '500' }}>{user.email}</td>
                <td>{user.phoneNumber || user.phonenumber || 'N/A'}</td>
                <td>{user.dateOfBirth || user['Date-Of-Birth'] ? (
                  new Date(user.dateOfBirth || user['Date-Of-Birth']).toLocaleDateString()
                ) : 'N/A'}</td>
                <td>
                  <span className={`sa-badge ${user.isVerified ? 'sa-badge-success' : 'sa-badge-danger'}`}>
                    {user.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</td>
              </tr>
            ))}
            {users.length > 0 && 
              users.filter(u => 
                `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
                u.email.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                   No users found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
