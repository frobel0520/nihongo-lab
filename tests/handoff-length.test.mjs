import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  AUDIT_LEGACY_MARKER,
  HANDOFF_LIMITS,
  checkDocument,
  handoffLengthProblems,
} from '../scripts/ci/docs-check.mjs';

test('現行交接文件符合 AGENTS.md 的長度上限', () => {
  for (const file of Object.keys(HANDOFF_LIMITS))
    assert.deepEqual(handoffLengthProblems(file, readFileSync(file, 'utf8')), []);
});

test('progress.md 超過行數、字數或單段上限會失敗', () => {
  const { lines, chars, sectionChars } = HANDOFF_LIMITS['progress.md'];
  assert.match(handoffLengthProblems('progress.md', 'a\n'.repeat(lines + 1)).join(), /lines/);
  assert.match(handoffLengthProblems('progress.md', '字'.repeat(chars + 1)).join(), /chars >/);
  assert.match(
    handoffLengthProblems('progress.md', `## 長段\n${'字'.repeat(sectionChars)}`).join(),
    /section "## 長段"/,
  );
  assert.deepEqual(handoffLengthProblems('progress.md', '# 專案進度\n\n## 現況\n短\n'), []);
});

test('release-audit 只檢查分隔標記以上的新段落，且必須有標記', () => {
  const limit = HANDOFF_LIMITS['docs/release-audit.md'].sectionChars;
  const long = `## 舊批次\n${'字'.repeat(limit + 10)}\n`;
  assert.deepEqual(handoffLengthProblems('docs/release-audit.md', `## 新\n短\n${AUDIT_LEGACY_MARKER}\n${long}`), []);
  assert.match(handoffLengthProblems('docs/release-audit.md', `${long}${AUDIT_LEGACY_MARKER}\n`).join(), /舊批次/);
  assert.match(handoffLengthProblems('docs/release-audit.md', '## 新\n短\n').join(), /missing legacy marker/);
});

test('docs 關卡會擋下超長的交接文件，其他文件不受影響', () => {
  assert.throws(() => checkDocument('progress.md', '', 'a\n'.repeat(500), () => true), /lines/);
  assert.doesNotThrow(() => checkDocument('docs/other.md', '', 'a\n'.repeat(500), () => true));
});
