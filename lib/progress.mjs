/**
 * 學習進度的資料形狀、驗證與序列化（純邏輯；實際讀寫 localStorage 在 app/lib/storage.ts）。
 *
 * 版本 2 起每張單字卡多一個 updatedAt（ISO 時間，最後一次評分的時刻），跨裝置合併時逐張比新舊
 * （見 progress-merge.mjs）。版本 3（T53）起單字卡改存 FSRS 的穩定度、難度與狀態（見 srs.mjs），
 * 版本 1、2（SM-2 簡化版的 ease、interval）讀進來時自動轉換，到期日與評分時刻不變。
 *
 * @typedef {import('./srs.mjs').CardState} StoredCard
 * @typedef {{ attempts: number, passed: boolean, lastAt: string }} DictationRecord
 * @typedef {{ version: 3, srs: Record<string, StoredCard>, dictation: Record<string, DictationRecord> }} Progress
 * @typedef {{ progress: Progress, problem: null | 'corrupt' | 'version', dropped: number }} ParseResult
 */
import {
  addDays,
  fromLegacyCard,
  isDateString,
  schedule,
  scheduleSequence,
} from './srs.mjs';

export const PROGRESS_VERSION = 3;
/** 版本 1 的存檔：單字卡沒有 updatedAt。 */
const LEGACY_VERSION = 1;
/** 版本 2 的存檔：單字卡是 SM-2 簡化版的 ease、interval。 */
const SM2_VERSION = 2;

const TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

/**
 * 只收 Date#toISOString 的格式：同一種格式的字串，字典序就是時間先後，合併時才能直接比字串。
 *
 * @param {unknown} value
 * @returns {value is string}
 */
export function isTimestamp(value) {
  return (
    typeof value === 'string' &&
    TIMESTAMP_PATTERN.test(value) &&
    !Number.isNaN(Date.parse(value))
  );
}

/** @returns {Progress} */
export function emptyProgress() {
  return { version: PROGRESS_VERSION, srs: {}, dictation: {} };
}

/** @param {unknown} value @returns {value is Record<string, unknown>} */
const isRecord = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** @param {unknown} value @returns {value is number} */
const isCount = (value) =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0;

/** @param {unknown} value @returns {value is number} */
const isPositive = (value) =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

/**
 * 版本 1 的卡沒有更新時間，用排程狀態倒推最後一次評分的日期：評分當天 due = 當天 + interval
 * （答「還不會」時 interval 為 0，due 就是當天），所以 due − interval 就是那一天。
 * 只精確到日（當天 00:00 UTC），夠讓兩台各自用過舊版的裝置在第一次合併時分出誰比較新。
 *
 * @param {string} due
 * @param {number} interval
 */
function legacyUpdatedAt(due, interval) {
  return `${addDays(due, -interval)}T00:00:00.000Z`;
}

/**
 * 版本 1、2 的卡（SM-2 簡化版）：驗證後轉成 FSRS 狀態；格式不對回傳 null。
 *
 * @param {unknown} card
 * @param {boolean} legacy 版本 1（沒有 updatedAt）
 * @returns {StoredCard | null}
 */
function parseSm2Card(card, legacy) {
  if (
    !isRecord(card) ||
    typeof card.ease !== 'number' ||
    !Number.isFinite(card.ease) ||
    !isCount(card.interval) ||
    !isCount(card.reps) ||
    !isCount(card.lapses) ||
    !isDateString(/** @type {string} */ (card.due)) ||
    !isDateString(/** @type {string} */ (card.firstSeen)) ||
    !(legacy || isTimestamp(card.updatedAt))
  ) {
    return null;
  }
  const due = /** @type {string} */ (card.due);
  return fromLegacyCard({
    ease: card.ease,
    interval: card.interval,
    reps: card.reps,
    lapses: card.lapses,
    due,
    firstSeen: /** @type {string} */ (card.firstSeen),
    updatedAt: legacy
      ? legacyUpdatedAt(due, card.interval)
      : /** @type {string} */ (card.updatedAt),
  });
}

/**
 * 版本 3 的卡（FSRS）：格式不對回傳 null。
 *
 * @param {unknown} card
 * @returns {StoredCard | null}
 */
function parseFsrsCard(card) {
  if (
    !isRecord(card) ||
    !isPositive(card.stability) ||
    typeof card.difficulty !== 'number' ||
    !(card.difficulty >= 1 && card.difficulty <= 10) ||
    !(isCount(card.state) && card.state <= 3) ||
    !isCount(card.reps) ||
    !isCount(card.lapses) ||
    !isDateString(/** @type {string} */ (card.due)) ||
    !isDateString(/** @type {string} */ (card.firstSeen)) ||
    !isTimestamp(card.updatedAt)
  ) {
    return null;
  }
  return {
    stability: card.stability,
    difficulty: card.difficulty,
    state: card.state,
    reps: card.reps,
    lapses: card.lapses,
    due: /** @type {string} */ (card.due),
    firstSeen: /** @type {string} */ (card.firstSeen),
    updatedAt: card.updatedAt,
  };
}

/**
 * 解析 localStorage 存的字串。null 代表還沒存過，不算問題；
 * 壞掉的 JSON 或未知版本回傳空進度並標出 problem，由呼叫端決定是否備份、提示使用者。
 * 單筆卡片格式不對只丟掉那一筆，不讓一筆壞資料清掉全部進度。
 *
 * @param {string | null} raw
 * @returns {ParseResult}
 */
