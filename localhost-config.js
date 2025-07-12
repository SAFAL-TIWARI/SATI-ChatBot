// Localhost Configuration - Use live Vercel API endpoints for development
// This allows you to use your regular development server while still accessing the APIs

// Override API configuration for localhost development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🔧 Localhost detected - Using live Vercel API endpoints');

    // Your actual Vercel deployment URL
    const VERCEL_URL = 'https://sati-chatbot.vercel.app';

    // Override the API endpoints to use live Vercel deployment
    if (window.API_CONFIG) {
        window.API_CONFIG.GROQ_API_ENDPOINT = `${VERCEL_URL}/api/groq`;
        window.API_CONFIG.GEMINI_API_ENDPOINT = `${VERCEL_URL}/api/gemini`;

        console.log('✅ API endpoints updated for localhost:');
        console.log('Groq API:', window.API_CONFIG.GROQ_API_ENDPOINT);
        console.log('Gemini API:', window.API_CONFIG.GEMINI_API_ENDPOINT);
    }

    // Override Supabase configuration loading for localhost
    window.loadSupabaseConfigForLocalhost = async function() {
        try {
            const response = await fetch(`${VERCEL_URL}/api/supabase-config`);
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.configured) {
                    window.SUPABASE_CONFIG.URL = data.config.url;
                    window.SUPABASE_CONFIG.KEY = data.config.key;
                    window.SUPABASE_CONFIG.CONFIGURED = true;
                    console.log('✅ Supabase configuration loaded from Vercel for localhost');
                    return true;
                }
            }
            console.warn('⚠️ Failed to load Supabase config from Vercel');
            return false;
        } catch (error) {
            console.warn('⚠️ Error loading Supabase config from Vercel:', error);
            return false;
        }
    };
}

// Make this available globally
window.LOCALHOST_CONFIG_LOADED = true;