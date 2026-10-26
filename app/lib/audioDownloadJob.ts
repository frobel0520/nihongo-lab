import { downloadMissing } from '../../lib/offline.mjs';
import { isNetworkFailure } from '../../lib/vocab-image-offline.mjs';
import { createAudioStore } from './offlineAudio';

/** 同一App的音檔工作；重整／關閉後中斷，已存的仍由原快取保留。 */
export type AudioJobState =
  | { kind: 'idle' }
  | {
      kind: 'running';
      saved: number;
      total: number;
      failed: number;
      cancelling: boolean;
    }
  | { kind: 'done'; saved: number; failed: number; reason?: string }
  | {
      kind: 'paused';
      saved: number;
      failed: number;
      why: 'cancelled' | 'network';
    }
  | { kind: 'offline' | 'locked' }
  | { kind: 'error'; message: string };
let state: AudioJobState = { kind: 'idle' };
let controller: AbortController | null = null;
let stopping: 'network' | 'cancelled' | null = null;
const listeners = new Set<() => void>();
const set = (next: AudioJobState) => {
  state = next;
  for (const listener of listeners) listener();
};
export const getAudioJob = () => state;
export const subscribeAudioJob = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
const offline = () => {
  stopping ??= 'network';
  controller?.abort();
};
export function cancelAudioDownload() {
  if (state.kind !== 'running' || !controller) return;
  stopping = 'cancelled';
  set({ ...state, cancelling: true });
  controller.abort();
}
export async function startAudioDownload(paths: string[]) {
  if (state.kind === 'running') return;
  if (!navigator.onLine) {
    set({ kind: 'offline' });
    return;
  }
  controller = new AbortController();
  stopping = null;
  set({ kind: 'running', saved: 0, total: 0, failed: 0, cancelling: false });
  window.addEventListener('offline', offline);
  try {
    const run = () =>
      downloadMissing([...new Set(paths)], createAudioStore(), {
        signal: controller!.signal,
        isNetworkError: isNetworkFailure,
        networkStopAfter: 4,
        notRetainedMessage: '音檔未保留在快取中，請檢查可用儲存空間後重試。',
        onProgress: ({ saved = 0, total, failed = 0 }) => {
          if (state.kind === 'running') set({ ...state, saved, total, failed });
        },
      });
    // 獨立於圖片的鎖；不同分頁／本課與全部音檔也不重複啟動。
    const result = navigator.locks
      ? await navigator.locks.request(
          'nihongo-lab:audio-download',
          { ifAvailable: true },
          (lock) => (lock ? run() : null),
        )
      : await run();
    if (!result) {
      set({ kind: 'locked' });
      return;
    }
    const saved = result.downloaded,
      failed = result.failed.length;
    const why =
      stopping ??
      (result.stopped === 'network' || (result.deferred ?? 0) > 0
        ? 'network'
        : null);
    set(
      why
        ? { kind: 'paused', saved, failed, why }
        : { kind: 'done', saved, failed, reason: result.failed[0]?.message },
    );
  } catch (error) {
    set({
      kind: 'error',
      message: error instanceof Error ? error.message : String(error),
    });
  } finally {
    window.removeEventListener('offline', offline);
    controller = null;
    stopping = null;
  }
}
