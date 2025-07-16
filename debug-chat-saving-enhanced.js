// Enhanced debugging for chat saving functionality
console.log('🔧 Enhanced Chat Saving Debug Script Loaded');

// Override the original sendMessage function to add debugging
if (typeof chatManager !== 'undefined') {
    const originalSendMessage = chatManager.sendMessage;
    
    chatManager.sendMessage = async function(content, model) {
        console.log('🚀 [DEBUG] sendMessage called with:', {
            content: content?.substring(0, 50) + '...',
            model,
            currentConversationId: chatState.currentConversationId,
            isLoggedIn: chatState.isLoggedIn,
            useSupabaseStorage: chatState.useSupabaseStorage,
            supabaseDB: !!window.supabaseDB
        });
        
        // Check if conversation exists before sending
        if (!chatState.currentConversationId) {
            console.log('⚠️ [DEBUG] No current conversation ID - this should trigger conversation creation');
        }
        
        // Call original function
        const result = await originalSendMessage.call(this, content, model);
        
        console.log('✅ [DEBUG] sendMessage completed');
        return result;
    };
}

// Debug function to check current state
window.debugChatSaving = function() {
    console.log('🔍 [DEBUG] Current Chat Saving State:');
    console.log('📊 Chat State:', {
        isLoggedIn: chatState?.isLoggedIn,
        useSupabaseStorage: chatState?.useSupabaseStorage,
        currentConversationId: chatState?.currentConversationId,
        conversationsCount: chatState?.conversations?.length,
        currentMessagesCount: chatState?.currentMessages?.length
    });
    
    console.log('🔧 Supabase State:', {
        supabaseClient: !!window.supabase,
        supabaseDB: !!window.supabaseDB,
        supabaseInitialized: !!supabase,
        currentUserEmail: window.supabaseDB?.getCurrentUserEmail?.()
    });
    
    console.log('🌐 API State:', {
        apiManager: !!window.apiManager,
        selectedModel: chatState?.selectedModel,
        apiProvider: chatState?.apiProvider
    });
    
    // Test Supabase functions
    if (window.supabaseDB) {
        console.log('🧪 Testing Supabase functions:');
        console.log('- createConversation:', typeof window.supabaseDB.createConversation);
        console.log('- addMessage:', typeof window.supabaseDB.addMessage);
        console.log('- getUserConversations:', typeof window.supabaseDB.getUserConversations);
        console.log('- isUserAuthenticated:', window.supabaseDB.isUserAuthenticated?.());
    }
};

// Debug function to test conversation creation
window.testConversationCreation = async function() {
    console.log('🧪 [TEST] Testing conversation creation...');
    
    try {
        const conversation = await chatState.createNewConversation('Test Conversation');
        console.log('✅ [TEST] Conversation created:', conversation);
        
        // Test message saving
        if (conversation && window.supabaseDB) {
            console.log('🧪 [TEST] Testing message saving...');
            const result = await window.supabaseDB.addMessage(
                conversation.id,
                'user',
                'Test message',
                chatState.selectedModel
            );
            console.log('✅ [TEST] Message save result:', result);
        }
        
    } catch (error) {
        console.error('❌ [TEST] Error in conversation creation test:', error);
    }
};

// Debug function to test bookmark functionality
window.testBookmarkFunctionality = function() {
    console.log('🧪 [TEST] Testing bookmark functionality...');
    
    if (chatState.conversations.length === 0) {
        console.log('⚠️ [TEST] No conversations to test bookmarking');
        return;
    }
    
    const testConversation = chatState.conversations[0];
    console.log('🧪 [TEST] Testing bookmark on conversation:', testConversation.id);
    
    try {
        // Create a mock event
        const mockEvent = {
            stopPropagation: () => {},
            target: { closest: () => null },
            currentTarget: null
        };
        
        // Test bookmark toggle
        toggleBookmark(mockEvent, testConversation.id);
        console.log('✅ [TEST] Bookmark toggle completed without errors');
        
    } catch (error) {
        console.error('❌ [TEST] Error in bookmark test:', error);
    }
};

// Auto-run debug on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('🔧 Running automatic chat saving diagnostics...');
        window.debugChatSaving();
    }, 2000);
});

// Add debug commands to console
console.log('🔧 Debug commands available:');
console.log('- debugChatSaving() - Check current state');
console.log('- testConversationCreation() - Test conversation creation');
console.log('- testBookmarkFunctionality() - Test bookmark functionality');