# 歌曲閱讀器（T49～T51）

2026-10-05 建立。這份文件是歌曲閱讀器的需求變更、分析、設計與任務契約；驗證結果記在 [release-audit.md](release-audit.md)。

## Change Request（CR-2026-10-05）

- **使用者需求**：新增「歌曲學習」區，用歌詞當教材（第一批兩首），每句要有意思、文法、漢字上方的讀音。
- **限制**：歌詞受著作權保護，公開 repo、測試、文件與內建教材都不能收錄歌詞或逐句翻譯。
- **使用者決定（2026-10-05，三選一的第 1 案）**：做成選配的「歌詞閱讀器」——使用者自己從正版歌詞來源複製、貼進 App，歌詞只存在自己的瀏覽器；App 自動標讀音、拆詞、查詞、標出文法並連到教材對應的課；每句的意思由使用者自己寫筆記，卡住的單句可以在對話裡問。
- **對原範圍的影響**：project-plan.md 原本寫「不包含：動畫台詞匯入（.srt/.ass 或手動貼上）」。動畫台詞匯入仍不做；歌詞以「本機貼上的選配功能」提供。核心教材仍是內建、不依賴使用者貼上內容。
- **不做**：整句自動翻譯（要付費 AI 或伺服器）、原曲音檔或 TTS 唱歌、歌詞上雲端（不進同步 Worker、不進 KV）、在 repo／測試／文件放任何歌詞。測試用的句子都是自行撰寫的原創例句。

## 使用流程

1. 底部選單「歌曲」→ 歌曲清單 →「新增歌曲」：輸入歌名（必填）、歌手（選填），貼上歌詞（一行一句，空行代表段落）。
2. 存檔後在背景分析（第一次會下載斷詞字典，畫面顯示進度），分析完每句漢字上方顯示讀音（跟設定頁的讀音開關連動）。
3. 點某個詞：看讀音、原形、詞性；學過的單字顯示教材的中文意思與課次，其他詞顯示 JMdict 的英文解釋；讀音標錯可以改（只改這首歌的這個詞）。
4. 每句下方列出偵測到的文法（例如「〜ている」），點了跳到教材對應的課；教材還沒教的文法顯示一行說明。
5. 每句可以寫自己的筆記（意思、心得）。歌曲可以編輯、刪除（二次確認）、匯出成 JSON 檔備份或搬到另一台裝置、再匯入。

## 資料與儲存

- `localStorage` key `nihongo-lab:songs:v1`，內容 `{ version: 1, songs: Song[] }`。跟學習進度分開存、分開匯出，不進跨裝置同步。
- `Song = { id, title, artist, createdAt, updatedAt, lines: SongLine[], analysis: { analyzer, analyzedAt } | null }`。
- `SongLine = { text, note, tokens: Token[] | null }`：`text` 是貼上的原文（空字串代表段落空行），`tokens` 為 null 表示還沒分析。
- `Token = { s, r?, b?, p, pd?, cf?, o? }`：表層形、讀音（平假名，只在含漢字時存）、原形、詞性、詞性細分類、活用形、使用者改過的讀音。
- 存檔壞掉時原文備份到 `nihongo-lab:songs:v1:backup` 並提示，不蓋掉；寫入失敗（容量滿）明確提示。分析結果跟著歌曲存，之後開歌曲頁不需要再載入字典。

## 分析與資產

