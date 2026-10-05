/**
 * SRS 單字卡的純邏輯（無 DOM、無儲存），方便用 node --test 驗證。
 *
 * 排程用 FSRS（Free Spaced Repetition Scheduler，T53；套件 ts-fsrs，MIT）。每張卡記三個量：
 * - 穩定度 stability：記憶「從剛複習完降到 90% 記得」要幾天，越大越不容易忘；
 * - 難度 difficulty：1～10，越難的卡每次複習後穩定度長得越慢；
 * - 可提取度 retrievability：現在還記得的機率，由穩定度與距離上次複習的天數算出（不存）。
 * 答「記得」後，下次複習排在「記得的機率掉到 DESIRED_RETENTION」那天；答「還不會」穩定度下降、
 * 難度上升，而且今天就再出現（以「天」為單位，到期日用本機日期字串 YYYY-MM-DD）。
 * 按鈕只有兩級（還不會＝Again、記得＝Good），FSRS 兩級也能用；每天練習的阻力比評分的細緻度更重要。
 *
 * @typedef {'again' | 'good'} Grade
 * @typedef {{
 *   stability: number,
 *   difficulty: number,
 *   state: number,
 *   reps: number,
 *   lapses: number,
 *   due: string,
 *   firstSeen: string,
 *   updatedAt: string,
 * }} CardState
 *   state 是 ts-fsrs 的 State（0 新卡、1 學習中、2 複習、3 重新學習）；updatedAt 是最後一次評分的時刻
 *   （ISO），FSRS 用它算距離上次複習幾天，跨裝置合併也用它比新舊。
 * @typedef {Record<string, CardState>} SrsState
 * @typedef {{
 *   id: string,
 *   word: string,
 *   reading: string,
 *   zh: string,
 *   audio: string,
 *   audioReady: boolean,
 *   lessonId: string,
 *   lessonTitle: string,
 * }} Card
 */
import { Rating, State, createEmptyCard, fsrs, generatorParameters } from 'ts-fsrs';

/** @type {readonly Grade[]} */
export const GRADES = ['again', 'good'];

/** 目標記憶率：答「記得」後，排在預估記得的機率掉到 90% 的那天。 */
export const DESIRED_RETENTION = 0.9;
/** 間隔上限：連續答對不會把到期日推到幾十年後。 */
export const MAX_INTERVAL_DAYS = 365;

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

// 參數用 ts-fsrs 的預設（FSRS-6），不打亂到期日（enable_fuzz: false，結果可重現、好測試）；
// 不設分鐘級的學習步驟：「還不會」今天再看，由這個 App 的一輪流程處理。
const scheduler = fsrs(
  generatorParameters({
    request_retention: DESIRED_RETENTION,
    maximum_interval: MAX_INTERVAL_DAYS,
    enable_fuzz: false,
    enable_short_term: true,
    learning_steps: [],
    relearning_steps: [],
  }),
);

/** @type {Record<Grade, import('ts-fsrs').Grade>} */
const RATING = { again: Rating.Again, good: Rating.Good };

/** @param {number} value */
const round4 = (value) => Math.round(value * 10000) / 10000;

/** 本機日期 a 到 b 差幾天。 @param {string} a @param {string} b */
export function daysBetween(a, b) {
  const [y1, m1, d1] = a.split('-').map(Number);
  const [y2, m2, d2] = b.split('-').map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
}

/**
 * @param {CardState | undefined} prev
 * @param {Date} at
 * @returns {import('ts-fsrs').Card}
 */
function toFsrsCard(prev, at) {
  if (!prev) return createEmptyCard(at);
  return {
    due: at,
    stability: prev.stability,
    difficulty: prev.difficulty,
    elapsed_days: 0,
    scheduled_days: 0,
    learning_steps: 0,
    reps: prev.reps,
    lapses: prev.lapses,
    state: /** @type {State} */ (prev.state),
    last_review: new Date(prev.updatedAt),
  };
}

/**
 * 依評分算出卡片的新狀態；prev 為 undefined 表示第一次看到這張卡。
 * 「還不會」到期日是今天（同一輪會再出現）；「記得」依 FSRS 排到記得的機率降到目標值的那天，
 * 至少 1 天、最多 MAX_INTERVAL_DAYS 天。不認得的評分直接丟錯，不默默當成記得。
 *
 * @param {CardState | undefined} prev
 * @param {Grade} grade
 * @param {string} today 本機日期 YYYY-MM-DD（算到期日）
 * @param {string} now ISO 時間（評分時刻，FSRS 用它算距離上次複習多久）
 * @returns {CardState}
 */
export function schedule(prev, grade, today, now) {
  if (!GRADES.includes(grade)) {
    throw new Error(`未知的評分：${String(grade)}`);
  }
  const at = new Date(now);
  const { card } = scheduler.next(toFsrsCard(prev, at), at, RATING[grade]);
  const interval =
    grade === 'again'
      ? 0
      : Math.min(MAX_INTERVAL_DAYS, Math.max(1, Math.round(card.scheduled_days)));
  return {
    stability: round4(card.stability),
    difficulty: round4(card.difficulty),
    state: card.state,
    reps: card.reps,
    lapses: card.lapses,
    due: addDays(today, interval),
    firstSeen: prev?.firstSeen ?? today,
    updatedAt: now,
  };
}

