import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';
import Button from '../components/common/Button';
import Modal from '../components/Modal';

const BillingDetails = () => {
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBillings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('sa_accessToken') || localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/api/billing/getallbillingdetails`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setBillings(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch billing details');
      }
    } catch (err) {
      setError('An error occurred while fetching billing details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillings();
  }, [refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const openDeleteModal = (id) => {
    setSelectedId(id);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem('sa_accessToken') || localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/api/billing/${selectedId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setBillings(billings.filter(b => b._id !== selectedId));
        setModalOpen(false);
      } else {
        alert(data.message || 'Failed to delete billing record');
      }
    } catch (err) {
      alert('Error deleting billing record');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && billings.length === 0) {
    return <div className="loading" style={{ padding: '2rem', textAlign: 'center' }}>Loading billing details...</div>;
  }

  if (error && billings.length === 0) {
    return <div className="error" style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger-color)' }}>{error}</div>;
  }

  return (
    <div className="billing-container">
      <div className="sa-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Billing Details</h2>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Button
            variant="glass"
            size="sm"
            onClick={handleRefresh}
            loading={loading && billings.length > 0}
            style={{ minWidth: '120px' }}
          >
             🔄 Refresh
          </Button>
        </div>
      </div>

      <div className="user-table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>Zip</th>
              <th>Country</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {billings.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                  No billing records found.
                </td>
              </tr>
            ) : (
              billings.map(bill => (
                <tr key={bill._id}>
                  <td style={{ fontWeight: '600' }}>
                    {bill.user
                      ? `${bill.user.firstName || ''} ${bill.user.lastName || ''}`.trim() || bill.fullName
                      : bill.fullName}
                  </td>
                  <td>{bill.email}</td>
                  <td>{bill.address}</td>
                  <td>{bill.city}</td>
                  <td>{bill.state}</td>
                  <td>{bill.zipCode}</td>
                  <td>{bill.country}</td>
                  <td>
                    <span
                      className="role-badge"
                      style={{
                        background: bill.paymentMethod === 'credit_card' ? '#dbeafe' : '#fef3c7',
                        color: bill.paymentMethod === 'credit_card' ? '#1d4ed8' : '#92400e',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}
                    >
                      {bill.paymentMethod ? bill.paymentMethod.replace('_', ' ') : 'N/A'}
                    </span>
                  </td>
                  <td>{new Date(bill.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="delete-btn" onClick={() => openDeleteModal(bill._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this billing record?"
        isConfirming={isDeleting}
      />
    </div>
  );
};

export default BillingDetails;
