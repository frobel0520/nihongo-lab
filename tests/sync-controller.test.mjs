import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeProgress } from '../lib/progress-merge.mjs';
import { emptyProgress, fingerprintProgress, recordDictation, recordReview } from '../lib/progress.mjs';
import { createSyncController } from '../lib/sync-controller.mjs';
import { CHANGE_SYNC_DELAY_MS, FOREGROUND_SYNC_INTERVAL_MS, SYNC_STATE_KEY, loadSyncState } from '../lib/sync.mjs';

const card = (progress, id, stamp) => recordReview(progress, id, 'good', '2026-10-01', stamp);
const T1 = '2026-10-01T01:00:00.000Z';
const T2 = '2026-10-01T02:00:00.000Z';
const json = (status, body) => new Response(JSON.stringify(body), { status });
const flush = () => new Promise((resolve) => setImmediate(resolve));

/** 假的同步伺服器：與上傳的進度合併後整份回傳（跟真的 Worker 一樣，鍵順序也可能不同）。 */
function makeServer(initial = emptyProgress()) {
  const server = { progress: initial, calls: 0, mode: 'ok', renew: null, gate: null };
  server.handle = async (url, init) => {
    server.calls++;
    if (server.gate) await server.gate;
    if (url.endsWith('/auth')) {
      if (server.mode === 'forbidden') return json(403, { error: 'not_allowed' });
      return json(200, { token: 'SESSION', email: 'me@example.com' });
    }
    if (server.mode === 'offline') throw new TypeError('Failed to fetch');
    if (server.mode === 'expired') return json(401, { error: 'unauthorized' });
    if (server.mode === 'corrupt') return json(500, { error: 'stored_corrupt' });
    const incoming = JSON.parse(init.body).progress;
    server.progress = mergeProgress(server.progress, incoming).progress;
    // 故意把鍵倒著排：內容相同但順序不同，驗證不會因此誤判成「有變更」
    const reversed = {
      ...server.progress,
      srs: Object.fromEntries(Object.entries(server.progress.srs).reverse()),
      dictation: Object.fromEntries(Object.entries(server.progress.dictation).reverse()),
    };
    return json(200, { progress: reversed, changed: true, ...(server.renew ? { token: server.renew } : {}) });
  };
  return server;
}

function harness({ saved = null, local = emptyProgress(), server = makeServer(), online = true } = {}) {
  const store = new Map(saved ? [[SYNC_STATE_KEY, JSON.stringify(saved)]] : []);
  const storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => void store.set(k, v), removeItem: (k) => void store.delete(k) };
  const h = { storage, server, current: local, time: 1_000_000, online, timers: new Map(), nextTimer: 1, applyThrows: false };
  h.ctl = createSyncController({
    storage,
    fetchImpl: server.handle,
    url: 'https://w.example',
    now: () => h.time,
    isOnline: () => h.online,
    getProgress: () => h.current,
    applyRemote: (remote) => {
      if (h.applyThrows) throw new Error('boom');
      h.current = mergeProgress(h.current, remote).progress;
    },
    setTimer: (fn, ms) => { const id = h.nextTimer++; h.timers.set(id, { fn, ms }); return id; },
    clearTimer: (id) => void h.timers.delete(id),
  });
  h.idle = async () => { await flush(); while (h.ctl.getStatus().syncing) await flush(); };
  h.fireTimers = async () => { for (const [id, t] of Array.from(h.timers)) { h.timers.delete(id); t.fn(); } await flush(); };
  return h;
}
const SAVED = { token: 'T0', email: 'me@example.com', lastSyncAt: null };

test('沒有登入：啟動不連網，各種通知都不做事', async () => {
  const h = harness();
  h.ctl.start();
  h.ctl.notifyChanged(); h.ctl.notifyForeground(); h.ctl.notifyHidden(); h.ctl.notifyOnline();
  await h.ctl.syncNow();
  assert.equal(h.server.calls, 0);
  assert.equal(h.timers.size, 0);
  assert.equal(h.ctl.getStatus().signedIn, false);
});

