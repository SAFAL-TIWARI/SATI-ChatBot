// Split Text Animation JavaScript
// GSAP-based text animation functionality

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Global variables
let currentView = 'preview';
let currentLanguage = 'html';
let splitTextInstances = [];

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

// Customization DOM Elements
const splitTypeSelect = document.getElementById('splitTypeSelect');
const easeSelect = document.getElementById('easeSelect');
const completionToast = document.getElementById('completionToast');
const staggerDelaySlider = document.getElementById('staggerDelay');
const durationSlider = document.getElementById('duration');
const thresholdSlider = document.getElementById('threshold');

// Code snippets for different languages
const codeSnippets = {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Split Text Animation</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <div class="split-text-demo" id="splitTextDemo1">
            Hello World!
        </div>
       
    </div>
    
    <script src="script.js"></script>
</body>
</html>`,

    css: `/* Split Text Animation Styles */
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 40px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-family: 'Inter', sans-serif;
}

.split-text-demo {
    font-size: 3rem;
    font-weight: 700;
    margin: 40px 0;
    color: #ffffff;
    line-height: 1.2;
    text-align: center;
    opacity: 0;
}

/* Split word styles */
.split-word {
    display: inline-block;
    opacity: 0;
    transform: translateY(40px);
    will-change: transform, opacity;
}

/* Split character styles (legacy support) */
.split-char {
    display: inline-block;
    opacity: 0;
    transform: translateY(40px);
    will-change: transform, opacity;
}

/* Responsive Design */
@media (max-width: 768px) {
    .split-text-demo {
        font-size: 2rem;
    }
}

@media (max-width: 480px) {
    .split-text-demo {
        font-size: 1.5rem;
    }
}`,

    js: `// Split Text Animation JavaScript
// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Split Text Animation Class
class SplitTextAnimation {
    constructor(element, options = {}) {
        this.element = typeof element === 'string' ? document.querySelector(element) : element;
        this.options = {
            delay: options.delay || 250,
            duration: options.duration || 0.7,
            ease: options.ease || "power3.out",
            splitType: options.splitType || "words",
            from: options.from || { opacity: 0, y: 40 },
            to: options.to || { opacity: 1, y: 0 },
            threshold: options.threshold || 1.5,
            rootMargin: options.rootMargin || "-50px",
            onComplete: options.onComplete || null,
            ...options
        };
        
        this.chars = [];
        this.timeline = null;
        this.scrollTrigger = null;
        
        this.init();
    }
    
    init() {
        if (!this.element) {
            console.warn('Split Text Animation: Element not found');
            return;
        }
        
        this.splitText();
        this.createAnimation();
    }
    
