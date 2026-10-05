import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encodeBase64Url, encodeJson } from '../worker/base64url.mjs';
import { MAX_SYNC_BYTES, handleRequest } from '../worker/handler.mjs';
import { signSession, SESSION_TTL_MS } from '../worker/session.mjs';
import { emptyProgress, recordDictation, recordReview } from '../lib/progress.mjs';

const NOW = Date.UTC(2026, 9, 1, 12, 0, 0);
const SECRET = 'a-long-enough-secret-value';
const CLIENT_ID = 'client-123.apps.googleusercontent.com';
const ORIGIN = 'https://frobel0520.github.io';

function fakeKv(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    puts: 0,
    async get(key) { return data.has(key) ? data.get(key) : null; },
    async put(key, value) { this.puts++; data.set(key, value); },
  };
}

const makeEnv = (kv = fakeKv(), over = {}) => ({
  PROGRESS: kv,
  GOOGLE_CLIENT_ID: CLIENT_ID,
  ALLOWED_EMAIL: 'me@example.com',
  SESSION_SECRET: SECRET,
  ALLOWED_ORIGINS: `${ORIGIN}, http://localhost:5183`,
  ...over,
});

async function makeIssuer() {
  const pair = await crypto.subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true,
    ['sign', 'verify'],
  );
  const jwk = { ...(await crypto.subtle.exportKey('jwk', pair.publicKey)), kid: 'k1' };
  const sign = async (claims) => {
    const head = encodeJson({ alg: 'RS256', kid: 'k1' });
    const body = encodeJson(claims);
    const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', pair.privateKey, new TextEncoder().encode(`${head}.${body}`));
    return `${head}.${body}.${encodeBase64Url(new Uint8Array(signature))}`;
  };
  return { jwk, sign };
}

let issuer;
const deps = (now = NOW) => ({ now: () => now, getJwks: async () => [issuer.jwk] });
const claims = (over = {}) => ({
  iss: 'https://accounts.google.com', aud: CLIENT_ID, sub: 'user-1', email: 'me@example.com',
  email_verified: true, iat: Math.floor(NOW / 1000), exp: Math.floor(NOW / 1000) + 3600, ...over,
});

