// Capture actual F10 geometry and screenshots without changing curriculum or progress.
import { collectInventoryCards } from './vocab-illustration-inventory.mjs';
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { emptyProgress, serializeProgress } from '../lib/progress.mjs';
import { schedule, toDateString } from '../lib/srs.mjs';
const arg = (name, fallback) =>
  process.argv.includes(name)
    ? process.argv[process.argv.indexOf(name) + 1]
    : fallback;
const phase = arg('--label', 'after'),
  root = resolve(arg('--dist', 'dist')),
  out = resolve(arg('--out', '.cache/srs-layout-previews')),
  measurements = arg('--measurements', `.cache/srs-layout-${phase}.json`);
if (!['before', 'after'].includes(phase))
  throw Error('label must be before or after');
const server = createServer(async (req, res) => {
  try {
    const p = new URL(req.url, 'http://localhost').pathname.replace(
      /^\/nihongo-lab\//,
      '',
    );
    const file = resolve(root, p || 'index.html');
    if (!file.startsWith(root + '/')) throw Error();
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
      }[extname(file)] || 'application/octet-stream',
    );
    res.end(await readFile(file));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/nihongo-lab/`;
const cards = await collectInventoryCards();
const game = cards
  .filter((x) => x.category === 'games')
  .sort((a, b) => b.word.length - a.word.length)[0];
const b = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    execFileSync('which', ['chromium'], { encoding: 'utf8' }).trim(),
  args: ['--no-sandbox'],
});
const results = [];
await mkdir(out, { recursive: true });
try {
  for (const [w, h, scale] of [
    [320, 568, 100],
    [320, 568, 130],
    [375, 667, 100],
    [375, 667, 130],
    [320, 480, 150],
    [667, 375, 100],
    [568, 320, 130],
  ]) {
    const ctx = await b.newContext({
      viewport: { width: w, height: h },
      isMobile: true,
      hasTouch: true,
    });
    const p = await ctx.newPage();
    const progress = emptyProgress();
    progress.srs[game.id] = schedule(
      undefined,
      'again',
      toDateString(),
      new Date().toISOString(),
    );
    await ctx.addInitScript(
      ({ s, scale }) => {
        localStorage.setItem('nihongo-lab:progress:v1', s);
        document.addEventListener(
          'DOMContentLoaded',
          () => (document.documentElement.style.fontSize = scale + '%'),
        );
      },
      { s: serializeProgress(progress), scale },
    );
    await p.goto(base + '#/srs?category=games');
    await p.locator('.flash-word').waitFor();
    await p.waitForTimeout(250);
    const measure = () =>
      p.evaluate(() => {
        const r = (s) => {
          const el = document.querySelector(s),
            b = el.getBoundingClientRect();
          return {
            x: b.x,
            y: b.y,
            width: b.width,
            height: b.height,
            scrollHeight: el.scrollHeight,
            clientHeight: el.clientHeight,
            overflow: getComputedStyle(el).overflowY,
            position: getComputedStyle(el).position,
          };
        };
        const a = r('.flashcard-area'),
          card = r('.flashcard'),
          top = document
            .querySelector('.appbar')
            .getBoundingClientRect().bottom,
          nav = document.querySelector('.tabs').getBoundingClientRect();
        const bottom = nav.y > top ? Math.min(innerHeight, nav.y) : innerHeight;
        const clipped = document.querySelector('.flashcard-area');
        const constrained = ['auto', 'scroll', 'hidden'].includes(
          getComputedStyle(clipped).overflowY,
        );
        const clipTop = constrained ? Math.max(top, a.y) : top,
          naturalBottom = constrained
            ? Math.min(bottom, a.y + a.height)
            : bottom;
        const controls = r('.actions'),
          clipBottom =
            ['sticky', 'fixed'].includes(controls.position) && controls.y > top
              ? Math.min(naturalBottom, controls.y)
              : naturalBottom;
        return {
          area: a,
          card,
          word: r('.flash-word'),
          actions: r('.actions'),
          visibleCardHeight: Math.max(
            0,
            Math.min(card.y + card.height, clipBottom) -
              Math.max(card.y, clipTop),
          ),
          pageHeight: document.documentElement.scrollHeight,
          scrollY,
          overflowX: document.documentElement.scrollWidth > innerWidth,
          font: getComputedStyle(document.querySelector('.flash-word'))
            .fontSize,
        };
      });
    const before = await measure();
    await p.screenshot({
      path: `${out}/t164-${phase}-${w}x${h}-${scale}-front.png`,
    });
    let revealPointerBlocked = false;
    try {
      await p
        .getByRole('button', { name: '顯示答案', exact: true })
        .click({ timeout: 1500 });
    } catch {
      revealPointerBlocked = true;
      await p.getByRole('button', { name: '顯示答案', exact: true }).focus();
      await p.keyboard.press('Enter');
    }
    await p.waitForTimeout(200);
    await p.evaluate(() => window.scrollTo(0, 0));
    const after = await measure();
    if (phase === 'before')
      await p.screenshot({
        path: `${out}/t164-${phase}-${w}x${h}-${scale}-answer.png`,
      });
    await p
      .locator('.flashcard')
      .evaluate((el) => el.scrollIntoView({ block: 'start' }));
    const readingWindow = await measure();
    await p.screenshot({
      path: `${out}/t164-${phase}-${w}x${h}-${scale}-${phase === 'before' ? 'reading' : 'answer'}.png`,
    });
    if (phase === 'after') {
      await p
        .locator('.actions')
        .evaluate((el) => el.scrollIntoView({ block: 'center' }));
      await p.screenshot({
        path: `${out}/t164-${phase}-${w}x${h}-${scale}-grading.png`,
      });
    }
    results.push({
      id: game.id,
      category: game.category,
      word: game.word,
      viewport: { width: w, height: h },
      rootFontPercent: scale,
      revealPointerBlocked,
      before,
      after,
      readingWindow,
    });
    console.log(
      phase,
      w,
      h,
      scale,
      'area',
      after.area.clientHeight,
      'content',
      after.area.scrollHeight,
      'visible',
      after.visibleCardHeight,
    );
    await ctx.close();
  }
  await writeFile(measurements, JSON.stringify(results, null, 2));
} finally {
  await b.close();
  server.close();
}
