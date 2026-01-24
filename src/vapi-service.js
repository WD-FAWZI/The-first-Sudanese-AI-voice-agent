import config from './config';

/**
 * VAPI Service - Voice AI API Integration
 */

const VAPIService = (() => {
    let activeKey = null;
    let isInitialized = false;

    // Initialize the service with the config file keys
    const init = () => {
        if (config.publicKey) {
            activeKey = {
                name: 'Production Config',
                publicKey: config.publicKey,
                assistantId: config.assistantId
            };
            isInitialized = true;
            // console.log('🔑 VAPI Service initialized');
            return true;
        }

        console.error('⚠️ VAPI Service: Production Configuration Missing');
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

    // Get public key
    const getPublicKey = () => {
        return activeKey ? activeKey.publicKey : null;
    };

    const getAssistantId = () => {
        return activeKey ? activeKey.assistantId : null;
    }

    return {
        init,
        isReady,
        getActiveKeyName,
        getPublicKey,
        getAssistantId
    };
})();

// Auto-initialize
VAPIService.init();

// Export for modules
export default VAPIService;

// Keep global for debugging or legacy scripts
window.VAPIService = VAPIService;
