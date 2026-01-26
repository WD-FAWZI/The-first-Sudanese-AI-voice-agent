import React, { useState, useEffect } from 'react';

const VoiceControls = ({ assistant, onUpdate }) => {
    const [stability, setStability] = useState(0.5);
    const [similarity, setSimilarity] = useState(0.75);

    useEffect(() => {
        if (assistant?.voice) {
            setStability(assistant.voice.stability || 0.5);
            setSimilarity(assistant.voice.similarityBoost || 0.75);
        }
    }, [assistant]);

    const handleSave = () => {
        onUpdate({
            voice: {
                ...assistant.voice,
                stability: parseFloat(stability),
                similarityBoost: parseFloat(similarity)
            }
        });
    };

    return (
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ marginTop: 0 }}>Voice Settings (11Labs)</h3>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Stability: {stability}</label>
                <input
                    type="range"
                    min="0" max="1" step="0.05"
                    value={stability}
                    onChange={(e) => setStability(e.target.value)}
                    style={{ width: '100%' }}
                />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Similarity Boost: {similarity}</label>
                <input
                    type="range"
                    min="0" max="1" step="0.05"
                    value={similarity}
                    onChange={(e) => setSimilarity(e.target.value)}
                    style={{ width: '100%' }}
                />
            </div>

            <button
                onClick={handleSave}
                style={{
                    background: '#0070f3',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    width: '100%'
                }}
            >
                Update Voice
            </button>
        </div>
    );
};

export default VoiceControls;
