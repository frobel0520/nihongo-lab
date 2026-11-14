import {
  evaluateBudgets,
  gatePassed,
  summarizeSamples,
} from '../lib/perf-stats.mjs';

// T191 新增時間門檻提案；沿用 T120 的 LCP/TBT 上限，不修改 bundle 門檻。
// 這是隔離桌面 Chromium 的發布樣本，不代表真機或成功登入／同步。
/** @type {Record<string, import('../lib/perf-stats.mjs').Budget[]>} */
export const RUNTIME_BUDGETS = {
  fresh: [
    { metric: 'lcpMs', stat: 'p95', limit: 2500, unit: 'ms' },
    { metric: 'tbtMs', stat: 'p95', limit: 200, unit: 'ms' },
    { metric: 'contentReadyMs', stat: 'p95', limit: 5000, unit: 'ms' },
  ],
  repeat: [
    { metric: 'lcpMs', stat: 'p95', limit: 1500, unit: 'ms' },
    { metric: 'tbtMs', stat: 'p95', limit: 200, unit: 'ms' },
    { metric: 'contentReadyMs', stat: 'p95', limit: 3000, unit: 'ms' },
  ],
  api: [{ metric: 'durationMs', stat: 'p95', limit: 2000, unit: 'ms' }],
};

/**
 * @typedef {Record<string, unknown> & {ok: boolean}} RuntimeSample
 */
/**
 * Missing timings and failed attempts stay visible and cannot pass the gate.
 * @param {RuntimeSample[]} samples
 * @param {import('../lib/perf-stats.mjs').Budget[]} budgets
 */
export function summarizeRun(samples, budgets) {
  /** @type {Record<string, import('../lib/perf-stats.mjs').SampleSummary>} */
  const measured = {};
  for (const { metric } of budgets) {
    const values = samples.map((sample) => sample[metric]);
    if (
      values.length &&
      values.every(
        (value) =>
          typeof value === 'number' && Number.isFinite(value) && value >= 0,
      )
    ) {
      measured[metric] = summarizeSamples(/** @type {number[]} */ (values));
    }
  }
  const checks = evaluateBudgets(measured, budgets);
  const failures = samples.filter((sample) => sample.ok !== true).length;
  return {
    attempts: samples.length,
    failures,
    errorRate: samples.length ? failures / samples.length : null,
    measured,
    checks,
    passed: samples.length >= 5 && failures === 0 && gatePassed(checks),
  };
}
