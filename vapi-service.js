/**
 * VAPI Service - Voice AI API Integration
 * Uses securely stored keys from config file
 */

const VAPIService = (() => {
    let activeKey = null;
    let isInitialized = false;

    // Low-Latency Configuration (Recommended)
    const defaultConfig = {
        transcriber: {
            provider: "deepgram",
            model: "nova-2",
            language: "ar", // Arabic support
            smartFormat: true,
        },
        model: {
            provider: "openai",
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "أنت مساعد ذكي ومفيد يتحدث باللهجة السودانية. ردودك يجب أن تكون قصيرة ومختصرة وسريعة."
                }
            ],
            maxTokens: 250,
            temperature: 0.7
        },
        voice: {
            provider: "11labs",
            model: "eleven_turbo_v2_5",
            voiceId: "21m00Tcm4TlvDq8ikWAM", // Default voice (Rachel)
            stability: 0.5,
            similarityBoost: 0.75
        }
    };

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
        const payload = { ...options };

        if (assistantId) {
            payload.assistantId = assistantId;
        } else if (!payload.assistant) {
            // If no assistantId and no inline assistant config, use default low-latency config
            payload.assistant = defaultConfig;
        }

        return callAPI('call/start', {
            method: 'POST',
            body: payload
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
            body: config || defaultConfig
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
        createAssistant,
        defaultConfig
    };
})();

// Make available globally
window.VAPIService = VAPIService;

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    VAPIService.init();
});
