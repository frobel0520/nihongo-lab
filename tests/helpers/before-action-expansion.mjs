// T168: project only this explicitly identified addition out of older golden tests.
// Historical hashes remain unchanged; the current cohort and all old line objects
// are independently asserted in genshin-action-expansion.test.mjs.
import { stages, gameCharacterStudy } from '../../curriculum/lessons.mjs';
import { genshinActionExpansion } from '../../curriculum/genshin-action-expansion.mjs';
import { createStudyCatalog } from '../../lib/catalog-build.mjs';
import { createCurriculumIndex } from '../../lib/curriculum-index.mjs';
import { allAudioPaths } from '../../lib/offline.mjs';
import { gameRecordId } from '../../lib/game-study.mjs';
export const expansionLineIds = new Set(genshinActionExpansion.map(x => `genshin:${x.characterId}:${x.key}`));
const expansionCardIds = new Set(gameCharacterStudy.flatMap(g=>g.characters.flatMap(c=>c.lines)).filter(l=>expansionLineIds.has(l.id)).map(l=>'game-card:'+gameRecordId(l)));
export const publishedCards = cards => cards.filter(c=>!expansionCardIds.has(c.id));
export const historicalGameCharacterStudy = gameCharacterStudy.map(game => ({
  ...game,
  ...(game.id === 'genshin' ? { scope: "固定來源名冊共 124 筆角色條目，包含旅行者與人偶的不同版本。124 位角色收錄 372 句短台詞與 VOICEVOX 朗讀；其餘 0 筆仍待教材。迪盧克的技能來源只有喊聲，沒有編造完整台詞；未加入劇情。" } : {}),
  characters: game.characters.map(character=>({...character,lines:character.lines.filter(line=>!expansionLineIds.has(line.id))})),
}));
export const historicalCatalog = createStudyCatalog(stages, historicalGameCharacterStudy);
export const historicalSummary = createCurriculumIndex(stages, historicalGameCharacterStudy);
export const historicalAudioPaths = async () => allAudioPaths(stages, historicalGameCharacterStudy.flatMap(g=>g.characters.flatMap(c=>c.lines.filter(l=>l.audioReady!==false).map(l=>l.audio))));
