// P2：檢查操作後的實際句首位置；量測前不代替產品捲動或安排焦點。
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright-core';
import { collectInventoryCards } from '../scripts/vocab-illustration-inventory.mjs';
import { illustrationFor } from '../lib/vocab-illustrations.mjs';
import { buildVocabImageManifestRows } from '../scripts/vocab-image-manifest.mjs';
import { emptyProgress, serializeProgress } from '../lib/progress.mjs';
import { schedule, toDateString } from '../lib/srs.mjs';
const arg = (n, fallback) =>
  process.argv.includes(n)
    ? process.argv[process.argv.indexOf(n) + 1]
    : fallback;
const root = resolve(arg('--dist', 'dist')),
  out = arg('--out', ''),
  shots = arg('--screenshots', '');
const recording = process.argv.includes('--record');
const cards = await collectInventoryCards();
const sissela = cards.find(
  (c) =>
    c.id === 'game-card:game:er:sissela:selection-voice:992579e355:992579e355',
);
const eva = cards.find(
  (c) => c.id === 'game-card:game:er:eva:selection-voice:1b4ea5830e:1b4ea5830e',
);
const short = cards.find((c) => c.category === 'games' && c.word === '飛べ。');
assert.ok(sissela && eva && short);
const manifests = new Map(
  (await buildVocabImageManifestRows(resolve(root, 'images/vocab'))).map(
    ([name, version]) => [name, version],
  ),
);
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(
      new URL(req.url, 'http://localhost').pathname,
    ).replace(/^\/nihongo-lab\//, '');
    const file = resolve(root, path || 'index.html');
    assert.ok(file.startsWith(root + '/'));
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
const base = `http://127.0.0.1:${server.address().port}/nihongo-lab/`,
  key = 'nihongo-lab:progress:v1';
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
  args: ['--no-sandbox'],
});
const context = await browser.newContext({
  viewport: { width: 320, height: 568 },
  isMobile: true,
  hasTouch: true,
  reducedMotion: 'reduce',
});
await context.addInitScript(() =>
  document.addEventListener(
    'DOMContentLoaded',
    () =>
      (document.documentElement.style.fontSize =
        (localStorage.getItem('presentation-font') || '130') + '%'),
  ),
);
const page = await context.newPage(),
  errors = [],
  observations = [];
page.on('pageerror', (e) => errors.push(e.message));
const progress = () =>
  page.evaluate((k) => JSON.parse(localStorage.getItem(k)), key);
let offline = false,
  height = 568,
  percent = 130;
