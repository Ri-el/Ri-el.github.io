// Focused offline worker for the static PoE2 crafting forge.
//
// The shell contains the files required to boot the app. Runtime data that is
// requested later (including the "All known" catalog) is filled into that
// shell cache on demand. Artwork has a separate bounded cache so a large
// collection of item images cannot evict the executable app shell.

const CACHE_NAME = 'poe2-craft-registry-v14';
const IMAGE_CACHE_NAME = 'poe2-craft-images-v1';
const MAX_IMAGE_CACHE_ENTRIES = 200;

const APP_SHELL = [
  './',
  './index.html',
  './style.css',
  './select.css',
  './desecrate.css',
  './overhaul.css',
  './header-fix.css?v=20',
  './app.js',
  './select.js',
  './crafting.js',
  './data/mods.data.js',
  './data/desecrated-mods.data.js',
  './data/runtime.data.js',
  './data/crafting/currency-index.data.js',
  './assets/icons/OishyCraftingForge-compact.png',
  './assets/item-bases/2563.png',
  './manifest.json',
];

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

function isArtworkRequest(url) {
  if (!isSameOrigin(url)) return false;
  const path = url.pathname;
  return path.startsWith('/assets/item-bases/') || path.startsWith('/assets/icons/');
}

function isAppAssetRequest(url) {
  if (!isSameOrigin(url)) return false;
  return /\.(?:html|css|js|json|webmanifest)$/i.test(url.pathname);
}

async function trimImageCache(cache) {
  const requests = await cache.keys();
  const excess = requests.length - MAX_IMAGE_CACHE_ENTRIES;
  if (excess <= 0) return;
  await Promise.all(requests.slice(0, excess).map(request => cache.delete(request)));
}

async function handleArtworkRequest(request) {
  const imageCache = await caches.open(IMAGE_CACHE_NAME);
  const cached = await imageCache.match(request);
  if (cached) return cached;

  // A shell-precached image (the reviewed Absent Amulet fallback) remains
  // available even before it has been touched by the artwork route.
  const shellCached = await caches.open(CACHE_NAME).then(cache => cache.match(request));
  if (shellCached) return shellCached;

  const response = await fetch(request);
  if (response && response.status === 200 && response.type === 'basic') {
    await imageCache.put(request, response.clone());
    await trimImageCache(imageCache);
  }
  // Deliberately do not fall back to index.html for a missing image. The page
  // owns its glyph/dot fallback and must receive the normal image failure.
  return response;
}

async function cacheSuccessfulAppAsset(request, response) {
  if (response && response.status === 200 && response.type === 'basic') {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  }
  return response;
}

async function handleAppAssetRequest(request, event) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const refresh = fetch(request)
    .then(response => cacheSuccessfulAppAsset(request, response))
    .catch(() => null);
  event.waitUntil(refresh.then(() => undefined));
  if (cached) return cached;
  const response = await refresh;
  if (response) return response;
  throw new Error(`Offline app asset unavailable: ${request.url}`);
}

async function handleNavigationRequest(request) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200 && response.type === 'basic') {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  } catch (_) {
    const cached = await caches.match(request);
    return cached || caches.match('./index.html');
  }
}

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(Promise.all([
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(APP_SHELL.map(url => cache.add(url)))
    ),
    // Create the bounded artwork cache during install so cache inspection and
    // activation cleanup are deterministic even before the first image hit.
    caches.open(IMAGE_CACHE_NAME),
  ]));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(
        names
          .filter(name => name !== CACHE_NAME && name !== IMAGE_CACHE_NAME)
          .map(name => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }
  if (isArtworkRequest(url)) {
    event.respondWith(handleArtworkRequest(request));
    return;
  }
  if (isAppAssetRequest(url)) {
    event.respondWith(handleAppAssetRequest(request, event));
  }
});
