// DisplayMovie · landing page · interactions

// Resolve live DMG URL + version from the latest GitHub release.
// Silent on 404 (no release yet) — falls through to the default release-page link.
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
      if (!dmg || !dmg.browser_download_url) return;
      btn.href = dmg.browser_download_url;
      const v = document.getElementById('dl-version');
      if (v && data.tag_name) {
        v.textContent = `${data.tag_name} · Apple Silicon · ${(dmg.size / 1024 / 1024).toFixed(1)} MB`;
      }
    })
    .catch(() => { /* keep fallback href */ });
})();
