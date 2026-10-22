// 效能門檻（T120）。指標定義、量測環境與來由見 docs/project-sd.md「效能 Release Gate」。
// 改門檻要記錄 Change Request，不為了讓結果通過而放寬。

// T120 實測原始基準；保留歷史值，不以目前產物重新建立基準。
export const T120_PRECACHE_BASELINE_BYTES = 17_913_219;

/** @type {import('../lib/perf-stats.mjs').Budget[]} */
export const BUNDLE_BUDGETS = [
  // 主程式／CSS維持T120已核准門檻；2026-10-22 T153只將precache改為同一原始基準＋50%。
  // 歷史上限21,500,000為人工約整，未定義通用規則；本次明定向上取整至1 byte：26,869,829。
  { metric: 'mainJsGzipBytes', limit: 630_000, unit: 'bytes' },
  { metric: 'cssGzipBytes', limit: 5_800, unit: 'bytes' },
  { metric: 'precacheBytes', limit: Math.ceil(T120_PRECACHE_BASELINE_BYTES * 1.5), unit: 'bytes' },
];
