// Global State Management
let supabase = null;

// Mobile APK Detection
function isRunningInMobileAPK() {
    // Check if running in Android WebView
    const userAgent = navigator.userAgent;
    const isAndroidWebView = userAgent.includes('wv') || // WebView indicator
                            userAgent.includes('Version/') && userAgent.includes('Chrome/') && userAgent.includes('Mobile') ||
                            window.AndroidInterface !== undefined || // Custom Android interface
                            userAgent.includes('SATIChatBot'); // Custom app identifier
    
    // Additional checks for WebView environment
    const isWebView = !window.chrome || // Chrome object not available in WebView
                     window.navigator.standalone === false; // iOS WebView check
    
    return isAndroidWebView || (isWebView && /Android/i.test(userAgent));
}

// Global flag for mobile APK
const IS_MOBILE_APK = isRunningInMobileAPK();

// Override speech synthesis in mobile APK
if (IS_MOBILE_APK && typeof window !== 'undefined') {
    console.log('🔇 Disabling speech synthesis for mobile APK');
    
    // Create a mock speech synthesis object
    const mockSpeechSynthesis = {
        speak: () => console.log('🔇 Speech synthesis disabled in mobile APK'),
        cancel: () => {},
        pause: () => {},
        resume: () => {},
        getVoices: () => [],
        speaking: false,
        pending: false,
        paused: false
    };
    
    // Override global speechSynthesis
    Object.defineProperty(window, 'speechSynthesis', {
        value: mockSpeechSynthesis,
        writable: false,
        configurable: false
    });
    
    // Override SpeechSynthesisUtterance constructor
    window.SpeechSynthesisUtterance = function(text) {
        console.log('🔇 SpeechSynthesisUtterance creation blocked in mobile APK');
        return {
            text: text || '',
            lang: 'en-US',
            voice: null,
            volume: 1,
            rate: 1,
            pitch: 1,
            onstart: null,
            onend: null,
            onerror: null,
            onpause: null,
            onresume: null,
            onmark: null,
            onboundary: null
        };
    };
}

// Function to hide voice features in mobile APK
function hideVoiceFeaturesForMobileAPK() {
    if (!IS_MOBILE_APK) return;
    
    console.log('🔇 Mobile APK detected, hiding voice features');
    
    // Hide voice mode buttons
    const voiceModeBtnDesktop = document.getElementById('voiceModeBtnDesktop');
    const voiceModeBtnMobile = document.getElementById('voiceModeBtnMobile');
    
    if (voiceModeBtnDesktop) {
        voiceModeBtnDesktop.style.display = 'none';
    }
    if (voiceModeBtnMobile) {
        voiceModeBtnMobile.style.display = 'none';
    }
    
    // Hide voice settings in general settings
    const voiceSettingsElements = [
        'voiceModelSetting',
        'testVoiceBtn',
        'voiceRateSlider',
        'voiceVolumeSlider', 
        'voicePitchSlider',
        'voiceSpeedSetting',
        'voiceVolumeSetting',
        'voicePitchSetting'
    ];
    
    voiceSettingsElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            // Hide the element and its parent container if it's a setting row
            const settingRow = element.closest('.setting-row') || 
                              element.closest('.setting-item') || 
                              element.closest('.voice-setting') ||
                              element.closest('.form-group') ||
                              element.closest('div[class*="voice"]');
            if (settingRow) {
                settingRow.style.display = 'none';
                settingRow.setAttribute('data-hidden-mobile-apk', 'true');
            } else {
                element.style.display = 'none';
                element.setAttribute('data-hidden-mobile-apk', 'true');
            }
        }
    });
    
    // Hide any voice-related sections or containers
    const voiceContainers = document.querySelectorAll('.voice-settings, .voice-controls, [data-voice], [class*="voice"]');
    voiceContainers.forEach(container => {
        // Only hide if it's specifically voice-related and not a general container
        if (container.id && (container.id.includes('voice') || container.id.includes('Voice'))) {
            container.style.display = 'none';
            container.setAttribute('data-hidden-mobile-apk', 'true');
        }
    });
    
    // Add CSS to hide voice-related elements more comprehensively
    const style = document.createElement('style');
    style.textContent = `
        /* Hide voice-related elements in mobile APK */
        body[data-mobile-apk="true"] .voice-mode-btn,
        body[data-mobile-apk="true"] #voiceModeBtnDesktop,
        body[data-mobile-apk="true"] #voiceModeBtnMobile,
        body[data-mobile-apk="true"] #testVoiceBtn,
        body[data-mobile-apk="true"] #voiceModelSetting,
        body[data-mobile-apk="true"] #voiceRateSlider,
        body[data-mobile-apk="true"] #voiceVolumeSlider,
        body[data-mobile-apk="true"] #voicePitchSlider,
        body[data-mobile-apk="true"] [data-voice],
        body[data-mobile-apk="true"] .voice-settings,
        body[data-mobile-apk="true"] .voice-controls {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
    
    // Add data attribute to body for CSS targeting
    document.body.setAttribute('data-mobile-apk', 'true');
    
    console.log('✅ Voice features hidden for mobile APK');
}

// Converts HEX to HSV, increases brightness, and converts back to HEX
function increaseBrightness(hex, increaseBy = 0.1) {
    const hsv = hexToHsv(hex);
    hsv.v = Math.min(1, hsv.v + increaseBy); // clamp to max 1
    return hsvToHex(hsv);
}

function hexToHsv(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }

    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;

    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h, s, v };
}

function hsvToHex({ h, s, v }) {
    let r, g, b;

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }

    const toHex = x => Math.round(x * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Initialize Supabase if credentials are available
function initializeSupabase() {
    try {
        console.log('🔄 Attempting to initialize Supabase...');
        console.log('window.supabase available:', !!window.supabase);
        console.log('SUPABASE_CONFIG configured:', !!window.SUPABASE_CONFIG?.CONFIGURED);

        // Ensure Supabase JS library is loaded
        if (!window.supabase) {
            console.error('❌ Supabase JS library not loaded');
            // Try to load it dynamically if not available
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/@supabase/supabase-js@2';
            script.onload = () => {
                console.log('✅ Supabase JS library loaded dynamically');
                // Retry initialization after script loads
                setTimeout(initializeSupabase, 500);
            };
            document.head.appendChild(script);
            return false;
        }

        if (window.supabase && window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.CONFIGURED) {
            const supabaseUrl = window.SUPABASE_CONFIG.URL;
            const supabaseKey = window.SUPABASE_CONFIG.KEY;

            console.log('Supabase URL configured:', !!supabaseUrl);
            console.log('Supabase Key available:', !!supabaseKey);

            if (supabaseUrl && supabaseKey) {
                // Create Supabase client
                supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
                console.log('✅ Supabase client initialized successfully');

                // Make supabase available globally for debugging
                window.supabaseClient = supabase;

                // Set up auth state listener (will be called later after function is defined)
                // We'll set up the listener in initializeApp after all functions are defined

                return true;
            } else {
                console.warn('⚠️ Supabase initialization failed - missing URL or KEY in SUPABASE_CONFIG');
                console.log('URL configured:', !!supabaseUrl, 'KEY configured:', !!supabaseKey);
            }
        } else {
            console.warn('⚠️ Supabase initialization skipped - configuration not loaded or not configured');
            console.log('window.supabase:', !!window.supabase);
            console.log('SUPABASE_CONFIG available:', !!window.SUPABASE_CONFIG);
            console.log('CONFIGURED:', !!window.SUPABASE_CONFIG?.CONFIGURED);
        }



        return false;
    } catch (err) {
        console.error('❌ Failed to initialize Supabase client:', err);
        return false;
    }
}

// Move listenForAuthChanges to global scope
function listenForAuthChanges() {
    try {
        if (!supabase) {
            console.error('Cannot listen for auth changes - Supabase not initialized');
            return;
        }
        console.log('Setting up Supabase auth listener');
        supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event, session);
            if (event === 'SIGNED_IN') {
                // Determine auth provider
                let authProvider = 'email';
                let profilePhoto = '';
                if (session.user.app_metadata && session.user.app_metadata.provider) {
                    authProvider = session.user.app_metadata.provider;
                }
                // Debug: print user_metadata for Google logins
                console.log('user_metadata:', session.user.user_metadata);
                // Extract profile photo from user_metadata
                if (session.user.user_metadata) {
                    if (authProvider === 'google') {
                        if (session.user.user_metadata.picture) {
                            profilePhoto = session.user.user_metadata.picture;
                        } else if (session.user.user_metadata.avatar_url) {
                            profilePhoto = session.user.user_metadata.avatar_url;
                        } else if (session.user.user_metadata.photo_url) {
                            profilePhoto = session.user.user_metadata.photo_url;
                        }
                    } else if (authProvider === 'github' && session.user.user_metadata.avatar_url) {
                        profilePhoto = session.user.user_metadata.avatar_url;
                    }
                }

                // Check if this is a fresh login or just a session restoration
                const isSessionRestoration = localStorage.getItem('sati_logged_in') === 'true' &&
                    localStorage.getItem('sati_username') === (session.user.email ? session.user.email.split('@')[0] : session.user.id);

                // Update user state
                chatState.isLoggedIn = true;
                let username = (session.user.user_metadata && session.user.user_metadata.username)
                    ? session.user.user_metadata.username
                    : (session.user.email ? session.user.email.split('@')[0] : session.user.id);
                chatState.username = username;
                chatState.email = session.user.email || '';
                chatState.authProvider = authProvider;
                chatState.profilePhoto = profilePhoto;
                chatState.saveState();

                // Initialize Supabase storage for authenticated user
                if (window.supabaseDB && window.supabaseDB.setCurrentUserEmail) {
                    window.supabaseDB.setCurrentUserEmail(session.user.email);
                    chatState.initSupabaseStorage();

                    // Load conversations from Supabase and update UI
                    chatState.loadConversationsFromSupabase().then(() => {
                        console.log('✅ Conversations loaded after login');
                    });

                    // Set up real-time subscriptions
                    if (window.supabaseDB.subscribeToConversations) {
                        const subscription = window.supabaseDB.subscribeToConversations((payload) => {
                            console.log('Real-time update received:', payload);
                            // Refresh conversations list when changes occur
                            chatState.loadConversationsFromSupabase();
                        });

                        // Store subscription for cleanup
                        chatState.supabaseSubscription = subscription;
                    }
                }

                // Update login statistics
                updateLoginStats();

                // Hide login modal
                modal.hide('loginModal');

                // Update UI
                updateLoginStatus();

                // Only show welcome modal and toast for fresh logins, not session restorations
                if (!isSessionRestoration) {
                    // Check if this is a fresh login triggered by user action
                    if (localStorage.getItem('sati_fresh_login') === '1') {
                        // Show welcome modal with a slight delay to ensure UI is ready
                        setTimeout(() => {
                            showWelcomeModal(chatState.username);
                        }, 500);

                        // Show success toast (only one)
                        toast.show('Logged in successfully', 'success');

                        // Clear the fresh login flag
                        localStorage.removeItem('sati_fresh_login');
                    }
                }
                afterLoginOrSignup();
            } else if (event === 'SIGNED_OUT') {
                console.log('User signed out');

                // Clean up Supabase storage and subscriptions
                if (chatState.supabaseSubscription) {
                    chatState.supabaseSubscription.unsubscribe();
                    chatState.supabaseSubscription = null;
                }

                // Reset Supabase storage
                chatState.useSupabaseStorage = false;
                if (window.supabaseDB && window.supabaseDB.setCurrentUserEmail) {
                    window.supabaseDB.setCurrentUserEmail(null);
                }

                // Clear conversations from UI and localStorage
                chatState.conversations = [];
                localStorage.removeItem('sati_conversations'); // Clear any stored conversations
                updateConversationsList();

                // Clear current chat messages and reset chat area
                chatState.currentConversationId = null;
                chatState.currentMessages = [];

                // Clear the chat area and show welcome message
                if (chatManager) {
                    chatManager.renderMessages();
                }

                // Reset chat title
                if (elements.chatTitle) {
                    elements.chatTitle.textContent = 'New Chat';
                }

            } else if (event === 'USER_UPDATED') {
                console.log('User updated');
            } else if (event === 'TOKEN_REFRESHED') {
                console.log('Token refreshed');
            }
        });
    } catch (err) {
        console.error('Error setting up auth listener:', err);
    }
}

// Make initializeSupabase available globally for config.js
window.initializeSupabase = initializeSupabase;

// Template Helper Functions
const templateHelper = {
    // Clone a template and return its content
    clone: (templateId) => {
        const template = document.getElementById(templateId);
        if (!template) {
            console.error(`Template with id '${templateId}' not found`);
            return null;
        }
        return template.content.cloneNode(true);
    },

    // Clone template and append to container
    appendTo: (templateId, container) => {
        const content = templateHelper.clone(templateId);
        if (content && container) {
            container.appendChild(content);
            return content;
        }
        return null;
    },

    // Clone template and replace container content
    replaceTo: (templateId, container) => {
        const content = templateHelper.clone(templateId);
        if (content && container) {
            container.innerHTML = '';
            container.appendChild(content);
            return content;
        }
        return null;
    }
};

class ChatBotState {
    constructor() {
        this.isLoggedIn = JSON.parse(localStorage.getItem('sati_logged_in') || 'false');
        this.username = localStorage.getItem('sati_username') || '';
        this.email = localStorage.getItem('sati_email') || '';
        this.authProvider = localStorage.getItem('sati_auth_provider') || '';
        this.profilePhoto = localStorage.getItem('sati_profile_photo') || '';
        this.settings = JSON.parse(localStorage.getItem('sati_settings') || '{}');
        this.theme = localStorage.getItem('sati_theme') || 'dark';
        this.isTyping = false;
        this.selectedModel = localStorage.getItem('sati_selected_model') || 'llama-3.1-8b-instant';
        this.useSupabaseStorage = false; // Will be set to true when user is logged in with Supabase

        // Initialize conversations based on login status
        if (this.isLoggedIn) {
            // For logged-in users, load conversations from localStorage (they'll be replaced by Supabase data)
            this.conversations = JSON.parse(localStorage.getItem('sati_conversations') || '[]');
        } else {
            // For guest users, start with empty conversations (no persistence)
            this.conversations = [];
        }

        this.currentConversationId = null;
        this.currentMessages = [];

        // Initialize default settings
        this.initializeDefaultSettings();

        // Initialize API provider - sync with settings
        this.apiProvider = this.settings.general?.apiProvider || localStorage.getItem('sati_api_provider') || 'groq';
        // Ensure settings and state are in sync
        if (this.settings.general) {
            this.settings.general.apiProvider = this.apiProvider;
        }

        // Apply theme
        this.applyTheme();

        // Apply font style
        this.applyFontStyle();

        // Apply appearance settings
        this.applyAppearanceSettings();

        // Validate model selection - prevent Gemini 1.5 Pro from being selected
        this.validateModelSelection();
    }

    // Initialize Supabase storage if user is logged in with Supabase
    initSupabaseStorage() {
        if (!supabase || !this.isLoggedIn) {
            console.log('❌ Supabase storage not initialized - not logged in or Supabase not available');
            this.useSupabaseStorage = false;
            return false;
        }

        // Initialize Supabase DB operations
        if (window.supabaseDB && window.supabaseDB.initialize) {
            try {
                const initialized = window.supabaseDB.initialize(supabase);
                this.useSupabaseStorage = initialized;
                console.log('✅ Supabase storage initialized:', initialized);

                if (initialized) {
                    console.log('🔄 Supabase DB functions available:', {
                        createConversation: !!window.supabaseDB.createConversation,
                        addMessage: !!window.supabaseDB.addMessage,
                        getUserConversations: !!window.supabaseDB.getUserConversations,
                        updateBookmarkStatus: !!window.supabaseDB.updateBookmarkStatus
                    });
                }

                return initialized;
            } catch (error) {
                console.error('❌ Error initializing Supabase storage:', error);
                this.useSupabaseStorage = false;
                return false;
            }
        }

        console.log('❌ Supabase DB operations not available');
        this.useSupabaseStorage = false;
        return false;
    }

    initializeDefaultSettings() {
        const defaultSettings = {
            general: {
                apiProvider: 'groq'
            },
            chat: {
                // Chat settings removed - will be available in future updates
            },
            accessibility: {
                fontStyle: 'Inter'
            },
            notifications: {
                // Notification settings removed - will be available in future updates
            },
            privacy: {
                // Only keeping the buttons functionality, no checkbox settings
            },
            appearance: {
                accentColor: '#10a37f',
                fontSize: 16
            }
        };

        this.settings = { ...defaultSettings, ...this.settings };
        this.saveSettings();
    }

    saveState() {
        // Only save conversations to localStorage for logged-in users
        if (this.isLoggedIn) {
            localStorage.setItem('sati_conversations', JSON.stringify(this.conversations));
        } else {
            // For guest users, don't save conversations to localStorage
            localStorage.removeItem('sati_conversations');
        }

        localStorage.setItem('sati_logged_in', JSON.stringify(this.isLoggedIn));
        localStorage.setItem('sati_username', this.username);
        localStorage.setItem('sati_email', this.email);
        localStorage.setItem('sati_auth_provider', this.authProvider);
        localStorage.setItem('sati_profile_photo', this.profilePhoto || '');
        localStorage.setItem('sati_theme', this.theme);
        localStorage.setItem('sati_selected_model', this.selectedModel);
        localStorage.setItem('sati_api_provider', this.apiProvider);
    }

    saveSettings() {
        localStorage.setItem('sati_settings', JSON.stringify(this.settings));
    }

    applyTheme() {
        let actualTheme = this.theme;

        // Handle system theme detection
        if (this.theme === 'system') {
            // Check if user's system prefers dark mode
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                actualTheme = 'dark';
            } else {
                actualTheme = 'light';
            }
        }

        document.documentElement.setAttribute('data-theme', actualTheme);

        // Listen for system theme changes if system theme is selected
        if (this.theme === 'system') {
            this.setupSystemThemeListener();
        }
    }

    setupSystemThemeListener() {
        // Remove existing listener if any
        if (this.systemThemeListener) {
            window.matchMedia('(prefers-color-scheme: dark)').removeListener(this.systemThemeListener);
        }

        // Create new listener
        this.systemThemeListener = (e) => {
            if (this.theme === 'system') {
                const actualTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', actualTheme);
            }
        };

        // Add listener for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addListener(this.systemThemeListener);
    }

    applyFontStyle() {
        const fontStyle = this.settings.accessibility?.fontStyle || 'Inter';
        document.documentElement.style.setProperty('--font-family', `'${fontStyle}', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`);
    }

    applyAppearanceSettings() {
        // Apply accent color
        const accentColor = this.settings.appearance?.accentColor || '#10a37f';
        document.documentElement.style.setProperty('--accent-color', accentColor);

        // Apply accent hover
        const accentHover = increaseBrightness(accentColor, 0.1);
        document.documentElement.style.setProperty('--accent-hover', accentHover);

        // Apply input focus color to match accent
        document.documentElement.style.setProperty('--input-focus', accentColor);

        // Force update of input-wrapper border color for focus-within
        const styleId = 'dynamic-accent-input-style';
        let styleTag = document.getElementById(styleId);
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = styleId;
            document.head.appendChild(styleTag);
        }
        styleTag.textContent = `.input-wrapper:focus-within { border-color: ${accentColor} !important; }`;

        // Apply font size
        const fontSize = this.settings.appearance?.fontSize || 16;
        document.documentElement.style.fontSize = fontSize + 'px';
    }

    validateModelSelection() {
        // Check if current model is Gemini 1.5 Pro with Gemini provider
        if (this.selectedModel === 'gemini-1.5-pro' && this.apiProvider === 'gemini') {
            // Switch to Gemini 1.5 Flash instead
            this.selectedModel = 'gemini-1.5-flash';
            this.saveState();
            console.log('⚠️ Gemini 1.5 Pro is not available yet. Switched to Gemini 1.5 Flash.');
        }
    }

    async createNewConversation(title = 'New Chat') {
        console.log('🔄 Creating new conversation:', {
            useSupabaseStorage: this.useSupabaseStorage,
            supabaseDB: !!window.supabaseDB,
            isLoggedIn: this.isLoggedIn,
            email: this.email
        });

        // If using Supabase storage and user is logged in
        if (this.useSupabaseStorage && window.supabaseDB) {
            try {
                console.log('✅ Creating conversation in Supabase...');
                const { data, error } = await window.supabaseDB.createConversation(title);

                if (error) {
                    console.error('❌ Error creating conversation in Supabase:', error);
                    // Fall back to local storage
                    return this.createLocalConversation(title);
                }

                console.log('✅ Conversation created in Supabase:', data);

                // Use the conversation from Supabase
                const conversation = {
                    id: data.id,
                    title: data.title,
                    messages: [],
                    createdAt: data.created_at,
                    updatedAt: data.updated_at
                };

                // Add to local cache
                this.conversations.unshift(conversation);
                this.currentConversationId = conversation.id;
                this.currentMessages = [];
                this.saveState();
                return conversation;

            } catch (err) {
                console.error('❌ Error in createNewConversation:', err);
                // Fall back to local storage
                return this.createLocalConversation(title);
            }
        } else {
            console.log('📱 Using local storage for conversation');
            // Use local storage
            return this.createLocalConversation(title);
        }
    }

    // Create conversation in local storage
    createLocalConversation(title = 'New Chat') {
        const conversation = {
            id: Date.now().toString(),
            title: title,
            messages: [],
            is_bookmarked: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.conversations.unshift(conversation);
        this.currentConversationId = conversation.id;
        this.currentMessages = [];
        this.saveState();
        return conversation;
    }

    async updateConversation(messages) {
        if (!this.currentConversationId) return;

        const conversation = this.conversations.find(c => c.id === this.currentConversationId);
        if (conversation) {
            conversation.messages = messages;
            conversation.updatedAt = new Date().toISOString();



            // Update conversation metadata in Supabase (messages are saved immediately when added)
            if (this.useSupabaseStorage && window.supabaseDB) {
                try {
                    // Update the conversation's updated_at timestamp
                    await window.supabaseDB.updateConversationTitle(
                        this.currentConversationId,
                        conversation.title
                    );
                    console.log('✅ Conversation metadata updated in Supabase');
                } catch (err) {
                    console.error('❌ Error updating conversation metadata in Supabase:', err);
                }
            }

            this.saveState();
        }
    }

    async deleteConversation(id) {
        // If using Supabase storage and user is logged in
        if (this.useSupabaseStorage && window.supabaseDB) {
            try {
                const { success, error } = await window.supabaseDB.deleteConversation(id);

                if (error) {
                    console.error('Error deleting conversation in Supabase:', error);
                    // Continue with local deletion anyway
                }
            } catch (err) {
                console.error('Error in deleteConversation:', err);
            }
        }

        // Always delete from local storage too
        this.conversations = this.conversations.filter(c => c.id !== id);
        if (this.currentConversationId === id) {
            this.currentConversationId = null;
            this.currentMessages = [];
        }
        this.saveState();
        updateChatStatistics();
    }

    async renameConversation(id, newTitle) {
        // If using Supabase storage and user is logged in
        if (this.useSupabaseStorage && window.supabaseDB) {
            try {
                const { success, error } = await window.supabaseDB.updateConversationTitle(id, newTitle);

                if (error) {
                    console.error('Error renaming conversation in Supabase:', error);
                    // Continue with local rename anyway
                }
            } catch (err) {
                console.error('Error in renameConversation:', err);
            }
        }

        // Always update local storage too
        const conversation = this.conversations.find(c => c.id === id);
        if (conversation) {
            conversation.title = newTitle;
            conversation.updatedAt = new Date().toISOString();
            this.saveState();
            return true;
        }
        return false;
    }

    async loadConversation(id) {
        // If using Supabase storage and user is logged in
        if (this.useSupabaseStorage && window.supabaseDB) {
            try {
                // Get messages from Supabase
                const { data: messages, error } = await window.supabaseDB.getConversationMessages(id);

                if (error) {
                    console.error('Error loading messages from Supabase:', error);
                    // Fall back to local storage
                } else if (messages && messages.length > 0) {
                    // Format messages for the app
                    const formattedMessages = messages.map(msg => ({
                        id: msg.id, // Include the message ID from Supabase
                        role: msg.role,
                        content: msg.content,
                        model: msg.model,
                        timestamp: new Date(msg.created_at).toISOString()
                    }));

                    // Update current conversation
                    this.currentConversationId = id;
                    this.currentMessages = formattedMessages;

                    // Find the conversation in local cache
                    const conversation = this.conversations.find(c => c.id === id);
                    if (conversation) {
                        // Update local cache
                        conversation.messages = formattedMessages;
                        return conversation;
                    } else {
                        // If not in local cache, create it
                        const { data: convData, error: convError } = await window.supabaseDB.getUserConversations();
                        if (!convError && convData) {
                            const matchingConv = convData.find(c => c.id === id);
                            if (matchingConv) {
                                const newConv = {
                                    id: matchingConv.id,
                                    title: matchingConv.title,
                                    messages: formattedMessages,
                                    createdAt: matchingConv.created_at,
                                    updatedAt: matchingConv.updated_at
                                };

                                // Add to local cache
                                this.conversations.push(newConv);
                                this.saveState();
                                updateChatStatistics();
                                return newConv;
                            }
                        }
                    }
                }
            } catch (err) {
                console.error('Error in loadConversation:', err);
                // Fall back to local storage
            }
        }

        // Fall back to local storage
        const conversation = this.conversations.find(c => c.id === id);
        if (conversation) {
            this.currentConversationId = id;
            this.currentMessages = conversation.messages;
            return conversation;
        }
        return null;
    }

    // Load all conversations from Supabase
    async loadConversationsFromSupabase() {
        if (!this.useSupabaseStorage || !window.supabaseDB) {
            console.log('📱 Not using Supabase storage or DB not available');
            return false;
        }

        try {
            console.log('🔄 Loading conversations from Supabase...');
            const { data, error } = await window.supabaseDB.getUserConversations();

            if (error) {
                console.error('❌ Error loading conversations from Supabase:', error);
                return false;
            }

            if (data && data.length > 0) {
                console.log('✅ Found conversations in Supabase:', data.length);

                // Convert to app format
                const conversations = data.map(conv => ({
                    id: conv.id,
                    title: conv.title,
                    messages: [], // Messages will be loaded when conversation is selected
                    createdAt: conv.created_at,
                    updatedAt: conv.updated_at,
                    is_bookmarked: conv.is_bookmarked || false // Include bookmark status
                }));

                // Replace local conversations with Supabase ones
                this.conversations = conversations;
                this.saveState();

                // Update the UI to show the loaded conversations
                updateConversationsList();

                // Also update saved chats list if modal is open
                const savedChatsModal = document.getElementById('savedChatsModal');
                if (savedChatsModal && savedChatsModal.classList.contains('show')) {
                    updateSavedChatsList();
                }

                console.log('✅ Conversations loaded and UI updated');
                return true;
            } else {
                console.log('📝 No conversations found in Supabase');
                // Clear local conversations if none in Supabase
                this.conversations = [];
                this.saveState();
                updateConversationsList();
                return true;
            }

        } catch (err) {
            console.error('❌ Error in loadConversationsFromSupabase:', err);
            return false;
        }
    }
}


// Initialize global state
const chatState = new ChatBotState();

// Ensure API manager is initialized when the page loads
document.addEventListener('DOMContentLoaded', function () {
    // Hide voice features for mobile APK
    hideVoiceFeaturesForMobileAPK();
    
    // Wait a bit for all scripts to load
    setTimeout(() => {
        if (window.apiManager) {
            console.log('✅ SATI ChatBot initialized successfully');
            updateMainModelSelect(); // Initialize model selection
        } else {
            console.warn('⚠️ API Manager not yet available, retrying...');
            // Retry after another second
            setTimeout(() => {
                if (window.apiManager) {
                    console.log('✅ SATI ChatBot initialized successfully (retry)');
                    updateMainModelSelect();
                }
            }, 1000);
        }
    }, 500);
});


// DOM Elements - will be initialized after DOM is ready
let elements = {};

// Initialize DOM elements
function initializeElements() {
    elements = {
        // Sidebar
        sidebar: document.getElementById('sidebar'),
        sidebarToggle: document.getElementById('sidebarToggle'),
        logoContainer: document.querySelector('.logo-container'),
        appName: document.querySelector('.app-name'),
        newChatBtn: document.getElementById('newChatBtn'),
        resourcesBtn: document.getElementById('resourcesBtn'),
        searchInput: document.getElementById('searchInput'),
        conversationsList: document.getElementById('conversationsList'),
        savedChatsBtn: document.getElementById('savedChatsBtn'),

        // Main content
        chatTitle: document.getElementById('chatTitle'),
        chatMessages: document.getElementById('chatMessages'),
        typingIndicator: document.getElementById('typingIndicator'),
        messageInput: document.getElementById('messageInput'),
        sendBtn: document.getElementById('sendBtn'),
        stopBtn: document.getElementById('stopBtn'),
        micBtn: document.getElementById('micBtn'),
        voiceModeBtn: document.getElementById('voiceModeBtn'), // Legacy - will be null
        voiceModeBtnDesktop: document.getElementById('voiceModeBtnDesktop'),
        voiceModeBtnMobile: document.getElementById('voiceModeBtnMobile'),
        modelSelect: document.getElementById('modelSelect'),

        // Top bar
        shareBtn: document.getElementById('shareBtn'),
        profileAvatar: document.getElementById('profileAvatar'),
        profileDropdown: document.getElementById('profileDropdown'),

        // Modals
        settingsModal: document.getElementById('settingsModal'),
        customizeModal: document.getElementById('customizeModal'),
        loginModal: document.getElementById('loginModal'),
        confirmModal: document.getElementById('confirmModal'),
        renameModal: document.getElementById('renameModal'),

        // Toast container
        toastContainer: document.getElementById('toastContainer')
    };

    console.log('✅ DOM elements initialized');
    console.log('Toast container found:', !!elements.toastContainer);
}



// Utility Functions
const utils = {
    formatTime: (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },

    formatDate: (date) => {
        const now = new Date();
        const messageDate = new Date(date);
        const diffTime = Math.abs(now - messageDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Today';
        if (diffDays === 2) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays} days ago`;

        return messageDate.toLocaleDateString();
    },

    generateId: () => {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    },

    escapeHtml: (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    unescapeHtml: (text) => {
        const div = document.createElement('div');
        div.innerHTML = text;
        return div.textContent || div.innerText || '';
    },

    parseMarkdown: (text) => {
        // Enhanced markdown parsing with code blocks, tables, and structured content
        let html = text;

        // Process code blocks first (```language\ncode\n```)
        html = html.replace(/```([a-zA-Z0-9+#\-_.]*)\n?([\s\S]*?)```/g, (match, language, code) => {
            const lang = language || 'text';
            const langDisplay = utils.getLanguageDisplay(lang);
            const codeId = 'code-' + Math.random().toString(36).substr(2, 9);
            
            // Since the entire text is already escaped, we need to unescape the code content
            // to avoid double-escaping, then escape it properly for display
            const unescapedCode = utils.unescapeHtml(code.trim());
            const properlyEscapedCode = utils.escapeHtml(unescapedCode);

            return `
                <div class="code-block-container">
                    <div class="code-block-header">
                        <div class="code-language">
                            <i class="fas fa-code code-language-icon"></i>
                            ${langDisplay}
                        </div>
                        <div class="code-block-actions">
                            <button class="code-action-btn copy-code-btn" data-code-id="${codeId}" title="Copy code">
                                <i class="fas fa-copy"></i>
                                Copy
                            </button>
                        </div>
                    </div>
                    <div class="code-block-content">
                        <pre><code id="${codeId}" class="language-${lang}">${properlyEscapedCode}</code></pre>
                    </div>
                </div>
            `;
        });

        // Process tables (|header|header|\n|------|------|\n|cell|cell|)
        html = html.replace(/(\|.*\|[\r\n]+\|[-\s|:]+\|[\r\n]+((\|.*\|[\r\n]*)+))/g, (match) => {
            const lines = match.trim().split('\n');
            const headers = lines[0].split('|').filter(cell => cell.trim()).map(cell => cell.trim());
            const rows = lines.slice(2).map(line =>
                line.split('|').filter(cell => cell.trim()).map(cell => cell.trim())
            );

            let tableHtml = '<div class="message-table-container"><table class="message-table">';

            // Headers
            tableHtml += '<thead><tr>';
            headers.forEach(header => {
                const unescapedHeader = utils.unescapeHtml(header);
                const properlyEscapedHeader = utils.escapeHtml(unescapedHeader);
                tableHtml += `<th>${properlyEscapedHeader}</th>`;
            });
            tableHtml += '</tr></thead>';

            // Rows
            tableHtml += '<tbody>';
            rows.forEach(row => {
                tableHtml += '<tr>';
                row.forEach((cell, index) => {
                    const headerLabel = headers[index] || `Column ${index + 1}`;
                    const unescapedHeaderLabel = utils.unescapeHtml(headerLabel);
                    const properlyEscapedHeaderLabel = utils.escapeHtml(unescapedHeaderLabel);
                    const unescapedCell = utils.unescapeHtml(cell);
                    const properlyEscapedCell = utils.escapeHtml(unescapedCell);
                    tableHtml += `<td data-label="${properlyEscapedHeaderLabel}">${properlyEscapedCell}</td>`;
                });
                tableHtml += '</tr>';
            });
            tableHtml += '</tbody></table></div>';

            return tableHtml;
        });

        // Process step-by-step instructions (1. Step one\n2. Step two)
        html = html.replace(/(?:^|\n)(\d+)\.\s+(.+?)(?=\n\d+\.|$)/gs, (match, ...args) => {
            const steps = [];
            let stepMatch;
            const stepRegex = /(\d+)\.\s+(.+?)(?=\n\d+\.|$)/gs;

            while ((stepMatch = stepRegex.exec(match)) !== null) {
                steps.push({
                    number: stepMatch[1],
                    content: stepMatch[2].trim()
                });
            }

            if (steps.length > 1) {
                let stepsHtml = '<div class="steps-container">';
                steps.forEach(step => {
                    stepsHtml += `
                        <div class="step-item">
                            <div class="step-number">${step.number}</div>
                            <div class="step-content">
                                <div class="step-description">${utils.escapeHtml(utils.unescapeHtml(step.content))}</div>
                            </div>
                        </div>
                    `;
                });
                stepsHtml += '</div>';
                return stepsHtml;
            }
            return match;
        });

        // Process alerts/notices (> [!NOTE] content or > [!WARNING] content)
        html = html.replace(/>\s*\[!(NOTE|WARNING|ERROR|INFO|SUCCESS)\]\s*([\s\S]*?)(?=\n(?!>)|$)/gi, (match, type, content) => {
            const alertType = type.toLowerCase();
            const icons = {
                note: 'fas fa-info-circle',
                info: 'fas fa-info-circle',
                warning: 'fas fa-exclamation-triangle',
                error: 'fas fa-times-circle',
                success: 'fas fa-check-circle'
            };

            return `
                <div class="alert-box ${alertType}">
                    <i class="alert-icon ${icons[alertType] || icons.info}"></i>
                    <div class="alert-content">${utils.escapeHtml(utils.unescapeHtml(content.trim()))}</div>
                </div>
            `;
        });

        // Process blockquotes (> content)
        html = html.replace(/^>\s*(.+)$/gm, '<blockquote>$1</blockquote>');

        // Process headers (# Header, ## Header, etc.)
        html = html.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, content) => {
            const level = hashes.length;
            const unescapedContent = utils.unescapeHtml(content);
            const properlyEscapedContent = utils.escapeHtml(unescapedContent);
            return `<h${level}>${properlyEscapedContent}</h${level}>`;
        });

        // Process bold text (**text** or __text__)
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

        // Process italic text (*text* or _text_)
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/_(.*?)_/g, '<em>$1</em>');

        // Process inline code (`code`)
        html = html.replace(/`([^`]+)`/g, (match, code) => {
            // Since the entire text is already escaped, we need to unescape the code content
            // to avoid double-escaping, then escape it properly for display
            const unescapedCode = utils.unescapeHtml(code);
            const properlyEscapedCode = utils.escapeHtml(unescapedCode);
            return `<code>${properlyEscapedCode}</code>`;
        });

        // Process links ([text](url))
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

        // Process line breaks
        html = html.replace(/\n/g, '<br>');

        return html;
    },

    getLanguageDisplay: (lang) => {
        const languages = {
            'javascript': 'JavaScript',
            'js': 'JavaScript',
            'typescript': 'TypeScript',
            'ts': 'TypeScript',
            'python': 'Python',
            'py': 'Python',
            'java': 'Java',
            'cpp': 'C++',
            'c++': 'C++',
            'c': 'C',
            'csharp': 'C#',
            'c#': 'C#',
            'cs': 'C#',
            'php': 'PHP',
            'ruby': 'Ruby',
            'go': 'Go',
            'rust': 'Rust',
            'swift': 'Swift',
            'kotlin': 'Kotlin',
            'html': 'HTML',
            'css': 'CSS',
            'scss': 'SCSS',
            'sass': 'Sass',
            'json': 'JSON',
            'xml': 'XML',
            'yaml': 'YAML',
            'yml': 'YAML',
            'sql': 'SQL',
            'bash': 'Bash',
            'sh': 'Shell',
            'powershell': 'PowerShell',
            'ps1': 'PowerShell',
            'dockerfile': 'Dockerfile',
            'markdown': 'Markdown',
            'md': 'Markdown',
            'text': 'Text',
            'txt': 'Text',
            'objective-c': 'Objective-C',
            'objc': 'Objective-C',
            'f#': 'F#',
            'fsharp': 'F#'
        };

        return languages[lang.toLowerCase()] || lang.toUpperCase();
    },

    copyCodeToClipboard: async (code, button) => {
        try {
            await navigator.clipboard.writeText(code);

            // Visual feedback
            const originalContent = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Copied!';
            button.classList.add('copied');

            setTimeout(() => {
                button.innerHTML = originalContent;
                button.classList.remove('copied');
            }, 2000);

            // Show toast notification
            if (window.toast) {
                window.toast.show('Code copied to clipboard!', 'success', 2000);
            }
        } catch (err) {
            console.error('Failed to copy code:', err);

            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = code;
            document.body.appendChild(textArea);
            textArea.select();

            try {
                document.execCommand('copy');
                if (window.toast) {
                    window.toast.show('Code copied to clipboard!', 'success', 2000);
                }
            } catch (fallbackErr) {
                console.error('Fallback copy failed:', fallbackErr);
                if (window.toast) {
                    window.toast.show('Failed to copy code', 'error', 3000);
                }
            }

            document.body.removeChild(textArea);
        }
    },

    // Progressive markdown rendering for streaming responses
    renderProgressiveMarkdown: (text, container) => {
        // For now, just use the regular parseMarkdown
        // In the future, this could be enhanced to handle partial code blocks, etc.
        container.innerHTML = utils.parseMarkdown(utils.escapeHtml(text));

        // Apply syntax highlighting to any new code blocks
        setTimeout(() => {
            if (window.Prism) {
                const codeBlocks = container.querySelectorAll('pre code');
                codeBlocks.forEach(block => {
                    if (!block.classList.contains('prism-highlighted')) {
                        window.Prism.highlightElement(block);
                        block.classList.add('prism-highlighted');
                    }
                });
            }
        }, 0);

        // Re-attach event listeners for new copy buttons
        const copyCodeBtns = container.querySelectorAll('.copy-code-btn:not([data-listener-attached])');
        copyCodeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const codeId = btn.getAttribute('data-code-id');
                const codeElement = document.getElementById(codeId);
                if (codeElement) {
                    utils.copyCodeToClipboard(codeElement.textContent, btn);
                }
            });
            btn.setAttribute('data-listener-attached', 'true');
        });
    },

    // Detect and enhance specific types of responses
    enhanceResponseFormatting: (content) => {
        // Detect if response contains code and add appropriate formatting hints
        if (content.includes('```') || content.includes('function') || content.includes('class ') || content.includes('import ') || content.includes('export ')) {
            // This is likely a code-heavy response
            return content;
        }

        // Detect if response contains tabular data and suggest table formatting
        if (content.includes('|') && content.split('\n').filter(line => line.includes('|')).length > 2) {
            // This might be tabular data
            return content;
        }

        // Detect step-by-step instructions
        const stepPattern = /^\d+\.\s/gm;
        const stepMatches = content.match(stepPattern);
        if (stepMatches && stepMatches.length > 2) {
            // This is likely a step-by-step guide
            return content;
        }

        return content;
    }
};

