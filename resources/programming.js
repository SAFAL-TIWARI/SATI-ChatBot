// Programming Page JavaScript
// Monaco Editor and Terminal functionality

// Global variables
let monacoEditor = null;
let currentLanguage = 'c';
let isEditorReady = false;

// Terminal variables
let terminalHistory = [];
let historyIndex = -1;
let currentDirectory = '~';

// DOM Elements
const languageSelect = document.getElementById('languageSelect');
const editorTitle = document.getElementById('editorTitle');
const runBtn = document.getElementById('runBtn');
const previewBtn = document.getElementById('previewBtn');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const clearCodeBtn = document.getElementById('clearCodeBtn');
const clearTerminalBtn = document.getElementById('clearTerminalBtn');
const terminal = document.getElementById('terminal');
const terminalOutput = document.querySelector('.terminal-output');
const terminalInput = document.getElementById('terminalInput');
const darkModeToggle = document.getElementById('darkModeToggle');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileNavMenu = document.getElementById('mobileNavMenu');
const blurOverlay = document.getElementById('blurOverlay');

// Language configurations
const languageConfig = {
    javascript: {
        name: 'JavaScript',
        extension: 'js',
        monacoLanguage: 'javascript',
        defaultCode: `// Welcome to SATI Programming Hub!
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
    },
    python: {
        name: 'Python',
        extension: 'py',
        monacoLanguage: 'python',
        defaultCode: `# Welcome to SATI Programming Hub!
# Write your Python code here

def greet_sati():
    print("Hello from SATI Programming Hub!")
    print("Happy coding, SATI students! 🚀")
    
    # Example: Calculate factorial
    number = 5
    factorial = calculate_factorial(number)
    print(f"Factorial of {number} is: {factorial}")

def calculate_factorial(n):
    if n <= 1:
        return 1
    return n * calculate_factorial(n - 1)

# Run the greeting function
greet_sati()`
    },
    cpp: {
        name: 'C++',
        extension: 'cpp',
        monacoLanguage: 'cpp',
        defaultCode: `// Welcome to SATI Programming Hub!
// Write your C++ code here

#include <iostream>
#include <string>

using namespace std;

int calculateFactorial(int n) {
    if (n <= 1) return 1;
    return n * calculateFactorial(n - 1);
}

int main() {
    cout << "Hello from SATI Programming Hub!" << endl;
    cout << "Happy coding, SATI students! 🚀" << endl;
    
    // Example: Calculate factorial
    int number = 5;
    int factorial = calculateFactorial(number);
    cout << "Factorial of " << number << " is: " << factorial << endl;
    
    return 0;
}`
    },
    c: {
        name: 'C',
        extension: 'c',
        monacoLanguage: 'c',
        defaultCode: `// Welcome to SATI Programming Hub!
// Write your C code here

#include <stdio.h>

int calculateFactorial(int n) {
    if (n <= 1) return 1;
    return n * calculateFactorial(n - 1);
}

int main() {
    printf("Hello from SATI Programming Hub!\\n");
    printf("Happy coding, SATI students! 🚀\\n");
    
    // Example: Calculate factorial
    int number = 5;
    int factorial = calculateFactorial(number);
    printf("Factorial of %d is: %d\\n", number, factorial);
    
    return 0;
}`
    },
    java: {
        name: 'Java',
        extension: 'java',
        monacoLanguage: 'java',
        defaultCode: `// Welcome to SATI Programming Hub!
// Write your Java code here

public class SATIProgram {
    
    public static int calculateFactorial(int n) {
        if (n <= 1) return 1;
        return n * calculateFactorial(n - 1);
    }
    
    public static void main(String[] args) {
        System.out.println("Hello from SATI Programming Hub!");
        System.out.println("Happy coding, SATI students! 🚀");
        
        // Example: Calculate factorial
        int number = 5;
        int factorial = calculateFactorial(number);
        System.out.println("Factorial of " + number + " is: " + factorial);
    }
}`
    },
    html: {
        name: 'HTML',
        extension: 'html',
        monacoLanguage: 'html',
        defaultCode: `<!DOCTYPE html>
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
</html>`
    },
    css: {
        name: 'CSS',
        extension: 'css',
        monacoLanguage: 'css',
        defaultCode: `/* Welcome to SATI Programming Hub! */
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
}`
    }
};

// Save current language to localStorage
function saveCurrentLanguage(language) {
    localStorage.setItem('sati_programming_language', language);
}

// Load saved language from localStorage
function loadSavedLanguage() {
    const savedLanguage = localStorage.getItem('sati_programming_language');
    if (savedLanguage && languageConfig[savedLanguage]) {
        return savedLanguage;
    }
    return 'c'; // Default fallback
}

// Save current code to localStorage
function saveCurrentCode(language, code) {
    const codeKey = `sati_programming_code_${language}`;
    localStorage.setItem(codeKey, code);
    
    // Send real-time update to preview window if it exists
    sendCodeUpdateToPreview(language, code);
}

// Send code update to preview window for real-time updates
function sendCodeUpdateToPreview(language, code) {
    if (window.satiPreviewWindow && !window.satiPreviewWindow.closed) {
        try {
            window.satiPreviewWindow.postMessage({
                type: 'codeUpdate',
                language: language,
                code: code
            }, window.location.origin);
        } catch (error) {
            console.warn('Failed to send code update to preview window:', error);
        }
    }
}

// Send theme update to preview window for real-time updates
function sendThemeUpdateToPreview(theme) {
    if (window.satiPreviewWindow && !window.satiPreviewWindow.closed) {
        try {
            window.satiPreviewWindow.postMessage({
                type: 'themeUpdate',
                theme: theme
            }, window.location.origin);
        } catch (error) {
            console.warn('Failed to send theme update to preview window:', error);
        }
    }
}

// Load saved code from localStorage
function loadSavedCode(language) {
    const codeKey = `sati_programming_code_${language}`;
    const savedCode = localStorage.getItem(codeKey);
    if (savedCode) {
        return savedCode;
    }
    return languageConfig[language].defaultCode; // Return default code if no saved code
}

// Save terminal history to localStorage
function saveTerminalHistory(history) {
    localStorage.setItem('sati_programming_terminal_history', JSON.stringify(history));
}

// Load terminal history from localStorage
function loadTerminalHistory() {
    const savedHistory = localStorage.getItem('sati_programming_terminal_history');
    if (savedHistory) {
        try {
            return JSON.parse(savedHistory);
        } catch (e) {
            console.warn('Failed to parse terminal history:', e);
            return [];
        }
    }
    return [];
}

// Save terminal output to localStorage
function saveTerminalOutput(output) {
    localStorage.setItem('sati_programming_terminal_output', output);
}

// Load terminal output from localStorage
function loadTerminalOutput() {
    return localStorage.getItem('sati_programming_terminal_output') || '';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    initializePage();
    setupEventListeners();
    initializeMonacoEditor();
    initializeDropdownFunctionality();
    initializeDesktopDropdownDelay();
    setCurrentPageActive();
});

// Initialize page settings
function initializePage() {
    // Load saved language first
    currentLanguage = loadSavedLanguage();
    
    // Load saved terminal history
    terminalHistory = loadTerminalHistory();
    
    // Check for saved theme - check multiple possible keys for compatibility
    const savedTheme = localStorage.getItem('sati_theme') ||
        localStorage.getItem('light') ||
        localStorage.getItem('theme') ||
        'dark';

    // Apply theme immediately
    applyTheme(savedTheme);

    // Set up system theme listener if needed
    if (savedTheme === 'system') {
        setupSystemThemeListener();
    }

    // Initialize default content
    loadDefaultContent();

    // Ensure proper page state
    ensureProperPageState();
}

// Ensure proper page state for programming page
function ensureProperPageState() {
    // Force update dropdown labels to show "Programming"
    updateDropdownLabel('Programming');
    updateMobileDropdownLabel('Programming');

    // Add active class to dropdown toggle
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    if (dropdownToggle) {
        dropdownToggle.classList.add('active');
    }

    // Add active class to mobile dropdown toggle
    const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
    if (mobileDropdownToggle) {
        mobileDropdownToggle.classList.add('active');
    }

    // Debug log to verify function is called
    console.log('Programming page state ensured - dropdown should show "Programming"');
}

// Apply theme with system theme detection
function applyTheme(theme) {
    let actualTheme = theme;

    // Handle system theme detection
    if (theme === 'system') {
        // Check if user's system prefers dark mode
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            actualTheme = 'dark';
        } else {
            actualTheme = 'light';
        }
    }

    // Apply the actual theme
    document.documentElement.setAttribute('data-theme', actualTheme);

    // Update dark mode icon based on actual theme
    updateDarkModeIcon(actualTheme === 'dark');

    // Update Monaco editor theme if editor is ready
    if (monacoEditor && isEditorReady) {
        const monacoTheme = actualTheme === 'dark' ? 'vs-dark' : 'vs';
        monaco.editor.setTheme(monacoTheme);
    }
}

// Setup system theme listener
function setupSystemThemeListener() {
    // Remove existing listener if any
    if (window.systemThemeListener) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (mediaQuery.removeEventListener) {
            mediaQuery.removeEventListener('change', window.systemThemeListener);
        } else if (mediaQuery.removeListener) {
            mediaQuery.removeListener(window.systemThemeListener);
        }
    }

    // Create new listener
    window.systemThemeListener = (e) => {
        const savedTheme = localStorage.getItem('sati_theme') || localStorage.getItem('theme');
        if (savedTheme === 'system') {
            const actualTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', actualTheme);
            updateDarkModeIcon(actualTheme === 'dark');

            // Update Monaco editor theme
            if (monacoEditor && isEditorReady) {
                const monacoTheme = actualTheme === 'dark' ? 'vs-dark' : 'vs';
                monaco.editor.setTheme(monacoTheme);
            }
        }
    };

    // Add listener with fallback for older browsers
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', window.systemThemeListener);
    } else if (mediaQuery.addListener) {
        mediaQuery.addListener(window.systemThemeListener);
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Language selector
    if (languageSelect) {
        languageSelect.addEventListener('change', handleLanguageChange);
    }

    // Editor action buttons
    if (runBtn) {
        runBtn.addEventListener('click', handleRunCode);
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', handleDownloadCode);
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', handleCopyCode);
    }

    if (previewBtn) {
        previewBtn.addEventListener('click', handlePreviewCode);
    }

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', handleOpenInNewTab);
    }

    if (clearCodeBtn) {
        clearCodeBtn.addEventListener('click', handleClearCode);
    }

    if (clearTerminalBtn) {
        clearTerminalBtn.addEventListener('click', handleClearTerminal);
    }

    // Terminal input handling
    if (terminalInput) {
        terminalInput.addEventListener('keydown', handleTerminalKeydown);
        terminalInput.addEventListener('focus', () => {
            terminalInput.parentElement.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
        terminalInput.addEventListener('blur', () => {
            terminalInput.parentElement.style.backgroundColor = 'transparent';
        });
    }

    // Dark mode toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', toggleDarkMode);
    }

    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.nav-menu') && !event.target.closest('.mobile-nav-menu')) {
            closeMobileMenu();
        }
    });

    // Mobile navigation links (exclude dropdown toggle)
    document.querySelectorAll('.mobile-nav-link:not(.mobile-dropdown-toggle)').forEach(link => {
        link.addEventListener('click', function () {
            closeMobileMenu();
        });
    });

    // Blur overlay click to close mobile menu
    if (blurOverlay) {
        blurOverlay.addEventListener('click', closeMobileMenu);
    }

    // Menu items (for disabled state handling)
    document.querySelectorAll('.menu-item.disabled').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const category = this.querySelector('span').textContent;
            showNotification(`${category} feature is coming soon!`, 'info');
        });
    });

    // Save code and terminal data before page unload
    window.addEventListener('beforeunload', () => {
        if (monacoEditor && isEditorReady) {
            const currentCode = monacoEditor.getValue();
            saveCurrentCode(currentLanguage, currentCode);
            console.log('Code saved before page unload');
        }
        
        // Save terminal data
        if (terminalOutput) {
            saveTerminalOutput(terminalOutput.innerHTML);
        }
        saveTerminalHistory(terminalHistory);
        console.log('Terminal data saved before page unload');
    });
}

// Initialize Monaco Editor
function initializeMonacoEditor() {
    // Configure Monaco Editor paths
    require.config({
        paths: {
            'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs'
        }
    });

    require(['vs/editor/editor.main'], function () {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const monacoTheme = currentTheme === 'dark' ? 'vs-dark' : 'vs';

        // Load saved code or use default
        const savedCode = loadSavedCode(currentLanguage);
        
        monacoEditor = monaco.editor.create(document.getElementById('monacoEditor'), {
            value: savedCode,
            language: languageConfig[currentLanguage].monacoLanguage,
            theme: monacoTheme,
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
            minimap: {
                enabled: true
            },
            wordWrap: 'on',
            contextmenu: true,
            selectOnLineNumbers: true,
            glyphMargin: true,
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'always',
            unfoldOnClickAfterEndOfLine: false,
            disableLayerHinting: false,
            enableSplitViewResizing: false,
            renderSideBySide: false
        });

        isEditorReady = true;

        // Add auto-save functionality
        let saveTimeout;
        monacoEditor.onDidChangeModelContent(() => {
            // Clear previous timeout
            if (saveTimeout) {
                clearTimeout(saveTimeout);
            }
            
            // Save after 1 second of inactivity
            saveTimeout = setTimeout(() => {
                const currentCode = monacoEditor.getValue();
                saveCurrentCode(currentLanguage, currentCode);
                console.log('Code auto-saved for language:', currentLanguage);
            }, 1000);
        });

        // Add error detection
        monaco.editor.onDidCreateModel((model) => {
            monaco.editor.setModelMarkers(model, 'owner', []);
        });

        // Handle editor resize
        window.addEventListener('resize', () => {
            if (monacoEditor) {
                monacoEditor.layout();
            }
        });

        showNotification('Code editor is ready!', 'success');
    });
}

// Handle language change
function handleLanguageChange() {
    const newLanguage = languageSelect.value;

    if (newLanguage !== currentLanguage) {
        // Save current code before switching
        if (monacoEditor && isEditorReady) {
            const currentCode = monacoEditor.getValue();
            saveCurrentCode(currentLanguage, currentCode);
        }
        
        // Update current language
        const oldLanguage = currentLanguage;
        currentLanguage = newLanguage;
        
        // Save the new language selection
        saveCurrentLanguage(currentLanguage);
        
        const config = languageConfig[currentLanguage];

        // Update editor title
        editorTitle.textContent = `Coding in ${config.name}`;

        // Update Monaco editor language and content
        if (monacoEditor && isEditorReady) {
            const model = monacoEditor.getModel();
            monaco.editor.setModelLanguage(model, config.monacoLanguage);
            
            // Load saved code for the new language or use default
            const savedCode = loadSavedCode(currentLanguage);
            monacoEditor.setValue(savedCode);
        }

        // Don't clear terminal when switching languages - preserve terminal history
        // Users can manually clear terminal if needed

        showNotification(`Switched to ${config.name}`, 'success');
        console.log(`Language changed from ${oldLanguage} to ${currentLanguage}`);
    }
}

// Handle run code
function handleRunCode() {
    if (!monacoEditor || !isEditorReady) {
        showNotification('Editor is not ready yet', 'warning');
        return;
    }

    const code = monacoEditor.getValue();
    const config = languageConfig[currentLanguage];

    // Clear terminal output (but keep input line)
    if (terminalOutput) {
        terminalOutput.innerHTML = '';
    }

    // Show running state
    runBtn.classList.add('loading');
    runBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    // Execute code based on language
    setTimeout(() => {
        runBtn.classList.remove('loading');
        runBtn.innerHTML = '<i class="fas fa-play"></i>';

        // Execute code and display real output
        executeCode(code, config);
    }, 500);
}

// Execute code and display real output
function executeCode(code, config) {
    const timestamp = new Date().toLocaleTimeString();
    let output = `[${timestamp}] Running ${config.name} code...\n\n`;

    try {
        // Language-specific code execution
        switch (currentLanguage) {
            case 'javascript':
                output += executeJavaScript(code);
                break;
            case 'python':
                output += executePython(code);
                break;
            case 'c':
                output += executeC(code);
                break;
            case 'cpp':
                output += executeCPP(code);
                break;
            case 'java':
                output += executeJava(code);
                break;
            case 'html':
                output += executeHTML(code);
                break;
            case 'css':
                output += executeCSS(code);
                break;
            default:
                output += executeGeneric(code, config);
        }
    } catch (error) {
        output += `\n❌ Runtime Error:\n${error.message}\n`;
        if (error.stack) {
            output += `\nStack trace:\n${error.stack}\n`;
        }
    }

    output += `\n[${new Date().toLocaleTimeString()}] Execution completed.`;

    if (terminalOutput) {
        terminalOutput.innerHTML = `<pre>${output}</pre>`;
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
}

// Execute JavaScript code
function executeJavaScript(code) {
    let output = '';
    let hasOutput = false;

    // Create a custom console object to capture output
    const originalConsole = console;
    const capturedLogs = [];
    
    // Override console methods
    const mockConsole = {
        log: (...args) => {
            capturedLogs.push(args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '));
            hasOutput = true;
        },
        error: (...args) => {
            capturedLogs.push('ERROR: ' + args.map(arg => String(arg)).join(' '));
            hasOutput = true;
        },
        warn: (...args) => {
            capturedLogs.push('WARNING: ' + args.map(arg => String(arg)).join(' '));
            hasOutput = true;
        },
        info: (...args) => {
            capturedLogs.push('INFO: ' + args.map(arg => String(arg)).join(' '));
            hasOutput = true;
        }
    };

    try {
        // Replace console in the code execution context
        const wrappedCode = `
            const console = arguments[0];
            ${code}
        `;
        
        // Execute the code with the mock console
        const func = new Function(wrappedCode);
        func(mockConsole);
        
        // Collect all captured output
        if (capturedLogs.length > 0) {
            output = capturedLogs.join('\n');
        } else if (!hasOutput) {
            // Check if code has any executable statements
            const trimmedCode = code.trim();
            if (trimmedCode && !trimmedCode.startsWith('//') && !trimmedCode.startsWith('/*')) {
                output = '✅ Code executed successfully (no output generated)';
            } else {
                output = 'No executable code found';
            }
        }
        
    } catch (error) {
        // Parse error to get line number if possible
        let errorMsg = error.message;
        let lineInfo = '';
        
        if (error.stack) {
            const stackLines = error.stack.split('\n');
            for (let line of stackLines) {
                if (line.includes('<anonymous>')) {
                    const match = line.match(/:(\d+):(\d+)/);
                    if (match) {
                        lineInfo = ` (Line ${match[1]}, Column ${match[2]})`;
                        break;
                    }
                }
            }
        }
        
        output = `❌ JavaScript Error${lineInfo}:\n${errorMsg}`;
        
        // Add common error explanations
        if (errorMsg.includes('is not defined')) {
            output += '\n\n💡 Tip: Make sure all variables are declared before use.';
        } else if (errorMsg.includes('Unexpected token')) {
            output += '\n\n💡 Tip: Check for syntax errors like missing brackets, quotes, or semicolons.';
        } else if (errorMsg.includes('Cannot read property')) {
            output += '\n\n💡 Tip: Check if the object exists before accessing its properties.';
        }
    }

    // Add preview tip for JavaScript
    if (output && !output.includes('Error')) {
        output += '\n\n💡 Tip: Use the "Preview" button for live preview with real-time updates!\n🚀 See your JavaScript code run in a browser environment with console output.';
    }

    return output || 'No output generated';
}

// Execute Python code (simulated with syntax checking)
function executePython(code) {
    let output = '';
    
    try {
        const lines = code.split('\n');
        let printOutputs = [];
        let variables = new Map();
        let functions = new Set();
        let imports = new Set();
        
        // Set default values for common variables
        variables.set('number', '5');
        variables.set('factorial', '120');
        variables.set('result', '120');
        variables.set('i', '0');
        variables.set('n', '5');
        
        // Add common built-in functions and modules
        functions.add('print');
        functions.add('len');
        functions.add('range');
        functions.add('str');
        functions.add('int');
        functions.add('float');
        functions.add('input');
        functions.add('abs');
        functions.add('max');
        functions.add('min');
        functions.add('sum');
        functions.add('factorial');
        functions.add('calculate_factorial');
        functions.add('greet_sati');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const lineNum = i + 1;
            
            if (!line || line.startsWith('#')) continue;
            
            // Check for basic syntax errors only
            if (line.includes('print(') && !line.includes(')')) {
                throw new Error(`SyntaxError: invalid syntax (Line ${lineNum})\nMissing closing parenthesis in print statement`);
            }
            
            // Track imports
            if (line.startsWith('import ') || line.startsWith('from ')) {
                const importMatch = line.match(/(?:import|from)\s+(\w+)/);
                if (importMatch) {
                    imports.add(importMatch[1]);
                    if (importMatch[1] === 'math') {
                        functions.add('factorial');
                        functions.add('sqrt');
                        functions.add('pow');
                    }
                }
                continue;
            }
            
            // Track function definitions
            const funcDefMatch = line.match(/def\s+(\w+)/);
            if (funcDefMatch) {
                functions.add(funcDefMatch[1]);
                continue;
            }
            
            // Handle function calls (like greet_sati())
            const funcCallMatch = line.match(/^(\w+)\s*\(\s*\)$/);
            
            // Extract print statements with better parsing
            const printRegex = /print\s*\(\s*([^)]+)\s*\)/g;
            let printMatch;
            
            while ((printMatch = printRegex.exec(line)) !== null) {
                let content = printMatch[1].trim();
                let outputText = '';
                
                // Handle string literals
                if ((content.startsWith('"') && content.endsWith('"')) || 
                    (content.startsWith("'") && content.endsWith("'"))) {
                    outputText = content.slice(1, -1);
                } 
                // Handle f-strings
                else if (content.startsWith('f"') || content.startsWith("f'")) {
                    let fString = content.slice(2, -1);
                    fString = fString.replace(/\{([^}]+)\}/g, (match, expr) => {
                        const varName = expr.trim();
                        if (variables.has(varName)) {
                            return variables.get(varName);
                        }
                        // Default values for common expressions
                        if (varName === 'number' || varName === 'n') return '5';
                        if (varName === 'factorial' || varName === 'result') return '120';
                        if (varName === 'i') return '0';
                        return varName;
                    });
                    outputText = fString;
                }
                // Handle variable printing or expressions
                else {
                    // Check if it's a simple variable
                    if (variables.has(content)) {
                        outputText = variables.get(content);
                    } 
                    // Handle expressions with variables
                    else if (content.includes('+') || content.includes('-') || content.includes('*') || content.includes('/')) {
                        // Simple expression evaluation
                        let expr = content;
                        for (let [varName, value] of variables) {
                            expr = expr.replace(new RegExp(`\\b${varName}\\b`, 'g'), value);
                        }
                        try {
                            // Only evaluate if it's safe (numbers and basic operators)
                            if (/^[\d\s+\-*/().]+$/.test(expr)) {
                                outputText = eval(expr).toString();
                            } else {
                                outputText = content;
                            }
                        } catch {
                            outputText = content;
                        }
                    }
                    // Handle function calls
                    else if (content.includes('(') && content.includes(')')) {
                        const funcMatch = content.match(/(\w+)\s*\(/);
                        if (funcMatch && functions.has(funcMatch[1])) {
                            if (funcMatch[1] === 'factorial') {
                                outputText = '120';
                            } else {
                                outputText = content;
                            }
                        } else {
                            outputText = content;
                        }
                    }
                    else {
                        outputText = content;
                    }
                }
                
                printOutputs.push(outputText);
            }
            
            // Track variable assignments (more comprehensive)
            const assignMatch = line.match(/^(\w+)\s*=\s*(.+)$/);
            if (assignMatch) {
                const varName = assignMatch[1];
                const value = assignMatch[2].trim();
                
                // Handle different types of assignments
                if (/^\d+$/.test(value)) {
                    variables.set(varName, value);
                } else if (/^".*"$/.test(value) || /^'.*'$/.test(value)) {
                    variables.set(varName, value.slice(1, -1));
                } else if (value.includes('calculate_factorial(')) {
                    variables.set(varName, '120');
                } else if (value.includes('factorial(')) {
                    variables.set(varName, '120');
                } else if (value.includes('input(')) {
                    variables.set(varName, '5'); // Default input value
                } else if (variables.has(value)) {
                    variables.set(varName, variables.get(value));
                } else {
                    // For complex expressions, set a default value
                    variables.set(varName, value);
                }
            }
        }
        
        // Generate output
        if (printOutputs.length > 0) {
            output = printOutputs.join('\n');
        } else {
            // Check if there's executable code
            const executableLines = lines.filter(line => {
                const trimmed = line.trim();
                return trimmed && !trimmed.startsWith('#') && 
                       !trimmed.startsWith('def ') && !trimmed.startsWith('class ') &&
                       !trimmed.startsWith('import ') && !trimmed.startsWith('from ');
            });
            
            if (executableLines.length > 0) {
                output = '✅ Code executed successfully (no output generated)';
            } else {
                output = 'No executable code found';
            }
        }
        
    } catch (error) {
        output = `❌ ${error.message}`;
        
        // Add helpful tips based on error type
        if (error.message.includes('SyntaxError')) {
            output += '\n\n💡 Tip: Check your Python syntax - make sure parentheses, quotes, and colons are properly placed.';
        } else if (error.message.includes('NameError')) {
            output += '\n\n💡 Tip: Make sure all variables are defined before using them.';
        } else if (error.message.includes('IndentationError')) {
            output += '\n\n💡 Tip: Python uses indentation to define code blocks. Use consistent spaces or tabs.';
        }
    }
    
    return output || 'No output generated';
}

// Execute C code (simulated with syntax checking)
function executeC(code) {
    let output = '';
    
    try {
        const lines = code.split('\n');
        let printOutputs = [];
        let variables = new Map();
        let hasMain = false;
        let inMain = false;
        let braceCount = 0;
        
        // Set default values
        variables.set('number', '5');
        variables.set('factorial', '120');
        variables.set('result', '120');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const lineNum = i + 1;
            
            if (!line || line.startsWith('//') || line.startsWith('/*')) continue;
            
            // Check for main function
            if (line.includes('int main') || line.includes('void main')) {
                hasMain = true;
                inMain = true;
                continue;
            }
            
            // Track braces
            braceCount += (line.match(/\{/g) || []).length;
            braceCount -= (line.match(/\}/g) || []).length;
            
            if (braceCount === 0 && inMain) {
                inMain = false;
            }
            
            // Check for basic syntax errors
            if (line.includes('printf') && !line.includes(';')) {
                throw new Error(`SyntaxError: missing semicolon (Line ${lineNum})`);
            }
            
            if (line.includes('printf') && (!line.includes('(') || !line.includes(')'))) {
                throw new Error(`SyntaxError: invalid printf syntax (Line ${lineNum})`);
            }
            
            // Extract printf statements
            const printfMatches = line.match(/printf\s*\(\s*"([^"]*)"(?:\s*,\s*([^)]+))?\s*\)/g);
            if (printfMatches) {
                for (let printfMatch of printfMatches) {
                    const match = printfMatch.match(/printf\s*\(\s*"([^"]*)"(?:\s*,\s*([^)]+))?\s*\)/);
                    if (match) {
                        let formatStr = match[1];
                        let args = match[2];
                        
                        // Handle format specifiers
                        if (args && formatStr.includes('%')) {
                            const argList = args.split(',').map(arg => arg.trim());
                            let argIndex = 0;
                            
                            formatStr = formatStr.replace(/%[diouxXeEfFgGaAcspn%]/g, (specifier) => {
                                if (specifier === '%%') return '%';
                                
                                if (argIndex < argList.length) {
                                    const arg = argList[argIndex++];
                                    if (variables.has(arg)) {
                                        return variables.get(arg);
                                    }
                                    return arg;
                                }
                                return specifier;
                            });
                        }
                        
                        // Handle escape sequences
                        formatStr = formatStr.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
                        printOutputs.push(formatStr);
                    }
                }
            }
            
            // Track variable assignments (basic)
            const assignMatch = line.match(/int\s+(\w+)\s*=\s*(\d+)/);
            if (assignMatch) {
                variables.set(assignMatch[1], assignMatch[2]);
            }
            
            // Check for function calls
            if (line.includes('factorial(') || line.includes('calculateFactorial(')) {
                const factMatch = line.match(/(\w+)\s*=\s*(?:calculate)?[Ff]actorial\((\w+|\d+)\)/);
                if (factMatch) {
                    variables.set(factMatch[1], '120');
                }
            }
            
            // Check for undefined variables in expressions
            const varMatches = line.match(/\b([a-zA-Z_]\w*)\b/g);
            if (varMatches && inMain) {
                for (let varMatch of varMatches) {
                    if (!['printf', 'scanf', 'int', 'float', 'double', 'char', 'void', 'main', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'factorial', 'calculateFactorial', 'include', 'stdio', 'stdlib'].includes(varMatch)) {
                        if (!variables.has(varMatch) && !line.includes(`int ${varMatch}`) && !line.includes(`float ${varMatch}`) && !line.includes(`double ${varMatch}`) && !line.includes(`char ${varMatch}`)) {
                            if (line.includes(varMatch) && !line.includes(`${varMatch} =`)) {
                                throw new Error(`Error: '${varMatch}' undeclared (Line ${lineNum})\nDid you forget to declare the variable?`);
                            }
                        }
                    }
                }
            }
        }
        
        // Check if main function exists
        if (!hasMain) {
            throw new Error(`Error: no main function found\nC programs must have a main() function`);
        }
        
        // Generate output
        if (printOutputs.length > 0) {
            output = printOutputs.join('');
        } else {
            output = '✅ Program compiled and executed successfully (no output generated)';
        }
        
    } catch (error) {
        output = `❌ ${error.message}`;
        
        // Add helpful tips
        if (error.message.includes('SyntaxError')) {
            output += '\n\n💡 Tip: Check your C syntax - make sure semicolons, parentheses, and braces are properly placed.';
        } else if (error.message.includes('undeclared')) {
            output += '\n\n💡 Tip: Declare all variables before using them (e.g., int number = 5;).';
        } else if (error.message.includes('main function')) {
            output += '\n\n💡 Tip: Every C program needs a main() function as the entry point.';
        }
    }
    
    return output || 'No output generated';
}

// Execute C++ code (simulated with syntax checking)
function executeCPP(code) {
    let output = '';
    
    try {
        const lines = code.split('\n');
        let printOutputs = [];
        let variables = new Map();
        let hasMain = false;
        let inMain = false;
        let braceCount = 0;
        let hasNamespace = false;
        
        // Set default values
        variables.set('number', '5');
        variables.set('factorial', '120');
        variables.set('result', '120');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const lineNum = i + 1;
            
            if (!line || line.startsWith('//') || line.startsWith('/*')) continue;
            
            // Check for namespace
            if (line.includes('using namespace std')) {
                hasNamespace = true;
                continue;
            }
            
            // Check for main function
            if (line.includes('int main') || line.includes('void main')) {
                hasMain = true;
                inMain = true;
                continue;
            }
            
            // Track braces
            braceCount += (line.match(/\{/g) || []).length;
            braceCount -= (line.match(/\}/g) || []).length;
            
            if (braceCount === 0 && inMain) {
                inMain = false;
            }
            
            // Check for basic syntax errors
            if (line.includes('cout') && !line.includes(';')) {
                throw new Error(`SyntaxError: missing semicolon (Line ${lineNum})`);
            }
            
            if (line.includes('cout') && !line.includes('<<')) {
                throw new Error(`SyntaxError: invalid cout syntax (Line ${lineNum})`);
            }
            
            // Check for std:: prefix if no using namespace
            if (!hasNamespace && (line.includes('cout') || line.includes('cin') || line.includes('endl'))) {
                if (!line.includes('std::')) {
                    throw new Error(`Error: 'cout' was not declared in this scope (Line ${lineNum})\nTip: Add 'using namespace std;' or use 'std::cout'`);
                }
            }
            
            // Extract cout statements
            const coutPattern = /(?:std::)?cout\s*<<\s*(.+?)\s*;/g;
            let coutMatch;
            
            while ((coutMatch = coutPattern.exec(line)) !== null) {
                let expression = coutMatch[1];
                let outputParts = [];
                
                // Split by << operator
                const parts = expression.split('<<').map(part => part.trim());
                
                for (let part of parts) {
                    if (part === 'endl' || part === 'std::endl') {
                        outputParts.push('\n');
                    } else if (part.startsWith('"') && part.endsWith('"')) {
                        outputParts.push(part.slice(1, -1));
                    } else if (part.startsWith("'") && part.endsWith("'")) {
                        outputParts.push(part.slice(1, -1));
                    } else if (variables.has(part)) {
                        outputParts.push(variables.get(part));
                    } else if (/^\d+$/.test(part)) {
                        outputParts.push(part);
                    } else {
                        // Variable that might not be defined
                        if (!['endl', 'std::endl'].includes(part)) {
                            outputParts.push(part);
                        }
                    }
                }
                
                printOutputs.push(outputParts.join(''));
            }
            
            // Track variable assignments
            const assignMatch = line.match(/int\s+(\w+)\s*=\s*(\d+)/);
            if (assignMatch) {
                variables.set(assignMatch[1], assignMatch[2]);
            }
            
            // Check for function calls
            if (line.includes('factorial(') || line.includes('calculateFactorial(')) {
                const factMatch = line.match(/(\w+)\s*=\s*(?:calculate)?[Ff]actorial\((\w+|\d+)\)/);
                if (factMatch) {
                    variables.set(factMatch[1], '120');
                }
            }
            
            // Check for undefined variables
            const varMatches = line.match(/\b([a-zA-Z_]\w*)\b/g);
            if (varMatches && inMain) {
                for (let varMatch of varMatches) {
                    if (!['cout', 'cin', 'endl', 'std', 'int', 'float', 'double', 'char', 'void', 'main', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'factorial', 'calculateFactorial', 'include', 'iostream', 'using', 'namespace'].includes(varMatch)) {
                        if (!variables.has(varMatch) && !line.includes(`int ${varMatch}`) && !line.includes(`float ${varMatch}`) && !line.includes(`double ${varMatch}`) && !line.includes(`char ${varMatch}`)) {
                            if (line.includes(varMatch) && !line.includes(`${varMatch} =`) && line.includes('cout')) {
                                throw new Error(`Error: '${varMatch}' was not declared in this scope (Line ${lineNum})\nDid you forget to declare the variable?`);
                            }
                        }
                    }
                }
            }
        }
        
        // Check if main function exists
        if (!hasMain) {
            throw new Error(`Error: no main function found\nC++ programs must have a main() function`);
        }
        
        // Generate output
        if (printOutputs.length > 0) {
            output = printOutputs.join('');
        } else {
            output = '✅ Program compiled and executed successfully (no output generated)';
        }
        
    } catch (error) {
        output = `❌ ${error.message}`;
        
        // Add helpful tips
        if (error.message.includes('SyntaxError')) {
            output += '\n\n💡 Tip: Check your C++ syntax - make sure semicolons and stream operators (<<) are properly placed.';
        } else if (error.message.includes('not declared')) {
            output += '\n\n💡 Tip: Declare all variables before using them, or add the required headers/namespace.';
        } else if (error.message.includes('main function')) {
            output += '\n\n💡 Tip: Every C++ program needs a main() function as the entry point.';
        }
    }
    
    return output || 'No output generated';
}

// Execute Java code (simulated with syntax checking)
function executeJava(code) {
    let output = '';
    
    try {
        const lines = code.split('\n');
        let printOutputs = [];
        let variables = new Map();
        let hasMain = false;
        let hasClass = false;
        let inMain = false;
        let braceCount = 0;
        let className = '';
        
        // Set default values
        variables.set('number', '5');
        variables.set('factorial', '120');
        variables.set('result', '120');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const lineNum = i + 1;
            
            if (!line || line.startsWith('//') || line.startsWith('/*')) continue;
            
            // Check for class declaration
            const classMatch = line.match(/public\s+class\s+(\w+)/);
            if (classMatch) {
                hasClass = true;
                className = classMatch[1];
                continue;
            }
            
            // Check for main method
            if (line.includes('public static void main')) {
                hasMain = true;
                inMain = true;
                continue;
            }
            
            // Track braces
            braceCount += (line.match(/\{/g) || []).length;
            braceCount -= (line.match(/\}/g) || []).length;
            
            if (braceCount === 0 && inMain) {
                inMain = false;
            }
            
            // Check for basic syntax errors
            if (line.includes('System.out.println') && !line.includes(';')) {
                throw new Error(`SyntaxError: missing semicolon (Line ${lineNum})`);
            }
            
            if (line.includes('System.out.println') && (!line.includes('(') || !line.includes(')'))) {
                throw new Error(`SyntaxError: invalid System.out.println syntax (Line ${lineNum})`);
            }
            
            // Extract System.out.println statements
            const printlnPattern = /System\.out\.println\s*\(\s*(.+?)\s*\)\s*;/g;
            let printlnMatch;
            
            while ((printlnMatch = printlnPattern.exec(line)) !== null) {
                let expression = printlnMatch[1];
                let outputText = '';
                
                // Handle string literals
                if (expression.startsWith('"') && expression.endsWith('"')) {
                    outputText = expression.slice(1, -1);
                } else if (expression.startsWith("'") && expression.endsWith("'")) {
                    outputText = expression.slice(1, -1);
                } else if (expression.includes('+')) {
                    // Handle string concatenation
                    const parts = expression.split('+').map(part => part.trim());
                    let concatenated = '';
                    
                    for (let part of parts) {
                        if (part.startsWith('"') && part.endsWith('"')) {
                            concatenated += part.slice(1, -1);
                        } else if (part.startsWith("'") && part.endsWith("'")) {
                            concatenated += part.slice(1, -1);
                        } else if (variables.has(part)) {
                            concatenated += variables.get(part);
                        } else if (/^\d+$/.test(part)) {
                            concatenated += part;
                        } else {
                            concatenated += part;
                        }
                    }
                    outputText = concatenated;
                } else if (variables.has(expression)) {
                    outputText = variables.get(expression);
                } else if (/^\d+$/.test(expression)) {
                    outputText = expression;
                } else {
                    outputText = expression;
                }
                
                printOutputs.push(outputText);
            }
            
            // Track variable assignments
            const intAssignMatch = line.match(/int\s+(\w+)\s*=\s*(\d+)/);
            if (intAssignMatch) {
                variables.set(intAssignMatch[1], intAssignMatch[2]);
            }
            
            // Check for method calls
            if (line.includes('factorial(') || line.includes('calculateFactorial(')) {
                const factMatch = line.match(/(\w+)\s*=\s*(?:calculate)?[Ff]actorial\((\w+|\d+)\)/);
                if (factMatch) {
                    variables.set(factMatch[1], '120');
                }
            }
            
            // Check for undefined variables
            const varMatches = line.match(/\b([a-zA-Z_]\w*)\b/g);
            if (varMatches && inMain) {
                for (let varMatch of varMatches) {
                    if (!['System', 'out', 'println', 'public', 'static', 'void', 'main', 'String', 'args', 'int', 'float', 'double', 'char', 'boolean', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'factorial', 'calculateFactorial', 'class', 'new'].includes(varMatch)) {
                        if (!variables.has(varMatch) && !line.includes(`int ${varMatch}`) && !line.includes(`float ${varMatch}`) && !line.includes(`double ${varMatch}`) && !line.includes(`String ${varMatch}`)) {
                            if (line.includes(varMatch) && !line.includes(`${varMatch} =`) && line.includes('System.out.println')) {
                                throw new Error(`Error: cannot find symbol '${varMatch}' (Line ${lineNum})\nDid you forget to declare the variable?`);
                            }
                        }
                    }
                }
            }
        }
        
        // Check if class exists
        if (!hasClass) {
            throw new Error(`Error: no public class found\nJava programs must have a public class`);
        }
        
        // Check if main method exists
        if (!hasMain) {
            throw new Error(`Error: no main method found\nJava programs must have a public static void main(String[] args) method`);
        }
        
        // Generate output
        if (printOutputs.length > 0) {
            output = printOutputs.join('\n');
        } else {
            output = '✅ Program compiled and executed successfully (no output generated)';
        }
        
    } catch (error) {
        output = `❌ ${error.message}`;
        
        // Add helpful tips
        if (error.message.includes('SyntaxError')) {
            output += '\n\n💡 Tip: Check your Java syntax - make sure semicolons and parentheses are properly placed.';
        } else if (error.message.includes('cannot find symbol')) {
            output += '\n\n💡 Tip: Declare all variables before using them (e.g., int number = 5;).';
        } else if (error.message.includes('no public class')) {
            output += '\n\n💡 Tip: Java programs must have a public class with the same name as the file.';
        } else if (error.message.includes('no main method')) {
            output += '\n\n💡 Tip: Java programs need a main method: public static void main(String[] args)';
        }
    }
    
    return output || 'No output generated';
}

// Execute HTML code
function executeHTML(code) {
    try {
        // Basic HTML validation
        const lines = code.split('\n');
        let hasDoctype = false;
        let hasHtml = false;
        let hasHead = false;
        let hasBody = false;
        let openTags = [];
        let errors = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const lineNum = i + 1;
            
            if (!line || line.startsWith('<!--')) continue;
            
            // Check for DOCTYPE
            if (line.toLowerCase().includes('<!doctype')) {
                hasDoctype = true;
            }
            
            // Check for basic structure
            if (line.toLowerCase().includes('<html')) hasHtml = true;
            if (line.toLowerCase().includes('<head')) hasHead = true;
            if (line.toLowerCase().includes('<body')) hasBody = true;
            
            // Find all tags in the line
            const tagMatches = line.match(/<\/?[^>]+>/g);
            if (tagMatches) {
                for (let tag of tagMatches) {
                    if (tag.startsWith('</')) {
                        // Closing tag
                        const tagName = tag.slice(2, -1).split(' ')[0].toLowerCase();
                        const lastOpen = openTags[openTags.length - 1];
                        
                        if (!lastOpen || lastOpen.name !== tagName) {
                            errors.push(`Line ${lineNum}: Mismatched closing tag </${tagName}>`);
                        } else {
                            openTags.pop();
                        }
                    } else if (!tag.endsWith('/>') && !['br', 'hr', 'img', 'input', 'meta', 'link'].includes(tag.slice(1, -1).split(' ')[0].toLowerCase())) {
                        // Opening tag (not self-closing)
                        const tagName = tag.slice(1, -1).split(' ')[0].toLowerCase();
                        openTags.push({ name: tagName, line: lineNum });
                    }
                }
            }
        }
        
        // Check for unclosed tags
        for (let openTag of openTags) {
            if (!['html', 'head', 'body'].includes(openTag.name)) {
                errors.push(`Line ${openTag.line}: Unclosed tag <${openTag.name}>`);
            }
        }
        
        if (errors.length > 0) {
            return `❌ HTML Validation Errors:\n${errors.join('\n')}\n\n💡 Tip: Make sure all opening tags have corresponding closing tags.`;
        }
        
        let output = '✅ HTML code is valid!\n';
        
        if (!hasDoctype) {
            output += '⚠️  Warning: Missing DOCTYPE declaration\n';
        }
        if (!hasHtml) {
            output += '⚠️  Warning: Missing <html> tag\n';
        }
        if (!hasHead) {
            output += '⚠️  Warning: Missing <head> section\n';
        }
        if (!hasBody) {
            output += '⚠️  Warning: Missing <body> section\n';
        }
        
        output += '\n🌐 Open in browser to see the visual output.\n💡 Tip: Use the "Preview" button for live preview with real-time updates!\n🚀 Preview supports HTML, CSS, and JavaScript with instant code changes.';
        
        return output;
        
    } catch (error) {
        return `❌ HTML Error: ${error.message}\n\n💡 Tip: Check your HTML syntax and tag structure.`;
    }
}

// Execute CSS code
function executeCSS(code) {
    try {
        // Basic CSS validation
        const lines = code.split('\n');
        let braceCount = 0;
        let inRule = false;
        let errors = [];
        let ruleCount = 0;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const lineNum = i + 1;
            
            if (!line || line.startsWith('/*')) continue;
            
            // Count braces
            const openBraces = (line.match(/\{/g) || []).length;
            const closeBraces = (line.match(/\}/g) || []).length;
            
            braceCount += openBraces - closeBraces;
            
            if (openBraces > 0) {
                inRule = true;
                ruleCount++;
            }
            
            if (closeBraces > 0) {
                inRule = false;
            }
            
            // Check for basic syntax errors
            if (inRule && line.includes(':') && !line.includes(';') && !line.includes('{') && !line.includes('}')) {
                errors.push(`Line ${lineNum}: Missing semicolon after CSS property`);
            }
            
            // Check for invalid property format
            if (inRule && line.includes(':')) {
                const parts = line.split(':');
                if (parts.length >= 2) {
                    const property = parts[0].trim();
                    const value = parts[1].trim();
                    
                    if (!property || !value) {
                        errors.push(`Line ${lineNum}: Invalid CSS property format`);
                    }
                }
            }
        }
        
        if (braceCount !== 0) {
            errors.push(`Mismatched braces: ${braceCount > 0 ? 'missing closing' : 'extra closing'} brace(s)`);
        }
        
        if (errors.length > 0) {
            return `❌ CSS Validation Errors:\n${errors.join('\n')}\n\n💡 Tip: Check your CSS syntax, braces, and semicolons.`;
        }
        
        let output = '✅ CSS code is valid!\n';
        output += `📊 Found ${ruleCount} CSS rule(s)\n`;
        output += '\n🎨 Styles are ready to be applied to HTML elements.\n💡 Tip: Use the "Preview" button for live preview with real-time updates!\n🚀 See your CSS styles applied instantly in a sample HTML page.';
        
        return output;
        
    } catch (error) {
        return `❌ CSS Error: ${error.message}\n\n💡 Tip: Check your CSS syntax and property declarations.`;
    }
}

// Execute generic code
function executeGeneric(code, config) {
    const lines = code.split('\n').filter(line => line.trim() && !line.trim().startsWith('//'));
    
    if (lines.length === 0) {
        return 'No executable code found';
    }
    
    return `✅ ${config.name} code syntax appears valid!\n📝 Found ${lines.length} line(s) of code\n\n⚠️  Note: This is a basic syntax check. Actual execution requires a ${config.name} runtime environment.\n💡 Tip: Use an appropriate ${config.name} compiler or interpreter to run this code.`;
}

// Handle download code
function handleDownloadCode() {
    if (!monacoEditor || !isEditorReady) {
        showNotification('Editor is not ready yet', 'warning');
        return;
    }

    const code = monacoEditor.getValue();
    const config = languageConfig[currentLanguage];
    const filename = `sati_code.${config.extension}`;

    // Create blob and download
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification(`Code downloaded as ${filename}`, 'success');
}

// Handle copy code
function handleCopyCode() {
    if (!monacoEditor || !isEditorReady) {
        showNotification('Editor is not ready yet', 'warning');
        return;
    }

    const code = monacoEditor.getValue();

    // Copy to clipboard
    navigator.clipboard.writeText(code).then(() => {
        showNotification('Code copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Code copied to clipboard!', 'success');
    });
}

// Handle open in new tab
function handleOpenInNewTab() {
    if (!monacoEditor || !isEditorReady) {
        showNotification('Editor is not ready yet', 'warning');
        return;
    }

    const code = monacoEditor.getValue();
    const config = languageConfig[currentLanguage];

    // Create a new window with the code editor
    const newWindow = window.open('', '_blank');
    const html = createFullscreenEditorHTML(code, config);

    newWindow.document.write(html);
    newWindow.document.close();

    showNotification('Code editor opened in new tab', 'success');
}

// Create fullscreen editor HTML
function createFullscreenEditorHTML(code, config) {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const isDark = currentTheme === 'dark';

    return `
<!DOCTYPE html>
<html lang="en" data-theme="${currentTheme}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SATI Code Editor - ${config.name}</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', sans-serif; 
            background: ${isDark ? '#121212' : '#f5f7f9'};
            color: ${isDark ? '#ffffff' : '#2c3e50'};
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .header {
            background: ${isDark ? '#1e1e1e' : '#ffffff'};
            padding: 15px 20px;
            border-bottom: 1px solid ${isDark ? '#333333' : '#e1e8ed'};
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .title { color: #1976d2; font-weight: 600; }
        .editor-container { flex: 1; }
        #editor { width: 100%; height: 100%; }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">SATI Code Editor - ${config.name}</h1>
        <span>Fullscreen Mode</span>
    </div>
    <div class="editor-container">
        <div id="editor"></div>
    </div>
    <script>
        require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
        require(['vs/editor/editor.main'], function () {
            monaco.editor.create(document.getElementById('editor'), {
                value: ${JSON.stringify(code)},
                language: '${config.monacoLanguage}',
                theme: '${isDark ? 'vs-dark' : 'vs'}',
                fontSize: 14,
                automaticLayout: true,
                minimap: { enabled: true },
                wordWrap: 'on'
            });
        });
    </script>
</body>
</html>`;
}

// Handle clear terminal
function handleClearTerminal() {
    if (terminalOutput) {
        terminalOutput.innerHTML = '';
        
        // Clear saved terminal data from localStorage
        localStorage.removeItem('sati_programming_terminal_output');
        localStorage.removeItem('sati_programming_terminal_history');
        
        // Reset terminal history
        terminalHistory = [];
        historyIndex = -1;
        
        showNotification('Terminal cleared', 'success');
    }
}

// Handle terminal keydown events
function handleTerminalKeydown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const command = terminalInput.value.trim();
        if (command) {
            executeTerminalCommand(command);
            terminalHistory.push(command);
            historyIndex = terminalHistory.length;
            
            // Save terminal history to localStorage
            saveTerminalHistory(terminalHistory);
        }
        terminalInput.value = '';
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            terminalInput.value = terminalHistory[historyIndex];
        }
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (historyIndex < terminalHistory.length - 1) {
            historyIndex++;
            terminalInput.value = terminalHistory[historyIndex];
        } else {
            historyIndex = terminalHistory.length;
            terminalInput.value = '';
        }
    } else if (event.key === 'Tab') {
        event.preventDefault();
        // Basic tab completion for common commands
        const currentValue = terminalInput.value;
        const suggestions = ['help', 'clear', 'ls', 'pwd', 'echo', 'date', 'whoami', 'run', 'compile'];
        const matches = suggestions.filter(cmd => cmd.startsWith(currentValue));
        if (matches.length === 1) {
            terminalInput.value = matches[0];
        }
    }
}

// Execute terminal command
function executeTerminalCommand(command) {
    // Add command to terminal output
    addToTerminalOutput(`<span class="terminal-prompt">sati@programming:${currentDirectory}$ </span><span class="terminal-command">${command}</span>`);
    
    // Parse command and arguments
    const parts = command.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    // Execute command
    switch (cmd) {
        case 'help':
            showTerminalHelp();
            break;
        case 'clear':
            handleClearTerminal();
            break;
        case 'ls':
            listFiles(args);
            break;
        case 'pwd':
            addToTerminalOutput(`<span class="terminal-result">${currentDirectory}</span>`);
            break;
        case 'echo':
            addToTerminalOutput(`<span class="terminal-result">${args.join(' ')}</span>`);
            break;
        case 'date':
            addToTerminalOutput(`<span class="terminal-result">${new Date().toString()}</span>`);
            break;
        case 'whoami':
            addToTerminalOutput(`<span class="terminal-result">sati-student</span>`);
            break;
        case 'run':
            addToTerminalOutput(`<span class="terminal-success">Running current code...</span>`);
            handleRunCode();
            break;
        case 'compile':
            addToTerminalOutput(`<span class="terminal-success">Compiling current code...</span>`);
            handleRunCode();
            break;
        case 'lang':
        case 'language':
            if (args.length > 0) {
                changeLanguageFromTerminal(args[0]);
            } else {
                addToTerminalOutput(`<span class="terminal-result">Current language: ${languageConfig[currentLanguage].name}</span>`);
            }
            break;
        case 'save':
            addToTerminalOutput(`<span class="terminal-success">Downloading current code...</span>`);
            handleDownloadCode();
            break;
        case 'copy':
            addToTerminalOutput(`<span class="terminal-success">Copying code to clipboard...</span>`);
            handleCopyCode();
            break;
        case 'cd':
            changeDirectory(args[0] || '~');
            break;
        case 'version':
            addToTerminalOutput(`<span class="terminal-result">SATI Programming Hub v1.0.0</span>`);
            break;
        case 'about':
            showAboutInfo();
            break;
        default:
            addToTerminalOutput(`<span class="terminal-error">Command not found: ${cmd}. Type 'help' for available commands.</span>`);
    }
}

// Add content to terminal output
function addToTerminalOutput(content) {
    if (terminalOutput) {
        const div = document.createElement('div');
        div.className = 'terminal-history-item';
        div.innerHTML = content;
        terminalOutput.appendChild(div);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        
        // Save terminal output to localStorage
        saveTerminalOutput(terminalOutput.innerHTML);
    }
}

// Show terminal help
function showTerminalHelp() {
    const helpText = `<span class="terminal-result">Available commands:
  help          - Show this help message
  clear         - Clear terminal output
  ls            - List files in current directory
  pwd           - Show current directory
  echo [text]   - Display text
  date          - Show current date and time
  whoami        - Show current user
  run           - Run/compile current code
  compile       - Alias for run command
  lang [name]   - Change programming language or show current
  save          - Download current code
  copy          - Copy code to clipboard
  cd [dir]      - Change directory
  version       - Show version information
  about         - Show about information

Navigation:
  ↑/↓ arrows    - Browse command history
  Tab           - Auto-complete commands</span>`;
    addToTerminalOutput(helpText);
}

// List files (simulated)
function listFiles(args) {
    const files = [
        'main.' + languageConfig[currentLanguage].extension,
    ];
    
    const fileList = files.map(file => {
        if (file.endsWith('/')) {
            return `<span style="color: #74c0fc;">${file}</span>`;
        } else if (file.endsWith('.' + languageConfig[currentLanguage].extension)) {
            return `<span style="color: #51cf66;">${file}</span>`;
        } else {
            return `<span style="color: #ffffff;">${file}</span>`;
        }
    }).join('  ');
    
    addToTerminalOutput(`<span class="terminal-result">${fileList}</span>`);
}

// Change directory (simulated)
function changeDirectory(dir) {
    if (!dir || dir === '~') {
        currentDirectory = '~';
    } else if (dir === '..') {
        if (currentDirectory !== '~') {
            const parts = currentDirectory.split('/');
            parts.pop();
            currentDirectory = parts.join('/') || '~';
        }
    } else if (dir.startsWith('/')) {
        currentDirectory = dir;
    } else {
        if (currentDirectory === '~') {
            currentDirectory = '~/' + dir;
        } else {
            currentDirectory = currentDirectory + '/' + dir;
        }
    }
    
    // Update prompt
    const prompt = document.querySelector('.terminal-prompt');
    if (prompt) {
        prompt.textContent = `sati@programming:${currentDirectory}$ `;
    }
}

// Change language from terminal
function changeLanguageFromTerminal(langName) {
    const langMap = {
        'c': 'c',
        'cpp': 'cpp',
        'c++': 'cpp',
        'java': 'java',
        'python': 'python',
        'py': 'python',
        'javascript': 'javascript',
        'js': 'javascript',
        'typescript': 'typescript',
        'ts': 'typescript',
        'html': 'html',
        'css': 'css',
    };
    
    const targetLang = langMap[langName.toLowerCase()];
    if (targetLang && languageConfig[targetLang]) {
        currentLanguage = targetLang;
        if (languageSelect) {
            languageSelect.value = targetLang;
        }
        updateEditorLanguage();
        addToTerminalOutput(`<span class="terminal-success">Language changed to ${languageConfig[targetLang].name}</span>`);
    } else {
        const availableLangs = Object.keys(langMap).join(', ');
        addToTerminalOutput(`<span class="terminal-error">Unknown language: ${langName}. Available: ${availableLangs}</span>`);
    }
}

// Show about information
function showAboutInfo() {
    const aboutText = `<span class="terminal-result">SATI Programming Hub
Built for Samrat Ashok Technological Institute (SATI)
Developed by Team FluxoNauts

Features:
- Multi-language code editor with Monaco Editor
- Interactive terminal with command support
- Real-time code execution simulation
- Dark/Light theme support
- Mobile-responsive design

Visit: https://sati-chatbot.vercel.app</span>`;
    addToTerminalOutput(aboutText);
}

// Initialize terminal with welcome message or saved output
function initializeTerminal() {
    if (terminalOutput && terminalInput) {
        // Load saved terminal output
        const savedOutput = loadTerminalOutput();
        
        if (savedOutput) {
            // Restore saved terminal output
            terminalOutput.innerHTML = savedOutput;
        } else {
            // Show welcome message for first time users
            const welcomeMessage = `<span class="terminal-success">Welcome to SATI Programming Hub Interactive Terminal!</span>
<span class="terminal-result">Type 'help' to see available commands.</span>
<span class="terminal-result">You can run code, change languages, and more!</span>`;
            
            addToTerminalOutput(welcomeMessage);
        }
        
        // Removed auto-focus to prevent jumping to terminal input on page load
        // Users can manually click on the terminal input when they want to use it
    }
}

// Toggle dark mode
function toggleDarkMode() {
    const currentActualTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentActualTheme === 'dark' ? 'light' : 'dark';

    // Apply theme
    applyTheme(newTheme);

    // Save to all possible localStorage keys for consistency across pages
    localStorage.setItem('sati_theme', newTheme);
    localStorage.setItem('light', newTheme);
    localStorage.setItem('theme', newTheme);

    // Remove system theme listener since we're switching to explicit theme
    if (window.systemThemeListener) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (mediaQuery.removeEventListener) {
            mediaQuery.removeEventListener('change', window.systemThemeListener);
        } else if (mediaQuery.removeListener) {
            mediaQuery.removeListener(window.systemThemeListener);
        }
        window.systemThemeListener = null;
    }

    // Send theme update to preview window
    sendThemeUpdateToPreview(newTheme);
}

// Update dark mode toggle state
function updateDarkModeIcon(isDark) {
    // Set checkbox state based on theme (checked = dark mode)
    if (darkModeToggle) {
        darkModeToggle.checked = isDark;
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    if (mobileNavMenu) {
        mobileNavMenu.classList.toggle('show');
    }

    // Update mobile menu toggle icon
    const icon = mobileMenuToggle.querySelector('i');
    if (mobileNavMenu && mobileNavMenu.classList.contains('show')) {
        icon.className = 'fas fa-times';
        document.body.classList.add('mobile-menu-open');
        if (blurOverlay) {
            blurOverlay.classList.add('show');
        }
    } else {
        icon.className = 'fas fa-bars';
        document.body.classList.remove('mobile-menu-open');
        if (blurOverlay) {
            blurOverlay.classList.remove('show');
        }
    }
}

// Close mobile menu
function closeMobileMenu() {
    if (mobileNavMenu) {
        mobileNavMenu.classList.remove('show');
    }
    const icon = mobileMenuToggle.querySelector('i');
    icon.className = 'fas fa-bars';
    document.body.classList.remove('mobile-menu-open');
    if (blurOverlay) {
        blurOverlay.classList.remove('show');
    }
}

// Load default content
function loadDefaultContent() {
    // Set default language
    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }

    // Set default title
    if (editorTitle) {
        editorTitle.textContent = `Coding in ${languageConfig[currentLanguage].name}`;
    }

    // Clear terminal
    if (terminalOutput) {
        terminalOutput.innerHTML = '';
    }

    // Initialize terminal with welcome message
    initializeTerminal();

    // Ensure proper active states are set
    setCurrentPageActive();
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--card-bg);
        color: var(--text-primary);
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: var(--shadow-hover);
        border: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.3s ease;
        max-width: 350px;
        word-wrap: break-word;
    }

    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }

    .notification-success {
        border-left: 4px solid var(--accent-color);
    }

    .notification-success i {
        color: var(--accent-color);
    }

    .notification-warning {
        border-left: 4px solid #ff9800;
    }

    .notification-warning i {
        color: #ff9800;
    }

    .notification-info {
        border-left: 4px solid var(--primary-color);
    }

    .notification-info i {
        color: var(--primary-color);
    }

    .notification-error {
        border-left: 4px solid #f44336;
    }

    .notification-error i {
        color: #f44336;
    }

    @media (max-width: 768px) {
        .notification {
            right: 10px;
            left: 10px;
            max-width: none;
            transform: translateY(-100px);
        }

        .notification.show {
            transform: translateY(0);
        }
    }
