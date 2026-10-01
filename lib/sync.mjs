/**
 * 跨裝置同步的用戶端邏輯（T30）：與同步 Worker 說話的兩個請求、登入狀態的儲存、狀態文字。
 * 純邏輯：網路（fetch）與儲存空間都由呼叫端注入，所以斷線、逾時、各種錯誤回應都能用 node --test 驗證。
 * Worker 端見 worker/；整體設計見 docs/project-sd.md「跨裝置同步」。
 *
 * @typedef {import('./progress.mjs').Progress} Progress
 * @typedef {import('./progress-store.mjs').StorageLike} StorageLike
 * @typedef {{ token: string, email: string, lastSyncAt: number | null }} SyncState
 * @typedef {'offline' | 'unauthorized' | 'forbidden' | 'server' | 'invalid'} FailureKind
 * @typedef {{ ok: false, kind: FailureKind, message: string }} Failure
 * @typedef {typeof fetch} FetchLike
 */
import { parseProgress } from './progress.mjs';

/** 同步 Worker 的網址與 Google OAuth 用戶端 ID（都是公開值，網頁原始碼本來就看得到）。 */
export const SYNC_URL = 'https://nihongo-sync.curio-lab.workers.dev';
export const GOOGLE_CLIENT_ID =
  '44081305799-ue51eubceqcnmmotp49b67rkgi6qu33v.apps.googleusercontent.com';

/** 登入狀態（session）存在這裡，與學習進度分開，匯出進度時不會帶出去。 */
export const SYNC_STATE_KEY = 'nihongo-lab:sync:v1';
/** 回到前景時最多每 2 分鐘同步一次。 */
export const FOREGROUND_SYNC_INTERVAL_MS = 2 * 60 * 1000;
/** 進度有變更後，等這麼久沒有新變更再上傳（連續答題時不會每張都打一次）。 */
export const CHANGE_SYNC_DELAY_MS = 8 * 1000;
export const REQUEST_TIMEOUT_MS = 20 * 1000;

/**
 * 讀登入狀態；沒有、壞掉、欄位不對都回 null（視為沒登入），不丟錯。
 *
 * @param {StorageLike | null} storage
 * @returns {SyncState | null}
 */
export function loadSyncState(storage) {
  try {
    const raw = storage?.getItem(SYNC_STATE_KEY) ?? null;
    if (raw === null) return null;
    const data = JSON.parse(raw);
    if (
      typeof data !== 'object' ||
      data === null ||
      typeof data.token !== 'string' ||
      data.token === '' ||
      typeof data.email !== 'string'
    ) {
      return null;
    }
    const lastSyncAt =
      typeof data.lastSyncAt === 'number' && Number.isFinite(data.lastSyncAt)
        ? data.lastSyncAt
        : null;
    return { token: data.token, email: data.email, lastSyncAt };
  } catch {
    return null;
  }
}

/**
 * @param {StorageLike | null} storage
 * @param {SyncState} state
 * @returns {boolean} 有沒有存成功
 */
