/* === main.js — Инициализация === */

// === Объединённый DOMContentLoaded ===
document.addEventListener('DOMContentLoaded', () => {
    initClock();   // clock.js
    getWeather();  // weather.js

    // Восстановление таба из URL hash
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

    // Фикс прыгающего вьюпорта в Telegram на iOS
    if (window.visualViewport) {
        const scrollHandler = () => {
            if (window.visualViewport.offsetTop > 0) {
                window.scrollTo(0, 0);
            }
        };
        window.visualViewport.addEventListener('scroll', scrollHandler);
        window.visualViewport.addEventListener('resize', scrollHandler);
    }
});

function loadVideo(placeholderId, iframeId, videoId) {
    const placeholder = document.getElementById(placeholderId);
    const iframe = document.getElementById(iframeId);
    if (placeholder && iframe && !iframe.dataset.loaded) {
        iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&vq=hd720&hd=1`;
        iframe.style.display = "block";
        iframe.dataset.loaded = 'true';
        placeholder.style.display = "none";
    }
}

function loadPlaylist(placeholderId, iframeId, listId) {
    const placeholder = document.getElementById(placeholderId);
    const iframe = document.getElementById(iframeId);
    if (placeholder && iframe && !iframe.dataset.loaded) {
        iframe.src = `https://www.youtube-nocookie.com/embed/videoseries?list=${listId}&rel=0&vq=hd720&hd=1`;
        iframe.style.display = "block";
        iframe.dataset.loaded = 'true';
        placeholder.style.display = "none";
    }
}

// === Управление видимостью иконки куки при скролле (оптимизированно) ===
let cookieIconVisible = true;
window.addEventListener('scroll', () => {
    const icon = document.getElementById('silktide-cookie-icon');
    if (!icon) return;

    const shouldBeVisible = window.scrollY === 0;
    if (shouldBeVisible === cookieIconVisible) return; // не трогаем DOM зря

    cookieIconVisible = shouldBeVisible;
    icon.style.setProperty('opacity', shouldBeVisible ? '1' : '0', 'important');
    icon.style.setProperty('pointer-events', shouldBeVisible ? 'auto' : 'none', 'important');
}, { passive: true });

// === Service Worker — кэширование видео, WebP, иконок и статики ===
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
            .then((reg) => {
                console.log('SW зарегистрирован:', reg.scope);

                // Определяем тип устройства (то же условие, что в tabs.js и CSS)
                const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

                const sendDeviceType = (sw) => {
                    if (sw) sw.postMessage({ type: 'DEVICE_TYPE', isDesktop });
                };

                // Все возможные состояния SW
                if (reg.active) sendDeviceType(reg.active);

                if (reg.installing) {
                    reg.installing.addEventListener('statechange', (e) => {
                        if (e.target.state === 'activated') sendDeviceType(reg.active);
                    });
                }

                if (reg.waiting) sendDeviceType(reg.waiting);

                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    sendDeviceType(navigator.serviceWorker.controller);
                });
            })
            .catch((err) => console.log('SW ошибка:', err));
    });
}
