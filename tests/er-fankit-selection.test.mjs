import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { gameCharacterStudy } from '../curriculum/lessons.mjs';
import {
  erFankitSources,
  erFankitTotals,
} from '../curriculum/er-fankit-selection.mjs';

const er = gameCharacterStudy.find((game) => game.id === 'er');
const lines = new Map(
  er.characters.flatMap((c) =>
    c.lines.map((l) => [l.id, { character: c, line: l }]),
  ),
);

test('官方108段日文selected來源完整映射，非語詞不冒配台詞', () => {
  assert.deepEqual(erFankitTotals, {
    clips: 108,
    characters: 89,
    withText: 103,
    nonverbal: 5,
    lessons: 91,
  });
  assert.equal(
    new Set(erFankitSources.map((s) => `${s.sourceUrl}/${s.filename}`)).size,
    108,
  );
  const expectedNonverbal = new Set([
    'Barbara_selected2_1_ja.wav',
    'Hart_selected2_1_ja.wav',
    'Hyunwoo_selected2_1_ja.wav',
    'Leon_selected2_1_ja.wav',
    'Rio_selected2_1_ja.wav',
  ]);
  assert.ok(erFankitSources.some((s) => s.filename === 'fiora_selected .wav'));
  assert.equal(
    erFankitSources.filter((s) => s.family === 'selected2').length,
    7,
  );
  for (const source of erFankitSources) {
    assert.match(source.filename, /_selected2?(?:_|\s*\.)/i);
    assert.match(
      source.sourceUrl,
      /^https:\/\/drive\.google\.com\/file\/d\/[\w-]+\/view$/,
    );
    assert.match(source.sha256, /^[a-f0-9]{64}$/);
    assert.ok(er.characters.some((c) => c.id === source.characterId));
    assert.equal(
      source.status === 'nonverbal',
      expectedNonverbal.has(source.filename),
    );
    if (source.status === 'nonverbal') {
      assert.equal(source.lessonId, null);
      continue;
    }
    const { character, line } = lines.get(source.lessonId) ?? {};
    assert.ok(line, `Missing lesson for ${source.filename}`);
    assert.equal(character.id, source.characterId);
    assert.ok(line.officialSources.includes(source));
    assert.ok(line.reading && line.zh && line.note && line.pronunciation);
    assert.match(line.audio, /-fankit-v1\.mp3$/);
    assert.ok(existsSync(`public/${line.audio}`));
  }
});

test('角色配對採名字，避免官方資料夾編號與遊戲名冊不同而錯配', () => {
  for (const [file, id] of [
    ['shoichi_selected.wav', 'shoichi'],
    ['adriana_selected.wav', 'adriana'],
    ['sissela_selected.wav', 'sissela'],
    ['zahir_selected.wav', 'zahir'],
    ['Hyunwoo_selected_1_ja.wav', 'hyunwoo'],
  ]) {
    assert.equal(
      erFankitSources.find((s) => s.filename === file).characterId,
      id,
    );
  }
  for (const character of er.characters) {
    const firstOfficial = character.lines.findIndex(
      (line) => line.officialSources,
    );
    if (firstOfficial >= 0) assert.equal(firstOfficial, 0);
  }
});
