import { useCallback, useEffect, useRef, useState } from 'react';
import { shouldCheckForUpdate } from '../lib/sw-update.mjs';

/** Keep the old worker and its chunks until the user can safely leave this page.
 * Activation is refused while another application page is open. */
export function useSwUpdate() {
  const [phase, setPhase] = useState<'waiting' | 'changed' | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const registration = useRef<ServiceWorkerRegistration | null>(null);
  const requested = useRef(false);
  const activationTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    const container = navigator.serviceWorker;
    let alive = true;
    let hadController = container.controller !== null;
    const cleanups: (() => void)[] = [];
    const showWaiting = () => {
      if (alive && registration.current?.waiting && container.controller) {
        setPhase('waiting');
        setDismissed(false);
      }
    };
    const onControllerChange = () => {
      if (hadController) {
        if (requested.current) window.location.reload();
        else {
          // A legacy worker or a concurrent activation may have switched versions.
          // Offer recovery; do not discard another page's in-progress input.
          setPhase('changed');
          setDismissed(false);
        }
      }
      hadController = true;
    };
    container.addEventListener('controllerchange', onControllerChange);
    const ready = container.getRegistration().then((reg) => reg ?? container.ready).then((reg) => {
      if (!alive || !reg) return;
      registration.current = reg;
      const watchInstalling = () => {
        const worker = reg.installing;
        if (!worker) return;
        const changed = () => {
          if (worker.state === 'installed') showWaiting();
        };
        worker.addEventListener('statechange', changed);
        cleanups.push(() => worker.removeEventListener('statechange', changed));
      };
      reg.addEventListener('updatefound', watchInstalling);
      cleanups.push(() => reg.removeEventListener('updatefound', watchInstalling));
      watchInstalling();
      showWaiting();
    }).catch(() => undefined);

    let lastCheckedAt: number | null = null;
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      showWaiting();
      const now = Date.now();
      if (!shouldCheckForUpdate(lastCheckedAt, now)) return;
      lastCheckedAt = now;
      void ready.then(() => registration.current?.update()).catch(() => undefined);
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      alive = false;
      window.clearTimeout(activationTimer.current);
      container.removeEventListener('controllerchange', onControllerChange);
      document.removeEventListener('visibilitychange', onVisible);
      for (const cleanup of cleanups) cleanup();
    };
  }, []);

  const dismiss = useCallback(() => setDismissed(true), []);
  const reload = useCallback(async () => {
    if (applying) return;
    if (!window.confirm('現在更新會重新載入此分頁；尚未送出的輸入不會保留。請先完成目前作答。')) return;
    if (phase === 'changed') {
      window.location.reload();
      return;
    }
    const worker = registration.current?.waiting;
    if (!worker) {
      setError('新版尚未就緒，請稍後重試；也可關閉本網站所有分頁後重新開啟。');
      return;
    }
    setApplying(true);
    setError('');
    requested.current = true;
    try {
      const status = await new Promise<string>((resolve, reject) => {
        const channel = new MessageChannel();
        const timer = window.setTimeout(() => {
          channel.port1.close();
          reject(new Error('timeout'));
        }, 10000);
        channel.port1.onmessage = (event) => {
          window.clearTimeout(timer);
          channel.port1.close();
          resolve(event.data?.status);
        };
        worker.postMessage({ type: 'NIHONGO_APPLY_UPDATE' }, [channel.port2]);
      });
      if (status === 'accepted') {
        // Only this consenting page reloads on controllerchange. Allow recovery
        // if activation never completes instead of leaving the button busy.
        activationTimer.current = window.setTimeout(() => {
          requested.current = false;
          setApplying(false);
          setError('更新尚未完成，請重試；也可關閉本網站所有分頁後重新開啟。');
        }, 10000);
        return;
      }
      requested.current = false;
      setError(status === 'other-pages'
        ? '請先完成並關閉本網站其他分頁，再按更新。其他分頁不會被自動重新載入。'
        : '未能套用更新，請重試；也可關閉本網站所有分頁後重新開啟。');
    } catch {
      requested.current = false;
      setError('更新沒有回應，請重試；也可關閉本網站所有分頁後重新開啟。');
    }
    setApplying(false);
  }, [applying, phase]);

  return { updated: phase !== null && !dismissed, changed: phase === 'changed', applying, error, dismiss, reload };
}
