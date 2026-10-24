// T161: vocabulary SVGs left the precache. While this worker installs, the old
// worker still serves the page and its precache still holds the images. Copy them
// into the retained image cache under their content version before activation
// removes them from the precache. Copying is idempotent, so an interrupted install
// resumes on the next attempt; one failed entry never stops the others, and
// failures never block installing the new app.
async function copyPrecachedImage(cache, target, request) {
  const url = new URL(request.url);
  if (!/\/images\/vocab\/[a-z]+\.svg$/.test(url.pathname)) return;
  const response = await cache.match(request);
  const type = response?.headers.get('content-type') ?? '';
  if (response?.status !== 200 || !type.startsWith('image/svg+xml')) return;
  const body = await response.arrayBuffer();
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', body));
  const version = [...digest].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 12);
  const key = url.origin + url.pathname + '?v=' + version;
  if (await target.match(key)) return;
  await target.put(key, new Response(body, { status: 200, headers: { 'content-type': type } }));
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    try {
      const scope = self.registration.scope;
      const names = (await caches.keys()).filter((name) => name.startsWith('workbox-precache-') && name.endsWith(scope));
      if (!names.length) return;
      const target = await caches.open('vocab-images-v1');
      for (const name of names) {
        const cache = await caches.open(name);
        for (const request of await cache.keys()) {
          try {
            await copyPrecachedImage(cache, target, request);
          } catch {
            // Skip this image; it can be downloaded again from Settings.
          }
        }
      }
    } catch {
      // Best effort: images can be downloaded again from Settings.
    }
  })());
});
