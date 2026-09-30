import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  UPDATE_CHECK_INTERVAL_MS,
  shouldCheckForUpdate,
} from '../lib/sw-update.mjs';

test('shouldCheckForUpdate：沒檢查過就檢查，間隔不足不檢查，到了間隔才再檢查', () => {
  const now = 1_000_000;
  assert.equal(shouldCheckForUpdate(null, now), true);
  assert.equal(shouldCheckForUpdate(now - 1000, now), false);
  assert.equal(
    shouldCheckForUpdate(now - UPDATE_CHECK_INTERVAL_MS + 1, now),
    false,
  );
  assert.equal(shouldCheckForUpdate(now - UPDATE_CHECK_INTERVAL_MS, now), true);
  assert.equal(shouldCheckForUpdate(now - 5000, now, 1000), true);
});
