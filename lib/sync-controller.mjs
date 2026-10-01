/**
 * 同步的流程控制（T30）：什麼時候同步、同時只跑一個、怎麼判斷「本機有沒有還沒上傳的變更」、
 * 各種失敗後的狀態。純邏輯：網路、儲存空間、計時器、進度的讀取與套用都由呼叫端注入，
 * 所以「不會無限同步」「連續變更只上傳一次」「登入過期後停手」這些行為都能用 node --test 驗證。
 *
 * 一次同步 = 把整份本機進度送上去，拿回與雲端合併後的整份，再併回本機（mergeProgress，逐筆較新的贏）。
 * 本機是否有未上傳的變更，看「現在的進度」與「上次雲端回傳的進度」的內容指紋是否相同
 * （fingerprintProgress，與物件鍵順序無關）；併回雲端的內容之後兩者相同，就不會再觸發下一次同步。
 *
 * @typedef {import('./progress.mjs').Progress} Progress
 * @typedef {import('./sync.mjs').FetchLike} FetchLike
 * @typedef {import('./sync.mjs').SyncState} SyncState
 * @typedef {{
 *   signedIn: boolean,
 *   email: string | null,
 *   lastSyncAt: number | null,
 *   syncing: boolean,
 *   signingIn: boolean,
 *   error: string | null,
 *   attention: string | null,
 *   lastFromCloud: number,
 * }} SyncStatus
 * @typedef {{
 *   storage: import('./progress-store.mjs').StorageLike & { removeItem(key: string): void } | null,
 *   fetchImpl: FetchLike,
 *   url?: string,
 *   now: () => number,
 *   isOnline: () => boolean,
 *   getProgress: () => Progress,
 *   applyRemote: (remote: Progress) => void,
 *   setTimer: (callback: () => void, ms: number) => unknown,
 *   clearTimer: (handle: unknown) => void,
 * }} SyncDeps
 */
import { mergeProgress } from './progress-merge.mjs';
import { fingerprintProgress } from './progress.mjs';
import {
  CHANGE_SYNC_DELAY_MS,
  FOREGROUND_SYNC_INTERVAL_MS,
  clearSyncState,
  loadSyncState,
  requestSession,
  requestSync,
  saveSyncState,
  shouldSyncOnForeground,
} from './sync.mjs';

const OFFLINE_MESSAGE = '目前離線，連上網路後會自動同步。';

