# 系統設計

## 架構

Vite / React + TypeScript，本機瀏覽器執行，local-first。目前無後端；未來若需要（例如 SRS 進度跨裝置同步）才考慮 Cloudflare Workers / KV / D1，見 [project-plan.md](project-plan.md)。

- `app/main.tsx`：React 掛載點。
- `app/App.tsx`：頁首、三個分頁（課程／單字卡／聽寫，用 `#/`、`#/srs`、`#/dictation` hash 切換，不加路由套件）與進度存取提示。分頁內容在 `app/views/`（`LessonView`、`SrsView`、`DictationView`），共用的音檔元件在 `app/components/AudioLine.tsx`（`PlayButton` 音檔載入或播放失敗時顯示明確錯誤）。
- `app/views/ShadowingView.tsx`：跟讀。播放一次、留白（見 `lib/shadowing.mjs`）讓使用者念、再播，一直重複到按停止（沒有輪數上限，T34），也可以只「聽一次」，可隱藏原文；音檔播放失敗顯示明確錯誤；按停止造成的 `AbortError` 不當成錯誤。不含調速。
- `lib/`：無 DOM 的純邏輯，用 `.mjs` + JSDoc 型別，讓 `node --test` 直接測、TypeScript 也能匯入。`srs.mjs`（SM-2 簡化版排程、單字卡與每日佇列）、`srs-session.mjs`（一輪複習的流程：上一張／下一張、評分後跳到哪一張、回頭改評分）、`dictation.mjs`（聽寫句子清單、逐字比對）、`progress.mjs`（進度資料形狀、解析驗證、聽寫紀錄）、`shadowing.mjs`（跟讀留白長度）。
- `app/lib/storage.ts`、`app/useProgress.ts`：`localStorage` 讀寫（key `nihongo-lab:progress:v1`）與 React 狀態；存檔壞掉時原文備份到 `…:backup` 並提示，寫入失敗時畫面顯示訊息但仍可繼續學習。
- `curriculum/lessons.mjs`：學習階段與課程資料的單一來源，目前第 0 階段有 25 課、第 2 階段有 10 課（八課動畫特訓、口語轉換表、動畫與遊戲名句），第 1、3 階段仍是空的（`lessons: []`）。
- `curriculum/voices.mjs`：教材語音角色陣容，對應本機 VOICEVOX 引擎（127.0.0.1:50021）的 speaker id。2026-10-03 最終選角後保留 8 個角色：春日部つむぎ、雨晴はう、小夜/SAYO、猫使ビィ、東北ずん子、青山龍星、黒沢冴白、VOICEVOX Nemo 男声2。
- `scripts/synthesize.mjs`：呼叫 VOICEVOX 引擎產生 wav、再用 ffmpeg 轉 96kbps mp3 的教材語音產生腳本；只在本機產生教材時用，不是網站執行期依賴。已用 ずんだもん 實測一句，輸出 50KB mp3，音質正常。
- `tests/curriculum.test.mjs`：驗證 curriculum 資料結構契約。

## 語音產製流程

VOICEVOX（本機工具，不進 repo）產生 wav → `scripts/synthesize.mjs` 呼叫其 HTTP API 並用 ffmpeg 轉 mp3 → mp3 進 repo 當靜態資產。其他裝置只要 `git pull` 就有音檔，不需要裝 VOICEVOX。詳細估算見 [project-plan.md](project-plan.md)。

## PWA

用 `vite-plugin-pwa`（generateSW 模式，workbox 產生 service worker），不手刻，避免自己維護 hashed 檔名 precache 清單。

- `public/icon-source-jinwoo.png`：目前來源圖示（成振宇雙眼藍紫光、深色背景的自行生成插畫）。`pwa-assets.config.ts` 從它產生 `public/jinwoo-*` 的 64／192／512／maskable-512／apple-touch-icon／favicon.ico，圖片鋪滿方形、沒有預先畫圓角，臉與眼睛位於 maskable 安全區內。Manifest 與 HTML 使用新的檔名以更新圖示快取；舊圖示保留供舊 manifest／HTML 相容。原始 1024px 圖片不納入 service worker 預快取。重產指令：`npx pwa-assets-generator`。
- `vite.config.ts` 的 `VitePWA()`：manifest（name、icons、standalone、theme/background color）+ `runtimeCaching` 把 `/audio/*.mp3` 設成 CacheFirst（快取名稱與路由正規表示式來自 `lib/offline.mjs`，`rangeRequests: true`，`maxEntries` 3000）。`devOptions.enabled: true` 讓 `npm run dev` 也能測 service worker。
- 離線音檔（T16）：**單靠播放不會存檔**——`<audio>` 一律送 Range 請求、伺服器（含 GitHub Pages）回 206，而 Cache API 存不了 206、workbox 也只存 200，所以 CacheFirst 永遠是空的。做法：課程頁的「離線音檔」區塊用不帶 Range 的 `fetch` 抓整檔，由頁面端（`app/lib/offlineAudio.ts`）驗證後寫進同一個快取；之後播放器的 Range 請求由 `rangeRequests` 外掛從快取的整檔切成 206 回應。設計重點：
  - 下載網址加 `?offline-download=1`（`downloadUrl`），不符合音檔路由的正規表示式，繞過 service worker 的 CacheFirst；否則它會在回應之後非同步地把任何 200（例如 captive portal 的 HTML）存進音檔快取，和頁面端的驗證搶時間。測試釘住「下載網址不符合路由」。
  - 只收 200 且 `content-type` 是 `audio/*`；驗證失敗會清掉該網址既有的髒資料，`has` 也驗內容類型。
  - 已存在的略過，失敗的逐一回報、不自動重試，再按一次只補抓失敗的。
  - 在 `vite.config.ts` 以 `options.rangeRequests` 開啟外掛（由 workbox-build 寫進 service worker），不在設定檔裡 import `workbox-range-requests`，避免先前在 Node 環境（`npm run dev`）匯入該套件就報錯的問題。
