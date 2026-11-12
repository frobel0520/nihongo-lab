// T188: remove only the Navia line added in this task for immutable previous-release snapshots.
import {gameCharacterStudy} from '../../curriculum/lessons.mjs';
import {AUDIO_PROSODY} from '../../curriculum/audio-prosody.mjs';
export const t188LineIds = new Set(["genshin:navia:join-91072"]);
const cardIds = new Set(["game-card:game:genshin:navia:join-91072:c770c46194"]);
const prosodyPaths = new Set(["audio/games/genshin/gram-d347d32da0.mp3"]);
export const beforeT188GameCharacterStudy=gameCharacterStudy.map(g=>({...g,...(g.id==='genshin'?{scope:"固定來源名冊共 124 筆角色條目，包含旅行者與人偶的不同版本。124 位角色收錄 1249 句短台詞與 VOICEVOX 朗讀；其餘 0 筆仍待教材。戰技／爆發持續依來源核實，角色已有教材不等於該類台詞完整；來源待確認項目不猜測補錄。未加入劇情。"}:{}),characters:g.characters.map(c=>({...c,lines:c.lines.filter(l=>!t188LineIds.has(l.id))}))}));
export const beforeT188Cards=cards=>cards.filter(c=>!cardIds.has(c.id));
export const beforeT188Prosody=Object.fromEntries(Object.entries(AUDIO_PROSODY).filter(([path])=>!prosodyPaths.has(path)));
