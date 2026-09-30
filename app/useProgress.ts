import { useCallback, useEffect, useRef, useState } from 'react';
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
 *   寫入失敗用 saveError 顯示，下一次寫入成功就消失。都不靜默失敗。
 */
export function useProgress() {
  const [initial] = useState(() => loadProgress(getStorage()));
  const [progress, setProgress] = useState<Progress>(initial.progress);
  const [warning, setWarning] = useState<string | null>(initial.warning);
  const [saveError, setSaveError] = useState<string | null>(null);
  const latest = useRef(progress);

  const update = useCallback((change: (prev: Progress) => Progress) => {
    const result = updateProgress(getStorage(), latest.current, change);
    latest.current = result.progress;
    setProgress(result.progress);
    setSaveError(result.saveError);
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== PROGRESS_KEY || event.newValue === null) return;
      const external = adoptExternalProgress(event.newValue);
      if (external) {
        latest.current = external;
        setProgress(external);
      } else {
        setWarning(
          '另一個分頁寫入的進度格式異常，已忽略；這個分頁的進度不受影響。',
        );
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const dismissWarning = useCallback(() => setWarning(null), []);

  return { progress, update, warning, saveError, dismissWarning };
}
