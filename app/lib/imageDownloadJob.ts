import { downloadMissing } from '../../lib/offline.mjs';
import {
  IMAGE_DOWNLOAD_CONCURRENCY,
  IMAGE_DOWNLOAD_RETRIES,
  IMAGE_NETWORK_STOP_AFTER,
  formatMegabytes,
  isNetworkFailure,
} from '../../lib/vocab-image-offline.mjs';
import {
  createImageStore,
  markImagesComplete,
  pruneImageCache,
  readImageStatus,
  storageShortfall,
  withDownloadLock,
} from './offlineImages';

/**
 * 單字圖片下載工作（T163）。工作活在模組層級，不跟設定頁一起卸載：
 * 切到課程或單字卡時繼續下載，回設定頁看到同一個工作的進度，不會重複啟動。
 * 只限本網站開著的期間；重新整理、關閉分頁或 APP 被系統終止就會中斷，下次再按從缺少的接續。
 *
 * 計數：saved＝實際寫入快取並重新讀到的張數；failed＝確定失敗；
 * 網路中斷沒存到的不算失敗，留在「待下載」等下次接續。
 */
export type ImageJobState =
  | { kind: 'idle' }
  | {
      kind: 'running';
      /** 本次要下載的張數；saved／failed 是本次的結果。 */
      total: number;
      saved: number;
      failed: number;
      /** 開始時已下載的張數與全部張數，讓設定頁不必在途中掃描快取。 */
      before: number;
      images: number;
      cancelling: boolean;
    }
  | { kind: 'done'; saved: number; failed: number; reason?: string }
  | { kind: 'paused'; why: 'network' | 'cancelled'; saved: number; failed: number }
  | { kind: 'offline' }
  | { kind: 'locked' }
  | { kind: 'error'; message: string };

let state: ImageJobState = { kind: 'idle' };
let controller: AbortController | null = null;
let abortReason: 'network' | 'cancelled' | null = null;
const listeners = new Set<() => void>();

const set = (next: ImageJobState) => {
  state = next;
  for (const listener of listeners) listener();
};

export const subscribeImageJob = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
export const getImageJob = () => state;

const errorText = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

/** 下載中裝置變成離線：立刻暫停，不等每張請求逐一失敗。 */
const onOffline = () => {
  abortReason ??= 'network';
  controller?.abort();
};

export function cancelImageDownload() {
  if (state.kind !== 'running' || !controller) return;
  abortReason = 'cancelled';
  set({ ...state, cancelling: true });
  controller.abort();
}

export async function startImageDownload() {
  if (state.kind === 'running') return;
  // navigator.onLine 為 false 幾乎一定沒有網路，直接說明；為 true 不代表連得上，下面仍以實際請求判斷。
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    set({ kind: 'offline' });
    return;
  }
  // 讀狀態期間也算執行中，避免連按兩次。
  set({ kind: 'running', total: 0, saved: 0, failed: 0, before: 0, images: 0, cancelling: false });
  try {
    const current = await readImageStatus();
    const shortfall = await storageShortfall(current.pendingBytes);
    if (shortfall > 0) {
      set({
        kind: 'error',
        message: `可用儲存空間可能不足（約差 ${formatMegabytes(shortfall)}），請清出空間後再下載。`,
      });
      return;
    }
    controller = new AbortController();
    abortReason = null;
    window.addEventListener('offline', onOffline);
    set({
      kind: 'running',
      total: current.pending,
      saved: 0,
      failed: 0,
      before: current.downloaded,
      images: current.total,
      cancelling: false,
    });
    const outcome = await withDownloadLock(() =>
      downloadMissing(current.missing, createImageStore(), {
        concurrency: IMAGE_DOWNLOAD_CONCURRENCY,
        retries: IMAGE_DOWNLOAD_RETRIES,
        label: (image) => image.src,
        notRetainedMessage: '圖片未保留在快取中，請檢查可用儲存空間後重試。',
        isNetworkError: isNetworkFailure,
        networkStopAfter: IMAGE_NETWORK_STOP_AFTER,
        signal: controller!.signal,
        onProgress: ({ saved = 0, failed = 0 }) => {
          if (state.kind === 'running') set({ ...state, saved, failed });
        },
      }),
    );
    if (outcome === 'locked') {
      set({ kind: 'locked' });
      return;
    }
    await pruneImageCache();
    const saved = outcome.downloaded;
    const failed = outcome.failed.length;
    const why = outcome.stopped === 'network' ? 'network' : abortReason;
    if (why) set({ kind: 'paused', why, saved, failed });
    else if ((outcome.deferred ?? 0) > 0) set({ kind: 'paused', why: 'network', saved, failed });
    else {
      if (failed === 0) markImagesComplete();
      set({ kind: 'done', saved, failed, reason: outcome.failed[0]?.message });
    }
  } catch (error) {
    set({ kind: 'error', message: errorText(error) });
  } finally {
    window.removeEventListener('offline', onOffline);
    controller = null;
    abortReason = null;
  }
}

