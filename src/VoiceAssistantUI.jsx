import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Vapi from '@vapi-ai/web';
import { getRemoteMaintenanceStatus } from './maintenance';
import config from './config';
import VoiceBlob from './components/VoiceBlob';
import './styles.css';
import './pages.css';

// ═══════════════════════════════════════════════════════════════════════════
// SVG Icons
// ═══════════════════════════════════════════════════════════════════════════

const MicrophoneIcon = () => (
    <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// Hidden Depth Background
// ═══════════════════════════════════════════════════════════════════════════

const HiddenDepthBackground = ({ smoothX, smoothY }) => {
    const bgRef = useRef(null);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsActive(true), 500);
        return () => clearTimeout(timer);
    }, []);

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

    return (
        <div className={`hidden-depth-bg ${isActive ? 'active' : ''}`}>
            <div className="depth-content" ref={bgRef}>
                <div className="perspective-squares">
                    <div className="square"></div>
                    <div className="square"></div>
                    <div className="square"></div>
                    <div className="square"></div>
                    <div className="square"></div>
                    <div className="square"></div>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════════

function VoiceAssistantUI() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 35, stiffness: 800, restDelta: 0.001 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    const [isActive, setIsActive] = useState(false);
    const [vapi, setVapi] = useState(null);
    const [connectionError, setConnectionError] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [volume, setVolume] = useState(0);

    useEffect(() => {
        const handleMove = (e) => {
            const x = e.clientX || (e.touches && e.touches[0]?.clientX);
            const y = e.clientY || (e.touches && e.touches[0]?.clientY);

            if (x !== undefined && y !== undefined) {
                mouseX.set(x);
                mouseY.set(y);
            }
        };

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("touchmove", handleMove, { passive: true });

        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("touchmove", handleMove);
        };
    }, []);

    // Initialize Vapi
    useEffect(() => {
        const initVapi = () => {
            if (!config.publicKey) {
                console.error("Vapi Config Missing: Public Key is undefined.");
                setConnectionError("خطأ في الإعدادات: مفتاح API مفقود");
                return;
            }

            try {
                const vapiInstance = new Vapi(config.publicKey);
                setVapi(vapiInstance);
                setConnectionError(null); // Clear any previous errors

                vapiInstance.on('call-start', () => {
                    setIsActive(true);
                    setIsConnecting(false);
                });
                vapiInstance.on('volume-level', (v) => setVolume(v));
                vapiInstance.on('call-end', () => {
                    setIsActive(false);
                    setVolume(0);
                });
                vapiInstance.on('error', (e) => {
                    console.error("Vapi Error:", e);
                    setIsActive(false);
                    setIsConnecting(false);
                    // Handle specific error types if needed
                    if (e.error?.message?.includes('400')) {
                        // 400 Bad Request usually means invalid Assistant ID or Key
                        setConnectionError("خطأ في الاتصال: بيانات الاعتماد غير صحيحة");
                    } else {
                        setConnectionError("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
                    }
                });
                console.log("Vapi Initialized with Public Key ending in:", config.publicKey ? config.publicKey.slice(-4) : 'NONE');
            } catch (err) {
                console.error("Vapi Init Error:", err);
                setConnectionError("فشل تهيئة خدمة الصوت.");
            }
        };

        initVapi();
    }, []);

    const toggleCall = async () => {
        if (isConnecting) return;

        setIsConnecting(true); // نوضح للمستخدم أننا نتأكد من الحالة
        try {
            const maintenance = await getRemoteMaintenanceStatus();
            if (maintenance.active) {
                setConnectionError(maintenance.message);
                setIsConnecting(false);
                return;
            }
        } catch (e) {
            console.error("Maintenance check failed, proceeding with caution.");
        }

        if (!vapi) {
            console.warn("Voice service initializing...");
            setConnectionError("جاري تهيئة الخدمة الصوتية...");
            setIsConnecting(false);
            return;
        }

        if (!config.assistantId) {
            console.error("Missing ASSISTANT_ID in configuration");
            setConnectionError("لم يتم العثور على معرف المساعد");
            setIsConnecting(false);
            return;
        }

        if (isActive) {
            vapi.stop();
            setIsConnecting(false);
        } else {
            try {
                // Explicitly request microphone permission first
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                stream.getTracks().forEach(track => track.stop());

                console.log("Starting call with Assistant ID:", config.assistantId);
                await vapi.start(config.assistantId);
            } catch (e) {
                console.error("Call start error:", e);
                if (e.message?.includes('permission') || e.name === 'NotAllowedError') {
                    setConnectionError("يرجى السماح بالوصول للميكروفون للمتابعة");
                } else {
                    setConnectionError("حدث خطأ أثناء بدء المكالمة");
                }
                setIsConnecting(false);
            }
        }
    };

    const features = [
        { id: 1, title: "استماع ذكي", description: "فهم دقيق لأوامرك الصوتية" },
        { id: 2, title: "استجابة فورية", description: "ردود سريعة وذكية" },
        { id: 3, title: "تعلم مستمر", description: "يتحسن مع كل تفاعل" }
    ];

    return (
        <div className="container" data-testid="voice-assistant-container">
            {connectionError && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        position: 'fixed',
                        top: '20px',
                        left: '50%',
                        x: '-50%',
                        zIndex: 1000,
                        background: 'rgba(255, 77, 79, 0.9)',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        direction: 'rtl'
                    }}
                    data-testid="connection-error-banner"
                >
                    ⚠️ {connectionError}
                </motion.div>
            )}

            <HiddenDepthBackground smoothX={smoothX} smoothY={smoothY} />

            <nav className="navbar">
                <div className="nav-content">
                    <motion.div
                        className="logo"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        data-testid="app-logo"
                    >
                        <MicrophoneIcon />
                        <span>الوكيل الصوتي</span>
                    </motion.div>
                    <motion.div
                        className="nav-links"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Link to="/" className="nav-link active" data-testid="nav-home">الرئيسية</Link>
                        <Link to="/about" className="nav-link" data-testid="nav-about">حول</Link>
                        <Link to="/demo" className="nav-link" data-testid="nav-demo">تجربة</Link>
                    </motion.div>
                </div>
            </nav>

            <motion.div
                className="cursor-glow"
                style={{
                    x: smoothX,
                    y: smoothY,
                    translateX: "-50%",
                    translateY: "-50%"
                }}
                data-testid="cursor-glow"
            />

            <main className="hero">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="assistant-wrapper"
                >
                    <motion.div
                        className="voice-blob-wrapper"
                        style={{
                            outline: 'none',
                            width: '300px',
                            height: '300px',
                            position: 'relative',
                            cursor: 'pointer'
                        }}
                        data-testid="voice-orb"
                        onClick={toggleCall}
                        tabIndex={0}
                        role="button"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                toggleCall();
                            }
                        }}
                    >
                        <VoiceBlob volume={volume} isActive={isActive || isConnecting} />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        data-testid="hero-title"
                    >
                        {isActive ? "جاري الاستماع..." : (isConnecting ? "جاري الاتصال..." : "كيف يمكنني مساعدتك اليوم؟")}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        data-testid="hero-subtitle"
                    >
                        الوكيل الصوتي الذكي الخاص بك
                    </motion.p>
                </motion.div>
            </main>

            <motion.div
                className="features"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                data-testid="features-section"
            >
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.id}
                        className="glass-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ y: -8, transition: { duration: 0.3 } }}
                        whileTap={{ scale: 0.98 }}
                        data-testid={`feature-card-${feature.id}`}
                    >
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}

export default VoiceAssistantUI;
