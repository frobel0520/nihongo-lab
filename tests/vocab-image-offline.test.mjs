import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash, webcrypto } from 'node:crypto';
import vm from 'node:vm';
import { VOCAB_ILLUSTRATIONS } from '../lib/vocab-illustrations.mjs';
import { downloadMissing, downloadUrl } from '../lib/offline.mjs';
import { imageCachePolicy } from '../lib/image-cache-policy.mjs';
import {
  IMAGE_BROWSE_CACHE_NAME,
  IMAGE_BROWSE_LIMIT,
  IMAGE_CACHE_NAME,
  IMAGE_ROUTE_PATTERN,
  expandManifest,
  imageCacheStatus,
  removableImageUrls,
  versionedSrc,
} from '../lib/vocab-image-offline.mjs';
import { buildVocabImageManifestRows } from '../scripts/vocab-image-manifest.mjs';

const origin = 'https://example.com/nihongo-lab/';
const toUrl = (src) => origin + src;

/** Minimal Cache Storage double with insertion-ordered keys, like the browser. */
function fakeCaches() {
  const stores = new Map();
  const open = async (name) => {
    if (!stores.has(name)) {
      const entries = new Map();
      stores.set(name, {
        entries,
        async match(request) { return entries.get(typeof request === 'string' ? request : request.url)?.clone(); },
        async put(request, response) { const key = typeof request === 'string' ? request : request.url; entries.delete(key); entries.set(key, response); },
        async keys() { return [...entries.keys()].map((url) => ({ url })); },
        async delete(request) { return entries.delete(typeof request === 'string' ? request : request.url); },
      });
    }
    return stores.get(name);
  };
  return { stores, open, async keys() { return [...stores.keys()]; } };
}
const svg = (body = '<svg/>') => new Response(body, { status: 200, headers: { 'content-type': 'image/svg+xml' } });

test('the image manifest lists every mapped SVG exactly once with its real content version', async () => {
  const rows = await buildVocabImageManifestRows();
  const manifest = expandManifest(rows);
  const mapped = new Set(VOCAB_ILLUSTRATIONS.map((image) => image.src));
  assert.deepEqual(new Set(manifest.map((image) => image.src)), mapped);
  assert.equal(manifest.length, mapped.size);
  for (const image of manifest.slice(0, 50)) {
    const bytes = readFileSync(new URL('../public/' + image.src, import.meta.url));
    assert.equal(image.bytes, bytes.length);
    assert.equal(image.v, createHash('sha256').update(bytes).digest('hex').slice(0, 12));
  }
});

test('only versioned image URLs use the worker route; explicit downloads bypass it', () => {
  const url = toUrl(versionedSrc({ src: 'images/vocab/onesheet.svg', v: '0123456789ab', bytes: 1 }));
  assert.ok(IMAGE_ROUTE_PATTERN.test(url));
  assert.ok(!IMAGE_ROUTE_PATTERN.test(downloadUrl(url)));
  assert.ok(!IMAGE_ROUTE_PATTERN.test(toUrl('images/vocab/onesheet.svg')));
  assert.ok(!IMAGE_ROUTE_PATTERN.test(toUrl('game-portraits/a.png')));
});

