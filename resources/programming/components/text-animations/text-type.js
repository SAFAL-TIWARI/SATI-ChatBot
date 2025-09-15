// Text Type Animation JavaScript
// GSAP-based text typing animation functionality

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Default settings for persistence
const defaultSettings = {
    currentView: 'preview',
    currentLanguage: 'html',
    typingSpeed: 75,
    pauseDuration: 1500,
    deletingSpeed: 50,
    cursorCharacter: "|",
    cursorBlinkDuration: 0.5,
    showCursor: true,
    variableSpeed: false,
    variableSpeedMin: 60,
    variableSpeedMax: 120
};

// Settings persistence functions
function saveSettings() {
    const settings = {
        ...currentSettings,
        currentView: currentView,
        currentLanguage: currentLanguage,
        typingSpeed: config.typingSpeed,
        pauseDuration: config.pauseDuration,
        deletingSpeed: config.deletingSpeed,
        cursorCharacter: config.cursorCharacter,
        cursorBlinkDuration: config.cursorBlinkDuration,
        showCursor: config.showCursor,
        variableSpeed: config.variableSpeed,
        variableSpeedMin: config.variableSpeedMin,
        variableSpeedMax: config.variableSpeedMax
    };
    localStorage.setItem('textTypeAnimationSettings', JSON.stringify(settings));
    console.log('Settings saved:', settings);
}

function loadSettings() {
    try {
        const saved = localStorage.getItem('textTypeAnimationSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            console.log('Settings loaded:', settings);
            return { ...defaultSettings, ...settings };
        }
    } catch (error) {
        console.warn('Error loading settings:', error);
    }
    return { ...defaultSettings };
}

// Load settings from localStorage or use defaults
let currentSettings = loadSettings();

// Global variables - initialize with loaded settings
let currentView = currentSettings.currentView || 'preview';
let currentLanguage = currentSettings.currentLanguage || 'html';
let textTypeInstance = null;
let currentTextIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let isTyping = false;

function restoreUIState() {
    console.log('Restoring UI state...');
    
    // Restore global variables
    currentView = currentSettings.currentView || 'preview';
    currentLanguage = currentSettings.currentLanguage || 'html';
    
    // Restore config values
    config.typingSpeed = currentSettings.typingSpeed || 75;
    config.pauseDuration = currentSettings.pauseDuration || 1500;
    config.deletingSpeed = currentSettings.deletingSpeed || 50;
    config.cursorCharacter = currentSettings.cursorCharacter || "|";
    config.cursorBlinkDuration = currentSettings.cursorBlinkDuration || 0.5;
    config.showCursor = currentSettings.showCursor !== undefined ? currentSettings.showCursor : true;
    config.variableSpeed = currentSettings.variableSpeed || false;
    config.variableSpeedMin = currentSettings.variableSpeedMin || 60;
    config.variableSpeedMax = currentSettings.variableSpeedMax || 120;
    
    // Restore UI controls
    if (cursorCharacterSelect) {
        cursorCharacterSelect.value = config.cursorCharacter;
    }
    
    if (typingSpeedSlider) {
        typingSpeedSlider.value = config.typingSpeed;
        if (typingSpeedValue) typingSpeedValue.textContent = `${config.typingSpeed}ms`;
    }
    
    if (pauseDurationSlider) {
        pauseDurationSlider.value = config.pauseDuration;
        if (pauseDurationValue) pauseDurationValue.textContent = `${config.pauseDuration}ms`;
    }
    
    if (deletingSpeedSlider) {
        deletingSpeedSlider.value = config.deletingSpeed;
        if (deletingSpeedValue) deletingSpeedValue.textContent = `${config.deletingSpeed}ms`;
    }
    
    if (cursorBlinkSlider) {
        cursorBlinkSlider.value = config.cursorBlinkDuration;
        if (cursorBlinkValue) cursorBlinkValue.textContent = `${config.cursorBlinkDuration}s`;
    }
    
    if (showCursorToggle) {
        showCursorToggle.checked = config.showCursor;
    }
    
    if (variableSpeedToggle) {
        variableSpeedToggle.checked = config.variableSpeed;
        // Show/hide variable speed controls
        if (variableSpeedMinGroup) {
            variableSpeedMinGroup.style.display = config.variableSpeed ? 'block' : 'none';
        }
        if (variableSpeedMaxGroup) {
            variableSpeedMaxGroup.style.display = config.variableSpeed ? 'block' : 'none';
        }
    }
    
    if (variableSpeedMinSlider) {
        variableSpeedMinSlider.value = config.variableSpeedMin;
        if (variableSpeedMinValue) variableSpeedMinValue.textContent = `${config.variableSpeedMin}ms`;
    }
    
    if (variableSpeedMaxSlider) {
        variableSpeedMaxSlider.value = config.variableSpeedMax;
        if (variableSpeedMaxValue) variableSpeedMaxValue.textContent = `${config.variableSpeedMax}ms`;
    }
    
    // Restore language select
    if (languageSelect && currentLanguage) {
        languageSelect.value = currentLanguage;
    }
    
    // Restore view (Preview/Code)
    switchView(currentView);
    
    console.log('UI state restored');
}

