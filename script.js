/* My Cat Died — interactions (Vanilla JS) */
(function () {
  'use strict';

  // ---- Year ----
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Nav scroll state ----
  var nav = document.getElementById('nav');
  var onScroll = function () {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Mobile menu ----
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');

  function closeMenu() {
    if (!toggle || !menu) return;
    toggle.classList.remove('open');
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  }
  function openMenu() {
    if (!toggle || !menu) return;
    toggle.classList.add('open');
    menu.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      if (menu.classList.contains('open')) closeMenu();
      else openMenu();
    });
    // Close on any link click
    var mobileLinks = menu.querySelectorAll('a');
    mobileLinks.forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    // Close on escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
    // Close if viewport grows past mobile
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  // ---- Smooth scroll offset (compensate for fixed nav) ----
  var anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var navHeight = nav ? nav.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // ---- Form submit via fetch (Formspree) ----
  var form = document.querySelector('.submit-form');
  var note = document.getElementById('formNote');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (note) { note.textContent = 'Sending…'; note.classList.remove('error'); }

      var data = new FormData(form);
      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      })
      .then(function (res) {
        if (res.ok) {
          form.reset();
          if (note) note.textContent = 'Thank you — your thought has been sent.';
        } else {
          res.json().then(function (d) {
            if (note) {
              note.textContent = (d && d.errors && d.errors.map(function (x) { return x.message; }).join(', ')) || 'Something went wrong. Try again.';
              note.classList.add('error');
            }
          }).catch(function () {
            if (note) { note.textContent = 'Something went wrong. Try again.'; note.classList.add('error'); }
          });
        }
      })
      .catch(function () {
        if (note) { note.textContent = 'Network error. Please try again.'; note.classList.add('error'); }
      });
    });
  }

  // ---- Ensure video autoplay on mobile (iOS) ----
  var heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    heroVideo.setAttribute('muted', '');
    heroVideo.muted = true;
    var tryPlay = heroVideo.play();
    if (tryPlay && typeof tryPlay.catch === 'function') {
      tryPlay.catch(function () { /* autoplay blocked — video will remain on first frame */ });
    }
  }
})();
