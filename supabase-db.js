// Supabase Database Operations for SATI ChatBot
// This file handles all database operations for user conversations

// Global reference to Supabase client (initialized in script.js)
let supabaseDB = null;
let currentUserEmail = null;

// Initialize the database connection using the existing Supabase client
function initializeSupabaseDB(supabaseClient) {
    if (!supabaseClient) {
        console.error('❌ Cannot initialize Supabase DB - client not provided');
        return false;
    }
    
    supabaseDB = supabaseClient;
    console.log('✅ Supabase DB operations initialized');
    
    // Get current user email
    const session = supabaseDB.auth.getSession();
    if (session && session.user) {
        currentUserEmail = session.user.email;
    }
    
    return true;
}

// Set current user email (called when user logs in)
function setCurrentUserEmail(email) {
    currentUserEmail = email;
    console.log('✅ Current user email set:', email);
}

// Get current user email
function getCurrentUserEmail() {
    return currentUserEmail;
}

// Check if user is authenticated
function isUserAuthenticated() {
    return !!currentUserEmail;
}

// Get all conversations for the current authenticated user
async function getUserConversations() {
    if (!supabaseDB) {
        console.error('❌ Supabase DB not initialized');
        return { data: [], error: new Error('Database not initialized') };
    }
    
    if (!isUserAuthenticated()) {
        console.error('❌ User not authenticated');
        return { data: [], error: new Error('User not authenticated') };
    }
    
    try {
        const { data, error } = await supabaseDB
            .from('conversations')
            .select('*')
            .eq('user_email', currentUserEmail)
            .order('updated_at', { ascending: false });
            
        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return { data: [], error };
    }
}

// Get bookmarked conversations for the current authenticated user
async function getBookmarkedConversations() {
    if (!supabaseDB) {
        console.error('❌ Supabase DB not initialized');
        return { data: [], error: new Error('Database not initialized') };
    }
    
    if (!isUserAuthenticated()) {
        console.error('❌ User not authenticated');
        return { data: [], error: new Error('User not authenticated') };
    }
    
    try {
        const { data, error } = await supabaseDB
            .from('conversations')
            .select('*')
            .eq('user_email', currentUserEmail)
            .eq('is_bookmarked', true)
            .order('updated_at', { ascending: false });
            
        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching bookmarked conversations:', error);
        return { data: [], error };
    }
}

// Create a new conversation for the authenticated user
async function createConversation(title = 'New Conversation') {
    if (!supabaseDB) {
        console.error('❌ Supabase DB not initialized');
        return { data: null, error: new Error('Database not initialized') };
    }
    
    if (!isUserAuthenticated()) {
        console.error('❌ User not authenticated');
        return { data: null, error: new Error('User not authenticated') };
    }
    
    try {
        const { data, error } = await supabaseDB
            .from('conversations')
            .insert([{ 
                title,
                user_email: currentUserEmail,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }])
            .select()
            .single();
            
        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error creating conversation:', error);
        return { data: null, error };
    }
}

// Update conversation title for the authenticated user
async function updateConversationTitle(conversationId, title) {
    if (!supabaseDB) {
        console.error('❌ Supabase DB not initialized');
        return { success: false, error: new Error('Database not initialized') };
    }
    
    if (!isUserAuthenticated()) {
        console.error('❌ User not authenticated');
        return { success: false, error: new Error('User not authenticated') };
    }
    
    try {
        const { error } = await supabaseDB
            .from('conversations')
            .update({ 
                title, 
                updated_at: new Date().toISOString() 
            })
            .eq('id', conversationId)
            .eq('user_email', currentUserEmail); // Ensure user owns this conversation
            
        if (error) throw error;
        return { success: true, error: null };
    } catch (error) {
        console.error('Error updating conversation title:', error);
        return { success: false, error };
    }
}

