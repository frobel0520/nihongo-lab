# T158：新增300個尚未覆蓋義項SVG

基準main `9f6d68a021545e2bb8211338a44d2d4e108a8a85`／已發布[PR #163](https://github.com/frobel0520/nihongo-lab/pull/163)。本輪產品提交`e7c7f9a28d11f2a4e050ed7f9b76d24a0c475dc7`；新增300個未覆蓋義項／300張原創CC0 SVG，300主要映射＋225舊圖共用＋447新圖共用＝972筆新增。672共用中651跨來源課程／教材單元、21同課，不全部稱為跨課。

全站5909卡保持；SVG714→1014，有圖2212→3184、缺圖3697→2725，覆蓋37.43%→53.88%（+16.45百分點）。分類為N5 464／711、通用2637／4500、動畫58／80、遊戲25／618。2978詞形與3669保守文字簽章未變；簽章不是人工核定的真實詞義總數，資產數也不等於卡片覆蓋。

原59暫緩候選重評：4用舊圖、1由新圖（切電源）解決、54保留。另有搆到／送達、回覆／歸還與保存液／資料儲存等後續候選明確分義。大使館、正論、能力及慣用語仍有具體設計限制，未視為全廢或強制清零。舊圖360候選配對核准225，新圖522候選配對核准447；未用的候選不等於仍缺圖卡數。

新SVG221,296 bytes、全部1014圖677,210 bytes。precache22,662,226／26,869,829 bytes（1493統計URL），餘4,207,603；較基準增加431,018。JS gzip65,661／630,000、CSS5,068／5,800；預算、統計範圍、必要離線資產與音訊下載契約保持，未恢復T122計時Gate。

教材5909卡全值／ID、原2212映射及714 SVG SHA保持；同步3、排程、全部音檔與引用、按需載入、版面與runtime dependencies未改。8535教材音檔＋38聲線預覽＝8573，未新增或要求重答／補下載。

本機check336測試、typecheck、lint、正式/nihongo-lab/ build與perf:bundle通過。300圖在56×42及300張實際375×667卡片逐張檢視；972新增映射逐筆核實。300主要卡線上／真正離線共600次揭示；另32代表卡×新卡／複習×線上／離線＝128完整流程，涵蓋四類、各詞類、舊圖／新圖共用、無圖與長文字。1倍播放、評分／改評、觸控滑動不評分與進度保存保持；1014圖真正離線SHA一致。斷網為BrowserContext.setOffline(true)後重載，未快取探針ERR_INTERNET_DISCONNECTED；清HTTP快取與刪單圖precache後驗缺圖退化及下一圖恢復。pageerror0、水平溢位0。全量圖片／資料自查與32卡完整操作抽驗分開，不宣稱全3184卡完整操作驗收。

## 來源與語義界線

全部自行編繪原創幾何向量，CC0-1.0；沿用固定色盤、圓角線條與224×168／56×42規格，無外部素材、作品角色、字型、emoji或文字標籤。圖片為詞義的一例，不重製遊戲技能、作品劇情或保證所有義項均有涵蓋。主要詞條含8張遊戲整句，沿用既有卡片單位，不拆新教材。

設計分流：concrete 95、abstract 73、quantity 3、verb 86、adverb 18、adjective 8、expression 9、pronoun 8。此為本批人工構圖分類，不宣稱全站詞類均已盤點完成。

共用審查360舊圖候選及522新圖候選，完整ID／讀音／譯義與上下文另存audit；執行時仍只核對凍結四欄，沒有用候選列表做runtime字面匹配。672共用中651跨來源單元、21同課。半（三時半）不套半份食物；ペン在該課明指萬年筆，不套原子筆；氣氛不套氣體、指稱代詞不套手指塔。

小尺寸自查後強化足夠的需求對應、折紙擅長／苦手的實際差異、訂正的參考形、直前的手與按鈕間隙，修正雲／日光與觀眾裁切、毯布形態及真相的遮布線索。能力草圖撤回，改選消毒。測試抓到回覆／歸還、魔力恢復／返回位置、守密／遵守交通規則混配，於產品提交前撤除誤配並保存負例；不是修改教材或進度ID。

[完整972映射CSV](vocab-illustration-t158-mappings.csv)、[300資產bytes／SHA／授權](vocab-illustration-t158-assets.json)、[逐筆核准／暫緩](vocab-illustration-t158-sharing-audit.json)、[驗證證據](vocab-illustration-t158-validation.json)。

## 300個主要詞義

| # | 類別／詞類 | 詞面／讀音／原翻譯 | 精確ID | SVG | 構圖與界線 |
|---|---|---|---|---|---|
| 1 | n5／concrete | 辞書／じしょ／字典 | `stage0-day2:辞書` | `dictionary.svg` | 厚的開本、側面索引標籤與密集條目線，區分字典與一般讀物，不在圖內寫答案。 |
| 2 | n5／concrete | 雑誌／ざっし／雜誌 | `stage0-day2:雑誌` | `magazine.svg` | 薄冊圖像封面、翻起的紙角與多頁邊緣，區分報紙與厚字典。 |
| 3 | n5／abstract | ニュース／ニュース／新聞（報導） | `stage0-day21:ニュース` | `newsbroadcast.svg` | 螢幕中記者與現場圖像並列，表新聞報導；不擴及私下口信。 |
| 4 | n5／concrete | パーティー／パーティー／派對 | `stage0-day21:パーティー` | `party.svg` | 氣球、桌邊飲食與多人聚會，未用生日蠟燭把派對限為生日。 |
| 5 | n5／concrete | テープ／テープ／膠帶、錄音帶 | `stage0-day22:テープ` | `adhesivetape.svg` | 捲起的黏貼膠帶拉出一端，表本卡膠帶義的一例，不代表錄音帶。 |
| 6 | n5／concrete | 牛肉／ぎゅうにく／牛肉 | `stage0-day23:牛肉` | `beef.svg` | 牛角輪廓與切片肉並列，標明肉類來源，不只靠肉片顏色區分。 |
| 7 | n5／concrete | 豚肉／ぶたにく／豬肉 | `stage0-day23:豚肉` | `pork.svg` | 有圓鼻與捲尾的豬搭配肉切片，區分牛肉與雞肉。 |
| 8 | n5／concrete | 鶏肉／とりにく／雞肉 | `stage0-day23:鶏肉` | `chickenmeat.svg` | 雞冠、鳥嘴與骨付き雞腿，形態上區分雞肉而非換色肉片。 |
| 9 | n5／abstract | アニメ／アニメ／動畫 | `stage0-day25:アニメ` | `animationframes.svg` | 連續畫格中同一顆球的位置改變，示範動畫原理，不取用作品畫面。 |
| 10 | n5／concrete | 字幕／じまく／字幕 | `stage0-day25:字幕` | `subtitles.svg` | 影像下方獨立的雙行字幕區，以線條呈排版結構，不用文字標籤作答案。 |
| 11 | general／concrete | 美術館／びじゅつかん／美術館 | `general-listening-09:美術館` | `artmuseum.svg` | 牆上不同藝術作品與鑑賞者，未畫商品販售櫃檯。 |
| 12 | general／concrete | 書店／しょてん／書店 | `general-listening-50:書店` | `bookshop.svg` | 書架、陳列與會計台，區分有閱覽桌的圖書館；牌上無文字。 |
| 13 | general／concrete | 薬屋／くすりや／藥店 | `general-listening-50:薬屋` | `pharmacy.svg` | 藥瓶陳列架與配藥櫃檯，區分有病床的醫院。 |
| 14 | general／concrete | 市場／いちば／市集 | `general-listening-40:市場` | `marketstalls.svg` | 兩個露天攤位分別陳列蔬果與魚，非單一商店。 |
| 15 | general／concrete | 祭り／まつり／祭典 | `general-listening-40:祭り` | `festival.svg` | 連串提燈、攤位與聚集的人，表祭典一例，無國旗或文字。 |
| 16 | general／concrete | 荷車／にぐるま／貨推車 | `general-listening-77:荷車` | `handcart.svg` | 開放木製貨台、長牽引柄與大輪，區分箱式行李或一般車輛。 |
| 17 | general／concrete | 木箱／きばこ／木箱 | `general-listening-104:木箱` | `woodencrate.svg` | 木板、釘子與斜向補強板明確，非紙箱只換顏色。 |
| 18 | general／concrete | マイク／まいく／麥克風 | `general-listening-84:マイク` | `microphone.svg` | 孔網球頭、握柄與連接線呈麥克風本體，非單純唱歌人物。 |
| 19 | general／concrete | 松明／たいまつ／火把 | `general-listening-121:松明` | `torch.svg` | 木柄纏布並燃起火焰，區分裸火與蠟燭。 |
| 20 | general／concrete | 水晶／すいしょう／水晶 | `general-listening-125:水晶` | `crystal.svg` | 尖端六角柱、稜線與結晶群，區分圓寶石。 |
| 21 | general／concrete | 石板／せきばん／石板 | `general-listening-125:石板` | `stonepanel.svg` | 有缺角與厚度的石板，上有無字幾何雕刻，非魔法文字答案。 |
| 22 | general／concrete | 鉄格子／てつごうし／鐵柵欄 | `general-listening-132:鉄格子` | `ironbars.svg` | 石框內粗直鐵棒、橫補強與鎖孔，表阻隔結構而非一般門。 |
| 23 | general／concrete | 地下室／ちかしつ／地下室 | `general-listening-130:地下室` | `basement.svg` | 地面剖面下的房間與向下樓梯，非地面房間。 |
| 24 | general／concrete | フック／フック／掛鉤 | `general-listening-131:フック` | `hook.svg` | 固定環與大彎鉤，主體是金屬掛鉤。 |
| 25 | general／concrete | マント／マント／披風 | `general-listening-128:マント` | `cloak.svg` | 從頸扣向身後展開的布，沒有外套袖子。 |
| 26 | general／concrete | フード／フード／兜帽 | `general-listening-128:フード` | `hood.svg` | 包住頭部的衣帽與肩膀連接，臉周有帽緣，非獨立帽子。 |
| 27 | general／concrete | 鍛冶屋／かじや／鐵匠 | `general-listening-129:鍛冶屋` | `blacksmith.svg` | 職人用錘在金床敲打熱金屬，區分一般維修工具。 |
| 28 | general／concrete | 穴／あな／洞穴 | `general-listening-131:穴` | `hole.svg` | 地面上的洞口有邊緣、暗內部與深度，表地穴而非山壁洞窟入口。 |
| 29 | general／concrete | 刃／は／刀刃 | `general-listening-124:刃` | `bladeedge.svg` | 刀刃被放大圈突出，箭頭焦點不在柄部或整把劍。 |
| 30 | general／concrete | 結び目／むすびめ／繩結 | `general-listening-96:結び目` | `knot.svg` | 繩索交叉穿環後收緊，中央焦點是繩結，不是綁箱動作。 |
| 31 | general／concrete | 鈴／すず／鈴鐺 | `general-listening-118:鈴` | `smallbell.svg` | 圓金屬鈴有開縫與吊環，區分釣鐘。 |
| 32 | general／concrete | 泥／どろ／泥土 | `general-listening-121:泥` | `mud.svg` | 土與水混合的泥地有下陷長靴及腳印，不畫成乾土。 |
| 33 | general／concrete | ひび／ひび／裂痕 | `general-listening-122:ひび` | `crack.svg` | 牆上的細裂縫分叉，沒有破片飛散的破壞動作。 |
| 34 | general／concrete | 落石／らくせき／落石 | `general-listening-122:落石` | `rockfall.svg` | 坡上岩塊沿向下動線落下，非石頭靜物。 |
| 35 | general／concrete | 魔法陣／まほうじん／魔法陣 | `general-listening-125:魔法陣` | `magiccircle.svg` | 地面圓環、多角幾何與光線，無文字或作品符號。 |
| 36 | general／concrete | 小道具／こどうぐ／小道具 | `general-listening-80:小道具` | `stageprops.svg` | 箱內皇冠、假劍與扇等演出物件，非只用實戰武器。 |
| 37 | general／concrete | 台本／だいほん／劇本 | `general-listening-80:台本` | `scriptbook.svg` | 開本的對話行結構與舞台幕景並列，沒有文字台詞。 |
| 38 | general／concrete | 身分証／みぶんしょう／身分證件 | `general-listening-45:身分証` | `identitycard.svg` | 證件外形、照片框與整列資訊欄，無個資文字。 |
| 39 | general／concrete | 宿帳／やどちょう／住宿登記簿 | `general-listening-45:宿帳` | `guestregister.svg` | 櫃檯鈴旁開著分格登記簿，有筆正在填寫；無姓名或個資。 |
| 40 | general／concrete | 伝票／でんぴょう／單據 | `general-listening-81:伝票` | `transactionslip.svg` | 細長明細紙有行與合計底線，旁有商品和硬幣，非只有空白紙。 |
| 41 | general／concrete | 差し入れ／さしいれ／慰問品；送來的餐點 | `general-listening-37:差し入れ` | `carepackage.svg` | 把餐點帶給仍在工作的人，表慰問補充而非泛生日贈禮。 |
| 42 | general／concrete | 両手／りょうて／雙手 | `general-listening-33:両手` | `bothhands.svg` | 左右兩手並排且同時標示，區分單手。 |
| 43 | general／concrete | 片手／かたて／單手 | `general-listening-33:片手` | `onehand.svg` | 只用一隻手提袋、另一隻手空著，突出單手使用。 |
| 44 | general／concrete | 席／せき／座位 | `general-listening-39:席` | `seatplace.svg` | 桌邊一個椅位與餐盤配置，焦點為座位而非椅子單物。 |
| 45 | general／concrete | 乗り場／のりば／乘車或搭船處 | `general-listening-30:乗り場` | `boardingpoint.svg` | 排隊的人在岸邊向船搭乘，表登乘地點的一例，不畫整個港口代替。 |
| 46 | general／concrete | ホーム／ホーム／月台 | `general-listening-44:ホーム` | `railplatform.svg` | 較高的月台、低處鐵軌與等車的人，區分道路與車站建築。 |
| 47 | general／abstract | 路線／ろせん／路線 | `general-listening-44:路線` | `transportroute.svg` | 站點圓圈與分支、轉接的路徑，無文字地名。 |
| 48 | general／concrete | 番線／ばんせん／月台軌道號 | `general-listening-44:番線` | `platformtrack.svg` | 多股鐵軌中一股被指向，沒有寫出軌道號碼直接作答案。 |
| 49 | general／concrete | 舞台裏／ぶたいうら／後台 | `general-listening-86:舞台裏` | `backstage.svg` | 幕後有衣裝、道具與候場者，側邊才是舞台光，區分舞台正面。 |
| 50 | general／concrete | 観客／かんきゃく／觀眾 | `general-listening-86:観客` | `audience.svg` | 多人背向畫面坐著看舞台，焦點在觀眾而非演員。 |
| 51 | general／concrete | 台座／だいざ／底座 | `general-listening-125:台座` | `pedestal.svg` | 階梯式底座承托小展示物，箭頭突出底座。 |
| 52 | general／concrete | 根元／ねもと／根部；底部 | `general-listening-71:根元` | `rootbase.svg` | 樹幹接地處與外伸根部被圈出，非整棵樹。 |
| 53 | general／concrete | 先端／せんたん／尖端 | `general-listening-71:先端` | `tip.svg` | 長槍尖端被放大圈突出，非柄或根部。 |
| 54 | general／abstract | 輪郭／りんかく／輪廓 | `general-listening-74:輪郭` | `outline.svg` | 動物外周粗線、內部細節較弱，表外形輪廓。 |
| 55 | general／concrete | 中身／なかみ／內容物 | `general-listening-48:中身` | `contentsinside.svg` | 開袋的內部透出水果與書，焦點不是袋子外形。 |
| 56 | general／abstract | 余白／よはく／留白 | `general-listening-87:余白` | `blankmargin.svg` | 紙張中間內容與四周留空被分開標示，非空白整張紙。 |
| 57 | n5／quantity | 一人／ひとり／一個人 | `stage0-day11:一人` | `oneperson.svg` | 只有一個人站在座位旁，其他座位空著，不寫數字。 |
| 58 | n5／quantity | 二人／ふたり／兩個人 | `stage0-day11:二人` | `twopersons.svg` | 兩個人物在共同範圍內，數量由人物本身表達。 |
| 59 | general／quantity | 三人／さんにん／三個人 | `general-listening-11:三人` | `threepersons.svg` | 三個人有清楚間隔並被一括標示，不使用數字文字。 |
| 60 | n5／concrete | 両親／りょうしん／雙親 | `stage0-day20:両親` | `parents.svg` | 兩位成人共同照顧中央孩子，表示雙親的一例，不限定性別角色或真實家庭。 |
| 61 | n5／concrete | 兄弟／きょうだい／兄弟姊妹 | `stage0-day20:兄弟` | `siblings.svg` | 同一家庭照片中不同身高的子女並排，父母只作背景，表手足的一例。 |
| 62 | n5／concrete | お祖父さん／おじいさん／祖父、老爺爺 | `stage0-day20:お祖父さん` | `grandfather.svg` | 白髮長者持杖並與孩子牽手，表祖父／年長男性的一例，不以髮色當全部定義。 |
| 63 | n5／concrete | おばあさん／おばあさん／祖母、老奶奶 | `stage0-day20:おばあさん` | `grandmother.svg` | 髮髻長者與孩子同在，衣形與姿態區分，非同圖只換色。 |
| 64 | n5／concrete | 留学生／りゅうがくせい／留學生 | `stage0-day15:留学生` | `exchangestudent.svg` | 背書包的學生帶行李到校，地球補助留學線索；不把所有旅人當留學生。 |
| 65 | general／verb | 探す／さがす／尋找 | `general-listening-03:探す` | `searching.svg` | 人物彎腰查看樹叢下與石後，目光掃過多處，沒有已找到的物品光圈。 |
| 66 | n5／verb | 鳴く／なく／（鳥、動物）叫（禮貌形：鳴きます） | `stage0-day23:鳴く` | `animalcall.svg` | 鳥張嘴發出鳴叫的聲波，區別單純鳥名詞或人發聲。 |
| 67 | n5／verb | 差す／さす／撐（傘）、照進（禮貌形：差します） | `stage0-day23:差す` | `openingumbrella.svg` | 人物把傘柄舉到頭頂，傘面撐開擋雨，表撐傘一義而非日光照進。 |
| 68 | n5／verb | くれる／くれる／（別人）給我（禮貌形：くれます） | `stage0-day24:くれる` | `giventome.svg` | 物品由對方送入近側說話者手中；近側人物胸口手指自己，焦點在給我而非我給。 |
| 69 | n5／verb | 上げる／あげる／舉起、提高（也寫成「あげる」＝給） | `stage0-day24:上げる` | `raising.svg` | 雙手把旗從低處拉到高處、向上箭頭，呈舉起義；不套授受義。 |
| 70 | n5／verb | 開く／あく／（門、窗）打開（禮貌形：開きます） | `stage0-day23:開く` | `dooropens.svg` | 無人施力的門由關閉輪廓變成開啟狀態，沒有開門者的手。 |
| 71 | n5／verb | 閉まる／しまる／（門、窗）關上（禮貌形：閉まります） | `stage0-day23:閉まる` | `doorcloses.svg` | 自動門的兩扇向中央合攏、箭頭相向，沒有操作者。 |
| 72 | n5／verb | 消える／きえる／（燈、火）熄滅、消失（禮貌形：消えます） | `stage0-day23:消える` | `flamegoesout.svg` | 火焰前後對比：同一蠟燭右側無火，只餘細煙，無人吹熄。 |
| 73 | n5／verb | 続ける／つづける／繼續（禮貌形：続けます） | `stage0-day25:続ける` | `continueactivity.svg` | 人物連續把積木鋪成未完成的長列，既有與接續的部分相連，無重新開始箭頭。 |
| 74 | general／verb | 集合／しゅうごう／集合 | `general-listening-03:集合` | `assemblingpeople.svg` | 三個不同方向的人朝中央旗點會合，區別兩人碰面或收集物件。 |
| 75 | general／verb | 空く／あく／空出；有空位 | `general-listening-04:空く` | `seatbecomesfree.svg` | 人物離開椅子、原座位成空位，時間箭頭指離開後；不是空杯。 |
| 76 | general／verb | 注文／ちゅうもん／點餐；訂購 | `general-listening-04:注文` | `orderingfood.svg` | 客人看菜單向服務者指定餐盤，包含點餐的雙方角色。 |
| 77 | general／verb | 足りる／たりる／足夠 | `general-listening-07:足りる` | `enoughsupply.svg` | 三個人的需求各有一瓶水一一對應，沒有缺口，表剛好足夠，不以很多瓶直接代替足夠。 |
| 78 | general／verb | 残す／のこす／留下 | `general-listening-08:残す` | `leavingportion.svg` | 用餐者把部分食物另留於有蓋小盤，箭頭指向保留而非吃剩的狀態。 |
| 79 | general／verb | まとめる／まとめる／整理；集中 | `general-listening-08:まとめる` | `consolidatingpapers.svg` | 散開資料按組集中放進同一夾板，沒有把不同內容畫成簡單相等。 |
| 80 | general／abstract | 距離／きょり／距離 | `general-listening-10:距離` | `distancebetween.svg` | 兩個地點間的虛線與雙端量距線，強調相隔距離而非走動方向。 |
| 81 | general／concrete | 地形／ちけい／地形 | `general-listening-10:地形` | `terrain.svg` | 同一地表剖面有山脊、谷地與平地，表地形的高低而非單座山。 |
| 82 | general／concrete | 通路／つうろ／通道 | `general-listening-10:通路` | `passageway.svg` | 兩側貨架間留出的可通行走道，中央地面箭頭，不用走廊舊圖冒充陳列場地。 |
| 83 | general／abstract | 人通り／ひとどおり／行人往來 | `general-listening-10:人通り` | `pedestriantraffic.svg` | 同一街道上人來人往，方向不同，表行人流量而非隊伍。 |
| 84 | general／verb | 分け合う／わけあう／分享 | `general-listening-11:分け合う` | `sharingwithothers.svg` | 兩個人把同一條麵包分開，各得到一半；不同於單方分發。 |
| 85 | general／concrete | 受付／うけつけ／櫃檯；接待 | `general-listening-12:受付` | `receptiondesk.svg` | 來訪者向櫃檯接待員遞文件，後方有分格收件架，與付款櫃檯區別。 |
| 86 | general／verb | 開店／かいてん／開門營業 | `general-listening-12:開店` | `shopopens.svg` | 店主拉開店門、掀起遮棚，顧客走近，表開始營業非普通開門。 |
| 87 | general／verb | 閉店／へいてん／結束營業 | `general-listening-12:閉店` | `shopcloses.svg` | 商店降下鐵捲門、店主收起門外座椅，月亮表示結束營業的一例。 |
| 88 | general／verb | 間に合う／まにあう／趕得上 | `general-listening-12:間に合う` | `intime.svg` | 旅人趕在車門關閉前到達踏板，時鐘和開著的門表還趕得上。 |
| 89 | general／verb | 遅れる／おくれる／遲到；延誤 | `general-listening-12:遅れる` | `arrivelate.svg` | 人抵達時車已離開站台，車與人之間拉開距離；不只一個晚時鐘。 |
| 90 | general／abstract | 返事／へんじ／回覆 | `general-listening-13:返事` | `replymessage.svg` | 對方先傳一個訊息，接收者回一個訊息，分離的相反箭頭標回應。 |
| 91 | general／verb | 報告／ほうこく／報告 | `general-listening-13:報告` | `reporting.svg` | 執行者拿結果夾板向負責人說明，上方完成的工作實物作內容線索。 |
| 92 | general／verb | 読み終わる／よみおわる／讀完 | `general-listening-13:読み終わる` | `finishreading.svg` | 人物合上已翻到最後一頁的書，書籤在末頁、完成勾，表讀完非普通閱讀。 |
| 93 | general／verb | 聞き終わる／ききおわる／聽完 | `general-listening-13:聞き終わる` | `finishlistening.svg` | 耳機聆聽者面前播放進度已到末端，完成標記，與正在聽區分。 |
| 94 | general／concrete | 受取人／うけとりにん／收件人 | `general-listening-13:受取人` | `addressee.svg` | 郵差遞來的信封被門內的人接收，接收者以聚焦圈突出而非寄出。 |
| 95 | general／concrete | 送り主／おくりぬし／寄件人 | `general-listening-13:送り主` | `sender.svg` | 寄件人親手將封好的包裹交郵務窗口，圈在寄出者，非收件端。 |
| 96 | general／adverb | うっかり／うっかり／不留神 | `general-listening-15:うっかり` | `carelessly.svg` | 人物看向別處時把杯子碰倒，視線偏離與意外碰觸同時可見，不是故意。 |
| 97 | general／concrete | 印／しるし／記號 | `general-listening-15:印` | `mark.svg` | 地圖的一處被圈起並點記，標記位置明確，非整張地圖或文字。 |
| 98 | general／abstract | 代わり／かわり／代替 | `general-listening-16:代わり` | `substitute.svg` | 原本要上的人退到旁邊，另一人接替同一工作台的位置，表替代。 |
| 99 | general／adjective | 詳しい／くわしい／熟悉；詳細的 | `general-listening-17:詳しい` | `detailed.svg` | 同一路線左邊粗略、右邊含多個清楚轉彎和地標，放大鏡聚焦右邊細節。 |
| 100 | general／abstract | 頼り／たより／依靠 | `general-listening-17:頼り` | `reliance.svg` | 迷路者拿破地圖向熟路的嚮導靠近，嚮導指出安全路，表依靠的對象。 |
| 101 | general／abstract | つもり／つもり／打算 | `general-listening-18:つもり` | `intention.svg` | 人物想像明天要出發的背包路線，尚未實際出發；想法泡泡不是預言。 |
| 102 | general／verb | 泊まる／とまる／住宿 | `general-listening-18:泊まる` | `stayingovernight.svg` | 旅行者在旅館房間放下行李、準備夜宿，窗外月亮，非家中睡覺。 |
| 103 | general／verb | 荷造り／にづくり／打包行李 | `general-listening-18:荷造り` | `packingluggage.svg` | 雙手把摺好的衣服放進打開的行李箱，不是包裝禮物。 |
| 104 | general／verb | 備える／そなえる／預備；防備 | `general-listening-18:備える` | `prepareprecaution.svg` | 人物在暴雨雲到來前把雨具、水與藥包裝入備用箱，防備一例而非臨時使用。 |
| 105 | general／abstract | 休業／きゅうぎょう／暫停營業 | `general-listening-19:休業` | `temporarilyclosed.svg` | 商店捲門關閉、門前放暫停營業的遮欄，旁有預定再開日的無字日曆，不畫永久荒廢。 |
| 106 | general／abstract | 定休日／ていきゅうび／固定公休日 | `general-listening-19:定休日` | `regularclosedday.svg` | 關店日曆的每週同一欄被重複圈起，表固定公休日，不靠星期文字。 |
| 107 | general／concrete | 隣町／となりまち／鄰近城鎮 | `general-listening-19:隣町` | `neighboringtown.svg` | 兩座不同小鎮緊鄰而有路相通，焦點圈在旁邊的一座；不是泛指遠處城市。 |
| 108 | general／concrete | 貼り紙／はりがみ／告示紙 | `general-listening-19:貼り紙` | `postednotice.svg` | 紙張以四角膠帶貼在牆上，行線代文字，區別獨立告示板。 |
| 109 | general／verb | 試す／ためす／試驗 | `general-listening-20:試す` | `tryingout.svg` | 人物拿小樣在廢紙上試筆後觀察結果，非正式完成作品。 |
| 110 | general／verb | 操作／そうさ／操作 | `general-listening-20:操作` | `operatingcontrols.svg` | 人物按面板並轉動旋鈕控制裝置，雙重操作線索，不只是按鈕名詞。 |
| 111 | general／abstract | 表示／ひょうじ／顯示 | `general-listening-20:表示` | `displayoutput.svg` | 感測器的測量結果出現在螢幕，以溫度柱與圖形表示；非文字答案或螢幕物件而已。 |
| 112 | general／concrete | 雲／くも／雲 | `general-listening-21:雲` | `cloud.svg` | 只有天空中的層疊雲團，不加雨滴或日光，不把陰天狀態當唯一詞義。 |
| 113 | general／concrete | 雨雲／あまぐも／雨雲 | `general-listening-21:雨雲` | `raincloud.svg` | 低垂深厚雲團及正下方雨滴，和白雲、全景暴風雨不同。 |
| 114 | general／concrete | 嵐／あらし／暴風雨 | `general-listening-21:嵐` | `storm.svg` | 強風斜雨、彎樹與翻浪共同表暴風雨，不只是雨雲。 |
| 115 | general／abstract | 気温／きおん／氣溫 | `general-listening-21:気温` | `airtemperature.svg` | 戶外溫度計與周圍空氣、太陽雲的線索；不以病人體溫替代氣溫。 |
| 116 | general／verb | 引き返す／ひきかえす／折返 | `general-listening-21:引き返す` | `turnbackroute.svg` | 人物在前方落石前轉回原來道路，U形箭頭回出發點；非一般回家。 |
| 117 | general／concrete | 山道／やまみち／山路 | `general-listening-21:山道` | `mountaintrail.svg` | 彎曲細路沿山坡上升，步道與等高差清楚，非普通道路。 |
| 118 | general／abstract | 伝言／でんごん／留言；傳話 | `general-listening-22:伝言` | `relayedmessage.svg` | 中間人把第一人的訊息轉述給第三人，兩段箭頭；非雙人直接對話。 |
| 119 | general／concrete | 門番／もんばん／守門人 | `general-listening-22:門番` | `gatekeeper.svg` | 守門人站在城門旁查驗通行物件，區別戰士進攻或普通隊員。 |
| 120 | general／abstract | 閉鎖／へいさ／關閉；封閉 | `general-listening-22:閉鎖` | `sealedaccess.svg` | 通道被實體橫欄擋住、上有封條形斜帶，呈封閉狀態，沒有抽象禁止圖替代。 |
| 121 | general／concrete | 案内所／あんないじょ／服務中心 | `general-listening-22:案内所` | `informationcenter.svg` | 服務櫃檯提供折頁地圖，牆有區域圖與接待員；不是旅行社品牌。 |
| 122 | general／abstract | 判断／はんだん／判斷 | `general-listening-23:判断` | `judgment.svg` | 人物根據橋的裂痕與安全繞路兩項證據選安全路，呈權衡後判斷的一例。 |
| 123 | general／verb | 待ち続ける／まちつづける／持續等待 | `general-listening-23:待ち続ける` | `keepwaiting.svg` | 同一人在椅旁等待，時鐘前後指針不同但位置未離開；不是一次短暫等待。 |
| 124 | general／adverb | 念のため／ねんのため／以防萬一 | `general-listening-23:念のため` | `justincase.svg` | 晴天出門仍把折傘放入包裡作備用，沒有宣稱一定下雨。 |
| 125 | general／verb | 取っておく／とっておく／保留 | `general-listening-23:取っておく` | `setasideforlater.svg` | 從食物中另留一份放入有蓋盒、旁有稍後的時鐘，非隨手存放。 |
| 126 | general／abstract | 祝日／しゅくじつ／國定假日 | `general-listening-24:祝日` | `publicholiday.svg` | 日曆一日以花圈突出，城鎮廣場有慶典裝飾；不畫國旗或文字。 |
| 127 | general／abstract | 平日／へいじつ／平日 | `general-listening-24:平日` | `weekdays.svg` | 一週日曆左五欄連成工作區塊，後兩欄分隔；公事包作工作日線索，無曜日文字。 |
| 128 | general／abstract | 再会／さいかい／重逢 | `general-listening-25:再会` | `reunion.svg` | 兩人見面擁抱，旁邊淡色過去合照以回返箭頭連到現在，提供再次相見線索。 |
| 129 | general／abstract | 留守／るす／不在家 | `general-listening-26:留守` | `awayfromhome.svg` | 房子內空無一人，住戶帶包走遠，表不在家而非住宅不存在。 |
| 130 | general／abstract | 留守番／るすばん／看家；留守 | `general-listening-26:留守番` | `housesitting.svg` | 一人在屋內守著鑰匙，外出者在屋外遠去，表留下看家。 |
| 131 | general／verb | 買ってくる／かってくる／買了再回來 | `general-listening-26:買ってくる` | `buyandreturn.svg` | 同一背包旅人先向商店購買，再沿回返路線帶袋回家，兩段行程明確。 |
| 132 | general／abstract | 予算／よさん／預算 | `general-listening-28:予算` | `budgetlimit.svg` | 預定可用錢幣放在有界限的框內，清單對照，框外額外物品不算入；不是金錢多寡。 |
| 133 | general／concrete | 小銭／こぜに／零錢 | `general-listening-28:小銭` | `smallchange.svg` | 掌心多枚小硬幣、露出厚度，與紙鈔及泛稱錢區別。 |
| 134 | general／abstract | 残り／のこり／剩餘 | `general-listening-28:残り` | `remainingamount.svg` | 原有六個物品的淡輪廓中三個已取走、三個保留實心，焦點括起餘量。 |
| 135 | general／verb | 聞こえる／きこえる／聽得到 | `general-listening-29:聞こえる` | `audible.svg` | 人物未主動靠近，遠處鈴聲傳至耳邊，表示聽得到的狀態。 |
| 136 | general／verb | ぶつかる／ぶつかる／碰撞 | `general-listening-29:ぶつかる` | `colliding.svg` | 兩名行人轉角撞在一起，碰撞點有力線；非主動攻擊或推人。 |
| 137 | general／verb | 出航／しゅっこう／出航 | `general-listening-30:出航` | `shipsailingout.svg` | 船從港口沿箭頭向海面出發，岸在後方；不只船名詞。 |
| 138 | general／abstract | 欠航／けっこう／停航 | `general-listening-30:欠航` | `sailingcancelled.svg` | 船停靠岸邊，航線箭頭被中斷、公告紙打叉；與船已航行不同。 |
| 139 | general／verb | 乗船／じょうせん／登船 | `general-listening-30:乗船` | `boardingboat.svg` | 旅人跨過連接岸與船的舷梯踏上船，強調登船動作而非泛指乗る火車圖。 |
| 140 | general／abstract | 手続き／てつづき／手續 | `general-listening-30:手続き` | `procedurepaperwork.svg` | 同一文件依序經填寫、核對、蓋印三步，無數字文字但流向清楚。 |
| 141 | general／abstract | 自己紹介／じこしょうかい／自我介紹 | `general-listening-31:自己紹介` | `selfintroduction.svg` | 新來者指自己向兩人打招呼，身上無字名牌；不是旁人代為介紹。 |
| 142 | general／verb | 知り合う／しりあう／結識 | `general-listening-31:知り合う` | `becomingacquainted.svg` | 兩人初次交換無字名片並揮手，淡隔線打開，表示建立相識關係。 |
| 143 | general／concrete | 先輩／せんぱい／前輩 | `general-listening-31:先輩` | `seniorpeer.svg` | 同一工作隊較熟練者教新同伴操作，胸前多枚資歷章；不以年齡大小等同資歷。 |
| 144 | general／concrete | 後輩／こうはい／後輩 | `general-listening-31:後輩` | `juniorpeer.svg` | 新加入者在熟練同伴旁拿筆記學操作，焦點圈在新人；不是單純年幼者。 |
| 145 | general／concrete | 隊長／たいちょう／隊長 | `general-listening-31:隊長` | `teamleader.svg` | 領隊站在兩名隊員前方指路，肩章和隊伍關係表職責而非獨自戰士。 |
| 146 | general／adjective | 得意／とくい／擅長 | `general-listening-32:得意` | `goodat.svg` | 同一人物熟練完成精細摺紙，旁有整齊成品，表擅長的一例而非獎牌等同能力。 |
| 147 | general／adjective | 苦手／にがて／不擅長；不喜歡 | `general-listening-32:苦手` | `notgoodat.svg` | 人物嘗試折紙但折角錯位、旁有練習稿，對照擅長而不宣稱人格缺點。 |
| 148 | general／concrete | 楽器／がっき／樂器 | `general-listening-32:楽器` | `musicalinstruments.svg` | 笛、鼓與弦樂器並列，表樂器類別而非單一吉他。 |
| 149 | general／verb | 指す／さす／指向 | `general-listening-34:指す` | `pointing.svg` | 伸出的食指準確指向圖中一座塔，虛線到目標；非推薦或戳按。 |
| 150 | general／verb | 持ち込む／もちこむ／攜入 | `general-listening-35:持ち込む` | `bringinginside.svg` | 人物提包跨過門檻進入室內，箭頭與物品同時指內，區分單純走進。 |
| 151 | general／verb | 待たせる／またせる／讓人等待 | `general-listening-36:待たせる` | `makewait.svg` | 一人停在約定地等候，另一人仍在遠處辦事，以連線指出讓對方等待的關係。 |
| 152 | general／abstract | 言い訳／いいわけ／藉口 | `general-listening-36:言い訳` | `excuse.svg` | 遲到者指著小時鐘說明，對方看著更早的約定時計，說法與責任之間有差距線索。 |
| 153 | general／adjective | 無事／ぶじ／平安無事 | `general-listening-36:無事` | `unharmedreturn.svg` | 旅人經過碎石路回到同伴旁，衣物完整且同伴放下擔心；非單純開心。 |
| 154 | general／verb | 聞き取る／ききとる／聽懂；辨聽 | `general-listening-38:聞き取る` | `catchspeech.svg` | 聽者從帶雜訊的聲波中抓到三段一致音節，指向清晰波形，非單純耳朵聽見。 |
| 155 | general／verb | 聞き直す／ききなおす／再問一次 | `general-listening-38:聞き直す` | `askagain.svg` | 聽者指耳請對方再說，回返箭頭回到同一說話者的泡泡；非前進下一話題。 |
| 156 | general／abstract | 雑音／ざつおん／雜音 | `general-listening-38:雑音` | `interferencenoise.svg` | 通話訊號旁有不規則突波壓過原本平順波形，區分音量大與雜音。 |
| 157 | general／verb | 通話／つうわ／通話 | `general-listening-39:通話` | `phoneconversation.svg` | 兩人在不同場所持話筒交談，以持續雙向聲波連線；不只電話機。 |
| 158 | general／verb | 折り返す／おりかえす／回電；折返 | `general-listening-39:折り返す` | `callback.svg` | 未接來電箭頭後另一人從接收端回撥，第二段電話路線方向相反。 |
| 159 | general／verb | つながる／つながる／接通；連結 | `general-listening-39:つながる` | `connected.svg` | 斷開的兩個接頭已接合，兩端訊號線連通，表連接成功不只是聯絡意圖。 |
| 160 | general／verb | 呼び出す／よびだす／叫來 | `general-listening-39:呼び出す` | `summoning.svg` | 人物用呼叫裝置通知另一人從房內出來，泡泡指向被叫者；非物品取出。 |
| 161 | general／abstract | 急用／きゅうよう／急事 | `general-listening-39:急用` | `urgentmatter.svg` | 本在交談的人接到急訊後拿藥箱立即離開，短時限與醫療需求表急事一例。 |
| 162 | general／verb | 受け付ける／うけつける／受理 | `general-listening-39:受け付ける` | `acceptapplication.svg` | 櫃檯人員收下來件放入待處理盤，蓋受理章但無完成結果，區分許可或辦妥。 |
| 163 | general／abstract | 賛成／さんせい／贊成 | `general-listening-40:賛成` | `agreeing.svg` | 三人討論同一方案，其中兩人點頭舉拇指朝向方案，表示贊成而非全體必定同意。 |
| 164 | general／verb | 取り消す／とりけす／取消 | `general-listening-41:取り消す` | `cancelling.svg` | 原已預約的日曆格被劃取消，人物收回入場券；不指延到另一天。 |
| 165 | general／abstract | 延期／えんき／延期 | `general-listening-41:延期` | `postponement.svg` | 同一活動物件從原日曆頁移到較後日期，兩頁相連，區分直接取消。 |
| 166 | general／abstract | 会議／かいぎ／會議 | `general-listening-41:会議` | `meetingdiscussion.svg` | 三人圍同一長桌交換意見與資料，非單純初次碰面或上課。 |
| 167 | general／verb | 書き直す／かきなおす／重寫 | `general-listening-41:書き直す` | `rewrite.svg` | 舊稿有劃除線，旁邊新稿由同一筆重寫，回返箭頭指向新紙，而非只影印。 |
| 168 | general／abstract | 値引き／ねびき／折價 | `general-listening-42:値引き` | `pricediscount.svg` | 同一物件的付款硬幣由多到少，價格牌與向下箭頭表減價，不寫數字答案。 |
| 169 | general／expression | おかわり／おかわり／再來一份 | `general-listening-43:おかわり` | `secondhelping.svg` | 吃完的碗遞向添飯者，飯匙再添一份同樣食物；不是換一道菜。 |
| 170 | general／verb | 乗り換える／のりかえる／轉乘 | `general-listening-44:乗り換える` | `transferring.svg` | 旅人從一列車下來走向另一線的車門，兩車有不同路徑而非下一站。 |
| 171 | general／abstract | 終点／しゅうてん／終點 | `general-listening-44:終点` | `routeend.svg` | 列車路線止於終站、軌道末端有止衝擋。與第一站、一般站名分開。 |
| 172 | general／abstract | 始発／しはつ／首班車；起點發車 | `general-listening-44:始発` | `firstdeparture.svg` | 黎明時第一輛車駛出車庫，時鐘與空的後方軌道表首班的一例，不畫全部車次。 |
| 173 | general／concrete | 屋外／おくがい／戶外 | `general-listening-46:屋外` | `outdoors.svg` | 人物在房屋外的樹旁活動，房屋切線把室內室外分開，焦點在露天。 |
| 174 | general／concrete | 屋内／おくない／室內 | `general-listening-46:屋内` | `indoors.svg` | 人物位在房屋剖面內，外側雨滴留在窗外，表室內。 |
| 175 | general／verb | 横になる／よこになる／躺下 | `general-listening-47:横になる` | `liedown.svg` | 清醒人物由坐姿轉躺於長椅、眼睛仍張開，表躺下而非已睡著。 |
| 176 | general／verb | 診察／しんさつ／診察 | `general-listening-47:診察` | `medicalexamination.svg` | 醫師用聽診器檢查病人胸前，區分施藥或單純醫師名詞。 |
| 177 | general／abstract | 食欲／しょくよく／食慾 | `general-listening-47:食欲` | `appetite.svg` | 人物看見飯菜後期待進食、手摸腹部，碗仍未吃，表食慾不是已吃飽。 |
| 178 | general／abstract | 心当たり／こころあたり／可能線索 | `general-listening-48:心当たり` | `possiblelead.svg` | 尋失物者回想剛才停留的櫃檯，泡泡有錢包小輪廓，未畫成確定找到。 |
| 179 | general／verb | 訂正／ていせい／更正 | `general-listening-49:訂正` | `correction.svg` | 錯誤圖形被劃去，在旁重畫與範本一致的形狀，表改正非硬體修理。 |
| 180 | general／abstract | 義務／ぎむ／義務 | `general-listening-49:義務` | `obligation.svg` | 輪值人員依排班表必須守門，責任繫於指定值班人，不是自由選擇的喜好。 |
| 181 | general／verb | 目撃／もくげき／目擊 | `general-listening-51:目撃` | `witnessing.svg` | 一旁目擊者看到瓶子跌落，視線連到正在發生的事件，非單純看人。 |
| 182 | general／verb | 再開／さいかい／重新開始 | `general-listening-51:再開` | `resuming.svg` | 暫停的織工作業留有半成品，人物回到同一織機繼續，非從零新開始。 |
| 183 | general／concrete | 工事／こうじ／施工 | `general-listening-51:工事` | `constructionwork.svg` | 施工人員、路面挖掘與圍欄，表施工狀態而非完整新建築。 |
| 184 | general／abstract | 責任／せきにん／責任 | `general-listening-52:責任` | `responsibility.svg` | 負責人接住將倒的工作箱、向同伴承擔，夾板標記綁定同一人，不是泛用稱讚。 |
| 185 | general／verb | 提出／ていしゅつ／提交 | `general-listening-52:提出` | `submitting.svg` | 完成稿由作者交入指定收件盤，箭頭落到盤內；非籠統給予。 |
| 186 | general／verb | 切る／きる／切斷 | `general-listening-53:切る` | `disconnectpower.svg` | 手關閉電源開關、連接裝置指示燈由亮到暗。專用切電源義，不用剪刀或掛電話。 |
| 187 | general／verb | 落ち着く／おちつく／冷靜 | `general-listening-53:落ち着く` | `calmingdown.svg` | 同一人從慌亂短線轉為坐下深呼吸，後半手放膝上，非單純開心。 |
| 188 | general／abstract | 集中／しゅうちゅう／集中 | `general-listening-55:集中` | `concentrating.svg` | 人物專注畫一個精細目標，外圍雜訊淡化，視線只連到任務，非普通努力。 |
| 189 | general／abstract | 感情／かんじょう／感情 | `general-listening-56:感情` | `emotions.svg` | 同一人的喜、怒、悲表情分別在泡泡中，表情緒範疇而非只微笑。 |
| 190 | n5／pronoun | 私／わたし／我 | `stage0-day1:私` | `speakerself.svg` | 說話者胸前手指向自己，對話泡泡尾端也連自己，表第一人稱而非任何人。 |
| 191 | n5／pronoun | あなた／あなた／你 | `stage0-day1:あなた` | `listeneryou.svg` | 近側說話者指向正面聽話者，泡泡尾接說者，表你而非自己。 |
| 192 | n5／pronoun | これ／これ／這個（離說話者近） | `stage0-day2:これ` | `thisobject.svg` | 物件在說話者手邊並被指向，聽者在另一側，表近說者這個。 |
| 193 | n5／pronoun | それ／それ／那個（離聽話者近） | `stage0-day2:それ` | `thatbylistener.svg` | 兩人對話，物件放聽者手邊、說者從對面指它，表近聽者那個。 |
| 194 | n5／pronoun | あれ／あれ／那個（離兩人都遠） | `stage0-day2:あれ` | `thatfarobject.svg` | 物件遠在坡頂，兩名對話者同在近側，一起與物件有距離。 |
| 195 | n5／pronoun | ここ／ここ／這裡（離說話者近） | `stage0-day3:ここ` | `hereplace.svg` | 說話者腳下的區域被圈出，手向下指所在位置，對方在圈外。 |
| 196 | n5／pronoun | そこ／そこ／那裡（離聽話者近） | `stage0-day3:そこ` | `thereplace.svg` | 說話者從圈外指向聽話者所在的地面圈，表近聽者的位置。 |
| 197 | n5／pronoun | あそこ／あそこ／那裡（離兩人都遠） | `stage0-day3:あそこ` | `farplace.svg` | 兩位對話者都站近處，遠方被圈起的小丘才是指示位置。 |
| 198 | n5／adjective | いろいろ／いろいろ／各式各樣（な形容詞：いろいろな） | `stage0-day21:いろいろ` | `various.svg` | 同一箱內含形狀與用途不同的球、本、花和工具，不只同物換色。 |
| 199 | n5／abstract | ほか／ほか／其他、別的 | `stage0-day21:ほか` | `others.svg` | 目前選的一個物品在左框，右框有其他不同物品，箭頭指右而非下一個。 |
| 200 | n5／adverb | もっと／もっと／更、再多一點 | `stage0-day9:もっと` | `more.svg` | 同一碗原有兩匙食物，再添一匙，向上程度條強調比原量更多。 |
| 201 | n5／adverb | 全然／ぜんぜん／完全（本課學否定用法：全然〜ません） | `stage0-day9:全然` | `notatall.svg` | 想搬的箱子仍紋絲不動，位移刻度始終空白，否定程度一點也不，非禁止命令。 |
| 202 | n5／adverb | まだ／まだ／還（仍然）、還沒 | `stage0-day21:まだ` | `notyet.svg` | 沙漏仍有沙在流、未完成拼圖留一空位，表還沒完成，沒有完成勾。 |
| 203 | general／adverb | すっかり／すっかり／完全 | `general-listening-63:すっかり` | `completely.svg` | 原本髒的桌面全部擦乾淨，整個區域均無污點，與擦一點對比。 |
| 204 | general／adverb | わざと／わざと／故意地 | `general-listening-98:わざと` | `deliberately.svg` | 人物看著目標積木並主動推倒，事前想像同一倒塌結果，區分不小心。 |
| 205 | general／adverb | しっかり／しっかり／牢固地 | `general-listening-96:しっかり` | `firmly.svg` | 繩結緊緊固定箱子、繩無鬆圈，旁有受拉仍穩固的雙向力箭頭。 |
| 206 | general／adverb | そろそろ／そろそろ／差不多該 | `general-listening-21:そろそろ` | `abouttimeto.svg` | 時鐘指針逼近預定出發點，旅人開始拿外套，表差不多該做某事。 |
| 207 | general／adverb | やっと／やっと／終於 | `general-listening-84:やっと` | `finally.svg` | 長段登山足跡終於到達山頂，旅人擦汗放下背包，結尾明確而非剛開始。 |
| 208 | general／adverb | しばらく／しばらく／一段時間 | `general-listening-34:しばらく` | `forawhile.svg` | 人在樹下休息，兩個時計之間有一段延伸的時間區間，不把它定成特定秒數。 |
| 209 | general／adverb | 一度に／いちどに／一次同時 | `general-listening-87:一度に` | `atonce.svg` | 同一雙手同時提起三只杯的托盤，動作一次完成，非逐只移動。 |
| 210 | general／adverb | 特に／とくに／尤其 | `general-listening-32:特に` | `especially.svg` | 眾多相同文件中一份被特別拉出並放大，其他保持在原處，表尤其著重之一。 |
| 211 | general／adverb | せっかく／せっかく／好不容易；難得 | `general-listening-19:せっかく` | `preciousopportunity.svg` | 旅人歷經長路抵達展館，手中珍惜入場券，長腳印路線提示難得機會，不只興奮。 |
| 212 | general／adverb | そのまま／そのまま／照原樣 | `general-listening-46:そのまま` | `unchanged.svg` | 同一裝置前後配置完全相同、控制手停在外側，沒有把旋鈕移動或翻頁。 |
| 213 | general／adverb | 直前／ちょくぜん／就在之前 | `general-listening-48:直前` | `justbefore.svg` | 手即將按按鈕、兩者尚有極小間隙，時間線標在事件前，非已按下。 |
| 214 | general／adverb | 直後／ちょくご／緊接之後 | `general-listening-108:直後` | `justafter.svg` | 杯子剛碰倒、液滴才開始流出，時間線圈在事件後一小段，不是很久以後。 |
| 215 | general／adverb | 同時／どうじ／同時 | `general-listening-94:同時` | `simultaneous.svg` | 一個時鐘連到兩人同時起跑的腳步，兩個動作在同一垂直時點上。 |
| 216 | general／abstract | 不在／ふざい／不在 | `general-listening-73:不在` | `absent.svg` | 值班桌空著，人物在外出路線上，名牌形框和椅子留在原位，區分空物品。 |
| 217 | general／abstract | 偶然／ぐうぜん／偶然 | `general-listening-94:偶然` | `coincidence.svg` | 兩人各走不同路線卻在同一轉角相遇，沒有約定日曆，兩人驚訝短線表非預期。 |
| 218 | general／verb | 見落とす／みおとす／看漏 | `general-listening-66:見落とす` | `overlooking.svg` | 人物視線掃過一排資料卻越過其中一個小記號，圈出被漏看的目標。 |
| 219 | general／verb | 振り向く／ふりむく／回頭看 | `general-listening-67:振り向く` | `lookback.svg` | 身體繼續朝前、頭與視線回看身後，弧箭頭繞頭，不是整個人返回。 |
| 220 | general／abstract | 気配／けはい／跡象；動靜 | `general-listening-70:気配` | `signofpresence.svg` | 樹後只露一小段鞋和晃動枝葉，旁人警覺停下觀察，呈有人動靜但未確認正體。 |
| 221 | general／verb | 慌てる／あわてる／慌張 | `general-listening-76:慌てる` | `flustered.svg` | 人物把資料散落、手腳動作凌亂並看時鐘，表慌張而非一般速度快。 |
| 222 | general／verb | 引きつける／ひきつける／吸引 | `general-listening-77:引きつける` | `attractattention.svg` | 表演者以亮球吸引旁觀者目光，視線朝同一目標；非授受或強拉人物。 |
| 223 | general／abstract | 容量／ようりょう／容量 | `general-listening-79:容量` | `capacity.svg` | 同大小容器以內部邊界和可容納的積木格示容量，不把目前裝入量當全部容量。 |
| 224 | general／abstract | 履歴／りれき／歷程紀錄 | `general-listening-79:履歴` | `historylog.svg` | 裝置的數次既往操作以時間線與不同小圖示排列，箭頭回看記錄，非預定行程。 |
| 225 | general／verb | 思い込む／おもいこむ／想當然認定 | `general-listening-79:思い込む` | `fixedassumption.svg` | 人物只緊盯想像中的一把鑰匙，旁邊確實存在的備用鑰匙沒看，表認定而非一般思考。 |
| 226 | general／abstract | 出番／でばん／出場時機 | `general-listening-80:出番` | `turnonstage.svg` | 幕旁候場者收到聚光燈指向自己的上場信號，呈輪到登場而非整體舞台。 |
| 227 | general／concrete | 主役／しゅやく／主角 | `general-listening-80:主役` | `protagonist.svg` | 中央演員在聚光燈下，兩位配角在側後方較小，重點是戲劇主要角色。 |
| 228 | general／verb | 見守る／みまもる／守望 | `general-listening-80:見守る` | `watchover.svg` | 年長者在一旁留意孩子攀小梯，雙手準備保護但未代做，表守望而非監視敵人。 |
| 229 | general／verb | 演じる／えんじる／扮演 | `general-listening-80:演じる` | `actingrole.svg` | 演員拿不同角色面具在台上扮演，旁有台本、觀眾小輪廓，不等同一般穿衣。 |
| 230 | general／verb | 補給／ほきゅう／補給 | `general-listening-81:補給` | `resupply.svg` | 即將空的備品箱被送來一批水和食物填補，強調消耗後補充而非初次裝備。 |
| 231 | general／concrete | 拠点／きょてん／據點 | `general-listening-81:拠点` | `basecamp.svg` | 野外帳篷、物資與向外再返回的路線，作活動據點的一例，而非城鎮全景。 |
| 232 | general／abstract | 夜勤／やきん／夜班 | `general-listening-82:夜勤` | `nightshift.svg` | 值班員夜間在亮燈的工作桌處理資料，窗外月亮；非在夜裡休息。 |
| 233 | general／verb | 保存／ほぞん／保存 | `general-listening-83:保存` | `preservingmaterial.svg` | 標本浸在密封玻璃容器的保存液中，與儲存檔案分開，不能暗示保存液可飲用。 |
| 234 | general／verb | 混ぜる／まぜる／混合 | `general-listening-83:混ぜる` | `mixing.svg` | 手持匙在碗中將兩種食材攪合、圓弧箭頭與混合交界，非只倒入。 |
| 235 | general／adjective | 無音／むおん／無聲 | `general-listening-84:無音` | `silenceaudio.svg` | 錄音裝置波形是一條平線，聽者耳邊沒有聲波，不畫禁止說話手勢。 |
| 236 | general／abstract | 後悔／こうかい／後悔 | `general-listening-85:後悔` | `regret.svg` | 人物看著自己扔出的完好物品，伸手想取回但垃圾已帶走，回想錯誤決定的懊悔。 |
| 237 | general／verb | 褒める／ほめる／稱讚 | `general-listening-86:褒める` | `praising.svg` | 老師看見完成的作品後對作者比拇指，正向回饋泡泡連作者，非泛用成功勾。 |
| 238 | general／verb | 重なる／かさなる／重疊 | `general-listening-87:重なる` | `overlapping.svg` | 兩張透明幾何片交疊、共同部分加網格，與只是並排或堆高不同。 |
| 239 | general／verb | 区切る／くぎる／分段 | `general-listening-87:区切る` | `segmenting.svg` | 長條連續圖形被清楚分成三段，中間留空隙，剪線指分段而非刪除全部。 |
| 240 | general／adjective | 読みやすい／よみやすい／容易讀的 | `general-listening-87:読みやすい` | `easytoread.svg` | 閱讀者面對行距適當、大小分明的排版，眼睛舒展；左邊擠成塊的排版作對比。 |
| 241 | general／adjective | 聞き取りにくい／ききとりにくい／不易聽清的 | `general-listening-87:聞き取りにくい` | `hardtohear.svg` | 語音波形被重疊雜音打斷，聽者皺眉傾耳，與完全無聲分開。 |
| 242 | general／verb | 点滅／てんめつ／閃爍 | `general-listening-88:点滅` | `blinkinglight.svg` | 同一燈在連續三格中亮、暗、亮，重返亮的循環箭頭，非一直發光。 |
| 243 | general／abstract | 音量／おんりょう／音量 | `general-listening-88:音量` | `soundvolume.svg` | 喇叭旁滑桿控制波形振幅，呈聲音大小；不把雜音或音高混同。 |
| 244 | general／verb | 響く／ひびく／迴響 | `general-listening-88:響く` | `echoing.svg` | 洞內敲擊發出的聲波到牆面再折返，表回響而非普通響鈴。 |
| 245 | general／verb | 諦める／あきらめる／放棄 | `general-listening-92:諦める` | `givingup.svg` | 人物停止嘗試高牆的攀爬，放下繩索轉身離開，區別暫時休息。 |
| 246 | general／abstract | 停電／ていでん／停電 | `general-listening-94:停電` | `poweroutage.svg` | 多棟房屋的窗同時變暗、電線中斷，月光下手電照明，與關單一燈分開。 |
| 247 | general／verb | 盗む／ぬすむ／偷竊 | `general-listening-97:盗む` | `stealing.svg` | 一人趁另一人轉頭從其包袋取走錢包，物主不知情，區分合法拿取。 |
| 248 | general／verb | 切り替える／きりかえる／切換 | `general-listening-98:切り替える` | `switchmode.svg` | 同一裝置切換桿從一條路徑轉向另一條，兩種功能圖示不同而非單純換色。 |
| 249 | general／verb | 外れる／はずれる／脫落 | `general-listening-96:外れる` | `detaching.svg` | 掛環從鉤上脫開掉落，沒有施力者手，與主動取下分開。 |
| 250 | general／verb | 代わる／かわる／替換 | `general-listening-99:代わる` | `takeoverturn.svg` | 交班者把值班位置交給接班人後離開，表人替換而非物品交換。 |
| 251 | general／abstract | 交渉／こうしょう／交涉 | `general-listening-101:交渉` | `negotiating.svg` | 兩方在桌上對照物品與報價硬幣，各提出不同數量，最後尚未蓋同意章。 |
| 252 | general／concrete | 徽章／きしょう／徽章 | `general-listening-147:徽章` | `insignia.svg` | 別在衣服上的金屬徽章有別針與幾何紋樣，非人物姓名文字。 |
| 253 | general／concrete | 鞘／さや／刀鞘 | `general-listening-144:鞘` | `scabbard.svg` | 劍身部分露出刀鞘，長鞘有封閉底端與綁帶，焦點箭頭指鞘非刀。 |
| 254 | general／concrete | 帯／おび／腰帶 | `general-listening-144:帯` | `waistband.svg` | 人物腰間纏布帶並在側面打結，沒有上裝配件混同領帶。 |
| 255 | general／concrete | 欠片／かけら／碎片 | `general-listening-146:欠片` | `fragments.svg` | 破碎器物旁有不規則小碎片，虛線圈突出碎片而非整件器物。 |
| 256 | general／concrete | 毛布／もうふ／毯子 | `general-listening-154:毛布` | `blanket.svg` | 柔軟厚毯披在長椅上，邊緣流蘇與摺痕，非穿衣或床本體。 |
| 257 | general／concrete | 引き出し／ひきだし／抽屜 | `general-listening-156:引き出し` | `drawer.svg` | 櫃體一格抽屜向外拉開，露出內部和把手，非只櫥櫃外觀。 |
| 258 | general／concrete | 秤／はかり／秤 | `general-listening-161:秤` | `weighingscale.svg` | 秤盤上放物、下有指針表盤，表示測量重量工具而非抽象公平。 |
| 259 | general／concrete | 配線／はいせん／配線 | `general-listening-159:配線` | `wiring.svg` | 多條電線從裝置端子連到插座，端點與走線清楚，非抽象聯繫。 |
| 260 | general／abstract | 空欄／くうらん／空白欄 | `general-listening-167:空欄` | `blankfield.svg` | 表格大部分有內容線，特定一格保持空白並被指向，不是空紙。 |
| 261 | general／concrete | 書庫／しょこ／書庫 | `general-listening-168:書庫` | `bookstorage.svg` | 密集高架書櫃與狹窄走道，無借閱櫃檯或閱讀桌，表藏書空間。 |
| 262 | general／concrete | 吊り橋／つりばし／吊橋 | `general-listening-142:吊り橋` | `suspensionbridge.svg` | 橋面以多條吊索連到兩側大纜索，跨越河谷，非普通拱橋。 |
| 263 | general／concrete | 川岸／かわぎし／河岸 | `general-listening-142:川岸` | `riverbank.svg` | 河水與陸地交界明確，人物站在岸上、箭頭聚焦岸邊，非河中央或對岸。 |
| 264 | general／verb | 凍る／こおる／結冰 | `general-listening-163:凍る` | `freezing.svg` | 同一水碗由流動水面變成冰塊結晶，轉變箭頭而非冷水觸感。 |
| 265 | general／concrete | 日陰／ひかげ／陰影處 | `general-listening-163:日陰` | `shadedplace.svg` | 樹擋住日光形成地面陰影，人物站在影內，與夜晚或陰天不同。 |
| 266 | general／concrete | 日向／ひなた／向陽處 | `general-listening-163:日向` | `sunnyspot.svg` | 樹影旁未被遮住的亮地面有人曬太陽，圈突出受光區，非泛指太陽名詞。 |
| 267 | general／abstract | 公平／こうへい／公平 | `general-listening-139:公平` | `fairdistribution.svg` | 三人各得同樣兩份物品，並列分配關係可數，非只天平泛圖。 |
| 268 | general／abstract | 保留／ほりゅう／保留 | `general-listening-138:保留` | `decisionpending.svg` | 文件先放待決盤、旁是未走完的沙漏，批准與拒絕兩個出口都未選，不畫成取消。 |
| 269 | general／abstract | 権限／けんげん／權限 | `general-listening-149:権限` | `accessauthority.svg` | 持特定許可卡者能操作鎖住的控制盤，旁人無卡留外；表可執行權而非身分名字。 |
| 270 | general／verb | 弁償／べんしょう／賠償 | `general-listening-149:弁償` | `compensating.svg` | 打破杯子的人把錢交給物主，破杯在旁明示賠償原因，非單純買東西。 |
| 271 | general／abstract | 見積もり／みつもり／估價 | `general-listening-149:見積もり` | `costestimate.svg` | 維修者先對照損壞設備列出估價單、金幣以虛線框預估，尚未付錢。 |
| 272 | general／abstract | 共感／きょうかん／同理 | `general-listening-164:共感` | `empathy.svg` | 一人難過講述失物，另一人傾身聆聽並呈同樣感受泡泡，非單純也開心。 |
| 273 | general／abstract | 敬意／けいい／敬意 | `general-listening-168:敬意` | `respect.svg` | 晚輩雙手端正遞文件並微鞠躬向長者，表尊重禮節、不是因過失道歉。 |
| 274 | general／abstract | 否定／ひてい／否定 | `general-listening-169:否定` | `negation.svg` | 說者對另一人的提議輕搖頭，原來提出的一項被斜線否定，非禁止所有說話。 |
| 275 | general／abstract | 例外／れいがい／例外 | `general-listening-158:例外` | `exception.svg` | 一組同樣圓物中唯有三角形獨立在規則框外，清楚標出不同規則的一例而非隨機換色。 |
| 276 | general／abstract | 因果／いんが／因果 | `general-listening-166:因果` | `causalchain.svg` | 球碰倒杯子才導致水灑出，三格順序有物理因果，非問號或無關事件並列。 |
| 277 | general／abstract | 基準／きじゅん／基準 | `general-listening-152:基準` | `referencebenchmark.svg` | 同一水平標準線對照三件不同高度物體，基準尺不隨物件移動。 |
| 278 | anime／abstract | 空気／くうき／空氣；氣氛 | `anime-lesson-08:空気` | `atmosphere.svg` | 僵硬的聚會中三人沉默、彼此留距且有空白泡泡，表語境的氣氛，不將空氣物質與情緒硬合併。 |
| 279 | anime／abstract | 覚悟／かくご／心理準備、決心 | `anime-lesson-04:覚悟` | `mentalreadiness.svg` | 人物看見危險斷橋後繫好安全帶、目光堅定準備承擔，心理準備而非盲目衝刺。 |
| 280 | anime／abstract | 真実／しんじつ／真實、真相 | `anime-lesson-07:真実` | `truthrevealed.svg` | 掀開遮布露出原本被藏住的破損物，旁有實際目擊記錄比對，表真相揭示一例。 |
| 281 | anime／verb | 推す／おす／推薦、支持；喜愛並支持某人 | `anime-lesson-08:推す` | `supportfavorite.svg` | 觀眾為台上表演者應援，舉無字扇與鼓掌，表喜愛支持的一例，不是推人。 |
| 282 | general／verb | 消毒／しょうどく／消毒 | `general-listening-164:消毒` | `disinfection.svg` | 對皮膚小傷口塗消毒液，藥瓶與棉片連到處理位置，區分飲藥或洗衣。 |
| 283 | games／expression | 一口食べてみるか。／ひとくち たべてみるか。／嚐一口看看吧。 | `game-card:game:er:tsubame:selection-voice:08779643a3:08779643a3` | `tasteonebite.svg` | 人物拿小匙只試一口、整盤仍完整且觀察味道，區分大口吃飯。 |
| 284 | games／expression | 拘束する！／こうそくする！／束縛住你！ | `game-card:game:genshin:aloy:burst:5980cc2761` | `restrainingperson.svg` | 原創簡筆人物被繩圈限制雙臂與移動，無傷害或作品造型，非綁箱子。 |
| 285 | games／expression | 待ちくたびれたぜ！／まちくたびれたぜ！／等到累死了！ | `game-card:game:er:jan:selection-voice:f0c3c35f4e:f0c3c35f4e` | `wearyofwaiting.svg` | 久候者垂肩坐著，前後兩個時鐘指針有明顯時間差，表等得累而非等候命令。 |
| 286 | games／expression | 前、邪魔！／まえ、じゃま！／前面的，擋路了！ | `game-card:game:er:fenrir:selection-voice:556c4c56f8:556c4c56f8` | `blockedwaycomplaint.svg` | 旅人前方站著阻路者、通路變窄，旅人手指前路要求讓開，非要攻擊對方。 |
| 287 | games／expression | 投降しろ！／とうこうしろ！／立刻投降！ | `game-card:game:genshin:chevreuse:burst:a45491ad5f` | `surrender.svg` | 對方放下武器、雙手舉高，要求投降的動作情境，無既有角色或文字。 |
| 288 | games／expression | 目を閉じて。／めを とじて。／閉上眼睛。 | `game-card:game:genshin:flins:skill:dd6aa5aeaf` | `closeeyes.svg` | 臉部雙眼由睜開轉為閉合，弧線眼皮與手勢柔和，非消失或睡眠整段。 |
| 289 | games／expression | 冷凍の時間よ。／れいとうの じかんよ。／冷凍時間到了。 | `game-card:game:genshin:escoffier:skill:7eb5655fb2` | `freezingfood.svg` | 人物把食材盤放進有冰晶的冷凍櫃，表冷凍的日常微情境，不重現技能。 |
| 290 | games／expression | 逃げ場はないぞ！／にげばは ないぞ！／你無路可逃！ | `game-card:game:genshin:cyno:skill:e1f6bdfce6` | `noescaperoute.svg` | 人物置身三面阻隔的死巷，唯一出口也被封住，表無路可逃而非單純找不到方向。 |
| 291 | general／verb | 防御／ぼうぎょ／防禦 | `general-listening-123:防御` | `defending.svg` | 人物把盾擋在來物之前，衝擊停在盾表面，呈防禦動作，不只是盾的名詞。 |
| 292 | general／verb | 撤退／てったい／撤退 | `general-listening-123:撤退` | `retreating.svg` | 隊伍面向危險保留盾牌，沿反向箭頭有序退回安全側，區別衝鋒。 |
| 293 | general／abstract | 弱点／じゃくてん／弱點 | `general-listening-124:弱点` | `weakspot.svg` | 堅固盾面大部分完好，僅一處裂口被聚焦圈指出，表局部脆弱而非全體弱。 |
| 294 | general／abstract | 耐性／たいせい／抗性 | `general-listening-135:耐性` | `resistance.svg` | 同樣火焰碰到防護前後，傷害痕跡變少但仍有，呈部分抵抗，非完全無效。 |
| 295 | general／verb | 解読／かいどく／解讀 | `general-listening-137:解読` | `decoding.svg` | 用無文字的圖形對照表將密碼圖案還原為路線，表有規則的解讀，非猜謎問號。 |
| 296 | general／abstract | 報酬／ほうしゅう／報酬 | `general-listening-138:報酬` | `rewardpayment.svg` | 委託工作完成後由委託人交給執行者錢袋，旁有已完成任務記錄，非買物付款。 |
| 297 | general／concrete | 遺跡／いせき／遺跡 | `general-listening-141:遺跡` | `ancientruins.svg` | 殘缺石柱、斷牆與爬藤同時呈現舊建築遺跡，非單一壞掉物品。 |
| 298 | general／concrete | 検問／けんもん／關卡檢查 | `general-listening-144:検問` | `checkpoint.svg` | 守衛在欄杆前查驗來者證件，物理關卡與核對關係明確。 |
| 299 | general／abstract | 所有／しょゆう／所有 | `general-listening-144:所有` | `ownership.svg` | 人物的專屬物品留在身邊，手握同形標記吊牌對應箱上的記號，表所有關係而非臨時借用。 |
| 300 | general／verb | 届く／とどく／搆得到 | `general-listening-72:届く` | `reachingdistance.svg` | 人物伸手剛能碰到高架上的把手，距離線從手到目標，表搆得到而非包裹送達。 |

## 25組實際渲染總覽

每組12圖，放大與實際56×42並列；日中標籤只在文件，圖內無文字。300張均已逐張檢視。

![第1組](previews/t158-group-1.png)

![第2組](previews/t158-group-2.png)

![第3組](previews/t158-group-3.png)

![第4組](previews/t158-group-4.png)

![第5組](previews/t158-group-5.png)

![第6組](previews/t158-group-6.png)

![第7組](previews/t158-group-7.png)

![第8組](previews/t158-group-8.png)

![第9組](previews/t158-group-9.png)

![第10組](previews/t158-group-10.png)

![第11組](previews/t158-group-11.png)

![第12組](previews/t158-group-12.png)

![第13組](previews/t158-group-13.png)

![第14組](previews/t158-group-14.png)

![第15組](previews/t158-group-15.png)

![第16組](previews/t158-group-16.png)

![第17組](previews/t158-group-17.png)

![第18組](previews/t158-group-18.png)

![第19組](previews/t158-group-19.png)

![第20組](previews/t158-group-20.png)

![第21組](previews/t158-group-21.png)

![第22組](previews/t158-group-22.png)

![第23組](previews/t158-group-23.png)

![第24組](previews/t158-group-24.png)

![第25組](previews/t158-group-25.png)


## 實際手機預覽

功能檢查採375×667；以下短卡預覽同尺寸，長無圖卡與遊戲原句預覽採375×812以顯示完整資訊，未修改卡片版面。長答案在375×667沿原有卡內捲動查看，300張聯絡表可能是捲至來源的狀態，不宣稱所有長文字同時可見。

### 揭示前：字典

![375寬實際瀏覽器畫面](previews/t158-dictionary-front-375.png)

### 具體詞：字典

![375寬實際瀏覽器畫面](previews/t158-dictionary-375.png)

### 動作：切電源

![375寬實際瀏覽器畫面](previews/t158-power-375.png)

### 分義：標本保存

![375寬實際瀏覽器畫面](previews/t158-preservation-375.png)

### 副詞：牢固地

![375寬實際瀏覽器畫面](previews/t158-firmly-375.png)

### 長無圖卡

![375寬實際瀏覽器畫面](previews/t158-long-unmapped-375.png)

### 抽象：真實

![375寬實際瀏覽器畫面](previews/t158-truth-375.png)

### 遊戲：投降

![375寬實際瀏覽器畫面](previews/t158-surrender-375.png)


## 驗證與發布紀錄

本文件是合併前證據快照；最新CI、實際合併版本、Pages及正式站全檔比對／操作抽驗，集中於本輪T158 PR的最終發布紀錄，不預記未執行結果，也不為相同產品反覆建立文件發布PR。依使用者授權自查、必要CI無阻塞後直接發布，不等待獨立reviewer；完成本300義項後停止。完整真機、實體螢幕閱讀器與逐句人工語音未驗收，既有Android部分紀錄保留；不宣稱記憶效果。JLPT原71盤點已結案，現行31無可靠對應、待核實0，非待補缺漏。
