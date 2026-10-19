// A waiting worker may activate only after this page explicitly requests it and
// other pages in the application scope have closed. Never reload another tab.
self.addEventListener('message', (event) => {
  if (event.data?.type !== 'NIHONGO_APPLY_UPDATE' || !event.ports[0]) return;
  const port = event.ports[0];
  event.waitUntil((async () => {
    try {
      const pages = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      const scope = self.registration.scope;
      const scoped = pages.filter((page) => page.url.startsWith(scope));
      if (!event.source?.id || !scoped.some((page) => page.id === event.source.id) || scoped.some((page) => page.id !== event.source.id)) {
        port.postMessage({ status: 'other-pages' });
        return;
      }
      port.postMessage({ status: 'accepted' });
      await self.skipWaiting();
    } catch {
      port.postMessage({ status: 'failed' });
    }
  })());
});
