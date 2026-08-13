// Service Worker for GitHub Pages: inject COOP/COEP headers to enable SharedArrayBuffer for WebLLM
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  const url = new URL(event.request.url);
  // Only intercept navigation requests for this origin's HTML pages
  if (event.request.mode === 'navigate' && url.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request).then(function(response) {
        const headers = new Headers(response.headers);
        headers.set('Cross-Origin-Opener-Policy', 'same-origin');
        headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: headers
        });
      }).catch(function(err) {
        console.error('SW navigation fetch failed', err);
        return fetch(event.request);
      })
    );
  }
});
