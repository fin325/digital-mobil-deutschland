/* === main.js — Инициализация === */

document.addEventListener('DOMContentLoaded', () => {
    initClock();   // clock.js
    getWeather();  // weather.js

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
    if (placeholder && iframe && !iframe.dataset.loaded) {
        iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
        iframe.style.display = "block";
        iframe.dataset.loaded = 'true';
        placeholder.style.display = "none";
    }
}

function loadPlaylist(placeholderId, iframeId, listId) {
    const placeholder = document.getElementById(placeholderId);
    const iframe = document.getElementById(iframeId);
    if (placeholder && iframe && !iframe.dataset.loaded) {
        iframe.src = `https://www.youtube-nocookie.com/embed/videoseries?list=${listId}&rel=0`;
        iframe.style.display = "block";
        iframe.dataset.loaded = 'true';
        placeholder.style.display = "none";
    }
}

// === Управление видимостью иконки куки при скролле ===
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

// Фикс прыгающего вьюпорта в Telegram на iOS
const fixIosViewport = () => {
  if (window.visualViewport) {
    const scrollHandler = () => {
      // Если вьюпорт сместился (offsetTop > 0), принудительно возвращаем
      if (window.visualViewport.offsetTop > 0) {
        window.scrollTo(0, 0);
      }
    };

    window.visualViewport.addEventListener('scroll', scrollHandler);
    window.visualViewport.addEventListener('resize', scrollHandler);
  }
};

// Запускаем, когда DOM готов
document.addEventListener('DOMContentLoaded', fixIosViewport);

// Service Worker для кэширования видео
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((reg) => console.log('SW зарегистрирован:', reg.scope))
      .catch((err) => console.log('SW ошибка:', err));
  });
}

