/**
 * 聽寫的選擇題模式（T33）：聽一句，從 4 個選項裡選出聽到的那一句。
 * 干擾項從教材其他句子挑，挑「聽起來像」的才有練習價值：讀音的字元二連詞重疊度高、同一課、長度接近的優先，
 * 再從最像的幾句裡隨機抽，所以同一句每次出的題不完全一樣。隨機函式由呼叫端傳入，測試才能固定結果。
 *
 * @typedef {import('./dictation.mjs').Sentence} Sentence
 */
import { soundKey } from './dictation.mjs';

export const CHOICE_COUNT = 4;
/** 從最像的前幾句裡抽干擾項。 */
const TOP_POOL = 8;
const SAME_LESSON_BONUS = 0.2;
const LENGTH_PENALTY = 0.01;

/** @param {string} text */
function bigrams(text) {
  const set = new Set();
  if (text.length < 2) {
    if (text !== '') set.add(text);
    return set;
  }
  for (let i = 0; i < text.length - 1; i++) set.add(text.slice(i, i + 2));
  return set;
}

/**
 * @param {Set<string>} a
 * @param {Set<string>} b
 */
function jaccard(a, b) {
  if (a.size === 0 && b.size === 0) return 0;
  let shared = 0;
  for (const item of a) if (b.has(item)) shared++;
  return shared / (a.size + b.size - shared);
}

/**
 * 候選句有多像目標句（越大越像）。
 *
 * @param {Sentence} target
 * @param {Sentence} candidate
 */
export function similarity(target, candidate) {
  const a = soundKey(target.reading);
  const b = soundKey(candidate.reading);
  return (
    jaccard(bigrams(a), bigrams(b)) +
    (candidate.lessonId === target.lessonId ? SAME_LESSON_BONUS : 0) -
    LENGTH_PENALTY * Math.abs(a.length - b.length)
  );
}

/**
 * @template T
 * @param {T[]} items
 * @param {() => number} random 0 以上、小於 1
 * @returns {T[]}
 */
function shuffle(items, random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 一題的選項：目標句加 count − 1 個干擾項，順序打亂。
 * 干擾項的讀音（聽起來）與目標、彼此都不能相同，避免出現兩個都對的選項；
 * 候選不夠時回傳比 count 少的選項，不會硬湊重複的。
 *
 * @param {Sentence} target
 * @param {Sentence[]} sentences 全部可聽寫的句子
 * @param {() => number} [random]
 * @param {number} [count]
 * @returns {Sentence[]}
 */
export function pickChoices(
  target,
  sentences,
  random = Math.random,
  count = CHOICE_COUNT,
) {
  const seen = new Set([soundKey(target.reading), soundKey(target.jp)]);
  /** @type {{ sentence: Sentence, score: number }[]} */
  const ranked = [];
  for (const sentence of sentences) {
    if (sentence.id === target.id) continue;
    const key = soundKey(sentence.reading);
    if (key === '' || seen.has(key) || seen.has(soundKey(sentence.jp))) continue;
    seen.add(key);
    ranked.push({ sentence, score: similarity(target, sentence) });
  }
  ranked.sort((a, b) => b.score - a.score);

  const pool = shuffle(ranked.slice(0, TOP_POOL), random).slice(0, count - 1);
  return shuffle([target, ...pool.map((item) => item.sentence)], random);
}
