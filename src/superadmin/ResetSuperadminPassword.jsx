import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API_BASE_URL from '../config';
import './SuperAdmin.css';

const ResetSuperadminPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const emailParam = queryParams.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [location]);

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
            const response = await fetch(`${apiBase}/api/superadmin/reset-password-otp`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, otp, password })
            });

            const data = await response.json();

            if (response.ok || data.success) {
                setSuccess("Superadmin password updated successfully. Please log in.");
                setIsSubmitted(true);

                // Broadcast success to the original login tab
                const channel = new BroadcastChannel('auth_status');
                channel.postMessage({ type: 'PASSWORD_RESET_SUCCESS' });

                // Redirect back to login after 3 seconds
                setTimeout(() => {
                    navigate('/?portal=superadmin');
                }, 60000);
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
                {!isSubmitted && (
                    <div className="sa-header">
                        <div className="sa-logo">💎</div>
                        <h1>Reset SuperAdmin</h1>
                        <p>Create a strong new password for your master account.</p>
                    </div>
                )}

                {error && <div className="sa-badge sa-badge-danger" style={{ display: 'block', textAlign: 'center', marginBottom: '1rem', padding: '0.5rem' }}>{error}</div>}

                {success && (
                    <div className={isSubmitted ? "sa-success-card" : "sa-badge sa-badge-success"} style={!isSubmitted ? { display: 'block', textAlign: 'center', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#d4edda', color: '#155724' } : {}}>
                        {isSubmitted && <span className="success-icon">✅</span>}
                        {success}
                    </div>
                )}

                {!isSubmitted && (
                    <form onSubmit={handleResetPassword}>
                        <div className="sa-form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                className="sa-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="superadmin@example.com"
                                required
                                autoComplete="email"
                            />
                        </div>
                        <div className="sa-form-group">
                            <label>Verification OTP (6-digits)</label>
                            <input
                                type="text"
                                className="sa-input"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="123456"
                                required
                                maxLength="6"
                                autoComplete="one-time-code"
                            />
                        </div>
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
                )}


            </div>
        </div>
    );
};

export default ResetSuperadminPassword;
