import {
  AUDIO_CACHE_NAME,
  downloadUrl,
  type AudioStore,
} from '../../lib/offline.mjs';
import { audioUrl } from '../components/AudioLine';

/** Cache API 只在 HTTPS 或 localhost 可用；不支援時畫面要明說，不能假裝下載成功。 */
export const offlineSupported = () => typeof caches !== 'undefined';

/** 開發伺服器的 SPA fallback 或需要登入的網路（captive portal）會用 200 回 HTML，不能當音檔。 */
const audioType = (response: Response) =>
  (response.headers.get('content-type') ?? '').startsWith('audio/');

/**
 * 用 Cache API 存取音檔。save 用不帶 Range 的 fetch 抓整檔並直接寫進 service worker 讀取的同一個快取，
 * 不依賴 service worker 當下是否已接管頁面。只接受 200 且內容類型是 audio/*：
 * Cache API 存不了部分內容，存進去的必須是完整檔案。
 *
 * 下載請求用 downloadUrl 繞過 service worker 的快取路由（否則它會在回應後非同步地把 200 的 HTML
 * 存進音檔快取，和這裡的驗證搶時間）；即使之前已有髒資料，驗證失敗時也會清掉，has 也要驗內容類型，
 * 避免髒資料被算成「已下載」。
 */
export function createAudioStore(): AudioStore {
  return {
    async has(path) {
      const cache = await caches.open(AUDIO_CACHE_NAME);
      const cached = await cache.match(audioUrl(path));
      return cached !== undefined && audioType(cached);
    },
    async save(path) {
      const url = audioUrl(path);
      const response = await fetch(downloadUrl(url));
      const cache = await caches.open(AUDIO_CACHE_NAME);
      if (response.status !== 200 || !audioType(response)) {
        await cache.delete(url);
        throw new Error(
          response.status !== 200
            ? `HTTP ${response.status}`
            : `不是音檔（${response.headers.get('content-type') ?? '沒有 content-type'}）`,
        );
      }
      await cache.put(url, response);
    },
  };
}
