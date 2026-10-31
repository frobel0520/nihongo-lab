/**
 * 同步端點（Cloudflare Worker）的請求處理。純邏輯：KV、時間、Google 簽章金鑰都由呼叫端注入，
 * 所以可以用 node --test 驗證，不用連網。
 *
 * - POST /auth   { idToken }  → Google 憑證驗證通過且 email 在白名單，以 HttpOnly cookie 換發 session
 * - POST /sync   { progress } → 與雲端的進度合併（lib/progress-merge.mjs，與匯入檔案同一套規則），
 *                               存回並把合併結果還給裝置；session 從 cookie 讀
 * - POST /logout               → 清掉 session cookie
 * - GET  /health               → 確認部署
 *
 * 網頁由同一個 Worker 的 static assets 提供（/nihongo-lab/），與 API 同源：不開 CORS，
 * session 放在 HttpOnly cookie，頁面腳本讀不到。原本網頁放在 frobel0520.github.io，那是所有
 * GitHub Pages 專案共用的 origin，存在 localStorage 的 token 任何一個 Pages 站都讀得到（SEC-P1-20261031）。
 * 改資料的請求必須帶本站的 Origin（或 Sec-Fetch-Site: same-origin），擋掉跨站與同站其他 *.workers.dev。
 *
 * 一次 POST /sync 同時是「上傳」與「下載」：裝置把整份本機進度送上來，拿回合併後的整份，
 * 所以 KV 的最終一致性只會讓收斂慢一點（下次同步會再補上），不會讓資料永久遺失。
 *
 * @typedef {{
 *   get(key: string): Promise<string | null>,
 *   put(key: string, value: string): Promise<void>,
 * }} KvLike
 * @typedef {{
 *   PROGRESS: KvLike,
 *   GOOGLE_CLIENT_ID: string,
 *   ALLOWED_EMAIL: string,
 *   SESSION_SECRET: string,
 * }} Env
 * @typedef {{
 *   now: () => number,
 *   getJwks: (forceRefresh: boolean) => Promise<import('./google-token.mjs').Jwk[]>,
 * }} Deps
 */
import { mergeProgress } from '../lib/progress-merge.mjs';
import {
  emptyProgress,
  parseProgress,
  serializeProgress,
} from '../lib/progress.mjs';
import { verifyGoogleIdToken } from './google-token.mjs';
import { RENEW_BELOW_MS, SESSION_TTL_MS, signSession, verifySession } from './session.mjs';

/** 進度 JSON 約 200KB（上千張卡），超過就是送錯東西。 */
export const MAX_SYNC_BYTES = 2 * 1024 * 1024;
const MAX_AUTH_BYTES = 16 * 1024;

/** `__Host-` 前綴強制 Secure、Path=/、不可帶 Domain：cookie 只屬於這個 Worker 的主機名稱。 */
export const SESSION_COOKIE = '__Host-nihongo_session';

/**
 * @param {string} token
 * @param {number} maxAgeSeconds
 */
export function sessionCookie(token, maxAgeSeconds) {
  return `${SESSION_COOKIE}=${token}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=${maxAgeSeconds}`;
}

export const CLEARED_SESSION_COOKIE = `${SESSION_COOKIE}=; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=0`;

/** @param {Request} request */
function readSessionCookie(request) {
  const header = request.headers.get('Cookie');
  if (!header) return '';
  for (const part of header.split(';')) {
    const index = part.indexOf('=');
    if (index !== -1 && part.slice(0, index).trim() === SESSION_COOKIE) {
      return part.slice(index + 1).trim();
    }
  }
  return '';
}

/**
 * 改資料的請求只接受本站發出的：有 Origin 就要與本站相同，沒有 Origin 時看 Sec-Fetch-Site。
 *
 * @param {Request} request
 * @param {URL} url
 */
function isSameOriginRequest(request, url) {
  const origin = request.headers.get('Origin');
  if (origin !== null) return origin === url.origin;
  return request.headers.get('Sec-Fetch-Site') === 'same-origin';
}

/** @param {string} sub */
const progressKey = (sub) => `progress:${sub}`;

