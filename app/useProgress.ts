import { useCallback, useEffect, useRef, useState } from 'react';
import { mergeProgress } from '../lib/progress-merge.mjs';
import type { Progress } from '../lib/progress.mjs';
import {
  PROGRESS_KEY,
  adoptExternalProgress,
  loadProgress,
  updateProgress,
} from '../lib/progress-store.mjs';
import { getStorage } from './lib/storage';

/**
 * 進度狀態 + 每次更新立刻寫入 localStorage。
 * - 更新前會重讀儲存空間裡最新的進度，另一個分頁（PWA 與瀏覽器分頁同時開）剛存的不會被蓋掉。
 * - 另一個分頁存檔時（storage 事件）同步採用它的進度。
 * - 載入時的問題（存檔損毀、被略過的資料）用 warning 顯示，直到使用者按掉；
 *   寫入失敗用 saveError 顯示；後續更新／跨分頁事件先合併未存紀錄，重試僅保存狀態，不重播作答。
 *   下一次寫入成功就消失。都不靜默失敗。
 */
export function useProgress() {
  const [initial] = useState(() => loadProgress(getStorage()));
  const [progress, setProgress] = useState<Progress>(initial.progress);
  const [warning, setWarning] = useState<string | null>(initial.warning);
  const [saveError, setSaveError] = useState<string | null>(null);
  const latest = useRef(progress);
  const unsaved = useRef(false);

  const update = useCallback((change: (prev: Progress) => Progress) => {
    const result = updateProgress(
      getStorage(),
      latest.current,
      change,
      unsaved.current,
    );
    unsaved.current = result.saveError !== null;
    latest.current = result.progress;
    setProgress(result.progress);
    setSaveError(result.saveError);
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== PROGRESS_KEY || event.newValue === null) return;
      const external = adoptExternalProgress(event.newValue);
      if (external) {
        latest.current = unsaved.current
          ? mergeProgress(external, latest.current).progress
          : external;
        setProgress(latest.current);
      } else {
        setWarning(
          '另一個分頁寫入的進度格式異常，已忽略；這個分頁的進度不受影響。',
        );
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // 只重試目前狀態的寫入，不再次執行評分／計分。
  const retrySave = useCallback(() => update((current) => current), [update]);

  const dismissWarning = useCallback(() => setWarning(null), []);
  /** 目前最新的進度（包含這一輪渲染之前剛寫入的），給同步這種在渲染之外讀取的地方用。 */
  const getProgress = useCallback(() => latest.current, []);

  return {
    progress,
    getProgress,
    update,
    warning,
    saveError,
    retrySave,
    dismissWarning,
  };
}
