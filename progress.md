# 專案進度

截至 2026-09-29，`nihongo-lab` 完成專案骨架、第 0 階段第 1 天教材、public repository、PWA 骨架。

Repository：[github.com/frobel0520/nihongo-lab](https://github.com/frobel0520/nihongo-lab)（public）。目標是做成可安裝的應用程式，參考 [Family](https://github.com/frobel0520/Family) 的 PWA + Cloudflare Worker 模式，但不需要它的多人登入與推播；只同步 SRS 進度，教材本身隨 repo 走。

語音陣容定案 9 個 VOICEVOX 角色，本機語音產製工具鏈就緒。第 1 天教材（です／は／も 文法、9 單字、對話、練習）寫入 `curriculum/lessons.mjs`，23 個音檔已產生。第 0 階段路線圖定案：對照大家的日本語第一冊 25 課 + 平行推進的 N5 漢字進度（約 100-103 字）。

PWA 骨架完成：`vite-plugin-pwa` 產生 service worker（precache 18 項）與 manifest，圖示用 `@vite-pwa/assets-generator` 從自製 SVG 產生；音檔另設 CacheFirst 離線快取。UI 改套用 [learning-atlas](https://github.com/frobel0520/learning-atlas) 的設計系統（卡片排版、CSS 變數色票、自動深色模式），跟 Michael 其他網站視覺一致。`npm run check`、`npm run build` 全過，瀏覽器驗證 service worker 註冊正常。

下一步：

1. 手機上實際安裝測試（加入主畫面、全螢幕、離線開啟）。
2. 排出第 0 階段第 2 天以後的教材，逐天累積到 25 課。
3. 規劃並實作 SRS 進度跨裝置同步（Cloudflare Worker，T10）。
4. 依 task-breakdown.md 依序做聽寫練習、跟讀播放、SRS 單字卡功能。
