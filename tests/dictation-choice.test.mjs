import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stages } from '../curriculum/lessons.mjs';
import { buildSentences, soundKey } from '../lib/dictation.mjs';
import { CHOICE_COUNT, pickChoices, similarity } from '../lib/dictation-choice.mjs';

const make = (id, reading, over = {}) => ({
  id, jp: reading, reading, zh: id, audio: `${id}.mp3`, lessonId: 'l1', lessonTitle: 'L1', source: 'dialogue', ...over,
});

/** 固定種子的亂數，測試失敗時可以重現。 */
function lcg(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

test('soundKey：忽略標點與空白、片假名視同平假名', () => {
  assert.equal(soundKey('これは、ペンです。'), soundKey('これは ぺんです'));
  assert.notEqual(soundKey('これは本です'), soundKey('それは本です'));
  assert.equal(soundKey('！？ 　'), '');
});

test('pickChoices：4 個選項，目標只出現一次，聽起來都不一樣', () => {
  const pool = ['わたしは がくせいです', 'あなたは せんせいです', 'これは ほんです', 'それは えんぴつです', 'あれは とけいです', 'ここは がっこうです'].map((r, i) => make(`s${i}`, r));
  const target = pool[0];
  const options = pickChoices(target, pool, lcg(1));
  assert.equal(options.length, CHOICE_COUNT);
  assert.equal(options.filter((o) => o.id === target.id).length, 1);
  assert.equal(new Set(options.map((o) => soundKey(o.reading))).size, CHOICE_COUNT);
});

test('pickChoices：聽起來和目標一樣的句子（不同 id）不會當干擾項，否則會出現兩個都對的選項', () => {
  const target = make('t', 'これは ほんです。');
  const twin = make('twin', 'これは、ほんです'); // 標點不同，聽起來一樣
  const katakana = make('kata', 'コレハ ホンデス');
  const others = ['それは ぺんです', 'あれは とけいです', 'ここは がっこうです'].map((r, i) => make(`o${i}`, r));
  for (let seed = 1; seed <= 30; seed++) {
    const options = pickChoices(target, [target, twin, katakana, ...others], lcg(seed));
    assert.ok(!options.some((o) => o.id === 'twin' || o.id === 'kata'), `seed ${seed}`);
    assert.equal(options.length, 4);
  }
});

test('similarity：讀音越像、同一課的越高', () => {
  const target = make('t', 'これは ほんです', { lessonId: 'a' });
  const close = make('c', 'これは ぺんです', { lessonId: 'b' });
  const far = make('f', 'きのうは あめでした', { lessonId: 'b' });
  assert.ok(similarity(target, close) > similarity(target, far));
  const sameLesson = make('s', 'きのうは あめでした', { lessonId: 'a' });
  assert.ok(similarity(target, sameLesson) > similarity(target, far), '同一課加分');
});

test('pickChoices：候選不夠時回傳較少的選項，不硬湊重複的；空的候選只剩目標', () => {
  const target = make('t', 'これは ほんです');
  const only = pickChoices(target, [target, make('a', 'それは ぺんです'), make('b', 'それは ぺんです。')], lcg(1));
  assert.equal(only.length, 2, '兩個候選聽起來一樣，只留一個');
  assert.deepEqual(pickChoices(target, [target], lcg(1)).map((o) => o.id), ['t']);
});

test('pickChoices：同樣的亂數得到同樣的題目；目標在 4 個位置都有機會出現', () => {
  const pool = Array.from({ length: 20 }, (_, i) => make(`s${i}`, `ひらがな${'あいうえおかきくけこ'[i % 10]}${'さしすせそたちつてと'[(i * 3) % 10]}です`));
  const target = pool[0];
  assert.deepEqual(pickChoices(target, pool, lcg(7)).map((o) => o.id), pickChoices(target, pool, lcg(7)).map((o) => o.id));

  const positions = new Set();
  for (let seed = 1; seed <= 200; seed++) {
    positions.add(pickChoices(target, pool, lcg(seed)).findIndex((o) => o.id === 'target' || o.id === target.id));
  }
  assert.deepEqual([...positions].sort(), [0, 1, 2, 3]);
});

test('教材裡每一句都出得了 4 選 1：目標在內、4 個選項聽起來都不同、干擾項不是目標', () => {
  const sentences = buildSentences(stages);
  assert.ok(sentences.length > 500);
  const random = lcg(20261001);
  for (const target of sentences) {
    const options = pickChoices(target, sentences, random);
    assert.equal(options.length, CHOICE_COUNT, target.id);
    assert.equal(options.filter((o) => o.id === target.id).length, 1, target.id);
    assert.equal(new Set(options.map((o) => soundKey(o.reading))).size, CHOICE_COUNT, target.id);
  }
});
