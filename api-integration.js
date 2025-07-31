// SATI ChatBot - API Integration for Groq and Gemini
// Direct API calls from JavaScript with smart response system

class APIManager {
    constructor() {
        // Serverless API Configuration
        this.groqConfig = {
            endpoint: window.API_CONFIG?.GROQ_API_ENDPOINT || '/api/groq',
            models: [
                'llama-3.1-8b-instant',
                'llama-3.3-70b-versatile',
                'gemma2-9b-it',
                'deepseek-r1-distill-llama-70b',
                'llama3-8b-8192',
                'llama3-70b-8192'
            ]
        };

        this.geminiConfig = {
            endpoint: window.API_CONFIG?.GEMINI_API_ENDPOINT || '/api/gemini',
            models: [
                'gemini-1.5-flash',
                'gemini-1.5-pro'
            ]
        };

        // Serverless functions handle API keys securely
        this.groqConfigured = window.API_CONFIG?.GROQ_CONFIGURED || true;
        this.geminiConfigured = window.API_CONFIG?.GEMINI_CONFIGURED || true;

        // Default provider
        this.currentProvider = localStorage.getItem('sati_api_provider') || window.API_CONFIG?.DEFAULT_PROVIDER || 'groq';
        this.currentModel = localStorage.getItem('sati_selected_model') || window.API_CONFIG?.DEFAULT_MODEL || 'llama-3.1-8b-instant';

        // Debug information
        console.log('Serverless API Manager initialized:', {
            configAvailable: !!window.API_CONFIG,
            groqEndpoint: this.groqConfig.endpoint,
            geminiEndpoint: this.geminiConfig.endpoint,
            groqConfigured: this.groqConfigured,
            geminiConfigured: this.geminiConfigured,
            currentProvider: this.currentProvider,
            currentModel: this.currentModel
        });

        // Serverless functions should always be available
        if (!this.groqConfigured && !this.geminiConfigured) {
            console.warn('⚠️ Serverless API functions not configured properly!');
        }
    }

    // API keys are now pre-configured in config.js
    // These methods are kept for backward compatibility but don't store keys
    setGroqApiKey(apiKey) {
        console.log('API keys are pre-configured. This method is deprecated.');
    }

    setGeminiApiKey(apiKey) {
        console.log('API keys are pre-configured. This method is deprecated.');
    }

    // Set current provider and model
    setProvider(provider) {
        this.currentProvider = provider;
        localStorage.setItem('sati_api_provider', provider);
    }

    setModel(model) {
        this.currentModel = model;
        localStorage.setItem('sati_selected_model', model);
    }

    // Check if serverless functions are configured
    isGroqConfigured() {
        console.log('Groq serverless function configured:', this.groqConfigured);
        return this.groqConfigured;
    }

    isGeminiConfigured() {
        console.log('Gemini serverless function configured:', this.geminiConfigured);
        return this.geminiConfigured;
    }

    // Main function to send message with smart routing
    async sendMessage(userMessage, controller = null) {
        try {
            // Determine if query is SATI-related
            const isSATIQuery = isSATIRelated(userMessage);

            let prompt;
            if (isSATIQuery) {
                // Use SATI-specific context for SATI queries
                prompt = getContextualPrompt(userMessage);
            } else {
                // Use general prompt for non-SATI queries
                prompt = `You are a helpful AI assistant. Please provide a comprehensive and accurate response to the following question: ${userMessage}`;
            }

            // Route to appropriate API based on current provider
            if (this.currentProvider === 'groq') {
                return await this.sendGroqMessage(prompt, 0, controller);
            } else if (this.currentProvider === 'gemini') {
                return await this.sendGeminiMessage(prompt, controller);
            } else {
                throw new Error('Invalid API provider selected');
            }

        } catch (error) {
            console.error('Error in sendMessage:', error);

            // Re-throw AbortError so it can be handled properly by the caller
            if (error.name === 'AbortError') {
                throw error;
            }

            return this.getErrorResponse(error);
        }
    }

