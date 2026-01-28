import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import Vapi from '@vapi-ai/web';
import { getRemoteMaintenanceStatus } from './maintenance';
import config from './config';
import VoiceBlob from './components/VoiceBlob';
import './styles.css';
import './pages.css';

// ... (بقية مكونات الخلفية والأيقونات كما هي بدون تغيير) ...

const HiddenWavesBackground = ({ smoothX, smoothY }) => {
    const bgRef = useRef(null);
    const [isActive, setIsActive] = useState(false);
    useEffect(() => { const timer = setTimeout(() => setIsActive(true), 500); return () => clearTimeout(timer); }, []);
    useEffect(() => {
        const updateMask = () => {
            if (bgRef.current) {
                const x = smoothX.get();
                const y = smoothY.get();
                bgRef.current.style.setProperty('--mouse-x', `${x}px`);
                bgRef.current.style.setProperty('--mouse-y', `${y}px`);
            }
            requestAnimationFrame(updateMask);
        };
        const frameId = requestAnimationFrame(updateMask);
        return () => cancelAnimationFrame(frameId);
    }, [smoothX, smoothY]);
    return (<div className={`hidden-depth-bg ${isActive ? 'active' : ''}`}> <div className="depth-content" ref={bgRef}> <div className="sound-waves"> <div className="wave"></div> <div className="wave"></div> <div className="wave"></div> <div className="wave"></div> <div className="wave"></div> <div className="wave"></div> <span className="depth-symbol">◉</span> </div> </div> </div>);
};

const MicrophoneIcon = () => (<svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"> <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /> <path d="M19 10v2a7 7 0 0 1-14 0v-2" /> <line x1="12" y1="19" x2="12" y2="23" /> <line x1="8" y1="23" x2="16" y2="23" /> </svg>);
const PhoneIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path> </svg>);
const PhoneOffIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path> <line x1="23" y1="1" x2="1" y2="23"></line> </svg>);

