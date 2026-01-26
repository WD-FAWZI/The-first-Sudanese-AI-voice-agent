import React, { useState, useEffect } from 'react';

const ModelSelector = ({ assistant, onUpdate }) => {
    const [selectedModel, setSelectedModel] = useState('');

    useEffect(() => {
        if (assistant?.model?.model) {
            setSelectedModel(assistant.model.model);
        }
    }, [assistant]);

    const handleSave = () => {
        onUpdate({
            model: {
                ...assistant.model,
                model: selectedModel
            }
        });
    };

    const models = [
        { id: 'gpt-4o', name: 'GPT-4o' },
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
        { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
        { id: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo', name: 'Llama 3.1 405B' },
        { id: 'meta-llama/Meta-Llama-3-70b-Instruct', name: 'Llama 3 70B' },
    ];

    return (
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ marginTop: 0 }}>Model Selector</h3>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Current Model</label>
                <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        background: '#111',
                        color: 'white',
                        border: '1px solid #444',
                        borderRadius: '6px'
                    }}
                >
                    {models.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                </select>
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
                Change Model
            </button>
        </div>
    );
};

export default ModelSelector;
