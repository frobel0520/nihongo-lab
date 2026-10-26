// T165: task-based UX regressions on a production build; isolated synthetic data.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright-core';
import { loadCategory, loadGameData } from '../curriculum/lessons.mjs';
import {
  emptyProgress,
  recordDictation,
  serializeProgress,
} from '../lib/progress.mjs';
import { gameLines } from '../lib/game-study.mjs';
import { schedule } from '../lib/srs.mjs';
const arg = (key, fallback = '') =>
  process.argv.includes(key)
    ? process.argv[process.argv.indexOf(key) + 1]
    : fallback;
const area = arg('--area', 'all');
const root = resolve(arg('--dist', 'dist')),
  out = arg('--out'),
  shots = arg('--screenshots'),
  before = process.argv.includes('--record-before');
if (shots) await mkdir(shots, { recursive: true });
const n5 = await loadCategory('n5'),
  { gameCharacterStudy } = await loadGameData();
const smallAudio = gameLines(gameCharacterStudy, 'genshin', 'collei').map(
  (x) => x.line.audio,
);
assert.equal(smallAudio.length, 3);
let delay = 0,
  failAudio = '',
  missingPlayback = '',
  downloads = 0;
const server = createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://localhost'),
      path = decodeURIComponent(u.pathname).replace(/^\/nihongo-lab\//, '');
    const file = resolve(root, path || 'index.html');
    assert.ok(file.startsWith(root + '/'));
    if (missingPlayback && path === missingPlayback) {
      res.writeHead(404).end();
      return;
    }
    if (u.searchParams.has('offline-download')) {
      downloads++;
      if (delay) await new Promise((r) => setTimeout(r, delay));
      if (path === failAudio) {
        res.writeHead(503).end('synthetic temporary audio failure');
        return;
      }
    }
    res.setHeader(
      'content-type',
      {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.svg': 'image/svg+xml',
        '.mp3': 'audio/mpeg',
        '.webmanifest': 'application/manifest+json',
        '.json': 'application/json',
        '.png': 'image/png',
        '.ico': 'image/x-icon',
      }[extname(file)] || 'application/octet-stream',
    );
    res.setHeader('cache-control', 'no-cache');
    res.end(await readFile(file));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/nihongo-lab/`,
  key = 'nihongo-lab:progress:v1';
const executablePath =
  process.env.CHROME_PATH ||
  execFileSync('which', ['chromium'], { encoding: 'utf8' }).trim();
const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
});
const result = {
  recordingBefore: before,
  geometry: [],
  contextReturn: {},
  audioJob: {},
  offlineError: {},
  started: {},
  pageerrors: [],
  scope:
    'Isolated desktop Chromium viewport/root font; third-party HTTPS scripts blocked in local fixture. No OS keyboard, native zoom, real device, physical screen reader, or authenticated sync acceptance.',
};
async function context(width = 375, height = 667, font = 100) {
  const c = await browser.newContext({
    viewport: { width, height },
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce',
  });
  await c.route('https://**', (r) => r.abort());
  await c.addInitScript(
    (font) =>
      document.addEventListener(
        'DOMContentLoaded',
        () => (document.documentElement.style.fontSize = font + '%'),
      ),
    font,
  );
  return c;
}
function errors(p) {
  p.on('pageerror', (e) => result.pageerrors.push(e.message));
}
const settled = (p) =>
  p.evaluate(
    () =>
      new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
  );
async function screenshot(p, name) {
  if (shots)
    await p.screenshot({
      path: resolve(shots, name + '.png'),
      fullPage: false,
    });
}
async function goto(p, hash) {
  await p.goto(base + hash);
  await p.locator('main').waitFor();
}
const tab = (p, name) =>
  p.locator('nav.tabs').getByRole('link', { name, exact: true });
async function visible(p, el) {
  await el.evaluate((e) =>
    e.scrollIntoView({ block: 'center', behavior: 'instant' }),
  );
  await settled(p);
  const box = await el.evaluate((e) => {
    const r = e.getBoundingClientRect(),
      header = document.querySelector('.appbar').getBoundingClientRect(),
      nav = document.querySelector('.tabs').getBoundingClientRect();
    const top =
      nav.top <= header.bottom + 1
        ? Math.max(header.bottom, nav.bottom)
        : header.bottom;
    const bottom = nav.top > header.bottom + 1 ? nav.top : innerHeight;
    const y = Math.min(Math.max((r.top + r.bottom) / 2, top + 2), bottom - 2),
      x = (r.left + r.right) / 2;
    return {
      height: r.height,
      width: r.width,
      top: r.top,
      hit: e.contains(document.elementFromPoint(x, y)),
      vertical: r.bottom > top && r.top < bottom,
    };
  });
  assert.ok(
    box.height > 0 && box.width > 0 && box.hit && box.vertical,
    JSON.stringify(box),
  );
}
async function warm(p) {
  await p.evaluate(() => navigator.serviceWorker.ready);
  await p.waitForFunction(() => !!navigator.serviceWorker.controller);
}
async function offline(c, p) {
  await c.setOffline(true);
  await p.reload({ waitUntil: 'load' });
  const url = base + 'uncached-ux-probe?' + Date.now();
  const failed = p.waitForEvent('requestfailed', {
    predicate: (r) => r.url() === url,
  });
  assert.equal(
    await p.evaluate(async (url) => {
      try {
        await fetch(url, { cache: 'no-store' });
        return false;
      } catch {
        return true;
      }
    }, url),
    true,
  );
  assert.equal(
    (await failed).failure().errorText,
    'net::ERR_INTERNET_DISCONNECTED',
  );
}
const count = (p) =>
  p.evaluate(
    async () => (await (await caches.open('lesson-audio-v5')).keys()).length,
  );
try {
  // U1: both modes, actual reading/clicking, long game choices and keyboard-height reflow.
  if (area === 'all' || area === 'layout')
    for (const [width, height, font] of [
      [320, 480, 150],
      [375, 667, 100],
      [667, 375, 100],
      [375, 667, 200],
    ]) {
      const c = await context(width, height, font),
        p = await c.newPage();
      errors(p);
      await goto(p, '#/dictation?category=n5');
      await p.locator('.dictation-workspace').waitFor({ state: 'attached' });
      for (const mode of ['choice', 'type']) {
        await p
          .getByRole('radio', {
            name: mode === 'choice' ? '選擇題' : '輸入',
            exact: true,
          })
          .press('Space');
        await settled(p);
        const geometry = await p
          .locator('.dictation-workspace')
          .evaluate((e) => ({
            height: e.clientHeight,
            content: e.scrollHeight,
            top: e.getBoundingClientRect().top,
            overflow: getComputedStyle(e).overflowY,
          }));
        result.geometry.push({
          viewport: { width, height },
          font,
          mode,
          ...geometry,
        });
        if (!before) {
          assert.ok(geometry.height > 0);
          assert.ok(
            geometry.content <= geometry.height + 1,
            'answer content has no clipped inner scrolling viewport',
          );
          assert.ok(
            await p.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth + 1,
            ),
          );
          await visible(
            p,
            p.getByRole('button', { name: '播放這句', exact: true }),
          );
          await p
            .getByRole('button', { name: '播放這句', exact: true })
            .click();
          await p.waitForFunction(() =>
            [...document.querySelectorAll('audio')].some(
              (a) => !a.paused && a.currentTime > 0 && a.playbackRate === 1,
            ),
          );
          if (mode === 'choice') {
            for (const el of await p.locator('.choice').all())
              await visible(p, el);
            await visible(p, p.locator('.choice').first());
            await screenshot(
              p,
              `t165-after-question-${width}x${height}-${font}`,
            );
            await p.locator('.choice').first().click();
            await visible(p, p.locator('.feedback p').first());
          } else {
            await p.locator('#dictation-input').fill('zz');
            if (width === 320) {
              await p.setViewportSize({ width, height: 320 });
              await visible(p, p.locator('#dictation-input'));
              await p.setViewportSize({ width, height });
            }
            await p.getByRole('button', { name: '檢查', exact: true }).click();
            await visible(p, p.locator('.feedback p').last());
          }
          await visible(
            p,
            p.getByRole('button', { name: '下一句', exact: true }),
          );
          const saved = await p.evaluate(
            (key) => localStorage.getItem(key),
            key,
          );
          await screenshot(
            p,
            `t165-after-dictation-${width}x${height}-${font}-${mode}`,
          );
          await p.getByRole('button', { name: '下一句', exact: true }).click();
          await p
            .locator('.stepper strong')
            .filter({ hasText: '第 2 /' })
            .waitFor();
          assert.equal(
            await p.evaluate((key) => localStorage.getItem(key), key),
            saved,
          );
          await p.getByRole('button', { name: '上一句', exact: true }).click();
        } else
          await screenshot(
            p,
            `t165-before-dictation-${width}x${height}-${font}-${mode}`,
          );
      }
      if (!before && width === 320) {
        await goto(p, '#/dictation?category=games');
        await p
          .getByRole('radio', { name: '選擇題', exact: true })
          .press('Space');
        await p.locator('.choice').first().waitFor();
        for (const el of await p.locator('.choice').all()) await visible(p, el);
        await p.keyboard.press('Tab');
        await p.keyboard.press('1');
        await p.locator('.feedback').waitFor();
        await p.keyboard.press('Enter');
        await p
          .locator('.stepper strong')
          .filter({ hasText: '第 2 /' })
          .waitFor();
      }
      await c.close();
      console.log(
        'U1',
        width,
        height,
        font,
        before ? 'recorded' : 'read/play/answer/next PASS',
      );
    }
  // U3: exact report journey, followed by question/draft/result and history forward tests.
  if (area === 'all' || area === 'context') {
    const c = await context(),
      p = await c.newPage();
    errors(p);
    await goto(p, '#/courses/stage-1');
    const group = p
      .locator('.stage > details.card')
      .filter({ has: p.locator('summary').filter({ hasText: '121～130' }) });
    await group.locator('summary').click();
    const link = group.locator('a[href="#/lesson/general-listening-121"]');
    await link.scrollIntoViewIfNeeded();
    await settled(p);
    const previousY = await p.evaluate(() => scrollY);
    await p.evaluate(() => {
      window.__uxTrace = [];
      window.addEventListener('scroll', () =>
        window.__uxTrace.push({
          kind: 'scroll',
          hash: location.hash,
          y: scrollY,
        }),
      );
      window.addEventListener('hashchange', () =>
        window.__uxTrace.push({
          kind: 'hash',
          hash: location.hash,
          y: scrollY,
        }),
      );
      document.addEventListener(
        'click',
        (e) => {
          if (e.target.closest?.('a[href="#/lesson/general-listening-121"]'))
            window.__uxDeparture = scrollY;
        },
        true,
      );
    });
    await screenshot(p, `t165-${before ? 'before' : 'after'}-course-location`);
    await link.click();
    await p.getByRole('tab', { name: /^文法/ }).click();
    await tab(p, '聽寫').click();
    await p.locator('.appbar-title').filter({ hasText: '聽寫' }).waitFor();
    await p.goBack();
    await p.locator('[role="tab"][aria-selected="true"]').waitFor();
    const section = await p
      .locator('[role="tab"][aria-selected="true"]')
      .innerText();
    await p.getByRole('link', { name: '返回課程清單', exact: true }).click();
    await group.locator('summary').waitFor();
    await settled(p);
    const returned = {
      groupOpen: (await group.getAttribute('open')) !== null,
      previousY,
      scrollY: await p.evaluate(() => scrollY),
      section,
      departureY: await p.evaluate(() => window.__uxDeparture),
      trace: await p.evaluate(() => window.__uxTrace),
    };
    console.log('RETURN DIAGNOSTIC', JSON.stringify(returned));
    result.contextReturn = { ...returned };
    await screenshot(p, `t165-${before ? 'before' : 'after'}-course-return`);
    if (!before) {
      assert.match(section, /文法/);
      assert.ok(returned.groupOpen);
      assert.ok(
        Math.abs(returned.scrollY - returned.departureY) < 4,
        JSON.stringify(returned),
      );
    }
    await goto(p, '#/dictation?category=n5');
    await p.locator('.stepper strong').waitFor();
    for (let i = 0; i < 3; i++)
      await p.getByRole('button', { name: '跳過這句', exact: true }).click();
    await p.getByRole('radio', { name: '輸入', exact: true }).press('Space');
    await p.locator('#dictation-input').fill('draft');
    await tab(p, '跟讀').click();
    await p.locator('.appbar-title').filter({ hasText: '跟讀' }).waitFor();
    await p.goBack();
    await p.locator('.stepper strong').waitFor();
    const question = await p.locator('.stepper strong').innerText(),
      draft = await p.locator('#dictation-input').inputValue();
    Object.assign(result.contextReturn, { question, draft });
    if (!before) {
      assert.match(question, /第 4 /);
      assert.equal(draft, 'draft');
      await p.getByRole('button', { name: '檢查', exact: true }).click();
      await p
        .locator('.stepper strong')
        .evaluate((e) =>
          e.scrollIntoView({ block: 'start', behavior: 'instant' }),
        );
      await settled(p);
      const answeredY = await p.evaluate(() => scrollY);
      const progress = await p.evaluate(
        (key) => localStorage.getItem(key),
        key,
      );
      await tab(p, '跟讀').click();
      await p.locator('.appbar-title').filter({ hasText: '跟讀' }).waitFor();
      await p.goBack();
      await p.locator('.feedback').waitFor();
      await settled(p);
      assert.ok(
        Math.abs((await p.evaluate(() => scrollY)) - answeredY) < 4,
        'returning to answered question preserves reading, not auto-scroll feedback again',
      );
      result.contextReturn.answeredReadingRestored = true;
      assert.equal(
        await p.evaluate((key) => localStorage.getItem(key), key),
        progress,
      );
      await p.goForward();
      await p.locator('.appbar-title').filter({ hasText: '跟讀' }).waitFor();
      await p.goBack();
      await p.locator('.feedback').waitFor();
      assert.equal(
        await p.evaluate((key) => localStorage.getItem(key), key),
        progress,
      );
      await p.getByRole('link', { name: '更換教材類別', exact: true }).click();
      await p.getByRole('link', { name: /N5 基礎/ }).click();
      await p
        .locator('.stepper strong')
        .filter({ hasText: '第 1 /' })
        .waitFor();
      assert.equal(await p.locator('#dictation-input').inputValue(), '');
      await p.reload();
      await p
        .locator('.stepper strong')
        .filter({ hasText: '第 1 /' })
        .waitFor();
    }
    await c.close();
    console.log(
      'U3',
      before
        ? 'recorded'
        : 'group/section/scroll/question/draft/result/back/forward/new/reload PASS',
    );
  }
  // U5: reopen synthetic wrong-only records, do not write another attempt.
  if (area === 'all' || area === 'counts') {
    const c = await context(),
      p = await c.newPage();
    errors(p);
    await goto(p, '#/');
    let progress = emptyProgress();
    for (const s of n5.sentences.slice(0, 3))
      progress = recordDictation(progress, s.id, false, '2026-10-26T00:00:00Z');
    const text = serializeProgress(progress);
    await p.evaluate(
      ([key, text]) => localStorage.setItem(key, text),
      [key, text],
    );
    await p.reload();
    const track = p.locator('a[href="#/courses/stage-0"]');
    await track.waitFor();
    result.started = { label: await track.innerText(), onlyWrongAttempts: 3 };
    await screenshot(p, `t165-${before ? 'before' : 'after'}-started`);
    if (!before) assert.match(await track.innerText(), /已開始 1 課/);
    assert.equal(
      await p.evaluate((key) => localStorage.getItem(key), key),
      text,
    );
    await c.close();
  }
  // U4 and true-offline dictation: APP cached, audio deliberately absent.
  if (area === 'all' || area === 'offline') {
    const c = await context(),
      p = await c.newPage();
    errors(p);
    await goto(p, '#/');
    await warm(p);
    await offline(c, p);
    await goto(p, '#/srs/new?category=n5');
    await p.getByRole('button', { name: '顯示答案', exact: true }).waitFor();
    await p.getByRole('button', { name: '播放', exact: true }).click();
    await p.getByRole('button', { name: '顯示答案', exact: true }).click();
    const error = p.locator('.flashcard .error');
    await error.waitFor();
    const dimensions = await error.evaluate((e) => ({
      width: e.getBoundingClientRect().width,
      height: e.getBoundingClientRect().height,
      card: e.closest('.flashcard').getBoundingClientRect().width,
    }));
    result.offlineError = {
      ...dimensions,
      trueOffline: true,
      probe: 'ERR_INTERNET_DISCONNECTED',
    };
    await screenshot(p, `t165-${before ? 'before' : 'after'}-offline-error`);
    if (!before) {
      assert.ok(
        dimensions.width > dimensions.card * 0.7,
        JSON.stringify(dimensions),
      );
      await visible(p, error);
      await c.setOffline(false);
      await p.getByRole('button', { name: '播放', exact: true }).click();
      await p.waitForFunction(() =>
        [...document.querySelectorAll('audio')].some(
          (a) => a.currentTime > 0 && !a.paused,
        ),
      );
      await error.waitFor({ state: 'detached' });
      const games = await loadCategory('games');
      const long = [...games.cards].sort(
        (a, b) => b.word.length - a.word.length,
      )[0];
      const progress = emptyProgress(),
        now = new Date().toISOString();
      progress.srs[long.id] = schedule(
        undefined,
        'again',
        now.slice(0, 10),
        now,
      );
      missingPlayback = long.audio;
      await p.evaluate(
        ([key, text]) => {
          localStorage.setItem(key, text);
          history.replaceState(
            null,
            '',
            location.pathname + '#/srs?category=games',
          );
        },
        [key, serializeProgress(progress)],
      );
      await p.reload();
      await p.waitForFunction(
        (word) => document.querySelector('.flash-word')?.textContent === word,
        long.word,
      );
      await p.getByRole('button', { name: '播放', exact: true }).click();
      await p.getByRole('button', { name: '顯示答案', exact: true }).click();
      await p.locator('.flashcard .error').waitFor();
      await visible(p, p.locator('.flashcard .error'));
      const longWidth = await p.locator('.flashcard .error').evaluate((e) => ({
        error: e.getBoundingClientRect().width,
        card: e.closest('.flashcard').getBoundingClientRect().width,
      }));
      assert.ok(longWidth.error > longWidth.card * 0.7);
      await screenshot(p, 't165-after-long-online-error');
      missingPlayback = '';
      await p.getByRole('button', { name: '播放', exact: true }).click();
      await p.waitForFunction(() =>
        [...document.querySelectorAll('audio')].some(
          (a) => a.currentTime > 0 && !a.paused,
        ),
      );
      await p.locator('.flashcard .error').waitFor({ state: 'detached' });
      result.offlineError.longOnline404 = {
        id: long.id,
        ...longWidth,
        retry: true,
      };
      await p.evaluate(async (path) => {
        const r = await fetch('/nihongo-lab/' + path + '?offline-download=1');
        assertResponse(r);
        function assertResponse(r) {
          if (!r.ok) throw Error('sample audio unavailable');
        }
        await (
          await caches.open('lesson-audio-v5')
        ).put('/nihongo-lab/' + path, r);
      }, n5.sentences[0].audio);
      await goto(p, '#/dictation?category=n5');
      await p.locator('.dictation-workspace').waitFor();
      await offline(c, p);
      await p.getByRole('button', { name: '播放這句', exact: true }).click();
      await p.waitForFunction(() =>
        [...document.querySelectorAll('audio')].some(
          (a) => a.currentTime > 0 && !a.paused,
        ),
      );
      await p.getByRole('radio', { name: '輸入', exact: true }).press('Space');
      await p.locator('#dictation-input').fill('zz');
      await p.getByRole('button', { name: '檢查', exact: true }).click();
      await visible(p, p.locator('.feedback p').last());
      const saved = await p.evaluate((key) => localStorage.getItem(key), key);
      await p.reload({ waitUntil: 'load' });
      await p.locator('.dictation-workspace').waitFor();
      assert.equal(
        await p.evaluate((key) => localStorage.getItem(key), key),
        saved,
      );
      result.offlineError.dictationOfflineAnswerAndSave = true;
    }
    await c.close();
    console.log(
      'U4/offline',
      before
        ? 'recorded'
        : 'readable error/reconnect/play/dictation/retained progress PASS',
    );
  }
  // U2: real cache writes, no full-library download or dummy media.
  if (area === 'all' || area === 'downloads') {
    const c = await context(),
      p = await c.newPage();
    errors(p);
    delay = 100;
    await goto(p, '#/settings');
    const section = p
      .getByRole('heading', { name: '離線音檔', exact: true })
      .locator('..');
    await section
      .getByRole('button', { name: '下載全部課程音檔', exact: true })
      .click();
    await p.waitForFunction(
      async () =>
        (await (await caches.open('lesson-audio-v5')).keys()).length >= 4,
    );
    await tab(p, '單字卡').click();
    await tab(p, '設定').click();
    await section.waitFor();
    await p.waitForFunction(
      async () =>
        (await (await caches.open('lesson-audio-v5')).keys()).length >= 12,
    );
    await section.scrollIntoViewIfNeeded();
    const cacheAtReturn = await count(p),
      status = await section.locator('output').innerText(),
      buttonEnabled = await section
        .getByRole('button', { name: '下載全部課程音檔', exact: true })
        .isEnabled();
    await screenshot(p, `t165-${before ? 'before' : 'after'}-audio-return`);
    result.audioJob = { cacheAtReturn, status, buttonEnabled };
    if (!before) {
      assert.match(status, /音檔下載中/);
      assert.equal(buttonEnabled, false);
      const second = await c.newPage();
      errors(second);
      await goto(second, '#/settings');
      const other = second
        .getByRole('heading', { name: '離線音檔', exact: true })
        .locator('..');
      await other
        .getByRole('button', { name: '下載全部課程音檔', exact: true })
        .click();
      await other
        .locator('output')
        .filter({ hasText: '另一個分頁正在下載音檔' })
        .waitFor();
      await second.close();
      await section
        .getByRole('button', { name: '取消音檔下載', exact: true })
        .click();
      await section
        .locator('output')
        .filter({ hasText: '已取消音檔下載' })
        .waitFor();
      const afterCancel = await count(p);
      await tab(p, '單字卡').click();
      await tab(p, '設定').click();
      await section
        .locator('output')
        .filter({ hasText: '已取消音檔下載' })
        .waitFor();
      assert.equal(await count(p), afterCancel);
      result.audioJob.cancelledCache = afterCancel;
      // A separate, real three-clip character batch covers completion, partial failure and resume.
      delay = 0;
      await p.evaluate(async (paths) => {
        const c = await caches.open('lesson-audio-v5');
        for (const path of paths) await c.delete('/nihongo-lab/' + path);
      }, smallAudio);
      failAudio = smallAudio[1];
      await goto(p, '#/games/genshin/collei');
      await p.getByText('下載此角色音檔供離線使用', { exact: true }).click();
      const character = p
        .getByRole('heading', { name: '離線音檔', exact: true })
        .locator('..');
      await character
        .getByRole('button', { name: '下載此角色音檔', exact: true })
        .click();
      await character
        .locator('output')
        .filter({ hasText: /完成：新存 2 個，失敗 1 個/ })
        .waitFor();
      failAudio = '';
      const requestsBefore = downloads;
      await character
        .getByRole('button', { name: '下載此角色音檔', exact: true })
        .click();
      await character
        .locator('output')
        .filter({ hasText: '完成：新存 1 個，失敗 0 個' })
        .waitFor();
      assert.equal(downloads - requestsBefore, 1);
      await tab(p, '設定').click();
      await section
        .locator('output')
        .filter({ hasText: '完成：新存 1 個，失敗 0 個' })
        .waitFor();
      await c.setOffline(true);
      await section
        .getByRole('button', { name: '下載全部課程音檔', exact: true })
        .click();
      await section
        .locator('output')
        .filter({ hasText: '目前沒有網路' })
        .waitFor();
      await c.setOffline(false);
      delay = 100;
      const retained = await count(p);
      await section
        .getByRole('button', { name: '下載全部課程音檔', exact: true })
        .click();
      await p.waitForFunction(
        async (n) =>
          (await (await caches.open('lesson-audio-v5')).keys()).length > n,
        retained,
      );
      await c.setOffline(true);
      await section
        .locator('output')
        .filter({ hasText: '網路中斷，下載已暫停' })
        .waitFor();
      const paused = await count(p);
      await tab(p, '單字卡').click();
      await tab(p, '設定').click();
      await section
        .locator('output')
        .filter({ hasText: '網路中斷，下載已暫停' })
        .waitFor();
      await c.setOffline(false);
      await section
        .getByRole('button', { name: '下載全部課程音檔', exact: true })
        .click();
      await p.waitForFunction(
        async (n) =>
          (await (await caches.open('lesson-audio-v5')).keys()).length > n,
        paused,
      );
      await section
        .getByRole('button', { name: '取消音檔下載', exact: true })
        .click();
      await section
        .locator('output')
        .filter({ hasText: '已取消音檔下載' })
        .waitFor();
      result.audioJob.networkPauseResume = true;
      Object.assign(result.audioJob, {
        crossTabLock: true,
        partialFailure: true,
        resumeOnlyMissing: 1,
        completionSurvivesRoute: true,
        offlineStart: true,
      });
    }
    await c.close();
    delay = 0;
    console.log(
      'U2',
      before
        ? 'recorded'
        : 'same job/cancel/cross-tab/partial failure/resume/completion/offline PASS',
    );
  }
  assert.deepEqual(result.pageerrors, []);
  if (out) await writeFile(out, JSON.stringify(result, null, 2) + '\n');
  console.log(
    'PASS T165 UX regressions; desktop emulation, not real-device acceptance',
  );
} finally {
  await browser.close();
  server.close();
}
