/**
 * 同步端點（Cloudflare Worker）的請求處理。純邏輯：KV、時間、Google 簽章金鑰都由呼叫端注入，
 * 所以可以用 node --test 驗證，不用連網。
 *
 * - POST /auth   { idToken }  → Google 憑證驗證通過且 email 在白名單，換發同步用的 session
 * - POST /sync   { progress } → 與雲端的進度合併（lib/progress-merge.mjs，與匯入檔案同一套規則），
 *                               存回並把合併結果還給裝置；Authorization: Bearer <session>
 * - GET  /health               → 確認部署
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
 *   ALLOWED_ORIGINS: string,
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
import { RENEW_BELOW_MS, signSession, verifySession } from './session.mjs';

/** 進度 JSON 約 200KB（上千張卡），超過就是送錯東西。 */
export const MAX_SYNC_BYTES = 2 * 1024 * 1024;
const MAX_AUTH_BYTES = 16 * 1024;

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
  const origin = request.headers.get('Origin');
  const allowedOrigins = splitList(env.ALLOWED_ORIGINS);

  /** @type {Record<string, string>} */
  const cors = {};
  if (origin !== null) {
    // 瀏覽器一定會帶 Origin；不在白名單的網頁直接擋掉（curl 沒有 Origin，但沒有憑證一樣進不來）
    if (!allowedOrigins.includes(origin)) {
      return json({ error: 'origin_not_allowed' }, 403, {});
    }
    cors['Access-Control-Allow-Origin'] = origin;
    cors.Vary = 'Origin';
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        ...cors,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  if (url.pathname === '/health' && request.method === 'GET') {
    return json({ ok: true }, 200, cors);
  }

  if (url.pathname === '/auth' && request.method === 'POST') {
    return handleAuth(request, env, deps, cors);
  }
  if (url.pathname === '/sync' && request.method === 'POST') {
    return handleSync(request, env, deps, cors);
  }
  return json({ error: 'not_found' }, 404, cors);
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
  return json({ token, email: result.email }, 200, cors);
}

/**
 * @param {Request} request
 * @param {Env} env
 * @param {Deps} deps
 * @param {Record<string, string>} cors
 */
async function handleSync(request, env, deps, cors) {
  if (!env.SESSION_SECRET) return json({ error: 'misconfigured' }, 500, cors);

  const header = request.headers.get('Authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
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
  if (session.exp - now < RENEW_BELOW_MS) {
    response.token = await signSession(
      { sub: session.sub, email: session.email },
      env.SESSION_SECRET,
      now,
    );
  }
  return json(response, 200, cors);
}
