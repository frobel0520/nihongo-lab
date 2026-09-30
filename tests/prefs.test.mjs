import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultPrefs, parsePrefs } from '../lib/prefs.mjs';

test('沒存過偏好時使用預設值（讀音預設開啟）', () => {
  assert.deepEqual(parsePrefs(null), defaultPrefs());
  assert.equal(defaultPrefs().furigana, true);
});

test('讀得到布林值就採用，包含關閉', () => {
  assert.equal(parsePrefs('{"furigana":false}').furigana, false);
  assert.equal(parsePrefs('{"furigana":true}').furigana, true);
});

test('壞掉的 JSON 或型別不對時退回預設值，不丟錯', () => {
  assert.deepEqual(parsePrefs('{壞掉'), defaultPrefs());
  assert.deepEqual(parsePrefs('{"furigana":"no"}'), defaultPrefs());
  assert.deepEqual(parsePrefs('null'), defaultPrefs());
  assert.deepEqual(parsePrefs('[]'), defaultPrefs());
});
