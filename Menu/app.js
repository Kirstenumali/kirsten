(() => {
  const key = 'main-menu-clicks-v1';
  const dayMs = 86400000;
  const parts = date => Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Dubai', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(date).map(part => [part.type, part.value]));
  const day = date => { const p = parts(date); return Date.UTC(+p.year, +p.month - 1, +p.day) / dayMs; };
  function read() { try { const value = JSON.parse(localStorage.getItem(key) || '{}'); return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; } catch { return {}; } }
  let history = read();
  function refresh() {
    document.querySelectorAll('[data-project]').forEach(link => {
      const value = history[link.dataset.project];
      const date = new Date(typeof value === 'string' ? value : NaN);
      const label = link.querySelector('[data-last-clicked]');
      if (!Number.isFinite(date.getTime())) { label.textContent = 'Not clicked yet'; return; }
      const age = Math.max(0, day(new Date()) - day(date));
      const p = parts(date);
      label.textContent = 'Last clicked: ' + (age === 0 ? 'Today' : age === 1 ? 'Yesterday' : age <= 30 ? `${age} days ago` : `${p.day}-${p.month}-${p.year}`);
      label.title = `${p.day}-${p.month}-${p.year}`;
    });
  }
  
  function record(event) {
    if (event.type === 'auxclick' && event.button !== 1) return;
    const link = event.target.closest('[data-project]');
    if (!link) return;
    history = { ...read(), ...history, [link.dataset.project]: new Date().toISOString() };
    try { localStorage.setItem(key, JSON.stringify(history)); } catch { /* Keep session history when storage is unavailable. */ }
    refresh();
  }
  document.addEventListener('click', record);
  document.addEventListener('auxclick', record);
  window.addEventListener('storage', () => { history = read(); refresh(); });
  window.addEventListener('pageshow', () => { history = { ...history, ...read() }; refresh(); });
  setInterval(refresh, 60000);
  refresh();
})();
