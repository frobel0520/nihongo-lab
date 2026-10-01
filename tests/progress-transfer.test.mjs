import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  EXPORT_FORMAT,
  exportFilename,
  exportProgress,
  parseImport,
} from '../lib/progress-transfer.mjs';
import { emptyProgress, recordDictation, recordReview } from '../lib/progress.mjs';

const NOW = '2026-09-30T08:00:00.000Z';
const sample = () =>
  recordDictation(
    recordReview(emptyProgress(), 'l:a', 'good', '2026-09-30', NOW),
    's.mp3',
    true,
    NOW,
  );

test('匯出再匯入，內容完全一樣', () => {
  const progress = sample();
  const text = exportProgress(progress, NOW);
  const result = parseImport(text);
  assert.equal(result.ok, true);
  assert.deepEqual(result.progress, progress);
  assert.equal(result.dropped, 0);
});

test('匯出檔帶 format 與匯出時間，外層可以一眼辨認', () => {
  const data = JSON.parse(exportProgress(sample(), NOW));
  assert.equal(data.format, EXPORT_FORMAT);
  assert.equal(data.exportedAt, NOW);
  assert.equal(data.progress.version, 2);
});

test('exportFilename：用本機日期', () => {
  assert.equal(exportFilename(new Date(2026, 9, 1, 23, 59)), 'nihongo-progress-2026-10-01.json');
});

test('匯入：不是 JSON、不是本 App 匯出的檔案，都回傳說明、不匯入', () => {
  for (const text of ['{壞掉', '', '[]', '42', 'null', '{"version":2,"srs":{},"dictation":{}}']) {
    const result = parseImport(text);
    assert.equal(result.ok, false, text);
    assert.match(result.message, /沒有匯入任何東西/);
  }
});

test('匯入：進度欄位缺少或損毀、版本太新，各有明確的說明', () => {
  const noProgress = parseImport(JSON.stringify({ format: EXPORT_FORMAT }));
  assert.equal(noProgress.ok, false);
  assert.match(noProgress.message, /損毀/);

  const broken = parseImport(JSON.stringify({ format: EXPORT_FORMAT, progress: 'x' }));
  assert.equal(broken.ok, false);
  assert.match(broken.message, /損毀/);

  const newer = parseImport(
    JSON.stringify({ format: EXPORT_FORMAT, progress: { version: 99, srs: {}, dictation: {} } }),
  );
  assert.equal(newer.ok, false);
  assert.match(newer.message, /較新的版本/);
});

test('匯入：單筆格式不對只略過那一筆並計數；版本 1 的進度也能匯入', () => {
  const result = parseImport(
    JSON.stringify({
      format: EXPORT_FORMAT,
      progress: {
        version: 1,
        srs: {
          ok: { ease: 2.5, interval: 1, reps: 1, lapses: 0, due: '2026-10-01', firstSeen: '2026-09-30' },
          bad: { ease: 'x' },
        },
        dictation: {},
      },
    }),
  );
  assert.equal(result.ok, true);
  assert.equal(result.dropped, 1);
  assert.deepEqual(Object.keys(result.progress.srs), ['ok']);
  assert.equal(result.progress.srs.ok.updatedAt, '2026-09-30T00:00:00.000Z');
});
