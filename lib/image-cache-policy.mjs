/** Vocabulary image route policy (T161).
 * Explicit downloads (vocab-images-v1) are written only by the page after content
 * verification and are never trimmed here. Images loaded while studying go to a
 * separate browse cache (vocab-images-browse-v1) that keeps the newest 400 entries.
 * These callbacks are serialized into the generated worker: keep them self-contained,
 * with literals that tests compare against lib/vocab-image-offline.mjs.
 * @type {import('workbox-core').WorkboxPlugin} */
export const imageCachePolicy = {
  cachedResponseWillBeUsed: async ({ cachedResponse, request }) => {
    /** @param {Response | undefined} response */
    const usable = (response) =>
      response?.status === 200 &&
      (response.headers.get('content-type') ?? '').startsWith('image/svg+xml');
    if (usable(cachedResponse)) return cachedResponse;
    // Pages answers with Vary: Accept-Encoding; image and fetch requests differ.
    const browsed = await (await caches.open('vocab-images-browse-v1')).match(request, { ignoreVary: true });
    return usable(browsed) ? browsed : null;
  },
  // Network responses never enter the explicit download cache.
  cacheWillUpdate: async () => {
    return null;
  },
  fetchDidSucceed: async ({ request, response }) => {
    if (
      response.status === 200 &&
      (response.headers.get('content-type') ?? '').startsWith('image/svg+xml')
    ) {
      try {
        const cache = await caches.open('vocab-images-browse-v1');
        await cache.put(request, response.clone());
        const keys = await cache.keys();
        for (const key of keys.slice(0, Math.max(0, keys.length - 400))) await cache.delete(key);
      } catch {
        // Browsing must still show the image when storage is full.
      }
    }
    return response;
  },
};
