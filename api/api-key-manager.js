// API Key Manager for Load Balancing and Failover
// This module handles multiple API keys for both Groq and Gemini services

class APIKeyManager {
    constructor() {
        // Initialize API keys from environment variables
        this.groqKeys = this.loadAPIKeys('GROQ_API_KEY');
        this.geminiKeys = this.loadAPIKeys('GEMINI_API_KEY');
        
        // Track current key index for round-robin distribution
        this.currentGroqIndex = 0;
        this.currentGeminiIndex = 0;
        
        // Track failed keys to avoid using them temporarily
        this.failedGroqKeys = new Set();
        this.failedGeminiKeys = new Set();
        
        // Reset failed keys after 5 minutes
        this.resetFailedKeysInterval = 5 * 60 * 1000; // 5 minutes
        
        console.log(`Loaded ${this.groqKeys.length} Groq API keys and ${this.geminiKeys.length} Gemini API keys`);
    }
    
    /**
     * Load API keys from environment variables
     * Supports both numbered keys (KEY_1, KEY_2, etc.) and legacy single key
     */
    loadAPIKeys(keyPrefix) {
        const keys = [];
        
        // Try to load numbered keys first (KEY_1, KEY_2, KEY_3, etc.)
        for (let i = 1; i <= 10; i++) {
            const key = process.env[`${keyPrefix}_${i}`];
            if (key && key.trim()) {
                keys.push({
                    key: key.trim(),
                    index: i,
                    lastUsed: 0,
                    failCount: 0
                });
            }
        }
        
        // If no numbered keys found, try legacy single key
        if (keys.length === 0) {
            const legacyKey = process.env[keyPrefix];
            if (legacyKey && legacyKey.trim()) {
                keys.push({
                    key: legacyKey.trim(),
                    index: 0,
                    lastUsed: 0,
                    failCount: 0
                });
            }
        }
        
        return keys;
    }
    
    /**
     * Get next available Groq API key using round-robin with failover
     */
    getNextGroqKey() {
        return this.getNextKey(this.groqKeys, this.currentGroqIndex, this.failedGroqKeys, 'groq');
    }
    
    /**
     * Get next available Gemini API key using round-robin with failover
     */
    getNextGeminiKey() {
        return this.getNextKey(this.geminiKeys, this.currentGeminiIndex, this.failedGeminiKeys, 'gemini');
    }
    
    /**
     * Generic method to get next available API key
     */
    getNextKey(keyArray, currentIndex, failedKeys, service) {
        if (keyArray.length === 0) {
            throw new Error(`No ${service} API keys available`);
        }
        
        // Find available keys (not in failed set)
        const availableKeys = keyArray.filter((_, index) => !failedKeys.has(index));
        
        if (availableKeys.length === 0) {
            // If all keys are failed, reset failed keys and try again
            console.warn(`All ${service} keys failed, resetting failed keys list`);
            failedKeys.clear();
            return keyArray[0];
        }
        
        // Use round-robin among available keys
        const keyIndex = currentIndex % availableKeys.length;
        const selectedKey = availableKeys[keyIndex];
        
        // Update current index for next request
        if (service === 'groq') {
            this.currentGroqIndex = (this.currentGroqIndex + 1) % availableKeys.length;
        } else {
            this.currentGeminiIndex = (this.currentGeminiIndex + 1) % availableKeys.length;
        }
        
        // Update last used timestamp
        selectedKey.lastUsed = Date.now();
        
        console.log(`Selected ${service} key ${selectedKey.index} (${keyIndex + 1}/${availableKeys.length} available)`);
        return selectedKey;
    }
    
    /**
     * Mark a key as failed temporarily
     */
    markKeyAsFailed(service, keyIndex, error) {
        console.warn(`Marking ${service} key ${keyIndex} as failed:`, error.message);
        
        if (service === 'groq') {
            this.failedGroqKeys.add(keyIndex);
            if (keyIndex < this.groqKeys.length) {
                this.groqKeys[keyIndex].failCount++;
            }
        } else if (service === 'gemini') {
            this.failedGeminiKeys.add(keyIndex);
            if (keyIndex < this.geminiKeys.length) {
                this.geminiKeys[keyIndex].failCount++;
            }
        }
        
        // Reset failed keys after interval
        setTimeout(() => {
            if (service === 'groq') {
                this.failedGroqKeys.delete(keyIndex);
            } else {
                this.failedGeminiKeys.delete(keyIndex);
            }
            console.log(`Reset failed status for ${service} key ${keyIndex}`);
        }, this.resetFailedKeysInterval);
    }
    
    /**
     * Get statistics about API key usage
     */
    getStats() {
        return {
            groq: {
                total: this.groqKeys.length,
                available: this.groqKeys.length - this.failedGroqKeys.size,
                failed: this.failedGroqKeys.size,
                keys: this.groqKeys.map(k => ({
                    index: k.index,
                    lastUsed: k.lastUsed,
                    failCount: k.failCount
                }))
            },
            gemini: {
                total: this.geminiKeys.length,
                available: this.geminiKeys.length - this.failedGeminiKeys.size,
                failed: this.failedGeminiKeys.size,
                keys: this.geminiKeys.map(k => ({
                    index: k.index,
                    lastUsed: k.lastUsed,
                    failCount: k.failCount
                }))
            }
        };
    }
}

// Create singleton instance
const apiKeyManager = new APIKeyManager();

export default apiKeyManager;