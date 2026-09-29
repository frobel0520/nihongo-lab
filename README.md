# 日本語 Lab

Michael 個人使用的日文學習網站。目標是通過 JLPT N1，近期目標是不看字幕聽懂動畫與遊戲日文配音。

繁體中文介面，React + TypeScript + Vite，local-first（進度存瀏覽器，離線可用）。核心教材由 Claude 直接撰寫完整內容；動畫台詞匯入是之後才考慮的選配功能。

## 現況

剛完成專案骨架（T01），尚未有教材內容。詳細進度見 [progress.md](progress.md)。

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
