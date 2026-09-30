# 任務拆解

| ID | 工作 | 驗收 |
|---|---|---|
| T01 | 專案骨架 | Vite + React + TS 可跑、`npm run check` 通過、SDLC 文件齊全 — 完成 |
| T02 | 第 0 階段教材（N5 復健，對應大家的日本語 L1～L25） | 每天 1～2 課文法、單字、對話，內容完整可讀 — 第 1 天（L1）完成，L2～L25 待排 |
| T02b | N5 漢字進度（約 100～103 字） | 與 T02 平行推進，看過全部 N5 常用漢字的讀音與意思 |
| T03 | 教材資料結構與 curriculum 內容 | lessons.mjs 填入課程，音檔已產生並接上畫面 — 資料結構與第 1 天完成 |
| T04 | 聽寫練習功能 | 播放、輸入、比對答案、標錯處 — 完成（第 1 天 14 句），真機鍵盤 QA 未做 |
| T05 | 跟讀與慢速播放 | 調速、循環 |
| T06 | SRS 單字卡 | 間隔重複排程、進度存在瀏覽器 — 完成（第 1 天 9 張），真機 QA 未做 |
| T07 | 口語轉換表 | 教科書日文對照動畫口語（縮約、語氣詞） |
| T08 | 驗證與交付 | tests、typecheck、lint、build 通過；GitHub Pages 部署 — 完成，見下方 |
| T09 | PWA 安裝化 | manifest、icon、service worker，可安裝、離線讀已快取課程 — 完成，Android 真機安裝與播放已驗證 |
| T10 | SRS 進度跨裝置同步 | Cloudflare Worker 同步端點，離線寫本機、上線後補同步，衝突不悄悄覆蓋 |

各工作完成證據見 [release-audit.md](release-audit.md)。這份清單不代替驗證結果。

Repository：[github.com/frobel0520/nihongo-lab](https://github.com/frobel0520/nihongo-lab)（public，2026-09-29 建立）。上線網址：<https://frobel0520.github.io/nihongo-lab/>。