// Voice Recognition System
class VoiceRecognition {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.isSupported = false;
        this.currentTranscript = '';
        this.finalTranscript = '';

        this.initializeRecognition();
    }

    initializeRecognition() {
        // Check for browser support
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.isSupported = true;
        } else if ('SpeechRecognition' in window) {
            this.recognition = new SpeechRecognition();
            this.isSupported = true;
        } else {
            console.warn('Speech recognition not supported in this browser');
            return;
        }

        // Configure recognition settings
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        this.recognition.maxAlternatives = 1;

        // Set up event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (!this.recognition) return;

        this.recognition.onstart = () => {
            console.log('🎤 Voice recognition started');
            this.isListening = true;
            this.updateMicButton(true);
            this.showVoiceIndicator();
        };

        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;

                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            // Update the input field with real-time transcription
            this.updateInputField(finalTranscript, interimTranscript);
        };

        this.recognition.onend = () => {
            console.log('🎤 Voice recognition ended');
            this.isListening = false;
            this.updateMicButton(false);
            this.hideVoiceIndicator();
        };

        this.recognition.onerror = (event) => {
            console.error('🎤 Voice recognition error:', event.error);
            this.isListening = false;
            this.updateMicButton(false);
            this.hideVoiceIndicator();

            // Show user-friendly error messages
            let errorMessage = 'Voice recognition error occurred.';
            switch (event.error) {
                case 'no-speech':
                    errorMessage = 'No speech detected. Please try again.';
                    break;
                case 'audio-capture':
                    errorMessage = 'Microphone not accessible. Please check permissions.';
                    break;
                case 'not-allowed':
                    errorMessage = 'Microphone access denied. Please allow microphone access.';
                    break;
                case 'network':
                    errorMessage = 'Network error occurred during voice recognition.';
                    break;
            }

            if (window.toast) {
                window.toast.show(errorMessage, 'error');
            }
        };
    }

    startListening() {
        if (!this.isSupported) {
            if (window.toast) {
                window.toast.show('Voice recognition is not supported in this browser.', 'error');
            }
            return;
        }

        if (this.isListening) {
            this.stopListening();
            return;
        }

        try {
            this.currentTranscript = '';
            this.finalTranscript = '';

            // Clear the input field when starting voice recognition
            if (elements.messageInput) {
                elements.messageInput.value = '';
                elements.messageInput.style.height = 'auto';
            }

            this.recognition.start();
        } catch (error) {
            console.error('Error starting voice recognition:', error);
            if (window.toast) {
                window.toast.show('Failed to start voice recognition.', 'error');
            }
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    updateInputField(finalText, interimText) {
        if (!elements.messageInput) return;

        // Combine final and interim text
        const fullText = (this.finalTranscript + finalText + interimText).trim();

        // Update the textarea
        elements.messageInput.value = fullText;

        // Store final transcript for next iteration
        if (finalText) {
            this.finalTranscript += finalText;
        }

        // Auto-resize textarea
        elements.messageInput.style.height = 'auto';
        elements.messageInput.style.height = elements.messageInput.scrollHeight + 'px';

        // Focus the input
        elements.messageInput.focus();

        // Set cursor to end
        elements.messageInput.setSelectionRange(elements.messageInput.value.length, elements.messageInput.value.length);
    }

    updateMicButton(isActive) {
        if (!elements.micBtn) return;

        const icon = elements.micBtn.querySelector('i');
        if (isActive) {
            elements.micBtn.classList.add('recording');
            elements.micBtn.title = 'Stop recording';
            if (icon) {
                icon.className = 'fas fa-stop';
            }
        } else {
            elements.micBtn.classList.remove('recording');
            elements.micBtn.title = 'Voice input';
            if (icon) {
                icon.className = 'fas fa-microphone';
            }
        }
    }

    showVoiceIndicator() {
        // Create or show voice indicator
        let indicator = document.getElementById('voiceIndicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'voiceIndicator';
            indicator.className = 'voice-indicator';
            indicator.innerHTML = `
                <div class="voice-indicator-content">
                    <div class="voice-wave">
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                    </div>
                    <span class="voice-text">Listening...</span>
                </div>
            `;

            // Add to input area
            const inputArea = document.querySelector('.input-area');
            if (inputArea) {
                inputArea.appendChild(indicator);
            }
        }

        indicator.style.display = 'flex';
        setTimeout(() => {
            indicator.classList.add('show');
        }, 10);
    }

    hideVoiceIndicator() {
        const indicator = document.getElementById('voiceIndicator');
        if (indicator) {
            indicator.classList.remove('show');
            setTimeout(() => {
                indicator.style.display = 'none';
            }, 300);
        }
    }
}

// Voice Mode System
class VoiceMode {
    constructor() {
        this.isActive = false;
        this.isListening = false;
        this.isSpeaking = false;
        this.isMuted = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.currentUtterance = null;
        this.conversationHistory = [];
        
        this.initializeVoiceMode();
    }

    updateVoiceSettings() {
        // This method is called when voice settings are changed in the settings panel
        // It doesn't need to do anything special since the settings are read dynamically
        // in the speakText method, but we can use it for any future voice setting updates
        console.log('🔊 Voice settings updated');
    }

    initializeVoiceMode() {
        // Check for browser support
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('Speech recognition not supported');
            return;
        }

        if (!('speechSynthesis' in window)) {
            console.warn('Speech synthesis not supported');
            return;
        }

        // Initialize speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.setupEventListeners();
    }

    setupEventListeners() {
        if (!this.recognition) return;

        // Speech recognition events
        this.recognition.onstart = () => {
            console.log('🎤 Voice mode listening started');
            this.isListening = true;
            this.updateVoiceOrb('listening');
            this.updateStatus('Listening...');
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.trim();
            console.log('🎤 Voice input received:', transcript);
            console.log('🎤 Current state - isSpeaking:', this.isSpeaking, 'isActive:', this.isActive);
            
            // Ignore speech input while AI is speaking to prevent feedback
            if (this.isSpeaking) {
                console.log('🎤 Ignoring voice input while AI is speaking to prevent feedback');
                return;
            }
            
            if (transcript && this.isActive) {
                this.handleUserSpeech(transcript);
            }
        };

        this.recognition.onend = () => {
            console.log('🎤 Voice recognition ended');
            this.isListening = false;
            
            if (this.isActive) {
                if (!this.isSpeaking) {
                    this.updateVoiceOrb('idle');
                    this.updateStatus('Ready');
                    
                    // If we're not speaking, restart listening after a short delay
                    // This handles cases where recognition ends without speech synthesis
                    setTimeout(() => {
                        if (this.isActive && !this.isSpeaking && !this.isListening && !this.isMuted) {
                            console.log('🎤 Auto-restarting listening after recognition ended');
                            this.startListening();
                        }
                    }, 1000);
                }
            }
        };

        this.recognition.onerror = (event) => {
            console.error('🎤 Voice recognition error:', event.error);
            this.isListening = false;
            
            if (this.isActive) {
                this.updateVoiceOrb('idle');
                
                // Handle different types of errors
                if (event.error === 'not-allowed') {
                    this.updateStatus('Microphone access denied');
                    this.addVoiceMessage('system', 'Please allow microphone access to use voice mode.');
                } else if (event.error === 'no-speech') {
                    this.updateStatus('No speech detected');
                    // Auto-retry for no-speech errors
                    setTimeout(() => {
                        if (this.isActive && !this.isSpeaking && !this.isMuted) {
                            console.log('🎤 Auto-restarting after no-speech error');
                            this.startListening();
                        }
                    }, 1000);
                } else {
                    this.updateStatus('Error - Try again');
                    // Auto-retry after a short delay for other errors
                    setTimeout(() => {
                        if (this.isActive && !this.isSpeaking && !this.isMuted) {
                            console.log('🎤 Auto-restarting after error:', event.error);
                            this.startListening();
                        }
                    }, 2000);
                }
            }
        };

        // Speech synthesis events
        if (this.synthesis) {
            this.synthesis.addEventListener('voiceschanged', () => {
                console.log('🔊 Voices loaded');
            });
        }
        
        // Add click handler to voice orb for manual restart
        const voiceOrb = document.getElementById('voiceOrb');
        if (voiceOrb) {
            voiceOrb.addEventListener('click', () => {
                if (this.isActive && !this.isListening && !this.isSpeaking && !this.isMuted) {
                    console.log('🎤 Manual restart via voice orb click');
                    this.startListening();
                }
            });
            
            // Add double-click handler to manually trigger speech of last assistant message (for testing)
            voiceOrb.addEventListener('dblclick', () => {
                if (this.isActive) {
                    console.log('🔊 Manual trigger: Finding last assistant message to speak');
                    const chatMessages = document.getElementById('chatMessages');
                    if (chatMessages) {
                        const messages = Array.from(chatMessages.children);
                        const lastAssistantMessage = messages.reverse().find(msg => 
                            msg.querySelector('.assistant-message')
                        );
                        
                        if (lastAssistantMessage) {
                            const messageText = lastAssistantMessage.querySelector('.message-text');
                            if (messageText) {
                                const responseText = messageText.textContent || messageText.innerText;
                                const cleanResponse = responseText.replace(/\s+/g, ' ').trim();
                                
                                if (cleanResponse) {
                                    console.log('🔊 Manual trigger: Speaking last assistant message');
                                    console.log('🔊 Manual trigger: Text to speak:', cleanResponse.substring(0, 100) + '...');
                                    this.speakText(cleanResponse);
                                } else {
                                    console.log('🔊 Manual trigger: No clean response found');
                                    // Test with a simple message
                                    this.speakText('This is a test message to verify speech synthesis is working.');
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    async activate() {
        if (this.isActive) return;

        console.log('🎙️ Activating voice mode');
        this.isActive = true;
        this.conversationHistory = [];

        // Create a new conversation if one doesn't exist
        if (!chatState.currentConversationId) {
            console.log('🔄 No active conversation, creating new one for voice mode...');
            try {
                await chatState.createNewConversation('Voice Chat Session');
                console.log('✅ New conversation created for voice mode:', chatState.currentConversationId);
                
                // Update conversations list in sidebar
                if (typeof updateConversationsList === 'function') {
                    updateConversationsList();
                }
            } catch (error) {
                console.error('❌ Error creating conversation for voice mode:', error);
            }
        } else {
            console.log('📝 Using existing conversation for voice mode:', chatState.currentConversationId);
        }

        // Show voice mode modal
        const modal = document.getElementById('voiceModeModal');
        const voiceModeBtnDesktop = document.getElementById('voiceModeBtnDesktop');
        const voiceModeBtnMobile = document.getElementById('voiceModeBtnMobile');
        
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('show'), 10);
        }

        // Add active class to both voice mode buttons
        if (voiceModeBtnDesktop) {
            voiceModeBtnDesktop.classList.add('active');
        }
        if (voiceModeBtnMobile) {
            voiceModeBtnMobile.classList.add('active');
        }

        // Initialize voice mode UI
        this.updateStatus('Ready');
        this.updateVoiceOrb('idle');
        this.clearVoiceMessages();

        // Add and speak welcome message
        const welcomeMessage = 'Hello! I\'m ready to chat with you. What would you like to know about S A T I?';
        this.addVoiceMessage('assistant', welcomeMessage);
        
        // Start periodic check to ensure continuous conversation
        this.startPeriodicCheck();
        
        // Request microphone permissions first
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(() => {
                    console.log('🎤 Microphone permission granted');
                    // Speak welcome message and then start listening
                    this.speakText(welcomeMessage);
                })
                .catch((error) => {
                    console.error('🎤 Microphone permission denied:', error);
                    this.updateStatus('Microphone access required');
                    // Still try to speak the welcome message
                    this.speakText(welcomeMessage);
                });
        } else {
            // Fallback for browsers without getUserMedia
            this.speakText(welcomeMessage);
        }
    }

    startPeriodicCheck() {
        // Clear any existing interval
        if (this.periodicCheckInterval) {
            clearInterval(this.periodicCheckInterval);
        }
        
        // Check every 3 seconds if we should be listening but aren't
        this.periodicCheckInterval = setInterval(() => {
            if (this.isActive && !this.isListening && !this.isSpeaking && !this.isMuted) {
                console.log('🔄 Periodic check: Restarting listening');
                this.startListening();
            }
        }, 3000);
    }

    deactivate() {
        if (!this.isActive) return;

        console.log('🎙️ Deactivating voice mode');
        
        // Clear periodic check
        if (this.periodicCheckInterval) {
            clearInterval(this.periodicCheckInterval);
            this.periodicCheckInterval = null;
        }
        this.isActive = false;
        this.isListening = false;
        this.isSpeaking = false;

        // Stop any ongoing speech recognition
        if (this.recognition) {
            this.recognition.stop();
        }

        // Stop any ongoing speech synthesis
        if (this.synthesis) {
            this.synthesis.cancel();
        }

        // Clear any listening timeout
        if (this.listeningTimeout) {
            clearTimeout(this.listeningTimeout);
            this.listeningTimeout = null;
        }

        // Hide voice mode modal
        const modal = document.getElementById('voiceModeModal');
        const voiceModeBtnDesktop = document.getElementById('voiceModeBtnDesktop');
        const voiceModeBtnMobile = document.getElementById('voiceModeBtnMobile');
        
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.style.display = 'none', 300);
        }

        // Remove active class from both voice mode buttons
        if (voiceModeBtnDesktop) {
            voiceModeBtnDesktop.classList.remove('active');
        }
        if (voiceModeBtnMobile) {
            voiceModeBtnMobile.classList.remove('active');
        }

        this.conversationHistory = [];
    }

    startListening() {
        console.log('🎤 startListening called - isActive:', this.isActive, 'isListening:', this.isListening, 'isSpeaking:', this.isSpeaking, 'isMuted:', this.isMuted);
        
        if (!this.isActive || this.isListening || this.isSpeaking || this.isMuted) {
            console.log('🎤 startListening blocked - conditions not met');
            return;
        }

        try {
            console.log('🎤 Starting voice recognition...');
            this.isListening = true;
            this.updateVoiceOrb('listening');
            this.updateStatus('Listening...');
            
            // Set a timeout to automatically stop listening after 30 seconds
            this.listeningTimeout = setTimeout(() => {
                if (this.isListening && this.isActive) {
                    console.log('🎤 Listening timeout reached');
                    this.addVoiceMessage('system', 'Listening timeout. I\'m ready when you are.');
                    this.isListening = false;
                    this.updateVoiceOrb('idle');
                    this.updateStatus('Ready');
                }
            }, 30000);
            
            this.recognition.start();
        } catch (error) {
            console.error('Error starting voice recognition:', error);
            this.isListening = false;
            this.updateVoiceOrb('idle');
            this.updateStatus('Error');
            this.addVoiceMessage('system', 'Error starting voice recognition. Please try again.');
        }
    }

    async handleUserSpeech(transcript) {
        console.log('🎤 handleUserSpeech called with:', transcript);
        
        // Stop any ongoing AI speech when user starts speaking
        if (this.synthesis && this.isSpeaking) {
            console.log('🎤 Stopping AI speech because user is speaking');
            this.synthesis.cancel();
            this.isSpeaking = false;
        }
        
        // Add user message to voice chat
        this.addVoiceMessage('user', transcript);
        
        // Update status
        this.updateStatus('Thinking...');
        this.updateVoiceOrb('thinking');

        try {
            // Ensure we have a conversation
            if (!chatState.currentConversationId) {
                console.log('🔄 Creating new conversation for voice message...');
                await chatState.createNewConversation('Voice Chat Session');
                if (typeof updateConversationsList === 'function') {
                    updateConversationsList();
                }
            }

            // Send message through the main chat system
            console.log('🎤 Sending voice message through main chat system:', transcript);
            
            // Add to main chat input and trigger send
            if (elements.messageInput) {
                elements.messageInput.value = transcript;
                
                // Trigger the main chat send function
                if (typeof sendMessage === 'function') {
                    await sendMessage();
                } else {
                    // Fallback: use chatManager directly
                    await chatManager.sendMessage(transcript, chatState.selectedModel);
                }
            } else {
                // Fallback: use chatManager directly
                await chatManager.sendMessage(transcript, chatState.selectedModel);
            }
            
        } catch (error) {
            console.error('Error sending message to AI:', error);
            this.addVoiceMessage('assistant', 'Sorry, I encountered an error. Please try again.');
            this.speakText('Sorry, I encountered an error. Please try again.');
        }
    }

    async sendMessageToAI(message) {
        try {
            // Store reference to current voice mode instance
            const voiceModeInstance = this;
            
            // Create a temporary observer to watch for new messages
            const chatMessages = document.getElementById('chatMessages');
            if (!chatMessages) {
                throw new Error('Chat messages container not found');
            }
            
            // Count current messages
            const initialMessageCount = chatMessages.children.length;
            
            // Use the existing chatManager to send message
            console.log('🤖 Sending message to AI:', message);
            await chatManager.sendMessage(message, chatState.selectedModel);
            console.log('🤖 Message sent to AI, waiting for response...');
            
            // Use MutationObserver to detect when AI response is added
            const observer = new MutationObserver((mutations) => {
                console.log('🔍 MutationObserver triggered, mutations:', mutations.length);
                
                mutations.forEach((mutation) => {
                    console.log('🔍 Mutation type:', mutation.type, 'addedNodes:', mutation.addedNodes.length);
                    
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach((node) => {
                            console.log('🔍 Added node:', node.nodeType, node.className, node.tagName);
                            
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                // Log the full structure of the added node
                                console.log('🔍 Node HTML:', node.outerHTML?.substring(0, 200) + '...');
                                
                                // Check multiple ways to find assistant message
                                let assistantElement = null;
                                
                                // Method 1: Direct class check
                                if (node.classList?.contains('assistant-message')) {
                                    assistantElement = node;
                                    console.log('🔍 Found assistant via direct class check');
                                }
                                
                                // Method 2: Query selector for assistant-message
                                if (!assistantElement) {
                                    assistantElement = node.querySelector?.('.assistant-message');
                                    if (assistantElement) console.log('🔍 Found assistant via querySelector .assistant-message');
                  }
                                              
                                // Method 3: Check if it's a message container with assistant content
                                if (!assistantElement) {
                                    const messageDiv = node.querySelector?.('.message');
                                    if (messageDiv && messageDiv.className.includes('assistant')) {
                                        assistantElement = messageDiv;
                                        console.log('🔍 Found assistant via .message class check');
                                    }
                                }
                                
                                // Method 4: Check all child elements
                                if (!assistantElement && node.querySelectorAll) {
                                    const allElements = node.querySelectorAll('*');
                                    for (let el of allElements) {
                                        if (el.className && el.className.includes('assistant')) {
                                            assistantElement = el;
                                            console.log('🔍 Found assistant via child element search:', el.className);
                                            break;
                                        }
                                    }
                                }
                                
                                if (assistantElement) {
                                    console.log('🤖 AI response detected via MutationObserver');
                                    console.log('🤖 Assistant element class:', assistantElement.className);
                                    
                                    // Wait a bit for the content to be fully rendered
                                    setTimeout(() => {
                                        // Try multiple selectors for message text
                                        let messageText = assistantElement.querySelector('.message-text') ||
                                                        assistantElement.querySelector('.message-content') ||
                                                        assistantElement.querySelector('[class*="text"]') ||
                                                        assistantElement;
                                        
                                        console.log('🤖 Message text element:', messageText?.tagName, messageText?.className);
                                        
                                        if (messageText && voiceModeInstance.isActive) {
                                            const responseText = messageText.textContent || messageText.innerText;
                                            console.log('🤖 Raw response text length:', responseText?.length);
                                            console.log('🤖 Raw response preview:', responseText?.substring(0, 200) + '...');
                                            
                                            const cleanResponse = responseText.replace(/\s+/g, ' ').trim();
                                            
                                            if (cleanResponse && cleanResponse.length > 5) {
                                                console.log('🤖 AI Response captured for voice:', cleanResponse.substring(0, 100) + '...');
                                                
                                                // Add AI response to voice chat
                                                voiceModeInstance.addVoiceMessage('assistant', cleanResponse);
                                                
                                                // Speak the response
                                                console.log('🔊 About to speak AI response');
                                                voiceModeInstance.speakText(cleanResponse);
                                                
                                                // Stop observing after we get the response
                                                observer.disconnect();
                                                return;
                                            } else {
                                                console.log('🤖 Clean response is empty or too short:', cleanResponse?.length);
                                            }
                                        } else {
                                            console.log('🤖 Message text not found or voice mode not active');
                                            console.log('🤖 messageText:', !!messageText, 'isActive:', voiceModeInstance.isActive);
                                        }
                                    }, 1500); // Increased delay to ensure content is fully rendered
                                } else {
                                    console.log('🔍 No assistant element found in this node');
                                }
                            }
                        });
                    }
                });
            });
            
            // Start observing
            observer.observe(chatMessages, { childList: true, subtree: true });
            
            // Fallback: Also check periodically for new assistant messages
            let checkCount = 0;
            const maxChecks = 75; // 15 seconds with 200ms intervals
            
            const fallbackCheck = () => {
                checkCount++;
                console.log(`🔍 Fallback check ${checkCount}/${maxChecks} for AI response`);
                
                const currentMessages = Array.from(chatMessages.children);
                console.log(`🔍 Current message count: ${currentMessages.length}, Initial: ${initialMessageCount}`);
                
                // Check if any new messages were added
                if (currentMessages.length > initialMessageCount) {
                    console.log('🔍 New messages detected, checking for assistant messages...');
                    
                    // Get all messages added after the initial count
                    const newMessages = currentMessages.slice(initialMessageCount);
                    console.log(`🔍 New messages: ${newMessages.length}`);
                    
                    for (let i = 0; i < newMessages.length; i++) {
                        const msg = newMessages[i];
                        console.log(`🔍 Checking message ${i}:`, msg.className, msg.outerHTML?.substring(0, 100) + '...');
                        
                        if (msg.hasAttribute('data-voice-processed')) {
                            console.log('🔍 Message already processed, skipping');
                            continue;
                        }
                        
                        // Try multiple ways to find assistant content
                        let assistantElement = null;
                        let messageText = null;
                        
                        // Method 1: Look for assistant-message class
                        assistantElement = msg.querySelector('.assistant-message');
                        if (assistantElement) {
                            console.log('🔍 Found assistant via .assistant-message');
                            messageText = assistantElement.querySelector('.message-text');
                        }
                        
                        // Method 2: Look for message with assistant in class name
                        if (!assistantElement) {
                            const messageDiv = msg.querySelector('.message');
                            if (messageDiv && messageDiv.className.includes('assistant')) {
                                console.log('🔍 Found assistant via .message class');
                                assistantElement = messageDiv;
                                messageText = messageDiv.querySelector('.message-text');
                            }
                        }
                        
                        // Method 3: Check if the message itself has assistant class
                        if (!assistantElement && msg.className.includes('assistant')) {
                            console.log('🔍 Found assistant via direct class check');
                            assistantElement = msg;
                            messageText = msg.querySelector('.message-text') || msg.querySelector('.message-content') || msg;
                        }
                        
                        if (assistantElement && messageText && voiceModeInstance.isActive) {
                            const responseText = messageText.textContent || messageText.innerText;
                            console.log('🔍 Found response text length:', responseText?.length);
                            
                            const cleanResponse = responseText.replace(/\s+/g, ' ').trim();
                            
                            if (cleanResponse && cleanResponse.length > 5) {
                                console.log('🤖 AI Response captured via fallback:', cleanResponse.substring(0, 100) + '...');
                                
                                // Mark as processed
                                msg.setAttribute('data-voice-processed', 'true');
                                
                                // Add AI response to voice chat
                                voiceModeInstance.addVoiceMessage('assistant', cleanResponse);
                                
                                // Speak the response
                                console.log('🔊 About to speak AI response (fallback)');
                                voiceModeInstance.speakText(cleanResponse);
                                
                                // Stop observing and checking
                                observer.disconnect();
                                return;
                            }
                        }
                    }
                }
                
                if (checkCount < maxChecks) {
                    setTimeout(fallbackCheck, 200);
                } else {
                    console.log('🔍 Fallback check exhausted, no assistant message found');
                }
            };
            
            // Start fallback checking after a short delay
            setTimeout(fallbackCheck, 1000);
            
            // Set a timeout to stop observing if no response comes
            setTimeout(() => {
                observer.disconnect();
                console.log('🤖 Timeout waiting for AI response');
                if (voiceModeInstance.isActive) {
                    // voiceModeInstance.addVoiceMessage('system', 'No response received. Please try again.');
                    // voiceModeInstance.speakText('No response received. Please try again.');
                }
            }, 20000); // 20 second timeout (increased since we have multiple detection methods)
            
        } catch (error) {
            console.error('Error getting AI response:', error);
            
            if (this.isActive) {
                const errorMessage = 'Sorry, I encountered an error. Please try again.';
                this.addVoiceMessage('assistant', errorMessage);
                this.speakText(errorMessage);
            }
            
        
            throw error;
        }
    }

    handleNewAssistantMessage(responseText) {
        console.log('🔊 handleNewAssistantMessage called with:', responseText?.substring(0, 100) + '...');
        
        if (!this.isActive || !responseText) {
            console.log('🔊 Voice mode not active or no response text');
            return;
        }

        const cleanResponse = responseText.replace(/\s+/g, ' ').trim();
        
        if (cleanResponse && cleanResponse.length > 5) {
            console.log('🔊 Processing assistant message for voice:', cleanResponse.substring(0, 100) + '...');
            
            // Add AI response to voice chat
            this.addVoiceMessage('assistant', cleanResponse);
            
            // Speak the response
            console.log('🔊 About to speak AI response (direct hook)');
            this.speakText(cleanResponse);
        } else {
            console.log('🔊 Response text is empty or too short');
        }
    }

    speakText(text) {
        console.log('🔊 speakText called with text length:', text?.length);
        console.log('🔊 Text preview:', text?.substring(0, 200) + '...');
        console.log('🔊 synthesis available:', !!this.synthesis);
        console.log('🔊 isMuted:', this.isMuted);
        console.log('🔊 isActive:', this.isActive);
        
        if (!this.synthesis || this.isMuted || !text) {
            console.log('🔊 Speech synthesis blocked - synthesis:', !!this.synthesis, 'muted:', this.isMuted, 'hasText:', !!text);
            return;
        }

        // Stop any ongoing voice recognition immediately to prevent feedback
        if (this.recognition && this.isListening) {
            console.log('🔊 Stopping voice recognition before speaking to prevent feedback');
            this.recognition.stop();
            this.isListening = false;
            
            // Add a small delay to ensure recognition has fully stopped
            setTimeout(() => {
                this.continueSpeaking(text);
            }, 200);
            return;
        }

        this.continueSpeaking(text);
    }

    continueSpeaking(text) {
        // Cancel any ongoing speech
        this.synthesis.cancel();

        // Clean text for speech (remove markdown, etc.)
        const cleanText = this.cleanTextForSpeech(text);

        const utterance = new SpeechSynthesisUtterance(cleanText);
        
        // Configure voice settings from user preferences
        const voiceSettings = chatState.settings.voice || {};
        utterance.rate = voiceSettings.rate || 1.0;
        utterance.pitch = voiceSettings.pitch || 1.0;
        utterance.volume = voiceSettings.volume || 1.0;

        // Try to use a natural-sounding voice
        const voices = this.synthesis.getVoices();
        console.log('🔊 Available voices:', voices.length);
        
        if (voices.length === 0) {
            // Voices might not be loaded yet, wait for them to load
            console.log('🔊 Waiting for voices to load...');
            
            // Try to trigger voice loading
            const tempUtterance = new SpeechSynthesisUtterance('');
            this.synthesis.speak(tempUtterance);
            this.synthesis.cancel();
            
            // Wait for voices to load
            const waitForVoices = () => {
                const newVoices = this.synthesis.getVoices();
                if (newVoices.length > 0) {
                    console.log('🔊 Voices loaded, retrying speech...');
                    this.speakText(text);
                } else {
                    // Fallback: just speak without specific voice after 2 seconds
                    setTimeout(() => {
                        console.log('🔊 Fallback: Speaking without specific voice');
                        const fallbackUtterance = new SpeechSynthesisUtterance(this.cleanTextForSpeech(text));
                        const voiceSettings = chatState.settings.voice || {};
                        fallbackUtterance.rate = voiceSettings.rate || 1.0;
                        fallbackUtterance.pitch = voiceSettings.pitch || 1.0;
                        fallbackUtterance.volume = voiceSettings.volume || 1.0;
                        fallbackUtterance.onstart = () => {
                            console.log('🔊 Fallback speech synthesis started');
                            
                            // Stop any ongoing voice recognition to prevent feedback
                            if (this.recognition && this.isListening) {
                                console.log('🔊 Stopping voice recognition to prevent feedback (fallback)');
                                this.recognition.stop();
                                this.isListening = false;
                            }
                            
                            this.isSpeaking = true;
                            this.updateVoiceOrb('speaking');
                            this.updateStatus('Speaking...');
                        };
                        fallbackUtterance.onend = () => {
                            this.isSpeaking = false;
                            if (this.isActive) {
                                this.updateVoiceOrb('idle');
                                this.updateStatus('Ready');
                                setTimeout(() => {
                                    if (this.isActive && !this.isMuted) {
                                        this.startListening();
                                    }
                                }, 1000);
                            }
                        };
                        this.synthesis.speak(fallbackUtterance);
                    }, 2000);
                }
            };
            
            this.synthesis.addEventListener('voiceschanged', waitForVoices, { once: true });
            // Also try after a short delay in case the event doesn't fire
            setTimeout(waitForVoices, 100);
            return;
        }
        
        // Use user-selected voice or fallback to preferred voice
        const selectedVoiceName = voiceSettings.selectedVoice;
        let selectedVoice = null;
        
        if (selectedVoiceName) {
            selectedVoice = voices.find(voice => voice.name === selectedVoiceName);
            if (selectedVoice) {
                console.log('🔊 Using user-selected voice:', selectedVoice.name);
            } else {
                console.log('🔊 User-selected voice not found, falling back to default');
            }
        }
        
        // Fallback to preferred voice if no user selection or selected voice not found
        if (!selectedVoice) {
            selectedVoice = voices.find(voice => 
                voice.name.includes('Natural') || 
                voice.name.includes('Enhanced') ||
                voice.name.includes('Premium') ||
                (voice.lang.startsWith('en') && voice.localService)
            ) || voices.find(voice => voice.lang.startsWith('en'));
            
            if (selectedVoice) {
                console.log('🔊 Using fallback voice:', selectedVoice.name);
            }
        }
        
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        utterance.onstart = () => {
            console.log('🔊 Speech synthesis started');
            
            // Stop any ongoing voice recognition to prevent feedback
            if (this.recognition && this.isListening) {
                console.log('🔊 Stopping voice recognition to prevent feedback');
                this.recognition.stop();
                this.isListening = false;
            }
            
            this.isSpeaking = true;
            this.updateVoiceOrb('speaking');
            this.updateStatus('Speaking...');
        };

        utterance.onend = () => {
            console.log('🔊 Speech synthesis ended');
            this.isSpeaking = false;
            
            if (this.isActive) {
                this.updateVoiceOrb('idle');
                this.updateStatus('Ready');
                
                // Start listening again after a longer delay to prevent feedback
                console.log('🔊 Speech ended, will restart listening in 1000ms');
                setTimeout(() => {
                    if (this.isActive && !this.isMuted) {
                        console.log('🔊 Restarting listening after speech ended');
                        this.startListening();
                        
                        // Double-check after another second in case it didn't start
                        setTimeout(() => {
                            if (this.isActive && !this.isListening && !this.isSpeaking && !this.isMuted) {
                                console.log('🔊 Double-check: Forcing listening restart');
                                this.startListening();
                            }
                        }, 1500);
                    } else {
                        console.log('🔊 Not restarting listening - isActive:', this.isActive, 'isMuted:', this.isMuted);
                    }
                }, 1000);
            }
        };

        utterance.onerror = (event) => {
            console.error('🔊 Speech synthesis error:', event.error);
            this.isSpeaking = false;
            
            if (this.isActive) {
                this.updateVoiceOrb('idle');
                this.updateStatus('Ready');
                
                // Continue listening even if speech failed
                setTimeout(() => {
                    if (this.isActive && !this.isMuted) {
                        this.startListening();
                    }
                }, 500);
            }
        };

        this.currentUtterance = utterance;
        
        console.log('🔊 Starting speech synthesis...');
        console.log('🔊 Text to speak:', cleanText.substring(0, 100) + '...');
        
        try {
            this.synthesis.speak(utterance);
        } catch (error) {
            console.error('🔊 Error starting speech synthesis:', error);
            // Fallback: try without voice selection
            const fallbackUtterance = new SpeechSynthesisUtterance(cleanText);
            const voiceSettings = chatState.settings.voice || {};
            fallbackUtterance.rate = voiceSettings.rate || 1.0;
            fallbackUtterance.pitch = voiceSettings.pitch || 1.0;
            fallbackUtterance.volume = voiceSettings.volume || 1.0;
            
            fallbackUtterance.onstart = utterance.onstart;
            fallbackUtterance.onend = utterance.onend;
            fallbackUtterance.onerror = utterance.onerror;
            
            this.synthesis.speak(fallbackUtterance);
        }
    }

    cleanTextForSpeech(text) {
        // Remove markdown formatting
        let cleanText = text
            .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
            .replace(/\*(.*?)\*/g, '$1') // Italic
            .replace(/`(.*?)`/g, '$1') // Inline code
            .replace(/```[\s\S]*?```/g, '[code block]') // Code blocks
            .replace(/#{1,6}\s/g, '') // Headers
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
            .replace(/\n+/g, ' ') // Multiple newlines
            .replace(/\s+/g, ' ') // Multiple spaces
            .trim();

        // Limit length for speech
        if (cleanText.length > 500) {
            cleanText = cleanText.substring(0, 500) + '...';
        }

        return cleanText;
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        
        const muteBtn = document.getElementById('voiceMuteMicBtn');
        if (muteBtn) {
            if (this.isMuted) {
                muteBtn.classList.add('muted');
                muteBtn.title = 'Turn on microphone';
                muteBtn.querySelector('i').className = 'fas fa-microphone-slash';
            } else {
                muteBtn.classList.remove('muted');
                muteBtn.title = 'Turn off microphone';
                muteBtn.querySelector('i').className = 'fas fa-microphone';
            }
        }

        if (this.isMuted) {
            // Stop listening if currently listening
            if (this.isListening) {
                this.recognition.stop();
            }
            this.updateStatus('Microphone muted');
        } else {
            this.updateStatus('Ready');
            // Start listening if not currently speaking
            if (this.isActive && !this.isSpeaking) {
                setTimeout(() => this.startListening(), 500);
            }
        }
    }

    updateVoiceOrb(state) {
        const orb = document.getElementById('voiceOrb');
        if (!orb) return;

        // Remove all state classes
        orb.classList.remove('listening', 'speaking', 'thinking');
        
        // Add current state class
        if (state !== 'idle') {
            orb.classList.add(state);
        }
    }

    updateStatus(text) {
        const statusIndicator = document.getElementById('statusIndicator');
        if (statusIndicator) {
            statusIndicator.textContent = text;
            
            // Update status class
            statusIndicator.classList.remove('listening', 'speaking');
            if (text.includes('Listening')) {
                statusIndicator.classList.add('listening');
            } else if (text.includes('Speaking')) {
                statusIndicator.classList.add('speaking');
            }
        }
    }

    addVoiceMessage(sender, content) {
        // Don't display messages in voice modal - just store in history
        const now = new Date();
        
        // Store in conversation history
        this.conversationHistory.push({ sender, content, timestamp: now });
        
        // Only update status for system messages
        if (sender === 'system') {
            this.updateStatus(content);
        }
    }

    clearVoiceMessages() {
        const messagesContainer = document.getElementById('voiceMessages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
        }
        this.conversationHistory = [];
    }
}

// Toast Notification System
class ToastManager {
    show(message, type = 'info', duration = 3000, actions = []) {
        try {
            console.log('🍞 Toast.show called:', { message, type, duration });

            // Check if toast container exists
            if (!elements.toastContainer) {
                console.error('❌ Toast container not found');
                return;
            }

            const toast = document.createElement('div');
            toast.className = `toast ${type}`;

            const icons = {
                success: '✅',
                error: '❌',
                warning: '⚠️',
                info: 'ℹ️'
            };

            // Create toast content using template
            const toastContent = templateHelper.clone('toastTemplate');
            if (toastContent) {
                // Populate template content
                const iconElement = toastContent.querySelector('.toast-icon');
                const messageElement = toastContent.querySelector('.toast-message');

                if (iconElement) iconElement.innerHTML = icons[type];
                if (messageElement) messageElement.textContent = message;

                // Add to toast element
                toast.appendChild(toastContent);
            } else {
                console.error('❌ Toast template not found');
                // Fallback: create simple toast without template
                toast.innerHTML = `
                    <div class="toast-icon">${icons[type]}</div>
                    <div class="toast-message">${message}</div>
                    <button class="toast-close">&times;</button>
                `;
            }

            // Add action buttons if provided
            if (actions && actions.length > 0) {
                const actionsContent = templateHelper.clone('toastActionsTemplate');
                if (actionsContent) {
                    const actionsContainer = actionsContent.querySelector('.toast-actions');
                    const actionButton = actionsContainer.querySelector('.toast-action-btn');

                    // Remove the template button and add actual buttons
                    actionButton.remove();

                    actions.forEach(action => {
                        const btn = document.createElement('button');
                        btn.className = 'toast-action-btn';
                        btn.textContent = action.text;
                        actionsContainer.appendChild(btn);
                    });

                    toast.appendChild(actionsContent);
                }
            }

            // Add to DOM
            elements.toastContainer.appendChild(toast);
            console.log('✅ Toast added to DOM');

            // Show toast
            setTimeout(() => {
                toast.classList.add('show');
                console.log('✅ Toast show class added');
            }, 100);

            // Auto remove
            const removeToast = () => {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                        console.log('✅ Toast removed from DOM');
                    }
                }, 300);
            };

            // Set timeout for auto-removal
            let timeoutId = setTimeout(removeToast, duration);

            // Manual close
            const closeBtn = toast.querySelector('.toast-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', removeToast);
            }

            // Add event listeners for action buttons
            if (actions && actions.length > 0) {
                const actionButtons = toast.querySelectorAll('.toast-action-btn');
                actionButtons.forEach((btn, index) => {
                    btn.addEventListener('click', () => {
                        // Clear the auto-remove timeout
                        clearTimeout(timeoutId);

                        // Execute the action
                        if (actions[index] && typeof actions[index].onClick === 'function') {
                            actions[index].onClick();
                        }

                        // Remove the toast
                        removeToast();
                    });
                });
            }

            return {
                close: removeToast
            };

        } catch (error) {
            console.error('❌ Error in toast.show:', error);
            return null;
        }
    }

    // New method to show custom HTML content in toast
    showCustom(contentElement, type = 'info', duration = 3000, actions = []) {
        const toast = document.createElement('div');
        toast.className = `toast ${type} toast-custom`;

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        // Create toast content using template
        const toastContent = templateHelper.clone('toastTemplate');
        if (toastContent) {
            // Populate template content
            toastContent.querySelector('.toast-icon').innerHTML = icons[type];

            // Replace text message with custom content
            const messageContainer = toastContent.querySelector('.toast-message');
            messageContainer.innerHTML = '';
            messageContainer.appendChild(contentElement);

            // Add to toast element
            toast.appendChild(toastContent);
        }

        // Add action buttons if provided
        if (actions && actions.length > 0) {
            const actionsContent = templateHelper.clone('toastActionsTemplate');
            if (actionsContent) {
                const actionsContainer = actionsContent.querySelector('.toast-actions');
                const actionButton = actionsContainer.querySelector('.toast-action-btn');

                // Remove the template button and add actual buttons
                actionButton.remove();

                actions.forEach(action => {
                    const btn = document.createElement('button');
                    btn.className = 'toast-action-btn';
                    btn.textContent = action.text;
                    actionsContainer.appendChild(btn);
                });

                toast.appendChild(actionsContent);
            }
        }
        elements.toastContainer.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto remove
        const removeToast = () => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        };

        // Set timeout for auto-removal
        let timeoutId = setTimeout(removeToast, duration);

        // Manual close
        toast.querySelector('.toast-close').addEventListener('click', removeToast);

        // Add event listeners for action buttons
        if (actions && actions.length > 0) {
            const actionButtons = toast.querySelectorAll('.toast-action-btn');
            actionButtons.forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    // Clear the auto-remove timeout
                    clearTimeout(timeoutId);

                    // Execute the action
                    if (actions[index] && typeof actions[index].onClick === 'function') {
                        actions[index].onClick();
                    }

                    // Remove the toast
                    removeToast();
                });
            });
        }

        return {
            close: removeToast
        };
    }
}


