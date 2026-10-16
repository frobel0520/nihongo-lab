import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import {
  stages,
  gameCharacterStudy,
  curriculumSummary,
  loadLesson,
  loadCategory,
} from '../curriculum/lessons.mjs';
import { curriculumPayloads } from '../scripts/curriculum-chunks.mjs';
import { STUDY_CATALOG } from '../lib/study-catalog.mjs';
import { createStudyCatalog } from '../lib/catalog-build.mjs';
import { sceneRecordId } from '../lib/scene-listening.mjs';
import { listeningRecordId, trainingClips } from '../lib/anime-training.mjs';
import { grammarRecordId } from '../lib/grammar-study.mjs';
import { gameRecordId, gameListeningRecordId } from '../lib/game-study.mjs';
import { emptyProgress, recordDictation } from '../lib/progress.mjs';
import { summarize, schedule } from '../lib/srs.mjs';
import { lessonProgress } from '../lib/lesson-progress.mjs';
import {
  summarizeIds,
  indexedLessonProgress,
} from '../lib/curriculum-summary.mjs';
import { createPayloadLoader } from '../lib/payload-loader.mjs';
const baseline = JSON.parse(
  readFileSync(
    new URL('./fixtures/curriculum-557fec1.json', import.meta.url),
    'utf8',
  ),
);
const sha = (value) => createHash('sha256').update(value).digest('hex');
const lessons = stages.flatMap((s) => s.lessons);
test('T121: every pre-split progress identity and authored content matches 557fec1', () => {
  // 保留首次拆包前的95課快照；新增課程由下方 loader／統計及課程契約測試覆蓋。
  // 只還原該快照的清單標題，原有課程物件與進度 ID 仍逐 byte 比對，不能更新黃金雜湊掩蓋變動。
  const originalStages = stages.map((stage) => ({
    ...stage,
    title:
      stage.id === 'stage-1'
        ? '第 1 階段：動漫／遊戲通用聽解（前60課）'
        : stage.title,
    lessons: stage.lessons.filter(
      (lesson) =>
        !lesson.id.startsWith('general-listening-') ||
        Number(lesson.id.slice('general-listening-'.length)) <= 60,
    ),
  }));
  const originalLessons = originalStages.flatMap((stage) => stage.lessons);
  const originalCatalog = createStudyCatalog(
    originalStages,
    gameCharacterStudy,
  );
  const ids = {};
  for (const [k, c] of Object.entries(originalCatalog)) {
    ids[k + '.cards'] = c.cards.map((x) => x.id);
    ids[k + '.sentences'] = c.sentences.map((x) => x.id);
  }
  ids.scene = originalLessons.flatMap((l) =>
    (l.scene?.questions ?? []).map((q) => sceneRecordId(l, q)),
  );
  ids.listening = originalLessons.flatMap((l) =>
    l.training
      ? trainingClips(l.training).flatMap((c) =>
          c.questions.map((q) => listeningRecordId(l.id, c, q)),
        )
      : [],
  );
  ids.grammar = originalLessons.flatMap((l) =>
    l.grammar.flatMap((g) =>
      (g.study?.questions ?? []).map((q) => grammarRecordId(l.id, g, q)),
    ),
  );
  ids.games = gameCharacterStudy.flatMap((g) =>
    g.characters.flatMap((c) => c.lines.map(gameRecordId)),
  );
  ids.gameListening = gameCharacterStudy.flatMap((g) =>
    g.characters.flatMap((c) =>
      c.lines
        .filter((l) => l.category !== '角色選擇')
        .map(gameListeningRecordId),
    ),
  );
  for (const [key, values] of Object.entries(ids))
    assert.deepEqual(
      { count: values.length, sha256: sha(JSON.stringify([...values].sort())) },
      baseline[key],
      key,
    );
  assert.equal(
    sha(JSON.stringify({ stages: originalStages, gameCharacterStudy })),
    baseline.content.sha256,
  );
});
test('T121: browser payloads and public asynchronous loaders preserve lesson/category data', async () => {
  const payloads = curriculumPayloads();
  for (const l of lessons) {
    assert.equal(
      JSON.stringify(payloads.get('lesson/' + l.id).data),
      JSON.stringify(l),
    );
    assert.deepEqual(await loadLesson(l.id), l);
  }
  for (const [id, c] of Object.entries(STUDY_CATALOG)) {
    assert.deepEqual(payloads.get('category/' + id).data, c);
    assert.deepEqual(await loadCategory(id), c);
  }
  assert.equal(await loadLesson('unknown'), undefined);
});
test('T121: lightweight home and category statistics keep old semantics for fresh and mixed progress', () => {
  const cards = Object.values(STUDY_CATALOG).flatMap((c) => c.cards),
    ids = Object.values(curriculumSummary.categories).flatMap((c) => c.cardIds);
  let progress = emptyProgress();
  const check = () => {
    assert.deepEqual(
      summarizeIds(ids, progress.srs, '2026-10-15'),
      summarize(cards, progress.srs, '2026-10-15'),
    );
    assert.deepEqual(
      indexedLessonProgress(curriculumSummary, progress),
      lessonProgress(stages, progress),
    );
  };
  check();
  for (const [i, c] of cards.entries())
    if (i % 3 === 0)
      progress.srs[c.id] = schedule(
        undefined,
        'good',
        '2026-10-01',
        '2026-10-01T00:00:00.000Z',
      );
  for (const l of curriculumSummary.stages.flatMap((s) => s.lessons))
    for (const [i, id] of [
      ...l.dictationIds,
      ...l.listeningIds,
      ...l.grammarIds,
    ].entries()) {
      progress = recordDictation(
        progress,
        id,
        i % 2 === 0,
        '2026-10-15T00:00:00.000Z',
      );
      if (i % 4 === 0)
        progress = recordDictation(
          progress,
          id + ':wrong',
          true,
          '2026-10-15T00:00:00.000Z',
        );
    }
  check();
});
test('T121: rejected lazy requests remain retryable; successful concurrent requests share payload', async () => {
  let attempts = 0,
    notes = [];
  const data = { sample: true };
  const load = createPayloadLoader(
    {
      lesson: async () => {
        attempts++;
        if (attempts === 1) throw new Error('offline');
        return { default: { data, notes: ['reviewed'] } };
      },
    },
    (n) => {
      notes = n;
    },
  );
  await assert.rejects(load('lesson'), /offline/);
  const [a, b] = await Promise.all([load('lesson'), load('lesson')]);
  assert.equal(attempts, 2);
  assert.equal(a, data);
  assert.equal(b, data);
  assert.deepEqual(notes, ['reviewed']);
  assert.equal(await load('missing'), undefined);
});

