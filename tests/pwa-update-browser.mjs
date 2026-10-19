// Use actual production builds; never rewrite a generated worker or mock import().
// npm run test:pwa:update -- --old-dist old/dist --dist dist --next-dist next/dist
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright-core';
import { STUDY_CATALOG } from '../lib/study-catalog.mjs';
import { emptyProgress, serializeProgress } from '../lib/progress.mjs';
import { schedule } from '../lib/srs.mjs';
const arg = name => { const i = process.argv.indexOf(name); assert.ok(i >= 0, name + ' required'); return resolve(process.argv[i + 1]); };
const old = arg('--old-dist'), current = arg('--dist'), next = arg('--next-dist');
assert.notEqual(await readFile(current + '/sw.js', 'utf8'), await readFile(next + '/sw.js', 'utf8'), 'builds must have different real workers');
let root = old;
let rejectNextInstall = false;
const missing = [];
const server = createServer(async (req, res) => {
  const relative = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/nihongo-lab\//, '');
  if (rejectNextInstall && root === next && relative === 'index.html') { rejectNextInstall = false;res.writeHead(503).end('synthetic installation failure');return; }
  try {
    const file = resolve(root, relative || 'index.html'); assert.ok(file.startsWith(root + '/'));
    const bytes = await readFile(file);
    res.setHeader('content-type', ({ '.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.mp3': 'audio/mp3' })[extname(file)] ?? 'application/octet-stream');
    if (extname(file) === '.mp3') res.setHeader('Vary', 'Accept-Encoding');
    res.setHeader('cache-control', 'no-cache');res.end(bytes);
  } catch { missing.push(relative);res.writeHead(404).end('missing'); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/nihongo-lab/`;
const executablePath = process.env.CHROME_PATH || ['chromium', 'google-chrome'].map(name => { try { return execFileSync('which', [name], { encoding: 'utf8' }).trim(); } catch { return ''; } }).find(Boolean);
const browser = await chromium.launch({ executablePath, headless: true, args: ['--no-sandbox'] });
const progress = emptyProgress();
for (const c of Object.values(STUDY_CATALOG)) {
  progress.srs[c.cards[0].id] = schedule(undefined, 'good', '2026-10-19', '2026-10-19T00:00:00.000Z');
  progress.dictation[c.sentences[0].id] = { attempts: 1, passed: true, lastAt: '2026-10-19T00:00:00.000Z' };
}
const saved = serializeProgress(progress);
const savedAudio = [...new Set(Object.values(STUDY_CATALOG).flatMap(c => [...c.sentences.slice(0, 3), ...c.cards.slice(0, 3)].map(row => row.audio)))];
const errors = [];
function observe(page) { page.on('pageerror', e => errors.push(e.message));page.on('dialog', d => d.accept()); }
const navigate = async (page, hash) => { await page.evaluate(hash => { location.hash = hash; }, hash); };
const controlled = async page => { await page.evaluate(() => navigator.serviceWorker.ready);await page.reload();await page.waitForFunction(() => navigator.serviceWorker.controller); };
const waitRegistration = async (page, state) => page.evaluate(async state => {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    const reg = await navigator.serviceWorker.getRegistration();
    if (state === 'waiting' ? reg?.waiting && !reg.installing : reg?.active?.state === 'activated' && !reg.waiting && !reg.installing) return;
    await new Promise(r => setTimeout(r, 50));
  }
  throw Error('worker did not reach ' + state);
}, state);
const waiting = async page => { await page.evaluate(async () => { await (await navigator.serviceWorker.getRegistration()).update(); });await waitRegistration(page, 'waiting'); };
const checkSaved = async (page, added = false) => {
  const actual = JSON.parse(await page.evaluate(() => localStorage.getItem('nihongo-lab:progress:v1')));
  if (!added) assert.deepEqual(actual, JSON.parse(saved));
  else for (const key of ['srs', 'dictation']) for (const [id, value] of Object.entries(progress[key])) assert.deepEqual(actual[key][id], value);
  for (const path of savedAudio) assert.equal(await page.evaluate(async path => { const r = await fetch(new URL(path, location.href), { headers: { Range: 'bytes=0-99' } });return r.status === 206 && (await r.arrayBuffer()).byteLength === 100; }, path), true);
};
try {
  const context = await browser.newContext({ viewport: { width: 375, height: 667 } });
  let page = await context.newPage();observe(page);await page.goto(base + '#/settings');await controlled(page);
  await page.evaluate(async ({ saved, savedAudio }) => {
    localStorage.setItem('nihongo-lab:progress:v1', saved);
    const cache = await caches.open('lesson-audio-v5');
    for (const path of savedAudio) { const u = new URL(path, location.href).href;await cache.put(u, await fetch(u + '?offline-download=1')); }
    window.controllerChanges = 0;navigator.serviceWorker.addEventListener('controllerchange', () => window.controllerChanges++);
  }, { saved, savedAudio });
  root = current;
  await waiting(page);
  await page.waitForTimeout(250); // Let the activation event settle; this is not a performance gate.
  await waitRegistration(page, 'waiting');
  const stable = await page.evaluate(async () => { const r=await navigator.serviceWorker.getRegistration();return {waiting: r.waiting?.state, active:r.active?.state, installing:r.installing?.state, changes:window.controllerChanges, url:location.href}; });
  if (!stable.waiting) console.log(JSON.stringify({diagnostic:'unexpected-update-state',stable,errors,missing}));
  assert.equal(!!stable.waiting, true, 'update must remain waiting while the old page is open');
  await context.setOffline(true);
  await navigate(page, '#/lesson/general-listening-01');
  await page.getByRole('button', { name: '播放完整對話', exact: true }).waitFor();
  assert.equal(await page.evaluate(() => window.controllerChanges), 0);
  await checkSaved(page);
  // Legacy pages do not know the new waiting banner. Close them all to activate.
  await page.close();
  await new Promise(r => setTimeout(r, 3000));
  page = await context.newPage();observe(page);await page.goto(base + '#/settings');
  await page.getByRole('button', { name: '重新檢查下載狀態', exact: true }).waitFor().catch(async error => { console.log(JSON.stringify({body:await page.locator('body').innerText(),registration:await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();return {waiting:r?.waiting?.state,active:r?.active?.state,controller:!!navigator.serviceWorker.controller}}),errors,missing}));throw error; });
  await checkSaved(page);
  await context.setOffline(false);
  const other = await context.newPage();observe(other);await other.goto(base + '#/dictation?category=n5');
  await other.getByText('輸入', { exact: true }).click();
  await other.locator('#dictation-input').fill('synthetic unfinished answer');
  const otherUrl = other.url();
  await other.evaluate(() => { window.unchangedPage = true; });
  root = next;
  rejectNextInstall = true;
  const failed = await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(Error('no failed installation outcome')), 20000);
      reg.addEventListener('updatefound', () => {
        const worker = reg.installing;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'redundant') { clearTimeout(timer);resolve(true); }
        });
      }, { once: true });
      void reg.update().catch(reject);
    });
  });
  assert.equal(failed, true);
  assert.equal(await other.locator('#dictation-input').inputValue(), 'synthetic unfinished answer');
  await waiting(page);
  await page.getByRole('button', { name: '更新並重新載入', exact: true }).waitFor();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.getByRole('button', { name: '稍後', exact: true }).click();
  await navigate(page, '#/lesson/general-listening-180');
  await page.getByRole('button', { name: '播放完整對話', exact: true }).waitFor();
  // A newly opened page must also detect an already-waiting worker.
  await page.reload();await page.getByRole('button', { name: '更新並重新載入', exact: true }).waitFor();
  await page.getByRole('button', { name: '更新並重新載入', exact: true }).click();
  await page.getByText('請先完成並關閉本網站其他分頁，再按更新。其他分頁不會被自動重新載入。', { exact: true }).waitFor();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.equal(other.url(), otherUrl);
  assert.equal(await other.locator('#dictation-input').inputValue(), 'synthetic unfinished answer');
  assert.equal(await other.evaluate(() => window.unchangedPage), true);
  assert.equal(await page.evaluate(async () => !!(await navigator.serviceWorker.getRegistration()).waiting), true);
  await other.close();await context.setOffline(true);
  await Promise.all([page.waitForNavigation({ waitUntil: 'domcontentloaded' }), page.getByRole('button', { name: '更新並重新載入', exact: true }).click()]);
  await waitRegistration(page, 'active');
  await page.getByRole('button', { name: '播放完整對話', exact: true }).waitFor();
  await checkSaved(page);
  assert.equal(await page.getByRole('button', { name: '更新並重新載入', exact: true }).count(), 0);
  for (const category of ['n5', 'general', 'anime', 'games']) {
    for (const view of ['srs/new', 'dictation', 'shadowing']) {
      await navigate(page, `#/${view}?category=${category}`);
      await page.locator('section.study-context').waitFor();
      await page.waitForFunction(() => !document.querySelector('main')?.textContent.includes('正在載入教材'));
      assert.equal(await page.getByRole('alert').count(), 0);
      if (view === 'srs/new') {
        await page.getByRole('button', { name: '顯示答案', exact: true }).click();
        await page.getByRole('button', { name: /^記得，/ }).click();
      }
      if (view === 'dictation') {
        await page.getByText('輸入', { exact: true }).click();
        await page.locator('#dictation-input').fill(STUDY_CATALOG[category].sentences[1].jp);
        await page.getByRole('button', { name: '檢查', exact: true }).click();
      }
      if (view === 'shadowing') {
        await page.getByRole('button', { name: '開始跟讀', exact: true }).click();
        await page.waitForFunction(() => [...document.querySelectorAll('audio')].some(a => !a.paused && a.readyState >= 2));
        assert.equal(await page.evaluate(() => [...document.querySelectorAll('audio')].find(a => !a.paused).playbackRate), 1);
        await page.getByRole('button', { name: '停止', exact: true }).click();
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    }
  }
  await checkSaved(page, true);
  const practised = JSON.parse(await page.evaluate(() => localStorage.getItem('nihongo-lab:progress:v1')));
  assert.equal(Object.keys(practised.srs).length, 8);
  assert.equal(Object.keys(practised.dictation).length, 8);
  assert.equal(await page.evaluate(() => navigator.onLine), false);
  assert.deepEqual(errors, []);assert.deepEqual(missing, []);
  console.log(JSON.stringify({ scenario: 'waiting-update', legacyContinuedOffline: true, firstUpgradeAfterAllPagesClosed: true, subsequentWaitingPrompt: true, multiPageRefusedWithoutReloadOrInputLoss: true, partialInstallFailedAndRetried: true, explicitOfflineActivation: true, savedProgressUnchanged: true, retainedAudio: savedAudio.length, offlinePracticeRoutes: 12, fixedSpeed: 1, pageerrors: errors.length, chunk404s: missing.length }));
  await context.close();
} finally { await browser.close();await new Promise(r => server.close(r)); }
