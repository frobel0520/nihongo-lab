import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Worker 首頁設定 COOP，同時保留 Google 登入彈窗和重新驗證快取', () => {
  const headers = readFileSync(new URL('../worker/public/_headers', import.meta.url), 'utf8');
  const rules = headers.trimEnd().split(/\r?\n\r?\n/).map((rule) => rule.split(/\r?\n/));
  const coopPaths = rules.filter(([, ...values]) =>
    values.some((header) => /cross-origin-opener-policy:/i.test(header)));
  assert.deepEqual(coopPaths.map(([path]) => path), ['/nihongo-lab/', '/nihongo-lab/index.html']);
  for (const [, ...values] of coopPaths) {
    assert.ok(values.includes('  Cross-Origin-Opener-Policy: same-origin-allow-popups'));
    assert.ok(values.includes('  Cache-Control: no-cache'));
  }
});
