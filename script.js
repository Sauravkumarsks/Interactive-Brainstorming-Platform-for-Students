function toggleFaq(faqElement) {
    const parent = faqElement.parentNode;

    // Close other FAQs
    const allFaqs = document.querySelectorAll('.faq');
    allFaqs.forEach((faq) => {
        if (faq !== parent) {
            faq.classList.remove('open');
        }
    });

    // Toggle the clicked FAQ
    parent.classList.toggle('open');
}
window.onload = function () {
    const videos = [
        document.getElementById("video1"),
        document.getElementById("video2"),
        document.getElementById("video3"),
        document.getElementById("video4"),
        document.getElementById("video5")
    ];

    let currentVideoIndex = 0;

    function playNextVideo() {
        const currentVideo = videos[currentVideoIndex];
        const nextVideoIndex = (currentVideoIndex + 1) % videos.length; // Loop back to the first video
        const nextVideo = videos[nextVideoIndex];

        // Fade out current video
        currentVideo.classList.add("fade-out");
        setTimeout(() => {
            currentVideo.classList.add("hide");
            currentVideo.classList.remove("fade-out");
        }, 1000); // Match the duration of the CSS transition

        // Fade in next video
        nextVideo.classList.remove("hide");
        nextVideo.classList.add("fade-in");
        nextVideo.play();

        setTimeout(() => {
            nextVideo.classList.remove("fade-in");
        }, 1000);

        currentVideoIndex = nextVideoIndex;
    }

    // Add an "ended" event listener to each video
    videos.forEach((video) => {
        video.addEventListener("ended", playNextVideo);
    });
};
      let cards = document.querySelectorAll(".card01");

      let stackArea = document.querySelector(".stack-area");

      function rotateCards() {
        let angle = 0;
        cards.forEach((card, index) => {
          if (card.classList.contains("away")) {
            card.style.transform = `translateY(-120vh) rotate(-48deg)`;
          } else {
            card.style.transform = ` rotate(${angle}deg)`;
            angle = angle - 10;
            card.style.zIndex = cards.length - index;
          }
        });
      }

      rotateCards();

      window.addEventListener("scroll", () => {
        let distance = window.innerHeight * 0.5;

        let topVal = stackArea.getBoundingClientRect().top;

        let index = -1 * (topVal / distance + 1);

        index = Math.floor(index);

        for (i = 0; i < cards.length; i++) {
          if (i <= index) {
            cards[i].classList.add("away");
          } else {
            cards[i].classList.remove("away");
          }
        }
        rotateCards();
      });

// Newsletter subscription handling
function handleSubscribe(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('emailInput');
    const subscribeBtn = event.target.querySelector('.subscribe-btn');
    const messageDiv = document.getElementById('subscriptionMessage');
    
    // Validate email
    const email = emailInput.value.trim();
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        return false;
    }

    // Add loading state
    subscribeBtn.classList.add('loading');
    subscribeBtn.textContent = '';

    // Simulate API call with setTimeout
    setTimeout(() => {
        // Simulate successful subscription
        if (Math.random() > 0.1) { // 90% success rate
            showMessage('Thank you for subscribing! Please check your email for confirmation.', 'success');
            emailInput.value = ''; // Clear input
        } else {
            // Simulate error
            showMessage('Oops! Something went wrong. Please try again later.', 'error');
        }
        
        // Remove loading state
        subscribeBtn.classList.remove('loading');
        subscribeBtn.textContent = 'Subscribe';
    }, 1500); // 1.5 seconds delay to simulate API call

    return false;
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('subscriptionMessage');
    messageDiv.textContent = message;
    messageDiv.className = 'subscription-message'; // Reset classes
    
    // Force a reflow
    void messageDiv.offsetWidth;
    
    // Add the appropriate class
    messageDiv.classList.add(type);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Success Stories Carousel
function moveCarousel(direction) {
    const carousel = document.querySelector('.story-carousel');
    const cardWidth = document.querySelector('.story-card').offsetWidth + 30; // Include gap
    const scrollAmount = direction * cardWidth;
    
    carousel.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

// Handle touch events for mobile swipe
let touchStartX = 0;
let touchEndX = 0;

document.querySelector('.story-carousel').addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.querySelector('.story-carousel').addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance for swipe
    const difference = touchStartX - touchEndX;
    
    if (Math.abs(difference) > swipeThreshold) {
        if (difference > 0) {
            // Swiped left
            moveCarousel(1);
        } else {
            // Swiped right
            moveCarousel(-1);
        }
    }
}
