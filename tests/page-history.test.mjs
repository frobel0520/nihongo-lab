import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PAGE_HISTORY_LIMIT,
  rememberPageEntry,
  pageReturnDelta,
} from '../lib/page-history.mjs';

test('return follows this retained lineage, not a same-hash sibling or an evicted/external entry', () => {
  const list = { id: 'list', hash: 'list', parentId: null, position: 0 };
  const child = { id: 'child', hash: 'child', parentId: 'list', position: 1 };
  const leaf = { id: 'leaf', hash: 'leaf', parentId: 'child', position: 2 };
  const sibling = { id: 'sibling', hash: 'list', parentId: null, position: 0 };
  const entries = new Map([list, child, leaf, sibling].map((e) => [e.id, e]));
  assert.equal(
    pageReturnDelta(entries, leaf, (e) => e.hash === 'list'),
    -2,
  );
  assert.equal(
    pageReturnDelta(entries, leaf, () => true),
    -1,
  );
  assert.equal(
    pageReturnDelta(entries, list, () => true),
    null,
  );
  entries.delete('list');
  assert.equal(
    pageReturnDelta(entries, leaf, (e) => e.hash === 'list'),
    null,
  );
  entries.delete('child');
  assert.equal(
    pageReturnDelta(entries, leaf, () => true),
    null,
  );
});

test('invalid or cyclic parent lineage safely falls back without looping', () => {
  const a = { id: 'a', parentId: 'b', position: 2 };
  const b = { id: 'b', parentId: 'a', position: 1 };
  assert.equal(
    pageReturnDelta(
      new Map([
        ['a', a],
        ['b', b],
      ]),
      a,
      () => false,
    ),
    null,
  );
  assert.equal(
    pageReturnDelta(new Map([['b', { ...b, position: 3 }]]), a, () => true),
    null,
  );
});

test('navigation retention is bounded and refreshes visited entries without copying state', () => {
  const entries = new Map();
  const first = { id: 'first', values: { draft: 'retained' } };
  rememberPageEntry(entries, first);
  for (let i = 0; i < PAGE_HISTORY_LIMIT - 1; i++)
    rememberPageEntry(entries, { id: String(i), values: {} });
  rememberPageEntry(entries, first);
  rememberPageEntry(entries, { id: 'new', values: {} });
  assert.equal(entries.size, PAGE_HISTORY_LIMIT);
  assert.equal(entries.get('first'), first);
  assert.equal(entries.has('0'), false);
  for (let i = 0; i < PAGE_HISTORY_LIMIT; i++)
    rememberPageEntry(entries, { id: 'later-' + i, values: {} });
  assert.equal(entries.size, PAGE_HISTORY_LIMIT);
  assert.equal(entries.has('first'), false);
});
