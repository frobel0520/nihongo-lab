import { useEffect, useRef, useState } from 'react';
import { describeLastSync } from '../../lib/sync.mjs';
import { loadGoogleIdentity, renderGoogleButton } from '../lib/googleSignIn';
import type { SyncApi } from '../useSync';

type Phase = 'idle' | 'loading' | 'ready';

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

/** 每隔一段時間重新渲染，讓「3 分鐘前」會自己更新。 */
function useNow(intervalMs: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs]);
  return now;
}

/**
 * 設定頁的「跨裝置同步」：用 Google 登入後，單字卡與聽寫進度在這個帳號的所有裝置之間自動同步。
 * Google 的登入腳本在按下「用 Google 登入」才載入，載入後畫出 Google 官方的按鈕再按一次完成登入。
 */
export function SyncPanel({ sync }: { sync: SyncApi }) {
  const { status, signIn } = sync;
  const online = useOnline();
  const now = useNow(30_000);
  const [phase, setPhase] = useState<Phase>('idle');
  const [loadError, setLoadError] = useState<string | null>(null);
  const buttonBox = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase !== 'ready' || !buttonBox.current) return;
    try {
      renderGoogleButton(buttonBox.current, (idToken) => {
        void signIn(idToken);
      });
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : String(error));
      setPhase('idle');
    }
  }, [phase, signIn]);

  // 登入成功後把登入流程收回去；登出後回到最初的樣子
  useEffect(() => {
    if (status.signedIn) setPhase('idle');
  }, [status.signedIn]);

  const startSignIn = () => {
    setLoadError(null);
    setPhase('loading');
    loadGoogleIdentity()
      .then(() => setPhase('ready'))
      .catch((error: unknown) => {
        setLoadError(error instanceof Error ? error.message : String(error));
        setPhase('idle');
      });
  };

  if (status.signedIn) {
    return (
      <section className="card">
        <h3>跨裝置同步</h3>
        <p>
          已登入：<strong>{status.email}</strong>
        </p>
        <output className="muted status-line">
          上次同步：{describeLastSync(status.lastSyncAt, now)}
          {status.syncing ? '（同步中…）' : ''}
          {!status.syncing && status.lastFromCloud > 0
            ? `，從雲端取得 ${status.lastFromCloud} 筆新紀錄`
            : ''}
        </output>
        {status.error && (
          <p className="error" role="alert">
            {status.error}
          </p>
        )}
        <div className="row">
          <button
            type="button"
            className="btn"
            disabled={status.syncing}
            onClick={() => void sync.syncNow()}
          >
            立即同步
          </button>
          <button type="button" className="btn" onClick={sync.signOut}>
            登出
          </button>
        </div>
        <p className="muted">
          開啟 App、回到前景、答完題目後會自動同步。登出只會停止同步：這個裝置上的進度與雲端的備份都會保留。
        </p>
      </section>
    );
  }

  const error = loadError ?? status.error;
  return (
    <section className="card">
      <h3>跨裝置同步</h3>
      <p className="muted">
        用 Google 登入後，手機與電腦的單字卡、聽寫進度會自動同步（逐筆保留較新的）。只有指定的帳號能使用。
        沒登入時完全不會連到 Google 或同步伺服器。
      </p>
      {phase === 'idle' && (
        <div className="row">
          <button
            type="button"
            className="btn primary"
            disabled={!online || status.signingIn}
            onClick={startSignIn}
          >
            用 Google 登入
          </button>
          {!online && <span className="muted">需要網路才能登入。</span>}
        </div>
      )}
      {phase === 'loading' && <p className="muted">載入 Google 登入…</p>}
      {phase === 'ready' && (
        <>
          <div ref={buttonBox} className="google-button" />
          <p className="muted">請按上面 Google 的按鈕，選擇帳號完成登入。</p>
        </>
      )}
      {status.signingIn && <p className="muted">登入中…</p>}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
