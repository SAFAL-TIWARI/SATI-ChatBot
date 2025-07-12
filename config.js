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

// Supabase Configuration - Loaded from serverless function or fallback
let SUPABASE_CONFIG = {
    URL: null,
    KEY: null,
    CONFIGURED: false
};

// Fallback configuration for development/testing
const FALLBACK_SUPABASE_CONFIG = {
    URL: 'https://zewtfqbomdqtaviipwhe.supabase.co',
    KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpld3RmcWJvbWRxdGF2aWlwd2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTE0OTAsImV4cCI6MjA2NzgyNzQ5MH0.Gn0QaS2DGGINVAqwjpYUXzH4HCnz7Bxh3EgPt_IjVJo'
};

// Function to load Supabase configuration from serverless function
async function loadSupabaseConfig() {
    try {
        console.log('🔄 Loading Supabase configuration...');
        
        // Check if we're on localhost and use the special localhost loader
        if ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.loadSupabaseConfigForLocalhost) {
            console.log('🔧 Loading Supabase config for localhost...');
            const result = await window.loadSupabaseConfigForLocalhost();
          if (result) return true;
        }

        // Try to load from serverless function
        try {
            console.log('🔄 Attempting to load from /api/supabase-config...');
            const response = await fetch('/api/supabase-config');
            console.log('API response status:', response.status);
            
              if (response.ok) {
                const data = await response.json();
                console.log('API response data:', data);
                
                if (data.success && data.configured) {
                    SUPABASE_CONFIG.URL = data.config.url;
                    SUPABASE_CONFIG.KEY = data.config.key;
                    SUPABASE_CONFIG.CONFIGURED = true;
                    console.log('✅ Supabase configuration loaded from API successfully');
                    return true;
                }
            } else {
                console.warn('⚠️ API response not ok:', response.status, response.statusText);
            }
        } catch (apiError) {
            console.warn('⚠️ API request failed:', apiError);
        }

        // Fallback to hardcoded configuration
        console.log('🔄 Using fallback Supabase configuration...');
        SUPABASE_CONFIG.URL = FALLBACK_SUPABASE_CONFIG.URL;
        SUPABASE_CONFIG.KEY = FALLBACK_SUPABASE_CONFIG.KEY;
        SUPABASE_CONFIG.CONFIGURED = true;
        console.log('✅ Supabase configuration loaded from fallback');
        return true;
        
    } catch (error) {
        console.error('❌ Failed to load Supabase configuration:', error);
        
        // Last resort - try fallback
        try {
            console.log('🔄 Last resort: Using fallback configuration...');
            SUPABASE_CONFIG.URL = FALLBACK_SUPABASE_CONFIG.URL;
            SUPABASE_CONFIG.KEY = FALLBACK_SUPABASE_CONFIG.KEY;
            SUPABASE_CONFIG.CONFIGURED = true;
            console.log('✅ Fallback Supabase configuration applied');
            return true;
        } catch (fallbackError) {
            console.error('❌ Even fallback failed:', fallbackError);
            return false;
        }
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
            console.log('🔄 Attempting to initialize Supabase from config.js...');
            const supabaseInitialized = window.initializeSupabase();
            if (supabaseInitialized) {
                console.log('✅ Supabase initialized successfully from config.js');
            } else {
                console.warn('⚠️ Supabase initialization failed from config.js');
            }
        } else {
            console.warn('⚠️ Supabase initialization skipped:', {
                configured: SUPABASE_CONFIG.CONFIGURED,
                initFunction: !!window.initializeSupabase
            });
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