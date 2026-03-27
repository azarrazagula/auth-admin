import React, { useState, useEffect } from 'react';
import './Users.css';
import Modal from '../components/Modal';
import FoodList from './FoodList';
import BillingDetails from './BillingDetails';
import API_BASE_URL from '../config';
import Button from '../components/common/Button';

const Users = ({ onLogout, user }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('single'); // 'single' or 'all'
  const [selectedId, setSelectedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeView, setActiveView] = useState('profiles'); // Current view state
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const apiBase = API_BASE_URL;
      const response = await fetch(`${apiBase}/api/admin/users`);
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
      const apiBase = API_BASE_URL;
      const response = await fetch(`${apiBase}/api/admin/users/${id}`, {
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
      const apiBase = API_BASE_URL;
      const response = await fetch(`${apiBase}/api/admin/users`, {
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

  if (loading && users.length === 0) return <div className="loading" style={{ padding: '2rem', textAlign: 'center' }}>Loading users...</div>;
  if (error && users.length === 0) return <div className="error" style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger-color)' }}>{error}</div>;

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
          <div
            className={`nav-item ${activeView === 'billing' ? 'active' : ''}`}
            onClick={() => setActiveView('billing')}
          >
            <span>🧾</span> Billing Details
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
              {activeView === 'billing' && 'Billing Details'}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: 'auto' }}>
               {activeView === 'profiles' && (
                 <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>🔍</span>
                    <input type="text" className="sa-input" placeholder="Search profiles..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ paddingLeft: '2.2rem', width: '220px', height: '42px', fontSize: '0.9rem' }} />
                 </div>
               )}
               <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {activeView === 'profiles' && (
                    <Button 
                    variant="glass" 
                    size="sm"
                    onClick={handleRefresh}
                    loading={loading && users.length > 0}
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-glass)' }}
                    >
                    🔄 Refresh
                    </Button>
                )}
                {user && (
                    <div className="user-info" style={{ borderLeft: '1px solid var(--border-glass)', paddingLeft: '1.5rem' }}>
                    <span className="user-name" style={{ fontWeight: '600' }}>
                        {user.firstName ? `${user.firstName} ${user.lastName || ''}` : (user.name || 'Admin Account')}
                    </span>
                    </div>
                )}
               </div>
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
                      {users
                        .filter(u => 
                          `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((u, idx) => (
                        <tr key={u._id} style={{ animation: `saFadeIn 0.3s ease forwards ${idx * 0.05}s` }}>
                          <td>{u.firstName} {u.lastName}</td>
                          <td style={{ color: 'var(--primary)', fontWeight: '500' }}>{u.email}</td>
                          <td>{u.phoneNumber || u.phonenumber || 'N/A'}</td>
                          <td>{u.dateOfBirth || u['Date-Of-Birth'] ? (
                            new Date(u.dateOfBirth || u['Date-Of-Birth']).toLocaleDateString()
                          ) : 'N/A'}</td>
                          <td>{u.age || 'N/A'}</td>
                          <td>
                            <span className={`role-badge ${u.role}`}>
                              {u.role}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${u.isVerified ? 'verified' : 'pending'}`}>
                              {u.isVerified ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td>
                            {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}
                          </td>
                          <td>
                            <button
                              className="delete-btn"
                              onClick={() => openDeleteModal(u._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {users.length > 0 && 
                        users.filter(u => 
                          `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase())
                        ).length === 0 && (
                        <tr>
                          <td colSpan="10" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                             No profiles found matching "{searchTerm}"
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {activeView === 'products' && <FoodList />}
          {activeView === 'billing' && <BillingDetails />}
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
