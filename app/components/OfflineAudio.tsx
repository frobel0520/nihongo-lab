import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import {
  createAudioStore,
  offlineSupported,
  scanAudio,
} from '../lib/offlineAudio';

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
  type Counts = { playable: number; outdated: number };
  const [counts, setCounts] = useState<{ lesson: Counts; all: Counts } | null>(
    null,
  );
  const status = useSyncExternalStore(subscribeAudioJob, getAudioJob);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [scanRequest, setScanRequest] = useState(0);
  const scanningJob = status.kind === 'running';

  useEffect(() => {
    if (!supported || scanningJob) return;
    const controller = new AbortController();
    async function refresh() {
      try {
        const statuses = await scanAudio(
          [...new Set([...lessonPaths, ...allPaths])],
          createAudioStore(),
          controller.signal,
        );
        const count = (paths: string[]) => ({
          playable: paths.filter((path) => statuses.get(path)?.playable).length,
          outdated: paths.filter((path) => statuses.get(path)?.outdated).length,
        });
        if (controller.signal.aborted) return;
        setCounts({ lesson: count(lessonPaths), all: count(allPaths) });
        setCheckError(null);
      } catch (error) {
        if (!controller.signal.aborted) {
          setCounts(null);
          setCheckError(errorText(error));
        }
      }
    }
    void refresh();
    return () => controller.abort();
  }, [supported, scanningJob, scanRequest, lessonPaths, allPaths]);

  const refresh = useCallback(() => setScanRequest((n) => n + 1), []);

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
  const lessonDone =
    counts !== null && counts.lesson.playable >= lessonPaths.length;
  const allDone = counts !== null && counts.all.playable >= allPaths.length;

  return (
    <section className="card">
      <h3>離線音檔</h3>
      <p className="muted">
        播放不會自動存檔；要在沒有網路時聽音檔，請先在有網路時下載。文字內容本來就能離線閱讀。下載期間可以切到其他頁面；重新整理、關閉本網站或被系統終止會中斷，下次再按從缺少的接續。
        已下載音檔不會因播放其他音檔而由本網站自動刪除；瀏覽器或系統清除儲存空間後仍需重新下載。
        {counts &&
          `　可離線播放：${lessonPaths.length > 0 ? `${lessonLabel} ${counts.lesson.playable} / ${lessonPaths.length}，` : ''}${allLabel} ${counts.all.playable} / ${allPaths.length}。${counts.all.outdated || counts.lesson.outdated ? `有新版可下載：${lessonPaths.length ? `${lessonLabel} ${counts.lesson.outdated}，` : ''}${allLabel} ${counts.all.outdated}。` : ''}`}
      </p>
      <div className="row">
        {lessonPaths.length > 0 &&
          (!lessonDone || !counts?.lesson.outdated) && (
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
        {(!allDone || !counts?.all.outdated) && (
          <button
            type="button"
            className="btn"
            disabled={busy || allDone}
            onClick={() => void startAudioDownload(allPaths, allScope)}
          >
            {allDone ? `${allLabel}音檔已存好` : `下載${allLabel}音檔`}
          </button>
        )}
        {!!counts?.lesson.outdated && lessonScope && (
          <button
            type="button"
            className="btn"
            disabled={busy}
            onClick={() =>
              void startAudioDownload(lessonPaths, lessonScope, 'update')
            }
          >
            更新{lessonLabel}已下載音檔
          </button>
        )}
        {!!counts?.all.outdated && (
          <button
            type="button"
            className="btn"
            disabled={busy}
            onClick={() =>
              void startAudioDownload(allPaths, allScope, 'update')
            }
          >
            更新{allLabel}已下載音檔
          </button>
        )}
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
          `${status.storageFull ? '儲存空間不足，已停止派發新下載；在途請求正在收尾' : status.cancelling ? '正在停止' : '音檔下載中'}… 本次已存 ${status.saved} / ${status.total}，失敗 ${status.failed} 個${status.storageFull ? `，待處理 ${status.pending} 個（含在途）` : ''}。可以切到其他頁面繼續學習。`}
        {visibleStatus &&
          status.kind === 'done' &&
          `完成：新存 ${status.saved} 個，失敗 ${status.failed} 個。${status.failed ? `（${status.reason}）再按一次補抓失敗與缺少的。` : ''}`}
        {visibleStatus &&
          status.kind === 'paused' &&
          `${status.why === 'quota' ? '儲存空間不足，下載已暫停' : status.why === 'network' ? '網路中斷，下載已暫停' : '已取消音檔下載'}：本次已存 ${status.saved} 個，失敗 ${status.failed} 個${status.why === 'quota' ? `，尚未處理 ${status.pending} 個；請釋放空間後接續` : ''}；已存的會保留，再按一次從缺少的接續。`}
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
