import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const script = readFileSync(new URL('../public/sw-update-control.js', import.meta.url), 'utf8');
const scope = 'https://example.com/nihongo-lab/';
async function request(pages, fail = false) {
  let listener, skipped = 0, done;
  const replies = [];
  vm.runInNewContext(script, { self: {
    registration: { scope },
    clients: { async matchAll() { if (fail) throw Error('unavailable'); return pages; } },
    addEventListener(type, fn) { if (type === 'message') listener = fn; },
    async skipWaiting() { skipped++; },
  } });
  listener({ data: { type: 'NIHONGO_APPLY_UPDATE' }, source: { id: 'consenting' }, ports: [{ postMessage: value => replies.push(value.status) }], waitUntil: promise => { done = promise; } });
  await done;
  return { skipped, replies };
}
test('waiting worker requires the consenting page and refuses other scoped pages', async () => {
  const page = { id: 'consenting', url: scope };
  assert.deepEqual(await request([page, { id: 'other', url: scope + '#/dictation' }]), { skipped: 0, replies: ['other-pages'] });
  assert.deepEqual(await request([page, { id: 'unrelated', url: 'https://example.com/another-app/' }]), { skipped: 1, replies: ['accepted'] });
  assert.deepEqual(await request([]), { skipped: 0, replies: ['other-pages'] });
  assert.deepEqual(await request([page], true), { skipped: 0, replies: ['failed'] });
});
