const CACHE = 'k-dtvp2-v1';
const ASSETS = ['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
  ).then(() => self.clients.claim()));
});

// HTML/네비게이션 요청: network-first (항상 최신 반영, 오프라인 시 캐시)
// 그 외 정적 자원: cache-first (성능)
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const req = e.request;
  const url = new URL(req.url);
  const isHTML = req.mode === 'navigate'
              || req.destination === 'document'
              || url.pathname.endsWith('.html')
              || url.pathname === '/'
              || url.pathname.endsWith('/');
  if (isHTML) {
    e.respondWith(
      fetch(req).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return resp;
      }).catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
    );
  } else {
    e.respondWith(caches.match(req).then((cached) => cached || fetch(req).catch(() => cached)));
  }
});

// 페이지에서 수동으로 업데이트를 트리거할 때
self.addEventListener('message', (e) => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});
