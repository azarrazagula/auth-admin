import React, { useState, useEffect } from 'react';
import './SuperAdmin.css';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/superadmin/users', {
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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="sa-page-header">
        <h2>User Management</h2>
        <button className="sa-btn sa-btn-sm" style={{ width: 'auto' }} onClick={fetchUsers}>
          Refresh List
        </button>
      </div>

      {error && <div className="sa-badge sa-badge-danger" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div className="sa-table-container">
        <table className="sa-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Verified</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td><span className="sa-badge sa-badge-user">User</span></td>
                <td>
                  <span className={`sa-badge ${user.isVerified ? 'sa-badge-success' : 'sa-badge-danger'}`}>
                    {user.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
