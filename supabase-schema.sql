-- Supabase Database Schema for SATI ChatBot
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security (RLS)
ALTER TABLE IF EXISTS conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS messages ENABLE ROW LEVEL SECURITY;

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL DEFAULT 'New Conversation',
    user_email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    model TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_email ON conversations(user_email);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Row Level Security Policies for conversations
-- Users can only see their own conversations
CREATE POLICY "Users can view own conversations" ON conversations
    FOR SELECT USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Users can only insert their own conversations
CREATE POLICY "Users can insert own conversations" ON conversations
    FOR INSERT WITH CHECK (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Users can only update their own conversations
CREATE POLICY "Users can update own conversations" ON conversations
    FOR UPDATE USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Users can only delete their own conversations
CREATE POLICY "Users can delete own conversations" ON conversations
    FOR DELETE USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Row Level Security Policies for messages
-- Users can only see messages from their own conversations
CREATE POLICY "Users can view messages from own conversations" ON messages
    FOR SELECT USING (
        conversation_id IN (
            SELECT id FROM conversations 
            WHERE user_email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    );

-- Users can only insert messages to their own conversations
CREATE POLICY "Users can insert messages to own conversations" ON messages
    FOR INSERT WITH CHECK (
        conversation_id IN (
            SELECT id FROM conversations 
            WHERE user_email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    );

-- Users can only update messages from their own conversations
CREATE POLICY "Users can update messages from own conversations" ON messages
    FOR UPDATE USING (
        conversation_id IN (
            SELECT id FROM conversations 
            WHERE user_email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    );

-- Users can only delete messages from their own conversations
CREATE POLICY "Users can delete messages from own conversations" ON messages
    FOR DELETE USING (
        conversation_id IN (
            SELECT id FROM conversations 
            WHERE user_email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_conversations_updated_at 
    BEFORE UPDATE ON conversations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON conversations TO authenticated;
GRANT ALL ON messages TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated; 