- 字型（T20 → T31）：T20 曾替 Google Fonts 加離線快取；T31 起**不再載入任何網頁字型**，快取路由一併移除（已安裝的裝置上遺留的 `google-fonts-styles`／`google-fonts-files` 快取不會自動清掉，按設定頁的「清除快取」就會清）。理由見「介面設計」的「視覺」。
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
- 沒有讀音資料的日文文字的讀音（T35）：課程標題、文法句型與說明、練習題與答案、名句出處與解說、翻譯裡夾的日文沒有 `reading` 欄位，不能自動對齊。標記放在 `curriculum/ruby-notes.mjs`（866 筆，`{漢字|よみ}`，與例句 `ruby` 欄位同一種寫法；去掉標記要與教材原字串完全一致），`lib/ruby-notes.mjs` 以原字串查表（`buildNotesIndex`、`annotateText`），畫面用 `RubyText` 元件（`app/components/Ruby.tsx`）：偏好開啟且查得到才標，關閉或查不到原樣顯示。**只標日文，不標中文**：中日混寫的說明文字裡，中文詞（名詞、動詞、問、回答…）不標；讀音只放漢字串本身，okurigana 留在外面（與例句一致，例如 `{食|た}べます`）；文字裡已緊接著寫了讀音的（「一分いっぷん」「何」＋「唸なん」）與問讀音的練習題（「三百円」怎麼唸）不標，免得洩漏答案。**檢查**（`tests/ruby-notes.test.mjs`）：標記語法完整、讀音是假名、每一筆都對得到教材實際會顯示的字串（教材改字會抓到）、**教材裡每一個含日文漢字的字串都有一筆標記項目**（用「含假名的日文區段裡、全部由日文用過的漢字組成的漢字串」判斷有沒有需要人看的字串，所以新增教材後會被列出來；沒有要標的也要加一筆與原字串相同的項目）。單字卡正面不標讀音（使用者決定：正面是考「看到漢字想得出讀音」）。
- 顯示偏好（`lib/prefs.mjs`、`app/prefs.ts`）：「漢字上方標讀音」（預設開啟）與聽寫的作答方式 `dictationMode`（`choice` 選擇題，預設；`type` 輸入；T33），存 `localStorage` 的 `nihongo-lab:prefs:v1`，與學習進度分開；壞掉或存不進去就用預設值，不打斷使用者。關閉時維持原本的「原文＋另起一行讀音」。單字卡（SRS）不受影響：正面本來就不顯示讀音，背面有讀音行。
- `LessonView`（T27 改版）：只負責「單一課程」，由 App 依網址 `#/lesson/<id>` 傳入；課程清單與切換課程在 `LessonListView`（見「介面設計」）。內容分成單字、文法、對話、名句、練習五個區塊，上方有貼頂的區塊列，**一次只顯示一個區塊**（有內容的才出現，附筆數），切換區塊時捲回頂端。課文每行右邊是 44px 的圓形播放鈕（`LinePlay`，每行少一整列高度；播放中再按停止、開始播放會先停掉別的音檔、`preload="none"`、失敗時變 ⚠）。純假名詞的讀音行與原文相同時不重複顯示。

## SRS 與聽寫設計（T06、T04）

