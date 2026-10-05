/**
 * 兩份進度合併（純邏輯）：匯入檔案、之後的跨裝置同步都走這一支。
 * 規則（單人、多裝置，兩份進度各自記錄過學習的情況）：
 * - 單字卡：逐張比 updatedAt，新的整張取代舊的；只有一邊有的就保留。
 *   時間完全相同時用固定的順序決定，所以 merge(a, b) 與 merge(b, a) 結果一樣、重複合併不會變。
 * - 聽寫：逐句取聯集——通過過就算通過（跟本機規則一致，答對不會被別台的答錯洗掉）、
 *   次數取兩邊較大的（兩邊的次數包含彼此同步前的歷史，相加會重複算）、最後時間取較晚的。
 * 限制：兩台裝置在沒有互相同步的期間答了同一張卡，只留較晚的那一次；裝置時鐘差太多時「較晚」
 * 也會不準。個人使用下可接受，不另外保留衝突紀錄。
 *
 * @typedef {import('./progress.mjs').Progress} Progress
 * @typedef {import('./progress.mjs').StoredCard} StoredCard
 * @typedef {import('./progress.mjs').DictationRecord} DictationRecord
 * @typedef {{ srs: number, dictation: number }} MergeChanges
 */
import { emptyProgress } from './progress.mjs';

/** @param {StoredCard} a @param {StoredCard} b */
const sameCard = (a, b) =>
  a.stability === b.stability &&
  a.difficulty === b.difficulty &&
  a.state === b.state &&
  a.reps === b.reps &&
  a.lapses === b.lapses &&
  a.due === b.due &&
  a.firstSeen === b.firstSeen &&
  a.updatedAt === b.updatedAt;

/** @param {DictationRecord} a @param {DictationRecord} b */
const sameRecord = (a, b) =>
  a.attempts === b.attempts && a.passed === b.passed && a.lastAt === b.lastAt;

/**
 * 同一張卡兩邊都有時留哪一張：updatedAt 較晚的；相同就比欄位內容，
 * 讓結果與傳入順序無關。
 *
 * @param {StoredCard} a
 * @param {StoredCard} b
 */
function newerCard(a, b) {
  if (a.updatedAt !== b.updatedAt) return a.updatedAt > b.updatedAt ? a : b;
  return JSON.stringify(a) >= JSON.stringify(b) ? a : b;
}

/**
 * @param {Progress} local
 * @param {Progress} incoming
 * @returns {{ progress: Progress, changes: MergeChanges }}
 *   changes：合併結果裡「相對 local 有新增或不同」的筆數（匯入後告訴使用者實際影響了多少）。
 */
export function mergeProgress(local, incoming) {
  const progress = emptyProgress();
  const changes = { srs: 0, dictation: 0 };

  for (const id of new Set([
    ...Object.keys(local.srs),
    ...Object.keys(incoming.srs),
  ])) {
    const a = local.srs[id];
    const b = incoming.srs[id];
    const winner = a && b ? newerCard(a, b) : (a ?? b);
    progress.srs[id] = winner;
    if (!a || !sameCard(a, winner)) changes.srs++;
  }

  for (const id of new Set([
    ...Object.keys(local.dictation),
    ...Object.keys(incoming.dictation),
  ])) {
    const a = local.dictation[id];
    const b = incoming.dictation[id];
    const merged =
      a && b
        ? {
            attempts: Math.max(a.attempts, b.attempts),
            passed: a.passed || b.passed,
            lastAt: a.lastAt >= b.lastAt ? a.lastAt : b.lastAt,
          }
        : /** @type {DictationRecord} */ (a ?? b);
    progress.dictation[id] = merged;
    if (!a || !sameRecord(a, merged)) changes.dictation++;
  }

  return { progress, changes };
}
