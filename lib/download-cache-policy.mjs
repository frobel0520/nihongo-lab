/** Only explicit downloads may write to the retained audio cache.
 * These callbacks are serialized into the generated worker: keep them self-contained.
 * @type {import('workbox-core').WorkboxPlugin} */
export const downloadCachePolicy = {
  cachedResponseWillBeUsed: async ({ cachedResponse }) => {
    return cachedResponse?.status === 200 &&
      (cachedResponse.headers.get('content-type') ?? '').startsWith('audio/')
      ? cachedResponse
      : null;
  },
  // Normal playback may fetch from the network, but must not grow this cache.
  // The page's validated, explicit download writes directly through Cache API.
  cacheWillUpdate: async () => {
    return null;
  },
};
