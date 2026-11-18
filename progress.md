# 專案進度

本檔只放現況、進行中、待辦與限制，長度上限與寫法見 AGENTS.md「交接文件長度」。完成的歷史由 Git 保存：本檔精簡前的完整版本在 [1e3cf0d 的 progress.md](https://github.com/frobel0520/nihongo-lab/blob/1e3cf0dfae0a8c3940776c44b7b10a0474feef62/progress.md)，各批驗收細節見[發布稽核](docs/release-audit.md)，內部證據在 Private repo `frobel0520/project-archives`（專案 key `gh-1395745155`）。

## 現況（2026-11-18）

- 正式站：Worker 與舊址引導頁 Pages 最新部署均為 `d24e447`（#261 CSP 修正）。T193 正式站代表補驗綁定當時實測的 `0391f988`。部署見 [main CI](https://github.com/frobel0520/nihongo-lab/actions/runs/44092450410)。
- 教材（正式站）：通用 180 課；原神 122 位角色、1244 句（另有不顯示的奇偶 6 句留在資料中）；單字卡遊戲類別 1490 張（原神 1244、永恆輪迴 246）。教材 MP3 9410 個（網站提供下載 9404 個），另有 38 個聲線預覽；SVG 2613 張。
- 原神語音卡揭示後不顯示圖片（T178）；遊戲角色語音播放過就記為已學，沒有手動標記按鈕（T183）。新增原神語音不再製作 SVG。
- 原神缺漏與自查（2026-11-14）：固定來源 `genshin-db` `49a6544` 109 份語音表 SHA-256 全數吻合；戰技／爆發 736 條已收 665 條，剩餘 71 條為無詞義喊聲與 T181 裁定不收的 2 句。加入隊伍台詞 96 位固定來源角色已由 T187、T188 補齊（僅菲謝爾與奧茲雙人對話、雲堇帶註記一句不收），其餘角色不列待辦。`action-0740`（艾洛伊 9 句與 `aloy.json` 一致）與 `action-0762`（T179／T181 補齊項）來源、讀音與音檔自查已於 T189 結案；非戰技／爆發／編隊的其他動作語音範圍未重算，不宣稱全量完成。
- CI：完整檢查的瀏覽器測試平行執行，各 job 有逾時；ffmpeg 裝不起來時改用瀏覽器解碼變更的 MP3（T186）。
- 進行中：T194（Issue #260）四項 UX 修正已交付 Ready [PR #262](https://github.com/frobel0520/nihongo-lab/pull/262)，尚未發布。Linux 依賴稽核受 GHSA-fc5q-39xc-vjpf 阻擋，後續瀏覽器測試跳過。Windows UX 成功。見 [#262 CI](https://github.com/frobel0520/nihongo-lab/actions/runs/44224592708)。
- 奇偶不列入角色語音（2026-11-12 使用者裁定）：資料與音檔留在 repo 供歷史核對，網站不顯示也不計數，見 docs/project-sd.md 的 T188。

## 最近批次

- **深色模式與 UI 審查 P2**（2026-11-18，候選）：[PR #266](https://github.com/frobel0520/nihongo-lab/pull/266) 跟隨系統的深色色票、返回連結 40px，並以 CR-AUDIT-20261118 限期放行 picomatch 公告到 2026-12-31。深淺色 11 個路由對比達 AA、溢位 0。

- **T193**（2026-11-16，已發布）：[PR #258](https://github.com/frobel0520/nihongo-lab/pull/258)改善解析焦點、39／54課解說及練習範圍提示。441項測試與必要Linux／Windows CI通過，正式12檔SHA一致；教材ID／媒體保持。正式 `0391f988` 的 375 寬代表 UI 與真正離線已補驗，原 TLS 中止保留。詳見[補驗紀錄](docs/release-audit.md#t193正式站代表補驗)。

- **T192**（2026-11-15，已發布）：[PR #255](https://github.com/frobel0520/nihongo-lab/pull/255)縮減必要索引傳輸，內容及ID保持；main CI／Worker／Pages成功。正式首頁fresh LCP p95 2180ms，兩頁全部時間門檻通過；實際跨版進度／下載保留及真正離線通過，詳見[發布稽核](docs/release-audit.md#t192首頁索引傳輸改善)。

- 正式站驗收證據（Private，都已重新 clone 逐件 SHA 核對）：T187～T188 批次 `2850d6ed-9853-4a01-8f5c-f169debbe6bc`（18 件），T184～T186 批次 `93397d41-d1ed-468e-942f-65b10e573bca`（15 件），T181～T183 批次 `98e54a94-f3f1-4bac-9444-0e98ae624e97`（18 件）。

## 協作與發布規則摘要

細節以 AGENTS.md 為準，這裡只列最常用的幾條：

- master 與 worker 可以是同一個 session，負責開發、自查與驗證。只有使用者明確要求本次 review 時，才另開獨立 reviewer。
- 合併 main、部署與設定變更都要使用者當次授權；PR 必要 CI 通過才合併，nihongo-lab 用 fast-forward。
- 存檔：證據提交進 `project-archives`、重新 clone 讀回並逐件核對 SHA，就算存檔完成；不需要在 Harbor 網頁同步（2026-11-10 使用者決定）。
- 正式站會拒絕 Python 預設 User-Agent（回 403），腳本下載要用一般瀏覽器 User-Agent。

## 待辦

- [ ] 【中】T193 原部署未做正式效能重測。後續正式版 `d24e447` 的首頁與第 121 課 Chromium 效能驗收通過。WebKit 仍待驗。
- [ ] 【低】角色換句定位及圖片下載入口定位為可選改善。

- [ ] 【中】待外部：逐句人耳審聽與重音／情緒驗收；既有局部人工回報不代表全部教材音檔通過。
- [ ] 【中】待外部：新版 iOS／Android 完整真機、系統字型／鍵盤／安裝後播放與實體螢幕閱讀器驗收。
- [ ] 【中】沒有 Web Locks 的環境下，下載功能的退化行為繼續觀察；不以支援 Web Locks 的桌面回歸代替。
- [ ] 【低】動畫進階長片段／跨句教材與後續學習階段的範圍和 task 拆分待決定，不自動開始新教材批次。

## 通用限制

- Issue #180 依擁有者決定結束追蹤。正式登入、雙向同步、登出／重登、跨裝置同步及同步效能未驗收，已移出待辦。既有遷移與匿名驗收結果見[發布稽核](docs/release-audit.md#issue-180正式舊址遷移與匿名驗收)。

每批都適用、不再逐批重寫的限制，集中寫在[發布稽核的「通用限制」](docs/release-audit.md#通用限制)。
