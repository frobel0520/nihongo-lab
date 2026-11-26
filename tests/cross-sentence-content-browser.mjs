// Exercise the real curriculum and deployed-path build, without replacing payloads or media.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { chromium } from 'playwright-core';
import { loadLesson } from '../curriculum/lessons.mjs';
import { AUDIO_CACHE_NAME } from '../lib/offline.mjs';
import {
  emptyProgress,
  recordDictation,
  serializeProgress,
} from '../lib/progress.mjs';
import { sceneRecordId } from '../lib/scene-listening.mjs';
import { assetPath, staticFile } from './helpers/static-file.mjs';
import { crossSentenceIds } from './helpers/cross-sentence-scope.mjs';

const root = resolve(process.argv[2] ?? 'dist');
const basePath = '/nihongo-lab/';
const key = 'nihongo-lab:progress:v1';
const original = await loadLesson('general-listening-01');
const oldId = sceneRecordId(original, original.scene.questions[0]);
const retained = recordDictation(
  emptyProgress(),
  oldId,
  true,
  '2026-11-25T00:00:00.000Z',
);
const contentType = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.mp3': 'audio/mpeg',
  '.webmanifest': 'application/manifest+json',
};
const requests = [];
const server = createServer(async (req, res) => {
  try {
    const path = staticFile(root, assetPath(req.url, basePath));
    const body = await readFile(path);
    requests.push(req.url);
    res
      .writeHead(200, {
        'Content-Type':
          contentType[extname(path)] ?? 'application/octet-stream',
      })
      .end(body);
  } catch {
    res.writeHead(404).end();
  }
});
let browser;
try {
  await new Promise((ready) => server.listen(0, '127.0.0.1', ready));
  const base = `http://127.0.0.1:${server.address().port}${basePath}`;
  browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || '/usr/bin/chromium',
  });
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 },
    reducedMotion: 'reduce',
  });
  await context.route('https://**/*', (route) => route.abort());
  await context.addInitScript(
    ({ key, initial }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, initial);
      window.completedLines = [];
      document.addEventListener(
        'ended',
        (event) => {
          const audio = event.target;
          if (audio.matches('.scene-listening > audio'))
            window.completedLines.push({
              path: new URL(audio.currentSrc).pathname,
              rate: audio.playbackRate,
            });
        },
        true,
      );
    },
    { key, initial: serializeProgress(retained) },
  );
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const scene = page.locator('.scene-listening');
  const locked = scene.locator('.scene-question button:disabled');
  const evidence = scene.getByText(/^線索句：/);
  const transcript = scene.getByRole('heading', {
    name: '原文、翻譯與逐句跟讀',
    exact: true,
  });

  for (const id of crossSentenceIds) {
    const lesson = await loadLesson(id);
    const audio = lesson.dialogue.map((line) => line.audio);
    const ready = scene.getByText(new RegExp(`完整聽完 ${audio.length} 句`));
    const play = scene.getByRole('button', {
      name: '播放完整對話',
      exact: true,
    });
    const digests = await Promise.all(
      audio.map(async (path) =>
        createHash('sha256')
          .update(await readFile(resolve(root, path)))
          .digest('hex'),
      ),
    );

    async function listenAndAnswer(attempts) {
      await ready.waitFor();
      assert.equal(await locked.count(), 3);
      await page.evaluate(() => {
        window.completedLines = [];
      });
      await play.click();
      await scene.getByText(/已完整聽過/).waitFor({ timeout: 110000 });
      assert.deepEqual(
        await page.evaluate(() => window.completedLines),
        audio.map((path) => ({ path: basePath + path, rate: 1 })),
      );
      for (const question of lesson.scene.questions) {
        assert.equal(await evidence.count(), 0);
        assert.equal(await transcript.count(), 0);
        await scene
          .locator('.scene-question')
          .getByRole('button', {
            name: question.options[question.answer],
            exact: true,
          })
          .click();
      }
      await transcript.waitFor();
      assert.deepEqual(
        await evidence.allTextContents(),
        lesson.scene.questions.map(
          (q) => '線索句：' + q.evidenceLines.join('、'),
        ),
      );
      const speakerLabels = await scene
        .locator('li > .muted')
        .allTextContents();
      assert.equal(speakerLabels.length, audio.length);
      assert.equal(
        new Set(speakerLabels.map((label) => label.split(' · ')[1])).size,
        2,
      );
      assert.ok((await scene.locator('li ruby').count()) > 0);
      const progress = await page.evaluate(
        (key) => JSON.parse(localStorage.getItem(key)),
        key,
      );
      assert.equal(progress.version, 3);
      assert.deepEqual(progress.dictation[oldId], retained.dictation[oldId]);
      for (const question of lesson.scene.questions) {
        const record = progress.dictation[sceneRecordId(lesson, question)];
        assert.equal(record.attempts, attempts);
        assert.equal(record.passed, true);
      }
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
    }

    await page.goto(base + '#/courses/stage-2');
    await page.locator(`a[href="#/lesson/${id}"]`).click();
    await ready.waitFor();

    // Enforce real download: media are fetched explicitly, absent from precache.
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(() =>
      Boolean(navigator.serviceWorker.controller),
    );
    assert.equal(
      await page.evaluate(
        async (urls) => {
          const pre = (await caches.keys()).filter((name) =>
            name.includes('precache'),
          );
          const snapshots = await Promise.all(
            pre.map((name) => caches.open(name)),
          );
          const hits = await Promise.all(
            snapshots.flatMap((cache) =>
              urls.map((url) => cache.match(url, { ignoreSearch: true })),
            ),
          );
          return hits.filter(Boolean).length;
        },
        audio.map((path) => base + path),
      ),
      0,
    );

    await listenAndAnswer(1);
    requests.length = 0;
    await scene.getByText('下載本課音檔供離線使用', { exact: true }).click();
    await scene
      .getByRole('button', { name: '下載本課音檔', exact: true })
      .click();
    await scene
      .getByRole('button', { name: '本課音檔已全部存好', exact: true })
      .waitFor();
    assert.deepEqual(
      requests
        .filter((url) => url.endsWith('.mp3') || url.includes('.mp3?'))
        .map((url) => assetPath(url, basePath))
        .sort(),
      [...audio].sort(),
    );
    assert.deepEqual(
      await page.evaluate(
        async ({ cache, urls }) => {
          const store = await caches.open(cache);
          return Promise.all(
            urls.map(async (url) => {
              const file = await store.match(url);
              const bytes = new Uint8Array(
                await crypto.subtle.digest('SHA-256', await file.arrayBuffer()),
              );
              return Array.from(bytes, (byte) =>
                byte.toString(16).padStart(2, '0'),
              ).join('');
            }),
          );
        },
        { cache: AUDIO_CACHE_NAME, urls: audio.map((path) => base + path) },
      ),
      digests,
    );

    await context.setOffline(true);
    const probe = page.waitForEvent('requestfailed', {
      predicate: (request) =>
        request.url().includes('uncached-cross-sentence-probe'),
    });
    await page.evaluate(() =>
      fetch('uncached-cross-sentence-probe', { cache: 'no-store' }).catch(
        () => {},
      ),
    );
    assert.equal(
      (await probe).failure().errorText,
      'net::ERR_INTERNET_DISCONNECTED',
    );
    await page.reload();
    await listenAndAnswer(2);
    await context.setOffline(false);
    assert.deepEqual(errors, []);
    console.log(
      JSON.stringify({
        id,
        lines: audio.length,
        onlineAndOffline: true,
        evidenceAfterThreeAnswers: true,
        downloadedAndHashed: audio.length,
        version: 3,
        pageErrors: errors.length,
      }),
    );
  }
} finally {
  await browser?.close();
  if (server.listening) await new Promise((done) => server.close(done));
}
