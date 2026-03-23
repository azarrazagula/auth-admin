import React, { useState, useEffect } from 'react';
import './Users.css';
import Modal from './Modal';

const Users = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('single'); // 'single' or 'all'
  const [selectedId, setSelectedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/admin/users');
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
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
    <div className="users-container">
      <div className="header-section">
        <div className="title-row">
          <h1>Admin Dashboard</h1>
          <div className="header-actions">
            <button className="refresh-btn" onClick={handleRefresh}>
              Refresh Details
            </button>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
        <p>Manage all registered users in your application.</p>
        
        <div className="action-row">
          {users.length > 0 && (
            <button className="delete-all-btn" onClick={openDeleteAllModal}>
              Delete All Users
            </button>
          )}
        </div>
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
                <th>Role</th>
                <th>Verified</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
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
