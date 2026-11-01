// T170: explicit third-cohort projection retains all older integrity goldens.
import { gameCharacterStudy } from '../../curriculum/lessons.mjs';
import { genshinActionExpansionThird } from '../../curriculum/genshin-action-expansion-third.mjs';
import { VOCAB_ILLUSTRATIONS } from '../../lib/vocab-illustrations.mjs';
import { gameRecordId } from '../../lib/game-study.mjs';
export const thirdLineIds = new Set(genshinActionExpansionThird.map(row => `genshin:${row.characterId}:${row.key}`));
export const thirdCardIds = new Set(gameCharacterStudy.flatMap(g => g.characters.flatMap(c => c.lines)).filter(l => thirdLineIds.has(l.id)).map(l => 'game-card:' + gameRecordId(l)));
export const beforeThirdGameCharacterStudy = gameCharacterStudy.map(g => ({ ...g, characters: g.characters.map(c => ({ ...c, lines: c.lines.filter(l => !thirdLineIds.has(l.id)) })) }));
export const beforeThirdCards = cards => cards.filter(c => !thirdCardIds.has(c.id));
export const beforeThirdIllustrations = VOCAB_ILLUSTRATIONS.filter(c => !thirdCardIds.has(c.id));
export const thirdAssetNames = new Set(["abilityavoidaddiction.svg", "abilitybomb.svg", "abilitycannotdefyfate.svg", "abilitycommandcold.svg", "abilitycondemn.svg", "abilitycrosswind.svg", "abilitydancededication.svg", "abilitydaretostop.svg", "abilityelectricnumb.svg", "abilityexplodeall.svg", "abilityexplosivefireworks.svg", "abilityfateappears.svg", "abilityfirejudgment.svg", "abilityflutter.svg", "abilityfullthrottle.svg", "abilityhighrating.svg", "abilityinsignificant.svg", "abilitymayhurt.svg", "abilitymustclean.svg", "abilityofferlightning.svg", "abilityopenbreakthrough.svg", "abilityovertambush.svg", "abilityprecisionshot.svg", "abilityprepareapplause.svg", "abilitypunishment.svg", "abilityrapidfire.svg", "abilityscanattack.svg", "abilityseenbefore.svg", "abilitysilencecommand.svg", "abilitystarblessing.svg", "abilitystarsrespond.svg", "abilitystopfutile.svg", "abilitysurfdrift.svg", "abilitywardoffcalamity.svg", "abilitywavearrives.svg", "abilityweavefinish.svg", "abilitywelcomehome.svg", "abilitywings.svg", "abilitywonderful.svg"]);
