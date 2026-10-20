import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { stages, gameCharacterStudy, curriculumSummary, loadAllAudioPaths } from '../curriculum/lessons.mjs';
import { STUDY_CATALOG } from '../lib/study-catalog.mjs';
import { sceneRecordId } from '../lib/scene-listening.mjs';
import { grammarRecordId } from '../lib/grammar-study.mjs';
import { listeningRecordId, trainingClips } from '../lib/anime-training.mjs';
import { gameRecordId, gameListeningRecordId } from '../lib/game-study.mjs';
import { jlptBaseline as baseline, beforeJlptMetadata } from './helpers/jlpt-baseline.mjs';
const sha = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const lessons = stages.flatMap(s => s.lessons);

test('T140: only reviewed JLPT fields change; existing tags and all authored content match 069b0f2', () => {
  for (const entry of baseline.approvedTags) {
    const point = lessons.find(l => l.id === entry.lessonId).grammar[entry.index];
    assert.equal(point.pattern, entry.pattern);
    assert.deepEqual(point.jlpt, entry.jlpt, `${entry.lessonId} grammar ${entry.index + 1}`);
  }
  assert.equal(sha({ stages: beforeJlptMetadata(stages), gameCharacterStudy }), baseline.contentSha256);
});

test('T140: metadata preserves every SRS/dictation/listening/grammar/game identity, summary and audio reference', async () => {
  assert.equal(sha(STUDY_CATALOG), baseline.catalogSha256);
  assert.equal(sha(curriculumSummary), baseline.summarySha256);
  assert.equal(sha(await loadAllAudioPaths()), baseline.audioPathsSha256);
  const records = {
    scene: lessons.flatMap(l => (l.scene?.questions ?? []).map(q => sceneRecordId(l, q))),
    grammar: lessons.flatMap(l => l.grammar.flatMap(g => (g.study?.questions ?? []).map(q => grammarRecordId(l.id, g, q)))),
    listening: lessons.flatMap(l => l.training ? trainingClips(l.training).flatMap(c => c.questions.map(q => listeningRecordId(l.id, c, q))) : []),
    games: gameCharacterStudy.flatMap(g => g.characters.flatMap(c => c.lines.map(gameRecordId))),
    gameListening: gameCharacterStudy.flatMap(g => g.characters.flatMap(c => c.lines.filter(l => l.category !== '角色選擇').map(gameListeningRecordId))),
  };
  for (const [key, values] of Object.entries(records)) assert.deepEqual({ count: values.length, sha256: sha(values) }, baseline.records[key], key);
});