async function open(deck) {
  const p = emptyProgress();
  deck.forEach(
    (c, i) =>
      (p.srs[c.id] = {
        ...schedule(
          undefined,
          'again',
          toDateString(),
          new Date().toISOString(),
        ),
        due: `2000-01-${String(i + 1).padStart(2, '0')}`,
      }),
  );
  await page.evaluate(
    ([key, value]) => localStorage.setItem(key, value),
    [key, serializeProgress(p)],
  );
  await page.goto(base + '#/srs?category=games');
  await page.reload({ waitUntil: offline ? 'load' : 'networkidle' });
  await page
    .waitForFunction(
      (word) => document.querySelector('.flash-word')?.textContent === word,
      deck[0].word,
      { timeout: 5000 },
    )
    .catch(async (error) => {
      console.log('fixture diagnostic', {
        url: page.url(),
        word: await page.locator('.flash-word').allTextContents(),
        body: (await page.locator('body').innerText()).slice(0, 350),
        stored: await progress(),
      });
      throw error;
    });
}
async function snapshot(label, card, keyboard = false, check = true) {
  await page.waitForFunction(
    (word) => document.querySelector('.flash-word')?.textContent === word,
    card.word,
  );
  // 等待下一次繪製，包含瀏覽器焦點捲動；這裡不做任何補救定位。
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  const p = await page.evaluate(() => {
    const word = document.querySelector('.flash-word'),
      r = word.getBoundingClientRect(),
      header = document.querySelector('.appbar').getBoundingClientRect(),
      nav = document.querySelector('.tabs').getBoundingClientRect(),
      active = document.activeElement;
    const bottom =
      nav.top > header.bottom ? Math.min(innerHeight, nav.top) : innerHeight;
    return {
      top: r.top,
      firstLineBottom:
        r.top +
        Math.min(r.height, parseFloat(getComputedStyle(word).lineHeight)),
      headerBottom: header.bottom,
      usableBottom: bottom,
      scrollY,
      focus:
        active === word
          ? 'word'
          : active?.matches('fieldset.grades')
            ? 'grades'
            : active?.textContent?.trim().slice(0, 35),
      focusAtWord: active === word,
      revealed: !!document.querySelector('.is-revealed'),
      image: !!document.querySelector('.vocab-illustration'),
    };
  });
  const visible =
    p.top >= p.headerBottom - 1 && p.firstLineBottom <= p.usableBottom + 1;
  observations.push({
    label,
    id: card.id,
    height,
    rootFontPercent: percent,
    offline,
    keyboard,
    visible,
    requiresVisibleStart: check,
    ...p,
  });
  console.log(
    label,
    height,
    percent,
    offline,
    'top',
    p.top,
    'header',
    p.headerBottom,
    'focus',
    p.focus,
  );
  if (out)
    await writeFile(
      out,
      JSON.stringify({ partial: true, observations }, null, 2),
    );
  if (
    shots &&
    ['same-id-pointer', 'same-id-keyboard', 'keyboard-next-long'].includes(
      label,
    )
  )
    await page.screenshot({
      path: resolve(
        shots,
        `${height}-${percent}-${offline ? 'offline' : 'online'}-${label}.png`,
      ),
    });
  if (check && !recording) {
    assert.ok(
      visible,
      `${label}: first line must remain below header and fully visible ${JSON.stringify(p)}`,
    );
    if (keyboard)
      assert.equal(
        p.focusAtWord,
        true,
        'keyboard presentation starts at readable text',
      );
  }
  return p;
}
async function reveal(keyboard = false) {
  const b = page.getByRole('button', { name: '顯示答案', exact: true });
  if (keyboard) {
    await b.focus();
    await page.keyboard.press('Enter');
  } else await b.click();
  await page.locator('.is-revealed').waitFor();
}
async function grade(value, keyboard = false) {
  if (keyboard) await page.keyboard.press(value === 'again' ? '1' : '2');
  else
    await page
      .getByRole('button', {
        name: value === 'again' ? /^還不會，/ : /^記得，/,
      })
      .click();
}
async function fresh(card) {
  await page.waitForFunction(
    (word) =>
      document.querySelector('.flash-word')?.textContent === word &&
      !document.querySelector('.is-revealed'),
    card.word,
  );
}
try {
  if (shots) await mkdir(shots, { recursive: true });
  await page.goto(base);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.waitForFunction(() => navigator.serviceWorker.controller);
  // 只準備本測試三張卡的實際圖片；不更改圖片下載契約。
  const images = [sissela, eva, short].map((c) => {
    const src = illustrationFor(c).src,
      name = src.split('/').at(-1).replace('.svg', '');
    return src + '?v=' + manifests.get(name);
  });
  await page.evaluate(async (paths) => {
    const cache = await caches.open('vocab-images-v1');
    for (const path of paths) {
      const u = new URL(path, location.href).href,
        r = await fetch(u + '&offline-download=1');
      if (!r.ok) throw Error('image');
      await cache.put(u, r);
    }
  }, images);
  await page.evaluate(
    async (cards) => {
      const cache = await caches.open('lesson-audio-v5');
      for (const card of cards) {
        const u = new URL(card.audio, location.href).href;
        const response = await fetch(u + '?offline-download=1');
        if (response.status !== 200) throw Error('audio fixture download');
        await cache.put(u, response);
      }
    },
    [sissela, eva, short],
  );
  for (const setting of [
    [568, 130],
    [480, 150],
  ]) {
    [height, percent] = setting;
    await page.setViewportSize({ width: 320, height });
    await page.evaluate(
      (p) => localStorage.setItem('presentation-font', String(p)),
      percent,
    );
    for (const disconnected of [false, true]) {
      offline = disconnected;
      await context.setOffline(offline);
      await page.reload({ waitUntil: offline ? 'load' : 'networkidle' });
      assert.ok(
        Math.abs(
          (await page.evaluate(() =>
            parseFloat(getComputedStyle(document.documentElement).fontSize),
          )) -
            (16 * percent) / 100,
        ) < 0.05,
      );
      if (offline) {
        assert.equal(await page.evaluate(() => navigator.onLine), false);
        const u = base + '__presentation_probe__?' + Date.now(),
          failed = page.waitForEvent('requestfailed', {
            predicate: (r) => r.url() === u,
          });
        assert.ok(
          await page.evaluate(async (u) => {
            try {
              await fetch(u, { cache: 'no-store' });
              return false;
            } catch {
              return true;
            }
          }, u),
        );
        assert.equal(
          (await failed).failure()?.errorText,
          'net::ERR_INTERNET_DISCONNECTED',
        );
      }
      for (const keyboard of [false, true]) {
        await open([sissela]);
        await reveal(keyboard);
        await grade('again', keyboard);
        await fresh(sissela);
        await snapshot(
          keyboard ? 'same-id-keyboard' : 'same-id-pointer',
          sissela,
          keyboard,
        );
        if (keyboard && !recording) {
          await page.keyboard.press('Tab');
          assert.equal(
            await page.evaluate(() =>
              document.activeElement?.matches('.play-big'),
            ),
            true,
            'Tab from reading start reaches audio',
          );
          await page.keyboard.press('Tab');
          assert.equal(
            await page.evaluate(
              () => document.activeElement?.textContent === '顯示答案',
            ),
            true,
            'next Tab reaches reveal',
          );
          await page.keyboard.press('Enter');
          await page.locator('.is-revealed').waitFor();
        } else await reveal(keyboard);
        await grade('again', keyboard);
        await fresh(sissela);
        await snapshot('same-id-next-round', sissela, keyboard);
        await open([sissela, eva]);
        await reveal(keyboard);
        await grade('good', keyboard);
        await fresh(eva);
        await snapshot(
          keyboard ? 'keyboard-next-long' : 'pointer-next-long',
          eva,
          keyboard,
        );
        await reveal(keyboard);
        await grade('again', keyboard);
        await fresh(eva);
        await snapshot('pair-relearn', eva, keyboard);
        await reveal(keyboard);
        await grade('good', keyboard);
        await page.getByText('完成！', { exact: true }).waitFor();
        await page
          .getByRole('button', { name: '回到最後一張', exact: true })
          .click();
        await snapshot('return-from-completion', eva);
      }
      // 不評分的前後／跳過，以及長短卡轉換，進度必須保持。
      await open([sissela, eva, short]);
      const unchanged = await progress();
      for (const [keyName, card, label] of [
        ['ArrowRight', eva, 'keyboard-skip'],
        ['ArrowRight', short, 'long-to-short'],
        ['ArrowLeft', eva, 'short-to-long'],
        ['ArrowLeft', sissela, 'keyboard-previous'],
      ]) {
        await page.keyboard.press(keyName);
        await snapshot(label, card, true);
        assert.deepEqual(await progress(), unchanged);
      }
      for (const [button, card, label] of [
        ['下一張', eva, 'pointer-next'],
        ['上一張', sissela, 'pointer-previous'],
      ]) {
        await page.getByRole('button', { name: button, exact: true }).click();
        await snapshot(label, card);
        assert.deepEqual(await progress(), unchanged);
      }
      // 明確閱讀至卡內段落後，揭示不應被當成新一輪，也不應改寫定位。
      await page.locator('.flash-word').focus();
      await page.evaluate(() => window.scrollBy(0, 120));
      const reading = await page.evaluate(() => {
        const word = document.querySelector('.flash-word');
        const events = [];
        const scroll = Element.prototype.scrollIntoView;
        const focus = HTMLElement.prototype.focus;
        Element.prototype.scrollIntoView = function (...args) {
          events.push({ type: 'scrollIntoView' });
          return scroll.apply(this, args);
        };
        HTMLElement.prototype.focus = function (options) {
          events.push({
            type: 'focus',
            preventScroll: options?.preventScroll === true,
          });
          return focus.call(this, options);
        };
        window.presentationReadingProbe = {
          events,
          restore() {
            Element.prototype.scrollIntoView = scroll;
            HTMLElement.prototype.focus = focus;
          },
        };
        return {
          scrollY,
          top: word.getBoundingClientRect().top,
          lineHeight: parseFloat(getComputedStyle(word).lineHeight),
        };
      });
      const at = reading.scrollY;
      await page.keyboard.press('ArrowLeft');
      if (!recording)
        assert.equal(
          await page.evaluate(() => scrollY),
          at,
          'no-op navigation preserves reading position',
        );
      await page.keyboard.press(' ');
      await page.locator('.is-revealed').waitFor();
      const revealed = await snapshot(
        'reveal-keeps-reading-position',
        sissela,
        false,
        false,
      );
      const revealEvents = await page.evaluate(() => {
        const probe = window.presentationReadingProbe;
        probe.restore();
        return probe.events;
      });
      // 揭示會改字級／grid與瀏覽器捲動錨點；驗視覺閱讀位置，不釘住 scrollY。
      observations.at(-1).readingBefore = reading;
      observations.at(-1).revealEvents = revealEvents;
      console.log(
        'reading-position evidence',
        JSON.stringify({
          before: reading,
          afterTop: revealed.top,
          afterScrollY: revealed.scrollY,
          events: revealEvents,
        }),
      );
      if (!recording) {
        assert.ok(
          Math.abs(revealed.top - reading.top) <= reading.lineHeight,
          'reveal keeps the reading paragraph within one actual text line',
        );
        assert.ok(
          revealed.top < revealed.headerBottom,
          'revealing while reading mid-paragraph must not reset to its start',
        );
        assert.equal(
          revealEvents.filter((x) => x.type === 'scrollIntoView').length,
          0,
          'reveal must not request a presentation scroll',
        );
        assert.ok(
          revealEvents
            .filter((x) => x.type === 'focus')
            .every((x) => x.preventScroll),
          'reveal focus must prevent automatic scrolling',
        );
      }
      // 圖片／進度同步與一般重繪，不可重新把卡片拉回句首。
      await page.evaluate(() => window.scrollBy(0, 120));
      const readingAt = await page.evaluate(() => scrollY);
      await page
        .getByRole('button', { name: '播放', exact: true })
        .dispatchEvent('click');
      await page.evaluate(
        () =>
          new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          ),
      );
      if (!recording)
        assert.ok(
          Math.abs((await page.evaluate(() => scrollY)) - readingAt) < 1,
          'playback repaint must not reset reading',
        );
      const beforeExternal = await page.evaluate(() => scrollY);
      await page.evaluate(
        ({ key, state }) => {
          const oldValue = localStorage.getItem(key),
            next = JSON.parse(oldValue);
          next.srs['stage0-day14:地図'] = state;
          const newValue = JSON.stringify(next);
          localStorage.setItem(key, newValue);
          dispatchEvent(
            new StorageEvent('storage', { key, oldValue, newValue }),
          );
        },
        {
          key,
          state: schedule(
            undefined,
            'good',
            toDateString(),
            new Date().toISOString(),
          ),
        },
      );
      await page.evaluate(
        () =>
          new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          ),
      );
      if (!recording)
        assert.ok(
          Math.abs((await page.evaluate(() => scrollY)) - beforeExternal) < 1,
          'external progress render must not reset reading',
        );
      const stored = await progress();
      await page.reload({ waitUntil: offline ? 'load' : 'networkidle' });
      assert.deepEqual(await progress(), stored);
    }
  }
  assert.deepEqual(errors, []);
  const result = {
    recording,
    observations,
    trueOffline: true,
    probe: 'ERR_INTERNET_DISCONNECTED',
    pageerrors: errors,
    externalProgressKeepsReading: true,
    playbackKeepsReading: true,
    normalRevealsKeepReading: true,
    scope:
      '320x568 at130% and320x480 at150% root font; isolated desktop Chromium; no real device or physical screen reader',
  };
  if (out) await writeFile(out, JSON.stringify(result, null, 2));
  console.log(
    'P2 presentation',
    observations.length,
    'observations;',
    observations.filter((x) => x.requiresVisibleStart && !x.visible).length,
    'outside reading view',
  );
} finally {
  await browser.close();
  server.close();
}
