/**
 * VAPI Keys Settings Page
 * Secure key management interface with anti-copy protection
 */

const { useState, useEffect, useCallback } = React;
const { motion, AnimatePresence } = Motion;

// ==========================================
// Anti-Copy Protection
// ==========================================
const disableCopyPaste = () => {
    // Disable right-click context menu on sensitive areas
    document.addEventListener('contextmenu', (e) => {
        if (e.target.closest('.no-select')) {
            e.preventDefault();
        }
    });

    // Disable copy keyboard shortcuts on sensitive areas
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
            const selection = window.getSelection();
            const selectedText = selection.toString();
            if (selectedText && document.querySelector('.no-select:hover')) {
                e.preventDefault();
            }
        }
    });

    // Clear clipboard if sensitive content is copied
    document.addEventListener('copy', (e) => {
        if (e.target.closest('.no-select')) {
            e.preventDefault();
            e.clipboardData.setData('text/plain', '*** Protected Content ***');
        }
    });
};

// ==========================================
// Toast Component
// ==========================================
const Toast = ({ message, type, show }) => {
    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ'
    };

    return (
        <div className={`toast ${type} ${show ? 'show' : ''}`}>
            <span className="toast-icon">{icons[type]}</span>
            <span className="toast-message">{message}</span>
        </div>
    );
};

// ==========================================
// Delete Confirmation Modal
// ==========================================
const DeleteModal = ({ show, keyName, onConfirm, onCancel }) => {
    return (
        <div className={`modal-overlay ${show ? 'show' : ''}`} onClick={onCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-icon">⚠️</div>
                <h3 className="modal-title">تأكيد الحذف</h3>
                <p className="modal-text">
                    هل أنت متأكد من حذف المفتاح <strong>"{keyName}"</strong>؟
                    <br />
                    لا يمكن التراجع عن هذا الإجراء.
                </p>
                <div className="modal-actions">
                    <button className="modal-btn cancel" onClick={onCancel}>
                        إلغاء
                    </button>
                    <button className="modal-btn confirm" onClick={onConfirm}>
                        حذف
                    </button>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// Key Card Component
// ==========================================
const KeyCard = ({ keyData, onUse, onDelete }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'لم يستخدم بعد';
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <motion.div
            className="key-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
        >
            <div className="key-card-header">
                <div className="key-name">
                    <span>🔑</span>
                    {keyData.name}
                </div>
                <div className="key-status">
                    <span className="key-status-dot"></span>
                    آمن
                </div>
            </div>

            <div className="key-info no-select">
                <div className="key-info-item">
                    <span className="key-info-label">المفتاح العام</span>
                    <span className="key-info-value key-display masked">{keyData.publicKeyPreview}</span>
                </div>
                <div className="key-info-item">
                    <span className="key-info-label">المفتاح الخاص</span>
                    <span className="key-info-value key-display masked">{keyData.privateKeyPreview}</span>
                </div>
            </div>

            <div className="key-card-footer">
                <div className="key-meta">
                    <span>🕐 آخر استخدام: {formatDate(keyData.lastUsed)}</span>
                </div>
                <div className="key-actions">
                    <button className="action-btn use-btn" onClick={() => onUse(keyData.id)}>
                        <span>▶</span>
                        استخدام
                    </button>
                    <button className="action-btn delete-btn" onClick={() => onDelete(keyData)}>
                        <span>🗑</span>
                        حذف
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// ==========================================
// Add Key Form Component
// ==========================================
const AddKeyForm = ({ onSave, loading }) => {
    const [name, setName] = useState('');
    const [publicKey, setPublicKey] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [showPublic, setShowPublic] = useState(false);
    const [showPrivate, setShowPrivate] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !publicKey || !privateKey) return;

        await onSave({ name, publicKey, privateKey });
        setName('');
        setPublicKey('');
        setPrivateKey('');
    };

    const isValid = name.trim() && publicKey.trim() && privateKey.trim();

    return (
        <form className="add-key-section" onSubmit={handleSubmit}>
            <h2 className="section-title">
                <span>➕</span>
                إضافة مفتاح جديد
            </h2>

            <div className="form-group">
                <label className="form-label" htmlFor="key-name">
                    اسم المفتاح
                </label>
                <input
                    id="key-name"
                    type="text"
                    className="form-input"
                    placeholder="مثال: مفتاح الإنتاج"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    autoComplete="off"
                />
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="public-key">
                    المفتاح العام (Public Key)
                </label>
                <div className="password-wrapper">
                    <input
                        id="public-key"
                        type={showPublic ? 'text' : 'password'}
                        className="form-input key-input"
                        placeholder="أدخل المفتاح العام..."
                        value={publicKey}
                        onChange={(e) => setPublicKey(e.target.value)}
                        disabled={loading}
                        autoComplete="off"
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPublic(!showPublic)}
                    >
                        {showPublic ? '👁' : '👁‍🗨'}
                    </button>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="private-key">
                    المفتاح الخاص (Private Key)
                </label>
                <div className="password-wrapper">
                    <input
                        id="private-key"
                        type={showPrivate ? 'text' : 'password'}
                        className="form-input key-input"
                        placeholder="أدخل المفتاح الخاص..."
                        value={privateKey}
                        onChange={(e) => setPrivateKey(e.target.value)}
                        disabled={loading}
                        autoComplete="off"
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPrivate(!showPrivate)}
                    >
                        {showPrivate ? '👁' : '👁‍🗨'}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                className={`submit-btn ${loading ? 'loading' : ''}`}
                disabled={!isValid || loading}
            >
                {loading ? 'جاري الحفظ...' : (
                    <>
                        <span>🔐</span>
                        حفظ المفتاح بأمان
                    </>
                )}
            </button>
        </form>
    );
};

