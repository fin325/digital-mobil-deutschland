/* === main.js — Инициализация === */

document.addEventListener('DOMContentLoaded', () => {
    initClock();   // clock.js
    getWeather();  // weather.js
    loadNews();    // news.js
});

// Фоновый пинг для пробуждения Render-приложения при загрузке сайта
fetch('https://ВАШ_АДРЕС_НА_RENDER.onrender.com/wakeup', { mode: 'no-cors' })
  .catch(() => {});

// ... дальше идет ваш обычный код из main.js ...