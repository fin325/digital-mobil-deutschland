// === sw.js — DMD Service Worker v3 ===

const VERSION = 'v3';
const VIDEO_CACHE = `dmd-videos-${VERSION}`;     // MP4 только для мобильных
const WEBP_CACHE = `dmd-webp-${VERSION}`;        // Анимированные WebP только для ПК
const ICON_CACHE = `dmd-icons-${VERSION}`;       // Статичные WebP-иконки кнопок
const STATIC_CACHE = `dmd-static-${VERSION}`;    // CSS/JS/шрифты
const HTML_CACHE = `dmd-html-${VERSION}`;        // HTML-страницы

// === MP4-видео (для мобильных) ===
const VIDEO_FILES = [
    // === Немецкая версия ===
    '/videos/startseite-video1.mp4',
    '/videos/pdf-video1.mp4',
    '/videos/arzten-video1.mp4',
    '/videos/auto-video1.mp4',
    '/videos/karten-video1.mp4',
    '/videos/translate-video1.mp4',
    '/videos/kontakt-video1.mp4',
    '/videos/hattingen-video1.mp4',
    '/videos/nachrichten-video1.mp4',
    '/videos/arbeit-video1.mp4',
    '/videos/meinung-video1.mp4',
    '/videos/miete-video1.mp4',
    '/videos/gesetze-video1.mp4',
    '/videos/db-video1.mp4',
    '/videos/projekt-video1.mp4',

    // === Русская версия ===
    '/videos/startseite-video-ru.mp4',
    '/videos/pdf-video-ru.mp4',
    '/videos/arzten-video-ru.mp4',
    '/videos/auto-video-ru.mp4',
    '/videos/karten-video-ru.mp4',
    '/videos/translate-video-ru.mp4',
    '/videos/kontakt-video-ru.mp4',
    '/videos/hattingen-video-ru.mp4',
    '/videos/nachrichten-video-ru.mp4',
    '/videos/arbeit-video-ru.mp4',
    '/videos/meinung-video-ru.mp4',
    '/videos/miete-video-ru.mp4',
    '/videos/gesetze-video-ru.mp4',
    '/videos/db-video-ru.mp4',
    '/videos/projekt-video-ru.mp4'
];

// === Анимированные WebP (для ПК — те же имена, что и MP4) ===
const WEBP_ANIMATION_FILES = VIDEO_FILES.map(path => path.replace('.mp4', '.webp'));

// === Статичные иконки кнопок навбара ===
const ICON_FILES = [
    // === Немецкая версия ===
    '/img/buttons/startseite.webp',
    '/img/buttons/pdf.webp',
    '/img/buttons/ki.webp',
    '/img/buttons/arzten.webp',
    '/img/buttons/auto.webp',
    '/img/buttons/karten.webp',
    '/img/buttons/ubersetzer.webp',
    '/img/buttons/kontakt.webp',
    '/img/buttons/hattingen.webp',
    '/img/buttons/nachrichten.webp',
    '/img/buttons/arbeit.webp',
    '/img/buttons/meinung.webp',
    '/img/buttons/miete.webp',
    '/img/buttons/gesetze.webp',
    '/img/buttons/db.webp',
    '/img/buttons/projekt.webp',

    // === Русская версия ===
    '/img/buttons/startseite-ru.webp',
    '/img/buttons/pdf-ru.webp',
    '/img/buttons/ki-ru.webp',
    '/img/buttons/arzten-ru.webp',
    '/img/buttons/auto-ru.webp',
    '/img/buttons/karten-ru.webp',
    '/img/buttons/ubersetzer-ru.webp',
    '/img/buttons/kontakt-ru.webp',
    '/img/buttons/nachrichten-ru.webp',
    '/img/buttons/arbeit-ru.webp',
    '/img/buttons/meinung-ru.webp',
    '/img/buttons/miete-ru.webp',
    '/img/buttons/gesetze-ru.webp',
    '/img/buttons/db-ru.webp',
    '/img/buttons/projekt-ru.webp'
];

// === Критичные статичные ресурсы ===
const STATIC_FILES = [
    '/css/base.css',
    '/css/topbar.css',
    '/css/navbar.css',
    '/css/components.css',
    '/css/silktide-consent-manager.css',
    '/css/icons.css',
    '/css/chat.css',
    '/js/components.js',
    '/js/tabs.js',
    '/js/clock.js',
    '/js/news.js',
    '/js/main.js',
    '/js/chat.js',
    '/js/cookie-consent.js',
    '/js/silktide-consent-manager.js',
    '/fonts/aldrich-v22-latin-regular.woff2',
    '/fonts/montserrat-v31-latin-regular.woff2',
    '/fonts/montserrat-v31-latin-700.woff2',
    '/fonts/tektur-v6-cyrillic_latin-regular.woff2'
];