// ==========================================
// Keys List Component
// ==========================================
const KeysList = ({ keys, onUse, onDelete }) => {
    if (keys.length === 0) {
        return (
            <div className="keys-list-section">
                <h2 className="section-title">
                    <span>📋</span>
                    المفاتيح المحفوظة
                </h2>
                <div className="empty-state">
                    <div className="empty-state-icon">🔐</div>
                    <p className="empty-state-text">
                        لم تضف أي مفاتيح بعد.<br />
                        أضف مفتاح VAPI الأول لبدء الاستخدام.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="keys-list-section">
            <h2 className="section-title">
                <span>📋</span>
                المفاتيح المحفوظة ({keys.length})
            </h2>
            <div className="keys-list">
                <AnimatePresence>
                    {keys.map((key) => (
                        <KeyCard
                            key={key.id}
                            keyData={key}
                            onUse={onUse}
                            onDelete={onDelete}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

// ==========================================
// Main Settings App
// ==========================================
const SettingsApp = () => {
    const [keys, setKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [deleteModal, setDeleteModal] = useState({ show: false, key: null });

    // Load keys on mount
    useEffect(() => {
        loadKeys();
        disableCopyPaste();
    }, []);

    const loadKeys = async () => {
        try {
            const storedKeys = await SecureDB.getAllKeys();
            setKeys(storedKeys);
        } catch (error) {
            showToast('فشل تحميل المفاتيح', 'error');
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 3000);
    };

    const handleSaveKey = async (keyData) => {
        setLoading(true);
        try {
            await SecureDB.saveKey(keyData);
            await loadKeys();
            showToast('تم حفظ المفتاح بنجاح وتشفيره بأمان', 'success');
        } catch (error) {
            showToast('فشل حفظ المفتاح. الاسم قد يكون مستخدماً.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUseKey = async (keyId) => {
        try {
            const decryptedKey = await SecureDB.getDecryptedKey(keyId);
            await SecureDB.updateLastUsed(keyId);
            await loadKeys();

            // Store in session for use
            sessionStorage.setItem('active_vapi_key', JSON.stringify({
                publicKey: decryptedKey.publicKey,
                privateKey: decryptedKey.privateKey,
                name: decryptedKey.name
            }));

            showToast(`تم تفعيل المفتاح "${decryptedKey.name}" وهو جاهز للاستخدام`, 'success');

            // Redirect to main page after a short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } catch (error) {
            showToast('فشل تفعيل المفتاح', 'error');
        }
    };

    const handleDeleteClick = (keyData) => {
        setDeleteModal({ show: true, key: keyData });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.key) return;

        try {
            await SecureDB.deleteKey(deleteModal.key.id);
            await loadKeys();
            showToast('تم حذف المفتاح بنجاح', 'success');
        } catch (error) {
            showToast('فشل حذف المفتاح', 'error');
        } finally {
            setDeleteModal({ show: false, key: null });
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModal({ show: false, key: null });
    };

    return (
        <div className="settings-container">
            <header className="settings-header">
                <h1 className="settings-title">
                    <div className="settings-title-icon">🔐</div>
                    إعدادات مفاتيح VAPI
                </h1>
                <a href="index.html" className="back-link">
                    <span>→</span>
                    العودة للصفحة الرئيسية
                </a>
            </header>

            <main className="settings-content">
                <motion.div
                    className="security-notice"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <span className="security-notice-icon">🛡️</span>
                    <p className="security-notice-text">
                        <strong>حماية متقدمة:</strong> يتم تشفير جميع المفاتيح باستخدام تقنية AES-256 قبل حفظها.
                        المفاتيح مرتبطة بهذا الجهاز ولا يمكن نسخها أو استخدامها على جهاز آخر.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <AddKeyForm onSave={handleSaveKey} loading={loading} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <KeysList
                        keys={keys}
                        onUse={handleUseKey}
                        onDelete={handleDeleteClick}
                    />
                </motion.div>
            </main>

            <Toast {...toast} />
            <DeleteModal
                show={deleteModal.show}
                keyName={deleteModal.key?.name || ''}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
        </div>
    );
};

// ==========================================
// Initialize App
// ==========================================
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SettingsApp />);
