import { test } from 'node:test';
import assert from 'node:assert/strict';
import { audioPath, contentHash, defineLesson } from '../curriculum/author.mjs';
import { voices } from '../curriculum/voices.mjs';

const spec = {
  id: 't-day',
  title: 't',
  audio: 'audio/t',
  vocab: [
    ['あ', 'あ', 'a'],
    ['い', 'い', 'i'],
  ],
  grammar: [
    {
      pattern: 'p',
      note: 'n',
      jlpt: ['x'],
      examples: [
        ['あいう。', 'あいう。', 'aiu'],
        ['一日', 'いちにち', 'one day', { ruby: '{一日|いちにち}' }],
      ],
    },
  ],
  dialogue: {
    voices: ['hau', 'miko'],
    lines: [
      ['はい。', 'はい。', 'yes'],
      ['いいえ。', 'いいえ。', 'no'],
      ['そう。', 'そう。', 'so'],
    ],
  },
  practice: [['q', 'a']],
};

test('contentHash：同樣輸入同樣輸出，長度 10 的十六進位；演算法改動會被這個固定值抓到', () => {
  assert.equal(contentHash('vocab|あ|zundamon'), contentHash('vocab|あ|zundamon'));
  assert.match(contentHash('x'), /^[0-9a-f]{10}$/);
  assert.equal(contentHash('a'), 'af63dc4c86');
});

test('audioPath：路徑不帶開頭斜線，種類、原文或角色任一不同就換檔名', () => {
  const base = audioPath('audio/t', 'vocab', 'あ', 'hau');
  assert.match(base, /^audio\/t\/vocab-[0-9a-f]{10}\.mp3$/);
  assert.notEqual(base, audioPath('audio/t', 'gram', 'あ', 'hau'));
  assert.notEqual(base, audioPath('audio/t', 'vocab', 'い', 'hau'));
  assert.notEqual(base, audioPath('audio/t', 'vocab', 'あ', 'miko'));
});

test('defineLesson：單字角色依序輪替、對話兩個角色交替、文法例句同一點同一角色', () => {
  const lesson = defineLesson(spec);
  assert.deepEqual(
    lesson.vocab.map((v) => v.voice),
    [voices[0].key, voices[1].key],
  );
  assert.deepEqual(
    lesson.dialogue.map((d) => d.voice),
    ['hau', 'miko', 'hau'],
  );
  assert.equal(new Set(lesson.grammar[0].examples.map((e) => e.voice)).size, 1);
});

test('defineLesson：保留 jlpt 與 ruby，練習轉成 { q, a }，音檔路徑不重複', () => {
  const lesson = defineLesson(spec);
  assert.deepEqual(lesson.grammar[0].jlpt, ['x']);
  assert.equal(lesson.grammar[0].examples[1].ruby, '{一日|いちにち}');
  assert.equal(lesson.grammar[0].examples[0].ruby, undefined);
  assert.deepEqual(lesson.practice, [{ q: 'q', a: 'a' }]);
  const paths = [
    ...lesson.vocab.map((v) => v.audio),
    ...lesson.grammar.flatMap((g) => g.examples.map((e) => e.audio)),
    ...lesson.dialogue.map((d) => d.audio),
  ];
  assert.equal(new Set(paths).size, paths.length);
});

test('defineLesson：空欄位與未知角色直接丟錯，不默默產生壞資料', () => {
  assert.throws(
    () => defineLesson({ ...spec, vocab: [['あ', '', 'a']] }),
    /空欄位/,
  );
  assert.throws(
    () => defineLesson({ ...spec, dialogue: { voices: ['hau', 'nobody'], lines: [] } }),
    /未知角色/,
  );
});