    splitText() {
        const text = this.element.textContent;
        this.element.innerHTML = '';
        
        // Split text into words
        const words = text.trim().split(/\s+/);
        this.chars = [];
        
        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.textContent = word;
            span.className = 'split-word';
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = \`translateY(\${this.options.from.y}px)\`;
            span.style.willChange = 'transform, opacity';
            
            this.element.appendChild(span);
            this.chars.push(span);
            
            // Add space after each word except the last one
            if (index < words.length - 1) {
                const spaceSpan = document.createElement('span');
                spaceSpan.textContent = ' ';
                spaceSpan.style.display = 'inline';
                this.element.appendChild(spaceSpan);
            }
        });
    }
    
    createAnimation() {
        // Calculate scroll trigger start position
        const startPct = (1 - this.options.threshold) * 100;
        const marginMatch = /^(-?\\d+(?:\\.\\d+)?)(px|em|rem|%)?$/.exec(this.options.rootMargin);
        const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
        const marginUnit = marginMatch ? (marginMatch[2] || 'px') : 'px';
        const sign = marginValue < 0 ? \`-=\${Math.abs(marginValue)}\${marginUnit}\` : \`+=\${marginValue}\${marginUnit}\`;
        const start = \`top \${startPct}%\${sign}\`;
        
        // Create timeline
        this.timeline = gsap.timeline({
            scrollTrigger: {
                trigger: this.element,
                start: start,
                toggleActions: "play none none none",
                once: true,
                onToggle: (self) => {
                    this.scrollTrigger = self;
                }
            },
            smoothChildTiming: true,
            onComplete: () => {
                // Clean up will-change property for performance
                gsap.set(this.chars, {
                    clearProps: "willChange",
                    immediateRender: true
                });
                
                if (this.options.onComplete) {
                    this.options.onComplete();
                }
            }
        });
        
        // Set initial state
        gsap.set(this.chars, { 
            ...this.options.from, 
            immediateRender: false, 
            force3D: true 
        });
        
        // Animate characters
        this.timeline.to(this.chars, {
            ...this.options.to,
            duration: this.options.duration,
            ease: this.options.ease,
            stagger: this.options.delay / 1000,
            force3D: true
        });
    }
    
    restart() {
        if (this.timeline) {
            this.timeline.restart();
        }
    }
    
    playAnimation() {
        // Create a simple timeline without scroll trigger for immediate playback
        if (this.chars && this.chars.length > 0) {
            // Set initial state
            gsap.set(this.chars, { 
                ...this.options.from, 
                clearProps: "transform,opacity",
                immediateRender: true 
            });
            
            // Animate to final state
            gsap.to(this.chars, {
                ...this.options.to,
                duration: this.options.duration,
                ease: this.options.ease,
                stagger: this.options.delay / 1000,
                force3D: true,
                onComplete: () => {
                    // Clean up will-change property for performance
                    gsap.set(this.chars, {
                        clearProps: "willChange",
                        immediateRender: true
                    });
                    
                    if (this.options.onComplete) {
                        this.options.onComplete();
                    }
                }
            });
        }
    }
    
    destroy() {
        if (this.timeline) {
            this.timeline.kill();
        }
        if (this.scrollTrigger) {
            this.scrollTrigger.kill();
        }
        gsap.killTweensOf(this.chars);
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create split text animations
    const splitTextElements = document.querySelectorAll('.split-text-demo');
    const animations = [];
    
    splitTextElements.forEach((element, index) => {
        const animation = new SplitTextAnimation(element, {
            delay: 100,
            duration: 0.6,
            ease: "power3.out",
            from: { opacity: 0, y: 40 },
            to: { opacity: 1, y: 0 },
            threshold: 1.5,
            rootMargin: "-100px",
            onComplete: () => {
                console.log(\`Animation \${index + 1} completed!\`);
            }
        });
        animations.push(animation);
    });
    
    // Restart all animations function
    window.restartAnimations = function() {
        animations.forEach(animation => {
            animation.restart();
        });
    };
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        animations.forEach(animation => {
            animation.destroy();
        });
    });
});

// Usage Example:
/*
// Basic usage - animates words instead of characters
const splitText1 = new SplitTextAnimation('#myText');

// Advanced usage with custom options for word animation
const splitText2 = new SplitTextAnimation('#myText2', {
    delay: 150,        // Delay between each word (in ms)
    duration: 0.4,     // Duration for each word animation
    ease: "power3.out",
    from: { opacity: 0, y: 40 },
    to: { opacity: 1, y: 0 },
    threshold: 1.5,
    rootMargin: "-50px",
    onComplete: () => {
        console.log('Word-based animation completed!');
    }
});

// Restart animation
splitText1.restart();

// Destroy animation
splitText1.destroy();
*/`
};

// Split Text Animation Class (same as in the code snippet)
class SplitTextAnimation {
    constructor(element, options = {}) {
        this.element = typeof element === 'string' ? document.querySelector(element) : element;
        this.options = {
            delay: options.delay || 250,
            duration: options.duration || 0.7,
            ease: options.ease || "power3.out",
            splitType: options.splitType || "words",
            from: options.from || { opacity: 0, y: 40 },
            to: options.to || { opacity: 1, y: 0 },
            threshold: options.threshold || 1.5,
            rootMargin: options.rootMargin || "-50px",
            onComplete: options.onComplete || null,
            ...options
        };
        
        this.chars = [];
        this.timeline = null;
        this.scrollTrigger = null;
        
        this.init();
    }
    
    init() {
        if (!this.element) {
            console.warn('Split Text Animation: Element not found');
            return;
        }
        
        this.splitText();
        this.createAnimation();
    }
    
