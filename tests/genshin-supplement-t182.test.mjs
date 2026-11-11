import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { gameCharacterStudy, loadCategory } from '../curriculum/lessons.mjs';
import { genshinSupplementT182 } from '../curriculum/genshin-supplement-t182.mjs';
import { collectInventoryCards } from '../scripts/vocab-illustration-inventory.mjs';
import { VOCAB_ILLUSTRATIONS, illustrationFor } from '../lib/vocab-illustrations.mjs';
import { gameListeningQuestion, gameRecordId } from '../lib/game-study.mjs';
import { beforeT182GameCharacterStudy, beforeT182Cards, beforeT182Prosody, t182LineIds } from './helpers/before-t182-supplement.mjs';

const hash = (x) => createHash('sha256').update(JSON.stringify(x)).digest('hex');
const expectedCounts = { varesa: 16, durin: 12, varka: 5, escoffier: 9, flins: 9 };

test('T182 leaves the T181 corpus, cards, mappings and reading overrides unchanged', async () => {
  assert.equal(hash(beforeT182GameCharacterStudy), '60e0247b7cc68361ecfd64ccad1c5f0c24e5c958c5e9f411f3f6fca48e78077d');
  assert.equal(hash(beforeT182Cards(await collectInventoryCards())), 'cfcae14d9d5c065f1ca31e035ffb8420c10302c2b03f549aeebfea01026b9102');
  assert.equal(hash(VOCAB_ILLUSTRATIONS), 'c2f4bab387213a6ca2b68ef8d043aa96d7164206d5d4206d70b45f2ab01a23de');
  assert.equal(hash(beforeT182Prosody), 'a8abc527a4e55e6215c53340ef82d57170fdd1be80dd342d88a615b4f36b8292');
});

test('T182 community-table lines keep one source row each and reach listening, cards and audio without illustrations', async () => {
  const game = gameCharacterStudy.find((g) => g.id === 'genshin');
  const catalog = await loadCategory('games');
  assert.deepEqual(Object.fromEntries(genshinSupplementT182.map((c) => [c.id, c.lines.length])), expectedCounts);
  assert.equal(t182LineIds.size, 51);
  for (const source of genshinSupplementT182) {
    const character = game.characters.find((c) => c.id === source.id);
    assert.equal(character.voice, source.voice);
    assert.match(source.referenceUrl, /^https:\/\/wiki\.biligame\.com\/ys\//);
    assert.match(source.sourceSha256, /^[0-9a-f]{64}$/);
    for (const row of source.lines) {
      assert.match(row.key, /^(join|skill|burst)-table-\d+-[01]$/);
      const line = character.lines.find((l) => l.id === `genshin:${source.id}:${row.key}`);
      assert.ok(line, row.key);
      assert.equal(line.sourceType, 'community-wiki');
      assert.equal(line.voice, character.voice);
      assert.equal(line.ruby.replace(/\{([^|}]+)\|[^}]+\}/g, '$1'), line.jp);
      assert.equal(line.reading.replace(/[\s　]/g, '').length > 0, true);
      assert.doesNotMatch(line.jp, /^[ふはっぁあ…—！？。ーッ]+$/, '純喊聲不收');
      const question = gameListeningQuestion(line);
      assert.equal(question.options[question.answer], line.zh);
      assert.equal(new Set(question.options).size, 3);
      const card = catalog.cards.find((c) => c.id === 'game-card:' + gameRecordId(line));
      assert.ok(card);
      assert.equal(illustrationFor(card), undefined);
      assert.ok(catalog.sentences.some((s) => s.audio === line.audio));
      assert.ok((await readFile(new URL('../public/' + line.audio, import.meta.url))).length > 1000);
    }
  }
});
