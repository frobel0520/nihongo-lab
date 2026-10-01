/**
 * 單字卡一輪複習的流程（純邏輯，T32）：這一輪的牌組、目前看到第幾張、每張卡這一輪最後評了什麼。
 *
 * - 牌組是進入畫面時排好的佇列（到期的舊卡＋新卡），整輪固定，同一張卡只出現一次。
 * - 可以用上一張／下一張在牌組裡自由移動（不評分就是跳過）。
 * - 評「記得」＝這張卡這一輪完成；評「還不會」＝這一輪還要再看。評分後自動跳到後面「還沒完成」的下一張，
 *   後面沒有了就繞回前面還沒完成的；全部完成才算結束（index 等於牌組長度）。
 *   這跟舊版「還不會的卡排到佇列尾端」的順序一致，只是現在也能手動往回翻。
 * - 回頭改評分：排程要從「這一輪第一次評分之前」的狀態重算，不然同一張卡這一輪評兩次，
 *   間隔會被推進兩次。所以第一次評分時記下當時的狀態（before）。
 *
 * @typedef {import('./srs.mjs').Card} Card
 * @typedef {import('./srs.mjs').CardState} CardState
 * @typedef {import('./srs.mjs').Grade} Grade
 * @typedef {{
 *   deck: Card[],
 *   index: number,
 *   grades: Record<string, Grade>,
 *   before: Record<string, CardState | null>,
 * }} Session
 */

/** @param {Card[]} deck @returns {Session} */
export function createSession(deck) {
  return { deck, index: 0, grades: {}, before: {} };
}

/** @param {Session} session @returns {Card | null} 結束了或牌組是空的就是 null */
export function currentCard(session) {
  return session.deck[session.index] ?? null;
}

/** @param {Session} session */
export function isFinished(session) {
  return session.index >= session.deck.length;
}

/** 這一輪已完成（評了「記得」）的張數。 @param {Session} session */
export function resolvedCount(session) {
  return session.deck.filter((card) => session.grades[card.id] === 'good')
    .length;
}

/**
 * 往前或往後移動 delta 張；停在第一張與最後一張，不繞圈，也不會直接跳到「結束」。
 * 結束的畫面上往回翻（delta 為負）會回到最後一張。
 *
 * @param {Session} session
 * @param {number} delta
 * @returns {Session}
 */
export function step(session, delta) {
  if (session.deck.length === 0) return session;
  const last = session.deck.length - 1;
  const from = Math.min(session.index, last + (delta < 0 ? 1 : 0));
  const index = Math.max(0, Math.min(last, from + delta));
  return index === session.index ? session : { ...session, index };
}

/**
 * 從 from 的下一張開始，繞一圈找第一張還沒完成的；沒有就回傳牌組長度（結束）。
 *
 * @param {Session} session
 * @param {number} from
 */
function nextUnresolved(session, from) {
  const { deck, grades } = session;
  for (let offset = 1; offset <= deck.length; offset++) {
    const position = (from + offset) % deck.length;
    if (grades[deck[position].id] !== 'good') return position;
  }
  return deck.length;
}

/**
 * 這張卡排程要用的「這一輪評分之前」的狀態：第一次評分前就是現在的進度，
 * 之後（回頭改評分、預覽間隔）固定用第一次評分時記下的那一份。
 *
 * @param {Session} session
 * @param {Card} card
 * @param {CardState | undefined} current 進度裡現在這張卡的狀態
 * @returns {CardState | undefined}
 */
export function baseState(session, card, current) {
  const saved = session.before[card.id];
  return saved === undefined ? current : (saved ?? undefined);
}

/**
 * 替目前這張卡評分，回傳新的流程狀態（自動跳到下一張還沒完成的）。
 *
 * @param {Session} session
 * @param {Grade} grade
 * @param {CardState | undefined} current 進度裡現在這張卡的狀態（第一次評分時記為 before）
 * @returns {Session}
 */
export function applyGrade(session, grade, current) {
  const card = currentCard(session);
  if (!card) return session;
  const before =
    session.before[card.id] === undefined
      ? { ...session.before, [card.id]: current ?? null }
      : session.before;
  const next = { ...session, before, grades: { ...session.grades, [card.id]: grade } };
  return { ...next, index: nextUnresolved(next, session.index) };
}
