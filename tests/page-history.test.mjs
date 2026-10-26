import assert from 'node:assert/strict';
import test from 'node:test';
import { PAGE_HISTORY_LIMIT, rememberPageEntry } from '../lib/page-history.mjs';

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
