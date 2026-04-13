/* === main.js — Инициализация === */

document.addEventListener('DOMContentLoaded', () => {
    initClock();   // clock.js
    getWeather();  // weather.js
    
    // ВАЖНО: Мы убрали отсюда loadNews();
    // Теперь новости загружаются только после согласия в куки или по клику на заглушку!

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

// === Функции загрузки YouTube ===

function loadVideo(placeholderId, iframeId, videoId) {
    const placeholder = document.getElementById(placeholderId);
    const iframe = document.getElementById(iframeId);
    if (placeholder && iframe) {
        // Если грузит баннер, параметра автоплея нет. Если реальный клик человека - добавляем автоплей.
        const autoplayParam = window.isBannerAutoLoading ? '' : '&autoplay=1';
        
        iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0${autoplayParam}`;
        iframe.style.display = "block";
        placeholder.style.display = "none";
    }
}

function loadPlaylist(placeholderId, iframeId, listId) {
    const placeholder = document.getElementById(placeholderId);
    const iframe = document.getElementById(iframeId);
    if (placeholder && iframe) {
        // Если грузит баннер, параметра автоплея нет. Если реальный клик человека - добавляем автоплей.
        const autoplayParam = window.isBannerAutoLoading ? '' : '&autoplay=1';
        
        iframe.src = `https://www.youtube-nocookie.com/embed/videoseries?list=${listId}&rel=0${autoplayParam}`;
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
