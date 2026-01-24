/**
 * VAPI Environment Configuration
 * Uses Vite environment variables
 */

const config = {
    publicKey: import.meta.env.VITE_VAPI_PUBLIC_KEY,
    assistantId: import.meta.env.VITE_VAPI_ASSISTANT_ID,
    apiBaseUrl: 'https://api.vapi.ai',
};

if (!config.publicKey || !config.assistantId) {
    console.error("⚠️ VAPI Configuration Missing! Check your .env file or Vercel environment variables.");
}

export default config;