test('status counts downloaded, pending and revised images; old versions stay until the new one is saved', () => {
  const manifest = [
    { src: 'images/vocab/a.svg', v: 'aaaaaaaaaaaa', bytes: 100 },
    { src: 'images/vocab/b.svg', v: 'bbbbbbbbbbbb', bytes: 200 },
    { src: 'images/vocab/c.svg', v: 'cccccccccccc', bytes: 300 },
  ];
  const cached = [
    toUrl('images/vocab/a.svg?v=aaaaaaaaaaaa'),
    toUrl('images/vocab/b.svg?v=000000000000'),
    toUrl('images/vocab/gone.svg?v=111111111111'),
  ];
  const status = imageCacheStatus(manifest, cached, toUrl);
  assert.deepEqual(
    { ...status, missing: status.missing.map((m) => m.src) },
    { total: 3, totalBytes: 600, downloaded: 1, downloadedBytes: 100, pending: 2, pendingBytes: 500, updates: 1, missing: ['images/vocab/b.svg', 'images/vocab/c.svg'] },
  );
  assert.deepEqual(removableImageUrls(manifest, cached, toUrl), [toUrl('images/vocab/gone.svg?v=111111111111')]);
  const afterUpdate = [...cached, toUrl('images/vocab/b.svg?v=bbbbbbbbbbbb')];
  assert.deepEqual(removableImageUrls(manifest, afterUpdate, toUrl).sort(), [
    toUrl('images/vocab/b.svg?v=000000000000'),
    toUrl('images/vocab/gone.svg?v=111111111111'),
  ]);
});

test('downloads skip saved items, retry transient failures, never retry a full disk, and resume after abort', async () => {
  const stored = new Set(['a']);
  const failures = { b: 2, c: 5 };
  const calls = [];
  const store = {
    async has(item) { return stored.has(item); },
    async save(item) {
      calls.push(item);
      if (item === 'q') throw new DOMException('full', 'QuotaExceededError');
      if (failures[item]-- > 0) throw new Error('HTTP 503');
      stored.add(item);
    },
  };
  const waits = [];
  const result = await downloadMissing(['a', 'b', 'c', 'q'], store, { retries: 2, wait: async (n) => { waits.push(n); } });
  assert.equal(result.skipped, 1);
  assert.equal(result.downloaded, 1);
  assert.deepEqual(result.failed.map((f) => f.path).sort(), ['c', 'q']);
  assert.match(result.failed.find((f) => f.path === 'q').message, /儲存空間不足/);
  assert.equal(calls.filter((c) => c === 'q').length, 1, 'quota errors are not retried');
  assert.equal(calls.filter((c) => c === 'c').length, 3, 'one try plus two retries');
  assert.ok(!calls.includes('a'));
  // A rerun only fetches what is still missing.
  failures.c = 0;
  const rerun = await downloadMissing(['a', 'b', 'c'], store, { retries: 2, wait: async () => {} });
  assert.deepEqual({ skipped: rerun.skipped, downloaded: rerun.downloaded, failed: rerun.failed.length }, { skipped: 2, downloaded: 1, failed: 0 });

  const controller = new AbortController();
  const slow = new Set();
  const partial = await downloadMissing(['x', 'y', 'z'], {
    async has(i) { return slow.has(i); },
    async save(i) { slow.add(i); controller.abort(); },
  }, { concurrency: 1, signal: controller.signal });
  assert.equal(partial.downloaded, 1);
  const resumed = await downloadMissing(['x', 'y', 'z'], { async has(i) { return slow.has(i); }, async save(i) { slow.add(i); } });
  assert.deepEqual({ skipped: resumed.skipped, downloaded: resumed.downloaded }, { skipped: 1, downloaded: 2 });
});

test('a save that does not land in the real cache is a failure, not a success', async () => {
  const result = await downloadMissing(['a'], { async has() { return false; }, async save() {} }, { notRetainedMessage: 'not kept' });
  assert.deepEqual(result.failed, [{ path: 'a', message: 'not kept' }]);
});

