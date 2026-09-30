/**
 * 學習進度的讀寫。純邏輯：儲存空間由呼叫端注入（瀏覽器傳 localStorage，測試傳假的），
 * 所以讀不到、寫不進、資料損毀、兩個分頁同時開這些情況都能用 node --test 驗證。
 *
 * @typedef {import('./progress.mjs').Progress} Progress
 * @typedef {{
 *   getItem(key: string): string | null,
 *   setItem(key: string, value: string): void,
 * }} StorageLike
 * @typedef {{ progress: Progress, warning: string | null }} LoadResult
 * @typedef {{ progress: Progress, saveError: string | null }} UpdateResult
 */
import {
  emptyProgress,
  parseProgress,
  serializeProgress,
} from './progress.mjs';

export const PROGRESS_KEY = 'nihongo-lab:progress:v1';
export const BACKUP_KEY = `${PROGRESS_KEY}:backup`;

const UNAVAILABLE = '無法讀取瀏覽器儲存空間，這次的進度不會被保存。';
const SAVE_FAILED =
  '無法儲存進度（瀏覽器儲存空間已滿或被停用），關掉頁面後這次的進度會消失。';

/**
 * 把讀到的原文備份起來，避免之後的存檔把它蓋掉。回傳有沒有備份成功。
 *
 * @param {StorageLike | null} storage
 * @param {string} raw
 */
function backUp(storage, raw) {
  try {
    storage?.setItem(BACKUP_KEY, raw);
    return storage !== null;
  } catch {
    return false;
  }
}

/**
 * 讀取進度。儲存空間不可用、存檔損毀、版本未知或有單筆格式不對時，仍回傳可用的進度（最差是空進度）
 * 加一則警告；有問題的原文一律備份，不會被之後的存檔蓋掉。警告由畫面顯示，使用者按掉才消失。
 *
 * @param {StorageLike | null} storage
 * @returns {LoadResult}
 */
export function loadProgress(storage) {
  /** @type {string | null} */
  let raw;
  try {
    if (!storage) throw new Error('no storage');
    raw = storage.getItem(PROGRESS_KEY);
  } catch {
    return { progress: emptyProgress(), warning: UNAVAILABLE };
  }

  const { progress, problem, dropped } = parseProgress(raw);
  if (raw === null || (!problem && dropped === 0)) {
    return { progress, warning: null };
  }

  const backedUp = backUp(storage, raw);
  const where = backedUp
    ? `原存檔備份在 ${BACKUP_KEY}`
    : '原存檔也無法備份，請不要清除瀏覽器資料，先自行複製';
  if (problem === 'version') {
    return {
      progress,
      warning: `存檔來自較新的版本，已改用空白進度（${where}）。`,
    };
  }
  if (problem === 'corrupt') {
    return { progress, warning: `存檔內容損毀，已改用空白進度（${where}）。` };
  }
  return {
    progress,
    warning: `有 ${dropped} 筆進度格式不正確，已略過（${where}）。`,
  };
}

/**
 * 存進度；失敗時回傳給使用者看的訊息，成功回傳 null。
 *
 * @param {StorageLike | null} storage
 * @param {Progress} progress
 * @returns {string | null}
 */
export function saveProgress(storage, progress) {
  try {
    if (!storage) throw new Error('no storage');
    storage.setItem(PROGRESS_KEY, serializeProgress(progress));
    return null;
  } catch {
    return SAVE_FAILED;
  }
}

/**
 * 讀出儲存空間裡「現在」的進度；讀不到、還沒存過或格式有問題時回傳 null。
 *
 * @param {StorageLike | null} storage
 * @returns {Progress | null}
 */
function readLatest(storage) {
  try {
    const raw = storage?.getItem(PROGRESS_KEY) ?? null;
    if (raw === null) return null;
    const { progress, problem } = parseProgress(raw);
    return problem ? null : progress;
  } catch {
    return null;
  }
}

/**
 * 更新進度：先重讀儲存空間裡最新的進度再套用變更，才不會蓋掉另一個分頁（例如 PWA 與瀏覽器分頁
 * 同時開著）剛存的進度；讀不到最新的就退回這個分頁記憶體裡的進度。同一張卡兩邊都改，後存的贏。
 *
 * @param {StorageLike | null} storage
 * @param {Progress} fallback 這個分頁記憶體裡目前的進度
 * @param {(prev: Progress) => Progress} change
 * @returns {UpdateResult}
 */
export function updateProgress(storage, fallback, change) {
  const progress = change(readLatest(storage) ?? fallback);
  return { progress, saveError: saveProgress(storage, progress) };
}

/**
 * 另一個分頁寫入進度時（storage 事件）要採用的進度；新值格式有問題就回傳 null，維持目前的進度。
 *
 * @param {string | null} newValue
 * @returns {Progress | null}
 */
export function adoptExternalProgress(newValue) {
  if (newValue === null) return null;
  const { progress, problem } = parseProgress(newValue);
  return problem ? null : progress;
}
