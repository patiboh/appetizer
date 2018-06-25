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
  '/css/styles.css'
];
precache = () => {
  return caches.open(staticCacheName).then((cache) => {
    return cache.addAll(filesToCache);
  });
};

self.addEventListener('install', (event) => {
   console.log('The service worker is being installed.');
   event.waitUntil(precache());
});

self.addEventListener('activate', (event) => {
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
  console.log('[ServiceWorker] Fetch', e.request.url);
  var requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {
    event.respondWith(
      fetch(event.request)
        .then(function(response) {
          return caches.open(dataCacheName).then(function(cache) {
            cache.put(event.request.url, response.clone());
            console.log('[ServiceWorker] Fetched&Cached Data');
            return response;
          });
        })
    );
    // if (requestUrl.pathname === '/') {
    //   event.respondWith(caches.match('/index.html'));
    //   return;
    // }
    // if (requestUrl.pathname.startsWith('/restaurant')) {
    //   event.respondWith(caches.match('/restaurant.html'));
    //   return;
    // }
    // if (requestUrl.pathname.startsWith('/avatars/')) {
    //   event.respondWith(serveAvatar(event.request));
    //
    //   var storageUrl = event.request.url.replace(/-\dx\.jpg$/, '');
    //   caches.open(contentImgsCache).then(function(cache) {
    //     fetch(event.request).then(function(networkResponse) {
    //       cache.put(storageUrl, networkResponse);
    //     });
    //   });
    //   return;
    // }
    // }
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

//
// self.addEventListener('message', function(event) {
//   if (event.data.action === 'skipWaiting') {
//     self.skipWaiting();
//   }
// });
