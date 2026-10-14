import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stages, generalListeningRoadmap } from '../curriculum/lessons.mjs';
import { sceneRecordId } from '../lib/scene-listening.mjs';
import { lessonProgress } from '../lib/lesson-progress.mjs';
import {
  emptyProgress,
  recordDictation,
  serializeProgress,
  parseProgress,
} from '../lib/progress.mjs';
import { mergeProgress } from '../lib/progress-merge.mjs';
import { getVoice } from '../curriculum/voices.mjs';

const lessons = stages.find((s) => s.id === 'stage-1').lessons;
test('通用聽解完成前30課原創教材，路線目標與完成課分開；同伴聲線固定', () => {
  assert.equal(lessons.length, 30);
  assert.equal(
    generalListeningRoadmap.reduce((n, p) => n + p.target, 0),
    180,
  );
  for (const lesson of lessons) {
    assert.equal(lesson.vocab.length, 25);
    assert.equal(lesson.grammar.length, 2);
    assert.ok(
      lesson.grammar.every((g) => g.jlpt?.length && g.examples.length === 2),
    );
    assert.equal(lesson.dialogue.length, 6);
    assert.equal(lesson.scene.questions.length, 3);
    assert.equal(lesson.practice.length, 3);
    for (const [i, line] of lesson.dialogue.entries())
      assert.equal(
        getVoice(line.voice).gender,
        i % 2 === 0 ? 'female' : 'male',
      );
    for (const q of lesson.scene.questions) {
      assert.equal(new Set(q.options).size, 3);
      assert.ok(q.answer >= 0 && q.answer < q.options.length && q.explanation);
    }
  }
});

test('整段或題義改變會重設聽解id，音色與解說修訂保留；與聽寫id分開', () => {
  const lesson = lessons[0],
    q = lesson.scene.questions[0];
  const id = sceneRecordId(lesson, q);
  assert.match(id, /^scene:general-listening-01:/);
  const revised = structuredClone(lesson);
  revised.dialogue[0].voice = 'sayo';
  assert.equal(sceneRecordId(revised, { ...q, explanation: '新版解說' }), id);
  revised.dialogue[1].jp = '森に行くよ。';
  assert.notEqual(sceneRecordId(revised, q), id);
  assert.notEqual(sceneRecordId(lesson, { ...q, answer: 1 }), id);
  assert.notEqual(
    sceneRecordId(lesson, { ...q, options: [...q.options].reverse() }),
    id,
  );
});

test('聽解進度計入首頁，沿用版本3儲存與跨裝置合併；不新增單字卡或聽寫作答', () => {
  const lesson = lessons[0];
  const id = sceneRecordId(lesson, lesson.scene.questions[0]);
  const progress = recordDictation(
    emptyProgress(),
    id,
    true,
    '2026-10-14T00:00:00.000Z',
  );
  assert.deepEqual(lessonProgress(stages, progress)[lesson.id].listening, {
    done: 1,
    total: 3,
  });
  assert.deepEqual(progress.srs, {});
  assert.deepEqual(Object.keys(progress.dictation), [id]);
  const restored = parseProgress(serializeProgress(progress)).progress;
  const merged = mergeProgress(restored, emptyProgress()).progress;
  assert.equal(merged.version, 3);
  assert.equal(merged.dictation[id].passed, true);
});