test('已登入：啟動就同步一次，雲端的紀錄併進本機，狀態與時間存起來', async () => {
  const server = makeServer(card(emptyProgress(), 'l:cloud', T1));
  const h = harness({ saved: SAVED, local: card(emptyProgress(), 'l:phone', T1), server });
  h.ctl.start();
  await h.idle();
  assert.equal(server.calls, 1);
  assert.deepEqual(Object.keys(h.current.srs).sort(), ['l:cloud', 'l:phone']);
  assert.deepEqual(Object.keys(server.progress.srs).sort(), ['l:cloud', 'l:phone']);
  const status = h.ctl.getStatus();
  assert.equal(status.lastSyncAt, 1_000_000);
  assert.equal(status.error, null);
  assert.equal(status.syncing, false);
  assert.equal(status.lastFromCloud, 1);
  assert.equal(loadSyncState(h.storage).lastSyncAt, 1_000_000);
});

test('同步完成後不會再排下一次（雲端回傳的內容順序不同也不算有變更）：不會無限同步', async () => {
  const server = makeServer(card(card(emptyProgress(), 'l:a', T1), 'l:b', T1));
  const h = harness({ saved: SAVED, local: card(emptyProgress(), 'l:c', T1), server });
  h.ctl.start();
  await h.idle();
  h.ctl.notifyChanged(); // 套用雲端內容後，進度改變會觸發這個通知
  assert.equal(h.timers.size, 0);
  h.ctl.notifyHidden();
  await flush();
  assert.equal(server.calls, 1);
});

test('連續變更只上傳一次：每次變更重新計時，到時間才送', async () => {
  const h = harness({ saved: SAVED });
  h.ctl.start();
  await h.idle();
  const calls = h.server.calls;

  for (const id of ['a', 'b', 'c']) {
    h.current = card(h.current, `l:${id}`, T2);
    h.ctl.notifyChanged();
  }
  assert.equal(h.timers.size, 1);
  assert.equal([...h.timers.values()][0].ms, CHANGE_SYNC_DELAY_MS);
  assert.equal(h.server.calls, calls);

  await h.fireTimers();
  await h.idle();
  assert.equal(h.server.calls, calls + 1);
  assert.deepEqual(Object.keys(h.server.progress.srs).sort(), ['l:a', 'l:b', 'l:c']);
});

test('同步進行中又有變更：這一輪結束後排下一次，不平行送、不遞迴', async () => {
  const h = harness({ saved: SAVED });
  let release;
  h.server.gate = new Promise((resolve) => { release = resolve; });
  h.ctl.start();
  await flush();
  assert.equal(h.ctl.getStatus().syncing, true);

  h.current = card(h.current, 'l:during', T2); // 答題發生在請求送出之後
  h.ctl.notifyChanged();
  release();
  h.server.gate = null;
  await h.idle();
  assert.equal(h.ctl.getStatus().syncing, false);
  assert.equal(h.timers.size, 1, '變更還沒上傳，要排下一次');
  assert.equal(h.server.progress.srs['l:during'], undefined);

  await h.fireTimers();
  await h.idle();
  assert.ok(h.server.progress.srs['l:during']);
});

test('同步中又被要求同步：只補一輪，不會同時送兩個請求', async () => {
  const h = harness({ saved: SAVED });
  let release;
  let concurrent = 0;
  let maxConcurrent = 0;
  const original = h.server.handle;
  h.server.handle = async (...args) => {
    concurrent++; maxConcurrent = Math.max(maxConcurrent, concurrent);
    try { return await original(...args); } finally { concurrent--; }
  };
  h.ctl = createSyncController({
    storage: h.storage, fetchImpl: h.server.handle, url: 'https://w', now: () => h.time, isOnline: () => true,
    getProgress: () => h.current, applyRemote: (r) => { h.current = mergeProgress(h.current, r).progress; },
    setTimer: () => 0, clearTimer: () => undefined,
  });
  h.server.gate = new Promise((resolve) => { release = resolve; });
  h.ctl.start();
  const second = h.ctl.syncNow();
  const third = h.ctl.syncNow();
  release();
  await Promise.all([second, third]);
  assert.equal(maxConcurrent, 1);
  assert.equal(h.server.calls, 2);
});

