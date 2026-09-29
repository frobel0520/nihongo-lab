# 專案進度

截至 2026-09-29，`nihongo-lab` 已上線：**https://frobel0520.github.io/nihongo-lab/**

Repository：[github.com/frobel0520/nihongo-lab](https://github.com/frobel0520/nihongo-lab)（public）。GitHub Actions 在 push 到 main 時自動跑 `npm run check` + `npm run build` 並部署到 GitHub Pages；本次部署（commit `d7b8b29`）已驗證成功：網站 HTTP 200、service worker 在正式網址上 `activated`、音檔可正常存取、無 console 錯誤。

目標是做成可安裝的應用程式，參考 [Family](https://github.com/frobel0520/Family) 的 PWA + Cloudflare Worker 模式，但不需要它的多人登入與推播；只同步 SRS 進度，教材本身隨 repo 走。

## 已完成

- **專案骨架**：Vite + React + TypeScript，`npm run check` 為統一檢查入口，SDLC 文件（project-plan／sa／sd／task-breakdown／release-audit）齊全。
- **第 0 階段第 1 天教材**：です／は／も 文法（4 個文法點）、9 單字、6 句對話、5 題練習，全部帶語音。路線圖定案：對照《大家的日本語》第一冊 25 課 + 平行推進的 N5 漢字進度（約 100-103 字）。
- **語音產製工具鏈**：VOICEVOX（本機）+ `scripts/synthesize.mjs`（呼叫引擎 API、ffmpeg 轉 96kbps mp3）+ `scripts/build-audio-jobs.mjs`（從課程資料自動產生合成清單）。語音陣容定案 9 個角色，第 1 天 23 個音檔（532KB）已產生並隨 repo 一起走，其他裝置 `git pull` 就有，不用裝 VOICEVOX。
- **PWA 骨架**：`vite-plugin-pwa` 產生 service worker（precache 18 項）與 manifest，圖示用 `@vite-pwa/assets-generator` 從自製 SVG 產生；`/audio/*.mp3` 另設 CacheFirst 離線快取。
- **UI**：套用 [learning-atlas](https://github.com/frobel0520/learning-atlas) 的設計系統（卡片排版、CSS 變數色票、Noto Sans TC + IBM Plex Mono），跟 Michael 其他網站視覺一致；固定亮色模式，不隨系統深色設定切換。
- **部署**：GitHub Pages（GitHub Actions 自動化），網址見上方。

## 下一步

1. 手機上實際安裝測試（開網址 → 加入主畫面 → 全螢幕開啟 → 離線行為），確認 PWA 真的「像個 app」。
2. 排出第 0 階段第 2 天以後的教材，逐天累積到 25 課。
3. 規劃並實作 SRS 進度跨裝置同步（Cloudflare Worker，T10）。
4. 依 task-breakdown.md 依序做聽寫練習、跟讀播放、SRS 單字卡功能。
