/**
 * 網址 hash 路由（純邏輯）。分頁各一個 hash，課程另有「課程清單 → 單一課程」兩層：
 *   #/            課程清單          #/lesson/<課程 id>  單一課程
 *   #/srs  #/dictation  #/shadowing  #/settings
 * 課程頁用 hash 記在網址裡，手機的返回鍵才會從單一課程回到清單，而不是直接離開 App。
 *
 * @typedef {'lessons' | 'srs' | 'dictation' | 'shadowing' | 'settings'} ViewId
 * @typedef {{ view: ViewId, lessonId?: string }} Route
 */

/** @type {readonly ViewId[]} */
export const VIEWS = ['lessons', 'srs', 'dictation', 'shadowing', 'settings'];

const LESSON_PREFIX = '#/lesson/';

/** @param {ViewId} view */
export const viewHash = (view) => (view === 'lessons' ? '#/' : `#/${view}`);

/** @param {string} lessonId */
export const lessonHash = (lessonId) =>
  `${LESSON_PREFIX}${encodeURIComponent(lessonId)}`;

/**
 * 認不得的 hash 一律當成課程清單，不丟錯、不留空白畫面。
 *
 * @param {string} hash
 * @returns {Route}
 */
export function parseRoute(hash) {
  if (hash.startsWith(LESSON_PREFIX)) {
    try {
      const lessonId = decodeURIComponent(hash.slice(LESSON_PREFIX.length));
      if (lessonId !== '') return { view: 'lessons', lessonId };
    } catch {
      // 壞掉的百分比編碼：退回課程清單
    }
    return { view: 'lessons' };
  }
  const view = VIEWS.find((v) => hash === viewHash(v));
  return { view: view ?? 'lessons' };
}
