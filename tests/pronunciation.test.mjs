import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  assertPronunciation,
  normalizePronunciation,
  readingText,
} from '../scripts/pronunciation.mjs';
import { synthesizeOne } from '../scripts/synthesize.mjs';

const query = (text) => ({
  accent_phrases: [{ moras: [...text].map((text) => ({ text })) }],
});

test('同形異讀依教材語義控制，漢字替換保留原句助詞', () => {
  assert.equal(
    readingText({ text: '何人', reading: 'なにじん', kind: 'vocab' }),
    'ナニジン',
  );
  assert.equal(
    readingText({ text: '家族は何人？', reading: 'かぞくは なんにん？' }),
    'カゾクはナンニン？',
  );
  assert.equal(
    readingText({ text: '辛い', reading: 'からい', kind: 'vocab' }),
    'カライ',
  );
  assert.equal(
    readingText({
      text: '40秒で支度しな！',
      reading: 'よんじゅうびょうで したくしな！',
      ruby: '{40秒|よんじゅうびょう}で{支度|したく}しな！',
    }),
    'ヨンジュウビョウでシタクしな！',
  );
  assert.throws(
    () => readingText({ text: '学生です', reading: 'がくせい' }),
    /無法對齊/,
  );
});

test('檢查音素時允許長音與同音假名，保留促音和音拍數', () => {
  assert.equal(
    normalizePronunciation('がくせい'),
    normalizePronunciation('ガクセー'),
  );
  assert.equal(
    normalizePronunciation('つづける'),
    normalizePronunciation('ツズケル'),
  );
  assertPronunciation(query('ナニジン'), 'なにじん');
  assert.throws(
    () => assertPronunciation(query('ナンニン'), 'なにじん'),
    /讀音不一致/,
  );
  assert.throws(
    () => assertPronunciation(query('ツライ'), 'からい'),
    /讀音不一致/,
  );
  assert.throws(
    () => assertPronunciation(query('ジュウブン'), 'じゅっぷん'),
    /讀音不一致/,
  );
  assert.throws(
    () => assertPronunciation(query('ハッカ'), 'はつか'),
    /讀音不一致/,
  );
  assert.throws(
    () => assertPronunciation(query('ガクセ'), 'がくせい'),
    /讀音不一致/,
  );
  assert.throws(() => assertPronunciation(query('ハウ'), 'わう'), /讀音不一致/);
});

test('原文與指定讀音兩次都不一致時，不呼叫合成、不覆蓋既有音檔', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'nihongo-reading-'));
  const out = join(directory, 'clip.mp3');
  await writeFile(out, 'original audio');
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url) => {
    calls.push(String(url));
    return new Response(JSON.stringify(query('ナンニン')), {
      headers: { 'Content-Type': 'application/json' },
    });
  });
  try {
    await assert.rejects(
      synthesizeOne({
        voice: 'neko-vy',
        text: '何人',
        reading: 'なにじん',
        kind: 'vocab',
        pronunciation: 'なにじん',
        out,
      }),
      /讀音不一致/,
    );
    assert.equal(calls.length, 2);
    assert.ok(calls.every((url) => url.includes('/audio_query?')));
    assert.ok(calls[1].includes(encodeURIComponent('ナニジン')));
    assert.equal(await readFile(out, 'utf8'), 'original audio');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('引擎回傳非 WAV 時，不把錯誤回應寫成教材音檔', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'nihongo-wav-'));
  const out = join(directory, 'clip.mp3');
  await writeFile(out, 'original audio');
  t.mock.method(globalThis, 'fetch', async (url) =>
    String(url).includes('/audio_query?')
      ? new Response(JSON.stringify(query('ナニジン')), {
          headers: { 'Content-Type': 'application/json' },
        })
      : new Response('invalid audio'),
  );
  try {
    await assert.rejects(
      synthesizeOne({
        voice: 'neko-vy',
        text: '何人',
        pronunciation: 'なにじん',
        out,
      }),
      /有效 WAV/,
    );
    assert.equal(await readFile(out, 'utf8'), 'original audio');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

// A reviewed accent override must fail closed rather than silently changing the phrase analysis.
test('已核對重音覆寫讀音不符時，不重新解析原文或呼叫合成', async (t) => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url) => {
    calls.push(String(url));
    const q = query('ジヨトマレ');
    return new Response(
      JSON.stringify(String(url).includes('/accent_phrases') ? q.accent_phrases : q),
    );
  });
  await assert.rejects(
    synthesizeOne({
      voice: 'hau',
      text: '時よ止まれ!',
      reading: 'ときよ とまれ!',
      pronunciation: 'ときよとまれ',
      out: 'public/audio/stage-2/quotes/quote-d3b5904f92.mp3',
    }),
    /讀音不一致/,
  );
  // 覆寫的句節只從假名建立；第二次查詢只取全域參數，且不會呼叫合成。
  assert.equal(calls.length, 2);
  assert.ok(calls[0].includes('/accent_phrases') && calls[0].includes('is_kana=true'));
  assert.ok(calls.every((url) => !url.includes('/synthesis')));
});

