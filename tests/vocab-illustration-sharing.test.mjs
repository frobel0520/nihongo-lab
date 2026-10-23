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
  assert.notEqual(image('general-listening-168:冷たい').src, image('stage0-day12:冷たい').src, 'emotional coldness is not cold water');
  assert.equal(image('general-listening-95:返す'), undefined, 'reply and physical return must not be flattened');
  assert.equal(image('general-listening-05:少し'), undefined, 'partial comprehension has not been approved for the quantity picture');
  assert.equal(image('general-listening-80:短い'), undefined, 'a brief role is not the approved physical length example');
  assert.equal(image('general-listening-38:もう一度').src, 'images/vocab/again.svg', 'explicitly approved repetition may now share');
});

// Different readings, physical/metaphorical senses and movement direction are the sharing risks.
test('T156 preserves published records and rejects homographs and incompatible micro-scenes', async () => {
  assert.equal(createHash('sha256').update(JSON.stringify(VOCAB_ILLUSTRATIONS.slice(0, 179))).digest('hex'), '78f0569fc4e8afc57a30126ca0cc699fa59ef40128c9e9871172e2b0c9dcb76e');
  const cards = await collectInventoryCards();
  const image = id => illustrationFor(cards.find(c => c.id === id));
  for (const id of ['general-listening-89:入れる', 'general-listening-107:入れる', 'general-listening-146:鍵', 'general-listening-105:つける']) assert.equal(image(id), undefined, id);
  assert.equal(image('general-listening-21:空').src, 'images/vocab/sky.svg');
  assert.equal(image('general-listening-97:入れる').src, 'images/vocab/puttingin.svg');
  assert.equal(image('general-listening-130:守る').src, 'images/vocab/protecting.svg');
  assert.equal(image('general-listening-12:貸す').src, 'images/vocab/lending.svg');
  assert.equal(image('general-listening-12:借りる').src, 'images/vocab/borrowing.svg');
  const christmas = cards.filter(c => c.category === 'games' && c.word === 'メリークリスマス！');
  assert.equal(christmas.length, 2);
  assert.ok(christmas.every(c => illustrationFor(c)?.src === 'images/vocab/christmasgreeting.svg'));
});

// New pictures address actual semantic gaps; old record and card contracts stay immutable.
test('T157 separates newly covered homographs and keeps all published cards and maps', async () => {
  assert.equal(createHash('sha256').update(JSON.stringify(VOCAB_ILLUSTRATIONS.slice(0, 1185))).digest('hex'), '4a252552dccc9ef1c9941e6e180ee3ea3a361852b442b04606c594e33aa962a7');
  const cards = await collectInventoryCards();
  assert.equal(createHash('sha256').update(JSON.stringify(cards)).digest('hex'), '12367d472446092bb0db65bbde0131aab2a923ae90ce5e042a60267048475d20');
  const image = id => illustrationFor(cards.find(c => c.id === id));
  for (const [id, expected] of [
    ['general-listening-97:空', 'empty'],
    ['general-listening-49:守る', 'followingrules'],
    ['general-listening-59:聞く', 'askingquestion'],
    ['general-listening-39:切る', 'hangingup'],
    ['general-listening-129:磨く', 'polishshield'],
    ['general-listening-42:高い', 'expensive'],
  ]) assert.equal(image(id).src, `images/vocab/${expected}.svg`);
  for (const id of ['general-listening-95:返す', 'general-listening-72:届く', 'general-listening-131:届く', 'general-listening-136:戻る', 'general-listening-87:直す', 'general-listening-178:守る', 'anime-lesson-03:括る', 'anime-lesson-03:燃やす']) assert.equal(image(id), undefined, id);
  assert.equal(image('general-listening-124:燃える').src, 'images/vocab/burning.svg');
  assert.equal(image('general-listening-96:結ぶ').src, 'images/vocab/tyingbundle.svg');
});
