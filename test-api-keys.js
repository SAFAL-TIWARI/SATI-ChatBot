// Test script for Multiple API Key System
// Run this in the browser console to test the API key rotation

async function testAPIKeyRotation() {
    console.log('🧪 Testing API Key Rotation System...\n');
    
    if (!window.apiManager) {
        console.error('❌ API Manager not initialized');
        return;
    }

    // Test multiple requests to see key rotation
    const testPrompts = [
        "Hello, this is test 1",
        "Hello, this is test 2", 
        "Hello, this is test 3",
        "Hello, this is test 4",
        "Hello, this is test 5"
    ];

    console.log('📊 Initial API Status:');
    await window.showAPIStatus();
    console.log('\n');

    // Test Groq API key rotation
    if (window.apiManager.isGroqConfigured()) {
        console.log('🔄 Testing Groq API Key Rotation...');
        window.apiManager.setProvider('groq');
        
        for (let i = 0; i < testPrompts.length; i++) {
            try {
                console.log(`\n📤 Groq Test ${i + 1}:`);
                const response = await window.apiManager.sendMessage(testPrompts[i]);
                console.log(`✅ Response received (length: ${response?.length || 0})`);
                
                // Show current stats
                if (window.apiManager.apiStats?.groq) {
                    const stats = window.apiManager.apiStats.groq;
                    console.log(`📊 Key ${stats.lastKeyUsed} used, ${stats.available}/${stats.total} available`);
                }
            } catch (error) {
                console.error(`❌ Groq Test ${i + 1} failed:`, error.message);
            }
            
            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    // Test Gemini API key rotation
    if (window.apiManager.isGeminiConfigured()) {
        console.log('\n🔄 Testing Gemini API Key Rotation...');
        window.apiManager.setProvider('gemini');
        
        for (let i = 0; i < testPrompts.length; i++) {
            try {
                console.log(`\n📤 Gemini Test ${i + 1}:`);
                const response = await window.apiManager.sendMessage(testPrompts[i]);
                console.log(`✅ Response received (length: ${response?.length || 0})`);
                
                // Show current stats
                if (window.apiManager.apiStats?.gemini) {
                    const stats = window.apiManager.apiStats.gemini;
                    console.log(`📊 Key ${stats.lastKeyUsed} used, ${stats.available}/${stats.total} available`);
                }
            } catch (error) {
                console.error(`❌ Gemini Test ${i + 1} failed:`, error.message);
            }
            
            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    console.log('\n📊 Final API Status:');
    await window.showAPIStatus();
    
    console.log('\n✅ API Key Rotation Test Complete!');
    console.log('💡 Check the logs above to see which keys were used for each request');
}

// Test API status endpoint
async function testAPIStatusEndpoint() {
    console.log('🧪 Testing API Status Endpoint...\n');
    
    try {
        const response = await fetch('/api/api-status');
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API Status Endpoint Response:');
            console.log(JSON.stringify(data, null, 2));
        } else {
            console.error('❌ API Status Endpoint failed:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('❌ API Status Endpoint error:', error);
    }
}

// Simulate API key failure for testing failover
async function simulateKeyFailure() {
    console.log('🧪 Simulating API Key Failure...\n');
    
    if (!window.apiManager) {
        console.error('❌ API Manager not initialized');
        return;
    }

    // This would normally be done by the server-side key manager
    // For testing, we can manually mark a key as failed
    console.log('⚠️ This test requires server-side implementation');
    console.log('💡 To test failover, temporarily disable one of your API keys');
    console.log('💡 Then run testAPIKeyRotation() to see automatic failover');
}

// Make functions available globally for testing
window.testAPIKeyRotation = testAPIKeyRotation;
window.testAPIStatusEndpoint = testAPIStatusEndpoint;
window.simulateKeyFailure = simulateKeyFailure;

console.log('🧪 API Key Test Functions Loaded!');
console.log('📝 Available test functions:');
console.log('  • testAPIKeyRotation() - Test key rotation with multiple requests');
console.log('  • testAPIStatusEndpoint() - Test the API status endpoint');
console.log('  • simulateKeyFailure() - Instructions for testing failover');
console.log('  • showAPIStatus() - Show current API key statistics');
console.log('  • debugAPIConfig() - Show API configuration debug info');