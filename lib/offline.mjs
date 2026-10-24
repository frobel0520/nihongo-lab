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

/** 明確下載的保留快取，沿用舊名稱以保護既有下載。SW 只讀取，不按播放次數或時間淘汰。
 * 瀏覽器／作業系統仍可能清除儲存；下載狀態必須檢查實際 Cache API。 */
export const AUDIO_CACHE_NAME = 'lesson-audio-v5';

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
 *   grammar: { examples: { audio: string }[], quoteExamples?: { quote: { audio: string } }[] }[],
 *   dialogue: { audio: string }[],
 *   quotes?: { audio: string }[],
 *   training?: import('./anime-training.mjs').AnimeTraining,
 * }} lesson
 * @returns {string[]}
 */
export function lessonAudioPaths(lesson) {
  return [
    ...new Set([
      ...lesson.vocab.map((v) => v.audio),
      ...lesson.grammar.flatMap((g) => g.examples.map((e) => e.audio)),
      ...lesson.grammar.flatMap((g) =>
        (g.quoteExamples ?? []).map((e) => e.quote.audio),
      ),
      ...lesson.dialogue.map((d) => d.audio),
      ...(lesson.quotes ?? []).map((q) => q.audio),
      ...(lesson.training
        ? [...lesson.training.clips, ...lesson.training.review].map(
            (clip) => clip.quote.audio,
          )
        : []),
    ]),
  ];
}

/**
 * 所有「音檔已就緒」的課程與獨立學習區的音檔路徑；audioReady 為 false 的課程音檔還沒有，不列入。
 *
 * @param {{ lessons: (Parameters<typeof lessonAudioPaths>[0] & { audioReady?: boolean })[] }[]} stages
 * @param {string[]} [extraPaths]
 * @returns {string[]}
 */
export function allAudioPaths(stages, extraPaths = []) {
  return [
    ...new Set([
      ...extraPaths,
      ...stages.flatMap((stage) =>
        stage.lessons
          .filter((lesson) => lesson.audioReady !== false)
          .flatMap(lessonAudioPaths),
      ),
    ]),
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

/** @param {unknown} error */
const isQuotaError = (error) =>
  error instanceof Error &&
  (error.name === 'QuotaExceededError' || /quota/i.test(error.message));

/**
 * 通用下載器：把還沒在快取裡的項目抓下來（音檔與單字圖片共用，避免兩套實作分歧）。
 * 已存在的略過；單一項目失敗不會中斷其他項目，失敗的列在結果裡，再執行一次只補抓失敗與缺少的。
 * 成功以 store.has 重新讀到實際快取內容為準，不以請求已送出為準。
 * retries 只重試暫時性錯誤；容量不足不重試，直接回報。
 *
 * @template T
 * @param {T[]} items
 * @param {{ has(item: T): Promise<boolean>, save(item: T): Promise<void> }} store
 * @param {{
 *   concurrency?: number,
 *   retries?: number,
 *   wait?: (attempt: number) => Promise<void>,
 *   label?: (item: T) => string,
 *   notRetainedMessage?: string,
 *   onProgress?: (progress: DownloadProgress) => void,
 *   signal?: AbortSignal,
 * }} [options]
 * @returns {Promise<DownloadResult>}
 */
export async function downloadMissing(items, store, options = {}) {
  const {
    concurrency = DEFAULT_CONCURRENCY,
    retries = 0,
    wait = (attempt) => new Promise((r) => setTimeout(r, 500 * attempt)),
    label = String,
    notRetainedMessage = '檔案未保留在快取中，請檢查可用儲存空間後重試。',
    onProgress,
    signal,
  } = options;
  const cachedFlags = await Promise.all(items.map((item) => store.has(item)));
  const missing = items.filter((_, i) => !cachedFlags[i]);

  /** @type {DownloadResult} */
  const result = {
    total: items.length,
    skipped: items.length - missing.length,
    downloaded: 0,
    failed: [],
  };

  let next = 0;
  let done = 0;
  onProgress?.({ done, total: missing.length });

  /** @param {T} item */
  const attempt = async (item) => {
    for (let tries = 0; ; tries++) {
      try {
        await store.save(item);
        if (!(await store.has(item))) throw new Error(notRetainedMessage);
        return;
      } catch (error) {
        if (isQuotaError(error)) {
          throw new Error('儲存空間不足，請清出空間後再試；已下載的檔案會保留。');
        }
        if (tries >= retries || signal?.aborted) throw error;
        await wait(tries + 1);
      }
    }
  };

  const worker = async () => {
    while (next < missing.length && !signal?.aborted) {
      const item = missing[next++];
      try {
        await attempt(item);
        result.downloaded++;
      } catch (error) {
        result.failed.push({
          path: label(item),
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
export function downloadAudio(paths, store, options = {}) {
  return downloadMissing([...new Set(paths)], store, {
    ...options,
    notRetainedMessage: '音檔未保留在快取中，請檢查可用儲存空間後重試。',
  });
}
