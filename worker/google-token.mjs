/**
 * 驗證 Google 的身分憑證（ID token，RS256 的 JWT）：簽名、發行者、對象（本 App 的 Client ID）、
 * 有效期、email 已驗證，並且 email 在白名單內。簽章金鑰（JWKS）由呼叫端注入，測試不用連網。
 *
 * @typedef {{ kid: string, kty: string, n: string, e: string, alg?: string }} Jwk
 * @typedef {{ ok: true, sub: string, email: string } | { ok: false, reason: 'invalid' | 'not_allowed' }} VerifyResult
 */
import { decodeBase64Url, decodeJson } from './base64url.mjs';

const ISSUERS = ['https://accounts.google.com', 'accounts.google.com'];
const CLOCK_SKEW_MS = 60 * 1000;

/** @param {Jwk} jwk */
function importKey(jwk) {
  return crypto.subtle.importKey(
    'jwk',
    { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );
}

/**
 * @param {string} idToken
 * @param {{
 *   clientId: string,
 *   allowedEmails: string[],
 *   now: number,
 *   getJwks: (forceRefresh: boolean) => Promise<Jwk[]>,
 * }} options
 * @returns {Promise<VerifyResult>}
 */
export async function verifyGoogleIdToken(idToken, options) {
  const invalid = /** @type {const} */ ({ ok: false, reason: 'invalid' });
  if (typeof idToken !== 'string') return invalid;
  const parts = idToken.split('.');
  if (parts.length !== 3) return invalid;
  const [headerPart, payloadPart, signaturePart] = parts;

  const header = decodeJson(headerPart);
  if (typeof header !== 'object' || header === null) return invalid;
  const { alg, kid } = /** @type {Record<string, unknown>} */ (header);
  if (alg !== 'RS256' || typeof kid !== 'string') return invalid;

  const signature = decodeBase64Url(signaturePart);
  if (!signature) return invalid;

  // 找簽章金鑰；找不到 kid 時重抓一次（Google 輪換金鑰的當下）
  let jwk = (await options.getJwks(false)).find((key) => key.kid === kid);
  if (!jwk) jwk = (await options.getJwks(true)).find((key) => key.kid === kid);
  if (!jwk) return invalid;

  let verified = false;
  try {
    verified = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      await importKey(jwk),
      signature,
      new TextEncoder().encode(`${headerPart}.${payloadPart}`),
    );
  } catch {
    return invalid;
  }
  if (!verified) return invalid;

  const payload = decodeJson(payloadPart);
  if (typeof payload !== 'object' || payload === null) return invalid;
  const claims = /** @type {Record<string, unknown>} */ (payload);

  if (typeof claims.iss !== 'string' || !ISSUERS.includes(claims.iss)) {
    return invalid;
  }
  if (claims.aud !== options.clientId) return invalid;
  if (typeof claims.exp !== 'number' || claims.exp * 1000 <= options.now) {
    return invalid;
  }
  if (
    typeof claims.iat === 'number' &&
    claims.iat * 1000 > options.now + CLOCK_SKEW_MS
  ) {
    return invalid;
  }
  if (typeof claims.sub !== 'string' || claims.sub === '') return invalid;
  if (typeof claims.email !== 'string' || claims.email_verified !== true) {
    return invalid;
  }

  const email = claims.email.toLowerCase();
  if (!options.allowedEmails.includes(email)) {
    return { ok: false, reason: 'not_allowed' };
  }
  return { ok: true, sub: claims.sub, email };
}
