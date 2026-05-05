// ===== NEURAL NETWORK CANVAS =====
const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');

let nodes = [];
let animFrame;

function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}

function initNodes() {
    nodes = [];
    const count = Math.floor((canvas.width * canvas.height) / 18000);
    for (let i = 0; i < count; i++) {
        nodes.push({
            x:   Math.random() * canvas.width,
            y:   Math.random() * canvas.height,
            vx:  (Math.random() - 0.5) * 0.35,
            vy:  (Math.random() - 0.5) * 0.35,
            r:   Math.random() * 2 + 1.2,
            pulse: Math.random() * Math.PI * 2,
        });
    }
}

function drawNeural(ts) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const MAX_DIST = 160;

    // Update & draw nodes
    nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.018;

        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

        const glow = Math.sin(n.pulse) * 0.5 + 0.5;

        // Node glow
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4);
        grad.addColorStop(0, `rgba(99,102,241,${0.7 * glow})`);
        grad.addColorStop(1, 'rgba(99,102,241,0)');
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Node dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,211,238,${0.5 + 0.5 * glow})`;
        ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i], b = nodes[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MAX_DIST) {
                const alpha = (1 - dist / MAX_DIST) * 0.25;
                // Alternate between indigo and cyan for variety
                const useColor = (i + j) % 3 === 0 ? `rgba(168,85,247,${alpha})` : `rgba(99,102,241,${alpha})`;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = useColor;
                ctx.lineWidth = 0.7;
                ctx.stroke();
            }
        }
    }

    animFrame = requestAnimationFrame(drawNeural);
}

resizeCanvas();
initNodes();
drawNeural();

window.addEventListener('resize', () => {
    cancelAnimationFrame(animFrame);
    resizeCanvas();
    initNodes();
    drawNeural();
});

// ===== FLOATING PARTICLES =====
function spawnParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 28; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 2.5 + 1;
        p.style.cssText = `
            left: ${Math.random() * 100}%;
            width: ${size}px;
            height: ${size}px;
            animation-duration: ${Math.random() * 20 + 14}s;
            animation-delay: ${Math.random() * 12}s;
            background: ${Math.random() > 0.5 ? '#22d3ee' : '#6366f1'};
            opacity: 0;
        `;
        container.appendChild(p);
    }
}
spawnParticles();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== ACTIVE NAV LINK =====
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(l => l.classList.remove('active'));
            const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
            if (link) link.classList.add('active');
        }
    });
}, { threshold: 0.45 });

sections.forEach(s => navObserver.observe(s));

// ===== SECTION SCROLL REVEAL =====
const revealSections = document.querySelectorAll('.section');
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('show');
    });
}, { threshold: 0.12 });
revealSections.forEach(s => revealObserver.observe(s));



// ===== TYPED TITLE EFFECT =====
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const originalHTML = heroTitle.innerHTML;
    // Add subtle text-shadow pulse via JS class toggle
    setInterval(() => heroTitle.classList.toggle('title-pulse'), 3000);
}

// ===== MOUSE PARALLAX ON ORB =====
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual) {
    document.addEventListener('mousemove', e => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;
        heroVisual.style.transform = `translate(${dx * 12}px, ${dy * 8}px)`;
    });
}

// ===== SKILL TAG RIPPLE =====
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position:absolute; border-radius:50%;
            width:60px; height:60px;
            background:rgba(34,211,238,0.25);
            transform:translate(-50%,-50%) scale(0);
            animation:rippleAnim 0.5s ease forwards;
            left:${e.offsetX}px; top:${e.offsetY}px;
            pointer-events:none;
        `;
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 500);
    });
});

// Ripple keyframes via JS
const style = document.createElement('style');
style.textContent = `
@keyframes rippleAnim {
    to { transform: translate(-50%,-50%) scale(3); opacity: 0; }
}
.nav-link.active {
    color: #f1f5f9 !important;
}
.nav-link.active::after {
    width: 100% !important;
}
`;
document.head.appendChild(style);
