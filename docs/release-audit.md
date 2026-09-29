# Release audit — 0.1.0

尚未發布。目前完成 T01 專案骨架與語音產製工具鏈準備，見 [task-breakdown.md](task-breakdown.md)。

## 已執行

- `npm install`：0 vulnerabilities。
- `npm run check`：typecheck、2 項測試、lint 全通過。
- `npm run dev` 起本機伺服器並用瀏覽器開啟首頁：四個學習階段正常渲染，無 console 錯誤。
- `npm run build`：純靜態產物建置通過（dist/ 3 個檔案）。
- 2026-09-29：`scripts/synthesize.mjs` 對本機 VOICEVOX 引擎（DirectML 版）實測一句（ずんだもん），輸出 96kbps mp3（50KB），ffmpeg 轉檔正常，`npm run check` 加入新檔後仍全過。

## 驗證邊界

尚未部署到任何公開網址；行動版與鍵盤操作 QA 未做（目前頁面無互動元件）。語音合成目前只驗證單句、單一角色；9 個角色陣容尚未逐一試聽確認音質。
