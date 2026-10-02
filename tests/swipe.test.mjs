import { test } from 'node:test';
import assert from 'node:assert/strict';
import { swipeStep } from '../lib/swipe.mjs';

test('左滑下一筆、右滑上一筆；輕觸、垂直捲動、斜向與長拖曳不切換', () => {
  assert.equal(swipeStep(-100, 8, 200), 1);
  assert.equal(swipeStep(100, -8, 200), -1);
  assert.equal(swipeStep(20, 0, 200), 0);
  assert.equal(swipeStep(70, 100, 200), 0);
  assert.equal(swipeStep(-80, 70, 200), 0);
  assert.equal(swipeStep(-100, 0, 1500), 0);
});
