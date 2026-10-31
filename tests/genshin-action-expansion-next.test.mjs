import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { gameCharacterStudy, genshinActionCoverage, loadCategory } from '../curriculum/lessons.mjs';
import { genshinActionExpansionNext } from '../curriculum/genshin-action-expansion-next.mjs';
import { gameListeningQuestion, gameRecordId } from '../lib/game-study.mjs';
import { VOCAB_ILLUSTRATIONS, illustrationFor } from '../lib/vocab-illustrations.mjs';
import { collectInventoryCards } from '../scripts/vocab-illustration-inventory.mjs';
import { beforeNextGameCharacterStudy, beforeNextCards, nextCardIds, nextLineIds, nextAssetNames } from './helpers/before-next-action-expansion.mjs';

const sha = value => createHash('sha256').update(value).digest('hex');

test('T169 preserves every published game line, casting, card and exact illustration mapping from e8d139d', async () => {
  const publishedGames = beforeNextGameCharacterStudy.map(game => ({ id: game.id, characters: game.characters.map(character => ({ id: character.id, voice: character.voice, lines: character.lines })) }));
  assert.equal(sha(JSON.stringify(publishedGames)), 'fe6795da5a79b043b07be58487f817452ca68fb8d15a42f820485fde15a2027c');
  const oldCards = beforeNextCards(await collectInventoryCards());
  assert.equal(oldCards.length, 5969);
  assert.equal(sha(JSON.stringify(oldCards)), '381ca00614ab42f200fc9d4b04658675311218509eb8d68b32feef43418c2d9a');
  const oldMaps = VOCAB_ILLUSTRATIONS.filter(card => !nextCardIds.has(card.id));
  assert.equal(sha(JSON.stringify(oldMaps)), '8126d5d9f8aa7962bfbbf9c1cfb7ca995efbf57093d4bfe95b63914c589af4d2');
});

test('T169 all 120 fixed-source additions reach learning, unique questions, audio and exact images', async () => {
  assert.equal(nextLineIds.size, 120);
  assert.equal(nextCardIds.size, 120);
  assert.equal(new Set(genshinActionExpansionNext.map(row => row.sourceItemId)).size, 120);
  const game = gameCharacterStudy.find(item => item.id === 'genshin');
  const catalog = await loadCategory('games');
  assert.equal(game.characters.flatMap(character => character.lines).length, 552);
  assert.equal(catalog.cards.length, 798);
  for (const row of genshinActionExpansionNext) {
    const character = game.characters.find(item => item.id === row.characterId);
    const line = character.lines.find(item => item.id === `genshin:${row.characterId}:${row.key}`);
    assert.ok(line, row.key);
    assert.equal(line.voice, character.voice);
    assert.equal(row.sourceSha256, genshinActionCoverage[row.characterId].sha256);
    assert.match(row.referenceUrl, /49a6544a6c6ae36089cb42fa591fc46f01de8bcf/);
    assert.match(row.voicefile, /^VO_gameplay\//);
    assert.ok(['元素技能', '元素爆發'].includes(line.category));
    assert.notEqual(line.audioReady, false);
    const question = gameListeningQuestion(line);
    assert.equal(question.options[question.answer], line.zh);
    assert.equal(new Set(question.options).size, question.options.length);
    const card = catalog.cards.find(item => item.id === 'game-card:' + gameRecordId(line));
    assert.ok(card && illustrationFor(card), line.id);
    assert.equal(card.audio, line.audio);
    assert.ok(catalog.sentences.some(item => item.audio === line.audio));
    assert.ok((await readFile(new URL('../public/' + line.audio, import.meta.url))).length > 1000);
  }
  const phonetic = genshinActionExpansionNext.find(row => row.jp === '歯ぁ食いしばれよ！');
  assert.equal(phonetic.reading, 'はぁくいしばれよ！');
  assert.equal(phonetic.ruby, '{歯|は}ぁ{食|く}いしばれよ！');
});

test('T169 adds only its own 67 vectors; every older vector remains byte-identical', async () => {
  const dir = new URL('../public/images/vocab/', import.meta.url);
  const names = (await readdir(dir)).filter(name => name.endsWith('.svg')).sort();
  const current = names.filter(name => nextAssetNames.has(name));
  const old = names.filter(name => !nextAssetNames.has(name));
  assert.equal(current.length, 67);
  assert.equal(old.length, 2287);
  const entries = await Promise.all(old.map(async name => name + ':' + sha((await readFile(new URL(name, dir), 'utf8')).replace(/\r\n/g, '\n'))));
  // Mechanical integrity only; it does not assess image semantics.
  assert.equal(sha(entries.join('\n')), '0e85b71e61757777f65e0199504728ed0b5a6942686f6cc56331dcdf01878dcb');
});
