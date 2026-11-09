// T175: explicit cohort removed only for immutable published snapshot checks.
import {
  beforeNinthGameCharacterStudy as gameCharacterStudy,
  beforeNinthCards,
  beforeNinthIllustrations as VOCAB_ILLUSTRATIONS,
  beforeNinthProsody as AUDIO_PROSODY,
} from './before-ninth-action-expansion.mjs';
import { gameRecordId } from '../../lib/game-study.mjs';
export const eighthLineIds = new Set([
  'genshin:citlali:skill-107044',
  'genshin:citlali:burst-107050',
  'genshin:citlali:burst-107051',
  'genshin:fischl:burst-19056',
  'genshin:gaming:burst-92052',
  'genshin:ganyu:burst-25063',
  'genshin:kaedeharakazuha:skill-40053',
  'genshin:kinich:burst-101054',
  'genshin:kukishinobu:skill-65041',
  'genshin:mavuika:burst-106057',
  'genshin:mona:skill-30050',
  'genshin:mona:skill-30051',
  'genshin:navia:skill-91053',
  'genshin:navia:burst-91055',
  'genshin:tighnari:skill-69047',
  'genshin:wanderer:skill-75053',
  'genshin:wanderer:skill-75054',
  'genshin:xianyun:burst-93052',
  'genshin:xiao:burst-16151',
  'genshin:xilonen:burst-103048',
  'genshin:yaemiko:skill-58044',
  'genshin:yaemiko:skill-58045',
  'genshin:yaemiko:skill-58046',
  'genshin:yaemiko:burst-58049',
  'genshin:yaoyao:skill-77047',
  'genshin:yaoyao:burst-77052',
  'genshin:yunjin:skill-64044',
  'genshin:yunjin:burst-64047',
  'genshin:yunjin:burst-64048',
  'genshin:zhongli:skill-17143',
  'genshin:aino:burst-table-56-0',
  'genshin:skirk:skill-table-48-0',
  'genshin:vesna:skill-table-54-0',
]);
export const eighthAssetNames = new Set([
  'abilityfulfilcontract.svg',
  'abilitytwocompanionsgo.svg',
  'abilityominousstarforce.svg',
  'abilityravenpursuesnight.svg',
  'abilitycompanionsturn.svg',
  'abilityforrocksovereign.svg',
  'abilitywinddestination.svg',
  'abilityoldshadowcommand.svg',
  'abilitynakuweedring.svg',
  'abilityburiedinredflame.svg',
  'abilitywaterphantomwish.svg',
  'abilityfatesphantom.svg',
  'abilityumbrellashotgun.svg',
  'abilitycustomrosecracker.svg',
  'abilityleafblocksight.svg',
  'abilitylookdownworld.svg',
  'abilitysoartowardsky.svg',
  'abilitywindgathersonecloud.svg',
  'abilityritualexorcismdance.svg',
  'abilityvalleyresonance.svg',
  'abilityprotectiveincantation.svg',
  'abilityimperialedict.svg',
  'abilitytrueeyemanifest.svg',
  'abilityyueguiaturn.svg',
  'abilityflyingcloudbanner.svg',
  'abilityunitedeffort.svg',
  'abilityonedrummomentum.svg',
  'abilitytoweringcliff.svg',
  'abilitysplashwaterbullet.svg',
  'abilityannihilation.svg',
  'abilityraisethesword.svg',
  'abilitylegalcode.svg',
]);
export const eighthProsodyPaths = new Set([
  'audio/games/genshin/gram-ca1ee9a1d0.mp3',
  'audio/games/genshin/gram-ced8b949aa.mp3',
  'audio/games/genshin/gram-2fbfee5152.mp3',
  'audio/games/genshin/gram-f112d56855.mp3',
  'audio/games/genshin/gram-12b29b1196.mp3',
  'audio/games/genshin/gram-a32aef49fa.mp3',
  'audio/games/genshin/gram-7f08d377c8.mp3',
  'audio/games/genshin/gram-af679d02e0.mp3',
  'audio/games/genshin/gram-d083f0f4e5.mp3',
  'audio/games/genshin/gram-11171eba58.mp3',
  'audio/games/genshin/gram-b7dde975b7.mp3',
  'audio/games/genshin/gram-0e2c45ffad.mp3',
  'audio/games/genshin/gram-3414375c6f.mp3',
  'audio/games/genshin/gram-e3bdf0f9e2.mp3',
  'audio/games/genshin/gram-4363d2b038.mp3',
  'audio/games/genshin/gram-511a2a07c1.mp3',
  'audio/games/genshin/gram-e42c7c91e7.mp3',
  'audio/games/genshin/gram-f7cbdbabb6.mp3',
  'audio/games/genshin/gram-729b8ab7c5.mp3',
  'audio/games/genshin/gram-471fca0891.mp3',
]);
export const eighthCardIds = new Set(
  gameCharacterStudy
    .flatMap((g) => g.characters.flatMap((c) => c.lines))
    .filter((l) => eighthLineIds.has(l.id))
    .map((l) => 'game-card:' + gameRecordId(l)),
);
export const beforeEighthGameCharacterStudy = gameCharacterStudy.map((g) => ({
  ...g,
  characters: g.characters.map((c) => ({
    ...c,
    lines: c.lines.filter((l) => !eighthLineIds.has(l.id)),
  })),
}));
export const beforeEighthCards = (cards) =>
  beforeNinthCards(cards).filter((c) => !eighthCardIds.has(c.id));
export const beforeEighthIllustrations = VOCAB_ILLUSTRATIONS.filter(
  (c) => !eighthCardIds.has(c.id),
);
export const beforeEighthProsody = Object.fromEntries(
  Object.entries(AUDIO_PROSODY).filter(
    ([path]) => !eighthProsodyPaths.has(path),
  ),
);
for (const g of beforeEighthGameCharacterStudy) {
  if (g.id !== 'genshin') continue;
  const learned = g.characters.filter((c) => c.lines.length);
  g.scope = `固定來源名冊共 ${g.characters.length} 筆角色條目，包含旅行者與人偶的不同版本。${learned.length} 位角色收錄 ${learned.reduce((n, c) => n + c.lines.length, 0)} 句短台詞與 VOICEVOX 朗讀；其餘 ${g.characters.length - learned.length} 筆仍待教材。戰技／爆發持續依來源核實，角色已有教材不等於該類台詞完整；來源待確認項目不猜測補錄。未加入劇情。`;
}
