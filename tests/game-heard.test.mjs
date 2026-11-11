import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gameCharacterStudy } from '../curriculum/lessons.mjs';
import { emptyProgress, parseProgress, serializeProgress } from '../lib/progress.mjs';
import { gameDone, gameListeningDone, gameRecordId, markGameHeard } from '../lib/game-study.mjs';

const lines = gameCharacterStudy.find((g) => g.id === 'genshin').characters.find((c) => c.id === 'varka').lines;

test('T183：實際播放過就算已學，重複播放不改寫紀錄，也不影響聽力理解紀錄', () => {
  const start = emptyProgress();
  const heard = markGameHeard(start, lines[0], '2026-11-11T00:00:00.000Z');
  assert.equal(gameDone(lines, start), 0);
  assert.equal(gameDone(lines, heard), 1);
  assert.deepEqual(heard.dictation[gameRecordId(lines[0])], { attempts: 1, passed: true, lastAt: '2026-11-11T00:00:00.000Z' });
  assert.equal(markGameHeard(heard, lines[0], '2026-11-12T00:00:00.000Z'), heard, '已學的句子再播放不產生新的進度物件');
  assert.equal(gameListeningDone(lines, heard), 0, '聽過不等於答對大意');
  assert.deepEqual(parseProgress(serializeProgress(heard)).progress.dictation, heard.dictation);
});

test('T183：舊版手動標記的已學紀錄照常計入', () => {
  const old = { ...emptyProgress(), dictation: { [gameRecordId(lines[1])]: { attempts: 1, passed: true, lastAt: '2026-10-12T00:00:00.000Z' } } };
  assert.equal(gameDone(lines, old), 1);
  assert.equal(markGameHeard(old, lines[1], '2026-11-11T00:00:00.000Z'), old);
});

test('T183：角色語音頁不再有手動「標記已學」按鈕，改由播放事件記錄', async () => {
  const view = await readFile(new URL('../app/views/GameStudyView.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(view, /標記已學|已標記學過|onDone/);
  assert.match(view, /markGameHeard\(/);
});
