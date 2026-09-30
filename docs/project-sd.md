# 系統設計

## 架構

Vite / React + TypeScript，本機瀏覽器執行，local-first。目前無後端；未來若需要（例如 SRS 進度跨裝置同步）才考慮 Cloudflare Workers / KV / D1，見 [project-plan.md](project-plan.md)。

- `app/main.tsx`：React 掛載點。
- `app/App.tsx`：頁首、三個分頁（課程／單字卡／聽寫，用 `#/`、`#/srs`、`#/dictation` hash 切換，不加路由套件）與進度存取提示。分頁內容在 `app/views/`（`LessonView`、`SrsView`、`DictationView`），共用的音檔元件在 `app/components/AudioLine.tsx`（`PlayButton` 音檔載入或播放失敗時顯示明確錯誤）。
- `app/views/ShadowingView.tsx`：跟讀。每輪播放一次、留白（見 `lib/shadowing.mjs`）讓使用者念、再播，可選 3／5／10 輪，可隱藏原文；音檔播放失敗顯示明確錯誤；按停止造成的 `AbortError` 不當成錯誤。不含調速。
- `lib/`：無 DOM 的純邏輯，用 `.mjs` + JSDoc 型別，讓 `node --test` 直接測、TypeScript 也能匯入。`srs.mjs`（SM-2 簡化版排程、單字卡與每日佇列）、`dictation.mjs`（聽寫句子清單、逐字比對）、`progress.mjs`（進度資料形狀、解析驗證、聽寫紀錄）、`shadowing.mjs`（跟讀留白長度與輪數選項）。
- `app/lib/storage.ts`、`app/useProgress.ts`：`localStorage` 讀寫（key `nihongo-lab:progress:v1`）與 React 狀態；存檔壞掉時原文備份到 `…:backup` 並提示，寫入失敗時畫面顯示訊息但仍可繼續學習。
- `curriculum/lessons.mjs`：學習階段與課程資料的單一來源，目前第 0 階段有 2 課（第 1、2 天）、第 2 階段有 2 課（口語轉換表、動畫與遊戲名句），第 1、3 階段仍是空的（`lessons: []`）。
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
- 字型快取（T20）：`fonts.googleapis.com` 用 StaleWhileRevalidate、`fonts.gstatic.com` 用 CacheFirst（`google-fonts-styles`／`google-fonts-files`），第一次連網載入後離線也顯示同一套字型；跨網域是 opaque 回應（status 0），要明說 `statuses: [0, 200]` 才會存。
- 型別檢查（T20）：`tsconfig.json` 開啟 `checkJs`，`lib/`、`curriculum/`、`scripts/` 的 `.mjs`（JSDoc 型別）納入 `npm run typecheck`；`tests/` 不納入。
- 單字卡快捷鍵（T20）：判斷邏輯在 `lib/keys.mjs`；空白鍵在按鈕、連結、輸入元件上讓位，數字鍵只在輸入元件讓位。
- 新版本提示（T21）：service worker 維持 `autoUpdate`（新版立刻接管），頁面用 `controllerchange`（且事件前已被控制）偵測「更新已生效」並顯示橫幅，由使用者決定何時重載；回到前景時 `registration.update()`，10 分鐘節流（`lib/sw-update.mjs`）。不自動重載，因為聽寫輸入與進行中的單字卡會被打斷。
- 驗證：`npm run build` 產出 `dist/sw.js`、`dist/manifest.webmanifest`，precache 18 項（約 206KB）；`npm run dev` 下瀏覽器確認 service worker `activated`、manifest 抓得到、4 個 icon。

## 課程資料補充（T07、T13）

