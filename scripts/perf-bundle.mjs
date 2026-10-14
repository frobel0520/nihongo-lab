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

// sw.js 由 vite-plugin-pwa 產生，precache 清單是 {url:"…",revision:…} 的陣列。
const sw = await readFile(join(dist, 'sw.js'), 'utf8');
const urls = [...new Set([...sw.matchAll(/url:"([^"]+)"/g)].map((m) => m[1]))];
if (!urls.length) throw new Error('sw.js 找不到 precache 清單');
let precacheBytes = 0;
for (const url of urls) precacheBytes += (await stat(join(dist, url))).size;

const measured = {
  mainJsBytes: js.raw,
  mainJsGzipBytes: js.gzip,
  cssGzipBytes: css.gzip,
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
