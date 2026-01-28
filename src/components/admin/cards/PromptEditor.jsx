import React, { useState, useEffect } from 'react';

const PromptEditor = ({ assistant, onUpdate }) => {
    const [prompt, setPrompt] = useState('');
    const [firstMessage, setFirstMessage] = useState('');

    useEffect(() => {
        if (assistant?.model?.messages) {
            const systemMessage = assistant.model.messages.find(m => m.role === 'system');
            if (systemMessage) setPrompt(systemMessage.content);
        } else if (assistant?.model?.systemPrompt) {
            setPrompt(assistant.model.systemPrompt);
        }

        if (assistant?.firstMessage) {
            setFirstMessage(assistant.firstMessage);
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

        onUpdate({
            model: updatedModel,
            firstMessage: firstMessage
        });
    };

    return (

        <div className="control-card">
            <h3>System Prompt</h3>
            <div className="form-group">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="textarea-dark"
                    style={{ height: '200px', resize: 'vertical' }}
                />
            </div>

            <h3>First Message</h3>
            <p className="form-label">The initial greeting the assistant says when the call starts.</p>
            <div className="form-group">
                <textarea
                    value={firstMessage}
                    onChange={(e) => setFirstMessage(e.target.value)}
                    className="textarea-dark"
                    style={{ height: '100px', resize: 'vertical' }}
                />
            </div>

            <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                <button
                    onClick={handleSave}
                    className="btn-admin btn-admin-save"
                >
                    SAVE PROMPT
                </button>
            </div>
        </div>
    );
};

export default PromptEditor;