- **進度格式**（版本 2，T28）：`{ version: 2, srs: { [cardId]: { ease, interval, reps, lapses, due, firstSeen, updatedAt } }, dictation: { [audio 路徑]: { attempts, passed, lastAt } } }`。`due`、`firstSeen` 是本機時區 `YYYY-MM-DD`；`updatedAt` 是最後一次評分的 ISO 時間（`Date#toISOString` 格式，`isTimestamp` 驗證，同格式字串的字典序就是時間先後）。單筆格式不對只丟那一筆，整份壞掉或版本未知才退回空進度（並備份原文）。`localStorage` 的 key 仍是 `nihongo-lab:progress:v1`（key 不改，版本在資料裡）。
- **版本 1 → 2 的自動轉換**：讀到版本 1 的存檔時，每張卡補 `updatedAt`，用排程狀態倒推最後評分的日期（評分當天 `due = 當天 + interval`，答「還不會」時 interval 為 0，所以 `due − interval` 就是那一天），只精確到日。轉換不寫回，等下一次更新才存成版本 2。**限制**：版本 2 的存檔舊版程式讀不了（會當成「來自較新的版本」並警告），所以升級後還開著舊頁面的分頁要先重新載入（T21 的更新提示就是為這個）。
- **合併**（`lib/progress-merge.mjs`，T28）：兩份進度合成一份，匯入檔案與之後的跨裝置同步都用它。單字卡逐張比 `updatedAt`，較晚的整張取代；時間完全相同時比 JSON 字串決定，所以結果與傳入順序無關。聽寫逐句取聯集：`passed` 取 OR（通過過就算通過）、`attempts` 取較大者（兩邊次數都含同步前的歷史，相加會重複算）、`lastAt` 取較晚者。測試包含固定種子的 200 組隨機資料，驗證交換律、結合律、冪等（各裝置以任意順序重複合併都收斂到同一份）。**限制**：兩台裝置在互相同步前答了同一張卡，只留較晚的那一次；裝置時鐘差太多時「較晚」也會不準；沒有刪除的同步（教材移除的卡本來就保留）。
- **匯出／匯入**（`lib/progress-transfer.mjs`、`app/components/ProgressTransfer.tsx`，設定頁「學習進度備份」）：匯出成 `nihongo-progress-YYYY-MM-DD.json`（外層 `format: 'nihongo-lab-progress'`、`exportedAt`、`progress`）。匯入先驗證（不是 JSON、不是本 App 的檔、版本太新、內容損毀都不動現有進度並說明原因；超過 5MB 直接拒絕），通過後用 `mergeProgress` 併進現有進度，不是覆蓋，所以匯入舊備份不會洗掉新進度；單筆格式不對只略過並報告筆數。匯入後顯示實際新增或更新的筆數。
- **進度讀寫**（T18）：純邏輯在 `lib/progress-store.mjs`，儲存空間由呼叫端注入（瀏覽器傳 localStorage，測試傳假的）。更新一律「先重讀儲存空間裡最新的進度、再套用變更、再存」；讀不到最新的（不可用、損毀、還沒存過）就退回這個分頁記憶體裡的。另一個分頁存檔時（`storage` 事件）採用它的進度，格式異常則忽略並警告。載入時的問題（存檔損毀、版本未知、單筆被略過）都會把原存檔備份到 `nihongo-lab:progress:v1:backup`，並用警告顯示到使用者按掉；寫入失敗的錯誤另外顯示，下次寫入成功就消失。同一張卡兩個分頁都改時後存的贏。
- **單字卡 id**：`課程 id:單字`，教材增補不會讓舊進度錯位；教材移除的卡片進度保留但不出現。
- **排程**：兩級評分（T17，2026-09-30 由四級簡化）：「還不會」（again）與「記得」（good）。難度不是系統算的，是使用者翻卡後自己按的；只分兩級，是因為每天練習的阻力比排程的細緻度更重要，而且四級曾造成間隔順序不一致的 bug（第一次答「很簡單」後，「有點難」的間隔反而比「記得」長）。
  - good：第一次隔 1 天，之後 `max(3, 間隔 × ease)`，上限 365 天（`MAX_INTERVAL_DAYS`，避免到期日超出 `YYYY-MM-DD` 格式）；ease 不變。
  - again：今天再看，間隔與 reps 歸零、lapses +1、ease −0.2（下限 1.3）。**取捨**：兩級之後 ease 只會降、不會回升，多次答錯的卡成長會比較慢（ease 在下限時每次約 ×1.3）；先接受，觀察實際使用再決定要不要加回升機制。
  - 資料格式不變（`ease`、`interval`、`reps`、`lapses`、`due`、`firstSeen`），舊版四級評分留下的進度可直接沿用；`schedule` 遇到不認得的評分（如舊的 hard／easy）直接丟錯，不默默當成 good。
  - 畫面用圖示加文字呈現評分（✕ 還不會、✓ 記得，`Icons.tsx`；T27 起是底部固定的兩顆大按鈕），底下小字是預告的下次間隔；文字說明放在 `aria-label` 與 `title`，快捷鍵 1、2。
  - 沒有每日新卡上限（T22，2026-09-30，使用者要求）：佇列 = 到期的舊卡（越舊越前）+ 所有沒看過的新卡（教材順序）。已答「記得」的卡到期日在未來，重新整理不會再出現；答「還不會」的卡今天到期，仍在佇列。同一輪答「還不會」的卡排回佇列尾端。
- **聽寫比對**：忽略空白與標點，片假名視同平假名，全形半形統一；可接受整句漢字原文或整句假名讀音（取較接近的一個），用最長共同子序列標出漏聽與多打的字。混合寫法目前判為有差異。`passed` 一旦為 true 不被之後答錯覆蓋。

## 設定頁與清除快取（T24）

