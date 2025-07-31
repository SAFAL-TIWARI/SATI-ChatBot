
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

        // Close mobile menu when clicking on navigation links
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
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

    // Scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.info-card, .features-section, .team-section, .stats-section, .flowing-stats-wrap').forEach(el => {
        el.style.animationPlayState = 'paused';
        el.style.opacity = '0';
        observer.observe(el);
    });

    // Add staggered animation delays for info cards
    document.querySelectorAll('.info-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });

    // Add hover effects for stat cards
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.05) rotate(2deg)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Add smooth scrolling for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Handle GitHub profile image loading errors
    document.querySelectorAll('.member-avatar img').forEach(img => {
        img.addEventListener('error', function () {
            // Create fallback icon
            const fallback = document.createElement('div');
            fallback.innerHTML = '<i class="fas fa-user"></i>';
            fallback.style.cssText = `
                        width: 100%;
                        height: 100%;
                        background: var(--primary-color);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 1.5rem;
                    `;

            // Replace image with fallback
            this.parentNode.replaceChild(fallback, this);
        });

        // Add loading animation
        img.addEventListener('load', function () {
            this.style.opacity = '1';
        });

        // Set initial opacity for loading effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });

    // Add team member card animations on scroll
    const teamObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.team-member').forEach((member, index) => {
        member.style.opacity = '0';
        member.style.transform = 'translateY(20px)';
        member.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        teamObserver.observe(member);
    });

    // Scroll Velocity Animation
    const scrollVelocityTrack = document.getElementById('scrollVelocityTrack');
    if (scrollVelocityTrack) {
        let baseVelocity = 1;
        let scrollVelocity = 0;
        let smoothVelocity = 0;
        let lastScrollY = window.scrollY;
        let animationId;
        let currentX = 0;

        // Calculate the width of one set of cards
        const cardWidth = 300 + 24; // card width + gap
        const numCards = 4;
        const totalWidth = cardWidth * numCards;

        function updateAnimation() {
            // Calculate scroll velocity
            const currentScrollY = window.scrollY;
            scrollVelocity = (currentScrollY - lastScrollY) * 0.1;
            lastScrollY = currentScrollY;

            // Smooth the velocity
            smoothVelocity += (scrollVelocity - smoothVelocity) * 0.1;

            // Calculate movement
            const velocityFactor = Math.min(Math.abs(smoothVelocity), 5);
            const direction = smoothVelocity > 0 ? 1 : -1;

            // Base movement + velocity-based movement
            currentX -= (baseVelocity + velocityFactor * direction) * 0.5;

            // Wrap around when we've moved one full set
            if (currentX <= -totalWidth) {
                currentX = 0;
            } else if (currentX > 0) {
                currentX = -totalWidth;
            }

            // Apply transform
            scrollVelocityTrack.style.transform = `translateX(${currentX}px)`;

            animationId = requestAnimationFrame(updateAnimation);
        }

        // Start animation
        updateAnimation();

        // Pause on hover
        scrollVelocityTrack.addEventListener('mouseenter', () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        });

        scrollVelocityTrack.addEventListener('mouseleave', () => {
            updateAnimation();
        });

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
            } else {
                updateAnimation();
            }
        }); (responsive)
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        const newDimensions = getCardDimensions();
        cardWidth = newDimensions.cardWidth;
        totalWidth = newDimensions.totalWidth;
        // Reset position to prevent issues
        currentX = 0;
    });
});

