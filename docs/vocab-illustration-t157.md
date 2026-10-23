# T157：再新增300詞義SVG與核實共用

基準main `7a1ca4f67a1ccd7b20828418aef0e503cb093f6e`／已發布PR #162。產品提交`f2f343ca090f6c85b9fbf68df087a72a9d8c857e`，其後文件不改產品。新增300義項／300張自製CC0 SVG，另94舊圖共用、634新圖共用，總新增1028個精確映射。原5909卡保持：有圖1185→2213、缺圖4724→3696，覆蓋20.05%→37.45%（+17.40百分點）；SVG414→714。資產、主要映射、共用與卡片覆蓋不是同一個數字。

分類：N5有圖394／711、通用1755／4500、動畫49／80、遊戲15／618。2978詞形、3669保守文字簽章保持；簽章不是人工核定的真實詞義總數。圖片是義項一例，不能取代解釋或保證記憶成效。

原92暫緩重評：6筆可用舊圖，28筆改由本輪新圖覆蓋，58筆仍缺圖；沒有把92筆舊圖全部核准。大使館仍待小尺寸構圖，沒有用旗幟或泛行政建築充數。新共用候選661筆（658詞面／別名候選＋3筆明確詢問義聞く），634核准、27暫緩，詳列逐筆原因；既有414圖再盤點得到190候選，94核准。候選不是runtime自動映射，只有凍結ID／word／reading／zh精確符合才出圖。

新SVG208,040 bytes、全714 SVG455,914 bytes。正式路徑build的precache22,231,404／26,869,829 bytes（1193統計URL），餘4,638,425；較基準增423,604。主程式gzip65,662／630,000、CSS5,068／5,800。門檻、統計範圍、必要資產與離線契約均未改；本輪不需容量架構變更，也未恢復T122撤除的計時Gate。

保持文字置中、答案揭示後56×42、空alt、長答案原有卡內捲動與缺圖退化。教材5909卡全值／ID、原1185映射與414舊圖SHA不變；同步3、排程、音檔、音訊下載、按需載入、版面與runtime dependencies未變。8535教材音檔＋38聲線預覽＝8573檔，未改音檔或教材引用。

## 來源、設計與界線

全部資產為本專案自製原創幾何向量，CC0-1.0；無外部素材、字型、emoji、文字標籤或作品角色。色盤與224×168／56×42規格保持。2張遊戲整句用既有卡片為單位，不拆成新教材單字、不宣稱重製作品技能。

先檢查舊圖共用，避免重畫入口／進入、出口／離開、用餐、記憶等同一概念。少數試畫與既圖語義重疊的稿件已換成滑倒、跌倒、藥草、盔甲等未覆蓋義項；「高める」與上達構圖重複亦替補。雨後依據圖、人物四肢、朋友泡泡遮頭、餐碗比例／杯子裁切及穿褲子箭頭都在正式產物凍結前修正。動漫慣用語燃やす／括る保留未配圖，沒有用字面燒柴／綁繩冒充。正論與能力的稿件未達明確性，改選可清楚表現的既有遊戲掃描／爆炸整句。

逐項原詞面／讀音／翻譯、ID、來源及共用理由見[1028筆完整CSV](vocab-illustration-t157-mappings.csv)；[300資產SHA／授權](vocab-illustration-t157-assets.json)與[共用審核／暫緩](vocab-illustration-t157-sharing-audit.json)另存。原資料快照與產品不變契約見驗證JSON。圖片只輔助所列詞義，不聲稱涵蓋多義詞的所有用法、對話內每個物件或原句否定／時態。

## 300個主要義項

