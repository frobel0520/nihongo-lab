import { grammarStatus } from './grammar-study.mjs';

/** 「已開始」是已有有效作答／評分，不等於已通過或完成比例。
 * @param {import('./curriculum-index.mjs').LessonIndex} lesson
 * @param {import('./progress.mjs').Progress} progress
 */
export function hasLessonActivity(lesson, progress) {
  return (
    lesson.vocabIds.some((id) => !!progress.srs[id]) ||
    [...lesson.dictationIds, ...lesson.listeningIds].some(
      (id) => (progress.dictation[id]?.attempts ?? 0) > 0,
    ) ||
    lesson.grammarIds.some((id) => grammarStatus(progress, id).attempted)
  );
}
/** @param {readonly string[]} ids @param {import('./srs.mjs').SrsState} state @param {string} today */
export function summarizeIds(ids, state, today) {
  let learned = 0,
    due = 0;
  for (const id of ids)
    if (state[id]) {
      learned++;
      if (state[id].due <= today) due++;
    }
  return { total: ids.length, learned, due, fresh: ids.length - learned };
}
/** @param {import('./curriculum-index.mjs').CurriculumIndex} index @param {import('./progress.mjs').Progress} progress
 * @returns {Record<string,import('./lesson-progress.mjs').LessonProgress>} */
export function indexedLessonProgress(index, progress) {
  return Object.fromEntries(
    index.stages.flatMap((s) =>
      s.lessons.map((l) => {
        const vocab = {
          total: l.vocabIds.length,
          done: l.vocabIds.filter((id) => progress.srs[id]).length,
        };
        const count = (/** @type {string[]} */ ids) => ({
          total: ids.length,
          done: ids.filter((id) => progress.dictation[id]?.passed).length,
        });
        const dictation = count(l.dictationIds),
          listening = count(l.listeningIds);
        const statuses = l.grammarIds.map((id) => grammarStatus(progress, id));
        const grammar = {
          total: statuses.length,
          done: statuses.filter((s) => s.passed).length,
          attempted: statuses.filter((s) => s.attempted).length,
          review: statuses.filter((s) => s.review).length,
        };
        const total =
          vocab.total + dictation.total + listening.total + grammar.total;
        return [
          l.id,
          {
            vocab,
            dictation,
            listening,
            grammar,
            ratio: total
              ? (vocab.done + dictation.done + listening.done + grammar.done) /
                total
              : 0,
          },
        ];
      }),
    ),
  );
}
