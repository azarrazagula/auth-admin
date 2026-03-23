import React, { useState, useEffect } from "react";
import Users from "./components/Users";
import Loginform from "./components/Loginform";
import SuperAdminLogin from "./superadmin/SuperAdminLogin";
import SuperAdminDashboard from "./superadmin/SuperAdminDashboard";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isSuperPortal, setIsSuperPortal] = useState(false);

  // Check for portal mode and existing tokens on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const portal = urlParams.get('portal');
    setIsSuperPortal(portal === 'superadmin');

    const saToken = localStorage.getItem('sa_accessToken');
    if (saToken) {
      setIsSuperAdmin(true);
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
  };

  const handleSuperLogin = (user) => {
    setIsSuperAdmin(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
  };

  const handleSuperLogout = () => {
    localStorage.removeItem('sa_accessToken');
    setIsSuperAdmin(false);
    // Redirect back to main login? 
    // window.location.search = '';
  };

  // Rendering logic
  if (isSuperAdmin) {
    return <SuperAdminDashboard onLogout={handleSuperLogout} />;
  }

  if (isSuperPortal) {
    return <SuperAdminLogin onLogin={handleSuperLogin} />;
  }

  return (
    <div className="App">
      {isAuthenticated ? (
        <Users onLogout={handleLogout} />
      ) : (
        <Loginform onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
