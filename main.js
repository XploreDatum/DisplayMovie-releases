// DisplayMovie · landing page · interactions

// ─── 1. Hero clock — ticks elapsed-today in mono ───────────────────────
(function heroClock() {
  const el = document.getElementById('hero-time');
  if (!el) return;
  const tick = () => {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const diff = Math.max(0, now - start);
    const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
  };
  tick();
  setInterval(tick, 1000);
})();

// ─── 2. Hero kicker counters — animate from 0 to data-target ──────────
(function counters() {
  const els = document.querySelectorAll('.counter');
  const animate = (el) => {
    const target = parseInt(el.dataset.target || '0', 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - start) / duration);
      // ease-out quint
      const eased = 1 - Math.pow(1 - p, 5);
      const v = Math.floor(target * eased);
      el.textContent = v.toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  // Trigger after hero is settled.
  setTimeout(() => els.forEach(animate), 900);
})();

// ─── 3. Reveal-on-scroll for non-hero sections ────────────────────────
(function reveal() {
  const targets = document.querySelectorAll(
    '.how .step, .big-shot .screen-frame, .feature-grid .card, .privacy-lede, .privacy-pills, .download-card, .faq details'
  );
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min(i * 60, 480)}ms`;
  });
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  targets.forEach((el) => io.observe(el));
})();

// ─── 4. Subtle parallax on hero bloom + film-strip on mouse ───────────
(function parallax() {
  const hero = document.querySelector('.hero');
  const strip = document.querySelector('.film-strip');
  const bloom1 = document.querySelector('.bloom-1');
  const bloom2 = document.querySelector('.bloom-2');
  if (!hero || !strip) return;
  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;   // -0.5..0.5
    const y = (e.clientY - r.top) / r.height - 0.5;
    strip.style.setProperty('--mx', `${x * -10}px`);
    strip.style.setProperty('--my', `${y * -10}px`);
    strip.style.transform = `rotateY(${-8 + x * 6}deg) rotateX(${2 + y * -4}deg) rotateZ(-2deg)`;
    if (bloom1) bloom1.style.transform = `translate(${x * 30}px, ${y * 20}px)`;
    if (bloom2) bloom2.style.transform = `translate(${x * -40}px, ${y * -20}px)`;
  });
  hero.addEventListener('mouseleave', () => {
    strip.style.transform = '';
    if (bloom1) bloom1.style.transform = '';
    if (bloom2) bloom2.style.transform = '';
  });
})();

// ─── 5. Resolve direct DMG link from the latest GitHub release ────────
(function resolveDownload() {
  const btn = document.getElementById('download-button');
  if (!btn) return;
  fetch('https://api.github.com/repos/XploreDatum/DisplayMovie-releases/releases/latest', {
    headers: { 'Accept': 'application/vnd.github+json' }
  })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (!data || !Array.isArray(data.assets)) return;
      const dmg = data.assets.find((a) => /\.dmg$/i.test(a.name));
      if (dmg && dmg.browser_download_url) {
        btn.href = dmg.browser_download_url;
        // Update the version chip too if present.
        const versionEl = document.querySelector('.dl-version');
        if (versionEl && data.tag_name) {
          versionEl.textContent = `${data.tag_name} · Apple Silicon · ${(dmg.size / 1024 / 1024).toFixed(1)} MB`;
        }
      }
    })
    .catch(() => { /* leave fallback href */ });
})();
