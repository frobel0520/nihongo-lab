import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';

test('a failed download cleans dirty data but preserves a parallel valid download or quota-failed replacement', async (t) => {
  const server = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
  t.after(() => server.close());
  const { createAudioStore } = await server.ssrLoadModule(
    '/app/lib/offlineAudio.ts',
  );
  const originalFetch = globalThis.fetch,
    originalCaches = globalThis.caches;
  t.after(() => {
    globalThis.fetch = originalFetch;
    if (originalCaches === undefined) delete globalThis.caches;
    else globalThis.caches = originalCaches;
  });
  const path = 'audio/stage-1/general-listening-01/vocab-c31edf4a0d.mp3';
  const bytes = await readFile(new URL('../public/' + path, import.meta.url));
  const audio = () =>
    new Response(bytes, { headers: { 'content-type': 'audio/mpeg' } });
  let cached = audio(),
    deleted = 0,
    quota = false,
    network = () => new Response('<html>not audio</html>');
  globalThis.caches = {
    async open() {
      return {
        async match() {
          return cached?.clone();
        },
        async delete() {
          deleted++;
          cached = undefined;
          return true;
        },
        async put(_url, response) {
          if (quota) throw new Error('QuotaExceededError');
          cached = response.clone();
        },
      };
    },
  };
  globalThis.fetch = async () => network();
  const store = createAudioStore();
  await assert.rejects(store.save(path), /不是音檔/);
  assert.equal(deleted, 0);
  assert.equal(await store.has(path), true);
  cached = new Response('<html>dirty</html>');
  await assert.rejects(store.save(path), /不是音檔/);
  assert.equal(deleted, 1);
  cached = new Response('older valid audio', {
    headers: { 'content-type': 'audio/mpeg' },
  });
  network = audio;
  quota = true;
  await assert.rejects(store.save(path), /QuotaExceededError/);
  assert.equal(deleted, 1);
  assert.equal(await store.has(path), true);
  assert.equal(await cached.clone().text(), 'older valid audio');
  assert.deepEqual(await store.status(path), {
    playable: true,
    outdated: true,
  });
  quota = false;
  await store.save(path);
  assert.deepEqual(await store.status(path), {
    playable: true,
    outdated: false,
  });
});
