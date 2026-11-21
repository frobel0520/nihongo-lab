// 用 50ec9ce1 舊版及候選兩個正式路徑 build，測同網址舊快取。
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { chromium } from 'playwright-core';
import { assetPath, staticFile } from './helpers/static-file.mjs';

const [oldDist, newDist, report] = process.argv.slice(2);
assert.ok(
  oldDist && newDist,
  'usage: node tests/audio-update-browser.mjs OLD_DIST NEW_DIST [REPORT]',
);
const samples = [
  'audio/stage-1/general-listening-01/vocab-54e2e2c846.mp3',
  'audio/stage-1/general-listening-01/vocab-c31edf4a0d.mp3',
  'audio/stage-1/general-listening-01/vocab-c967b91444.mp3',
  'audio/games/er/gram-415bb76b90-fankit-v1.mp3',
];
const [stage1, stage2, , unchanged] = samples;
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const oldBytes = await Promise.all(
  samples.map((p) => readFile(resolve(oldDist, p))),
);
const newBytes = await Promise.all(
  samples.map((p) => readFile(resolve(newDist, p))),
);
assert.deepEqual(
  oldBytes.map((bytes, i) => bytes.equals(newBytes[i])),
  [false, false, false, true],
);
let current = oldDist;
let behavior = 'normal';
const requests = [];
const server = createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://localhost');
    const path = assetPath(req.url);
    const file = staticFile(resolve(current), path);
    let bytes = await readFile(file);
    if (u.searchParams.has('offline-download')) {
      requests.push(path);
      if (current === newDist && samples.includes(path)) {
        if (u.searchParams.get('v') !== hash(bytes))
          return res.writeHead(400).end();
        if (path === stage1 && behavior === 'stale') bytes = oldBytes[0];
        if (path === stage1 && behavior === 'hold') return;
      }
    }
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader(
      'Content-Type',
      {
        '.js': 'text/javascript',
        '.html': 'text/html',
        '.css': 'text/css',
        '.mp3': 'audio/mpeg',
        '.svg': 'image/svg+xml',
      }[extname(file)] ?? 'application/octet-stream',
    );
    if (extname(file) === '.mp3') res.setHeader('Vary', 'Accept-Encoding');
    res.end(bytes);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/nihongo-lab/`;
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
});
const context = await browser.newContext({
  viewport: { width: 375, height: 667 },
});
const page = await context.newPage();
page.on('dialog', (dialog) => dialog.accept());
const cdp = await context.newCDPSession(page);
await cdp.send('Network.enable');
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
const progress = {
  version: 3,
  srs: {},
  dictation: {
    'synthetic-audio-update': {
      attempts: 1,
      passed: true,
      lastAt: '2026-11-21T00:00:00.000Z',
    },
  },
};
const data = {
  oldSHA: oldBytes.map(hash),
  newSHA: newBytes.map(hash),
  samples,
};
const hashes = () =>
  page.evaluate(async (paths) => {
    const c = await caches.open('lesson-audio-v5');
    return Promise.all(
      paths.map(async (path) => {
        const r = await c.match(new URL(path, document.baseURI), {
          ignoreVary: true,
        });
        return Array.from(
          new Uint8Array(
            await crypto.subtle.digest('SHA-256', await r.arrayBuffer()),
          ),
          (n) => n.toString(16).padStart(2, '0'),
        ).join('');
      }),
    );
  }, samples);
const updateButton = () =>
  page.getByRole('button', { name: '更新全部課程已下載音檔', exact: true });
const waitCount = () => page.getByText(/可離線播放：全部課程 4 \/ /).waitFor();
async function nativeRange(path, bytes) {
  const url = new URL(path, base).href;
  console.log('native range', path);
  const response = page.waitForResponse(
    (r) => r.url() === url && r.status() === 206,
  );
  await page.evaluate(async (src) => {
    const media = new Audio();
    media.preload = 'none';
    media.src = src;
    document.body.append(media);
    await media.play();
    media.pause();
    media.remove();
  }, url);
  const r = await response;
  const [start, end, total] = r
    .headers()
    ['content-range'].match(/\d+/g)
    .map(Number);
  assert.equal(total, bytes.length);
  assert.ok((await r.body()).equals(bytes.subarray(start, end + 1)));
  return 206;
}
try {
  await page.goto(base + '#/settings');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.waitForFunction(() => navigator.serviceWorker.controller);
  // 以舊版實際完整下載 HTTP 回應建立歷史快取，不注入新版版本標頭。
  await page.evaluate(
    async ({ paths, progress }) => {
      const cache = await caches.open('lesson-audio-v5');
      for (const path of paths) {
        const url = new URL(path, document.baseURI).href;
        const r = await fetch(url + '?offline-download=1');
        if (r.status !== 200) throw Error('歷史檔下載失敗');
        await cache.put(url, r);
      }
      localStorage.setItem('nihongo-lab:progress:v1', JSON.stringify(progress));
    },
    { paths: samples, progress },
  );
  assert.deepEqual(await hashes(), oldBytes.map(hash));

  current = newDist;
  await page.evaluate(async () =>
    (await navigator.serviceWorker.getRegistration()).update(),
  );
  const approve = page.getByRole('button', {
    name: '更新並重新載入',
    exact: true,
  });
  await approve.waitFor();
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    approve.click(),
  ]);
  await waitCount();
  await updateButton().waitFor();
  await page.getByText(/有新版可下載：全部課程 3/).waitFor();
  assert.deepEqual(await hashes(), oldBytes.map(hash));
  data.beforeUpdate = await nativeRange(stage2, oldBytes[1]);

  behavior = 'stale';
  requests.length = 0;
  await updateButton().click();
  await page.getByText(/完成：新存 2 個，失敗 1 個.*版本驗證失敗/).waitFor();
  assert.deepEqual([...requests].sort(), samples.slice(0, 3).sort());
  data.staleAttempt = [...requests];
  assert.deepEqual(await hashes(), [
    hash(oldBytes[0]),
    ...newBytes.slice(1).map(hash),
  ]);

  behavior = 'hold';
  requests.length = 0;
  await Promise.all([
    page.waitForRequest(
      (r) => r.url().includes(stage1) && r.url().includes('offline-download'),
    ),
    updateButton().click(),
  ]);
  await page.getByRole('button', { name: '取消音檔下載', exact: true }).click();
  await page.getByText(/已取消音檔下載/).waitFor();
  assert.deepEqual(requests, [stage1]);
  assert.equal((await hashes())[0], hash(oldBytes[0]));
  data.cancelledStillPlays = await nativeRange(stage1, oldBytes[0]);

  behavior = 'normal';
  requests.length = 0;
  await page.evaluate((path) => {
    const put = Cache.prototype.put;
    Cache.prototype.put = function (key, value) {
      if (String(key).endsWith(path)) {
        Cache.prototype.put = put;
        throw new DOMException('synthetic storage full', 'QuotaExceededError');
      }
      return put.call(this, key, value);
    };
  }, stage1);
  await updateButton().click();
  await page.getByText(/儲存空間不足，下載已暫停/).waitFor();
  assert.deepEqual(requests, [stage1]);
  assert.equal((await hashes())[0], hash(oldBytes[0]));
  data.quotaPreserved = true;

  requests.length = 0;
  await updateButton().click();
  await page.getByText(/完成：新存 1 個，失敗 0 個/).waitFor();
  await updateButton().waitFor({ state: 'hidden' });
  assert.deepEqual(requests, [stage1]);
  assert.ok(!requests.includes(unchanged));
  assert.deepEqual(await hashes(), newBytes.map(hash));
  data.resume = [...requests];

  await context.setOffline(true);
  assert.equal(
    await page.evaluate(async () => {
      try {
        await fetch('./uncached-audio-update-probe', { cache: 'no-store' });
        return false;
      } catch {
        return true;
      }
    }),
    true,
  );
  await page.reload();
  await waitCount();
  data.offline206 = [];
  for (const [i, path] of samples.entries())
    data.offline206.push(await nativeRange(path, newBytes[i]));
  assert.deepEqual(
    JSON.parse(
      await page.evaluate(() =>
        localStorage.getItem('nihongo-lab:progress:v1'),
      ),
    ),
    progress,
  );
  assert.deepEqual(errors, []);
  data.progressPreserved = true;
  if (report) await writeFile(report, JSON.stringify(data, null, 2) + '\n');
  console.log(
    'PASS legacy downloads, stale CDN, cancel, quota, resume, four offline native 206 and progress',
  );
} finally {
  await browser.close();
  server.closeAllConnections();
  server.close();
}
