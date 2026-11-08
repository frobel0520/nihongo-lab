// T171: remove only the explicit fourth cohort from older integrity snapshots.
import { beforeFifthGameCharacterStudy as gameCharacterStudy, beforeFifthCards, beforeFifthIllustrations as VOCAB_ILLUSTRATIONS } from './before-fifth-action-expansion.mjs';
import { genshinActionExpansionFourth } from '../../curriculum/genshin-action-expansion-fourth.mjs';
import { gameRecordId } from '../../lib/game-study.mjs';
export const fourthLineIds = new Set(genshinActionExpansionFourth.map(r => `genshin:${r.characterId}:${r.key}`));
export const fourthCardIds = new Set(gameCharacterStudy.flatMap(g=>g.characters.flatMap(c=>c.lines)).filter(l=>fourthLineIds.has(l.id)).map(l=>'game-card:'+gameRecordId(l)));
export const beforeFourthGameCharacterStudy = gameCharacterStudy.map(g=>({...g,characters:g.characters.map(c=>({...c,lines:c.lines.filter(l=>!fourthLineIds.has(l.id))}))}));
export const beforeFourthCards = cards => beforeFifthCards(cards).filter(c=>!fourthCardIds.has(c.id));
export const beforeFourthIllustrations = VOCAB_ILLUSTRATIONS.filter(c=>!fourthCardIds.has(c.id));
export const fourthAssetNames = new Set(["abilityappearcall.svg","abilityblindingscreen.svg","abilityboomingarrival.svg","abilitybubbles.svg","abilitycalminchaos.svg","abilitycanescape.svg","abilitycheckdistance.svg","abilityclaimlife.svg","abilityclonetechnique.svg","abilitycommandwaves.svg","abilitycountshots.svg","abilitydontescape.svg","abilityfirststrike.svg","abilityflameshield.svg","abilitygiveuporder.svg","abilitygoorder.svg","abilityinjectionresult.svg","abilityknightpoise.svg","abilitylightfloating.svg","abilitymaidmanners.svg","abilitymedicalvow.svg","abilitymomentaryopening.svg","abilityninjavanishing.svg","abilityreadattack.svg","abilityreinforcement.svg","abilityrequesthelp.svg","abilityrockreassure.svg","abilityscornlofty.svg","abilityseapact.svg","abilityshowmerequest.svg","abilitysimulatewind.svg","abilitysoul.svg","abilitystaynear.svg","abilitysuncommand.svg","abilitythreadcrossing.svg","abilityuproot.svg","abilitywatchstep.svg","abilitywavedance.svg","abilitywisdompeak.svg"]);

// Recompute the published descriptive count after removing this cohort only.
for (const g of beforeFourthGameCharacterStudy) {
 if(g.id !== 'genshin') continue;
 const learned=g.characters.filter(c=>c.lines.length);
 g.scope=`固定來源名冊共 ${g.characters.length} 筆角色條目，包含旅行者與人偶的不同版本。${learned.length} 位角色收錄 ${learned.reduce((n,c)=>n+c.lines.length,0)} 句短台詞與 VOICEVOX 朗讀；其餘 ${g.characters.length-learned.length} 筆仍待教材。戰技／爆發持續依來源核實，角色已有教材不等於該類台詞完整；來源待確認項目不猜測補錄。未加入劇情。`;
}
