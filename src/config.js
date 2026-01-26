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

// Low-latency configuration overrides
// This configuration overrides the assistant's default settings to optimize for speed.
export const lowLatencyConfig = {
    transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "ar",
    },
    model: {
        provider: "openai",
        model: "gpt-4o-mini",
    },
    // Voice optimization requires a specific voiceId.
    // Uncomment and add your voiceId if you want to enforce the turbo model.
    /*
    voice: {
        provider: "11labs",
        model: "eleven_turbo_v2_5",
        voiceId: "YOUR_VOICE_ID_HERE",
    },
    */
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
