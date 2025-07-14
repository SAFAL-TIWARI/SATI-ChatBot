/**
 * Smooth Cursor Component
 * Vanilla JavaScript implementation of a smooth animated cursor
 */

class SmoothCursor {
    constructor(options = {}) {
        // Configuration
        this.config = {
            damping: options.damping || 45,
            stiffness: options.stiffness || 400,
            mass: options.mass || 1,
            restDelta: options.restDelta || 0.001,
            rotationDamping: options.rotationDamping || 60,
            rotationStiffness: options.rotationStiffness || 300,
            scaleDamping: options.scaleDamping || 35,
            scaleStiffness: options.scaleStiffness || 500,
            customCursor: options.customCursor || null
        };

        // State
        this.isMoving = false;
        this.lastMousePos = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.lastUpdateTime = Date.now();
        this.previousAngle = 0;
        this.accumulatedRotation = 0;
        this.rafId = null;
        this.moveTimeout = null;

        // Spring values
        this.cursorX = { current: 0, target: 0, velocity: 0 };
        this.cursorY = { current: 0, target: 0, velocity: 0 };
        this.rotation = { current: 0, target: 0, velocity: 0 };
        this.scale = { current: 1, target: 1, velocity: 0 };

        // DOM elements
        this.cursorElement = null;

        // Check if device supports hover (desktop)
        this.isDesktop = this.checkIfDesktop();
        
        if (this.isDesktop) {
            this.init();
        } else {
            console.log('📱 Smooth cursor disabled - mobile device detected');
        }
    }

    checkIfDesktop() {
        // Multiple checks to ensure we're on a desktop device
        const hasHover = window.matchMedia('(hover: hover)').matches;
        const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
        const isNotMobile = window.matchMedia('(min-width: 769px)').matches;
        const isNotTabletPortrait = !window.matchMedia('(max-width: 1024px) and (orientation: portrait)').matches;
        const hasNoTouch = !('ontouchstart' in window);
        
        return hasHover && hasFinePointer && isNotMobile && isNotTabletPortrait && hasNoTouch;
    }

    init() {
        this.createCursorElement();
        this.bindEvents();
        this.startAnimation();
        document.body.classList.add('smooth-cursor-active');
        
        // Initialize cursor position to current mouse position
        this.initializeCursorPosition();
    }

    createCursorElement() {
        console.log('🎯 Creating cursor element...');
        this.cursorElement = document.createElement('div');
        this.cursorElement.className = 'smooth-cursor';
        
        // Use custom cursor or default SVG
        if (this.config.customCursor) {
            this.cursorElement.innerHTML = this.config.customCursor;
        } else {
            this.cursorElement.innerHTML = this.getDefaultCursorSVG();
        }
        
        document.body.appendChild(this.cursorElement);
        console.log('✅ Cursor element created and added to DOM');
    }

    initializeCursorPosition() {
        // Get current mouse position if available
        const mousePos = this.getMousePosition();
        if (mousePos) {
            this.cursorX.current = mousePos.x;
            this.cursorX.target = mousePos.x;
            this.cursorY.current = mousePos.y;
            this.cursorY.target = mousePos.y;
            this.lastMousePos = mousePos;
        } else {
            // Default to center of screen
            this.cursorX.current = window.innerWidth / 2;
            this.cursorX.target = window.innerWidth / 2;
            this.cursorY.current = window.innerHeight / 2;
            this.cursorY.target = window.innerHeight / 2;
            console.log('🎯 Cursor positioned at center:', this.cursorX.current, this.cursorY.current);
        }
        
        // Update cursor position immediately
        if (this.cursorElement) {
            this.cursorElement.style.transform = `
                translate(${this.cursorX.current}px, ${this.cursorY.current}px) 
                translate(-50%, -50%) 
                rotate(0deg) 
                scale(1)
            `;
            this.cursorElement.style.opacity = '1';
            console.log('🎯 Cursor positioned at:', this.cursorX.current, this.cursorY.current);
        }
    }

    getMousePosition() {
        // Try to get last known mouse position from a global variable if available
        if (window.lastMousePosition) {
            return window.lastMousePosition;
        }
        return null;
    }

    getDefaultCursorSVG() {
        return `
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 50 54" fill="none" style="display: block;">
                <g filter="url(#filter0_d_91_7928)">
                    <path class="cursor-fill" d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"/>
                    <path class="cursor-stroke" d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999 40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z" stroke-width="2.25825" fill="none"/>
                </g>
                <defs>
                    <filter id="filter0_d_91_7928" x="0.602397" y="0.952444" width="49.0584" height="52.428" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset dy="2.25825"/>
                        <feGaussianBlur stdDeviation="2.25825"/>
                        <feComposite in2="hardAlpha" operator="out"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_91_7928"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_91_7928" result="shape"/>
                    </filter>
                </defs>
            </svg>
        `;
    }

    bindEvents() {
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);

        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseleave', this.handleMouseLeave);
        document.addEventListener('mouseenter', this.handleMouseEnter);

        // Handle window resize to check if device type changed
        window.addEventListener('resize', () => {
            if (!this.checkIfDesktop()) {
                this.destroy();
            }
        });

