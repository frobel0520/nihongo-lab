import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STUDY_CATALOG } from '../lib/study-catalog.mjs';
import { STUDY_CATEGORIES } from '../lib/study-categories.mjs';
import { buildCards } from '../lib/srs.mjs';
import { buildSentences } from '../lib/dictation.mjs';
import { stages, gameCharacterStudy } from '../curriculum/lessons.mjs';
import { parseRoute, studyHash } from '../lib/route.mjs';
import { gameRecordId } from '../lib/game-study.mjs';
test('四類教材隔離且保留既有卡片、句子與進度id', () => {
  for (const c of STUDY_CATEGORIES.filter((c) => c.id !== 'games')) {
    const selected = stages.filter((s) => s.id === c.stageId);
    assert.deepEqual(STUDY_CATALOG[c.id].cards, buildCards(selected));
    assert.deepEqual(STUDY_CATALOG[c.id].sentences, buildSentences(selected));
  }
  const ready = gameCharacterStudy.flatMap((g) =>
    g.characters.flatMap((c) => c.lines.filter((l) => l.audioReady !== false)),
  );
  assert.deepEqual(
    STUDY_CATALOG.games.sentences.map((s) => s.id),
    ready.map(gameRecordId),
  );
  assert.equal(
    new Set(STUDY_CATALOG.games.cards.map((c) => c.id)).size,
    ready.length,
  );
  assert.ok(
    STUDY_CATALOG.games.cards.every(
      (c) => c.audioReady && c.id.startsWith('game-card:'),
    ),
  );
  const old = new Set(buildCards(stages).map((c) => c.id));
  assert.ok(STUDY_CATALOG.games.cards.every((c) => !old.has(c.id)));
  assert.equal(STUDY_CATALOG.general.sentences.length, 800);
  for (let n = 61; n <= 80; n++) {
    const id = `general-listening-${n}`;
    assert.equal(
      STUDY_CATALOG.general.cards.filter((c) => c.lessonId === id).length,
      25,
    );
    assert.equal(
      STUDY_CATALOG.general.sentences.filter((s) => s.lessonId === id).length,
      10,
    );
  }
});
test('教材類別在切換複習模式及重載時可由URL還原，未知類別回選擇入口', () => {
  for (const c of STUDY_CATEGORIES)
    for (const view of ['srs', 'dictation', 'shadowing']) {
      assert.deepEqual(parseRoute(studyHash(view, c.id)), {
        view,
        category: c.id,
      });
      if (view === 'srs')
        assert.deepEqual(parseRoute(studyHash(view, c.id, 'new')), {
          view,
          srsMode: 'new',
          category: c.id,
        });
    }
  assert.deepEqual(parseRoute('#/dictation?category=unknown'), {
    view: 'dictation',
  });
  assert.deepEqual(parseRoute('#/srs/new?category=unknown'), {
    view: 'srs',
    srsMode: 'new',
  });
});