- 主選單第 5 個分頁「設定」（`#/settings`，`SettingsView`）：漢字讀音開關（原本在每一頁最上面）、離線音檔下載（只保留「全部課程」，不再有「本課」按鈕）、清除快取。
- `lib/clear-cache.mjs`（純邏輯，`caches`／`serviceWorker` 由呼叫端注入，有測試）：刪光 Cache Storage 與 service worker 註冊；單一項目失敗不中斷其他項目，失敗原因回傳；環境不支援視為沒東西可清。**這支函式沒有拿到 localStorage，所以學習進度與顯示偏好不可能被它清掉**——這是「清快取不掉進度」的結構保證，也是不叫使用者去手機設定清的原因（那邊的「清除資料」會連 localStorage 一起清）。
- `ClearCache` 元件：離線時按鈕停用（清完要重新載入，離線會打不開 App）；按下後先二次確認；清除完成才 `location.reload()`，有失敗就顯示原因、不重新載入；重新載入後在同一個工作階段顯示一次「已清除快取，學習進度都還在：單字卡 N 張、聽寫 M 句」，讓使用者當場確認。

## 介面設計（T25、T27）

2026-09-30 依「參考各大手機 App」的要求重做，做法參考常見語言學習與卡片 App 的共通模式（首頁課程清單加進度、底部固定操作區、答題後底部回饋面板、翻牌與左右滑評分），不是複製任何一個 App。

- **外殼**（`app/App.tsx`）：頂端是上方列（首頁顯示 App 名稱，其他頁顯示頁名；單一課程顯示課名與返回鍵），底部是五個帶圖示的主選單（課程、單字卡、聽寫、跟讀、設定），選到的分頁圖示外有圓角底色；≥641px 時主選單移到頁首、變成橫排按鈕。換頁時內容淡入並捲回頂端；`prefers-reduced-motion` 關掉動畫。
- **路由**（`lib/route.mjs`，有測試）：`#/` 課程清單、`#/lesson/<id>` 單一課程、`#/srs`、`#/dictation`、`#/shadowing`、`#/settings`；認不得的 hash 與不存在的課程 id 一律回課程清單。課程用網址記錄，手機返回鍵會從單一課程回清單；直接開單一課程網址（沒在 App 裡換過頁）時，返回鍵改用 `location.replace`，不會離開 App。
- **課程清單（首頁）**（`LessonListView`）：最上面是「今天的單字卡 N 張」大卡片與「開始複習」按鈕（沒有要複習時改成「去練聽寫」）；下面依階段列出課程卡片，每張顯示單字與聽寫進度條。進度由 `lib/lesson-progress.mjs`（有測試）從現有的單字卡與聽寫紀錄算出，不另存資料；沒有課的階段顯示「即將推出」。
- **單字卡**（`SrsView`）：上方進度條（本輪已答對／總數，答「還不會」不會讓進度倒退）；大卡片；操作區固定在畫面底部（主選單上方，拇指最好按）：翻開前是「顯示答案」大按鈕，翻開後是「還不會／記得」兩顆大按鈕（附預告間隔）。2026-10-02（T40）改為翻開前後都能**左右滑換卡**（左滑下一張、右滑上一張）；滑動不評分，評分只透過按鈕或快捷鍵，評分時 Android 會震動一下（`navigator.vibrate`，不支援就略過）。快捷鍵 1、2、空白鍵保留，左右方向鍵是上一張／下一張。**上一張／下一張**（T32，進度條下方的「‹ 第 N / M 張 ›」）：牌組在進入畫面時排好、整輪固定，同一張卡只出現一次；箭頭在牌組裡自由移動（停在兩端，不繞圈），不評分直接往後就是跳過（不寫入進度）。評「記得」＝這張卡這一輪完成，評「還不會」＝這一輪還要再看；評分後自動跳到後面還沒完成的下一張，後面沒有了就繞回前面還沒完成的，全部完成才結束（順序等同舊版「還不會的卡排到佇列尾端」）。往回翻到這一輪評過的卡會直接顯示答案與「這一輪已評：…」，可以改評分；改評分時排程從「這一輪第一次評分之前」的狀態重算（`recordReviewFrom`，第一次評分時記下當時的狀態），所以同一張卡這一輪評兩次，間隔不會被推進兩次。結束畫面有「回到最後一張」。純邏輯與測試在 `lib/srs-session.mjs`。
- **聽寫**（`DictationView`，T33 起有兩種作答方式，上方的分段控制切換，選擇存在偏好）：大圓形播放鈕、上一句／跳過在兩側；「檢查」是固定在底部的大按鈕；答完從底部升起回饋面板（綠色答對、紅色有差異，含你打的、標準答案的差異標色、讀音、中文與「再試一次／下一句」）。
- **跟讀**（`ShadowingView`，T34 起沒有輪數設定，按「開始跟讀」會一直重複並顯示第 N 遍，按停止結束）：顯示原文是開關膠囊；狀態膠囊在輪到你念時變成琥珀色；開始／停止是固定在底部的大按鈕。
- **設定**：分組卡片，讀音開關改成 iOS 風格的開關。
- **觸控細節**：可點的目標至少 44px；底部區塊考慮 `safe-area-inset-bottom`（`index.html` 的 viewport 加 `viewport-fit=cover`）；按鈕按下有縮放回饋；`overscroll-behavior-y: contain` 避免安裝成 App 後下拉整頁重新整理；`touch-action: manipulation` 去掉點擊延遲。
- **視覺**：主色深青綠（`--brand`），白色圓角卡片加淡陰影，**字型用裝置自己的系統字型**（T31）：中文 `--sans`（`system-ui`、`-apple-system`、`Segoe UI`、`Microsoft JhengHei`），日文內容（元素標 `lang="ja"`）用 `--sans-ja`（`system-ui`、`-apple-system`、`Yu Gothic UI`、`Meiryo`），再靠 `lang` 讓瀏覽器挑對語言的版本。原本的 Noto Sans TC 網頁字型被 Google Fonts 切成上百個片段（每個粗細各一組）按需下載，沒載好或離線時有些字會暫時換成系統字型，同一行字的粗細就不一致（使用者回報「同一行字有的粗有的細」）；教材用到的 1,539 個非 ASCII 字元都在 Noto Sans TC 涵蓋範圍內，所以不是缺字。系統字型整行出自同一套字型、不用下載、離線不受影響，日文漢字也會是日本的字形。代價是各平台外觀不同（Android 是 Noto Sans CJK、macOS／iOS 是 PingFang 與 Hiragino、Windows 是 Microsoft JhengHei 與 Yu Gothic）。教材文字裡中日混寫的說明文字仍以繁中字型顯示；`theme_color` 與背景色改成頁面底色，PWA 圖示改成青綠底加白色「か」。
- **移除的舊介面**：階段卡片、課程下拉選單與上一課／下一課按鈕、原生 `<audio controls>`、輪數下拉選單、單字卡圖示評分按鈕（`GradeIcon`）。

