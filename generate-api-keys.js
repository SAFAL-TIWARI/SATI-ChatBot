#!/usr/bin/env node

/**
 * Script to generate api-keys.json from .env file
 * This is for development purposes only
 * 
 * Usage: node generate-api-keys.js
 */

const fs = require('fs');
const path = require('path');

function loadEnvFile() {
    try {
        const envPath = path.join(__dirname, '.env');
        const envContent = fs.readFileSync(envPath, 'utf8');
        
        const envVars = {};
        envContent.split('\n').forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith('#')) {
                const [key, ...valueParts] = trimmedLine.split('=');
                if (key && valueParts.length > 0) {
                    envVars[key.trim()] = valueParts.join('=').trim();
                }
            }
        });
        
        return envVars;
    } catch (error) {
        console.error('Error reading .env file:', error.message);
        return null;
    }
}

function generateApiKeysFile() {
    const envVars = loadEnvFile();
    
    if (!envVars) {
        console.error('❌ Failed to load environment variables');
        process.exit(1);
    }
    
    const apiKeys = {
        GROQ_API_KEY: envVars.GROQ_API_KEY || null,
        GEMINI_API_KEY: envVars.GEMINI_API_KEY || null
    };
    
    // Check if we have at least one API key
    if (!apiKeys.GROQ_API_KEY && !apiKeys.GEMINI_API_KEY) {
        console.error('❌ No API keys found in .env file');
        console.log('Make sure your .env file contains GROQ_API_KEY and/or GEMINI_API_KEY');
        process.exit(1);
    }
    
    try {
        const outputPath = path.join(__dirname, 'api-keys.json');
        fs.writeFileSync(outputPath, JSON.stringify(apiKeys, null, 2));
        
        console.log('✅ Successfully generated api-keys.json');
        console.log('📁 Location:', outputPath);
        console.log('🔑 Keys found:');
        if (apiKeys.GROQ_API_KEY) console.log('  - GROQ_API_KEY: ✅');
        if (apiKeys.GEMINI_API_KEY) console.log('  - GEMINI_API_KEY: ✅');
        
        console.log('\n⚠️  SECURITY WARNING:');
        console.log('   - api-keys.json contains sensitive information');
        console.log('   - Make sure it\'s added to .gitignore');
        console.log('   - Never commit this file to version control');
        
    } catch (error) {
        console.error('❌ Error writing api-keys.json:', error.message);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    console.log('🔧 Generating API keys configuration...\n');
    generateApiKeysFile();
}

module.exports = { generateApiKeysFile, loadEnvFile };