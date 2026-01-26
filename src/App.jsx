import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import VoiceAssistantUI from './VoiceAssistantUI';
import AdminLayout from './components/admin/AdminLayout';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<VoiceAssistantUI />} />
                <Route path="/admin" element={<AdminLayout />} />
            </Routes>
        </Router>
    );
}

export default App;
