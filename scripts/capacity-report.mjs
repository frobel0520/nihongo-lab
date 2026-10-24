// 容量盤點（T161）：從實際 build 產物統計 APP 預快取、單字圖片、教材音檔與聲線預覽。
// node scripts/capacity-report.mjs [--dist dist] [--out file.json]
// 同一 URL 只算一次；原始檔案 bytes 不等於手機實際儲存占用（瀏覽器會另加快取中繼資料與檔案系統開銷）。
import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { loadAllAudioPaths } from '../curriculum/lessons.mjs';

/** @param {string} name @param {string} fallback */
const argValue = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i === -1 ? fallback : process.argv[i + 1];
};
const dist = argValue('--dist', 'dist');
const out = argValue('--out', '');

/** @param {number} bytes */
export const units = (bytes) => ({
  bytes,
  MB: Number((bytes / 1e6).toFixed(2)),
  MiB: Number((bytes / 1048576).toFixed(2)),
});

/** @param {string} dir @returns {Promise<string[]>} */
async function walk(dir) {
  const entries = await readdir(join(dist, dir), { withFileTypes: true });
  const files = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)])),
  );
  return files.flat().map((f) => f.replaceAll('\\', '/'));
}

/** @param {Iterable<string>} urls */
async function measure(urls) {
  let bytes = 0;
  let files = 0;
  for (const url of urls) {
    bytes += (await stat(join(dist, url))).size;
    files++;
  }
  return { files, ...units(bytes) };
}

/** @param {string} url */
const precacheGroup = (url) =>
  url.startsWith('images/vocab/') ? 'vocabSvg'
  : url.startsWith('game-portraits/') ? 'gamePortraits'
  : url.startsWith('assets/') ? 'appCode'
  : url.startsWith('voice-preview/') ? 'voicePreview'
  : /\.(png|ico|svg|jpg)$/.test(url) ? 'icons'
  : 'appShell';

const sw = await readFile(join(dist, 'sw.js'), 'utf8');
const precache = [...new Set([...sw.matchAll(/url:"([^"]+)"/g)].map((m) => m[1]))];
/** @type {Record<string, string[]>} */
const groups = {};
for (const url of precache) (groups[precacheGroup(url)] ??= []).push(url);

const svgs = (await walk('images/vocab')).filter((f) => f.endsWith('.svg'));
const audio = (await loadAllAudioPaths()).map((p) => p.replace(/^\//, ''));
const voicePreview = await walk('voice-preview');
const voiceMp3 = voicePreview.filter((f) => f.endsWith('.mp3'));
const precacheSet = new Set(precache);

const report = {
  dist,
  note: 'Raw served file bytes. MB = 10^6 bytes, MiB = 2^20 bytes. Browser storage adds cache metadata and file-system overhead, so device usage differs.',
  precache: {
    total: await measure(precache),
    byGroup: Object.fromEntries(
      await Promise.all(Object.entries(groups).sort().map(async ([k, v]) => [k, await measure(v)])),
    ),
    requiredAppExcludingOptionalImagesAndAudio: await measure(
      precache.filter((u) => !u.startsWith('images/vocab/') && !u.endsWith('.mp3')),
    ),
  },
  vocabSvgAll: await measure(svgs),
  lessonAudioAll: await measure(audio),
  voicePreview: { all: await measure(voicePreview), mp3: await measure(voiceMp3) },
  // 全部下載後：預快取＋全部單字圖片＋全部教材音檔，同一 URL 只算一次（聲線預覽是線上試聽頁，不列入）。
  everythingDownloaded: await measure(new Set([...precache, ...svgs, ...audio])),
  overlap: {
    svgAlsoPrecached: svgs.filter((s) => precacheSet.has(s)).length,
    audioAlsoPrecached: audio.filter((a) => precacheSet.has(a)).length,
  },
};
const json = JSON.stringify(report, null, 2);
if (out) await writeFile(out, json + '\n');
console.log(json);
