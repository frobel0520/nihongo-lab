import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { gameCharacterStudy, loadCategory } from '../curriculum/lessons.mjs';
import { genshinSupplementT185 } from '../curriculum/genshin-supplement-t185.mjs';
import { collectInventoryCards } from '../scripts/vocab-illustration-inventory.mjs';
import { VOCAB_ILLUSTRATIONS, illustrationFor } from '../lib/vocab-illustrations.mjs';
import { gameListeningQuestion, gameRecordId } from '../lib/game-study.mjs';
import { beforeT185GameCharacterStudy, beforeT185Cards, beforeT185Prosody, t185LineIds } from './helpers/before-t185-supplement.mjs';

const hash = (x) => createHash('sha256').update(JSON.stringify(x)).digest('hex');
const expectedCounts = { columbina: 6, dahlia: 6, iansan: 6, ifa: 6, ineffa: 6, jahoda: 6, nicole: 4, zibai: 6, lohen: 2, lauma: 2, odette: 1, illuga: 2 };

test('T185 leaves the published T184 corpus, cards, mappings and reading overrides unchanged', async () => {
  assert.equal(hash(beforeT185GameCharacterStudy), '381eac68ccb602c4030727270cbddc88feaa404f1aec9dc1b9f3c038012d92d8');
  assert.equal(hash(beforeT185Cards(await collectInventoryCards())), '91d20949c2307640f3fc7629c2d9ffeb6f780798271f335c6a8b7e89b65e9976');
  assert.equal(hash(VOCAB_ILLUSTRATIONS), 'c2f4bab387213a6ca2b68ef8d043aa96d7164206d5d4206d70b45f2ab01a23de');
  assert.equal(hash(beforeT185Prosody), '065b3aac8dcbf8b86caca5a8fa4362b77981c5d23c6c34e9019682dfe83426a8');
});

test('T185 community-table lines keep one source row each and reach listening, cards and audio without illustrations', async () => {
  const game = gameCharacterStudy.find((g) => g.id === 'genshin');
  const catalog = await loadCategory('games');
  assert.deepEqual(Object.fromEntries(genshinSupplementT185.map((c) => [c.id, c.lines.length])), expectedCounts);
  assert.equal(t185LineIds.size, 53);
  for (const source of genshinSupplementT185) {
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