## 課程編寫（第 3 天起）

- 每天一個檔案 `curriculum/days/dayNN.mjs`，用 `curriculum/author.mjs` 的 `defineLesson` 以緊湊陣列編寫：單字 `[word, reading, zh]`、文法點 `{ pattern, note, jlpt?, examples: [[jp, reading, zh]] }`、對話 `{ voices: [A, B], lines }`、練習 `[q, a]`；再由 `curriculum/lessons.mjs` 匯入並放進第 0 階段的 `lessons`，對外仍只有 lessons.mjs 一個入口。
- 語音角色自動指定：單字依序輪替 9 個角色，同一個文法點的例句用同一個角色，對話兩個角色交替。
- 音檔路徑由「種類＋原文＋角色」的雜湊決定（`audioPath`，64 位元 FNV-1a 取 10 個十六進位字元，純 JavaScript，因為這支檔案也會被打包進瀏覽器）：改文字或換角色會產生新檔名，`build-audio-jobs.mjs --missing` 補產新檔，不會出現文字與音檔不一致；舊檔由 `tests/audio-orphans.test.mjs` 抓出來手動刪除。
- 例句的 `reading` 是全假名讀音；含漢字的句子由 `lib/furigana.mjs` 自動對齊讀音，對不起來（有多種解法）時用第四個元素 `{ ruby: '{私|わたし}は…' }` 手動標，`tests/lessons.test.mjs` 保證每個含漢字的句子都標得出讀音。文字裡用漢字數字，不用阿拉伯數字（阿拉伯數字對不了讀音）。
- 每課流程：新分支 `feature/T02-dayN` → 寫課程檔並註冊 → `npm test`（讀音對不起來會指出哪一句）→ 補產音檔 → `npm run check`、`npm run build`、`npm run coverage` → commit、push、PR → CI 通過後 `gh pr merge --rebase --delete-branch`。
- 2026-09-30 一次完成第 3～25 天（PR #15～#37）；全站 1,463 個音檔、31MB，離線下載「全部課程音檔」會下載這麼多。

## 跨裝置同步 Worker（T29）

方向（2026-10-01 定案）：Google 登入只放行本人 + Cloudflare Worker + KV。程式在 `worker/`，純邏輯在 `handler.mjs`、`google-token.mjs`、`session.mjs`（KV、時間、Google 簽章金鑰都由呼叫端注入，用 `node --test` 驗證），`index.mjs` 只負責接線與 Google 金鑰快取。

