// Vercel Serverless Function for Groq API

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

        // Get API key from environment variables
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            console.error('Groq API key not found in environment variables');
            return res.status(500).json({ error: 'Groq API key not configured' });
        }

        // Make request to Groq API
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || 'Unknown error';

            console.error('Groq API error:', {
                status: response.status,
                statusText: response.statusText,
                errorData
            });

            return res.status(response.status).json({
                error: `Groq API Error: ${response.status} - ${errorMessage}`,
                status: response.status
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

        // Return the response
        return res.status(200).json({
            success: true,
            response: responseContent,
            model: model
        });

    } catch (error) {
        console.error('Serverless function error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}