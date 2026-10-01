import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  PROGRESS_VERSION,
  emptyProgress,
  isTimestamp,
  parseProgress,
  recordDictation,
  recordReview,
  serializeProgress,
} from '../lib/progress.mjs';

const card = {
  ease: 2.5,
  interval: 1,
  reps: 1,
  lapses: 0,
  due: '2026-10-01',
  firstSeen: '2026-09-30',
  updatedAt: '2026-09-30T08:00:00.000Z',
};

test('沒存過（null）回傳空進度，不算問題', () => {
  assert.deepEqual(parseProgress(null), {
    progress: emptyProgress(),
    problem: null,
    dropped: 0,
  });
});

test('序列化後再解析，內容不變', () => {
  const progress = {
    ...emptyProgress(),
    srs: { 'l:a': card },
    dictation: {
      'x.mp3': {
        attempts: 2,
        passed: true,
        lastAt: '2026-09-30T01:00:00.000Z',
      },
    },
  };
  const result = parseProgress(serializeProgress(progress));
  assert.equal(result.problem, null);
  assert.equal(result.dropped, 0);
  assert.deepEqual(result.progress, progress);
});

test('壞掉的 JSON、非物件、未知版本都回傳空進度並標出原因', () => {
  assert.equal(parseProgress('{oops').problem, 'corrupt');
  assert.equal(parseProgress('[]').problem, 'corrupt');
  assert.equal(parseProgress('42').problem, 'corrupt');
  assert.equal(
    parseProgress(JSON.stringify({ version: 99, srs: {}, dictation: {} }))
      .problem,
    'version',
  );
  assert.deepEqual(parseProgress('{oops').progress, emptyProgress());
});

test('單筆資料格式不對只丟掉那一筆並計數', () => {
  const raw = JSON.stringify({
    version: PROGRESS_VERSION,
    srs: {
      'l:good': card,
      'l:badDate': { ...card, due: '2026-02-30' },
      'l:badNumber': { ...card, interval: -1 },
      'l:notObject': 'x',
      'l:noStamp': { ...card, updatedAt: undefined },
      'l:badStamp': { ...card, updatedAt: '2026-09-30' },
    },
    dictation: {
      ok: { attempts: 1, passed: false, lastAt: 'now' },
      bad: { attempts: 'a' },
    },
  });
  const result = parseProgress(raw);
  assert.equal(result.problem, null);
  assert.equal(result.dropped, 6);
  assert.deepEqual(Object.keys(result.progress.srs), ['l:good']);
  assert.deepEqual(Object.keys(result.progress.dictation), ['ok']);
});

test('recordDictation：累計次數，passed 一旦為 true 不會被之後答錯洗掉', () => {
  let progress = emptyProgress();
  progress = recordDictation(progress, 's1', false, 't1');
  assert.deepEqual(progress.dictation.s1, {
    attempts: 1,
    passed: false,
    lastAt: 't1',
  });
  progress = recordDictation(progress, 's1', true, 't2');
  progress = recordDictation(progress, 's1', false, 't3');
  assert.deepEqual(progress.dictation.s1, {
    attempts: 3,
    passed: true,
    lastAt: 't3',
  });
});

test('isTimestamp：只收 toISOString 的格式（同格式字串的字典序才等於時間先後）', () => {
  assert.equal(isTimestamp(new Date().toISOString()), true);
  assert.equal(isTimestamp('2026-09-30T08:00:00.000Z'), true);
  for (const bad of [
    '2026-09-30',
    '2026-09-30T08:00:00Z',
    '2026-09-30T08:00:00.000+08:00',
    '2026-13-45T25:61:61.000Z',
    '',
    42,
    null,
    undefined,
  ]) {
    assert.equal(isTimestamp(bad), false, String(bad));
  }
});

test('版本 1 的存檔自動轉成版本 2：欄位全部保留，updatedAt 由到期日倒推最後評分的日子', () => {
  const { updatedAt: _unused, ...v1Card } = card;
  const raw = JSON.stringify({
    version: 1,
    srs: {
      // 評分當天 due = 當天 + interval：3 天後到期、隔 3 天 → 評分日是 09-27
      'l:good': { ...v1Card, interval: 3, due: '2026-09-30', firstSeen: '2026-09-20' },
      // 答「還不會」時 interval 為 0、due 就是當天
      'l:again': { ...v1Card, interval: 0, reps: 0, due: '2026-09-29' },
      // 月底跨月：due 10-02 − 3 天 = 09-29
      'l:crossMonth': { ...v1Card, interval: 3, due: '2026-10-02' },
    },
    dictation: {
      'x.mp3': { attempts: 2, passed: true, lastAt: '2026-09-30T01:00:00.000Z' },
    },
  });
  const result = parseProgress(raw);
  assert.equal(result.problem, null);
  assert.equal(result.dropped, 0);
  assert.equal(result.progress.version, PROGRESS_VERSION);
  assert.deepEqual(result.progress.srs['l:good'], {
    ...v1Card,
    interval: 3,
    due: '2026-09-30',
    firstSeen: '2026-09-20',
    updatedAt: '2026-09-27T00:00:00.000Z',
  });
  assert.equal(result.progress.srs['l:again'].updatedAt, '2026-09-29T00:00:00.000Z');
  assert.equal(result.progress.srs['l:crossMonth'].updatedAt, '2026-09-29T00:00:00.000Z');
  assert.deepEqual(result.progress.dictation['x.mp3'], {
    attempts: 2,
    passed: true,
    lastAt: '2026-09-30T01:00:00.000Z',
  });
  // 轉出來的結果本身是合法的版本 2，序列化後再讀不會再被丟掉任何一筆
  const again = parseProgress(serializeProgress(result.progress));
  assert.equal(again.dropped, 0);
  assert.deepEqual(again.progress, result.progress);
});

test('版本 1 單筆格式不對一樣只丟那一筆', () => {
  const { updatedAt: _unused, ...v1Card } = card;
  const result = parseProgress(
    JSON.stringify({
      version: 1,
      srs: { ok: v1Card, bad: { ...v1Card, due: '2026-02-30' } },
      dictation: {},
    }),
  );
  assert.equal(result.dropped, 1);
  assert.deepEqual(Object.keys(result.progress.srs), ['ok']);
});

test('recordReview：排程結果加上評分時刻，沒碰到其他卡', () => {
  let progress = { ...emptyProgress(), srs: { other: card } };
  progress = recordReview(progress, 'a', 'good', '2026-09-30', '2026-09-30T08:00:00.000Z');
  assert.deepEqual(progress.srs.a, {
    ease: 2.5,
    interval: 1,
    reps: 1,
    lapses: 0,
    due: '2026-10-01',
    firstSeen: '2026-09-30',
    updatedAt: '2026-09-30T08:00:00.000Z',
  });
  assert.deepEqual(progress.srs.other, card);

  // 再評一次：updatedAt 換成新的時刻，不是沿用舊的
  progress = recordReview(progress, 'a', 'again', '2026-10-01', '2026-10-01T09:30:00.000Z');
  assert.equal(progress.srs.a.updatedAt, '2026-10-01T09:30:00.000Z');
  assert.equal(progress.srs.a.lapses, 1);
});
