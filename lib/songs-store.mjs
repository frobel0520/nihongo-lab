/**
 * 歌曲的讀寫（純邏輯，儲存空間由呼叫端注入）。跟學習進度分開存：歌詞只留在這個瀏覽器，
 * 不進跨裝置同步。寫法與 progress-store.mjs 相同：存檔壞掉時備份原文、寫入失敗明確提示、
 * 更新前重讀最新存檔，避免兩個分頁互相蓋掉。
 *
 * @typedef {import('./progress-store.mjs').StorageLike} StorageLike
 * @typedef {import('./songs.mjs').SongsDoc} SongsDoc
 */
import { emptySongs, parseSongs, serializeSongs } from './songs.mjs';

export const SONGS_KEY = 'nihongo-lab:songs:v1';
export const SONGS_BACKUP_KEY = `${SONGS_KEY}:backup`;

const UNAVAILABLE = '無法讀取瀏覽器儲存空間，這次新增的歌曲不會被保存。';
const SAVE_FAILED =
  '無法儲存歌曲（瀏覽器儲存空間已滿或被停用），關掉頁面後這次的變更會消失；可以先匯出備份。';

/**
 * @param {StorageLike | null} storage
 * @returns {{ doc: SongsDoc, warning: string | null }}
 */
export function loadSongs(storage) {
  /** @type {string | null} */
  let raw;
  try {
    if (!storage) throw new Error('no storage');
    raw = storage.getItem(SONGS_KEY);
  } catch {
    return { doc: emptySongs(), warning: UNAVAILABLE };
  }
  const { doc, problem, dropped } = parseSongs(raw);
  if (raw === null || (!problem && dropped === 0)) return { doc, warning: null };

  let backedUp = false;
  try {
    storage.setItem(SONGS_BACKUP_KEY, raw);
    backedUp = true;
  } catch {
    // 備份不了就在訊息裡說明
  }
  const where = backedUp
    ? `原存檔備份在 ${SONGS_BACKUP_KEY}`
    : '原存檔也無法備份，請不要清除瀏覽器資料';
  if (problem === 'version') {
    return { doc, warning: `歌曲存檔來自較新的版本，暫時不顯示（${where}）。` };
  }
  if (problem === 'corrupt') {
    return { doc, warning: `歌曲存檔內容損毀，暫時不顯示（${where}）。` };
  }
  return { doc, warning: `有 ${dropped} 首歌格式不正確，已略過（${where}）。` };
}

/**
 * @param {StorageLike | null} storage
 * @param {SongsDoc} doc
 * @returns {string | null} 失敗時給使用者看的訊息
 */
export function saveSongs(storage, doc) {
  try {
    if (!storage) throw new Error('no storage');
    storage.setItem(SONGS_KEY, serializeSongs(doc));
    return null;
  } catch {
    return SAVE_FAILED;
  }
}

/**
 * 更新前重讀最新存檔（另一個分頁可能剛存過）；讀不到或格式有問題時用這個分頁記憶體裡的。
 *
 * @param {StorageLike | null} storage
 * @param {SongsDoc} fallback
 * @param {(prev: SongsDoc) => SongsDoc} change
 * @returns {{ doc: SongsDoc, saveError: string | null }}
 */
export function updateSongs(storage, fallback, change) {
  let latest = null;
  try {
    const raw = storage?.getItem(SONGS_KEY) ?? null;
    if (raw !== null) {
      const parsed = parseSongs(raw);
      if (!parsed.problem) latest = parsed.doc;
    }
  } catch {
    latest = null;
  }
  const doc = change(latest ?? fallback);
  return { doc, saveError: saveSongs(storage, doc) };
}

/**
 * 另一個分頁寫入歌曲時（storage 事件）要採用的內容；格式有問題回傳 null。
 *
 * @param {string | null} newValue
 * @returns {SongsDoc | null}
 */
export function adoptExternalSongs(newValue) {
  if (newValue === null) return null;
  const { doc, problem } = parseSongs(newValue);
  return problem ? null : doc;
}
