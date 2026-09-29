# 專案進度

截至 2026-09-29，`nihongo-lab` 完成專案骨架（T01）與第 0 階段第 1 天教材（T02、T03 第一批）。

語音陣容定案 9 個 VOICEVOX 角色（`curriculum/voices.mjs`），本機語音產製工具鏈就緒：`scripts/synthesize.mjs` 呼叫 VOICEVOX 引擎 API 產生 wav、ffmpeg 轉 96kbps mp3；`scripts/build-audio-jobs.mjs` 從 curriculum 資料自動產生合成清單。第 1 天教材（です／は／も 文法、9 單字、4 文法點、6 句對話、5 題練習）寫入 `curriculum/lessons.mjs`，23 個音檔（共 532KB）已產生並存在 `public/audio/`，App.tsx 接上畫面顯示，瀏覽器驗證頁面渲染、練習題互動、音檔可正常存取，`npm run check` 全過。

下一步：

1. 排出第 0 階段第 2 天以後的教材，逐天累積到約 2-3 週完成 N5 復健。
2. 依 task-breakdown.md 依序做聽寫練習、跟讀播放、SRS 單字卡功能。
3. 9 個角色語音之後找時間逐一人耳確認音質是否符合預期語氣。
