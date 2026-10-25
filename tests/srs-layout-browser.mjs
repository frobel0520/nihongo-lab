// Production-build F10 regression: real page scrolling, native audio and synthetic progress.
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
const arg = (n, d) =>
  process.argv.includes(n) ? process.argv[process.argv.indexOf(n) + 1] : d;
const root = resolve(arg('--dist', 'dist')),
  out = arg('--out', '');
const cards = await collectInventoryCards();
const samples = [
  cards.find((c) => c.id === 'stage0-day14:地図'),
  cards.find((c) => c.id === 'stage0-day25:ふろ'),
  cards.find((c) => c.id === 'anime-lesson-03:腹'),
  cards.find((c) => c.id === 'general-listening-87:聞き取りにくい'),
  cards
    .filter((c) => c.category === 'games')
    .sort((a, b) => b.word.length - a.word.length)[0],
];
assert.ok(samples.every(Boolean));
let slowImage = '',
  missingImage = '',
  delayDownloads = false;
const server = createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://localhost'),
      path = decodeURIComponent(u.pathname).replace(/^\/nihongo-lab\//, '');
    const file = resolve(root, path || 'index.html');
    assert.ok(file.startsWith(root + '/'));
    if (missingImage && path === missingImage) {
      res.writeHead(404).end();
      return;
    }
    if (slowImage && path === slowImage)
      await new Promise((r) => setTimeout(r, 700));
    if (delayDownloads && u.searchParams.has('offline-download'))
      await new Promise((r) => setTimeout(r, 20));
    res.setHeader(
      'content-type',
      {
        '.js': 'text/javascript',
        '.html': 'text/html',
        '.css': 'text/css',
        '.svg': 'image/svg+xml',
        '.mp3': 'audio/mpeg',
        '.webmanifest': 'application/manifest+json',
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
const base = `http://127.0.0.1:${server.address().port}/nihongo-lab/`;
const executablePath =
  process.env.CHROME_PATH ||
  ['chromium', 'google-chrome']
    .map((n) => {
      try {
        return execFileSync('which', [n], { encoding: 'utf8' }).trim();
      } catch {
        return '';
      }
    })
    .find(Boolean);
const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
});
const key = 'nihongo-lab:progress:v1',
  errors = [],
  measurements = [],
  flows = [];
const ctx = await browser.newContext({
  viewport: { width: 320, height: 568 },
  isMobile: true,
  hasTouch: true,
  reducedMotion: 'reduce',
});
await ctx.addInitScript(() =>
  document.addEventListener(
    'DOMContentLoaded',
    () =>
      (document.documentElement.style.fontSize =
        (localStorage.getItem('t164-font-percent') || '100') + '%'),
  ),
);
const page = await ctx.newPage();
page.on('pageerror', (e) => errors.push(e.message));
const saved = () =>
  page.evaluate((k) => JSON.parse(localStorage.getItem(k)), key);
const seed = (deck, mode = 'review') => {
  const p = emptyProgress(),
    today = toDateString();
  for (const c of cards) {
    if (deck.some((x) => x.id === c.id)) {
      if (mode === 'review')
        p.srs[c.id] = schedule(
          undefined,
          'again',
          today,
          new Date().toISOString(),
        );
    } else
      p.srs[c.id] = {
        ...schedule(undefined, 'good', today, new Date().toISOString()),
        due: '2099-01-01',
      };
  }
  return serializeProgress(p);
};
async function open(card, mode = 'review', pair = false) {
  const same = cards.filter((c) => c.category === card.category),
    i = same.findIndex((c) => c.id === card.id),
    next = same[i + 1] ?? same[i - 1];
  await page.evaluate(
    ([k, v]) => localStorage.setItem(k, v),
    [key, seed(pair ? [card, next] : [card], mode)],
  );
  await page.goto(
    base + `#/srs${mode === 'new' ? '/new' : ''}?category=${card.category}`,
  );
  await page.reload();
  await page.waitForFunction(
    (w) => document.querySelector('.flash-word')?.textContent === w,
    card.word,
  );
  return next;
}
async function scrollReachable(selector) {
  await page.locator(selector).scrollIntoViewIfNeeded();
  const result = await page.locator(selector).evaluate((el) => {
    let ancestor = el.parentElement;
    while (ancestor && ancestor !== document.body) {
      const s = getComputedStyle(ancestor);
      if (
        ['auto', 'scroll', 'hidden'].includes(s.overflowY) &&
        ancestor.scrollHeight > ancestor.clientHeight + 1
      )
        return { clipped: true };
      ancestor = ancestor.parentElement;
    }
    const header = document.querySelector('.appbar').getBoundingClientRect(),
      nav = document.querySelector('.tabs').getBoundingClientRect();
    const top =
        nav.y <= header.bottom + 1
          ? Math.max(header.bottom, nav.bottom)
          : header.bottom,
      bottom =
        nav.y > header.bottom ? Math.min(innerHeight, nav.y) : innerHeight;
    const rect = el.getBoundingClientRect();
    return {
      clipped: false,
      height: rect.height,
      top,
      bottom,
      y: rect.y,
      end: rect.bottom,
    };
  });
  assert.equal(
    result.clipped,
    false,
    'no competing inner vertical scroll/crop: ' + selector,
  );
  // Tall text is read in the page flow; both ends must be reachable above the fixed navigation.
  for (const edge of ['start', 'end']) {
    await page.locator(selector).evaluate((el, edge) => {
      const b = el.getBoundingClientRect(),
        header = document.querySelector('.appbar').getBoundingClientRect(),
        nav = document.querySelector('.tabs').getBoundingClientRect();
      const top =
          nav.y <= header.bottom + 1
            ? Math.max(header.bottom, nav.bottom)
            : header.bottom,
        bottom =
          nav.y > header.bottom ? Math.min(innerHeight, nav.y) : innerHeight;
      window.scrollBy(
        0,
        edge === 'start' ? b.top - top - 8 : b.bottom - bottom + 8,
      );
    }, edge);
    const visible = await page.locator(selector).evaluate((el, edge) => {
      const b = el.getBoundingClientRect(),
        h = document.querySelector('.appbar').getBoundingClientRect(),
        n = document.querySelector('.tabs').getBoundingClientRect();
      const top = n.y <= h.bottom + 1 ? Math.max(h.bottom, n.bottom) : h.bottom,
        bottom = n.y > h.bottom ? Math.min(innerHeight, n.y) : innerHeight;
      const y = edge === 'start' ? b.top + 2 : b.bottom - 2;
      return y >= top - 1 && y <= bottom + 1;
    }, edge);
    assert.ok(visible, selector + ' ' + edge + ' readable');
  }
}
async function buttonsReachable() {
  for (const name of ['還不會', '記得']) {
    const el = page.getByRole('button', {
      name: new RegExp('^' + name + '，'),
    });
    await el.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    assert.ok(
      await el.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return (
          document
            .elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)
            ?.closest('button') === el
        );
      }),
      'grade must be unoccluded and hit-testable',
    );
  }
}
async function reveal(card) {
  assert.equal(await page.locator('.vocab-illustration').count(), 0);
  await page.getByRole('button', { name: '顯示答案', exact: true }).click();
  assert.equal(await page.locator('.flash-reading').innerText(), card.reading);
  for (const sel of [
    '.flash-word',
    '.flash-reading',
    '.flash-zh',
    '.flash-back .chip',
  ])
    await scrollReachable(sel);
  await buttonsReachable();
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    'no horizontal overflow',
  );
}
async function play() {
  await page.getByRole('button', { name: '播放', exact: true }).click();
  await page.waitForFunction(() => {
    const a = document.querySelector('.flashcard audio');
    return a && !a.paused && a.currentTime > 0 && a.readyState >= 2;
  });
  assert.equal(
    await page.locator('.flashcard audio').evaluate((a) => a.playbackRate),
    1,
  );
}
async function touch(dx, dy) {
  await page
    .locator('.flash-word')
    .evaluate((el) => el.scrollIntoView({ block: 'start' }));
  const box = await page.locator('.flashcard').boundingBox();
  const y = Math.max(
    140,
    Math.min(page.viewportSize().height - 130, box.y + 80),
  );
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: 160, y }],
  });
  for (let i = 1; i <= 5; i++)
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: 160 + (dx * i) / 5, y: y + (dy * i) / 5 }],
    });
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  });
  await cdp.detach();
}
try {
  await page.goto(base);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.waitForFunction(() => navigator.serviceWorker.controller);
  // Every sample at narrow/short/landscape widths and enlarged root text. This is not browser zoom or OS font scaling.
  for (const [width, height, percent] of [
    [320, 568, 100],
    [320, 568, 130],
    [375, 667, 100],
    [375, 667, 130],
    [320, 480, 150],
    [667, 375, 100],
    [568, 320, 130],
    [375, 667, 200],
  ]) {
    await page.setViewportSize({ width, height });
    await page.evaluate(
      (percent) => localStorage.setItem('t164-font-percent', String(percent)),
      percent,
    );
    for (const card of samples) {
      console.log('Readability', width, height, percent, card.id);
      await open(card);
      assert.ok(
        Math.abs(
          (await page.evaluate(() =>
            parseFloat(getComputedStyle(document.documentElement).fontSize),
          )) -
            (16 * percent) / 100,
        ) < 0.05,
        'actual enlarged root font',
      );
      await reveal(card);
      assert.ok(
        await page.evaluate(
          () => document.scrollingElement.scrollHeight >= innerHeight,
        ),
      );
      measurements.push({
        id: card.id,
        width,
        height,
        rootFontPercent: percent,
        allTextReachable: true,
        gradesHitTestable: true,
        overflow: false,
      });
    }
  }
  // Slow and missing images: reveal/grading never waits on an illustration. Separate context avoids downloaded data.
  {
    const other = await browser.newContext({
        viewport: { width: 320, height: 568 },
        serviceWorkers: 'block',
      }),
      p = await other.newPage();
    p.on('pageerror', (e) => errors.push(e.message));
    const card = samples[0];
    for (const missing of [false, true]) {
      slowImage = missing ? '' : illustrationFor(card).src;
      missingImage = missing ? illustrationFor(card).src : '';
      await p.addInitScript(
        ([k, v]) => localStorage.setItem(k, v),
        [key, seed([card])],
      );
      await p.goto(base + '#/srs?category=n5');
      await p.reload();
      await p.getByRole('button', { name: '顯示答案', exact: true }).click();
      if (missing)
        await p.waitForFunction(
          () => !document.querySelector('.vocab-illustration'),
        );
      else
        await p.waitForFunction(
          () => document.querySelector('.vocab-illustration')?.naturalWidth > 0,
        );
      await p.getByRole('button', { name: /^記得，/ }).click();
      assert.ok(await p.getByText('完成！', { exact: true }).count());
    }
    slowImage = '';
    missingImage = '';
    await other.close();
  }
  // Real settings download continues across the route transition into SRS.
  await page.setViewportSize({ width: 375, height: 667 });
  await page.evaluate(() => localStorage.setItem('t164-font-percent', '100'));
  console.log('Slow/missing image PASS; start route download');
  await page.evaluate(
    ([k, v]) => localStorage.setItem(k, v),
    [key, seed([samples[0]])],
  );
  await page.goto(base + '#/settings');
  await page.reload();
  delayDownloads = true;
  await page
    .getByRole('button', { name: '下載全部單字圖片', exact: true })
    .click();
  await page.evaluate(async () => {
    for (let n = 0; n < 3000; n++) {
      if ((await (await caches.open('vocab-images-v1')).keys()).length) return;
      await new Promise((r) => setTimeout(r, 20));
    }
    throw Error('download did not save its first image');
  });
  const countBefore = await page.evaluate(
    async () => (await (await caches.open('vocab-images-v1')).keys()).length,
  );
  await page.goto(base + '#/srs?category=n5');
  await page.waitForSelector('.srs-screen');
  await page.evaluate(async (n) => {
    for (let tries = 0; tries < 3000; tries++) {
      if ((await (await caches.open('vocab-images-v1')).keys()).length > n)
        return;
      await new Promise((r) => setTimeout(r, 20));
    }
    throw Error('download did not continue across route');
  }, countBefore);
  await page.goto(base + '#/settings');
  await page
    .getByRole('button', { name: '單字圖片已全部存好', exact: true })
    .waitFor({ timeout: 180000 });
  delayDownloads = false;
  // Explicit sample audio download, same existing cache contract. No replacement files.
  await page.evaluate(async (samples) => {
    const c = await caches.open('lesson-audio-v5');
    for (const x of samples) {
      const u = new URL(x.audio, location.href).href;
      const r = await fetch(u + '?offline-download=1');
      if (r.status !== 200) throw Error('audio');
      await c.put(u, r);
    }
  }, samples);
  console.log(
    'Settings download continued across route PASS; start full flows',
  );
  for (const offline of [false, true]) {
    await ctx.setOffline(offline);
    if (offline) {
      await page.reload({ waitUntil: 'load' });
      assert.equal(await page.evaluate(() => navigator.onLine), false);
      const probe = base + '__unavailable_probe__?' + Date.now(),
        failed = page.waitForEvent('requestfailed', {
          predicate: (r) => r.url() === probe,
        });
      assert.ok(
        await page.evaluate(async (u) => {
          try {
            await fetch(u, { cache: 'no-store' });
            return false;
          } catch {
            return true;
          }
        }, probe),
      );
      assert.equal(
        (await failed).failure()?.errorText,
        'net::ERR_INTERNET_DISCONNECTED',
      );
    }
    for (const mode of ['new', 'review'])
      for (const card of samples) {
        console.log('Full flow', offline, mode, card.id);
        await open(card, mode);
        await reveal(card);
        await play();
        await page.getByRole('button', { name: /^記得，/ }).click();
        const graded = (await saved()).srs[card.id];
        await page
          .getByRole('button', { name: '回到最後一張', exact: true })
          .click();
        await page.getByRole('button', { name: /^還不會，/ }).click();
        assert.equal(
          (await saved()).srs[card.id].reps,
          graded.reps,
          'regrade retains original FSRS base',
        );
        await page.waitForSelector('.flash-word');
        assert.equal(
          await page.locator('.vocab-illustration').count(),
          0,
          'relearn is covered',
        );
        await page
          .getByRole('button', { name: '顯示答案', exact: true })
          .focus();
        await page.keyboard.press('Enter');
        assert.equal(
          await page.evaluate(() =>
            document.activeElement?.matches('fieldset.grades'),
          ),
          true,
        );
        await buttonsReachable();
        await page.keyboard.press('2');
        const progress = await saved();
        await page.reload({ waitUntil: 'load' });
        assert.deepEqual(await saved(), progress);
        flows.push({
          id: card.id,
          mode,
          offline,
          play: true,
          regrade: true,
          relearn: true,
          persist: true,
        });
      }
  }
  await ctx.setOffline(false);
  // Directional touch: vertical movement reads without grading; horizontal moves cards and resets scroll to their start.
  const long = samples.at(-1),
    next = await open(long, 'review', true),
    untouched = await saved();
  await page.getByRole('button', { name: '顯示答案', exact: true }).click();
  await touch(0, -100);
  assert.equal(await page.locator('.flash-word').innerText(), long.word);
  assert.deepEqual(await saved(), untouched);
  await touch(-90, 0);
  await page.waitForFunction(
    (w) => document.querySelector('.flash-word')?.textContent === w,
    next.word,
  );
  assert.deepEqual(await saved(), untouched);
  assert.ok(
    await page.locator('.flash-word').evaluate((el) => {
      const r = el.getBoundingClientRect();
      return (
        r.top >=
          document.querySelector('.appbar').getBoundingClientRect().bottom -
            1 && r.top < innerHeight
      );
    }),
    'next card begins visibly',
  );
  assert.deepEqual(errors, []);
  const result = {
    measurements,
    flows,
    downloadContinuedAcrossRoute: true,
    slowImage: true,
    missingImage: true,
    keyboardFocus: true,
    verticalReadWithoutGrade: true,
    horizontalNavigation: true,
    trueOffline: true,
    probe: 'ERR_INTERNET_DISCONNECTED',
    pageerrors: errors,
    scope:
      'Desktop Chromium touch/viewport and root-font emulation; not real device, browser zoom, OS font or physical screen reader.',
  };
  if (out) await writeFile(out, JSON.stringify(result, null, 2));
  console.log(
    'PASS SRS layout:',
    measurements.length,
    'readability cases,',
    flows.length,
    'full flows; download/keyboard/touch/offline/fallback',
  );
} finally {
  await browser.close();
  server.close();
}
