/**
 * 單字圖片的離線純邏輯（T161）：不碰 DOM、不碰 caches；瀏覽器端存取在 app/lib/offlineImages.ts。
 *
 * 圖片不在 APP precache 裡。網址帶內容版本（?v=SHA-256 前 12 碼），修訂後的圖自動換網址：
 * - 明確下載：寫進 IMAGE_CACHE_NAME，只由頁面驗證內容後寫入，不按筆數或時間淘汰。
 * - 一般瀏覽：service worker 把揭示時載到的圖存進 IMAGE_BROWSE_CACHE_NAME，超過上限淘汰最舊的。
 * 兩個快取分開，瀏覽淘汰永遠碰不到明確下載。
 *
 * @typedef {{ src: string, v: string, bytes: number }} VocabImage
 * @typedef {[name: string, version: string, bytes: number]} VocabImageRow
 */

/** 明確下載的保留快取；service worker 只讀取。 */
export const IMAGE_CACHE_NAME = 'vocab-images-v1';
/** 一般瀏覽順手存的圖；固定筆數淘汰。 */
export const IMAGE_BROWSE_CACHE_NAME = 'vocab-images-browse-v1';
export const IMAGE_BROWSE_LIMIT = 400;
export const IMAGE_VERSION_LENGTH = 12;
/** 圖片很小、數量多：比音檔多開兩條，仍有上限；暫時性錯誤各重試兩次。 */
export const IMAGE_DOWNLOAD_CONCURRENCY = 6;
export const IMAGE_DOWNLOAD_RETRIES = 2;

/** service worker 的圖片路由；只接版本化網址。下載網址（加 offline-download）不符合，會繞過它。 */
export const IMAGE_ROUTE_PATTERN = /\/images\/vocab\/[a-z]+\.svg\?v=[0-9a-f]{12}$/;

/** @param {VocabImageRow[]} rows @returns {VocabImage[]} */
export const expandManifest = (rows) =>
  rows.map(([name, v, bytes]) => ({ src: `images/vocab/${name}.svg`, v, bytes }));

/** @param {VocabImage} image */
export const versionedSrc = (image) => `${image.src}?v=${image.v}`;

/** @param {string} url */
const splitUrl = (url) => {
  const parsed = new URL(url);
  return { path: parsed.origin + parsed.pathname, v: parsed.searchParams.get('v') };
};

/**
 * 依快取裡的實際網址計算下載狀態。待更新＝同一張圖只有舊版本，新版本尚未下載。
 *
 * @param {VocabImage[]} manifest
 * @param {string[]} cachedUrls 明確下載快取的 keys（絕對網址）
 * @param {(src: string) => string} toUrl 相對路徑轉絕對網址
 */
export function imageCacheStatus(manifest, cachedUrls, toUrl) {
  const cached = new Set(cachedUrls);
  const cachedPaths = new Set(cachedUrls.map((url) => splitUrl(url).path));
  let downloadedBytes = 0;
  /** @type {VocabImage[]} */
  const missing = [];
  let updates = 0;
  for (const image of manifest) {
    if (cached.has(toUrl(versionedSrc(image)))) downloadedBytes += image.bytes;
    else {
      missing.push(image);
      if (cachedPaths.has(toUrl(image.src))) updates++;
    }
  }
  const totalBytes = manifest.reduce((sum, image) => sum + image.bytes, 0);
  return {
    total: manifest.length,
    totalBytes,
    downloaded: manifest.length - missing.length,
    downloadedBytes,
    pending: missing.length,
    pendingBytes: totalBytes - downloadedBytes,
    updates,
    missing,
  };
}

/**
 * 可以刪除的舊項目：已不在清單的圖，或「新版本已下載」的舊版本。
 * 新版本還沒下載時保留舊版本，避免先刪後補。
 *
 * @param {VocabImage[]} manifest
 * @param {string[]} cachedUrls
 * @param {(src: string) => string} toUrl
 */
export function removableImageUrls(manifest, cachedUrls, toUrl) {
  const cached = new Set(cachedUrls);
  /** @type {Map<string, string>} */
  const current = new Map(
    manifest.map((image) => [toUrl(image.src), toUrl(versionedSrc(image))]),
  );
  return cachedUrls.filter((url) => {
    const { path } = splitUrl(url);
    const wanted = current.get(path);
    if (!wanted) return true;
    return url !== wanted && cached.has(wanted);
  });
}

/** @param {number} bytes */
export const formatMegabytes = (bytes) => `${(bytes / 1e6).toFixed(2)} MB`;
