// 呼叫本機 VOICEVOX 引擎產生教材語音，轉成 mp3。
// 用法：
//   node scripts/synthesize.mjs --voice zundamon --text "こんにちは" --reading "こんにちは" --out public/audio/sample.mp3
//   node scripts/synthesize.mjs --batch scripts/audio-jobs.json   （由 scripts/build-audio-jobs.mjs 產生）
//
// 執行前需啟動雲端 adapter（含 reading_reference），監聽 127.0.0.1:50021；另外需要 ffmpeg。
// 官方 Engine 沒有 reading_reference；使用它時提供經語義核對的 --pronunciation／job.pronunciation。

import {
  mkdir,
  mkdtemp,
  readFile,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { getVoice } from '../curriculum/voices.mjs';
import { AUDIO_PROSODY } from '../curriculum/audio-prosody.mjs';
import { encodeMp3 } from './ffmpeg.mjs';
import {
  assertPronunciation,
  assertProsodyUnchanged,
  readingParts,
  readingText,
} from './pronunciation.mjs';

/** @typedef {{ voice: string, text: string, out: string, reading?: string, ruby?: string, kind?: string, pronunciation?: string }} AudioJob */

const ENGINE_URL = process.env.VOICEVOX_URL ?? 'http://127.0.0.1:50021';

/**
 * 呼叫引擎；連不上時給明確的提示，而不是只有 "fetch failed"。
 *
 * @param {string} path
 * @param {RequestInit} init
 */
async function callEngine(path, init) {
  try {
    return await fetch(`${ENGINE_URL}${path}`, {
      ...init,
      signal: AbortSignal.timeout(120_000),
    });
  } catch (error) {
    throw new Error(
      `連不到 VOICEVOX 引擎（${ENGINE_URL}），請先開啟 VOICEVOX：${error instanceof Error ? error.message : error}`,
    );
  }
}

/**
 * @param {AudioJob} job
 */
export async function synthesizeOne(job) {
  const { text, out: outPath } = job;
  const voice = getVoice(job.voice);

  let pronunciation = job.pronunciation;
  if (!pronunciation && job.reading) {
    const referenceRes = await callEngine('/reading_reference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...job,
        parts: readingParts({ ...job, reading: job.reading }),
      }),
    });
    if (!referenceRes.ok)
      throw new Error(
        '引擎未提供 reading_reference；請在 job 填入經核對的 pronunciation（實際發音假名，助詞用わ／え／お），再合成。',
      );
    pronunciation = (await referenceRes.json()).pronunciation;
    if (typeof pronunciation !== 'string')
      throw new Error('引擎沒有回傳有效的發音參考');
  }
  if (!pronunciation)
    throw new Error(
      `缺少讀音核對資料：${text}；請提供 --reading 或 --pronunciation`,
    );

  /** @param {string} input @param {boolean} [isKana] */
  const audioQuery = async (input, isKana = false) => {
    const response = await callEngine(
      `/audio_query?speaker=${voice.speakerId}&text=${encodeURIComponent(input)}${isKana ? '&is_kana=true' : ''}`,
      { method: 'POST' },
    );
    if (!response.ok)
      throw new Error(
        `audio_query failed (${response.status}): ${await response.text()}`,
      );
    return response.json();
  };

  const profile = AUDIO_PROSODY[outPath.replace(/^public\//, '')];
  if (profile && (profile.text !== text || profile.reading !== job.reading))
    throw new Error(`重音覆寫與教材不一致，請重新核對：${text}`);
  let query = await audioQuery(profile?.kana ?? text, !!profile);
  try {
    assertPronunciation(query, pronunciation);
  } catch (error) {
    // Reviewed accent notation must never silently fall back to a new text analysis.
    if (profile) throw error;
    const originalQuery = query;
    const controlledText = job.reading
      ? readingText({ ...job, reading: job.reading })
      : pronunciation;
    query = await audioQuery(controlledText);
    // A second mismatch is a failure, never an unchecked replacement.
    assertPronunciation(query, pronunciation);
    assertProsodyUnchanged(originalQuery, query);
    console.log(`READING ${text} → ${pronunciation}`);
  }

  const synthRes = await callEngine(`/synthesis?speaker=${voice.speakerId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  });
  if (!synthRes.ok) {
    throw new Error(
      `synthesis failed (${synthRes.status}): ${await synthRes.text()}`,
    );
  }
  const wavBuffer = Buffer.from(await synthRes.arrayBuffer());
  if (
    wavBuffer.length <= 44 ||
    wavBuffer.toString('ascii', 0, 4) !== 'RIFF' ||
    wavBuffer.toString('ascii', 8, 12) !== 'WAVE'
  ) {
    throw new Error(`引擎未輸出有效 WAV：${text}`);
  }

  await mkdir(dirname(outPath), { recursive: true });
  const temporary = await mkdtemp(join(dirname(outPath), '.synthesis-'));
  const tmpWav = join(temporary, 'clip.wav');
  const tmpMp3 = join(temporary, 'clip.mp3');
  try {
    await writeFile(tmpWav, wavBuffer);
    await encodeMp3(tmpWav, tmpMp3);
    await rename(tmpMp3, outPath);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
  return outPath;
}

/**
 * @param {string[]} argv
 * @returns {Record<string, string | undefined>}
 */
function parseArgs(argv) {
  /** @type {Record<string, string | undefined>} */
  const args = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, '');
    args[key] = argv[i + 1];
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.batch) {
    const jobs = JSON.parse(await readFile(args.batch, 'utf8'));
    for (const job of jobs) {
      const out = await synthesizeOne(job);
      console.log(`OK ${out}`);
    }
    return;
  }

  if (!args.voice || !args.text || !args.out) {
    console.error(
      'usage: node scripts/synthesize.mjs --voice <key> --text "..." --reading "..." --out <path.mp3>',
    );
    console.error('   or: node scripts/synthesize.mjs --batch <jobs.json>');
    process.exit(1);
  }

  const out = await synthesizeOne({
    voice: args.voice,
    text: args.text,
    out: args.out,
    reading: args.reading,
    pronunciation: args.pronunciation,
    kind: args.kind,
  });
  console.log(`OK ${out}`);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
)
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