export function parseProgress(raw) {
  if (raw === null)
    return { progress: emptyProgress(), problem: null, dropped: 0 };

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return { progress: emptyProgress(), problem: 'corrupt', dropped: 0 };
  }
  if (!isRecord(data))
    return { progress: emptyProgress(), problem: 'corrupt', dropped: 0 };
  if (
    data.version !== PROGRESS_VERSION &&
    data.version !== SM2_VERSION &&
    data.version !== LEGACY_VERSION
  ) {
    return { progress: emptyProgress(), problem: 'version', dropped: 0 };
  }
  const legacy = data.version === LEGACY_VERSION;
  const sm2 = data.version !== PROGRESS_VERSION;

  const progress = emptyProgress();
  let dropped = 0;

  for (const [id, card] of Object.entries(isRecord(data.srs) ? data.srs : {})) {
    const parsed = sm2 ? parseSm2Card(card, legacy) : parseFsrsCard(card);
    if (parsed) progress.srs[id] = parsed;
    else dropped++;
  }

  for (const [id, rec] of Object.entries(
    isRecord(data.dictation) ? data.dictation : {},
  )) {
    if (
      isRecord(rec) &&
      isCount(rec.attempts) &&
      typeof rec.passed === 'boolean' &&
      typeof rec.lastAt === 'string'
    ) {
      progress.dictation[id] = {
        attempts: rec.attempts,
        passed: rec.passed,
        lastAt: rec.lastAt,
      };
    } else {
      dropped++;
    }
  }

  return { progress, problem: null, dropped };
}

/** @param {Progress} progress */
export function serializeProgress(progress) {
  return JSON.stringify(progress);
}

/**
 * 進度的「內容指紋」：內容相同就產生同一個字串，與物件的鍵順序無關（合併、解析、記錄評分
 * 各自建出來的物件鍵順序可能不同，直接比 JSON 字串會誤判成不一樣）。同步用它判斷
 * 「本機有沒有還沒上傳的變更」。
 *
 * @param {Progress} progress
 */
export function fingerprintProgress(progress) {
  const srs = Object.keys(progress.srs)
    .sort()
    .map((id) => {
      const c = progress.srs[id];
      return [id, c.stability, c.difficulty, c.state, c.reps, c.lapses, c.due, c.firstSeen, c.updatedAt];
    });
  const dictation = Object.keys(progress.dictation)
    .sort()
    .map((id) => {
      const r = progress.dictation[id];
      return [id, r.attempts, r.passed, r.lastAt];
    });
  return JSON.stringify([progress.version, srs, dictation]);
}

/**
 * 記錄一次單字卡評分：排程結果加上評分的時刻（跨裝置合併用）。
 *
 * @param {Progress} progress
 * @param {string} id
 * @param {import('./srs.mjs').Grade} grade
 * @param {string} today 本機日期 YYYY-MM-DD（排程用）
 * @param {string} now ISO 時間字串（updatedAt）
 * @returns {Progress}
 */
export function recordReview(progress, id, grade, today, now) {
  return recordReviewFrom(progress, id, progress.srs[id], grade, today, now);
}

/**
 * 同 recordReview，但排程用指定的「之前的狀態」而不是進度裡現在的：
 * 同一輪裡回頭改評分時，從第一次評分之前的狀態重算，間隔不會被推進兩次。
 *
 * @param {Progress} progress
 * @param {string} id
 * @param {import('./srs.mjs').CardState | undefined} prev
 * @param {import('./srs.mjs').Grade} grade
 * @param {string} today
 * @param {string} now
 * @returns {Progress}
 */
export function recordReviewFrom(progress, id, prev, grade, today, now) {
  return {
    ...progress,
    srs: { ...progress.srs, [id]: schedule(prev, grade, today, now) },
  };
}

/**
 * 同一輪裡這張卡依序的評分（例如「還不會」之後繞回來答「記得」），從這一輪之前的狀態依序套用；
 * 回頭改評分時呼叫端會把最後一次換掉，所以間隔不會被推進兩次（見 srs-session.mjs）。
 *
 * @param {Progress} progress
 * @param {string} id
 * @param {import('./srs.mjs').CardState | undefined} prev 這一輪之前的狀態
 * @param {readonly import('./srs.mjs').Grade[]} grades 至少一個
 * @param {string} today
 * @param {string} now
 * @returns {Progress}
 */
export function recordReviewSequence(progress, id, prev, grades, today, now) {
  const next = scheduleSequence(prev, grades, today, now);
  if (!next) throw new Error('沒有評分可以記錄');
  return { ...progress, srs: { ...progress.srs, [id]: next } };
}

/**
 * 記錄一次聽寫結果；passed 一旦為 true 就保留（completed 代表曾經成功完成）。
 *
 * @param {Progress} progress
 * @param {string} id
 * @param {boolean} correct
 * @param {string} now ISO 時間字串
 * @returns {Progress}
 */
export function recordDictation(progress, id, correct, now) {
  const prev = progress.dictation[id];
  return {
    ...progress,
    dictation: {
      ...progress.dictation,
      [id]: {
        attempts: (prev?.attempts ?? 0) + 1,
        passed: (prev?.passed ?? false) || correct,
        lastAt: now,
      },
    },
  };
}
