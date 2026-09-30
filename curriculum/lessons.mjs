/**
 * @typedef {{ jp: string, reading: string, zh: string, voice: string, audio: string }} Line
 * @typedef {{ pattern: string, note: string, examples: Line[] }} GrammarPoint
 * @typedef {{ word: string, reading: string, zh: string, voice: string, audio: string }} VocabItem
 * @typedef {Line & { source: string, note: string }} Quote
 * @typedef {{ q: string, a: string }} PracticeItem
 * @typedef {{
 *   id: string,
 *   title: string,
 *   audioReady?: boolean,
 *   vocab: VocabItem[],
 *   grammar: GrammarPoint[],
 *   dialogue: Line[],
 *   quotes?: Quote[],
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

// audioReady: false 表示文字內容已完成、音檔尚未合成（合成需在有 VOICEVOX 與 ffmpeg 的機器上跑，
// 見 scripts/synthesize.mjs）。音檔產生並放進 public/ 之後，把這個旗標移除或改成 true。
// 旗標為 false 時畫面不顯示播放器，聽寫與跟讀也不會出現這些句子。
const SPOKEN_AUDIO = 'audio/stage-2/spoken';

/** @type {Lesson} */
const spoken = {
  id: 'stage2-spoken',
  title: '口語轉換表：教科書日文 → 動畫口語',
  audioReady: false,
  vocab: [],
  grammar: [
    {
      pattern: 'ている → てる',
      note: '口語把「い」省略。「ていない」變「てない」。動畫裡幾乎都是縮約形，只有正式場合才聽到完整的「ている」。',
      examples: [
        { jp: '雨が降っています。', reading: 'あめが ふって います。', zh: '教科書：正在下雨。', voice: 'sayo', audio: `${SPOKEN_AUDIO}/teru-1.mp3` },
        { jp: '雨が降ってる。', reading: 'あめが ふってる。', zh: '口語：正在下雨。', voice: 'tsumugi', audio: `${SPOKEN_AUDIO}/teru-2.mp3` },
      ],
    },
    {
      pattern: 'てしまう → ちゃう（でしまう → じゃう）',
      note: '表示「做完了」或「不小心、可惜」。口語說「ちゃう」；前面是「ん」音便時變「じゃう」（死んでしまう → 死んじゃう）。過去式「ちゃった」出現頻率非常高。',
      examples: [
        { jp: '宿題を忘れてしまいました。', reading: 'しゅくだいを わすれて しまいました。', zh: '教科書：我把作業忘了。', voice: 'sayo', audio: `${SPOKEN_AUDIO}/chau-1.mp3` },
        { jp: '宿題、忘れちゃった。', reading: 'しゅくだい、わすれちゃった。', zh: '口語：糟了，我把作業忘了。', voice: 'tsumugi', audio: `${SPOKEN_AUDIO}/chau-2.mp3` },
      ],
    },
    {
      pattern: 'ておく → とく（でおく → どく）',
      note: '表示「事先做好」。口語縮成「とく」，語氣輕鬆。',
      examples: [
        { jp: '先に買っておきます。', reading: 'さきに かって おきます。', zh: '教科書：我先買好。', voice: 'sayo', audio: `${SPOKEN_AUDIO}/toku-1.mp3` },
        { jp: '先に買っとく。', reading: 'さきに かっとく。', zh: '口語：我先買起來。', voice: 'tsumugi', audio: `${SPOKEN_AUDIO}/toku-2.mp3` },
      ],
    },
    {
      pattern: 'ては → ちゃ（では → じゃ）',
      note: '「〜てはいけない／ダメ」的口語是「〜ちゃいけない／ダメ」，表示禁止。動畫名句「逃げちゃダメだ」就是這個縮約。',
      examples: [
        { jp: 'ここで遊んではいけません。', reading: 'ここで あそんでは いけません。', zh: '教科書：不可以在這裡玩。', voice: 'sayo', audio: `${SPOKEN_AUDIO}/cha-1.mp3` },
        { jp: 'ここで遊んじゃダメ。', reading: 'ここで あそんじゃ ダメ。', zh: '口語：不可以在這裡玩。', voice: 'tsumugi', audio: `${SPOKEN_AUDIO}/cha-2.mp3` },
      ],
    },
    {
      pattern: 'なければ → なきゃ',
      note: '「〜なければならない」是「非…不可」。口語縮成「なきゃ」，後面的「ならない／いけない」常整段省略，單獨一句「行かなきゃ」就成立。',
      examples: [
        { jp: '早く行かなければなりません。', reading: 'はやく いかなければ なりません。', zh: '教科書：我必須快點去。', voice: 'sayo', audio: `${SPOKEN_AUDIO}/nakya-1.mp3` },
        { jp: '早く行かなきゃ。', reading: 'はやく いかなきゃ。', zh: '口語：得快點去才行。', voice: 'tsumugi', audio: `${SPOKEN_AUDIO}/nakya-2.mp3` },
      ],
    },
    {
      pattern: 'のだ／のです → んだ／んです',
      note: '說明原因、狀況或帶出心情的語氣（「其實是這樣啦」）。口語的「の」變成「ん」。疑問句更常直接用「の？」結尾。',
      examples: [
        { jp: '実は、行きたくないのです。', reading: 'じつは、いきたくないのです。', zh: '教科書：其實我不想去。', voice: 'sayo', audio: `${SPOKEN_AUDIO}/nda-1.mp3` },
        { jp: '実は、行きたくないんだ。', reading: 'じつは、いきたくないんだ。', zh: '口語：其實我不想去啦。', voice: 'tsumugi', audio: `${SPOKEN_AUDIO}/nda-2.mp3` },
      ],
    },
    {
      pattern: 'と言う → って',
      note: '轉述別人的話時，口語常把「と」換成「って」，連「言う」都可以省略，帶有「聽說」的傳聞語氣。',
      examples: [
        { jp: '田中さんは来ないと言いました。', reading: 'たなかさんは こないと いいました。', zh: '教科書：田中先生說他不來。', voice: 'sayo', audio: `${SPOKEN_AUDIO}/tte-1.mp3` },
        { jp: '田中さん、来ないって。', reading: 'たなかさん、こないって。', zh: '口語：田中說他不來喔。', voice: 'tsumugi', audio: `${SPOKEN_AUDIO}/tte-2.mp3` },
      ],
    },
    {
      pattern: 'ら抜き言葉（食べられる → 食べれる）',
      note: '一段動詞（食べる、見る、起きる）的可能形，口語常把「ら」拿掉。聽得懂就好，考試與正式文章仍用完整的「られる」。五段動詞（行く → 行ける）本來就沒有「ら」。',
      examples: [
        { jp: '朝ごはんが食べられません。', reading: 'あさごはんが たべられません。', zh: '教科書：我吃不下早餐。', voice: 'sayo', audio: `${SPOKEN_AUDIO}/rasnuki-1.mp3` },
        { jp: '朝ごはん、食べれない。', reading: 'あさごはん、たべれない。', zh: '口語：早餐吃不下。', voice: 'tsumugi', audio: `${SPOKEN_AUDIO}/rasnuki-2.mp3` },
      ],
    },
    {
      pattern: '語尾：よ／ね／よね',
      note: '「よ」告訴對方對方可能不知道的事；「ね」尋求對方同意、共鳴；「よね」是「我覺得是這樣，對吧？」的確認。三個都沒有實際詞義，卻決定了整句的態度。',
      examples: [
        { jp: 'このラーメン、おいしいよ。', reading: 'この ラーメン、おいしいよ。', zh: '這碗拉麵很好吃喔（我告訴你）。', voice: 'tsumugi', audio: `${SPOKEN_AUDIO}/yone-1.mp3` },
        { jp: 'このラーメン、おいしいよね。', reading: 'この ラーメン、おいしいよね。', zh: '這碗拉麵很好吃，對吧？', voice: 'hau', audio: `${SPOKEN_AUDIO}/yone-2.mp3` },
      ],
    },
    {
      pattern: '語尾：ぞ／ぜ／わ／かしら（角色語氣）',
      note: '「ぞ」「ぜ」是男性化、帶力道的斷定，動畫裡常見於熱血角色；「わ」「かしら」是女性化或大小姐口吻的語氣。現實生活的自然對話中很少這樣說，學會聽懂即可，不要自己模仿。',
      examples: [
        { jp: 'そろそろ行くぞ。', reading: 'そろそろ いくぞ。', zh: '差不多該出發了！（男性、有力）', voice: 'nana', audio: `${SPOKEN_AUDIO}/kyara-1.mp3` },
        { jp: 'あの人、誰かしら。', reading: 'あの ひと、だれかしら。', zh: '那個人是誰呢？（女性、自言自語）', voice: 'miko', audio: `${SPOKEN_AUDIO}/kyara-2.mp3` },
      ],
    },
  ],
  dialogue: [],
  practice: [
    { q: '把「雨が降っています。」改成口語縮約形。', a: '雨が降ってる。' },
    { q: '把「宿題を忘れてしまった。」改成口語縮約形。', a: '宿題、忘れちゃった。' },
    { q: '把「行かなければならない。」改成口語縮約形。', a: '行かなきゃ。（或行かなきゃならない）' },
    { q: '把「ここで遊んではいけない。」改成口語縮約形。', a: 'ここで遊んじゃいけない。（或遊んじゃダメ）' },
    { q: '「食べられない」的ら抜き形式是什麼？', a: '食べれない' },
    { q: '想向對方確認「你也這樣覺得吧」，句尾用「よ」還是「ね」（或「よね」）？', a: 'ね（或よね）。「よ」是告知對方不知道的事。' },
  ],
};

