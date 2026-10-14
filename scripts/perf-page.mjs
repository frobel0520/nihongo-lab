// 量測頁面載入（T120）：用本機 Chrome 的 DevTools Protocol，不需要額外套件或付費服務。
// 先跑正式 base path 的 build 與 preview：
//   MSYS_NO_PATHCONV=1 VITE_BASE_PATH=/nihongo-lab/ npm run build
//   MSYS_NO_PATHCONV=1 npx vite preview --base /nihongo-lab/ --port 4173 --strictPort
// 再跑：node scripts/perf-page.mjs [--base http://localhost:4173/nihongo-lab/] [--samples 5] [--check]
// 也可對正式站量測（--base https://<user>.github.io/nihongo-lab/），正式站結果與本機分開記錄。
// 手機情境：375×667、DPR 2、CPU 4 倍降速、網路 150ms RTT／1.6Mbps 下載／750Kbps 上傳（Lighthouse 行動版設定）。
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { stages } from '../curriculum/lessons.mjs';
import { lessonAudioPaths } from '../lib/offline.mjs';
import { evaluateBudgets, gatePassed, summarizeSamples } from '../lib/perf-stats.mjs';
import { PAGE_BUDGETS } from './perf-budget.mjs';

/** @param {string} name @param {string} fallback */
const argValue = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i === -1 ? fallback : process.argv[i + 1];
};
const base = new URL(argValue('--base', 'http://localhost:4173/nihongo-lab/'));
const samples = Number(argValue('--samples', '5'));
if (!Number.isInteger(samples) || samples < 1) throw new Error('--samples 需為正整數');

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter((p) => typeof p === 'string');
const foundChrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!foundChrome) throw new Error('找不到 Chrome，請設定 CHROME_PATH');
const chromePath = foundChrome;

const LESSON_ID = 'general-listening-31';
const PAGES = [
  { name: 'home', hash: '#/', ready: '.lesson-list' },
  { name: 'lesson', hash: `#/lesson/${LESSON_ID}`, ready: '.scene-listening' },
];
const lesson = stages.flatMap((s) => s.lessons).find((l) => l.id === LESSON_ID);
if (!lesson) throw new Error(`找不到課程 ${LESSON_ID}`);

/** 最小的 CDP 用戶端：一條 WebSocket、依 id 對回應、依事件名稱等事件。 */
class Cdp {
  /** @param {string} url */
  static async connect(url) {
    const ws = new WebSocket(url);
    await new Promise((resolve, reject) => {
      ws.addEventListener('open', resolve, { once: true });
      ws.addEventListener('error', reject, { once: true });
    });
    return new Cdp(ws);
  }
  /** @param {WebSocket} ws */
  constructor(ws) {
    this.ws = ws;
    this.nextId = 1;
    /** @type {Map<number, {resolve: (v: any) => void, reject: (e: Error) => void}>} */
    this.pending = new Map();
    /** @type {{method: string, resolve: (v: any) => void}[]} */
    this.waiters = [];
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(String(event.data));
      if (msg.id) {
        const p = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) p?.reject(new Error(`${msg.error.message}`));
        else p?.resolve(msg.result);
        return;
      }
      this.waiters = this.waiters.filter((w) => {
        if (w.method !== msg.method) return true;
        w.resolve(msg.params);
        return false;
      });
    });
  }
  /** @param {string} method @param {object} [params] */
  send(method, params = {}) {
    const id = this.nextId++;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
  /** @param {string} method @param {number} timeoutMs */
  waitFor(method, timeoutMs) {
    return Promise.race([
      new Promise((resolve) => this.waiters.push({ method, resolve })),
      sleep(timeoutMs).then(() => {
        throw new Error(`等待 ${method} 逾時`);
      }),
    ]);
  }
  /** @param {string} expression */
  async evaluate(expression) {
    const { result, exceptionDetails } = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (exceptionDetails) throw new Error(exceptionDetails.exception?.description ?? '頁面執行失敗');
    return result.value;
  }
}

// 每頁載入前注入：記錄 FCP、LCP、long task 與內容出現時間。
/** @param {string} readySelector */
const observerSource = (readySelector) => `
  window.__perf = { lcp: null, fcp: null, longTasks: [], ready: null };
  new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__perf.lcp = e.startTime; })
    .observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') window.__perf.fcp = e.startTime; })
    .observe({ type: 'paint', buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__perf.longTasks.push([e.startTime, e.duration]); })
    .observe({ type: 'longtask', buffered: true });
  const check = () => {
    if (window.__perf.ready === null && document.querySelector(${JSON.stringify(readySelector)}))
      window.__perf.ready = performance.now();
  };
  new MutationObserver(check).observe(document, { childList: true, subtree: true });
`;

const readMetrics = `(() => {
  const p = window.__perf;
  const nav = performance.getEntriesByType('navigation')[0];
  const fcp = p.fcp ?? 0;
  // TBT：FCP 之後每個 long task 超過 50ms 的部分加總（量到載入後 3 秒）。
  const tbt = p.longTasks.filter(([s]) => s >= fcp).reduce((n, [, d]) => n + Math.max(0, d - 50), 0);
  const transfer = performance.getEntriesByType('resource').reduce((n, r) => n + r.transferSize, nav.transferSize);
  const longest = p.longTasks.reduce((n, [, d]) => Math.max(n, d), 0);
  return { fcpMs: p.fcp, lcpMs: p.lcp, contentReadyMs: p.ready, tbtMs: tbt, longestTaskMs: longest, loadMs: nav.loadEventEnd, transferBytes: transfer };
})()`;

