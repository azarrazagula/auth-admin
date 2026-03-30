import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';
import Button from '../components/common/Button';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/api/payment/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setPayments(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch payment history');
      }
    } catch (err) {
      setError('An error occurred while fetching payment history');
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
    <div className="billing-container">
      <div className="sa-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Payment History</h2>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Button
            variant="glass"
            size="sm"
            onClick={handleRefresh}
            loading={loading && payments.length > 0}
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
              <th>Order ID</th>
              <th>Payment ID</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                  No payment records found.
                </td>
              </tr>
            ) : (
              payments.map(payment => (
                <tr key={payment._id}>
                  <td style={{ fontWeight: '600', fontSize: '0.85rem' }}>{payment.razorpayOrderId}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{payment.razorpayPaymentId}</td>
                  <td>{payment.description}</td>
                  <td style={{ fontWeight: '600' }}>
                    {payment.currency === 'INR' ? '₹' : payment.currency} {(payment.amount / 100).toFixed(2)}
                  </td>
                  <td>
                    <span
                      className="role-badge"
                      style={{
                        background: payment.status === 'paid' ? '#dcfce7' : '#fee2e2',
                        color: payment.status === 'paid' ? '#166534' : '#991b1b',
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
  );
};

export default PaymentHistory;
