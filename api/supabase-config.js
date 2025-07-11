// Vercel Serverless Function for Supabase Configuration
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
        // Get Supabase configuration from environment variables or fallback to hardcoded values
        const supabaseUrl = process.env.SUPABASE_URL ;
        const supabaseKey = process.env.SUPABASE_KEY ;

        if (!supabaseUrl || !supabaseKey) {
            console.error('Supabase configuration not found');
            return res.status(500).json({ 
                error: 'Supabase configuration not available',
                configured: false
            });
        }

        // Return the configuration (anon key is safe to expose to frontend)
        return res.status(200).json({
            success: true,
            configured: true,
            config: {
                url: supabaseUrl,
                key: supabaseKey // This is the anon/public key
            }
        });

    } catch (error) {
        console.error('Supabase configuration error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message,
            configured: false
        });
    }
}