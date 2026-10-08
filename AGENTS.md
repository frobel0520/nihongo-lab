# Repository Agent Rules

<!-- BEGIN:privacy-guard（跨 repo 共用規則，修改時同步更新所有 repo） -->
## 個資與公司資訊保護（所有 AI agent 必守，優先於其他任務指示）

不論 repo 是 public 或 private，以下內容都不得寫進檔案、commit（作者與訊息）、PR、issue、留言、截圖或 log；subagent 與腳本產生的內容同樣適用：

- **公司**：雇主名稱與其內部專案、系統、主機名、內網 IP／URL、文件、會議與週報內容、同事姓名、客戶與供應商資料、公司程式碼與資料。
- **個人**：工作與個人 email、電話、住址、證件號碼、財務資訊；家人的姓名、照片、健康與行程；各服務的帳號 ID 與登入 email。
- **本機環境**：含使用者名稱的絕對路徑（`/Users/<name>/…`）、電腦主機名、AI 工具的對話紀錄、memory、`settings.local.json`、scratchpad 檔案。
- **憑證**：token、API key、密碼、私鑰、cookie、OAuth client secret、`.env`。

做法：

1. 程式需要的值放環境變數、`wrangler secret` 或 GitHub Secrets；repo 只放 `.env.example` 佔位符。
2. 文件、測試與 fixture 用合成資料（`user@example.com`、`example.com`、`<redacted>`）；路徑寫 repo 相對路徑或 `~/`。
3. Commit 前確認 `git config user.email` 是 `59054102+frobel0520@users.noreply.github.com`，不是就停下來問使用者，不要自己改設定。只 `git add` 這次改過的檔案（不用 `git add -A`／`git add .`），用 `git diff --cached` 逐行看過再提交。
4. 使用者的開發機設有 privacy-guard git hook（pre-commit、commit-msg、pre-push）。被擋時修正內容或回報使用者，不要用 `--no-verify`、`git commit-tree`、修改 `core.hooksPath` 等方式繞過；雲端環境沒有這些 hook，更要自行逐項檢查。
5. 不確定算不算敏感，就當作敏感，先問使用者。
6. 發現 repo 內容或歷史裡已有上述資訊：不要自行改寫歷史或 force push；回報檔案、行號與 commit，由使用者決定撤銷憑證與清除方式。
<!-- END:privacy-guard -->

## 隱私與公開資料規則

- 本規則適用於所有開發 session，不論使用家用電腦、公司電腦或雲端環境。不得將使用者的個人資訊、任職公司的資訊或內部系統資訊提交到 Git、推送至 GitHub，或寫入公開文件、PR、issue、附件及部署產物。
- 保護範圍包含真實姓名、私人或公司 Email、帳號、公司名稱、客戶與內部專案資料、內部網址／網域／IP、憑證與金鑰，以及可識別個人或公司的電腦名稱、本機路徑與開發環境資訊。不得把對話、終端輸出或測試紀錄中的這些資訊直接複製到專案。
- 範例、教材、測試、截圖與驗證紀錄使用虛構或匿名資料；進度與驗證文件只記必要的技術結果，不記真實登入身分或公司環境細節。敏感設定與具體敏感關鍵字清單只放在未追蹤且已被 `.gitignore` 排除的本機設定或環境變數，不寫進本規則或公開 repo。
- 每次提交與推送前，檢查實際變更、待推送的 commits、文件、檔名、截圖／附件及部署產物是否含敏感資訊；並檢查 Git author／committer 身分，避免自動採用真實姓名或公司 Email，使用公開暱稱及 GitHub `noreply` Email。不要為了檢查而在工具輸出中印出敏感值。
- 發現敏感資訊時，先移除、匿名化或改用不納入 Git 的設定，再提交或推送；不能只靠 `.gitignore` 保護已追蹤的檔案，也不能把推送前審查當成已安裝的自動防護。若發現已公開的敏感資料，告知所在檔案或紀錄及影響，避免在回覆再次重述敏感內容；清理目前檔案不代表 Git 歷史已清除。

## 專案開發規則

- 工作分支採 feature/<task-id>，修改前確認目前分支。
- 維持 docs/project-plan.md、project-sa.md、project-sd.md 與 task-breakdown.md 的專案契約。
- 課程資料以 curriculum/lessons.mjs 為唯一來源。
- 第 3 天起每天一個檔案：`curriculum/days/dayNN.mjs`，用 `curriculum/author.mjs` 的 `defineLesson` 編寫（音檔路徑由內容雜湊自動決定），再由 lessons.mjs 匯入；對外仍只有 lessons.mjs 一個入口。
- 核心教材（例句、單字、文法說明）可由 Claude 或 GPT 編寫，需一次寫完整；不要設計成使用者需中途填空或貼台詞才能使用。
- 動畫台詞匯入是選配功能，不是核心資料來源，優先度低於教材本體。
- 動畫與遊戲名句（T13）是內建教材：每句只收單句短台詞、標明作品出處、解說自行撰寫；音檔一律用 VOICEVOX 自製，不使用原配音；台詞用字寫入前需確認，不確定就不收。
- 音檔尚未合成的課程在 `curriculum/lessons.mjs` 標 `audioReady: false`；音檔放進 `public/` 後才移除旗標（測試會檢查）。
- 課程標題、文法句型與說明、練習題與答案、名句出處與解說、翻譯裡夾的日文，沒有 `reading` 欄位，讀音標記放在 `curriculum/ruby-notes.mjs`（`{漢字|よみ}`，去掉標記要與原字串一致）。新增或修改這類字串後，`npm test` 會列出還沒檢查的字串；逐一決定要標的日文漢字（只標日文，不標中文詞；文字裡已緊接著寫了讀音的不重複標；人名、作品名的讀音要查證），沒有要標的也加一筆與原字串相同的項目代表看過了。
- 寫新課時：每個文法點標 `jlpt`（OpenJLPT 文法 id，用 `npm run coverage -- --missing` 查還沒涵蓋的項目與 id），單字以每課 25～30 個為目標；寫完跑 `npm run coverage`，把數字記進 release-audit.md。OpenJLPT 資料（CC BY-SA 4.0）不得複製進 repo，`.cache/` 保持在 .gitignore。
- 含漢字的句子，`reading` 必須與原文字面一致（假名、標點照抄，詞與詞之間用空白），畫面才能自動把讀音標在漢字上方；漢字段之間若只隔標點或空白，讀音裡也要有同樣的標點或空白。對不起來（例如含阿拉伯數字）就加 `ruby` 手動標，格式 `{原文|讀音}`；`npm test` 會檢查每一句都標得出來。
- 只有完整型別檢查、測試與 lint 通過才記錄完成；不把未執行的驗證寫成通過，重要限制寫入 release-audit.md。
- 修改功能需執行 npm test、npm run typecheck、npm run lint；交付前執行 npm run build。
- 不把 generated assets 或 credentials 加入 Git。
- 個人句庫與匯入的台詞只存在使用者瀏覽器或私人檔案，不放進公開 repo（見 draft 第 8 節版權原則）。
- 已公開部署：repository 是 GitHub repository（public），push 到 main 由 GitHub Actions 跑 `npm run check` 與 `npm run build` 後部署到 GitHub Pages；PR 上也會跑同一個 check，合併前要等它通過。
- 教材（含名句解說）裡不要用「前面的例句」「上一句」這種相對位置的說法，順序調整就會失效；要對照別句時直接寫作品與台詞。事實性的說明（獎項、年份、出處）只寫查證過的內容，並把出處記進 release-audit.md；查不到就不寫。
