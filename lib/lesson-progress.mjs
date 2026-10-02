/**
 * 每一課的學習進度（課程清單畫面的進度條用）。純邏輯，沿用單字卡與聽寫本來的定義，不另存資料：
 * - 單字：這課的單字卡「已學」（進度裡有這張卡）的張數 / 單字總數，與單字卡畫面的「已學」同一個算法。
 * - 聽寫：這課的句子「已通過」的句數 / 可聽寫的句數（音檔還沒合成的課沒有句子，總數為 0）。
 * - ratio：兩者合計的完成比例，0～1；沒有任何可練習項目的課為 0。
 *
 * @typedef {typeof import('../curriculum/lessons.mjs').stages} Stages
 * @typedef {import('./progress.mjs').Progress} Progress
 * @typedef {{ done: number, total: number }} Count
 * @typedef {{ vocab: Count, dictation: Count, listening: Count, ratio: number }} LessonProgress
 */
import { buildSentences } from './dictation.mjs';
import { buildCards } from './srs.mjs';
import { listeningRecordId, trainingClips } from './anime-training.mjs';

/**
 * @param {Stages} stages
 * @param {Progress} progress
 * @returns {Record<string, LessonProgress>} 以課程 id 為 key
 */
export function lessonProgress(stages, progress) {
  /** @type {Record<string, LessonProgress>} */
  const result = {};
  for (const stage of stages) {
    for (const lesson of stage.lessons) {
      result[lesson.id] = {
        vocab: { done: 0, total: 0 },
        dictation: { done: 0, total: 0 },
        listening: { done: 0, total: 0 },
        ratio: 0,
      };
      if (lesson.training) {
        const entry = result[lesson.id];
        for (const clip of trainingClips(lesson.training)) {
          for (const question of clip.questions) {
            entry.listening.total++;
            if (
              progress.dictation[listeningRecordId(lesson.id, clip, question)]
                ?.passed
            )
              entry.listening.done++;
          }
        }
      }
    }
  }

  for (const card of buildCards(stages)) {
    const entry = result[card.lessonId];
    if (!entry) continue;
    entry.vocab.total++;
    if (progress.srs[card.id]) entry.vocab.done++;
  }
  for (const sentence of buildSentences(stages)) {
    const entry = result[sentence.lessonId];
    if (!entry) continue;
    entry.dictation.total++;
    if (progress.dictation[sentence.id]?.passed) entry.dictation.done++;
  }

  for (const entry of Object.values(result)) {
    const total =
      entry.vocab.total + entry.dictation.total + entry.listening.total;
    entry.ratio =
      total === 0
        ? 0
        : (entry.vocab.done + entry.dictation.done + entry.listening.done) /
          total;
  }
  return result;
}
