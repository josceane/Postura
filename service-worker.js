const CACHE_NAME = 'lei-posturas-v1'; // altere para v3, v4, etc., a cada deploy
const  FILES_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './law.js',
  './manifest.json'
];

self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting()) // força ativação imediata
  );
});

self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.filter(key => key !== CACHE_NAME) // remove caches antigos
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // assume o controle imediato das páginas
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

