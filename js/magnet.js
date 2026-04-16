async function getGeomagneticActivity() {
    try {
        const now = new Date();
        const start = new Date(now - 24 * 60 * 60 * 1000);
        const startStr = start.toISOString().slice(0, 19) + 'Z';
        const endStr   = now.toISOString().slice(0, 19) + 'Z';

        const res = await fetch(
            `https://kp.gfz.de/app/json/?start=${startStr}&end=${endStr}&index=Kp`
        );
        const data = await res.json();
        const values = data.Kp;

        const el = document.getElementById('geo');
        if (!el) {
            alert('geo element NOT FOUND');
            return;
        }
        if (!values || values.length === 0) {
            alert('Kp values EMPTY');
            return;
        }
        el.innerText = values[values.length - 1];

    } catch (e) {
        alert('ERROR: ' + e.message);
    }
}

getGeomagneticActivity();
