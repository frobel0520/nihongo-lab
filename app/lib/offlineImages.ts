import { VOCAB_IMAGE_ROWS } from 'virtual:vocab-image-manifest';
import { downloadUrl } from '../../lib/offline.mjs';
import {
  IMAGE_CACHE_NAME,
  expandManifest,
  imageCacheStatus,
  removableImageUrls,
  versionedSrc,
  type VocabImage,
} from '../../lib/vocab-image-offline.mjs';

/** build 時由實際 SVG 位元組算出的版本清單。 */
export const VOCAB_IMAGES: VocabImage[] = expandManifest(VOCAB_IMAGE_ROWS);
const bySrc = new Map(VOCAB_IMAGES.map((image) => [image.src, image]));

/** 卡片 <img> 用的網址：帶內容版本，修訂後的圖自動換網址，不會讀到舊快取。 */
export function vocabImageUrl(src: string) {
  const image = bySrc.get(src);
  return `${import.meta.env.BASE_URL}${image ? versionedSrc(image) : src}`;
}

const absolute = (src: string) =>
  new URL(`${import.meta.env.BASE_URL}${src}`, location.href).href;

const svgType = (response: Response) =>
  (response.headers.get('content-type') ?? '').startsWith('image/svg+xml');

async function sha256Prefix(body: ArrayBuffer, length: number) {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', body));
  return [...digest]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, length);
}

/**
 * 明確下載的圖片快取。save 繞過 service worker 路由抓整檔，確認 200、SVG 類型與內容版本一致才寫入；
 * has 重新讀實際快取確認。Pages 的 Vary 標頭不能讓已下載的圖讀不到，所以比對一律 ignoreVary。
 */
export function createImageStore() {
  return {
    async has(image: VocabImage) {
      const cache = await caches.open(IMAGE_CACHE_NAME);
      const cached = await cache.match(absolute(versionedSrc(image)), {
        ignoreVary: true,
      });
      return cached?.status === 200 && svgType(cached);
    },
    async save(image: VocabImage) {
      const url = absolute(versionedSrc(image));
      const response = await fetch(downloadUrl(url), { cache: 'no-store' });
      if (response.status !== 200)
        throw new Error(`HTTP ${response.status}`);
      if (!svgType(response))
        throw new Error(
          `不是圖片（${response.headers.get('content-type') ?? '沒有 content-type'}）`,
        );
      const body = await response.arrayBuffer();
      if ((await sha256Prefix(body, image.v.length)) !== image.v)
        throw new Error('內容與這個版本不符，可能是網站正在更新，請稍後重試。');
      const cache = await caches.open(IMAGE_CACHE_NAME);
      await cache.put(
        url,
        new Response(body, {
          status: 200,
          headers: { 'content-type': response.headers.get('content-type')! },
        }),
      );
    },
  };
}

async function cachedUrls() {
  const cache = await caches.open(IMAGE_CACHE_NAME);
  return (await cache.keys()).map((request) => request.url);
}

export async function readImageStatus() {
  return imageCacheStatus(VOCAB_IMAGES, await cachedUrls(), absolute);
}

/** 新版本已下載後才刪舊版本；不在清單的舊圖一併清掉。 */
export async function pruneImageCache() {
  const cache = await caches.open(IMAGE_CACHE_NAME);
  const urls = removableImageUrls(VOCAB_IMAGES, await cachedUrls(), absolute);
  await Promise.all(urls.map((url) => cache.delete(url)));
  return urls.length;
}

/** 同一瀏覽器的多個分頁不同時下載；不支援 Web Locks 時以本頁狀態防重複。 */
export async function withDownloadLock<T>(
  run: () => Promise<T>,
): Promise<T | 'locked'> {
  if (!navigator.locks) return run();
  return navigator.locks.request(
    'nihongo-lab:vocab-image-download',
    { ifAvailable: true },
    async (lock) => (lock ? run() : 'locked'),
  );
}

/** 可用空間明顯不足時先告知；估計值只供參考，實際仍以寫入結果為準。 */
export async function storageShortfall(neededBytes: number) {
  try {
    const estimate = await navigator.storage?.estimate?.();
    if (!estimate?.quota || estimate.usage === undefined) return 0;
    const free = estimate.quota - estimate.usage;
    return free < neededBytes * 2 ? neededBytes * 2 - free : 0;
  } catch {
    return 0;
  }
}
