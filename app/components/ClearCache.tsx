import { useEffect, useState } from 'react';
import { clearAppCaches } from '../../lib/clear-cache.mjs';

/** 清完快取、重新載入之後，在同一個工作階段讀一次，用來顯示「清好了」。 */
export const CACHE_CLEARED_FLAG = 'nihongo-lab:cache-cleared';

type Phase =
  | { kind: 'idle' }
  | { kind: 'confirm' }
  | { kind: 'busy' }
  | { kind: 'error'; message: string };

function useOnline() {
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);
  return online;
}

/**
 * 在 App 裡清快取，不用再去手機設定清。只清 Cache Storage 與 service worker（可再下載回來的東西）；
 * 學習進度與偏好在 localStorage，清除邏輯（lib/clear-cache.mjs）根本碰不到它。
 * 清完要重新載入才會抓最新版，所以離線時不讓按——清掉之後就打不開 App 了。
 */
export function ClearCache() {
  const online = useOnline();
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' });

  const clear = async () => {
    setPhase({ kind: 'busy' });
    const result = await clearAppCaches({
      caches: typeof caches === 'undefined' ? undefined : caches,
      serviceWorker:
        'serviceWorker' in navigator ? navigator.serviceWorker : undefined,
    });
    if (result.failed.length > 0) {
      setPhase({
        kind: 'error',
        message: `沒有完全清乾淨：${result.failed.join('；')}。學習進度不受影響，可以再試一次。`,
      });
      return;
    }
    try {
      sessionStorage.setItem(CACHE_CLEARED_FLAG, '1');
    } catch {
      // 只是「清好了」的提示用，存不了就不顯示
    }
    window.location.reload();
  };

  return (
    <section className="card">
      <h3>清除快取</h3>
      <p className="muted">
        清掉存在這個裝置上的離線音檔與程式檔（含舊版留下的快取），並重新載入取得最新版（畫面不對或版本沒更新時用）。
        <strong>學習進度（單字卡、聽寫紀錄）與顯示偏好不會被清除。</strong>
        清完需要網路重新下載；離線音檔要再到上面重新下載。
      </p>

      {phase.kind === 'idle' && (
        <div className="row">
          <button
            type="button"
            className="btn"
            disabled={!online}
            onClick={() => setPhase({ kind: 'confirm' })}
          >
            清除快取並重新載入
          </button>
          {!online && (
            <span className="muted">目前離線，連上網路後才能清除。</span>
          )}
        </div>
      )}

      {phase.kind === 'confirm' && (
        <div className="notice notice-row" role="alert">
          <span>確定清除快取？進度會保留。</span>
          <span className="row">
            <button type="button" className="btn primary" onClick={clear}>
              確定清除
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => setPhase({ kind: 'idle' })}
            >
              取消
            </button>
          </span>
        </div>
      )}

      {phase.kind === 'busy' && <p className="muted">清除中…</p>}

      {phase.kind === 'error' && (
        <>
          <p className="error" role="alert">
            {phase.message}
          </p>
          <div className="row">
            <button
              type="button"
              className="btn"
              onClick={() => setPhase({ kind: 'idle' })}
            >
              知道了
            </button>
          </div>
        </>
      )}
    </section>
  );
}
