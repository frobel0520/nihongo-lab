# T159：新增300個尚未覆蓋義項SVG

基準main `fcdf578dc2eb6c8a364a5dc22c17b0a737ce8966`／已發布[PR #164](https://github.com/frobel0520/nihongo-lab/pull/164)。開工時核對：無未合併PR，T158之後沒有新分支或遠端提交，雲端worker收到的300詞義指令沒有可接續的成果；本輪自行從最新缺圖清單選詞，未重複開發。

新增300個未覆蓋義項／300張原創CC0 SVG；300主要映射＋136舊圖共用＋627新圖共用＝1063筆新增。763筆共用中751筆跨來源課程／教材單元、12筆同課。全站5909卡保持；SVG 1014→1314，有圖3184→4247、缺圖2725→1662，覆蓋53.88%→71.87%（+17.99百分點）。分類為N5 551／711、通用3486／4500、動畫60／80、遊戲150／618。資產數、義項數與有圖卡片數是三個不同的數字，不互相代換。

## 來源與語義界線

全部由本專案以幾何路徑自行編繪，CC0-1.0；沿用224×168、圓角線條、固定色盤，以及揭示答案後56×42的輔助圖。顏色詞（紅、青、白、黑、黃、茶色）要表達顏色本身，因此另用藍、黃、深咖啡與白四個色值，只用於這些顏色詞與曜日週曆，不改整體風格。不含外部素材、作品角色、截圖、字型、文字標籤或emoji；打勾、箭頭與圈選沿用既有圖形慣例。所有SVG都通過測試，確認沒有script、foreignObject、text、image或外部href。

構圖分流（人工分類）：abstract 90、concrete 81、verb 65、expression 29、quantity 16、adjective 11、adverb 8。抽象詞與時間詞沒有留到最後處理：

- 昨天／明天／前天／後天：同一條曆條，用箭頭方向區分，過去格打勾、未來格是待辦空圈。
- 上午／下午：天空弧線的左半段與右半段。
- 七個曜日：週曆中的位置，加上曜日名稱的月火水木金土日元素。
- 數字一～十用十格框計數；數東西的「一個～三個」用實物。
- 否定命令（別動、不要靠近、休想逃走）用停止手勢、界線與打叉的動向箭頭表達，不只畫動作本身。

小尺寸自查後修正了這些圖：

- 傍晚的影子方向，家人腳底對齊與兄姊身高。
- 寵物外形，弄丟的口袋線索，開動／吃飽的合掌與空碗。
- 放下的劍形，勾小指，文字字形。
- 持續的時間條，「之後」的餐點（原本看起來像笑臉），腳下的坑，望樓人物被裁切。
- 掛上改畫外套；「音」改成鼓聲傳到耳朵，避免與響起的鬧鐘重複。

另有四項改用既有圖共用，不另畫：ペン用萬年筆圖、「跟我來」用引導圖、物主用所有圖、注意用小心圖。空出的名額改畫提把、堵住、鐵柵升起與鐵柵落下。

## 共用審查

新圖共用依同詞、同讀、同譯的簽章，逐張讀對話上下文後核准。不同譯法或不同詞面但同義者另行列出並寫理由，例如赤い↔赤、今晩↔今夜、依頼人↔依頼主、締め切り↔期限。

舊圖共用136筆，例如：掲示→貼り紙、資料→書類、残量→残り、引き継ぎ→引継ぎ、救出／助け出す→救援、迎え→迎える，以及遊戲台詞「任せて」「準備完了」「出発しよう」等。runtime仍只核對凍結的ID／word／reading／zh四欄，候選清單不做字面自動擴散。

測試抓到兩個主要詞條選錯卡：消える與残る的群組首卡分別是「資料消失」與「備份」語境。產品提交前已改以`general-listening-145:消える`（結界消失）與`general-listening-99:残る`（決定留下）為主要詞條，原本兩張卡保留暫緩。T157測試原本斷言魔力恢復卡無圖；本輪給它恢復圖，測試改為「仍不得使用返回原地圖」，保留原本的意圖。

T158暫緩的54筆重評：17筆本輪解決（約束10、古い4、聞く2、急ぐ1），37筆保留，包括鍵、短い、少し、口、教える、強い／弱い、前等，具體理由見audit。本輪新增的暫緩如下：

- `general-listening-79:残る`（残る／留下）候選stayingbehind：備份課境中的留下對象未確認是人留守，暫不套留守圖。
- `general-listening-97:残る`（残る／留下）候選stayingbehind：打開才發現一課留下的主體未確認為人，暫不套留守圖。
- `general-listening-78:似る`（似る／相似）候選resembling：鐘與笛的聲音相似是聽覺相似，新圖為外形輪廓相似，保留。
- `general-listening-118:似る`（似る／相似）候選resembling：鈴聲相似是聽覺義，與披風外形相似圖不同。
- `general-listening-79:消える`（消える／消失）候選vanishing：資料檔案消失是數位資料，不用實體水晶淡出圖。
- `general-listening-02:聞く`（聞く／聽；詢問）候選listening/askingquestion：聽／詢問多義卡沒有對話線索，無法確認取哪一義。
- `general-listening-70:聞く`（聞く／聽；詢問）候選listening/askingquestion：同上，保留。
- `general-listening-36:次`（次／下次；下一個）候選nextinline：下次（next time）是時間上的下回，不套路線上的下一站。
- `general-listening-57:早い`（早い／早；快）候選fast：分組完成較快是效率，車輛速度圖不足以表達。
- `general-listening-23:残る`（残る／留下；剩下）候選stayingbehind/remaining：留下；剩下多義卡、例句是留晚餐（残す），兩圖皆不確定。
- `general-listening-127:残る`（残る／留存）候選remaining：腳印留存是痕跡殘留，非物品剩下。
- `general-listening-180:残る`（残る／留下；剩餘）候選stayingbehind：留下；剩餘多義且無對話線索。
- `general-listening-121:続く`（続く／延續）候選continuing：足跡往深處延續是空間延伸，非時間持續。
- `general-listening-03:先に`（先に／先做；先行）候選firstbefore：先做；先行多義且無對話線索。
- `game-card:game:genshin:nahida:join:bcfe58b69e`（ずいぶん待ってたのよ。／我可是等了好久喔。）候選keptyouwaiting：說話者是等待的一方，視角與「讓你久等」相反。
- `game-card:game:genshin:gaming:skill:fe90a48ac9`（大当たりだぜ！／大中獎啦！）候選hittingtarget：可能指抽中大獎而非射中目標，保留。
- `general-listening-93:灯り`（灯り／燈光）候選lightsignal：丘上紅燈是待機信號燈，與青色出發燈號同圖會混淆顏色語義。
- `general-listening-107:当番表`（当番表／值班表）候選schedulechart：值班表重點是人員輪值，行程表圖以活動為主，保留。
- `general-listening-37:気持ち`（気持ち／心意；心情）候選emotions：心意（感謝之情）不是情緒範疇圖。
- `general-listening-54:気持ち`（気持ち／心意）候選emotions：送禮的心意不是喜怒哀樂。
- `general-listening-43:代わり`（代わり／代替）候選substitute：點餐時改換食材，與人員替代圖不同。
- `general-listening-73:詳しい`（詳しい／熟悉的；詳細的）候選detailed：熟悉道具（人很懂）不是路線詳細圖。
- `general-listening-176:宛名`（宛名／收件人姓名）候選addressee：收件人姓名是寫在封面的名字，不是收件的人。
- `general-listening-58:空く`（空く／變空；不擁擠）候選seatbecomesfree：讀すく的不擁擠與あく的空出座位讀音不同。
- `general-listening-59:集める`（集める／召集；收集）候選assemblingpeople：召集需有召集者，集合圖只畫到場者。

## 文件

[完整1063筆映射CSV](vocab-illustration-t159-mappings.csv)、[300資產bytes／SHA／授權](vocab-illustration-t159-assets.json)、[逐筆核准／暫緩／T158暫緩重評](vocab-illustration-t159-sharing-audit.json)、[驗證證據](vocab-illustration-t159-validation.json)。分組圖覽：[第1組](previews/t159-group-1.png)、[第2組](previews/t159-group-2.png)、[第3組](previews/t159-group-3.png)、[第4組](previews/t159-group-4.png)、[第5組](previews/t159-group-5.png)、[第6組](previews/t159-group-6.png)、[第7組](previews/t159-group-7.png)、[第8組](previews/t159-group-8.png)、[第9組](previews/t159-group-9.png)、[第10組](previews/t159-group-10.png)、[第11組](previews/t159-group-11.png)、[第12組](previews/t159-group-12.png)、[第13組](previews/t159-group-13.png)、[第14組](previews/t159-group-14.png)、[第15組](previews/t159-group-15.png)、[第16組](previews/t159-group-16.png)、[第17組](previews/t159-group-17.png)、[第18組](previews/t159-group-18.png)、[第19組](previews/t159-group-19.png)、[第20組](previews/t159-group-20.png)、[第21組](previews/t159-group-21.png)、[第22組](previews/t159-group-22.png)、[第23組](previews/t159-group-23.png)、[第24組](previews/t159-group-24.png)、[第25組](previews/t159-group-25.png)。

## 300個主要詞義

| # | 類別／構圖 | 詞面／讀音／原翻譯 | 精確ID | SVG | 構圖與界線 |
|---|---|---|---|---|---|
| 1 | n5／abstract | 夕方／ゆうがた／傍晚 | `stage0-day19:夕方` | `eveningdusk.svg` | 夕陽半沉到地平線、天邊暖色，人物帶長影走向亮燈的家，表傍晚時段而非深夜。 |
| 2 | n5／abstract | 昨日／きのう／昨天 | `stage0-day4:昨日` | `yesterday.svg` | 五日曆條中間為今天，箭頭往左一格且格內打勾，表已過的前一天；不寫星期或日期文字。 |
| 3 | n5／abstract | 明日／あした／明天 | `stage0-day4:明日` | `tomorrow.svg` | 同一曆條由今天往右一格，格內是待辦空圈，表尚未到的下一天，與昨天方向相反。 |
| 4 | n5／abstract | 一昨日／おととい／前天 | `stage0-day11:一昨日` | `daybeforeyesterday.svg` | 由今天跨過昨天，往左第二格打勾，跳兩格的長弧表前天。 |
| 5 | n5／abstract | あさって／あさって／後天 | `stage0-day11:あさって` | `dayaftertomorrow.svg` | 由今天跨過明天，往右第二格為待辦空圈，長弧表後天。 |
| 6 | n5／abstract | 今日／きょう／今天 | `stage0-day4:今日` | `todaymarker.svg` | 曆條中間格有太陽並被圈起，孩子站在下方指著該格，表今天就是這一天。 |
| 7 | n5／abstract | 午前／ごぜん／上午 | `stage0-day4:午前` | `morninghalf.svg` | 天空弧線以正午直線分半，左半段（日出到正午）粗線標示且太陽在左側，表上午。 |
| 8 | n5／abstract | 午後／ごご／下午 | `stage0-day4:午後` | `afternoonhalf.svg` | 同一天空弧線以正午分半，右半段（正午到日落）標示且太陽在右側，表下午。 |
| 9 | n5／abstract | 今朝／けさ／今天早上 | `stage0-day6:今朝` | `thismorning.svg` | 左方日曆的當天格被圈，右方剛升起的太陽與早餐杯，表今天的早上而非任一早晨。 |
| 10 | n5／abstract | 朝／あさ／早上 | `stage0-day4:朝` | `morningtime.svg` | 太陽剛從山頭升起、鳥起飛，人物在屋外伸展手臂，表早晨時段。 |
| 11 | n5／abstract | 昼／ひる／中午 | `stage0-day4:昼` | `middayhour.svg` | 太陽在正上方，人物腳下影子極短，手持便當，表中午。 |
| 12 | n5／abstract | 夜／よる／夜晚 | `stage0-day19:夜` | `nighttime.svg` | 深色天空有月亮與星星，房屋窗戶亮燈，表夜晚而非傍晚。 |
| 13 | n5／abstract | 今／いま／現在 | `stage0-day4:今` | `presentmoment.svg` | 時間線左側淡色已過、右側虛線未來，人物站在中間被圈起的點上，頭上時鐘，表現在這一刻。 |
| 14 | n5／abstract | 時間／じかん／時間 | `stage0-day4:時間` | `timeduration.svg` | 沙漏上半流向下半，旁邊時鐘以扇形標出經過的一段，表時間長度而非某一時刻。 |
| 15 | n5／concrete | 声／こえ／聲音 | `stage0-day16:声` | `voice.svg` | 左方人物張口說話，音波弧線從口傳到右方聽者耳邊，表人的聲音，不是器物聲響。 |
| 16 | n5／adjective | 赤／あか／紅色 | `stage0-day23:赤` | `redcolor.svg` | 大型紅色色卡被圈起，旁有紅蘋果與紅旗，以不同紅色物件共同表紅色。 |
| 17 | n5／abstract | 色／いろ／顏色 | `stage0-day13:色` | `colors.svg` | 調色盤上有多種顏色的色塊與一支畫筆，表顏色這個範疇，不指定單一色。 |
| 18 | n5／adjective | 緑／みどり／綠色 | `stage0-day13:緑` | `greencolor.svg` | 綠色色卡被圈起，旁有一株綠葉植物，表綠色。 |
| 19 | n5／adjective | 青／あお／藍色、綠色 | `stage0-day23:青` | `aocolor.svg` | 藍天色卡與號誌的青燈亮起並列，表日語「青」可指藍色或綠色一例。 |
| 20 | n5／adjective | 白／しろ／白色 | `stage0-day23:白` | `whitecolor.svg` | 白色色卡被圈起，旁有白雪人與雪粒，表白色。 |
| 21 | n5／adjective | 黒／くろ／黑色 | `stage0-day23:黒` | `blackcolor.svg` | 黑色色卡被圈起，旁有黑貓剪影，表黑色。 |
| 22 | n5／adjective | 黄色／きいろ／黃色 | `stage0-day23:黄色` | `yellowcolor.svg` | 黃色色卡被圈起，旁有黃色香蕉與小雞，表黃色。 |
| 23 | n5／adjective | 茶色／ちゃいろ／咖啡色 | `stage0-day13:茶色` | `browncolor.svg` | 咖啡色色卡被圈起，旁有咖啡色提包，表咖啡色（茶色）。 |
| 24 | n5／abstract | 月曜日／げつようび／星期一 | `stage0-day5:月曜日` | `monday.svg` | 星期日起算的七格週曆第二格（月曜日）被選，放大格內是月亮，以曜日名稱的月作線索。 |
| 25 | n5／abstract | 火曜日／かようび／星期二 | `stage0-day5:火曜日` | `tuesday.svg` | 週曆第三格（火曜日）被選，放大格內是火焰，以曜日名稱的火作線索。 |
| 26 | n5／abstract | 水曜日／すいようび／星期三 | `stage0-day5:水曜日` | `wednesday.svg` | 週曆第四格（水曜日）被選，放大格內是水滴與水面，以曜日名稱的水作線索。 |
| 27 | n5／abstract | 木曜日／もくようび／星期四 | `stage0-day5:木曜日` | `thursday.svg` | 週曆第五格（木曜日）被選，放大格內是一棵樹，以曜日名稱的木作線索。 |
| 28 | n5／abstract | 金曜日／きんようび／星期五 | `stage0-day5:金曜日` | `friday.svg` | 週曆第六格（金曜日）被選，放大格內是一疊金幣，以曜日名稱的金作線索。 |
| 29 | n5／abstract | 土曜日／どようび／星期六 | `stage0-day5:土曜日` | `saturday.svg` | 週曆最後一格（土曜日）被選，放大格內是土堆與新芽，以曜日名稱的土作線索。 |
| 30 | n5／abstract | 日曜日／にちようび／星期日 | `stage0-day5:日曜日` | `sunday.svg` | 週曆第一格（日曜日）被選，放大格內是太陽，以曜日名稱的日作線索。 |
| 31 | n5／abstract | 天気／てんき／天氣 | `stage0-day12:天気` | `weatherconditions.svg` | 天空分成晴、陰、雨三格，人物抬手遮眼望天，表天氣狀態而非單一晴天。 |
| 32 | n5／abstract | 誰／だれ／誰 | `stage0-day10:誰` | `whoquestion.svg` | 門後半透明玻璃映出看不清的人影，門前人物歪頭思考，泡泡中只有虛線人頭，表不知是誰。 |
| 33 | n5／quantity | 一つ／ひとつ／一個（數東西） | `stage0-day11:一つ` | `onething.svg` | 托盤上只有一顆蘋果，表數東西時的一個；不寫數字。 |
| 34 | n5／quantity | 二つ／ふたつ／兩個 | `stage0-day11:二つ` | `twothings.svg` | 托盤上有兩顆相同蘋果，間距清楚，表兩個。 |
| 35 | n5／quantity | 三つ／みっつ／三個 | `stage0-day11:三つ` | `threethings.svg` | 托盤上有三顆相同蘋果，表三個；以實物數量而非數字呈現。 |
| 36 | n5／abstract | 来週／らいしゅう／下週 | `stage0-day11:来週` | `nextweek.svg` | 三列週曆中間列有今天紅點，箭頭往下指向整列填色的下一週，表下週。 |
| 37 | n5／abstract | 先週／せんしゅう／上週 | `stage0-day11:先週` | `lastweek.svg` | 三列週曆中間列有今天紅點，箭頭往上指向填色且已打勾的上一週，表上週。 |
| 38 | n5／abstract | 今週／こんしゅう／這週 | `stage0-day11:今週` | `thisweek.svg` | 三列週曆中，含今天紅點的中間一整列被填色，表這一週。 |
| 39 | n5／abstract | 次／つぎ／下一個 | `stage0-day14:次` | `nextinline.svg` | 路線上車輛停在目前一站，箭頭指向被圈起的下一站，表下一個。 |
| 40 | n5／concrete | 父／ちち／（我的）父親 | `stage0-day20:父` | `myfather.svg` | 有標記的「我」小孩旁，留鬍子的高大成人被圈出，表自己的父親；不寫稱謂文字。 |
| 41 | n5／concrete | 母／はは／（我的）母親 | `stage0-day20:母` | `mymother.svg` | 有標記的「我」小孩旁，盤髮的成人被圈出，表自己的母親。 |
| 42 | n5／concrete | 兄／あに／（我的）哥哥 | `stage0-day20:兄` | `olderbrother.svg` | 「我」小孩旁比我高的短髮少年被圈出，表自己的哥哥。 |
| 43 | n5／concrete | 姉／あね／（我的）姊姊 | `stage0-day20:姉` | `oldersister.svg` | 「我」小孩旁比我高、綁馬尾的少女被圈出，表自己的姊姊。 |
| 44 | n5／concrete | 弟／おとうと／（我的）弟弟 | `stage0-day20:弟` | `youngerbrother.svg` | 「我」小孩旁比我矮的短髮幼童被圈出，表自己的弟弟。 |
| 45 | n5／concrete | 妹／いもうと／（我的）妹妹 | `stage0-day20:妹` | `youngersister.svg` | 「我」小孩旁比我矮、綁雙髮的幼童被圈出，表自己的妹妹。 |
| 46 | n5／abstract | 東／ひがし／東 | `stage0-day10:東` | `east.svg` | 羅盤紅針朝上為北，粗箭頭指向右側，該側地平線升起朝陽，表東方。 |
| 47 | n5／abstract | 西／にし／西 | `stage0-day10:西` | `west.svg` | 羅盤紅針朝上為北，粗箭頭指向左側，該側夕陽半沉，表西方。 |
| 48 | n5／abstract | 南／みなみ／南 | `stage0-day10:南` | `south.svg` | 羅盤紅針朝上為北，粗箭頭由中心指向下方南側，表南方。 |
| 49 | n5／abstract | 北／きた／北 | `stage0-day10:北` | `north.svg` | 羅盤紅色針尖朝上，粗箭頭也指向上方北極星，表北方。 |
| 50 | n5／quantity | 一／いち／一 | `stage0-day4:一` | `numberone.svg` | 十格框中只放一個紅色計數圓片，表數字一。 |
| 51 | n5／quantity | 二／に／二 | `stage0-day4:二` | `numbertwo.svg` | 十格框中放兩個計數圓片，表數字二。 |
| 52 | n5／quantity | 三／さん／三 | `stage0-day4:三` | `numberthree.svg` | 十格框中放三個計數圓片，表數字三。 |
| 53 | n5／quantity | 四／し／四（也唸「よん」） | `stage0-day4:四` | `numberfour.svg` | 十格框中放四個計數圓片，表數字四。 |
| 54 | n5／quantity | 五／ご／五 | `stage0-day4:五` | `numberfive.svg` | 十格框上排五格全滿，表數字五。 |
| 55 | n5／quantity | 六／ろく／六 | `stage0-day4:六` | `numbersix.svg` | 十格框上排滿五個、下排一個，表數字六。 |
| 56 | n5／quantity | 七／しち／七（也唸「なな」） | `stage0-day4:七` | `numberseven.svg` | 十格框上排滿五個、下排兩個，表數字七。 |
| 57 | n5／quantity | 八／はち／八 | `stage0-day4:八` | `numbereight.svg` | 十格框上排滿五個、下排三個，表數字八。 |
| 58 | n5／quantity | 九／きゅう／九（也唸「く」） | `stage0-day4:九` | `numbernine.svg` | 十格框只剩最後一格空著，表數字九。 |
| 59 | n5／quantity | 十／じゅう／十 | `stage0-day4:十` | `numberten.svg` | 十格框十格全滿，表數字十。 |
| 60 | n5／concrete | 戸／と／（拉）門、窗 | `stage0-day22:戸` | `slidingdoor.svg` | 和式格子拉門一扇沿軌道滑向旁邊，橫向箭頭表拉開，區分推開的門。 |
| 61 | general／concrete | 持ち手／もちて／提把 | `general-listening-151:持ち手` | `carryhandle.svg` | 箱子上方的提把被圈出，握拳的手從上方抓住提把，焦點是握持部位而非整個箱子。 |
| 62 | n5／concrete | ボタン／ボタン／按鈕、鈕扣 | `stage0-day22:ボタン` | `buttonpanel.svg` | 控制面板上有數個圓形按鈕，手指按下其中一個，表按鈕一例；鈕扣義不在圖中。 |
| 63 | n5／concrete | ペット／ペット／寵物 | `stage0-day18:ペット` | `pet.svg` | 小狗在家中的墊子上搖尾，飼主蹲下撫摸牠的頭，旁有食碗，表飼養的寵物。 |
| 64 | n5／concrete | ページ／ページ／頁 | `stage0-day19:ページ` | `bookpage.svg` | 攤開的書中右頁正被翻起一角，被翻的那一頁加框，表書頁而非整本書。 |
| 65 | n5／concrete | 背／せ／身高、背 | `stage0-day16:背` | `heightmeasure.svg` | 人物背靠刻度牆，頭頂放著直尺標出身高，垂直雙箭頭從腳到頭，表身高。 |
| 66 | n5／abstract | 結婚／けっこん／結婚（結婚します） | `stage0-day15:結婚` | `wedding.svg` | 花拱門下兩位穿禮服的人牽手並交換戒指，表結婚，不限定性別與文化。 |
| 67 | n5／abstract | 生まれる／うまれる／出生（て形：生まれて） | `stage0-day15:生まれる` | `newborn.svg` | 嬰兒床中裹著布的新生兒，成人雙手輕扶，旁有光點，表剛出生。 |
| 68 | n5／abstract | 夏休み／なつやすみ／暑假 | `stage0-day17:夏休み` | `summerbreak.svg` | 日曆中連續一大段被填色，旁有艷陽、海灘傘與泳圈，表暑假這段長假期。 |
| 69 | n5／verb | 無くす／なくす／弄丟、遺失 | `stage0-day17:無くす` | `losingitem.svg` | 人物繼續往前走，口袋位置是虛線空框，錢包沿虛線掉在身後地上，表不知不覺弄丟。 |
| 70 | n5／expression | お大事に／おだいじに／請保重（對生病的人說） | `stage0-day17:お大事に` | `getwell.svg` | 探望者把花遞給躺在床上、含體溫計的病人，表對病人說保重。 |
| 71 | n5／expression | おはよう／おはよう／早安（對朋友；對長輩說「おはようございます」） | `stage0-day18:おはよう` | `morninggreeting.svg` | 日出時兩人相遇互相揮手打招呼，表早上的問候。 |
| 72 | n5／expression | こんにちは／こんにちは／午安、你好 | `stage0-day18:こんにちは` | `daytimegreeting.svg` | 太陽高掛頭頂時兩人互相揮手打招呼，表白天的問候。 |
| 73 | n5／expression | こんばんは／こんばんは／晚安（見面時說） | `stage0-day18:こんばんは` | `eveninggreeting.svg` | 月亮與亮著的路燈下兩人相遇揮手，表晚上見面時的問候，不是道別。 |
| 74 | n5／expression | さようなら／さようなら／再見 | `stage0-day18:さようなら` | `farewellwave.svg` | 兩人背向各自往外走、回頭揮手，左右反向箭頭，表分開時說再見。 |
| 75 | n5／expression | いただきます／いただきます／我開動了（吃飯前說） | `stage0-day7:いただきます` | `beforemeal.svg` | 人物在冒熱氣的飯菜前雙手合十、筷子仍放在筷架上，表開動前的問候。 |
| 76 | n5／expression | ごちそうさま／ごちそうさま／謝謝招待、吃飽了（吃完說「ごちそうさまでした」） | `stage0-day7:ごちそうさま` | `aftermeal.svg` | 同一人吃完後低頭合十鞠躬，碗已空並把筷子橫放在碗上，表吃飽後的致謝。 |
| 77 | n5／quantity | 大勢／おおぜい／很多人 | `stage0-day11:大勢` | `crowd.svg` | 許多人密集聚在同一處，前後排重疊，表很多人而非精確數字。 |
| 78 | games／expression | 散れ！／ちれ！／散開！ | `game-card:game:genshin:kujousara:skill:2ce5d65790` | `scatter.svg` | 原本聚在中央的人往四面八方散開，放射狀箭頭，表「散開」命令。 |
| 79 | games／expression | いらっしゃい！／いらっしゃい！／歡迎光臨！ | `game-card:game:genshin:candace:skill:05de4836dc` | `shopwelcome.svg` | 店員在櫃檯後張開雙手迎客，客人剛推門進來、門鈴搖動，表歡迎光臨。 |
| 80 | games／verb | 武器を捨てろ！／ぶきを すてろ！／放下武器！ | `game-card:game:genshin:chevreuse:skill:e3c181ce3a` | `dropweapon.svg` | 人物張開空著的雙手，劍（劍身、護手與握柄）從手邊往下掉，向下箭頭，表放下武器。 |
| 81 | games／expression | 手伝って。／てつだって。／幫我一下。 | `game-card:game:genshin:chiori:skill:fa3bbc3639` | `askforhelp.svg` | 人物抱著過重的箱子腳步不穩，轉頭向旁人伸手求助，表「幫我一下」。 |
| 82 | general／verb | 知らせる／しらせる／通知 | `general-listening-65:知らせる` | `informingothers.svg` | 說話者的泡泡畫著已開的門，兩位聽者心中出現同一扇開門，表把消息告知他人。 |
| 83 | general／verb | 塞がる／ふさがる／堵住 | `general-listening-122:塞がる` | `blockedpath.svg` | 通道中段被落下的岩塊堵住，行人停在前方、路線箭頭被截斷，表道路堵住。 |
| 84 | games／expression | 動くな。／うごくな。／別動。 | `game-card:game:genshin:prune:skill:f69935c83c` | `dontmove.svg` | 說話者伸出停止手掌，對面人物抬腳的動向箭頭被打叉，表命令「別動」。 |
| 85 | games／expression | 近づかないで。／ちかづかないで。／不要靠近。 | `game-card:game:genshin:kachina:burst:2bdef2fb77` | `keepaway.svg` | 人物舉手掌示意，地上畫出界線，對面靠近者的前進箭頭在線前被打叉，表「不要靠近」。 |
| 86 | games／expression | 怖がらないで。／こわがらないで。／不要害怕。 | `game-card:game:genshin:layla:burst:324d2775be` | `dontbeafraid.svg` | 縮著發抖的孩子旁，大人蹲下把手搭在肩上安撫，暗處小影子在遠方，表「不要害怕」。 |
| 87 | games／expression | 風邪ひくなよ。／かぜひくなよ。／小心別著涼喔。 | `game-card:game:genshin:kaeya:burst:dd14518c54` | `dontcatchcold.svg` | 寒風雪中，一人把圍巾繞到對方脖子上，表叮嚀小心別著涼。 |
| 88 | games／expression | 火に気をつけろ。／ひに きをつけろ。／小心火。 | `game-card:game:genshin:thoma:skill:0709b6de1c` | `mindthefire.svg` | 營火燃燒，人物伸手示意旁人後退保持距離，表「小心火」。 |
| 89 | games／expression | 寝てもいいか？／ねても いいか？／可以睡覺嗎？ | `game-card:game:genshin:sayu:join:327a6a84d5` | `maysleep.svg` | 人物揉眼打哈欠指向床，泡泡中是床與月亮，望向對方徵詢，表「可以睡覺嗎」。 |
| 90 | games／expression | 戻れ。／もどれ。／回來。 | `game-card:game:genshin:qiqi:skill:cb8e2a4097` | `comeback.svg` | 呼喚者手放嘴邊、另一手招回，遠處人物沿迴轉箭頭往回走，表「回來」。 |
| 91 | games／expression | 出かけるのか？／でかけるのか？／要出門嗎？ | `game-card:game:genshin:ifa:join:a3ad14521d` | `goingout.svg` | 人物提包穿好鞋站在打開的大門口正要外出，屋內另一人望著詢問，表「要出門嗎」。 |
| 92 | games／expression | 百発百中！／ひゃっぱつひゃくちゅう！／百發百中！ | `game-card:game:genshin:amber:burst:dedfd4424f` | `everyshothits.svg` | 標靶中心插滿多支箭，旁有弓，表百發百中。 |
| 93 | games／concrete | アフタヌーンティーの時間。／アフタヌーンティーの じかん。／下午茶時間。 | `game-card:game:genshin:lynette:join:9de099f66c` | `afternoontea.svg` | 茶壺、茶杯與三層點心架並列，表下午茶時間的茶點。 |
| 94 | games／verb | 蝶々を追いかけているの。／ちょうちょを おいかけて いるの。／我在追蝴蝶。 | `game-card:game:er:vanya:selection-voice:879e357465:879e357465` | `chasingbutterfly.svg` | 孩子拿捕蟲網向前奔跑，追著前方飛舞的蝴蝶，虛線軌跡在前，表追蝴蝶。 |
| 95 | games／verb | 一緒に探索しよう。／いっしょに たんさくしよう。／一起去探索吧。 | `game-card:game:genshin:albedo:join:7f0f2274c7` | `exploringtogether.svg` | 兩人一人提燈、一人攤開地圖，一起走進洞窟入口，表結伴探索。 |
| 96 | games／expression | 元気出してよ！／げんきだしてよ！／打起精神嘛！ | `game-card:game:genshin:barbara:skill:407970e1bf` | `cheerup.svg` | 垂頭坐著的人身邊，朋友拍背並舉拳打氣，表鼓勵對方打起精神。 |
| 97 | games／expression | 良薬は口に苦し。／りょうやくは くちに にがし。／良藥苦口。 | `game-card:game:genshin:baizhu:skill:28fe528c5c` | `bittermedicine.svg` | 人物皺眉喝下一杯藥，苦味波線在口邊，身旁同時出現康復光點，表良藥苦口。 |
| 98 | games／expression | 逃がすか！／にがすか！／休想逃走！ | `game-card:game:genshin:jahoda:skill:1ac88e7ed5` | `wontletescape.svg` | 逃跑者奔向出口，出口柵門已落下，追者在後伸手，表「休想逃走」。 |
| 99 | games／expression | 騒ぐな。／さわぐな。／不准喧嘩。 | `game-card:game:genshin:neuvillette:skill:6c83de37ce` | `quietdown.svg` | 吵鬧的兩人旁有聲浪線，一人豎指在唇前並舉掌示意，表「不准喧嘩」。 |
| 100 | games／verb | 加速するよ！／かそくするよ！／要加速囉！ | `game-card:game:genshin:mualani:skill:2328361d0f` | `accelerating.svg` | 跑者身後速度線由短變長，前方三個箭頭逐漸增大，表加速。 |
| 101 | games／verb | 手をつなぎましょう～／てを つなぎましょう～／牽起手吧～ | `game-card:game:genshin:nahida:skill:b808cc1c3c` | `holdinghands.svg` | 兩人並肩站著把手牽在一起，牽手處被圈出，表牽手。 |
| 102 | games／expression | 待たせちゃった？／またせちゃった？／讓你久等了？ | `game-card:game:genshin:venti:join:351649ddc8` | `keptyouwaiting.svg` | 一人在時鐘下等了許久，另一人匆忙跑來並合手道歉，表「讓你久等了嗎」。 |
| 103 | games／expression | 呼んだか？／よんだか？／叫我嗎？ | `game-card:game:genshin:ororon:join:8949898ea6` | `didyoucall.svg` | 呼喚者手靠嘴，被叫的人轉身指向自己，表「叫我嗎」。 |
| 104 | games／verb | 出動だ。／しゅつどうだ。／出動！ | `game-card:game:genshin:chevreuse:join:73b3b5d34c` | `deploying.svg` | 小隊從據點門口列隊衝出，旗手在前，向前大箭頭，表出動。 |
| 105 | games／expression | 開幕だ。／かいまくだ。／開幕了。 | `game-card:game:genshin:furina:skill:712cebc6c6` | `curtainrises.svg` | 舞台幕往上升起，向上箭頭，聚光燈照到台中央，表開幕。 |
| 106 | games／expression | よいしょ！／よいしょ！／嘿咻！ | `game-card:game:er:tia:selection-voice:81e8b01e3f:81e8b01e3f` | `heaveho.svg` | 人物膝蓋微彎、雙手把沉重箱子往上抬，汗與用力線，表使勁時的「嘿咻」。 |
| 107 | general／concrete | 落雷／らくらい／雷擊 | `general-listening-166:落雷` | `lightningstrike.svg` | 雷雲中的閃電直擊高塔頂端，擊中處迸出火花，表落雷擊中物體。 |
| 108 | general／verb | 説明／せつめい／說明 | `general-listening-05:説明` | `explaining.svg` | 說明者手持示意圖，泡泡中把圖中零件依序用箭頭連起，聽者點頭理解，表說明。 |
| 109 | general／abstract | 時刻／じこく／時刻 | `general-listening-24:時刻` | `clocktime.svg` | 大時鐘指在特定時刻並圈出指針所指，旁邊船隻正要出發，表某個時間點的時刻。 |
| 110 | general／abstract | 合図／あいず／信號 | `general-listening-61:合図` | `givingsignal.svg` | 一人高舉旗子發出信號，另一人在起跑線前準備，看到信號才出發。 |
| 111 | general／concrete | 係員／かかりいん／工作人員 | `general-listening-35:係員` | `staffmember.svg` | 戴帽、臂章與識別證的工作人員在入口處拿夾板引導，表工作人員。 |
| 112 | general／abstract | 人数／にんずう／人數 | `general-listening-11:人数` | `headcount.svg` | 一人拿計數器清點前方一排人數，每人頭上逐一打勾，表人數。 |
| 113 | general／concrete | 装置／そうち／裝置 | `general-listening-53:装置` | `apparatus.svg` | 帶有儀表、指示燈、拉桿與管線的機械裝置，表為特定用途設置的裝置。 |
| 114 | general／abstract | 位置／いち／位置 | `general-listening-14:位置` | `position.svg` | 方格地圖上一枚圖釘，十字座標線穿過圖釘所在處，表某物所在的位置。 |
| 115 | general／adverb | 必ず／かならず／一定 | `general-listening-36:必ず` | `surely.svg` | 路線遇到障礙仍繞過並確實抵達旗幟終點，人物堅定點頭，表一定、務必做到。 |
| 116 | general／abstract | 担当／たんとう／負責 | `general-listening-71:担当` | `incharge.svg` | 任務板上三張工作卡之一以線連到持卡人物，該人物拿著同一張卡，表負責那件事。 |
| 117 | general／abstract | 範囲／はんい／範圍 | `general-listening-115:範囲` | `extentrange.svg` | 地圖上以虛線圍出一塊區域，雙向箭頭標出寬度，表範圍。 |
| 118 | general／abstract | 約束／やくそく／約定 | `general-listening-36:約束` | `keepingpromise.svg` | 兩手從左右伸出，小指彼此勾住並被圈出，上方日曆的約定日已打勾，表遵守約定。 |
| 119 | general／verb | 残る／のこる／留下 | `general-listening-99:残る` | `stayingbehind.svg` | 其他人沿箭頭離開，被圈出的一人留在旗子旁原地不動，表留下。 |
| 120 | general／abstract | 文字／もじ／文字 | `general-listening-05:文字` | `writtencharacters.svg` | 紙上幾行由方框、橫豎與勾構成的毛筆字形，放大鏡聚焦其中一字，表文字；字形為抽象筆畫，不寫真實答案。 |
| 121 | general／abstract | 内容／ないよう／內容 | `general-listening-13:内容` | `messagecontent.svg` | 拆開的信封中抽出信紙，旁邊泡泡把信中所寫的地點與時間內容展開，表內容而非信封本身。 |
| 122 | general／verb | 参加／さんか／參加 | `general-listening-40:参加` | `joiningin.svg` | 圍成圈一起活動的人中，新的一人舉手沿箭頭加入圈內空位，表參加。 |
| 123 | general／verb | 通行／つうこう／通行 | `general-listening-51:通行` | `passingthrough.svg` | 關卡的柵欄已抬起，行人與推車沿箭頭穿過門口，表通行。 |
| 124 | general／abstract | 期限／きげん／期限 | `general-listening-52:期限` | `deadline.svg` | 日曆最後一格插著截止旗，沙漏沙子快流完，箭頭指向那一天，表期限。 |
| 125 | general／abstract | 故障／こしょう／故障 | `general-listening-53:故障` | `outoforder.svg` | 機器冒煙、齒輪裂開、紅燈閃，旁人困惑抓頭，表故障而非一般關機。 |
| 126 | general／abstract | 今夜／こんや／今晚 | `general-listening-04:今夜` | `tonight.svg` | 日曆的今天格被圈起，旁邊同一天的夜空出現月亮與亮燈的家，表今晚。 |
| 127 | general／abstract | 回復／かいふく／恢復 | `general-listening-07:回復` | `recovery.svg` | 能量條由低處逐漸填滿、向上箭頭，人物重新挺直站起，表恢復。 |
| 128 | general／adverb | さっき／さっき／剛才 | `general-listening-13:さっき` | `justnow.svg` | 時鐘只往回標出很短一段弧，桌上杯子還冒著熱氣、門剛關上，表剛才。 |
| 129 | general／verb | 続く／つづく／持續 | `general-listening-27:続く` | `continuing.svg` | 時間線上的進行條已越過現在的紅色標記線仍向前延伸，前端還在前進，表持續。 |
| 130 | general／concrete | 電源／でんげん／電源 | `general-listening-53:電源` | `powersource.svg` | 裝置的電源開關被按下、電線連到牆上插座，表電源；不畫電燈。 |
| 131 | general／abstract | 訓練／くんれん／訓練 | `general-listening-55:訓練` | `drill.svg` | 指導者吹哨、手持碼錶，隊員依序沿箭頭走向出口，表訓練（演練）。 |
| 132 | general／adjective | 似る／にる／相似 | `general-listening-74:似る` | `resembling.svg` | 兩個披斗篷的身影輪廓幾乎相同，虛線把對應部位連起，帽子略有不同，表相似而非相同。 |
| 133 | general／verb | 消える／きえる／消失 | `general-listening-145:消える` | `vanishing.svg` | 同一顆水晶由實心、半透明到只剩虛線輪廓，三段變化表消失。 |
| 134 | general／verb | 試験／しけん／測試 | `general-listening-88:試験` | `testrun.svg` | 技術員按下測試開關，儀表指針擺動，手中清單逐項打勾，表測試。 |
| 135 | general／verb | 合流／ごうりゅう／會合 | `general-listening-93:合流` | `merging.svg` | 左上與左下兩條路的隊伍在交會點合成一路，前方有集合旗，表會合。 |
| 136 | general／verb | 引き受ける／ひきうける／承接 | `general-listening-99:引き受ける` | `acceptingtask.svg` | 委託人遞出任務卷軸，接受者伸手接過並把手放在胸前點頭，表承接工作。 |
| 137 | general／abstract | 指示／しじ／指示 | `general-listening-103:指示` | `instruction.svg` | 負責人拿夾板並伸臂指向箭頭方向，兩名作業者依所指方向行動，表指示。 |
| 138 | general／abstract | 引用／いんよう／引用 | `general-listening-109:引用` | `quoting.svg` | 後方說話者的泡泡裡套著另一人的小頭像與原話圖形，表轉引他人說過的話。 |
| 139 | general／abstract | 後／あと／之後 | `general-listening-03:後` | `afterwards.svg` | 左格先把鑰匙放回盒子，箭頭指向右格被圈起的吃飯場景，表「之後」做的事。 |
| 140 | general／verb | 協力／きょうりょく／合作 | `general-listening-17:協力` | `cooperating.svg` | 兩人各抬起長木頭的一端一起搬運，力量方向一致，表合作。 |
| 141 | general／verb | 助かる／たすかる／得到幫助 | `general-listening-33:助かる` | `helpedrelief.svg` | 提著重物的人被同伴接過一袋，臉上鬆一口氣、汗消失，表得到幫助而得救。 |
| 142 | general／verb | 間違える／まちがえる／弄錯 | `general-listening-36:間違える` | `makingmistake.svg` | 兩扇門中，人物把鑰匙插進錯的那扇（打叉），正確的門在旁有相同記號，表弄錯。 |
| 143 | general／abstract | 勘違い／かんちがい／誤會 | `general-listening-36:勘違い` | `mistakenbelief.svg` | 人物以為站牌在身旁（泡泡中的站牌），實際站牌在遠處另一側，表誤會、搞錯。 |
| 144 | general／abstract | 誤解／ごかい／誤解 | `general-listening-49:誤解` | `miscommunication.svg` | 說話者泡泡裡是圓形，聽者心中卻成了方形，兩者之間打叉，表誤解。 |
| 145 | general／adjective | 古い／ふるい／舊的 | `general-listening-51:古い` | `outdated.svg` | 牆上舊公告泛黃、角落捲起並被打叉，旁邊貼著嶄新的新公告，表過時的舊資訊。 |
| 146 | general／abstract | 候補／こうほ／候選 | `general-listening-59:候補` | `candidates.svg` | 三張人像卡片並列在候選區，被同一虛線框圍住、尚未選定，表候選。 |
| 147 | general／adverb | 先に／さきに／先 | `general-listening-63:先に` | `firstbefore.svg` | 兩件事中，人物現在先做左邊被圈起的那件，右邊另一件在沙漏旁等著之後再做，表先（做）。 |
| 148 | general／abstract | 足元／あしもと／腳邊 | `general-listening-67:足元` | `underfoot.svg` | 人物低頭看自己腳下，腳邊的小坑被圈出，表腳邊、腳下。 |
| 149 | general／abstract | 推測／すいそく／推測 | `general-listening-70:推測` | `inference.svg` | 人物看著地上的腳印，心中浮現虛線人形，表依線索推測而非確認。 |
| 150 | general／concrete | 照明／しょうめい／照明 | `general-listening-71:照明` | `lighting.svg` | 天花板吊著兩盞燈，光錐照亮下方的桌面與地板，表照明設備。 |
| 151 | general／verb | 見張り／みはり／看守 | `general-listening-77:見張り` | `lookout.svg` | 守望台上的人拿望遠鏡掃視遠方，視線虛線向外，表看守、守望。 |
| 152 | general／concrete | 本部／ほんぶ／本部 | `general-listening-90:本部` | `headquarters.svg` | 插旗的大帳篷內有地圖桌，傳令者跑來報告，表指揮本部。 |
| 153 | general／adverb | すでに／すでに／已經 | `general-listening-91:すでに` | `alreadydone.svg` | 人物才剛趕到，清單上的事項早已全部打勾、包裹已封好，表已經完成。 |
| 154 | general／abstract | 内側／うちがわ／內側 | `general-listening-98:内側` | `insidearea.svg` | 圍牆圍出的區域內，一點被圈出，箭頭由外指向內，表內側。 |
| 155 | general／abstract | 効果／こうか／效果 | `general-listening-105:効果` | `takingeffect.svg` | 枯萎植物澆上藥水後轉為挺立茂盛，前後對照與光點表效果出現。 |
| 156 | general／quantity | 全員／ぜんいん／全體人員 | `general-listening-111:全員` | `everyone.svg` | 一群人被一個大圈全部圈住，每人頭上都有勾，沒有人在外，表全員。 |
| 157 | general／abstract | 証言／しょうげん／證詞 | `general-listening-127:証言` | `testimony.svg` | 目擊者舉手陳述，泡泡中是當時看見的蓋布推車場景，聽者在一旁記錄，表證詞。 |
| 158 | general／verb | 上がる／あがる／升起 | `general-listening-132:上がる` | `gaterising.svg` | 石門框中的鐵柵往上升起，下方空出通道，向上箭頭，表升起。 |
| 159 | general／concrete | 原本／げんぽん／原件 | `general-listening-148:原本` | `originaldocument.svg` | 蓋印與綁緞帶的原件被圈出，旁邊兩張淡色影本，表原本而非副本。 |
| 160 | general／abstract | 週末／しゅうまつ／週末 | `general-listening-04:週末` | `weekend.svg` | 七格週曆中最後的週六與第一格週日被填色，旁有休閒的球，表週末。 |
| 161 | general／adverb | まず／まず／首先 | `general-listening-07:まず` | `firststep.svg` | 樓梯的第一階被圈出，人物正踏上這一階，後面幾階仍空著，表首先。 |
| 162 | general／concrete | 値段／ねだん／價格 | `general-listening-07:値段` | `pricetag.svg` | 商品上用細繩掛著標價牌，牌上以硬幣圖形代表金額，不寫數字，表價格。 |
| 163 | general／verb | 看病／かんびょう／照護病人 | `general-listening-153:看病` | `nursingcare.svg` | 照護者坐在床邊把濕毛巾放在病人額頭，旁有水盆，表看護病人。 |
| 164 | general／verb | 見つかる／みつかる／被找到 | `general-listening-14:見つかる` | `foundit.svg` | 椅子底下被放大鏡照出遺失的提包並發光，表東西被找到了。 |
| 165 | general／abstract | 相手／あいて／對方 | `general-listening-16:相手` | `counterpart.svg` | 標記著「我」的人與對面的人相對，對面那一方被圈出，表對方。 |
| 166 | general／adverb | たぶん／たぶん／大概 | `general-listening-21:たぶん` | `probably.svg` | 人物望著雲層、頭微偏，心中下雨的畫面只有一半濃度，帶著傘以防，表大概、可能。 |
| 167 | general／concrete | 新人／しんじん／新人 | `general-listening-31:新人` | `newcomer.svg` | 戴著嶄新閃亮徽章的新成員站進隊伍末端，其他人徽章已舊，表新人。 |
| 168 | general／expression | 大丈夫／だいじょうぶ／沒問題 | `general-listening-33:大丈夫` | `itsokay.svg` | 剛絆倒的人站起來向擔心的朋友豎起拇指，表沒問題、不要緊。 |
| 169 | general／verb | 入場／にゅうじょう／入場 | `general-listening-35:入場` | `admission.svg` | 人物把票交給入口人員，穿過閘口進入會場，表入場。 |
| 170 | general／concrete | 連絡先／れんらくさき／聯絡方式 | `general-listening-39:連絡先` | `contactinfo.svg` | 聯絡卡上有頭像、電話聽筒與信封圖示，表聯絡方式，不寫號碼或個資。 |
| 171 | general／abstract | 代案／だいあん／替代方案 | `general-listening-40:代案` | `alternativeplan.svg` | 方案甲的卡片被打叉，旁邊方案乙卡片打勾，兩卡都指向同一目標旗，表替代方案。 |
| 172 | general／abstract | 正午／しょうご／正午 | `general-listening-45:正午` | `noon.svg` | 時鐘長短針都指向正上方，太陽在最高處，表正午。 |
| 173 | general／abstract | 特徴／とくちょう／特徵 | `general-listening-48:特徴` | `distinctivefeature.svg` | 幾個相似人物中，放大鏡聚焦在其中一人獨有的紅色長圍巾，表特徵。 |
| 174 | general／abstract | 奥／おく／深處 | `general-listening-50:奥` | `farback.svg` | 透視的長走廊盡頭有一間房門被圈出，遠近線條指向深處，表深處、裡面。 |
| 175 | general／verb | 下がる／さがる／降下 | `general-listening-132:下がる` | `gatelowering.svg` | 石門框中的鐵柵往下落到地面、把通道封住，向下箭頭，表降下。 |
| 176 | general／abstract | 警告／けいこく／警告 | `general-listening-53:警告` | `warning.svg` | 人物站在懸崖邊前舉手警告，另一人停下腳步，危險區以斜紋標出，表警告。 |
| 177 | general／abstract | 命令／めいれい／命令 | `general-listening-53:命令` | `command.svg` | 指揮者高舉手臂指向前方發令，隊員立正敬禮，表命令。 |
| 178 | general／abstract | 反対／はんたい／反對 | `general-listening-57:反対` | `opposing.svg` | 面對桌上的提案，一人雙臂交叉成叉形、身體後仰，表反對。 |
| 179 | general／abstract | 提案／ていあん／提案 | `general-listening-57:提案` | `proposal.svg` | 一人雙手捧出畫著新路線的方案紙，面向坐著的人們，表提案。 |
| 180 | general／concrete | 音／おと／聲音 | `general-listening-58:音` | `soundwaves.svg` | 鼓被敲響，聲波傳到右側的耳朵，表聽到的聲音；不是人說話的聲音。 |
| 181 | general／adverb | ずっと／ずっと／一直 | `general-listening-61:ずっと` | `allalong.svg` | 人物從早到晚守在同一位置，上方太陽沿長弧從東移到西，表一直、始終。 |
| 182 | general／verb | 交換／こうかん／更換 | `general-listening-66:交換` | `replacingpart.svg` | 從裝置取出舊電池（灰、打叉）放下，換裝新電池（亮）進去，雙向箭頭，表更換零件。 |
| 183 | general／concrete | 姿／すがた／身影 | `general-listening-70:姿` | `figure.svg` | 霧中遠處只看得到一個模糊的人形輪廓，觀看者瞇眼望去，表身影。 |
| 184 | general／concrete | 信号／しんごう／信號 | `general-listening-71:信号` | `lightsignal.svg` | 高塔頂端的燈號向遠方發出亮光，等待的人看見光號準備行動，表信號（燈號）。 |
| 185 | general／concrete | 警報／けいほう／警報 | `general-listening-76:警報` | `alarm.svg` | 柱頂警報器旋轉閃紅光並發出大聲響，人們抬頭警覺，表警報。 |
| 186 | general／concrete | 担当者／たんとうしゃ／負責人 | `general-listening-82:担当者` | `personincharge.svg` | 戴負責人臂章的人拿著工作夾板站在作業區前，旁人向其請示，表負責人。 |
| 187 | general／verb | 呼ばれる／よばれる／被叫喚 | `general-listening-86:呼ばれる` | `beingcalled.svg` | 工作人員朝這邊喊名招手，被叫到的人轉身起步走向他，被叫方被圈出，表被叫喚。 |
| 188 | general／verb | 光る／ひかる／發光 | `general-listening-88:光る` | `glowing.svg` | 燈石自己發出光芒，周圍光線向外放射，表發光。 |
| 189 | general／concrete | 連絡所／れんらくじょ／聯絡站 | `general-listening-95:連絡所` | `liaisonpost.svg` | 屋頂有天線的小哨所，桌上有通訊器，傳令者帶信抵達，表聯絡站。 |
| 190 | general／abstract | 外側／そとがわ／外側 | `general-listening-98:外側` | `outsidearea.svg` | 圍牆圍出的區域外，一點被圈出，箭頭由內指向外，表外側。 |
| 191 | general／verb | 調査／ちょうさ／調查 | `general-listening-100:調査` | `investigation.svg` | 人物蹲著用放大鏡察看地面痕跡並在筆記上記錄，表調查。 |
| 192 | general／concrete | 隊員／たいいん／隊員 | `general-listening-102:隊員` | `squadmember.svg` | 同樣臂章的隊伍並排，其中一位隊員被圈出，表隊伍的一員。 |
| 193 | general／verb | 作業／さぎょう／作業 | `general-listening-104:作業` | `manualwork.svg` | 人物在工作台前用鐵鎚與板材進行手上作業，表作業、工作中的實際操作。 |
| 194 | general／concrete | 帰り道／かえりみち／回程路線 | `general-listening-105:帰り道` | `wayhome.svg` | 來時的路標記號沿路排列，箭頭沿同一路線折回遠處的家，表回程路線。 |
| 195 | general／verb | 発言／はつげん／發言 | `general-listening-109:発言` | `speakingup.svg` | 會議桌旁一人舉手站起發言，其他人轉頭看他，表發言。 |
| 196 | general／verb | 鳴る／なる／響起 | `general-listening-118:鳴る` | `ringing.svg` | 沒有人碰的鬧鐘自己響起，鐘身晃動、震動線向外，表（鈴、鐘）響起。 |
| 197 | general／abstract | 後衛／こうえい／後衛 | `general-listening-123:後衛` | `rearguard.svg` | 隊伍朝右前進，後方殿後的成員被圈出、轉身持盾警戒，表後衛。 |
| 198 | general／abstract | 前衛／ぜんえい／前衛 | `general-listening-123:前衛` | `vanguard.svg` | 隊伍朝右前進，最前方持盾開路的成員被圈出，表前衛。 |
| 199 | general／abstract | 魔力／まりょく／魔力 | `general-listening-125:魔力` | `magicpower.svg` | 施術者體內的能量條發光，光點流向手中杖頭聚成光球，表施展魔法的力量。 |
| 200 | general／verb | 支援／しえん／支援 | `general-listening-133:支援` | `supportbacking.svg` | 前方隊友在前線作戰，後方的人從防線舉弓掩護並遞送補給，表支援。 |
| 201 | general／verb | 照合／しょうごう／核對 | `general-listening-147:照合` | `crosschecking.svg` | 兩份清單並排，逐行用連線比對並打勾，放大鏡在兩者之間，表核對。 |
| 202 | general／concrete | 予定表／よていひょう／行程表 | `general-listening-12:予定表` | `schedulechart.svg` | 橫為日期、縱為時段的行程表格中，幾格放著出發、會面、用餐的小圖示，表行程表。 |
| 203 | general／verb | 掛ける／かける／掛上 | `general-listening-15:掛ける` | `hanging.svg` | 人物把外套的掛環套到牆上掛鉤上，外套垂掛著，表掛上。 |
| 204 | general／verb | 迷う／まよう／迷路 | `general-listening-96:迷う` | `lostway.svg` | 人物站在多條小路交錯處，左右張望拿著地圖，身後腳印繞圈，表迷路。 |
| 205 | general／verb | 迷う／まよう／猶豫 | `general-listening-59:迷う` | `hesitating.svg` | 人物在兩個選擇前來回看，手停在半空，兩邊各有一個小箭頭，表猶豫。 |
| 206 | general／concrete | 村人／むらびと／村民 | `general-listening-17:村人` | `villagers.svg` | 幾位穿樸素工作服、拿農具和籃子的村民站在村舍前，表村民（人物）。 |
| 207 | general／concrete | 旅人／たびびと／旅人 | `general-listening-17:旅人` | `wayfarer.svg` | 披斗篷、拄長杖、背行囊的旅人走在通往遠方的路上，表旅人。 |
| 208 | general／verb | 整理／せいり／整理 | `general-listening-18:整理` | `sorting.svg` | 散亂的物品按種類分別放進三個箱子，箭頭分流，表整理。 |
| 209 | general／verb | 暗くなる／くらくなる／變暗 | `general-listening-21:暗くなる` | `gettingdark.svg` | 天空由左到右逐漸變暗、雲層靠近，同一座山的顏色越來越深，表變暗。 |
| 210 | general／verb | 明るくなる／あかるくなる／變亮 | `general-listening-21:明るくなる` | `gettingbright.svg` | 路燈逐一點亮，昏暗的路面由左到右變得明亮，表變亮。 |
| 211 | general／abstract | 誰か／だれか／某人 | `general-listening-22:誰か` | `someone.svg` | 樹叢後露出半個不明人影，地上有腳步聲音波，看的人不知是誰，表某人。 |
| 212 | general／concrete | 一覧／いちらん／一覽表 | `general-listening-24:一覧` | `listtable.svg` | 一張表格逐列排出多個項目，每列左側有小圖示、右側有行線，表一覽表。 |
| 213 | general／concrete | 答え／こたえ／答案 | `general-listening-24:答え` | `answersheet.svg` | 題目紙下方的作答格中一個選項被圈起，旁邊打勾，表答案。 |
| 214 | general／abstract | 空き／あき／空檔 | `general-listening-40:空き` | `freeslot.svg` | 一週行程中多數格子已填滿，只有一格空著並被圈出，表空檔。 |
| 215 | general／verb | 待ち合わせ／まちあわせ／碰面約定 | `general-listening-40:待ち合わせ` | `meetingup.svg` | 兩人各自從兩側走向廣場時鐘塔下的約定地點，表約定碰面。 |
| 216 | general／abstract | 日時／にちじ／日期與時間 | `general-listening-41:日時` | `dateandtime.svg` | 日曆的某一天被圈起，並排的時鐘指向某一時刻，兩者以加號一起表日期與時間。 |
| 217 | general／adverb | 急に／きゅうに／突然 | `general-listening-41:急に` | `abruptly.svg` | 晴天下走路的人頭上突然下起大雨，人物驚嚇跳起，表突然。 |
| 218 | general／abstract | 大きさ／おおきさ／大小 | `general-listening-42:大きさ` | `size.svg` | 大中小三個箱子並排，旁邊的寬高尺寸箭頭標出大小差異，表大小。 |
| 219 | general／concrete | 診療所／しんりょうじょ／診所 | `general-listening-47:診療所` | `clinic.svg` | 小型平房診所門口掛有聽診器圖樣的招牌，病人推門進入，表診所。 |
| 220 | general／concrete | 機械／きかい／機械 | `general-listening-53:機械` | `machine.svg` | 咬合的大小齒輪與傳動皮帶組成的機械，表機械。 |
| 221 | general／concrete | 班／はん／小組 | `general-listening-57:班` | `smallunit.svg` | 大隊伍被分成幾個小組，各組以框圍起並插不同顏色小旗，表小組（班）。 |
| 222 | general／verb | 共有／きょうゆう／共享 | `general-listening-69:共有` | `sharinginfo.svg` | 兩台終端顯示同一份文件，中間雙向箭頭與兩人共同查看，表共享資訊。 |
| 223 | general／concrete | 足音／あしおと／腳步聲 | `general-listening-70:足音` | `footsteps.svg` | 一串腳印旁帶著聲波，看不到人只聽見腳步聲，表腳步聲。 |
| 224 | general／concrete | 光／ひかり／光 | `general-listening-72:光` | `lightbeam.svg` | 光束從窗上方斜照下來，照在地板形成亮塊，空氣中有光點，表光。 |
| 225 | general／verb | 触れる／ふれる／碰觸 | `general-listening-74:触れる` | `touchingsurface.svg` | 指尖輕觸發光石板的表面，接觸點出現細小漣漪，表碰觸。 |
| 226 | general／concrete | 札／ふだ／牌子 | `general-listening-75:札` | `woodentag.svg` | 釘子上用繩掛著一塊有孔的木牌，牌面只有花紋沒有文字，表牌子。 |
| 227 | general／verb | 誘導／ゆうどう／引導 | `general-listening-77:誘導` | `drawingaway.svg` | 一人在前方招手並沿虛線把敵人引向遠處，原處的傷者得以安全，表引導（誘離）。 |
| 228 | general／abstract | 届け先／とどけさき／送達地點 | `general-listening-81:届け先` | `destination.svg` | 包裹上的收件標籤以虛線連到目的地那棟房子，房子被圈出，表送達地點。 |
| 229 | general／abstract | 当番／とうばん／值班 | `general-listening-82:当番` | `onduty.svg` | 值班表上本日的格子以人像標記，戴值班臂章的人站在崗位上，表值班。 |
| 230 | general／abstract | 長さ／ながさ／長度 | `general-listening-87:長さ` | `length.svg` | 一條繩子沿直尺伸展，兩端雙向箭頭標出長度。 |
| 231 | general／concrete | 布／ぬの／布 | `general-listening-96:布` | `cloth.svg` | 一卷布攤開成一片，表面有織紋，邊角自然垂下，表布料。 |
| 232 | general／concrete | 分かれ道／わかれみち／岔路 | `general-listening-96:分かれ道` | `forkinroad.svg` | 一條路在前方分成左右兩條，分岔點的樹枝上綁著布條，表岔路。 |
| 233 | general／concrete | 別室／べっしつ／另一房間 | `general-listening-97:別室` | `separateroom.svg` | 平面圖中主房間旁另有一間獨立小房，物品沿箭頭被移到那一間，表另一個房間。 |
| 234 | general／concrete | 対岸／たいがん／對岸 | `general-listening-100:対岸` | `oppositebank.svg` | 河的這一岸站著人物，對面河岸被圈出，那裡有村子與人，表對岸。 |
| 235 | general／abstract | 重さ／おもさ／重量 | `general-listening-104:重さ` | `weight.svg` | 秤盤上放著重箱子，指針轉到偏高處，表重量。 |
| 236 | general／concrete | 使者／ししゃ／使者 | `general-listening-106:使者` | `messenger.svg` | 背著信筒的使者快步抵達城門前，手中高舉封好的書信，表使者。 |
| 237 | general／verb | 数える／かぞえる／清點 | `general-listening-112:数える` | `counting.svg` | 人物伸出手指逐一點著排成一列的箱子，每點一個就加一道計數記號，表清點、計數。 |
| 238 | general／abstract | 十分／じゅっぷん／十分鐘 | `general-listening-116:十分` | `tenminutes.svg` | 時鐘上長針走過的一小段扇形（約鐘面六分之一）被填色，表十分鐘的長度。 |
| 239 | general／abstract | 合計／ごうけい／合計 | `general-listening-116:合計` | `total.svg` | 三小堆物品沿箭頭合併成一大堆，下方總計橫線，表合計。 |
| 240 | general／abstract | 制限／せいげん／限制 | `general-listening-119:制限` | `limit.svg` | 量表中的指針已頂到紅色上限線，再往上被擋住，表限制。 |
| 241 | general／concrete | 装備／そうび／裝備 | `general-listening-121:装備` | `equipment.svg` | 頭盔、背包、繩索與提燈排在地上準備使用，表裝備。 |
| 242 | general／concrete | 地面／じめん／地面 | `general-listening-121:地面` | `ground.svg` | 地面剖面上有草、小石與地表線，表地面這個表層。 |
| 243 | general／verb | 照らす／てらす／照亮 | `general-listening-121:照らす` | `illuminating.svg` | 人物舉起火把照向前方黑暗的路，被照亮處出現路面與腳印，表照亮。 |
| 244 | general／concrete | 敵／てき／敵人 | `general-listening-123:敵` | `enemy.svg` | 帶尖角與利爪的怪物擋在隊伍前方，雙方對峙，表敵人。 |
| 245 | general／adjective | 効く／きく／有效 | `general-listening-124:効く` | `effective.svg` | 火把的火焰碰到冰牆後冰塊融化碎裂，命中處有效果線，表有效、起作用。 |
| 246 | general／abstract | 呪文／じゅもん／咒語 | `general-listening-125:呪文` | `spell.svg` | 施術者朗誦咒語，口中流出的符號串繞成光環落在魔法陣上，表咒語。 |
| 247 | general／verb | 治療／ちりょう／治療 | `general-listening-126:治療` | `treatment.svg` | 治療者把藥草敷在傷者手臂上並纏上繃帶，表治療。 |
| 248 | general／verb | 減る／へる／減少 | `general-listening-126:減る` | `decreasing.svg` | 三堆從高到低排列的積塊，向下箭頭，表減少。 |
| 249 | general／concrete | 目撃者／もくげきしゃ／目擊者 | `general-listening-128:目撃者` | `eyewitness.svg` | 一旁被圈出的人物親眼看到推車翻倒，視線虛線連到事件，表目擊者（人）。 |
| 250 | general／verb | 閉じ込める／とじこめる／困住 | `general-listening-130:閉じ込める` | `trapped.svg` | 鐵柵落下把人物關在小房間裡，人抓著柵欄出不去，表被困住。 |
| 251 | general／verb | 測る／はかる／測量 | `general-listening-131:測る` | `measuring.svg` | 人物把捲尺垂進洞裡測量深度，刻度與上下箭頭，表測量。 |
| 252 | general／concrete | 依頼主／いらいぬし／委託人 | `general-listening-138:依頼主` | `client.svg` | 被圈出的委託人把寫好委託內容的文件與錢袋遞給受託者，表委託人。 |
| 253 | general／verb | 護送／ごそう／護送 | `general-listening-140:護送` | `escort.svg` | 載著水晶的推車在中間前進，兩名護衛分別在前後持盾守護，表護送。 |
| 254 | general／concrete | 退路／たいろ／退路 | `general-listening-143:退路` | `retreatpath.svg` | 前線後方保留一條通往安全營地的空路，被雙側虛線框起並有回程箭頭，表退路。 |
| 255 | general／concrete | 受領書／じゅりょうしょ／收領憑證 | `general-listening-148:受領書` | `receipt.svg` | 交出包裹後，對方把蓋了印章的收據遞回，表收領憑證。 |
| 256 | general／concrete | 封／ふう／封口 | `general-listening-148:封` | `seal.svg` | 信封封口處貼著封蠟印並被圈出，表封口（未拆封）。 |
| 257 | general／verb | 署名／しょめい／簽名 | `general-listening-148:署名` | `signing.svg` | 手握筆在文件下方的簽名欄寫下彎曲的簽名線，表簽名。 |
| 258 | general／verb | 引き渡し／ひきわたし／移交 | `general-listening-148:引き渡し` | `handover.svg` | 一人雙手把密封箱交到另一人手上，兩人都扶著箱子，旁有點收清單，表移交。 |
| 259 | general／verb | 付き添い／つきそい／陪伴 | `general-listening-153:付き添い` | `accompanying.svg` | 陪伴者扶著行走不穩的人的手臂，兩人並肩前往，表陪伴同行。 |
| 260 | general／concrete | 工房／こうぼう／工坊 | `general-listening-156:工房` | `workshop.svg` | 工坊室內牆上掛滿工具，中央有工作台與半成品，表工坊。 |
| 261 | general／verb | 補修／ほしゅう／修補 | `general-listening-158:補修` | `patching.svg` | 破了洞的木板地面上，人用新木板補上破洞並敲釘，表修補。 |
| 262 | general／concrete | 話し手／はなして／說話者 | `general-listening-165:話し手` | `speaker.svg` | 兩人對話中，正在說話、帶著對話泡泡的那一位被圈出，表說話者。 |
| 263 | general／concrete | 包み／つつみ／包裹 | `general-listening-165:包み` | `package.svg` | 用布包起並在上方打結的包裹，表包裹（包好的東西）。 |
| 264 | general／concrete | 原稿／げんこう／原稿 | `general-listening-167:原稿` | `manuscript.svg` | 多頁手寫稿件疊在一起，上有修改紅筆記號與迴紋針，表原稿。 |
| 265 | general／verb | 印刷／いんさつ／列印 | `general-listening-167:印刷` | `printing.svg` | 印表機吐出印好的紙張，紙上有行線，向外箭頭，表列印。 |
| 266 | general／verb | 承認／しょうにん／核准 | `general-listening-170:承認` | `approval.svg` | 負責人在方案文件上蓋下核准章，章印清楚，表核准。 |
| 267 | general／concrete | 聞き手／ききて／聽話者 | `general-listening-175:聞き手` | `listener.svg` | 兩人對話中，側耳傾聽對方說話的那一位被圈出，表聽話者。 |
| 268 | general／verb | 残る／のこる／剩下 | `general-listening-42:残る` | `remaining.svg` | 原本一排六個物品，大部分已被拿走只剩兩個實心留在盤上，表剩下。 |
| 269 | general／abstract | 秘密／ひみつ／秘密 | `general-listening-178:秘密` | `secret.svg` | 兩人靠近耳語，一人豎指在唇前，泡泡中是上鎖的盒子，表秘密。 |
| 270 | general／concrete | 景色／けしき／風景 | `general-listening-29:景色` | `scenery.svg` | 遠山、湖泊與樹林構成的開闊景色，前方人物眺望，表風景。 |
| 271 | general／concrete | 行き止まり／いきどまり／死路 | `general-listening-122:行き止まり` | `deadend.svg` | 巷道盡頭被牆完全擋住，箭頭撞上牆並打叉，表死路。 |
| 272 | general／verb | 迂回／うかい／繞道 | `general-listening-141:迂回` | `detour.svg` | 直走的路被擋住，虛線路線從旁繞一大圈再回到原方向，表繞道。 |
| 273 | general／concrete | 小雨／こさめ／小雨 | `general-listening-161:小雨` | `drizzle.svg` | 淡雲下只落著稀疏細短的雨絲，行人沒撐傘也照常走，表小雨。 |
| 274 | general／concrete | 竜／りゅう／龍 | `general-listening-74:竜` | `dragon.svg` | 有長身、背鰭、角與翅膀的龍盤繞著，表龍（想像生物）。 |
| 275 | general／concrete | 灯台／とうだい／燈塔 | `general-listening-171:灯台` | `lighthouse.svg` | 海邊岩岸上紅白條紋的燈塔，頂端燈光向海面放射，表燈塔。 |
| 276 | general／concrete | 丘／おか／丘陵 | `general-listening-93:丘` | `hill.svg` | 平地上隆起的平緩小山丘，坡上有小樹與小路，表丘陵。 |
| 277 | general／concrete | 商人／しょうにん／商人 | `general-listening-157:商人` | `merchant.svg` | 攤販後的商人一手拿貨物一手接錢幣，攤上擺著商品，表商人。 |
| 278 | general／quantity | 一杯／いっぱい／一杯 | `general-listening-11:一杯` | `onecup.svg` | 桌上只有一杯裝滿飲料的杯子，表一杯。 |
| 279 | general／abstract | 順序／じゅんじょ／順序 | `general-listening-12:順序` | `sequenceorder.svg` | 三張步驟卡以箭頭連成一列，卡上分別是一、二、三個點，表先後順序。 |
| 280 | general／concrete | 夜明け／よあけ／黎明 | `general-listening-153:夜明け` | `dawn.svg` | 地平線上透出第一道曙光，天色由深轉亮，夜星還沒完全消失，表黎明。 |
| 281 | general／concrete | 日没／にちぼつ／日落 | `general-listening-93:日没` | `sunset.svg` | 太陽正沉到地平線下一半，向下箭頭，表日落的那一刻。 |
| 282 | general／concrete | 地下／ちか／地下 | `general-listening-141:地下` | `underground.svg` | 地面剖面下方的地下空間中有通道與燈，地上只有入口，表地下。 |
| 283 | general／concrete | 地上／ちじょう／地面 | `general-listening-141:地上` | `aboveground.svg` | 地面剖面以上的地表世界被圈出，有房屋與樹，下方是地下通道，表地上（地面上）。 |
| 284 | general／concrete | 停留所／ていりゅうじょ／車站 | `general-listening-160:停留所` | `busstop.svg` | 路邊有候車亭與站牌，乘客在旁等車，公車駛近，表車站（停留所）。 |
| 285 | general／concrete | 時刻表／じこくひょう／時刻表 | `general-listening-160:時刻表` | `timetable.svg` | 站牌旁的時刻表依時間列出班次，每列有時鐘與車子小圖示，表時刻表。 |
| 286 | general／concrete | 船長／せんちょう／船長 | `general-listening-161:船長` | `captain.svg` | 戴船長帽的人站在船舵前掌舵，表船長。 |
| 287 | general／concrete | 乗客／じょうきゃく／乘客 | `general-listening-161:乗客` | `passenger.svg` | 帶行李的乘客坐在交通工具的座位上，窗外景色流過，表乘客。 |
| 288 | general／concrete | 患者／かんじゃ／病人 | `general-listening-170:患者` | `patient.svg` | 頭上敷冰袋、躺在診療床上蓋被的人，旁有點滴架，表病人。 |
| 289 | general／concrete | 職人／しょくにん／工匠 | `general-listening-156:職人` | `craftsman.svg` | 繫圍裙的工匠專注地用鑿子雕刻木件，旁有工具，表工匠。 |
| 290 | general／concrete | 短剣／たんけん／短劍 | `general-listening-144:短剣` | `dagger.svg` | 比長劍短的短劍，有短刃、護手與握柄，旁放入鞘中，表短劍。 |
| 291 | general／concrete | 無線／むせん／無線電 | `general-listening-61:無線` | `walkietalkie.svg` | 手持無線電對講機有天線、喇叭網與按鍵，電波向外，表無線電。 |
| 292 | general／concrete | 事故／じこ／意外事故 | `general-listening-63:事故` | `accident.svg` | 通道上推車撞翻、貨物散落，一人倒地，碰撞線，表意外事故。 |
| 293 | general／verb | 増水／ぞうすい／水位上升 | `general-listening-120:増水` | `risingwater.svg` | 河水漲到快淹過河岸，水位標尺上的線往上升，表水位上升。 |
| 294 | general／adjective | 混む／こむ／擁擠 | `general-listening-58:混む` | `crowded.svg` | 車廂或店內擠滿人，人與人之間幾乎沒有空隙，表擁擠。 |
| 295 | general／verb | 喜ぶ／よろこぶ／高興 | `general-listening-54:喜ぶ` | `rejoicing.svg` | 收到禮物的人跳起來雙手高舉、滿臉笑容，表高興、歡喜。 |
| 296 | general／verb | 応援／おうえん／支持；加油 | `general-listening-56:応援` | `cheering.svg` | 觀眾揮舞旗子與雙手為場上的跑者加油，表支持、加油。 |
| 297 | general／expression | 挨拶／あいさつ／問候 | `general-listening-31:挨拶` | `greetingbow.svg` | 兩人面對面微微鞠躬打招呼，表問候、寒暄。 |
| 298 | general／abstract | 表情／ひょうじょう／表情 | `general-listening-56:表情` | `facialexpression.svg` | 同一張臉並列出笑、困惑、生氣三種表情，聚焦在臉部變化，表表情。 |
| 299 | general／abstract | 幅／はば／寬度 | `general-listening-131:幅` | `widthspan.svg` | 河道兩岸之間的橫向雙箭頭標出距離，表寬度（而非長度或深度）。 |
| 300 | general／verb | 積む／つむ／裝載 | `general-listening-154:積む` | `loadingcargo.svg` | 人物把箱子一個個堆上推車貨台，向上箭頭，表裝載。 |
