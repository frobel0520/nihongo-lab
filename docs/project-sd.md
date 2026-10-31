# 系統設計

## T168 原神台詞擴充契約（第一批已發布）

第一階段最終main為342abf4，PR #175／#176已完成部署與正式站收尾。第二階段先建124角色來源矩陣；736固定來源＋438可取得Wiki紀錄逐項分處置，來源音軌、不同措辭、既有教材與未知範圍分開，不由角色已收錄推論完整。

`curriculum/lessons.mjs`維持唯一對外入口。`genshin-action-expansion.mjs`只放本批60句教材與兩個大意干擾選項，經既有角色／題目組裝進按需payload；原角色、ID、聲線、教材與音檔不重寫。新句以技能類別＋固定voicelineId建立穩定新ID；來源URL／SHA、原音識別與VOICEVOX教材路徑分開。按法未細分時如實標示，不能假稱預設形態已涵蓋全部。

新卡各有精確配圖，圖片與音檔仍明確下載，舊版只補新增資產，不清空既有快取或進度。原precache、JS／CSS與配圖chunk預算不變，FSRS與同步3、返回40項記憶體保存及SRS定位契約不動。歷史內容黃金雜湊不改，舊快照測試只投影出本批明確新增ID及新scope，現行新資料另有獨立引用／身分回歸。

本批60句、59新音檔＋1既有音檔引用、42新SVG；已由reviewer對604cde2放行，PR #177合併、main CI／Pages及正式站驗收完成。已取得來源仍有450組確定待補及9組待核，外加來源未取得範圍；不宣稱全原作台詞完整。完整來源、工程證據與截圖只作Private交接。詳見progress及release-audit。

T167第一階段已由PR #175放行、合併部署及正式站驗收；產品基準6f244a4，完整限制與版本對照見release-audit及PR發布紀錄。下一階段先核實原神所有戰技／爆發有語意來源，不以角色已收錄當作台詞完整。

## T167 返回導航契約

T167以entry ID、parent ID與相對歷史位置追蹤留存祖先；只沿該實際鏈計算負向history.go，找不到時replace內部父頁。popstate／hashchange讀取目前history.state並去重，避免快速前後切換的過期事件。Map仍LRU 40；頁面以entry ID隔離，題目可用固定scope槽位隔離目前草稿，避免依題數無界增長。教材ready及Suspense掛載後以useLayoutEffect一次還原，不使用sleep／反覆捲動；圖片預留尺寸，一般重繪不搬閱讀。SRS返回保留session／揭示面、改評基準與同一到訪的已知音訊錯誤版面，避免錯誤提示晚到時先夾住定位；明確重試清除錯誤，不保存播放。被replace的entry立即失效，Forward項目不能沿舊ID走錯父頁。新呈現仍走原焦點協定。窄矮遊戲頁操作列採內容流，避免長離線錯誤覆蓋正文。test:navigation對實際座標、草稿／評分及真正斷網做回歸，列入Linux／Windows CI。

以下為既有設計與歷史紀錄；本節為目前返回行為。

## T165 收尾範圍與定位契約

新進入類別頁回頂；Back／Forward保留歷史閱讀位置。只有已掛載的實際SRS學習卡排除共用定位，維持原長卡／焦點協定。下載測試等待目的面板後才斷言。兩項收尾通過自查與最新必要CI後於同一PR #172合併發布；最終結果集中PR發布紀錄，以下為歷史查證快照。

## T165 U2／U3定點修正

頁面生命週期以history entry ID隔離；Map依最近到訪保留40項，兼顧一般返回深度與有限記憶體。淘汰後返回建立預設UI狀態，不帶入別項草稿；不持久化、不寫學習進度。取消操作置於工作狀態後的獨立列，不替換開始按鈕。

## T165 局部UX修正（2026-10-26，未合併／未部署）

聽寫播放在題目前、作答／回饋／下一步自然頁面流；錯誤提示跨卡片寬度。已開始由既有有效嘗試計算，完成比例不變；UI歷史不跨重載保存。 驗證摘要見PR #172。原教材／ID／下載／更新與預算契約保持。

## T164 發布收尾與審查結案

