# 專案進度

更新：2026-10-28（Asia/Taipei）。

## 目前狀態

T165／[PR #172](https://github.com/frobel0520/nihongo-lab/pull/172) 已於10/26合併並發布；main `2c560fe75e687caf2166fdcdc519aa11ea5a3069`，[Linux／Windows CI 與 Pages](https://github.com/frobel0520/nihongo-lab/actions/runs/40299263143) 成功。PR 發布紀錄記載五項代表流程、真正離線、舊合成進度／下載保留與490個產物／抽驗音檔SHA核對通過；這是既有發布證據，本次未重做正式瀏覽器驗收。沒有未合併 PR 或未結案 issue，不再把 T165 標為待審／未部署。

180課、5909張有圖卡、2242個SVG、8535個教材音檔與38個聲線預覽已交付；教材ID、FSRS、同步3與主動下載契約保持。安全修補 [#169](https://github.com/frobel0520/nihongo-lab/pull/169) 已合併，原高／嚴重依賴項不能再當作尚未整合；這不是本日重新取得的 npm advisory 結果。

## 待辦

- [ ] 【中】待外部：逐句人耳審聽與重音／情緒驗收；既有局部人工回報不代表全量8535個教材音檔通過。
- [ ] 【中】待外部：新版 iOS／Android 完整真機、OS字型／鍵盤／安裝播放與實體螢幕閱讀器驗收；既有 Android 局部口頭回報與桌面模擬分開記錄。
- [ ] 【中】同步版本3在手機／電腦與已安裝App的現行版交叉驗證，保留既有成功回報及其未逐項留證限制。
- [ ] 【中】無 Web Locks 環境的下載退化繼續觀察；不以支援 Web Locks 的桌面回歸代替。
- [ ] 【低】動畫進階長片段／跨句教材與後續學習階段的範圍／task 拆分待決定；不自動開始新教材批次。

## 歷史證據

[完整 T165 以前的進度與舊待審快照](https://github.com/frobel0520/nihongo-lab/blob/2c560fe75e687caf2166fdcdc519aa11ea5a3069/progress.md) 保留於固定版本；最新發布結果以 PR #172 為準。完整內部報告與證據不納入公開進度文件。

本頁保持在 Harbor 既有100,000 bytes讀取限制內，避免歷史累積使整份文件成為 unsupported；歷史連結不算新的待辦或新的驗收。