- **端點**：`POST /auth { idToken }`（Google 憑證通過驗證且 email 在白名單，換發同步用 session）、`POST /sync { progress }`（與雲端合併後存回，把合併結果整份還給裝置；`Authorization: Bearer <session>`）、`GET /health`。一次 `/sync` 同時是上傳與下載；沒有新內容時不寫 KV。
- **Google 憑證驗證**（`google-token.mjs`）：RS256 簽名（金鑰來自 Google 的 JWKS，找不到 `kid` 時重抓一次，5 分鐘內最多強制重抓一次）、`iss`、`aud` 必須是本 App 的 Client ID、`exp`、`iat` 不在未來、`email_verified` 必須是布林 `true`，最後 email 比對白名單（不分大小寫）。不在白名單回 403，其他一律 401，兩者的訊息不洩漏白名單內容。
- **Session**（`session.mjs`）：Google 憑證一小時就過期，所以驗證過一次後由 Worker 自己發 HMAC-SHA256 簽名的憑證，有效 30 天，剩不到 15 天時在 `/sync` 的回應裡換發新的（常用的裝置不用重新登入）。簽名金鑰是 Worker secret。
- **資料**：每個 Google 帳號（`sub`）一筆 KV：`progress:<sub>`，內容是版本 2 的進度 JSON。送上來的進度先用 `parseProgress` 驗證（版本 1 也收，自動轉換），格式不對 400，超過 2MB 413。**雲端的存檔讀不懂時不覆蓋，回 500**，寧可這次同步失敗也不蓋壞唯一的雲端副本。
- **一致性**：KV 是最終一致，兩台裝置幾乎同時同步時，後寫的可能基於舊的讀取結果。因為每次同步都是整份上傳、整份取回，且合併滿足交換律／結合律／冪等（T28），下一次同步就會補回，不會永久遺失。
- **CORS**：只放行 `ALLOWED_ORIGINS` 裡的網頁來源（正式站與本機開發網址）；帶 `Origin` 但不在名單內直接 403。沒有 `Origin`（curl）不帶 CORS 標頭，沒有 session 一樣進不來。
- **設定與 secret**：`worker/wrangler.toml` 只放公開值（Google Client ID、允許的網頁來源、KV 綁定）。白名單 email（`ALLOWED_EMAIL`）與 session 簽名金鑰（`SESSION_SECRET`）是 secret，用 `wrangler secret put` 設定，**不進公開 repo**。部署：`wrangler deploy -c worker/wrangler.toml`（用全域安裝的 wrangler，不加成專案相依套件）。目前部署在 `https://nihongo-sync.curio-lab.workers.dev`（2026-10-01）。
- **Google Cloud 端**：專案 `nihongo-sync`（已停用計費，不依賴免費試用帳戶）、OAuth 同意畫面為「外部、測試中」，只有加進「測試使用者」的帳號能登入；網頁用戶端的授權 JavaScript 來源是正式站與兩個本機開發網址。不使用重新導向 URI（用 Google 登入按鈕取得身分憑證）。

## 跨裝置同步的前端（T30）

純邏輯在 `lib/sync.mjs`（請求、登入狀態儲存、狀態文字）與 `lib/sync-controller.mjs`（流程控制），網路、儲存空間、計時器、進度的讀取與套用都由呼叫端注入，用 `node --test` 驗證；畫面端是 `app/useSync.ts`（接事件）、`app/lib/googleSignIn.ts`（載入 Google 登入）、`app/components/SyncPanel.tsx`（設定頁面板），App 最上方另有「登入已過期」的提示。

- **登入**：Google 的腳本（Google Identity Services）只在使用者按「用 Google 登入」才載入，載入後畫出 Google 官方的按鈕，再按一次完成登入（彈出視窗）；拿到身分憑證後送 `POST /auth` 換 session。沒登入時完全不連 Google 或同步伺服器（開發版實測網路請求確認）。
- **登入狀態**存在 `localStorage` 的 `nihongo-lab:sync:v1`（`{ token, email, lastSyncAt }`），與學習進度分開，匯出進度時不會帶出去。注意 GitHub Pages 的 `帳號.github.io` 是同一個來源，同帳號底下其他網站的頁面讀得到這個來源的 `localStorage`；這個 session 只能存取學習進度，風險有限，但要知道。
- **一次同步**：把整份本機進度送 `POST /sync`，拿回與雲端合併後的整份，再用 `mergeProgress` 併進本機（不是覆蓋，所以同步途中答的題不會被蓋掉）。回應的進度會再驗證一次格式，有任何問題就不套用。
- **同步時機**：已登入時開啟 App；回到前景（距離上次嘗試 2 分鐘以上）；離開前景或 `pagehide` 時有未上傳的變更就立刻送；網路恢復；進度變動後延遲 8 秒（連續答題只送一次）；設定頁的「立即同步」。
- **不會無限同步**：「有沒有未上傳的變更」用內容指紋判斷（`fingerprintProgress`：鍵排序後的內容，與物件鍵的順序無關）——比對「現在的進度」與「上次雲端回傳的進度」。併回雲端內容後兩者相同，就不會再排下一次。測試與實測都用「雲端回傳時鍵順序故意倒過來」確認過。
- **同時只跑一個**：同步中又被要求同步，在這一輪結束後補一輪；同步途中又有新變更，結束後排延遲上傳，不遞迴、不平行送。請求有 20 秒逾時（逾時視為連不上）。
- **失敗**：連不上、逾時、5xx 都保持登入並顯示說明，本機照常運作，下次觸發再試（不自動重試迴圈）；`401`（session 過期）清掉登入狀態、停止排程並提示重新登入，**本機進度不動**；雲端存檔異常（`stored_corrupt`）顯示說明、不套用；`403` 說明帳號沒有權限或網址不在允許名單。
- **登出**只停止同步並清掉登入狀態：這個裝置的進度與雲端的備份都保留。
- **多個分頁**：另一個分頁登入或登出（`storage` 事件）時這一頁跟著變；兩個分頁同時同步是安全的（合併滿足交換律／結合律／冪等）。
- 端點的設定值（`SYNC_URL`、`GOOGLE_CLIENT_ID`）寫在 `lib/sync.mjs`，都是公開值。

## 聽寫的選擇題模式（T33）