- `Lesson.audioReady`：預設 true。設為 false 表示文字完成、音檔未合成；畫面顯示「音檔待產生」且不放播放器，`buildSentences`（聽寫、跟讀）整課略過，離線音檔下載也不列入。單字卡（SRS）例外：這課的單字仍會收進來（字、讀音、意思不需要音檔就能背），`Card.audioReady` 為 false 時畫面不放播放鈕、改顯示「音檔待產生」。`tests/lessons.test.mjs` 檢查 `audioReady` 不是 false 的課程音檔都存在。
- `GrammarPoint.jlpt`（選填）：對應 OpenJLPT 文法 id 的陣列，只給 `npm run coverage` 計算文法涵蓋率用，畫面不顯示。
- `Lesson.quotes`：動畫與遊戲名句，每筆是一般句子加 `source`（作品與角色）與 `note`（口語重點解說）。音檔就緒後自動進入聽寫與跟讀。
- 補產音檔流程（在有 VOICEVOX 與 ffmpeg 的機器上）：`node scripts/build-audio-jobs.mjs --missing` 只列出還沒有音檔的項目，再 `node scripts/synthesize.mjs --batch scripts/audio-jobs.json`，最後把課程的 `audioReady: false` 移除。
- 2026-09-30（T23）：第 2 天（52 個）與 T07、T13（77 個）共 129 個待合成音檔已產生，三課的 `audioReady: false` 都移除，全站 152 個音檔、3.5MB；旗標機制保留給之後新增的課。這台 Windows 機器的引擎在 `Documents\VOICEVOX\VOICEVOX\vv-engine\run.exe`（`--host 127.0.0.1 --port 50021`），ffmpeg 由 winget 安裝。
- 涵蓋率檢查：`lib/coverage.mjs` 是純邏輯（單字比對、漢字分級、文法 id 統計、課數推算，有測試）；`scripts/coverage-openjlpt.mjs` 負責下載 OpenJLPT 資料（釘在固定 commit，快取在不進 git 的 `.cache/`）與輸出報告。OpenJLPT 為 CC BY-SA 4.0，所以資料不進 repo；只有執行結果的數字會寫進文件。
- 讀音標記（T15）：`lib/furigana.mjs` 把句子的整句假名 `reading` 對回每段漢字，輸出 `{ text, ruby? }[]`，畫面（`app/components/Ruby.tsx`）轉成 `<ruby>`。對齊規則：漢字段之間的假名（送假名、助詞）當定位點，標點與空白若在讀音裡也出現就當漢字段之間的邊界；讀音標整段漢字（會社員 → かいしゃいん），不逐字拆；對不起來或有多種對法時回傳 null，不猜。
- `Line.ruby`、`VocabItem.ruby`（選填）：手動標註，格式 `{40秒|よんじゅうびょう}で{支度|したく}しな！`（大括號內為「原文|讀音」，記法與 OpenJLPT 的 furigana 欄位相同，只是格式）。自動對齊不了的句子（如含阿拉伯數字）才需要；去掉標記後必須等於 `jp`。`tests/lessons.test.mjs` 檢查每個含漢字的句子都標得出讀音。
- 顯示偏好（`lib/prefs.mjs`、`app/prefs.ts`）：目前只有「漢字上方標讀音」，預設開啟，存 `localStorage` 的 `nihongo-lab:prefs:v1`，與學習進度分開；壞掉或存不進去就用預設值，不打斷使用者。關閉時維持原本的「原文＋另起一行讀音」。單字卡（SRS）不受影響：正面本來就不顯示讀音，背面有讀音行。
- `LessonView`（T25）：課程選擇是「上一課／依階段分組的下拉選單／下一課」；內容分成單字、文法、對話、名句、練習五個區塊，上方有貼頂的區塊列，**一次只顯示一個區塊**（有內容的才出現，附筆數），切換課程或區塊時捲回這一課的開頭。課文每行右邊是 44px 的圓形播放鈕（`LinePlay`，取代原生 `<audio controls>`，每行少一整列高度；播放中再按停止、開始播放會先停掉別的音檔、`preload="none"`、失敗時變 ⚠）。純假名詞的讀音行與原文相同時不重複顯示。

## SRS 與聽寫設計（T06、T04）

