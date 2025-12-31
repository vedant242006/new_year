// Initialize AOS
AOS.init({
    duration: 1000,
    once: false,
});

// Set default name here - CHANGE THIS TO HER NAME!
const userName = 'Sumaya';  // 👈 Change this to her actual name

let musicPlaying = false;
let countdownInterval = null;

// ========== COUNTDOWN TIMER ==========
// Set the target date - January 1, 2026 at 00:00:00 IST
const countdownDate = new Date('January 1, 2026 00:00:00 GMT+0530').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = countdownDate - now;
    
    // Get countdown elements
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const messageElement = document.getElementById('countdownMessage');
    
    // Check if elements exist
    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
        return; // Elements not loaded yet
    }
    
    if (distance < 0) {
        // Countdown finished
        clearInterval(countdownInterval);
        daysElement.textContent = '00';
        hoursElement.textContent = '00';
        minutesElement.textContent = '00';
        secondsElement.textContent = '00';
        if (messageElement) {
            messageElement.textContent = '🎉 Happy New Year 2026! 🎉';
        }
        triggerMidnightCelebration();
        return;
    }
    
    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Update the countdown display
    daysElement.textContent = String(days).padStart(2, '0');
    hoursElement.textContent = String(hours).padStart(2, '0');
    minutesElement.textContent = String(minutes).padStart(2, '0');
    secondsElement.textContent = String(seconds).padStart(2, '0');
    
    // Update message based on time remaining
    if (messageElement) {
        if (days === 0 && hours === 0 && minutes === 0 && seconds <= 10) {
            messageElement.textContent = `${seconds}... 🎊`;
        } else if (days === 0 && hours === 0 && minutes < 5) {
            messageElement.textContent = 'Almost there! 🎆';
        } else if (days === 0 && hours < 2) {
            messageElement.textContent = 'Just hours away! 💫';
        } else if (days === 0) {
            messageElement.textContent = 'Today is the day! 🌟';
        } else {
            messageElement.textContent = 'Counting down to our new beginning...';
        }
    }
}

// Start countdown when section becomes active
function startCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    updateCountdown(); // Update immediately
    countdownInterval = setInterval(updateCountdown, 1000); // Update every second
}

// Trigger massive celebration at midnight
function triggerMidnightCelebration() {
    // Create celebration overlay
    const overlay = document.createElement('div');
    overlay.className = 'celebration-overlay';
    overlay.innerHTML = '<h1 class="celebration-text">🎊 HAPPY NEW YEAR 2026! 🎊</h1>';
    document.body.appendChild(overlay);
    
    // Massive fireworks display
    let fireworkCount = 0;
    const fireworkInterval = setInterval(() => {
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * fireworksCanvas.width;
            const y = Math.random() * fireworksCanvas.height * 0.6;
            createFirework(x, y);
        }
        
        // Confetti bursts
        confetti({
            particleCount: 100,
            spread: 160,
            origin: { x: Math.random(), y: Math.random() * 0.6 },
            colors: ['#ffc1e3', '#ffd700', '#64ffda', '#c792ea', '#ff69b4']
        });
        
        fireworkCount++;
        if (fireworkCount > 20) {
            clearInterval(fireworkInterval);
            // Remove overlay after 8 seconds
            setTimeout(() => {
                overlay.style.opacity = '0';
                overlay.style.transition = 'opacity 2s ease';
                setTimeout(() => overlay.remove(), 2000);
            }, 8000);
        }
    }, 400);
    
    // Play music automatically if not already playing
    if (!musicPlaying) {
        toggleMusic();
    }
}

// ========== CANVAS SETUP ==========
const fireworksCanvas = document.getElementById('fireworksCanvas');
const fireworksCtx = fireworksCanvas.getContext('2d');
const particleCanvas = document.getElementById('particleCanvas');
const particleCtx = particleCanvas.getContext('2d');

function resizeCanvas() {
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ========== BACKGROUND PARTICLES ==========
class BackgroundParticle {
    constructor() {
        this.x = Math.random() * particleCanvas.width;
        this.y = Math.random() * particleCanvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * 0.3 - 0.15;
        this.opacity = Math.random() * 0.4 + 0.2;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > particleCanvas.width) this.x = 0;
        if (this.x < 0) this.x = particleCanvas.width;
        if (this.y > particleCanvas.height) this.y = 0;
        if (this.y < 0) this.y = particleCanvas.height;
    }
    
    draw() {
        particleCtx.fillStyle = `rgba(255, 193, 227, ${this.opacity})`;
        particleCtx.beginPath();
        particleCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        particleCtx.fill();
    }
}

