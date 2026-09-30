/**
 * 離線音檔的純邏輯（不碰 DOM、不碰 caches；瀏覽器端的快取存取在 app/lib/offlineAudio.ts）。
 *
 * 背景：<audio> 一律送 Range 請求，伺服器回 206，而 service worker 的 CacheFirst 只存 200，
 * 所以單靠「播放」永遠不會把音檔存進快取。要離線播放，必須用不帶 Range 的 fetch 主動把整檔抓下來，
 * 存進 service worker 讀取的同一個快取（AUDIO_CACHE_NAME）。
 *
 * @typedef {{
 *   has(path: string): Promise<boolean>,
 *   save(path: string): Promise<void>,
 * }} AudioStore 音檔快取的抽象（測試用假的實作，瀏覽器用 Cache API）。
 * @typedef {{ done: number, total: number }} DownloadProgress
 * @typedef {{
 *   total: number,
 *   skipped: number,
 *   downloaded: number,
 *   failed: { path: string, message: string }[],
 * }} DownloadResult
 */

/** 與 vite.config.ts 的 runtimeCaching cacheName 必須一致，service worker 才讀得到頁面存進去的檔案。 */
export const AUDIO_CACHE_NAME = 'lesson-audio';

/** service worker 快取音檔的路由；vite.config.ts 直接使用，下載網址（downloadUrl）必須不符合它。 */
export const AUDIO_ROUTE_PATTERN = /\/audio\/.*\.mp3$/;

/**
 * 下載用的網址：加上查詢字串，讓它不符合 AUDIO_ROUTE_PATTERN，請求就繞過 service worker 的 CacheFirst。
 * 否則 service worker 會在回應之後才非同步地把「任何 200」（例如 captive portal 的 HTML）存進音檔快取，
 * 頁面端的驗證與清除會和它搶時間，髒資料可能留下來。
 *
 * @param {string} url
 */
export function downloadUrl(url) {
  return `${url}${url.includes('?') ? '&' : '?'}offline-download=1`;
}

/** 同時下載的檔案數；音檔很小，多開只會拖慢手機網路。 */
export const DEFAULT_CONCURRENCY = 4;

/**
 * 一課裡所有帶音檔的項目（單字、文法例句、對話、名句）的音檔路徑，不重複。
 *
 * @param {{
 *   vocab: { audio: string }[],
 *   grammar: { examples: { audio: string }[] }[],
 *   dialogue: { audio: string }[],
 *   quotes?: { audio: string }[],
 * }} lesson
 * @returns {string[]}
 */
export function lessonAudioPaths(lesson) {
  return [
    ...new Set([
      ...lesson.vocab.map((v) => v.audio),
      ...lesson.grammar.flatMap((g) => g.examples.map((e) => e.audio)),
      ...lesson.dialogue.map((d) => d.audio),
      ...(lesson.quotes ?? []).map((q) => q.audio),
    ]),
  ];
}

/**
 * 所有「音檔已就緒」的課程的音檔路徑；audioReady 為 false 的課程音檔還沒有，不列入。
 *
 * @param {{ lessons: (Parameters<typeof lessonAudioPaths>[0] & { audioReady?: boolean })[] }[]} stages
 * @returns {string[]}
 */
export function allAudioPaths(stages) {
  return [
    ...new Set(
      stages.flatMap((stage) =>
        stage.lessons
          .filter((lesson) => lesson.audioReady !== false)
          .flatMap(lessonAudioPaths),
      ),
    ),
  ];
}

/**
 * 已經在快取裡的音檔數。
 *
 * @param {string[]} paths
 * @param {AudioStore} store
 */
export async function countCached(paths, store) {
  const flags = await Promise.all(paths.map((path) => store.has(path)));
  return flags.filter(Boolean).length;
}

/**
 * 把還沒在快取裡的音檔抓下來。已存在的略過；單一檔案失敗不會中斷其他檔案，
 * 失敗的會列在結果裡，讓使用者再按一次只補抓失敗的（不自動重試）。
 *
 * @param {string[]} paths
 * @param {AudioStore} store
 * @param {{
 *   concurrency?: number,
 *   onProgress?: (progress: DownloadProgress) => void,
 *   signal?: AbortSignal,
 * }} [options]
 * @returns {Promise<DownloadResult>}
 */
export async function downloadAudio(paths, store, options = {}) {
  const { concurrency = DEFAULT_CONCURRENCY, onProgress, signal } = options;
  const unique = [...new Set(paths)];
  const cachedFlags = await Promise.all(unique.map((path) => store.has(path)));
  const missing = unique.filter((_, i) => !cachedFlags[i]);

  /** @type {DownloadResult} */
  const result = {
    total: unique.length,
    skipped: unique.length - missing.length,
    downloaded: 0,
    failed: [],
  };

  let next = 0;
  let done = 0;
  onProgress?.({ done, total: missing.length });

  const worker = async () => {
    while (next < missing.length && !signal?.aborted) {
      const path = missing[next++];
      try {
        await store.save(path);
        result.downloaded++;
      } catch (error) {
        result.failed.push({
          path,
          message: error instanceof Error ? error.message : String(error),
        });
      }
      done++;
      onProgress?.({ done, total: missing.length });
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(concurrency, missing.length) }, worker),
  );
  return result;
}
