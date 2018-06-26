let staticCacheName = 'appetizer-v1';
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
  '/img/10.jpg'
];

const precache = (assets = filesToCache, cacheName = staticCacheName) => {
  return caches.open(cacheName).then((cache) => { return cache.addAll(assets) });
};

self.addEventListener('install', (event) => {
   console.log('[ServiceWorker] installing');
   event.waitUntil(precache());
});
//
// self.addEventListener('activate', (event) => {
//   console.log('[ServiceWorker] activating');
//   event.waitUntil(
//     caches.keys().then(function(cacheNames) {
//       return Promise.all(
//         cacheNames.filter(function(cacheName) {
//           return cacheName.startsWith('appetizer-') &&
//                  !allCaches.includes(cacheName);
//         }).map(function(cacheName) {
//           return caches.delete(cacheName);
//         })
//       );
//     })
//   );
// });

self.addEventListener('fetch', (event) => {
  var requestUrl = new URL(event.request.url);
  console.log('[ServiceWorker] fetch', requestUrl);

  if (requestUrl.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  }

});