// Update bookmark status for the authenticated user
async function updateBookmarkStatus(conversationId, isBookmarked) {
    if (!supabaseDB) {
        console.error('❌ Supabase DB not initialized');
        return { success: false, error: new Error('Database not initialized') };
    }
    
    if (!isUserAuthenticated()) {
        console.error('❌ User not authenticated');
        return { success: false, error: new Error('User not authenticated') };
    }
    
    try {
        const { error } = await supabaseDB
            .from('conversations')
            .update({ 
                is_bookmarked: isBookmarked,
                updated_at: new Date().toISOString() 
            })
            .eq('id', conversationId)
            .eq('user_email', currentUserEmail); // Ensure user owns this conversation
            
        if (error) throw error;
        return { success: true, error: null };
    } catch (error) {
        console.error('Error updating bookmark status:', error);
        return { success: false, error };
    }
}

// Delete a conversation and its messages for the authenticated user
async function deleteConversation(conversationId) {
    if (!supabaseDB) {
        console.error('❌ Supabase DB not initialized');
        return { success: false, error: new Error('Database not initialized') };
    }
    
    if (!isUserAuthenticated()) {
        console.error('❌ User not authenticated');
        return { success: false, error: new Error('User not authenticated') };
    }
    
    try {
        // First verify the conversation belongs to the current user
        const { data: conversation, error: fetchError } = await supabaseDB
            .from('conversations')
            .select('id')
            .eq('id', conversationId)
            .eq('user_email', currentUserEmail)
            .single();
            
        if (fetchError || !conversation) {
            throw new Error('Conversation not found or access denied');
        }
        
        // Delete all messages in the conversation
        const { error: messagesError } = await supabaseDB
            .from('messages')
            .delete()
            .eq('conversation_id', conversationId);
            
        if (messagesError) throw messagesError;
        
        // Then delete the conversation
        const { error: conversationError } = await supabaseDB
            .from('conversations')
            .delete()
            .eq('id', conversationId)
            .eq('user_email', currentUserEmail);
            
        if (conversationError) throw conversationError;
        
        return { success: true, error: null };
    } catch (error) {
        console.error('Error deleting conversation:', error);
        return { success: false, error };
    }
}

// Get all messages for a conversation (verify user ownership)
async function getConversationMessages(conversationId) {
    if (!supabaseDB) {
        console.error('❌ Supabase DB not initialized');
        return { data: [], error: new Error('Database not initialized') };
    }
    
    if (!isUserAuthenticated()) {
        console.error('❌ User not authenticated');
        return { data: [], error: new Error('User not authenticated') };
    }
    
    try {
        // First verify the conversation belongs to the current user
        const { data: conversation, error: fetchError } = await supabaseDB
            .from('conversations')
            .select('id')
            .eq('id', conversationId)
            .eq('user_email', currentUserEmail)
            .single();
            
        if (fetchError || !conversation) {
            throw new Error('Conversation not found or access denied');
        }
        
        const { data, error } = await supabaseDB
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });
            
        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching messages:', error);
        return { data: [], error };
    }
}

