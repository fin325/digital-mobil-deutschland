/* === magnet.js — Geomagnetische Aktivität via eigenen Proxy === */

async function getGeomagneticActivity() {
    try {
        const res = await fetch('/api/magnet');
        const data = await res.json();

        if (typeof data.kp_index !== 'number') {
            console.error('Fehler Geomagnetik:', data);
            return;
        }

        // NEW: Сохраняем для других вкладок в рамках сессии
        try {
            sessionStorage.setItem('magnetData', JSON.stringify({ kp_index: data.kp_index }));
        } catch (e) {}

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

// Start
getGeomagneticActivity();
