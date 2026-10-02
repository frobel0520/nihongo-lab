# Repository Agent Rules

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
