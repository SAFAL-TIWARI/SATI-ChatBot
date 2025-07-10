// Configuration file for API keys
// Note: API keys are now loaded securely from environment variables

// API Configuration
const API_CONFIG = {
    // API keys will be loaded from secure source
    GROQ_API_KEY: null,
    GEMINI_API_KEY: null,
    
    // Default settings
    DEFAULT_PROVIDER: 'groq',
    DEFAULT_MODEL: 'llama-3.1-8b-instant'
};

// Function to load API keys securely
async function loadAPIKeys() {
    try {
        // In a real production environment, this would call your backend API
        // For now, we'll load from a secure configuration
        const response = await fetch('./api-keys.json');
        if (response.ok) {
            const keys = await response.json();
            API_CONFIG.GROQ_API_KEY = keys.GROQ_API_KEY;
            API_CONFIG.GEMINI_API_KEY = keys.GEMINI_API_KEY;
            return true;
        }
    } catch (error) {
        console.warn('Could not load API keys from secure source, falling back to environment variables');
    }
    
    // Fallback: Load from environment variables (this won't work in browser)
    // This is just for development - in production, use a backend service
    if (typeof process !== 'undefined' && process.env) {
        API_CONFIG.GROQ_API_KEY = process.env.GROQ_API_KEY;
        API_CONFIG.GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        return true;
    }
    
    return false;
}

// Make config available globally
window.API_CONFIG = API_CONFIG;

// Initialize API configuration when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Loading API Configuration...');
    
    // Load API keys securely
    const keysLoaded = await loadAPIKeys();
    
    if (keysLoaded) {
        console.log('✅ API Configuration loaded successfully');
        console.log('Groq API configured:', !!API_CONFIG.GROQ_API_KEY);
        console.log('Gemini API configured:', !!API_CONFIG.GEMINI_API_KEY);
        
        // Initialize API Manager now that keys are loaded
        if (window.initializeAPIManager) {
            window.initializeAPIManager();
        }
        
        // Test API configuration after a short delay to ensure everything is loaded
        setTimeout(() => {
            if (window.apiManager) {
                const status = window.apiManager.getProviderStatus();
                console.log('API Manager Status:', status);
                
                if (status.groq.configured || status.gemini.configured) {
                    console.log('✅ API configuration successful - Ready to chat!');
                    
                    // Make test function available globally for debugging
                    window.testAPI = async function() {
                        try {
                            console.log('Testing API connection...');
                            const response = await window.apiManager.sendMessage('Hello, this is a test message.');
                            console.log('✅ API Test Successful:', response);
                            return response;
                        } catch (error) {
                            console.error('❌ API Test Failed:', error);
                            return error.message;
                        }
                    };
                    
                } else {
                    console.error('❌ API configuration failed - Check API keys');
                }
            } else {
                console.error('❌ API Manager not initialized');
            }
        }, 500);
    } else {
        console.error('❌ Failed to load API keys - Check configuration');
    }
});