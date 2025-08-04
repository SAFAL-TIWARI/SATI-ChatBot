// Dark Mode Toggle Functionality
document.addEventListener('DOMContentLoaded', function () {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNavMenu = document.getElementById('mobileNavMenu');
    const blurOverlay = document.getElementById('blurOverlay');

    // Initialize theme on page load
    initializeTheme();

    // Dark mode toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function () {
            const newTheme = this.checked ? 'dark' : 'light';

            // Apply theme
            applyTheme(newTheme);

            // Save to all possible localStorage keys for consistency
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
        });
    }

    // Mobile menu toggle
    if (mobileMenuToggle && mobileNavMenu && blurOverlay) {
        mobileMenuToggle.addEventListener('click', function () {
            mobileNavMenu.classList.toggle('show');
            blurOverlay.classList.toggle('show');
            document.body.classList.toggle('mobile-menu-open');

            // Update mobile menu toggle icon
            const icon = mobileMenuToggle.querySelector('i');
            if (mobileNavMenu.classList.contains('show')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });

        blurOverlay.addEventListener('click', function () {
            mobileNavMenu.classList.remove('show');
            blurOverlay.classList.remove('show');
            document.body.classList.remove('mobile-menu-open');

            // Reset mobile menu toggle icon
            const icon = mobileMenuToggle.querySelector('i');
            icon.className = 'fas fa-bars';
        });

        // Close mobile menu when clicking on navigation links (exclude dropdown toggle)
        document.querySelectorAll('.mobile-nav-link:not(.mobile-dropdown-toggle)').forEach(link => {
            link.addEventListener('click', function () {
                mobileNavMenu.classList.remove('show');
                blurOverlay.classList.remove('show');
                document.body.classList.remove('mobile-menu-open');

                // Reset mobile menu toggle icon
                const icon = mobileMenuToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            });
        });
    }
});

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

// FAQ Toggle Functionality
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const icon = element.querySelector('.faq-icon');

    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
            item.querySelector('.faq-answer').classList.remove('active');
        }
    });

    // Toggle current FAQ item
    faqItem.classList.toggle('active');
    answer.classList.toggle('active');
}

// Contact Form Submission
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const submitBtn = this.querySelector('.submit-btn');
    const successMsg = document.getElementById('successMessage');
    const errorMsg = document.getElementById('errorMessage');

    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Hide previous messages
    successMsg.style.display = 'none';
    errorMsg.style.display = 'none';

    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        submitBtn.disabled = false;

        // Show success message
        successMsg.style.display = 'block';

        // Reset form
        this.reset();

        // Scroll to success message
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 2000);
});

// Theme initialization and management functions
function initializeTheme() {
    // Check for saved theme - check multiple possible keys for compatibility
    const savedTheme = localStorage.getItem('sati_theme') ||
        localStorage.getItem('light') ||
        localStorage.getItem('theme') ||
        'dark';

    // Apply theme with system theme support
    applyTheme(savedTheme);

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

    // Update dark mode toggle based on actual theme
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.checked = actualTheme === 'dark';
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
            const darkModeToggle = document.getElementById('darkModeToggle');
            if (darkModeToggle) {
                darkModeToggle.checked = actualTheme === 'dark';
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