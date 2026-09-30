/**
 * 教材與外部級別清單（OpenJLPT）的涵蓋率計算（純邏輯，無網路、無檔案；
 * 下載與輸出在 scripts/coverage-openjlpt.mjs）。級別清單只用來對照，資料不進 repo。
 *
 * @typedef {import('../curriculum/lessons.mjs').Lesson} Lesson
 * @typedef {{ word: string, reading: string, level: string }} RefVocab
 * @typedef {{ character: string, level: string }} RefKanji
 * @typedef {{ id: string, pattern: string, level: string }} RefGrammar
 * @typedef {{
 *   word: string,
 *   reading: string,
 *   status: 'match' | 'reading-diff' | 'missing',
 *   level?: string,
 *   refReading?: string,
 * }} VocabMatch
 */

// 「々」「〆」「〇」在 Unicode 屬於漢字，但不是要學的漢字。
const NOT_KANJI = new Set(['々', '〆', '〇']);

/** 'N5' → 5；數字越大越簡單。 @param {string} level */
const levelNumber = (level) => Number(level.replace(/\D/g, ''));

/**
 * 一課裡的日文原文（單字、文法例句、對話、名句），用來統計用到哪些漢字。
 * 練習題中文與日文混寫，不納入。
 *
 * @param {Lesson} lesson
 * @returns {string[]}
 */
export function japaneseTexts(lesson) {
  return [
    ...lesson.vocab.map((v) => v.word),
    ...lesson.grammar.flatMap((g) => g.examples.map((e) => e.jp)),
    ...lesson.dialogue.map((d) => d.jp),
    ...(lesson.quotes ?? []).map((q) => q.jp),
  ];
}

/** 不重複、排序後的漢字。 @param {string[]} texts */
export function extractKanji(texts) {
  const found = new Set();
  for (const char of texts.join('')) {
    if (/\p{Script=Han}/u.test(char) && !NOT_KANJI.has(char)) found.add(char);
  }
  return [...found].sort();
}

/**
 * 逐一對照我們的單字與清單。同一個字在清單有多個讀音時，先找讀音相同的；
 * 找不到就取最簡單的級別並標成 reading-diff（例如清單把「私」登記成わたくし）。
 * 我們的單字依字面去重。
 *
 * @param {{ word: string, reading: string }[]} items
 * @param {RefVocab[]} refVocab
 * @returns {VocabMatch[]}
 */
export function matchVocab(items, refVocab) {
  /** @type {Map<string, RefVocab[]>} */
  const byWord = new Map();
  for (const entry of refVocab) {
    byWord.set(entry.word, [...(byWord.get(entry.word) ?? []), entry]);
  }

  const seen = new Set();
  /** @type {VocabMatch[]} */
  const results = [];
  for (const { word, reading } of items) {
    if (seen.has(word)) continue;
    seen.add(word);

    const entries = byWord.get(word);
    if (!entries) {
      results.push({ word, reading, status: 'missing' });
      continue;
    }
    const exact = entries.find((e) => e.reading === reading);
    if (exact) {
      results.push({ word, reading, status: 'match', level: exact.level });
      continue;
    }
    const [easiest] = [...entries].sort(
      (a, b) => levelNumber(b.level) - levelNumber(a.level),
    );
    results.push({
      word,
      reading,
      status: 'reading-diff',
      level: easiest.level,
      refReading: easiest.reading,
    });
  }
  return results;
}

/**
 * 目標級別單字的涵蓋情形。
 *
 * @param {VocabMatch[]} matches
 * @param {RefVocab[]} refVocab
 * @param {string} level
 */
export function vocabCoverage(matches, refVocab, level) {
  const target = refVocab.filter((e) => e.level === level);
  const covered = new Set(
    matches.filter((m) => m.level === level).map((m) => m.word),
  );
  return {
    total: target.length,
    covered: target.filter((e) => covered.has(e.word)).length,
    uncovered: target.filter((e) => !covered.has(e.word)),
  };
}

/**
 * 教材用到的漢字，依清單級別分組；並算出目標級別漢字表的涵蓋情形。
 *
 * @param {string[]} used
 * @param {RefKanji[]} refKanji
 * @param {string} level
 */
export function kanjiCoverage(used, refKanji, level) {
  const levelOf = new Map(refKanji.map((k) => [k.character, k.level]));
  /** @type {Record<string, string[]>} */
  const byLevel = {};
  for (const char of used) {
    const key = levelOf.get(char) ?? '未收錄';
    byLevel[key] = [...(byLevel[key] ?? []), char];
  }

  const usedSet = new Set(used);
  const target = refKanji
    .filter((k) => k.level === level)
    .map((k) => k.character);
  return {
    byLevel,
    total: target.length,
    covered: target.filter((c) => usedSet.has(c)).length,
    uncovered: target.filter((c) => !usedSet.has(c)),
  };
}

/**
 * 文法涵蓋率：靠文法點上手動標的 `jlpt` id（對應清單的 id）計算。
 * unknown 是標了但清單裡找不到的 id（多半是打錯）；untagged 是還沒標 jlpt 的文法點數。
 *
 * @param {Lesson[]} lessons
 * @param {RefGrammar[]} refGrammar
 * @param {string} level
 */
export function grammarCoverage(lessons, refGrammar, level) {
  const points = lessons.flatMap((l) => l.grammar);
  const cited = new Set(points.flatMap((g) => g.jlpt ?? []));
  const known = new Set(refGrammar.map((g) => g.id));
  const target = refGrammar.filter((g) => g.level === level);
  return {
    total: target.length,
    covered: target.filter((g) => cited.has(g.id)).length,
    uncovered: target.filter((g) => !cited.has(g.id)),
    unknown: [...cited].filter((id) => !known.has(id)),
    untagged: points.filter((g) => !g.jlpt?.length).length,
  };
}

/**
 * 課數推算：全部課平均要多少，以及「剩下的課」平均要補多少（已完成課數不重算）。
 *
 * @param {number} total 目標級別的項目總數
 * @param {number} covered 已涵蓋數
 * @param {number} plannedLessons 預計總課數
 * @param {number} doneLessons 已完成課數
 */
export function pacing(total, covered, plannedLessons, doneLessons) {
  const remainingLessons = plannedLessons - doneLessons;
  return {
    perLesson: total / plannedLessons,
    remainingPerLesson:
      remainingLessons > 0 ? (total - covered) / remainingLessons : null,
  };
}