- **題目**：聽一句，從 4 個選項選出聽到的那一句。選項顯示日文句子（偏好開啟時讀音標在漢字上方）。純邏輯在 `lib/dictation-choice.mjs`（`pickChoices`），測試固定亂數種子。
- **干擾項**：從教材其他句子挑「聽起來像」的才有練習價值——讀音（假名）的字元二連詞重疊度（Jaccard）高、同一課（加 0.2）、長度接近的排前面，再從最像的前 8 句隨機抽 3 句，所以同一句每次出的題不完全一樣；選項順序打亂。
- **不會出現兩個都對的選項**：干擾項與目標、干擾項彼此之間用 `soundKey`（忽略標點與空白、片假名視同平假名）比對，聽起來一樣的一律不收（候選不夠時回傳較少的選項，不硬湊重複的）。測試對全部 752 句各出一次題，都湊得出 4 個聽起來不同的選項。
- **作答**：點選項或按數字鍵 1～4；選完立刻顯示對錯（答對綠色、答錯紅色並標出正確答案，其他變淡）與中文，按「下一句」或 Enter／右方向鍵繼續。選項在換題時抽好、存在元件狀態裡，作答前後不會變。回饋面板跟在選項下面（不是固定在底部，避免蓋住選項），作答後自動捲進畫面。
- **紀錄**：與輸入模式用同一份 `recordDictation`：次數 +1，答對則 `passed` 為 true（之後答錯不會洗掉），所以進度條與課程清單的聽寫進度兩種模式共用。**限制**：4 選 1 有 25% 猜中的機會，選擇題答對也算「通過」，通過標準比輸入寬鬆。

## 納管到 Harbor（T36）

- **做法**：Harbor（個人專案主控台）對 GitHub Pages 這類靜態站用前端腳本接入。`index.html` 的 `<head>` 加一行 `<script src="https://harbor-1wk.pages.dev/embed/maintenance.js" data-project="nihongo-lab">`，**不加 `async` 或 `defer`**（要在第一次繪製前先隱藏頁面）；`tests/harbor-embed.test.mjs` 守住 slug、位置與沒有 `async`／`defer`。專案本身在 Harbor 以 `POST /api/v1/projects` 登錄（slug 建立後不可變更）。
- **行為**：載入時先隱藏頁面，最多等 800ms 讀 `runtime-config?project=nihongo-lab`；維護中顯示全螢幕維護畫面，有公告就在底部顯示可關閉的橫幅；讀不到設定、逾時、格式不符或 slug 對不上一律立即顯示頁面，不論發生什麼事最慢 1.5 秒後一定顯示。Harbor 掛掉或離線都不會讓這個 App 打不開。
- **隱私**：腳本只向 Harbor 要這個專案的設定（網址只帶 slug），不送任何學習進度、登入資訊或使用者資料；同步 Worker 與 Harbor 沒有關係。
- **不是安全邊界**：維護畫面只是蓋在頁面上，停用 JavaScript 或讀原始檔仍看得到內容（這個站台本來就是公開靜態站，沒有需要擋的內容）。
- **service worker**：腳本是跨網域子資源，不在 precache 裡、也沒有 runtime 快取；離線時載入失敗會立刻放行。

## 待設計（下一輪任務）

- 手機上實際「加入主畫面」安裝，全螢幕開啟的真實驗收（目前只驗證到 service worker／manifest 技術條件，未做真機安裝）。

教材資料結構已在第 1 天教材定案，見 `curriculum/lessons.mjs`、`curriculum/voices.mjs`。UI 的最新設計見上方「介面設計（T25、T27）」；下面是最初版本的說明（已過時）：沿用既有學習網站的設計系統（Noto Sans TC + IBM Plex Mono、卡片式排版、CSS 變數色票、`prefers-color-scheme` 自動深色模式），維持 使用者 的網站家族一致風格。
## 動畫特訓（T37，2026-10-02）

`curriculum/anime-training.mjs` 接收 T13 的台詞庫，產生八課，每課五句示範與四句對照（第六課五句對照）；`lessons.mjs` 是唯一入口。`Lesson.training` 存目標、引用台詞、查證連結與理解題。引用共享既有音檔，不重複生成教材音檔或修改 T13 的句子。新的獨立詞彙及音檔尚未加入。

`AnimeTraining.tsx` 負責盲聽與揭示：播放器名稱是「播放台詞」，原文、讀音、角色與來源只在作答後掛載；`PlayButton.onPlayed` 在音訊真正開始播放時通知，每次重播只計一次，下載／播放失敗不能解鎖作答。答案只提交一次，揭示後需重新進入課程再盲聽。

理解題用 `anime:<lessonId>:<內容雜湊>` 存進原有 `Progress.dictation`，沿用版本 2 的匯出／合併／Worker 同步，不增加後端資料格式。雜湊涵蓋台詞與題目、選項、答案及解說，改版後不冒用舊題通過紀錄。課程進度新增 `listening` 計數，理解與聽寫 id 分離。播放次數與熟悉程度只保留當次；沒有長期統計或每日自動複習排程。

離線下載的 `lessonAudioPaths` 收入 training 引用音檔，`allAudioPaths` 全域去重。跟讀循環仍從原有名句課使用；特訓提供逐句跟讀入口。自製語音與真實動畫配音的驗證邊界見 anime-listening-course.md。


