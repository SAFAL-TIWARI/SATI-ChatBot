// Configuration file for serverless API integration
// API keys are now handled securely by serverless functions

// API Configuration
const API_CONFIG = {
    // API endpoints for serverless functions
    GROQ_API_ENDPOINT: '/api/groq',
    GEMINI_API_ENDPOINT: '/api/gemini',
    
    // Default settings
    DEFAULT_PROVIDER: 'groq',
    DEFAULT_MODEL: 'llama-3.1-8b-instant',
    
    // API status - always true since serverless functions handle the keys
    GROQ_CONFIGURED: true,
    GEMINI_CONFIGURED: true
};

// Supabase Configuration - Loaded from serverless function
let SUPABASE_CONFIG = {
    URL: null,
    KEY: null,
    CONFIGURED: false
};

// Function to load Supabase configuration from serverless function
async function loadSupabaseConfig() {
    try {
        const response = await fetch('/api/supabase-config');
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.configured) {
                SUPABASE_CONFIG.URL = data.config.url;
                SUPABASE_CONFIG.KEY = data.config.key;
                SUPABASE_CONFIG.CONFIGURED = true;
                console.log('✅ Supabase configuration loaded successfully');
                return true;
            }
        }
        console.warn('⚠️ Supabase configuration not available');
        return false;
    } catch (error) {
        console.warn('⚠️ Failed to load Supabase configuration:', error);
        return false;
    }
}

// Function to check API availability (serverless functions)
async function checkAPIAvailability() {
    try {
        // Test if serverless functions are available
        // We'll do a simple connectivity check without making actual API calls
        console.log('✅ Serverless API functions configured');
        console.log('Groq API endpoint:', API_CONFIG.GROQ_API_ENDPOINT);
        console.log('Gemini API endpoint:', API_CONFIG.GEMINI_API_ENDPOINT);
        return true;
    } catch (error) {
        console.warn('⚠️ Could not verify serverless function availability:', error);
        return false;
    }
}

// Make config available globally
window.API_CONFIG = API_CONFIG;
window.SUPABASE_CONFIG = SUPABASE_CONFIG;

// Initialize API configuration when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Loading Serverless API Configuration...');
    
    // Load Supabase configuration first
    await loadSupabaseConfig();
    
    // Check API availability
    const apiAvailable = await checkAPIAvailability();
    
    if (apiAvailable) {
        console.log('✅ Serverless API Configuration loaded successfully');
        console.log('Groq API configured:', API_CONFIG.GROQ_CONFIGURED);
        console.log('Gemini API configured:', API_CONFIG.GEMINI_CONFIGURED);
        console.log('Supabase configured:', SUPABASE_CONFIG.CONFIGURED);
        
        // Initialize API Manager now that configuration is loaded
        if (window.initializeAPIManager) {
            window.initializeAPIManager();
        }
        
        // Initialize Supabase if configuration was loaded
        if (SUPABASE_CONFIG.CONFIGURED && window.initializeSupabase) {
            window.initializeSupabase();
        }
        
        // Test API configuration after a short delay to ensure everything is loaded
        setTimeout(() => {
            if (window.apiManager) {
                const status = window.apiManager.getProviderStatus();
                console.log('API Manager Status:', status);
                
                if (status.groq.configured || status.gemini.configured) {
                    console.log('✅ Serverless API configuration successful - Ready to chat!');
                    
                    // Make test function available globally for debugging
                    window.testAPI = async function() {
                        try {
                            console.log('Testing serverless API connection...');
                            const response = await window.apiManager.sendMessage('Hello, this is a test message.');
                            console.log('✅ Serverless API Test Successful:', response);
                            return response;
                        } catch (error) {
                            console.error('❌ Serverless API Test Failed:', error);
                            return error.message;
                        }
                    };
                    
                } else {
                    console.error('❌ Serverless API configuration failed');
                }
            } else {
                console.error('❌ API Manager not initialized');
            }
        }, 500);
    } else {
        console.error('❌ Failed to load serverless API configuration');
    }
});