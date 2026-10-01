import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encodeBase64Url, encodeJson } from '../worker/base64url.mjs';
import { verifyGoogleIdToken } from '../worker/google-token.mjs';
import { signSession, verifySession, SESSION_TTL_MS } from '../worker/session.mjs';

const CLIENT_ID = 'client-123.apps.googleusercontent.com';
const NOW = Date.UTC(2026, 9, 1, 12, 0, 0);
const sec = (ms) => Math.floor(ms / 1000);

/** 產生一組測試用的 RSA 金鑰，並提供 Google 風格的 JWKS 與簽發憑證的函式。 */
async function makeIssuer(kid = 'kid-1') {
  const pair = await crypto.subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true,
    ['sign', 'verify'],
  );
  const jwk = { ...(await crypto.subtle.exportKey('jwk', pair.publicKey)), kid };
  const sign = async (claims, header = { alg: 'RS256', kid, typ: 'JWT' }) => {
    const head = encodeJson(header);
    const body = encodeJson(claims);
    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      pair.privateKey,
      new TextEncoder().encode(`${head}.${body}`),
    );
    return `${head}.${body}.${encodeBase64Url(new Uint8Array(signature))}`;
  };
  return { jwk, sign };
}

const goodClaims = (over = {}) => ({
  iss: 'https://accounts.google.com',
  aud: CLIENT_ID,
  sub: '1234567890',
  email: 'Me@Example.com',
  email_verified: true,
  iat: sec(NOW) - 10,
  exp: sec(NOW) + 3600,
  ...over,
});

const options = (jwks, over = {}) => ({
  clientId: CLIENT_ID,
  allowedEmails: ['me@example.com'],
  now: NOW,
  getJwks: async () => jwks,
  ...over,
});

test('Google 憑證：簽名、發行者、對象、有效期、email 都對就通過（email 比對不分大小寫）', async () => {
  const { jwk, sign } = await makeIssuer();
  const result = await verifyGoogleIdToken(await sign(goodClaims()), options([jwk]));
  assert.deepEqual(result, { ok: true, sub: '1234567890', email: 'me@example.com' });

  const legacy = await sign(goodClaims({ iss: 'accounts.google.com' }));
  assert.equal((await verifyGoogleIdToken(legacy, options([jwk]))).ok, true);
});

test('Google 憑證：任何一項不對都拒絕（發行者、對象、過期、email 未驗證、缺 sub）', async () => {
  const { jwk, sign } = await makeIssuer();
  const cases = {
    wrongIssuer: goodClaims({ iss: 'https://evil.example' }),
    wrongAudience: goodClaims({ aud: 'someone-else' }),
    expired: goodClaims({ exp: sec(NOW) - 1 }),
    unverifiedEmail: goodClaims({ email_verified: false }),
    stringVerified: goodClaims({ email_verified: 'true' }),
    noEmail: goodClaims({ email: undefined }),
    noSub: goodClaims({ sub: '' }),
    issuedInFuture: goodClaims({ iat: sec(NOW) + 3600 }),
  };
  for (const [name, claims] of Object.entries(cases)) {
    const result = await verifyGoogleIdToken(await sign(claims), options([jwk]));
    assert.deepEqual(result, { ok: false, reason: 'invalid' }, name);
  }
});

test('Google 憑證：email 不在白名單回 not_allowed（與無效憑證區分，也不洩漏白名單內容）', async () => {
  const { jwk, sign } = await makeIssuer();
  const token = await sign(goodClaims({ email: 'stranger@example.com' }));
  assert.deepEqual(await verifyGoogleIdToken(token, options([jwk])), {
    ok: false,
    reason: 'not_allowed',
  });
  // 白名單是空的：誰都不放行
  assert.equal(
    (await verifyGoogleIdToken(await sign(goodClaims()), options([jwk], { allowedEmails: [] }))).ok,
    false,
  );
});

