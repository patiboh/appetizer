let staticCacheName = 'appetizer-v12';
let contentImgsCache = 'appetizer-content-imgs';
let allCaches = [
  staticCacheName,
  contentImgsCache
];

let filesToCache = [
  '/',
  '/index.html',
  '/restaurant.html',
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant-info.js',
  '/css/styles.css',
  '/img/1.jpg',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/4.jpg',
  '/img/5.jpg',
  '/img/6.jpg',
  '/img/7.jpg',
  '/img/8.jpg',
  '/img/9.jpg',
  '/img/10.jpg',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css'
];
precache = () => {
  return caches.open(staticCacheName).then((cache) => {
    return cache.addAll(filesToCache);
  });
};

self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(precache());
});

self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('appetizer-') &&
                 !allCaches.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  var requestUrl = new URL(event.request.url);
  event.respondWith(
    caches.match(event.request.url).then((response) => {
      return response || fetch(event.request).then((response) => {
        return caches.open(staticCacheName).then(function(cache) {
          cache.put(event.request.url, response.clone());
          return response;
        });
    });
  }));
});


self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
