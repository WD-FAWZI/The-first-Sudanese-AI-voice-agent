import React from 'react';

const CallLogs = ({ logs, onRefresh }) => {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Recent Call Logs</h3>
                <button
                    onClick={onRefresh}
                    style={{
                        background: 'transparent',
                        border: '1px solid #555',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Refresh
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {logs.length === 0 && <p style={{ color: 'white' }}>No calls found.</p>}

                {logs.map((call) => (
                    <div key={call.id} style={{
                        background: 'rgba(255,255,255,0.03)',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid #222'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'white', fontSize: '0.9rem' }}>
                            <span>{new Date(call.createdAt || call.startedAt).toLocaleString()}</span>
                            <span style={{
                                color: call.status === 'ended' ? '#4caf50' : '#ff9800',
                                textTransform: 'capitalize'
                            }}>
                                {call.status}
                            </span>
                        </div>

                        <div style={{ marginBottom: '0.5rem' }}>
                            <strong>Cost:</strong> ${call.cost?.toFixed(4) || '0.000'}
                        </div>

                        {call.endedReason && (
                            <div style={{ marginBottom: '0.5rem', color: call.endedReason.includes('error') ? '#ff4d4f' : 'white' }}>
                                <strong>Reason:</strong> {call.endedReason}
                            </div>
                        )}

                        {call.analysis?.summary && (
                            <div style={{ background: '#111', padding: '10px', borderRadius: '4px', fontSize: '0.9rem', color: 'white' }}>
                                <strong>Summary:</strong> {call.analysis.summary}
                            </div>
                        )}

                        <details style={{ marginTop: '0.5rem', cursor: 'pointer' }}>
                            <summary style={{ color: 'var(--nile-neon)', cursor: 'pointer' }}>View Transcript</summary>
                            <div style={{ marginTop: '1rem', maxHeight: '200px', overflowY: 'auto', background: '#000', padding: '10px', borderRadius: '4px' }}>
                                {call.transcript ? (
                                    <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.5' }}>{call.transcript}</p>
                                ) : (
                                    <p style={{ color: 'white' }}>No transcript available.</p>
                                )}
                            </div>
                        </details>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CallLogs;