// Configuration - initialize with loaded settings
let config = {
    texts: ["Welcome to SATI ChatBot", "Text typing effect", "Happy coding!"],
    typingSpeed: currentSettings.typingSpeed || 75,
    pauseDuration: currentSettings.pauseDuration || 1500,
    deletingSpeed: currentSettings.deletingSpeed || 50,
    cursorCharacter: currentSettings.cursorCharacter || "|",
    cursorBlinkDuration: currentSettings.cursorBlinkDuration || 0.5,
    showCursor: currentSettings.showCursor !== undefined ? currentSettings.showCursor : true,
    variableSpeed: currentSettings.variableSpeed || false,
    variableSpeedMin: currentSettings.variableSpeedMin || 60,
    variableSpeedMax: currentSettings.variableSpeedMax || 120
};

// DOM Elements
const previewBtn = document.getElementById('previewBtn');
const codeBtn = document.getElementById('codeBtn');
const languageSelect = document.getElementById('languageSelect');
const restartBtn = document.getElementById('restartBtn');
const copyBtn = document.getElementById('copyBtn');
const previewContainer = document.getElementById('previewContainer');
const codeContainer = document.getElementById('codeContainer');
const codeContent = document.getElementById('codeContent');
const codeLanguage = document.getElementById('codeLanguage');
const darkModeToggle = document.getElementById('darkModeToggle');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileNavMenu = document.getElementById('mobileNavMenu');
const blurOverlay = document.getElementById('blurOverlay');
const mobileRightSidebarToggle = document.getElementById('mobileRightSidebarToggle');
const rightSidebar = document.getElementById('rightSidebar');
const searchInput = document.getElementById('searchInput');

// Text Type Animation Elements
const textContent = document.getElementById('textContent');
const textCursor = document.getElementById('textCursor');

// Customization DOM Elements
const cursorCharacterSelect = document.getElementById('cursorCharacterSelect');
const typingSpeedSlider = document.getElementById('typingSpeedSlider');
const pauseDurationSlider = document.getElementById('pauseDurationSlider');
const deletingSpeedSlider = document.getElementById('deletingSpeedSlider');
const cursorBlinkSlider = document.getElementById('cursorBlinkSlider');
const showCursorToggle = document.getElementById('showCursorToggle');
const variableSpeedToggle = document.getElementById('variableSpeedToggle');
const variableSpeedMinSlider = document.getElementById('variableSpeedMinSlider');
const variableSpeedMaxSlider = document.getElementById('variableSpeedMaxSlider');

// Value display elements
const typingSpeedValue = document.getElementById('typingSpeedValue');
const pauseDurationValue = document.getElementById('pauseDurationValue');
const deletingSpeedValue = document.getElementById('deletingSpeedValue');
const cursorBlinkValue = document.getElementById('cursorBlinkValue');
const variableSpeedMinValue = document.getElementById('variableSpeedMinValue');
const variableSpeedMaxValue = document.getElementById('variableSpeedMaxValue');

// Variable speed groups
const variableSpeedMinGroup = document.getElementById('variableSpeedMinGroup');
const variableSpeedMaxGroup = document.getElementById('variableSpeedMaxGroup');

// Code snippets for different languages
const codeSnippets = {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Text Type Animation</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="text-type-container">
        <span class="text-type__content" id="textContent">Welcome to SATI ChatBot</span>
        <span class="text-type__cursor" id="textCursor">|</span>
    </div>
    
    <script src="script.js"></script>
</body>
</html>`,

    css: `.text-type-container {
    font-size: 3rem;
    font-weight: 600;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    display: flex;
    align-items: center;
    min-height: 80px;
}

.text-type__content {
    color: #6366f1;
}

.text-type__cursor {
    color: #6366f1;
    animation: blink 1s infinite;
    margin-left: 2px;
    font-weight: 400;
}

@keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
}

.text-type__cursor--hidden {
    opacity: 0 !important;
}`,

    js: `// Text Type Animation Configuration
const config = {
    texts: ["Welcome to SATI ChatBot", "Text typing effect", "Happy coding!"],
    typingSpeed: 75,
    pauseDuration: 1500,
    deletingSpeed: 50,
    cursorCharacter: "|",
    cursorBlinkDuration: 0.5,
    showCursor: true,
    variableSpeed: false,
    variableSpeedMin: 60,
    variableSpeedMax: 120
};