test('教材變更後必須重核重音覆寫，不能沿用過時設定', async (t) => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url) => {
    calls.push(String(url));
    throw new Error('Should not query a stale profile');
  });
  await assert.rejects(
    synthesizeOne({
      voice: 'hau',
      text: '時よ止まれ!',
      reading: 'じよ とまれ!',
      pronunciation: 'じよとまれ',
      out: 'public/audio/stage-2/quotes/quote-d3b5904f92.mp3',
    }),
    /重音覆寫與教材不一致/,
  );
  assert.equal(calls.length, 0);
});

test('未核對的假名讀音修正若改變重音，停止且不覆蓋音檔', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'nihongo-accent-'));
  const out = join(directory, 'clip.mp3');
  await writeFile(out, 'original audio');
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url) => {
    calls.push(String(url));
    const q = query(calls.length === 1 ? 'アマ' : 'アメ');
    q.accent_phrases[0].accent = calls.length === 1 ? 2 : 1;
    return new Response(JSON.stringify(q));
  });
  try {
    await assert.rejects(
      synthesizeOne({
        voice: 'hau',
        text: '雨',
        reading: 'あめ',
        pronunciation: 'あめ',
        out,
      }),
      /改變重音或句界/,
    );
    assert.equal(calls.length, 2);
    assert.ok(calls.every((url) => url.includes('/audio_query?')));
    assert.equal(await readFile(out, 'utf8'), 'original audio');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('命令形燃えろ不能通過燃える讀音；語尾清晰度不得更換音素或重音', async () => {
  const { applyArticulation } = await import('../scripts/pronunciation.mjs');
  const rule = {
    finalMora: 'ロ',
    vowel: 'o',
    vowelLength: 0.22,
    speedScale: 0.95,
  };
  const q = {
    accent_phrases: [
      {
        accent: 3,
        moras: [
          { text: 'モ', vowel: 'o', pitch: 4.5 },
          { text: 'エ', vowel: 'e', pitch: 4.8 },
          { text: 'ロ', vowel: 'o', vowel_length: 0.14, pitch: 4.6 },
        ],
      },
    ],
    speedScale: 1,
  };
  assertPronunciation(q, 'もえろ');
  assert.throws(() => assertPronunciation(q, 'もえる'), /讀音不一致/);
  applyArticulation(q, rule);
  assert.equal(q.accent_phrases[0].moras[2].vowel_length, 0.22);
  assert.equal(q.accent_phrases[0].moras[2].pitch, 4.6);
  assert.equal(q.accent_phrases[0].accent, 3);
  assert.equal(q.speedScale, 0.95);
  assertPronunciation(q, 'もえろ');
  const wrong = structuredClone(q);
  Object.assign(wrong.accent_phrases[0].moras[2], { text: 'ル', vowel: 'u' });
  assert.throws(() => applyArticulation(wrong, rule), /音素不一致/);
  assert.throws(
    () => applyArticulation(q, { ...rule, vowelLength: NaN }),
    /超出範圍/,
  );
});
