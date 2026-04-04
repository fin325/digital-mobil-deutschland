/* === main.js — Инициализация === */

document.addEventListener('DOMContentLoaded', () => {
    initClock();   // clock.js
    getWeather();  // weather.js
    loadNews();    // news.js
});

// Фоновый пинг для пробуждения Render-приложения при загрузке сайта
fetch('https://pdf-compressor-web.onrender.com/wakeup', { mode: 'no-cors' })
  .then(() => alert('Сигнал на Render отправлен!'))
  .catch(() => {});

// ... дальше идет ваш обычный код из main.js ...
