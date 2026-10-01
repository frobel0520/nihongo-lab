import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SYNC_STATE_KEY,
  clearSyncState,
  describeLastSync,
  loadSyncState,
  requestSession,
  requestSync,
  saveSyncState,
  shouldSyncOnForeground,
} from '../lib/sync.mjs';
import { emptyProgress, recordReview } from '../lib/progress.mjs';

const fakeStorage = (initial = {}, { failSet = false } = {}) => {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem(k, v) { if (failSet) throw new Error('quota'); data.set(k, v); },
    removeItem: (k) => data.delete(k),
  };
};
const reply = (status, body) => async () => new Response(JSON.stringify(body), { status });
const STAMP = '2026-10-01T01:00:00.000Z';
const withCard = (id = 'l:a') => recordReview(emptyProgress(), id, 'good', '2026-10-01', STAMP);

test('登入狀態：存了讀得回來；沒有、壞掉、欄位不對都當成沒登入（不丟錯）', () => {
  const storage = fakeStorage();
  assert.equal(loadSyncState(storage), null);
  assert.equal(saveSyncState(storage, { token: 't', email: 'me@example.com', lastSyncAt: 5 }), true);
  assert.deepEqual(loadSyncState(storage), { token: 't', email: 'me@example.com', lastSyncAt: 5 });

  for (const raw of ['{壞掉', '[]', 'null', '{}', JSON.stringify({ token: '', email: 'x' }), JSON.stringify({ token: 't' })]) {
    assert.equal(loadSyncState(fakeStorage({ [SYNC_STATE_KEY]: raw })), null, raw);
  }
  // lastSyncAt 不是數字就當沒同步過，但登入狀態仍有效
  assert.equal(
    loadSyncState(fakeStorage({ [SYNC_STATE_KEY]: JSON.stringify({ token: 't', email: 'e', lastSyncAt: 'x' }) })).lastSyncAt,
    null,
  );
  assert.equal(loadSyncState(null), null);
});

test('登入狀態：寫入失敗回 false；登出清得掉', () => {
  assert.equal(saveSyncState(fakeStorage({}, { failSet: true }), { token: 't', email: 'e', lastSyncAt: null }), false);
  assert.equal(saveSyncState(null, { token: 't', email: 'e', lastSyncAt: null }), false);
  const storage = fakeStorage();
  saveSyncState(storage, { token: 't', email: 'e', lastSyncAt: null });
  clearSyncState(storage);
  assert.equal(loadSyncState(storage), null);
});

test('shouldSyncOnForeground 與 describeLastSync', () => {
  assert.equal(shouldSyncOnForeground(null, 1000), true);
  assert.equal(shouldSyncOnForeground(0, 119_999), false);
  assert.equal(shouldSyncOnForeground(0, 120_000), true);

  const now = 10 * 24 * 3600 * 1000;
  assert.equal(describeLastSync(null, now), '尚未同步');
  assert.equal(describeLastSync(now - 30_000, now), '剛剛');
  assert.equal(describeLastSync(now - 5 * 60_000, now), '5 分鐘前');
  assert.equal(describeLastSync(now - 3 * 3600_000, now), '3 小時前');
  assert.equal(describeLastSync(now - 2 * 24 * 3600_000, now), '2 天前');
});

test('requestSession：成功回 token 與 email；各種失敗有固定的種類與說明', async () => {
  const ok = await requestSession({ idToken: 'g', fetchImpl: reply(200, { token: 'T', email: 'me@example.com' }) });
  assert.deepEqual(ok, { ok: true, token: 'T', email: 'me@example.com' });

  const stranger = await requestSession({ idToken: 'g', fetchImpl: reply(403, { error: 'not_allowed' }) });
  assert.equal(stranger.ok, false);
  assert.equal(stranger.kind, 'forbidden');
  assert.match(stranger.message, /沒有使用同步的權限/);

  const invalid = await requestSession({ idToken: 'g', fetchImpl: reply(401, { error: 'invalid_token' }) });
  assert.equal(invalid.kind, 'unauthorized');
  assert.match(invalid.message, /憑證無效/); // 登入階段的 401 不是「登入過期」

  const origin = await requestSession({ idToken: 'g', fetchImpl: reply(403, { error: 'origin_not_allowed' }) });
  assert.match(origin.message, /網址沒有被允許/);

  const malformed = await requestSession({ idToken: 'g', fetchImpl: reply(200, { token: 1 }) });
  assert.equal(malformed.ok, false);
});

