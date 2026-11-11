import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { gameCharacterStudy, loadCategory } from '../curriculum/lessons.mjs';
import { genshinSupplementT184 } from '../curriculum/genshin-supplement-t184.mjs';
import { collectInventoryCards } from '../scripts/vocab-illustration-inventory.mjs';
import { VOCAB_ILLUSTRATIONS, illustrationFor } from '../lib/vocab-illustrations.mjs';
import { gameListeningQuestion, gameRecordId } from '../lib/game-study.mjs';
import { beforeT184GameCharacterStudy, beforeT184Cards, beforeT184Prosody, t184LineIds } from './helpers/before-t184-supplement.mjs';

const hash = (x) => createHash('sha256').update(JSON.stringify(x)).digest('hex');
const expectedCounts = { lauma: 7, linnea: 9, nefer: 9, prune: 9, illuga: 8, odette: 7, sandrone: 7 };

test('T184 leaves the published T182/T183 corpus, cards, mappings and reading overrides unchanged', async () => {
  assert.equal(hash(beforeT184GameCharacterStudy), 'ab28ad9617865c3fd807b2dee054fb93b6fe93d8685fba31e86c12c1946d7cac');
  assert.equal(hash(beforeT184Cards(await collectInventoryCards())), '7987f1b125e19d7d77c83523996857a7d761f9070d85b65717ff030af9f9e963');
  assert.equal(hash(VOCAB_ILLUSTRATIONS), 'c2f4bab387213a6ca2b68ef8d043aa96d7164206d5d4206d70b45f2ab01a23de');
  assert.equal(hash(beforeT184Prosody), '4b331d3f13e46cd8803c454261f8567cc2cf000853705b151d24d697c82b627f');
});

test('T184 community-table lines keep one source row each and reach listening, cards and audio without illustrations', async () => {
  const game = gameCharacterStudy.find((g) => g.id === 'genshin');
  const catalog = await loadCategory('games');
  assert.deepEqual(Object.fromEntries(genshinSupplementT184.map((c) => [c.id, c.lines.length])), expectedCounts);
  assert.equal(t184LineIds.size, 56);
  for (const source of genshinSupplementT184) {
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
