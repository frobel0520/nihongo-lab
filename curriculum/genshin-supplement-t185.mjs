/** T185：只有社群來源的角色最後一批，依 BWIKI 日文欄位補錄加入隊伍／戰技／爆發單句，含使用者裁定讀音的句子；純喊聲不收。原神語音不需配圖。 */
/** @type {import('./genshin-supplement.mjs').SupplementCharacter[]} */
export const genshinSupplementT185 = [
  {
    "id": "columbina",
    "name": "哥倫比婭",
    "nameJa": "コロンビーナ",
    "gender": "female",
    "voice": "zunko",
    "referenceUrl": "https://wiki.biligame.com/ys/%E5%93%A5%E4%BC%A6%E6%AF%94%E5%A8%85%E8%AF%AD%E9%9F%B3",
    "sourceSha256": "f8105f58dae6c22c34de9797a01a207666a2a8e71d5430f699c5fb0b71da4c10",
    "checkedAt": "2026-11-11",
    "lines": [
      {
        "key": "skill-table-57-0",
        "category": "元素技能",
        "jp": "満ちて。",
        "reading": "みちて。",
        "ruby": "{満|み}ちて。",
        "zh": "盈滿吧。",
        "note": "満ちて是満ちる的て形，這裡是輕聲的祈使，意思是充滿。",
        "choices": [
          "退去吧。",
          "已經空了。"
        ],
        "sourceTitle": "元素战技·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-58-0",
        "category": "元素技能",
        "jp": "映して。",
        "reading": "うつして。",
        "ruby": "{映|うつ}して。",
        "zh": "映照吧。",
        "note": "映して是映す的て形，要求把影像映照出來。",
        "choices": [
          "遮起來。",
          "別看這裡。"
        ],
        "sourceTitle": "元素战技·其三",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "burst-table-59-0",
        "category": "元素爆發",
        "jp": "新月が——来る。",
        "reading": "しんげつが——くる。",
        "ruby": "{新月|しんげつ}が——{来|く}る。",
        "zh": "新月——要來了。",
        "note": "新月是剛開始出現的月亮；が標示主語，来る是到來。",
        "choices": [
          "滿月——已經過了。",
          "太陽——升起來了。"
        ],
        "sourceTitle": "元素爆发·其一",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "burst-table-60-0",
        "category": "元素爆發",
        "jp": "三月よ、輝け。",
        "reading": "さんげつよ、かがやけ。",
        "ruby": "{三月|さんげつ}よ、{輝|かがや}け。",
        "zh": "三月啊，閃耀吧。",
        "note": "這裡的三月指三個月亮，不是曆法上的三月，依字音讀さんげつ，未經原配音核對；輝け是輝く的命令形。",
        "choices": [
          "三月已經過去了。",
          "月亮啊，請隱沒吧。"
        ],
        "sourceTitle": "元素爆发·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-77-0",
        "category": "編隊加入",
        "jp": "長旅になるの？",
        "reading": "ながたびに なるの？",
        "ruby": "{長旅|ながたび}になるの？",
        "zh": "會是一趟長途旅行嗎？",
        "note": "長旅是長途旅行；になるの加上升語調是在詢問。",
        "choices": [
          "馬上就回來了。",
          "我不想去旅行。"
        ],
        "sourceTitle": "加入队伍·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-78-0",
        "category": "編隊加入",
        "jp": "うん、一緒に行く。",
        "reading": "うん、いっしょに いく。",
        "ruby": "うん、{一緒|いっしょ}に{行|い}く。",
        "zh": "嗯，我一起去。",
        "note": "うん是口語的「嗯」；一緒に行く是一起去。",
        "choices": [
          "不，我留下來。",
          "嗯，你自己去吧。"
        ],
        "sourceTitle": "加入队伍·其三",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      }
    ]
  },
  {
    "id": "dahlia",
    "name": "塔利雅",
    "nameJa": "ダリア",
    "gender": "male",
    "voice": "nemo2",
    "referenceUrl": "https://wiki.biligame.com/ys/%E5%A1%94%E5%88%A9%E9%9B%85%E8%AF%AD%E9%9F%B3",
    "sourceSha256": "7eb37b6e4e6620aeea30b800d6c4ad28ef9f22aca88bc30614d6085d357583d6",
    "checkedAt": "2026-11-11",
    "lines": [
      {
        "key": "skill-table-45-0",
        "category": "元素技能",
        "jp": "賑やかにいきましょう！",
        "reading": "にぎやかに いきましょう！",
        "ruby": "{賑|にぎ}やかにいきましょう！",
        "zh": "熱熱鬧鬧地上吧！",
        "note": "賑やかに是熱鬧地；いきましょう是提議一起進行。",
        "choices": [
          "請大家保持安靜！",
          "我們悄悄離開吧！"
        ],
        "sourceTitle": "元素战技·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-46-0",
        "category": "元素技能",
        "jp": "水～圧～剣～！",
        "reading": "すい～あつ～けん～！",
        "ruby": "{水|すい}～{圧|あつ}～{剣|けん}～！",
        "zh": "水～壓～劍～！",
        "note": "水圧剣三個字都依字音讀，中間的波浪號是把每個字拉長來喊。",
        "choices": [
          "火～焰～槍～！",
          "把～劍～收～起～來～！"
        ],
        "sourceTitle": "元素战技·其三",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "burst-table-48-0",
        "category": "元素爆發",
        "jp": "風神様のお告げです！",
        "reading": "ふうじんさまの おつげです！",
        "ruby": "{風神様|ふうじんさま}のお{告|つ}げです！",
        "zh": "這是風神大人的啟示！",
        "note": "お告げ是神明傳達的啟示；様是敬稱。",
        "choices": [
          "風神大人什麼也沒說！",
          "這是我自己的主意！"
        ],
        "sourceTitle": "元素爆发·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "burst-table-49-0",
        "category": "元素爆發",
        "jp": "西風よ、我を守りたまえ！",
        "reading": "せいふうよ、われを まもりたまえ！",
        "ruby": "{西風|せいふう}よ、{我|われ}を{守|まも}りたまえ！",
        "zh": "西風啊，請守護我！",
        "note": "たまえ是文語的請求說法；西風在這裡依音讀讀せいふう，未經原配音核對。",
        "choices": [
          "西風啊，請離我遠去！",
          "我來守護西風！"
        ],
        "sourceTitle": "元素爆发·其三",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-67-0",
        "category": "編隊加入",
        "jp": "神の導きのままに。",
        "reading": "かみの みちびきのままに。",
        "ruby": "{神|かみ}の{導|みちび}きのままに。",
        "zh": "謹遵神的指引。",
        "note": "導き是引導；のままに是照著那樣。",
        "choices": [
          "我不相信神的指引。",
          "請神跟著我走。"
        ],
        "sourceTitle": "加入队伍·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-68-0",
        "category": "編隊加入",
        "jp": "さあ、お祈りの時間ですよ！",
        "reading": "さあ、おいのりの じかんですよ！",
        "ruby": "さあ、お{祈|いの}りの{時間|じかん}ですよ！",
        "zh": "來，祈禱的時間到囉！",
        "note": "さあ是催促開始；お祈り是祈禱。",
        "choices": [
          "祈禱已經結束了喔！",
          "現在不可以祈禱喔！"
        ],
        "sourceTitle": "加入队伍·其三",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      }
    ]
  },
  {
    "id": "iansan",
    "name": "伊安珊",
    "nameJa": "イアンサ",
    "gender": "female",
    "voice": "neko-vy",
    "referenceUrl": "https://wiki.biligame.com/ys/%E4%BC%8A%E5%AE%89%E7%8F%8A%E8%AF%AD%E9%9F%B3",
    "sourceSha256": "7ff8c0af2f1579091e0ff9d46cbb8dcc11e1166a27102ee1ac12919ce75bc387",
    "checkedAt": "2026-11-11",
    "lines": [
      {
        "key": "skill-table-48-0",
        "category": "元素技能",
        "jp": "雷のごとく！",
        "reading": "かみなりのごとく！",
        "ruby": "{雷|かみなり}のごとく！",
        "zh": "如雷霆一般！",
        "note": "のごとく是のように的文語說法；雷在這裡讀かみなり，未經原配音核對，這個字也有いかずち的讀法。",
        "choices": [
          "像微風一樣！",
          "雷聲已經停了！"
        ],
        "sourceTitle": "元素战技·其一",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-49-0",
        "category": "元素技能",
        "jp": "もっと速く！もっと強く！",
        "reading": "もっと はやく！もっと つよく！",
        "ruby": "もっと{速|はや}く！もっと{強|つよ}く！",
        "zh": "更快！更強！",
        "note": "速く、強く是形容詞的連用形，後面省略了動詞；もっと表示程度更高。",
        "choices": [
          "慢一點！輕一點！",
          "已經夠快夠強了！"
        ],
        "sourceTitle": "元素战技·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "burst-table-51-0",
        "category": "元素爆發",
        "jp": "動け！",
        "reading": "うごけ！",
        "ruby": "{動|うご}け！",
        "zh": "動起來！",
        "note": "動け是動く的命令形。",
        "choices": [
          "不准動！",
          "休息吧！"
        ],
        "sourceTitle": "元素爆发·其一",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "burst-table-52-0",
        "category": "元素爆發",
        "jp": "カウント、スタート！",
        "reading": "カウント、スタート！",
        "ruby": "カウント、スタート！",
        "zh": "計數，開始！",
        "note": "カウント是計數，スタート是開始，都是外來語。",
        "choices": [
          "計數，結束！",
          "暫停一下！"
        ],
        "sourceTitle": "元素爆发·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-67-0",
        "category": "編隊加入",
        "jp": "あったまってきたな！",
        "reading": "あったまってきたな！",
        "ruby": "あったまってきたな！",
        "zh": "身體熱起來了！",
        "note": "あったまる是あたたまる的口語說法；てきた表示狀態逐漸出現。",
        "choices": [
          "身體變冷了！",
          "還沒有開始熱身！"
        ],
        "sourceTitle": "加入队伍·其一",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-68-0",
        "category": "編隊加入",
        "jp": "訓練を受けたいやつはいないか？",
        "reading": "くんれんを うけたい やつは いないか？",
        "ruby": "{訓練|くんれん}を{受|う}けたいやつはいないか？",
        "zh": "有沒有人想接受訓練？",
        "note": "受けたい是想接受；やつ是口語的「傢伙、人」；いないか是「有沒有」的問法。",
        "choices": [
          "沒有人需要訓練了。",
          "誰想逃避訓練？"
        ],
        "sourceTitle": "加入队伍·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      }
    ]
  },
  {
    "id": "ifa",
    "name": "伊法",
    "nameJa": "イファ",
    "gender": "male",
    "voice": "ryusei",
    "referenceUrl": "https://wiki.biligame.com/ys/%E4%BC%8A%E6%B3%95%E8%AF%AD%E9%9F%B3",
    "sourceSha256": "d9174ca3bd9fea89da87e44590829daa2f1d90d5d71285f4e14cca453f731cff",
    "checkedAt": "2026-11-11",
    "lines": [
      {
        "key": "skill-table-48-0",
        "category": "元素技能",
        "jp": "風向きに気を付けろ！",
        "reading": "かざむきに きをつけろ！",
        "ruby": "{風向|かざむ}きに{気|き}を{付|つ}けろ！",
        "zh": "注意風向！",
        "note": "風向き是風的方向，讀かざむき；気を付けろ是命令形。",
        "choices": [
          "不用管風向！",
          "風已經停了！"
        ],
        "sourceTitle": "元素战技·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-50-1",
        "category": "元素技能",
        "jp": "がんばれ！",
        "reading": "がんばれ！",
        "ruby": "がんばれ！",
        "zh": "加油！",
        "note": "がんばれ是「加油」的命令形說法，用來替對方打氣。同一來源項目的前半是カクーク的聲音，本條只收伊法說的這一句。",
        "choices": [
          "放棄吧！",
          "別過來！"
        ],
        "sourceTitle": "元素战技·其四",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "burst-table-52-0",
        "category": "元素爆發",
        "jp": "恨みっこなしだぞ！",
        "reading": "うらみっこなしだぞ！",
        "ruby": "{恨|うら}みっこなしだぞ！",
        "zh": "可別互相記恨喔！",
        "note": "恨みっこなし是「彼此都不記恨」的口語說法；だぞ是叮囑。",
        "choices": [
          "我一定會記恨的！",
          "你恨我也沒關係嗎？"
        ],
        "sourceTitle": "元素爆发·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "burst-table-53-0",
        "category": "元素爆發",
        "jp": "おっと、逃がすかよ！",
        "reading": "おっと、にがすかよ！",
        "ruby": "おっと、{逃|に}がすかよ！",
        "zh": "哎呀，哪能讓你跑了！",
        "note": "逃がすかよ是反問語氣，意思是「怎麼可能放你走」；おっと是發現狀況時的感嘆。",
        "choices": [
          "哎呀，你快逃吧！",
          "好吧，放你一馬！"
        ],
        "sourceTitle": "元素爆发·其三",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-69-0",
        "category": "編隊加入",
        "jp": "救急キットはバッチリだ。",
        "reading": "きゅうきゅうキットは バッチリだ。",
        "ruby": "{救急|きゅうきゅう}キットはバッチリだ。",
        "zh": "急救包準備萬全。",
        "note": "救急キット是急救包；バッチリ是「萬無一失」的口語。",
        "choices": [
          "急救包忘記帶了。",
          "急救包已經用完了。"
        ],
        "sourceTitle": "加入队伍·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-70-0",
        "category": "編隊加入",
        "jp": "いい旅になるといいな。",
        "reading": "いい たびに なると いいな。",
        "ruby": "いい{旅|たび}になるといいな。",
        "zh": "希望會是一趟好旅程。",
        "note": "…といいな是「要是……就好了」的願望說法。",
        "choices": [
          "這趟旅程一定很糟。",
          "旅行已經結束了。"
        ],
        "sourceTitle": "加入队伍·其三",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      }
    ]
  },
  {
    "id": "ineffa",
    "name": "伊涅芙",
    "nameJa": "イネファ",
    "gender": "female",
    "voice": "sayo",
    "referenceUrl": "https://wiki.biligame.com/ys/%E4%BC%8A%E6%B6%85%E8%8A%99%E8%AF%AD%E9%9F%B3",
    "sourceSha256": "4e983a42dbf535e198585bdfe72742884d616e79962e1aeca7033b0c89921118",
    "checkedAt": "2026-11-11",
    "lines": [
      {
        "key": "skill-table-51-0",
        "category": "元素技能",
        "jp": "絶縁障壁、展開。",
        "reading": "ぜつえんしょうへき、てんかい。",
        "ruby": "{絶縁障壁|ぜつえんしょうへき}、{展開|てんかい}。",
        "zh": "絕緣屏障，展開。",
        "note": "絶縁是隔絕電流，障壁是屏障；展開是展開、啟動。",
        "choices": [
          "絕緣屏障，解除。",
          "導電模式，啟動。"
        ],
        "sourceTitle": "元素战技·其一",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-52-0",
        "category": "元素技能",
        "jp": "掃除対象、ロックオン。",
        "reading": "そうじたいしょう、ロックオン。",
        "ruby": "{掃除対象|そうじたいしょう}、ロックオン。",
        "zh": "清掃目標，鎖定。",
        "note": "掃除対象是要清掃的對象；ロックオン是鎖定目標的外來語。",
        "choices": [
          "清掃目標，解除。",
          "清掃工作，完成。"
        ],
        "sourceTitle": "元素战技·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "burst-table-55-0",
        "category": "元素爆發",
        "jp": "殲滅モード。",
        "reading": "せんめつモード。",
        "ruby": "{殲滅|せんめつ}モード。",
        "zh": "殲滅模式。",
        "note": "殲滅是徹底消滅；モード是模式。",
        "choices": [
          "待機模式。",
          "修復模式。"
        ],
        "sourceTitle": "元素爆发·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "burst-table-56-0",
        "category": "元素爆發",
        "jp": "塵となってください。",
        "reading": "ちりと なってください。",
        "ruby": "{塵|ちり}となってください。",
        "zh": "請化為塵埃。",
        "note": "塵是灰塵；となる是「變成」，てください是禮貌的要求。",
        "choices": [
          "請把灰塵擦掉。",
          "請不要弄髒地板。"
        ],
        "sourceTitle": "元素爆发·其三",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-71-0",
        "category": "編隊加入",
        "jp": "暖機完了。",
        "reading": "だんきかんりょう。",
        "ruby": "{暖機完了|だんきかんりょう}。",
        "zh": "暖機完成。",
        "note": "暖機是機器啟動前的預熱；完了是完成。",
        "choices": [
          "暖機失敗。",
          "準備關機。"
        ],
        "sourceTitle": "加入队伍·其一",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-72-0",
        "category": "編隊加入",
        "jp": "何を掃除いたしましょう？",
        "reading": "なにを そうじ いたしましょう？",
        "ruby": "{何|なに}を{掃除|そうじ}いたしましょう？",
        "zh": "要為您清掃什麼呢？",
        "note": "いたしましょう是しましょう的謙讓說法。",
        "choices": [
          "清掃已經全部完成。",
          "您為什麼要打掃？"
        ],
        "sourceTitle": "加入队伍·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      }
    ]
  },
  {
    "id": "jahoda",
    "name": "雅珂達",
    "nameJa": "ヤフォダ",
    "gender": "female",
    "voice": "tsumugi",
    "referenceUrl": "https://wiki.biligame.com/ys/%E9%9B%85%E7%8F%82%E8%BE%BE%E8%AF%AD%E9%9F%B3",
    "sourceSha256": "639972486f77e9cc95b13c47f58ad83ac0e7298b244f7f286204b03cfc08e331",
    "checkedAt": "2026-11-11",
    "lines": [
      {
        "key": "skill-table-46-0",
        "category": "元素技能",
        "jp": "獲物はあんただ！",
        "reading": "えものは あんただ！",
        "ruby": "{獲物|えもの}はあんただ！",
        "zh": "獵物就是你！",
        "note": "獲物是獵物；あんた是あなた的口語說法。",
        "choices": [
          "獵物已經逃走了！",
          "我才是獵物！"
        ],
        "sourceTitle": "元素战技·其一",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-47-0",
        "category": "元素技能",
        "jp": "正々堂々奪う！",
        "reading": "せいせいどうどう うばう！",
        "ruby": "{正々堂々|せいせいどうどう}{奪|うば}う！",
        "zh": "光明正大地搶！",
        "note": "正々堂々是光明正大；奪う是搶奪。",
        "choices": [
          "偷偷摸摸地還回去！",
          "我什麼都不拿！"
        ],
        "sourceTitle": "元素战技·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "burst-table-49-0",
        "category": "元素爆發",
        "jp": "全部あたいのだ！",
        "reading": "ぜんぶ あたいのだ！",
        "ruby": "{全部|ぜんぶ}あたいのだ！",
        "zh": "全部都是我的！",
        "note": "あたい是わたし的俚俗說法；のだ在這裡表示「是……的東西」。",
        "choices": [
          "全部都給你！",
          "這些都不是我的！"
        ],
        "sourceTitle": "元素爆发·其一",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "burst-table-50-0",
        "category": "元素爆發",
        "jp": "さあ、とってこい！",
        "reading": "さあ、とってこい！",
        "ruby": "さあ、とってこい！",
        "zh": "來，去拿回來！",
        "note": "とってこい是叫對方去把東西拿回來的命令說法。",
        "choices": [
          "來，放回去！",
          "別去拿！"
        ],
        "sourceTitle": "元素爆发·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-64-0",
        "category": "編隊加入",
        "jp": "任せてくれ。",
        "reading": "まかせてくれ。",
        "ruby": "{任|まか}せてくれ。",
        "zh": "交給我吧。",
        "note": "任せてくれ是請對方把事情交給自己。",
        "choices": [
          "我做不到。",
          "你自己來吧。"
        ],
        "sourceTitle": "加入队伍·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-65-0",
        "category": "編隊加入",
        "jp": "期待していいぞ。",
        "reading": "きたいして いいぞ。",
        "ruby": "{期待|きたい}していいぞ。",
        "zh": "可以期待喔。",
        "note": "していい是「可以這麼做」；ぞ帶自信的語氣。",
        "choices": [
          "別抱任何期待。",
          "我很期待你的表現。"
        ],
        "sourceTitle": "加入队伍·其三",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      }
    ]
  },
  {
    "id": "nicole",
    "name": "尼可",
    "nameJa": "ニコ",
    "gender": "female",
    "voice": "hau",
    "referenceUrl": "https://wiki.biligame.com/ys/%E5%B0%BC%E5%8F%AF%E8%AF%AD%E9%9F%B3",
    "sourceSha256": "4ca6d7cf0643a60df5c8bd3321a9775584c465c18c1f8c98c1972d9feb997f9e",
    "checkedAt": "2026-11-11",
    "lines": [
      {
        "key": "skill-table-48-0",
        "category": "元素技能",
        "jp": "拒絶。",
        "reading": "きょぜつ。",
        "ruby": "{拒絶|きょぜつ}。",
        "zh": "拒絕。",
        "note": "拒絶是斷然拒絕，單獨一個名詞作為呼喊。",
        "choices": [
          "接受。",
          "歡迎。"
        ],
        "sourceTitle": "元素战技·其一",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-50-0",
        "category": "元素技能",
        "jp": "叛逆。",
        "reading": "はんぎゃく。",
        "ruby": "{叛逆|はんぎゃく}。",
        "zh": "叛逆。",
        "note": "叛逆是反抗、背叛，讀はんぎゃく。",
        "choices": [
          "服從。",
          "和解。"
        ],
        "sourceTitle": "元素战技·其三",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "burst-table-52-0",
        "category": "元素爆發",
        "jp": "あたしはずっと、その中にいる。",
        "reading": "あたしは ずっと、そのなかに いる。",
        "ruby": "あたしはずっと、その{中|なか}にいる。",
        "zh": "我一直都在那裡面。",
        "note": "ずっと是一直；その中にいる是身在其中。",
        "choices": [
          "我從來不在那裡面。",
          "我馬上就要離開了。"
        ],
        "sourceTitle": "元素爆发·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "burst-table-53-0",
        "category": "元素爆發",
        "jp": "「この心をもって天に代えよ」。",
        "reading": "「このこころを もって てんに かえよ」。",
        "ruby": "「この{心|こころ}をもって{天|てん}に{代|か}えよ」。",
        "zh": "「以此心代替上天」。",
        "note": "をもって是「用、憑藉」的書面說法；代えよ是代える的文語命令形。引號表示她在引述一句話。",
        "choices": [
          "「把這顆心交還給上天」。",
          "「上天不需要任何人的心」。"
        ],
        "sourceTitle": "元素爆发·其三",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      }
    ]
  },
  {
    "id": "zibai",
    "name": "茲白",
    "nameJa": "兹白",
    "gender": "female",
    "voice": "zunko",
    "referenceUrl": "https://wiki.biligame.com/ys/%E5%85%B9%E7%99%BD%E8%AF%AD%E9%9F%B3",
    "sourceSha256": "0f2b82bcf679a5c1851c1dd3556bb6a3a031917e8a39a31a8201577428dc3c15",
    "checkedAt": "2026-11-11",
    "lines": [
      {
        "key": "skill-table-50-0",
        "category": "元素技能",
        "jp": "聞く価値もない。",
        "reading": "きく かちも ない。",
        "ruby": "{聞|き}く{価値|かち}もない。",
        "zh": "連聽的價值都沒有。",
        "note": "価値もない是「連……的價值都沒有」。",
        "choices": [
          "很值得一聽。",
          "請再說一次。"
        ],
        "sourceTitle": "元素战技·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-51-0",
        "category": "元素技能",
        "jp": "払い清めましょう。",
        "reading": "はらいきよめましょう。",
        "ruby": "{払|はら}い{清|きよ}めましょう。",
        "zh": "來拂除淨化吧。",
        "note": "払い清める是拂去污穢使之潔淨。",
        "choices": [
          "就這樣放著吧。",
          "把這裡弄髒吧。"
        ],
        "sourceTitle": "元素战技·其三",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "burst-table-52-0",
        "category": "元素爆發",
        "jp": "過客守りし仙光よ、来たれ。",
        "reading": "かかく まもりし せんこうよ、きたれ。",
        "ruby": "{過客|かかく}{守|まも}りし{仙光|せんこう}よ、{来|き}たれ。",
        "zh": "守護旅人的仙光啊，降臨吧。",
        "note": "過客是過路的旅人，讀かかく，未經原配音核對；守りし是「守護了的」的文語說法；来たれ是文語的「來吧」。",
        "choices": [
          "仙光啊，請離開旅人。",
          "旅人啊，請熄滅仙光。"
        ],
        "sourceTitle": "元素爆发·其一",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "burst-table-53-0",
        "category": "元素爆發",
        "jp": "洞察と知恵が、律令を生む。",
        "reading": "どうさつと ちえが、りつりょうを うむ。",
        "ruby": "{洞察|どうさつ}と{知恵|ちえ}が、{律令|りつりょう}を{生|う}む。",
        "zh": "洞察與智慧，孕育出律令。",
        "note": "洞察是看透事物；律令是法令規範，讀りつりょう；生む是產生。",
        "choices": [
          "律令會妨礙智慧。",
          "沒有智慧也能訂立律令。"
        ],
        "sourceTitle": "元素爆发·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-71-0",
        "category": "編隊加入",
        "jp": "どこへ行くの？",
        "reading": "どこへ いくの？",
        "ruby": "どこへ{行|い}くの？",
        "zh": "要去哪裡？",
        "note": "どこへ是往哪裡；の加上升語調是在詢問。",
        "choices": [
          "哪裡都不去。",
          "你從哪裡來？"
        ],
        "sourceTitle": "加入队伍·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-72-0",
        "category": "編隊加入",
        "jp": "空が晴れ渡っている…遠出日和ね。",
        "reading": "そらが はれわたっている…とおでびよりね。",
        "ruby": "{空|そら}が{晴|は}れ{渡|わた}っている…{遠出日和|とおでびより}ね。",
        "zh": "天空一片晴朗……是適合出遠門的好天氣呢。",
        "note": "晴れ渡る是整片天空放晴；遠出日和是適合出遠門的天氣，日和在這裡讀びより。",
        "choices": [
          "天空烏雲密布……不適合出門呢。",
          "雨下個不停……留在家裡吧。"
        ],
        "sourceTitle": "加入队伍·其三",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      }
    ]
  },
  {
    "id": "lohen",
    "name": "洛恩",
    "nameJa": "ローエン",
    "gender": "male",
    "voice": "ryusei",
    "referenceUrl": "https://wiki.biligame.com/ys/%E6%B4%9B%E6%81%A9%E8%AF%AD%E9%9F%B3",
    "sourceSha256": "2a15e8b235668609dd3907b5cb71fc291e97e76585e2d018c6c328e4c39d1f7e",
    "checkedAt": "2026-11-11",
    "lines": [
      {
        "key": "join-table-76-0",
        "category": "編隊加入",
        "jp": "先陣を切れって？いいぜ。",
        "reading": "せんじんを きれって？いいぜ。",
        "ruby": "{先陣|せんじん}を{切|き}れって？いいぜ。",
        "zh": "要我打頭陣？行啊。",
        "note": "先陣を切る是打頭陣；って是引述對方的話；いいぜ是爽快答應。",
        "choices": [
          "要我殿後？不要。",
          "誰來打頭陣？"
        ],
        "sourceTitle": "加入队伍·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-77-0",
        "category": "編隊加入",
        "jp": "今回は俺が殿を務めてやるよ。",
        "reading": "こんかいは おれが しんがりを つとめてやるよ。",
        "ruby": "{今回|こんかい}は{俺|おれ}が{殿|しんがり}を{務|つと}めてやるよ。",
        "zh": "這次由我來殿後。",
        "note": "殿在這裡讀しんがり，指隊伍最後負責斷後的人；務めてやる是「我來擔任」。",
        "choices": [
          "這次我要打頭陣。",
          "這次我不參加。"
        ],
        "sourceTitle": "加入队伍·其三",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      }
    ]
  },
  {
    "id": "lauma",
    "name": "菈烏瑪",
    "nameJa": "ラウマ",
    "gender": "female",
    "voice": "zunko",
    "referenceUrl": "https://wiki.biligame.com/ys/%E8%8F%88%E4%B9%8C%E7%8E%9B%E8%AF%AD%E9%9F%B3",
    "sourceSha256": "4a7be4121e484821a44cb7e5d6871a34a419dc46ea562e23b3beca97d6590238",
    "checkedAt": "2026-11-11",
    "lines": [
      {
        "key": "skill-table-46-0",
        "category": "元素技能",
        "jp": "蒼樹の加護を。",
        "reading": "そうじゅの かごを。",
        "ruby": "{蒼樹|そうじゅ}の{加護|かご}を。",
        "zh": "願蒼樹加護。",
        "note": "蒼樹不是一般辭書詞，依字音讀そうじゅ，未經原配音核對；加護是神靈的保佑，句子停在を，是祈願的說法。",
        "choices": [
          "蒼樹已經枯萎了。",
          "不需要任何保佑。"
        ],
        "sourceTitle": "元素战技·其一",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "burst-table-52-0",
        "category": "元素爆發",
        "jp": "霜月よ、永遠なれ。",
        "reading": "しもつきよ、えいえんなれ。",
        "ruby": "{霜月|しもつき}よ、{永遠|えいえん}なれ。",
        "zh": "霜月啊，願你永恆。",
        "note": "霜月在這裡讀しもつき，未經原配音核對；なれ是なる的命令形，用作祈願。",
        "choices": [
          "霜月啊，快點結束吧。",
          "永遠不要再有月亮。"
        ],
        "sourceTitle": "元素爆发·其一",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      }
    ]
  },
  {
    "id": "odette",
    "name": "奧黛塔",
    "nameJa": "オデット",
    "gender": "female",
    "voice": "zunko",
    "referenceUrl": "https://wiki.biligame.com/ys/%E5%A5%A5%E9%BB%9B%E5%A1%94%E8%AF%AD%E9%9F%B3",
    "sourceSha256": "f343a8be44138ff7c8cf99b4e2da04093ae90d85ec338291945a00cfdc728ae1",
    "checkedAt": "2026-11-11",
    "lines": [
      {
        "key": "burst-table-59-0",
        "category": "元素爆發",
        "jp": "雪鳥の礼賛をご覧なさい。",
        "reading": "ゆきどりの らいさんを ごらんなさい。",
        "ruby": "{雪鳥|ゆきどり}の{礼賛|らいさん}をご{覧|らん}なさい。",
        "zh": "請看雪鳥的禮讚。",
        "note": "雪鳥在這裡讀ゆきどり，未經原配音核對；礼賛是讚頌；ご覧なさい是「請看」的說法。",
        "choices": [
          "請不要看雪鳥。",
          "雪鳥已經飛走了。"
        ],
        "sourceTitle": "元素爆发·其三",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      }
    ]
  },
  {
    "id": "illuga",
    "name": "葉洛亞",
    "nameJa": "イルーガ",
    "gender": "male",
    "voice": "nemo2",
    "referenceUrl": "https://wiki.biligame.com/ys/%E5%8F%B6%E6%B4%9B%E4%BA%9A%E8%AF%AD%E9%9F%B3",
    "sourceSha256": "7bb834a05dd7754f1b7e5b6470cc3bf9c21cc4fb18f4cafe3db87edaf8f06245",
    "checkedAt": "2026-11-11",
    "lines": [
      {
        "key": "burst-table-52-0",
        "category": "元素爆發",
        "jp": "灯火の下に、陰りなし！",
        "reading": "ともしびの もとに、かげりなし！",
        "ruby": "{灯火|ともしび}の{下|もと}に、{陰|かげ}りなし！",
        "zh": "燈火之下，沒有陰霾！",
        "note": "灯火在這裡讀ともしび，未經原配音核對；の下に讀のもとに，是「在……之下」；陰りなし是沒有陰影。",
        "choices": [
          "燈火之下，一片黑暗！",
          "把燈火全部熄滅！"
        ],
        "sourceTitle": "元素爆发·其一",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-71-0",
        "category": "編隊加入",
        "jp": "僕が、君の灯火となりましょう。",
        "reading": "ぼくが、きみの ともしびと なりましょう。",
        "ruby": "{僕|ぼく}が、{君|きみ}の{灯火|ともしび}となりましょう。",
        "zh": "讓我成為你的燈火吧。",
        "note": "となる是「成為」，ましょう在這裡是主動提出；灯火讀ともしび，未經原配音核對。",
        "choices": [
          "請你成為我的燈火。",
          "我不需要任何燈火。"
        ],
        "sourceTitle": "加入队伍·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      }
    ]
  }
];
