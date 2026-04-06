/* === main.js — Инициализация === */

document.addEventListener('DOMContentLoaded', () => {
    initClock();   // clock.js
    getWeather();  // weather.js
    loadNews();    // news.js

    // === НОВЫЙ КОД: Автоматическое открытие вкладки по ссылке (Hash) ===
    const hash = window.location.hash.replace('#', ''); 
    if (hash) {
        const targetButton = document.querySelector(`button[onclick*="'${hash}'"]`);
        if (targetButton) {
            // 1. Запускаем функцию переключения вкладки
            showTab(hash, { currentTarget: targetButton, preventDefault: () => {} });
            
            // 2. ИСПРАВЛЕНИЕ: Поднимаем экран вверх И прокручиваем меню к кнопке
            setTimeout(() => {
                // Поднимаем саму страницу в самый верх
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                
                // ПРОКРУЧИВАЕМ МЕНЮ: центрируем активную кнопку в видимой зоне
                targetButton.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }, 50); // Даем браузеру 50мс на отрисовку
            
            // 3. Очищаем ссылку от #id, чтобы она стала просто index.html
            history.replaceState(null, null, window.location.pathname);
        }
    }
});

// Фоновый пинг для пробуждения Render-приложения при загрузке сайта
fetch('https://ВАШ_АДРЕС_НА_RENDER.onrender.com/wakeup', { mode: 'no-cors' })
  .catch(() => {});
