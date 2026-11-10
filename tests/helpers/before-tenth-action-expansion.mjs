// T177: explicit cohort removed only for immutable published snapshot checks.
import { gameCharacterStudy } from '../../curriculum/lessons.mjs';
import { VOCAB_ILLUSTRATIONS } from '../../lib/vocab-illustrations.mjs';
import { AUDIO_PROSODY } from '../../curriculum/audio-prosody.mjs';
import { gameRecordId } from '../../lib/game-study.mjs';
export const tenthLineIds = new Set([
  "genshin:baizhu:skill-82047",
  "genshin:beidou:burst-14149",
  "genshin:chiori:burst-94050",
  "genshin:fischl:skill-19053",
  "genshin:fischl:burst-19055",
  "genshin:fischl:burst-19057",
  "genshin:fischl:burst-19058",
  "genshin:gaming:skill-92049",
  "genshin:kaedeharakazuha:burst-40058",
  "genshin:kinich:skill-101046",
  "genshin:kinich:skill-101047",
  "genshin:kinich:skill-101048",
  "genshin:kinich:burst-101052",
  "genshin:kinich:burst-101055",
  "genshin:kinich:burst-101056",
  "genshin:kinich:burst-101057-part-1",
  "genshin:kinich:burst-101057-part-2",
  "genshin:kinich:burst-101057-part-3",
  "genshin:kinich:burst-101058-part-1",
  "genshin:kinich:burst-101058-part-2",
  "genshin:kinich:burst-101058-part-3",
  "genshin:kinich:burst-101059-part-1",
  "genshin:kinich:burst-101059-part-2",
  "genshin:kinich:burst-101059-part-3",
  "genshin:kujousara:skill-56049",
  "genshin:neuvillette:burst-87056",
  "genshin:raiden:skill-52055",
  "genshin:sucrose:skill-31055",
  "genshin:sucrose:burst-31058",
  "genshin:tighnari:burst-69051",
  "genshin:xiangling:skill-12143",
  "genshin:yanfei:burst-38055",
  "genshin:yoimiya:skill-49009",
  "genshin:yoimiya:skill-49010",
  "genshin:yumemizukimizuki:burst-109052",
  "genshin:zhongli:burst-17151",
  "genshin:skirk:skill-table-50-0"
]);
export const tenthAssetNames = new Set([
  "abilityserpenthealingneeded.svg",
  "abilityslainseamonsterpower.svg",
  "abilitycrimsonscatter.svg",
  "abilitynightphantommanifest.svg",
  "abilitylionplucksgreens.svg",
  "abilityautumnleafregret.svg",
  "abilityfasterthanexpected.svg",
  "abilityalreadyfleeing.svg",
  "abilitysimilartechniques.svg",
  "abilityrepaynightdeity.svg",
  "abilitysacreddragondescends.svg",
  "abilityprimordialspiritappears.svg",
  "abilitydragonfiretotalburn.svg",
  "abilitydemandsoulthreatensilence.svg",
  "abilityboastthenexactsprice.svg",
  "abilitythunderflashcall.svg",
  "abilitydissolvetobubbles.svg",
  "abilityjudgmentthunder.svg",
  "abilitynumberedexperimentalunit.svg",
  "abilityexperimentalmodule.svg",
  "abilityrootsvineentangle.svg",
  "abilitycompanionbreathesfire.svg",
  "abilitylawflamedraw.svg",
  "abilityinvitefireworkview.svg",
  "abilitylightingfuseannounce.svg",
  "abilitytwodreamcompanions.svg",
  "abilityheavenmovesmyriad.svg",
  "abilityrentspace.svg",
  "abilityravenobeyslady.svg",
  "abilityinadequatereply.svg",
  "abilitythreatenslastingsilence.svg",
  "abilityunrivalledsplendor.svg",
  "abilitycloudedmood.svg",
  "abilitydragonflameilluminesfoes.svg"
]);
export const tenthProsodyPaths = new Set([
  "audio/games/genshin/gram-917f247ab0.mp3",
  "audio/games/genshin/gram-b43a7ddbf1.mp3",
  "audio/games/genshin/gram-603e738a95.mp3",
  "audio/games/genshin/gram-2e48404c14.mp3",
  "audio/games/genshin/gram-9d02998014.mp3",
  "audio/games/genshin/gram-34c4489781.mp3",
  "audio/games/genshin/gram-b6ec8ee5c4.mp3",
  "audio/games/genshin/gram-ee23554e88.mp3",
  "audio/games/genshin/gram-54491138f1.mp3",
  "audio/games/genshin/gram-c9cb3b9b6a.mp3",
  "audio/games/genshin/gram-79ae5bfc39.mp3",
  "audio/games/genshin/gram-aca4209ef1.mp3",
  "audio/games/genshin/gram-001080972b.mp3",
  "audio/games/genshin/gram-96698bf5ac.mp3",
  "audio/games/genshin/gram-ac2987be90.mp3",
  "audio/games/genshin/gram-320bc18574.mp3",
  "audio/games/genshin/gram-d8d7f2408a.mp3",
  "audio/games/genshin/gram-ded4c08821.mp3",
  "audio/games/genshin/gram-71473967cf.mp3"
]);
export const tenthCardIds = new Set(
  gameCharacterStudy
    .flatMap((g) => g.characters.flatMap((c) => c.lines))
    .filter((l) => tenthLineIds.has(l.id))
    .map((l) => 'game-card:' + gameRecordId(l)),
);
export const beforeTenthGameCharacterStudy = gameCharacterStudy.map((g) => ({
  ...g,
  characters: g.characters.map((c) => ({
    ...c,
    lines: c.lines.filter((l) => !tenthLineIds.has(l.id)),
  })),
}));
export const beforeTenthCards = (cards) =>
  cards.filter((c) => !tenthCardIds.has(c.id));
export const beforeTenthIllustrations = VOCAB_ILLUSTRATIONS.filter(
  (c) => !tenthCardIds.has(c.id),
);
export const beforeTenthProsody = Object.fromEntries(
  Object.entries(AUDIO_PROSODY).filter(
    ([path]) => !tenthProsodyPaths.has(path),
  ),
);
for (const g of beforeTenthGameCharacterStudy) {
  if (g.id !== 'genshin') continue;
  const learned = g.characters.filter((c) => c.lines.length);
  g.scope = `固定來源名冊共 ${g.characters.length} 筆角色條目，包含旅行者與人偶的不同版本。${learned.length} 位角色收錄 ${learned.reduce((n, c) => n + c.lines.length, 0)} 句短台詞與 VOICEVOX 朗讀；其餘 ${g.characters.length - learned.length} 筆仍待教材。戰技／爆發持續依來源核實，角色已有教材不等於該類台詞完整；來源待確認項目不猜測補錄。未加入劇情。`;
}