const backgroundParticles = [];
for (let i = 0; i < 80; i++) {
    backgroundParticles.push(new BackgroundParticle());
}

function animateBackgroundParticles() {
    particleCtx.fillStyle = 'rgba(10, 25, 47, 0.05)';
    particleCtx.fillRect(0, 0, particleCanvas.width, particleCanvas.height);
    
    backgroundParticles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animateBackgroundParticles);
}

animateBackgroundParticles();

// ========== FIREWORKS ==========
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
            x: (Math.random() - 0.5) * 7,
            y: (Math.random() - 0.5) * 7
        };
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.015;
        this.size = Math.random() * 3 + 1.5;
        this.gravity = 0.03;
    }
    
    update() {
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
    }
    
    draw() {
        fireworksCtx.save();
        fireworksCtx.globalAlpha = this.alpha;
        fireworksCtx.fillStyle = this.color;
        fireworksCtx.shadowBlur = 15;
        fireworksCtx.shadowColor = this.color;
        fireworksCtx.beginPath();
        fireworksCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        fireworksCtx.fill();
        fireworksCtx.restore();
    }
}

class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = fireworksCanvas.height;
        this.targetY = y;
        this.particles = [];
        this.exploded = false;
        this.velocity = { x: 0, y: -7 };
        this.trailParticles = [];
        this.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
    }
    
    update() {
        if (!this.exploded) {
            this.velocity.y += 0.04;
            this.y += this.velocity.y;
            
            this.trailParticles.push({ x: this.x, y: this.y, alpha: 1 });
            
            if (this.y <= this.targetY) {
                this.explode();
            }
        }
        
        this.trailParticles.forEach((trail, index) => {
            trail.alpha -= 0.05;
            if (trail.alpha <= 0) {
                this.trailParticles.splice(index, 1);
            }
        });
        
        this.particles.forEach((particle, index) => {
            particle.update();
            if (particle.alpha <= 0) {
                this.particles.splice(index, 1);
            }
        });
    }
    
    explode() {
        this.exploded = true;
        const particleCount = 80;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.x, this.y, this.color));
        }
    }
    
    draw() {
        this.trailParticles.forEach(trail => {
            fireworksCtx.save();
            fireworksCtx.globalAlpha = trail.alpha;
            fireworksCtx.fillStyle = this.color;
            fireworksCtx.beginPath();
            fireworksCtx.arc(trail.x, trail.y, 2, 0, Math.PI * 2);
            fireworksCtx.fill();
            fireworksCtx.restore();
        });
        
        if (!this.exploded) {
            fireworksCtx.save();
            fireworksCtx.fillStyle = this.color;
            fireworksCtx.shadowBlur = 15;
            fireworksCtx.shadowColor = this.color;
            fireworksCtx.beginPath();
            fireworksCtx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            fireworksCtx.fill();
            fireworksCtx.restore();
        }
        
        this.particles.forEach(particle => particle.draw());
    }
}

const fireworks = [];

function createFirework(x, y) {
    fireworks.push(new Firework(x, y));
}

function animateFireworks() {
    fireworksCtx.fillStyle = 'rgba(10, 25, 47, 0.08)';
    fireworksCtx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    
    if (Math.random() < 0.03) {
        const x = Math.random() * fireworksCanvas.width;
        const y = Math.random() * fireworksCanvas.height * 0.5;
        createFirework(x, y);
    }
    
    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();
        
        if (firework.exploded && firework.particles.length === 0 && firework.trailParticles.length === 0) {
            fireworks.splice(index, 1);
        }
    });
    
    requestAnimationFrame(animateFireworks);
}

animateFireworks();

// Click to create fireworks
document.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
        createFirework(e.clientX, e.clientY);
        triggerConfetti(e.clientX, e.clientY);
    }
});

// ========== CONFETTI ==========
function triggerConfetti(x, y) {
    const count = 50;
    const defaults = {
        origin: { 
            x: x / window.innerWidth, 
            y: y / window.innerHeight 
        },
        colors: ['#ffc1e3', '#ffd700', '#64ffda', '#c792ea'],
        shapes: ['circle', 'square'],
        ticks: 200,
        gravity: 0.8,
        scalar: 1.2
    };
    
    confetti({
        ...defaults,
        particleCount: count,
        spread: 100,
        startVelocity: 30,
    });
}

