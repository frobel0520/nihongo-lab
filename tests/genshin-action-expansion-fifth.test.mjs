import { sixthAssetNames, beforeSixthProsody, beforeSixthIllustrations } from './helpers/before-sixth-action-expansion.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { gameCharacterStudy, genshinActionCoverage, loadCategory } from '../curriculum/lessons.mjs';
import { genshinActionExpansionFifth } from '../curriculum/genshin-action-expansion-fifth.mjs';
import { AUDIO_PROSODY } from '../curriculum/audio-prosody.mjs';
import { gameListeningQuestion, gameRecordId } from '../lib/game-study.mjs';
import { illustrationFor } from '../lib/vocab-illustrations.mjs';
import { collectInventoryCards } from '../scripts/vocab-illustration-inventory.mjs';
import { beforeFifthGameCharacterStudy, beforeFifthCards, beforeFifthIllustrations, fifthLineIds, fifthAssetNames, fifthProsodyPaths } from './helpers/before-fifth-action-expansion.mjs';
const sha=v=>createHash('sha256').update(v).digest('hex');
test('T172 preserves every published line, card identity, mapping, cast and prior reading profile',async()=>{
 assert.equal(sha(JSON.stringify(beforeFifthGameCharacterStudy)),"fe6ec9cc6f9d190ce08adc5cd1099e42da0efadb48cee8bbf56c1cd99d405530");
 assert.equal(sha(JSON.stringify(beforeFifthCards(await collectInventoryCards()))),"faf782b0b0efb1b2b98dd3be9b0c60f7eeb10a2de1bdd173cbf225b669559138");
 assert.equal(sha(JSON.stringify(beforeFifthIllustrations)),"a347e302b14a7090799a896da7f25e51e8534bd3a8756afde2ef9b0b3267ced3");
 const old=Object.fromEntries(Object.entries(beforeSixthProsody).filter(([p])=>!fifthProsodyPaths.has(p)));
 assert.equal(Object.keys(old).length,370);assert.equal(sha(JSON.stringify(old)),"018c97762b20b6feeb163e6c7ea7ff704b4e2cd876e463f4c808c6d9978b0cab");
 const expected=new Map([[74044,'かんせい！'],[24050,'しょうじょうるてん。'],[63047,'ねんのひょうぞう！'],[23057,'しすいのや！'],[75058,'ずがたかいぞ。']]);
 for(const r of genshinActionExpansionFifth){if(expected.has(r.sourceItemId)){const g=gameCharacterStudy.find(g=>g.id==='genshin');const l=g.characters.find(c=>c.id===r.characterId).lines.find(l=>l.id===`genshin:${r.characterId}:${r.key}`);assert.equal(AUDIO_PROSODY[l.audio].reading,expected.get(r.sourceItemId))}}
});
test('T172 unique fixed-source E/Q additions reach cards, dictation and shadowing without duplicate or mismatched meanings',async()=>{
 assert.equal(fifthLineIds.size,45);const catalog=await loadCategory('games'),g=gameCharacterStudy.find(g=>g.id==='genshin');
 for(const r of genshinActionExpansionFifth){const c=g.characters.find(c=>c.id===r.characterId),l=c.lines.find(l=>l.id===`genshin:${r.characterId}:${r.key}`);assert.ok(l);assert.equal(l.voice,c.voice);assert.equal(l.jp,r.jp);assert.equal(l.audioReady,undefined);assert.equal(c.lines.filter(x=>x.jp===r.jp).length,1,r.jp);assert.equal(r.sourceSha256,genshinActionCoverage[r.characterId].sha256);assert.match(r.referenceUrl,/49a6544a6c6ae36089cb42fa591fc46f01de8bcf/);assert.match(r.sourceTitle,r.category==='元素技能'?/元素スキル/:/元素爆発/);const q=gameListeningQuestion(l);assert.equal(q.options[q.answer],r.zh);assert.equal(new Set(q.options).size,3);const card=catalog.cards.find(c=>c.id==='game-card:'+gameRecordId(l));assert.ok(card);assert.equal(card.audio,l.audio);assert.ok(illustrationFor(card));assert.equal(illustrationFor({...card,zh:card.zh+'（不同詞義）'}),undefined);assert.ok(catalog.sentences.some(s=>s.audio===l.audio));assert.ok((await readFile(new URL('../public/'+l.audio,import.meta.url))).length>1000)}
 assert.equal(beforeSixthIllustrations.length-beforeFifthIllustrations.length,45);
});
test('T172 keeps all 2432 published vector assets byte-equivalent while adding only 29 explicit originals',async()=>{
 const dir=new URL('../public/images/vocab/',import.meta.url),names=(await readdir(dir)).filter(n=>n.endsWith('.svg')).sort();assert.equal(names.filter(n=>fifthAssetNames.has(n)).length,29);const old=names.filter(n=>!fifthAssetNames.has(n) && !sixthAssetNames.has(n));assert.equal(old.length,2432);const entries=await Promise.all(old.map(async n=>n+':'+sha((await readFile(new URL(n,dir),'utf8')).replace(/\r\n/g,'\n'))));assert.equal(sha(entries.join('\n')),"330047db1a3eefe417661c666e7c414ac98a3e432fe367b802def0cb536e6f2e");
});
