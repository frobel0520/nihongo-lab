import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { gameCharacterStudy, genshinActionCoverage, loadCategory } from '../curriculum/lessons.mjs';
import { genshinActionExpansion } from '../curriculum/genshin-action-expansion.mjs';
import { gameListeningQuestion, gameRecordId } from '../lib/game-study.mjs';
import { illustrationFor } from '../lib/vocab-illustrations.mjs';
const ids = new Set(genshinActionExpansion.map(x => `genshin:${x.characterId}:${x.key}`));
test('adding independently identified action lines preserves every published game line and casting', () => {
  const old = gameCharacterStudy.map(g => ({ id:g.id, characters:g.characters.map(c => ({id:c.id,voice:c.voice,lines:c.lines.filter(l=>!ids.has(l.id))})) }));
  assert.equal(createHash('sha256').update(JSON.stringify(old)).digest('hex'), 'cd13bfe7f56a5aed0b84e521533ec389698afc3cbd3db9f70d7a88e464cef706');
});
test('each new source line reaches learning, questions, audio and its exact illustrated card', async () => {
  const catalog = await loadCategory('games');
  const genshin = gameCharacterStudy.find(g => g.id === 'genshin');
  assert.equal(ids.size, 60);
  assert.equal(new Set(genshinActionExpansion.map(x=>x.sourceItemId)).size, 60);
  for (const row of genshinActionExpansion) {
    assert.match(row.referenceUrl, /49a6544a6c6ae36089cb42fa591fc46f01de8bcf/);
    assert.equal(row.sourceSha256, genshinActionCoverage[row.characterId].sha256);
    const character = genshin.characters.find(c=>c.id === row.characterId);
    const line = character.lines.find(l=>l.id === `genshin:${row.characterId}:${row.key}`);
    assert.ok(line && ['元素技能','元素爆發'].includes(line.category));
    assert.equal(line.voice, character.voice);
    assert.notEqual(line.audioReady, false);
    const q = gameListeningQuestion(line);
    assert.equal(q.options[q.answer], line.zh);
    assert.equal(new Set(q.options).size, q.options.length);
    const card = catalog.cards.find(c=>c.id === 'game-card:' + gameRecordId(line));
    assert.ok(card && illustrationFor(card), line.id);
    // Dictation and shadowing consume this same sentence catalog.
    assert.ok(catalog.sentences.some(item=>item.audio === line.audio), line.id);
  }
});
