import React, { useState } from 'react';
import './SuperAdmin.css';
import AdminsList from './AdminsList';
import UsersList from './UsersList';
import Stats from './Stats';
import AllPaymentHistory from './AllPaymentHistory';

const SuperAdminDashboard = ({ onLogout, user }) => {
  const [activeTab, setActiveTab] = useState('admins');

  const renderContent = () => {
    switch (activeTab) {
      case 'admins':
        return <AdminsList />;
      case 'users':
        return <UsersList />;
      case 'payments':
        return <AllPaymentHistory />;
      case 'stats':
        return <Stats />;
      default:
        return <AdminsList />;
    }
  };

  return (
    <div className="sa-container sa-dashboard">
      <aside className="sa-sidebar">
        <div className="sa-sidebar-header">
          <div className="sa-sidebar-logo">💎</div>
          <div className="sa-sidebar-title"><span className="nav-text">SuperAdmin</span></div>
        </div>

        <nav className="sa-nav">
          <div
            className={`sa-nav-item ${activeTab === 'admins' ? 'active' : ''}`}
            onClick={() => setActiveTab('admins')}
          >
            <span className="nav-icon">👥</span> <span className="nav-text">Admins</span>
          </div>
          <div
            className={`sa-nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span className="nav-icon">👤</span> <span className="nav-text">Users</span>
          </div>
          <div
            className={`sa-nav-item ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <span className="nav-icon">📊</span> <span className="nav-text">Statistics</span>
          </div>
          <div
            className={`sa-nav-item ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <span className="nav-icon">💳</span> <span className="nav-text">Payments</span>
          </div>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <div className="sa-nav-item" onClick={onLogout}>
            <span className="nav-icon">🚪</span> <span className="nav-text">Logout</span>
          </div>
        </div>
      </aside>

      <main className="sa-main">
        <header className="sa-main-header">
          <div className="admin-profile-pill">
            <div className="status-dot"></div>
            <span className="admin-name">
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : (user?.name || 'SuperAdmin')}
            </span>
          </div>
        </header>
        <div style={{ padding: '0 2rem' }}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
