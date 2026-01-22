/**
 * Crypto Utilities for Secure Key Storage
 * Uses Web Crypto API for AES-GCM encryption
 */

const CryptoUtils = (() => {
    // Encryption Algorithm
    const ALGORITHM = 'AES-GCM';
    const KEY_LENGTH = 256;

    // Generate a unique device-based encryption key
    const getDeviceFingerprint = () => {
        const nav = window.navigator;
        const screen = window.screen;
        const fingerprint = [
            nav.userAgent,
            nav.language,
            screen.colorDepth,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset(),
            nav.hardwareConcurrency || 'unknown',
            'ai-agint2-secure-vault'
        ].join('|');
        return fingerprint;
    };

    // Derive encryption key from fingerprint
    const deriveKey = async (fingerprint) => {
        const encoder = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            encoder.encode(fingerprint),
            'PBKDF2',
            false,
            ['deriveKey']
        );

        const salt = encoder.encode('ai-agint2-salt-v1');

        return crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: ALGORITHM, length: KEY_LENGTH },
            false,
            ['encrypt', 'decrypt']
        );
    };

    // Encrypt data
    const encrypt = async (plaintext) => {
        const fingerprint = getDeviceFingerprint();
        const key = await deriveKey(fingerprint);
        const encoder = new TextEncoder();
        const iv = crypto.getRandomValues(new Uint8Array(12));

        const encrypted = await crypto.subtle.encrypt(
            { name: ALGORITHM, iv: iv },
            key,
            encoder.encode(plaintext)
        );

        // Combine IV and encrypted data
        const combined = new Uint8Array(iv.length + encrypted.byteLength);
        combined.set(iv, 0);
        combined.set(new Uint8Array(encrypted), iv.length);

        // Return as base64
        return btoa(String.fromCharCode(...combined));
    };

    // Decrypt data
    const decrypt = async (ciphertext) => {
        try {
            const fingerprint = getDeviceFingerprint();
            const key = await deriveKey(fingerprint);

            // Decode from base64
            const combined = new Uint8Array(
                atob(ciphertext).split('').map(c => c.charCodeAt(0))
            );

            // Extract IV and encrypted data
            const iv = combined.slice(0, 12);
            const encrypted = combined.slice(12);

            const decrypted = await crypto.subtle.decrypt(
                { name: ALGORITHM, iv: iv },
                key,
                encrypted
            );

            const decoder = new TextDecoder();
            return decoder.decode(decrypted);
        } catch (error) {
            console.error('Decryption failed:', error);
            return null;
        }
    };

    // Hash function for key IDs
    const hashKey = async (key) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(key);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    return {
        encrypt,
        decrypt,
        hashKey
    };
})();

// Make available globally
window.CryptoUtils = CryptoUtils;
