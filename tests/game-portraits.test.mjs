import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { gameCharacterStudy } from '../curriculum/lessons.mjs';
import { eternalReturnRoster } from '../curriculum/game-character-roster.mjs';

test('ER 名冊收齊固定來源的 91 個可玩角色，排除隨機／NPC，頭像、中文及日文名齊全', () => {
  const er = gameCharacterStudy.find((g) => g.id === 'er');
  assert.equal(er.characters.length, 91);
  assert.deepEqual(
    eternalReturnRoster.map((c) => c.code).sort((a, b) => a - b),
    Array.from({ length: 91 }, (_, i) => i + 1),
  );
  assert.equal(new Set(er.characters.map((c) => c.id)).size, 91);
  for (const c of er.characters) {
    assert.ok(c.name && c.nameJa);
    assert.ok(existsSync('public/' + c.portrait));
    assert.match(c.portraitReferenceUrl, /CharProfile/);
  }
  assert.ok(er.characters.every((c) => c.lines.length > 0));
  assert.equal(
    er.characters.filter((c) => c.lines.some((l) => l.kind === 'reference'))
      .length,
    0,
  );
});

test('兩遊戲 215 個角色頭像是可讀的圖檔並有對應來源；不使用遠端圖片網址作畫面 src', () => {
  const chars = gameCharacterStudy.flatMap((g) => g.characters);
  const manifest = JSON.parse(
    readFileSync('public/game-portraits/sources.json', 'utf8'),
  );
  assert.equal(chars.length, 215);
  assert.equal(manifest.sources.length, 215);
  for (const c of chars) {
    assert.match(c.portrait, /^game-portraits\/[^/]+\.(png|jpg)$/);
    assert.match(c.portraitReferenceUrl, /^https:/);
    const file = readFileSync('public/' + c.portrait);
    if (c.portrait.endsWith('.png'))
      assert.equal(file.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    else assert.equal(file.subarray(0, 2).toString('hex'), 'ffd8');
    assert.ok(
      manifest.sources.some((s) => 'game-portraits/' + s.file === c.portrait),
    );
  }
});

test('角色清單保留已編排音檔；未收錄角色不指定配音', () => {
  const lines = gameCharacterStudy.flatMap((g) =>
    g.characters.flatMap((c) => c.lines),
  );
  assert.equal(lines.filter((l) => l.category !== '角色選擇').length, 232);
  const bennett = lines.find((l) => l.id === 'genshin:bennett:skill');
  assert.equal(bennett.audio, 'audio/games/genshin/gram-641caa85ab-ro-v1.mp3');
  for (const g of gameCharacterStudy)
    for (const c of g.characters)
      if (!c.lines.length) assert.equal(c.voice, undefined);
});

test('ER角色區只保留selected來源台詞，不混入介紹、原創練習或資料句', () => {
  const er = gameCharacterStudy.find((g) => g.id === 'er');
  const rows = er.characters.flatMap((c) => c.lines);
  assert.equal(rows.length, 246);
  assert.ok(rows.every((l) => l.category === '角色選擇' && l.kind === 'quote'));
});
