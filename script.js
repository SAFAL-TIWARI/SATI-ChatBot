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
        const welcomeMessage = 'Hello! I\'m ready to chat with you. What would you like to know about SATI?';
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

    async sendMessage(content, model, isPromptSelection = false, displayContent = null) {
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

        // Add user message only if it's not a prompt selection
        if (!isPromptSelection) {
            const userMessage = {
                id: utils.generateId(),
                role: 'user',
                content: displayContent || content, // Use displayContent if provided, otherwise use full content
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
                        displayContent || content, // Save display content to Supabase, not the full content with file text
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
                const newTitle = content.substring(0, 50) + (content.length > 50 ? '...' : '');
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
            const response = await window.apiManager.sendMessage(content, this.currentController);

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

// File attachment functionality
let attachedFileContent = '';
let attachedFileName = '';

// Initialize file input event listeners
function initializeFileInput() {
    const attachmentBtn = document.getElementById('attachmentBtn');
    const txtFileInput = document.getElementById('txtFileInput');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');

    if (!attachmentBtn || !txtFileInput || !messageInput || !sendBtn) {
        console.warn('⚠️ File input elements not found');
        return;
    }

    // Handle attachment button click
    attachmentBtn.addEventListener('click', (e) => {
        e.preventDefault();
        txtFileInput.click();
    });

    // Handle file input change
    txtFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check if it's a text file
        if (!file.type.includes('text/') && !file.name.endsWith('.txt')) {
            toast.show('⚠️ Please select a .txt file only', 'warning', 3000);
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            attachedFileContent = event.target.result;
            attachedFileName = file.name;
            
            // Show file chip to indicate file is attached
            showFileChip(file.name);
            
            // Clear the file input
            txtFileInput.value = '';
            
            toast.show(`📎 File "${file.name}" attached successfully`, 'success', 3000);
        };
        
        reader.onerror = () => {
            toast.show('❌ Error reading file', 'error', 3000);
        };
        
        reader.readAsText(file);
    });

    // Handle send button click
    sendBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await handleSendMessage();
    });

    // Handle Enter key in message input
    messageInput.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            await handleSendMessage();
        }
    });
}

// Show file chip to indicate attached file
function showFileChip(fileName) {
    const fileChipContainer = document.getElementById('fileChipContainer');
    if (!fileChipContainer) return;

    fileChipContainer.innerHTML = `
        <div class="file-chip">
            <i class="fas fa-file-alt"></i>
            <span class="file-name">${fileName}</span>
            <button class="remove-file-chip-btn" onclick="removeAttachedFile()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    fileChipContainer.style.display = 'block';
}

// Remove attached file
function removeAttachedFile() {
    attachedFileContent = '';
    attachedFileName = '';
    
    const fileChipContainer = document.getElementById('fileChipContainer');
    if (fileChipContainer) {
        fileChipContainer.style.display = 'none';
        fileChipContainer.innerHTML = '';
    }
    
    toast.show('📎 File removed', 'info', 2000);
}

// Make removeAttachedFile available globally
window.removeAttachedFile = removeAttachedFile;

// Handle sending message with or without attached file
async function handleSendMessage() {
    const messageInput = document.getElementById('messageInput');
    if (!messageInput) return;

    const userInput = messageInput.value.trim();
    
    // Don't send if no input and no file
    if (!userInput && !attachedFileContent) {
        return;
    }

    // Prepare the content to send to AI
    let contentToSend = userInput;
    let displayContent = userInput;

    // If there's attached file content, append it to the AI message
    if (attachedFileContent) {
        const fileHeader = `\n\n--- File: ${attachedFileName} ---\n`;
        contentToSend += fileHeader + attachedFileContent;
        
        // Show file indicator in display content
        if (userInput) {
            displayContent += `\n\n📎 File attached: ${attachedFileName}`;
        } else {
            displayContent = `📎 File attached: ${attachedFileName}`;
        }
    }

    // Clear the input
    messageInput.value = '';
    
    // Remove attached file
    removeAttachedFile();

    // Send message using the existing chatManager
    if (window.chatManager) {
        await window.chatManager.sendMessage(contentToSend, chatState.selectedModel, false, displayContent);
    }
}

// Initialize file input when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for all elements to be available
    setTimeout(() => {
        initializeFileInput();
    }, 1000);
});

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
            if (selectedVoice) {
                utterance.voice = selectedVoice;
                console.log('🔊 Voice applied:', selectedVoice.name);
            } else {
                console.log('🔊 Selected voice not found, using default');
            }
            
            if (callback) callback();
        }, { once: true });
    } else {
        const selectedVoice = voices.find(voice => voice.name === selectedVoiceName);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
            console.log('🔊 Voice applied:', selectedVoice.name);
        } else {
            console.log('🔊 Selected voice not found, using default');
        }
        
        if (callback) callback();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements
    initializeElements();
    
    // Initialize file input functionality
    initializeFileInput();
    
    // Initialize voice recognition
    if (window.voiceRecognition) {
        window.voiceRecognition.initializeRecognition();
    }
    
    // Initialize voice mode
    if (window.voiceMode) {
        window.voiceMode.initializeVoiceMode();
    }
    
    // Initialize settings
    loadSettingsValues();
    addSettingsEventListeners();
    addVoiceSettingsEventListeners();
    
    // Initialize Supabase
    initializeSupabase();
    
    console.log('✅ Application initialized successfully');
});