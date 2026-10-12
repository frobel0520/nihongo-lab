import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameCharacterStudy } from '../curriculum/lessons.mjs';
import { erReferenceRows } from '../curriculum/game-character-reference-data.mjs';
import { erWeapons } from '../curriculum/game-character-weapons.mjs';
import {
  gameListeningQuestion,
  gameListeningRecordId,
} from '../lib/game-study.mjs';
const er = gameCharacterStudy.find((g) => g.id === 'er');

test('82 位資料教材逐角色對應來源 code 與可用武器，不冒充原台詞', () => {
  assert.equal(erReferenceRows.length, 82);
  assert.equal(new Set(erReferenceRows.map((r) => r.code)).size, 82);
  for (const row of erReferenceRows) {
    const c = er.characters.find((c) => c.id === row.id);
    assert.equal(c.code, row.code);
    assert.equal(c.lines.length, 2);
    const [words, example] = c.lines;
    const weapons = row.weaponTypes.map((t) => erWeapons[t]);
    assert.ok(weapons.length && weapons.every(Boolean));
    assert.equal(words.jp, weapons.map((w) => w.jp).join('・'));
    assert.equal(words.zh, weapons.map((w) => w.zh).join('、'));
    assert.equal(example.jp, `${c.nameJa}は${weapons[0].jp}を使えます。`);
    assert.equal(example.zh, `${c.name}可以使用${weapons[0].zh}。`);
    for (const l of c.lines) {
      assert.equal(l.kind, 'reference');
      assert.match(l.referenceNote, /非角色原台詞/);
      assert.match(
        l.referenceUrl,
        /ea359154465075aa61a668efde014db076820a03\/data\/CharacterMastery.json/,
      );
      assert.notEqual(l.category, '角色選擇');
    }
    assert.equal(
      gameListeningQuestion(words).prompt,
      '剛才唸的是哪組武器詞彙？',
    );
  }
});

test('武器音檔可共用，但各角色的理解進度仍独立；複合／英文名有教材讀音', () => {
  const weaponLines = er.characters
    .flatMap((c) => c.lines)
    .filter((l) => l.category === '武器詞彙');
  const pair = weaponLines.find((l, i) =>
    weaponLines.some((other, j) => j !== i && other.audio === l.audio),
  );
  const other = weaponLines.find(
    (l) => l.id !== pair.id && l.audio === pair.audio,
  );
  assert.notEqual(gameListeningRecordId(pair), gameListeningRecordId(other));
  for (const id of ['shoichi', 'rio', 'eleven', 'debimarlene']) {
    const line = er.characters.find((c) => c.id === id).lines[1];
    assert.ok(line.ruby && line.pronunciation);
    assert.doesNotMatch(line.pronunciation, /[A-Za-z&一-鿿]/);
  }
});
