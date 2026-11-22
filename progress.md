# 專案進度

本檔只放現況、進行中、待辦與限制，長度上限與寫法見 AGENTS.md「交接文件長度」。完成的歷史由 Git 保存：本檔精簡前的完整版本在 [1e3cf0d 的 progress.md](https://github.com/frobel0520/nihongo-lab/blob/1e3cf0dfae0a8c3940776c44b7b10a0474feef62/progress.md)，各批驗收細節見[發布稽核](docs/release-audit.md)，內部證據在 Private repo `frobel0520/project-archives`（專案 key `gh-1395745155`）。

## 現況（2026-11-22）

- 正式站：Worker 已部署 [#284](https://github.com/frobel0520/nihongo-lab/pull/284) `e299dab9`（T198）。首頁接續學習與香檳金明暗色已上線，代表功能、真正離線與正式效能補驗通過。見 [部署 CI](https://github.com/frobel0520/nihongo-lab/actions/runs/45004700562)。
- 教材（正式站）：通用 180 課；原神 122 位角色、1244 句（另有不顯示的奇偶 6 句留在資料中）；單字卡遊戲類別 1490 張（原神 1244、永恆輪迴 246）。教材 MP3 9410 個（網站提供下載 9404 個），另有 38 個聲線預覽；SVG 2613 張。
- 原神語音卡揭示後不顯示圖片（T178）；遊戲角色語音播放過就記為已學，沒有手動標記按鈕（T183）。新增原神語音不再製作 SVG。
- 原神缺漏與自查（2026-11-14）：固定來源 `genshin-db` `49a6544` 109 份語音表 SHA-256 全數吻合；戰技／爆發 736 條已收 665 條，剩餘 71 條為無詞義喊聲與 T181 裁定不收的 2 句。加入隊伍台詞 96 位固定來源角色已由 T187、T188 補齊（僅菲謝爾與奧茲雙人對話、雲堇帶註記一句不收），其餘角色不列待辦。`action-0740`（艾洛伊 9 句與 `aloy.json` 一致）與 `action-0762`（T179／T181 補齊項）來源、讀音與音檔自查已於 T189 結案；非戰技／爆發／編隊的其他動作語音範圍未重算，不宣稱全量完成。
- CI：完整檢查的瀏覽器測試平行執行，各 job 有逾時；ffmpeg 裝不起來時改用瀏覽器解碼變更的 MP3（T186）。
- 進行中：T199 調整首頁、整段聽解與單字卡的視覺層級。進階教材依使用者 2026-11-21 裁定暫緩。
- 人耳審聽、真機與 WebKit（Safari）效能驗收不列專案待辦（2026-11-21 使用者裁定）：由使用者實際使用時遇到問題再回報，回報後依問題開 task；未做的驗收仍不寫成通過。正式效能驗收為桌面 Chromium 模擬，已核對 `d24e447` 與 T198 版本的首頁及通用第 121 課。
- 奇偶不列入角色語音（2026-11-12 使用者裁定）：資料與音檔留在 repo 供歷史核對，網站不顯示也不計數，見 docs/project-sd.md 的 T188。

## 最近批次

- **T198**（2026-11-22，已發布）：[#284](https://github.com/frobel0520/nihongo-lab/pull/284) 首頁依本機最近課程接續，列出四類到期數，採香檳金明暗色。正式驗收見[發布稽核](docs/release-audit.md#t198首頁接續與香檳金)。

- **T197**（2026-11-21，已發布）：[PR #280](https://github.com/frobel0520/nihongo-lab/pull/280) CSS 門檻依深色模式後的 build 改為 6,648 bytes；修正音檔遇到空間不足時多派 1 個請求的時序。見[發布稽核](docs/release-audit.md#t197css-容量門檻cr-perf-20261121)。

- **T196**（2026-11-21，已發布）：[PR #278](https://github.com/frobel0520/nihongo-lab/pull/278) 移除已撤回的 picomatch 例外；配圖 chunk gzip 182,158 → 76,924 bytes；GitHub Actions 改用 Node 24 版本。見[發布稽核](docs/release-audit.md#t196維護依賴例外容量餘裕與-actions-升版)。

- 正式站驗收證據（Private，都已重新 clone 逐件 SHA 核對）：T197 批次 `09ae8b7f-ed66-469a-bf7c-503d75c428d5`（4 件），T196 批次 `723f757c-6bac-46c3-acbc-a024ea61df57`（4 件），T195 批次 `ca884132-989b-467a-982a-a8c732b8236e`（6 件），#271 正式跨版 `823a34f7-bb5f-4b22-937a-aaeea30ee43f`（3 件），T187～T188 批次 `2850d6ed-9853-4a01-8f5c-f169debbe6bc`（18 件），T184～T186 批次 `93397d41-d1ed-468e-942f-65b10e573bca`（15 件），T181～T183 批次 `98e54a94-f3f1-4bac-9444-0e98ae624e97`（18 件）。

## 協作與發布規則摘要

細節以 AGENTS.md 為準，這裡只列最常用的幾條：

- master 與 worker 可以是同一個 session，負責開發、自查與驗證。只有使用者明確要求本次 review 時，才另開獨立 reviewer。
- 合併 main、部署與設定變更都要使用者當次授權；PR 必要 CI 通過才合併，nihongo-lab 用 fast-forward。
- 存檔：證據提交進 `project-archives`、重新 clone 讀回並逐件核對 SHA，就算存檔完成；不需要在 Harbor 網頁同步（2026-11-10 使用者決定）。
- 正式站會拒絕 Python 預設 User-Agent（回 403），腳本下載要用一般瀏覽器 User-Agent。

## 待辦

- [ ] 【低】動畫進階長片段／跨句教材與後續學習階段：使用者 2026-11-21 裁定暫緩，不自動開始。

## 通用限制

- Issue #180 依擁有者決定結束追蹤。正式登入、雙向同步、登出／重登、跨裝置同步及同步效能未驗收，已移出待辦。既有遷移與匿名驗收結果見[發布稽核](docs/release-audit.md#issue-180正式舊址遷移與匿名驗收)。

每批都適用、不再逐批重寫的限制，集中寫在[發布稽核的「通用限制」](docs/release-audit.md#通用限制)。
