// Disposable full app build, original text and generated tones, no real profile.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { extname, join } from 'node:path';
import { chromium } from 'playwright-core';
import { build } from 'vite';
import { loadLesson } from '../curriculum/lessons.mjs';
import { AUDIO_CACHE_NAME } from '../lib/offline.mjs';
import {
  emptyProgress,
  recordDictation,
  serializeProgress,
} from '../lib/progress.mjs';
import { sceneRecordId } from '../lib/scene-listening.mjs';
import { serializeCurriculumPayload } from '../scripts/serialize-curriculum.mjs';
import { crossSentenceFixture as lesson } from './fixtures/cross-sentence-scene.mjs';
import { assetPath, staticFile } from './helpers/static-file.mjs';

const basePath = '/nihongo-lab/';
const progressKey = 'nihongo-lab:progress:v1';
const paths = lesson.dialogue.map((line) => line.audio);
const oldLesson = await loadLesson(lesson.id);
const oldId = sceneRecordId(oldLesson, oldLesson.scene.questions[0]);
const retained = recordDictation(
  emptyProgress(),
  oldId,
  true,
  '2026-11-25T00:00:00.000Z',
);
const root = await mkdtemp(join(tmpdir(), 'nihongo-cross-sentence-'));
const tone = join(root, 'fixture.mp3');
const dist = join(root, 'dist');
const mime = {
  '.js': 'text/javascript',
  '.html': 'text/html',
  '.css': 'text/css',
  '.mp3': 'audio/mpeg',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
};
let server;
let browser;

