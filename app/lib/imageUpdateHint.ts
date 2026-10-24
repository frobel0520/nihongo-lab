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

export const shouldShowImageUpdateHint = (fingerprint: string) =>
  shouldRemindImageUpdate(fingerprint, read(COMPLETE_KEY), read(DISMISSED_KEY));
