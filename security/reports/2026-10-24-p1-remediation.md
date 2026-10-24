# SEC-P1-20261024 安全修補證據

基線：初次驗證於 `64e717505ab70c37f8becda1755aa55a1c454186`，之後無衝突 rebase 到 `c51dbaee449afda32e548b5829b6db086d9a85cd`（T163；未改 `package.json`／lockfile）。範圍為已核准的高／嚴重依賴修補。

- 修補前 main：npm audit 6 則（critical 2、high 2、moderate 1、low 1），涉及 vite、tinypool（經 oxfmt）、source-map-js、fast-uri、serialize-javascript。
- 修補後：公開 npm audit 0。Vite 8.2.2→8.2.4；tinypool 以 override 升到 2.2.0（oxfmt 0.61.0 指定 2.1.0，升級 oxfmt 後應移除 override）。
- 暴露面：受影響套件全為 devDependencies（開發伺服器、格式化工具、build 工具）。runtime 的 react、react-dom、ts-fsrs 未變；正式站是靜態網站，不執行這些工具。
- rebase 後本機隔離安裝驗證：audit 0、`npm run check`（353 tests）、正式 build、perf:bundle、`test:images`、格式化工具合成檔通過。`test:pwa` 與 `test:pwa:updates` 在本機 Windows 未完成（逾時／symlink 權限），不記為通過，以 CI 為準。
- CI：rebase 前（base `64e7175`）全部通過；rebase 後須重跑並通過才合併。最終 CI、合併與部署結果記在 PR #169。
- 沒有建立付費服務。本機 fixture／bundle 不替代正式環境效能。

完整契約、版本、檢查與限制：`2026-10-24-p1-remediation.json`。