try {
  execFileSync('ffmpeg', [
    '-hide_banner',
    '-loglevel',
    'error',
    '-f',
    'lavfi',
    '-i',
    'sine=frequency=440:sample_rate=44100',
    '-t',
    '1',
    tone,
  ]);
  const audio = await readFile(tone);
  const digest = createHash('sha256').update(audio).digest('hex');
  const versions = Object.fromEntries(paths.map((path) => [path, digest]));
  const replacements = new Map([
    [
      '\0virtual:nihongo-curriculum/lesson/' + lesson.id,
      serializeCurriculumPayload({ data: lesson, notes: [] }),
    ],
    ['\0virtual:audio-versions', 'export default ' + JSON.stringify(versions)],
  ]);
  const injected = new Set();
  await build({
    base: basePath,
    logLevel: 'warn',
    build: { outDir: dist },
    plugins: [
      {
        name: 'cross-sentence-test-only',
        transform(_source, id) {
          if (!replacements.has(id)) return null;
          injected.add(id);
          return replacements.get(id);
        },
      },
    ],
  });
  assert.deepEqual(injected, new Set(replacements.keys()));

  let failThirdLine = false;
  const requests = [];
  server = createServer(async (req, res) => {
    try {
      const asset = assetPath(req.url, basePath);
      if (paths.includes(asset)) {
        if (req.url.includes('?'))
          assert.match(req.url, new RegExp('&v=' + digest + '$'));
        else requests.push(asset);
        if (failThirdLine && asset === paths[2])
          return res.writeHead(404).end();
        return res.writeHead(200, { 'Content-Type': 'audio/mpeg' }).end(audio);
      }
      const file = staticFile(dist, asset);
      const data = await readFile(file);
      return res
        .writeHead(200, {
          'Content-Type': mime[extname(file)] ?? 'application/octet-stream',
        })
        .end(data);
    } catch {
      return res.writeHead(404).end();
    }
  });
  await new Promise((ready) => server.listen(0, '127.0.0.1', ready));
  const base = `http://127.0.0.1:${server.address().port}${basePath}`;
  browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || '/usr/bin/chromium',
  });
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 },
  });
  await context.route('https://**', (route) => route.abort());
  await context.addInitScript(
    ({ key, initial }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, initial);
    },
    { key: progressKey, initial: serializeProgress(retained) },
  );
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const scene = page.locator('.scene-listening');
  const player = scene.locator(':scope > audio');
  const play = scene.getByRole('button', { name: '播放完整對話', exact: true });
  const stop = scene.getByRole('button', { name: '停止對話', exact: true });
  const locked = scene.locator('.scene-question button:disabled');
  const evidence = scene.getByText(/^線索句：/);
  const transcript = scene.getByRole('heading', {
    name: '原文、翻譯與逐句跟讀',
    exact: true,
  });
  const state = scene.locator('.scene-status');
  const saved = () =>
    page.evaluate((key) => JSON.parse(localStorage.getItem(key)), progressKey);
  const waitForPlayback = () =>
    page.waitForFunction(() => {
      const audio = document.querySelector('.scene-listening > audio');
      return audio && audio.currentTime > 0 && !audio.paused;
    });

  await page.goto(base + '#/lesson/' + lesson.id);
  await scene.getByText(/完整聽完 9 句/).waitFor();
  assert.equal(await locked.count(), 3);
  await play.click();
  await waitForPlayback();
  await stop.click();
  assert.match(await state.textContent(), /尚未完整/);
  assert.equal(await locked.count(), 3);
  assert.equal(await player.evaluate((audio) => audio.paused), true);

  failThirdLine = true;
  await play.click();
  await scene.getByRole('alert').waitFor();
  assert.equal(await locked.count(), 3);
  assert.equal(await evidence.count(), 0);
  assert.equal(await transcript.count(), 0);
  failThirdLine = false;

  await play.click();
  await waitForPlayback();
  const activeAudio = await player.elementHandle();
  await page.getByRole('tab', { name: /對話/ }).click();
  await scene.waitFor({ state: 'detached' });
  assert.equal(await activeAudio.evaluate((audio) => audio.paused), true);
  await activeAudio.dispose();
  await page.getByRole('tab', { name: /聽解/ }).click();
  await locked.first().waitFor();
  assert.equal(await locked.count(), 3);

  async function listenAndAnswer(expectedAttempts) {
    await play.click();
    await state.getByText(/已完整聽過/).waitFor({ timeout: 30000 });
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
        (question) => '線索句：' + question.evidenceLines.join('、'),
      ),
    );
    assert.equal(await scene.locator('li > .muted').count(), 9);
    const progress = await saved();
    assert.equal(progress.version, 3);
    assert.deepEqual(progress.dictation[oldId], retained.dictation[oldId]);
    for (const question of lesson.scene.questions) {
      const record = progress.dictation[sceneRecordId(lesson, question)];
      assert.equal(record.attempts, expectedAttempts);
      assert.equal(record.passed, true);
    }
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
  }

  requests.length = 0;
  await listenAndAnswer(1);
  assert.deepEqual([...new Set(requests)], paths);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await scene.getByText('下載本課音檔供離線使用', { exact: true }).click();
  await scene
    .getByRole('button', { name: '下載本課音檔', exact: true })
    .click();
  await scene
    .getByRole('button', { name: '本課音檔已全部存好', exact: true })
    .waitFor({ timeout: 30000 });
  assert.equal(
    await page.evaluate(
      async ({ cache, urls, digest }) => {
        const stored = await caches.open(cache);
        const files = await Promise.all(urls.map((url) => stored.match(url)));
        return files.every(
          (file) => file?.headers.get('X-Nihongo-Audio-SHA256') === digest,
        );
      },
      {
        cache: AUDIO_CACHE_NAME,
        urls: paths.map((path) => base + path),
        digest,
      },
    ),
    true,
  );

  await context.setOffline(true);
  assert.equal(
    await page.evaluate(async () => {
      try {
        await fetch('uncached-probe', { cache: 'no-store' });
        return false;
      } catch {
        return true;
      }
    }),
    true,
  );
  await page.reload();
  await locked.first().waitFor();
  await listenAndAnswer(2);
  assert.deepEqual(errors, []);
  console.log(
    JSON.stringify({
      lines: paths.length,
      onlineAndOffline: true,
      stopAndFailureLock: true,
      sectionExitStops: true,
      evidenceAfterAnswers: true,
      verifiedDownloads: paths.length,
      legacyProgressPreserved: true,
      pageErrors: errors.length,
    }),
  );
} finally {
  await browser?.close();
  if (server) await new Promise((done) => server.close(done));
  await rm(root, { recursive: true, force: true });
}
