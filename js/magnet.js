/* === magnet.js — Geomagnetische Aktivität via eigenen Proxy === */

async function getGeomagneticActivity() {
    // Если данные уже есть в sessionStorage — используем их без запроса
    try {
        const cached = sessionStorage.getItem('magnetData');
        if (cached) {
            const { kp_index } = JSON.parse(cached);
            if (typeof kp_index === 'number') {
                applyMagnetData(kp_index);
                return;
            }
        }
    } catch (e) {}

    try {
        const res = await fetch('/api/magnet');
        const data = await res.json();

        if (typeof data.kp_index !== 'number') {
            console.error('Fehler Geomagnetik:', data);
            return;
        }

        // Сохраняем для других вкладок в рамках сессии — только при согласии
        if (window.canSaveToStorage && window.canSaveToStorage()) {
            try {
                sessionStorage.setItem('magnetData', JSON.stringify({ kp_index: data.kp_index }));
            } catch (e) {}
        }

        applyMagnetData(data.kp_index);

    } catch (e) {
        console.error('Fehler Geomagnetik:', e);
    }
}

function applyMagnetData(kp) {
    const el = document.getElementById('geo');
    if (!el) return;

    const value = Math.round(kp * 10) / 10;
    el.innerText = value;

    let color;
    if (kp <= 2)      color = '#2ecc71';
    else if (kp <= 4) color = '#f1c40f';
    else if (kp <= 6) color = '#e67e22';
    else              color = '#e74c3c';

    el.style.color = color;
    el.style.fontWeight = 'bold';
}

// Экспорт в глобал — чтобы cookie-consent.js мог перезапустить запрос после согласия
window.getGeomagneticActivity = getGeomagneticActivity;

// Start
getGeomagneticActivity();
