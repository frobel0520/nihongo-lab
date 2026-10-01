/**
 * 跟讀（shadowing）的純邏輯：播放一次，之後留白讓使用者自己念出來，再播下一輪，
 * 一直重複到使用者按停止（沒有輪數上限，T34）。不含調速；留白長度跟著句子長度走。
 */

const MIN_GAP_MS = 1000;

/**
 * 兩輪之間的留白毫秒數：句長的 1.2 倍再加 0.3 秒，至少 1 秒。
 * 讀不到長度（音檔沒載入、NaN、Infinity）時退回下限。
 *
 * @param {number} durationSec
 */
export function gapMs(durationSec) {
  const seconds =
    Number.isFinite(durationSec) && durationSec > 0 ? durationSec : 0;
  return Math.max(MIN_GAP_MS, Math.round(seconds * 1200) + 300);
}