async function launch() {
  const profile = await mkdtemp(join(tmpdir(), 'nihongo-perf-'));
  /** @type {import('node:child_process').ChildProcess} */
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=0',
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ]);
  let port = null;
  for (let n = 0; n < 100 && !port; n++) {
    await sleep(100);
    try {
      port = (await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0];
    } catch {
      /* Chrome 還沒寫出連接埠 */
    }
  }
  if (!port) throw new Error('Chrome 沒有開啟 DevTools 連接埠');
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const page = targets.find((/** @type {{type: string}} */ t) => t.type === 'page');
  const cdp = await Cdp.connect(page.webSocketDebuggerUrl);
  const close = async () => {
    chrome.kill();
    await sleep(500);
    await rm(profile, { recursive: true, force: true }).catch(() => {});
  };
  return { cdp, close };
}

/** @param {Cdp} cdp */
async function setupMobile(cdp) {
  await cdp.send('Page.enable');
  await cdp.send('Network.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  });
}

/** @param {Cdp} cdp @param {{hash: string, ready: string}} page */
async function load(cdp, page) {
  const { identifier } = await cdp.send('Page.addScriptToEvaluateOnNewDocument', {
    source: observerSource(page.ready),
  });
  await cdp.send('Page.navigate', { url: 'about:blank' });
  await sleep(200);
  const loaded = cdp.waitFor('Page.loadEventFired', 60000);
  await cdp.send('Page.navigate', { url: new URL(page.hash, base).href });
  await loaded;
  await sleep(3000);
  const metrics = await cdp.evaluate(readMetrics);
  await cdp.send('Page.removeScriptToEvaluateOnNewDocument', { identifier });
  return metrics;
}

/** @type {Record<string, number[]>} */
const raw = {};
/** @param {string} key @param {number | null | undefined} value */
const push = (key, value) => {
  if (value === null || value === undefined) throw new Error(`${key} 沒有量到`);
  (raw[key] ??= []).push(value);
};

for (let n = 0; n < samples; n++) {
  // 每個樣本用全新設定檔：冷啟動沒有 HTTP 快取與 service worker。
  const { cdp, close } = await launch();
  try {
    await setupMobile(cdp);
    for (const page of PAGES) {
      await cdp.send('Network.clearBrowserCache');
      await cdp.send('Storage.clearDataForOrigin', { origin: base.origin, storageTypes: 'all' });
      const cold = await load(cdp, page);
      // 暖啟動：等 service worker 接管後再載一次。
      await cdp.evaluate(
        'navigator.serviceWorker.ready.then(() => new Promise((r) => { if (navigator.serviceWorker.controller) r(); else navigator.serviceWorker.addEventListener("controllerchange", () => r(), { once: true }); setTimeout(r, 15000); }))',
      );
      const warm = await load(cdp, page);
      for (const [mode, m] of [['cold', cold], ['warm', warm]])
        for (const [k, v] of Object.entries(m)) push(`${page.name}.${mode}.${k}`, v);
    }
    // 離線下載單課音檔：清掉快取後，在頁面裡以 4 條並行抓完整課音檔。
    // 網路降速只套用在頁面，不套用在 service worker 自己發的請求，所以這一步繞過 service worker，才量得到降速後的下載時間。
    await cdp.send('Storage.clearDataForOrigin', { origin: base.origin, storageTypes: 'cache_storage' });
    await cdp.send('Network.clearBrowserCache');
    await cdp.send('Network.setBypassServiceWorker', { bypass: true });
    const urls = lessonAudioPaths(lesson).map((p) => new URL(p, base).href);
    const download = await cdp.evaluate(`(async () => {
      const urls = ${JSON.stringify(urls)};
      const start = performance.now();
      let bytes = 0, i = 0;
      await Promise.all(Array.from({ length: 4 }, async () => {
        while (i < urls.length) {
          const res = await fetch(urls[i++], { cache: 'no-store' });
          if (!res.ok) throw new Error('音檔下載失敗 ' + res.status);
          const size = (await res.arrayBuffer()).byteLength;
          bytes += size;
        }
      }));
      return { ms: performance.now() - start, bytes, files: urls.length };
    })()`);
    push('lessonDownload.ms', download.ms);
    push('lessonDownload.bytes', download.bytes);
    push('lessonDownload.files', download.files);
  } finally {
    await close();
  }
  console.error(`樣本 ${n + 1}／${samples} 完成`);
}

const measured = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, summarizeSamples(v)]));
console.log(
  JSON.stringify({ base: base.href, samples, chrome: chromePath, measured }, null, 2),
);

if (process.argv.includes('--check')) {
  const results = evaluateBudgets(measured, PAGE_BUDGETS);
  for (const r of results)
    console.log(`${r.status.padEnd(12)} ${r.metric} ${r.stat} ${r.value?.toFixed(0)} / ${r.limit} ${r.unit}`);
  if (!gatePassed(results)) process.exit(1);
}
