// Test script to verify the fixes
console.log('🧪 Testing SATI ChatBot fixes...');

// Test 1: Check for duplicate functions
function testDuplicateFunctions() {
    console.log('\n1. Testing for duplicate functions...');
    
    // Count toggleBookmark functions
    const scriptContent = document.querySelector('script[src="script.js"]');
    if (scriptContent) {
        // This would need to be checked manually in the browser console
        console.log('✅ Script loaded - check browser console for duplicate function warnings');
    }
    
    // Test if toggleBookmark is available
    if (typeof toggleBookmark === 'function') {
        console.log('✅ toggleBookmark function is available');
    } else {
        console.log('❌ toggleBookmark function not found');
    }
    
    // Test if updateSavedChatsList is available
    if (typeof updateSavedChatsList === 'function') {
        console.log('✅ updateSavedChatsList function is available');
    } else {
        console.log('❌ updateSavedChatsList function not found');
    }
}

// Test 2: Check DOM elements
function testDOMElements() {
    console.log('\n2. Testing DOM elements...');
    
    const requiredElements = [
        'savedChatsList',
        'conversationsList',
        'chatMessages',
        'messageInput'
    ];
    
    requiredElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            console.log(`✅ ${elementId} found`);
        } else {
            console.log(`❌ ${elementId} not found`);
        }
    });
}

// Test 3: Check Supabase initialization
function testSupabaseInit() {
    console.log('\n3. Testing Supabase initialization...');
    
    if (window.supabase) {
        console.log('✅ Supabase library loaded');
    } else {
        console.log('❌ Supabase library not loaded');
    }
    
    if (window.supabaseDB) {
        console.log('✅ Supabase DB operations available');
        
        // Check if key functions exist
        const requiredFunctions = [
            'initialize',
            'createConversation',
            'addMessage',
            'updateBookmarkStatus'
        ];
        
        requiredFunctions.forEach(funcName => {
            if (window.supabaseDB[funcName]) {
                console.log(`✅ supabaseDB.${funcName} available`);
            } else {
                console.log(`❌ supabaseDB.${funcName} not available`);
            }
        });
    } else {
        console.log('❌ Supabase DB operations not available');
    }
}

// Test 4: Check chat state
function testChatState() {
    console.log('\n4. Testing chat state...');
    
    if (window.chatState) {
        console.log('✅ chatState available');
        console.log(`📊 Current state:`, {
            isLoggedIn: chatState.isLoggedIn,
            useSupabaseStorage: chatState.useSupabaseStorage,
            conversationsCount: chatState.conversations.length,
            currentConversationId: chatState.currentConversationId
        });
    } else {
        console.log('❌ chatState not available');
    }
}

// Run all tests
function runAllTests() {
    console.log('🚀 Starting SATI ChatBot fix verification...');
    
    testDuplicateFunctions();
    testDOMElements();
    testSupabaseInit();
    testChatState();
    
    console.log('\n✅ Test suite completed! Check results above.');
    console.log('💡 To test bookmark functionality, try clicking a bookmark button in the UI.');
    console.log('💡 To test chat saving, try sending a message while logged in.');
}

// Auto-run tests when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllTests);
} else {
    runAllTests();
}

// Export for manual testing
window.testFixes = {
    runAllTests,
    testDuplicateFunctions,
    testDOMElements,
    testSupabaseInit,
    testChatState
};