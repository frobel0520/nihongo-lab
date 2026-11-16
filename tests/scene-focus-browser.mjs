// Real build, native 1x audio and isolated synthetic progress; no real user profile.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright-core';
import { assetPath, staticFile } from './helpers/static-file.mjs';
import { loadLesson, loadCategory } from '../curriculum/lessons.mjs';
import { emptyProgress, recordDictation, serializeProgress } from '../lib/progress.mjs';
import { sceneRecordId } from '../lib/scene-listening.mjs';
import { AUDIO_CACHE_NAME } from '../lib/offline.mjs';

const arg = (name, fallback = '') => process.argv.includes(name)
  ? process.argv[process.argv.indexOf(name) + 1] : fallback;
const root = resolve(arg('--dist', 'dist'));
const out = arg('--out'), shots = arg('--screenshots');
const before = process.argv.includes('--before');
const retryOnly = process.argv.includes('--retry-only');
if (shots) await mkdir(shots, { recursive: true });
const server = createServer(async (req, res) => {
  try {
    const file = staticFile(root, assetPath(req.url));
    res.setHeader('Content-Type', ({ '.js': 'text/javascript', '.html': 'text/html',
      '.css': 'text/css', '.mp3': 'audio/mpeg', '.webmanifest': 'application/manifest+json',
      '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml',
    })[extname(file)] ?? 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.end(await readFile(file));
  } catch { res.writeHead(404).end(); }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}/nihongo-lab/`;
const executablePath = process.env.CHROME_PATH || ['chromium', 'google-chrome'].map((name) => {
  try { return execFileSync(process.platform === 'win32' ? 'where' : 'which', [name],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim().split(/\r?\n/)[0];
  } catch { return ''; }
}).find(Boolean);
const browser = await chromium.launch({ executablePath, headless: true, args: ['--no-sandbox'] });
const key = 'nihongo-lab:progress:v1';
const retained = recordDictation(emptyProgress(), 'synthetic-retained-record', false, '2026-11-01T00:00:00.000Z');
const result = { before, retryOnly, contexts: [], focus: [], scope: [], pageerrors: [], passed: false };

async function create(width, height, scale = 1) {
  const context = await browser.newContext({ viewport: { width, height }, hasTouch: true });
  // External maintenance is outside this isolated loopback regression, not disabled in the product.
  await context.route('https://**', (route) => route.abort());
  await context.addInitScript(({ key, initial, scale }) => {
    if (!localStorage.getItem(key)) localStorage.setItem(key, initial);
    if (scale !== 1) document.addEventListener('DOMContentLoaded', () => {
      document.documentElement.style.fontSize = `${scale * 100}%`;
    });
  }, { key, initial: serializeProgress(retained), scale });
  const page = await context.newPage();
  page.on('pageerror', (error) => result.pageerrors.push(error.message));
  result.contexts.push({ width, height, rootScale: scale });
  return { context, page };
}
const saved = (page) => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), key);
async function geometry(page) {
  return page.evaluate(() => {
    const heading = [...document.querySelectorAll('h3')].find((e) => e.textContent === '答案與解析');
    const rect = heading?.getBoundingClientRect();
    const sectionTabs = document.querySelector('.section-tabs').getBoundingClientRect();
    const header = document.querySelector('.appbar').getBoundingClientRect();
    const nav = document.querySelector('nav.tabs').getBoundingClientRect();
    return { activeTag: document.activeElement.tagName,
      activeLabel: document.activeElement.getAttribute('aria-label') || document.activeElement.textContent.trim().slice(0, 100),
      headingFocused: document.activeElement === heading, tabIndex: heading?.tabIndex,
      headingTop: rect?.top, headingBottom: rect?.bottom,
      topLimit: Math.max(header.bottom, sectionTabs.bottom),
      bottomLimit: nav.top > innerHeight / 2 ? nav.top : innerHeight,
      scrollY, overflow: document.documentElement.scrollWidth > innerWidth,
      fontPx: getComputedStyle(document.documentElement).fontSize };
  });
}
async function listen(page, lesson) {
  const order = [];
  const listener = (request) => {
    const path = new URL(request.url()).pathname;
    if (path.endsWith('.mp3') && !order.includes(path)) order.push(path);
  };
  page.on('request', listener);
  await page.getByRole('button', { name: '播放完整對話', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('.scene-status')?.textContent.includes('已完整聽過'), {}, { timeout: 180000 });
  page.off('request', listener);
  assert.equal(await page.locator('.scene-listening > audio').evaluate((audio) => audio.playbackRate), 1);
  // Offline media may not produce a new network request; readiness still requires native ended events.
  if (order.length) assert.deepEqual(order, lesson.dialogue.map((line) => '/nihongo-lab/' + line.audio));
}
async function finish(page, lesson, mode, label) {
  const prior = await saved(page);
  await listen(page, lesson);
  for (const [i, question] of lesson.scene.questions.entries()) {
    const button = page.locator('.scene-question').getByRole('button', { name: question.options[question.answer], exact: true });
    if (i !== lesson.scene.questions.length - 1) await button.click();
    else if (mode === 'keyboard') {
      // Follow the actual Tab sequence, including wraparound when needed.
      for (let n = 0; n < 40 && !(await button.evaluate((e) => e === document.activeElement)); n++)
        await page.keyboard.press('Tab');
      assert.ok(await button.evaluate((e) => e === document.activeElement));
      await page.keyboard.press('Enter');
    } else if (mode === 'touch') await button.tap();
    else await button.click();
  }
  await page.getByRole('heading', { name: '答案與解析', exact: true }).waitFor();
  const position = await geometry(page);
  result.focus.push({ label, lessonId: lesson.id, mode, ...position });
  if (before) assert.equal(position.activeTag, 'BODY');
  else if (mode === 'keyboard') {
    assert.equal(position.headingFocused, true);
    assert.equal(position.tabIndex, -1);
    assert.ok(position.headingTop >= position.topLimit, JSON.stringify(position));
    assert.ok(position.headingBottom <= position.bottomLimit, JSON.stringify(position));
  } else assert.equal(position.headingFocused, false);
  assert.equal(position.overflow, false);
  const next = await saved(page);
  for (const question of lesson.scene.questions) {
    const id = sceneRecordId(lesson, question);
    assert.equal(next.dictation[id].attempts, (prior.dictation[id]?.attempts ?? 0) + 1);
  }
  assert.deepEqual(next.dictation['synthetic-retained-record'], retained.dictation['synthetic-retained-record']);
  if (shots && (label === 'keyboard-375' || label === 'keyboard-320'))
    await page.screenshot({ path: resolve(shots, label + '.png') });
  await page.keyboard.press('Tab');
  assert.match(await page.evaluate(() => document.activeElement.getAttribute('aria-label') ?? ''), /^播放：/);
  const focus = await page.evaluate(() => document.activeElement.getAttribute('aria-label'));
  const y = await page.evaluate(() => scrollY);
  await page.evaluate((key) => window.dispatchEvent(new StorageEvent('storage', { key, newValue: localStorage.getItem(key) })), key);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-label')), focus);
  assert.equal(await page.evaluate(() => scrollY), y);
  assert.deepEqual(await saved(page), next);
}
async function notesAndEntries(page, suffix) {
  for (const [number, point] of [[39, 1], [54, 0]]) {
    const lesson = await loadLesson(`general-listening-${number}`);
    await page.goto(base + `#/lesson/${lesson.id}`);
    await page.getByRole('tab', { name: /文法/ }).click();
    const note = page.locator('.grammar-point').nth(point).locator(':scope > p').first();
    const text = await note.evaluate((el) => {
      const copy = el.cloneNode(true); copy.querySelectorAll('rt,rp').forEach((node) => node.remove()); return copy.textContent;
    });
    assert.equal(text, lesson.grammar[point].note);
    if (number === 39) assert.ok(await note.locator('rt').count() > 0);
    await note.scrollIntoViewIfNeeded();
    const hint = page.locator('.lesson-practice-scope');
    assert.equal(await hint.count(), 1);
    await hint.scrollIntoViewIfNeeded();
    assert.ok((await hint.innerText()).includes('所選類別的全部課程，不限本課'));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    if (shots && number === 54) await page.screenshot({ path: resolve(shots, `scope-${suffix}.png`) });
  }
  const catalog = await loadCategory('general');
  for (const [label, view, total] of [['單字卡', 'srs', catalog.cards.length], ['聽寫', 'dictation', catalog.sentences.length], ['跟讀', 'shadowing', catalog.sentences.length]]) {
    await page.goto(base + '#/lesson/general-listening-50');
    await page.getByRole('tab', { name: /文法/ }).click();
    await page.locator('.lesson-practice-scope').scrollIntoViewIfNeeded();
    const y = await page.evaluate(() => scrollY);
    await page.getByRole('navigation', { name: '功能' }).getByRole('link', { name: label, exact: true }).click();
    await page.locator(`a[href^="#/${view}"][href$="category=general"]`).click();
    await page.waitForFunction((total) => document.querySelector('main').innerText.includes(String(total)), total);
    assert.ok(page.url().endsWith(`category=general`));
    const body = await page.locator('main').innerText();
    assert.ok(body.includes(String(total)));
    await page.goBack(); await page.goBack();
    await page.locator('.lesson-practice-scope').waitFor();
    await page.waitForFunction((y) => Math.abs(scrollY - y) < 4, y);
    assert.equal(await page.getByRole('tab', { name: /文法/ }).getAttribute('aria-selected'), 'true');
    result.scope.push({ suffix, view, category: 'general', total, returnedY: await page.evaluate(() => scrollY), priorY: y });
  }
}
try {
  const lesson = await loadLesson('general-listening-01');
  const { context, page } = await create(375, 667);
  await page.goto(base + '#/lesson/' + lesson.id);
  await finish(page, lesson, 'keyboard', 'keyboard-375');
  if (retryOnly) {
    await page.getByRole('button', { name: '重新練習整段聽解', exact: true }).click();
    await finish(page, lesson, 'keyboard', 'keyboard-retry');
    await context.close();
  } else if (!before) {
    const y = await page.evaluate(() => scrollY);
    const previous = await saved(page);
    await page.getByRole('navigation', { name: '功能' }).getByRole('link', { name: '聽寫', exact: true }).click();
    await page.goBack();
    await page.getByRole('heading', { name: '答案與解析', exact: true }).waitFor();
    await page.waitForFunction((y) => Math.abs(scrollY - y) < 4, y);
    assert.equal((await geometry(page)).headingFocused, false);
    assert.deepEqual(await saved(page), previous);
    await page.getByRole('button', { name: '重新練習整段聽解', exact: true }).click();
    assert.equal(await page.getByRole('heading', { name: '答案與解析', exact: true }).count(), 0);
    await finish(page, lesson, 'mouse', 'mouse-retry');
    await page.getByRole('button', { name: '重新練習整段聽解', exact: true }).click();
    await finish(page, lesson, 'keyboard', 'keyboard-retry');
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload(); await page.waitForFunction(() => !!navigator.serviceWorker.controller);
    result.audioFixture = await page.evaluate(async ({ paths, cacheName }) => {
      const cache = await caches.open(cacheName); const rows = [];
      for (const path of paths) {
        const response = await fetch(path); if (!response.ok) throw Error('audio fixture fetch');
        await cache.put(path, response.clone());
        const sha = [...new Uint8Array(await crypto.subtle.digest('SHA-256', await response.arrayBuffer()))].map((n) => n.toString(16).padStart(2, '0')).join('');
        rows.push({ path: new URL(path, location.href).pathname, sha256: sha });
      }
      return rows;
    }, { paths: lesson.dialogue.map((line) => '/nihongo-lab/' + line.audio), cacheName: AUDIO_CACHE_NAME });
    for (const row of result.audioFixture)
      assert.equal(row.sha256, createHash('sha256').update(
        await readFile(resolve('public', row.path.slice('/nihongo-lab/'.length))),
      ).digest('hex'));
    await context.setOffline(true);
    assert.equal(await page.evaluate(async () => { try { await fetch('/uncached-scene-focus-probe', { cache: 'no-store' }); return false; } catch { return true; } }), true);
    await page.reload(); await page.locator('.scene-question').waitFor();
    await finish(page, lesson, 'keyboard', 'keyboard-offline');
    await notesAndEntries(page, 'offline-375');
    result.offlineMethod = 'BrowserContext.setOffline(true); uncached probe rejected; reload; SW ready/controller; six explicit audio cache fixtures';
    await context.close();
    const small = await create(320, 480, 1.5);
    await small.page.goto(base + '#/lesson/' + lesson.id);
    assert.equal(await small.page.evaluate(() => getComputedStyle(document.documentElement).fontSize), '24px');
    await finish(small.page, lesson, 'keyboard', 'keyboard-320');
    await small.page.getByRole('button', { name: '重新練習整段聽解', exact: true }).click();
    await finish(small.page, lesson, 'touch', 'touch-320');
    await notesAndEntries(small.page, 'large-320');
    await small.context.close();
    const other = await create(375, 667);
    const later = await loadLesson('general-listening-61');
    await other.page.goto(base + '#/lesson/' + later.id);
    await finish(other.page, later, 'keyboard', 'outside-batch-61');
    await other.context.close();
  } else await context.close();
  assert.deepEqual(result.pageerrors, []);
  result.passed = true;
} finally {
  if (out) await writeFile(out, JSON.stringify(result, null, 2) + '\n');
  await browser.close(); await new Promise((r) => server.close(r));
}
console.log(JSON.stringify({ passed: result.passed, focusCases: result.focus.length, scopeEntries: result.scope.length, pageerrors: result.pageerrors.length }));
