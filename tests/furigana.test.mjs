import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  alignFurigana,
  parseRuby,
  plainText,
  rubyParts,
} from '../lib/furigana.mjs';

const pairs = (parts) =>
  parts.filter((p) => p.ruby).map((p) => `${p.text}=${p.ruby}`);

test('alignFurigana：以送假名與助詞當定位點，整段漢字標一個讀音', () => {
  const parts = alignFurigana(
    '私は会社員です。',
    'わたしは かいしゃいんです。',
  );
  assert.deepEqual(pairs(parts), ['私=わたし', '会社員=かいしゃいん']);
  assert.equal(plainText(parts), '私は会社員です。');
});

test('alignFurigana：讀音欄位的空白不影響對齊，片假名與平假名視為相同', () => {
  const parts = alignFurigana(
    'ミコさんは学生ですか。',
    'ミコさんは がくせいですか。',
  );
  assert.deepEqual(pairs(parts), ['学生=がくせい']);
  assert.deepEqual(
    pairs(alignFurigana('ミコさんは学生です', 'みこさんは がくせいです')),
    ['学生=がくせい'],
  );
});

test('alignFurigana：漢字段之間只隔標點或空白時，靠讀音裡同樣的標點或空白切開', () => {
  assert.deepEqual(
    pairs(
      alignFurigana('宿題、忘れちゃった。', 'しゅくだい、わすれちゃった。'),
    ),
    ['宿題=しゅくだい', '忘=わす'],
  );
  assert.deepEqual(pairs(alignFurigana('涙雨 降りて', 'なみだあめ ふりて')), [
    '涙雨=なみだあめ',
    '降=ふ',
  ]);
});

test('alignFurigana：兩段漢字之間沒有邊界線索時回傳 null，不猜', () => {
  // 讀音裡沒有標點，「宿題」與「忘」的分界有多種切法。
  assert.equal(alignFurigana('宿題、忘れた', 'しゅくだいわすれた'), null);
});

test('alignFurigana：讀音與原文的假名不一致、含數字、沒有漢字時回傳 null', () => {
  assert.equal(alignFurigana('私は学生です', 'わたしは がくせいだ'), null);
  assert.equal(
    alignFurigana('40秒で支度しな！', 'よんじゅうびょうで したくしな！'),
    null,
  );
  assert.equal(alignFurigana('どうぞよろしく。', 'どうぞ よろしく。'), null);
});

test('alignFurigana：長音符號要照字面對，不會被當成標點略過', () => {
  assert.deepEqual(pairs(alignFurigana('お茶ー', 'おちゃー')), ['茶=ちゃ']);
  assert.equal(alignFurigana('お茶ー', 'おちゃ'), null);
});

test('parseRuby 解析 {原文|讀音}，其餘照原樣，並可還原成原文', () => {
  const parts = parseRuby('{40秒|よんじゅうびょう}で{支度|したく}しな！');
  assert.deepEqual(pairs(parts), ['40秒=よんじゅうびょう', '支度=したく']);
  assert.equal(plainText(parts), '40秒で支度しな！');
  assert.deepEqual(parseRuby('こんにちは'), [{ text: 'こんにちは' }]);
});

test('rubyParts：手動標註優先，但原文與 jp 不一致時回傳 null', () => {
  const line = {
    jp: '40秒で支度しな！',
    reading: 'よんじゅうびょうで したくしな！',
  };
  assert.equal(rubyParts(line), null);
  assert.deepEqual(
    pairs(
      rubyParts({
        ...line,
        ruby: '{40秒|よんじゅうびょう}で{支度|したく}しな！',
      }),
    ),
    ['40秒=よんじゅうびょう', '支度=したく'],
  );
  assert.equal(
    rubyParts({
      ...line,
      ruby: '{40秒|よんじゅうびょう}で{準備|したく}しな！',
    }),
    null,
  );
});
