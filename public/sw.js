/* Happy Japanese service worker: the whole app is cached, so it opens and works offline.
   VERSION and SHELL are written by tools/build-sw.mjs (run it after changing files in public/). */

const VERSION = '94e998cf94b4';
const SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'assets/app.css',
  'assets/icons/apple-touch-icon.png',
  'assets/icons/favicon.svg',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/icon-maskable-512.png',
  'assets/js/app.js',
  'assets/js/areas/common.js',
  'assets/js/areas/grammar.js',
  'assets/js/areas/index.js',
  'assets/js/areas/life.js',
  'assets/js/areas/numbers.js',
  'assets/js/areas/script.js',
  'assets/js/areas/vocab.js',
  'assets/js/data/adjcloze.js',
  'assets/js/data/adjectives.js',
  'assets/js/data/grammar.js',
  'assets/js/data/kanji.js',
  'assets/js/data/particles.js',
  'assets/js/data/phrases.js',
  'assets/js/data/sentences.js',
  'assets/js/data/signs.js',
  'assets/js/data/verbcloze.js',
  'assets/js/data/verbs.js',
  'assets/js/data/vocab-1.js',
  'assets/js/data/vocab-2.js',
  'assets/js/data/vocab-travel.js',
  'assets/js/lib/analysis.js',
  'assets/js/lib/api.js',
  'assets/js/lib/cat.js',
  'assets/js/lib/conjugate.js',
  'assets/js/lib/furi.js',
  'assets/js/lib/kana.js',
  'assets/js/lib/numbers.js',
  'assets/js/lib/srs.js',
  'assets/js/lib/store.js',
  'assets/js/lib/ui.js',
  'assets/js/session.js',
  'assets/js/tasks.js',
  'assets/js/views/areas.js',
  'assets/js/views/auth.js',
  'assets/js/views/home.js',
  'assets/js/views/lists.js',
  'assets/js/views/practice.js',
  'assets/js/views/settings.js',
  'assets/js/views/stats.js',
];

const CACHE = `happyjapanese-${VERSION}`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(SHELL.map((path) => new Request(path, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('happyjapanese-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  // The API and the cron endpoint always go to the server; the app copes with being offline.
  if (url.pathname.endsWith('.php')) return;

  if (request.mode === 'navigate') {
    event.respondWith(caches.match('index.html').then((cached) => cached || fetch(request)));
    return;
  }
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok && response.type === 'basic') {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy));
      }
      return response;
    })),
  );
});

/* ---------- reminders ---------- */

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : '' };
  }
  event.waitUntil(self.registration.showNotification(data.title || 'Happy Japanese', {
    body: data.body || 'Mochi wartet: Zeit für eine kleine Übung!',
    icon: 'assets/icons/icon-192.png',
    badge: 'assets/icons/icon-192.png',
    tag: data.tag || 'reminder',
    data: { url: data.url || './' },
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || './', self.registration.scope).href;
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
    for (const client of windows) {
      if ('focus' in client) {
        client.navigate?.(target);
        return client.focus();
      }
    }
    return self.clients.openWindow(target);
  }));
});
