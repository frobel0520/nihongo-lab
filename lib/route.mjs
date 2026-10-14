/**
 * 網址 hash 路由（純邏輯）。分頁各一個 hash，課程採「首頁 → 學習方向 → 單一課程」三層：
 *   #/            課程首頁          #/lesson/<課程 id>  單一課程
 *   #/courses/<階段 id> 學習方向課程清單
 *   #/srs  #/dictation  #/shadowing  #/settings
 *   #/srs 是單字卡的複習區，#/srs/new 是新卡區（T52）
 * 課程頁用 hash 記在網址裡，手機的返回鍵才會從單一課程回到清單，而不是直接離開 App。
 *
 * @typedef {'lessons' | 'srs' | 'dictation' | 'shadowing' | 'settings' | 'games'} ViewId
 * @typedef {{ view: ViewId, lessonId?: string, stageId?: string, gameId?: string, characterId?: string, srsMode?: 'new' }} Route
 */

/** @type {readonly ViewId[]} */
export const VIEWS = [
  'lessons',
  'srs',
  'dictation',
  'shadowing',
  'settings',
  'games',
];

const LESSON_PREFIX = '#/lesson/';
const STAGE_PREFIX = '#/courses/';

/** @param {string} stageId */
export const stageHash = (stageId) =>
  `${STAGE_PREFIX}${encodeURIComponent(stageId)}`;
export const NEW_CARDS_HASH = '#/srs/new';

/** @param {ViewId} view */
export const viewHash = (view) => (view === 'lessons' ? '#/' : `#/${view}`);

/** 單字卡的兩區。 @param {'review' | 'new'} mode */
export const srsHash = (mode) =>
  mode === 'new' ? NEW_CARDS_HASH : viewHash('srs');

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
  if (hash.startsWith(STAGE_PREFIX)) {
    try {
      const stageId = decodeURIComponent(hash.slice(STAGE_PREFIX.length));
      if (/^stage-[0-3]$/.test(stageId)) return { view: 'lessons', stageId };
    } catch {
      /* 壞編碼退回課程首頁。 */
    }
    return { view: 'lessons' };
  }
  if (hash.startsWith('#/games/')) {
    try {
      const parts = hash
        .slice('#/games/'.length)
        .split('/')
        .map(decodeURIComponent);
      if (parts.length <= 2 && parts.every(Boolean))
        return {
          view: 'games',
          gameId: parts[0],
          ...(parts[1] ? { characterId: parts[1] } : {}),
        };
    } catch {
      /* 壞編碼回遊戲清單。 */
    }
    return { view: 'games' };
  }
  if (hash.startsWith(LESSON_PREFIX)) {
    try {
      const lessonId = decodeURIComponent(hash.slice(LESSON_PREFIX.length));
      if (lessonId !== '') return { view: 'lessons', lessonId };
    } catch {
      // 壞掉的百分比編碼：退回課程清單
    }
    return { view: 'lessons' };
  }
  if (hash === NEW_CARDS_HASH) return { view: 'srs', srsMode: 'new' };
  const view = VIEWS.find((v) => hash === viewHash(v));
  return { view: view ?? 'lessons' };
}

/** @param {string} [gameId] @param {string} [characterId] */
export const gameHash = (gameId, characterId) =>
  gameId
    ? `#/games/${encodeURIComponent(gameId)}${characterId ? '/' + encodeURIComponent(characterId) : ''}`
    : '#/games';