test('requestSync：帶 Bearer、送整份進度，回應的進度驗證後回傳；換發的 token 一併帶回', async () => {
  const seen = [];
  const remote = withCard('l:cloud');
  const fetchImpl = async (url, init) => {
    seen.push({ url, init });
    return new Response(JSON.stringify({ progress: remote, changed: true, token: 'NEW' }), { status: 200 });
  };
  const result = await requestSync({ url: 'https://w.example', token: 'T', progress: withCard(), fetchImpl });
  assert.equal(result.ok, true);
  assert.deepEqual(result.progress, remote);
  assert.equal(result.token, 'NEW');
  assert.equal(seen[0].url, 'https://w.example/sync');
  assert.equal(seen[0].init.headers.Authorization, 'Bearer T');
  assert.deepEqual(JSON.parse(seen[0].init.body).progress, withCard());
  assert.equal(seen[0].init.method, 'POST');
});

test('requestSync：連不上、逾時、各種狀態碼都不丟錯，回傳種類與說明', async () => {
  const run = (fetchImpl) => requestSync({ token: 'T', progress: emptyProgress(), fetchImpl });

  const offline = await run(async () => { throw new TypeError('Failed to fetch'); });
  assert.deepEqual([offline.ok, offline.kind], [false, 'offline']);
  assert.match(offline.message, /本機進度照常保存/);

  const cases = [
    [401, { error: 'unauthorized' }, 'unauthorized', /登入已過期/],
    [403, { error: 'origin_not_allowed' }, 'forbidden', /網址沒有被允許/],
    [400, { error: 'bad_progress' }, 'invalid', /被伺服器拒絕/],
    [413, { error: 'too_large' }, 'invalid', /被伺服器拒絕/],
    [500, { error: 'stored_corrupt' }, 'server', /雲端的進度存檔異常/],
    [502, {}, 'server', /暫時出錯/],
  ];
  for (const [status, body, kind, pattern] of cases) {
    const result = await run(reply(status, body));
    assert.equal(result.kind, kind, String(status));
    assert.match(result.message, pattern, String(status));
  }

  // 回應不是 JSON（代理伺服器的錯誤頁）：靠狀態碼判斷
  const html = await run(async () => new Response('<html>Bad gateway</html>', { status: 502 }));
  assert.equal(html.kind, 'server');
});

test('requestSync：逾時會中止請求並視為離線（不會一直卡在「同步中」）', async () => {
  let aborted = false;
  const fetchImpl = (url, init) =>
    new Promise((resolve, reject) => {
      init.signal.addEventListener('abort', () => {
        aborted = true;
        reject(new DOMException('aborted', 'AbortError'));
      });
    });
  const result = await requestSync({ token: 'T', progress: emptyProgress(), fetchImpl, timeoutMs: 20 });
  assert.equal(aborted, true);
  assert.deepEqual([result.ok, result.kind], [false, 'offline']);

  const session = await requestSession({ idToken: 'g', fetchImpl, timeoutMs: 20 });
  assert.equal(session.kind, 'offline');
});

test('requestSync：雲端回的進度格式不對（壞資料、版本太新、有筆數被略過）一律不套用', async () => {
  const run = (progress) =>
    requestSync({ token: 'T', progress: emptyProgress(), fetchImpl: reply(200, { progress }) });
  const bad = [
    'x',
    null,
    { version: 99, srs: {}, dictation: {} },
    { ...emptyProgress(), srs: { a: { ease: 'x' } } },
  ];
  for (const progress of bad) {
    const result = await run(progress);
    assert.equal(result.ok, false, JSON.stringify(progress));
    assert.equal(result.kind, 'server');
  }
  assert.equal((await run(emptyProgress())).ok, true);
});
