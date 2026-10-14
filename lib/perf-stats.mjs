/**
 * 效能量測的統計與門檻判定（純邏輯，T120）。量測腳本只負責收集數字，判定一律走這裡，測試才測得到。
 *
 * @typedef {{ n: number, min: number, p50: number, p95: number, max: number }} SampleSummary
 * @typedef {{ metric: string, limit: number, unit: string, stat?: 'p50' | 'p95' }} Budget
 * @typedef {{ metric: string, value: number | null, limit: number, unit: string, stat?: 'p50' | 'p95', status: 'pass' | 'fail' | 'not_measured' }} BudgetResult
 */

/**
 * Nearest-rank 百分位數：樣本少時不內插，回傳實際量到的某一個值。
 * @param {number[]} values
 * @param {number} p 0～100
 */
export function percentile(values, p) {
  if (!values.length) throw new Error('沒有樣本，不能計算百分位數');
  if (!(p >= 0 && p <= 100)) throw new Error(`百分位數超出範圍：${p}`);
  const sorted = [...values].sort((a, b) => a - b);
  const rank = Math.max(1, Math.ceil((p / 100) * sorted.length));
  return sorted[rank - 1];
}

/** @param {number[]} values @returns {SampleSummary} */
export function summarizeSamples(values) {
  if (values.some((v) => !Number.isFinite(v)))
    throw new Error('樣本含非數值，不能彙整');
  return {
    n: values.length,
    min: Math.min(...values),
    p50: percentile(values, 50),
    p95: percentile(values, 95),
    max: Math.max(...values),
  };
}

/**
 * 依門檻判定。沒有量到的指標記 not_measured，不當成通過。
 * @param {Record<string, number | SampleSummary | undefined>} measured
 * @param {Budget[]} budgets
 * @returns {BudgetResult[]}
 */
export function evaluateBudgets(measured, budgets) {
  return budgets.map((budget) => {
    const raw = measured[budget.metric];
    /** @type {number | null} */
    let value = null;
    if (typeof raw === 'number') value = raw;
    else if (raw && budget.stat) value = raw[budget.stat];
    else if (raw) throw new Error(`${budget.metric} 是樣本彙整，門檻需指定 p50 或 p95`);
    return {
      ...budget,
      value,
      status: value === null ? 'not_measured' : value <= budget.limit ? 'pass' : 'fail',
    };
  });
}

/** @param {BudgetResult[]} results */
export const gatePassed = (results) => results.every((r) => r.status === 'pass');