| # | 類別／詞類 | 原詞面／讀音／翻譯 | 精確ID | SVG | 構圖與界線 |
|---|---|---|---|---|---|
| 1 | n5／名詞 | 学生／がくせい／學生 | `stage0-day1:学生` | `student.svg` | 學生背書包、抱課本走向校舍；不是泛指成人。 |
| 2 | n5／名詞 | 先生／せんせい／老師 | `stage0-day1:先生` | `teacher.svg` | 老師在教室向學生指示黑板，職業角色而非僅成年人。 |
| 3 | n5／名詞 | 会社員／かいしゃいん／公司職員 | `stage0-day1:会社員` | `officeemployee.svg` | 辦公桌前穿西裝、掛識別證的工作者及公事包。 |
| 4 | n5／名詞 | 友達／ともだち／朋友 | `stage0-day5:友達` | `friend.svg` | 兩個平輩人物並肩聊天、互搭肩，表朋友關係。 |
| 5 | n5／名詞 | 家族／かぞく／家人 | `stage0-day20:家族` | `family.svg` | 屋頂輪廓下兩位大人與孩子相連，表家庭成員而非房子。 |
| 6 | n5／名詞 | 誕生日／たんじょうび／生日 | `stage0-day5:誕生日` | `birthday.svg` | 蛋糕上蠟燭、慶生帽與禮物，表生日慶祝而非任意甜食。 |
| 7 | n5／名詞 | お土産／おみやげ／伴手禮、紀念品 | `stage0-day2:お土産` | `souvenir.svg` | 行李箱旁取出的小禮盒與山景紀念小牌，表旅行帶回的伴手禮。 |
| 8 | n5／名詞 | 料理／りょうり／料理、烹飪（料理します） | `stage0-day9:料理` | `cookingdish.svg` | 人物以鍋鏟翻炒蔬菜、爐火加熱，表料理／烹飪，不僅成品餐盤。 |
| 9 | n5／名詞 | スポーツ／スポーツ／運動 | `stage0-day9:スポーツ` | `sports.svg` | 球場上兩人接球活動，呈現運動的一例，不限單一球種。 |
| 10 | general／名詞 | 薬草／やくそう／藥草 | `general-listening-126:薬草` | `medicinalherbs.svg` | 藥草葉片放入研缽、旁有藥瓶與治療十字，表藥用植物而非食用蔬菜。 |
| 11 | n5／名詞 | 朝ごはん／あさごはん／早餐 | `stage0-day6:朝ごはん` | `breakfast.svg` | 升起太陽在窗外，桌上吐司與蛋作早餐示例。 |
| 12 | n5／名詞 | 昼ご飯／ひるごはん／午餐 | `stage0-day6:昼ご飯` | `lunch.svg` | 太陽在窗戶正上方，便當盒打開用餐，表中午一餐。 |
| 13 | n5／名詞 | 晩ご飯／ばんごはん／晚餐 | `stage0-day6:晩ご飯` | `dinner.svg` | 窗外彎月星點，餐桌上熱飯與菜湯作晚餐示例。 |
| 14 | n5／名詞 | 授業／じゅぎょう／課程、上課 | `stage0-day15:授業` | `classsession.svg` | 多名學生面向老師與教學黑板，表課堂進行而非教室空間。 |
| 15 | n5／名詞 | 練習／れんしゅう／練習（練習します） | `stage0-day15:練習` | `practice.svg` | 人物反覆投球到框，虛線軌跡與數球表練習過程，不表已獲勝。 |
| 16 | n5／名詞 | 質問／しつもん／問題、提問（質問します） | `stage0-day9:質問` | `askingquestion.svg` | 一人舉手向另一人詢問；空白對話泡泡與指示方向，不只一個問號。 |
| 17 | general／名詞 | 制服／せいふく／制服 | `general-listening-49:制服` | `uniform.svg` | 兩件相同設計的校服整齊並排、胸袋與領結，表共同制服。 |
| 18 | general／名詞 | 普段着／ふだんぎ／便服 | `general-listening-49:普段着` | `casualclothes.svg` | 柔軟便服上衣搭休閒褲與球鞋，與制服西裝分開。 |
| 19 | n5／名詞 | 背広／せびろ／西裝 | `stage0-day13:背広` | `suit.svg` | 西裝外套雙翻領、成套長褲與領帶，非泛指上衣。 |
| 20 | n5／名詞 | 動物／どうぶつ／動物 | `stage0-day18:動物` | `animals.svg` | 兔、鹿及狗的形態並列，表動物類別，非單一物種。 |
| 21 | n5／名詞 | 大人／おとな／大人 | `stage0-day19:大人` | `adult.svg` | 成人與孩童並立，用身高與成熟衣著表成人，不只高矮形容。 |
| 22 | n5／名詞 | 子供／こども／小孩 | `stage0-day19:子供` | `child.svg` | 孩童抱玩具球、成人腿部作比例參照，表小孩而非物件小。 |
| 23 | general／名詞 | スープ／スープ／湯 | `general-listening-43:スープ` | `soup.svg` | 湯碗內液體及蔬菜、湯匙和蒸氣，非空碗。 |
| 24 | general／名詞 | 肩／かた／肩膀 | `general-listening-08:肩` | `shoulder.svg` | 肩部特寫，衣領兩側圓肩處以環與短指示線標出，不誤標手臂。 |
| 25 | general／名詞 | 背中／せなか／背部 | `general-listening-08:背中` | `backbody.svg` | 人物背向觀者、後腦與後背中央重點圈，避免指向胸腹。 |
| 26 | general／名詞 | 指／ゆび／手指 | `general-listening-76:指` | `finger.svg` | 手掌伸出食指，其餘手指彎曲；箭頭只指食指。 |
| 27 | general／名詞 | 喉／のど／喉嚨 | `general-listening-47:喉` | `throat.svg` | 側面頭頸輪廓，喉部外側局部圈示，非嘴或胸。 |
| 28 | general／名詞 | サラダ／サラダ／沙拉 | `general-listening-43:サラダ` | `salad.svg` | 盤中生菜、番茄與切片黃瓜，冷盤沙拉，不只整顆蔬菜。 |
| 29 | general／名詞 | リボン／リボン／緞帶 | `general-listening-54:リボン` | `ribbon.svg` | 中央結與兩側蝴蝶結、下垂緞帶尾，物件本身而非禮物。 |
| 30 | general／名詞 | 包帯／ほうたい／繃帶 | `general-listening-77:包帯` | `bandage.svg` | 手臂纏繞白色繃帶、旁有繃帶捲，區別傷口本身。 |
| 31 | general／名詞 | 部品／ぶひん／零件 | `general-listening-16:部品` | `parts.svg` | 分離的螺栓、齒輪及機殼空位，表機械零件，不是泛用工具。 |
| 32 | general／名詞 | 台車／だいしゃ／手推車 | `general-listening-33:台車` | `trolley.svg` | 低平載物平台、推把和四輪，非手提行李。 |
| 33 | general／名詞 | 書類／しょるい／文件 | `general-listening-13:書類` | `documents.svg` | 夾在資料夾中的多頁文件，有線段但不含實際文字。 |
| 34 | general／名詞 | 手帳／てちょう／記事本 | `general-listening-25:手帳` | `pocketnotebook.svg` | 手掌大小的裝訂記事本、彈性束帶與筆，和大本ノート區分。 |
| 35 | general／名詞 | 看板／かんばん／招牌；告示牌 | `general-listening-05:看板` | `signboard.svg` | 戶外有支柱的立式指路牌，以箭頭圖形而非文字呈現。 |
| 36 | general／名詞 | 説明書／せつめいしょ／說明書 | `general-listening-20:説明書` | `manual.svg` | 打開冊子中的組裝步驟圖，工具零件與連接箭頭，非普通故事書。 |
| 37 | general／名詞 | 名札／なふだ／名牌 | `general-listening-31:名札` | `namebadge.svg` | 衣服胸前掛有頭像的識別牌，避免用姓名文字充數。 |
| 38 | general／名詞 | 名簿／めいぼ／名冊 | `general-listening-73:名簿` | `roster.svg` | 冊頁排列多個人物頭像及對應勾選欄，表人員名冊而非單張識別證。 |
| 39 | general／名詞 | 望遠鏡／ぼうえんきょう／望遠鏡 | `general-listening-72:望遠鏡` | `telescope.svg` | 鏡筒朝天空、有大物鏡及三腳架，不是相機。 |
| 40 | general／名詞 | レバー／ればー／操縱桿 | `general-listening-72:レバー` | `lever.svg` | 固定底座上的長控制桿及圓握把，物件而非任意按鈕。 |
| 41 | general／名詞 | 幕／まく／布幕 | `general-listening-72:幕` | `curtain.svg` | 舞台兩側垂落的布幕與上方橫幕，表布幕而非窗戶。 |
| 42 | general／名詞 | 模型／もけい／模型 | `general-listening-74:模型` | `model.svg` | 手掌旁的縮小房屋模型與底座，清楚表示縮尺製作品。 |
| 43 | general／名詞 | 標本／ひょうほん／標本 | `general-listening-83:標本` | `specimen.svg` | 玻璃展示盒內固定展開的蝴蝶與固定針，生物標本的一例。 |
| 44 | general／名詞 | 容器／ようき／容器 | `general-listening-83:容器` | `container.svg` | 開口收納容器側面與底部，物件本身；不將內容限定。 |
| 45 | general／名詞 | 蓋／ふた／蓋子 | `general-listening-83:蓋` | `lid.svg` | 與鍋體分離的蓋子被向上提起，箭頭指向蓋而非容器。 |
| 46 | general／名詞 | 液体／えきたい／液體 | `general-listening-83:液体` | `liquid.svg` | 從傾斜壺流入透明杯，流動曲線與水面表液體性質。 |
| 47 | general／名詞 | 笛／ふえ／笛子 | `general-listening-78:笛` | `flute.svg` | 長笛管身、吹口及連續指孔，非長棍或單音符。 |
| 48 | general／名詞 | 太鼓／たいこ／鼓 | `general-listening-78:太鼓` | `drum.svg` | 鼓面與鼓身、交叉鼓棒，不是鍋碗。 |
| 49 | general／名詞 | 舞台／ぶたい／舞台 | `general-listening-80:舞台` | `stage.svg` | 抬高表演平台、聚光燈及演員位置，主體為演出空間。 |
| 50 | general／名詞 | 衣装／いしょう／服裝 | `general-listening-80:衣装` | `costume.svg` | 演出服披風、誇張領片與冠狀頭飾，區別日常服裝。 |
| 51 | general／名詞 | 倉庫／そうこ／倉庫 | `general-listening-81:倉庫` | `warehouse.svg` | 寬捲門工業倉房，內部貨架與堆放箱，非住宅。 |
| 52 | general／名詞 | 崖／がけ／懸崖 | `general-listening-67:崖` | `cliff.svg` | 陡直斷崖和下方河谷，重點為落差非一般山。 |
| 53 | general／名詞 | 坂／さか／坡道 | `general-listening-10:坂` | `slope.svg` | 一條連續傾斜道路、人物沿坡行走，非階梯或陡崖。 |
| 54 | general／名詞 | 路地／ろじ／巷弄 | `general-listening-77:路地` | `alley.svg` | 兩側近距離建築夾出窄通道，非寬廣大道。 |
| 55 | general／名詞 | 桟橋／さんばし／碼頭棧橋 | `general-listening-30:桟橋` | `pier.svg` | 木板平台從岸伸向水面，支柱可見，非跨河橋。 |
| 56 | general／名詞 | 運動場／うんどうじょう／運動場 | `general-listening-46:運動場` | `sportsfield.svg` | 橢圓跑道圍繞草地與球門，表運動場地。 |
| 57 | general／名詞 | 浴室／よくしつ／浴室 | `general-listening-45:浴室` | `bathroom.svg` | 浴缸、蓮蓬頭與磁磚牆，表洗浴房間而非單一沐浴動作。 |
| 58 | general／名詞 | 屋上／おくじょう／屋頂 | `general-listening-61:屋上` | `rooftop.svg` | 建築頂部平坦露臺、護欄與人物，明確是屋頂之上可活動區。 |
| 59 | general／名詞 | 罠／わな／陷阱 | `general-listening-75:罠` | `trap.svg` | 樹林地面偽裝的陷坑、部分遮蓋枝葉與落入箭頭，非普通洞窟。 |
| 60 | general／名詞 | 足跡／あしあと／足跡 | `general-listening-25:足跡` | `footprints.svg` | 鞋底形狀一前一後連成行進痕跡，非現存腳或無意義斑點。 |
| 61 | general／動詞 | 滑る／すべる／滑倒 | `general-listening-121:滑る` | `slipping.svg` | 鞋在濕地失去抓地、身體後仰但未倒地，與跌倒結果區分。 |
| 62 | general／動詞 | 転ぶ／ころぶ／跌倒 | `general-listening-102:転ぶ` | `fallingover.svg` | 人物跌倒在路面、腳被小障礙絆住，表摔倒而非滑行中的失衡。 |
| 63 | general／動詞 | 始める／はじめる／開始 | `general-listening-03:始める` | `startingtask.svg` | 手按啟動裝置、未運行齒輪旁首個動作箭頭，表主動開始而非賽事自發開始。 |
| 64 | general／名詞 | 出発／しゅっぱつ／出發 | `general-listening-03:出発` | `departure.svg` | 攜行李者離開起點，車站平台與向前路線，不是抵達。 |
| 65 | general／動詞 | 戻る／もどる／返回 | `general-listening-03:戻る` | `returningplace.svg` | 人物沿回返箭頭返回先前的旗標位置，未限定回家。 |
| 66 | general／動詞 | 動く／うごく／移動 | `general-listening-02:動く` | `moving.svg` | 裝置輪子旋轉、機械臂有位移殘影與箭頭，表物件正在運動。 |
| 67 | general／動詞 | 変わる／かわる／改變 | `general-listening-06:変わる` | `changing.svg` | 毛毛蟲變為蝴蝶的階段差異，用蛹與箭頭連接，非單純換色。 |
| 68 | general／動詞 | 治る／なおる／痊癒；恢復 | `general-listening-07:治る` | `healing.svg` | 同一手臂傷口由包紮到完整皮膚，箭頭向恢復端，不表治療者施藥。 |
| 69 | general／動詞 | 直す／なおす／修理；改正 | `general-listening-07:直す` | `repairing.svg` | 維修者用螺絲起子修有裂縫的裝置，零件連回原位；與治病分開。 |
| 70 | general／動詞 | 調べる／しらべる／調查；查詢 | `general-listening-07:調べる` | `investigating.svg` | 放大鏡檢查地圖細節並記錄，表調查查找，不只看向物件。 |
| 71 | general／動詞 | 誘う／さそう／邀請 | `general-listening-04:誘う` | `inviting.svg` | 人物向旁人伸手邀請加入桌旁活動，保留空位，不是強拉。 |
| 72 | general／動詞 | 任せる／まかせる／交給；委託 | `general-listening-05:任せる` | `entrusting.svg` | 一人把任務夾板交給另一人，接收者負責操作旁邊裝置，表委託。 |
| 73 | general／名詞 | 案内／あんない／引導；帶路 | `general-listening-05:案内` | `guiding.svg` | 嚮導走在前方指向路線，另一人跟隨，表帶路的一例。 |
| 74 | general／動詞 | 比べる／くらべる／比較 | `general-listening-10:比べる` | `comparing.svg` | 兩個不同高度物件並排，用尺與雙向對照連接，表比較。 |
| 75 | general／動詞 | 近づく／ちかづく／靠近 | `general-listening-09:近づく` | `approaching.svg` | 人物腳步向目標靠近，前後距離縮小示意，不是已經很近的狀態。 |
| 76 | general／動詞 | 離れる／はなれる／離開；遠離 | `general-listening-09:離れる` | `movingaway.svg` | 人物背離原位置，箭頭向遠處而非回到原處。 |
| 77 | general／動詞 | 触る／さわる／觸碰 | `general-listening-09:触る` | `touching.svg` | 伸出的食指輕觸物件表面，接觸點有短光線，非用力按鈕。 |
| 78 | n5／動詞 | 返す／かえす／歸還（て形：返して） | `stage0-day15:返す` | `returningitem.svg` | 物件從借用者手中回到擁有者，回返弧箭頭與原位輪廓，非初次給予。 |
| 79 | general／名詞 | 連絡／れんらく／聯絡 | `general-listening-12:連絡` | `contacting.svg` | 兩人以通訊裝置相連，中間雙向訊息線，不限電話單一名詞。 |
| 80 | general／動詞 | 着替える／きがえる／換衣服 | `general-listening-12:着替える` | `changingclothes.svg` | 人物換下上衣、正套上另一件外衣，兩種衣型清楚，不僅換色。 |
| 81 | general／動詞 | 片づける／かたづける／整理 | `general-listening-12:片づける` | `tidying.svg` | 散落積木正放入分格盒，桌面從散亂趨向整齊，不是丟棄。 |
| 82 | general／動詞 | 届ける／とどける／送達 | `general-listening-13:届ける` | `delivering.svg` | 送件者把包裹交到有收件人的門口，表主動送達，不是單純郵寄。 |
| 83 | general／動詞 | 届く／とどく／到達 | `general-listening-13:届く` | `arrivedparcel.svg` | 包裹已在收件處，收件人指向抵達物，強調到達狀態，無送出動作。 |
| 84 | general／動詞 | 受け取る／うけとる／收下 | `general-listening-13:受け取る` | `parcelreceiving.svg` | 接收者雙手承接從另一側遞來的包裹，方向落在收方。 |
| 85 | general／動詞 | 見つける／みつける／找到 | `general-listening-14:見つける` | `finding.svg` | 人物從搜尋中的雜物中發現鑰匙，放大焦點與驚覺線表找到。 |
| 86 | general／動詞 | 落とす／おとす／掉落；弄掉 | `general-listening-15:落とす` | `dropping.svg` | 手中硬幣向下掉落，手在上方且動作方向朝地，表主動弄掉。 |
| 87 | general／動詞 | 拾う／ひろう／撿起 | `general-listening-15:拾う` | `pickingup.svg` | 人物彎腰把地上的物品拾起，箭頭向上回到手。 |
| 88 | general／動詞 | 壊す／こわす／弄壞 | `general-listening-15:壊す` | `breakingitem.svg` | 人物碰撞使杯子破裂，動作原因在畫面中，與自發損壞分開。 |
| 89 | general／動詞 | 壊れる／こわれる／壞掉 | `general-listening-15:壊れる` | `broken.svg` | 破裂的水壺漏水、零件分離，無施力者，表壞掉結果。 |
| 90 | general／動詞 | 破る／やぶる／撕破 | `general-listening-15:破る` | `tearing.svg` | 雙手向兩邊撕開紙張，裂縫清晰，是主動撕破。 |
| 91 | general／動詞 | 破れる／やぶれる／破掉 | `general-listening-15:破れる` | `torn.svg` | 衣服肘部出現破洞與磨損線，表破掉狀態，不含施力手。 |
| 92 | general／動詞 | 汚す／よごす／弄髒 | `general-listening-15:汚す` | `dirtying.svg` | 手不慎打翻飲料到桌布，傾倒源頭與新污漬同時可見。 |
| 93 | general／動詞 | 汚れる／よごれる／變髒 | `general-listening-15:汚れる` | `stained.svg` | 白襯衫沾污斑、袖口污跡，表髒污結果而非主動倒飲料。 |
| 94 | general／動詞 | しまう／しまう／收起；結束 | `general-listening-15:しまう` | `puttingaway.svg` | 雙手把摺好衣物收進抽屜，儲放而非隨手放桌面。 |
| 95 | general／動詞 | 包む／つつむ／包起來 | `general-listening-18:包む` | `wrapping.svg` | 雙手用包裝紙包住盒子，紙角折進中央，與已完成禮物物件分開。 |
| 96 | general／動詞 | 持っていく／もっていく／帶去 | `general-listening-08:持っていく` | `takingaway.svg` | 人物持包從說話者所在出發往遠處，箭頭離開出發標記。 |
| 97 | general／動詞 | 持ってくる／もってくる／帶來 | `general-listening-08:持ってくる` | `bringing.svg` | 人物持包朝說話者所在地靠近，箭頭指向近側接收人。 |
| 98 | n5／動詞 | 並べる／ならべる／排列、擺放（禮貌形：並べます） | `stage0-day24:並べる` | `arranging.svg` | 手把最後一本書放入同方向的一列，表主動排列而非排隊等待。 |
| 99 | general／動詞 | 回す／まわす／轉動 | `general-listening-20:回す` | `turningknob.svg` | 手握旋鈕作旋轉，圓弧箭頭表示轉動而非按壓。 |
| 100 | general／動詞 | 戻す／もどす／恢復；放回 | `general-listening-20:戻す` | `puttingback.svg` | 把拿出的書放回書架原來空位，有回返箭頭指向缺口。 |
| 101 | general／動詞 | 踊る／おどる／跳舞 | `general-listening-32:踊る` | `dancing.svg` | 人物張開雙臂、交叉腳步隨音樂舞動，非單純站立。 |
| 102 | general／動詞 | 描く／かく／畫；描繪 | `general-listening-32:描く` | `drawing.svg` | 手持畫筆在畫紙描出山樹，筆尖與未完成線條，區別抄寫文字。 |
| 103 | general／動詞 | 写す／うつす／抄寫；複製 | `general-listening-34:写す` | `copyingbyhand.svg` | 左右兩張相同幾何圖案、手正在依原稿抄到右側，非機器複印。 |
| 104 | general／動詞 | 謝る／あやまる／道歉 | `general-listening-36:謝る` | `apologizing.svg` | 人物低頭向對方鞠躬，破杯一旁說明過失；不是雙方行禮致意。 |
| 105 | anime／動詞 | 許す／ゆるす／允許；原諒 | `anime-lesson-04:許す` | `forgiving.svg` | 道歉者低頭，對方張開手放下責備；斷開的怒氣泡表示不再責怪。 |
| 106 | general／動詞 | 乾かす／かわかす／弄乾 | `general-listening-37:乾かす` | `dryingclothes.svg` | 手將濕衣物掛起晾乾，陽光與風線表主動弄乾，不是已乾的布。 |
| 107 | general／動詞 | 拭く／ふく／擦拭 | `general-listening-68:拭く` | `wiping.svg` | 手持布在有水漬桌面擦拭，布後面乾淨、前面留水珠。 |
| 108 | general／動詞 | 思い出す／おもいだす／想起 | `general-listening-69:思い出す` | `recalling.svg` | 人物思考泡泡中浮現先前看過的物件與回返箭頭，表回想而非初次學會。 |
| 109 | general／動詞 | 隠れる／かくれる／躲藏 | `general-listening-70:隠れる` | `hiding.svg` | 人物半身藏在大樹後，只露眼睛和一隻腳，表主動躲藏。 |
| 110 | general／動詞 | 追う／おう／追逐 | `general-listening-74:追う` | `chasing.svg` | 後方人物沿同一路線追前方人物，方向一致、間距清楚。 |
| 111 | general／動詞 | 踏む／ふむ／踩踏 | `general-listening-75:踏む` | `steppingon.svg` | 鞋底壓到地上的板，接觸點重點線，表踩踏不是踢。 |
| 112 | general／動詞 | 外す／はずす／取下 | `general-listening-76:外す` | `removing.svg` | 手從掛勾取下帽子，箭頭離開勾掛原位，非放回。 |
| 113 | general／動詞 | 配る／くばる／分發 | `general-listening-82:配る` | `distributing.svg` | 一人把多份資料分給數個人，清楚一對多而非單次授受。 |
| 114 | general／動詞 | 預ける／あずける／寄放 | `general-listening-45:預ける` | `entruststorage.svg` | 持物者把箱子交入寄存櫃檯，箭頭從客人指向保管方。 |
| 115 | general／動詞 | 預かる／あずかる／保管 | `general-listening-45:預かる` | `keepforother.svg` | 櫃檯人員收妥別人的箱子置入身後保管格，焦點在接管者。 |
| 116 | general／動詞 | 持ち上げる／もちあげる／抬起 | `general-listening-33:持ち上げる` | `lifting.svg` | 人物屈膝雙手抬箱向上，箭頭向上，不是水平搬運。 |
| 117 | general／動詞 | 付き添う／つきそう／陪同 | `general-listening-47:付き添う` | `accompanyingpatient.svg` | 健康者扶著持杖病人同行去診療處，重點是陪同而非一般並肩。 |
| 118 | general／動詞 | 迎える／むかえる／迎接 | `general-listening-25:迎える` | `welcomingarrival.svg` | 等待者在抵達門口張手迎接帶行李旅人，與送別方向分開。 |
| 119 | general／動詞 | 見送る／みおくる／送行 | `general-listening-25:見送る` | `seeingoff.svg` | 留在起點者揮手，旅人帶行李朝外離開，表送行而非一般打招呼。 |
| 120 | general／動詞 | 集める／あつめる／收集 | `general-listening-25:集める` | `collecting.svg` | 手把分散在各處的球收進同一籃子，表聚集動作。 |
| 121 | general／形容詞 | 深い／ふかい／深的 | `general-listening-121:深い` | `deep.svg` | 剖面水井的井底遠低於地面，以垂直深度箭頭示落差。 |
| 122 | general／動詞 | 狙う／ねらう／瞄準 | `general-listening-124:狙う` | `aiming.svg` | 射手拉弓對準靶心，尚未放箭，區分瞄準與命中。 |
| 123 | general／動詞 | 当たる／あたる／擊中 | `general-listening-124:当たる` | `hittingtarget.svg` | 箭已插中靶面，命中接觸點可見，不表示正在瞄準。 |
| 124 | n5／形容詞 | 欲しい／ほしい／想要（い形容詞） | `stage0-day13:欲しい` | `wanting.svg` | 人物朝櫥窗內物品伸手、心形泡泡指向目標，表想要而非已擁有。 |
| 125 | n5／形容詞 | 若い／わかい／年輕的 | `stage0-day19:若い` | `young.svg` | 年輕成人與較年長者的側邊參照，年輕者光滑面容與活躍姿態，不等同幼童。 |
| 126 | n5／形容詞 | かわいい／かわいい／可愛的 | `stage0-day19:かわいい` | `cute.svg` | 小兔抱小胡蘿蔔、圓潤幼態與愛心，表可愛感受而非動物總稱。 |
| 127 | n5／名詞 | 病気／びょうき／生病、疾病 | `stage0-day17:病気` | `illness.svg` | 床上患者、體溫計與藥品，疾病狀態，不只睡覺。 |
| 128 | n5／名詞 | 風邪／かぜ／感冒 | `stage0-day17:風邪` | `coldillness.svg` | 人物流鼻水、用紙巾擦鼻並裹圍巾，表感冒而非單純冷。 |
| 129 | n5／名詞 | 熱／ねつ／發燒、熱度 | `stage0-day17:熱` | `fever.svg` | 額頭發熱的病人配體溫計紅色液柱，詞義發燒，不套熱水。 |
| 130 | n5／動詞 | 疲れる／つかれる／累（て形：疲れて） | `stage0-day17:疲れる` | `tired.svg` | 搬物後坐下垂肩、汗滴與放下的箱子，表疲憊而非懶散。 |
| 131 | n5／動詞 | 困る／こまる／困擾、為難 | `stage0-day17:困る` | `troubled.svg` | 人物面對打結的繩與未能開的箱蓋，攤手無策，表為難而非疑問標記。 |
| 132 | general／形容詞 | 悲しい／かなしい／悲傷的 | `general-listening-56:悲しい` | `sad.svg` | 人物讀到失落消息，垂眼與下彎嘴，無大顆哭淚區分哭泣動作。 |
| 133 | general／形容詞 | 寂しい／さびしい／寂寞的 | `general-listening-56:寂しい` | `lonely.svg` | 獨坐者身邊兩張空椅與空桌，表缺乏陪伴的孤單而非一般悲傷。 |
| 134 | general／形容詞 | 怖い／こわい／害怕的 | `general-listening-56:怖い` | `afraid.svg` | 人物退縮面對前方巨大陰影，汗滴與蜷曲姿態表恐懼。 |
| 135 | general／名詞 | 不安／ふあん／不安 | `general-listening-56:不安` | `anxious.svg` | 等待尚未確定結果的人緊握雙手，遠處未開啟的通知信，表未來不安。 |
| 136 | general／名詞 | 緊張／きんちょう／緊張 | `general-listening-56:緊張` | `nervous.svg` | 人物即將站上講臺，面向觀眾、手握緊與抖動線，表臨場緊張。 |
| 137 | general／動詞 | 怒る／おこる／生氣 | `general-listening-56:怒る` | `angry.svg` | 人物皺眉、握拳，對話泡泡有尖角而無文字，明確生氣表情。 |
| 138 | general／動詞 | 驚く／おどろく／驚訝 | `general-listening-56:驚く` | `surprised.svg` | 人物看到突然跳出的盒中彈簧，張口後仰，表驚訝而非恐懼陰影。 |
| 139 | general／動詞 | 泣く／なく／哭 | `general-listening-56:泣く` | `crying.svg` | 大顆淚水從眼睛向下、手擦拭臉頰，表哭泣動作，不只是悲傷。 |
| 140 | general／動詞 | 黙る／だまる／沉默 | `general-listening-56:黙る` | `silentperson.svg` | 交談中一人閉口聽對方，空白小泡泡逐漸停止，無禁止或噤聲命令手勢。 |
| 141 | general／動詞 | 悩む／なやむ／煩惱 | `general-listening-56:悩む` | `worrying.svg` | 人物伏桌抱頭，兩個選項岔路留在思考泡泡內，表煩惱難決。 |
| 142 | general／名詞 | 自信／じしん／自信 | `general-listening-56:自信` | `confidence.svg` | 人物挺胸站穩、手指自己完成的成果，表對能力有把握而非已獲勝。 |
| 143 | general／形容動詞 | 慎重／しんちょう／慎重 | `general-listening-57:慎重` | `cautious.svg` | 人物在易碎器皿旁雙手穩穩搬持，慢步與注意目光，表謹慎態度。 |
| 144 | general／形容動詞 | 親切／しんせつ／親切 | `general-listening-16:親切` | `kindness.svg` | 路人主動幫提重袋，受助者輕鬆微笑，表親切助人而非單純授受。 |
| 145 | n5／形容動詞 | 大切／たいせつ／重要、珍貴（な形容詞） | `stage0-day21:大切` | `precious.svg` | 人物雙手呵護珍惜的小物，心形輪廓保護它，表珍重而非價格昂貴。 |
| 146 | n5／形容動詞 | 同じ／おなじ／相同的（後面接名詞不加「な」） | `stage0-day21:同じ` | `same.svg` | 兩把形狀、大小、齒形完全一致的鑰匙並排，以等距對照表示相同。 |
| 147 | n5／動詞 | 違う／ちがう／不同、不對（禮貌形：違います） | `stage0-day21:違う` | `different.svg` | 兩把鑰匙齒形與頭形不同，指向不相合處，差異不只換色。 |
| 148 | general／形容動詞 | 丁寧／ていねい／有禮貌；仔細 | `general-listening-31:丁寧` | `carefulpolite.svg` | 人物雙手托著茶杯輕放於杯墊，動作細緻，不用單一鞠躬兼表所有禮貌。 |
| 149 | general／形容動詞 | 正確／せいかく／正確 | `general-listening-22:正確` | `accurate.svg` | 量具刻度與剛好吻合的裁切尺寸，對齊端點，表準確而非單純成功。 |
| 150 | general／形容動詞 | 透明／とうめい／透明 | `general-listening-83:透明` | `transparent.svg` | 透過玻璃仍看見後方完整花朵，非杯中液體或單一輪廓。 |
| 151 | general／形容詞 | 眩しい／まぶしい／刺眼的 | `general-listening-72:眩しい` | `dazzling.svg` | 人抬手遮眼面對強烈光源，多條光束明確表刺眼。 |
| 152 | general／形容詞 | 騒がしい／さわがしい／吵鬧的 | `general-listening-38:騒がしい` | `clamor.svg` | 多人同時交談、樂器與重疊音波，表環境吵雜，不等同單一人大聲。 |
| 153 | general／動詞 | 湿る／しめる／潮濕 | `general-listening-21:湿る` | `damp.svg` | 毛巾局部濕斑與少量水珠，仍非滴水全濕，也不是天氣潮濕的空氣。 |
| 154 | general／形容動詞 | 平ら／たいら／平坦 | `general-listening-10:平ら` | `flat.svg` | 平整桌面水平線與放穩的球，旁小地形起伏作對照，主體是平面。 |
| 155 | general／形容動詞 | 不便／ふべん／不方便 | `general-listening-10:不便` | `inconvenient.svg` | 人物提重袋繞過遠處唯一入口，近側路被圍欄阻隔，表不方便。 |
| 156 | general／名詞 | 無料／むりょう／免費 | `general-listening-35:無料` | `freeofcharge.svg` | 服務檯提供一杯水，硬幣留在客人手裡不移交，以清楚免收費線索表免費。 |
| 157 | general／名詞 | 有料／ゆうりょう／需付費 | `general-listening-35:有料` | `paidservice.svg` | 使用服務前硬幣從使用者交至收費盤，服務物件在檯後，與免費反向。 |
| 158 | general／名詞 | 満席／まんせき／客滿 | `general-listening-41:満席` | `fullseats.svg` | 一排每個座位都坐了人，晚來者站旁無空位，不只擁擠。 |
| 159 | general／名詞 | 空腹／くうふく／空腹 | `general-listening-28:空腹` | `hungry.svg` | 人物按著空肚，思考泡泡內有餐點，表餓而非單純腹部。 |
| 160 | general／形容詞 | 苦い／にがい／苦的 | `general-listening-43:苦い` | `bitter.svg` | 人物喝一口藥湯皺臉、杯中苦草葉，表苦味而非辣椒辛味。 |
| 161 | general／形容詞 | 温かい／あたたかい／溫暖的 | `general-listening-37:温かい` | `warmfood.svg` | 雙手捧熱湯杯、柔和蒸氣，表食物溫暖；與炎熱天氣及滾燙痛感分開。 |
| 162 | general／副詞 | そっくり／そっくり／一模一樣 | `general-listening-74:そっくり` | `lookalike.svg` | 親子兩隻貓有相同斑紋、姿態與臉型但大小不同，表酷似而非完全相同。 |
| 163 | general／副詞 | 別々／べつべつ／分開 | `general-listening-79:別々` | `separately.svg` | 兩人各坐自己的桌子、物品各在獨立盒子，表分別而非一起。 |
| 164 | general／副詞 | 少しずつ／すこしずつ／一點一點地 | `general-listening-27:少しずつ` | `littlebylittle.svg` | 小匙一次加入少量米粒到碗，連續小步箭頭表示逐點增加。 |
| 165 | n5／副詞 | だんだん／だんだん／漸漸地 | `stage0-day19:だんだん` | `gradually.svg` | 同一盆栽由嫩芽到長葉，連續階段逐漸成長，非突然變化或一次灌入。 |
| 166 | n5／副詞 | 時々／ときどき／有時候 | `stage0-day9:時々` | `sometimes.svg` | 一列五個時段中只有兩個有活動小圖，其餘留白，表偶爾而非每天。 |
| 167 | n5／副詞 | 毎日／まいにち／每天 | `stage0-day11:毎日` | `everyday.svg` | 連續多個日曆格都做同一件閱讀活動，無空格，表每天而非偶爾。 |
| 168 | n5／副詞 | 初めて／はじめて／第一次 | `stage0-day18:初めて` | `firsttime.svg` | 新手首次學溜冰，旁教練扶手、未使用的新鞋盒，表第一次經驗不是第一名。 |
| 169 | n5／副詞 | すぐ／すぐ／馬上 | `stage0-day17:すぐ` | `immediately.svg` | 響起的門鈴與人物立刻伸手開門，短直箭頭表沒有久候。 |
| 170 | n5／副詞 | ちょうど／ちょうど／剛好、正好 | `stage0-day17:ちょうど` | `exactly.svg` | 物品尺寸剛好吻合收納空位，邊緣對齊無多餘空間，表正好。 |
| 171 | general／副詞 | 突然／とつぜん／突然 | `general-listening-19:突然` | `suddenly.svg` | 平靜天氣中一陣突風吹走帽子，人物驚覺與突現線，非慢慢變化。 |
| 172 | general／副詞 | 直接／ちょくせつ／直接 | `general-listening-22:直接` | `directly.svg` | 兩人之間單一步驟交付，旁邊的中介路徑未採用，表直接而非轉手。 |
| 173 | general／名詞 | 間接／かんせつ／間接 | `general-listening-51:間接` | `indirectly.svg` | 物品或消息經中間一人轉交另一人，兩段箭頭明確表透過中介。 |
| 174 | general／名詞 | 事前／じぜん／事前 | `general-listening-18:事前` | `beforehand.svg` | 先完成準備打勾，右側未開始的門後活動，時間箭頭連接先備與後事。 |
| 175 | general／名詞 | 途中／とちゅう／途中 | `general-listening-55:途中` | `halfway.svg` | 從起點到終點的路徑上，人物位於中段且未到終點。 |
| 176 | general／名詞 | 往復／おうふく／來回 | `general-listening-26:往復` | `roundtrip.svg` | 同一起終點之間兩條反向箭頭，一去一回，非兩段不同目的地。 |
| 177 | general／名詞 | 片道／かたみち／單程 | `general-listening-26:片道` | `oneway.svg` | 一個起點往一個目的地只有向前路線，回程未畫，表單程。 |
| 178 | general／名詞 | 寄り道／よりみち／繞道 | `general-listening-26:寄り道` | `detourstop.svg` | 主路途中轉進小店再回主路，繞去另一處而非只選較長路線。 |
| 179 | general／名詞 | 遠回り／とおまわり／繞遠路 | `general-listening-10:遠回り` | `longwayround.svg` | 起終點相同，人物選擇繞大弧路避開中央區，與短直路形成距離對比。 |
| 180 | general／名詞 | 近道／ちかみち／捷徑 | `general-listening-10:近道` | `shortcut.svg` | 起終點相同，走穿中央的短通道，外圍彎路作對照，不表物理相鄰。 |
| 181 | general／名詞 | 予定／よてい／預定；計畫 | `general-listening-04:予定` | `scheduledplan.svg` | 日曆格內標出將到來的會面圖示，人物指向未來時段，表預定安排。 |
| 182 | general／名詞 | 用事／ようじ／要辦的事 | `general-listening-04:用事` | `errand.svg` | 人物拿清單出門辦寄件與買物，具體事務而非抽象目的。 |
| 183 | general／名詞 | 都合／つごう／時間安排；方便與否 | `general-listening-04:都合` | `availability.svg` | 兩人的時間安排只有一段重疊可會合，表是否有空的時間適合度。 |
| 184 | general／形容動詞 | 残念／ざんねん／可惜；遺憾 | `general-listening-04:残念` | `disappointment.svg` | 人物到達時入口已關閉，垂肩與落空票券，表事情不如願的可惜。 |
| 185 | n5／名詞 | 意味／いみ／意思、意義 | `stage0-day18:意味` | `meaning.svg` | 路標的箭頭與人物理解後走向對應方向，表符號所指含義，不用文字解答案。 |
| 186 | general／形容動詞 | 必要／ひつよう／必要 | `general-listening-06:必要` | `necessary.svg` | 啟門缺少的鑰匙正好對應鎖孔，表不可缺少條件而非只是想要。 |
| 187 | general／名詞 | 希望／きぼう／希望；願望 | `general-listening-07:希望` | `hope.svg` | 人物從陰暗小窗望向遠處露光的道路，表期待將來的正面可能，非已達成。 |
| 188 | general／名詞 | 負担／ふたん／負擔 | `general-listening-08:負担` | `burden.svg` | 人物背著多件工作箱彎腰，另一箱將加入，表承擔的壓力而非單純重量比較。 |
| 189 | general／名詞 | 許可／きょか／許可 | `general-listening-09:許可` | `permission.svg` | 管理者在申請圖示上打勾並開啟門閂，表授權准許，不是任意開門。 |
| 190 | general／名詞 | 禁止／きんし／禁止 | `general-listening-09:禁止` | `prohibition.svg` | 入口前欄杆與擋手示意，表示不可進入；不用特定禁止標誌代替靜か。 |
| 191 | general／名詞 | 規則／きそく／規則 | `general-listening-09:規則` | `rules.svg` | 棋盤上棋子只能按規定路徑走，對的路徑勾選、越格路徑止住，表規則。 |
| 192 | general／名詞 | 順番／じゅんばん／順序；輪流 | `general-listening-09:順番` | `turnorder.svg` | 三人等候，最前者輪到服務檯，其餘依序在後，不是把物件分類。 |
| 193 | general／名詞 | 量／りょう／份量 | `general-listening-11:量` | `quantity.svg` | 同種顆粒裝在高低不同刻度容器，以刻度和填充水準表數量／份量。 |
| 194 | general／名詞 | 追加／ついか／追加 | `general-listening-11:追加` | `addition.svg` | 已有一盒食材，手再添一份到盒中，新增物與原有物分清。 |
| 195 | general／動詞 | 余る／あまる／剩餘 | `general-listening-11:余る` | `leftover.svg` | 分餐給兩人後仍留下一份，已分與多出份量並列，表用後剩餘。 |
| 196 | general／形容詞 | 足りない／たりない／不足 | `general-listening-11:足りない` | `insufficient.svg` | 三個位置只有兩份用品，空位虛輪廓與等待者表示不足，不只是少量。 |
| 197 | general／名詞 | 予備／よび／備用 | `general-listening-15:予備` | `spare.svg` | 正在使用的電池旁另留一組封存備用品，主次清楚，不是所有數量都在使用。 |
| 198 | general／名詞 | お礼／おれい／道謝；謝禮 | `general-listening-16:お礼` | `thanks.svg` | 受助者向幫忙者鞠躬並回贈小物，心意來自完成幫忙的情境，不是一般購買。 |
| 199 | general／名詞 | 相談／そうだん／商量；諮詢 | `general-listening-17:相談` | `consultation.svg` | 兩人在桌旁共同看岔路方案、彼此交換想法，表商量而非一方下命令。 |
| 200 | general／名詞 | 助言／じょげん／建議 | `general-listening-17:助言` | `advice.svg` | 有經驗者指出方案可改進之處，聽者持自己的計畫，非代做。 |
| 201 | anime／名詞 | 計画／けいかく／計畫 | `anime-lesson-07:計画` | `planning.svg` | 出發前在桌上設計到達目標的路線，路線與預備物，表行動計畫不是單個日期。 |
| 202 | general／名詞 | 点検／てんけん／檢查 | `general-listening-18:点検` | `inspection.svg` | 手持清單逐一檢查設備連接處，每項對應實際零件，不是泛用成功勾號。 |
| 203 | general／名詞 | 変更／へんこう／變更 | `general-listening-19:変更` | `changeplan.svg` | 原來日曆位置被移到另一格，清楚重排而非單純未定計畫。 |
| 204 | general／名詞 | 期待／きたい／期待 | `general-listening-19:期待` | `expectation.svg` | 人物望著即將打開的禮盒，前傾和星形眼神線索表期待，不是已收到後慶祝。 |
| 205 | general／名詞 | 方法／ほうほう／方法 | `general-listening-20:方法` | `method.svg` | 相同目標可透過兩條具體操作路徑完成，用步驟圖區分方法而不是結果。 |
| 206 | general／動詞 | 慣れる／なれる／習慣 | `general-listening-20:慣れる` | `gettingused.svg` | 人物從不穩騎車到穩定騎行，兩階段身姿變化表熟悉適應而非新技能保證。 |
| 207 | general／名詞 | 予報／よほう／預報 | `general-listening-21:予報` | `forecast.svg` | 氣象員在地圖顯示將來雨區與雲的行進，不直接把目前下雨當預報。 |
| 208 | general／名詞 | 避難／ひなん／避難 | `general-listening-21:避難` | `evacuation.svg` | 人們沿箭頭離開冒煙建築到安全集合處，不是向危險靠近或單一逃跑。 |
| 209 | general／名詞 | 情報／じょうほう／資訊 | `general-listening-22:情報` | `information.svg` | 觀察所得的地圖、圖像與回報匯入資料板，表可傳遞的資訊而非問號。 |
| 210 | general／名詞 | 噂／うわさ／傳聞 | `general-listening-22:噂` | `rumor.svg` | 三人依次轉述同一消息，最後的物件輪廓與初始不同，表示未核實傳聞。 |
| 211 | general／名詞 | 意見／いけん／意見 | `general-listening-23:意見` | `opinion.svg` | 兩人各提出不同可行路線的泡泡，方案並存，表個人看法而非已確定事實。 |
| 212 | general／名詞 | 根拠／こんきょ／根據 | `general-listening-23:根拠` | `grounds.svg` | 濕傘與水滴支持剛下雨的判斷，以可觀察線索連到結論，不是泛用問號。 |
| 213 | general／名詞 | 予測／よそく／預測 | `general-listening-23:予測` | `prediction.svg` | 人物觀察球的當前位置與方向，虛線推想落點，表基於線索推估未來。 |
| 214 | anime／名詞 | 可能性／かのうせい／可能性 | `anime-lesson-07:可能性` | `possibility.svg` | 同一岔路有兩個尚未選定的結果，一處晴一處雨，表可能結果並存而非保證。 |
| 215 | general／名詞 | 確信／かくしん／確信 | `general-listening-23:確信` | `conviction.svg` | 人物確認鎖匙與鎖吻合、檢核已完成，站姿穩定，表證據後有把握而非盲猜。 |
| 216 | general／名詞 | 目的／もくてき／目的 | `general-listening-25:目的` | `purpose.svg` | 路線末端的目標旗被明確圈出，人物朝向它，強調為何前往的目標。 |
| 217 | general／名詞 | 手がかり／てがかり／線索 | `general-listening-25:手がかり` | `clue.svg` | 從遺落扣子與腳印接續到方向，放大鏡焦點在物理線索而非結論。 |
| 218 | general／名詞 | 行方／ゆくえ／去向 | `general-listening-25:行方` | `whereabouts.svg` | 人物離開後只留下延伸到畫外的腳印，尋找者看向遠方，表去向不明而非泛用地點。 |
| 219 | general／名詞 | 待機／たいき／待命 | `general-listening-26:待機` | `standby.svg` | 穿裝備者在待命位置看著尚未亮起的信號，準備好但未開始執行。 |
| 220 | general／名詞 | 成長／せいちょう／成長 | `general-listening-27:成長` | `growth.svg` | 孩子隨時間長高，門框上三段身高記錄，表生長而非能力評分。 |
| 221 | general／名詞 | 上達／じょうたつ／進步 | `general-listening-27:上達` | `improvement.svg` | 練投者的箭落點從散到靶心，表技能進步，不只一般時間成長。 |
| 222 | general／名詞 | 習慣／しゅうかん／習慣 | `general-listening-27:習慣` | `habit.svg` | 每日同一時段刷牙，時鐘與重複日曆循環相連，表固定行為而非單次動作。 |
| 223 | general／名詞 | 優先／ゆうせん／優先 | `general-listening-28:優先` | `priority.svg` | 人物先取必要藥物、把玩具暫留後方，先後選擇有明確順序，不只是喜歡。 |
| 224 | general／名詞 | 節約／せつやく／節省 | `general-listening-28:節約` | `saving.svg` | 人物關掉空房燈、把剩餘硬幣放存錢盒，表減少浪費保留資源。 |
| 225 | general／名詞 | 我慢／がまん／忍耐 | `general-listening-28:我慢` | `enduring.svg` | 人物忍住吃甜點的衝動，握手放膝、眼望點心但尚未取，表克制忍耐。 |
| 226 | general／名詞 | 自由／じゆう／自由 | `general-listening-29:自由` | `freedom.svg` | 打開籠門的小鳥飛向廣闊天空，表無拘束的自由而非一般飛行。 |
| 227 | general／動詞 | 決める／きめる／決定 | `general-listening-30:決める` | `deciding.svg` | 多個方案中手指選定一項並標記，其他仍留，表作出決定而非僅挑選比較。 |
| 228 | general／名詞 | 紹介／しょうかい／介紹 | `general-listening-31:紹介` | `introducing.svg` | 中間人物把兩位尚未相識者互相引介，雙手分向兩邊，不是單純會面。 |
| 229 | n5／名詞 | 趣味／しゅみ／興趣、嗜好 | `stage0-day18:趣味` | `hobby.svg` | 下班後人物挑選畫具與吉他進行興趣活動，表休閒嗜好而非職業。 |
| 230 | general／名詞 | 興味／きょうみ／興趣 | `general-listening-32:興味` | `interest.svg` | 人物被展示物吸引而靠近仔細觀察，眼神與指向展品，非已很擅長。 |
| 231 | general／名詞 | 遠慮／えんりょ／客氣；顧慮 | `general-listening-33:遠慮` | `holdingback.svg` | 主人遞上點心，客人雙手輕擺暫不取，表客氣顧慮而非生氣拒絕。 |
| 232 | general／名詞 | 依頼／いらい／委託；請求 | `general-listening-34:依頼` | `request.svg` | 請託者把待辦清單交給能協助的人、雙手奉上，表請求而非命令。 |
| 233 | general／名詞 | 反省／はんせい／反省 | `general-listening-36:反省` | `reflection.svg` | 人物回想自己打翻的杯子、低頭記下改進做法，表檢討過失而非純悲傷。 |
| 234 | general／副詞 | お互い／おたがい／彼此 | `general-listening-37:お互い` | `mutually.svg` | 兩人相向互助，雙向各遞不同工具，清楚表互相而非單向給予。 |
| 235 | general／副詞 | はっきり／はっきり／清楚地 | `general-listening-38:はっきり` | `clearly.svg` | 清晰聲波到耳朵，旁邊雜亂聲波被移開，表聽得清楚而非音量大。 |
| 236 | general／固定表達 | なるほど／なるほど／原來如此 | `general-listening-66:なるほど` | `nowunderstand.svg` | 聽到說明後人物把拼圖最後一片對上，表理解來龍去脈，不是只是驚喜。 |
| 237 | anime／動詞 | 疑う／うたがう／懷疑 | `anime-lesson-07:疑う` | `doubting.svg` | 收到消息的人先停下，比對兩份不一致的觀察圖，不直接相信，表懷疑而非說謊。 |
| 238 | anime／名詞 | 条件／じょうけん／條件、前提 | `anime-lesson-06:条件` | `condition.svg` | 門閂需兩個不同形狀的配件均吻合才可開啟，用連接線表成立條件。 |
| 239 | anime／動詞 | 勝つ／かつ／獲勝、贏 | `anime-lesson-01:勝つ` | `winning.svg` | 比賽終點勝者舉獎盃，對手稍後抵達，表贏得比賽而非泛用成功。 |
| 240 | general／動詞 | 燃える／もえる／燃燒 | `general-listening-124:燃える` | `burning.svg` | 木柴自身燃燒、邊緣焦黑與小火焰連接可燃物，僅配124課字面燃燒，不配anime03激起熱情。 |
| 241 | anime／名詞 | 魔法／まほう／魔法 | `anime-lesson-06:魔法` | `magic.svg` | 施術者用杖使物件懸浮，懸浮與光環表虛構魔法，不畫作品角色。 |
| 242 | anime／名詞 | 詠唱／えいしょう／詠唱、吟誦咒文 | `anime-lesson-06:詠唱` | `spellchant.svg` | 施術者口旁有節奏音波，面前魔法符形光圈正在形成，區分唱歌與普通說話。 |
| 243 | anime／名詞 | 発動／はつどう／發動、開始生效 | `anime-lesson-06:発動` | `activation.svg` | 手觸發機關後整個陣列由中心向外亮起，強調啟動瞬間而非持續能力。 |
| 244 | games／固定表達 | スキャン！／スキャン！／掃描！ | `game-card:game:genshin:kaveh:skill:5c678ab450` | `scanning.svg` | 原創掃描裝置以光束掃過物件並取得其輪廓，表掃描動作，不描繪作品角色或技能外觀。 |
| 245 | anime／名詞 | 無駄／むだ／沒用、徒勞；浪費 | `anime-lesson-08:無駄` | `waste.svg` | 水龍頭不停給破桶注水，水從洞流走無法裝滿，同時表徒勞與浪費，不描繪原作場面。 |
| 246 | general／動詞 | 結ぶ／むすぶ／綁 | `general-listening-96:結ぶ` | `tyingbundle.svg` | 雙手以繩把多根木條束成一捆，繩結與集合物體清楚，不是單根繩物件。 |
| 247 | anime／動詞 | ねだる／ねだる／央求、纏著要 | `anime-lesson-03:ねだる` | `beggingfor.svg` | 孩子指向展示玩具、拉著大人袖子反覆請求，非單純想要的內在狀態。 |
| 248 | anime／名詞 | 欲張り／よくばり／貪心；貪心的人 | `anime-lesson-02:欲張り` | `greedy.svg` | 人物把多份點心都攏在自己面前，旁人空盤，表貪心而非單純食慾。 |
| 249 | anime／動詞 | 生きる／いきる／活著、生存 | `anime-lesson-02:生きる` | `living.svg` | 生命狀態以植物抽芽、呼吸中的小動物與心跳線，非單純心情開心。 |
| 250 | anime／動詞 | 伝わる／つたわる／傳達到、被理解；流傳 | `anime-lesson-02:伝わる` | `messageunderstood.svg` | 說話者的同一圖像訊息到達聽者泡泡，兩邊圖形一致且聽者點頭，表意思傳到。 |
| 251 | general／名詞 | 燃料／ねんりょう／燃料 | `general-listening-124:燃料` | `fuel.svg` | 油壺透過漏斗補入燈的燃料槽，能量來源和使用裝置連接，不只普通液體。 |
| 252 | general／名詞 | 鎧／よろい／盔甲 | `general-listening-124:鎧` | `armor.svg` | 金屬胸甲、肩甲與腿甲成套擺放，表盔甲而非持盾戰士角色。 |
| 253 | n5／動詞 | 知る／しる／知道、認識（て形：知って） | `stage0-day15:知る` | `learningfact.svg` | 從觀察記錄得知盒內物品，閉盒旁的內容圖轉入思考泡泡，表獲知事實。 |
| 254 | games／固定表達 | 爆発するよ。／ばくはつするよ。／要爆炸囉。 | `game-card:game:genshin:aloy:skill:5c2a10996f` | `explosionwarning.svg` | 小物件向外爆開、碎片與徑向氣浪，輔助爆炸事件，無原作角色；不以圖宣稱已發生或另編台詞。 |
| 255 | anime／固定表達 | 気を付ける／きをつける／注意、小心 | `anime-lesson-02:気を付ける` | `becareful.svg` | 行人注意到地面濕滑，放慢並繞開，表小心留意，不用抽象警告標誌充數。 |
| 256 | anime／動詞 | 頑張る／がんばる／努力、堅持 | `anime-lesson-01:頑張る` | `persevering.svg` | 人物推動卡住的車輪、汗與雙腳用力姿態，表持續努力而非結果保證。 |
| 257 | general／形容動詞 | 空／から／空的 | `general-listening-97:空` | `empty.svg` | 打開的容器內清楚沒有物品，內底輪廓可見，與天空義分開。 |
| 258 | general／形容詞 | 高い／たかい／昂貴的；高的 | `general-listening-42:高い` | `expensive.svg` | 購買同樣物品需要較大一疊硬幣，突出價格昂貴而非物理身高。 |
| 259 | general／動詞 | 押す／おす／按下 | `general-listening-20:押す` | `pressingbutton.svg` | 食指向內按下控制面板按鈕，有明確按壓位移，非推箱子。 |
| 260 | general／動詞 | 磨く／みがく／磨亮 | `general-listening-129:磨く` | `polishshield.svg` | 布沿盾面擦拭、半面光澤及擦拭痕，表磨亮金屬而非刷牙。 |
| 261 | general／動詞 | 守る／まもる／遵守 | `general-listening-49:守る` | `followingrules.svg` | 行人遵守路口停止信號留在停止線後，表遵守規範而非持盾保護。 |
| 262 | general／動詞 | 避ける／さける／避開 | `general-listening-06:避ける` | `avoidroute.svg` | 路線遇危險區改繞旁路，人物避開固定障礙，非閃躲飛來投射物。 |
| 263 | general／動詞 | 出す／だす／拿出 | `general-listening-62:出す` | `takingout.svg` | 手從袋中把物品拿出，箭頭離開容器，與寄出郵件義分開。 |
| 264 | general／動詞 | 切る／きる／掛斷；切斷 | `general-listening-39:切る` | `hangingup.svg` | 手把電話筒放回座機，連線兩端斷開，表掛斷而非剪切紙。 |
| 265 | general／動詞 | 見える／みえる／看得見 | `general-listening-21:見える` | `visible.svg` | 窗簾拉開後遠處房子進入視野，清晰視線連到眼睛，表可見而非主動看圖。 |
| 266 | general／形容詞 | 冷たい／つめたい／冷淡 | `general-listening-168:冷たい` | `coldattitude.svg` | 一人求助時對方轉身疏離、雙臂交叉，表態度冷淡，無冰雪線索誤表溫度。 |
| 267 | general／名詞 | 保管／ほかん／保管 | `general-listening-15:保管` | `safekeeping.svg` | 物件放入有鎖保管櫃、鍵由管理人留存，表安全保存而非取用。 |
| 268 | general／名詞 | 交換／こうかん／交換；替換 | `general-listening-16:交換` | `exchanging.svg` | 兩人各持不同物品，雙向交叉箭頭顯示互換，非單方返還。 |
| 269 | general／名詞 | 分担／ぶんたん／分工 | `general-listening-50:分担` | `sharingtasks.svg` | 共同工作被拆成搬箱與清掃兩項、各由一人負責，表分工而非物品對半。 |
| 270 | general／名詞 | 充電／じゅうでん／充電 | `general-listening-66:充電` | `charging.svg` | 電源線連接插座與電池裝置，充入箭頭向電池，非更換電池。 |
| 271 | general／名詞 | 反射／はんしゃ／反射 | `general-listening-72:反射` | `reflectionlight.svg` | 光線照鏡面後以相同角度折返，箭頭方向清楚，不用普通光芒當反射。 |
| 272 | general／動詞 | 揺れる／ゆれる／搖晃 | `general-listening-74:揺れる` | `swaying.svg` | 懸掛吊燈偏向一側、前一位置淡輪廓與左右弧箭頭，表搖晃而非物體平移。 |
| 273 | general／名詞 | 接触／せっしょく／接觸 | `general-listening-76:接触` | `contact.svg` | 兩物表面相碰在一點，指向交會處，與有距離的接近不同。 |
| 274 | general／名詞 | 手動／しゅどう／手動 | `general-listening-76:手動` | `manualcontrol.svg` | 人物用手扳控制桿帶動齒輪，機構有連桿，表人工操作而非自動感應。 |
| 275 | general／名詞 | 自動／じどう／自動 | `general-listening-76:自動` | `automatic.svg` | 感應到箱子後閘門自行打開，無人操作，感應光束連結馬達。 |
| 276 | general／名詞 | 負傷者／ふしょうしゃ／傷者 | `general-listening-77:負傷者` | `injuredperson.svg` | 一名腿部包紮、持拐杖的傷者，受傷身分可見，不把救援動作再計一義。 |
| 277 | general／名詞 | 交代／こうたい／輪替 | `general-listening-77:交代` | `takingturns.svg` | 值班者離開位置、接班者進入同一崗位，兩箭頭與單一值班椅表輪替。 |
| 278 | general／名詞 | 再生／さいせい／播放 | `general-listening-78:再生` | `playback.svg` | 播放器按下播放鍵、音軌從開始輸出聲波，無回返箭頭，與再一次區分。 |
| 279 | general／名詞 | 録音／ろくおん／錄音 | `general-listening-78:録音` | `recording.svg` | 麥克風接收人物聲音、紅色錄製圓點與儲存波形，表收音錄製非播放。 |
| 280 | general／名詞 | 保存／ほぞん／儲存 | `general-listening-79:保存` | `savingdata.svg` | 手將文件存入有保留格的資料裝置，箭頭向內、畫面仍保有原資料，不是刪除。 |
| 281 | general／名詞 | 削除／さくじょ／刪除 | `general-listening-79:削除` | `deleting.svg` | 選定文件進入垃圾桶，原位置空輪廓，明確移除資料而非儲存。 |
| 282 | general／名詞 | 転送／てんそう／傳送 | `general-listening-79:転送` | `forwarding.svg` | 已收到的信件從中間裝置再傳到下一接收端，兩段箭頭表示轉送。 |
| 283 | general／名詞 | 通知／つうち／通知 | `general-listening-79:通知` | `notification.svg` | 裝置出現新訊息小卡與提示鈴，單一到達訊息而非打電話會話。 |
| 284 | general／名詞 | 光源／こうげん／光源 | `general-listening-74:光源` | `lightsource.svg` | 燈泡是發光起點，光束照亮旁邊物體，箭頭反指源頭區別被照物。 |
| 285 | general／名詞 | 区別／くべつ／區別 | `general-listening-75:区別` | `distinguishing.svg` | 將外形相近但齒形不同的鑰匙放入各自相合孔位，表辨別分類不是只看見差異。 |
| 286 | general／名詞 | 記録／きろく／紀錄 | `general-listening-25:記録` | `record.svg` | 人物把量測觀察結果記入日期格紀錄冊，表留下可追查記載而非手寫複製。 |
| 287 | general／名詞 | 複製／ふくせい／複製 | `general-listening-79:複製` | `duplicating.svg` | 原文件保留且旁邊產生另一份相同圖像，機器輸出而非手寫抄錄或移動唯一原件。 |
| 288 | general／名詞 | メニュー／メニュー／菜單 | `general-listening-43:メニュー` | `menu.svg` | 打開的餐飲菜單以餐點小圖與排列欄呈現，無價目文字，不是普通書。 |
| 289 | general／名詞 | 定食／ていしょく／套餐 | `general-listening-43:定食` | `setmeal.svg` | 一托盤上有飯、主菜、湯與小菜，表套餐組合而非單盤料理。 |
| 290 | general／名詞 | 煙／けむり／煙 | `general-listening-74:煙` | `smoke.svg` | 木柴上冒起連續灰色煙柱，火焰很小、煙佔主體，區分雲和霧。 |
| 291 | general／名詞 | 霧／きり／霧 | `general-listening-105:霧` | `fog.svg` | 近處人物清楚、遠山與屋舍被多層低霧遮住，表地面能見度低，不是煙柱。 |
| 292 | n5／動詞 | 咲く／さく／（花）開（禮貌形：咲きます） | `stage0-day19:咲く` | `blooming.svg` | 花苞轉為展開花瓣，過程箭頭表開花而非僅花的物件。 |
| 293 | n5／動詞 | はく／はく／穿（褲子、裙子、鞋襪）（て形：はいて） | `stage0-day16:はく` | `puttingontrousers.svg` | 人物將褲子往腰部拉起、雙腿在褲管中，向上箭頭避免誤解成脫下。 |
| 294 | n5／動詞 | 締める／しめる／繫、扣緊（ネクタイを締めます） | `stage0-day16:締める` | `tyingnecktie.svg` | 雙手將領帶結向領口收緊，表繫領帶，不誤作關門。 |
| 295 | general／動詞 | 願う／ねがう／希望；祈願 | `general-listening-07:願う` | `wishing.svg` | 人物合掌望著尚未完成的目標小圖，表祈願希望，而非已實現結果。 |
| 296 | general／動詞 | 支える／ささえる／支撐 | `general-listening-08:支える` | `supporting.svg` | 一人扶住失衡傷者的軀幹，重量由扶持者承接，不只手碰肩。 |
| 297 | general／名詞 | 見学／けんがく／參觀；觀摩 | `general-listening-09:見学` | `observinglesson.svg` | 參觀者站在界線外觀察實作人員，未動手參與，區分練習或工作。 |
| 298 | general／動詞 | 落ちる／おちる／掉落 | `general-listening-67:落ちる` | `falling.svg` | 岩塊自行向下落離斷崖，沒有手作原因，區分弄掉物品的落とす。 |
| 299 | general／動詞 | 崩れる／くずれる／崩塌 | `general-listening-67:崩れる` | `collapsing.svg` | 石牆原本排列失去支撐而塌成石堆，多塊掉落而非單塊落石。 |
| 300 | general／動詞 | 伏せる／ふせる／伏下 | `general-listening-67:伏せる` | `duckingdown.svg` | 人物身體貼近地面、雙臂護頭，上方障礙掠過，表伏下而非躺床休息。 |

