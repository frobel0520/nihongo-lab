/*
 * 舊 GitHub Pages 網址的 service worker 替換檔（SEC-P1-20261031）。
 * 舊版 App 的 service worker 會從快取直接回應頁面，看不到新的引導頁；瀏覽器檢查更新時會抓到這個檔案，
 * 它安裝後立即接手、清掉舊網址的快取並解除註冊，再重新載入已開啟的頁面，讓使用者看到引導頁。
 * 不碰 localStorage：學習進度要留給引導頁下載。
 */
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    await Promise.all(clients.map((client) => client.navigate(client.url).catch(() => undefined)));
  })());
});
