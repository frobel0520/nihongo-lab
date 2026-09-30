# 系統設計

## 架構

Vite / React + TypeScript，本機瀏覽器執行，local-first。目前無後端；未來若需要（例如 SRS 進度跨裝置同步）才考慮 Cloudflare Workers / KV / D1，見 [project-plan.md](project-plan.md)。

- `app/main.tsx`：React 掛載點。
- `app/App.tsx`：頁首、三個分頁（課程／單字卡／聽寫，用 `#/`、`#/srs`、`#/dictation` hash 切換，不加路由套件）與進度存取提示。分頁內容在 `app/views/`（`LessonView`、`SrsView`、`DictationView`），共用的音檔元件在 `app/components/AudioLine.tsx`（`PlayButton` 音檔載入或播放失敗時顯示明確錯誤）。
- `app/views/ShadowingView.tsx`：跟讀。每輪播放一次、留白（見 `lib/shadowing.mjs`）讓使用者念、再播，可選 3／5／10 輪，可隱藏原文；音檔播放失敗顯示明確錯誤；按停止造成的 `AbortError` 不當成錯誤。不含調速。
- `lib/`：無 DOM 的純邏輯，用 `.mjs` + JSDoc 型別，讓 `node --test` 直接測、TypeScript 也能匯入。`srs.mjs`（SM-2 簡化版排程、單字卡與每日佇列）、`dictation.mjs`（聽寫句子清單、逐字比對）、`progress.mjs`（進度資料形狀、解析驗證、聽寫紀錄）、`shadowing.mjs`（跟讀留白長度與輪數選項）。
- `app/lib/storage.ts`、`app/useProgress.ts`：`localStorage` 讀寫（key `nihongo-lab:progress:v1`）與 React 狀態；存檔壞掉時原文備份到 `…:backup` 並提示，寫入失敗時畫面顯示訊息但仍可繼續學習。
- `curriculum/lessons.mjs`：學習階段與課程資料的單一來源，目前四個階段皆為空殼（`lessons: []`），內容待第 0 階段教材產出後填入。
- `curriculum/voices.mjs`：教材語音角色陣容，對應本機 VOICEVOX 引擎（127.0.0.1:50021）的 speaker id。2026-09-29 定案 9 個角色：ずんだもん、春日部つむぎ、雨晴はう、小夜/SAYO、櫻歌ミコ、春歌ナナ、猫使ビィ、中国うさぎ、東北ずん子。
- `scripts/synthesize.mjs`：呼叫 VOICEVOX 引擎產生 wav、再用 ffmpeg 轉 96kbps mp3 的教材語音產生腳本；只在本機產生教材時用，不是網站執行期依賴。已用 ずんだもん 實測一句，輸出 50KB mp3，音質正常。
- `tests/curriculum.test.mjs`：驗證 curriculum 資料結構契約。

## 語音產製流程

VOICEVOX（本機工具，不進 repo）產生 wav → `scripts/synthesize.mjs` 呼叫其 HTTP API 並用 ffmpeg 轉 mp3 → mp3 進 repo 當靜態資產。其他裝置只要 `git pull` 就有音檔，不需要裝 VOICEVOX。詳細估算見 [project-plan.md](project-plan.md)。

## PWA

用 `vite-plugin-pwa`（generateSW 模式，workbox 產生 service worker），不手刻，避免自己維護 hashed 檔名 precache 清單。

- `icon-source.svg`：來源圖示（512×512，深藍底 + 紅圓 + 白色「日」字，安全區夠寬，maskable 也不會被裁切掉字）。`pwa-assets.config.ts` 用 `@vite-pwa/assets-generator` 的 `minimal2023Preset` 從它產生 `public/` 下的 64／192／512／maskable-512／apple-touch-icon／favicon.ico。
- `vite.config.ts` 的 `VitePWA()`：manifest（name、icons、standalone、theme/background color）+ `runtimeCaching` 把 `/audio/*.mp3` 設成 CacheFirst（快取名稱與路由正規表示式來自 `lib/offline.mjs`，`rangeRequests: true`，`maxEntries` 3000）。`devOptions.enabled: true` 讓 `npm run dev` 也能測 service worker。
- 離線音檔（T16）：**單靠播放不會存檔**——`<audio>` 一律送 Range 請求、伺服器（含 GitHub Pages）回 206，而 Cache API 存不了 206、workbox 也只存 200，所以 CacheFirst 永遠是空的。做法：課程頁的「離線音檔」區塊用不帶 Range 的 `fetch` 抓整檔，由頁面端（`app/lib/offlineAudio.ts`）驗證後寫進同一個快取；之後播放器的 Range 請求由 `rangeRequests` 外掛從快取的整檔切成 206 回應。設計重點：
  - 下載網址加 `?offline-download=1`（`downloadUrl`），不符合音檔路由的正規表示式，繞過 service worker 的 CacheFirst；否則它會在回應之後非同步地把任何 200（例如 captive portal 的 HTML）存進音檔快取，和頁面端的驗證搶時間。測試釘住「下載網址不符合路由」。
  - 只收 200 且 `content-type` 是 `audio/*`；驗證失敗會清掉該網址既有的髒資料，`has` 也驗內容類型。
  - 已存在的略過，失敗的逐一回報、不自動重試，再按一次只補抓失敗的。
  - 在 `vite.config.ts` 以 `options.rangeRequests` 開啟外掛（由 workbox-build 寫進 service worker），不在設定檔裡 import `workbox-range-requests`，避免先前在 Node 環境（`npm run dev`）匯入該套件就報錯的問題。
