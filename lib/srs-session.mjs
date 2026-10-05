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
 * - 同一輪的評分紀錄（history，T53）：答「還不會」後一輪繞回來再評，是「再考一次」，要接在後面
 *   （FSRS 依序算：先記一次忘記，再記同一天答對）；用上一張／下一張回頭改，是「改掉剛才按錯的」，
 *   換掉最後一個。自動繞回來的卡記在 revisit，畫面也會先蓋住答案再考一次。
 *
 * @typedef {import('./srs.mjs').Card} Card
 * @typedef {import('./srs.mjs').CardState} CardState
 * @typedef {import('./srs.mjs').Grade} Grade
 * @typedef {{
 *   deck: Card[],
 *   index: number,
 *   grades: Record<string, Grade>,
 *   before: Record<string, CardState | null>,
 *   history: Record<string, Grade[]>,
 *   revisit: Record<string, boolean>,
 * }} Session
 */

/** @param {Card[]} deck @returns {Session} */
export function createSession(deck) {
  return { deck, index: 0, grades: {}, before: {}, history: {}, revisit: {} };
}

/**
 * 這張卡是不是「答過還不會、一輪後自動繞回來」：是的話答案先蓋住，下一次評分接在紀錄後面。
 *
 * @param {Session} session
 * @param {Card} card
 */
export const isRevisit = (session, card) => session.revisit[card.id] === true;

/**
 * 如果現在替這張卡評 grade，這一輪的評分紀錄會變成什麼（記錄進度與預告間隔都用它）。
 *
 * @param {Session} session
 * @param {Card} card
 * @param {Grade} grade
 * @returns {Grade[]}
 */
export function nextHistory(session, card, grade) {
  const history = session.history[card.id] ?? [];
  return history.length === 0 || isRevisit(session, card)
    ? [...history, grade]
    : [...history.slice(0, -1), grade];
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
  if (index === session.index) return session;
  // 手動翻到的卡是「回頭看／改評分」，不是一輪後的再考一次。
  const landed = session.deck[index];
  return { ...session, index, revisit: { ...session.revisit, [landed.id]: false } };
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
  const next = {
    ...session,
    before,
    grades: { ...session.grades, [card.id]: grade },
    history: { ...session.history, [card.id]: nextHistory(session, card, grade) },
    revisit: { ...session.revisit, [card.id]: false },
  };
  const index = nextUnresolved(next, session.index);
  const landed = next.deck[index];
  // 自動跳到的卡如果這一輪已經評過（答過還不會），就是一輪後的再考一次。
  const revisit =
    landed && next.grades[landed.id] !== undefined
      ? { ...next.revisit, [landed.id]: true }
      : next.revisit;
  return { ...next, index, revisit };
}
