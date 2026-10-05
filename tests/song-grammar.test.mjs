import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as kuromoji from '@patdx/kuromoji';
import NodeDictionaryLoader from '@patdx/kuromoji/node';
import { stages } from '../curriculum/lessons.mjs';
import { GRAMMAR_RULES, detectGrammar, grammarLessonIndex } from '../lib/song-grammar.mjs';
import { analyzeLine } from '../lib/song-tokens.mjs';

// 句子都是自行撰寫的原創例句，不是任何歌曲的歌詞。
const tokenizer = await new kuromoji.TokenizerBuilder({
  loader: new NodeDictionaryLoader({ dic_path: 'node_modules/@patdx/kuromoji/dict/' }),
}).build();

const ids = (sentence) => detectGrammar(analyzeLine(tokenizer, sentence)).map((h) => h.id);

/** 每條規則：[會命中的句子, 不該命中的句子] */
const CASES = {
  'te-iru': ['友達を待っている', '友達を待つ'],
  'te-kudasai': ['窓を開けてください', '窓を開けた'],
  'te-mo-ii': ['ここで写真を撮ってもいい', '雨が降っても行く'],
  'te-wa-ikenai': ['中に入ってはいけない', '中に入ってもいい'],
  'te-mo': ['雨が降っても行く', 'ここで写真を撮ってもいい'],
  'te-kara': ['宿題をしてから寝る', '寒いから帰る'],
  'te-shimau': ['鍵をなくしてしまった', '鍵をなくした'],
  'te-ageru': ['妹に本を読んであげる', '妹に本をあげる'],
  'te-kureru': ['友達が手伝ってくれた', '友達が本をくれた'],
  'te-morau': ['先生に書いてもらった', '先生に本をもらった'],
  nakereba: ['今日は帰らなければならない', '早く行けば間に合う'],
  tai: ['冷たい水が飲みたい', '冷たい水を飲む'],
  nai: ['今日は学校へ行かない', '今日は学校へ行く'],
  masu: ['毎朝新聞を読みます', '毎朝新聞を読む'],
  tara: ['時間があったら来て', '時間があった'],
  ta: ['昨日映画を見た', '時間があったら来て'],
  mashou: ['一緒に帰りましょう', '一緒に帰ります'],
  deshou: ['明日は雨でしょう', '明日は雨です'],
  volitional: ['一緒に食べよう', '一緒に食べる'],
  passive: ['先生に褒められた', '先生を褒めた'],
  causative: ['弟に部屋を掃除させた', '弟が部屋を掃除した'],
  ba: ['早く行けば間に合う', '今日は帰らなければならない'],
  nagara: ['歌いながら歩く', '歌って歩く'],
  'kara-reason': ['寒いから帰る', '駅から歩く'],
  node: ['疲れたので休む', '疲れたから休む'],
  kedo: ['高いけど買う', '高いから買う'],
  'to-omou': ['明日は晴れると思う', '明日は晴れる'],
  'to-iu': ['彼は来ないと言った', '彼は来なかった'],
  'you-ni': ['よく聞こえるように話す', 'よく聞こえる声で話す'],
  'n-da': ['もう行くんだ', 'もう行く'],
  'koto-ga-dekiru': ['速く泳ぐことができる', '速く泳ぐ'],
  'ta-koto-ga-aru': ['京都に行ったことがある', '京都に行った'],
  toki: ['暇なとき本を読む', '暇な日に本を読む'],
  kute: ['安くて美味しい店', '安い店'],
  naru: ['空が暗くなった', '空が暗かった'],
  ne: ['いい天気だね', 'いい天気だ'],
  yo: ['もう行くよ', 'もう行く'],
  'casual-ending': ['さあ行くぞ', 'さあ行こう'],
};

test('每條規則都有測試案例', () => {
  assert.deepEqual(Object.keys(CASES).sort(), GRAMMAR_RULES.map((r) => r.id).sort());
});

for (const [id, [hit, miss]] of Object.entries(CASES)) {
  test(`${id}：「${hit}」命中、「${miss}」不命中`, () => {
    assert.ok(ids(hit).includes(id), `${hit} → ${ids(hit).join(',')}`);
    assert.ok(!ids(miss).includes(id), `${miss} → ${ids(miss).join(',')}`);
  });
}

test('detectGrammar：同一條規則一行只列一次，依位置排序，含詞的範圍', () => {
  const tokens = analyzeLine(tokenizer, '待っている人が笑っている');
  const hits = detectGrammar(tokens);
  assert.equal(hits.filter((h) => h.id === 'te-iru').length, 1);
  const teIru = hits.find((h) => h.id === 'te-iru');
  assert.deepEqual(
    tokens.slice(teIru?.start, teIru?.end).map((t) => t.s),
    ['て', 'いる'],
  );
  const starts = hits.map((h) => h.start);
  assert.deepEqual(starts, [...starts].sort((a, b) => a - b));
});

test('grammarLessonIndex：有教材 id 的規則都連得到課，指定課的連到口語轉換表', () => {
  const index = grammarLessonIndex(stages);
  for (const rule of GRAMMAR_RULES) {
    if (rule.jlpt || rule.lesson) {
      assert.ok(index.has(rule.id), `${rule.id} 沒有對應的課`);
    } else {
      assert.ok(!index.has(rule.id));
    }
  }
  assert.equal(index.get('te-iru')?.lessonId, 'stage0-day14');
  assert.equal(index.get('te-shimau')?.lessonId, 'stage2-spoken');
});

test('每條規則都有說明與標籤', () => {
  for (const rule of GRAMMAR_RULES) {
    assert.ok(rule.label.length > 0 && rule.note.length > 0, rule.id);
  }
});
