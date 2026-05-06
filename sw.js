const VIDEO_CACHE = 'dmd-videos-v1';

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

// Установка: скачать все видео в кэш
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VIDEO_CACHE).then((cache) => {
      return cache.addAll(VIDEO_FILES).catch((err) => {
        console.log('SW: ошибка кэширования видео', err);
      });
    })
  );
  self.skipWaiting();
});

// Активация: удалить старые версии кэша
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key.startsWith('dmd-videos-') && key !== VIDEO_CACHE)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Перехват запросов к видео — отдаём из кэша
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith('/videos/') && url.pathname.endsWith('.mp4')) {
    event.respondWith(
      caches.open(VIDEO_CACHE).then((cache) => {
        return cache.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((response) => {
            if (response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        });
      })
    );
  }
});
