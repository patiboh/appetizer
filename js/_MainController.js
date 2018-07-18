export default function MainController(container) {
  this._container = container;
  this._registerServiceWorker();
};

/**
 * Register ServiceWorker
 */
registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
     navigator.serviceWorker
              .register('./js/service-worker.js')
              .then(function() { console.log('[Main] ServiceWorker registered'); });
   }
}

/**
 * Register ServiceWorker
 */
MainController.prototype._registerServiceWorker = function() {
  if (!navigator.serviceWorker) return;

  let mainController = this;

  navigator.serviceWorker.register('./js/service-worker.js').then(function(reg) {
    if (!navigator.serviceWorker.controller) {
      return;
    }
    if (reg.waiting) {
      console.log('[MainController] ServiceWorker waiting');
      mainController._updateReady(reg.waiting);
      return;
    }

    if (reg.installing) {
      console.log('[MainController] ServiceWorker installing');
      mainController._trackInstalling(reg.installing);
      return;
    }

    reg.addEventListener('updatefound', function() {
      console.log('[MainController] Update found');
      mainController._trackInstalling(reg.installing);
    });

  });
  // Ensure refresh is only called once.
  // This works around a bug in "force update on reload".
  var refreshing;
  navigator.serviceWorker.addEventListener('controllerchange', function() {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
};

MainController.prototype._trackInstalling = function(worker) {
  var mainController = this;
  worker.addEventListener('statechange', function() {
    if (worker.state == 'installed') {
      mainController._updateReady(worker);
    }
  });
};

MainController.prototype._updateReady = function(worker) {
  worker.postMessage({action: 'skipWaiting'});
};
