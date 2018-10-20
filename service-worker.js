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
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css'
];

self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {

      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {

          return cacheName.startsWith('appetizer-') &&
                 !allCaches.includes(cacheName);
        }).map((cacheName) => {

          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  var requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname.startsWith('/img/')) {
      event.respondWith(servePhoto(event.request));

      return;
    }
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || caches.open(staticCacheName).then((cache) => {
          return fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );

    return;
  }

  if (requestUrl.origin === 'https://unpkg.com/leaflet@1.3.1/') {
    if (requestUrl.pathname.startsWith('/dist/images/')) {
      event.respondWith(servePhoto(event.request));
      
      return;
    }
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {

      return response || fetch(event.request);
    })
  );
});


function servePhoto(request) {
  var storageUrl = request.url.replace(/-\d+px\.jpg$/, '');

  return caches.open(contentImgsCache).then((cache) => {

    return cache.match(storageUrl).then((response) => {
      if (response) return response;

      return fetch(request).then((networkResponse) => {
        cache.put(storageUrl, networkResponse.clone());

        return networkResponse;
      });
    });
  });
}

self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
