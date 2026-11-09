import { ninthAssetNames } from './helpers/before-ninth-action-expansion.mjs';
import { eighthAssetNames } from './helpers/before-eighth-action-expansion.mjs';
import { seventhAssetNames } from './helpers/before-seventh-action-expansion.mjs';
import { sixthAssetNames, beforeSixthProsody } from './helpers/before-sixth-action-expansion.mjs';
import { fifthAssetNames, fifthProsodyPaths, beforeFifthIllustrations } from './helpers/before-fifth-action-expansion.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { gameCharacterStudy, genshinActionCoverage, loadCategory } from '../curriculum/lessons.mjs';
import { genshinActionExpansionFourth } from '../curriculum/genshin-action-expansion-fourth.mjs';
import { AUDIO_PROSODY } from '../curriculum/audio-prosody.mjs';
import { gameListeningQuestion, gameRecordId } from '../lib/game-study.mjs';
import { illustrationFor } from '../lib/vocab-illustrations.mjs';
import { collectInventoryCards } from '../scripts/vocab-illustration-inventory.mjs';
import { beforeFourthGameCharacterStudy, beforeFourthCards, beforeFourthIllustrations, fourthLineIds, fourthAssetNames } from './helpers/before-fourth-action-expansion.mjs';
const sha = v => createHash('sha256').update(v).digest('hex');
test('T171 preserves all published lines, casting, cards, identities, illustration mappings and older prosody', async()=>{
 assert.equal(sha(JSON.stringify(beforeFourthGameCharacterStudy)), '93ae1722b69477dd9a2add9a050c15d3bbf13dcc507b2b05e1c81cd22575c0ad');
 assert.equal(sha(JSON.stringify(beforeFourthCards(await collectInventoryCards()))), '36477fdac4b7525e086068757bb6f534ea54ebada922353fad8b38d380abb3ff');
 assert.equal(sha(JSON.stringify(beforeFourthIllustrations)), 'f5c77f51925b34430725d7c0d5d357aaaf59280904271f27e06d5f639a4cdff0');
 const oldProfiles=Object.fromEntries(Object.entries(beforeSixthProsody).filter(([p])=>p!=='audio/games/genshin/gram-4489e65745.mp3'&&!fifthProsodyPaths.has(p)));
 assert.equal(Object.keys(oldProfiles).length,369);
 assert.equal(sha(JSON.stringify(oldProfiles)), '7a0cf6adcadde1680bf1e53e84a9a1937ee44a763f92f6ffc741e71193d9a2a3');
 assert.equal(AUDIO_PROSODY['audio/games/genshin/gram-4489e65745.mp3'].reading,'たかきものを、わたしはさげすむ。');
});
test('T171 source additions are unique, correctly classified and reachable in all game practice datasets',async()=>{
 assert.equal(fourthLineIds.size,60);
 const g=gameCharacterStudy.find(g=>g.id==='genshin'), catalog=await loadCategory('games');
 for(const r of genshinActionExpansionFourth){
  const c=g.characters.find(c=>c.id===r.characterId),l=c.lines.find(l=>l.id===`genshin:${r.characterId}:${r.key}`);
  assert.ok(l);assert.equal(l.voice,c.voice);assert.equal(l.jp,r.jp);assert.equal(l.audioReady,undefined);
  assert.equal(c.lines.filter(x=>x.jp===r.jp).length,1, r.jp);
  assert.equal(r.sourceSha256,genshinActionCoverage[r.characterId].sha256);
  assert.match(r.referenceUrl,/49a6544a6c6ae36089cb42fa591fc46f01de8bcf/);
  assert.match(r.sourceTitle,r.category==='元素技能'?/元素スキル/:/元素爆発/);
  const q=gameListeningQuestion(l);assert.equal(q.options[q.answer],r.zh);assert.equal(new Set(q.options).size,3);
  const card=catalog.cards.find(c=>c.id==='game-card:'+gameRecordId(l));assert.ok(card);assert.equal(card.audio,l.audio);assert.ok(illustrationFor(card));
  assert.ok(catalog.sentences.some(s=>s.audio===l.audio));
  assert.ok((await readFile(new URL('../public/'+l.audio,import.meta.url))).length>1000);
 }
 assert.equal(beforeFifthIllustrations.length-beforeFourthIllustrations.length,60);
});
test('T171 leaves every one of the 2393 old vector assets intact while adding only the explicit 39 assets',async()=>{
 const dir=new URL('../public/images/vocab/',import.meta.url),names=(await readdir(dir)).filter(n=>n.endsWith('.svg') && !ninthAssetNames.has(n)).sort();
 assert.equal(names.filter(n=>fourthAssetNames.has(n)).length,39);
 const old=names.filter(n=>!fourthAssetNames.has(n) && !fifthAssetNames.has(n) && !sixthAssetNames.has(n) && !seventhAssetNames.has(n) && !eighthAssetNames.has(n));assert.equal(old.length,2393);
 const entries=await Promise.all(old.map(async n=>n+':'+sha((await readFile(new URL(n,dir),'utf8')).replace(/\r\n/g,'\n'))));
 assert.equal(sha(entries.join('\n')),'a623532b35d91bfc4eaaea005e8b9efa3bca06da9b0b46267133399217966819');
});
