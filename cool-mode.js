/**
 * Cool Mode Effect - Particle animation for interactive elements
 * Based on the React CoolMode component, adapted for vanilla JavaScript
 */

class CoolMode {
    constructor() {
        this.instanceCounter = 0;
        this.container = null;
    }

    getContainer() {
        const id = "_coolMode_effect";
        let existingContainer = document.getElementById(id);

        if (existingContainer) {
            return existingContainer;
        }

        const container = document.createElement("div");
        container.setAttribute("id", id);
        container.setAttribute(
            "style",
            "overflow:hidden; position:fixed; height:100%; top:0; left:0; right:0; bottom:0; pointer-events:none; z-index:2147483647"
        );

        document.body.appendChild(container);
        this.container = container;

        return container;
    }

    applyParticleEffect(element, options = {}) {
        this.instanceCounter++;

        const defaultParticle = "circle";
        const particleType = options.particle || defaultParticle;
        const sizes = [15, 20, 25, 35, 45];
        const limit = 45;

        let particles = [];
        let autoAddParticle = false;
        let mouseX = 0;
        let mouseY = 0;

        const container = this.getContainer();

        const generateParticle = () => {
            const size = options.size || sizes[Math.floor(Math.random() * sizes.length)];
            const speedHorz = options.speedHorz || Math.random() * 10;
            const speedUp = options.speedUp || Math.random() * 25;
            const spinVal = Math.random() * 360;
            const spinSpeed = Math.random() * 35 * (Math.random() <= 0.5 ? -1 : 1);
            const top = mouseY - size / 2;
            const left = mouseX - size / 2;
            const direction = Math.random() <= 0.5 ? -1 : 1;

            const particle = document.createElement("div");

            if (particleType === "circle") {
                const svgNS = "http://www.w3.org/2000/svg";
                const circleSVG = document.createElementNS(svgNS, "svg");
                const circle = document.createElementNS(svgNS, "circle");
                circle.setAttributeNS(null, "cx", (size / 2).toString());
                circle.setAttributeNS(null, "cy", (size / 2).toString());
                circle.setAttributeNS(null, "r", (size / 2).toString());
                circle.setAttributeNS(
                    null,
                    "fill",
                    `hsl(${Math.random() * 360}, 70%, 50%)`
                );

                circleSVG.appendChild(circle);
                circleSVG.setAttribute("width", size.toString());
                circleSVG.setAttribute("height", size.toString());

                particle.appendChild(circleSVG);
            } else {
                particle.innerHTML = `<img src="${particleType}" width="${size}" height="${size}" style="border-radius: 50%">`;
            }

            particle.style.position = "absolute";
            particle.style.transform = `translate3d(${left}px, ${top}px, 0px) rotate(${spinVal}deg)`;

            container.appendChild(particle);

            particles.push({
                direction,
                element: particle,
                left,
                size,
                speedHorz,
                speedUp,
                spinSpeed,
                spinVal,
                top,
            });
        };

        const refreshParticles = () => {
            particles.forEach((p) => {
                p.left = p.left - p.speedHorz * p.direction;
                p.top = p.top - p.speedUp;
                p.speedUp = Math.min(p.size, p.speedUp - 1);
                p.spinVal = p.spinVal + p.spinSpeed;

                if (
                    p.top >=
                    Math.max(window.innerHeight, document.body.clientHeight) + p.size
                ) {
                    particles = particles.filter((o) => o !== p);
                    p.element.remove();
                }

                p.element.setAttribute(
                    "style",
                    [
                        "position:absolute",
                        "will-change:transform",
                        `top:${p.top}px`,
                        `left:${p.left}px`,
                        `transform:rotate(${p.spinVal}deg)`,
                    ].join(";")
                );
            });
        };

        let animationFrame;
        let lastParticleTimestamp = 0;
        const particleGenerationDelay = 30;

        const loop = () => {
            const currentTime = performance.now();
            if (
                autoAddParticle &&
                particles.length < limit &&
                currentTime - lastParticleTimestamp > particleGenerationDelay
            ) {
                generateParticle();
                lastParticleTimestamp = currentTime;
            }

            refreshParticles();
            animationFrame = requestAnimationFrame(loop);
        };

        loop();

        const isTouchInteraction = "ontouchstart" in window;
        const tap = isTouchInteraction ? "touchstart" : "mousedown";
        const tapEnd = isTouchInteraction ? "touchend" : "mouseup";
        const move = isTouchInteraction ? "touchmove" : "mousemove";

        const updateMousePosition = (e) => {
            if (e.touches) {
                mouseX = e.touches[0].clientX;
                mouseY = e.touches[0].clientY;
            } else {
                mouseX = e.clientX;
                mouseY = e.clientY;
            }
        };

        const tapHandler = (e) => {
            updateMousePosition(e);
            autoAddParticle = true;
        };

        const disableAutoAddParticle = () => {
            autoAddParticle = false;
        };

        element.addEventListener(move, updateMousePosition, { passive: true });
        element.addEventListener(tap, tapHandler, { passive: true });
        element.addEventListener(tapEnd, disableAutoAddParticle, { passive: true });
        element.addEventListener("mouseleave", disableAutoAddParticle, {
            passive: true,
        });

        // Return cleanup function
        return () => {
            element.removeEventListener(move, updateMousePosition);
            element.removeEventListener(tap, tapHandler);
            element.removeEventListener(tapEnd, disableAutoAddParticle);
            element.removeEventListener("mouseleave", disableAutoAddParticle);

            const interval = setInterval(() => {
                if (animationFrame && particles.length === 0) {
                    cancelAnimationFrame(animationFrame);
                    clearInterval(interval);

                    if (--this.instanceCounter === 0 && this.container) {
                        this.container.remove();
                        this.container = null;
                    }
                }
            }, 500);
        };
    }

    // Convenience method to apply cool mode to multiple elements
    applyToElements(selectors, options = {}) {
        const cleanupFunctions = [];
        
        selectors.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                const cleanup = this.applyParticleEffect(element, options);
                cleanupFunctions.push(cleanup);
            }
        });

        return () => {
            cleanupFunctions.forEach(cleanup => cleanup());
        };
    }
}

// Create global instance
window.coolMode = new CoolMode();

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CoolMode;
}