/**
 * 同一輪裡依序的評分（例如「還不會」之後繞回來答「記得」）：從這一輪之前的狀態依序套用。
 *
 * @param {CardState | undefined} prev
 * @param {readonly Grade[]} grades
 * @param {string} today
 * @param {string} now
 * @returns {CardState | undefined}
 */
export function scheduleSequence(prev, grades, today, now) {
  return grades.reduce(
    (/** @type {CardState | undefined} */ state, grade) => schedule(state, grade, today, now),
    prev,
  );
}

/** 卡片今天之後幾天到期（0 表示今天）。 @param {CardState} state @param {string} today */
export const daysUntilDue = (state, today) => Math.max(0, daysBetween(today, state.due));

// 舊版（SM-2 簡化版）進度轉成 FSRS 狀態用的初始值：新卡第一次答「還不會」／「記得」後的狀態。
const AFTER_FIRST_AGAIN = scheduler.next(createEmptyCard(new Date(0)), new Date(0), Rating.Again).card;
const AFTER_FIRST_GOOD = scheduler.next(createEmptyCard(new Date(0)), new Date(0), Rating.Good).card;

/**
 * 舊版（SM-2 簡化版：ease、interval）的卡片轉成 FSRS 狀態。沒有逐次的作答紀錄，只能估：
 * - 正在「還不會」（reps 為 0）：當成新卡答過「還不會」後的穩定度與難度；
 * - 答過「記得」：穩定度用舊的間隔（SM-2 的間隔本來就是預估還記得的天數，最少 1 天），
 *   難度依有沒有答錯過，取新卡第一次答「還不會」或「記得」後的難度。
 * 到期日、首次看到的日期、最後評分時刻都沿用，所以轉換當下不會改變哪天該複習。
 *
 * @param {{ ease: number, interval: number, reps: number, lapses: number, due: string, firstSeen: string, updatedAt: string }} old
 * @returns {CardState}
 */
export function fromLegacyCard(old) {
  const failing = old.reps === 0;
  const base = failing || old.lapses > 0 ? AFTER_FIRST_AGAIN : AFTER_FIRST_GOOD;
  return {
    stability: round4(failing ? AFTER_FIRST_AGAIN.stability : Math.max(1, old.interval)),
    difficulty: round4(base.difficulty),
    state: State.Review,
    reps: old.reps + old.lapses,
    lapses: old.lapses,
    due: old.due,
    firstSeen: old.firstSeen,
    updatedAt: old.updatedAt,
  };
}

/**
 * 從課程資料攤平出所有單字卡；id 用「課程 id + 單字」，教材增補不會讓舊進度錯位。
 * 音檔還沒合成的課程（audioReady 為 false）單字仍然收進來，因為字、讀音、意思不需要音檔就能背；
 * 卡片的 audioReady 為 false 時，畫面不顯示播放鈕。
 *
 * @param {{ lessons: { id: string, title: string, audioReady?: boolean, vocab: { word: string, reading: string, zh: string, audio: string }[] }[] }[]} stages
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
          audioReady: lesson.audioReady !== false,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
        });
      }
    }
  }
  return cards;
}

/**
 * 單字卡分成兩區（T52）：複習（看過、今天到期，含答「還不會」的）與新卡（還沒看過的）。
 * 分開是因為「還不會」的卡今天一直到期，舊版把它們全排在新卡前面，累積多了就永遠輪不到新卡。
 *
 * @typedef {'review' | 'new'} SrsMode
 */

/** @type {readonly SrsMode[]} */
export const SRS_MODES = ['review', 'new'];

/**
 * 複習區的牌組：看過而且今天到期的卡，越久沒看越前面（同一天到期的照教材順序）。
 * 已不在教材裡的卡片（state 有、cards 沒有）直接略過，不刪進度。
 *
 * @param {Card[]} cards
 * @param {SrsState} state
 * @param {string} today
 * @returns {Card[]}
 */
export function buildReviewQueue(cards, state, today) {
  return cards
    .filter((c) => state[c.id] && state[c.id].due <= today)
    .sort((a, b) => state[a.id].due.localeCompare(state[b.id].due));
}

/**
 * 新卡區的牌組：所有還沒看過的卡，依教材順序，不設每日上限。
 *
 * @param {Card[]} cards
 * @param {SrsState} state
 * @returns {Card[]}
 */
export function buildNewQueue(cards, state) {
  return cards.filter((c) => !state[c.id]);
}

/**
 * @param {SrsMode} mode
 * @param {Card[]} cards
 * @param {SrsState} state
 * @param {string} today
 * @returns {Card[]}
 */
export const buildDeck = (mode, cards, state, today) =>
  mode === 'new' ? buildNewQueue(cards, state) : buildReviewQueue(cards, state, today);

/**
 * @param {Card[]} cards
 * @param {SrsState} state
 * @param {string} today
 */
export function summarize(cards, state, today) {
  const learned = cards.filter((c) => state[c.id]).length;
  const due = cards.filter(
    (c) => state[c.id] && state[c.id].due <= today,
  ).length;
  return { total: cards.length, learned, due, fresh: cards.length - learned };
}
