import { useCallback, useRef, useState } from 'react';
import type { Progress } from '../lib/progress.mjs';
import { loadProgress, saveProgress } from './lib/storage';

/** 進度狀態 + 每次更新立刻寫入 localStorage；讀寫問題用 notice 露出，不靜默失敗。 */
export function useProgress() {
  const [initial] = useState(loadProgress);
  const [progress, setProgress] = useState<Progress>(initial.progress);
  const [notice, setNotice] = useState<string | null>(initial.warning);
  const latest = useRef(progress);

  const update = useCallback((change: (prev: Progress) => Progress) => {
    const next = change(latest.current);
    latest.current = next;
    setProgress(next);
    setNotice(saveProgress(next));
  }, []);

  return { progress, update, notice };
}
