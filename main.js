// DisplayMovie · landing page · v5

// ─── Theme toggle (defaults to system; manual override persists) ───
(function themeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const root = document.documentElement;
  const mq = window.matchMedia('(prefers-color-scheme: dark)');

  const currentMode = () => {
    if (root.classList.contains('dark')) return 'dark';
    if (root.classList.contains('light')) return 'light';
    return mq.matches ? 'dark' : 'light';
  };

  const setMode = (mode) => {
    root.classList.remove('dark', 'light');
    root.classList.add(mode);
    try { localStorage.setItem('theme', mode); } catch (e) {}
  };

  btn.addEventListener('click', () => {
    setMode(currentMode() === 'dark' ? 'light' : 'dark');
  });

  // If user hasn't explicitly chosen, follow the system live.
  mq.addEventListener('change', () => {
    try {
      if (!localStorage.getItem('theme')) {
        root.classList.remove('dark', 'light');
      }
    } catch (e) {}
  });
})();


(function resolveDownload() {
  const btn = document.getElementById('download-btn');
  if (!btn) return;
  fetch('https://api.github.com/repos/XploreDatum/DisplayMovie-releases/releases/latest', {
    headers: { 'Accept': 'application/vnd.github+json' },
    cache: 'no-store'
  })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (!data || !Array.isArray(data.assets)) return;
      const dmg = data.assets.find((a) => /\.dmg$/i.test(a.name));
      if (!dmg) return;
      btn.href = dmg.browser_download_url;
      const v = document.getElementById('dl-version');
      if (v && data.tag_name) {
        v.textContent = `${data.tag_name} · Apple Silicon · ${(dmg.size / 1024 / 1024).toFixed(1)} MB`;
      }
    })
    .catch(() => {});
})();
