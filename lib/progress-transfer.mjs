/**
 * 進度匯出／匯入（純邏輯）：把進度存成一個 JSON 檔、再讀回來。
 * 檔案外層多一層 format／exportedAt，讀回時才分得出「這是不是本 App 匯出的」；
 * 進度本身沿用 localStorage 的格式與驗證（parseProgress），單筆壞掉只略過那一筆。
 * 匯入不覆蓋：呼叫端要用 mergeProgress 併進現有進度，匯入舊備份不會把新進度洗掉。
 *
 * @typedef {import('./progress.mjs').Progress} Progress
 * @typedef {{ ok: true, progress: Progress, dropped: number } | { ok: false, message: string }} ImportResult
 */
import { parseProgress } from './progress.mjs';
import { toDateString } from './srs.mjs';

export const EXPORT_FORMAT = 'nihongo-lab-progress';
/** 進度檔再大也不會到這個量級（約 1,000 張卡加幾百句聽寫是 200KB 上下），超過就是選錯檔。 */
export const MAX_IMPORT_BYTES = 5 * 1024 * 1024;

/**
 * @param {Progress} progress
 * @param {string} now ISO 時間字串
 */
export function exportProgress(progress, now) {
  return JSON.stringify(
    { format: EXPORT_FORMAT, exportedAt: now, progress },
    null,
    2,
  );
}

/** @param {Date} [date] */
export function exportFilename(date = new Date()) {
  return `nihongo-progress-${toDateString(date)}.json`;
}

/**
 * @param {string} text 檔案內容
 * @returns {ImportResult}
 */
export function parseImport(text) {
  /** @type {unknown} */
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, message: '這個檔案不是有效的 JSON，沒有匯入任何東西。' };
  }
  if (
    typeof data !== 'object' ||
    data === null ||
    /** @type {Record<string, unknown>} */ (data).format !== EXPORT_FORMAT
  ) {
    return {
      ok: false,
      message: '這不是本 App 匯出的進度檔，沒有匯入任何東西。',
    };
  }

  // 沒有 progress 欄位時 stringify 回傳 undefined，退成 'null'，之後會被當成內容損毀。
  const { progress, problem, dropped } = parseProgress(
    JSON.stringify(/** @type {Record<string, unknown>} */ (data).progress) ??
      'null',
  );
  if (problem === 'version') {
    return {
      ok: false,
      message: '這個進度檔來自較新的版本，請先更新 App（重新載入）再匯入。',
    };
  }
  if (problem) {
    return { ok: false, message: '進度檔的內容損毀，沒有匯入任何東西。' };
  }
  return { ok: true, progress, dropped };
}
