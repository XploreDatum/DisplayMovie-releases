// DisplayMovie · landing page · v2 interactions

// ─── 1. Resolve direct DMG link from latest GitHub release (silent on 404) ───
(function resolveDownload() {
  const btn = document.getElementById('download-button');
  if (!btn) return;
  fetch('https://api.github.com/repos/XploreDatum/DisplayMovie-releases/releases/latest', {
    headers: { 'Accept': 'application/vnd.github+json' },
    cache: 'no-store'
  })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (!data || !Array.isArray(data.assets)) return;
      const dmg = data.assets.find((a) => /\.dmg$/i.test(a.name));
      if (dmg && dmg.browser_download_url) {
        btn.href = dmg.browser_download_url;
        const versionEl = document.querySelector('.dl-version');
        if (versionEl && data.tag_name) {
          versionEl.textContent = `${data.tag_name} · Apple Silicon · ${(dmg.size / 1024 / 1024).toFixed(1)} MB`;
        }
      }
    })
    .catch(() => { /* keep fallback href */ });
})();

// ─── 2. Subtle hero mockup tilt on mouse move ───
(function heroParallax() {
  const hero = document.querySelector('.hero');
  const window_ = document.querySelector('.hero-window');
  if (!hero || !window_) return;
  let raf = 0;
  hero.addEventListener('mousemove', (e) => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      window_.style.transform = `rotateY(${-2 + x * 3}deg) rotateX(${2 + y * -3}deg)`;
    });
  });
  hero.addEventListener('mouseleave', () => {
    window_.style.transform = '';
  });
})();

// ─── 3. Bento card hover glow (track mouse position for radial effect) ───
(function bentoGlow() {
  const cards = document.querySelectorAll('.bento-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
})();
