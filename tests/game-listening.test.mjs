import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameCharacterStudy } from '../curriculum/lessons.mjs';
import {
  gameListeningQuestion,
  gameListeningRecordId,
  gameListeningDone,
  gameRecordId,
} from '../lib/game-study.mjs';
import {
  emptyProgress,
  recordDictation,
  parseProgress,
  serializeProgress,
} from '../lib/progress.mjs';
import { mergeProgress } from '../lib/progress-merge.mjs';
const lines = gameCharacterStudy.flatMap((g) =>
  g.characters.flatMap((c) => c.lines),
);

test('遊戲聽力題有唯一大意、合理不同選項、原教材解說及分散答案位置', () => {
  const positions = new Set();
  for (const line of lines) {
    const q = gameListeningQuestion(line);
    assert.equal(q.options.length, 3);
    assert.equal(new Set(q.options).size, 3);
    assert.equal(q.options[q.answer], line.zh);
    assert.equal(q.explanation, line.note);
    positions.add(q.answer);
  }
  assert.equal(positions.size, 3);
});

test('聽力理解紀錄與自評／原進度分開；題義更改另存，解說更改保留，沿用版本 3 合併', () => {
  const line = lines[0],
    id = gameListeningRecordId(line),
    time = '2026-10-12T00:00:00.000Z';
  const original = recordDictation(
    emptyProgress(),
    gameRecordId(line),
    true,
    time,
  );
  const p = recordDictation(original, id, true, time);
  assert.notEqual(id, gameRecordId(line));
  assert.equal(gameListeningDone(lines, p), 1);
  assert.deepEqual(
    p.dictation[gameRecordId(line)],
    original.dictation[gameRecordId(line)],
  );
  assert.deepEqual(parseProgress(serializeProgress(p)).progress, p);
  assert.deepEqual(mergeProgress(original, p).progress, p);
  assert.equal(gameListeningRecordId({ ...line, note: '更新解說' }), id);
  assert.notEqual(gameListeningRecordId({ ...line, zh: '修改題意' }), id);
});
