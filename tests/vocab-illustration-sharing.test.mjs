import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { VOCAB_ILLUSTRATIONS, illustrationFor } from '../lib/vocab-illustrations.mjs';
import { collectInventoryCards } from '../scripts/vocab-illustration-inventory.mjs';

test('sharing preserves published mappings and distinguishes meaning from spelling', async () => {
  assert.equal(createHash('sha256').update(JSON.stringify(VOCAB_ILLUSTRATIONS.slice(0, 54))).digest('hex'), '5ce53c33eb79db257d83cad4df0e84ebdf26d6ea08cb3784a80bd632ea8b696e');
  const cards = await collectInventoryCards();
  const image = id => illustrationFor(cards.find(c => c.id === id));
  assert.equal(image('general-listening-11:パン').src, image('stage0-day6:パン').src);
  assert.equal(image('general-listening-02:鍵').src, image('stage0-day7:かぎ').src);
  assert.equal(image('stage0-day23:御飯').src, image('stage0-day6:ご飯').src);
  assert.equal(image('general-listening-09:撮る').src, image('stage0-day14:撮る').src);
  assert.equal(image('general-listening-58:静か').src, image('stage0-day8:静か').src);
  assert.equal(image('general-listening-168:冷たい'), undefined, 'emotional coldness is not cold water');
  assert.equal(image('general-listening-95:返す'), undefined, 'reply and physical return must not be flattened');
  assert.equal(image('general-listening-05:少し'), undefined, 'partial comprehension has not been approved for the quantity picture');
  assert.equal(image('general-listening-80:短い'), undefined, 'a brief role is not the approved physical length example');
  assert.equal(image('general-listening-38:もう一度'), undefined, 'even equivalent unreviewed entries must not inherit automatically');
});
