/**
 * T54：第 4～7 課的主題教材。台詞仍從共用句庫注入；補充例句自行編寫並明確標示。
 * JMdict 僅用於核對讀音／詞義，不複製詞典正文。來源版本與核對紀錄見 release-audit.md。
 * @typedef {import('./lessons.mjs').Lesson} Lesson
 * @typedef {import('./lessons.mjs').Quote} Quote
 * @typedef {[string, string, string, number, string]} WordRow
 * @typedef {[string, string, string]} ExampleRow
 * @typedef {{ pattern: string, note: string, reference: string, also?: string[], jlpt?: string[], quotes?: string[], examples?: ExampleRow[] }} Point
 * @typedef {{ vocab: WordRow[], grammar: Point[], practice: [string, string][] }} Core
 */
import { audioPath } from './author.mjs';

const dictionary =
  'https://github.com/scriptin/jmdict-simplified/releases/tag/3.6.2%2B20261005200550';
const guideRoot =
  'https://github.com/AmeRaino/taekim-grammar-md/blob/3375f5eaff269714cf0eba3fd826fd447e1092aa/taekim-md/';
const guide = {
  requests:
    'essential-grammar/making-requests/129-politely-and-not-so-politely-making-requests.md',
  commands: 'essential-grammar/making-requests/133-the-command-form.md',
  prohibition: 'essential-grammar/making-requests/134-negative-command.md',
  explanation:
    'basic-grammatical-structures/noun-related-particles/055-the-particle-as-explanation.md',
  endings:
    'essential-grammar/review-and-more-sentence-ending-particles/147-gender-specific-sentence-ending-particles.md',
  causative:
    'special-expressions/causative-and-passive-verbs/149-causative-verbs.md',
  only: 'special-expressions/expressing-amounts/168-indication-that-theres-nothing-else-using.md',
  conclusion:
    'special-expressions/hypothesizing-and-concluding/190-coming-to-a-conclusion-with.md',
  potential:
    'essential-grammar/potential-form/087-expressing-the-ability-to-do-something.md',
  condition: 'essential-grammar/conditionals/098-general-conditionals-using.md',
  tara: 'essential-grammar/conditionals/099-past-conditional-using.md',
  nara: 'essential-grammar/conditionals/097-contextual-conditionals-using.md',
  hearsay:
    'special-expressions/similarity-or-hearsay/178-expressing-hearsay-or-behavior-using.md',
  expectation:
    'advanced-topics/things-that-should-be-a-certain-way/203-using-to-describe-an-expectation.md',
  rephrase:
    'essential-grammar/defining-and-describing/118-rephrasing-and-making-conclusions-with.md',
};