- **斷詞**：`@patdx/kuromoji`（kuromoji.js 的 ESM 分支，Apache-2.0）+ IPADIC 字典（約 17MB，gzip），在 Web Worker 裡建立斷詞器與分析，主畫面不凍結。
- **字典檔不進 Git**：`scripts/prepare-song-assets.mjs` 在 `npm run dev`／`npm run build` 之前，把字典從 `node_modules` 複製到 `public/song-assets/`（.gitignore），並從 `.cache/jmdict/` 產生英文釋義索引。字典回應可能已被伺服器解壓或仍是 gzip，載入器看檔頭判斷，必要時用 `DecompressionStream` 解壓。
- **英文釋義**：[jmdict-simplified](https://github.com/scriptin/jmdict-simplified) 的 `jmdict-eng-common`（固定版本，約 1.4MB 壓縮檔），建置時下載到 `.cache/jmdict/`（CI 以 actions/cache 保存），轉成「寫法 → 前幾個英文釋義」的精簡索引。JMdict 屬 EDRDG，CC BY-SA 4.0，畫面與文件附署名；不把字典資料提交進 repo（與 OpenJLPT 的做法一致）。
- **離線**：字典與釋義索引不放進 precache（太大），改用 runtime CacheFirst 快取 `song-assets-v1`；第一次分析時下載，之後離線也能分析與查詞。設定頁「清除快取」會一併清掉，之後重新下載。
- **讀音**：每個詞用 kuromoji 的讀音（片假名轉平假名），再用既有的 `alignFurigana` 對出送假名，只把讀音標在漢字上。歌詞常有特殊讀法，所以每個詞都能手動改讀音。
- **文法偵測**：`lib/song-grammar.mjs` 的規則依詞性、原形、活用形比對（例如動詞連用形＋て＋いる → 〜ている），每條規則對應 OpenJLPT 文法 id；教材有這個 id 就連到那一課，沒有就顯示自行撰寫的一行說明。規則只涵蓋常見句型，偵測不到不代表沒有文法。

## 效能門檻（Release Gate）

| 指標 | 情境 | 門檻 |
|---|---|---|
| 開啟已分析的歌曲頁 | 40 行、已存分析結果，不載入字典 | 畫面出現 ≤ 1 秒 |
| 字典下載量 | 第一次分析 | ≤ 20MB（之後由快取供應） |
| 建立斷詞器 | 字典在快取、Chromium 桌面 | ≤ 5 秒 |
| 建立斷詞器 | 字典在快取、手機尺寸＋4 倍 CPU 減速 | ≤ 15 秒 |
| 分析一首歌 | 斷詞器已建立、40 行 | ≤ 1 秒 |
| 主執行緒 | 建立斷詞器與分析期間 | 單一長任務 ≤ 200ms（分析在 Worker 裡） |

量測記錄版本、環境、冷／暖狀態、樣本數與 p50／p95。Android 真機量測另列，未量測就標「未量測」，不算通過。

## 任務契約

### T49 歌曲區骨架與本機歌詞

- **Goal**：可以新增、編輯、刪除歌曲，貼上歌詞逐行顯示，每句寫筆記，匯出／匯入。
- **Input contract**：使用者貼上的純文字；`nihongo-lab:songs:v1` 的存檔。
- **Output artifact**：`lib/songs.mjs`、`lib/songs-store.mjs`（純邏輯）、`app/views/SongsView.tsx`、`SongView`、路由 `#/songs`、`#/song/<id>`、底部選單「歌曲」。
- **depends_on**：無。
- **Out of scope**：斷詞、讀音、查詞、文法（T50／T51）。
- **Acceptance checks**：解析／序列化／損毀備份／匯入合併的單元測試；手機 375px 與 320px 新增、編輯、刪除、筆記、匯出匯入可用且無橫向溢出；存檔滿時有提示。
- **Fixture**：自行撰寫的原創日文句子（不使用任何歌詞）。
- **Evidence path**：release-audit.md「T49」。

### T50 自動讀音（斷詞）

- **Goal**：存檔後在 Worker 分析歌詞，漢字上方顯示讀音，可改單詞讀音。
- **Input contract**：T49 的 `Song`；`public/song-assets/kuromoji/*.dat.gz`。
- **Output artifact**：`scripts/prepare-song-assets.mjs`、`lib/song-tokens.mjs`（kuromoji 結果 → Token、Token → 讀音標記）、`app/lib/songAnalyzer.ts` + Worker、runtime 快取設定。
- **depends_on**：T49。
- **Out of scope**：查詞內容與文法（T51）。
- **Acceptance checks**：Token 轉換與讀音對齊的單元測試（用 kuromoji 在 Node 實際斷詞原創句子）；正式路徑 build 產出字典資產；效能表的前五項量測；斷網後已快取字典仍可分析。
- **Fixture**：原創句子；字典由套件提供。
- **Evidence path**：release-audit.md「T50」。

### T51 查詞與文法標記

- **Goal**：點詞看讀音、原形、詞性、教材中文或 JMdict 英文；每句列出偵測到的文法並連到教材。
- **Input contract**：T50 的 Token；`curriculum/lessons.mjs` 的單字與文法 `jlpt` id；JMdict 精簡索引。
- **Output artifact**：`lib/song-grammar.mjs`、`lib/song-lookup.mjs`、`scripts/prepare-song-assets.mjs` 的 JMdict 段、詞卡面板、文法標籤、署名。
- **depends_on**：T50。
- **Out of scope**：整句翻譯、把歌詞單字加進單字卡（之後再議）。
- **Acceptance checks**：每條文法規則至少一個命中與一個不命中的測試（原創句子經 kuromoji 實際斷詞）；查詞優先教材、其次 JMdict、都沒有時明說查不到；署名可見。
- **Fixture**：原創句子；JMdict 固定版本。
- **Evidence path**：release-audit.md「T51」。
