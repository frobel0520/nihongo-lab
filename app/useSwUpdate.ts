import { useCallback, useEffect, useState } from 'react';
import { shouldCheckForUpdate } from '../lib/sw-update.mjs';

/**
 * 新版本提示：新的 service worker 接管頁面（controllerchange）且之前已有控制者，
 * 就代表這一頁跑的還是舊的 bundle，提示使用者重新載入。第一次安裝時 service worker 接管頁面
 * （之前沒有控制者）不算更新。另外在回到前景時主動檢查更新（節流，見 lib/sw-update.mjs）。
 * 不自動重載，避免打斷聽寫輸入與進行中的單字卡。
 */
export function useSwUpdate() {
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    const container = navigator.serviceWorker;

    let hadController = container.controller !== null;
    const onControllerChange = () => {
      if (hadController) setUpdated(true);
      hadController = true;
    };
    container.addEventListener('controllerchange', onControllerChange);

    let lastCheckedAt: number | null = null;
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      const now = Date.now();
      if (!shouldCheckForUpdate(lastCheckedAt, now)) return;
      lastCheckedAt = now;
      // 更新檢查失敗（離線）不影響使用，下次回到前景再試
      container
        .getRegistration()
        .then((registration) => registration?.update())
        .catch(() => undefined);
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      container.removeEventListener('controllerchange', onControllerChange);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  const dismiss = useCallback(() => setUpdated(false), []);
  const reload = useCallback(() => window.location.reload(), []);

  return { updated, dismiss, reload };
}