export function saveSyncState(storage, state) {
  try {
    if (!storage) return false;
    storage.setItem(SYNC_STATE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

/** @param {{ removeItem(key: string): void } | null} storage */
export function clearSyncState(storage) {
  try {
    storage?.removeItem(SYNC_STATE_KEY);
  } catch {
    // 清不掉也沒辦法，下一次讀取仍會被當成有效的狀態；呼叫端的記憶體狀態已經登出
  }
}

/**
 * @param {number | null} lastSyncAt
 * @param {number} now
 * @param {number} [interval]
 */
export function shouldSyncOnForeground(
  lastSyncAt,
  now,
  interval = FOREGROUND_SYNC_INTERVAL_MS,
) {
  return lastSyncAt === null || now - lastSyncAt >= interval;
}

/**
 * 「上次同步」的文字。
 *
 * @param {number | null} lastSyncAt
 * @param {number} now
 */
export function describeLastSync(lastSyncAt, now) {
  if (lastSyncAt === null) return '尚未同步';
  const minutes = Math.floor((now - lastSyncAt) / 60000);
  if (minutes < 1) return '剛剛';
  if (minutes < 60) return `${minutes} 分鐘前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小時前`;
  return `${Math.floor(hours / 24)} 天前`;
}

const MESSAGES = {
  offline: '連不上同步伺服器，本機進度照常保存，連上網路後會再同步。',
  unauthorized: '同步的登入已過期，請到設定頁重新登入。',
  not_allowed: '這個 Google 帳號沒有使用同步的權限。',
  origin_not_allowed: '這個網址沒有被允許使用同步。',
  stored_corrupt:
    '雲端的進度存檔異常，已暫停同步（本機進度不受影響，不會被覆蓋）。',
  server: '同步伺服器暫時出錯，稍後會再試。',
  invalid: '同步請求被伺服器拒絕，請更新 App 後再試。',
  bad_response: '同步伺服器回應的內容無法辨識，這次的結果沒有套用。',
};

/**
 * 送一個 POST 並把各種失敗整理成固定的種類與給使用者看的訊息。
 *
 * @param {{
 *   url: string,
 *   path: string,
 *   body: unknown,
 *   token?: string,
 *   fetchImpl: FetchLike,
 *   timeoutMs?: number,
 * }} request
 * @returns {Promise<{ ok: true, data: Record<string, unknown> } | Failure>}
 */
async function post({ url, path, body, token, fetchImpl, timeoutMs }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs ?? REQUEST_TIMEOUT_MS);
  /** @type {Response} */
  let response;
  try {
    response = await fetchImpl(`${url}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    // 離線、DNS、被擋、逾時都在這裡；本機進度不受影響
    return { ok: false, kind: 'offline', message: MESSAGES.offline };
  } finally {
    clearTimeout(timer);
  }

  /** @type {Record<string, unknown>} */
  let data = {};
  try {
    const parsed = await response.json();
    if (typeof parsed === 'object' && parsed !== null) data = parsed;
  } catch {
    // 回應不是 JSON（例如代理伺服器的錯誤頁）：靠狀態碼判斷
  }

  if (response.ok) return { ok: true, data };

  const code = typeof data.error === 'string' ? data.error : '';
  if (response.status === 401) {
    return { ok: false, kind: 'unauthorized', message: MESSAGES.unauthorized };
  }
  if (response.status === 403) {
    const message =
      code === 'not_allowed'
        ? MESSAGES.not_allowed
        : code === 'origin_not_allowed'
          ? MESSAGES.origin_not_allowed
          : MESSAGES.invalid;
    return { ok: false, kind: 'forbidden', message };
  }
  if (response.status >= 500) {
    const message =
      code === 'stored_corrupt' ? MESSAGES.stored_corrupt : MESSAGES.server;
    return { ok: false, kind: 'server', message };
  }
  return { ok: false, kind: 'invalid', message: MESSAGES.invalid };
}

/**
 * 用 Google 的身分憑證換同步用的 session。
 *
 * @param {{ url?: string, idToken: string, fetchImpl: FetchLike, timeoutMs?: number }} options
 * @returns {Promise<{ ok: true, token: string, email: string } | Failure>}
 */
export async function requestSession({
  url = SYNC_URL,
  idToken,
  fetchImpl,
  timeoutMs,
}) {
  const result = await post({
    url,
    path: '/auth',
    body: { idToken },
    fetchImpl,
    timeoutMs,
  });
  if (!result.ok) {
    // 登入階段的 401 是「Google 憑證無效」，不是「登入過期」
    return result.kind === 'unauthorized'
      ? { ...result, message: 'Google 登入的憑證無效，請再試一次。' }
      : result;
  }
  const { token, email } = result.data;
  if (typeof token !== 'string' || typeof email !== 'string') {
    return { ok: false, kind: 'server', message: MESSAGES.bad_response };
  }
  return { ok: true, token, email };
}

/**
 * 上傳整份本機進度、取回與雲端合併後的整份。回應的進度會再驗證一次格式。
 *
 * @param {{ url?: string, token: string, progress: Progress, fetchImpl: FetchLike, timeoutMs?: number }} options
 * @returns {Promise<{ ok: true, progress: Progress, token: string | null } | Failure>}
 */
export async function requestSync({
  url = SYNC_URL,
  token,
  progress,
  fetchImpl,
  timeoutMs,
}) {
  const result = await post({
    url,
    path: '/sync',
    body: { progress },
    token,
    fetchImpl,
    timeoutMs,
  });
  if (!result.ok) return result;

  const parsed = parseProgress(JSON.stringify(result.data.progress) ?? 'null');
  // 雲端回傳的進度有任何問題都不套用：寧可這次同步失敗，也不拿壞資料污染本機
  if (parsed.problem || parsed.dropped > 0) {
    return { ok: false, kind: 'server', message: MESSAGES.bad_response };
  }
  const renewed = typeof result.data.token === 'string' ? result.data.token : null;
  return { ok: true, progress: parsed.progress, token: renewed };
}
