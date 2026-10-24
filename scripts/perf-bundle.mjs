// 量測 build 產物大小（T120）：主程式、CSS 與 service worker 預先快取（precache）總量。
// node scripts/perf-bundle.mjs [--dist dist] [--check]
// --check：依 scripts/perf-budget.mjs 的 bundle 門檻判定，超過就以非零結束（CI 使用）。
import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { evaluateBudgets, gatePassed } from '../lib/perf-stats.mjs';
import { BUNDLE_BUDGETS } from './perf-budget.mjs';

/** @param {string} name @param {string} fallback */
const argValue = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i === -1 ? fallback : process.argv[i + 1];
};
const dist = argValue('--dist', 'dist');

const assets = await readdir(join(dist, 'assets'));
/** @param {RegExp} pattern */
const pick = (pattern) => {
  const files = assets.filter((f) => pattern.test(f));
  if (files.length !== 1)
    throw new Error(`預期 1 個 ${pattern}，實際 ${files.length} 個`);
  return join(dist, 'assets', files[0]);
};
/** @param {string} file */
const sizes = async (file) => {
  const bytes = await readFile(file);
  return { raw: bytes.length, gzip: gzipSync(bytes, { level: 9 }).length };
};
const js = await sizes(pick(/^index-.*\.js$/));
const css = await sizes(pick(/^index-.*\.css$/));

// T163：單字卡配圖映射所在的 chunk 以內容找（含第一筆映射 ID），不靠檔名，改名也躲不過。
// 構圖描述是作者資料，任何 JS 產物都不得帶上。
const { VOCAB_ILLUSTRATIONS } = await import('../lib/vocab-illustrations.mjs');
const descriptions = Object.values(
  JSON.parse(await readFile(new URL('../docs/vocab-illustration-descriptions.json', import.meta.url), 'utf8')),
).sort((a, b) => b.length - a.length).slice(0, 20);
const jsFiles = assets.filter((f) => f.endsWith('.js'));
const illustrationChunks = [];
for (const file of jsFiles) {
  const text = await readFile(join(dist, 'assets', file), 'utf8');
  if (text.includes(VOCAB_ILLUSTRATIONS[0].id)) illustrationChunks.push(file);
  const leaked = descriptions.find((d) => text.includes(d));
  if (leaked) throw new Error(`${file} 帶有單字圖構圖描述（應只留在作者資料）：${leaked.slice(0, 20)}…`);
}
if (illustrationChunks.length !== 1)
  throw new Error(`預期 1 個含單字卡配圖映射的 chunk，實際 ${illustrationChunks.length} 個`);
const illustration = await sizes(join(dist, 'assets', illustrationChunks[0]));

// sw.js 由 vite-plugin-pwa 產生，precache 清單是 {url:"…",revision:…} 的陣列。
const sw = await readFile(join(dist, 'sw.js'), 'utf8');
const urls = [...new Set([...sw.matchAll(/url:"([^"]+)"/g)].map((m) => m[1]))];
if (!urls.length) throw new Error('sw.js 找不到 precache 清單');
// T161：單字圖片改為主動下載，不得回到首次安裝的 precache；APP 必要檔案仍須完整。
const precachedImages = urls.filter((url) => url.startsWith('images/vocab/'));
if (precachedImages.length) throw new Error(`precache 不應包含單字圖片：${precachedImages.slice(0, 3).join(', ')}`);
for (const required of ['index.html', 'sw-update-control.js', 'sw-image-migration.js', 'manifest.webmanifest']) {
  if (!urls.includes(required)) throw new Error(`precache 缺少必要檔案 ${required}`);
}
if (!sw.includes('vocab-images-v1')) throw new Error('sw.js 缺少單字圖片路由');
let precacheBytes = 0;
for (const url of urls) precacheBytes += (await stat(join(dist, url))).size;

const measured = {
  mainJsBytes: js.raw,
  mainJsGzipBytes: js.gzip,
  cssGzipBytes: css.gzip,
  illustrationChunkBytes: illustration.raw,
  illustrationChunkGzipBytes: illustration.gzip,
  precacheBytes,
  precacheEntries: urls.length,
};
console.log(JSON.stringify(measured, null, 2));

if (process.argv.includes('--check')) {
  const results = evaluateBudgets(measured, BUNDLE_BUDGETS);
  for (const r of results)
    console.log(`${r.status.padEnd(12)} ${r.metric} ${r.value} / ${r.limit} ${r.unit}`);
  if (!gatePassed(results)) {
    console.error('bundle 超過效能門檻（scripts/perf-budget.mjs）。');
    process.exit(1);
  }
}
