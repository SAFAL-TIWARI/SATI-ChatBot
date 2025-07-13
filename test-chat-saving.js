// Test file for Chat Saving System
// This file can be used to test the chat saving functionality

// Test function to verify Supabase connection
async function testSupabaseConnection() {
    console.log('🧪 Testing Supabase connection...');
    
    if (!window.supabaseDB) {
        console.error('❌ Supabase DB not available');
        return false;
    }
    
    if (!window.supabaseDB.isUserAuthenticated()) {
        console.error('❌ User not authenticated');
        return false;
    }
    
    console.log('✅ Supabase connection test passed');
    return true;
}

// Test function to create a conversation
async function testCreateConversation() {
    console.log('🧪 Testing conversation creation...');
    
    try {
        const { data, error } = await window.supabaseDB.createConversation('Test Conversation');
        
        if (error) {
            console.error('❌ Error creating conversation:', error);
            return null;
        }
        
        console.log('✅ Conversation created:', data);
        return data;
    } catch (err) {
        console.error('❌ Exception creating conversation:', err);
        return null;
    }
}

// Test function to add a message
async function testAddMessage(conversationId) {
    console.log('🧪 Testing message addition...');
    
    try {
        const { data, error } = await window.supabaseDB.addMessage(
            conversationId,
            'user',
            'This is a test message',
            'test-model'
        );
        
        if (error) {
            console.error('❌ Error adding message:', error);
            return null;
        }
        
        console.log('✅ Message added:', data);
        return data;
    } catch (err) {
        console.error('❌ Exception adding message:', err);
        return null;
    }
}

// Test function to get conversations
async function testGetConversations() {
    console.log('🧪 Testing conversation retrieval...');
    
    try {
        const { data, error } = await window.supabaseDB.getUserConversations();
        
        if (error) {
            console.error('❌ Error getting conversations:', error);
            return null;
        }
        
        console.log('✅ Conversations retrieved:', data);
        return data;
    } catch (err) {
        console.error('❌ Exception getting conversations:', err);
        return null;
    }
}

// Test function to delete a conversation
async function testDeleteConversation(conversationId) {
    console.log('🧪 Testing conversation deletion...');
    
    try {
        const { success, error } = await window.supabaseDB.deleteConversation(conversationId);
        
        if (error) {
            console.error('❌ Error deleting conversation:', error);
            return false;
        }
        
        console.log('✅ Conversation deleted successfully');
        return true;
    } catch (err) {
        console.error('❌ Exception deleting conversation:', err);
        return false;
    }
}

// Main test function
async function runChatSavingTests() {
    console.log('🚀 Starting Chat Saving System Tests...');
    
    // Test 1: Connection
    const connectionOk = await testSupabaseConnection();
    if (!connectionOk) {
        console.error('❌ Connection test failed, stopping tests');
        return;
    }
    
    // Test 2: Create conversation
    const conversation = await testCreateConversation();
    if (!conversation) {
        console.error('❌ Conversation creation failed, stopping tests');
        return;
    }
    
    // Test 3: Add message
    const message = await testAddMessage(conversation.id);
    if (!message) {
        console.error('❌ Message addition failed, stopping tests');
        return;
    }
    
    // Test 4: Get conversations
    const conversations = await testGetConversations();
    if (!conversations) {
        console.error('❌ Conversation retrieval failed, stopping tests');
        return;
    }
    
    // Test 5: Delete conversation (cleanup)
    const deleted = await testDeleteConversation(conversation.id);
    if (!deleted) {
        console.error('❌ Conversation deletion failed');
        return;
    }
    
    console.log('🎉 All tests passed! Chat saving system is working correctly.');
}

// Export test functions for manual testing
window.chatSavingTests = {
    testSupabaseConnection,
    testCreateConversation,
    testAddMessage,
    testGetConversations,
    testDeleteConversation,
    runChatSavingTests
};

// Auto-run tests if user is authenticated
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Supabase to initialize
    setTimeout(() => {
        if (window.supabaseDB && window.supabaseDB.isUserAuthenticated()) {
            console.log('🔍 User is authenticated, running tests...');
            runChatSavingTests();
        } else {
            console.log('⏳ Waiting for authentication...');
            // Check again after a delay
            setTimeout(() => {
                if (window.supabaseDB && window.supabaseDB.isUserAuthenticated()) {
                    console.log('🔍 User is now authenticated, running tests...');
                    runChatSavingTests();
                } else {
                    console.log('ℹ️ User not authenticated, tests will run when user logs in');
                }
            }, 5000);
        }
    }, 2000);
}); 