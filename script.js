/* ============================================================
   Calm Cup — site
   ------------------------------------------------------------
   Só o necessário: menu, barra de progresso, voltar ao topo e
   revelação ao rolar. Os efeitos decorativos do site antigo
   (cursor dourado, partículas, tilt 3D, confetti, ticker de
   placares fixos da Copa) saíram no redesign — o app não tem
   nada disso, e o site deve parecer o app.
   ============================================================ */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Menu mobile ─────────────────────────────────────────── */
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });

    // Fecha ao navegar para uma âncora
    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Fecha com Esc
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.focus();
      }
    });
  }

  /* ── Barra de progresso + botão voltar ao topo ───────────── */
  var progressBar = document.getElementById('progressBar');
  var backToTop = document.getElementById('backToTop');
  var ticking = false;

  function onScroll() {
    var top = window.scrollY || document.documentElement.scrollTop;

    if (progressBar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (max > 0 ? (top / max) * 100 : 0) + '%';
    }
    if (backToTop) {
      backToTop.classList.toggle('show', top > 500);
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ── Revelação ao rolar ──────────────────────────────────── */
  var revealables = document.querySelectorAll('[data-reveal]');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    // Sem animação: mostra tudo de uma vez, nunca deixa conteúdo invisível.
    revealables.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // Escalona levemente os itens que entram juntos, pra lista não
        // aparecer toda de uma vez.
        setTimeout(function () { el.classList.add('visible'); }, i * 60);
        observer.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealables.forEach(function (el) { observer.observe(el); });

    // Rede de segurança: se por qualquer motivo o observer não disparar
    // (aba em segundo plano na carga, layout que muda depois, captura
    // automatizada que não rola a página), nada pode ficar invisível pra
    // sempre. Passados 3s, revela o que ainda estiver escondido.
    setTimeout(function () {
      revealables.forEach(function (el) { el.classList.add('visible'); });
    }, 3000);
  }

  /* ── Ano no rodapé ───────────────────────────────────────── */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
