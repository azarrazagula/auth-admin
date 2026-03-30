import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';

const AllPaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('sa_accessToken');
      const response = await fetch(`${API_BASE_URL}/api/payment/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setPayments(data.data || []);
        setTotalRevenue(data.totalRevenue || '');
      } else {
        setError(data.message || 'Failed to fetch all payment history');
      }
    } catch (err) {
      setError('An error occurred while fetching all payment history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading && payments.length === 0) {
    return <div className="loading" style={{ padding: '2rem', textAlign: 'center' }}>Loading payment history...</div>;
  }

  if (error && payments.length === 0) {
    return <div className="error" style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger-color)' }}>{error}</div>;
  }

  return (
    <div className="billing-container" style={{ padding: '2rem' }}>
      <div className="sa-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>All Payment History</h2>
          {totalRevenue && (
            <p style={{ color: 'var(--success-color)', fontWeight: '600', fontSize: '1.1rem' }}>
              Total Revenue: {totalRevenue}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            className="sa-btn primary"
            onClick={handleRefresh}
            disabled={loading}
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
          >
            {loading ? 'Refreshing...' : '🔄 Refresh' }
          </button>
        </div>
      </div>

      <div className="sa-card">
        <div className="user-table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Order / Payment ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                    No payment records found.
                  </td>
                </tr>
              ) : (
                payments.map(payment => (
                  <tr key={payment._id}>
                    <td>
                      {payment.user ? (
                        <div>
                          <div style={{ fontWeight: '500' }}>{payment.user.firstName} {payment.user.lastName}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{payment.user.email}</div>
                          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', background: '#3b82f6', color: 'white', display: 'inline-block', padding: '0.1rem 0.4rem', borderRadius: '4px', marginTop: '0.2rem' }}>{payment.user.role}</div>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Mismatched User Data</span>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{payment.razorpayOrderId}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{payment.razorpayPaymentId}</div>
                    </td>
                    <td style={{ fontWeight: '600' }}>
                      {payment.currency === 'INR' ? '₹' : payment.currency} {(payment.amount / 100).toFixed(2)}
                      <div style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{payment.description}</div>
                    </td>
                    <td>
                      <span
                        style={{
                          background: payment.status === 'paid' ? '#166534' : '#991b1b',
                          color: '#fff',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td>{new Date(payment.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllPaymentHistory;
