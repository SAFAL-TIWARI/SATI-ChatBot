// SATI ChatBot - API Integration for Groq and Gemini
// Direct API calls from JavaScript with smart response system

class APIManager {
    constructor() {
        // Serverless API Configuration
        this.groqConfig = {
            endpoint: window.API_CONFIG?.GROQ_API_ENDPOINT || '/api/groq',
            models: [
                // Production Models
                'llama-3.1-8b-instant',
                'llama-3.3-70b-versatile',
                // 'gemma2-9b-it',
                // 'llama-guard-3-8b',
                // 'llama3-70b-8192',
                // 'llama3-8b-8192',
                // 'whisper-large-v3',
                // 'whisper-large-v3-turbo',
                // 'distil-whisper-large-v3-en',

                // Preview Models
                'openai/gpt-oss-120b',
                'openai/gpt-oss-20b',
                // 'deepseek-r1-distill-llama-70b',
                'allam-2-7b',
                'meta-llama/llama-4-maverick-17b-128e-instruct',
                'meta-llama/llama-4-scout-17b-16e-instruct',
                'moonshotai/kimi-k2-instruct',
                'moonshotai/kimi-k2-instruct-0905',
                'meta-llama/llama-guard-4-12b',
                // 'meta-llama/llama-prompt-guard-2-22m',
                // 'meta-llama/llama-prompt-guard-2-86m',
                'qwen/qwen3-32b',
                // 'playai-tts',
                // 'playai-tts-arabic',

                // Preview Systems
                'compound-beta-mini',
                'compound-beta',
            ]
        };

        this.geminiConfig = {
            endpoint: window.API_CONFIG?.GEMINI_API_ENDPOINT || '/api/gemini',
            models: [
                'gemini-2.5-flash',
                'gemini-2.5-pro'

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
            // Handle special model instructions
            if (this.currentModel === 'playai-tts') {
                // For TTS models, provide usage instructions if the message seems like a question
                if (userMessage.includes('?') || userMessage.toLowerCase().includes('how') || userMessage.toLowerCase().includes('what')) {
                    return `🔊 **PlayAI TTS Model Selected**\n\nThis model is designed for **Text-to-Speech synthesis**. \n\n**How to use:**\n1. Type the text you want to be spoken\n2. The text will be converted to speech automatically\n3. Example: "Hello, this is a test of the text-to-speech feature"\n\n**Your message:** "${userMessage}"\n\n*Converting to speech...*`;
                }
            }

            if (this.currentModel.includes('whisper')) {
                return `🎤 **Whisper Model Selected**\n\nThis model is designed for **Speech-to-Text transcription**.\n\n**Note:** Audio file upload functionality is not yet implemented in this interface.\n\n**Your message:** "${userMessage}"\n\n*For now, please use regular chat models for text conversations.*`;
            }

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

            // Handle TTS models
            if (data.type === 'tts' && this.currentModel === 'playai-tts') {
                // Trigger text-to-speech synthesis
                this.handleTTSResponse(data.response);
                return `🔊 **Text-to-Speech Activated**\n\nSpeaking: "${data.response}"\n\n*The text above is being converted to speech using PlayAI TTS.*`;
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

        const model = this.currentModel.includes('gemini') ? this.currentModel : 'gemini-2.5-flash';
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
                const errorMessage = errorData.error || errorData.details || 'Unknown error';

                console.error('Gemini serverless API error:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorData,
                    errorMessage,
                    model: model,
                    retryCount: retryCount
                });

                // Handle 500 Internal Server Error with retry
                if (response.status === 500 && retryCount < maxRetries) {
                    const delay = baseDelay * Math.pow(2, retryCount);
                    console.log(`Gemini API internal error (500), retrying in ${delay}ms... (attempt ${retryCount + 1}/${maxRetries})`);

                    if (window.toast) {
                        window.toast.show(
                            `🔄 API error, retrying in ${Math.round(delay / 1000)}s... (${retryCount + 1}/${maxRetries})`,
                            'warning',
                            delay
                        );
                    }

                    await new Promise(resolve => setTimeout(resolve, delay));
                    return await this.sendGeminiMessage(prompt, controller, retryCount + 1);
                }

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

                    if (window.toast) {
                        window.toast.show(
                            `⏱️ Rate limited, retrying in ${Math.round(delay / 1000)}s... (${retryCount + 1}/${maxRetries})`,
                            'warning',
                            delay
                        );
                    }

                    await new Promise(resolve => setTimeout(resolve, delay));
                    return await this.sendGeminiMessage(prompt, controller, retryCount + 1);
                }

                throw new Error(`Gemini Serverless API Error: ${response.status} - ${errorMessage}`);
            }

            const data = await response.json();

            if (!data.success || !data.response) {
                throw new Error('Invalid response from Gemini serverless function');
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

    // Handle TTS response by triggering browser speech synthesis
    handleTTSResponse(text) {
        try {
            // Use the browser's built-in Speech Synthesis API
            if ('speechSynthesis' in window) {
                // Cancel any ongoing speech
                window.speechSynthesis.cancel();

                // Create a new utterance
                const utterance = new SpeechSynthesisUtterance(text);

                // Configure speech settings
                utterance.rate = 1.0;
                utterance.pitch = 1.0;
                utterance.volume = 1.0;

                // Try to use a high-quality voice if available
                const voices = window.speechSynthesis.getVoices();
                const preferredVoice = voices.find(voice =>
                    voice.name.includes('Google') ||
                    voice.name.includes('Microsoft') ||
                    voice.lang.startsWith('en')
                );

                if (preferredVoice) {
                    utterance.voice = preferredVoice;
                }

                // Add event listeners
                utterance.onstart = () => {
                    console.log('🔊 TTS: Speech started');
                    if (window.toast) {
                        window.toast.show('🔊 Speech synthesis started', 'info', 2000);
                    }
                };

                utterance.onend = () => {
                    console.log('🔊 TTS: Speech ended');
                };

                utterance.onerror = (event) => {
                    console.error('🔊 TTS Error:', event.error);
                    if (window.toast) {
                        window.toast.show('❌ Speech synthesis failed', 'error', 3000);
                    }
                };

                // Start speaking
                window.speechSynthesis.speak(utterance);

            } else {
                console.warn('🔊 TTS: Speech Synthesis not supported in this browser');
                if (window.toast) {
                    window.toast.show('⚠️ Speech synthesis not supported in this browser', 'warning', 4000);
                }
            }
        } catch (error) {
            console.error('🔊 TTS Error:', error);
            if (window.toast) {
                window.toast.show('❌ Speech synthesis error', 'error', 3000);
            }
        }
    }

    // Format model name for display
    formatModelName(modelName) {
        const modelInfo = {
            // Production Groq models
            'llama-3.1-8b-instant': 'Llama 3.1 8B (Latest)',
            'llama-3.3-70b-versatile': 'Llama 3.3 70B (Latest)',
            // 'gemma2-9b-it': 'Gemma2 9B (Latest)',
            // 'llama-guard-3-8b': 'Llama Guard 3 8B (Safety)',
            // 'llama3-70b-8192': 'Llama3 70B (Production)',
            // 'llama3-8b-8192': 'Llama3 8B (Production)',
            // 'whisper-large-v3': 'Whisper Large v3 (Audio)',
            // 'whisper-large-v3-turbo': 'Whisper Large v3 Turbo (Audio)',
            // 'distil-whisper-large-v3-en': 'Distil-Whisper Large v3 EN (Audio)',

            // Preview Groq models
            'openai/gpt-oss-120b': 'GPT OSS 120B',
            'openai/gpt-oss-20b': 'GPT OSS 20B',
            'allam-2-7b': 'Allam 2 7B ',
            // 'deepseek-r1-distill-llama-70b': 'DeepSeek R1 (Reasoning)',
            'meta-llama/llama-4-maverick-17b-128e-instruct': 'Llama 4 Maverick 17B (128K)',
            'meta-llama/llama-4-scout-17b-16e-instruct': 'Llama 4 Scout 17B (Instruct)',
            'moonshotai/kimi-k2-instruct': 'Kimi K2 Instruct',
            'moonshotai/kimi-k2-instruct-0905': 'Kimi K2 Instruct (0905)',
            'meta-llama/llama-guard-4-12b': 'Llama Guard 4 12B (Safety)',
            // 'meta-llama/llama-prompt-guard-2-22m': 'Llama Prompt Guard 2 22M (Lightweight)',
            // 'meta-llama/llama-prompt-guard-2-86m': 'Llama Prompt Guard 2 86M (Advanced)',
            'qwen/qwen3-32b': 'Qwen 3 32B (Multilingual)',
            // 'mistral-saba-24b': 'Mistral Saba 24B (Preview)',
            // 'playai-tts': 'PlayAI TTS (Text-to-Speech)',
            // 'playai-tts-arabic': 'PlayAI TTS Arabic (Text-to-Speech)',
            // 'qwen-qwq-32b': 'Qwen QwQ 32B (Advanced)',

            // Preview Systems
            'compound-beta-mini': 'Groq Compound Beta Mini (Ultra Fast)',
            'compound-beta': 'Groq Compound Beta (Fast)',

            // Existing Gemini models
            'gemini-2.5-flash': 'Gemini 2.5 Flash',
            'gemini-2.5-pro': 'Gemini 2.5 Pro'

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
            if (this.currentModel === 'gemini-2.5-flash') {
                alternatives.push({
                    provider: 'gemini',
                    model: 'gemini-2.5-pro',
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
                    model: 'gemini-2.5-flash',
                    reason: 'Google AI alternative'
                });
            }
        }

        return alternatives;
    }
}

// Initialize API Manager after DOM is loaded to ensure config is available
let apiManager;

// Function to initialize API Manager
function initializeAPIManager(retryCount = 0) {
    if (!apiManager) {
        // Check if API config is available
        // Modified to allow initialization if serverless functions are configured, even without client-side keys
        if (!window.API_CONFIG || (!window.API_CONFIG.GROQ_CONFIGURED && !window.API_CONFIG.GEMINI_CONFIGURED && !window.API_CONFIG.GROQ_API_KEY && !window.API_CONFIG.GEMINI_API_KEY)) {
            if (retryCount < 5) {
                console.log(`⏳ API configuration not ready, retrying in 200ms... (attempt ${retryCount + 1}/5)`);
                setTimeout(() => initializeAPIManager(retryCount + 1), 200);
                return;
            } else {
                console.error('❌ Failed to load API configuration after 5 attempts');
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
    }

    return {
        configExists: !!window.API_CONFIG,
        apiManagerExists: !!window.apiManager,
        groqKey: window.API_CONFIG?.GROQ_API_KEY ? 'Present' : 'Missing',
        geminiKey: window.API_CONFIG?.GEMINI_API_KEY ? 'Present' : 'Missing'
    };
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