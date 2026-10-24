# T160：新增300個尚未覆蓋義項SVG

基準main `0338c72`（T159／[PR #165](https://github.com/frobel0520/nihongo-lab/pull/165)）。開工時核對：無未合併PR、無T159之後的分支或遠端提交，沒有其他在途批次。rebase合併會改寫提交雜湊，因此本文件不引用合併前雜湊；合併前後提交對照與內容一致比對記在PR最終發布紀錄。

新增300個未覆蓋義項／300張原創CC0 SVG（242,910 bytes）；300主要映射＋351舊圖共用＋141新圖共用＝792筆新增。492筆共用中468筆跨來源單元、24筆同課。全站5909卡保持；SVG 1314→1614，有圖4247→5039、缺圖1662→870，覆蓋71.87%→85.28%（+13.41百分點）。分類：N5 551→639／711、通用3486→3966／4500、動畫60→65／80、遊戲150→369／618。資產數、義項數與有圖卡片數各自不同，不互相代換。

## 本輪重點

- 遊戲類優先：39個新義項＋180筆整句共用（新圖39、舊圖141），遊戲覆蓋24.27%→59.71%。整句卡先判定主要語義再配圖；只吻合一半的台詞保留暫緩（例：「お出かけ？それとも…試合？」、「いち、に、準備運動終わり！…買ってあげる」）。
- 特殊設計逐步納入：一日～十日與二十日用月曆位置（前幾天淺色、當天紅色），百／千／萬用百格板、千立方與十個立方；日圓、多少錢、幾點、星期幾、什麼時候、哪裡、哪一個（兩者／三者以上）、為什麼、怎麼樣、幾個、可是、等等、如果都有獨立構圖，不用問號或任意符號充數。
- 時間詞：每天早上／每晚／每週／每月／每年、這個月／上個月／下個月、今年／去年／明年、昨晚、明天早上／明晚、九點等五個整點與三分鐘／五分鐘，以位置、方向與指針區分，不是同圖換色。
- 語法向動詞：被推、讓使用、被要求搬運、跑著離去／走著過來、讀得懂／讀不懂、買得起／買不起，以方向、角色與肯否定區分。

## 來源與語義界線

全部由本專案以幾何路徑自行編繪，CC0-1.0；沿用224×168、圓角線條、固定色盤與揭示後56×42輔助圖，顏色詞以外不新增色值。無外部素材、作品角色、截圖、字型、文字標籤或emoji；SVG通過無script／foreignObject／text／image／外部href測試。構圖分流：verb 88、abstract 68、concrete 60、quantity 37、expression 36、adverb 7、adjective 4。

小尺寸自查後修正：月曆格線改為單一路徑並以前幾天淺色提高56×42可數性（單張3,100→約880 bytes）；百格板與千立方格線、遊戲敵人與鹿形、錢幣位置、麵包形狀、真品的投影線索；「別人」原用不等號改為一般叉號，避免數學符號當標籤。

## 共用審查

新圖共用依同詞同讀同譯的簽章，或經上下文確認的同義詞（例：これから↔今から、しかし↔でも、ええ／うん／肯定↔はい、どなた↔誰）。舊圖共用351筆，例：通る／通過→通行圖、手順→順序、場所→位置、向こう→對岸、そば→附近、整句「お荷物です～」→送達、「任せて」→委託、「はい、チーズ」→拍照。runtime仍只核對凍結的ID／word／reading／zh四欄。

兩個舊測試原斷言無圖的卡，本輪給了各自正確的新圖：`general-listening-149:本人`改為「仍不得使用第一人稱『我』圖」，`general-listening-36:次`改為「仍不得使用下一站圖」，保留原本防誤配的意圖。

既有暫緩清單：T158保留37筆與T159新增25筆有3筆重疊（聞く×2、早い×1），實際59張不同卡；本輪解決4筆（止まる×2、分ける、次），其餘55筆保留。本輪新增暫緩如下：

- `general-listening-28:一枚`（一枚／一張；一枚）候選onesheet：此課為錢幣一枚，紙張圖會誤導；未另畫錢幣計數。
- `general-listening-42:一枚`（一枚／一枚；一張）候選onesheet：找零銀幣一枚，同上。
- `general-listening-28:二枚`（二枚／兩張；兩枚）候選twosheets：錢幣兩枚，同上。
- `general-listening-42:二枚`（二枚／兩枚；兩張）候選twosheets：錢幣兩枚，同上。
- `general-listening-124:一本`（一本／一根）候選onebottle：此課是一根火把，不是一瓶。
- `general-listening-56:発表`（発表／發表）候選announcement：此課為上台發表（簡報），不是公布結果。
- `general-listening-77:無理`（無理／勉強；不合理）候選impossible：「不合理」義與做不到的情境不同。
- `general-listening-47:悪い`（悪い／不好的）候選badspoiled：臉色不好是身體狀況，不是壞掉的食物。
- `general-listening-05:できる`（できる／能夠；完成（依情境））候選canability：能夠；完成多義且無對話線索。
- `general-listening-39:かける`（かける／打電話；掛）候選puttingonglasses：打電話；掛上多義，與戴眼鏡不同。
- `general-listening-40:また`（また／再；另外）候選again：再；另外多義且無線索。
- `general-listening-172:翌日`（翌日／隔日）候選tomorrow：隔日是相對於過去某天，明天圖以今天為基準。
- `general-listening-115:教える`（教える／教導）候選teaching：長老告訴路線是告知，不是課室教導。
- `general-listening-03:先`（先／前方；先）候選infront：前方；先多義且無線索。
- `general-listening-61:先`（先／前方；先行）候選infront：「先に行かないで」是時間上的先，不是空間前方。
- `general-listening-89:先`（先／先；前方）候選infront：「先に控室へ」是先行，不是前方。
- `game-card:game:er:chloe:selection-voice:0ec71933dc:0ec71933dc`（いち、に、準備運動終わり！大丈夫よ、後で新しいの買ってあげるから。／一、二，暖身結束！沒關係，等一下買新的給你。）候選warmingup：後半是安撫並答應買新的，整句不只暖身。
- `game-card:game:genshin:gaming:skill:fe90a48ac9`（大当たりだぜ！／大中獎啦！）候選hittingtarget：T159已暫緩：可能指中大獎。
- `game-card:game:genshin:nahida:join:bcfe58b69e`（ずいぶん待ってたのよ。／我可是等了好久喔。）候選keptyouwaiting：T159已暫緩：視角相反。
- `game-card:game:er:adela:selection-voice:c4711f3e13:c4711f3e13`（出番なのか。手を読んでみよう。／輪到我了嗎？來推算一下棋步吧。）候選turnonstage：後半是推算棋步，整句主要語義不只輪到上場。
- `game-card:game:genshin:varesa:join:0fe3e8de46`（お出かけ？それとも…試合？／要出門？還是……比賽？）候選goingout：整句是出門或比賽的二擇，出門圖只表達一半。

## 首次快取成本

- 本機正式base build（Windows、Chromium、127.0.0.1靜態伺服器，冷快取）：首次安裝2093項precache約11.1秒完成；安裝中學習同一張卡、揭示與作答正常（約0.9秒內完成），未觀察到卡頓或錯誤。
- 正式站T159曾約5分鐘完成1793檔；本輪正式站實測值記在PR最終發布紀錄，不預先宣稱。差距主要來自GitHub Pages逐檔下載與網路延遲，非本機可重現的程式問題。
- 安裝完成前的缺圖：圖片走網路正常載入；斷網時尚未快取的圖走既有缺圖fallback（文字置中、評分照常、下一張恢復），已驗證。
- 本輪未修改service worker策略、更新提示或離線契約；未發現需要獨立修正的可重現問題。若要縮短首次快取（例如圖片改執行期快取、分批預快取），會改變離線即完整可用的契約，需另由使用者決定。

## 文件

[完整792筆映射CSV](vocab-illustration-t160-mappings.csv)、[300資產bytes／SHA／授權](vocab-illustration-t160-assets.json)、[逐筆核准／暫緩／前批暫緩重評](vocab-illustration-t160-sharing-audit.json)、[驗證證據](vocab-illustration-t160-validation.json)。分組圖覽：[第1組](previews/t160-group-1.png)、[第2組](previews/t160-group-2.png)、[第3組](previews/t160-group-3.png)、[第4組](previews/t160-group-4.png)、[第5組](previews/t160-group-5.png)、[第6組](previews/t160-group-6.png)、[第7組](previews/t160-group-7.png)、[第8組](previews/t160-group-8.png)、[第9組](previews/t160-group-9.png)、[第10組](previews/t160-group-10.png)、[第11組](previews/t160-group-11.png)、[第12組](previews/t160-group-12.png)、[第13組](previews/t160-group-13.png)、[第14組](previews/t160-group-14.png)、[第15組](previews/t160-group-15.png)、[第16組](previews/t160-group-16.png)、[第17組](previews/t160-group-17.png)、[第18組](previews/t160-group-18.png)、[第19組](previews/t160-group-19.png)、[第20組](previews/t160-group-20.png)、[第21組](previews/t160-group-21.png)、[第22組](previews/t160-group-22.png)、[第23組](previews/t160-group-23.png)、[第24組](previews/t160-group-24.png)、[第25組](previews/t160-group-25.png)。手機預覽：[月曆日期](previews/t160-seventhofmonth-375.png)、[遊戲長台詞捲動後](previews/t160-game-scrolled-375.png)。

## 300個主要詞義

| # | 類別／構圖 | 詞面／讀音／原翻譯 | 精確ID | SVG | 構圖與界線 |
|---|---|---|---|---|---|
| 1 | n5／quantity | 一日／ついたち／一號（也唸「いちにち」＝一整天） | `stage0-day5:一日` | `firstofmonth.svg` | 月曆從左上第一格起算，第1格被填色圈出，表該月1號；圖以日期為例，「1天」的期間義不在圖中。 |
| 2 | n5／quantity | 二日／ふつか／二號、兩天 | `stage0-day5:二日` | `secondofmonth.svg` | 月曆從左上第一格起算，第2格被填色圈出，表該月2號；圖以日期為例，「2天」的期間義不在圖中。 |
| 3 | n5／quantity | 三日／みっか／三號、三天 | `stage0-day5:三日` | `thirdofmonth.svg` | 月曆從左上第一格起算，第3格被填色圈出，表該月3號；圖以日期為例，「3天」的期間義不在圖中。 |
| 4 | n5／quantity | 四日／よっか／四號、四天 | `stage0-day5:四日` | `fourthofmonth.svg` | 月曆從左上第一格起算，第4格被填色圈出，表該月4號；圖以日期為例，「4天」的期間義不在圖中。 |
| 5 | n5／quantity | 五日／いつか／五號、五天 | `stage0-day5:五日` | `fifthofmonth.svg` | 月曆從左上第一格起算，第5格被填色圈出，表該月5號；圖以日期為例，「5天」的期間義不在圖中。 |
| 6 | n5／quantity | 六日／むいか／六號、六天 | `stage0-day5:六日` | `sixthofmonth.svg` | 月曆從左上第一格起算，第6格被填色圈出，表該月6號；圖以日期為例，「6天」的期間義不在圖中。 |
| 7 | n5／quantity | 七日／なのか／七號、七天 | `stage0-day5:七日` | `seventhofmonth.svg` | 月曆從左上第一格起算，第7格被填色圈出，表該月7號；圖以日期為例，「7天」的期間義不在圖中。 |
| 8 | n5／quantity | 八日／ようか／八號、八天 | `stage0-day5:八日` | `eighthofmonth.svg` | 月曆從左上第一格起算，第8格被填色圈出，表該月8號；圖以日期為例，「8天」的期間義不在圖中。 |
| 9 | n5／quantity | 九日／ここのか／九號、九天 | `stage0-day5:九日` | `ninthofmonth.svg` | 月曆從左上第一格起算，第9格被填色圈出，表該月9號；圖以日期為例，「9天」的期間義不在圖中。 |
| 10 | n5／quantity | 十日／とおか／十號、十天 | `stage0-day5:十日` | `tenthofmonth.svg` | 月曆從左上第一格起算，第10格被填色圈出，表該月10號；圖以日期為例，「10天」的期間義不在圖中。 |
| 11 | n5／quantity | 二十日／はつか／二十號、二十天 | `stage0-day5:二十日` | `twentiethofmonth.svg` | 月曆從左上第一格起算，第20格被填色圈出，表該月20號；圖以日期為例，「20天」的期間義不在圖中。 |
| 12 | n5／quantity | 百／ひゃく／百（三百、六百、八百的唸法會變） | `stage0-day3:百` | `hundred.svg` | 十乘十的方格拼成一整片，一百個小格表數目一百；不寫數字。 |
| 13 | n5／quantity | 千／せん／千（三千、八千的唸法會變） | `stage0-day3:千` | `thousand.svg` | 十片百格方板疊成一個立方體，表一千；旁邊一片百格板作比較。 |
| 14 | n5／quantity | 万／まん／萬（一萬要說「いちまん」） | `stage0-day3:万` | `tenthousand.svg` | 十個千格立方體排成兩列，表一萬。 |
| 15 | n5／concrete | 円／えん／日圓 | `stage0-day3:円` | `yencoins.svg` | 中間有孔的硬幣、一般硬幣與紙鈔並列，表日圓這種貨幣；不寫面額。 |
| 16 | n5／expression | いくら／いくら／多少錢 | `stage0-day3:いくら` | `howmuch.svg` | 顧客指著貼空白價牌的字典，心中的錢幣只有虛線輪廓，表詢問多少錢。 |
| 17 | n5／expression | 何時／なんじ／幾點 | `stage0-day4:何時` | `whattime.svg` | 人物看著沒有指針的時鐘，歪頭詢問，表幾點。 |
| 18 | n5／expression | 何曜日／なんようび／星期幾 | `stage0-day5:何曜日` | `whatweekday.svg` | 一週七格都空白，上方一個虛線圈在格間移動找位置，人物思考，表星期幾。 |
| 19 | n5／expression | いつ／いつ／什麼時候 | `stage0-day5:いつ` | `whenquestion.svg` | 人物心中浮現只有虛線輪廓的日曆與時鐘，日期和時刻都未定，表什麼時候。 |
| 20 | n5／expression | どこ／どこ／哪裡 | `stage0-day3:どこ` | `wherequestion.svg` | 人物攤開地圖左右張望，地圖上數個虛線候選點和懸空的定位針，表哪裡。 |
| 21 | n5／expression | どっち／どっち／哪邊、哪一個（どちら的口語） | `stage0-day20:どっち` | `whichoftwo.svg` | 人物面前兩家店，手指在兩者間猶豫，兩個虛線箭頭，表兩者中哪一個。 |
| 22 | n5／expression | どれ／どれ／哪一個（三個以上） | `stage0-day20:どれ` | `whichofmany.svg` | 傘架上三把以上的傘，人物指尖在其間移動找自己的那把，表哪一個（三者以上）。 |
| 23 | n5／expression | どうして／どうして／為什麼 | `stage0-day9:どうして` | `whyquestion.svg` | 開關按了燈卻不亮，人物看著燈泡，線索從燈連回一個看不見內容的問題盒，表為什麼。 |
| 24 | n5／expression | どう／どう／怎麼樣 | `stage0-day8:どう` | `howisit.svg` | 一人遞出相機詢問看法，另一人手托下巴端詳評估，表怎麼樣。 |
| 25 | n5／expression | いくつ／いくつ／幾個 | `stage0-day11:いくつ` | `howmany.svg` | 一堆蘋果旁的人用手指逐一點算，上方計數框還是空的，表幾個。 |
| 26 | n5／abstract | でも／でも／可是、不過 | `stage0-day8:でも` | `butcontrast.svg` | 左邊相機閃亮（優點），彎折箭頭轉到右邊同一台相機旁一大疊錢（缺點），表「可是」的轉折。 |
| 27 | n5／abstract | など／など／等等 | `stage0-day21:など` | `etcetera.svg` | 蘋果、麵包、牛奶排成一列，後面接三個逐漸變淡的物件輪廓，表「等等」還有其他。 |
| 28 | n5／abstract | もし／もし／如果、假如 | `stage0-day25:もし` | `ifcondition.svg` | 人物心想「若天晴」：泡泡中的太陽連到登山小旗，旁邊雨雲那條路被淡化，表如果的條件。 |
| 29 | n5／adverb | 毎朝／まいあさ／每天早上 | `stage0-day6:毎朝` | `everymorning.svg` | 一週七格每一格都有一顆初升太陽，表每天早上。 |
| 30 | n5／adverb | 毎晩／まいばん／每天晚上 | `stage0-day6:毎晩` | `everynight.svg` | 一週七格每一格都有一枚月亮，表每天晚上。 |
| 31 | n5／adverb | 毎週／まいしゅう／每週 | `stage0-day11:毎週` | `everyweek.svg` | 四列週曆中同一欄（星期）每列都被標記，表每週。 |
| 32 | n5／adverb | 毎月／まいつき／每個月 | `stage0-day11:毎月` | `everymonth.svg` | 四張月曆頁上同一天都被圈起，表每個月。 |
| 33 | n5／adverb | 毎年／まいとし／每年 | `stage0-day11:毎年` | `everyyear.svg` | 三個以四季標記的年份區塊，每年的同一季節都放著同一個生日蛋糕，表每年。 |
| 34 | n5／abstract | 今月／こんげつ／這個月 | `stage0-day11:今月` | `thismonth.svg` | 三張月曆頁中，含今天紅點的中間那張被填色，表這個月。 |
| 35 | n5／abstract | 先月／せんげつ／上個月 | `stage0-day11:先月` | `lastmonth.svg` | 三張月曆頁中，箭頭從今天所在頁指向左邊已翻過的一頁，表上個月。 |
| 36 | n5／abstract | 来月／らいげつ／下個月 | `stage0-day11:来月` | `nextmonth.svg` | 三張月曆頁中，箭頭從今天所在頁指向右邊還沒到的一頁，表下個月。 |
| 37 | n5／abstract | 今年／ことし／今年 | `stage0-day11:今年` | `thisyear.svg` | 三個四季年份區塊中，含今天紅點的中間一年被填色，表今年。 |
| 38 | n5／abstract | 去年／きょねん／去年 | `stage0-day11:去年` | `lastyear.svg` | 三個四季年份區塊中，箭頭從今年指向左邊過去的一年，表去年。 |
| 39 | n5／abstract | 来年／らいねん／明年 | `stage0-day11:来年` | `nextyear.svg` | 三個四季年份區塊中，箭頭從今年指向右邊的下一年，表明年。 |
| 40 | n5／abstract | 昨夜／ゆうべ／昨晚 | `stage0-day19:昨夜` | `lastnight.svg` | 昨天那一格是夜空與月亮，人物在床上睡覺，箭頭從今天指回去，表昨晚。 |
| 41 | n5／quantity | 枚／まい／張（數紙、切手等薄的東西） | `stage0-day11:枚` | `flatcounter.svg` | 幾張扁平的郵票與紙片攤開疊放，表數薄平物件的「枚」。 |
| 42 | n5／quantity | 回／かい／次、回 | `stage0-day11:回` | `timescount.svg` | 一週七格裡有三天畫著走向圖書館的小人與打勾，表次數（一週三次）。 |
| 43 | n5／abstract | かかる／かかる／花（時間、金錢） | `stage0-day11:かかる` | `takestime.svg` | 從家到圖書館的路線上，時鐘扇形標出花掉的一段時間，旁邊錢幣掉出，表花費（時間、金錢）。 |
| 44 | n5／abstract | いちばん／いちばん／最（一番） | `stage0-day12:いちばん` | `mostbest.svg` | 春夏秋冬四根長條中，秋天那根最高並被圈出，表最。 |
| 45 | n5／expression | はい／はい／是 | `stage0-day15:はい` | `nodyes.svg` | 人物點頭、舉手回應，頭部上下的動作弧線，表「是」。 |
| 46 | n5／adjective | 悪い／わるい／不好的、壞的 | `stage0-day8:悪い` | `badspoiled.svg` | 發黑長斑的壞掉水果上有蒼蠅與臭味線，旁邊新鮮的作對比，表不好的、壞的。 |
| 47 | n5／adverb | とても／とても／非常 | `stage0-day8:とても` | `veryintense.svg` | 同一辣度計，指針一路衝到頂端紅區還冒火花，表「非常」的程度。 |
| 48 | n5／verb | ある／ある／有、在（物品、植物等；禮貌形：あります） | `stage0-day10:ある` | `thingexists.svg` | 架上有一個箱子（物品）被圈出，表物品「有、在」。 |
| 49 | n5／verb | いる／いる／有、在（人與動物；禮貌形：います） | `stage0-day10:いる` | `creatureexists.svg` | 椅子底下有一隻貓（有生命者）被圈出，表人或動物「在」。 |
| 50 | n5／abstract | たて／たて／縱、直（和「よこ」相對） | `stage0-day25:たて` | `vertical.svg` | 高瘦的門板旁一條粗的上下雙向箭頭，橫向的淡化，表縱、直（與橫相對）。 |
| 51 | n5／quantity | グラム／グラム／公克 | `stage0-day25:グラム` | `gram.svg` | 廚房秤上放一盒肉片，指針只轉了一小格，表公克這種重量單位。 |
| 52 | n5／quantity | ゼロ／ゼロ／零（外來語念法） | `stage0-day25:ゼロ` | `zeroitems.svg` | 空空的籃子裡只有虛線輪廓，一個東西都沒有，表零。 |
| 53 | n5／adjective | 温い／ぬるい／微溫的（不夠熱或不夠冰） | `stage0-day25:温い` | `lukewarm.svg` | 杯子只冒一絲淡淡熱氣，溫度計停在中間，表微溫（不熱也不冰）。 |
| 54 | n5／concrete | 作文／さくぶん／作文（作文を書きます） | `stage0-day18:作文` | `essaywriting.svg` | 人物坐在書桌前用鉛筆把長段文字寫在稿紙上，表寫作文。 |
| 55 | n5／concrete | 文章／ぶんしょう／文章 | `stage0-day18:文章` | `paragraph.svg` | 紙上有分段縮排的行線，一段被框出，表文章。 |
| 56 | n5／concrete | 話／はなし／話、故事 | `stage0-day18:話` | `storytelling.svg` | 說話者向兩名聽者講話，泡泡裡是城堡和人物的故事場景，表話、故事。 |
| 57 | n5／verb | できる／できる／會、能夠（禮貌形：できます） | `stage0-day18:できる` | `canability.svg` | 人物順利彈奏吉他，音符般的弧線與打勾，表會、能夠做到。 |
| 58 | n5／verb | なる／なる／變成（禮貌形：なります） | `stage0-day24:なる` | `becoming.svg` | 毛毛蟲經過蛹變成蝴蝶，兩段箭頭，表「變成」。 |
| 59 | n5／abstract | 外国／がいこく／外國 | `stage0-day15:外国` | `foreigncountry.svg` | 地球上本國標記與遠方另一國之間有飛機弧線，遠方國家被圈出，表外國。 |
| 60 | n5／abstract | 国／くに／國家 | `stage0-day1:国` | `country.svg` | 地圖上一塊有明確國界線的領土被填色，界內插著旗竿，表國家。 |
| 61 | n5／concrete | 日本／にほん／日本 | `stage0-day2:日本` | `japan.svg` | 由北到南的四個主要島嶼弧形排列在海中，本州上有一座雪頂山，表日本。 |
| 62 | n5／expression | 何／なに／什麼（單獨讀なに；在「何ですか」中讀なん） | `stage0-day2:何` | `whatquestion.svg` | 人物指著蓋著布、看不出形狀的東西，泡泡中只有虛線輪廓，表「什麼」。 |
| 63 | n5／expression | ください／ください／請給我（〜をください） | `stage0-day3:ください` | `pleasegive.svg` | 顧客指著櫃上的麵包並向店員伸出掌心，店員準備遞出，表「請給我」。 |
| 64 | n5／verb | かける／かける／戴（眼鏡）、掛上（て形：かけて） | `stage0-day16:かける` | `puttingonglasses.svg` | 人物雙手把眼鏡往臉上戴，箭頭指向眼睛，表戴上眼鏡。 |
| 65 | n5／abstract | 自分／じぶん／自己 | `stage0-day18:自分` | `oneself.svg` | 人物手指自己胸口，鏡中映出同一個人，表自己。 |
| 66 | anime／concrete | 武器／ぶき／武器；比喻有利的本領 | `anime-lesson-05:武器` | `weapons.svg` | 武器架上掛著劍、長槍、弓與盾，表武器（實物一例）。 |
| 67 | anime／verb | 勝ち取る／かちとる／爭取到、贏得 | `anime-lesson-03:勝ち取る` | `wintrophy.svg` | 人物伸長雙手從高處一把抓下獎盃，表爭取到、贏得。 |
| 68 | anime／verb | 高める／たかめる／提高、提升 | `anime-lesson-08:高める` | `raisinglevel.svg` | 人物把桿子往上推，旁邊刻度條從低提升到高，向上箭頭，表提高。 |
| 69 | games／expression | 一緒に花火を見に行きましょう。／いっしょに はなびを みに いきましょう。／一起去看煙火吧。 | `game-card:game:er:aya:selection-voice:84354f8cfd:84354f8cfd` | `fireworks.svg` | 夜空中煙火綻開，兩人並肩抬頭觀看，表一起去看煙火。 |
| 70 | games／expression | 悪人はどこですか？／あくにんは どこですか？／壞人在哪裡？ | `game-card:game:er:aya:selection-voice:6baf70e37c:6baf70e37c` | `seekingfoe.svg` | 人物持劍以手遮眼四處搜尋，草叢後只露出敵人的角與紅眼，表找壞人在哪。 |
| 71 | games／expression | みんな、歌いましょう！／みんな、うたいましょう！／大家一起唱吧！ | `game-card:game:genshin:vodyanitsa:burst:6efa3068d3` | `singtogether.svg` | 一排人一起張口歌唱，音波線在上方合在一起，表大家一起唱。 |
| 72 | games／verb | 一狩り始めるか。／ひとかり はじめるか。／來狩獵一場吧。 | `game-card:game:er:nadine:selection-voice:089b7ff647:089b7ff647` | `hunting.svg` | 獵人拉弓瞄準遠處的鹿（有鹿角與四腿），表狩獵。 |
| 73 | games／expression | さて...海にでも行って遊んでみよっか～／さて...うみにでも いって あそんでみよっか～／那麼……去海邊玩玩如何～ | `game-card:game:er:lidailin:selection:1010005:3096dc95d4` | `beachouting.svg` | 兩人帶著游泳圈與沙灘球走向海邊，表一起去海邊玩。 |
| 74 | games／verb | さて、今日はどんな魚にありつけるかな。／さて、きょうは どんな さかなに ありつけるかな。／那麼，今天能弄到什麼樣的魚呢？ | `game-card:game:er:lenox:selection-voice:f5c4bd1fb9:f5c4bd1fb9` | `fishing.svg` | 人物坐在岸邊握著釣竿，釣線垂入水中，水下有魚游近，表釣魚。 |
| 75 | games／expression | マジシャン登場！見たことのないステージを見せてあげる！／マジシャン とうじょう！みたことの ない ステージを みせてあげる！／魔術師登場！讓你看看從沒見過的舞台！ | `game-card:game:er:emma:selection-voice:6bbda2dee4:6bbda2dee4` | `magicshow.svg` | 戴高帽的魔術師揮杖，帽中跳出兔子與閃光，表魔術表演。 |
| 76 | games／expression | 依頼したいものは何だ？／いらい したい ものは なんだ？／你想委託的是什麼？ | `game-card:game:er:tsubame:selection-voice:c495dcd184:c495dcd184` | `askingrequest.svg` | 受託者在櫃檯後攤手詢問，委託人拿著一張空白委託單，表詢問想委託什麼。 |
| 77 | games／expression | 配信開始だよ！今日の配信テーマは幸せな結婚式！／はいしん かいしだよ！きょうの はいしんテーマは しあわせな けっこんしき！／直播開始囉！今天的直播主題是幸福的婚禮！ | `game-card:game:er:eleven:selection:1030004:46e9d6cd81` | `livestream.svg` | 主播面前架著手機鏡頭，畫面上顯示直播中紅點與觀看人數圖示，表直播開始。 |
| 78 | games／concrete | ダーツはいかがですか？／ダーツは いかがですか？／要不要玩飛鏢？ | `game-card:game:er:rio:selection-voice:beacaa5c90:beacaa5c90` | `darts.svg` | 飛鏢正飛向牆上的標靶，旁人手比邀請，表玩飛鏢。 |
| 79 | games／concrete | 今回は海の近くで人形劇をやるつもりだけど、見に来る？／こんかいは うみの ちかくで にんぎょうげきを やるつもりだけど、みにくる？／這次打算在海邊附近演傀儡戲，你要來看嗎？ | `game-card:game:er:chloe:selection:1040003:b7edf66575` | `puppetshow.svg` | 小舞台上兩個提線人偶，上方操作的手拉著線，觀眾坐在前方，表人偶劇。 |
| 80 | games／verb | 少し体を動かすとするか。／すこし からだを うごかすとするか。／稍微活動一下身體吧。 | `game-card:game:genshin:lohen:join:b58a222e95` | `warmingup.svg` | 人物伸展手臂、扭轉身體做暖身動作，表活動身體。 |
| 81 | games／expression | 弾けろ！／はじけろ！／炸開吧！ | `game-card:game:genshin:klee:skill:58fcc41d40` | `explosion.svg` | 圓形物體炸開，碎片與光芒向四周飛散，表炸開、爆炸。 |
| 82 | games／expression | 本当にやりたくないんですけど…／ほんとうに やりたくないんですけど…／我真的不想做耶…… | `game-card:game:er:mai:selection-voice:f897e38f0a:f897e38f0a` | `reluctant.svg` | 人物被任務單往前拉，卻身體後仰、腳跟抵地不想去，表真的不想做。 |
| 83 | games／expression | 失せろ、あんたの言うことなんか聞いてる暇はないから。／うせろ、あんたの いうことなんか きいてる ひまは ないから。／滾開，我可沒空聽你說話。 | `game-card:game:er:karla:selection-voice:5f98347e3e:5f98347e3e` | `goaway.svg` | 人物轉身不理並揮手趕走對方，對方被趕開的箭頭朝外，表「滾開」。 |
| 84 | games／expression | 邪魔しないで！／じゃましないで！／不要打擾我！ | `game-card:game:genshin:layla:skill:3e2b9c1788` | `dontinterfere.svg` | 專心工作的人一手擋住伸手過來打擾的人，表不要打擾、別妨礙。 |
| 85 | games／concrete | 久しぶりの休暇だ。存分に楽しんでおかないと。／ひさしぶりの きゅうかだ。ぞんぶんに たのしんでおかないと。／好久沒放假了。得好好享受才行。 | `game-card:game:er:haze:selection:1058002:413f60b648` | `vacation.svg` | 人物躺在海灘躺椅上，旁有陽傘與飲料，表悠閒的假期。 |
| 86 | games／concrete | 待ってたよ！一緒に金魚すくいに行こう！／まってたよ！いっしょに きんぎょすくいに いこう！／我等你好久了！一起去撈金魚吧！ | `game-card:game:er:irem:selection:1061003:6238f2dd90` | `goldfishscooping.svg` | 祭典的水槽中有金魚，孩子拿著紙網撈起一條，表撈金魚。 |
| 87 | games／expression | 来い！／こい！／來吧！ | `game-card:game:genshin:tartaglia:skill:dd4b2c0aff` | `comehere.svg` | 人物朝自己方向用力招手，地上箭頭從對方指向自己，表「過來」。 |
| 88 | games／concrete | ジャジャーン！レニのマーチングバンド出撃！／ジャジャーン！レニの マーチングバンド しゅつげき！／鏘鏘！雷妮行進樂隊出擊！ | `game-card:game:er:leni:selection:1069001:df5d48d852` | `marchingband.svg` | 行進樂隊成員打鼓吹號、整齊前進，表行進樂隊出擊。 |
| 89 | games／verb | さあさあ、一儲けしに行きますの！／さあさあ、ひともうけしに いきますの！／走吧走吧，去賺一筆囉！ | `game-card:game:genshin:dori:join:851998b75c` | `earningmoney.svg` | 人物雙手捧著一疊剛賺到的錢幣，旁邊錢袋鼓起，表去賺錢。 |
| 90 | games／verb | 風に乗って、さあ行こう。／かぜに のって、さあ いこう。／乘著風，來吧，出發。 | `game-card:game:er:yumin:selection-voice:c4cd5ea772:c4cd5ea772` | `ridewind.svg` | 人物乘著滑翔翼隨風線飄行，表乘風出發。 |
| 91 | games／expression | 正義のヒーロー、ユスティナ、ここに参上！／せいぎの ヒーロー、ユスティナ、ここに さんじょう！／正義的英雄尤斯蒂娜，在此登場！ | `game-card:game:er:justyna:selection-voice:707ebef378:707ebef378` | `heroentrance.svg` | 披風英雄在光芒中擺出登場姿勢，雙手叉腰，表英雄登場。 |
| 92 | games／expression | ゲーム、一緒にやろう。／ゲーム、いっしょに やろう。／一起玩遊戲吧。 | `game-card:game:er:niah:selection-voice:a92bad0ddc:a92bad0ddc` | `videogame.svg` | 兩人並坐拿著遊戲手把看同一個螢幕，表一起玩遊戲。 |
| 93 | games／expression | あたしを甘く見ないで！／あたしを あまく みないで！／別小看我！ | `game-card:game:genshin:diona:skill:c81b594e00` | `dontunderestimate.svg` | 個子小的人面對高大的人仍挺胸舉拳，地上影子比對方還大，表別小看我。 |
| 94 | games／concrete | 今、宴だと言ったよね！どこ？どこで？／いま、うたげだと いったよね！どこ？どこで？／你剛剛說有宴會對吧！在哪？在哪裡？ | `game-card:game:er:bihyung:selection-voice:671e7f6098:671e7f6098` | `feast.svg` | 長桌上擺滿烤肉、大盤菜與酒杯，表宴會。 |
| 95 | games／verb | くらえー！／くらえー！／接招吧！ | `game-card:game:genshin:aino:skill:790cbc5cc6` | `attacking.svg` | 人物向前揮出拳頭／武器，衝擊線向前方的目標，表攻擊、接招。 |
| 96 | games／expression | すごいなぁ！／すごいなぁ！／真厲害啊！ | `game-card:game:genshin:bennett:join:3f62f9b2b9` | `amazed.svg` | 人物瞪大眼張開嘴、雙手舉起，看著前方閃亮的作品，表「真厲害」。 |
| 97 | games／concrete | カトラリーの準備も完了！／カトラリーの じゅんびも かんりょう！／餐具也準備好了！ | `game-card:game:genshin:escoffier:join:3fb7917853` | `tablesetting.svg` | 餐墊上盤子兩側整齊擺好刀、叉、湯匙，表餐具準備好了。 |
| 98 | games／verb | 回って。／まわって。／轉動吧。 | `game-card:game:genshin:freminet:skill:e5038d29a7` | `spinning.svg` | 陀螺在地上快速旋轉，周圍環繞的轉動箭頭，表轉動。 |
| 99 | games／concrete | 開運招福～／かいうんしょうふく～／開運招福～ | `game-card:game:genshin:gaming:burst:ec9fb22350` | `goodfortune.svg` | 舉手招福的貓偶旁堆著金幣與福袋，光點環繞，表開運招福。 |
| 100 | games／expression | いざ…勝負！／いざ…しょうぶ！／來吧……一決勝負！ | `game-card:game:genshin:jean:skill:1516e791d2` | `duel.svg` | 兩人隔著中線舉劍對峙，表一決勝負。 |
| 101 | games／concrete | 櫻吹雪。／さくらふぶき。／櫻花吹雪。 | `game-card:game:genshin:kamisatoayaka:burst:e28600a7d8` | `cherryblizzard.svg` | 櫻花樹下大量花瓣隨風捲起飛舞，表櫻花吹雪。 |
| 102 | games／expression | ちょっと失礼～！／ちょっと しつれい～！／稍微失禮一下～！ | `game-card:game:genshin:kirara:skill:a4bb3ae2f9` | `excuseme.svg` | 人物側身微微低頭、一手立掌在前，從兩人之間穿過，表「借過、失禮」。 |
| 103 | games／expression | サプライズだよ。／サプライズだよ。／是個驚喜喔。 | `game-card:game:genshin:lyney:skill:b7beb3d284` | `surprisegift.svg` | 打開的禮盒中彈出彩帶與星星，收禮者嚇一跳，表驚喜。 |
| 104 | games／expression | 命令をどうぞ！／めいれいをどうぞ！／請下命令！ | `game-card:game:genshin:manekin:join-order:f08d589226` | `awaitingorders.svg` | 隊員立正敬禮站在指揮者前等待，指揮者泡泡還是空白，表請下命令。 |
| 105 | games／verb | 捕まえた。／つかまえた。／抓到了。 | `game-card:game:genshin:yelan:skill:0530970200` | `caught.svg` | 人物伸出的網子罩住逃走的兔子，表抓到了。 |
| 106 | games／expression | 雨垂れ石をも穿つ。／あまだれ いしをも うがつ。／滴水也能穿石。 | `game-card:game:genshin:xingqiu:join:80ac8faeea` | `dripstone.svg` | 屋簷持續滴下的水滴，把下方石頭打出凹洞，表滴水穿石。 |
| 107 | games／concrete | どの目が出るかしら？／どの めが でるかしら？／會出現哪個點數呢？ | `game-card:game:genshin:yelan:burst:6cefb3312d` | `dice.svg` | 兩顆骰子正在滾動，點數面朝不同方向，表擲骰看出幾點。 |
| 108 | general／concrete | 本人／ほんにん／本人 | `general-listening-65:本人` | `personhimself.svg` | 證件上的照片與站在一旁的當事人臉形一致，虛線相連並圈出本人，表本人。 |
| 109 | general／abstract | 確定／かくてい／確定 | `general-listening-82:確定` | `confirmed.svg` | 計畫書上蓋下「確定」的勾章，旁邊另一張草案被收走，表確定。 |
| 110 | general／verb | 先に／さきに／先行 | `general-listening-81:先に` | `goahead.svg` | 一人先沿路往前走在前方，其他人還留在起點，表先行。 |
| 111 | general／verb | 考える／かんがえる／思考 | `general-listening-23:考える` | `thinking.svg` | 人物手托下巴，泡泡中幾個選項之間有連線，表思考。 |
| 112 | general／adjective | 最新／さいしん／最新 | `general-listening-51:最新` | `latest.svg` | 同一份公告疊了數張，最上面最新的一張閃亮並被圈出，舊的往後淡出，表最新。 |
| 113 | general／quantity | 一回／いっかい／一次 | `general-listening-78:一回` | `onetime.svg` | 門上只敲了一下，一道敲擊線與一枚計次記號，表一次。 |
| 114 | general／abstract | 未確認／みかくにん／未確認 | `general-listening-150:未確認` | `unconfirmed.svg` | 報告書上一欄仍是空白虛線框並旁附沙漏，其他欄已打勾，表未確認。 |
| 115 | general／concrete | 作品／さくひん／作品 | `general-listening-09:作品` | `artwork.svg` | 展示台上的雕塑與牆上的畫作由圍欄隔開，表作品。 |
| 116 | general／quantity | 二杯／にはい／兩杯 | `general-listening-11:二杯` | `twocups.svg` | 桌上並排兩杯裝滿的水，表兩杯。 |
| 117 | general／abstract | 曜日／ようび／星期 | `general-listening-24:曜日` | `dayofweek.svg` | 七格週曆依序放著日月火水木金土的元素符號，表星期（曜日）。 |
| 118 | general／abstract | 無理／むり／勉強；不可能 | `general-listening-40:無理` | `impossible.svg` | 人物面對比自己大好幾倍的巨石，雙手交叉搖頭，表做不到、勉強。 |
| 119 | general／verb | 止める／とめる／停止某物 | `general-listening-53:止める` | `haltmachine.svg` | 手把機器的拉桿拉到停止位置，齒輪的轉動線消失，表使機器停止。 |
| 120 | general／concrete | 贈り物／おくりもの／禮物 | `general-listening-54:贈り物` | `giftbox.svg` | 包裝好的禮盒繫著緞帶與蝴蝶結，旁附一張小卡，表禮物。 |
| 121 | general／abstract | 今から／いまから／從現在起 | `general-listening-55:今から` | `fromnow.svg` | 時間線上現在的紅點起，一條粗箭頭向未來延伸並開始做事，表從現在起。 |
| 122 | general／abstract | 手元／てもと／手邊 | `general-listening-72:手元` | `athand.svg` | 人物坐在桌前，伸手就拿得到的範圍被圈出，裡面放著工具，表手邊。 |
| 123 | general／abstract | 仮／かり／暫定 | `general-listening-82:仮` | `provisional.svg` | 行程表用虛線鉛筆暫時填上，旁邊放著橡皮擦，表暫定。 |
| 124 | general／verb | 見直す／みなおす／重新檢視 | `general-listening-82:見直す` | `reviewagain.svg` | 人物拿放大鏡重新檢視同一份表，回轉箭頭表再看一次，表重新檢視。 |
| 125 | general／concrete | 控室／ひかえしつ／休息室 | `general-listening-86:控室` | `waitingroom.svg` | 房間內一排椅子上坐著等待的人，牆上掛鐘，表休息室、候診室。 |
| 126 | general／abstract | 自分で／じぶんで／自己 | `general-listening-99:自分で` | `byoneself.svg` | 人物獨自完成搬運，旁人只在遠處看，被圈出的那位一手指向自己，表自己（親自）。 |
| 127 | general／abstract | 正面／しょうめん／正面 | `general-listening-113:正面` | `frontside.svg` | 一棟建築的正面立面被圈出，人物正面面對它，側面淡化，表正面。 |
| 128 | general／verb | 動かす／うごかす／移動 | `general-listening-125:動かす` | `movingobject.svg` | 人物雙手把水晶從原位推到另一個位置，原位留虛線輪廓，表移動（使移動）。 |
| 129 | general／abstract | 作戦／さくせん／戰術 | `general-listening-134:作戦` | `battleplan.svg` | 桌上攤開地圖，箭頭與標記畫出進攻路線，旁人指點，表作戰計畫、戰術。 |
| 130 | general／abstract | 消費／しょうひ／消耗 | `general-listening-136:消費` | `consumption.svg` | 能量條隨使用一格格被耗掉，往下的箭頭與用掉的部分變淡，表消耗。 |
| 131 | general／concrete | 術者／じゅつしゃ／施術者 | `general-listening-145:術者` | `caster.svg` | 站在魔法陣中央、手持杖發動結界的人物被圈出，表施術者。 |
| 132 | general／verb | 補う／おぎなう／補足 | `general-listening-153:補う` | `supplement.svg` | 一排物品中的空缺被補上缺少的那一個，箭頭把它放進去，表補足。 |
| 133 | general／abstract | 明朝／みょうちょう／明天早上 | `general-listening-153:明朝` | `tomorrowmorning.svg` | 日曆箭頭指向明天那一格，格內是初升太陽，表明天早上。 |
| 134 | general／verb | 省略／しょうりゃく／省略 | `general-listening-154:省略` | `omission.svg` | 步驟條中間一步被虛線框起跳過，箭頭從前一步直接連到後一步，表省略。 |
| 135 | general／quantity | 部数／ぶすう／份數 | `general-listening-167:部数` | `copiescount.svg` | 印好的同一份資料疊成數疊，人物逐疊點數份數，表份數。 |
| 136 | general／concrete | 持ち物／もちもの／攜帶的物品 | `general-listening-03:持ち物` | `belongings.svg` | 出發前把水壺、地圖、手電筒等隨身物品排在背包旁，表攜帶的物品。 |
| 137 | general／concrete | 食料／しょくりょう／糧食 | `general-listening-08:食料` | `provisions.svg` | 麻袋裝的米、乾糧與水壺堆在一起，表糧食。 |
| 138 | general／abstract | だけ／だけ／只有；僅 | `general-listening-08:だけ` | `only.svg` | 一排空位中只剩一個放著東西並被圈出，表只有、僅。 |
| 139 | general／concrete | 忘れ物／わすれもの／遺忘的物品 | `general-listening-08:忘れ物` | `lostitem.svg` | 人已離開的座位上留下一把傘，失物被圈出，表遺忘的物品、失物。 |
| 140 | general／quantity | 一枚／いちまい／一張 | `general-listening-11:一枚` | `onesheet.svg` | 桌上只有一張薄紙，表一張。 |
| 141 | general／quantity | 二枚／にまい／兩張 | `general-listening-11:二枚` | `twosheets.svg` | 桌上兩張薄紙並排，表兩張。 |
| 142 | general／quantity | 一本／いっぽん／一根；一瓶 | `general-listening-11:一本` | `onebottle.svg` | 桌上只有一瓶水，表一瓶（細長物一根）。 |
| 143 | general／quantity | 二本／にほん／兩根；兩瓶 | `general-listening-11:二本` | `twobottles.svg` | 桌上兩瓶水並排，表兩瓶（細長物兩根）。 |
| 144 | general／concrete | メモ／メモ／筆記；便條 | `general-listening-15:メモ` | `memonote.svg` | 牆上貼著一張小便條，上有幾行手寫線與圖釘，表便條、筆記。 |
| 145 | general／abstract | 朝早く／あさはやく／一大早 | `general-listening-18:朝早く` | `earlymorning.svg` | 天還暗、地平線剛透出微光，鬧鐘響、人物起身，表一大早。 |
| 146 | general／abstract | 夜遅く／よるおそく／深夜 | `general-listening-18:夜遅く` | `latenight.svg` | 窗外深夜的月亮高掛，人物仍坐在桌燈下打哈欠，表深夜。 |
| 147 | general／expression | 仕方ない／しかたない／沒辦法 | `general-listening-19:仕方ない` | `nochoice.svg` | 人物面對關著的店門聳肩攤手，表沒辦法、只好如此。 |
| 148 | general／concrete | 雨具／あまぐ／雨具 | `general-listening-21:雨具` | `raingear.svg` | 雨傘、雨衣與雨靴並排，表雨具。 |
| 149 | general／concrete | 管理人／かんりにん／管理員 | `general-listening-22:管理人` | `caretaker.svg` | 拿著一串鑰匙與掃帚、站在建築入口的管理員，表管理員。 |
| 150 | general／abstract | 昼間／ひるま／白天 | `general-listening-23:昼間` | `daytime.svg` | 整段天空弧線從日出到日落都被標亮，太陽在中間，與夜晚分開，表白天。 |
| 151 | general／abstract | 営業時間／えいぎょうじかん／營業時間 | `general-listening-24:営業時間` | `openinghours.svg` | 店門旁的時鐘以扇形標出開店到關店的時段，表營業時間。 |
| 152 | general／expression | 知らない／しらない／不知道 | `general-listening-24:知らない` | `dontknow.svg` | 人物聳肩、泡泡裡是一片空白並有虛線問號形邊框，表不知道。 |
| 153 | general／verb | 会いに行く／あいにいく／去見面 | `general-listening-25:会いに行く` | `goingtomeet.svg` | 人物沿箭頭走去，目的地那端有正在等待的朋友，表去見面。 |
| 154 | general／verb | 聞きに行く／ききにいく／去詢問 | `general-listening-25:聞きに行く` | `goingtoask.svg` | 人物沿箭頭走向情報站櫃檯，泡泡是要問的事，表去詢問。 |
| 155 | general／verb | 買いに行く／かいにいく／去購買 | `general-listening-25:買いに行く` | `goingtobuy.svg` | 人物拿著錢包沿箭頭走向藥店，表去購買。 |
| 156 | general／verb | 走っていく／はしっていく／跑著離去 | `general-listening-26:走っていく` | `runningaway.svg` | 說話者站在原地，另一人跑著離開、背影朝遠方，箭頭向外，表跑著離去。 |
| 157 | general／verb | 歩いてくる／あるいてくる／走著過來 | `general-listening-26:歩いてくる` | `walkingtoward.svg` | 說話者站在原地，另一人從遠處正面走向說話者，箭頭向內，表走著過來。 |
| 158 | general／adverb | あとで／あとで／待會兒 | `general-listening-26:あとで` | `later.svg` | 時鐘往後撥一小段，待辦卡片被推到之後的格子，表待會兒、稍後。 |
| 159 | general／verb | 読める／よめる／能讀 | `general-listening-27:読める` | `canread.svg` | 人物看著告示上的字形，頭上亮燈並打勾，表能讀、讀得懂。 |
| 160 | general／verb | 読めない／よめない／讀不懂 | `general-listening-27:読めない` | `cannotread.svg` | 人物看著同一張告示上的字形，頭上打叉、歪頭困惑，表讀不懂。 |
| 161 | general／verb | 話せる／はなせる／能說 | `general-listening-27:話せる` | `canspeak.svg` | 人物順暢地說話，泡泡中句子線連續流出並打勾，對方點頭，表能說。 |
| 162 | general／abstract | 以前／いぜん／以前 | `general-listening-27:以前` | `formerly.svg` | 時間線上過去那一段被圈出，泡泡中的人物站在左側舊時位置，表以前。 |
| 163 | general／abstract | 今まで／いままで／直到現在 | `general-listening-27:今まで` | `untilnow.svg` | 一條粗線從過去的起點一路延伸到現在的紅點並在此停住，表直到現在。 |
| 164 | general／verb | 簡単になる／かんたんになる／變簡單 | `general-listening-27:簡単になる` | `gettingeasier.svg` | 同一座山從陡峭變成平緩，箭頭由左到右，人物腳步輕鬆，表變簡單。 |
| 165 | general／verb | 強くなる／つよくなる／變強 | `general-listening-27:強くなる` | `gettingstronger.svg` | 同一人從舉不起的小啞鈴到輕鬆舉起大啞鈴，箭頭表變強。 |
| 166 | general／verb | 買える／かえる／買得起；能買 | `general-listening-28:買える` | `canbuy.svg` | 手中的錢幣夠付麵包的價牌，打勾，表買得起、能買。 |
| 167 | general／verb | 買えない／かえない／買不了 | `general-listening-28:買えない` | `cannotbuy.svg` | 手中只有一枚錢幣，不夠付價牌上的三枚，打叉，表買不起、買不了。 |
| 168 | general／abstract | 周り／まわり／周圍 | `general-listening-29:周り` | `surroundings.svg` | 人物站在中央，周圍一圈的樹、房子與路都被環形虛線圍住，表周圍。 |
| 169 | general／verb | 演奏／えんそう／演奏 | `general-listening-32:演奏` | `performingmusic.svg` | 演奏者拉小提琴，音色弧線傳向前排聽眾，表演奏。 |
| 170 | general／abstract | 次／つぎ／下次；下一個 | `general-listening-36:次` | `nexttime.svg` | 月曆上今天的事件格打勾，箭頭跳到下一次同類事件的格子並圈出，表下次。 |
| 171 | general／verb | 繰り返す／くりかえす／重複 | `general-listening-38:繰り返す` | `repeating.svg` | 同一動作沿環形箭頭一圈又一圈，表重複。 |
| 172 | general／quantity | 九時／くじ／九點 | `general-listening-38:九時` | `nineoclock.svg` | 時鐘短針指在九、長針指在十二，表九點。 |
| 173 | general／quantity | 七時／しちじ／七點 | `general-listening-38:七時` | `sevenoclock.svg` | 時鐘短針指在七、長針指在十二，表七點。 |
| 174 | general／quantity | 一時／いちじ／一點 | `general-listening-41:一時` | `oneoclock.svg` | 時鐘短針指在一、長針指在十二，表一點。 |
| 175 | general／quantity | 三時／さんじ／三點 | `general-listening-45:三時` | `threeoclock.svg` | 時鐘短針指在三、長針指在十二，表三點。 |
| 176 | general／quantity | 八時／はちじ／八點 | `general-listening-45:八時` | `eightoclock.svg` | 時鐘短針指在八、長針指在十二，表八點。 |
| 177 | general／verb | 聞き間違い／ききまちがい／聽錯 | `general-listening-38:聞き間違い` | `mishearing.svg` | 對方說的是鐘的聲音，聽者心中卻成了笛子，兩者打叉，表聽錯。 |
| 178 | general／concrete | 発音／はつおん／發音 | `general-listening-38:発音` | `pronunciation.svg` | 張開的嘴型與舌位剖面，音波從口中出來，表發音。 |
| 179 | general／concrete | 快速／かいそく／快速列車 | `general-listening-44:快速` | `rapidtrain.svg` | 快速列車沿路線越過中間幾個小站不停，只停大站，表快速列車。 |
| 180 | general／concrete | 各駅／かくえき／各站 | `general-listening-44:各駅` | `localtrain.svg` | 普通列車在路線上的每一站都停，每站都有小弧線，表各站停車。 |
| 181 | general／verb | 発車／はっしゃ／發車 | `general-listening-44:発車` | `departingtrain.svg` | 列車離開月台向前開動，車門關上、速度線在後，表發車。 |
| 182 | general／quantity | 一泊／いっぱく／一晚 | `general-listening-45:一泊` | `onenight.svg` | 旅館床上一個夜晚的月亮與一個行李箱，表住一晚。 |
| 183 | general／quantity | 二泊／にはく／兩晚 | `general-listening-45:二泊` | `twonights.svg` | 旅館床上方有兩輪月亮，表住兩晚。 |
| 184 | general／verb | 記入／きにゅう／填寫 | `general-listening-45:記入` | `fillingform.svg` | 手握筆在表格欄位中逐格填寫，表填寫。 |
| 185 | general／verb | 無理する／むりする／勉強自己 | `general-listening-47:無理する` | `overexerting.svg` | 臉色不好、冒冷汗的人仍硬撐著搬重箱，膝蓋發抖，表勉強自己。 |
| 186 | general／abstract | 不要／ふよう／不需要 | `general-listening-49:不要` | `notneeded.svg` | 清單上一個項目被劃掉、對應的物品被放回架上，表不需要。 |
| 187 | general／abstract | 手前／てまえ／前面；尚未到達處 | `general-listening-50:手前` | `nearside.svg` | 人物站在橋的這一頭，靠近自己這側的岸邊被圈出，對岸淡化，表前面（近側）。 |
| 188 | general／abstract | 発表／はっぴょう／發布 | `general-listening-51:発表` | `announcement.svg` | 人員在公告板上貼出結果，大家圍過來看，表發布、公布。 |
| 189 | general／concrete | 祝い／いわい／祝賀 | `general-listening-54:祝い` | `celebration.svg` | 大家舉杯，蛋糕與彩帶，表祝賀。 |
| 190 | general／concrete | 記念／きねん／紀念 | `general-listening-54:記念` | `commemoration.svg` | 大家在活動招牌前排排站拍紀念照，相機閃光，表紀念。 |
| 191 | general／verb | 分ける／わける／分組 | `general-listening-57:分ける` | `grouping.svg` | 一群人被分成兩組，分隔線與兩個框，表分組。 |
| 192 | general／verb | 調整／ちょうせい／協調 | `general-listening-60:調整` | `adjusting.svg` | 兩人的行事曆對照，把各自的時段挪動到重疊的同一格，表協調、調整。 |
| 193 | general／verb | 買い出し／かいだし／採買 | `general-listening-60:買い出し` | `groceryrun.svg` | 人物提著裝滿蔬菜麵包的購物袋從市場走回，表採買。 |
| 194 | general／concrete | 食材／しょくざい／食材 | `general-listening-60:食材` | `ingredients.svg` | 砧板上排列著生的蔬菜、肉與蛋，尚未料理，表食材。 |
| 195 | general／concrete | 会場／かいじょう／活動場地 | `general-listening-60:会場` | `venue.svg` | 搭好舞台、旗幟與座位的活動場地全景，表活動場地。 |
| 196 | general／verb | 設営／せつえい／場地搭設 | `general-listening-60:設営` | `settingup.svg` | 人們一起把帳篷立起、拉繩固定樁，表場地搭設。 |
| 197 | general／concrete | 通行止め／つうこうどめ／禁止通行 | `general-listening-65:通行止め` | `roadclosed.svg` | 道路中央擺著紅白條紋的禁止通行柵欄，行人的箭頭被擋，表禁止通行。 |
| 198 | general／verb | つく／つく／燈亮起 | `general-listening-66:つく` | `lightson.svg` | 天花板的燈從暗到亮，光線向下散開，表燈亮起（點燈）。 |
| 199 | general／verb | 消灯／しょうとう／熄燈 | `general-listening-88:消灯` | `lightsoff.svg` | 同一盞燈熄滅變暗，室內變灰，表熄燈。 |
| 200 | general／verb | 持ち歩く／もちあるく／隨身攜帶 | `general-listening-66:持ち歩く` | `carryingaround.svg` | 人物腰間掛著小提燈與水壺走動，箭頭表到哪都帶著，表隨身攜帶。 |
| 201 | general／abstract | 緊急／きんきゅう／緊急 | `general-listening-67:緊急` | `emergency.svg` | 救護車紅燈閃爍、急速駛來，人們讓路，表緊急。 |
| 202 | general／concrete | 技師／ぎし／技師 | `general-listening-73:技師` | `engineer.svg` | 戴安全帽、拿設計圖對照機械的技師，表技師。 |
| 203 | general／concrete | 整備士／せいびし／維修技師 | `general-listening-73:整備士` | `mechanic.svg` | 穿工作服、手持扳手修理車輪的維修技師，表維修技師。 |
| 204 | general／abstract | 本物／ほんもの／真品 | `general-listening-74:本物` | `genuine.svg` | 同樣兩個龍形，一個是發光投影（虛線），一個是有影子的實體並被圈出，表真品、真的。 |
| 205 | general／abstract | 形／かたち／形狀 | `general-listening-74:形` | `shape.svg` | 一團煙的輪廓被粗線描出外形，旁有圓、三角、方塊示例，表形狀。 |
| 206 | general／concrete | 映像／えいぞう／影像 | `general-listening-74:映像` | `footage.svg` | 投影機投出光束，牆上的畫面裡有移動的影像（連續畫格），表影像。 |
| 207 | general／concrete | 仕組み／しくみ／機制 | `general-listening-74:仕組み` | `mechanism.svg` | 機器外殼剖開，露出內部互相咬合的齒輪與連桿，表機制、運作方式。 |
| 208 | general／quantity | 二回／にかい／兩次 | `general-listening-78:二回` | `twice.svg` | 門上敲了兩下，兩道敲擊線與兩枚計次記號，表兩次。 |
| 209 | general／verb | 鳴らす／ならす／使鳴響 | `general-listening-78:鳴らす` | `ringingbell.svg` | 人物拉繩敲響鐘，聲波向外擴散，表使鳴響。 |
| 210 | general／verb | 更新／こうしん／更新 | `general-listening-79:更新` | `updating.svg` | 公告板上舊表被換成新表，旁邊環形更新箭頭，表更新。 |
| 211 | general／verb | 稽古／けいこ／排練 | `general-listening-80:稽古` | `rehearsal.svg` | 空座位的舞台上，演員拿著劇本走位，導演在旁指示，表排練。 |
| 212 | general／verb | 取ってくる／とってくる／去拿回來 | `general-listening-81:取ってくる` | `fetching.svg` | 人物走去架上拿繃帶，再沿迴轉箭頭帶回原處，表去拿回來。 |
| 213 | general／verb | 移す／うつす／移動；轉移 | `general-listening-83:移す` | `relocating.svg` | 箱子從左邊房間沿箭頭被搬到右邊的另一處，原處留虛線，表移動、轉移。 |
| 214 | general／concrete | 放送／ほうそう／廣播 | `general-listening-84:放送` | `broadcast.svg` | 柱上的擴音喇叭播出聲音，聲波傳向多處，表廣播。 |
| 215 | general／verb | 褒められる／ほめられる／被稱讚 | `general-listening-86:褒められる` | `beingpraised.svg` | 他人摸頭並豎拇指稱讚，被稱讚的一方被圈出、臉紅開心，表被稱讚。 |
| 216 | general／abstract | 速さ／はやさ／速度 | `general-listening-87:速さ` | `speed.svg` | 速度計的指針從低處擺到中間，旁有速度線，表速度。 |
| 217 | general／quantity | 秒／びょう／秒 | `general-listening-88:秒` | `seconds.svg` | 碼錶秒針快速走過一小段，滴答聲線，表秒。 |
| 218 | general／verb | 開門／かいもん／開門 | `general-listening-89:開門` | `gateopening.svg` | 大門左右兩扇向外打開，人們準備通過，表開門（啟用通行）。 |
| 219 | general／verb | 止める／とめる／制止 | `general-listening-92:止める` | `stopsomeone.svg` | 一人伸手拉住正要衝出去的同伴手臂，把他攔下，表制止。 |
| 220 | general／abstract | 以内／いない／以內 | `general-listening-93:以内` | `within.svg` | 時間線上一段期限框起，事件點落在框內而非框外，表以內。 |
| 221 | general／verb | 復旧／ふっきゅう／恢復 | `general-listening-94:復旧` | `restoration.svg` | 停電的電線修好後，燈再度亮起、指針回到正常，表恢復運作。 |
| 222 | general／concrete | 任務／にんむ／任務 | `general-listening-99:任務` | `mission.svg` | 蓋有封印的任務卷軸展開，上有地圖與目標標記，表任務。 |
| 223 | general／verb | 押される／おされる／被推 | `general-listening-102:押される` | `beingpushed.svg` | 被推的一方被圈出、身體前傾踉蹌，推的手從後方來，箭頭朝被推者，表被推。 |
| 224 | general／verb | 使わせる／つかわせる／讓使用 | `general-listening-103:使わせる` | `lettinguse.svg` | 隊長把裝置遞給新人並點頭允許，新人開始操作，表讓（某人）使用。 |
| 225 | general／verb | 運ばされる／はこばされる／被要求搬運 | `general-listening-104:運ばされる` | `madetocarry.svg` | 班長指著木箱下令，被要求的人不情願地扛著木箱，表被要求搬運。 |
| 226 | general／concrete | 高台／たかだい／高地 | `general-listening-105:高台` | `highground.svg` | 人物爬上高起的台地，從上方眺望下面的村子，表高地。 |
| 227 | general／abstract | 視界／しかい／視野 | `general-listening-105:視界` | `fieldofview.svg` | 人物眼睛前方展開扇形視野範圍，範圍內的樹被看見，外面的淡化，表視野。 |
| 228 | general／abstract | 期間／きかん／期間 | `general-listening-106:期間` | `period.svg` | 日曆上連續幾天的一段被括號框起，起點到終點的雙箭頭，表期間。 |
| 229 | general／concrete | 詰所／つめしょ／值班室 | `general-listening-107:詰所` | `guardpost.svg` | 大門旁的值班小屋，窗內有值班人員與鑰匙架，表值班室。 |
| 230 | general／abstract | 異常／いじょう／異常 | `general-listening-110:異常` | `abnormality.svg` | 儀表的指針衝進紅區、警示燈閃紅，表異常。 |
| 231 | general／abstract | 未定／みてい／未定 | `general-listening-111:未定` | `undecided.svg` | 日曆的某一格只有虛線框，兩個候選日之間的箭頭來回，表未定。 |
| 232 | general／concrete | 裏口／うらぐち／後門 | `general-listening-113:裏口` | `backdoor.svg` | 倉庫後側的小門被圈出，正面大門在另一邊淡化，表後門。 |
| 233 | general／verb | 訪問／ほうもん／拜訪 | `general-listening-114:訪問` | `visiting.svg` | 人物帶著伴手禮來到別人家門口按門鈴，屋主出來迎接，表拜訪。 |
| 234 | general／verb | 見回り／みまわり／巡視 | `general-listening-116:見回り` | `patrol.svg` | 提燈的巡邏者沿著虛線環路繞行城鎮，表巡視、巡查。 |
| 235 | general／verb | 増やす／ふやす／增加 | `general-listening-116:増やす` | `increasing.svg` | 三堆積塊由少到多排列，向上的箭頭，表增加。 |
| 236 | general／verb | 連れていく／つれていく／帶往 | `general-listening-120:連れていく` | `takingalong.svg` | 人物牽著村民的手一起走向山丘，前方帶路、後方跟著，表帶往。 |
| 237 | general／abstract | 方角／ほうがく／方向 | `general-listening-121:方角` | `direction.svg` | 人物手持指南針，粗箭頭指向前方某個方向，表方向、方角。 |
| 238 | general／concrete | 射手／しゃしゅ／射手 | `general-listening-123:射手` | `archer.svg` | 拉滿弓的射手站在城牆上，被圈出，表射手。 |
| 239 | general／concrete | 味方／みかた／我方 | `general-listening-123:味方` | `ally.svg` | 同色臂章的隊友並肩站在同一側，被圈為我方，對面是敵人，表我方。 |
| 240 | general／concrete | 解毒／げどく／解毒 | `general-listening-126:解毒` | `antidote.svg` | 綠色藥瓶讓中毒變紫的手恢復正常膚色，表解毒。 |
| 241 | general／abstract | 体力／たいりょく／體力 | `general-listening-126:体力` | `stamina.svg` | 人物旁的體力條是滿的紅色心形計量，跑步有勁，表體力。 |
| 242 | general／verb | 流す／ながす／沖走 | `general-listening-127:流す` | `washaway.svg` | 雨水沖過地面，把原本的腳印沖淡沖走，箭頭順水流，表沖走。 |
| 243 | general／verb | 止む／やむ／雨停 | `general-listening-127:止む` | `rainstops.svg` | 雲間的雨絲停住，雲後露出太陽，傘被收起，表雨停。 |
| 244 | general／verb | 現れる／あらわれる／出現 | `general-listening-127:現れる` | `appearing.svg` | 原本空著的地面上，腳印從無到有地出現，閃光表示出現。 |
| 245 | general／verb | 見間違える／みまちがえる／看錯 | `general-listening-128:見間違える` | `misseeing.svg` | 遠處其實是披斗篷的陌生人，看的人心中卻以為是隊長（戴帽），兩者打叉，表看錯。 |
| 246 | general／verb | 隠す／かくす／藏起 | `general-listening-128:隠す` | `hidingobject.svg` | 人物用兜帽與手把臉遮住、物品被藏在身後，表藏起。 |
| 247 | general／verb | 被る／かぶる／戴上 | `general-listening-128:被る` | `puttingonhat.svg` | 人物雙手把帽子往頭上戴，向下箭頭，表戴上（帽子等）。 |
| 248 | general／verb | 通り過ぎる／とおりすぎる／走過 | `general-listening-128:通り過ぎる` | `passingby.svg` | 披斗篷的人從看的人面前橫越走過，不停下，虛線軌跡從一側到另一側，表走過。 |
| 249 | general／verb | 下りる／おりる／往下走 | `general-listening-131:下りる` | `goingdownstairs.svg` | 人物抓著繩索沿岩壁往下爬，向下箭頭，表往下走、下去。 |
| 250 | general／concrete | 隊列／たいれつ／隊列 | `general-listening-133:隊列` | `formation.svg` | 隊員排成整齊的縱列沿同一方向前進，表隊列。 |
| 251 | general／abstract | 先頭／せんとう／隊伍最前方 | `general-listening-133:先頭` | `headofline.svg` | 隊列最前方的成員被圈出，表隊伍最前方（先頭）。 |
| 252 | general／abstract | 最後尾／さいこうび／隊伍最後方 | `general-listening-133:最後尾` | `endofline.svg` | 隊列最後方的成員被圈出，表隊伍最後方（最後尾）。 |
| 253 | general／concrete | 治療役／ちりょうやく／治療人員 | `general-listening-133:治療役` | `healer.svg` | 帶著藥箱、手發出治療光芒的隊員被圈出，表治療人員。 |
| 254 | general／concrete | 護衛／ごえい／護衛 | `general-listening-133:護衛` | `bodyguard.svg` | 持盾的護衛站在被保護者身旁、面向外側警戒，表護衛。 |
| 255 | general／quantity | 三歩／さんぽ／三步 | `general-listening-134:三歩` | `threesteps.svg` | 人物後退，地上三個腳印間距相等，表三步。 |
| 256 | general／verb | 崩す／くずす／打亂 | `general-listening-134:崩す` | `breakformation.svg` | 原本整齊的隊列被打亂，成員散向各處，表打亂（隊形）。 |
| 257 | general／verb | 叫ぶ／さけぶ／大喊 | `general-listening-134:叫ぶ` | `shouting.svg` | 人物雙手圍在嘴邊大聲喊叫，粗大的聲波向遠方，表大喊。 |
| 258 | general／abstract | 損害／そんがい／損傷 | `general-listening-135:損害` | `damage.svg` | 鎧甲表面出現裂痕與缺口，生命條被扣掉一段，表損傷、損害。 |
| 259 | general／abstract | 無効／むこう／無效 | `general-listening-135:無効` | `noeffect.svg` | 火焰打在防護罩上整個彈開，被保護者毫髮無傷，表無效。 |
| 260 | general／abstract | 待ち時間／まちじかん／等待時間 | `general-listening-136:待ち時間` | `waitingtime.svg` | 人物坐著等待，旁邊沙漏與時鐘標出要等的一段時間，表等待時間。 |
| 261 | general／quantity | 三分／さんぷん／三分鐘 | `general-listening-136:三分` | `threeminutes.svg` | 時鐘長針只走過一小格扇形（約三分鐘），表三分鐘。 |
| 262 | general／quantity | 五分／ごふん／五分鐘 | `general-listening-136:五分` | `fiveminutes.svg` | 時鐘長針走過一格大格扇形（五分鐘），表五分鐘。 |
| 263 | general／abstract | 同盟／どうめい／同盟 | `general-listening-139:同盟` | `alliance.svg` | 兩支不同旗幟的隊伍握手結盟，旗桿交叉，表同盟。 |
| 264 | general／abstract | 先遣隊／せんけんたい／先遣隊 | `general-listening-142:先遣隊` | `advanceparty.svg` | 少數幾人已先過橋到對岸，本隊仍在這頭，先行的一組被圈出，表先遣隊。 |
| 265 | general／abstract | 後続／こうぞく／後續隊伍 | `general-listening-142:後続` | `followingparty.svg` | 前面隊伍已出發，之後還在岸邊等待跟上的一組被圈出，表後續隊伍。 |
| 266 | general／abstract | 本隊／ほんたい／主隊 | `general-listening-142:本隊` | `mainforce.svg` | 人數最多的主要隊伍集中在中央，旗手在其中，被大圈圈出，表主隊。 |
| 267 | general／verb | 偵察／ていさつ／偵察 | `general-listening-142:偵察` | `scouting.svg` | 偵察者伏低身子、拿望遠鏡從岩石後窺看敵營，表偵察。 |
| 268 | general／concrete | 防衛線／ぼうえいせん／防線 | `general-listening-143:防衛線` | `defenseline.svg` | 一排盾牌與木柵連成一條橫線，敵人被擋在線外，表防線。 |
| 269 | general／concrete | 囮／おとり／誘餌 | `general-listening-143:囮` | `decoy.svg` | 一個人偶誘餌插在空地吸引敵人，真正的隊伍躲在旁邊，表誘餌。 |
| 270 | general／abstract | 境界／きょうかい／界線 | `general-listening-143:境界` | `boundary.svg` | 地面上一條界線把兩區分開，人物停在線的這一側不越過，表界線。 |
| 271 | general／abstract | 停戦／ていせん／停火 | `general-listening-144:停戦` | `ceasefire.svg` | 兩方放下武器，中間插著白旗，表停火。 |
| 272 | general／verb | 捨てる／すてる／丟棄 | `general-listening-144:捨てる` | `throwaway.svg` | 人物把東西丟進垃圾桶，向下的拋物箭頭，表丟棄。 |
| 273 | general／verb | 通す／とおす／使通過 | `general-listening-145:通す` | `lettingthrough.svg` | 人物讓到旁邊並伸手示意，同伴從讓出的門口通過，表讓人通過。 |
| 274 | general／verb | 砕ける／くだける／碎裂 | `general-listening-146:砕ける` | `shattering.svg` | 寶石受力後碎裂成多片四散，碎片與裂線，表碎裂。 |
| 275 | general／concrete | 配達員／はいたついん／配送員 | `general-listening-147:配達員` | `courier.svg` | 戴帽背郵包、手拿包裹的配送員，表配送員。 |
| 276 | general／verb | 担ぐ／かつぐ／扛著 | `general-listening-154:担ぐ` | `shouldering.svg` | 人物把一捆毛毯扛在肩上走，表扛著。 |
| 277 | general／verb | 責める／せめる／責備 | `general-listening-155:責める` | `blaming.svg` | 一人指著對方生氣責備，被指的人低頭縮肩，表責備。 |
| 278 | general／concrete | 積荷／つみに／貨物 | `general-listening-157:積荷` | `cargo.svg` | 貨車上蓋著布的貨物堆，表貨物。 |
| 279 | general／concrete | 許可証／きょかしょう／許可證 | `general-listening-158:許可証` | `permit.svg` | 蓋著官印、繫著繩的通行許可證，出示給門衛看，表許可證。 |
| 280 | general／verb | 独り言／ひとりごと／自言自語 | `general-listening-159:独り言` | `talkingtoself.svg` | 人物獨自一人低聲說話，泡泡繞回自己身上，周圍沒有聽者，表自言自語。 |
| 281 | general／verb | 積み直す／つみなおす／重新裝載 | `general-listening-161:積み直す` | `reloading.svg` | 箱子被從貨台卸下後換個位置重新堆上，環形箭頭，表重新裝載。 |
| 282 | general／verb | 降ろす／おろす／卸下 | `general-listening-161:降ろす` | `unloading.svg` | 人物把箱子從船上卸到碼頭，向下箭頭，表卸下。 |
| 283 | general／abstract | 明晩／みょうばん／明晚 | `general-listening-162:明晩` | `tomorrownight.svg` | 日曆箭頭指向明天那一格，格內是月亮與星星，表明晚。 |
| 284 | general／concrete | 救護室／きゅうごしつ／救護室 | `general-listening-164:救護室` | `firstaidroom.svg` | 有病床、藥櫃與擔架的救護房間，表救護室。 |
| 285 | general／abstract | 逆／ぎゃく／相反 | `general-listening-166:逆` | `reverse.svg` | 同樣兩個事件，原本的順序被調換，交叉的箭頭表相反。 |
| 286 | general／verb | 手書き／てがき／手寫 | `general-listening-167:手書き` | `handwriting.svg` | 手握筆一筆一畫地寫，紙上是彎曲的手寫線（不是印刷字），表手寫。 |
| 287 | general／concrete | 同僚／どうりょう／同事 | `general-listening-168:同僚` | `colleague.svg` | 同一間辦公室同樣識別證的兩人並肩工作，表同事。 |
| 288 | general／adjective | 親しい／したしい／親近 | `general-listening-168:親しい` | `closefriends.svg` | 兩人勾肩搭背、笑著靠近，距離很近，表親近。 |
| 289 | general／concrete | 夜道／よみち／夜路 | `general-listening-170:夜道` | `nightroad.svg` | 夜晚的山路上路燈稀疏，只有一盞照亮一小段，表夜路。 |
| 290 | general／abstract | 過去／かこ／過去 | `general-listening-172:過去` | `past.svg` | 時間線上現在紅點以左的整段被淡色標出，回頭的箭頭，表過去。 |
| 291 | general／verb | 早める／はやめる／提早 | `general-listening-172:早める` | `movingearlier.svg` | 日曆上的預定從較晚的格子被拉到前面的格子，向左箭頭，表提早。 |
| 292 | general／verb | 途切れる／とぎれる／中斷 | `general-listening-174:途切れる` | `cutoff.svg` | 說話中途泡泡被截斷，句子線斷開，表中斷。 |
| 293 | general／verb | やり直す／やりなおす／重新做 | `general-listening-176:やり直す` | `redo.svg` | 做錯的一份被打叉放到旁邊，回轉箭頭指向重新開始的新一份，表重新做。 |
| 294 | general／concrete | 電波／でんぱ／電波 | `general-listening-179:電波` | `signalwaves.svg` | 天線塔向外發出一圈圈電波，表電波。 |
| 295 | general／abstract | 圏外／けんがい／收訊範圍外 | `general-listening-179:圏外` | `nosignal.svg` | 手機訊號格全空並打叉，遠處的電波到不了，表收訊範圍外。 |
| 296 | general／concrete | 犯人／はんにん／犯人 | `general-listening-178:犯人` | `culprit.svg` | 戴面罩抱著偷來的袋子溜走的人，腳印與追查的放大鏡，表犯人。 |
| 297 | general／verb | 漏らす／もらす／洩漏 | `general-listening-178:漏らす` | `leakingsecret.svg` | 原本上鎖的盒子開了縫，紙條從縫中飄出傳給外人，表洩漏（秘密）。 |
| 298 | general／abstract | 裏切る／うらぎる／背叛 | `general-listening-178:裏切る` | `betrayal.svg` | 並肩的同伴之一轉身把情報交給對方陣營，原本相連的繩斷開，表背叛。 |
| 299 | general／abstract | 別人／べつじん／別人 | `general-listening-171:別人` | `differentperson.svg` | 兩個穿同樣披風的人，帽子下的臉不同，中間打叉表示不是同一個，表別人（不是同一人）。 |
| 300 | general／verb | 本人確認／ほんにんかくにん／身分核對 | `general-listening-173:本人確認` | `idverification.svg` | 櫃檯人員拿著對方的證件，對照照片與本人的臉，打勾，表身分核對。 |
