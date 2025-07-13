// SATI ChatBot - Main JavaScript File


//DELETE HERE BELOW
// Global State Management
let supabase = null;

// Initialize Supabase if credentials are available
function initializeSupabase() {
    try {
        console.log('🔄 Attempting to initialize Supabase...');
        console.log('window.supabase available:', !!window.supabase);
        console.log('SUPABASE_CONFIG:', window.SUPABASE_CONFIG);
        
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
            
            console.log('Supabase URL:', supabaseUrl);
            console.log('Supabase Key available:', !!supabaseKey);
            
            if (supabaseUrl && supabaseKey) {
                // Create Supabase client
                supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
                console.log('✅ Supabase client initialized successfully');
                console.log('Supabase client instance:', supabase);
                
                // Make supabase available globally for debugging
                window.supabaseClient = supabase;
                
                // Set up auth state listener (will be called later after function is defined)
                // We'll set up the listener in initializeApp after all functions are defined
                
                return true;
            } else {
                console.warn('⚠️ Supabase initialization failed - missing URL or KEY in SUPABASE_CONFIG');
                console.log('URL:', supabaseUrl, 'KEY:', supabaseKey ? 'present' : 'missing');
            }
        } else {
            console.warn('⚠️ Supabase initialization skipped - configuration not loaded or not configured');
            console.log('window.supabase:', !!window.supabase);
            console.log('SUPABASE_CONFIG:', window.SUPABASE_CONFIG);
            console.log('CONFIGURED:', window.SUPABASE_CONFIG?.CONFIGURED);
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
                if (session.user.app_metadata && session.user.app_metadata.provider) {
                    authProvider = session.user.app_metadata.provider;
                }
                // Update user state
                chatState.isLoggedIn = true;
                chatState.username = session.user.email ? session.user.email.split('@')[0] : session.user.id;
                chatState.email = session.user.email || '';
                chatState.authProvider = authProvider;
                chatState.saveState();
                // --- ADDED: Welcome console and popup (only on fresh login) ---
                if (localStorage.getItem('sati_show_welcome') === '1') {
                    console.log(`🎉 User '${chatState.username}' is now logged in!`);
                    toast.show(`Welcome, ${chatState.username}!`, 'success', 4000);
                    localStorage.removeItem('sati_show_welcome');
                }
                // --- END ADDED ---
                // Update login statistics
                updateLoginStats();
                // Hide login modal
                modal.hide('loginModal');
                // Update UI
                updateLoginStatus();
                // Show welcome modal with a slight delay to ensure UI is ready
                setTimeout(() => {
                    showWelcomeModal(chatState.username);
                }, 500);
                // Show success toast
                toast.show('Logged in successfully', 'success');
            } else if (event === 'SIGNED_OUT') {
                console.log('User signed out');
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
//DELETE HERE ABOVE


//delete here below
class ChatBotState {
    constructor() {
        this.conversations = JSON.parse(localStorage.getItem('sati_conversations') || '[]');
        this.currentConversationId = null;
        this.currentMessages = [];
        this.isLoggedIn = JSON.parse(localStorage.getItem('sati_logged_in') || 'false');
        this.username = localStorage.getItem('sati_username') || '';
        this.settings = JSON.parse(localStorage.getItem('sati_settings') || '{}');
        this.theme = localStorage.getItem('sati_theme') || 'dark';
        this.isTyping = false;
        this.selectedModel = localStorage.getItem('sati_selected_model') || 'llama-3.1-8b-instant';

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

        // Validate model selection - prevent Gemini 1.5 Pro from being selected
        this.validateModelSelection();
    }

    initializeDefaultSettings() {
        const defaultSettings = {
            general: {
                language: 'en',
                defaultChatName: 'auto',
                chatHistory: true,
                apiProvider: 'groq'
            },
            chat: {
                responseStyle: 'detailed',
                modelBehavior: 0.7,
                promptTone: 'friendly'
            },
            accessibility: {
                fontStyle: 'Inter',
                voiceInput: false,
                animations: true
            },
            notifications: {
                soundOnReply: false,
                chatHighlight: true
            },
            privacy: {
                dataCollection: false
            }
        };

        this.settings = { ...defaultSettings, ...this.settings };
        this.saveSettings();
    }

    saveState() {
        localStorage.setItem('sati_conversations', JSON.stringify(this.conversations));
        localStorage.setItem('sati_logged_in', JSON.stringify(this.isLoggedIn));
        localStorage.setItem('sati_username', this.username);
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

    validateModelSelection() {
        // Check if current model is Gemini 1.5 Pro with Gemini provider
        if (this.selectedModel === 'gemini-1.5-pro' && this.apiProvider === 'gemini') {
            // Switch to Gemini 1.5 Flash instead
            this.selectedModel = 'gemini-1.5-flash';
            this.saveState();
            console.log('⚠️ Gemini 1.5 Pro is not available yet. Switched to Gemini 1.5 Flash.');
        }
    }

    createNewConversation(title = 'New Chat') {
        const conversation = {
            id: Date.now().toString(),
            title: title,
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.conversations.unshift(conversation);
        this.currentConversationId = conversation.id;
        this.currentMessages = [];
        this.saveState();

        return conversation;
    }

    updateConversation(messages) {
        if (!this.currentConversationId) return;

        const conversation = this.conversations.find(c => c.id === this.currentConversationId);
        if (conversation) {
            conversation.messages = messages;
            conversation.updatedAt = new Date().toISOString();

            // Auto-generate title from first user message
            if (conversation.title === 'New Chat' && messages.length > 0) {
                const firstUserMessage = messages.find(m => m.role === 'user');
                if (firstUserMessage) {
                    conversation.title = firstUserMessage.content.substring(0, 50) +
                        (firstUserMessage.content.length > 50 ? '...' : '');
                }
            }

            this.saveState();
        }
    }

    deleteConversation(id) {
        this.conversations = this.conversations.filter(c => c.id !== id);
        if (this.currentConversationId === id) {
            this.currentConversationId = null;
            this.currentMessages = [];
        }
        this.saveState();
    }

    renameConversation(id, newTitle) {
        const conversation = this.conversations.find(c => c.id === id);
        if (conversation) {
            conversation.title = newTitle;
            conversation.updatedAt = new Date().toISOString();
            this.saveState();
            return true;
        }
        return false;
    }

    loadConversation(id) {
        const conversation = this.conversations.find(c => c.id === id);
        if (conversation) {
            this.currentConversationId = id;
            this.currentMessages = conversation.messages;
            return conversation;
        }
        return null;
    }
}
//delete here above

// Initialize global state
const chatState = new ChatBotState();

// Ensure API manager is initialized when the page loads
document.addEventListener('DOMContentLoaded', function () {
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

//delete here below
// DOM Elements
const elements = {
    // Sidebar
    sidebar: document.getElementById('sidebar'),
    sidebarToggle: document.getElementById('sidebarToggle'),
    newChatBtn: document.getElementById('newChatBtn'),
    resourcesBtn: document.getElementById('resourcesBtn'),
    searchInput: document.getElementById('searchInput'),
    conversationsList: document.getElementById('conversationsList'),

    // Main content
    chatTitle: document.getElementById('chatTitle'),
    chatMessages: document.getElementById('chatMessages'),
    typingIndicator: document.getElementById('typingIndicator'),
    messageInput: document.getElementById('messageInput'),
    sendBtn: document.getElementById('sendBtn'),
    stopBtn: document.getElementById('stopBtn'),
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
//delete here above

//delete here above
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

    parseMarkdown: (text) => {
        // Simple markdown parsing
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }
};
//delete here above


//delete here below
// Toast Notification System
class ToastManager {
    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        toast.innerHTML = `
            <div class="toast-icon">${icons[type]}</div>
            <div class="toast-message">${message}</div>
            <button class="toast-close">&times;</button>
        `;

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

        setTimeout(removeToast, duration);

        // Manual close
        toast.querySelector('.toast-close').addEventListener('click', removeToast);
    }
}
//delete here above

const toast = new ToastManager();

//delete here below
// Modal Management
class ModalManager {
    show(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    hide(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
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
//delete here above

const modal = new ModalManager();
//delete here above


//delete here below
// Chat Management
class ChatManager {
    constructor() {
        this.isProcessing = false;
        this.shouldStop = false;
        this.currentController = null;
    }

    async sendMessage(content, model) {
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

        // Add user message
        const userMessage = {
            id: utils.generateId(),
            role: 'user',
            content: content,
            timestamp: new Date().toISOString()
        };

        chatState.currentMessages.push(userMessage);
        this.renderMessages();
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
            chatState.updateConversation(chatState.currentMessages);

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
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'message bot-message';
        welcomeMessage.innerHTML = `
            <div class="message-avatar">
                <div class="bot-avatar">
                    <i class="fas fa-robot"></i>
                </div>
            </div>
            <div class="message-content">
                <div class="message-text">
                    <h3>🎓 Hello! I'm your SATI AI Assistant</h3>
                    <p>I'm specialized in providing information about <strong>Samrat Ashok Technological Institute (SATI), Vidisha</strong>. I can help you with:</p>
                    <ul>
                        <li>📚 Academic programs and courses</li>
                        <li>🏠 Hostel and campus facilities</li>
                        <li>💼 Placement statistics and career opportunities</li>
                        <li>🎯 Admission procedures and requirements</li>
                        <li>🏆 Student activities and clubs</li>
                        <li>📖 Institute history and achievements</li>
                    </ul>
                    <p><strong>What would you like to know about SATI?</strong></p>
                </div>
                <div class="message-timestamp">Just now</div>
                <button class="copy-btn" title="Copy message" data-message-id="welcome">
                    <i class="fas fa-copy"></i>
                </button>
            </div>
        `;
        elements.chatMessages.appendChild(welcomeMessage);
    }

    createMessageElement(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.role}-message`;

        const isUser = message.role === 'user';
        const avatar = isUser ? '👤' : '<i class="fas fa-robot"></i>';
        const avatarClass = isUser ? 'user-avatar' : 'bot-avatar';

        messageDiv.innerHTML = `
            <div class="message-avatar">
                <div class="${avatarClass}">${avatar}</div>
            </div>
            <div class="message-content">
                <div class="message-text">${utils.parseMarkdown(utils.escapeHtml(message.content))}</div>
                <div class="message-timestamp">${utils.formatTime(message.timestamp)}</div>
                <button class="copy-btn" title="Copy message" data-message-id="${message.id}">
                    <i class="fas fa-copy"></i>
                </button>
            </div>
        `;

        return messageDiv;
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

I'm specialized in providing information about Samrat Ashok Technological Institute (SATI), Vidisha. I can help you with:

• Academic programs and courses
• Hostel and campus facilities
• Placement statistics and career opportunities
• Admission procedures and requirements
• Student activities and clubs
• Institute history and achievements

What would you like to know about SATI?`;
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

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sati_chat_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.show('Chat exported successfully', 'success');
    }
}

const chatManager = new ChatManager();

// Conversation Management
function updateConversationsList() {
    const container = elements.conversationsList;
    container.innerHTML = '';

    if (chatState.conversations.length === 0) {
        container.innerHTML = '<div class="no-conversations">No conversations yet</div>';
        return;
    }

    chatState.conversations.forEach(conversation => {
        const item = document.createElement('div');
        item.className = `conversation-item ${conversation.id === chatState.currentConversationId ? 'active' : ''}`;

        item.innerHTML = `
            <div class="conversation-title">${conversation.title}</div>
            <div class="conversation-actions">
                <button class="conversation-menu-btn" onclick="toggleConversationMenu(event, '${conversation.id}')" title="More options">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
                <div class="conversation-dropdown" id="dropdown-${conversation.id}">
                    <button class="conversation-dropdown-item" onclick="renameConversation('${conversation.id}')">
                        <i class="fas fa-edit"></i>
                        <span>Rename</span>
                    </button>
                    <button class="conversation-dropdown-item danger" onclick="deleteConversation('${conversation.id}')">
                        <i class="fas fa-trash"></i>
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        `;

        item.addEventListener('click', (e) => {
            if (!e.target.closest('.conversation-action')) {
                loadConversation(conversation.id);
            }
        });

        container.appendChild(item);
    });
}
//delete here above


//delete here below
function loadConversation(id) {
    const conversation = chatState.loadConversation(id);
    if (conversation) {
        elements.chatTitle.textContent = conversation.title;
        chatManager.renderMessages();
        updateConversationsList();

        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            toggleSidebar();
        }
    }
}
//delete here above


//delete here below
async function deleteConversation(id) {
    const confirmed = await modal.confirm(
        'Delete Conversation',
        'Are you sure you want to delete this conversation? This action cannot be undone.'
    );

    if (confirmed) {
        chatState.deleteConversation(id);
        updateConversationsList();

        if (chatState.currentConversationId === id) {
            chatManager.clearChat();
        }

        toast.show('Conversation deleted', 'success');
    }
}
//delete here above

//delete here below
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
//delete here above


// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
    if (!event.target.closest('.conversation-actions')) {
        document.querySelectorAll('.conversation-dropdown.show').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }
});


//delete here below
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
//delete here above

//delete here below
// Handle rename form submission
function handleRenameSubmit(event) {
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
    const success = chatState.renameConversation(conversationId, newTitle);
    if (success) {
        // Update UI
        updateConversationsList();

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
//delete here above


//delete here below
// Settings Management
function renderSettingsContent(tab) {
    const content = document.getElementById('settingsContent');
    const settingsModal = document.querySelector('.settings-modal');

    // Remove all tab-specific classes
    if (settingsModal) {
        settingsModal.classList.remove('tab-general', 'tab-chat', 'tab-accessibility', 'tab-notifications', 'tab-privacy');
        // Add current tab class
        settingsModal.classList.add(`tab-${tab}`);
    }

    switch (tab) {
        case 'general':
            content.innerHTML = `
                <div class="form-section">
                    <h3>API Configuration</h3>
                    <div class="form-row">
                        <div class="form-col">
                            <label>API Provider</label>
                            <select class="form-control" id="apiProviderSetting">
                                <option value="groq">☁️ Groq (Recommended)</option>
                                <option value="gemini">🧠 Google Gemini</option>
                            </select>
                        </div>
                        <div class="form-col">
                            <label>AI Model</label>
                            <select class="form-control" id="aiModelSetting">
                                <!-- Options will be populated dynamically -->
                            </select>
                        </div>
                    </div>
                    

                </div>
                
                <div class="form-section">
                    <h3>General Settings</h3>
                    <div class="form-row">
                        <div class="form-col">
                            <label>Preferred Language</label>
                            <select class="form-control" id="languageSetting">
                                <option value="en">English</option>
                                <option value="hi">Hindi</option>
                            </select>
                        </div>
                        <div class="form-col">
                            <label>Default Chat Name</label>
                            <select class="form-control" id="chatNameSetting">
                                <option value="auto">Auto-generate</option>
                                <option value="timestamp">Use timestamp</option>
                                <option value="custom">Custom prefix</option>
                            </select>
                        </div>
                    </div>
                    <div class="checkbox-group">
                        <div class="checkbox-item">
                            <input type="checkbox" id="chatHistorySetting" checked>
                            <label for="chatHistorySetting">Enable chat history</label>
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'chat':
            content.innerHTML = `
                <div class="form-section">
                    <h3>Chat Settings</h3>
                    <div class="form-row">
                        <div class="form-col">
                            <label>Response Style</label>
                            <select class="form-control" id="responseStyleSetting">
                                <option value="concise">Concise</option>
                                <option value="detailed">Detailed</option>
                                <option value="comprehensive">Comprehensive</option>
                            </select>
                        </div>
                        <div class="form-col">
                            <label>Prompt Tone</label>
                            <select class="form-control" id="promptToneSetting">
                                <option value="friendly">Friendly</option>
                                <option value="professional">Professional</option>
                                <option value="casual">Casual</option>
                            </select>
                        </div>
                    </div>
                    <div class="slider-group">
                        <div class="slider-label">
                            <span>Model Behavior (Creativity vs Accuracy)</span>
                            <span id="behaviorValue">0.7</span>
                        </div>
                        <input type="range" class="slider" id="behaviorSlider" min="0" max="1" step="0.1" value="0.7">
                    </div>
                </div>
            `;
            break;

        case 'accessibility':
            content.innerHTML = `
                <div class="form-section">
                    <h3>Accessibility</h3>
                    <div class="form-row">
                        <div class="form-col">
                            <label for="fontStyleSetting">Font Style</label>
                            <select class="form-control" id="fontStyleSetting">
                                <option value="Inter">Inter (Default)</option>
                                <option value="Arial">Arial</option>
                                <option value="Helvetica">Helvetica</option>
                                <option value="Georgia">Georgia</option>
                                <option value="Times New Roman">Times New Roman</option>
                                <option value="Courier New">Courier New</option>
                                <option value="Verdana">Verdana</option>
                                <option value="Trebuchet MS">Trebuchet MS</option>
                                <option value="Tahoma">Tahoma</option>
                                <option value="Palatino">Palatino</option>
                                <option value="Garamond">Garamond</option>
                                <option value="Comic Sans MS">Comic Sans MS</option>
                            </select>
                        </div>
                    </div>
                    <div class="checkbox-group">
                        <div class="checkbox-item">
                            <input type="checkbox" id="voiceInputSetting">
                            <label for="voiceInputSetting">Enable voice input</label>
                        </div>
                        <div class="checkbox-item">
                            <input type="checkbox" id="animationsSetting" checked>
                            <label for="animationsSetting">Enable animations</label>
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'notifications':
            content.innerHTML = `
                <div class="form-section">
                    <h3>Notification Settings</h3>
                    <div class="checkbox-group">
                        <div class="checkbox-item">
                            <input type="checkbox" id="soundOnReplySetting">
                            <label for="soundOnReplySetting">Sound on reply</label>
                        </div>
                        <div class="checkbox-item">
                            <input type="checkbox" id="chatHighlightSetting" checked>
                            <label for="chatHighlightSetting">Chat highlight notifications</label>
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'privacy':
            content.innerHTML = `
                <div class="form-section">
                    <h3>Privacy & Data</h3>
                    <div class="checkbox-group">
                        <div class="checkbox-item">
                            <input type="checkbox" id="dataCollectionSetting">
                            <label for="dataCollectionSetting">Allow data collection for improvements</label>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-col">
                            <button class="form-control" onclick="clearAllConversations()" style="background-color: var(--danger-color); color: white; border: none;">
                                Clear All Conversation History
                            </button>
                        </div>
                        <div class="form-col">
                            <button class="form-control" onclick="exportAllChats()" style="background-color: var(--accent-color); color: white; border: none;">
                                Export All Chat History
                            </button>
                        </div>
                    </div>
                </div>
            `;
            break;
    }

    // Load current settings
    loadSettingsValues();

    // Add event listeners for settings changes
    addSettingsEventListeners();
}
//delete here above


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


//delete here below
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
//delete here above


//delete here below
function loadSettingsValues() {
    // Load values from chatState.settings
    const settings = chatState.settings;

    // General settings
    const languageSetting = document.getElementById('languageSetting');
    if (languageSetting) languageSetting.value = settings.general?.language || 'en';

    const chatNameSetting = document.getElementById('chatNameSetting');
    if (chatNameSetting) chatNameSetting.value = settings.general?.defaultChatName || 'auto';

    const chatHistorySetting = document.getElementById('chatHistorySetting');
    if (chatHistorySetting) chatHistorySetting.checked = settings.general?.chatHistory !== false;

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

    // Load API keys


    // Chat settings
    const responseStyleSetting = document.getElementById('responseStyleSetting');
    if (responseStyleSetting) responseStyleSetting.value = settings.chat?.responseStyle || 'detailed';

    const promptToneSetting = document.getElementById('promptToneSetting');
    if (promptToneSetting) promptToneSetting.value = settings.chat?.promptTone || 'friendly';

    const behaviorSlider = document.getElementById('behaviorSlider');
    const behaviorValue = document.getElementById('behaviorValue');
    if (behaviorSlider && behaviorValue) {
        behaviorSlider.value = settings.chat?.modelBehavior || 0.7;
        behaviorValue.textContent = behaviorSlider.value;
    }

    // Accessibility settings
    const fontStyleSetting = document.getElementById('fontStyleSetting');
    if (fontStyleSetting) {
        fontStyleSetting.value = settings.accessibility?.fontStyle || 'Inter';
    }

    const voiceInputSetting = document.getElementById('voiceInputSetting');
    if (voiceInputSetting) voiceInputSetting.checked = settings.accessibility?.voiceInput || false;

    const animationsSetting = document.getElementById('animationsSetting');
    if (animationsSetting) animationsSetting.checked = settings.accessibility?.animations !== false;

    // Notification settings
    const soundOnReplySetting = document.getElementById('soundOnReplySetting');
    if (soundOnReplySetting) soundOnReplySetting.checked = settings.notifications?.soundOnReply || false;

    const chatHighlightSetting = document.getElementById('chatHighlightSetting');
    if (chatHighlightSetting) chatHighlightSetting.checked = settings.notifications?.chatHighlight !== false;

    // Privacy settings
    const dataCollectionSetting = document.getElementById('dataCollectionSetting');
    if (dataCollectionSetting) dataCollectionSetting.checked = settings.privacy?.dataCollection || false;
}
//delete here above


//delete here below
function addSettingsEventListeners() {
    // Add event listeners for all settings controls
    const settingsControls = document.querySelectorAll('#settingsContent input, #settingsContent select');

    settingsControls.forEach(control => {
        // Skip special controls that have their own handlers to prevent duplicate events
        if (control.id === 'apiProviderSetting' || control.id === 'aiModelSetting' || control.id === 'fontStyleSetting') {
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

    // Font style handling for accessibility
    const fontStyleSetting = document.getElementById('fontStyleSetting');
    if (fontStyleSetting) {
        fontStyleSetting.addEventListener('change', (e) => {
            const selectedFont = e.target.value;
            document.documentElement.style.setProperty('--font-family', `'${selectedFont}', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`);
            toast.show(`Font changed to ${selectedFont}`, 'success');
            saveSettingsFromForm();
        });
    }


}
//delete here above


//delete here below
function saveSettingsFromForm() {
    // Save all settings from form to chatState.settings
    const settings = chatState.settings;

    // General settings
    const languageSetting = document.getElementById('languageSetting');
    if (languageSetting) settings.general.language = languageSetting.value;

    const chatNameSetting = document.getElementById('chatNameSetting');
    if (chatNameSetting) settings.general.defaultChatName = chatNameSetting.value;

    const chatHistorySetting = document.getElementById('chatHistorySetting');
    if (chatHistorySetting) settings.general.chatHistory = chatHistorySetting.checked;

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

    // Chat settings
    const responseStyleSetting = document.getElementById('responseStyleSetting');
    if (responseStyleSetting) settings.chat.responseStyle = responseStyleSetting.value;

    const promptToneSetting = document.getElementById('promptToneSetting');
    if (promptToneSetting) settings.chat.promptTone = promptToneSetting.value;

    const behaviorSlider = document.getElementById('behaviorSlider');
    if (behaviorSlider) settings.chat.modelBehavior = parseFloat(behaviorSlider.value);

    // Accessibility settings
    const fontStyleSetting = document.getElementById('fontStyleSetting');
    if (fontStyleSetting) settings.accessibility.fontStyle = fontStyleSetting.value;

    const voiceInputSetting = document.getElementById('voiceInputSetting');
    if (voiceInputSetting) settings.accessibility.voiceInput = voiceInputSetting.checked;

    const animationsSetting = document.getElementById('animationsSetting');
    if (animationsSetting) settings.accessibility.animations = animationsSetting.checked;

    // Notification settings
    const soundOnReplySetting = document.getElementById('soundOnReplySetting');
    if (soundOnReplySetting) settings.notifications.soundOnReply = soundOnReplySetting.checked;

    const chatHighlightSetting = document.getElementById('chatHighlightSetting');
    if (chatHighlightSetting) settings.notifications.chatHighlight = chatHighlightSetting.checked;

    // Privacy settings
    const dataCollectionSetting = document.getElementById('dataCollectionSetting');
    if (dataCollectionSetting) settings.privacy.dataCollection = dataCollectionSetting.checked;

    chatState.saveSettings();
    toast.show('Settings saved', 'success');
}

//delete here below
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
//delete here above

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


//delete here below
// Function to update model selection visibility based on API provider (legacy function - keeping for compatibility)
function updateModelSelectionVisibility() {
    updateMainModelSelect();
}
//delete here above


//delete here below
// Customize Appearance
function renderCustomizeContent() {
    const content = document.getElementById('customizeContent');

    content.innerHTML = `
        <div class="form-section">
            <h3>Theme</h3>
            <div class="radio-group">
                <div class="radio-item">
                    <input type="radio" id="lightTheme" name="theme" value="light" ${chatState.theme === 'light' ? 'checked' : ''}>
                    <label for="lightTheme">Light</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="darkTheme" name="theme" value="dark" ${chatState.theme === 'dark' ? 'checked' : ''}>
                    <label for="darkTheme">Dark</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="systemTheme" name="theme" value="system" ${chatState.theme === 'system' ? 'checked' : ''}>
                    <label for="systemTheme">System Default</label>
                </div>
            </div>
        </div>
        
        <div class="form-section">
            <h3>Accent Color</h3>
            <div class="color-picker-group">
                <div class="color-option selected" style="background-color: #10a37f;" data-color="#10a37f"></div>
                <div class="color-option" style="background-color: #3182ce;" data-color="#3182ce"></div>
                <div class="color-option" style="background-color: #e53e3e;" data-color="#e53e3e"></div>
                <div class="color-option" style="background-color: #ed8936;" data-color="#ed8936"></div>
                <div class="color-option" style="background-color: #38a169;" data-color="#38a169"></div>
                <div class="color-option" style="background-color: #805ad5;" data-color="#805ad5"></div>
            </div>
        </div>
        
        <div class="form-section">
            <h3>Font Options</h3>
            <div class="form-row">
                <div class="form-col">
                    <div class="slider-group">
                        <div class="slider-label">
                            <span>Font Size</span>
                            <span id="customizeFontSizeValue">16px</span>
                        </div>
                        <input type="range" class="slider" id="customizeFontSizeSlider" min="12" max="24" value="16">
                    </div>
                </div>
            </div>
        </div>
        
        <div class="form-section">
            <h3>Layout Options</h3>
            <div class="radio-group">
                <div class="radio-item">
                    <input type="radio" id="compactLayout" name="layout" value="compact">
                    <label for="compactLayout">Compact</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="comfortableLayout" name="layout" value="comfortable" checked>
                    <label for="comfortableLayout">Comfortable</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="expandedLayout" name="layout" value="expanded">
                    <label for="expandedLayout">Expanded</label>
                </div>
            </div>
        </div>
    `;

    // Add event listeners
    addCustomizeEventListeners();
}
//delete here above


//delete here below
function addCustomizeEventListeners() {
    // Theme selection
    const themeRadios = document.querySelectorAll('input[name="theme"]');
    themeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            chatState.theme = e.target.value;
            chatState.applyTheme();
            chatState.saveState();
            updateThemeToggleButton();

            let message = 'Theme updated';
            if (e.target.value === 'system') {
                message = 'Theme set to system default';
            }
            toast.show(message, 'success');
        });
    });

    // Color selection
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            e.target.classList.add('selected');

            const color = e.target.dataset.color;
            document.documentElement.style.setProperty('--accent-color', color);
            toast.show('Accent color updated', 'success');
        });
    });

    // Font size slider
    const fontSizeSlider = document.getElementById('customizeFontSizeSlider');
    const fontSizeValue = document.getElementById('customizeFontSizeValue');
    if (fontSizeSlider && fontSizeValue) {
        fontSizeSlider.addEventListener('input', (e) => {
            fontSizeValue.textContent = e.target.value + 'px';
            document.documentElement.style.fontSize = e.target.value + 'px';
        });
    }
}
//delete here above


// Utility Functions for Settings
async function clearAllConversations() {
    const confirmed = await modal.confirm(
        'Clear All Conversations',
        'Are you sure you want to delete all conversations? This action cannot be undone.'
    );

    if (confirmed) {
        chatState.conversations = [];
        chatState.currentConversationId = null;
        chatState.currentMessages = [];
        chatState.saveState();

        updateConversationsList();
        chatManager.renderMessages();
        elements.chatTitle.textContent = 'New Chat';

        toast.show('All conversations cleared', 'success');
    }
}

function exportAllChats() {
    if (chatState.conversations.length === 0) {
        toast.show('No conversations to export', 'warning');
        return;
    }

    let content = 'SATI ChatBot - All Conversations Export\n';
    content += '='.repeat(60) + '\n\n';

    chatState.conversations.forEach((conversation, index) => {
        content += `Conversation ${index + 1}: ${conversation.title}\n`;
        content += `Created: ${new Date(conversation.createdAt).toLocaleString()}\n`;
        content += '-'.repeat(40) + '\n\n';

        conversation.messages.forEach(message => {
            const role = message.role === 'user' ? 'You' : 'SATI Bot';
            const time = utils.formatTime(message.timestamp);
            content += `[${time}] ${role}: ${message.content}\n\n`;
        });

        content += '\n' + '='.repeat(60) + '\n\n';
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sati_all_chats_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.show('All chats exported successfully', 'success');
}


//delete here below
// Event Listeners
function initializeEventListeners() {
    // Sidebar toggle
    if (elements.sidebarToggle) {
        elements.sidebarToggle.addEventListener('click', toggleSidebar);
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
        elements.newChatBtn.addEventListener('click', () => {
            chatState.createNewConversation();
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
            window.location.href = 'resources.html';

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
            renderSettingsContent('general');
            if (elements.profileDropdown) {
                elements.profileDropdown.classList.remove('show');
            }
        });
    }

    const customizeDropdownBtn = document.getElementById('customizeDropdownBtn');
    if (customizeDropdownBtn) {
        customizeDropdownBtn.addEventListener('click', () => {
            modal.show('customizeModal');
            renderCustomizeContent();
            if (elements.profileDropdown) {
                elements.profileDropdown.classList.remove('show');
            }
        });
    }

    const languageBtn = document.getElementById('languageBtn');
    if (languageBtn) {
        languageBtn.addEventListener('click', () => {
            toast.show('Language selection coming soon', 'info');
            if (elements.profileDropdown) {
                elements.profileDropdown.classList.remove('show');
            }
        });
    }

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            // Cycle through themes: light -> dark -> system -> light
            if (chatState.theme === 'light') {
                chatState.theme = 'dark';
            } else if (chatState.theme === 'dark') {
                chatState.theme = 'system';
            } else {
                chatState.theme = 'light';
            }

            chatState.applyTheme();
            chatState.saveState();
            updateThemeToggleButton();

            if (elements.profileDropdown) {
                elements.profileDropdown.classList.remove('show');
            }

            let message = `Switched to ${chatState.theme} mode`;
            if (chatState.theme === 'system') {
                message = 'Switched to system default theme';
            }
            toast.show(message, 'success');
        });
    }

    const loginLogoutBtn = document.getElementById('loginLogoutBtn');
    if (loginLogoutBtn) {
        loginLogoutBtn.addEventListener('click', () => {
            if (chatState.isLoggedIn) {
                logout();
            } else {
                modal.show('loginModal');
                setTimeout(addSSOEventListeners, 0); // Ensure DOM is updated before attaching listeners
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
            toast.show('Saved chats feature coming soon', 'info');
        });
    }

    const promptLibraryBtn = document.getElementById('promptLibraryBtn');
    if (promptLibraryBtn) {
        promptLibraryBtn.addEventListener('click', () => {
            toast.show('Prompt library feature coming soon', 'info');
        });
    }

    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            modal.show('settingsModal');
            renderSettingsContent('general');
        });
    }

    const customizeBtn = document.getElementById('customizeBtn');
    if (customizeBtn) {
        customizeBtn.addEventListener('click', () => {
            modal.show('customizeModal');
            renderCustomizeContent();
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

    const closeCustomizeBtn = document.getElementById('closeCustomizeBtn');
    if (closeCustomizeBtn) {
        closeCustomizeBtn.addEventListener('click', () => {
            modal.hide('customizeModal');
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
            renderSettingsContent(tab.dataset.tab);
        }
    });

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            login();
        });
    }

    // Sign up button
    const signupBtn = document.getElementById('signupBtn');
    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            signup();
        });
    }
    
    const guestBtn = document.getElementById('guestBtn');
    if (guestBtn) {
        guestBtn.addEventListener('click', () => {
            modal.hide('loginModal');
            toast.show('Continuing as guest', 'info');
        });
    }

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
    
    const exportDataBtn = document.getElementById('exportDataBtn');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', () => {
            exportUserData();
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

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            elements.searchInput.focus();
        }

        // Ctrl/Cmd + N for new chat
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            elements.newChatBtn.click();
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

    // Voice input (placeholder)
    const micBtn = document.getElementById('micBtn');
    if (micBtn) {
        micBtn.addEventListener('click', () => {
            toast.show('Voice input feature coming soon', 'info');
        });
    }

    // Attachment button (placeholder)
    const attachmentBtn = document.getElementById('attachmentBtn');
    if (attachmentBtn) {
        attachmentBtn.addEventListener('click', () => {
            toast.show('File attachment feature coming soon', 'info');
        });
    }

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
//delete here above

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

    // Create new conversation if none exists
    if (!chatState.currentConversationId) {
        chatState.createNewConversation();
        updateConversationsList();
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

        toast.show('Creating account...', 'info', 2000);
        
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
            chatState.isLoggedIn = true;
            chatState.username = data.user.email.split('@')[0];
            chatState.email = data.user.email;
            chatState.authProvider = 'email';
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

async function login() {
    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Basic validation
        if (!email || !password) {
            return toast.show('Please enter both email and password', 'error');
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
                    
                    // Handle different error types
                    if (error.message.includes('Invalid login credentials')) {
                        toast.show('Invalid email or password. Please try again or sign up for a new account.', 'error', 4000);
                    } else if (error.message.includes('Email not confirmed')) {
                        toast.show('Please confirm your email address before logging in. Check your inbox for a confirmation link.', 'warning', 5000);
                    } else {
                        toast.show('Login failed: ' + error.message, 'error');
                    }
                    return;
                }

                // Login successful
                chatState.isLoggedIn = true;
                chatState.username = data.user.email.split('@')[0];
                chatState.email = data.user.email;
                chatState.authProvider = 'email';
                chatState.saveState();
                // Set flag for welcome toast/console
                localStorage.setItem('sati_show_welcome', '1');

                // Update login statistics
                updateLoginStats();

                // Hide login modal
                modal.hide('loginModal');
                
                // Update UI
                updateLoginStatus();
                
                // Show welcome modal with a slight delay to ensure UI is ready
                setTimeout(() => {
                    showWelcomeModal(chatState.username);
                }, 500);
                
                // Show success toast
                toast.show('Logged in successfully', 'success');
                
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

// Simple fallback login when Supabase is not available
function fallbackLogin(email) {
    chatState.isLoggedIn = true;
    chatState.username = email.split('@')[0];
    chatState.email = email;
    chatState.authProvider = 'email';
    chatState.saveState();
    // Set flag for welcome toast/console
    localStorage.setItem('sati_show_welcome', '1');

    // Update login statistics
    updateLoginStats();

    // Hide login modal
    modal.hide('loginModal');
    
    // Update UI
    updateLoginStatus();
    
    // Show welcome modal with a slight delay to ensure UI is ready
    setTimeout(() => {
        showWelcomeModal(chatState.username);
    }, 500);
    
    // Show success toast
    toast.show('Logged in as guest with username: ' + chatState.username, 'success');
}

// Update login statistics
function updateLoginStats() {
    // Update last login time
    localStorage.setItem('sati_last_login', new Date().toISOString());
    
    // Increment login count
    const currentCount = parseInt(localStorage.getItem('sati_login_count') || '0');
    localStorage.setItem('sati_login_count', (currentCount + 1).toString());
}

// Export user data from profile
function exportUserData() {
    try {
        // Collect user data
        const userData = {
            profile: {
                username: chatState.username || 'Guest',
                email: chatState.email || 'No email provided',
                isLoggedIn: chatState.isLoggedIn,
                authProvider: chatState.authProvider || 'none',
                lastLogin: localStorage.getItem('sati_last_login') || new Date().toISOString(),
                loginCount: parseInt(localStorage.getItem('sati_login_count') || '0')
            },
            stats: {
                conversationCount: chatState.conversations.length,
                messageCount: chatState.conversations.reduce((total, conv) => {
                    return total + (conv.messages ? conv.messages.length : 0);
                }, 0),
                modelUsage: {}
            },
            settings: chatState.settings,
            theme: chatState.theme,
            exportDate: new Date().toISOString()
        };
        
        // Count model usage
        chatState.conversations.forEach(conv => {
            if (conv.messages) {
                conv.messages.forEach(msg => {
                    if (msg.model) {
                        userData.stats.modelUsage[msg.model] = (userData.stats.modelUsage[msg.model] || 0) + 1;
                    }
                });
            }
        });
        
        // Create JSON file
        const dataStr = JSON.stringify(userData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        // Create download link
        const exportFileDefaultName = `sati_user_data_${chatState.username || 'guest'}_${new Date().toISOString().split('T')[0]}.json`;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        toast.show('User data exported successfully', 'success');
    } catch (err) {
        console.error('Error exporting user data:', err);
        toast.show('Failed to export user data', 'error');
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

// Make the function available globally
window.resendConfirmationEmail = resendConfirmationEmail;

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
            
            // Set the first letter of username as the avatar text
            const avatarText = elements.profileAvatar.querySelector('.avatar-text');
            if (avatarText && chatState.username) {
                avatarText.textContent = chatState.username.charAt(0).toUpperCase();
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
            
            // Reset avatar text
            const avatarText = elements.profileAvatar.querySelector('.avatar-text');
            if (avatarText) {
                avatarText.textContent = '?';
            }
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
    const profileChatCount = document.getElementById('profileChatCount');
    const profileMessageCount = document.getElementById('profileMessageCount');
    const profileLoginCount = document.getElementById('profileLoginCount');
    const profileAccountType = document.getElementById('profileAccountType');
    const profileLoginMethod = document.getElementById('profileLoginMethod');
    const profileLastLogin = document.getElementById('profileLastLogin');
    const profileAvatarLarge = document.getElementById('profileAvatarLarge');
    const profileActions = document.getElementById('profileActions');
    
    // Update profile information
    if (chatState.isLoggedIn) {
        // Set username and email
        profileUsername.textContent = chatState.username || 'User';
        profileEmail.textContent = chatState.email || 'No email provided';
        
        // Set avatar with first letter of username
        if (profileAvatarLarge) {
            profileAvatarLarge.textContent = chatState.username.charAt(0).toUpperCase();
            profileAvatarLarge.style.backgroundColor = 'var(--accent-color)';
        }
        
        // Calculate stats
        const chatCount = chatState.conversations.length;
        let messageCount = 0;
        chatState.conversations.forEach(conv => {
            if (conv.messages) {
                messageCount += conv.messages.length;
            }
        });
        
        // Update stats
        profileChatCount.textContent = chatCount;
        profileMessageCount.textContent = messageCount;
        
        // Get login count from local storage or set default
        const loginCount = localStorage.getItem('sati_login_count') || 1;
        profileLoginCount.textContent = loginCount;
        
        // Set account details
        profileAccountType.textContent = 'Standard';
        
        // Determine login method
        let loginMethod = 'Email';
        if (chatState.authProvider) {
            if (chatState.authProvider === 'google') {
                loginMethod = 'Google';
            } else if (chatState.authProvider === 'github') {
                loginMethod = 'GitHub';
            }
        }
        profileLoginMethod.textContent = loginMethod;
        
        // Set last login date
        const lastLogin = localStorage.getItem('sati_last_login') || new Date().toISOString();
        const lastLoginDate = new Date(lastLogin);
        profileLastLogin.textContent = lastLoginDate.toLocaleDateString() + ' ' + lastLoginDate.toLocaleTimeString();
        
        // Update profile actions to show logout button
        if (profileActions) {
            profileActions.innerHTML = `
                <button class="btn btn-primary" onclick="exportUserData()">
                    <i class="fas fa-download"></i> Export Data
                </button>
                <button class="btn btn-danger" onclick="logout(); modal.hide('profileModal');">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            `;
        }
    } else {
        // Default values for logged out state
        profileUsername.textContent = 'Guest';
        profileEmail.textContent = 'Not logged in';
        
        // Set default avatar
        if (profileAvatarLarge) {
            profileAvatarLarge.textContent = '?';
            profileAvatarLarge.style.backgroundColor = 'var(--text-muted)';
        }
        
        profileChatCount.textContent = chatState.conversations.length;
        profileMessageCount.textContent = '0';
        profileLoginCount.textContent = '0';
        profileAccountType.textContent = 'Guest';
        profileLoginMethod.textContent = 'None';
        profileLastLogin.textContent = 'N/A';
        
        // Update profile actions to show login button
        if (profileActions) {
            profileActions.innerHTML = `
                <button class="btn btn-primary" onclick="modal.hide('profileModal'); modal.show('loginModal'); setTimeout(addSSOEventListeners, 0);">
                    <i class="fas fa-sign-in-alt"></i> Login
                </button>
            `;
        }
    }
    
    // Show the modal
    modal.show('profileModal');
}

// Show welcome modal with personalized greeting
function showWelcomeModal(username) {
    const welcomeUsername = document.getElementById('welcomeUsername');
    const welcomeHeading = document.getElementById('welcomeHeading');
    const welcomeMessage = document.getElementById('welcomeMessage');
    
    // Set username
    welcomeUsername.textContent = username || 'User';
    
    // Determine if this is first login or return user
    const isFirstLogin = !localStorage.getItem('sati_last_login');
    
    if (isFirstLogin) {
        welcomeHeading.textContent = `Welcome, ${username || 'User'}!`;
        welcomeMessage.textContent = 'Thank you for joining SATI ChatBot. We\'re here to help with all your academic needs.';
        
        // Show a welcome toast for first-time users
        showWelcomeToast(username, true);
    } else {
        welcomeHeading.textContent = `Welcome back, ${username || 'User'}!`;
        welcomeMessage.textContent = 'Great to see you again! Continue your conversations or start a new chat.';
        
        // Show a welcome back toast for returning users
        showWelcomeToast(username, false);
    }
    
    // Show the modal
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

// Update theme toggle button appearance
function updateThemeToggleButton() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        const icon = themeToggleBtn.querySelector('i');
        const text = themeToggleBtn.querySelector('span');

        if (icon && text) {
            if (chatState.theme === 'dark') {
                icon.className = 'fas fa-desktop';
                text.textContent = 'System Theme';
            } else if (chatState.theme === 'light') {
                icon.className = 'fas fa-moon';
                text.textContent = 'Dark Mode';
            } else if (chatState.theme === 'system') {
                icon.className = 'fas fa-sun';
                text.textContent = 'Light Mode';
            }
        }
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
            chatState.isLoggedIn = true;
            chatState.username = data.session.user.email.split('@')[0];
            chatState.email = data.session.user.email;
            chatState.authProvider = 'email';
            chatState.saveState();
            
            // Update UI
            updateLoginStatus();
            
            return true;
        }
        
        return false;
    } catch (err) {
        console.error('Session check error:', err);
        return false;
    }
}

// Handle email verification when user returns from email link
async function handleEmailVerification() {
    if (!supabase) return false;
    
    try {
        // Check if we have a hash in the URL that might be from email verification
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
                console.log('✅ Email verified successfully!');
                
                // Set user state
                chatState.isLoggedIn = true;
                chatState.username = data.session.user.email.split('@')[0];
                chatState.email = data.session.user.email;
                chatState.authProvider = 'email';
                chatState.saveState();
                
                // Update login statistics
                updateLoginStats();
                
                // Update UI
                updateLoginStatus();
                
                // Show welcome modal
                setTimeout(() => {
                    showWelcomeModal(chatState.username);
                    toast.show('Email verified successfully! Welcome to SATI ChatBot.', 'success', 5000);
                }, 500);
                
                // Clear the hash from URL to prevent reprocessing
                window.history.replaceState(null, null, window.location.pathname + window.location.search);
                
                return true;
            }
        }
        return false;
    } catch (err) {
        console.error('Email verification error:', err);
        return false;
    }
}

// Initialize Application
function initializeApp() {
    try {
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

        // Initialize event listeners
        initializeEventListeners();

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
window.debugSupabase = function() {
    console.log('=== SUPABASE DEBUG INFO ===');
    console.log('window.supabase (CDN):', !!window.supabase);
    console.log('supabase client instance:', !!supabase);
    console.log('window.supabaseClient:', !!window.supabaseClient);
    console.log('Supabase config:', window.SUPABASE_CONFIG);
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
window.forceInitializeSupabase = function() {
    console.log('🔄 Force initializing Supabase...');
    
    // Set fallback config if not already set
    if (!window.SUPABASE_CONFIG || !window.SUPABASE_CONFIG.CONFIGURED) {
        window.SUPABASE_CONFIG = {
            URL: 'https://zewtfqbomdqtaviipwhe.supabase.co',
            KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpld3RmcWJvbWRxdGF2aWlwd2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTE0OTAsImV4cCI6MjA2NzgyNzQ5MH0.Gn0QaS2DGGINVAqwjpYUXzH4HCnz7Bxh3EgPt_IjVJo',
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
window.testLogin = async function(email = 'test@example.com', password = 'testpassword123') {
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
window.testGoogleSSO = async function() {
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
window.testGitHubSSO = async function() {
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
window.testSupabaseAPI = async function() {
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
window.checkOAuthProviders = async function() {
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