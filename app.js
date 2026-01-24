const { motion, useMotionValue, useSpring, useTransform } = window.Motion;
const { useState, useEffect, useRef } = React;

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

// ═══════════════════════════════════════════════════════════════════════════
// Hidden Depth Background - Perspective Squares with Name
// ═══════════════════════════════════════════════════════════════════════════

const HiddenDepthBackground = ({ smoothX, smoothY }) => {
    const bgRef = useRef(null);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        // Activate after a short delay
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

    // Physics-based spring - Ultra responsive
    const springConfig = { damping: 35, stiffness: 800, restDelta: 0.001 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    const [isActive, setIsActive] = useState(false);

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

    // Feature cards data - No emojis, clean text
    const features = [
        {
            id: 1,
            title: "استماع ذكي",
            description: "فهم دقيق لأوامرك الصوتية"
        },
        {
            id: 2,
            title: "استجابة فورية",
            description: "ردود سريعة وذكية"
        },
        {
            id: 3,
            title: "تعلم مستمر",
            description: "يتحسن مع كل تفاعل"
        }
    ];

    return (
        <div className="container">
            {/* ─────────────────────────────────────────────────────────────
                Hidden Depth Background - Secret Ink Effect
                ───────────────────────────────────────────────────────────── */}
            <HiddenDepthBackground smoothX={smoothX} smoothY={smoothY} />

            {/* ─────────────────────────────────────────────────────────────
                Navigation
                ───────────────────────────────────────────────────────────── */}
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
                        <a href="index.html" className="nav-link active" aria-current="page">الرئيسية</a>
                        <a href="about.html" className="nav-link">حول</a>
                        <a href="demo.html" className="nav-link">تجربة</a>
                        {/* Settings link hidden temporarily */}
                    </motion.div>
                </div>
            </nav>

            {/* ─────────────────────────────────────────────────────────────
                Cursor Glow
                ───────────────────────────────────────────────────────────── */}
            <motion.div
                className="cursor-glow"
                style={{
                    x: smoothX,
                    y: smoothY,
                    translateX: "-50%",
                    translateY: "-50%"
                }}
            />

            {/* ─────────────────────────────────────────────────────────────
                Hero Section
                ───────────────────────────────────────────────────────────── */}
            <main className="hero">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                        duration: 1,
                        ease: [0.16, 1, 0.3, 1]
                    }}
                    className="assistant-wrapper"
                >
                    {/* ─────────────────────────────────────────────────────
                        The Orb - Liquid Intelligence
                        ───────────────────────────────────────────────────── */}
                    <motion.div
                        role="button"
                        tabIndex="0"
                        aria-label="تنشيط المساعد الصوتي"
                        className="voice-orb"
                        onClick={() => setIsActive(!isActive)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setIsActive(!isActive);
                            }
                        }}
                        style={{
                            cursor: 'pointer',
                            outline: 'none',
                            animationDuration: isActive ? '2s, 3s, 2s' : '8s, 6s, 4s'
                        }}
                        whileHover={{
                            scale: 1.08,
                            transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                        }}
                        whileTap={{ scale: 0.96 }}
                        whileFocus={{
                            boxShadow: "0 0 60px rgba(0, 245, 255, 0.7), 0 0 120px rgba(0, 245, 255, 0.4)"
                        }}
                    />

                    {/* ─────────────────────────────────────────────────────
                        Title - Staggered Reveal
                        ───────────────────────────────────────────────────── */}
                    <motion.h1
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0.3,
                            duration: 0.8,
                            ease: [0.16, 1, 0.3, 1]
                        }}
                    >
                        كيف يمكنني مساعدتك اليوم؟
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        الوكيل الصوتي الذكي الخاص بك
                    </motion.p>
                </motion.div>
            </main>

            {/* ─────────────────────────────────────────────────────────────
                Feature Cards
                ───────────────────────────────────────────────────────────── */}
            <motion.div
                className="features"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.7,
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1]
                }}
            >
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.id}
                        className="glass-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0.8 + index * 0.1,
                            duration: 0.6,
                            ease: [0.16, 1, 0.3, 1]
                        }}
                        whileHover={{
                            y: -8,
                            transition: { duration: 0.3 }
                        }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// Render
// ═══════════════════════════════════════════════════════════════════════════

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<VoiceAssistantUI />);
