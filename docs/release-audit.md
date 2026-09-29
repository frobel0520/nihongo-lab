# Release audit — 0.1.0

尚未發布。目前僅完成 T01 專案骨架，見 [task-breakdown.md](task-breakdown.md)。

## 已執行

- `npm install`：0 vulnerabilities。
- `npm run check`：typecheck、2 項測試、lint 全通過。
- `npm run dev` 起本機伺服器並用瀏覽器開啟首頁：四個學習階段正常渲染，無 console 錯誤。
- `npm run build`：純靜態產物建置通過（dist/ 3 個檔案）。

## 驗證邊界

尚未部署到任何公開網址；行動版與鍵盤操作 QA 未做（目前頁面無互動元件）。
