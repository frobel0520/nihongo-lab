/**
 * 從斷詞結果找出一行裡的常見文法（純邏輯）。規則依 kuromoji（IPADIC）的詞性、原形、活用形比對，
 * 每條規則對應 OpenJLPT 的文法 id；教材有這個 id 就連到那一課，沒有就顯示自行撰寫的一行說明。
 * 規則只涵蓋常見句型：偵測不到不代表沒有文法，偵測到的也可能因斷詞錯誤而不準。
 *
 * @typedef {import('./songs.mjs').Token} Token
 * @typedef {{
 *   id: string,
 *   label: string,
 *   note: string,
 *   jlpt?: string,
 *   lesson?: string,
 *   match: (tokens: Token[], i: number) => number,
 * }} GrammarRule
 *   match 從第 i 個詞開始比對，成功回傳結束位置（不含），失敗回傳 -1。
 *   jlpt：教材文法點的 OpenJLPT id；lesson：直接指定要連的課（例如口語轉換表）。
 * @typedef {{ id: string, label: string, note: string, start: number, end: number }} GrammarHit
 * @typedef {{ lessonId: string, title: string }} LessonRef
 */

/** @param {Token | undefined} t */
const base = (t) => (t ? (t.b ?? t.s) : '');

/** @param {Token | undefined} t @param {string} p @param {string} [pd] */
const is = (t, p, pd) => Boolean(t && t.p === p && (pd === undefined || t.pd === pd));

/** て／で（接續助詞） @param {Token | undefined} t */
const isTe = (t) => is(t, '助詞', '接続助詞') && (t?.s === 'て' || t?.s === 'で');

/** 非自立動詞（補助動詞），原形是 names 之一 @param {Token | undefined} t @param {string[]} names */
const auxVerb = (t, names) => is(t, '動詞', '非自立') && names.includes(base(t));

/** 助動詞，原形是 names 之一 @param {Token | undefined} t @param {string[]} names */
const auxiliary = (t, names) => is(t, '助動詞') && names.includes(base(t));

/** @param {Token | undefined} t @param {string[]} words */
const particle = (t, words) => is(t, '助詞') && words.includes(t?.s ?? '');

/**
 * 「て／で＋補助動詞」：te 的位置在 i。
 * @param {string[]} names
 * @returns {(tokens: Token[], i: number) => number}
 */
const teAux = (names) => (tokens, i) =>
  isTe(tokens[i]) && auxVerb(tokens[i + 1], names) ? i + 2 : -1;