## 實際渲染總覽

25組，每組12張，均附放大與實際56×42；日中標籤只在文件，SVG內無文字。全300圖均已逐張檢視，不以放大圖代替小尺寸檢查。

![第1組](previews/t157-group-1.png)

![第2組](previews/t157-group-2.png)

![第3組](previews/t157-group-3.png)

![第4組](previews/t157-group-4.png)

![第5組](previews/t157-group-5.png)

![第6組](previews/t157-group-6.png)

![第7組](previews/t157-group-7.png)

![第8組](previews/t157-group-8.png)

![第9組](previews/t157-group-9.png)

![第10組](previews/t157-group-10.png)

![第11組](previews/t157-group-11.png)

![第12組](previews/t157-group-12.png)

![第13組](previews/t157-group-13.png)

![第14組](previews/t157-group-14.png)

![第15組](previews/t157-group-15.png)

![第16組](previews/t157-group-16.png)

![第17組](previews/t157-group-17.png)

![第18組](previews/t157-group-18.png)

![第19組](previews/t157-group-19.png)

![第20組](previews/t157-group-20.png)

![第21組](previews/t157-group-21.png)

![第22組](previews/t157-group-22.png)

![第23組](previews/t157-group-23.png)

![第24組](previews/t157-group-24.png)

![第25組](previews/t157-group-25.png)


