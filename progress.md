# 專案進度

截至 2026-09-30，`nihongo-lab` 已上線並在手機真機驗證成功：**https://frobel0520.github.io/nihongo-lab/**

Repository：[github.com/frobel0520/nihongo-lab](https://github.com/frobel0520/nihongo-lab)（public）。GitHub Actions 在 push 到 main 時自動跑 `npm run check` + `npm run build` 並部署到 GitHub Pages。

目標是做成可安裝的應用程式，參考 [Family](https://github.com/frobel0520/Family) 的 PWA + Cloudflare Worker 模式，但不需要它的多人登入與推播；只同步 SRS 進度，教材本身隨 repo 走。

## 已完成

- **專案骨架**：Vite + React + TypeScript，`npm run check` 為統一檢查入口，SDLC 文件（project-plan／sa／sd／task-breakdown／release-audit）齊全。
- **第 0 階段第 1 天教材**：です／は／も 文法（4 個文法點）、9 單字、6 句對話、5 題練習，全部帶語音。路線圖定案：對照《大家的日本語》第一冊 25 課 + 平行推進的 N5 漢字進度（約 100-103 字）。
- **語音產製工具鏈**：VOICEVOX（本機）+ `scripts/synthesize.mjs`（呼叫引擎 API、ffmpeg 轉 96kbps mp3）+ `scripts/build-audio-jobs.mjs`（從課程資料自動產生合成清單）。語音陣容定案 9 個角色，第 1 天 23 個音檔（532KB）已產生並隨 repo 一起走，其他裝置 `git pull` 就有，不用裝 VOICEVOX。
- **PWA**：`vite-plugin-pwa` 產生 service worker（precache 18 項）與 manifest，圖示用 `@vite-pwa/assets-generator` 從自製 SVG 產生；`/audio/*.mp3` 另設 CacheFirst 離線快取。**已在 Android 手機上安裝並確認可開啟、音檔正常播放、手機版排版正常。**
- **UI**：套用 [learning-atlas](https://github.com/frobel0520/learning-atlas) 的設計系統（卡片排版、CSS 變數色票、Noto Sans TC + IBM Plex Mono），跟 Michael 其他網站視覺一致；固定亮色模式，不隨系統深色設定切換；手機寬度下單字／例句改成文字在上、音檔播放器獨立一行在下。
- **部署**：GitHub Pages（GitHub Actions 自動化），網址見上方。
- **跟讀（T05，2026-09-30，已上線）**：每輪播放後留白讓使用者念，可選 3／5／10 輪、可隱藏原文。不含調速（決定不做）。
- **動畫這一塊（T07、T13，2026-09-30）**：改用內建教材處理，不做字幕匯入。第 2 階段新增兩課：口語轉換表（10 個縮約與語氣重點，教科書形 vs 口語形對照）、動畫與遊戲名句 41 句（24 部作品，動畫 22、遊戲 2；單句短台詞、出處、口語解說）。文字完成，音檔待產生（`audioReady: false`）；補產流程見 project-sd.md。名句 8 句的用字已用網路搜尋交叉確認（二手來源，非原作台本）。
- **SRS 單字卡（T06）與聽寫（T04）**（2026-09-30，已上線）：畫面分成課程／單字卡／聽寫三個分頁。單字卡用第 1 天 9 個單字，SM-2 簡化版四級評分，進度存 `localStorage`；聽寫用第 1 天 14 句（文法例句 + 對話），逐字比對並標出漏聽與多打的字，答對紀錄不被之後答錯洗掉。存檔壞掉或寫入失敗時畫面明確提示。純邏輯在 `lib/`，新增 19 項測試；桌面與 375px 寬度已在瀏覽器實測，真機與日文輸入法未測（見 release-audit.md）。

## 上線後修的幾個 bug（記錄給下次類似狀況參考）

1. **手機安裝後音檔播不出來**：教材資料裡的音檔路徑寫死絕對路徑 `/audio/...`，本機開發（根目錄）沒事，但正式站部署在 `/nihongo-lab/` 子路徑下，實際請求少了子路徑變成 404。改成路徑不帶開頭斜線、由 `import.meta.env.BASE_URL` 在畫面端組出完整路徑，手機真機重新安裝後確認播放正常。這是根因。
2. **診斷過程中的岔路**：一度以為是 service worker 快取音檔後 Range 請求沒回 206，加了 workbox `RangeRequestsPlugin`；後來發現這不是根因，而且這個套件在 Node 環境（`vite.config.ts` 被 `npm run dev` 載入時）匯入會直接噴錯（`self is not defined`），把本機開發整個弄壞。已移除，改回單純的 CacheFirst，`npm run dev` 恢復正常。
3. **手機版文字被擠到左側難讀**：`<audio controls>` 在手機瀏覽器的原生寬度比想像中寬，兩欄式排版（文字 1fr、播放器 auto）在窄螢幕下文字欄被壓縮。加了 640px 以下的斷點，改成文字滿版、播放器獨立一行在下方。

## 下一步

1. 在有 VOICEVOX 與 ffmpeg 的機器上補產 T07、T13 的 61 個音檔（`node scripts/build-audio-jobs.mjs --missing`），再把兩課的 `audioReady: false` 移除。
2. 增補 T13 名句：目前已收 24 部作品（動畫 22 部、遊戲 2 部），想聽懂的其他作品再給我清單。
3. 排出第 0 階段第 2 天以後的教材，逐天累積到 25 課（音檔同上需要另一台機器）。
4. SRS 進度跨裝置同步（Cloudflare Worker，T10）：進度格式要先升版並加更新時間欄位，才能明確處理兩台裝置的衝突。
