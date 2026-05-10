const tabs = document.querySelectorAll('.tab');
const cards = document.querySelectorAll('.menu-card');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox?.querySelector('img');
const lightboxClose = lightbox?.querySelector('.lightbox-close');
const reviewCards = document.querySelectorAll('.review-card');
const prevBtn = document.querySelector('.carousel-control.prev');
const nextBtn = document.querySelector('.carousel-control.next');
const progressBar = document.getElementById('progressBar');
const heroMedia = document.querySelector('.hero-media');
const loader = document.getElementById('pageLoader');
const counters = document.querySelectorAll('.stat-number');
let activeReview = 0;
let countersAnimated = false;

function switchTab(tabName) {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.tab === tabName;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive);
  });

  cards.forEach((card) => {
    const isVisible = card.dataset.content === tabName;
    card.classList.toggle('hidden', !isVisible);
  });
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});

function showReview(index) {
  reviewCards.forEach((card, idx) => {
    card.classList.toggle('active', idx === index);
  });
}

function nextReview() {
  activeReview = (activeReview + 1) % reviewCards.length;
  showReview(activeReview);
}

function prevReview() {
  activeReview = (activeReview - 1 + reviewCards.length) % reviewCards.length;
  showReview(activeReview);
}

prevBtn?.addEventListener('click', prevReview);
nextBtn?.addEventListener('click', nextReview);
setInterval(nextReview, 6500);

galleryItems.forEach((item) => {
  item.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = item.dataset.image;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});

lightboxClose?.addEventListener('click', () => {
  if (!lightbox) return;
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
});

lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
  }
});

const reserveForm = document.querySelector('.reserve-form');
reserveForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  alert('Thanks! Your reservation request has been received. We will get back to you shortly.');
  reserveForm.reset();
});

function updateProgress() {
  if (!progressBar) return;
  const scrollDistance = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollDistance / docHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

function parallaxHero() {
  if (!heroMedia) return;
  const scrollValue = window.scrollY * 0.15;
  heroMedia.style.transform = `scale(1.08) translateY(${scrollValue}px)`;
}

function revealOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach((section) => observer.observe(section));
}

function animateCounters() {
  counters.forEach((counter) => {
    const target = Number(counter.dataset.target) || 0;
    let current = 0;
    const increment = Math.max(Math.floor(target / 70), 1);

    const update = () => {
      current += increment;
      if (current >= target) {
        counter.textContent = target.toString();
      } else {
        counter.textContent = current.toString();
        requestAnimationFrame(update);
      }
    };

    update();
  });
}

function handleScroll() {
  updateProgress();
  parallaxHero();
  const aboutSection = document.querySelector('.about-section');
  if (aboutSection && !countersAnimated) {
    const rect = aboutSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      animateCounters();
      countersAnimated = true;
    }
  }
}

window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('resize', updateProgress);

const header = document.querySelector('.site-header');
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const taglineText = document.querySelector('.tagline-text');
const magneticElements = document.querySelectorAll('.magnetic');
const tiltableCards = document.querySelectorAll('.menu-card, .review-card, .gallery-item');
const interactiveElements = document.querySelectorAll('a, button, .btn');
const taglines = ['Curated tables', 'Rich tastes', 'Timeless evenings', 'Fine culinary theatre'];
let taglineIndex = 0;
let lastScrollPosition = window.scrollY;
let activeMagnet = null;
let magnetBounds = null;
let isMobileView = window.matchMedia('(max-width: 900px)').matches;

function updateCursor(event) {
  if (!cursorDot || !cursorOutline || isMobileView) return;
  const x = `${event.clientX}px`;
  const y = `${event.clientY}px`;
  cursorDot.style.left = x;
  cursorDot.style.top = y;
  cursorOutline.style.left = x;
  cursorOutline.style.top = y;
  document.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`);
  document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`);
}