/** @type {GrammarRule[]} */
export const GRAMMAR_RULES = [
  {
    id: 'te-iru',
    label: '〜ている／〜てる',
    jlpt: 'te-iru',
    note: '動作正在進行，或某個狀態持續著。口語常縮成「〜てる」。',
    match: (tokens, i) => {
      if (isTe(tokens[i]) && auxVerb(tokens[i + 1], ['いる'])) return i + 2;
      return auxVerb(tokens[i], ['てる', 'でる']) ? i + 1 : -1;
    },
  },
  {
    id: 'te-kudasai',
    label: '〜てください',
    jlpt: 'te-kudasai',
    note: '請對方做某件事。',
    match: teAux(['くださる']),
  },
  {
    id: 'te-mo-ii',
    label: '〜てもいい',
    jlpt: 'te-mo-ii',
    note: '可以做某件事（許可）。',
    match: (tokens, i) =>
      isTe(tokens[i]) &&
      particle(tokens[i + 1], ['も']) &&
      is(tokens[i + 2], '形容詞') &&
      ['いい', 'よい', '良い'].includes(base(tokens[i + 2]))
        ? i + 3
        : -1,
  },
  {
    id: 'te-wa-ikenai',
    label: '〜てはいけない',
    jlpt: 'te-wa-ikenai',
    note: '不可以做某件事（禁止）。',
    match: (tokens, i) =>
      isTe(tokens[i]) && particle(tokens[i + 1], ['は']) && auxVerb(tokens[i + 2], ['いける'])
        ? i + 3
        : -1,
  },
  {
    id: 'te-mo',
    label: '〜ても／〜でも',
    jlpt: 'te-mo-de-mo',
    note: '即使……也……（讓步）。',
    match: (tokens, i) => {
      if (!isTe(tokens[i]) || !particle(tokens[i + 1], ['も'])) return -1;
      const next = tokens[i + 2];
      const permission = is(next, '形容詞') && ['いい', 'よい', '良い'].includes(base(next));
      return permission ? -1 : i + 2;
    },
  },
  {
    id: 'te-kara',
    label: '〜てから',
    jlpt: 'te-kara',
    note: '做完前一個動作之後，再做下一個。',
    match: (tokens, i) =>
      isTe(tokens[i]) && particle(tokens[i + 1], ['から']) ? i + 2 : -1,
  },
  {
    id: 'te-shimau',
    label: '〜てしまう／〜ちゃう',
    lesson: 'stage2-spoken',
    note: '動作完成，常帶「不小心、遺憾」的語氣；口語縮成「〜ちゃう／〜じゃう」。',
    match: (tokens, i) => {
      if (isTe(tokens[i]) && auxVerb(tokens[i + 1], ['しまう'])) return i + 2;
      return auxVerb(tokens[i], ['ちゃう', 'じゃう']) ? i + 1 : -1;
    },
  },
  {
    id: 'te-ageru',
    label: '〜てあげる',
    jlpt: 'te-ageru',
    note: '為別人做某件事。',
    match: teAux(['あげる']),
  },
  {
    id: 'te-kureru',
    label: '〜てくれる',
    jlpt: 'te-kureru',
    note: '別人為我（或我這邊的人）做某件事。',
    match: teAux(['くれる']),
  },
  {
    id: 'te-morau',
    label: '〜てもらう',
    jlpt: 'te-morau',
    note: '請別人為我做、從別人那裡得到某個動作。',
    match: teAux(['もらう']),
  },
  {
    id: 'nakereba',
    label: '〜なければならない',
    jlpt: 'nakereba-naranai-nakute-wa-ikenai',
    note: '必須做某件事。',
    match: (tokens, i) =>
      auxiliary(tokens[i], ['ない']) &&
      tokens[i].cf === '仮定形' &&
      particle(tokens[i + 1], ['ば']) &&
      auxVerb(tokens[i + 2], ['なる', 'いける'])
        ? i + 3
        : -1,
  },
  {
    id: 'tai',
    label: '〜たい',
    jlpt: 'tai',
    note: '想要做某件事（說話者自己的願望）。',
    match: (tokens, i) => (auxiliary(tokens[i], ['たい']) ? i + 1 : -1),
  },
  {
    id: 'nai',
    label: '〜ない（否定）',
    jlpt: 'nai',
    note: '動詞的否定形「不……」。',
    match: (tokens, i) =>
      auxiliary(tokens[i], ['ない']) &&
      tokens[i].cf !== '仮定形' &&
      is(tokens[i - 1], '動詞') &&
      tokens[i - 1].cf?.startsWith('未然')
        ? i + 1
        : -1,
  },
  {
    id: 'masu',
    label: '〜ます',
    jlpt: 'masu',
    note: '禮貌體。',
    match: (tokens, i) => (auxiliary(tokens[i], ['ます']) ? i + 1 : -1),
  },
  {
    id: 'tara',
    label: '〜たら',
    jlpt: 'tara',
    note: '如果……的話／……之後（條件）。',
    match: (tokens, i) =>
      auxiliary(tokens[i], ['た']) && tokens[i].cf === '仮定形' ? i + 1 : -1,
  },
  {
    id: 'ta',
    label: '〜た（過去）',
    jlpt: 'ta',
    note: '過去或完成。',
    match: (tokens, i) =>
      auxiliary(tokens[i], ['た']) && tokens[i].cf !== '仮定形' ? i + 1 : -1,
  },
  {
    id: 'mashou',
    label: '〜ましょう',
    jlpt: 'mashou',
    note: '一起做……吧（邀約、提議）。',
    match: (tokens, i) =>
      auxiliary(tokens[i], ['ます']) && auxiliary(tokens[i + 1], ['う']) ? i + 2 : -1,
  },
  {
    id: 'deshou',
    label: '〜でしょう／〜だろう',
    jlpt: 'deshou',
    note: '推測「大概……吧」，也用來徵求同意。',
    match: (tokens, i) =>
      auxiliary(tokens[i], ['です', 'だ']) &&
      tokens[i].cf === '未然形' &&
      auxiliary(tokens[i + 1], ['う'])
        ? i + 2
        : -1,
  },
  {
    id: 'volitional',
    label: '〜（よ）う（意向形）',
    note: '說話者的意志「我要……」，或邀約「一起……吧」。是「〜ましょう」的普通體。',
    match: (tokens, i) =>
      is(tokens[i], '動詞') &&
      tokens[i].cf === '未然ウ接続' &&
      auxiliary(tokens[i + 1], ['う', 'よう'])
        ? i + 2
        : -1,
  },
  {
    id: 'passive',
    label: '〜れる／〜られる',
    note: '被動、可能或尊敬三種意思都用這個形，要看前後文判斷。',
    match: (tokens, i) =>
      is(tokens[i], '動詞', '接尾') && ['れる', 'られる'].includes(base(tokens[i])) ? i + 1 : -1,
  },
  {
    id: 'causative',
    label: '〜せる／〜させる',
    note: '使役：讓、叫某人做某件事。',
    match: (tokens, i) =>
      is(tokens[i], '動詞', '接尾') && ['せる', 'させる'].includes(base(tokens[i])) ? i + 1 : -1,
  },
  {
    id: 'ba',
    label: '〜ば',
    note: '假定條件「如果……就……」。',
    match: (tokens, i) => {
      if (!(is(tokens[i], '助詞', '接続助詞') && tokens[i].s === 'ば')) return -1;
      // 「〜なければならない」另有規則
      return auxiliary(tokens[i - 1], ['ない']) && auxVerb(tokens[i + 1], ['なる', 'いける'])
        ? -1
        : i + 1;
    },
  },
  {
    id: 'nagara',
    label: '〜ながら',
    jlpt: 'nagara',
    note: '一邊……一邊……（同時進行）。',
    match: (tokens, i) =>
      is(tokens[i], '助詞', '接続助詞') && tokens[i].s === 'ながら' ? i + 1 : -1,
  },
  {
    id: 'kara-reason',
    label: '〜から（理由）',
    jlpt: 'kara-reason',
    note: '因為……所以……。',
    match: (tokens, i) =>
      is(tokens[i], '助詞', '接続助詞') && tokens[i].s === 'から' ? i + 1 : -1,
  },
  {
    id: 'node',
    label: '〜ので',
    note: '因為……（比「から」客觀、委婉）。',
    match: (tokens, i) =>
      is(tokens[i], '助詞', '接続助詞') && tokens[i].s === 'ので' ? i + 1 : -1,
  },
  {
    id: 'kedo',
    label: '〜が／〜けど（但是）',
    jlpt: 'ga-but',
    note: '但是、雖然……；「けど」是比較口語的說法。',
    match: (tokens, i) =>
      is(tokens[i], '助詞', '接続助詞') &&
      ['が', 'けど', 'けれど', 'けれども'].includes(tokens[i].s)
        ? i + 1
        : -1,
  },
  {
    id: 'to-omou',
    label: '〜と思う',
    jlpt: 'to-omou',
    note: '我覺得、我認為……。',
    match: (tokens, i) =>
      particle(tokens[i], ['と']) && is(tokens[i + 1], '動詞') && base(tokens[i + 1]) === '思う'
        ? i + 2
        : -1,
  },
  {
    id: 'to-iu',
    label: '〜と言う',
    jlpt: 'to-iu-say',
    note: '說……；「〜という N」是「叫做……的 N」。',
    match: (tokens, i) =>
      particle(tokens[i], ['と']) &&
      is(tokens[i + 1], '動詞') &&
      ['言う', 'いう'].includes(base(tokens[i + 1]))
        ? i + 2
        : -1,
  },
  {
    id: 'you-ni',
    label: '〜ように',
    note: '為了……、像……一樣，或「希望能……」。',
    match: (tokens, i) =>
      is(tokens[i], '名詞', '非自立') && tokens[i].s === 'よう' && particle(tokens[i + 1], ['に'])
        ? i + 2
        : -1,
  },
  {
    id: 'n-da',
    label: '〜んだ／〜のだ',
    jlpt: 'n-desu-no-desu',
    note: '說明理由、強調或確認語氣；口語多說「〜んだ」。',
    match: (tokens, i) =>
      is(tokens[i], '名詞', '非自立') &&
      ['ん', 'の'].includes(tokens[i].s) &&
      auxiliary(tokens[i + 1], ['だ', 'です'])
        ? i + 2
        : -1,
  },
  {
    id: 'koto-ga-dekiru',
    label: '〜ことができる',
    jlpt: 'koto-ga-dekiru',
    note: '能夠、會做某件事。',
    match: (tokens, i) =>
      is(tokens[i], '名詞', '非自立') &&
      tokens[i].s === 'こと' &&
      particle(tokens[i + 1], ['が']) &&
      base(tokens[i + 2]) === 'できる'
        ? i + 3
        : -1,
  },
  {
    id: 'ta-koto-ga-aru',
    label: '〜たことがある',
    jlpt: 'ta-koto-ga-aru',
    note: '曾經做過某件事（經驗）。',
    match: (tokens, i) =>
      auxiliary(tokens[i], ['た']) &&
      is(tokens[i + 1], '名詞', '非自立') &&
      tokens[i + 1].s === 'こと' &&
      particle(tokens[i + 2], ['が']) &&
      base(tokens[i + 3]) === 'ある'
        ? i + 4
        : -1,
  },
  {
    id: 'toki',
    label: '〜とき',
    jlpt: 'toki',
    note: '……的時候。',
    match: (tokens, i) =>
      is(tokens[i], '名詞', '非自立') && ['とき', '時'].includes(tokens[i].s) ? i + 1 : -1,
  },
  {
    id: 'kute',
    label: '〜くて',
    jlpt: 'kute-de',
    note: 'い形容詞接下去的形（而且、因為）。',
    match: (tokens, i) =>
      is(tokens[i], '形容詞') && tokens[i].cf === '連用テ接続' && isTe(tokens[i + 1])
        ? i + 2
        : -1,
  },
  {
    id: 'naru',
    label: '〜くなる／〜になる',
    jlpt: 'ku-naru-ni-naru',
    note: '變得……（變化）。',
    match: (tokens, i) => {
      /** @param {Token | undefined} t */
      const nextIsNaru = (t) => is(t, '動詞') && base(t) === 'なる';
      if (is(tokens[i], '形容詞') && tokens[i].cf === '連用テ接続' && nextIsNaru(tokens[i + 1])) {
        return i + 2;
      }
      return particle(tokens[i], ['に']) && nextIsNaru(tokens[i + 1]) ? i + 2 : -1;
    },
  },
  {
    id: 'ne',
    label: '〜ね',
    jlpt: 'ne',
    note: '句尾：徵求同意、確認「……吧、……呢」。',
    match: (tokens, i) =>
      is(tokens[i], '助詞', '終助詞') && ['ね', 'ねえ', 'ねぇ'].includes(tokens[i].s) ? i + 1 : -1,
  },
  {
    id: 'yo',
    label: '〜よ',
    jlpt: 'yo',
    note: '句尾：告訴對方對方不知道的事、提醒。',
    match: (tokens, i) => (is(tokens[i], '助詞', '終助詞') && tokens[i].s === 'よ' ? i + 1 : -1),
  },
  {
    id: 'casual-ending',
    label: '句尾語氣（ぞ／ぜ／さ／わ／な）',
    lesson: 'stage2-spoken',
    note: '口語句尾，帶出說話者的個性與情緒，教科書較少用。',
    match: (tokens, i) =>
      is(tokens[i], '助詞', '終助詞') && ['ぞ', 'ぜ', 'さ', 'わ', 'な'].includes(tokens[i].s)
        ? i + 1
        : -1,
  },
];

