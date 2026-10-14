// 量測操作時的同步計算延遲（T120）：每次評分、聽寫比對、首頁與課程清單重算時在主執行緒上跑的程式。
// node scripts/perf-logic.mjs [--samples 200] [--check]
// 進度資料用「全部卡片都複習過、全部句子都聽寫過」的最大量合成資料，不讀使用者真實進度。
import { performance } from 'node:perf_hooks';
import { stages } from '../curriculum/lessons.mjs';
import { STUDY_CATALOG } from '../lib/study-catalog.mjs';
import { buildDeck, schedule, summarize, toDateString } from '../lib/srs.mjs';
import { compareDictation } from '../lib/dictation.mjs';
import { lessonProgress } from '../lib/lesson-progress.mjs';
import {
  emptyProgress,
  recordDictation,
  recordReviewSequence,
  serializeProgress,
} from '../lib/progress.mjs';
import { evaluateBudgets, gatePassed, summarizeSamples } from '../lib/perf-stats.mjs';
import { LOGIC_BUDGETS } from './perf-budget.mjs';

const i = process.argv.indexOf('--samples');
const samples = i === -1 ? 200 : Number(process.argv[i + 1]);
if (!Number.isInteger(samples) || samples < 20)
  throw new Error('--samples 需為至少 20 的整數');

const cards = Object.values(STUDY_CATALOG).flatMap((c) => c.cards);
const sentences = Object.values(STUDY_CATALOG).flatMap((c) => c.sentences);
const today = toDateString(new Date('2026-10-14T12:00:00'));
const now = '2026-10-14T04:00:00.000Z';

let progress = emptyProgress();
for (const card of cards)
  progress.srs[card.id] = schedule(undefined, 'good', '2026-10-01', '2026-10-01T04:00:00.000Z');
for (const s of sentences) progress = recordDictation(progress, s.id, true, now);

/** @param {() => unknown} fn */
function measure(fn) {
  for (let n = 0; n < 20; n++) fn();
  const times = [];
  for (let n = 0; n < samples; n++) {
    const start = performance.now();
    fn();
    times.push(performance.now() - start);
  }
  return summarizeSamples(times);
}

const target = sentences.find((s) => s.jp.length >= 20) ?? sentences[0];
const measured = {
  // 首頁「今天的複習」：全部類別的卡片統計。
  homeSummaryMs: measure(() => summarize(cards, progress.srs, today)),
  // 課程清單：每課的單字／聽寫／理解／文法進度。
  lessonProgressMs: measure(() => lessonProgress(stages, progress)),
  // 進入單字卡：排出最大類別的複習牌組。
  buildDeckMs: measure(() => buildDeck('review', cards, progress.srs, today)),
  // 按一次評分：排程 + 寫回進度 + 序列化存檔。
  gradeAndSaveMs: measure(() =>
    serializeProgress(
      recordReviewSequence(progress, cards[0].id, progress.srs[cards[0].id], ['good'], today, now),
    ),
  ),
  // 送出一次聽寫：比對較長句子。
  dictationCompareMs: measure(() =>
    compareDictation(target.jp.slice(0, -2) + 'あ', [target.jp, target.reading ?? target.jp]),
  ),
};

console.log(
  JSON.stringify(
    { node: process.version, samples, cards: cards.length, sentences: sentences.length, measured },
    null,
    2,
  ),
);

if (process.argv.includes('--check')) {
  const results = evaluateBudgets(measured, LOGIC_BUDGETS);
  for (const r of results)
    console.log(`${r.status.padEnd(12)} ${r.metric} ${r.stat} ${r.value?.toFixed(3)} / ${r.limit} ${r.unit}`);
  if (!gatePassed(results)) process.exit(1);
}
