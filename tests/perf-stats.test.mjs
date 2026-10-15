import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  percentile,
  summarizeSamples,
  evaluateBudgets,
  gatePassed,
} from '../lib/perf-stats.mjs';
import { BUNDLE_BUDGETS } from '../scripts/perf-budget.mjs';

test('百分位數採 nearest-rank：樣本少時回傳實際量到的值', () => {
  const v = [5, 1, 4, 2, 3];
  assert.equal(percentile(v, 50), 3);
  assert.equal(percentile(v, 95), 5);
  assert.equal(percentile(v, 0), 1);
  assert.equal(percentile([7], 95), 7);
  assert.throws(() => percentile([], 50));
  assert.throws(() => percentile(v, 101));
});

test('彙整樣本：含非數值就丟錯，不默默略過', () => {
  assert.deepEqual(summarizeSamples([3, 1, 2]), {
    n: 3,
    min: 1,
    p50: 2,
    p95: 3,
    max: 3,
  });
  assert.throws(() => summarizeSamples([1, Number.NaN]));
});

test('門檻判定：等於上限算通過，超過算失敗，沒量到記 not_measured 且整體不通過', () => {
  const results = evaluateBudgets(
    { size: 100, lcp: summarizeSamples([900, 1200]) },
    [
      { metric: 'size', limit: 100, unit: 'bytes' },
      { metric: 'lcp', stat: 'p95', limit: 1000, unit: 'ms' },
      { metric: 'missing', limit: 1, unit: 'ms' },
    ],
  );
  assert.deepEqual(
    results.map((r) => r.status),
    ['pass', 'fail', 'not_measured'],
  );
  assert.equal(gatePassed(results), false);
  assert.equal(gatePassed(results.slice(0, 1)), true);
  assert.throws(() =>
    evaluateBudgets({ lcp: summarizeSamples([1]) }, [
      { metric: 'lcp', limit: 1, unit: 'ms' },
    ]),
  );
});

test('bundle 門檻設定：每項有正的上限與單位', () => {
  for (const b of BUNDLE_BUDGETS)
    assert.ok(b.limit > 0 && b.unit, b.metric);
});