const toast = new ToastManager();

// Test function for toast (can be called from console)
window.testToast = function (message = 'Test toast notification', type = 'info') {
    console.log('🧪 Testing toast:', { message, type });
    return toast.show(message, type);
};


// Modal Management
class ModalManager {
    show(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';

            // Special handling for login modal
            if (modalId === 'loginModal') {
                // Wait for modal to be fully visible before checking state
                setTimeout(() => {
                    checkLoginFormState();

                    // Initialize cool mode for login buttons when modal is shown
                    initializeCoolMode();

                    // Add event listener to email input to check state when email changes
                    const emailInput = document.getElementById('email');
                    if (emailInput) {
                        // Remove any existing listeners to prevent duplicates
                        emailInput.removeEventListener('blur', this._emailBlurHandler);

                        // Store the handlers so we can remove them later
                        this._emailBlurHandler = () => checkLoginFormState(emailInput.value);

                        // Handler for input changes - remove any error message when email changes
                        this._emailInputHandler = () => {
                            // Remove any error message
                            removePasswordResetMessage();
                        };

                        // Add the listeners
                        emailInput.addEventListener('blur', this._emailBlurHandler);
                        emailInput.addEventListener('input', this._emailInputHandler);
                    }
                }, 100);
            }
        }
    }

    hide(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';

            // Clean up event listeners for login modal
            if (modalId === 'loginModal') {
                const emailInput = document.getElementById('email');
                if (emailInput) {
                    if (this._emailBlurHandler) {
                        emailInput.removeEventListener('blur', this._emailBlurHandler);
                    }
                    if (this._emailInputHandler) {
                        emailInput.removeEventListener('input', this._emailInputHandler);
                    }
                }

                // Clear any error messages
                removePasswordResetMessage();
            }
        }
    }

    confirm(title, message) {
        return new Promise((resolve) => {
            const confirmTitle = document.getElementById('confirmTitle');
            const confirmMessage = document.getElementById('confirmMessage');
            const confirmOk = document.getElementById('confirmOk');
            const confirmCancel = document.getElementById('confirmCancel');

            confirmTitle.textContent = title;
            confirmMessage.textContent = message;

            const handleConfirm = () => {
                this.hide('confirmModal');
                confirmOk.removeEventListener('click', handleConfirm);
                confirmCancel.removeEventListener('click', handleCancel);
                resolve(true);
            };

            const handleCancel = () => {
                this.hide('confirmModal');
                confirmOk.removeEventListener('click', handleConfirm);
                confirmCancel.removeEventListener('click', handleCancel);
                resolve(false);
            };

            confirmOk.addEventListener('click', handleConfirm);
            confirmCancel.addEventListener('click', handleCancel);

            this.show('confirmModal');
        });
    }
}


const modal = new ModalManager();




// Chat Management
class ChatManager {
    constructor() {
        this.isProcessing = false;
        this.shouldStop = false;
        this.currentController = null;
    }

    async sendMessage(content, model, isPromptSelection = false) {
        if (this.isProcessing) return;

        // Ensure API manager is available
        if (!window.apiManager) {
            const errorMessage = {
                id: utils.generateId(),
                role: 'assistant',
                content: '⚠️ **System Loading**\n\nPlease wait a moment for the system to initialize and try again.',
                timestamp: new Date().toISOString()
            };
            chatState.currentMessages.push(errorMessage);
            this.renderMessages();
            return;
        }

        // Check if API is configured
        const apiConfigMessage = promptForApiKeys();
        if (apiConfigMessage) {
            const errorMessage = {
                id: utils.generateId(),
                role: 'assistant',
                content: apiConfigMessage,
                timestamp: new Date().toISOString()
            };
            chatState.currentMessages.push(errorMessage);
            this.renderMessages();
            return;
        }

        this.isProcessing = true;
        chatState.isTyping = true;
        this.shouldStop = false;
        this.showStopButton();

        // Extract user input from content (remove file content for display)
        let userInputForDisplay = content;
        let fullContentForAI = content;
        
        // Check if content contains file content markers
        if (content.includes('--- File Content ---')) {
            const parts = content.split('--- File Content ---');
            userInputForDisplay = parts[0].trim();
            fullContentForAI = content; // Keep full content for AI
        }

        // Add user message only if it's not a prompt selection
        if (!isPromptSelection) {
            const userMessage = {
                id: utils.generateId(),
                role: 'user',
                content: userInputForDisplay, // Only show user input in chat
                timestamp: new Date().toISOString()
            };

            chatState.currentMessages.push(userMessage);
            this.renderMessages();

            // Save user message to Supabase immediately
            if (chatState.useSupabaseStorage && window.supabaseDB && chatState.currentConversationId) {
                try {
                    console.log('🔄 Saving user message to Supabase...', {
                        conversationId: chatState.currentConversationId,
                        useSupabaseStorage: chatState.useSupabaseStorage,
                        supabaseDB: !!window.supabaseDB,
                        isLoggedIn: chatState.isLoggedIn
                    });

                    const result = await window.supabaseDB.addMessage(
                        chatState.currentConversationId,
                        'user',
                        userInputForDisplay, // Save only user input for display
                        chatState.selectedModel
                    );

                    if (result.error) {
                        console.error('❌ Error saving user message to Supabase:', result.error);
                        toast.show('Failed to save message to cloud', 'warning');
                    } else {
                        console.log('✅ User message saved to Supabase immediately');
                    }
                } catch (err) {
                    console.error('❌ Exception saving user message to Supabase:', err);
                    toast.show('Failed to save message to cloud', 'warning');
                }
            } else {
                console.log('📱 Not saving to Supabase:', {
                    useSupabaseStorage: chatState.useSupabaseStorage,
                    supabaseDB: !!window.supabaseDB,
                    currentConversationId: !!chatState.currentConversationId,
                    isLoggedIn: chatState.isLoggedIn
                });
            }
        }

        // Auto-generate title if this is the first user message in a new chat (skip for prompt selections)
        if (!isPromptSelection && chatState.currentConversationId) {
            const conversation = chatState.conversations.find(c => c.id === chatState.currentConversationId);
            if (conversation && conversation.title === 'New Chat') {
                const newTitle = userInputForDisplay.substring(0, 50) + (userInputForDisplay.length > 50 ? '...' : '');
                conversation.title = newTitle;

                console.log('🔄 Auto-generating title from first message:', newTitle);

                // Update title in Supabase if using Supabase storage
                if (chatState.useSupabaseStorage && window.supabaseDB) {
                    try {
                        await window.supabaseDB.updateConversationTitle(chatState.currentConversationId, newTitle);
                        console.log('✅ Title updated in Supabase');
                    } catch (err) {
                        console.error('❌ Error updating conversation title in Supabase:', err);
                    }
                }

                // Update the UI to reflect the new title
                updateConversationsList();

                // Update the chat title in the header
                if (elements.chatTitle) {
                    elements.chatTitle.textContent = newTitle;
                }
            }
        }

        this.showTypingIndicator();

        try {
            // Check if API manager is available
            if (!window.apiManager) {
                throw new Error('API manager is not initialized. Please wait a moment and try again.');
            }

            // Create AbortController for this request
            this.currentController = new AbortController();

            // Use the new API manager for real API calls
            const response = await window.apiManager.sendMessage(fullContentForAI, this.currentController);

            // Add bot response
            const botMessage = {
                id: utils.generateId(),
                role: 'assistant',
                content: response,
                timestamp: new Date().toISOString()
            };

            chatState.currentMessages.push(botMessage);

            // Notify voice agent if active
            if (window.voiceMode && window.voiceMode.isActive) {
                console.log('🔊 Notifying voice agent of new assistant message');
                setTimeout(() => {
                    window.voiceMode.handleNewAssistantMessage(response);
                }, 500);
            }

            // Save assistant message to Supabase immediately
            if (chatState.useSupabaseStorage && window.supabaseDB && chatState.currentConversationId) {
                try {
                    console.log('🔄 Saving assistant message to Supabase...');

                    const result = await window.supabaseDB.addMessage(
                        chatState.currentConversationId,
                        'assistant',
                        response,
                        chatState.selectedModel
                    );

                    if (result.error) {
                        console.error('❌ Error saving assistant message to Supabase:', result.error);
                        toast.show('Failed to save response to cloud', 'warning');
                    } else {
                        console.log('✅ Assistant message saved to Supabase immediately');
                    }
                } catch (err) {
                    console.error('❌ Exception saving assistant message to Supabase:', err);
                    toast.show('Failed to save response to cloud', 'warning');
                }
            }

            // Update conversation in local state
            await chatState.updateConversation(chatState.currentMessages);

        } catch (error) {
            console.error('Error sending message:', error);

            // Handle abort error (user stopped generation)
            if (error.name === 'AbortError' || this.shouldStop) {
                console.log('Request was aborted by user');
                return; // Don't show error message for user-initiated stops
            }

            // Use API manager's error response if available, otherwise use fallback
            const errorResponse = window.apiManager ?
                window.apiManager.getErrorResponse(error) :
                `❌ **System Error**\n\n${error.message}\n\nPlease refresh the page and try again.`;

            // Only add error message if errorResponse is not null (null means it was an AbortError)
            if (errorResponse) {
                const errorMessage = {
                    id: utils.generateId(),
                    role: 'assistant',
                    content: errorResponse,
                    timestamp: new Date().toISOString()
                };

                chatState.currentMessages.push(errorMessage);
            }

            // Handle model overload specifically
            const wasOverloadHandled = handleModelOverload(error.message || '');

            if (!wasOverloadHandled) {
                toast.show('Failed to send message', 'error');
            }
        } finally {
            this.isProcessing = false;
            chatState.isTyping = false;
            this.shouldStop = false;
            this.currentController = null;
            this.hideTypingIndicator();
            this.hideStopButton();
            this.renderMessages();
        }
    }

    renderMessages() {
        const messagesContainer = elements.chatMessages;
        messagesContainer.innerHTML = '';

        // Add welcome message if no current messages
        if (chatState.currentMessages.length === 0) {
            this.addWelcomeMessage();
            return;
        }

        chatState.currentMessages.forEach(message => {
            const messageElement = this.createMessageElement(message);
            messagesContainer.appendChild(messageElement);
        });

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addWelcomeMessage() {
        templateHelper.appendTo('welcomeMessageTemplate', elements.chatMessages);

        // Add event listeners to prompt boxes
        const promptBoxes = elements.chatMessages.querySelectorAll('.prompt-box');
        promptBoxes.forEach(box => {
            box.addEventListener('click', async () => {
                // Prevent multiple clicks
                if (box.classList.contains('processing')) return;

                // Add visual feedback
                box.classList.add('processing');
                box.style.transform = 'scale(0.98)';
                box.style.opacity = '0.7';
                box.style.pointerEvents = 'none';

                const promptType = box.getAttribute('data-prompt');
                const enhancedPrompt = this.getEnhancedPrompt(promptType);

                // Show brief loading state
                setTimeout(async () => {
                    await this.handlePromptSelection(enhancedPrompt, promptType);
                }, 200);
            });
        });
    }

    getEnhancedPrompt(promptType) {
        // Use the enhanced prompts from sati-knowledge.js
        return window.getEnhancedPrompt ? window.getEnhancedPrompt(promptType) : "Tell me about SATI Vidisha.";
    }

    async handlePromptSelection(prompt, promptType) {
        console.log('🎯 Handling prompt selection:', promptType);

        // Get a shorter display version of the prompt for the title
        const displayPrompt = this.getDisplayPrompt(promptType);
        console.log('📝 Display prompt:', displayPrompt);

        // Only create a new conversation if there's no active conversation
        if (!chatState.currentConversationId) {
            console.log('🔄 No active conversation, creating new one...');
            await chatState.createNewConversation(displayPrompt);
        } else {
            console.log('📝 Using existing conversation:', chatState.currentConversationId);
        }

        // Send the message
        await this.sendMessage(prompt);
    }

    async handlePromptSelection(prompt, promptType) {
        console.log('🎯 Handling prompt selection:', promptType);

        // Get a shorter display version of the prompt for the title
        const displayPrompt = this.getDisplayPrompt(promptType);
        console.log('📝 Display prompt:', displayPrompt);

        // Only create a new conversation if there's no active conversation
        if (!chatState.currentConversationId) {
            console.log('🔄 No active conversation, creating new one...');
            await chatState.createNewConversation(displayPrompt);
            console.log('✅ New conversation created with ID:', chatState.currentConversationId);

            // Update conversations list in sidebar
            updateConversationsList();
        } else {
            console.log('✅ Using existing conversation with ID:', chatState.currentConversationId);
        }

        // Update chat title to show the prompt title (for both new and existing conversations)
        if (elements.chatTitle) {
            elements.chatTitle.textContent = displayPrompt;
        }

        // Update conversation title in storage if using existing conversation
        if (chatState.currentConversationId) {
            const conversation = chatState.conversations.find(c => c.id === chatState.currentConversationId);
            if (conversation) {
                // Update the conversation title to the prompt display name
                conversation.title = displayPrompt;
                console.log('🔄 Updating conversation title to:', displayPrompt);

                // Update title in Supabase if using Supabase storage
                if (chatState.useSupabaseStorage && window.supabaseDB) {
                    try {
                        await window.supabaseDB.updateConversationTitle(chatState.currentConversationId, displayPrompt);
                        console.log('✅ Conversation title updated in Supabase');
                    } catch (err) {
                        console.error('❌ Error updating conversation title in Supabase:', err);
                    }
                }

                // Update the conversations list in sidebar to reflect the new title
                updateConversationsList();

                // Save state to localStorage
                chatState.saveState();
            }
        }

        // Clear the welcome message only if there are no current messages
        if (chatState.currentMessages.length === 0) {
            elements.chatMessages.innerHTML = '';
        }

        // Add the enhanced prompt as user message (visible to user)
        const userMessage = {
            role: 'user',
            content: prompt, // Enhanced prompt visible to user
            timestamp: new Date().toISOString(),
            id: Date.now().toString()
        };

        // Add to current messages and display
        chatState.currentMessages.push(userMessage);

        // Create and display the enhanced prompt as user message
        const messageElement = this.createMessageElement(userMessage);
        if (messageElement) {
            elements.chatMessages.appendChild(messageElement);
        }

        // Scroll to bottom
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;

        // Save enhanced prompt message to Supabase if logged in
        if (chatState.useSupabaseStorage && window.supabaseDB && chatState.currentConversationId) {
            try {
                console.log('🔄 Saving enhanced prompt message to Supabase...');
                const result = await window.supabaseDB.addMessage(
                    chatState.currentConversationId,
                    'user',
                    prompt, // Enhanced prompt
                    chatState.selectedModel
                );

                if (result.error) {
                    console.error('❌ Error saving enhanced prompt to Supabase:', result.error);
                } else {
                    console.log('✅ Enhanced prompt saved to Supabase');
                }
            } catch (err) {
                console.error('❌ Exception saving enhanced prompt to Supabase:', err);
            }
        }

        // Show typing indicator
        this.showTypingIndicator();

        // Send the enhanced prompt to AI (skip adding another user message)
        await this.sendMessage(prompt, chatState.selectedModel, true); // true flag indicates prompt selection

        // Close sidebar on mobile after prompt selection
        if (window.innerWidth <= 768) {
            const appContainer = document.querySelector('.app-container');
            if (appContainer) {
                appContainer.classList.add('sidebar-collapsed');
            }
        }
    }

    getDisplayPrompt(promptType) {
        const displayPrompts = {
            admissions: "How do I get admission to SATI?",
            academics: "What courses does SATI offer?",
            placements: "What are SATI's placement records?",
            campus: "Tell me about campus facilities",
            activities: "What activities can I join at SATI?",
            institute: "Tell me about SATI's background"
        };

        return displayPrompts[promptType] || "Tell me about SATI Vidisha.";
    }

    createMessageElement(message) {
        const messageElement = templateHelper.clone('chatMessageTemplate');
        if (!messageElement) return null;

        const messageDiv = messageElement.querySelector('.message');
        messageDiv.className = `message ${message.role}-message`;

        // Use displayContent for user messages if available, otherwise use content
        const contentToDisplay = message.displayContent || message.content;
        messageElement.querySelector('.message-text').innerHTML = utils.parseMarkdown(utils.escapeHtml(contentToDisplay));
        messageElement.querySelector('.message-timestamp').textContent = utils.formatTime(message.timestamp);
        messageElement.querySelector('.copy-btn').setAttribute('data-message-id', message.id);

        // Apply syntax highlighting to code blocks after DOM insertion
        setTimeout(() => {
            if (window.Prism) {
                const codeBlocks = messageElement.querySelectorAll('pre code');
                codeBlocks.forEach(block => {
                    // Ensure the language class is properly set
                    if (!block.className.includes('language-')) {
                        block.className = 'language-text';
                    }
                    window.Prism.highlightElement(block);
                });
            }
        }, 100);

        // Add event listeners for code copy buttons
        const copyCodeBtns = messageElement.querySelectorAll('.copy-code-btn');
        copyCodeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const codeId = btn.getAttribute('data-code-id');
                const codeElement = document.getElementById(codeId);
                if (codeElement) {
                    utils.copyCodeToClipboard(codeElement.textContent, btn);
                }
            });
        });

        // Add event listeners for collapsible sections
        const collapsibleHeaders = messageElement.querySelectorAll('.collapsible-header');
        collapsibleHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const section = header.closest('.collapsible-section');
                section.classList.toggle('expanded');
            });
        });

        return messageElement;
    }

    showTypingIndicator() {
        elements.typingIndicator.style.display = 'block';
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        elements.typingIndicator.style.display = 'none';
    }

    showStopButton() {
        if (elements.sendBtn && elements.stopBtn) {
            elements.sendBtn.style.display = 'none';
            elements.stopBtn.style.display = 'flex';
        }
    }

    hideStopButton() {
        if (elements.sendBtn && elements.stopBtn) {
            elements.sendBtn.style.display = 'flex';
            elements.stopBtn.style.display = 'none';
        }
    }

    stopGeneration() {
        this.shouldStop = true;
        if (this.currentController) {
            this.currentController.abort();
        }
        this.isProcessing = false;
        chatState.isTyping = false;
        this.hideTypingIndicator();
        this.hideStopButton();

        // Add a stopped message
        const stoppedMessage = {
            id: utils.generateId(),
            role: 'assistant',
            content: '⏹️ **Generation stopped by user**',
            timestamp: new Date().toISOString()
        };

        chatState.currentMessages.push(stoppedMessage);
        this.renderMessages();

        toast.show('Generation stopped', 'info');
    }

    async copyMessage(messageId) {
        let content = '';

        if (messageId === 'welcome') {
            content = `Hello! I'm your SATI AI Assistant

I'm specialized in providing information about Samrat Ashok Technological Institute (SATI), Vidisha. 

Choose from these topics to get started:
• Admission Information - JEE cutoffs, procedures, and eligibility
• Academic Programs - B.Tech, M.Tech courses and curriculum  
• Placement Statistics - Top recruiters and career opportunities
• Campus Life - Hostel facilities and campus amenities
• Student Activities - Clubs, events, and extracurriculars
• Institute Information - History, achievements, and faculty

Or ask me anything about SATI Vidisha!`;
        } else {
            const message = chatState.currentMessages.find(m => m.id === messageId);
            if (!message) return;
            content = message.content;
        }

        try {
            await navigator.clipboard.writeText(content);

            // Visual feedback
            const copyBtn = document.querySelector(`[data-message-id="${messageId}"]`);
            if (copyBtn) {
                const originalIcon = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                copyBtn.classList.add('copied');

                setTimeout(() => {
                    copyBtn.innerHTML = originalIcon;
                    copyBtn.classList.remove('copied');
                }, 2000);
            }

            toast.show('Message copied to clipboard', 'success');
        } catch (err) {
            console.error('Failed to copy message:', err);
            toast.show('Failed to copy message', 'error');
        }
    }

    clearChat() {
        chatState.currentMessages = [];
        chatState.currentConversationId = null;
        this.renderMessages();
        elements.chatTitle.textContent = 'New Chat';
        toast.show('Chat cleared', 'success');
    }

    exportChat() {
        if (chatState.currentMessages.length === 0) {
            toast.show('No messages to export', 'warning');
            return;
        }

        let content = 'SATI ChatBot Conversation\n';
        content += '='.repeat(50) + '\n\n';

        chatState.currentMessages.forEach(message => {
            const role = message.role === 'user' ? 'You' : 'SATI Bot';
            const time = utils.formatTime(message.timestamp);
            content += `[${time}] ${role}: ${message.content}\n\n`;
        });

        const filename = `sati_chat_${new Date().toISOString().split('T')[0]}.txt`;

        // Check if running inside Android WebView with a bridge
        if (window.AndroidBridge && typeof window.AndroidBridge.saveTextFile === 'function') {
            try {
                window.AndroidBridge.saveTextFile(content, filename);
                toast.show('Chat exported to device storage', 'success');
            } catch (e) {
                console.error("AndroidBridge error:", e);
                toast.show('Failed to export chat (app)', 'error');
            }
        } else {
            // Fallback to regular browser download
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.show('Chat exported successfully', 'success');
        }
    }

}

const chatManager = new ChatManager();
window.chatManager = chatManager;

