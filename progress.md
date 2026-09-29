# 專案進度

截至 2026-09-29，`nihongo-lab` 剛完成 T01 專案骨架：Vite + React + TypeScript 可執行，`npm run check`（typecheck、test、lint）通過，SDLC 文件（project-plan、project-sa、project-sd、task-breakdown、release-audit）齊全。

curriculum/lessons.mjs 目前只有四個階段的空殼（`lessons: []`），尚未填入教材內容。網站畫面只列出階段名稱，還沒有實際課程、聽寫、跟讀或 SRS 功能。

下一步：

1. 產出第 0 階段（N5 復健）第一天的完整教材範例，確認內容長相與份量。
2. 定案教材資料結構，填入 curriculum/lessons.mjs 並補測試。
3. 依 task-breakdown.md 依序做聽寫練習、跟讀播放、SRS 單字卡。
