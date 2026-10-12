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
