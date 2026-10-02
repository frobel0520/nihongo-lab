/**
 * T37／T43：按課編排的動畫聽力，沿用共用句庫的查證紀錄、解說與音檔。
 * 沒有複製台詞、另造作品對話或宣稱學習者沒看過作品。
 * @typedef {import('./lessons.mjs').Lesson} Lesson
 * @typedef {import('./lessons.mjs').Quote} Quote
 * @typedef {import('../lib/anime-training.mjs').ListeningClip} ListeningClip
 */
import { contentHash } from './author.mjs';

// 對應 docs/release-audit.md 的查證紀錄；二手整理不是原作台本或原配音。
const references = {
  hokuto: 'https://news.mynavi.jp/article/20230123-2567747/',
  eva: 'https://www.animatetimes.com/news/details.php?id=1622773829',
  'violet-gilbert':
    'https://www.animatetimes.com/news/details.php?id=1628807288',
  'hanako-kiwotsukete':
    'https://www.tiktok.com/@hanakokun_info/video/7494246859754540296',
  'kimetsu-kokoro': 'https://news.mynavi.jp/article/20240527-2953528/',
  'kimetsu-mune': 'https://news.mynavi.jp/article/20240527-2953528/',
  'kimetsu-umai': 'https://news.mynavi.jp/article/20240527-2953528/',
  'laputa-dora': 'https://www.cinematoday.jp/news/N0144717',
  'laputa-muska': 'https://www.cinematoday.jp/news/N0144717',
  'aot-erwin': 'https://news.mynavi.jp/article/20220926-2449636/',
  'aot-eren': 'https://news.mynavi.jp/article/20220926-2449636/',
  'jojo-rohan': 'https://news.mynavi.jp/article/20220512-2339271/',
  'jojo-dio': 'https://news.mynavi.jp/article/20220512-2339271/',
  'gundam-bouya': 'https://news.mynavi.jp/article/20240625-2969358/',
  'gundam-mitometakunai': 'https://news.mynavi.jp/article/20240625-2969358/',
  'jjk-gojo': 'https://news.mynavi.jp/article/20240513-2944756/',
  'frieren-magic': 'https://news.mynavi.jp/article/20240409-2921510/',
  'madoka-kyubey':
    'https://dic.pixiv.net/a/%E5%83%95%E3%81%A8%E5%A5%91%E7%B4%84%E3%81%97%E3%81%A6%E3%80%81%E9%AD%94%E6%B3%95%E5%B0%91%E5%A5%B3%E3%81%AB%E3%81%AA%E3%81%A3%E3%81%A6%E3%82%88!',
  'oshinoko-ai': 'https://news.mynavi.jp/article/20240424-2933200/',
  slamdunk: 'https://www.sladunclub.com/dont-give-up/',
  'kusuriya-poison':
    'https://square.unext.jp/article/kusuriyanohitorigoto-review-2024-01',
  'kusuriya-air':
    'https://square.unext.jp/article/kusuriyanohitorigoto-review-2024-01',
  'mha-allmight': 'https://news.mynavi.jp/article/20220608-2356306/',
  'mha-deku': 'https://news.mynavi.jp/article/20220608-2356306/',
  'violet-know': 'https://www.animatetimes.com/news/details.php?id=1628807288',
  'frieren-himmel': 'https://news.mynavi.jp/article/20240409-2921510/',
};

