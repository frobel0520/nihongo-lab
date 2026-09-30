/**
 * 聽寫練習的純邏輯：句子清單與答案比對。
 * 比對只看「聽到什麼」：忽略空白與標點，片假名視同平假名，
 * 使用者可以打漢字原文或假名讀音（兩種都算對）。
 *
 * @typedef {{
 *   id: string,
 *   jp: string,
 *   reading: string,
 *   ruby?: string,
 *   zh: string,
 *   audio: string,
 *   lessonId: string,
 *   lessonTitle: string,
 *   source: 'grammar' | 'dialogue' | 'quote',
 * }} Sentence
 * @typedef {{ ch: string, compared: boolean, matched: boolean }} Mark
 * @typedef {{ correct: boolean, target: string, expected: Mark[], actual: Mark[] }} DictationResult
 */

const IGNORED = /[\p{P}\p{S}\p{Z}\s]/u;

/** 片假名（U+30A1～U+30F6）轉平假名，其他字元不動。 @param {string} ch */
function foldKana(ch) {
  const code = ch.codePointAt(0) ?? 0;
  return code >= 0x30a1 && code <= 0x30f6
    ? String.fromCodePoint(code - 0x60)
    : ch;
}

/**
 * 把字串拆成逐字單位；標點與空白標成 compared: false，只顯示不比對。
 *
 * @param {string} text
 * @returns {{ ch: string, key: string | null }[]}
 */
function toUnits(text) {
  return [...text.normalize('NFKC')].map((ch) => ({
    ch,
    key: IGNORED.test(ch) ? null : foldKana(ch),
  }));
}

/**
 * 最長共同子序列，回傳兩邊各自「被對上」的索引集合。
 *
 * @param {string[]} a
 * @param {string[]} b
 */
function lcs(a, b) {
  const table = Array.from({ length: a.length + 1 }, () =>
    Array.from({ length: b.length + 1 }, () => 0),
  );
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      table[i][j] =
        a[i] === b[j]
          ? table[i + 1][j + 1] + 1
          : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }
  const matchedA = new Set();
  const matchedB = new Set();
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      matchedA.add(i);
      matchedB.add(j);
      i++;
      j++;
    } else if (table[i + 1][j] >= table[i][j + 1]) {
      i++;
    } else {
      j++;
    }
  }
  return { length: table[0][0], matchedA, matchedB };
}

/**
 * 拿使用者輸入跟一組可接受的答案（漢字原文、假名讀音）比對，回傳最接近那一個的逐字標記。
 *
 * @param {string} input
 * @param {string[]} candidates
 * @returns {DictationResult}
 */
export function compareDictation(input, candidates) {
  const actualUnits = toUnits(input);
  const actualKeys = actualUnits.flatMap((u, i) =>
    u.key === null ? [] : [{ key: u.key, i }],
  );

  let best = null;
  for (const target of candidates) {
    const expectedUnits = toUnits(target);
    const expectedKeys = expectedUnits.flatMap((u, i) =>
      u.key === null ? [] : [{ key: u.key, i }],
    );
    const { length, matchedA, matchedB } = lcs(
      expectedKeys.map((k) => k.key),
      actualKeys.map((k) => k.key),
    );
    const longest = Math.max(expectedKeys.length, actualKeys.length);
    const score = longest === 0 ? 0 : length / longest;
    if (!best || score > best.score) {
      best = { target, expectedUnits, expectedKeys, matchedA, matchedB, score };
    }
  }

  if (!best) throw new Error('compareDictation 需要至少一個可接受的答案');

  const expectedMatched = new Set(
    [...best.matchedA].map((k) => best.expectedKeys[k].i),
  );
  const actualMatched = new Set([...best.matchedB].map((k) => actualKeys[k].i));

  return {
    correct: best.score === 1,
    target: best.target,
    expected: best.expectedUnits.map((u, i) => ({
      ch: u.ch,
      compared: u.key !== null,
      matched: u.key === null || expectedMatched.has(i),
    })),
    actual: actualUnits.map((u, i) => ({
      ch: u.ch,
      compared: u.key !== null,
      matched: u.key === null || actualMatched.has(i),
    })),
  };
}

/**
 * 從課程資料攤平出可聽寫、可跟讀的句子（文法例句 + 對話 + 名句）；id 用音檔路徑，跨課程唯一。
 * audioReady 為 false 的課程音檔還沒合成，整課略過，避免聽寫與跟讀點到不存在的音檔。
 *
 * @param {{ lessons: {
 *   id: string,
 *   title: string,
 *   audioReady?: boolean,
 *   grammar: { examples: { jp: string, reading: string, zh: string, audio: string }[] }[],
 *   dialogue: { jp: string, reading: string, zh: string, audio: string }[],
 *   quotes?: { jp: string, reading: string, zh: string, audio: string }[],
 * }[] }[]} stages
 * @returns {Sentence[]}
 */
export function buildSentences(stages) {
  /** @type {Sentence[]} */
  const sentences = [];
  for (const stage of stages) {
    for (const lesson of stage.lessons) {
      if (lesson.audioReady === false) continue;
      const meta = { lessonId: lesson.id, lessonTitle: lesson.title };
      for (const point of lesson.grammar) {
        for (const ex of point.examples) {
          sentences.push({
            id: ex.audio,
            ...pick(ex),
            ...meta,
            source: 'grammar',
          });
        }
      }
      for (const line of lesson.dialogue) {
        sentences.push({
          id: line.audio,
          ...pick(line),
          ...meta,
          source: 'dialogue',
        });
      }
      for (const quote of lesson.quotes ?? []) {
        sentences.push({
          id: quote.audio,
          ...pick(quote),
          ...meta,
          source: 'quote',
        });
      }
    }
  }
  return sentences;
}

/** @param {{ jp: string, reading: string, ruby?: string, zh: string, audio: string }} line */
function pick({ jp, reading, ruby, zh, audio }) {
  return ruby === undefined
    ? { jp, reading, zh, audio }
    : { jp, reading, ruby, zh, audio };
}
