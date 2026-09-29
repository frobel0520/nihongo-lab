import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stages } from '../curriculum/lessons.mjs';

test('stages 涵蓋學習路線第 0 到第 3 階段', () => {
  assert.equal(stages.length, 4);
  assert.deepEqual(
    stages.map((stage) => stage.id),
    ['stage-0', 'stage-1', 'stage-2', 'stage-3'],
  );
});

test('每個 stage 有 id、title 與 lessons 陣列', () => {
  for (const stage of stages) {
    assert.equal(typeof stage.id, 'string');
    assert.equal(typeof stage.title, 'string');
    assert.ok(Array.isArray(stage.lessons));
  }
});
