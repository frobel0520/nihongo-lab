# Release audit — 0.1.0

尚未發布。目前完成 T01 專案骨架與語音產製工具鏈準備，見 [task-breakdown.md](task-breakdown.md)。

## 已執行

- `npm install`：0 vulnerabilities。
- `npm run check`：typecheck、2 項測試、lint 全通過。
- `npm run dev` 起本機伺服器並用瀏覽器開啟首頁：四個學習階段正常渲染，無 console 錯誤。
- `npm run build`：純靜態產物建置通過（dist/ 3 個檔案）。
- 2026-09-29：`scripts/synthesize.mjs` 對本機 VOICEVOX 引擎（DirectML 版）實測一句（ずんだもん），輸出 96kbps mp3（50KB），ffmpeg 轉檔正常，`npm run check` 加入新檔後仍全過。
- 2026-09-29：第 0 階段第 1 天教材（です／は／も、9 單字、4 個文法點、6 句對話、5 題練習）寫入 `curriculum/lessons.mjs`，`scripts/build-audio-jobs.mjs` 產生 23 筆合成清單，`scripts/synthesize.mjs --batch` 全部成功，音檔共 532KB 存在 `public/audio/stage-0/day1/`。App.tsx 接上畫面渲染，瀏覽器驗證：頁面文字、練習題「看答案」互動、音檔 HTTP 200 且 content-type 正確，均正常，無 console 錯誤。`npm run check` 全過（新增 `jsx-a11y/media-has-caption` 例外，因每個 `<audio>` 旁都已有對應文字逐字稿）。

## 驗證邊界

尚未部署到任何公開網址；行動版與鍵盤操作 QA 未做。9 個角色只各自驗證音檔可播放，未逐一人耳確認音質是否符合預期語氣。第 0 階段只做了第 1 天，後續天數與聽寫、跟讀、SRS 功能都還沒開始。
