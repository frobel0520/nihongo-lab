# 舊文法JLPT標記核實（T140）

基底main `069b0f2723064f59598cf14dec2a05429339e4db`，2026-10-20重新盤點；起始工作目錄乾淨、無未合併PR。由`curriculum/lessons.mjs`唯一入口讀取，現行coverage全階段實際範圍是215課、543個GrammarPoint；遊戲角色台詞不是此格式的文法點，不把台詞說明拆成新課。通用180課保持，不接續推論題改寫。

## 範圍、來源與授權

現行coverage預設只算第0階段25課，本輪另執行`npm run coverage -- --all-stages --missing`，確認71個缺標分布29課：N5復健51項、動畫與口語20項。逐項閱讀接續、解說、例句後，再核對釘選OpenJLPT的ID、formation及notes，沒有只依標題關鍵字配對。

參照維持既有N5（81項）與N4（98項），共179項；沒有擴充coverage至N3～N1。下文「無現行對應」僅表示在這179項中無可靠的獨立對應，並非宣稱不屬於任何JLPT級別或其他級別也未收錄。涉及更高階構式者留待另批擴充參照範圍，不能直接放入目前會報unknown的ID。

來源：[OpenJLPT釘選版本](https://github.com/evanclan/OpenJLPT/tree/88eaef9c589f787194903e733c7f7b6df9d6ebc0)、[來源與歸屬](https://github.com/evanclan/OpenJLPT/blob/88eaef9c589f787194903e733c7f7b6df9d6ebc0/NOTICE.md)、[授權](https://github.com/evanclan/OpenJLPT/blob/88eaef9c589f787194903e733c7f7b6df9d6ebc0/LICENSE)、[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。文法等級依OpenJLPT維護者的備考資料共識，非JLPT官方認定；Waller社群表主要是該資料集的詞彙／漢字分級來源。N5／N4快取已重新與釘選遠端JSON逐項比對等值，原始清單、外部formation／解說／例句只留在被忽略的`.cache/`，沒有複製進repo或fixture。以下名稱取自本專案教材，理由自行撰寫，ID僅是已使用的對照引用。

## 統計與判定原則

| 項目 | 開始前 | 本輪後 |
| --- | ---: | ---: |
| 缺標文法點（全階段） | 71 | 30 |
| 缺標文法點（第0階段） | 51 | 27 |
| 本批補標 | — | 41 |
| 本批無現行可靠對應、保留未標 | — | 30 |
| 本批JLPT對應待確認 | — | 0 |
| 全階段N5文法清單覆蓋 | 81/81 | 81/81 |
| 全階段N4文法清單覆蓋 | 89/98 | 89/98 |
| unknown ID | 0 | 0 |

41項涉及19課、16個教材來源檔，新增57筆引用、36個不同ID；這36個ID本來均已由其他文法點引用，真正新增清單覆蓋為0。未新增教材內容或教學用法，不能寫成新增36種文法、達成新等級或學習成效改善。

其中15項明列「部分對應」：只給確實教授的子目標標記，其他詞彙／語氣或構式不因此取得同一等級。`jlpt`本來就是參照ID集合，不是整個文法點所有內容的完整分級；複合目標可用陣列，不拆改課文、不把不相同的近義構式硬塞單一ID。只在例句偶然出現的です、が、あとで等，不當成本點的文法教學標記；總複習也不任選一個ID湊數。

## 71項逐一判定

「資料定位」的`grammar/N`是本報告1起算的陣列定位，不是新增產品ID；動畫另列原有study.id。源碼位置以本次修改後的文法pattern行為準。補標陣列可跨同課重複，代表在不同情境複習同一用法；單一文法點內仍禁止重複ID。

| #／課別／資料定位 | 原名稱與精確檔案 | 判定／ID | 實際教學用法及理由 |
| --- | --- | --- | --- |
| 1／N5第3天／`stage0-day3/grammar/2` | N は ここ／そこ／あそこ です　／　N は どこ ですか<br>`curriculum/days/day03.mjs:55` | 補標（復習）<br>`koko-soko-asoko-doko` | 主題改為物品的位置問答；ここ／あそこ與どこ正是場所指示系列，不另加泛用疑問標記。 |
| 2／N5第3天／`stage0-day3/grammar/3` | こちら／そちら／あちら／どちら<br>`curriculum/days/day03.mjs:65` | 補標（部分對應）<br>`koko-soko-asoko-doko` | 釘選條目的notes明列こちら系列為禮貌場所用法；標記只對應入口／出口，不把介紹人物的こちら另算新句型。 |
| 3／N5第3天／`stage0-day3/grammar/5` | N は いくらですか　／　〜円です<br>`curriculum/days/day03.mjs:85` | 無現行對應（詞彙讀音）<br>保留未標 | 價錢問答與百千萬讀音，現行清單沒有いくら／數字讀音獨立ID；不因句末です標泛用判斷。 |
| 4／N5第4天／`stage0-day4/grammar/1` | 今 〜時〜分 です　／　今 何時ですか<br>`curriculum/days/day04.mjs:43` | 無現行對應（詞彙讀音）<br>保留未標 | 時分與讀音教學；沒有時計／何時專屬ID，不以特定時刻に替代，例句未教に。 |
| 5／N5第5天／`stage0-day5/grammar/4` | 何月何日／何曜日 ですか<br>`curriculum/days/day05.mjs:79` | 無現行對應（詞彙讀音）<br>保留未標 | 月日星期詞彙及特殊讀音，沒有對應獨立文法ID。 |
| 6／N5第5天／`stage0-day5/grammar/5` | いつ 〜ますか<br>`curriculum/days/day05.mjs:89` | 無現行對應（清單無項）<br>保留未標 | 核心是いつ及不加に的問時用法；不是か的構造教學，也不能以加に的ni-time覆蓋相反限制。 |
| 7／N5第7天／`stage0-day7/grammar/1` | N（道具・語言）で 〜ます<br>`curriculum/days/day07.mjs:46` | 補標（直接）<br>`de-means` | 解說明示工具與語言的で，筷子／原子筆例句皆為手段，不是動作場所。 |
| 8／N5第7天／`stage0-day7/grammar/3` | N1 に／から N2 を もらいます・借ります・習います<br>`curriculum/days/day07.mjs:66` | 補標（部分對應）<br>`ageru-kureru-morau` | 受領視點的もらう與來源に／から符合條目；借りる、習う的來源搭配無此清單獨立ID，不能誤標接收者に。 |
| 9／N5第7天／`stage0-day7/grammar/5` | あいさつ：いただきます／ごちそうさま／ありがとう<br>`curriculum/days/day07.mjs:86` | 無現行對應（固定語）<br>保留未標 | 用餐與道謝固定招呼，無單獨文法ID；不因いただきます一詞標謙讓動詞構式。 |
| 10／N5第8天／`stage0-day8/grammar/1` | N は い形容詞 です　／　〜くないです<br>`curriculum/days/day08.mjs:46` | 補標（直接）<br>`ku-nai-katta-ku-nakatta` | 核心是い形容詞否定くない，含いい→よくない；不把只有肯定形的例句當新增變化。 |
| 11／N5第8天／`stage0-day8/grammar/2` | N は な形容詞 です　／　〜じゃありません<br>`curriculum/days/day08.mjs:57` | 補標（複合）<br>`na-na-adjective`、`de-wa-arimasen-ja-nai` | 解說分別教な形容詞述語與じゃありません否定；きれい／静か例句支持兩個對照。 |
| 12／N5第8天／`stage0-day8/grammar/6` | N は どうですか　／　どんな N ですか<br>`curriculum/days/day08.mjs:97` | 無現行對應（清單無項）<br>保留未標 | どう／どんな的感想與類型問句無現行獨立ID；不以どの／どれ或例句的くて代替。 |
| 13／N5第10天／`stage0-day10/grammar/2` | N は 場所に あります／います<br>`curriculum/days/day10.mjs:58` | 補標（復習）<br>`ga-aru-ga-iru`、`ni-location` | 已知物品改為は主題仍是存在文；机の上に／庭に標存在位置，不是で的動作場所。 |
| 14／N5第10天／`stage0-day10/grammar/3` | N1 の 上／下／前／後ろ／中／外／隣／横／そば<br>`curriculum/days/day10.mjs:68` | 補標（直接）<br>`no` | 明教Nの＋位置名詞，駅の前、かばんの中是名詞連接，不是の／こと名詞化。 |
| 15／N5第10天／`stage0-day10/grammar/5` | 方位：東・西・南・北<br>`curriculum/days/day10.mjs:89` | 補標（部分對應）<br>`no` | 方位本身是詞彙；明示加の及駅の東／学校の北對應名詞連接，標記不替東西南北的詞彙判級。 |
| 16／N5第11天／`stage0-day11/grammar/1` | 數量詞：〜つ／〜人／〜枚／〜回<br>`curriculum/days/day11.mjs:47` | 無現行對應（數量詞）<br>保留未標 | 量詞選擇與浮動數量詞位置沒有現行獨立ID；不把人數列舉誤標助詞頻率に。 |
| 17／N5第11天／`stage0-day11/grammar/2` | 期間：〜時間／〜日／〜週間／〜か月／〜年<br>`curriculum/days/day11.mjs:57` | 無現行對應（數量詞）<br>保留未標 | 期間長度與かかる未有獨立ID；期間不加に不等同特定時刻ni-time。 |
| 18／N5第11天／`stage0-day11/grammar/6` | 時間詞（今週・来月・去年 …）<br>`curriculum/days/day11.mjs:94` | 無現行對應（詞彙讀音）<br>保留未標 | 相對時間詞及無に的用法沒有獨立ID；不以時刻に替代。 |
| 19／N5第12天／`stage0-day12/grammar/6` | 天気の言い方<br>`curriculum/days/day12.mjs:94` | 無現行對應（詞彙搭配）<br>保留未標 | 天氣搭配、暑い／熱い等詞義區分，不是い形容詞否定或推測句型。 |
| 20／N5第13天／`stage0-day13/grammar/5` | 色の言い方<br>`curriculum/days/day13.mjs:87` | 補標（部分對應）<br>`no` | 明教名詞顏色用の修飾、例茶色のかばん；肯定い形容詞直接修飾未有獨立ID，不挪用否定／過去形ID。 |
| 21／N5第14天／`stage0-day14/grammar/5` | 道案内：まっすぐ行って、右へ曲がってください<br>`curriculum/days/day14.mjs:94` | 補標（複合）<br>`te`、`te-kudasai`、`o` | 解說明教連續て形、最後てください與經過路線を；過橋後停下及この道を行く可逐項核對，非只依標題配對。 |
| 22／N5第15天／`stage0-day15/grammar/3` | 〜ています（狀態・習慣・職業）<br>`curriculum/days/day15.mjs:63` | 補標（復習）<br>`te-iru` | 住む／勤める／知る的狀態用法是條目明含的持續狀態，與進行中不同但共用同一參照ID。 |
| 23／N5第15天／`stage0-day15/grammar/5` | お仕事は何ですか<br>`curriculum/days/day15.mjs:83` | 無現行對應（固定語）<br>保留未標 | 職業問答及名詞お前綴；不等於清單的尊敬動詞構式，不能以sonkeigo泛貼。 |
| 24／N5第16天／`stage0-day16/grammar/1` | V1 て、V2 て、V3　（連續動作）<br>`curriculum/days/day16.mjs:41` | 補標（直接）<br>`te` | 前項動作て連接，末動詞決定全句時態，起床洗臉吃飯三動作為直接證據。 |
| 25／N5第16天／`stage0-day16/grammar/5` | N1 は N2 が 〜です（部分與整體）<br>`curriculum/days/day16.mjs:80` | 補標（複合）<br>`wa`、`ga-subject` | 解說明分は提示整體、が標描述部分；目が大きい／背が高い同時展示兩個角色。 |
| 26／N5第16天／`stage0-day16/grammar/6` | 着る・はく・かける・締める（穿戴的動詞）<br>`curriculum/days/day16.mjs:90` | 補標（部分對應）<br>`te-iru` | 穿戴動詞的選擇是詞彙；明教現在穿著的狀態，はいています／かけています只對應這一子目標。 |
| 27／N5第17天／`stage0-day17/grammar/5` | 症状：N が 痛いです<br>`curriculum/days/day17.mjs:85` | 無現行對應（詞彙搭配）<br>保留未標 | 身體部位、痛い與就醫問候為重點；沒有痛み句型獨立ID，が只在句框中，未另教主語功能。 |
| 28／N5第17天／`stage0-day17/grammar/6` | すぐ／たぶん／ほんとう／ちょうど<br>`curriculum/days/day17.mjs:94` | 無現行對應（詞彙）<br>保留未標 | 四個副詞詞義，沒有現行獨立ID；たぶん不等同未使用的でしょう。 |
| 29／N5第18天／`stage0-day18/grammar/1` | 動詞の 辞書形（作り方）<br>`curriculum/days/day18.mjs:35` | 無現行對應（形態概念）<br>保留未標 | 教辭書形作法，不是禮貌ます、可能形或名詞化；現行沒有基本辞書形獨立ID。 |
| 30／N5第18天／`stage0-day18/grammar/5` | 自己紹介とあいさつ<br>`curriculum/days/day18.mjs:80` | 無現行對應（固定語）<br>保留未標 | 自我介紹與問候語；不因例句有です／ました而把詞彙課標成時態教學。 |
| 31／N5第19天／`stage0-day19/grammar/6` | 時の言葉：夕方・夜・昨夜<br>`curriculum/days/day19.mjs:89` | 無現行對應（詞彙讀音）<br>保留未標 | 時段與年份詞彙，無獨立文法ID；句末變化只是應用。 |
| 32／N5第20天／`stage0-day20/grammar/1` | 普通形とは（丁寧形との対応）<br>`curriculum/days/day20.mjs:45` | 補標（複合）<br>`nai`、`ta`、`da`、`de-wa-arimasen-ja-nai`、`ku-nai-katta-ku-nakatta` | 普通形對照明教動詞否定與過去、名詞判斷／否定、い形容詞否定過去；分列5個已教形式，不造普通形總括ID。 |
| 33／N5第20天／`stage0-day20/grammar/3` | 普通形での会話（〜？／うん／ううん）<br>`curriculum/days/day20.mjs:67` | 無現行對應（口語）<br>保留未標 | 語調疑問、うん／ううん的會話；不能標成明確教か標記的ka-question。 |
| 34／N5第20天／`stage0-day20/grammar/5` | 家族の呼び方<br>`curriculum/days/day20.mjs:87` | 無現行對應（詞彙語用）<br>保留未標 | 內外家族稱呼及人稱禮貌詞彙；清單尊敬／謙讓動詞ID不對應名詞稱呼。 |
| 35／N5第20天／`stage0-day20/grammar/6` | こっち／そっち／あっち／どっち　と　どの／どれ／どなた／こんな<br>`curriculum/days/day20.mjs:97` | 補標（部分對應）<br>`kore-sore-are-dore`、`kono-sono-ano-dono` | 只對應解說中可獨立的どれ與必接名詞的どの；こっち、どなた、こんな不因近義而硬套同一系列。 |
| 36／N5第21天／`stage0-day21/grammar/5` | 接続の言葉：しかし・そして・それでは・また<br>`curriculum/days/day21.mjs:73` | 無現行對應（詞彙連接）<br>保留未標 | しかし／そして／それでは／また是句間連接詞，不能拿句內が／けど接續ID代替。 |
| 37／N5第21天／`stage0-day21/grammar/6` | みんな・皆さん・いろいろ・同じ・違う<br>`curriculum/days/day21.mjs:82` | 補標（部分對應）<br>`na-na-adjective` | 只對應明教いろいろな国的な接續；同じ不加な是詞彙例外，不能把同じ也標成一般な形容詞。 |
| 38／N5第22天／`stage0-day22/grammar/1` | 普通形 ＋ N（名詞修飾）<br>`curriculum/days/day22.mjs:32` | 無現行對應（清單無項）<br>保留未標 | 完整動詞普通形關係子句修飾N在現行179項無獨立ID；不是の／こと名詞化。 |
| 39／N5第22天／`stage0-day22/grammar/2` | 修飾文の中の「が」（主語）<br>`curriculum/days/day22.mjs:41` | 補標（直接）<br>`ga-subject` | 田中さんが作ったカレー中が標修飾句主語；對照的是主語功能，不另造名詞修飾ID。原解說對は的絕對措辭另列待查，不藉標記認可所有限制。 |
| 40／N5第22天／`stage0-day22/grammar/3` | い形容詞・な形容詞・N の ＋ N<br>`curriculum/days/day22.mjs:50` | 補標（部分對應）<br>`na-na-adjective`、`no` | 明教な形容詞加な與名詞加の；例きれいな玄関。肯定い形容詞名詞修飾無獨立ID，不以くない代替。 |
| 41／N5第22天／`stage0-day22/grammar/4` | 場所・時間を修飾する<br>`curriculum/days/day22.mjs:60` | 無現行對應（清單無項）<br>保留未標 | 關係子句修飾場所、日子等名詞，沒有獨立ID；例日本へ行く日不是とき接續。 |
| 42／N5第22天／`stage0-day22/grammar/5` | 物の呼び方：ペン・紙・ボタン …<br>`curriculum/days/day22.mjs:69` | 無現行對應（詞彙）<br>保留未標 | 用品與建築稱呼，未教清單專屬文法目標；不按例句偶見助詞補泛用標記。 |
| 43／N5第23天／`stage0-day23/grammar/3` | 自動詞と他動詞（〜が開く／〜を開ける）<br>`curriculum/days/day23.mjs:56` | 補標（部分對應）<br>`te-iru` | 自他動詞配對無現行獨立ID；解說另明教結果狀態，窓が開いています／電気が消えています支持ている子目標。 |
| 44／N5第23天／`stage0-day23/grammar/4` | 動詞ます形＋物（食べ物・飲み物・買い物）<br>`curriculum/days/day23.mjs:66` | 無現行對應（構詞）<br>保留未標 | 連用形＋物的複合名詞，不能對應の／こと名詞化、方法方或動作開始等構式。 |
| 45／N5第23天／`stage0-day23/grammar/5` | 色の名詞：青・赤・黒・白・黄色<br>`curriculum/days/day23.mjs:75` | 補標（部分對應）<br>`to-and`、`no` | 色名本身未標級；解說明教名詞色用と列舉、用の修飾，赤と白の花同時支持兩種連接。 |
| 46／N5第23天／`stage0-day23/grammar/6` | 御飯・昼御飯・晩御飯・夕飯<br>`curriculum/days/day23.mjs:85` | 無現行對應（詞彙）<br>保留未標 | 飯與各餐詞彙；あとで只是例句應用，不是本點教授的時間接續規則。 |
| 47／N5第24天／`stage0-day24/grammar/6` | 所・物・先・方・後・辺<br>`curriculum/days/day24.mjs:76` | 無現行對應（詞彙）<br>保留未標 | 所／物／先／方／後／辺的詞義；此處方是人的敬稱，不是方法方，所也不是ところだ的體貌。 |
| 48／N5第25天／`stage0-day25/grammar/3` | もし 〜たら、〜<br>`curriculum/days/day25.mjs:48` | 補標（復習）<br>`tara` | もし強化假設但不改たら接續，天気がよかったら／分からなかったら明確符合；同課重複是有目的複習。 |
| 49／N5第25天／`stage0-day25/grammar/4` | 単位と数字：キロ・グラム・メートル・ゼロ<br>`curriculum/days/day25.mjs:57` | 無現行對應（詞彙讀音）<br>保留未標 | 單位與數字／溫度詞義，沒有單獨文法ID；比較例句未在此重新解說より。 |
| 50／N5第25天／`stage0-day25/grammar/5` | 縦・横・より・ふろ<br>`curriculum/days/day25.mjs:66` | 補標（部分對應）<br>`yori` | 只對應解說明示的比較標準より及今天／昨天比較；縱橫與洗澡詞彙不因此取得文法等級。 |
| 51／N5第25天／`stage0-day25/grammar/6` | 25 日のふりかえり（第 0 階段まとめ）<br>`curriculum/days/day25.mjs:75` | 無現行對應（總複習）<br>保留未標 | 詞類與大量助詞／句型的總回顧，不是單一新增可判級點；不從末尾兩例或長清單任選一個ID。 |
| 52／動畫第1課／`anime-lesson-01/grammar/4（study:past-predicate）` | ～た／～だ：動作完成與名詞判斷<br>`curriculum/anime-core-foundation.mjs:121` | 補標（複合）<br>`ta`、`da` | 解說把来た／頑張った過去動作與戦士だ名詞判斷分開，兩個ID正好表達這項對比。 |
| 53／動畫第3課／`anime-lesson-03/grammar/1（study:imperative）` | ～え／～ろ：動詞命令形<br>`curriculum/anime-core-foundation.mjs:396` | 補標（直接）<br>`e-ro` | 五段う→え、一段る→ろ與不規則命令；前を見ろ直接支持，不等同なさい禮貌層次。 |
| 54／動畫第3課／`anime-lesson-03/grammar/2（study:negative-command）` | 辭書形＋な：不要做某事<br>`curriculum/anime-core-foundation.mjs:404` | 補標（直接）<br>`na-prohibition` | 辭書形＋な禁止，一人で行くな；解說也排除感嘆な與縮約命令しな。 |
| 55／動畫第4課／`anime-lesson-04/grammar/1（study:refusal-objection）` | だが／嘘だ：拒絕與反駁<br>`curriculum/anime-core.mjs:149` | 補標（部分對應）<br>`da` | 分步學習formation明示「名詞＋だ可表判斷」，嘘だ提供用例，因此只標da子目標；獨立だが的轉折與拒絕／驚訝語用不隨此判級，不以句內が硬替。 |
| 56／動畫第5課／`anime-lesson-05/grammar/1（study:battle-command）` | 命令形／辞書形＋な<br>`curriculum/anime-core.mjs:289` | 補標（複合）<br>`e-ro`、`na-prohibition` | 防げ命令與捨てるな禁止是兩個構式；書面捧げよ僅作變體說明，不把整點硬塞單一禁止ID。 |
| 57／動畫第5課／`anime-lesson-05/grammar/2（study:negative-causative）` | ～させない：不讓某事發生<br>`curriculum/anime-core.mjs:301` | 補標（複合）<br>`seru-saseru`、`nai` | 解說明拆死ぬ→死なせる→死なせない：使役加否定，不是欲求或可能否定。 |
| 58／動畫第5課／`anime-lesson-05/grammar/4（study:responsibility-wake）` | ～わけにはいかない：不能就這樣做<br>`curriculum/anime-core.mjs:321` | 無現行對應（對照範圍外）<br>保留未標 | 責任／立場的わけにはいかない不在現行N5／N4參照，不等於能力否定或なければ義務；不推定其他級別也未收。 |
| 59／動畫第6課／`anime-lesson-06/grammar/1（study:te-connection-request）` | ～て、～てよ：動作連接與要求<br>`curriculum/anime-core.mjs:435` | 補標（部分對應）<br>`te` | 契約して連接下一動作符合て；なってよ是省略式請求，未出現ください，不能標成てください或以よ的新資訊功能代替。 |
| 60／動畫第7課／`anime-lesson-07/grammar/4（study:conclusion-negation）` | ～ということか／～わけではない<br>`curriculum/anime-core.mjs:638` | 無現行對應（對照範圍外）<br>保留未標 | ということか推論與わけではない部分否定在現行N5／N4沒有可靠ID；不是引用と言う或全面否定。 |
| 61／動畫第8課／`anime-lesson-08/grammar/4（study:even-extreme）` | ～すら：連這個都……<br>`curriculum/anime-core-foundation.mjs:583` | 無現行對應（對照範圍外）<br>保留未標 | 極端例示すら不是も的任意替換，現行N5／N4沒有該構式ID；不藉近義增加覆蓋。 |
| 62／口語轉換表／`stage2-spoken/grammar/1` | ている → てる<br>`curriculum/lessons.mjs:438` | 補標（復習）<br>`te-iru` | 完整降っています與縮約降ってる明確成對；ID指基底體貌，不把縮約另算新覆蓋。 |
| 63／口語轉換表／`stage2-spoken/grammar/2` | てしまう → ちゃう（でしまう → じゃう）<br>`curriculum/lessons.mjs:447` | 補標（直接）<br>`te-shimau-chau` | 釘選條目本身含ちゃう／じゃう；忘れてしまいました與忘れちゃった對應完成／遺憾。 |
| 64／口語轉換表／`stage2-spoken/grammar/3` | ておく → とく（でおく → どく）<br>`curriculum/lessons.mjs:456` | 補標（直接）<br>`te-oku` | 釘選notes明列とく／どく；買っておきます與買っとく都是事前準備。 |
| 65／口語轉換表／`stage2-spoken/grammar/4` | ては → ちゃ（では → じゃ）<br>`curriculum/lessons.mjs:465` | 補標（復習）<br>`te-wa-ikenai` | 完整禁止與じゃダメ成對；釘選條目承認ちゃ／じゃ縮約，對照禁止基底，不替所有ては語境判級。 |
| 66／口語轉換表／`stage2-spoken/grammar/5` | なければ → なきゃ<br>`curriculum/lessons.mjs:474` | 補標（復習）<br>`nakereba-naranai-nakute-wa-ikenai` | 完整なければなりません與義務省略なきゃ對照；ID對應課內完整義務，不把なきゃ誤當なくちゃ。 |
| 67／口語轉換表／`stage2-spoken/grammar/6` | のだ／のです → んだ／んです<br>`curriculum/lessons.mjs:483` | 補標（直接）<br>`n-desu-no-desu` | 完整のです與んだ都在說明背景，釘選notes含口語んだ／の。 |
| 68／口語轉換表／`stage2-spoken/grammar/7` | と言う → って<br>`curriculum/lessons.mjs:492` | 補標（部分對應）<br>`to-iu-say` | 完整例句来ないと言いました對應引用；口語って的傳聞省略只作本課對照，不把所有って或そうだ混為同一構式。 |
| 69／口語轉換表／`stage2-spoken/grammar/8` | ら抜き言葉（食べられる → 食べれる）<br>`curriculum/lessons.mjs:501` | 補標（復習）<br>`eru-rareru-potential` | 完整食べられません為可能形，釘選notes也提一段省ら；標記不表示ら抜き是考試／正式文章推薦形式，原警告保留。 |
| 70／口語轉換表／`stage2-spoken/grammar/9` | 語尾：よ／ね／よね<br>`curriculum/lessons.mjs:510` | 補標（複合）<br>`yo`、`ne` | 解說分別教よ的新資訊與ね的共享／確認；よね是組合，不能另造一個總括ID。 |
| 71／口語轉換表／`stage2-spoken/grammar/10` | 語尾：ぞ／ぜ／わ／かしら（角色語氣）<br>`curriculum/lessons.mjs:519` | 補標（部分對應）<br>`kana-kashira` | 僅かしら自問、あの人誰かしら與釘選條目吻合；ぞ／ぜ／わ的角色語氣沒有現行N5／N4獨立ID。 |

## 契約、驗證與限制

`jlpt`沒有加入內容雜湊：作者音檔依原文／聲線；scene依整段日文、題幹、選項及答案；文法練習依pattern、既有語義點／題ID、題幹／選項／答案。新標記不改既有541個scene、64個文法練習、105個動畫聽解、618個遊戲主紀錄與372個遊戲聽解ID，全SRS／聽寫catalog及curriculumSummary保持。版本3舊紀錄不失效，不需重做練習，也不新增遷移。與上批推論題改義時的ID修訂不同。

獨立069b0f2快照保護完整教材與舊標記，只有明列41項可新增jlpt；歷史黃金fixture不改，只在歷史比較時還原這41項。新增當前範圍及全部ID回歸，避免投影掩蓋其他變更。原狀態實際被新回歸捕捉為缺標，補標後通過。格式檢查仍要求非空合法slug陣列，去重界線修正為同一點內；跨點複習由coverage的Set去重，新增合成多ID／重複引用測試，不納入外部完整清單。有效ID另以釘選快取逐一核對，0 unknown。

目前文法標記不顯示在畫面。Node教材與瀏覽器payload仍保留同樣資料／鍵序；沒有新增runtime dependency、改同步版本／路由／離線／固定1倍，或放寬bundle／恢復T122時間Gate。全部8535個來源MP3逐檔SHA與開始前相同，不需補下載；教材原文、翻譯、reading／ruby及題義保持。

本機check／正式build／原bundle／coverage結果與瀏覽器、CI及正式發布證據記於release-audit，未完成的驗證不預記為成功。人工語音、完整真機QA及既有Android部分紀錄保持；補標與清單覆蓋不代表教材內容全面驗收或學習者已達相應級別。

## 教材措辭待核實（不改有聲內容）

第39項`stage0-day22/grammar/2`原note說修飾句主語「用が，不能用は」。這是一般主語規則是否過度排除對比用法的候選疑點；本輪沒有獨立語料查核，因此不列確認文法錯誤或發布阻塞。`ga-subject`僅對應現有例句的主語功能，不替這個絕對限制背書。建議後續用可靠文法資料核實適用條件再決定修訂。本輪JLPT對應待確認為0，與這1項教材措辭待核實分開計數。

## 後續界線

30項保留未標皆已有上述判定，不再把歷史71項視為全部未處理，也不要求歸零。若要涵蓋關係子句、わけ系或すら等，另批評估N3～N1對照與coverage驗證；不能以近義的も、名詞化の／こと或能力否定代替。外部讀題／試答回饋到位前不擴大推論改寫。完成本次產品及發布紀錄部署後停止。

本機實測：323 tests／check、正式base build、原bundle與預設／全階段coverage通過；19課375寬線上／真正離線逐課reload共38次文法檢視、65筆合成v3保持，3個Cache API準備音檔各兩次SHA與原生1倍，共6次播放，零pageerror／HTTP錯誤／溢位。非UI下載／人耳／真機驗收；225實際payload一致且precache、8535來源音檔SHA保持。CI及正式站結果另記release-audit。

### 分步接續複核更正

第55項的獨立study.formation明示「名詞＋だ可表判斷」，故將初稿的保留未標改為部分對應da。だが的語用仍不硬配ID；初稿40補／31保留修正為41補／30保留、部分對應15項，其他判定不變。修訂僅增加一個metadata欄位，原基底內容／ID雜湊不改；完整check／build／coverage與19課線上／真正離線文法檢視已重新通過，精確證據見release-audit。

