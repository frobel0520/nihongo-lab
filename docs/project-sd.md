# 系統設計

## 架構

Vite / React + TypeScript，本機瀏覽器執行，local-first。目前無後端；未來若需要（例如 SRS 進度跨裝置同步）才考慮 Cloudflare Workers / KV / D1，見 [project-plan.md](project-plan.md)。

- `app/main.tsx`：React 掛載點。
- `app/App.tsx`：目前僅列出學習階段，之後擴充為導航、練習流程、持久化整合。
- `curriculum/lessons.mjs`：學習階段與課程資料的單一來源，目前四個階段皆為空殼（`lessons: []`），內容待第 0 階段教材產出後填入。
- `tests/curriculum.test.mjs`：驗證 curriculum 資料結構契約。

## 待設計（下一輪任務）

- 教材資料結構（每課的例句、單字、文法說明、音檔來源欄位）。
- 聽寫練習、跟讀播放器、SRS 單字卡三個功能模組的元件與狀態設計。
- 進度持久化格式（比照 typescript-lab 的 `lib/storage.ts`：版本化 key、輸入驗證）。

這些在教材資料結構定案前不展開，避免和第 0 階段教材範例互相打架。
