const { motion, useMotionValue, useSpring } = window.Motion;
const { useState, useEffect, useRef } = React;

// ═══════════════════════════════════════════════════════════════════════════
// Hidden Depth Background - Concentric Circles with Infinity Symbol
// ═══════════════════════════════════════════════════════════════════════════

const HiddenCirclesBackground = ({ smoothX, smoothY }) => {
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
                <div className="concentric-circles">
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <span className="depth-signature">~ Mohamed Fawzi ;)</span>
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

// Feature Icons - Clean geometric style
const VoiceIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    </svg>
);

const BrainIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 .48 4.96 2.5 2.5 0 0 0 3.5 3.5 2.5 2.5 0 0 0 4.96.46 2.5 2.5 0 0 0 1.98-3 2.5 2.5 0 0 0-.48-4.96 2.5 2.5 0 0 0-3.5-3.5Z" />
        <path d="M12 9v6" />
        <path d="m9 12 6 0" />
    </svg>
);

const BoltIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);

const GlobeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
    </svg>
);

const ShieldIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

const DevicesIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect width="14" height="10" x="5" y="2" rx="2" />
        <rect width="7" height="5" x="12" y="14" rx="1" />
        <path d="M2 12h5" />
        <path d="M2 16h3" />
        <path d="M2 20h7" />
    </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// About Page Component
// ═══════════════════════════════════════════════════════════════════════════

function AboutPage() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Physics-based spring - Ultra responsive
    const springConfig = { damping: 35, stiffness: 800, restDelta: 0.001 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

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

    const features = [
        {
            id: 1,
            icon: <VoiceIcon />,
            title: "التعرف على الصوت",
            description: "تقنية متقدمة للتعرف على الأوامر الصوتية بدقة عالية"
        },
        {
            id: 2,
            icon: <BrainIcon />,
            title: "الذكاء الاصطناعي",
            description: "يستخدم نماذج ذكاء اصطناعي متطورة لفهم السياق"
        },
        {
            id: 3,
            icon: <BoltIcon />,
            title: "استجابة فورية",
            description: "معالجة سريعة وردود في أقل من ثانية"
        },
        {
            id: 4,
            icon: <GlobeIcon />,
            title: "متعدد اللغات",
            description: "دعم للعربية والإنجليزية والعديد من اللغات"
        },
        {
            id: 5,
            icon: <ShieldIcon />,
            title: "آمن وخاص",
            description: "حماية كاملة لبياناتك وخصوصيتك"
        },
        {
            id: 6,
            icon: <DevicesIcon />,
            title: "متعدد المنصات",
            description: "يعمل على الويب، الموبايل، والأجهزة الذكية"
        }
    ];

    const stats = [
        { number: "99.9%", label: "دقة التعرف" },
        { number: "<0.5s", label: "وقت الاستجابة" },
        { number: "24/7", label: "متاح دائماً" },
        { number: "50+", label: "لغة مدعومة" }
    ];

    return (
        <div className="page-container">
            {/* Hidden Depth Background - Secret Ink Effect */}
            <HiddenCirclesBackground smoothX={smoothX} smoothY={smoothY} />

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
                        <a href="about.html" className="nav-link active">حول</a>
                        <a href="demo.html" className="nav-link">تجربة</a>
                    </motion.div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="about-hero">
                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h1>مستقبل التفاعل الصوتي</h1>
                    <p>تقنية ذكاء اصطناعي متطورة تفهمك وتساعدك في كل ما تحتاجه</p>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="stat-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                delay: index * 0.1,
                                duration: 0.5,
                                ease: [0.16, 1, 0.3, 1]
                            }}
                            whileHover={{
                                y: -5,
                                transition: { duration: 0.3 }
                            }}
                        >
                            <div className="stat-number">{stat.number}</div>
                            <div className="stat-label">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    المميزات الرئيسية
                </motion.h2>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.id}
                            className="feature-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: 0.4 + index * 0.08,
                                duration: 0.6,
                                ease: [0.16, 1, 0.3, 1]
                            }}
                            whileHover={{
                                y: -8,
                                transition: { duration: 0.3 }
                            }}
                        >
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Technology Section */}
            <section className="tech-section">
                <motion.div
                    className="tech-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <h2>التقنيات المستخدمة</h2>
                    <div className="tech-stack">
                        <div className="tech-item">
                            <motion.span
                                className="tech-badge"
                                whileHover={{ y: -3 }}
                            >
                                React
                            </motion.span>
                            <motion.span
                                className="tech-badge"
                                whileHover={{ y: -3 }}
                            >
                                Framer Motion
                            </motion.span>
                            <motion.span
                                className="tech-badge"
                                whileHover={{ y: -3 }}
                            >
                                Web Speech API
                            </motion.span>
                            <motion.span
                                className="tech-badge"
                                whileHover={{ y: -3 }}
                            >
                                AI/ML Models
                            </motion.span>
                            <motion.span
                                className="tech-badge"
                                whileHover={{ y: -3 }}
                            >
                                WebGL
                            </motion.span>
                            <motion.span
                                className="tech-badge"
                                whileHover={{ y: -3 }}
                            >
                                Progressive Web App
                            </motion.span>
                        </div>
                    </div>
                </motion.div>
            </section>

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
root.render(<AboutPage />);
