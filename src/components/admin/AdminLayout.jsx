import React, { useState } from 'react';
import AdminDashboard from './AdminDashboard';

const AdminLayout = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Since we are client-side here, we can't *truly* verify the password securely
        // without hitting the backend. But we will use the backend verification
        // for every API call. This is just a simple gatekeeping UI.
        // We will store the password in memory to send with requests.
        if (password.length > 0) {
            setIsAuthenticated(true);
        } else {
            setError('Please enter a passcode');
        }
    };

    if (!isAuthenticated) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: '#0a0a0a',
                color: 'white',
                fontFamily: 'sans-serif'
            }}>
                <div style={{
                    padding: '2rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    width: '300px'
                }}>
                    <h2 style={{ marginTop: 0, textAlign: 'center' }}>Admin Access</h2>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Passcode"
                            style={{
                                padding: '10px',
                                borderRadius: '6px',
                                border: '1px solid #333',
                                background: '#111',
                                color: 'white'
                            }}
                        />
                        <button type="submit" style={{
                            padding: '10px',
                            background: '#0070f3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}>
                            Login
                        </button>
                        {error && <p style={{ color: '#ff4d4f', margin: 0, fontSize: '0.9rem' }}>{error}</p>}
                    </form>
                </div>
            </div>
        );
    }

    return <AdminDashboard adminPassword={password} />;
};

export default AdminLayout;
