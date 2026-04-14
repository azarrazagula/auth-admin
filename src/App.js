import React, { useState, useEffect } from "react";
import Users from "./admin/Users";
import Loginform from "./admin/Loginform";
import SuperAdminLogin from "./superadmin/SuperAdminLogin";
import SuperAdminDashboard from "./superadmin/SuperAdminDashboard";
import ResetSuperadminPassword from "./superadmin/ResetSuperadminPassword";
import ResetUserPassword from "./components/ResetUserPassword";
import { Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isSuperPortal, setIsSuperPortal] = useState(false);

  // Check for portal mode and existing tokens on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const portal = urlParams.get('portal');
    const isSuperPath = window.location.pathname.startsWith('/superadmin');
    setIsSuperPortal(portal === 'superadmin' || isSuperPath);

    const saToken = localStorage.getItem('sa_accessToken');
    if (saToken && saToken !== 'undefined') {
      setIsSuperAdmin(true);
      return;
    }

    const token = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');
    if (token) {
      setIsAuthenticated(true);
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Error parsing saved user", e);
        }
      }
    }
  }, []);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  };

  const handleSuperLogin = (user) => {
    setIsSuperAdmin(true);
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleSuperLogout = () => {
    localStorage.removeItem('sa_accessToken');
    localStorage.removeItem('user');
    setIsSuperAdmin(false);
    setCurrentUser(null);
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/superadmin/reset-password/:token" element={<ResetSuperadminPassword />} />
        <Route path="/reset-password/:token" element={<ResetUserPassword />} />
        <Route path="*" element={
          isSuperAdmin ? (
            <SuperAdminDashboard onLogout={handleSuperLogout} user={currentUser} />
          ) : isSuperPortal ? (
            <SuperAdminLogin onLogin={handleSuperLogin} />
          ) : isAuthenticated ? (
            <Users onLogout={handleLogout} user={currentUser} />
          ) : (
            <Loginform onLogin={handleLogin} />
          )
        } />
      </Routes>
    </div>
  );
}

export default App;