/**
 * 找出一行裡的文法。同一條規則在同一行只列一次（第一次出現的位置）。
 *
 * @param {Token[]} tokens
 * @param {GrammarRule[]} [rules]
 * @returns {GrammarHit[]}
 */
export function detectGrammar(tokens, rules = GRAMMAR_RULES) {
  /** @type {GrammarHit[]} */
  const hits = [];
  for (const rule of rules) {
    for (let i = 0; i < tokens.length; i++) {
      const end = rule.match(tokens, i);
      if (end > i) {
        hits.push({ id: rule.id, label: rule.label, note: rule.note, start: i, end });
        break;
      }
    }
  }
  return hits.sort((a, b) => a.start - b.start || a.end - b.end);
}

/**
 * 每條規則要連到哪一課：有 lesson 用指定的課；有 jlpt 就找教材裡第一個標了這個 id 的課。
 *
 * @param {{ lessons: { id: string, title: string, grammar?: { jlpt?: string[] }[] }[] }[]} stages
 * @param {GrammarRule[]} [rules]
 * @returns {Map<string, LessonRef>}
 */
export function grammarLessonIndex(stages, rules = GRAMMAR_RULES) {
  /** @type {Map<string, LessonRef>} */
  const byJlpt = new Map();
  /** @type {Map<string, LessonRef>} */
  const byId = new Map();
  for (const stage of stages) {
    for (const lesson of stage.lessons) {
      byId.set(lesson.id, { lessonId: lesson.id, title: lesson.title });
      for (const point of lesson.grammar ?? []) {
        for (const id of point.jlpt ?? []) {
          if (!byJlpt.has(id)) byJlpt.set(id, { lessonId: lesson.id, title: lesson.title });
        }
      }
    }
  }
  /** @type {Map<string, LessonRef>} */
  const index = new Map();
  for (const rule of rules) {
    const ref = rule.lesson ? byId.get(rule.lesson) : rule.jlpt ? byJlpt.get(rule.jlpt) : undefined;
    if (ref) index.set(rule.id, ref);
  }
  return index;
}