const QUOTES_AUDIO = 'audio/stage-2/quotes';

// 每句只收單句短台詞，標明出處，解說為自己撰寫。音檔一律用 VOICEVOX 自製合成，不使用原配音。
// 台詞用字已用網路搜尋交叉確認（二手來源，非原作台本）；首批只是常見名句，之後依 Michael 想聽懂的作品增補。
/** @type {Lesson} */
const quotes = {
  id: 'stage2-quotes',
  title: '動畫名句：短句與口語重點（首批）',
  audioReady: false,
  vocab: [],
  grammar: [],
  dialogue: [],
  quotes: [
    {
      jp: '諦めたらそこで試合終了ですよ。',
      reading: 'あきらめたら そこで しあい しゅうりょう ですよ。',
      zh: '一旦放棄，比賽就在那裡結束了。',
      voice: 'sayo',
      audio: `${QUOTES_AUDIO}/slamdunk.mp3`,
      source: 'SLAM DUNK（安西先生）',
      note: '「〜たら」是「一旦…就」；「そこで」指「就在那個時間點」；句尾「ですよ」是禮貌語加上「我告訴你」的提醒語氣。',
    },
    {
      jp: 'お前はもう死んでいる。',
      reading: 'おまえは もう しんで いる。',
      zh: '你已經死了。',
      voice: 'nana',
      audio: `${QUOTES_AUDIO}/hokuto.mp3`,
      source: '北斗の拳（ケンシロウ）',
      note: '「お前」是對同輩或晚輩的粗魯稱呼；「死んでいる」的「ている」表結果狀態（已經是死的狀態），不是「正在死」，口語會縮成「死んでる」。',
    },
    {
      jp: '真実はいつもひとつ！',
      reading: 'しんじつは いつも ひとつ！',
      zh: '真相永遠只有一個！',
      voice: 'tsumugi',
      audio: `${QUOTES_AUDIO}/conan.mp3`,
      source: '名探偵コナン（江戸川コナン）',
      note: '名詞句，省略了「です／だ」，短促有力。「は」提示主題，「いつも」是「總是」。這句以動畫版與劇場版的招牌決め台詞最為人所知。',
    },
    {
      jp: '逃げちゃダメだ。',
      reading: 'にげちゃ ダメだ。',
      zh: '不能逃避。',
      voice: 'neko-vy',
      audio: `${QUOTES_AUDIO}/eva.mp3`,
      source: '新世紀エヴァンゲリオン（碇シンジ）',
      note: '「逃げてはダメだ」的口語縮約（ては → ちゃ，見口語轉換表）。「ダメ」是「不行」。',
    },
    {
      jp: '月に代わっておしおきよ！',
      reading: 'つきに かわって おしおきよ！',
      zh: '代替月亮，懲罰你！',
      voice: 'miko',
      audio: `${QUOTES_AUDIO}/sailormoon.mp3`,
      source: '美少女戦士セーラームーン',
      note: '「〜に代わって」是「代替…」；「おしおき」原本是對小孩的責罰，帶點俏皮；句尾「よ」是告知語氣，這裡偏女性化。',
    },
    {
      jp: '海賊王におれはなる！',
      reading: 'かいぞくおうに おれは なる！',
      zh: '我要成為海賊王！',
      voice: 'zunko',
      audio: `${QUOTES_AUDIO}/onepiece.mp3`,
      source: 'ONE PIECE（モンキー・D・ルフィ）',
      note: '平常語序是「おれは海賊王になる」，把「海賊王に」提到句首是倒裝，用來強調目標。「おれ」是男性自稱；「なる」現在形在這裡表決心。',
    },
    {
      jp: '私、気になります！',
      reading: 'わたし、きに なります！',
      zh: '我很在意（好奇）！',
      voice: 'hau',
      audio: `${QUOTES_AUDIO}/hyouka.mp3`,
      source: '氷菓（千反田える）',
      note: '「気になる」是「放不下心、忍不住在意」，用「なる」表示是自然變成這樣，而非刻意。「私、」後面停頓並省略「は」，是口語習慣。',
    },
    {
      jp: '僕は新世界の神となる。',
      reading: 'ぼくは しんせかいの かみと なる。',
      zh: '我要成為新世界的神。',
      voice: 'chuugoku-usagi',
      audio: `${QUOTES_AUDIO}/deathnote.mp3`,
      source: 'DEATH NOTE（夜神月）',
      note: '「〜となる」和「〜になる」都是「成為」，「となる」較書面、莊重。「僕」比「おれ」溫和，和前面海賊王的例句可以對照自稱的語感。',
    },
  ],
  practice: [
    { q: '「逃げちゃダメだ」還原成教科書形是什麼？', a: '逃げてはダメだ（逃げてはいけない）。' },
    { q: '「お前はもう死んでいる」的「死んでいる」是「正在死」還是「已經是死的狀態」？', a: '已經是死的狀態（結果狀態）。' },
    { q: '「海賊王におれはなる」的正常語序是？', a: 'おれは海賊王になる。' },
  ],
};

/** @type {Stage[]} */
export const stages = [
  { id: 'stage-0', title: '第 0 階段：N5 復健', lessons: [day1] },
  { id: 'stage-1', title: '第 1 階段：聽力打底', lessons: [] },
  { id: 'stage-2', title: '第 2 階段：口語與動畫日文', lessons: [spoken, quotes] },
  { id: 'stage-3', title: '第 3 階段：N3 到 N1', lessons: [] },
];
