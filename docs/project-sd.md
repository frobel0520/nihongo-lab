# 系統設計

## 架構

Vite / React + TypeScript，本機瀏覽器執行，local-first。目前無後端；未來若需要（例如 SRS 進度跨裝置同步）才考慮 Cloudflare Workers / KV / D1，見 [project-plan.md](project-plan.md)。

- `app/main.tsx`：React 掛載點。
- `app/App.tsx`：目前僅列出學習階段，之後擴充為導航、練習流程、持久化整合。
- `curriculum/lessons.mjs`：學習階段與課程資料的單一來源，目前四個階段皆為空殼（`lessons: []`），內容待第 0 階段教材產出後填入。
- `curriculum/voices.mjs`：教材語音角色陣容，對應本機 VOICEVOX 引擎（127.0.0.1:50021）的 speaker id。2026-09-29 定案 9 個角色：ずんだもん、春日部つむぎ、雨晴はう、小夜/SAYO、櫻歌ミコ、春歌ナナ、猫使ビィ、中国うさぎ、東北ずん子。
- `scripts/synthesize.mjs`：呼叫 VOICEVOX 引擎產生 wav、再用 ffmpeg 轉 96kbps mp3 的教材語音產生腳本；只在本機產生教材時用，不是網站執行期依賴。已用 ずんだもん 實測一句，輸出 50KB mp3，音質正常。
- `tests/curriculum.test.mjs`：驗證 curriculum 資料結構契約。

## 語音產製流程

VOICEVOX（本機工具，不進 repo）產生 wav → `scripts/synthesize.mjs` 呼叫其 HTTP API 並用 ffmpeg 轉 mp3 → mp3 進 repo 當靜態資產。其他裝置只要 `git pull` 就有音檔，不需要裝 VOICEVOX。詳細估算見 [project-plan.md](project-plan.md)。

## PWA

用 `vite-plugin-pwa`（generateSW 模式，workbox 產生 service worker），不手刻，避免自己維護 hashed 檔名 precache 清單。

- `icon-source.svg`：來源圖示（512×512，深藍底 + 紅圓 + 白色「日」字，安全區夠寬，maskable 也不會被裁切掉字）。`pwa-assets.config.ts` 用 `@vite-pwa/assets-generator` 的 `minimal2023Preset` 從它產生 `public/` 下的 64／192／512／maskable-512／apple-touch-icon／favicon.ico。
- `vite.config.ts` 的 `VitePWA()`：manifest（name、icons、standalone、theme/background color）+ `runtimeCaching` 把 `/audio/*.mp3` 設成 CacheFirst（聽過的課程音檔離線也能播）。`devOptions.enabled: true` 讓 `npm run dev` 也能測 service worker。
- 驗證：`npm run build` 產出 `dist/sw.js`、`dist/manifest.webmanifest`，precache 18 項（約 206KB）；`npm run dev` 下瀏覽器確認 service worker `activated`、manifest 抓得到、4 個 icon。

## 待設計（下一輪任務）

- 聽寫練習、跟讀播放器、SRS 單字卡三個功能模組的元件與狀態設計。
- 進度持久化格式（比照 typescript-lab 的 `lib/storage.ts`：版本化 key、輸入驗證）。
- 跨裝置同步 Worker：端點設計、資料存放（KV vs 私有 GitHub repo JSON store）、裝置 ID 產生與衝突處理（兩裝置離線時都寫入，重新連線後怎麼合併，需要明確規則，不能悄悄覆蓋）。
- 手機上實際「加入主畫面」安裝，全螢幕開啟的真實驗收（目前只驗證到 service worker／manifest 技術條件，未做真機安裝）。

教材資料結構已在第 1 天教材定案，見 `curriculum/lessons.mjs`、`curriculum/voices.mjs`。UI 視覺沿用 [learning-atlas](https://github.com/frobel0520/learning-atlas) 的設計系統（Noto Sans TC + IBM Plex Mono、卡片式排版、CSS 變數色票、`prefers-color-scheme` 自動深色模式），維持 Michael 的網站家族一致風格。
