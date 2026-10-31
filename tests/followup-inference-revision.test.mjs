import { historicalGameCharacterStudy as gameCharacterStudy } from './helpers/before-action-expansion.mjs';
import { beforeReviewCloseout } from './helpers/review-closeout-baseline.mjs';
import { test } from 'node:test';
import { beforeJlptMetadata } from './helpers/jlpt-baseline.mjs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { stages, curriculumSummary } from '../curriculum/lessons.mjs';
import { createStudyCatalog } from '../lib/catalog-build.mjs';
import { sceneRecordId } from '../lib/scene-listening.mjs';
import { emptyProgress, recordDictation, parseProgress, serializeProgress } from '../lib/progress.mjs';
import { lessonProgress } from '../lib/lesson-progress.mjs';
import { indexedLessonProgress } from '../lib/curriculum-summary.mjs';
import { followupInferenceBaseline as baseline } from './helpers/followup-inference-baseline.mjs';
const sha = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const historicalStages = beforeJlptMetadata(stages);
const lessons = historicalStages.flatMap(s => s.lessons);
const ids = new Set(baseline.lessons.map(l => l.id));

test('T139: only question 3 in 158/166/177 changes; all other authored fields and catalog identities match 8c0c02f', () => {
  for (const old of baseline.lessons) {
    const current = lessons.find(l => l.id === old.id);
    assert.equal(current.scene.questions.length, 3);
    const revised = current.scene.questions[2];
    assert.equal(revised.id, old.scene.questions[2].id);
    assert.notEqual(revised.prompt, old.scene.questions[2].prompt);
    assert.notEqual(sceneRecordId(current, revised), sceneRecordId(old, old.scene.questions[2]));
    const restored = structuredClone(current);
    restored.scene.questions[2] = old.scene.questions[2];
    assert.equal(sha(restored), old.lessonSha256, 'no dialogue, sound, basic question, vocabulary or grammar edits');
  }
  assert.equal(sha({ stages: historicalStages.map(s => ({ ...s, lessons: s.lessons.filter(l => !ids.has(l.id)) })), gameCharacterStudy }), baseline.unaffectedSha256);
  assert.equal(sha(createStudyCatalog(beforeReviewCloseout(stages), gameCharacterStudy)), baseline.catalogSha256, 'all SRS and dictation materials unchanged');
  assert.equal(sha(lessons.filter(l => l.scene).flatMap(l => l.scene.questions.filter(q => !ids.has(l.id) || q.id !== 'understanding-3').map(q => sceneRecordId(l, q)))), baseline.unaffectedSceneSha256, '537 current scene IDs, including revised 51/175 and T138, unchanged');
});

test('T139: old v3 answers stay stored but do not complete new inference questions; basics stay complete', () => {
  let progress = emptyProgress();
  for (const old of baseline.lessons) for (const q of old.scene.questions) progress = recordDictation(progress, sceneRecordId(old, q), true, '2026-10-01T00:00:00.000Z');
  const oldProgress = structuredClone(progress);
  for (const old of baseline.lessons) {
    const current = lessons.find(l => l.id === old.id);
    assert.deepEqual(lessonProgress(stages, progress)[old.id].listening, { done: 2, total: 3 });
    assert.deepEqual(indexedLessonProgress(curriculumSummary, progress)[old.id].listening, { done: 2, total: 3 });
    progress = recordDictation(progress, sceneRecordId(current, current.scene.questions[2]), true, '2026-10-20T00:00:00.000Z');
    assert.deepEqual(lessonProgress(stages, progress)[old.id].listening, { done: 3, total: 3 });
  }
  const parsed = parseProgress(serializeProgress(progress));
  assert.equal(parsed.problem, null);
  assert.equal(parsed.progress.version, 3);
  for (const [id, record] of Object.entries(oldProgress.dictation)) assert.deepEqual(parsed.progress.dictation[id], record);
  assert.equal(Object.keys(parsed.progress.dictation).length, 12);
});