// Conversation Management
function updateConversationsList() {
    const container = elements.conversationsList;
    container.innerHTML = '';

    if (chatState.conversations.length === 0) {
        templateHelper.appendTo('noConversationsTemplate', container);
        return;
    }

    chatState.conversations.forEach(conversation => {
        const conversationElement = templateHelper.clone('conversationItemTemplate');
        if (!conversationElement) return;
        const item = conversationElement.querySelector('.conversation-item');
        item.className = `conversation-item ${conversation.id === chatState.currentConversationId ? 'active' : ''}`;
        // Populate template content
        const titleElement = conversationElement.querySelector('.conversation-title');
        titleElement.setAttribute('title', conversation.title);
        titleElement.textContent = conversation.title;
        // Setup bookmark button
        const bookmarkBtn = conversationElement.querySelector('.conversation-bookmark-btn');
        if (bookmarkBtn) {
            if (conversation.is_bookmarked) {
                bookmarkBtn.classList.add('active');
                const icon = bookmarkBtn.querySelector('i');
                if (icon) icon.className = 'fas fa-bookmark';
            } else {
                bookmarkBtn.classList.remove('active');
                const icon = bookmarkBtn.querySelector('i');
                if (icon) icon.className = 'far fa-bookmark';
            }
            bookmarkBtn.setAttribute('onclick', `toggleBookmark(event, '${conversation.id}', null, false)`);
        }
        const menuBtn = conversationElement.querySelector('.conversation-menu-btn');
        menuBtn.setAttribute('onclick', `toggleConversationMenu(event, '${conversation.id}')`);
        const dropdown = conversationElement.querySelector('.conversation-dropdown');
        dropdown.id = `dropdown-${conversation.id}`;
        // Add hover out event to close dropdown
        dropdown.addEventListener('mouseleave', function () {
            dropdown.classList.remove('show');
        });
        // Prevent closing when moving mouse inside dropdown
        dropdown.addEventListener('mouseenter', function () {
            // No action needed, but could be used for future logic
        });
        const renameBtn = dropdown.querySelector('.conversation-dropdown-item:first-child');
        renameBtn.setAttribute('onclick', `renameConversation('${conversation.id}')`);
        const deleteBtn = dropdown.querySelector('.conversation-dropdown-item.danger');
        deleteBtn.setAttribute('onclick', `deleteConversation('${conversation.id}')`);
        item.addEventListener('click', async (e) => {
            if (!e.target.closest('.conversation-action') && !e.target.closest('.conversation-bookmark-btn')) {
                await chatState.loadConversation(conversation.id);
                elements.chatTitle.textContent = conversation.title;
                chatManager.renderMessages();
                updateConversationsList();

                // Close sidebar on mobile
                if (window.innerWidth <= 768) {
                    toggleSidebar();
                }
            }
        });
        container.appendChild(conversationElement);
    });
}

// Update saved chats list
async function updateSavedChatsList() {
    // Get container from modal (it might not exist until modal is shown)
    const container = document.getElementById('savedChatsList');
    if (!container) {
        console.log('📱 savedChatsList container not found - modal may not be open yet');
        return;
    }

    // Force clear and refresh
    container.innerHTML = '';
    container.style.display = 'none';
    container.offsetHeight; // Force reflow
    container.style.display = 'block';
    // Show loading indicator
    const loadingElement = document.createElement('div');
    loadingElement.className = 'saved-chats-loading';
    loadingElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Loading saved chats...</span>';
    container.appendChild(loadingElement);
    let bookmarkedConversations = [];
    // Always fetch all bookmarked conversations from Supabase if logged in
    if (chatState.useSupabaseStorage && window.supabaseDB) {
        try {
            const { data, error } = await window.supabaseDB.getBookmarkedConversations();
            console.log('[SavedChats] Supabase fetched data:', data, 'Error:', error);
            if (!error && data && data.length > 0) {
                data.forEach(supabaseConv => {
                    let localConv = chatState.conversations.find(c => c.id === supabaseConv.id);
                    if (!localConv) {
                        // Add to local state if missing
                        localConv = {
                            id: supabaseConv.id,
                            title: supabaseConv.title,
                            is_bookmarked: true,
                            createdAt: supabaseConv.created_at,
                            updatedAt: supabaseConv.updated_at,
                            messages: []
                        };
                        chatState.conversations.push(localConv);
                        updateChatStatistics();
                    } else {
                        localConv.is_bookmarked = true;
                    }
                });
                chatState.saveState();
            }
        } catch (error) {
            console.error('[SavedChats] Error fetching from Supabase:', error);
        }
    }
    // Remove loading indicator
    container.innerHTML = '';
    // Filter bookmarked conversations from local state
    bookmarkedConversations = chatState.conversations.filter(c => c.is_bookmarked);
    console.log('[SavedChats] Bookmarked conversations to render:', bookmarkedConversations);
    // Update the saved chats count
    const savedCountElement = document.getElementById('savedChatsCount');
    if (savedCountElement) {
        savedCountElement.textContent = bookmarkedConversations.length > 0 ? bookmarkedConversations.length : '';
    }
    if (bookmarkedConversations.length === 0) {
        const noSavedChats = document.createElement('div');
        noSavedChats.className = 'no-saved-chats';
        noSavedChats.innerHTML = '<i class="fas fa-bookmark"></i><p>No saved chats, bookmark to save.</p>';
        container.appendChild(noSavedChats);
        return;
    }
    // Render bookmarked conversations
    bookmarkedConversations.forEach(conversation => {
        const conversationElement = templateHelper.clone('conversationItemTemplate');
        if (!conversationElement) return;
        const item = conversationElement.querySelector('.conversation-item');
        item.className = `conversation-item ${conversation.id === chatState.currentConversationId ? 'active' : ''}`;
        item.setAttribute('data-id', conversation.id); // For animation/removal
        const titleElement = conversationElement.querySelector('.conversation-title');
        titleElement.setAttribute('title', conversation.title);
        titleElement.textContent = conversation.title;
        // Setup bookmark button (always active in saved chats section)
        const bookmarkBtn = conversationElement.querySelector('.conversation-bookmark-btn');
        if (bookmarkBtn) {
            bookmarkBtn.classList.add('active');
            const icon = bookmarkBtn.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bookmark';
            }
            bookmarkBtn.setAttribute('onclick', `toggleBookmark(event, '${conversation.id}', null, false)`);
        }
        const menuBtn = conversationElement.querySelector('.conversation-menu-btn');
        menuBtn.setAttribute('onclick', `toggleSavedChatMenu(event, '${conversation.id}')`);
        // Use unique dropdown ID for saved chats section
        const dropdown = conversationElement.querySelector('.conversation-dropdown');
        dropdown.id = `saved-dropdown-${conversation.id}`;
        // Clear existing dropdown content and rebuild for saved chats
        dropdown.innerHTML = '';
        // Add hover out event to close dropdown
        dropdown.addEventListener('mouseleave', function () {
            dropdown.classList.remove('show');
        });
        // Prevent closing when moving mouse inside dropdown
        dropdown.addEventListener('mouseenter', function () {
            // No action needed, but could be used for future logic
        });
        // Add Rename option
        const renameBtn = document.createElement('button');
        renameBtn.className = 'conversation-dropdown-item';
        renameBtn.innerHTML = '<i class="fas fa-edit"></i><span>Rename</span>';
        renameBtn.onclick = function (e) {
            e.stopPropagation();
            renameSavedConversation(conversation.id);
        };
        dropdown.appendChild(renameBtn);
        // Add Delete option
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'conversation-dropdown-item danger';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i><span>Delete</span>';
        deleteBtn.onclick = function (e) {
            e.stopPropagation();
            deleteSavedConversation(conversation.id);
        };
        dropdown.appendChild(deleteBtn);
        item.addEventListener('click', async (e) => {
            if (!e.target.closest('.conversation-action') && !e.target.closest('.conversation-bookmark-btn')) {
                // Always load from Supabase if using Supabase storage
                if (chatState.useSupabaseStorage && window.supabaseDB) {
                    await chatState.loadConversation(conversation.id);
                    elements.chatTitle.textContent = conversation.title;
                    chatManager.renderMessages();
                    updateConversationsList();
                } else {
                    // Use the chatState method instead of the removed loadConversation function
                    await chatState.loadConversation(conversation.id);
                    elements.chatTitle.textContent = conversation.title;
                    chatManager.renderMessages();
                    updateConversationsList();
                }

                // Close the saved chats modal after selecting a conversation
                const savedChatsModal = document.getElementById('savedChatsModal');
                if (savedChatsModal) {
                    savedChatsModal.classList.remove('show');
                    console.log('✅ Saved chats modal closed after conversation selection');
                }
            }
        });
        container.appendChild(conversationElement);
    });
}

// Remove from Saved handler with animation (now uses toggleBookmark for full sync)
async function removeFromSavedWithAnimation(conversationId) {
    const itemToRemove = document.querySelector(`.saved-chats-list .conversation-item[data-id="${conversationId}"]`);
    if (itemToRemove) {
        itemToRemove.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        itemToRemove.style.opacity = '0';
        itemToRemove.style.transform = 'translateX(20px)';
        setTimeout(async () => {
            // Use toggleBookmark logic to ensure full sync (UI + Supabase)
            await toggleBookmark(null, conversationId, null, false);
        }, 300);
    } else {
        await toggleBookmark(null, conversationId, null, false);
    }
}

// Update toggleBookmark to accept a forced value and source flag
async function toggleBookmark(event, conversationId, forceBookmarkStatus = null, isFromRemove = false) {
    if (event) {
        event.stopPropagation();
    }
    // Find the conversation in the state
    const conversationIndex = chatState.conversations.findIndex(c => c.id === conversationId);
    if (conversationIndex === -1) return;
    // Toggle or force bookmark status
    let newBookmarkStatus;
    if (forceBookmarkStatus !== null) {
        newBookmarkStatus = forceBookmarkStatus;
    } else {
        const isCurrentlyBookmarked = chatState.conversations[conversationIndex].is_bookmarked || false;
        newBookmarkStatus = !isCurrentlyBookmarked;
    }
    chatState.conversations[conversationIndex].is_bookmarked = newBookmarkStatus;
    // Update all bookmark buttons in All Conversations
    document.querySelectorAll(`.conversations-list .conversation-item[data-id="${conversationId}"] .conversation-bookmark-btn`).forEach(btn => {
        if (btn && btn.classList) {
            if (newBookmarkStatus) {
                btn.classList.add('active');
                const icon = btn.querySelector('i');
                if (icon) icon.className = 'fas fa-bookmark';
            } else {
                btn.classList.remove('active');
                const icon = btn.querySelector('i');
                if (icon) icon.className = 'far fa-bookmark';
            }
        }
    });

    // Also update bookmark buttons in saved chats list
    document.querySelectorAll(`.saved-chats-list .conversation-item[data-id="${conversationId}"] .conversation-bookmark-btn`).forEach(btn => {
        if (btn && btn.classList) {
            if (newBookmarkStatus) {
                btn.classList.add('active');
                const icon = btn.querySelector('i');
                if (icon) icon.className = 'fas fa-bookmark';
            } else {
                btn.classList.remove('active');
                const icon = btn.querySelector('i');
                if (icon) icon.className = 'far fa-bookmark';
            }
        }
    });
    // Update in Supabase if user is logged in
    if (chatState.useSupabaseStorage && window.supabaseDB) {
        try {
            await window.supabaseDB.updateBookmarkStatus(conversationId, newBookmarkStatus);
        } catch (error) {
            console.error('Error updating bookmark status:', error);
            toast.show('Failed to update bookmark status', 'error');
        }
    }
    // Update both lists for full sync
    updateConversationsList();
    updateSavedChatsList();
    chatState.saveState();

    // Force refresh from Supabase if logged in to ensure sync
    if (chatState.useSupabaseStorage && window.supabaseDB) {
        setTimeout(async () => {
            try {
                await chatState.loadConversationsFromSupabase();
                console.log('🔄 Forced refresh from Supabase after bookmark toggle');
            } catch (error) {
                console.error('❌ Error in forced refresh:', error);
            }
        }, 500);
    }
    // Show toast only if not from Remove (to avoid double toasts)
    if (!isFromRemove) {
        if (newBookmarkStatus) {
            toast.show('Chat bookmarked', 'success');
        } else {
            toast.show('Bookmark removed', 'info');
        }
    } else {
        toast.show('Removed from Saved Chats', 'success');
    }
}

// Conversation Menu Management
function toggleConversationMenu(event, conversationId) {
    event.stopPropagation();
    // Close all other dropdowns first
    document.querySelectorAll('.conversation-dropdown.show').forEach(dropdown => {
        if (dropdown.id !== `dropdown-${conversationId}`) {
            dropdown.classList.remove('show');
        }
    });
    const dropdown = document.getElementById(`dropdown-${conversationId}`);
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Saved Chat Menu Management (separate from regular conversation menu)
function toggleSavedChatMenu(event, conversationId) {
    event.stopPropagation();
    // Close all other dropdowns first (both regular and saved)
    document.querySelectorAll('.conversation-dropdown.show').forEach(dropdown => {
        if (dropdown.id !== `saved-dropdown-${conversationId}`) {
            dropdown.classList.remove('show');
        }
    });
    // Toggle the target saved chat dropdown
    const dropdown = document.getElementById(`saved-dropdown-${conversationId}`);
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Cross-linked rename function for saved chats (syncs with all conversations)
async function renameSavedConversation(conversationId) {
    console.log('🔄 Renaming saved conversation:', conversationId);

    // Find the conversation
    const conversation = chatState.conversations.find(c => c.id === conversationId);
    if (!conversation) {
        console.error('❌ Conversation not found:', conversationId);
        return;
    }

    // Show rename modal with current title
    const newTitle = prompt('Enter new conversation title:', conversation.title);
    if (!newTitle || newTitle.trim() === '' || newTitle === conversation.title) {
        return; // User cancelled or no change
    }

    const trimmedTitle = newTitle.trim();

    try {
        // Update in chatState
        conversation.title = trimmedTitle;

        // Update in Supabase if logged in
        if (chatState.useSupabaseStorage && window.supabaseDB) {
            console.log('🔄 Updating conversation title in Supabase...');
            const { error } = await window.supabaseDB.updateConversationTitle(conversationId, trimmedTitle);

            if (error) {
                console.error('❌ Error updating title in Supabase:', error);
                toast.show('Failed to update title in cloud', 'error');
                return;
            }

            console.log('✅ Conversation title updated in Supabase');
        }

        // Update current chat title if this is the active conversation
        if (chatState.currentConversationId === conversationId) {
            elements.chatTitle.textContent = trimmedTitle;
        }

        // Save state locally
        chatState.saveState();

        // Update both UI sections
        updateConversationsList(); // Updates all conversations section
        updateSavedChatsList(); // Updates saved chats modal

        // Close any open dropdowns
        document.querySelectorAll('.conversation-dropdown.show').forEach(dropdown => {
            dropdown.classList.remove('show');
        });

        toast.show('Conversation renamed successfully', 'success');
        console.log('✅ Conversation renamed and synced across all sections');

    } catch (error) {
        console.error('❌ Error renaming conversation:', error);
        toast.show('Failed to rename conversation', 'error');
    }
}

// Cross-linked delete function for saved chats (syncs with all conversations)
async function deleteSavedConversation(conversationId) {
    console.log('🔄 Deleting saved conversation:', conversationId);

    // Find the conversation
    const conversation = chatState.conversations.find(c => c.id === conversationId);
    if (!conversation) {
        console.error('❌ Conversation not found:', conversationId);
        return;
    }

    // Confirm deletion
    const confirmed = confirm(`Are you sure you want to delete "${conversation.title}"? This action cannot be undone.`);
    if (!confirmed) {
        return;
    }

    try {
        // Delete using the existing chatState method (which handles Supabase sync)
        const success = await chatState.deleteConversation(conversationId);

        if (success) {
            // Close any open dropdowns first
            document.querySelectorAll('.conversation-dropdown.show').forEach(dropdown => {
                dropdown.classList.remove('show');
            });

            // Force immediate UI updates with multiple refresh attempts to ensure proper sync
            updateConversationsList(); // Updates all conversations section immediately
            updateSavedChatsList(); // Updates saved chats modal immediately

            // Additional refresh after a short delay to ensure sync
            setTimeout(() => {
                updateConversationsList();
                updateSavedChatsList();
            }, 100);

            // Final refresh to ensure UI is completely synced
            setTimeout(() => {
                updateConversationsList();
                updateSavedChatsList();
            }, 300);

            // If this was the current conversation, clear the chat
            if (chatState.currentConversationId === conversationId) {
                chatState.currentConversationId = null;
                chatState.currentMessages = [];
                elements.chatTitle.textContent = 'New Chat';
                chatManager.renderMessages();
            }

            toast.show('Conversation deleted successfully', 'success');
            console.log('✅ Conversation deleted and synced across all sections');
        } else {
            toast.show('Failed to delete conversation', 'error');
        }

    } catch (error) {
        console.error('❌ Error deleting conversation:', error);
        toast.show('Failed to delete conversation', 'error');
    }
}


async function deleteConversation(id) {
    const confirmed = await modal.confirm(
        'Delete Conversation',
        'Are you sure you want to delete this conversation? This action cannot be undone.'
    );

    if (confirmed) {
        await chatState.deleteConversation(id);
        updateConversationsList();
        updateSavedChatsList();

        if (chatState.currentConversationId === id) {
            chatManager.clearChat();
        }

        toast.show('Conversation deleted', 'success');
    }
}



// Rename Conversation
function renameConversation(conversationId) {
    // Close the dropdown
    const dropdown = document.getElementById(`dropdown-${conversationId}`);
    if (dropdown) {
        dropdown.classList.remove('show');
    }

    // Find the conversation
    const conversation = chatState.conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    // Set current values
    const renameInput = document.getElementById('renameInput');
    renameInput.value = conversation.title;

    // Store the conversation ID for later use
    document.getElementById('renameModal').dataset.conversationId = conversationId;

    // Show the modal
    modal.show('renameModal');

    // Focus and select the input
    setTimeout(() => {
        renameInput.focus();
        renameInput.select();
    }, 100);
}



// Handle rename form submission
async function handleRenameSubmit(event) {
    event.preventDefault();

    const conversationId = document.getElementById('renameModal').dataset.conversationId;
    const newTitle = document.getElementById('renameInput').value.trim();

    if (!newTitle) {
        toast.show('Please enter a valid name', 'warning');
        return;
    }

    if (newTitle.length > 100) {
        toast.show('Name is too long (max 100 characters)', 'warning');
        return;
    }

    // Rename the conversation
    const success = await chatState.renameConversation(conversationId, newTitle);
    if (success) {
        // Update UI in both sections
        updateConversationsList();
        updateSavedChatsList();

        // Update chat title if this is the current conversation
        if (chatState.currentConversationId === conversationId) {
            elements.chatTitle.textContent = newTitle;
        }

        toast.show('Conversation renamed successfully', 'success');
    } else {
        toast.show('Failed to rename conversation', 'error');
    }

    // Close modal
    modal.hide('renameModal');
}


// Keyboard Shortcuts Functions
function getCurrentConversationId() {
    console.log('🔍 Getting current conversation ID...');

    // First check chatState for current conversation
    if (chatState && chatState.currentConversationId) {
        console.log('✅ Found in chatState:', chatState.currentConversationId);
        return chatState.currentConversationId;
    }

    // Check for active conversation in the UI
    const activeConversation = document.querySelector('.conversation-item.active');
    if (activeConversation) {
        const id = activeConversation.dataset.conversationId || activeConversation.dataset.id;
        console.log('✅ Found active conversation in UI:', id);
        return id;
    }

    // Check if there are any conversations at all
    if (chatState && chatState.conversations && chatState.conversations.length > 0) {
        const firstConversation = chatState.conversations[0];
        console.log('✅ Using first conversation as fallback:', firstConversation.id);
        return firstConversation.id;
    }

    console.log('❌ No conversation found');
    return null;
}

function showKeyboardShortcuts() {
    // Open settings modal and navigate to accessibility tab
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
        settingsModal.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Switch to accessibility tab to show keyboard shortcuts
        renderSettingsContent('accessibility');
    }
}


// Settings Tab Management
function getActiveSettingsTab() {
    // First check if there's an active tab in the DOM
    const activeTab = document.querySelector('.settings-tab.active');
    if (activeTab && activeTab.dataset.tab) {
        return activeTab.dataset.tab;
    }

    // Fallback to localStorage
    return localStorage.getItem('sati_active_settings_tab') || 'general';
}

function setActiveSettingsTab(tab) {
    localStorage.setItem('sati_active_settings_tab', tab);
}

// Update chat statistics in settings
function updateChatStatistics() {
    const settingsChatCount = document.getElementById('settingsChatCount');
    if (settingsChatCount) {
        settingsChatCount.textContent = chatState.conversations.length;
    }
}

// Settings Management
function renderSettingsContent(tab) {
    // Stop voice test when switching between settings tabs
    if (isVoiceTestPlaying) {
        console.log('🔊 Switching settings tab, stopping voice test');
        stopVoiceTest();
    }
    
    const content = document.getElementById('settingsContent');
    const settingsModal = document.querySelector('.settings-modal');

    // Store the current active tab
    setActiveSettingsTab(tab);

    // Update active tab in the sidebar
    document.querySelectorAll('.settings-tab').forEach(t => {
        t.classList.remove('active');
    });
    const targetTab = document.querySelector(`.settings-tab[data-tab="${tab}"]`);
    if (targetTab) {
        targetTab.classList.add('active');
    }

    // Remove all tab-specific classes
    if (settingsModal) {
        settingsModal.classList.remove('tab-general', 'tab-appearance', 'tab-chat', 'tab-accessibility', 'tab-notifications', 'tab-privacy');
        // Add current tab class
        settingsModal.classList.add(`tab-${tab}`);
    }

    switch (tab) {
        case 'general':
            templateHelper.replaceTo('settingsGeneralTemplate', content);
            break;

        case 'appearance':
            templateHelper.replaceTo('settingsAppearanceTemplate', content);
            break;

        case 'chat':
            templateHelper.replaceTo('settingsChatTemplate', content);
            updateChatStatistics();
            break;

        case 'accessibility':
            templateHelper.replaceTo('settingsAccessibilityTemplate', content);
            break;

        case 'notifications':
            templateHelper.replaceTo('settingsNotificationsTemplate', content);
            break;

        case 'privacy':
            templateHelper.replaceTo('settingsPrivacyTemplate', content);
            break;
    }

    // Load current settings
    loadSettingsValues();

    // Add event listeners for settings changes
    addSettingsEventListeners();
}



// API Configuration Functions
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}



function updateModelOptions() {
    const providerSelect = document.getElementById('apiProviderSetting');
    const modelSelect = document.getElementById('aiModelSetting');

    if (!providerSelect || !modelSelect || !window.apiManager) return;

    const provider = providerSelect.value;
    window.apiManager.setProvider(provider);

    // Clear existing options
    modelSelect.innerHTML = '';

    // Get available models for the selected provider
    const models = window.apiManager.getAvailableModels();

    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = window.apiManager.formatModelName(model);

        // Disable Gemini 1.5 Pro if it's a Gemini provider
        if (model === 'gemini-1.5-pro' && provider === 'gemini') {
            option.disabled = true;
            option.textContent += ' (Coming Soon)';
            option.style.color = '#888';
        }

        modelSelect.appendChild(option);
    });

    // Add click event listener to handle disabled option clicks
    modelSelect.addEventListener('click', (e) => {
        if (e.target.tagName === 'OPTION' && e.target.disabled) {
            e.preventDefault();
            if (e.target.value === 'gemini-1.5-pro') {
                toast.show('🚀 Gemini 1.5 Pro model will add soon', 'info', 4000);
            }
        }
    });

    // Set current model if available, but avoid setting disabled model
    if (models.includes(window.apiManager.currentModel) &&
        !(window.apiManager.currentModel === 'gemini-1.5-pro' && provider === 'gemini')) {
        modelSelect.value = window.apiManager.currentModel;
    } else if (models.length > 0) {
        // Find first available (non-disabled) model
        const availableModel = models.find(model =>
            !(model === 'gemini-1.5-pro' && provider === 'gemini')
        );
        if (availableModel) {
            modelSelect.value = availableModel;
            window.apiManager.setModel(availableModel);
        }
    }


}




function loadSettingsValues() {
    // Load values from chatState.settings
    const settings = chatState.settings;

    // API settings
    const apiProviderSetting = document.getElementById('apiProviderSetting');
    if (apiProviderSetting && window.apiManager) {
        apiProviderSetting.value = window.apiManager.currentProvider;
        updateModelOptions();
    }

    const aiModelSetting = document.getElementById('aiModelSetting');
    if (aiModelSetting && window.apiManager) {
        aiModelSetting.value = window.apiManager.currentModel;
    }

    // Font style setting (now in appearance)
    const fontStyleSetting = document.getElementById('fontStyleSetting');
    if (fontStyleSetting) {
        fontStyleSetting.value = settings.appearance?.fontStyle || 'Inter';
    }

    // Appearance settings
    const currentAccentColor = settings.appearance?.accentColor || '#10a37f';
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.color === currentAccentColor) {
            option.classList.add('selected');
        }
    });

    const currentFontSize = settings.appearance?.fontSize || 16;
    const settingsFontSizeSlider = document.getElementById('settingsFontSizeSlider');
    const settingsFontSizeValue = document.getElementById('settingsFontSizeValue');
    if (settingsFontSizeSlider && settingsFontSizeValue) {
        settingsFontSizeSlider.value = currentFontSize;
        settingsFontSizeValue.textContent = currentFontSize + 'px';
    }

    // Voice settings
    loadVoiceSettings();
    
    // Hide voice features for mobile APK
    hideVoiceFeaturesForMobileAPK();
    
    // Add observer to stop voice test when settings modal is closed
    setupSettingsModalObserver();
}

// Function to setup observer for settings modal close events
function setupSettingsModalObserver() {
    // Watch for settings modal visibility changes
    const settingsModal = document.getElementById('settingsModal');
    if (!settingsModal) return;
    
    // Create a MutationObserver to watch for class changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                // Check if modal is being hidden (no longer has 'show' class)
                if (!target.classList.contains('show') && isVoiceTestPlaying) {
                    console.log('🔊 Settings modal closed, stopping voice test');
                    stopVoiceTest();
                }
            }
        });
    });
    
    // Start observing
    observer.observe(settingsModal, {
        attributes: true,
        attributeFilter: ['class']
    });
    
    // Also add click event listener to modal overlay to stop voice test
    const modalOverlay = settingsModal.closest('.modal-overlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            // If clicking on the overlay (not the modal content), stop voice test
            if (e.target === modalOverlay && isVoiceTestPlaying) {
                console.log('🔊 Modal overlay clicked, stopping voice test');
                stopVoiceTest();
            }
        });
    }
    
    // Add keyboard event listener for Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isVoiceTestPlaying) {
            // Check if settings modal is open
            const settingsModalOverlay = document.querySelector('.modal-overlay.show #settingsModal');
            if (settingsModalOverlay) {
                console.log('🔊 Escape key pressed, stopping voice test');
                stopVoiceTest();
            }
        }
    });
    
    // Add page unload listener to stop voice test
    window.addEventListener('beforeunload', () => {
        if (isVoiceTestPlaying) {
            console.log('🔊 Page unloading, stopping voice test');
            stopVoiceTest();
        }
    });
    
    // Add visibility change listener to stop voice test when tab becomes hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && isVoiceTestPlaying) {
            console.log('🔊 Tab hidden, stopping voice test');
            stopVoiceTest();
        }
    });
}

function addSettingsEventListeners() {
    // Add event listeners for all settings controls
    const settingsControls = document.querySelectorAll('#settingsContent input, #settingsContent select');

    settingsControls.forEach(control => {
        // Skip special controls that have their own handlers to prevent duplicate events
        if (control.id === 'apiProviderSetting' || 
            control.id === 'aiModelSetting' || 
            control.id === 'fontStyleSetting' ||
            control.id === 'voiceModelSetting' ||
            control.id === 'voiceRateSlider' ||
            control.id === 'voicePitchSlider' ||
            control.id === 'voiceVolumeSlider' ||
            control.id === 'testVoiceBtn') {
            return;
        }
        control.addEventListener('change', saveSettingsFromForm);
    });

    // Special handling for API provider changes
    const apiProviderSetting = document.getElementById('apiProviderSetting');
    if (apiProviderSetting) {
        apiProviderSetting.addEventListener('change', (e) => {
            if (window.apiManager) {
                const newProvider = e.target.value;
                window.apiManager.setProvider(newProvider);

                // If switching to Gemini and current model is Gemini 1.5 Pro, switch to Flash
                if (newProvider === 'gemini' && window.apiManager.currentModel === 'gemini-1.5-pro') {
                    window.apiManager.setModel('gemini-1.5-flash');
                    chatState.selectedModel = 'gemini-1.5-flash';
                    toast.show('🚀 Gemini 1.5 Pro model will add soon. Switched to Gemini 1.5 Flash.', 'info', 4000);
                }

                updateModelOptions();
                updateMainModelSelect(); // Update main input area model select
                saveSettingsFromForm();
            }
        });
    }

    // Special handling for model changes
    const aiModelSetting = document.getElementById('aiModelSetting');
    if (aiModelSetting) {
        aiModelSetting.addEventListener('change', (e) => {
            if (window.apiManager) {
                // Check if user tried to select disabled Gemini 1.5 Pro
                if (e.target.value === 'gemini-1.5-pro' &&
                    window.apiManager.currentProvider === 'gemini') {
                    // Show coming soon message
                    toast.show('🚀 Gemini 1.5 Pro model will add soon', 'info', 4000);

                    // Reset to previous valid selection
                    const availableModels = window.apiManager.getAvailableModels();
                    const fallbackModel = availableModels.find(model =>
                        model !== 'gemini-1.5-pro'
                    ) || availableModels[0];

                    if (fallbackModel) {
                        e.target.value = fallbackModel;
                        window.apiManager.setModel(fallbackModel);
                        chatState.selectedModel = fallbackModel;
                    }
                    return;
                }

                // Update API manager and chatState
                window.apiManager.setModel(e.target.value);
                chatState.selectedModel = e.target.value;

                // Sync with input area model select
                updateMainModelSelect();

                // Save settings
                saveSettingsFromForm();

                // Show confirmation
                toast.show(`AI Model changed to ${window.apiManager.formatModelName(e.target.value)}`, 'success');
            }
        });
    }



    // Special handling for sliders - input event for real-time updates, change event for saving
    const behaviorSlider = document.getElementById('behaviorSlider');
    if (behaviorSlider) {
        behaviorSlider.addEventListener('input', (e) => {
            document.getElementById('behaviorValue').textContent = e.target.value;
            // Note: saveSettingsFromForm() is called by the general change event listener
        });
    }

    // Font style handling (now in appearance settings)
    const fontStyleSetting = document.getElementById('fontStyleSetting');
    if (fontStyleSetting) {
        fontStyleSetting.addEventListener('change', (e) => {
            const selectedFont = e.target.value;
            document.documentElement.style.setProperty('--font-family', `'${selectedFont}', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`);
            toast.show(`Font changed to ${selectedFont}`, 'success');
            saveSettingsFromForm();
        });
    }

    // Appearance settings - Color selection
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            e.target.classList.add('selected');

            const color = e.target.dataset.color;

            // Save to settings
            if (!chatState.settings.appearance) {
                chatState.settings.appearance = {};
            }
            chatState.settings.appearance.accentColor = color;
            chatState.saveSettings();

            // Apply accent color
            document.documentElement.style.setProperty('--accent-color', color);

            // Convert HEX to HSV, increase V, convert back to HEX
            const accentHover = increaseBrightness(color, 0.1);
            document.documentElement.style.setProperty('--accent-hover', accentHover);

            // Immediately update all accent-related UI (including input outline)
            if (chatState.applyAppearanceSettings) {
                chatState.applyAppearanceSettings();
            }

            toast.show('Accent color updated', 'success');
        });
    });

    // Appearance settings - Font size slider
    const settingsFontSizeSlider = document.getElementById('settingsFontSizeSlider');
    const settingsFontSizeValue = document.getElementById('settingsFontSizeValue');
    if (settingsFontSizeSlider && settingsFontSizeValue) {
        settingsFontSizeSlider.addEventListener('input', (e) => {
            const fontSize = parseInt(e.target.value);
            settingsFontSizeValue.textContent = fontSize + 'px';

            // Save to settings
            if (!chatState.settings.appearance) {
                chatState.settings.appearance = {};
            }
            chatState.settings.appearance.fontSize = fontSize;
            chatState.saveSettings();

            // Apply the change
            document.documentElement.style.fontSize = fontSize + 'px';
        });
    }

    // Voice settings event listeners
    addVoiceSettingsEventListeners();
}

// Voice Settings Functions
function loadVoiceSettings() {
    const settings = chatState.settings;
    
    // Initialize voice settings if not exists
    if (!settings.voice) {
        settings.voice = {
            selectedVoice: '',
            rate: 1.0,
            pitch: 1.0,
            volume: 1.0
        };
    }

    // Populate voice model dropdown
    populateVoiceModels();

    // Load voice settings values
    const voiceModelSetting = document.getElementById('voiceModelSetting');
    if (voiceModelSetting) {
        voiceModelSetting.value = settings.voice.selectedVoice || '';
    }

    // Voice rate slider
    const voiceRateSlider = document.getElementById('voiceRateSlider');
    const voiceRateValue = document.getElementById('voiceRateValue');
    if (voiceRateSlider && voiceRateValue) {
        voiceRateSlider.value = settings.voice.rate || 1.0;
        voiceRateValue.textContent = (settings.voice.rate || 1.0) + 'x';
    }

    // Voice pitch slider
    const voicePitchSlider = document.getElementById('voicePitchSlider');
    const voicePitchValue = document.getElementById('voicePitchValue');
    if (voicePitchSlider && voicePitchValue) {
        voicePitchSlider.value = settings.voice.pitch || 1.0;
        voicePitchValue.textContent = (settings.voice.pitch || 1.0) + 'x';
    }

    // Voice volume slider
    const voiceVolumeSlider = document.getElementById('voiceVolumeSlider');
    const voiceVolumeValue = document.getElementById('voiceVolumeValue');
    if (voiceVolumeSlider && voiceVolumeValue) {
        voiceVolumeSlider.value = settings.voice.volume || 1.0;
        voiceVolumeValue.textContent = Math.round((settings.voice.volume || 1.0) * 100) + '%';
    }
}

