// Actual navigation entries and geometry, with isolated synthetic learning data.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright-core';
import { assetPath, staticFile } from './helpers/static-file.mjs';
import { loadCategory, loadGameData } from '../curriculum/lessons.mjs';
import {
  emptyProgress,
  recordDictation,
  serializeProgress,
} from '../lib/progress.mjs';
import { schedule, toDateString } from '../lib/srs.mjs';
import { collectInventoryCards } from '../scripts/vocab-illustration-inventory.mjs';
const arg = (key, fallback = '') =>
  process.argv.includes(key)
    ? process.argv[process.argv.indexOf(key) + 1]
    : fallback;
const skipLists = process.argv.includes('--skip-lists');
const root = resolve(arg('--dist', 'dist')),
  out = arg('--out'),
  shots = arg('--screenshots'),
  before = process.argv.includes('--record-before');
if (shots) await mkdir(shots, { recursive: true });
const { gameCharacterStudy } = await loadGameData();
const character = gameCharacterStudy
  .find((g) => g.id === 'genshin')
  .characters.at(-10);
const characterHash = '#/games/genshin/' + encodeURIComponent(character.id);
const allCards = await collectInventoryCards();
const longCards = ['sissela', 'eva'].map((id) =>
  allCards.find(
    (c) =>
      c.category === 'games' &&
      c.id.includes(':' + id + ':') &&
      c.word.length > 30,
  ),
);
assert.ok(longCards.every(Boolean));
let holdPortraits = false;
const held = [];
const server = createServer(async (req, res) => {
  try {
    const path = assetPath(req.url),
      file = staticFile(root, path);
    if (holdPortraits && /portraits\//.test(path))
      await new Promise((r) => held.push(r));
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
        '.webp': 'image/webp',
      }[extname(file)] ?? 'application/octet-stream',
    );
    res.setHeader('cache-control', 'no-cache');
    res.end(await readFile(file));
  } catch {
    res.writeHead(404).end();
  }
});
const external = createServer((_req, res) => {
  res.setHeader('content-type', 'text/html');
  res.end(
    '<!doctype html><title>Synthetic outside-App origin</title>outside App',
  );
});
await new Promise((r) => external.listen(0, '127.0.0.1', r));
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/nihongo-lab/`,
  key = 'nihongo-lab:progress:v1';
let executablePath = process.env.CHROME_PATH;
if (!executablePath)
  for (const name of ['chromium', 'google-chrome']) {
    try {
      executablePath = execFileSync(
        process.platform === 'win32' ? 'where' : 'which',
        [name],
        { encoding: 'utf8' },
      )
        .trim()
        .split(/\r?\n/)[0];
      break;
    } catch {}
  }
const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
});
const result = {
  skippedLists: skipLists,
  longLists: [],
  study: [],
  fallback: [],
  pageerrors: [],
  scope:
    'Desktop Chromium, root-font simulation; not real-device, native keyboard or screen-reader acceptance.',
};
const settle = (p) =>
  p.evaluate(
    () =>
      new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
  );
async function create(width = 375, height = 667, font = 100) {
  const c = await browser.newContext({
    viewport: { width, height },
    hasTouch: true,
    isMobile: true,
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
  const p = await c.newPage();
  p.on('pageerror', (e) => result.pageerrors.push(e.message));
  return { c, p };
}
async function goto(p, hash) {
  await p.goto(base + hash);
  await p.locator('main').waitFor();
}
async function readyList(p) {
  await p.locator('.character-tile').last().waitFor();
  assert.ok((await p.locator('.character-tile').count()) >= 120);
  await settle(p);
}
const tile = (p) =>
  p.getByRole('link', { name: '學習' + character.name, exact: true });
async function position(p) {
  const rect = await tile(p).boundingBox();
  return {
    y: await p.evaluate(() => scrollY),
    top: rect.y,
    height: rect.height,
    viewport: await p.evaluate(() => innerHeight),
  };
}
async function assertPosition(p, expected) {
  await readyList(p);
  await p.waitForFunction((y) => Math.abs(scrollY - y) < 3, expected.y);
  const actual = await position(p);
  assert.ok(
    Math.abs(actual.top - expected.top) < 3,
    JSON.stringify({ expected, actual }),
  );
  assert.ok(actual.top < actual.viewport && actual.top + actual.height > 60);
  return actual;
}
async function noPlayback(p) {
  assert.equal(
    await p.locator('audio').evaluateAll((a) => a.every((e) => e.paused)),
    true,
  );
}
async function shot(p, name) {
  if (shots) await p.screenshot({ path: resolve(shots, name + '.png') });
}
async function disconnect(c, p) {
  await p.evaluate(() => navigator.serviceWorker.ready);
  await p.reload();
  await p.waitForFunction(() => !!navigator.serviceWorker.controller);
  await c.setOffline(true);
  await p.reload();
  const failure = p.waitForEvent('requestfailed', {
    predicate: (r) => r.url().includes('uncached-navigation-probe'),
  });
  assert.equal(
    await p.evaluate(async (url) => {
      try {
        await fetch(url, { cache: 'no-store' });
        return false;
      } catch {
        return true;
      }
    }, base + 'uncached-navigation-probe'),
    true,
  );
  assert.equal(
    (await failure).failure().errorText,
    'net::ERR_INTERNET_DISCONNECTED',
  );
}
async function longList(p, label) {
  await goto(p, '#/games/genshin');
  await readyList(p);
  await tile(p).scrollIntoViewIfNeeded();
  await settle(p);
  const left = await position(p);
  assert.ok(left.y > 1000);
  await shot(p, label + '-list-left');
  await tile(p).click();
  await p.getByRole('button', { name: '聽力特訓', exact: true }).waitFor();
  await settle(p);
  await noPlayback(p);
  await p
    .getByRole('button', { name: '先看原文（不記聽力成績）', exact: true })
    .click();
  const category = p.getByLabel('語音情境');
  await category.selectOption({ index: 1 });
  const selected = await category.inputValue();
  const peek = p.getByRole('button', {
    name: '先看原文（不記聽力成績）',
    exact: true,
  });
  if (!before) assert.equal(await peek.count(), 1);
  if (await peek.count()) await peek.click();
  const download = p
    .locator('details')
    .filter({ has: p.getByText('下載此角色音檔供離線使用', { exact: true }) });
  await download.locator('summary').click();
  const saved = await p.evaluate((key) => localStorage.getItem(key), key);
  await p.getByRole('link', { name: /返回.*角色清單/ }).click();
  await readyList(p);
  const returned = await position(p);
  await shot(p, label + '-list-returned');
  result.longLists.push({ label, left, returned, delta: returned.y - left.y });
  if (before) return;
  await assertPosition(p, left);
  await p.goForward();
  await p.getByRole('button', { name: '聽力特訓', exact: true }).waitFor();
  assert.equal(await category.inputValue(), selected);
  assert.equal(await download.getAttribute('open'), '');
  assert.equal(
    await p
      .getByText('已先看原文，這次不記盲聽成績。', { exact: true })
      .count(),
    1,
  );
  await noPlayback(p);
  assert.equal(
    await p.evaluate((key) => localStorage.getItem(key), key),
    saved,
  );
  for (let i = 0; i < 4; i++) {
    await p.goBack();
    await p.waitForURL((u) => u.hash === '#/games/genshin');
    await p.goForward();
    await p.waitForURL((u) => u.hash === characterHash);
  }
  await p.getByRole('button', { name: '聽力特訓', exact: true }).waitFor();
  assert.equal(await category.inputValue(), selected);
  await noPlayback(p);
  await p.getByRole('link', { name: /返回.*角色清單/ }).click();
  await assertPosition(p, left);
}
try {
  if (!skipLists)
    for (const [width, height, font] of [
      [375, 667, 100],
      [320, 480, 150],
    ]) {
      const { c, p } = await create(width, height, font);
      await longList(p, `${width}-${font}-online`);
      if (!before) {
        await p.evaluate(() => navigator.serviceWorker.ready);
        await p.reload();
        await p.waitForFunction(() => !!navigator.serviceWorker.controller);
        await c.setOffline(true);
        await p.reload();
        const failed = p.waitForEvent('requestfailed', {
          predicate: (r) => r.url().includes('uncached-navigation-probe'),
        });
        assert.equal(
          await p.evaluate(async (url) => {
            try {
              await fetch(url, { cache: 'no-store' });
              return false;
            } catch {
              return true;
            }
          }, base + 'uncached-navigation-probe'),
          true,
        );
        assert.equal(
          (await failed).failure().errorText,
          'net::ERR_INTERNET_DISCONNECTED',
        );
        await longList(p, `${width}-${font}-offline`);
      }
      await c.close();
    }
  if (!before) {
    {
      const { c, p } = await create();
      holdPortraits = true;
      await longList(p, 'delayed-portraits');
      assert.equal(
        await tile(p)
          .locator('img')
          .evaluate((i) => i.naturalWidth),
        0,
      );
      const expected = result.longLists.at(-1).left;
      holdPortraits = false;
      held.splice(0).forEach((r) => r());
      await p.waitForFunction(
        (src) =>
          [...document.images].some(
            (i) =>
              i.getAttribute('src')?.endsWith(src) &&
              i.complete &&
              i.naturalWidth > 0,
          ),
        character.portrait,
      );
      await assertPosition(p, expected);
      await shot(p, 'delayed-portraits-loaded');
      result.study.push({ latePortraitLayoutStable: true });
      await c.close();
    }
    {
      const { c, p } = await create();
      await goto(p, characterHash);
      await p.getByRole('button', { name: '播放這句', exact: true }).click();
      const options = p.locator('.game-line .anime-options button');
      await p.waitForFunction(() =>
        [...document.querySelectorAll('.game-line .anime-options button')].some(
          (b) => !b.disabled,
        ),
      );
      await options.first().click();
      const feedback = await p.locator('.game-line output').innerText(),
        saved = await p.evaluate((key) => localStorage.getItem(key), key);
      await p
        .getByRole('navigation', { name: '功能' })
        .getByRole('link', { name: '設定', exact: true })
        .click();
      await p.goBack();
      await p.locator('.game-line output').waitFor();
      assert.equal(await p.locator('.game-line output').innerText(), feedback);
      assert.equal(
        await p.evaluate((key) => localStorage.getItem(key), key),
        saved,
      );
      await noPlayback(p);
      await p.getByRole('button', { name: '重新聽這句', exact: true }).click();
      assert.equal(await options.first().isDisabled(), true);
      assert.equal(
        await p.evaluate((key) => localStorage.getItem(key), key),
        saved,
      );
      result.study.push({
        gameAnswerRestored: true,
        noDuplicateGrade: true,
        explicitRestartRequiresListening: true,
      });
      await c.close();
    }
    {
      const { c, p } = await create();
      const settings = () =>
        p
          .getByRole('navigation', { name: '功能' })
          .getByRole('link', { name: '設定', exact: true });
      async function returnWithoutRescore(selector) {
        const feedback = await p.locator(selector).innerText();
        const saved = await p.evaluate((key) => localStorage.getItem(key), key);
        await settings().click();
        await p.goBack();
        await p.locator(selector).waitFor();
        assert.equal(await p.locator(selector).innerText(), feedback);
        assert.equal(
          await p.evaluate((key) => localStorage.getItem(key), key),
          saved,
        );
        await noPlayback(p);
      }
      await goto(p, '#/lesson/anime-lesson-01');
      await p.getByRole('tab', { name: /文法/ }).click();
      await p.getByRole('button', { name: '學習重點 1', exact: true }).click();
      await p.getByRole('button', { name: '下一頁', exact: true }).click();
      await p
        .locator('.grammar-question .anime-options button')
        .first()
        .click();
      await returnWithoutRescore('.grammar-question output');
      assert.ok(
        await p
          .locator('.grammar-question .anime-options button')
          .first()
          .isDisabled(),
      );
      await p.getByRole('tab', { name: /特訓/ }).click();
      const clip = p.locator('.anime-clip').first();
      await clip.getByRole('button', { name: '播放台詞', exact: true }).click();
      await p.waitForFunction(
        () =>
          !document.querySelector('.anime-clip .anime-options button')
            ?.disabled,
      );
      await clip.locator('.anime-options button').first().click();
      await returnWithoutRescore('.anime-clip:first-of-type output');
      await goto(p, '#/lesson/general-listening-126');
      await p
        .getByRole('button', { name: '播放完整對話', exact: true })
        .click();
      await p.waitForFunction(
        () =>
          document
            .querySelector('.scene-status')
            ?.textContent.includes('已完整聽過對話'),
        {},
        { timeout: 90000 },
      );
      await p.locator('.scene-listening .anime-options button').first().click();
      const nextPrompt = await p
        .locator('.scene-listening .scene-question')
        .innerText();
      const saved = await p.evaluate((key) => localStorage.getItem(key), key);
      await settings().click();
      await p.goBack();
      await p.locator('.scene-listening .scene-question').waitFor();
      assert.equal(
        await p.locator('.scene-listening .scene-question').innerText(),
        nextPrompt,
      );
      assert.equal(
        await p.evaluate((key) => localStorage.getItem(key), key),
        saved,
      );
      await noPlayback(p);
      result.study.push({
        grammarAnswerAndUnit: true,
        trainingAnswerAndQuestion: true,
        sceneQuestionAndHeard: true,
        noDuplicateGrade: true,
      });
      await c.close();
    }
    const { c, p } = await create();
    // Course list/group -> lesson/tab/reading -> exercise -> actual source.
    await goto(p, '#/courses/stage-1');
    const group = p
      .locator('.stage > details.card')
      .filter({ has: p.locator('summary').filter({ hasText: '121～130' }) });
    await group.locator('summary').click();
    const lesson = group.locator('a[href="#/lesson/general-listening-126"]');
    await lesson.scrollIntoViewIfNeeded();
    await settle(p);
    const listY = await p.evaluate(() => scrollY);
    await lesson.click();
    await p
      .getByRole('tab', { name: /單字/ })
      .first()
      .click();
    await p.evaluate(() => scrollTo(0, 600));
    await settle(p);
    const readingY = await p.evaluate(() => scrollY);
    await p
      .getByRole('navigation', { name: '功能' })
      .getByRole('link', { name: '聽寫', exact: true })
      .click();
    await p.locator('a[href="#/dictation?category=general"]').click();
    await p.getByRole('button', { name: '跳過這句', exact: true }).click();
    const question = await p.locator('.stepper strong').innerText();
    await p
      .locator('label')
      .filter({ has: p.getByRole('radio', { name: '輸入', exact: true }) })
      .click();
    const input = p.getByRole('textbox');
    await input.fill('synthetic unsubmitted draft');
    await p.getByRole('button', { name: '播放這句', exact: true }).click();
    await p.waitForFunction(() =>
      [...document.querySelectorAll('audio')].some((e) => !e.paused),
    );
    await p.getByRole('link', { name: '返回上一頁', exact: true }).click();
    await p.getByRole('link', { name: '返回上一頁', exact: true }).click();
    await p
      .getByRole('tab', { name: /單字/ })
      .first()
      .waitFor();
    await p.waitForFunction((y) => Math.abs(scrollY - y) < 3, readingY);
    await noPlayback(p);
    await p.goForward();
    await p.goForward();
    await input.waitFor();
    assert.equal(await input.inputValue(), 'synthetic unsubmitted draft');
    assert.equal(await p.locator('.stepper strong').innerText(), question);
    await noPlayback(p);
    await p.goBack();
    await p.goBack();
    await p.getByRole('link', { name: '返回課程清單', exact: true }).click();
    await group.waitFor();
    assert.equal(await group.getAttribute('open'), '');
    await p.waitForFunction((y) => Math.abs(scrollY - y) < 3, listY);
    result.study.push({
      courseGroupsAndTab: true,
      readingY,
      dictationQuestionAndDraft: true,
      noAutoPlayback: true,
    });
    // Shadowing returns to the same sentence/text, but never resumes its loop.
    await goto(p, '#/shadowing?category=n5');
    await p.getByRole('button', { name: '下一句', exact: true }).click();
    await p.getByText('顯示原文', { exact: true }).click();
    const sentence = await p.locator('.stepper strong').innerText();
    await p.getByRole('button', { name: '開始跟讀', exact: true }).click();
    await p.waitForFunction(() =>
      [...document.querySelectorAll('audio')].some((e) => !e.paused),
    );
    await p
      .getByRole('navigation', { name: '功能' })
      .getByRole('link', { name: '設定', exact: true })
      .click();
    await p.goBack();
    await p.getByRole('button', { name: '開始跟讀', exact: true }).waitFor();
    assert.equal(await p.locator('.stepper strong').innerText(), sentence);
    assert.equal(
      await p
        .getByRole('checkbox', { name: '顯示原文', exact: true })
        .isChecked(),
      true,
    );
    await noPlayback(p);
    result.study.push({ shadowingSentenceAndText: true, loopStopped: true });
    await c.close();
    {
      const { c, p } = await create();
      await goto(p, '#/settings');
      const catalog = await loadCategory('n5');
      const audio = catalog.sentences[1].audio;
      await p.evaluate(async (audio) => {
        const u = new URL(audio, location.href).href;
        const res = await fetch(u);
        if (!res.ok) throw Error('fixture audio');
        await (await caches.open('lesson-audio-v5')).put(u, res);
      }, audio);
      await disconnect(c, p);
      await goto(p, '#/shadowing?category=n5');
      await p.getByRole('button', { name: '下一句', exact: true }).click();
      await p.getByText('顯示原文', { exact: true }).click();
      const sentence = await p.locator('.stepper strong').innerText();
      await p.getByRole('button', { name: '開始跟讀', exact: true }).click();
      await p.waitForFunction(() =>
        [...document.querySelectorAll('audio')].some(
          (a) => !a.paused && a.currentTime > 0,
        ),
      );
      await p
        .getByRole('navigation', { name: '功能' })
        .getByRole('link', { name: '設定', exact: true })
        .click();
      await p.goBack();
      await p.getByRole('button', { name: '開始跟讀', exact: true }).waitFor();
      assert.equal(await p.locator('.stepper strong').innerText(), sentence);
      await noPlayback(p);
      result.study.push({
        shadowingSentenceAndText: true,
        offline: true,
        loopStopped: true,
        cachedRealAudioPlayed: true,
      });
      await c.close();
    }
    // SRS retains a whole round/answer face; ordinary returning must not be a
    // new card presentation or a new FSRS review. Existing test:srs-layout also
    // checks same-ID retries and keyboard focus after actual presentations.
    for (const disconnected of [false, true])
      for (const [width, height, font] of [
        [375, 667, 100],
        [320, 480, 150],
      ]) {
        const { c, p } = await create(width, height, font);
        await goto(p, '#/settings');
        const progress = recordDictation(
          emptyProgress(),
          'synthetic-prior-attempt',
          false,
          '2026-10-20T00:00:00.000Z',
        );
        for (const card of longCards)
          progress.srs[card.id] = schedule(
            undefined,
            'again',
            toDateString(),
            new Date().toISOString(),
          );
        await p.evaluate(({ key, s }) => localStorage.setItem(key, s), {
          key,
          s: serializeProgress(progress),
        });
        await p.reload();
        if (disconnected) await disconnect(c, p);
        await goto(p, '#/srs?category=games');
        await p.getByRole('button', { name: '顯示答案', exact: true }).click();
        const priorGrade = JSON.parse(
          await p.evaluate((key) => localStorage.getItem(key), key),
        );
        await p.getByRole('button', { name: /^記得，/ }).click();
        await p.getByRole('button', { name: '顯示答案', exact: true }).click();
        await p.evaluate(() => scrollTo(0, 300));
        await settle(p);
        const y = await p.evaluate(() => scrollY),
          word = await p.locator('.flash-word').textContent(),
          saved = await p.evaluate((key) => localStorage.getItem(key), key);
        await p
          .getByRole('navigation', { name: '功能' })
          .getByRole('link', { name: '設定', exact: true })
          .click();
        await p.goBack();
        await p.locator('.flash-word').waitFor();
        await p.waitForFunction((y) => Math.abs(scrollY - y) < 3, y);
        assert.equal(await p.locator('.flash-word').textContent(), word);
        assert.equal(
          await p
            .getByRole('button', { name: '顯示答案', exact: true })
            .count(),
          0,
        );
        assert.equal(
          await p.evaluate((key) => localStorage.getItem(key), key),
          saved,
        );
        await noPlayback(p);
        await shot(
          p,
          `${width}-srs-${disconnected ? 'offline' : 'online'}-return`,
        );
        const graded = Object.keys(JSON.parse(saved).srs).find(
          (id) =>
            JSON.stringify(priorGrade.srs[id]) !==
            JSON.stringify(JSON.parse(saved).srs[id]),
        );
        assert.ok(graded);
        const reps = JSON.parse(saved).srs[graded].reps;
        await p.getByRole('button', { name: '上一張', exact: true }).click();
        await p.getByRole('button', { name: /^還不會，/ }).click();
        const regraded = JSON.parse(
          await p.evaluate((key) => localStorage.getItem(key), key),
        );
        assert.equal(regraded.srs[graded].reps, reps);
        assert.deepEqual(regraded.dictation, priorGrade.dictation);
        result.study.push({
          srsRoundAndFace: true,
          offline: disconnected,
          regradeKeepsRoundBaseline: true,
          width,
          font,
          scroll: y,
          noDuplicateGrade: true,
        });
        await c.close();
      }
    // An evicted entry gets fresh state and an internal replace fallback. The
    // browser entry metadata is observed, not fabricated or persisted elsewhere.
    {
      const { c, p } = await create();
      await goto(p, characterHash);
      await p.getByLabel('語音情境').selectOption({ index: 1 });
      const oldId = await p.evaluate(() => history.state.nihongoPageEntry);
      for (let i = 0; i < 40; i++) {
        const id = await p.evaluate(() => history.state.nihongoPageEntry);
        await p.evaluate((i) => (location.hash = '#/settings?visit=' + i), i);
        await p.waitForFunction(
          (id) => history.state.nihongoPageEntry !== id,
          id,
        );
        await settle(p);
      }
      await p.evaluate(() => history.go(-40));
      await p.waitForURL((u) => u.hash === characterHash);
      await p.getByLabel('語音情境').waitFor();
      assert.equal(await p.getByLabel('語音情境').inputValue(), '');
      assert.notEqual(
        await p.evaluate(() => history.state.nihongoPageEntry),
        oldId,
      );
      const length = await p.evaluate(() => history.length);
      await p.getByRole('link', { name: /返回.*角色清單/ }).click();
      await readyList(p);
      await p.getByRole('link', { name: '所有遊戲', exact: true }).click();
      await p.waitForURL((u) => u.hash === '#/games');
      assert.equal(await p.evaluate(() => history.length), length);
      await noPlayback(p);
      result.fallback.push({
        evicted40: true,
        defaultState: true,
        internalReplaceNoLoop: true,
      });
      await c.close();
    }
    {
      const { c, p } = await create();
      await p.goto(`http://127.0.0.1:${external.address().port}/`);
      await goto(p, characterHash);
      await p.getByRole('link', { name: /返回.*角色清單/ }).click();
      await readyList(p);
      await p.getByRole('link', { name: '所有遊戲', exact: true }).click();
      await p.waitForURL((u) => u.hash === '#/games');
      result.fallback.push({ directDeepLink: true, noExternalBack: true });
      await c.close();
    }
  }
  assert.deepEqual(result.pageerrors, []);
  if (out) await writeFile(out, JSON.stringify(result, null, 2) + '\n');
  console.log(
    before
      ? 'RECORDED baseline geometry, not a pass'
      : 'PASS navigation geometry/context/lineage/eviction and real-offline regressions',
  );
} catch (e) {
  // Keep actionable cross-platform failures in check annotations as well as
  // stdout; no screenshots, progress payloads or private evidence are uploaded.
  if (process.env.GITHUB_ACTIONS === 'true') {
    const callsites = [
      ...new Set(e.stack?.match(/navigation-browser\.mjs:\d+:\d+/g) ?? []),
    ].join(', ');
    const completed = JSON.stringify({
      lists: result.longLists.map((x) => x.label),
      study: result.study.map((x) => Object.keys(x)),
      fallback: result.fallback,
    });
    const message =
      `${process.platform} ${callsites}: ${e.message}; completed=${completed}`
        .slice(0, 2200)
        .replaceAll('%', '%25')
        .replaceAll('\r', '%0D')
        .replaceAll('\n', '%0A');
    console.error(`::error file=tests/navigation-browser.mjs::${message}`);
  }
  for (const c of browser.contexts())
    for (const p of c.pages()) if (!p.isClosed()) await shot(p, 'failure');
  if (out)
    await writeFile(
      out,
      JSON.stringify({ ...result, incomplete: true }, null, 2),
    );
  throw e;
} finally {
  holdPortraits = false;
  held.splice(0).forEach((r) => r());
  await browser.close();
  server.close();
  external.close();
}
