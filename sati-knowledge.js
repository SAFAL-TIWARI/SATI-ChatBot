// SATI AI Assistant - Enhanced Knowledge Base Manager (JavaScript Version)

// Global variables to store loaded data
let SATI_KNOWLEDGE_BASE = {};
let KEYWORD_CATEGORIES = {};
let SATI_ENHANCED_PROMPTS = {};
let DISPLAY_PROMPTS = {};
let SATI_KEYWORDS = [];
let SATI_AI_PROMPT = '';

// Load SATI data from JSON file
async function loadSATIData() {
    try {
        const response = await fetch('sati-data.json');
        if (!response.ok) {
            throw new Error(`Failed to load SATI data: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Initialize global variables
        SATI_KNOWLEDGE_BASE = data.knowledge_base || {};
        KEYWORD_CATEGORIES = data.keyword_categories || {};
        SATI_ENHANCED_PROMPTS = data.enhanced_prompts || {};
        DISPLAY_PROMPTS = data.display_prompts || {};
        SATI_KEYWORDS = data.sati_keywords || [];
        SATI_AI_PROMPT = data.ai_prompt || '';
        
        console.log('✅ SATI data loaded successfully');
        return true;
    } catch (error) {
        console.error('❌ Error loading SATI data:', error);
        
        // Fallback to default data if JSON loading fails
        initializeDefaultData();
        return false;
    }
}

// Initialize default data as fallback
function initializeDefaultData() {
    console.log('⚠️ Using default SATI data as fallback');
    
    SATI_KNOWLEDGE_BASE = {
        institute_overview: {
            title: "Institute Overview",
            source: "Wikipedia & Official Website",
            content: "Samrat Ashok Technological Institute (SATI) is a Grant-in-Aid Autonomous college located in Vidisha, Madhya Pradesh, India."
        }
    };
    
    KEYWORD_CATEGORIES = {
        institute: ['sati', 'samrat ashok', 'technological institute', 'vidisha']
    };
    
    SATI_ENHANCED_PROMPTS = {
        institute: "Tell me about SATI Vidisha."
    };
    
    DISPLAY_PROMPTS = {
        institute: "Tell me about SATI's background"
    };
    
    SATI_KEYWORDS = ['sati', 'samrat ashok', 'technological institute', 'vidisha'];
    
    SATI_AI_PROMPT = "You are SATI AI Assistant, a knowledgeable and helpful AI specifically designed to provide accurate information about Samrat Ashok Technological Institute (SATI), Vidisha, Madhya Pradesh, India.";
}

// Enhanced function to get contextual prompt based on query type
function getContextualPrompt(userQuery) {
    const queryLower = userQuery.toLowerCase();
    const relevantContexts = [];
    const detectedCategories = [];

    // Enhanced keyword detection with multiple categories
    for (const [category, keywords] of Object.entries(KEYWORD_CATEGORIES)) {
        const hasKeyword = keywords.some(keyword => queryLower.includes(keyword));
        if (hasKeyword) {
            detectedCategories.push(category);
            if (SATI_KNOWLEDGE_BASE[category]) {
                relevantContexts.push(SATI_KNOWLEDGE_BASE[category].content);
            }
        }
    }

    // Fallback to general overview if no specific category detected
    if (relevantContexts.length === 0) {
        relevantContexts.push(SATI_KNOWLEDGE_BASE.institute_overview?.content || 'SATI is an engineering college in Vidisha, Madhya Pradesh.');
    }

    // Combine relevant contexts
    const context = relevantContexts.join('\n\n');

    return `${SATI_AI_PROMPT}\n\nRELEVANT CONTEXT FOR YOUR QUERY:\n${context}\n\nUser Query: ${userQuery}\n\nPlease provide a helpful and accurate response based on the above information.`;
}

// Enhanced function to check if query is SATI-related
function isSATIRelated(query) {
    const queryLower = query.toLowerCase();
    return SATI_KEYWORDS.some(keyword => queryLower.includes(keyword));
}

// Enhanced function to detect query category
function detectQueryCategory(query) {
    const queryLower = query.toLowerCase();
    
    for (const [category, keywords] of Object.entries(KEYWORD_CATEGORIES)) {
        if (keywords.some(keyword => queryLower.includes(keyword))) {
            return category;
        }
    }
    
    return 'general';
}

// Default prompt for general queries
function getDefaultPrompt() {
    return SATI_AI_PROMPT;
}

// Function to get enhanced prompt by type
function getEnhancedPrompt(promptType) {
    return SATI_ENHANCED_PROMPTS[promptType] || "Tell me about SATI Vidisha.";
}

// Function to get display prompt for UI
function getDisplayPrompt(promptType) {
    return DISPLAY_PROMPTS[promptType] || "Tell me about SATI Vidisha.";
}

// Function to get knowledge base content by category
function getKnowledgeBaseContent(category) {
    return SATI_KNOWLEDGE_BASE[category]?.content || '';
}

// Function to get all available categories
function getAvailableCategories() {
    return Object.keys(SATI_KNOWLEDGE_BASE);
}

// Function to get all keyword categories
function getKeywordCategories() {
    return Object.keys(KEYWORD_CATEGORIES);
}

// Function to check if data is loaded
function isDataLoaded() {
    return Object.keys(SATI_KNOWLEDGE_BASE).length > 0;
}

// Make the functions available globally
window.getEnhancedPrompt = getEnhancedPrompt;
window.getDisplayPrompt = getDisplayPrompt;
window.detectQueryCategory = detectQueryCategory;
window.isSATIRelated = isSATIRelated;
window.getContextualPrompt = getContextualPrompt;
window.getKnowledgeBaseContent = getKnowledgeBaseContent;
window.getAvailableCategories = getAvailableCategories;
window.getKeywordCategories = getKeywordCategories;
window.isDataLoaded = isDataLoaded;
window.loadSATIData = loadSATIData;

// Auto-load data when script is loaded
if (typeof window !== 'undefined') {
    // Load data immediately
    loadSATIData().then(success => {
        if (success) {
            console.log('🎓 SATI AI Assistant initialized successfully');
        } else {
            console.log('⚠️ SATI AI Assistant initialized with fallback data');
        }
    });
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SATI_KNOWLEDGE_BASE,
        KEYWORD_CATEGORIES,
        SATI_ENHANCED_PROMPTS,
        DISPLAY_PROMPTS,
        SATI_KEYWORDS,
        SATI_AI_PROMPT,
        getContextualPrompt,
        isSATIRelated,
        getDefaultPrompt,
        getEnhancedPrompt,
        getDisplayPrompt,
        detectQueryCategory,
        getKnowledgeBaseContent,
        getAvailableCategories,
        getKeywordCategories,
        isDataLoaded,
        loadSATIData
    };
}