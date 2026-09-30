import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isInteractive, isTextEntry } from '../lib/keys.mjs';

test('isTextEntry：輸入框、文字區、下拉選單與可編輯區算輸入元件，按鈕與一般區塊不算', () => {
  for (const tagName of ['INPUT', 'textarea', 'Select']) {
    assert.ok(isTextEntry({ tagName }), tagName);
  }
  assert.ok(isTextEntry({ tagName: 'DIV', isContentEditable: true }));
  for (const target of [
    { tagName: 'BUTTON' },
    { tagName: 'BODY' },
    { tagName: 'DIV' },
    null,
    undefined,
  ]) {
    assert.ok(!isTextEntry(target), JSON.stringify(target));
  }
});

test('isInteractive：按鈕、連結、輸入元件與有互動角色的元素會自己處理空白鍵', () => {
  for (const target of [
    { tagName: 'BUTTON' },
    { tagName: 'a' },
    { tagName: 'SUMMARY' },
    { tagName: 'INPUT' },
    { tagName: 'DIV', isContentEditable: true },
    { tagName: 'DIV', role: 'button' },
    { tagName: 'SPAN', role: 'checkbox' },
  ]) {
    assert.ok(isInteractive(target), JSON.stringify(target));
  }
});

test('isInteractive：body、一般區塊與沒有目標時不算，快捷鍵可以攔截', () => {
  for (const target of [
    { tagName: 'BODY' },
    { tagName: 'DIV' },
    { tagName: 'P', role: null },
    null,
    undefined,
  ]) {
    assert.ok(!isInteractive(target), JSON.stringify(target));
  }
});

test('數字快捷鍵只在輸入元件裡讓位：焦點在評分按鈕上仍然可以用 1／2', () => {
  const gradeButton = { tagName: 'BUTTON' };
  assert.ok(!isTextEntry(gradeButton)); // 數字鍵照常評分
  assert.ok(isInteractive(gradeButton)); // 空白鍵交給按鈕自己
});
