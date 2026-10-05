import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gzipSync, gunzipSync } from 'node:zlib';
import * as kuromoji from '@patdx/kuromoji';
import NodeDictionaryLoader from '@patdx/kuromoji/node';
import {
  ANALYZER_ID,
  analyzeLine,
  applyAnalysis,
  gunzipIfNeeded,
  setTokenReading,
  toHiragana,
  toToken,
  tokenRuby,
} from '../lib/song-tokens.mjs';
import { createSong } from '../lib/songs.mjs';

// 句子都是自行撰寫的原創例句，不是任何歌曲的歌詞。
const tokenizer = await new kuromoji.TokenizerBuilder({
  loader: new NodeDictionaryLoader({ dic_path: 'node_modules/@patdx/kuromoji/dict/' }),
}).build();

const NOW = '2026-10-05T03:00:00.000Z';
const ruby = (tokens) =>
  tokens
    .flatMap(tokenRuby)
    .map((p) => (p.ruby ? `${p.text}[${p.ruby}]` : p.text))
    .join('');

test('toHiragana：片假名轉平假名，長音不動', () => {
  assert.equal(toHiragana('タベル'), 'たべる');
  assert.equal(toHiragana('コーヒー'), 'こーひー');
});

test('toToken：只在含漢字時存讀音；原形與表層形相同不存；* 視為沒有', () => {
  assert.deepEqual(
    toToken({
      surface_form: '食べ',
      pos: '動詞',
      pos_detail_1: '自立',
      conjugated_form: '連用形',
      basic_form: '食べる',
      reading: 'タベ',
    }),
    { s: '食べ', r: 'たべ', b: '食べる', p: '動詞', pd: '自立', cf: '連用形' },
  );
  assert.deepEqual(
    toToken({
      surface_form: 'を',
      pos: '助詞',
      pos_detail_1: '格助詞',
      conjugated_form: '*',
      basic_form: 'を',
      reading: 'ヲ',
    }),
    { s: 'を', p: '助詞', pd: '格助詞' },
  );
});

test('analyzeLine＋tokenRuby：實際斷詞後讀音只標在漢字上（送假名不標）', () => {
  assert.equal(
    ruby(analyzeLine(tokenizer, '朝の駅で友達を待っている')),
    '朝[あさ]の駅[えき]で友達[ともだち]を待[ま]っている',
  );
  assert.equal(ruby(analyzeLine(tokenizer, '空を見上げて歩こう')), '空[そら]を見上[みあ]げて歩[ある]こう');
  assert.deepEqual(analyzeLine(tokenizer, ''), []);
});

test('tokenRuby：沒有讀音的未知詞不標；使用者改的讀音優先', () => {
  assert.deepEqual(tokenRuby({ s: '翠', p: '名詞' }), [{ text: '翠' }]);
  assert.deepEqual(tokenRuby({ s: '本気', r: 'ほんき', o: 'まじ', p: '名詞' }), [
    { text: '本気', ruby: 'まじ' },
  ]);
});

test('applyAnalysis：寫入分析結果；歌詞已被改的行不寫；保留同位置同一個詞改過的讀音', () => {
  const created = createSong(
    { title: 't', artist: '', lyrics: '雨の日\n\n晴れの日' },
    { id: 's', now: NOW },
  );
  assert.ok(created.ok);
  let song = created.song;
  song = {
    ...song,
    lines: song.lines.map((l, i) =>
      i === 0 ? { ...l, tokens: [{ s: '雨', r: 'あめ', o: 'う', p: '名詞' }] } : l,
    ),
  };
  const results = [
    { text: '雨の日', tokens: analyzeLine(tokenizer, '雨の日') },
    { text: '', tokens: [] },
    { text: '曇りの日', tokens: analyzeLine(tokenizer, '曇りの日') },
  ];
  const analyzed = applyAnalysis(song, results, NOW);
  assert.equal(analyzed.lines[0].tokens?.[0].o, 'う');
  assert.deepEqual(analyzed.lines[1].tokens, []);
  assert.equal(analyzed.lines[2].tokens, null);
  assert.deepEqual(analyzed.analysis, { analyzer: ANALYZER_ID, analyzedAt: NOW });
});

test('setTokenReading：改讀音、與原讀音相同或空白就還原；位置不存在丟錯', () => {
  const created = createSong({ title: 't', artist: '', lyrics: '本気で' }, { id: 's', now: NOW });
  assert.ok(created.ok);
  const song = applyAnalysis(
    created.song,
    [{ text: '本気で', tokens: analyzeLine(tokenizer, '本気で') }],
    NOW,
  );
  const changed = setTokenReading(song, 0, 0, 'マジ', NOW);
  assert.equal(changed.lines[0].tokens?.[0].o, 'まじ');
  const restored = setTokenReading(changed, 0, 0, changed.lines[0].tokens?.[0].r ?? '', NOW);
  assert.equal(restored.lines[0].tokens?.[0].o, undefined);
  assert.equal(setTokenReading(changed, 0, 0, '  ', NOW).lines[0].tokens?.[0].o, undefined);
  assert.throws(() => setTokenReading(song, 0, 99, 'x', NOW), RangeError);
});

test('gunzipIfNeeded：gzip 才解壓，已解壓的原樣回傳', async () => {
  const plain = new TextEncoder().encode('dictionary bytes');
  const gz = gzipSync(plain);
  const decompress = async (buffer) => {
    const out = gunzipSync(Buffer.from(buffer));
    return out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength);
  };
  const fromGz = await gunzipIfNeeded(
    gz.buffer.slice(gz.byteOffset, gz.byteOffset + gz.byteLength),
    decompress,
  );
  assert.deepEqual(new Uint8Array(fromGz), plain);
  const fromPlain = await gunzipIfNeeded(plain.buffer, async () => {
    throw new Error('不該解壓');
  });
  assert.deepEqual(new Uint8Array(fromPlain), plain);
});
