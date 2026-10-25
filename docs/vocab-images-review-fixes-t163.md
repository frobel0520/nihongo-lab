# T163：單字圖片審查修正（F1–F9、F11）

> 結案更新：原reviewer已對`cee05211291d9751cc4be49d69eb6aadbf3bdfb1`確認F10／原P2可結案、無新增阻塞，必要CI成功。使用者已授權發布；實際Pages與正式站驗收見[PR #171最終發布紀錄](https://github.com/frobel0520/nihongo-lab/pull/171)。以下保留原審查、修正、待複核及限制的歷史，桌面模擬不代表真機／實體螢幕閱讀器通過。

基準 main `64e7175`（T162）。依 [圖片與 UX 審查報告](vocab-images-ux-review.md) 逐項核實後修正；F10 保留觀察。開工時唯一未合併 PR 是安全修補草稿 [#169](https://github.com/frobel0520/nihongo-lab/pull/169)（只改 `package.json`、lock 與安全報告），本輪不混入其內容。

## 下載工作（F1、F2、F11）

重現：T162 的進度數字「X / N」是**已處理**張數（含失敗），不是已存張數。離線時按下載，120 秒內計數升到 468／2242，實際存入 0 張，約 9.5 分鐘才回報失敗。

- **工作與畫面分離**：`app/lib/imageDownloadJob.ts` 是模組層級的單一工作（`useSyncExternalStore` 訂閱）。設定頁卸載不會中止；回設定頁顯示同一工作，執行中只有「取消下載」，不會重複啟動。跨分頁仍用 Web Locks，持鎖分頁異常關閉時瀏覽器自動釋放。只限網站開著的期間：重新整理、關閉分頁或 APP 被系統終止會中斷，介面已寫明；不宣稱背景下載。
- **網路判斷**：`navigator.onLine === false` 只用來立即說明「目前沒有網路」，不送請求。為 true 時仍以實際請求判斷：fetch 在網路層失敗（`TypeError`）不重試、不算失敗，連續 6 次（等於同時下載數）就整批暫停；`offline` 事件也會立即暫停。HTTP 錯誤、內容不符照舊重試 2 次，容量不足照舊不重試。
- **計數**：`saved` 只算寫入快取並重新讀到的張數；`failed` 是確定失敗；網路中斷的列為 `deferred`，留在待下載，下次接續。音檔下載未傳 `isNetworkError`，結果格式與行為不變（有測試）。
- **F11**：`formatMegabytes` 對未滿 0.01 MB 的非零大小改用 KB（KB＝10^3 bytes），0 仍顯示 0.00 MB。

## 說明與提醒（F3、F4）

- 清除快取的說明與確認文字列出會刪除離線音檔與單字圖片，學習進度與顯示偏好保留。
- 更新橫幅改為「學習進度、下載的音檔與單字圖片會保留；新版若有新增或修訂的圖片，可到設定頁補下載」。
- 提醒條件（`shouldRemindImageUpdate`）：曾確認全部存好（localStorage 記下當時清單指紋）、目前指紋不同、且未對這個指紋按過「知道了」。首頁上方一行，可「前往下載」或「知道了」；設定頁不顯示。平常只讀兩個 localStorage 字串，不開 Cache API。指紋由 build 時的小虛擬模組 `virtual:vocab-image-fingerprint` 提供，主程式不含整份清單。
- T163 以前下載完的人沒有完成紀錄：沒有紀錄時，載入 3 秒後數一次明確下載快取的筆數（只讀 keys），達到目前總張數就視為曾下載完。從沒下載完的人不提醒，維持主動下載契約。

## 圖片（F5–F7）

三張圖各只對應 1 張卡，映射與教材文字不變；只用既有色值。

| SVG | 卡片 | 修改 |
|---|---|---|
| `minutehand` | `stage0-day4:分` | 紅色分針指向整點之後（呼應課文「三時五分」）並有移動弧線與分刻度；不再與 `oneoclock` 等整點圖同構 |
| `temporarily` | `general-listening-144:一時` | 依課文「一時的に預けるだけ」：格櫃裡的劍、取件牌、時鐘與取回箭頭 |
| `lifenotsmooth` | `game-card:game:er:aiden:selection-voice:eaea8b98f3:eaea8b98f3` | 起伏路面與石頭、雨雲，人物聳肩往終點旗前進 |

圖片網址帶內容版本，已下載全部圖片的人會看到「待下載 3 張（2.5 KB），其中 3 張是更新過的新版」，補下載只抓這 3 張；新版存好後才刪舊版。其餘 625 張 T162 圖的 bytes 與紀錄相同（有測試）。預覽：[分](previews/t163-minutehand-card-375.png)、[暫時](previews/t163-temporarily-card-375.png)、[人生不順](previews/t163-lifenotsmooth-card-375.png)。

## 資料體積（F8）

確認 `alt` 只被兩個測試讀取，畫面固定 `alt=""`。逐 ID 構圖描述移到作者資料 [vocab-illustration-descriptions.json](vocab-illustration-descriptions.json)，runtime 映射只留 id、word、reading、zh、src。測試把描述併回後，歷次發布的映射快照雜湊全部相同。

| 單字卡頁 chunk（本機正式 build，zlib level 9） | raw bytes | gzip bytes |
|---|---|---|
| T162 | 1,315,789 | 307,085 |
| 移除描述後 | 776,606 | 153,125 |
| T163 最終（含焦點修正） | — | 153,281 |

precache 22,731,907→22,197,101 bytes。這個 chunk 在 precache 內，首次安裝少下載約 535 KB，開啟單字卡時少解析約 540 KB 原始碼；未量測實機解析時間。

新指標 `illustrationChunkGzipBytes`（Change Request，新增而非放寬）：以內容（含第一筆映射 ID）找 chunk，不靠檔名；任何 JS 產物含構圖描述即失敗。門檻沿用 T120「基準＋20%」：ceil(153,125×1.2)＝183,750 bytes。描述若回到 runtime（約 +150 KB gzip）必定超標。其他門檻不變。

## 鍵盤焦點（F9）

重現：以 Enter 揭示後 `document.activeElement` 是 `<body>`。修正：鍵盤操作（空白鍵、1／2、方向鍵，或 `event.detail === 0` 的按鈕點擊）之後，若焦點掉到 `<body>`，揭示後移到評分區（`fieldset`，tabIndex -1），換卡後移到「顯示答案」。焦點仍在其他控制項時不搬；滑鼠與觸控點擊不搬；使用 `preventScroll`，不改版面。

## 驗證

- `npm run check`：353 tests、typecheck、lint 通過。正式 `/nihongo-lab/` build 與 `npm run perf:bundle` 通過：主程式 gzip 65,982、CSS 5,068、配圖 chunk 153,281／183,750、precache 22,197,101／26,869,829（483 項，不含單字圖）。
- 新增單元測試：網路中斷整批暫停且不記失敗、離線開始約一輪即停、HTTP 錯誤仍重試、取消原因、音檔結果格式不變、KB 顯示、提醒條件與清單指紋、三圖只改這三張、runtime 映射不含描述且 app 不載入描述、新預算邊界。
- `test:images`（CI）擴充並在本機正式 build 通過：離線開始 21 ms 回應且 0 請求；連線在但請求全失敗時 11 個請求內暫停（約 0.4 秒）；途中斷網約 40 ms 暫停；換頁後持續下載；回設定頁同一工作、無第二個開始鈕；取消後保留已存；跨分頁鎖；重試與持續失敗；提醒顯示與同版本只一次；鍵盤揭示→評分區、Tab→第一個評分鈕、評分後回「顯示答案」、重練卡、滑鼠點擊不搬焦點；真正斷網 2242 張經 worker 讀取 SHA 一致；圖片修訂只抓 1 張。pageerror 0。
- 真實 build 跨版（本機，T162→T163）：T162 下載全部 2242 張、合成進度與音檔 → 更新到 T163 → 首頁出現提醒 → 設定頁「待下載 3 張（2.5 KB），其中 3 張是更新過的新版」→ 只下載 3 張，其餘 2239 張快取網址不變，進度與音檔保留。
- 375×667（桌面 Chromium 模擬，DPR 2）：下載中與離線狀態無水平溢位；三張新圖在實際卡片揭示後載入正確版本。預覽：[離線時](previews/t163-images-offline-375.png)、[下載中](previews/t163-images-running-375.png)。

## 限制

- 桌面 Chromium 模擬手機，不是真機；未做實體螢幕閱讀器驗收；不宣稱記憶效果。
- 下載工作只在網站開著時進行；行動瀏覽器切到背景時可能暫停或被終止，下次再按從缺少的接續。
- 「曾下載完」的推定以快取筆數為準：瀏覽器若只清掉部分快取，可能不提醒；提醒只是方便，設定頁數字以實際快取為準。
- F10（320 寬＋放大字級的長句卡可視區很小、橫向版面）本輪未處理。
