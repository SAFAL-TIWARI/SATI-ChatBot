// Static Pages JavaScript - Theme Toggle and Mobile Menu Functionality
// Used for: 404.html, terms-of-service.html, privacy-policy.html

// DOM Elements
const darkModeToggle = document.getElementById('darkModeToggle');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileNavMenu = document.getElementById('mobileNavMenu');
const blurOverlay = document.getElementById('blurOverlay');

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    initializePage();
    setupEventListeners();
});

// Initialize page settings
function initializePage() {
    // Check for saved theme - check multiple possible keys for compatibility
    const savedTheme = localStorage.getItem('sati_theme') ||
        localStorage.getItem('light') ||
        localStorage.getItem('theme') ||
        'dark';

    // Apply theme with system theme support
    applyTheme(savedTheme);

    // Ensure consistency across all storage keys
    localStorage.setItem('sati_theme', savedTheme);
    localStorage.setItem('light', savedTheme);
    localStorage.setItem('theme', savedTheme);

    // Setup system theme listener if needed
    if (savedTheme === 'system') {
        setupSystemThemeListener();
    }
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

    // Mobile navigation links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', function () {
            closeMobileMenu();
        });
    });

    // Close mobile menu when clicking on blur overlay
    if (blurOverlay) {
        blurOverlay.addEventListener('click', closeMobileMenu);
    }

    // Handle escape key to close mobile menu
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeMobileMenu();
        }
    });
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
    if (mobileMenuToggle) {
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) {
            if (mobileNavMenu && mobileNavMenu.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    }

    // Toggle blur overlay
    if (blurOverlay) {
        blurOverlay.classList.toggle('show');
    }

    // Prevent body scroll when menu is open
    if (mobileNavMenu && mobileNavMenu.classList.contains('show')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Close mobile menu
function closeMobileMenu() {
    if (mobileNavMenu) {
        mobileNavMenu.classList.remove('show');
    }

    // Reset mobile menu toggle icon
    if (mobileMenuToggle) {
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }

    // Hide blur overlay
    if (blurOverlay) {
        blurOverlay.classList.remove('show');
    }

    // Restore body scroll
    document.body.style.overflow = '';
}

// Smooth scroll for anchor links
document.addEventListener('click', function (event) {
    if (event.target.matches('a[href^="#"]')) {
        event.preventDefault();
        const targetId = event.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add loading animation for external links
document.addEventListener('click', function (event) {
    if (event.target.matches('a[href^="http"]') && event.target.target === '_blank') {
        const originalText = event.target.innerHTML;
        event.target.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening...';

        setTimeout(() => {
            event.target.innerHTML = originalText;
        }, 1000);
    }
});