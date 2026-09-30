/**
 * SRS 單字卡的純邏輯（無 DOM、無儲存），方便用 node --test 驗證。
 * 排程是 SM-2 的簡化版：四級評分、以「天」為單位，到期日用本機日期字串 YYYY-MM-DD。
 *
 * @typedef {'again' | 'hard' | 'good' | 'easy'} Grade
 * @typedef {{
 *   ease: number,
 *   interval: number,
 *   reps: number,
 *   lapses: number,
 *   due: string,
 *   firstSeen: string,
 * }} CardState
 * @typedef {Record<string, CardState>} SrsState
 * @typedef {{
 *   id: string,
 *   word: string,
 *   reading: string,
 *   zh: string,
 *   audio: string,
 *   lessonId: string,
 *   lessonTitle: string,
 * }} Card
 */

/** @type {readonly Grade[]} */
export const GRADES = ['again', 'hard', 'good', 'easy'];

export const DEFAULT_EASE = 2.5;
export const MIN_EASE = 1.3;
export const NEW_CARDS_PER_DAY = 10;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** @param {string} value */
export function isDateString(value) {
  if (typeof value !== 'string' || !DATE_PATTERN.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
}

/** 本機時區的 YYYY-MM-DD。 @param {Date} [date] */
export function toDateString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** 用本機日曆加天數（不受夏令時間影響）。 @param {string} dateString @param {number} days */
export function addDays(dateString, days) {
  const [y, m, d] = dateString.split('-').map(Number);
  return toDateString(new Date(y, m - 1, d + days));
}

/** @param {number} value */
const round2 = (value) => Math.round(value * 100) / 100;

/**
 * 依評分算出卡片的新狀態；prev 為 undefined 表示第一次看到這張卡。
 * again 到期日是今天（同一輪會再出現），其餘至少隔一天。
 *
 * @param {CardState | undefined} prev
 * @param {Grade} grade
 * @param {string} today
 * @returns {CardState}
 */
export function schedule(prev, grade, today) {
  const base = prev ?? {
    ease: DEFAULT_EASE,
    interval: 0,
    reps: 0,
    lapses: 0,
    due: today,
    firstSeen: today,
  };

  if (grade === 'again') {
    return {
      ...base,
      ease: round2(Math.max(MIN_EASE, base.ease - 0.2)),
      interval: 0,
      reps: 0,
      lapses: base.lapses + 1,
      due: today,
    };
  }

  let interval;
  let ease = base.ease;
  if (grade === 'hard') {
    interval = Math.max(1, Math.round(base.interval * 1.2));
    ease = Math.max(MIN_EASE, ease - 0.15);
  } else if (grade === 'good') {
    interval =
      base.reps === 0
        ? 1
        : base.reps === 1
          ? 3
          : Math.round(base.interval * ease);
  } else {
    interval =
      base.reps === 0
        ? 3
        : base.reps === 1
          ? 6
          : Math.round(base.interval * ease * 1.3);
    ease += 0.15;
  }

  return {
    ...base,
    ease: round2(ease),
    interval,
    reps: base.reps + 1,
    due: addDays(today, interval),
  };
}

/**
 * 從課程資料攤平出所有單字卡；id 用「課程 id + 單字」，教材增補不會讓舊進度錯位。
 *
 * @param {{ lessons: { id: string, title: string, vocab: { word: string, reading: string, zh: string, audio: string }[] }[] }[]} stages
 * @returns {Card[]}
 */
export function buildCards(stages) {
  /** @type {Card[]} */
  const cards = [];
  for (const stage of stages) {
    for (const lesson of stage.lessons) {
      for (const v of lesson.vocab) {
        cards.push({
          id: `${lesson.id}:${v.word}`,
          word: v.word,
          reading: v.reading,
          zh: v.zh,
          audio: v.audio,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
        });
      }
    }
  }
  return cards;
}

/**
 * 今天的複習佇列：先到期的舊卡（越久沒看越前面），再補當天還沒用完的新卡額度。
 * 已不在教材裡的卡片（state 有、cards 沒有）直接略過，不刪進度。
 *
 * @param {Card[]} cards
 * @param {SrsState} state
 * @param {string} today
 * @param {number} [newLimit]
 * @returns {Card[]}
 */
export function buildQueue(cards, state, today, newLimit = NEW_CARDS_PER_DAY) {
  const due = cards
    .filter((c) => state[c.id] && state[c.id].due <= today)
    .sort((a, b) => state[a.id].due.localeCompare(state[b.id].due));
  const introducedToday = cards.filter(
    (c) => state[c.id]?.firstSeen === today,
  ).length;
  const fresh = cards
    .filter((c) => !state[c.id])
    .slice(0, Math.max(0, newLimit - introducedToday));
  return [...due, ...fresh];
}

/**
 * @param {Card[]} cards
 * @param {SrsState} state
 * @param {string} today
 * @param {number} [newLimit]
 */
export function summarize(cards, state, today, newLimit = NEW_CARDS_PER_DAY) {
  const learned = cards.filter((c) => state[c.id]).length;
  const due = cards.filter(
    (c) => state[c.id] && state[c.id].due <= today,
  ).length;
  const introducedToday = cards.filter(
    (c) => state[c.id]?.firstSeen === today,
  ).length;
  const fresh = Math.min(
    cards.length - learned,
    Math.max(0, newLimit - introducedToday),
  );
  return { total: cards.length, learned, due, fresh };
}
