'use strict';

const REDUCED   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const HAS_HOVER = window.matchMedia('(hover: hover)').matches;
const isMobile  = () => window.innerWidth <= 768;

/* ─── Elements ─────────────────────────────── */
const progressBar = document.getElementById('progressBar');
const backToTop   = document.getElementById('backToTop');
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('navLinks');

/* ─── Back to top ──────────────────────────── */
if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ─── Mobile menu ──────────────────────────── */
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  }));
}

/* ─── Scroll handler ───────────────────────── */
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', () => {
  const s     = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = `${(s / total) * 100}%`;
  if (navbar)      navbar.classList.toggle('scrolled', s > 60);
  if (backToTop)   backToTop.classList.toggle('visible', s > 400);
  if (!REDUCED && !isMobile() && heroBg) {
    heroBg.style.transform = `translateY(${s * 0.35}px)`;
  }
}, { passive: true });

/* ─── Reveal observer ──────────────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-visible');
    revealObs.unobserve(e.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });
document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

/* ─── Counter animation ────────────────────── */
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function animateCounter(el) {
  const target = parseInt(el.dataset.counter, 10);
  const start  = performance.now();
  const dur    = 1800;
  (function step(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(easeOutCubic(p) * target);
    if (p < 1) requestAnimationFrame(step);
  })(start);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    animateCounter(e.target);
    counterObs.unobserve(e.target);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-counter]').forEach(el => counterObs.observe(el));

/* ════════════════════════════════════════════
   EFEITOS IMPRESSIONANTES
   ════════════════════════════════════════════ */
