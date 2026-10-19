import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

test('a failed download cleans dirty data but preserves a parallel valid download or quota-failed replacement', async (t) => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  t.after(() => server.close());
  const { createAudioStore } = await server.ssrLoadModule('/app/lib/offlineAudio.ts');
  const originalFetch = globalThis.fetch, originalCaches = globalThis.caches;
  t.after(() => { globalThis.fetch = originalFetch; if (originalCaches === undefined) delete globalThis.caches; else globalThis.caches = originalCaches; });
  const audio = () => new Response('synthetic audio', { headers: { 'content-type': 'audio/mpeg' } });
  let cached = audio(), deleted = 0, quota = false, network = () => new Response('<html>not audio</html>');
  globalThis.caches = { async open() { return {
    async match() { return cached?.clone(); },
    async delete() { deleted++; cached = undefined; return true; },
    async put(_url, response) { if (quota) throw new Error('QuotaExceededError'); cached = response.clone(); },
  }; } };
  globalThis.fetch = async () => network();
  const store = createAudioStore();
  await assert.rejects(store.save('audio/synthetic.mp3'), /不是音檔/);
  assert.equal(deleted, 0);
  assert.equal(await store.has('audio/synthetic.mp3'), true);
  cached = new Response('<html>dirty</html>');
  await assert.rejects(store.save('audio/synthetic.mp3'), /不是音檔/);
  assert.equal(deleted, 1);
  cached = audio();network = audio;quota = true;
  await assert.rejects(store.save('audio/synthetic.mp3'), /QuotaExceededError/);
  assert.equal(deleted, 1);
  assert.equal(await store.has('audio/synthetic.mp3'), true);
});
