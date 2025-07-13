// Supabase Database Operations for SATI ChatBot
// This file handles all database operations for user conversations

// Global reference to Supabase client (initialized in script.js)
let supabaseDB = null;

// Initialize the database connection using the existing Supabase client
function initializeSupabaseDB(supabaseClient) {
    if (!supabaseClient) {
        console.error('❌ Cannot initialize Supabase DB - client not provided');
        return false;
    }
    
    supabaseDB = supabaseClient;
    console.log('✅ Supabase DB operations initialized');
    return true;
}

// Get all conversations for the current user
async function getUserConversations() {
    if (!supabaseDB) {
        console.error('❌ Supabase DB not initialized');
        return { data: [], error: new Error('Database not initialized') };
    }
    
    try {
        const { data, error } = await supabaseDB
            .from('conversations')
            .select('*')
            .order('updated_at', { ascending: false });
            
        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return { data: [], error };
    }
}

// Create a new conversation
async function createConversation(title = 'New Conversation') {
    if (!supabaseDB) {
        console.error('❌ Supabase DB not initialized');
        return { data: null, error: new Error('Database not initialized') };
    }
    
    try {
        const { data, error } = await supabaseDB
            .from('conversations')
            .insert([{ title }])
            .select()
            .single();
            
        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error creating conversation:', error);
        return { data: null, error };
    }
}

// Update conversation title
async function updateConversationTitle(conversationId, title) {
    if (!supabaseDB) {
        console.error('❌ Supabase DB not initialized');
        return { success: false, error: new Error('Database not initialized') };
    }
    
    try {
        const { error } = await supabaseDB
            .from('conversations')
            .update({ title, updated_at: new Date() })
            .eq('id', conversationId);
            
        if (error) throw error;
        return { success: true, error: null };
    } catch (error) {
        console.error('Error updating conversation title:', error);
        return { success: false, error };
    }
}

// Delete a conversation and its messages
async function deleteConversation(conversationId) {
    if (!supabaseDB) {
        console.error('❌ Supabase DB not initialized');
        return { success: false, error: new Error('Database not initialized') };
    }
    
    try {
        // First delete all messages in the conversation
        const { error: messagesError } = await supabaseDB
            .from('messages')
            .delete()
            .eq('conversation_id', conversationId);
            
        if (messagesError) throw messagesError;
        
        // Then delete the conversation
        const { error: conversationError } = await supabaseDB
            .from('conversations')
            .delete()
            .eq('id', conversationId);
            
        if (conversationError) throw conversationError;
        
        return { success: true, error: null };
    } catch (error) {
        console.error('Error deleting conversation:', error);
        return { success: false, error };
    }
}

// Get all messages for a conversation
async function getConversationMessages(conversationId) {
    if (!supabaseDB) {
        console.error('❌ Supabase DB not initialized');
        return { data: [], error: new Error('Database not initialized') };
    }
    
    try {
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

// Add a message to a conversation
async function addMessage(conversationId, role, content, model = null) {
    if (!supabaseDB) {
        console.error('❌ Supabase DB not initialized');
        return { data: null, error: new Error('Database not initialized') };
    }
    
    try {
        // Add the message
        const { data: messageData, error: messageError } = await supabaseDB
            .from('messages')
            .insert([{ 
                conversation_id: conversationId,
                role,
                content,
                model
            }])
            .select()
            .single();
            
        if (messageError) throw messageError;
        
        // Update the conversation's updated_at timestamp
        const { error: updateError } = await supabaseDB
            .from('conversations')
            .update({ updated_at: new Date() })
            .eq('id', conversationId);
            
        if (updateError) throw updateError;
        
        return { data: messageData, error: null };
    } catch (error) {
        console.error('Error adding message:', error);
        return { data: null, error };
    }
}

// Export all functions
window.supabaseDB = {
    initialize: initializeSupabaseDB,
    getUserConversations,
    createConversation,
    updateConversationTitle,
    deleteConversation,
    getConversationMessages,
    addMessage
};