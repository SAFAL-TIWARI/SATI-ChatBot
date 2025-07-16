// Comprehensive test for saved chats functionality
console.log('🧪 Saved Chats Functionality Test Script Loaded');

window.testSavedChats = {
    // Test 1: Check dropdown ID conflicts
    testDropdownIDs: function() {
        console.log('🔍 Testing dropdown ID conflicts...');
        
        // Check if both sections have different dropdown IDs
        const regularDropdowns = document.querySelectorAll('[id^="dropdown-"]');
        const savedDropdowns = document.querySelectorAll('[id^="saved-dropdown-"]');
        
        console.log(`📊 Regular conversation dropdowns: ${regularDropdowns.length}`);
        console.log(`📊 Saved chat dropdowns: ${savedDropdowns.length}`);
        
        // Check for ID conflicts
        const allDropdowns = document.querySelectorAll('.conversation-dropdown');
        const dropdownIds = Array.from(allDropdowns).map(d => d.id).filter(id => id);
        const uniqueIds = [...new Set(dropdownIds)];
        
        if (dropdownIds.length === uniqueIds.length) {
            console.log('✅ No dropdown ID conflicts found');
        } else {
            console.log('❌ Dropdown ID conflicts detected!');
            console.log('All IDs:', dropdownIds);
            console.log('Unique IDs:', uniqueIds);
        }
        
        return {
            regularDropdowns: regularDropdowns.length,
            savedDropdowns: savedDropdowns.length,
            hasConflicts: dropdownIds.length !== uniqueIds.length
        };
    },
    
    // Test 2: Test saved chats modal functionality
    testSavedChatsModal: async function() {
        console.log('🔍 Testing saved chats modal functionality...');
        
        try {
            // Open the modal
            if (typeof showSavedChatsModal === 'function') {
                await showSavedChatsModal();
                
                const modal = document.getElementById('savedChatsModal');
                if (modal && modal.classList.contains('show')) {
                    console.log('✅ Saved chats modal opened successfully');
                    
                    // Check if saved chats are displayed
                    const savedChatsList = document.getElementById('savedChatsList');
                    if (savedChatsList) {
                        const bookmarkedChats = chatState.conversations.filter(c => c.is_bookmarked);
                        const displayedChats = savedChatsList.children.length;
                        
                        console.log(`📊 Bookmarked conversations: ${bookmarkedChats.length}`);
                        console.log(`📊 Displayed in modal: ${displayedChats}`);
                        
                        if (bookmarkedChats.length > 0) {
                            // Test dropdown functionality
                            const firstDropdown = savedChatsList.querySelector('.conversation-dropdown');
                            if (firstDropdown) {
                                console.log(`✅ Dropdown found with ID: ${firstDropdown.id}`);
                                
                                // Check dropdown content
                                const dropdownItems = firstDropdown.querySelectorAll('.conversation-dropdown-item');
                                console.log(`📊 Dropdown items: ${dropdownItems.length}`);
                                
                                dropdownItems.forEach((item, index) => {
                                    const text = item.textContent.trim();
                                    console.log(`  ${index + 1}. ${text}`);
                                });
                                
                                if (dropdownItems.length >= 3) {
                                    console.log('✅ All expected dropdown items present (Rename, Remove, Delete)');
                                } else {
                                    console.log('⚠️ Some dropdown items may be missing');
                                }
                            }
                        }
                    }
                    
                    // Close modal after test
                    setTimeout(() => {
                        modal.classList.remove('show');
                        console.log('✅ Modal closed after test');
                    }, 2000);
                    
                } else {
                    console.log('❌ Modal not opened or not visible');
                }
            } else {
                console.log('❌ showSavedChatsModal function not available');
            }
        } catch (error) {
            console.error('❌ Error testing saved chats modal:', error);
        }
    },
    
    // Test 3: Test cross-section synchronization
    testCrossSectionSync: async function() {
        console.log('🔍 Testing cross-section synchronization...');
        
        if (chatState.conversations.length === 0) {
            console.log('⚠️ No conversations available for testing');
            return;
        }
        
        // Find a bookmarked conversation or create one
        let testConversation = chatState.conversations.find(c => c.is_bookmarked);
        
        if (!testConversation) {
            // Bookmark the first conversation for testing
            testConversation = chatState.conversations[0];
            console.log(`🧪 Bookmarking conversation for test: "${testConversation.title}"`);
            
            const mockEvent = { stopPropagation: () => {} };
            await toggleBookmark(mockEvent, testConversation.id, true);
            
            testConversation = chatState.conversations.find(c => c.id === testConversation.id);
        }
        
        if (testConversation && testConversation.is_bookmarked) {
            console.log(`🧪 Testing with bookmarked conversation: "${testConversation.title}"`);
            
            // Test 1: Check if conversation appears in both sections
            const regularConvElement = document.querySelector(`.conversations-list .conversation-item[data-id="${testConversation.id}"]`);
            
            if (regularConvElement) {
                console.log('✅ Conversation found in regular conversations list');
                
                // Check bookmark button state
                const bookmarkBtn = regularConvElement.querySelector('.conversation-bookmark-btn');
                if (bookmarkBtn && bookmarkBtn.classList.contains('active')) {
                    console.log('✅ Bookmark button is active in regular list');
                } else {
                    console.log('❌ Bookmark button not active in regular list');
                }
            } else {
                console.log('❌ Conversation not found in regular conversations list');
            }
            
            // Test 2: Open saved chats modal and check if conversation appears there
            await showSavedChatsModal();
            
            setTimeout(() => {
                const savedChatsList = document.getElementById('savedChatsList');
                if (savedChatsList) {
                    const savedConvElement = savedChatsList.querySelector(`.conversation-item[data-id="${testConversation.id}"]`);
                    
                    if (savedConvElement) {
                        console.log('✅ Conversation found in saved chats modal');
                        
                        // Check if dropdown has correct ID
                        const dropdown = savedConvElement.querySelector('.conversation-dropdown');
                        if (dropdown && dropdown.id === `saved-dropdown-${testConversation.id}`) {
                            console.log('✅ Dropdown has correct unique ID for saved chats');
                        } else {
                            console.log('❌ Dropdown ID incorrect or missing');
                        }
                    } else {
                        console.log('❌ Conversation not found in saved chats modal');
                    }
                }
                
                // Close modal
                const modal = document.getElementById('savedChatsModal');
                if (modal) {
                    modal.classList.remove('show');
                }
            }, 1000);
            
        } else {
            console.log('❌ Could not create or find bookmarked conversation for testing');
        }
    },
    
    // Test 4: Test rename functionality
    testRenameFunctionality: async function() {
        console.log('🔍 Testing rename functionality...');
        
        if (chatState.conversations.length === 0) {
            console.log('⚠️ No conversations available for testing');
            return;
        }
        
        const testConversation = chatState.conversations[0];
        const originalTitle = testConversation.title;
        const testTitle = `Test Rename ${Date.now()}`;
        
        console.log(`🧪 Testing rename on: "${originalTitle}"`);
        
        try {
            // Test the saved chat rename function
            if (typeof renameSavedConversation === 'function') {
                console.log('✅ renameSavedConversation function available');
                
                // Mock the prompt function for testing
                const originalPrompt = window.prompt;
                window.prompt = () => testTitle;
                
                await renameSavedConversation(testConversation.id);
                
                // Restore original prompt
                window.prompt = originalPrompt;
                
                // Check if title was updated
                const updatedConversation = chatState.conversations.find(c => c.id === testConversation.id);
                if (updatedConversation && updatedConversation.title === testTitle) {
                    console.log('✅ Conversation renamed successfully');
                    
                    // Restore original title
                    window.prompt = () => originalTitle;
                    await renameSavedConversation(testConversation.id);
                    window.prompt = originalPrompt;
                    
                    console.log('✅ Original title restored');
                } else {
                    console.log('❌ Conversation rename failed');
                }
            } else {
                console.log('❌ renameSavedConversation function not available');
            }
        } catch (error) {
            console.error('❌ Error testing rename functionality:', error);
        }
    },
    
    // Test 5: Test available functions
    testAvailableFunctions: function() {
        console.log('🔍 Testing available functions...');
        
        const requiredFunctions = [
            'showSavedChatsModal',
            'toggleSavedChatMenu',
            'renameSavedConversation',
            'deleteSavedConversation',
            'removeFromSavedWithAnimation',
            'toggleBookmark',
            'updateSavedChatsList'
        ];
        
        requiredFunctions.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                console.log(`✅ ${funcName} function available`);
            } else {
                console.log(`❌ ${funcName} function NOT available`);
            }
        });
    },
    
    // Run all tests
    runAllTests: async function() {
        console.log('🚀 Running comprehensive saved chats functionality tests...\n');
        
        this.testAvailableFunctions();
        console.log('\n');
        
        this.testDropdownIDs();
        console.log('\n');
        
        await this.testSavedChatsModal();
        console.log('\n');
        
        await this.testCrossSectionSync();
        console.log('\n');
        
        await this.testRenameFunctionality();
        console.log('\n');
        
        console.log('✅ All saved chats tests completed!');
        console.log('💡 Manual test: Click "Saved Chats" button, then click 3-dots on any saved chat');
        console.log('💡 Verify: Dropdown opens in correct location with Rename, Remove, Delete options');
    }
};

// Auto-run tests when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('🧪 Saved chats functionality tests available!');
        console.log('Run: testSavedChats.runAllTests() to test everything');
        console.log('Or run individual tests like: testSavedChats.testSavedChatsModal()');
    }, 3000);
});

// Export for console access
window.testSavedChats = window.testSavedChats;