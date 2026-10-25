// T161 browser regression for vocabulary image downloads on a real /nihongo-lab/ build.
// CHROME_PATH=/path/to/chrome node tests/image-download-browser.mjs --dist dist
//   [--old-dist <build that still precached images>] [--latency <ms per request>] [--out result.json]
// With --old-dist it also measures the old first install under the same server and
// upgrades old → new through the user-confirmed update, checking image migration.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright-core';
import { collectInventoryCards } from '../scripts/vocab-illustration-inventory.mjs';
import { illustrationFor } from '../lib/vocab-illustrations.mjs';
import { emptyProgress, serializeProgress } from '../lib/progress.mjs';
import { schedule, toDateString } from '../lib/srs.mjs';
import { loadAllAudioPaths } from '../curriculum/lessons.mjs';
import { buildVocabImageManifestRows } from '../scripts/vocab-image-manifest.mjs';

const option = (name, fallback) => process.argv.includes(name) ? process.argv[process.argv.indexOf(name) + 1] : fallback;
const current = resolve(option('--dist', 'dist'));
const oldDist = option('--old-dist', '') && resolve(option('--old-dist', ''));
const latency = Number(option('--latency', '0'));
const outFile = option('--out', '');
const rows = await buildVocabImageManifestRows(current + '/images/vocab');
const versioned = rows.map(([name, v]) => `images/vocab/${name}.svg?v=${v}`);
const totalImageBytes = rows.reduce((sum, [, , bytes]) => sum + bytes, 0);
const cards = await collectInventoryCards();
const illustrated = cards.filter(illustrationFor);
const sample = ['n5', 'general', 'anime', 'games'].map(category => illustrated.find(c => c.category === category));
const audioPaths = (await loadAllAudioPaths()).slice(0, 3);

