/**
 * Glowing Border Effect - Vanilla JavaScript Implementation
 * Converted from React component to work with HTML/CSS/JS
 */

class GlowingEffect {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            blur: 0,
            inactiveZone: 0.7,
            proximity: 0,
            spread: 20,
            variant: 'default', // 'default' or 'white'
            glow: false,
            disabled: false,
            movementDuration: 1,
            borderWidth: 1,
            ...options
        };

        this.containerRef = null;
        this.lastPosition = { x: 0, y: 0 };
        this.animationFrameRef = 0;
        this.currentAngle = 0;
        this.isAnimating = false;

        this.init();
    }

    init() {
        if (!this.element) return;

        // Create the glowing effect structure
        this.createGlowingStructure();

        // Set up event listeners
        this.setupEventListeners();

        // Set initial CSS variables
        this.updateCSSVariables();
    }

    createGlowingStructure() {
        // Add glowing effect container class
        this.element.classList.add('glowing-effect-container');

        // Set variant class
        if (this.options.variant === 'white') {
            this.element.classList.add('variant-white');
        }

        // Set disabled state
        if (this.options.disabled) {
            this.element.classList.add('disabled');
        }

        // Set glow enabled state
        if (this.options.glow) {
            this.element.classList.add('glow-enabled');
        }

        // Create inactive border element
        const inactiveBorder = document.createElement('div');
        inactiveBorder.className = 'glowing-effect-inactive-border';
        this.element.appendChild(inactiveBorder);

        // Create main glowing effect container
        const mainContainer = document.createElement('div');
        mainContainer.className = 'glowing-effect-main';
        if (this.options.blur > 0) {
            mainContainer.classList.add('blur');
        }

        // Create glow element
        const glowElement = document.createElement('div');
        glowElement.className = 'glowing-effect-glow';

        mainContainer.appendChild(glowElement);
        this.element.appendChild(mainContainer);

        this.containerRef = this.element;
    }

    updateCSSVariables() {
        if (!this.containerRef) return;

        const style = this.containerRef.style;
        style.setProperty('--blur', `${this.options.blur}px`);
        style.setProperty('--spread', this.options.spread);
        style.setProperty('--start', this.currentAngle);
        style.setProperty('--active', '0');
        style.setProperty('--glowingeffect-border-width', `${this.options.borderWidth}px`);
        style.setProperty('--repeating-conic-gradient-times', '5');
    }

    handleMove = (e) => {
        if (!this.containerRef || this.options.disabled) return;

        if (this.animationFrameRef) {
            cancelAnimationFrame(this.animationFrameRef);
        }

        this.animationFrameRef = requestAnimationFrame(() => {
            const element = this.containerRef;
            if (!element) return;

            const rect = element.getBoundingClientRect();
            const { left, top, width, height } = rect;

            let mouseX, mouseY;

            if (e && (e.clientX !== undefined || e.x !== undefined)) {
                mouseX = e.clientX || e.x;
                mouseY = e.clientY || e.y;
                this.lastPosition = { x: mouseX, y: mouseY };
            } else {
                mouseX = this.lastPosition.x;
                mouseY = this.lastPosition.y;
            }

            const center = [left + width * 0.5, top + height * 0.5];
            const distanceFromCenter = Math.hypot(
                mouseX - center[0],
                mouseY - center[1]
            );

            const inactiveRadius = 0.5 * Math.min(width, height) * this.options.inactiveZone;

            if (distanceFromCenter < inactiveRadius) {
                element.style.setProperty('--active', '0');
                return;
            }

            const isActive =
                mouseX > left - this.options.proximity &&
                mouseX < left + width + this.options.proximity &&
                mouseY > top - this.options.proximity &&
                mouseY < top + height + this.options.proximity;

            element.style.setProperty('--active', isActive ? '1' : '0');

            if (!isActive) return;

            let targetAngle =
                (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) / Math.PI + 90;

            // Normalize angles
            const angleDiff = ((targetAngle - this.currentAngle + 180) % 360) - 180;
            const newAngle = this.currentAngle + angleDiff;

            // Animate the angle change
            this.animateAngle(this.currentAngle, newAngle);
        });
    }

    animateAngle(from, to) {
        if (this.isAnimating) return;

        this.isAnimating = true;
        const duration = this.options.movementDuration * 100; // Convert to milliseconds
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (cubic-bezier(0.16, 1, 0.3, 1))
            const easeProgress = this.cubicBezier(progress, 0.16, 1, 0.3, 1);

            const currentAngle = from + (to - from) * easeProgress;
            this.currentAngle = currentAngle;

            if (this.containerRef) {
                this.containerRef.style.setProperty('--start', String(currentAngle));
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
            }
        };

        requestAnimationFrame(animate);
    }

    // Cubic bezier easing function
    cubicBezier(t, x1, y1, x2, y2) {
        // Simplified cubic bezier implementation
        const cx = 3 * x1;
        const bx = 3 * (x2 - x1) - cx;
        const ax = 1 - cx - bx;

        const cy = 3 * y1;
        const by = 3 * (y2 - y1) - cy;
        const ay = 1 - cy - by;

        const sampleCurveX = (t) => ((ax * t + bx) * t + cx) * t;
        const sampleCurveY = (t) => ((ay * t + by) * t + cy) * t;

        // Newton-Raphson method to find t for given x
        let t2 = t;
        for (let i = 0; i < 8; i++) {
            const x2 = sampleCurveX(t2) - t;
            if (Math.abs(x2) < 1e-6) break;
            const d2 = (3 * ax * t2 + 2 * bx) * t2 + cx;
            if (Math.abs(d2) < 1e-6) break;
            t2 = t2 - x2 / d2;
        }

        return sampleCurveY(t2);
    }

    setupEventListeners() {
        if (this.options.disabled) return;

        // Mouse/pointer move events
        this.handlePointerMove = (e) => this.handleMove(e);
        this.handleScroll = () => this.handleMove();

        document.body.addEventListener('pointermove', this.handlePointerMove, { passive: true });
        document.body.addEventListener('mousemove', this.handlePointerMove, { passive: true });
        window.addEventListener('scroll', this.handleScroll, { passive: true });
    }

    destroy() {
        // Clean up event listeners
        if (this.animationFrameRef) {
            cancelAnimationFrame(this.animationFrameRef);
        }

        document.body.removeEventListener('pointermove', this.handlePointerMove);
        document.body.removeEventListener('mousemove', this.handlePointerMove);
        window.removeEventListener('scroll', this.handleScroll);

        // Remove added elements and classes
        if (this.element) {
            this.element.classList.remove('glowing-effect-container', 'variant-white', 'disabled', 'glow-enabled');

            // Remove added child elements
            const inactiveBorder = this.element.querySelector('.glowing-effect-inactive-border');
            const mainContainer = this.element.querySelector('.glowing-effect-main');

            if (inactiveBorder) inactiveBorder.remove();
            if (mainContainer) mainContainer.remove();
        }
    }

    // Public methods to update options
    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        this.updateCSSVariables();

        // Update classes based on new options
        if (this.element) {
            this.element.classList.toggle('variant-white', this.options.variant === 'white');
            this.element.classList.toggle('disabled', this.options.disabled);
            this.element.classList.toggle('glow-enabled', this.options.glow);
        }
    }

    enable() {
        this.options.disabled = false;
        if (this.element) {
            this.element.classList.remove('disabled');
        }
        this.setupEventListeners();
    }

    disable() {
        this.options.disabled = true;
        if (this.element) {
            this.element.classList.add('disabled');
        }

        // Clean up event listeners
        document.body.removeEventListener('pointermove', this.handlePointerMove);
        document.body.removeEventListener('mousemove', this.handlePointerMove);
        window.removeEventListener('scroll', this.handleScroll);
    }
}

