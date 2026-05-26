const CACHE = 'cookiedle-v1';

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

// Requests that must always go to the network (game API)
function isApiRequest(url) {
  const API_PATHS = [
    '/guess',
    '/hint',
    '/guess2',
    '/hint2',
    '/guess3',
    '/hint3',
    '/daily-state',
    '/skill',
    '/skill-image',
    '/silhouette3-image',
    '/unlimited/new',
    '/unlimited/guess',
    '/unlimited/hint',
    '/roster',
    '/cookies',
    '/cookie-count',
    '/health',
  ];
  return API_PATHS.some((p) => url.pathname === p || url.pathname.startsWith(p + '?'));
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
