/* === magnet.js — Geomagnetische Aktivität (GFZ Potsdam) === */

const MAGNET_CACHE_TTL = 30 * 60 * 1000; // 30 Minuten

async function getGeomagneticActivity() {
    try {
        const cached = localStorage.getItem('magnetCache');
        if (cached) {
            const parsed = JSON.parse(cached);
            if (Date.now() - parsed.timestamp < MAGNET_CACHE_TTL) {
                applyMagnetData(parsed.kp);
                return;
            }
        }
    } catch (e) {}

    try {
        const now = new Date();
        const start = new Date(now - 24 * 60 * 60 * 1000);

        const startStr = start.toISOString().slice(0, 19) + 'Z';
        const endStr   = now.toISOString().slice(0, 19) + 'Z';

        const res = await fetch(
            `https://kp.gfz.de/app/json/?start=${startStr}&end=${endStr}&index=Kp`
        );
        const data = await res.json();

        // Kp с большой буквы!
        const values = data.Kp;
        if (!values || values.length === 0) return;

        const kp = values[values.length - 1];

        try {
            localStorage.setItem('magnetCache', JSON.stringify({
                kp,
                timestamp: Date.now()
            }));
        } catch (e) {}

        applyMagnetData(kp);

    } catch (e) {
        console.error('Fehler Geomagnetik:', e);
    }
}

function applyMagnetData(kp) {
    const el = document.getElementById('geo');
    if (!el) return;

    // GFZ даёт дробные значения — округляем до 1 знака
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
