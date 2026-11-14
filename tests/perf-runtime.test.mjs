import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  RUNTIME_BUDGETS,
  summarizeRun,
} from '../scripts/perf-runtime-policy.mjs';

test('runtime gate retains missing and failed samples instead of reporting successful subset', () => {
  const samples = Array.from({ length: 5 }, () => ({
    ok: true,
    durationMs: 100,
  }));
  assert.equal(summarizeRun(samples, RUNTIME_BUDGETS.api).passed, true);
  assert.equal(
    summarizeRun(samples.slice(0, 4), RUNTIME_BUDGETS.api).passed,
    false,
  );
  const failed = summarizeRun(
    [...samples, { ok: false, durationMs: 80 }],
    RUNTIME_BUDGETS.api,
  );
  assert.equal(failed.passed, false);
  assert.equal(failed.errorRate, 1 / 6);
  for (const bad of [null, NaN, Infinity, -1, '100']) {
    const missing = summarizeRun(
      [...samples, { ok: false, durationMs: bad }],
      RUNTIME_BUDGETS.api,
    );
    assert.equal(missing.checks[0].status, 'not_measured');
    assert.equal(missing.passed, false);
  }
  assert.equal(summarizeRun([], RUNTIME_BUDGETS.api).passed, false);
});

test('runtime gate checks nearest-rank p95 and every page metric independently', () => {
  const samples = Array.from({ length: 5 }, () => ({
    ok: true,
    lcpMs: 1500,
    tbtMs: 200,
    contentReadyMs: 3000,
  }));
  assert.equal(summarizeRun(samples, RUNTIME_BUDGETS.repeat).passed, true);
  for (const metric of ['lcpMs', 'tbtMs', 'contentReadyMs']) {
    const changed = samples.map((s) => ({ ...s }));
    changed[4][metric] += 1;
    assert.equal(summarizeRun(changed, RUNTIME_BUDGETS.repeat).passed, false);
  }
});

test('anonymous API CLI measures expected 401 without cookies and fails unexpected responses', async () => {
  const { createServer } = await import('node:http');
  const { mkdtemp, readFile, rm } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { execFile } = await import('node:child_process');
  const { promisify } = await import('node:util');
  const run = promisify(execFile);
  const dir = await mkdtemp(join(tmpdir(), 'nihongo-perf-test-'));
  let unexpected = false,
    requests = 0;
  const server = createServer((req, res) => {
    requests++;
    assert.equal(req.headers.cookie, undefined);
    assert.equal(req.headers.authorization, undefined);
    res.setHeader('Content-Type', 'application/json');
    if (req.url === '/health') res.end(JSON.stringify({ ok: true }));
    else {
      res.statusCode = unexpected ? 503 : 401;
      res.end(JSON.stringify({ error: 'unauthorized' }));
    }
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  try {
    const args = [
      'scripts/perf-runtime.mjs',
      '--api-only',
      '--check',
      '--url',
      `http://127.0.0.1:${server.address().port}/nihongo-lab/`,
      '--revision',
      '1234567',
      '--out',
      join(dir, 'evidence.json'),
    ];
    await run(process.execPath, args);
    let report = JSON.parse(await readFile(join(dir, 'evidence.json'), 'utf8'));
    assert.equal(requests, 10);
    assert.equal(report.scopedGatePassed, true);
    assert.equal(report.pages.length, 0);
    assert.equal(report.coverage.authenticatedSync, 'not_measured');
    unexpected = true;
    await assert.rejects(
      run(process.execPath, args),
      (error) => error.code === 1,
    );
    report = JSON.parse(await readFile(join(dir, 'evidence.json'), 'utf8'));
    assert.equal(report.scopedGatePassed, false);
    assert.equal(report.api[1].failures, 5);
  } finally {
    await new Promise((r) => server.close(r));
    await rm(dir, { recursive: true, force: true });
  }
});
