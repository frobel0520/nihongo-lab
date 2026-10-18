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
test('通用聽解完成前170課原創教材，路線目標與完成課分開；同伴聲線固定', () => {
  assert.equal(lessons.length, 170);
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

test('整段聽解的同伴標籤依聲線命名，句數不同或同一人連說兩句也正確', async () => {
  const { sceneSpeakerLabels } = await import('../lib/scene-listening.mjs');
  assert.deepEqual(
    sceneSpeakerLabels(
      [{ voice: 'nemo2' }, { voice: 'nemo2' }, { voice: 'hau' }],
      getVoice,
    ),
    ['同伴甲（男聲）', '同伴甲（男聲）', '同伴乙（女聲）'],
  );
  for (const lesson of lessons)
    assert.deepEqual(
      sceneSpeakerLabels(lesson.dialogue, getVoice),
      lesson.dialogue.map((_, i) =>
        i % 2 === 0 ? '同伴甲（女聲）' : '同伴乙（男聲）',
      ),
    );
});

test('通用聽解每組都有標題；尚無專屬標題的組沿用路線階段名稱', async () => {
  const { generalListeningGroupTitle, GENERAL_LISTENING_GROUP_SIZE } =
    await import('../curriculum/lessons.mjs');
  const groups = Math.ceil(lessons.length / GENERAL_LISTENING_GROUP_SIZE);
  for (let i = 0; i < groups; i++)
    assert.notEqual(generalListeningGroupTitle(i), '延伸練習');
  // 第 61～90 課屬於路線第 3 階段。
  assert.equal(generalListeningGroupTitle(6), generalListeningRoadmap[2].title);
  assert.equal(generalListeningGroupTitle(7), generalListeningRoadmap[2].title);
  assert.equal(generalListeningGroupTitle(8), generalListeningRoadmap[2].title);
  // 90→91跨入第四階段，91～100整組沿用劇情理解標題。
  assert.equal(generalListeningGroupTitle(9), generalListeningRoadmap[3].title);
  assert.equal(
    generalListeningGroupTitle(10),
    generalListeningRoadmap[3].title,
  );
  assert.equal(
    generalListeningGroupTitle(11),
    generalListeningRoadmap[3].title,
  );
  // 120→121進入第五階段；171以後仍只屬規劃，不建立教材入口。
  assert.equal(generalListeningGroupTitle(12), '情境詞彙');
  assert.equal(lessons[119].id, 'general-listening-120');
  assert.equal(lessons[120].id, 'general-listening-121');
  assert.equal(generalListeningGroupTitle(13), '情境詞彙');
  assert.equal(lessons[129].id, 'general-listening-130');
  assert.equal(lessons[130].id, 'general-listening-131');
  assert.equal(lessons[139].id, 'general-listening-140');
  assert.equal(lessons[140].id, 'general-listening-141');
  assert.equal(generalListeningGroupTitle(14), '情境詞彙');
  assert.equal(lessons.at(-1).id, 'general-listening-170');
  assert.equal(lessons.some((l) => l.id === 'general-listening-171'), false);
  assert.equal(lessons[149].id, 'general-listening-150');
  assert.equal(lessons[150].id, 'general-listening-151');
  assert.equal(generalListeningGroupTitle(15), '綜合聽解');
  assert.equal(lessons[159].id, 'general-listening-160');
  assert.equal(lessons[160].id, 'general-listening-161');
  assert.equal(generalListeningGroupTitle(16), '綜合聽解');
  assert.equal(
    generalListeningGroupTitle(17),
    generalListeningRoadmap[5].title,
  );
  assert.equal(generalListeningGroupTitle(18), '延伸練習');
});