    splitText() {
        const text = this.element.textContent;
        this.element.innerHTML = '';
        
        if (this.options.splitType === 'chars') {
            // Split text into characters
            const chars = text.split('');
            this.chars = chars.map((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char; // Use non-breaking space
                span.className = 'split-char';
                span.style.display = 'inline-block';
                span.style.opacity = '0';
                span.style.transform = `translateY(${this.options.from.y}px)`;
                span.style.willChange = 'transform, opacity';
                
                this.element.appendChild(span);
                return span;
            });
        } else {
            // Split text into words
            const words = text.trim().split(/\s+/);
            this.chars = [];
            
            words.forEach((word, index) => {
                const span = document.createElement('span');
                span.textContent = word;
                span.className = 'split-word';
                span.style.display = 'inline-block';
                span.style.opacity = '0';
                span.style.transform = `translateY(${this.options.from.y}px)`;
                span.style.willChange = 'transform, opacity';
                
                this.element.appendChild(span);
                this.chars.push(span);
                
                // Add space after each word except the last one
                if (index < words.length - 1) {
                    const spaceSpan = document.createElement('span');
                    spaceSpan.textContent = ' ';
                    spaceSpan.style.display = 'inline';
                    this.element.appendChild(spaceSpan);
                }
            });
        }
    }
    
    createAnimation() {
        // Create timeline configuration
        const timelineConfig = {
            smoothChildTiming: true,
            onComplete: () => {
                // Clean up will-change property for performance
                gsap.set(this.chars, {
                    clearProps: "willChange",
                    immediateRender: true
                });
                
                if (this.options.onComplete) {
                    this.options.onComplete();
                }
            }
        };
        
        // Add scroll trigger only if not auto-playing
        if (!this.options.autoPlay) {
            const startPct = (1 - this.options.threshold) * 100;
            const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(this.options.rootMargin);
            const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
            const marginUnit = marginMatch ? (marginMatch[2] || 'px') : 'px';
            const sign = marginValue < 0 ? `-=${Math.abs(marginValue)}${marginUnit}` : `+=${marginValue}${marginUnit}`;
            const start = `top ${startPct}%${sign}`;
            
            timelineConfig.scrollTrigger = {
                trigger: this.element,
                start: start,
                toggleActions: "play none none none",
                once: true,
                onToggle: (self) => {
                    this.scrollTrigger = self;
                }
            };
        }
        
        // Create timeline
        this.timeline = gsap.timeline(timelineConfig);
        
        // Set initial state
        gsap.set(this.chars, { 
            ...this.options.from, 
            immediateRender: false, 
            force3D: true 
        });
        
        // Animate characters
        this.timeline.to(this.chars, {
            ...this.options.to,
            duration: this.options.duration,
            ease: this.options.ease,
            stagger: this.options.delay / 1000,
            force3D: true
        });
        
        // Auto-play if specified
        if (this.options.autoPlay) {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                console.log('Auto-playing animation for:', this.element);
                this.timeline.play();
            }, 100);
        }
    }
    
    restart() {
        if (this.timeline) {
            this.timeline.restart();
        }
    }
    
    destroy() {
        if (this.timeline) {
            this.timeline.kill();
        }
        if (this.scrollTrigger) {
            this.scrollTrigger.kill();
        }
        gsap.killTweensOf(this.chars);
    }
}

// Initialize animations
let splitTextAnimations = [];

// Default settings
const defaultAnimationSettings = {
    splitType: 'words',
    ease: 'elastic.out(1, 0.3)',
    showCompletionToast: true,
    staggerDelay: 70,
    duration: 2,
    threshold: 0.1,
    currentView: 'preview',
    currentLanguage: 'html'
};

// Load settings from localStorage or use defaults
let currentAnimationSettings = loadSettings();

// Settings persistence functions
function saveSettings() {
    const settings = {
        ...currentAnimationSettings,
        currentView: currentView,
        currentLanguage: currentLanguage
    };
    localStorage.setItem('splitTextAnimationSettings', JSON.stringify(settings));
    console.log('Settings saved:', settings);
}

function loadSettings() {
    try {
        const saved = localStorage.getItem('splitTextAnimationSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            console.log('Settings loaded:', settings);
            return { ...defaultAnimationSettings, ...settings };
        }
    } catch (error) {
        console.warn('Error loading settings:', error);
    }
    return { ...defaultAnimationSettings };
}