test('登入：成功就存 session 並立刻同步；帳號不被允許則什麼都不存', async () => {
  const h = harness({ local: card(emptyProgress(), 'l:a', T1) });
  h.ctl.start();
  assert.equal(await h.ctl.signIn('google-id-token'), true);
  assert.equal(h.ctl.getStatus().signedIn, true);
  assert.equal(h.ctl.getStatus().email, 'me@example.com');
  assert.equal(h.ctl.getStatus().signingIn, false);
  assert.equal(h.server.calls, 2); // /auth + /sync
  assert.ok(h.server.progress.srs['l:a']);
  assert.equal(loadSyncState(h.storage).token, 'SESSION');

  const denied = harness({ server: Object.assign(makeServer(), { mode: 'forbidden' }) });
  assert.equal(await denied.ctl.signIn('x'), false);
  assert.equal(denied.ctl.getStatus().signedIn, false);
  assert.match(denied.ctl.getStatus().error, /沒有使用同步的權限/);
  assert.equal(loadSyncState(denied.storage), null);
});

test('登入過期（401）：清掉登入狀態、停止排程、提醒使用者重新登入，本機進度不動', async () => {
  const h = harness({ saved: SAVED, local: card(emptyProgress(), 'l:a', T1), server: Object.assign(makeServer(), { mode: 'expired' }) });
  h.ctl.start();
  await h.ctl.syncNow();
  const status = h.ctl.getStatus();
  assert.equal(status.signedIn, false);
  assert.match(status.attention, /重新登入/);
  assert.equal(loadSyncState(h.storage), null);
  assert.ok(h.current.srs['l:a']);

  const calls = h.server.calls;
  h.current = card(h.current, 'l:b', T2);
  h.ctl.notifyChanged(); h.ctl.notifyHidden(); h.ctl.notifyForeground();
  assert.equal(h.timers.size, 0);
  assert.equal(h.server.calls, calls);

  h.ctl.dismissAttention();
  assert.equal(h.ctl.getStatus().attention, null);
});

test('連不上：仍然是登入狀態並顯示說明；之後同步成功就清掉錯誤', async () => {
  const server = makeServer();
  server.mode = 'offline';
  const h = harness({ saved: SAVED, local: card(emptyProgress(), 'l:a', T1), server });
  h.ctl.start();
  await h.ctl.syncNow();
  assert.equal(h.ctl.getStatus().signedIn, true);
  assert.match(h.ctl.getStatus().error, /本機進度照常保存/);
  assert.equal(h.ctl.getStatus().lastSyncAt, null);

  server.mode = 'ok';
  await h.ctl.syncNow();
  assert.equal(h.ctl.getStatus().error, null);
  assert.equal(h.ctl.getStatus().lastSyncAt, 1_000_000);
  assert.ok(server.progress.srs['l:a']);
});

test('瀏覽器回報離線時不送請求；雲端存檔異常（500）顯示說明且不套用', async () => {
  const offline = harness({ saved: SAVED, online: false });
  offline.ctl.start();
  await offline.ctl.syncNow();
  assert.equal(offline.server.calls, 0);
  assert.match(offline.ctl.getStatus().error, /目前離線/);

  const server = makeServer();
  server.mode = 'corrupt';
  const corrupt = harness({ saved: SAVED, server });
  corrupt.ctl.start();
  await corrupt.ctl.syncNow();
  assert.match(corrupt.ctl.getStatus().error, /雲端的進度存檔異常/);
  assert.equal(corrupt.ctl.getStatus().signedIn, true);
});

