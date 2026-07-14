const CACHE_NAME = 'depo-malkabul-v1.9';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Supabase API çağrıları (data) her zaman ağdan gitsin — sadece uygulama kabuğunu (HTML/CSS/JS/ikon) önbellekle.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin.includes('supabase.co') || url.hostname.includes('supabase')) {
    return; // veritabanı isteklerine dokunma
  }
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((networkResp) => {
          if (networkResp && networkResp.ok && event.request.method === 'GET') {
            const clone = networkResp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResp;
        })
        .catch(() => cached); // ağ yoksa önbellekten dön
      return cached || fetchPromise;
    })
  );
});