## 驗證與發布紀錄

本機驗證完成：check335項測試／typecheck／lint、正式路徑build與perf:bundle通過。300圖與1028新增映射逐項自查；300張實際375×667卡片逐張檢視，線上／真正離線共600次揭示，核對原詞條、來源、空alt、56×42及中心線。另40個代表條目×新卡／複習×線上／離線＝160次完整流程，涵蓋四類、不同詞類、舊／新圖共用與無圖；播放固定1倍、評分／改評、觸控滑動不評分與合成進度保存保持。斷網用BrowserContext.setOffline(true)後重載，未快取探針須ERR_INTERNET_DISCONNECTED；714圖離線SHA一致，清HTTP快取及刪單圖precache後驗證缺圖退化與下一圖恢復。初次缺圖腳本誤把無圖首卡當有圖，已修正測試定位再通過，產品未改。頁面錯誤0、水平溢位0；長答案依原有卡片內捲動，不把操作抽驗說成全部1028映射完整操作全驗。


本文件與驗證JSON保存合併前證據快照；最新CI、實際合併版本、Pages與正式站比對／抽驗結果集中保存於本輪T157 PR說明與最終發布留言，不預記未執行步驟。相同產品無需為文件反覆建立發布PR。完成本300義項後停止，不接續下一批。

逐句人工語音、完整真機與實體螢幕閱讀器仍未驗收；既有Android部分驗證保留。JLPT原71項盤點已結案（當時41補標、30無可靠對應）；後續151課撤標後現行31無可靠對應、待核實0，非待補缺漏。圖片與資料自查、手機模擬不能視為記憶效果驗證。

## 代表性實際手機預覽

### 揭示前

![375寬實際畫面](previews/t157-student-front-375.png)

### 抽象：根拠

![375寬實際畫面](previews/t157-grounds-375.png)

### 動作的跨課共用：聞く詢問

![375寬實際畫面](previews/t157-asking-shared-375.png)

### 忍耐的微情境

![375寬實際畫面](previews/t157-enduring-375.png)

### 副詞：すぐ

![375寬實際畫面](previews/t157-immediately-375.png)

### 長翻譯、無配圖

![375寬實際畫面](previews/t157-long-unmapped-375.png)

### 舊詞以新圖共用：家庭

![375寬實際畫面](previews/t157-old-word-new-shared-375.png)

