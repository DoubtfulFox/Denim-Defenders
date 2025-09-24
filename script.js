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
    additionalMessageElement.textContent = "You have been dubbed a Denim Defender. Together, we shall defend denim and sleigh those less fashionable!";

    const popup = document.getElementById('popup');
    popup.classList.remove('hidden');
    popup.classList.add('fade-in');
};

window.closePopup = async function () {
    const popup = document.getElementById('popup');
    popup.classList.add('hidden');
    popup.classList.remove('fade-in');

    // Update local counter
    commitCount++;
    document.getElementById("totalCommits").textContent = `Sworn Defenders 🛡️⚔🛡️: ${commitCount}`;

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

    const raindropCount = 10; // adjust for performance
    for (let i = 0; i < raindropCount; i++) {
        const raindrop = document.createElement('div');
        raindrop.classList.add('raindrop');

        const posX = Math.random() * window.innerWidth;
        const height = Math.random() * 15 + 10; // 10-25px tall
        const width = Math.random() * 2 + 1;    // 1-3px wide
        const duration = Math.random() * 2 + 2; // 2-4s

        raindrop.style.left = `${posX}px`;
        raindrop.style.height = `${height}px`;
        raindrop.style.width = `${width}px`;
        raindrop.style.animationDuration = `${duration}s`;

        rainContainer.appendChild(raindrop);
    }
}

// --- Lightning effect ---
function triggerLightningStrike() {
    const lightningElement = document.getElementById('lightning');
    const lightningBolt = document.getElementById('lightning-bolt');

    setInterval(() => {
        // Flash
        lightningElement.style.display = 'block';
        lightningElement.style.opacity = 0.4;

        // Random bolt
        const randomAngle = Math.random() * 45 + 10;
        const isLeft = Math.random() < 0.5;
        const posX = Math.random() * 100;

        lightningBolt.style.left = `${posX}%`;
        lightningBolt.style.top = '0';
        lightningBolt.style.transform = isLeft
            ? `rotate(-${randomAngle}deg)`
            : `rotate(${randomAngle}deg)`;

        lightningBolt.style.display = 'block';
        lightningBolt.style.opacity = 1;
        lightningBolt.style.animation = 'boltAnimation 0.25s forwards';

        setTimeout(() => {
            lightningElement.style.opacity = 0;
            lightningElement.style.display = 'none';
        }, 300);

        setTimeout(() => {
            lightningBolt.style.display = 'none';
        }, 400);
    }, Math.random() * 5000 + 2000);
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

// --- Page load initialization ---
window.addEventListener('load', () => {
    createRain();
    triggerLightningStrike();
    swapImages();

    // Firestore listener if available
    if (counterDocRef) {
        counterDocRef.onSnapshot((doc) => {
            if (doc.exists) {
                const count = doc.data().count || 0;
                document.getElementById("totalCommits").textContent =
                    `Sworn Defenders 🛡️⚔🛡️: ${count}`;
            }
        });
    }
});