// Orbiting Circles Animation Enhancement
function initOrbitingCircles() {
    const orbitingIcons = document.querySelectorAll('.orbiting-icon');
    const centerIcon = document.querySelector('.orbiting-circles-center');

    if (!orbitingIcons.length || !centerIcon) return;

    // Global cleanup function to remove any stray tooltips
    function cleanupAllTooltips() {
        const allTooltips = document.querySelectorAll('.orbit-tooltip');
        allTooltips.forEach(tooltip => {
            if (tooltip && tooltip.parentNode) {
                tooltip.remove();
            }
        });
    }

    // Clean up any existing tooltips on initialization
    cleanupAllTooltips();

    // Add click interaction to center icon
    centerIcon.addEventListener('click', function () {
        // Pause/resume all orbiting animations
        orbitingIcons.forEach(icon => {
            const currentState = icon.style.animationPlayState;
            icon.style.animationPlayState = currentState === 'paused' ? 'running' : 'paused';
        });

        // Visual feedback
        this.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            this.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 150);
    });

    // Add hover effects for orbiting icons
    orbitingIcons.forEach((icon, index) => {
        let currentTooltip = null;
        let tooltipTimeout = null;

        icon.addEventListener('mouseenter', function () {
            // Clear any existing timeout
            if (tooltipTimeout) {
                clearTimeout(tooltipTimeout);
                tooltipTimeout = null;
            }

            // Remove any existing tooltip first
            const existingTooltip = this.querySelector('.orbit-tooltip');
            if (existingTooltip) {
                existingTooltip.remove();
            }

            // Pause this specific icon's animation
            this.style.animationPlayState = 'paused';

            // Show tooltip with tech info
            const tooltip = document.createElement('div');
            tooltip.className = 'orbit-tooltip';
            tooltip.textContent = this.getAttribute('title');
            tooltip.style.cssText = `
                            position: absolute;
                            background: var(--card-bg);
                            color: var(--text-primary);
                            padding: 0.5rem 0.8rem;
                            border-radius: 6px;
                            font-size: 0.8rem;
                            box-shadow: var(--shadow);
                            border: 1px solid var(--border-color);
                            z-index: 1000;
                            pointer-events: none;
                            white-space: nowrap;
                            top: -40px;
                            left: 50%;
                            transform: translateX(-50%);
                            opacity: 0;
                            transition: opacity 0.3s ease;
                        `;

            currentTooltip = tooltip;
            this.appendChild(tooltip);

            // Animate tooltip in
            requestAnimationFrame(() => {
                if (tooltip.parentNode) {
                    tooltip.style.opacity = '1';
                }
            });
        });

        icon.addEventListener('mouseleave', function () {
            // Resume animation
            this.style.animationPlayState = 'running';

            // Clear any pending timeout
            if (tooltipTimeout) {
                clearTimeout(tooltipTimeout);
            }

            // Remove all tooltips from this icon
            const tooltips = this.querySelectorAll('.orbit-tooltip');
            tooltips.forEach(tooltip => {
                tooltip.style.opacity = '0';
                tooltipTimeout = setTimeout(() => {
                    if (tooltip && tooltip.parentNode) {
                        tooltip.remove();
                    }
                }, 300);
            });

            // Reset current tooltip reference
            currentTooltip = null;
        });

        // Add click handler for tech stack info
        icon.addEventListener('click', function (e) {
            e.preventDefault();
            const tech = this.getAttribute('title');

            // Create info popup
            const popup = document.createElement('div');
            popup.className = 'tech-info-popup';
            popup.innerHTML = `
                            <div class="popup-content">
                                <h4><i class="${this.querySelector('i').className}"></i> ${tech}</h4>
                                <p>${getTechInfo(tech)}</p>
                                <button class="close-popup">×</button>
                            </div>
                        `;
            popup.style.cssText = `
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: rgba(0, 0, 0, 0.5);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            z-index: 10000;
                            opacity: 0;
                            transition: opacity 0.3s ease;
                        `;

            const popupContent = popup.querySelector('.popup-content');
            popupContent.style.cssText = `
                            background: var(--card-bg);
                            color: var(--text-primary);
                            padding: 2rem;
                            border-radius: 12px;
                            max-width: 400px;
                            margin: 1rem;
                            box-shadow: var(--shadow-hover);
                            border: 1px solid var(--border-color);
                            position: relative;
                            transform: scale(0.8);
                            transition: transform 0.3s ease;
                        `;

            const closeBtn = popup.querySelector('.close-popup');
            closeBtn.style.cssText = `
                            position: absolute;
                            top: 10px;
                            right: 15px;
                            background: none;
                            border: none;
                            font-size: 1.5rem;
                            color: var(--text-secondary);
                            cursor: pointer;
                            transition: color 0.3s ease;
                        `;

            document.body.appendChild(popup);

            // Animate in
            setTimeout(() => {
                popup.style.opacity = '1';
                popupContent.style.transform = 'scale(1)';
            }, 10);

            // Close handlers
            const closePopup = () => {
                popup.style.opacity = '0';
                popupContent.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    if (popup.parentNode) {
                        popup.parentNode.removeChild(popup);
                    }
                }, 300);
            };

            closeBtn.addEventListener('click', closePopup);
            popup.addEventListener('click', (e) => {
                if (e.target === popup) closePopup();
            });

            // Close on escape key
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    closePopup();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        });
    });

    // Add global cleanup when mouse leaves the orbiting container
    const orbitingContainer = document.querySelector('.orbiting-circles-container');
    if (orbitingContainer) {
        orbitingContainer.addEventListener('mouseleave', function () {
            // Clean up any remaining tooltips when leaving the entire container
            setTimeout(() => {
                cleanupAllTooltips();
            }, 100);
        });
    }

    // Periodic cleanup to handle any edge cases (every 5 seconds)
    setInterval(() => {
        // Only clean up if no icons are currently being hovered
        const hoveredIcons = Array.from(orbitingIcons).filter(icon =>
            icon.matches(':hover')
        );
        if (hoveredIcons.length === 0) {
            cleanupAllTooltips();
        }
    }, 5000);

    // Function to get tech stack information
    function getTechInfo(tech) {
        const techInfo = {
            'JavaScript': 'Core programming language for interactive web features and dynamic content.',
            'HTML5': 'Modern markup language providing the structure and semantic foundation.',
            'Node.js': 'JavaScript runtime for serverless API functions and backend processing.',
            'Python': 'Used for AI model integration and data processing capabilities.',
            'CSS3': 'Advanced styling language for responsive design and animations.',
            'GitHub': 'Version control and collaborative development platform.',
            'Vercel': 'Hosting platform for web applications and static sites.',
            'Groq API': 'RESTful APIs connecting to Groq and Gemini AI services.'
        };
        return techInfo[tech] || 'Technology used in our SATI ChatBot development stack.';
    }
}

