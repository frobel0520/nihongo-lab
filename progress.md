# 專案進度

本檔只放現況、進行中、待辦與限制，長度上限與寫法見 AGENTS.md「交接文件長度」。完成的歷史由 Git 保存：本檔精簡前的完整版本在 [1e3cf0d 的 progress.md](https://github.com/frobel0520/nihongo-lab/blob/1e3cf0dfae0a8c3940776c44b7b10a0474feef62/progress.md)，各批驗收細節見[發布稽核](docs/release-audit.md)，內部證據在 Private repo `frobel0520/project-archives`（專案 key `gh-1395745155`）。

## 現況（2026-11-10）

- 正式站：產品版本 `79baa3a`（T179），由 nihongo-sync Worker 同源提供；之後的 main 提交只改文件。
- 教材：通用 180 課；原神 891 句；單字卡遊戲類別 1137 張（原神 891、永恆輪迴 246）。教材 MP3 9053 個，另有 38 個聲線預覽；SVG 2613 張。
- 原神語音卡揭示後不顯示圖片（T178），其他教材與永恆輪迴照常顯示；新增原神語音不再製作 SVG。
- 原神缺漏：已知待補 3 組、來源待核 3 組；action-0740 交叉引用與來源未取得的範圍仍未知，不宣稱全量完成。另有 4 項因讀音或語意依據不足保留，明細見 Private 批次 `1d5d00a4-1b76-408d-81b4-1efddf3b2650`。
- 進行中：無。開新工作前先 `git fetch origin main`，並確認沒有未合併的 PR。

## 最近批次

- **T179**（2026-11-10 發布）：6 角色 8 句、8 個 MP3，不新增圖片；待補 5→3、待核 9→3。PR [#222](https://github.com/frobel0520/nihongo-lab/pull/222)，驗收紀錄 [#225](https://github.com/frobel0520/nihongo-lab/pull/225)。
- **T177／T178**（2026-11-10 發布）：T177 補 18 角色 37 句（待補 36→5）；T178 取消所有原神語音卡配圖。PR [#218](https://github.com/frobel0520/nihongo-lab/pull/218)、[#220](https://github.com/frobel0520/nihongo-lab/pull/220)、[#223](https://github.com/frobel0520/nihongo-lab/pull/223)，驗收紀錄 [#224](https://github.com/frobel0520/nihongo-lab/pull/224)。
- 上面兩批的正式站驗收證據：Private 批次 `ef108edf-2a48-4341-902e-283010afb93c`（19 件，重新 clone 後逐件 SHA 核對通過）。
- **T176**（2026-11-10 發布）：18 角色 37 句；待補 73→36。PR [#215](https://github.com/frobel0520/nihongo-lab/pull/215)、[#216](https://github.com/frobel0520/nihongo-lab/pull/216)。

## 協作與發布規則摘要

細節以 AGENTS.md 為準，這裡只列最常用的幾條：

- master 與 worker 可以是同一個 session，負責開發、自查與驗證。只有使用者明確要求本次 review 時，才另開獨立 reviewer。
- 合併 main、部署與設定變更都要使用者當次授權；PR 必要 CI 通過才合併，nihongo-lab 用 fast-forward。
- 存檔：證據提交進 `project-archives`、重新 clone 讀回並逐件核對 SHA，就算存檔完成；不需要在 Harbor 網頁同步（2026-11-10 使用者決定）。
- 正式站會拒絕 Python 預設 User-Agent（回 403），腳本下載要用一般瀏覽器 User-Agent。

## 待辦

- [ ] 【中】原神剩餘：待補 3 組、來源待核 3 組、讀音／語意不足 4 項、action-0740 與來源未取得範圍。action-0762 自 T178 起不再因缺圖卡住，但仍需完成來源與讀音自查。
- [ ] 【中】權威規範差距：補齊正式頁面／API 效能基準、適用門檻及 Release Gate 證據；bundle 檢查通過不能代替。
- [ ] 【中】安全遷移 SEC-P1-20261031：Worker 已部署，真實帳號登入、舊網址遷移與正式環境頁面載入／同步延遲仍未驗（見 docs/project-sd.md 變更紀錄）。
- [ ] 【中】待外部：逐句人耳審聽與重音／情緒驗收；既有局部人工回報不代表全部教材音檔通過。
- [ ] 【中】待外部：新版 iOS／Android 完整真機、系統字型／鍵盤／安裝後播放與實體螢幕閱讀器驗收。
- [ ] 【中】同步版本 3 在手機、電腦與已安裝 App 的現行版交叉驗證。
- [ ] 【中】沒有 Web Locks 的環境下，下載功能的退化行為繼續觀察；不以支援 Web Locks 的桌面回歸代替。
- [ ] 【低】動畫進階長片段／跨句教材與後續學習階段的範圍和 task 拆分待決定，不自動開始新教材批次。

## 通用限制

每批都適用、不再逐批重寫的限制，集中寫在[發布稽核的「通用限制」](docs/release-audit.md#通用限制)。
