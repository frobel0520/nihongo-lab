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

<!-- BEGIN:shared-standards（跨 repo 共用規則，修改時同步更新所有 repo） -->
## 共用規範（Harbor）

- 開發規範：frobel0520/harbor 的 `standards/DevelopmentStandards.md`。
- 部署：frobel0520/harbor 的 `standards/DeploymentHandbook.md`（範本在 `standards/deployment-templates/`）。
- 讀取方式：本機 session 讀本機的 Harbor clone；雲端 session 沒有 Harbor 時，自行以唯讀方式把 `frobel0520/harbor` 加入 session 再讀（Claude Code 用 add_repo；Codex 雲端沒有這個功能，開 session 時要選 Harbor）。仍讀不到時，先照本檔規則進行並告知使用者。
- 本 repo 的規則或現況與上述文件衝突時，以權威文件為準；不符合的地方列為本 repo 待辦。repo 既有慣例（例如分支命名）依開發規範的規定保留。
- 專案級別：產品級
<!-- END:shared-standards -->

## 隱私與公開資料規則

- 本規則適用於所有開發 session，不論使用家用電腦、公司電腦或雲端環境。不得將使用者的個人資訊、任職公司的資訊或內部系統資訊提交到 Git、推送至 GitHub，或寫入公開文件、PR、issue、附件及部署產物。
- 保護範圍包含真實姓名、私人或公司 Email、帳號、公司名稱、客戶與內部專案資料、內部網址／網域／IP、憑證與金鑰，以及可識別個人或公司的電腦名稱、本機路徑與開發環境資訊。不得把對話、終端輸出或測試紀錄中的這些資訊直接複製到專案。
- 範例、教材、測試、截圖與驗證紀錄使用虛構或匿名資料；進度與驗證文件只記必要的技術結果，不記真實登入身分或公司環境細節。敏感設定與具體敏感關鍵字清單只放在未追蹤且已被 `.gitignore` 排除的本機設定或環境變數，不寫進本規則或公開 repo。
- 每次提交與推送前，檢查實際變更、待推送的 commits、文件、檔名、截圖／附件及部署產物是否含敏感資訊；並檢查 Git author／committer 身分，避免自動採用真實姓名或公司 Email，使用公開暱稱及 GitHub `noreply` Email。不要為了檢查而在工具輸出中印出敏感值。
- 發現敏感資訊時，先移除、匿名化或改用不納入 Git 的設定，再提交或推送；不能只靠 `.gitignore` 保護已追蹤的檔案，也不能把推送前審查當成已安裝的自動防護。若發現已公開的敏感資料，告知所在檔案或紀錄及影響，避免在回覆再次重述敏感內容；清理目前檔案不代表 Git 歷史已清除。

## 專案開發規則

- 工作分支採 feature/<task-id>，修改前確認目前分支。
- 原神長任務依目前授權的可驗收大批次進行，不再固定每批3位。每批先核對最新main、未合併PR及既有缺漏清單，避免重做；來源未知與未完成分列。建立分支前先 `git fetch origin main`，正式站驗證綁定實際發布版本。
- 維持 docs/project-plan.md、project-sa.md、project-sd.md 與 task-breakdown.md 的專案契約。
- 課程資料以 curriculum/lessons.mjs 為唯一來源。
- 原神教材分批擴充，來源、讀音、VOICEVOX、配圖與隱私逐項自查；只有使用者明確要求本次review時才交reviewer，不把批次完成當作自動審查觸發。main合併／發布依Harbor權威規範與使用者本次明確授權；未獲本批發布授權時停在Ready，不把審查放行當成授權。
- 原神長任務每批完成並核對部署後，直接開始下一批；自動接續先確認遠端main與進度，避免重複及併發。完成所有可核對角色後停止自動化；來源缺失者明確保留待收錄原因。
- 第 3 天起每天一個檔案：`curriculum/days/dayNN.mjs`，用 `curriculum/author.mjs` 的 `defineLesson` 編寫（音檔路徑由內容雜湊自動決定），再由 lessons.mjs 匯入；對外仍只有 lessons.mjs 一個入口。
- 核心教材（例句、單字、文法說明）可由 Claude 或 GPT 編寫，需一次寫完整；不要設計成使用者需中途填空或貼台詞才能使用。
- 動畫台詞匯入是選配功能，不是核心資料來源，優先度低於教材本體。
- 動畫與遊戲名句（T13）是內建教材：每句只收單句短台詞、標明作品出處、解說自行撰寫；音檔一律用 VOICEVOX 自製，不使用原配音；台詞用字寫入前需確認，不確定就不收。
- 音檔尚未合成的課程在 `curriculum/lessons.mjs` 標 `audioReady: false`；音檔放進 `public/` 後才移除旗標（測試會檢查）。
- 課程標題、文法句型與說明、練習題與答案、名句出處與解說、翻譯裡夾的日文，沒有 `reading` 欄位，讀音標記放在 `curriculum/ruby-notes.mjs`（`{漢字|よみ}`，去掉標記要與原字串一致）。新增或修改這類字串後，`npm test` 會列出還沒檢查的字串；逐一決定要標的日文漢字（只標日文，不標中文詞；文字裡已緊接著寫了讀音的不重複標；人名、作品名的讀音要查證），沒有要標的也加一筆與原字串相同的項目代表看過了。
- 寫新課時：每個文法點標 `jlpt`（OpenJLPT 文法 id，用 `npm run coverage -- --missing` 查還沒涵蓋的項目與 id），單字以每課 25～30 個為目標；寫完跑 `npm run coverage`，把數字記進 release-audit.md。OpenJLPT 資料（CC BY-SA 4.0）不得複製進 repo，`.cache/` 保持在 .gitignore。
- 含漢字的句子，`reading` 必須與原文字面一致（假名、標點照抄，詞與詞之間用空白），畫面才能自動把讀音標在漢字上方；漢字段之間若只隔標點或空白，讀音裡也要有同樣的標點或空白。對不起來（例如含阿拉伯數字）就加 `ruby` 手動標，格式 `{原文|讀音}`；`npm test` 會檢查每一句都標得出來。
- 產品與教材依CI分流完成完整型別／單元測試／lint、build及適用回歸後才記錄完成；純文件依docs關卡驗證，不重建或部署未變的產品。不把未執行的Windows UI、人耳或正式效能寫成通過，重要限制保留於release-audit。
- 修改功能需執行 npm test、npm run typecheck、npm run lint；交付前執行 npm run build。
- 不把 generated assets 或 credentials 加入 Git。
- 個人句庫與匯入的台詞只存在使用者瀏覽器或私人檔案，不放進公開 repo（見 draft 第 8 節版權原則）。
- 已公開部署：repository 是 GitHub repository（public），push 到 main 由 GitHub Actions 跑 `npm run check` 與 `npm run build` 後部署到同步 Worker（網頁與 API 同源，見 docs/project-sd.md 的 SEC-P1-20261031 變更紀錄），舊 GitHub Pages 網址只放引導頁；PR 上也會跑同一個 check，合併前要等它通過。
- 教材（含名句解說）裡不要用「前面的例句」「上一句」這種相對位置的說法，順序調整就會失效；要對照別句時直接寫作品與台詞。事實性的說明（獎項、年份、出處）只寫查證過的內容，並把出處記進 release-audit.md；查不到就不寫。


