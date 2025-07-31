// API Status Endpoint - Check health and statistics of all API keys
import apiKeyManager from './api-key-manager.js';

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
        const stats = apiKeyManager.getStats();
        
        // Add system information
        const systemInfo = {
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            version: '1.0.0'
        };

        // Calculate overall health
        const totalKeys = stats.groq.total + stats.gemini.total;
        const availableKeys = stats.groq.available + stats.gemini.available;
        const healthPercentage = totalKeys > 0 ? Math.round((availableKeys / totalKeys) * 100) : 0;
        
        const healthStatus = {
            status: healthPercentage >= 75 ? 'healthy' : healthPercentage >= 50 ? 'degraded' : 'critical',
            percentage: healthPercentage,
            message: `${availableKeys}/${totalKeys} API keys available`
        };

        return res.status(200).json({
            success: true,
            health: healthStatus,
            system: systemInfo,
            apiKeys: stats
        });

    } catch (error) {
        console.error('API status check failed:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to get API status',
            message: error.message
        });
    }
}