function populateVoiceModels() {
    const voiceModelSetting = document.getElementById('voiceModelSetting');
    if (!voiceModelSetting) return;

    // Clear existing options
    voiceModelSetting.innerHTML = '<option value="">🔄 Loading voices...</option>';

    // Function to load voices
    const loadVoices = () => {
        const voices = speechSynthesis.getVoices();
        
        if (voices.length === 0) {
            // Voices not loaded yet, try again
            setTimeout(loadVoices, 100);
            return;
        }

        // Clear loading option
        voiceModelSetting.innerHTML = '';

        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '🤖 Browser Default Voice';
        voiceModelSetting.appendChild(defaultOption);

        // Filter voices to keep only US English, Hindi, and browser default
        const filteredVoices = filterAllowedVoices(voices);

        // Group filtered voices by language
        const voiceGroups = {};
        filteredVoices.forEach(voice => {
            const lang = voice.lang.split('-')[0]; // Get language code (e.g., 'en' from 'en-US')
            if (!voiceGroups[lang]) {
                voiceGroups[lang] = [];
            }
            voiceGroups[lang].push(voice);
        });

        // Add US English voices first
        if (voiceGroups['en']) {
            const englishGroup = document.createElement('optgroup');
            englishGroup.label = '🇺🇸 US English Voices';
            voiceGroups['en'].forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.name;
                const gender = voice.name.toLowerCase().includes('female') || 
                              voice.name.toLowerCase().includes('woman') ||
                              voice.name.toLowerCase().includes('zira') ||
                              voice.name.toLowerCase().includes('hazel') ||
                              voice.name.toLowerCase().includes('samantha') ||
                              voice.name.includes('Google US English') ? '♀️' : '♂️';
                option.textContent = `${gender} ${voice.name} (${voice.lang})`;
                englishGroup.appendChild(option);
            });
            voiceModelSetting.appendChild(englishGroup);
        }

        // Add Hindi voices
        if (voiceGroups['hi']) {
            const hindiGroup = document.createElement('optgroup');
            hindiGroup.label = '🇮🇳 Hindi Voices';
            voiceGroups['hi'].forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.name;
                const gender = voice.name.toLowerCase().includes('female') || 
                              voice.name.toLowerCase().includes('woman') ||
                              voice.name.includes('Microsoft Kalpana') ||
                              voice.name.includes('Google हिन्दी') ? '♀️' : '♂️';
                option.textContent = `${gender} ${voice.name} (${voice.lang})`;
                hindiGroup.appendChild(option);
            });
            voiceModelSetting.appendChild(hindiGroup);
        }

        console.log(`✅ Loaded ${filteredVoices.length} filtered voice models (US English, Hindi, and Default only)`);
    };

    // Load voices immediately if available, otherwise wait for voiceschanged event
    if (speechSynthesis.getVoices().length > 0) {
        loadVoices();
    } else {
        speechSynthesis.addEventListener('voiceschanged', loadVoices, { once: true });
    }
}

function getLanguageName(langCode) {
    const languages = {
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'pt': 'Portuguese',
        'ru': 'Russian',
        'ja': 'Japanese',
        'ko': 'Korean',
        'zh': 'Chinese',
        'ar': 'Arabic',
        'hi': 'Hindi'
    };
    return languages[langCode] || langCode.toUpperCase();
}

function addVoiceSettingsEventListeners() {
    // Voice model selection
    const voiceModelSetting = document.getElementById('voiceModelSetting');
    if (voiceModelSetting) {
        voiceModelSetting.addEventListener('change', (e) => {
            console.log('🔊 Voice model changed to:', e.target.value);
            
            if (!chatState.settings.voice) chatState.settings.voice = {};
            chatState.settings.voice.selectedVoice = e.target.value;
            chatState.saveSettings();
            
            // Update voice mode if active
            if (window.voiceMode) {
                window.voiceMode.updateVoiceSettings();
            }
            
            // Refresh voice preview with new selection
            refreshVoicePreview();
            
            toast.show('Voice model updated', 'success');
        });
    }

    // Test voice button
    const testVoiceBtn = document.getElementById('testVoiceBtn');
    if (testVoiceBtn) {
        testVoiceBtn.addEventListener('click', () => {
            // Prevent voice test in mobile APK
            if (IS_MOBILE_APK) {
                console.log('🔇 Voice test disabled in mobile APK');
                toast.show('Voice test is not available in mobile app', 'warning');
                return;
            }
            testSelectedVoice();
        });
    }

    // Voice rate slider
    const voiceRateSlider = document.getElementById('voiceRateSlider');
    const voiceRateValue = document.getElementById('voiceRateValue');
    if (voiceRateSlider && voiceRateValue) {
        voiceRateSlider.addEventListener('input', (e) => {
            const rate = parseFloat(e.target.value);
            voiceRateValue.textContent = rate + 'x';
            
            if (!chatState.settings.voice) chatState.settings.voice = {};
            chatState.settings.voice.rate = rate;
            chatState.saveSettings();
            
            // Update voice mode if active
            if (window.voiceMode) {
                window.voiceMode.updateVoiceSettings();
            }
            
            // Apply real-time settings to voice preview
            applyRealTimeVoiceSettings();
        });
    }

    // Voice pitch slider
    const voicePitchSlider = document.getElementById('voicePitchSlider');
    const voicePitchValue = document.getElementById('voicePitchValue');
    if (voicePitchSlider && voicePitchValue) {
        voicePitchSlider.addEventListener('input', (e) => {
            const pitch = parseFloat(e.target.value);
            voicePitchValue.textContent = pitch + 'x';
            
            if (!chatState.settings.voice) chatState.settings.voice = {};
            chatState.settings.voice.pitch = pitch;
            chatState.saveSettings();
            
            // Update voice mode if active
            if (window.voiceMode) {
                window.voiceMode.updateVoiceSettings();
            }
            
            // Apply real-time settings to voice preview
            applyRealTimeVoiceSettings();
        });
    }

    // Voice volume slider
    const voiceVolumeSlider = document.getElementById('voiceVolumeSlider');
    const voiceVolumeValue = document.getElementById('voiceVolumeValue');
    if (voiceVolumeSlider && voiceVolumeValue) {
        voiceVolumeSlider.addEventListener('input', (e) => {
            const volume = parseFloat(e.target.value);
            voiceVolumeValue.textContent = Math.round(volume * 100) + '%';
            
            if (!chatState.settings.voice) chatState.settings.voice = {};
            chatState.settings.voice.volume = volume;
            chatState.saveSettings();
            
            // Update voice mode if active
            if (window.voiceMode) {
                window.voiceMode.updateVoiceSettings();
            }
            
            // Apply real-time settings to voice preview
            applyRealTimeVoiceSettings();
        });
    }
}

// Global variables to track voice test state
let isVoiceTestPlaying = false;
let currentTestUtterance = null;
let voiceTestTimeout = null;
let lastSettingsChangeTime = 0;

// Helper function to filter voices to keep only US English, Hindi, and default voices
function filterAllowedVoices(voices) {
    return voices.filter(voice => {
        const lang = voice.lang.toLowerCase();
        // Keep US English voices (en-US)
        if (lang.startsWith('en-us')) return true;
        // Keep Hindi voices (hi, hi-IN)
        if (lang.startsWith('hi')) return true;
        // Keep any voice marked as default
        if (voice.default) return true;
        return false;
    });
}

// Helper function to ensure voices are loaded and apply selected voice
function applySelectedVoice(utterance, callback) {
    const voiceModelSetting = document.getElementById('voiceModelSetting');
    const selectedVoiceName = voiceModelSetting ? voiceModelSetting.value : '';
    
    if (!selectedVoiceName) {
        console.log('🔊 No voice selected, using default');
        if (callback) callback();
        return;
    }
    
    const voices = speechSynthesis.getVoices();
    console.log('🔊 Applying voice:', selectedVoiceName, 'Available voices:', voices.length);
    
    if (voices.length === 0) {
        // Voices not loaded yet, wait for them
        console.log('🔊 Waiting for voices to load...');
        speechSynthesis.addEventListener('voiceschanged', () => {
            const newVoices = speechSynthesis.getVoices();
            const selectedVoice = newVoices.find(voice => voice.name === selectedVoiceName);
            if (selectedVoice && utterance) {
                utterance.voice = selectedVoice;
                console.log('🔊 Voice applied after loading:', selectedVoice.name);
            } else {
                console.log('🔊 Voice not found after loading:', selectedVoiceName);
            }
            if (callback) callback();
        }, { once: true });
    } else {
        const selectedVoice = voices.find(voice => voice.name === selectedVoiceName);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
            console.log('🔊 Voice applied immediately:', selectedVoice.name);
        } else {
            console.log('🔊 Voice not found:', selectedVoiceName);
            console.log('🔊 Available voice names:', voices.map(v => v.name));
        }
        if (callback) callback();
    }
}

// Force refresh voices and restart preview if active
function refreshVoicePreview() {
    console.log('🔊 Refreshing voice preview');
    
    // If voice test is currently playing, restart it with new voice
    if (isVoiceTestPlaying && currentTestUtterance) {
        console.log('🔊 Restarting voice preview with new voice selection');
        
        // Stop current speech
        speechSynthesis.cancel();
        
        // Clear any timeouts
        if (voiceTestTimeout) {
            clearTimeout(voiceTestTimeout);
        }
        
        // Restart with new voice after a short delay
        setTimeout(() => {
            if (isVoiceTestPlaying) {
                startContinuousVoiceTest();
            }
        }, 100);
    }
}

function testSelectedVoice() {
    // Prevent voice test in mobile APK
    if (IS_MOBILE_APK) {
        console.log('🔇 Voice test blocked in mobile APK');
        return;
    }
    
    const voiceModelSetting = document.getElementById('voiceModelSetting');
    const testVoiceBtn = document.getElementById('testVoiceBtn');

    console.log('🔊 testSelectedVoice called');
    console.log('🔊 voiceModelSetting found:', !!voiceModelSetting);
    console.log('🔊 testVoiceBtn found:', !!testVoiceBtn);
    console.log('🔊 isVoiceTestPlaying:', isVoiceTestPlaying);
    console.log('🔊 speechSynthesis available:', !!window.speechSynthesis);

    if (!voiceModelSetting) {
        console.log('🔊 Voice model setting element not found (likely hidden on mobile)');
        // Continue with voice test using default voice on mobile
    }

    // Check if speech synthesis is supported
    if (!window.speechSynthesis) {
        console.error('🔊 Speech synthesis not supported');
        toast.show('Voice preview not supported in this browser', 'error');
        return;
    }

    // If currently playing, stop the test
    if (isVoiceTestPlaying) {
        console.log('🔊 Stopping current voice test');
        stopVoiceTest();
        return;
    }

    // Start voice test
    console.log('🔊 Starting voice test');
    startVoiceTest();
}

function startVoiceTest() {
    const testVoiceBtn = document.getElementById('testVoiceBtn');

    console.log('🔊 startVoiceTest called');

    // Update button state
    if (testVoiceBtn) {
        testVoiceBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Test';
        isVoiceTestPlaying = true;
        console.log('🔊 Button updated to Stop Test');
    }

    // Stop any ongoing speech
    speechSynthesis.cancel();
    
    // Clear any existing timeouts
    if (voiceTestTimeout) {
        clearTimeout(voiceTestTimeout);
    }
    
    // Try simple voice test first
    if (!startSimpleVoiceTest()) {
        // Fallback to continuous voice testing
        startContinuousVoiceTest();
    }
    
    toast.show('Voice test active - adjust settings in real-time!', 'info', 2000);
}

function startSimpleVoiceTest() {
    try {
        console.log('🔊 Attempting simple voice test');
        
        const testText = "Hello! This is a voice test. I am your SATI ChatBot assistant.";
        const utterance = new SpeechSynthesisUtterance(testText);
        
        // Apply basic settings
        const voiceModelSetting = document.getElementById('voiceModelSetting');
        const voiceRateSlider = document.getElementById('voiceRateSlider');
        const voicePitchSlider = document.getElementById('voicePitchSlider');
        const voiceVolumeSlider = document.getElementById('voiceVolumeSlider');
        
        if (voiceRateSlider) utterance.rate = parseFloat(voiceRateSlider.value) || 1.0;
        if (voicePitchSlider) utterance.pitch = parseFloat(voicePitchSlider.value) || 1.0;
        if (voiceVolumeSlider) utterance.volume = parseFloat(voiceVolumeSlider.value) || 1.0;
        
        // Apply selected voice using helper function
        applySelectedVoice(utterance, () => {
            console.log('🔊 Voice application completed for simple test');
        });
        
        utterance.onstart = () => {
            console.log('🔊 Simple voice test started');
            isVoiceTestPlaying = true;
        };
        
        utterance.onend = () => {
            console.log('🔊 Simple voice test ended');
            if (isVoiceTestPlaying) {
                // Continue with continuous testing
                setTimeout(() => startContinuousVoiceTest(), 500);
            }
        };
        
        utterance.onerror = (event) => {
            console.error('🔊 Simple voice test error:', event.error);
            return false;
        };
        
        speechSynthesis.speak(utterance);
        currentTestUtterance = utterance;
        
        console.log('🔊 Simple voice test started successfully');
        return true;
        
    } catch (error) {
        console.error('🔊 Simple voice test failed:', error);
        return false;
    }
}

function startContinuousVoiceTest() {
    if (!isVoiceTestPlaying) return;
    
    // Check if speech synthesis is available
    if (!window.speechSynthesis) {
        console.error('🔊 Speech synthesis not supported');
        toast.show('Voice preview not supported in this browser', 'error');
        resetVoiceTestButton();
        return;
    }
    
    const voiceModelSetting = document.getElementById('voiceModelSetting');
    const voiceRateSlider = document.getElementById('voiceRateSlider');
    const voicePitchSlider = document.getElementById('voicePitchSlider');
    const voiceVolumeSlider = document.getElementById('voiceVolumeSlider');

    // Create a continuous test phrase
    const testTexts = [
        "Hello! I'm your SATI ChatBot voice assistant.",
        "This is a continuous voice test. Try changing the speed, pitch, or volume while I'm speaking.",
    ];
    
    const randomText = testTexts[Math.floor(Math.random() * testTexts.length)];
    
    try {
        currentTestUtterance = new SpeechSynthesisUtterance(randomText);
    } catch (error) {
        console.error('🔊 Error creating speech utterance:', error);
        toast.show('Voice preview error', 'error');
        resetVoiceTestButton();
        return;
    }

    // Apply current settings
    if (voiceRateSlider) currentTestUtterance.rate = parseFloat(voiceRateSlider.value);
    if (voicePitchSlider) currentTestUtterance.pitch = parseFloat(voicePitchSlider.value);
    if (voiceVolumeSlider) currentTestUtterance.volume = parseFloat(voiceVolumeSlider.value);

    // Apply selected voice using helper function
    applySelectedVoice(currentTestUtterance, () => {
        console.log('🔊 Voice application completed for continuous test');
    });

    // Handle utterance events
    currentTestUtterance.onstart = () => {
        console.log('🔊 Continuous voice test started');
        isVoiceTestPlaying = true;
    };

    currentTestUtterance.onend = () => {
        console.log('🔊 Continuous voice test ended');
        // Continue the loop if still active
        if (isVoiceTestPlaying) {
            setTimeout(() => {
                startContinuousVoiceTest();
            }, 1000); // 1 second pause between iterations
        }
    };

    currentTestUtterance.onerror = (event) => {
        console.error('🔊 Continuous voice test error:', event.error);
        // Try to continue even after error
        if (isVoiceTestPlaying) {
            setTimeout(() => {
                startContinuousVoiceTest();
            }, 1000);
        }
    };

    // Speak the continuous test
    try {
        speechSynthesis.speak(currentTestUtterance);
        console.log('🔊 Started speaking:', randomText.substring(0, 50) + '...');
    } catch (error) {
        console.error('🔊 Error starting speech:', error);
        toast.show('Voice preview failed to start', 'error');
        resetVoiceTestButton();
    }
}

function stopVoiceTest() {
    console.log('🔊 Stopping voice test');
    
    // Clear any timeouts
    if (voiceTestTimeout) {
        clearTimeout(voiceTestTimeout);
        voiceTestTimeout = null;
    }
    
    // Stop speech synthesis
    speechSynthesis.cancel();
    
    // Reset state
    resetVoiceTestButton();
    
    toast.show('Voice test stopped', 'info', 1000);
}



function resetVoiceTestButton() {
    const testVoiceBtn = document.getElementById('testVoiceBtn');
    if (testVoiceBtn) {
        testVoiceBtn.innerHTML = '<i class="fas fa-play"></i> Preview Voice';
        isVoiceTestPlaying = false;
        currentTestUtterance = null;
    }
    
    // Clear any remaining timeouts
    if (voiceTestTimeout) {
        clearTimeout(voiceTestTimeout);
        voiceTestTimeout = null;
    }
}

function updateTestUtteranceSettings() {
    if (!currentTestUtterance) return;

    const voiceRateSlider = document.getElementById('voiceRateSlider');
    const voicePitchSlider = document.getElementById('voicePitchSlider');
    const voiceVolumeSlider = document.getElementById('voiceVolumeSlider');

    // Apply current settings to the utterance
    if (voiceRateSlider) currentTestUtterance.rate = parseFloat(voiceRateSlider.value);
    if (voicePitchSlider) currentTestUtterance.pitch = parseFloat(voicePitchSlider.value);
    if (voiceVolumeSlider) currentTestUtterance.volume = parseFloat(voiceVolumeSlider.value);
}

// h

function applyRealTimeVoiceSettings() {
    // If voice test is playing, provide immediate feedback with debouncing
    if (isVoiceTestPlaying) {
        console.log('🔊 Applying real-time voice settings');
        
        // Update the timestamp of the last settings change
        lastSettingsChangeTime = Date.now();
        
        // Clear any existing timeout
        if (voiceTestTimeout) {
            clearTimeout(voiceTestTimeout);
        }
        
        // Stop current speech immediately for instant feedback
        speechSynthesis.cancel();
        
        // Set a short timeout to avoid rapid-fire changes
        voiceTestTimeout = setTimeout(() => {
            if (isVoiceTestPlaying && Date.now() - lastSettingsChangeTime >= 200) {
                // Start a quick demo with new settings
                startSettingsDemo();
            }
        }, 200); // 200ms debounce for faster response
    }
}

function startSettingsDemo() {
    if (!isVoiceTestPlaying) return;
    
    const voiceModelSetting = document.getElementById('voiceModelSetting');
    const voiceRateSlider = document.getElementById('voiceRateSlider');
    const voicePitchSlider = document.getElementById('voicePitchSlider');
    const voiceVolumeSlider = document.getElementById('voiceVolumeSlider');

    // Create a short demo phrase that reflects the current settings
    const rate = voiceRateSlider ? parseFloat(voiceRateSlider.value) : 1.0;
    const pitch = voicePitchSlider ? parseFloat(voicePitchSlider.value) : 1.0;
    const volume = voiceVolumeSlider ? parseFloat(voiceVolumeSlider.value) : 1.0;
    
    let demoText = "Settings updated! ";

    // Create demo utterance
    currentTestUtterance = new SpeechSynthesisUtterance(demoText);

    // Apply current settings
    currentTestUtterance.rate = rate;
    currentTestUtterance.pitch = pitch;
    currentTestUtterance.volume = volume;

    // Apply selected voice using helper function
    applySelectedVoice(currentTestUtterance, () => {
        console.log('🔊 Voice application completed for settings demo');
    });

    // Handle utterance events
    currentTestUtterance.onstart = () => {
        console.log('🔊 Settings demo started');
    };

    currentTestUtterance.onend = () => {
        console.log('🔊 Settings demo ended, resuming continuous test');
        // Continue with continuous voice test after demo
        if (isVoiceTestPlaying) {
            setTimeout(() => {
                startContinuousVoiceTest();
            }, 300);
        }
    };

    currentTestUtterance.onerror = (event) => {
        console.error('🔊 Settings demo error:', event.error);
        // Continue with continuous test even after error
        if (isVoiceTestPlaying) {
            setTimeout(() => {
                startContinuousVoiceTest();
            }, 300);
        }
    };

    // Speak the demo
    speechSynthesis.speak(currentTestUtterance);
}

function saveSettingsFromForm() {
    // Save all settings from form to chatState.settings
    const settings = chatState.settings;

    const apiProviderSetting = document.getElementById('apiProviderSetting');
    if (apiProviderSetting) {
        settings.general.apiProvider = apiProviderSetting.value;
        chatState.apiProvider = apiProviderSetting.value;
        chatState.saveState();
        // Update model selection visibility
        updateModelSelectionVisibility();
    }

    // AI Model setting
    const aiModelSetting = document.getElementById('aiModelSetting');
    if (aiModelSetting && aiModelSetting.value) {
        chatState.selectedModel = aiModelSetting.value;
        chatState.saveState();
    }

    // Font style setting (now in appearance)
    const fontStyleSetting = document.getElementById('fontStyleSetting');
    if (fontStyleSetting) {
        if (!settings.appearance) settings.appearance = {};
        settings.appearance.fontStyle = fontStyleSetting.value;
    }

    chatState.saveSettings();
    toast.show('Settings saved', 'success');
}

// Function to update the main input area model select based on API provider
function updateMainModelSelect() {
    const modelSelect = document.getElementById('modelSelect');
    if (!modelSelect || !window.apiManager) return;

    const apiProvider = chatState.settings.general?.apiProvider || chatState.apiProvider || 'groq';

    // Clear existing options
    modelSelect.innerHTML = '';

    // Get available models for the current provider
    window.apiManager.setProvider(apiProvider);
    const models = window.apiManager.getAvailableModels();

    // Populate model options
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = window.apiManager.formatModelName(model);

        // Disable Gemini 1.5 Pro if it's a Gemini provider
        if (model === 'gemini-1.5-pro' && apiProvider === 'gemini') {
            option.disabled = true;
            option.textContent += ' (Coming Soon)';
            option.style.color = '#888';
        }

        modelSelect.appendChild(option);
    });

    // Add click event listener to handle disabled option clicks
    modelSelect.addEventListener('click', (e) => {
        if (e.target.tagName === 'OPTION' && e.target.disabled) {
            e.preventDefault();
            if (e.target.value === 'gemini-1.5-pro') {
                toast.show('🚀 Gemini 1.5 Pro model will add soon', 'info', 4000);
            }
        }
    });

    // Set current model if available, otherwise set first available model
    const currentModel = window.apiManager.currentModel || chatState.selectedModel;

    if (models.includes(currentModel) &&
        !(currentModel === 'gemini-1.5-pro' && apiProvider === 'gemini')) {
        modelSelect.value = currentModel;
        chatState.selectedModel = currentModel;
    } else if (models.length > 0) {
        // Find first available (non-disabled) model
        const availableModel = models.find(model =>
            !(model === 'gemini-1.5-pro' && apiProvider === 'gemini')
        );
        if (availableModel) {
            chatState.selectedModel = availableModel;
            modelSelect.value = availableModel;
            window.apiManager.setModel(availableModel);
        }
    }

    chatState.saveState();
}


// Function to handle model overload and suggest alternatives
function handleModelOverload(errorMessage) {
    if (!window.apiManager) return false;

    // Check if this is a 503 overloaded error
    if (errorMessage.includes('503') && errorMessage.includes('overloaded')) {
        const alternatives = window.apiManager.getAlternativeModels();

        if (alternatives.length > 0) {
            // Show a toast with alternative suggestions
            const firstAlt = alternatives[0];
            toast.show(
                `🔄 Model overloaded! Consider switching to ${window.apiManager.formatModelName(firstAlt.model)} for better reliability.`,
                'warning',
                8000
            );

            // Optionally auto-switch to the first alternative after a delay
            setTimeout(() => {
                if (confirm(`Would you like to automatically switch to ${window.apiManager.formatModelName(firstAlt.model)} to avoid overload issues?`)) {
                    switchToAlternativeModel(firstAlt);
                }
            }, 2000);

            return true;
        }
    }

    return false;
}

// Function to switch to an alternative model
function switchToAlternativeModel(alternative) {
    if (!window.apiManager) return;

    try {
        // Update API provider if different
        if (alternative.provider !== chatState.apiProvider) {
            chatState.apiProvider = alternative.provider;
            chatState.settings.general.apiProvider = alternative.provider;
            window.apiManager.setProvider(alternative.provider);
        }

        // Update model
        chatState.selectedModel = alternative.model;
        window.apiManager.setModel(alternative.model);

        // Update UI
        updateMainModelSelect();

        // Save state
        chatState.saveState();
        chatState.saveSettings();

        // Show success message
        toast.show(
            `✅ Switched to ${window.apiManager.formatModelName(alternative.model)}`,
            'success',
            3000
        );

    } catch (error) {
        console.error('Error switching model:', error);
        toast.show('❌ Failed to switch model', 'error', 3000);
    }
}


// Function to update model selection visibility based on API provider (legacy function - keeping for compatibility)
function updateModelSelectionVisibility() {
    updateMainModelSelect();
}

// Utility Functions for Settings
async function clearAllConversations() {
    const confirmed = await modal.confirm(
        'Clear All Conversations',
        'Are you sure you want to delete all conversations? This action cannot be undone.'
    );

    if (confirmed) {
        if (chatState.useSupabaseStorage && window.supabaseDB) {
            // Delete all conversations from Supabase
            const conversationIds = chatState.conversations.map(c => c.id);
            for (const id of conversationIds) {
                await chatState.deleteConversation(id);
            }
        }
        // Clear local state
        chatState.conversations = [];
        chatState.currentConversationId = null;
        chatState.currentMessages = [];
        chatState.saveState();

        updateConversationsList();
        chatManager.renderMessages();
        elements.chatTitle.textContent = 'New Chat';
        updateChatStatistics();

        toast.show('All conversations cleared', 'success');
    }
}

async function exportAllChats() {
    if (chatState.conversations.length === 0) {
        toast.show('No conversations to export', 'warning');
        return;
    }

    let content = 'SATI ChatBot - All Conversations Export\n';
    content += '='.repeat(60) + '\n\n';

    let conversationsToExport = chatState.conversations;
    let allMessagesMap = {};

    if (chatState.useSupabaseStorage && window.supabaseDB) {
        const fetchPromises = conversationsToExport.map(async (conversation) => {
            const { data: messages, error } = await window.supabaseDB.getConversationMessages(conversation.id);
            if (!error && messages) {
                allMessagesMap[conversation.id] = messages.map(msg => ({
                    role: msg.role,
                    content: msg.content,
                    timestamp: msg.created_at
                }));
            } else {
                allMessagesMap[conversation.id] = [];
            }
        });
        await Promise.all(fetchPromises);
    }

    conversationsToExport.forEach((conversation, index) => {
        content += `Conversation ${index + 1}: ${conversation.title}\n`;
        content += `Created: ${new Date(conversation.createdAt).toLocaleString()}\n`;
        content += '-'.repeat(40) + '\n\n';

        let messages = conversation.messages;
        if (chatState.useSupabaseStorage && window.supabaseDB) {
            messages = allMessagesMap[conversation.id] || [];
        }

        messages.forEach(message => {
            const role = message.role === 'user' ? 'You' : 'SATI Bot';
            const time = utils.formatTime(message.timestamp);
            content += `[${time}] ${role}: ${message.content}\n\n`;
        });

        content += '\n' + '='.repeat(60) + '\n\n';
    });

    const filename = `sati_all_chats_${new Date().toISOString().split('T')[0]}.txt`;

    // ✅ Check for Android interface
    if (typeof AndroidBridge !== "undefined" && AndroidBridge.saveTextFile) {
        try {
            AndroidBridge.saveTextFile(content, filename);
            toast.show('All chats exported to internal storage', 'success');
        } catch (e) {
            console.error('AndroidBridge error:', e);
            toast.show('Failed to save file via AndroidBridge', 'error');
        }
    } else {
        // ✅ Fallback for browser
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.show('All chats exported successfully', 'success');
    }
}


// Removed toggleSavedChatsSection - using modal instead

