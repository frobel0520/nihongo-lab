/**
 * T55：課程 id＋台詞 key 的聽力辨識題；只考台詞明說的內容。
 * @type {Record<string, import('../lib/anime-training.mjs').ListeningQuestion[]>}
 */
export const foundationQuestions = {
  'anime-lesson-01:hokuto': [
    {
      id: 'result-state',
      prompt: '這句描述的時間／狀態是什麼？',
      options: ['已經死亡的狀態', '還沒開始的戰鬥', '正在要求對方離開'],
      answer: 0,
      explanation:
        '「もう」與「死んでいる」組合表示已經死亡的狀態；不是正在死亡，也沒有提出離開的要求。',
    },
  ],
  'anime-lesson-01:mha-allmight': [
    {
      id: 'past-arrival',
      prompt: '哪個動作已發生？',
      options: ['對方已逃跑', '說話者已到來', '大家已獲勝'],
      answer: 1,
      explanation:
        '「私が来た」的「来た」是来る的過去形，宣告自己來了。後續打算不在這句裡。',
    },
  ],
  'anime-lesson-01:slamdunk-tensai': [
    {
      id: 'reason-tail',
      prompt: '句尾在提供哪一類資訊？',
      options: ['禁止行為', '事件發生的時間', '理由'],
      answer: 2,
      explanation:
        '「ですから」在此給出理由：因為是天才。不能把它當成對別人的命令。',
    },
  ],
  'anime-lesson-01:frieren-warrior': [
    {
      id: 'subject-predicate',
      prompt: '被稱為戰士的是哪些人？',
      options: ['努力過的人', '尚未出現的人', '只有說話者自己'],
      answer: 0,
      explanation:
        '「頑張った者」是努力過的人；「皆戦士だ」把這些人全部稱為戰士。句子沒有把範圍限於說話者。',
    },
  ],
  'anime-lesson-02:eva': [
    {
      id: 'contraction-prohibition',
      prompt: '這個縮約句是在禁止還是要求某件事？',
      options: ['要求立刻逃跑', '不可以逃避', '已經成功逃跑'],
      answer: 1,
      explanation:
        '「逃げちゃダメだ」可還原為「逃げてはダメだ」，意思是不能逃避，不是必須逃。',
    },
  ],
  'anime-lesson-02:violet-gilbert': [
    {
      id: 'contracted-iru',
      prompt: '這個口語形式表達哪種時態或肯否定？',
      options: ['過去曾經有的愛意', '不想愛的否定願望', '持續的愛意，省略了い'],
      answer: 2,
      explanation:
        '「愛してる」把「愛している」的い省略了；沒有改成過去形，也沒有變成否定願望。',
    },
  ],
  'anime-lesson-02:mononoke-ikirya': [
    {
      id: 'rya-condition',
      prompt: '說話者用哪個條件接後面的話？',
      options: ['只要活著', '只有贏了之後', '如果完全沒有辦法'],
      answer: 0,
      explanation:
        '「生きてりゃ」是「生きていれば」的口語縮約；「なんとかなる」是後面的判斷，並沒有提供具體方法。',
    },
  ],
  'anime-lesson-02:hanako-kiwotsukete': [
    {
      id: 'nakya-obligation',
      prompt: '句尾省略後仍表達哪個要求？',
      options: ['不准小心', '得小心、要注意', '注意已經沒有必要'],
      answer: 1,
      explanation:
        '此處「気をつけなきゃ」省去「いけない」等結尾，表示必須注意；不是禁止注意。',
    },
  ],
  'anime-lesson-03:kimetsu-kokoro': [
    {
      id: 'imperative-metaphor',
      prompt: '核心動詞在要求什麼？',
      options: ['停止說話', '報告火勢', '燃起內心的熱情'],
      answer: 2,
      explanation:
        '「燃やせ」是燃やす的命令形；與「心」搭配是激勵的比喻，不是在報告火勢或燒心臟。',
    },
  ],
  'anime-lesson-03:laputa-dora': [
    {
      id: 'short-nasai',
      prompt: '句尾的な在這句中起什麼作用？',
      options: ['要求做準備', '禁止做準備', '表示準備早已完成'],
      answer: 0,
      explanation:
        '「支度しな」是「支度しなさい」的短形；禁止要用「支度するな」，動詞形式不同。',
    },
  ],
  'anime-lesson-03:eureka-win': [
    {
      id: 'mixed-commands',
      prompt: '兩個動作的肯定／禁止如何配對？',
      options: ['允許央求、禁止爭取', '禁止央求、要求爭取', '兩個動作都禁止'],
      answer: 1,
      explanation:
        '「ねだるな」禁止央求；「勝ち取れ」要求主動贏得。聽到一個な不能把整句都當成否定。',
    },
  ],
  'anime-lesson-03:mha-smile': [
    {
      id: 'maintain-state',
      prompt: '這句特別要求保持什麼狀態？',
      options: ['一直沉默', '一直離開', '保持笑著'],
      answer: 2,
      explanation:
        '「笑っていろ」的いろ是いる的命令形，要求維持笑著的狀態；沒有說明要持續多久。',
    },
  ],
  'anime-lesson-08:laputa-muska': [
    {
      id: 'simile-viewpoint',
      prompt: '哪項判斷符合句子的表達？',
      options: [
        '人物使用輕蔑的比喻',
        '人確實變成另一種物質',
        '人物在提供垃圾分類規則',
      ],
      answer: 0,
      explanation:
        '「ゴミのようだ」將人比作垃圾，呈現說話者的輕蔑視角；不能當成物理變化或分類規則。',
    },
  ],
  'anime-lesson-08:kusuriya-air': [
    {
      id: 'developing-process',
      prompt: '句尾如何描述受到影響？',
      options: ['命令大家立即走路離開', '影響逐漸發展', '影響已完全消失'],
      answer: 1,
      explanation:
        '「毒されていく」中的ていく描述發展中的過程；毒される也可作比喻，單句沒有給出毒物名稱。',
    },
  ],
  'anime-lesson-08:violet-know': [
    {
      id: 'desire-not-result',
      prompt: '說話者的理解進度能確定到哪一步？',
      options: ['已完全理解', '明確拒絕理解', '表示想知道'],
      answer: 2,
      explanation:
        '「知りたい」表達想知道；句子不能證明已經理解「あいしてる」的意思。',
    },
  ],
  'anime-lesson-08:jojo-leave': [
    {
      id: 'stated-versus-inferred',
      prompt: '這句直接說出的資訊是哪個？',
      options: [
        '角色要冷靜帥氣地離開',
        '角色離開的具體目的地',
        '角色下一次出現的時間',
      ],
      answer: 0,
      explanation:
        '「クールに去るぜ」明說離去的姿態與角色口吻，沒有提供目的地或再出現的時間。',
    },
  ],
};
