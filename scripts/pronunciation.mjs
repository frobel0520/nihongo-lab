import { rubyParts } from '../lib/furigana.mjs';

/** @typedef {{ text: string, reading: string, ruby?: string, kind?: string }} ReadingJob */
/** @typedef {{ accent_phrases: { moras: { text: string }[], accent?: number, pause_mora?: unknown, is_interrogative?: boolean }[] }} AudioQuery */

/** @param {string} text */
const katakana = (text) =>
  text.replace(/[ぁ-ゖ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 96));

/** Preserve written particles; replace ambiguous kanji with the curriculum reading. @param {ReadingJob} job */
export function readingText(job) {
  if (!job.reading?.trim()) throw new Error(`缺少教材讀音：${job.text}`);
  if (job.kind === 'vocab' && /[\p{Script=Han}々]/u.test(job.text))
    return katakana(job.reading);
  return readingParts(job)
    .map((p) => (p.ruby ? katakana(p.ruby) : p.text))
    .join('');
}

/** @param {ReadingJob} job */
export function readingParts(job) {
  const parts = rubyParts({
    jp: job.text,
    reading: job.reading,
    ruby: job.ruby,
  });
  if (!parts && /[\p{Script=Han}々\d]/u.test(job.text))
    throw new Error(`讀音無法對齊原文：${job.text}`);
  return parts ?? [{ text: job.text }];
}

const vowels = new Map();
for (const [vowel, chars] of [
  ['あ', 'あかがさざただなはばぱまやらわぁゃ'],
  ['い', 'いきぎしじちぢにひびぴみりゐぃ'],
  ['う', 'うくぐすずつづぬふぶぷむゆるゔぅゅ'],
  ['え', 'えけげせぜてでねへべぺめれゑぇ'],
  ['お', 'おこごそぞとどのほぼぽもよろをぉょ'],
])
  for (const char of chars) vowels.set(char, vowel);

/** Compare kana sounds, retaining mora count; standard long vowels and じ/ぢ・ず/づ are equivalent. @param {string} text */
export function normalizePronunciation(text) {
  const kana = text
    .normalize('NFKC')
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 96))
    .replace(/ぢ/g, 'じ')
    .replace(/づ/g, 'ず')
    .replace(/[^ぁ-ゖー]/g, '');
  let result = '';
  for (let char of kana) {
    const previous = vowels.get(result.at(-1));
    if (char === 'ー') char = previous ?? char;
    else if (char === 'う' && previous === 'お') char = 'お';
    else if (char === 'い' && previous === 'え') char = 'え';
    result += char;
  }
  return result;
}

/** @param {AudioQuery} query */
export function spokenReading(query) {
  return query.accent_phrases
    .flatMap((p) => p.moras.map((m) => m.text))
    .join('');
}

/** Reject an unchecked query instead of publishing a wrong clip. @param {AudioQuery} query @param {string} pronunciation */
export function assertPronunciation(query, pronunciation) {
  const actual = spokenReading(query);
  if (
    !normalizePronunciation(pronunciation) ||
    normalizePronunciation(actual) !== normalizePronunciation(pronunciation)
  ) {
    throw new Error(
      `讀音不一致，停止合成：預期 ${pronunciation}；引擎 ${actual}`,
    );
  }
}

/** A reading correction needs review if it also changes accent positions or phrase boundaries.
 * @param {AudioQuery} before @param {AudioQuery} after
 */
export function assertProsodyUnchanged(before, after) {
  /** @param {AudioQuery} query */
  const structure = (query) =>
    JSON.stringify(
      query.accent_phrases.map((p) => [
        p.moras.length,
        p.accent,
        !!p.pause_mora,
        !!p.is_interrogative,
      ]),
    );
  if (structure(before) !== structure(after))
    throw new Error(
      '指定讀音也改變重音或句界，停止合成；請新增已核對的重音覆寫。',
    );
}