function initializeEventListeners() {
    // Sidebar toggle
    if (elements.sidebarToggle) {
        elements.sidebarToggle.addEventListener('click', toggleSidebar);
    }

    // Logo click to redirect to home
    if (elements.logoContainer) {
        elements.logoContainer.addEventListener('click', () => {
            // If we're already on the home page (index.html), just reload
            if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || window.location.pathname === '') {
                window.location.reload();
            } else {
                // Redirect to home page
                window.location.href = 'index.html';
            }
        });
        // Add cursor pointer style to indicate it's clickable
        elements.logoContainer.style.cursor = 'pointer';
    }

    // App name click to redirect to home (alternative way to click logo)
    if (elements.appName) {
        elements.appName.addEventListener('click', () => {
            // If we're already on the home page (index.html), just reload
            if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || window.location.pathname === '') {
                window.location.reload();
            } else {
                // Redirect to home page
                window.location.href = 'index.html';
            }
        });
        // Add cursor pointer style to indicate it's clickable
        elements.appName.style.cursor = 'pointer';
    }

    // Logo click to redirect to home
    if (elements.logoContainer) {
        elements.logoContainer.addEventListener('click', () => {
            // If we're already on the home page (index.html), just reload
            if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || window.location.pathname === '') {
                window.location.reload();
            } else {
                // Redirect to home page
                window.location.href = 'index.html';
            }
        });
        // Add cursor pointer style to indicate it's clickable
        elements.logoContainer.style.cursor = 'pointer';
    }

    // App name click to redirect to home (alternative way to click logo)
    if (elements.appName) {
        elements.appName.addEventListener('click', () => {
            // If we're already on the home page (index.html), just reload
            if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || window.location.pathname === '') {
                window.location.reload();
            } else {
                // Redirect to home page
                window.location.href = 'index.html';
            }
        });
        // Add cursor pointer style to indicate it's clickable
        elements.appName.style.cursor = 'pointer';
    }

    // Saved chats button - use modal instead
    if (elements.savedChatsBtn) {
        elements.savedChatsBtn.addEventListener('click', showSavedChatsModal);
    }

    // Sidebar hover functionality for desktop
    if (elements.sidebar) {
        elements.sidebar.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768 && elements.sidebar.classList.contains('collapsed')) {
                elements.sidebar.style.transform = 'translateX(0)';
                elements.sidebar.style.boxShadow = 'var(--shadow-xl)';
            }
        });

        elements.sidebar.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768 && elements.sidebar.classList.contains('collapsed')) {
                elements.sidebar.style.transform = 'translateX(-260px)';
                elements.sidebar.style.boxShadow = '';
            }
        });
    }

    // New chat button
    if (elements.newChatBtn) {
        elements.newChatBtn.addEventListener('click', async () => {
            await chatState.createNewConversation();
            if (elements.chatTitle) {
                elements.chatTitle.textContent = 'New Chat';
            }
            chatManager.renderMessages();
            updateConversationsList();

            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                toggleSidebar();
            }
        });
    }

    // Resources button
    if (elements.resourcesBtn) {
        elements.resourcesBtn.addEventListener('click', () => {
            // Redirect to resources page
            window.location.href = 'resources/materials.html';

            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                toggleSidebar();
            }
        });
    }

    // Search conversations
    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const conversations = document.querySelectorAll('.conversation-item');

            conversations.forEach(item => {
                const titleElement = item.querySelector('.conversation-title');
                if (titleElement) {
                    const title = titleElement.textContent.toLowerCase();
                    item.style.display = title.includes(query) ? 'flex' : 'none';
                }
            });
        });
    }

    // Message input
    if (elements.messageInput) {
        elements.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Auto-resize textarea
        elements.messageInput.addEventListener('input', () => {
            elements.messageInput.style.height = 'auto';
            elements.messageInput.style.height = elements.messageInput.scrollHeight + 'px';
        });
    }

    // Send button
    if (elements.sendBtn) {
        elements.sendBtn.addEventListener('click', sendMessage);
    }

    // Microphone button
    if (elements.micBtn) {
        elements.micBtn.addEventListener('click', () => {
            if (window.voiceRecognition) {
                window.voiceRecognition.startListening();
            }
        });
    }

    // Voice Mode buttons (both desktop and mobile)
    const handleVoiceModeClick = () => {
        console.log('🎤 Voice Mode button clicked');
        console.log('🎤 window.voiceMode available:', !!window.voiceMode);
        
    if (window.voiceMode) {
            console.log('🎤 Current voice mode state:', window.voiceMode.isActive);
                if (window.voiceMode.isActive) {
                console.log('🎤 Deactivating voice mode');
            window.voiceMode.deactivate();
            } else {
            console.log('🎤 Activating voice mode');
                    window.voiceMode.activate();
            }
        } else {
                console.error('🎤 Voice Mode not initialized');
        }
    };

    // Desktop voice mode button
    if (elements.voiceModeBtnDesktop) {
        elements.voiceModeBtnDesktop.addEventListener('click', handleVoiceModeClick);
    }

    // Mobile voice mode button
    if (elements.voiceModeBtnMobile) {
        elements.voiceModeBtnMobile.addEventListener('click', handleVoiceModeClick);
    }

    // Legacy support (if old button still exists)
    if (elements.voiceModeBtn) {
        elements.voiceModeBtn.addEventListener('click', handleVoiceModeClick);
    }

    // Stop button
    if (elements.stopBtn) {
        elements.stopBtn.addEventListener('click', () => {
            chatManager.stopGeneration();
        });
    }

    // Copy button event delegation
    if (elements.chatMessages) {
        elements.chatMessages.addEventListener('click', (e) => {
            if (e.target.closest('.copy-btn')) {
                const copyBtn = e.target.closest('.copy-btn');
                const messageId = copyBtn.getAttribute('data-message-id');
                if (messageId) {
                    chatManager.copyMessage(messageId);
                }
            }
        });
    }

    // Model selection
    if (elements.modelSelect) {
        elements.modelSelect.addEventListener('change', (e) => {
            // Check if user tried to select disabled Gemini 1.5 Pro
            if (e.target.value === 'gemini-1.5-pro' &&
                chatState.apiProvider === 'gemini') {
                // Show coming soon message
                toast.show('🚀 Gemini 1.5 Pro model will add soon', 'info', 4000);

                // Reset to previous valid selection
                const availableModels = window.apiManager ? window.apiManager.getAvailableModels() : [];
                const fallbackModel = availableModels.find(model =>
                    model !== 'gemini-1.5-pro'
                ) || availableModels[0] || chatState.selectedModel;

                if (fallbackModel && fallbackModel !== 'gemini-1.5-pro') {
                    e.target.value = fallbackModel;
                    chatState.selectedModel = fallbackModel;
                    if (window.apiManager) {
                        window.apiManager.setModel(fallbackModel);
                    }
                }
                chatState.saveState();
                return;
            }

            chatState.selectedModel = e.target.value;
            if (window.apiManager) {
                window.apiManager.setModel(e.target.value);
                toast.show(`Switched to ${window.apiManager.formatModelName(e.target.value)}`, 'success');

                // Sync with settings model select
                const aiModelSetting = document.getElementById('aiModelSetting');
                if (aiModelSetting) {
                    aiModelSetting.value = e.target.value;
                }
            }
            chatState.saveState();
        });
    }

    // Profile menu
    if (elements.profileAvatar && elements.profileDropdown) {
        elements.profileAvatar.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.profileDropdown.classList.toggle('show');
        });
    }

    // Close profile dropdown when clicking outside
    document.addEventListener('click', () => {
        if (elements.profileDropdown) {
            elements.profileDropdown.classList.remove('show');
        }
    });

    // Profile dropdown items
    const myProfileBtn = document.getElementById('myProfileBtn');
    if (myProfileBtn) {
        myProfileBtn.addEventListener('click', () => {
            showProfileModal();
            if (elements.profileDropdown) {
                elements.profileDropdown.classList.remove('show');
            }
        });
    }

    const settingsDropdownBtn = document.getElementById('settingsDropdownBtn');
    if (settingsDropdownBtn) {
        settingsDropdownBtn.addEventListener('click', () => {
            modal.show('settingsModal');
            // Get the currently active tab or default to 'general'
            const activeTab = getActiveSettingsTab() || 'general';
            renderSettingsContent(activeTab);
            if (elements.profileDropdown) {
                elements.profileDropdown.classList.remove('show');
            }
        });
    }





    // Theme menu functionality
    const themeOptions = document.querySelectorAll('.theme-option');
    const themeSubmenu = document.getElementById('themeSubmenu');
    const themeMenuBtn = document.getElementById('themeMenuBtn');

    if (themeOptions.length > 0) {
        themeOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const selectedTheme = option.getAttribute('data-theme');
                const oldTheme = chatState.theme;

                chatState.theme = selectedTheme;
                chatState.applyTheme();
                chatState.saveState();
                updateThemeMenuSelection();

                // Show toast message immediately
                showThemeChangeToast(selectedTheme, oldTheme);

                // Close theme submenu on mobile
                if (themeSubmenu) {
                    themeSubmenu.classList.remove('show-mobile');
                }

                // Close profile dropdown
                if (elements.profileDropdown) {
                    elements.profileDropdown.classList.remove('show');
                }
            });
        });
    }

    // Mobile theme menu toggle functionality
    if (themeMenuBtn && themeSubmenu) {
        themeMenuBtn.addEventListener('click', (e) => {
            // Only handle click on mobile devices
            if (window.innerWidth <= 768) {
                e.stopPropagation();
                themeSubmenu.classList.toggle('show-mobile');
            }
        });
    }

    // Prevent theme submenu from closing profile dropdown
    if (themeSubmenu) {
        themeSubmenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Close theme submenu when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && themeSubmenu) {
            if (!themeMenuBtn.contains(e.target) && !themeSubmenu.contains(e.target)) {
                themeSubmenu.classList.remove('show-mobile');
            }
        }
    });


    const loginLogoutBtn = document.getElementById('loginLogoutBtn');
    if (loginLogoutBtn) {
        loginLogoutBtn.addEventListener('click', () => {
            if (chatState.isLoggedIn) {
                logout();
            } else {
                modal.show('loginModal');
                setTimeout(addLoginModalEventListeners, 0); // Ensure DOM is updated before attaching listeners
            }
            if (elements.profileDropdown) {
                elements.profileDropdown.classList.remove('show');
            }
        });
    }



    // Share button
    if (elements.shareBtn) {
        elements.shareBtn.addEventListener('click', () => {
            if (navigator.share && chatState.currentMessages.length > 0) {
                navigator.share({
                    title: 'SATI ChatBot Conversation',
                    text: 'Check out this conversation with SATI ChatBot',
                    url: window.location.href
                });
            } else {
                chatManager.exportChat();
            }
        });
    }

    // Sidebar menu items
    const savedChatsBtn = document.getElementById('savedChatsBtn');
    if (savedChatsBtn) {
        savedChatsBtn.addEventListener('click', () => {
            showSavedChatsModal();
        });
    }



    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            modal.show('settingsModal');
            // Get the currently active tab or default to 'general'
            const activeTab = getActiveSettingsTab() || 'general';
            renderSettingsContent(activeTab);
        });
    }



    const clearAllBtn = document.getElementById('clearAllBtn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', clearAllConversations);
    }

    // Modal close buttons
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', () => {
            modal.hide('settingsModal');
        });
    }



    const closeLoginBtn = document.getElementById('closeLoginBtn');
    if (closeLoginBtn) {
        closeLoginBtn.addEventListener('click', () => {
            modal.hide('loginModal');
        });
    }

    // Rename modal event listeners
    const closeRenameBtn = document.getElementById('closeRenameBtn');
    if (closeRenameBtn) {
        closeRenameBtn.addEventListener('click', () => {
            modal.hide('renameModal');
        });
    }

    const renameCancelBtn = document.getElementById('renameCancelBtn');
    if (renameCancelBtn) {
        renameCancelBtn.addEventListener('click', () => {
            modal.hide('renameModal');
        });
    }

    const renameForm = document.getElementById('renameForm');
    if (renameForm) {
        renameForm.addEventListener('submit', handleRenameSubmit);
    }

    // Settings tabs - Use event delegation for dynamically created content
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('settings-tab') || e.target.closest('.settings-tab')) {
            const tab = e.target.classList.contains('settings-tab') ? e.target : e.target.closest('.settings-tab');

            document.querySelectorAll('.settings-tab').forEach(t => {
                t.classList.remove('active');
            });
            tab.classList.add('active');

            // Store the active tab
            setActiveSettingsTab(tab.dataset.tab);
            renderSettingsContent(tab.dataset.tab);
        }
    });

    // Login form and signup button listeners are now handled by addLoginModalEventListeners()
    // This ensures they work properly when modal is opened from different places
    addLoginModalEventListeners();



    // Monkey Eye Tracking Functionality
    function initializeMonkeyEyeTracking() {
        const monkeyAvatar = document.getElementById('monkeyAvatar');
        const loginModal = document.getElementById('loginModal');

        if (!monkeyAvatar || !loginModal) return;

        let isTracking = false;

        function startEyeTracking() {
            if (isTracking) return;
            isTracking = true;
            monkeyAvatar.classList.add('tracking');

            function updateEyePosition(e) {
                if (!loginModal.classList.contains('show')) {
                    stopEyeTracking();
                    return;
                }

                const rect = monkeyAvatar.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const mouseX = e.clientX;
                const mouseY = e.clientY;

                // Calculate angle from center to mouse
                const deltaX = mouseX - centerX;
                const deltaY = mouseY - centerY;

                // Limit eye movement range
                const maxDistance = 2; // Maximum pixel movement for eyes
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const limitedDistance = Math.min(distance, 100); // Limit how far eyes can look

                const normalizedX = (deltaX / distance) *n(limitedDistance / 100, 1) * maxDistance;
                const normalizedY = (deltaY / distance) * Math.min(limitedDistance / 100, 1) * maxDistance;

                // Apply eye movement
                const leftEye = monkeyAvatar.querySelector('.monkey-eye-l');
                const rightEye = monkeyAvatar.querySelector('.monkey-eye-r');

                if (leftEye && rightEye) {
                    leftEye.style.transform = `translate(${normalizedX}px, ${normalizedY}px)`;
                    rightEye.style.transform = `translate(${normalizedX}px, ${normalizedY}px)`;
                }
            }

            document.addEventListener('mousemove', updateEyePosition);

            // Store the function reference for cleanup
            monkeyAvatar._eyeTrackingHandler = updateEyePosition;
        }

        function stopEyeTracking() {
            if (!isTracking) return;
            isTracking = false;
            monkeyAvatar.classList.remove('tracking');

            // Reset eye positions
            const leftEye = monkeyAvatar.querySelector('.monkey-eye-l');
            const rightEye = monkeyAvatar.querySelector('.monkey-eye-r');

            if (leftEye && rightEye) {
                leftEye.style.transform = '';
                rightEye.style.transform = '';
            }

            if (monkeyAvatar._eyeTrackingHandler) {
                document.removeEventListener('mousemove', monkeyAvatar._eyeTrackingHandler);
                delete monkeyAvatar._eyeTrackingHandler;
            }
        }

        // Start tracking when modal is shown
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (loginModal.classList.contains('show')) {
                        setTimeout(startEyeTracking, 100); // Small delay to ensure modal is fully rendered
                    } else {
                        stopEyeTracking();
                    }
                }
            });
        });

        observer.observe(loginModal, { attributes: true });

        // Also check if modal is already shown
        if (loginModal.classList.contains('show')) {
            startEyeTracking();
        }
    }

    // Initialize monkey eye tracking
    initializeMonkeyEyeTracking();

    // Password visibility toggle functionality
    function initializePasswordToggle() {
        const blindCheck = document.getElementById('blind-input');
        const passwordInput = document.getElementById('password');
        const toggleBtn = document.getElementById('passwordToggleBtn');

        if (!blindCheck || !passwordInput || !toggleBtn) return;

        // Set initial title
        toggleBtn.title = 'Show password';

        blindCheck.addEventListener('change', function () {
            if (this.checked) {
                passwordInput.type = 'text';
                toggleBtn.title = 'Hide password';
            } else {
                passwordInput.type = 'password';
                toggleBtn.title = 'Show password';
            }
        });
    }

    // Initialize password toggle
    initializePasswordToggle();

    // Close modals when clicking overlay
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    });

    // Profile modal event listeners
    const closeProfileBtn = document.getElementById('closeProfileBtn');
    if (closeProfileBtn) {
        closeProfileBtn.addEventListener('click', () => {
            modal.hide('profileModal');
        });
    }

    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            toast.show('Profile editing coming soon', 'info');
        });
    }

    // Welcome modal event listeners
    const closeWelcomeBtn = document.getElementById('closeWelcomeBtn');
    if (closeWelcomeBtn) {
        closeWelcomeBtn.addEventListener('click', () => {
            modal.hide('welcomeModal');
        });
    }

    const startChattingBtn = document.getElementById('startChattingBtn');
    if (startChattingBtn) {
        startChattingBtn.addEventListener('click', () => {
            modal.hide('welcomeModal');
            // Focus on chat input
            if (elements.messageInput) {
                elements.messageInput.focus();
            }
        });
    }

    // Voice Mode modal event listeners
    const voiceModeClose = document.getElementById('voiceModeClose');
    if (voiceModeClose) {
        voiceModeClose.addEventListener('click', () => {
            if (window.voiceMode) {
                window.voiceMode.deactivate();
            }
        });
    }

    const voiceModeEndBtn = document.getElementById('voiceModeEndBtn');
    if (voiceModeEndBtn) {
        voiceModeEndBtn.addEventListener('click', () => {
            if (window.voiceMode) {
                window.voiceMode.deactivate();
            }
        });
    }

    const voiceMuteMicBtn = document.getElementById('voiceMuteMicBtn');
    if (voiceMuteMicBtn) {
        voiceMuteMicBtn.addEventListener('click', () => {
            if (window.voiceMode) {
                window.voiceMode.toggleMute();
            }
        });
    }

    // Close voice mode modal when clicking outside
    const voiceModeModal = document.getElementById('voiceModeModal');
    if (voiceModeModal) {
        voiceModeModal.addEventListener('click', (e) => {
            if (e.target === voiceModeModal && window.voiceMode) {
                window.voiceMode.deactivate();
            }
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {

        // Ctrl/Cmd + K to focus conversation search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            elements.searchInput.focus();
        }

        // Ctrl + Shift + O for Open New Chat
        if (e.ctrlKey && e.shiftKey && e.key === 'O') {
            e.preventDefault();
            elements.newChatBtn.click();
        }

        // Ctrl + Shift + S for Toggle Sidebar
        if (e.ctrlKey && e.shiftKey && e.key === 'S') {
            e.preventDefault();
            const sidebarToggle = document.getElementById('sidebarToggle');
            if (sidebarToggle) {
                sidebarToggle.click();
            }
        }

        // Ctrl + Shift + Backspace for Delete Chat
        if (e.ctrlKey && e.shiftKey && (e.key === 'Backspace' || e.keyCode === 8)) {
            e.preventDefault();
            console.log('🔥 Delete chat shortcut triggered');
            const currentConversationId = getCurrentConversationId();
            console.log('📝 Current conversation ID:', currentConversationId);
            if (currentConversationId) {
                deleteConversation(currentConversationId);
            } else {
                console.log('⚠️ No active conversation to delete');
                toast.show('No active conversation to delete', 'warning');
            }
        }

        // Ctrl + / for Show Shortcuts
        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            showKeyboardShortcuts();
        }

        // Ctrl + Shift + V for Voice Input
        if (e.ctrlKey && e.shiftKey && e.key === 'V') {
            e.preventDefault();
            if (window.voiceRecognition && !window.voiceRecognition.isListening) {
                window.voiceRecognition.startListening();
            }
        }
        // Ctrl + Shift + B for Voice Mode
        if (e.ctrlKey && e.shiftKey && e.key === 'B') {
            e.preventDefault();
            if (window.voiceMode) {
                if (window.voiceMode.isActive) {
                    window.voiceMode.deactivate();
                } else {
                    window.voiceMode.activate();
                }
            }
        }

        // Ctrl + Shift + A for Attach File
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            const attachmentBtn = document.getElementById('attachmentBtn');
            if (attachmentBtn) {
                attachmentBtn.click();
            }
        }

        // Ctrl + Shift + M for AI Model Selection
        if (e.ctrlKey && e.shiftKey && e.key === 'M') {
            e.preventDefault();
            const modelSelect = document.getElementById('modelSelect');
            if (modelSelect) {
                modelSelect.focus();
                // Optionally open the dropdown
                if (modelSelect.showPicker) {
                    modelSelect.showPicker();
                }
            }
        }

        // Escape to close modals
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.show').forEach(modal => {
                modal.classList.remove('show');
                document.body.style.overflow = '';
            });
            elements.profileDropdown.classList.remove('show');
        }
    });

    // Voice input functionality is now handled in initializeEventListeners()

    // Attachment button (placeholder)
    const attachmentBtn = document.getElementById('attachmentBtn');

    // Initialize mobile click outside behavior if sidebar is open on mobile
    if (window.innerWidth <= 768 && elements.sidebar && elements.sidebar.classList.contains('show')) {
        setupMobileClickOutside();
    }

    async function signInWithGoogle() {
        try {
            console.log('🔄 Google sign-in clicked');
            console.log('Supabase client status:', !!supabase);

            // Try to initialize Supabase if not already done
            if (!supabase) {
                console.log('🔄 Supabase not initialized, attempting to force initialize...');
                const initialized = window.forceInitializeSupabase ? window.forceInitializeSupabase() : initializeSupabase();
                if (!initialized) {
                    console.error('❌ Failed to initialize Supabase for Google login');
                    return toast.show('Authentication service not available. Please refresh the page.', 'error');
                }
            }

            if (!supabase) {
                console.error('❌ Supabase client still not initialized after retry');
                return toast.show('Supabase not initialized', 'error');
            }

            console.log('✅ Supabase client available, attempting Google SSO login...');

            // Set flag to indicate this is a fresh login attempt
            localStorage.setItem('sati_fresh_login', '1');

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/'
                }
            });

            if (error) {
                console.error('❌ Google login error:', error);

                // Check for the specific provider not enabled error
                if (error.message && error.message.includes('provider is not enabled')) {
                    toast.show('Google login is not enabled in Supabase project settings. Please contact the administrator.', 'error', 8000);

                    // Show a more detailed message in the console for developers
                    console.warn('CONFIGURATION REQUIRED: Google OAuth provider needs to be enabled in Supabase dashboard.');
                    console.warn('Go to: Supabase Dashboard > Authentication > Providers > Google > Enable');
                } else {
                    toast.show('Google login failed: ' + error.message, 'error');
                }
            } else {
                console.log('✅ Google SSO initiated:', data);
                toast.show('Redirecting to Google...', 'info');
            }
        } catch (err) {
            console.error('❌ Google SSO exception:', err);
            toast.show('Google login error: ' + err.message, 'error');
        }
    }

    async function signInWithGithub() {
        try {
            console.log('🔄 GitHub sign-in clicked');
            console.log('Supabase client status:', !!supabase);

            // Try to initialize Supabase if not already done
            if (!supabase) {
                console.log('🔄 Supabase not initialized, attempting to force initialize...');
                const initialized = window.forceInitializeSupabase ? window.forceInitializeSupabase() : initializeSupabase();
                if (!initialized) {
                    console.error('❌ Failed to initialize Supabase for GitHub login');
                    return toast.show('Authentication service not available. Please refresh the page.', 'error');
                }
            }

            if (!supabase) {
                console.error('❌ Supabase client still not initialized after retry');
                return toast.show('Supabase not initialized', 'error');
            }

            console.log('✅ Supabase client available, attempting GitHub SSO login...');

            // Set flag to indicate this is a fresh login attempt
            localStorage.setItem('sati_fresh_login', '1');

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: window.location.origin + '/'
                }
            });

            if (error) {
                console.error('❌ GitHub login error:', error);
                console.log('Error details:', {
                    message: error.message,
                    status: error.status,
                    statusCode: error.statusCode,
                    details: error
                });

                // Check for the specific provider not enabled error
                if (error.message && error.message.includes('provider is not enabled')) {
                    toast.show('GitHub login is not enabled in Supabase project settings. Please contact the administrator.', 'error', 8000);

                    // Show a more detailed message in the console for developers
                    console.warn('CONFIGURATION REQUIRED: GitHub OAuth provider needs to be enabled in Supabase dashboard.');
                    console.warn('Go to: Supabase Dashboard > Authentication > Providers > GitHub > Enable');
                    console.warn('Required steps:');
                    console.warn('1. Go to Supabase Dashboard');
                    console.warn('2. Navigate to Authentication > Providers');
                    console.warn('3. Find GitHub provider and click Enable');
                    console.warn('4. Add your GitHub OAuth App credentials');
                    console.warn('5. Set redirect URL to: ' + window.location.origin + '/');
                } else if (error.message && error.message.includes('redirect')) {
                    toast.show('GitHub login redirect error. Please check configuration.', 'error');
                    console.warn('REDIRECT ERROR: Check if redirect URL is properly configured in both Supabase and GitHub OAuth app');
                } else {
                    toast.show('GitHub login failed: ' + error.message, 'error');
                }
            } else {
                console.log('✅ GitHub SSO initiated:', data);
                toast.show('Redirecting to GitHub...', 'info');
            }
        } catch (err) {
            console.error('❌ GitHub SSO exception:', err);
            toast.show('GitHub login error: ' + err.message, 'error');
        }
    }

    function addSSOEventListeners() {
        const googleBtn = document.getElementById('googleSSOBtn');
        const githubBtn = document.getElementById('githubSSOBtn');

        // Add tooltips to explain SSO configuration if needed
        if (googleBtn) {
            googleBtn.title = "Sign in with Google";
            if (!googleBtn.hasListener) {
                googleBtn.addEventListener('click', signInWithGoogle);
                googleBtn.hasListener = true;
            }
        }

        if (githubBtn) {
            githubBtn.title = "Sign in with GitHub";
            if (!githubBtn.hasListener) {
                githubBtn.addEventListener('click', signInWithGithub);
                githubBtn.hasListener = true;
            }
        }

        // Check if we should show a message about SSO configuration
        checkSSOConfiguration();
    }

    // Function to ensure all login modal event listeners are attached
    function addLoginModalEventListeners() {
        // Add SSO listeners
        addSSOEventListeners();

        // Add login form listener
        const loginForm = document.getElementById('loginForm');
        if (loginForm && !loginForm.hasLoginListener) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                login();
            });
            loginForm.hasLoginListener = true;
        }

        // Add signup button listener
        const signupBtn = document.getElementById('signupBtn');
        if (signupBtn && !signupBtn.hasSignupListener) {
            signupBtn.addEventListener('click', () => {
                signup();
            });
            signupBtn.hasSignupListener = true;
        }
    }

    // Check if SSO providers are properly configured
    async function checkSSOConfiguration() {
        if (!supabase) return;

        try {
            // Try to get the list of enabled auth providers
            const { data, error } = await supabase.auth.getSession();

            // If we can't get the session, we'll assume SSO might not be configured
            if (error) {
                console.warn('Could not verify SSO configuration:', error);

                // Add a note to the login form about possible SSO configuration issues
                const ssoSection = document.querySelector('.sso-buttons');
                if (ssoSection) {
                    const noteElement = document.createElement('div');
                    noteElement.className = 'sso-note';
                    noteElement.innerHTML = '<small>Note: SSO login requires additional configuration. Email/password login is always available.</small>';
                    ssoSection.after(noteElement);
                }
            }
        } catch (err) {
            console.error('Error checking SSO configuration:', err);
        }
    }

    // Listen for Supabase auth state changes to show login success toast
    document.addEventListener('DOMContentLoaded', listenForAuthChanges);
}

// Core Functions
function toggleSidebar() {
    const sidebar = elements.sidebar;
    const appContainer = document.getElementById('appContainer');
    const sidebarToggle = elements.sidebarToggle;

    if (window.innerWidth <= 768) {
        // Mobile behavior
        sidebar.classList.toggle('show');
        appContainer.classList.toggle('sidebar-open');

        // Handle toggle button translation on mobile
        handleMobileToggleTranslation();

        // Setup click outside behavior for mobile
        if (sidebar.classList.contains('show')) {
            setupMobileClickOutside();
        } else {
            cleanupMobileClickOutside();
        }
    } else {
        // Desktop behavior
        sidebar.classList.toggle('collapsed');
        appContainer.classList.toggle('sidebar-collapsed');

        // Handle hover trigger for desktop
        if (sidebar.classList.contains('collapsed')) {
            createHoverTrigger();
        } else {
            // Reset any hover transforms
            sidebar.style.transform = '';
            sidebar.style.boxShadow = '';
            // Reset toggle button position
            sidebarToggle.style.left = '';
            sidebarToggle.style.transition = '';
            removeHoverTrigger();
        }
    }
}

// Create hover trigger element for desktop sidebar
function createHoverTrigger() {
    // Use existing hover trigger element from HTML
    const hoverTrigger = document.getElementById('sidebarHoverTrigger');
    if (hoverTrigger) {
        // Add hover event listeners for toggle button movement
        setupToggleHoverBehavior();
    }
}

// Remove hover trigger element
function removeHoverTrigger() {
    // Clean up hover event listeners (don't remove the element since it's in HTML)
    cleanupToggleHoverBehavior();
}

// Setup toggle button hover behavior for desktop
function setupToggleHoverBehavior() {
    if (window.innerWidth <= 768) return; // Only for desktop

    const sidebar = elements.sidebar;
    const sidebarToggle = elements.sidebarToggle;
    const hoverTrigger = document.getElementById('sidebarHoverTrigger');

    if (!sidebar || !sidebarToggle || !hoverTrigger) return;

    // Function to move toggle button with sidebar
    const moveToggleWithSidebar = () => {
        if (sidebar.classList.contains('collapsed')) {
            sidebarToggle.style.left = '280px';
            sidebarToggle.style.transition = 'left var(--transition-normal)';
        }
    };

    // Function to reset toggle button position
    const resetTogglePosition = () => {
        if (sidebar.classList.contains('collapsed')) {
            sidebarToggle.style.left = '20px';
            sidebarToggle.style.transition = 'left var(--transition-normal)';
        }
    };

    // Add event listeners
    hoverTrigger.addEventListener('mouseenter', moveToggleWithSidebar);
    hoverTrigger.addEventListener('mouseleave', resetTogglePosition);
    sidebar.addEventListener('mouseenter', moveToggleWithSidebar);
    sidebar.addEventListener('mouseleave', resetTogglePosition);

    // Store references for cleanup
    hoverTrigger._moveToggleWithSidebar = moveToggleWithSidebar;
    hoverTrigger._resetTogglePosition = resetTogglePosition;
    sidebar._moveToggleWithSidebar = moveToggleWithSidebar;
    sidebar._resetTogglePosition = resetTogglePosition;
}

// Setup click outside to close sidebar for mobile
function setupMobileClickOutside() {
    if (window.innerWidth > 768) return; // Only for mobile

    const sidebar = elements.sidebar;
    const appContainer = document.getElementById('appContainer');
    const sidebarToggle = elements.sidebarToggle;

    // Function to handle clicks outside sidebar
    const handleClickOutside = (event) => {
        // Check if sidebar is open and click is outside sidebar and toggle button
        if (sidebar.classList.contains('show') &&
            !sidebar.contains(event.target) &&
            !sidebarToggle.contains(event.target)) {

            // Close sidebar
            sidebar.classList.remove('show');
            appContainer.classList.remove('sidebar-open');

            // Handle toggle button translation
            handleMobileToggleTranslation();

            // Clean up the click outside listener since sidebar is now closed
            cleanupMobileClickOutside();
        }
    };

    // Add event listener to document with a small delay to prevent immediate closing
    setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
        // Store reference for cleanup
        document._handleClickOutside = handleClickOutside;
    }, 100);
}

// Clean up mobile click outside behavior
function cleanupMobileClickOutside() {
    if (document._handleClickOutside) {
        document.removeEventListener('click', document._handleClickOutside);
        document._handleClickOutside = null;
    }
}

// Handle toggle button translation on mobile
function handleMobileToggleTranslation() {
    if (window.innerWidth > 768) return; // Only for mobile

    const sidebar = elements.sidebar;
    const sidebarToggle = elements.sidebarToggle;
    const appContainer = document.getElementById('appContainer');

    if (!sidebar || !sidebarToggle || !appContainer) return;

    // The CSS handles the translation, but we can add smooth transition
    // Reset any inline styles that might interfere
    sidebarToggle.style.left = '';
    sidebarToggle.style.transition = '';

    // Force a reflow to ensure smooth transition
    sidebarToggle.offsetHeight;
}

// Initialize Voice Mode when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    // Initialize Voice Mode
    if (typeof VoiceMode !== 'undefined') {
        window.voiceMode = new VoiceMode();
        console.log('✅ Voice Mode initialized');
    } else {
        console.error('❌ VoiceMode class not found');
    }
});


// Clean up toggle button hover behavior
function cleanupToggleHoverBehavior() {
    const sidebar = elements.sidebar;
    const hoverTrigger = document.getElementById('sidebarHoverTrigger');

    if (hoverTrigger) {
        if (hoverTrigger._moveToggleWithSidebar) {
            hoverTrigger.removeEventListener('mouseenter', hoverTrigger._moveToggleWithSidebar);
            hoverTrigger.removeEventListener('mouseleave', hoverTrigger._resetTogglePosition);
        }
    }

    if (sidebar) {
        if (sidebar._moveToggleWithSidebar) {
            sidebar.removeEventListener('mouseenter', sidebar._moveToggleWithSidebar);
            sidebar.removeEventListener('mouseleave', sidebar._resetTogglePosition);
        }
    }
}

async function sendMessage() {
    const content = elements.messageInput.value.trim();
    if (!content || chatManager.isProcessing) return;

    // Stop voice recognition if it's active
    if (window.voiceRecognition && window.voiceRecognition.isListening) {
        window.voiceRecognition.stopListening();
    }

    // Create new conversation if none exists
    if (!chatState.currentConversationId) {
        console.log('🔄 Creating new conversation before sending message...');
        await chatState.createNewConversation();
        updateConversationsList();
        console.log('✅ New conversation created:', chatState.currentConversationId);
    }

    // Clear input
    elements.messageInput.value = '';
    elements.messageInput.style.height = 'auto';

    // Send message
    await chatManager.sendMessage(content, chatState.selectedModel);
}