## 工作流與跨 session 接手

先讀預設分支的progress.md，再依其中版本與證據位置切到工作分支。不要用工具memory、本機路徑或Harbor存檔代替主進度；內部報告／截圖仍留Private，公開進度只放必要狀態與定位。

CI範圍與證據沿用規則見docs/project-sd.md的「CI驗證分流（#199）」。worker負責新增內容完整自查；使用者明確啟動review時，reviewer才獨立審內容與疑點。工程證據依有效範圍沿用；版本、工具、依賴、設定或外部狀態改變時先判斷效力。未知範圍升級full，不自行放寬關卡。純教材追加不重寫未改動的Plan／SA／SD，不為補同一份敘述另建多份摘要；每批更新實際變更的來源覆蓋、Progress及必要驗收紀錄。

素材README等public檔案屬發布資產，應併入教材PR準備；發布後只補必要的進度／驗收紀錄，避免把public變更誤稱純文件。正式驗收詳細結果沿單一紀錄與Private證據定位，不反覆抄寫相同限制。


## 交接文件長度

依 Harbor 開發規範 4.5，交接文件要讓接手的人或 agent 讀得完。上限由 `scripts/ci/docs-check.mjs` 的 `HANDOFF_LIMITS` 在 docs 關卡和 `npm test` 檢查，超過就失敗。

- `progress.md` 只放現況、最近批次、規則摘要、待辦與限制。上限 120 行、10,000 字，每個 `## ` 段落 2,000 字；最近批次只留 3 批，每批約 5 行內。
- 批次發布後，在「最近批次」更新該批，不另外保留候選段落；超過 3 批的舊批次直接移除，由 Git 歷史保存。
- `docs/release-audit.md` 每批一段，加在「通用限制」與分隔標記之間，每段 1,500 字內，只寫範圍、結果與證據位置（PR、CI、Private 批次 ID）。逐檔 SHA、測試輸出等細節放 Private 存檔。分隔標記以下的舊紀錄保留原文，不受檢查。
- 每批都相同的限制只寫在 release-audit 的「通用限制」，各批只寫有變動的部分。
- 用完整句子書寫，少用「人耳0」「SR」這類只有當事人看得懂的縮寫；數字只寫一次，其他地方用連結。

## Reviewer 啟動規則（僅適用 nihongo-lab）

- 只有使用者明確要求對本次工作做review／審查時，才啟動、指派或交接任務給reviewer。平時由master與worker協作（兩者可以是同一個session），worker完成開發、自查及適用驗證，不固定每批送reviewer。
- 批次完成、PR轉Ready、CI成功、舊prompt、舊待辦或舊排程，都不代表新的review授權；前一批曾要求review也不延伸到下一批。未要求review時不額外等待reviewer放行。
- Worker自查、來源／讀音／配圖正確性、必要CI、資安與適用發布驗收照常；合併main、部署及設定變更仍依既有授權規則。不把自查寫成獨立reviewer審查。
- 已完成的審查與放行證據保持有效，歷史紀錄不改寫；使用者要求review後，再明確指定當次範圍、版本及疑點。
- 這是本專案的協作例外，不同步到Harbor共用規範、全域設定或其他repo；其他專案維持原規則。
