// Vercel Serverless Function for Groq API with Multiple Key Support
import apiKeyManager from './api-key-manager.js';

// Function to filter out <think> tags from Deepseek R1 responses
function filterDeepseekThinkTags(content) {
    if (!content) return content;

    // Remove <think>...</think> blocks (including multiline)
    // This regex matches <think> opening tag, any content (including newlines), and </think> closing tag
    const thinkTagRegex = /<think>[\s\S]*?<\/think>/gi;

    // Remove the think tags and clean up extra whitespace
    let filteredContent = content.replace(thinkTagRegex, '').trim();

    // Clean up multiple consecutive newlines and spaces
    filteredContent = filteredContent.replace(/\n\s*\n\s*\n/g, '\n\n');
    filteredContent = filteredContent.replace(/^\s+|\s+$/g, '');

    // If the filtered content is empty or only whitespace, return a fallback message
    if (!filteredContent || filteredContent.length === 0) {
        return "I apologize, but I couldn't generate a proper response. Please try asking your question again.";
    }

    return filteredContent;
}

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { prompt, model = 'llama-3.1-8b-instant' } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Get API key using the key manager with failover support
        let selectedKey;
        let response;
        let lastError;
        const maxRetries = 3;
        
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                selectedKey = apiKeyManager.getNextGroqKey();
                const apiKey = selectedKey.key;
                
                console.log(`Attempt ${attempt + 1}: Using Groq key ${selectedKey.index}`);

                // Make request to Groq API
                response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            {
                                role: 'user',
                                content: prompt
                            }
                        ],
                        temperature: 0.7,
                        max_tokens: 1024,
                        stream: false
                    })
                });

                if (response.ok) {
                    // Success! Break out of retry loop
                    break;
                } else {
                    // Handle API errors
                    const errorData = await response.json().catch(() => ({}));
                    const errorMessage = errorData.error?.message || 'Unknown error';
                    lastError = new Error(`Groq API Error: ${response.status} - ${errorMessage}`);
                    
                    console.error('Groq API error:', {
                        keyIndex: selectedKey.index,
                        status: response.status,
                        statusText: response.statusText,
                        errorData
                    });

                    // Mark key as failed if it's a rate limit or auth error
                    if (response.status === 429 || response.status === 401 || response.status === 403) {
                        apiKeyManager.markKeyAsFailed('groq', selectedKey.index, lastError);
                    }
                    
                    // If this is the last attempt, return the error
                    if (attempt === maxRetries - 1) {
                        return res.status(response.status).json({
                            error: lastError.message,
                            status: response.status,
                            keyUsed: selectedKey.index
                        });
                    }
                }
            } catch (error) {
                lastError = error;
                console.error(`Groq API attempt ${attempt + 1} failed:`, error);
                
                if (selectedKey) {
                    apiKeyManager.markKeyAsFailed('groq', selectedKey.index, error);
                }
                
                // If this is the last attempt, continue to error handling
                if (attempt === maxRetries - 1) {
                    break;
                }
            }
        }

        // If we get here and response is not ok, handle the error
        if (!response || !response.ok) {
            console.error('All Groq API attempts failed');
            return res.status(500).json({
                error: 'All Groq API keys failed',
                message: lastError?.message || 'Unknown error',
                attempts: maxRetries
            });
        }

        const data = await response.json();

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            return res.status(500).json({ error: 'Invalid response from Groq API' });
        }

        let responseContent = data.choices[0].message.content.trim();

        // Filter out <think> tags for Deepseek R1 model
        if (model === 'deepseek-r1-distill-llama-70b') {
            const originalLength = responseContent.length;
            const hasThinkTags = responseContent.includes('<think>');

            responseContent = filterDeepseekThinkTags(responseContent);

            // Log filtering activity for debugging
            if (hasThinkTags) {
                console.log(`Deepseek R1 think tags filtered: ${originalLength} -> ${responseContent.length} chars`);
            }
        }

        // Return the response with key info
        return res.status(200).json({
            success: true,
            response: responseContent,
            model: model,
            keyUsed: selectedKey.index,
            stats: apiKeyManager.getStats().groq
        });

    } catch (error) {
        console.error('Serverless function error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}