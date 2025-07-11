self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('fg-hub-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/script.js',
        '/images/Logo.png',
        '/images/logo-192x192.png',
        '/images/logo-512x512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});