- 驗證：`npm run build` 產出 `dist/sw.js`、`dist/manifest.webmanifest`，precache 18 項（約 206KB）；`npm run dev` 下瀏覽器確認 service worker `activated`、manifest 抓得到、4 個 icon。

## 課程資料補充（T07、T13）

- `Lesson.audioReady`：預設 true。設為 false 表示文字完成、音檔未合成；畫面顯示「音檔待產生」且不放播放器，`buildSentences`（聽寫、跟讀）整課略過。`tests/lessons.test.mjs` 檢查 `audioReady` 不是 false 的課程音檔都存在。
- `GrammarPoint.jlpt`（選填）：對應 OpenJLPT 文法 id 的陣列，只給 `npm run coverage` 計算文法涵蓋率用，畫面不顯示。
- `Lesson.quotes`：動畫與遊戲名句，每筆是一般句子加 `source`（作品與角色）與 `note`（口語重點解說）。音檔就緒後自動進入聽寫與跟讀。
- 補產音檔流程（在有 VOICEVOX 與 ffmpeg 的機器上）：`node scripts/build-audio-jobs.mjs --missing` 只列出還沒有音檔的項目，再 `node scripts/synthesize.mjs --batch scripts/audio-jobs.json`，最後把課程的 `audioReady: false` 移除。
- 涵蓋率檢查：`lib/coverage.mjs` 是純邏輯（單字比對、漢字分級、文法 id 統計、課數推算，有測試）；`scripts/coverage-openjlpt.mjs` 負責下載 OpenJLPT 資料（釘在固定 commit，快取在不進 git 的 `.cache/`）與輸出報告。OpenJLPT 為 CC BY-SA 4.0，所以資料不進 repo；只有執行結果的數字會寫進文件。
- 讀音標記（T15）：`lib/furigana.mjs` 把句子的整句假名 `reading` 對回每段漢字，輸出 `{ text, ruby? }[]`，畫面（`app/components/Ruby.tsx`）轉成 `<ruby>`。對齊規則：漢字段之間的假名（送假名、助詞）當定位點，標點與空白若在讀音裡也出現就當漢字段之間的邊界；讀音標整段漢字（會社員 → かいしゃいん），不逐字拆；對不起來或有多種對法時回傳 null，不猜。
- `Line.ruby`、`VocabItem.ruby`（選填）：手動標註，格式 `{40秒|よんじゅうびょう}で{支度|したく}しな！`（大括號內為「原文|讀音」，記法與 OpenJLPT 的 furigana 欄位相同，只是格式）。自動對齊不了的句子（如含阿拉伯數字）才需要；去掉標記後必須等於 `jp`。`tests/lessons.test.mjs` 檢查每個含漢字的句子都標得出讀音。
- 顯示偏好（`lib/prefs.mjs`、`app/prefs.ts`）：目前只有「漢字上方標讀音」，預設開啟，存 `localStorage` 的 `nihongo-lab:prefs:v1`，與學習進度分開；壞掉或存不進去就用預設值，不打斷使用者。關閉時維持原本的「原文＋另起一行讀音」。單字卡（SRS）不受影響：正面本來就不顯示讀音，背面有讀音行。
- `LessonView` 用下拉選單切換所有階段的課程，有內容的區塊才顯示。

## SRS 與聽寫設計（T06、T04）

- **進度格式**（版本 1）：`{ version, srs: { [cardId]: { ease, interval, reps, lapses, due, firstSeen } }, dictation: { [audio 路徑]: { attempts, passed, lastAt } } }`。日期一律本機時區 `YYYY-MM-DD`。單筆格式不對只丟那一筆，整份壞掉或版本未知才退回空進度（並備份原文）。未來 T10 同步若要合併，需要升版並加更新時間欄位。
- **單字卡 id**：`課程 id:單字`，教材增補不會讓舊進度錯位；教材移除的卡片進度保留但不出現。
- **排程**：四級評分（還不會／有點難／記得／很簡單）。新卡 good 依序隔 1、3 天再乘 ease；again 今天再看並降 ease（下限 1.3）。每日新卡上限 10 張，以 `firstSeen` 計數，重新整理頁面不會多出新卡。同一輪答「還不會」的卡排回佇列尾端。
- **聽寫比對**：忽略空白與標點，片假名視同平假名，全形半形統一；可接受整句漢字原文或整句假名讀音（取較接近的一個），用最長共同子序列標出漏聽與多打的字。混合寫法目前判為有差異。`passed` 一旦為 true 不被之後答錯覆蓋。

## 待設計（下一輪任務）

- 跨裝置同步 Worker：端點設計、資料存放（KV vs 私有 GitHub repo JSON store）、裝置 ID 產生與衝突處理（兩裝置離線時都寫入，重新連線後怎麼合併，需要明確規則，不能悄悄覆蓋）。
- 手機上實際「加入主畫面」安裝，全螢幕開啟的真實驗收（目前只驗證到 service worker／manifest 技術條件，未做真機安裝）。

教材資料結構已在第 1 天教材定案，見 `curriculum/lessons.mjs`、`curriculum/voices.mjs`。UI 視覺沿用 [learning-atlas](https://github.com/frobel0520/learning-atlas) 的設計系統（Noto Sans TC + IBM Plex Mono、卡片式排版、CSS 變數色票、`prefers-color-scheme` 自動深色模式），維持 Michael 的網站家族一致風格。
