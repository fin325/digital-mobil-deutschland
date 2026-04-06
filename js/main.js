/* === main.js — Инициализация === */

document.addEventListener('DOMContentLoaded', () => {
    initClock();   // clock.js
    getWeather();  // weather.js
    loadNews();    // news.js

    // === НОВЫЙ КОД: Автоматическое открытие вкладки по ссылке (Hash) ===
    const hash = window.location.hash.replace('#', ''); // Получаем ID из ссылки
    if (hash) {
        // Ищем кнопку в меню, которая отвечает за эту вкладку
        const targetButton = document.querySelector(`button[onclick*="'${hash}'"]`);
        if (targetButton) {
            // Запускаем вашу функцию переключения
            showTab(hash, { currentTarget: targetButton, preventDefault: () => {} });
        }
    }
});

// Фоновый пинг для пробуждения Render-приложения при загрузке сайта
fetch('https://ВАШ_АДРЕС_НА_RENDER.onrender.com/wakeup', { mode: 'no-cors' })
  .catch(() => {});

// ... дальше идет ваш остальной код из main.js ...
