/**
 * 學習進度的資料形狀、驗證與序列化（純邏輯；實際讀寫 localStorage 在 app/lib/storage.ts）。
 *
 * 版本 2 起每張單字卡多一個 updatedAt（ISO 時間，最後一次評分的時刻），跨裝置合併時逐張比新舊
 * （見 progress-merge.mjs）。版本 1 的存檔讀進來時自動轉成版本 2，不遺失任何欄位。
 *
 * @typedef {import('./srs.mjs').CardState & { updatedAt: string }} StoredCard
 * @typedef {{ attempts: number, passed: boolean, lastAt: string }} DictationRecord
 * @typedef {{ version: 2, srs: Record<string, StoredCard>, dictation: Record<string, DictationRecord> }} Progress
 * @typedef {{ progress: Progress, problem: null | 'corrupt' | 'version', dropped: number }} ParseResult
 */
import { addDays, isDateString, schedule } from './srs.mjs';

export const PROGRESS_VERSION = 2;
/** 版本 1 的存檔：單字卡沒有 updatedAt。 */
const LEGACY_VERSION = 1;

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
  if (data.version !== PROGRESS_VERSION && data.version !== LEGACY_VERSION) {
    return { progress: emptyProgress(), problem: 'version', dropped: 0 };
  }
  const legacy = data.version === LEGACY_VERSION;

  const progress = emptyProgress();
  let dropped = 0;

  for (const [id, card] of Object.entries(isRecord(data.srs) ? data.srs : {})) {
    if (
      isRecord(card) &&
      typeof card.ease === 'number' &&
      Number.isFinite(card.ease) &&
      isCount(card.interval) &&
      isCount(card.reps) &&
      isCount(card.lapses) &&
      isDateString(/** @type {string} */ (card.due)) &&
      isDateString(/** @type {string} */ (card.firstSeen)) &&
      (legacy || isTimestamp(card.updatedAt))
    ) {
      const due = /** @type {string} */ (card.due);
      progress.srs[id] = {
        ease: card.ease,
        interval: card.interval,
        reps: card.reps,
        lapses: card.lapses,
        due,
        firstSeen: /** @type {string} */ (card.firstSeen),
        updatedAt: legacy
          ? legacyUpdatedAt(due, card.interval)
          : /** @type {string} */ (card.updatedAt),
      };
    } else {
      dropped++;
    }
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
  return {
    ...progress,
    srs: {
      ...progress.srs,
      [id]: { ...schedule(progress.srs[id], grade, today), updatedAt: now },
    },
  };
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
