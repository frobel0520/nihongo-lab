/**
 * 教材文字的讀音標記（T35）：查表與「還沒檢查的字串」檢查（純邏輯）。
 *
 * 單字、例句、對話、名句的日文有 reading 欄位，讀音由 furigana.mjs 自動對齊；
 * 課程標題、文法句型標題與說明、練習題與答案、名句出處與解說、各種中文翻譯裡夾的日文沒有讀音資料，
 * 它們的標記放在 curriculum/ruby-notes.mjs（人工逐字串檢查過），這裡以「原字串」查表。
 *
 * @typedef {import('./furigana.mjs').RubyPart} RubyPart
 */
import { parseRuby, plainText } from './furigana.mjs';

/** 讀音只能是假名（含長音、片假名）。 */
export const KANA_ONLY = /^[ぁ-ゖァ-ヺー]+$/;

/**
 * 把標記清單變成「原字串 → 標記片段」的查表。
 *
 * @param {readonly string[]} notes 例：'{私|わたし}は{学生|がくせい}です。'
 * @returns {Map<string, RubyPart[]>}
 */
export function buildNotesIndex(notes) {
  /** @type {Map<string, RubyPart[]>} */
  const index = new Map();
  for (const markup of notes) {
    const parts = parseRuby(markup);
    index.set(plainText(parts), parts);
  }
  return index;
}

/**
 * 查這個字串有沒有標記；沒有就回傳 null，畫面維持原樣。
 *
 * @param {string} text
 * @param {Map<string, RubyPart[]>} index
 * @returns {RubyPart[] | null}
 */
export function annotateText(text, index) {
  return index.get(text) ?? null;
}

// ───────── 以下給測試與新增教材時檢查用 ─────────

/** 教材的日文欄位（不拿來標讀音，或已有 reading 自動對齊）。 */
const SKIP_KEYS = new Set([
  'jp',
  'word',
  'reading',
  'ruby',
  'audio',
  'voice',
  'id',
  'jlpt',
  'audioReady',
]);

/** 只出現在文法說明裡、不在日文欄位裡的日文漢字（文法用語等），算日文漢字。 */
const GRAMMAR_TERM_KANJI =
  '形普通丁寧辞書名詞動容自他続修飾文対応会話口語縮約単位数字経験変化総時刻交通具場所期間量段秒部食事番薬屋花子世天空過去比較肯定否疑問式命令意志可能受身使役条件仮定敬謙尊譲';

const KANJI = '\\u4e00-\\u9fff々';
const KANA = '\\u3041-\\u3096\\u30a1-\\u30faー';
const SPAN = new RegExp(
  `[${KANJI}${KANA}〜・](?:[ ]?[${KANJI}${KANA}〜・])*`,
  'g',
);
const RUN = new RegExp(`[${KANJI}]+`, 'g');
const HAS_KANA = new RegExp(`[${KANA}]`);

/**
 * 會顯示在畫面上、可能夾著日文漢字的教材字串（課程資料裡除了日文欄位以外的所有字串）。
 *
 * @param {unknown} data 例如 stages
 * @returns {Set<string>}
 */
export function displayedTexts(data) {
  /** @type {Set<string>} */
  const texts = new Set();
  (function walk(value) {
    if (typeof value === 'string') texts.add(value);
    else if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === 'object') {
      for (const [key, item] of Object.entries(value)) {
        if (!SKIP_KEYS.has(key)) walk(item);
      }
    }
  })(data);
  return texts;
}

/**
 * 教材日文欄位用過的漢字（加上文法用語的漢字）：中文說明裡的字（禮、貌、斷…）多半不在裡面，
 * 拿它來區分「日文漢字串」與「中文詞」。
 *
 * @param {{ lessons: { vocab: { word: string }[], grammar: { examples: { jp: string }[] }[], dialogue: { jp: string }[], quotes?: { jp: string }[] }[] }[]} stages
 * @returns {Set<string>}
 */
export function japaneseKanjiSet(stages) {
  const kanji = new RegExp(`[${KANJI}]`);
  /** @type {Set<string>} */
  const set = new Set(GRAMMAR_TERM_KANJI);
  for (const stage of stages) {
    for (const lesson of stage.lessons) {
      const lines = [
        ...lesson.vocab.map((v) => v.word),
        ...lesson.grammar.flatMap((g) => g.examples.map((e) => e.jp)),
        ...lesson.dialogue.map((d) => d.jp),
        ...(lesson.quotes ?? []).map((q) => q.jp),
      ];
      for (const line of lines) {
        for (const ch of line) if (kanji.test(ch)) set.add(ch);
      }
    }
  }
  return set;
}

/**
 * 字串裡「看起來是日文」的漢字串：在含假名的日文區段（漢字、假名、〜、・連在一起）裡、
 * 而且全部由日文用過的漢字組成。中文詞緊貼著假名時也會被抓到，所以結果只用來
 * 判斷「這個字串需要人看過」，不代表一定要標。
 *
 * @param {string} text
 * @param {Set<string>} kanjiSet
 * @returns {string[]}
 */
export function candidateRuns(text, kanjiSet) {
  /** @type {string[]} */
  const runs = [];
  for (const span of text.matchAll(SPAN)) {
    if (!HAS_KANA.test(span[0])) continue;
    for (const run of span[0].matchAll(RUN)) {
      if ([...run[0]].every((ch) => kanjiSet.has(ch))) runs.push(run[0]);
    }
  }
  return runs;
}

/**
 * 還沒人看過的字串：有候選漢字串、但不在標記清單裡。新增教材後跑測試會列出這些，
 * 逐一決定要標哪些（沒有要標的也要加一筆與原字串相同的項目，代表看過了）。
 *
 * @param {Parameters<typeof japaneseKanjiSet>[0]} stages
 * @param {Map<string, RubyPart[]>} index
 * @returns {{ text: string, runs: string[] }[]}
 */
export function missingNotes(stages, index) {
  const kanjiSet = japaneseKanjiSet(stages);
  /** @type {{ text: string, runs: string[] }[]} */
  const missing = [];
  for (const text of displayedTexts(stages)) {
    const runs = candidateRuns(text, kanjiSet);
    if (runs.length > 0 && !index.has(text)) missing.push({ text, runs });
  }
  return missing;
}
