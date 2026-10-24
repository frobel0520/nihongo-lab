/**
 * 圖片有新版時的提醒（T163）。只讀 localStorage 兩個小字串，不開 Cache API、不載入圖片清單：
 * - complete：最後一次確認「全部圖片已存好」時的清單指紋；從沒下載完過就沒有，也就不提醒。
 * - dismissed：使用者對哪個指紋按過「知道了」，同一版本不再出現。
 * 指紋不同代表有圖片新增或修訂，已下載的人離線時那幾張會只顯示文字。
 */
import { shouldRemindImageUpdate } from '../../lib/vocab-image-offline.mjs';

const COMPLETE_KEY = 'nihongo-lab:vocab-images:complete';
const DISMISSED_KEY = 'nihongo-lab:vocab-images:hint-dismissed';

const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // 存不了只是少一個提醒，不影響學習。
  }
};

export const markImagesCompleteFor = (fingerprint: string) => {
  if (read(COMPLETE_KEY) !== fingerprint) write(COMPLETE_KEY, fingerprint);
};

export const dismissImageUpdateHint = (fingerprint: string) =>
  write(DISMISSED_KEY, fingerprint);

/** 這個瀏覽器還沒有「完成紀錄」（T163 以前下載的人都沒有）。 */
export const hasImageCompleteRecord = () => read(COMPLETE_KEY) !== null;

/**
 * T163 以前已下載完全部圖片的人沒有完成紀錄。沒有紀錄時才在閒置時數一次明確下載快取的筆數：
 * 筆數達到目前總張數（舊版本也算一筆），視為曾經下載完，記成「舊版」以便提醒補下載新圖。
 * 只讀 keys 數量，不讀內容；之後有紀錄就不再檢查。
 */
export async function adoptEarlierCompleteDownload(total: number, cacheName: string) {
  if (hasImageCompleteRecord() || typeof caches === 'undefined') return false;
  try {
    const keys = await (await caches.open(cacheName)).keys();
    if (keys.length < total) return false;
    write(COMPLETE_KEY, 'before-t163');
    return true;
  } catch {
    return false;
  }
}

export const shouldShowImageUpdateHint = (fingerprint: string) =>
  shouldRemindImageUpdate(fingerprint, read(COMPLETE_KEY), read(DISMISSED_KEY));