test('伺服器換發新的 session 會存起來', async () => {
  const server = makeServer();
  server.renew = 'RENEWED';
  const h = harness({ saved: SAVED, server });
  h.ctl.start();
  await h.ctl.syncNow();
  assert.equal(loadSyncState(h.storage).token, 'RENEWED');
});

test('回到前景：距離上次嘗試不到 2 分鐘不同步，夠久才同步', async () => {
  const h = harness({ saved: SAVED });
  h.ctl.start();
  await h.ctl.syncNow();
  const calls = h.server.calls;

  h.time += FOREGROUND_SYNC_INTERVAL_MS - 1;
  h.ctl.notifyForeground();
  await flush();
  assert.equal(h.server.calls, calls);

  h.time += 1;
  h.ctl.notifyForeground();
  await h.ctl.syncNow();
  assert.ok(h.server.calls > calls);
});

test('離開前景：有未上傳的變更立刻同步並取消排程，沒有變更就不送', async () => {
  const h = harness({ saved: SAVED });
  h.ctl.start();
  await h.ctl.syncNow();
  const calls = h.server.calls;

  h.ctl.notifyHidden();
  await flush();
  assert.equal(h.server.calls, calls);

  h.current = card(h.current, 'l:a', T2);
  h.ctl.notifyChanged();
  assert.equal(h.timers.size, 1);
  h.ctl.notifyHidden();
  assert.equal(h.timers.size, 0);
  await h.ctl.syncNow();
  assert.ok(h.server.progress.srs['l:a']);
});

test('登出：清掉登入狀態與排程；同步途中登出，回來的結果不套用', async () => {
  const h = harness({ saved: SAVED, local: card(emptyProgress(), 'l:a', T1), server: makeServer(card(emptyProgress(), 'l:cloud', T1)) });
  let release;
  h.server.gate = new Promise((resolve) => { release = resolve; });
  h.ctl.start();
  await flush();
  h.ctl.signOut();
  release();
  await flush(); await flush();
  assert.equal(h.ctl.getStatus().signedIn, false);
  assert.equal(loadSyncState(h.storage), null);
  assert.equal(h.current.srs['l:cloud'], undefined, '登出後不再把雲端內容併進本機');
  assert.equal(h.timers.size, 0);
});

test('套用雲端結果失敗：顯示錯誤、不更新同步時間，也不會當掉', async () => {
  const h = harness({ saved: SAVED, server: makeServer(card(emptyProgress(), 'l:cloud', T1)) });
  h.applyThrows = true;
  h.ctl.start();
  await h.ctl.syncNow();
  assert.match(h.ctl.getStatus().error, /無法套用/);
  assert.equal(h.ctl.getStatus().lastSyncAt, null);
});

test('另一個分頁登入或登出（storage 事件）時，這一頁跟著變', async () => {
  const h = harness({ saved: SAVED });
  h.ctl.start();
  await h.ctl.syncNow();
  h.storage.removeItem(SYNC_STATE_KEY);
  h.ctl.notifyStorageChanged();
  assert.equal(h.ctl.getStatus().signedIn, false);

  h.storage.setItem(SYNC_STATE_KEY, JSON.stringify({ token: 'T9', email: 'me@example.com', lastSyncAt: null }));
  h.ctl.notifyStorageChanged();
  await h.ctl.syncNow();
  assert.equal(h.ctl.getStatus().signedIn, true);
});

test('start 重複呼叫（React StrictMode）只同步一次；聽寫紀錄也一起同步', async () => {
  const h = harness({ saved: SAVED, local: recordDictation(emptyProgress(), 's.mp3', true, T1) });
  h.ctl.start(); h.ctl.start();
  await h.idle();
  assert.equal(h.server.calls, 1);
  assert.equal(h.server.progress.dictation['s.mp3'].passed, true);
  assert.equal(fingerprintProgress(h.current), fingerprintProgress(h.server.progress));
});
