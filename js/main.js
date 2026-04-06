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
            // 1. Запускаем вашу функцию переключения
            showTab(hash, { currentTarget: targetButton, preventDefault: () => {} });
            
            // 2. ИСПРАВЛЕНИЕ: Принудительно возвращаем экран в самый верх
            setTimeout(() => {
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }, 10); // Небольшая задержка, чтобы браузер успел отрисовать вкладку
            
            // 3. Очищаем ссылку от #id, чтобы она стала просто index.html
            history.replaceState(null, null, window.location.pathname);
        }
    }
});

// Фоновый пинг для пробуждения Render-приложения при загрузке сайта
fetch('https://ВАШ_АДРЕС_НА_RENDER.onrender.com/wakeup', { mode: 'no-cors' })
  .catch(() => {});

// ... дальше идет ваш остальной код из main.js ...
