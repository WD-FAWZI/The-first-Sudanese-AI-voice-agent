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
        Promise.all([fetchAssistant(), fetchLogs()]).finally(() => setLoading(false));
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
    if (error) return <div style={{ color: 'red', padding: '2rem' }}>Error: {error}</div>;

    return (
        <div style={{ padding: '2rem', color: 'white', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
                <h1>Admin Dashboard</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => setActiveTab('settings')}
                        style={{
                            padding: '10px 20px',
                            background: activeTab === 'settings' ? '#0070f3' : '#333',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        Settings
                    </button>
                    <button
                        onClick={() => { setActiveTab('logs'); fetchLogs(); }}
                        style={{
                            padding: '10px 20px',
                            background: activeTab === 'logs' ? '#0070f3' : '#333',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        Call Logs
                    </button>
                </div>
            </header>

            {activeTab === 'settings' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <PromptEditor assistant={assistant} onUpdate={handleUpdateAssistant} />
                    </div>
                    <VoiceControls assistant={assistant} onUpdate={handleUpdateAssistant} />
                    <ModelSelector assistant={assistant} onUpdate={handleUpdateAssistant} />
                </div>
            ) : (
                <CallLogs logs={logs} onRefresh={fetchLogs} />
            )}
        </div>
    );
};

export default AdminDashboard;
