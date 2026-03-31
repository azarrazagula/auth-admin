import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';
import Button from '../components/common/Button';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [stats, setStats] = useState({ total: 0, revenue: 0, avg: 0 });

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken') || localStorage.getItem('sa_accessToken');
      const response = await fetch(`${API_BASE_URL}/api/payment/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        const fetchedPayments = data.data || [];
        setPayments(fetchedPayments);

        // Calculate basic stats for the dashboard
        const totalRev = fetchedPayments.reduce((acc, curr) => acc + (curr.amount || 0), 0);
        setStats({
          total: fetchedPayments.length,
          revenue: totalRev / 100,
          avg: fetchedPayments.length > 0 ? (totalRev / fetchedPayments.length / 100) : 0
        });
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Admin Payment Dashboard</h2>
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

      <div className="stats-cards-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div className="sa-card stat-card" style={{ padding: '1.5rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '20px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>TOTAL TRANSACTIONS</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', margin: '0.5rem 0' }}>{stats.total}</div>
          <div style={{ color: '#10b981', fontSize: '0.75rem' }}>↑ System Total</div>
        </div>
        <div className="sa-card stat-card" style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '20px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>TOTAL REVENUE</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', margin: '0.5rem 0', color: '#10b981' }}>₹{stats.revenue.toFixed(2)}</div>
          <div style={{ color: '#10b981', fontSize: '0.75rem' }}>+ All Currencies</div>
        </div>
        <div className="sa-card stat-card" style={{ padding: '1.5rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '20px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>AVERAGE ORDER</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', margin: '0.5rem 0' }}>₹{stats.avg.toFixed(2)}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Per Checkout</div>
        </div>
      </div>

      <div className="user-table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Order ID</th>
              <th>Payment ID</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                  No payment records found.
                </td>
              </tr>
            ) : (
              payments.map(payment => (
                <tr key={payment._id}>
                  <td>
                    {payment.userId ? (
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                          {payment.userId.firstName} {payment.userId.lastName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {payment.userId.email}
                        </div>
                      </div>
                    ) : (payment.user ? (
                      <div>
                        <div style={{ fontWeight: '600' }}>{payment.user.name || payment.user.firstName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{payment.user.email}</div>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Guest / Unknown</span>
                    ))}
                  </td>
                  <td style={{ fontWeight: '600', fontSize: '0.85rem' }}>{payment.razorpayOrderId}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{payment.razorpayPaymentId}</td>
                  <td style={{ fontWeight: '600' }}>
                    {payment.currency === 'INR' ? '₹' : payment.currency} {(payment.amount / 100).toFixed(2)}
                    {payment.description && (
                      <div style={{ fontSize: '0.7rem', fontWeight: 'normal', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                        {payment.description}
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{
                      background: '#f3e8ff',
                      color: '#7c3aed',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {payment.paymentMethod || 'Card'}
                    </span>
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
