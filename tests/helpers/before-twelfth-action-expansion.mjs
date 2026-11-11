// T181: remove only this exact cohort for immutable previous-candidate snapshots.
import {beforeT182GameCharacterStudy as gameCharacterStudy, beforeT182Cards, beforeT182Prosody as AUDIO_PROSODY} from './before-t182-supplement.mjs';
export const twelfthLineIds = new Set([
  "genshin:xilonen:burst-103050",
  "genshin:yumemizukimizuki:burst-109053"
]);
const cardIds = new Set([
  "game-card:game:genshin:xilonen:burst-103050:87d496ca48",
  "game-card:game:genshin:yumemizukimizuki:burst-109053:a685d32c33"
]);
const prosodyPaths = new Set(["audio/games/genshin/gram-cf5a3d1df4.mp3","audio/games/genshin/gram-f3adfd6efa.mp3"]);
export const beforeTwelfthGameCharacterStudy=gameCharacterStudy.map(g=>({...g,...(g.id==='genshin'?{scope:"固定來源名冊共 124 筆角色條目，包含旅行者與人偶的不同版本。124 位角色收錄 891 句短台詞與 VOICEVOX 朗讀；其餘 0 筆仍待教材。戰技／爆發持續依來源核實，角色已有教材不等於該類台詞完整；來源待確認項目不猜測補錄。未加入劇情。"}:{}),characters:g.characters.map(c=>({...c,lines:c.lines.filter(l=>!twelfthLineIds.has(l.id))}))}));
export const beforeTwelfthCards=cards=>beforeT182Cards(cards).filter(c=>!cardIds.has(c.id));
export const beforeTwelfthProsody=Object.fromEntries(Object.entries(AUDIO_PROSODY).filter(([path])=>!prosodyPaths.has(path)));
