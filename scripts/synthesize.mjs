// 呼叫本機 VOICEVOX 引擎產生教材語音，轉成 mp3。
// 用法：
//   node scripts/synthesize.mjs --voice zundamon --text "こんにちは" --out public/audio/sample.mp3
//   node scripts/synthesize.mjs --batch curriculum/audio-jobs.json
//
// 執行前需先開啟 VOICEVOX.exe（或 vv-engine/run.exe），監聽 127.0.0.1:50021。

import { spawn } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { getVoice } from '../curriculum/voices.mjs';

const ENGINE_URL = 'http://127.0.0.1:50021';

async function synthesizeOne(voiceKey, text, outPath) {
  const voice = getVoice(voiceKey);

  const queryRes = await fetch(
    `${ENGINE_URL}/audio_query?speaker=${voice.speakerId}&text=${encodeURIComponent(text)}`,
    { method: 'POST' },
  );
  if (!queryRes.ok) {
    throw new Error(`audio_query failed (${queryRes.status}): ${await queryRes.text()}`);
  }
  const query = await queryRes.json();

  const synthRes = await fetch(`${ENGINE_URL}/synthesis?speaker=${voice.speakerId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  });
  if (!synthRes.ok) {
    throw new Error(`synthesis failed (${synthRes.status}): ${await synthRes.text()}`);
  }
  const wavBuffer = Buffer.from(await synthRes.arrayBuffer());

  await mkdir(dirname(outPath), { recursive: true });
  const tmpWav = `${outPath}.tmp.wav`;
  await writeFile(tmpWav, wavBuffer);

  await new Promise((resolve, reject) => {
    const ff = spawn('ffmpeg', ['-y', '-i', tmpWav, '-codec:a', 'libmp3lame', '-b:a', '96k', outPath]);
    let stderr = '';
    ff.stderr.on('data', (d) => (stderr += d));
    ff.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exit ${code}: ${stderr}`))));
  });

  await rm(tmpWav);
  return outPath;
}

function parseArgs(argv) {
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
    const jobs = JSON.parse(await (await import('node:fs/promises')).readFile(args.batch, 'utf8'));
    for (const job of jobs) {
      const out = await synthesizeOne(job.voice, job.text, job.out);
      console.log(`OK ${out}`);
    }
    return;
  }

  if (!args.voice || !args.text || !args.out) {
    console.error('usage: node scripts/synthesize.mjs --voice <key> --text "..." --out <path.mp3>');
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
