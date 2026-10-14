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

const SPEAKER_NAMES = ['甲', '乙', '丙', '丁'];
const GENDER_LABEL = { female: '女聲', male: '男聲' };

/** 依聲線首次出現的順序命名同伴，性別取自聲線資料，不靠句子位置推測。
 * @param {{ voice?: string }[]} dialogue
 * @param {(key: string) => { gender: 'female' | 'male' }} voiceOf
 * @returns {string[]} */
export function sceneSpeakerLabels(dialogue, voiceOf) {
  /** @type {string[]} */
  const order = [];
  return dialogue.map((line) => {
    if (!line.voice) return '同伴';
    if (!order.includes(line.voice)) order.push(line.voice);
    const name = SPEAKER_NAMES[order.indexOf(line.voice)] ?? '';
    return `同伴${name}（${GENDER_LABEL[voiceOf(line.voice).gender]}）`;
  });
}