import {
  packCurriculumIndex,
  unpackCurriculumIndex,
} from '../lib/curriculum-pack.mjs';
test('T121: transport ID interning preserves duplicates, category membership and all summary fields', () => {
  assert.deepEqual(
    unpackCurriculumIndex(
      JSON.parse(JSON.stringify(packCurriculumIndex(curriculumSummary))),
    ),
    curriculumSummary,
  );
});

test('T125: preserve all 105 pre-batch lessons and game data from 8e68cc0', () => {
  const snapshot = JSON.parse(
    readFileSync(
      new URL('./fixtures/curriculum-8e68cc0.json', import.meta.url),
      'utf8',
    ),
  );
  const previousStages = stages.map((stage) => ({
    ...stage,
    title:
      stage.id === 'stage-1'
        ? '第 1 階段：動漫／遊戲通用聽解（前70課）'
        : stage.title,
    lessons: stage.lessons.filter(
      (lesson) =>
        !lesson.id.startsWith('general-listening-') ||
        Number(lesson.id.slice('general-listening-'.length)) <= 70,
    ),
  }));
  assert.equal(previousStages.flatMap((stage) => stage.lessons).length, 105);
  assert.equal(
    sha(JSON.stringify({ stages: previousStages, gameCharacterStudy })),
    snapshot.sha256,
  );
});

test('T126: preserve all 115 pre-batch lessons and game data from 3db36e6', () => {
  const snapshot = JSON.parse(
    readFileSync(
      new URL('./fixtures/curriculum-3db36e6.json', import.meta.url),
      'utf8',
    ),
  );
  const previousStages = stages.map((stage) => ({
    ...stage,
    title:
      stage.id === 'stage-1'
        ? '第 1 階段：動漫／遊戲通用聽解（前80課）'
        : stage.title,
    lessons: stage.lessons.filter(
      (lesson) =>
        !lesson.id.startsWith('general-listening-') ||
        Number(lesson.id.slice('general-listening-'.length)) <= 80,
    ),
  }));
  assert.equal(previousStages.flatMap((stage) => stage.lessons).length, 115);
  assert.equal(
    sha(JSON.stringify({ stages: previousStages, gameCharacterStudy })),
    snapshot.sha256,
  );
});

