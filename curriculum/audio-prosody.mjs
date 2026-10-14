/**
 * T46：已核對讀音與重音句界的音檔覆寫；不由孤立詞重音推斷整句重音。
 * 重音型參考 Kanjium（Uros O.），commit 6f32ef33701e572f5485f85eda7ffb9333f8c24e。
 * 本檔重音資料依 CC BY-SA 4.0 提供：https://creativecommons.org/licenses/by-sa/4.0/
 * https://github.com/mifunetoshiro/kanjium/blob/6f32ef33701e572f5485f85eda7ffb9333f8c24e/data/source_files/raw/accents.txt
 * kana 為 VOICEVOX AquesTalk 風記法，' 標示下降位置，/ 為無停頓句界。
 */

/** @type {Record<string, {text: string, reading: string, kana: string, reason: string, reference: 'kanjium' | 'voicevox', articulation?: import('../scripts/pronunciation.mjs').Articulation}>} */
export const AUDIO_PROSODY = {
"audio/stage-1/general-listening-51/gram-51a0f31945.mp3": {"text":"橋は明日開くそうだ。","reading":"はしは あした あくそうだ。","kana":"ハシ'ワ/ア_シタ'/アク'/ソオダ'","reason":"T108：開く指恢復開放，採あく；保留其他原查詢片語。","reference":"voicevox"},
"audio/stage-1/general-listening-52/vocab-5d92cc3700.mp3": {"text":"明後日","reading":"あさって","kana":"アサ'ッテ","reason":"T108：明後日採口語あさって；依Kanjium重音型2。","reference":"kanjium"},
"audio/stage-1/general-listening-57/dlg-482581a10d.mp3": {"text":"じゃあ、分けるかどうかは、その後で決めよう。","reading":"じゃあ、わけるかどうかは、その あとで きめよう。","kana":"ジャ'ア、ワケ'ルカ/ド'オカワ、ソノ'/ア'トデ/キメヨオ'","reason":"T108：その後指其後的順序，教材採そのあと；保留前後原查詢片語，校正片語依讀音查詢。","reference":"voicevox"},
"audio/stage-1/general-listening-58/vocab-9165aa0820.mp3": {"text":"静か","reading":"しずか","kana":"シ'ズカ","reason":"T108：静か採しずか，刪除引擎多出的か，依Kanjium重音型1。","reference":"kanjium"},
"audio/stage-1/general-listening-58/vocab-0eb9cbed9a.mp3": {"text":"空く","reading":"すく","kana":"スク'","reason":"T108：空く表示變得不擁擠，採すく；依Kanjium平板型0。","reference":"kanjium"},
"audio/stage-1/general-listening-58/gram-2478ce7a27.mp3": {"text":"入れるけど、座れない。","reading":"はいれるけど、すわれない。","kana":"ハイレル'ケド、スワレナイ'","reason":"T108：入れる為進入的可能形，採はいれる；保留否定能力句的原查詢重音。","reference":"voicevox"},
"audio/stage-1/general-listening-59/dlg-64eced3b29.mp3": {"text":"うん。決まったら皆に知らせる。","reading":"うん。きまったら みんなに しらせる。","kana":"ウ'ン、キマッタ'ラ/ミンナニ'/シラセル'","reason":"T108：皆採口語みんな；保留其餘原查詢片語重音及停頓。","reference":"voicevox"},
"audio/stage-1/general-listening-43/vocab-381fcf851f.mp3": {"text":"辛い","reading":"からい","kana":"カラ'イ","reason":"T108：辛い為味覺辣，採からい，依Kanjium重音型2。","reference":"kanjium"},
"audio/stage-1/general-listening-44/vocab-f0d4f9844a.mp3": {"text":"行き","reading":"ゆき","kana":"ユキ'","reason":"T108：行き表示開往，教材採ゆき，依Kanjium平板型0。","reference":"kanjium"},
"audio/stage-1/general-listening-44/dlg-4be4ecf4c3.mp3": {"text":"三番線で港行きに乗るんですね。","reading":"さんばんせんで みなとゆきに のるんですね。","kana":"サンバ'ンセンデ/ミナト'ユキニ/ノル'/ン'デ_スネ","reason":"T108：開往港口採みなとゆき；保留其他原查詢片語重音與句界。","reference":"voicevox"},
"audio/stage-1/general-listening-45/dlg-6550f65767.mp3": {"text":"予約したミナです。今、部屋に入れますか。","reading":"よやくした ミナです。いま、へやに はいれますか。","kana":"ヨヤク'/_シタ'/ミ'ナデ_ス、イ'マ、ヘヤ'ニ/ハイレマ'_スカ","reason":"T108：入れます為進入的可能形，採はいれます；保留前半原查詢片語。","reference":"voicevox"},
"audio/stage-1/general-listening-46/vocab-9b49d08af1.mp3": {"text":"晴れる","reading":"はれる","kana":"ハレ'ル","reason":"T108：晴れる採はれる，刪除多出的れ，依Kanjium重音型2。","reference":"kanjium"},
"audio/stage-1/general-listening-47/vocab-1ccbf5e205.mp3": {"text":"診療所","reading":"しんりょうじょ","kana":"シンリョオジョ'","reason":"T108：診療所採しんりょうじょ，依Kanjium選平板型0。","reference":"kanjium"},
"audio/stage-1/general-listening-47/dlg-216cf34e9d.mp3": {"text":"午後もよくならなかったら、診療所に行こう。付き添うよ。","reading":"ごごも よくならなかったら、しんりょうじょに いこう。つきそうよ。","kana":"ゴ'ゴモ/ヨクナラ'ナカッタラ、シンリョオジョ'ニ/イコオ'、_ツキソ'ウヨ","reason":"T108：診療所採しんりょうじょ；保留其他原查詢重音及停頓。","reference":"voicevox"},
"audio/stage-1/general-listening-50/dlg-33c4027ded.mp3": {"text":"ありがとう。次の角を右に曲がろう。","reading":"ありがとう。つぎの かどを みぎに まがろう。","kana":"アリ'ガトオ、ツギ'ノ/カ'ドオ/ミギニ'/マガロオ'","reason":"T108：道路轉角採かど；保留其他原查詢片語重音。","reference":"voicevox"},
"audio/stage-1/general-listening-32/vocab-1d0f2d0699.mp3": {"text":"描く","reading":"かく","kana":"カ'ク","reason":"T108：描く的畫畫語義採かく，依Kanjium重音型1。","reference":"kanjium"},
"audio/stage-1/general-listening-32/gram-687b5236b5.mp3": {"text":"絵を描くのが好きです。","reading":"えを かくのが すきです。","kana":"エ'オ/カ'ク/ノガ'/_スキ'デ_ス","reason":"T108：描く採かく；保留其他原查詢片語重音與句界。","reference":"voicevox"},
"audio/stage-1/general-listening-32/dlg-82b966a6d5.mp3": {"text":"絵を描くのが好きだよ。","reading":"えを かくのが すきだよ。","kana":"エ'オ/カ'ク/ノガ'/_スキ'ダヨ","reason":"T108：描く採かく；保留其他原查詢片語重音與句界。","reference":"voicevox"},
"audio/stage-1/general-listening-32/dlg-1bb5fa963a.mp3": {"text":"いいよ。最近描いた絵を持ってくる。","reading":"いいよ。さいきん かいた えを もってくる。","kana":"イ'イヨ、サイキン'/カ'イタ/エ'オ/モ'ッテ/ク'ル","reason":"T108：描いた採かいた；保留最近等其他原查詢片語，不沿用全假名重切詞。","reference":"voicevox"},
"audio/stage-1/general-listening-33/vocab-6696b923d1.mp3": {"text":"空く","reading":"あく","kana":"アク'","reason":"T108：空く表示位置空出，採あく，依Kanjium平板型0。","reference":"kanjium"},
"audio/stage-1/general-listening-35/vocab-ea48768930.mp3": {"text":"静か","reading":"しずか","kana":"シ'ズカ","reason":"T108：静か採しずか，刪除引擎多出的か，依Kanjium重音型1。","reference":"kanjium"},
"audio/stage-1/general-listening-36/dlg-3e47695c82.mp3": {"text":"じゃあ、出発しよう。もう皆待ってる。","reading":"じゃあ、しゅっぱつしよう。もう みんな まってる。","kana":"ジャ'ア、シュッパ_ツ'/シヨオ'、モ'オ/ミンナ'/マッテ'ル","reason":"T108：皆採教材口語みんな；保留其他原查詢片語重音，校正片語採讀音查詢。","reference":"voicevox"},
"audio/stage-1/general-listening-38/dlg-4efc094533.mp3": {"text":"ごめん、騒がしくて聞き取れない。もう一度言って。","reading":"ごめん、さわがしくて ききとれない。もう いちど いって。","kana":"ゴメン'、サワガシ'_クテ/_キキトレ'ナイ、モオイチド'/イッテ'","reason":"T108：言って為いって而非げんって；保留前面原查詢片語重音，請求尾句依いって校正。","reference":"voicevox"},
"audio/stage-1/general-listening-40/gram-6a75e6ba7b.mp3": {"text":"日曜日に市場へ行きませんか。","reading":"にちようびに いちばへ いきませんか。","kana":"ニチヨ'オビニ/イ'チバエ/イキマセ'ンカ","reason":"T108：市場指市集，採いちば；保留日期與邀請句原查詢重音。","reference":"voicevox"},
"audio/stage-1/general-listening-40/dlg-4abf76fd49.mp3": {"text":"土曜日、一緒に市場へ行きませんか。","reading":"どようび、いっしょに いちばへ いきませんか。","kana":"ドヨ'オビ、イッショニ'/イ'チバエ/イキマセ'ンカ","reason":"T108：市場指市集，採いちば；保留日期與邀請句原查詢重音。","reference":"voicevox"},

"audio/games/genshin/gram-3b76cdc731.mp3": {"text": "何でも言ってくれ！", "reading": "なんでも いってくれ！", "kana": "ナ'ンデモ/イッテ'/クレ'", "reason": "T117：何でも採教材的なんでも，保留言って與くれ的原查詢重音及句界。", "reference": "voicevox"},

"audio/games/genshin/gram-b4a1a8f0c9.mp3": {"text": "鈴の音を合図に。", "reading": "すずの ねを あいずに。", "kana": "スズノ'/ネオ'/ア'イズニ", "reason": "T115：鈴の音以ね校正引擎的おと；保留鈴の與合図に的原查詢片語重音及句界，音ね的核對讀法與平板型0參考Kanjium。", "reference": "voicevox"},

  "audio/stage-1/general-listening-24/gram-b3028508bc.mp3": {
    "text": "店が開いているかどうか調べる。",
    "reading": "みせが あいているかどうか しらべる。",
    "kana": "ミセ'ガ/ア'イテ/イル'カ/ド'オカ/シラベ'ル",
    "reason": "T107：依教材語義校正描いて的かいて、開いてる的あいてる、降りそう的ふりそう、山道的やまみち或肚子空いて的すいて；保留其他片語原查詢重音，校正片語採已核對讀音，不推定真人演技。",
    "reference": "voicevox"
  },
  "audio/stage-1/general-listening-24/dlg-9bd9364ff0.mp3": {
    "text": "明日、店が開いているかどうかわかる？",
    "reading": "あした、みせが あいているかどうか わかる？",
    "kana": "ア_シタ'、ミセ'ガ/ア'イテ/イル'カ/ド'オカ/ワカ'ル？",
    "reason": "T107：依教材語義校正描いて的かいて、開いてる的あいてる、降りそう的ふりそう、山道的やまみち或肚子空いて的すいて；保留其他片語原查詢重音，校正片語採已核對讀音，不推定真人演技。",
    "reference": "voicevox"
  },
  "audio/stage-1/general-listening-28/gram-062a638eb3.mp3": {
    "text": "お腹はあまり空いていない。",
    "reading": "おなかは あまり すいていない。",
    "kana": "オナカワ'/アマリ'/スイテ'/イナイ'",
    "reason": "T107：依教材語義校正描いて的かいて、開いてる的あいてる、降りそう的ふりそう、山道的やまみち或肚子空いて的すいて；保留其他片語原查詢重音，校正片語採已核對讀音，不推定真人演技。",
    "reference": "voicevox"
  },
  "audio/stage-1/general-listening-28/dlg-8e6da7161f.mp3": {
    "text": "私はあまりお腹が空いてない。",
    "reading": "わたしは あまり おなかが すいてない。",
    "kana": "ワタシワ'/アマリ'/オナカガ'/スイテナイ'",
    "reason": "T107：依教材語義校正描いて的かいて、開いてる的あいてる、降りそう的ふりそう、山道的やまみち或肚子空いて的すいて；保留其他片語原查詢重音，校正片語採已核對讀音，不推定真人演技。",
    "reference": "voicevox"
  },
  "audio/stage-1/general-listening-30/vocab-1fd9467c94.mp3": {
    "text": "港町",
    "reading": "みなとまち",
    "kana": "ミナト'マチ",
    "reason": "T107：港町採みなとまち，修正みなとちょう；依Kanjium採重音型3。",
    "reference": "kanjium"
  },

  "audio/stage-1/general-listening-17/gram-2e8fa7dc8e.mp3": {
    "text": "友達に地図を描いてもらう。",
    "reading": "ともだちに ちずを かいてもらう。",
    "kana": "トモダチニ'/チ'ズオ/カ'イテ/モラウ'",
    "reason": "T107：依教材語義校正描いて的かいて、開いてる的あいてる、降りそう的ふりそう或山道的やまみち；保留其他片語原查詢重音，校正片語採已核對讀音，不推定真人演技。",
    "reference": "voicevox"
  },
  "audio/stage-1/general-listening-19/vocab-341e3b41a4.mp3": {
    "text": "開く",
    "reading": "あく",
    "kana": "アク'",
    "reason": "T107：開く表示開著，採あく，修正ひらく；依Kanjium採平板型0。",
    "reference": "kanjium"
  },
  "audio/stage-1/general-listening-19/dlg-01b3eb383a.mp3": {
    "text": "隣町の店なら開いてるかもしれない。",
    "reading": "となりまちの みせなら あいてるかもしれない。",
    "kana": "トナリ'マチノ/ミセ'ナラ/アイテ'ルカモ/シレナイ'",
    "reason": "T107：依教材語義校正描いて的かいて、開いてる的あいてる、降りそう的ふりそう或山道的やまみち；保留其他片語原查詢重音，校正片語採已核對讀音，不推定真人演技。",
    "reference": "voicevox"
  },
  "audio/stage-1/general-listening-21/vocab-5723d0ebe5.mp3": {
    "text": "山道",
    "reading": "やまみち",
    "kana": "ヤマ'ミチ",
    "reason": "T107：山道表示山上的道路，採やまみち，修正さんどう；依Kanjium採重音型2。",
    "reference": "kanjium"
  },
  "audio/stage-1/general-listening-21/gram-bf0f7f1616.mp3": {
    "text": "雨が降りそうだ。",
    "reading": "あめが ふりそうだ。",
    "kana": "ア'メガ/フリ'ソオダ",
    "reason": "T107：依教材語義校正描いて的かいて、開いてる的あいてる、降りそう的ふりそう或山道的やまみち；保留其他片語原查詢重音，校正片語採已核對讀音，不推定真人演技。",
    "reference": "voicevox"
  },
  "audio/stage-1/general-listening-21/dlg-a63cb0c5c2.mp3": {
    "text": "雲が暗いね。雨が降りそうだ。",
    "reading": "くもが くらいね。あめが ふりそうだ。",
    "kana": "ク'モガ/クライネ'、ア'メガ/フリ'ソオダ",
    "reason": "T107：依教材語義校正描いて的かいて、開いてる的あいてる、降りそう的ふりそう或山道的やまみち；保留其他片語原查詢重音，校正片語採已核對讀音，不推定真人演技。",
    "reference": "voicevox"
  },
  "audio/stage-1/general-listening-21/dlg-60e0284499.mp3": {
    "text": "山道は危険かもしれないよ。",
    "reading": "やまみちは きけんかもしれないよ。",
    "kana": "ヤマ'ミチワ/_キケンカ'モ/シレナイヨ'",
    "reason": "T107：依教材語義校正描いて的かいて、開いてる的あいてる、降りそう的ふりそう或山道的やまみち；保留其他片語原查詢重音，校正片語採已核對讀音，不推定真人演技。",
    "reference": "voicevox"
  },
  "audio/stage-1/general-listening-22/gram-52ba64cb61.mp3": {
    "text": "彼は「まだ開いてる」って言ってた。",
    "reading": "かれは「まだ あいてる」って いってた。",
    "kana": "カ'レワ、マ'ダ/アイテ'ル、ッテ'/イッテタ'",
    "reason": "T107：依教材語義校正描いて的かいて、開いてる的あいてる、降りそう的ふりそう或山道的やまみち；保留其他片語原查詢重音，校正片語採已核對讀音，不推定真人演技。",
    "reference": "voicevox"
  },

  "audio/stage-1/general-listening-12/dlg-d489f7bb47.mp3": {
    "text": "受付はまだ開いてる？",
    "reading": "うけつけは まだ あいてる？",
    "kana": "ウケ_ツケワ'/マ'ダ/アイテ'ル？",
    "reason": "T107：此處問櫃檯是否仍開著，開いてる讀あいてる，修正引擎的ひらいてる；依校正查詢保留問句與句界，不宣稱真人演技。",
    "reference": "voicevox"
  },
  "audio/stage-1/general-listening-15/vocab-6b22e3aee3.mp3": {
    "text": "破れる",
    "reading": "やぶれる",
    "kana": "ヤブレ'ル",
    "reason": "T107：破れる表示破掉，讀やぶれる，修正引擎的われる；依Kanjium採重音型3。",
    "reference": "kanjium"
  },
  "audio/stage-1/general-listening-15/vocab-e6aa87a27e.mp3": {
    "text": "汚す",
    "reading": "よごす",
    "kana": "ヨゴス'",
    "reason": "T107：汚す表示弄髒，讀よごす，修正引擎的けがす；依Kanjium採平板型0。",
    "reference": "kanjium"
  },

  "audio/stage-1/general-listening-08/vocab-78f293b15a.mp3": {
    "text": "空",
    "reading": "から",
    "kana": "カラ'",
    "reason": "T106：此處空表示空無物品，讀から，修正引擎的そら；依Kanjium採重音型2。",
    "reference": "kanjium"
  },
  "audio/stage-1/general-listening-09/vocab-a494edec9a.mp3": {
    "text": "静か",
    "reading": "しずか",
    "kana": "シ'ズカ",
    "reason": "T106：静か讀しずか，修正引擎多出的か；依Kanjium採重音型1。",
    "reference": "kanjium"
  },

  "audio/stage-1/general-listening-04/vocab-6696b923d1.mp3": {
    "text": "空く",
    "reading": "あく",
    "kana": "アク'",
    "reason": "T105：空出或有空位的空く讀あく，修正引擎的むなしく；依Kanjium採平板型0。",
    "reference": "kanjium"
  },
  "audio/stage-1/general-listening-04/vocab-efe20aec0f.mp3": {
    "text": "明後日",
    "reading": "あさって",
    "kana": "アサ'ッテ",
    "reason": "T105：日常說法明後日讀あさって，修正引擎的みょうごにち；依Kanjium採重音型2。",
    "reference": "kanjium"
  },
  "audio/stage-1/general-listening-06/vocab-9b49d08af1.mp3": {
    "text": "晴れる",
    "reading": "はれる",
    "kana": "ハレ'ル",
    "reason": "T105：晴れる讀はれる，修正引擎多出的れ；依Kanjium採單一片語重音型2，避免假名解析拆成はれ／る。",
    "reference": "kanjium"
  },

"audio/games/genshin/gram-40e0ca96c9.mp3": {
  "text": "命に応えよ！",
  "reading": "めいに こたえよ！",
  "kana": "メ'イニ/コタ'エヨ",
  "reason": "T101：此處命是命令，採めい，修正引擎的いのち；使用校正讀音查詢的兩個片語與下降位置，屬教材朗讀，不推定原配音。",
  "reference": "voicevox"
},

"audio/games/genshin/gram-e416a2a01e.mp3": {
  "text": "ヨォーヨがいるから、心配しなくていいよ～",
  "reading": "ヨォーヨが いるから、しんぱいしなくて いいよ～",
  "kana": "ヨ'オヨガ/イル'カラ、シンパイ'/シナ_クテイイヨ'",
  "reason": "T100：ヨォーヨ保留來源字面與畫面讀音；教材音聲把首段ヨォー作一個長音，指定よおよ，修正引擎拆成ヨ／オオヨ的多餘音節。後半句界與重音保留原查詢，不宣稱已比對原作演技。",
  "reference": "voicevox"
},

"audio/games/genshin/gram-bad63746bf.mp3": {
  "text": "罪を認めろ！",
  "reading": "つみを みとめろ！",
  "kana": "ツ'ミオ/ミトメ'ロ",
  "reason": "T96：認めろ採みとめろ，修正引擎的したためろ；罪を保留原查詢下降位置，認めろ使用讀音校正後的VOICEVOX重音與原句界，不模仿原配音。",
  "reference": "voicevox"
},

"audio/games/genshin/gram-ebdd5c48a1.mp3": {
  "text": "ごめん、ちょっと退いてくれる？",
  "reading": "ごめん、ちょっと どいてくれる？",
  "kana": "ゴメン'、チョ'ット/ド'イテ/クレル'？",
  "reason": "T95：請求讓路的退いて採どいて，修正引擎的しりぞいて；其餘句界及重音保留原查詢，退いて使用讀音校正後的VOICEVOX重音，不模仿原配音。",
  "reference": "voicevox"
},

"audio/games/genshin/gram-c91fe6a9e1.mp3": {
  "text": "聞き給え、ここにて命ずる。",
  "reading": "ききたまえ、ここにて めいずる。",
  "kana": "_キキタマ'エ、ココニ'テ/メエズル'",
  "reason": "T94：聞き給え採ききたまえ，修正引擎的ききあたえ；合併聞き給え為一個命令片語，給え的下降位置沿用讀音校正查詢，其餘句界與重音保持原查詢，不宣稱原配音重音。",
  "reference": "voicevox"
},

"audio/games/genshin/gram-499b3f8e4d.mp3": {
  "text": "注目～！君に幸あれ！",
  "reading": "ちゅうもく～！きみに さちあれ！",
  "kana": "チュウモク'、キミニ'/サチ'アレ",
  "reason": "T92：君採きみ、幸採さち，修正原文解析的くん／こう；採用讀音校正後的VOICEVOX句界與重音，保留驚嘆後的停頓，不推定原作演技。",
  "reference": "voicevox"
},

  'audio/games/genshin/gram-a6e49b6988.mp3': {
    text: '風の共、雲の行くごと。',
    reading: 'かぜの とも、くもの ゆくごと。',
    kana: "カゼノ'/ト'モ、ク'モノ/ユ'クゴト",
    reason:
      'T86：文語的「行く」採ゆく，校正引擎解析的いく；「共」保留來源字面並讀とも。使用讀音校正後的VOICEVOX句界與重音，不宣稱與原作演技相同。',
    reference: 'voicevox',
  },
  'audio/games/genshin/gram-857c0a5b1a.mp3': {
    text: '氷浪のように唸れ——',
    reading: 'ひょうろうのように うなれ——',
    kana: "ヒョオ'ロオノ/ヨ'オニ/ウナ'レ",
    reason:
      'T82：教材將「氷浪」讀作「ひょうろう」，校正漢字解析的「こおりなみ」；指定讀音校正後的VOICEVOX句界與重音。教材朗讀未比對遊戲原配音。',
    reference: 'voicevox',
  },
  'audio/games/genshin/gram-cdf9199f58.mp3': {
    text: 'さあさあ、一儲けしに行きますの！',
    reading: 'さあさあ、ひともうけしに いきますの！',
    kana: "サア'サア、ヒトモ'オケ/シニ'/イキマ'スノ",
    reason:
      'T81：確認「一儲け」讀作「ひともうけ」。VOICEVOX預設會誤讀成「いちもうけ」，此設定用核對讀音保持原文查詢的句界與重音；不使用遊戲原配音，僅合成教材音聲。',
    reference: 'voicevox',
  },
  'audio/games/genshin/gram-31370acd78.mp3': {
    text: '腕の見せ所ですの！',
    reading: 'うでの みせどころですの！',
    kana: "ウデ'ノ/ミセドコロデ'スノ",
    reason:
      'T81：確認「見せ所」讀作「みせどころ」。VOICEVOX原文解析會誤讀「所」；此設定保留引擎查詢的前半重音與兩個片語界線，並採用修正讀音後的後半重音；不使用遊戲原配音，僅合成教材音聲。',
    reference: 'voicevox',
  },
  'audio/games/genshin/gram-9c66cccf23.mp3': {
    text: '皇女の名のもとに！',
    reading: 'こうじょの なの もとに！',
    kana: "コ'オジョノ/ナノ'/モト'ニ",
    reason:
      'T73：皇女採こうじょ，Kanjium記載1型；只修正原查詢おうじょ的首音，保留皇女の／名の／もとに的句界及下降位置。名採な，沿用原查詢，不模仿原配音。',
    reference: 'kanjium',
  },
  'audio/games/genshin/gram-790186fc70.mp3': {
    text: '雨垂れ石をも穿つ。',
    reading: 'あまだれ いしをも うがつ。',
    kana: "アマダレ'/イシ'オモ/ウガ'ツ",
    reason:
      'T73：石採いし，修正原查詢せき。依諺語的主語雨垂れ與賓語石をも分句，假名全文查詢確認各片語讀音；去掉空格產生的停頓，石的重音依詞典修正為2型，穿つ片語保持原查詢。雨垂れ0型、石2型、穿つ2型均與Kanjium相符；屬教材朗讀，未查證原配音重音。',
    reference: 'kanjium',
  },

  'audio/games/genshin/gram-b1d35981a8.mp3': {
    text: '天道、ここにあり。',
    reading: 'てんどう、ここに あり。',
    kana: "テ'ンドオ、ココニ'/ア'リ",
    reason:
      'T72：天之道取てんどう，Kanjium記載0／1型；選1型保留原查詢首片語的下降位置，修正引擎讀成てんとう。ここに／あり的句界、停頓與重音保持原查詢，不推定原配音演技。',
    reference: 'kanjium',
  },
  'audio/games/er/gram-8ee8cd59be.mp3': {
    text: '彷徨う魂に救済を。',
    reading: 'さまよう たましいに きゅうさいを。',
    kana: "サマヨ'ウ/タマ'シイニ/キュウサイオ'",
    reason:
      'T66：彷徨う採さまよう、Kanjium 3型；魂片語沿用同角色さまよう魂に救いを的引擎句界及重音，救済を保持原查詢。屬教材朗讀，不宣稱原配音重音。',
    reference: 'kanjium',
  },

  'audio/games/genshin/gram-641caa85ab-ro-v1.mp3': {
    text: '燃えろ！',
    reading: 'もえろ！',
    kana: "モエロ'",
    reason:
      'T63：保留命令形燃えろ與原查詢重音；略放慢並延長句尾ロ的母音o，提高語尾辨識度，不改成燃える。此為教學朗讀，未模仿原配音。',
    reference: 'voicevox',
    articulation: {
      finalMora: 'ロ',
      vowel: 'o',
      vowelLength: 0.22,
      speedScale: 0.95,
    },
  },

  'audio/stage-2/anime-lesson-03/core/vocab-e9ed37f232.mp3': {
    text: '燃やす',
    reading: 'もやす',
    kana: "モヤス'",
    reason:
      'T55：讀音採もやす、獨立詞採 Kanjium 的 0 型；修正引擎多讀え及假名重試切碎句界。',
    reference: 'kanjium',
  },
  'audio/stage-2/anime-lesson-05/core/vocab-639a6c4c7b.mp3': {
    text: '弓',
    reading: 'ゆみ',
    kana: "ユミ'",
    reason: 'T54：獨立單字採用 Kanjium 的弓（ゆみ）2 型，修正引擎的 1 型。',
    reference: 'kanjium',
  },
  'audio/stage-2/anime-lesson-05/core/vocab-0d5975e9c4.mp3': {
    text: '避ける',
    reading: 'よける',
    kana: "ヨケ'ル",
    reason:
      'T54：戰鬥詞彙取よける，採用 Kanjium 的 2 型；不沿用引擎的さける讀音。',
    reference: 'kanjium',
  },
  'audio/stage-0/day1/vocab-nanijin.mp3': {
    text: '何人',
    reading: 'なにじん',
    kana: "ナニ'ジン",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day2/vocab-nihon.mp3': {
    text: '日本',
    reading: 'にほん',
    kana: "ニホ'ン",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day2/gram-3-1.mp3': {
    text: 'これは何ですか。',
    reading: 'これは なんですか。',
    kana: "コレワ'/ナ'ンデ_スカ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day2/gram-3-2.mp3': {
    text: 'あれは何ですか。',
    reading: 'あれは なんですか。',
    kana: "アレワ'/ナ'ンデ_スカ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day2/dlg-1.mp3': {
    text: 'あのう、それは何ですか。',
    reading: 'あのう、それは なんですか。',
    kana: "アノ'ウ、ソレワ'/ナ'ンデ_スカ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day2/dlg-9.mp3': {
    text: 'はい、そうです。日本のコーヒーです。',
    reading: 'はい、そうです。にほんの コーヒーです。',
    kana: "ハ'イ、ソオデ_ス'、ニホ'ンノ/コオヒ'イデ_ス",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day3/gram-e557b36876.mp3': {
    text: '日本のカメラです。',
    reading: 'にほんの カメラです。',
    kana: "ニホ'ンノ/カ'メラデ_ス",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day3/gram-0966a348aa.mp3': {
    text: 'ここは日本の大使館です。',
    reading: 'ここは にほんの たいしかんです。',
    kana: "ココワ'/ニホ'ンノ/タイシ'カンデ_ス",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day4/vocab-eafc2738fc.mp3': {
    text: '四',
    reading: 'し',
    kana: "シ'",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day4/vocab-afd42f5e48.mp3': {
    text: '七',
    reading: 'しち',
    kana: "_シチ'",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day4/vocab-655c23d926.mp3': {
    text: '分',
    reading: 'ふん',
    kana: "フ'ン",
    reason: '獨立單字採用 Kanjium 收錄的第一個重音型',
    reference: 'kanjium',
  },
  'audio/stage-0/day5/vocab-464bc05184.mp3': {
    text: '一日',
    reading: 'ついたち',
    kana: "ツイタチ'",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day8/vocab-c1cad2a2b6.mp3': {
    text: '辛い',
    reading: 'からい',
    kana: "カラ'イ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day8/vocab-ea39c25470.mp3': {
    text: '静か',
    reading: 'しずか',
    kana: "シ'ズカ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day11/vocab-3e3a468f49.mp3': {
    text: '年',
    reading: 'ねん',
    kana: "ネ'ン",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day11/gram-571f4aab77.mp3': {
    text: '駅まで歩いて十分かかります。',
    reading: 'えきまで あるいて じゅっぷん かかります。',
    kana: "エ'キマデ/アル'イテ/ジュッ'プン/カカリマ'_ス",
    reason: '時間的十分以 10分解析，保留數詞與助數詞的連接',
    reference: 'voicevox',
  },
  'audio/stage-0/day11/gram-403425683e.mp3': {
    text: '去年、日本へ来ました。',
    reading: 'きょねん、にほんへ きました。',
    kana: "キョ'ネン、ニホ'ンエ/キマ'_シタ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day12/gram-3d64dcd286.mp3': {
    text: '日本でどこがいちばん有名ですか。',
    reading: 'にほんで どこが いちばん ゆうめいですか。',
    kana: "ニホ'ンデ/ド'コガ/イチバン'/ユウメエデ'_スカ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day12/gram-ae7d66f27a.mp3': {
    text: '明日は雨が降ります。',
    reading: 'あしたは あめが ふります。',
    kana: "ア_シタ'ワ/ア'メガ/フリマ'_ス",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day13/gram-ae94d1868b.mp3': {
    text: '私は日本へ行きたいです。',
    reading: 'わたしは にほんへ いきたいです。',
    kana: "ワタシワ'/ニホ'ンエ/イ_キタ'イデ_ス",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day13/gram-c844c661aa.mp3': {
    text: '友達が日本から遊びに来ます。',
    reading: 'ともだちが にほんから あそびに きます。',
    kana: "トモダチガ'/ニホ'ンカラ/アソビニ'/キマ'_ス",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day13/gram-0c62b14d07.mp3': {
    text: '何色のセーターがいいですか。',
    reading: 'なにいろの セーターが いいですか。',
    kana: "ナ'/ニイロノ'/セ'エタアガ/イ'イデ_スカ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day14/vocab-e46af77952.mp3': {
    text: '角',
    reading: 'かど',
    kana: "カ'ド",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day14/dlg-b878c8b158.mp3': {
    text: 'いいえ、歩いて十分ぐらいです。地図を見せましょうか。',
    reading: 'いいえ、あるいて じゅっぷんぐらいです。ちずを みせましょうか。',
    kana: "イイエ'、アル'イテ/ジュップング'ライデ_ス、チ'ズオ/ミセマショ'オカ",
    reason: '時間的十分以 10分解析，保留數詞與助數詞的連接',
    reference: 'voicevox',
  },
  'audio/stage-0/day15/gram-61b3d08d14.mp3': {
    text: 'お仕事は何ですか。',
    reading: 'おしごとは なんですか。',
    kana: "オシ'ゴトワ/ナ'ンデ_スカ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day17/vocab-b3ca164985.mp3': {
    text: '丈夫',
    reading: 'じょうぶ',
    kana: "ジョオブ'",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day18/gram-edc2aaec11.mp3': {
    text: '趣味は何ですか。',
    reading: 'しゅみは なんですか。',
    kana: "シュ'ミワ/ナ'ンデ_スカ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day18/gram-7de4ebddf0.mp3': {
    text: '三日前に日本へ来ました。',
    reading: 'みっかまえに にほんへ きました。',
    kana: "ミッカ'/マ'エニ/ニホ'ンエ/キマ'_シタ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day18/gram-99f724cffc.mp3': {
    text: '初めて日本へ来ました。',
    reading: 'はじめて にほんへ きました。',
    kana: "ハジ'メテ/ニホ'ンエ/キマ'_シタ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day18/dlg-6e3d01793e.mp3': {
    text: '田中さんの趣味は何ですか。',
    reading: 'たなかさんの しゅみは なんですか。',
    kana: "タナカサンノ'/シュ'ミワ/ナ'ンデ_スカ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day19/vocab-2f84000a9e.mp3': {
    text: '二十歳',
    reading: 'はたち',
    kana: "ハ'タチ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day19/vocab-f1522a24ad.mp3': {
    text: '暇',
    reading: 'ひま',
    kana: "ヒマ'",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day19/vocab-a652545274.mp3': {
    text: '昨夜',
    reading: 'ゆうべ',
    kana: "ユウベ'",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day19/vocab-f9be6008f9.mp3': {
    text: '一昨年',
    reading: 'おととし',
    kana: "オト'トシ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day19/vocab-9b49d08af1.mp3': {
    text: '晴れる',
    reading: 'はれる',
    kana: "ハレ'ル",
    reason: '獨立單字採用 Kanjium 收錄的第一個重音型',
    reference: 'kanjium',
  },
  'audio/stage-0/day19/gram-c6c7e820b8.mp3': {
    text: '日本の映画を見たことがありますか。',
    reading: 'にほんの えいがを みた ことが ありますか。',
    kana: "ニホ'ンノ/エエガオ'/ミ'タ/コト'ガ/アリマ'_スカ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day19/gram-d74680227a.mp3': {
    text: '昨夜は早く寝ました。',
    reading: 'ゆうべは はやく ねました。',
    kana: "ユウベワ'/ハヤクネマ'_シタ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day19/gram-534a1ac085.mp3': {
    text: '夕方、雨が降りました。',
    reading: 'ゆうがた、あめが ふりました。',
    kana: "ユウガタ'、ア'メガ/フリマ'_シタ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day19/gram-b41ee6efeb.mp3': {
    text: '再来年、二十歳になります。',
    reading: 'さらいねん、はたちに なります。',
    kana: "サライネン'、ハ'タチニ/ナリマ'_ス",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day20/dlg-a24a06adf0.mp3': {
    text: 'ねえ、明日、暇？',
    reading: 'ねえ、あした、ひま？',
    kana: "ネ'エ、ア_シタ'、ヒマ'？",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day21/gram-8046080653.mp3': {
    text: 'これは日本語で何と言いますか。',
    reading: 'これは にほんごで なんと いいますか。',
    kana: "コレワ'/ニホンゴデ'/ナ'ント/イイマ'_スカ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day21/dlg-06e4a1720a.mp3': {
    text: 'いいえ、まだ見ていません。何と言いましたか。',
    reading: 'いいえ、まだ みて いません。なんと いいましたか。',
    kana: "イイエ'、マ'ダ/ミ'テ/イマセ'ン、ナ'ント/イイマ'_シタカ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day22/gram-52bb64dbe4.mp3': {
    text: 'ミコさんが好きな食べ物は何ですか。',
    reading: 'ミコさんが すきな たべものは なんですか。',
    kana: "ミ'コサンガ/_スキ'ナ/タベモ'ノワ/ナ'ンデ_スカ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day22/gram-431eab3ac3.mp3': {
    text: '日本へ行く日は来週です。',
    reading: 'にほんへ いく ひは らいしゅうです。',
    kana: "ニホ'ンエ/イ_ク'/ヒワ'/ライシュウデ'_ス",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day23/vocab-fd0dc4d9bb.mp3': {
    text: '黄色',
    reading: 'きいろ',
    kana: "キイロ'",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day23/vocab-fa4e8cc20b.mp3': {
    text: '開く',
    reading: 'あく',
    kana: "アク'",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day23/gram-139078cbca.mp3': {
    text: '日本へ行ったとき、写真を撮りました。',
    reading: 'にほんへ いった とき、しゃしんを とりました。',
    kana: "ニホ'ンエ/イッタ'/ト'キ、シャシンオ'/トリマ'_シタ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day23/gram-415ea5fe7f.mp3': {
    text: 'このボタンを押すと、ドアが開きます。',
    reading: 'この ボタンを おすと、ドアが あきます。',
    kana: "コノ'/ボタンオ'/オ_スト'、ド'アガ/アキマ'_ス",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day23/gram-1b68c8135f.mp3': {
    text: 'ドアが開きます。',
    reading: 'ドアが あきます。',
    kana: "ド'アガ/アキマ'_ス",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day23/gram-84114d4553.mp3': {
    text: '窓が開いています。',
    reading: 'まどが あいて います。',
    kana: "マ'ドガ/ア'イテ/イマ'_ス",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day23/gram-6669576b23.mp3': {
    text: '飲み物は何にしますか。',
    reading: 'のみものは なんに しますか。',
    kana: "ノミ'モノワ/ナ'ンニ/シマ'_スカ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day23/dlg-1c2f474ba5.mp3': {
    text: 'いいですね。何の肉ですか。',
    reading: 'いいですね。なんの にくですか。',
    kana: "イ'イデ_スネ、ナ'ンノ/ニク'デ_スカ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day23/dlg-296c83ea53.mp3': {
    text: 'そうですか。飲み物は何にしますか。',
    reading: 'そうですか。のみものは なんに しますか。',
    kana: "ソオデ_ス'カ、ノミ'モノワ/ナ'ンニ/シマ'_スカ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day23/dlg-2d48b40e39.mp3': {
    text: 'ええ。あのドアが開いていますね。閉めましょうか。',
    reading: 'ええ。あの ドアが あいて いますね。しめましょうか。',
    kana: "エ'エ、アノ'/ド'アガ/ア'イテ/イマ'_スネ、シメマショ'オカ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day24/vocab-87cc62aa66.mp3': {
    text: '方',
    reading: 'かた',
    kana: "カタ'",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day24/vocab-d1747882d7.mp3': {
    text: '辺',
    reading: 'へん',
    kana: "ヘン'",
    reason: '獨立單字採用 Kanjium 收錄的第一個重音型',
    reference: 'kanjium',
  },
  'audio/stage-0/day24/gram-f88e0021cd.mp3': {
    text: 'この辺はいい所ですね。',
    reading: 'この へんは いい ところですね。',
    kana: "コノ'/ヘンワ'/イ'イ/トコロデ'_スネ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day24/gram-646fd36410.mp3': {
    text: 'あの方は先生です。',
    reading: 'あの かたは せんせいです。',
    kana: "アノ'/カタ'ワ/センセ'エデ_ス",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day24/dlg-9070e166e0.mp3': {
    text: 'この辺はいい所ですね。',
    reading: 'この へんは いい ところですね。',
    kana: "コノ'/ヘンワ'/イ'イ/トコロデ'_スネ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day24/dlg-92328cfe0b.mp3': {
    text: '田中さんはいい方ですね。',
    reading: 'たなかさんは いい かたですね。',
    kana: "タナカサンワ'/イ'イ/カタ'デ_スネ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day25/vocab-1bd72cfe9f.mp3': {
    text: '温い',
    reading: 'ぬるい',
    kana: "ヌル'イ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-0/day25/gram-329a668d77.mp3': {
    text: '日本語を勉強してから、日本へ行きたいです。',
    reading: 'にほんごを べんきょうして から、にほんへ いきたいです。',
    kana: "ニホンゴオ'/ベンキョオ'/_シテカラ'、ニホ'ンエ/イ_キタ'イデ_ス",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-2/quotes/genshin-raiden.mp3': {
    text: '稲光、すなわち永遠なり。',
    reading: 'いなびかり、すなわち えいえん なり。',
    kana: "イナビ'カリ、スナ'ワチ/エエエンナ'リ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-2/quotes/hsr-yomi.mp3': {
    text: '涙雨 降りて溢るる 渡り川',
    reading: 'なみだあめ ふりて あふるる わたりがわ',
    kana: "ナミダア'メ、フ'リテ/アフルル'、ワタリ'ガワ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-2/quotes/quote-92c0994028.mp3': {
    text: '何だってかまわない。',
    reading: 'なんだって かまわない。',
    kana: "ナ'ンダッテ/カマワ'ナイ",
    reason: '局部指定讀音，保留其他詞的文字解析',
    reference: 'voicevox',
  },
  'audio/stage-2/quotes/quote-d3b5904f92.mp3': {
    text: '時よ止まれ!',
    reading: 'ときよ とまれ!',
    kana: "トキ'ヨ/トマレ'",
    reason: '局部指定時的とき讀音，採用 Kanjium 的時（とき）2型',
    reference: 'kanjium',
  },
  'audio/stage-0/day2/vocab-omiyage.mp3': {
    text: 'お土産',
    reading: 'おみやげ',
    kana: "オミヤゲ'",
    reason: '獨立單字採用 Kanjium 收錄的第一個重音型',
    reference: 'kanjium',
  },
  'audio/stage-0/day3/vocab-fd1e72e419.mp3': {
    text: '郵便局',
    reading: 'ゆうびんきょく',
    kana: "ユウビ'ンキョク",
    reason: '獨立單字採用 Kanjium 收錄的第一個重音型',
    reference: 'kanjium',
  },
  'audio/stage-0/day4/vocab-1a16339dd3.mp3': {
    text: '何時',
    reading: 'なんじ',
    kana: "ナ'ンジ",
    reason: '獨立單字採用 Kanjium 收錄的第一個重音型',
    reference: 'kanjium',
  },
  'audio/stage-0/day5/vocab-aaa56f9597.mp3': {
    text: '何日',
    reading: 'なんにち',
    kana: "ナ'ンニチ",
    reason: '獨立單字採用 Kanjium 收錄的第一個重音型',
    reference: 'kanjium',
  },
  'audio/stage-0/day5/vocab-573820ee1c.mp3': {
    text: '誕生日',
    reading: 'たんじょうび',
    kana: "タンジョ'オビ",
    reason: '獨立單字採用 Kanjium 收錄的第一個重音型',
    reference: 'kanjium',
  },
  'audio/stage-0/day6/vocab-4d58fdaf3f.mp3': {
    text: '昼ご飯',
    reading: 'ひるごはん',
    kana: "ヒルゴ'ハン",
    reason: '獨立單字採用 Kanjium 收錄的第一個重音型',
    reference: 'kanjium',
  },
  'audio/stage-0/day6/vocab-62e36a99d6.mp3': {
    text: '晩ご飯',
    reading: 'ばんごはん',
    kana: "バンゴ'ハン",
    reason: '獨立單字採用 Kanjium 收錄的第一個重音型',
    reference: 'kanjium',
  },
  'audio/stage-0/day7/vocab-9eab124e0d.mp3': {
    text: 'お菓子',
    reading: 'おかし',
    kana: "オカ'シ",
    reason: '獨立單字採用 Kanjium 收錄的第一個重音型',
    reference: 'kanjium',
  },
  'audio/stage-0/day11/vocab-6311c0303f.mp3': {
    text: '毎日',
    reading: 'まいにち',
    kana: "マ'イニチ",
    reason: '獨立單字採用 Kanjium 收錄的第一個重音型',
    reference: 'kanjium',
  },
  'audio/stage-0/day13/vocab-3ac7d9350c.mp3': {
    text: '映画館',
    reading: 'えいがかん',
    kana: "エエガ'カン",
    reason: '獨立單字採用 Kanjium 收錄的第一個重音型',
    reference: 'kanjium',
  },
  'audio/stage-0/day16/vocab-2f8425da21.mp3': {
    text: 'お風呂',
    reading: 'おふろ',
    kana: "オフ'ロ",
    reason: '獨立單字採用 Kanjium 收錄的第一個重音型',
    reference: 'kanjium',
  },
  'audio/stage-0/day17/vocab-56e6b20768.mp3': {
    text: 'お大事に',
    reading: 'おだいじに',
    kana: "オダイジニ'",
    reason: '獨立單字採用 Kanjium 收錄的第一個重音型',
    reference: 'kanjium',
  },
  'audio/stage-0/day23/vocab-1eac199c6c.mp3': {
    text: 'お弁当',
    reading: 'おべんとう',
    kana: "オベントオ'",
    reason: '獨立單字採用 Kanjium 收錄的第一個重音型',
    reference: 'kanjium',
  },
  'audio/stage-0/day23/vocab-cf85435cb7.mp3': {
    text: '昼御飯',
    reading: 'ひるごはん',
    kana: "ヒルゴ'ハン",
    reason: '獨立單字採用 Kanjium 收錄的第一個重音型',
    reference: 'kanjium',
  },
  'audio/stage-0/day23/vocab-1d874b8ece.mp3': {
    text: '晩御飯',
    reading: 'ばんごはん',
    kana: "バンゴ'ハン",
    reason: '獨立單字採用 Kanjium 收錄的第一個重音型',
    reference: 'kanjium',
  },
  'audio/games/genshin/gram-b827d36828.mp3': {
    text: '稲光、すなわち永遠なり。',
    reading: 'いなびかり、すなわち えいえん なり。',
    kana: "イナビ'カリ、スナ'ワチ/エエエンナ'リ",
    reason:
      'T57：沿用同原文已核對的稲光いなびかり讀音與句界覆寫，不沿用引擎的いねみつ。',
    reference: 'voicevox',
  },
  'audio/games/er/gram-7608b70ffd.mp3': {
    text: '"お、お主らの血の味はどんな味がするかのう"..アハハ..',
    reading: 'お、おぬしらの ちの あじは どんな あじが するかのう..アハハ..',
    kana: "オ'、オヌシ'ラノ/チノ'/アジワ'/ド'ンナ/アジガ'/スル'カノオ、ア'ハハ",
    reason:
      'T65：引擎把お主誤讀為おあるじ；改用讀音查詢的オヌシラノ（重音第 3 拍），其餘保留原查詢句界與重音。屬教學朗讀，未模仿原配音。',
    reference: 'voicevox',
  },
  'audio/games/er/gram-e9e1dc8457.mp3': {
    text: 'いつも通りにやればいいよね。',
    reading: 'いつもどおりに やれば いいよね。',
    kana: "イ'ツモ/ドオリニ'/ヤ'レバ/イ'イヨネ",
    reason:
      'T65：引擎把いつも通り的通り誤讀為とおり；應讀どおり。改用讀音文字的引擎查詢（含其句界與重音）。屬教學朗讀，未模仿原配音。',
    reference: 'voicevox',
  },
  'audio/games/er/gram-cf6224aa9e.mp3': {
    text: '神から与えられた金であれば、喜んで受け入れよう。',
    reading: 'かみから あたえられた かねで あれば、よろこんで うけいれよう。',
    kana: "カ'ミカラ/ア'タ/エ'ラレタ/カネデアレ'バ、ヨロ'コンデ/ウ'ケ/イ'レヨオ",
    reason:
      'T65：引擎把金誤讀為きん；此處指錢，讀かね。改用讀音文字的引擎查詢（含其句界與重音）。屬教學朗讀，未模仿原配音。',
    reference: 'voicevox',
  },
  'audio/games/er/gram-8f91cbb59b-fankit-v1.mp3': {
    text: '一狩り始めるか。',
    reading: 'ひとかり はじめるか。',
    kana: "_ヒト'/カ'リ/ハジメル'カ",
    reason:
      'T65：引擎把一狩り誤讀為いちかり；應讀ひとかり。改用讀音文字的引擎查詢（含其句界與重音）。屬教學朗讀，未模仿原配音。',
    reference: 'voicevox',
  },
  'audio/games/er/gram-71c582a513.mp3': {
    text: '必要であれば、何だってします。',
    reading: 'ひつようで あれば、なんだって します。',
    kana: "_ヒツ'/ヨ'オデアレバ、ナ'ンダッテ/シマ'_ス",
    reason:
      'T65：引擎把何だって誤讀為なにだって；應讀なんだって。改用讀音文字的引擎查詢（含其句界與重音）。屬教學朗讀，未模仿原配音。',
    reference: 'voicevox',
  },
  'audio/games/er/gram-fb48846b84-fankit-v1.mp3': {
    text: 'お主らの血の味はどんな味がするかの？',
    reading: 'おぬしらの ちの あじは どんな あじが するかの？',
    kana: "オヌシ'ラノ/チ'ノ/ア'ジワ/ド'ンナ/ア'ジガ/スル'カノ？",
    reason:
      'T65：引擎把お主誤讀為おあるじ；應讀おぬし。改用讀音文字的引擎查詢（含其句界與重音）。屬教學朗讀，未模仿原配音。',
    reference: 'voicevox',
  },
  'audio/games/er/gram-3d1099e213-fankit-v1.mp3': {
    text: '私に…描いてほしいものとか…ある？',
    reading: 'わたしに…かいて ほしい ものとか…ある？',
    kana: "ワタシニ'、カ'/イテホシイ'/モノ'トカ、ア'ル？",
    reason:
      'T65：引擎把描いて讀えがいて；依原音辨識改讀かいて。改用讀音文字的引擎查詢（含其句界與重音）。屬教學朗讀，未模仿原配音。',
    reference: 'voicevox',
  },
  'audio/games/er/gram-683d0c86c8.mp3': {
    text: '今日は他の描き方で絵を描いてみるね。',
    reading: 'きょうは ほかの かきかたで えを かいてみるね。',
    kana: "キョウワ'/ホカノ'/カ'/_キカタデ'/エ'オ/カ'/イテ'/ミ'ルネ",
    reason:
      'T65：引擎把他の誤讀為たの、描く讀えがく；改讀ほかの、かきかた、かいて。改用讀音文字的引擎查詢（含其句界與重音）。屬教學朗讀，未模仿原配音。',
    reference: 'voicevox',
  },
  'audio/games/er/gram-def647c581-fankit-v1.mp3': {
    text: '失せろ、あんたの言うことなんか聞いてる暇はないから。',
    reading: 'うせろ、あんたの いうことなんか きいてる ひまは ないから。',
    kana: "ウ'セロ、ア'ンタノ/イ'ウ/コト'ナンカ/キイテ'ル/ヒマワナイ'カラ",
    reason:
      'T65：引擎把暇誤讀為いとま；口語讀ひま。改用讀音文字的引擎查詢（含其句界與重音）。屬教學朗讀，未模仿原配音。',
    reference: 'voicevox',
  },
  'audio/games/er/gram-94d11f88f8-fankit-v1.mp3': {
    text: '火災に気をつけてください。あとは私が何とかしますから。',
    reading:
      'かさいに きを つけてください。あとは わたしが なんとか しますから。',
    kana: "カ'/サ'イニ/キ'オ/_ツケ'テ/クダサ'イ、ア'トワ/ワタシガ'/ナ'ントカ/シマ'_スカラ",
    reason:
      'T65：引擎把何とか誤讀為なにとか；應讀なんとか。改用讀音文字的引擎查詢（含其句界與重音）。屬教學朗讀，未模仿原配音。',
    reference: 'voicevox',
  },
  'audio/games/er/gram-17896cc742.mp3': {
    text: '何でもやる時は、この手でやらねえとな。',
    reading: 'なんでも やる ときは、この てで やらねえとな。',
    kana: "ナ'ンデモ/ヤル'/ト'キワ、コノ'/テ'デ/ヤラ'ネ/エトナ'",
    reason:
      'T65：引擎把何でも誤讀為なにでも；應讀なんでも。改用讀音文字的引擎查詢（含其句界與重音）。屬教學朗讀，未模仿原配音。',
    reference: 'voicevox',
  },
  'audio/games/er/gram-7f453575aa-fankit-v1.mp3': {
    text: '蝶々を追いかけているの。',
    reading: 'ちょうちょを おいかけて いるの。',
    kana: "チョ'オチョオ/オイカケ'テ/イル'ノ",
    reason:
      'T65：引擎把蝶々讀ちょうちょう；改用口語的ちょうちょ，並把を併回前一個句節（追いかける採第 4 拍下降）。屬教學朗讀，未模仿原配音。',
    reference: 'voicevox',
  },
  'audio/games/er/gram-e7d635ba87.mp3': {
    text: '次は何を割ればいいですか？',
    reading: 'つぎは なにを われば いいですか？',
    kana: "ツ'ギワ/ナ'ニオワレバ/イ'イデ_スカ？",
    reason:
      'T65：引擎把割れば誤讀為われれば；應讀われば。改用讀音文字的引擎查詢（含其句界與重音）。屬教學朗讀，未模仿原配音。',
    reference: 'voicevox',
  },
  'audio/games/er/gram-c06616a3a1.mp3': {
    text: '海を渡る一羽の玄鳥のように。',
    reading: 'うみを わたる いちわの つばめのように。',
    kana: "ウ'ミオ/ワタ'ル/イチ'ワノ/ツバメノ'/ヨ'オニ",
    reason:
      'T65：引擎把玄鳥讀げんちょう；依原音辨識改讀つばめ。改用讀音文字的引擎查詢（含其句界與重音）。屬教學朗讀，未模仿原配音。',
    reference: 'voicevox',
  },
  'audio/games/er/gram-624ded6d7f.mp3': {
    text: '依頼したいものは何だ？',
    reading: 'いらい したい ものは なんだ？',
    kana: "イ'ライ/_シタ'イ/モノ'ワ/ナ'ンダ？",
    reason:
      'T65：引擎把何だ誤讀為なにだ；應讀なんだ。改用讀音文字的引擎查詢（含其句界與重音）。屬教學朗讀，未模仿原配音。',
    reference: 'voicevox',
  },
  'audio/games/er/gram-9eaf08305f-fankit-v1.mp3': {
    text: 'んじゃ、金を稼ぎに行くか。',
    reading: 'んじゃ、かねを かせぎに いくか。',
    kana: "ンジャ'、カネオ'/カセ'ギニ/イ'クカ",
    reason:
      'T65：引擎把金誤讀為きん；此處指錢，讀かね。改用讀音文字的引擎查詢（含其句界與重音）。屬教學朗讀，未模仿原配音。',
    reference: 'voicevox',
  },
};
