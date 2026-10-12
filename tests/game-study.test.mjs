import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { gameCharacterStudy, stages } from '../curriculum/lessons.mjs';
import { gameDone, gameLines, gameRecordId } from '../lib/game-study.mjs';
import { gameHash, parseRoute } from '../lib/route.mjs';
import {
  emptyProgress,
  recordDictation,
  recordReview,
  parseProgress,
  serializeProgress,
} from '../lib/progress.mjs';
import { mergeProgress } from '../lib/progress-merge.mjs';
import { allAudioPaths } from '../lib/offline.mjs';
import { getVoice } from '../curriculum/voices.mjs';
import { rubyParts, plainText } from '../lib/furigana.mjs';

const lines = gameCharacterStudy.flatMap((g) =>
  g.characters.flatMap((c) => c.lines),
);
const stamp = '2026-10-11T00:00:00.000Z';

test('遊戲區的角色、語音來源、配音、讀音與實際音檔齊全；原創句不得偽裝選角台詞', () => {
  assert.deepEqual(
    gameCharacterStudy.map((g) => g.id),
    ['lol', 'er', 'genshin'],
  );
  assert.equal(lines.length, 24);
  assert.equal(new Set(lines.map((l) => l.id)).size, lines.length);
  assert.equal(new Set(lines.map(gameRecordId)).size, lines.length);
  for (const game of gameCharacterStudy)
    for (const character of game.characters) {
      for (const line of character.lines) {
        assert.equal(line.voice, character.voice);
        assert.ok(getVoice(line.voice));
        assert.match(line.referenceUrl, /^https:/);
        assert.ok(line.note && line.zh);
        assert.ok(existsSync('public/' + line.audio), line.audio);
        const parts = rubyParts(line);
        if (/[一-鿿]/.test(line.jp)) {
          assert.ok(parts && parts.some((p) => p.ruby), line.jp);
          assert.equal(plainText(parts), line.jp);
        }
        if (line.kind === 'practice') {
          assert.equal(line.category, '主題練習');
          assert.match(line.referenceNote, /非遊戲台詞/);
        }
      }
    }
  assert.equal(lines.filter((l) => l.category === '角色選擇').length, 3);
  assert.equal(lines.filter((l) => l.category === '編隊加入').length, 3);
});

test('角色及情境篩選不混遊戲，未知分類安全回空；選角與編隊分離', () => {
  const selection = gameLines(gameCharacterStudy, 'lol', '', '角色選擇');
  assert.equal(selection.length, 3);
  assert.ok(selection.every((row) => row.line.kind === 'quote'));
  assert.equal(
    gameLines(gameCharacterStudy, 'genshin', '', '角色選擇').length,
    0,
  );
  assert.equal(
    gameLines(gameCharacterStudy, 'genshin', 'amber', '編隊加入').length,
    1,
  );
  assert.equal(gameLines(gameCharacterStudy, 'lol', 'missing').length, 0);
  assert.equal(gameLines(gameCharacterStudy, 'missing').length, 0);
});

test('遊戲學習進度獨立、可合併及序列化，不變動既有 FSRS 或聽寫', () => {
  const before = recordDictation(
    recordReview(
      emptyProgress(),
      'synthetic-card',
      'good',
      '2026-10-11',
      stamp,
    ),
    'audio/synthetic-existing.mp3',
    true,
    stamp,
  );
  const line = lines[0];
  const after = recordDictation(before, gameRecordId(line), true, stamp);
  assert.deepEqual(after.srs, before.srs);
  assert.deepEqual(
    after.dictation['audio/synthetic-existing.mp3'],
    before.dictation['audio/synthetic-existing.mp3'],
  );
  assert.equal(gameDone(lines, after), 1);
  assert.deepEqual(parseProgress(serializeProgress(after)).progress, after);
  assert.deepEqual(mergeProgress(before, after).progress, after);
  assert.equal(gameRecordId({ ...line, note: '更新解說' }), gameRecordId(line));
  assert.notEqual(
    gameRecordId({ ...line, jp: line.jp + '！' }),
    gameRecordId(line),
  );
});

test('遊戲路由可深連結，保留返回路徑，壞編碼及多餘段落回遊戲清單', () => {
  assert.deepEqual(parseRoute(gameHash()), { view: 'games' });
  assert.deepEqual(parseRoute(gameHash('lol', 'ahri')), {
    view: 'games',
    gameId: 'lol',
    characterId: 'ahri',
  });
  assert.deepEqual(parseRoute(gameHash('a/b', '角色')), {
    view: 'games',
    gameId: 'a/b',
    characterId: '角色',
  });
  for (const hash of [
    '#/games/',
    '#/games/lol/',
    '#/games/%E0%A4%A',
    '#/games/a/b/c',
  ])
    assert.deepEqual(parseRoute(hash), { view: 'games' });
});

test('下載全部包含遊戲音檔、去重並保留全部舊課程音檔', () => {
  const original = allAudioPaths(stages),
    extra = lines.map((l) => l.audio);
  const all = allAudioPaths(stages, [...extra, extra[0]]);
  assert.equal(all.length, original.length + extra.length);
  for (const audio of [...original, ...extra]) assert.ok(all.includes(audio));
});
