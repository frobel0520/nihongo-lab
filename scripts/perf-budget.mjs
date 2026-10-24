// 效能門檻（T120）。指標定義、量測環境與來由見 docs/project-sd.md「效能 Release Gate」。
// 改門檻要記錄 Change Request，不為了讓結果通過而放寬。

// T120 實測原始基準；保留歷史值，不以目前產物重新建立基準。
export const T120_PRECACHE_BASELINE_BYTES = 17_913_219;

// T163 新增指標（Change Request，新增而非放寬）：單字卡頁含配圖映射的 chunk，移除構圖描述後的 gzip 基準。
// 2026-10-24 本機正式 /nihongo-lab/ build，以 perf:bundle 同一量法（zlib level 9）：776,606 bytes／gzip 153,125 bytes（移除前 1,315,789／gzip 307,085 bytes）。
// 沿用 T120「基準＋20%」慣例，向上取整至 1 byte；描述若回到 runtime（約 +150 KB gzip）必定超標。
export const T163_ILLUSTRATION_CHUNK_GZIP_BASELINE_BYTES = 153_125;

/** @type {import('../lib/perf-stats.mjs').Budget[]} */
export const BUNDLE_BUDGETS = [
  // 主程式／CSS維持T120已核准門檻；2026-10-22 T153只將precache改為同一原始基準＋50%。
  // 歷史上限21,500,000為人工約整，未定義通用規則；本次明定向上取整至1 byte：26,869,829。
  { metric: 'mainJsGzipBytes', limit: 630_000, unit: 'bytes' },
  { metric: 'cssGzipBytes', limit: 5_800, unit: 'bytes' },
  { metric: 'illustrationChunkGzipBytes', limit: Math.ceil(T163_ILLUSTRATION_CHUNK_GZIP_BASELINE_BYTES * 1.2), unit: 'bytes' },
  { metric: 'precacheBytes', limit: Math.ceil(T120_PRECACHE_BASELINE_BYTES * 1.5), unit: 'bytes' },
];
