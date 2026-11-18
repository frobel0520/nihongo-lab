// Real build; synthetic storage faults are confined to fresh browser contexts.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright-core';
import { assetPath, staticFile } from './helpers/static-file.mjs';
import {
  emptyProgress,
  recordDictation,
  serializeProgress,
} from '../lib/progress.mjs';
import { loadCategory } from '../curriculum/lessons.mjs';
import { AUDIO_CACHE_NAME } from '../lib/offline.mjs';
import { IMAGE_CACHE_NAME } from '../lib/vocab-image-offline.mjs';
const arg = (n, fallback = '') =>
  process.argv.includes(n)
    ? process.argv[process.argv.indexOf(n) + 1]
    : fallback;
const root = resolve(arg('--dist', 'dist')),
  out = arg('--out'),
  shots = arg('--screenshots');
const before = process.argv.includes('--record-before');
const selectedCase = arg('--case', 'all');
const general = await loadCategory('general');
if (shots) await mkdir(shots, { recursive: true });
const result = {
  before,
  save: [],
  quota: [],
  focus: [],
  dictation: [],
  offline: {},
  pageerrors: [],
  passed: false,
  scope:
    'Isolated desktop Chromium, viewport and root font simulation; no real profile, device, native zoom, screen reader or authenticated sync.',
};
let downloadDelay = 0;
const server = createServer(async (req, res) => {
  try {
    const file = staticFile(root, assetPath(req.url));
    if (req.url.includes('offline-download') && downloadDelay)
      await new Promise((r) => setTimeout(r, downloadDelay));
    res.setHeader(
      'Content-Type',
      {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.mp3': 'audio/mpeg',
        '.svg': 'image/svg+xml',
        '.json': 'application/json',
        '.webmanifest': 'application/manifest+json',
        '.png': 'image/png',
        '.ico': 'image/x-icon',
      }[extname(file)] ?? 'application/octet-stream',
    );
    res.setHeader('Cache-Control', 'no-cache');
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
        return execFileSync(
          process.platform === 'win32' ? 'where' : 'which',
          [n],
          { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
        )
          .trim()
          .split(/\r?\n/)[0];
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
const retained = recordDictation(
  emptyProgress(),
  'synthetic-retained-record',
  false,
  '2026-11-01T00:00:00.000Z',
);
async function create(width = 375, height = 667, font = 100) {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion: 'reduce',
    hasTouch: true,
  });
  await context.route('https://**', (r) => r.abort());
  await context.addInitScript(
    ({ key, initial, font }) => {
      const set = Storage.prototype.setItem;
      if (!localStorage.getItem(key)) set.call(localStorage, key, initial);
      window.testFault = {
        save: false,
        cache: '',
        puts: 0,
        quota: false,
        after: 0,
        requests: [],
        hold: false,
        releases: [],
      };
      Storage.prototype.setItem = function (k, v) {
        if (window.testFault.save && k === key)
          throw new DOMException(
            'synthetic storage full',
            'QuotaExceededError',
          );
        return set.call(this, k, v);
      };
      const fetch0 = window.fetch,
        put = Cache.prototype.put;
      window.fetch = function (url, ...args) {
        const f = window.testFault;
        if (String(url).includes('offline-download')) {
          f.requests.push(String(url));
          if (f.quota) f.after++;
        }
        return fetch0.call(this, url, ...args);
      };
      Cache.prototype.put = async function (req, ...args) {
        const f = window.testFault,
          url = typeof req === 'string' ? req : req.url;
        if (f.cache && url.includes(f.cache)) {
          const call = ++f.puts;
          if (call === 2) {
            f.quota = true;
            throw new DOMException(
              'synthetic storage full',
              'QuotaExceededError',
            );
          }
          if (call > 2 && f.hold) await new Promise((r) => f.releases.push(r));
        }
        return put.call(this, req, ...args);
      };
      document.addEventListener(
        'DOMContentLoaded',
        () => (document.documentElement.style.fontSize = `${font}%`),
      );
    },
    { key, initial: serializeProgress(retained), font },
  );
  const page = await context.newPage();
  page.on('pageerror', (e) => result.pageerrors.push(e.message));
  return { context, page };
}
const shot = async (p, name) => {
  if (shots) await p.screenshot({ path: resolve(shots, `${name}.png`) });
};
async function geometry(p, selector) {
  return p.locator(selector).evaluate((e) => {
    const r = e.getBoundingClientRect(),
      header = document.querySelector('.appbar').getBoundingClientRect();
    const overlays = [
      'nav.tabs',
      '.game-controls',
      '.section-tabs',
      '.save-notice',
    ].flatMap((s) => {
      const x = document.querySelector(s);
      if (!x || x.contains(e)) return [];
      if (!['fixed', 'sticky'].includes(getComputedStyle(x).position))
        return [];
      const rect = x.getBoundingClientRect();
      return [{ selector: s, top: rect.top, bottom: rect.bottom }];
    });
    return {
      top: r.top,
      bottom: r.bottom,
      header: header.bottom,
      overlays,
      scrollY,
      active: document.activeElement === e,
      tag: document.activeElement.tagName,
      font: getComputedStyle(document.documentElement).fontSize,
      overflow: document.documentElement.scrollWidth > innerWidth,
      visible:
        r.top >= header.bottom - 1 &&
        r.bottom <= innerHeight &&
        !overlays.some((x) => r.top < x.bottom && r.bottom > x.top),
    };
  });
}
const saveData = (p) =>
  p.evaluate((k) => JSON.parse(localStorage.getItem(k)), key);
async function grade(p, keyboard = false) {
  if (keyboard) {
    await p.locator('.flash-word').focus();
    await p.keyboard.press('Space');
    await p.keyboard.press('2');
  } else {
    await p.getByRole('button', { name: '顯示答案', exact: true }).click();
    await p.getByRole('button', { name: /^記得，/ }).click();
  }
}
async function saveFailure(width, height, font) {
  const { context, page: p } = await create(width, height, font);
  try {
    await p.goto(base + '#/srs/new?category=general');
    await p.locator('.flash-word').waitFor();
    await p.evaluate(() => (window.testFault.save = true));
    await grade(p);
    const first = await geometry(p, '.notice[role="alert"], .save-notice');
    const memoryA = await p.locator('.flash-word').innerText();
    if (!before) {
      assert.equal(
        first.visible,
        true,
        'failed-save reminder remains below header and above fixed navigation',
      );
      assert.equal(
        (await saveData(p)).dictation['synthetic-retained-record'].attempts,
        1,
      );
      await grade(p, true);
      // A different tab update cannot discard either pending grade.
      await p.evaluate((key) => {
        const progress = JSON.parse(localStorage.getItem(key));
        progress.dictation['synthetic-other-tab'] = {
          attempts: 1,
          passed: true,
          lastAt: '2026-11-17T00:00:00.000Z',
        };
        const raw = JSON.stringify(progress);
        Storage.prototype.setItem.call(
          localStorage,
          'synthetic-unrelated-key',
          'unrelated',
        );
        window.dispatchEvent(
          new StorageEvent('storage', { key, newValue: raw }),
        );
      }, key);
      const second = await geometry(p, '.save-notice');
      assert.equal(second.visible, true);
      const word = await geometry(p, '.flash-word');
      assert.ok(
        word.top >= second.bottom - 1 && word.top < height - 64,
        `next word stays below warning: ${JSON.stringify({ word, second })}`,
      );
      await shot(p, `save-${width}-${font}`);
      await p.evaluate(() => (window.testFault.save = false));
      await p.getByRole('button', { name: '重新儲存', exact: true }).click();
      await p.locator('.save-notice').waitFor({ state: 'detached' });
      const saved = await saveData(p);
      assert.equal(
        Object.keys(saved.srs).length,
        2,
        'both failed grades retained',
      );
      assert.ok(
        Object.values(saved.srs).every((c) => c.reps === 1),
        'retry does not grade twice',
      );
      assert.equal(saved.dictation['synthetic-other-tab'].attempts, 1);
      assert.deepEqual(
        saved.dictation['synthetic-retained-record'],
        retained.dictation['synthetic-retained-record'],
      );
      await grade(p);
      assert.equal(
        Object.keys((await saveData(p)).srs).length,
        3,
        'ordinary saves recover',
      );
      await p.reload();
      await p.locator('.flash-word').waitFor();
      assert.equal(Object.keys((await saveData(p)).srs).length, 3);
      result.save.push({
        width,
        height,
        font,
        first,
        second,
        word,
        pendingSaved: 2,
        ordinarySaved: 1,
        duplicateReviews: 0,
        memoryA,
      });
    } else {
      result.save.push({ width, height, font, first, memoryA });
      await shot(p, `before-save-${width}-${font}`);
    }
  } finally {
    await context.close();
  }
}
async function focusCases(width, height, font) {
  const { context, page: p } = await create(width, height, font);
  try {
    for (const [route, target] of [
      ['#/settings', '試聽五位原有角色、三位男聲與重音修正比較'],
      ['#/games/genshin/collei', '無聲閱讀'],
      ['#/games/genshin/collei', '聽力特訓'],
    ]) {
      await p.goto(base + route);
      await p.getByText(target, { exact: true }).waitFor();
      // Start at the actual first preference / character selector and use native Tab.
      const start = route.includes('settings')
        ? p.getByRole('checkbox').first()
        : p.locator('.character-select select');
      if (await start.count()) await start.focus();
      else await p.locator('h1').click();
      await p.evaluate(() => scrollTo(0, 0));
      let found = false;
      for (let i = 0; i < 35; i++) {
        await p.keyboard.press('Tab');
        found = await p.evaluate(
          (target) => document.activeElement.textContent.trim() === target,
          target,
        );
        if (found) break;
      }
      assert.ok(found, `reachable through native Tab: ${target}`);
      const el = p.getByText(target, { exact: true });
      // Measure the actual focused element, including inline link text geometry.
      const rect = await el.evaluate((e) => {
        e.dataset.focusProbe = 'true';
        return e.tagName;
      });
      const g = await geometry(p, '[data-focus-probe="true"]');
      result.focus.push({
        width,
        height,
        font,
        route,
        target,
        rect,
        geometry: g,
      });
      await shot(
        p,
        `${before ? 'before-' : ''}focus-${width}-${font}-${target === '無聲閱讀' ? 'read' : target === '聽力特訓' ? 'listen' : 'settings'}`,
      );
      if (!before)
        assert.equal(g.visible, true, `${target} focus is not covered`);
      await p.keyboard.press('Tab');
      await p.keyboard.press('Shift+Tab');
      if (!before)
        assert.equal(
          (await geometry(p, '[data-focus-probe="true"]')).visible,
          true,
          'reverse keyboard focus remains visible',
        );
    }
  } finally {
    await context.close();
  }
}
async function audioPanel(p) {
  await p.getByText('下載此角色音檔供離線使用', { exact: true }).click();
  return p
    .getByRole('heading', { name: '離線音檔', exact: true })
    .locator('..');
}
async function quota(kind) {
  const { context, page: p } = await create();
  try {
    await p.goto(
      base + (kind === 'audio' ? '#/games/genshin/collei' : '#/settings'),
    );
    const panel =
      kind === 'audio'
        ? await audioPanel(p)
        : p
            .getByRole('heading', { name: '離線單字圖片', exact: true })
            .locator('..');
    const name = kind === 'audio' ? '下載此角色音檔' : '下載全部單字圖片';
    await panel.getByRole('button', { name, exact: true }).waitFor();
    await p.evaluate(
      (kind) =>
        Object.assign(window.testFault, {
          cache: kind === 'audio' ? '/audio/' : '/images/vocab/',
          hold: true,
        }),
      kind,
    );
    await panel.getByRole('button', { name, exact: true }).click();
    await p.waitForFunction(() => window.testFault.quota);
    if (!before)
      await panel
        .locator('output')
        .filter({ hasText: '在途請求正在收尾' })
        .waitFor();
    const stopping = await p.evaluate(() => ({
      after: window.testFault.after,
      requests: [...window.testFault.requests],
      puts: window.testFault.puts,
    }));
    await p.evaluate(() => {
      window.testFault.hold = false;
      window.testFault.releases.splice(0).forEach((r) => r());
    });
    if (!before)
      await panel
        .locator('output')
        .filter({ hasText: '儲存空間不足，下載已暫停' })
        .waitFor();
    else
      await panel
        .locator('output')
        .filter({ hasText: /完成/ })
        .waitFor();
    const cacheName = kind === 'audio' ? AUDIO_CACHE_NAME : IMAGE_CACHE_NAME;
    const cached = await p.evaluate(
      async (name) =>
        (await (await caches.open(name)).keys()).map((r) => r.url),
      cacheName,
    );
    const message = await panel.locator('output').innerText();
    const after = await p.evaluate(() => ({
      after: window.testFault.after,
      requests: [...window.testFault.requests],
    }));
    if (!before) {
      assert.equal(
        after.after,
        0,
        'no new requests dispatched after first confirmed quota',
      );
      assert.ok(
        cached.length > 0 && cached.length < 8,
        'limited in-flight writes finish and remain cached',
      );
      assert.match(message, /失敗 1/);
      assert.match(message, /尚未處理/);
      await p.evaluate(() =>
        Object.assign(window.testFault, {
          cache: '',
          quota: false,
          requests: [],
          after: 0,
        }),
      );
      if (kind === 'images') downloadDelay = 80;
      await panel
        .getByRole('button', {
          name: kind === 'audio' ? name : '下載其餘單字圖片',
          exact: true,
        })
        .click();
      if (kind === 'audio')
        await panel.locator('output').filter({ hasText: '完成：' }).waitFor();
      else {
        await p.waitForFunction(() => window.testFault.requests.length >= 6);
        await panel
          .getByRole('button', { name: '取消下載', exact: true })
          .click();
        await panel.locator('output').filter({ hasText: '已取消' }).waitFor();
      }
      downloadDelay = 0;
      const resumed = await p.evaluate(() => window.testFault.requests);
      assert.ok(resumed.length > 0);
      assert.ok(
        resumed.every(
          (url) =>
            !cached.includes(
              url.replace(/([?&])offline-download=1/, '').replace(/\?$/, ''),
            ),
        ),
        'resume does not re-fetch retained content',
      );
      for (const url of cached.slice(0, 2)) {
        const actual = await p.evaluate(
          async ({ name, url }) =>
            Array.from(
              new Uint8Array(
                await (
                  await (await caches.open(name)).match(url)
                ).arrayBuffer(),
              ),
            ),
          { name: cacheName, url },
        );
        assert.equal(
          createHash('sha256').update(Buffer.from(actual)).digest('hex'),
          createHash('sha256')
            .update(
              await readFile(
                staticFile(root, assetPath(new URL(url).pathname)),
              ),
            )
            .digest('hex'),
        );
      }
      result.quota.push({
        kind,
        stopping,
        after,
        cached: cached.length,
        message,
        resumed: resumed.length,
        retainedShaChecked: Math.min(2, cached.length),
      });
    } else result.quota.push({ kind, stopping, after, message });
  } finally {
    downloadDelay = 0;
    await context.close();
  }
}
async function dictation() {
  const { context, page: p } = await create(320, 480, 150);
  try {
    await p.goto(base + '#/dictation?category=general');
    await p.locator('.choice').first().waitFor();
    const beforeAx = await p.locator('.choices').ariaSnapshot();
    assert.doesNotMatch(beforeAx, /你的答案|正確答案/);
    const source = await p
      .locator('.dictation-screen audio')
      .first()
      .getAttribute('src');
    const sentence = general.sentences.find((s) => source?.includes(s.audio));
    assert.ok(sentence, 'actual current audio identifies the exercise');
    const options = p.locator('.choice');
    let wrongIndex = -1;
    for (let i = 0; i < (await options.count()); i++) {
      if (
        (await options.nth(i).locator('.choice-jp').evaluate((e) => { const clone = e.cloneNode(true); clone.querySelectorAll('rt, rp').forEach((n) => n.remove()); return clone.textContent; })) !== sentence.jp
      ) {
        wrongIndex = i;
        break;
      }
    }
    assert.ok(wrongIndex >= 0);
    await p.keyboard.press(String(wrongIndex + 1));
    await p.locator('.choice[data-state="wrong"]').waitFor();
    const ax = await p.locator('.dictation-workspace').ariaSnapshot();
    if (!before) {
      assert.match(ax, /你的答案（不正確）/);
      assert.match(ax, /正確答案/);
      assert.match(
        (await p
          .locator('.choice[data-state="wrong"]')
          .getAttribute('aria-label')) ??
          (await p.locator('.choice[data-state="wrong"]').innerText()),
        /你的答案/,
      );
      assert.equal(await p.locator('.choice-result-label').count(), 2);
    }
    await shot(p, `${before ? 'before-' : ''}dictation-wrong`);
    result.dictation.push({
      width: 320,
      height: 480,
      font: 150,
      beforeAx,
      afterAx: ax,
    });
    if (!before) {
      const currentData = await saveData(p);
      assert.equal(currentData.dictation[sentence.id].attempts, 1);
      assert.equal(currentData.dictation[sentence.id].passed, false);
      await p.keyboard.press('Enter');
      await p.locator('.choice:not(:disabled)').first().waitFor();
      const nextSource = await p
        .locator('.dictation-screen audio')
        .first()
        .getAttribute('src');
      const nextSentence = general.sentences.find((s) =>
        nextSource?.includes(s.audio),
      );
      const texts = await p.locator('.choice-jp').evaluateAll((els) => els.map((e) => {
        const clone = e.cloneNode(true); clone.querySelectorAll('rt, rp').forEach((n) => n.remove()); return clone.textContent;
      }));
      assert.ok(texts.includes(nextSentence.jp));
      const correct = p.locator('.choice').nth(texts.indexOf(nextSentence.jp));
      await correct.click();
      assert.match(await correct.innerText(), /你的答案（正確）／正確答案/);
      await p.getByText('輸入', { exact: true }).click();
      await p.locator('#dictation-input').fill('synthetic wrong input');
      await p.locator('#dictation-input').press('Enter');
      await p.getByRole('button', { name: '再試一次', exact: true }).waitFor();
      assert.match(await p.locator('.feedback').innerText(), /標準答案/);
      await p.getByRole('button', { name: '再試一次', exact: true }).click();
      await p.locator('#dictation-input').fill(nextSentence.jp);
      await p.locator('#dictation-input').press('Enter');
      await p.locator('.feedback.ok').waitFor();
      await p.getByRole('button', { name: '播放這句', exact: true }).click();
      await p.waitForFunction(() => {
        const a = document.querySelector('.dictation-screen audio');
        return a && !a.paused && a.currentTime > 0;
      });
      await p.getByText('選擇題', { exact: true }).click();
      await p.evaluate(
        async ({ path, name }) => {
          const url = new URL(path, location.href).href;
          await (await caches.open(name)).put(url, await fetch(url));
        },
        { path: nextSentence.audio, name: AUDIO_CACHE_NAME },
      );
      await p.evaluate(async ({ path, name }) => {
        const url = new URL(path, location.href).href;
        await (await caches.open(name)).put(url, await fetch(url));
      }, { path: sentence.audio, name: AUDIO_CACHE_NAME });
      // A real install and two explicitly cached real clips; a failed uncached probe confirms offline.
      await p.evaluate(() => navigator.serviceWorker.ready);
      await p.reload();
      await p.locator('.choice').first().waitFor();
      await p.waitForFunction(() => navigator.serviceWorker.controller);
      await context.setOffline(true);
      const failed = await p.evaluate(async () => {
        try {
          await fetch(`./uncached-t194-${Date.now()}`, { cache: 'no-store' });
          return false;
        } catch {
          return true;
        }
      });
      assert.equal(failed, true);
      await p.reload();
      await p.locator('.choice').first().waitFor();
      await p.keyboard.press('1');
      await p.locator('.feedback').waitFor();
      assert.ok((await p.locator('.choice-result-label').count()) > 0);
      assert.equal(
        (await saveData(p)).dictation['synthetic-retained-record'].attempts,
        1,
      );
      await p.getByRole('button', { name: '播放這句', exact: true }).click();
      await p.waitForFunction(() => { const a = document.querySelector('.dictation-screen audio'); return a && !a.paused && a.currentTime > 0; });
      await p.goto(base + '#/srs/new?category=general');
      await p.locator('.flash-word').waitFor();
      await p.evaluate(() => (window.testFault.save = true));
      await grade(p);
      assert.equal(
        (await geometry(p, '.save-notice')).visible,
        true,
        'offline warning remains visible',
      );
      await p.evaluate(() => (window.testFault.save = false));
      await p.getByRole('button', { name: '重新儲存', exact: true }).click();
      assert.equal(Object.keys((await saveData(p)).srs).length, 1);
      result.offline = {
        saveRecovery: true,
        method:
          'BrowserContext.setOffline(true), failed uncached fetch probe, then reload',
        probeFailed: failed,
        dictationLabels: true,
        retainedProgress: true,
      };
    }
  } finally {
    await context.close();
  }
}
try {
  for (const [w, h, f] of [
    [375, 667, 100],
    [320, 480, 150],
  ]) {
    if (['all', 'save'].includes(selectedCase)) await saveFailure(w, h, f);
    if (['all', 'focus'].includes(selectedCase)) await focusCases(w, h, f);
  }
  if (['all', 'focus'].includes(selectedCase)) await focusCases(1024, 768, 100);
  if (['all', 'audio'].includes(selectedCase)) await quota('audio');
  if (['all', 'images'].includes(selectedCase) && !before)
    await quota('images');
  if (['all', 'dictation'].includes(selectedCase)) await dictation();
  assert.deepEqual(result.pageerrors, []);
  result.passed = true;
} finally {
  if (out)
    await writeFile(
      out.replace(/\.json$/, '') + '-storage.json',
      JSON.stringify(result, null, 2),
    );
  await browser.close();
  await new Promise((r) => server.close(r));
}
console.log(
  `Storage/accessibility browser regression: ${result.save.length} save, ${result.quota.length} quota, ${result.focus.length} focus, ${result.dictation.length} dictation cases; ${result.passed ? 'passed' : 'failed'}.`,
);
