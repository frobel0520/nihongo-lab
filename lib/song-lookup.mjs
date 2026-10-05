/**
 * 歌詞的查詞（純邏輯）：先查教材單字（有中文、課次），再查 JMdict 英文釋義；詞性轉成中文。
 *
 * JMdict 屬於 Electronic Dictionary Research and Development Group（EDRDG），以 CC BY-SA 4.0 授權；
 * 這裡用 jmdict-simplified 的 common 版轉成精簡索引，建置時產生、不提交進 repo（見 docs/song-reader.md）。
 *
 * @typedef {import('./songs.mjs').Token} Token
 * @typedef {{ word: string, reading: string, zh: string, lessonId: string, lessonTitle: string }} VocabHit
 * @typedef {{ kana: string, gloss: string }} JmdictHit
 * @typedef {{ version: string, entries: [string, string][], forms: Record<string, number[]> }} JmdictIndex
 *   entries：[讀音, 英文釋義]；forms：寫法或讀音 → entries 的索引。
 */

export const JMDICT_FILE = 'jmdict-eng-common.json';

/** @param {Token} token */
const baseForm = (token) => token.b ?? token.s;

const KANJI = /[\p{Script=Han}々〆ヶ]/u;

/**
 * @param {{ lessons: { id: string, title: string, vocab?: { word: string, reading: string, zh: string }[] }[] }[]} stages
 * @returns {Map<string, VocabHit[]>}
 */
export function buildVocabIndex(stages) {
  /** @type {Map<string, VocabHit[]>} */
  const index = new Map();
  /** @param {string} key @param {VocabHit} hit */
  const add = (key, hit) => {
    const list = index.get(key) ?? [];
    if (!list.some((h) => h.word === hit.word && h.zh === hit.zh)) list.push(hit);
    index.set(key, list);
  };
  for (const stage of stages) {
    for (const lesson of stage.lessons) {
      for (const v of lesson.vocab ?? []) {
        const hit = {
          word: v.word,
          reading: v.reading,
          zh: v.zh,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
        };
        add(v.word, hit);
        // 用假名寫的歌詞也要查得到漢字單字（例如 ありがとう／有難う）
        if (v.reading !== v.word) add(`reading:${v.reading}`, hit);
      }
    }
  }
  return index;
}

/**
 * 查教材單字：先比原形、再比表層形；詞本身沒有漢字時，再用讀音找漢字寫法的單字。
 *
 * @param {Map<string, VocabHit[]>} index
 * @param {Token} token
 * @returns {VocabHit[]}
 */
export function lookupVocab(index, token) {
  const direct = index.get(baseForm(token)) ?? index.get(token.s);
  if (direct) return direct;
  if (!KANJI.test(token.s)) return index.get(`reading:${baseForm(token)}`) ?? [];
  return [];
}

/**
 * @param {JmdictIndex} index
 * @param {Token} token
 * @returns {JmdictHit[]}
 */
export function lookupJmdict(index, token) {
  const ids = index.forms[baseForm(token)] ?? index.forms[token.s] ?? [];
  return ids.map((id) => {
    const [kana, gloss] = index.entries[id];
    return { kana, gloss };
  });
}

const POS_LABELS = {
  名詞: '名詞',
  動詞: '動詞',
  形容詞: 'い形容詞',
  形容動詞: 'な形容詞',
  副詞: '副詞',
  助詞: '助詞',
  助動詞: '助動詞',
  連体詞: '連體詞',
  接続詞: '接續詞',
  感動詞: '感嘆詞',
  接頭詞: '接頭詞',
  記号: '符號',
  フィラー: '語氣填充詞',
};

const DETAIL_LABELS = {
  形容動詞語幹: 'な形容詞語幹',
  代名詞: '代名詞',
  固有名詞: '專有名詞',
  数: '數字',
  非自立: '補助用法',
  接尾: '接尾',
  格助詞: '格助詞',
  係助詞: '係助詞（は・も 等）',
  副助詞: '副助詞',
  接続助詞: '接續助詞',
  終助詞: '句尾助詞',
  'サ変接続': '可接「する」',
};

/**
 * 詞性的中文說明，例如「名詞（な形容詞語幹）」「助詞（句尾助詞）」。
 *
 * @param {Token} token
 */
export function posLabel(token) {
  const main = POS_LABELS[/** @type {keyof typeof POS_LABELS} */ (token.p)] ?? token.p;
  const detail = token.pd
    ? DETAIL_LABELS[/** @type {keyof typeof DETAIL_LABELS} */ (token.pd)]
    : undefined;
  return detail ? `${main}（${detail}）` : main;
}

/**
 * jmdict-simplified 的 JSON → 精簡索引。每個詞最多取前 maxSenses 個義項、每個義項前 maxGlosses 個英文，
 * 用「；」分義項、「, 」分同義。寫法（漢字）與讀音（假名）都能查到。
 *
 * @param {{ version?: string, words: { kanji: { text: string }[], kana: { text: string }[], sense: { gloss: { lang?: string, text: string }[] }[] }[] }} data
 * @param {{ maxSenses?: number, maxGlosses?: number }} [options]
 * @returns {JmdictIndex}
 */
export function buildJmdictIndex(data, { maxSenses = 3, maxGlosses = 3 } = {}) {
  /** @type {[string, string][]} */
  const entries = [];
  /** @type {Record<string, number[]>} */
  const forms = {};
  for (const word of data.words) {
    const kana = word.kana[0]?.text;
    const gloss = word.sense
      .slice(0, maxSenses)
      .map((sense) =>
        sense.gloss
          .filter((g) => (g.lang ?? 'eng') === 'eng')
          .slice(0, maxGlosses)
          .map((g) => g.text)
          .join(', '),
      )
      .filter((text) => text !== '')
      .join('; ');
    if (!kana || gloss === '') continue;
    const id = entries.length;
    entries.push([kana, gloss]);
    for (const form of [...word.kanji.map((k) => k.text), ...word.kana.map((k) => k.text)]) {
      const list = (forms[form] ??= []);
      if (!list.includes(id)) list.push(id);
    }
  }
  return { version: data.version ?? 'unknown', entries, forms };
}
