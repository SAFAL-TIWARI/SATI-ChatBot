// Health check endpoint for Vercel deployment
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Basic health check
        const healthStatus = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'production',
            nodeVersion: process.version,
            apis: {
                groq: !!process.env.GROQ_API_KEY,
                gemini: !!process.env.GEMINI_API_KEY
            }
        };

        return res.status(200).json(healthStatus);

    } catch (error) {
        console.error('Health check error:', error);
        return res.status(500).json({ 
            status: 'unhealthy',
            error: 'Internal server error',
            timestamp: new Date().toISOString()
        });
    }
}