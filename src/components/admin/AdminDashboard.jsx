import React, { useState, useEffect } from 'react';
import PromptEditor from './cards/PromptEditor';
import VoiceControls from './cards/VoiceControls';
import ModelSelector from './cards/ModelSelector';
import CallLogs from './cards/CallLogs';

const AdminDashboard = ({ adminPassword }) => {
    const [assistant, setAssistant] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('settings'); // 'settings' or 'logs'

    // Micro-interaction for refresh
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchAssistant = async () => {
        try {
            const res = await fetch('/api/vapi-proxy?type=assistant', {
                headers: { 'x-admin-password': adminPassword }
            });
            if (!res.ok) throw new Error('Failed to fetch assistant');
            const data = await res.json();
            setAssistant(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchLogs = async () => {
        try {
            const res = await fetch('/api/vapi-proxy?type=calls&limit=20', {
                headers: { 'x-admin-password': adminPassword }
            });
            if (!res.ok) throw new Error('Failed to fetch logs');
            const data = await res.json();
            setLogs(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        setIsRefreshing(true);
        Promise.all([fetchAssistant(), fetchLogs()]).finally(() => {
            setLoading(false);
            setTimeout(() => setIsRefreshing(false), 500);
        });
    }, [adminPassword]);

    const handleUpdateAssistant = async (updates) => {
        try {
            setLoading(true);
            const res = await fetch('/api/vapi-proxy?type=assistant', {
                method: 'PATCH',
                headers: {
                    'x-admin-password': adminPassword,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });
            if (!res.ok) throw new Error('Failed to update');
            const data = await res.json();
            setAssistant(data);
            alert('Settings updated successfully!');
        } catch (err) {
            alert('Error updating settings: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !assistant) return <div style={{ color: 'white', padding: '2rem' }}>Loading...</div>;
    if (error) return <div style={{ color: '#ff4d4f', padding: '2rem' }}>Error: {error}</div>;

    return (
        <div className="admin-container">
            <header className="admin-header">
                <div>
                    <h1>CONTROL CENTER</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>STATUS: {loading ? 'SYNCING...' : 'ONLINE'}</p>
                </div>
                <div className="admin-tabs">
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
                    >
                        SETTINGS
                    </button>
                    <button
                        onClick={() => { setActiveTab('logs'); fetchLogs(); }}
                        className={`admin-tab ${activeTab === 'logs' ? 'active' : ''}`}
                    >
                        LOGS
                    </button>
                </div>
            </header>

            {activeTab === 'settings' ? (
                <div className="control-panel-grid">
                    <div className="full-width">
                        <PromptEditor assistant={assistant} onUpdate={handleUpdateAssistant} />
                    </div>
                    <div className="half-width">
                        <VoiceControls assistant={assistant} onUpdate={handleUpdateAssistant} />
                    </div>
                    <div className="half-width">
                        <ModelSelector assistant={assistant} onUpdate={handleUpdateAssistant} />
                    </div>
                </div>
            ) : (
                <CallLogs logs={logs} onRefresh={fetchLogs} />
            )}
        </div>
    );
};

export default AdminDashboard;
