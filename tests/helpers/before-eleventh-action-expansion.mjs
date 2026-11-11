// T179: remove only this exact cohort for immutable previous-candidate snapshots.
import {beforeTwelfthGameCharacterStudy as gameCharacterStudy, beforeTwelfthCards, beforeTwelfthProsody as AUDIO_PROSODY} from './before-twelfth-action-expansion.mjs';
export const eleventhLineIds = new Set([
  "genshin:aether:skill-1127",
  "genshin:hutao:skill-36058",
  "genshin:hutao:skill-36059",
  "genshin:lumine:skill-2126",
  "genshin:yunjin:skill-64041",
  "genshin:yunjin:skill-64042",
  "genshin:gaming:burst-92053",
  "genshin:lohen:burst-table-59-0"
]);
const cardIds = new Set([
  "game-card:game:genshin:aether:skill-1127:2710bf5e3b",
  "game-card:game:genshin:hutao:skill-36058:3d02ac070a",
  "game-card:game:genshin:hutao:skill-36059:2710bf5e3b",
  "game-card:game:genshin:lumine:skill-2126:2710bf5e3b",
  "game-card:game:genshin:yunjin:skill-64041:8897ad9ab1",
  "game-card:game:genshin:yunjin:skill-64042:04ac7e59a7",
  "game-card:game:genshin:gaming:burst-92053:c6655c347b",
  "game-card:game:genshin:lohen:burst-table-59-0:50f9443cd7"
]);
const prosodyPaths = new Set(["audio/games/genshin/gram-ea79053f51.mp3","audio/games/genshin/gram-6b5fbacb63.mp3","audio/games/genshin/gram-0825f58db3.mp3"]);
export const beforeEleventhGameCharacterStudy=gameCharacterStudy.map(g=>({...g,...(g.id==='genshin'?{scope:"固定來源名冊共 124 筆角色條目，包含旅行者與人偶的不同版本。124 位角色收錄 883 句短台詞與 VOICEVOX 朗讀；其餘 0 筆仍待教材。戰技／爆發持續依來源核實，角色已有教材不等於該類台詞完整；來源待確認項目不猜測補錄。未加入劇情。"}:{}),characters:g.characters.map(c=>({...c,lines:c.lines.filter(l=>!eleventhLineIds.has(l.id))}))}));
export const beforeEleventhCards=cards=>beforeTwelfthCards(cards).filter(c=>!cardIds.has(c.id));
export const beforeEleventhProsody=Object.fromEntries(Object.entries(AUDIO_PROSODY).filter(([path])=>!prosodyPaths.has(path)));
