/**
 * 網址 hash 路由（純邏輯）。分頁各一個 hash，課程與歌曲另有「清單 → 單一項目」兩層：
 *   #/            課程清單          #/lesson/<課程 id>  單一課程
 *   #/srs  #/dictation  #/shadowing  #/settings
 *   #/songs       歌曲清單          #/songs/new         新增歌曲
 *   #/song/<id>   單首歌曲          #/song/<id>/edit    編輯歌曲
 * 課程頁、歌曲頁用 hash 記在網址裡，手機的返回鍵才會回到清單，而不是直接離開 App。
 *
 * @typedef {'lessons' | 'srs' | 'dictation' | 'shadowing' | 'songs' | 'settings'} ViewId
 * @typedef {{ view: ViewId, lessonId?: string, songId?: string, mode?: 'new' | 'edit' }} Route
 */

/** @type {readonly ViewId[]} */
export const VIEWS = ['lessons', 'srs', 'dictation', 'shadowing', 'songs', 'settings'];

const LESSON_PREFIX = '#/lesson/';
const SONG_PREFIX = '#/song/';
const EDIT_SUFFIX = '/edit';
export const NEW_SONG_HASH = '#/songs/new';

/** @param {ViewId} view */
export const viewHash = (view) => (view === 'lessons' ? '#/' : `#/${view}`);

/** @param {string} lessonId */
export const lessonHash = (lessonId) =>
  `${LESSON_PREFIX}${encodeURIComponent(lessonId)}`;

/** @param {string} songId */
export const songHash = (songId) => `${SONG_PREFIX}${encodeURIComponent(songId)}`;

/** @param {string} songId */
export const songEditHash = (songId) => `${songHash(songId)}${EDIT_SUFFIX}`;

/** 百分比解碼；壞掉的編碼或空字串回 null。 @param {string} encoded */
function decodeId(encoded) {
  try {
    const id = decodeURIComponent(encoded);
    return id === '' ? null : id;
  } catch {
    return null;
  }
}

/**
 * 認不得的 hash 一律當成課程清單，不丟錯、不留空白畫面；歌曲 id 壞掉時退回歌曲清單。
 *
 * @param {string} hash
 * @returns {Route}
 */
export function parseRoute(hash) {
  if (hash.startsWith(LESSON_PREFIX)) {
    const lessonId = decodeId(hash.slice(LESSON_PREFIX.length));
    return lessonId ? { view: 'lessons', lessonId } : { view: 'lessons' };
  }
  if (hash === NEW_SONG_HASH) return { view: 'songs', mode: 'new' };
  if (hash.startsWith(SONG_PREFIX)) {
    const rest = hash.slice(SONG_PREFIX.length);
    const editing = rest.endsWith(EDIT_SUFFIX);
    const songId = decodeId(editing ? rest.slice(0, -EDIT_SUFFIX.length) : rest);
    if (!songId) return { view: 'songs' };
    return editing ? { view: 'songs', songId, mode: 'edit' } : { view: 'songs', songId };
  }
  const view = VIEWS.find((v) => hash === viewHash(v));
  return { view: view ?? 'lessons' };
}
