/* Calm Cup — scrollytelling engine */

const isMobile = () => window.innerWidth <= 768;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── Progress bar ────────────────────────────── */
const progressBar = document.getElementById('progressBar');
function updateProgress() {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${(scrolled / total) * 100}%`;
}

/* ─── Navbar scroll behavior ──────────────────── */
const navbar = document.getElementById('navbar');
function updateNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}

/* ─── Back to top ─────────────────────────────── */
const backToTop = document.getElementById('backToTop');
function updateBackToTop() {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── Parallax hero bg ────────────────────────── */
const heroBg = document.querySelector('.hero-bg');
function updateParallax() {
  if (!heroBg || isMobile()) return;
  heroBg.style.transform = `translateY(${window.scrollY * 0.35}px)`;
}

/* ─── Scroll handler ──────────────────────────── */
window.addEventListener('scroll', () => {
  updateProgress();
  updateNavbar();
  updateBackToTop();
  updateParallax();
}, { passive: true });

/* ─── Mobile menu ─────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

/* ─── Counter animation ───────────────────────── */
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function animateCounter(el) {
  const target   = parseInt(el.dataset.counter, 10);
  const duration = 1600;
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    el.textContent = Math.round(easeOutCubic(progress) * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ─── Intersection Observer — reveal & counters ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    animateCounter(entry.target);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

/* ─── Feature card mouse-tracking glow ───────── */
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    card.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  });
});

/* ─── Init ────────────────────────────────────── */
updateNavbar();
