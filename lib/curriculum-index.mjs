import { buildCards } from './srs.mjs';
import { buildSentences } from './dictation.mjs';
import { sceneRecordId } from './scene-listening.mjs';
import { listeningRecordId, trainingClips } from './anime-training.mjs';
import { grammarRecordId } from './grammar-study.mjs';
import { createStudyCatalog } from './catalog-build.mjs';
/** @typedef {{id:string,title:string,audioReady?:boolean,vocabIds:string[],dictationIds:string[],listeningIds:string[],grammarIds:string[]}} LessonIndex */
/** @typedef {{stages:{id:string,title:string,lessons:LessonIndex[]}[],categories:Record<string,{cardIds:string[],sentenceIds:string[]}>}} CurriculumIndex */
/** Build-time projection of the public curriculum, with the original progress identities.
 * @param {import('../curriculum/lessons.mjs').Stage[]} stages
 * @param {import('../curriculum/game-character-study.mjs').GameStudy[]} games
 * @returns {CurriculumIndex} */
export function createCurriculumIndex(stages, games) {
  const catalogs = createStudyCatalog(stages, games);
  return {
    stages: stages.map((s) => ({
      id: s.id,
      title: s.title,
      lessons: s.lessons.map((l) => {
        const scope = [{ ...s, lessons: [l] }];
        return {
          id: l.id,
          title: l.title,
          ...(l.audioReady === false ? { audioReady: false } : {}),
          vocabIds: buildCards(scope).map((c) => c.id),
          dictationIds: buildSentences(scope).map((c) => c.id),
          listeningIds: [
            ...(l.scene?.questions ?? []).map((q) => sceneRecordId(l, q)),
            ...(l.training
              ? trainingClips(l.training).flatMap((c) =>
                  c.questions.map((q) => listeningRecordId(l.id, c, q)),
                )
              : []),
          ],
          grammarIds: l.grammar.flatMap((g) =>
            (g.study?.questions ?? []).map((q) => grammarRecordId(l.id, g, q)),
          ),
        };
      }),
    })),
    categories: Object.fromEntries(
      Object.entries(catalogs).map(([id, c]) => [
        id,
        {
          cardIds: c.cards.map((c) => c.id),
          sentenceIds: c.sentences.map((s) => s.id),
        },
      ]),
    ),
  };
}
