import { sixthAssetNames } from './helpers/before-sixth-action-expansion.mjs';
import { fifthAssetNames } from './helpers/before-fifth-action-expansion.mjs';
import { fourthAssetNames } from './helpers/before-fourth-action-expansion.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { gameCharacterStudy, genshinActionCoverage, loadCategory } from '../curriculum/lessons.mjs';
import { genshinActionExpansionThird } from '../curriculum/genshin-action-expansion-third.mjs';
import { gameListeningQuestion, gameRecordId } from '../lib/game-study.mjs';
import { illustrationFor } from '../lib/vocab-illustrations.mjs';
import { collectInventoryCards } from '../scripts/vocab-illustration-inventory.mjs';
import { beforeThirdGameCharacterStudy, beforeThirdCards, beforeThirdIllustrations, thirdLineIds, thirdAssetNames } from './helpers/before-third-action-expansion.mjs';
const sha = value => createHash('sha256').update(value).digest('hex');

test('T170 preserves all previously published game data, casting, progress identities and exact illustrations', async () => {
 const games = beforeThirdGameCharacterStudy.map(g => ({ id:g.id, characters:g.characters.map(c => ({id:c.id, voice:c.voice, lines:c.lines})) }));
 assert.equal(sha(JSON.stringify(games)), '653c63436e20cce8a11ceb15b54eceed98057567efa8f5756f87f39369630c1b');
 assert.equal(sha(JSON.stringify(beforeThirdCards(await collectInventoryCards()))), '7f9b1f8d9b530a38f848acd3cec0fa0e90fb7e9ffdcb343cc5e0f1eda34aafd1');
 assert.equal(sha(JSON.stringify(beforeThirdIllustrations)), 'ea470185e9fa6a570168222df761fa00972d08f239826f0f7d3007a0308bc219');
});

test('T170 source-specific additions are reachable in all game practice datasets with unambiguous answer identities', async () => {
 assert.equal(thirdLineIds.size,60);
 const game=gameCharacterStudy.find(g => g.id==='genshin'),catalog=await loadCategory('games');
 for(const row of genshinActionExpansionThird){
  const character=game.characters.find(c => c.id===row.characterId),line=character.lines.find(l => l.id===`genshin:${row.characterId}:${row.key}`);
  assert.ok(line);assert.equal(line.voice,character.voice);assert.equal(line.jp,row.jp);
  assert.equal(row.sourceSha256,genshinActionCoverage[row.characterId].sha256);
  assert.match(row.referenceUrl,/49a6544a6c6ae36089cb42fa591fc46f01de8bcf/);
  assert.match(row.sourceTitle,row.category==='元素技能'?/元素スキル/:/元素爆発/);
  const q=gameListeningQuestion(line);assert.equal(q.options[q.answer],line.zh);assert.equal(new Set(q.options).size,3);
  const card=catalog.cards.find(c => c.id==='game-card:'+gameRecordId(line));assert.ok(card&&illustrationFor(card));assert.equal(card.audio,line.audio);
  assert.ok(catalog.sentences.some(s => s.audio===line.audio));assert.notEqual(line.audioReady,false);
  assert.ok((await readFile(new URL('../public/'+line.audio,import.meta.url))).length>1000);
 }
});

test('T170 adds 39 vectors while all 2354 previously published vector bytes remain unchanged', async () => {
 const dir=new URL('../public/images/vocab/',import.meta.url),names=(await readdir(dir)).filter(n=>n.endsWith('.svg')).sort();
 assert.equal(names.filter(n=>thirdAssetNames.has(n)).length,39);
 const old=names.filter(n=>!thirdAssetNames.has(n)&&!fourthAssetNames.has(n) && !fifthAssetNames.has(n) && !sixthAssetNames.has(n));assert.equal(old.length,2354);
 const entries=await Promise.all(old.map(async n=>n+':'+sha((await readFile(new URL(n,dir),'utf8')).replace(/\r\n/g,'\n'))));
 assert.equal(sha(entries.join('\n')),'5287e0ab58abb4c02f68a3cbcbb9375433b6de177738be63bcce9558b20ebd91');
});
