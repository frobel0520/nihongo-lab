import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { countCached } from '../../lib/offline.mjs';
import { createAudioStore, offlineSupported } from '../lib/offlineAudio';

import {
  cancelAudioDownload,
  getAudioJob,
  startAudioDownload,
  subscribeAudioJob,
  type AudioJobScope,
} from '../lib/audioDownloadJob';

const errorText = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

/**
 * 離線音檔：<audio> 播放不會把音檔存進快取，所以要離線播放得先明確下載。
 * 本課與全部課程各一個按鈕；已存的會略過，失敗的再按一次只補抓失敗的。
 */
export function OfflineAudio({
  lessonPaths,
  allPaths,
  lessonLabel = '本課',
  allLabel = '全部課程',
  lessonScope,
  allScope,
}: {
  lessonPaths: string[];
  allPaths: string[];
  lessonScope?: AudioJobScope;
  allScope: AudioJobScope;
  lessonLabel?: string;
  allLabel?: string;
}) {
  const supported = offlineSupported();
  const [counts, setCounts] = useState<{ lesson: number; all: number } | null>(
    null,
  );
  const status = useSyncExternalStore(subscribeAudioJob, getAudioJob);
  const [checkError, setCheckError] = useState<string | null>(null);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    try {
      const store = createAudioStore();
      const [lesson, all] = await Promise.all([
        countCached(lessonPaths, store),
        countCached(allPaths, store),
      ]);
      if (alive.current) {
        setCounts({ lesson, all });
        setCheckError(null);
      }
    } catch (error) {
      if (alive.current) {
        setCheckError(errorText(error));
      }
    }
  }, [lessonPaths, allPaths]);

  useEffect(() => {
    if (supported && status.kind !== 'running') void refresh();
  }, [supported, refresh, status.kind]);
  useEffect(() => {
    if (supported && getAudioJob().kind === 'running') void refresh();
  }, [supported, refresh]);

  if (!supported) {
    return (
      <section className="card">
        <h3>離線音檔</h3>
        <p className="muted">
          這個瀏覽器不支援離線快取（需要 HTTPS 或
          localhost），離線時無法播放音檔。
        </p>
      </section>
    );
  }

  const ownResult =
    status.kind !== 'idle' &&
    (status.scope.id === lessonScope?.id || status.scope.id === allScope.id);
  const visibleStatus = status.kind === 'running' || ownResult;
  const busy = status.kind === 'running';
  const lessonDone = counts !== null && counts.lesson >= lessonPaths.length;
  const allDone = counts !== null && counts.all >= allPaths.length;

  return (
    <section className="card">
      <h3>離線音檔</h3>
      <p className="muted">
        播放不會自動存檔；要在沒有網路時聽音檔，請先在有網路時下載。文字內容本來就能離線閱讀。下載期間可以切到其他頁面；重新整理、關閉本網站或被系統終止會中斷，下次再按從缺少的接續。
        已下載音檔不會因播放其他音檔而由本網站自動刪除；瀏覽器或系統清除儲存空間後仍需重新下載。
        {counts &&
          `　最近檢查已存：${lessonPaths.length > 0 ? `${lessonLabel} ${counts.lesson} / ${lessonPaths.length}，` : ''}${allLabel} ${counts.all} / ${allPaths.length}。`}
      </p>
      <div className="row">
        {lessonPaths.length > 0 && (
          <button
            type="button"
            className="btn"
            disabled={busy || lessonDone}
            onClick={() => void startAudioDownload(lessonPaths, lessonScope!)}
          >
            {lessonDone
              ? `${lessonLabel}音檔已全部存好`
              : `下載${lessonLabel}音檔`}
          </button>
        )}
        <button
          type="button"
          className="btn"
          disabled={busy || allDone}
          onClick={() => void startAudioDownload(allPaths, allScope)}
        >
          {allDone ? `${allLabel}音檔已存好` : `下載${allLabel}音檔`}
        </button>
        <button
          type="button"
          className="btn"
          disabled={busy}
          onClick={() => void refresh()}
        >
          重新檢查下載狀態
        </button>
      </div>
      <output className="muted status-line">
        {visibleStatus && `${status.scope.label}：`}
        {visibleStatus &&
          status.kind === 'running' &&
          `${status.cancelling ? '正在停止' : '音檔下載中'}… 本次已存 ${status.saved} / ${status.total}，失敗 ${status.failed} 個。可以切到其他頁面繼續學習。`}
        {visibleStatus &&
          status.kind === 'done' &&
          `完成：新存 ${status.saved} 個，失敗 ${status.failed} 個。${status.failed ? `（${status.reason}）再按一次補抓失敗與缺少的。` : ''}`}
        {visibleStatus &&
          status.kind === 'paused' &&
          `${status.why === 'network' ? '網路中斷，下載已暫停' : '已取消音檔下載'}：本次已存 ${status.saved} 個，失敗 ${status.failed} 個；已存的會保留，再按一次從缺少的接續。`}
        {visibleStatus &&
          status.kind === 'offline' &&
          '目前沒有網路，無法下載音檔；連線後再按一次。'}
        {visibleStatus &&
          status.kind === 'locked' &&
          '另一個分頁正在下載音檔，完成後再按「重新檢查下載狀態」。'}
      </output>
      <div className="row">
        {busy && (
          <button
            type="button"
            className="btn"
            disabled={status.cancelling}
            onClick={cancelAudioDownload}
          >
            取消音檔下載
          </button>
        )}
      </div>
      {((ownResult && status.kind === 'error') || checkError) && (
        <p className="error" role="alert">
          離線音檔發生錯誤：
          {visibleStatus && status.kind === 'error'
            ? status.message
            : checkError}
        </p>
      )}
    </section>
  );
}