F10與原P2已由原reviewer對精確版本`cee0521`複核結案；本輪只補發布與驗收，不擴充UX。最新實際發布證據集中於[PR #171](https://github.com/frobel0520/nihongo-lab/pull/171)，保留以下歷史設計與待審階段記錄；正式產物須由最終版本重新build，不能沿用未知版本的dist。真機／實體螢幕閱讀器及原人工語音待辦未結案。

## T164 P2 呈現與焦點協調

用session導航／作答轉換判斷新呈現，包含同ID重練；單一useLayoutEffect先focus preventScroll、再一次卡片開頭定位，普通揭示不重設。鍵盤新呈現焦點在句首（tabIndex -1），Space揭示或Tab到播放／揭示。無timer／重試捲動，CSS、資料與下載安全契約不變。詳見[P2證據](srs-presentation-t164-p2.md)。

## T164 F10 長句單字卡（2026-10-25，待定點審查）

SRS頁使用min-height，不固定height或讓flashcard-area內捲；actions為static，與其他頁面原有sticky操作分離。長於16個Unicode字元的詞面使用has-long-word排列，揭示後跨滿grid寬，播放保持上列。換卡後若已捲動以scroll-margin對齊新卡，鍵盤操作才恢復焦點並捲到可見處。新增test:srs-layout正式build行為回歸並納入CI；全部原容量門檻保持。詳見[根因、取捨與驗證](srs-layout-t164.md)。

## T163 圖片下載工作與審查修正（2026-10-24）

- 單字圖片下載改為 App 層級的單一工作（`app/lib/imageDownloadJob.ts`）：站內換頁持續下載，設定頁只顯示狀態，可取消與接續；跨分頁 Web Locks 保留。不提供關閉網站後的背景下載。
- 網路中斷（`offline` 事件，或約一輪並行請求都在網路層失敗）整批暫停；中斷的項目不算失敗、下次接續。進度只計實際寫入快取的張數。音檔下載行為不變。
- 圖片清單指紋由 `virtual:vocab-image-fingerprint` 提供；曾下載完的人在清單改變時看到一行可關閉的提醒，同版本一次。
- 構圖描述（alt）移出 runtime，保存於 `docs/vocab-illustration-descriptions.json`。
- Change Request：新增 bundle 指標 `illustrationChunkGzipBytes`，以內容定位含配圖映射的 chunk，門檻＝移除描述後基準 153,125 bytes＋20%＝183,750 bytes（沿用 T120 慣例）；任何 JS 產物含構圖描述即失敗。既有門檻不變。
- 單字卡鍵盤操作後若焦點掉到 `<body>`，移到評分區或「顯示答案」；指標裝置不搬焦點。

詳見 [T163 修正紀錄](vocab-images-review-fixes-t163.md)。

## T162 全站配圖完成（2026-10-24）

5909張卡全部有逐ID核實的配圖（2242張原創CC0 SVG）。映射仍只比對凍結的ID／word／reading／zh四欄；新卡加入教材時需逐張核對後才配圖，沒有自動依字面擴散。圖片依T161契約揭示時載入或在設定頁下載，不在precache。詳見[vocab-illustration-t162.md](vocab-illustration-t162.md)。

## T161 單字圖片離線契約變更（2026-10-24）

使用者授權：單字SVG不再列入APP precache。揭示時線上載入並存入上限400張的瀏覽快取（`vocab-images-browse-v1`）；設定頁「離線單字圖片」可主動下載全部到保留快取（`vocab-images-v1`，不按筆數或時間淘汰）。網址帶內容版本`?v=`（build時由SVG位元組算出），修訂後換網址；新版本存好才刪舊版本。舊precache圖片在新worker安裝時依內容版本搬進保留快取，activate後才清除。沒下載的圖離線時只顯示文字。音檔下載、進度、同步版本3與使用者確認更新流程不變。詳見[offline-images-t161.md](offline-images-t161.md)。

## T158 配圖擴充契約（2026-10-23）

300新義項／SVG、672核實共用，累計1014資產／3184有圖／2725缺圖，5909卡保持。精確ID／詞面／讀音／翻譯映射，答案後56×42空alt、文字中心線與缺圖退化保持；無主程式、排程、同步3、教材、音檔、下載語意或runtime dependency變動。舊2212映射與714SVG保持。precache22,662,226／26,869,829、餘4,207,603；JS／CSS原門檻保持。詳見[設計／共用與驗證](vocab-illustration-t158.md)。本輪不需架構或容量門檻變更，不恢復時間Gate。


## 歷史：T157 配圖擴充契約（2026-10-23）

本輪300新義項／SVG與727筆核實共用（94舊圖、633新圖），全站714資產／2212有圖／3697缺圖，5909卡不變。教材、ID、同步3、排程、音檔、下載、版面及runtime dependencies保持；圖片為答案後56×42空alt輔助，精確四欄核對，不依字面自動擴散。原1185映射／414 SVG不改。precache22,231,208／26,869,829，JS／CSS原門檻保持，不改收錄範圍。[300義項、共用與驗證](vocab-illustration-t157.md)含暫緩原因與原92候選重評；本輪無架構／離線契約變更。


## 歷史：T156 配圖擴充契約（2026-10-23）

本輪新增300個原創SVG義項及706個核實共用映射：414資產／1185有圖卡／5909總卡，4724仍缺圖。精確匹配id、word、reading、zh，不自動依詞面擴散；含5個遊戲整句義項，沒有新增教材或改文字／ID／音檔。沿用文字中心線、答案後56×42、空alt、長答案獨立捲動及缺圖退化；排程、同步3、下載、離線收錄與runtime dependencies不變。precache21,807,800／26,869,829；JS／CSS門檻保持。義項界線、全量盤點、共用暫緩與手機驗證見[vocab-illustration-t156.md](vocab-illustration-t156.md)。圖片不是完整定義，不以配圖數或簽章數宣稱全站語義驗收或記憶效果。

## 架構

Vite / React + TypeScript，本機瀏覽器執行，local-first。目前無後端；未來若需要（例如 SRS 進度跨裝置同步）才考慮 Cloudflare Workers / KV / D1，見 [project-plan.md](project-plan.md)。

- `app/main.tsx`：React 掛載點。
- `app/App.tsx`：頁首、三個分頁（課程／單字卡／聽寫，用 `#/`、`#/srs`、`#/dictation` hash 切換，不加路由套件）與進度存取提示。分頁內容在 `app/views/`（`LessonView`、`SrsView`、`DictationView`），共用的音檔元件在 `app/components/AudioLine.tsx`（`PlayButton` 音檔載入或播放失敗時顯示明確錯誤）。
- `app/views/ShadowingView.tsx`：跟讀。播放一次、留白（見 `lib/shadowing.mjs`）讓使用者念、再播，一直重複到按停止（沒有輪數上限，T34），也可以只「聽一次」，可隱藏原文；音檔播放失敗顯示明確錯誤；按停止造成的 `AbortError` 不當成錯誤。不含調速。
- `lib/`：無 DOM 的純邏輯，用 `.mjs` + JSDoc 型別，讓 `node --test` 直接測、TypeScript 也能匯入。`srs.mjs`（FSRS 排程〔T53，原為 SM-2 簡化版〕、單字卡、複習／新卡兩區的牌組）、`srs-session.mjs`（一輪複習的流程：上一張／下一張、評分後跳到哪一張、回頭改評分）、`dictation.mjs`（聽寫句子清單、逐字比對）、`progress.mjs`（進度資料形狀、解析驗證、聽寫紀錄）、`shadowing.mjs`（跟讀留白長度）。
- `app/lib/storage.ts`、`app/useProgress.ts`：`localStorage` 讀寫（key `nihongo-lab:progress:v1`）與 React 狀態；存檔壞掉時原文備份到 `…:backup` 並提示，寫入失敗時畫面顯示訊息但仍可繼續學習。
- `curriculum/lessons.mjs`：學習階段與課程資料的單一來源，目前第 0 階段有 25 課、第 1 階段有 180 課、第 2 階段有 10 課（八課動畫特訓、口語轉換表、動畫與遊戲名句），第 3 階段仍為規劃（`lessons: []`）。
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
- 涵蓋率檢查：`lib/coverage.mjs` 是純邏輯（單字比對、漢字分級、文法 id 統計、課數推算，有測試）；`scripts/coverage-openjlpt.mjs` 負責下載 OpenJLPT 資料（釘在固定 commit，快取在不進 git 的 `.cache/`）與輸出報告。OpenJLPT 為 CC BY-SA 4.0，所以資料不進 repo；可記錄統計及本專案教材所用ID、自己撰寫的判定理由與來源連結；外部完整清單、解說與例句不複製進repo。
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

- **端點**：`POST /auth { idToken }`（Google 憑證通過驗證且 email 在白名單，以 `__Host-nihongo_session` HttpOnly cookie 換發 session，回應只含 email）、`POST /sync { progress }`（session 從 cookie 讀；與雲端合併後存回，把合併結果整份還給裝置）、`POST /logout`（清除 cookie）、`GET /health`。一次 `/sync` 同時是上傳與下載；沒有新內容時不寫 KV。
- **Google 憑證驗證**（`google-token.mjs`）：RS256 簽名（金鑰來自 Google 的 JWKS，找不到 `kid` 時重抓一次，5 分鐘內最多強制重抓一次）、`iss`、`aud` 必須是本 App 的 Client ID、`exp`、`iat` 不在未來、`email_verified` 必須是布林 `true`，最後 email 比對白名單（不分大小寫）。不在白名單回 403，其他一律 401，兩者的訊息不洩漏白名單內容。
- **Session**（`session.mjs`）：Google 憑證一小時就過期，所以驗證過一次後由 Worker 自己發 HMAC-SHA256 簽名的憑證，有效 30 天，剩不到 15 天時在 `/sync` 回應的 `Set-Cookie` 換發新的（常用的裝置不用重新登入）。cookie 為 `HttpOnly; Secure; SameSite=Strict; Path=/`，頁面腳本讀不到。簽名金鑰是 Worker secret。
- **資料**：每個 Google 帳號（`sub`）一筆 KV：`progress:<sub>`，內容是版本 2 的進度 JSON。送上來的進度先用 `parseProgress` 驗證（版本 1 也收，自動轉換），格式不對 400，超過 2MB 413。**雲端的存檔讀不懂時不覆蓋，回 500**，寧可這次同步失敗也不蓋壞唯一的雲端副本。
- **一致性**：KV 是最終一致，兩台裝置幾乎同時同步時，後寫的可能基於舊的讀取結果。因為每次同步都是整份上傳、整份取回，且合併滿足交換律／結合律／冪等（T28），下一次同步就會補回，不會永久遺失。
- **同源（SEC-P1-20261031，2026-10-31）**：網頁改由同一個 Worker 的 static assets 提供（`worker/public/nihongo-lab/`，路徑維持 `/nihongo-lab/`），與 API 同源，不開 CORS。所有 POST 必須帶本站的 `Origin`（沒有 `Origin` 時要 `Sec-Fetch-Site: same-origin`），否則 403；這也擋住同站（`*.workers.dev`）其他 Worker 的頁面。不再接受 `Authorization: Bearer`。
- **設定與 secret**：`worker/wrangler.toml` 只放公開值（Google Client ID、static assets 目錄、KV 綁定）；`worker/public/_headers` 設 CSP 等標頭，`_redirects` 把 `/` 導到 `/nihongo-lab/`。白名單 email（`ALLOWED_EMAIL`）與 session 簽名金鑰（`SESSION_SECRET`）是 secret，用 `wrangler secret put` 設定，**不進公開 repo**。部署：push 到 main 由 CI 的 `deploy-worker` job 把 build 複製到 `worker/public/nihongo-lab` 後執行固定版本的 `npx wrangler deploy`（需要 repository secrets `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`；wrangler 仍不加成專案相依套件）。網址 `https://nihongo-sync.curio-lab.workers.dev/nihongo-lab/`。
- **Google Cloud 端**：專案 `nihongo-sync`（已停用計費，不依賴免費試用帳戶）、OAuth 同意畫面為「外部、測試中」，只有加進「測試使用者」的帳號能登入；網頁用戶端的授權 JavaScript 來源是 `https://nihongo-sync.curio-lab.workers.dev`（2026-10-31 起；舊的 GitHub Pages 來源在家人與使用者轉移後可移除）與本機開發網址。不使用重新導向 URI（用 Google 登入按鈕取得身分憑證）。

### 變更紀錄：網頁搬離共用的 github.io（SEC-P1-20261031，2026-10-31）

- **原因**：`frobel0520.github.io` 由帳號下所有 GitHub Pages 專案共用同一個來源，任何一個 Pages 站被注入腳本就能讀走存在 `localStorage` 的 30 天同步 token，並以本人身分讀寫雲端進度。
- **做法**：網頁改由 `nihongo-sync` Worker 的 static assets 提供（免費的 `*.workers.dev` 網址，不購買網域），session 改 HttpOnly cookie；前端 build 約 11,400 檔／213MB，在 Workers 免費方案每版 20,000 檔、單檔 25 MiB 上限內，靜態檔請求不計費，符合零月費。
- **舊網址**：GitHub Pages 只發布引導頁（`pages-redirect/`）：清除舊 token；本機沒有進度就直接轉到新網址，有進度則提供與 App 匯出相同格式的進度檔下載，到新網址設定頁「匯入進度」。另發布替換用 `sw.js`，讓舊版 service worker 自行清快取、解除註冊並重新載入，使用者才看得到引導頁。
- **上線順序**：CI 先 `deploy-worker`，成功後 `deploy-pages-redirect` 才換掉舊站；缺 secrets 或 `NIHONGO_APP_URL` 時對應 job 失敗，舊站維持原樣。
- **使用者影響**：需重新登入同步、重新加入主畫面；離線音檔與圖片快取、顯示偏好存在舊來源，需在新網址重新下載／設定。
- **Rollback**：`wrangler rollback` 回上一版 Worker，並 revert 本變更讓 CI 重新以舊流程發布 GitHub Pages。

## 跨裝置同步的前端（T30）

純邏輯在 `lib/sync.mjs`（請求、登入狀態儲存、狀態文字）與 `lib/sync-controller.mjs`（流程控制），網路、儲存空間、計時器、進度的讀取與套用都由呼叫端注入，用 `node --test` 驗證；畫面端是 `app/useSync.ts`（接事件）、`app/lib/googleSignIn.ts`（載入 Google 登入）、`app/components/SyncPanel.tsx`（設定頁面板），App 最上方另有「登入已過期」的提示。

- **登入**：Google 的腳本（Google Identity Services）只在使用者按「用 Google 登入」才載入，載入後畫出 Google 官方的按鈕，再按一次完成登入（彈出視窗）；拿到身分憑證後送 `POST /auth` 換 session。沒登入時完全不連 Google 或同步伺服器（開發版實測網路請求確認）。
- **登入狀態**存在 `localStorage` 的 `nihongo-lab:sync:v1`（`{ email, lastSyncAt }`，只供顯示與排程），session 本體是 HttpOnly cookie，頁面腳本讀不到。原本 token 存在 `帳號.github.io` 這個所有 Pages 專案共用的來源，同帳號其他網站讀得到，因此 2026-10-31 改為同源 Worker 提供網頁（SEC-P1-20261031）。登出時要等 Worker 清掉 cookie 才算登出，失敗會維持登入並提示。
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

## 單字卡排程改用 FSRS（T53，2026-10-05）

- **演算法**：`lib/srs.mjs` 用 [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) 5.4.2（MIT）的 FSRS-6 預設參數。每張卡存穩定度（記得的機率從剛複習完降到 90% 要幾天）、難度（1～10）、狀態；答「記得」排到預估記得的機率降到 `DESIRED_RETENTION`（0.9）那天，至少 1 天、最多 365 天（ts-fsrs 在上限 365 時仍可能給 366，自己再夾一次）。不打亂到期日（`enable_fuzz: false`），不設分鐘級學習步驟；「還不會」照舊今天再看（到期日設今天），由一輪流程處理。
- **兩級評分**：還不會＝Again、記得＝Good；Hard／Easy 不用。
- **同一輪的評分紀錄**（`lib/srs-session.mjs` 的 `history`、`revisit`）：答還不會後一輪自動繞回來是「再考一次」，評分接在後面，記錄時從這一輪之前的狀態依序套用（`recordReviewSequence`：先記一次忘記，再記同一天答對）；用上一張／下一張回頭改是「改掉按錯的」，換掉最後一個。自動繞回來的卡先蓋住答案。
- **進度格式版本 3**：`srs: { [id]: { stability, difficulty, state, reps, lapses, due, firstSeen, updatedAt } }`。`updatedAt` 同時是 FSRS 算「距離上次複習幾天」的依據。版本 1、2（SM-2 的 ease、interval）讀進來時用 `fromLegacyCard` 轉換：到期日、首次日期、評分時刻不變；正在還不會的卡用新卡第一次答還不會後的穩定度與難度，答過記得的卡穩定度取舊間隔（至少 1 天），難度看有沒有答錯過。沒有逐次作答紀錄，所以這是估計。
- **跨裝置同步**：Worker 共用 `lib/progress.mjs`，要重新部署才會收版本 3；部署前，新版 App 上傳版本 3 會被舊 Worker 拒絕（同步失敗、本機進度不受影響）。還沒更新的舊版 App 從雲端拿到版本 3 會當成「較新的版本」不合併，更新 App 後恢復。

## T54 動畫特訓教材資料與來源（2026-10-07）

`anime-core.mjs` 由 `buildAnimeLessons` 在公開入口 `lessons.mjs` 建立第 4～7 課時注入，`anime-core-questions.mjs` 依課程 id＋台詞 key 加題。既有 meaning 題物件不改動，`listeningRecordId` 的 73 個值保留。各課 `references` 顯示於可展開來源區；單字 `note`／`referenceUrl`／`referenceNote` 顯示搭配及核對來源；文法 `referenceUrl` 指向教學章節。

`GrammarPoint.quoteExamples` 保存 `{quote, referenceUrl}`，quote 直接引用共用句庫物件，保留原配音、原音檔；文法區展示來源，`lessonAudioPaths` 亦收錄這些跨課引用。它不重複加入 `buildSentences`，避免原名句的聽寫歸屬改變或重複 id。普通 `examples` 為自行編寫的補充句，用 `source` 明確標示。新增詞／句的路徑仍用 `audioPath` 內容雜湊，只使用五位保留的原有聲線；原男聲名句不重編。

新增 55 個音檔皆有新 URL，快取維持 v5；下載全站或該課可補齊。40 詞進既有 FSRS，進度格式與 Worker 不改。兩個獨立詞的 Kanjium 重音覆寫加進既有 `AUDIO_PROSODY`，原 81 筆不改動。

## T55 四課核心教材與發音參考（2026-10-08）

`anime-core-foundation.mjs` 保存第 1～3、8 課資料，由 `anime-core.mjs` 注入；新聽力題放在 `anime-core-foundation-questions.mjs` 並由原題庫模組合併，對外入口仍為 `lessons.mjs`。既有八十九題物件及音檔 URL 不改，新增 40 張 FSRS 卡、16 句聽寫／跟讀與 56 個音檔；音檔快取維持 v5，已有快取只補下載新增檔案。

`VocabItem.pronunciation` 是選用的實際發音假名，由 `build-audio-jobs.mjs` 轉交既有合成器；它不取代供顯示／ruby 用的 `reading`。「気を付ける」顯示讀音保留きをつける，實際核對用きおつける，避免把助詞を誤當字面讀音。獨立詞「燃やす」新增 Kanjium 0 型、もやす覆寫；引擎原來多讀え，假名重試又切碎詞界，因此採經核對的完整詞覆寫，原 83 筆保留。

## T56 文法資料、進度與畫面（2026-10-08）

`anime-grammar-study.mjs` 保存 32 組接續提示及 64 題，由 `anime-core.mjs` 注入 `GrammarPoint.study`，對外仍由 `lessons.mjs` 提供。題目依序為固定 q1／q2，選項位置跨重點輪替。`AnimeGrammarStudy` 提供重點清單、解說與單題畫面；例句只顯示文字，不掛載音訊元件。既有一般文法畫面沿用；首頁由 `lesson-progress.mjs` 增加文法摘要。

`lib/grammar-study.mjs` 沿用版本 3 通用練習 map：`grammar:課程:語義點id:題id:內容雜湊` 保存主紀錄，`:wrong` 輔助紀錄保存最後答錯時刻，每題最多兩筆。主紀錄保存曾答對，若錯誤時間不早於最後作答則列入待重練；同裝置時間回退／同毫秒重答會使時間單調增加。沿用既有 Worker 的通用紀錄合併（passed OR、attempts 最大值、lastAt 最大值），不升 schema、不需重部署 Worker。相同時間的跨裝置作答採保守待重練，跨裝置時鐘偏差仍可能影響最新狀態。題序重排、說明修改不重置紀錄；題幹／選項／答案修改會取得新雜湊。輔助紀錄不另算備份／設定頁題數。

`nihongo-lab:grammar-location:v1` 保存各課語義點與 learn／q1／q2 閱讀位置，驗證後再恢復，損毀或無法儲存不阻止學習；此書籤不加入雲端／匯出。重練使用開始時的錯題佇列，避免答對後縮短佇列造成跳題。滑動重用 `useSwipeNavigation`，不攔截控制元件及垂直捲動；手機 footer 固定在全域頁籤上方。

## T57 遊戲資料與路由（2026-10-11）

`game-character-study.mjs` 保存 GameStudy／GameCharacter／GameLine，由 `lessons.mjs` 匯出 `gameCharacterStudy`，不注入既有四階段課程。每句含穩定 id、category、kind、reading、note、來源及音檔；kind 分 quote／practice，自編句情境為主題練習。同角色固定現役聲線，音檔由原文／voice 內容雜湊定址。

`#/games`、`#/games/<gameId>`、`#/games/<gameId>/<characterId>` 支援深連結與返回；未知角色顯示同遊戲清單、未知遊戲回入口，壞編碼／多餘段落安全回清單。App routeKey 包含遊戲／角色，換角色不保留其他角色的索引或模式。`GameStudyView` 預設無聲閱讀，聽力才掛載既有 PlayButton，切句／切回閱讀的 cleanup 停止播放；touch-action pan-y 保留垂直捲動。

`gameRecordId` 是 `game:句id:原文雜湊`，使用版本 3 通用練習 map 儲存自評已學，不變更 Worker。解說修改不重置，原文修改另存。`allAudioPaths` 可接額外音檔陣列，設定頁加入 18 檔；遊戲頁可單角色或全遊戲下載。OfflineAudio 允許自訂本課／全部名稱，原課程預設標籤不變。合成 jobs 與 orphan／ruby／配音陣容測試一併涵蓋獨立資料；快取沿用 v5。

## T58 角色名冊與頭像（2026-10-12）

`game-character-roster.mjs` 保存固定來源的 91 筆 ER 角色 code、id、中文／日文名、預設頭像與來源，由 `game-character-study.mjs` 合併既有三位角色的教材。其餘 lines 為空、不指定合成聲線。GameCharacter 的 portrait／portraitReferenceUrl 用於頭像清單，既有路由與 GameLine 不變。

`GameStudyView` 移除搜尋 state／input，使用帶完整可點擊範圍與 aria-label 的角色連結格。固定寬高、方形容器、object-fit 保持版面，圖片 lazy-load，中文／日文標籤補充識別。空角色頁在句數／播放控制之前返回，避免 1/0 與空音訊。所有頭像存於 `public/game-portraits`，sources.json 記來源；Workbox glob 納入 jpg，png 與 jpg 共 97 檔預快取，不依賴遠端圖片在執行時可用。來源資料入口仍為 lessons.mjs。

## T59 遊戲聽力題與預設（2026-10-12）

`game-character-questions.mjs` 保存各句兩個大意干擾選項，由 lessons.mjs 匯出；lib/game-study.mjs 以既有翻譯作正解、既有 note 作解說，答案位置依句 id 雜湊輪替。`gameListeningRecordId` 是 game-listening 命名空間，雜湊原文／題幹／選項／答案，解說更改不重置；沿用版本 3 通用練習 map、既有備份與 Worker，不改自評 game id。

StudyLine 用 submitted ref 防連點，play count 與開始本輪的 baseline 判斷新播放。先看原文設 peeked，不走成績寫入；重練清除本輪 UI、更新 baseline 與 PlayButton key，停止舊音訊，重播後才能再答。GameStudyView 預設 listening true；LessonView 沿 sections 首個可用區塊（動漫 training 優先），ShadowingView 預設 showText false。原無聲入口與文法資料仍保留，進度 schema／音檔／配音不變。

## T60 介紹短句資料（2026-10-12）

在 game-character-study.mjs 的名冊合併前加入 magnus／fiora／rozzi，每位一筆 profile id、介紹短句分類、社群文字查證來源；game-character-questions.mjs 加入對應干擾項。仍從 lessons.mjs 匯出。新增三個內容雜湊音檔 URL，舊音檔／進度 id／快取版本保持，沿用自評與理解兩種獨立紀錄。

## T61 資料編排（2026-10-12）

加入 yuki／silvia／william 的 profile id，各有 reading、翻譯、來源、用法與兩個干擾項。聲線分別 Nemo 男声2／雨晴はう／青山龍星。新增三個音檔 URL、不替換舊音檔或改動快取版本。既有 ruby 檢查受新增漢字字集影響，八筆中文說明逐一確認為中文並加入無標記審閱項目。

## T62 來源事實、教材與共用音檔（2026-10-12）

game-character-reference-data.mjs 僅保存 82 位角色 code／id／weaponTypes 與來源 SHA-256，對照固定版本 CharacterMastery.json；game-character-weapons.mjs 保存 23 種日中武器名稱及讀音。game-character-reference.mjs 生成兩項教材與大意題干擾項；由 game-character-study.mjs 補進原空角色，公開資料入口仍是 lessons.mjs。

單角色的教材 id 包含角色 id，重複武器詞彙可以共用內容雜湊音檔但理解紀錄獨立。GameStudyView 的 ALL_AUDIO 去重，使下載顯示與實際 144 個檔案相符。新增 20 筆經讀音核對的 AquesTalk 控制片語；原 24 項教材／音檔與進度 id 不改，不升快取版本。

## T63 原神資料與語尾清晰度（2026-10-12）

genshin-character-roster.mjs保存124筆名稱、來源及頭像，genshin-quote-sources.mjs只存12筆來源識別，不複製完整語音庫；仍由lessons.mjs匯出。既有角色id保留，空角色不指定聲線。Bennett專用-ro-v1音檔網址避開舊快取，不改作答id；applyArticulation只在最末モーラ與母音匹配時調整時長／速度，讀音閘門前後均檢查，失敗停止合成。GameStudyView原文揭示後用JpLine直接顯示讀音，遵循全域假名偏好。

## T66 Nemo 選角音檔（2026-10-13）

移除pendingSelectionVoices集合及兩處audioReady:false寫入。五個既有內容雜湊URL加入自製MP3；彷徨う使用AquesTalk控制片語與Kanjium3型，保留救済を原查詢重音。雲端adapter增加accent_phrases端點回傳Core已解析句節，支援T65新版synthesize流程；相容設定只存環境草稿，不寫repo。

## T67 角色入口預設（2026-10-13）

GameStudyView依gameId初始化category，er為角色選擇，其餘空分類。App使用遊戲id與角色id作元件key，確保從選單進入或換角色不沿用上一頁分類／句序；沒有自動呼叫play或改教材順序／id。

## T68 selected來源範圍（2026-10-13）

ER由91位名冊及既有選角聲線直接建立空lines，再載入官方文字與selected逐字稿。刪除reference資料／生成器／武器對照與專用132音檔、僅限已無引用音檔的重音覆寫、11筆舊教材讀音審閱註記。移除舊ER大意題干擾選項；原神題目保留。246句的文字、聲線、音檔URL及進度id保持；移除的舊進度不主動刪除，FSRS格式保持。

## T69 原神三類來源狀態（2026-10-13）

genshin-action-coverage.mjs只保存124筆來源可用狀態、來源檔SHA-256與三類條目／不同voicefile數，不含台詞。build-genshin-coverage.mjs讀本機來源表生成盤點；lib/genshin-coverage.mjs接受·與・及半形中點，拒絕相似前綴。公開入口仍為lessons.mjs；角色頁GenshinCoverage只作狀態呈現，不改課程／FSRS／音檔id。

## T70 原神少量三類短句（2026-10-13）

game-character-study.mjs增加三角色的9段短句；genshin-quote-sources.mjs記錄固定語音id／標題／voicefile，game-character-questions.mjs提供大意題選項，ruby-notes.mjs補解說與來源標題讀音。使用既有hau／tsumugi／nemo2合成9個MP3；保留原有258句全部欄位與音檔URL，既有進度及FSRS不變。

## T71 官方來源對照與朗讀（2026-10-13）

`curriculum/er-fankit-selection.mjs`為108筆來源索引，記錄角色id、原檔名、selected家族、speech／nonverbal、lessonId、官方下載來源與雜湊。`game-character-study.mjs`將來源掛到既有GameLine.officialSources，保留文字與學習id；有來源的句子排前並指向-fankit-v1.mp3，避免舊離線音檔混用。七筆既有重音覆寫只移動路徑鍵，內容保持。角色頁與句子均可展開官方檔名對照；非語詞只有索引。教材入口仍由lessons.mjs匯出，原始WAV不進public或Git。獨立HTML內嵌91個MP3，閱讀／盲聽、角色篩選、讀音與解說均不依賴外部網路。
## T72 原神新增資料（2026-10-13）

`game-character-study.mjs`新增14個LineSpec，`genshin-quote-sources.mjs`保留逐句固定版本voicelineId／title／voicefile，`game-character-questions.mjs`新增大意干擾項，`ruby-notes.mjs`新增17筆逐字檢閱。鍾離使用ryusei、納西妲hau、砂糖sayo；舊角色聲線保持。天道朗讀採てんどう，首片語取Kanjium允許的1型並保留原查詢其餘句界與重音。原神scope依實際角色與句數產生，避免舊文字仍寫六位12句；資料入口仍為lessons.mjs。

## T73 原神資料與朗讀（2026-10-13）

game-character-study.mjs新增9個LineSpec，quote-sources保留語音識別與固定來源，questions及ruby-notes補解說與題目。香菱使用tsumugi、行秋nemo2、菲謝爾sayo；教材入口仍是lessons.mjs。皇女採こうじょ、石採いし，重音覆寫記錄來源與句界核對；不是原配音模仿。

## T74 長任務資料

琴sayo、可莉hau、迪奧娜neko-vy，新增9個LineSpec與来源識別、大意干擾項及10筆解說／來源標題讀音。音檔透過發音／重音閘門；既有44句及ER逐欄保持。公開入口仍為lessons.mjs，機器來源全文及工作檔不發布。

## T75 資料與聲線

阿貝多使用saehaku、北斗tsumugi、雷澤neko-vy。新增9個LineSpec、來源識別、大意選項與10筆解說／來源讀音審閱；來源全文留在工作素材，不進專案。

## T76 原神角色與來源

旅行者nemo2、艾爾海森saehaku、亞蘿伊sayo。新增9個LineSpec、固定來源識別及意思題；旅行者「風と共に去れ」讀音邊界經對齊檢查。入口仍由lessons.mjs匯出。

## T78 原神角色與來源

阿蕾奇諾sayo、夏洛蒂tsumugi、恰斯卡sayo；`game-character-study.mjs`新增9個LineSpec，`genshin-quote-sources.mjs`記錄固定版本的voicelineId／sourceTitle／voicefile，`game-character-questions.mjs`新增大意選項，`ruby-notes.mjs`審閱新增說明與來源標題。音檔由VOICEVOX合成，來源JSON及原配音不納入公開教材；入口仍由lessons.mjs匯出。愛諾來源沒有可用行動語音短句，阿羅夏沒有日文語音來源，故不建立LineSpec。

## T79 原神角色與來源

夏沃蕾sayo、千織saehaku、重雲nemo2；各收錄一個固定版日文編隊加入、元素技能及元素爆發短句，對應source voicelineId／title／voicefile並附意思題。新增9個LineSpec及8筆解說讀音標記；VOICEVOX音檔、讀音及解說完成後仍由lessons.mjs作教材入口；原始來源全文不納入公開教材。

## T80 原神角色與來源

茜特菈莉sayo、克洛琳德saehaku、柯萊hau；固定版來源各取一個編隊加入／元素技能／元素爆發短句，保留voicelineId／sourceTitle／voicefile，新增9個LineSpec與大意選項、10筆解說及來源讀音標記。聲音為VOICEVOX自製朗讀，原配音和來源JSON不公開；教材仍由lessons.mjs匯出。

## T81 原神角色與來源

賽諾ryusei、迪希雅sayo、多莉hau；固定版來源各取一個編隊加入／元素技能／元素爆發短句，保留voicelineId／sourceTitle／voicefile，新增9個LineSpec與大意選項、8筆解說讀音標記。多莉的「一儲け」「見せ所」以核對讀音及VOICEVOX重音覆寫避免錯讀；遊戲原配音和來源JSON不公開，教材仍由lessons.mjs匯出。

## 2026-10-13 T82 原神三角色教材

艾梅莉埃、優菈、琺露珊各收錄編隊加入／元素技能／元素爆發一句，共9句；原神42位125句，82筆待教材，全遊戲371句。固定版本語音表逐句核對voicelineId、來源標題與voicefile；繁中、大意题與日文讀音解說齊備，既有教材逐欄比對保持一致。

9個VOICEVOX音檔通過讀音閘門及全檔解碼，僅含encoder metadata。助詞「は／を」的實際發音用「わ／お」核對；「氷浪」教材讀作「ひょうろう」，使用校正後的VOICEVOX重音與句界。未逐句人耳驗收或比對遊戲原配音。新增「唸」使中文解說被列入日文候選檢查，三筆中文原字串已審閱，未替中文標假名。

完整typecheck、43測試檔、lint、正式base path build通過；375×667手機尺寸實測9句播放、正確作答、原文／假名揭示，角色音檔下載後斷網重載及9句播放通過；無水平溢位或pageerror。變更文字／正式建置產物隱私格式掃描無發現，公開Git暱稱及指定noreply身分確認。PR與部署待完成，之後依最新main接續下一批。

## T83 配音配置資料

voices.mjs新增教材聲線分類gender；er-voice-casting.mjs保存91位角色gender、voice、direction與角色性別參考連結，getErCasting缺資料即停止，取消saehaku預設。game-character-study.mjs統一讀取角色配置，文字／聲線雜湊產生新MP3網址；13個既有重音覆寫移到對應新網址。原神千織、克洛琳德改用sayo，雷澤改用nemo2；學習與聽力record id不依voice／audio，保留原進度。僅移除本次取代且無引用的舊MP3。[角色配置表](game-voice-plan.md)。

## 2026-10-14 T84 原神自動接續批次

菲米尼、芙寧娜、嘉明各新增編隊加入／元素技能／元素爆發一句，共9句VOICEVOX；原神45位134句、79筆待教材。固定版本語音表逐句核對voicelineId／標題／voicefile，繁中、讀音、解說及大意題齊備；既有教材與ER聲線配置逐欄保持。

完整typecheck、260 tests、lint與正式base path build通過；9個MP3讀音閘門、全檔解碼、非靜音訊號與encoder-only metadata通過，共142,092 bytes。375×667手機實测9句播放／作答／原文假名揭示，角色音檔下載後斷網重載與9句播放通過；無水平溢位或pageerror。PR check與正式站部署待完成，核對後直接接續下一批。音色、語氣與原作演技未逐句人耳驗收。

## 2026-10-14 T85 原神自動接續批次

甘雨、五郎、胡桃收錄可核對的編隊加入／元素技能／元素爆發短句，共8句VOICEVOX；原神48位142句、76筆待教材。固定版本語音表逐句核對voicelineId／標題／voicefile，繁中、讀音、解說及大意題齊備；既有教材與ER聲線配置逐欄保持。

胡桃的技能來源僅有「喝／起／散」單字喊聲，讀音缺可靠核對證據；先收錄編隊與爆發兩句，技能保持待收錄，不把喊聲擴寫成完整台詞。

完整typecheck、260 tests、lint與正式base path build通過；8個MP3讀音閘門、全檔解碼、非靜音訊號與encoder-only metadata通過，共117,568 bytes。375×667手機實測8句播放／作答／原文假名揭示，角色音檔下載後斷網重載與8句播放通過；無水平溢位或pageerror。PR check與正式站部署待完成，核對後直接接續下一批。音色、語氣與原作演技未逐句人耳驗收。

## 2026-10-14 T86 原神自動接續批次

卡齊娜、楓原萬葉、神里綾華收錄可核對的編隊加入／元素技能／元素爆發短句，共9句VOICEVOX；原神51位151句、73筆待教材。固定版本語音表逐句核對voicelineId／標題／voicefile，繁中、讀音、解說及大意題齊備；既有教材與ER聲線配置逐欄保持。

楓原萬葉文語短句的「行く」教材採「ゆく」，加入讀音校正後的VOICEVOX重音與句界覆寫；「共」保留固定來源字面並讀「とも」，未宣稱原作演技已核對。

完整typecheck、260 tests、lint與正式base path build通過；9個MP3讀音閘門、全檔解碼、非靜音訊號與encoder-only metadata通過，共186,156 bytes。375×667手機實測9句播放／作答／原文假名揭示，角色音檔下載後斷網重載與9句播放通過；無水平溢位或pageerror。PR check與正式站部署待完成，核對後直接接續下一批。音色、語氣與原作演技未逐句人耳驗收。

## 2026-10-14 T87 原神自動接續批次

神里綾人、卡維、基尼奇收錄可核對的編隊加入／元素技能／元素爆發短句，共9句VOICEVOX；原神54位160句、70筆待教材。固定版本語音表逐句核對voicelineId／標題／voicefile，繁中、讀音、解說及大意題齊備；既有教材與ER聲線配置逐欄保持。

基尼奇只收錄沒有「アハウ：」標記的本人短句，避免將阿喬的獨立發言套用基尼奇聲線。

完整typecheck、260 tests、lint與正式base path build通過；9個MP3讀音閘門、全檔解碼、非靜音訊號與encoder-only metadata通過，共159,084 bytes。375×667手機實測9句播放／作答／原文假名揭示，角色音檔下載後斷網重載與9句播放通過；無水平溢位或pageerror。PR check與正式站部署待完成，核對後直接接續下一批。音色、語氣與原作演技未逐句人耳驗收。

## 2026-10-14 T88 原神自動接續批次

綺良良、九條裟羅、久岐忍收錄可核對的編隊加入／元素技能／元素爆發短句，共9句VOICEVOX；原神57位169句、67筆待教材。固定版本語音表逐句核對voicelineId／標題／voicefile，繁中、讀音、解說及大意題齊備；既有教材與ER聲線配置逐欄保持。

完整typecheck、260 tests、lint與正式base path build通過；9個MP3讀音閘門、全檔解碼、非靜音訊號與encoder-only metadata通過，共165,420 bytes。375×667手機實測9句播放／作答／原文假名揭示，角色音檔下載後斷網重載與9句播放通過；無水平溢位或pageerror。PR check與正式站部署待完成，核對後直接接續下一批。音色、語氣與原作演技未逐句人耳驗收。

## 2026-10-14 T89 原神自動接續批次

藍硯、萊依拉、麗莎收錄可核對的編隊加入／元素技能／元素爆發短句，共9句VOICEVOX；原神60位178句、64筆待教材。固定版本語音表逐句核對voicelineId／標題／voicefile，繁中、讀音、解說及大意題齊備；既有教材與ER聲線配置逐欄保持。

完整typecheck、260 tests、lint與正式base path build通過；9個MP3讀音閘門、全檔解碼、非靜音訊號與encoder-only metadata通過，共182,412 bytes。375×667手機實測9句播放／作答／原文假名揭示，角色音檔下載後斷網重載與9句播放通過；無水平溢位或pageerror。PR check與正式站部署待完成，核對後直接接續下一批。音色、語氣與原作演技未逐句人耳驗收。

## 2026-10-14 T90 原神自動接續批次

熒、琳妮特、林尼收錄可核對的編隊加入／元素技能／元素爆發短句，共9句VOICEVOX；原神63位187句、61筆待教材。固定版本語音表逐句核對voicelineId／標題／voicefile，繁中、讀音、解說及大意題齊備；既有教材與ER聲線配置逐欄保持。

旅行者（熒）的「次は何に会えるかな？」與「風と共に去れ。」有重複假名邊界，改用明確的逐詞ruby；來源原文、讀音與教材音檔保持不變。

完整typecheck、260 tests、lint與正式base path build通過；9個MP3讀音閘門、全檔解碼、非靜音訊號與encoder-only metadata通過，共155,052 bytes。375×667手機實測9句播放／作答／原文假名揭示，角色音檔下載後斷網重載與9句播放通過；無水平溢位或pageerror。PR check與正式站部署待完成，核對後直接接續下一批。音色、語氣與原作演技未逐句人耳驗收。

## 2026-10-14 T91 原神自動接續批次

瑪薇卡、米卡、莫娜收錄可核對的編隊加入／元素技能／元素爆發短句，共9句VOICEVOX；原神66位196句、58筆待教材。固定版本語音表逐句核對voicelineId／標題／voicefile，繁中、讀音、解說及大意題齊備；既有教材與ER聲線配置逐欄保持。

完整typecheck、260 tests、lint與正式base path build通過；9個MP3讀音閘門、全檔解碼、非靜音訊號與encoder-only metadata通過，共225,036 bytes。375×667手機實測9句播放／作答／原文假名揭示，角色音檔下載後斷網重載與9句播放通過；無水平溢位或pageerror。PR check與正式站部署待完成，核對後直接接續下一批。音色、語氣與原作演技未逐句人耳驗收。

## 2026-10-14 T92 原神自動接續批次

瑪拉妮、娜維婭、那維萊特收錄可核對的編隊加入／元素技能／元素爆發短句，共9句VOICEVOX；原神69位205句、55筆待教材。固定版本語音表逐句核對voicelineId／標題／voicefile，繁中、讀音、解說及大意題齊備；既有教材與ER聲線配置逐欄保持。

T92：君採きみ、幸採さち，修正原文解析的くん／こう；採用讀音校正後的VOICEVOX句界與重音，保留驚嘆後的停頓，不推定原作演技。

完整typecheck、260 tests、lint與正式base path build通過；9個MP3讀音閘門、全檔解碼、非靜音訊號與encoder-only metadata通過，共203,724 bytes。375×667手機實測9句播放／作答／原文假名揭示，角色音檔下載後斷網重載與9句播放通過；無水平溢位或pageerror。PR check與正式站部署待完成，核對後直接接續下一批。音色、語氣與原作演技未逐句人耳驗收。

## 2026-10-14 T93 原神自動接續批次

妮露、凝光、歐洛倫收錄可核對的編隊加入／元素技能／元素爆發短句，共9句VOICEVOX；原神72位214句、52筆待教材。固定版本語音表逐句核對voicelineId／標題／voicefile，繁中、讀音、解說及大意題齊備；既有教材與ER聲線配置逐欄保持。

完整typecheck、260 tests、lint與正式base path build通過；9個MP3讀音閘門、全檔解碼、非靜音訊號與encoder-only metadata通過，共183,276 bytes。375×667手機實測9句播放／作答／原文假名揭示，角色音檔下載後斷網重載與9句播放通過；無水平溢位或pageerror。PR check與正式站部署待完成，核對後直接接續下一批。音色、語氣與原作演技未逐句人耳驗收。

## 2026-10-14 T94 原神自動接續批次

七七、蘿莎莉亞、珊瑚宮心海收錄可核對的編隊加入／元素技能／元素爆發短句，共9句VOICEVOX；原神75位223句、49筆待教材。固定版本語音表逐句核對voicelineId／標題／voicefile，繁中、讀音、解說及大意題齊備；既有教材與ER聲線配置逐欄保持。

T94：聞き給え採ききたまえ，修正引擎的ききあたえ；合併聞き給え為一個命令片語，給え的下降位置沿用讀音校正查詢，其餘句界與重音保持原查詢，不宣稱原配音重音。

完整typecheck、260 tests、lint與正式base path build通過；9個MP3讀音閘門、全檔解碼、非靜音訊號與encoder-only metadata通過，共169,452 bytes。375×667手機實測9句播放／作答／原文假名揭示，角色音檔下載後斷網重載與9句播放通過；無水平溢位或pageerror。PR check與正式站部署待完成，核對後直接接續下一批。音色、語氣與原作演技未逐句人耳驗收。

## 2026-10-14 T95 原神自動接續批次

早柚、賽索斯、申鶴收錄可核對的編隊加入／元素技能／元素爆發短句，共9句VOICEVOX；原神78位232句、46筆待教材。固定版本語音表逐句核對voicelineId／標題／voicefile，繁中、讀音、解說及大意題齊備；既有教材與ER聲線配置逐欄保持。

T95：請求讓路的退いて採どいて，修正引擎的しりぞいて；其餘句界及重音保留原查詢，退いて使用讀音校正後的VOICEVOX重音，不模仿原配音。

完整typecheck、260 tests、lint與正式base path build通過；9個MP3讀音閘門、全檔解碼、非靜音訊號與encoder-only metadata通過，共173,484 bytes。375×667手機實測9句播放／作答／原文假名揭示，角色音檔下載後斷網重載與9句播放通過；無水平溢位或pageerror。PR check與正式站部署待完成，核對後直接接續下一批。音色、語氣與原作演技未逐句人耳驗收。

## 2026-10-14 T96 原神自動接續批次

鹿野院平藏、希格雯、達達利亞收錄可核對的編隊加入／元素技能／元素爆發短句，共9句VOICEVOX；原神81位241句、43筆待教材。固定版本語音表逐句核對voicelineId／標題／voicefile，繁中、讀音、解說及大意題齊備；既有教材與ER聲線配置逐欄保持。

T96：認めろ採みとめろ，修正引擎的したためろ；罪を保留原查詢下降位置，認めろ使用讀音校正後的VOICEVOX重音與原句界，不模仿原配音。

完整typecheck、260 tests、lint與正式base path build通過；9個MP3讀音閘門、全檔解碼、非靜音訊號與encoder-only metadata通過，共165,132 bytes。375×667手機實測9句播放／作答／原文假名揭示，角色音檔下載後斷網重載與9句播放通過；無水平溢位或pageerror。PR check與正式站部署待完成，核對後直接接續下一批。音色、語氣與原作演技未逐句人耳驗收。

## 2026-10-14 T97 原神自動接續批次

托馬、提納里、流浪者收錄可核對的編隊加入／元素技能／元素爆發短句，共9句VOICEVOX；原神84位250句、40筆待教材。固定版本語音表逐句核對voicelineId／標題／voicefile，繁中、讀音、解說及大意題齊備；既有教材與ER聲線配置逐欄保持。

完整typecheck、260 tests、lint與正式base path build通過；9個MP3讀音閘門、全檔解碼、非靜音訊號與encoder-only metadata通過，共170,892 bytes。375×667手機實測9句播放／作答／原文假名揭示，角色音檔下載後斷網重載與9句播放通過；無水平溢位或pageerror。PR check與正式站部署待完成，核對後直接接續下一批。音色、語氣與原作演技未逐句人耳驗收。

## 2026-10-14 T98 原神自動接續批次

萊歐斯利、閒雲、魈收錄可核對的編隊加入／元素技能／元素爆發短句，共9句VOICEVOX；原神87位259句、37筆待教材。固定版本語音表逐句核對voicelineId／標題／voicefile，繁中、讀音、解說及大意題齊備；既有教材與ER聲線配置逐欄保持。

魈的「召喚に応じ参上する。」用逐詞ruby明確區分「応じ」與「参上」的假名邊界，避免自動對齊歧義；不更動來源原文與讀音。

完整typecheck、260 tests、lint與正式base path build通過；9個MP3讀音閘門、全檔解碼、非靜音訊號與encoder-only metadata通過，共171,756 bytes。375×667手機實測9句播放／作答／原文假名揭示，角色音檔下載後斷網重載與9句播放通過；無水平溢位或pageerror。PR check與正式站部署待完成，核對後直接接續下一批。音色、語氣與原作演技未逐句人耳驗收。

## 2026-10-14 T99 原神自動接續批次

希諾寧、辛焱、八重神子收錄可核對的編隊加入／元素技能／元素爆發短句，共9句VOICEVOX；原神90位268句、34筆待教材。固定版本語音表逐句核對voicelineId／標題／voicefile，繁中、讀音、解說及大意題齊備；既有教材與ER聲線配置逐欄保持。

完整typecheck、260 tests、lint與正式base path build通過；9個MP3讀音閘門、全檔解碼、非靜音訊號與encoder-only metadata通過，共187,020 bytes。375×667手機實測9句播放／作答／原文假名揭示，角色音檔下載後斷網重載與9句播放通過；無水平溢位或pageerror。PR check與正式站部署待完成，核對後直接接續下一批。音色、語氣與原作演技未逐句人耳驗收。

## 2026-10-14 T100 原神自動接續批次

煙緋、瑤瑤、夜蘭收錄可核對的編隊加入／元素技能／元素爆發短句，共9句VOICEVOX；原神93位277句、31筆待教材。固定版本語音表逐句核對voicelineId／標題／voicefile，繁中、讀音、解說及大意題齊備；既有教材與ER聲線配置逐欄保持。

T100：ヨォーヨ保留來源字面與畫面讀音；教材音聲把首段ヨォー作一個長音，指定よおよ，修正引擎拆成ヨ／オオヨ的多餘音節。後半句界與重音保留原查詢，不宣稱已比對原作演技。

完整typecheck、260 tests、lint與正式base path build通過；9個MP3讀音閘門、全檔解碼、非靜音訊號與encoder-only metadata通過，共168,588 bytes。375×667手機實測9句播放／作答／原文假名揭示，角色音檔下載後斷網重載與9句播放通過；無水平溢位或pageerror。PR check與正式站部署待完成，核對後直接接續下一批。音色、語氣與原作演技未逐句人耳驗收。

## 2026-10-14 T101 原神自動接續批次

宵宮、夢見月瑞希、雲堇收錄可核對的編隊加入／元素技能／元素爆發短句，共9句VOICEVOX；原神96位286句、28筆待教材。固定版本語音表逐句核對voicelineId／標題／voicefile，繁中、讀音、解說及大意題齊備；既有教材與ER聲線配置逐欄保持。

T101：此處命是命令，採めい，修正引擎的いのち；使用校正讀音查詢的兩個片語與下降位置，屬教材朗讀，不推定原配音。

完整typecheck、260 tests、lint與正式base path build通過；9個MP3讀音閘門、全檔解碼、非靜音訊號與encoder-only metadata通過，共182,412 bytes。375×667手機實測9句播放／作答／原文假名揭示，角色音檔下載後斷網重載與9句播放通過；無水平溢位或pageerror。PR check與正式站部署待完成，核對後進行完成總核對；可用來源角色已收齊，停止新增角色批次。音色、語氣與原作演技未逐句人耳驗收。

## 2026-10-14 T102 原神收錄完成總核對

固定來源124筆名冊中96位具可用短句的角色已全部收錄並上線，共286句；本輪T84–T101新增54位161句，28位缺短句來源者與迪盧克／胡桃技能喊聲保持待核對。原神63位女性用女聲、33位男性用男聲，八種既有VOICEVOX全數使用；ER91位246句與T83聲線配置保持。沒有尚待接續的具來源角色，停止本輪自動新增角色批次。

T101已部署：PR [#95](https://github.com/frobel0520/nihongo-lab/pull/95)、commit `069b9ce`，Actions [38497793122](https://github.com/frobel0520/nihongo-lab/actions/runs/38497793122)成功；正式站JS與9個MP3共182,412 bytes逐位元組一致，TLS驗證保留。

96份來源JSON雜湊與來源盤點一致，286句原文及語音識別逐句吻合，角色性別與聲線全部相符。新增全來源角色覆蓋及獨立性別fixture回歸檢查；完整typecheck、262 tests、lint與正式base path build通過。全遊戲532個使用中去重MP3共14,568,012 bytes全檔解碼、非靜音訊號及encoder-only metadata通過；各批手機播放／作答／假名揭示、下載後斷網重載與播放均已實測。人耳音色、語氣與原作讀法未逐句驗收。

來源缺口與原神96位配音表見[完整結果](genshin-completion.md)，ER選角與八種聲線方向見[配音規劃](game-voice-plan.md)。這是全可核對角色的少量短句教材，未宣稱整套語音庫、所有元素或造型全收。

## 2026-10-14 T103 動漫／遊戲通用聽解初版

T103通用動漫／遊戲聽解初版：第1階段新增三課完整原創教材，75個單字、6個文法重點、12句文法例句、18句男女聲對話、9題整段理解及9個句型練習，共105個VOICEVOX MP3（1,363,692 bytes）。首頁提供三課入口與六階段180課擴充路線，明確只有三課已完成；需要基本假名與N5概念。

完整聽完六句才開放作答，三題作答後揭示原文與解析；中止／失敗不算完整播放，離開區塊或頁面停止播放器。正常與0.8倍播放器慢速、逐句跟讀、本課35檔／三課105檔離線下載齊備。scene識別碼沿用版本3儲存與同步，計入首頁理解進度；題義或原文改版重設，音色／解說修訂保持。原有教材、遊戲資料、聲線與進度id逐欄保持。

完整typecheck、265 tests、lint、正式base path build通過；105檔讀音閘門、全檔解碼、非靜音及encoder-only metadata通過。375×667手機實測三課18句自然連續播放、9題作答、假名、單字／文法／句型頁、下載與進度保存；斷網重載後三課18句播放／作答／重練通過，換頁後原播放器停止，無水平溢位或pageerror。人耳語氣驗收與真實作品理解率未逐句評測。

OpenJLPT全階段38課對照：去重797詞，N5 670／674（99.4%）、N4 31詞，N5漢字84／84、文法81／81；71個既有文法點未標jlpt。數字是全站清單覆蓋，不是本初版的檢定成效，也不等同作品聽解能力。清單仍只存於被忽略的.cache。

## 2026-10-14 T104 課程入口與導覽整理

課程採「首頁 → 學習方向 → 單一課程」：首頁只列N5基礎復健、動漫／遊戲通用聽解、口語與動畫日文及遊戲角色語音四個入口，保留精簡的今日單字複習。各方向分別列25／3／10課與原有進度，移除重複課程；通用聽解的180課規劃收在該方向的說明。新增可重載的#/courses/<stage-id>路由，課內返回指向所屬方向，方向返回課程首頁；舊課程連結保持可用，未知方向回首頁。通用對話固定1倍速，移除速度選項及慢速提示。教材、音檔與進度儲存格式保持原樣。

完整typecheck、266 tests、lint與正式base path build通過。375×667手機驗證四入口、三個方向的課程數與重載、課內返回、直接連結與瀏覽器返回、固定1倍速六句自然連播及作答閘門，無水平溢位與pageerror。

## 2026-10-14 T105 通用聽解第4～6課

新增三課原創教材：04「今晚不行，那明天呢？」練邀請、婉拒、改約與分工；05「看不懂告示，請同伴幫忙」練可能形、部分能力、求助與改道；06「下雨就休息，沒下雨再登山」練たら／なら、否定條件與折返條件。新增75個單字條目、6個文法點、12句例句、18句男女聲對話、9題理解及9個句型練習，105個VOICEVOX MP3（1,689,420 bytes）。通用聽解現有六課，150個單字條目、12個文法點、36句對話、18題理解、210個音檔；六階段180課仍是規劃目標。每課音檔35檔，全部課程210檔；入口完成數改為依資料計算，固定1倍速與先聽後答流程保持。

完整typecheck、266 tests、lint、正式base path build通過。105檔讀音閘門、全檔解碼、非靜音及encoder-only metadata通過；三個單詞空く（あく，0）、明後日（あさって，2）、晴れる（はれる，2）修正引擎誤讀並加入覆寫，重音參考[Kanjium](https://github.com/mifunetoshiro/kanjium/blob/6f32ef33701e572f5485f85eda7ffb9333f8c24e/data/source_files/raw/accents.txt)，沿用audio-prosody.mjs的CC BY-SA 4.0標示。教材為原創自製音聲，未聲稱比對真人演技。

375×667手機實測新增三課18句自然連播、九題作答、假名、單字／文法／句型頁、每課35檔下載與210檔總數、進度保存、換頁停播；斷網重載後三課18句播放／作答／重練通過，無水平溢位或pageerror。原有課程及遊戲教材逐欄比對保持一致。

OpenJLPT全階段41課：去重836詞，N5 670／674（99.4%），N4 52詞；N5漢字84／84、文法81／81，71個既有文法點未標jlpt。數字是全站清單覆蓋，不代表新增三課的檢定成效或作品理解率；原始清單只在被忽略的.cache。

## 2026-10-14 T106 通用聽解第7～9課

新增三課原創教材：07「想買新劍，但先買藥」練願望、轉折與優先順序；08「只帶食物和水，重箱子留下」練義務、不必做、限定範圍與分工；09「能拍照，不能碰，也不能進」逐項辨認許可、禁止與活動範圍。每課25個單字、2個文法點、4句例句、6句男女聲對話、3題理解及3個句型練習；新增105個VOICEVOX MP3（1,648,524 bytes）。通用聽解現有九課，225個單字條目、18個文法點、54句對話、27題理解、315個音檔；六階段180課仍是規劃目標。維持固定1倍速、先聽後答、每課35檔／全部315檔下載與既有進度格式。

完整typecheck、266 tests、lint與正式base path build通過。105檔讀音閘門、解碼、非靜音及encoder-only metadata通過；空（から，2）與静か（しずか，1）修正引擎誤讀並加入重音覆寫，參考[Kanjium](https://github.com/mifunetoshiro/kanjium/blob/6f32ef33701e572f5485f85eda7ffb9333f8c24e/data/source_files/raw/accents.txt)，沿用audio-prosody.mjs的CC BY-SA 4.0標示。自製音聲未逐句比較真人演技或推定作品理解率。

375×667手機實測新增三課18句自然連播、九題作答、假名、單字／文法／句型頁、每課35檔下載與315檔總數、進度保存、換頁停播；斷網重載後三課18句播放／作答／重練通過，無水平溢位或pageerror。原有全部課程及遊戲教材逐欄比對保持一致。

OpenJLPT全階段44課：去重880詞，N5 670／674（99.4%），N4 70詞；N5漢字84／84、文法81／81，71個既有文法點未標jlpt。數字是全站清單覆蓋，不代表新增三課的檢定成效；原始清單只在被忽略的.cache。

## 2026-10-14 T107 前30課與練習分類

完成通用聽解第10～30課：比較、數量、時間順序、完成狀態、位置、失誤與準備狀態、授受協助、打算、轉折、試做、推測、轉述、句中問題、目的、移動方向、能力變化、限定、同時／列舉活動及綜合決策。21課各25個單字、2個文法點、4句例句、6句男女聲對話、3題理解及3個句型練習；新增735個VOICEVOX MP3（11,357,076 bytes）。前30課合計750個單字條目、60個文法點、120句文法例句、180句對話、90題理解、90個句型練習、1050個音檔，30／180課已完成。播放固定1倍速，清單以每十課一組整理，單課35檔與全部1050檔離線下載齊備。

單字卡、聽寫、跟讀共用N5、動漫遊戲通用、口語與動畫、遊戲角色四類入口，類別寫入網址並在換模式／重載時保留。前三類保留原卡片與音檔id；遊戲角色使用已收錄且audioReady的532句短台詞，台詞卡用獨立game-card id，聽寫沿用gameRecordId以共享已有角色句紀錄。未收錄或未有音檔者不納入練習。首頁複習數涵蓋四類卡片；切換類別重建練習流程並停止原播放器。

完整typecheck、268 tests、lint及正式base path build通過。735檔讀音閘門、全檔解碼、非靜音與encoder-only metadata通過；16個讀音／重音覆寫逐筆核對語義與片語，孤立詞參考[Kanjium](https://github.com/mifunetoshiro/kanjium/blob/6f32ef33701e572f5485f85eda7ffb9333f8c24e/data/source_files/raw/accents.txt)，其餘保留無需改讀的VOICEVOX句界與重音。覆寫沿用audio-prosody.mjs的CC BY-SA 4.0標示。自製音聲未逐句比較真人演技，不推定作品理解率。

375×667手機實測全部21課：126句自然連播、63題作答、假名、單字／文法／句型頁、每課35檔下載、1050檔總數、進度保存與換頁停播；斷網重載後全部21課126句播放／作答／重練通過。三個練習區×四類共12種組合的播放、作答、進度、模式／重載與跟讀換頁停播通過，類別離線重載與三組課程選取通過，無水平溢位或pageerror。原有全部課程物件及遊戲資料逐欄比對保持一致；進度儲存／同步版本保持3。

OpenJLPT全階段65課：去重1215詞，N5 670／674（99.4%），N4 144詞；N5漢字84／84、文法81／81，71個既有文法點未標jlpt。數字為全站清單覆蓋，不代表新增21課的檢定成效；原始清單只在被忽略的.cache。

## 2026-10-14 T109 原神其他來源補錄

愛諾、阿羅夏、哥倫比婭各補入編隊加入、元素技能與元素爆發一句，共9句原作短台詞及VOICEVOX自製朗讀。原神現有99位可學習角色、295句，124筆名冊仍有25筆待教材。文字逐句對照日文Wiki角色語音表，另依固定版本角色gender欄位安排男女聲；來源URL、頁面SHA-256、核對日期與技能按法註記保留於genshin-supplement.mjs。來源未提供原音編號或音檔名時，不編造voicelineId／voicefile。既有286句與ER教材保持，固定資料庫來源盤點也保持原值；畫面分開顯示Wiki補錄來源與固定資料庫筆數。

完整typecheck、268 tests、lint及正式base path build通過；9音檔（158,220 bytes）讀音閘門、解碼、非靜音與encoder-only metadata檢查通過。375×667手機實播、9題大意、假名、單角色下載與離線重載播放通過，沒有水平溢位或pageerror。教材音聲不是原配音，也未逐句驗收原作演技。

來源：[愛諾](https://wikiwiki.jp/genshinwiki/%E3%82%A2%E3%82%A4%E3%83%8E)、[阿羅夏](https://wikiwiki.jp/genshinwiki/%E3%82%A2%E3%83%AA%E3%83%A7%E3%83%BC%E3%82%B7%E3%83%A3)、[哥倫比婭](https://wikiwiki.jp/genshinwiki/%E3%82%B3%E3%83%AD%E3%83%B3%E3%83%93%E3%83%BC%E3%83%8A)；性別資料依角色名冊中對應的固定版本角色JSON。

## 2026-10-14 T110 原神其他來源補錄

塔利雅、杜林、愛可菲各補入編隊加入、元素技能與元素爆發一句，共9句原作短台詞及VOICEVOX自製朗讀。原神現有102位可學習角色、304句，124筆名冊仍有22筆待教材。文字逐句對照日文Wiki角色語音表，另依固定版本角色gender欄位安排男女聲；來源URL、頁面SHA-256、核對日期與技能按法註記保留於genshin-supplement.mjs。來源未提供原音編號或音檔名時，不編造voicelineId／voicefile。既有286句與ER教材保持，固定資料庫來源盤點也保持原值；畫面分開顯示Wiki補錄來源與固定資料庫筆數。

完整typecheck、268 tests、lint及正式base path build通過；9音檔（181,548 bytes）讀音閘門、解碼、非靜音與encoder-only metadata檢查通過。375×667手機實播、9題大意、假名、單角色下載與離線重載播放通過，沒有水平溢位或pageerror。教材音聲不是原配音，也未逐句驗收原作演技。

來源：[塔利雅](https://wikiwiki.jp/genshinwiki/%E3%83%80%E3%83%AA%E3%82%A2)、[杜林](https://wikiwiki.jp/genshinwiki/%E3%83%89%E3%82%A5%E3%83%AA%E3%83%B3)、[愛可菲](https://wikiwiki.jp/genshinwiki/%E3%82%A8%E3%82%B9%E3%82%B3%E3%83%95%E3%82%A3%E3%82%A8)；性別資料依角色名冊中對應的固定版本角色JSON。

## 2026-10-14 T111 原神其他來源補錄

菲林斯、伊安珊、伊法各補入編隊加入、元素技能與元素爆發一句，共9句原作短台詞及VOICEVOX自製朗讀。原神現有105位可學習角色、313句，124筆名冊仍有19筆待教材。文字逐句對照日文Wiki角色語音表，另依固定版本角色gender欄位安排男女聲；來源URL、頁面SHA-256、核對日期與技能按法註記保留於genshin-supplement.mjs。來源未提供原音編號或音檔名時，不編造voicelineId／voicefile。既有286句與ER教材保持，固定資料庫來源盤點也保持原值；畫面分開顯示Wiki補錄來源與固定資料庫筆數。

完整typecheck、268 tests、lint及正式base path build通過；9音檔（173,484 bytes）讀音閘門、解碼、非靜音與encoder-only metadata檢查通過。375×667手機實播、9題大意、假名、單角色下載與離線重載播放通過，沒有水平溢位或pageerror。教材音聲不是原配音，也未逐句驗收原作演技。

來源：[菲林斯](https://wikiwiki.jp/genshinwiki/%E3%83%95%E3%83%AA%E3%83%B3%E3%82%BA)、[伊安珊](https://wikiwiki.jp/genshinwiki/%E3%82%A4%E3%82%A2%E3%83%B3%E3%82%B5)、[伊法](https://wikiwiki.jp/genshinwiki/%E3%82%A4%E3%83%95%E3%82%A1)；性別資料依角色名冊中對應的固定版本角色JSON。

## 2026-10-14 T112 原神其他來源補錄

葉洛亞、伊涅芙、雅珂達各補入編隊加入、元素技能與元素爆發一句，共9句原作短台詞及VOICEVOX自製朗讀。原神現有108位可學習角色、322句，124筆名冊仍有16筆待教材。文字逐句對照日文Wiki角色語音表，另依固定版本角色gender欄位安排男女聲；來源URL、頁面SHA-256、核對日期與技能按法註記保留於genshin-supplement.mjs。來源未提供原音編號或音檔名時，不編造voicelineId／voicefile。既有286句與ER教材保持，固定資料庫來源盤點也保持原值；畫面分開顯示Wiki補錄來源與固定資料庫筆數。

完整typecheck、268 tests、lint及正式base path build通過；9音檔（173,772 bytes）讀音閘門、解碼、非靜音與encoder-only metadata檢查通過。375×667手機實播、9題大意、假名、單角色下載與離線重載播放通過，沒有水平溢位或pageerror。教材音聲不是原配音，也未逐句驗收原作演技。

來源：[葉洛亞](https://wikiwiki.jp/genshinwiki/%E3%82%A4%E3%83%AB%E3%83%BC%E3%82%AC)、[伊涅芙](https://wikiwiki.jp/genshinwiki/%E3%82%A4%E3%83%8D%E3%83%95%E3%82%A1)、[雅珂達](https://wikiwiki.jp/genshinwiki/%E3%83%A4%E3%83%95%E3%82%A9%E3%83%80)；性別資料依角色名冊中對應的固定版本角色JSON。

## 2026-10-14 T113 原神其他來源補錄

菈烏瑪、莉奈婭、洛恩各補入編隊加入、元素技能與元素爆發一句，共9句原作短台詞及VOICEVOX自製朗讀。原神現有111位可學習角色、331句，124筆名冊仍有13筆待教材。文字逐句對照日文Wiki角色語音表，另依固定版本角色gender欄位安排男女聲；來源URL、頁面SHA-256、核對日期與技能按法註記保留於genshin-supplement.mjs。來源未提供原音編號或音檔名時，不編造voicelineId／voicefile。既有286句與ER教材保持，固定資料庫來源盤點也保持原值；畫面分開顯示Wiki補錄來源與固定資料庫筆數。

完整typecheck、268 tests、lint及正式base path build通過；9音檔（197,388 bytes）讀音閘門、解碼、非靜音與encoder-only metadata檢查通過。375×667手機實播、9題大意、假名、單角色下載與離線重載播放通過，沒有水平溢位或pageerror。教材音聲不是原配音，也未逐句驗收原作演技。

來源：[菈烏瑪](https://wikiwiki.jp/genshinwiki/%E3%83%A9%E3%82%A6%E3%83%9E)、[莉奈婭](https://wikiwiki.jp/genshinwiki/%E3%83%AA%E3%83%B3%E3%83%8D%E3%82%A2)、[洛恩](https://wikiwiki.jp/genshinwiki/%E3%83%AD%E3%83%BC%E3%82%A8%E3%83%B3)；性別資料依角色名冊中對應的固定版本角色JSON。

## 2026-10-14 T114 原神其他來源補錄

奈芙爾、尼可、奧黛塔補入已核對的角色語音，共9句原作短台詞及VOICEVOX自製朗讀。原神現有114位可學習角色、340句，124筆名冊仍有10筆待教材。文字逐句對照日文Wiki角色語音表，另依固定版本角色gender欄位安排男女聲；來源URL、頁面SHA-256、核對日期與技能按法註記保留於genshin-supplement.mjs。來源未提供原音編號或音檔名時，不編造voicelineId／voicefile。既有286句與ER教材保持，固定資料庫來源盤點也保持原值；畫面分開顯示Wiki補錄來源與固定資料庫筆數。

完整typecheck、268 tests、lint及正式base path build通過；9音檔（174,348 bytes）讀音閘門、解碼、非靜音與encoder-only metadata檢查通過。375×667手機實播、9題大意、假名、單角色下載與離線重載播放通過，沒有水平溢位或pageerror。教材音聲不是原配音，也未逐句驗收原作演技。

限制：本批每類選取一句，並非原作完整語音庫。

來源：[奈芙爾](https://wikiwiki.jp/genshinwiki/%E3%83%8D%E3%83%95%E3%82%A7%E3%83%AB)、[尼可](https://wikiwiki.jp/genshinwiki/%E3%83%8B%E3%82%B3)、[奧黛塔](https://wikiwiki.jp/genshinwiki/%E3%82%AA%E3%83%87%E3%83%83%E3%83%88)；性別資料依角色名冊中對應的固定版本角色JSON。

## 2026-10-14 T115 原神其他來源補錄

布倫妮、桑多涅、絲柯克補入已核對的角色語音，共9句原作短台詞及VOICEVOX自製朗讀。原神現有117位可學習角色、349句，124筆名冊仍有7筆待教材。文字逐句對照日文Wiki角色語音表，另依固定版本角色gender欄位安排男女聲；來源URL、頁面SHA-256、核對日期與技能按法註記保留於genshin-supplement.mjs。來源未提供原音編號或音檔名時，不編造voicelineId／voicefile。既有286句與ER教材保持，固定資料庫來源盤點也保持原值；畫面分開顯示Wiki補錄來源與固定資料庫筆數。

完整typecheck、268 tests、lint及正式base path build通過；9音檔（195,948 bytes）讀音閘門、解碼、非靜音與encoder-only metadata檢查通過。375×667手機實播、9題大意、假名、單角色下載與離線重載播放通過，沒有水平溢位或pageerror。教材音聲不是原配音，也未逐句驗收原作演技。

限制：本批每類選取一句，並非原作完整語音庫。

來源：[布倫妮](https://wikiwiki.jp/genshinwiki/%E3%83%97%E3%83%AB%E3%83%BC%E3%83%8D)、[桑多涅](https://wikiwiki.jp/genshinwiki/%E3%82%B5%E3%83%B3%E3%83%89%E3%83%AD%E3%83%BC%E3%83%8D)、[絲柯克](https://wikiwiki.jp/genshinwiki/%E3%82%B9%E3%82%AB%E3%83%BC%E3%82%AF)；性別資料依角色名冊中對應的固定版本角色JSON。

## 2026-10-14 T116 原神其他來源補錄

瓦雷莎、法爾伽、茲白補入已核對的角色語音，共9句原作短台詞及VOICEVOX自製朗讀。原神現有120位可學習角色、358句，124筆名冊仍有4筆待教材。文字逐句對照日文Wiki角色語音表，另依固定版本角色gender欄位安排男女聲；來源URL、頁面SHA-256、核對日期與技能按法註記保留於genshin-supplement.mjs。來源未提供原音編號或音檔名時，不編造voicelineId／voicefile。既有286句與ER教材保持，固定資料庫來源盤點也保持原值；畫面分開顯示Wiki補錄來源與固定資料庫筆數。

完整typecheck、268 tests、lint及正式base path build通過；9音檔（172,044 bytes）讀音閘門、解碼、非靜音與encoder-only metadata檢查通過。375×667手機實播、9題大意、假名、單角色下載與離線重載播放通過，沒有水平溢位或pageerror。教材音聲不是原配音，也未逐句驗收原作演技。

限制：本批每類選取一句，並非原作完整語音庫。

來源：[瓦雷莎](https://wikiwiki.jp/genshinwiki/%E3%83%B4%E3%82%A1%E3%83%AC%E3%82%B5)、[法爾伽](https://wikiwiki.jp/genshinwiki/%E3%83%95%E3%82%A1%E3%83%AB%E3%82%AB)、[茲白](https://wikiwiki.jp/genshinwiki/%E5%85%B9%E7%99%BD)；性別資料依角色名冊中對應的固定版本角色JSON。

## 2026-10-14 T117 原神其他來源補錄

薇斯納、沃雅妮莎、奇偶·男性補入已核對的角色語音，共9句原作短台詞及VOICEVOX自製朗讀。原神現有123位可學習角色、367句，124筆名冊仍有1筆待教材。文字逐句對照社群角色語音表中的日文欄位，另依固定版本角色gender欄位安排男女聲；來源URL、頁面SHA-256、核對日期與技能按法註記保留於genshin-supplement.mjs。來源未提供原音編號或音檔名時，不編造voicelineId／voicefile。既有286句與ER教材保持，固定資料庫來源盤點也保持原值；畫面分開顯示Wiki補錄來源與固定資料庫筆數。

完整typecheck、268 tests、lint及正式base path build通過；9音檔（142,956 bytes）讀音閘門、解碼、非靜音與encoder-only metadata檢查通過。375×667手機實播、9題大意、假名、單角色下載與離線重載播放通過，沒有水平溢位或pageerror。教材音聲不是原配音，也未逐句驗收原作演技。

限制：本批奇偶僅收錄編隊加入，元素技能與元素爆發仍待可核對台詞；薇斯納及沃雅妮莎採BWIKI表內的日文欄位。

來源：[薇斯納](https://wiki.biligame.com/ys/%E8%96%87%E6%96%AF%E7%BA%B3%E8%AF%AD%E9%9F%B3)、[沃雅妮莎](https://wiki.biligame.com/ys/%E6%B2%83%E9%9B%85%E5%A6%AE%E8%8E%8E%E8%AF%AD%E9%9F%B3)、[奇偶·男性](https://wikiwiki.jp/genshinwiki/%E3%83%89%E3%83%BC%E3%83%AB)；性別資料依角色名冊中對應的固定版本角色JSON。

## 2026-10-14 T118 原神其他來源補錄

奇偶·女性、迪盧克、胡桃補入已核對的角色語音，共5句原作短台詞及VOICEVOX自製朗讀。原神現有124位可學習角色、372句，124筆名冊仍有0筆待教材。文字逐句對照社群角色語音表中的日文欄位，另依固定版本角色gender欄位安排男女聲；來源URL、頁面SHA-256、核對日期與技能按法註記保留於genshin-supplement.mjs。來源未提供原音編號或音檔名時，不編造voicelineId／voicefile。既有286句與ER教材保持，固定資料庫來源盤點也保持原值；畫面分開顯示Wiki補錄來源與固定資料庫筆數。

完整typecheck、268 tests、lint及正式base path build通過；5音檔（108,508 bytes）讀音閘門、解碼、非靜音與encoder-only metadata檢查通過。375×667手機實播、5題大意、假名、單角色下載與離線重載播放通過，沒有水平溢位或pageerror。教材音聲不是原配音，也未逐句驗收原作演技。

限制：奇偶女性僅收錄編隊加入。迪盧克與胡桃新增角色閒聊，元素技能的非語言喊聲仍不以猜測日文補錄。

來源：[奇偶·女性](https://wikiwiki.jp/genshinwiki/%E3%83%89%E3%83%BC%E3%83%AB)、[迪盧克](https://wikiwiki.jp/genshinwiki/%E3%83%87%E3%82%A3%E3%83%AB%E3%83%83%E3%82%AF)、[胡桃](https://wikiwiki.jp/genshinwiki/%E8%83%A1%E6%A1%83)；性別資料依角色名冊中對應的固定版本角色JSON。

## 2026-10-14 T108 通用聽解前60課

完成第31～60課的日常互動教材：介紹與稱呼、喜好與能力、協助與婉拒、請求與許可、道歉與致謝、聽不清時的修復、口信與邀約、改期與生活安排、遺失與誤會、傳聞與承諾、授受方向、感受、意見、選擇與綜合分工。新增30課各25個單字條目、2個文法點、4句例句、6句男女聲對話、3題理解與3個句型練習，共1050個VOICEVOX MP3（17,034,744 bytes）。前60課合計1500個單字條目、120個文法點、240句文法例句、360句對話、180題理解、180個句型練習與2100個音檔；60／180課完成，後120課仍為規劃。課程清單分成六組，每組十課；單字卡、聽寫及跟讀沿用四類入口，通用類別現有1500張單字卡與600句練習素材。播放固定1倍速，單課35檔與全部2100檔離線下載保持。

完整typecheck、268 tests、lint及正式base path build通過。1050檔通過讀音閘門、全檔解碼、非靜音與encoder-only metadata檢查。25個讀音／重音覆寫逐筆核對，修正描く、市場、辛い、行き、入れる、皆等文脈讀音；孤立詞參考[Kanjium](https://github.com/mifunetoshiro/kanjium/blob/6f32ef33701e572f5485f85eda7ffb9333f8c24e/data/source_files/raw/accents.txt)，句子保留不需改讀的VOICEVOX片語重音與停頓。覆寫沿用audio-prosody.mjs的CC BY-SA 4.0標示；自製音聲未逐句比對真人演技。

375×667手機實測全部30新課：180句自然連播、90題理解、假名、單字／文法／句型頁、單課35檔下載、2100檔總數、進度保存與換頁停播；斷網重載後全部30課180句播放、作答與重練通過。四類教材×三個練習區共12種組合的播放、作答、進度、模式／重載與換頁停播通過，六組課程選取與離線分類重載通過，無水平溢位或pageerror。原有全部課程物件與遊戲教材逐欄比對一致，進度儲存及同步版本仍為3。

OpenJLPT全階段95課：去重1503詞，N5 670／674（99.4%）、N4 187詞，N5漢字84／84、文法81／81；71個既有文法點未標jlpt。數字為全站清單覆蓋，單字條目含跨課複習，不表示1500個不同單字或真實作品理解率；原始清單僅保留於被忽略的.cache。

## 2026-10-14 T120 效能 Release Gate

量測分三層，判定一律走 `lib/perf-stats.mjs`（nearest-rank 百分位數；沒量到的指標記 `not_measured`，不算通過）。門檻集中在 `scripts/perf-budget.mjs`，修改門檻要記 Change Request，不為了讓結果通過而放寬。

| 層 | 指令 | 何時跑 | 指標與門檻 |
| --- | --- | --- | --- |
| Bundle 迴歸 | `npm run perf:bundle` | CI 每次 build 後 | 主程式 gzip ≤ 630,000 bytes、CSS gzip ≤ 5,800 bytes、precache ≤ 21,500,000 bytes（T120 基準加 20%） |
| 操作計算 | `npm run perf:logic` | 發布前在本機跑 | 首頁卡片統計、課程進度、排牌組、評分＋存檔、聽寫比對，各 p95 ≤ 50 ms（Node 桌機；約等於 4 倍慢手機 200 ms，INP「良好」上限） |
| 頁面載入 | `npm run perf:page` | 發布前在本機跑，正式站另跑一次 | 手機情境首頁與課程頁：冷啟動 LCP p95 ≤ 2,500 ms、暖啟動 LCP p95 ≤ 1,500 ms、冷啟動 TBT p95 ≤ 200 ms、單課音檔下載 p95 ≤ 5,000 ms |

頁面載入的量測方式：`scripts/perf-page.mjs` 以本機 Chrome 的 DevTools Protocol 驅動 headless Chrome，不需要額外套件或付費服務。手機情境為 375×667、DPR 2、CPU 4 倍降速、網路 150 ms RTT／1.6 Mbps 下載／750 Kbps 上傳（Lighthouse 行動版設定）。每個樣本用全新設定檔：冷啟動先清快取與 service worker，暖啟動等 service worker 接管後再載入。FCP、LCP、long task 由頁面內 PerformanceObserver 收集；TBT 是 FCP 之後 long task 超過 50 ms 部分的加總，量到載入後 3 秒。單課音檔下載以 4 條並行抓 `general-listening-31` 的 35 個音檔；降速只套用在頁面，所以這一步繞過 service worker。`longestTaskMs` 與 `contentReadyMs`（課程清單或聽解區塊出現的時間）只做診斷，不設門檻。

CI 只跑 bundle 檢查：大小每次量都一樣，而原神批次是「PR check 通過後直接部署」，CI 是唯一一定會執行的關卡。操作計算與頁面載入是時間量測，共用 runner 變異大，改在發布前本機跑；操作計算目前距門檻很遠（最慢 p95 9.8 ms／50 ms）。

限制：本機 preview 與正式站結果分開記錄，都不等於真實手機。樣本數 5 時 p95 就是最大值。iOS 與真實手機未量測。

## 2026-10-15 T121 縮小首次載入

`curriculum/lessons.mjs` 保持唯一教材入口：Node工具與既有測試保留同步stages／遊戲資料API，瀏覽器使用同一入口的curriculumSummary與非同步loadLesson、loadCategory、loadGameData、loadStageAudioPaths、loadAllAudioPaths。Vite的curriculum-chunks插件從該入口產生虛擬模組，完整課程逐課、四類練習資料、遊戲區及下載清單分成動態載入chunk；產物僅在build生成，不提交另一份教材或生成資產。首頁只讀教材索引；重複ID在傳輸時以字串池去重，還原後的ID、類別歸屬與重複筆數保持。

首頁到期／新卡仍涵蓋原本四類教材；各方向「已開始」及課程進度沿用原算法，由輕量ID索引計算。讀音標記只隨相關教材傳送，使用共享訂閱查表；文字、聲線、音檔網址與進度格式維持原值。沒有修改門檻、增加執行期套件或付費服務。

App以lazy／Suspense載入各頁面，資料請求按路由隔離，晚完成的舊請求不能覆蓋新課程。載入中顯示狀態；失敗顯示重新載入入口。payload loader共用成功結果，拒絕的promise不永久保留。T119的網址、返回鍵及進度版本3保持。

所有教材chunk與原有215個遊戲頭像維持precache，已安裝後仍可離線閱讀各方向；音檔仍需明確下載。通用聽解的離線面板第一次展開時才載入全部課程音檔清單及查快取，展開後保持掛載，收合不打斷下載。下載規則、Cache API名稱及Range播放沿用原實作。首次安裝仍須下載完整precache，並未把首次安裝背景傳輸量降為首頁傳輸量。

## 2026-10-15 T122 簡化效能檢查

保留 T121 首次載入的教材按需載入與離線支援。移除操作計算與頁面載入計時腳本、npm 指令及發布時間門檻，保留 CI 的 `perf:bundle` 與原有大小上限。前文時間門檻與量測結果為歷史資料，以本節為現行發布要求；未宣稱正式站時間門檻已通過。

## 2026-10-15 T123 review 收尾

parseRoute 對單一非空階段路徑解碼，不寫死 stage-0～3；App 以 curriculumSummary.stages 查找，未知階段維持首頁 fallback。分類 stageId 是目前四類教材的顯式映射，不把新階段自動併入任一類別。TRACKS 與配色有 fallback，無須為新增階段改動。來源盤點 CLI 既有 catch 以非零退出、完整讀取後才寫輸出；以隔離暫存目錄驗證缺檔／JSON／欄位失敗不覆寫。T122 的 bundle 大小上限維持，不恢復計時 Gate。

## 2026-10-15 T124 通用聽解61～70課

T124 由days/day86～day95經defineGeneralLesson接入lessons.mjs，新增課程沿用既有按需chunk與第七組標題「作品常見口語」。聲線由通用作者工具套用，不改舊課物件。curriculum-loading的557fec1黃金雜湊保持，僅以該版95課投影比較，將清單標題還原為該版60課標題；新課由既有loader、統計與密度契約覆蓋。現行設計已移除上一課／下一課按鈕（介面設計章）；本輪保持導覽，以清單中相鄰課程切換、App及瀏覽器返回驗證前後課流程。

## 2026-10-15 T125 通用聽解71～80課

新增days/day96～day105，沿用defineGeneralLesson與按需教材chunk。第八組沿用「作品常見口語」，不改分組算法；更新完成數與密度測試，另保存8e68cc0的105課及遊戲資料內容快照，既有557fec1雜湊保持。只新增本批音檔與必要的讀音／重音覆寫，不更動舊音檔、進度ID或runtime dependency。既有設計沒有上下課按鈕，以清單相鄰課、App及原生返回驗證前後課流程。

## 2026-10-15 T126 通用聽解81～90課

新增days/day106～day115，由defineGeneralLesson及lessons.mjs唯一入口接入既有按需chunk；第九組沿用「作品常見口語」。新增3db36e6的原115課／遊戲資料快照，保留557fec1與8e68cc0快照。bundle超標修正僅在build時：每個payload模組以字串表共用重複長字串，輸出仍為原default {data, notes}；沒有新runtime dependency或解碼協定。notesFor只傳含實際ruby的標記，純文字作者審閱紀錄仍在RUBY_NOTES與審閱Gate。回歸測試逐payload還原資料、保留真正ruby、驗證純文字fallback及特殊字串。按需邊界、SW precache範圍、下載快取與版本3不變；不放寬bundle上限，不恢復計時Gate。

## 2026-10-15 T127 通用聽解91～100課

新增days/day116～day125，沿用defineGeneralLesson／defineLesson及lessons.mjs唯一入口與按需chunk。第90課仍在作品常見口語，91～100第十組由既有路線函式推導為劇情理解；導覽沿用相鄰清單及返回。新增4df01d4的原125課／遊戲資料快照，原快照不變；不修改既有教材、進度ID、同步版本3、四類分類、固定1倍或下載契約，無runtime dependency。

## 2026-10-15 T128 通用聽解101～110課

days/day126～135沿用defineGeneralLesson／defineLesson，由lessons.mjs唯一入口匯入既有按需chunk。第十一組101～110沿用劇情理解；100→101清單相鄰導覽與返回保持。新增0dcbd8e原135課及遊戲資料黃金雜湊，舊快照不改。資料、進度ID、版本3、四類練習、固定1倍、舊網址及離線語意保持。聲線甲hau女聲、乙nemo2男聲，單字仍用既有八聲線；未驗證音檔維持audioReady:false。

T128建置大小修正：完整音檔就緒的首輪precache為21,545,173 bytes，超過原21,500,000上限；分析後在單一payload內共用重複欄位名稱，輸出仍是相同default {data, notes}，沒有新decoder／runtime dependency或按需邊界變更。全部payload實際載入等值、特殊鍵／跳脫字元回歸通過；最終precache21,431,408 bytes，未放寬門檻。

## 2026-10-15 T129 通用聽解111～120課

day136～145由既有defineGeneralLesson／defineLesson及lessons.mjs唯一入口接入按需chunk；第十二組111～120仍用劇情理解。新增be256e2原145課／遊戲資料快照，舊資料、進度ID、版本3、四類練習、1倍播放、返回及離線契約保持；音檔全量驗證前維持audioReady:false。

T129建置大小修正：配音待完成的首輪precache已達21,588,811 bytes，超過原21,500,000上限；建置時在單一payload內共用重複音檔目錄前綴，以一般字串串接還原相同網址。全部payload實際ESM載入等值及跳脫目錄／引用文字／特殊鍵測試通過，沒有decoder、runtime dependency、按需邊界或下載範圍變更。全部音檔就緒後最終precache21,121,414 bytes，原上限保持，不恢復T122計時Gate。

## 2026-10-16 T130 通用聽解121～130課

day146～155以defineGeneralLesson接入唯一lessons.mjs入口，沿用按需payload、原聲線配置與內容雜湊音檔路徑。第十三組121～130自既有路線函式取得第五階段「情境詞彙」；既有120課與所有進度ID、同步版本3、舊網址／返回、四類分類與下載語意保持。產製中保留audioReady:false，完整350檔檢查成功才解除。

驗證與部署結果見release-audit.md；機械音檔檢查與375寬模擬不視為逐句人工語音或完整真機QA。

## 2026-10-16 T131 通用聽解131～140課

day156～165由既有defineGeneralLesson／defineLesson接入lessons.mjs唯一入口，第十四組131～140沿用情境詞彙標題。獨立3690d07快照保護原165課／遊戲教材與進度ID；既有按需邊界、版本3、URL／返回、四類分類、固定1倍及離線下載語意保持。音檔全量檢查通過才解除audioReady:false。

驗證／部署範圍與限制見release-audit.md；人工語音、完整真機QA及71舊JLPT仍待辦，保留Android部分驗證。

T131建置大小核對：完整音檔就緒後首輪precache 21,551,055 bytes超過21,500,000上限；建置時以區塊內純量欄位的共用常數和物件展開減少重複文字，輸出仍為相同default資料，保留欄位順序與每筆獨立物件。全部payload實際ESM值／JSON欄位順序等值、跳脫／特殊鍵／無別名變更的回歸通過，無decoder、runtime dependency、按需邊界或下載範圍變更。最終precache 21,268,765 bytes，原上限保持。

## 2026-10-16 T132 第五階段收尾

教材透過既有作者工具與唯一入口新增day166～175，分組沿用第五階段標題；按需載入、固定1倍、同步v3、四類練習與離線契約保持。保留PR132的建置純量尾欄位共用及等值／欄位順序／特殊鍵／獨立物件測試，無按需邊界、離線下載範圍或runtime dependency變更。最終precache 21,474,718／21,500,000 bytes，原大小上限保持，不恢復T122計時Gate。

## 2026-10-16 T133 第六階段151～160課

依general-listening-v1事前安排，以指代層次、時間基準、婉拒範圍、省略主語、情緒後的請求、三方授受、引用來源、例外與自語修復逐步增加整合理解；160整合而非階段收尾。沿用25詞／2文法4例／6對話／3理解3練習／35音檔結構，新增day176～185，保留前150課含149修正與ID。原創情境提供所有作答依據，文法以有目的複習連接語用目標，不稱20個全新句型。建置共用packed索引與ID前綴，輸出值及鍵順序、按需載入、版本3、1倍、四類與離線契約保持，原bundle門檻不變；實測結果另記release-audit。161～180仍規劃，完成發布160後停止。

T133的共用決策除ID前綴與packed索引外，對完整配音後仍超出的4,812 bytes，以字串本身長度、出現次數、表格項及實際參照成本取代固定24-byte的字串共用下限。此為建置產碼決策，非發布大小上限變更；原unpack與每筆獨立物件／鍵順序保持，實際ESM往返測試及原bundle門檻驗證。


本批發布前299 tests、正式base build、原bundle門檻及完整手機尺寸／離線驗證通過，precache 21,474,089 bytes；全部結果與待辦見release-audit。

T133讀音顯示補修：SceneListening的目前題目與答案回顧都沿用RubyText，透過既有偏好與ruby-note-store顯示已登錄讀音，與文法／練習／解析一致。題目、作答狀態、scene ID、播放控制與離線API保持。React SSR回歸使用既有Vite與React開發工具載入真實元件，無新增dependency，不以原始碼字串比對代替渲染驗證。

讀音顯示補修版300 tests／typecheck／lint、正式build／原bundle及同一建置十課線上／離線覆驗通過，precache21,475,086 bytes；11段顯示核對及正式站／發布範圍分列於release-audit。


## 2026-10-18 T134 第六階段161～170課

新增day186～195原創教材，通用170／180課、5950音檔，171～180保持規劃。沿用defineGeneralLesson與唯一入口，甲hau女聲／乙nemo2男聲固定、單字八聲線；官方VOICEVOX與官方Nemo由產製端按style轉送，不修改產品依賴。350 jobs最終pathset與引用精確一致，讀音／ruby／文脈覆寫及MP3解碼／非靜音／metadata驗證後才解除待配音旗標。既有195課／遊戲與catalog獨立fixture、7835音檔及311覆寫保持。

serializeCurriculumPayload在JSON正規化後按有序Object.keys建立欄位結構索引，重複至少五次且至少四欄的形狀輸出局部一般ESM物件建構函式。參數依原Object.values順序傳入，回傳字面物件保留原鍵序，每次呼叫都是新物件；特殊own keys仍使用計算屬性。不同鍵序不共用形狀；不共用可變值、不引入新資料格式／decoder。PR132連續純量尾欄位展開仍保留；展開頭部明確呼叫encodeObjectLiteral，避免新的函式呼叫輸出被當成物件字面值截斷。全部payload實際ESM深度等值、JSON鍵序、特殊鍵、巢狀值修改獨立性及packed索引往返回歸保護此機制。原bundle上限、資產集合、載入與離線契約不變，實測大小見release-audit，不恢復T122時間Gate。

新漢字集合觸發兩段舊文字審閱，91課目標內前に補まえ、113課中文不標。實際React SSR重現目標直接輸出字串不顯示ruby，SceneListening改以既有RubyText顯示scene.goal，保留PR138題目及答案回顧的相同路徑與furigana偏好；舊原文／音檔／scene ID不變。延伸原SSR測試先紅後綠，91課加入375寬線上／真正離線顯示及完整聽解回歸。此為明確顯示修正，不是全站人工語文／語音驗收。


## 2026-10-19 T135 編寫前容量方案

保持JSON正規化及既有純量尾欄位／物件形狀共用；新增建置時字面ruby片段共用，以一般字串串接還原原值，不增加decoder。純量尾欄位記錄另共用頭部鍵布局，以局部函式接收原值與scalar tail，每次仍建立獨立物件並依原鍵序展開。尾索引在遞迴編碼頭部前保存，避免巢狀共享改變索引。特殊own keys、跳脫文字、巢狀可變值、鍵序與所有lesson／category／音檔清單ESM往返均有回歸。載入邊界、資產集合、四類、v3與離線契約保持，未放寬門檻或新增runtime dependency。

原170課正式build precache21,422,510；只做ruby片段共用降為21,382,472，結合尾記錄頭部共用後為21,135,107 bytes，減少287,403、原上限21,500,000及468URL保持。main gzip64,733、CSS gzip4,817。以最後十課密度作純記憶體估算，新增序列化ESM176,667 bytes，加50%緩衝265,001，預估可容納；這不是實際新課或最終驗收，完成後仍以正式build實測為準。304 tests／typecheck／lint及正式base build／perf:bundle通過。最初測試字串多餘跳脫使lint失敗，修正後整套check再通過；未降低規則。


T135目前教材盤點：180／180課、六階段各30課及1050音檔，合計6300通用音檔；最後十課與配音完成，驗證／發布結果依release-audit。當前完成介面須同時符合課數與音檔就緒，不連到181、不等同品質全部驗收；人工語音、完整真機與71舊JLPT及Android部分紀錄保持。


T135發布前最終驗證：306 tests／check、正式base build／原bundle／coverage，375寬十課完整線上與真斷網／350檔離線解碼、12入口與新180實練，以及91／149／156完整回歸通過。同170課容量修正減287,403 bytes，180課實測precache21,329,440／21,500,000（餘170,560）。180／180及6300音檔是內容交付，逐句人耳、完整真機與71舊JLPT仍待辦；正式站結果待發布後記錄，停止180不新增181。


## T136 明確下載保留策略

`lesson-audio-v5` 改作明確下載的保留快取，名稱不變，沒有搬移或先刪舊檔。頁面只接受完整200 audio/*回應，Cache API寫入失敗由下載結果逐檔回報，成功後再核對has。SW CacheFirst的downloadCachePolicy只接受完整音檔、保留RangeRequestsPlugin，cacheWillUpdate拒絕一般播放寫入；不再以播放metadata、固定筆數或檔案Date淘汰明確下載。故保留策略適用全教材而非以6300為上限；應用程式只在明確清快取時刪除，不能保證抵抗瀏覽器／OS清除。下載數由實際Cache API計算並提供重新檢查。回歸命令npm run test:pwa使用正式路徑build及隔離Chromium，規模與結果另記release-audit。


## T136 等待更新與分頁協調

VitePWA使用prompt、skipWaiting:false，安裝完成先等待，舊worker繼續供應其precache；啟用後沿用Workbox清除過時項目，不建立無限歷史版本快取。useSwUpdate監聽waiting／updatefound／controllerchange並處理首次註冊ready時序；回前景仍使用原10分鐘更新檢查節流。明確套用前提示尚未送出輸入不保留；等待worker收到NIHONGO_APPLY_UPDATE後列出scope內全部window client，只有已確認的來源頁獨自存在時才skipWaiting。其他頁存在、查詢失敗與逾時皆保留可重試流程。只有請求更新的頁在controllerchange時重載；若遇到非本頁請求的版本切換，只顯示重載復原提示，避免強制丟棄他頁輸入。

首次安裝可clientsClaim，不顯示「新版」提示。已在舊程式開啟的頁面不會追溯取得新hook，第一次升級需關閉所有本站頁面再開啟；新程式之後的更新可用等待提示，另一頁仍開著時不允許套用。新版已完整安裝時可在離線確認套用並以新precache重載。部分下載失敗的候選worker不接管，舊版保持可用；重試安裝成功才提示。舊下載快取名稱與已保存版本3進度不變。若瀏覽器／其他舊程式已意外切換控制者，明示完成作答後重載，不宣稱同文件import失敗一定能重試。

npm run test:pwa透過UI下載全8535檔、真實worker Range讀取與離線重載，另注入頁面Cache.put容量錯誤。npm run test:pwa:updates在repo外來源副本加入兩個測試用HTML發布標記，分別執行真正Vite／Workbox production build，再測等待、多分頁、離線、失敗安裝與合成進度；沒有改寫輸出worker或mock import。可另用npm run test:pwa:update -- --old-dist <舊build> --dist <修正版build> --next-dist <後續build>驗證歷史版本。本機額外以4ac67a3正式產物驗證第一次遷移；CI執行候選版本的連續兩次真實更新。playwright-core僅為devDependency，Chrome可由CHROME_PATH指定。

首次遷移的適用邊界：新worker尚未啟用時仍執行舊版快取策略，因此應先關閉全部本站頁面完成第一次升級，再進行大量離線下載；新策略不會追溯復原舊worker或瀏覽器此前已刪除的檔案。第一次升級後既有仍在v5的下載直接沿用，無破壞性遷移。

Pages回應會帶Vary: Accept-Encoding，原生媒體與fetch下載使用不同編碼協商值；公開MP3在HTTP解碼後同一URL對應同一內容，因此SW及下載has使用ignoreVary讀取既有完整音檔，仍保留200／audio/*驗證。此策略只用於公開靜態MP3下載路由，不用於同步或登入請求；不搬移、改寫音檔或刪除既有下載。失敗網路回應只清理髒資料，不刪除並行保存的有效下載；quota寫入失敗不先刪好檔。瀏覽器回歸的MP3伺服器使用與Pages相同Vary與audio/mp3標頭，下載後真正斷網重載並透過原生audio播放，避免只測fetch Range而漏掉媒體請求匹配。測試建置fixture的自有輸出先清空，兩版皆跑原perf:bundle，避免重跑時混入舊chunk。


## T137 選項呈現與ID邊界

lib/listening-choices.mjs只回傳{text,index}新陣列，不修改題目或正解。SceneListening掛載時用state保存每題獨立Fisher–Yates結果，點擊回傳原index，答案回顧仍用canonical q.options[q.answer]。不把亂數、呈現順序或attempt寫入v3進度；故洗牌本身不重設ID。重播不重抽，明確重練才重建state；LessonView以lesson.id作key，切課不能沿用前一課順序。新的掛載／重載會重新抽排，允許碰巧相同，不強制答案位置均勻。

相對位置用語的保守檢查或ListeningQuestion.optionOrder:'fixed'可保留原序；該屬性本次只擴充型別，未加到任何既有資料，也不擴大到其他題型。新增排序相依題時，作者需檢查提示及所有選項並明示fixed，不能依賴正則完整理解自然語言。回歸枚舉三選項六種排列，使用注入亂數，不以偶發統計作通過門檻；真實production build的375寬UI另核原索引評分、重播／進度重繪穩定、重練／重載及離線。

175第六句原文變更：舊dlg-76ee9ba503.mp3被內容雜湊新檔dlg-53fc255240.mp3取代。只移除公開目錄中已無引用舊檔，未刪除瀏覽器已有v5下載；新版課程會判定只缺一檔並補抓。舊版尚未下載的此句可能須接受更新後使用新版，不能承諾已刪除的公開舊URL仍在線可抓。scene ID尾碼73d0bddb5c／561f7cae64／5f8fd23cf9→6180f2ebb5／6e69671e38／59c38ad03d；舊紀錄留在v3，不計入新版完成。沒有快取搬移、同步格式更動或新runtime dependency。


## T138 題義修訂與歷史快照

僅156／165／180的understanding-3變更題幹、三選項及解析，原answer索引各維持1／2／0；不是以保留索引保留進度，既有sceneRecordId會因題幹／選項變更生成新ID：

| 課 | 舊scene尾碼 | 新scene尾碼 |
| --- | --- | --- |
| 156 | d152106d9c | ae5b2773bc |
| 165 | 0a88e2fa10 | 2a3e8ec8cb |
| 180 | badb35478e | e8cdd7d83b |

舊紀錄保留於版本3但不計新版完成，原已答對者各課從3／3成2／3，補答新題後恢復；其餘六個基本題與全站537個未改scene ID保持。只有第三題需要新版答對紀錄；介面仍須完整播放後依序作答三題，不新增跳題功能。課文／reading／ruby／聲線／音檔路徑與bytes、SRS及聽寫素材保持，無音檔下載遷移或補抓。第51與175的T137修訂完整保留。洗牌沿用既有state／原索引映射，未修改共用邏輯或新增runtime dependency。

新增5ee1dc2獨立快照凍結三課舊題目／對話原文與完整課程雜湊、其餘教材雜湊、全部catalog與537個未改scene ID。既有歷史黃金雜湊不更新，只在歷史比較時投影這三個明列核准題目回原值；新增範圍測試直接比較目前教材，防止投影掩蓋非核准欄位。以合成v3實驗驗證舊紀錄不計新題、基本題完成保持、重答與序列化後歷史紀錄仍在。npm run test:inference沿用真實production build／原生1倍播放，獨立資料測三課375寬線上／真正斷網重載、三題原索引評分／解析、重練洗牌、舊紀錄保留與每課35檔SHA；既有test:quality的51／175回歸繼續執行。


## T139 第二批題義修訂與歷史快照

158／166／177仍只改understanding-3，不新增手寫版本號。sceneRecordId依原始資料自動更新尾碼：158 `13763a44b0 → b4cecfcef5`、166 `450e17e8dc → baec13d674`、177 `4ba79375fa → 495f9b218b`。其他537個scene ID、STUDY_CATALOG與全部音檔保持。v3舊鍵留存，基本題保持完成，新題未作答；不能以舊完成率抵消題義變更。現有完整播放／依序三題流程不改。

獨立fixture curriculum-8c0c02f-inference.json取自改動前的唯一入口，保護三課完整雜湊、其他教材、catalog與537個ID；歷史測試僅把三個核准題目投影回舊值，不更新既有黃金雜湊。當前scope另直接驗證，避免投影掩蓋其他欄位。兩個新回歸在未修訂8c0c02f實際失敗，修訂後通過；合成舊9筆理解紀錄保留，新增3筆後序列化／解析共12筆。

npm run test:inference預設保留T138與T139共六課；--batch T139可只驗本批三課。各自用隔離合成進度、真實production build、原生1倍播放與真正斷網reload。增加播放中換頁後檢查原audio已pause，既有同次穩定／重練洗牌及原索引評分仍檢查。沒有改共用產品邏輯或新增runtime dependency。


## T140：JLPT metadata與驗證

保留jlpt?: string[]格式，一點可有多個參照ID，跨點可以是不同用法或有目的複習；單點內不得重複，coverage用集合計數。將舊「全課不得重複」測試改為單點陣列／合法slug／不得重複，新增合成多目標與跨點去重回歸；未變更coverage計算語意或擴充N3～N1。所有有效ID以釘選N5／N4快取核對，不把外部表納入fixture。

獨立curriculum-069b0f2-jlpt.json只含本專案核准40點的metadata與開始前雜湊／ID計數，保護整份教材、舊標記、catalog、summary及音檔路徑。歷史比較只還原明列41項，不更新既有黃金fixture；當前完整scope與各類進度ID另驗，避免用投影掩蓋無關變更。新增標記不影響音檔contentHash、sceneRecordId、grammarRecordId或其他catalog ID，無需同步遷移、重答或補下載。


## T149：審查措辭與對照欄位的相容界線

note與RUBY_NOTES是說明顯示，不參與音檔jp／voice內容定址；例句zh進入study catalog的顯示內容，但不進入單字／聽寫識別；jlpt是coverage metadata，不進入進度或音檔ID。通用理解題ID依scene文字／題義生成，本輪相關日文及所有題目不改，故不修訂ID。T149以獨立開始快照逐值保護其餘教材，明列歷史投影，不更新舊fixture黃金雜湊。

本次74中文顯示改動使完整catalog內容有差異，不能說catalog逐byte不變；所有既有catalog卡片／句子ID與其他練習ID均保持。教材payload／precache內容也改變，仍須按正常更新流程部署；音檔本身8535檔與路徑保持，不需補下載。同步版本3、唯一入口、固定1倍及離線保留策略不變。文法未標允許有來源的明列例外，不能硬配近似ID以滿足全數已標斷言。


## 2026-10-21 T151 單字卡配圖試版

T151實作：lib/vocab-illustrations.mjs以12個固定卡片ID加word／reading／zh校對，VocabIllustration只在答案區掛載、以卡片ID重建並在onError退化為無圖；本批12圖使用空alt，不在答案live region重複提供圖片名稱。224×168自製SVG共6327 bytes，56×42顯示；日文／讀音／翻譯各自置中、圖片在翻譯下方、來源分開留白，有圖與無圖使用相同文字中心線；手機SRS專用版面讓卡片獨立捲動、評分列在外，其他頁不變。沿用既有svg預快取glob，491 URL／21347454 bytes、不改上限或下載語意／runtime dependency；來源及手機驗證見vocab-illustration-pilot與release-audit。


## 2026-10-22 T152 單字卡30詞配圖擴充

T152在原vocab-illustrations陣列追加30筆精確映射及30張本地自製SVG；未改VocabIllustration、SrsView或CSS。42圖共22267 bytes、新增15940 bytes，521預快取URL／21368531 bytes，原21500000上限及glob不變。無新增runtime dependency。語義界線、資料ID、總覽及預覽見vocab-illustration-expansion；初次交付只到PR；其後依審查與使用者授權發布，最終驗證記於PR #158。


## 2026-10-22 T153 precache容量Change Request

使用者明確授權只將precache改為T120同一原始基準＋50%。原始17,913,219 bytes（2218f70、4c56bed及T120稽核記錄）；歷史21,500,000為人工約整，沒有通用取整公式。本次明定ceil(17,913,219×1.5)＝26,869,829 bytes，不是21,500,000×1.5或以目前產物重設基準。主程式gzip630,000、CSS5,800、統計範圍、離線契約及圖片規格保持。

當前產品precache21,368,531 bytes／521 URL，新預算餘5,501,298 bytes；只改設定、風險測試及文件，不增圖片或教材。330 tests／check、正式base build／perf通過，566個audio/以外產品檔逐SHA與6947ad1一致；最新CI仍待實際完成；合併部署與相同產品產物確認直接補於本PR，避免文件發布循環。

T120／T122及其他舊紀錄的21,500,000仍是當時上限；以本節26,869,829為現行precache預算，不恢復時間Gate。原始基準×1.5＝26,869,828.5，向上取整至整數byte，避免隱含人工約整。配置不進入產品bundle；相同產品逐檔確認後沿用T152正式站功能證據，最新CI／Pages結果另按實際記於本PR。


## 2026-10-22 T154 全站配圖盤點與12詞試作

scripts/vocab-illustration-inventory.mjs從lessons.mjs的四類loadCategory取Card，CSV與摘要僅為docs報告，不進產品／precache；保守簽章包含word／reading／zh，候選共用與實際映射分開，詞性提示及1758未分流群不冒充人工審義。12原創SVG7962 bytes，分支總54圖／30229 bytes，precache21,379,193／26,869,829、533 URL，餘5,490,636；main gzip65661／CSS5068不變，原glob／Cache API／離線下載保持。


T154發布補充：reviewer對9e9db8b複核通過，使用者授權發布本批12圖，累計54圖／54精確映射。もう一度為單一按鈕與回返箭頭，静か為安靜環境；既有中心線、56×42、空alt、教材／ID／音檔／排程與離線契約保持。修訂後12圖8210 bytes、總54圖30477 bytes，precache21,379,441／26,869,829，餘5,490,388；JS gzip65661／CSS5068及原門檻保持。前段7962／30229與未部署狀態屬試作歷史；合併與正式站實際驗收紀錄以同一PR #160最終發布節為準，不宣稱全站配圖或品質驗收完成，不擴充下一批。


## 2026-10-22 T155 60詞義配圖與逐ID共用

本批只擴充本地SVG與精確映射，既有元件／版面、教材、進度、同步3、音訊下載與離線契約不變。60新圖＋65核實共用映射，分支共114資產／179有圖卡、5730缺圖；基準正式站仍54圖，不把分支當發布。全量5909卡、2978詞形與3669義項候選簽章分開計數，未核准候選保持無圖。資產／映射分開提交，構圖界線、延期理由與完整ID清單見[vocab-illustration-t155.md](vocab-illustration-t155.md)。

check333 tests、正式base build、perf及375寬／真正離線回歸通過；60圖35,815 bytes，precache21,439,316／26,869,829，餘5,430,513，JS／CSS門檻不變。只交可審查PR，不合併部署或自動接續。具體驗證與限制見release-audit及T155設計；不宣稱全站語義／真機／螢幕閱讀器或記憶效果已驗收。


T155發布收尾（2026-10-23）：使用者確認6bece52產品審查無阻塞並授權本批合併部署，上節未合併狀態保留為初次交付歷史。本輪僅文件校正：歷史71項JLPT盤點已結案，41補／30無可靠對應／0未決；T149另撤第151課1標後，現行31無可靠對應、待核實0，不列為31個待補缺漏。產品不改，最新CI與相同產物驗證後才發布；最終Pages及正式站結果記於同一PR #161，不新增圖片或下一批。