/** @type {Record<string, Core>} */
const cores = {
  'anime-lesson-04': {
    vocab: [
      [
        '断る',
        'ことわる',
        '拒絕、婉拒',
        1419570,
        '常見搭配：申し出を断る（拒絕提議）。作品用例：JOJO 的拒絕台詞。',
      ],
      [
        '嘘',
        'うそ',
        '謊言；也可用來表示難以置信',
        1172400,
        '常見搭配：嘘をつく（說謊）。單獨喊「嘘だ」可能是反駁或不敢相信，須看上下文。',
      ],
      [
        '覚悟',
        'かくご',
        '心理準備、決心',
        1206080,
        '常見搭配：覚悟を決める（下定決心）。作品用例：JOJO 的詢問台詞。',
      ],
      [
        '約束',
        'やくそく',
        '約定、承諾',
        1538130,
        '常見搭配：約束を守る（遵守約定）。作品用例：魔法少女小圓的承諾台詞。',
      ],
      [
        '仲間',
        'なかま',
        '同伴、夥伴',
        1425790,
        '常見搭配：仲間を助ける（幫助同伴）。作品用例：我的英雄學院的同伴台詞。',
      ],
      [
        '嫌い',
        'きらい',
        '討厭、不喜歡',
        1257240,
        '常見搭配：正論が嫌い（討厭大道理）。作品用例：咒術迴戰五條悟的台詞。',
      ],
      [
        '本当',
        'ほんとう',
        '真的、真實',
        1523060,
        '常見搭配：本当の気持ち（真正的心情）。主題補充，非作品逐字台詞。',
      ],
      [
        '助ける',
        'たすける',
        '幫助、救助',
        1344410,
        '常見搭配：仲間を助ける（救助同伴）。主題補充，與「救う」的救援意思相近，但用法不完全相同。',
      ],
      [
        '信じる',
        'しんじる',
        '相信、信任',
        1359040,
        '常見搭配：仲間を信じる（相信同伴）。主題補充，非作品逐字台詞。',
      ],
      [
        '許す',
        'ゆるす',
        '允許；原諒',
        1232870,
        '常見搭配：絶対に許さない（絕不原諒）。聽出否定，不能把它當成准許。',
      ],
    ],
    grammar: [
      {
        pattern: 'だが／嘘だ：拒絕與反駁',
        reference: 'explanation',
        note: '「だが」是較硬的「但是」；JOJO「だが断る」直接拒絕。「嘘だ」字面是否定真實性，也可能表示震驚；暮蟬悲鳴時這句短台詞本身不足以證明對方真的說謊。人物意圖要結合句義與上下文，不只聽音量。',
        quotes: ['jojo-rohan', 'higurashi-uso'],
      },
      {
        pattern: '～んだ／～んだよね',
        reference: 'explanation',
        jlpt: ['n-desu-no-desu'],
        note: '「んだ」是「のだ」的口語形，用來說明、強調背景。名詞與な形容詞接「なんだ」；咒術迴戰「嫌いなんだよね」是在說明自己的態度。「よね」可帶共鳴或確認意味，不能一律翻成疑問。',
        quotes: ['jjk-seiron'],
        examples: [
          ['信じているんだ。', 'しんじて いるんだ。', '我相信他／她啊。'],
        ],
      },
      {
        pattern: 'よ／ね／ぞ／ぜ／わ：角色口吻',
        also: [
          'basic-grammatical-structures/adverbs-and-sentence-ending-particles/057-sentence-ending-particles.md',
        ],
        reference: 'endings',
        jlpt: ['yo', 'ne'],
        note: '「よ」偏向告知或強調，「ね」偏向共鳴或確認。「ぞ」「ぜ」常帶強勢或豪邁的角色口吻；「わ」的效果依人物、方言與語調而變，不等於只限女性。先辨認台詞的態度，再判斷關係；自製語音不等於原作演技。',
        quotes: ['jojo-leave', 'madoka-promise'],
      },
      {
        pattern: '～てくれ：請求與催促',
        also: ['essential-grammar/making-requests/133-the-command-form.md'],
        reference: 'requests',
        jlpt: ['te-kureru'],
        note: '「てくれ」是「てくれる」的命令形：要求對方為自己做某事。它可能是粗直的催促，也可能是迫切求助；不能只因形式強硬就判成敵意。我的英雄學院「俺を見ていてくれ」要求對方持續看著自己。',
        quotes: ['mha-watch'],
        examples: [
          ['仲間を助けてくれ。', 'なかまを たすけて くれ。', '幫忙救救同伴。'],
        ],
      },
    ],
    practice: [
      [
        '「だが断る」是在同意、拒絕，還是詢問理由？',
        '拒絕。「だが」先轉折，「断る」直接表示不接受。',
      ],
      [
        '只聽到「嘘だ」，能否確定有人故意欺騙？',
        '不能。可能是指控，也可能是震驚；需要前後文。',
      ],
      [
        '把「嫌いなのだ」還原成常見口語說法。',
        '嫌いなんだ。名詞與な形容詞的「なのだ」縮成「なんだ」。',
      ],
      [
        '「俺を見ていてくれ」要求對方做什麼？',
        '持續看著說話者；「ていて」包含持續狀態，不是看一眼。',
      ],
      [
        '「約束するわ」中的「わ」是否改變「承諾」這個核心意思？',
        '不改變承諾的核心意思，主要加上人物口吻；不能只憑語尾推定性別。',
      ],
      [
        '「絶対に許さない」是允許還是不原諒？',
        '不原諒。「ない」是否定，「絶対に」強調態度。',
      ],
    ],
  },
  'anime-lesson-05': {
    vocab: [
      [
        '武器',
        'ぶき',
        '武器；比喻有利的本領',
        1498460,
        '常見搭配：武器を使う（使用武器）。SLAM DUNK 的「秘密兵器」指王牌，不能當成真的武器。',
      ],
      [
        '剣',
        'けん',
        '劍',
        1256750,
        '常見搭配：剣を抜く（拔劍）。也有「つるぎ」的讀法；本課用「けん」，遇到作品固有名稱須另查。',
      ],
      [
        '盾',
        'たて',
        '盾牌',
        1341840,
        '常見搭配：盾で防ぐ（用盾擋住）。鬼滅之刃煉獄杏壽郎的台詞也用盾比喻保護後輩的人。',
      ],
      [
        '弓',
        'ゆみ',
        '弓',
        1228490,
        '常見搭配：弓を引く（拉弓）。本課教單獨名詞「ゆみ」；複合詞不一定沿用此讀音。',
      ],
      [
        '槍',
        'やり',
        '槍、長矛',
        1400500,
        '常見搭配：槍を構える（擺出持槍架勢）。日文此詞指長柄兵器，不是槍械。',
      ],
      [
        '斬る',
        'きる',
        '用刀劍斬、砍',
        1304400,
        '常見搭配：敵を斬る（斬擊敵人）。與一般的「切る」同音，漢字及搭配可幫助區分。',
      ],
      [
        '防ぐ',
        'ふせぐ',
        '防禦、阻止',
        1520190,
        '常見搭配：攻撃を防ぐ（擋住攻擊）。重點在阻擋，不等於閃身躲開。',
      ],
      [
        '避ける',
        'よける',
        '躲開、閃避',
        1583260,
        '常見搭配：攻撃を避ける（閃避攻擊）。本課取「よける」；同字也可讀「さける」，常用於避開危險或事情。',
      ],
      [
        '守る',
        'まもる',
        '保護、守住；遵守',
        1327120,
        '常見搭配：仲間を守る（保護同伴）。搭配約定時則是遵守約定。',
      ],
      [
        '戦う',
        'たたかう',
        '戰鬥、對抗',
        1596960,
        '常見搭配：敵と戦う（與敵人戰鬥）。作品用例：進擊的巨人的條件台詞。',
      ],
    ],
    grammar: [
      {
        pattern: '命令形／辞書形＋な',
        also: ['essential-grammar/making-requests/134-negative-command.md'],
        reference: 'commands',
        note: '五段動詞把末音換成え段，如「戦う→戦え」；一段動詞常改成「ろ」，如「逃げる→逃げろ」。也有莊重的「よ」，如進擊的巨人「捧げよ」。禁止則是辭書形接「な」：交響詩篇「ねだるな」是不要索求，不是命令形。',
        quotes: ['aot-erwin', 'eureka-win'],
        examples: [
          ['盾で防げ。', 'たてで ふせげ。', '用盾擋住。'],
          ['武器を捨てるな。', 'ぶきを すてるな。', '不要丟下武器。'],
        ],
      },
      {
        pattern: '～させない：不讓某事發生',
        reference: 'causative',
        note: '使役形的否定可表示不讓人做、也可表示不讓某事發生。鬼滅之刃「誰も死なせない」是在保護他人：「死ぬ」變成「死なせる」，再否定；不是「沒有人想死」，也不是說自己不會死。',
        quotes: ['kimetsu-protect'],
      },
      {
        pattern: '～しかない：只剩這個選擇',
        reference: 'only',
        jlpt: ['shika-nai'],
        note: '辭書形加「しかない」表示只好做某事、沒有其他選擇；不要把尾端的「ない」誤聽成禁止。這裡是判斷選項受限，不一定表示說話者喜歡這個做法。',
        examples: [
          [
            '今は盾で防ぐしかない。',
            'いまは たてで ふせぐしか ない。',
            '現在只能用盾擋住。',
          ],
        ],
      },
      {
        pattern: '～わけにはいかない：不能就這樣做',
        reference: 'conclusion',
        note: '辭書形加「わけにはいかない」表示因責任、立場或情勢而不能做，不是單純缺乏能力。「逃げられない」可能是逃不了；「逃げるわけにはいかない」則是不能拋下責任逃走。',
        examples: [
          [
            '仲間を置いて逃げるわけにはいかない。',
            'なかまを おいて にげる わけには いかない。',
            '我不能丟下同伴逃走。',
          ],
        ],
      },
    ],
    practice: [
      [
        '把「防ぐ」變成命令形，把「捨てる」變成禁止形。',
        '防げ／捨てるな。禁止形用辭書形加「な」，不是「捨てろな」。',
      ],
      [
        '「槍」在這份詞彙包指手槍嗎？',
        '不是。此處讀「やり」，指長矛；槍械通常用「銃」。',
      ],
      [
        '「攻撃を防ぐ」與「攻撃を避ける」有何差別？',
        '前者阻擋攻擊，後者閃開攻擊；戰鬥畫面可能不同。',
      ],
      [
        '鬼滅之刃「誰も死なせない」保護的是誰？',
        '說話者要讓在場的人都不死；這是使役的否定，不只是自保。',
      ],
      [
        '「防ぐしかない」表示不要防禦，還是只能防禦？',
        '只能防禦。「しかない」整組表示沒有其他選擇。',
      ],
      [
        '「逃げるわけにはいかない」一定代表身體無法逃跑嗎？',
        '不一定；重點是責任或情勢不容許逃走，與能力的否定不同。',
      ],
    ],
  },
  'anime-lesson-06': {
    vocab: [
      [
        '魔法',
        'まほう',
        '魔法',
        1524230,
        '常見搭配：魔法を使う（使用魔法）。作品用例：葬送的芙莉蓮的魔法台詞。',
      ],
      [
        '魔力',
        'まりょく',
        '魔力、施展魔法的力量',
        1524280,
        '常見搭配：魔力が足りない（魔力不足）。主題補充；各作品的力量設定不同。',
      ],
      [
        '詠唱',
        'えいしょう',
        '詠唱、吟誦咒文',
        1174850,
        '常見搭配：呪文を詠唱する（吟誦咒文）。不要僅憑這個詞推定每種魔法都必須詠唱。',
      ],
      [
        '結界',
        'けっかい',
        '結界、隔開內外的界域',
        2020220,
        '常見搭配：結界を張る（布下結界）。詞原有宗教語境，動畫中的屏障效果依作品設定；咒術迴戰查證文章亦使用此詞。',
      ],
      [
        '封印',
        'ふういん',
        '封印；封住',
        1499610,
        '常見搭配：封印を解く（解開封印）。咒術迴戰查證文章提及封印；被封印不一定代表死亡。',
      ],
      [
        '発動',
        'はつどう',
        '發動、開始生效',
        1477780,
        '常見搭配：能力を発動する（發動能力）。本詞不是所有技能的統一喊法。',
      ],
      [
        '解除',
        'かいじょ',
        '解除、取消、撤除',
        1199030,
        '常見搭配：封印を解除する（解除封印）。也能搭配契約、警報或限制，須聽受詞。',
      ],
      [
        '契約',
        'けいやく',
        '契約、約定',
        1250190,
        '常見搭配：契約を結ぶ（締結契約）。作品用例：魔法少女小圓的契約台詞。',
      ],
      [
        '能力',
        'のうりょく',
        '能力、本領',
        1470370,
        '常見搭配：能力を使う（使用能力）。能力可能是一般本領，也可能是作品中的特殊能力。',
      ],
      [
        '条件',
        'じょうけん',
        '條件、前提',
        1356510,
        '常見搭配：条件を満たす（滿足條件）。分清必要條件與已經發動的結果。',
      ],
    ],
    grammar: [
      {
        pattern: '～て、～てよ：動作連接與要求',
        reference: 'requests',
        note: '魔法少女小圓「契約して、魔法少女になってよ」先連接簽約與成為魔法少女，最後「てよ」提出要求。不是說契約已經成立；這句短台詞也沒有列出契約的全部條件。',
        quotes: ['madoka-kyubey'],
      },
      {
        pattern: '～とき：動作發生的時候',
        also: [
          'https://github.com/evanclan/OpenJLPT/blob/88eaef9c589f787194903e733c7f7b6df9d6ebc0/data/json/grammar/n4.json',
        ],
        reference: 'tara',
        jlpt: ['toki', 'te-iru'],
        note: '葬送的芙莉蓮「探し求めている時」指正在尋找魔法的時候。「ている」描寫進行中的動作，不是「已經找到了」。先聽時間修飾，再找主句的評價「一番楽しい」。',
        quotes: ['frieren-magic'],
      },
      {
        pattern: '～ことができる／可能形',
        also: [
          'https://github.com/evanclan/OpenJLPT/blob/88eaef9c589f787194903e733c7f7b6df9d6ebc0/data/json/grammar/n4.json',
          'essential-grammar/potential-form/088-the-potential-form.md',
        ],
        reference: 'potential',
        jlpt: ['koto-ga-dekiru', 'eru-rareru-potential'],
        note: '辭書形加「ことができる」表示能做某事；「使う」的可能形是「使える」。不能使用是「使えない」，不是「使わない」（不使用）。不要把能力不足誤判成拒絕使用。',
        examples: [
          [
            'この魔法で結界を解除することができる。',
            'この まほうで けっかいを かいじょする ことが できる。',
            '可以用這個魔法解除結界。',
          ],
          [
            '魔力が足りなくて、魔法が使えない。',
            'まりょくが たりなくて、まほうが つかえない。',
            '魔力不足，無法使用魔法。',
          ],
        ],
      },
      {
        pattern: '～ば／～たら：發動條件',
        also: ['essential-grammar/conditionals/099-past-conditional-using.md'],
        reference: 'condition',
        jlpt: ['ba', 'tara'],
        note: '「ば」可提出條件；「たら」可表示假設，也可表示某事完成後的時間順序。辨認的是條件與結果，不是只聽到技能名就當成已經施展。進擊的巨人「戦わなければ勝てない」是「不戰鬥就無法獲勝」，後面沒有「ならない」。',
        quotes: ['aot-fight'],
        examples: [
          [
            '条件を満たせば、能力を発動できる。',
            'じょうけんを みたせば、のうりょくを はつどう できる。',
            '滿足條件就能發動能力。',
          ],
          [
            '詠唱が終わったら、結界を張る。',
            'えいしょうが おわったら、けっかいを はる。',
            '詠唱結束後就布下結界。',
          ],
        ],
      },
    ],
    practice: [
      [
        '「契約して、魔法少女になってよ」是在報告完成，還是提出要求？',
        '提出要求；句尾「てよ」要求對方行動，不能推定對方已答應。',
      ],
      [
        '芙莉蓮台詞的「探し求めている時」是找到之後，還是尋找當中？',
        '尋找當中。「ている」在此表示正在進行。',
      ],
      [
        '「使えない」和「使わない」有何差別？',
        '「使えない」是不能使用；「使わない」是不使用，可能是不打算用。',
      ],
      [
        '「封印を解除する」與「能力を発動する」做的是同一件事嗎？',
        '不是；前者撤除封印，後者啟動能力。要把動詞與受詞一起聽。',
      ],
      [
        '「条件を満たせば、能力を発動できる」能否證明能力現在已發動？',
        '不能；只說滿足條件後可以發動，沒有說條件已滿足或技能已使用。',
      ],
      [
        '「戦わなければ勝てない」的「なければ」一定等於「必須」嗎？',
        '不是；此處是「如果不戰鬥」，須連同後面的「勝てない」理解。',
      ],
    ],
  },
  'anime-lesson-07': {
    vocab: [
      [
        '証拠',
        'しょうこ',
        '證據',
        1351600,
        '常見搭配：証拠を集める（蒐集證據）。主題補充，非作品逐字台詞。',
      ],
      [
        '真実',
        'しんじつ',
        '真實、真相',
        1363780,
        '常見搭配：真実を知る（得知真相）。證據與推測都可能指向真相，但不等於已證實。',
      ],
      [
        '理由',
        'りゆう',
        '理由',
        1550140,
        '常見搭配：理由を説明する（說明理由）。本課用「りゆう」，不是把每個「わけ」都翻成同一意思。',
      ],
      [
        '原因',
        'げんいん',
        '原因',
        1261190,
        '常見搭配：原因を調べる（調查原因）。注意「んい」的音節銜接，不把讀音寫成「げいいん」。',
      ],
      [
        '結果',
        'けっか',
        '結果',
        1254690,
        '常見搭配：結果が分かる（得知結果）。有促音，與「結界」不是同一個詞。',
      ],
      [
        '可能性',
        'かのうせい',
        '可能性',
        1191080,
        '常見搭配：可能性がある（有可能）。可能不等於確定發生。',
      ],
      [
        '計画',
        'けいかく',
        '計畫',
        1252090,
        '常見搭配：計画を立てる（擬定計畫）。主題補充，非作品逐字台詞。',
      ],
      [
        '選ぶ',
        'えらぶ',
        '選擇',
        1588730,
        '常見搭配：道を選ぶ（選擇道路）。作品用例：進擊的巨人里維的選擇台詞。',
      ],
      [
        '気付く',
        'きづく',
        '注意到、察覺',
        1591330,
        '常見搭配：違いに気付く（察覺差異）。助詞常用「に」，不是把所有察覺對象都接「を」。',
      ],
      [
        '疑う',
        'うたがう',
        '懷疑',
        1225510,
        '常見搭配：話を疑う（懷疑說法）。懷疑某人不等於已證實對方有罪。',
      ],
    ],
    grammar: [
      {
        pattern: '～たら／～なら：條件與話題前提',
        also: ['essential-grammar/conditionals/099-past-conditional-using.md'],
        reference: 'nara',
        jlpt: ['tara', 'nara'],
        note: 'SLAM DUNK「諦めたら」提出放棄這個條件；芙莉蓮「勇者ヒンメルならそうした」以人物作為判斷前提，意思近於「如果是他，就會那樣做」。後者不能當成希梅爾當下正在場的證據。',
        quotes: ['slamdunk', 'frieren-himmel'],
      },
      {
        pattern: '～はずだ：根據資訊的預期',
        reference: 'expectation',
        jlpt: ['hazu-da'],
        note: '普通形加「はずだ」表示依已知資訊推斷應該如此，不是義務，也不保證事實一定如此。名詞接「のはず」、な形容詞接「なはず」；先問說話者根據什麼資訊作判斷。',
        examples: [
          [
            'この時間なら、仲間はもう着いているはずだ。',
            'この じかんなら、なかまは もう ついて いる はずだ。',
            '照這個時間看，同伴應該已經到了。',
          ],
        ],
      },
      {
        pattern: '～らしい／～かもしれない',
        also: [
          'special-expressions/various-degrees-of-certainty/163-using-to-express-uncertainty.md',
        ],
        reference: 'hearsay',
        jlpt: ['rashii', 'kamo-shirenai'],
        note: '本課「らしい」表示根據聽聞或線索作推測，不是親眼確認；「かもしれない」提出某種可能。二者都保留不確定性，不能機械排成固定機率。「らしい」另有「像某類人應有的樣子」的用法，須依搭配區分。',
        examples: [
          [
            '敵は別の道を選んだらしい。',
            'てきは べつの みちを えらんだ らしい。',
            '敵人似乎選了另一條路。',
          ],
          [
            'この証拠は偽物かもしれない。',
            'この しょうこは にせもの かも しれない。',
            '這個證據可能是假的。',
          ],
        ],
      },
      {
        pattern: '～ということか／～わけではない',
        also: [
          'https://github.com/evanclan/OpenJLPT/blob/88eaef9c589f787194903e733c7f7b6df9d6ebc0/data/json/grammar/n3.json',
          'special-expressions/hypothesizing-and-concluding/190-coming-to-a-conclusion-with.md',
        ],
        reference: 'rephrase',
        note: '「ということか」把資訊整理成推論，可理解為「也就是說……嗎／原來是……」；仍要檢查推論是否成立。「わけではない」否定某種解讀，不一定把整件事完全否定。不要把沒有證據直接推成絕對沒發生。',
        examples: [
          [
            'つまり、結界が消えたということか。',
            'つまり、けっかいが きえた という ことか。',
            '也就是說，結界消失了嗎？',
          ],
          [
            '証拠がないからといって、嘘だというわけではない。',
            'しょうこが ないからと いって、うそだ という わけでは ない。',
            '不能只因沒有證據，就說那是謊言。',
          ],
        ],
      },
    ],
    practice: [
      [
        '「勇者ヒンメルならそうした」能證明希梅爾現在就在現場嗎？',
        '不能；句子是在用希梅爾作行為判斷的前提，不是在報告位置。',
      ],
      [
        '「もう着いているはずだ」是親眼看見抵達，還是根據資訊推斷？',
        '根據資訊推斷；實際是否抵達仍可能需要確認。',
      ],
      [
        '「別の道を選んだらしい」是否等於百分之百確定？',
        '不是；這裡是聽聞或線索推測，還沒直接確認。',
      ],
      [
        '「偽物かもしれない」是在斷言一定是假的嗎？',
        '不是；只提出假的可能性，不能當成證實。',
      ],
      [
        '「嘘だというわけではない」是否表示已證實完全真實？',
        '不是；它否定「就是謊言」這種解讀，並未保證真實。',
      ],
      [
        '整理線索時，如何避免把自己的劇情記憶當成這句台詞的資訊？',
        '分開列出台詞明說的事、說話者的推測、自己從其他場景記得的事；回答先依這句台詞。',
      ],
    ],
  },
};

