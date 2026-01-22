/**
 * Secure IndexedDB Storage for VAPI Keys
 * Encrypted storage with tamper protection
 */

const SecureDB = (() => {
    const DB_NAME = 'ai-agint2-vault';
    const DB_VERSION = 1;
    const STORE_NAME = 'vapi-keys';

    let db = null;

    // Initialize database
    const init = () => {
        return new Promise((resolve, reject) => {
            if (db) {
                resolve(db);
                return;
            }

            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                reject(new Error('Failed to open database'));
            };

            request.onsuccess = (event) => {
                db = event.target.result;
                resolve(db);
            };

            request.onupgradeneeded = (event) => {
                const database = event.target.result;

                // Create object store for keys
                if (!database.objectStoreNames.contains(STORE_NAME)) {
                    const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
                    store.createIndex('name', 'name', { unique: true });
                    store.createIndex('createdAt', 'createdAt', { unique: false });
                }
            };
        });
    };

    // Save a new VAPI key
    const saveKey = async (keyData) => {
        await init();

        const { name, publicKey, privateKey } = keyData;

        // Encrypt the sensitive keys
        const encryptedPublicKey = await CryptoUtils.encrypt(publicKey);
        const encryptedPrivateKey = await CryptoUtils.encrypt(privateKey);

        const record = {
            id: await CryptoUtils.hashKey(name + Date.now()),
            name: name,
            publicKey: encryptedPublicKey,
            privateKey: encryptedPrivateKey,
            createdAt: new Date().toISOString(),
            lastUsed: null
        };

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.add(record);

            request.onsuccess = () => resolve(record.id);
            request.onerror = () => reject(new Error('Failed to save key'));
        });
    };

    // Get all keys (metadata only, keys are encrypted)
    const getAllKeys = async () => {
        await init();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => {
                // Return only metadata, not the actual keys
                const keys = request.result.map(record => ({
                    id: record.id,
                    name: record.name,
                    createdAt: record.createdAt,
                    lastUsed: record.lastUsed,
                    // Mask the keys for display
                    publicKeyPreview: '••••••••' + record.publicKey.slice(-8),
                    privateKeyPreview: '••••••••' + record.privateKey.slice(-8)
                }));
                resolve(keys);
            };
            request.onerror = () => reject(new Error('Failed to fetch keys'));
        });
    };

    // Get decrypted key by ID (for internal use only)
    const getDecryptedKey = async (id) => {
        await init();

        return new Promise(async (resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(id);

            request.onsuccess = async () => {
                if (!request.result) {
                    reject(new Error('Key not found'));
                    return;
                }

                const record = request.result;
                try {
                    const publicKey = await CryptoUtils.decrypt(record.publicKey);
                    const privateKey = await CryptoUtils.decrypt(record.privateKey);

                    resolve({
                        id: record.id,
                        name: record.name,
                        publicKey,
                        privateKey
                    });
                } catch (error) {
                    reject(new Error('Failed to decrypt key'));
                }
            };
            request.onerror = () => reject(new Error('Failed to fetch key'));
        });
    };

    // Update last used timestamp
    const updateLastUsed = async (id) => {
        await init();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const getRequest = store.get(id);

            getRequest.onsuccess = () => {
                const record = getRequest.result;
                if (record) {
                    record.lastUsed = new Date().toISOString();
                    const updateRequest = store.put(record);
                    updateRequest.onsuccess = () => resolve();
                    updateRequest.onerror = () => reject(new Error('Failed to update'));
                }
            };
            getRequest.onerror = () => reject(new Error('Failed to fetch key'));
        });
    };

    // Delete a key
    const deleteKey = async (id) => {
        await init();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(new Error('Failed to delete key'));
        });
    };

    // Check if keys exist
    const hasKeys = async () => {
        const keys = await getAllKeys();
        return keys.length > 0;
    };

    return {
        init,
        saveKey,
        getAllKeys,
        getDecryptedKey,
        updateLastUsed,
        deleteKey,
        hasKeys
    };
})();

// Make available globally
window.SecureDB = SecureDB;
