import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { stages, gameCharacterStudy } from '../curriculum/lessons.mjs';
import { wordingBaseline as baseline, beforeRelativeClauseWording } from './helpers/relative-clause-baseline.mjs';

test('T141: the explanatory note is the only authored change from e356eb4', () => {
  const point = stages.flatMap(s => s.lessons).find(l => l.id === baseline.lessonId).grammar[baseline.pointIndex];
  assert.equal(point.pattern, baseline.pattern);
  const historical = { stages: beforeRelativeClauseWording(stages), gameCharacterStudy };
  assert.equal(createHash('sha256').update(JSON.stringify(historical)).digest('hex'), baseline.contentSha256);
});
