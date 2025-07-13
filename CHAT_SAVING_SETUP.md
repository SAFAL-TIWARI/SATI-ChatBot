# Chat Saving System Setup Guide

This guide will help you set up the chat saving system for authenticated users using Supabase.

## Overview

The chat saving system allows authenticated users to:
- Save their conversations to Supabase based on their email
- Delete their chats (which are also deleted from Supabase)
- Have real-time updates across devices
- Maintain privacy with Row Level Security (RLS)

## Prerequisites

1. **Supabase Project**: You need a Supabase project with authentication enabled
2. **Environment Variables**: Your Supabase URL and anon key configured
3. **Database Access**: Ability to run SQL commands in Supabase

## Step 1: Set Up Database Schema

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL commands

This will create:
- `conversations` table with user email association
- `messages` table linked to conversations
- Row Level Security policies
- Proper indexes for performance

## Step 2: Configure Authentication

Ensure your Supabase project has:
1. **Email Authentication** enabled
2. **Google/GitHub SSO** (optional but recommended)
3. **Email confirmation** settings configured

## Step 3: Environment Variables

Make sure your environment variables are set:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase anon/public key

## Step 4: Test the System

1. **User Registration/Login**: Users can register with email or use SSO
2. **Chat Creation**: When a user creates a new chat, it's saved to Supabase
3. **Message Saving**: Each message is automatically saved to Supabase
4. **Real-time Updates**: Changes are reflected in real-time across devices
5. **Chat Deletion**: Deleting a chat removes it from both local storage and Supabase

## Features

### ✅ Implemented Features

1. **User Authentication**: Only authenticated users can save chats
2. **Email-based Storage**: Chats are saved based on user email
3. **Real-time Updates**: Changes sync across devices instantly
4. **Chat Deletion**: Users can delete their chats (removed from Supabase)
5. **Privacy**: Row Level Security ensures users only see their own chats
6. **Auto-title Generation**: Chat titles are auto-generated from first message
7. **Fallback System**: If Supabase is unavailable, falls back to local storage

### 🔄 Real-time Features

- **Live Updates**: When a user adds a message, it appears on all their devices
- **Instant Sync**: Chat deletions and renames sync immediately
- **Cross-device**: Users can access their chats from any device

### 🛡️ Security Features

- **Row Level Security**: Users can only access their own data
- **Email Verification**: Users must verify their email before saving chats
- **Session Management**: Proper session handling and cleanup

## Database Schema

### Conversations Table
```sql
- id (UUID, Primary Key)
- title (TEXT)
- user_email (TEXT, NOT NULL)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Messages Table
```sql
- id (UUID, Primary Key)
- conversation_id (UUID, Foreign Key)
- role (TEXT: 'user' or 'assistant')
- content (TEXT)
- model (TEXT, optional)
- created_at (TIMESTAMP)
```

## API Functions

The system provides these main functions:

### For Users
- `createConversation(title)`: Create a new chat
- `deleteConversation(id)`: Delete a chat
- `renameConversation(id, newTitle)`: Rename a chat
- `loadConversation(id)`: Load a specific chat
- `getUserConversations()`: Get all user's chats

### For Messages
- `addMessage(conversationId, role, content, model)`: Add a message
- `getConversationMessages(conversationId)`: Get all messages in a chat

### Real-time
- `subscribeToConversations(callback)`: Set up real-time subscriptions

## Error Handling

The system includes comprehensive error handling:
- **Network Issues**: Falls back to local storage
- **Authentication Errors**: Graceful degradation
- **Database Errors**: User-friendly error messages
- **Validation**: Input validation and sanitization

## Performance Optimizations

1. **Indexed Queries**: Database indexes for fast retrieval
2. **Lazy Loading**: Messages loaded only when needed
3. **Caching**: Local cache for frequently accessed data
4. **Batch Operations**: Efficient database operations

## Troubleshooting

### Common Issues

1. **"User not authenticated"**
   - Check if user is logged in
   - Verify email verification is complete

2. **"Database not initialized"**
   - Check Supabase configuration
   - Verify environment variables

3. **"Real-time not working"**
   - Check Supabase real-time settings
   - Verify subscription setup

### Debug Mode

Enable debug logging by checking browser console for:
- `✅ Supabase client initialized successfully`
- `✅ Real-time subscription established`
- `✅ Current user email set: user@example.com`

## Security Considerations

1. **Row Level Security**: All data is protected by RLS policies
2. **Email Verification**: Users must verify email before saving
3. **Session Management**: Proper session cleanup on logout
4. **Input Validation**: All inputs are validated and sanitized

## Future Enhancements

Potential improvements:
- Chat export functionality
- Chat sharing between users
- Advanced search and filtering
- Chat templates and prompts
- Backup and restore functionality

## Support

If you encounter issues:
1. Check browser console for error messages
2. Verify Supabase configuration
3. Test with a fresh user account
4. Check network connectivity

The system is designed to be robust and user-friendly while maintaining security and performance. 