function setCursorHover(active) {
  if (!cursorOutline || isMobileView) return;
  cursorOutline.style.width = active ? '78px' : '60px';
  cursorOutline.style.height = active ? '78px' : '60px';
  cursorOutline.style.opacity = active ? '0.8' : '1';
}

function createRipple(event) {
  const target = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(target.clientWidth, target.clientHeight);
  const radius = diameter / 2;
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - target.getBoundingClientRect().left - radius}px`;
  circle.style.top = `${event.clientY - target.getBoundingClientRect().top - radius}px`;
  circle.className = 'ripple';
  target.appendChild(circle);
  setTimeout(() => circle.remove(), 700);
}

function handleMagnetMove(event) {
  if (!activeMagnet || !magnetBounds) return;
  const x = event.clientX - (magnetBounds.left + magnetBounds.width / 2);
  const y = event.clientY - (magnetBounds.top + magnetBounds.height / 2);
  activeMagnet.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.03)`;
}

function resetMagnet() {
  if (!activeMagnet) return;
  activeMagnet.style.transform = '';
  activeMagnet = null;
  magnetBounds = null;
}

function rotateTagline() {
  if (!taglineText) return;
  taglineIndex = (taglineIndex + 1) % taglines.length;
  taglineText.style.opacity = '0';
  setTimeout(() => {
    taglineText.textContent = taglines[taglineIndex];
    taglineText.style.opacity = '1';
  }, 280);
}

function updateHeader() {
  const currentScroll = window.scrollY;
  if (!header) return;
  if (currentScroll > lastScrollPosition + 15 && currentScroll > 120) {
    header.classList.add('hidden');
  } else if (currentScroll < lastScrollPosition - 15 || currentScroll < 120) {
    header.classList.remove('hidden');
  }
  lastScrollPosition = currentScroll;
}

function applyTilt(card, event) {
  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
  const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
  card.style.transform = `perspective(900px) rotateX(${y * 6}deg) rotateY(${x * 6}deg) translateZ(4px)`;
}

function resetTilt(card) {
  card.style.transform = '';
}

interactiveElements.forEach((element) => {
  element.addEventListener('mouseenter', () => setCursorHover(true));
  element.addEventListener('mouseleave', () => setCursorHover(false));
  element.addEventListener('click', createRipple);
});

magneticElements.forEach((button) => {
  button.addEventListener('mouseenter', () => {
    if (isMobileView) return;
    activeMagnet = button;
    magnetBounds = button.getBoundingClientRect();
  });
  button.addEventListener('mouseleave', () => {
    resetMagnet();
  });
});

document.addEventListener('mousemove', (event) => {
  updateCursor(event);
  handleMagnetMove(event);
});

tiltableCards.forEach((card) => {
  card.addEventListener('mousemove', (event) => applyTilt(card, event));
  card.addEventListener('mouseleave', () => resetTilt(card));
});

setInterval(rotateTagline, 4500);

function handleScroll() {
  updateProgress();
  parallaxHero();
  updateHeader();
  const aboutSection = document.querySelector('.about-section');
  if (aboutSection && !countersAnimated) {
    const rect = aboutSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      animateCounters();
      countersAnimated = true;
    }
  }
}

window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('resize', () => {
  updateProgress();
  isMobileView = window.matchMedia('(max-width: 900px)').matches;
  if (isMobileView) {
    cursorDot?.setAttribute('style', 'display: none');
    cursorOutline?.setAttribute('style', 'display: none');
  } else {
    cursorDot?.removeAttribute('style');
    cursorOutline?.removeAttribute('style');
  }
});

window.addEventListener('load', () => {
  if (loader) {
    loader.style.opacity = '0';
    loader.style.pointerEvents = 'none';
    setTimeout(() => loader.remove(), 350);
  }
  revealOnScroll();
  updateProgress();
  handleScroll();
  if (isMobileView) {
    cursorDot?.setAttribute('style', 'display: none');
    cursorOutline?.setAttribute('style', 'display: none');
  }
});