test('worker policy: explicit downloads are read, browsing fills only the bounded browse cache', async () => {
  const source = imageCachePolicy.cachedResponseWillBeUsed.toString() + imageCachePolicy.fetchDidSucceed.toString();
  assert.match(source, new RegExp(`'${IMAGE_BROWSE_CACHE_NAME}'`));
  assert.match(source, new RegExp(`length - ${IMAGE_BROWSE_LIMIT}\\)`));
  assert.equal(IMAGE_CACHE_NAME, 'vocab-images-v1');
  const caches = fakeCaches();
  globalThis.caches = caches;
  try {
    const explicit = svg('<svg>explicit</svg>');
    assert.equal(await imageCachePolicy.cachedResponseWillBeUsed({ cachedResponse: explicit, request: { url: toUrl('x') } }), explicit);
    assert.equal(await imageCachePolicy.cacheWillUpdate({ response: svg() }), null);
    for (let i = 0; i < IMAGE_BROWSE_LIMIT + 5; i++) {
      await imageCachePolicy.fetchDidSucceed({ request: { url: toUrl(`images/vocab/n${i}.svg?v=000000000000`) }, response: svg() });
    }
    const browse = await caches.open(IMAGE_BROWSE_CACHE_NAME);
    const keys = (await browse.keys()).map((k) => k.url);
    assert.equal(keys.length, IMAGE_BROWSE_LIMIT);
    assert.equal(keys[0], toUrl('images/vocab/n5.svg?v=000000000000'), 'oldest browse entries are trimmed first');
    assert.ok(!caches.stores.has(IMAGE_CACHE_NAME), 'browsing never writes the explicit cache');
    const fromBrowse = await imageCachePolicy.cachedResponseWillBeUsed({ cachedResponse: undefined, request: { url: keys.at(-1) } });
    assert.equal(fromBrowse.status, 200);
    const html = new Response('<html>', { status: 200, headers: { 'content-type': 'text/html' } });
    await imageCachePolicy.fetchDidSucceed({ request: { url: toUrl('images/vocab/portal.svg?v=000000000000') }, response: html });
    assert.equal(await browse.match(toUrl('images/vocab/portal.svg?v=000000000000')), undefined);
    assert.equal(await imageCachePolicy.cachedResponseWillBeUsed({ cachedResponse: html, request: { url: toUrl('images/vocab/none.svg?v=1') } }), null);
  } finally {
    delete globalThis.caches;
  }
});

test('installing worker copies precached SVGs into the retained cache by content version, idempotently', async () => {
  const script = readFileSync(new URL('../public/sw-image-migration.js', import.meta.url), 'utf8');
  const caches = fakeCaches();
  const precache = await caches.open('workbox-precache-v2-' + origin);
  const body = '<svg viewBox="0 0 224 168"/>';
  const version = createHash('sha256').update(body).digest('hex').slice(0, 12);
  await precache.put(origin + 'images/vocab/onesheet.svg?__WB_REVISION__=abc', svg(body));
  await precache.put(origin + 'images/vocab/broken.svg?__WB_REVISION__=abc', new Response('x', { status: 404 }));
  await precache.put(origin + 'assets/index.js?__WB_REVISION__=abc', new Response('js', { headers: { 'content-type': 'text/javascript' } }));
  await (await caches.open('workbox-precache-v2-https://example.com/other/')).put('https://example.com/other/images/vocab/foreign.svg', svg());
  let install;
  vm.runInNewContext(script, {
    self: { registration: { scope: origin }, addEventListener(type, fn) { if (type === 'install') install = fn; } },
    caches, crypto: webcrypto, URL, Response, Uint8Array,
  });
  const run = async () => { let done; install({ waitUntil: (p) => { done = p; } }); await done; };
  await run();
  await run();
  const retained = await caches.open(IMAGE_CACHE_NAME);
  assert.deepEqual((await retained.keys()).map((k) => k.url), [origin + 'images/vocab/onesheet.svg?v=' + version]);
  assert.equal(await (await retained.match(origin + 'images/vocab/onesheet.svg?v=' + version)).text(), body);
  assert.equal((await precache.keys()).length, 3, 'migration never deletes from the precache itself');

  // A storage failure must not reject the install.
  const failing = { ...caches, async keys() { throw new Error('unavailable'); } };
  let failingInstall;
  vm.runInNewContext(script, { self: { registration: { scope: origin }, addEventListener(type, fn) { failingInstall = fn; } }, caches: failing, crypto: webcrypto, URL, Response, Uint8Array });
  let pending;
  failingInstall({ waitUntil: (p) => { pending = p; } });
  await pending;
});
