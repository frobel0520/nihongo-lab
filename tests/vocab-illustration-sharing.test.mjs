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
  assert.notEqual(image('general-listening-95:返す').src, image('stage0-day15:返す').src, 'reply and physical return must not be flattened');
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
  // T159 later gave magic recovery its own recovery picture; it must still never reuse the return-to-place image.
  assert.notEqual(image('general-listening-136:戻る')?.src, 'images/vocab/returningplace.svg');
  for (const id of ['general-listening-178:守る', 'anime-lesson-03:括る', 'anime-lesson-03:燃やす']) assert.equal(image(id), undefined, id);
  assert.equal(image('general-listening-124:燃える').src, 'images/vocab/burning.svg');
  assert.equal(image('general-listening-96:結ぶ').src, 'images/vocab/tyingbundle.svg');
});

// Published identity remains exact while newly drawn senses replace former deliberate gaps.
test('T158 keeps existing cards/maps and separates direction, reading, preservation and reference', async () => {
  assert.equal(createHash('sha256').update(JSON.stringify(VOCAB_ILLUSTRATIONS.slice(0, 2212))).digest('hex'), '1b1a8764469b4a662ef13577a36027972c11ccfa7187c72f4a058bd1d48049ab');
  const cards = await collectInventoryCards();
  const image = id => illustrationFor(cards.find(c => c.id === id));
  assert.equal(image('general-listening-53:切る').src, 'images/vocab/disconnectpower.svg');
  assert.notEqual(image('general-listening-53:切る').src, image('general-listening-39:切る').src);
  assert.equal(image('general-listening-72:届く').src, image('general-listening-131:届く').src);
  assert.notEqual(image('general-listening-72:届く').src, image('general-listening-13:届く').src);
  assert.equal(image('general-listening-155:届く'), undefined, 'message delivery is not bodily reach');
  assert.equal(image('general-listening-79:開く'), undefined, 'hiraku data list is not aku door');
  assert.equal(image('general-listening-117:開く').src, 'images/vocab/dooropens.svg');
  assert.equal(image('general-listening-83:保存').src, 'images/vocab/preservingmaterial.svg');
  assert.notEqual(image('general-listening-83:保存').src, 'images/vocab/savingdata.svg');
  assert.equal(image('general-listening-87:直す').src, 'images/vocab/correction.svg');
  assert.notEqual(image('general-listening-87:直す').src, image('general-listening-07:直す').src);
  assert.equal(image('general-listening-101:差出人').src, 'images/vocab/sender.svg');
  assert.equal(image('general-listening-101:受取人').src, 'images/vocab/addressee.svg');
  assert.equal(image('general-listening-165:指す'), undefined, 'pronoun reference is not a pointing hand');
  // T160 gave the concerned party its own picture; it must never reuse the first-person image.
  assert.notEqual(image('general-listening-149:本人')?.src, 'images/vocab/speakerself.svg', 'third-person concerned party is not I');
});

// Existing maps stay byte-identical; new shares follow context, not spelling.
test('T159 keeps published maps and separates sound, data, time and space senses', async () => {
  assert.equal(createHash('sha256').update(JSON.stringify(VOCAB_ILLUSTRATIONS.slice(0, 3184))).digest('hex'), '9cb0de2b0c1c3b937d36128ddee4dad1966264df59f5afc23088e883cdac9dcf');
  const cards = await collectInventoryCards();
  assert.equal(createHash('sha256').update(JSON.stringify(cards)).digest('hex'), '12367d472446092bb0db65bbde0131aab2a923ae90ce5e042a60267048475d20');
  const image = id => illustrationFor(cards.find(c => c.id === id));
  assert.equal(image('general-listening-74:似る').src, 'images/vocab/resembling.svg');
  assert.equal(image('general-listening-78:似る'), undefined, 'similar sounds are not similar outlines');
  assert.equal(image('general-listening-145:消える').src, 'images/vocab/vanishing.svg');
  assert.equal(image('general-listening-79:消える'), undefined, 'lost data is not a fading object');
  assert.equal(image('general-listening-121:続く'), undefined, 'footprints extending is spatial');
  assert.notEqual(image('general-listening-36:次')?.src, 'images/vocab/nextinline.svg', 'next time is not the next stop');
  assert.equal(image('general-listening-143:誘う').src, 'images/vocab/drawingaway.svg', 'luring an enemy is not an invitation');
  assert.equal(image('general-listening-126:戻す').src, 'images/vocab/recovery.svg');
  assert.equal(image('stage0-day22:ペン').src, 'images/vocab/fountainpen.svg');
  assert.equal(image('general-listening-77:注意').src, 'images/vocab/attractattention.svg');
  assert.notEqual(image('general-listening-77:注意').src, image('general-listening-53:注意').src);
  assert.equal(image('general-listening-79:開く'), undefined);
});

// Whole-sentence game cards share only when the main meaning matches; counters and time senses stay separate.
test('T160 keeps published maps and separates counters, time direction and game speech acts', async () => {
  assert.equal(createHash('sha256').update(JSON.stringify(VOCAB_ILLUSTRATIONS.slice(0, 4247))).digest('hex'), '5ebdb1a3ac7fe82910d341e050bb56a5a650a5835cd10f3fc4865653c49dab1d');
  const cards = await collectInventoryCards();
  assert.equal(createHash('sha256').update(JSON.stringify(cards)).digest('hex'), '12367d472446092bb0db65bbde0131aab2a923ae90ce5e042a60267048475d20');
  const image = id => illustrationFor(cards.find(c => c.id === id));
  const game = word => illustrationFor(cards.find(c => c.category === 'games' && c.word === word));
  assert.equal(image('general-listening-11:一枚').src, 'images/vocab/onesheet.svg');
  assert.equal(image('general-listening-28:一枚'), undefined, 'coins are not sheets');
  assert.equal(image('general-listening-124:一本'), undefined, 'a torch is not a bottle');
  assert.equal(image('general-listening-56:発表'), undefined, 'giving a talk is not posting results');
  assert.equal(image('general-listening-36:次').src, 'images/vocab/nexttime.svg');
  assert.notEqual(image('general-listening-36:次').src, image('stage0-day14:次').src, 'next time is not the next stop');
  assert.equal(image('general-listening-94:止まる').src, 'images/vocab/haltmachine.svg');
  assert.notEqual(image('stage0-day11:先月').src, image('stage0-day11:来月').src);
  assert.equal(game('少し体を動かすとするか。').src, 'images/vocab/warmingup.svg');
  assert.equal(game('いち、に、準備運動終わり！大丈夫よ、後で新しいの買ってあげるから。'), undefined, 'mixed-meaning line stays deferred');
  assert.equal(game('お出かけ？それとも…試合？'), undefined);
  assert.equal(game('来るなッ！').src, 'images/vocab/keepaway.svg');
});