let root = current;
let rejectNextInstall = false;
let downloadDelay = 0;
const failures = new Map();
const stats = { requests: 0, bytes: 0, images: 0, imageDownloads: new Map() };
const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const relative = decodeURIComponent(url.pathname).replace(/^\/nihongo-lab\//, '');
  if (rejectNextInstall && relative === 'index.html' && req.headers['service-worker'] === undefined && req.headers['sec-fetch-dest'] !== 'document') {
    rejectNextInstall = false; res.writeHead(503).end('synthetic installation failure'); return;
  }
  if (latency) await new Promise(r => setTimeout(r, latency));
  if (url.searchParams.has('offline-download') && relative.startsWith('images/vocab/')) {
    stats.imageDownloads.set(relative, (stats.imageDownloads.get(relative) ?? 0) + 1);
    if (downloadDelay) await new Promise(r => setTimeout(r, downloadDelay));
    const left = failures.get(relative) ?? 0;
    if (left > 0) { failures.set(relative, left - 1); res.writeHead(503).end('synthetic failure'); return; }
  }
  try {
    const file = resolve(root, relative || 'index.html');
    assert.ok(file.startsWith(root));
    const bytes = await readFile(file);
    stats.requests++; stats.bytes += bytes.length;
    if (relative.startsWith('images/vocab/')) stats.images++;
    res.setHeader('Content-Type', ({ '.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.mp3': 'audio/mp3' })[extname(file)] ?? 'application/octet-stream');
    // GitHub Pages sends Vary: Accept-Encoding; cached reads must ignore it.
    if (['.mp3', '.svg'].includes(extname(file))) res.setHeader('Vary', 'Accept-Encoding');
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
const result = { dist: 'current', latencyMs: latency, images: rows.length, imageBytes: totalImageBytes };
const errors = [];
const observe = page => { page.on('pageerror', e => errors.push(e.message)); page.on('dialog', d => d.accept()); };
const resetStats = () => { stats.requests = 0; stats.bytes = 0; stats.images = 0; stats.imageDownloads.clear(); };
const countCache = (page, name) => page.evaluate(async name => (await (await caches.open(name)).keys()).length, name);
// waitForFunction does not await async predicates; poll registration state in the page instead.
const registrationState = (page, want, timeout = 600000) => page.evaluate(async ({ want, timeout }) => {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const r = await navigator.serviceWorker.getRegistration();
    if (want === 'waiting' ? r?.waiting && !r.installing : r?.active?.state === 'activated' && !r.waiting && !r.installing) return;
    await new Promise(res => setTimeout(res, 50));
  }
  const r = await navigator.serviceWorker.getRegistration();
  throw Error('worker did not reach ' + want + ' ' + JSON.stringify({ i: r?.installing?.state, w: r?.waiting?.state, a: r?.active?.state, url: r?.active?.scriptURL }));
}, { want, timeout });
const activeAndControlled = async page => {
  await page.evaluate(() => navigator.serviceWorker.ready);
  await registrationState(page, 'active');
  await page.reload();
  await page.waitForFunction(() => navigator.serviceWorker.controller);
};
const today = toDateString();
const dueOnly = card => { const p = emptyProgress(); p.srs[card.id] = schedule(undefined, 'again', today, new Date().toISOString()); return serializeProgress(p); };
async function revealCard(page, card, { expectImage = true } = {}) {
  await page.evaluate(([k, v]) => localStorage.setItem(k, v), ['nihongo-lab:progress:v1', dueOnly(card)]);
  await page.goto(base + `#/srs?category=${card.category}`);
  await page.reload();
  await page.waitForSelector('.flash-word');
  assert.equal(await page.textContent('.flash-word'), card.word);
  assert.equal(await page.locator('img.vocab-illustration').count(), 0, 'front hides the image');
  await page.getByRole('button', { name: '顯示答案', exact: true }).click();
  if (expectImage) {
    await page.waitForFunction(() => { const i = document.querySelector('img.vocab-illustration'); return i && i.complete && i.naturalWidth > 0; }, null, { timeout: 15000 });
    const src = await page.getAttribute('img.vocab-illustration', 'src');
    assert.ok(src.includes(illustrationFor(card).src + '?v='), src);
  } else {
    await page.waitForTimeout(1500);
    assert.equal(await page.locator('img.vocab-illustration').count(), 0, 'missing image degrades to text');
  }
  const before = await page.evaluate(() => localStorage.getItem('nihongo-lab:progress:v1'));
  await page.getByRole('button', { name: /^記得，/ }).click();
  await page.waitForFunction(b => localStorage.getItem('nihongo-lab:progress:v1') !== b, before);
}
async function firstInstall(dist, label) {
  root = dist;
  const context = await browser.newContext({ viewport: { width: 375, height: 667 } });
  const page = await context.newPage(); observe(page);
  resetStats();
  const t0 = Date.now();
  await page.goto(base);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await registrationState(page, 'active');
  const measured = { label, ms: Date.now() - t0, requests: stats.requests, bytes: stats.bytes, imageRequests: stats.images,
    precacheEntries: await page.evaluate(async () => { let c = 0; for (const k of await caches.keys()) if (k.startsWith('workbox-precache')) c += (await (await caches.open(k)).keys()).length; return c; }) };
  return { context, page, measured };
}

try {
  if (!process.argv.includes('--migration-only')) {
  // 1. Fresh install of the new build: no vocabulary image is fetched in the background.
  const fresh = await firstInstall(current, 'new');
  result.firstInstallNew = fresh.measured;
  assert.equal(fresh.measured.imageRequests, 0, 'new install must not prefetch vocabulary images');
  const { context, page } = fresh;
  await activeAndControlled(page);
  await page.evaluate(async paths => {
    const cache = await caches.open('lesson-audio-v5');
    for (const path of paths) { const u = new URL(path, location.href).href; await cache.put(u, await fetch(u + '?offline-download=1')); }
  }, audioPaths);

  // 2. Online reveal loads one image into the bounded browse cache only.
  resetStats();
  await revealCard(page, sample[0]);
  assert.equal(stats.images, 1);
  assert.equal(await countCache(page, 'vocab-images-browse-v1'), 1);
  assert.equal(await countCache(page, 'vocab-images-v1'), 0, 'browsing never counts as an explicit download');

  // 2b (T163). Keyboard focus: revealing or grading removes the pressed button; focus moves to the next control
  // instead of falling to <body>. Mouse clicks do not move focus. Covers reveal, grade, next card and a relearn round.
  {
    const pair = illustrated.filter(c => c.category === 'n5').slice(0, 2);
    const focused = () => page.evaluate(() => { const a = document.activeElement; return a === document.body ? 'body' : a.matches('fieldset.grades') ? 'grades' : a.matches('.flash-word') ? '句首' : (a.getAttribute('aria-label') ?? a.textContent).trim().slice(0, 8); });
    await page.evaluate(([k, v]) => localStorage.setItem(k, v), ['nihongo-lab:progress:v1', (() => { const p = emptyProgress(); for (const c of pair) p.srs[c.id] = schedule(undefined, 'again', today, new Date().toISOString()); return serializeProgress(p); })()]);
    await page.goto(base + '#/srs?category=n5');
    await page.reload();
    await page.waitForSelector('.flash-word');
    const first = await page.textContent('.flash-word');
    await page.getByRole('button', { name: '顯示答案', exact: true }).focus();
    await page.keyboard.press('Enter');
    assert.equal(await focused(), 'grades', 'keyboard reveal focuses the grading group');
    await page.keyboard.press('Tab');
    assert.match(await focused(), /^還不會/, 'Tab reaches the first grade');
    await page.keyboard.press('Enter'); // 還不會: this card comes back later in the round
    assert.notEqual(await page.textContent('.flash-word'), first);
    assert.equal(await focused(), '句首', 'next presentation: focus starts at the reading text');
    await page.keyboard.press(' ');
    assert.equal(await focused(), 'grades');
    await page.keyboard.press('2');
    assert.equal(await page.textContent('.flash-word'), first, 'the relearn card comes back covered');
    assert.equal(await focused(), '句首', 'relearn round keeps focus at the reading start');
    // Mouse and touch keep the browser's own behaviour: no focus is moved.
    await page.getByRole('button', { name: '顯示答案', exact: true }).click();
    assert.notEqual(await focused(), 'grades', 'pointer clicks do not move focus');
    result.keyboardFocus = { reveal: 'grades', afterGrade: '句首', relearn: true, pointerUnchanged: true };
  }

  // 3. Explicit download with retries, a persistent failure, an interruption and a resume.
  await page.goto(base + '#/settings');
  await page.getByText(`共 ${rows.length} 張`, { exact: false }).waitFor();
  const retried = versioned.at(-3).split('?')[0];
  const persistent = versioned.at(-2).split('?')[0];
  const startButton = (p) => p.getByRole('button', { name: /^下載(全部|其餘)單字圖片$/ });
  const savedNow = () => countCache(page, 'vocab-images-v1');

  // 3a (T163). Offline when pressing download: say so at once, send no request.
  resetStats();
  await context.setOffline(true);
  let t0 = Date.now();
  await startButton(page).click();
  await page.getByText('目前沒有網路，無法下載圖片', { exact: false }).waitFor({ timeout: 2000 });
  assert.equal(stats.imageDownloads.size, 0);
  result.offlineStart = { ms: Date.now() - t0, requests: 0 };
  await context.setOffline(false);

  // 3b (T163). The browser says online but every request fails: pause after about one round, nothing counted as failed.
  let aborted = 0;
  const failAll = (route) => { aborted++; return route.abort('internetdisconnected'); };
  await page.route(/offline-download/, failAll);
  t0 = Date.now();
  await startButton(page).click();
  await page.getByText('網路中斷，下載已暫停', { exact: false }).waitFor({ timeout: 10000 });
  assert.ok(aborted <= 12, `stopped after ${aborted} failed requests`);
  assert.equal(await savedNow(), 0);
  assert.doesNotMatch(await page.textContent('body'), /失敗 \d+ 張/);
  result.connectedButFailing = { ms: Date.now() - t0, requests: aborted };
  await page.unroute(/offline-download/, failAll);

  // 3c (T163). The job outlives Settings: switching pages keeps downloading; back in Settings it shows the same job.
  downloadDelay = 15;
  resetStats();
  await startButton(page).click();
  await page.waitForFunction(() => /本次已存 ([3-9]\d|\d{3,}) \//.test(document.body.innerText));
  // Second tab: the cross-tab lock refuses a parallel run.
  const other = await context.newPage(); observe(other);
  await other.goto(base + '#/settings');
  await startButton(other).click();
  await other.getByText('另一個分頁正在下載圖片', { exact: false }).waitFor();
  await other.close();
  await page.evaluate(() => { location.hash = '#/srs'; });
  await page.waitForTimeout(1000);
  const whileAway = await savedNow();
  await page.waitForTimeout(1500);
  const later = await savedNow();
  assert.ok(later > whileAway, `keeps downloading on other pages (${whileAway} → ${later})`);
  await page.evaluate(() => { location.hash = '#/settings'; });
  await page.getByText('下載中：本次已存', { exact: false }).waitFor();
  assert.equal(await startButton(page).count(), 0, 'no second start while the job runs');
  // Cancel keeps what was saved.
  await page.getByRole('button', { name: '取消下載', exact: true }).click();
  await page.getByText('已取消：本次已存', { exact: false }).waitFor({ timeout: 10000 });
  const interrupted = await savedNow();
  assert.ok(interrupted > later && interrupted < rows.length, `cancelled after ${interrupted}`);

  // 3d (T163). Going offline mid-run pauses quickly and keeps saved images.
  await startButton(page).click();
  await page.waitForFunction(() => /本次已存 ([1-9]\d|\d{3,}) \//.test(document.body.innerText));
  const beforeDrop = await savedNow();
  t0 = Date.now();
  await context.setOffline(true);
  await page.getByText('網路中斷，下載已暫停', { exact: false }).waitFor({ timeout: 5000 });
  result.offlineMidRun = { ms: Date.now() - t0, keptAtLeast: beforeDrop };
  assert.ok(await savedNow() >= beforeDrop);
  await context.setOffline(false);

  downloadDelay = 0;
  failures.set(retried, 2); // recovers through automatic retries
  failures.set(persistent, 3); // still failing after both retries
  await startButton(page).click();
  await page.getByText(/失敗 1 張/).waitFor({ timeout: 300000 });
  const repeated = [...stats.imageDownloads.entries()].filter(([path, n]) => n > 1 && !failures.has(path));
  assert.deepEqual(repeated, [], 'resumed run skips images already saved');
  assert.equal(stats.imageDownloads.get(retried), 3);
  assert.equal(stats.imageDownloads.get(persistent), 3);
  assert.equal(await countCache(page, 'vocab-images-v1'), rows.length - 1);
  failures.clear();
  await page.getByRole('button', { name: '下載其餘單字圖片', exact: true }).click();
  await page.getByRole('button', { name: '單字圖片已全部存好', exact: true }).waitFor();
  result.download = { keptDownloadingAway: later - whileAway, interruptedAt: interrupted, retriedThenSaved: 1, failedThenRetried: 1, parallelTabRefused: true, requests: [...stats.imageDownloads.values()].reduce((a, b) => a + b, 0) };

  // 3e (T163). After a finished download, a changed image list shows a one-line reminder once per version.
  const completeKey = 'nihongo-lab:vocab-images:complete';
  assert.ok(await page.evaluate(k => localStorage.getItem(k), completeKey), 'finishing records the downloaded version');
  assert.equal(await page.getByText('單字圖片有新增或更新', { exact: false }).count(), 0, 'not shown on Settings');
  await page.evaluate(k => localStorage.setItem(k, 'older0000000'), completeKey);
  await page.goto(base + '#/');
  await page.reload();
  await page.getByText('單字圖片有新增或更新', { exact: false }).waitFor();
  assert.equal(await page.getByRole('link', { name: '前往下載' }).getAttribute('href'), '#/settings');
  await page.getByRole('button', { name: '知道了', exact: true }).click();
  await page.reload();
  await page.waitForSelector('nav.tabs');
  assert.equal(await page.getByText('單字圖片有新增或更新', { exact: false }).count(), 0, 'dismissed for this version');
  await page.goto(base + '#/settings');
  await page.getByRole('button', { name: '單字圖片已全部存好', exact: true }).waitFor();
  assert.notEqual(await page.evaluate(k => localStorage.getItem(k), completeKey), 'older0000000', 'Settings re-confirms the current version');
  result.updateHint = { shownAfterChange: true, dismissedOncePerVersion: true };

  // 4. True offline: reload, read every image through the worker and compare content versions.
  await context.setOffline(true);
  await page.reload();
  await page.getByRole('button', { name: '單字圖片已全部存好', exact: true }).waitFor();
  const shaMismatches = await page.evaluate(async list => {
    const bad = [];
    for (const path of list) {
      const r = await fetch(new URL(path, location.href));
      const body = await r.arrayBuffer();
      const hex = [...new Uint8Array(await crypto.subtle.digest('SHA-256', body))].map(b => b.toString(16).padStart(2, '0')).join('');
      if (r.status !== 200 || !path.endsWith('?v=' + hex.slice(0, 12))) bad.push(path);
    }
    return bad;
  }, versioned);
  assert.deepEqual(shaMismatches, []);
  for (const card of sample) await revealCard(page, card);
  result.offline = { imagesReadThroughWorker: versioned.length, shaMismatches: 0, cardsRevealed: sample.length };

  // 5. A missing image offline degrades to text, and a revised image shows as pending until downloaded.
  const missingCard = sample[1];
  const missingSrc = illustrationFor(missingCard).src;
  const missingVersioned = versioned.find(v => v.startsWith(missingSrc + '?'));
  await page.evaluate(async ([path, src]) => {
    const explicit = await caches.open('vocab-images-v1');
    const url = new URL(path, location.href).href;
    const response = await explicit.match(url);
    await explicit.delete(url);
    await (await caches.open('vocab-images-browse-v1')).delete(url);
    await explicit.put(new URL(src + '?v=000000000000', location.href).href, response);
  }, [missingVersioned, missingSrc]);
  await revealCard(page, missingCard, { expectImage: false });
  await page.goto(base + '#/settings');
  await page.getByText('1 張是更新過的新版', { exact: false }).waitFor();
  await context.setOffline(false);
  resetStats();
  await page.getByRole('button', { name: '下載其餘單字圖片', exact: true }).click();
  await page.getByRole('button', { name: '單字圖片已全部存好', exact: true }).waitFor();
  assert.equal(stats.imageDownloads.size, 1, 'an update fetches only the changed image');
  assert.equal(await page.evaluate(async src => !!(await (await caches.open('vocab-images-v1')).match(new URL(src + '?v=000000000000', location.href).href)), missingSrc), false, 'old version removed after the new one is saved');
  await revealCard(page, missingCard);
  result.versionUpdate = { pendingShown: true, downloadedOnlyChanged: 1, oldVersionPrunedAfterSave: true, missingImageDegraded: true };

  // 6. Explicit downloads, audio and progress survive.
  assert.equal(await countCache(page, 'vocab-images-v1'), rows.length);
  assert.equal(await countCache(page, 'lesson-audio-v5'), audioPaths.length);
  assert.ok(await countCache(page, 'vocab-images-browse-v1') <= 400);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await context.close();
  }

  if (oldDist) {
    // 7. Same server and latency: old first install for comparison.
    const before = await firstInstall(oldDist, 'old');
    result.firstInstallOld = before.measured;
    await before.context.close();

    // 8. Old → new upgrade through the user-confirmed update; an interrupted install retries.
    root = oldDist;
    const ctx = await browser.newContext({ viewport: { width: 375, height: 667 } });
    const p = await ctx.newPage(); observe(p);
    await p.goto(base + '#/settings');
    await activeAndControlled(p);
    const precachedBefore = await p.evaluate(async () => { let c = 0; for (const k of await caches.keys()) if (k.startsWith('workbox-precache')) c += (await (await caches.open(k)).keys()).filter(r => r.url.includes('/images/vocab/')).length; return c; });
    const progress = emptyProgress();
    for (const card of sample) progress.srs[card.id] = schedule(undefined, 'good', '2026-10-20', '2026-10-20T00:00:00.000Z');
    const saved = serializeProgress(progress);
    await p.evaluate(async ({ saved, audioPaths }) => {
      localStorage.setItem('nihongo-lab:progress:v1', saved);
      const cache = await caches.open('lesson-audio-v5');
      for (const path of audioPaths) { const u = new URL(path, location.href).href; await cache.put(u, await fetch(u + '?offline-download=1')); }
    }, { saved, audioPaths });
    root = current;
    rejectNextInstall = true;
    await p.evaluate(async () => { try { await (await navigator.serviceWorker.getRegistration()).update(); } catch { /* the first install attempt is rejected */ } });
    // The rejected attempt must end (redundant) before the retry; update() during it is a no-op.
    await p.evaluate(async () => { const deadline = Date.now() + 120000; while (Date.now() < deadline) { const r = await navigator.serviceWorker.getRegistration(); if (!r.installing && !r.waiting) return; await new Promise(res => setTimeout(res, 50)); } throw Error('rejected install did not end'); });
    await p.evaluate(async () => { await (await navigator.serviceWorker.getRegistration()).update(); });
    await registrationState(p, 'waiting', 120000);
    // Install has finished (worker waiting), so every precached image must already be copied.
    const migratedWhileWaiting = await countCache(p, 'vocab-images-v1');
    assert.equal(migratedWhileWaiting, precachedBefore, 'migration completes inside the install step');
    resetStats();
    await p.reload();
    await p.getByRole('button', { name: '更新並重新載入', exact: true }).click();
    await registrationState(p, 'active', 60000);
    await p.waitForLoadState('domcontentloaded');
    await p.goto(base + '#/settings');
    await p.getByRole('button', { name: '單字圖片已全部存好', exact: true }).waitFor({ timeout: 30000 });
    const precachedAfter = await p.evaluate(async () => { let c = 0; for (const k of await caches.keys()) if (k.startsWith('workbox-precache')) c += (await (await caches.open(k)).keys()).filter(r => r.url.includes('/images/vocab/')).length; return c; });
    assert.equal(precachedAfter, 0, 'old precache images are cleaned up after activation');
    assert.equal(stats.imageDownloads.size, 0, 'migration copies locally instead of downloading again');
    assert.equal(await p.evaluate(() => localStorage.getItem('nihongo-lab:progress:v1')), saved);
    assert.equal(await countCache(p, 'lesson-audio-v5'), audioPaths.length);
    await ctx.setOffline(true);
    await p.reload();
    for (const card of sample) await revealCard(p, card);
    result.migration = { precachedImagesBefore: precachedBefore, migratedWhileWaiting, precachedImagesAfter: precachedAfter, redownloaded: 0, interruptedInstallRetried: true, progressKept: true, audioKept: audioPaths.length, offlineCardsRevealed: sample.length };
    await ctx.close();
  }
  assert.deepEqual(errors, []);
  result.pageerrors = errors.length;
  console.log(JSON.stringify(result));
  if (outFile) await writeFile(outFile, JSON.stringify(result, null, 2) + '\n');
} finally {
  await browser.close();
  await new Promise(r => server.close(r));
}
