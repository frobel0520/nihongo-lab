/**
 * 同步用的 session：Google 的身分憑證一小時就過期，所以驗證過一次之後由 Worker 自己發一個
 * 長效憑證（HMAC-SHA256 簽名），之後同步只帶它。簽名金鑰是 Worker secret，不進 repo。
 *
 * 格式：base64url(payload JSON) + '.' + base64url(HMAC)；payload 為 { sub, email, exp }。
 *
 * @typedef {{ sub: string, email: string, exp: number }} Session
 */
import {
  decodeBase64Url,
  decodeJson,
  encodeBase64Url,
  encodeJson,
} from './base64url.mjs';

export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
/** 剩餘不到這麼久就在回應裡換發新的，常用的裝置不用重新登入。 */
export const RENEW_BELOW_MS = 15 * 24 * 60 * 60 * 1000;
const MIN_SECRET_LENGTH = 16;

/** @param {string} secret */
function importKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

/**
 * @param {{ sub: string, email: string }} identity
 * @param {string} secret
 * @param {number} now 毫秒
 */
export async function signSession(identity, secret, now) {
  if (typeof secret !== 'string' || secret.length < MIN_SECRET_LENGTH) {
    throw new Error('SESSION_SECRET 太短或沒有設定');
  }
  const body = encodeJson({
    sub: identity.sub,
    email: identity.email,
    exp: now + SESSION_TTL_MS,
  });
  const key = await importKey(secret);
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(body),
  );
  return `${body}.${encodeBase64Url(new Uint8Array(signature))}`;
}

/**
 * @param {string} token
 * @param {string} secret
 * @param {number} now 毫秒
 * @returns {Promise<Session | null>} 簽名不對、格式不對或過期都回傳 null
 */
export async function verifySession(token, secret, now) {
  if (typeof token !== 'string' || typeof secret !== 'string') return null;
  if (secret.length < MIN_SECRET_LENGTH) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [body, signature] = parts;
  const signatureBytes = decodeBase64Url(signature);
  if (!signatureBytes) return null;

  const key = await importKey(secret);
  const valid = await crypto.subtle.verify(
    'HMAC',
    key,
    signatureBytes,
    new TextEncoder().encode(body),
  );
  if (!valid) return null;

  const payload = decodeJson(body);
  if (typeof payload !== 'object' || payload === null) return null;
  const { sub, email, exp } = /** @type {Record<string, unknown>} */ (payload);
  if (typeof sub !== 'string' || typeof email !== 'string') return null;
  if (typeof exp !== 'number' || !(exp > now)) return null;
  return { sub, email, exp };
}
