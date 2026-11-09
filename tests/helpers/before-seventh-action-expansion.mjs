// T174: explicit new cohort removed only for immutable published snapshot checks.
import { gameCharacterStudy } from '../../curriculum/lessons.mjs';
import { VOCAB_ILLUSTRATIONS } from '../../lib/vocab-illustrations.mjs';
import { AUDIO_PROSODY } from '../../curriculum/audio-prosody.mjs';
import { gameRecordId } from '../../lib/game-study.mjs';
export const seventhLineIds = new Set([
  'genshin:baizhu:burst-82052',
  'genshin:cyno:burst-71057',
  'genshin:emilie:burst-99048',
  'genshin:eula:burst-39064',
  'genshin:freminet:skill-85050',
  'genshin:gorou:burst-55050',
  'genshin:kaedeharakazuha:burst-40056',
  'genshin:kamisatoayaka:burst-3151',
  'genshin:kamisatoayato:burst-66048',
  'genshin:kamisatoayato:burst-66050',
  'genshin:navia:skill-91051',
  'genshin:neuvillette:skill-87053',
  'genshin:raiden:burst-52059',
  'genshin:sethos:skill-97047',
  'genshin:wanderer:burst-75060',
  'genshin:wriothesley:burst-86049',
  'genshin:xianyun:burst-93050',
  'genshin:xingqiu:skill-13057',
  'genshin:xingqiu:burst-13060',
  'genshin:yaemiko:burst-58050',
  'genshin:yanfei:burst-38057',
  'genshin:yumemizukimizuki:skill-109049',
  'genshin:alyosha:burst-table-51-0',
  'genshin:alyosha:burst-table-52-0',
  'genshin:skirk:burst-table-52-0',
  'genshin:vesna:burst-table-60-0',
  'genshin:vodyanitsa:skill-table-53-0',
]);
export const seventhAssetNames = new Set([
  'abilitybittertosweet.svg',
  'abilityweighsins.svg',
  'abilityfragrantnarrative.svg',
  'abilityiceendgrudge.svg',
  'abilityclockworkpenguin.svg',
  'abilitysoundbeforecharge.svg',
  'abilitycloudwildgeese.svg',
  'abilityfrostextinction.svg',
  'abilityautumnsword.svg',
  'abilitywaterenclosure.svg',
  'abilitylowerheadorder.svg',
  'abilityquietextinction.svg',
  'abilitymutualstepback.svg',
  'abilityscornfulgaze.svg',
  'abilityfaceguilt.svg',
  'abilitywindswingflight.svg',
  'abilityrainhardtopaint.svg',
  'abilityguhuasecretart.svg',
  'abilitymysteriousthunder.svg',
  'abilityredironpledge.svg',
  'abilitydreamtherapy.svg',
  'abilitysendforward.svg',
  'abilityplayfreelyorder.svg',
  'abilitysinkabyssalsea.svg',
  'abilityoffertoempress.svg',
  'abilityshowowntail.svg',
]);
export const seventhProsodyPaths = new Set([
  'audio/games/genshin/gram-0a69d84e21.mp3',
  'audio/games/genshin/gram-5dbb85907b.mp3',
  'audio/games/genshin/gram-f8a51dc17c.mp3',
  'audio/games/genshin/gram-e2b2ad8980.mp3',
  'audio/games/genshin/gram-1ef58ece4e.mp3',
  'audio/games/genshin/gram-febadb6bdf.mp3',
  'audio/games/genshin/gram-ecffa7f08c.mp3',
  'audio/games/genshin/gram-aee13476ea.mp3',
  'audio/games/genshin/gram-381d46eef3.mp3',
  'audio/games/genshin/gram-0b511c97cf.mp3',
  'audio/games/genshin/gram-8fa4e91799.mp3',
  'audio/games/genshin/gram-b4b47c29c7.mp3',
]);
export const seventhCardIds = new Set(
  gameCharacterStudy
    .flatMap((g) => g.characters.flatMap((c) => c.lines))
    .filter((l) => seventhLineIds.has(l.id))
    .map((l) => 'game-card:' + gameRecordId(l)),
);
export const beforeSeventhGameCharacterStudy = gameCharacterStudy.map((g) => ({
  ...g,
  characters: g.characters.map((c) => ({
    ...c,
    lines: c.lines.filter((l) => !seventhLineIds.has(l.id)),
  })),
}));
export const beforeSeventhCards = (cards) =>
  cards.filter((c) => !seventhCardIds.has(c.id));
export const beforeSeventhIllustrations = VOCAB_ILLUSTRATIONS.filter(
  (c) => !seventhCardIds.has(c.id),
);
export const beforeSeventhProsody = Object.fromEntries(
  Object.entries(AUDIO_PROSODY).filter(
    ([path]) => !seventhProsodyPaths.has(path),
  ),
);
for (const g of beforeSeventhGameCharacterStudy) {
  if (g.id !== 'genshin') continue;
  const learned = g.characters.filter((c) => c.lines.length);
  g.scope = `固定來源名冊共 ${g.characters.length} 筆角色條目，包含旅行者與人偶的不同版本。${learned.length} 位角色收錄 ${learned.reduce((n, c) => n + c.lines.length, 0)} 句短台詞與 VOICEVOX 朗讀；其餘 ${g.characters.length - learned.length} 筆仍待教材。戰技／爆發持續依來源核實，角色已有教材不等於該類台詞完整；來源待確認項目不猜測補錄。未加入劇情。`;
}
