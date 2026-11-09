// T176: explicit cohort removed only for immutable published snapshot checks.
import { gameCharacterStudy } from '../../curriculum/lessons.mjs';
import { VOCAB_ILLUSTRATIONS } from '../../lib/vocab-illustrations.mjs';
import { AUDIO_PROSODY } from '../../curriculum/audio-prosody.mjs';
import { gameRecordId } from '../../lib/game-study.mjs';
export const ninthLineIds = new Set([
  'genshin:aether:skill-1064',
  'genshin:aether:skill-1067',
  'genshin:aether:skill-1070',
  'genshin:aether:burst-1079',
  'genshin:aether:burst-1131',
  'genshin:albedo:skill-35050',
  'genshin:albedo:burst-35053',
  'genshin:alhaitham:skill-78046',
  'genshin:alhaitham:burst-78049',
  'genshin:aratakiitto:skill-57045',
  'genshin:aratakiitto:burst-57048',
  'genshin:chiori:skill-94045',
  'genshin:chongyun:skill-22050',
  'genshin:chongyun:skill-22052',
  'genshin:chongyun:burst-22055',
  'genshin:eula:burst-39063',
  'genshin:ganyu:skill-25059',
  'genshin:kamisatoayato:skill-66046',
  'genshin:kujousara:burst-56050',
  'genshin:kukishinobu:burst-65045',
  'genshin:lumine:skill-2063',
  'genshin:lumine:skill-2066',
  'genshin:lumine:skill-2069',
  'genshin:lumine:burst-2078',
  'genshin:lumine:burst-2130',
  'genshin:qiqi:burst-24054',
  'genshin:qiqi:burst-24055',
  'genshin:shenhe:skill-63046',
  'genshin:shenhe:burst-63049',
  'genshin:shenhe:burst-63050',
  'genshin:xingqiu:skill-13058',
  'genshin:xingqiu:burst-13062',
  'genshin:yaemiko:skill-58048',
  'genshin:zhongli:skill-17146',
  'genshin:zhongli:skill-17147',
  'genshin:zhongli:burst-17149',
  'genshin:skirk:skill-table-51-0',
]);
export const ninthAssetNames = new Set([
  'abilitywindbladecall.svg',
  'abilitygeofallingstar.svg',
  'abilityvioletshadowcall.svg',
  'abilitythunderskydrum.svg',
  'abilitybudbreakssoil.svg',
  'abilityartificialsunflower.svg',
  'abilitygeologictransition.svg',
  'abilitymirrorflashcall.svg',
  'abilitytheorydeductionsail.svg',
  'abilityrockbullcharge.svg',
  'abilityonikingarrival.svg',
  'abilitytamotodollcall.svg',
  'abilityswordsealfrost.svg',
  'abilityurgentlawspell.svg',
  'abilitysealphantomswords.svg',
  'abilityfrostresentment.svg',
  'abilityfrostgivesform.svg',
  'abilityazurestreamshadow.svg',
  'abilityeternalnarukamiway.svg',
  'abilitythunderpurification.svg',
  'abilitydoakushinkunidentity.svg',
  'abilityimmortalspellmanifest.svg',
  'abilityrefineqidivine.svg',
  'abilityheavenlydecreesound.svg',
  'abilityicebecomesavatar.svg',
  'abilitycutrainkeeprainbow.svg',
  'abilityleaveafterimage.svg',
  'abilitymountainreleasedforce.svg',
  'abilitysolidlikerock.svg',
  'abilityheavenlyorderadvance.svg',
  'abilitydancingblades.svg',
]);
export const ninthProsodyPaths = new Set([
  'audio/games/genshin/gram-a56ae6a3bb.mp3',
  'audio/games/genshin/gram-782c0af202.mp3',
  'audio/games/genshin/gram-193e24700a.mp3',
  'audio/games/genshin/gram-874ebed122.mp3',
  'audio/games/genshin/gram-ff569f26ca.mp3',
  'audio/games/genshin/gram-97ec21bc73.mp3',
  'audio/games/genshin/gram-602691d64a.mp3',
  'audio/games/genshin/gram-5f036a3d28.mp3',
  'audio/games/genshin/gram-6396860e3b.mp3',
  'audio/games/genshin/gram-b3f60f6d8b.mp3',
  'audio/games/genshin/gram-e95adf4297.mp3',
  'audio/games/genshin/gram-bb8d2f9127.mp3',
  'audio/games/genshin/gram-2f2be42628.mp3',
  'audio/games/genshin/gram-13d038add6.mp3',
  'audio/games/genshin/gram-160101740b.mp3',
  'audio/games/genshin/gram-9b0a508ff1.mp3',
  'audio/games/genshin/gram-b28f707307.mp3',
  'audio/games/genshin/gram-c2dd4cc293.mp3',
  'audio/games/genshin/gram-75ed5a8a20.mp3',
  'audio/games/genshin/gram-e3fe74eb37.mp3',
  'audio/games/genshin/gram-8a4ad17aa6.mp3',
  'audio/games/genshin/gram-acf9f1d8de.mp3',
  'audio/games/genshin/gram-0b21ec1b38.mp3',
  'audio/games/genshin/gram-86e93800f4.mp3',
  'audio/games/genshin/gram-c94d8726c1.mp3',
  'audio/games/genshin/gram-0d4e9f4839.mp3',
  'audio/games/genshin/gram-a2202c0652.mp3',
  'audio/games/genshin/gram-364688fe62.mp3',
  'audio/games/genshin/gram-bde23e2fbc.mp3',
  'audio/games/genshin/gram-650c1ef943.mp3',
]);
export const ninthCardIds = new Set(
  gameCharacterStudy
    .flatMap((g) => g.characters.flatMap((c) => c.lines))
    .filter((l) => ninthLineIds.has(l.id))
    .map((l) => 'game-card:' + gameRecordId(l)),
);
export const beforeNinthGameCharacterStudy = gameCharacterStudy.map((g) => ({
  ...g,
  characters: g.characters.map((c) => ({
    ...c,
    lines: c.lines.filter((l) => !ninthLineIds.has(l.id)),
  })),
}));
export const beforeNinthCards = (cards) =>
  cards.filter((c) => !ninthCardIds.has(c.id));
export const beforeNinthIllustrations = VOCAB_ILLUSTRATIONS.filter(
  (c) => !ninthCardIds.has(c.id),
);
export const beforeNinthProsody = Object.fromEntries(
  Object.entries(AUDIO_PROSODY).filter(
    ([path]) => !ninthProsodyPaths.has(path),
  ),
);
for (const g of beforeNinthGameCharacterStudy) {
  if (g.id !== 'genshin') continue;
  const learned = g.characters.filter((c) => c.lines.length);
  g.scope = `固定來源名冊共 ${g.characters.length} 筆角色條目，包含旅行者與人偶的不同版本。${learned.length} 位角色收錄 ${learned.reduce((n, c) => n + c.lines.length, 0)} 句短台詞與 VOICEVOX 朗讀；其餘 ${g.characters.length - learned.length} 筆仍待教材。戰技／爆發持續依來源核實，角色已有教材不等於該類台詞完整；來源待確認項目不猜測補錄。未加入劇情。`;
}
