import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { gameCharacterStudy, loadCategory } from '../curriculum/lessons.mjs';
import { genshinActionExpansionThirteenth } from '../curriculum/genshin-action-expansion-thirteenth.mjs';
import { collectInventoryCards } from '../scripts/vocab-illustration-inventory.mjs';
import { VOCAB_ILLUSTRATIONS, illustrationFor } from '../lib/vocab-illustrations.mjs';
import { gameListeningQuestion, gameRecordId } from '../lib/game-study.mjs';
import { AUDIO_PROSODY } from '../curriculum/audio-prosody.mjs';
import { beforeT187GameCharacterStudy, beforeT187Cards, beforeT187Prosody, t187LineIds } from './helpers/before-t187-supplement.mjs';

const hash = (x) => createHash('sha256').update(JSON.stringify(x)).digest('hex');

test('T187 leaves the published T185 corpus, cards, mappings and reading overrides unchanged', async () => {
  assert.equal(hash(beforeT187GameCharacterStudy), '0c30c9fd50bc0de3520d6e627553d45e3c3bc8fe2006cae4ef5bc07a08b555b7');
  assert.equal(hash(beforeT187Cards(await collectInventoryCards())), 'b6c796d03efa67302bb231f3dfa58bf4062ea5b3c21aaa634863e13e0132e549');
  assert.equal(hash(VOCAB_ILLUSTRATIONS), 'c2f4bab387213a6ca2b68ef8d043aa96d7164206d5d4206d70b45f2ab01a23de');
  assert.equal(hash(beforeT187Prosody), '1c50e50ccceeab12c8ed5d7d1686de1dad10b1689a85de0705a72c9a5bd6e55c');
});

test('T187 fixed-source team-join lines keep their source identity and reach listening, cards and audio without illustrations', async () => {
  const game = gameCharacterStudy.find((g) => g.id === 'genshin');
  const catalog = await loadCategory('games');
  assert.equal(genshinActionExpansionThirteenth.length, 189);
  assert.equal(t187LineIds.size, 189);
  assert.equal(new Set(genshinActionExpansionThirteenth.map((r) => r.sourceItemId)).size, 189);
  const perCharacter = new Map();
  for (const row of genshinActionExpansionThirteenth) {
    perCharacter.set(row.characterId, (perCharacter.get(row.characterId) ?? 0) + 1);
    assert.equal(row.category, '編隊加入');
    assert.equal(row.key, `join-${row.sourceItemId}`);
    assert.match(row.sourceTitle, /^チーム加入[·・][123]$/);
    assert.match(row.sourceSha256, /^[0-9a-f]{64}$/);
    assert.match(row.referenceUrl, /^https:\/\/github\.com\/theBowja\/genshin-db\/blob\/49a6544a6c6ae36089cb42fa591fc46f01de8bcf\/src\/data\/Japanese\/voiceovers\/[a-z]+\.json$/);
    assert.doesNotMatch(row.jp, /\n|（/, '雙人對話與帶註記的句子不收');
    const character = game.characters.find((c) => c.id === row.characterId);
    const line = character.lines.find((l) => l.id === `genshin:${row.characterId}:${row.key}`);
    assert.ok(line, row.key);
    assert.equal(line.voice, character.voice);
    assert.equal(line.voicelineId, row.sourceItemId);
    assert.equal(line.variant, '預設造型');
    assert.equal(line.reading.replace(/[\s　]/g, '').length > 0, true);
    const question = gameListeningQuestion(line);
    assert.equal(question.options[question.answer], line.zh);
    assert.equal(new Set(question.options).size, 3);
    const card = catalog.cards.find((c) => c.id === 'game-card:' + gameRecordId(line));
    assert.ok(card);
    assert.equal(illustrationFor(card), undefined);
    assert.ok(catalog.sentences.some((s) => s.audio === line.audio));
    assert.ok((await readFile(new URL('../public/' + line.audio, import.meta.url))).length > 1000);
  }
  assert.equal(perCharacter.size, 96);
  assert.ok([...perCharacter.values()].every((n) => n === 1 || n === 2));
  // Fischl 2 (two speakers), Yun Jin 1 (annotated) and Navia 2 (reading pending) stay out.
  for (const id of ['fischl', 'yunjin', 'navia']) assert.equal(perCharacter.get(id), 1);
  const overrides = Object.values(AUDIO_PROSODY).filter((v) => v.reason.startsWith('T187：'));
  assert.equal(overrides.length, 13);
  for (const o of overrides) assert.match(o.reason, /未經人耳或原配音聽驗/);
});
