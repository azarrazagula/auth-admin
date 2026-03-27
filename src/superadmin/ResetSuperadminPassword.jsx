import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import './SuperAdmin.css';

const ResetSuperadminPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const apiBase = API_BASE_URL;
            // 4. The Final Submission
            const response = await fetch(`${apiBase}/api/superadmin/reset-password/${token}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password }) // Send the password!
            });

            const data = await response.json();

            if (response.ok || data.success) {
                setSuccess(data.message || "Password Reset Successfully!");
                setTimeout(() => {
                    navigate('/?portal=superadmin');
                }, 3000);
            } else {
                setError(data.message || 'Failed to reset password');
            }
        } catch (err) {
            setError('Connection error. Is the server running?');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="sa-container sa-login-page">
            <div className="sa-login-card">
                <div className="sa-header">
                    <div className="sa-logo">💎</div>
                    <h1>Reset SuperAdmin</h1>
                    <p>Create a strong new password for your master account.</p>
                </div>

                {error && <div className="sa-badge sa-badge-danger" style={{ display: 'block', textAlign: 'center', marginBottom: '1rem', padding: '0.5rem' }}>{error}</div>}
                {success && <div className="sa-badge sa-badge-success" style={{ display: 'block', textAlign: 'center', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#d4edda', color: '#155724' }}>{success}</div>}

                <form onSubmit={handleResetPassword}>
                    <div className="sa-form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            className="sa-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <div className="sa-form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            className="sa-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="********"
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <button type="submit" className="sa-btn" disabled={loading}>
                        {loading ? 'Resetting...' : 'Update Password'}
                    </button>
                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <button 
                            type="button" 
                            onClick={() => navigate('/?portal=superadmin')} 
                            className="sa-nav-item" 
                            style={{ fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            Back to Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetSuperadminPassword;
