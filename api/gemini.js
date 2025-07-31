// Vercel Serverless Function for Gemini API with Multiple Key Support
import apiKeyManager from './api-key-manager.js';

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
        const { prompt, model = 'gemini-1.5-flash' } = req.body;

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
                selectedKey = apiKeyManager.getNextGeminiKey();
                const apiKey = selectedKey.key;
                
                console.log(`Attempt ${attempt + 1}: Using Gemini key ${selectedKey.index}`);

                // Determine the correct model name
                const geminiModel = model.includes('gemini') ? model : 'gemini-1.5-flash';
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

                // Make request to Gemini API
                response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 1024
                        }
                    })
                });

                if (response.ok) {
                    // Success! Break out of retry loop
                    break;
                } else {
                    // Handle API errors
                    const errorData = await response.json().catch(() => ({}));
                    const errorMessage = errorData.error?.message || 'Unknown error';
                    lastError = new Error(`Gemini API Error: ${response.status} - ${errorMessage}`);
                    
                    console.error('Gemini API error:', {
                        keyIndex: selectedKey.index,
                        status: response.status,
                        statusText: response.statusText,
                        errorData
                    });

                    // Mark key as failed if it's a rate limit or auth error
                    if (response.status === 429 || response.status === 401 || response.status === 403) {
                        apiKeyManager.markKeyAsFailed('gemini', selectedKey.index, lastError);
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
                console.error(`Gemini API attempt ${attempt + 1} failed:`, error);
                
                if (selectedKey) {
                    apiKeyManager.markKeyAsFailed('gemini', selectedKey.index, error);
                }
                
                // If this is the last attempt, continue to error handling
                if (attempt === maxRetries - 1) {
                    break;
                }
            }
        }

        // If we get here and response is not ok, handle the error
        if (!response || !response.ok) {
            console.error('All Gemini API attempts failed');
            return res.status(500).json({
                error: 'All Gemini API keys failed',
                message: lastError?.message || 'Unknown error',
                attempts: maxRetries
            });
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            return res.status(500).json({ error: 'Invalid response from Gemini API' });
        }

        // Return the response with key info
        return res.status(200).json({
            success: true,
            response: data.candidates[0].content.parts[0].text.trim(),
            model: geminiModel,
            keyUsed: selectedKey.index,
            stats: apiKeyManager.getStats().gemini
        });

    } catch (error) {
        console.error('Serverless function error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}