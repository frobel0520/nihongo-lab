# Repository Agent Rules

- 工作分支採 feature/<task-id>，修改前確認目前分支。
- 維持 docs/project-plan.md、project-sa.md、project-sd.md 與 task-breakdown.md 的專案契約。
- 課程資料以 curriculum/lessons.mjs 為唯一來源。
- 核心教材（例句、單字、文法說明）由 Claude 一次寫完整；不要設計成使用者需中途填空或貼台詞才能使用。
- 動畫台詞匯入是選配功能，不是核心資料來源，優先度低於教材本體。
- 動畫名句（T13）是內建教材：每句只收單句短台詞、標明作品出處、解說自行撰寫；音檔一律用 VOICEVOX 自製，不使用原配音；台詞用字寫入前需確認，不確定就不收。
- 音檔尚未合成的課程在 `curriculum/lessons.mjs` 標 `audioReady: false`；音檔放進 `public/` 後才移除旗標（測試會檢查）。
- 只有完整型別檢查、測試與 lint 通過才記錄完成；不把未執行的驗證寫成通過，重要限制寫入 release-audit.md。
- 修改功能需執行 npm test、npm run typecheck、npm run lint；交付前執行 npm run build。
- 不把 generated assets 或 credentials 加入 Git。
- 個人句庫與匯入的台詞只存在使用者瀏覽器或私人檔案，不放進公開 repo（見 draft 第 8 節版權原則）。
- 尚未決定公開部署與 repository 位置；GitHub Pages 相關設定待第 0 階段教材完成後再補。
