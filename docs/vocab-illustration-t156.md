# T156：300個詞義的配圖設計與來源

所有圖為本專案自行編繪之原創幾何SVG，CC0-1.0；無外部素材、作品人物或文字標籤。圖片只是該義項的一例，教材原文與解說不變。5張遊戲卡以整句表達為設計單位，不拆為新單字或宣稱300個新增詞彙。

基準main `a0a265666bc7836129cb615e748512965aee27e8`。原114資產、179映射保持。300主要映射＋184舊圖共用＋522新圖共用＝1006新增映射；798共用候選中92暫緩，決策與原ID見相鄰JSON／CSV。共用只寫入核准ID，不做執行期字面擴散。

已暫緩：大使館無文字小圖不夠明確，改選「傷」；多義／較窄情境如冷淡、空無、詢問、掛電話、遵守、抽象的關鍵、磨亮盾牌、按按鈕等不共用不同動作圖。原候選的用途不等於全站同詞全義已完成盤點。

## 300個主要義項

| # | 類別／詞類 | 原詞面／讀音／翻譯 | 精確ID | SVG | 構圖與義項界線 |
|---|---|---|---|---|---|
| 1 | n5／concrete | 部屋／へや／房間 | `stage0-day3:部屋` | `room.svg` | 牆面、地板、床與桌構成房間內景，不是房屋外觀。 |
| 2 | n5／concrete | トイレ／トイレ／廁所 | `stage0-day3:トイレ` | `toilet.svg` | 水箱、坐式馬桶與沖水把手，表廁所設施的一例。 |
| 3 | n5／concrete | 入口／いりぐち／入口 | `stage0-day3:入口` | `entrance.svg` | 人物在門外，箭頭向室內；與出口方向相反。 |
| 4 | n5／concrete | 出口／でぐち／出口 | `stage0-day3:出口` | `exit.svg` | 人物由門口向外移動，箭頭離開室內。 |
| 5 | n5／concrete | デパート／デパート／百貨公司 | `stage0-day3:デパート` | `departmentstore.svg` | 多層商場、櫥窗與購物袋，不用品牌或字。 |
| 6 | general／concrete | 傷／きず／傷口；傷痕 | `general-listening-07:傷` | `wound.svg` | 手臂上小擦傷與局部敷料，表傷口／傷痕，不把痛覺或健康狀態當物件。 |
| 7 | n5／concrete | 会社／かいしゃ／公司 | `stage0-day3:会社` | `company.svg` | 多層辦公大樓與公事包，表工作場所。 |
| 8 | n5／concrete | 地下鉄／ちかてつ／地下鐵 | `stage0-day5:地下鉄` | `subway.svg` | 車頭位於地下隧道拱內，下方軌道，不僅一般電車。 |
| 9 | n5／concrete | タクシー／タクシー／計程車 | `stage0-day5:タクシー` | `taxi.svg` | 車頂亮燈、車身與車窗，無文字牌。 |
| 10 | n5／concrete | 野菜／やさい／蔬菜 | `stage0-day6:野菜` | `vegetables.svg` | 胡蘿蔔、葉菜與茄子組合，避免只定義單一蔬菜。 |
| 11 | n5／concrete | 果物／くだもの／水果 | `stage0-day6:果物` | `fruit.svg` | 蘋果、柑橘及香蕉的組合，不把水果限為一種。 |
| 12 | n5／concrete | お茶／おちゃ／茶 | `stage0-day6:お茶` | `tea.svg` | 無柄茶杯內淡綠茶、旁有茶葉，與咖啡豆區分。 |
| 13 | n5／concrete | 水／みず／水 | `stage0-day6:水` | `water.svg` | 水滴與透明水杯，不用顏色文字辨識。 |
| 14 | n5／concrete | お酒／おさけ／酒 | `stage0-day6:お酒` | `alcohol.svg` | 酒壺與小酒杯作飲酒文化的具體一例，不表示所有瓶裝飲料。 |
| 15 | n5／concrete | 映画／えいが／電影 | `stage0-day6:映画` | `movie.svg` | 電影放映機投向銀幕，表作品放映。 |
| 16 | n5／concrete | 音楽／おんがく／音樂 | `stage0-day6:音楽` | `music.svg` | 音符與樂譜五線的非文字符號，輔助音樂概念。 |
| 17 | n5／concrete | 喫茶店／きっさてん／咖啡店 | `stage0-day6:喫茶店` | `cafe.svg` | 小店遮棚、窗內咖啡杯與座椅，與餐廳多座餐盤區分。 |
| 18 | n5／concrete | 葉書／はがき／明信片 | `stage0-day7:葉書` | `postcard.svg` | 開放明信片一側圖景、一側地址線，不是信封。 |
| 19 | n5／concrete | 荷物／にもつ／行李、貨物 | `stage0-day7:荷物` | `luggage.svg` | 有拉桿、提把及輪子的行李箱。 |
| 20 | n5／concrete | お金／おかね／錢 | `stage0-day7:お金` | `money.svg` | 沒有貨幣文字的紙鈔與硬幣組合。 |
| 21 | n5／concrete | ちゃわん／ちゃわん／飯碗、茶碗 | `stage0-day7:ちゃわん` | `ricebowl.svg` | 飯碗的器形與高碗足，和既有盤子、杯子分開。 |
| 22 | n5／concrete | カップ／カップ／有握把的杯子 | `stage0-day7:カップ` | `handledcup.svg` | 清楚的大握把與空杯身，區別無柄コップ；先前暫緩項本批獨立設計。 |
| 23 | n5／concrete | 紅茶／こうちゃ／紅茶 | `stage0-day7:紅茶` | `blacktea.svg` | 茶杯琥珀茶湯與吊掛茶包，區別咖啡及綠茶。 |
| 24 | n5／concrete | 砂糖／さとう／砂糖 | `stage0-day7:砂糖` | `sugar.svg` | 數顆方糖與匙上的糖粒，不套鹽瓶。 |
| 25 | n5／concrete | 塩／しお／鹽 | `stage0-day7:塩` | `salt.svg` | 有孔蓋的調味罐撒出細粒，作食鹽的一例；不畫方糖。 |
| 26 | n5／concrete | しょうゆ／しょうゆ／醬油 | `stage0-day7:しょうゆ` | `soysauce.svg` | 調味瓶、壺嘴與深色醬汁滴入小碟，不是普通水瓶。 |
| 27 | n5／concrete | バター／バター／奶油 | `stage0-day7:バター` | `butter.svg` | 刀切一角的奶油塊置於淺盤。 |
| 28 | n5／concrete | お菓子／おかし／點心、糖果餅乾 | `stage0-day7:お菓子` | `snacks.svg` | 餅乾與小蛋糕組合，不限於既有飴的糖果形狀。 |
| 29 | n5／concrete | ギター／ギター／吉他 | `stage0-day9:ギター` | `guitar.svg` | 有音孔、腰身、琴頸及弦的吉他。 |
| 30 | n5／concrete | 絵／え／畫 | `stage0-day9:絵` | `painting.svg` | 畫架上的原創山景、旁邊畫筆，區別照片的相框／相機。 |
| 31 | n5／concrete | 家／いえ／家、房子 | `stage0-day10:家` | `home.svg` | 屋頂、窗與門的獨立住宅外觀。 |
| 32 | n5／concrete | 庭／にわ／庭院 | `stage0-day10:庭` | `garden.svg` | 圍籬內花圃、步道與樹的住宅庭院一例。 |
| 33 | n5／concrete | 台所／だいどころ／廚房 | `stage0-day10:台所` | `kitchen.svg` | 流理台、水槽及爐具，不是一般房間。 |
| 34 | n5／concrete | ベッド／ベッド／床 | `stage0-day10:ベッド` | `bed.svg` | 空床、枕頭、床腳，與睡覺動作分開。 |
| 35 | n5／concrete | 本棚／ほんだな／書架 | `stage0-day10:本棚` | `bookshelf.svg` | 多層書架與直立書本，不是單本書。 |
| 36 | n5／concrete | ストーブ／ストーブ／暖爐 | `stage0-day10:ストーブ` | `heater.svg` | 帶護網與熱輻射線的暖爐，避免畫成烹飪爐。 |
| 37 | n5／concrete | テーブル／テーブル／桌子（餐桌、茶几） | `stage0-day10:テーブル` | `table.svg` | 圓形餐桌／茶几，不同於有抽屜的書桌。 |
| 38 | n5／concrete | 箱／はこ／箱子 | `stage0-day10:箱` | `boxobject.svg` | 立方紙箱與可見上方開口，不限定大小比較。 |
| 39 | n5／concrete | 鳥／とり／鳥 | `stage0-day10:鳥` | `bird.svg` | 有喙、翅膀及細腳的鳥，與飛行動作分開。 |
| 40 | n5／concrete | 雨／あめ／雨 | `stage0-day12:雨` | `rain.svg` | 雲下連續雨滴，表雨而非命令。 |
| 41 | n5／concrete | 雪／ゆき／雪 | `stage0-day12:雪` | `snow.svg` | 雲下六角雪晶，與雨滴區分。 |
| 42 | n5／concrete | 風／かぜ／風 | `stage0-day12:風` | `wind.svg` | 彎曲的氣流推動樹葉，和單純陰天分開。 |
| 43 | n5／concrete | 曇り／くもり／陰天 | `stage0-day12:曇り` | `cloudy.svg` | 多層厚雲遮住天空，不帶降雨線。 |
| 44 | n5／concrete | 晴れ／はれ／晴天 | `stage0-day12:晴れ` | `sunny.svg` | 大太陽與放射光線，無陰雲或降雨。 |
| 45 | n5／concrete | 空／そら／天空 | `stage0-day12:空` | `sky.svg` | 廣闊天空上部與低地平線，飛鳥和薄雲提示天空義；不套から空的。 |
| 46 | n5／concrete | 海／うみ／海 | `stage0-day12:海` | `sea.svg` | 開闊地平線與多列波浪，不帶河岸。 |
| 47 | n5／concrete | 川／かわ／河、川 | `stage0-day12:川` | `river.svg` | 兩岸間蜿蜒水道，區別海與池塘。 |
| 48 | n5／concrete | 池／いけ／池塘 | `stage0-day12:池` | `pond.svg` | 封閉岸線圍起水面，荷葉與石頭作尺度。 |
| 49 | n5／concrete | 木／き／樹、木頭 | `stage0-day12:木` | `tree.svg` | 可見樹幹與枝葉的單棵樹，表樹木義，不套木材用法。 |
| 50 | n5／concrete | 春／はる／春天 | `stage0-day12:春` | `spring.svg` | 嫩芽、開花枝與草地，表春季的一例。 |
| 51 | n5／concrete | 夏／なつ／夏天 | `stage0-day12:夏` | `summer.svg` | 強陽光、遮陽帽及西瓜切片的夏季情境。 |
| 52 | n5／concrete | 秋／あき／秋天 | `stage0-day12:秋` | `autumn.svg` | 落葉樹與飄落葉片，無雪景。 |
| 53 | n5／concrete | 冬／ふゆ／冬天 | `stage0-day12:冬` | `winter.svg` | 積雪屋頂與雪人、圍巾，表冬季。 |
| 54 | n5／concrete | 靴下／くつした／襪子 | `stage0-day13:靴下` | `socks.svg` | 一對有襪口與腳跟的襪子，不畫成鞋。 |
| 55 | n5／concrete | ネクタイ／ネクタイ／領帶 | `stage0-day13:ネクタイ` | `necktie.svg` | 菱形領帶與打結，不是圍巾。 |
| 56 | n5／concrete | シャツ／シャツ／襯衫、T 恤 | `stage0-day13:シャツ` | `shirt.svg` | 短袖T恤作衣服的一例；不另為服／洋服重畫。 |
| 57 | n5／concrete | ワイシャツ／ワイシャツ／（西裝用的）白襯衫 | `stage0-day13:ワイシャツ` | `dressshirt.svg` | 白色長袖、翻領與前排鈕扣，與T恤區分。 |
| 58 | n5／concrete | セーター／セーター／毛衣 | `stage0-day13:セーター` | `sweater.svg` | 長袖毛衣與針織紋路、羅紋下襬。 |
| 59 | n5／concrete | スカート／スカート／裙子 | `stage0-day13:スカート` | `skirt.svg` | 腰帶下展開的裙襬與褶線。 |
| 60 | n5／concrete | ズボン／ズボン／褲子 | `stage0-day13:ズボン` | `trousers.svg` | 腰部連接兩條褲管，區別裙子。 |
| 61 | n5／concrete | コート／コート／外套、大衣 | `stage0-day13:コート` | `coat.svg` | 長外套、翻領與口袋，下襬延至膝部。 |
| 62 | n5／concrete | ハンカチ／ハンカチ／手帕 | `stage0-day13:ハンカチ` | `handkerchief.svg` | 折起一角、帶細邊的手帕，不寫字。 |
| 63 | n5／concrete | ポケット／ポケット／口袋 | `stage0-day13:ポケット` | `pocket.svg` | 衣料上突出縫邊的口袋與露出的小筆，焦點在口袋。 |
| 64 | n5／concrete | 映画館／えいがかん／電影院 | `stage0-day13:映画館` | `cinema.svg` | 銀幕前成排座椅，與放映作品的電影圖分開。 |
| 65 | n5／concrete | プール／プール／游泳池 | `stage0-day13:プール` | `pool.svg` | 矩形泳池、分水道與下水梯，區別天然池塘。 |
| 66 | n5／concrete | 町／まち／城鎮、街區 | `stage0-day13:町` | `town.svg` | 密集街道與多幢房屋構成街區，不只一棟房。 |
| 67 | n5／concrete | 村／むら／村子 | `stage0-day13:村` | `village.svg` | 稀疏小屋與農田、樹木形成村落。 |
| 68 | n5／concrete | 店／みせ／商店 | `stage0-day13:店` | `shop.svg` | 有開放櫥窗、陳列物與遮棚的小店。 |
| 69 | n5／concrete | 八百屋／やおや／蔬果店 | `stage0-day13:八百屋` | `greengrocer.svg` | 店前陳列葉菜、胡蘿蔔及水果，表蔬果店。 |
| 70 | n5／concrete | 写真／しゃしん／照片 | `stage0-day14:写真` | `photograph.svg` | 有相紙留白邊框的照片，與畫架上的繪畫區分。 |
| 71 | n5／concrete | 道／みち／路 | `stage0-day14:道` | `road.svg` | 向地平線延伸的道路及路線標記。 |
| 72 | n5／concrete | 角／かど／轉角 | `stage0-day14:角` | `corner.svg` | 兩面建築相交的外角，以轉彎的路線突顯轉角。 |
| 73 | n5／concrete | 交差点／こうさてん／十字路口 | `stage0-day14:交差点` | `crossroads.svg` | 俯視十字路口與四條斑馬線。 |
| 74 | n5／concrete | 交番／こうばん／派出所 | `stage0-day14:交番` | `policebox.svg` | 小型派出所外觀配警帽與巡邏腳踏車線索，沒有警字。 |
| 75 | n5／concrete | 医者／いしゃ／醫生 | `stage0-day15:医者` | `doctor.svg` | 白袍人物、聽診器與病歷夾，不限性別。 |
| 76 | n5／concrete | 警官／けいかん／警察 | `stage0-day15:警官` | `policeofficer.svg` | 制服帽、徽章與指揮手勢，作警察職業一例。 |
| 77 | n5／concrete | 大学／だいがく／大學 | `stage0-day15:大学` | `university.svg` | 校舍前有學士帽，區別既有一般學校。 |
| 78 | n5／concrete | 宿題／しゅくだい／作業 | `stage0-day15:宿題` | `homework.svg` | 學生在住宅桌前寫作業、旁有書包，區別課堂考試。 |
| 79 | n5／concrete | テスト／テスト／考試 | `stage0-day15:テスト` | `exam.svg` | 考卷上的多個選項圈與作答筆、時鐘，不寫題目或答案字。 |
| 80 | n5／concrete | アパート／アパート／公寓 | `stage0-day15:アパート` | `apartment.svg` | 低層集合住宅、外走廊與多個住戶入口。 |
| 81 | n5／concrete | ホテル／ホテル／飯店 | `stage0-day15:ホテル` | `hotel.svg` | 多層建物與入口前行李車、床圖示，表旅宿。 |
| 82 | n5／concrete | シャワー／シャワー／淋浴 | `stage0-day16:シャワー` | `shower.svg` | 淋浴蓮蓬頭與向下水流。 |
| 83 | n5／concrete | お風呂／おふろ／浴室、泡澡（お風呂に入ります） | `stage0-day16:お風呂` | `bath.svg` | 泡澡浴缸、浴室水龍頭與熱氣，不只有淋浴。 |
| 84 | n5／concrete | 顔／かお／臉 | `stage0-day16:顔` | `face.svg` | 完整臉部輪廓及五官，焦點圈包圍臉而非頭髮。 |
| 85 | n5／concrete | 頭／あたま／頭 | `stage0-day16:頭` | `head.svg` | 包含頭髮及側面輪廓的頭部，箭頭指頭頂。 |
| 86 | n5／concrete | 目／め／眼睛 | `stage0-day16:目` | `eye.svg` | 單一眼睛、眼瞼與瞳孔，沒有視線動作箭頭。 |
| 87 | n5／concrete | 耳／みみ／耳朵 | `stage0-day16:耳` | `ear.svg` | 耳廓與耳道線條，不畫成聽力動作。 |
| 88 | n5／concrete | 口／くち／嘴巴 | `stage0-day16:口` | `mouth.svg` | 嘴唇與張開的口腔，不加說話泡泡。 |
| 89 | n5／concrete | 鼻／はな／鼻子 | `stage0-day16:鼻` | `nose.svg` | 鼻樑與鼻翼的近景，無花朵等はな同音線索。 |
| 90 | n5／concrete | 歯／は／牙齒 | `stage0-day16:歯` | `tooth.svg` | 完整牙冠與雙牙根的牙齒形狀。 |
| 91 | n5／concrete | 手／て／手 | `stage0-day16:手` | `hand.svg` | 張開的手掌與五指。 |
| 92 | n5／concrete | 足／あし／腳、腿 | `stage0-day16:足` | `foot.svg` | 裸腳、腳趾與腳踝，非鞋子。 |
| 93 | n5／concrete | 体／からだ／身體 | `stage0-day16:体` | `body.svg` | 完整人體輪廓與軀幹，不單指臉或手。 |
| 94 | n5／concrete | おなか／おなか／肚子 | `stage0-day16:おなか` | `belly.svg` | 軀幹腹部用圓圈與指向線聚焦，沒有飢餓食物。 |
| 95 | n5／concrete | 薬／くすり／藥 | `stage0-day17:薬` | `medicine.svg` | 膠囊、藥片與藥瓶，不畫成甜食。 |
| 96 | n5／concrete | 電気／でんき／電、燈 | `stage0-day17:電気` | `electricity.svg` | 插頭與亮燈構成通電的具體一例，不套天候閃電。 |
| 97 | n5／concrete | カレンダー／カレンダー／月曆 | `stage0-day19:カレンダー` | `calendar.svg` | 無數字月曆的格子與裝訂環，不代替某一天日期。 |
| 98 | n5／concrete | 切符／きっぷ／車票 | `stage0-day19:切符` | `ticket.svg` | 有驗票孔及虛線的車票，無文字金額。 |
| 99 | n5／concrete | 建物／たてもの／建築物 | `stage0-day22:建物` | `building.svg` | 中性多層建築外觀，不帶銀行、醫療等專門符號。 |
| 100 | n5／concrete | 玄関／げんかん／玄關、大門口 | `stage0-day22:玄関` | `entryhall.svg` | 門內落差地坪、鞋子與鞋櫃，聚焦玄關而非向內箭頭。 |
| 101 | n5／concrete | 廊下／ろうか／走廊 | `stage0-day22:廊下` | `corridor.svg` | 透視走廊與兩側房門，無箭頭。 |
| 102 | n5／concrete | 門／もん／大門 | `stage0-day22:門` | `gate.svg` | 獨立雙扇戶外大門與兩門柱，區別房屋門。 |
| 103 | n5／concrete | ポスト／ポスト／郵筒、信箱 | `stage0-day22:ポスト` | `mailbox.svg` | 獨立郵筒、投遞口及信封圖形，不是郵局建築。 |
| 104 | n5／concrete | 紙／かみ／紙 | `stage0-day22:紙` | `paper.svg` | 單張空白紙與折角，不畫成書或試卷。 |
| 105 | n5／concrete | 万年筆／まんねんひつ／鋼筆 | `stage0-day22:万年筆` | `fountainpen.svg` | 可辨識分叉筆尖、筆舌與筆桿，不同於原子筆。 |
| 106 | n5／concrete | マッチ／マッチ／火柴 | `stage0-day22:マッチ` | `matches.svg` | 火柴盒、擦火面及燃著的單根火柴。 |
| 107 | n5／concrete | 灰皿／はいざら／菸灰缸 | `stage0-day22:灰皿` | `ashtray.svg` | 凹槽煙灰缸、少量煙灰與已熄菸蒂，不美化吸菸。 |
| 108 | n5／concrete | スリッパ／スリッパ／拖鞋 | `stage0-day22:スリッパ` | `slippers.svg` | 露出腳跟的室內拖鞋，與包覆鞋子區分。 |
| 109 | n5／concrete | テープレコーダー／テープレコーダー／錄音機 | `stage0-day22:テープレコーダー` | `taperecorder.svg` | 雙卷磁帶艙、喇叭與操作鍵，不混成現代手機。 |
| 110 | n5／concrete | レコード／レコード／唱片 | `stage0-day22:レコード` | `vinylrecord.svg` | 有唱片槽紋的圓盤及中心標籤、唱針。 |
| 111 | n5／concrete | フィルム／フィルム／底片 | `stage0-day22:フィルム` | `filmroll.svg` | 底片卷軸與兩側齒孔，無作品截圖。 |
| 112 | general／concrete | 森／もり／森林 | `general-listening-01:森` | `forest.svg` | 多棵高低樹群，不是單樹或庭園。 |
| 113 | general／concrete | 洞窟／どうくつ／洞窟 | `general-listening-06:洞窟` | `cave.svg` | 岩壁中的黑暗洞口及石塊，不只是門。 |
| 114 | general／concrete | 広場／ひろば／廣場 | `general-listening-04:広場` | `square.svg` | 開放鋪面中央噴泉、周邊長椅與建物，表公共廣場。 |
| 115 | general／concrete | 袋／ふくろ／袋子 | `general-listening-11:袋` | `bagpouch.svg` | 軟袋束口與皺褶，區別硬箱及公事包。 |
| 116 | anime／concrete | 剣／けん／劍 | `anime-lesson-05:剣` | `sword.svg` | 雙刃劍、護手與握柄，無作品專屬造型。 |
| 117 | anime／concrete | 盾／たて／盾牌 | `anime-lesson-05:盾` | `shield.svg` | 手持防禦盾輪廓與中央加固，不帶紋章文字。 |
| 118 | anime／concrete | 弓／ゆみ／弓 | `anime-lesson-05:弓` | `bow.svg` | 弓身、弓弦與搭上的箭，不像音樂豎琴。 |
| 119 | anime／concrete | 槍／やり／槍、長矛 | `anime-lesson-05:槍` | `spear.svg` | 長柄矛與尖刃，不是現代槍械。 |
| 120 | general／concrete | 縄／なわ／繩索 | `general-listening-121:縄` | `rope.svg` | 多圈粗繩與可見交纏末端，不是金屬鏈。 |
| 121 | n5／verb | 働く／はたらく／工作（禮貌形：働きます） | `stage0-day4:働く` | `working.svg` | 人物在辦公桌使用電腦與文件，表工作行為。 |
| 122 | n5／verb | 休む／やすむ／休息、請假（禮貌形：休みます） | `stage0-day4:休む` | `resting.svg` | 放下工作物品後靠坐放鬆，眼睛閉合；非熟睡。 |
| 123 | n5／verb | 勉強／べんきょう／讀書、學習（勉強します） | `stage0-day4:勉強` | `studying.svg` | 人物在桌前閱讀並做筆記，輔助主動學習。 |
| 124 | n5／verb | 終わる／おわる／結束（禮貌形：終わります） | `stage0-day4:終わる` | `finishing.svg` | 最後一塊拼圖放完，完成物件而非只畫終點箭頭。 |
| 125 | n5／verb | 始まる／はじまる／開始（禮貌形：始まります） | `stage0-day4:始まる` | `starting.svg` | 第一顆骨牌剛推動，後面仍直立，表開始發生。 |
| 126 | n5／verb | 行く／いく／去（禮貌形：行きます） | `stage0-day5:行く` | `going.svg` | 從近處人物所在位置沿路走向遠方，箭頭離開近處焦點。 |
| 127 | n5／verb | 来る／くる／來（禮貌形：来ます） | `stage0-day5:来る` | `coming.svg` | 遠方人物走向近處等待者，箭頭朝近處焦點，與行く相反。 |
| 128 | n5／verb | 帰る／かえる／回去、回家（禮貌形：帰ります） | `stage0-day5:帰る` | `returnhome.svg` | 人物回到住宅，回返彎箭頭連結原先出發處與家門。 |
| 129 | n5／verb | 着く／つく／抵達（禮貌形：着きます） | `stage0-day5:着く` | `arriving.svg` | 帶行李的人已走到目的地門前，路線止於腳邊。 |
| 130 | n5／verb | 見る／みる／看（禮貌形：見ます） | `stage0-day6:見る` | `looking.svg` | 眼睛注視遠處風景框，表看而非讀書。 |
| 131 | n5／verb | 聞く／きく／聽、問（禮貌形：聞きます） | `stage0-day6:聞く` | `listening.svg` | 人物手靠耳邊接收聲波，限定聽義，不作詢問義。 |
| 132 | n5／verb | 買い物／かいもの／購物（買い物します） | `stage0-day6:買い物` | `shopping.svg` | 商店貨架前推購物車選物，區別已有付款購買圖。 |
| 133 | n5／verb | あげる／あげる／給（禮貌形：あげます） | `stage0-day7:あげる` | `giving.svg` | 焦點在左側給予者，禮物向右交給他人；不是歸還。 |
| 134 | n5／verb | もらう／もらう／收到、得到（禮貌形：もらいます） | `stage0-day7:もらう` | `receiving.svg` | 焦點在右側接受者，物件向自己而來；與給出主語相反。 |
| 135 | n5／verb | 貸す／かす／借出、借給別人（禮貌形：貸します） | `stage0-day7:貸す` | `lending.svg` | 焦點在借出者，交付後有時鐘與返還方向提示借貸。 |
| 136 | n5／verb | 借りる／かりる／借入（禮貌形：借ります） | `stage0-day7:借りる` | `borrowing.svg` | 焦點在借入者，接收暫借物品，附返還路線。 |
| 137 | n5／verb | 教える／おしえる／教、告訴（禮貌形：教えます） | `stage0-day7:教える` | `teaching.svg` | 左側主動指向板上圖形、學生觀看，表教導。 |
| 138 | n5／verb | 習う／ならう／學習（跟人學，禮貌形：習います） | `stage0-day7:習う` | `learningfrom.svg` | 焦點框在接受老師示範的學習者，與教える方向相反。 |
| 139 | n5／verb | 出す／だす／寄出、拿出、交出（手紙を出します） | `stage0-day7:出す` | `sending.svg` | 手把信封送入郵筒，限定原課手紙を出す的寄出義。 |
| 140 | n5／verb | 弾く／ひく／彈（吉他、鋼琴；禮貌形：弾きます） | `stage0-day9:弾く` | `playingguitar.svg` | 人物抱吉他，一手按琴頸一手撥弦，不只是樂器。 |
| 141 | n5／verb | 散歩／さんぽ／散步（散歩します） | `stage0-day9:散歩` | `strolling.svg` | 人物在樹旁輕鬆遛狗，表散步目的而非跑步。 |
| 142 | n5／verb | 旅行／りょこう／旅行（旅行します） | `stage0-day9:旅行` | `travelling.svg` | 背包旅人、行李與遠方山景，表出遊而非單純步行。 |
| 143 | n5／verb | 遊ぶ／あそぶ／玩（禮貌形：遊びます） | `stage0-day9:遊ぶ` | `playing.svg` | 兩人互丟球的活動，沒有單純站在一起。 |
| 144 | n5／verb | 作る／つくる／做、製作（禮貌形：作ります） | `stage0-day9:作る` | `making.svg` | 手把積木組合成屋形，表製作過程。 |
| 145 | n5／verb | 分かる／わかる／懂、明白（禮貌形：分かります） | `stage0-day9:分かる` | `understanding.svg` | 看過的拼圖片形在思考泡泡中正確相合，表理解契合，不用問號。 |
| 146 | n5／verb | 答える／こたえる／回答（禮貌形：答えます） | `stage0-day9:答える` | `answering.svg` | 提問者與回答者的對向泡泡，以圖形拼合回覆，不寫文字。 |
| 147 | n5／verb | 売る／うる／賣（禮貌形：売ります） | `stage0-day13:売る` | `selling.svg` | 焦點在櫃檯後的店員，交出商品、收取硬幣。 |
| 148 | n5／verb | 持つ／もつ／拿、帶著（て形：持って） | `stage0-day14:持つ` | `holding.svg` | 人物手中提著袋子、姿態穩定，沒有交付箭頭。 |
| 149 | n5／verb | 呼ぶ／よぶ／叫、呼喚（て形：呼んで） | `stage0-day14:呼ぶ` | `calling.svg` | 人物手靠嘴，聲波朝遠方另一人，表呼喚。 |
| 150 | n5／verb | 使う／つかう／使用（て形：使って） | `stage0-day14:使う` | `using.svg` | 手以剪刀實際剪紙，表使用工具的一例。 |
| 151 | n5／verb | 押す／おす／推、按（て形：押して） | `stage0-day14:押す` | `pushing.svg` | 人物雙手向前推動箱子，箭頭朝離開自己方向。 |
| 152 | n5／verb | 引く／ひく／拉（て形：引いて） | `stage0-day14:引く` | `pulling.svg` | 人物拉繩把箱子拖向自己，與推方向及接觸方式不同。 |
| 153 | n5／verb | 消す／けす／關掉、消除（て形：消して） | `stage0-day14:消す` | `switchingoff.svg` | 手按關燈開關、燈已暗，表主動關掉而非單純暗。 |
| 154 | n5／verb | つける／つける／打開（電器）、開（燈）（て形：つけて） | `stage0-day14:つける` | `switchingon.svg` | 手按開關讓燈發光，表主動開燈。 |
| 155 | n5／verb | 入れる／いれる／放入（て形：入れて） | `stage0-day14:入れる` | `puttingin.svg` | 手將小球放進容器，焦點是物件進入，不是人進門。 |
| 156 | n5／verb | 取る／とる／拿取（て形：取って） | `stage0-day14:取る` | `taking.svg` | 手由置物架拿走一顆球，沒有相機或給予者。 |
| 157 | n5／verb | 見せる／みせる／給…看（て形：見せて） | `stage0-day14:見せる` | `showing.svg` | 人物把照片朝向另一位觀看者，表給人看而非遞送。 |
| 158 | n5／verb | 言う／いう／說（て形：言って） | `stage0-day14:言う` | `saying.svg` | 一人對外發出短語泡泡，與兩人交談構圖區分。 |
| 159 | n5／verb | 話す／はなす／說話、談（て形：話して） | `stage0-day14:話す` | `talking.svg` | 兩人面對面交談，各有輪替的對話泡泡，不畫成單向喊叫。 |
| 160 | n5／verb | 曲がる／まがる／轉彎（て形：曲がって） | `stage0-day14:曲がる` | `turning.svg` | 俯視路線遇轉角後彎向另一條路，不作再一次回返。 |
| 161 | n5／verb | 渡る／わたる／過（橋、馬路）（て形：渡って） | `stage0-day14:渡る` | `crossing.svg` | 人物沿斑馬線跨越道路，區別交給他人的渡す。 |
| 162 | n5／verb | 乗る／のる／搭乘（て形：乗って） | `stage0-day14:乗る` | `boarding.svg` | 人物從站台踏入車門，方向朝車內，不只是車輛。 |
| 163 | n5／verb | 降りる／おりる／下（車）（て形：降りて） | `stage0-day14:降りる` | `alighting.svg` | 人物由車門跨下車至站台，與搭乘方向相反。 |
| 164 | n5／verb | 止まる／とまる／停下（て形：止まって） | `stage0-day14:止まる` | `stopping.svg` | 腳印在停止線前終止，人物站定，無禁止手勢。 |
| 165 | n5／verb | 住む／すむ／住（て形：住んで） | `stage0-day15:住む` | `livingin.svg` | 住宅內可見日常人物與家具，強調居住狀態而非抵達。 |
| 166 | anime／verb | 救う／すくう／救援、拯救 | `anime-lesson-03:救う` | `rescuing.svg` | 岸上人物伸手把落水者拉出水面，表救援，不是一般交物。 |
| 167 | anime／verb | 逃げる／にげる／逃跑、逃避 | `anime-lesson-02:逃げる` | `escaping.svg` | 人物離開身後落石危險，方向遠離威脅；不是普通跑步。 |
| 168 | n5／verb | 置く／おく／放置（て形：置いて） | `stage0-day15:置く` | `placing.svg` | 手將盒子放到桌面、箭頭向下，區別把物件放入容器。 |
| 169 | n5／verb | 忘れる／わすれる／忘記（て形：忘れて） | `stage0-day15:忘れる` | `forgetting.svg` | 離開的人把雨傘留在長椅旁，表忘記攜物一例，不是已發現遺失。 |
| 170 | n5／verb | 覚える／おぼえる／記住（て形：覚えて） | `stage0-day15:覚える` | `remembering.svg` | 合起書後，思考泡泡中仍有同一星形圖案，表記住。 |
| 171 | n5／verb | 洗濯／せんたく／洗衣服（洗濯します） | `stage0-day16:洗濯` | `laundry.svg` | 洗衣機內衣物及旁邊洗衣籃，表洗衣。 |
| 172 | n5／verb | 掃除／そうじ／打掃（掃除します） | `stage0-day16:掃除` | `cleaning.svg` | 人物用掃帚把灰塵掃向畚箕。 |
| 173 | n5／verb | 脱ぐ／ぬぐ／脫（て形：脱いで） | `stage0-day16:脱ぐ` | `undressing.svg` | 人物把上衣從肩膀向外拉開，表脫下，不是拿衣展示。 |
| 174 | n5／verb | 着る／きる／穿（上衣）（て形：着て） | `stage0-day16:着る` | `dressing.svg` | 人物將上衣穿上肩膀，箭頭朝向身體，與脫下相反。 |
| 175 | n5／verb | 磨く／みがく／刷、擦亮（歯を磨きます） | `stage0-day16:磨く` | `brushingteeth.svg` | 人物用牙刷刷牙，限定原課歯を磨く，不套磨刀義。 |
| 176 | n5／verb | 切る／きる／切、剪、掛斷（て形：切って） | `stage0-day16:切る` | `cutting.svg` | 剪刀剪開紙張，限定剪切義，不套掛斷電話。 |
| 177 | n5／verb | 飛ぶ／とぶ／飛（禮貌形：飛びます） | `stage0-day18:飛ぶ` | `flying.svg` | 展翼的鳥離地飛行，雲與空中動線區別鳥的名詞圖。 |
| 178 | n5／verb | 登る／のぼる／爬（山）（禮貌形：登ります） | `stage0-day18:登る` | `climbing.svg` | 人物攀登有坡度的山路，手腳朝上，非一般平地走路。 |
| 179 | n5／verb | 並ぶ／ならぶ／排隊、並排（禮貌形：並びます） | `stage0-day24:並ぶ` | `queuing.svg` | 數人依同一方向排隊等候窗口，不是散站。 |
| 180 | n5／verb | 貼る／はる／貼（禮貌形：貼ります） | `stage0-day24:貼る` | `sticking.svg` | 手把郵票壓貼到信封角落，表示黏貼動作。 |
| 181 | n5／adjective | 新しい／あたらしい／新的 | `stage0-day8:新しい` | `new.svg` | 新舊椅子對比，焦點箭頭指向沒有磨損的新椅子，不作人的年紀。 |
| 182 | n5／adjective | 古い／ふるい／舊的（不用在人的年紀） | `stage0-day8:古い` | `old.svg` | 對比同類椅子，箭頭指有裂痕與磨損者；非高齡的人。 |
| 183 | n5／adjective | 高い／たかい／高的、貴的 | `stage0-day8:高い` | `tall.svg` | 高低建物比較，尺線聚焦高度義；不套用價格昂貴義。 |
| 184 | n5／adjective | 安い／やすい／便宜的 | `stage0-day8:安い` | `inexpensive.svg` | 同一物品的價籤，一枚硬幣對比多枚硬幣；不表示物品矮。 |
| 185 | n5／adjective | 低い／ひくい／低的、矮的 | `stage0-day8:低い` | `low.svg` | 聚焦兩棟建物中低者，保持高度而非價格概念。 |
| 186 | n5／adjective | 広い／ひろい／寬廣的 | `stage0-day8:広い` | `spacious.svg` | 兩面牆間距大、中央人物所占比例小，表寬敞。 |
| 187 | n5／adjective | 狭い／せまい／狹窄的 | `stage0-day8:狭い` | `cramped.svg` | 近距離牆壁夾住人物可活動空間，與寬敞構圖分別。 |
| 188 | n5／adjective | おいしい／おいしい／好吃的 | `stage0-day8:おいしい` | `delicious.svg` | 人物品嚐食物後露出享受表情，保留食物與反應，不只笑臉。 |
| 189 | n5／adjective | まずい／まずい／難吃的 | `stage0-day8:まずい` | `unpalatable.svg` | 人物嚐食後皺眉、身體退開，旁仍有同一碗食物。 |
| 190 | n5／adjective | 辛い／からい／辣的、鹹的 | `stage0-day8:辛い` | `spicy.svg` | 辣椒與品嚐者流汗、張口的微情境，限定辣味，不當辛苦。 |
| 191 | n5／adjective | 楽しい／たのしい／開心的、愉快的 | `stage0-day8:楽しい` | `enjoyable.svg` | 兩人在桌遊情境一起笑，表愉快感受，不是單純一張笑臉。 |
| 192 | n5／adjective | つまらない／つまらない／無聊的 | `stage0-day8:つまらない` | `boring.svg` | 人物托腮面對無變化的活動、無精打采，表無聊。 |
| 193 | n5／adjective | おもしろい／おもしろい／有趣的 | `stage0-day8:おもしろい` | `interesting.svg` | 人物好奇注視運轉玩具、眼神專注，輔助有趣而非純開心。 |
| 194 | n5／adjective | 難しい／むずかしい／困難的 | `stage0-day8:難しい` | `difficult.svg` | 人物面對複雜迷宮停在多分岔處，與容易的直通路對比。 |
| 195 | n5／adjective | 易しい／やさしい／容易的、簡單的 | `stage0-day8:易しい` | `easy.svg` | 簡短清楚路徑直達出口，人物輕鬆完成，非只勾號。 |
| 196 | n5／adjective | きれい／きれい／漂亮的、乾淨的（な形容詞） | `stage0-day8:きれい` | `clean.svg` | 地面與窗戶乾淨有反光，限定整潔義，不套人漂亮義。 |
| 197 | n5／adjective | 有名／ゆうめい／有名的（な形容詞） | `stage0-day8:有名` | `famous.svg` | 聚光燈下的人被多位觀眾認出並朝向，不以單一星形代替。 |
| 198 | n5／adjective | 便利／べんり／方便的（な形容詞） | `stage0-day8:便利` | `convenient.svg` | 人物在桌邊伸手即可拿到整理架上的工具，呈方便取用一例。 |
| 199 | n5／adjective | 好き／すき／喜歡（な形容詞） | `stage0-day9:好き` | `liking.svg` | 人物親近手中物品並以心形表達喜愛，限定正向偏好。 |
| 200 | n5／adjective | 嫌い／きらい／討厭（な形容詞） | `stage0-day9:嫌い` | `disliking.svg` | 人物轉頭並把不喜歡的食物推遠，表偏好而非禁止他人。 |
| 201 | n5／adjective | 上手／じょうず／擅長、很會（な形容詞） | `stage0-day9:上手` | `skilled.svg` | 熟練人物把球準確投入籃框，表技能非運氣單一勝利。 |
| 202 | n5／adjective | 下手／へた／不擅長、不太會（な形容詞） | `stage0-day9:下手` | `unskilled.svg` | 同類投球情境球偏離籃框、動作不協調，限制技能義。 |
| 203 | n5／adjective | 元気／げんき／有精神、健康（な形容詞） | `stage0-day9:元気` | `energetic.svg` | 健康人物挺立伸展，活動有精神；不等於獲勝。 |
| 204 | n5／adjective | 賑やか／にぎやか／熱鬧的（な形容詞） | `stage0-day9:賑やか` | `lively.svg` | 市集多人聊天與攤位，熱鬧而非一人吵鬧。 |
| 205 | n5／adjective | 暑い／あつい／熱的（天氣、氣溫） | `stage0-day12:暑い` | `hotweather.svg` | 烈日下人物搧扇流汗，天候熱義，不套燙物。 |
| 206 | n5／adjective | 熱い／あつい／燙的（東西、水） | `stage0-day12:熱い` | `hotobject.svg` | 手接觸冒熱氣的杯子後縮回，表物體燙。 |
| 207 | n5／adjective | 寒い／さむい／冷的（天氣、氣溫） | `stage0-day12:寒い` | `coldweather.svg` | 雪中人物裹緊圍巾發抖，區別冷水觸感。 |
| 208 | n5／adjective | 涼しい／すずしい／涼爽的 | `stage0-day12:涼しい` | `coolweather.svg` | 微風下人物舒展、輕衣無發抖流汗，表涼爽。 |
| 209 | n5／adjective | 暖かい／あたたかい／溫暖的 | `stage0-day12:暖かい` | `warmweather.svg` | 溫和陽光下人物舒適站立、花草作春暖線索，非燙杯。 |
| 210 | n5／adjective | 早い／はやい／早的 | `stage0-day12:早い` | `early.svg` | 日出時人已準備起身、床尚整齊，表早而不是速度快。 |
| 211 | n5／adjective | 速い／はやい／快的（速度） | `stage0-day12:速い` | `fast.svg` | 同向車輛一輛明顯前進、短動線，速度概念不與早混合。 |
| 212 | n5／adjective | 遅い／おそい／晚的、慢的 | `stage0-day12:遅い` | `late.svg` | 人帶著行李趕到時車已駛遠，限定時間晚／遲到，不套慢速義。 |
| 213 | n5／adjective | 遠い／とおい／遠的 | `stage0-day12:遠い` | `far.svg` | 近處人物與遠端小屋之間隔長路及多段距離，表遠。 |
| 214 | n5／adjective | 強い／つよい／強的 | `stage0-day12:強い` | `strong.svg` | 人穩定舉起多片重量的槓鈴，限定力量強。 |
| 215 | n5／adjective | 弱い／よわい／弱的 | `stage0-day12:弱い` | `weak.svg` | 人物連輕量槓鈴也抬不起、膝彎手垂，限定力量弱。 |
| 216 | n5／adjective | 痛い／いたい／痛的 | `stage0-day17:痛い` | `painful.svg` | 手扶受傷膝、周圍疼痛放射線，表疼痛狀態。 |
| 217 | n5／adjective | 丈夫／じょうぶ／結實、堅固（な形容詞） | `stage0-day17:丈夫` | `sturdy.svg` | 椅子承受重箱仍完整，支架結構清楚，限定物品堅固。 |
| 218 | n5／adjective | 危ない／あぶない／危險的 | `stage0-day17:危ない` | `dangerous.svg` | 人在缺板吊橋前停下，下方裂隙可見，危險來自情境非禁止標籤。 |
| 219 | n5／adjective | うるさい／うるさい／吵的、煩人的 | `stage0-day24:うるさい` | `noisy.svg` | 鑽孔工具發出聲波，旁人摀耳，表吵鬧而非要求安靜。 |
| 220 | n5／adjective | 厚い／あつい／厚的 | `stage0-day25:厚い` | `thick.svg` | 同尺寸板片比較厚度，箭頭聚焦厚板側面。 |
| 221 | n5／adjective | 薄い／うすい／薄的、淡的 | `stage0-day25:薄い` | `thin.svg` | 聚焦薄片相對厚板的厚度，限定物理薄，不套味道淡。 |
| 222 | n5／adjective | 丸い／まるい／圓的 | `stage0-day19:丸い` | `round.svg` | 圓球與方塊對比，指向圓形曲線，非所有小球名詞。 |
| 223 | n5／adjective | 太い／ふとい／粗的、胖的 | `stage0-day19:太い` | `thickdiameter.svg` | 粗細樹枝比較橫截徑，限定粗的，不評人物胖瘦。 |
| 224 | n5／adjective | 細い／ほそい／細的、瘦的 | `stage0-day19:細い` | `slender.svg` | 同類樹枝比較，聚焦細枝，與板片厚薄分別。 |
| 225 | n5／adjective | 暇／ひま／有空的、閒暇（な形容詞） | `stage0-day19:暇` | `freeleisure.svg` | 人物空閒靠坐、桌面無工作且旁有放鬆茶杯，非疲倦睡覺。 |
| 226 | general／adjective | 眠い／ねむい／想睡的 | `general-listening-03:眠い` | `sleepy.svg` | 坐著的人眼皮低垂、打呵欠，區別已躺下睡著。 |
| 227 | n5／relation | 上／うえ／上面 | `stage0-day10:上` | `above.svg` | 球在箱子頂上，表上方位置。 |
| 228 | n5／relation | 下／した／下面 | `stage0-day10:下` | `below.svg` | 球在高腳桌下，與上方對照。 |
| 229 | n5／relation | 中／なか／裡面 | `stage0-day10:中` | `inside.svg` | 開放剖視容器內有球，表裡面。 |
| 230 | n5／relation | 外／そと／外面 | `stage0-day10:外` | `outside.svg` | 球明確在容器邊界之外，容器內空。 |
| 231 | n5／relation | 隣／となり／隔壁、旁邊（相鄰的同類東西） | `stage0-day10:隣` | `adjacent.svg` | 兩棟同類房屋相鄰，只隔短圍籬，限定相鄰關係。 |
| 232 | n5／relation | 右／みぎ／右邊 | `stage0-day10:右` | `right.svg` | 從觀看者方向，三物件中的右側物件被圈選。 |
| 233 | n5／relation | 左／ひだり／左邊 | `stage0-day10:左` | `left.svg` | 從觀看者方向圈選左側物件，箭頭向左。 |
| 234 | n5／relation | 前／まえ／前面 | `stage0-day10:前` | `infront.svg` | 側面車頭朝右，球在車頭前，限定空間前方。 |
| 235 | n5／relation | 後ろ／うしろ／後面 | `stage0-day10:後ろ` | `behind.svg` | 同一側面車向右，球在車尾後，限定空間後方。 |
| 236 | n5／quantity | 半分／はんぶん／一半 | `stage0-day11:半分` | `half.svg` | 圓餅切為相同兩半，其中一半移開，表示二分之一。 |
| 237 | n5／quantity | 全部／ぜんぶ／全部 | `stage0-day17:全部` | `all.svg` | 框線包住三種物品的整個集合，不是只增加數量。 |
| 238 | general／quantity | 一部／いちぶ／一部分 | `general-listening-05:一部` | `part.svg` | 三物品中只有一個被框起，表集合中的部分。 |
| 239 | general／adverb | 最初／さいしょ／最初 | `general-listening-38:最初` | `first.svg` | 三步相連的路徑，箭頭圈選起始第一個位置，非最後。 |
| 240 | general／adverb | 最後／さいご／最後 | `general-listening-38:最後` | `last.svg` | 同一路徑圈選最末端，與第一次／再一次區別。 |
| 241 | anime／concrete | 戦士／せんし／戰士 | `anime-lesson-01:戦士` | `warrior.svg` | 持盾、頭盔及護甲的中性戰士，不採作品人物造型。 |
| 242 | anime／concrete | 飾り／かざり／裝飾；裝飾品 | `anime-lesson-01:飾り` | `decoration.svg` | 懸掛裝飾串與蝴蝶結，表裝飾物而非日常工具。 |
| 243 | anime／verb | 笑う／わらう／笑、微笑；嘲笑（依上下文） | `anime-lesson-03:笑う` | `laughing.svg` | 人物開口笑、身體略彎並扶腹，與靜態喜好心形不同。 |
| 244 | anime／verb | 断る／ことわる／拒絕、婉拒 | `anime-lesson-04:断る` | `refusing.svg` | 另一人遞出邀請紙，接收者以開掌婉拒，不把食物偏好當拒絕。 |
| 245 | anime／abstract | 嘘／うそ／謊言；也可用來表示難以置信 | `anime-lesson-04:嘘` | `lie.svg` | 說者泡泡聲稱花瓶完整，身後同一花瓶卻破裂，以不一致表謊言。 |
| 246 | anime／abstract | 仲間／なかま／同伴、夥伴 | `anime-lesson-04:仲間` | `companions.svg` | 三人配戴同樣徽記、面向共同旗幟，表同一隊伍而非家族。 |
| 247 | anime／abstract | 信じる／しんじる／相信、信任 | `anime-lesson-04:信じる` | `trusting.svg` | 一人閉眼向後傾，另一人張臂承接的信任微情境；非宗教符號。 |
| 248 | anime／verb | 斬る／きる／用刀劍斬、砍 | `anime-lesson-05:斬る` | `slashing.svg` | 人物以長刃斬斷竹段，無血腥，區別剪刀切紙。 |
| 249 | anime／verb | 防ぐ／ふせぐ／防禦、阻止 | `anime-lesson-05:防ぐ` | `blocking.svg` | 人物持盾擋住來箭，焦點為阻擋行為，不僅盾物件。 |
| 250 | anime／verb | 避ける／よける／躲開、閃避 | `anime-lesson-05:避ける` | `dodging.svg` | 人物側身避開落石的落點，限定よける的物理閃避義。 |
| 251 | anime／verb | 守る／まもる／保護、守住；遵守 | `anime-lesson-05:守る` | `protecting.svg` | 人物站在同伴與來物間舉盾保護，限定守護，不套遵守規則。 |
| 252 | anime／verb | 戦う／たたかう／戰鬥、對抗 | `anime-lesson-05:戦う` | `fighting.svg` | 兩人以安全的抽象劍形交鋒，呈對抗動作，無傷害細節。 |
| 253 | anime／abstract | 結界／けっかい／結界、隔開內外的界域 | `anime-lesson-06:結界` | `barrier.svg` | 透明圓頂隔開內外，人安全在內、來物停在界線外。 |
| 254 | anime／abstract | 封印／ふういん／封印；封住 | `anime-lesson-06:封印` | `sealing.svg` | 箱子被交叉封條與封印結扣鎖住，限制內容釋出，不只是關門。 |
| 255 | anime／abstract | 解除／かいじょ／解除、取消、撤除 | `anime-lesson-06:解除` | `unbinding.svg` | 原隔開道路的弧形屏障已打開，人得以通過，表解除限制的一例。 |
| 256 | anime／abstract | 契約／けいやく／契約、約定 | `anime-lesson-06:契約` | `contract.svg` | 兩人共同在文件上簽署，表書面契約；不以日曆約會代替。 |
| 257 | anime／abstract | 証拠／しょうこ／證據 | `anime-lesson-07:証拠` | `evidence.svg` | 泥印與相符鞋底在放大鏡下比對，作支持判斷的證據一例。 |
| 258 | anime／verb | 選ぶ／えらぶ／選擇 | `anime-lesson-07:選ぶ` | `choosing.svg` | 手從三種候選物中指向一件，其餘保留，表選擇。 |
| 259 | anime／verb | 気付く／きづく／注意到、察覺 | `anime-lesson-07:気付く` | `noticing.svg` | 人物看見長椅下原先不顯眼的手套，視線與注意短線聚焦發現。 |
| 260 | anime／concrete | 毒／どく／毒；有害影響 | `anime-lesson-08:毒` | `poison.svg` | 有自繪骷髏危害符號的瓶子，與普通藥瓶區分，無文字。 |
| 261 | general／concrete | 棚／たな／架子 | `general-listening-14:棚` | `shelf.svg` | 壁掛多層置物架與物品，不限書架。 |
| 262 | general／concrete | 壁／かべ／牆壁 | `general-listening-14:壁` | `wall.svg` | 磚牆及立面輪廓，非地面或天花板。 |
| 263 | general／concrete | 床／ゆか／地板 | `general-listening-14:床` | `floor.svg` | 室內地板透視格線，腳落在地面上，非牆壁。 |
| 264 | general／concrete | 工具／こうぐ／工具 | `general-listening-16:工具` | `tools.svg` | 扳手、槌子與工具箱，不是抽象能力。 |
| 265 | general／concrete | 画面／がめん／畫面 | `general-listening-20:画面` | `screen.svg` | 裝置上顯示窗格的矩形畫面，無可讀文字，不把整個端末當詞義。 |
| 266 | general／concrete | 雷／かみなり／雷 | `general-listening-21:雷` | `thunder.svg` | 雷雲與閃電、低頻聲波，表雷。 |
| 267 | general／concrete | 港／みなと／港口 | `general-listening-30:港` | `harbor.svg` | 碼頭、繫船柱與停泊船隻，區別單獨船與海。 |
| 268 | general／concrete | 掲示板／けいじばん／公告欄 | `general-listening-51:掲示板` | `noticeboard.svg` | 裝框佈告板釘上數張紙，無文字；不是單一畫面。 |
| 269 | general／concrete | 電池／でんち／電池 | `general-listening-61:電池` | `battery.svg` | 有正極突出端的電池與兩端接點，不用數字電量。 |
| 270 | general／concrete | 岩／いわ／岩石 | `general-listening-67:岩` | `boulder.svg` | 大塊不規則岩石及稜線，無人工切割石板。 |
| 271 | general／concrete | 手袋／てぶくろ／手套 | `general-listening-68:手袋` | `gloves.svg` | 有五指及腕口的一對手套，不是裸手。 |
| 272 | general／concrete | 旗／はた／旗子 | `general-listening-69:旗` | `flag.svg` | 旗杆上飄動的無國別旗面，不用文字徽章。 |
| 273 | general／concrete | 枝／えだ／樹枝 | `general-listening-70:枝` | `branch.svg` | 離開樹幹的分叉枝條，葉子只作植物線索。 |
| 274 | general／concrete | 影／かげ／影子 | `general-listening-70:影` | `shadow.svg` | 人物與地面拉長投影同時可見，光從另一側照來。 |
| 275 | general／concrete | 塔／とう／塔 | `general-listening-71:塔` | `tower.svg` | 高聳窄身、頂端尖塔與層窗，非普通辦公樓。 |
| 276 | general／concrete | 屋根／やね／屋頂 | `general-listening-71:屋根` | `roof.svg` | 建築上方瓦面與屋脊被指向，不把整棟屋當屋頂。 |
| 277 | general／concrete | 星／ほし／星星 | `general-listening-72:星` | `star.svg` | 夜空中遠近星點與一顆清楚星芒，表天體而非評分星等。 |
| 278 | general／concrete | 天井／てんじょう／天花板 | `general-listening-74:天井` | `ceiling.svg` | 室內透視上方平面與吊燈，箭頭指天花板。 |
| 279 | general／concrete | 鐘／かね／鐘 | `general-listening-78:鐘` | `bell.svg` | 金屬大鐘與鐘槌，不與既有時計時鐘混用。 |
| 280 | general／concrete | 端末／たんまつ／終端裝置 | `general-listening-79:端末` | `terminal.svg` | 手持終端裝置、螢幕與按鍵，作原通用課終端一例，不外推所有設備。 |
| 281 | general／concrete | 瓶／びん／瓶子 | `general-listening-116:瓶` | `bottle.svg` | 玻璃瓶、瓶頸與軟木塞，不把所有瓶當藥。 |
| 282 | general／concrete | 矢／や／箭 | `general-listening-123:矢` | `arrowprojectile.svg` | 有箭鏃、箭羽的實體箭，不是方向矢印。 |
| 283 | general／concrete | 炎／ほのお／火焰 | `general-listening-124:炎` | `flame.svg` | 多層火焰向上燃燒，不用單一紅色水滴。 |
| 284 | general／concrete | 氷／こおり／冰 | `general-listening-124:氷` | `ice.svg` | 兩塊半透明冰塊、融水及稜角，不是雪晶。 |
| 285 | general／concrete | 宝石／ほうせき／寶石 | `general-listening-146:宝石` | `gem.svg` | 切割寶石的多面刻面，不畫成一般岩石。 |
| 286 | general／abstract | 予約／よやく／預約 | `general-listening-04:予約` | `reservation.svg` | 人物在日曆特定格放上椅子圖示，表事先保留名額，不是一般約會。 |
| 287 | general／verb | 払う／はらう／支付 | `general-listening-04:払う` | `paying.svg` | 手將硬幣放到帳單托盤，沒有取得商品，表支付費用。 |
| 288 | general／verb | 運ぶ／はこぶ／搬運 | `general-listening-08:運ぶ` | `carrying.svg` | 人物抱著箱子跨步搬運，有移動方向，非靜止拿著。 |
| 289 | general／verb | 減らす／へらす／減少 | `general-listening-08:減らす` | `reducing.svg` | 手從原有五物件中拿走兩個，剩餘變少，表減量動作。 |
| 290 | general／verb | 分ける／わける／分開；分配 | `general-listening-08:分ける` | `dividing.svg` | 原一堆物品分到兩個容器，分岔箭頭與數量一致。 |
| 291 | general／verb | 急ぐ／いそぐ／趕快 | `general-listening-03:急ぐ` | `hurrying.svg` | 人物看時鐘並加快步伐趕向目的地，時間壓力與跑步名詞分開。 |
| 292 | general／verb | 確認／かくにん／確認 | `general-listening-06:確認` | `checking.svg` | 人物以清單逐一對照箱內物品，表核對，不只是閱讀。 |
| 293 | general／adjective | 安全／あんぜん／安全 | `general-listening-05:安全` | `safe.svg` | 有護欄、完整橋板的人行橋，人物穩定通過，對照危險而非安心心理。 |
| 294 | general／verb | 濡れる／ぬれる／淋濕；沾濕 | `general-listening-06:濡れる` | `gettingwet.svg` | 淋雨後衣物帶水滴並滴水，表沾濕，不只雨天。 |
| 295 | general／verb | 乾く／かわく／乾燥；變乾 | `general-listening-06:乾く` | `drying.svg` | 晾在繩上的衣物在陽光風下已無水滴，表乾燥。 |
| 296 | games／expression | メリークリスマス！／メリークリスマス！／聖誕快樂！ | `game-card:game:er:hart:selection-voice:4ef596e51f:4ef596e51f` | `christmasgreeting.svg` | 人物互相招呼、聖誕樹與禮物，表聖誕祝福，不採作品角色。 |
| 297 | games／expression | ラブ&ピース！／ラブ&ピース！／Love & Peace！ | `game-card:game:er:hart:selection-voice:1794da56b4:1794da56b4` | `loveandpeace.svg` | 和平的鴿子、橄欖枝與人際愛心組成祝願微情境，沒有文字。 |
| 298 | games／expression | レース開始よ！／レース かいしよ！／比賽開始囉！ | `game-card:game:er:silvia:selection-voice:0f1f8a4534:0f1f8a4534` | `racestart.svg` | 賽車在起跑門下向前出發、旗手放行，表比賽開始而非單一車。 |
| 299 | games／expression | 見て見て、虹だよ！／みてみて、にじだよ！／快看快看，是彩虹！ | `game-card:game:genshin:aino:burst:44b0c417c7` | `pointingrainbow.svg` | 人物伸手指向雨後彩虹，圖示涵蓋看與彩虹，不把整句縮成一般見る。 |
| 300 | games／expression | 廃品回収の時間だ。／はいひん かいしゅうの じかんだ。／回收廢品的時間到了。 | `game-card:game:er:alonso:selection-voice:c44c74a562:c44c74a562` | `recyclingtime.svg` | 人物把空瓶與紙板放回收車、旁有鐘提示回收時刻，不描繪原作角色。 |

