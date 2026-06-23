const CACHE = 'cookiedle-v2';

const PRECACHE = [
  '/',
  '/unlimited',
  '/shared.css',
  '/game.css',
  '/unlimited.css',
  '/game.js',
  '/unlimited.js',
  '/shared.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// Requests that must always go to the network (game API).
// Production proxies the worker at same-origin /api/* (see shared.js WORKER_URL),
// so any same-origin request under /api/ is the game API, never static content.
function isApiRequest(url) {
  return url.pathname.startsWith('/api/');
}

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Always network-first for cross-origin and API requests
  if (url.origin !== self.location.origin || isApiRequest(url)) {
    return;
  }

  // Cache-first for everything else (shell, CSS, JS, images)
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then((cache) => cache.put(e.request, clone));
        }
        return res;
      });
    })
  );
});
