/* === main.js — Инициализация === */

document.addEventListener('DOMContentLoaded', () => {
    initClock();   // clock.js
    getWeather();  // weather.js
    loadNews();    // news.js
    
    // === Инициализация видео-заглушек (решение в два клика) ===
    initVideoPlaceholders();

    // === Автоматическое открытие вкладки по ссылке (Hash) ===
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

/* === Логика YouTube (Заглушки и Iframe) === */

// Основная функция для трансформации заглушки в iframe
function loadEmbeddedContent(targetElement) {
    const container = targetElement.closest('.video-container');
    const videoId = container.getAttribute('data-video-id');
    const playlistId = container.getAttribute('data-playlist-id');

    // Если элемент больше не заглушка или нет нужных ID, выходим
    if (!targetElement.classList.contains('video-placeholder') || (!videoId && !playlistId)) return;

    // Показываем состояние загрузки
    targetElement.classList.add('is-loading');
    const playBtn = targetElement.querySelector('.play-button');
    const spinner = targetElement.querySelector('.loading-spinner');
    if (playBtn) playBtn.style.display = 'none';
    if (spinner) spinner.style.display = 'block';

    // Формируем ссылку в зависимости от типа (одиночное видео или плейлист)
    let src = '';
    if (videoId) {
        src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
    } else if (playlistId) {
        src = `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&autoplay=1`;
    }

    const iframeHTML = `
        <iframe 
            width="100%" 
            height="100%" 
            style="position: absolute; top: 0; left: 0;" 
            src="${src}" 
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen>
        </iframe>
    `;
    
    // Меняем HTML-содержимое заглушки на сам Iframe, 
    // убираем класс placeholder, чтобы повторные клики не ломали плеер
    targetElement.innerHTML = iframeHTML;
    targetElement.classList.remove('video-placeholder');
}

// Функция для добавления обработчиков клика по всем заглушкам
function initVideoPlaceholders() {
    const placeholders = document.querySelectorAll('.video-loading-target');
    
    placeholders.forEach(function(placeholder) {
        placeholder.addEventListener('click', function() {
            // Клик пользователя по заглушке — это явное согласие для этого конкретного видео
            loadEmbeddedContent(this);
        });
    });
}
