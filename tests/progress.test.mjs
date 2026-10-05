import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  PROGRESS_VERSION,
  emptyProgress,
  fingerprintProgress,
  isTimestamp,
  parseProgress,
  recordDictation,
  recordReview,
  serializeProgress,
} from '../lib/progress.mjs';

// 版本 3（FSRS）的卡
const card = {
  stability: 2.3065,
  difficulty: 2.1181,
  state: 2,
  reps: 1,
  lapses: 0,
  due: '2026-10-01',
  firstSeen: '2026-09-30',
  updatedAt: '2026-09-30T08:00:00.000Z',
};

// 版本 1、2（SM-2 簡化版）的卡
const sm2Card = {
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
      'l:badNumber': { ...card, stability: -1 },
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

test('版本 1 的存檔自動轉成 FSRS：到期日與首次日期不變，updatedAt 由到期日倒推最後評分的日子', () => {
  const { updatedAt: _unused, ...v1Card } = sm2Card;
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
  const good = result.progress.srs['l:good'];
  assert.equal(good.due, '2026-09-30');
  assert.equal(good.firstSeen, '2026-09-20');
  assert.equal(good.updatedAt, '2026-09-27T00:00:00.000Z');
  assert.equal(good.stability, 3, '答過記得：穩定度沿用舊的間隔');
  assert.equal(good.state, 2);
  const again = result.progress.srs['l:again'];
  assert.equal(again.updatedAt, '2026-09-29T00:00:00.000Z');
  assert.equal(again.due, '2026-09-29', '正在還不會的卡到期日不變');
  assert.ok(again.stability < 1, '正在還不會：穩定度很低');
  assert.ok(again.difficulty > good.difficulty, '答錯過的卡比較難');
  assert.equal(result.progress.srs['l:crossMonth'].updatedAt, '2026-09-29T00:00:00.000Z');
  assert.deepEqual(result.progress.dictation['x.mp3'], {
    attempts: 2,
    passed: true,
    lastAt: '2026-09-30T01:00:00.000Z',
  });
  // 轉出來的結果本身是合法的版本 3，序列化後再讀不會再被丟掉任何一筆
  const reread = parseProgress(serializeProgress(result.progress));
  assert.equal(reread.dropped, 0);
  assert.deepEqual(reread.progress, result.progress);
});

test('版本 2（SM-2 簡化版）的存檔自動轉成 FSRS：到期日、首次日期、評分時刻不變', () => {
  const result = parseProgress(
    JSON.stringify({
      version: 2,
      srs: {
        a: { ...sm2Card, interval: 8, reps: 3, due: '2026-10-08' },
        lapsed: { ...sm2Card, ease: 2.3, interval: 3, reps: 1, lapses: 1, due: '2026-10-03' },
        bad: { ...sm2Card, ease: 'x' },
      },
      dictation: {},
    }),
  );
  assert.equal(result.problem, null);
  assert.equal(result.dropped, 1);
  assert.equal(result.progress.version, PROGRESS_VERSION);
  const a = result.progress.srs.a;
  assert.deepEqual(
    [a.due, a.firstSeen, a.updatedAt, a.stability, a.reps, a.lapses],
    ['2026-10-08', sm2Card.firstSeen, sm2Card.updatedAt, 8, 3, 0],
  );
  assert.ok(result.progress.srs.lapsed.difficulty > a.difficulty);
  assert.equal(result.progress.srs.lapsed.reps, 2, 'FSRS 的 reps 含答錯的次數');
});

test('版本 1 單筆格式不對一樣只丟那一筆', () => {
  const { updatedAt: _unused, ...v1Card } = sm2Card;
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

test('recordReview：FSRS 排程結果加上評分時刻，沒碰到其他卡', () => {
  let progress = { ...emptyProgress(), srs: { other: card } };
  progress = recordReview(progress, 'a', 'good', '2026-09-30', '2026-09-30T08:00:00.000Z');
  const first = progress.srs.a;
  assert.equal(first.firstSeen, '2026-09-30');
  assert.equal(first.updatedAt, '2026-09-30T08:00:00.000Z');
  assert.equal(first.reps, 1);
  assert.equal(first.lapses, 0);
  assert.ok(first.due > '2026-09-30', '答記得：至少明天以後');
  assert.ok(first.stability > 0 && first.difficulty >= 1 && first.difficulty <= 10);
  assert.deepEqual(progress.srs.other, card);

  // 到期那天答還不會：今天再看、穩定度下降、記一次忘記，updatedAt 換成新的時刻
  progress = recordReview(progress, 'a', 'again', first.due, `${first.due}T09:30:00.000Z`);
  assert.equal(progress.srs.a.updatedAt, `${first.due}T09:30:00.000Z`);
  assert.equal(progress.srs.a.due, first.due);
  assert.equal(progress.srs.a.lapses, 1);
  assert.ok(progress.srs.a.stability < first.stability);
});

test('fingerprintProgress：內容相同就相同（與鍵順序無關），任何一個欄位不同就不同', () => {
  const a = { ...emptyProgress(), srs: { x: card, y: { ...card, stability: 3 } }, dictation: { s: { attempts: 1, passed: true, lastAt: 't' }, u: { attempts: 2, passed: false, lastAt: 't' } } };
  const reordered = {
    ...emptyProgress(),
    srs: { y: { updatedAt: card.updatedAt, firstSeen: card.firstSeen, due: card.due, lapses: 0, reps: 1, state: 2, difficulty: card.difficulty, stability: 3 }, x: card },
    dictation: { u: { lastAt: 't', passed: false, attempts: 2 }, s: { lastAt: 't', passed: true, attempts: 1 } },
  };
  assert.equal(fingerprintProgress(a), fingerprintProgress(reordered));
  assert.equal(fingerprintProgress(emptyProgress()), fingerprintProgress(emptyProgress()));

  const changed = [
    { ...a, srs: { ...a.srs, x: { ...card, difficulty: 5 } } },
    { ...a, srs: { ...a.srs, x: { ...card, state: 3 } } },
    { ...a, srs: { ...a.srs, x: { ...card, updatedAt: '2026-09-30T09:00:00.000Z' } } },
    { ...a, srs: { x: card } },
    { ...a, dictation: { ...a.dictation, s: { attempts: 1, passed: false, lastAt: 't' } } },
    { ...a, dictation: { s: a.dictation.s } },
  ];
  for (const other of changed) assert.notEqual(fingerprintProgress(a), fingerprintProgress(other));
});
