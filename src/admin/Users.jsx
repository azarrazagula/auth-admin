import React, { useState, useEffect } from 'react';
import './Users.css';
import Modal from '../components/Modal';
import FoodList from './FoodList';

const Users = ({ onLogout, user }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('single'); // 'single' or 'all'
  const [selectedId, setSelectedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeView, setActiveView] = useState('profiles'); // Current view state

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/admin/users');
      const data = await response.json();
      if (data.success) {
        // Filter out everyone except regular users
        const filteredUsers = data.users.filter(u => u.role === 'user');
        setUsers(filteredUsers);
      } else {
        setError(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError('An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openDeleteModal = (id) => {
    setSelectedId(id);
    setModalType('single');
    setModalOpen(true);
  };

  const openDeleteAllModal = () => {
    setModalType('all');
    setModalOpen(true);
  };

  const handleDeleteUser = async (id) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`http://localhost:5001/api/admin/users/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setUsers(users.filter((user) => user._id !== id));
        setModalOpen(false);
      } else {
        alert(data.message || 'Failed to delete user');
      }
    } catch (err) {
      alert('An error occurred while deleting the user');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAllUsers = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch('http://localhost:5001/api/admin/users', {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setUsers([]);
        setModalOpen(false);
      } else {
        alert(data.message || 'Failed to delete all users');
      }
    } catch (err) {
      alert('An error occurred while deleting all users');
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDelete = () => {
    if (modalType === 'single') {
      handleDeleteUser(selectedId);
    } else {
      handleDeleteAllUsers();
    }
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="users-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">🛡️</div>
          <div className="sidebar-title">AdminPanel</div>
        </div>

        <nav className="nav-menu">
          <div
            className={`nav-item ${activeView === 'profiles' ? 'active' : ''}`}
            onClick={() => setActiveView('profiles')}
          >
            <span>👤</span> User Profiles
          </div>
          <div
            className={`nav-item ${activeView === 'products' ? 'active' : ''}`}
            onClick={() => setActiveView('products')}
          >
            <span>🍔</span> Products
          </div>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <div className="nav-item" onClick={onLogout} style={{ color: 'var(--danger-color)' }}>
            <span>🚪</span> Logout
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="users-container">
          <div className="header-section">
            <h1>
              {activeView === 'profiles' && 'User Profiles'}
              {activeView === 'products' && 'Product Management'}
            </h1>
            <div className="header-actions">
              {user && (
                <div className="user-info">
                  <span className="user-name">
                    {user.firstName ? `${user.firstName} ${user.lastName || ''}` : (user.name || 'Admin Account')}
                  </span>
                </div>
              )}
              <button className="refresh-btn" onClick={handleRefresh}>
                Refresh
              </button>
            </div>
          </div>

          {activeView === 'profiles' && (
            <>
              <div className="action-row" style={{ marginBottom: '1.5rem' }}>
                {users.length > 0 && (
                  <button className="delete-all-btn" onClick={openDeleteAllModal}>
                    Delete All Users
                  </button>
                )}
              </div>

              {users.length === 0 ? (
                <div className="no-users">No users found.</div>
              ) : (
                <div className="user-table-wrapper">
                  <table className="user-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>DOB</th>
                        <th>Age</th>
                        <th>Role</th>
                        <th>Verified</th>
                        <th>Created At</th>
                        <th>Last Login</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td>{user.firstName} {user.lastName}</td>
                          <td>{user.email}</td>
                          <td>{user.phoneNumber || 'N/A'}</td>
                          <td>{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}</td>
                          <td>{user.age || 'N/A'}</td>
                          <td>
                            <span className={`role-badge ${user.role}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${user.isVerified ? 'verified' : 'pending'}`}>
                              {user.isVerified ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td>
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never logged in'}
                          </td>
                          <td>
                            <button
                              className="delete-btn"
                              onClick={() => openDeleteModal(user._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {activeView === 'products' && <FoodList />}
        </div>
      </main>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={
          modalType === 'single'
            ? 'Are you sure you want to delete this user?'
            : 'Are you sure you want to delete ALL users? This action is irreversible.'
        }
        isConfirming={isDeleting}
      />
    </div>
  );
};

export default Users;
