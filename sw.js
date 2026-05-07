const VIDEO_CACHE = 'dmd-videos-v1';
const ICON_CACHE = 'dmd-icons-v1';

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
  '/videos/translate-video-ru.mp4'
];

const ICON_FILES = [
  '/img/buttons/startseite.png',
  '/img/buttons/pdf.png',
  '/img/buttons/ki.png',
  '/img/buttons/arzten.png',
  '/img/buttons/auto.png',
  '/img/buttons/karten.png',
  '/img/buttons/ubersetzer.png',
  '/img/buttons/kontakt.png',
  '/img/buttons/hattingen.png',
  '/img/buttons/nachrichten.png',
  '/img/buttons/arbeit.png',
  '/img/buttons/meinung.png',
  '/img/buttons/miete.png',
  '/img/buttons/gesetze.png',
  '/img/buttons/db.png',
  '/img/buttons/projekt.png'
];

// Установка: скачать все видео + иконки в кэш
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(VIDEO_CACHE).then((cache) => {
        return cache.addAll(VIDEO_FILES).catch((err) => {
          console.log('SW: ошибка кэширования видео', err);
        });
      }),
      caches.open(ICON_CACHE).then((cache) => {
        return cache.addAll(ICON_FILES).catch((err) => {
          console.log('SW: ошибка кэширования иконок', err);
        });
      })
    ])
  );
  self.skipWaiting();
});

// Активация: удалить старые версии кэша
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => 
            (key.startsWith('dmd-videos-') && key !== VIDEO_CACHE) ||
            (key.startsWith('dmd-icons-') && key !== ICON_CACHE)
          )
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Универсальная функция: отдать из кэша, иначе скачать и закэшировать
function serveCacheFirst(request, cacheName) {
  return caches.open(cacheName).then((cache) => {
    return cache.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.status === 200) {
          cache.put(request, response.clone());
        }
        return response;
      });
    });
  });
}

// Перехват запросов
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Видео — из кэша
  if (url.pathname.startsWith('/videos/') && url.pathname.endsWith('.mp4')) {
    event.respondWith(serveCacheFirst(event.request, VIDEO_CACHE));
    return;
  }

  // Иконки кнопок навбара — из кэша
  if (url.pathname.startsWith('/img/buttons/') && url.pathname.endsWith('.png')) {
    event.respondWith(serveCacheFirst(event.request, ICON_CACHE));
    return;
  }
});
