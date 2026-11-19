(() => {
  const storageKey = 'company-link-history-v1';
  const selector = '#companyList a[href], #liveJobs a[href], #linkedinSearch';
  const dayMs = 24 * 60 * 60 * 1000;
  let expiryTimer;
  let history = {};
  let persistent = true;
  function read() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
      history = saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
    } catch { persistent = false; }
  }
  function keyFor(link) {
    const url = new URL(link.href, location.href);
    url.searchParams.delete('f_TPR');
    url.hash = '';
    return url.href;
  }
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit', hour12: true
  });
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Dubai', year: 'numeric', month: '2-digit', day: '2-digit'
  });
  function dayNumber(date) {
    const parts = Object.fromEntries(dateFormatter.formatToParts(date).map(part => [part.type, part.value]));
    return Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)) / dayMs;
  }
  function timeLabel(date) {
    return formatter.formatToParts(date).filter(part => part.type === 'hour' || part.type === 'minute')
      .map(part => part.value).join(':');
  }
  function decorate(link) {
    let badge = link.nextElementSibling;
    if (!badge?.classList.contains('link-last-clicked')) {
      badge = document.createElement('small');
      badge.className = 'link-last-clicked';
      link.after(badge);
    }
    const value = history[keyFor(link)];
    const date = typeof value === 'string' ? new Date(value) : null;
    const valid = date && Number.isFinite(date.getTime());
    const daysAgo = valid ? Math.max(0, dayNumber(new Date()) - dayNumber(date)) : 0;
    badge.textContent = valid
      ? 'Last clicked: ' + (daysAgo === 0 ? 'Recently' : daysAgo + (daysAgo === 1 ? ' day ago' : ' days ago')) +
        ' · ' + timeLabel(date) + (persistent ? '' : ' (this session)')
      : 'Not clicked yet';
    badge.title = (valid ? 'Last clicked: ' + dateFormatter.format(date) + ', ' + timeLabel(date) + '. ' : '') +
      'Saved in this browser. Records link clicks; does not confirm the destination loaded.';
  }
  function refresh() {
    clearTimeout(expiryTimer);
    const now = Date.now();
    let nextExpiry = Infinity;
    let changed = false;
    Object.entries(history).forEach(([key, value]) => {
      const clickedAt = typeof value === 'string' ? Date.parse(value) : NaN;
      if (!Number.isFinite(clickedAt)) {
        delete history[key];
        changed = true;
      } else {
        // Dubai stays at UTC+4; update the day label at local midnight.
        const remaining = dayMs - ((now + 4 * 60 * 60 * 1000) % dayMs);
        nextExpiry = Math.min(nextExpiry, remaining);
      }
    });
    if (changed) {
      try { localStorage.setItem(storageKey, JSON.stringify(history)); }
      catch { persistent = false; }
    }
    document.querySelectorAll(selector).forEach(decorate);
    if (Number.isFinite(nextExpiry)) expiryTimer = setTimeout(refresh, Math.min(nextExpiry, dayMs));
  }
  function record(event) {
    if (event.type === 'auxclick' && event.button !== 1) return;
    const link = event.target.closest?.(selector);
    if (!link) return;
    read();
    history[keyFor(link)] = new Date().toISOString();
    try { localStorage.setItem(storageKey, JSON.stringify(history)); persistent = true; }
    catch { persistent = false; }
    refresh();
  }
  read();
  refresh();
  document.addEventListener('click', record);
  document.addEventListener('auxclick', record);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) { read(); refresh(); }
  });
  window.addEventListener('focus', () => { read(); refresh(); });
  new MutationObserver(records => {
    if (records.some(record => record.type === 'attributes' || [...record.addedNodes].some(node =>
      node.nodeType === 1 && (node.matches('a[href]') || node.querySelector('a[href]'))))) refresh();
  }).observe(document.querySelector('main'), { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] });
  window.addEventListener('storage', event => {
    if (event.key === storageKey || event.key === null) { read(); refresh(); }
  });
})();