// Global variables
let currentTextIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let isTyping = false;
let animationTimeout = null;

// DOM Elements
const textContent = document.getElementById('textContent');
const textCursor = document.getElementById('textCursor');

// Initialize the animation
function initTextTypeAnimation() {
    // Set initial state
    textContent.textContent = '';
    textCursor.textContent = config.cursorCharacter;
    textCursor.style.display = config.showCursor ? 'inline' : 'none';
    
    // Setup cursor blinking
    if (config.showCursor) {
        gsap.to(textCursor, {
            opacity: 0,
            duration: config.cursorBlinkDuration,
            repeat: -1,
            yoyo: true,
            ease: 'power2.inOut'
        });
    }
    
    // Start typing animation
    startTyping();
}

function startTyping() {
    if (isTyping) return;
    isTyping = true;
    
    function typeCharacter() {
        // Get current text dynamically
        const currentText = config.texts[currentTextIndex];
        
        if (isDeleting) {
            // Deleting characters
            if (currentCharIndex > 0) {
                currentCharIndex--;
                textContent.textContent = currentText.substring(0, currentCharIndex);
                
                const speed = config.variableSpeed ? 
                    Math.random() * (config.variableSpeedMax - config.variableSpeedMin) + config.variableSpeedMin :
                    config.deletingSpeed;
                
                animationTimeout = setTimeout(typeCharacter, speed);
            } else {
                // Finished deleting, move to next text
                isDeleting = false;
                currentTextIndex = (currentTextIndex + 1) % config.texts.length;
                animationTimeout = setTimeout(typeCharacter, config.pauseDuration / 2);
            }
        } else {
            // Typing characters
            if (currentCharIndex < currentText.length) {
                currentCharIndex++;
                textContent.textContent = currentText.substring(0, currentCharIndex);
                
                const speed = config.variableSpeed ? 
                    Math.random() * (config.variableSpeedMax - config.variableSpeedMin) + config.variableSpeedMin :
                    config.typingSpeed;
                
                animationTimeout = setTimeout(typeCharacter, speed);
            } else {
                // Finished typing, start deleting after pause
                if (config.texts.length > 1) {
                    animationTimeout = setTimeout(() => {
                        isDeleting = true;
                        typeCharacter();
                    }, config.pauseDuration);
                } else {
                    isTyping = false;
                }
            }
        }
    }
    
    typeCharacter();
}

