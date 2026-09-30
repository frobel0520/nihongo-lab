/**
 * service worker 更新檢查的節流判斷（純邏輯，方便用 node --test 驗證）。
 *
 * 背景：部署新版後，舊版 service worker 會先服務舊的 bundle，使用者要重新整理兩次才看到新版。
 * 畫面在新的 service worker 接管時提示「已更新，重新載入即可使用」（app/useSwUpdate.ts），
 * 並在回到前景時主動檢查更新；安裝成 PWA 後很少重新整理，瀏覽器自己的檢查太少。
 */

/** 回到前景時最多每 10 分鐘主動檢查一次更新，避免頻繁切換分頁一直打伺服器。 */
export const UPDATE_CHECK_INTERVAL_MS = 10 * 60 * 1000;

/**
 * 該不該現在主動檢查更新。
 *
 * @param {number | null} lastCheckedAt 上次檢查的時間（毫秒），沒檢查過為 null
 * @param {number} now
 * @param {number} [interval]
 */
export function shouldCheckForUpdate(
  lastCheckedAt,
  now,
  interval = UPDATE_CHECK_INTERVAL_MS,
) {
  return lastCheckedAt === null || now - lastCheckedAt >= interval;
}