        // Watch for theme changes
        this.observeThemeChanges();
    }

    observeThemeChanges() {
        // Watch for data-theme attribute changes on html element
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    console.log('🎨 Theme changed, cursor will adapt automatically via CSS');
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        // Store observer for cleanup
        this.themeObserver = observer;
    }

    handleMouseMove(e) {
        if (!this.isDesktop) return;

        const currentPos = { x: e.clientX, y: e.clientY };
        
        // Store mouse position globally for initialization
        window.lastMousePosition = currentPos;
        
        // Make cursor visible if it's hidden
        if (this.cursorElement && this.cursorElement.classList.contains('hidden')) {
            this.cursorElement.classList.remove('hidden');
        }
        
        this.updateVelocity(currentPos);

        const speed = Math.sqrt(
            Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2)
        );

        // Update target positions
        this.cursorX.target = currentPos.x;
        this.cursorY.target = currentPos.y;

        if (speed > 0.1) {
            const currentAngle = Math.atan2(this.velocity.y, this.velocity.x) * (180 / Math.PI) + 90;
            
            let angleDiff = currentAngle - this.previousAngle;
            if (angleDiff > 180) angleDiff -= 360;
            if (angleDiff < -180) angleDiff += 360;
            
            this.accumulatedRotation += angleDiff;
            this.rotation.target = this.accumulatedRotation;
            this.previousAngle = currentAngle;

            this.scale.target = 0.95;
            this.isMoving = true;

            // Clear previous timeout
            if (this.moveTimeout) {
                clearTimeout(this.moveTimeout);
            }

            // Reset scale after movement stops
            this.moveTimeout = setTimeout(() => {
                this.scale.target = 1;
                this.isMoving = false;
            }, 150);
        }
    }

    handleMouseLeave() {
        if (this.cursorElement) {
            this.cursorElement.classList.add('hidden');
        }
    }

    handleMouseEnter() {
        if (this.cursorElement) {
            this.cursorElement.classList.remove('hidden');
        }
    }

    updateVelocity(currentPos) {
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastUpdateTime;

        if (deltaTime > 0) {
            this.velocity = {
                x: (currentPos.x - this.lastMousePos.x) / deltaTime,
                y: (currentPos.y - this.lastMousePos.y) / deltaTime
            };
        }

        this.lastUpdateTime = currentTime;
        this.lastMousePos = currentPos;
    }

    // Spring animation function
    updateSpring(spring, config, deltaTime) {
        const { damping, stiffness, mass } = config;
        const dt = deltaTime / 1000; // Convert to seconds

        // Spring physics calculation
        const force = -stiffness * (spring.current - spring.target);
        const dampingForce = -damping * spring.velocity;
        const acceleration = (force + dampingForce) / mass;

        spring.velocity += acceleration * dt;
        spring.current += spring.velocity * dt;

        return spring;
    }

    startAnimation() {
        let lastTime = performance.now();

        const animate = (currentTime) => {
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;

            // Update springs
            this.updateSpring(this.cursorX, this.config, deltaTime);
            this.updateSpring(this.cursorY, this.config, deltaTime);
            this.updateSpring(this.rotation, {
                damping: this.config.rotationDamping,
                stiffness: this.config.rotationStiffness,
                mass: this.config.mass
            }, deltaTime);
            this.updateSpring(this.scale, {
                damping: this.config.scaleDamping,
                stiffness: this.config.scaleStiffness,
                mass: this.config.mass
            }, deltaTime);

            // Apply transforms
            if (this.cursorElement) {
                this.cursorElement.style.transform = `
                    translate(${this.cursorX.current}px, ${this.cursorY.current}px) 
                    translate(-50%, -50%) 
                    rotate(${this.rotation.current}deg) 
                    scale(${this.scale.current})
                `;
            }

            this.rafId = requestAnimationFrame(animate);
        };

        this.rafId = requestAnimationFrame(animate);
    }

    destroy() {
        // Remove event listeners
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseleave', this.handleMouseLeave);
        document.removeEventListener('mouseenter', this.handleMouseEnter);

        // Cancel animation
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }

        // Clear timeout
        if (this.moveTimeout) {
            clearTimeout(this.moveTimeout);
        }

        // Disconnect theme observer
        if (this.themeObserver) {
            this.themeObserver.disconnect();
        }

        // Remove DOM element
        if (this.cursorElement && this.cursorElement.parentNode) {
            this.cursorElement.parentNode.removeChild(this.cursorElement);
        }

        // Remove body class
        document.body.classList.remove('smooth-cursor-active');
    }
}

// Initialize smooth cursor when DOM is loaded
function initSmoothCursor() {
    console.log('🖱️ Initializing Smooth Cursor...');
    
    // Only initialize on desktop devices
    const smoothCursor = new SmoothCursor();
    
    // Make it globally accessible if needed
    window.smoothCursor = smoothCursor;
    
    if (smoothCursor.isDesktop) {
        console.log('✅ Smooth Cursor initialized for desktop device');
    } else {
        console.log('📱 Smooth Cursor disabled for mobile/touch device');
    }
}

// Try multiple initialization methods
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmoothCursor);
} else {
    // DOM is already loaded
    initSmoothCursor();
}

// Fallback initialization
window.addEventListener('load', () => {
    if (!window.smoothCursor) {
        console.log('🔄 Fallback cursor initialization...');
        initSmoothCursor();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmoothCursor;
}