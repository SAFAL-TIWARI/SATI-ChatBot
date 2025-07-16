// Comprehensive test for bookmark functionality
console.log('🧪 Bookmark Functionality Test Script Loaded');

window.testBookmarks = {
    // Test 1: Check if all required elements exist
    checkElements: function() {
        console.log('🔍 Testing required elements...');
        
        const elements = {
            savedChatsBtn: document.getElementById('savedChatsBtn'),
            savedChatsModalTemplate: document.getElementById('savedChatsModalTemplate'),
            conversationsList: document.getElementById('conversationsList')
        };
        
        Object.entries(elements).forEach(([name, element]) => {
            if (element) {
                console.log(`✅ ${name} found`);
            } else {
                console.log(`❌ ${name} NOT found`);
            }
        });
        
        return elements;
    },
    
    // Test 2: Check current conversations and their bookmark status
    checkConversations: function() {
        console.log('🔍 Testing conversations and bookmark status...');
        
        if (!window.chatState) {
            console.log('❌ chatState not available');
            return;
        }
        
        console.log(`📊 Total conversations: ${chatState.conversations.length}`);
        
        const bookmarkedConversations = chatState.conversations.filter(c => c.is_bookmarked);
        console.log(`🔖 Bookmarked conversations: ${bookmarkedConversations.length}`);
        
        chatState.conversations.forEach((conv, index) => {
            console.log(`${index + 1}. ${conv.title} - Bookmarked: ${conv.is_bookmarked ? '✅' : '❌'}`);
        });
        
        return {
            total: chatState.conversations.length,
            bookmarked: bookmarkedConversations.length,
            conversations: chatState.conversations
        };
    },
    
    // Test 3: Test modal creation and display
    testModal: async function() {
        console.log('🔍 Testing saved chats modal...');
        
        try {
            // Try to show the modal
            if (typeof showSavedChatsModal === 'function') {
                await showSavedChatsModal();
                
                // Check if modal was created
                const modal = document.getElementById('savedChatsModal');
                if (modal) {
                    console.log('✅ Modal created successfully');
                    console.log('✅ Modal visible:', modal.classList.contains('show'));
                    
                    // Check if saved chats list exists
                    const savedChatsList = document.getElementById('savedChatsList');
                    if (savedChatsList) {
                        console.log('✅ Saved chats list container found');
                        console.log(`📊 Saved chats list children: ${savedChatsList.children.length}`);
                    } else {
                        console.log('❌ Saved chats list container NOT found');
                    }
                    
                    // Close modal after test
                    setTimeout(() => {
                        modal.classList.remove('show');
                        console.log('✅ Modal closed after test');
                    }, 2000);
                    
                } else {
                    console.log('❌ Modal NOT created');
                }
            } else {
                console.log('❌ showSavedChatsModal function not available');
            }
        } catch (error) {
            console.error('❌ Error testing modal:', error);
        }
    },
    
    // Test 4: Test bookmark toggle functionality
    testBookmarkToggle: async function() {
        console.log('🔍 Testing bookmark toggle functionality...');
        
        if (chatState.conversations.length === 0) {
            console.log('⚠️ No conversations available for testing');
            return;
        }
        
        const testConversation = chatState.conversations[0];
        const originalBookmarkStatus = testConversation.is_bookmarked;
        
        console.log(`🧪 Testing with conversation: "${testConversation.title}"`);
        console.log(`📊 Original bookmark status: ${originalBookmarkStatus}`);
        
        try {
            // Create mock event
            const mockEvent = {
                stopPropagation: () => {},
                target: { closest: () => null }
            };
            
            // Toggle bookmark
            if (typeof toggleBookmark === 'function') {
                await toggleBookmark(mockEvent, testConversation.id);
                
                // Check new status
                const updatedConversation = chatState.conversations.find(c => c.id === testConversation.id);
                const newBookmarkStatus = updatedConversation.is_bookmarked;
                
                console.log(`📊 New bookmark status: ${newBookmarkStatus}`);
                console.log(`✅ Bookmark toggle ${newBookmarkStatus !== originalBookmarkStatus ? 'SUCCESS' : 'FAILED'}`);
                
                // Toggle back to original state
                await toggleBookmark(mockEvent, testConversation.id);
                console.log('✅ Restored original bookmark state');
                
            } else {
                console.log('❌ toggleBookmark function not available');
            }
        } catch (error) {
            console.error('❌ Error testing bookmark toggle:', error);
        }
    },
    
    // Test 5: Test Supabase integration
    testSupabaseIntegration: function() {
        console.log('🔍 Testing Supabase integration...');
        
        const supabaseStatus = {
            supabaseClient: !!window.supabase,
            supabaseDB: !!window.supabaseDB,
            useSupabaseStorage: chatState?.useSupabaseStorage,
            isLoggedIn: chatState?.isLoggedIn,
            currentUserEmail: window.supabaseDB?.getCurrentUserEmail?.()
        };
        
        console.log('📊 Supabase Status:', supabaseStatus);
        
        if (supabaseStatus.useSupabaseStorage && window.supabaseDB) {
            console.log('✅ Supabase storage is active');
            
            // Test if updateBookmarkStatus function exists
            if (window.supabaseDB.updateBookmarkStatus) {
                console.log('✅ updateBookmarkStatus function available');
            } else {
                console.log('❌ updateBookmarkStatus function NOT available');
            }
        } else {
            console.log('⚠️ Supabase storage not active (user may not be logged in)');
        }
        
        return supabaseStatus;
    },
    
    // Run all tests
    runAllTests: async function() {
        console.log('🚀 Running comprehensive bookmark functionality tests...\n');
        
        this.checkElements();
        console.log('\n');
        
        this.checkConversations();
        console.log('\n');
        
        await this.testModal();
        console.log('\n');
        
        await this.testBookmarkToggle();
        console.log('\n');
        
        this.testSupabaseIntegration();
        console.log('\n');
        
        console.log('✅ All bookmark tests completed!');
        console.log('💡 To manually test: Click the "Saved Chats" button in the sidebar');
        console.log('💡 To bookmark a chat: Click the bookmark icon next to any conversation');
    }
};

// Auto-run tests when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('🧪 Bookmark functionality tests available!');
        console.log('Run: testBookmarks.runAllTests() to test everything');
        console.log('Or run individual tests like: testBookmarks.testModal()');
    }, 3000);
});

// Export for console access
window.testBookmarks = window.testBookmarks;