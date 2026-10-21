import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { stages, gameCharacterStudy, curriculumSummary, loadAllAudioPaths } from '../curriculum/lessons.mjs';
import { STUDY_CATALOG } from '../lib/study-catalog.mjs';
import { sceneRecordId } from '../lib/scene-listening.mjs';
import { grammarRecordId } from '../lib/grammar-study.mjs';
import { listeningRecordId, trainingClips } from '../lib/anime-training.mjs';
import { gameRecordId, gameListeningRecordId } from '../lib/game-study.mjs';
import { beforeReviewCloseout, reviewBaseline as baseline } from './helpers/review-closeout-baseline.mjs';
const sha = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const lessons = stages.flatMap(s => s.lessons);

test('T149: only five reviewed notes, one translation and the explicit metadata field may change', () => {
  assert.equal(sha({ stages: beforeReviewCloseout(stages), gameCharacterStudy }), baseline.contentSha256);
  for (const e of baseline.notes)
    assert.notEqual(lessons.find(l => l.id === e.lessonId).grammar[e.index].note, e.note);
  const t = baseline.translation;
  assert.notEqual(lessons.find(l => l.id === t.lessonId).grammar[t.pointIndex].examples[t.exampleIndex].zh, t.zh);
});

test('T149: wording preserves all existing progress identities, summary and audio references', async () => {
  const records = {
    catalog: Object.fromEntries(Object.entries(STUDY_CATALOG).map(([k,v]) => [k,{cards:v.cards.map(x=>x.id),sentences:v.sentences.map(x=>x.id)}])),
    scene: lessons.flatMap(l => (l.scene?.questions ?? []).map(q => sceneRecordId(l,q))),
    grammar: lessons.flatMap(l => l.grammar.flatMap(g => (g.study?.questions ?? []).map(q => grammarRecordId(l.id,g,q)))),
    listening: lessons.flatMap(l => l.training ? trainingClips(l.training).flatMap(c => c.questions.map(q => listeningRecordId(l.id,c,q))) : []),
    games: gameCharacterStudy.flatMap(g => g.characters.flatMap(c => c.lines.map(gameRecordId))),
    gameListening: gameCharacterStudy.flatMap(g => g.characters.flatMap(c => c.lines.filter(l => l.category !== '角色選擇').map(gameListeningRecordId))),
  };
  for (const [key, value] of Object.entries(records)) assert.equal(sha(value),baseline.records[key].sha256,key);
  assert.equal(sha(curriculumSummary),baseline.summarySha256);
  assert.equal(sha(await loadAllAudioPaths()),baseline.audioPathsSha256);
});
