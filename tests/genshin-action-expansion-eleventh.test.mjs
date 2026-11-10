import test from 'node:test';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {readFile} from 'node:fs/promises';import{gameCharacterStudy,loadCategory}from'../curriculum/lessons.mjs';import{collectInventoryCards}from'../scripts/vocab-illustration-inventory.mjs';import{VOCAB_ILLUSTRATIONS,illustrationFor}from'../lib/vocab-illustrations.mjs';import{gameListeningQuestion,gameRecordId}from'../lib/game-study.mjs';import{beforeEleventhGameCharacterStudy,beforeEleventhCards,beforeEleventhProsody}from'./helpers/before-eleventh-action-expansion.mjs';const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const expected=[
  {
    "id": "genshin:aether:skill-1127",
    "jp": "散！",
    "reading": "さん！",
    "voice": "nemo2",
    "sourceId": 1127,
    "sourceSha": "f6288625dfe3c22b7ec85bf43beaa335109829888f29e5f9d29a076547164213",
    "sourceType": "fixed-db",
    "group": "action-0010",
    "category": "元素技能"
  },
  {
    "id": "genshin:hutao:skill-36058",
    "jp": "起！",
    "reading": "き！",
    "voice": "tsumugi",
    "sourceId": 36058,
    "sourceSha": "df5ca74d6a4d0fe5e0e0f083e5c9c66d05412afb71f4a4caca34430b6994d3ca",
    "sourceType": "fixed-db",
    "group": "action-0270",
    "category": "元素技能"
  },
  {
    "id": "genshin:hutao:skill-36059",
    "jp": "散！",
    "reading": "さん！",
    "voice": "tsumugi",
    "sourceId": 36059,
    "sourceSha": "df5ca74d6a4d0fe5e0e0f083e5c9c66d05412afb71f4a4caca34430b6994d3ca",
    "sourceType": "fixed-db",
    "group": "action-0271",
    "category": "元素技能"
  },
  {
    "id": "genshin:lumine:skill-2126",
    "jp": "散！",
    "reading": "さん！",
    "voice": "zunko",
    "sourceId": 2126,
    "sourceSha": "158bfdc7fe3293c7672492c0e65e1f5c8343394963d2dc5bb73da8fc911b61fd",
    "sourceType": "fixed-db",
    "group": "action-0399",
    "category": "元素技能"
  },
  {
    "id": "genshin:yunjin:skill-64041",
    "jp": "着！",
    "reading": "ちゃく！",
    "voice": "zunko",
    "sourceId": 64041,
    "sourceSha": "69e93790f452cb50f802c5e9bf911b4d069cf12fe8418f9be3e497a498f6e389",
    "sourceType": "fixed-db",
    "group": "action-0714",
    "category": "元素技能"
  },
  {
    "id": "genshin:yunjin:skill-64042",
    "jp": "崩！",
    "reading": "ほう！",
    "voice": "zunko",
    "sourceId": 64042,
    "sourceSha": "69e93790f452cb50f802c5e9bf911b4d069cf12fe8418f9be3e497a498f6e389",
    "sourceType": "fixed-db",
    "group": "action-0715",
    "category": "元素技能"
  },
  {
    "id": "genshin:gaming:burst-92053",
    "jp": "威水獣舞！",
    "reading": "わいすいじゅうぶ！",
    "voice": "nemo2",
    "sourceId": 92053,
    "sourceSha": "eb76f3e403f11b6df8fb8b0314bc0f87098888572e47e4116e556866195f3711",
    "sourceType": "fixed-db",
    "group": "action-0255",
    "category": "元素爆發"
  },
  {
    "id": "genshin:lohen:burst-table-59-0",
    "jp": "ハハッ——楽になれると思うなよ？",
    "reading": "ハハッ——らくに なれると おもうなよ？",
    "voice": "ryusei",
    "sourceId": "table-59-0",
    "sourceSha": "e7788440b86cbfbc3db3f6ecfe35dc1371694812b9fce8c760429002792cf209",
    "sourceType": "community-wiki",
    "group": "action-0762",
    "category": "元素爆發"
  }
];
test('T179 preserves all previous candidate entries, IDs, mappings and reading overrides',async()=>{assert.equal(hash(beforeEleventhGameCharacterStudy),'8d1d4a1753cbdb88f61881d80db8e0a8c8bcccfc054deeb46bd1cb91611c1201');assert.equal(hash(beforeEleventhCards(await collectInventoryCards())),'88d1c14c04690c63293a657b700bf216a3bcfd9e6a70ac1cb68c6eee47d63ed9');assert.equal(hash(VOCAB_ILLUSTRATIONS),'c2f4bab387213a6ca2b68ef8d043aa96d7164206d5d4206d70b45f2ab01a23de');assert.equal(hash(beforeEleventhProsody),'bf107032ec66666a97fe3fad4dc31188a56ce4b3bbdf940f28f10c7a8d3e091e');});
test('T179 explicit source calls reach listening/cards with literal readings and no required illustrations',async()=>{const game=gameCharacterStudy.find(g=>g.id==='genshin'),catalog=await loadCategory('games');assert.equal(expected.length,8);assert.equal(new Set(expected.map(r=>r.group)).size,8);for(const r of expected){const c=game.characters.find(c=>c.id===r.id.split(':')[1]),l=c.lines.find(l=>l.id===r.id);assert.equal(l.jp,r.jp);assert.equal(l.reading,r.reading);assert.equal(l.voice,c.voice);assert.equal(l.voice,r.voice);assert.equal(l.category,r.category);assert.equal(l.sourceSha256,r.sourceSha);assert.equal(l.ruby.replace(/\{([^|}]+)\|[^}]+\}/g,'$1'),r.jp);if(r.sourceType==='fixed-db')assert.equal(l.voicelineId,r.sourceId);else assert.equal(l.sourceType,'community-wiki');const q=gameListeningQuestion(l);assert.equal(q.options[q.answer],l.zh);assert.equal(new Set(q.options).size,3);const card=catalog.cards.find(c=>c.id==='game-card:'+gameRecordId(l));assert.ok(card);assert.equal(illustrationFor(card),undefined);assert.ok(catalog.sentences.some(s=>s.audio===l.audio));assert.ok((await readFile(new URL('../public/'+l.audio,import.meta.url))).length>1000);}});
