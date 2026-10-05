import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stages } from '../curriculum/lessons.mjs';
import {
  buildJmdictIndex,
  buildVocabIndex,
  lookupJmdict,
  lookupVocab,
  posLabel,
} from '../lib/song-lookup.mjs';

const vocab = buildVocabIndex(stages);

test('lookupVocab：用原形查到教材單字與課次', () => {
  // 「食べ」的原形是「食べる」
  const hits = lookupVocab(vocab, { s: '食べ', b: '食べる', p: '動詞' });
  assert.ok(hits.length > 0);
  assert.equal(hits[0].word, '食べる');
  assert.ok(hits[0].zh.length > 0);
  assert.ok(hits[0].lessonId.startsWith('stage0-day'));
});

test('lookupVocab：假名寫的詞可以用讀音找到漢字單字；漢字詞不用讀音亂配', () => {
  const kana = lookupVocab(vocab, { s: 'たべる', p: '動詞' });
  assert.ok(kana.some((h) => h.word === '食べる'));
  assert.deepEqual(lookupVocab(vocab, { s: '翠', p: '名詞' }), []);
});

// 測試用的小字典：結構與 jmdict-simplified 相同，內容是為測試寫的。
const SAMPLE = {
  version: 'test',
  words: [
    {
      kanji: [{ text: '朝' }],
      kana: [{ text: 'あさ' }],
      sense: [
        { gloss: [{ lang: 'eng', text: 'morning' }] },
        { gloss: [{ lang: 'eng', text: 'early part' }, { lang: 'eng', text: 'start' }] },
      ],
    },
    {
      kanji: [],
      kana: [{ text: 'ゆっくり' }],
      sense: [{ gloss: [{ lang: 'eng', text: 'slowly' }, { lang: 'eng', text: 'leisurely' }] }],
    },
    { kanji: [{ text: '空白' }], kana: [{ text: 'くうはく' }], sense: [{ gloss: [] }] },
  ],
};

test('buildJmdictIndex／lookupJmdict：寫法與讀音都查得到，義項以分號分開，沒釋義的略過', () => {
  const index = buildJmdictIndex(SAMPLE, { maxSenses: 2, maxGlosses: 1 });
  assert.equal(index.version, 'test');
  assert.equal(index.entries.length, 2);
  assert.deepEqual(lookupJmdict(index, { s: '朝', p: '名詞' }), [
    { kana: 'あさ', gloss: 'morning; early part' },
  ]);
  assert.deepEqual(lookupJmdict(index, { s: 'あさ', p: '名詞' }), [
    { kana: 'あさ', gloss: 'morning; early part' },
  ]);
  assert.deepEqual(lookupJmdict(index, { s: 'ゆっくり', p: '副詞' }), [
    { kana: 'ゆっくり', gloss: 'slowly' },
  ]);
  assert.deepEqual(lookupJmdict(index, { s: '空白', p: '名詞' }), []);
});

test('posLabel：詞性轉中文，附細分類', () => {
  assert.equal(posLabel({ s: '静か', p: '名詞', pd: '形容動詞語幹' }), '名詞（な形容詞語幹）');
  assert.equal(posLabel({ s: 'ね', p: '助詞', pd: '終助詞' }), '助詞（句尾助詞）');
  assert.equal(posLabel({ s: '高い', p: '形容詞', pd: '自立' }), 'い形容詞');
  assert.equal(posLabel({ s: '？', p: '未知の品詞' }), '未知の品詞');
});
