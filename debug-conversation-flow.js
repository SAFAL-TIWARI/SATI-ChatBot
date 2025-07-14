// Debug script to test complete conversation flow
// Run this in your browser console after the app is loaded

console.log('🔍 Complete Conversation Flow Debug');
console.log('==================================');

// Check if Supabase is available
if (!window.supabaseDB) {
    console.error('❌ Supabase DB not available. Make sure you are logged in.');
    return;
}

// Function to test loading a conversation and see all messages
async function testCompleteConversationFlow(conversationId) {
    console.log(`🔄 Testing complete conversation flow for: ${conversationId}`);
    
    try {
        // Step 1: Get messages directly from Supabase
        console.log('\n📋 Step 1: Getting messages from Supabase...');
        const { data: supabaseMessages, error } = await window.supabaseDB.getConversationMessages(conversationId);
        
        if (error) {
            console.error('❌ Error getting messages from Supabase:', error);
            return;
        }
        
        console.log('✅ Supabase messages:', supabaseMessages);
        console.log('📊 Total messages from Supabase:', supabaseMessages.length);
        
        // Step 2: Show message details
        console.log('\n📝 Step 2: Message details:');
        supabaseMessages.forEach((msg, index) => {
            console.log(`${index + 1}. [${msg.role}] ${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}`);
            console.log(`   ID: ${msg.id}, Created: ${new Date(msg.created_at).toLocaleString()}`);
        });
        
        // Step 3: Test chatState loading
        console.log('\n🔄 Step 3: Testing chatState.loadConversation...');
        const conversation = await chatState.loadConversation(conversationId);
        
        if (conversation) {
            console.log('✅ Conversation loaded successfully:', conversation);
            console.log('📝 Current messages in chatState:', chatState.currentMessages);
            console.log('📊 Number of messages in chatState:', chatState.currentMessages.length);
            
            // Step 4: Test rendering
            console.log('\n🎨 Step 4: Testing message rendering...');
            chatManager.renderMessages();
            console.log('✅ Messages rendered');
            
            // Step 5: Verify message order
            console.log('\n📋 Step 5: Verifying message order:');
            chatState.currentMessages.forEach((msg, index) => {
                console.log(`${index + 1}. [${msg.role}] ${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}`);
            });
            
            return conversation;
        } else {
            console.error('❌ Failed to load conversation');
        }
        
    } catch (err) {
        console.error('❌ Error in testCompleteConversationFlow:', err);
    }
}

// Function to test all conversations
async function testAllConversations() {
    console.log('📋 Testing all conversations...');
    
    try {
        const { data: conversations, error } = await window.supabaseDB.getUserConversations();
        
        if (error) {
            console.error('❌ Error loading conversations:', error);
            return;
        }
        
        console.log('✅ Conversations found:', conversations.length);
        
        for (const conv of conversations) {
            console.log(`\n--- Testing Conversation: ${conv.title} (ID: ${conv.id}) ---`);
            await testCompleteConversationFlow(conv.id);
        }
        
    } catch (err) {
        console.error('❌ Error in testAllConversations:', err);
    }
}

// Function to check if messages are being saved properly
async function checkMessageSaving() {
    console.log('💾 Checking message saving...');
    
    try {
        // Get all conversations
        const { data: conversations, error } = await window.supabaseDB.getUserConversations();
        
        if (error || !conversations || conversations.length === 0) {
            console.log('📝 No conversations found');
            return;
        }
        
        // Check the first conversation
        const firstConv = conversations[0];
        console.log(`\n📋 Checking conversation: ${firstConv.title}`);
        
        const { data: messages, error: msgError } = await window.supabaseDB.getConversationMessages(firstConv.id);
        
        if (msgError) {
            console.error('❌ Error getting messages:', msgError);
            return;
        }
        
        console.log('✅ Messages found:', messages.length);
        
        // Check if we have both user and assistant messages
        const userMessages = messages.filter(m => m.role === 'user');
        const assistantMessages = messages.filter(m => m.role === 'assistant');
        
        console.log(`👤 User messages: ${userMessages.length}`);
        console.log(`🤖 Assistant messages: ${assistantMessages.length}`);
        
        // Show the conversation flow
        console.log('\n📝 Conversation flow:');
        messages.forEach((msg, index) => {
            const role = msg.role === 'user' ? '👤 User' : '🤖 Assistant';
            console.log(`${index + 1}. ${role}: ${msg.content.substring(0, 80)}${msg.content.length > 80 ? '...' : ''}`);
        });
        
    } catch (err) {
        console.error('❌ Error in checkMessageSaving:', err);
    }
}

// Function to simulate a complete conversation
async function simulateCompleteConversation() {
    console.log('🧪 Simulating complete conversation...');
    
    try {
        // Create a new conversation
        const { data: conversation, error: createError } = await window.supabaseDB.createConversation('Test Complete Flow');
        
        if (createError) {
            console.error('❌ Error creating conversation:', createError);
            return;
        }
        
        console.log('✅ Created test conversation:', conversation);
        
        // Add user message
        const { data: userMsg, error: userError } = await window.supabaseDB.addMessage(
            conversation.id, 
            'user', 
            'Hello, this is a test message from the user'
        );
        
        if (userError) {
            console.error('❌ Error adding user message:', userError);
            return;
        }
        
        console.log('✅ Added user message:', userMsg);
        
        // Add assistant message
        const { data: assistantMsg, error: assistantError } = await window.supabaseDB.addMessage(
            conversation.id, 
            'assistant', 
            'Hello! This is a test response from the assistant. I can help you with information about SATI.'
        );
        
        if (assistantError) {
            console.error('❌ Error adding assistant message:', assistantError);
            return;
        }
        
        console.log('✅ Added assistant message:', assistantMsg);
        
        // Test loading the conversation
        console.log('\n🔄 Testing conversation loading...');
        await testCompleteConversationFlow(conversation.id);
        
    } catch (err) {
        console.error('❌ Error in simulateCompleteConversation:', err);
    }
}

// Make functions available globally
window.testCompleteConversationFlow = testCompleteConversationFlow;
window.testAllConversations = testAllConversations;
window.checkMessageSaving = checkMessageSaving;
window.simulateCompleteConversation = simulateCompleteConversation;

console.log('✅ Debug functions loaded:');
console.log('   - testCompleteConversationFlow(id) - Test loading a specific conversation');
console.log('   - testAllConversations() - Test all conversations');
console.log('   - checkMessageSaving() - Check if messages are being saved properly');
console.log('   - simulateCompleteConversation() - Create a test conversation');
console.log('\n💡 Usage:');
console.log('   testCompleteConversationFlow("your-conversation-id")');
console.log('   testAllConversations()');
console.log('   checkMessageSaving()');
console.log('   simulateCompleteConversation()'); 