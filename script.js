
let commitCount = 0; // keeps track of total commits


window.displayMessage = function () {
	
    console.log("Button clicked!"); // Add this line
    const messageElement = document.getElementById('surpriseMessage');
    messageElement.textContent = "🌟 You are hereby officially knighted 🌟";

    const imageContainer = document.getElementById('imageContainer');
    imageContainer.classList.remove('hidden');

    const additionalMessageElement = document.getElementById('additionalMessage');
    additionalMessageElement.textContent = "We will defend denim and sleigh those less fashionable!";

    const popup = document.getElementById('popup');
    popup.classList.remove('hidden');
    popup.classList.add('fade-in');
};

window.closePopup = function () {
    const popup = document.getElementById('popup');
    popup.classList.add('hidden');
    popup.classList.remove('fade-in');

    // Increment counter atomically in Firebase
    counterDocRef.set(
        { count: firebase.firestore.FieldValue.increment(1) },
        { merge: true }
    );
};

// Attach event listener to close button inside the popup
document.getElementById('close-popup-btn')?.addEventListener('click', closePopup);

// Function to create raindrops and animate them
function createRain() {
    const rainContainer = document.getElementById('rain');
    
    // Create 10 raindrops (reduced number)
    for (let i = 0; i < 10; i++) {
        const raindrop = document.createElement('div');
        raindrop.classList.add('raindrop');
        
        // Random position for each raindrop
        const positionX = Math.random() * window.innerWidth;
        const duration = Math.random() * 2 + 2;  // Rain fall time between 2-4 seconds
        
        raindrop.style.left = `${positionX}px`;
        raindrop.style.animationDuration = `${duration}s`;
        
        // Append raindrop to the rain container
        rainContainer.appendChild(raindrop);
    }
}

// Function to trigger the lightning effect
function triggerLightningStrike() {
    const lightningElement = document.getElementById('lightning');
    const lightningBolt = document.getElementById('lightning-bolt');

    setInterval(() => {
        // Flash the screen
        lightningElement.style.display = 'block';
        lightningElement.style.opacity = 0.4;

        // Randomize bolt properties
        const randomAngle = Math.random() * 45 + 10; // Random angle (10 to 45 degrees)
        const isGoingLeft = Math.random() < 0.5; // 50% chance for left or right
        const randomPositionX = Math.random() * 100; // Horizontal position as a percentage
        
        // Set position and rotation
        lightningBolt.style.left = `${randomPositionX}%`;
        lightningBolt.style.top = '0';
        lightningBolt.style.transform = isGoingLeft
            ? `rotate(-${randomAngle}deg)` // Rotate left
            : `rotate(${randomAngle}deg)`; // Rotate right

        // Display the lightning bolt
        lightningBolt.style.display = 'block';
        lightningBolt.style.opacity = 1;

        // Animate and hide the bolt
        lightningBolt.style.animation = 'boltAnimation 0.25s forwards';
        setTimeout(() => {
            lightningElement.style.opacity = 0;
            lightningElement.style.display = 'none';
        }, 300);

        setTimeout(() => {
            lightningBolt.style.display = 'none';
        }, 400);
    }, Math.random() * 5000 + 2000); // Random interval (2-7 seconds)
}

// Function to swap images every second
function swapImages() {
    const leftImageElement = document.getElementById('swappable-image');
    const rightImageElement = document.querySelector('.header-image.right-image');
    let isFirstImageLeft = true;
    let isFirstImageRight = true;

    const firstImage = "hearts1.png";
    const secondImage = "hearts2.png"; // Replace with the path to your second image

    setInterval(() => {
        leftImageElement.src = isFirstImageLeft ? secondImage : firstImage;
        isFirstImageLeft = !isFirstImageLeft; // Toggle the flag for left image

        rightImageElement.src = isFirstImageRight ? firstImage : secondImage;
        isFirstImageRight = !isFirstImageRight; // Toggle the flag for right image
    }, 1000);
}

// Start rain, lightning, and image swapping effects on page load
window.addEventListener('load', () => {
    createRain();
    triggerLightningStrike();
    swapImages();
});