async function signup() {
    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Basic validation
        if (!email || !password) {
            return toast.show('Please enter both email and password', 'error');
        }

        if (password.length < 6) {
            return toast.show('Password must be at least 6 characters', 'error');
        }

        // Check if Supabase is available
        if (!supabase) {
            console.error('Supabase not initialized');
            return toast.show('Authentication service not available. Please try again later.', 'error');
        }

// Initialize Voice Mode when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    // Initialize Voice Mode
    if (typeof VoiceMode !== 'undefined') {
        window.voiceMode = new VoiceMode();
        console.log('✅ Voice Mode initialized');
    }
}); toast.show('Creating account...', 'info', 2000);

        // Try to sign up with Supabase with additional options
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                // Set data for the user
                data: {
                    username: email.split('@')[0],
                    full_name: email.split('@')[0]
                },
                // Make sure email confirmation is enabled
                emailRedirectTo: window.location.origin
            }
        });

        console.log('Signup response:', data);

        if (error) {
            console.error('Signup error:', error);
            toast.show('Signup failed: ' + error.message, 'error');
            return;
        }

        // Check if email confirmation is required
        if (data?.user?.identities?.length === 0) {
            toast.show('This email is already registered. Please login instead.', 'info', 5000);
            return;
        }

        // Check if email confirmation is required
        if (data?.user?.confirmed_at || data?.session) {
            // Auto-login if confirmation not required
            toast.show('Account created successfully! Logging you in...', 'success', 3000);

            // Set user state
            let authProvider = 'email';
            if (data.user.app_metadata && data.user.app_metadata.provider) {
                authProvider = data.user.app_metadata.provider;
            }
            chatState.isLoggedIn = true;
            let username4 = (data.user.user_metadata && data.user.user_metadata.username)
                ? data.user.user_metadata.username
                : (data.user.email ? data.user.email.split('@')[0] : data.user.id);
            chatState.username = username4;
            chatState.email = data.user.email;
            chatState.authProvider = authProvider;
            chatState.saveState();

            // Set flag for welcome toast/console
            localStorage.setItem('sati_show_welcome', '1');

            // Update login statistics
            updateLoginStats();

            // Hide login modal
            modal.hide('loginModal');

            // Update UI
            updateLoginStatus();

            // Show welcome modal
            setTimeout(() => {
                showWelcomeModal(chatState.username);
            }, 500);
        } else {
            // Show detailed confirmation instructions
            modal.hide('loginModal');

            // Create and show a custom confirmation modal
            const confirmationModal = document.createElement('div');
            confirmationModal.className = 'modal-overlay';
            confirmationModal.id = 'emailConfirmationModal';
            confirmationModal.innerHTML = `
                <div class="modal-container">
                    <div class="modal-header">
                        <h2>📧 Check Your Email</h2>
                        <button class="close-btn" onclick="modal.hide('emailConfirmationModal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div style="text-align: center; padding: 20px;">
                            <i class="fas fa-envelope-open-text" style="font-size: 48px; color: var(--accent-color); margin-bottom: 20px;"></i>
                            <h3>Confirmation Email Sent</h3>
                            <p>We've sent a confirmation link to: <strong>${email}</strong></p>
                            <p>Please check your inbox (and spam folder) and click the confirmation link to activate your account.</p>
                            <div style="margin-top: 20px;">
                                <button class="login-btn" onclick="window.open('https://mail.google.com', '_blank')">Open Gmail</button>
                                <button class="guest-btn" onclick="modal.hide('emailConfirmationModal')">I'll Check Later</button>
                            </div>
                            <p style="margin-top: 20px; font-size: 0.9em;">Didn't receive the email? Check your spam folder or <a href="#" onclick="resendConfirmationEmail('${email}')">click here to resend</a>.</p>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(confirmationModal);

            // Show the modal
            setTimeout(() => {
                modal.show('emailConfirmationModal');
            }, 500);
        }
    } catch (err) {
        console.error('Signup error:', err);
        toast.show('Signup error: ' + err.message, 'error');
    }
}

// Track login attempts using both sessionStorage (for current session) and localStorage (for persistence)
function getLoginAttempts(email) {
    try {
        // First check sessionStorage for current session data
        const sessionAttempts = sessionStorage.getItem('sati_login_attempts');
        if (sessionAttempts) {
            const attempts = JSON.parse(sessionAttempts);
            // If we have data for this email in the current session, return it
            if (attempts[email]) {
                return attempts[email];
            }
        }

        // If not in session, check localStorage for persistent data
        const storedAttempts = localStorage.getItem('sati_login_attempts');
        if (storedAttempts) {
            const attempts = JSON.parse(storedAttempts);
            // If we have data for this email, return it
            if (attempts[email]) {
                // Copy to session storage for faster access
                updateSessionAttempts(email, attempts[email]);
                return attempts[email];
            }
        }

        // Check if user has attempts stored in Supabase profile
        if (supabase && chatState.isLoggedIn) {
            // We'll implement this in the future to store attempts in user metadata
            // For now, we'll just use local storage
        }
    } catch (err) {
        console.error('Error reading login attempts:', err);
    }

    // Default values if no data exists
    return {
        count: 0,
        lastAttempt: 0,
        resetEmailSent: false
    };
}

// Update attempts in sessionStorage (for current session)
function updateSessionAttempts(email, data) {
    try {
        // Get all attempts from session
        const sessionAttempts = sessionStorage.getItem('sati_login_attempts') || '{}';
        const attempts = JSON.parse(sessionAttempts);

        // Update for this email
        attempts[email] = data;

        // Save back to sessionStorage
        sessionStorage.setItem('sati_login_attempts', JSON.stringify(attempts));
    } catch (err) {
        console.error('Error updating session login attempts:', err);
    }
}

// Update attempts in localStorage (for persistence)
function updateLoginAttempts(email, data) {
    try {
        // Update session storage first
        updateSessionAttempts(email, data);

        // Then update local storage for persistence
        const storedAttempts = localStorage.getItem('sati_login_attempts') || '{}';
        const attempts = JSON.parse(storedAttempts);

        // Update for this email
        attempts[email] = data;

        // Save back to localStorage
        localStorage.setItem('sati_login_attempts', JSON.stringify(attempts));

        // If user is logged in, we could also store this in Supabase user metadata
        // This would be implemented in the future
    } catch (err) {
        console.error('Error updating login attempts:', err);
    }
}

async function login() {
    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordInput = document.getElementById('password');

        // Basic validation
        if (!email || !password) {
            return toast.show('Please enter both email and password', 'error');
        }

        // Get stored login attempts for this email
        const attempts = getLoginAttempts(email);
        const now = Date.now();

        // We no longer show any warnings on initial form load
        // Errors will only be shown during actual login attempts

        // Reset lock if it has expired
        if (attempts.lockUntil > 0 && attempts.lockUntil < now) {
            attempts.lockUntil = 0;
            // Don't reset count - we still want to track total attempts
        }

        // Check if Supabase is available
        if (supabase) {
            // Try to use Supabase authentication
            try {
                toast.show('Logging in...', 'info', 2000);
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (error) {
                    console.error('Supabase login error:', error);

                    // Increment failed attempts
                    if (error.message.includes('Invalid login credentials')) {
                        attempts.count++;
                        attempts.lastAttempt = Date.now();

                        // Update the attempts in localStorage
                        updateLoginAttempts(email, attempts);

                        // Show appropriate message based on attempt count
                        if (attempts.count >= 3) {
                            // Add message below password field
                            addPasswordResetMessage(email, `${attempts.count} failed login attempts. Consider resetting your password.`);

                            toast.show(`Invalid password. ${attempts.count} failed login attempts.`, 'error', 4000,
                                [
                                    {
                                        text: 'Reset Password',
                                        onClick: () => showPasswordResetModal(email)
                                    }
                                ]);
                        }

                        // Show appropriate message based on attempt count
                        if (attempts.count === 1) {
                            toast.show('Invalid email or password. Please try again.', 'error', 4000);
                        } else {
                            toast.show(`Invalid password. ${attempts.count} failed login attempts.`, 'error', 4000,
                                [
                                    {
                                        text: 'Forgot Password?',
                                        onClick: () => showPasswordResetModal(email)
                                    }
                                ]);
                        }
                    } else if (error.message.includes('Email not confirmed')) {
                        toast.show('Please confirm your email address before logging in. Check your inbox for a confirmation link.', 'warning', 5000,
                            [
                                {
                                    text: 'Resend Email',
                                    onClick: () => resendConfirmationEmail(email)
                                }
                            ]);
                    } else {
                        toast.show('Login failed: ' + error.message, 'error');
                    }
                    return;
                }

                // Login successful - completely reset attempts for this email
                try {
                    console.log('Login successful, clearing attempts for:', email);

                    // Clear from session storage
                    const sessionAttempts = sessionStorage.getItem('sati_login_attempts') || '{}';
                    let sessionAttemptsObj = JSON.parse(sessionAttempts);
                    if (sessionAttemptsObj[email]) {
                        delete sessionAttemptsObj[email];
                        sessionStorage.setItem('sati_login_attempts', JSON.stringify(sessionAttemptsObj));
                    }

                    // Clear from local storage
                    const storedAttempts = localStorage.getItem('sati_login_attempts') || '{}';
                    let attemptsObj = JSON.parse(storedAttempts);
                    if (attemptsObj[email]) {
                        delete attemptsObj[email];
                        localStorage.setItem('sati_login_attempts', JSON.stringify(attemptsObj));
                    }
                } catch (err) {
                    console.error('Error clearing login attempts:', err);
                    // Fallback to simple removal
                    try {
                        localStorage.removeItem('sati_login_attempts');
                        sessionStorage.removeItem('sati_login_attempts');
                    } catch (e) {
                        console.error('Failed to remove login attempts:', e);
                    }
                }

                // Remove any password reset message
                removePasswordResetMessage();

                // Set flag to indicate this is a fresh login
                localStorage.setItem('sati_fresh_login', '1');

                // The auth state change listener will handle the rest of the login process
                console.log('Login successful, auth state change listener will handle the rest');

            } catch (err) {
                console.error('Supabase auth error:', err);
                // Fall back to simple login if Supabase auth fails
                fallbackLogin(email);
            }
        } else {
            // Fall back to simple login if Supabase is not available
            fallbackLogin(email);
        }
    } catch (err) {
        console.error('Login error:', err);
        toast.show('Login error: ' + err.message, 'error');
    }
}

// Function to check login form state when login modal is opened
function checkLoginFormState(email = '') {
    if (!email) {
        const emailInput = document.getElementById('email');
        if (emailInput && emailInput.value) {
            email = emailInput.value;
        }
    }

    if (!email) return; // No email to check

    // Remove any existing reset message
    removePasswordResetMessage();

}

// Function to add password reset message below password field
function addPasswordResetMessage(email, message) {
    // Remove any existing message first
    removePasswordResetMessage();

    // Get the password input's parent element (form-group)
    const passwordInput = document.getElementById('password');
    if (!passwordInput) return;

    const formGroup = passwordInput.closest('.form-group');
    if (!formGroup) return;

    // Create the message element
    const messageDiv = document.createElement('div');
    messageDiv.className = 'password-reset-message';
    messageDiv.innerHTML = `
        <span class="error-message">${message}</span>
        <a href="#" class="reset-password-link">Reset password</a>
    `;

    // Add the message after the form group
    formGroup.parentNode.insertBefore(messageDiv, formGroup.nextSibling);

    // Add click event to the reset link
    const resetLink = messageDiv.querySelector('.reset-password-link');
    if (resetLink) {
        resetLink.addEventListener('click', (e) => {
            e.preventDefault();
            showPasswordResetModal(email);
        });
    }
}

// Function to remove password reset message
function removePasswordResetMessage() {
    const existingMessage = document.querySelector('.password-reset-message');
    if (existingMessage) {
        existingMessage.parentNode.removeChild(existingMessage);
    }
}

// Debug functions to help troubleshoot login issues
function clearAllLoginAttempts() {
    try {
        sessionStorage.removeItem('sati_login_attempts');
        localStorage.removeItem('sati_login_attempts');
        console.log('All login attempts cleared');
        return true;
    } catch (err) {
        console.error('Error clearing login attempts:', err);
        return false;
    }
}

function showLoginAttempts() {
    try {
        const sessionAttempts = sessionStorage.getItem('sati_login_attempts') || '{}';
        const localAttempts = localStorage.getItem('sati_login_attempts') || '{}';
        console.log('Session storage login attempts:', JSON.parse(sessionAttempts));
        console.log('Local storage login attempts:', JSON.parse(localAttempts));
    } catch (err) {
        console.error('Error showing login attempts:', err);
    }
}

// Make the debug functions available globally
window.clearAllLoginAttempts = clearAllLoginAttempts;
window.showLoginAttempts = showLoginAttempts;

// Function to show password reset modal
function showPasswordResetModal(email) {
    // Create and show a custom reset password modal
    const resetModal = document.createElement('div');
    resetModal.className = 'modal-overlay';
    resetModal.id = 'passwordResetModal';
    resetModal.innerHTML = `
        <div class="modal-container">
            <div class="modal-header">
                <h2>🔑 Reset Your Password</h2>
                <button class="close-btn" onclick="modal.hide('passwordResetModal')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; padding: 20px;">
                    <i class="fas fa-key" style="font-size: 48px; color: var(--accent-color); margin-bottom: 20px;"></i>
                    <h3>Forgot Your Password?</h3>
                    <p>We'll send a password reset link to:</p>
                    <p><strong>${email}</strong></p>
                    <div style="margin-top: 20px;">
                        <button class="login-btn" onclick="sendResetAndClose('${email}')">Send Reset Link</button>
                        <button class="guest-btn" onclick="modal.hide('passwordResetModal')">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(resetModal);

    // Show the modal
    modal.show('passwordResetModal');
}

// Function to send reset email and close modal
async function sendResetAndClose(email) {
    const success = await sendPasswordResetEmail(email);
    if (success) {
        modal.hide('passwordResetModal');
        modal.hide('loginModal');
    }
}

// Make the function available globally
window.sendResetAndClose = sendResetAndClose;

// Simple fallback login when Supabase is not available
function fallbackLogin(email) {
    // Check if this is a fresh login or just a session restoration
    const isSessionRestoration = localStorage.getItem('sati_logged_in') === 'true' &&
        localStorage.getItem('sati_username') === email.split('@')[0];

    chatState.isLoggedIn = true;
    let username5 = (typeof email === 'string' && email.includes('@')) ? email.split('@')[0] : email;
    chatState.username = username5;
    chatState.email = email;
    chatState.authProvider = 'email';
    chatState.saveState();

    // Update login statistics
    updateLoginStats();

    // Hide login modal
    modal.hide('loginModal');

    // Update UI
    updateLoginStatus();

    // Only show welcome modal and toast for fresh logins, not session restorations
    if (!isSessionRestoration) {
        // Check if this is a fresh login triggered by user action
        if (localStorage.getItem('sati_fresh_login') === '1') {
            // Show welcome modal with a slight delay to ensure UI is ready
            setTimeout(() => {
                showWelcomeModal(chatState.username);
            }, 500);

            // Show success toast
            toast.show('Logged in as guest with username: ' + chatState.username, 'success');

            // Clear the fresh login flag
            localStorage.removeItem('sati_fresh_login');
        }
    }
}

// Update login statistics
function updateLoginStats() {
    // Only update last login time if this is a fresh login
    if (localStorage.getItem('sati_fresh_login') === '1') {
        localStorage.setItem('sati_last_login', new Date().toISOString());

        // Increment login count
        const currentCount = parseInt(localStorage.getItem('sati_login_count') || '0');
        localStorage.setItem('sati_login_count', (currentCount + 1).toString());
    }
}



// Function to resend confirmation email
async function resendConfirmationEmail(email) {
    if (!email) {
        toast.show('Email address is required', 'error');
        return;
    }

    if (!supabase) {
        toast.show('Authentication service not available', 'error');
        return;
    }

    try {
        toast.show('Resending confirmation email...', 'info');

        const { data, error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
            options: {
                emailRedirectTo: window.location.origin
            }
        });

        if (error) {
            console.error('Error resending confirmation:', error);
            toast.show('Failed to resend: ' + error.message, 'error');
            return;
        }

        toast.show('Confirmation email resent! Please check your inbox.', 'success', 5000);
    } catch (err) {
        console.error('Resend confirmation error:', err);
        toast.show('Error: ' + err.message, 'error');
    }
}

// Function to send password reset email
async function sendPasswordResetEmail(email) {
    if (!email) {
        toast.show('Email address is required', 'error');
        return false;
    }

    if (!supabase) {
        toast.show('Authentication service not available', 'error');
        return false;
    }

    try {
        toast.show('Sending password reset email...', 'info');

        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/?reset=true'
        });

        if (error) {
            console.error('Error sending password reset:', error);
            toast.show('Failed to send reset email: ' + error.message, 'error');
            return false;
        }

        // Mark that a reset email has been sent for this user
        try {
            const attempts = getLoginAttempts(email);
            attempts.resetEmailSent = true;
            updateLoginAttempts(email, attempts);
        } catch (err) {
            console.error('Error updating reset email status:', err);
        }

        toast.show('Password reset email sent! Please check your inbox.', 'success', 5000);
        return true;
    } catch (err) {
        console.error('Password reset error:', err);
        toast.show('Error: ' + err.message, 'error');
        return false;
    }
}

// Function to handle password reset process
async function handlePasswordReset(newPassword) {
    if (!supabase) {
        toast.show('Authentication service not available', 'error');
        return false;
    }

    if (!newPassword || newPassword.length < 6) {
        toast.show('Please enter a password with at least 6 characters', 'error');
        return false;
    }

    try {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            console.error('Error resetting password:', error);
            toast.show('Failed to reset password: ' + error.message, 'error');
            return false;
        }

        // Get user email from session
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user?.email) {
            const email = sessionData.session.user.email;

            // Reset login attempts for this email
            try {
                const storedAttempts = localStorage.getItem('sati_login_attempts') || '{}';
                const attempts = JSON.parse(storedAttempts);

                // Remove this email from attempts tracking
                if (attempts[email]) {
                    delete attempts[email];
                    localStorage.setItem('sati_login_attempts', JSON.stringify(attempts));
                }
            } catch (err) {
                console.error('Error clearing login attempts:', err);
            }
        }

        toast.show('Password has been reset successfully!', 'success', 5000);
        return true;
    } catch (err) {
        console.error('Password update error:', err);
        toast.show('Error: ' + err.message, 'error');
        return false;
    }
}

// Make the functions available globally
window.resendConfirmationEmail = resendConfirmationEmail;
window.sendPasswordResetEmail = sendPasswordResetEmail;
window.handlePasswordReset = handlePasswordReset;

async function logout() {
    try {
        // Try to sign out with Supabase if available
        if (supabase) {
            try {
                const { error } = await supabase.auth.signOut();
                if (error) {
                    console.error('Supabase signout error:', error);
                }
            } catch (err) {
                console.error('Supabase signout exception:', err);
            }
        }

        // Always update local state regardless of Supabase result
        chatState.isLoggedIn = false;
        chatState.username = '';
        chatState.saveState();
        updateLoginStatus();
        toast.show('Logged out successfully', 'success');
    } catch (err) {
        console.error('Logout error:', err);
        toast.show('Logout error: ' + err.message, 'error');
    }
}

async function handleDeleteAccount() {
    if (!chatState.isLoggedIn) {
        toast.show('You must be logged in to delete your account', 'error');
        return;
    }

    // Show confirmation dialog with more detailed warning
    const confirmed = await modal.confirm(
        'Delete Account',
        `Are you sure you want to delete your account? This will permanently delete all your conversations (${chatState.conversations.length} total), messages, and account data. This action cannot be undone.`
    );

    if (!confirmed) {
        return;
    }

    // Show loading state
    toast.show('Deleting account and all data...', 'info');

    try {
        // Delete user account and all data from Supabase
        if (window.supabaseDB && window.deleteUserAccount) {
            const result = await window.deleteUserAccount();

            if (!result.success) {
                throw result.error || new Error('Failed to delete account from database');
            }
        } else {
            console.warn('Supabase DB not available, clearing local data only');
        }

        // Clear all local state
        chatState.conversations = [];
        chatState.currentConversationId = null;
        chatState.currentMessages = [];
        chatState.isLoggedIn = false;
        chatState.username = '';
        chatState.profilePhoto = '';

        // Clear any other user-specific data
        if (chatState.userStats) {
            chatState.userStats = {};
        }

        chatState.saveState();

        // Update UI
        updateConversationsList();
        chatManager.renderMessages();
        updateLoginStatus();
        elements.chatTitle.textContent = 'New Chat';

        // Clear any cached user data
        localStorage.removeItem('sati_chatbot_user_data');

        toast.show('Account and all data deleted successfully', 'success');

    } catch (error) {
        console.error('Error deleting account:', error);
        toast.show('Error deleting account: ' + (error.message || 'Unknown error occurred'), 'error');
    }
}

function updateLoginStatus() {
    const loginLogoutBtn = document.getElementById('loginLogoutBtn');
    const icon = loginLogoutBtn.querySelector('i');
    const text = loginLogoutBtn.querySelector('span');

    if (chatState.isLoggedIn) {
        // Update login button to show logout
        icon.className = 'fas fa-sign-out-alt';
        text.textContent = 'Logout';

        // Update profile avatar to show logged in state
        if (elements.profileAvatar) {
            elements.profileAvatar.classList.add('logged-in');

            // Remove any previous img
            const prevImg = elements.profileAvatar.querySelector('img.profile-photo');
            if (prevImg) prevImg.remove();
            // Set the first letter of username as the avatar text, or show image if available
            const avatarText = elements.profileAvatar.querySelector('.avatar-text');
            if (chatState.profilePhoto) {
                // Insert image as the only child
                const img = document.createElement('img');
                img.src = chatState.profilePhoto;
                img.alt = 'Profile Photo';
                img.className = 'profile-photo';
                img.style.width = '32px';
                img.style.height = '32px';
                img.style.borderRadius = '50%';
                img.style.objectFit = 'cover';
                img.style.position = 'static';
                img.style.display = 'block';
                // Remove all children and add only the image
                elements.profileAvatar.innerHTML = '';
                elements.profileAvatar.appendChild(img);
            } else if (avatarText && chatState.username) {
                elements.profileAvatar.innerHTML = '<span class="avatar-text">' + chatState.username.charAt(0).toUpperCase() + '</span>';
            } else {
                elements.profileAvatar.innerHTML = '<span class="avatar-text">?</span>';
            }
        }

        // Update My Profile button text to show username
        const myProfileBtn = document.getElementById('myProfileBtn');
        if (myProfileBtn) {
            myProfileBtn.innerHTML = `<i class="fas fa-user"></i> <span>${chatState.username}'s Profile</span>`;
        }
    } else {
        // Update login button to show login
        icon.className = 'fas fa-sign-in-alt';
        text.textContent = 'Login';

        // Update profile avatar to show logged out state
        if (elements.profileAvatar) {
            elements.profileAvatar.classList.remove('logged-in');

            // Remove any previous img
            const prevImg = elements.profileAvatar.querySelector('img.profile-photo');
            if (prevImg) prevImg.remove();
            // Reset avatar text
            elements.profileAvatar.innerHTML = '<span class="avatar-text">?</span>';
        }

        // Reset My Profile button text
        const myProfileBtn = document.getElementById('myProfileBtn');
        if (myProfileBtn) {
            myProfileBtn.innerHTML = `<i class="fas fa-user"></i> <span>My Profile</span>`;
        }
    }
}

// Show profile modal with user information
function showProfileModal() {
    // Get profile elements
    const profileUsername = document.getElementById('profileUsername');
    const profileEmail = document.getElementById('profileEmail');

    const profileAvatarLarge = document.getElementById('profileAvatarLarge');
    const profileActions = document.getElementById('profileActions');

    // Defensive: Always re-read provider from current session if logged in
    async function updateProfileWithCurrentProvider() {
        if (chatState.isLoggedIn && supabase) {
            try {
                const { data, error } = await supabase.auth.getSession();
                if (!error && data.session && data.session.user.app_metadata && data.session.user.app_metadata.provider) {
                    chatState.authProvider = data.session.user.app_metadata.provider;
                    // Extract profile photo from user_metadata
                    if (data.session.user.user_metadata) {
                        if (chatState.authProvider === 'google' && data.session.user.user_metadata.picture) {
                            chatState.profilePhoto = data.session.user.user_metadata.picture;
                        } else if (chatState.authProvider === 'github' && data.session.user.user_metadata.avatar_url) {
                            chatState.profilePhoto = data.session.user.user_metadata.avatar_url;
                        }
                    }
                    chatState.saveState();
                }
            } catch (err) {
                // Ignore, fallback to last known provider
            }
        }
        // Now update the UI as before
        if (chatState.isLoggedIn) {
            // Set username and email
            profileUsername.textContent = chatState.username || 'User';
            profileEmail.textContent = chatState.email || 'No email provided';

            // Set avatar with first letter of username
            if (profileAvatarLarge) {
                // Remove any previous img
                const prevImg = profileAvatarLarge.querySelector('img.profile-photo');
                if (prevImg) prevImg.remove();
                if (chatState.profilePhoto) {
                    const img = document.createElement('img');
                    img.src = chatState.profilePhoto;
                    img.alt = 'Profile Photo';
                    img.className = 'profile-photo';
                    img.style.width = '80px';
                    img.style.height = '80px';
                    img.style.borderRadius = '50%';
                    img.style.objectFit = 'cover';
                    img.style.display = 'block';
                    profileAvatarLarge.innerHTML = '';
                    profileAvatarLarge.appendChild(img);
                } else {
                    profileAvatarLarge.innerHTML = chatState.username.charAt(0).toUpperCase();
                }
                profileAvatarLarge.style.backgroundColor = 'var(--accent-color)';
            }

            // Update profile actions to show edit username, delete account and logout buttons
            if (profileActions) {
                profileActions.innerHTML = `
                    <button class="btn btn-dark" id="editUsernameBtn">
                        <i class="fas fa-user-edit"></i> Edit Username
                    </button>
                    <button class="btn btn-white" id="deleteAccountBtn">
                        <i class="fas fa-user-times"></i> Delete Account
                    </button>
                    <button class="btn btn-white" onclick="logout(); modal.hide('profileModal');">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                `;
                // Re-attach the event listeners
                const editUsernameBtn = document.getElementById('editUsernameBtn');
                if (editUsernameBtn) {
                    editUsernameBtn.addEventListener('click', showEditUsernameModal);
                }

                const deleteAccountBtn = document.getElementById('deleteAccountBtn');
                if (deleteAccountBtn) {
                    deleteAccountBtn.addEventListener('click', async () => {
                        modal.hide('profileModal');
                        await handleDeleteAccount();
                    });
                }
            }
        } else {
            // Default values for logged out state
            profileUsername.textContent = 'Guest';
            profileEmail.textContent = 'Not logged in';

            // Set default avatar
            if (profileAvatarLarge) {
                // Remove any previous img
                const prevImg = profileAvatarLarge.querySelector('img.profile-photo');
                if (prevImg) prevImg.remove();
                profileAvatarLarge.innerHTML = '?';
                profileAvatarLarge.style.backgroundColor = 'var(--text-muted)';
            }
            // Update profile actions to show login button
            if (profileActions) {
                profileActions.innerHTML = `
                    <button class="btn btn-primary" onclick="modal.hide('profileModal'); modal.show('loginModal'); setTimeout(addLoginModalEventListeners, 0);">
                        <i class="fas fa-sign-in-alt"></i> Login
                    </button>
                `;
            }
        }
        // Show the modal
        modal.show('profileModal');
    }
    // Call the async update function
    updateProfileWithCurrentProvider();
}

// Show welcome modal with personalized greeting
function showWelcomeModal(username) {
    let welcomeUsername = document.getElementById('welcomeUsername');
    const welcomeHeading = document.getElementById('welcomeHeading');
    const welcomeMessage = document.getElementById('welcomeMessage');

    // If the span is missing but the heading exists, reconstruct the heading
    if (!welcomeUsername && welcomeHeading) {
        welcomeHeading.innerHTML = `Hello, <span id="welcomeUsername">User</span>!`;
        welcomeUsername = document.getElementById('welcomeUsername');
    }

    // Null checks for all required elements
    if (!welcomeUsername || !welcomeHeading || !welcomeMessage) {
        console.warn('[showWelcomeModal] One or more welcome modal elements are missing:', {
            welcomeUsername,
            welcomeHeading,
            welcomeMessage
        });
        return;
    }

    // Set username
    welcomeUsername.textContent = username || 'User';

    // Determine if this is first login or return user
    const isFirstLogin = !localStorage.getItem('sati_last_login');

    if (isFirstLogin) {
        welcomeHeading.innerHTML = `Welcome, <span id="welcomeUsername">${username || 'User'}</span>!`;
        welcomeMessage.textContent = 'Thank you for joining SATI ChatBot. We\'re here to help with all your academic needs.';
    } else {
        welcomeHeading.innerHTML = `Welcome back, <span id="welcomeUsername">${username || 'User'}</span>!`;
        welcomeMessage.textContent = 'Great to see you again! Continue your conversations or start a new chat.';
    }

    // Show a welcome toast for first-time or returning users
    showWelcomeToast(username, isFirstLogin);

    // Show the modal for all fresh logins (both first-time and returning users)
    modal.show('welcomeModal');
}

// Show welcome toast notification
function showWelcomeToast(username, isFirstLogin) {
    // Get the current time to personalize the greeting
    const currentHour = new Date().getHours();
    let timeGreeting = 'Hello';

    if (currentHour < 12) {
        timeGreeting = 'Good morning';
    } else if (currentHour < 18) {
        timeGreeting = 'Good afternoon';
    } else {
        timeGreeting = 'Good evening';
    }

    // Create different messages for first-time vs returning users
    let message = '';

    if (isFirstLogin) {
        message = `👋 ${timeGreeting}, ${username}! Welcome to SATI ChatBot`;
    } else {
        message = `👋 ${timeGreeting}, ${username}! Welcome back`;
    }

    // Show the toast with a longer duration (5 seconds)
    toast.show(message, 'success', 5000);
}


// Initialize sidebar toggle button position
function initializeSidebarToggle() {
    const sidebar = elements.sidebar;

    if (!sidebar) return;

    // Initialize hover trigger for desktop if sidebar is collapsed
    if (window.innerWidth > 768 && sidebar.classList.contains('collapsed')) {
        createHoverTrigger();
    }
}

// Update theme menu selection
function updateThemeMenuSelection() {
    const themeOptions = document.querySelectorAll('.theme-option');
    if (themeOptions.length > 0) {
        themeOptions.forEach(option => {
            const themeValue = option.getAttribute('data-theme');
            if (themeValue === chatState.theme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }
}

// Update theme toggle button appearance (legacy function name kept for compatibility)
function updateThemeToggleButton() {
    updateThemeMenuSelection();
}

// Show theme change toast message
function showThemeChangeToast(newTheme, oldTheme) {
    let message = 'Theme updated';

    if (newTheme === 'dark') {
        message = 'Switched to dark theme';
    } else if (newTheme === 'light') {
        message = 'Switched to light theme';
    } else if (newTheme === 'system') {
        message = 'Switched to system default theme';
    }

    // Show toast if toast system is available
    if (typeof toast !== 'undefined' && toast.show) {
        toast.show(message, 'success');
    } else {
        console.log('🎨 ' + message);
    }
}

// Check if user is already logged in with Supabase
async function checkExistingSession() {
    if (!supabase) return false;

    try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            console.error('Error checking session:', error);
            return false;
        }

        if (data.session) {
            console.log('✅ User already has an active session');

            // Set user state
            let authProvider = 'email';
            if (data.session.user.app_metadata && data.session.user.app_metadata.provider) {
                authProvider = data.session.user.app_metadata.provider;
            }
            // Extract profile photo from user_metadata
            if (data.session.user.user_metadata) {
                if (authProvider === 'google' && data.session.user.user_metadata.picture) {
                    chatState.profilePhoto = data.session.user.user_metadata.picture;
                } else if (authProvider === 'github' && data.session.user.user_metadata.avatar_url) {
                    chatState.profilePhoto = data.session.user.user_metadata.avatar_url;
                }
            }
            chatState.isLoggedIn = true;
            let username2 = (data.session.user.user_metadata && data.session.user.user_metadata.username)
                ? data.session.user.user_metadata.username
                : (data.session.user.email ? data.session.user.email.split('@')[0] : data.session.user.id);
            chatState.username = username2;
            chatState.email = data.session.user.email;
            chatState.authProvider = authProvider;
            chatState.saveState();

            // Initialize Supabase storage and load conversations
            if (window.supabaseDB && window.supabaseDB.setCurrentUserEmail) {
                window.supabaseDB.setCurrentUserEmail(data.session.user.email);
                chatState.initSupabaseStorage();

                // Load conversations from Supabase
                chatState.loadConversationsFromSupabase().then(() => {
                    console.log('✅ Conversations loaded for existing session');
                });
            }

            // Update UI
            updateLoginStatus();
            afterLoginOrSignup();

            // Clear the fresh login flag on session restoration
            localStorage.removeItem('sati_fresh_login');

            return true;
        }

        return false;
    } catch (err) {
        console.error('Session check error:', err);
        return false;
    }
}

// Handle email verification and password reset when user returns from email link
async function handleEmailVerification() {
    if (!supabase) return false;

    try {
        // Check URL parameters for password reset
        const urlParams = new URLSearchParams(window.location.search);
        const isReset = urlParams.get('reset') === 'true';

        // Check if we have a hash in the URL that might be from email verification or password reset
        const hash = window.location.hash;
        if (hash && (hash.includes('type=signup') || hash.includes('type=recovery'))) {
            console.log('Detected auth hash in URL, processing...');

            // Process the hash
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Error processing verification:', error);
                toast.show('Verification failed: ' + error.message, 'error', 5000);
                return false;
            }

            if (data?.session) {
                // Check if this is a password reset
                if (hash.includes('type=recovery') || isReset) {
                    console.log('✅ Password reset link verified!');

                    // Show password reset form
                    showPasswordUpdateModal();

                    // Clear the hash and params from URL to prevent reprocessing
                    window.history.replaceState(null, null, window.location.pathname);

                    return true;
                }

                // Otherwise, it's an email verification
                console.log('✅ Email verified successfully!');

                // Set user state
                let authProvider = 'email';
                if (data.session.user.app_metadata && data.session.user.app_metadata.provider) {
                    authProvider = data.session.user.app_metadata.provider;
                }
                // Extract profile photo from user_metadata
                if (data.session.user.user_metadata) {
                    if (authProvider === 'google' && data.session.user.user_metadata.picture) {
                        chatState.profilePhoto = data.session.user.user_metadata.picture;
                    } else if (authProvider === 'github' && data.session.user.user_metadata.avatar_url) {
                        chatState.profilePhoto = data.session.user.user_metadata.avatar_url;
                    }
                }
                chatState.isLoggedIn = true;
                let username3 = (data.session.user.user_metadata && data.session.user.user_metadata.username)
                    ? data.session.user.user_metadata.username
                    : (data.session.user.email ? data.session.user.email.split('@')[0] : data.session.user.id);
                chatState.username = username3;
                chatState.email = data.session.user.email;
                chatState.authProvider = authProvider;
                chatState.saveState();

                // Update login statistics
                updateLoginStats();

                // Update UI
                updateLoginStatus();
                afterLoginOrSignup();

                // Show welcome modal
                setTimeout(() => {
                    showWelcomeModal(chatState.username);
                    toast.show('Email verified successfully! Welcome to SATI ChatBot.', 'success', 5000);
                }, 500);

                // Clear the hash from URL to prevent reprocessing
                window.history.replaceState(null, null, window.location.pathname);

                return true;
            }
        }
        return false;
    } catch (err) {
        console.error('Email verification error:', err);
        return false;
    }
}

