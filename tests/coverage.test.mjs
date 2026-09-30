import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  extractKanji,
  grammarCoverage,
  japaneseTexts,
  kanjiCoverage,
  matchVocab,
  pacing,
  vocabCoverage,
} from '../lib/coverage.mjs';

// 測試用的假清單，內容自己寫，不是 OpenJLPT 的資料。
const refVocab = [
  { word: '学生', reading: 'がくせい', level: 'N5' },
  { word: '私', reading: 'わたくし', level: 'N5' },
  { word: '私', reading: 'あたし', level: 'N1' },
  { word: '会議', reading: 'かいぎ', level: 'N4' },
  { word: '猫', reading: 'ねこ', level: 'N5' },
];

test('matchVocab：讀音相同算 match，讀音不同取最簡單級別，不在清單標 missing', () => {
  const result = matchVocab(
    [
      { word: '学生', reading: 'がくせい' },
      { word: '私', reading: 'わたし' },
      { word: '私', reading: 'わたし' },
      { word: '私', reading: 'あたし' },
      { word: '何人', reading: 'なにじん' },
    ],
    refVocab,
  );
  assert.deepEqual(
    result.map((m) => [m.word, m.status, m.level]),
    [
      ['学生', 'match', 'N5'],
      ['私', 'reading-diff', 'N5'],
      ['何人', 'missing', undefined],
    ],
  );
  assert.equal(result[1].refReading, 'わたくし');
});

test('matchVocab：同字有多個讀音時，讀音相同的那筆優先（即使級別較難）', () => {
  const [m] = matchVocab([{ word: '私', reading: 'あたし' }], refVocab);
  assert.equal(m.status, 'match');
  assert.equal(m.level, 'N1');
});

test('vocabCoverage 只算目標級別，並列出還沒涵蓋的字', () => {
  const matches = matchVocab([{ word: '学生', reading: 'がくせい' }], refVocab);
  const cov = vocabCoverage(matches, refVocab, 'N5');
  assert.equal(cov.total, 3);
  assert.equal(cov.covered, 1);
  assert.deepEqual(cov.uncovered.map((e) => e.word), ['私', '猫']);
});

test('extractKanji 去重、排序，並略過「々」與假名', () => {
  assert.deepEqual(extractKanji(['私は学生です', '学生々', 'ミコ']), ['学', '生', '私']);
});

test('japaneseTexts 取單字、文法例句、對話、名句的日文，不含中文與練習', () => {
  const lesson = {
    vocab: [{ word: '猫' }],
    grammar: [{ examples: [{ jp: '猫です。' }] }],
    dialogue: [{ jp: 'こんにちは。' }],
    quotes: [{ jp: '行くぞ。' }],
    practice: [{ q: '請翻譯', a: '中文' }],
  };
  assert.deepEqual(japaneseTexts(lesson), ['猫', '猫です。', 'こんにちは。', '行くぞ。']);
});

test('kanjiCoverage 依級別分組，清單沒收的標「未收錄」', () => {
  const refKanji = [
    { character: '学', level: 'N5' },
    { character: '生', level: 'N5' },
    { character: '会', level: 'N4' },
  ];
  const cov = kanjiCoverage(['会', '学', '龍'], refKanji, 'N5');
  assert.deepEqual(cov.byLevel, { N4: ['会'], N5: ['学'], 未收錄: ['龍'] });
  assert.equal(cov.total, 2);
  assert.equal(cov.covered, 1);
  assert.deepEqual(cov.uncovered, ['生']);
});

test('grammarCoverage 用 jlpt id 計算，並回報打錯的 id 與尚未標註的文法點', () => {
  const lessons = [
    {
      grammar: [
        { jlpt: ['wa', 'desu'] },
        { jlpt: ['typo-id'] },
        { examples: [] },
      ],
    },
  ];
  const ref = [
    { id: 'wa', pattern: '〜は', level: 'N5' },
    { id: 'desu', pattern: '〜です', level: 'N5' },
    { id: 'mo', pattern: '〜も', level: 'N5' },
    { id: 'te-shimau', pattern: '〜てしまう', level: 'N4' },
  ];
  const cov = grammarCoverage(lessons, ref, 'N5');
  assert.equal(cov.total, 3);
  assert.equal(cov.covered, 2);
  assert.deepEqual(cov.uncovered.map((g) => g.id), ['mo']);
  assert.deepEqual(cov.unknown, ['typo-id']);
  assert.equal(cov.untagged, 1);
});

test('pacing：全部平均與「剩下的課」平均分開算，課數用完時回 null', () => {
  const p = pacing(100, 10, 10, 1);
  assert.equal(p.perLesson, 10);
  assert.equal(p.remainingPerLesson, 10);
  assert.equal(pacing(100, 10, 5, 5).remainingPerLesson, null);
});
