// --- Firebase setup with try/catch ---
let counterDocRef;

try {
    const firebaseConfig = {
		apiKey: "AIzaSyCmkddfqUCFQDGBKkcYALriVHXhM2b8n5s",
		authDomain: "denim-defender.firebaseapp.com",
		projectId: "denim-defender",
		storageBucket: "denim-defender.firebasestorage.app",
		messagingSenderId: "1022304447684",
		appId: "1:1022304447684:web:0fb72dd41e3dc8100d2d91"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    const db = firebase.firestore();
    counterDocRef = db.collection("counters").doc("commits");
} catch (err) {
    console.warn("Firebase failed to initialize:", err);
}

// --- Local counter for instant UI updates ---
let commitCount = 0;

// --- Popup functions ---
window.displayMessage = function () {
    const messageElement = document.getElementById('surpriseMessage');
    messageElement.textContent = "🌟 You are hereby officially knighted 🌟";

    const imageContainer = document.getElementById('imageContainer');
    imageContainer.classList.remove('hidden');
		
    const additionalMessageElement = document.getElementById('additionalMessage');
    additionalMessageElement.innerHTML = "👑 You have been dubbed a Denim Defender 🛡️<br><span class='silver-text'>Together, we shall defend denim and sleigh those less fashionable!</span>";

    const popup = document.getElementById('popup');
    popup.classList.remove('hidden');
    popup.classList.add('fade-in');

    confettiExplosion();
};

window.closePopup = async function () {
    const popup = document.getElementById('popup');
    popup.classList.add('hidden');
    popup.classList.remove('fade-in');

    // Update local counter
    commitCount++;
    document.getElementById("totalCommits").textContent = `👑 Sworn Defenders 🛡️⚔🛡️: ${commitCount}`;

    // Update Firestore counter if available
    if (counterDocRef) {
        try {
            await counterDocRef.set(
                { count: firebase.firestore.FieldValue.increment(1) },
                { merge: true }
            );
        } catch (err) {
            console.warn("Failed to update Firestore counter:", err);
        }
    }
};

// --- Rain effect ---
function createRain() {
    const rainContainer = document.getElementById('rain');
    rainContainer.innerHTML = ""; // clear old raindrops

    const raindropCount = 20;
    for (let i = 0; i < raindropCount; i++) {
        const raindrop = document.createElement('div');
        raindrop.classList.add('raindrop');

        const posX = Math.random() * window.innerWidth;
        const height = Math.random() * 15 + 10; // 10-25px tall
        const width = Math.random() * 2 + 1;    // 1-3px wide
        const duration = Math.random() * 2 + 2; // 2-4s
        const delay = Math.random() * 4;         // stagger start up to 4s
        const startY = -(Math.random() * 100);   // start above viewport at random heights

        raindrop.style.left = `${posX}px`;
        raindrop.style.top = `${startY}px`;
        raindrop.style.height = `${height}px`;
        raindrop.style.width = `${width}px`;
        raindrop.style.animationDuration = `${duration}s`;
        raindrop.style.animationDelay = `${delay}s`;

        rainContainer.appendChild(raindrop);
    }
}

// --- Lightning effect ---
function triggerLightningStrike() {
    const flash = document.getElementById('lightning');
    const canvas = document.getElementById('lightning-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function generateBolt(x1, y1, x2, y2, spread) {
        const points = [{ x: x1, y: y1 }];
        const segments = 14;
        for (let i = 1; i < segments; i++) {
            const t = i / segments;
            points.push({
                x: x1 + (x2 - x1) * t + (Math.random() - 0.5) * spread,
                y: y1 + (y2 - y1) * t
            });
        }
        points.push({ x: x2, y: y2 });
        return points;
    }

    function drawBolt(points, width, opacity, blur, color) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.strokeStyle = `rgba(210, 230, 255, ${opacity})`;
        ctx.lineWidth = width;
        ctx.shadowBlur = blur;
        ctx.shadowColor = color;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    }

    function doStrike() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const sx = canvas.width * 0.1 + Math.random() * canvas.width * 0.8;
        const ex = sx + (Math.random() - 0.5) * 220;
        const ey = canvas.height * (0.4 + Math.random() * 0.35);
        const main = generateBolt(sx, 0, ex, ey, 150);

        // Layered glow — outer, mid, bright core
        drawBolt(main, 8,   0.15, 40, '#7733cc');
        drawBolt(main, 3,   0.6,  15, '#bb77ff');
        drawBolt(main, 1.5, 1.0,  6,  '#eeddff');

        // Branches
        const numBranches = Math.floor(Math.random() * 3) + 1;
        for (let b = 0; b < numBranches; b++) {
            const bi = Math.floor(Math.random() * (main.length - 3)) + 1;
            const bp = main[bi];
            const branch = generateBolt(
                bp.x, bp.y,
                bp.x + (Math.random() - 0.5) * 160,
                bp.y + Math.random() * (ey - bp.y) * 0.65,
                60
            );
            drawBolt(branch, 1, 0.45, 10, '#9944ee');
        }

        // Subtle white screen flash
        if (flash) {
            flash.style.display = 'block';
            flash.style.opacity = '0.07';
        }

        setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (flash) {
                flash.style.opacity = '0';
                setTimeout(() => { flash.style.display = 'none'; }, 200);
            }
        }, 320);

        setTimeout(doStrike, Math.random() * 5000 + 2500);
    }

    doStrike();
}

