import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  emptyProgress,
  parseProgress,
  recordDictation,
  serializeProgress,
} from '../lib/progress.mjs';

const card = {
  ease: 2.5,
  interval: 1,
  reps: 1,
  lapses: 0,
  due: '2026-10-01',
  firstSeen: '2026-09-30',
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
    version: 1,
    srs: {
      'l:good': card,
      'l:badDate': { ...card, due: '2026-02-30' },
      'l:badNumber': { ...card, interval: -1 },
      'l:notObject': 'x',
    },
    dictation: {
      ok: { attempts: 1, passed: false, lastAt: 'now' },
      bad: { attempts: 'a' },
    },
  });
  const result = parseProgress(raw);
  assert.equal(result.problem, null);
  assert.equal(result.dropped, 4);
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