/** @param {string} list */
const splitList = (list) =>
  (list ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

/**
 * @param {unknown} body
 * @param {number} status
 * @param {Record<string, string>} headers
 */
function json(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}

/**
 * 讀請求本文並限制大小；回傳 null 表示太大。
 *
 * @param {Request} request
 * @param {number} limit
 */
async function readBody(request, limit) {
  const declared = Number(request.headers.get('Content-Length'));
  if (Number.isFinite(declared) && declared > limit) return null;
  const text = await request.text();
  return new TextEncoder().encode(text).length > limit ? null : text;
}

/**
 * @param {string} text
 * @returns {Record<string, unknown> | null}
 */
function parseObject(text) {
  try {
    const value = JSON.parse(text);
    return typeof value === 'object' && value !== null && !Array.isArray(value)
      ? value
      : null;
  } catch {
    return null;
  }
}

/**
 * @param {Request} request
 * @param {Env} env
 * @param {Deps} deps
 * @returns {Promise<Response>}
 */
export async function handleRequest(request, env, deps) {
  const url = new URL(request.url);

  if (url.pathname === '/health' && request.method === 'GET') {
    return json({ ok: true }, 200, {});
  }

  if (request.method === 'POST' && !isSameOriginRequest(request, url)) {
    return json({ error: 'origin_not_allowed' }, 403, {});
  }

  if (url.pathname === '/auth' && request.method === 'POST') {
    return handleAuth(request, env, deps, {});
  }
  if (url.pathname === '/sync' && request.method === 'POST') {
    return handleSync(request, env, deps, {});
  }
  if (url.pathname === '/logout' && request.method === 'POST') {
    return json({ ok: true }, 200, { 'Set-Cookie': CLEARED_SESSION_COOKIE });
  }
  return json({ error: 'not_found' }, 404, {});
}

/**
 * @param {Request} request
 * @param {Env} env
 * @param {Deps} deps
 * @param {Record<string, string>} cors
 */
async function handleAuth(request, env, deps, cors) {
  if (!env.SESSION_SECRET || !env.GOOGLE_CLIENT_ID || !env.ALLOWED_EMAIL) {
    return json({ error: 'misconfigured' }, 500, cors);
  }
  const text = await readBody(request, MAX_AUTH_BYTES);
  const body = text === null ? null : parseObject(text);
  if (!body || typeof body.idToken !== 'string') {
    return json({ error: 'bad_request' }, 400, cors);
  }

  const now = deps.now();
  const result = await verifyGoogleIdToken(body.idToken, {
    clientId: env.GOOGLE_CLIENT_ID,
    allowedEmails: splitList(env.ALLOWED_EMAIL).map((e) => e.toLowerCase()),
    now,
    getJwks: deps.getJwks,
  });
  if (!result.ok) {
    return result.reason === 'not_allowed'
      ? json({ error: 'not_allowed' }, 403, cors)
      : json({ error: 'invalid_token' }, 401, cors);
  }

  const token = await signSession(
    { sub: result.sub, email: result.email },
    env.SESSION_SECRET,
    now,
  );
  return json({ email: result.email }, 200, {
    ...cors,
    'Set-Cookie': sessionCookie(token, Math.floor(SESSION_TTL_MS / 1000)),
  });
}

/**
 * @param {Request} request
 * @param {Env} env
 * @param {Deps} deps
 * @param {Record<string, string>} cors
 */
async function handleSync(request, env, deps, cors) {
  if (!env.SESSION_SECRET) return json({ error: 'misconfigured' }, 500, cors);

  const token = readSessionCookie(request);
  const now = deps.now();
  const session = await verifySession(token, env.SESSION_SECRET, now);
  if (!session) return json({ error: 'unauthorized' }, 401, cors);

  const text = await readBody(request, MAX_SYNC_BYTES);
  if (text === null) return json({ error: 'too_large' }, 413, cors);
  const body = parseObject(text);
  if (!body) return json({ error: 'bad_request' }, 400, cors);

  const incoming = parseProgress(JSON.stringify(body.progress) ?? 'null');
  if (incoming.problem) return json({ error: 'bad_progress' }, 400, cors);

  const key = progressKey(session.sub);
  const stored = await env.PROGRESS.get(key);
  let current = emptyProgress();
  if (stored !== null) {
    const parsed = parseProgress(stored);
    // 雲端的存檔讀不懂時不覆蓋它：寧可這次同步失敗，也不要把唯一的雲端副本蓋壞
    if (parsed.problem || parsed.dropped > 0) {
      return json({ error: 'stored_corrupt' }, 500, cors);
    }
    current = parsed.progress;
  }

  const { progress: merged } = mergeProgress(current, incoming.progress);
  const serialized = serializeProgress(merged);
  const changed = serialized !== stored;
  if (changed) await env.PROGRESS.put(key, serialized);

  /** @type {Record<string, unknown>} */
  const response = { progress: merged, changed, dropped: incoming.dropped };
  /** @type {Record<string, string>} */
  const headers = { ...cors };
  if (session.exp - now < RENEW_BELOW_MS) {
    const renewed = await signSession(
      { sub: session.sub, email: session.email },
      env.SESSION_SECRET,
      now,
    );
    headers['Set-Cookie'] = sessionCookie(renewed, Math.floor(SESSION_TTL_MS / 1000));
  }
  return json(response, 200, headers);
}
