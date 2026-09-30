# かなの日本語

個人使用的日文學習網站。目標是通過 JLPT N1，近期目標是不看字幕聽懂動畫與遊戲日文配音。

繁體中文介面，React + TypeScript + Vite，local-first（教材與音檔隨 repo 走；教材文字離線可讀，音檔要先在課程頁下載才能離線播放）。核心教材由 Claude 直接撰寫完整內容；動畫台詞匯入是之後才考慮的選配功能。目標是做成可安裝的 PWA，SRS 進度跨裝置同步，參考另一個既有的 PWA 專案的模式但不需要它的多人登入與推播。

## 現況

- 已上線：GitHub Pages 正式站（GitHub Actions 自動部署）。
- Repository：GitHub repository（public）。
- 專案骨架（T01）與第 0 階段第 1 天教材（です／は／も，9 單字、9 種 VOICEVOX 語音、對話、練習）已完成；第 2 天（これ／それ／あれ + の，30 單字、6 個文法點、對話、練習）文字與音檔都完成。
- PWA（T09）完成並在 Android 手機真機驗證成功：可安裝、開啟、音檔正常播放；UI 沿用既有學習網站的設計系統，固定亮色模式。
- SRS 單字卡（T06）、聽寫（T04）、跟讀（T05，循環跟讀，不含調速）已於 2026-09-30 上線。
- 第 2 階段新增口語轉換表（T07）與動畫、遊戲名句 57 句（T13，35 部作品，動畫與電影 31、遊戲 4），音檔都已產生（T23）。
- SRS 跨裝置同步（T10）已規劃，尚未實作。

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

- [專案計畫](docs/project-plan.md)
- [系統分析](docs/project-sa.md)
- [系統設計](docs/project-sd.md)
- [任務拆解](docs/task-breakdown.md)
- [驗收紀錄](docs/release-audit.md)
- [專案進度](progress.md)

## 開發習慣參考

沿用既有的 SDLC 模式：project-plan → SA → SD → 任務拆解 → 可重複驗收；`npm run check` 為統一檢查入口。
