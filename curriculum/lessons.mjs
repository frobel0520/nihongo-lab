/**
 * @typedef {{ jp: string, reading: string, zh: string, voice: string, audio: string }} Line
 * @typedef {{ pattern: string, note: string, examples: Line[] }} GrammarPoint
 * @typedef {{ word: string, reading: string, zh: string, voice: string, audio: string }} VocabItem
 * @typedef {{ q: string, a: string }} PracticeItem
 * @typedef {{
 *   id: string,
 *   title: string,
 *   vocab: VocabItem[],
 *   grammar: GrammarPoint[],
 *   dialogue: Line[],
 *   practice: PracticeItem[],
 * }} Lesson
 * @typedef {{ id: string, title: string, lessons: Lesson[] }} Stage
 */

// 不含開頭斜線：由畫面端接上 Vite 的 BASE_URL，才能在 GitHub Pages 子路徑下正確解析。
const AUDIO_BASE = 'audio/stage-0/day1';

/** @type {Lesson} */
const day1 = {
  id: 'stage0-day1',
  title: '第 1 天：五十音自我檢查 + です／は／も',
  vocab: [
    { word: '私', reading: 'わたし', zh: '我', voice: 'zundamon', audio: `${AUDIO_BASE}/vocab-watashi.mp3` },
    { word: 'あなた', reading: 'あなた', zh: '你', voice: 'tsumugi', audio: `${AUDIO_BASE}/vocab-anata.mp3` },
    { word: '〜さん', reading: '〜さん', zh: '～先生／小姐（敬稱）', voice: 'hau', audio: `${AUDIO_BASE}/vocab-san.mp3` },
    { word: '学生', reading: 'がくせい', zh: '學生', voice: 'sayo', audio: `${AUDIO_BASE}/vocab-gakusei.mp3` },
    { word: '先生', reading: 'せんせい', zh: '老師', voice: 'miko', audio: `${AUDIO_BASE}/vocab-sensei.mp3` },
    { word: '会社員', reading: 'かいしゃいん', zh: '公司職員', voice: 'nana', audio: `${AUDIO_BASE}/vocab-kaishain.mp3` },
    { word: '何人', reading: 'なにじん', zh: '哪國人', voice: 'neko-vy', audio: `${AUDIO_BASE}/vocab-nanijin.mp3` },
    { word: '名前', reading: 'なまえ', zh: '名字', voice: 'chuugoku-usagi', audio: `${AUDIO_BASE}/vocab-namae.mp3` },
    { word: '国', reading: 'くに', zh: '國家', voice: 'zunko', audio: `${AUDIO_BASE}/vocab-kuni.mp3` },
  ],
  grammar: [
    {
      pattern: 'A は B です',
      note: 'A 是 B。です 是禮貌的斷定語氣，句尾語調平穩下降。',
      examples: [
        { jp: '私は学生です。', reading: 'わたしは がくせいです。', zh: '我是學生。', voice: 'zundamon', audio: `${AUDIO_BASE}/gram-1-1.mp3` },
        { jp: '田中さんは先生です。', reading: 'たなかさんは せんせいです。', zh: '田中先生是老師。', voice: 'zundamon', audio: `${AUDIO_BASE}/gram-1-2.mp3` },
      ],
    },
    {
      pattern: 'A は B ですか',
      note: '疑問句，句尾加か、語調上揚，不用加「？」也成立。',
      examples: [
        { jp: 'あなたは会社員ですか。', reading: 'あなたは かいしゃいんですか。', zh: '你是公司職員嗎？', voice: 'zundamon', audio: `${AUDIO_BASE}/gram-2-1.mp3` },
        { jp: '田中さんは先生ですか。', reading: 'たなかさんは せんせいですか。', zh: '田中先生是老師嗎？', voice: 'zundamon', audio: `${AUDIO_BASE}/gram-2-2.mp3` },
      ],
    },
    {
      pattern: 'A は B では ありません',
      note: '否定句。口語常說成「じゃ ありません」，兩者意思一樣。',
      examples: [
        { jp: '私は先生ではありません。', reading: 'わたしは せんせいでは ありません。', zh: '我不是老師。', voice: 'zundamon', audio: `${AUDIO_BASE}/gram-3-1.mp3` },
        { jp: 'あなたは学生ではありません。', reading: 'あなたは がくせいでは ありません。', zh: '你不是學生。', voice: 'zundamon', audio: `${AUDIO_BASE}/gram-3-2.mp3` },
      ],
    },
    {
      pattern: 'A も B です',
      note: '「也」的意思，替換掉は，提示前面已經講過同類的事。',
      examples: [
        { jp: '田中さんも学生です。', reading: 'たなかさんも がくせいです。', zh: '田中先生也是學生。', voice: 'zundamon', audio: `${AUDIO_BASE}/gram-4-1.mp3` },
        { jp: '私も会社員です。', reading: 'わたしも かいしゃいんです。', zh: '我也是公司職員。', voice: 'zundamon', audio: `${AUDIO_BASE}/gram-4-2.mp3` },
      ],
    },
  ],
  dialogue: [
    { jp: 'はじめまして。私ははうです。', reading: 'はじめまして。わたしは はうです。', zh: '初次見面，我是「はう」。', voice: 'hau', audio: `${AUDIO_BASE}/dlg-1.mp3` },
    { jp: 'はじめまして。私はミコです。', reading: 'はじめまして。わたしは ミコです。', zh: '初次見面，我是「ミコ」。', voice: 'miko', audio: `${AUDIO_BASE}/dlg-2.mp3` },
    { jp: 'ミコさんは学生ですか。', reading: 'ミコさんは がくせいですか。', zh: 'ミコ小姐是學生嗎？', voice: 'hau', audio: `${AUDIO_BASE}/dlg-3.mp3` },
    { jp: 'はい、学生です。はうさんも学生ですか。', reading: 'はい、がくせいです。はうさんも がくせいですか。', zh: '是的，是學生。はう小姐也是學生嗎？', voice: 'miko', audio: `${AUDIO_BASE}/dlg-4.mp3` },
    { jp: 'はい、私も学生です。どうぞよろしく。', reading: 'はい、わたしも がくせいです。どうぞ よろしく。', zh: '是的，我也是學生。請多指教。', voice: 'hau', audio: `${AUDIO_BASE}/dlg-5.mp3` },
    { jp: 'どうぞよろしく。', reading: 'どうぞ よろしく。', zh: '請多指教。', voice: 'miko', audio: `${AUDIO_BASE}/dlg-6.mp3` },
  ],
  practice: [
    { q: '「私は学生です。」を否定文にしてください。', a: '私は学生ではありません。' },
    { q: '填入助詞：田中さん___先生です。', a: 'は' },
    { q: '填入助詞：私は学生です。あなた___学生です。（表示「也」）', a: 'も' },
    { q: '「你是公司職員嗎？」用日文怎麼說？', a: 'あなたは会社員ですか。' },
    { q: '對話中，ミコ是學生嗎？她怎麼回答的？', a: '是學生。她說「はい、学生です。」' },
  ],
};

/** @type {Stage[]} */
export const stages = [
  { id: 'stage-0', title: '第 0 階段：N5 復健', lessons: [day1] },
  { id: 'stage-1', title: '第 1 階段：聽力打底', lessons: [] },
  { id: 'stage-2', title: '第 2 階段：口語與動畫日文', lessons: [] },
  { id: 'stage-3', title: '第 3 階段：N3 到 N1', lessons: [] },
];
