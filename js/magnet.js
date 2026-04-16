/* === magnet.js — Geomagnetische Aktivität (GFZ Potsdam) === */
document.getElementById('geo').innerText = 'TEST';
const MAGNET_CACHE_TTL = 30 * 60 * 1000; // 30 Minuten

async function getGeomagneticActivity() {
    try {
        // Кэш
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
        // Берём данные за последние 24 часа
        const now = new Date();
        const start = new Date(now - 24 * 60 * 60 * 1000);

        const startStr = start.toISOString().slice(0, 19) + 'Z';
        const endStr   = now.toISOString().slice(0, 19) + 'Z';

        const res = await fetch(
            `https://kp.gfz.de/app/json/?start=${startStr}&end=${endStr}&index=Kp`
        );
        const data = await res.json();

        // Берём последнее доступное значение
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

    // Kp 0-9 → показываем округлённое значение
    const rounded = Math.round(kp);
    el.innerText = rounded;

    // Цвет по уровню активности
    let color;
    if (rounded <= 2)      color = '#2ecc71'; // спокойно
    else if (rounded <= 4) color = '#f1c40f'; // умеренно
    else if (rounded <= 6) color = '#e67e22'; // активно
    else                   color = '#e74c3c'; // буря

    el.style.color = color;
    el.style.fontWeight = 'bold';
}

// Start
getGeomagneticActivity();
