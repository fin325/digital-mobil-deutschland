/* === main.js — Инициализация === */

document.addEventListener('DOMContentLoaded', () => {
    initClock();   // clock.js
    getWeather();  // weather.js
    loadNews();    // news.js

    // === Автоматическое открытие вкладки по ссылке (Hash) ===
    const hash = window.location.hash.replace('#', ''); 
    if (hash) {
        const targetButton = document.querySelector(`button[onclick*="'${hash}'"]`);
        if (targetButton) {
            // 1. Запускаем функцию переключения вкладки
            showTab(hash, { currentTarget: targetButton, preventDefault: () => {} });
            
            // 2. Поднимаем экран вверх И прокручиваем меню к кнопке
            setTimeout(() => {
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                targetButton.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }, 50); 
            
            // 3. Очищаем ссылку от #id
            history.replaceState(null, null, window.location.pathname);
        }
    }
});

// Фоновый пинг для пробуждения Render-приложения при загрузке сайта
fetch('https://ВАШ_АДРЕС_НА_RENDER.onrender.com/wakeup', { mode: 'no-cors' })
  .catch(() => {});

// === Функции загрузки YouTube (замена заглушки на iframe) ===

function loadVideo(el, id) {
    el.innerHTML = `
        <iframe 
            style="position:absolute; top:0; left:0; width:100%; height:100%;"
            src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" 
            title="YouTube video" 
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
        </iframe>
    `;
    // Сбрасываем курсор и фон, так как это уже плеер
    el.style.cursor = 'default';
    el.style.background = 'transparent';
    // Убираем onclick, чтобы повторный клик не перезагружал видео
    el.onclick = null; 
}

function loadPlaylist(el, listId) {
    el.innerHTML = `
        <iframe 
            style="position:absolute; top:0; left:0; width:100%; height:100%;"
            src="https://www.youtube-nocookie.com/embed/videoseries?list=${listId}&autoplay=1&rel=0" 
            title="Мой плейлист" 
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
        </iframe>
    `;
    el.style.cursor = 'default';
    el.style.background = 'transparent';
    el.onclick = null;
}

window.addEventListener('scroll', () => {
    const icon = document.getElementById('silktide-cookie-icon');
    if (!icon) return;
    if (window.scrollY > 80) {
        icon.style.opacity = '0';
        icon.style.pointerEvents = 'none';
    } else {
        icon.style.opacity = '1';
        icon.style.pointerEvents = 'auto';
    }
});