// === Состояние: ПК или мобильный ===
// По умолчанию null — ничего не предзагружаем, пока страница не сообщит тип
let isDesktopDevice = null;
let videosCachedForMobile = false;
let webpCachedForDesktop = false;

// === INSTALL: предзагружаем только статику и иконки (одинаковые для всех) ===
self.addEventListener('install', (event) => {
    event.waitUntil(
        Promise.all([
            caches.open(ICON_CACHE).then((cache) =>
                cache.addAll(ICON_FILES).catch((err) => console.log('SW: icon cache error', err))
            ),
            caches.open(STATIC_CACHE).then((cache) =>
                cache.addAll(STATIC_FILES).catch((err) => console.log('SW: static cache error', err))
            )
            // MP4 и WebP-анимации НЕ кэшируем здесь — ждём сообщения о типе устройства
        ])
    );
    self.skipWaiting();
});

// === ACTIVATE: чистим старые версии ===
self.addEventListener('activate', (event) => {
    const validCaches = [VIDEO_CACHE, WEBP_CACHE, ICON_CACHE, STATIC_CACHE, HTML_CACHE];
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key.startsWith('dmd-') && !validCaches.includes(key))
                    .map((key) => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

// === MESSAGE: страница сообщает тип устройства ===
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'DEVICE_TYPE') {
        isDesktopDevice = event.data.isDesktop === true;

        if (isDesktopDevice && !webpCachedForDesktop) {
            // ПК — кэшируем только анимированные WebP
            webpCachedForDesktop = true;
            caches.open(WEBP_CACHE).then((cache) =>
                cache.addAll(WEBP_ANIMATION_FILES).catch((err) =>
                    console.log('SW: webp animation cache error', err)
                )
            );
        } else if (!isDesktopDevice && !videosCachedForMobile) {
            // Мобильный — кэшируем только MP4
            videosCachedForMobile = true;
            caches.open(VIDEO_CACHE).then((cache) =>
                cache.addAll(VIDEO_FILES).catch((err) =>
                    console.log('SW: video cache error', err)
                )
            );
        }
    }
});

// === Стратегии кэширования ===

function cacheFirst(request, cacheName) {
    return caches.open(cacheName).then((cache) =>
        cache.match(request).then((cached) => {
            if (cached) return cached;
            return fetch(request).then((response) => {
                if (response.status === 200) {
                    cache.put(request, response.clone());
                }
                return response;
            });
        })
    );
}

function staleWhileRevalidate(request, cacheName) {
    return caches.open(cacheName).then((cache) =>
        cache.match(request).then((cached) => {
            const fetchPromise = fetch(request)
                .then((response) => {
                    if (response.status === 200) {
                        cache.put(request, response.clone());
                    }
                    return response;
                })
                .catch(() => cached);
            return cached || fetchPromise;
        })
    );
}

function networkFirst(request, cacheName) {
    return fetch(request)
        .then((response) => {
            if (response.status === 200) {
                const clone = response.clone();
                caches.open(cacheName).then((cache) => cache.put(request, clone));
            }
            return response;
        })
        .catch(() => caches.match(request));
}

// === FETCH: маршрутизация ===
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    if (event.request.method !== 'GET') return;
    if (url.origin !== self.location.origin) return;

    // MP4 — только если мобильный (на ПК пропускаем — браузер не запрашивает)
    if (url.pathname.startsWith('/videos/') && url.pathname.endsWith('.mp4')) {
        if (isDesktopDevice === false) {
            event.respondWith(cacheFirst(event.request, VIDEO_CACHE));
        }
        return;
    }

    // Анимированные WebP — только если ПК
    if (url.pathname.startsWith('/videos/') && url.pathname.endsWith('.webp')) {
        if (isDesktopDevice === true) {
            event.respondWith(cacheFirst(event.request, WEBP_CACHE));
        }
        return;
    }

    // Иконки кнопок (WebP) — cache-first для всех
    if (url.pathname.startsWith('/img/buttons/') && url.pathname.endsWith('.webp')) {
        event.respondWith(cacheFirst(event.request, ICON_CACHE));
        return;
    }

    // CSS/JS/шрифты — stale-while-revalidate
    if (
        url.pathname.startsWith('/css/') ||
        url.pathname.startsWith('/js/') ||
        url.pathname.startsWith('/fonts/')
    ) {
        event.respondWith(staleWhileRevalidate(event.request, STATIC_CACHE));
        return;
    }

    // HTML — network-first
    if (
        url.pathname.endsWith('.html') ||
        url.pathname === '/' ||
        url.pathname === '/ru/' ||
        url.pathname.endsWith('/')
    ) {
        event.respondWith(networkFirst(event.request, HTML_CACHE));
        return;
    }
});
