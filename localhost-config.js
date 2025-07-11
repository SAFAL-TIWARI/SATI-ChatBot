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
}

// Make this available globally
window.LOCALHOST_CONFIG_LOADED = true;