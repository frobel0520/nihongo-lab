/** base64url（JWT 與同步 session 用）的編碼與解碼。Workers 與 Node 都有 btoa／atob。 */

/** @param {Uint8Array} bytes */
export function encodeBase64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * @param {string} text
 * @returns {Uint8Array<ArrayBuffer> | null} 格式不對回傳 null
 */
export function decodeBase64Url(text) {
  if (!/^[A-Za-z0-9_-]*$/.test(text)) return null;
  const padded = text.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(text.length / 4) * 4, '=');
  try {
    const binary = atob(padded);
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
  } catch {
    return null;
  }
}

/** @param {unknown} value */
export function encodeJson(value) {
  return encodeBase64Url(new TextEncoder().encode(JSON.stringify(value)));
}

/**
 * @param {string} text
 * @returns {unknown} 解不出來回傳 undefined
 */
export function decodeJson(text) {
  const bytes = decodeBase64Url(text);
  if (!bytes) return undefined;
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return undefined;
  }
}
