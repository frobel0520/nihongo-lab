// 效能門檻（T120）。指標定義、量測環境與來由見 docs/project-sd.md「效能 Release Gate」。
// 改門檻要記錄 Change Request，不為了讓結果通過而放寬。

/** @type {import('../lib/perf-stats.mjs').Budget[]} */
export const BUNDLE_BUDGETS = [
  // 迴歸門檻：T120 基準（主程式 gzip 524,703 bytes、precache 17,913,219 bytes）加 5%，CI 每次 build 檢查。
  { metric: 'mainJsGzipBytes', limit: 551_000, unit: 'bytes' },
  { metric: 'cssGzipBytes', limit: 6_000, unit: 'bytes' },
  { metric: 'precacheBytes', limit: 18_800_000, unit: 'bytes' },
];

/** 操作時的同步計算（Node、桌機）。p95 50ms 約等於 4 倍慢的手機 200ms，對應 INP「良好」上限。
 * @type {import('../lib/perf-stats.mjs').Budget[]} */
export const LOGIC_BUDGETS = [
  { metric: 'homeSummaryMs', stat: 'p95', limit: 50, unit: 'ms' },
  { metric: 'lessonProgressMs', stat: 'p95', limit: 50, unit: 'ms' },
  { metric: 'buildDeckMs', stat: 'p95', limit: 50, unit: 'ms' },
  { metric: 'gradeAndSaveMs', stat: 'p95', limit: 50, unit: 'ms' },
  { metric: 'dictationCompareMs', stat: 'p95', limit: 50, unit: 'ms' },
];

/** 手機情境頁面載入（scripts/perf-page.mjs）。LCP、TBT 取 Core Web Vitals／Lighthouse「良好」上限。
 * @type {import('../lib/perf-stats.mjs').Budget[]} */
export const PAGE_BUDGETS = [
  { metric: 'home.cold.lcpMs', stat: 'p95', limit: 2500, unit: 'ms' },
  { metric: 'lesson.cold.lcpMs', stat: 'p95', limit: 2500, unit: 'ms' },
  { metric: 'home.warm.lcpMs', stat: 'p95', limit: 1500, unit: 'ms' },
  { metric: 'lesson.warm.lcpMs', stat: 'p95', limit: 1500, unit: 'ms' },
  { metric: 'home.cold.tbtMs', stat: 'p95', limit: 200, unit: 'ms' },
  { metric: 'lesson.cold.tbtMs', stat: 'p95', limit: 200, unit: 'ms' },
  { metric: 'lessonDownload.ms', stat: 'p95', limit: 5000, unit: 'ms' },
];
