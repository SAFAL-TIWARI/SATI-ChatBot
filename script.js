// SATI ChatBot - Main JavaScript File

// Global State Management
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
        
        // Apply theme
        this.applyTheme();
    }
    
    initializeDefaultSettings() {
        const defaultSettings = {
            general: {
                language: 'en',
                defaultChatName: 'auto',
                chatHistory: true
            },
            chat: {
                responseStyle: 'detailed',
                modelBehavior: 0.7,
                promptTone: 'friendly'
            },
            accessibility: {
                fontSize: 16,
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

// Initialize global state
const chatState = new ChatBotState();

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
    
    // Toast container
    toastContainer: document.getElementById('toastContainer')
};

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

const toast = new ToastManager();

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

const modal = new ModalManager();

// Chat Management
class ChatManager {
    constructor() {
        this.apiEndpoint = '/api/chat'; // This would be your backend endpoint
        this.isProcessing = false;
    }
    
    async sendMessage(content, model) {
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        chatState.isTyping = true;
        
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
            // Simulate API call (replace with actual API integration)
            const response = await this.simulateAPICall(content, model);
            
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
            
            const errorMessage = {
                id: utils.generateId(),
                role: 'assistant',
                content: '❌ Sorry, I encountered an error while processing your request. Please try again.',
                timestamp: new Date().toISOString()
            };
            
            chatState.currentMessages.push(errorMessage);
            toast.show('Failed to send message', 'error');
        } finally {
            this.isProcessing = false;
            chatState.isTyping = false;
            this.hideTypingIndicator();
            this.renderMessages();
            this.updateConversationsList();
        }
    }
    
    async simulateAPICall(content, model) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // SATI-specific responses based on content
        const responses = this.getSATIResponse(content);
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    getSATIResponse(content) {
        const lowerContent = content.toLowerCase();
        
        if (lowerContent.includes('admission') || lowerContent.includes('eligibility')) {
            return [
                "🎓 **SATI Admission Information:**\n\n**Undergraduate Programs (B.Tech):**\n- Eligibility: 12th with Physics, Chemistry, Mathematics\n- Entrance: JEE Main scores accepted\n- Total Seats: 480 across all branches\n\n**Key Branches:**\n- Computer Science & Engineering (120 seats)\n- Civil Engineering (60 seats)\n- Mechanical Engineering (60 seats)\n- Electronics & Communication (60 seats)\n\n**Application Process:**\n1. Online application through RGPV portal\n2. Document verification\n3. Counseling and seat allotment\n\nWould you like specific information about any branch or the admission timeline?"
            ];
        }
        
        if (lowerContent.includes('placement') || lowerContent.includes('job') || lowerContent.includes('career')) {
            return [
                "💼 **SATI Placement Highlights:**\n\n**Recent Statistics:**\n- Highest Package: ₹21 LPA\n- Average Package: ₹4.5 LPA\n- Placement Rate: 75%+\n\n**Top Recruiters:**\n- TCS, Infosys, Wipro\n- L&T, Bajaj Auto\n- Accenture, Cognizant\n- Various PSUs and Government organizations\n\n**Training & Development:**\n- Pre-placement training programs\n- Soft skills development\n- Technical interview preparation\n- Industry interaction sessions\n\nOur Training & Placement Cell works year-round to ensure students are industry-ready!"
            ];
        }
        
        if (lowerContent.includes('hostel') || lowerContent.includes('accommodation')) {
            return [
                "🏠 **SATI Hostel Facilities:**\n\n**Accommodation Details:**\n- 6 Hostels on campus\n- Boys Hostels: 325 capacity\n- Girls Hostels: 200 capacity\n- Well-furnished rooms with basic amenities\n\n**Facilities:**\n- 24/7 security\n- Common rooms with TV and indoor games\n- Mess facilities with nutritious meals\n- Wi-Fi connectivity\n- Medical facilities nearby\n- Laundry services\n\n**Hostel Fees:** Approximately ₹25,000-30,000 per year\n\nThe hostels provide a safe and conducive environment for academic growth and personal development."
            ];
        }
        
        if (lowerContent.includes('fee') || lowerContent.includes('cost') || lowerContent.includes('expense')) {
            return [
                "💰 **SATI Fee Structure:**\n\n**B.Tech Programs (Annual):**\n- Tuition Fee: ₹87,000\n- Development Fee: ₹10,000\n- Other Charges: ₹8,000\n- **Total: ₹1,05,000 per year**\n\n**Additional Costs:**\n- Hostel Fee: ₹25,000-30,000\n- Mess Charges: ₹30,000-35,000\n- Books & Supplies: ₹10,000-15,000\n\n**Scholarships Available:**\n- Merit-based scholarships\n- Government scholarships (SC/ST/OBC)\n- Financial assistance for economically weaker sections\n\nNote: Fees may vary slightly each year. Please check the official website for the most current information."
            ];
        }
        
        if (lowerContent.includes('course') || lowerContent.includes('branch') || lowerContent.includes('program')) {
            return [
                "📚 **SATI Academic Programs:**\n\n**Undergraduate (B.Tech) - 4 Years:**\n- Computer Science & Engineering (120 seats)\n- Civil Engineering (60 seats)\n- Mechanical Engineering (60 seats)\n- Electronics & Communication Engineering (60 seats)\n- Electrical & Instrumentation Engineering (60 seats)\n- Information Technology (60 seats)\n- Electronics & Instrumentation Engineering (60 seats)\n- Automobile Engineering (60 seats)\n- Chemical Engineering (60 seats)\n\n**Postgraduate (M.Tech) - 2 Years:**\n- 16 specializations available\n- Research-oriented programs\n- Industry collaboration projects\n\n**Key Features:**\n- NAAC & NBA accredited programs\n- Industry-relevant curriculum\n- Experienced faculty\n- Modern laboratories and workshops"
            ];
        }
        
        if (lowerContent.includes('faculty') || lowerContent.includes('teacher') || lowerContent.includes('professor')) {
            return [
                "👨‍🏫 **SATI Faculty Information:**\n\n**Faculty Strength:**\n- 150+ qualified faculty members\n- PhD holders: 60%+\n- Industry experience: 40%+\n- Student-faculty ratio: 15:1\n\n**Qualifications:**\n- Most faculty hold M.Tech/PhD degrees\n- Regular training and development programs\n- Research publications in reputed journals\n- Industry consultancy projects\n\n**Teaching Methodology:**\n- Interactive classroom sessions\n- Practical-oriented learning\n- Project-based assignments\n- Industry guest lectures\n- Modern teaching aids and technology\n\nOur faculty is committed to providing quality education and mentoring students for successful careers."
            ];
        }
        
        if (lowerContent.includes('library') || lowerContent.includes('book')) {
            return [
                "📖 **SATI Library Facilities:**\n\n**Collection:**\n- 70,000+ books and volumes\n- 200+ national and international journals\n- Digital library with e-resources\n- Reference books and competitive exam materials\n\n**Facilities:**\n- Spacious reading halls\n- Computer terminals with internet\n- Photocopying services\n- Book bank facility for students\n- Separate sections for different subjects\n\n**Timings:**\n- Monday to Saturday: 9:00 AM - 8:00 PM\n- Sunday: 10:00 AM - 6:00 PM\n- Extended hours during exams\n\n**Services:**\n- Online catalog system\n- Inter-library loan facility\n- Research assistance\n- Digital repository access"
            ];
        }
        
        if (lowerContent.includes('campus') || lowerContent.includes('facility') || lowerContent.includes('infrastructure')) {
            return [
                "🏛️ **SATI Campus & Infrastructure:**\n\n**Campus:**\n- 85-acre sprawling campus\n- Green and eco-friendly environment\n- Well-planned academic and residential blocks\n\n**Academic Infrastructure:**\n- Modern classrooms with smart boards\n- Well-equipped laboratories\n- Workshop facilities\n- Computer centers with latest software\n- Seminar halls and auditoriums\n\n**Other Facilities:**\n- Central library\n- Sports complex and gymnasium\n- Medical center\n- Cafeteria and food courts\n- Banking and ATM facilities\n- Transportation services\n- Wi-Fi enabled campus\n\n**Sports & Recreation:**\n- Cricket, football, basketball courts\n- Indoor games facilities\n- Annual sports meet and cultural events"
            ];
        }
        
        if (lowerContent.includes('history') || lowerContent.includes('founder') || lowerContent.includes('established')) {
            return [
                "🏛️ **SATI History & Legacy:**\n\n**Foundation:**\n- Established: November 1, 1960\n- Founder: Late Maharaja Jiwajirao Scindia\n- Foundation Stone: Laid by PM Jawaharlal Nehru (1962)\n- Inaugurated by: Dr. Rajendra Prasad (President of India)\n\n**Named After:** Emperor Ashoka the Great, who was governor in Ujjain and Vidisha\n\n**Historical Significance:**\n- One of the oldest engineering colleges in MP\n- Built under the 'Open Door' policy of Government of India\n- Funded by Gitanjali Trust Fund of the Scindias\n\n**Evolution:**\n- Initially affiliated to Vikram University, Ujjain\n- Later to Bhopal University (now Barkatullah University)\n- Since 1998: Affiliated to RGPV Bhopal\n- 2016: Received NAAC certification\n\n**Notable Alumni:** Including Nobel laureate Kailash Satyarthi"
            ];
        }
        
        // Default responses for general queries
        return [
            "Thank you for your question about SATI! I'm here to help you with information about Samrat Ashok Technological Institute. Could you please be more specific about what you'd like to know? I can provide details about:\n\n• 📚 Academic programs and courses\n• 🎯 Admission procedures\n• 💼 Placement statistics\n• 🏠 Hostel facilities\n• 💰 Fee structure\n• 🏛️ Campus infrastructure\n• 📖 Institute history\n• 👨‍🏫 Faculty information\n\nWhat specific aspect interests you most?",
            
            "Hello! I'm your SATI AI Assistant, specialized in providing comprehensive information about Samrat Ashok Technological Institute, Vidisha. I have detailed knowledge about our institute's programs, facilities, admissions, and much more.\n\nHow can I assist you today? Feel free to ask about any aspect of SATI - from academic programs to campus life!",
            
            "I'm here to help you learn more about SATI! As your dedicated institute guide, I can provide detailed information about:\n\n✅ All undergraduate and postgraduate programs\n✅ Admission requirements and procedures\n✅ Campus facilities and infrastructure\n✅ Placement opportunities and statistics\n✅ Student life and activities\n✅ Faculty and academic excellence\n\nWhat would you like to explore first?"
        ];
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
                <div class="bot-avatar">🎓</div>
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
            </div>
        `;
        elements.chatMessages.appendChild(welcomeMessage);
    }
    
    createMessageElement(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.role}-message`;
        
        const isUser = message.role === 'user';
        const avatar = isUser ? '👤' : '🎓';
        const avatarClass = isUser ? 'user-avatar' : 'bot-avatar';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <div class="${avatarClass}">${avatar}</div>
            </div>
            <div class="message-content">
                <div class="message-text">${utils.parseMarkdown(utils.escapeHtml(message.content))}</div>
                <div class="message-timestamp">${utils.formatTime(message.timestamp)}</div>
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
        content += '=' .repeat(50) + '\n\n';
        
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
                <button class="conversation-action" onclick="deleteConversation('${conversation.id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
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

// Settings Management
function renderSettingsContent(tab) {
    const content = document.getElementById('settingsContent');
    
    switch (tab) {
        case 'general':
            content.innerHTML = `
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
                            <input type="checkbox" id="chatHistorySetting">
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
                    <div class="slider-group">
                        <div class="slider-label">
                            <span>Font Size</span>
                            <span id="fontSizeValue">16px</span>
                        </div>
                        <input type="range" class="slider" id="fontSizeSlider" min="12" max="24" value="16">
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
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const fontSizeValue = document.getElementById('fontSizeValue');
    if (fontSizeSlider && fontSizeValue) {
        fontSizeSlider.value = settings.accessibility?.fontSize || 16;
        fontSizeValue.textContent = fontSizeSlider.value + 'px';
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

function addSettingsEventListeners() {
    // Add event listeners for all settings controls
    const settingsControls = document.querySelectorAll('#settingsContent input, #settingsContent select');
    
    settingsControls.forEach(control => {
        control.addEventListener('change', saveSettingsFromForm);
    });
    
    // Special handling for sliders
    const behaviorSlider = document.getElementById('behaviorSlider');
    if (behaviorSlider) {
        behaviorSlider.addEventListener('input', (e) => {
            document.getElementById('behaviorValue').textContent = e.target.value;
            saveSettingsFromForm();
        });
    }
    
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    if (fontSizeSlider) {
        fontSizeSlider.addEventListener('input', (e) => {
            document.getElementById('fontSizeValue').textContent = e.target.value + 'px';
            document.documentElement.style.fontSize = e.target.value + 'px';
            saveSettingsFromForm();
        });
    }
}

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
    
    // Chat settings
    const responseStyleSetting = document.getElementById('responseStyleSetting');
    if (responseStyleSetting) settings.chat.responseStyle = responseStyleSetting.value;
    
    const promptToneSetting = document.getElementById('promptToneSetting');
    if (promptToneSetting) settings.chat.promptTone = promptToneSetting.value;
    
    const behaviorSlider = document.getElementById('behaviorSlider');
    if (behaviorSlider) settings.chat.modelBehavior = parseFloat(behaviorSlider.value);
    
    // Accessibility settings
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    if (fontSizeSlider) settings.accessibility.fontSize = parseInt(fontSizeSlider.value);
    
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
                    <label>Font Style</label>
                    <select class="form-control" id="fontStyleSetting">
                        <option value="inter">Inter (Sans)</option>
                        <option value="serif">Times (Serif)</option>
                        <option value="mono">Monaco (Mono)</option>
                    </select>
                </div>
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
    content += '=' .repeat(60) + '\n\n';
    
    chatState.conversations.forEach((conversation, index) => {
        content += `Conversation ${index + 1}: ${conversation.title}\n`;
        content += `Created: ${new Date(conversation.createdAt).toLocaleString()}\n`;
        content += '-' .repeat(40) + '\n\n';
        
        conversation.messages.forEach(message => {
            const role = message.role === 'user' ? 'You' : 'SATI Bot';
            const time = utils.formatTime(message.timestamp);
            content += `[${time}] ${role}: ${message.content}\n\n`;
        });
        
        content += '\n' + '=' .repeat(60) + '\n\n';
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
            toast.show('Resources will add soon', 'info', 4000);
            
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
    
    // Model selection
    if (elements.modelSelect) {
        elements.modelSelect.addEventListener('change', (e) => {
            chatState.selectedModel = e.target.value;
            chatState.saveState();
            toast.show(`Switched to ${e.target.value}`, 'success');
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
            toast.show('Profile feature coming soon', 'info');
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
    // Remove existing trigger if any
    removeHoverTrigger();
    
    const hoverTrigger = document.createElement('div');
    hoverTrigger.className = 'sidebar-hover-trigger';
    hoverTrigger.id = 'sidebarHoverTrigger';
    
    const appContainer = document.getElementById('appContainer');
    appContainer.insertBefore(hoverTrigger, elements.sidebar);
    
    // Add hover event listeners for toggle button movement
    setupToggleHoverBehavior();
}

// Remove hover trigger element
function removeHoverTrigger() {
    const existingTrigger = document.getElementById('sidebarHoverTrigger');
    if (existingTrigger) {
        existingTrigger.remove();
    }
    // Clean up hover event listeners
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

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simple validation (replace with actual authentication)
    if (email && password) {
        chatState.isLoggedIn = true;
        chatState.username = email.split('@')[0];
        chatState.saveState();
        
        modal.hide('loginModal');
        updateLoginStatus();
        toast.show('Logged in successfully', 'success');
    } else {
        toast.show('Please enter valid credentials', 'error');
    }
}

function logout() {
    chatState.isLoggedIn = false;
    chatState.username = '';
    chatState.saveState();
    
    updateLoginStatus();
    toast.show('Logged out successfully', 'success');
}

function updateLoginStatus() {
    const loginLogoutBtn = document.getElementById('loginLogoutBtn');
    const icon = loginLogoutBtn.querySelector('i');
    const text = loginLogoutBtn.querySelector('span');
    
    if (chatState.isLoggedIn) {
        icon.className = 'fas fa-sign-out-alt';
        text.textContent = 'Logout';
    } else {
        icon.className = 'fas fa-sign-in-alt';
        text.textContent = 'Login';
    }
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
        // if (icon && text) {
        //     if (chatState.theme === 'dark') {
        //         icon.className = 'fas fa-sun';
        //         text.textContent = 'Light Mode';
        //     } else if (chatState.theme === 'light') {
        //         icon.className = 'fas fa-moon';
        //         text.textContent = 'Dark Mode';
        //     } else if (chatState.theme === 'system') {
        //         icon.className = 'fas fa-desktop';
        //         text.textContent = 'System Theme';
        //     }
        // }
    }
}

// Initialize Application
function initializeApp() {
    try {
        // Set initial model selection
        if (elements.modelSelect) {
            elements.modelSelect.value = chatState.selectedModel;
        }
        
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
        
        // Focus message input
        if (elements.messageInput) {
            elements.messageInput.focus();
        }
        
        console.log('SATI ChatBot initialized successfully');
    } catch (error) {
        console.error('Error initializing SATI ChatBot:', error);
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