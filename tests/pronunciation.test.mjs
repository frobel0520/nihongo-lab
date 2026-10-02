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
