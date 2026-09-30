import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stages } from '../curriculum/lessons.mjs';
import { buildSentences, compareDictation } from '../lib/dictation.mjs';

const wrong = (marks) =>
  marks.filter((m) => m.compared && !m.matched).map((m) => m.ch);

test('漢字原文或假名讀音都算對，忽略空白與標點', () => {
  const candidates = ['私は学生です。', 'わたしは がくせいです。'];
  assert.ok(compareDictation('私は学生です', candidates).correct);
  assert.ok(compareDictation('私は学生です。', candidates).correct);
  assert.ok(compareDictation('わたしはがくせいです', candidates).correct);
  assert.ok(compareDictation('わたしは　がくせいです。', candidates).correct);
});

test('片假名視同平假名；全形半形英數統一', () => {
  assert.ok(compareDictation('みこさんは', ['ミコさんは']).correct);
  assert.ok(compareDictation('ミコさんは', ['みこさんは']).correct);
  assert.ok(compareDictation('ＡＢＣ', ['ABC']).correct);
});

test('標出漏聽與多打的字，並選最接近的答案比對', () => {
  const candidates = ['私は学生です。', 'わたしは がくせいです。'];
  const result = compareDictation('わたしは がくせです', candidates);
  assert.ok(!result.correct);
  assert.equal(result.target, 'わたしは がくせいです。');
  assert.deepEqual(wrong(result.expected), ['い']);
  assert.deepEqual(wrong(result.actual), []);

  const extra = compareDictation('わたしはがくせいですか', candidates);
  assert.ok(!extra.correct);
  assert.deepEqual(wrong(extra.expected), []);
  assert.deepEqual(wrong(extra.actual), ['か']);
});

test('替換的字兩邊都會被標出來', () => {
  const result = compareDictation('わたしは がくせいでず', [
    'わたしは がくせいです',
  ]);
  assert.ok(!result.correct);
  assert.deepEqual(wrong(result.expected), ['す']);
  assert.deepEqual(wrong(result.actual), ['ず']);
});

test('空白輸入不算對，且整句都標為漏聽', () => {
  const result = compareDictation('   ', ['はい']);
  assert.ok(!result.correct);
  assert.deepEqual(wrong(result.expected), ['は', 'い']);
});

test('buildSentences：只收音檔就緒課程的文法例句、對話與名句，id 唯一', () => {
  const sentences = buildSentences(stages);
  const lessons = stages
    .flatMap((s) => s.lessons)
    .filter((l) => l.audioReady !== false);
  const expected = lessons.reduce(
    (n, l) =>
      n +
      l.grammar.reduce((m, g) => m + g.examples.length, 0) +
      l.dialogue.length +
      (l.quotes?.length ?? 0),
    0,
  );
  assert.ok(expected > 0);
  assert.equal(sentences.length, expected);
  assert.equal(new Set(sentences.map((s) => s.id)).size, sentences.length);
  for (const s of sentences) {
    assert.ok(s.jp && s.reading && s.zh && s.audio);
  }
});
