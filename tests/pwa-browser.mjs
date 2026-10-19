// Production-build browser regression. Usage:
// CHROME_PATH=/path/to/chrome node tests/pwa-browser.mjs --dist dist
// Both directories must contain real /nihongo-lab/ builds and their workers.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright-core';
import { loadAllAudioPaths, loadLesson } from '../curriculum/lessons.mjs';

const option = (name, fallback) => process.argv.includes(name)
  ? process.argv[process.argv.indexOf(name) + 1] : fallback;
const roots = { current: resolve(option('--dist', 'dist')) };
const paths = await loadAllAudioPaths();
assert.ok(paths.length > 3000);
const failPath = paths[1];
let failOnce = true;
const downloads = new Map();
const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const relative = decodeURIComponent(url.pathname).replace(/^\/nihongo-lab\//, '');
  if (url.searchParams.has('offline-download')) {
    downloads.set(relative, (downloads.get(relative) ?? 0) + 1);
    if (relative === failPath && failOnce) {
      failOnce = false; res.writeHead(503).end('synthetic partial failure'); return;
    }
  }
  try {
    const file = resolve(roots.current, relative || 'index.html');
    assert.ok(file.startsWith(roots.current + '/'));
    const bytes = await readFile(file);
    res.setHeader('Content-Type', ({ '.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.mp3': 'audio/mp3' })[extname(file)] ?? 'application/octet-stream');
    if (extname(file) === '.mp3') res.setHeader('Vary', 'Accept-Encoding');
    res.setHeader('Cache-Control', 'no-cache');
    res.end(bytes);
  } catch { res.writeHead(404).end('missing'); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/nihongo-lab/`;
const executablePath = process.env.CHROME_PATH || ['chromium', 'google-chrome'].map(name => {
  try { return execFileSync('which', [name], { encoding: 'utf8' }).trim(); } catch { return ''; }
}).find(Boolean);
const browser = await chromium.launch({ executablePath, headless: true, args: ['--no-sandbox'] });
try {
  if (!process.argv.includes('--quota-only')) {
  const context = await browser.newContext({ viewport: { width: 375, height: 667 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base + '#/settings');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.waitForFunction(() => navigator.serviceWorker.controller);
  // A real pre-existing v5 download must remain usable, without migration.
  await page.evaluate(async path => {
    const url = new URL(path, location.href).href;
    const response = await fetch(url + '?offline-download=1');
    await (await caches.open('lesson-audio-v5')).put(url, response);
  }, paths[0]);
  await page.reload();
  await page.getByRole('button', { name: '下載全部課程音檔', exact: true }).click();
  await page.getByText(/失敗 1 個/).waitFor({ timeout: 180000 });
  assert.equal(await page.evaluate(async () => (await (await caches.open('lesson-audio-v5')).keys()).length), paths.length - 1);
  const beforeRetry = [...downloads.values()].reduce((a, b) => a + b, 0);
  await page.getByRole('button', { name: '下載全部課程音檔', exact: true }).click();
  await page.getByRole('button', { name: '全部課程音檔已存好', exact: true }).waitFor({ timeout: 30000 });
  assert.equal([...downloads.values()].reduce((a, b) => a + b, 0) - beforeRetry, 1);
  // Read every real audio file through the actual worker, exercising its policy.
  await page.evaluate(async paths => {
    let next = 0;
    await Promise.all(Array.from({ length: 4 }, async () => {
      while (next < paths.length) {
        const r = await fetch(new URL(paths[next++], location.href), { headers: { Range: 'bytes=0-99' } });
        if (r.status !== 206 || (await r.arrayBuffer()).byteLength !== 100) throw Error('invalid cached range');
      }
    }));
    await new Promise(r => setTimeout(r, 1000));
    await fetch(new URL(paths.at(-1), location.href));
    await new Promise(r => setTimeout(r, 1000));
  }, paths);
  const retained = await page.evaluate(async () => (await (await caches.open('lesson-audio-v5')).keys()).length);
  assert.equal(retained, paths.length, 'reading other audio must not evict explicit downloads');
  await context.setOffline(true);
  await page.reload();
  await page.getByRole('button', { name: '全部課程音檔已存好', exact: true }).waitFor();
  const samples = [paths[0], paths[3001], paths.at(-1)];
  for (const path of samples) {
    const size = await page.evaluate(async path => {
      const r = await fetch(new URL(path, location.href), { headers: { Range: 'bytes=0-99' } });
      if (r.status !== 206) throw Error('offline range failed');
      return (await r.arrayBuffer()).byteLength;
    }, path);
    assert.equal(size, 100);
  }
  assert.equal(await page.evaluate(() => navigator.onLine), false);
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ scenario: 'retained-downloads', downloadedRealFiles: paths.length, readThroughWorker: paths.length, retained, offlineSamples: samples.length, failedThenRetried: 1, pageerrors: errors.length }));
  await context.close();
  }
  // Inject a quota exception at the real page-side Cache.put boundary. This is
  // failure handling coverage, not a claim to exhaust a physical device's disk.
  const quotaContext = await browser.newContext({ viewport: { width: 375, height: 667 } });
  const q = await quotaContext.newPage();
  const lesson = await loadLesson('general-listening-180');
  const quotaErrors = [];
  q.on('pageerror', error => quotaErrors.push(error.message));
  await q.goto(base + '#/lesson/general-listening-180');
  await q.evaluate(() => navigator.serviceWorker.ready);
  await q.reload();
  const playbackStored = await q.evaluate(async path => {
    const url = new URL(path, location.href).href;
    const response = await fetch(url);
    if (response.status !== 200) throw Error('full playback response missing');
    await response.arrayBuffer();
    await new Promise(r => setTimeout(r, 200));
    return !!await (await caches.open('lesson-audio-v5')).match(url);
  }, lesson.vocab[0].audio);
  assert.equal(playbackStored, false, 'ordinary full playback must not add retained downloads');
  await q.evaluate(() => {
    const put = Cache.prototype.put;
    let once = true;
    Cache.prototype.put = async function(request, response) {
      const url = typeof request === 'string' ? request : request.url;
      if (once && url.includes('/general-listening-180/')) {
        once = false; throw new DOMException('synthetic quota failure', 'QuotaExceededError');
      }
      return put.call(this, request, response);
    };
  });
  await q.getByText('下載本課音檔供離線使用', { exact: true }).click();
  await q.getByRole('button', { name: '下載本課音檔', exact: true }).click();
  await q.getByText(/失敗 1 個/).waitFor();
  assert.equal(await q.getByRole('button', { name: '本課音檔已全部存好', exact: true }).count(), 0);
  await q.getByRole('button', { name: '下載本課音檔', exact: true }).click();
  await q.getByRole('button', { name: '本課音檔已全部存好', exact: true }).waitFor();
  await quotaContext.setOffline(true);
  await q.reload();
  await q.getByRole('button', { name: '播放完整對話', exact: true }).click();
  await q.waitForFunction(() => { const a = document.querySelector('.scene-listening audio'); return a && !a.paused && a.readyState >= 2; });
  await q.getByRole('button', { name: '停止對話', exact: true }).click();
  await q.getByText('下載本課音檔供離線使用', { exact: true }).click();
  await q.getByRole('button', { name: '本課音檔已全部存好', exact: true }).waitFor();
  await q.evaluate(async path => { await (await caches.open('lesson-audio-v5')).delete(new URL(path, location.href)); }, lesson.vocab[0].audio);
  await q.getByRole('button', { name: '重新檢查下載狀態', exact: true }).click();
  await q.getByRole('button', { name: '下載本課音檔', exact: true }).waitFor();
  assert.deepEqual(quotaErrors, []);
  console.log(JSON.stringify({ scenario: 'quota-and-real-cache-state', ordinaryPlaybackNotStored: true, quotaFailureReported: true, retrySucceeded: true, removedFileDetected: true, nativeOfflinePlaybackWithVary: true, pageerrors: quotaErrors.length }));
  await quotaContext.close();
} finally {
  await browser.close();
  await new Promise(r => server.close(r));
}