- **進度格式**（版本 1）：`{ version, srs: { [cardId]: { ease, interval, reps, lapses, due, firstSeen } }, dictation: { [audio 路徑]: { attempts, passed, lastAt } } }`。日期一律本機時區 `YYYY-MM-DD`。單筆格式不對只丟那一筆，整份壞掉或版本未知才退回空進度（並備份原文）。未來 T10 同步若要合併，需要升版並加更新時間欄位。
- **進度讀寫**（T18）：純邏輯在 `lib/progress-store.mjs`，儲存空間由呼叫端注入（瀏覽器傳 localStorage，測試傳假的）。更新一律「先重讀儲存空間裡最新的進度、再套用變更、再存」；讀不到最新的（不可用、損毀、還沒存過）就退回這個分頁記憶體裡的。另一個分頁存檔時（`storage` 事件）採用它的進度，格式異常則忽略並警告。載入時的問題（存檔損毀、版本未知、單筆被略過）都會把原存檔備份到 `nihongo-lab:progress:v1:backup`，並用警告顯示到使用者按掉；寫入失敗的錯誤另外顯示，下次寫入成功就消失。同一張卡兩個分頁都改時後存的贏。
- **單字卡 id**：`課程 id:單字`，教材增補不會讓舊進度錯位；教材移除的卡片進度保留但不出現。
- **排程**：兩級評分（T17，2026-09-30 由四級簡化）：「還不會」（again）與「記得」（good）。難度不是系統算的，是使用者翻卡後自己按的；只分兩級，是因為每天練習的阻力比排程的細緻度更重要，而且四級曾造成間隔順序不一致的 bug（第一次答「很簡單」後，「有點難」的間隔反而比「記得」長）。
  - good：第一次隔 1 天，之後 `max(3, 間隔 × ease)`，上限 365 天（`MAX_INTERVAL_DAYS`，避免到期日超出 `YYYY-MM-DD` 格式）；ease 不變。
  - again：今天再看，間隔與 reps 歸零、lapses +1、ease −0.2（下限 1.3）。**取捨**：兩級之後 ease 只會降、不會回升，多次答錯的卡成長會比較慢（ease 在下限時每次約 ×1.3）；先接受，觀察實際使用再決定要不要加回升機制。
  - 資料格式不變（`ease`、`interval`、`reps`、`lapses`、`due`、`firstSeen`），舊版四級評分留下的進度可直接沿用；`schedule` 遇到不認得的評分（如舊的 hard／easy）直接丟錯，不默默當成 good。
  - 畫面用圖示呈現評分（✕ 還不會、✓ 記得，`GradeIcon`），底下小字是預告的下次間隔；文字說明放在 `aria-label` 與 `title`，快捷鍵 1、2。
  - 沒有每日新卡上限（T22，2026-09-30，使用者要求）：佇列 = 到期的舊卡（越舊越前）+ 所有沒看過的新卡（教材順序）。已答「記得」的卡到期日在未來，重新整理不會再出現；答「還不會」的卡今天到期，仍在佇列。同一輪答「還不會」的卡排回佇列尾端。
- **聽寫比對**：忽略空白與標點，片假名視同平假名，全形半形統一；可接受整句漢字原文或整句假名讀音（取較接近的一個），用最長共同子序列標出漏聽與多打的字。混合寫法目前判為有差異。`passed` 一旦為 true 不被之後答錯覆蓋。

## 設定頁與清除快取（T24）

- 主選單第 5 個分頁「設定」（`#/settings`，`SettingsView`）：漢字讀音開關（原本在每一頁最上面）、離線音檔下載（只保留「全部課程」，不再有「本課」按鈕）、清除快取。
- `lib/clear-cache.mjs`（純邏輯，`caches`／`serviceWorker` 由呼叫端注入，有測試）：刪光 Cache Storage 與 service worker 註冊；單一項目失敗不中斷其他項目，失敗原因回傳；環境不支援視為沒東西可清。**這支函式沒有拿到 localStorage，所以學習進度與顯示偏好不可能被它清掉**——這是「清快取不掉進度」的結構保證，也是不叫使用者去手機設定清的原因（那邊的「清除資料」會連 localStorage 一起清）。
- `ClearCache` 元件：離線時按鈕停用（清完要重新載入，離線會打不開 App）；按下後先二次確認；清除完成才 `location.reload()`，有失敗就顯示原因、不重新載入；重新載入後在同一個工作階段顯示一次「已清除快取，學習進度都還在：單字卡 N 張、聽寫 M 句」，讓使用者當場確認。

## 行動版導覽（T25）

- 手機寬度（≤640px）主選單固定在畫面底部（考慮 `safe-area-inset-bottom`，`index.html` 的 viewport 加 `viewport-fit=cover`），不用滑回頁首；桌面維持頁首。換分頁時捲回頁首。
- 手機上隱藏階段卡與副標題，課程頁一進來就是課程選擇與內容。階段資訊仍在下拉選單的分組標題裡。
- 課程頁的區塊列、上一課／下一課與課文播放鈕見上面 `LessonView` 一節。

## 待設計（下一輪任務）

- 跨裝置同步 Worker：端點設計、資料存放（KV vs 私有 GitHub repo JSON store）、裝置 ID 產生與衝突處理（兩裝置離線時都寫入，重新連線後怎麼合併，需要明確規則，不能悄悄覆蓋）。
- 手機上實際「加入主畫面」安裝，全螢幕開啟的真實驗收（目前只驗證到 service worker／manifest 技術條件，未做真機安裝）。

教材資料結構已在第 1 天教材定案，見 `curriculum/lessons.mjs`、`curriculum/voices.mjs`。UI 視覺沿用既有學習網站的設計系統（Noto Sans TC + IBM Plex Mono、卡片式排版、CSS 變數色票、`prefers-color-scheme` 自動深色模式），維持 使用者 的網站家族一致風格。
