# かなの日本語

個人使用的日文學習網站。目標是通過 JLPT N1，近期目標是不看字幕聽懂動畫與遊戲日文配音。

繁體中文介面，React + TypeScript + Vite，local-first（教材與音檔隨 repo 走；教材文字離線可讀，音檔要先在課程頁下載才能離線播放）。核心教材可由 Claude 或 GPT 撰寫完整內容；動畫台詞匯入是之後才考慮的選配功能。目標是做成可安裝的 PWA，SRS 進度跨裝置同步，參考另一個既有的 PWA 專案的模式但不需要它的多人登入與推播。

## 現況

- 已上線：GitHub Pages 正式站（GitHub Actions 自動部署）。
- Repository：GitHub repository（public）。
- 專案骨架（T01）與第 0 階段 25 課教材（T02，主題對應《大家的日本語》第一冊第 1～25 課，單字、文法點、對話、練習與 VOICEVOX 語音都完成）已完成；N5 單字 670／674、漢字 84／84、文法 81／81。
- PWA（T09）完成並在 Android 手機真機驗證成功：可安裝、開啟、音檔正常播放；UI 在 T27 改成手機 App 風格（底部圖示選單、課程清單首頁、單字卡左右滑換卡），固定亮色模式。
- SRS 單字卡（T06）、聽寫（T04）、跟讀（T05，循環跟讀，不含調速）已於 2026-09-30 上線。
- 第 2 階段有口語轉換表（T07）、動畫與遊戲名句 100 句（T13、T43、T44，音檔都已產生）與 8 堂動畫聽力特訓（73 次引用／68 句不同台詞；T37，先盲聽再作答；錯誤選項依台詞而異，2026-10-03 修正）。
- SRS 跨裝置同步（T10）：進度格式與合併規則、匯出／匯入（T28）、同步 Worker（T29，`worker/`）、前端 Google 登入與自動同步（T30）都已完成；Android 真機尚未驗證，正式站只驗證過 Worker 的拒絕路徑，Google 登入端到端沒測。

詳細進度見 [progress.md](progress.md)。

## 開發

Node.js >= 22.13。

```sh
npm install
npm run dev
```

```sh
npm run check
npm run build
```

教材涵蓋率（對照 OpenJLPT 的 N5 單字／漢字／文法；第一次執行會下載資料到 `.cache/`，需要網路）：

```sh
npm run coverage
```

## 文件

- 動畫聽力特訓首批：第 2 階段新增八課，沿用有出處的短台詞，先盲聽、選大意，再看原文與解說。完整武器／技能詞彙與新增文法教材尚待完成，見 [課程設計](docs/anime-listening-course.md)。

- [專案計畫](docs/project-plan.md)
- [系統分析](docs/project-sa.md)
- [系統設計](docs/project-sd.md)
- [任務拆解](docs/task-breakdown.md)
- [驗收紀錄](docs/release-audit.md)
- [專案進度](progress.md)

## 開發習慣參考

沿用既有的 SDLC 模式：project-plan → SA → SD → 任務拆解 → 可重複驗收；`npm run check` 為統一檢查入口。

配音角色（2026-10-03）：保留春日部つむぎ、雨晴はう、小夜/SAYO、猫使ビィ、東北ずん子，動畫／遊戲男性台詞加入玄野武宏與青山龍星。此次音檔快取升為 v4，更新後請重新下載離線音檔；學習進度保留。
