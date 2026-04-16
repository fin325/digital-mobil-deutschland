/* === magnet.js — Geomagnetische Aktivität (NOAA) === */

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
        const res = await fetch(
            'https://services.swpc.noaa.gov/json/planetary_k_index_1m.json'
        );
        const data = await res.json();

        const kp = data[data.length - 1].kp_index;

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

    const rounded = Math.round(kp);
    el.innerText = rounded;

    let color;
    if (rounded <= 2)      color = '#2ecc71';
    else if (rounded <= 4) color = '#f1c40f';
    else if (rounded <= 6) color = '#e67e22';
    else                   color = '#e74c3c';

    el.style.color = color;
    el.style.fontWeight = 'bold';
}

// Start
getGeomagneticActivity();
