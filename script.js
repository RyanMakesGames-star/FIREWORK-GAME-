const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width, height;
let rockets = [];
let particles = [];

function init() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

// --- The Rocket (Shoots Up) ---
class Rocket {
    constructor(targetX, targetY) {
        this.x = Math.random() * width; // Starts at random bottom position
        this.y = height;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = 15;
        this.angle = Math.atan2(targetY - this.y, targetX - this.x);
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.hue = Math.floor(Math.random() * 360);
        this.dead = false;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Check if it reached the destination (approx)
        const dist = Math.hypot(this.targetX - this.x, this.targetY - this.y);
        if (dist < 15 || this.y <= this.targetY) {
            this.dead = true;
            explode(this.x, this.y, this.hue);
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.hue}, 100%, 70%)`;
        ctx.fill();
    }
}

// --- The Particle (The Explosion) ---
class Particle {
    constructor(x, y, hue) {
        this.x = x;
        this.y = y;
        this.hue = hue + (Math.random() * 20 - 10); // Slight color variation
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
    }

    update() {
        this.vx *= 0.95; // Air resistance
        this.vy *= 0.95;
        this.vy += 0.12; // Gravity
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.hue}, 100%, 60%)`;
        ctx.fill();
    }
}

function explode(x, y, hue) {
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle(x, y, hue));
    }
}

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, width, height);

    rockets = rockets.filter(r => !r.dead);
    rockets.forEach(r => {
        r.update();
        r.draw();
    });

    particles = particles.filter(p => p.alpha > 0);
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(loop);
}

window.addEventListener('mousedown', (e) => {
    rockets.push(new Rocket(e.clientX, e.clientY));
});

window.addEventListener('resize', init);

init();
loop();