test('Google 憑證：被竄改、簽名是別把金鑰簽的、alg 不是 RS256、格式不對都拒絕', async () => {
  const { jwk, sign } = await makeIssuer();
  const other = await makeIssuer('kid-1'); // 同一個 kid，不同金鑰
  const good = await sign(goodClaims());

  const [h, , s] = good.split('.');
  const tampered = `${h}.${encodeJson(goodClaims({ email: 'stranger@example.com' }))}.${s}`;
  const forged = await other.sign(goodClaims());
  const noneAlg = await sign(goodClaims(), { alg: 'none', kid: 'kid-1' });
  const hs256 = await sign(goodClaims(), { alg: 'HS256', kid: 'kid-1' });

  for (const token of [tampered, forged, noneAlg, hs256, 'a.b', 'a.b.c.d', '', '....', `${h}.${encodeJson(goodClaims())}.***`]) {
    const result = await verifyGoogleIdToken(token, options([jwk]));
    assert.equal(result.ok, false, token.slice(0, 30));
  }
  assert.equal((await verifyGoogleIdToken(/** @type {any} */ (undefined), options([jwk]))).ok, false);
});

test('Google 憑證：找不到 kid 時重抓一次金鑰（金鑰輪換），重抓後仍找不到就拒絕', async () => {
  const { jwk, sign } = await makeIssuer('new-kid');
  const calls = [];
  const getJwks = async (force) => {
    calls.push(force);
    return force ? [jwk] : [];
  };
  const token = await sign(goodClaims());
  assert.equal((await verifyGoogleIdToken(token, options([], { getJwks }))).ok, true);
  assert.deepEqual(calls, [false, true]);

  const stillMissing = [];
  const result = await verifyGoogleIdToken(token, options([], {
    getJwks: async (force) => { stillMissing.push(force); return []; },
  }));
  assert.equal(result.ok, false);
  assert.deepEqual(stillMissing, [false, true]);
});

test('session：簽發後可驗證，內容原樣取回，到期時間是簽發時間加 30 天', async () => {
  const secret = 'a-long-enough-secret-value';
  const token = await signSession({ sub: 'u1', email: 'me@example.com' }, secret, NOW);
  assert.deepEqual(await verifySession(token, secret, NOW + 1000), {
    sub: 'u1',
    email: 'me@example.com',
    exp: NOW + SESSION_TTL_MS,
  });
});

test('session：過期、換了金鑰、被竄改、格式不對都回 null', async () => {
  const secret = 'a-long-enough-secret-value';
  const token = await signSession({ sub: 'u1', email: 'me@example.com' }, secret, NOW);
  assert.equal(await verifySession(token, secret, NOW + SESSION_TTL_MS), null);
  assert.equal(await verifySession(token, secret, NOW + SESSION_TTL_MS + 1), null);
  assert.equal(await verifySession(token, 'another-long-enough-secret', NOW), null);

  const [body, sig] = token.split('.');
  const forgedBody = encodeJson({ sub: 'admin', email: 'x@example.com', exp: NOW + 10 ** 12 });
  for (const bad of [`${forgedBody}.${sig}`, `${body}.${sig.slice(1)}A`, body, `${body}.`, '', 'x.y.z', `${body}.***`]) {
    assert.equal(await verifySession(bad, secret, NOW), null, bad.slice(0, 20));
  }
  assert.equal(await verifySession(/** @type {any} */ (null), secret, NOW), null);
});

test('session：金鑰太短或沒設定時，簽發丟錯、驗證一律失敗（不會用空金鑰放行）', async () => {
  await assert.rejects(signSession({ sub: 'u', email: 'e' }, '', NOW), /SESSION_SECRET/);
  await assert.rejects(signSession({ sub: 'u', email: 'e' }, 'short', NOW), /SESSION_SECRET/);
  const token = await signSession({ sub: 'u', email: 'e' }, 'a-long-enough-secret-value', NOW);
  assert.equal(await verifySession(token, '', NOW), null);
  assert.equal(await verifySession(token, /** @type {any} */ (undefined), NOW), null);
});