/** @param {SyncDeps} deps */
export function createSyncController(deps) {
  /** @type {SyncState | null} */
  let state = null;
  /** @type {string | null} 雲端上次回傳的進度的指紋；null 表示還沒同步過 */
  let lastSyncedFingerprint = null;
  /** @type {number | null} */
  let lastAttemptAt = null;
  /** @type {Promise<void> | null} */
  let inFlight = null;
  let pending = false;
  let started = false;
  /** @type {unknown} */
  let changeTimer = null;

  /** @type {SyncStatus} */
  let status = {
    signedIn: false,
    email: null,
    lastSyncAt: null,
    syncing: false,
    signingIn: false,
    error: null,
    attention: null,
    lastFromCloud: 0,
  };
  /** @type {Set<() => void>} */
  const listeners = new Set();

  /** @param {Partial<SyncStatus>} patch */
  function setStatus(patch) {
    status = { ...status, ...patch };
    for (const listener of listeners) listener();
  }

  function cancelChangeTimer() {
    if (changeTimer !== null) deps.clearTimer(changeTimer);
    changeTimer = null;
  }

  function isDirty() {
    return fingerprintProgress(deps.getProgress()) !== lastSyncedFingerprint;
  }

  function scheduleChangeSync() {
    cancelChangeTimer();
    changeTimer = deps.setTimer(() => {
      changeTimer = null;
      void runSync();
    }, CHANGE_SYNC_DELAY_MS);
  }

  /** @param {SyncState | null} next */
  function adoptState(next) {
    state = next;
    if (next) {
      setStatus({ signedIn: true, email: next.email, lastSyncAt: next.lastSyncAt });
    } else {
      cancelChangeTimer();
      lastSyncedFingerprint = null;
      setStatus({ signedIn: false, email: null, lastSyncAt: null, syncing: false });
    }
  }

  async function syncLoop() {
    do {
      pending = false;
      if (!state) return;
      lastAttemptAt = deps.now();
      const result = await requestSync({
        url: deps.url,
        token: state.token,
        progress: deps.getProgress(),
        fetchImpl: deps.fetchImpl,
      });
      if (!state) return; // 同步途中登出了

      if (!result.ok) {
        if (result.kind === 'unauthorized') {
          clearSyncState(deps.storage);
          adoptState(null);
          setStatus({ error: null, attention: result.message });
        } else {
          setStatus({ error: result.message });
        }
        return;
      }

      let fromCloud = 0;
      try {
        const { changes } = mergeProgress(deps.getProgress(), result.progress);
        fromCloud = changes.srs + changes.dictation;
        deps.applyRemote(result.progress);
      } catch (error) {
        setStatus({
          error: `同步結果無法套用：${error instanceof Error ? error.message : String(error)}`,
        });
        return;
      }
      lastSyncedFingerprint = fingerprintProgress(result.progress);
      state = {
        ...state,
        token: result.token ?? state.token,
        lastSyncAt: deps.now(),
      };
      saveSyncState(deps.storage, state);
      setStatus({
        lastSyncAt: state.lastSyncAt,
        error: null,
        attention: null,
        lastFromCloud: fromCloud,
      });
    } while (pending);
    // 同步途中又有新的變更：排下一次，不在這裡無限迴圈
    if (state && isDirty()) scheduleChangeSync();
  }

  /** 同時只跑一個；跑的時候又被要求同步，就在這一輪結束後再補一輪。 */
  async function runSync() {
    if (!state) return;
    cancelChangeTimer();
    if (inFlight) {
      pending = true;
      return inFlight;
    }
    if (!deps.isOnline()) {
      setStatus({ error: OFFLINE_MESSAGE });
      return;
    }
    setStatus({ syncing: true });
    inFlight = syncLoop().finally(() => {
      inFlight = null;
      setStatus({ syncing: false });
    });
    return inFlight;
  }

  return {
    getStatus: () => status,

    /** @param {() => void} listener */
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    /** 讀出登入狀態；已登入就先同步一次。可重複呼叫。 */
    start() {
      if (started) return;
      started = true;
      adoptState(loadSyncState(deps.storage));
      if (state) void runSync();
    },

    stop() {
      started = false;
      cancelChangeTimer();
    },

    /**
     * 用 Google 的身分憑證登入，成功後立刻同步。
     *
     * @param {string} idToken
     */
    async signIn(idToken) {
      setStatus({ signingIn: true, error: null, attention: null });
      const result = await requestSession({
        url: deps.url,
        idToken,
        fetchImpl: deps.fetchImpl,
      });
      if (!result.ok) {
        setStatus({ signingIn: false, error: result.message });
        return false;
      }
      const next = { token: result.token, email: result.email, lastSyncAt: null };
      if (!saveSyncState(deps.storage, next)) {
        setStatus({
          signingIn: false,
          error: '無法儲存登入狀態（瀏覽器儲存空間被停用），關掉頁面後需要重新登入。',
        });
      } else {
        setStatus({ signingIn: false });
      }
      lastSyncedFingerprint = null;
      adoptState(next);
      await runSync();
      return true;
    },

    /** 只停止同步：這個裝置的進度與雲端的備份都保留。 */
    signOut() {
      clearSyncState(deps.storage);
      adoptState(null);
      setStatus({ error: null, attention: null, lastFromCloud: 0 });
    },

    syncNow: runSync,

    /** 進度有變動（含載入）時呼叫：有未上傳的變更就排一次延遲上傳。 */
    notifyChanged() {
      if (!state) return;
      if (isDirty()) scheduleChangeSync();
      else cancelChangeTimer();
    },

    /** 回到前景：距離上次嘗試夠久就同步。 */
    notifyForeground() {
      if (!state) return;
      if (shouldSyncOnForeground(lastAttemptAt, deps.now(), FOREGROUND_SYNC_INTERVAL_MS)) {
        void runSync();
      }
    },

    /** 離開前景：有未上傳的變更就立刻送，行動裝置的頁面隨時可能被收掉。 */
    notifyHidden() {
      if (state && isDirty()) void runSync();
    },

    notifyOnline() {
      if (!state) return;
      if (isDirty() || shouldSyncOnForeground(lastAttemptAt, deps.now())) {
        void runSync();
      }
    },

    /** 另一個分頁登入或登出時（storage 事件）同步這一頁的狀態。 */
    notifyStorageChanged() {
      const stored = loadSyncState(deps.storage);
      if (!stored && state) adoptState(null);
      else if (stored && !state) {
        adoptState(stored);
        void runSync();
      } else if (stored && state && stored.token !== state.token) {
        state = { ...state, token: stored.token };
      }
    },

    dismissAttention() {
      setStatus({ attention: null });
    },
  };
}
