import { test } from 'node:test';
import { beforeInference } from './helpers/inference-baseline.mjs';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { stages, gameCharacterStudy } from '../curriculum/lessons.mjs';
import { sceneRecordId } from '../lib/scene-listening.mjs';
const baseline = JSON.parse(readFileSync(new URL('./fixtures/curriculum-cfea830-quality.json', import.meta.url), 'utf8'));
const historicalStages = beforeInference(stages);
const lessons = historicalStages.flatMap(s => s.lessons);
const old51 = baseline.lessons.find(l => l.id === 'general-listening-51');
const old175 = baseline.lessons.find(l => l.id === 'general-listening-175');
const current51 = lessons.find(l => l.id === old51.id);
const current175 = lessons.find(l => l.id === old175.id);
test('T137: rashii introduces the nominal exception without changing correct example contrasts', () => {
  // Required linguistic distinction, not a snapshot of editorial wording.
  assert.match(current51.grammar[1].note, /名詞.*な形容詞.*非過去肯定.*(?:不加|省略|去掉)だ/);
  assert.deepEqual(current51.grammar[1].examples, old51.grammar[1].examples);
  const restored = structuredClone(current51);
  restored.grammar[1].note = old51.grammar[1].note;
  assert.deepEqual(restored, old51);
});
test('T137: only approved 175 changes; revised sound and all scene identities change', () => {
  const restored = structuredClone(current175);
  assert.deepEqual(restored.dialogue.slice(0, 5), old175.dialogue.slice(0, 5));
  assert.notEqual(restored.dialogue[5].jp, old175.dialogue[5].jp);
  assert.notEqual(restored.dialogue[5].audio, old175.dialogue[5].audio);
  assert.equal(restored.dialogue[5].voice, old175.dialogue[5].voice);
  restored.dialogue[5] = old175.dialogue[5];
  restored.practice[2] = old175.practice[2];
  restored.scene.questions[2].prompt = old175.scene.questions[2].prompt;
  restored.scene.questions[2].explanation = old175.scene.questions[2].explanation;
  assert.deepEqual(restored, old175);
  for (const q of current175.scene.questions) {
    assert.notEqual(sceneRecordId(current175, q), sceneRecordId(old175, old175.scene.questions.find(x => x.id === q.id)));
  }
});
test('T137: all other lessons, games and 537 unaffected scene records match cfea830', () => {
  const ids = new Set(baseline.lessons.map(l => l.id));
  const unchanged = historicalStages.map(s => ({ ...s, lessons: s.lessons.filter(l => !ids.has(l.id)) }));
  assert.equal(createHash('sha256').update(JSON.stringify({ stages: unchanged, gameCharacterStudy })).digest('hex'), baseline.unaffectedSha256);
  const sceneIds = lessons.filter(l => l.scene && l.id !== old175.id).flatMap(l => l.scene.questions.map(q => [l.id, q.id, sceneRecordId(l, q)]));
  assert.deepEqual(sceneIds, baseline.sceneIds.filter(([id]) => id !== old175.id));
});
