import React, { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import './admin.css';

const AdminLayout = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple internal check
        if (password.length > 0) {
            setIsAuthenticated(true);
        } else {
            setError('Please enter a passcode');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="login-overlay">
                <div className="login-card">
                    <h2 style={{ color: 'var(--nubian-gold)', marginBottom: '1.5rem', fontSize: '1.8rem' }}>ACCESS CONTROL</h2>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Security Code"
                            className="input-dark"
                            style={{ textAlign: 'center', letterSpacing: '0.2rem', fontSize: '1.2rem' }}
                        />
                        <button type="submit" className="btn-admin btn-admin-save" style={{ width: '100%', padding: '12px' }}>
                            AUTHENTICATE
                        </button>
                        {error && <p style={{ color: '#ff4d4f', margin: 0, fontSize: '0.9rem' }}>{error}</p>}
                    </form>
                </div>
            </div>
        );
    }

    return <div className="admin-wrapper"><AdminDashboard adminPassword={password} /></div>;
};

export default AdminLayout;
