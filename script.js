// Portfolio Main Page JavaScript

// Sound effects using Web Audio API
class SoundEffects {
    constructor() {
        this.audioContext = null;
        this.init();
    }

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log("Web Audio API not supported");
        }
    }

    playBeep(frequency = 800, duration = 100, type = 'square') {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
    }

    playHover() {
        this.playBeep(600, 80, 'square');
    }

    playClick() {
        this.playBeep(1000, 150, 'square');
    }

    playNavigation() {
        this.playBeep(800, 100, 'square');
        setTimeout(() => this.playBeep(1200, 150, 'square'), 120);
    }
}

const sounds = new SoundEffects();

// Project URL mappings for clean URLs
const projectUrlMap = {
    'jalil-lab-nes-css': '/retro-portfolio',
    'liquid-glass': '/breathe'
};

// Bouncing Background Icons
class BouncingIcons {
    constructor() {
        this.icons = [];
        this.animationId = null;
        this.init();
    }

    init() {
        const iconElements = document.querySelectorAll('.bounce-icon');
        
        iconElements.forEach((element, index) => {
            const icon = {
                element: element,
                x: Math.random() * (window.innerWidth - 50),
                y: Math.random() * (window.innerHeight - 50),
                vx: (Math.random() - 0.5) * parseFloat(element.dataset.speed || 1),
                vy: (Math.random() - 0.5) * parseFloat(element.dataset.speed || 1),
                speed: parseFloat(element.dataset.speed || 1),
                size: 32
            };
            
            element.style.left = icon.x + 'px';
            element.style.top = icon.y + 'px';
            
            this.icons.push(icon);
        });
        
        this.startAnimation();
    }

    startAnimation() {
        const animate = () => {
            this.icons.forEach(icon => {
                icon.x += icon.vx;
                icon.y += icon.vy;
                
                if (icon.x <= 0 || icon.x >= window.innerWidth - icon.size) {
                    icon.vx *= -1;
                    icon.x = Math.max(0, Math.min(window.innerWidth - icon.size, icon.x));
                }
                
                if (icon.y <= 0 || icon.y >= window.innerHeight - icon.size) {
                    icon.vy *= -1;
                    icon.y = Math.max(0, Math.min(window.innerHeight - icon.size, icon.y));
                }
                
                icon.element.style.left = icon.x + 'px';
                icon.element.style.top = icon.y + 'px';
            });
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }

    handleResize() {
        this.icons.forEach(icon => {
            icon.x = Math.min(icon.x, window.innerWidth - icon.size);
            icon.y = Math.min(icon.y, window.innerHeight - icon.size);
        });
    }
}

// Project Navigation with clean URLs
function openProject(projectId) {
    const cleanUrl = projectUrlMap[projectId];
    if (cleanUrl) {
        // Use the clean URL if we have a mapping
        window.location.href = cleanUrl;
    } else {
        // Fallback to the old URL structure
        const currentPath = window.location.href;
        const basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));
        window.location.href = `${basePath}/projects/${projectId}/index.html`;
    }
}

// Initialize everything
let bouncingIcons;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize background systems
    bouncingIcons = new BouncingIcons();

    // Add hover sounds to buttons and project cards
    const buttons = document.querySelectorAll('.nes-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => sounds.playHover());
    });

    const projectCards = document.querySelectorAll('.project-card:not(.coming-soon)');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            sounds.playHover();
            card.style.filter = 'brightness(1.05)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.filter = 'brightness(1)';
        });
    });

    // Add click sounds to interactive elements
    const interactiveElements = document.querySelectorAll('.project-card:not(.coming-soon), .nes-btn:not(.is-disabled)');
    interactiveElements.forEach(element => {
        element.addEventListener('click', () => sounds.playClick());
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (bouncingIcons) {
            bouncingIcons.handleResize();
        }
    });

    // Konami code easter egg
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.code === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activatePortfolioEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
});

function activatePortfolioEasterEgg() {
    sounds.playNavigation();
    
    // Create rainbow effect
    const body = document.body;
    const originalBackground = body.style.background;
    
    body.style.background = 'linear-gradient(45deg, #ff0000, #ff7700, #ffff00, #00ff00, #0000ff, #8800ff)';
    body.style.backgroundSize = '400% 400%';
    body.style.animation = 'gradientShift 0.3s ease infinite';
    
    // Show easter egg message
    const easterEgg = document.createElement('div');
    easterEgg.innerHTML = `
        <div class="nes-container is-rounded" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10000; text-align: center; background: rgba(255,255,255,0.98); max-width: 400px;">
            <h2 class="nes-text is-success">🎉 KONAMI CODE! 🎉</h2>
            <p class="nes-text" style="font-size: 0.7rem; margin: 15px 0;">You unlocked the rainbow lab mode!</p>
            <p class="nes-text is-disabled" style="font-size: 0.5rem; margin: 10px 0;">Secret achievement: True Gamer 🏆</p>
            <button class="nes-btn is-primary" onclick="this.parentElement.parentElement.remove(); document.body.style.background = '${originalBackground}'; document.body.style.animation = 'gradientShift 12s ease infinite';">Awesome!</button>
        </div>
    `;
    document.body.appendChild(easterEgg);
    
    // Make icons go crazy
    const icons = document.querySelectorAll('.bounce-icon');
    icons.forEach(icon => {
        icon.style.animation = 'float 0.2s ease-in-out infinite';
    });
    
    setTimeout(() => {
        icons.forEach(icon => {
            icon.style.animation = 'float 4s ease-in-out infinite';
        });
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0.3; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0.3; }
        to { opacity: 1; }
    }
    
    .project-btn.is-disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);