// --- Header image swapping ---
function swapImages() {
    const leftImage = document.getElementById('swappable-image');
    const rightImage = document.querySelector('.header-image.right-image');
    let leftFirst = true;
    let rightFirst = true;

    const firstImage = "hearts1.png";
    const secondImage = "hearts2.png";

    setInterval(() => {
        leftImage.src = leftFirst ? secondImage : firstImage;
        leftFirst = !leftFirst;

        rightImage.src = rightFirst ? firstImage : secondImage;
        rightFirst = !rightFirst;
    }, 1000);
}

// --- Starfield (canvas) ---
function createStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 180 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.8 + 0.3,
        alpha: Math.random(),
        speed: Math.random() * 0.012 + 0.004,
        dir: Math.random() < 0.5 ? 1 : -1
    }));

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => {
            s.alpha += s.speed * s.dir;
            if (s.alpha >= 1) { s.alpha = 1; s.dir = -1; }
            if (s.alpha <= 0) { s.alpha = 0; s.dir = 1; }
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(244, 197, 66, ${s.alpha})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    draw();
}

// --- Confetti explosion ---
function confettiExplosion() {
    const container = document.getElementById('confetti-container');
    if (!container) return;

    const colors = ['#f4c542', '#4169e1', '#b5d3fd', '#ffffff', '#ff6b6b', '#ffd700', '#9370db'];

    for (let i = 0; i < 100; i++) {
        const piece = document.createElement('div');
        piece.classList.add('confetti-piece');

        const x = 20 + Math.random() * 60;
        const size = Math.random() * 10 + 5;
        const duration = Math.random() * 2 + 1.5;
        const delay = Math.random() * 0.6;
        const drift = (Math.random() - 0.5) * 300;
        const rotation = Math.random() * 720 - 360;
        const color = colors[Math.floor(Math.random() * colors.length)];

        piece.style.cssText = `
            left: ${x}%;
            top: 20%;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: ${Math.random() < 0.4 ? '50%' : '2px'};
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            --drift: ${drift}px;
            --rotation: ${rotation}deg;
        `;

        container.appendChild(piece);
        setTimeout(() => piece.remove(), (duration + delay + 0.1) * 1000);
    }
}

// --- Scroll reveal ---
function initScrollReveal() {
    const elements = document.querySelectorAll('.scroll-reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Stagger each element so they cascade even if all revealed at once
    elements.forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.15}s`;
        observer.observe(el);
    });
}

// --- Page load initialization ---
window.addEventListener('load', () => {
    createRain();
    createStarfield();
    initScrollReveal();
    triggerLightningStrike();
    swapImages();

    // Firestore listener if available
    if (counterDocRef) {
        counterDocRef.onSnapshot((doc) => {
            if (doc.exists) {
                const count = doc.data().count || 0;
                document.getElementById("totalCommits").textContent =
                    `👑 Sworn Defenders 🛡️⚔🛡️: ${count}`;
            }
        });
    }
});
