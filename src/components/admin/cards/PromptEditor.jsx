import React, { useState, useEffect } from 'react';

const PromptEditor = ({ assistant, onUpdate }) => {
    const [prompt, setPrompt] = useState('');

    useEffect(() => {
        if (assistant?.model?.messages) {
            const systemMessage = assistant.model.messages.find(m => m.role === 'system');
            if (systemMessage) setPrompt(systemMessage.content);
        } else if (assistant?.model?.systemPrompt) {
            // Fallback for some Vapi models
            setPrompt(assistant.model.systemPrompt);
        }
    }, [assistant]);

    const handleSave = () => {
        // Vapi expects the 'model' object to be updated. 
        // We need to preserve other messages if they exist, but usually it's just system.
        const updatedModel = { ...assistant.model };

        // If messages array exists, update the system message
        if (updatedModel.messages) {
            updatedModel.messages = updatedModel.messages.map(m =>
                m.role === 'system' ? { ...m, content: prompt } : m
            );
            // If no system message found, add it? (Unlikely for Vapi)
        } else {
            // Fallback structure
            updatedModel.systemPrompt = prompt;
        }

        onUpdate({ model: updatedModel });
    };

    return (
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ marginTop: 0 }}>System Prompt</h3>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                style={{
                    width: '100%',
                    height: '200px',
                    background: '#111',
                    color: '#eee',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    padding: '1rem',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    marginBottom: '1rem',
                    resize: 'vertical'
                }}
            />
            <button
                onClick={handleSave}
                style={{
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    float: 'right'
                }}
            >
                Save Prompt
            </button>
            <div style={{ clear: 'both' }}></div>
        </div>
    );
};

export default PromptEditor;