// Initialize orbiting circles if container exists
if (document.querySelector('.orbiting-circles-container')) {
    initOrbitingCircles();
}

// Flowing Menu Animation for Stats
function initFlowingStats() {
    const statItems = document.querySelectorAll('.flowing-stat-item');

    statItems.forEach(item => {
        const link = item.querySelector('.flowing-stat-link');
        const marquee = item.querySelector('.flowing-marquee');
        const marqueeInner = item.querySelector('.flowing-marquee-inner-wrap');

        if (!link || !marquee || !marqueeInner) return;

        const animationDefaults = { duration: 0.6, ease: 'expo.out' };

        const findClosestEdge = (mouseX, mouseY, width, height) => {
            const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
            const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
            return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
        };

        const distMetric = (x, y, x2, y2) => {
            const xDiff = x - x2;
            const yDiff = y - y2;
            return xDiff * xDiff + yDiff * yDiff;
        };

        const handleMouseEnter = (ev) => {
            const rect = item.getBoundingClientRect();
            const x = ev.clientX - rect.left;
            const y = ev.clientY - rect.top;
            const edge = findClosestEdge(x, y, rect.width, rect.height);

            gsap.timeline({ defaults: animationDefaults })
                .set(marquee, { y: edge === 'top' ? '-101%' : '101%' }, 0)
                .set(marqueeInner, { y: edge === 'top' ? '101%' : '-101%' }, 0)
                .to([marquee, marqueeInner], { y: '0%' }, 0);
        };

        const handleMouseLeave = (ev) => {
            const rect = item.getBoundingClientRect();
            const x = ev.clientX - rect.left;
            const y = ev.clientY - rect.top;
            const edge = findClosestEdge(x, y, rect.width, rect.height);

            gsap.timeline({ defaults: animationDefaults })
                .to(marquee, { y: edge === 'top' ? '-101%' : '101%' }, 0)
                .to(marqueeInner, { y: edge === 'top' ? '101%' : '-101%' }, 0);
        };

        link.addEventListener('mouseenter', handleMouseEnter);
        link.addEventListener('mouseleave', handleMouseLeave);
    });
}

// Initialize flowing stats animation
initFlowingStats();

