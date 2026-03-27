// =============================================
// CUSTOM CURSOR
// =============================================
const cursor = document.getElementById('cursor');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

const interactiveElements = document.querySelectorAll('a, .project-card, .popup-close, .popup-btn');
interactiveElements.forEach((el) => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// =============================================
// SCROLL REVEAL - PROJECT CARDS
// =============================================
const cards = document.querySelectorAll('.project-card');

const revealCards = () => {
  cards.forEach((card, index) => {
    const cardTop = card.getBoundingClientRect().top;
    const triggerPoint = window.innerHeight * 0.85;

    if (cardTop < triggerPoint) {
      setTimeout(() => {
        card.classList.add('visible');
      }, index * 100);
    }
  });
};

window.addEventListener('scroll', revealCards);
window.addEventListener('load', revealCards);

// =============================================
// ABOUT - ANIMATED COUNTERS
// =============================================
const highlightNumbers = document.querySelectorAll('.highlight-number[data-target]');
let countersAnimated = false;

function animateHighlights() {
  if (countersAnimated) return;
  const aboutSection = document.querySelector('.about');
  if (!aboutSection) return;

  const rect = aboutSection.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.8) {
    countersAnimated = true;
    highlightNumbers.forEach((el) => {
      const target = parseInt(el.getAttribute('data-target'));
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current + '+';
      }, 40);
    });
  }
}

window.addEventListener('scroll', animateHighlights);

// =============================================
// SKILLS - REVEAL ON SCROLL
// =============================================
const skillCategories = document.querySelectorAll('.skill-category');

function revealSkills() {
  skillCategories.forEach((cat, index) => {
    const rect = cat.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      setTimeout(() => {
        cat.style.opacity = '1';
        cat.style.transform = 'translateY(0)';
      }, index * 100);
    }
  });
}

// Initial state
skillCategories.forEach((cat) => {
  cat.style.opacity = '0';
  cat.style.transform = 'translateY(20px)';
  cat.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

window.addEventListener('scroll', revealSkills);

// =============================================
// PARALLAX HERO PHOTO
// =============================================
const heroPhoto = document.querySelector('.hero-photo');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  if (heroPhoto && scrolled < window.innerHeight) {
    heroPhoto.style.transform = `scale(1.05) translateY(${scrolled * 0.3}px)`;
  }
});

// =============================================
// URGENCY POPUP
// =============================================
const popupOverlay = document.getElementById('popupOverlay');
const popupClose = document.getElementById('popupClose');
const popupParticles = document.getElementById('popupParticles');
const statProjects = document.getElementById('statProjects');
const statTime = document.getElementById('statTime');
const urgencyFill = document.getElementById('urgencyFill');

let popupTriggered = false;
const pageLoadTime = Date.now();

// Track time on page
function updateTimeOnPage() {
  const elapsed = Math.floor((Date.now() - pageLoadTime) / 1000);
  const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const secs = String(elapsed % 60).padStart(2, '0');
  if (statTime) statTime.textContent = `${mins}:${secs}`;
}

setInterval(updateTimeOnPage, 1000);

// Animate project count
function animateCounter(element, target, duration) {
  let start = 0;
  const step = Math.ceil(target / (duration / 30));
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    element.textContent = start + '+';
  }, 30);
}

// Create explosion particles
function createParticles() {
  const count = 40;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const angle = (Math.PI * 2 * i) / count;
    const distance = 200 + Math.random() * 400;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    particle.style.setProperty('--tx', tx + 'px');
    particle.style.setProperty('--ty', ty + 'px');
    particle.style.left = '50%';
    particle.style.top = '50%';
    particle.style.animationDelay = Math.random() * 0.3 + 's';
    particle.style.animationDuration = (1.5 + Math.random()) + 's';

    // Random colors between accent and white
    const colors = ['#FDA228', '#fff', '#ff6b6b', '#FDA228', '#FDA228'];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.width = (2 + Math.random() * 4) + 'px';
    particle.style.height = particle.style.width;

    popupParticles.appendChild(particle);
  }

  // Clean up after animation
  setTimeout(() => {
    popupParticles.innerHTML = '';
  }, 3000);
}

// Show popup
function showPopup() {
  if (popupTriggered) return;
  popupTriggered = true;

  createParticles();
  popupOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Animate counter
  animateCounter(statProjects, 15, 1500);
}

// Close popup
function closePopup() {
  popupOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

popupClose.addEventListener('click', closePopup);
popupOverlay.addEventListener('click', (e) => {
  if (e.target === popupOverlay) closePopup();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePopup();
});

// Trigger: when last project card is visible on screen
const lastCard = cards[cards.length - 1];

window.addEventListener('scroll', () => {
  if (popupTriggered || !lastCard) return;

  const cardRect = lastCard.getBoundingClientRect();
  const isVisible = cardRect.top < window.innerHeight * 0.8;

  if (isVisible) {
    // Small delay so user sees the last card before popup
    setTimeout(showPopup, 1500);
  }
});
