# T162：完成剩餘870張卡的配圖（全站5909／5909）

基準main `ab1c028`（T161／[PR #167](https://github.com/frobel0520/nihongo-lab/pull/167)，單字圖片已改為獨立下載）。開工時核對：無未合併PR、無其他在途批次。rebase合併會改寫提交雜湊，本文件不引用合併前雜湊；合併前後對照記在T162 PR發布紀錄。

T160後仍缺圖的870張卡（799個詞義群組）逐張重新盤點：先核對既有1614張圖能否共用，再為剩餘詞義設計新圖。結果：**628張新圖**＋**113筆共用既有圖**＋**129筆共用本輪新圖**＝870筆新增映射；共用的242筆中231筆跨來源單元、11筆同課。全站5909卡全部有圖；SVG 1614→2242。目標是每張卡都有語義適切的圖，不是以圖數為目標；資產數、義項數與有圖卡片數各自不同，不互相代換。

| 類別 | T160後 | T162後 | 本輪新增 |
|---|---|---|---|
| N5 | 639／711 | 711／711 | 72 |
| 通用聽解 | 3966／4500 | 4500／4500 | 534 |
| 動畫 | 65／80 | 80／80 | 15 |
| 遊戲 | 369／618 | 618／618 | 249 |
| 全站 | 5039／5909（85.28%） | 5909／5909（100%） | 870 |

## 核對方式

- 每筆映射核對精確ID、日文、讀音、原翻譯與該課對話／例句；runtime仍只比對凍結的ID／word／reading／zh四欄。
- 同詞同義才共用，同形異義分開；共用既有圖前讀其構圖說明，確認不是只字面相同。逐筆理由見[sharing audit](vocab-illustration-t162-sharing-audit.json)與[完整映射CSV](vocab-illustration-t162-mappings.csv)。
- 前幾輪刻意拒絕的配對全部保留：例如錢幣「一枚」不用紙張圖、火把「一本」不用瓶子圖、「似る」比較聲音不用輪廓相似圖、口信「届く」不用伸手搆到或包裹圖、寶石當鑰匙不用金屬鑰匙圖、「腹を括る」不用綁木柴圖、「守る」（不背叛同伴）不用持盾守護或遵守規則圖。這些卡各自畫了新圖，舊測試的「不得使用某圖」斷言改寫後仍保留原意。
- 先前各輪累積的73張暫緩卡全部以專屬新圖或核實共用解決，逐筆對照列在audit的`priorDeferredUnion`。
- 本輪沒有新增暫緩卡。

## 特殊設計

- **敬語與稱謂**：「お父さん／お母さん／お兄さん／お姉さん」畫成小孩當面呼喚對方，和「父／母／兄／姉」（介紹自己家人）的既有圖分開；「〜さん」「方」「奥さん」「敬語」「言葉遣い」「頼み方」各用禮貌姿勢與對象區分。
- **數量**：四つ～九つ用托盤上的橘子數量（五個一排）；一枚／二枚／五枚錢幣、六本（三組各兩瓶）、一本（三個火把架只剩一根）、一滴、一組、三班都以實物數量呈現，不寫數字。二十歲是蛋糕上兩排各十根蠟燭。
- **日期與時間**：一昨年／再来年用五格年份與跳過一格的箭頭；一月、何月、何日用月份格與虛線空格；半、分以鐘面表示；週間、年以期間括號；今日中、翌日、それまで、時点、当時以時間線標記。
- **疑問詞**：何人（國旗間比劃）、何月／何日（虛線空格與思考）、どのくらい（路程與時鐘）、どの（共用「哪一個」圖）；不用問號充數。
- **連接詞與語氣**：それから／そして（兩件事依序）、それでは／では／じゃ（主持人拍手開始，三者同義共用）、つまり（雜線整理成一個圓）、それで／そのため（原因→結果）、ところが（共用「しかし」轉折圖）、たとえ（暴雨中照樣前進）、ただ（只有一件小事被圈出）、例えば、とりあえず等。
- **抽象詞與語法術語**：主語、人稱、否定形、句尾、語境、反問、強調等以「詞塊」排列、圈選與對照呈現；意志、經驗、狀況、立場、時機等用微情境輔助。
- **遊戲長句**：249句依整句主要語義設計，而不是抓句中某個名詞；只吻合一半的句子（例：「お出かけ？それとも…試合？」「いち、に、準備運動終わり！…買ってあげるから。」）畫成涵蓋兩部分的整句場景。

## 較弱但保留的圖

以下幾張在56×42下仍能辨認，但語義只靠微情境暗示、不如其他圖直接；圖片不是完整定義，日常使用若覺得誤導可再個別修訂：`sleepstars`（群星沉睡）、`reflected`（倒映）、`lifenotsmooth`（人生不順）、`refundifdelayed`（遲到退款）、`means`（手段）、`temporarily`（暫時）、`grimtreatment`（以死亡為治療，不畫傷害）、`judgingsword`（以劍裁決）。

## 來源、安全與大小

全部由本專案以幾何路徑自行編繪，CC0-1.0；沿用224×168、圓角線條、固定色盤與揭示後56×42，只使用既有SVG已出現的色值（繪製時的中間色一律對應到最接近的既有色）。無外部素材、作品角色、截圖、字型、文字標籤、數字字形或emoji；SVG通過無script／foreignObject／text／image／外部href測試。新圖共497,841 bytes（平均約793 bytes）。T161後單字圖片不在APP precache，新圖增加的是可選下載量，不增加首次安裝的檔案數；precache僅因映射與版本清單程式碼增加約25萬bytes。

構圖分流：abstract 295、verb 129、concrete 76、expression 67、adverb 22、quantity 21、adjective 18。

## 驗證

- `npm run check`：346 tests、typecheck、lint通過。正式`/nihongo-lab/` build與`npm run perf:bundle`通過：JS gzip 65,701、CSS 5,068、precache 22,731,907／26,869,829（482項，不含單字圖）。新增測試：全站每張卡都有圖、前5039筆映射SHA不變、刻意分開的義項（錢幣、寶石鑰匙、腹を括る、聲音相似、口信送達、呼喚父親與「父」、行け／行くよっ等）仍分開；舊測試的「不得使用錯配圖」斷言保留原意。
- 開工前後快照：5909卡與前3184筆映射SHA相同，1614張舊SVG位元組0變動，新增628張、全部2242張雜湊唯一，8535教材音檔不變。新SVG只使用既有SVG已出現的色值。
- 自查：628張新圖逐張在224×168與56×42檢視（27張分組圖），628張375×667實際卡片逐張檢視（含捲動後畫面，長台詞也確認圖在翻譯下方）；17張在檢視後重畫或修正。870筆新增映射逐筆核對。
- 瀏覽器（桌面Chromium模擬375×667，不是真機）：首次安裝482項、0張單字圖；安裝中即可學習；628張主要卡線上揭示全部通過；設定頁下載全部2242張（本機9.7秒）；真正斷網重載後629次揭示通過、2242張圖經worker讀取並與內容SHA全部一致；未快取探針失敗；單張缺圖時只顯示文字、評分保存、下一張恢復。代表卡39張×新卡／複習×線上／離線＝156完整流程（1倍播放、評分、改評、滑動不評分、無關卡排程保留）全數通過，pageerror 0。第一次流程檢查因在圖片載入前取樣而誤報，加上等待載入後重跑全部通過，證據記在驗證JSON。

## 文件

[870筆映射CSV](vocab-illustration-t162-mappings.csv)、[628資產bytes／SHA／授權](vocab-illustration-t162-assets.json)、[逐筆共用與前批暫緩重評](vocab-illustration-t162-sharing-audit.json)、[驗證證據](vocab-illustration-t162-validation.json)、[全量盤點CSV](vocab-illustration-inventory-t162.csv)與[摘要](vocab-illustration-inventory-t162-summary.json)。分組圖覽（每組24張，含放大與56×42）：[第1組](previews/t162-group-1.png)、[第2組](previews/t162-group-2.png)、[第3組](previews/t162-group-3.png)、[第4組](previews/t162-group-4.png)、[第5組](previews/t162-group-5.png)、[第6組](previews/t162-group-6.png)、[第7組](previews/t162-group-7.png)、[第8組](previews/t162-group-8.png)、[第9組](previews/t162-group-9.png)、[第10組](previews/t162-group-10.png)、[第11組](previews/t162-group-11.png)、[第12組](previews/t162-group-12.png)、[第13組](previews/t162-group-13.png)、[第14組](previews/t162-group-14.png)、[第15組](previews/t162-group-15.png)、[第16組](previews/t162-group-16.png)、[第17組](previews/t162-group-17.png)、[第18組](previews/t162-group-18.png)、[第19組](previews/t162-group-19.png)、[第20組](previews/t162-group-20.png)、[第21組](previews/t162-group-21.png)、[第22組](previews/t162-group-22.png)、[第23組](previews/t162-group-23.png)、[第24組](previews/t162-group-24.png)、[第25組](previews/t162-group-25.png)、[第26組](previews/t162-group-26.png)、[第27組](previews/t162-group-27.png)。手機預覽：[呼喚爸爸](previews/t162-callingdad-375.png)、[一月（捲動後）](previews/t162-january-scrolled-375.png)、[遊戲混合句（捲動後）](previews/t162-game-mixedline-scrolled-375.png)。

## 628個主要詞義

| # | 類別／構圖 | 詞面／讀音／原翻譯 | 精確ID | SVG | 構圖與界線 |
|---|---|---|---|---|---|
| 1 | n5／concrete | 名前／なまえ／名字 | `stage0-day1:名前` | `nametag.svg` | 人物胸前別著寫有名字的名牌，手指著名牌介紹自己，表名字。 |
| 2 | n5／concrete | 番号／ばんごう／號碼 | `stage0-day19:番号` | `numberedlockers.svg` | 一排置物櫃門上各有不同點數的號碼牌，其中一格被圈出，表號碼、編號。 |
| 3 | n5／abstract | 〜さん／〜さん／～先生／小姐（敬稱） | `stage0-day1:〜さん` | `politeaddress.svg` | 人物伸出手掌恭敬地朝向對方，對方名牌旁多了一朵小花飾，表名字後加的敬稱「さん」。 |
| 4 | n5／abstract | 何人／なにじん／哪國人（なにじん；問「幾個人」時讀なんにん） | `stage0-day1:何人` | `whichnationality.svg` | 人物站在三面不同顏色的旗子前，問話者在旗子之間比劃，問對方是哪一國人。 |
| 5 | n5／abstract | 英語／えいご／英語 | `stage0-day2:英語` | `englishlanguage.svg` | 說話泡泡裡是藍底紅白十字交叉的旗紋，旁邊一本同色書，表英語。 |
| 6 | n5／abstract | 日本語／にほんご／日語 | `stage0-day2:日本語` | `japaneselanguage.svg` | 說話泡泡裡是白底紅圓的旗紋，旁邊一本字典，表日語。 |
| 7 | n5／concrete | 人／ひと／人 | `stage0-day2:人` | `aperson.svg` | 一個人站著，旁人用手指著他介紹「那個人」，表人。 |
| 8 | n5／concrete | 大使館／たいしかん／大使館 | `stage0-day3:大使館` | `embassy.svg` | 有柵門與國徽的建築，屋頂旗桿上掛著旗子，表大使館。 |
| 9 | n5／quantity | 分／ふん／分（前面的數字不同，會變成「ぷん」） | `stage0-day4:分` | `minutehand.svg` | 時鐘只有長針被畫粗並在刻度間移動一小格，表「分」（幾點幾分的分）。 |
| 10 | n5／quantity | 半／はん／半（三時半＝三點半） | `stage0-day4:半` | `halfpast.svg` | 時鐘長針指向正下方，鐘面右半邊填色，表某點半（三時半＝三點半）。 |
| 11 | n5／expression | すみません／すみません／不好意思、對不起 | `stage0-day4:すみません` | `askingattention.svg` | 人物微微彎腰舉手向路人搭話，表詢問前的「不好意思」。 |
| 12 | n5／abstract | 何月／なんがつ／幾月 | `stage0-day5:何月` | `whichmonth.svg` | 一年十二格月份方塊，其中一格是虛線空格，人物手托下巴思考是哪個月，表幾月。 |
| 13 | n5／abstract | 何日／なんにち／幾號、幾天 | `stage0-day5:何日` | `whichday.svg` | 一個月的日期格裡有一格是虛線空格，人物手托下巴思考是幾號，表幾號、幾天。 |
| 14 | n5／adjective | いい／いい／好、可以（「いいですね」＝好啊） | `stage0-day6:いい` | `goodthumbsup.svg` | 兩人中一人豎起大拇指笑著點頭贊成提議，表「好、可以」。 |
| 15 | n5／abstract | それから／それから／然後、還有 | `stage0-day6:それから` | `andthen.svg` | 先畫一盤肉，箭頭接著再一杯酒，兩件事依序連在一起，表「然後、還有」。 |
| 16 | n5／adverb | あまり／あまり／不太（後面接否定） | `stage0-day8:あまり` | `notvery.svg` | 量表指針只停在中間偏低處，沒有到高點，表「不太（後接否定）」。 |
| 17 | n5／adjective | 大好き／だいすき／非常喜歡（な形容詞） | `stage0-day9:大好き` | `lovesomething.svg` | 人物緊抱一顆大愛心，周圍閃光，表非常喜歡。 |
| 18 | n5／adverb | よく／よく／經常、很（多用於「よく分かります」） | `stage0-day9:よく` | `understandwell.svg` | 人物看著英文書，頭上燈泡全亮，旁邊三個勾，表很懂（よく分かる）。 |
| 19 | n5／abstract | 問題／もんだい／問題、題目 | `stage0-day9:問題` | `testquestion.svg` | 題目卷上有題號圓點與空白作答框，人物抓頭苦思，表問題、題目。 |
| 20 | n5／quantity | 四つ／よっつ／四個 | `stage0-day11:四つ` | `fourthings.svg` | 托盤上排著四顆相同的橘子，表四個（數東西）。 |
| 21 | n5／quantity | 五つ／いつつ／五個 | `stage0-day11:五つ` | `fivethings.svg` | 托盤上排著五顆相同的橘子，表五個。 |
| 22 | n5／quantity | 六つ／むっつ／六個 | `stage0-day11:六つ` | `sixthings.svg` | 托盤上排著六顆相同的橘子（五顆一排加一顆），表六個。 |
| 23 | n5／quantity | 七つ／ななつ／七個 | `stage0-day11:七つ` | `seventhings.svg` | 托盤上排著七顆相同的橘子（五顆一排加兩顆），表七個。 |
| 24 | n5／quantity | 八つ／やっつ／八個 | `stage0-day11:八つ` | `eightthings.svg` | 托盤上排著八顆相同的橘子（五顆一排加三顆），表八個。 |
| 25 | n5／quantity | 九つ／ここのつ／九個 | `stage0-day11:九つ` | `ninethings.svg` | 托盤上排著九顆相同的橘子（五顆一排加四顆），表九個。 |
| 26 | n5／quantity | 週間／しゅうかん／〜週（期間） | `stage0-day11:週間` | `weekspan.svg` | 月曆中整整一排七天被括號框起，表一段以週計的期間（〜週間）。 |
| 27 | n5／quantity | 年／ねん／〜年（期間、年份） | `stage0-day11:年` | `yearspan.svg` | 三個年份方塊被一條長箭頭從頭到尾貫穿，表持續了幾年（〜年的期間）。 |
| 28 | n5／abstract | どのくらい／どのくらい／多久、多少 | `stage0-day11:どのくらい` | `howlong.svg` | 人物站在家門口望向遠處的圖書館，中間路線上有虛線尺標與小時鐘，表要多久、多少。 |
| 29 | n5／adverb | ちょっと／ちょっと／有點、稍微 | `stage0-day13:ちょっと` | `abit.svg` | 價格牌旁人物用拇指與食指比出一點點的距離，眉頭微皺，表「有點、稍微」。 |
| 30 | n5／concrete | クラス／クラス／班級 | `stage0-day15:クラス` | `classgroup.svg` | 同一班的學生坐成兩排，前方老師點名，一個圓框把全班圈在一起，表班級。 |
| 31 | n5／verb | 勤める／つとめる／任職於（て形：勤めて） | `stage0-day15:勤める` | `workatcompany.svg` | 提公事包的人物每天走進銀行大樓上班，胸前掛著員工證，表任職於。 |
| 32 | n5／concrete | 外国人／がいこくじん／外國人 | `stage0-day15:外国人` | `foreigner.svg` | 拉著行李箱、拿著護照的旅人剛從飛機下來，背後地球與飛機，表外國人。 |
| 33 | n5／verb | 吸う／すう／吸、抽（菸）（て形：吸って） | `stage0-day15:吸う` | `smoking.svg` | 人物把香菸放在嘴邊吸，菸頭紅點冒出捲曲的煙，表吸（菸）。 |
| 34 | n5／concrete | たばこ／たばこ／香菸 | `stage0-day15:たばこ` | `cigarette.svg` | 香菸盒裡露出幾根香菸，旁邊一根點著冒煙放在菸灰缸，表香菸。 |
| 35 | n5／adjective | たいへん／たいへん／辛苦的、嚴重的（な形容詞） | `stage0-day17:たいへん` | `toughtime.svg` | 人物彎腰扛著比自己還大的重箱，滿頭大汗步伐不穩，表辛苦、不得了。 |
| 36 | n5／expression | ほんとう／ほんとう／真的 | `stage0-day17:ほんとう` | `isittrue.svg` | 一人說完消息，另一人驚訝睜大眼、雙手攤開向前確認是不是真的，表「真的（嗎）」。 |
| 37 | n5／expression | どうぞよろしく／どうぞよろしく／請多指教 | `stage0-day18:どうぞよろしく` | `pleasedtomeet.svg` | 初次見面的兩人互相鞠躬，其中一人雙手遞上名片，表「請多指教」。 |
| 38 | n5／concrete | 漢字／かんじ／漢字 | `stage0-day18:漢字` | `kanjiwriting.svg` | 方格練習紙的四格裡分別示範橫、豎、點、勾等毛筆筆畫，毛筆正在寫，表漢字的書寫（不寫出實際字）。 |
| 39 | n5／concrete | 言葉／ことば／語言、詞語 | `stage0-day18:言葉` | `wordcards.svg` | 一疊單字卡，最上面一張正面是圖案、翻面是一串字形線條，人物拿著背，表詞語、語言。 |
| 40 | n5／quantity | 二十歳／はたち／二十歲 | `stage0-day19:二十歳` | `twentyyearsold.svg` | 生日蛋糕上插著兩排、每排十根的小蠟燭，共二十根，表二十歲。 |
| 41 | n5／adjective | りっぱ／りっぱ／出色的、了不起的（な形容詞） | `stage0-day19:りっぱ` | `splendid.svg` | 宏偉的宮殿式建築加上閃光，旁人仰望讚嘆，表出色的、了不起的。 |
| 42 | n5／abstract | 一昨年／おととし／前年 | `stage0-day19:一昨年` | `yearbeforelast.svg` | 五個年份方塊中，箭頭從今年（紅點）往左跳過一年，指到再前一年，表前年。 |
| 43 | n5／abstract | 再来年／さらいねん／後年 | `stage0-day19:再来年` | `yearafternext.svg` | 五個年份方塊中，箭頭從今年（紅點）往右跳過一年，指到再下一年，表後年。 |
| 44 | n5／quantity | 一月／いちがつ／一月（也唸「ひとつき」＝一個月） | `stage0-day19:一月` | `january.svg` | 十二格月份方塊裡，左上第一格（冬天雪花）被填色圈出，表一月。 |
| 45 | n5／expression | お父さん／おとうさん／爸爸（稱呼別人的父親、當面叫自己的爸爸） | `stage0-day20:お父さん` | `callingdad.svg` | 小孩朝留鬍子的父親揮手呼喊，聲音泡泡飛向他，表當面叫「爸爸」或尊稱別人的父親。 |
| 46 | n5／expression | お母さん／おかあさん／媽媽（稱呼別人的母親、當面叫自己的媽媽） | `stage0-day20:お母さん` | `callingmom.svg` | 小孩朝盤髮的母親揮手呼喊，聲音泡泡飛向她，表當面叫「媽媽」或尊稱別人的母親。 |
| 47 | n5／expression | お兄さん／おにいさん／哥哥（稱呼別人的哥哥、當面叫） | `stage0-day20:お兄さん` | `callingbigbrother.svg` | 小孩朝比自己高的短髮少年呼喊，聲音泡泡飛向他，表當面叫「哥哥」或稱別人的哥哥。 |
| 48 | n5／expression | お姉さん／おねえさん／姊姊（稱呼別人的姊姊、當面叫） | `stage0-day20:お姉さん` | `callingbigsister.svg` | 小孩朝綁馬尾的少女呼喊，聲音泡泡飛向她，表當面叫「姊姊」或稱別人的姊姊。 |
| 49 | n5／concrete | 伯母さん／おばさん／姑姑、阿姨、伯母 | `stage0-day20:伯母さん` | `aunt.svg` | 家族圖上母親身旁她的姊妹被圈出，與小孩連線，表姑姑、阿姨、伯母。 |
| 50 | n5／concrete | 奥さん／おくさん／（別人的）太太 | `stage0-day20:奥さん` | `someoneswife.svg` | 旁人恭敬地指向一對戴同款戒指的夫妻中的妻子，表（別人的）太太。 |
| 51 | n5／concrete | 男／おとこ／男人 | `stage0-day20:男` | `adultman.svg` | 短髮、肩膀寬的成年男性全身站姿，表男人。 |
| 52 | n5／concrete | 女／おんな／女人 | `stage0-day20:女` | `adultwoman.svg` | 長髮、穿裙子的成年女性全身站姿，表女人。 |
| 53 | n5／concrete | 男の子／おとこのこ／男孩 | `stage0-day20:男の子` | `littleboy.svg` | 短髮、穿短褲拿著小球的男孩，旁邊成人的腳作為比例，表男孩。 |
| 54 | n5／concrete | 女の子／おんなのこ／女孩 | `stage0-day20:女の子` | `littlegirl.svg` | 綁雙辮、穿小洋裝的女孩，旁邊成人的腳作為比例，表女孩。 |
| 55 | n5／abstract | こんな／こんな／這樣的 | `stage0-day20:こんな` | `thiskind.svg` | 人物指著雜誌上的一款車，再指向停在旁邊同款的實車，表「這樣的」。 |
| 56 | n5／expression | ねえ／ねえ／欸、喂（叫對方注意） | `stage0-day20:ねえ` | `heylisten.svg` | 人物從後面輕拍朋友的肩膀，朋友轉頭，表「欸、喂」叫對方注意。 |
| 57 | n5／abstract | そして／そして／然後、而且（也寫成「そうして」） | `stage0-day21:そして` | `andalso.svg` | 寫字的人物完成第一件事（打勾的紙）後，箭頭接著做第二件事（另一張紙），表「然後、而且」。 |
| 58 | n5／expression | それでは／それでは／那麼、如此的話 | `stage0-day21:それでは` | `wellthen.svg` | 主持人站到前面拍手，一群人轉頭準備開始，表「那麼（我們開始吧）」。 |
| 59 | n5／expression | さあ／さあ／來吧、嗯（催促或猶豫） | `stage0-day21:さあ` | `comeonnow.svg` | 人物站在門口向後方招手催促同伴一起走，表「來吧」。 |
| 60 | n5／concrete | ラジカセ／ラジカセ／收錄音機 | `stage0-day22:ラジカセ` | `boombox.svg` | 有提把、兩個喇叭與中間卡帶槽的手提收錄音機，聲波從喇叭傳出，表收錄音機。 |
| 61 | n5／verb | やる／やる／做、給（口語，給晚輩或動植物） | `stage0-day24:やる` | `feedinganimal.svg` | 人物蹲下把飼料倒進狗碗，狗搖尾巴，表（給晚輩或動植物）餵、給。 |
| 62 | n5／abstract | 死ぬ／しぬ／死（禮貌形：死にます） | `stage0-day24:死ぬ` | `deceased.svg` | 枯萎垂下的花放在墓碑前，表死亡。 |
| 63 | n5／verb | する／する／做（禮貌形：します） | `stage0-day24:する` | `doingactivity.svg` | 人物揮動球拍正在打網球，動作線表動作，表做（某件事）。 |
| 64 | n5／concrete | 物／もの／東西 | `stage0-day24:物` | `assortedthings.svg` | 桌上放著杯子、書、鑰匙、盒子等各式物品，表東西。 |
| 65 | n5／concrete | 方／かた／位（人的禮貌說法） | `stage0-day24:方` | `respectedperson.svg` | 說話者手掌恭敬地朝向一位穿西裝打領帶的長者，略微鞠躬，表「位」（人的禮貌說法）。 |
| 66 | n5／abstract | 辺／へん／附近、一帶 | `stage0-day24:辺` | `thisarea.svg` | 地圖上人物所在處周圍一大圈範圍被淡色圈出，裡面有幾棟房子與樹，表這一帶、附近。 |
| 67 | n5／quantity | キロ／キロ／公里、公斤 | `stage0-day25:キロ` | `kilometers.svg` | 人物站在路邊，路上一整段被長箭頭量出，兩端立有里程樁，遠處是車站，表公里。 |
| 68 | anime／abstract | 天才／てんさい／天才；天分極高的人 | `anime-lesson-01:天才` | `genius.svg` | 人物頭上燈泡與星星同時亮起，面前的難題卷一下子就畫滿正確勾號，表天才。 |
| 69 | anime／abstract | 想い／おもい／心意、思念、情感 | `anime-lesson-02:想い` | `heartfeelings.svg` | 人物雙手捧著一顆發光的愛心，愛心的光線伸向遠方的另一人，表心意、思念。 |
| 70 | anime／abstract | 言葉／ことば／話語、語言；詞語 | `anime-lesson-02:言葉` | `spokenwords.svg` | 人物說話，一串小方塊般的話語從嘴邊飛出，被另一人接住聽進耳裡，表話語、言詞。 |
| 71 | anime／abstract | 正論／せいろん／正確合理的論點、道理 | `anime-lesson-02:正論` | `soundargument.svg` | 人物舉著一張證據紙，各項打勾整齊有條理，對方啞口無言垂下手，表正確合理的論點（正論）。 |
| 72 | anime／concrete | 口／くち／嘴巴；開口處 | `anime-lesson-02:口` | `mouthopen.svg` | 大大的臉部近景，嘴巴張開說話，旁邊箭頭指著嘴，表嘴巴；也是開口處。 |
| 73 | anime／verb | 燃やす／もやす／燃燒、使燃燒；激起熱情 | `anime-lesson-03:燃やす` | `burningpassion.svg` | 人物握拳，胸口燃起一團熊熊火焰往上竄，表燃燒、激起熱情。 |
| 74 | anime／verb | 括る／くくる／綁、束起；歸納 | `anime-lesson-03:括る` | `tyingresolve.svg` | 人物用力把腰帶在腹前紮緊、眉頭堅定，表綁緊、束起（「腹を括る」下定決心的說法）。 |
| 75 | anime／verb | 求める／もとめる／尋求、要求 | `anime-lesson-03:求める` | `seekinghelp.svg` | 跌坐的人物向前伸手請求，前方站著的人伸手回應，表尋求、要求。 |
| 76 | anime／abstract | 能力／のうりょく／能力、本領 | `anime-lesson-06:能力` | `ability.svg` | 人物伸手發動技能，手中光芒成形為一把光劍，背後條件刻度已滿，表能力、本領。 |
| 77 | anime／abstract | 地獄／じごく／地獄；極度痛苦的處境 | `anime-lesson-08:地獄` | `hellscape.svg` | 深色岩地裂縫中竄出火焰，人物在其中抱頭痛苦，表地獄、極度痛苦的處境。 |
| 78 | anime／abstract | 心／こころ／心、心意、精神 | `anime-lesson-08:心` | `heartmind.svg` | 人形輪廓胸口中央一顆柔和發光的心，象徵內在的心意與精神，表心。 |
| 79 | anime／concrete | 人／ひと／人、人們 | `anime-lesson-08:人` | `peopletogether.svg` | 高矮不同的好幾個人並排站在一起，表人、人們。 |
| 80 | general／verb | 教える／おしえる／教；告訴 | `general-listening-05:教える` | `explainmeaning.svg` | 一人指著看不懂的告示牌，同伴在旁邊比劃解說牌上的意思，表告訴、解說（意思）。 |
| 81 | general／verb | 教える／おしえる／告訴；教導 | `general-listening-17:教える` | `showingway.svg` | 長者伸手指向岔路的其中一條，旁人跟著看，地上虛線標出那條路，表指點道路、教路。 |
| 82 | general／expression | もちろん／もちろん／當然 | `general-listening-05:もちろん` | `ofcourse.svg` | 被請求的人毫不猶豫地拍胸脯點頭，臉上帶笑，表「當然」。 |
| 83 | general／abstract | 少し／すこし／少量；稍微 | `general-listening-05:少し` | `partlyreadable.svg` | 告示牌上只有前一小段字被填色看懂（打勾），後面大部分仍是看不懂的波浪，表「只懂一點」。 |
| 84 | general／adverb | 少し／すこし／稍微 | `general-listening-87:少し` | `dimslightly.svg` | 調光旋鈕只往暗的方向轉了一小格，燈泡亮光略為收小，表「稍微（調暗）」。 |
| 85 | general／verb | 降りる／おりる／下來；下車 | `general-listening-06:降りる` | `comingdown.svg` | 人物沿山路往下走回山腳，箭頭朝下坡方向，表從高處下來。 |
| 86 | general／abstract | 場合／ばあい／情況；場合 | `general-listening-06:場合` | `incaseof.svg` | 道路分成兩條：上方雨雲那條通向小屋休息，晴天那條通往山頂，表「（若發生）…的情況」。 |
| 87 | general／abstract | その時／そのとき／那時候 | `general-listening-06:その時` | `atthattime.svg` | 時間線上一個被選定的時刻打上記號，上方畫出那時要做的事，表「那時候、當時」。 |
| 88 | general／abstract | 今のうちに／いまのうちに／趁現在 | `general-listening-06:今のうちに` | `whileyoucan.svg` | 天空還是晴的，但烏雲正從遠處逼近，人物趁現在抬頭確認天氣，表「趁現在」。 |
| 89 | general／expression | だめ／だめ／不行；沒用（依情境） | `general-listening-09:だめ` | `notallowedtouch.svg` | 伸向畫框的手前面畫了大叉，旁人揮手阻止，表「不行、不可以」。 |
| 90 | general／adjective | 遅い／おそい／慢的；晚的 | `general-listening-10:遅い` | `slowmoving.svg` | 同一條路上走得慢的人只前進一點點，快的人已遠遠在前，表「慢的」。 |
| 91 | general／abstract | 前／まえ／之前；前方 | `general-listening-12:前` | `beforeleaving.svg` | 左格先把鑰匙交還，右格才出門，左格被框起並在時間箭頭的前面，表「（做某事）之前」。 |
| 92 | general／verb | 送る／おくる／寄送 | `general-listening-13:送る` | `mailingletter.svg` | 人物把封好的信投進郵筒，信封朝投信口移動，表寄送。 |
| 93 | general／concrete | 置き場／おきば／放置處 | `general-listening-14:置き場` | `storagespot.svg` | 地上用線框出一塊區域，箱子與用具整齊堆在框內，表放置處。 |
| 94 | general／concrete | 彼女／かのじょ／她；女友 | `general-listening-16:彼女` | `sheperson.svg` | 兩人談話中，一人用手比向不在場的一位綁髮女性（畫在回憶泡泡裡），表「她」。 |
| 95 | general／concrete | 彼／かれ／他；男友 | `general-listening-16:彼` | `heperson.svg` | 兩人談話中，一人用手比向不在場的一位短髮男性（畫在回憶泡泡裡），表「他」。 |
| 96 | general／verb | 受ける／うける／接受 | `general-listening-17:受ける` | `acceptingrequest.svg` | 對方雙手遞上一封委託信，人物伸手接下並點頭答應，表接受、接下（請求）。 |
| 97 | general／abstract | 道順／みちじゅん／路線順序 | `general-listening-17:道順` | `routeorder.svg` | 地圖上的路線依序經過三個轉角點，點的大小由小到大表示先後，終點是旗子，表路線的順序。 |
| 98 | general／abstract | 事情／じじょう／情況；原因 | `general-listening-19:事情` | `circumstances.svg` | 關著的店門上貼著說明告示，旁邊泡泡畫出背後原因（店主生病在家），表情況、緣由。 |
| 99 | general／abstract | 代わりに／かわりに／改為；代替 | `general-listening-19:代わりに` | `insteadof.svg` | 原本要選的一項被打叉，旁邊的另一項以彎箭頭接上被圈起，表「改為、代替」。 |
| 100 | general／abstract | 結局／けっきょく／結果；到頭來 | `general-listening-19:結局` | `intheend.svg` | 一條繞來繞去、試了好幾個方向的路線，最後停在終點旗子，表「結果、到頭來」。 |
| 101 | general／abstract | 使い方／つかいかた／使用方法 | `general-listening-20:使い方` | `howtouse.svg` | 新工具旁打開的說明卡，三格圖依序示範拿起、對準、按下，表使用方法。 |
| 102 | general／abstract | 雲行き／くもゆき／雲的動向；情勢 | `general-listening-21:雲行き` | `cloudtrend.svg` | 一排雲由淡到濃往山的方向移動，人物在城鎮邊抬頭觀察雲的走向，表雲的動向、情勢。 |
| 103 | general／verb | 様子／ようす／樣子；狀況 | `general-listening-21:様子` | `observingsituation.svg` | 兩人躲在樹旁靜靜觀察前方動靜，視線虛線伸向遠處，表觀察狀況、看看情形。 |
| 104 | general／abstract | 確実／かくじつ／確實 | `general-listening-22:確実` | `certainsure.svg` | 儀表指針穩穩指在最高格，旁邊鎖頭上鎖並打勾，表「確實、確定可靠」。 |
| 105 | general／concrete | ニュース／ニュース／新聞；消息 | `general-listening-22:ニュース` | `newsnotice.svg` | 村裡的公告板剛貼上一張新消息，大家聚在板前看，表消息、新聞。 |
| 106 | general／abstract | もしかして／もしかして／難道；說不定 | `general-listening-23:もしかして` | `perhapsmaybe.svg` | 遠處的虛線人影只看得到一半，人物瞇眼猜那是不是熟人，泡泡裡是半實半虛的臉，表「說不定、難道是」。 |
| 107 | general／abstract | 残る／のこる／留存 | `general-listening-127:残る` | `footprintsremain.svg` | 倉庫門口的泥地上清楚留著一串腳印，人已離開，表痕跡留存。 |
| 108 | general／abstract | 受付時間／うけつけじかん／受理時間 | `general-listening-24:受付時間` | `receptionhours.svg` | 櫃檯上方時鐘旁一條時段帶，只有營業的一段填色，櫃檯人員在時段內服務，表受理時間。 |
| 109 | general／abstract | ため／ため／為了；原因 | `general-listening-25:ため` | `inorderto.svg` | 人物收集線索紙條，粗箭頭指向目標：找到失散同伴並重逢，表「為了」。 |
| 110 | general／concrete | 情報屋／じょうほうや／提供情報的人 | `general-listening-25:情報屋` | `informant.svg` | 戴兜帽的人物在巷角對人低聲耳語，手中遞出一張紙條，表提供情報的人。 |
| 111 | general／concrete | 情報所／じょうほうしょ／情報處 | `general-listening-25:情報所` | `infocenter.svg` | 有窗口的小服務站，牆上貼滿告示與地圖，排隊的人正在詢問，表情報處、詢問處。 |
| 112 | general／verb | 旅立つ／たびだつ／啟程 | `general-listening-25:旅立つ` | `settingoffjourney.svg` | 背著行囊、拿手杖的旅人在清晨走出城門，朝遠方的路啟程，表啟程、踏上旅途。 |
| 113 | general／concrete | 協力者／きょうりょくしゃ／協助者 | `general-listening-25:協力者` | `collaborator.svg` | 兩人一起扛起長木頭，另一人在前方指路，三人分工合作，表協助者、合作者。 |
| 114 | general／abstract | 地名／ちめい／地名 | `general-listening-25:地名` | `placename.svg` | 地圖上的城鎮旁各插一面不同圖樣的小名牌，表地名（地點的名稱）。 |
| 115 | general／verb | 迎えに行く／むかえにいく／去接人 | `general-listening-26:迎えに行く` | `pickingupperson.svg` | 人物走到車站門口迎接剛下車的朋友並揮手，箭頭從家到車站，表去接人。 |
| 116 | general／verb | 届けに行く／とどけにいく／去送達 | `general-listening-26:届けに行く` | `deliveringto.svg` | 人物捧著包裹往朋友家走，箭頭指向那戶的門，表去送東西過去。 |
| 117 | general／verb | 寄る／よる／順道前往 | `general-listening-26:寄る` | `droppingby.svg` | 回家的路上，人物彎進路邊小店停一下再繼續走，虛線表順道繞進去，表順道前往。 |
| 118 | general／verb | 変える／かえる／更改 | `general-listening-98:変える` | `changesetting.svg` | 手把控制盤的切換鈕從一邊撥到另一邊，旁邊顯示的模式圖也跟著換了，表更改、改變（設定）。 |
| 119 | general／verb | 覚えられる／おぼえられる／能記住 | `general-listening-27:覚えられる` | `canmemorize.svg` | 人物看一次單字卡後，頭頂泡泡裡已經存下同樣的卡片並打勾，表能記住。 |
| 120 | general／abstract | 前より／まえより／比以前 | `general-listening-27:前より` | `comparedtobefore.svg` | 左邊淡色的「以前」只有矮矮一格，右邊現在長高了一截，箭頭往上比較，表「比以前」。 |
| 121 | general／abstract | 最近／さいきん／最近 | `general-listening-27:最近` | `recently.svg` | 時間線靠近「現在」的最後一小段被填色圈起，那裡畫著剛完成的畫，表「最近」。 |
| 122 | general／quantity | 一枚／いちまい／一枚；一張 | `general-listening-42:一枚` | `onecoin.svg` | 攤開的手掌上只有一枚銀幣，表「一枚」（錢幣計數）。 |
| 123 | general／quantity | 二枚／にまい／兩枚；兩張 | `general-listening-42:二枚` | `twocoins.svg` | 攤開的手掌上有兩枚銀幣，表「兩枚」（錢幣計數）。 |
| 124 | general／quantity | 五枚／ごまい／五枚；五張 | `general-listening-42:五枚` | `fivecoins.svg` | 桌上排成一列的五枚銀幣，表「五枚」。 |
| 125 | general／concrete | 銀貨／ぎんか／銀幣 | `general-listening-42:銀貨` | `silvercoin.svg` | 一枚有刻紋的銀色硬幣放大圖，旁邊錢袋，表銀幣。 |
| 126 | general／concrete | 銅貨／どうか／銅幣 | `general-listening-112:銅貨` | `coppercoin.svg` | 一枚帶方孔的紅銅色硬幣放大圖，表銅幣。 |
| 127 | general／verb | 払える／はらえる／能支付 | `general-listening-28:払える` | `canpay.svg` | 人物從錢包拿出的錢剛好夠，店員接下並打勾，表能支付、付得起。 |
| 128 | general／verb | 過ごす／すごす／度過 | `general-listening-29:過ごす` | `spendingtime.svg` | 人物悠閒坐著，頭上從太陽到月亮的弧線表一天就這樣度過，表度過（時光）。 |
| 129 | general／concrete | 運航／うんこう／航行營運 | `general-listening-30:運航` | `ferryservice.svg` | 渡輪按航線在海上往返，岸邊時刻牌，表航行營運。 |
| 130 | general／concrete | 港町／みなとまち／港口城鎮 | `general-listening-30:港町` | `porttown.svg` | 海邊排著房子與碼頭，港口停著船，表港口城鎮。 |
| 131 | general／adjective | 強い／つよい／強的 | `general-listening-30:強い` | `strongwind.svg` | 強風把樹吹彎、人物撐傘也被吹得歪斜，粗風線，表（風）強的。 |
| 132 | general／adjective | 弱い／よわい／弱的 | `general-listening-30:弱い` | `weakwind.svg` | 只有細細一條微風線，樹葉輕晃，人物舒適地站著，表（風）弱的。 |
| 133 | general／abstract | 状況／じょうきょう／狀況 | `general-listening-30:状況` | `situationoverview.svg` | 人物站在大看板前，看板上同時標著天氣、船與路線狀態，表狀況、局勢。 |
| 134 | general／abstract | 名字／みょうじ／姓氏 | `general-listening-31:名字` | `familyname.svg` | 一家三口胸前的名牌都有同一個家紋圖樣，被一個大框框在一起，表姓氏。 |
| 135 | general／abstract | 呼び方／よびかた／稱呼方式 | `general-listening-31:呼び方` | `wayofaddressing.svg` | 人物面對新朋友，泡泡裡三種不同的稱呼選項（全名、暱稱、加敬稱），其中一種被圈選，表稱呼方式。 |
| 136 | general／abstract | 出身／しゅっしん／出身 | `general-listening-31:出身` | `hometown.svg` | 人物站在現在住的城市，虛線一路連回地圖另一端的小村莊老家，表出身。 |
| 137 | general／verb | 申し出／もうしで／主動提出 | `general-listening-33:申し出` | `offeringhelp.svg` | 看到同伴搬重箱，人物主動舉手上前表示要幫忙，表主動提出（協助）。 |
| 138 | general／expression | ちょっと／ちょっと／一下；稍微 | `general-listening-34:ちょっと` | `justamoment.svg` | 人物伸出一根手指示意「借看一下就好」，指著對方手上的地圖，表「一下、稍微」。 |
| 139 | general／concrete | 展示室／てんじしつ／展示室 | `general-listening-35:展示室` | `exhibitionroom.svg` | 牆上掛著幾幅畫、中央有展示台與圍欄的房間，表展示室。 |
| 140 | general／adverb | 早めに／はやめに／提早一些 | `general-listening-36:早めに` | `abitearly.svg` | 時鐘上約定時間前一小段被填色，人物提早在那時出門，表「提早一些」。 |
| 141 | general／concrete | 送迎／そうげい／接送 | `general-listening-37:送迎` | `shuttleservice.svg` | 小車來回接送乘客：在家門口接人、在車站放人，雙向箭頭，表接送。 |
| 142 | general／expression | おかげ／おかげ／多虧 | `general-listening-37:おかげ` | `thankstoyou.svg` | 在同伴扶持下過了獨木橋的人物，回頭向對方合掌道謝，表多虧（你）。 |
| 143 | general／verb | 気にする／きにする／介意 | `general-listening-37:気にする` | `mindingstain.svg` | 人物抱頭盯著衣服上一小塊污漬，頭上糾結的線團，表介意、在意。 |
| 144 | general／abstract | 礼儀／れいぎ／禮貌 | `general-listening-37:礼儀` | `manners.svg` | 人物替後面的人扶著門，另一人點頭致謝，兩人互相禮讓，表禮貌、禮節。 |
| 145 | general／adverb | ゆっくり／ゆっくり／慢慢地 | `general-listening-38:ゆっくり` | `speakslowly.svg` | 說話者的泡泡裡音節一個個隔開、間距加大，旁邊小烏龜，表慢慢地（說）。 |
| 146 | general／abstract | 数字／すうじ／數字 | `general-listening-38:数字` | `numeralsdisplay.svg` | 三塊方塊上分別是一、二、三個圓點，由少到多排列，旁邊量尺刻度，表數字、數量的符號（不寫實際字形）。 |
| 147 | general／verb | かける／かける／打電話；掛 | `general-listening-39:かける` | `makingcall.svg` | 人物把手機貼在耳邊，訊號波傳向遠處另一支響起的電話，表打電話。 |
| 148 | general／abstract | 空いている／あいている／有空；空著 | `general-listening-39:空いている` | `freetime.svg` | 一週行程表上大部分格子填滿，只有一格空著，人物在旁輕鬆伸懶腰，表有空、空著。 |
| 149 | general／verb | 抜く／ぬく／去除 | `general-listening-43:抜く` | `removingingredient.svg` | 餐點上的洋蔥被夾子挑出來放到一旁，表去除（不要某食材）。 |
| 150 | general／verb | 食べられる／たべられる／能吃 | `general-listening-43:食べられる` | `caneat.svg` | 人物看著碗裡的食物打勾後開心地吃，表能吃、可以吃。 |
| 151 | general／verb | 停車／ていしゃ／停車 | `general-listening-44:停車` | `trainstopping.svg` | 列車在月台旁停住，車輪旁有剎車線，車門打開，表停車、停靠。 |
| 152 | general／abstract | 二つ目／ふたつめ／第二個 | `general-listening-44:二つ目` | `secondstop.svg` | 路線圖上一排車站圓點，從出發點數起的第二站被圈出，表第二個。 |
| 153 | general／concrete | 行き／ゆき／開往 | `general-listening-44:行き` | `boundfor.svg` | 列車車頭的方向牌畫著船與海，箭頭指向港口，表開往（某地）的車。 |
| 154 | general／abstract | 案／あん／方案 | `general-listening-46:案` | `proposalplan.svg` | 桌上攤開一張方案草圖，上面有流程方塊與箭頭，人物指著提出，表方案、構想。 |
| 155 | general／abstract | 体調／たいちょう／身體狀況 | `general-listening-47:体調` | `healthcondition.svg` | 人物含著體溫計，旁邊身體狀態量表指針偏低，表身體狀況、狀態好壞。 |
| 156 | general／concrete | 水分／すいぶん／水分 | `general-listening-47:水分` | `drinkwater.svg` | 人物拿水壺喝水，旁邊水滴，表補充水分。 |
| 157 | general／abstract | 顔色／かおいろ／臉色 | `general-listening-47:顔色` | `palecomplexion.svg` | 同一張臉左邊是健康紅潤、右邊是蒼白發灰，右邊被圈出，表臉色（不好）。 |
| 158 | general／adjective | 悪い／わるい／不好的 | `general-listening-47:悪い` | `feelingunwell.svg` | 人物彎腰扶額，頭旁有暈眩的波浪線，表不舒服、狀況不好。 |
| 159 | general／verb | 様子／ようす／情況 | `general-listening-47:様子` | `checkingonfriend.svg` | 人物蹲下靠近坐在地上的同伴，仔細看他的狀況，關切的視線虛線，表（某人的）情況、樣子。 |
| 160 | general／abstract | 確か／たしか／記得是；確實 | `general-listening-48:確か` | `ifirecall.svg` | 人物食指抵著下巴回想，模糊的記憶泡泡裡畫面一半清楚一半虛線，表「記得是、應該是」。 |
| 161 | general／abstract | つまり／つまり／也就是說 | `general-listening-49:つまり` | `inotherwords.svg` | 左邊一團雜亂的線條經過等號箭頭，整理成右邊一個簡單的圓，表「也就是說」。 |
| 162 | general／adverb | 絶対／ぜったい／絕對 | `general-listening-49:絶対` | `absolutely.svg` | 大門用粗鎖鏈與多個鎖頭鎖死，蓋上圓章，表「絕對（不行／一定）」。 |
| 163 | general／verb | 持参／じさん／自備帶來 | `general-listening-49:持参` | `bringyourown.svg` | 參加者各自從家裡帶著自己的水壺與便當來集合，表自備帶來。 |
| 164 | general／verb | 通れる／とおれる／能通過 | `general-listening-51:通れる` | `canpass.svg` | 修好的橋上人物順利走過，橋頭打勾，表能通過。 |
| 165 | general／verb | 破る／やぶる／違反；撕破 | `general-listening-52:破る` | `breakingpromise.svg` | 兩人勾小指的約定線從中間斷開，一人轉身走掉，表違反（約定）、毀約。 |
| 166 | general／verb | 間に合わせる／まにあわせる／使趕上 | `general-listening-52:間に合わせる` | `makeitintime.svg` | 人物在時鐘指針到截止線之前把完成的文件放進箱子，表趕上、使趕上。 |
| 167 | general／abstract | 今日中／きょうじゅう／今天之內 | `general-listening-52:今日中` | `withintoday.svg` | 一天的時間條從日出到月亮，整段被框起，工作圖示放在框內，表「今天之內」。 |
| 168 | general／verb | やめる／やめる／停止做某事 | `general-listening-53:やめる` | `stopdoing.svg` | 人物放下手上正在敲的鐵鎚，旁人手掌伸出示意停下，表停止做某事、作罷。 |
| 169 | general／abstract | 勝手に／かってに／擅自 | `general-listening-53:勝手に` | `withoutpermission.svg` | 負責人不在座位上，有人擅自伸手拔掉機器電源，表擅自。 |
| 170 | general／abstract | 勝手に／かってに／擅自；自行 | `general-listening-76:勝手に` | `byitself.svg` | 沒有人按的按鈕旁，鈴自己響起，周圍無人，表擅自、自行（自然而然）。 |
| 171 | general／abstract | 意志／いし／意志 | `general-listening-55:意志` | `willpower.svg` | 人物頂著強風仍握拳向前邁步，胸口一道穩定的光，表意志。 |
| 172 | general／abstract | 決心／けっしん／決心 | `general-listening-55:決心` | `resolve.svg` | 人物在高山腳下握緊拳頭點頭，眼神堅定望向山頂旗子，表決心。 |
| 173 | general／concrete | 本番／ほんばん／正式上場 | `general-listening-56:本番` | `realperformance.svg` | 舞台布幕拉開、聚光燈打下，台下坐滿觀眾，表正式上場、正式演出。 |
| 174 | general／verb | 発表／はっぴょう／發表 | `general-listening-56:発表` | `givingpresentation.svg` | 人物站在台前指著投影圖表報告，聽眾看著，表發表、報告。 |
| 175 | general／abstract | 実際／じっさい／實際 | `general-listening-57:実際` | `inreality.svg` | 思考泡泡裡想像的是大城堡，箭頭指向現實中其實是一間小屋（實線並圈出），表「實際上」。 |
| 176 | general／abstract | 現状／げんじょう／現況 | `general-listening-57:現状` | `currentstate.svg` | 進度條停在中間，現在位置以紅點與人物標出，前後是做完與未做的部分，表現況、目前狀態。 |
| 177 | general／abstract | 効率／こうりつ／效率 | `general-listening-57:効率` | `efficiency.svg` | 同樣的工作，一人用輸送帶一次處理多件、時鐘只轉一點，表效率。 |
| 178 | general／abstract | 早い／はやい／早；快 | `general-listening-57:早い` | `quickersplit.svg` | 一大堆工作分成兩組同時進行，旁邊時鐘比一組做時更短，表（分組）比較快。 |
| 179 | general／abstract | 利点／りてん／優點 | `general-listening-58:利点` | `advantage.svg` | 天平上放「好處」的一邊（打勾的方塊）比較重往下沉，表優點。 |
| 180 | general／abstract | 欠点／けってん／缺點 | `general-listening-58:欠点` | `disadvantage.svg` | 同一件工具上被放大鏡圈出一處裂痕與叉號，表缺點。 |
| 181 | general／adjective | 空く／すく／變空；不擁擠 | `general-listening-58:空く` | `uncrowded.svg` | 車廂裡只坐著一兩個人，大片空位，表不擁擠、變空。 |
| 182 | general／verb | 座れる／すわれる／能坐下 | `general-listening-58:座れる` | `cansit.svg` | 人物找到空椅坐下，旁邊打勾，表能坐下。 |
| 183 | general／verb | 休める／やすめる／能休息 | `general-listening-58:休める` | `canrest.svg` | 人物在長椅上伸展休息，旁邊打勾與小樹蔭，表能休息。 |
| 184 | general／abstract | 向く／むく／適合；朝向 | `general-listening-58:向く` | `suitedfor.svg` | 形狀對應的拼塊剛好嵌進缺口，旁邊不合的拼塊被擋在外，表適合。 |
| 185 | general／abstract | 不参加／ふさんか／不參加 | `general-listening-59:不参加` | `notattending.svg` | 大家圍在會議桌邊，一人朝反方向走開，空出的位子打叉，表不參加。 |
| 186 | general／verb | 出席／しゅっせき／出席 | `general-listening-59:出席` | `attending.svg` | 人物舉手回應點名，坐在會議桌前的座位上，表出席。 |
| 187 | general／verb | 集める／あつめる／召集；收集 | `general-listening-59:集める` | `gatheringpeople.svg` | 號角聲傳出，四方的人沿箭頭聚集到中央廣場，表召集。 |
| 188 | general／concrete | 備品／びひん／備品 | `general-listening-62:備品` | `supplies.svg` | 架上排著繃帶、燈、繩子與水瓶等共用備品，表備品、用品。 |
| 189 | general／abstract | 端／はし／邊緣 | `general-listening-63:端` | `edgeofpaper.svg` | 地圖的邊緣一角被撕破並圈出，其他部分完好，表邊緣、邊端。 |
| 190 | general／expression | 別に／べつに／並不特別 | `general-listening-64:別に` | `notparticularly.svg` | 被問到時人物聳肩、兩手攤平、表情平淡，表「並不特別、沒什麼」。 |
| 191 | general／concrete | 連絡係／れんらくがかり／聯絡負責人 | `general-listening-65:連絡係` | `liaison.svg` | 戴臂章的人站在兩群人中間，雙手各拿紙條往兩邊傳遞，表聯絡負責人。 |
| 192 | general／abstract | 切れる／きれる／用盡；中斷 | `general-listening-66:切れる` | `batterydead.svg` | 手電筒照不亮，旁邊電池的電量格全空並打叉，表（電池）用盡。 |
| 193 | general／abstract | それで／それで／因此；於是 | `general-listening-66:それで` | `therefore.svg` | 左格的原因（雨落在拆掉的屋頂）經粗箭頭導向右格的結果（屋內積水），表「因此、所以」。 |
| 194 | general／verb | そろえる／そろえる／整理齊全 | `general-listening-68:そろえる` | `arrangingtools.svg` | 人物把散落的工具一一排齊放進工具盒的固定位置，表整理齊全。 |
| 195 | general／abstract | 強い／つよい／強烈的 | `general-listening-68:強い` | `forcefulvoice.svg` | 人物大聲用力指示，泡泡邊框粗重、帶尖角，聽者縮了一下，表強烈的（語氣）。 |
| 196 | general／abstract | 今回／こんかい／這次 | `general-listening-69:今回` | `thistime.svg` | 一排過去的嘗試卡片都淡色，最右邊這一次被填色圈出，表「這次」。 |
| 197 | general／concrete | 本体／ほんたい／本體 | `general-listening-71:本体` | `mainbody.svg` | 有天線與零件的機器，中央主要外殼被圈出、周圍配件淡化，表本體。 |
| 198 | general／abstract | 正式／せいしき／正式 | `general-listening-71:正式` | `official.svg` | 文件上蓋了紅色正式印章並有簽名線，旁邊草稿紙被收到一邊，表正式。 |
| 199 | general／abstract | 別名／べつめい／別名 | `general-listening-71:別名` | `aliasname.svg` | 同一座塔掛著兩塊不同圖樣的名牌，以線連到同一座塔，表別名。 |
| 200 | general／abstract | 呼び名／よびな／稱呼 | `general-listening-71:呼び名` | `callingname.svg` | 村人對著塔呼喊時用的是簡短的暱稱泡泡，泡泡連到那座塔，表稱呼、叫法。 |
| 201 | general／verb | 観測／かんそく／觀測 | `general-listening-72:観測` | `observation.svg` | 人物從望遠鏡長時間觀察星空，旁邊紀錄板，表觀測。 |
| 202 | general／adjective | 見づらい／みづらい／難以看清的 | `general-listening-72:見づらい` | `hardtosee.svg` | 畫面太亮而泛白、內容模糊，人物瞇眼用手遮光，表難以看清。 |
| 203 | general／verb | 調節／ちょうせつ／調整 | `general-listening-72:調節` | `adjustingknob.svg` | 手轉動旋鈕微調，旁邊刻度上的指示從過高調回剛好的綠色範圍，表調整、調節。 |
| 204 | general／abstract | 照度／しょうど／照度 | `general-listening-72:照度` | `illuminance.svg` | 燈光照在桌面上，桌面亮度以由淡到亮的格子表示，量測器顯示照在那裡的亮度，表照度。 |
| 205 | general／verb | 遮光／しゃこう／遮光 | `general-listening-72:遮光` | `shading.svg` | 窗前放下遮光簾，外面的陽光被擋住，室內變暗，表遮光。 |
| 206 | general／verb | 下げる／さげる／降低 | `general-listening-72:下げる` | `lowering.svg` | 亮度滑桿被手往下拉，箭頭向下，畫面從亮變暗，表降低。 |
| 207 | general／abstract | 専門／せんもん／專門 | `general-listening-73:専門` | `specialty.svg` | 一位工匠只專注做鐘錶，桌上全是同一類零件與放大鏡，表專門、專業領域。 |
| 208 | general／abstract | 経験／けいけん／經驗 | `general-listening-73:経験` | `experience.svg` | 人物身後一長串走過的腳印與完成的旗子，現在面對新任務很從容，表經驗。 |
| 209 | general／abstract | 評判／ひょうばん／評價 | `general-listening-73:評判` | `reputation.svg` | 一個人物周圍的人都豎起拇指、泡泡裡有星星，表評價、名聲。 |
| 210 | general／concrete | 資格／しかく／資格 | `general-listening-73:資格` | `qualification.svg` | 人物手持蓋章的證書與徽章，門口的人檢查後放行，表資格。 |
| 211 | general／adjective | 頼もしい／たのもしい／可靠的 | `general-listening-73:頼もしい` | `reliable.svg` | 同伴扛起大半重擔、另一人放心地靠著他，表可靠的、靠得住。 |
| 212 | general／verb | 挙げる／あげる／舉出 | `general-listening-73:挙げる` | `listingexamples.svg` | 人物舉起手指一根根數著，旁邊依序出現三個例子小圖，表舉出（例子）。 |
| 213 | general／abstract | 例えば／たとえば／例如 | `general-listening-73:例えば` | `forexample.svg` | 一大類東西（一籃水果）中拿出一顆舉起來放大展示，表「例如」。 |
| 214 | general／adverb | とりあえず／とりあえず／暫且；先 | `general-listening-73:とりあえず` | `forthetimebeing.svg` | 人物先用一塊布暫時蓋住破洞，旁邊沙漏表示之後再正式修，表「暫且、先這樣」。 |
| 215 | general／concrete | 投影／とうえい／投影 | `general-listening-74:投影` | `projection.svg` | 投影機射出光錐，牆上出現虛線輪廓的龍，牆的磚紋仍透出，表投影。 |
| 216 | general／abstract | 幻／まぼろし／幻影 | `general-listening-74:幻` | `illusion.svg` | 人物伸手去碰前方的景物，手直接穿過虛線的影像，表幻影、幻象。 |
| 217 | general／verb | 映る／うつる／映現 | `general-listening-74:映る` | `reflected.svg` | 湖岸上的樹與月亮清楚倒映在下方水面，上下對稱、倒影較淡並有水波線，表映現、倒映。 |
| 218 | general／adjective | 薄い／うすい／薄的；淡的 | `general-listening-74:薄い` | `faint.svg` | 同一個圖形一個顏色深、一個淡到幾乎看不見，淡的那個被圈出，表淡的、薄的（影像）。 |
| 219 | general／adjective | 不思議／ふしぎ／不可思議 | `general-listening-74:不思議` | `mysterious.svg` | 一顆石頭自己飄浮在半空並發光，人物看了歪頭，表不可思議。 |
| 220 | general／adverb | どうやら／どうやら／看來 | `general-listening-74:どうやら` | `seemingly.svg` | 地上的腳印與掉落的帽子連成線索，人物順著推測出「看來是往那邊走了」，虛線箭頭，表看來、似乎。 |
| 221 | general／concrete | 線／せん／線 | `general-listening-75:線` | `redline.svg` | 地面上一條紅線，人物停在線前不踩過去，表線（警戒線）。 |
| 222 | general／adverb | やっぱり／やっぱり／果然；還是 | `general-listening-75:やっぱり` | `asexpected.svg` | 人物事前在泡泡裡預想下雨，現在真的下雨了，點頭撐傘，表「果然」。 |
| 223 | general／expression | まさか／まさか／難不成 | `general-listening-75:まさか` | `nowaysurely.svg` | 人物看到眼前的事大吃一驚往後仰、雙手舉起，表「難不成、不會吧」。 |
| 224 | general／abstract | 反応／はんのう／反應 | `general-listening-76:反応` | `reacting.svg` | 手指按下按鈕的同時，旁邊燈亮起並發出聲響，箭頭連接，表反應。 |
| 225 | general／adverb | せめて／せめて／至少 | `general-listening-77:せめて` | `atleast.svg` | 量杯上標出一條最低線，水位剛好不低於那條線並打勾，表「至少、起碼」。 |
| 226 | general／abstract | 音色／ねいろ／音色 | `general-listening-78:音色` | `timbre.svg` | 同一個音由兩種樂器發出：小號的波形尖、笛子的波形圓滑，表音色。 |
| 227 | general／abstract | 課題／かだい／課題 | `general-listening-78:課題` | `assignment.svg` | 人物拿到一張寫有三項待完成目標的卡片，卡上空格待勾，表課題、作業。 |
| 228 | general／abstract | 似る／にる／相似 | `general-listening-78:似る` | `similarsounds.svg` | 鐘與笛子各自發出的聲波形狀幾乎一模一樣，中間以等號般的虛線相連，人物歪頭分辨不出，表（聲音）相似。 |
| 229 | general／verb | 開く／ひらく／打開 | `general-listening-79:開く` | `openingfile.svg` | 資料夾被打開，裡面的文件露出，箭頭表示翻開的方向，表打開（文件、記錄）。 |
| 230 | general／abstract | 消える／きえる／消失 | `general-listening-79:消える` | `datalost.svg` | 存檔圖示一個個從實心變成虛線空框，最後一格打叉，表（資料）消失、遺失。 |
| 231 | general／adjective | おかしい／おかしい／奇怪 | `general-listening-79:おかしい` | `strange.svg` | 一排整齊的方塊中有一個方向不對、顏色不同，人物盯著它皺眉，表奇怪、不對勁。 |
| 232 | general／abstract | 演目／えんもく／演出節目 | `general-listening-80:演目` | `program.svg` | 節目單上列出依序演出的三個節目圖示：唱歌、舞蹈、樂器，表演出節目。 |
| 233 | general／abstract | 短い／みじかい／短的 | `general-listening-80:短い` | `shortscene.svg` | 戲的時間軸上，主角的戲份很長，被圈出的這個角色只出場一小段，表短的（角色、戲份）。 |
| 234 | general／abstract | 短い／みじかい／短的 | `general-listening-87:短い` | `shortertext.svg` | 一長行文字被分成兩行較短的，剪刀在中間，表短的（文句）。 |
| 235 | general／adverb | ついで／ついで／順便 | `general-listening-81:ついで` | `whileatit.svg` | 人物去倉庫還工具時，順手把旁邊的信也一起帶走投遞，路線只走一趟，表順便。 |
| 236 | general／concrete | ラベル／らべる／標籤 | `general-listening-83:ラベル` | `label.svg` | 瓶子上貼著一張綠色標籤，標籤上有瓶子用途的小圖示，表標籤。 |
| 237 | general／adverb | 改めて／あらためて／重新；另行 | `general-listening-85:改めて` | `anew.svg` | 人物把舊的申請單放到一邊，重新拿一張空白單從頭再填，表重新、另行。 |
| 238 | general／abstract | 行／ぎょう／行 | `general-listening-87:行` | `textlines.svg` | 紙上文字分成整齊的幾行，其中一行被框起，表行（文字行）。 |
| 239 | general／abstract | 背景／はいけい／背景 | `general-listening-87:背景` | `background.svg` | 畫面前方的人物清楚，後方淡淡的山與天空被圈出，表背景。 |
| 240 | general／verb | 入れる／はいれる／能進入 | `general-listening-89:入れる` | `canenter.svg` | 人物持鑰匙打開門鎖，門開了走進去，打勾，表能進入。 |
| 241 | general／abstract | それまで／それまで／在那之前 | `general-listening-89:それまで` | `untilthen.svg` | 時間線從現在延伸到旗子標示的那個時刻，整段塗色，人物在這段期間坐著等，表到那時為止、在那之前。 |
| 242 | general／verb | 実行／じっこう／實行 | `general-listening-92:実行` | `execution.svg` | 計畫書上的箭頭化為實際行動：人物照著計畫書的步驟真的動手搬開石頭，表實行、執行。 |
| 243 | general／adverb | もともと／もともと／原本 | `general-listening-92:もともと` | `originally.svg` | 舊照片裡房子原本是藍色，箭頭指向現在改漆成紅色的同一棟，舊照片被圈出，表原本。 |
| 244 | general／concrete | 灯り／あかり／燈光 | `general-listening-93:灯り` | `signallight.svg` | 夜晚山丘上亮起紅色信號燈，光芒向外，遠處人物看見，表燈光。 |
| 245 | general／concrete | 管理室／かんりしつ／管理室 | `general-listening-94:管理室` | `controlroom.svg` | 牆上多個監視畫面與控制台，一人坐著操作開關，表管理室、控制室。 |
| 246 | general／verb | 直る／なおる／修好 | `general-listening-94:直る` | `fixedworking.svg` | 原本冒煙打叉的機器，箭頭之後亮起綠燈正常運轉，表修好、恢復正常。 |
| 247 | general／verb | 移動／いどう／移動 | `general-listening-95:移動` | `movinggroup.svg` | 整隊人物帶著行李從營地沿箭頭轉移到另一個地點，表（隊伍）移動。 |
| 248 | general／abstract | 対策／たいさく／對策 | `general-listening-96:対策` | `countermeasure.svg` | 上次被雨淋濕的記號這次改用石塊壓住並加蓋布，盾牌標出對策，表對策。 |
| 249 | general／abstract | たとえ／たとえ／即使 | `general-listening-96:たとえ` | `evenif.svg` | 即使暴雨打在身上，人物仍撐著傘繼續往前走，表「即使」。 |
| 250 | general／abstract | 明るさ／あかるさ／亮度 | `general-listening-98:明るさ` | `brightness.svg` | 同一盞燈旁的亮度刻度從暗到亮，指標停在最亮處，表亮度。 |
| 251 | general／abstract | 設定／せってい／設定 | `general-listening-98:設定` | `settings.svg` | 面板上有開關、滑桿與齒輪，其中一個開關從自動撥到手動，表設定。 |
| 252 | general／abstract | 人手／ひとで／人力 | `general-listening-99:人手` | `manpower.svg` | 一大堆工作箱旁只有一個人，旁邊還空著幾個人的虛線位置，表人力（不足）。 |
| 253 | general／abstract | 経過／けいか／經過 | `general-listening-100:経過` | `progresssofar.svg` | 路線上從出發點到現在位置走過的部分以實線與打勾點表示，後面還是虛線，表到目前為止的經過。 |
| 254 | general／concrete | 村長／そんちょう／村長 | `general-listening-101:村長` | `villagechief.svg` | 戴頭巾、拄手杖的長者站在村子中央，村民圍著聽他說話，表村長。 |
| 255 | general／abstract | ただ／ただ／只是 | `general-listening-102:ただ` | `justthat.svg` | 大致都好（打勾），只有一件小事：手上的箱子掉落，那一件被單獨圈出，表「只是…」補充一點。 |
| 256 | general／verb | つける／つける／加上；設置 | `general-listening-105:つける` | `markingpath.svg` | 人物在路邊的樹幹刻上記號、地上放石堆，為了回程不迷路，表加上（記號）、設置。 |
| 257 | general／verb | 晴れる／はれる／放晴；散去 | `general-listening-105:晴れる` | `fogclears.svg` | 霧從左往右散開，露出後方清楚的山與房子，表（霧）散去、放晴。 |
| 258 | general／concrete | 当番表／とうばんひょう／值班表 | `general-listening-107:当番表` | `dutyroster.svg` | 牆上的值班表一格一格對應人頭像，今天的格子被圈出，表值班表。 |
| 259 | general／verb | 動作／どうさ／運作 | `general-listening-108:動作` | `operating.svg` | 機器的齒輪轉動、燈亮、輸出口吐出成品，表運作、動作。 |
| 260 | general／verb | 試運転／しうんてん／試運轉 | `general-listening-108:試運転` | `machinetestrun.svg` | 修好的水車第一次轉動，旁人拿檢查表觀察是否正常，表試運轉。 |
| 261 | general／abstract | 状態／じょうたい／狀態 | `general-listening-108:状態` | `status.svg` | 裝置上的狀態燈：一顆綠、一顆黃、一顆滅，旁邊有人查看，表狀態。 |
| 262 | general／adverb | もう少し／もうすこし／再一點 | `general-listening-108:もう少し` | `alittlemore.svg` | 進度條已經快滿，只剩最後一小段被圈出，旁邊人物伸出手掌示意再等一下，表再一點、再稍微。 |
| 263 | general／abstract | 個人／こじん／個人 | `general-listening-111:個人` | `individual.svg` | 一群人中只有一人被單獨圈出、手上拿著自己的東西，表個人。 |
| 264 | general／concrete | 通行料／つうこうりょう／通行費 | `general-listening-112:通行料` | `toll.svg` | 橋頭的收費亭，人物把錢幣交給收費員後柵欄才升起，表通行費。 |
| 265 | general／abstract | その間／そのあいだ／那段期間 | `general-listening-112:その間` | `meanwhile.svg` | 同一時間兩條並行的時間帶：一人付款、另一人看著行李，上下以括號連成同一段期間，表那段期間、在此同時。 |
| 266 | general／concrete | 客室／きゃくしつ／接待室 | `general-listening-114:客室` | `guestroom.svg` | 有沙發、茶几與花瓶的接待室，老師坐著等候訪客，表接待室、客室。 |
| 267 | general／concrete | 長老／ちょうろう／長老 | `general-listening-115:長老` | `elder.svg` | 白髮、彎腰拄杖的年長者，旁邊年輕人恭敬地聽，表長老、長者。 |
| 268 | general／abstract | 間隔／かんかく／間隔 | `general-listening-116:間隔` | `interval.svg` | 時間線上等距的巡邏點，兩點之間用括號與時鐘標出間隔，表間隔。 |
| 269 | general／quantity | 三班／さんぱん／三個小組 | `general-listening-116:三班` | `threegroups.svg` | 人群被分成三個小圈，每圈兩人，表三個小組。 |
| 270 | general／quantity | 六本／ろっぽん／六瓶 | `general-listening-116:六本` | `sixbottles.svg` | 三個小組前各放兩瓶水，共六瓶排成兩列，表六瓶。 |
| 271 | general／adverb | 毎回／まいかい／每次 | `general-listening-116:毎回` | `everytime.svg` | 連續三格中同一個人每次巡邏到門前都敲一次門，三格的動作相同並各打勾，表每次。 |
| 272 | general／adverb | 普段／ふだん／平時 | `general-listening-117:普段` | `usually.svg` | 日曆上大多數日子的同一時間都有同樣的開門圖示，只有一天不同，表平時、平常。 |
| 273 | general／abstract | 何度／なんど／幾次 | `general-listening-117:何度` | `howmanytimes.svg` | 人物一再推著打不開的門，門上留下好幾道推的痕跡與計數刻痕，表幾次、好多次。 |
| 274 | general／verb | 開放／かいほう／開放 | `general-listening-119:開放` | `openedgate.svg` | 橋頭的柵門向兩側敞開，旗子豎起，人們可以自由通過，表開放。 |
| 275 | general／verb | 続く／つづく／延續 | `general-listening-121:続く` | `trailcontinues.svg` | 洞窟入口前的腳印一路延伸進洞裡，箭頭跟著腳印往深處，表（痕跡）延續、持續下去。 |
| 276 | general／concrete | 矢印／やじるし／箭頭 | `general-listening-122:矢印` | `arrowsign.svg` | 石牆上畫著一個醒目的向右紅色箭頭，表箭頭（記號）。 |
| 277 | general／verb | 示す／しめす／指示 | `general-listening-122:示す` | `pointsdirection.svg` | 岔路口的路標板指向其中一條路，那條路被標出，表指示（方向）。 |
| 278 | general／verb | 構える／かまえる／擺好架勢 | `general-listening-123:構える` | `stance.svg` | 人物雙腳張開、舉盾持劍擺好架勢，面向前方，表擺好架勢、準備迎擊。 |
| 279 | general／abstract | 隙／すき／空隙 | `general-listening-124:隙` | `gapopening.svg` | 敵人舉盾的動作露出一個破綻空檔（側身空處被圈出），表空隙、破綻。 |
| 280 | general／quantity | 一本／いっぽん／一根 | `general-listening-124:一本` | `onetorch.svg` | 牆上三個火把架只有中間一個插著燃燒的火把，其餘兩個空著，表只剩一根（火把）。 |
| 281 | general／abstract | 限る／かぎる／限定 | `general-listening-124:限る` | `limitedto.svg` | 只有手持特定徽章的人能通過閘門，其他人被擋，表限定、只限於。 |
| 282 | general／quantity | 一滴／いってき／一滴 | `general-listening-126:一滴` | `onedrop.svg` | 滴管尖端正滴下一滴藥水，落在杯中，表一滴。 |
| 283 | general／abstract | 適量／てきりょう／適量 | `general-listening-126:適量` | `rightamount.svg` | 量匙裡的藥粉剛好平齊刻度線，太多與太少的例子被打叉，表適量。 |
| 284 | general／abstract | 不明／ふめい／不明 | `general-listening-127:不明` | `unknown.svg` | 兩個身穿同樣徽章的人影都被打上虛線，中間的指認線斷開，無法確定是哪一個，表不明。 |
| 285 | general／verb | 断定／だんてい／斷定 | `general-listening-128:断定` | `concluding.svg` | 人物看著一件線索就用槌子敲下「定案」，其他線索還散在桌上，表斷定、下結論。 |
| 286 | general／adjective | 不確か／ふたしか／不確定 | `general-listening-128:不確か` | `uncertain.svg` | 目擊者泡泡裡的人影只有一半是實線、一半虛線，旁邊天秤搖擺，表不確定。 |
| 287 | general／concrete | 板／いた／板子 | `general-listening-132:板` | `floorplate.svg` | 地板上一塊顏色不同的踏板，人物一腳踩上去，表板子（踏板）。 |
| 288 | general／abstract | 中央／ちゅうおう／中央 | `general-listening-133:中央` | `center.svg` | 一排三格位置中，正中間那格被填色並站著新人，兩側是前衛與後衛，表中央。 |
| 289 | general／abstract | 両側／りょうがわ／兩側 | `general-listening-133:両側` | `bothsides.svg` | 中間一人，左右兩側各站一名護衛並同時被圈出，表兩側。 |
| 290 | general／verb | 付く／つく／跟隨；就位 | `general-listening-133:付く` | `takingposition.svg` | 人物走到治療員身旁指定的位置站定，地上的位置記號被腳踩住，表就位、跟隨在旁。 |
| 291 | general／verb | 移る／うつる／移動到 | `general-listening-133:移る` | `movingto.svg` | 人物從後排的位置沿箭頭移到前排的空位，原位留虛線，表移動到（某位置）。 |
| 292 | general／adverb | 後から／あとから／隨後 | `general-listening-133:後から` | `followinglater.svg` | 前面的人已經上路，後面一人隔一段時間才沿同一條路跟上，表隨後、晚一點跟上。 |
| 293 | general／expression | ぜひ／ぜひ／務必；很希望 | `general-listening-04:ぜひ` | `definitelywish.svg` | 人物雙手合十、身體前傾熱切地邀約對方一定要來，表務必、很希望。 |
| 294 | general／concrete | 気持ち／きもち／心意 | `general-listening-54:気持ち` | `smalltoken.svg` | 人物遞出一個繫著小愛心的小包，表一點心意（禮物所代表的心意）。 |
| 295 | general／verb | 保つ／たもつ／保持 | `general-listening-134:保つ` | `keepingdistance.svg` | 隊列後退時，人與人之間的間距箭頭保持一樣長，表保持（距離、隊形）。 |
| 296 | general／abstract | 全体／ぜんたい／整體 | `general-listening-134:全体` | `wholegroup.svg` | 一大框把隊伍所有成員一起圈住，沒有人在框外，表整體、全體。 |
| 297 | general／abstract | 属性／ぞくせい／屬性 | `general-listening-135:属性` | `elementattribute.svg` | 三個圖示並排：火、水滴、葉片，各代表一種屬性，火的那格被圈出，表屬性。 |
| 298 | general／abstract | 数値／すうち／數值 | `general-listening-135:数値` | `statnumber.svg` | 角色旁的能力表用長短不同的條狀與點數表示各項數值，不寫數字，表數值。 |
| 299 | general／verb | 受ける／うける／承受 | `general-listening-135:受ける` | `takinghit.svg` | 火球打在人物的盾上，人物被衝擊後退一步但站穩，表承受（攻擊）。 |
| 300 | general／abstract | 完全／かんぜん／完全 | `general-listening-135:完全` | `complete.svg` | 左邊盾牌只擋住一半火焰，右邊完整無缺的盾完全擋住並被圈出，表完全。 |
| 301 | general／abstract | 再使用／さいしよう／再次使用 | `general-listening-136:再使用` | `reusable.svg` | 用過的屏障圖示經過循環箭頭回到可用狀態，表可以再次使用。 |
| 302 | general／abstract | 両方／りょうほう／兩者 | `general-listening-136:両方` | `bothofthem.svg` | 兩個條件（沙漏與魔力瓶）都打勾，被同一個大括號括在一起，表兩者、兩方。 |
| 303 | general／abstract | 赤字／あかじ／紅色文字 | `general-listening-137:赤字` | `redletters.svg` | 信紙上混著紅字與黑字，只有紅字被框出，表紅色文字（紅字）。 |
| 304 | general／abstract | 黒字／くろじ／黑色文字 | `general-listening-137:黒字` | `blackletters.svg` | 信紙上混著紅字與黑字，黑字被淡化並標成只是裝飾，表黑色文字（黑字）。 |
| 305 | general／abstract | 読み方／よみかた／讀法 | `general-listening-137:読み方` | `howtoread.svg` | 暗號紙旁有一支箭頭示範讀的順序：由上往下、只跳著讀標記的格，表讀法。 |
| 306 | general／verb | 除く／のぞく／排除 | `general-listening-137:除く` | `excluding.svg` | 一排物品中，手把顏色不同的兩件挑出放到框外並打叉，表排除、除去。 |
| 307 | general／verb | 検討／けんとう／考慮 | `general-listening-138:検討` | `considering.svg` | 人物拿著委託信、托腮思考，天秤兩端放著好處與風險，表考慮、研議。 |
| 308 | general／abstract | 合意／ごうい／共識 | `general-listening-139:合意` | `agreementreached.svg` | 桌子兩邊的代表各自點頭，中間的協議書上兩個印章都蓋好，表共識、達成協議。 |
| 309 | general／abstract | 代表／だいひょう／代表 | `general-listening-139:代表` | `representative.svg` | 一群人背後，一人走到前面代表大家與對方談，身後的人用箭頭指向他，表代表。 |
| 310 | general／verb | 認める／みとめる／認可 | `general-listening-139:認める` | `approving.svg` | 負責人在條件書上蓋章並點頭，對方鬆一口氣，表認可、承認。 |
| 311 | general／abstract | 一方通行／いっぽうつうこう／單向通行 | `general-listening-141:一方通行` | `onewaypassage.svg` | 通道上只有單一方向的箭頭可走，逆向的箭頭被叉掉，表單向通行。 |
| 312 | general／concrete | 石扉／いしどびら／石門 | `general-listening-141:石扉` | `stonedoor.svg` | 以石塊砌成的厚重大門，表石門。 |
| 313 | general／verb | 確保／かくほ／確保 | `general-listening-141:確保` | `securingroute.svg` | 在退路上的每個轉角都站好守衛並插旗，回程路線被圈起保住，表確保（路線）。 |
| 314 | general／verb | 留まる／とどまる／留在原處 | `general-listening-143:留まる` | `stayput.svg` | 其他人移動，人物雙腳站穩在原地的圓圈記號內不動，表留在原處、待在原地。 |
| 315 | general／concrete | 武装／ぶそう／武裝 | `general-listening-144:武装` | `armed.svg` | 人物身穿盔甲、腰佩劍、手持盾，全副武裝，表武裝。 |
| 316 | general／concrete | 預かり証／あずかりしょう／寄存憑證 | `general-listening-144:預かり証` | `claimticket.svg` | 櫃檯收下人物交出的劍，交回一張附號碼牌形狀的寄存憑證，表寄存憑證。 |
| 317 | general／adverb | 一時／いちじ／暫時 | `general-listening-144:一時` | `temporarily.svg` | 劍被放進寄存櫃，時間條上只有一小段標記，結尾箭頭指回原主，表暫時、一時。 |
| 318 | general／verb | 維持／いじ／維持 | `general-listening-145:維持` | `sustaining.svg` | 人物站在陣內持續把力量送進發光的結界，結界才持續存在，表維持。 |
| 319 | general／concrete | 鍵／かぎ／鑰匙 | `general-listening-146:鍵` | `gemkey.svg` | 一顆寶石正好嵌進封印石板中央的凹槽，封印的鎖紋因此鬆開，表當作鑰匙用的寶石（解封用的鑰匙）。 |
| 320 | general／abstract | 消耗品／しょうもうひん／消耗品 | `general-listening-146:消耗品` | `consumable.svg` | 寶石鑰匙用完一次後碎成碎片，箭頭從完整到碎裂，表消耗品。 |
| 321 | general／abstract | 用途／ようと／用途 | `general-listening-146:用途` | `itemuse.svg` | 一把鑰匙指向它的用途：打開封印的鎖；旁邊拿它去包紮傷口被打叉，表用途。 |
| 322 | general／verb | 写る／うつる／映入影像 | `general-listening-147:写る` | `capturedinphoto.svg` | 照片裡拍到了一個戴徽章的人影，相機在旁，表（被）拍進照片、映入影像。 |
| 323 | general／verb | 示す／しめす／表示 | `general-listening-147:示す` | `showsevidence.svg` | 照片上的徽章被放大鏡圈出，並以箭頭連到對應的人，表（證物）表示、顯示出。 |
| 324 | general／abstract | 記載／きさい／記載 | `general-listening-148:記載` | `writtenrecord.svg` | 帳簿上已寫明物品與日期的一行被框出，旁邊同樣的實物，表記載。 |
| 325 | general／verb | 閉じる／とじる／合上 | `general-listening-148:閉じる` | `closingbook.svg` | 雙手把攤開的帳簿合起來，箭頭表示合上的方向，表合上（書本）。 |
| 326 | general／abstract | 当事者／とうじしゃ／當事人 | `general-listening-149:当事者` | `partyconcerned.svg` | 一場爭執中直接相關的那個人被圈出，旁觀的人在外圍，表當事人。 |
| 327 | general／abstract | 修理代／しゅうりだい／修理費 | `general-listening-149:修理代` | `repaircost.svg` | 修理好的椅子旁放著一張帳單與一疊錢幣，表修理費。 |
| 328 | general／abstract | 意思／いし／意願 | `general-listening-149:意思` | `wishes.svg` | 當事人自己的想法泡泡（點頭或搖頭）被圈出，旁人不能代替決定，表意願。 |
| 329 | general／verb | 撤収／てっしゅう／撤收 | `general-listening-150:撤収` | `packingup.svg` | 眾人收起帳篷、把工具裝箱搬離營地，表撤收、撤離。 |
| 330 | general／concrete | 東門／ひがしもん／東門 | `general-listening-150:東門` | `eastgate.svg` | 城牆右側的門被圈出，旁邊羅盤指出東方，太陽從那邊升起，表東門。 |
| 331 | general／verb | 逃す／にがす／讓人逃離 | `general-listening-150:逃す` | `lettingescape.svg` | 籠門打開，鳥飛走，追的人來不及抓，表讓…逃走、放走。 |
| 332 | general／abstract | 指す／さす／指稱 | `general-listening-151:指す` | `referringto.svg` | 說話泡泡裡的代名詞方塊以虛線連到它所指的那個箱子，表指稱、指的是。 |
| 333 | general／verb | 開封／かいふう／拆封 | `general-listening-151:開封` | `unsealing.svg` | 手撕開信封的封口，蠟封裂開，信紙露出一角，表拆封。 |
| 334 | general／abstract | 便／びん／班次 | `general-listening-152:便` | `scheduledrun.svg` | 港口時刻板上一排班次圖示，其中傍晚那一班的船被圈出，表（交通）班次。 |
| 335 | general／quantity | 一組／ひとくみ／一組 | `general-listening-154:一組` | `oneset.svg` | 一個托盤上配成一套的杯與碟與湯匙，表一組、一套。 |
| 336 | general／abstract | 主語／しゅご／主語 | `general-listening-154:主語` | `grammarsubject.svg` | 一串句子方塊中，最前面代表「誰」的人形方塊被圈出，後面接動作方塊，表主語。 |
| 337 | general／abstract | 対象／たいしょう／對象 | `general-listening-154:対象` | `target.svg` | 一條指示箭頭指向一群人中特定幾位（被圈起），其他人不在範圍內，表對象。 |
| 338 | general／abstract | 余分／よぶん／多餘 | `general-listening-154:余分` | `extra.svg` | 需要的份數打勾放好，多出來的兩份另外放在虛線框中，表多餘、額外。 |
| 339 | general／abstract | 各自／かくじ／各自 | `general-listening-154:各自` | `eachperson.svg` | 每個人手上各拿一份自己的東西，箭頭從每份分別指向各自，表各自。 |
| 340 | general／abstract | 不満／ふまん／不滿 | `general-listening-155:不満` | `dissatisfied.svg` | 人物雙臂抱胸、嘴角向下瞪著遲到的同伴，頭上小烏雲，表不滿。 |
| 341 | general／verb | 届く／とどく／到達 | `general-listening-155:届く` | `messagereached.svg` | 傳話人把一張口信紙條交到收件人手中，收件人打開確認，旁邊打勾，表（口信）送達、傳到。 |
| 342 | general／abstract | 手段／しゅだん／手段 | `general-listening-155:手段` | `means.svg` | 同一個目的地，可以用信鴿、跑腿的人或狼煙三種管道送到，選中的一種被圈出，表手段、方法。 |
| 343 | general／abstract | 情報源／じょうほうげん／消息來源 | `general-listening-157:情報源` | `infosource.svg` | 一則消息的泡泡沿虛線回溯到最初說出它的人，那人被圈出，表消息來源。 |
| 344 | general／concrete | 報告者／ほうこくしゃ／報告者 | `general-listening-157:報告者` | `reporter.svg` | 人物站在隊長面前，手持紀錄板說明看到的事，表報告者。 |
| 345 | general／concrete | 覆い／おおい／覆蓋物 | `general-listening-157:覆い` | `cover.svg` | 貨車上的箱子被一塊大布完全蓋住，看不到裡面，表覆蓋物。 |
| 346 | general／abstract | 確証／かくしょう／確證 | `general-listening-157:確証` | `proof.svg` | 手上的證物與紀錄完全吻合，兩者以實線相連並蓋上確認章，表確證、證明。 |
| 347 | general／verb | 見かける／みかける／看見 | `general-listening-157:見かける` | `spotting.svg` | 人物走在路上，眼角瞥見遠處推著貨車經過的人影，視線虛線，表看見、碰巧看到。 |
| 348 | general／adverb | 通常／つうじょう／通常 | `general-listening-158:通常` | `normally.svg` | 平常日子裡有通行證就能過橋（打勾），只有今天這格因施工被叉掉，表通常、一般情況下。 |
| 349 | general／adjective | 有効／ゆうこう／有效 | `general-listening-158:有効` | `valid.svg` | 通行證上的期限條還沒到期、蓋著有效章，守門人點頭放行，表有效。 |
| 350 | general／abstract | 例外なく／れいがいなく／無例外地 | `general-listening-158:例外なく` | `noexceptions.svg` | 一排物件全都通過同一道閘門的規則框，沒有任何一個被放在外面，表無例外地。 |
| 351 | general／abstract | 早合点／はやがてん／過早下判斷 | `general-listening-159:早合点` | `jumpingconclusion.svg` | 只看到一個腳印，人物就跳到結論泡泡（以為走了），中間的步驟被略過成虛線，表過早下判斷。 |
| 352 | general／abstract | 試作／しさく／試作 | `general-listening-159:試作` | `prototype.svg` | 工作台上第一個粗糙的試作品，旁邊設計圖與待修正記號，表試作。 |
| 353 | general／verb | 仕上げ／しあげ／最後加工 | `general-listening-159:仕上げ` | `finishingtouch.svg` | 幾乎完成的作品上，手正用細筆補上最後一筆，表最後加工、收尾。 |
| 354 | general／verb | 考え直す／かんがえなおす／重新考慮 | `general-listening-159:考え直す` | `reconsider.svg` | 人物看著先前做好的決定卡，一個迴轉箭頭繞回來重新思考，表重新考慮。 |
| 355 | general／verb | 宛てる／あてる／對準對象 | `general-listening-159:宛てる` | `addressedto.svg` | 信件上的箭頭精準指向特定收件人，其他人沒有被指到，表對準（某對象）、寄給。 |
| 356 | general／adverb | 一旦／いったん／暫且 | `general-listening-159:一旦` | `pausemoment.svg` | 工作進行到一半時按下暫停，計時條中間停住，之後再繼續，表暫且、暫時先。 |
| 357 | general／abstract | 雨量／うりょう／雨量 | `general-listening-161:雨量` | `rainfall.svg` | 雨水落進雨量筒，筒上的刻度顯示累積的高度，表雨量。 |
| 358 | general／verb | 超える／こえる／超過 | `general-listening-161:超える` | `exceeding.svg` | 船上貨物的重量指針越過紅色上限線，表超過。 |
| 359 | general／abstract | 評価／ひょうか／評價 | `general-listening-162:評価` | `evaluation.svg` | 人物拿著方案紙，在旁邊的評分格上打出幾顆星，表評價。 |
| 360 | general／abstract | 時期／じき／時機 | `general-listening-162:時期` | `timing.svg` | 同一個計畫放在日曆的不同時間點：今晚那格打叉，下週那格打勾，表時機。 |
| 361 | general／verb | 得る／える／獲得 | `general-listening-162:得る` | `gaining.svg` | 人物伸手接住從上方落下的寶物，箭頭指向自己，表獲得、得到。 |
| 362 | general／adjective | 賢い／かしこい／聰明 | `general-listening-162:賢い` | `clever.svg` | 人物用一根槓桿就輕鬆撬起大石，頭上亮起燈泡，表聰明、巧妙。 |
| 363 | general／verb | 採用／さいよう／採用 | `general-listening-162:採用` | `adopting.svg` | 多張提案中一張被拿起蓋上採用章，貼到公告板上，表採用。 |
| 364 | general／abstract | 立場／たちば／立場 | `general-listening-163:立場` | `standpoint.svg` | 兩人站在不同的台子上看同一座山，視線角度不同，表立場、看事情的角度。 |
| 365 | general／abstract | 仮定／かてい／假設 | `general-listening-163:仮定` | `supposing.svg` | 人物在泡泡裡想像「如果走另一條路」，泡泡內是虛線的另一個場景，表假設。 |
| 366 | general／abstract | 北側／きたがわ／北側 | `general-listening-163:北側` | `northside.svg` | 山被分成南北兩面，羅盤指北，結冰的北側斜坡被圈出，表北側。 |
| 367 | general／abstract | 南側／みなみがわ／南側 | `general-listening-163:南側` | `southside.svg` | 山被分成南北兩面，太陽照著的南側斜坡被圈出，表南側。 |
| 368 | general／verb | 入室／にゅうしつ／進入房間 | `general-listening-164:入室` | `enteringroom.svg` | 人物跨過門檻走進房間，箭頭從門外指向室內，表進入房間。 |
| 369 | general／concrete | 受け手／うけて／接收者 | `general-listening-165:受け手` | `receiver.svg` | 通訊兩端：接起對講機的那一方被圈出，訊號波朝他而來，表接收者。 |
| 370 | general／concrete | 運び手／はこびて／搬運者 | `general-listening-165:運び手` | `carrier.svg` | 背著大箱子的人沿路線把東西送過去，人物被圈出，表搬運者。 |
| 371 | general／verb | 取りに行く／とりにいく／前去拿取 | `general-listening-165:取りに行く` | `goingtofetch.svg` | 人物空手出發到倉庫，再拿著電池走回來，往返箭頭，表前去拿取。 |
| 372 | general／concrete | 復旧班／ふっきゅうはん／修復小組 | `general-listening-166:復旧班` | `repaircrew.svg` | 戴安全帽的三人小組在電線桿下修理斷掉的電線，表修復小組。 |
| 373 | general／verb | 取り戻す／とりもどす／挽回 | `general-listening-166:取り戻す` | `catchingup.svg` | 落後的進度條被一段加速箭頭補回到原定位置，表挽回、追回（延誤）。 |
| 374 | general／abstract | 手間／てま／工夫 | `general-listening-167:手間` | `effort.svg` | 人物重抄一整疊紙，旁邊時鐘轉了好幾圈、手很痠，表工夫、麻煩。 |
| 375 | general／verb | 清書／せいしょ／謄清 | `general-listening-167:清書` | `faircopy.svg` | 左邊塗改過的草稿，右邊乾淨整齊重抄好的版本被圈出，表謄清、抄成正本。 |
| 376 | general／abstract | 敬語／けいご／敬語 | `general-listening-168:敬語` | `politespeech.svg` | 說話者面對長輩時鞠躬，泡泡加上禮貌的花邊；面對朋友的泡泡則是普通外框，表敬語。 |
| 377 | general／abstract | 関係／かんけい／關係 | `general-listening-168:関係` | `relationship.svg` | 兩人之間一條線連起，線上的結表示他們的關係（親近或正式），表關係。 |
| 378 | general／abstract | 頼み方／たのみかた／請託方式 | `general-listening-168:頼み方` | `wayofasking.svg` | 同一個請求用兩種說法：左邊鞠躬客氣地請、右邊輕鬆地拍肩請，兩者都指向同一本書，表請託方式。 |
| 379 | general／verb | 言い換える／いいかえる／換句話說 | `general-listening-168:言い換える` | `rephrasing.svg` | 一個長而難的說法方塊經過轉換箭頭，變成另一個意思相同但較簡單的方塊，表換句話說。 |
| 380 | general／abstract | 言葉遣い／ことばづかい／措辭 | `general-listening-168:言葉遣い` | `wording.svg` | 說話泡泡裡挑選用詞：幾個形狀不同的詞塊中選了一塊放進句子，表措辭、用詞。 |
| 381 | general／verb | 呼び止める／よびとめる／叫住 | `general-listening-169:呼び止める` | `callingtostop.svg` | 人物從後方大聲呼喊並伸手，正要離開的人停下腳步回頭，表叫住。 |
| 382 | general／abstract | 門前／もんぜん／門前 | `general-listening-169:門前` | `beforegate.svg` | 城門外、門前的空地上，馬車與人在等待，門前區域被圈出，表門前。 |
| 383 | general／abstract | 否定形／ひていけい／否定形 | `general-listening-169:否定形` | `negativeform.svg` | 同一個動作方塊，後面接上否定詞尾方塊後，整句意思由打勾翻轉成打叉，表否定形。 |
| 384 | general／verb | 念押し／ねんおし／再次確認 | `general-listening-169:念押し` | `doublecheck.svg` | 說完之後再伸出食指確認一次：同一個要點被打了兩個勾，表再次確認、叮嚀。 |
| 385 | general／abstract | 続き／つづき／接續內容 | `general-listening-169:続き` | `continuation.svg` | 話說到一半的泡泡後面接上另一個泡泡，中間以「接續」箭頭相連，表接續的內容、後續。 |
| 386 | general／abstract | 全文／ぜんぶん／全文 | `general-listening-169:全文` | `fulltext.svg` | 一整份從頭到尾的文件被整體框起，而不是只摘一段，表全文。 |
| 387 | general／concrete | 御者／ぎょしゃ／車夫 | `general-listening-169:御者` | `coachman.svg` | 坐在馬車前座握著韁繩的駕車人，表車夫。 |
| 388 | general／concrete | 宿舎／しゅくしゃ／宿舍 | `general-listening-170:宿舎` | `lodging.svg` | 一排相同房間的宿舍樓，門口掛著同一隊的旗子，表宿舍。 |
| 389 | general／concrete | 提案者／ていあんしゃ／提案者 | `general-listening-170:提案者` | `proposer.svg` | 會議中舉手站起、手拿方案的那個人被圈出，表提案者。 |
| 390 | general／abstract | 最終／さいしゅう／最終 | `general-listening-170:最終` | `final.svg` | 一串修改過的版本卡片，最後一張打上確定章並被圈出，表最終。 |
| 391 | general／verb | 手配／てはい／安排 | `general-listening-170:手配` | `makingarrangements.svg` | 人物一邊講電話、一邊在清單上預約車輛與時間，表安排、手配。 |
| 392 | general／abstract | 変更点／へんこうてん／變更事項 | `general-listening-170:変更点` | `changes.svg` | 新舊兩份行程並列，有改動的那一格以紅色標出，表變更事項。 |
| 393 | general／concrete | 確認会／かくにんかい／確認會 | `general-listening-170:確認会` | `reviewmeeting.svg` | 幾個人圍桌，桌上的清單逐項打勾核對，表確認會。 |
| 394 | general／abstract | 臨時／りんじ／臨時 | `general-listening-172:臨時` | `temporaryclosure.svg` | 平時開著的館門今天臨時關上，門口立著施工告示牌，表臨時（關閉）。 |
| 395 | general／abstract | 翌日／よくじつ／隔日 | `general-listening-172:翌日` | `nextday.svg` | 兩個並排的日期格，箭頭從今天（紅點）指到右邊緊接的下一天，表隔日、第二天。 |
| 396 | general／concrete | 弦／げん／弦 | `general-listening-173:弦` | `instrumentstring.svg` | 琴身上繃緊的幾條弦，其中一條被手指撥動而振動，表弦。 |
| 397 | general／verb | 言いかける／いいかける／話說到一半 | `general-listening-174:言いかける` | `startedtosay.svg` | 人物張口說話，但泡泡只寫了一半就斷開，被電話鈴打斷，表話說到一半。 |
| 398 | general／concrete | 複写／ふくしゃ／複印 | `general-listening-174:複写` | `photocopy.svg` | 影印出的一張副本與原稿並排，副本顏色較淡並被圈出，表複印（的副本）。 |
| 399 | general／adjective | 明確／めいかく／明確 | `general-listening-174:明確` | `clearlystated.svg` | 清單上的條件寫得一條一條清楚，每條旁邊都有對應的圖示與勾，不含糊，表明確。 |
| 400 | general／abstract | 指定／してい／指定 | `general-listening-174:指定` | `designated.svg` | 地圖上指定的一處被插上旗子並框起，其他地方不行，表指定。 |
| 401 | general／abstract | 人称／にんしょう／人稱 | `general-listening-175:人称` | `grammaticalperson.svg` | 說話者指自己、指聽話者、指旁邊第三人，三個人分別被不同顏色的圈標出，表人稱。 |
| 402 | general／abstract | 時点／じてん／時間點 | `general-listening-175:時点` | `pointintime.svg` | 時間線上一個特定時刻被釘上圖釘，那一刻的狀態畫在旁邊，表時間點。 |
| 403 | general／concrete | 宛名／あてな／收件人姓名 | `general-listening-176:宛名` | `addresslabel.svg` | 信封正面寫收件人姓名的那一欄被放大鏡圈出，表收件人姓名、宛名。 |
| 404 | general／abstract | 迷惑／めいわく／困擾 | `general-listening-176:迷惑` | `nuisance.svg` | 人物的東西擋住別人的路，對方被迫繞道而困擾，表給人添麻煩、困擾。 |
| 405 | general／verb | 回収／かいしゅう／取回 | `general-listening-176:回収` | `retrieving.svg` | 送錯的包裹被拿回，箭頭從別人門口回到自己手上，表取回、回收。 |
| 406 | general／abstract | 悪気／わるぎ／惡意 | `general-listening-176:悪気` | `illintent.svg` | 人物心裡畫著一顆冒黑煙的心，表惡意；旁邊打叉表示這次沒有惡意。 |
| 407 | general／concrete | 複写機／ふくしゃき／影印機 | `general-listening-177:複写機` | `copier.svg` | 影印機的蓋子掀起，出紙口吐出一張紙，表影印機。 |
| 408 | general／abstract | 予告／よこく／預告 | `general-listening-177:予告` | `advancenotice.svg` | 日曆上事情發生的那天之前，提早幾天就貼出告知的信件，箭頭從告知指向當天，表預告、事先通知。 |
| 409 | general／abstract | 反問／はんもん／反問 | `general-listening-178:反問` | `rhetoricalquestion.svg` | 說話者張開雙手反問，泡泡裡的問句其實指向「不可能有人這麼做」（打叉的人影），表反問。 |
| 410 | general／abstract | 疑問／ぎもん／疑問 | `general-listening-178:疑問` | `doubt.svg` | 人物看著一張說明書，頭上一個彎曲的思考線與一半打勾一半打叉，表疑問、疑惑。 |
| 411 | general／abstract | 強調／きょうちょう／強調 | `general-listening-178:強調` | `emphasis.svg` | 一串詞塊中被強調的那一塊特別大、加粗並加上強調線，表強調。 |
| 412 | general／abstract | 語尾／ごび／句尾 | `general-listening-178:語尾` | `sentenceending.svg` | 一串句子方塊的最後一塊被圈出並放大，表句尾（決定語氣的部分）。 |
| 413 | general／abstract | 文脈／ぶんみゃく／語境 | `general-listening-178:文脈` | `context.svg` | 一個詞塊夾在前後句子之間，前後的線條以括號包住它，由周圍決定它的意思，表語境、上下文。 |
| 414 | general／abstract | 守る／まもる／保護；遵守 | `general-listening-178:守る` | `keepingfaith.svg` | 委託人遞出要求背叛同伴的錢袋，人物伸手擋下打叉，另一手護在身後的同伴前，表守住（與同伴的信義）、不背叛。 |
| 415 | general／verb | 問い詰める／といつめる／追問責難 | `general-listening-178:問い詰める` | `grilling.svg` | 一人逼近對方、手指著連續追問，被問的人退到牆邊冒汗，表追問責難。 |
| 416 | general／abstract | 確認済み／かくにんずみ／已確認 | `general-listening-179:確認済み` | `verified.svg` | 已確認的項目蓋上了確認章並移到右邊整齊排好，未確認的留在左邊，表已確認。 |
| 417 | general／abstract | 事実／じじつ／事實 | `general-listening-179:事実` | `facts.svg` | 紀錄板上只寫進有實際證物支持的項目（腳印、時鐘），推測的泡泡被排除在外，表事實。 |
| 418 | general／abstract | 総合／そうごう／綜合 | `general-listening-180:総合` | `overall.svg` | 路線、天氣、人員三張小圖匯整進一張大的總表，表綜合。 |
| 419 | general／concrete | 東口／ひがしぐち／東側入口 | `general-listening-180:東口` | `eastexit.svg` | 車站建築的右側（東側）出口被圈出，羅盤指向東方，表東側入口、東口。 |
| 420 | general／concrete | 西口／にしぐち／西側入口 | `general-listening-180:西口` | `westexit.svg` | 車站建築的左側（西側）出口被圈出，羅盤與箭頭指向西方，表西側入口、西口。 |
| 421 | games／verb | かくれんぼのはじまりはじまり。／かくれんぼの はじまり はじまり。／捉迷藏要開始囉，開始囉。 | `game-card:game:er:jackie:selection-voice:31e28fd5fe:31e28fd5fe` | `hideandseek.svg` | 一人摀著眼睛倒數，其他人躲在樹與箱子後面，表捉迷藏開始。 |
| 422 | games／verb | システムは壊す時がいつもしびれるよね、でしょ？／システムは こわす ときが いつも しびれるよね、でしょ？／破壞系統的時候總是很過癮，對吧？ | `game-card:game:er:jackie:selection:1001003:03693900a4` | `smashingsystem.svg` | 人物揮鐵鎚敲向電腦主機，主機冒出火花與裂痕，表破壞系統。 |
| 423 | games／adverb | いつも通りにやればいいよね。／いつもどおりに やれば いいよね。／照平常那樣做就好了吧。 | `game-card:game:er:jackie:selection-voice:f2d48272a7:f2d48272a7` | `asusual.svg` | 連續三天都按同樣步驟做同一件事，三格的動作一致，人物從容點頭，表照平常那樣。 |
| 424 | games／concrete | メイドならどんな時でも鋭い剣を備えておくべきだ。／メイドなら どんな ときでも するどい けんを そなえておくべきだ。／既然是女僕，不論何時都該備好鋒利的劍。 | `game-card:game:er:fiora:selection-voice:b05efe8703:b05efe8703` | `readyblade.svg` | 圍著圍裙的女僕腰間佩著一把擦亮的劍，隨時可拔，表時時備好利劍。 |
| 425 | games／verb | 俺様の走りを誰も止めることはできない！／おれさまの はしりを だれも とめることは できない！／誰都擋不住本大爺的奔馳！ | `game-card:game:er:magnus:selection-voice:cf6c2b990a:cf6c2b990a` | `unstoppablerunner.svg` | 人物全速奔跑，擋在前面的柵欄被衝倒，速度線拉長，表誰都擋不住的奔馳。 |
| 426 | games／abstract | よく見ておけ。誰にも止められないこの力を！／よく みておけ。だれにも とめられない この ちからを！／看仔細了。這股力量誰也阻止不了！ | `game-card:game:er:magnus:selection:1004005:b69445a65b` | `unstoppablepower.svg` | 人物握拳，身上湧出的光波把周圍的岩石推開，表誰也阻止不了的力量。 |
| 427 | games／abstract | この俺は、人間の限界をも超越した。／この おれは、にんげんの げんかいをも ちょうえつした。／我已經連人類的極限都超越了。 | `game-card:game:er:magnus:selection-voice:0e2be33f50:0e2be33f50` | `beyondlimits.svg` | 量表上的人類極限紅線被指針遠遠越過，人物在線之上，表超越極限。 |
| 428 | games／verb | 神から与えられた試練なのであれば、喜んで受け入れよう。／かみから あたえられた しれんなので あれば、よろこんで うけいれよう。／如果這是神賜予的試煉，我樂意接受。 | `game-card:game:er:zahir:selection-voice:332664fbf6:332664fbf6` | `acceptingtrial.svg` | 光芒中降下一塊沉重的試煉石板，人物張開雙手迎接並點頭，表樂意接受試煉。 |
| 429 | games／verb | 神から与えられた金であれば、喜んで受け入れよう。／かみから あたえられた かねで あれば、よろこんで うけいれよう。／如果是神賜予的錢，我樂意收下。 | `game-card:game:er:zahir:selection-voice:9c8f621f8a:9c8f621f8a` | `heavenmoney.svg` | 天上光芒中落下金幣，人物撐開袋子喜孜孜地接住，表樂意收下天降之財。 |
| 430 | games／abstract | 信じられるのはこの拳だけだ。／しんじられるのは この こぶしだけだ。／能相信的只有這雙拳頭。 | `game-card:game:er:hyunwoo:selection-voice:149a9f3f71:149a9f3f71` | `trustfist.svg` | 人物緊握的拳頭被放大圈出，旁邊其他工具被推開，表唯一信得過的只有自己的拳頭。 |
| 431 | games／expression | 私がいなきゃダメ～。／わたしが いなきゃ ダメ～。／沒有我可不行～ | `game-card:game:er:lidailin:selection-voice:45979fc84b:45979fc84b` | `cantdowithoutme.svg` | 人物叉腰得意地站在中央，周圍同伴手忙腳亂、東西掉一地，表「沒有我可不行」。 |
| 432 | games／expression | トリックオア...ドリンク～？／トリックオア...ドリンク～？／不給糖就搗蛋……還是來杯飲料？ | `game-card:game:er:lidailin:selection:1010007:634d98657d` | `trickordrink.svg` | 萬聖節南瓜燈旁，扮裝的人物遞出糖果袋卻改端起一杯飲料，表「不給糖就搗蛋…還是來杯飲料？」。 |
| 433 | games／verb | やっぱ飲んで遊ぶのが一番だよね～。／やっぱ のんで あそぶのが いちばんだよね～。／果然還是邊喝邊玩最棒了～ | `game-card:game:er:lidailin:selection-voice:d3f949c573:d3f949c573` | `drinkandplay.svg` | 兩人舉杯乾杯，旁邊擺著骰子與牌，表邊喝邊玩。 |
| 434 | games／abstract | 彷徨う魂に救済を。／さまよう たましいに きゅうさいを。／給徬徨的靈魂救贖吧。 | `game-card:game:er:yuki:selection:1011005:1b0f94273a` | `savingsouls.svg` | 迷失飄盪的小靈魂被一道柔光接住、往上帶向光亮處，表給徬徨的靈魂救贖。 |
| 435 | games／abstract | この運命、神様の思し召しなら…／この うんめい、かみさまの おぼしめしなら…／這命運，若是神的旨意…… | `game-card:game:er:hyejin:selection-voice:781f963185:781f963185` | `willofgod.svg` | 天上的光線照下，人物低頭雙手合十接受落在掌中的命運之線，表若是神的旨意。 |
| 436 | games／verb | ご主人様の思し召しなら、従います、にゃん…／ごしゅじんさまの おぼしめしなら、したがいます、にゃん…／若是主人的旨意，我會遵從，喵…… | `game-card:game:er:hyejin:selection:1012006:9cb418067d` | `obeyingmaster.svg` | 戴貓耳的女僕低頭鞠躬，主人伸手下指令，表遵從主人的旨意。 |
| 437 | games／abstract | 共に行動すれば、もっと安全になるでしょう。／ともに こうどうすれば、もっと あんぜんに なるでしょう。／一起行動的話，應該會更安全吧。 | `game-card:game:er:hyejin:selection-voice:d70f49d390:d70f49d390` | `saferintogether.svg` | 一人獨行時被陰影包圍，三人並肩同行時周圍的保護圈完整，表一起行動更安全。 |
| 438 | games／abstract | 私には救いなんてない。／わたしには すくいなんて ない。／我根本沒有救贖。 | `game-card:game:er:chiara:selection-voice:8fc5b683a3:8fc5b683a3` | `nosalvation.svg` | 人物垂頭坐在陰暗處，伸出的手搆不到遠方的一道光，表沒有救贖。 |
| 439 | games／expression | 今日はどんなお客さんが来てくれるのか、楽しみです。／きょうは どんな おきゃくさんが きてくれるのか、たのしみです。／很期待今天會有哪些客人來。 | `game-card:game:er:sissela:selection:1015004:efa64af83d` | `awaitingguests.svg` | 店主在敞開的店門內期待地望向外面的小路，路上有客人走來，表期待今天的客人。 |
| 440 | games／abstract | 甘いもので痛みを忘れたりできるのでしょうか。／あまい もので いたみを わすれたり できるのでしょうか。／靠甜食能讓人忘記痛苦嗎？ | `game-card:game:er:sissela:selection-voice:43db96b6f8:43db96b6f8` | `sweetsforpain.svg` | 人物膝上貼著繃帶，手捧甜點，頭上的痛感線變淡，表靠甜食忘記痛苦。 |
| 441 | games／abstract | 遅れたら払戻されちゃうよ！／おくれたら はらいもどされちゃうよ！／要是遲到了，款項就會被退回喔！ | `game-card:game:er:silvia:selection:1016003:ceb73e57dc` | `refundifdelayed.svg` | 時鐘越過約定時間，錢幣沿迴轉箭頭退回付款人手上，表遲到就會被退款。 |
| 442 | games／verb | 悪いやつらをやっつけに行くんだよね？／わるいやつらを やっつけに いくんだよね？／我們是要去收拾壞人，對吧？ | `game-card:game:er:silvia:selection:1016005:8bbe599649` | `beatbadguys.svg` | 兩名夥伴舉拳出發，前方是蒙面的壞人，表去收拾壞人。 |
| 443 | games／abstract | 正義を貫く時間だね！／せいぎを つらぬく じかんだね！／是貫徹正義的時候了！ | `game-card:game:er:silvia:selection-voice:07b093dd39:07b093dd39` | `upholdjustice.svg` | 人物把旗桿筆直插進地面，旗子迎風、天平標記在旗上，周圍風再大也不倒，表貫徹正義。 |
| 444 | games／expression | どう？似合うでしょ？／どう？にあうでしょ？／怎麼樣？很適合我吧？ | `game-card:game:er:adriana:selection-voice:3155d1f264:3155d1f264` | `suitsme.svg` | 人物換上新衣在鏡子前轉身擺姿勢，鏡中映出同樣的身影並有星光，表「很適合我吧」。 |
| 445 | games／abstract | 必要であれば、何だってします。／ひつようで あれば、なんだって します。／如果有必要，我什麼都願意做。 | `game-card:game:er:shoichi:selection-voice:cdab906bb0:cdab906bb0` | `willdoanything.svg` | 人物捲起袖子站在一大堆不同工具前，張開雙手表示都可以做，表有必要的話什麼都做。 |
| 446 | games／expression | 今からでも、あたしの手下になるのはどう？／いまからでも、あたしの てしたに なるのは どう？／現在也不遲，要不要當我的手下？ | `game-card:game:er:lenox:selection-voice:9b1828c7b2:9b1828c7b2` | `recruitminion.svg` | 老大坐在高椅上伸手招攬，對方猶豫看著遞來的手下臂章，表要不要當我的手下。 |
| 447 | games／abstract | ロッジ、単独行動は控えめに。全隊員、戦闘準備！／ロッジ、たんどく こうどうは ひかえめに。ぜんたいいん、せんとう じゅんび！／洛茲，少單獨行動。全體隊員，準備戰鬥！ | `game-card:game:er:rozzi:selection-voice:7bb57c7126:7bb57c7126` | `battleready.svg` | 隊長舉手下令，隊員們同時舉起盾與劍站成一排，表全體戰鬥準備。 |
| 448 | games／verb | ウイルスは広がる前に排除しなければなりません。／ウイルスは ひろがる まえに はいじょしなければ なりません。／病毒必須在擴散前排除。 | `game-card:game:er:cathy:selection:1023002:18fc3e29b1` | `removevirus.svg` | 放大鏡下的病毒小球被夾子夾出，擴散方向的箭頭被叉掉，表在擴散前排除病毒。 |
| 449 | games／abstract | 私がいるとこなら、どこでも病院なのです。／わたしが いる とこなら、どこでも びょういんなのです。／只要有我在的地方，哪裡都是醫院。 | `game-card:game:er:cathy:selection-voice:8c2c9db6db:8c2c9db6db` | `mobileclinic.svg` | 醫生背著藥箱走到哪，身後就出現病床與十字標記，表有我在的地方就是醫院。 |
| 450 | games／verb | 出番なのか。手を読んでみよう。／でばんなのか。てを よんでみよう。／輪到我了嗎？來推算一下棋步吧。 | `game-card:game:er:adela:selection-voice:c4711f3e13:c4711f3e13` | `readingmoves.svg` | 輪到自己時，人物看著棋盤，泡泡裡預想下一步棋子的移動路線，表推算棋步。 |
| 451 | games／verb | 新たな夢に旅立つ時間だわ。／あらたな ゆめに たびだつ じかんだわ。／是啟程前往新夢想的時候了。 | `game-card:game:er:adela:selection:1024002:15d1b555aa` | `newdreamjourney.svg` | 人物提著行李走向雲端上發光的新門，路上有星星，表啟程前往新夢想。 |
| 452 | games／abstract | たとえ夢だとしても、私はコントロールできるのよ。／たとえ ゆめだと しても、わたしは コントロール できるのよ。／就算是夢，我也能掌控。 | `game-card:game:er:adela:selection-voice:95335fe9b3:95335fe9b3` | `controllingdream.svg` | 睡夢泡泡裡的景物被人物用操縱線牽著，雲與星依手勢移動，表就算是夢也能掌控。 |
| 453 | games／concrete | 私は世紀の発明家よ。知らないとは言わせないから。／わたしは せいきの はつめいかよ。しらないとは いわせないから。／我可是世紀大發明家。不准你說不知道。 | `game-card:game:er:barbara:selection-voice:16dace1571:16dace1571` | `inventor.svg` | 戴護目鏡的發明家舉起一個剛完成、冒著火花的機械裝置，旁邊設計圖，表發明家。 |
| 454 | games／abstract | 今日はどのようなお話に出会えるでしょうか。／きょうは どのような おはなしに であえるでしょうか。／今天能遇見什麼樣的故事呢？ | `game-card:game:er:sua:selection-voice:905526d993:905526d993` | `meetingstories.svg` | 翻開的書頁上浮出小城堡、星星與人物剪影，讀者期待地看著，表今天會遇見什麼故事。 |
| 455 | games／verb | 今日は本を閉じて出かけてみましょうか。／きょうは ほんを とじて でかけてみましょうか。／今天要不要闔上書本，出去走走呢？ | `game-card:game:er:sua:selection:1028003:cd1ef264fb` | `closebookgoout.svg` | 人物把書闔上放在桌上，轉身走向陽光照進的門口，表闔上書出去走走。 |
| 456 | games／expression | 今日も楽しいお食事しない？／きょうも たのしい おしょくじ しない？／今天也來頓開心的飯吧？ | `game-card:game:er:eleven:selection-voice:e603a02782:e603a02782` | `mealinvite.svg` | 人物端著熱騰騰的料理向朋友招手，桌上擺了兩人份餐具，表「一起開心吃飯吧」。 |
| 457 | games／abstract | 矢先にはどんな嘘も通じないよ。／やさきには どんな うそも つうじないよ。／在箭尖前，任何謊言都行不通喔。 | `game-card:game:er:rio:selection-voice:d1fb44eea8:d1fb44eea8` | `arrowtruth.svg` | 箭頭正對著說話者，泡泡裡的謊言（打叉的面具）被射穿碎裂，表箭尖前謊言行不通。 |
| 458 | games／abstract | もう手加減はしない。／もう てかげんは しない。／我不會再手下留情了。 | `game-card:game:er:william:selection-voice:331bb2b949:331bb2b949` | `noholdingback.svg` | 人物把原本手腕上的束縛帶扯斷、全力揮拳，表不再手下留情。 |
| 459 | games／expression | なんだよ面倒だな！...一体何があったんだ？／なんだよ めんどうだな！...いったい なにが あったんだ？／搞什麼，真麻煩！……到底發生什麼事了？ | `game-card:game:er:nicky:selection-voice:ff240e379f:ff240e379f` | `whathappened.svg` | 人物皺眉不耐地抓頭，眼前一片混亂（翻倒的桌椅），表「搞什麼，到底發生什麼事」。 |
| 460 | games／verb | これしきの暑さは全部吹き飛ばしてやる！／これしきの あつさは ぜんぶ ふきとばしてやる！／這點熱度，我全都要一口氣吹散！ | `game-card:game:er:nicky:selection:1033002:e1556f5a8a` | `blowawayheat.svg` | 人物揮扇掀起強風，把熱浪與太陽的光線一口氣吹散，表把暑熱全吹走。 |
| 461 | games／expression | そうね。／そうね。／說得也是。 | `game-card:game:er:nicky:selection-voice:62f6069f33:62f6069f33` | `agreeingnod.svg` | 兩人對談，聽的人微笑點頭，頭旁的點頭弧線，表「說得也是」。 |
| 462 | games／abstract | ただ普通に生きたかった。それがこんなに難しいことだったなんて知らなかったよ。／ただ ふつうに いきたかった。それが こんなに むずかしい ことだったなんて しらなかったよ。／我只是想平凡地活著。沒想到那竟然是這麼難的事。 | `game-card:game:er:eva:selection-voice:1b4ea5830e:1b4ea5830e` | `ordinarylife.svg` | 泡泡裡畫著平凡的小屋、晚餐與睡覺，人物伸手卻隔著一條裂縫碰不到，表只想平凡地活著卻很難。 |
| 463 | games／abstract | 今日は、どんな思い出を作れるかな？／きょうは、どんな おもいでを つくれるかな？／今天會創造出什麼樣的回憶呢？ | `game-card:game:er:eva:selection:1036004:378c716805` | `makingmemories.svg` | 人物拿著相機與相簿，相簿裡一格格是今天的快樂小景，表創造回憶。 |
| 464 | games／verb | 蝶を壁に固定するには鋭いピンが必要だ。／ちょうを かべに こていするには するどい ピンが ひつようだ。／要把蝴蝶固定在牆上，需要鋒利的針。 | `game-card:game:er:daniel:selection-voice:6d577b2791:6d577b2791` | `pinningbutterfly.svg` | 一根尖針把蝴蝶標本固定在牆上的框裡，表用針把蝴蝶固定在牆上。 |
| 465 | games／abstract | 死を与えることこそ真の治療なのかも知れない。／しを あたえることこそ しんの ちりょうなのかもしれない。／或許唯有賦予死亡，才是真正的治療。 | `game-card:game:er:daniel:selection:1037001:3775b08837` | `grimtreatment.svg` | 穿白袍的醫生手持一朵黑色的花取代藥瓶，藥瓶被放到一邊，表把死亡當作治療（不畫傷害）。 |
| 466 | games／abstract | 宝石はその価値を知る者にこそふさわしいものよ。／ほうせきは その かちを しる ものにこそ ふさわしい ものよ。／寶石只配得上懂得它價值的人。 | `game-card:game:er:jenny:selection-voice:cff54f4b00:cff54f4b00` | `gemworthy.svg` | 閃亮的寶石被雙手捧著，捧的人眼中有星光，旁觀不在意的人被淡化，表寶石只配懂它的人。 |
| 467 | games／expression | 見られてないわよね？／みられてない わよね？／沒被看到吧？ | `game-card:game:er:jenny:selection-voice:54fd16ae56:54fd16ae56` | `notseen.svg` | 人物手拿東西躲在牆角，左右偷瞄確認沒人看見，表「沒被看到吧」。 |
| 468 | games／abstract | 私だって、私だって光り輝く宝石になりたい。／わたしだって、わたしだって ひかりかがやく ほうせきに なりたい。／我也、我也想成為閃閃發光的寶石。 | `game-card:game:er:jenny:selection-voice:f7c809489a:f7c809489a` | `wanttoshine.svg` | 人物望著櫥窗裡閃閃發光的寶石，泡泡裡想像自己也在發光，表也想成為發光的寶石。 |
| 469 | games／abstract | ジャージを忘れちゃった…これで準備OKよ。／ジャージを わすれちゃった…これで じゅんび OKよ。／忘了帶運動服……這樣就準備好了。 | `game-card:game:er:jenny:selection-voice:24d76fef45:24d76fef45` | `improvisedready.svg` | 掛運動服的衣鉤是空的（忘了帶），人物改穿便服捲起袖子比出OK，表忘了運動服但這樣也準備好了。 |
| 470 | games／expression | 私の美しさに惚れてしまいましたか？／わたしの うつくしさに ほれて しまいましたか？／你是不是被我的美迷倒了？ | `game-card:game:er:camilo:selection-voice:e08df10fef:e08df10fef` | `smittenbybeauty.svg` | 美麗的人物擺姿勢，旁人眼睛變成愛心、臉紅看呆了，表被美迷倒。 |
| 471 | games／expression | オラ…ミ・アモーレ…／オラ…ミ・アモーレ…／哈囉……我的愛…… | `game-card:game:er:camilo:selection-voice:2ce62af3aa:2ce62af3aa` | `hellomylove.svg` | 人物揮手打招呼，同時送出一顆飄向對方的愛心，表「哈囉，我的愛」。 |
| 472 | games／expression | これもまた、私の美しい姿です。／これも また、わたしの うつくしい すがたです。／這也是我美麗的模樣。 | `game-card:game:er:camilo:selection-voice:66e3350d22:66e3350d22` | `beautifulpose.svg` | 人物換了另一套服裝擺出優雅姿勢，周圍光點，表這也是我美麗的模樣。 |
| 473 | games／abstract | 人形が動くって？なんの冗談？／にんぎょうが うごくって？なんの じょうだん？／人偶會動？開什麼玩笑？ | `game-card:game:er:chloe:selection-voice:75c7a57e3a:75c7a57e3a` | `movingdoll.svg` | 架上的人偶自己抬起手臂動了起來，旁人嚇得往後仰，表人偶會動。 |
| 474 | games／abstract | いち、に、準備運動終わり！大丈夫よ、後で新しいの買ってあげるから。／いち、に、じゅんび うんどう おわり！だいじょうぶよ、あとで あたらしいの かってあげるから。／一、二，暖身結束！沒關係，等一下買新的給你。 | `game-card:game:er:chloe:selection-voice:0ec71933dc:0ec71933dc` | `warmupandpromise.svg` | 做完暖身的人蹲下摸摸手拿壞玩具、正在哭的小孩，泡泡裡是之後買的新玩具，表暖身結束後安慰說之後買新的。 |
| 475 | games／abstract | お主らの血の味はどんな味がするかの？／おぬしらの ちの あじは どんな あじが するかの？／你們的血會是什麼味道呢？ | `game-card:game:er:bianca:selection-voice:2598ab2e26:2598ab2e26` | `bloodtaste.svg` | 戴斗篷、露出尖牙的吸血鬼端著紅色酒杯品嚐，旁邊蝙蝠飛舞，表好奇血的味道（不畫傷口）。 |
| 476 | games／expression | わらわに拝めることを、光栄に思うがよい！／わらわに おがめることを、こうえいに おもうがよい！／能瞻仰妾身，應該感到光榮才是！ | `game-card:game:er:bianca:selection:1042002:8b72b5ce6f` | `beholdme.svg` | 戴王冠的女王坐在高台上，台下的人都抬頭行禮，表能瞻仰我應感光榮。 |
| 477 | games／verb | 永劫の時を経て……わらわがここに降臨したのじゃ！／えいごうの ときを へて……わらわが ここに こうりんしたのじゃ！／歷經永劫的時光……妾身降臨於此！ | `game-card:game:er:bianca:selection:1042005:1564225ee4` | `descending.svg` | 長長的光柱中，人物緩緩從天而降落到地面，周圍星芒，表降臨。 |
| 478 | games／expression | わらわの眷属になりたいのか？／わらわの けんぞくに なりたいのか？／你想成為妾身的眷屬嗎？ | `game-card:game:er:bianca:selection-voice:250b106d72:250b106d72` | `joinmykin.svg` | 高台上的人物伸手邀請，背後一群蝙蝠圍繞，表「想成為我的眷屬嗎」。 |
| 479 | games／verb | まとめてぶっ壊してやる！早く行こうぜ。／まとめて ぶっこわしてやる！はやく いこうぜ。／全部一起砸爛！快走吧。 | `game-card:game:er:echion:selection-voice:fc89cd8827:fc89cd8827` | `smashall.svg` | 人物揮大鎚一次把一整排箱子全部砸碎，碎片四散，表全部一起砸爛。 |
| 480 | games／verb | では、次のステージに向かいましょう。／では、つぎのステージに むかいましょう。／那麼，前往下一個舞台吧。 | `game-card:game:er:mai:selection:1045004:79f191eac5` | `nextstage.svg` | 舞台上的箭頭從現在的台子指向更高一層的下一個舞台，人物正要移過去，表前往下一個舞台。 |
| 481 | games／abstract | 人生はうまく行かないのが当然だ。／じんせいは うまく いかないのが とうぜんだ。／人生不順利是理所當然的。 | `game-card:game:er:aiden:selection-voice:eaea8b98f3:eaea8b98f3` | `lifenotsmooth.svg` | 人生路上坑坑洞洞，人物跌倒後仍拍拍灰站起來，表人生不順利是理所當然。 |
| 482 | games／abstract | 迅雷の所以を教えてやろう。／じんらいの ゆえんを おしえてやろう。／就讓你見識我為何被稱為迅雷。 | `game-card:game:er:aiden:selection-voice:cab6835392:cab6835392` | `swiftthunder.svg` | 一道閃電從人物身上劈出、瞬間到達遠方標的，殘影一連串，表迅雷之名的由來。 |
| 483 | games／expression | 見る目があるわね。／みる めが あるわね。／你很有眼光嘛。 | `game-card:game:er:laura:selection-voice:5372bd09d8:5372bd09d8` | `goodeye.svg` | 人物從一排普通石頭中挑出真正的寶石，旁人豎起拇指稱讚，表很有眼光。 |
| 484 | games／verb | さて、私の指導が必要な子は...どこにいるのかしら？／さて、わたしの しどうが ひつような こは...どこに いるのかしら？／那麼，需要我指導的孩子……在哪裡呢？ | `game-card:game:er:laura:selection:1047004:d680014bcd` | `coaching.svg` | 老師在黑板前指導，幾位學生坐著聽，老師四處張望找需要幫助的人，表指導學生。 |
| 485 | games／verb | 二日目の戦闘で重要なのはここ。では、実戦の時間よ。／ふつかめの せんとうで じゅうような のは ここ。では、じっせんの じかんよ。／第二天的戰鬥，重點在這裡。那麼，實戰時間到了。 | `game-card:game:er:laura:selection-voice:31ac6b4973:31ac6b4973` | `battletraining.svg` | 教官指著沙盤上的重點位置，隊員們拿著木劍準備實戰演練，表戰鬥中的重點與實戰練習。 |
| 486 | games／concrete | ピクセルアートは...好き...？／ピクセルアートは...すき...？／像素藝術……你喜歡嗎……？ | `game-card:game:er:tia:selection:1048003:2b66c3918e` | `pixelart.svg` | 由小方格組成的像素風愛心與星星畫，畫者害羞地遞出，表像素藝術。 |
| 487 | games／abstract | 目標は高く、行動は素早く！よし、行こうか！／もくひょうは たかく、こうどうは すばやく！よし、いこうか！／目標要高，行動要快！好，走吧！ | `game-card:game:er:felix:selection-voice:2299c4b895:2299c4b895` | `aimhighmovefast.svg` | 人物指向高處山頂的旗子，腳下是快跑的速度線，表目標要高、行動要快。 |
| 488 | games／expression | わざわざ私から出向く必要ありますか？／わざわざ わたしから でむく ひつよう ありますか？／有必要特地由我親自前往嗎？ | `game-card:game:er:elena:selection:1050003:d106ae4745` | `mustigo.svg` | 人物坐在舒服的椅子上不想起身，指著門外的任務攤手反問，表「有必要特地由我去嗎」。 |
| 489 | games／abstract | 運命より大事なのは、私達の意志です。／うんめいより だいじなのは、わたしたちの いしです。／比命運更重要的，是我們的意志。 | `game-card:game:er:adina:selection-voice:c4edb454c4:c4edb454c4` | `willoverfate.svg` | 命運之線把人物往一邊拉，人物卻握拳朝另一個方向走並把線拉斷，表意志比命運更重要。 |
| 490 | games／abstract | 戦いとは対等な相手にしか使わない言葉だ。／たたかいとは たいとうな あいてにしか つかわない ことばだ。／所謂戰鬥，是只用在旗鼓相當的對手身上的詞。 | `game-card:game:er:markus:selection-voice:84e9573f28:84e9573f28` | `equalopponents.svg` | 天秤兩端站著體型相當、同樣舉劍的兩人，天秤保持水平，表只與旗鼓相當的對手戰鬥。 |
| 491 | games／abstract | 心の隙間を埋めるべきだ。／こころの すきまを うめるべきだ。／應該填補心中的空隙。 | `game-card:game:er:piolo:selection-voice:eb401f4c1f:eb401f4c1f` | `fillheartgap.svg` | 胸口一顆有缺口的心，一塊拼片正被放進缺口補上，表填補心中的空隙。 |
| 492 | games／abstract | 絶対に妥協はしない、記者だから。／ぜったいに だきょうは しない、きしゃだから。／我絕不妥協，因為我是記者。 | `game-card:game:er:martina:selection-voice:86f5b3ae7b:86f5b3ae7b` | `nocompromisereporter.svg` | 記者握著筆記本與相機，面前遞來的錢袋被推開打叉，表絕不妥協的記者。 |
| 493 | games／expression | わー、よかった！カメラが無事で！／わー、よかった！カメラが ぶじで！／哇，太好了！相機沒事！ | `game-card:game:er:martina:selection-voice:b0bc84ab54:b0bc84ab54` | `camerasafe.svg` | 人物把剛掉在地上的相機撿起抱在胸前，相機完好無裂，鬆了一口氣，表「太好了，相機沒事」。 |
| 494 | games／abstract | どんな時でも、あたしはプロだから。／どんな ときでも、あたしは プロだから。／不管什麼時候，我都是專業的。 | `game-card:game:er:haze:selection-voice:a0c7e7eddb:a0c7e7eddb` | `alwayspro.svg` | 同一人在工作時與休假躺椅上都拿著專業相機、姿勢一樣，表無論何時都是專業的。 |
| 495 | games／expression | もっと賭けろ。本物のプロが来たからな。／もっと かけろ。ほんもののプロが きたからな。／再多押一點。真正的高手來了。 | `game-card:game:er:haze:selection:1058006:a1c28352cd` | `betmore.svg` | 牌桌前人物把更多籌碼推向中央，自信地挑眉，表「再多押一點」。 |
| 496 | games／expression | この俺に話しかけるな。／この おれに はなしかけるな。／別跟我說話。 | `game-card:game:er:isaac:selection-voice:32a80fc1cf:32a80fc1cf` | `donttalktome.svg` | 人物轉身背對，舉手擋住對方遞來的說話泡泡，表「別跟我說話」。 |
| 497 | games／abstract | 何でもやる時は、この手でやらねえとな。／なんでも やる ときは、この てで やらねえとな。／不管做什麼，都得親手來才行。 | `game-card:game:er:isaac:selection-voice:1f281b4519:1f281b4519` | `withmyownhands.svg` | 人物捲起袖子、雙手親自握住工具動手做，旁邊的機器手臂被推開，表凡事親手做。 |
| 498 | games／abstract | ガラスは割れたらそれでおしまい。／ガラスは われたら それで おしまい。／玻璃一旦破了，就到此為止。 | `game-card:game:er:tazia:selection-voice:11e527ece9:11e527ece9` | `brokenglass.svg` | 玻璃杯掉落碎裂成多片，無法拼回（拼回箭頭被打叉），表玻璃破了就到此為止。 |
| 499 | games／abstract | 完璧なものだけが美しくなれるのよ。／かんぺきな ものだけが うつくしく なれるのよ。／只有完美的東西才能變得美麗。 | `game-card:game:er:tazia:selection-voice:02a50524ae:02a50524ae` | `perfectbeauty.svg` | 一排寶石中只有毫無瑕疵、閃閃發光的那顆被圈出，有裂痕的被淡化，表只有完美的東西才美。 |
| 500 | games／expression | 今のって、あたしのことが好きってことでしょ？／いまのって、あたしの ことが すきって ことでしょ？／剛剛那樣，就是說你喜歡我吧？ | `game-card:game:er:irem:selection-voice:5f7ffa5608:5f7ffa5608` | `youlikeme.svg` | 對方剛說完話臉紅，人物指著自己、頭上冒出愛心並得意地笑，表「你喜歡我吧」。 |
| 501 | games／abstract | 今度はどこに遊びに行ってみようかな。／こんどは どこに あそびに いってみようかな。／下次要去哪裡玩看看呢？ | `game-card:game:er:irem:selection-voice:5882070cef:5882070cef` | `whereplaynext.svg` | 人物攤開地圖，指尖在幾個遊玩地點（摩天輪、海灘、山）之間猶豫，表下次（先）去哪裡玩。 |
| 502 | games／expression | 私を選ばないでください。警告したはずです。／わたしを えらばないでください。けいこくした はずです。／請不要選我。我應該警告過了。 | `game-card:game:er:lyanh:selection-voice:ddd410a944:ddd410a944` | `dontchooseme.svg` | 一排候選人中，被手指選中的人雙手交叉打叉並後退，表「請不要選我」。 |
| 503 | games／verb | 一緒に行きましょう、新たな世界へ。／いっしょに いきましょう、あらたな せかいへ。／一起前往新的世界吧。 | `game-card:game:er:vanya:selection:1064003:cc4b089ff5` | `newworldtogether.svg` | 兩人牽手走向一扇打開、透出另一片星空風景的大門，表一起前往新世界。 |
| 504 | games／abstract | 道なら、ちょうちょたちが教えてくれるよ。／みちなら、ちょうちょたちが おしえてくれるよ。／路的話，蝴蝶們會告訴你的。 | `game-card:game:er:vanya:selection-voice:3bbd5b0532:3bbd5b0532` | `butterflyguide.svg` | 幾隻蝴蝶排成一列飛在前方，為迷路的人標出岔路中正確的那條，表蝴蝶會告訴你路。 |
| 505 | games／abstract | ちょうちょと一緒に夢の世界へ。／ちょうちょと いっしょに ゆめの せかいへ。／和蝴蝶一起前往夢的世界。 | `game-card:game:er:vanya:selection-voice:fa37b7a777:fa37b7a777` | `butterflydream.svg` | 人物閉眼漂浮，蝴蝶帶著他飛向雲上夢境的月亮與星星，表和蝴蝶一起前往夢的世界。 |
| 506 | games／abstract | 覚悟しとけよ！私たちは一緒にいる時、強いから。／かくご しとけよ！わたしたちは いっしょに いる とき、つよいから。／做好覺悟吧！我們在一起的時候很強。 | `game-card:game:er:debimarlene:selection-voice:b681e7e669:b681e7e669` | `strongertogether.svg` | 一根樹枝容易被折斷，三根綁在一起就折不斷，三人並肩握拳，表我們在一起的時候很強。 |
| 507 | games／expression | グズグズしてないで早く来いよ！どうやっても無駄だと思うけど。／グズグズ してないで はやく こいよ！どうやっても むだだと おもうけど。／別拖拖拉拉了，快過來！不過我看怎麼做都沒用啦。 | `game-card:game:er:debimarlene:selection-voice:4e9b48556e:4e9b48556e` | `hurryup.svg` | 人物在前面回頭大力招手催促，後面的人慢吞吞地拖著腳步，表「別拖拖拉拉了，快過來」。 |
| 508 | games／expression | あっ、痛かった！ごめん、えーと、後でアイス買ってあげるから。／あっ、いたかった！ごめん、えーと、あとで アイス かってあげるから。／啊，好痛！對不起，呃……等一下買冰淇淋給你。 | `game-card:game:er:debimarlene:selection-voice:8fb4453228:8fb4453228` | `sorryicecream.svg` | 不小心撞到人的人物合掌道歉，泡泡裡是之後要買給對方的冰淇淋，表「對不起，等一下買冰淇淋給你」。 |
| 509 | games／abstract | そなたの痕跡は後世にどう評価されるか、楽しみではないか。／そなたの こんせきは こうせいに どう ひょうか されるか、たのしみでは ないか。／你留下的痕跡會被後世如何評價，不是很令人期待嗎？ | `game-card:game:er:arda:selection-voice:92400ffdcc:92400ffdcc` | `legacyjudged.svg` | 一串足跡延伸到遠方，後世的人拿著放大鏡與天秤在檢視那些足跡，表留下的痕跡被後世評價。 |
| 510 | games／expression | 私から目を離さないでください。いつ消えても可笑しくないので。／わたしから めを はなさないでください。いつ きえても おかしくないので。／請不要把視線從我身上移開。因為我隨時消失都不奇怪。 | `game-card:game:er:abigail:selection-voice:5410d6bcfc:5410d6bcfc` | `dontlookaway.svg` | 半透明、輪廓逐漸變淡的人物請對方一直看著自己，兩人之間的視線虛線，表別把視線移開。 |
| 511 | games／expression | うさぎさんと一緒に、準備はいいですか？／うさぎさんと いっしょに、じゅんびは いいですか？／和兔兔一起，準備好了嗎？ | `game-card:game:er:abigail:selection:1067002:0732b8f457` | `bunnyready.svg` | 人物抱著小兔子比出準備好的手勢，兔子也豎起耳朵，表和兔兔一起準備好了嗎。 |
| 512 | games／abstract | ぴょん、うさぎさん登場です。／ぴょん、うさぎさん とうじょうです。／蹦，兔兔登場。 | `game-card:game:er:abigail:selection-voice:b87c9f3b17:b87c9f3b17` | `bunnyentrance.svg` | 兔子造型的表演者蹦一下跳上舞台，跳躍弧線與光點，表兔兔登場。 |
| 513 | games／abstract | 次は何を割ればいいですか？／つぎは なにを われば いいですか？／下一個要打破什麼才好？ | `game-card:game:er:abigail:selection-voice:e38135212c:e38135212c` | `whattobreaknext.svg` | 人物舉著鎚子，身旁已經碎掉的盤子，正望向架上下一排完好的東西，表下一個要打破什麼。 |
| 514 | games／expression | 準備はいい？じゃあ行こう！／じゅんびは いい？じゃあ いこう！／準備好了嗎？那就出發吧！ | `game-card:game:er:leni:selection-voice:7b6dc35e8d:7b6dc35e8d` | `readyletsgo.svg` | 帶頭者轉身確認隊員都背好行李並點頭，隨即舉手指向前方出發，表「準備好了嗎？那就出發吧」。 |
| 515 | games／expression | 今日のご主人様は～そこのあ・な・た！／きょうの ごしゅじんさまは～そこの あ・な・た！／今天的主人就是——那邊的你！ | `game-card:game:er:leni:selection:1069003:9a1058f037` | `pickyou.svg` | 人物在人群中伸直手指選中一位觀眾，被指的人驚訝地指自己，表「今天的主人就是那邊的你」。 |
| 516 | games／abstract | 海を渡る一羽の玄鳥のように。／うみを わたる いちわの つばめのように。／如同一隻飛越大海的燕子。 | `game-card:game:er:tsubame:selection:1070002:d049a5f8ae` | `swallowoversea.svg` | 一隻燕子展翅低飛越過廣闊海面，遠方是對岸，表如同一隻飛越大海的燕子。 |
| 517 | games／expression | いいよ、合わせてあげる。／いいよ、あわせてあげる。／好啊，我配合你。 | `game-card:game:er:katja:selection-voice:3463cb0924:3463cb0924` | `illmatchyou.svg` | 兩人一起跳舞，一人配合對方的步伐，腳步記號左右對齊，表「我配合你」。 |
| 518 | games／expression | お前のすべてを、全部俺によこすんだな。／おまえの すべてを、ぜんぶ おれに よこすんだな。／把你的一切，全部交給我吧。 | `game-card:game:er:darko:selection-voice:2e14f16392:2e14f16392` | `handitallover.svg` | 霸道的人物伸出手掌，對方把錢袋、劍和寶石全部交出放進他手裡，表「把你的一切全交給我」。 |
| 519 | games／abstract | さて、あなたからはどんな音がするのか楽しみね。／さて、あなたからは どんな おとが するのか たのしみね。／那麼，真期待你會發出什麼樣的聲音。 | `game-card:game:er:lenore:selection-voice:59e961d3b1:59e961d3b1` | `whatsoundyoumake.svg` | 人物把耳朵貼近對方，手拿調音叉，好奇對方會發出什麼聲音，表期待你發出什麼聲音。 |
| 520 | games／expression | 私が必要なの？そう、嬉しい。／わたしが ひつようなの？そう、うれしい。／你需要我？是嗎，好開心。 | `game-card:game:er:garnet:selection-voice:bd69c98de8:bd69c98de8` | `gladtobeneeded.svg` | 對方伸手求助，人物雙手放在胸前、臉上微笑、身旁小花綻開，表「你需要我？好開心」。 |
| 521 | games／abstract | 私たちをつなげてくれるのは、苦痛だけよ...／わたしたちを つなげてくれるのは、くつうだけよ...／能把我們連在一起的，只有痛苦…… | `game-card:game:er:garnet:selection-voice:905c0de086:905c0de086` | `boundbypain.svg` | 兩人手腕上纏著同一條帶刺的鎖鏈，表把我們連在一起的只有痛苦。 |
| 522 | games／abstract | 斬り落とすべき悪は、この剣で裁く。／きりおとすべき あくは、この けんで さばく。／該斬除的邪惡，就由這把劍裁決。 | `game-card:game:er:hisui:selection:1078002:2725f2610d` | `judgingsword.svg` | 一把直立的劍，護手兩端掛著天秤的秤盤，劍光照向右邊的黑影並將其斬開，表以這把劍裁決邪惡。 |
| 523 | games／abstract | バカな奴らとは、刀で語り合わねえとな。／バカな やつらとは、かたなで かたりあわねえとな。／跟笨蛋們，就得用刀好好聊聊。 | `game-card:game:er:hisui:selection-voice:853339e4d5:853339e4d5` | `talkwithblades.svg` | 兩人刀刃相交迸出火花，兩人之間的「對話」泡泡就是交鋒的火花，表用刀好好聊聊。 |
| 524 | games／abstract | バニーガールが、世界を救う！／バニーガールが、せかいを すくう！／兔女郎要拯救世界！ | `game-card:game:er:justyna:selection:1079002:cffe2f4ad5` | `savetheworld.svg` | 穿兔耳裝的英雄站在地球上舉手比勝利，地球周圍的烏雲散開，表兔女郎拯救世界。 |
| 525 | games／abstract | その選択に相応しい結果をもたらそう。／その せんたくに ふさわしい けっかを もたらそう。／我會帶來與那個選擇相稱的結果。 | `game-card:game:er:istvan:selection-voice:4bf842ed88:4bf842ed88` | `choiceconsequence.svg` | 岔路兩邊各通往不同結果（花園／荊棘），人物選了一條，對應結果被圈出，表帶來與選擇相稱的結果。 |
| 526 | games／abstract | 我が意志はこの剣にある。／わが いしは この けんに ある。／我的意志就在這把劍上。 | `game-card:game:er:xuelin:selection-voice:070a5630c0:070a5630c0` | `willinsword.svg` | 人物把胸口的光芒灌注進高舉的劍，劍身發光，表我的意志就在這把劍上。 |
| 527 | games／abstract | 止まっていた時間を動かす時だ。／とまっていた じかんを うごかす ときだ。／是讓停止的時間重新轉動的時候了。 | `game-card:game:er:henry:selection-voice:14062c8934:14062c8934` | `restarttime.svg` | 停住的時鐘被人物的手推動，指針重新轉動，停止的齒輪也開始轉，表讓停止的時間重新轉動。 |
| 528 | games／abstract | 化け物の相手は、化け物がしないとね。／ばけものの あいては、ばけものが しないとね。／對付怪物，就得由怪物來。 | `game-card:game:er:blair:selection-voice:40dad4197a:40dad4197a` | `monstervsmonster.svg` | 一隻大怪物面前，另一隻同樣巨大的怪物擋在人群前迎戰，表對付怪物就得由怪物來。 |
| 529 | games／abstract | フェルを止めたいなら、覚悟！／フェルを とめたいなら、かくご！／想阻止フェル的話，就做好覺悟！ | `game-card:game:er:fenrir:selection-voice:0f0fe38667:0f0fe38667` | `stopmeifyoucan.svg` | 人物大步向前，前方擋路的人伸手阻止，人物握拳毫不退讓，表想阻止我就做好覺悟。 |
| 530 | games／abstract | 白と黒、あなたはどっちなのかしら？／しろと くろ、あなたは どっちなのかしら？／白與黑，你是哪一邊呢？ | `game-card:game:er:coraline:selection-voice:f237f24e60:f237f24e60` | `whiteorblack.svg` | 一半白一半黑的背景，中央人物站在分界上，兩邊各有一個圓圈等人選，表白與黑，你是哪一邊。 |
| 531 | games／abstract | 私にシルムで勝ったら、一緒に食べてもいいよ？／わたしに シルムで かったら、いっしょに たべても いいよ？／用摔角贏了我的話，可以一起吃喔？ | `game-card:game:er:bihyung:selection-voice:cb8b9d1a67:cb8b9d1a67` | `wrestleforfood.svg` | 兩人在圓形場地上抓腰角力，旁邊桌上放著一盤美食作為獎品，表摔角贏了就一起吃。 |
| 532 | games／verb | 銃を抜く準備はできたか？／じゅうを ぬく じゅんびは できたか？／拔槍的準備好了嗎？ | `game-card:game:er:craver:selection-voice:d323f1b6a0:d323f1b6a0` | `drawgun.svg` | 牛仔手放在腰間槍套旁準備拔出，正午的太陽下對峙，表拔槍的準備。 |
| 533 | games／abstract | 余計なことすんな。全部見えてるからよ。／よけいな こと すんな。ぜんぶ みえてるからよ。／別做多餘的事。我全都看得見。 | `game-card:game:er:craver:selection-voice:7dd7c79664:7dd7c79664` | `iseeall.svg` | 一隻大眼睛監視著所有角落，偷偷伸手的人被視線虛線逮到，表我全都看得見。 |
| 534 | games／abstract | 世界は、謎だらけだ…／せかいは、なぞだらけだ…／世界充滿了謎團…… | `game-card:game:genshin:aether:join:707d798470` | `worldofmysteries.svg` | 地球周圍漂浮著許多上鎖的小盒與迷宮圖，人物仰望，表世界充滿謎團。 |
| 535 | games／verb | 風と共に去れ！／かぜ ともに され！／隨風而逝吧！ | `game-card:game:genshin:aether:burst:e6128e7c2a` | `gonewiththewind.svg` | 對手被一陣旋風捲起吹向遠方，留下風的軌跡，表隨風而逝、隨風離去。 |
| 536 | games／abstract | 偉業を見届けよ。／いぎょうを みとどけよ。／見證這項偉業吧。 | `game-card:game:genshin:albedo:burst:9a6f766c75` | `witnessfeat.svg` | 人們抬頭看著剛完成的巨大雕像在光芒中揭幕，表見證這項偉業。 |
| 537 | games／expression | 何か用か？／なにか ようか？／有什麼事嗎？ | `game-card:game:genshin:alhaitham:join:1b1e88c7ff` | `whatdoyouneed.svg` | 坐著工作的人轉頭看向來訪者，挑眉詢問有什麼事，來訪者站在門口，表「有什麼事嗎」。 |
| 538 | games／expression | これしきのこと、俺様が解決してやる！／これしきのこと、おれさまが かいけつして やる！／這點小事，就由本大爺來解決！ | `game-card:game:genshin:aratakiitto:join:2a824078d5` | `illsolveit.svg` | 人物拍胸脯，一手把糾纏的繩結輕鬆拉直，表「這點小事由我來解決」。 |
| 539 | games／abstract | 月のように永遠なれ。／つきのように えいえんなれ。／願如月亮般永恆。 | `game-card:game:genshin:arlecchino:burst:fcb1269008` | `eternalmoon.svg` | 圓月高掛，周圍一圈無盡的環形軌跡與四季的小圖示依序環繞，表願如月亮般永恆。 |
| 540 | games／verb | 全部返してやる！／ぜんぶ かえしてやる！／全都奉還給你！ | `game-card:game:genshin:beidou:skill:40c07e6fd1` | `returnitall.svg` | 人物把收到的箱子、錢袋與信全部推回去給對方，箭頭朝對方，表全都奉還給你。 |
| 541 | games／abstract | 我らに祝福あれ！／われらに しゅくふく あれ！／願祝福降臨我們身上！ | `game-card:game:genshin:candace:burst:047e8a925a` | `blessing.svg` | 天上的光芒與光點灑落在一群仰望合掌的人身上，表願祝福／神的庇護降臨。 |
| 542 | games／abstract | 近づけば近づくほど、報道の真実味が増す。／ちかづけば ちかづくほど、ほうどうの しんじつみが ます。／越接近，報導就越有真實感。 | `game-card:game:genshin:charlotte:join:933d592771` | `closerreport.svg` | 記者拿麥克風一步步靠近現場，越近畫面越清楚（從模糊到清楚的三格），表越接近報導越真實。 |
| 543 | games／expression | 行こう、弾は装填した。／いこう、たまは そうてんした。／走吧，子彈已經裝填好了。 | `game-card:game:genshin:chasca:join:4396054a03` | `loadedgo.svg` | 人物把子彈裝進彈匣、喀嚓上膛後轉身邁步出發，表子彈已裝填好，走吧。 |
| 544 | games／abstract | ファッションは、私が定義する。／ファッションは、わたしが ていぎする。／時尚由我定義。 | `game-card:game:genshin:chiori:burst:4420a9e137` | `definefashion.svg` | 設計師在模特兒身上別上全新樣式的服裝，旁邊一群人跟著穿上同樣款式，表時尚由我定義。 |
| 545 | games／verb | 剣よ、出でよ！／けんよ、いでよ！／劍啊，現身吧！ | `game-card:game:genshin:chongyun:skill:c8f746a50c` | `summonsword.svg` | 人物伸手，空中光芒聚成一把劍落入手中，表「劍啊，現身吧」。 |
| 546 | games／abstract | 口封じは任せたからね！／くちふうじは まかせたからね！／封口的事就拜託你了！ | `game-card:game:genshin:citlali:burst:21ef4db250` | `silencing.svg` | 人物把手指豎在嘴前，另一人的嘴上被畫了一道拉鍊封住，表封口（不讓人說出去）。 |
| 547 | games／abstract | 代理決闘の依頼か？／だいりけっとうの いらいか？／是委託我代理決鬥嗎？ | `game-card:game:genshin:clorinde:join:434f4ed556` | `proxyduel.svg` | 委託人退到一旁遞出白手套，被委託的人代替他站上決鬥位置舉劍，表委託代理決鬥。 |
| 548 | games／verb | 影を討つ！／かげを うつ！／討伐影子！ | `game-card:game:genshin:clorinde:skill:1cec855bc0` | `strikeshadow.svg` | 人物揮劍斬向地上延伸出的黑色影子怪物，表討伐影子。 |
| 549 | games／abstract | 潔白を証明する時だ。／けっぱくを しょうめいする ときだ。／證明清白的時刻到了。 | `game-card:game:genshin:clorinde:burst:8a927c527f` | `provinginnocence.svg` | 人物把一疊證物放上天秤，天秤指向打勾的白色方塊，嫌疑的黑影散去，表證明清白的時刻。 |
| 550 | games／expression | 月の光が必要？／つきの ひかりが ひつよう？／需要月光嗎？ | `game-card:game:genshin:columbina:join:d9373f46c5` | `moonlightoffer.svg` | 人物捧起手中的一道月光，向對方遞出，表「需要月光嗎」。 |
| 551 | games／verb | 流れて。／ながれて。／流動吧。 | `game-card:game:genshin:columbina:skill:536ce49fbb` | `flowing.svg` | 水流從高處蜿蜒流下，繞過石頭繼續流動，箭頭沿著水流，表「流動吧」。 |
| 552 | games／verb | 今宵、月を捧ぐ……／こよい、つきを ささぐ……／今夜，獻上月亮…… | `game-card:game:genshin:columbina:burst:4593762aa7` | `offeringmoon.svg` | 人物在夜色中高舉雙手，把一輪月亮獻上給祭壇，表今夜獻上月亮。 |
| 553 | games／abstract | 判決からは逃れられない。／はんけつからは のがれられない。／你逃不開判決。 | `game-card:game:genshin:cyno:burst:b4796d4c2f` | `noescapeverdict.svg` | 法槌落下，逃跑者四周的出口都被判決光圈封住，表你逃不開判決。 |
| 554 | games／abstract | 判決を、下す！／はんけつを、くだす！／下達判決！ | `game-card:game:genshin:diluc:burst:053b2119f4` | `verdict.svg` | 法官敲下法槌，判決文書蓋上印章，表下達判決。 |
| 555 | games／verb | モラをいただきますわ！／もらを いただきますわ！／摩拉我就收下了！ | `game-card:game:genshin:dori:skill:8c7cbd4e14` | `takingcoins.svg` | 人物笑著把一疊金幣收進自己的袋子，表「錢我就收下了」。 |
| 556 | games／abstract | 腕の見せ所ですの！／うでの みせどころですの！／正是大顯身手的時候！ | `game-card:game:genshin:dori:burst:823c79aec0` | `showskill.svg` | 人物在眾人注目下熟練地同時拋接好幾個球，聚光燈照著，表大顯身手的時候。 |
| 557 | games／abstract | 物語は、始まったばかりだよ。／ものがたりは、はじまったばかりだよ。／故事才剛開始喔。 | `game-card:game:genshin:durin:burst:718ac62b00` | `storybegins.svg` | 書本第一頁剛翻開，頁面上只畫了起點的小人與一條才延伸一點的路，後面都是空白，表故事才剛開始。 |
| 558 | games／expression | 光栄です。／こうえいです。／我深感榮幸。 | `game-card:game:genshin:emilie:join:bf89052b31` | `honored.svg` | 人物把手放在胸前深深鞠躬，接受頒給他的勳章，表深感榮幸。 |
| 559 | games／verb | 霧となって散りなさい。／きりとなって ちりなさい。／化作霧散去吧。 | `game-card:game:genshin:emilie:burst:c125dffa13` | `scatterasmist.svg` | 人物的身形從腳開始化成一團團霧氣向外散開，表化作霧散去。 |
| 560 | games／abstract | 目には目を。／めには めを。／以眼還眼。 | `game-card:game:genshin:eula:skill:337e2cd5a9` | `eyeforeye.svg` | 兩隻大眼睛面對面怒視，視線在中間相撞，表以眼還眼（以同樣方式回敬）。 |
| 561 | games／abstract | 氷浪のように唸れ——／ひょうろうのように うなれ——／如冰浪般咆哮吧—— | `game-card:game:genshin:eula:burst:133086ff8b` | `icewave.svg` | 一道冰藍色的巨浪捲起，浪頭凝結成冰柱，發出咆哮的聲波，表如冰浪般咆哮。 |
| 562 | games／abstract | 真理は、循環する。／しんりは、じゅんかんする。／真理會循環。 | `game-card:game:genshin:faruzan:burst:f71116d959` | `truthcycles.svg` | 一顆發光的真理寶珠沿著圓形軌道循環，四個方位的箭頭首尾相接，表真理會循環。 |
| 563 | games／abstract | 皇女の名のもとに！／こうじょの なの もとに！／以皇女之名！ | `game-card:game:genshin:fischl:join:27da4cf933` | `inprincessname.svg` | 戴王冠的皇女高舉權杖，身後旗子上有王冠紋章，部下們依令向前，表以皇女之名。 |
| 564 | games／expression | 姿を見せよ、オズ！／すがたを みせよ、オズ！／現身吧，奧茲！ | `game-card:game:genshin:fischl:skill:beeda442cd` | `showyourself.svg` | 人物指著前方的濃霧，霧中隱約只有一雙眼睛，命令對方現身，表「現身吧」。 |
| 565 | games／abstract | 黒き翼よ、昼夜を切り裂きなさい——／くろき つばさよ、ちゅうやを きりさきなさい——／漆黑之翼啊，撕裂晝夜吧—— | `game-card:game:genshin:fischl:burst:e27077a449` | `blackwings.svg` | 一對巨大的黑色翅膀張開，翅尖劃過一半白晝一半黑夜的天空，表漆黑之翼撕裂晝夜。 |
| 566 | games／expression | ぼくを連れてって。／ぼくを つれてって。／帶我一起去吧。 | `game-card:game:genshin:freminet:join:41eeffc91f` | `takemewith.svg` | 小孩拉住正要出發的大人的衣角，抬頭請求一起去，表「帶我一起去吧」。 |
| 567 | games／abstract | 大当たりだぜ！／おおあたりだぜ！／大中獎啦！ | `game-card:game:genshin:gaming:skill:fe90a48ac9` | `jackpot.svg` | 拉霸機的三格都停在同樣的星星，機器下方噴出大量金幣，表大中獎。 |
| 568 | games／abstract | 風雪の縮図。／ふうせつの しゅくず。／風雪的縮影。 | `game-card:game:genshin:ganyu:burst:b00acc69ca` | `snowstormmini.svg` | 水晶球裡封著一場小小的暴風雪與雪山，表風雪的縮影。 |
| 569 | games／abstract | 交渉は終わりです。／こうしょうは おわりです。／交涉到此為止。 | `game-card:game:genshin:ineffa:burst:10dbc33d51` | `negotiationover.svg` | 談判桌一側的人起身、闔上文件夾，另一側的人伸手還想說，表交涉到此為止。 |
| 570 | games／abstract | 手ぶらじゃ帰れない。／てぶらじゃ かえれない。／不能空手而歸。 | `game-card:game:genshin:jahoda:burst:80d8d64ed6` | `notemptyhanded.svg` | 空著兩手回家的路被打叉，人物轉身回去撿起寶物才往家走，表不能空手而歸。 |
| 571 | games／verb | 剣に誓う！／けんに ちかう！／以劍起誓！ | `game-card:game:genshin:jean:burst:6fd17d98f0` | `swearonsword.svg` | 人物單膝跪下，把劍直立在面前，一手按在劍柄上立誓，表以劍起誓。 |
| 572 | games／expression | ふふ…ほんの余興です。／ふふ…ほんの よきょうです。／呵呵…只是餘興而已。 | `game-card:game:genshin:kamisatoayato:join:fdb19ffe6f` | `mereentertainment.svg` | 人物輕鬆地用一根手指轉著一顆大球，另一手掩嘴輕笑，表「只是餘興而已」。 |
| 573 | games／abstract | 剣影よ。／けんえいよ。／劍影啊。 | `game-card:game:genshin:kamisatoayato:skill:f11857219d` | `swordshadows.svg` | 一把劍揮過，後方留下好幾道半透明的劍影殘像，表劍影。 |
| 574 | games／abstract | ふん…安らかに。／ふん…やすらかに。／哼…安息吧。 | `game-card:game:genshin:kamisatoayato:burst:d9c2478b49` | `restinpeace.svg` | 戰鬥後倒下的對手上方，一朵白花輕輕落在墓碑前，表「安息吧」。 |
| 575 | games／abstract | 行こう、時間は有限よ。／いこう、じかんは ゆうげんよ。／走吧，時間有限喔。 | `game-card:game:genshin:keqing:join:9269a0ca84` | `timeislimited.svg` | 沙漏上半的沙快流完，人物拉著同伴往前走，表時間有限，走吧。 |
| 576 | games／abstract | 死出の旅路へ。／しでの たびじへ。／踏上通往死亡的旅途吧。 | `game-card:game:genshin:kinich:burst:6ad0719a01` | `finaljourney.svg` | 一條蜿蜒變窄的小路通往遠方的暗處，路旁枯樹與一盞孤燈，旅人背影正走上去，表踏上通往死亡的旅途。 |
| 577 | games／abstract | 火力全開！／かりょくぜんかい！／火力全開！ | `game-card:game:genshin:klee:burst:1e9747f07c` | `fullfirepower.svg` | 炮台的所有炮口同時噴出火焰，火力槽滿格，表火力全開。 |
| 578 | games／abstract | 千なる雷光！／せんなる らいこう！／千道雷光！ | `game-card:game:genshin:kujousara:burst:46cac81724` | `thousandbolts.svg` | 天空中無數道閃電同時劈下，地面亮成一片，表千道雷光。 |
| 579 | games／abstract | 今回はどんな問題だ？／こんかいは どんな もんだいだ？／這次是什麼問題？ | `game-card:game:genshin:kukishinobu:join:3805b8a591` | `whatproblem.svg` | 偵探拿到一封新委託信打開，信裡是一個上鎖的謎題盒，表這次是什麼問題。 |
| 580 | games／verb | 行こう、柔らかな月光が降り注ぐ場所へ。／いこう、やわらかな げっこうが ふりそそぐ ばしょへ。／走吧，去柔和月光灑落的地方。 | `game-card:game:genshin:lauma:join:68019c8677` | `gotomoonlight.svg` | 兩人走向前方月光照亮的一片空地，身後是暗處，表去柔和月光灑落的地方。 |
| 581 | games／abstract | 今日はどこへ冒険に行くんですか？／きょうは どこへ ぼうけんに いくんですか？／今天要去哪裡冒險？ | `game-card:game:genshin:linnea:join:56fe82183f` | `whereadventure.svg` | 人物背著冒險背包站在攤開的地圖前，地圖上好幾個打點的目的地，表今天（這次）要去哪裡冒險。 |
| 582 | games／expression | お望み通りに。／おのぞみどおりに。／如您所願。 | `game-card:game:genshin:linnea:burst:3ef55d8fc1` | `asyouwish.svg` | 侍從單手放胸前優雅地欠身，另一手把托盤上的東西遞向主人，表「如您所願」。 |
| 583 | games／abstract | 次は何に会えるかな？／つぎは なにに あえるかな？／下次能遇見什麼呢？ | `game-card:game:genshin:lumine:join:b4acf33104` | `whonext.svg` | 人物望向前方有好幾扇不同的門，每扇門後只露出一點未知的身影，表下次能遇見什麼。 |
| 584 | games／abstract | フィナーレといこうか！／フィナーレと いこうか！／那就進入終幕吧！ | `game-card:game:genshin:lyney:burst:c458175e88` | `finale.svg` | 舞台上表演者張開雙臂謝幕，彩帶與煙火同時落下，布幕正要合上，表進入終幕。 |
| 585 | games／abstract | 聞け！太陽の咆哮を！／きけ！たいようの ほうこうを！／聽吧！太陽的咆哮！ | `game-card:game:genshin:mavuika:burst:5539fd4e5c` | `sunroar.svg` | 烈日張開光芒，粗大的聲浪從太陽向四方湧出，表聽太陽的咆哮。 |
| 586 | games／abstract | 運命よ、水面に映るのです。／うんめいよ、すいめんに うつるのです。／命運啊，映現於水面吧。 | `game-card:game:genshin:mona:skill:b201ab4bc6` | `fateinwater.svg` | 人物俯看水面，水中倒映出他未來的路與星星，表命運映現於水面。 |
| 587 | games／abstract | これが運命です。／これが うんめいです。／這就是命運。 | `game-card:game:genshin:mona:burst:169629e632` | `thisisfate.svg` | 一條命運之線把兩人的小指連在一起，上方星星連成一線，表這就是命運。 |
| 588 | games／expression | やっほー。みんな元気？／やっほー。みんな げんき？／嗨～大家好嗎？ | `game-card:game:genshin:mualani:join:44a2d6818e` | `heyeveryone.svg` | 人物跳起來高舉手揮動，向一群朋友打招呼，表「嗨～大家好嗎？」。 |
| 589 | games／verb | 知識を、あなたにも。／ちしきを、あなたにも。／也把知識分享給你。 | `game-card:game:genshin:nahida:burst:c8394bdfff` | `sharingknowledge.svg` | 人物從自己打開的書中捧出一盞發光的小燈，遞向對方，表把知識也分享給你。 |
| 590 | games／abstract | 撃ち続けて～！うんうん、イイ感じ！／うちつづけて～！うんうん、イイ かんじ！／繼續射擊～！嗯嗯，感覺很好！ | `game-card:game:genshin:navia:burst:c838b9dd07` | `keepshooting.svg` | 人物持續開槍連發，子彈一連串打向靶子，靶上已有多個彈痕，旁人拍手，表繼續射擊。 |
| 591 | games／expression | 喜んで。／よろこんで。／樂意之至。 | `game-card:game:genshin:neuvillette:join:0df930b087` | `gladly.svg` | 對方提出請求，人物立刻笑著點頭並伸手接下，頭旁的小花，表「樂意之至」。 |
| 592 | games／expression | 海よ、私は帰ってきた。／うみよ、わたしは かえってきた。／大海啊，我回來了。 | `game-card:game:genshin:neuvillette:burst:bf35a9f327` | `backtosea.svg` | 人物張開雙臂站在船頭，眼前是熟悉的大海與海鷗，表大海啊我回來了。 |
| 593 | games／expression | 私を失望させないでね。／わたしを しつぼうさせないでね。／別讓我失望喔。 | `game-card:game:genshin:ningguang:join:521c5d8611` | `dontdisappoint.svg` | 人物手指著對方、帶著期待的微笑，身後放著要對方完成的任務單，表「別讓我失望喔」。 |
| 594 | games／abstract | 凍てつく旋律を。／いてつく せんりつを。／奏響冰凍的旋律。 | `game-card:game:genshin:odette:burst:687b6a770d` | `frozenmelody.svg` | 從樂器流出的音符一個個結成冰晶，表奏響冰凍的旋律。 |
| 595 | games／abstract | 稲光、すなわち永遠なり。／いなびかり、すなわち えいえん なり。／閃電，即是永恆。 | `game-card:game:genshin:raiden:burst:b9ac5cb7fb` | `eternallightning.svg` | 一道閃電被畫成首尾相接的無限環，周圍光芒不滅，表閃電即是永恆。 |
| 596 | games／verb | 貫け…！／つらぬけ…！／貫穿吧……！ | `game-card:game:genshin:razor:burst:ba5e1aa1a7` | `piercethrough.svg` | 一支箭貫穿重重的木板，三片板都被射穿出洞，表貫穿吧。 |
| 597 | games／expression | 許さない！／ゆるさない！／不可原諒！ | `game-card:game:genshin:rosaria:skill:60a63544a0` | `unforgivable.svg` | 人物緊握拳頭、眉頭倒豎，背後怒火，指著做壞事的人，表「不可原諒」。 |
| 598 | games／expression | 震えなさい！／ふるえなさい！／顫抖吧！ | `game-card:game:genshin:rosaria:burst:003452fc96` | `tremble.svg` | 高大的身影俯視，面前的人縮成一團發抖，身邊的抖動線，表「顫抖吧」。 |
| 599 | games／abstract | 深海の加護！／しんかいの かご！／深海的庇佑！ | `game-card:game:genshin:sangonomiyakokomi:burst:b46a788224` | `deepseablessing.svg` | 深海中一道柔和的光罩保護著潛入的人，周圍水泡與魚群，表深海的庇佑。 |
| 600 | games／expression | 出てこい。／でてこい。／出來。 | `game-card:game:genshin:sayu:burst:4544a06072` | `comeout.svg` | 人物對著洞穴入口大聲命令，洞裡只露出一雙眼睛，表「出來」。 |
| 601 | games／abstract | 言い逃れはさせない！／いいのがれは させない！／不讓你找藉口開脫！ | `game-card:game:genshin:shikanoinheizou:skill:41ea08af1c` | `noexcuses.svg` | 被告想用一張藉口紙擋在前面，法官伸手把紙撕開，表不讓你找藉口開脫。 |
| 602 | games／abstract | 罪を認めろ！／つみを みとめろ！／認罪吧！ | `game-card:game:genshin:shikanoinheizou:burst:c075a3175c` | `confess.svg` | 法官指著被告，被告低頭交出藏著的贓物，表認罪吧。 |
| 603 | games／expression | お邪魔するね。／おじゃまするね。／打擾囉。 | `game-card:game:genshin:sigewinne:join:2c3c289cf1` | `intruding.svg` | 人物推開門探頭進來，微微彎腰向屋內的人打招呼，表「打擾囉」。 |
| 604 | games／expression | 私の力が必要か？／わたしの ちからが ひつようか？／需要我的力量嗎？ | `game-card:game:genshin:skirk:join:b4b8a3f2b3` | `needmypower.svg` | 人物攤開掌心，手中凝聚一團光，看向陷入困境的對方，表「需要我的力量嗎」。 |
| 605 | games／abstract | 無に帰せ。／むに きせ。／歸於虛無。 | `game-card:game:genshin:skirk:skill:b2d8ca82bf` | `returntonothing.svg` | 物件逐步碎成光點，最後只剩一個空的虛線圓，表歸於虛無。 |
| 606 | games／abstract | 星々よ、静かに眠れ。／ほしぼしよ、しずかに ねむれ。／群星啊，靜靜沉睡吧。 | `game-card:game:genshin:skirk:burst:e8a4c2eef1` | `sleepstars.svg` | 夜空中幾顆星星閉著眼（眼睛畫成向下的弧線），旁邊的月亮也在雲被下休息，表群星啊靜靜沉睡吧。 |
| 607 | games／abstract | 力になれるように…／ちからに なれるように…／希望能幫得上忙…… | `game-card:game:genshin:sucrose:join:be625372e1` | `hopetohelp.svg` | 人物雙手合十望著正在搬重物的同伴，泡泡裡是自己幫忙抬的畫面，表希望能幫得上忙。 |
| 608 | games／abstract | 吸引テスト開始。／きゅういんテスト かいし。／吸引測試開始。 | `game-card:game:genshin:sucrose:skill:8b81eaf649` | `suctiontest.svg` | 吸塵裝置的吸口把前方的小碎屑往內吸，旁邊檢查表開始打勾，表吸引（吸力）測試開始。 |
| 609 | games／abstract | 超拡散形態！／ちょうかくさんけいたい！／超擴散形態！ | `game-card:game:genshin:sucrose:burst:2fd05e0b48` | `superspread.svg` | 中央的核心爆出大量光點，向四面八方擴散成大圈，表超擴散形態。 |
| 610 | games／abstract | 見えないだろ？／みえないだろ？／看不見吧？ | `game-card:game:genshin:tighnari:skill:94d161a18b` | `invisible.svg` | 人物披上隱身斗篷後只剩虛線輪廓，旁人四處找卻看不到，表「看不見吧」。 |
| 611 | games／abstract | お出かけ？それとも…試合？／おでかけ？それとも…しあい？／要出門？還是……比賽？ | `game-card:game:genshin:varesa:join:0fe3e8de46` | `outingormatch.svg` | 人物左右兩邊各有一個選項：提包出門的小路與比賽場的球門，對方攤手問是哪一個，表「要出門？還是比賽？」。 |
| 612 | games／verb | 行くよっ！／いくよっ！／我要上了！ | `game-card:game:genshin:varesa:skill:3ed4a7e749` | `chargingin.svg` | 人物壓低身子起跑衝向前方，身後速度線，表「我要上了」。 |
| 613 | games／abstract | 身の程を知れ。／みのほどを しれ。／認清自己的分寸。 | `game-card:game:genshin:wanderer:burst:c646c6a891` | `knowyourplace.svg` | 高大的人物站在高台上俯視，下方的人被一條線框在矮處，表認清自己的分寸。 |
| 614 | games／abstract | 食材は全部持ったよ！／しょくざいは ぜんぶ もったよ！／食材都帶齊了喔！ | `game-card:game:genshin:xiangling:join:d720fd913f` | `allingredients.svg` | 購物籃裡蔬菜、魚、蛋都齊了，旁邊清單每項都打勾，表食材都帶齊了。 |
| 615 | games／abstract | 仙人のご光来だ！／せんにんの ごこうらいだ！／仙人駕到！ | `game-card:game:genshin:xianyun:burst:db69f57d5a` | `immortalarrives.svg` | 仙人乘著祥雲從天而降，衣袖飄揚，下方的人仰望，表仙人駕到。 |
| 616 | games／abstract | 沸け、山の血！／わけ、やまの ち！／沸騰吧，山之血！ | `game-card:game:genshin:xilonen:burst:1eca9a8c12` | `boilingmountain.svg` | 火山口冒出沸騰的熔岩，熔岩泡泡往上翻滾，表沸騰吧，山之血。 |
| 617 | games／expression | この剣は分かるかい！／この けんは わかるかい！／你明白這把劍的厲害嗎！ | `game-card:game:genshin:xingqiu:skill:a0b31cd4f8` | `knowthissword.svg` | 人物把劍橫舉到對方眼前，劍身上的紋樣發光，挑眉問對方認不認得，表你明白這把劍的厲害嗎。 |
| 618 | games／abstract | 詩よ、錦となれ。／しよ、にしきと なれ。／詩啊，化為錦繡吧。 | `game-card:game:genshin:xingqiu:burst:46a7c78c29` | `poembrocade.svg` | 從卷軸中飄出的詩行化為彩色絲線，織成一塊花紋錦緞，表詩化為錦繡。 |
| 619 | games／expression | 面白きことをしにゆくぞ。／おもしろき ことを しに ゆくぞ。／去做些有趣的事吧。 | `game-card:game:genshin:yaemiko:join:df520cf586` | `funthings.svg` | 人物眼睛發亮、搓手準備出發，泡泡裡是煙火、遊樂設施與驚喜盒，表去做些有趣的事吧。 |
| 620 | games／verb | 具現化せよ。／ぐげんかせよ。／具現化吧。 | `game-card:game:genshin:yaemiko:skill:8da6962c29` | `materialize.svg` | 人物雙手間的虛線輪廓逐漸變成實心的立方體，表具現化。 |
| 621 | games／abstract | 雷光、いと美しきかな。／らいこう、いと うつくしきかな。／雷光，真是美麗啊。 | `game-card:game:genshin:yaemiko:burst:8fe8b1433e` | `beautifullightning.svg` | 夜空中一道閃電優雅地分岔，人物仰望讚嘆，表雷光真美。 |
| 622 | games／abstract | 炎食いの刑！／ほのおぐいの けい！／噬炎之刑！ | `game-card:game:genshin:yanfei:burst:0f6bb74c31` | `flameeating.svg` | 一團火焰張開像嘴巴的開口，把對方的火球整個吞下，表噬炎之刑。 |
| 623 | games／abstract | ターゲットは絞れたの？／ターゲットは しぼれたの？／目標確定下來了嗎？ | `game-card:game:genshin:yelan:join:b76c05616a` | `narrowtarget.svg` | 一群人中逐步縮小的三個圈最後只圈住一人，表目標確定下來、鎖定了。 |
| 624 | games／abstract | 悪夢よ悪夢よ、飛んでいけ…／あくむよ あくむよ、とんでいけ…／惡夢啊，惡夢啊，飛走吧…… | `game-card:game:genshin:yumemizukimizuki:burst:4c93238dfe` | `nightmareaway.svg` | 睡著的小孩頭上的黑色惡夢雲被一陣風吹走，換成星星，表惡夢飛走吧。 |
| 625 | games／abstract | 今日はどんな芝居をするのでしょう？／きょうは どんな しばいを するのでしょう？／今天要演什麼戲呢？ | `game-card:game:genshin:yunjin:join:998705dc7b` | `whatplay.svg` | 劇場的布幕還關著，人物手拿入場券，泡泡裡幾個不同戲碼的面具在猜，表今天要演什麼戲。 |
| 626 | games／abstract | 揺らぐことなし。／ゆらぐことなし。／絕不動搖。 | `game-card:game:genshin:zhongli:skill:fb9a33324e` | `unwavering.svg` | 狂風吹得周圍的草全部倒伏，中央的人物與身旁的旗桿卻筆直不動，表絕不動搖。 |
| 627 | games／abstract | 天道、ここにあり。／てんどう、ここに あり。／天道，就在此處。 | `game-card:game:genshin:zhongli:burst:fb2c31befe` | `heavenlyway.svg` | 天上降下的光路正好落在人物站的地方，光路上有規律的階梯，表天道就在此處。 |
| 628 | games／abstract | 雨上がり、琉璃が月を映す。／あめあがり、るりが つきを うつす。／雨後，琉璃映照月亮。 | `game-card:game:genshin:zibai:burst:3846e356f6` | `glassmoon.svg` | 雨剛停，一片琉璃瓦上的水窪映出明月，屋簷還滴著水，表雨後琉璃映照月亮。 |
