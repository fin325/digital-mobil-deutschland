/* === eur-rate.js — Курс EUR/UAH через прокси с sessionStorage === */

(async function loadEurRate() {
    const el = document.getElementById('eur-value');
    if (!el) return;

    // Если данные уже есть в sessionStorage — используем их без запроса
    try {
        const cached = sessionStorage.getItem('eurRate');
        if (cached) {
            el.textContent = cached + ' ₴';
            return;
        }
    } catch (e) {}

    try {
        const res = await fetch('/api/eur-rate');
        const data = await res.json();
        const rate = data.rate?.toFixed(2);
        if (rate) {
            el.textContent = rate + ' ₴';
            // Сохраняем для других вкладок в рамках сессии — только при согласии
            if (window.canSaveToStorage && window.canSaveToStorage()) {
                try {
                    sessionStorage.setItem('eurRate', rate);
                } catch (e) {}
            }
        }
    } catch (e) {
        el.textContent = '—';
    }
})();
