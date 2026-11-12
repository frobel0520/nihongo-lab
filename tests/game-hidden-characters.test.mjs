import test from 'node:test';
import assert from 'node:assert/strict';
import { gameCharacterStudy } from '../curriculum/lessons.mjs';
import { curriculumPayloads, offeredDistractors } from '../scripts/curriculum-chunks.mjs';
import {
  HIDDEN_GAME_CHARACTERS,
  visibleGameStudy,
} from '../lib/game-visibility.mjs';

const authored = gameCharacterStudy.find((g) => g.id === 'genshin');
const hiddenIds = ['manekin', 'manekina'];

test('T188 keeps the two Manekin entries in authored data for historical checks', () => {
  assert.deepEqual([...HIDDEN_GAME_CHARACTERS], hiddenIds.map((id) => 'genshin:' + id));
  for (const id of hiddenIds)
    assert.equal(authored.characters.find((c) => c.id === id).lines.length, 3);
});

test('T188 browser payloads offer no Manekin character, card, question audio or roster count', () => {
  const payloads = curriculumPayloads();
  const games = payloads.get('games').data;
  const genshin = games.gameCharacterStudy.find((g) => g.id === 'genshin');
  assert.equal(genshin.characters.length, authored.characters.length - 2);
  for (const id of hiddenIds) {
    assert.equal(genshin.characters.some((c) => c.id === id), false);
    assert.equal(id in games.genshinActionCoverage, false);
    assert.equal(games.genshinSupplement.some((c) => c.id === id), false);
  }
  const lines = genshin.characters.reduce((n, c) => n + c.lines.length, 0);
  assert.equal(lines, authored.characters.reduce((n, c) => n + c.lines.length, 0) - 6);
  assert.match(genshin.scope, new RegExp(`共 ${genshin.characters.length} 筆角色條目，包含旅行者的不同版本，奇偶不列入。${genshin.characters.length} 位角色收錄 ${lines} 句`));
  const hiddenAudio = new Set(hiddenIds.flatMap((id) => authored.characters.find((c) => c.id === id).lines.map((l) => l.audio)));
  assert.equal(hiddenAudio.size, 6);
  const category = payloads.get('category/games').data;
  assert.equal(category.cards.some((c) => /^game-card:game:genshin:manekina?:/.test(c.id)), false);
  assert.equal(category.sentences.some((s) => hiddenAudio.has(s.audio)), false);
  assert.equal(payloads.get('all-audio').data.some((path) => hiddenAudio.has(path)), false);
  assert.equal(Object.keys(offeredDistractors).some((id) => id.startsWith('genshin:manekin')), false);
  assert.ok(Object.keys(offeredDistractors).length > 1000);
  for (const [key, payload] of payloads)
    assert.equal(JSON.stringify(payload.data).includes('genshin:manekin'), false, key);
});

test('T188 leaves other games and unaffected rosters untouched', () => {
  const visible = visibleGameStudy(gameCharacterStudy);
  for (const game of gameCharacterStudy)
    if (game.id !== 'genshin') assert.equal(visible.find((g) => g.id === game.id), game);
});
