// Debug script to test conversation loading
// Run this in your browser console after the app is loaded

console.log('🔍 Conversation Loading Debug');
console.log('============================');

// Check if Supabase is available
if (!window.supabaseDB) {
    console.error('❌ Supabase DB not available. Make sure you are logged in.');
    return;
}

// Function to test loading a specific conversation
async function testLoadConversation(conversationId) {
    console.log(`🔄 Testing load conversation: ${conversationId}`);
    
    try {
        // Test the Supabase DB method directly
        const { data: messages, error } = await window.supabaseDB.getConversationMessages(conversationId);
        
        if (error) {
            console.error('❌ Error loading messages:', error);
            return;
        }
        
        console.log('✅ Messages loaded from Supabase:', messages);
        console.log('📊 Number of messages:', messages.length);
        
        // Test the chatState loadConversation method
        const conversation = await chatState.loadConversation(conversationId);
        
        if (conversation) {
            console.log('✅ Conversation loaded successfully:', conversation);
            console.log('📝 Current messages in chatState:', chatState.currentMessages);
            console.log('🆔 Current conversation ID:', chatState.currentConversationId);
            
            // Test rendering
            chatManager.renderMessages();
            console.log('✅ Messages rendered');
            
            return conversation;
        } else {
            console.error('❌ Failed to load conversation');
        }
        
    } catch (err) {
        console.error('❌ Error in testLoadConversation:', err);
    }
}

// Function to list all conversations and their message counts
async function listConversationsWithMessages() {
    console.log('📋 Loading all conversations...');
    
    try {
        const { data: conversations, error } = await window.supabaseDB.getUserConversations();
        
        if (error) {
            console.error('❌ Error loading conversations:', error);
            return;
        }
        
        console.log('✅ Conversations loaded:', conversations);
        
        for (const conv of conversations) {
            console.log(`\n--- Conversation: ${conv.title} (ID: ${conv.id}) ---`);
            
            // Get messages for this conversation
            const { data: messages, error: msgError } = await window.supabaseDB.getConversationMessages(conv.id);
            
            if (msgError) {
                console.error(`❌ Error loading messages for ${conv.title}:`, msgError);
            } else {
                console.log(`📝 Messages: ${messages.length}`);
                messages.forEach((msg, index) => {
                    console.log(`  ${index + 1}. [${msg.role}] ${msg.content.substring(0, 50)}${msg.content.length > 50 ? '...' : ''}`);
                });
            }
        }
        
    } catch (err) {
        console.error('❌ Error in listConversationsWithMessages:', err);
    }
}

// Function to test the full conversation loading flow
async function testFullConversationFlow() {
    console.log('🔄 Testing full conversation loading flow...');
    
    try {
        // Get all conversations
        const { data: conversations, error } = await window.supabaseDB.getUserConversations();
        
        if (error || !conversations || conversations.length === 0) {
            console.log('📝 No conversations found');
            return;
        }
        
        // Test loading the first conversation
        const firstConversation = conversations[0];
        console.log(`🔄 Testing with conversation: ${firstConversation.title}`);
        
        await testLoadConversation(firstConversation.id);
        
    } catch (err) {
        console.error('❌ Error in testFullConversationFlow:', err);
    }
}

// Make functions available globally
window.testLoadConversation = testLoadConversation;
window.listConversationsWithMessages = listConversationsWithMessages;
window.testFullConversationFlow = testFullConversationFlow;

console.log('✅ Debug functions loaded:');
console.log('   - testLoadConversation(id) - Test loading a specific conversation');
console.log('   - listConversationsWithMessages() - List all conversations with their messages');
console.log('   - testFullConversationFlow() - Test the complete loading flow');
console.log('\n💡 Usage:');
console.log('   testLoadConversation("your-conversation-id")');
console.log('   listConversationsWithMessages()');
console.log('   testFullConversationFlow()');