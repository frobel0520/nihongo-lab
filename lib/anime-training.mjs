/**
 * 動畫聽力的題目與紀錄。台詞／音檔由 lessons.mjs 注入，避免第二份教材來源。
 * 理解、縮約、語氣三種題目分開存，沿用既有進度合併與匯出格式。
 * @typedef {import('../curriculum/lessons.mjs').Quote} Quote
 * @typedef {{ id: string, prompt: string, options: string[], answer: number, explanation: string }} ListeningQuestion
 * @typedef {{ quote: Quote, referenceUrl: string, questions: ListeningQuestion[] }} ListeningClip
 * @typedef {{ goal: string, clips: ListeningClip[], review: ListeningClip[] }} AnimeTraining
 */
import { contentHash } from '../curriculum/author.mjs';

/** 題目／選項改版後不沿用舊的通過紀錄；不與聽寫 mp3 id 混用。
 * @param {string} lessonId
 * @param {ListeningClip} clip
 * @param {ListeningQuestion} question
 */
export function listeningRecordId(lessonId, clip, question) {
  return `anime:${lessonId}:${contentHash(JSON.stringify([clip.quote.jp, question]))}`;
}

/** @param {ListeningQuestion} question @param {number} choice */
export function checkListeningChoice(question, choice) {
  if (
    !Number.isInteger(choice) ||
    choice < 0 ||
    choice >= question.options.length
  ) {
    throw new Error('請選擇題目中的一個選項');
  }
  return choice === question.answer;
}

/** @param {AnimeTraining} training */
export function trainingClips(training) {
  return [...training.clips, ...training.review];
}