function DemoPage() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 35, stiffness: 800, restDelta: 0.001 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);
    const [vapi, setVapi] = useState(null);
    const [status, setStatus] = useState('جاهز للاتصال');
    const [callState, setCallState] = useState('idle');
    const [transcript, setTranscript] = useState('');
    const [hasPermission, setHasPermission] = useState(null);
    const [volume, setVolume] = useState(0);

    useEffect(() => {
        const handleMove = (e) => {
            const x = e.clientX || (e.touches && e.touches[0]?.clientX);
            const y = e.clientY || (e.touches && e.touches[0]?.clientY);
            if (x !== undefined && y !== undefined) { mouseX.set(x); mouseY.set(y); }
        };
        window.addEventListener("mousemove", handleMove);
        window.addEventListener("touchmove", handleMove, { passive: true });
        return () => { window.removeEventListener("mousemove", handleMove); window.removeEventListener("touchmove", handleMove); };
    }, []);

    useEffect(() => {
        const initVapi = () => {
            if (!config.publicKey) { setStatus("خطأ في الإعدادات: مفتاح API مفقود"); return; }
            try {
                const vapiInstance = new Vapi(config.publicKey);
                setVapi(vapiInstance);
                vapiInstance.on('call-start', () => { setCallState('active'); setStatus('المكالمة جارية'); setHasPermission(true); });
                vapiInstance.on('call-end', () => { setCallState('idle'); setStatus('تم إنهاء المكالمة'); setVolume(0); setTimeout(() => setStatus('جاهز للاتصال'), 2000); });
                vapiInstance.on('volume-level', (v) => { setVolume(v); });
                vapiInstance.on('message', (message) => { if (message.type === 'transcript' && message.transcriptType === 'final') { setTranscript(message.transcript); } });
                vapiInstance.on('error', (e) => { setCallState('idle'); setVolume(0); setStatus('حدث خطأ في الاتصال'); });
                return true;
            } catch (err) { setStatus('فشل تهيئة الخدمة'); return false; }
        };
        initVapi();
    }, []);

    const toggleCall = async () => {
        // ... (نفس منطق الاتصال) ...
        const originalStatus = status;
        setStatus('جاري التحقق من الحالة...');
        try { const maintenance = await getRemoteMaintenanceStatus(); if (maintenance.active) { setStatus(maintenance.message); return; } } catch (e) { }
        setStatus(originalStatus);
        if (!vapi) { setStatus("خطأ في تهيئة الخدمة الصوتية"); return; }
        if (callState === 'active') { vapi.stop(); setStatus('جاري إنهاء المكالمة...'); } else {
            if (!config.assistantId) { setStatus("خطأ في معرف المساعد"); return; }
            try { const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); stream.getTracks().forEach(track => track.stop()); setCallState('connecting'); setStatus('جاري الاتصال...'); vapi.start(config.assistantId); } catch (err) { setStatus("يرجى السماح بالوصول للميكروفون"); }
        }
    };

    return (
        <div className="page-container">
            <HiddenWavesBackground smoothX={smoothX} smoothY={smoothY} />
            <motion.div className="cursor-glow" style={{ x: smoothX, y: smoothY, translateX: "-50%", translateY: "-50%" }} />

            <nav className="navbar">
                <div className="nav-content">
                    <motion.div className="logo" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                        <MicrophoneIcon />
                        <span>الوكيل الصوتي</span>
                    </motion.div>
                    <motion.div className="nav-links" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                        <Link to="/" className="nav-link">الرئيسية</Link>
                        <Link to="/about" className="nav-link">حول</Link>
                        <Link to="/demo" className="nav-link active">تجربة</Link>
                    </motion.div>
                </div>
            </nav>

            <div className="demo-container">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="assistant-wrapper">
                    <div style={{ width: '350px', height: '350px', position: 'relative', margin: '0 auto', marginBottom: '2rem' }}>
                        <VoiceBlob volume={volume} isActive={callState === 'active' || callState === 'connecting'} />
                    </div>

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>جرب الوكيل الصوتي</motion.h1>
                    <motion.p className="tagline" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>أوّل وكيل صوتي سوداني 🇸🇩</motion.p>
                    <motion.p className={`status-text ${callState === 'active' ? 'active' : ''} ${hasPermission === false ? 'error' : ''}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>{status}</motion.p>

                    {transcript && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ marginTop: '2rem', maxWidth: '500px' }}>
                            <h3>النص المُعرف:</h3>
                            <p>{transcript}</p>
                        </motion.div>
                    )}

                    <motion.div className="demo-controls" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} style={{ display: 'flex', justifyContent: 'center' }}>
                        <motion.button className={`btn ${callState === 'active' ? 'btn-secondary' : 'btn-primary'}`} onClick={toggleCall} onTouchEnd={(e) => { e.preventDefault(); toggleCall(); }} whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }} disabled={callState === 'connecting' || !vapi} style={{ opacity: (callState === 'connecting' || !vapi) ? 0.7 : 1, minWidth: '200px' }}>
                            {callState === 'active' ? (<><PhoneOffIcon /> إنهاء المكالمة</>) : (<><PhoneIcon /> {callState === 'connecting' ? 'جاري الاتصال...' : 'اتصال مباشر'}</>)}
                        </motion.button>
                    </motion.div>

                    <motion.div className="glass-card" style={{ marginTop: '3rem', maxWidth: '600px' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                        <h3 style={{ marginBottom: '1rem' }}>كيفية الاستخدام:</h3>
                        <ol style={{ textAlign: 'right', paddingRight: '1.5rem', lineHeight: '2' }}>
                            <li>اضغط على زر "اتصال مباشر" لبدء المكالمة</li>
                            <li>اسمح بالوصول للميكروفون عند الطلب</li>
                            <li>تحدث بوضوح مع الوكيل الصوتي</li>
                            <li>اضغط على "إنهاء المكالمة" عند الانتهاء</li>
                        </ol>
                    </motion.div>
                </motion.div>
            </div>

            <footer className="footer">
                <div className="footer-content">
                    <p>© 2026 الوكيل الصوتي الذكي - جميع الحقوق محفوظة</p>
                    <div className="footer-links">
                        <a href="#privacy">الخصوصية</a>
                        <a href="#terms">الشروط</a>
                        <a href="#contact">اتصل بنا</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default DemoPage;