// Utility function to initialize glowing effect on multiple elements
function initGlowingEffects(selector, options = {}) {
    const elements = document.querySelectorAll(selector);
    const instances = [];

    elements.forEach(element => {
        const instance = new GlowingEffect(element, options);
        instances.push(instance);
    });

    return instances;
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.GlowingEffect = GlowingEffect;
    window.initGlowingEffects = initGlowingEffects;
}

// Auto-initialize glowing effect on prompt boxes when DOM is ready
(function () {
    function autoInitGlowingEffect() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', autoInitGlowingEffect);
            return;
        }

        // Wait a bit for all elements to be rendered
        setTimeout(() => {
            let allInstances = [];

            // Initialize glowing effect on prompt boxes (index page)
            const promptBoxes = document.querySelectorAll('.prompt-box');
            if (promptBoxes.length > 0) {
                const promptInstances = initGlowingEffects('.prompt-box', {
                    blur: 0,
                    inactiveZone: 0.7,
                    proximity: 50,
                    spread: 25,
                    variant: 'default',
                    glow: false,
                    disabled: false,
                    movementDuration: 1.5,
                    borderWidth: 2
                });
                allInstances = allInstances.concat(promptInstances);
                console.log('✅ Glowing effect auto-initialized on', promptInstances.length, 'prompt boxes');
            }

            // Initialize glowing effect on contact page elements
            const contactElements = document.querySelectorAll('.contact-form, .contact-info, .faq-section');
            if (contactElements.length > 0) {
                const contactInstances = initGlowingEffects('.contact-form, .contact-info, .faq-section', {
                    blur: 0,
                    inactiveZone: 0.6,
                    proximity: 60,
                    spread: 30,
                    variant: 'default',
                    glow: false,
                    disabled: false,
                    movementDuration: 2,
                    borderWidth: 2
                });
                allInstances = allInstances.concat(contactInstances);
                console.log('✅ Glowing effect auto-initialized on', contactInstances.length, 'contact page elements');
            }

            // Store all instances globally for debugging
            if (allInstances.length > 0) {
                window.glowingInstances = allInstances;
                console.log('✅ Total glowing effect instances:', allInstances.length);
            }
        }, 100);
    }

    // Initialize immediately if DOM is already ready, otherwise wait
    autoInitGlowingEffect();
})();