## 小尺寸總覽

- [第1組：1～12](previews/t156-group-1.png)
- [第2組：13～24](previews/t156-group-2.png)
- [第3組：25～36](previews/t156-group-3.png)
- [第4組：37～48](previews/t156-group-4.png)
- [第5組：49～60](previews/t156-group-5.png)
- [第6組：61～72](previews/t156-group-6.png)
- [第7組：73～84](previews/t156-group-7.png)
- [第8組：85～96](previews/t156-group-8.png)
- [第9組：97～108](previews/t156-group-9.png)
- [第10組：109～120](previews/t156-group-10.png)
- [第11組：121～132](previews/t156-group-11.png)
- [第12組：133～144](previews/t156-group-12.png)
- [第13組：145～156](previews/t156-group-13.png)
- [第14組：157～168](previews/t156-group-14.png)
- [第15組：169～180](previews/t156-group-15.png)
- [第16組：181～192](previews/t156-group-16.png)
- [第17組：193～204](previews/t156-group-17.png)
- [第18組：205～216](previews/t156-group-18.png)
- [第19組：217～228](previews/t156-group-19.png)
- [第20組：229～240](previews/t156-group-20.png)
- [第21組：241～252](previews/t156-group-21.png)
- [第22組：253～264](previews/t156-group-22.png)
- [第23組：265～276](previews/t156-group-23.png)
- [第24組：277～288](previews/t156-group-24.png)
- [第25組：289～300](previews/t156-group-25.png)

## 自查修正

初稿實際56×42總覽檢視發現動作人物重複腿線、住む人物比例及契約手部裁切；只修正本批SVG後重新渲染檢視。既有資產未改。
