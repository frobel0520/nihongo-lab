import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stages } from '../curriculum/lessons.mjs';
import { RUBY_NOTES } from '../curriculum/ruby-notes.mjs';
import {
  KANA_ONLY,
  annotateText,
  buildNotesIndex,
  candidateRuns,
  displayedTexts,
  japaneseKanjiSet,
  missingNotes,
} from '../lib/ruby-notes.mjs';

const index = buildNotesIndex(RUBY_NOTES);

test('buildNotesIndex／annotateText：以去掉標記的原字串查表，查不到回 null', () => {
  const small = buildNotesIndex(['{私|わたし}は{学生|がくせい}です。', '洗手間（比トイレ客氣）']);
  assert.deepEqual(annotateText('私は学生です。', small), [
    { text: '私', ruby: 'わたし' },
    { text: 'は' },
    { text: '学生', ruby: 'がくせい' },
    { text: 'です。' },
  ]);
  assert.deepEqual(annotateText('洗手間（比トイレ客氣）', small), [{ text: '洗手間（比トイレ客氣）' }]);
  assert.equal(annotateText('沒標過的字串', small), null);
});

test('標記清單：沒有重複的原字串、標記語法完整、讀音都是假名', () => {
  const plains = new Set();
  for (const markup of RUBY_NOTES) {
    assert.doesNotMatch(markup.replace(/\{[^{}|]+\|[^{}|]+\}/g, ''), /[{}|]/, `標記語法不完整：${markup}`);
    for (const match of markup.matchAll(/\{([^{}|]+)\|([^{}|]+)\}/g)) {
      assert.match(match[2], KANA_ONLY, `讀音要是假名：${match[0]} in ${markup}`);
      assert.match(match[1], /[一-鿿々]/, `只標含漢字的字串：${match[0]}`);
    }
    const plain = markup.replace(/\{([^{}|]+)\|[^{}|]+\}/g, '$1');
    assert.ok(!plains.has(plain), `原字串重複：${plain}`);
    plains.add(plain);
  }
});

test('每一筆標記都對得到教材裡實際會顯示的字串（教材改了字、標記沒跟著改會在這裡抓到）', () => {
  const shown = displayedTexts(stages);
  const orphans = [...index.keys()].filter((text) => !shown.has(text));
  assert.deepEqual(orphans, [], `這些標記找不到對應的教材字串：\n${orphans.slice(0, 5).join('\n')}`);
});

test('教材裡每一個含日文漢字的字串都人工檢查過（有標記項目）；新增教材後這裡會列出還沒看的', () => {
  const missing = missingNotes(stages, index);
  const report = missing
    .slice(0, 10)
    .map((m) => `${m.text}\n   候選：${m.runs.join('、')}`)
    .join('\n');
  assert.equal(missing.length, 0, `有 ${missing.length} 個字串還沒檢查：\n${report}`);
});

test('displayedTexts：只收顯示用的字串，不收日文欄位、音檔路徑與 id', () => {
  const texts = displayedTexts({ id: 'x', title: '標題', vocab: [{ word: '私', zh: '我', audio: 'a.mp3' }], note: '說明' });
  assert.deepEqual([...texts].sort(), ['標題', '我', '說明'].sort());
});

test('candidateRuns：抓緊貼假名的日文漢字串，中文詞（含日文沒用過的字）不抓', () => {
  const kanjiSet = new Set('私学生昨日雨');
  assert.deepEqual(candidateRuns('私は学生です。', kanjiSet), ['私', '学生']);
  assert.deepEqual(candidateRuns('昨日は雨でした（昨天是雨天）', kanjiSet), ['昨日', '雨']);
  assert.deepEqual(candidateRuns('禮貌的斷定語氣', kanjiSet), []);
  assert.deepEqual(candidateRuns('這是學生', kanjiSet), []);
});

test('japaneseKanjiSet：收進單字、例句、對話、名句用過的漢字與文法用語的漢字', () => {
  const set = japaneseKanjiSet([
    { lessons: [{ vocab: [{ word: '机' }], grammar: [{ examples: [{ jp: '駅です' }] }], dialogue: [{ jp: '店' }], quotes: [{ jp: '海賊' }] }] },
  ]);
  for (const ch of '机駅店海賊形詞') assert.ok(set.has(ch), ch);
  assert.ok(!set.has('禮'));
});