function restartAnimation() {
    // Clear any existing timeout
    if (animationTimeout) {
        clearTimeout(animationTimeout);
    }
    
    // Reset state
    currentTextIndex = 0;
    currentCharIndex = 0;
    isDeleting = false;
    isTyping = false;
    
    // Restart animation
    initTextTypeAnimation();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initTextTypeAnimation);`
};

// Text Type Animation Functions
function initTextTypeAnimation() {
    // Clear any existing animation
    if (textTypeInstance) {
        clearTimeout(textTypeInstance);
    }
    
    // Reset state
    currentTextIndex = 0;
    currentCharIndex = 0;
    isDeleting = false;
    isTyping = false;
    
    // Set initial state
    textContent.textContent = '';
    textCursor.textContent = config.cursorCharacter;
    textCursor.style.display = config.showCursor ? 'inline' : 'none';
    
    // Setup cursor blinking
    if (config.showCursor) {
        gsap.killTweensOf(textCursor);
        gsap.to(textCursor, {
            opacity: 0,
            duration: config.cursorBlinkDuration,
            repeat: -1,
            yoyo: true,
            ease: 'power2.inOut'
        });
    }
    
    // Start typing animation
    startTyping();
}

function startTyping() {
    if (isTyping) return;
    isTyping = true;
    
    function typeCharacter() {
        // Get current text dynamically
        const currentText = config.texts[currentTextIndex];
        
        if (isDeleting) {
            // Deleting characters
            if (currentCharIndex > 0) {
                currentCharIndex--;
                textContent.textContent = currentText.substring(0, currentCharIndex);
                
                const speed = config.variableSpeed ? 
                    Math.random() * (config.variableSpeedMax - config.variableSpeedMin) + config.variableSpeedMin :
                    config.deletingSpeed;
                
                textTypeInstance = setTimeout(typeCharacter, speed);
            } else {
                // Finished deleting, move to next text
                isDeleting = false;
                currentTextIndex = (currentTextIndex + 1) % config.texts.length;
                textTypeInstance = setTimeout(typeCharacter, config.pauseDuration / 2);
            }
        } else {
            // Typing characters
            if (currentCharIndex < currentText.length) {
                currentCharIndex++;
                textContent.textContent = currentText.substring(0, currentCharIndex);
                
                const speed = config.variableSpeed ? 
                    Math.random() * (config.variableSpeedMax - config.variableSpeedMin) + config.variableSpeedMin :
                    config.typingSpeed;
                
                textTypeInstance = setTimeout(typeCharacter, speed);
            } else {
                // Finished typing, start deleting after pause
                if (config.texts.length > 1) {
                    textTypeInstance = setTimeout(() => {
                        isDeleting = true;
                        typeCharacter();
                    }, config.pauseDuration);
                } else {
                    isTyping = false;
                }
            }
        }
    }
    
    typeCharacter();
}

function restartAnimation() {
    // Clear any existing timeout
    if (textTypeInstance) {
        clearTimeout(textTypeInstance);
    }
    
    // Reset state
    currentTextIndex = 0;
    currentCharIndex = 0;
    isDeleting = false;
    isTyping = false;
    
    // Restart animation
    initTextTypeAnimation();
}

// View Management
function switchView(view) {
    currentView = view;
    
    const languageSelector = document.querySelector('.language-selector');
    const customizeSection = document.getElementById('customizeSection');
    
    if (view === 'preview') {
        previewContainer.style.display = 'flex';
        codeContainer.style.display = 'none';
        previewBtn.classList.add('active');
        codeBtn.classList.remove('active');
        
        // Hide language selector in preview mode
        if (languageSelector) languageSelector.style.display = 'none';
        
        // Show customize section in preview mode
        if (customizeSection) customizeSection.style.display = 'block';
    } else {
        previewContainer.style.display = 'none';
        codeContainer.style.display = 'block';
        previewBtn.classList.remove('active');
        codeBtn.classList.add('active');
        
        // Show language selector in code mode
        if (languageSelector) languageSelector.style.display = 'block';
        
        // Hide customize section in code mode
        if (customizeSection) customizeSection.style.display = 'none';
        
        updateCodeDisplay();
    }
    
    // Save the current view state
    saveSettings();
}

// Event Listeners for Controls
function initializeEventListeners() {
    // Preview/Code toggle
    previewBtn?.addEventListener('click', () => switchView('preview'));
    codeBtn?.addEventListener('click', () => switchView('code'));

    // Language selector
    languageSelect?.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        saveSettings();
        updateCodeDisplay();
    });

    // Restart button
    restartBtn?.addEventListener('click', restartAnimation);

    // Copy button
    copyBtn?.addEventListener('click', () => {
        navigator.clipboard.writeText(codeSnippets[currentLanguage]).then(() => {
            // Show feedback
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 1000);
        });
    });

    // Customization controls
    cursorCharacterSelect?.addEventListener('change', (e) => {
        config.cursorCharacter = e.target.value;
        textCursor.textContent = config.cursorCharacter;
        saveSettings();
    });

    typingSpeedSlider?.addEventListener('input', (e) => {
        config.typingSpeed = parseInt(e.target.value);
        typingSpeedValue.textContent = `${config.typingSpeed}ms`;
        saveSettings();
    });

    pauseDurationSlider?.addEventListener('input', (e) => {
        config.pauseDuration = parseInt(e.target.value);
        pauseDurationValue.textContent = `${config.pauseDuration}ms`;
        saveSettings();
    });

    deletingSpeedSlider?.addEventListener('input', (e) => {
        config.deletingSpeed = parseInt(e.target.value);
        deletingSpeedValue.textContent = `${config.deletingSpeed}ms`;
        saveSettings();
    });

    cursorBlinkSlider?.addEventListener('input', (e) => {
        config.cursorBlinkDuration = parseFloat(e.target.value);
        cursorBlinkValue.textContent = `${config.cursorBlinkDuration}s`;
        
        // Update cursor blinking
        if (config.showCursor) {
            gsap.killTweensOf(textCursor);
            gsap.to(textCursor, {
                opacity: 0,
                duration: config.cursorBlinkDuration,
                repeat: -1,
                yoyo: true,
                ease: 'power2.inOut'
            });
        }
        saveSettings();
    });

    showCursorToggle?.addEventListener('change', (e) => {
        config.showCursor = e.target.checked;
        textCursor.style.display = config.showCursor ? 'inline' : 'none';
        
        if (config.showCursor) {
            gsap.killTweensOf(textCursor);
            gsap.to(textCursor, {
                opacity: 0,
                duration: config.cursorBlinkDuration,
                repeat: -1,
                yoyo: true,
                ease: 'power2.inOut'
            });
        } else {
            gsap.killTweensOf(textCursor);
        }
        saveSettings();
    });

    variableSpeedToggle?.addEventListener('change', (e) => {
        config.variableSpeed = e.target.checked;
        variableSpeedMinGroup.style.display = config.variableSpeed ? 'flex' : 'none';
        variableSpeedMaxGroup.style.display = config.variableSpeed ? 'flex' : 'none';
        saveSettings();
    });

    variableSpeedMinSlider?.addEventListener('input', (e) => {
        config.variableSpeedMin = parseInt(e.target.value);
        variableSpeedMinValue.textContent = `${config.variableSpeedMin}ms`;
        
        // Ensure min is less than max
        if (config.variableSpeedMin >= config.variableSpeedMax) {
            config.variableSpeedMax = config.variableSpeedMin + 10;
            variableSpeedMaxSlider.value = config.variableSpeedMax;
            variableSpeedMaxValue.textContent = `${config.variableSpeedMax}ms`;
        }
        saveSettings();
    });

    variableSpeedMaxSlider?.addEventListener('input', (e) => {
        config.variableSpeedMax = parseInt(e.target.value);
        variableSpeedMaxValue.textContent = `${config.variableSpeedMax}ms`;
        
        // Ensure max is greater than min
        if (config.variableSpeedMax <= config.variableSpeedMin) {
            config.variableSpeedMin = config.variableSpeedMax - 10;
            variableSpeedMinSlider.value = config.variableSpeedMin;
            variableSpeedMinValue.textContent = `${config.variableSpeedMin}ms`;
        }
        saveSettings();
    });

    // Dark mode toggle is handled in initializeTheme() function

    // Mobile menu toggle
    mobileMenuToggle?.addEventListener('click', () => {
        toggleMobileMenu();
    });

    // Blur overlay click
    blurOverlay?.addEventListener('click', () => {
        toggleMobileMenu();
    });

    // Mobile right sidebar toggle
    mobileRightSidebarToggle?.addEventListener('click', () => {
        const mobileRightSidebar = document.getElementById('mobileRightSidebar');
        const mobileRightSidebarOverlay = document.getElementById('mobileRightSidebarOverlay');
        
        mobileRightSidebar.classList.add('show');
        mobileRightSidebarOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Close mobile menu if open
        if (mobileNavMenu.classList.contains('show')) {
            toggleMobileMenu();
        }
    });

    // Mobile right sidebar close
    document.getElementById('mobileRightSidebarClose')?.addEventListener('click', () => {
        const mobileRightSidebar = document.getElementById('mobileRightSidebar');
        const mobileRightSidebarOverlay = document.getElementById('mobileRightSidebarOverlay');
        
        mobileRightSidebar.classList.remove('show');
        mobileRightSidebarOverlay.classList.remove('show');
        document.body.style.overflow = '';
    });

    // Mobile right sidebar overlay
    document.getElementById('mobileRightSidebarOverlay')?.addEventListener('click', () => {
        const mobileRightSidebar = document.getElementById('mobileRightSidebar');
        const mobileRightSidebarOverlay = document.getElementById('mobileRightSidebarOverlay');
        
        mobileRightSidebar.classList.remove('show');
        mobileRightSidebarOverlay.classList.remove('show');
        document.body.style.overflow = '';
    });

    // File navigation
    document.querySelectorAll('.file-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const file = e.currentTarget.dataset.file;
            if (file === 'split-text') {
                window.location.href = 'split-text.html';
            } else if (file === 'text-type') {
                // Already on text-type page
                return;
            }
        });
    });

    // Left sidebar navigation
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const category = e.currentTarget.dataset.category;
            
            if (category === 'practice') {
                window.location.href = '/resources/programming/practice.html';
            } else if (category === 'components') {
                // Toggle dropdown
                const dropdown = document.getElementById('componentsDropdown');
                const arrow = e.currentTarget.querySelector('.dropdown-arrow');
                
                dropdown.classList.toggle('show');
                e.currentTarget.classList.toggle('active');
                
                // Save dropdown state
                saveDropdownState('components', dropdown.classList.contains('show'));
            }
        });
    });

    // Sub menu navigation
    const submenuItems = document.querySelectorAll('.sub-menu-item');
    submenuItems.forEach(item => {
        item.addEventListener('click', function() {
            const component = this.dataset.component;
            
            if (component === 'text-animations') {
                // Already on this page, just highlight
                submenuItems.forEach(si => si.classList.remove('active'));
                this.classList.add('active');
                
                // Auto-close the dropdown after selection with 500ms delay
                const dropdown = document.getElementById('componentsDropdown');
                const componentsMenuItem = document.querySelector('.menu-item[data-category="components"]');
                
                if (dropdown && dropdown.classList.contains('show')) {
                    setTimeout(() => {
                        dropdown.classList.remove('show');
                        componentsMenuItem.classList.remove('active');
                        
                        // Save closed state if saveDropdownState function exists
                        if (typeof saveDropdownState === 'function') {
                            saveDropdownState('components', false);
                        }
                    }, 500); // 500ms delay
                }
            }
        });
    });
}

// Dropdown state management
function saveDropdownState(category, isOpen) {
    localStorage.setItem(`sati_dropdown_${category}`, isOpen.toString());
}

function loadDropdownState(category) {
    const saved = localStorage.getItem(`sati_dropdown_${category}`);
    return saved === 'true';
}

// Mobile Menu Management
function toggleMobileMenu() {
    if (mobileNavMenu.classList.contains('show')) {
        mobileNavMenu.classList.remove('show');
        blurOverlay.classList.remove('show');
        document.body.style.overflow = '';
    } else {
        mobileNavMenu.classList.add('show');
        blurOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// Mobile Right Sidebar Management
function initializeMobileRightSidebar() {
    const mobileToggle = document.getElementById('mobileRightSidebarToggle');
    const mobileClose = document.getElementById('mobileRightSidebarClose');
    const mobileSidebar = document.getElementById('mobileRightSidebar');
    const mobileOverlay = document.getElementById('mobileRightSidebarOverlay');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const mobileFileList = document.getElementById('mobileFileList');
    const desktopSearchInput = document.getElementById('searchInput');
    const desktopFileList = document.querySelector('.right-sidebar .file-list');

    if (!mobileToggle || !mobileClose || !mobileSidebar || !mobileOverlay) {
        console.warn('Some mobile sidebar elements not found');
        return;
    }

    // Function to sync content from desktop to mobile sidebar
    function syncSidebarContent() {
        console.log('Syncing sidebar content');
        if (desktopSearchInput && mobileSearchInput) {
            mobileSearchInput.value = desktopSearchInput.value;
        }
        if (desktopFileList && mobileFileList) {
            mobileFileList.innerHTML = desktopFileList.innerHTML;
            // Re-attach click handlers to synced items
            const fileItems = mobileFileList.querySelectorAll('.file-item');
            fileItems.forEach(item => {
                item.addEventListener('click', handleFileItemClick);
            });
        }
    }

    // Function to sync search from mobile to desktop
    function syncSearchToDesktop() {
        console.log('Syncing search to desktop');
        if (mobileSearchInput && desktopSearchInput) {
            desktopSearchInput.value = mobileSearchInput.value;
            // Trigger search event on desktop input
            const event = new Event('input', { bubbles: true });
            desktopSearchInput.dispatchEvent(event);
        }
    }

    // Open mobile sidebar with animation
    function openMobileSidebar() {
        console.log('Opening mobile sidebar');
        
        // First ensure the sidebar is in the starting position
        mobileSidebar.style.transform = 'translateX(-100%)';
        mobileSidebar.style.left = '0';
        
        // Sync content before showing
        syncSidebarContent();
        
        // Activate the sidebar
        mobileSidebar.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Ensure overlay is visible before animation
        mobileOverlay.style.display = 'block';
        mobileOverlay.style.visibility = 'visible';
        mobileOverlay.style.opacity = '0';
        
        // Add entrance animation
        gsap.to(mobileSidebar, {
            x: '0%',
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => {
                // Apply blur to main content
                document.querySelector('.main-container').style.filter = 'blur(4px)';
                document.querySelector('.navbar').style.filter = 'blur(4px)';
                document.querySelector('.footer').style.filter = 'blur(4px)';
                
                // Disable pointer events on main content
                document.querySelector('.main-container').style.pointerEvents = 'none';
                document.querySelector('.navbar').style.pointerEvents = 'none';
                document.querySelector('.footer').style.pointerEvents = 'none';
            }
        });
        
        // Fade in overlay
        gsap.to(mobileOverlay, {
            opacity: 1,
            duration: 0.3,
            onStart: () => {
                mobileOverlay.style.visibility = 'visible';
            }
        });
    }

    // Close mobile sidebar with animation
    function closeMobileSidebar() {
        console.log('Closing mobile sidebar');
        
        // First, ensure the sidebar is positioned correctly before animating
        if (mobileSidebar.style.transform !== 'translateX(0%)') {
            mobileSidebar.style.transform = 'translateX(0%)';
        }
        
        // Then animate it out
        gsap.to(mobileSidebar, {
            x: '-100%',
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                // Reset transform and other states
                mobileSidebar.classList.remove('active');
                mobileSidebar.style.transform = '';
                mobileSidebar.style.left = '-100%';
                
                // Reset pointer events on main content
                document.querySelector('.main-container').style.pointerEvents = '';
                document.querySelector('.navbar').style.pointerEvents = '';
                document.querySelector('.footer').style.pointerEvents = '';
                
                // Reset any filters
                document.querySelector('.main-container').style.filter = '';
                document.querySelector('.navbar').style.filter = '';
                document.querySelector('.footer').style.filter = '';
            }
        });
        
        // Fade out overlay
        gsap.to(mobileOverlay, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                mobileOverlay.classList.remove('active');
                mobileOverlay.style.visibility = 'hidden';
                document.body.style.overflow = '';
                
                // Ensure the overlay is fully hidden and non-interactive
                mobileOverlay.style.display = 'none';
                setTimeout(() => {
                    mobileOverlay.style.display = 'block';
                    mobileOverlay.style.visibility = 'hidden';
                }, 100);
            }
        });
    }

    // Handle file item click
    function handleFileItemClick(e) {
        const fileItem = e.target.closest('.file-item');
        if (fileItem) {
            closeMobileSidebar();
            
            // Trigger click on corresponding desktop file item
            const fileName = fileItem.dataset.file;
            if (fileName && desktopFileList) {
                const desktopItem = desktopFileList.querySelector(`[data-file="${fileName}"]`);
                if (desktopItem) {
                    desktopItem.click();
                }
            }
        }
    }

    // Event listeners with debouncing for toggle
    let toggleTimeout;
    mobileToggle.addEventListener('click', function(e) {
        console.log('Mobile toggle clicked');
        e.preventDefault();
        e.stopPropagation();
        
        // Prevent rapid toggling
        if (toggleTimeout) {
            return;
        }
        
        if (mobileSidebar.classList.contains('active')) {
            closeMobileSidebar();
        } else {
            openMobileSidebar();
        }
        
        // Set a brief timeout to prevent rapid toggling
        toggleTimeout = setTimeout(() => {
            toggleTimeout = null;
        }, 400); // Slightly longer than animation duration
    });
    
    // Close button handler
    mobileClose.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeMobileSidebar();
    });
    
    // Overlay click handler with position check
    mobileOverlay.addEventListener('click', function(e) {
        // Only close if clicking the overlay itself, not its children
        if (e.target === mobileOverlay) {
            e.preventDefault();
            e.stopPropagation();
            closeMobileSidebar();
        }
    });
    
    // Document level click handler for clicking outside
    document.addEventListener('click', function(e) {
        if (mobileSidebar.classList.contains('active')) {
            // Check if click is outside the sidebar
            if (!mobileSidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                closeMobileSidebar();
            }
        }
    });

    // Sync mobile search with desktop
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('input', syncSearchToDesktop);
        // Add clear button functionality
        mobileSearchInput.addEventListener('focus', function() {
            this.classList.add('active');
        });
        mobileSearchInput.addEventListener('blur', function() {
            if (!this.value) {
                this.classList.remove('active');
            }
        });
    }

    // Handle file item clicks in mobile sidebar
    if (mobileFileList) {
        mobileFileList.addEventListener('click', handleFileItemClick);
    }

    // Close sidebar on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileSidebar.classList.contains('active')) {
            closeMobileSidebar();
        }
    });

    // Set up mutation observer to keep mobile content in sync
    if (desktopFileList) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mobileSidebar.classList.contains('active')) {
                    syncSidebarContent();
                }
            });
        });
        
        observer.observe(desktopFileList, {
            childList: true,
            subtree: true
        });
    }
}

function updateCodeDisplay() {
    if (codeContent && codeLanguage) {
        codeContent.textContent = codeSnippets[currentLanguage];
        codeLanguage.textContent = currentLanguage.toUpperCase();
    }
}

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('sati_theme') || 
                      localStorage.getItem('light') || 
                      localStorage.getItem('theme') || 
                      'dark';
    
    // Apply theme immediately
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.style.backgroundColor = savedTheme === 'dark' ? '#121212' : '#f5f7f9';
    document.documentElement.style.color = savedTheme === 'dark' ? '#ffffff' : '#2c3e50';
    
    // Update body styles
    if (document.body) {
        document.body.style.backgroundColor = savedTheme === 'dark' ? '#121212' : '#f5f7f9';
        document.body.style.color = savedTheme === 'dark' ? '#ffffff' : '#2c3e50';
    }
    
    if (darkModeToggle) {
        // Set checkbox state based on current theme (checked = dark mode)
        darkModeToggle.checked = savedTheme === 'dark';
        
        // Remove any existing event listeners to prevent duplicates
        darkModeToggle.removeEventListener('change', handleThemeToggle);
        darkModeToggle.addEventListener('change', handleThemeToggle);
    }
}

function handleThemeToggle() {
    const newTheme = darkModeToggle.checked ? 'dark' : 'light';
    
    // Apply theme immediately
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.style.backgroundColor = newTheme === 'dark' ? '#121212' : '#f5f7f9';
    document.documentElement.style.color = newTheme === 'dark' ? '#ffffff' : '#2c3e50';
    
    // Update body styles
    if (document.body) {
        document.body.style.backgroundColor = newTheme === 'dark' ? '#121212' : '#f5f7f9';
        document.body.style.color = newTheme === 'dark' ? '#ffffff' : '#2c3e50';
    }
    
    // Save to all possible storage keys for compatibility
    localStorage.setItem('sati_theme', newTheme);
    localStorage.setItem('light', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Initialize dropdown state
function initializeDropdownState() {
    // Initialize dropdown state - default to closed unless user previously opened it
    const componentsDropdownOpen = loadDropdownState('components');
    const dropdown = document.getElementById('componentsDropdown');
    const componentsMenuItem = document.querySelector('.menu-item[data-category="components"]');
    
    if (componentsDropdownOpen) {
        dropdown.classList.add('show');
        componentsMenuItem.classList.add('active');
    } else {
        dropdown.classList.remove('show');
        componentsMenuItem.classList.remove('active');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeDropdownState();
    initializeEventListeners();
    initializeMobileRightSidebar();
    
    // Restore UI state from localStorage (this will set currentView and currentLanguage)
    restoreUIState();
    
    // Initialize animation after UI state is restored
    initTextTypeAnimation();
    updateCodeDisplay();
});

// Note: Removed visibilitychange event listener to prevent animation restart on tab switching
// Animation will only restart on actual page refresh or manual restart button click

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    // Close sidebar dropdowns when clicking outside with 500ms delay
    const clickedInsideDropdown = e.target.closest('.sidebar-dropdown-content') || 
                                 e.target.closest('.sub-menu-item') ||
                                 e.target.closest('.menu-item[data-category="components"]');
    
    if (!clickedInsideDropdown) {
        const openDropdowns = document.querySelectorAll('.sidebar-dropdown-content.show');
        const activeMenuItems = document.querySelectorAll('.menu-item[data-category="components"].active');
        
        if (openDropdowns.length > 0 || activeMenuItems.length > 0) {
            setTimeout(() => {
                openDropdowns.forEach(dropdown => {
                    dropdown.classList.remove('show');
                });
                activeMenuItems.forEach(item => {
                    item.classList.remove('active');
                });
                
                // Save closed state for components dropdown
                saveDropdownState('components', false);
            }, 500); // 500ms delay
        }
    }
});

// Navigation dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    const navDropdowns = document.querySelectorAll('.nav-dropdown');
    let hoverTimeout;

    navDropdowns.forEach(dropdown => {
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        
        if (!dropdownMenu) return; // Skip if no dropdown menu found
        
        // Desktop hover functionality with delay
        dropdown.addEventListener('mouseenter', function() {
            clearTimeout(hoverTimeout); // Clear any previous timeout
            dropdownMenu.style.display = 'block';
            dropdownMenu.style.opacity = '1';
        });

        dropdown.addEventListener('mouseleave', function() {
            // Set timeout to hide menu
            hoverTimeout = setTimeout(() => {
                dropdownMenu.style.opacity = '0';
                dropdownMenu.style.display = 'none';
            }, 500); // 500ms delay before hiding
        });

        // Mobile click functionality
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        if (dropdownToggle) {
            dropdownToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (window.innerWidth <= 768) { // Only for mobile
                    const isVisible = dropdownMenu.style.display === 'block';
                    dropdownMenu.style.display = isVisible ? 'none' : 'block';
                    dropdownMenu.style.opacity = isVisible ? '0' : '1';
                }
            });
        }
    });

    // Mobile dropdown in navigation menu
    const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
    const mobileDropdownMenu = document.querySelector('.mobile-dropdown-menu');
    const mobileDropdownArrow = document.querySelector('.mobile-dropdown-arrow');

    if (mobileDropdownToggle && mobileDropdownMenu && mobileDropdownArrow) {
        mobileDropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isExpanded = mobileDropdownMenu.classList.contains('show');
            
            // Toggle classes
            mobileDropdownMenu.classList.toggle('show');
            mobileDropdownArrow.classList.toggle('rotated');
            
            // Set max-height for animation
            if (!isExpanded) {
                mobileDropdownMenu.style.maxHeight = mobileDropdownMenu.scrollHeight + 'px';
            } else {
                mobileDropdownMenu.style.maxHeight = null;
            }
        });
    }

    // Close navigation dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        navDropdowns.forEach(dropdown => {
            const dropdownMenu = dropdown.querySelector('.dropdown-menu');
            if (dropdownMenu && !dropdown.contains(e.target)) {
                dropdownMenu.style.display = 'none';
                dropdownMenu.style.opacity = '0';
            }
        });
        
        // Close mobile dropdown when clicking outside
        if (mobileDropdownMenu && !e.target.closest('.mobile-dropdown-toggle') && !e.target.closest('.mobile-dropdown-menu')) {
            mobileDropdownMenu.classList.remove('show');
            if (mobileDropdownArrow) {
                mobileDropdownArrow.classList.remove('rotated');
            }
            mobileDropdownMenu.style.maxHeight = null;
        }
    });
});