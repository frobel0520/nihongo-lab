// T188：奇偶不列入角色語音。資料與音檔留在 repo 供歷史批次核對，瀏覽器教材由此過濾。
export const HIDDEN_GAME_CHARACTERS = new Set([
  'genshin:manekin',
  'genshin:manekina',
]);

/**
 * Remove hidden characters and restate the roster figures shown to learners.
 * @template {{ id: string, scope: string, characters: { id: string, lines: unknown[] }[] }} G
 * @param {G[]} study
 * @returns {G[]}
 */
export function visibleGameStudy(study) {
  return study.map((game) => {
    const characters = game.characters.filter(
      (c) => !HIDDEN_GAME_CHARACTERS.has(`${game.id}:${c.id}`),
    );
    if (characters.length === game.characters.length) return game;
    const learnable = characters.filter((c) => c.lines.length);
    const lines = learnable.reduce((n, c) => n + c.lines.length, 0);
    const scope = game.scope
      .replace(/共 \d+ 筆角色條目/, `共 ${characters.length} 筆角色條目`)
      .replace('包含旅行者與人偶的不同版本', '包含旅行者的不同版本，奇偶不列入')
      .replace(
        /\d+ 位角色收錄 \d+ 句/,
        `${learnable.length} 位角色收錄 ${lines} 句`,
      )
      .replace(
        /其餘 \d+ 筆/,
        `其餘 ${characters.length - learnable.length} 筆`,
      );
    return { ...game, characters, scope };
  });
}
