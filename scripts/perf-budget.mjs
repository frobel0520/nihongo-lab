// 效能門檻（T120）。指標定義、量測環境與來由見 docs/project-sd.md「效能 Release Gate」。
// 改門檻要記錄 Change Request，不為了讓結果通過而放寬。

/** @type {import('../lib/perf-stats.mjs').Budget[]} */
export const BUNDLE_BUDGETS = [
  // 迴歸門檻：T120 基準（主程式 gzip 524,703 bytes、CSS gzip 4,817、precache 17,913,219 bytes）加 20%，CI 每次 build 檢查。
  // 2026-10-15 使用者選定 +20%（原提案 +5%）：擋住失控成長，又不讓下一批教材立刻被擋。
  { metric: 'mainJsGzipBytes', limit: 630_000, unit: 'bytes' },
  { metric: 'cssGzipBytes', limit: 5_800, unit: 'bytes' },
  { metric: 'precacheBytes', limit: 21_500_000, unit: 'bytes' },
];
