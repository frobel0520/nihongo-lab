/**
 * Cloudflare Worker 進入點：把 KV、時間與 Google 簽章金鑰接到 handler.mjs。
 * 部署與設定見 docs/project-sd.md「跨裝置同步」。
 */
import { handleRequest } from './handler.mjs';

const GOOGLE_JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
const JWKS_TTL_MS = 60 * 60 * 1000;
/** 強制重抓的最短間隔，避免有人拿一直換 kid 的假憑證逼我們狂打 Google。 */
const JWKS_REFRESH_MIN_MS = 5 * 60 * 1000;

/** @type {{ keys: import('./google-token.mjs').Jwk[], fetchedAt: number } | null} */
let jwksCache = null;

/** @param {boolean} forceRefresh */
async function getJwks(forceRefresh) {
  const now = Date.now();
  const age = jwksCache ? now - jwksCache.fetchedAt : Infinity;
  if (jwksCache && age < JWKS_TTL_MS && !(forceRefresh && age > JWKS_REFRESH_MIN_MS)) {
    return jwksCache.keys;
  }
  const response = await fetch(GOOGLE_JWKS_URL);
  if (!response.ok) {
    if (jwksCache) return jwksCache.keys; // Google 暫時連不上時，沿用舊的
    throw new Error(`取得 Google 簽章金鑰失敗：HTTP ${response.status}`);
  }
  const data = /** @type {{ keys: import('./google-token.mjs').Jwk[] }} */ (
    await response.json()
  );
  jwksCache = { keys: data.keys, fetchedAt: now };
  return data.keys;
}

const worker = {
  /**
   * @param {Request} request
   * @param {import('./handler.mjs').Env} env
   */
  async fetch(request, env) {
    try {
      return await handleRequest(request, env, { now: Date.now, getJwks });
    } catch (error) {
      console.error('sync worker error', error);
      return new Response(JSON.stringify({ error: 'internal' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      });
    }
  },
};

export default worker;
