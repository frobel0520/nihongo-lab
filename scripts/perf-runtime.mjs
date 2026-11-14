// Low-volume anonymous production measurements. Never loads a user's browser profile.
import { parseArgs, promisify } from 'node:util';
import { execFileSync, execFile } from 'node:child_process';
import { cpus, totalmem, platform, arch } from 'node:os';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { chromium } from 'playwright-core';
import { RUNTIME_BUDGETS, summarizeRun } from './perf-runtime-policy.mjs';

const execFileAsync = promisify(execFile);

const { values } = parseArgs({
  options: {
    url: { type: 'string' },
    revision: { type: 'string' },
    out: { type: 'string' },
    samples: { type: 'string', default: '5' },
    'api-only': { type: 'boolean', default: false },
    'pages-only': { type: 'boolean', default: false },
    check: { type: 'boolean', default: false },
  },
});
if (!values.url || !values.revision || !values.out)
  throw new Error('Required: --url --revision --out (private evidence path)');
if (values['api-only'] && values['pages-only'])
  throw new Error('Choose one scope or omit both');
const base = new URL(values.url);
if (base.username || base.password || base.search || base.hash)
  throw new Error('Base URL must not contain credentials, query or fragment');
if (
  base.protocol !== 'https:' &&
  !(
    base.protocol === 'http:' &&
    ['localhost', '127.0.0.1'].includes(base.hostname)
  )
)
  throw new Error('Use HTTPS or loopback HTTP');
if (!base.pathname.endsWith('/')) throw new Error('Base URL must end in /');
if (!/^[a-f0-9]{7,40}$/i.test(values.revision))
  throw new Error('Supply the verified deployed product Git revision');
const count = Number(values.samples);
if (!Number.isInteger(count) || count < 5 || count > 10)
  throw new Error('Use 5–10 samples; this is not a load test');
