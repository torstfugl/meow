const countdownElement = document.getElementById('countdown');
const giftBox = document.getElementById('gift-box');
const hiddenPage = document.getElementById('hidden-page');
const videoContainer = document.getElementById('video-container');

const videoCount = 20; // Total number of videos
const videoFolder = 'Videos/'; // Folder where videos are stored
let currentPlayingVideo = null; // Track the currently playing video

// Intersection Observer to detect visibility of videos and autoplay
const videoObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        const video = entry.target;

        if (entry.isIntersecting) {
            // If video is in view, ensure it starts playing
            if (currentPlayingVideo && currentPlayingVideo !== video) {
                currentPlayingVideo.pause();
                currentPlayingVideo.muted = true; // Mute the old video when it's not in view
            }

            // Unmute and play the current video when it's visible
            video.muted = false;
            video.play().catch(error => {
                console.error('Autoplay failed:', error);
            });

            currentPlayingVideo = video; // Update the currently playing video
        } else {
            // If video is out of view, pause it
            video.pause();
            video.muted = true; // Mute the video when it's not visible
        }
    });
}, { threshold: 0.5 }); // 50% of the video should be in the viewport to trigger autoplay

// Function to pick a random video
function getRandomVideo() {
    const randomVideoIndex = Math.floor(Math.random() * videoCount) + 1; // Random number between 1 and 20
    return `${videoFolder}${randomVideoIndex}.mp4`; // Return the video file path
}

// Function to add a new random video element to the page
function addRandomVideo() {
    const videoElement = document.createElement('video');
    videoElement.classList.add('meme-video');
    videoElement.src = getRandomVideo(); // Set the video source to a random
    videoElement.preload = "metadata"; // Preload only metadata initially
    videoElement.loop = false; // No infinite looping
    videoElement.controls = true; // Show controls
    videoElement.playsInline = true; // Inline playback
    videoElement.webkitPlaysInline = true; // Safari-specific inline playback
    videoElement.muted = true; // Initially muted to avoid autoplay issues

    // Limit playback to 20 seconds
    videoElement.addEventListener('timeupdate', () => {
        if (videoElement.currentTime >= 20) {
            videoElement.pause();
            videoElement.currentTime = 0; // Reset video to the start
        }
    });

    videoContainer.appendChild(videoElement); // Add video to container
    videoObserver.observe(videoElement); // Start observing the new video
}

// Add initial set of videos (e.g., 10 videos initially)
for (let i = 0; i < 10; i++) {
    addRandomVideo();
}

// Detect when user scrolls near the bottom and add more videos
window.addEventListener('scroll', () => {
    // Check if the user has scrolled near the bottom of the page
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        addRandomVideo(); // Add a new random video when user scrolls to the bottom
    }
});

// Countdown Timer
function updateCountdown() {
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), 11, 16); // 24th December
    const diff = targetDate - now;

    if (diff <= 0) {
        countdownElement.textContent = "God Jul, Trykk på gaven";
        giftBox.style.display = 'block';
    } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        countdownElement.textContent = `${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds left!`;
    }
}

setInterval(updateCountdown, 1000);

// Show hidden page when gift box is clicked
giftBox.addEventListener('click', () => {
    giftBox.style.display = 'none';
    hiddenPage.style.display = 'block';
});
