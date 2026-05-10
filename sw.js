// === sw.js — DMD Service Worker v3 ===

const VERSION = 'v3';
const VIDEO_CACHE = `dmd-videos-${VERSION}`;     // MP4 для мобильных
const WEBP_CACHE = `dmd-webp-${VERSION}`;        // Анимированные WebP только для ПК
const ICON_CACHE = `dmd-icons-${VERSION}`;       // Статичные WebP-иконки кнопок
const STATIC_CACHE = `dmd-static-${VERSION}`;    // CSS/JS/шрифты
const HTML_CACHE = `dmd-html-${VERSION}`;        // Главные HTML-страницы

// === MP4-видео (для мобильных) ===
const VIDEO_FILES = [
  // Немецкая версия
  '/videos/startseite-video1.mp4',
  '/videos/pdf-video1.mp4',
  '/videos/nachrichten-video1.mp4',
  '/videos/meinung-video1.mp4',
  '/videos/hattingen-video1.mp4',

  // Русская версия
  '/videos/arbeit-video-ru.mp4',
  '/videos/arzten-video-ru.mp4',
  '/videos/auto-video-ru.mp4',
  '/videos/db-video-ru.mp4',
  '/videos/geserze-video-ru.mp4',
  '/videos/karten-video-ru.mp4',
  '/videos/kontakt-video-ru.mp4',
  '/videos/meinung-video-ru.mp4',
  '/videos/miete-video-ru.mp4',
  '/videos/nachrichten-video-ru.mp4',
  '/videos/pdf-video-ru.mp4',
  '/videos/projekt-video-ru.mp4',
  '/videos/translate-video-ru.mp4',
  '/videos/hattingen-video-ru.mp4'
];

// === Анимированные WebP (для ПК — те же имена, что и MP4) ===
const WEBP_ANIMATION_FILES = VIDEO_FILES.map(path => path.replace('.mp4', '.webp'));

// === Иконки кнопок навбара (статичные WebP) ===
const ICON_FILES = [
  // Немецкая версия
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

  // Русская версия
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
// Страница сообщает через postMessage. По умолчанию — мобильный (безопаснее).
let isDesktopDevice = false;

// === INSTALL: предзагрузка ===
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(VIDEO_CACHE).then((cache) =>
        cache.addAll(VIDEO_FILES).catch((err) => console.log('SW: video cache error', err))
      ),
      caches.open(ICON_CACHE).then((cache) =>
        cache.addAll(ICON_FILES).catch((err) => console.log('SW: icon cache error', err))
      ),
      caches.open(STATIC_CACHE).then((cache) =>
        cache.addAll(STATIC_FILES).catch((err) => console.log('SW: static cache error', err))
      )
      // WebP-анимации НЕ кэшируем здесь — только после получения сообщения от ПК
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

    // Если ПК — догружаем анимированные WebP в фоне
    if (isDesktopDevice) {
      caches.open(WEBP_CACHE).then((cache) =>
        cache.addAll(WEBP_ANIMATION_FILES).catch((err) =>
          console.log('SW: webp animation cache error', err)
        )
      );
    }
  }
});

// === Стратегии кэширования ===

// Cache-first: отдаём из кэша, иначе сеть + сохраняем
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

// Stale-while-revalidate: мгновенно из кэша, обновляем в фоне
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

// Network-first для HTML: всегда свежее, fallback на кэш
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

// === FETCH: маршрутизация запросов ===
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Только GET
  if (event.request.method !== 'GET') return;

  // Только свой домен (не трогаем YouTube, OpenWeatherMap и т.д.)
  if (url.origin !== self.location.origin) return;

  // === Видео MP4 — cache-first ===
  if (url.pathname.startsWith('/videos/') && url.pathname.endsWith('.mp4')) {
    event.respondWith(cacheFirst(event.request, VIDEO_CACHE));
    return;
  }

  // === Анимированные WebP — только если ПК ===
  if (url.pathname.startsWith('/videos/') && url.pathname.endsWith('.webp')) {
    if (isDesktopDevice) {
      event.respondWith(cacheFirst(event.request, WEBP_CACHE));
    }
    // На мобильных не вмешиваемся — браузер сам решит (но ты их и не запрашиваешь)
    return;
  }

  // === Иконки кнопок (WebP) — cache-first ===
  if (url.pathname.startsWith('/img/buttons/') && url.pathname.endsWith('.webp')) {
    event.respondWith(cacheFirst(event.request, ICON_CACHE));
    return;
  }

  // === CSS/JS/шрифты — stale-while-revalidate ===
  if (
    url.pathname.startsWith('/css/') ||
    url.pathname.startsWith('/js/') ||
    url.pathname.startsWith('/fonts/')
  ) {
    event.respondWith(staleWhileRevalidate(event.request, STATIC_CACHE));
    return;
  }

  // === HTML-страницы — network-first ===
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
