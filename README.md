# 日本語 Lab

Michael 個人使用的日文學習網站。目標是通過 JLPT N1，近期目標是不看字幕聽懂動畫與遊戲日文配音。

繁體中文介面，React + TypeScript + Vite，local-first（教材與音檔隨 repo 走，離線可用）。核心教材由 Claude 直接撰寫完整內容；動畫台詞匯入是之後才考慮的選配功能。目標是做成可安裝的 PWA，SRS 進度跨裝置同步，參考 [Family](https://github.com/frobel0520/Family) 的模式但不需要它的多人登入與推播。

## 現況

- Repository：[github.com/frobel0520/nihongo-lab](https://github.com/frobel0520/nihongo-lab)（public）。
- 專案骨架（T01）與第 0 階段第 1 天教材（です／は／も，9 單字、9 種 VOICEVOX 語音、對話、練習）已完成。
- PWA 骨架（T09）完成：可安裝 manifest、service worker、離線音檔快取；UI 沿用 [learning-atlas](https://github.com/frobel0520/learning-atlas) 設計系統。手機真機安裝驗收待做。
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

## 文件

- [專案計畫](docs/project-plan.md)
- [系統分析](docs/project-sa.md)
- [系統設計](docs/project-sd.md)
- [任務拆解](docs/task-breakdown.md)
- [驗收紀錄](docs/release-audit.md)
- [專案進度](progress.md)

## 開發習慣參考

沿用 [typescript-lab](https://github.com/frobel0520/typescript-lab) 的 SDLC 模式：project-plan → SA → SD → 任務拆解 → 可重複驗收；`npm run check` 為統一檢查入口。