// Card Swap Animation for Features
function initCardSwapAnimation() {
    const container = document.getElementById('featuresCardSwap');
    if (!container) return;

    const cards = Array.from(container.querySelectorAll('.feature-card'));
    if (cards.length === 0) return;

    const config = {
        cardDistance: 35,
        verticalDistance: 45,
        delay: 2000,        // Reduced from 3500ms to 2000ms (2 seconds between swaps)
        skewAmount: 3,
        ease: "elastic.out(0.6,0.9)",
        durDrop: 1.0,       // Reduced from 1.6s to 0.8s (faster drop)
        durMove: 1.0,       // Reduced from 1.6s to 0.8s (faster card movement)
        durReturn: 1.0,     // Reduced from 1.6s to 0.8s (faster return)
        promoteOverlap: 0.9, // Increased from 0.85 to 0.9 (cards start moving sooner)
        returnDelay: 0.05   // Reduced from 0.08 to 0.05 (less delay between card movements)
    };

    let order = Array.from({ length: cards.length }, (_, i) => i);
    let intervalRef;
    let tlRef;

    // Helper functions
    const makeSlot = (i, distX, distY, total) => ({
        x: i * distX,
        y: -i * distY,
        z: -i * distX * 1.5,
        zIndex: total - i
    });

    const placeNow = (el, slot, skew) => {
        gsap.set(el, {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            xPercent: -50,
            yPercent: -50,
            skewY: skew,
            transformOrigin: "center center",
            zIndex: slot.zIndex,
            force3D: true
        });
    };

    // Initialize card positions
    const total = cards.length;
    cards.forEach((card, i) => {
        placeNow(
            card,
            makeSlot(i, config.cardDistance, config.verticalDistance, total),
            config.skewAmount
        );
    });

    // Swap animation function
    const swap = () => {
        if (order.length < 2) return;

        const [front, ...rest] = order;
        const elFront = cards[front];
        const tl = gsap.timeline();
        tlRef = tl;

        // Drop front card
        tl.to(elFront, {
            y: "+=400",
            duration: config.durDrop,
            ease: config.ease
        });

        // Promote other cards
        tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
        rest.forEach((idx, i) => {
            const el = cards[idx];
            const slot = makeSlot(i, config.cardDistance, config.verticalDistance, cards.length);
            tl.set(el, { zIndex: slot.zIndex }, "promote");
            tl.to(
                el,
                {
                    x: slot.x,
                    y: slot.y,
                    z: slot.z,
                    duration: config.durMove,
                    ease: config.ease
                },
                `promote+=${i * 0.15}`
            );
        });

        // Return front card to back
        const backSlot = makeSlot(
            cards.length - 1,
            config.cardDistance,
            config.verticalDistance,
            cards.length
        );
        tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
        tl.call(
            () => {
                gsap.set(elFront, { zIndex: backSlot.zIndex });
            },
            undefined,
            "return"
        );
        tl.set(elFront, { x: backSlot.x, z: backSlot.z }, "return");
        tl.to(
            elFront,
            {
                y: backSlot.y,
                duration: config.durReturn,
                ease: config.ease
            },
            "return"
        );

        // Update order
        tl.call(() => {
            order = [...rest, front];
        });
    };

    // Start animation
    swap();
    intervalRef = setInterval(swap, config.delay);

    // Pause on hover
    container.addEventListener('mouseenter', () => {
        if (tlRef) tlRef.pause();
        clearInterval(intervalRef);
    });

    container.addEventListener('mouseleave', () => {
        if (tlRef) tlRef.play();
        intervalRef = setInterval(swap, config.delay);
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        clearInterval(intervalRef);
    });

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (tlRef) tlRef.pause();
            clearInterval(intervalRef);
        } else {
            if (tlRef) tlRef.play();
            intervalRef = setInterval(swap, config.delay);
        }
    });
}

// Initialize card swap animation
initCardSwapAnimation();

// Team Card Animation Functionality
function initTeamCardFunctionality() {
    const teamCards = document.querySelectorAll('.card.team-member');

    teamCards.forEach(card => {
        const mailButton = card.querySelector('.mail');
        const contactButton = card.querySelector('.button');
        const memberName = card.querySelector('.name').textContent;

        // Mail button functionality
        if (mailButton) {
            mailButton.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                // Get email based on member name
                const email = getTeamMemberEmail(memberName);
                const subject = `Hello from SATI ChatBot Website - ${memberName}`;
                const body = `Hi ${memberName},\n\nI visited the SATI ChatBot website and would like to get in touch.\n\nBest regards`;

                const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                window.location.href = mailtoLink;

                // Visual feedback
                this.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        }

        // Contact button functionality
        if (contactButton) {
            contactButton.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                // Redirect to contact page with member info
                const contactUrl = `contact.html?member=${encodeURIComponent(memberName)}`;
                window.location.href = contactUrl;
            });
        }

        // Add subtle animation on card hover
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-2px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // Function to get team member email (you can customize these)
    function getTeamMemberEmail(memberName) {
        const emailMap = {
            'Safal Tiwari': 'safal.tiwari@example.com',
            'Utkarsh Vishwakarma': 'utkarsh.vishwakarma@example.com',
            'Aashutosh Singh Baghel': 'aashutosh.baghel@example.com',
            'Hardik Kumar Sinha': 'hardik.sinha@example.com'
        };

        return emailMap[memberName] || 'team@satichatbot.com';
    }
}

// Initialize team card functionality
initTeamCardFunctionality();

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