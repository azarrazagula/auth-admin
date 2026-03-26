import React, { useState, useEffect } from 'react';
import './SuperAdmin.css';
import Modal from '../components/Modal';
import API_BASE_URL from '../config';

const AdminsList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      console.log('Fetching admins...');
      const apiBase = API_BASE_URL;
      const response = await fetch(`${apiBase}/api/superadmin/admins`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('sa_accessToken')}`
        }
      });
      console.log('Fetch response status:', response.status);
      const data = await response.json();
      console.log('Fetch data:', data);
      if (data.success) {
        setAdmins(data.admins);
      } else {
        console.error('Fetch failed:', data.message);
        setError(data.message || 'Failed to fetch admins');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      // Split name into first and last name
      const nameParts = newAdmin.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'User';
      const apiBase = API_BASE_URL;

      console.log('Creating admin with body:', JSON.stringify({ firstName, lastName, email: newAdmin.email, password: newAdmin.password }));
      const response = await fetch(`${apiBase}/api/superadmin/admins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sa_accessToken')}`
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email: newAdmin.email,
          password: newAdmin.password
        }),
      });
      console.log('Create response status:', response.status);
      const data = await response.json();
      console.log('Create data:', data);
      if (data.success) {
        alert(data.message || 'New administrator created successfully!');
        setAdmins([...admins, data.admin]);
        setNewAdmin({ name: '', email: '', password: '' });
        setShowAddForm(false);
      } else {
        console.error('Create failed:', data.message);
        alert(data.message || 'Failed to create admin');
      }
    } catch (err) {
      console.error('Create error:', err);
      alert('Error creating admin');
    }
  };

  const openDeleteModal = (id) => {
    setSelectedId(id);
    setModalOpen(true);
  };

  const handleDeleteAdmin = async () => {
    try {
      setIsDeleting(true);
      const apiBase = API_BASE_URL;
      const response = await fetch(`${apiBase}/api/superadmin/admins/${selectedId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('sa_accessToken')}`
        }
      });
      console.log('Delete response status:', response.status);
      const data = await response.json();
      console.log('Delete data:', data);
      if (data.success) {
        setAdmins(admins.filter(a => a._id !== selectedId));
        alert(data.message || 'Administrator removed successfully!');
        setModalOpen(false);
      } else {
        alert(data.message || 'Failed to delete admin');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting admin');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && admins.length === 0) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div className="sa-page-header">
        <h2>Administrator Management</h2>
        <button className="sa-btn sa-btn-sm" style={{ width: 'auto' }} onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ New Admin'}
        </button>
      </div>

      {showAddForm && (
        <div className="sa-table-container" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h3>Add New Administrator</h3>
          <form onSubmit={handleCreateAdmin} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', alignItems: 'end' }}>
             <div className="sa-form-group" style={{ marginBottom: 0 }}>
               <label>Name</label>
               <input type="text" className="sa-input" value={newAdmin.name} onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} required placeholder="John Doe" autoComplete="name" />
             </div>
             <div className="sa-form-group" style={{ marginBottom: 0 }}>
               <label>Email</label>
               <input type="email" className="sa-input" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} required placeholder="email@example.com" autoComplete="email" />
             </div>
             <div className="sa-form-group" style={{ marginBottom: 0 }}>
               <label>Password</label>
               <input type="password" className="sa-input" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} required placeholder="********" autoComplete="new-password" />
             </div>
             <button type="submit" className="sa-btn">Create</button>
          </form>
        </div>
      )}

      {error && <div className="sa-badge sa-badge-danger" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div className="sa-table-container">
        <table className="sa-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin._id}>
                <td>{admin.firstName} {admin.lastName}</td>
                <td>{admin.email}</td>
                <td><span className="sa-badge sa-badge-admin">Admin</span></td>
                <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="sa-btn-sm sa-btn-danger sa-btn" style={{ width: 'auto' }} onClick={() => openDeleteModal(admin._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDeleteAdmin}
        title="Confirm Deletion"
        message="Are you sure you want to remove this administrator? This action is irreversible."
        isConfirming={isDeleting}
      />
    </div>
  );
};

export default AdminsList;
