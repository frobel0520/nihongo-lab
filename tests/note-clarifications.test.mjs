import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { stages, gameCharacterStudy } from '../curriculum/lessons.mjs';
import { createStudyCatalog } from '../lib/catalog-build.mjs';
import { createCurriculumIndex } from '../lib/curriculum-index.mjs';
import { beforeCrossSentence } from './helpers/cross-sentence-scope.mjs';
import { sceneRecordId } from '../lib/scene-listening.mjs';
import { beforeNoteClarifications, noteClarificationBaseline as baseline } from './helpers/note-clarification-baseline.mjs';
const prior = beforeCrossSentence(stages);
const sha = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

test('T193 changes only the two authorized notes; every authored exercise, progress ID and media reference is preserved', () => {
  for (const entry of baseline.notes) {
    const lesson = stages.flatMap((s) => s.lessons).find((l) => l.id === entry.lessonId);
    assert.notEqual(lesson.grammar[entry.index].note, entry.note);
  }
  assert.equal(sha({ stages: beforeNoteClarifications(stages), gameCharacterStudy }), baseline.contentSha256);
  assert.equal(sha(createCurriculumIndex(prior, gameCharacterStudy)), baseline.summarySha256);
  assert.equal(sha(createStudyCatalog(prior, gameCharacterStudy)), baseline.catalogSha256);
  assert.equal(sha(prior.flatMap((s) => s.lessons).flatMap((l) =>
    (l.scene?.questions ?? []).map((q) => sceneRecordId(l, q)))), baseline.sceneIdsSha256);
});
