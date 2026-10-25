# T164／PR #171：P2 作答後句首定位

## 範圍與審查依據

本輪基準為審查版本`8f4ddc04d4bab059220dfb39994d078d23c319ae`；遠端main仍為`d7ce2d8`，PR #171為Draft、未合併、未部署。開工工作目錄乾淨、保留既有材料；GitHub reviews、行內comments及issue留言查詢均為空，repo未找到另一份完整review，因此依使用者本輪提供的P2重現與修正要求處理，沒有宣稱讀取到未同步的報告。

保留已確認的自然捲動、長句滿寬及全部CSS。只修正實際新呈現與焦點的協調，並補作答／導航後的幾何回歸。原F10的40種閱讀／20次完整操作證據保留，但當時沒有在每次作答後直接量句首；不能據此宣稱本P2已驗收。

## 根因與修正

- 舊定位effect只比較card ID；單張卡答「還不會」後，session已進入下一次重練，ID仍相同，所以未定位。
- 舊版以兩個effect分別定位與focus。鍵盤評分後雖先定位新卡，後續focus到卡尾「顯示答案」並scrollIntoView，又把句首捲到標頭上方。
- 改用**session呈現轉換**：session只在`moveTo`的評分／導航動作換成新物件；同ID再次作答、手動前後、跳過、完成後返回都算新呈現。一般props進度更新、圖片／播放元件重繪與單純揭示不產生session轉換。無效的邊界導航會清掉未消耗鍵盤旗標，不污染下一次操作。
- **單一useLayoutEffect**：DOM commit後，先安排`focus({preventScroll:true})`，再只對新呈現做一次卡片開頭定位。沒有固定延遲、重試捲動或兩個effect互相覆蓋。
- 鍵盤新呈現的焦點在`.flash-word`（`tabIndex=-1`，不加入一般Tab序列）：句首可讀，可用Space揭示；由句首按Tab到播放、再Tab到顯示答案。一般鍵盤揭示仍把焦點交給評分群組，但preventScroll保留正在閱讀的位置；1／2仍可評分，Tab進入評分按鈕時才由明確鍵盤操作自然捲動。滑鼠不搬焦點。

## 操作後幾何

同一份教材、兩種視窗／根字級，桌面Chromium touch模擬，DPR1、safe-area0。測試在操作完成與瀏覽器焦點穩定後直接量測，**量測前沒有focus或scroll補位**。判定不只看焦點：句首top須在標頭bottom以下，且第一行的bottom不可落到固定底部分頁列後面。

| 視窗／根字級 | 操作 | 修正前句首top | 修正後句首top | 標頭bottom | 修正後焦點 |
|---|---|---|---|---|---|
| 320×568／130% | same-id-pointer | -300.56 | 98.44 | 56 | 不搬焦點 |
| 320×568／130% | same-id-keyboard | -300.56 | 98.44 | 56 | 句首 |
| 320×568／130% | keyboard-next-long | -235.56 | 98.44 | 56 | 句首 |
| 320×480／150% | same-id-pointer | -631.89 | 98.11 | 56 | 不搬焦點 |
| 320×480／150% | same-id-keyboard | -631.89 | 98.11 | 56 | 句首 |
| 320×480／150% | keyboard-next-long | -557.84 | 98.16 | 56 | 句首 |

單位CSS px。線上／真正離線結果均有保存：[基準68次觀察](srs-presentation-t164-p2-before.json)／[修正後68次觀察](srs-presentation-t164-p2-after.json)。其中64次是新呈現：基準41次句首不可見，修正後64／64可見；32次鍵盤新呈現焦點均在句首。另4次是刻意停在句中再揭示，`requiresVisibleStart:false`，保留原閱讀位置；其top為負不是P2失敗，也不能為了數字通過而強制回頂。

Sissela：`game-card:game:er:sissela:selection-voice:992579e355:992579e355`；Eva：`game-card:game:er:eva:selection-voice:1b4ea5830e:1b4ea5830e`；短卡使用既有柯萊「飛べ。」。只用隔離的合成到期進度排出測試順序，沒有更改教材或真實使用者進度。

## 前後預覽

| 情境 | 修正前 | 修正後 |
|---|---|---|
| 320×568／130%，同ID滑鼠重練 | [句首在上方](previews/t164-p2-before-568-130-online-same-id-pointer.png) | [句首可見](previews/t164-p2-after-568-130-online-same-id-pointer.png) |
| 320×568／130%，鍵盤評分至Eva | [焦點將句首捲出](previews/t164-p2-before-568-130-online-keyboard-next-long.png) | [句首焦點與定位一致](previews/t164-p2-after-568-130-online-keyboard-next-long.png) |
| 320×480／150%，同ID鍵盤重練 | [未定位](previews/t164-p2-before-480-150-online-same-id-keyboard.png) | [可讀句首](previews/t164-p2-after-480-150-online-same-id-keyboard.png) |
| 320×480／150%，鍵盤評分至Eva | [焦點覆蓋定位](previews/t164-p2-before-480-150-online-keyboard-next-long.png) | [可讀句首](previews/t164-p2-after-480-150-online-keyboard-next-long.png) |

## 驗證與重現

新增`tests/srs-presentation-browser.mjs`，接在既有`npm run test:srs-layout`後，CI執行同一入口。兩個尺寸×線上／真正離線：同ID連續重練、滑鼠／Enter揭示＋1／2評分、Sissela→Eva、完成後返回、鍵盤／滑鼠前後與跳過、長短卡切換、邊界無效導航。除了64次句首幾何，也驗證Tab可依次到播放與揭示、揭示保留句中位置、播放重繪與跨分頁進度事件不回頂、進度重載保持。

真正斷網採BrowserContext.setOffline(true)、navigator.onLine=false、重載，再以未快取探針ERR_INTERNET_DISCONNECTED確認。只準備三張代表卡的真實圖片及音檔供新定位測試；原T163全2242圖片離線SHA回歸另執行，不將三張抽驗當作全部圖片驗收。

重現基準：`node tests/srs-presentation-browser.mjs --dist <8f4ddc0正式build> --record --out .cache/p2-before.json --screenshots .cache/p2-before`；修正版同命令使用最新正式build並移除`--record`（將幾何失敗變成斷言）。`--record`僅供記錄已知基準問題，CI不使用，未放寬正式檢查。

本機check353測試／typecheck／lint、正式`/nihongo-lab/` build與perf:bundle通過。最新precache22,196,991／26,869,829，JS gzip65,975／630,000、CSS5,133／5,800、配圖chunk153,397／183,750，原門檻與收錄保持。既有自然捲動40種閱讀／20次完整操作回歸，以及test:images全2242圖離線SHA與下載更新回歸再次通過，pageerror 0。最新commit必要CI以同一PR的實際結果為準。

相對審查版，教材、ID、FSRS、同步3、全部SVG／映射／音檔、下載與更新程式、安全修補及CSS均無變更。沒有新增runtime dependency。舊進度、既有圖片下載、更新等待確認及多分頁保護保持。

限制：桌面viewport／根字級與觸控模擬，不是真機、瀏覽器原生zoom、OS字型或實體螢幕閱讀器驗收。不宣稱本P2已經原reviewer結案；本輪仍維持同一Draft PR未合併、未部署，僅交這組P2定點複核，不重新審全案。
