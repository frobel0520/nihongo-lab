/**
 * 清除 App 快取的純邏輯（不碰 DOM、不碰 localStorage；瀏覽器物件由呼叫端注入，測試傳假的）。
 *
 * 清的是「可以再下載回來」的東西：Cache Storage（離線音檔、workbox 預先快取的程式檔、字型）
 * 與 service worker 註冊。學習進度與顯示偏好存在 localStorage，這支函式沒有拿到 localStorage，
 * 也就不可能動到它——「清快取不會掉進度」是靠這個結構保證，而不是靠小心。
 *
 * 為什麼不叫使用者去手機設定清：那邊的「清除資料」會連 localStorage 一起清掉，進度就沒了。
 *
 * @typedef {{
 *   keys(): Promise<string[]>,
 *   delete(name: string): Promise<boolean>,
 * }} CacheStorageLike
 * @typedef {{
 *   getRegistrations(): Promise<readonly { unregister(): Promise<boolean> }[]>,
 * }} ServiceWorkerContainerLike
 * @typedef {{
 *   cachesDeleted: number,
 *   workersUnregistered: number,
 *   failed: string[],
 * }} ClearResult
 */

/** @param {unknown} error */
const messageOf = (error) =>
  error instanceof Error ? error.message : String(error);

/**
 * 刪掉所有 Cache Storage 與 service worker 註冊。單一項目失敗不會中斷其他項目，失敗的列在 failed；
 * 環境不支援（沒有 caches 或 serviceWorker）就當作沒東西可清，不算失敗。
 *
 * @param {{
 *   caches?: CacheStorageLike,
 *   serviceWorker?: ServiceWorkerContainerLike,
 * }} env
 * @returns {Promise<ClearResult>}
 */
export async function clearAppCaches({ caches, serviceWorker }) {
  /** @type {ClearResult} */
  const result = { cachesDeleted: 0, workersUnregistered: 0, failed: [] };

  if (caches) {
    try {
      const names = await caches.keys();
      const outcomes = await Promise.allSettled(
        names.map((name) => caches.delete(name)),
      );
      outcomes.forEach((outcome, i) => {
        if (outcome.status === 'fulfilled') {
          if (outcome.value) result.cachesDeleted++;
        } else {
          result.failed.push(`快取 ${names[i]}：${messageOf(outcome.reason)}`);
        }
      });
    } catch (error) {
      result.failed.push(`快取：${messageOf(error)}`);
    }
  }

  if (serviceWorker) {
    try {
      const registrations = await serviceWorker.getRegistrations();
      const outcomes = await Promise.allSettled(
        registrations.map((r) => r.unregister()),
      );
      outcomes.forEach((outcome) => {
        if (outcome.status === 'fulfilled') {
          if (outcome.value) result.workersUnregistered++;
        } else {
          result.failed.push(`service worker：${messageOf(outcome.reason)}`);
        }
      });
    } catch (error) {
      result.failed.push(`service worker：${messageOf(error)}`);
    }
  }

  return result;
}