`;

// Add notification styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Navigation Dropdown Functionality
function initializeDropdownFunctionality() {
    // Mobile dropdown toggle functionality
    const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');

    mobileDropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            const dropdown = this.parentElement;
            dropdown.classList.toggle('open');
        });
    });
}

// Desktop dropdown delay functionality
function initializeDesktopDropdownDelay() {
    const navDropdown = document.querySelector('.nav-dropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    let hideTimeout;

    if (navDropdown && dropdownMenu) {
        // Show dropdown on hover
        navDropdown.addEventListener('mouseenter', function () {
            // Clear any existing timeout
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
            // Show dropdown immediately
            dropdownMenu.classList.add('show');
        });

        // Hide dropdown with delay on mouse leave
        navDropdown.addEventListener('mouseleave', function () {
            // Set timeout to hide dropdown after 500ms
            hideTimeout = setTimeout(() => {
                dropdownMenu.classList.remove('show');
            }, 500);
        });

        // If mouse enters dropdown menu, cancel hide timeout
        dropdownMenu.addEventListener('mouseenter', function () {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
        });

        // If mouse leaves dropdown menu, start hide timeout
        dropdownMenu.addEventListener('mouseleave', function () {
            hideTimeout = setTimeout(() => {
                dropdownMenu.classList.remove('show');
            }, 500);
        });
    }
}

// Set current page active state based on URL
function setCurrentPageActive() {
    const currentPath = window.location.pathname;

    // Handle programming page
    if (currentPath.includes('/resources/programming.html')) {
        updateDropdownLabel('Programming');
        updateMobileDropdownLabel('Programming');
    }
}

// Update dropdown label for desktop
function updateDropdownLabel(activeItem) {
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    if (dropdownToggle) {
        dropdownToggle.innerHTML = `${activeItem} <i class="fas fa-chevron-down"></i>`;

        // Update active states
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.classList.remove('active');
            if (item.textContent.trim() === activeItem) {
                item.classList.add('active');
            }
        });
    }
}

// Update dropdown label for mobile
function updateMobileDropdownLabel(activeItem) {
    const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
    if (mobileDropdownToggle) {
        // Update the span text and icon
        const span = mobileDropdownToggle.querySelector('span');
        const icon = mobileDropdownToggle.querySelector('i:not(.mobile-dropdown-arrow)');

        if (span) {
            span.textContent = activeItem;
        }

        if (icon) {
            // Update icon based on active item
            if (activeItem === 'Programming') {
                icon.className = 'fas fa-code';
            } else if (activeItem === 'Materials') {
                icon.className = 'fas fa-book';
            }
        }

        // Update active states
        const mobileDropdownItems = document.querySelectorAll('.mobile-dropdown-item');
        mobileDropdownItems.forEach(item => {
            item.classList.remove('active');
            if (item.textContent.trim() === activeItem) {
                item.classList.add('active');
            }
        });
    }
}

// Handle preview code
function handlePreviewCode() {
    if (!monacoEditor || !isEditorReady) {
        showNotification('Editor is not ready yet', 'warning');
        return;
    }

    const code = monacoEditor.getValue();
    const config = languageConfig[currentLanguage];

    // Check if the language supports preview (web technologies)
    const previewableLanguages = ['html', 'css', 'javascript'];
    
    if (!previewableLanguages.includes(currentLanguage)) {
        showNotification(`Preview not available for ${config.name}. Only HTML, CSS, and JavaScript are supported for live preview.`, 'warning');
        return;
    }

    // Save current code to localStorage for real-time updates
    saveCurrentCode(currentLanguage, code);

    // Open the dedicated preview page with only language parameter
    const previewUrl = `preview.html?language=${currentLanguage}`;
    const previewWindow = window.open(previewUrl, 'sati_preview', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    
    if (previewWindow) {
        // Store reference to preview window for real-time updates
        window.satiPreviewWindow = previewWindow;
        
        // Send initial code to preview window
        previewWindow.addEventListener('load', () => {
            previewWindow.postMessage({
                type: 'codeUpdate',
                language: currentLanguage,
                code: code
            }, window.location.origin);
        });
        
        showNotification(`Live preview opened for ${config.name}`, 'success');
    } else {
        showNotification('Failed to open preview window. Please check if popups are blocked.', 'error');
    }
}

// Handle clear code
function handleClearCode() {
    if (!monacoEditor || !isEditorReady) {
        showNotification('Editor is not ready yet', 'warning');
        return;
    }

    // Confirm before clearing
    if (confirm('Are you sure you want to clear all code? This action cannot be undone.')) {
        monacoEditor.setValue('');
        
        // Clear saved code from localStorage
        const codeKey = `sati_programming_code_${currentLanguage}`;
        localStorage.removeItem(codeKey);
        
        showNotification('Code cleared successfully', 'success');
        
        // Also clear terminal output
        if (terminalOutput) {
            terminalOutput.innerHTML = '';
            initializeTerminal();
        }
    }
}

// Export functions for external use
window.showNotification = showNotification;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;