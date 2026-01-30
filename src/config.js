/**
 * VAPI Environment Configuration
 * Uses Vite environment variables for Production
 */

const config = {
    // Access environment variables using Vite's protected import.meta.env
    publicKey: import.meta.env.VITE_VAPI_PUBLIC_KEY,
    assistantId: import.meta.env.VITE_VAPI_ASSISTANT_ID,
    apiBaseUrl: 'https://api.vapi.ai',
};

export const assistantOptions = {
    transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: import.meta.env.VITE_VAPI_LANGUAGE || "ar",
    },
};

// Strict check for Production Keys
if (!config.publicKey || !config.assistantId) {
    console.error(
        "❌ Configuration Error: VITE_ Environment Variables are missing in Vercel settings.\n" +
        "Please add VITE_VAPI_PUBLIC_KEY and VITE_VAPI_ASSISTANT_ID to your Vercel Project Settings."
    );
} else {
    // console.log("✅ Vapi Configuration Loaded");
}

export default config;
