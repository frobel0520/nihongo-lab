import { foundationQuestions } from './anime-core-foundation-questions.mjs';

/** T54：只測短台詞能支持的句型／態度，不拿劇情記憶當答案。既有 meaning 題原樣保留。
 * @type {Record<string, import('../lib/anime-training.mjs').ListeningQuestion[]>}
 */
export const extraListeningQuestions = {
  ...foundationQuestions,
  'anime-lesson-04:jojo-rohan': [
    {
      id: 'intent-refusal',
      prompt: '說話者對提議採取什麼態度？',
      options: ['明確拒絕', '答應照做', '請對方稍等'],
      answer: 0,
      explanation:
        '「だが」轉折，「断る」明確表示拒絕；不需要知道前面的劇情也能辨認這個動作。',
    },
  ],
  'anime-lesson-04:higurashi-uso': [
    {
      id: 'intent-objection',
      prompt: '僅憑這句話，能確定哪件事？',
      options: [
        '對方確實故意說謊',
        '說話者否定或難以相信這個說法',
        '說話者平靜地同意',
      ],
      answer: 1,
      explanation:
        '「嘘だ」能表達否定或震驚；台詞本身不能證明對方故意欺騙，也不能只靠音量判斷真相。',
    },
  ],
  'anime-lesson-04:jjk-gojo': [
    {
      id: 'structure-reason',
      prompt: '句尾如何連接「沒問題」與「我是最強的」？',
      options: ['提出假設', '否定能力', '用自己的實力作為理由'],
      answer: 2,
      explanation:
        '「だから」引出理由。這是人物的自信判斷，不是這句話已證實所有事情都安全。',
    },
  ],
  'anime-lesson-04:jjk-alone': [
    {
      id: 'structure-time',
      prompt: '「死ぬとき」在句中表示什麼？',
      options: ['死亡的時候', '因為已經死亡', '不要死亡'],
      answer: 0,
      explanation:
        '「とき」引出時間；「死ぬ」是辭書形，不是禁止形，也沒有說某個人已死。',
    },
  ],
  'anime-lesson-05:aot-eren': [
    {
      id: 'intent-threat',
      prompt: '這裡「してやる」主要表達什麼？',
      options: ['禮貌地替對方服務', '表示自己沒有能力', '強烈決心或威嚇'],
      answer: 2,
      explanation:
        '在「駆逐してやる」的動作與語境裡，是給對方好看的強烈決心；不要把授受的字面意思套成客氣服務。',
    },
  ],
  'anime-lesson-05:aot-erwin': [
    {
      id: 'structure-command',
      prompt: '「捧げよ」是哪一類說法？',
      options: ['提出可能性', '莊重的命令', '說明已完成'],
      answer: 1,
      explanation:
        '「捧げる」的命令形可用「捧げろ」或較莊重的「捧げよ」；不是「よ」一律都能接在辭書形後表示命令。',
    },
  ],
  'anime-lesson-05:slamdunk-weapon': [
    {
      id: 'inference-metaphor',
      prompt: '這句話對「秘密兵器」的用法支持哪個判斷？',
      options: [
        '說話者把對方比喻成王牌',
        '場景一定在戰爭中',
        '對方手上一定有槍',
      ],
      answer: 0,
      explanation:
        '句子的主題是「キミ」。詞彙能比喻有利本領或人物；僅憑兵器這個詞不能推成戰爭或槍械。',
    },
  ],
  'anime-lesson-05:kimetsu-protect': [
    {
      id: 'structure-causative',
      prompt: '「死なせない」承諾的是什麼？',
      options: ['大家不願死亡', '說話者已經死亡', '不讓在場的人死亡'],
      answer: 2,
      explanation:
        '「死ぬ→死なせる→死なせない」是使役否定。「誰も」與否定一起表示不讓任何人死。',
    },
  ],
  'anime-lesson-06:frieren-magic': [
    {
      id: 'structure-ongoing',
      prompt: '台詞說什麼時候最開心？',
      options: ['尋找魔法的過程中', '所有魔法都已經找到後', '不能使用魔法時'],
      answer: 0,
      explanation:
        '「探し求めている時」指尋找進行中的時候；不把「ている」誤解成找到的完成結果。',
    },
  ],
  'anime-lesson-06:madoka-kyubey': [
    {
      id: 'intent-request',
      prompt: '這句話是否表示對方已經答應契約？',
      options: [
        '是，契約已完成',
        '沒有；說話者正在提出要求',
        '沒有；說話者拒絕契約',
      ],
      answer: 1,
      explanation:
        '句尾「なってよ」要求對方成為魔法少女；對方的答覆及契約細節都不在這句短台詞裡。',
    },
  ],
  'anime-lesson-06:madoka-anything': [
    {
      id: 'structure-free-choice',
      prompt: '「何だってかまわない」表示哪種限制？',
      options: ['只能選某一個', '什麼都禁止', '對選擇沒有特別限制'],
      answer: 2,
      explanation:
        '這裡的「何だって」是什麼都可以；不能把「かまわない」末尾的否定直接判成全部不准。',
    },
  ],
  'anime-lesson-06:jojo-time': [
    {
      id: 'structure-command',
      prompt: '「止まれ」要求什麼動作？',
      options: ['繼續流動', '停下來', '確認是否停止'],
      answer: 1,
      explanation:
        '「止まる」的命令形是「止まれ」。前面的「時よ」是在呼喚時間，不是詢問。',
    },
  ],
  'anime-lesson-07:slamdunk': [
    {
      id: 'inference-condition',
      prompt: '「諦めたら」是否表示對方已經放棄？',
      options: [
        '沒有；它提出放棄時會有的結果',
        '是；放棄已經發生',
        '是；比賽已正式結束',
      ],
      answer: 0,
      explanation:
        '「たら」在這裡是條件。句子描述放棄的結果，沒有斷言對方已放棄。',
    },
  ],
  'anime-lesson-07:kusuriya-poison': [
    {
      id: 'inference-scope',
      prompt: '只憑這句指出毒的短台詞，還無法確定什麼？',
      options: ['說話者指出毒', '說話者辨認某物的性質', '是誰下毒及其動機'],
      answer: 2,
      explanation:
        '這句話能指出毒，卻沒有交代犯人、動機或完整調查；不能用自己的劇情記憶填成台詞已說的事。',
    },
  ],
  'anime-lesson-07:frieren-himmel': [
    {
      id: 'inference-premise',
      prompt: '把希梅爾作為判斷前提，是否等於他現在就在場？',
      options: [
        '是；明確報告了位置',
        '不是；這句在判斷他會怎麼做',
        '是；他正在下命令',
      ],
      answer: 1,
      explanation:
        '「ならそうした」是以人物作前提的行為判斷；不是現在位置的報告。',
    },
  ],
  'anime-lesson-07:aot-choose': [
    {
      id: 'structure-choice',
      prompt: '「自分で選べ」要求誰作選擇？',
      options: ['聽話的人自己', '說話者代替對方', '沒有提出選擇要求'],
      answer: 0,
      explanation:
        '「選べ」是命令形，「自分で」要求自己選；不代表說話者保證某個選項一定正確。',
    },
  ],
};
