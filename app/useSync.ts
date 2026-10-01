import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import type { Progress } from '../lib/progress.mjs';
import { mergeProgress } from '../lib/progress-merge.mjs';
import { createSyncController } from '../lib/sync-controller.mjs';
import { SYNC_STATE_KEY } from '../lib/sync.mjs';
import { disableGoogleAutoSelect } from './lib/googleSignIn';

type ControllerStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

function getControllerStorage(): ControllerStorage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * 跨裝置同步（T30）：把 lib/sync-controller.mjs 接到畫面。
 * 同步的時機：開啟 App（已登入時）、回到前景、離開前景時有未上傳的變更、網路恢復、
 * 進度變動後（延遲幾秒、連續變動只送一次）。雲端的內容用 mergeProgress 併進本機，
 * 同步中答的題不會被蓋掉。沒登入時什麼都不會做，也不會連 Google。
 */
export function useSync({
  progress,
  getProgress,
  update,
}: {
  progress: Progress;
  getProgress: () => Progress;
  update: (change: (prev: Progress) => Progress) => void;
}) {
  const [controller] = useState(() =>
    createSyncController({
      storage: getControllerStorage(),
      fetchImpl: (input, init) => window.fetch(input, init),
      now: () => Date.now(),
      isOnline: () => navigator.onLine,
      getProgress,
      applyRemote: (remote) =>
        update((prev) => mergeProgress(prev, remote).progress),
      setTimer: (callback, ms) => window.setTimeout(callback, ms),
      clearTimer: (handle) => window.clearTimeout(handle as number),
    }),
  );
  const status = useSyncExternalStore(
    controller.subscribe,
    controller.getStatus,
  );

  useEffect(() => {
    controller.start();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') controller.notifyForeground();
      else controller.notifyHidden();
    };
    const onPageHide = () => controller.notifyHidden();
    const onOnline = () => controller.notifyOnline();
    const onStorage = (event: StorageEvent) => {
      if (event.key === SYNC_STATE_KEY) controller.notifyStorageChanged();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onPageHide);
    window.addEventListener('online', onOnline);
    window.addEventListener('storage', onStorage);
    return () => {
      controller.stop();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onPageHide);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('storage', onStorage);
    };
  }, [controller]);

  // 進度每次變動（含套用雲端內容）都通知；有沒有真的需要上傳由 controller 用內容指紋判斷。
  useEffect(() => {
    controller.notifyChanged();
  }, [progress, controller]);

  // 動作函式在整個生命週期內是同一份，元件的 effect 才能放心把它們當相依。
  const actions = useMemo(
    () => ({
      signIn: (idToken: string) => controller.signIn(idToken),
      signOut: () => {
        controller.signOut();
        disableGoogleAutoSelect();
      },
      syncNow: () => controller.syncNow(),
      dismissAttention: () => controller.dismissAttention(),
    }),
    [controller],
  );

  return { status, ...actions };
}

export type SyncApi = ReturnType<typeof useSync>;
