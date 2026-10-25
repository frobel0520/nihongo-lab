# 單字卡配圖與圖片下載 UX 獨立審查（T161＋T162 後）

審查日期 2026-10-24。本文件只記錄審查結果；本輪未修改教材、SVG、程式、測試或部署設定，也未提交、推送、合併或部署。

## 審查範圍與版本

| 項目 | 內容 |
|---|---|
| 審查版本 | 遠端 `main` `64e7175`（T162 文件提交）；已合併 [PR #167](https://github.com/frobel0520/nihongo-lab/pull/167)（T161）、[PR #168](https://github.com/frobel0520/nihongo-lab/pull/168)（T162）；審查時無未合併 PR |
| 下載架構提交 | `74f5d99` feat(T161) 圖片改為按需載入／主動下載、`ab1c028` docs(T161) |
| 全量配圖提交 | `cb86a36` 628 張新 SVG、`9a04bcb` 5909 卡映射、`64e7175` docs(T162) |
| 本機工作樹 | 位於本機安全修補分支（比 `main` 多 1 個只改 `package.json`／lock 的提交）；`app/ lib/ public/ scripts/ curriculum/ vite.config.ts` 與 `main` 無差異，未動該分支 |
| 審查用 build | 以 detached worktree 取出 T160 `3751bc7`、T161 `ab1c028`、T162 `64e7175` 各自做正式 `/nihongo-lab/` build（Windows 工作樹，SVG 為 CRLF；共用本機 node_modules，vite 8.2.4，`main` 鎖定 8.2.2，僅影響雜湊與數十 bytes） |
| 瀏覽器 | 桌面 Chromium（Playwright headless）模擬手機尺寸、獨立暫存設定檔、合成進度；**不是真機** |
| 正式站 | 只讀取 `sw.js` 與圖片版本清單 chunk 做比對；未操作、未回退、未額外發布 |

## 可採取行動的發現（依嚴重度）

嚴重度：中＝影響主要流程的理解或結果、建議下一輪修；低＝局部或少見情境；可選＝不修也不影響正確性。沒有發現高嚴重度或阻塞發布的問題。

### F1（中）離線或中途斷線時，下載顯示持續前進的「假進度」，約 9–10 分鐘後才回報失敗

- 類型：UX 問題（含工程設計缺口）。既有問題（T161 引入）。
- 位置：`app/components/OfflineImages.tsx:62-104`（`run`）、`:155`（進度文字）；`lib/offline.mjs:155-185`（`attempt`／`worker`，失敗也 `done++`）；`lib/vocab-image-offline.mjs:20-21`（6 條、重試 2 次）；`lib/offline.mjs:133`（退避 500／1000 ms）。
- 觸發條件：裝置離線時按「下載全部單字圖片」，或下載途中斷網。
- 最小重現：設定頁 → `BrowserContext.setOffline(true)` → 按下載。
- 實際：120 秒內「下載圖片中… 36 → 468 / 2242」穩定上升，實際存入 0 張；每張都試 3 次後才算失敗，依速率推估約 575 秒才結束並顯示「失敗 2242 張（Failed to fetch 類英文錯誤）」。途中斷網情境：已存 306 張後，計數仍由 342 升到 660（90 秒）。期間「已下載 0 張」那行不更新，按鈕停用。
- 預期：開始前或斷線時立即告知「目前離線，已存 N 張，連線後再按一次即可接續」；進度只計成功存入的張數，失敗另計。
- 影響：使用者以為正在下載，實際什麼都沒存；可能在離線場合誤信已完成一部分。恢復面正常：重新連線後再按，只補抓缺少的 1936 張，最後「已全部存好」。
- 修正方向：開始前檢查 `navigator.onLine`、監聽 `offline` 事件中止；連續 N 次網路錯誤（`TypeError`）即中止整批；進度改為「已存 X、失敗 Y」；錯誤訊息轉成中文。

### F2（中低）離開設定頁就默默停止下載；下載中不能同時學習，畫面沒有說明

- 類型：UX 問題。既有問題（T161 設計，文件有寫，介面沒寫）。
- 位置：`app/components/OfflineImages.tsx:43`（卸載時 `abort`）、`:126-128`（說明文字）。
- 重現：按下載，到 102 張時切到單字卡頁。實際：已存 108 張後完全停止（4.5 秒內 0 增加），回到設定頁顯示「下載其餘單字圖片」，沒有「已暫停」提示。
- 預期：下載中顯示「下載期間請留在此頁；離開會暫停，已存的會保留，回來再按即可接續」，或把下載移到不隨頁面卸載的層級。
- 影響：使用者以為背景在下載，切去學習後離線才發現缺圖。已存部分不會遺失，接續正常。
- 修正方向：最小修正是補說明文字與「已暫停」狀態；較完整是移到 App 層級並允許邊學邊下載。

### F3（中低）「清除快取」會刪掉已下載的單字圖片，但說明只寫音檔與程式檔

- 類型：UX 問題（介面承諾不一致）。既有問題（T161 新增圖片快取時未同步說明）。
- 位置：`app/components/ClearCache.tsx:62-64`；`lib/clear-cache.mjs:44-46`（刪除全部 Cache Storage，含 `vocab-images-v1`、`vocab-images-browse-v1`）。
- 實際：說明為「清掉…離線音檔與程式檔」「離線音檔要再到上面重新下載」，沒提圖片；圖片設定區又寫「已下載的圖片不會…由本網站自動刪除」。
- 預期：清除快取說明列出「離線單字圖片」，並提示清完要重新下載。
- 修正方向：只改說明文字；如要保留圖片，另議是否排除 `vocab-images-v1`。

### F4（低）版本新增或修訂圖片後，已「全部存好」的使用者不會被告知有待下載

- 類型：UX 問題。機制屬 T161，T162 首次實際觸發。
- 位置：`app/App.tsx:170`（更新橫幅只寫「學習進度與下載音檔會保留」）；設定頁以外沒有圖片待下載提示。
- 重現（真實 build）：T161 全部下載 1614 張 → 更新到 T162 → 設定頁變成「已下載 1614 張，待下載 628 張（0.50 MB）」，首頁與更新橫幅都沒有相關文字。
- 影響：使用者記得「圖片已全部下載」，離線時 628 張新卡只顯示文字（不影響學習）。
- 修正方向：更新橫幅補「已下載的單字圖片也會保留；新版圖片可到設定頁補下載」；可選：曾完成下載且 `pending > 0` 時在設定入口加一行提示。

### F5（低）`minutehand.svg`（分）在 56×42 看起來是「4 點整」

- 類型：語義問題（易形成錯誤聯想）。本次新增（T162）。
- 卡片：`stage0-day4:分`（ふん，「分」）。
- 實際：長針正指 12、短針指 4，只有 12 點旁一小段紅弧暗示「移動一格」；與 `oneoclock`、`threeoclock`（X 點整）同構圖，小尺寸幾乎無法區分。
- 預期：表達「分鐘」而非「整點」，例如沿用 `fiveminutes`／`tenminutes` 的扇形塗色，或把長針明顯移到 1–2 分刻度並突出刻度。
- 修正方向：重畫單張；不需改映射。

### F6（低）`temporarily.svg`（一時＝暫時）小尺寸像一台電腦螢幕

- 類型：可辨識性問題（偏誤導）。本次新增（T162，屬 8 張已知較弱圖）。
- 卡片：`general-listening-144:一時`（いちじ，「暫時」）。
- 實際：設計說明是「劍被放進寄存櫃、時間條上一小段」，但劍只是一條淺灰斜線，56×42（2 倍像素密度）下看起來是螢幕加鍵盤座。與 `forthetimebeing`（とりあえず）構圖也相近。
- 修正方向：重畫，讓「暫放、之後取回」的主體可見（例如明確的物件、取回箭頭），或改用時間條上明顯的短區段。

### F7（低）`lifenotsmooth.svg`（人生不順是理所當然）小尺寸幾乎只剩一個人

- 類型：可辨識性問題。本次新增（T162，屬 8 張已知較弱圖）。
- 卡片：`game-card:game:er:aiden:selection-voice:eaea8b98f3:eaea8b98f3`。
- 實際：波浪路面與小坑在 56×42 只剩淡灰細線；「跌倒後仍拍拍灰站起」的動作不可見。
- 修正方向：加粗路面起伏與跌倒痕跡，或改成「一連串上下起伏、人物仍前進」的單一明確構圖。

### F8（可選）單字卡頁 chunk 夾帶 5910 筆未使用的 `alt` 文字，約占一半大小；且這個 chunk 沒有單獨預算

- 類型：可選改善（效能）。`alt` 欄位自配圖初期就打包；T162 讓它變大。
- 位置：`lib/vocab-illustrations.mjs`（每筆含長描述 `alt`）；`app/components/VocabIllustration.tsx:15`（實際固定 `alt=""`，沒用到）；`scripts/perf-bundle.mjs:30-31`（只量 `index-*.js` 與 precache 總量）。
- 量測（本機 T162 build）：`SrsView-*.js` 1,315,789 bytes／gzip 305–309 KB，其中 `alt` 字串 533,280 bytes；去掉後 776,599 bytes／gzip 約 155 KB。同機 T160／T161 為 gzip 234 KB，T162 增加約 71 KB。
- 影響：這個 chunk 在 precache 內，首次安裝下載、開單字卡時解析；低階手機解析成本增加。目前預算全數通過，不是失敗。
- 修正方向：build 時剝除 `alt`（描述保留在文件與 CSV），或改用 `id → src` 精簡表；perf:bundle 另加最大 lazy chunk 預算。

### F9（低）揭示答案後鍵盤焦點掉到 `<body>`

- 類型：UX／無障礙問題。既有問題，與圖片無關。
- 位置：`app/views/SrsView.tsx:378-383`（「顯示答案」按鈕揭示後卸載，換成評分 fieldset）。
- 實際：以 Enter 觸發揭示後 `document.activeElement` 為 `BODY`；再按 Tab 從頁首開始。數字鍵 1／2 評分可用。
- 修正方向：揭示後把焦點移到評分 fieldset 或第一個評分鈕。

> 2026-10-25更新：F10已由T164重現並提出修正，待本輪PR定點審查、尚未部署；詳見[srs-layout-t164.md](srs-layout-t164.md)。以下量測與建議保留為原審查歷史，本輪不採縮小字體。

### F10（低）小螢幕＋放大字級或橫向時，長遊戲台詞卡可視區很小

- 類型：UX 問題。既有版面，與圖片無直接關係（圖片在翻譯下方，需捲動才看到屬已知設計）。
- 量測（桌面模擬；放大字級以根字級 130% 近似，非系統設定）：

| 視窗 | 字級 | 長遊戲句卡片可視高度／內容高度 | 評分鈕在畫面內 |
|---|---|---|---|
| 320×568 | 100% | 126／769 px | 是 |
| 320×568 | 130% | 61／1203 px | 是 |
| 375×667 | 100% | 225／595 px | 是 |
| 375×667 | 130% | 160／902 px | 是 |
| 390×844 | 100% | 402／607 px | 是 |
| 667×375 橫向 | 100% | 頁面捲動；頂部導覽與吸底評分鈕之間約 140 px，捲動中翻譯與圖片會經過評分鈕後方 | 是 |

- 沒有水平溢位，評分鈕全部可點。主要問題是揭示後長句仍用 2–2.6rem 大字，320 寬＋放大字級幾乎只剩一行可視。
- 修正方向：揭示後依字數縮小長句字級；橫向（寬 >640 但高度很小）改用精簡版面。需真機確認後再決定。

### F11（低）少量待下載顯示「0.00 MB」

- 類型：UX 文字。既有（T161）。
- 位置：`lib/vocab-image-offline.mjs:96`。
- 重現：單張圖修訂後顯示「待下載 1 張（0.00 MB），其中 1 張是更新過的新版」。
- 修正方向：小於 0.01 MB 改顯示 KB。

## T163 處理狀態（2026-10-24 追加）

以上發現保留原文。T163 依完整報告核實後處理如下，細節見 [T163 修正紀錄](vocab-images-review-fixes-t163.md)。

| 發現 | 狀態 | 處理 |
|---|---|---|
| F1 假進度 | 已修正 | 沒網路時立即說明、不送請求；連線存在但請求失敗或中途斷網，約一輪並行請求後整批暫停；進度只計實際存入快取的張數，網路中斷不算失敗，下次接續 |
| F2 離開設定頁停止 | 已修正 | 下載工作移到 App 層級，站內換頁持續下載；回設定頁顯示同一工作；可取消、可接續；跨分頁鎖保留。重新整理、關閉分頁或 APP 被系統終止仍會中斷（介面已說明） |
| F3 清除快取說明 | 已修正 | 說明與確認文字列出會刪除離線音檔與單字圖片，進度與顯示偏好保留 |
| F4 更新後無提示 | 已修正 | 曾下載完全部圖片的人，圖片清單改變時首頁上方一行可關閉提醒，連到設定頁；同一版本只提醒一次；更新橫幅補圖片說明 |
| F5 `minutehand` | 已重畫 | 紅色分針指向整點之後並有移動弧線，不再像整點 |
| F6 `temporarily` | 已重畫 | 依課文「一時的に預けるだけ」畫成寄放在格櫃的劍、取件牌、時鐘與取回箭頭 |
| F7 `lifenotsmooth` | 已重畫 | 起伏路面、石頭、雨雲，人物聳肩往終點旗前進，56×42 可辨 |
| F8 未使用 alt | 已處理 | 描述移到作者資料；單字卡 chunk gzip 307,085→153,125 bytes；新增以內容定位的 chunk 預算 |
| F9 焦點掉到 body | 已修正 | 鍵盤揭示後焦點移到評分區、換卡後回到「顯示答案」；滑鼠與觸控不搬焦點 |
| F10 小螢幕長句 | 保留觀察 | 本輪不改版；T163 的修改未改變卡片版面（焦點移動使用 preventScroll） |
| F11 0.00 MB | 已修正 | 未滿 0.01 MB 的非零大小以 KB 顯示 |

「待確認假設與保留觀察」各項維持原判定，未列為已解決。

## 待確認假設與保留觀察（不列為缺陷）

- 授受四圖 `giving`／`receiving`／`lending`／`borrowing`，以及 `teaching`／`learningfrom`：同一事件不同視點，只靠焦點橢圓與時鐘區分，56×42 下差異細。語言學上正確，答案文字已區分；保留觀察。
- `callingdad` 與 `callingbigbrother`：差在身高、下巴暗帶（鬍子）與髮型，小尺寸相近。重點「當面呼喚」有表現；保留觀察。
- `yearbeforelast`／`yearafternext`：代表今年的紅點在 x=126，落在第 3、4 格之間（今年是第 3 格），不影響「隔一年」判讀；可順手修。
- 遊戲比喻句直譯成圖：「戦場のお掃除の時間です」用掃地圖、「一気に調理してやる！」用炒菜圖。與角色雙關一致，譯文也是「清掃戰場／料理掉」；合理概括。
- `goaway` 同時用於粗魯的「失せろ」與禮貌的「立ち去ってください！」，語氣不同但核心義相同。
- `hereplace` 用於「こちら＝這位；這邊」只畫出「這邊」；`alreadydone` 用於「もう＝已經；再」只畫出「已經」。屬部分涵蓋，文字已完整。
- 圖片載入失敗時，56×42 留白在約 2 秒後收起，下方課名 chip 上移 48 px；評分鈕不動，無誤觸風險。
- 圖片修訂後尚未重新下載前離線，該卡只顯示文字（刻意不用舊版）；符合設計。
- 未呼叫 `navigator.storage.persist()`，屬盡力保留；介面已寫「瀏覽器或系統清除後需重新下載」。
- `public/images/vocab/README.md` 會一起部署成公開檔案；無敏感內容。

## 全量自動核查（5909 卡／2242 資產）

以 App 相同載入器 `loadCategory` 獨立載入四類教材，再與 `VOCAB_ILLUSTRATIONS` 比對；未使用 worker 或盤點腳本的統計結果。

| 檢查 | 結果 |
|---|---|
| 卡片數 | 5909（N5 711、通用 4500、動畫 80、遊戲 618），ID 唯一 5909 |
| 映射 | 5909 筆，ID 重複 0、孤兒映射 0；每張卡恰好 1 筆 id＋word＋reading＋zh 四欄全相符；ID 相符但欄位不符 0 |
| 資產 | `public/images/vocab/*.svg` 2242 個，全部被引用、0 缺檔、0 未引用；內容 SHA-256 全部唯一 |
| SVG 結構與安全 | 2242 個 viewBox 全為 `0 0 224 168`；根元素帶 SVG namespace；無 script、foreignObject、text、image、iframe、外部 href、事件屬性、`javascript:`、外部 `url()`、style 區塊；全 ASCII；共 82 種色值 |
| 圖片網址格式 | 全部符合 SW 路由 `[a-z]+.svg` |
| precache | 本機 T162 build `sw.js` 482 項、22,731,813 bytes，單字圖 0、MP3 0；正式站 `sw.js` 482 項、單字圖 0 |
| 版本清單 | 正式站圖片版本清單 2242 列，與 `origin/main` LF 原始檔逐一比對 SHA 前 12 碼與 bytes，0 不符 |

同形異義核查：

- runtime 只在四欄全符時出圖，所以不會因詞面相同自動錯配；風險只在人工建立映射時。教材文字若改動，該卡會失去圖片（不會出錯圖），既有測試會擋下覆蓋率下降。
- 同一詞面、不同讀音或翻譯卻共用同一 SVG 的組合有 455 組。其中讀音不同的 6 組（昨夜 ゆうべ／さくや、ボタン、メモ、レバー、ラベル、マント）都是同義或假名寫法差異。翻譯完全不共用漢字的 54 組逐一人工看過，抽查課文上下文（例：通用 19「開く」是店有開→`shopopens`；通用 06「降りる」是下山→`comingdown`），未發現錯義共用。
- 反向確認：同形但不同義的已分圖，例如「一時」：一點→`oneoclock`、暫時→`temporarily`；「注意」：注意力→`attractattention`、小心→`becareful`。

## 深入視覺審查（222 張不同 SVG）

- 方法：每張 SVG 以 224×168 與 56×42 並排（1 倍像素密度，最差情況），可疑者另以 2 倍密度放大；另外每張 SVG 取 1 張代表卡，在 375×667 實際 App 卡片揭示後截圖檢視（圖片捲入可視範圍）。同一 SVG 的多張卡只算一張圖。
- 選樣理由：8 張已知較弱圖全收；依特殊設計分組指定（敬語／稱謂 13、慣用語 1、抽象詞 15、疑問詞 10、連接詞 10、日期時間 16、數量 18、授受／方向 21、肯否定／狀態／命令 14、共用／同形疑點 10、遊戲長句 20、比喻句 2）；其餘依「類別×批次」分層隨機（固定亂數種子）。
- 涵蓋：批次 T155 前 7、T155 8、T156 24、T157 23、T158 23、T159 17、T160 25、T162 95；觸及卡片類別 N5 99、通用 137、動畫 25、遊戲 58 張 SVG；這 222 張 SVG 共對應 844 張卡。
- 375×667 實卡（2 倍像素密度）：222 張代表卡全部揭示成功，`src` 與預期 SVG 相符 222／222，pageerror 0；圖片在翻譯下方置中、無裁切或背景對比問題。長遊戲句需在卡內捲動後才看得到圖片，此時日文原句已捲出畫面（見 F10）。
- 結論：222 張中確認需修 3 張（F5–F7），保留觀察 7 項（見上節），其餘未發現錯義或明顯誤導。**這是抽驗結果，不代表其餘 2020 張已完成語義驗收。**
- 逐張選樣清單見文末附錄。

## 8 張已知較弱圖逐項判定

| SVG | 卡片 | 判定 | 理由 |
|---|---|---|---|
| `sleepstars` | 星々よ、静かに眠れ（遊戲） | 保留，可結案 | 夜空＋月清楚；2 倍密度下可見星星閉眼弧線，不誤導 |
| `reflected` | 映る＝映現 | 保留，可結案 | 樹與月的倒影在 56×42 仍可辨 |
| `lifenotsmooth` | 人生はうまく行かないのが当然だ | **下一輪重畫**（F7） | 小尺寸只剩人物，語義不可見 |
| `refundifdelayed` | 遅れたら払戻されちゃうよ | 保留觀察 | 時鐘＋錢幣回到人手上，需配合文字，不誤導 |
| `means` | 手段 | 保留觀察 | 三條管道中狼煙不明顯，但「多條路到同一目的地」可讀 |
| `temporarily` | 一時＝暫時 | **下一輪重畫**（F6） | 小尺寸像電腦螢幕，劍不可見 |
| `grimtreatment` | 死を与えることこそ真の治療… | 保留觀察 | 黑花取代藥瓶可讀，未畫傷害，符合界線 |
| `judgingsword` | 斬り落とすべき悪は、この剣で裁く | 保留觀察 | 劍看起來像天秤立柱，但「裁決」由天秤表達，不誤導 |

## 單字卡 UX（本機 T162 build，375×667 為主）

| 項目 | 結果 |
|---|---|
| 版面方向 | 文字置中、揭示後翻譯下方 56×42、空 `alt` 保持 |
| 圖片慢載入（2.5 秒） | 揭示動畫結束後到圖片載入完成，翻譯、課名、評分鈕位置 0 位移（img 固定 56×42） |
| 圖片載入失敗 | 圖片元素移除；翻譯與評分鈕不動，只有課名 chip 上移 48 px |
| 快速翻卡（每張圖延遲 3 秒） | 揭示→立即評分→下一張揭示，`src` 一律對應目前卡片；按「上一張」回到已評卡，圖片與文字一致，無舊圖殘留 |
| 離線缺圖 | 不顯示破圖；評分照常、進度寫入 |
| 無障礙樹 | 圖片不在無障礙樹中（`alt=""`）；焦點問題見 F9 |
| 手機高度、橫向、放大字級 | 見 F10；無水平溢位，評分鈕皆在畫面內 |
| pageerror | 0 |

## 圖片下載與更新 UX

| 項目 | 結果 |
|---|---|
| 「APP 離線可用」與「全部圖片已下載」 | 設定頁「離線單字圖片」說明清楚區分：沒下載時離線只顯示文字。更新橫幅與清除快取文字未提圖片（F3、F4） |
| 數量與大小 | 「共 2242 張（1.67 MB）：已下載 N，待下載 M（x MB）」與實際快取一致；更新後「其中 1 張是更新過的新版」正確；小量顯示 0.00 MB（F11） |
| 下載中學習 | 不行，離開即停（F2） |
| 重複啟動 | 按鈕在下載中停用；跨分頁由 Web Locks 擋下並提示 |
| 離線／斷線 | 假進度（F1）；重新連線後接續正常 |
| 容量不足（模擬第 51 次寫入起 QuotaExceededError） | 4 秒內回報「新存 50 張，失敗 2192 張（儲存空間不足…已下載的檔案會保留）」，不重試 |
| 多分頁鎖異常關閉 | 持鎖分頁直接關閉（不觸發 beforeunload）後，另一分頁再按即可繼續下載 |
| 瀏覽快取與明確下載 | 程式上兩個快取分開，瀏覽淘汰只作用在 `vocab-images-browse-v1`；但「清除快取」會清掉兩者（F3） |
| 圖片修訂 | 變體 build 只改 `bread.svg`：更新後顯示 1 張待更新，只重抓 1 張，新版存好後才刪舊版，快取維持 2242 筆 |
| T161→T162（兩個真實 build） | T161 已下載 1614 張 → 更新：worker 等待期間 1614 張保留；更新過程 0 張圖片請求；之後只下載 628 張；進度、音檔保留；多分頁時拒絕套用並提示 |
| T160→T162（舊 precache 遷移） | precache 1614 張 → 新 worker 等待中已複製 1614 張到 `vocab-images-v1`；啟用後 precache 圖片 0；之後只下載 628 張；進度、音檔保留 |
| 離線讀取 | 遷移圖與新下載圖斷網後經 worker 讀取皆 200 |

正式站 T161→T162 跨版更新未能在正式站重現（正式站已是 T162，且不為審查回退或另發布）；本輪以本機真實 build 驗證。這是缺測，不是產品失敗。

## 容量與紀錄準確性

| 項目 | 檔案數 | bytes | MB（10^6） | MiB（2^20） | 來源 |
|---|---|---|---|---|---|
| APP 必要 precache（T162） | 482 | 22,731,907 | 22.73 | 21.68 | `capacity-t162.json`；本機重建 22,731,813（相依版本差異） |
| 全部單字 SVG（T162，Windows CRLF 工作樹） | 2242 | 1,669,373 | 1.67 | 1.59 | `capacity-t162.json`，本機重建相同 |
| 全部單字 SVG（T162，LF／CI／正式站） | 2242 | 1,668,359 | 1.67 | 1.59 | git blob 與正式站清單 |
| 全部單字 SVG（T161） | 1614 | 1,171,532 | 1.17 | 1.12 | `capacity-t161.json` |
| 全部教材音檔 | 8535 | 167,004,460 | 167.00 | 159.27 | `capacity-t162.json` |
| 聲線預覽頁（線上試聽，不計入離線總量） | 43 | 1,101,266 | 1.10 | 1.05 | 同上 |
| APP＋全部圖片＋全部教材音檔 | 11,259 | 191,405,740 | 191.41 | 182.54 | 22,731,907＋1,669,373＋167,004,460，逐項相加相符 |

「全部 SVG 1.67 MB」與 Storage API 段落「原始 1.17 MB」的差異：**是版本與範圍不同，不是誤植**。1.17 MB 是 T161 當時 1614 張的原始 bytes，Storage API 觀察（下載後 usage +2,128,660 bytes）也是在 T161、1614 張時量的瀏覽器 usage（含快取中繼資料），不是原始大小；1.67 MB 是 T162 的 2242 張原始 bytes。T162 沒有重新量 Storage API，所以目前沒有 2242 張的 usage 數字。建議在 `offline-images-t161.md` 的 Storage API 段落標明「T161、1614 張」，或在 T162 補量一次。

其他核對：

- MB 一律 10^6、MiB 一律 2^20，文件與 `capacity-*.json` 均有標示；沒有把 usage 當原始大小。
- 單字圖片確實不在 precache（本機與正式站 `sw.js` 皆 0 張）；App 只在設定頁按下載或揭示答案時抓圖；T160→T162、T161→T162 更新過程 0 張圖片請求。沒有其他流程默默全量下載。
- 首次快取時間：T161 文件的 131.1／30.8 秒是同機、每請求加 50 ms 的本機模型；正式站 T160 的 636 秒含 Pages 與網路。兩者環境不同，不能用來推算倍數。本輪未重新量首次快取時間。

## 已執行驗證

- 全量：5909 卡映射、2242 SVG 存在／引用／雜湊唯一／結構與安全規則、precache 內容、正式站版本清單比對。
- 視覺：222 張 SVG 於 224×168 與 56×42 檢視、28 張 2 倍密度放大（含 7 張樣本外的時鐘類對照圖）、222 張代表卡於 375×667 實際卡片揭示截圖。
- 卡片 UX：慢載入、載入失敗、快速翻卡、上一張、離線缺圖、無障礙樹與焦點、6 種視窗×2 種字級×3 張長文字卡。
- 下載 UX：離線開始、途中斷線、離開設定頁、跨分頁鎖、持鎖分頁異常關閉、容量不足、圖片修訂增量更新。
- 跨版：T161→T162、T160→T162 真實 build 更新，多分頁保護、進度與音檔保留、斷網讀取。
- 所有瀏覽器腳本 pageerror 0。腳本與截圖放在 repo 外暫存區，未加入專案。

## 未覆蓋情境

- 真機（iOS Safari、Android Chrome）、實體螢幕閱讀器、系統層級字型放大、實際行動網路與省電模式。
- 2242 張中未抽到的 2020 張未做逐張語義審查；222 張以外的卡片未逐張在 375 寬實卡檢視。
- 正式站跨版更新、正式站首次快取與全量下載耗時（本輪未重測）。
- 真實容量不足（只做程式層模擬）、瀏覽器自動回收儲存空間。
- 記憶效果、人工語音（不在本輪範圍）。

## 建議下一輪修正順序

1. **下載狀態批次（約 1–2 小時）**：F1 離線偵測與連續失敗中止、進度只計成功；F2 下載中說明與「已暫停」狀態；F11 KB 顯示。同一元件，一個 PR。
2. **說明文字批次（約 20 分鐘）**：F3 清除快取文字、F4 更新橫幅補圖片說明。
3. **圖片重畫批次（約 1 小時）**：F5 `minutehand`、F6 `temporarily`、F7 `lifenotsmooth`；順手修 `yearbeforelast`／`yearafternext` 紅點位置。
4. **效能可選（約 1 小時）**：F8 剝除未使用 `alt`、加 lazy chunk 預算。
5. **版面（需真機後再定）**：F9 揭示後焦點、F10 長句字級與橫向版面。

## 可直接結案或保留觀察

- 可結案：映射唯一性與同形異義防護、SVG 安全與結構、圖片移出 precache、版本化網址與增量更新、舊 precache 遷移、跨分頁鎖、容量統計口徑、`sleepstars`、`reflected`。
- 保留觀察：`refundifdelayed`、`means`、`grimtreatment`、`judgingsword`、授受四圖、呼喚爸爸／哥哥、比喻句直譯與部分涵蓋的共用圖。日常使用若反映誤導再個別修。

## 附錄：深入審查選樣清單（222 張 SVG）

批次欄「pilot」指 T155 以前已存在的圖。代表卡是 375 寬實卡截圖所用的那一張。

| # | SVG | 批次 | 選樣理由 | 代表卡ID（類別） | 共用卡數 |
|---|---|---|---|---|---|
| 1 | `sleepstars` | t162 | 已知較弱圖 | `game-card:game:genshin:skirk:burst:e8a4c2eef1`（games） | 1 |
| 2 | `reflected` | t162 | 已知較弱圖 | `general-listening-74:映る`（general） | 1 |
| 3 | `lifenotsmooth` | t162 | 已知較弱圖 | `game-card:game:er:aiden:selection-voice:eaea8b98f3:eaea8b98f3`（games） | 1 |
| 4 | `refundifdelayed` | t162 | 已知較弱圖 | `game-card:game:er:silvia:selection:1016003:ceb73e57dc`（games） | 1 |
| 5 | `means` | t162 | 已知較弱圖 | `general-listening-155:手段`（general） | 1 |
| 6 | `temporarily` | t162 | 已知較弱圖 | `general-listening-144:一時`（general） | 1 |
| 7 | `grimtreatment` | t162 | 已知較弱圖 | `game-card:game:er:daniel:selection:1037001:3775b08837`（games） | 1 |
| 8 | `judgingsword` | t162 | 已知較弱圖 | `game-card:game:er:hisui:selection:1078002:2725f2610d`（games） | 1 |
| 9 | `callingdad` | t162 | 敬語／稱謂 | `stage0-day20:お父さん`（n5） | 1 |
| 10 | `callingmom` | t162 | 敬語／稱謂 | `stage0-day20:お母さん`（n5） | 1 |
| 11 | `callingbigbrother` | t162 | 敬語／稱謂 | `stage0-day20:お兄さん`（n5） | 1 |
| 12 | `callingbigsister` | t162 | 敬語／稱謂 | `stage0-day20:お姉さん`（n5） | 1 |
| 13 | `myfather` | t159 | 敬語／稱謂 | `stage0-day20:父`（n5） | 1 |
| 14 | `mymother` | t159 | 敬語／稱謂 | `stage0-day20:母`（n5） | 1 |
| 15 | `politeaddress` | t162 | 敬語／稱謂 | `stage0-day1:〜さん`（n5） | 1 |
| 16 | `respectedperson` | t162 | 敬語／稱謂 | `stage0-day24:方`（n5） | 1 |
| 17 | `someoneswife` | t162 | 敬語／稱謂 | `stage0-day20:奥さん`（n5） | 1 |
| 18 | `politespeech` | t162 | 敬語／稱謂 | `general-listening-168:敬語`（general） | 1 |
| 19 | `wording` | t162 | 敬語／稱謂 | `general-listening-168:言葉遣い`（general） | 1 |
| 20 | `wayofasking` | t162 | 敬語／稱謂 | `general-listening-168:頼み方`（general） | 1 |
| 21 | `aunt` | t162 | 敬語／稱謂 | `stage0-day20:伯母さん`（n5） | 1 |
| 22 | `tyingresolve` | t162 | 慣用語 | `anime-lesson-03:括る`（anime） | 1 |
| 23 | `grammarsubject` | t162 | 抽象詞 | `general-listening-154:主語`（general） | 1 |
| 24 | `negativeform` | t162 | 抽象詞 | `general-listening-169:否定形`（general） | 1 |
| 25 | `rhetoricalquestion` | t162 | 抽象詞 | `general-listening-178:反問`（general） | 1 |
| 26 | `emphasis` | t162 | 抽象詞 | `general-listening-178:強調`（general） | 1 |
| 27 | `willpower` | t162 | 抽象詞 | `general-listening-55:意志`（general） | 2 |
| 28 | `experience` | t162 | 抽象詞 | `general-listening-73:経験`（general） | 2 |
| 29 | `situationoverview` | t162 | 抽象詞 | `general-listening-30:状況`（general） | 2 |
| 30 | `standpoint` | t162 | 抽象詞 | `general-listening-163:立場`（general） | 1 |
| 31 | `soundargument` | t162 | 抽象詞 | `anime-lesson-02:正論`（anime） | 1 |
| 32 | `ability` | t162 | 抽象詞 | `anime-lesson-06:能力`（anime） | 1 |
| 33 | `meaning` | t157 | 抽象詞 | `stage0-day18:意味`（n5） | 6 |
| 34 | `reason` | pilot | 抽象詞 | `general-listening-23:理由`（general） | 14 |
| 35 | `responsibility` | t158 | 抽象詞 | `general-listening-52:責任`（general） | 6 |
| 36 | `relationship` | t162 | 抽象詞 | `general-listening-168:関係`（general） | 1 |
| 37 | `possibility` | t157 | 抽象詞 | `general-listening-23:可能性`（general） | 4 |
| 38 | `whichnationality` | t162 | 疑問詞 | `stage0-day1:何人`（n5） | 1 |
| 39 | `whichmonth` | t162 | 疑問詞 | `stage0-day5:何月`（n5） | 1 |
| 40 | `whichday` | t162 | 疑問詞 | `stage0-day5:何日`（n5） | 1 |
| 41 | `howlong` | t162 | 疑問詞 | `stage0-day11:どのくらい`（n5） | 1 |
| 42 | `whichofmany` | t160 | 疑問詞 | `stage0-day20:どれ`（n5） | 2 |
| 43 | `wherequestion` | t160 | 疑問詞 | `stage0-day3:どこ`（n5） | 2 |
| 44 | `whenquestion` | t160 | 疑問詞 | `stage0-day5:いつ`（n5） | 2 |
| 45 | `whyquestion` | t160 | 疑問詞 | `stage0-day9:どうして`（n5） | 3 |
| 46 | `howmuch` | t160 | 疑問詞 | `stage0-day3:いくら`（n5） | 1 |
| 47 | `howisit` | t160 | 疑問詞 | `stage0-day8:どう`（n5） | 2 |
| 48 | `andthen` | t162 | 連接詞 | `stage0-day6:それから`（n5） | 1 |
| 49 | `andalso` | t162 | 連接詞 | `stage0-day21:そして`（n5） | 1 |
| 50 | `wellthen` | t162 | 連接詞 | `stage0-day21:それでは`（n5） | 4 |
| 51 | `inotherwords` | t162 | 連接詞 | `general-listening-49:つまり`（general） | 2 |
| 52 | `therefore` | t162 | 連接詞 | `general-listening-66:それで`（general） | 3 |
| 53 | `butcontrast` | t160 | 連接詞 | `stage0-day8:でも`（n5） | 3 |
| 54 | `evenif` | t162 | 連接詞 | `general-listening-96:たとえ`（general） | 1 |
| 55 | `justthat` | t162 | 連接詞 | `general-listening-102:ただ`（general） | 1 |
| 56 | `forexample` | t162 | 連接詞 | `general-listening-73:例えば`（general） | 1 |
| 57 | `forthetimebeing` | t162 | 連接詞 | `general-listening-73:とりあえず`（general） | 1 |
| 58 | `yearbeforelast` | t162 | 日期時間 | `stage0-day19:一昨年`（n5） | 1 |
| 59 | `yearafternext` | t162 | 日期時間 | `stage0-day19:再来年`（n5） | 1 |
| 60 | `january` | t162 | 日期時間 | `stage0-day19:一月`（n5） | 1 |
| 61 | `halfpast` | t162 | 日期時間 | `stage0-day4:半`（n5） | 1 |
| 62 | `minutehand` | t162 | 日期時間 | `stage0-day4:分`（n5） | 1 |
| 63 | `weekspan` | t162 | 日期時間 | `stage0-day11:週間`（n5） | 1 |
| 64 | `yearspan` | t162 | 日期時間 | `stage0-day11:年`（n5） | 1 |
| 65 | `withintoday` | t162 | 日期時間 | `general-listening-52:今日中`（general） | 1 |
| 66 | `nextday` | t162 | 日期時間 | `general-listening-172:翌日`（general） | 1 |
| 67 | `untilthen` | t162 | 日期時間 | `general-listening-89:それまで`（general） | 2 |
| 68 | `pointintime` | t162 | 日期時間 | `general-listening-175:時点`（general） | 1 |
| 69 | `atthattime` | t162 | 日期時間 | `general-listening-06:その時`（general） | 3 |
| 70 | `dayaftertomorrow` | t159 | 日期時間 | `stage0-day11:あさって`（n5） | 3 |
| 71 | `daybeforeyesterday` | t159 | 日期時間 | `stage0-day11:一昨日`（n5） | 1 |
| 72 | `lastweek` | t159 | 日期時間 | `stage0-day11:先週`（n5） | 1 |
| 73 | `nextmonth` | t160 | 日期時間 | `stage0-day11:来月`（n5） | 1 |
| 74 | `fourthings` | t162 | 數量 | `stage0-day11:四つ`（n5） | 1 |
| 75 | `fivethings` | t162 | 數量 | `stage0-day11:五つ`（n5） | 1 |
| 76 | `ninethings` | t162 | 數量 | `stage0-day11:九つ`（n5） | 1 |
| 77 | `onesheet` | t160 | 數量 | `general-listening-11:一枚`（general） | 1 |
| 78 | `onecoin` | t162 | 數量 | `general-listening-28:一枚`（general） | 2 |
| 79 | `twosheets` | t160 | 數量 | `general-listening-11:二枚`（general） | 1 |
| 80 | `twocoins` | t162 | 數量 | `general-listening-28:二枚`（general） | 2 |
| 81 | `fivecoins` | t162 | 數量 | `general-listening-42:五枚`（general） | 1 |
| 82 | `sixbottles` | t162 | 數量 | `general-listening-116:六本`（general） | 1 |
| 83 | `onebottle` | t160 | 數量 | `general-listening-11:一本`（general） | 1 |
| 84 | `onetorch` | t162 | 數量 | `general-listening-124:一本`（general） | 1 |
| 85 | `onedrop` | t162 | 數量 | `general-listening-126:一滴`（general） | 1 |
| 86 | `twentyyearsold` | t162 | 數量 | `stage0-day19:二十歳`（n5） | 1 |
| 87 | `kilometers` | t162 | 數量 | `stage0-day25:キロ`（n5） | 1 |
| 88 | `oneset` | t162 | 數量 | `general-listening-154:一組`（general） | 1 |
| 89 | `threegroups` | t162 | 數量 | `general-listening-116:三班`（general） | 1 |
| 90 | `twopersons` | t158 | 數量 | `stage0-day11:二人`（n5） | 2 |
| 91 | `onething` | t159 | 數量 | `stage0-day11:一つ`（n5） | 4 |
| 92 | `giving` | t156 | 授受／方向 | `stage0-day7:あげる`（n5） | 3 |
| 93 | `giventome` | t158 | 授受／方向 | `stage0-day24:くれる`（n5） | 3 |
| 94 | `receiving` | t156 | 授受／方向 | `stage0-day7:もらう`（n5） | 4 |
| 95 | `feedinganimal` | t162 | 授受／方向 | `stage0-day24:やる`（n5） | 1 |
| 96 | `lending` | t156 | 授受／方向 | `stage0-day7:貸す`（n5） | 9 |
| 97 | `borrowing` | t156 | 授受／方向 | `stage0-day7:借りる`（n5） | 10 |
| 98 | `returningitem` | t157 | 授受／方向 | `stage0-day15:返す`（n5） | 15 |
| 99 | `replymessage` | t158 | 授受／方向 | `general-listening-13:返事`（general） | 14 |
| 100 | `teaching` | t156 | 授受／方向 | `stage0-day7:教える`（n5） | 4 |
| 101 | `explainmeaning` | t162 | 授受／方向 | `general-listening-05:教える`（general） | 1 |
| 102 | `learningfrom` | t156 | 授受／方向 | `stage0-day7:習う`（n5） | 1 |
| 103 | `going` | t156 | 授受／方向 | `stage0-day5:行く`（n5） | 28 |
| 104 | `coming` | t156 | 授受／方向 | `stage0-day5:来る`（n5） | 4 |
| 105 | `returnhome` | t156 | 授受／方向 | `stage0-day5:帰る`（n5） | 3 |
| 106 | `entrance` | t156 | 授受／方向 | `stage0-day3:入口`（n5） | 25 |
| 107 | `exit` | t156 | 授受／方向 | `stage0-day3:出口`（n5） | 16 |
| 108 | `mailingletter` | t162 | 授受／方向 | `general-listening-13:送る`（general） | 1 |
| 109 | `delivering` | t157 | 授受／方向 | `general-listening-13:届ける`（general） | 15 |
| 110 | `arrivedparcel` | t157 | 授受／方向 | `general-listening-13:届く`（general） | 6 |
| 111 | `reachingdistance` | t158 | 授受／方向 | `general-listening-72:届く`（general） | 2 |
| 112 | `parcelreceiving` | t157 | 授受／方向 | `general-listening-13:受け取る`（general） | 13 |
| 113 | `negation` | t158 | 肯否定／狀態／命令 | `stage0-day15:いいえ`（n5） | 4 |
| 114 | `thingexists` | t160 | 肯否定／狀態／命令 | `stage0-day10:ある`（n5） | 2 |
| 115 | `creatureexists` | t160 | 肯否定／狀態／命令 | `stage0-day10:いる`（n5） | 2 |
| 116 | `notallowedtouch` | t162 | 肯否定／狀態／命令 | `general-listening-09:だめ`（general） | 1 |
| 117 | `dooropens` | t158 | 肯否定／狀態／命令 | `stage0-day23:開く`（n5） | 5 |
| 118 | `shopopens` | t158 | 肯否定／狀態／命令 | `general-listening-12:開店`（general） | 6 |
| 119 | `doorcloses` | t158 | 肯否定／狀態／命令 | `stage0-day23:閉まる`（n5） | 5 |
| 120 | `opening` | t155 | 肯否定／狀態／命令 | `stage0-day14:開ける`（n5） | 12 |
| 121 | `closing` | t155 | 肯否定／狀態／命令 | `stage0-day14:閉める`（n5） | 7 |
| 122 | `resembling` | t159 | 肯否定／狀態／命令 | `general-listening-74:似る`（general） | 3 |
| 123 | `similarsounds` | t162 | 肯否定／狀態／命令 | `general-listening-78:似る`（general） | 2 |
| 124 | `followingrules` | t157 | 肯否定／狀態／命令 | `general-listening-09:守る`（general） | 10 |
| 125 | `protecting` | t156 | 肯否定／狀態／命令 | `general-listening-123:守る`（general） | 11 |
| 126 | `nodyes` | t160 | 肯否定／狀態／命令 | `stage0-day6:ええ`（n5） | 4 |
| 127 | `hereplace` | t158 | 共用／同形疑點 | `stage0-day3:ここ`（n5） | 9 |
| 128 | `request` | t157 | 共用／同形疑點 | `stage0-day17:頼む`（n5） | 23 |
| 129 | `operatingcontrols` | t158 | 共用／同形疑點 | `general-listening-20:操作`（general） | 7 |
| 130 | `startingtask` | t157 | 共用／同形疑點 | `general-listening-03:始める`（general） | 23 |
| 131 | `resuming` | t158 | 共用／同形疑點 | `general-listening-51:再開`（general） | 5 |
| 132 | `relayedmessage` | t158 | 共用／同形疑點 | `general-listening-22:伝言`（general） | 27 |
| 133 | `becareful` | t157 | 共用／同形疑點 | `general-listening-09:注意`（general） | 8 |
| 134 | `attractattention` | t158 | 共用／同形疑點 | `general-listening-77:注意`（general） | 7 |
| 135 | `pushing` | t156 | 共用／同形疑點 | `stage0-day14:押す`（n5） | 5 |
| 136 | `pressingbutton` | t157 | 共用／同形疑點 | `general-listening-20:押す`（general） | 4 |
| 137 | `coaching` | t162 | 遊戲長句 | `game-card:game:er:laura:selection:1047004:d680014bcd`（games） | 2 |
| 138 | `withmyownhands` | t162 | 遊戲長句 | `game-card:game:er:isaac:selection-voice:1f281b4519:1f281b4519`（games） | 1 |
| 139 | `inspection` | t157 | 遊戲長句 | `game-card:game:genshin:mika:join:7717e56dab`（games） | 12 |
| 140 | `selfintroduction` | t158 | 遊戲長句 | `game-card:game:er:shoichi:selection-voice:76e7082f4c:76e7082f4c`（games） | 9 |
| 141 | `beachouting` | t160 | 遊戲長句 | `game-card:game:er:lidailin:selection:1010005:3096dc95d4`（games） | 2 |
| 142 | `standby` | t157 | 遊戲長句 | `game-card:game:er:rozzi:selection:1021003:96bc380f16`（games） | 12 |
| 143 | `handitallover` | t162 | 遊戲長句 | `game-card:game:er:darko:selection-voice:2e14f16392:2e14f16392`（games） | 1 |
| 144 | `safe` | t156 | 遊戲長句 | `game-card:game:genshin:candace:join:6b093ecfda`（games） | 16 |
| 145 | `goaway` | t160 | 遊戲長句 | `game-card:game:er:karla:selection-voice:5f98347e3e:5f98347e3e`（games） | 3 |
| 146 | `trustfist` | t162 | 遊戲長句 | `game-card:game:er:hyunwoo:selection-voice:149a9f3f71:149a9f3f71`（games） | 1 |
| 147 | `shopwelcome` | t159 | 遊戲長句 | `game-card:game:er:hyejin:selection-voice:aaeff61b15:aaeff61b15`（games） | 3 |
| 148 | `beatbadguys` | t162 | 遊戲長句 | `game-card:game:er:silvia:selection:1016005:8bbe599649`（games） | 1 |
| 149 | `trickordrink` | t162 | 遊戲長句 | `game-card:game:er:lidailin:selection:1010007:634d98657d`（games） | 1 |
| 150 | `iseeall` | t162 | 遊戲長句 | `game-card:game:er:craver:selection-voice:7dd7c79664:7dd7c79664`（games） | 1 |
| 151 | `unstoppablerunner` | t162 | 遊戲長句 | `game-card:game:er:magnus:selection-voice:cf6c2b990a:cf6c2b990a`（games） | 1 |
| 152 | `beautifulpose` | t162 | 遊戲長句 | `game-card:game:er:camilo:selection-voice:66e3350d22:66e3350d22`（games） | 1 |
| 153 | `pinningbutterfly` | t162 | 遊戲長句 | `game-card:game:er:daniel:selection-voice:6d577b2791:6d577b2791`（games） | 1 |
| 154 | `blackwings` | t162 | 遊戲長句 | `game-card:game:genshin:fischl:burst:e27077a449`（games） | 1 |
| 155 | `perfectbeauty` | t162 | 遊戲長句 | `game-card:game:er:tazia:selection-voice:02a50524ae:02a50524ae`（games） | 1 |
| 156 | `choiceconsequence` | t162 | 遊戲長句 | `game-card:game:er:istvan:selection-voice:4bf842ed88:4bf842ed88`（games） | 1 |
| 157 | `cleaning` | t156 | 共用扇出／比喻句 | `stage0-day16:掃除`（n5） | 4 |
| 158 | `cookingdish` | t157 | 共用扇出／比喻句 | `stage0-day9:料理`（n5） | 6 |
| 159 | `bank` | pilot | 分層 n5/pilot | `stage0-day3:銀行`（n5） | 1 |
| 160 | `school` | pilot | 分層 n5/pilot | `stage0-day3:学校`（n5） | 1 |
| 161 | `nearby` | t155 | 分層 n5/t155 | `stage0-day10:そば`（n5） | 12 |
| 162 | `letter` | t155 | 分層 n5/t155 | `stage0-day7:手紙`（n5） | 7 |
| 163 | `apartment` | t156 | 分層 n5/t156 | `stage0-day15:アパート`（n5） | 1 |
| 164 | `autumn` | t156 | 分層 n5/t156 | `stage0-day12:秋`（n5） | 1 |
| 165 | `puttingontrousers` | t157 | 分層 n5/t157 | `stage0-day16:はく`（n5） | 1 |
| 166 | `family` | t157 | 分層 n5/t157 | `stage0-day20:家族`（n5） | 3 |
| 167 | `various` | t158 | 分層 n5/t158 | `stage0-day21:いろいろ`（n5） | 1 |
| 168 | `notatall` | t158 | 分層 n5/t158 | `stage0-day9:全然`（n5） | 1 |
| 169 | `slidingdoor` | t159 | 分層 n5/t159 | `stage0-day22:戸`（n5） | 1 |
| 170 | `weatherconditions` | t159 | 分層 n5/t159 | `stage0-day12:天気`（n5） | 5 |
| 171 | `puttingonglasses` | t160 | 分層 n5/t160 | `stage0-day16:かける`（n5） | 1 |
| 172 | `takestime` | t160 | 分層 n5/t160 | `stage0-day11:かかる`（n5） | 1 |
| 173 | `pleasedtomeet` | t162 | 分層 n5/t162 | `stage0-day18:どうぞよろしく`（n5） | 2 |
| 174 | `train` | pilot | 分層 general/pilot | `stage0-day5:電車`（n5） | 3 |
| 175 | `meat` | pilot | 分層 general/pilot | `stage0-day6:肉`（n5） | 3 |
| 176 | `umbrella` | pilot | 分層 general/pilot | `stage0-day2:傘`（n5） | 3 |
| 177 | `singing` | t155 | 分層 general/t155 | `stage0-day9:歌`（n5） | 5 |
| 178 | `preparing` | t155 | 分層 general/t155 | `general-listening-03:準備`（general） | 34 |
| 179 | `slender` | t156 | 分層 general/t156 | `stage0-day19:細い`（n5） | 4 |
| 180 | `undressing` | t156 | 分層 general/t156 | `stage0-day16:脱ぐ`（n5） | 2 |
| 181 | `gloves` | t156 | 分層 general/t156 | `general-listening-68:手袋`（general） | 2 |
| 182 | `troubled` | t157 | 分層 general/t157 | `stage0-day17:困る`（n5） | 5 |
| 183 | `accurate` | t157 | 分層 general/t157 | `general-listening-22:正確`（general） | 2 |
| 184 | `errand` | t157 | 分層 general/t157 | `general-listening-04:用事`（general） | 2 |
| 185 | `festival` | t158 | 分層 general/t158 | `general-listening-40:祭り`（general） | 7 |
| 186 | `smallbell` | t158 | 分層 general/t158 | `general-listening-118:鈴`（general） | 1 |
| 187 | `rearguard` | t159 | 分層 general/t159 | `general-listening-123:後衛`（general） | 5 |
| 188 | `proposal` | t159 | 分層 general/t159 | `general-listening-57:提案`（general） | 3 |
| 189 | `villagers` | t159 | 分層 general/t159 | `general-listening-17:村人`（general） | 3 |
| 190 | `repeating` | t160 | 分層 general/t160 | `general-listening-38:繰り返す`（general） | 1 |
| 191 | `pronunciation` | t160 | 分層 general/t160 | `general-listening-38:発音`（general） | 1 |
| 192 | `betrayal` | t160 | 分層 general/t160 | `general-listening-178:裏切る`（general） | 1 |
| 193 | `comingdown` | t162 | 分層 general/t162 | `general-listening-06:降りる`（general） | 1 |
| 194 | `considering` | t162 | 分層 general/t162 | `general-listening-138:検討`（general） | 2 |
| 195 | `lettingescape` | t162 | 分層 general/t162 | `general-listening-150:逃す`（general） | 1 |
| 196 | `helping` | t155 | 分層 anime/t155 | `stage0-day24:手伝う`（n5） | 20 |
| 197 | `escaping` | t156 | 分層 anime/t156 | `general-listening-67:逃げる`（general） | 7 |
| 198 | `decoration` | t156 | 分層 anime/t156 | `general-listening-137:飾り`（general） | 2 |
| 199 | `condition` | t157 | 分層 anime/t157 | `general-listening-58:条件`（general） | 13 |
| 200 | `magic` | t157 | 分層 anime/t157 | `general-listening-125:魔法`（general） | 3 |
| 201 | `mentalreadiness` | t158 | 分層 anime/t158 | `anime-lesson-04:覚悟`（anime） | 1 |
| 202 | `truthrevealed` | t158 | 分層 anime/t158 | `general-listening-70:正体`（general） | 3 |
| 203 | `everyone` | t159 | 分層 anime/t159 | `stage0-day21:みんな`（n5） | 9 |
| 204 | `alreadydone` | t159 | 分層 anime/t159 | `stage0-day7:もう`（n5） | 12 |
| 205 | `wintrophy` | t160 | 分層 anime/t160 | `anime-lesson-03:勝ち取る`（anime） | 1 |
| 206 | `raisinglevel` | t160 | 分層 anime/t160 | `anime-lesson-08:高める`（anime） | 1 |
| 207 | `mouthopen` | t162 | 分層 anime/t162 | `anime-lesson-02:口`（anime） | 1 |
| 208 | `isittrue` | t162 | 分層 anime/t162 | `stage0-day17:ほんとう`（n5） | 5 |
| 209 | `relief` | pilot | 分層 games/pilot | `general-listening-15:安心`（general） | 5 |
| 210 | `waking` | t155 | 分層 games/t155 | `stage0-day4:起きる`（n5） | 3 |
| 211 | `christmasgreeting` | t156 | 分層 games/t156 | `game-card:game:er:hart:selection-voice:4ef596e51f:4ef596e51f`（games） | 2 |
| 212 | `recyclingtime` | t156 | 分層 games/t156 | `game-card:game:er:alonso:selection-voice:c44c74a562:c44c74a562`（games） | 1 |
| 213 | `freedom` | t157 | 分層 games/t157 | `general-listening-29:自由`（general） | 4 |
| 214 | `planning` | t157 | 分層 games/t157 | `general-listening-18:計画`（general） | 7 |
| 215 | `newsbroadcast` | t158 | 分層 games/t158 | `stage0-day21:ニュース`（n5） | 2 |
| 216 | `noescaperoute` | t158 | 分層 games/t158 | `game-card:game:er:sissela:selection-voice:adc32d5484:adc32d5484`（games） | 4 |
| 217 | `dontbeafraid` | t159 | 分層 games/t159 | `game-card:game:genshin:layla:burst:324d2775be`（games） | 1 |
| 218 | `wontletescape` | t159 | 分層 games/t159 | `game-card:game:genshin:jahoda:skill:1ac88e7ed5`（games） | 4 |
| 219 | `dontinterfere` | t160 | 分層 games/t160 | `game-card:game:genshin:kukishinobu:burst:68e5fd333e`（games） | 2 |
| 220 | `patrol` | t160 | 分層 games/t160 | `general-listening-116:見回り`（general） | 3 |
| 221 | `inventor` | t162 | 分層 games/t162 | `game-card:game:er:barbara:selection-voice:16dace1571:16dace1571`（games） | 1 |
| 222 | `beautifullightning` | t162 | 分層 games/t162 | `game-card:game:genshin:yaemiko:burst:8fe8b1433e`（games） | 1 |
