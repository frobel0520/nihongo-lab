/**
 * 課程編寫工具：用緊湊的陣列寫課程，自動補上語音角色與音檔路徑，輸出與 curriculum/lessons.mjs 相同的 Lesson 物件。
 *
 * 音檔路徑由「種類＋原文＋語音角色」的雜湊決定（內容定址）：改了原文或編排槽位，路徑就跟著變，
 * `node scripts/build-audio-jobs.mjs --missing` 會補產新檔，不會出現「文字改了、音檔還是舊的」。
 * 被改掉而不再使用的舊檔由 tests/audio-orphans.test.mjs 抓出來，要手動刪除。
 * 雜湊只用純 JavaScript（BigInt），因為這支檔案也會被打包進瀏覽器，不能用 node:crypto。
 *
 * @typedef {import('./lessons.mjs').Lesson} Lesson
 * @typedef {{ ruby?: string }} RowOptions 自動對齊讀音失敗時（例如含阿拉伯數字）手動標的 ruby 記法
 * @typedef {[word: string, reading: string, zh: string, options?: RowOptions]} VocabRow
 * @typedef {[jp: string, reading: string, zh: string, options?: RowOptions]} LineRow
 * @typedef {{ pattern: string, note: string, jlpt?: string[], examples: LineRow[] }} GrammarRow
 * @typedef {{
 *   id: string,
 *   title: string,
 *   audio: string,
 *   vocab: VocabRow[],
 *   grammar: GrammarRow[],
 *   dialogue: { voices: [string, string], lines: LineRow[] },
 *   practice: [q: string, a: string][],
 * }} LessonSpec
 */
// 已淘汰角色的槽位僅保留歷史 URL；公開入口 lessons.mjs 會套用現役選角。
import { lessonVoiceKeys } from './voices.mjs';

const VOICE_KEYS = lessonVoiceKeys;
const FNV_OFFSET = BigInt('0xcbf29ce484222325');
const FNV_PRIME = BigInt('0x100000001b3');
const MASK_64 = BigInt('0xffffffffffffffff');

/**
 * 64 位元 FNV-1a，取前 10 個十六進位字元（40 位元；全站約上千個音檔，碰撞機率可忽略，另有測試檢查不重複）。
 *
 * @param {string} text
 */
export function contentHash(text) {
  let hash = FNV_OFFSET;
  for (const byte of new TextEncoder().encode(text)) {
    hash = ((hash ^ BigInt(byte)) * FNV_PRIME) & MASK_64;
  }
  return hash.toString(16).padStart(16, '0').slice(0, 10);
}

/**
 * @param {string} base 音檔資料夾（不含開頭斜線）
 * @param {'vocab' | 'gram' | 'dlg'} kind
 * @param {string} jp
 * @param {string} voice
 */
export function audioPath(base, kind, jp, voice) {
  return `${base}/${kind}-${contentHash(`${kind}|${jp}|${voice}`)}.mp3`;
}

/**
 * @param {string} where
 * @param {string[]} fields
 */
function requireFilled(where, fields) {
  for (const field of fields) {
    if (typeof field !== 'string' || field.trim() === '') {
      throw new Error(`${where} 有空欄位：${JSON.stringify(fields)}`);
    }
  }
}

/**
 * @param {LessonSpec} spec
 * @returns {Lesson}
 */
export function defineLesson(spec) {
  const { id, title, audio: base } = spec;
  requireFilled(id, [id, title, base]);
  const [voiceA, voiceB] = spec.dialogue.voices;
  for (const key of [voiceA, voiceB]) {
    if (!VOICE_KEYS.includes(key)) throw new Error(`${id}: 未知角色 ${key}`);
  }

  return {
    id,
    title,
    vocab: spec.vocab.map(([word, reading, zh, options], i) => {
      requireFilled(`${id} 單字 #${i + 1}`, [word, reading, zh]);
      const voice = VOICE_KEYS[i % VOICE_KEYS.length];
      return {
        word,
        reading,
        zh,
        voice,
        audio: audioPath(base, 'vocab', word, voice),
        ...(options?.ruby ? { ruby: options.ruby } : {}),
      };
    }),
    grammar: spec.grammar.map((point, i) => {
      requireFilled(`${id} 文法 #${i + 1}`, [point.pattern, point.note]);
      // 每個文法點固定一個角色（依序輪替），同一點的例句聽起來是同一個人。
      const voice = VOICE_KEYS[(i + 3) % VOICE_KEYS.length];
      return {
        pattern: point.pattern,
        note: point.note,
        ...(point.jlpt ? { jlpt: point.jlpt } : {}),
        examples: point.examples.map(([jp, reading, zh, options], j) => {
          requireFilled(`${id} 文法 #${i + 1} 例句 #${j + 1}`, [
            jp,
            reading,
            zh,
          ]);
          return {
            jp,
            reading,
            zh,
            voice,
            audio: audioPath(base, 'gram', jp, voice),
            ...(options?.ruby ? { ruby: options.ruby } : {}),
          };
        }),
      };
    }),
    dialogue: spec.dialogue.lines.map(([jp, reading, zh, options], i) => {
      requireFilled(`${id} 對話 #${i + 1}`, [jp, reading, zh]);
      const voice = i % 2 === 0 ? voiceA : voiceB;
      return {
        jp,
        reading,
        zh,
        voice,
        audio: audioPath(base, 'dlg', jp, voice),
        ...(options?.ruby ? { ruby: options.ruby } : {}),
      };
    }),
    practice: spec.practice.map(([q, a], i) => {
      requireFilled(`${id} 練習 #${i + 1}`, [q, a]);
      return { q, a };
    }),
  };
}
