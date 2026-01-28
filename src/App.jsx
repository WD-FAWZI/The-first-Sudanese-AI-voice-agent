import React from 'react';
import { Routes, Route } from 'react-router-dom';

// استيراد الصفحات
// استيراد الصفحات
import VoiceAssistantUI from './VoiceAssistantUI'; // الصفحة الرئيسية
import DemoPage from './Demo'; // صفحة التجربة
import AboutPage from './About'; // صفحة حول

function App() {
    return (
        <div className="app">
            {/* منطقة التبديل بين الصفحات */}
            <Routes>
                <Route path="/" element={<VoiceAssistantUI />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/demo" element={<DemoPage />} />

                {/* صفحة افتراضية لأي رابط خطأ */}
                <Route path="*" element={<VoiceAssistantUI />} />
            </Routes>
        </div>
    );
}

export default App;