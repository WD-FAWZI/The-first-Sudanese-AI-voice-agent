/**
 * VAPI Service - Voice AI API Integration
 * Uses securely stored keys from config file
 */

const VAPIService = (() => {
    let activeKey = null;
    let isInitialized = false;

    // Initialize the service with the config file keys
    const init = async () => {
        // First try to use config file
        if (window.VAPI_CONFIG && window.VAPI_CONFIG.publicKey !== 'YOUR_VAPI_PUBLIC_KEY_HERE') {
            activeKey = {
                name: 'Environment Config',
                publicKey: window.VAPI_CONFIG.publicKey,
                privateKey: window.VAPI_CONFIG.privateKey
            };
            isInitialized = true;
            console.log('🔑 VAPI Service initialized from config file');
            return true;
        }

        // Fallback to session storage (from settings page)
        const storedKey = sessionStorage.getItem('active_vapi_key');
        if (storedKey) {
            try {
                activeKey = JSON.parse(storedKey);
                isInitialized = true;
                console.log('🔑 VAPI Service initialized with key:', activeKey.name);
                return true;
            } catch (error) {
                console.error('Failed to parse active key:', error);
                return false;
            }
        }

        console.warn('⚠️ VAPI Service: No keys configured');
        return false;
    };

    // Check if service is ready
    const isReady = () => {
        return isInitialized && activeKey !== null;
    };

    // Get the active key name
    const getActiveKeyName = () => {
        return activeKey?.name || null;
    };

    // Clear the active session (logout)
    const clearSession = () => {
        sessionStorage.removeItem('active_vapi_key');
        activeKey = null;
        isInitialized = false;
    };

    // Make an authenticated API call to VAPI
    const callAPI = async (endpoint, options = {}) => {
        if (!isReady()) {
            throw new Error('VAPI Service not initialized. Please select a key first.');
        }

        const { method = 'POST', body = null } = options;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeKey.privateKey}`,
            'X-VAPI-Public-Key': activeKey.publicKey
        };

        try {
            const response = await fetch(`https://api.vapi.ai/${endpoint}`, {
                method,
                headers,
                body: body ? JSON.stringify(body) : null
            });

            if (!response.ok) {
                throw new Error(`VAPI Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('VAPI API Error:', error);
            throw error;
        }
    };

    // Start a voice call
    const startCall = async (assistantId, options = {}) => {
        return callAPI('call/start', {
            method: 'POST',
            body: {
                assistantId,
                ...options
            }
        });
    };

    // End a voice call
    const endCall = async (callId) => {
        return callAPI(`call/${callId}/end`, {
            method: 'POST'
        });
    };

    // Get call history
    const getCallHistory = async () => {
        return callAPI('call/history', {
            method: 'GET'
        });
    };

    // Get available assistants
    const getAssistants = async () => {
        return callAPI('assistant', {
            method: 'GET'
        });
    };

    // Create a new assistant
    const createAssistant = async (config) => {
        return callAPI('assistant', {
            method: 'POST',
            body: config
        });
    };

    return {
        init,
        isReady,
        getActiveKeyName,
        clearSession,
        callAPI,
        startCall,
        endCall,
        getCallHistory,
        getAssistants,
        createAssistant
    };
})();

// Make available globally
window.VAPIService = VAPIService;

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    VAPIService.init();
});
