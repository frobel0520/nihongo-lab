// T173: remove this explicit cohort only when evaluating immutable published snapshots.
import { gameCharacterStudy } from '../../curriculum/lessons.mjs';
import { VOCAB_ILLUSTRATIONS } from '../../lib/vocab-illustrations.mjs';
import { AUDIO_PROSODY } from '../../curriculum/audio-prosody.mjs';
import { gameRecordId } from '../../lib/game-study.mjs';
export const sixthLineIds = new Set([
  'genshin:aino:skill-table-50-0',
  'genshin:aino:skill-table-51-0',
  'genshin:aino:skill-table-52-0',
  'genshin:aino:skill-table-53-0',
  'genshin:aino:burst-table-57-0',
  'genshin:alyosha:skill-table-46-0',
  'genshin:alyosha:skill-table-47-0',
  'genshin:alyosha:skill-table-48-0',
  'genshin:alyosha:skill-table-49-0',
  'genshin:alyosha:skill-table-50-0',
  'genshin:lohen:skill-table-51-0',
  'genshin:lohen:skill-table-52-0',
  'genshin:lohen:skill-table-54-0',
  'genshin:lohen:skill-table-55-0',
  'genshin:lohen:burst-table-57-0',
  'genshin:skirk:skill-table-49-0',
  'genshin:skirk:burst-table-54-0',
  'genshin:skirk:burst-table-55-0',
  'genshin:skirk:burst-table-56-0',
  'genshin:vesna:skill-table-53-0',
  'genshin:vesna:skill-table-55-0',
  'genshin:vesna:skill-table-56-0',
  'genshin:vesna:skill-table-57-0',
  'genshin:vesna:burst-table-59-0',
  'genshin:vodyanitsa:skill-table-50-0',
  'genshin:vodyanitsa:skill-table-51-0',
  'genshin:vodyanitsa:skill-table-52-0',
  'genshin:vodyanitsa:burst-table-55-0',
  'genshin:vodyanitsa:burst-table-56-0',
  'genshin:navia:burst-91054',
  'genshin:raiden:burst-52058',
  'genshin:zhongli:skill-17144',
]);
export const sixthAssetNames = new Set([
  'abilitygearclatter.svg',
  'abilitychallengehow.svg',
  'abilitywatersplashplay.svg',
  'abilityseektarget.svg',
  'abilityfalldown.svg',
  'abilitywhyarenotflee.svg',
  'abilitymarkprey.svg',
  'abilityfoundthere.svg',
  'abilityfightchallenge.svg',
  'abilitytremblecommand.svg',
  'abilityambushsuccess.svg',
  'abilitygoodtiming.svg',
  'abilitybraceyourself.svg',
  'abilityfilloverflow.svg',
  'abilityallflow.svg',
  'abilitysummonpower.svg',
  'abilitysalute.svg',
  'abilityexcusepass.svg',
  'abilitynotfinished.svg',
  'abilitysincerehonor.svg',
  'abilitywontletescape.svg',
  'abilityvocalwarmup.svg',
  'abilitytakestage.svg',
  'abilityasexpected.svg',
  'abilityelegy.svg',
  'abilitypastode.svg',
  'abilityrockfirecall.svg',
  'abilityegolessrealm.svg',
  'abilityheavensquake.svg',
]);
export const sixthProsodyPaths = new Set([
  'audio/games/genshin/gram-700ff68461.mp3',
]);
export const sixthCardIds = new Set(
  gameCharacterStudy
    .flatMap((g) => g.characters.flatMap((c) => c.lines))
    .filter((l) => sixthLineIds.has(l.id))
    .map((l) => 'game-card:' + gameRecordId(l)),
);
export const beforeSixthGameCharacterStudy = gameCharacterStudy.map((g) => ({
  ...g,
  characters: g.characters.map((c) => ({
    ...c,
    lines: c.lines.filter((l) => !sixthLineIds.has(l.id)),
  })),
}));
export const beforeSixthCards = (cards) =>
  cards.filter((c) => !sixthCardIds.has(c.id));
export const beforeSixthIllustrations = VOCAB_ILLUSTRATIONS.filter(
  (c) => !sixthCardIds.has(c.id),
);
export const beforeSixthProsody = Object.fromEntries(
  Object.entries(AUDIO_PROSODY).filter(
    ([path]) => !sixthProsodyPaths.has(path),
  ),
);
for (const g of beforeSixthGameCharacterStudy) {
  if (g.id !== 'genshin') continue;
  const learned = g.characters.filter((c) => c.lines.length);
  g.scope = `固定來源名冊共 ${g.characters.length} 筆角色條目，包含旅行者與人偶的不同版本。${learned.length} 位角色收錄 ${learned.reduce((n, c) => n + c.lines.length, 0)} 句短台詞與 VOICEVOX 朗讀；其餘 ${g.characters.length - learned.length} 筆仍待教材。戰技／爆發持續依來源核實，角色已有教材不等於該類台詞完整；來源待確認項目不猜測補錄。未加入劇情。`;
}
