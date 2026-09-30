# Release audit — 0.1.0

已發布並在手機真機驗證成功：<https://frobel0520.github.io/nihongo-lab/>。目前上線版完成 T01～T03（第 1 天）、T09（PWA）；T04、T06 在 `feature/T06-T04` 分支，尚未接回 main 與部署，見 [task-breakdown.md](task-breakdown.md)。

## 已執行

- `npm install`：0 vulnerabilities。
- `npm run check`：typecheck、2 項測試、lint 全通過。
- `npm run dev` 起本機伺服器並用瀏覽器開啟首頁：四個學習階段正常渲染，無 console 錯誤。
- `npm run build`：純靜態產物建置通過（dist/ 3 個檔案）。
- 2026-09-29：`scripts/synthesize.mjs` 對本機 VOICEVOX 引擎（DirectML 版）實測一句（ずんだもん），輸出 96kbps mp3（50KB），ffmpeg 轉檔正常，`npm run check` 加入新檔後仍全過。
- 2026-09-29：第 0 階段第 1 天教材（です／は／も、9 單字、4 個文法點、6 句對話、5 題練習）寫入 `curriculum/lessons.mjs`，`scripts/build-audio-jobs.mjs` 產生 23 筆合成清單，`scripts/synthesize.mjs --batch` 全部成功，音檔共 532KB 存在 `public/audio/stage-0/day1/`。App.tsx 接上畫面渲染，瀏覽器驗證：頁面文字、練習題「看答案」互動、音檔 HTTP 200 且 content-type 正確，均正常，無 console 錯誤。`npm run check` 全過（新增 `jsx-a11y/media-has-caption` 例外，因每個 `<audio>` 旁都已有對應文字逐字稿）。
- 2026-09-29：public repository 建立並推送：[github.com/frobel0520/nihongo-lab](https://github.com/frobel0520/nihongo-lab)。
- 2026-09-29：PWA 骨架（`vite-plugin-pwa` + `@vite-pwa/assets-generator`）。`npm run build` 產出 `dist/sw.js`、`dist/manifest.webmanifest`，precache 18 項（約 206KB）。瀏覽器驗證：`npm run dev` 下 service worker 註冊並 `activated`、manifest 可抓到且含 4 個 icon、無 console 錯誤。UI 改版套用 learning-atlas 的設計系統（卡片、CSS 變數色票、Noto Sans TC + IBM Plex Mono），固定亮色模式，桌面與手機寬度（375px）都截圖確認排版正常。`npm run check`、`npm run build` 全過。
- 2026-09-29：GitHub Pages 部署上線（GitHub Actions，`.github/workflows/ci.yml`），<https://frobel0520.github.io/nihongo-lab/> HTTP 200，正式網址上 service worker `activated`、無 console 錯誤。
- 2026-09-29：Android 手機真機安裝測試。第一次安裝後音檔播不出來，查出教材音檔路徑寫死絕對路徑、在 `/nihongo-lab/` 子路徑下變成 404；改用 `import.meta.env.BASE_URL` 組路徑後修正。診斷過程中一度誤判是 Range request 問題、加了 `RangeRequestsPlugin`，後來發現這套件在 Node 環境匯入會噴 `self is not defined`，把 `npm run dev` 弄壞，已移除復原。修正版部署後，手機清除網站資料重新安裝，**確認可開啟、音檔正常播放**。
- 2026-09-29：手機版排版問題——`<audio controls>` 原生寬度較寬，把兩欄式排版的文字欄擠壓變窄。加 640px 斷點改成文字滿版、播放器獨立一行；`npm run dev` 下手機寬度（375px）截圖確認修正後正常。

- 2026-09-30：T06 SRS 單字卡與 T04 聽寫（分支 `feature/T06-T04`）。純邏輯放 `lib/`（`srs.mjs`、`dictation.mjs`、`progress.mjs`），新增 3 個測試檔共 19 項測試，`npm test` 21 項全過；`npm run typecheck`、`npm run lint`（`npm run check`）通過，`npm run build` 通過（PWA precache 18 項）。瀏覽器（桌面與 375px 寬）實測：單字卡翻面、鍵盤 1～4 評分、答「還不會」的卡排回佇列尾端、`localStorage` 寫入的到期日／ease 與預期一致、重新整理後佇列由存檔重建；聽寫比對標出漏聽字、答對後 `passed` 記入存檔且不被之後答錯洗掉、一次 Enter 只送出一次；模擬 `setItem` 丟例外時畫面顯示「無法儲存進度」且仍可繼續複習；音檔請求 206。無 console 錯誤。

- 2026-09-30：T05 跟讀（分支 `feature/T05`，疊在 `feature/T06-T04` 之上）。新增 `lib/shadowing.mjs`（留白長度）與 3 項測試。瀏覽器實測：開始跟讀 3 輪，狀態依序為「聽 → 換你念 → 聽 → 換你念 → 聽」後自動停止；中途按停止立即靜音、不誤報「音檔無法播放」；無 console 錯誤。不含調速（2026-09-30 決定不做）。
- 2026-09-30：T07 口語轉換表與 T13 動畫名句首批（文字內容，音檔未合成）。`curriculum/lessons.mjs` 新增第 2 階段兩課：口語轉換表（10 個重點、20 句對照例句、6 題練習）、動畫名句（8 句，每句含出處與解說、3 題練習）。新增 `tests/lessons.test.mjs`（課程 id 唯一、角色合法、音檔路徑唯一、`audioReady` 不是 false 的課程音檔必須存在、名句必須有出處與解說、`audioReady: false` 的課程不進聽寫與跟讀句庫），`npm run check` 30 項測試全過，`npm run build` 通過。瀏覽器實測：課程下拉選單可切到名句課，顯示 8 句、8 個「音檔待產生」、沒有播放器；聽寫與跟讀仍是 14 句，未混入待產生的課程。`scripts/build-audio-jobs.mjs --missing` 列出 28 筆待合成項目。

聽寫的答案比對只接受「整句漢字原文」或「整句假名讀音」；混合寫法（例如「田中さんはせんせいです」）會被判有差異並標出漢字與假名的落差。日文輸入法選字時按 Enter 不送出的防護（`isComposing`）已寫入，但瀏覽器自動化工具無法輸入日文，實際 IME 與手機鍵盤未測。單字卡與聽寫只在桌面瀏覽器與 375px 模擬寬度驗證，未在 Android／iOS 真機操作。SRS 排程參數（間隔倍率、每日新卡 10 張）是 SM-2 簡化版的預設值，尚未用長期使用資料調整。

動畫名句的台詞用字：8 句都用網路搜尋交叉確認過寫法（2026-09-30），查到的都是二手來源（百科、名言整理網站），不是原作台本。查證過程更正了兩處：「僕は新世界の神となる」原本記成「になる」，「月に代わっておしおきよ」多寫了逗號。來源：[SLAM DUNK](https://www.sladunclub.com/dont-give-up/)、[北斗の拳](https://news.mynavi.jp/article/20230123-2567747/)、[名探偵コナン](https://dic.pixiv.net/a/%E7%9C%9F%E5%AE%9F%E3%81%AF%E3%81%84%E3%81%A4%E3%82%82%E3%81%B2%E3%81%A8%E3%81%A4)、[エヴァンゲリオン](https://www.animatetimes.com/news/details.php?id=1622773829)、[セーラームーン](https://dic.pixiv.net/a/%E6%9C%88%E3%81%AB%E4%BB%A3%E3%82%8F%E3%81%A3%E3%81%A6%E3%81%8A%E3%81%97%E3%81%8A%E3%81%8D%E3%82%88)、[ONE PIECE](https://www.animatetimes.com/news/details.php?id=1633076586)、[氷菓](http://phoenix-wind.com/character/chitanda_eru.php)、[DEATH NOTE](https://dic.pixiv.net/a/%E6%96%B0%E4%B8%96%E7%95%8C%E3%81%AE%E7%A5%9E)。標點、漢字與假名的表記各站略有出入，採較常見的寫法。口語轉換表的例句是自行撰寫的原創句子，未查證外部資料。VOICEVOX 的 9 個角色沒有依作品角色的性別或年齡挑選，合成後的語氣與原配音不同，只能訓練聽詞與語速。口語轉換表與名句兩課的音檔都還沒合成，也就沒有聽過音質。

9 個角色只各自驗證音檔可播放，未逐一人耳確認音質是否符合預期語氣。第 0 階段只做了第 1 天，後續天數、跟讀（T05）、口語轉換表（T07）、跨裝置同步（T10）都還沒開始。iOS 上的安裝與播放行為未測試，只驗證過 Android Chrome。