const call = (env, path, { method = 'POST', body, token, origin = ORIGIN, now = NOW, headers = {} } = {}) => {
  const init = {
    method,
    headers: {
      ...(origin ? { Origin: origin } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
  };
  if (body !== undefined) init.body = typeof body === 'string' ? body : JSON.stringify(body);
  return handleRequest(new Request(`https://sync.example.workers.dev${path}`, init), env, deps(now));
};

const session = (over = {}) => signSession({ sub: 'user-1', email: 'me@example.com' }, SECRET, NOW + (over.issuedAt ?? 0));
const review = (progress, id, stamp) => recordReview(progress, id, 'good', '2026-10-01', stamp);

test.before(async () => { issuer = await makeIssuer(); });

test('/health：不需要憑證，也不洩漏設定', async () => {
  const response = await call(makeEnv(), '/health', { method: 'GET' });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
});

test('CORS：白名單裡的網頁拿到對應的 Allow-Origin；預檢回 204；不在白名單的來源直接 403', async () => {
  const env = makeEnv();
  const ok = await call(env, '/health', { method: 'GET', origin: 'http://localhost:5183' });
  assert.equal(ok.headers.get('Access-Control-Allow-Origin'), 'http://localhost:5183');
  assert.equal(ok.headers.get('Vary'), 'Origin');

  const preflight = await call(env, '/sync', { method: 'OPTIONS' });
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get('Access-Control-Allow-Origin'), ORIGIN);
  assert.match(preflight.headers.get('Access-Control-Allow-Headers'), /Authorization/);

  const evil = await call(env, '/sync', { origin: 'https://evil.example', body: {} });
  assert.equal(evil.status, 403);
  assert.equal(evil.headers.get('Access-Control-Allow-Origin'), null);

  // 沒有 Origin（curl、伺服器端）不帶 CORS 標頭，但沒有憑證一樣進不去
  const noOrigin = await call(env, '/sync', { origin: null, body: {} });
  assert.equal(noOrigin.status, 401);
  assert.equal(noOrigin.headers.get('Access-Control-Allow-Origin'), null);
});

test('未知路徑與錯誤方法回 404', async () => {
  const env = makeEnv();
  assert.equal((await call(env, '/nope', { method: 'GET' })).status, 404);
  assert.equal((await call(env, '/sync', { method: 'GET' })).status, 404);
  assert.equal((await call(env, '/auth', { method: 'GET' })).status, 404);
});

test('/auth：本人的 Google 憑證換到 session，用它可以同步', async () => {
  const env = makeEnv();
  const response = await call(env, '/auth', { body: { idToken: await issuer.sign(claims()) } });
  assert.equal(response.status, 200);
  const { token, email } = await response.json();
  assert.equal(email, 'me@example.com');

  const sync = await call(env, '/sync', { token, body: { progress: emptyProgress() } });
  assert.equal(sync.status, 200);
});

test('/auth：別人的帳號 403、無效憑證 401、本文格式不對 400、設定不全 500；都不發 session', async () => {
  const env = makeEnv();
  const stranger = await call(env, '/auth', { body: { idToken: await issuer.sign(claims({ email: 'x@example.com' })) } });
  assert.equal(stranger.status, 403);
  assert.deepEqual(await stranger.json(), { error: 'not_allowed' });

  const bad = await call(env, '/auth', { body: { idToken: 'a.b.c' } });
  assert.equal(bad.status, 401);
  assert.equal((await call(env, '/auth', { body: { nope: 1 } })).status, 400);
  assert.equal((await call(env, '/auth', { body: '{壞掉' })).status, 400);
  assert.equal((await call(env, '/auth', { body: 'x'.repeat(20000) })).status, 400);

  for (const missing of ['SESSION_SECRET', 'GOOGLE_CLIENT_ID', 'ALLOWED_EMAIL']) {
    const broken = makeEnv(fakeKv(), { [missing]: '' });
    const response = await call(broken, '/auth', { body: { idToken: await issuer.sign(claims()) } });
    assert.equal(response.status, 500, missing);
    assert.equal((await response.json()).token, undefined);
  }
});

test('/sync：沒有、錯誤、過期、被竄改的 session 都是 401，而且不碰 KV', async () => {
  const kv = fakeKv();
  const env = makeEnv(kv);
  const good = await session();
  const [body, sig] = good.split('.');
  const forged = `${encodeJson({ sub: 'user-1', email: 'me@example.com', exp: NOW + 10 ** 12 })}.${sig}`;
  for (const token of [undefined, 'garbage', forged, `${body}.${sig.slice(1)}A`]) {
    const response = await call(env, '/sync', { token, body: { progress: emptyProgress() } });
    assert.equal(response.status, 401, String(token).slice(0, 15));
  }
  const expired = await call(env, '/sync', { token: good, now: NOW + SESSION_TTL_MS + 1, body: { progress: emptyProgress() } });
  assert.equal(expired.status, 401);
  assert.equal(kv.puts, 0);
  assert.equal(kv.data.size, 0);
});

test('/sync：兩台裝置各自上傳，雲端合併後各自拿回完整的一份（逐筆較新的贏）', async () => {
  const kv = fakeKv();
  const env = makeEnv(kv);
  const token = await session();

  const phone = review(review(emptyProgress(), 'l:a', '2026-10-01T01:00:00.000Z'), 'l:shared', '2026-10-01T01:00:00.000Z');
  const desktop = review(recordDictation(emptyProgress(), 's.mp3', true, '2026-10-01T02:00:00.000Z'), 'l:shared', '2026-10-01T09:00:00.000Z');

  const first = await (await call(env, '/sync', { token, body: { progress: phone } })).json();
  assert.equal(first.changed, true);
  assert.deepEqual(Object.keys(first.progress.srs).sort(), ['l:a', 'l:shared']);

  const second = await (await call(env, '/sync', { token, body: { progress: desktop } })).json();
  assert.equal(second.changed, true);
  assert.deepEqual(Object.keys(second.progress.srs).sort(), ['l:a', 'l:shared']);
  assert.equal(second.progress.srs['l:shared'].updatedAt, '2026-10-01T09:00:00.000Z'); // 電腦較新
  assert.equal(second.progress.dictation['s.mp3'].passed, true);

  // 手機再同步一次（本機還是舊的）：拿回合併後的整份，包含電腦的聽寫紀錄
  const third = await (await call(env, '/sync', { token, body: { progress: phone } })).json();
  assert.equal(third.changed, false);
  assert.equal(third.progress.dictation['s.mp3'].passed, true);
  assert.equal(third.progress.srs['l:shared'].updatedAt, '2026-10-01T09:00:00.000Z');
});

test('/sync：沒有新東西時不寫 KV；不同使用者的進度分開存', async () => {
  const kv = fakeKv();
  const env = makeEnv(kv);
  const token = await session();
  const progress = review(emptyProgress(), 'l:a', '2026-10-01T01:00:00.000Z');

  await call(env, '/sync', { token, body: { progress } });
  assert.equal(kv.puts, 1);
  await call(env, '/sync', { token, body: { progress } });
  await call(env, '/sync', { token, body: { progress: emptyProgress() } });
  assert.equal(kv.puts, 1);
  assert.deepEqual([...kv.data.keys()], ['progress:user-1']);

  const other = await signSession({ sub: 'user-2', email: 'me@example.com' }, SECRET, NOW);
  const result = await (await call(env, '/sync', { token: other, body: { progress: emptyProgress() } })).json();
  assert.deepEqual(result.progress.srs, {});
});

test('/sync：版本 1 的進度（舊版 App 匯出）也收，自動轉成目前的版本 3（FSRS）；格式不對 400，太大 413', async () => {
  const env = makeEnv();
  const token = await session();
  const v1 = {
    version: 1,
    srs: { 'l:a': { ease: 2.5, interval: 1, reps: 1, lapses: 0, due: '2026-10-02', firstSeen: '2026-10-01' }, bad: { ease: 'x' } },
    dictation: {},
  };
  const ok = await (await call(env, '/sync', { token, body: { progress: v1 } })).json();
  assert.equal(ok.progress.version, 3);
  assert.equal(ok.progress.srs['l:a'].due, '2026-10-02', '轉換後到期日不變');
  assert.equal(typeof ok.progress.srs['l:a'].stability, 'number');
  assert.equal(ok.dropped, 1);
  assert.equal(ok.progress.srs['l:a'].updatedAt, '2026-10-01T00:00:00.000Z');

  for (const body of [{ progress: 'x' }, { progress: null }, {}, { progress: { version: 99, srs: {}, dictation: {} } }]) {
    const response = await call(env, '/sync', { token, body });
    assert.equal(response.status, 400, JSON.stringify(body));
  }
  assert.equal((await call(env, '/sync', { token, body: '[]' })).status, 400);
  assert.equal((await call(env, '/sync', { token, body: '{壞掉' })).status, 400);
  const huge = await call(env, '/sync', { token, body: `{"progress":"${'x'.repeat(MAX_SYNC_BYTES)}"}` });
  assert.equal(huge.status, 413);
});

test('/sync：雲端存檔壞掉時不覆蓋它，回 500', async () => {
  for (const stored of ['{壞掉', JSON.stringify({ version: 99 }), JSON.stringify({ ...emptyProgress(), srs: { x: { ease: 'bad' } } })]) {
    const kv = fakeKv({ 'progress:user-1': stored });
    const env = makeEnv(kv);
    const response = await call(env, '/sync', { token: await session(), body: { progress: review(emptyProgress(), 'l:a', '2026-10-01T01:00:00.000Z') } });
    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), { error: 'stored_corrupt' });
    assert.equal(kv.data.get('progress:user-1'), stored);
    assert.equal(kv.puts, 0);
  }
});

test('/sync：session 剩不到 15 天時換發新的，剩得多就不換', async () => {
  const env = makeEnv();
  const fresh = await session();
  const noRenew = await (await call(env, '/sync', { token: fresh, body: { progress: emptyProgress() } })).json();
  assert.equal(noRenew.token, undefined);

  const later = NOW + 20 * 24 * 60 * 60 * 1000; // 簽發後 20 天，剩 10 天
  const renewed = await (await call(env, '/sync', { token: fresh, now: later, body: { progress: emptyProgress() } })).json();
  assert.equal(typeof renewed.token, 'string');
  const again = await call(env, '/sync', { token: renewed.token, now: later, body: { progress: emptyProgress() } });
  assert.equal(again.status, 200);
});
