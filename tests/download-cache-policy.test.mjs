import { test } from 'node:test';
import assert from 'node:assert/strict';
import { downloadCachePolicy } from '../lib/download-cache-policy.mjs';
import { downloadAudio } from '../lib/offline.mjs';

test('retained cache serves only complete audio; playback cannot add any response', async () => {
  const audio = new Response('audio', { headers: { 'content-type': 'audio/mpeg' } });
  assert.equal(await downloadCachePolicy.cachedResponseWillBeUsed({ cachedResponse: audio }), audio);
  for (const cachedResponse of [undefined, new Response('<html>'), new Response('partial', { status: 206, headers: { 'content-type': 'audio/mpeg' } })])
    assert.equal(await downloadCachePolicy.cachedResponseWillBeUsed({ cachedResponse }), null);
  assert.equal(await downloadCachePolicy.cacheWillUpdate({ response: audio }), null);
});

test('download success requires a retained file; lost writes and quota failures remain retryable', async () => {
  const retained = new Set();
  let fail = true;
  const store = {
    async has(path) { return retained.has(path); },
    async save(path) {
      if (fail && path === 'quota.mp3') throw new Error('QuotaExceededError');
      if (fail && path === 'lost.mp3') return;
      retained.add(path);
    },
  };
  const paths = ['ok.mp3', 'lost.mp3', 'quota.mp3'];
  const first = await downloadAudio(paths, store);
  assert.equal(first.downloaded, 1);
  assert.deepEqual(first.failed.map(f => f.path).sort(), ['lost.mp3', 'quota.mp3']);
  fail = false;
  const retry = await downloadAudio(paths, store);
  assert.deepEqual(retry, { total: 3, skipped: 1, downloaded: 2, failed: [] });
});
