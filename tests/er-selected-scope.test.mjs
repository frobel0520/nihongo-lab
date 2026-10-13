import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { gameCharacterStudy } from '../curriculum/lessons.mjs';
import {
  erSelectionTotals,
  erSelectionCoverage,
} from '../curriculum/er-selection-transcripts.mjs';
const er = gameCharacterStudy.find((g) => g.id === 'er');
const { clips } = JSON.parse(
  readFileSync('scripts/er-selection-clips.json', 'utf8'),
);

test('selected來源316段都有索引及分類，不把非語詞或其他情境偽造成台詞', () => {
  assert.equal(clips.length, 316);
  assert.equal(new Set(clips.map((c) => c.clip)).size, 316);
  for (const clip of clips) {
    assert.match(clip.clip, /_selected2?(?:_|$)/i);
    assert.ok(['selected', 'selected2'].includes(clip.family));
    assert.equal(
      clip.clip.includes('_selected2_'),
      clip.family === 'selected2',
    );
    assert.ok(er.characters.some((c) => c.id === clip.characterId));
  }
  assert.equal(erSelectionTotals.withText + erSelectionTotals.nonverbal, 316);
  assert.equal(erSelectionTotals.pending, 0);
  for (const c of er.characters) {
    assert.equal(
      erSelectionCoverage[c.id].clips,
      clips.filter((r) => r.characterId === c.id).length,
    );
  }
});

test('只保留246句selected教材並按角色配置聲線，非選角資料句不進入角色播放清單', () => {
  const lines = er.characters.flatMap((c) => c.lines);
  assert.equal(lines.length, 246);
  assert.equal(new Set(lines.map((l) => l.audio)).size, 246);
  for (const c of er.characters) {
    assert.ok(c.lines.length);
    for (const l of c.lines) {
      assert.equal(l.category, '角色選擇');
      assert.equal(l.voice, c.voice);
      assert.match(l.id, /:selection(?:-voice)?:/);
      assert.ok(existsSync('public/' + l.audio));
    }
  }
});