/** @param {string} lessonId @param {Quote[]} bank @param {Record<string, string>} references @returns {Pick<Lesson, 'vocab' | 'grammar' | 'practice' | 'references'> | null} */
export function animeCoreFor(lessonId, bank, references) {
  const core = cores[lessonId];
  if (!core) return null;
  const base = `audio/stage-2/${lessonId}/core`;
  const voices = ['tsumugi', 'hau', 'sayo', 'neko-vy', 'zunko'];
  const vocab = core.vocab.map(([word, reading, zh, sequence, note], i) => {
    const voice = voices[i % voices.length];
    return {
      word,
      reading,
      zh,
      voice,
      audio: audioPath(base, 'vocab', word, voice),
      note,
      referenceUrl: dictionary,
      referenceNote: `JMdict 詞條 ${sequence}；核對讀音與詞義，搭配及中文解說自行撰寫。`,
    };
  });
  const grammar = core.grammar.map((point, i) => {
    const voice = voices[(i + 2) % voices.length];
    const quoteExamples = (point.quotes ?? []).map((key) => {
      const quote = bank.find(
        (q) => q.id === key || q.audio.endsWith(`/${key}.mp3`),
      );
      if (!quote) throw new Error(`特訓文法缺少已查證台詞：${key}`);
      // 同一份原文、讀音、選角與音檔；不重合成名句，也不另存一份句庫。
      const referenceUrl = quote.referenceUrl ?? references[key];
      if (!referenceUrl) throw new Error(`文法台詞來源缺失：${key}`);
      return { quote, referenceUrl };
    });
    return {
      pattern: point.pattern,
      note: point.note,
      ...(point.jlpt ? { jlpt: point.jlpt } : {}),
      referenceUrl:
        guideRoot + guide[/** @type {keyof typeof guide} */ (point.reference)],
      quoteExamples,
      ...(point.also
        ? {
            referenceUrls: point.also.map((url) =>
              url.startsWith('https:') ? url : guideRoot + url,
            ),
          }
        : {}),
      examples: (point.examples ?? []).map(([jp, reading, zh]) => ({
        jp,
        reading,
        zh,
        voice,
        audio: audioPath(base, 'gram', jp, voice),
        source: '自行編寫的句型補充例句（非作品台詞）',
      })),
    };
  });
  return {
    vocab,
    grammar,
    practice: core.practice.map(([q, a]) => ({ q, a })),
    references: [
      {
        title: '詞彙：JMdict（2026-10-05 版本）',
        url: dictionary,
        note: '各詞讀音／詞義已核對。主題補充詞不宣稱出自某句動畫；作品用例另標出處。',
      },
      {
        title: '文法：Tae Kim 教學指南（社群 Markdown 鏡像）',
        url: guideRoot + 'README.md',
        note: '參考句型規則，中文解說與補充例句自行撰寫；每個文法點另連到相應章節。',
      },
      {
        title: '鬼滅之刃：台詞及作品介紹',
        url: 'https://news.mynavi.jp/article/20240527-2953528/',
        note: '二手查證文章；含盾的比喻用例，不是原作台本。',
      },
      {
        title: '咒術迴戰：台詞及作品介紹',
        url: 'https://news.mynavi.jp/article/20240513-2944756/',
        note: '二手查證文章；介紹文字使用結界、封印，不把介紹文字當成角色台詞。',
      },
    ],
  };
}
