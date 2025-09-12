// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Set up navigation link event listeners
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    // Moon phase interactions
    const phaseItems = document.querySelectorAll('.phase-item');
    
    phaseItems.forEach(item => {
        item.addEventListener('click', function() {
            const phase = this.dataset.phase;
            showPhaseInfo(phase);
        });
        
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const moon = document.getElementById('moon');
        const hero = document.querySelector('.hero');
        
        if (moon && scrolled < hero.offsetHeight) {
            moon.style.transform = `translateY(${scrolled * 0.5}px) rotateY(${scrolled * 0.1}deg)`;
        }
        
        // Navbar background opacity
        const navbar = document.querySelector('.navbar');
        if (scrolled > 50) {
            navbar.style.background = 'rgba(12, 12, 31, 0.95)';
        } else {
            navbar.style.background = 'rgba(12, 12, 31, 0.9)';
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.fact-card, .phase-item, .stat-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // Interactive lunar map
    setupLunarMap();
    
    // Current moon phase display
    displayCurrentMoonPhase();
    
    // Auto-rotating testimonials or facts
    startFactRotation();
});

// Show detailed phase information
function showPhaseInfo(phase) {
    const phaseData = {
        'new': {
            name: 'New Moon',
            description: 'The Moon is positioned between Earth and the Sun. The illuminated side faces away from Earth, making it invisible.',
            duration: 'Lasts about 1 day',
            nextPhase: 'Waxing Crescent in 3-4 days'
        },
        'waxing-crescent': {
            name: 'Waxing Crescent',
            description: 'A sliver of the Moon becomes visible as it moves away from the Sun-Earth line.',
            duration: 'Lasts about 7 days',
            nextPhase: 'First Quarter'
        },
        'first-quarter': {
            name: 'First Quarter',
            description: 'Half of the Moon is illuminated. This is when the Moon has completed 1/4 of its orbit.',
            duration: 'Lasts about 1 day',
            nextPhase: 'Waxing Gibbous'
        },
        'waxing-gibbous': {
            name: 'Waxing Gibbous',
            description: 'More than half but not fully illuminated. "Gibbous" means humped or bulging.',
            duration: 'Lasts about 7 days',
            nextPhase: 'Full Moon'
        },
        'full': {
            name: 'Full Moon',
            description: 'The entire face of the Moon is illuminated as Earth is between the Sun and Moon.',
            duration: 'Lasts about 1 day',
            nextPhase: 'Waning Gibbous'
        },
        'waning-gibbous': {
            name: 'Waning Gibbous',
            description: 'The illuminated portion begins to decrease after the full moon.',
            duration: 'Lasts about 7 days',
            nextPhase: 'Last Quarter'
        },
        'last-quarter': {
            name: 'Last Quarter',
            description: 'Half illuminated again, but the opposite side from First Quarter.',
            duration: 'Lasts about 1 day',
            nextPhase: 'Waning Crescent'
        },
        'waning-crescent': {
            name: 'Waning Crescent',
            description: 'Only a sliver remains visible as the cycle prepares to begin anew.',
            duration: 'Lasts about 7 days',
            nextPhase: 'New Moon'
        }
    };

    const info = phaseData[phase];
    if (info) {
        showModal(info);
    }
}

// Modal display for detailed information
function showModal(info) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('phase-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'phase-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2 class="modal-title"></h2>
                <p class="modal-description"></p>
                <div class="modal-details">
                    <p class="modal-duration"></p>
                    <p class="modal-next"></p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Add modal styles
        const modalStyles = `
            .modal {
                display: none;
                position: fixed;
                z-index: 2000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
            }
            .modal-content {
                background: linear-gradient(135deg, rgba(12, 12, 31, 0.95), rgba(26, 26, 62, 0.95));
                margin: 10% auto;
                padding: 2rem;
                border-radius: 20px;
                border: 1px solid rgba(100, 255, 218, 0.3);
                width: 90%;
                max-width: 500px;
                position: relative;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            }
            .close-modal {
                position: absolute;
                right: 20px;
                top: 15px;
                font-size: 2rem;
                cursor: pointer;
                color: #64ffda;
                transition: color 0.3s ease;
            }
            .close-modal:hover {
                color: #c77dff;
            }
            .modal-title {
                color: #64ffda;
                margin-bottom: 1rem;
                font-family: 'Orbitron', monospace;
            }
            .modal-description {
                margin-bottom: 1.5rem;
                line-height: 1.6;
            }
            .modal-details p {
                margin: 0.5rem 0;
                opacity: 0.9;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);

        // Close modal event
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Update modal content
    modal.querySelector('.modal-title').textContent = info.name;
    modal.querySelector('.modal-description').textContent = info.description;
    modal.querySelector('.modal-duration').textContent = info.duration;
    modal.querySelector('.modal-next').textContent = `Next: ${info.nextPhase}`;
    modal.style.display = 'block';
}

// Setup interactive lunar map
function setupLunarMap() {
    const featurePoints = document.querySelectorAll('.feature-point');
    
    featurePoints.forEach(point => {
        point.addEventListener('mouseenter', function() {
            this.querySelector('.point-marker').style.transform = 'scale(1.5)';
            this.querySelector('.point-marker').style.boxShadow = '0 0 30px rgba(100, 255, 218, 1)';
        });
        
        point.addEventListener('mouseleave', function() {
            this.querySelector('.point-marker').style.transform = 'scale(1)';
            this.querySelector('.point-marker').style.boxShadow = '0 0 20px rgba(100, 255, 218, 0.8)';
        });
    });
}

// Display current moon phase
function displayCurrentMoonPhase() {
    const today = new Date();
    const currentPhase = getCurrentMoonPhase(today);
    
    // Highlight current phase
    const currentPhaseElement = document.querySelector(`[data-phase="${currentPhase}"]`);
    if (currentPhaseElement) {
        currentPhaseElement.style.border = '2px solid #64ffda';
        currentPhaseElement.style.boxShadow = '0 0 30px rgba(100, 255, 218, 0.5)';
        
        const badge = document.createElement('div');
        badge.className = 'current-phase-badge';
        badge.textContent = 'Current';
        badge.style.cssText = `
            position: absolute;
            top: -10px;
            right: -10px;
            background: #64ffda;
            color: #0c0c1f;
            padding: 0.3rem 0.6rem;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: bold;
        `;
        currentPhaseElement.style.position = 'relative';
        currentPhaseElement.appendChild(badge);
    }
}

// Calculate current moon phase (simplified calculation)
function getCurrentMoonPhase(date) {
    const knownNewMoon = new Date('2024-01-11'); // Known new moon date
    const synodicMonth = 29.53058867; // Days in lunar cycle
    
    const daysSinceNewMoon = (date - knownNewMoon) / (1000 * 60 * 60 * 24);
    const currentCycle = daysSinceNewMoon % synodicMonth;
    
    if (currentCycle < 1) return 'new';
    if (currentCycle < 7) return 'waxing-crescent';
    if (currentCycle < 8) return 'first-quarter';
    if (currentCycle < 15) return 'waxing-gibbous';
    if (currentCycle < 16) return 'full';
    if (currentCycle < 23) return 'waning-gibbous';
    if (currentCycle < 24) return 'last-quarter';
    return 'waning-crescent';
}

// Rotating facts feature
function startFactRotation() {
    const facts = [
        "The Moon moves away from Earth by about 3.8 cm each year.",
        "One day on the Moon lasts about 29.5 Earth days.",
        "The Moon's gravity is about 1/6th of Earth's gravity.",
        "The Moon was formed about 4.5 billion years ago.",
        "The Moon's surface area is about the same as Africa.",
        "Moonquakes can last for up to 10 minutes.",
        "The Moon has water ice at its polar regions."
    ];
    
    let currentFactIndex = 0;
    
    // Create rotating fact display
    const factDisplay = document.createElement('div');
    factDisplay.className = 'rotating-fact';
    factDisplay.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(12, 12, 31, 0.9);
        padding: 1rem;
        border-radius: 10px;
        border: 1px solid rgba(100, 255, 218, 0.3);
        max-width: 300px;
        font-size: 0.9rem;
        z-index: 1000;
        transition: all 0.5s ease;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(factDisplay);
    
    function updateFact() {
        factDisplay.style.opacity = '0';
        factDisplay.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            factDisplay.innerHTML = `
                <div style="color: #64ffda; font-weight: bold; margin-bottom: 0.5rem;">
                    🌙 Moon Fact
                </div>
                <div>${facts[currentFactIndex]}</div>
            `;
            factDisplay.style.opacity = '1';
            factDisplay.style.transform = 'translateY(0)';
            currentFactIndex = (currentFactIndex + 1) % facts.length;
        }, 250);
    }
    
    updateFact();
    setInterval(updateFact, 8000); // Change fact every 8 seconds
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('phase-modal');
        if (modal && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    }
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}