function restoreUIState() {
    console.log('Restoring UI state...');
    
    // Restore global variables
    currentView = currentAnimationSettings.currentView || 'preview';
    currentLanguage = currentAnimationSettings.currentLanguage || 'html';
    
    // Restore split type select
    if (splitTypeSelect && currentAnimationSettings.splitType) {
        splitTypeSelect.value = currentAnimationSettings.splitType;
    }
    
    // Restore ease select
    if (easeSelect && currentAnimationSettings.ease) {
        easeSelect.value = currentAnimationSettings.ease;
    }
    
    // Restore completion toast toggle
    if (completionToast) {
        completionToast.checked = currentAnimationSettings.showCompletionToast;
    }
    
    // Restore sliders and their display values
    if (staggerDelaySlider && currentAnimationSettings.staggerDelay) {
        staggerDelaySlider.value = currentAnimationSettings.staggerDelay;
        const staggerValue = staggerDelaySlider.parentElement.querySelector('.slider-value');
        if (staggerValue) staggerValue.textContent = currentAnimationSettings.staggerDelay;
    }
    
    if (durationSlider && currentAnimationSettings.duration) {
        durationSlider.value = currentAnimationSettings.duration;
        const durationValue = durationSlider.parentElement.querySelector('.slider-value');
        if (durationValue) durationValue.textContent = currentAnimationSettings.duration;
    }
    
    if (thresholdSlider && currentAnimationSettings.threshold) {
        thresholdSlider.value = currentAnimationSettings.threshold;
        const thresholdValue = thresholdSlider.parentElement.querySelector('.slider-value');
        if (thresholdValue) thresholdValue.textContent = currentAnimationSettings.threshold;
    }
    
    // Restore language select
    if (languageSelect && currentLanguage) {
        languageSelect.value = currentLanguage;
    }
    
    // Restore view (Preview/Code)
    switchView(currentView);
    
    console.log('UI state restored');
}

function initializeSplitTextAnimations() {
    console.log('Initializing split text animations...');
    
    // Clear existing animations
    splitTextAnimations.forEach(animation => animation.destroy());
    splitTextAnimations = [];
    
    // Create new animations
    const splitTextElements = document.querySelectorAll('.split-text-demo');
    console.log('Found split text elements:', splitTextElements.length);
    
    splitTextElements.forEach((element, index) => {
        // Make the element visible first
        element.style.opacity = '1';
        
        const animation = new SplitTextAnimation(element, {
            delay: currentAnimationSettings.staggerDelay || 70,
            duration: currentAnimationSettings.duration,
            ease: currentAnimationSettings.ease,
            splitType: currentAnimationSettings.splitType,
            from: { opacity: 0, y: 40 },
            to: { opacity: 1, y: 0 },
            threshold: 0.1,
            rootMargin: "-10px",
            autoPlay: false, // Don't use scroll trigger for preview
            onComplete: () => {
                if (currentAnimationSettings.showCompletionToast) {
                    showAnimationFinishedToast();
                }
                console.log(`Animation ${index + 1} completed!`);
            }
        });
        
        // For preview, play animation immediately without scroll trigger
        setTimeout(() => {
            animation.playAnimation();
        }, 500);
        splitTextAnimations.push(animation);
    });
    
    // Animations will auto-play due to autoPlay: true option
}

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('sati_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (darkModeToggle) {
        // Fix: checkbox should be checked for dark mode (moon), unchecked for light mode (sun)
        darkModeToggle.checked = savedTheme === 'dark';
        
        darkModeToggle.addEventListener('change', function() {
            // Fix: when checked = dark mode, when unchecked = light mode
            const newTheme = this.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('sati_theme', newTheme);
            localStorage.setItem('light', newTheme);
        });
    }
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

// Code Display Management
function updateCodeDisplay() {
    const code = codeSnippets[currentLanguage];
    codeContent.textContent = code;
    codeLanguage.textContent = currentLanguage.toUpperCase();
}

// Copy Code Functionality
function copyCode() {
    const code = codeSnippets[currentLanguage];
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(code).then(() => {
            showCopyFeedback();
        }).catch(err => {
            console.error('Failed to copy code:', err);
            fallbackCopyCode(code);
        });
    } else {
        fallbackCopyCode(code);
    }
}

function fallbackCopyCode(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyFeedback();
    } catch (err) {
        console.error('Failed to copy code:', err);
    }
    
    document.body.removeChild(textArea);
}

