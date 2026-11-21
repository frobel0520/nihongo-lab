import { test } from 'node:test';
import assert from 'node:assert/strict';
import { illustrationFor, VOCAB_ILLUSTRATIONS } from '../lib/vocab-illustrations.mjs';
import {
  compactIllustrations,
  createIllustrationLookup,
  illustrationContentKey,
} from '../lib/vocab-illustration-index.mjs';
import { collectInventoryCards } from '../scripts/vocab-illustration-inventory.mjs';

const rows = compactIllustrations(VOCAB_ILLUSTRATIONS);
const lookup = createIllustrationLookup(rows);
const genshin = (id) => id.startsWith('game-card:game:genshin:');

test('T196: browser index matches the authored lookup for every offered card', async () => {
  const cards = await collectInventoryCards();
  let shown = 0;
  for (const card of cards) {
    const expected = genshin(card.id) ? undefined : illustrationFor(card)?.src;
    assert.equal(lookup(card)?.src, expected, card.id);
    if (expected) shown++;
  }
  assert.ok(shown > 5000, `shown ${shown}`);
});

test('T196: a changed word, reading or translation drops the image', () => {
  const item = VOCAB_ILLUSTRATIONS.find((x) => !genshin(x.id));
  assert.equal(lookup(item)?.src, item.src);
  for (const field of ['word', 'reading', 'zh'])
    assert.equal(lookup({ ...item, [field]: item[field] + '。' }), undefined, field);
  assert.equal(lookup({ ...item, id: item.id + ':other' }), undefined);
});

test('T196: Genshin voice cards and authoring fields stay out of the browser index', () => {
  assert.equal(rows.some(([id]) => genshin(id)), false);
  assert.equal(rows.length, VOCAB_ILLUSTRATIONS.filter((x) => !genshin(x.id)).length);
  assert.ok(rows.every((r) => r.length === 3 && !r[2].includes('/')));
  assert.equal(new Set(rows.map(([id]) => id)).size, rows.length);
  assert.match(illustrationContentKey({ word: 'パン', reading: 'パン', zh: '麵包' }), /^[0-9a-z]+$/);
});
