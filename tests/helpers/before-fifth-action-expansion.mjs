// T172: project only the explicit fifth cohort out of older immutable snapshots.
import { beforeSixthGameCharacterStudy as gameCharacterStudy, beforeSixthCards, beforeSixthIllustrations as VOCAB_ILLUSTRATIONS } from './before-sixth-action-expansion.mjs';
import { genshinActionExpansionFifth } from '../../curriculum/genshin-action-expansion-fifth.mjs';
import { gameRecordId } from '../../lib/game-study.mjs';
export const fifthLineIds=new Set(genshinActionExpansionFifth.map(r=>`genshin:${r.characterId}:${r.key}`));
export const fifthCardIds=new Set(gameCharacterStudy.flatMap(g=>g.characters.flatMap(c=>c.lines)).filter(l=>fifthLineIds.has(l.id)).map(l=>'game-card:'+gameRecordId(l)));
export const beforeFifthGameCharacterStudy=gameCharacterStudy.map(g=>({...g,characters:g.characters.map(c=>({...c,lines:c.lines.filter(l=>!fifthLineIds.has(l.id))}))}));
export const beforeFifthCards=cards=>beforeSixthCards(cards).filter(c=>!fifthCardIds.has(c.id));
export const beforeFifthIllustrations=VOCAB_ILLUSTRATIONS.filter(c=>!fifthCardIds.has(c.id));
export const fifthAssetNames=new Set(["abilityburnall.svg","abilitybutterflyfire.svg","abilitycrycommand.svg","abilitydrilldepart.svg","abilityflameappear.svg","abilitypastglory.svg","abilityremovejob.svg","abilityscornweak.svg","abilityshadowblade.svg","abilitysharkrocket.svg","abilitywisdomhall.svg","battlewithdraw.svg","coldstar.svg","dismisswave.svg","dontshowpain.svg","fireworkcheer.svg","fireworkfish.svg","fortressunyielding.svg","heatrockmusic.svg","icefigure.svg","impermanence.svg","lifecirculation.svg","loudmusic.svg","rebelliousmusic.svg","rudeopponent.svg","shoutchallenge.svg","sparkrod.svg","talkthenpunch.svg","waterarrow.svg"]);
export const fifthProsodyPaths=new Set(["audio/games/genshin/gram-3ee4b52931.mp3","audio/games/genshin/gram-6a261e2700.mp3","audio/games/genshin/gram-c8fa7cb4c2.mp3","audio/games/genshin/gram-a86f174080.mp3","audio/games/genshin/gram-c095ef34b9.mp3"]);
for(const g of beforeFifthGameCharacterStudy){if(g.id!=='genshin')continue;const learned=g.characters.filter(c=>c.lines.length);g.scope=`固定來源名冊共 ${g.characters.length} 筆角色條目，包含旅行者與人偶的不同版本。${learned.length} 位角色收錄 ${learned.reduce((n,c)=>n+c.lines.length,0)} 句短台詞與 VOICEVOX 朗讀；其餘 ${g.characters.length-learned.length} 筆仍待教材。戰技／爆發持續依來源核實，角色已有教材不等於該類台詞完整；來源待確認項目不猜測補錄。未加入劇情。`;}
