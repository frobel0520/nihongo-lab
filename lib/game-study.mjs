import { gameMeaningDistractors } from '../curriculum/lessons.mjs';
import { contentHash } from '../curriculum/author.mjs';
/** @param {import('../curriculum/game-character-study.mjs').GameLine} line */
export const gameRecordId = (line) => `game:${line.id}:${contentHash(line.jp)}`;
/** @param {import('../curriculum/game-character-study.mjs').GameStudy[]} games @param {string} gameId @param {string} [characterId] @param {string} [category] */
export function gameLines(games, gameId, characterId = '', category = '') {
  const game = games.find((g) => g.id === gameId);
  return (game?.characters ?? [])
    .filter((c) => !characterId || c.id === characterId)
    .flatMap((character) =>
      character.lines.map((line) => ({ character, line })),
    )
    .filter(({ line }) => !category || line.category === category);
}
/** @param {import('../curriculum/game-character-study.mjs').GameLine[]} lines @param {import('./progress.mjs').Progress} progress */
export const gameDone = (lines, progress) =>
  lines.filter((line) => progress.dictation[gameRecordId(line)]?.passed).length;

/** @param {import('../curriculum/game-character-study.mjs').GameLine} line */
export function gameListeningQuestion(line) {
  const distractors = gameMeaningDistractors[line.id];
  if (!distractors) throw new Error('這句尚未提供聽力題');
  const options = [line.zh, ...distractors];
  const answer =
    parseInt(contentHash(line.id).slice(0, 2), 16) % options.length;
  return {
    id: 'meaning',
    prompt:
      line.category === '武器詞彙'
        ? '剛才唸的是哪組武器詞彙？'
        : '這句話主要在表達什麼？',
    options: [
      ...options.slice(options.length - answer),
      ...options.slice(0, options.length - answer),
    ],
    answer,
    explanation: line.note,
  };
}
/** @param {import('../curriculum/game-character-study.mjs').GameLine} line */
export function gameListeningRecordId(line) {
  const q = gameListeningQuestion(line);
  return `game-listening:${line.id}:${contentHash(JSON.stringify([line.jp, q.prompt, q.options, q.answer]))}`;
}
/** @param {import('../curriculum/game-character-study.mjs').GameLine[]} lines @param {import('./progress.mjs').Progress} progress */
export const gameListeningDone = (lines, progress) =>
  lines.filter((line) => line.category !== '角色選擇').filter(
    (line) => progress.dictation[gameListeningRecordId(line)]?.passed,
  ).length;
