/**
 * 學習進度的資料形狀、驗證與序列化（純邏輯；實際讀寫 localStorage 在 app/lib/storage.ts）。
 *
 * @typedef {import('./srs.mjs').SrsState} SrsState
 * @typedef {{ attempts: number, passed: boolean, lastAt: string }} DictationRecord
 * @typedef {{ version: 1, srs: SrsState, dictation: Record<string, DictationRecord> }} Progress
 * @typedef {{ progress: Progress, problem: null | 'corrupt' | 'version', dropped: number }} ParseResult
 */
import { isDateString } from './srs.mjs';

export const PROGRESS_VERSION = 1;

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
  if (data.version !== PROGRESS_VERSION) {
    return { progress: emptyProgress(), problem: 'version', dropped: 0 };
  }

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
      isDateString(/** @type {string} */ (card.firstSeen))
    ) {
      progress.srs[id] = {
        ease: card.ease,
        interval: card.interval,
        reps: card.reps,
        lapses: card.lapses,
        due: /** @type {string} */ (card.due),
        firstSeen: /** @type {string} */ (card.firstSeen),
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