// ========== FLOATING EMOJIS ==========
function createFloatingEmojis() {
    const emojis = ['💖', '✨', '🎉', '💫', '⭐', '💝', '🌟', '💗'];
    const container = document.getElementById('emojiContainer');
    
    setInterval(() => {
        const emoji = document.createElement('div');
        emoji.classList.add('floating-emoji');
        emoji.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = Math.random() * 100 + '%';
        emoji.style.bottom = '0';
        container.appendChild(emoji);
        
        setTimeout(() => emoji.remove(), 5000);
    }, 600);
}

createFloatingEmojis();

// Trigger initial confetti on page load
window.addEventListener('load', () => {
    setTimeout(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ffc1e3', '#ffd700', '#64ffda']
        });
    }, 500);
});

// ========== MUSIC CONTROL ==========
function toggleMusic() {
    const music = document.getElementById('bgMusic');
    const icon = document.getElementById('musicIcon');
    const text = document.getElementById('musicText');
    
    if (musicPlaying) {
        music.pause();
        icon.textContent = '🎵';
        text.textContent = 'Play Music';
        musicPlaying = false;
    } else {
        music.play().catch(e => console.log('Music play failed:', e));
        icon.textContent = '🎶';
        text.textContent = 'Pause Music';
        musicPlaying = true;
    }
}

// ========== NAVIGATION ==========
function nextSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    AOS.refresh();
    
    // Start countdown when reaching countdown section
    if (sectionId === 'countdownSection') {
        setTimeout(() => {
            startCountdown();
        }, 100);
    }
}

// ========== SECRET MESSAGE ==========
function revealSecret() {
    const lockIcon = document.getElementById('lockIcon');
    const revealBtn = document.getElementById('revealBtn');
    const secretMessage = document.getElementById('secretMessage');
    const secretText = document.getElementById('secretText');
    const nextBtn = document.getElementById('secretNextBtn');
    
    lockIcon.textContent = '🔓';
    revealBtn.style.display = 'none';
    secretMessage.classList.remove('hidden');
    
    const message = `You made my 2025 brighter without even trying.\n\nI'm really grateful for you...\n\nmore than you know 💙`;
    
    let index = 0;
    function typeWriter() {
        if (index < message.length) {
            secretText.textContent += message.charAt(index);
            index++;
            setTimeout(typeWriter, 50);
        } else {
            nextBtn.classList.remove('hidden');
        }
    }
    
    typeWriter();
    
    confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ffc1e3', '#ffd700']
    });
}

// ========== WISH GENERATOR ==========
function generateWish(type) {
    const wishes = {
        funny: [
            "May your 2026 have less stress and more snacks 🍫😂",
            "Hope you get unlimited WiFi and zero bad hair days! 📱✨",
            "Wishing you Netflix without buffering and pizza without calories! 🍕😄"
        ],
        emotional: [
            "I hope this year gives you everything you deserve 💖",
            "May 2026 bring you peace, love, and beautiful moments ✨",
            "You deserve all the happiness in the world 💝"
        ],
        motivation: [
            "You're stronger than you think. This year is yours ✨",
            "2026 is YOUR year. Go conquer it! 🔥",
            "Believe in yourself. You're capable of amazing things 💫"
        ]
    };
    
    const wishOutput = document.getElementById('wishOutput');
    const randomWish = wishes[type][Math.floor(Math.random() * wishes[type].length)];
    
    wishOutput.textContent = randomWish;
    
    confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 }
    });
}

// ========== QUIZ ==========
document.querySelectorAll('.quiz-option').forEach(option => {
    option.addEventListener('click', function() {
        this.parentElement.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        this.classList.add('selected');
        
        // Check if all questions answered
        const allAnswered = document.querySelectorAll('.quiz-option.selected').length >= 3;
        if (allAnswered) {
            setTimeout(() => {
                document.getElementById('quizResult').classList.remove('hidden');
                confetti({
                    particleCount: 60,
                    spread: 60,
                    origin: { y: 0.6 },
                    colors: ['#64ffda', '#ffc1e3']
                });
            }, 500);
        }
    });
});

// ========== PROMISES ==========
function savePromises() {
    const checkboxes = document.querySelectorAll('.promise-checkbox:checked');
    
    if (checkboxes.length > 0) {
        document.getElementById('promiseResult').classList.remove('hidden');
        document.getElementById('promiseNextBtn').classList.remove('hidden');
        
        confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#ffc1e3', '#ffd700', '#64ffda']
        });
    } else {
        alert('Please select at least one promise! 💖');
    }
}
