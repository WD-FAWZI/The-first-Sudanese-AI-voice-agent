const { motion, useMotionValue, useSpring } = window.Motion;
const { useState, useEffect, useRef } = React;

// ═══════════════════════════════════════════════════════════════════════════
// Hidden Depth Background - Sound Waves with Center Symbol
// ═══════════════════════════════════════════════════════════════════════════

const HiddenWavesBackground = ({ smoothX, smoothY }) => {
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
                <div className="sound-waves">
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <span className="depth-symbol">◉</span>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// SVG Icons - Minimal Neon Style
// ═══════════════════════════════════════════════════════════════════════════

const MicrophoneIcon = () => (
    <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
);

const PlayIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
    </svg>
);

const PauseIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="10" y1="9" x2="10" y2="15" />
        <line x1="14" y1="9" x2="14" y2="15" />
    </svg>
);

const RefreshIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M23 4v6h-6" />
        <path d="M1 20v-6h6" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// Demo Page Component
// ═══════════════════════════════════════════════════════════════════════════

function DemoPage() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Physics-based spring - Ultra responsive
    const springConfig = { damping: 35, stiffness: 800, restDelta: 0.001 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    const [isListening, setIsListening] = useState(false);
    const [status, setStatus] = useState('جاهز للاستماع');
    const [transcript, setTranscript] = useState('');
    const [hasPermission, setHasPermission] = useState(null);

    const timeoutRef = useRef(null);

    // Track mouse and touch movement
    useEffect(() => {
        const handleMove = (e) => {
            // Support both mouse and touch
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

    const startListening = async () => {
        console.log('🎤 startListening called!');

        // Start UI immediately (don't wait for mic permission)
        setIsListening(true);
        setStatus('جاري الاستماع... (وضع التجربة)');
        console.log('🎤 UI updated immediately');

        // Try to get microphone in background (optional)
        let hasMic = false;
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                stream.getTracks().forEach(track => track.stop());
                hasMic = true;
                setHasPermission(true);
                setStatus('جاري الاستماع... تحدث الآن');
                console.log('🎤 Microphone enabled');
            }
        } catch (micError) {
            console.log('Microphone not available:', micError.message);
            setHasPermission(null);
        }

        // Show demo response after 3 seconds
        timeoutRef.current = setTimeout(() => {
            setTranscript('مرحباً! أنا الوكيل الصوتي الذكي. كيف يمكنني مساعدتك اليوم؟');
            setStatus('تم التعرف على الصوت بنجاح ✓');
            setIsListening(false);
            setHasPermission(true);
        }, 3000);
    };

    const stopListening = () => {
        setIsListening(false);
        setStatus('تم إيقاف الاستماع');
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const resetDemo = () => {
        setIsListening(false);
        setStatus('جاهز للاستماع');
        setTranscript('');
        setHasPermission(null);
    };

    return (
        <div className="page-container">
            {/* Hidden Depth Background - Secret Ink Effect */}
            <HiddenWavesBackground smoothX={smoothX} smoothY={smoothY} />

            {/* Cursor Glow */}
            <motion.div
                className="cursor-glow"
                style={{
                    x: smoothX,
                    y: smoothY,
                    translateX: "-50%",
                    translateY: "-50%"
                }}
            />

            {/* Navigation */}
            <nav className="navbar">
                <div className="nav-content">
                    <motion.div
                        className="logo"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
                        <a href="index.html" className="nav-link">الرئيسية</a>
                        <a href="about.html" className="nav-link">حول</a>
                        <a href="demo.html" className="nav-link active" aria-current="page">تجربة</a>
                        {/* Settings link hidden temporarily */}
                    </motion.div>
                </div>
            </nav>

            {/* Demo Container */}
            <div className="demo-container">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="assistant-wrapper"
                >
                    {/* Voice Orb */}
                    <motion.div
                        className="voice-orb"
                        style={{
                            animationDuration: isListening ? '2s, 3s, 1.5s' : '8s, 6s, 4s',
                            boxShadow: isListening
                                ? '0 0 50px rgba(0, 245, 255, 0.8), 0 0 100px rgba(0, 245, 255, 0.5), 0 0 150px rgba(0, 245, 255, 0.3)'
                                : '0 0 30px rgba(0, 245, 255, 0.6), 0 0 60px rgba(0, 245, 255, 0.3)'
                        }}
                    />

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                        جرب الوكيل الصوتي
                    </motion.h1>

                    {/* Tagline - Fixed promotional text */}
                    <motion.p
                        className="tagline"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        أوّل وكيل صوتي سوداني 🇸🇩
                    </motion.p>

                    {/* Status - Dynamic system messages */}
                    <motion.p
                        className={`status-text ${isListening ? 'active' : ''} ${hasPermission === false ? 'error' : ''}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        {status}
                    </motion.p>

                    {/* Transcript */}
                    {transcript && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card"
                            style={{ marginTop: '2rem', maxWidth: '500px' }}
                        >
                            <h3>النص المُعرف:</h3>
                            <p>{transcript}</p>
                        </motion.div>
                    )}

                    {/* Controls */}
                    <motion.div
                        className="demo-controls"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        {!isListening ? (
                            <motion.button
                                className="btn btn-primary"
                                onClick={startListening}
                                whileHover={{ scale: 1.05, y: -3 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <PlayIcon />
                                ابدأ الاستماع
                            </motion.button>
                        ) : (
                            <motion.button
                                className="btn btn-secondary"
                                onClick={stopListening}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <PauseIcon />
                                إيقاف
                            </motion.button>
                        )}

                        {transcript && (
                            <motion.button
                                className="btn btn-secondary"
                                onClick={resetDemo}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <RefreshIcon />
                                إعادة تعيين
                            </motion.button>
                        )}
                    </motion.div>

                    {/* Instructions */}
                    <motion.div
                        className="glass-card"
                        style={{ marginTop: '3rem', maxWidth: '600px' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        <h3 style={{ marginBottom: '1rem' }}>
                            كيفية الاستخدام:
                        </h3>
                        <ol style={{ textAlign: 'right', paddingRight: '1.5rem', lineHeight: '2' }}>
                            <li>اضغط على زر "ابدأ الاستماع"</li>
                            <li>اسمح بالوصول للميكروفون عند الطلب</li>
                            <li>تحدث بوضوح باللغة العربية أو الإنجليزية</li>
                            <li>سيظهر النص المُعرف تلقائياً</li>
                        </ol>
                    </motion.div>
                </motion.div>
            </div>

            {/* Footer */}
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

// ═══════════════════════════════════════════════════════════════════════════
// Render
// ═══════════════════════════════════════════════════════════════════════════

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<DemoPage />);
