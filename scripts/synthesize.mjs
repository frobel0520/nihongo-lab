// 呼叫本機 VOICEVOX 引擎產生教材語音，轉成 mp3。
// 用法：
//   node scripts/synthesize.mjs --voice zundamon --text "こんにちは" --out public/audio/sample.mp3
//   node scripts/synthesize.mjs --batch scripts/audio-jobs.json   （由 scripts/build-audio-jobs.mjs 產生）
//
// 執行前需先開啟 VOICEVOX.exe（或 vv-engine/run.exe），監聽 127.0.0.1:50021；另外需要 ffmpeg。

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { getVoice } from '../curriculum/voices.mjs';
import { encodeMp3 } from './ffmpeg.mjs';

const ENGINE_URL = 'http://127.0.0.1:50021';

/**
 * 呼叫引擎；連不上時給明確的提示，而不是只有 "fetch failed"。
 *
 * @param {string} path
 * @param {RequestInit} init
 */
async function callEngine(path, init) {
  try {
    return await fetch(`${ENGINE_URL}${path}`, init);
  } catch (error) {
    throw new Error(
      `連不到 VOICEVOX 引擎（${ENGINE_URL}），請先開啟 VOICEVOX：${error instanceof Error ? error.message : error}`,
    );
  }
}

/**
 * @param {string} voiceKey
 * @param {string} text
 * @param {string} outPath
 */
async function synthesizeOne(voiceKey, text, outPath) {
  const voice = getVoice(voiceKey);

  const queryRes = await callEngine(
    `/audio_query?speaker=${voice.speakerId}&text=${encodeURIComponent(text)}`,
    { method: 'POST' },
  );
  if (!queryRes.ok) {
    throw new Error(
      `audio_query failed (${queryRes.status}): ${await queryRes.text()}`,
    );
  }
  const query = await queryRes.json();

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

  await mkdir(dirname(outPath), { recursive: true });
  const tmpWav = `${outPath}.tmp.wav`;
  await writeFile(tmpWav, wavBuffer);
  try {
    await encodeMp3(tmpWav, outPath);
  } finally {
    // 轉檔失敗也要清掉暫存的 wav，不留半成品在 public/ 底下
    await rm(tmpWav, { force: true });
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
      const out = await synthesizeOne(job.voice, job.text, job.out);
      console.log(`OK ${out}`);
    }
    return;
  }

  if (!args.voice || !args.text || !args.out) {
    console.error(
      'usage: node scripts/synthesize.mjs --voice <key> --text "..." --out <path.mp3>',
    );
    console.error('   or: node scripts/synthesize.mjs --batch <jobs.json>');
    process.exit(1);
  }

  const out = await synthesizeOne(args.voice, args.text, args.out);
  console.log(`OK ${out}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