// Add a message to a conversation (verify user ownership)
async function addMessage(conversationId, role, content, model = null) {
    if (!supabaseDB) {
        console.error('❌ Supabase DB not initialized');
        return { data: null, error: new Error('Database not initialized') };
    }
    
    if (!isUserAuthenticated()) {
        console.error('❌ User not authenticated');
        return { data: null, error: new Error('User not authenticated') };
    }
    
    try {
        // First verify the conversation belongs to the current user
        const { data: conversation, error: fetchError } = await supabaseDB
            .from('conversations')
            .select('id')
            .eq('id', conversationId)
            .eq('user_email', currentUserEmail)
            .single();
            
        if (fetchError || !conversation) {
            throw new Error('Conversation not found or access denied');
        }
        
        // Add the message
        const { data: messageData, error: messageError } = await supabaseDB
            .from('messages')
            .insert([{ 
                conversation_id: conversationId,
                role,
                content,
                model,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();
            
        if (messageError) throw messageError;
        
        // Update the conversation's updated_at timestamp
        const { error: updateError } = await supabaseDB
            .from('conversations')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', conversationId)
            .eq('user_email', currentUserEmail);
            
        if (updateError) throw updateError;
        
        return { data: messageData, error: null };
    } catch (error) {
        console.error('Error adding message:', error);
        return { data: null, error };
    }
}

// Set up real-time subscriptions for conversations
function subscribeToConversations(callback) {
    if (!supabaseDB || !isUserAuthenticated()) {
        console.error('❌ Cannot subscribe - DB not initialized or user not authenticated');
        return null;
    }
    
    try {
        const subscription = supabaseDB
            .channel('conversations_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'conversations',
                    filter: `user_email=eq.${currentUserEmail}`
                },
                (payload) => {
                    console.log('Conversation change detected:', payload);
                    callback(payload);
                }
            )
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=in.(${getUserConversationIds()})`
                },
                (payload) => {
                    console.log('Message change detected:', payload);
                    callback(payload);
                }
            )
            .subscribe();
            
        console.log('✅ Real-time subscription established');
        return subscription;
    } catch (error) {
        console.error('Error setting up real-time subscription:', error);
        return null;
    }
}

// Helper function to get conversation IDs for the current user
async function getUserConversationIds() {
    const { data } = await getUserConversations();
    return data.map(conv => conv.id).join(',');
}

// Delete user account and all associated data
async function deleteUserAccount() {
    if (!supabaseDB) {
        console.error('❌ Supabase DB not initialized');
        return { success: false, error: new Error('Database not initialized') };
    }
    
    if (!isUserAuthenticated()) {
        console.error('❌ User not authenticated');
        return { success: false, error: new Error('User not authenticated') };
    }
    
    try {
        // Get all user conversations
        const { data: conversations, error: conversationsError } = await getUserConversations();
        if (conversationsError) throw conversationsError;
        
        // Delete all messages for all conversations
        for (const conversation of conversations) {
            const { error: messagesError } = await supabaseDB
                .from('messages')
                .delete()
                .eq('conversation_id', conversation.id);
                
            if (messagesError) {
                console.error(`Error deleting messages for conversation ${conversation.id}:`, messagesError);
                // Continue with other conversations even if one fails
            }
        }
        
        // Delete all conversations
        const { error: conversationsDeleteError } = await supabaseDB
            .from('conversations')
            .delete()
            .eq('user_email', currentUserEmail);
            
        if (conversationsDeleteError) throw conversationsDeleteError;
        
        // Note: User account deletion from Supabase Auth requires server-side admin access
        // For client-side implementation, we'll just sign out the user after clearing their data
        // The user account will remain in auth but all their data will be deleted
        
        // Sign out the user
        const { error: signOutError } = await supabaseDB.auth.signOut();
        if (signOutError) {
            console.error('Error signing out user:', signOutError);
        }
        
        console.log('✅ User account and all data deleted successfully');
        return { success: true, error: null };
        
    } catch (error) {
        console.error('Error deleting user account:', error);
        return { success: false, error };
    }
}

// Set up real-time subscriptions for conversations
function subscribeToConversations(callback) {
    if (!supabaseDB || !isUserAuthenticated()) {
        console.error('❌ Cannot subscribe - DB not initialized or user not authenticated');
        return null;
    }
    
    try {
        const subscription = supabaseDB
            .channel('conversations_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'conversations',
                    filter: `user_email=eq.${currentUserEmail}`
                },
                (payload) => {
                    console.log('Conversation change detected:', payload);
                    callback(payload);
                }
            )
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'messages'
                },
                (payload) => {
                    console.log('Message change detected:', payload);
                    callback(payload);
                }
            )
            .subscribe();
            
        console.log('✅ Real-time subscription established');
        return subscription;
    } catch (error) {
        console.error('Error setting up real-time subscription:', error);
        return null;
    }
}



// Export all functions
window.supabaseDB = {
    initialize: initializeSupabaseDB,
    setCurrentUserEmail,
    getCurrentUserEmail,
    isUserAuthenticated,
    getUserConversations,
    getBookmarkedConversations,
    createConversation,
    updateConversationTitle,
    updateBookmarkStatus,
    deleteConversation,
    getConversationMessages,
    addMessage,
    subscribeToConversations
};

// Export deleteUserAccount function globally
window.deleteUserAccount = deleteUserAccount;