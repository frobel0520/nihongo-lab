import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPlayInterruption, playFromStart } from '../lib/playback.mjs';

/**
 * 假的音檔元素：plays 依序決定每次 play() 的結果（'ok' 或要拒絕的錯誤名稱）。
 * @param {Array<'ok' | string>} plays
 * @param {unknown} [error]
 */
function fakeAudio(plays, error = null) {
  const calls = [];
  return {
    calls,
    error,
    currentTime: 5,
    paused: true,
    play() {
      const next = plays.shift() ?? 'ok';
      calls.push('play');
      return next === 'ok'
        ? Promise.resolve()
        : Promise.reject(new DOMException('x', next));
    },
    pause() {
      calls.push('pause');
    },
    load() {
      calls.push('load');
      this.error = null;
    },
  };
}

const always = () => true;

test('isPlayInterruption：只有 AbortError 算被打斷，其他錯誤、非錯誤值都不算', () => {
  assert.equal(isPlayInterruption(new DOMException('x', 'AbortError')), true);
  assert.equal(isPlayInterruption({ name: 'AbortError' }), true);
  assert.equal(isPlayInterruption(new DOMException('x', 'NotSupportedError')), false);
  assert.equal(isPlayInterruption(new DOMException('x', 'NotAllowedError')), false);
  assert.equal(isPlayInterruption(new Error('boom')), false);
  assert.equal(isPlayInterruption(undefined), false);
  assert.equal(isPlayInterruption(null), false);
  assert.equal(isPlayInterruption('AbortError'), false);
});

test('playFromStart：正常播放從頭開始，並先停掉其他音檔（不停自己）', async () => {
  const el = fakeAudio(['ok']);
  const other = fakeAudio([]);
  const result = await playFromStart(el, { others: [other, el], isCurrent: always });
  assert.equal(result, 'started');
  assert.equal(el.currentTime, 0);
  assert.deepEqual(el.calls, ['play']);
  assert.deepEqual(other.calls, ['pause']);
});

test('playFromStart：被快速切換打斷（AbortError）回 interrupted，不重試、不當成失敗', async () => {
  const el = fakeAudio(['AbortError']);
  const result = await playFromStart(el, { others: [], isCurrent: always });
  assert.equal(result, 'interrupted');
  assert.deepEqual(el.calls, ['play']);
});

test('playFromStart：第一次播放失敗就重新載入再試一次，成功就算播起來（不必重新整理）', async () => {
  const el = fakeAudio(['NotSupportedError', 'ok']);
  const result = await playFromStart(el, { others: [], isCurrent: always });
  assert.equal(result, 'started');
  assert.deepEqual(el.calls, ['play', 'load', 'play']);
});

test('playFromStart：重新載入後仍失敗才回 failed，且只重試一次', async () => {
  const el = fakeAudio(['NotSupportedError', 'NotSupportedError', 'ok']);
  const result = await playFromStart(el, { others: [], isCurrent: always });
  assert.equal(result, 'failed');
  assert.deepEqual(el.calls, ['play', 'load', 'play']);
});

test('playFromStart：元素已經帶著載入錯誤時，播放前先 load()', async () => {
  const el = fakeAudio(['ok'], { code: 2 });
  const result = await playFromStart(el, { others: [], isCurrent: always });
  assert.equal(result, 'started');
  assert.deepEqual(el.calls, ['load', 'play']);
});

test('playFromStart：已經有更新的播放請求時，失敗不重試、不顯示失敗', async () => {
  const el = fakeAudio(['NotSupportedError', 'ok']);
  const result = await playFromStart(el, { others: [], isCurrent: () => false });
  assert.equal(result, 'interrupted');
  assert.deepEqual(el.calls, ['play']);
});

test('playFromStart：重試等待期間被更新的請求取代，第二次失敗也不顯示失敗', async () => {
  const el = fakeAudio(['NotSupportedError', 'NotSupportedError']);
  let calls = 0;
  const result = await playFromStart(el, {
    others: [],
    isCurrent: () => ++calls < 2,
  });
  assert.equal(result, 'interrupted');
  assert.deepEqual(el.calls, ['play', 'load', 'play']);
});
