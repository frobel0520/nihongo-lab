import {
  emptyProgress,
  parseProgress,
  serializeProgress,
  type Progress,
} from '../../lib/progress.mjs';

const KEY = 'nihongo-lab:progress:v1';
const BACKUP_KEY = `${KEY}:backup`;

export type LoadResult = { progress: Progress; warning: string | null };

/**
 * 讀取進度。localStorage 不可用或存檔壞掉時退回空進度並回傳警告，
 * 壞掉的原始內容另存備份，避免之後的存檔把它蓋掉。
 */
export function loadProgress(): LoadResult {
  let raw: string | null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return {
      progress: emptyProgress(),
      warning: '無法讀取瀏覽器儲存空間，這次的進度不會被保存。',
    };
  }

  const { progress, problem, dropped } = parseProgress(raw);
  if (problem && raw !== null) {
    try {
      localStorage.setItem(BACKUP_KEY, raw);
    } catch {
      // 備份失敗不影響繼續使用
    }
    return {
      progress,
      warning:
        problem === 'version'
          ? `存檔來自較新的版本，已改用空白進度（原存檔備份在 ${BACKUP_KEY}）。`
          : `存檔內容損毀，已改用空白進度（原存檔備份在 ${BACKUP_KEY}）。`,
    };
  }
  if (dropped > 0) {
    return { progress, warning: `有 ${dropped} 筆進度格式不正確，已略過。` };
  }
  return { progress, warning: null };
}

/** 存進度；失敗時回傳給使用者看的訊息，成功回傳 null。 */
export function saveProgress(progress: Progress): string | null {
  try {
    localStorage.setItem(KEY, serializeProgress(progress));
    return null;
  } catch {
    return '無法儲存進度（瀏覽器儲存空間已滿或被停用），關掉頁面後這次的進度會消失。';
  }
}
