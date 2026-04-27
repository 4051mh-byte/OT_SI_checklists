// Service Worker for ACE App
// Cache strategy: Cache-first with network fallback

const CACHE_NAME = 'ace-v3';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.log('Some assets failed to cache (this is OK for initial install):', err);
        // Don't fail install if some assets aren't available yet
        return cache.addAll(STATIC_ASSETS.filter(asset => asset.endsWith('.js') || asset.endsWith('.css') || asset.endsWith('.html')));
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - cache-first strategy
self.addEventListener('fetch', event => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external API calls and cross-origin requests
  if (!request.url.includes(self.location.origin)) {
    return;
  }

  // Cache-first strategy
  event.respondWith(
    caches.match(request).then(response => {
      if (response) {
        // Return cached response
        return response;
      }

      // Network request if not in cache
      return fetch(request).then(networkResponse => {
        // Don't cache if not a successful response
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
          return networkResponse;
        }

        // Clone the response
        const responseToCache = networkResponse.clone();

        // Cache the response for future use
        caches.open(CACHE_NAME).then(cache => {
          cache.put(request, responseToCache);
        });

        return networkResponse;
      }).catch(err => {
        // Network request failed, return cached response if available
        console.log('Fetch failed; returning offline page', err);
        // Return a custom offline page if available
        return caches.match('./index.html');
      });
    })
  );
});

// Message handling for cache updates
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME);
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(event.data.urls || []).catch(err => {
          console.log('Failed to cache URLs:', err);
        });
      })
    );
  }
});
