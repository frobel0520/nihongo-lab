import { stages, gameCharacterStudy } from '../curriculum/lessons.mjs';
import { buildCards } from './srs.mjs';
import { buildSentences } from './dictation.mjs';
import { gameRecordId } from './game-study.mjs';
import { STUDY_CATEGORIES } from './study-categories.mjs';
/** @typedef {{ cards: import('./srs.mjs').Card[], sentences: import('./dictation.mjs').Sentence[] }} StudyCatalog */
/** @type {Record<string, StudyCatalog>} */
export const STUDY_CATALOG = {};
for (const category of STUDY_CATEGORIES) {
  if (category.id !== 'games') {
    const selected = stages.filter((stage) => stage.id === category.stageId);
    STUDY_CATALOG[category.id] = {
      cards: buildCards(selected),
      sentences: buildSentences(selected),
    };
    continue;
  }
  const rows = gameCharacterStudy.flatMap((game) =>
    game.characters.flatMap((character) =>
      character.lines
        .filter((line) => line.audioReady !== false)
        .map((line) => ({
          line,
          lessonId: `${game.id}:${character.id}`,
          lessonTitle: `${game.title} · ${character.name}`,
        })),
    ),
  );
  STUDY_CATALOG.games = {
    cards: rows.map(({ line, lessonId, lessonTitle }) => ({
      id: `game-card:${gameRecordId(line)}`,
      word: line.jp,
      reading: line.reading,
      zh: line.zh,
      audio: line.audio,
      audioReady: true,
      lessonId,
      lessonTitle,
    })),
    sentences: rows.map(({ line, lessonId, lessonTitle }) => ({
      id: gameRecordId(line),
      jp: line.jp,
      reading: line.reading,
      zh: line.zh,
      audio: line.audio,
      lessonId,
      lessonTitle,
      source: 'quote',
    })),
  };
}
