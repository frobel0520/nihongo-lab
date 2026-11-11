/** T184：只有社群來源的角色第二批，依 BWIKI 日文欄位補錄加入隊伍／戰技／爆發單句；純喊聲與讀音待裁定的句子不收。原神語音不需配圖。 */
/** @type {import('./genshin-supplement.mjs').SupplementCharacter[]} */
export const genshinSupplementT184 = [
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
        "key": "skill-table-47-0",
        "category": "元素技能",
        "jp": "迷える者よ…",
        "reading": "まよえる ものよ…",
        "ruby": "{迷|まよ}える{者|もの}よ…",
        "zh": "迷途之人啊……",
        "note": "迷える是迷う的文語連體說法，意思是「迷惘的」；者よ的よ是呼喚對象。",
        "choices": [
          "已經找到路的人啊……",
          "請不要跟著我……"
        ],
        "sourceTitle": "元素战技·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-49-0",
        "category": "元素技能",
        "jp": "月光のように。",
        "reading": "げっこうのように。",
        "ruby": "{月光|げっこう}のように。",
        "zh": "如月光一般。",
        "note": "のように是「像……一樣」；句子停在這裡，後面的動作沒有說出來。",
        "choices": [
          "像烈日一般。",
          "月亮已經落下了。"
        ],
        "sourceTitle": "元素战技·其四",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-50-0",
        "category": "元素技能",
        "jp": "清風の祝福を。",
        "reading": "せいふうの しゅくふくを。",
        "ruby": "{清風|せいふう}の{祝福|しゅくふく}を。",
        "zh": "願清風賜予祝福。",
        "note": "清風是清爽的風，讀せいふう；句子停在を，省略了「給予」之類的動詞，是祈願的說法。",
        "choices": [
          "清風帶走了祝福。",
          "不需要風的祝福。"
        ],
        "sourceTitle": "元素战技·其五",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-51-0",
        "category": "元素技能",
        "jp": "皆に祝福あれ。",
        "reading": "みなに しゅくふくあれ。",
        "ruby": "{皆|みな}に{祝福|しゅくふく}あれ。",
        "zh": "願祝福降臨於眾人。",
        "note": "あれ是ある的命令形，用在「願……存在」的祈願句；皆に是對所有人。",
        "choices": [
          "只祝福我一個人。",
          "大家都不需要祝福。"
        ],
        "sourceTitle": "元素战技·其六",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "burst-table-53-0",
        "category": "元素爆發",
        "jp": "林野に永遠の安寧を。",
        "reading": "りんやに えいえんの あんねいを。",
        "ruby": "{林野|りんや}に{永遠|えいえん}の{安寧|あんねい}を。",
        "zh": "願林野永享安寧。",
        "note": "林野是森林與原野，安寧是平靜安穩；句子停在を，是祈願的說法。",
        "choices": [
          "林野永遠不得安寧。",
          "把林野全部燒掉。"
        ],
        "sourceTitle": "元素爆发·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-69-0",
        "category": "編隊加入",
        "jp": "光がなくとも、聖者は正しき道を行く。",
        "reading": "ひかりが なくとも、せいじゃは ただしき みちを いく。",
        "ruby": "{光|ひかり}がなくとも、{聖者|せいじゃ}は{正|ただ}しき{道|みち}を{行|い}く。",
        "zh": "即使沒有光，聖者也會走在正道上。",
        "note": "なくとも是なくても的文語說法；正しき是正しい的文語連體形。",
        "choices": [
          "沒有光，聖者就會迷路。",
          "聖者只走有光的道路。"
        ],
        "sourceTitle": "加入队伍·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-70-0",
        "category": "編隊加入",
        "jp": "自ら望んでここへ来たのだ、気遣いは無用。",
        "reading": "みずから のぞんで ここへ きたのだ、きづかいは むよう。",
        "ruby": "{自|みずか}ら{望|のぞ}んでここへ{来|き}たのだ、{気遣|きづか}いは{無用|むよう}。",
        "zh": "是我自己願意來的，不必顧慮。",
        "note": "自ら是「自己主動」；気遣い是替人著想、顧慮，無用是不需要。",
        "choices": [
          "我是被迫來的，請多照顧。",
          "我不想來，別管我。"
        ],
        "sourceTitle": "加入队伍·其三",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      }
    ]
  },
  {
    "id": "linnea",
    "name": "莉奈婭",
    "nameJa": "リンネア",
    "gender": "female",
    "voice": "hau",
    "referenceUrl": "https://wiki.biligame.com/ys/%E8%8E%89%E5%A5%88%E5%A8%85%E8%AF%AD%E9%9F%B3",
    "sourceSha256": "d511d5e37ab5b94ebf810005b3ac376d106698f909aca620550998114fd9b360",
    "checkedAt": "2026-11-11",
    "lines": [
      {
        "key": "skill-table-46-0",
        "category": "元素技能",
        "jp": "行って、ルミ！",
        "reading": "いって、ルミ！",
        "ruby": "{行|い}って、ルミ！",
        "zh": "去吧，露米！",
        "note": "行って是行く的て形，用來輕輕地下指示；ルミ是她呼喚的對象。",
        "choices": [
          "回來，露米！",
          "等一下，露米！"
        ],
        "sourceTitle": "元素战技·其一",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-47-0",
        "category": "元素技能",
        "jp": "ご挨拶します。",
        "reading": "ごあいさつします。",
        "ruby": "ご{挨拶|あいさつ}します。",
        "zh": "我來打個招呼。",
        "note": "ご挨拶します是「致意、打招呼」的客氣說法，ご…します是謙讓的形式。",
        "choices": [
          "我先告辭了。",
          "請不要跟我說話。"
        ],
        "sourceTitle": "元素战技·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-49-0",
        "category": "元素技能",
        "jp": "これならどうですか？",
        "reading": "これなら どうですか？",
        "ruby": "これならどうですか？",
        "zh": "這個怎麼樣？",
        "note": "これなら是「如果是這個的話」，どうですか是詢問對方覺得如何。",
        "choices": [
          "這個不能給你。",
          "你為什麼這樣做？"
        ],
        "sourceTitle": "元素战技·其四",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-50-0",
        "category": "元素技能",
        "jp": "好き嫌いはダメですよ！",
        "reading": "すききらいは ダメですよ！",
        "ruby": "{好き嫌|すききら}いはダメですよ！",
        "zh": "不可以挑食喔！",
        "note": "好き嫌い是對食物等的偏好與挑剔；ダメ是不行，よ帶提醒語氣。",
        "choices": [
          "喜歡什麼都可以喔！",
          "討厭的可以不吃喔！"
        ],
        "sourceTitle": "元素战技·其五",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-51-0",
        "category": "元素技能",
        "jp": "気を付けて！",
        "reading": "きをつけて！",
        "ruby": "{気|き}を{付|つ}けて！",
        "zh": "小心喔！",
        "note": "気を付けて是気を付ける的て形，提醒對方留意；不是叫對方放心。",
        "choices": [
          "請放心！",
          "不用在意！"
        ],
        "sourceTitle": "元素战技·其六",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "burst-table-52-0",
        "category": "元素爆發",
        "jp": "ティル・ナ・ノーグより捧ぐ——",
        "reading": "ティル・ナ・ノーグより ささぐ——",
        "ruby": "ティル・ナ・ノーグより{捧|ささ}ぐ——",
        "zh": "自「青春之地」獻上——",
        "note": "より是「從……」的書面說法；捧ぐ是捧げる的文語形，意思是獻上。ティル・ナ・ノーグ在同來源的中文欄譯作「青春之地」。",
        "choices": [
          "把青春之地收回來——",
          "我不接受任何禮物——"
        ],
        "sourceTitle": "元素爆发·其一",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "burst-table-53-0",
        "category": "元素爆發",
        "jp": "結晶の如く、光輝け。",
        "reading": "けっしょうのごとく、ひかりかがやけ。",
        "ruby": "{結晶|けっしょう}の{如|ごと}く、{光輝|ひかりかがや}け。",
        "zh": "如結晶般閃耀吧。",
        "note": "の如く是のように的文語說法；光輝け是「發光閃耀」的命令形，來源寫作光輝け，讀ひかりかがやけ。",
        "choices": [
          "像結晶一樣碎裂吧。",
          "光芒已經消失了。"
        ],
        "sourceTitle": "元素爆发·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-70-0",
        "category": "編隊加入",
        "jp": "ルミ！行くよ！",
        "reading": "ルミ！いくよ！",
        "ruby": "ルミ！{行|い}くよ！",
        "zh": "露米！走囉！",
        "note": "行くよ是告知對方「要出發了」，よ帶招呼同行的語氣。",
        "choices": [
          "露米！留在這裡！",
          "露米！你先走吧！"
        ],
        "sourceTitle": "加入队伍·其一",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-72-0",
        "category": "編隊加入",
        "jp": "私？準備おっけーですよ！",
        "reading": "わたし？じゅんび おっけーですよ！",
        "ruby": "{私|わたし}？{準備|じゅんび}おっけーですよ！",
        "zh": "我嗎？準備好了喔！",
        "note": "私？是確認對方是不是在叫自己；おっけー是OK的平假名寫法。",
        "choices": [
          "我嗎？還沒準備好。",
          "你準備好了嗎？"
        ],
        "sourceTitle": "加入队伍·其三",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      }
    ]
  },
  {
    "id": "nefer",
    "name": "奈芙爾",
    "nameJa": "ネフェル",
    "gender": "female",
    "voice": "sayo",
    "referenceUrl": "https://wiki.biligame.com/ys/%E5%A5%88%E8%8A%99%E5%B0%94%E8%AF%AD%E9%9F%B3",
    "sourceSha256": "599d3d4c7f58089d9445a1e97ac68ff9b6d5d9b404d8106032787a9f2696d51b",
    "checkedAt": "2026-11-11",
    "lines": [
      {
        "key": "skill-table-48-0",
        "category": "元素技能",
        "jp": "読めた。",
        "reading": "よめた。",
        "ruby": "{読|よ}めた。",
        "zh": "看穿了。",
        "note": "読めた是読む的可能形過去式，這裡是「看穿了對方的意圖」，不是讀完一本書。",
        "choices": [
          "我看不懂。",
          "書已經讀完了。"
        ],
        "sourceTitle": "元素战技·其一",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-50-0",
        "category": "元素技能",
        "jp": "真実はまるで影。",
        "reading": "しんじつは まるで かげ。",
        "ruby": "{真実|しんじつ}はまるで{影|かげ}。",
        "zh": "真相宛如影子。",
        "note": "まるで是「簡直像」，句尾省略了「一樣」的部分；把真相比作影子。",
        "choices": [
          "真相就在陽光下。",
          "影子裡什麼也沒有。"
        ],
        "sourceTitle": "元素战技·其三",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-51-0",
        "category": "元素技能",
        "jp": "ふっ、なるほど。",
        "reading": "ふっ、なるほど。",
        "ruby": "ふっ、なるほど。",
        "zh": "呵，原來如此。",
        "note": "ふっ是輕笑聲；なるほど表示理解了對方的話或狀況。",
        "choices": [
          "呵，我不明白。",
          "啊，真是抱歉。"
        ],
        "sourceTitle": "元素战技·其四",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-52-0",
        "category": "元素技能",
        "jp": "素直に吐くんだね。",
        "reading": "すなおに はくんだね。",
        "ruby": "{素直|すなお}に{吐|は}くんだね。",
        "zh": "老實招來吧。",
        "note": "吐く在這裡是「招供、說出實話」；んだね是帶命令意味的叮囑，不是在稱讚對方誠實。",
        "choices": [
          "你真是誠實呢。",
          "什麼都不用說了。"
        ],
        "sourceTitle": "元素战技·其五",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-53-0",
        "category": "元素技能",
        "jp": "丸裸にしてやろう。",
        "reading": "まるはだかに してやろう。",
        "ruby": "{丸裸|まるはだか}にしてやろう。",
        "zh": "把你的一切都揭穿吧。",
        "note": "丸裸是一絲不掛，這裡比喻把秘密全部揭開；してやろう是「我來這麼做」的強勢說法。",
        "choices": [
          "我來幫你保守秘密。",
          "請替我穿上外套。"
        ],
        "sourceTitle": "元素战技·其六",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "burst-table-54-0",
        "category": "元素爆發",
        "jp": "欺瞞の叫びよ。",
        "reading": "ぎまんの さけびよ。",
        "ruby": "{欺瞞|ぎまん}の{叫|さけ}びよ。",
        "zh": "欺瞞的呼聲啊。",
        "note": "欺瞞是欺騙；叫び是叫喊，よ是呼喚對象的說法。",
        "choices": [
          "誠實的低語啊。",
          "請安靜地睡吧。"
        ],
        "sourceTitle": "元素爆发·其一",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "burst-table-55-0",
        "category": "元素爆發",
        "jp": "心を覗かせてもらうよ。",
        "reading": "こころを のぞかせてもらうよ。",
        "ruby": "{心|こころ}を{覗|のぞ}かせてもらうよ。",
        "zh": "讓我看看你的心吧。",
        "note": "覗く是窺看；させてもらう是「容我……」，實際上是告知對方自己要這麼做。",
        "choices": [
          "我不想知道你在想什麼。",
          "請你看看我的心。"
        ],
        "sourceTitle": "元素爆发·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-72-0",
        "category": "編隊加入",
        "jp": "精算は仕事が終わってからで構わないよ。",
        "reading": "せいさんは しごとが おわってからで かまわないよ。",
        "ruby": "{精算|せいさん}は{仕事|しごと}が{終|お}わってからで{構|かま}わないよ。",
        "zh": "等工作結束再結帳也沒關係。",
        "note": "精算是結算費用；てからで構わない是「之後再……也可以」。",
        "choices": [
          "請先付清全部費用。",
          "這份工作是免費的。"
        ],
        "sourceTitle": "加入队伍·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-73-0",
        "category": "編隊加入",
        "jp": "暇つぶしにちょうどいい。",
        "reading": "ひまつぶしに ちょうどいい。",
        "ruby": "{暇|ひま}つぶしにちょうどいい。",
        "zh": "正好拿來打發時間。",
        "note": "暇つぶし是打發時間；ちょうどいい是剛剛好。",
        "choices": [
          "我忙得沒有時間。",
          "這實在太浪費時間。"
        ],
        "sourceTitle": "加入队伍·其三",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      }
    ]
  },
  {
    "id": "prune",
    "name": "布倫妮",
    "nameJa": "プルーネ",
    "gender": "female",
    "voice": "sayo",
    "referenceUrl": "https://wiki.biligame.com/ys/%E5%B8%83%E4%BC%A6%E5%A6%AE%E8%AF%AD%E9%9F%B3",
    "sourceSha256": "fa796f53e588b25175a7a76cca59c5bffa70ae44d9885aac9fbf8584684cc349",
    "checkedAt": "2026-11-11",
    "lines": [
      {
        "key": "skill-table-54-0",
        "category": "元素技能",
        "jp": "ど真ん中。",
        "reading": "どまんなか。",
        "ruby": "ど{真|ま}ん{中|なか}。",
        "zh": "正中紅心。",
        "note": "ど是加強語氣的接頭詞，真ん中是正中央；指打中了正中間。",
        "choices": [
          "完全打偏了。",
          "躲到角落去。"
        ],
        "sourceTitle": "元素战技·其一",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-56-0",
        "category": "元素技能",
        "jp": "逃げたい？",
        "reading": "にげたい？",
        "ruby": "{逃|に}げたい？",
        "zh": "想逃嗎？",
        "note": "たい表示想做某事，句尾上揚是在問對方；不是說自己想逃。",
        "choices": [
          "我想逃走。",
          "不准追過來！"
        ],
        "sourceTitle": "元素战技·其三",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-57-0",
        "category": "元素技能",
        "jp": "くらえ！…っとと…",
        "reading": "くらえ！…っとと…",
        "ruby": "くらえ！…っとと…",
        "zh": "接招！……哎唷唷……",
        "note": "くらえ是食らう的命令形；っとと是差點失去平衡時脫口而出的聲音。",
        "choices": [
          "我躲開了！……好險……",
          "請用餐！……慢慢吃……"
        ],
        "sourceTitle": "元素战技·其四",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-58-0",
        "category": "元素技能",
        "jp": "あたしがやる。",
        "reading": "あたしがやる。",
        "ruby": "あたしがやる。",
        "zh": "我來。",
        "note": "あたし是わたし的口語說法；が強調「由我」，やる是做。",
        "choices": [
          "你來做。",
          "誰都不要動。"
        ],
        "sourceTitle": "元素战技·其五",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-59-0",
        "category": "元素技能",
        "jp": "逃がさない。",
        "reading": "にがさない。",
        "ruby": "{逃|に}がさない。",
        "zh": "不會讓你逃的。",
        "note": "逃がす是放走，否定形表示不放過對方；不是說自己不逃。",
        "choices": [
          "我不會逃的。",
          "你可以走了。"
        ],
        "sourceTitle": "元素战技·其六",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "burst-table-60-0",
        "category": "元素爆發",
        "jp": "制裁だ。",
        "reading": "せいさいだ。",
        "ruby": "{制裁|せいさい}だ。",
        "zh": "這是制裁。",
        "note": "制裁是對過錯的懲罰；だ是斷定。",
        "choices": [
          "這是獎勵。",
          "我原諒你。"
        ],
        "sourceTitle": "元素爆发·其一",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "burst-table-62-0",
        "category": "元素爆發",
        "jp": "マークするのだ。",
        "reading": "マークするのだ。",
        "ruby": "マークするのだ。",
        "zh": "做上記號。",
        "note": "マークする是做記號、標定目標；のだ在這裡帶有下指示的語氣。",
        "choices": [
          "把記號擦掉。",
          "不要看這邊。"
        ],
        "sourceTitle": "元素爆发·其三",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-78-0",
        "category": "編隊加入",
        "jp": "魔女ハンター、いつでも行けるぞ。",
        "reading": "まじょハンター、いつでも いけるぞ。",
        "ruby": "{魔女|まじょ}ハンター、いつでも{行|い}けるぞ。",
        "zh": "魔女獵人，隨時可以出發。",
        "note": "いつでも是隨時；行ける是行く的可能形，ぞ強調自己已準備好。",
        "choices": [
          "魔女獵人，今天休息。",
          "魔女獵人，還不能出發。"
        ],
        "sourceTitle": "加入队伍·其一",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-79-0",
        "category": "編隊加入",
        "jp": "先に言っておくけど、おままごとをするつもりは無いからな。",
        "reading": "さきに いっておくけど、おままごとを するつもりは ないからな。",
        "ruby": "{先|さき}に{言|い}っておくけど、おままごとをするつもりは{無|な}いからな。",
        "zh": "話先說在前頭，我可沒打算玩扮家家酒。",
        "note": "言っておく是「事先說好」；おままごと是扮家家酒；つもりは無い是沒有那個打算。",
        "choices": [
          "我們先來玩扮家家酒吧。",
          "我什麼都不想先說。"
        ],
        "sourceTitle": "加入队伍·其二",
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
        "key": "skill-table-46-0",
        "category": "元素技能",
        "jp": "行って、アドン！",
        "reading": "いって、アドン！",
        "ruby": "{行|い}って、アドン！",
        "zh": "去吧，阿咚！",
        "note": "行って是行く的て形，用來下指示；アドン是他呼喚的對象。",
        "choices": [
          "回來，阿咚！",
          "別動，阿咚！"
        ],
        "sourceTitle": "元素战技·其一",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-47-0",
        "category": "元素技能",
        "jp": "今だ！",
        "reading": "いまだ！",
        "ruby": "{今|いま}だ！",
        "zh": "就是現在！",
        "note": "今だ是抓住時機時的呼喊，だ是斷定。",
        "choices": [
          "還太早！",
          "已經太遲了！"
        ],
        "sourceTitle": "元素战技·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-49-0",
        "category": "元素技能",
        "jp": "照準セット。",
        "reading": "しょうじゅんセット。",
        "ruby": "{照準|しょうじゅん}セット。",
        "zh": "瞄準完成。",
        "note": "照準是瞄準；セット是設定好，兩個詞並列成簡短的報告。",
        "choices": [
          "取消瞄準。",
          "目標消失了。"
        ],
        "sourceTitle": "元素战技·其四",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-50-0",
        "category": "元素技能",
        "jp": "逃がさない。",
        "reading": "にがさない。",
        "ruby": "{逃|に}がさない。",
        "zh": "你跑不掉的。",
        "note": "逃がさない是逃がす的否定形，意思是不讓對方逃走。",
        "choices": [
          "我要逃走了。",
          "請快點離開。"
        ],
        "sourceTitle": "元素战技·其五",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-51-0",
        "category": "元素技能",
        "jp": "今が好機！",
        "reading": "いまが こうき！",
        "ruby": "{今|いま}が{好機|こうき}！",
        "zh": "現在正是好機會！",
        "note": "好機是好時機，讀こうき；が強調「就是現在」。",
        "choices": [
          "現在太危險了！",
          "機會已經錯過了！"
        ],
        "sourceTitle": "元素战技·其六",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "burst-table-53-0",
        "category": "元素爆發",
        "jp": "光の裁きを受けよ！",
        "reading": "ひかりの さばきを うけよ！",
        "ruby": "{光|ひかり}の{裁|さば}きを{受|う}けよ！",
        "zh": "接受光的制裁吧！",
        "note": "裁き是審判、制裁；受けよ是受ける的文語命令形。",
        "choices": [
          "光會原諒你的！",
          "我來接受審判！"
        ],
        "sourceTitle": "元素爆发·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-70-0",
        "category": "編隊加入",
        "jp": "分かりました。",
        "reading": "わかりました。",
        "ruby": "{分|わ}かりました。",
        "zh": "我明白了。",
        "note": "分かりました是分かる的禮貌過去式，表示理解並接受對方的話。同一來源項目有兩句，本條是第1句。",
        "choices": [
          "我不明白。",
          "我拒絕。"
        ],
        "sourceTitle": "加入队伍·其一",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-70-1",
        "category": "編隊加入",
        "jp": "これもライトキーパーの務めです。",
        "reading": "これも ライトキーパーの つとめです。",
        "ruby": "これもライトキーパーの{務|つと}めです。",
        "zh": "這也是執燈士的職責。",
        "note": "務め是職責；これも的も表示「這也算在內」。ライトキーパー在同來源的中文欄譯作「執燈士」。同一來源項目有兩句，本條是第2句。",
        "choices": [
          "這不是我的工作。",
          "執燈士今天休息。"
        ],
        "sourceTitle": "加入队伍·其一",
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
        "key": "skill-table-52-0",
        "category": "元素技能",
        "jp": "氷に映るは雪の影。",
        "reading": "こおりに うつるは ゆきの かげ。",
        "ruby": "{氷|こおり}に{映|うつ}るは{雪|ゆき}の{影|かげ}。",
        "zh": "映在冰上的是雪影。",
        "note": "映るは是「映出來的是」的文語省略說法；整句是「映在冰上的，是雪的影子」。",
        "choices": [
          "冰已經全部融化了。",
          "雪上看不見任何影子。"
        ],
        "sourceTitle": "元素战技·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-53-0",
        "category": "元素技能",
        "jp": "さん、はい——",
        "reading": "さん、はい——",
        "ruby": "さん、はい——",
        "zh": "三、起——",
        "note": "さん、はい是帶大家一起開始時的口令，類似「預備，起」。",
        "choices": [
          "全部停下來——",
          "三個人在這裡——"
        ],
        "sourceTitle": "元素战技·其三",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-54-0",
        "category": "元素技能",
        "jp": "踊りましょう。",
        "reading": "おどりましょう。",
        "ruby": "{踊|おど}りましょう。",
        "zh": "來跳舞吧。",
        "note": "ましょう是邀請對方一起做。",
        "choices": [
          "不要再跳了。",
          "我不會跳舞。"
        ],
        "sourceTitle": "元素战技·其四",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-55-0",
        "category": "元素技能",
        "jp": "ピルエット。",
        "reading": "ピルエット。",
        "ruby": "ピルエット。",
        "zh": "單足旋轉。",
        "note": "ピルエット是芭蕾等舞蹈中單腳旋轉的動作名稱，是外來語。",
        "choices": [
          "向前跳躍。",
          "原地鞠躬。"
        ],
        "sourceTitle": "元素战技·其五",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "burst-table-58-0",
        "category": "元素爆發",
        "jp": "氷上に舞い描く——",
        "reading": "ひょうじょうに まいえがく——",
        "ruby": "{氷上|ひょうじょう}に{舞|ま}い{描|えが}く——",
        "zh": "在冰上舞出圖畫——",
        "note": "氷上是冰面上，讀ひょうじょう；舞い描く是一邊舞動一邊描繪。句尾沒有說完。",
        "choices": [
          "在雪地裡休息——",
          "把冰面全部打碎——"
        ],
        "sourceTitle": "元素爆发·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-76-0",
        "category": "編隊加入",
        "jp": "特別公演ですの？",
        "reading": "とくべつこうえんですの？",
        "ruby": "{特別公演|とくべつこうえん}ですの？",
        "zh": "是特別公演嗎？",
        "note": "ですの是大小姐口吻的句尾，這裡加上升語調表示詢問。",
        "choices": [
          "公演已經取消了。",
          "這只是平常的練習。"
        ],
        "sourceTitle": "加入队伍·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-77-0",
        "category": "編隊加入",
        "jp": "今回はどちらへ？",
        "reading": "こんかいは どちらへ？",
        "ruby": "{今回|こんかい}はどちらへ？",
        "zh": "這次要去哪裡？",
        "note": "どちら是どこ的客氣說法；へ後面省略了「去」。",
        "choices": [
          "這次哪裡都不去。",
          "上次去了哪裡？"
        ],
        "sourceTitle": "加入队伍·其三",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      }
    ]
  },
  {
    "id": "sandrone",
    "name": "桑多涅",
    "nameJa": "サンドローネ",
    "gender": "female",
    "voice": "sayo",
    "referenceUrl": "https://wiki.biligame.com/ys/%E6%A1%91%E5%A4%9A%E6%B6%85%E8%AF%AD%E9%9F%B3",
    "sourceSha256": "b442388a6b28a73824ee1bda71493e569ce88d49e4cf9a259b696e577efae751",
    "checkedAt": "2026-11-11",
    "lines": [
      {
        "key": "skill-table-54-0",
        "category": "元素技能",
        "jp": "一休みしたいわ。",
        "reading": "ひとやすみ したいわ。",
        "ruby": "{一休|ひとやす}みしたいわ。",
        "zh": "想休息一下。",
        "note": "一休み是稍微休息；たい表示想做，わ是句尾語氣。",
        "choices": [
          "我還想繼續工作。",
          "你可以去休息了。"
        ],
        "sourceTitle": "元素战技·其一",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-56-0",
        "category": "元素技能",
        "jp": "くだらない。",
        "reading": "くだらない。",
        "ruby": "くだらない。",
        "zh": "無聊。",
        "note": "くだらない是「沒有價值、無聊」，用來輕蔑地評價對方或事情。",
        "choices": [
          "真有意思。",
          "太可怕了。"
        ],
        "sourceTitle": "元素战技·其三",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "skill-table-59-0",
        "category": "元素技能",
        "jp": "もっと速く。",
        "reading": "もっと はやく。",
        "ruby": "もっと{速|はや}く。",
        "zh": "再快一點。",
        "note": "速く是速い的連用形，後面省略了動詞；もっと是「更」。",
        "choices": [
          "再慢一點。",
          "已經夠快了。"
        ],
        "sourceTitle": "元素战技·其六",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "burst-table-61-0",
        "category": "元素爆發",
        "jp": "ティータイムの余興よ。",
        "reading": "ティータイムの よきょうよ。",
        "ruby": "ティータイムの{余興|よきょう}よ。",
        "zh": "是下午茶的餘興節目喔。",
        "note": "余興是助興的表演；よ是告知對方的語氣。",
        "choices": [
          "下午茶時間結束了。",
          "這是很嚴肅的工作。"
        ],
        "sourceTitle": "元素爆发·其二",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "burst-table-62-0",
        "category": "元素爆發",
        "jp": "ふん、滑稽ね。",
        "reading": "ふん、こっけいね。",
        "ruby": "ふん、{滑稽|こっけい}ね。",
        "zh": "哼，真可笑。",
        "note": "ふん是不屑的鼻音；滑稽是可笑、荒唐。",
        "choices": [
          "嗯，真感人。",
          "哼，真可怕。"
        ],
        "sourceTitle": "元素爆发·其三",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-78-0",
        "category": "編隊加入",
        "jp": "数式を検証しないとだわ。",
        "reading": "すうしきを けんしょうしないとだわ。",
        "ruby": "{数式|すうしき}を{検証|けんしょう}しないとだわ。",
        "zh": "得驗證一下算式了。",
        "note": "しないと是「非做不可」的省略說法；だわ是句尾語氣。",
        "choices": [
          "算式不需要驗證。",
          "算式已經全部驗證完了。"
        ],
        "sourceTitle": "加入队伍·其一",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      },
      {
        "key": "join-table-80-0",
        "category": "編隊加入",
        "jp": "行くわよ、ファジオ。",
        "reading": "いくわよ、ファジオ。",
        "ruby": "{行|い}くわよ、ファジオ。",
        "zh": "走了，法潔歐。",
        "note": "行くわよ是告知對方「要走了」的說法；ファジオ是她呼喚的對象。",
        "choices": [
          "留下來，法潔歐。",
          "你先走吧，法潔歐。"
        ],
        "sourceTitle": "加入队伍·其三",
        "sourceCondition": "來源表未細分短按／長按、形態或造型。",
        "variant": "來源未標示造型差分"
      }
    ]
  }
];