## 教材讀音與手機操作（T39／T40，2026-10-02）

- 合成 jobs 保留 `reading`、`ruby`、`kind`。`scripts/pronunciation.mjs` 對齊漢字讀音、比對 query 的 mora，容許標準長音與同音假名，但不把人數／國籍、辣／辛苦等不同讀法視為同音。雲端 adapter 的 `reading_reference` 以教材讀音和 MeCab 的助詞詞性組成實際發音參考；官方 Engine 沒有這個擴充，需提供已按語義核對的 `pronunciation`（實際發音假名，助詞寫わ／え／お）。
- `synthesize.mjs` 先核對原文 query，對不上才改用指定的漢字假名讀音；第二次仍對不上就停止，不寫音檔。WAV 檢查、轉 MP3 和 atomic rename 完成後才替換目的檔。讀音吻合不等於已驗證重音或情緒；新教材仍須先核對語義。
- 同 URL 音檔更新時，`AUDIO_CACHE_NAME` 升為 `lesson-audio-v2`，頁面下載與 service worker 使用同一名稱。既有學習進度保留，但新版本需要重新下載離線音檔。
- 手機聽寫使用 `100dvh` 的主畫面；播放、提示、檢查／下一句固定在主選單上方。縮小進度、題目導覽與選項間距；揭曉後只保留所選與正確選項。長句、小螢幕、輸入錯誤的完整比對內容只在作答區內捲動，底部操作始終可用。桌面保留正常頁面排版。
- `useSwipeNavigation` 共用於聽寫與單字卡：左滑下一筆、右滑上一筆，與既有箭頭一致。聽寫沿用首尾循環，單字卡停在兩端；單字卡滑動不寫進度、不評分。只接受至少 60px、水平距離至少為垂直 1.5 倍、1 秒內的手勢；略過輸入欄位、操作區、多點觸控、取消手勢及螢幕兩側 24px 的瀏覽器手勢區。垂直捲動仍可用。


## 重音覆寫與配音試聽（T45／T46，2026-10-03）

`curriculum/audio-prosody.mjs` 以既有音檔相對路徑索引已核對的 `text`、`reading` 與 VOICEVOX AquesTalk 風 `kana`。合成工具優先以 `is_kana=true` 產生 query，重新預測音素長與音高；讀音不符就停止，不回退到新的文字解析。文字／讀音與覆寫不符也停止，避免沿用過時設定。尚未覆寫的文字若需假名讀音修正，第二次 query 的重音位置、mora 數、句界、停頓與疑問標記有改變時，需核對覆寫後才能合成。

讀音修正優先只改原句的錯誤部分，不整句改成片假名。獨立單字的重音可對照 Kanjium；不把孤立詞重音直接套在句子的助詞、活用與複合詞上。時間十分用數字 10分的原生解析確認數詞與助數詞連接。手工調整後以 kana 重新取得 query，沒有只修改 accent 整數卻沿用舊 pitch 的情況。

T46 首次試聽版本：教材 MP3 路徑保持不變，離線快取更新為 `lesson-audio-v3`；舊音檔需重新下載，學習進度保留。`public/voice-preview/` 是供本次選角與語調複查的獨立試聽頁，從設定頁進入；包含現役九聲線、三個男聲候選的相同四句，以及三組實際教材修正前後。候選未寫入 voices.mjs，試聽不修改既有聲線與配音。比較音檔不納入全部教材離線下載清單。

## 配音選角與穩定進度（T47）

`voices.mjs` 的可合成陣容為五位原有角色與兩位男聲。`lessonVoiceKeys` 是歷史九槽位，供 author 與既有句庫編排維持原始內容雜湊；它不代表可合成角色，CLI 的 getVoice 只允許現役七聲線。公開入口 lessons.mjs 在建立動畫特訓前將淘汰聲線映射至保留角色，再將 60 句明確男性角色台詞分配給玄野武宏／青山龍星。由此保留既有音檔 URL、SRS／聽寫／理解題紀錄；這次同 URL 改配音必須升版音檔快取至 lesson-audio-v4。既有 81 筆重音覆寫仍綁定相同 URL。試聽頁改列七位保留角色；三組修正前後音檔屬歷史記錄，可能使用已淘汰聲線，不是教材配音。


2026-10-03 T48：使用者依試聽檔名定案動畫名句三男聲為青山龍星、黒沢冴白、VOICEVOX Nemo 男声2。原有教材與女性角色配音維持，32 句男聲名句重製，同一角色固定聲線；教材與學習進度 URL 保留，離線音檔快取升至 lesson-audio-v5，需重新下載。三男聲已採用的名句數為 28／12／20。機械檢查與使用者選角不代表全句人工抑揚驗收，驗證見 release-audit.md。


## 歌曲閱讀器（T49～T51，2026-10-05）

資料模型、儲存、Worker 斷詞、字典資產（建置時從 `node_modules` 與 JMdict 產生、不進 Git）、runtime 快取 `song-assets-v1`、文法規則與效能門檻見 [song-reader.md](song-reader.md)。路由新增 `#/songs`（歌曲清單）與 `#/song/<id>`（單首歌曲），底部選單加「歌曲」。
