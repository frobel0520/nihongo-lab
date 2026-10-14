/** @typedef {{ goal: string, questions: import('./anime-training.mjs').ListeningQuestion[] }} ListeningScene */
import { contentHash } from '../curriculum/author.mjs';

/** 整段原文或題義改動才重設聽解紀錄，聲線與解說改動不影響。
 * @param {import('../curriculum/lessons.mjs').Lesson} lesson
 * @param {import('./anime-training.mjs').ListeningQuestion} question */
export function sceneRecordId(lesson, question) {
  return `scene:${lesson.id}:${contentHash(
    JSON.stringify([
      lesson.dialogue.map((l) => l.jp),
      question.id,
      question.prompt,
      question.options,
      question.answer,
    ]),
  )}`;
}
