// SATI Code Preview JavaScript
// Real-time preview functionality with live updates

// Global variables
let currentLanguage = 'html';
let currentCode = '';
let isConsoleVisible = false;
let refreshInterval = null;
let lastCodeHash = '';

// DOM Elements
const previewTitle = document.getElementById('previewTitle');
const refreshBtn = document.getElementById('refreshBtn');
const consoleBtn = document.getElementById('consoleBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const backBtn = document.getElementById('backBtn');
const errorMessage = document.getElementById('errorMessage');
const loadingOverlay = document.getElementById('loadingOverlay');
const noPreview = document.getElementById('noPreview');
const previewFrame = document.getElementById('previewFrame');
const consoleOutput = document.getElementById('consoleOutput');
const consoleContent = document.getElementById('consoleContent');

// Load saved code from localStorage
function loadSavedCode(language) {
    const codeKey = `sati_programming_code_${language}`;
    const savedCode = localStorage.getItem(codeKey);
    if (savedCode) {
        return savedCode;
    }
    // Return default code if no saved code
    return getDefaultCode(language);
}

// Get default code for language
function getDefaultCode(language) {
    const defaultCodes = {
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SATI Programming Hub</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 50px;
            margin: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        h1 {
            color: #FFD700;
            margin-bottom: 20px;
        }
        .highlight {
            background: rgba(255, 215, 0, 0.2);
            padding: 10px;
            border-radius: 8px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Welcome to SATI Programming Hub!</h1>
        <p>Happy coding, SATI students!</p>
        <div class="highlight">
            <p>This is where your HTML comes to life!</p>
            <p>Build amazing web experiences here.</p>
        </div>
        <p>Keep learning, keep growing! 💻</p>
    </div>
</body>
</html>`,
        css: `/* Welcome to SATI Programming Hub! */
/* Write your CSS code here */

/* Modern SATI Theme */
:root {
    --primary-color: #1976d2;
    --accent-color: #00c853;
    --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --text-color: #ffffff;
    --shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

body {
    font-family: 'Inter', 'Arial', sans-serif;
    background: var(--bg-gradient);
    color: var(--text-color);
    margin: 0;
    padding: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.sati-container {
    max-width: 600px;
    background: rgba(255, 255, 255, 0.1);
    padding: 40px;
    border-radius: 20px;
    backdrop-filter: blur(15px);
    box-shadow: var(--shadow);
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.sati-title {
    font-size: 2.5rem;
    color: #FFD700;
    margin-bottom: 20px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.sati-subtitle {
    font-size: 1.2rem;
    margin-bottom: 30px;
    opacity: 0.9;
}

.highlight-box {
    background: rgba(255, 215, 0, 0.2);
    padding: 20px;
    border-radius: 12px;
    margin: 25px 0;
    border-left: 4px solid var(--accent-color);
}

.code-snippet {
    background: rgba(0, 0, 0, 0.3);
    padding: 15px;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    margin: 20px 0;
    text-align: left;
}

/* Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.sati-container {
    animation: fadeInUp 0.8s ease-out;
}

/* Responsive Design */
@media (max-width: 768px) {
    .sati-container {
        margin: 20px;
        padding: 30px 20px;
    }
    
    .sati-title {
        font-size: 2rem;
    }
}`,
        javascript: `// Welcome to SATI Programming Hub!
// Write your JavaScript code here

function greetSATI() {
    console.log("Hello from SATI Programming Hub!");
    console.log("Happy coding, SATI students! 🚀");
    
    // Example: Calculate factorial
    const number = 5;
    const factorial = calculateFactorial(number);
    console.log(\`Factorial of \${number} is: \${factorial}\`);
}

function calculateFactorial(n) {
    if (n <= 1) return 1;
    return n * calculateFactorial(n - 1);
}

// Run the greeting function
greetSATI();`
    };
    
    return defaultCodes[language] || '';
}

// Language configurations for preview
const previewConfig = {
    html: {
        name: 'HTML',
        supportsPreview: true,
        previewType: 'iframe'
    },
    css: {
        name: 'CSS',
        supportsPreview: false,
        previewType: 'iframe'
    },
    javascript: {
        name: 'JavaScript',
        supportsPreview: true,
        previewType: 'console'
    },
    python: {
        name: 'Python',
        supportsPreview: false,
        previewType: 'none'
    },
    cpp: {
        name: 'C++',
        supportsPreview: false,
        previewType: 'none'
    },
    c: {
        name: 'C',
        supportsPreview: false,
        previewType: 'none'
    },
    java: {
        name: 'Java',
        supportsPreview: false,
        previewType: 'none'
    }
};

// Initialize the preview page
document.addEventListener('DOMContentLoaded', function () {
    initializePreview();
    setupEventListeners();
    startLiveUpdates();
});

// Initialize preview page
function initializePreview() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const language = urlParams.get('language') || 'html';

    // Set current language and get code from localStorage
    currentLanguage = language;
    currentCode = loadSavedCode(currentLanguage);

    // Update title
    const config = previewConfig[currentLanguage];
    if (config) {
        previewTitle.textContent = `SATI Code Preview - ${config.name}`;
        document.title = `SATI Code Preview - ${config.name} | SATI ChatBot`;
    }

    // Load initial preview
    loadPreview();

    // Apply saved theme
    const savedTheme = localStorage.getItem('sati_theme') || 'dark';
    applyTheme(savedTheme);
}

// Setup event listeners
function setupEventListeners() {
    // Refresh button
    refreshBtn.addEventListener('click', () => {
        loadPreview();
        showNotification('Preview refreshed', 'success');
    });

    // Console toggle button
    consoleBtn.addEventListener('click', toggleConsole);

    // Fullscreen button
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    // Back button
    backBtn.addEventListener('click', () => {
        // Go back to programming page
        if (window.opener) {
            window.close();
        } else {
            window.location.href = 'programming.html';
        }
    });

    // Listen for messages from parent window (for real-time updates)
    window.addEventListener('message', handleMessage);

    // Listen for storage changes (for real-time updates)
    window.addEventListener('storage', handleStorageChange);

    // Fullscreen change event
    document.addEventListener('fullscreenchange', updateFullscreenButton);
}

// Handle messages from parent window
function handleMessage(event) {
    // Verify origin for security
    if (event.origin !== window.location.origin) {
        return;
    }

    const { type, language, code } = event.data;

    if (type === 'codeUpdate') {
        currentLanguage = language;
        currentCode = code;
        loadPreview();
    } else if (type === 'themeUpdate') {
        applyTheme(event.data.theme);
    }
}

// Handle storage changes for real-time updates
function handleStorageChange(event) {
    if (event.key && event.key.startsWith('sati_programming_code_')) {
        const language = event.key.replace('sati_programming_code_', '');
        if (language === currentLanguage) {
            currentCode = event.newValue || '';
            loadPreview();
        }
    } else if (event.key === 'sati_theme') {
        applyTheme(event.newValue || 'dark');
    }
}

// Start live updates by polling localStorage
function startLiveUpdates() {
    // Check for code updates every 500ms
    refreshInterval = setInterval(() => {
        const codeKey = `sati_programming_code_${currentLanguage}`;
        const savedCode = localStorage.getItem(codeKey) || '';
        const codeHash = hashCode(savedCode);

        if (codeHash !== lastCodeHash) {
            currentCode = savedCode;
            lastCodeHash = codeHash;
            loadPreview();
        }
    }, 500);
}

// Simple hash function for code comparison
function hashCode(str) {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

// Load preview based on current language and code
function loadPreview() {
    const config = previewConfig[currentLanguage];
    
    if (!config || !config.supportsPreview) {
        showNoPreview();
        return;
    }

    showLoading();

    try {
        if (currentLanguage === 'html') {
            loadHTMLPreview();
        } else if (currentLanguage === 'javascript') {
            loadJavaScriptPreview();
        }
    } catch (error) {
        showError(`Failed to load preview: ${error.message}`);
    }
}

// Load HTML preview
function loadHTMLPreview() {
    const iframe = previewFrame;
    
    // Create a blob URL for the HTML content
    const blob = new Blob([currentCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    iframe.onload = () => {
        hideLoading();
        showPreview();
        URL.revokeObjectURL(url); // Clean up
    };
    
    iframe.onerror = () => {
        showError('Failed to load HTML preview');
        URL.revokeObjectURL(url);
    };
    
    iframe.src = url;
}

// Load JavaScript preview
function loadJavaScriptPreview() {
    const template = document.getElementById('jsPreviewTemplate');
    if (!template) {
        showError('JavaScript preview template not found');
        return;
    }
    
    // Clone the template content
    let htmlContent = template.innerHTML;
    
    // Create the JavaScript execution wrapper
    const jsWrapper = `
        // Override console methods to display in page
        const consoleOutput = document.getElementById('consoleOutput');
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        
        function addToConsole(message, type = 'log') {
            const timestamp = new Date().toLocaleTimeString();
            const className = type === 'error' ? 'error' : type === 'warn' ? 'warn' : 'success';
            consoleOutput.innerHTML += \`<div class="\${className}">[\${timestamp}] \${message}</div>\`;
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
        }
        
        console.log = function(...args) {
            originalLog.apply(console, args);
            addToConsole(args.join(' '), 'log');
        };
        
        console.error = function(...args) {
            originalError.apply(console, args);
            addToConsole('ERROR: ' + args.join(' '), 'error');
        };
        
        console.warn = function(...args) {
            originalWarn.apply(console, args);
            addToConsole('WARNING: ' + args.join(' '), 'warn');
        };
        
        // Clear console
        consoleOutput.innerHTML = '<div class="success">[' + new Date().toLocaleTimeString() + '] SATI JavaScript Console Ready</div>';
        
        // Execute user code
        try {
            ${currentCode}
        } catch (error) {
            console.error(error.message);
        }
    `;
    
    // Replace the placeholder with user JavaScript
    htmlContent = htmlContent.replace('// User JavaScript will be inserted here', jsWrapper);

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const iframe = previewFrame;
    iframe.onload = () => {
        hideLoading();
        showPreview();
        showConsole(); // Auto-show console for JavaScript
        URL.revokeObjectURL(url);
    };
    
    iframe.onerror = () => {
        showError('Failed to load JavaScript preview');
        URL.revokeObjectURL(url);
    };
    
    iframe.src = url;
}

// Show loading state
function showLoading() {
    loadingOverlay.style.display = 'flex';
    previewFrame.style.display = 'none';
    noPreview.style.display = 'none';
    hideError();
}

// Hide loading state
function hideLoading() {
    loadingOverlay.style.display = 'none';
}

// Show preview
function showPreview() {
    previewFrame.style.display = 'block';
    noPreview.style.display = 'none';
}

// Show no preview state
function showNoPreview() {
    hideLoading();
    previewFrame.style.display = 'none';
    noPreview.style.display = 'flex';
}

// Show error
function showError(message) {
    hideLoading();
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    setTimeout(() => {
        hideError();
    }, 5000);
}

// Hide error
function hideError() {
    errorMessage.classList.remove('show');
}

// Toggle console visibility
function toggleConsole() {
    if (isConsoleVisible) {
        hideConsole();
    } else {
        showConsole();
    }
}

// Show console
function showConsole() {
    consoleOutput.classList.add('show');
    consoleBtn.classList.add('active');
    isConsoleVisible = true;
}

// Hide console
function hideConsole() {
    consoleOutput.classList.remove('show');
    consoleBtn.classList.remove('active');
    isConsoleVisible = false;
}

// Toggle fullscreen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            showError(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Update fullscreen button
function updateFullscreenButton() {
    const icon = fullscreenBtn.querySelector('i');
    const text = fullscreenBtn.querySelector('span');
    
    if (document.fullscreenElement) {
        icon.className = 'fas fa-compress';
        text.textContent = 'Exit Fullscreen';
        fullscreenBtn.classList.add('active');
    } else {
        icon.className = 'fas fa-expand';
        text.textContent = 'Fullscreen';
        fullscreenBtn.classList.remove('active');
    }
}

// Apply theme
function applyTheme(theme) {
    let actualTheme = theme;

    // Handle system theme detection
    if (theme === 'system') {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            actualTheme = 'dark';
        } else {
            actualTheme = 'light';
        }
    }

    // Apply the actual theme
    document.documentElement.setAttribute('data-theme', actualTheme);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 10000;
        font-size: 0.9rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
});

// Handle visibility change to pause/resume updates
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause updates when tab is not visible
        if (refreshInterval) {
            clearInterval(refreshInterval);
            refreshInterval = null;
        }
    } else {
        // Resume updates when tab becomes visible
        if (!refreshInterval) {
            startLiveUpdates();
        }
    }
});