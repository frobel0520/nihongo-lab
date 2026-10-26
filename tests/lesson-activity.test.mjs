import { test } from 'node:test';
import assert from 'node:assert/strict';
import { curriculumSummary } from '../curriculum/lessons.mjs';
import {
  emptyProgress,
  recordDictation,
  serializeProgress,
} from '../lib/progress.mjs';
import {
  hasLessonActivity,
  indexedLessonProgress,
} from '../lib/curriculum-summary.mjs';
import { schedule } from '../lib/srs.mjs';
import { recordGrammarAnswer } from '../lib/grammar-study.mjs';
const lessons = curriculumSummary.stages.flatMap((s) => s.lessons);
const today = '2026-10-26',
  at = today + 'T00:00:00.000Z';
test('started includes a saved wrong dictation attempt without awarding completion or changing progress', () => {
  const lesson = lessons.find((l) => l.dictationIds.length);
  const progress = recordDictation(
    emptyProgress(),
    lesson.dictationIds[0],
    false,
    at,
  );
  const before = serializeProgress(progress);
  assert.equal(hasLessonActivity(lesson, emptyProgress()), false);
  assert.equal(hasLessonActivity(lesson, progress), true);
  assert.equal(
    indexedLessonProgress(curriculumSummary, progress)[lesson.id].ratio,
    0,
  );
  assert.equal(serializeProgress(progress), before);
  assert.equal(
    hasLessonActivity(
      lessons.find((l) => l.id !== lesson.id),
      progress,
    ),
    false,
  );
});
test('started includes listening attempts, passed questions and vocabulary ratings', () => {
  const scene = lessons.find((l) => l.listeningIds.length);
  assert.equal(
    hasLessonActivity(
      scene,
      recordDictation(emptyProgress(), scene.listeningIds[0], false, at),
    ),
    true,
  );
  const lesson = lessons.find(
    (l) => l.dictationIds.length && l.vocabIds.length,
  );
  assert.equal(
    hasLessonActivity(
      lesson,
      recordDictation(emptyProgress(), lesson.dictationIds[0], true, at),
    ),
    true,
  );
  const grammar = lessons.find((l) => l.grammarIds.length);
  assert.equal(
    hasLessonActivity(
      grammar,
      recordGrammarAnswer(emptyProgress(), grammar.grammarIds[0], false, at),
    ),
    true,
  );
  const progress = emptyProgress();
  progress.srs[lesson.vocabIds[0]] = schedule(undefined, 'again', today, at);
  assert.equal(hasLessonActivity(lesson, progress), true);
});
