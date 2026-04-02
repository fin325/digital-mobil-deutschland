/* === clock.js — Дата и время === */

function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const timeElement = document.getElementById('current-time');
    if (timeElement) timeElement.innerText = timeStr;
}

function initClock() {
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        const options = { day: 'numeric', month: 'long' };
        dateEl.innerText = new Date().toLocaleDateString('de-DE', options).replace('.', '');
    }
    updateClock();
    setInterval(updateClock, 1000);
}