const executablePath =
  process.env.CHROME_PATH ||
  ['chromium', 'google-chrome']
    .map((name) => {
      try {
        return execFileSync(
          process.platform === 'win32' ? 'where' : 'which',
          [name],
          { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
        )
          .trim()
          .split(/\r?\n/)[0];
      } catch {
        return '';
      }
    })
    .find(Boolean);
if (!values['api-only'] && !executablePath)
  throw new Error('Install Chromium or set CHROME_PATH');
const browser = values['api-only']
  ? null
  : await chromium.launch({
      executablePath,
      headless: true,
      args: ['--no-sandbox'],
    });
/** @typedef {import('./perf-runtime-policy.mjs').RuntimeSample} RuntimeSample */
/** @typedef {ReturnType<typeof summarizeRun> & {samples: RuntimeSample[]}} RunEvidence */
/** @typedef {{lcpMs: number | null, tasks: {startTime: number, duration: number}[]}} BrowserMetrics */
const report = {
  schema: 1,
  at: new Date().toISOString(),
  productRevision: values.revision,
  url: base.href,
  browser: browser?.version() ?? null,
  measurementScope: values['api-only']
    ? 'anonymous-api-only'
    : values['pages-only']
      ? 'pages-only'
      : 'page-and-anonymous-api',
  node: process.version,
  environment: {
    platform: platform(),
    arch: arch(),
    cpuModel: cpus()[0]?.model,
    logicalCpus: cpus().length,
    memoryBytes: totalmem(),
  },
  conditions: {
    viewport: [375, 667],
    deviceScaleFactor: 2,
    cpuSlowdown: 4,
    latencyMs: 150,
    downloadBitsPerSecond: 1600000,
    uploadBitsPerSecond: 750000,
    serviceWorkers: 'blocked',
    observationAfterReadyMs: 3000,
    samples: count,
    concurrency: 1,
    api: 'unthrottled curl; independent process per request, no cookie jar; complete response body; environment proxy and TLS trust preserved',
  },
  coverage: {
    formalPage: values['api-only']
      ? 'not_measured'
      : 'see_page_results_and_url',
    authenticatedSync: 'not_measured',
    realDevice: 'not_measured',
    installedPwa: 'not_measured',
    firstPrecacheCompletion: 'not_measured',
    fieldWebVitals: 'not_measured',
  },
  pages:
    /** @type {({name: string, fresh: RunEvidence, repeat: RunEvidence})[]} */ ([]),
  api: /** @type {({name: string} & RunEvidence)[]} */ ([]),
  fatal: false,
  scopedGatePassed: false,
};
/** @param {import('playwright-core').Page} page @param {string} url @param {string} selector */
async function measurePage(page, url, selector, repeat = false) {
  let pageerrors = 0,
    failedResponses = 0,
    failedRequests = 0;
  const onError = () => {
    pageerrors++;
  };
  /** @param {import('playwright-core').Response} r */
  const onResponse = (r) => {
    if (r.status() >= 400) failedResponses++;
  };
  /** @type {{path: string, error: string | undefined}[]} */
  const requestFailures = [];
  /** @param {import('playwright-core').Request} request */
  const onFailed = (request) => {
    failedRequests++;
    requestFailures.push({
      path: new URL(request.url()).pathname,
      error: request.failure()?.errorText,
    });
  };
  page
    .on('pageerror', onError)
    .on('response', onResponse)
    .on('requestfailed', onFailed);
  try {
    const response = repeat
      ? await page.reload({ waitUntil: 'domcontentloaded', timeout: 45000 })
      : await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.locator(selector).waitFor({ state: 'visible', timeout: 45000 });
    const contentReadyMs = await page.evaluate(() => performance.now());
    // Fixed observation window is part of the TBT measurement, not a readiness retry.
    await page.waitForTimeout(3000);
    const timing = await page.evaluate(() => {
      const metrics = /** @type {BrowserMetrics} */ (
        Reflect.get(window, '__runtimePerf')
      );
      const fcpMs =
        performance.getEntriesByName('first-contentful-paint')[0]?.startTime ??
        null;
      const navigation = /** @type {PerformanceNavigationTiming} */ (
        performance.getEntriesByType('navigation')[0]
      );
      const tbtMs =
        fcpMs === null
          ? null
          : metrics.tasks
              .filter((t) => t.startTime >= fcpMs)
              .reduce((sum, t) => sum + Math.max(0, t.duration - 50), 0);
      return {
        fcpMs,
        lcpMs: metrics.lcpMs,
        tbtMs,
        navigationType: navigation.type,
        ttfbMs: navigation.responseStart - navigation.requestStart,
        resources: performance.getEntriesByType('resource').length,
      };
    });
    return {
      ...timing,
      contentReadyMs,
      status: response?.status(),
      pageerrors,
      failedResponses,
      failedRequests,
      requestFailures,
      ok:
        response?.status() === 200 &&
        !pageerrors &&
        !failedResponses &&
        !failedRequests,
    };
  } catch {
    return {
      ok: false,
      failure: 'navigation_or_readiness',
      pageerrors,
      failedResponses,
      failedRequests,
      requestFailures,
    };
  } finally {
    page
      .off('pageerror', onError)
      .off('response', onResponse)
      .off('requestfailed', onFailed);
  }
}
try {
  const routes = [
    { name: 'home', hash: '#/', selector: 'main [aria-label="今天的複習"]' },
    {
      name: 'lesson',
      hash: '#/lesson/general-listening-121',
      selector: 'main [role="tablist"][aria-label="課程內容"]',
    },
  ];
  for (const route of routes) {
    if (!browser) break;
    /** @type {RuntimeSample[]} */
    const fresh = [];
    /** @type {RuntimeSample[]} */
    const repeat = [];
    for (let i = 0; i < count; i++) {
      const context = await browser.newContext({
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        serviceWorkers: 'block',
      });
      try {
        await context.addInitScript(() => {
          const runtimeWindow =
            /** @type {Window & {__runtimePerf: BrowserMetrics}} */ (
              /** @type {unknown} */ (window)
            );
          runtimeWindow.__runtimePerf = { lcpMs: null, tasks: [] };
          new PerformanceObserver((list) => {
            for (const e of list.getEntries())
              runtimeWindow.__runtimePerf.lcpMs = e.startTime;
          }).observe({ type: 'largest-contentful-paint', buffered: true });
          new PerformanceObserver((list) => {
            for (const e of list.getEntries())
              runtimeWindow.__runtimePerf.tasks.push({
                startTime: e.startTime,
                duration: e.duration,
              });
          }).observe({ type: 'longtask', buffered: true });
        });
        const page = await context.newPage();
        const cdp = await context.newCDPSession(page);
        await cdp.send('Network.enable');
        await cdp.send('Network.emulateNetworkConditions', {
          offline: false,
          latency: 150,
          downloadThroughput: 1600000 / 8,
          uploadThroughput: 750000 / 8,
          connectionType: 'cellular4g',
        });
        await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
        // Context creation gives an empty HTTP cache. Repeated navigation reuses that cache,
        // never an installed service worker; fresh does not imply a cold CDN/Worker.
        fresh.push(
          await measurePage(page, base.href + route.hash, route.selector),
        );
        repeat.push(
          await measurePage(page, base.href + route.hash, route.selector, true),
        );
      } finally {
        await context.close();
      }
      process.stdout.write(`${route.name} ${i + 1}/${count}\n`);
    }
    report.pages.push({
      name: route.name,
      fresh: { samples: fresh, ...summarizeRun(fresh, RUNTIME_BUDGETS.fresh) },
      repeat: {
        samples: repeat,
        ...summarizeRun(repeat, RUNTIME_BUDGETS.repeat),
      },
    });
  }
  for (const endpoint of values['pages-only']
    ? []
    : [
        { name: 'health', path: '/health', method: 'GET', status: 200 },
        {
          name: 'syncUnauthorized',
          path: '/sync',
          method: 'POST',
          status: 401,
        },
      ]) {
    const samples = [];
    for (let i = 0; i < count; i++) {
      try {
        const args = [
          '--disable', // Ignore user curlrc: never inherit a cookie jar or auth options.
          '--silent',
          '--show-error',
          '--max-time',
          '15',
          '--user-agent',
          'Mozilla/5.0',
          '--request',
          endpoint.method,
          '--header',
          `Origin: ${base.origin}`,
          '--write-out',
          '\n%{http_code} %{time_total}',
        ];
        if (endpoint.method === 'POST')
          args.push(
            '--header',
            'Content-Type: application/json',
            '--data',
            '{"progress":{}}',
          );
        args.push(new URL(endpoint.path, base.origin).href);
        const { stdout } = await execFileAsync('curl', args, {
          maxBuffer: 65536,
        });
        const split = stdout.lastIndexOf('\n');
        const [status, seconds] = stdout
          .slice(split + 1)
          .trim()
          .split(' ');
        const body = JSON.parse(stdout.slice(0, split));
        samples.push({
          durationMs: Number(seconds) * 1000,
          status: Number(status),
          ok:
            Number(status) === endpoint.status &&
            (endpoint.name === 'health'
              ? body.ok === true
              : body.error === 'unauthorized'),
        });
      } catch {
        samples.push({
          ok: false,
          failure: 'request_or_response',
          durationMs: null,
        });
      }
    }
    report.api.push({
      name: endpoint.name,
      samples,
      ...summarizeRun(samples, RUNTIME_BUDGETS.api),
    });
  }
} catch {
  report.fatal = true;
} finally {
  await browser?.close();
  report.scopedGatePassed =
    !report.fatal &&
    (values['api-only'] || report.pages.length === 2) &&
    (values['pages-only'] || report.api.length === 2) &&
    report.pages.every((p) => p.fresh.passed && p.repeat.passed) &&
    report.api.every((a) => a.passed);
  await mkdir(dirname(resolve(values.out)), { recursive: true });
  await writeFile(values.out, JSON.stringify(report, null, 2) + '\n');
  console.log(
    JSON.stringify({
      scopedGatePassed: report.scopedGatePassed,
      fatal: report.fatal,
      coverage: report.coverage,
    }),
  );
}
if (report.fatal || (values.check && !report.scopedGatePassed))
  process.exitCode = 1;
