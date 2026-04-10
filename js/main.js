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
            showTab(hash, { currentTarget: targetButton, preventDefault: () => {} });
            
            setTimeout(() => {
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                targetButton.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }, 50); 
            
            history.replaceState(null, null, window.location.pathname);
        }
    }
});

// Фоновый пинг для пробуждения Render-приложения при загрузке сайта
fetch('https://ВАШ_АДРЕС_НА_RENDER.onrender.com/wakeup', { mode: 'no-cors' })
  .catch(() => {});

// === Функции загрузки YouTube ===

function loadVideo(placeholderId, iframeId, videoId) {
    alert('loadVideo вызван: ' + iframeId + ' / ' + videoId);
    const placeholder = document.getElementById(placeholderId);
    const iframe = document.getElementById(iframeId);
    if (placeholder && iframe) {
        iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
        iframe.style.display = "block";
        placeholder.style.display = "none";
    }
}

function loadPlaylist(placeholderId, iframeId, listId) {
    alert('loadPlaylist вызван: ' + iframeId + ' / ' + listId);
    const placeholder = document.getElementById(placeholderId);
    const iframe = document.getElementById(iframeId);
    if (placeholder && iframe) {
        iframe.src = `https://www.youtube-nocookie.com/embed/videoseries?list=${listId}&autoplay=1&rel=0`;
        iframe.style.display = "block";
        placeholder.style.display = "none";
    }
}

window.addEventListener('scroll', () => {
    const icon = document.getElementById('silktide-cookie-icon');
    if (!icon) return;
    if (window.scrollY > 0) {
        icon.style.setProperty('opacity', '0', 'important');
        icon.style.setProperty('pointer-events', 'none', 'important');
    } else {
        icon.style.setProperty('opacity', '1', 'important');
        icon.style.setProperty('pointer-events', 'auto', 'important');
    }
});
