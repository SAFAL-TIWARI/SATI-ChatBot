// Debug script for Chat Saving System
// Add this to your browser console to test the system

window.debugChatSaving = {
    // Check current state
    checkState: function() {
        console.log('🔍 Current Chat State:', {
            isLoggedIn: chatState.isLoggedIn,
            email: chatState.email,
            authProvider: chatState.authProvider,
            useSupabaseStorage: chatState.useSupabaseStorage,
            supabaseAvailable: !!window.supabase,
            supabaseDBAvailable: !!window.supabaseDB,
            conversationsCount: chatState.conversations.length
        });
    },

    // Check Supabase connection
    checkSupabase: function() {
        console.log('🔍 Supabase Status:', {
            supabase: !!window.supabase,
            supabaseDB: !!window.supabaseDB,
            isUserAuthenticated: window.supabaseDB?.isUserAuthenticated?.() || false,
            currentUserEmail: window.supabaseDB?.getCurrentUserEmail?.() || 'Not set'
        });
    },

    // Test conversation creation
    testCreateConversation: async function() {
        console.log('🧪 Testing conversation creation...');
        const result = await chatState.createNewConversation('Debug Test Chat');
        console.log('✅ Conversation created:', result);
        return result;
    },

    // Test message sending
    testSendMessage: async function() {
        console.log('🧪 Testing message sending...');
        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: 'This is a debug test message',
            timestamp: new Date().toISOString()
        };
        
        chatState.currentMessages.push(userMessage);
        await chatState.updateConversation(chatState.currentMessages);
        console.log('✅ Message sent and saved');
    },

    // Check Supabase tables
    checkSupabaseTables: async function() {
        if (!window.supabaseDB) {
            console.error('❌ Supabase DB not available');
            return;
        }

        try {
            console.log('🔍 Checking Supabase tables...');
            
            // Get conversations
            const { data: conversations, error: convError } = await window.supabaseDB.getUserConversations();
            console.log('📋 Conversations:', conversations);
            if (convError) console.error('❌ Error getting conversations:', convError);

            // Get messages if there are conversations
            if (conversations && conversations.length > 0) {
                const { data: messages, error: msgError } = await window.supabaseDB.getConversationMessages(conversations[0].id);
                console.log('💬 Messages:', messages);
                if (msgError) console.error('❌ Error getting messages:', msgError);
            }

        } catch (err) {
            console.error('❌ Error checking Supabase tables:', err);
        }
    },

    // Run full test
    runFullTest: async function() {
        console.log('🚀 Running full chat saving test...');
        
        // Check current state
        this.checkState();
        this.checkSupabase();
        
        // Test conversation creation
        const conversation = await this.testCreateConversation();
        
        // Test message sending
        await this.testSendMessage();
        
        // Check Supabase tables
        await this.checkSupabaseTables();
        
        console.log('🎉 Full test completed!');
    },

    // Force Supabase initialization
    forceInitSupabase: function() {
        console.log('🔧 Forcing Supabase initialization...');
        if (window.supabaseDB && window.supabaseDB.setCurrentUserEmail) {
            window.supabaseDB.setCurrentUserEmail(chatState.email);
            chatState.initSupabaseStorage();
            console.log('✅ Supabase forced initialization completed');
        } else {
            console.error('❌ Supabase DB not available');
        }
    },

    // Show help
    help: function() {
        console.log(`
🔧 Chat Saving Debug Commands:

debugChatSaving.checkState()           - Check current chat state
debugChatSaving.checkSupabase()        - Check Supabase connection
debugChatSaving.testCreateConversation() - Test creating a conversation
debugChatSaving.testSendMessage()      - Test sending a message
debugChatSaving.checkSupabaseTables()  - Check Supabase tables
debugChatSaving.runFullTest()          - Run complete test
debugChatSaving.forceInitSupabase()    - Force Supabase initialization
debugChatSaving.help()                 - Show this help

Usage: Open browser console and run any command above
        `);
    }
};

// Auto-run when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('🔧 Chat Saving Debug Tools Loaded!');
        console.log('Type: debugChatSaving.help() for available commands');
        
        // Auto-check state after a delay
        setTimeout(() => {
            if (window.debugChatSaving) {
                window.debugChatSaving.checkState();
                window.debugChatSaving.checkSupabase();
            }
        }, 3000);
    }, 1000);
}); 