function showCopyFeedback() {
    // Store original state
    const originalHTML = copyBtn.innerHTML;
    const originalTitle = copyBtn.title;
    
    // Temporarily disable the button to prevent multiple clicks
    copyBtn.disabled = true;
    
    // Change to checkmark SVG
    copyBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
        </svg>
    `;
    copyBtn.title = 'Copied!';
    copyBtn.style.background = 'rgba(0, 200, 83, 0.1)';
    copyBtn.style.color = '#00c853';
    
    // Reset to original state after 1.5 seconds
    setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
        copyBtn.title = originalTitle;
        copyBtn.style.background = 'transparent';
        copyBtn.style.color = 'var(--text-secondary)';
        copyBtn.disabled = false;
    }, 1500);
}

// Restart Animation
function restartAnimations() {
    splitTextAnimations.forEach(animation => {
        animation.restart();
    });
}

// Mobile Menu Management
function toggleMobileMenu() {
    const isOpen = mobileNavMenu.classList.contains('show');
    
    if (isOpen) {
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

// Removed toggleMobileRightSidebar as it's no longer needed - functionality is handled in initializeMobileRightSidebar

// Mobile Dropdown Management
function toggleMobileDropdown() {
    const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
    const mobileDropdownMenu = document.querySelector('.mobile-dropdown-menu');
    const mobileDropdownArrow = document.querySelector('.mobile-dropdown-arrow');
    
    if (mobileDropdownMenu && mobileDropdownArrow) {
        mobileDropdownMenu.classList.toggle('show');
        mobileDropdownArrow.classList.toggle('rotated');
    }
}

// Search Functionality
function handleSearch(sourceInput) {
    const searchTerm = sourceInput.value.toLowerCase();
    const fileItems = document.querySelectorAll('.file-item');
    
    fileItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Sync search between desktop and mobile if needed
    const isDesktop = sourceInput === searchInput;
    const targetInput = isDesktop ? document.getElementById('mobileSearchInput') : searchInput;
    
    if (targetInput && targetInput.value !== searchTerm) {
        targetInput.value = searchTerm;
    }
}

// Navigation Management
function handleNavigation() {
    // Left sidebar menu items
    const menuItems = document.querySelectorAll('.menu-item[data-category]');
    const submenuItems = document.querySelectorAll('.sub-menu-item[data-component]');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const category = this.dataset.category;
            
            if (category === 'practice') {
                window.location.href = '/resources/programming/practice.html';
            } else if (category === 'components') {
                // Toggle dropdown
                const dropdown = document.getElementById('componentsDropdown');
                dropdown.classList.toggle('show');
                this.classList.toggle('active');
                
                // Save dropdown state
                saveDropdownState('components', dropdown.classList.contains('show'));
            }
        });
    });
    
    submenuItems.forEach(item => {
        item.addEventListener('click', function() {
            const component = this.dataset.component;
            
            if (component === 'text-animations') {
                // Already on this page, just highlight
                submenuItems.forEach(si => si.classList.remove('active'));
                this.classList.add('active');
                
                // Auto-close the dropdown after selection with 1 second delay
                const dropdown = document.getElementById('componentsDropdown');
                const componentsMenuItem = document.querySelector('.menu-item[data-category="components"]');
                
                if (dropdown && dropdown.classList.contains('show')) {
                    setTimeout(() => {
                        dropdown.classList.remove('show');
                        componentsMenuItem.classList.remove('active');
                        
                        // Save closed state
                        saveDropdownState('components', false);
                    }, 500); // 1 second delay
                }
            }
        });
    });
    
    // File navigation
    const fileItems = document.querySelectorAll('.file-item[data-file]');
    fileItems.forEach(item => {
        item.addEventListener('click', function() {
            const file = this.dataset.file;
            
            if (file === 'text-type') {
                window.location.href = 'text-type.html';
            } else if (file === 'split-text') {
                // Already on split-text page
                return;
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

// Customization Functions
function initializeCustomizationControls() {
    // Initialize select controls
    initializeSelects();
    
    // Initialize slider controls
    initializeSliders();
    
    // Initialize toggle controls
    initializeToggles();
}

function initializeSelects() {
    // Split Type Select
    if (splitTypeSelect) {
        splitTypeSelect.addEventListener('change', function() {
            currentAnimationSettings.splitType = this.value;
            saveSettings();
            restartAnimationsWithSettings();
        });
    }
    
    // Ease Select
    if (easeSelect) {
        easeSelect.addEventListener('change', function() {
            currentAnimationSettings.ease = this.value;
            saveSettings();
            restartAnimationsWithSettings();
        });
    }
}

function initializeSliders() {
    // Stagger Delay Slider
    if (staggerDelaySlider) {
        const staggerValue = staggerDelaySlider.parentElement.querySelector('.slider-value');
        staggerDelaySlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            staggerValue.textContent = value;
            currentAnimationSettings.staggerDelay = value;
            saveSettings();
            restartAnimationsWithSettings();
        });
    }
    
    // Duration Slider
    if (durationSlider) {
        const durationValue = durationSlider.parentElement.querySelector('.slider-value');
        durationSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            durationValue.textContent = value;
            currentAnimationSettings.duration = value;
            saveSettings();
            restartAnimationsWithSettings();
        });
    }
    
    // Threshold Slider
    if (thresholdSlider) {
        const thresholdValue = thresholdSlider.parentElement.querySelector('.slider-value');
        thresholdSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            thresholdValue.textContent = value;
            currentAnimationSettings.threshold = value;
            saveSettings();
            restartAnimationsWithSettings();
        });
    }
}

function initializeToggles() {
    // Completion Toast Toggle
    if (completionToast) {
        completionToast.addEventListener('change', (e) => {
            currentAnimationSettings.showCompletionToast = e.target.checked;
            saveSettings();
        });
    }
}

function restartAnimationsWithSettings() {
    // Debounce the restart to avoid too many rapid updates
    clearTimeout(window.animationRestartTimeout);
    window.animationRestartTimeout = setTimeout(() => {
        initializeSplitTextAnimations();
    }, 300);
}

function showAnimationFinishedToast() {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'animation-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-check-circle"></i>
            <span>Animation Finished!</span>
        </div>
    `;
    
    // Add toast styles
    toast.style.cssText = `
        position: fixed;
        bottom: 80vh;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-size: 0.9rem;
        font-weight: 500;
    `;
    
    // Add to document
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initializeTheme();
    
    // Initialize dropdown state
    initializeDropdownState();
    
    // Initialize customization controls
    initializeCustomizationControls();
    
    // Restore UI state from saved settings
    restoreUIState();
    
    // Initialize animations
    initializeSplitTextAnimations();
    
    // Initialize navigation
    handleNavigation();
    
    // Initialize mobile right sidebar
    initializeMobileRightSidebar();

    // View switching
    if (previewBtn) {
        previewBtn.addEventListener('click', () => switchView('preview'));
    }
    
    if (codeBtn) {
        codeBtn.addEventListener('click', () => switchView('code'));
    }
    
    // Language selection
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            currentLanguage = this.value;
            saveSettings();
            if (currentView === 'code') {
                updateCodeDisplay();
            }
        });
    }
    
    // Restart animation
    if (restartBtn) {
        restartBtn.addEventListener('click', restartAnimations);
    }
    
    // Copy code
    if (copyBtn) {
        copyBtn.addEventListener('click', copyCode);
    }
    
    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Mobile right sidebar toggle
    if (mobileRightSidebarToggle) {
        mobileRightSidebarToggle.addEventListener('click', toggleMobileRightSidebar);
    }
    
    // Mobile dropdown toggle
    const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
    if (mobileDropdownToggle) {
        mobileDropdownToggle.addEventListener('click', toggleMobileDropdown);
    }
    
    // Blur overlay click
    if (blurOverlay) {
        blurOverlay.addEventListener('click', toggleMobileMenu);
    }
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            handleSearch(this);
        });
    }
    
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('input', function() {
            handleSearch(this);
        });
    }
    
    // Close mobile menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            mobileNavMenu.classList.remove('show');
            blurOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    splitTextAnimations.forEach(animation => {
        animation.destroy();
    });
});
// Navigation dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    const navDropdowns = document.querySelectorAll('.nav-dropdown');
    let hoverTimeout;

    navDropdowns.forEach(dropdown => {
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        
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
            }, 500); // 2 second delay before hiding
        });

        // Mobile click functionality
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        if (dropdownToggle) {
            dropdownToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (window.innerWidth <= 768) { // Only for mobile
                    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
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

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        navDropdowns.forEach(dropdown => {
            const dropdownMenu = dropdown.querySelector('.dropdown-menu');
            if (!dropdown.contains(e.target)) {
                dropdownMenu.style.display = 'none';
            }
        });
        
        // Close sidebar dropdowns when clicking outside with 500ms delay
        const clickedInsideDropdown = e.target.closest('.sidebar-dropdown-content') || 
                                     e.target.closest('.dropdown-item');
        
        if (!clickedInsideDropdown) {
            const openDropdowns = document.querySelectorAll('.sidebar-dropdown-content.show');
            const activeMenuItems = document.querySelectorAll('.dropdown-item.active');
            
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

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // Reset mobile menu states
            if (mobileDropdownMenu) {
                mobileDropdownMenu.classList.remove('show');
            }
            if (mobileDropdownArrow) {
                mobileDropdownArrow.classList.remove('rotated');
            }
        }
    });
});
