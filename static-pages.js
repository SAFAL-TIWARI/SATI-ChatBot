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

    // Mobile navigation links (exclude dropdown toggle)
    document.querySelectorAll('.mobile-nav-link:not(.mobile-dropdown-toggle)').forEach(link => {
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

  // Smooth Scroll with Lenis and ScrollTrigger 
        // Initialize Lenis smooth scroll
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });

        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Animation loop
        function raf(time) {
            lenis.raf(time);
            ScrollTrigger.update();
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Pin animation
        const section1 = document.body.querySelector('.section-1');
        const box = document.body.querySelector('.box');

        if (section1 && box) {
            const tl = gsap.timeline({ paused: true });
            tl.fromTo(box, { y: 0 }, { y: '100vh', duration: 1, ease: 'none' }, 0);

            const st = ScrollTrigger.create({
                animation: tl,
                trigger: section1,
                start: 'top top',
                end: 'bottom top',
                scrub: true
            });
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

// Simple Navigation Dropdown with Dynamic Labels
function initializeNavigationDropdown() {
    // Handle dropdown item clicks for dynamic label changes
    const dropdownItems = document.querySelectorAll('.dropdown-item:not(.disabled)');
    const mobileDropdownItems = document.querySelectorAll('.mobile-dropdown-item:not(.disabled)');
    
    // Desktop dropdown items
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const itemText = this.textContent.trim();
            const href = this.getAttribute('href');
            
            // Update the dropdown toggle text
            updateDropdownLabel(itemText);
            
            // Navigate to the page
            if (href && href !== '#') {
                window.location.href = href;
            }
        });
    });
    
    // Mobile dropdown items
    mobileDropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const itemText = this.textContent.trim();
            const href = this.getAttribute('href');
            
            // Update the mobile dropdown toggle text
            updateMobileDropdownLabel(itemText);
            
            // Close mobile menu after selection
            closeMobileMenu();
            
            // Navigate to the page
            if (href && href !== '#') {
                window.location.href = href;
            }
        });
    });
    
    // Mobile dropdown toggle functionality
    initializeMobileDropdown();
}

// Initialize mobile dropdown functionality
function initializeMobileDropdown() {
    const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
    const mobileNavDropdown = document.querySelector('.mobile-nav-dropdown');
    
    if (mobileDropdownToggle && mobileNavDropdown) {
        mobileDropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle dropdown open/close
            const isOpen = mobileNavDropdown.classList.contains('open');
            
            if (isOpen) {
                // Close dropdown
                mobileNavDropdown.classList.remove('open');
            } else {
                // Open dropdown
                mobileNavDropdown.classList.add('open');
            }
            
            // Rotate arrow icon
            const arrow = this.querySelector('.mobile-dropdown-arrow');
            if (arrow) {
                if (mobileNavDropdown.classList.contains('open')) {
                    arrow.style.transform = 'rotate(180deg)';
                } else {
                    arrow.style.transform = 'rotate(0deg)';
                }
            }
        });
    }
}

// Close mobile menu function
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileNavMenu');
    const blurOverlay = document.getElementById('blurOverlay');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    
    if (mobileMenu) {
        mobileMenu.classList.remove('show');
        document.body.classList.remove('mobile-menu-open');
    }
    
    if (blurOverlay) {
        blurOverlay.classList.remove('show');
    }
    
    // Reset mobile menu toggle icon
    if (mobileMenuToggle) {
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-bars';
        }
    }
}

// Update desktop dropdown label
function updateDropdownLabel(newLabel) {
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    if (dropdownToggle) {
        dropdownToggle.innerHTML = `${newLabel} <i class="fas fa-chevron-down"></i>`;
    }
}

// Update mobile dropdown label
function updateMobileDropdownLabel(newLabel) {
    const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
    if (mobileDropdownToggle) {
        const spanElement = mobileDropdownToggle.querySelector('span');
        if (spanElement) {
            spanElement.textContent = newLabel;
        }
    }
}

// Desktop dropdown delay functionality
function initializeDesktopDropdownDelay() {
    const navDropdown = document.querySelector('.nav-dropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    let hideTimeout;

    if (navDropdown && dropdownMenu) {
        // Show dropdown on hover
        navDropdown.addEventListener('mouseenter', function() {
            // Clear any existing timeout
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
            // Show dropdown immediately
            dropdownMenu.classList.add('show');
        });

        // Hide dropdown with delay on mouse leave
        navDropdown.addEventListener('mouseleave', function() {
            // Set timeout to hide dropdown after 2 seconds
            hideTimeout = setTimeout(() => {
                dropdownMenu.classList.remove('show');
            }, 500);
        });

        // If mouse enters dropdown menu, cancel hide timeout
        dropdownMenu.addEventListener('mouseenter', function() {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
        });

        // If mouse leaves dropdown menu, start hide timeout
        dropdownMenu.addEventListener('mouseleave', function() {
            hideTimeout = setTimeout(() => {
                dropdownMenu.classList.remove('show');
            }, 500);
        });
    }
}

// Initialize navigation dropdown
initializeNavigationDropdown();

// Initialize desktop dropdown delay
initializeDesktopDropdownDelay();