    // Groq serverless function integration with retry logic
    async sendGroqMessage(prompt, retryCount = 0, controller = null) {
        if (!this.isGroqConfigured()) {
            throw new Error('Groq serverless function not configured.');
        }

        const maxRetries = 3;
        const baseDelay = 1000; // 1 second

        try {
            console.log('Making Groq serverless API call:', {
                endpoint: this.groqConfig.endpoint,
                model: this.currentModel
            });

            const response = await fetch(this.groqConfig.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: prompt,
                    model: this.currentModel
                }),
                signal: controller?.signal
            });

            console.log('Groq serverless API response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error || 'Unknown error';

                console.error('Groq serverless API error:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorData,
                    errorMessage
                });

                // Handle 503 Service Unavailable with retry
                if (response.status === 503 && retryCount < maxRetries) {
                    const delay = baseDelay * Math.pow(2, retryCount);
                    console.log(`Groq API unavailable (503), retrying in ${delay}ms... (attempt ${retryCount + 1}/${maxRetries})`);

                    // Notify user about retry attempt
                    if (window.toast) {
                        window.toast.show(
                            `🔄 Service unavailable, retrying in ${Math.round(delay / 1000)}s... (${retryCount + 1}/${maxRetries})`,
                            'warning',
                            delay
                        );
                    }

                    await new Promise(resolve => setTimeout(resolve, delay));
                    return await this.sendGroqMessage(prompt, retryCount + 1, controller);
                }

                // Handle 429 Rate Limit with retry
                if (response.status === 429 && retryCount < maxRetries) {
                    const delay = baseDelay * Math.pow(2, retryCount);
                    console.log(`Groq API rate limited (429), retrying in ${delay}ms... (attempt ${retryCount + 1}/${maxRetries})`);

                    await new Promise(resolve => setTimeout(resolve, delay));
                    return await this.sendGroqMessage(prompt, retryCount + 1, controller);
                }

                throw new Error(`Groq Serverless API Error: ${response.status} - ${errorMessage}`);
            }

            const data = await response.json();

            if (!data.success || !data.response) {
                throw new Error('Invalid response from Groq serverless function');
            }

            // Log API key usage statistics if available
            if (data.keyUsed !== undefined) {
                console.log(`✅ Groq request completed using key ${data.keyUsed}`);
                if (data.stats) {
                    console.log('📊 Groq API Stats:', data.stats);
                    this.updateAPIStatus('groq', data.stats, data.keyUsed);
                }
            }

            // Additional client-side filtering for Deepseek R1 model (fallback)
            let processedResponse = data.response;
            if (this.currentModel === 'deepseek-r1-distill-llama-70b') {
                const originalLength = processedResponse.length;
                const hasThinkTags = processedResponse.includes('<think>');

                processedResponse = this.filterDeepseekThinkTags(processedResponse);

                // Log client-side filtering activity for debugging
                if (hasThinkTags) {
                    console.log(`Client-side Deepseek R1 think tags filtered: ${originalLength} -> ${processedResponse.length} chars`);
                }
            }

            return processedResponse;

        } catch (error) {
            // If it's a network error and we haven't exceeded retries, try again
            if (error.name === 'TypeError' && error.message.includes('fetch') && retryCount < maxRetries) {
                const delay = baseDelay * Math.pow(2, retryCount);
                console.log(`Network error, retrying in ${delay}ms... (attempt ${retryCount + 1}/${maxRetries})`);

                await new Promise(resolve => setTimeout(resolve, delay));
                return await this.sendGroqMessage(prompt, retryCount + 1, controller);
            }

            throw error;
        }
    }

    // Gemini serverless function integration with retry logic
    async sendGeminiMessage(prompt, controller = null, retryCount = 0) {
        if (!this.isGeminiConfigured()) {
            throw new Error('Gemini serverless function not configured.');
        }

        const model = this.currentModel.includes('gemini') ? this.currentModel : 'gemini-1.5-flash';
        const maxRetries = 3;
        const baseDelay = 1000; // 1 second

        try {
            console.log('Making Gemini serverless API call:', {
                endpoint: this.geminiConfig.endpoint,
                model
            });

            const response = await fetch(this.geminiConfig.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: prompt,
                    model: model
                }),
                signal: controller?.signal
            });

            console.log('Gemini serverless API response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error || 'Unknown error';

                console.error('Gemini serverless API error:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorData,
                    errorMessage
                });

                // Handle 503 Service Unavailable (overloaded) with retry
                if (response.status === 503 && retryCount < maxRetries) {
                    const delay = baseDelay * Math.pow(2, retryCount); // Exponential backoff
                    console.log(`Gemini API overloaded (503), retrying in ${delay}ms... (attempt ${retryCount + 1}/${maxRetries})`);

                    // Notify user about retry attempt
                    if (window.toast) {
                        window.toast.show(
                            `🔄 Model overloaded, retrying in ${Math.round(delay / 1000)}s... (${retryCount + 1}/${maxRetries})`,
                            'warning',
                            delay
                        );
                    }

                    await new Promise(resolve => setTimeout(resolve, delay));
                    return await this.sendGeminiMessage(prompt, controller, retryCount + 1);
                }

                // Handle 429 Rate Limit with retry
                if (response.status === 429 && retryCount < maxRetries) {
                    const delay = baseDelay * Math.pow(2, retryCount);
                    console.log(`Gemini API rate limited (429), retrying in ${delay}ms... (attempt ${retryCount + 1}/${maxRetries})`);

                    await new Promise(resolve => setTimeout(resolve, delay));
                    return await this.sendGeminiMessage(prompt, controller, retryCount + 1);
                }

                throw new Error(`Gemini Serverless API Error: ${response.status} - ${errorMessage}`);
            }

            const data = await response.json();

            if (!data.success || !data.response) {
                throw new Error('Invalid response from Gemini serverless function');
            }

            // Log API key usage statistics if available
            if (data.keyUsed !== undefined) {
                console.log(`✅ Gemini request completed using key ${data.keyUsed}`);
                if (data.stats) {
                    console.log('📊 Gemini API Stats:', data.stats);
                    this.updateAPIStatus('gemini', data.stats, data.keyUsed);
                }
            }

            return data.response;

        } catch (error) {
            // If it's a network error and we haven't exceeded retries, try again
            if (error.name === 'TypeError' && error.message.includes('fetch') && retryCount < maxRetries) {
                const delay = baseDelay * Math.pow(2, retryCount);
                console.log(`Network error, retrying in ${delay}ms... (attempt ${retryCount + 1}/${maxRetries})`);

                await new Promise(resolve => setTimeout(resolve, delay));
                return await this.sendGeminiMessage(prompt, controller, retryCount + 1);
            }

            throw error;
        }
    }

    // Test API connection
    async testConnection(provider = null) {
        const testProvider = provider || this.currentProvider;

        try {
            if (testProvider === 'groq') {
                await this.sendGroqMessage('Hello, this is a test message.', 0);
                return { success: true, message: 'Groq API connection successful' };
            } else if (testProvider === 'gemini') {
                await this.sendGeminiMessage('Hello, this is a test message.', 0);
                return { success: true, message: 'Gemini API connection successful' };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Get available models for current provider
    getAvailableModels() {
        if (this.currentProvider === 'groq') {
            return this.groqConfig.models;
        } else if (this.currentProvider === 'gemini') {
            return this.geminiConfig.models;
        }
        return [];
    }

    // Filter out <think> tags from Deepseek R1 responses (client-side fallback)
    filterDeepseekThinkTags(content) {
        if (!content) return content;

        // Remove <think>...</think> blocks (including multiline)
        // This regex matches <think> opening tag, any content (including newlines), and </think> closing tag
        const thinkTagRegex = /<think>[\s\S]*?<\/think>/gi;

        // Remove the think tags and clean up extra whitespace
        let filteredContent = content.replace(thinkTagRegex, '').trim();

        // Clean up multiple consecutive newlines and spaces
        filteredContent = filteredContent.replace(/\n\s*\n\s*\n/g, '\n\n');
        filteredContent = filteredContent.replace(/^\s+|\s+$/g, '');

        // If the filtered content is empty or only whitespace, return a fallback message
        if (!filteredContent || filteredContent.length === 0) {
            return "I apologize, but I couldn't generate a proper response. Please try asking your question again.";
        }

        return filteredContent;
    }

    // Format model name for display
    formatModelName(modelName) {
        const modelInfo = {
            'llama-3.1-8b-instant': '🟢 Llama 3.1 8B (Latest)',
            'llama-3.3-70b-versatile': '🟢 Llama 3.3 70B (Latest)',
            'gemma2-9b-it': '🟢 Gemma2 9B (Latest)',
            'deepseek-r1-distill-llama-70b': '🧠 DeepSeek R1 (Reasoning)',
            'llama3-8b-8192': '🔵 Llama3 8B (Legacy)',
            'llama3-70b-8192': '🔵 Llama3 70B (Legacy)',
            'gemini-1.5-flash': '⚡ Gemini 1.5 Flash',
            'gemini-1.5-pro': '🚀 Gemini 1.5 Pro'
        };

        return modelInfo[modelName] || modelName;
    }

    // Error response handler
    getErrorResponse(error) {
        const errorMessage = error.message || 'Unknown error occurred';

        // Handle AbortError (user stopped generation)
        if (error.name === 'AbortError' || errorMessage.includes('aborted')) {
            return null; // Return null to indicate this should be handled by the caller
        }

        if (errorMessage.includes('API key') || errorMessage.includes('serverless function not configured')) {
            // Provide detailed debug information for serverless function issues
            const debugInfo = {
                groqConfigured: this.isGroqConfigured(),
                geminiConfigured: this.isGeminiConfigured(),
                currentProvider: this.currentProvider,
                configAvailable: !!window.API_CONFIG,
                groqEndpoint: this.groqConfig.endpoint,
                geminiEndpoint: this.geminiConfig.endpoint
            };

            console.error('Serverless API Configuration Debug Info:', debugInfo);

            return `❌ **Serverless API Configuration Error**\n\n${errorMessage}\n\n**Debug Info:**\n- Groq Function: ${debugInfo.groqConfigured ? 'Configured' : 'Not Configured'}\n- Gemini Function: ${debugInfo.geminiConfigured ? 'Configured' : 'Not Configured'}\n- Current Provider: ${this.currentProvider}\n- Config Available: ${debugInfo.configAvailable ? 'Yes' : 'No'}\n\nPlease check if the serverless functions are deployed properly.`;
        } else if (errorMessage.includes('503') && errorMessage.includes('overloaded')) {
            const alternatives = this.getAlternativeModels();
            let suggestionText = '';

            if (alternatives.length > 0) {
                suggestionText = '\n\n**Recommended alternatives:**\n';
                alternatives.slice(0, 3).forEach((alt, index) => {
                    suggestionText += `${index + 1}. Switch to ${this.formatModelName(alt.model)} (${alt.reason})\n`;
                });
            }

            return `🔄 **Service Temporarily Overloaded**\n\nThe AI model is currently experiencing high demand and is overloaded. The system has automatically attempted to retry your request.\n\n**What you can do:**\n• Wait a few minutes and try again\n• Try one of the alternative models below${suggestionText}\n\nThis is a temporary issue on the provider's servers and should resolve shortly.`;
        } else if (errorMessage.includes('503')) {
            return `🔄 **Service Unavailable**\n\nThe AI service is temporarily unavailable. The system has automatically attempted to retry your request.\n\n**What you can do:**\n• Wait a few minutes and try again\n• Try switching to a different model or provider\n\nThis is usually a temporary issue that resolves quickly.`;
        } else if (errorMessage.includes('rate limit') || errorMessage.includes('quota') || errorMessage.includes('429')) {
            return `⏱️ **Rate Limit Exceeded**\n\nYou've reached the API rate limit. The system has automatically attempted to retry your request.\n\n**What you can do:**\n• Wait a moment before sending another message\n• Consider switching to a different provider if available`;
        } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
            return `🌐 **Network Error**\n\nPlease check your internet connection and try again. The system has automatically attempted to retry your request.`;
        } else {
            return `❌ **Error**\n\n${errorMessage}\n\nPlease try again or contact support if the issue persists.`;
        }
    }

    // Get provider status
    getProviderStatus() {
        return {
            groq: {
                configured: this.isGroqConfigured(),
                available: this.groqConfig.models.length > 0
            },
            gemini: {
                configured: this.isGeminiConfigured(),
                available: this.geminiConfig.models.length > 0
            },
            current: this.currentProvider
        };
    }

    // Get alternative models when current model is overloaded
    getAlternativeModels() {
        const alternatives = [];

        if (this.currentProvider === 'gemini') {
            // If using Gemini Flash, suggest Pro
            if (this.currentModel === 'gemini-1.5-flash') {
                alternatives.push({
                    provider: 'gemini',
                    model: 'gemini-1.5-pro',
                    reason: 'More stable, less likely to be overloaded'
                });
            }

            // Suggest Groq alternatives if configured
            if (this.isGroqConfigured()) {
                alternatives.push({
                    provider: 'groq',
                    model: 'llama-3.1-8b-instant',
                    reason: 'Fast and reliable alternative'
                });
                alternatives.push({
                    provider: 'groq',
                    model: 'llama-3.3-70b-versatile',
                    reason: 'More powerful alternative'
                });
            }
        } else if (this.currentProvider === 'groq') {
            // Suggest other Groq models
            const otherGroqModels = this.groqConfig.models.filter(m => m !== this.currentModel);
            otherGroqModels.slice(0, 2).forEach(model => {
                alternatives.push({
                    provider: 'groq',
                    model: model,
                    reason: 'Alternative Groq model'
                });
            });

            // Suggest Gemini if configured
            if (this.isGeminiConfigured()) {
                alternatives.push({
                    provider: 'gemini',
                    model: 'gemini-1.5-flash',
                    reason: 'Google AI alternative'
                });
            }
        }

        return alternatives;
    }

    // Update API status display with key statistics
    updateAPIStatus(provider, stats, keyUsed) {
        // Store the latest stats for debugging
        if (!this.apiStats) {
            this.apiStats = {};
        }
        
        this.apiStats[provider] = {
            ...stats,
            lastKeyUsed: keyUsed,
            lastUpdated: new Date().toISOString()
        };

        // Update UI if status element exists
        const statusElement = document.getElementById('api-status');
        if (statusElement) {
            this.renderAPIStatus(statusElement);
        }

        // Show toast notification for key switching (only if different from last used)
        if (this.lastUsedKey && this.lastUsedKey[provider] !== keyUsed) {
            if (window.toast) {
                window.toast.show(
                    `🔄 Switched to ${provider} key ${keyUsed} (${stats.available}/${stats.total} available)`,
                    'info',
                    3000
                );
            }
        }

        // Track last used key
        if (!this.lastUsedKey) {
            this.lastUsedKey = {};
        }
        this.lastUsedKey[provider] = keyUsed;
    }

    // Render API status in the UI
    renderAPIStatus(element) {
        if (!this.apiStats) return;

        const html = `
            <div class="api-status-container">
                <h4>🔑 API Key Status</h4>
                ${Object.entries(this.apiStats).map(([provider, stats]) => `
                    <div class="provider-status">
                        <strong>${provider.toUpperCase()}:</strong>
                        <span class="key-count">${stats.available}/${stats.total} keys available</span>
                        <span class="last-key">Last used: Key ${stats.lastKeyUsed}</span>
                        ${stats.failed > 0 ? `<span class="failed-keys">⚠️ ${stats.failed} failed</span>` : ''}
                    </div>
                `).join('')}
                <div class="status-updated">
                    Last updated: ${new Date().toLocaleTimeString()}
                </div>
            </div>
        `;

        element.innerHTML = html;
    }

    // Get comprehensive API status
    async getAPIStatus() {
        try {
            const response = await fetch('/api/api-status');
            if (response.ok) {
                const data = await response.json();
                return data;
            }
        } catch (error) {
            console.error('Failed to fetch API status:', error);
        }
        
        // Fallback to local stats
        return {
            success: true,
            health: { status: 'unknown', percentage: 0 },
            apiKeys: this.apiStats || {}
        };
    }

    // Show API status in console (for debugging)
    showAPIStatus() {
        console.log('=== API Key Status ===');
        if (this.apiStats) {
            Object.entries(this.apiStats).forEach(([provider, stats]) => {
                console.log(`${provider.toUpperCase()}:`, {
                    available: `${stats.available}/${stats.total}`,
                    lastUsed: `Key ${stats.lastKeyUsed}`,
                    failed: stats.failed,
                    lastUpdated: stats.lastUpdated
                });
            });
        } else {
            console.log('No API statistics available yet');
        }
    }
}

// Initialize API Manager after DOM is loaded to ensure config is available
let apiManager;

// Function to initialize API Manager
function initializeAPIManager(retryCount = 0) {
    if (!apiManager) {
        // Check if API config is available
        if (!window.API_CONFIG || (!window.API_CONFIG.GROQ_API_KEY && !window.API_CONFIG.GEMINI_API_KEY)) {
            if (retryCount < 5) {
                console.log(`⏳ API keys not yet loaded, retrying in 200ms... (attempt ${retryCount + 1}/5)`);
                setTimeout(() => initializeAPIManager(retryCount + 1), 200);
                return;
            } else {
                console.error('❌ Failed to load API keys after 5 attempts');
            }
        }

        apiManager = new APIManager();
        window.apiManager = apiManager;
        console.log('✅ API Manager initialized successfully');
    }
}

// Make initializeAPIManager available globally
window.initializeAPIManager = initializeAPIManager;

// Debug function to check API configuration
window.debugAPIConfig = function () {
    console.log('=== API Configuration Debug ===');
    console.log('window.API_CONFIG:', window.API_CONFIG);
    console.log('API Manager exists:', !!window.apiManager);

    if (window.apiManager) {
        console.log('Groq configured:', window.apiManager.isGroqConfigured());
        console.log('Gemini configured:', window.apiManager.isGeminiConfigured());
        console.log('Current provider:', window.apiManager.currentProvider);
        console.log('Current model:', window.apiManager.currentModel);
        console.log('Provider status:', window.apiManager.getProviderStatus());
        
        // Show API key statistics
        window.apiManager.showAPIStatus();
    }

    return {
        configExists: !!window.API_CONFIG,
        apiManagerExists: !!window.apiManager,
        groqKey: window.API_CONFIG?.GROQ_API_KEY ? 'Present' : 'Missing',
        geminiKey: window.API_CONFIG?.GEMINI_API_KEY ? 'Present' : 'Missing'
    };
};

// Global function to show API status
window.showAPIStatus = function() {
    if (window.apiManager) {
        window.apiManager.showAPIStatus();
        return window.apiManager.getAPIStatus();
    } else {
        console.log('API Manager not initialized yet');
        return null;
    }
};

// Initialize when DOM is ready and API keys are loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        // Wait for API keys to be loaded before initializing
        setTimeout(initializeAPIManager, 100);
    });
} else {
    // DOM is already loaded, wait for API keys
    setTimeout(initializeAPIManager, 100);
}

// Utility function to check API configuration
function promptForApiKeys() {
    // Check if API manager is available
    if (!window.apiManager) {
        return `⚠️ **System Loading**\n\nPlease wait a moment for the system to initialize and try again.`;
    }

    const status = window.apiManager.getProviderStatus();

    // Since API keys are now pre-configured, only return error if there's a real configuration issue
    if (!status.groq.configured && !status.gemini.configured) {
        const message = `
❌ **API Configuration Error**

There seems to be an issue with the API configuration. Please check the configuration file or contact support.

Debug Info:
- Groq API Key: ${window.API_CONFIG?.GROQ_API_KEY ? 'Present' : 'Missing'}
- Gemini API Key: ${window.API_CONFIG?.GEMINI_API_KEY ? 'Present' : 'Missing'}
        `;

        return message;
    }

    return null;
}

// Export for global use
window.apiManager = apiManager;
window.promptForApiKeys = promptForApiKeys;