if (!REDUCED) {

  /* ── 1. CURSOR DOURADO COM TRAIL ─────────── */
  if (HAS_HOVER) {
    document.body.classList.add('has-cursor');

    const cursorDot  = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    const cursorRing = document.createElement('div');
    cursorRing.className = 'cursor-ring';

    const TRAIL_N = 12;
    const trailDots = Array.from({ length: TRAIL_N }, () => {
      const d = document.createElement('div');
      d.className = 'cursor-trail';
      document.body.appendChild(d);
      return d;
    });
    document.body.append(cursorDot, cursorRing);

    let mx = -300, my = -300, rx = -300, ry = -300;
    const history = Array.from({ length: TRAIL_N }, () => ({ x: -300, y: -300 }));

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

    document.querySelectorAll('a, button, .feature-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('big'); cursorRing.classList.add('big');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('big'); cursorRing.classList.remove('big');
      });
    });

    (function animateCursor() {
      requestAnimationFrame(animateCursor);
      cursorDot.style.transform  = `translate3d(${mx - 6}px,${my - 6}px,0)`;
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      cursorRing.style.transform = `translate3d(${rx - 20}px,${ry - 20}px,0)`;
      history.unshift({ x: mx, y: my });
      history.length = TRAIL_N;
      trailDots.forEach((dot, i) => {
        const pos   = history[Math.min(i * 2, TRAIL_N - 1)];
        const scale = (TRAIL_N - i) / TRAIL_N;
        dot.style.transform = `translate3d(${pos.x - 4}px,${pos.y - 4}px,0) scale(${scale * 0.65})`;
        dot.style.opacity   = (scale * 0.4).toString();
      });
    })();
  }

  /* ── 2. CAMPO DE PARTÍCULAS NO HERO ─────── */
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:0;';
    heroSection.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const COLORS = [
      'rgba(255,215,0,', 'rgba(255,215,0,', 'rgba(255,184,0,',
      'rgba(26,71,42,',  'rgba(80,160,80,', 'rgba(255,255,255,',
    ];

    let W = 0, H = 0;
    const resize = () => {
      W = canvas.width  = heroSection.offsetWidth;
      H = canvas.height = heroSection.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * (W || 1200),
      y: Math.random() * (H || 700),
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55,
      size: Math.random() * 1.8 + 0.6,
      color: COLORS[~~(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.45 + 0.12,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.008 + Math.random() * 0.018,
    }));

    let pmx = 9999, pmy = 9999;
    heroSection.addEventListener('mousemove', e => {
      const r = heroSection.getBoundingClientRect();
      pmx = e.clientX - r.left;
      pmy = e.clientY - r.top;
    }, { passive: true });
    heroSection.addEventListener('mouseleave', () => { pmx = 9999; pmy = 9999; });

    (function drawParticles() {
      requestAnimationFrame(drawParticles);
      ctx.clearRect(0, 0, W, H);

      particles.forEach((p, i) => {
        const dx   = p.x - pmx, dy = p.y - pmy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130 && dist > 0) {
          const force = (130 - dist) / 130 * 0.9;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > 1.6) { p.vx = (p.vx / spd) * 1.6; p.vy = (p.vy / spd) * 1.6; }
        p.vx *= 0.985; p.vy *= 0.985;
        p.x += p.vx; p.y += p.vy;
        p.pulse += p.pulseSpeed;
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        const a = p.alpha * (0.55 + 0.45 * Math.sin(p.pulse));
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
        grd.addColorStop(0, `${p.color}${a})`);
        grd.addColorStop(1, `${p.color}0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.min(a * 2.2, 0.95)})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const ddx = p.x - q.x, ddy = p.y - q.y;
          const dd  = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dd < 95) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(255,215,0,${(1 - dd / 95) * 0.07})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      });
    })();
  }

  /* ── 3. SPORTS TICKER ────────────────────── */
  const hero = document.querySelector('.hero');
  if (hero) {
    const ITEMS = [
      '🏆 Copa do Mundo 2026', '🇧🇷 Brasil 3–0 Japão', '🇦🇷 Argentina 2–1 Polônia',
      '🇫🇷 França 1–1 Espanha', '🇩🇪 Alemanha 4–2 Austrália', '🇵🇹 Portugal 2–0 Gana',
      '🇺🇸 EUA 1–0 México', '🏟️ 16 Estádios · 3 Países · 48 Seleções',
      '🇲🇦 Marrocos 1–2 Croácia', '🇬🇧 Inglaterra 3–1 Senegal',
      '⚽ 80 Jogos · Copa do Mundo 2026', '🇳🇱 Holanda 2–0 Equador',
      '🥇 Quem será o campeão?', '📲 Acompanhe tudo no Calm Cup',
    ];
    const text = ITEMS.join('  •  ');
    const wrap = document.createElement('div');
    wrap.className = 'ticker-wrap';
    wrap.innerHTML = `<div class="ticker-inner"><span>${text}  •  ${text}  •  </span></div>`;
    hero.appendChild(wrap);
  }

  /* ── 4. 3D CARD TILT ─────────────────────── */
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 2 - 1;
      const y = ((e.clientY - r.top) / r.height) * 2 - 1;
      card.style.transition = 'box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease';
      card.style.transform  = `perspective(900px) rotateX(${-y * 11}deg) rotateY(${x * 11}deg) translateZ(16px) translateY(-6px)`;
      card.style.setProperty('--mx', `${((x + 1) / 2) * 100}%`);
      card.style.setProperty('--my', `${((y + 1) / 2) * 100}%`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'all 0.65s var(--ease-out)';
      card.style.transform  = '';
    });
  });

  /* ── 5. BOTÕES MAGNÉTICOS ────────────────── */
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = e.clientX - r.left - r.width / 2;
      const dy = e.clientY - r.top  - r.height / 2;
      btn.style.transition = 'background 0.15s ease, box-shadow 0.15s ease';
      btn.style.transform  = `translate(${dx * 0.3}px, ${dy * 0.3}px) translateY(-3px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'all 0.55s var(--ease-out)';
      btn.style.transform  = '';
    });
  });

  /* ── 6. CONFETTI AO CLICAR EM BAIXAR ─────── */
  const CONF_COLORS = ['#FFD700','#FFE84D','#ffffff','#1A472A','#2ecc71','#FFA500','#c0392b'];

  function burst(ox, oy) {
    for (let i = 0; i < 120; i++) {
      const el   = document.createElement('span');
      const size = Math.random() * 9 + 3;
      const circ = Math.random() > 0.45;
      el.style.cssText = [
        `position:fixed`,
        `left:${ox}px`, `top:${oy}px`,
        `width:${size}px`,
        `height:${size * (circ ? 1 : 0.35 + Math.random())}px`,
        `background:${CONF_COLORS[~~(Math.random() * CONF_COLORS.length)]}`,
        `border-radius:${circ ? '50%' : '2px'}`,
        `pointer-events:none`,
        `z-index:99999`,
      ].join(';');
      document.body.appendChild(el);

      const vx = (Math.random() - 0.5) * 24;
      const vy = Math.random() * -22 - 7;
      let px = 0, py = 0, angle = Math.random() * 360, velY = vy;
      const spin = (Math.random() - 0.5) * 20;

      const tick = () => {
        velY += 0.55; px += vx; py += velY; angle += spin;
        el.style.transform = `translate(${px}px,${py}px) rotate(${angle}deg)`;
        el.style.opacity   = Math.max(0, 1 - py / 400).toString();
        if (py < 600 && +el.style.opacity > 0.01) requestAnimationFrame(tick);
        else el.remove();
      };
      setTimeout(() => requestAnimationFrame(tick), Math.random() * 130);
    }
  }

  document.querySelectorAll('a[href*="PLAY_STORE"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const r = btn.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2);
    });
  });

} /* end !REDUCED */

/* ─── Init ─────────────────────────────────── */
if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
