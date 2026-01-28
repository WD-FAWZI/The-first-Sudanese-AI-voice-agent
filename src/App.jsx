import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import VoiceAssistantUI from './VoiceAssistantUI';
import AboutPage from './About';
import DemoPage from './Demo';
import AdminLayout from './components/admin/AdminLayout';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<VoiceAssistantUI />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/demo" element={<DemoPage />} />
                <Route path="/admin" element={<AdminLayout />} />
            </Routes>
        </Router>
    );
}

export default App;
