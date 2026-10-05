/**
 * 歌詞斷詞結果（純邏輯）：把 kuromoji 的詞轉成精簡的 Token 存進歌曲、算出每個詞的讀音標記、
 * 使用者改讀音。斷詞器本身由呼叫端提供（瀏覽器在 Worker 裡、測試在 Node 裡），這裡不載入字典。
 *
 * @typedef {import('./songs.mjs').Token} Token
 * @typedef {import('./songs.mjs').Song} Song
 * @typedef {import('./furigana.mjs').RubyPart} RubyPart
 * @typedef {{
 *   surface_form: string,
 *   pos: string,
 *   pos_detail_1: string,
 *   conjugated_form: string,
 *   basic_form: string,
 *   reading?: string,
 * }} KuromojiToken
 */
import { alignFurigana } from './furigana.mjs';

/** 存在歌曲裡的分析器名稱；換字典或規則時改這裡，畫面可以提示重新分析。 */
export const ANALYZER_ID = 'kuromoji-ipadic@1.0.4';

/** kuromoji 會要的字典檔（與 @patdx/kuromoji 的 dict/ 相同）。 */
export const KUROMOJI_FILES = [
  'base.dat.gz',
  'cc.dat.gz',
  'check.dat.gz',
  'tid.dat.gz',
  'tid_map.dat.gz',
  'tid_pos.dat.gz',
  'unk.dat.gz',
  'unk_char.dat.gz',
  'unk_compat.dat.gz',
  'unk_invoke.dat.gz',
  'unk_map.dat.gz',
  'unk_pos.dat.gz',
];

/** 字典檔在網站上的位置（相對於 BASE_URL）與快取名稱。 */
export const SONG_ASSETS_PATH = 'song-assets/';
export const KUROMOJI_PATH = `${SONG_ASSETS_PATH}kuromoji/`;
export const SONG_ASSETS_CACHE = 'song-assets-v1';

const KANJI = /[\p{Script=Han}々〆ヶ]/u;

/** @param {string} text */
export const hasKanji = (text) => KANJI.test(text);

/** 片假名轉平假名（U+30A1～U+30F6），長音與其他字元不動。 @param {string} text */
export const toHiragana = (text) =>
  text.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));

/** kuromoji 用 '*' 表示「沒有」。 @param {string | undefined} value */
const present = (value) => (value && value !== '*' ? value : undefined);

/**
 * kuromoji 的一個詞 → 存進歌曲的精簡 Token。讀音只在含漢字時存（假名不需要標）；
 * 原形與表層形相同時不存。
 *
 * @param {KuromojiToken} raw
 * @returns {Token}
 */
export function toToken(raw) {
  /** @type {Token} */
  const token = { s: raw.surface_form, p: raw.pos };
  const reading = present(raw.reading);
  if (reading && hasKanji(raw.surface_form)) token.r = toHiragana(reading);
  const basic = present(raw.basic_form);
  if (basic && basic !== raw.surface_form) token.b = basic;
  const detail = present(raw.pos_detail_1);
  if (detail) token.pd = detail;
  const form = present(raw.conjugated_form);
  if (form) token.cf = form;
  return token;
}

/**
 * 用斷詞器分析一行；空行不分析。
 *
 * @param {{ tokenize(text: string): KuromojiToken[] }} tokenizer
 * @param {string} text
 * @returns {Token[]}
 */
export const analyzeLine = (tokenizer, text) =>
  text === '' ? [] : tokenizer.tokenize(text).map(toToken);

/** 這個詞目前用的讀音：使用者改過的優先。 @param {Token} token */
export const tokenReading = (token) => token.o ?? token.r;

/**
 * 一個詞的讀音標記：送假名不標，只把讀音標在漢字上（食べ → 食[た]べ）；
 * 對不出送假名時整個詞標一個讀音，不猜。沒有漢字或沒有讀音就不標。
 *
 * @param {Token} token
 * @returns {RubyPart[]}
 */
export function tokenRuby(token) {
  const reading = tokenReading(token);
  if (!reading || !hasKanji(token.s)) return [{ text: token.s }];
  return alignFurigana(token.s, reading) ?? [{ text: token.s, ruby: reading }];
}

/**
 * 把各行的分析結果寫進歌曲。results 的索引對應 song.lines；分析時歌詞被改過
 * （同一行的文字不同了）就不寫，留給下次分析。
 *
 * @param {Song} song
 * @param {{ text: string, tokens: Token[] }[]} results
 * @param {string} now
 * @returns {Song}
 */
export function applyAnalysis(song, results, now) {
  const lines = song.lines.map((line, i) => {
    const result = results[i];
    if (line.text === '') return { ...line, tokens: [] };
    if (!result || result.text !== line.text) return line;
    // 重新分析時保留使用者改過的讀音（同一位置、同一個詞才沿用）。
    const previous = line.tokens ?? [];
    const tokens = result.tokens.map((token, j) => {
      const old = previous[j];
      return old?.o && old.s === token.s ? { ...token, o: old.o } : token;
    });
    return { ...line, tokens };
  });
  return {
    ...song,
    lines,
    analysis: { analyzer: ANALYZER_ID, analyzedAt: now },
    updatedAt: now,
  };
}

/**
 * 改一個詞的讀音（只影響這首歌的這個位置）。空字串或與原讀音相同就還原。
 *
 * @param {Song} song
 * @param {number} lineIndex
 * @param {number} tokenIndex
 * @param {string} reading
 * @param {string} now
 * @returns {Song}
 */
export function setTokenReading(song, lineIndex, tokenIndex, reading, now) {
  const line = song.lines[lineIndex];
  const token = line?.tokens?.[tokenIndex];
  if (!line || !line.tokens || !token) {
    throw new RangeError(`沒有第 ${lineIndex} 行第 ${tokenIndex} 個詞`);
  }
  const value = toHiragana(reading.trim());
  /** @type {Token} */
  const next = { ...token };
  if (value === '' || value === token.r) delete next.o;
  else next.o = value;
  const tokens = line.tokens.map((t, j) => (j === tokenIndex ? next : t));
  const lines = song.lines.map((l, i) => (i === lineIndex ? { ...l, tokens } : l));
  return { ...song, lines, updatedAt: now };
}

/**
 * 字典檔的內容：伺服器有時已經依 Content-Encoding 解壓，有時原樣送 gzip。看檔頭判斷，
 * 是 gzip 才交給 decompress（瀏覽器用 DecompressionStream、測試用 zlib）。
 *
 * @param {ArrayBuffer} buffer
 * @param {(gz: ArrayBuffer) => Promise<ArrayBuffer>} decompress
 * @returns {Promise<ArrayBuffer>}
 */
export async function gunzipIfNeeded(buffer, decompress) {
  const head = new Uint8Array(buffer, 0, Math.min(2, buffer.byteLength));
  const isGzip = head.length === 2 && head[0] === 0x1f && head[1] === 0x8b;
  return isGzip ? decompress(buffer) : buffer;
}
