// Vercel Serverless Function for Gemini API
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
        const { prompt, model = 'gemini-2.5-flash' } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Get API key from environment variables
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('❌ Gemini API key not found in environment variables');
            return res.status(500).json({ 
                error: 'Gemini API key not configured',
                details: 'GEMINI_API_KEY environment variable is missing. Please configure it in Vercel Environment Variables.'
            });
        }

        // Determine the correct model name
        const geminiModel = model.includes('gemini') ? model : 'gemini-2.5-flash';
        
        // Log debug information
        console.log('🔄 Gemini API Request:', {
            model: geminiModel,
            promptLength: prompt.length,
            timestamp: new Date().toISOString()
        });

        // Use v1/models endpoint (latest stable version)
        const url = `https://generativelanguage.googleapis.com/v1/models/${geminiModel}:generateContent?key=${apiKey}`;

        // Make request to Gemini API with enhanced error handling
        const response = await fetch(url, {
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
            }),
            timeout: 30000 // 30 second timeout
        });

        console.log('✅ Gemini API Response Status:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || errorData.message || 'Unknown error';

            console.error('❌ Gemini API error:', {
                status: response.status,
                statusText: response.statusText,
                errorData,
                model: geminiModel
            });

            // Provide specific error messages for common issues
            let userFriendlyError = errorMessage;
            
            if (response.status === 401 || response.status === 403) {
                userFriendlyError = 'Invalid or expired API key. Please check your GEMINI_API_KEY in Vercel environment variables.';
            } else if (response.status === 429) {
                userFriendlyError = 'Rate limit exceeded. Please wait a moment and try again.';
            } else if (response.status === 400) {
                userFriendlyError = 'Invalid request format. Model might not be available or prompt is malformed.';
            }

            return res.status(response.status).json({
                error: `Gemini API Error: ${response.status} - ${userFriendlyError}`,
                status: response.status,
                details: errorMessage
            });
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            console.error('❌ Invalid response structure from Gemini API:', data);
            return res.status(500).json({ 
                error: 'Invalid response from Gemini API',
                details: 'Response structure is unexpected'
            });
        }

        // Return the response
        console.log('✅ Gemini API Success:', { model: geminiModel, responseLength: data.candidates[0].content.parts[0].text.length });
        
        return res.status(200).json({
            success: true,
            response: data.candidates[0].content.parts[0].text.trim(),
            model: geminiModel
        });

    } catch (error) {
        console.error('❌ Serverless function error:', {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message,
            details: 'Check the Vercel logs for more details'
        });
    }
}