test('T127: preserve all 125 pre-batch lessons and game data from 4df01d4', () => {
  const snapshot = JSON.parse(
    readFileSync(
      new URL('./fixtures/curriculum-4df01d4.json', import.meta.url),
      'utf8',
    ),
  );
  const previousStages = stages.map((stage) => ({
    ...stage,
    title:
      stage.id === 'stage-1'
        ? '第 1 階段：動漫／遊戲通用聽解（前90課）'
        : stage.title,
    lessons: stage.lessons.filter(
      (lesson) =>
        !lesson.id.startsWith('general-listening-') ||
        Number(lesson.id.slice('general-listening-'.length)) <= 90,
    ),
  }));
  assert.equal(previousStages.flatMap((stage) => stage.lessons).length, 125);
  assert.equal(
    sha(JSON.stringify({ stages: previousStages, gameCharacterStudy })),
    snapshot.sha256,
  );
});

test('T128: preserve all 135 pre-batch lessons and game data from 0dcbd8e', () => {
  const snapshot = JSON.parse(
    readFileSync(
      new URL('./fixtures/curriculum-0dcbd8e.json', import.meta.url),
      'utf8',
    ),
  );
  const previousStages = stages.map((stage) => ({
    ...stage,
    title:
      stage.id === 'stage-1'
        ? '第 1 階段：動漫／遊戲通用聽解（前100課）'
        : stage.title,
    lessons: stage.lessons.filter(
      (lesson) =>
        !lesson.id.startsWith('general-listening-') ||
        Number(lesson.id.slice('general-listening-'.length)) <= 100,
    ),
  }));
  assert.equal(previousStages.flatMap((stage) => stage.lessons).length, 135);
  assert.equal(
    sha(JSON.stringify({ stages: previousStages, gameCharacterStudy })),
    snapshot.sha256,
  );
});

test('T129: preserve all 145 pre-batch lessons and game data from be256e2', () => {
  const snapshot = JSON.parse(
    readFileSync(
      new URL('./fixtures/curriculum-be256e2.json', import.meta.url),
      'utf8',
    ),
  );
  const previousStages = stages.map((stage) => ({
    ...stage,
    title:
      stage.id === 'stage-1'
        ? '第 1 階段：動漫／遊戲通用聽解（前110課）'
        : stage.title,
    lessons: stage.lessons.filter(
      (lesson) =>
        !lesson.id.startsWith('general-listening-') ||
        Number(lesson.id.slice('general-listening-'.length)) <= 110,
    ),
  }));
  assert.equal(previousStages.flatMap((stage) => stage.lessons).length, 145);
  assert.equal(
    sha(JSON.stringify({ stages: previousStages, gameCharacterStudy })),
    snapshot.sha256,
  );
});

test('T130: preserve all 155 pre-batch lessons and game data from 73c88e1', () => {
  const snapshot = JSON.parse(
    readFileSync(
      new URL('./fixtures/curriculum-73c88e1.json', import.meta.url),
      'utf8',
    ),
  );
  const previousStages = stages.map((stage) => ({
    ...stage,
    title:
      stage.id === 'stage-1'
        ? '第 1 階段：動漫／遊戲通用聽解（前120課）'
        : stage.title,
    lessons: stage.lessons.filter(
      (lesson) =>
        !lesson.id.startsWith('general-listening-') ||
        Number(lesson.id.slice('general-listening-'.length)) <= 120,
    ),
  }));
  assert.equal(previousStages.flatMap((stage) => stage.lessons).length, 155);
  assert.equal(
    sha(JSON.stringify({ stages: previousStages, gameCharacterStudy })),
    snapshot.sha256,
  );
});

test('T131: preserve all 165 pre-batch lessons and game data from 3690d07', () => {
  const snapshot = JSON.parse(
    readFileSync(
      new URL('./fixtures/curriculum-3690d07.json', import.meta.url),
      'utf8',
    ),
  );
  const previousStages = stages.map((stage) => ({
    ...stage,
    title:
      stage.id === 'stage-1'
        ? '第 1 階段：動漫／遊戲通用聽解（前130課）'
        : stage.title,
    lessons: stage.lessons.filter(
      (lesson) =>
        !lesson.id.startsWith('general-listening-') ||
        Number(lesson.id.slice('general-listening-'.length)) <= 130,
    ),
  }));
  assert.equal(previousStages.flatMap((stage) => stage.lessons).length, 165);
  assert.equal(
    sha(JSON.stringify({ stages: previousStages, gameCharacterStudy })),
    snapshot.sha256,
  );
});