const coursePlan = [
  {
    title: '第 1 課：切分句子與抓住關鍵詞',
    goal: '先聽出主題與核心動作，再確認狀態與時間；不要求逐字翻譯。',
    clips: [
      'hokuto',
      'mha-allmight',
      'slamdunk-tensai',
      'jjk-win',
      'frieren-warrior',
    ],
    review: ['slamdunk', 'violet-know', 'gundam-decoration', 'oshi-greedy'],
  },
  {
    title: '第 2 課：口語縮約與省略',
    goal: '在短台詞中辨認縮約與省略，對照既有解說還原句子結構。',
    clips: [
      'eva',
      'violet-gilbert',
      'mononoke-ikirya',
      'jjk-seiron',
      'frieren-omoi',
    ],
    review: ['hanako-kiwotsukete', 'eva-niku', 'oshi-truth', 'violet-words'],
  },
  {
    title: '第 3 課：命令、催促與求助',
    goal: '聽出對方要求的動作，辨認命令、催促與求助的差別。',
    clips: [
      'kimetsu-kokoro',
      'laputa-dora',
      'eureka-win',
      'frieren-kakugo',
      'mha-smile',
    ],
    review: ['mha-deku', 'madoka-rescue', 'mha-students', 'mha-watch'],
  },
  {
    title: '第 4 課：情緒、拒絕與理由',
    goal: '結合句尾與句子意思，辨認拒絕、自信與帶理由的回應。',
    clips: [
      'jojo-rohan',
      'jjk-gojo',
      'higurashi-uso',
      'jjk-alone',
      'kimetsu-hole',
    ],
    review: ['gundam-bouya', 'gurren-abayo', 'hokuto-regret', 'jojo-ready'],
  },
  {
    title: '第 5 課：戰鬥宣言與行動',
    goal: '抓住戰鬥宣言中的動作與決心；先練已有來源的行動台詞。',
    clips: [
      'aot-eren',
      'aot-erwin',
      'slamdunk-weapon',
      'kimetsu-duty',
      'kimetsu-protect',
    ],
    review: ['kimetsu-mune', 'mha-deku', 'kimetsu-kuzukenai', 'mha-comrades'],
  },
  {
    title: '第 6 課：魔法、技能與契約',
    goal: '辨認魔法、技能與戰鬥台詞中的主題、契約、能力條件與說明。',
    clips: [
      'frieren-magic',
      'madoka-kyubey',
      'madoka-anything',
      'jjk-tenjo',
      'jojo-time',
    ],
    review: [
      'oshinoko-ai',
      'madoka-promise',
      'gundam-zaku',
      'gundam-dodge',
      'aot-fight',
    ],
  },
  {
    title: '第 7 課：條件、推理與態度',
    goal: '聽出條件、請求與人物態度，區分句子說了什麼和自己的劇情推測。',
    clips: [
      'slamdunk',
      'kusuriya-poison',
      'frieren-himmel',
      'aot-choose',
      'aot-defeat',
    ],
    review: [
      'gundam-mitometakunai',
      'slamdunk-tensai',
      'aot-learn',
      'violet-service',
    ],
  },
  {
    title: '第 8 課：綜合理解與對照',
    goal: '交替聽不同作品的短台詞，練習抓大意與結構；熟悉作品也能參與。',
    clips: [
      'laputa-muska',
      'kusuriya-air',
      'violet-know',
      'oshi-become',
      'jojo-leave',
    ],
    review: ['jojo-dio', 'eva-niku', 'hokuto-hell', 'frieren-team'],
  },
];

/** @param {Quote[]} bank @returns {Lesson[]} */
export function buildAnimeLessons(bank) {
  /** @param {string} key @returns {ListeningClip} */
  const clipFor = (key) => {
    const quote = bank.find(
      (q) => q.id === key || q.audio.endsWith(`/${key}.mp3`),
    );
    const referenceUrl =
      quote?.referenceUrl ??
      references[/** @type {keyof typeof references} */ (key)];
    if (!quote || !referenceUrl) throw new Error(`動畫教材來源缺失：${key}`);
    // 選項沿用已查證教材的翻譯，不新增假台詞；三個意思必須不同。
    const distractors = [
      ...new Set(bank.filter((q) => q.zh !== quote.zh).map((q) => q.zh)),
    ].slice(0, 2);
    if (distractors.length !== 2) throw new Error('動畫練習缺少不同意思的選項');
    const answer = Number.parseInt(contentHash(quote.jp).slice(0, 2), 16) % 3;
    const options = [...distractors];
    options.splice(answer, 0, quote.zh);
    return {
      quote,
      referenceUrl,
      questions: [
        {
          id: 'meaning',
          prompt: '這句台詞的意思是什麼？',
          options,
          answer,
          explanation: quote.note,
        },
      ],
    };
  };
  return coursePlan.map((spec, i) => ({
    id: `anime-lesson-${String(i + 1).padStart(2, '0')}`,
    title: spec.title,
    vocab: [],
    grammar: [],
    dialogue: [],
    practice: [],
    training: {
      goal: spec.goal,
      clips: spec.clips.map(clipFor),
      review: spec.review.map(clipFor),
    },
  }));
}