// Show password update modal after reset
function showPasswordUpdateModal() {
    // Create and show a custom password update modal
    const resetModal = document.createElement('div');
    resetModal.className = 'modal-overlay';
    resetModal.id = 'passwordUpdateModal';
    resetModal.innerHTML = `
            <div class="modal-container">
                <div class="modal-header">
                    <h2>🔐 Set New Password</h2>
                </div>
                <div class="modal-body">
                    <div style="text-align: center; padding: 20px;">
                        <i class="fas fa-key" style="font-size: 48px; color: var(--accent-color); margin-bottom: 20px;"></i>
                        <h3>Create a New Password</h3>
                        <p>Please enter a new password for your account.</p>
                        <form id="passwordUpdateForm" style="margin-top: 20px;">
                            <div class="form-group">
                                <label for="newPassword">New Password</label>
                                <input type="password" id="newPassword" required minlength="6">
                                <small>Password must be at least 6 characters</small>
                            </div>
                            <div class="form-group">
                                <label for="confirmPassword">Confirm Password</label>
                                <input type="password" id="confirmPassword" required minlength="6">
                            </div>
                            <div style="margin-top: 20px;">
                                <button type="submit" class="login-btn">Update Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    document.body.appendChild(resetModal);

    // Add form submission handler
    const form = resetModal.querySelector('#passwordUpdateForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            toast.show('Passwords do not match', 'error');
            return;
        }

        const success = await handlePasswordReset(newPassword);
        if (success) {
            modal.hide('passwordUpdateModal');

            // Show login modal after successful password reset
            setTimeout(() => {
                modal.show('loginModal');
                setTimeout(addLoginModalEventListeners, 0);
                toast.show('Your password has been updated. Please log in with your new password.', 'success', 5000);
            }, 500);
        }
    });

    // Show the modal
    modal.show('passwordUpdateModal');
}

// Initialize Cool Mode for login buttons
// Applies particle effects to Login, Sign Up, Google, GitHub, and Continue as Guest buttons
function initializeCoolMode() {
    try {
        // Wait for cool mode to be available
        if (typeof window.coolMode === 'undefined') {
            console.warn('⚠️ Cool Mode not available, retrying...');
            setTimeout(initializeCoolMode, 100);
            return;
        }

        // Apply cool mode to login buttons
        const loginButtons = [
            '.login-btn',           // Login and Sign Up buttons
            '#googleSSOBtn',        // Google SSO button
            '#githubSSOBtn'         // GitHub SSO button
        ];

        // Apply cool mode to each button type with different options
        loginButtons.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element && !element.hasAttribute('data-cool-mode-applied')) {
                    // Different particle options for different button types
                    let options = {};

                    if (selector.includes('google')) {
                        options = {
                            particleCount: 30,
                            speedHorz: 8,
                            speedUp: 20,
                            size: 25
                        };
                    } else if (selector.includes('github')) {
                        options = {
                            particleCount: 35,
                            speedHorz: 10,
                            speedUp: 25,
                            size: 30
                        };
                    } else {
                        // Default for Login/Sign Up buttons
                        options = {
                            particleCount: 25,
                            speedHorz: 6,
                            speedUp: 18,
                            size: 20
                        };
                    }

                    // Apply the cool mode effect
                    window.coolMode.applyParticleEffect(element, options);

                    // Mark as applied to avoid duplicate applications
                    element.setAttribute('data-cool-mode-applied', 'true');

                    console.log(`✨ Cool Mode applied to: ${selector}`);
                }
            });
        });

        console.log('✅ Cool Mode initialization completed');

    } catch (error) {
        console.error('❌ Error initializing Cool Mode:', error);
    }
}

// Initialize Application
function initializeApp() {
    try {
        // Initialize DOM elements first
        initializeElements();

        // Initialize Supabase client
        let supabaseInitialized = false;

        // Try to initialize Supabase with a retry mechanism
        const initSupabaseWithRetry = (retries = 3) => {
            supabaseInitialized = initializeSupabase();

            if (supabaseInitialized) {
                console.log('✅ Supabase client initialized successfully');

                // Now that Supabase is initialized and all functions are defined,
                // we can set up the auth state listener
                if (typeof listenForAuthChanges === 'function') {
                    listenForAuthChanges();
                    console.log('✅ Supabase auth listener set up');

                    // Check for email verification first
                    handleEmailVerification().then(verified => {
                        if (!verified) {
                            // If not verified, check if user is already logged in
                            checkExistingSession().then(isLoggedIn => {
                                console.log('Session check result:', isLoggedIn ? 'User is logged in' : 'No active session');
                            });
                        }
                    });
                } else {
                    console.warn('⚠️ Auth listener function not found');
                }

            } else if (retries > 0) {
                console.warn(`⚠️ Supabase initialization failed, retrying... (${retries} attempts left)`);
                setTimeout(() => initSupabaseWithRetry(retries - 1), 500);
            } else {
                console.error('❌ Supabase client initialization failed after multiple attempts - SSO login may not work');
            }
        };

        // Start initialization with retries
        initSupabaseWithRetry();

        // Wait for API manager to be ready before initializing model select
        const initializeWithApiManager = () => {
            if (window.apiManager) {
                // Initialize main model select with proper options
                updateMainModelSelect();
                console.log('✅ Model selection initialized');
            } else {
                console.log('⚠️ API Manager not ready, retrying in 500ms...');
                setTimeout(initializeWithApiManager, 500);
            }
        };

        // Start initialization
        initializeWithApiManager();

        // Update login status
        updateLoginStatus();

        // Render initial state
        chatManager.renderMessages();
        updateConversationsList();
        updateChatStatistics();

        // Clear guest conversations if user is not logged in
        if (!chatState.isLoggedIn) {
            console.log('👤 Guest mode detected - clearing any stored conversations');
            chatState.conversations = [];
            localStorage.removeItem('sati_conversations');
            updateConversationsList();
            updateChatStatistics();
        }

        // Initialize event listeners
        initializeEventListeners();

        // Initialize Cool Mode for login buttons
        initializeCoolMode();

        // Initialize Voice Recognition
        window.voiceRecognition = new VoiceRecognition();
        console.log('✅ Voice Recognition initialized');

        // Apply saved theme and update theme toggle button
        updateThemeToggleButton();

        // Initialize sidebar toggle button position
        initializeSidebarToggle();

        // Mobile-specific initialization
        if (window.innerWidth <= 768) {
            initializeMobileLayout();
        }

        // Focus message input (delay for mobile)
        if (elements.messageInput) {
            if (window.innerWidth <= 768) {
                // Small delay for mobile to ensure layout is stable
                setTimeout(() => {
                    elements.messageInput.focus();
                }, 100);
            } else {
                elements.messageInput.focus();
            }
        }

        console.log('SATI ChatBot initialized successfully');
    } catch (error) {
        console.error('Error initializing SATI ChatBot:', error);
    }
}

// Mobile-specific initialization
function initializeMobileLayout() {
    try {
        // Ensure all elements are visible
        const topBar = document.querySelector('.top-bar');
        const mainContent = document.querySelector('.main-content');
        const inputArea = document.querySelector('.input-area');
        const chatWindow = document.querySelector('.chat-window');

        if (topBar) {
            topBar.style.display = 'flex';
            topBar.style.visibility = 'visible';
            topBar.style.opacity = '1';
        }

        if (mainContent) {
            mainContent.style.display = 'flex';
            mainContent.style.visibility = 'visible';
            mainContent.style.opacity = '1';
        }

        if (inputArea) {
            inputArea.style.display = 'block';
            inputArea.style.visibility = 'visible';
            inputArea.style.opacity = '1';
        }

        if (chatWindow) {
            chatWindow.style.display = 'flex';
            chatWindow.style.visibility = 'visible';
            chatWindow.style.opacity = '1';
        }

        // Force layout recalculation
        document.body.offsetHeight;

        // Ensure proper viewport height calculation
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', () => {
            setTimeout(setVH, 100);
        });

    } catch (error) {
        console.error('Error initializing mobile layout:', error);
    }
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Handle window resize
window.addEventListener('resize', () => {
    const sidebar = elements.sidebar;
    const appContainer = document.getElementById('appContainer');
    const sidebarToggle = elements.sidebarToggle;

    if (window.innerWidth > 768) {
        // Desktop mode
        sidebar.classList.remove('show');
        appContainer.classList.remove('sidebar-open');

        // Clean up mobile click outside behavior
        cleanupMobileClickOutside();

        // Maintain collapsed state and hover trigger
        if (sidebar.classList.contains('collapsed')) {
            createHoverTrigger();
        } else {
            // Reset toggle button position for expanded sidebar
            sidebarToggle.style.left = '';
            sidebarToggle.style.transition = '';
            removeHoverTrigger();
        }
    } else {
        // Mobile mode
        sidebar.classList.remove('collapsed');
        appContainer.classList.remove('sidebar-collapsed');

        // Reset any hover transforms
        sidebar.style.transform = '';
        sidebar.style.boxShadow = '';

        // Reset toggle button position on mobile
        sidebarToggle.style.left = '';
        sidebarToggle.style.transition = '';

        // Handle mobile toggle translation
        handleMobileToggleTranslation();

        // Remove hover trigger on mobile
        removeHoverTrigger();

        // Setup mobile click outside behavior if sidebar is open
        if (sidebar.classList.contains('show')) {
            setupMobileClickOutside();
        }
    }

});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Refresh conversations list when page becomes visible
        updateConversationsList();
        // Also refresh saved chats if modal is open
        const savedChatsModal = document.getElementById('savedChatsModal');
        if (savedChatsModal && savedChatsModal.classList.contains('show')) {
            updateSavedChatsList();
        }
    }
});

// Handle window focus to ensure UI sync when switching tabs
window.addEventListener('focus', () => {
    // Refresh both conversation lists when window gains focus
    updateConversationsList();
    // Also refresh saved chats if modal is open
    const savedChatsModal = document.getElementById('savedChatsModal');
    if (savedChatsModal && savedChatsModal.classList.contains('show')) {
        updateSavedChatsList();
    }
});

// Clean up event listeners when page is unloaded
window.addEventListener('beforeunload', () => {
    cleanupMobileClickOutside();
    cleanupToggleHoverBehavior();
});

// Export for potential external use
window.SATIChatBot = {
    state: chatState,
    chat: chatManager,
    modal: modal,
    toast: toast,
    utils: utils
};

// Debug function to test Supabase connection
window.debugSupabase = function () {
    console.log('=== SUPABASE DEBUG INFO ===');
    console.log('window.supabase (CDN):', !!window.supabase);
    console.log('supabase client instance:', !!supabase);
    console.log('window.supabaseClient:', !!window.supabaseClient);
    console.log('Supabase config available:', !!window.SUPABASE_CONFIG?.CONFIGURED);
    console.log('Current hostname:', window.location.hostname);
    console.log('Is localhost:', window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    console.log('Current URL:', window.location.href);

    // Try to initialize if not done
    if (!supabase && window.SUPABASE_CONFIG?.CONFIGURED) {
        console.log('🔄 Attempting manual initialization...');
        const result = initializeSupabase();
        console.log('Manual initialization result:', result);
    }

    if (supabase) {
        console.log('✅ Supabase client is initialized');
        console.log('Supabase client object:', supabase);
        // Test connection
        supabase.auth.getSession().then(({ data, error }) => {
            if (error) {
                console.log('❌ Supabase connection error:', error);
            } else {
                console.log('✅ Supabase connection successful');
                console.log('Current session:', data.session);
            }
        }).catch(err => {
            console.log('❌ Error testing connection:', err);
        });
    } else {
        console.log('❌ Supabase client is NOT initialized');
        console.log('Trying to initialize now...');
        if (window.initializeSupabase) {
            const result = window.initializeSupabase();
            console.log('Initialization attempt result:', result);
        }
    }

    console.log('=== END DEBUG INFO ===');
};

// Manual initialization function for debugging
window.forceInitializeSupabase = function () {
    console.log('�� Force initializing Supabase...');

    // Set fallback config if not already set
    if (!window.SUPABASE_CONFIG || !window.SUPABASE_CONFIG.CONFIGURED) {
        window.SUPABASE_CONFIG = {
            URL: process.env.SUPABASE_URL,
            KEY: process.env.SUPABASE_KEY,
            CONFIGURED: true
        };
        console.log('✅ Fallback config set');
    }

    // Force initialize
    const result = initializeSupabase();
    console.log('Force initialization result:', result);

    if (supabase) {
        console.log('✅ Supabase is now available:', supabase);
        window.supabaseClient = supabase;
    } else {
        console.log('❌ Supabase still not available');
    }

    return !!supabase;
};

// Test login function for debugging
window.testLogin = async function (email = 'test@example.com', password = 'testpassword123') {
    console.log('=== TESTING LOGIN ===');
    console.log('Email:', email);
    console.log('Password:', password);

    if (!supabase) {
        console.log('❌ Supabase not initialized, trying to force initialize...');
        const initialized = window.forceInitializeSupabase();
        if (!initialized) {
            console.log('❌ Force initialization failed');
            return;
        }
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            console.log('❌ Login error:', error);
            if (error.message.includes('Invalid login credentials')) {
                console.log('🔄 Trying to sign up instead...');
                const { data: signupData, error: signupError } = await supabase.auth.signUp({
                    email: email,
                    password: password
                });

                if (signupError) {
                    console.log('❌ Signup error:', signupError);
                } else {
                    console.log('✅ Signup successful:', signupData);
                }
            }
        } else {
            console.log('✅ Login successful:', data);
        }
    } catch (err) {
        console.log('❌ Unexpected error:', err);
    }

    console.log('=== END TEST LOGIN ===');
};

// Test SSO function
window.testGoogleSSO = async function () {
    console.log('=== TESTING GOOGLE SSO ===');

    if (!supabase) {
        console.log('❌ Supabase not initialized, trying to force initialize...');
        const initialized = window.forceInitializeSupabase();
        if (!initialized) {
            console.log('❌ Force initialization failed');
            return;
        }
    }

    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/'
            }
        });

        if (error) {
            console.log('❌ Google SSO error:', error);
        } else {
            console.log('✅ Google SSO initiated:', data);
        }
    } catch (err) {
        console.log('❌ Google SSO exception:', err);
    }

    console.log('=== END GOOGLE SSO TEST ===');
};

// Test GitHub SSO function
window.testGitHubSSO = async function () {
    console.log('=== TESTING GITHUB SSO ===');

    if (!supabase) {
        console.log('❌ Supabase not initialized, trying to force initialize...');
        const initialized = window.forceInitializeSupabase();
        if (!initialized) {
            console.log('❌ Force initialization failed');
            return;
        }
    }

    try {
        console.log('🔄 Attempting GitHub OAuth...');
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: window.location.origin + '/'
            }
        });

        if (error) {
            console.log('❌ GitHub SSO error:', error);
            console.log('Error details:', {
                message: error.message,
                status: error.status,
                statusCode: error.statusCode
            });
        } else {
            console.log('✅ GitHub SSO initiated:', data);
        }
    } catch (err) {
        console.log('❌ GitHub SSO exception:', err);
    }

    console.log('=== END GITHUB SSO TEST ===');
};

// Test API endpoint
window.testSupabaseAPI = async function () {
    console.log('=== TESTING SUPABASE API ENDPOINT ===');

    try {
        console.log('Testing /api/supabase-config...');
        const response = await fetch('/api/supabase-config');
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (response.ok) {
            const data = await response.json();
            console.log('✅ API Response:', data);
        } else {
            const text = await response.text();
            console.log('❌ API Error Response:', text);
        }
    } catch (error) {
        console.log('❌ API Request Failed:', error);
    }

    console.log('=== END API TEST ===');
};

// Check which OAuth providers are available
window.checkOAuthProviders = async function () {
    console.log('=== CHECKING OAUTH PROVIDERS ===');

    if (!supabase) {
        console.log('❌ Supabase not initialized');
        return;
    }

    try {
        // Try to get session to test connection
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        console.log('Session check:', sessionError ? 'Failed' : 'Success');

        // Test Google OAuth
        console.log('🔄 Testing Google OAuth availability...');
        try {
            const googleTest = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: window.location.origin + '/', skipBrowserRedirect: true }
            });
            console.log('Google OAuth test result:', googleTest.error ? 'Failed' : 'Available');
            if (googleTest.error) console.log('Google error:', googleTest.error.message);
        } catch (e) {
            console.log('Google OAuth test failed:', e.message);
        }

        // Test GitHub OAuth
        console.log('🔄 Testing GitHub OAuth availability...');
        try {
            const githubTest = await supabase.auth.signInWithOAuth({
                provider: 'github',
                options: { redirectTo: window.location.origin + '/', skipBrowserRedirect: true }
            });
            console.log('GitHub OAuth test result:', githubTest.error ? 'Failed' : 'Available');
            if (githubTest.error) console.log('GitHub error:', githubTest.error.message);
        } catch (e) {
            console.log('GitHub OAuth test failed:', e.message);
        }

    } catch (error) {
        console.log('❌ Provider check failed:', error);
    }

    console.log('=== END PROVIDER CHECK ===');
};

// Show saved chats modal
async function showSavedChatsModal() {
    console.log('🔖 Opening saved chats modal...');

    // If modal not in DOM, inject from template
    let modal = document.getElementById('savedChatsModal');
    if (!modal) {
        const template = document.getElementById('savedChatsModalTemplate');
        if (template) {
            document.body.appendChild(template.content.cloneNode(true));
            modal = document.getElementById('savedChatsModal');
            console.log('✅ Saved chats modal created from template');
        } else {
            console.error('❌ Saved chats modal template not found');
            return;
        }
    }

    if (modal) {
        modal.classList.add('show');
        console.log('✅ Saved chats modal shown');

        // Load saved chats
        await updateSavedChatsList();

        // Initialize search functionality
        initializeSavedChatsSearch();

        // Focus on search input for better UX
        setTimeout(() => {
            const searchInput = document.getElementById('savedChatsSearchInput');
            if (searchInput) {
                searchInput.focus();
            }
        }, 100);

        // Add close button handler
        const closeBtn = document.getElementById('closeSavedChatsBtn');
        if (closeBtn) {
            closeBtn.onclick = () => {
                modal.classList.remove('show');
                console.log('✅ Saved chats modal closed');
            };
        }

        // Add overlay click to close
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                console.log('✅ Saved chats modal closed via overlay');
            }
        };
    } else {
        console.error('❌ Failed to create saved chats modal');
    }
}

// Initialize saved chats search functionality
function initializeSavedChatsSearch() {
    const searchInput = document.getElementById('savedChatsSearchInput');
    const clearSearchBtn = document.getElementById('clearSavedChatsSearch');

    if (!searchInput || !clearSearchBtn) {
        console.log('Search elements not found in saved chats modal');
        return;
    }

    // Store original conversations for filtering
    let originalConversations = [];

    // Function to filter and display conversations
    function filterConversations(searchTerm) {
        const container = document.getElementById('savedChatsList');
        if (!container) return;

        const conversationItems = container.querySelectorAll('.conversation-item');
        let visibleCount = 0;

        conversationItems.forEach(item => {
            const titleElement = item.querySelector('.conversation-title');
            if (titleElement) {
                const title = titleElement.textContent.toLowerCase();
                const matches = title.includes(searchTerm.toLowerCase());

                if (matches || searchTerm === '') {
                    item.style.display = 'flex';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            }
        });

        // Show/hide "no results" message
        let noResultsMsg = container.querySelector('.no-search-results');
        if (searchTerm && visibleCount === 0) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.className = 'no-search-results';
                noResultsMsg.innerHTML = `
                    <i class="fas fa-search"></i>
                    <p>No conversations found for "${searchTerm}"</p>
                `;
                container.appendChild(noResultsMsg);
            }
            noResultsMsg.style.display = 'block';
        } else if (noResultsMsg) {
            noResultsMsg.style.display = 'none';
        }
    }

    // Search input event listener
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim();

        // Show/hide clear button
        if (searchTerm) {
            clearSearchBtn.style.display = 'flex';
        } else {
            clearSearchBtn.style.display = 'none';
        }

        // Filter conversations
        filterConversations(searchTerm);
    });

    // Clear search button event listener
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        filterConversations('');
        searchInput.focus();
    });

    // Enter key to focus on first visible conversation
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const container = document.getElementById('savedChatsList');
            if (container) {
                const firstVisibleItem = container.querySelector('.conversation-item[style*="flex"], .conversation-item:not([style*="none"])');
                if (firstVisibleItem) {
                    firstVisibleItem.click();
                }
            }
        }
    });

    // Clear search when modal is closed
    const modal = document.getElementById('savedChatsModal');
    if (modal) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (!modal.classList.contains('show')) {
                        // Modal is being closed, clear search
                        searchInput.value = '';
                        clearSearchBtn.style.display = 'none';
                        filterConversations('');
                    }
                }
            });
        });
        observer.observe(modal, { attributes: true });
    }
}

// Event listener is set up in initializeEventListeners()

// Add a global click listener to close any open conversation dropdown if clicking outside
if (!window._conversationDropdownClickListenerAdded) {
    document.addEventListener('click', function (event) {
        // Only close if click is outside any open dropdown or menu button
        const isDropdown = event.target.closest('.conversation-dropdown');
        const isMenuBtn = event.target.closest('.conversation-menu-btn');
        if (!isDropdown && !isMenuBtn) {
            document.querySelectorAll('.conversation-dropdown.show').forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        }
    });
    window._conversationDropdownClickListenerAdded = true;
}

// Username Modal Logic
function showUsernameModal(force = false) {
    if (!chatState.isLoggedIn) return;
    // Only show if username is missing or force is true
    if (!chatState.username || chatState.username === '' || force) {
        document.getElementById('usernameModal').classList.add('show');
        document.body.style.overflow = 'hidden';
        // Autofocus input
        setTimeout(() => {
            document.getElementById('usernameInput').focus();
        }, 100);
    }
}
function hideUsernameModal() {
    document.getElementById('usernameModal').classList.remove('show');
    document.body.style.overflow = '';
}
// Save username and update state
function handleUsernameSubmit(event) {
    event.preventDefault();
    const input = document.getElementById('usernameInput');
    const username = input.value.trim();
    if (!username || username.length < 2) {
        input.classList.add('input-error');
        input.focus();
        toast.show('Please enter a valid username (min 2 characters)', 'warning');
        return;
    }
    chatState.username = username;
    chatState.saveState();
    hideUsernameModal();
    updateLoginStatus();
    toast.show('Username set successfully!', 'success');
}
// Prevent closing modal without username
function preventUsernameModalClose(e) {
    e.stopPropagation();
    const input = document.getElementById('usernameInput');
    if (!input.value.trim()) {
        toast.show('Please enter a username to continue', 'warning');
    }
}
// Add event listeners after DOMContentLoaded
window.addEventListener('DOMContentLoaded', function () {
    const usernameForm = document.getElementById('usernameForm');
    if (usernameForm) {
        usernameForm.addEventListener('submit', handleUsernameSubmit);
    }
    const closeUsernameBtn = document.getElementById('closeUsernameBtn');
    if (closeUsernameBtn) {
        closeUsernameBtn.addEventListener('click', preventUsernameModalClose);
    }
    // Prevent clicking overlay to close
    const usernameModal = document.getElementById('usernameModal');
    if (usernameModal) {
        usernameModal.addEventListener('click', function (e) {
            if (e.target === usernameModal) {
                preventUsernameModalClose(e);
            }
        });
    }
});
// Show username modal after login/signup if needed
function afterLoginOrSignup() {
    if (chatState.isLoggedIn && (!chatState.username || chatState.username === '')) {
        showUsernameModal();
    }
}
updateLoginStatus();
afterLoginOrSignup();
updateLoginStatus();
afterLoginOrSignup();

// Username Edit Modal Logic
async function updateSupabaseUsername(newUsername) {
    if (!supabase || !chatState.isLoggedIn) return { error: 'Not logged in' };
    try {
        const { data, error } = await supabase.auth.updateUser({
            data: { username: newUsername }
        });
        if (error) {
            return { error };
        }
        return { data };
    } catch (err) {
        return { error: err };
    }
}
function showEditUsernameModal() {
    const modal = document.getElementById('editUsernameModal');
    const input = document.getElementById('editUsernameInput');
    if (input) input.value = chatState.username || '';
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    setTimeout(() => { input && input.focus(); }, 100);
}
function hideEditUsernameModal() {
    document.getElementById('editUsernameModal').classList.remove('show');
    document.body.style.overflow = '';
}
async function handleEditUsernameSubmit(event) {
    event.preventDefault();
    const input = document.getElementById('editUsernameInput');
    const newUsername = input.value.trim();
    if (!newUsername || newUsername.length < 2) {
        input.classList.add('input-error');
        input.focus();
        toast.show('Please enter a valid username (min 2 characters)', 'warning');
        return;
    }
    // Update in Supabase
    const { error } = await updateSupabaseUsername(newUsername);
    if (error) {
        toast.show('Failed to update username in Supabase', 'error');
        return;
    }
    // Update locally
    chatState.username = newUsername;
    chatState.saveState();
    updateLoginStatus();
    showProfileModal(); // Refresh modal
    hideEditUsernameModal();
    toast.show('Username updated successfully!', 'success');
}
// Add event listeners after DOMContentLoaded
window.addEventListener('DOMContentLoaded', function () {
    const editUsernameBtn = document.getElementById('editUsernameBtn');
    if (editUsernameBtn) {
        editUsernameBtn.addEventListener('click', showEditUsernameModal);
    }
    const closeEditUsernameBtn = document.getElementById('closeEditUsernameBtn');
    if (closeEditUsernameBtn) {
        closeEditUsernameBtn.addEventListener('click', hideEditUsernameModal);
    }
    const editUsernameCancelBtn = document.getElementById('editUsernameCancelBtn');
    if (editUsernameCancelBtn) {
        editUsernameCancelBtn.addEventListener('click', hideEditUsernameModal);
    }
    const editUsernameForm = document.getElementById('editUsernameForm');
    if (editUsernameForm) {
        editUsernameForm.addEventListener('submit', handleEditUsernameSubmit);
    }
    // Prevent closing modal by clicking overlay if input is invalid
    const editUsernameModal = document.getElementById('editUsernameModal');
    if (editUsernameModal) {
        editUsernameModal.addEventListener('click', function (e) {
            if (e.target === editUsernameModal) {
                const input = document.getElementById('editUsernameInput');
                if (!input.value.trim() || input.value.trim().length < 2) {
                    toast.show('Please enter a valid username to continue', 'warning');
                } else {
                    hideEditUsernameModal();
                }
            }
        });
    }
});

// Refactor renameSavedConversation and deleteSavedConversation to call the main modal-based functions for compatibility
async function renameSavedConversation(conversationId) {
    // For compatibility, just call renameConversation
    renameConversation(conversationId);
}
async function deleteSavedConversation(conversationId) {
    // For compatibility, just call deleteConversation
    await deleteConversation(conversationId);
}

// File Attachment Logic
function initializeFileAttachment() {
    const attachmentBtn = document.getElementById('attachmentBtn');
    const txtFileInput = document.getElementById('txtFileInput');
    const fileTypeWarning = document.getElementById('fileTypeWarning');
    const fileChip = document.getElementById('fileChip');
    const fileChipName = document.getElementById('fileChipName');
    const removeFileChipBtn = document.getElementById('removeFileChipBtn');

    if (!attachmentBtn || !txtFileInput || !fileTypeWarning || !fileChip || !fileChipName || !removeFileChipBtn) return;

    // Show warning card when attachment button is clicked
    attachmentBtn.addEventListener('click', () => {
        fileTypeWarning.style.display = 'flex';
        setTimeout(() => { fileTypeWarning.style.display = 'none'; }, 3000);
        txtFileInput.value = '';
        txtFileInput.click();
    });

    // Handle file selection
    txtFileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
            toast.show('Files other than .txt file extension are not accepted currently', 'warning', 4000);
            console.warn('[File Validation] Non-txt file rejected:', file.name);
            return;
        }
        // Read file text
        const reader = new FileReader();
        reader.onload = async function (evt) {
            try {
                const text = evt.target.result;
                if (!text || typeof text !== 'string') {
                    toast.show('Failed to extract text from file', 'error');
                    console.error('[File Extraction] Could not extract text from file:', file.name);
                    return;
                }
                // Upload to Supabase
                if (!window.supabaseClient) {
                    toast.show('Supabase not initialized', 'error');
                    console.error('[Supabase] supabaseClient not available');
                    return;
                }
                const userEmail = window.supabaseDB.getCurrentUserEmail && window.supabaseDB.getCurrentUserEmail();
                if (!userEmail) {
                    toast.show('You must be logged in to upload files', 'warning');
                    console.warn('[Auth] User not logged in for file upload');
                    return;
                }
                const filePath = `user-txt-uploads/${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.txt`;
                let uploadResult;
                try {
                    uploadResult = await window.supabaseClient.storage.from('user-txt-uploads').upload(filePath, file, { upsert: true, contentType: 'text/plain' });
                } catch (err) {
                    toast.show('Supabase upload failed (network/client error)', 'error');
                    console.error('[Supabase Upload] Network/client error:', err);
                    return;
                }
                const { data, error } = uploadResult || {};
                if (error) {
                    toast.show('Failed to upload file to Supabase', 'error');
                    console.error('[Supabase Upload] API error:', error);
                    return;
                }
                // Schedule deletion after 5 minutes
                setTimeout(async () => {
                    try {
                        await window.supabaseClient.storage.from('user-txt-uploads').remove([filePath]);
                        console.log('[Supabase] File deleted after 5 minutes:', filePath);
                    } catch (delErr) {
                        console.error('[Supabase Delete] Error deleting file after timer:', delErr);
                    }
                }, 5 * 60 * 1000);
                // Show file chip and store extracted text
                attachedFileName = file.name;
                attachedFileText = text;
                fileChipName.textContent = file.name;
                fileChip.style.display = 'inline-flex';
                toast.show('Text extracted from file. Ready to send.', 'success');
                console.log('[File Attachment] .txt file processed, uploaded, and chip shown:', filePath);
            } catch (err) {
                // General error catch
                toast.show('Unexpected error during file processing', 'error');
                if (err && err.name && err.message) {
                    console.error(`[File Attachment][${err.name}] ${err.message}`, err);
                } else {
                    console.error('[File Attachment] Unknown error:', err);
                }
            }
        };
        reader.onerror = function (evt) {
            toast.show('Error reading file', 'error');
            console.error('[FileReader] Error reading file:', evt);
        };
        reader.readAsText(file);
    });

    // Remove file chip
    removeFileChipBtn.addEventListener('click', () => {
        attachedFileName = null;
        attachedFileText = null;
        fileChip.style.display = 'none';
    });
}

// Override sendMessage to handle file chip logic
async function sendMessage() {
    const input = elements.messageInput.value.trim();
    
    // Only send if there's user input or attached file
    if (!input && !attachedFileText) return;
    if (chatManager.isProcessing) return;

    // Stop voice recognition if it's active
    if (window.voiceRecognition && window.voiceRecognition.isListening) {
        window.voiceRecognition.stopListening();
    }

    // Create new conversation if none exists
    if (!chatState.currentConversationId) {
        console.log('🔄 Creating new conversation before sending message...');
        await chatState.createNewConversation();
        updateConversationsList();
        console.log('✅ New conversation created:', chatState.currentConversationId);
    }

    // Clear input and file chip
    elements.messageInput.value = '';
    elements.messageInput.style.height = 'auto';
    
    // Store file text for background processing
    const fileTextForAI = attachedFileText;
    if (attachedFileText) {
        attachedFileName = null;
        attachedFileText = null;
        const fileChip = document.getElementById('fileChip');
        if (fileChip) fileChip.style.display = 'none';
    }

    // Send message with user input only in the prompt, but include file text in background
    if (fileTextForAI) {
        // Create enhanced prompt that includes file content but shows only user input
        const enhancedPrompt = input + (input ? '\n\n--- File Content ---\n' + fileTextForAI : fileTextForAI);
        await chatManager.sendMessage(enhancedPrompt, chatState.selectedModel);
    } else {
        // No file attached, send user input as is
        await chatManager.sendMessage(input, chatState.selectedModel);
    }
}

// Initialize file attachment after DOM is ready
window.addEventListener('DOMContentLoaded', initializeFileAttachment);

// File Attachment State
let attachedFileText = null;
let attachedFileName = null;
let attachedFiles = [];
// attachedFiles: [{ name: string, text: string, file: File, filePath: string }]

function initializeFileAttachment() {
    const attachmentBtn = document.getElementById('attachmentBtn');
    const txtFileInput = document.getElementById('txtFileInput');
    const fileTypeWarning = document.getElementById('fileTypeWarning');
    const fileChipContainer = document.getElementById('fileChipContainer');

    if (!attachmentBtn || !txtFileInput || !fileTypeWarning || !fileChipContainer) return;

    // Show warning card when attachment button is clicked
    attachmentBtn.addEventListener('click', () => {
        fileTypeWarning.style.display = 'flex';
        setTimeout(() => { fileTypeWarning.style.display = 'none'; }, 3000);
        txtFileInput.value = '';
        txtFileInput.click();
    });

    // Handle file selection (multiple files)
    txtFileInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        let newFiles = [];
        for (const file of files) {
            if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
                toast.show('Files other than .txt file extension are not accepted currently', 'warning', 4000);
                console.warn('[File Validation] Non-txt file rejected:', file.name);
                continue;
            }
            // Prevent duplicate file names
            if (attachedFiles.some(f => f.name === file.name)) {
                toast.show(`File '${file.name}' is already attached.`, 'info');
                continue;
            }
            // Read file text
            const text = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = evt => resolve(evt.target.result);
                reader.onerror = evt => reject(evt);
                reader.readAsText(file);
            }).catch(err => {
                toast.show(`Failed to read file: ${file.name}`, 'error');
                console.error('[FileReader] Error reading file:', file.name, err);
                return null;
            });
            if (!text || typeof text !== 'string') continue;
            // Upload to Supabase
            if (!window.supabaseClient) {
                toast.show('Supabase not initialized', 'error');
                console.error('[Supabase] supabaseClient not available');
                continue;
            }
            const userEmail = window.supabaseDB.getCurrentUserEmail && window.supabaseDB.getCurrentUserEmail();
            if (!userEmail) {
                toast.show('You must be logged in to upload files', 'warning');
                console.warn('[Auth] User not logged in for file upload');
                continue;
            }
            const filePath = `user-txt-uploads/${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}_${file.name}`;
            let uploadResult;
            try {
                uploadResult = await window.supabaseClient.storage.from('user-txt-uploads').upload(filePath, file, { upsert: true, contentType: 'text/plain' });
            } catch (err) {
                toast.show('Supabase upload failed (network/client error)', 'error');
                console.error('[Supabase Upload] Network/client error:', err);
                continue;
            }
            const { error } = uploadResult || {};
            if (error) {
                toast.show('Failed to upload file to Supabase', 'error');
                console.error('[Supabase Upload] API error:', error);
                continue;
            }
            // Schedule deletion after 5 minutes
            setTimeout(async () => {
                try {
                    await window.supabaseClient.storage.from('user-txt-uploads').remove([filePath]);
                    console.log('[Supabase] File deleted after 5 minutes:', filePath);
                } catch (delErr) {
                    console.error('[Supabase Delete] Error deleting file after timer:', delErr);
                }
            }, 5 * 60 * 1000);
            newFiles.push({ name: file.name, text, file, filePath });
        }
        if (newFiles.length) {
            attachedFiles = attachedFiles.concat(newFiles);
            renderFileChips();
            toast.show('Text extracted from file(s). Ready to send.', 'success');
        }
    });

    // Render file chips
    function renderFileChips() {
        fileChipContainer.innerHTML = '';
        if (!attachedFiles.length) {
            fileChipContainer.style.display = 'none';
            return;
        }
        fileChipContainer.style.display = 'flex';
        attachedFiles.forEach((fileObj, idx) => {
            const chip = document.createElement('div');
            chip.className = 'file-chip';
            chip.innerHTML = `<i class="fas fa-file-alt"></i><span>${fileObj.name}</span>`;
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-file-chip-btn';
            removeBtn.title = 'Remove file';
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.onclick = () => {
                attachedFiles.splice(idx, 1);
                renderFileChips();
            };
            chip.appendChild(removeBtn);
            fileChipContainer.appendChild(chip);
        });
    }
}

// Override sendMessage to handle file chip logic (multiple files)
async function sendMessage() {
    const input = elements.messageInput.value.trim();
    
    // Only send if there's user input or attached files
    if (!input && !attachedFiles.length) return;
    if (chatManager.isProcessing) return;

    // Stop voice recognition if it's active
    if (window.voiceRecognition && window.voiceRecognition.isListening) {
        window.voiceRecognition.stopListening();
    }

    // Create new conversation if none exists
    if (!chatState.currentConversationId) {
        console.log('🔄 Creating new conversation before sending message...');
        await chatState.createNewConversation();
        updateConversationsList();
        console.log('✅ New conversation created:', chatState.currentConversationId);
    }

    // Clear input and file chips
    elements.messageInput.value = '';
    elements.messageInput.style.height = 'auto';
    
    // Store file texts for background processing
    const fileTextsForAI = attachedFiles.map(f => f.text);
    attachedFiles = [];
    const fileChipContainer = document.getElementById('fileChipContainer');
    if (fileChipContainer) fileChipContainer.style.display = 'none';

    // Send message with user input only in the prompt, but include file texts in background
    if (fileTextsForAI.length) {
        // Create enhanced prompt that includes file content but shows only user input
        const fileContent = fileTextsForAI.join('\n\n--- Next File ---\n\n');
        const enhancedPrompt = input + (input ? '\n\n--- File Content ---\n' + fileContent : fileContent);
        await chatManager.sendMessage(enhancedPrompt, chatState.selectedModel);
    } else {
        // No files attached, send user input as is
        await chatManager.sendMessage(input, chatState.selectedModel);
    }
}

// Initialize file attachment after DOM is ready
window.addEventListener('DOMContentLoaded', initializeFileAttachment);

// Debug function to test mobile APK detection (for development)
window.testMobileAPKDetection = function() {
    console.log('🔍 Mobile APK Detection Test:');
    console.log('User Agent:', navigator.userAgent);
    console.log('Is Mobile APK:', IS_MOBILE_APK);
    console.log('Speech Synthesis Available:', !!window.speechSynthesis);
    console.log('Voice Mode Buttons Hidden:', 
        document.getElementById('voiceModeBtnDesktop')?.style.display === 'none',
        document.getElementById('voiceModeBtnMobile')?.style.display === 'none'
    );
    console.log('Body has mobile APK attribute:', document.body.getAttribute('data-mobile-apk') === 'true');
    
    // Test voice features
    if (IS_MOBILE_APK) {
        console.log('✅ Voice features should be disabled');
    } else {
        console.log('ℹ️ Voice features should be available');
    }
};
