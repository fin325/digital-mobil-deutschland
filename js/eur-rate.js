(async function loadEurRate() {
  const cacheKey = 'nbu_eur_rate';
  const cacheTime = 'nbu_eur_time';
  const TTL = 3 * 60 * 60 * 1000;

  const el = document.getElementById('eur-value');
  if (!el) return;

  const cached = localStorage.getItem(cacheKey);
  const cachedAt = parseInt(localStorage.getItem(cacheTime) || '0');
  if (cached && Date.now() - cachedAt < TTL) {
    el.textContent = cached + ' ₴';
    return;
  }

  try {
    const res = await fetch('/api/eur-rate');
    const data = await res.json();
    const rate = data.rate?.toFixed(2);
    if (rate) {
      el.textContent = rate + ' ₴';
      localStorage.setItem(cacheKey, rate);
      localStorage.setItem(cacheTime, Date.now().toString());
    }
  } catch (e) {
    el.textContent = '—';
  }
})();
