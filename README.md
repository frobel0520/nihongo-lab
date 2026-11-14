# かなの日本語

個人使用的日文學習網站。目標是通過 JLPT N1，近期目標是不看字幕聽懂動畫與遊戲日文配音。

繁體中文介面，React + TypeScript + Vite。提供內建教材、SRS 單字卡、聽寫與跟讀，可安裝為 PWA；教材文字支援離線，音檔須先下載。進度以瀏覽器保存為主，另提供選配的 Google 登入與跨裝置同步。

## 現況與入口

- [正式網站](https://nihongo-sync.curio-lab.workers.dev/nihongo-lab/)由同步 Worker 同源提供網頁與 API；舊 GitHub Pages 網址是遷移引導。
- 現行課程、角色與音檔數量、來源涵蓋、使用者排除裁定及待辦，只在[主進度](progress.md)維護，不由舊批次紀錄推算。
- 驗收範圍與限制見[發布稽核](docs/release-audit.md)；既有局部手機驗證不代表現行版完整真機或登入／同步端到端通過。
- 開發接手先讀[AGENTS.md](AGENTS.md)，再讀主進度；原神舊候選數字保存在[歷史收錄紀錄](docs/genshin-completion.md)，不另當成工作清單。

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

- 動畫聽力特訓八課核心教材已由T54／T55補齊；長片段與跨句理解仍為後續範圍，見 [課程設計](docs/anime-listening-course.md)。

- [專案計畫](docs/project-plan.md)
- [系統分析](docs/project-sa.md)
- [系統設計](docs/project-sd.md)
- [任務拆解](docs/task-breakdown.md)
- [遊戲教材配音與角色配置](docs/game-voice-plan.md)
- [驗收紀錄](docs/release-audit.md)
- [專案進度](progress.md)

## 開發習慣參考

沿用既有的 SDLC 模式：project-plan → SA → SD → 任務拆解 → 可重複驗收；`npm run check` 為統一檢查入口。

### 歷史：2026-10-03 聲線與快取改版

以下保留當時紀錄，不表示現在每次更新都要重下載全部音檔；現行離線資產以 App 顯示的待下載／更新項目為準。

配音角色（2026-10-03）：保留春日部つむぎ、雨晴はう、小夜/SAYO、猫使ビィ、東北ずん子，動畫／遊戲男性台詞使用青山龍星、黒沢冴白與 VOICEVOX Nemo 男声2。此次音檔快取升為 v5，更新後請重新下載離線音檔；學習進度保留。


2026-10-03 T48：使用者依試聽檔名定案動畫名句三男聲為青山龍星、黒沢冴白、VOICEVOX Nemo 男声2。原有教材與女性角色配音維持，32 句男聲名句重製，同一角色固定聲線；教材與學習進度 URL 保留，離線音檔快取升至 lesson-audio-v5，需重新下載。三男聲已採用的名句數為 28／12／20。機械檢查與使用者選角不代表全句人工抑揚驗收，驗證見 release-audit.md。
