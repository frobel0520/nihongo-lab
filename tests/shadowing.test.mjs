import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gapMs } from '../lib/shadowing.mjs';

test('gapMs：留白約為句長 1.2 倍加 0.3 秒，至少 1 秒', () => {
  assert.equal(gapMs(3), 3900);
  assert.equal(gapMs(0.2), 1000);
  assert.ok(gapMs(10) > gapMs(5));
});

test('gapMs：讀不到長度時退回下限，不出現 NaN', () => {
  for (const bad of [0, -1, NaN, Infinity, undefined]) {
    assert.equal(gapMs(bad), 1000);
  }
});
