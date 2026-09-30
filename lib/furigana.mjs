/**
 * 漢字上方標讀音（ふりがな）的純邏輯，輸出給畫面轉成 <ruby>。
 *
 * 教材每句已有整句假名讀音（reading），這裡把它對回每段漢字：漢字段之間的假名（送假名、助詞）
 * 當定位點，剩下的讀音就是漢字段的讀音。讀音標整段漢字（會社員 → かいしゃいん），不逐字拆。
 * 對不起來或有多種對法時回傳 null，不猜；這種句子在資料裡用 `ruby` 欄位手動標（見 parseRuby）。
 *
 * @typedef {{ text: string, ruby?: string }} RubyPart
 */

const KANJI = /[\p{Script=Han}々]/u;
const SPACE = /[\p{Z}\s]/u;
// 標點與符號；長音「ー」不算標點。
const PUNCT = /[\p{P}\p{S}]/u;

/** @param {string} char */
const isKanji = (char) => KANJI.test(char);

/** 片假名轉平假名（U+30A1～U+30F6），其他字元不動。 @param {string} text */
const fold = (text) =>
  text.replace(/[\u30a1-\u30f6]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) - 0x60),
  );

/**
 * 讀音欄位整理成「不含空白的假名字串」加「原本有空白的位置」。
 * 空白與標點是漢字段之間唯一的邊界線索（例如「宿題、忘れ」「涙雨 降りて」）。
 *
 * @param {string} reading
 */
function prepareReading(reading) {
  let target = '';
  /** @type {Set<number>} */
  const gaps = new Set();
  for (const char of reading) {
    if (SPACE.test(char)) gaps.add(target.length);
    else target += fold(char);
  }
  return { target, gaps };
}

/**
 * 把原文切成「漢字段」與「其他段」（假名、標點、空白、數字、英文）交替的段落。
 *
 * @param {string} text
 * @returns {{ kanji: boolean, text: string }[]}
 */
function segment(text) {
  /** @type {{ kanji: boolean, text: string }[]} */
  const segments = [];
  for (const char of text) {
    const kanji = isKanji(char);
    const last = segments[segments.length - 1];
    if (last && last.kanji === kanji) last.text += char;
    else segments.push({ kanji, text: char });
  }
  return segments;
}

/**
 * 從讀音的 position 開始吃掉「其他段」，回傳新位置；對不上回 -1。
 * 假名必須一致；標點若讀音裡也有就一起吃掉，沒有就略過；空白不吃。
 * 夾在兩個漢字段之間、只有空白或標點的段落，必須真的在讀音裡看到邊界（空白或同一個標點），
 * 否則兩段漢字的讀音沒辦法切開，回 -1。
 *
 * @param {string} text
 * @param {number} position
 * @param {{ target: string, gaps: Set<number> }} reading
 * @param {boolean} betweenKanji
 */
function consume(text, position, reading, betweenKanji) {
  const { target, gaps } = reading;
  let at = position;
  let sawBoundary = gaps.has(position);
  let separatorOnly = true;
  for (const char of text) {
    if (SPACE.test(char)) continue;
    if (PUNCT.test(char)) {
      if (target[at] === char) {
        at++;
        sawBoundary = true;
      }
      continue;
    }
    separatorOnly = false;
    const expected = fold(char);
    if (target[at] !== expected) return -1;
    at++;
  }
  return betweenKanji && separatorOnly && !sawBoundary ? -1 : at;
}

/**
 * 把原文與整句假名讀音對齊成 RubyPart[]；沒有漢字、對不起來、或有多種對法時回傳 null。
 * 沒有漢字的句子不需要標讀音，也回傳 null。
 *
 * @param {string} jp
 * @param {string} reading
 * @returns {RubyPart[] | null}
 */
export function alignFurigana(jp, reading) {
  const segments = segment(jp);
  if (!segments.some((s) => s.kanji)) return null;

  const prepared = prepareReading(reading);
  const { target } = prepared;
  /** @type {string[][]} 每個成功對法的漢字段讀音 */
  const solutions = [];

  /** @param {number} si @param {number} ri @param {string[]} readings */
  const walk = (si, ri, readings) => {
    if (solutions.length > 1) return; // 已知不唯一，不必再找
    if (si === segments.length) {
      if (ri === target.length) solutions.push(readings);
      return;
    }
    const seg = segments[si];
    if (!seg.kanji) {
      const betweenKanji = segments[si - 1]?.kanji && segments[si + 1]?.kanji;
      const next = consume(seg.text, ri, prepared, Boolean(betweenKanji));
      if (next !== -1) walk(si + 1, next, readings);
      return;
    }
    // 漢字段的讀音只由假名組成，遇到標點就不能再往後延伸。
    for (let end = ri + 1; end <= target.length; end++) {
      if (PUNCT.test(target[end - 1]) && target[end - 1] !== 'ー') break;
      walk(si + 1, end, [...readings, target.slice(ri, end)]);
    }
  };
  walk(0, 0, []);

  if (solutions.length !== 1) return null;
  const [readings] = solutions;
  let next = 0;
  return segments.map((s) =>
    s.kanji ? { text: s.text, ruby: readings[next++] } : { text: s.text },
  );
}

/**
 * 解析手動標註 `{40|よんじゅう}秒で…`：大括號內「原文|讀音」，其餘照原樣。
 * 格式與 OpenJLPT 例句的 furigana 欄位相同，只是記法，沒有用到它的內容。
 *
 * @param {string} notation
 * @returns {RubyPart[]}
 */
export function parseRuby(notation) {
  /** @type {RubyPart[]} */
  const parts = [];
  const pattern = /\{([^{}|]+)\|([^{}|]+)\}/g;
  let last = 0;
  for (const match of notation.matchAll(pattern)) {
    if (match.index > last)
      parts.push({ text: notation.slice(last, match.index) });
    parts.push({ text: match[1], ruby: match[2] });
    last = match.index + match[0].length;
  }
  if (last < notation.length) parts.push({ text: notation.slice(last) });
  return parts;
}

/** 把 RubyPart[] 還原成不帶讀音的原文。 @param {RubyPart[]} parts */
export function plainText(parts) {
  return parts.map((p) => p.text).join('');
}

/**
 * 一句要顯示的讀音標記：有手動標註就用手動的，否則自動對齊；都不行回傳 null（畫面退回純文字）。
 * 手動標註的原文與 jp 不一致時也回傳 null，避免畫面顯示的字和音檔內容不同。
 *
 * @param {{ jp: string, reading: string, ruby?: string }} line
 * @returns {RubyPart[] | null}
 */
export function rubyParts({ jp, reading, ruby }) {
  if (ruby !== undefined) {
    const parts = parseRuby(ruby);
    return plainText(parts) === jp ? parts : null;
  }
  return alignFurigana(jp, reading);
}
