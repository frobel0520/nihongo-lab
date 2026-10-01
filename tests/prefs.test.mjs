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

test('聽寫作答方式：預設選擇題，讀得到合法值才採用，其他退回預設', () => {
  assert.equal(defaultPrefs().dictationMode, 'choice');
  assert.equal(parsePrefs('{"dictationMode":"type"}').dictationMode, 'type');
  assert.equal(parsePrefs('{"dictationMode":"choice"}').dictationMode, 'choice');
  for (const bad of ['"voice"', '1', 'null', '[]']) {
    assert.equal(parsePrefs(`{"dictationMode":${bad}}`).dictationMode, 'choice');
  }
  // 沒存聽寫方式的舊偏好：讀音設定照舊，聽寫用預設
  assert.deepEqual(parsePrefs('{"furigana":false}'), { furigana: false, dictationMode: 'choice' });
});

test('壞掉的 JSON 或型別不對時退回預設值，不丟錯', () => {
  assert.deepEqual(parsePrefs('{壞掉'), defaultPrefs());
  assert.deepEqual(parsePrefs('{"furigana":"no"}'), defaultPrefs());
  assert.deepEqual(parsePrefs('null'), defaultPrefs());
  assert.deepEqual(parsePrefs('[]'), defaultPrefs());
});
