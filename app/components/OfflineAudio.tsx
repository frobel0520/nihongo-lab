import { useCallback, useEffect, useRef, useState } from 'react';
import { countCached, downloadAudio } from '../../lib/offline.mjs';
import { createAudioStore, offlineSupported } from '../lib/offlineAudio';

type Status =
  | { kind: 'idle' }
  | { kind: 'busy'; done: number; total: number }
  | { kind: 'result'; downloaded: number; failed: number; reason?: string }
  | { kind: 'error'; message: string };

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
}: {
  lessonPaths: string[];
  allPaths: string[];
  lessonLabel?: string;
  allLabel?: string;
}) {
  const supported = offlineSupported();
  const [counts, setCounts] = useState<{ lesson: number; all: number } | null>(
    null,
  );
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
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
      if (alive.current) setCounts({ lesson, all });
    } catch (error) {
      if (alive.current) {
        setStatus({ kind: 'error', message: errorText(error) });
      }
    }
  }, [lessonPaths, allPaths]);

  useEffect(() => {
    if (supported) void refresh();
  }, [supported, refresh]);

  const run = async (paths: string[]) => {
    setStatus({ kind: 'busy', done: 0, total: 0 });
    try {
      const result = await downloadAudio(paths, createAudioStore(), {
        onProgress: ({ done, total }) => {
          if (alive.current) setStatus({ kind: 'busy', done, total });
        },
      });
      if (alive.current) {
        setStatus({
          kind: 'result',
          downloaded: result.downloaded,
          failed: result.failed.length,
          reason: result.failed[0]?.message,
        });
      }
    } catch (error) {
      if (alive.current) {
        setStatus({ kind: 'error', message: errorText(error) });
      }
    }
    await refresh();
  };

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

  const busy = status.kind === 'busy';
  const lessonDone = counts !== null && counts.lesson >= lessonPaths.length;
  const allDone = counts !== null && counts.all >= allPaths.length;

  return (
    <section className="card">
      <h3>離線音檔</h3>
      <p className="muted">
        播放不會自動存檔；要在沒有網路時聽音檔，請先在有網路時下載。文字內容本來就能離線閱讀。
        已下載音檔不會因播放其他音檔而由本網站自動刪除；瀏覽器或系統清除儲存空間後仍需重新下載。
        {counts &&
          `　已存：${lessonPaths.length > 0 ? `${lessonLabel} ${counts.lesson} / ${lessonPaths.length}，` : ''}${allLabel} ${counts.all} / ${allPaths.length}。`}
      </p>
      <div className="row">
        {lessonPaths.length > 0 && (
          <button
            type="button"
            className="btn"
            disabled={busy || lessonDone}
            onClick={() => run(lessonPaths)}
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
          onClick={() => run(allPaths)}
        >
          {allDone ? `${allLabel}音檔已存好` : `下載${allLabel}音檔`}
        </button>
        <button type="button" className="btn" disabled={busy} onClick={() => void refresh()}>
          重新檢查下載狀態
        </button>
      </div>
      <output className="muted status-line">
        {status.kind === 'busy' && `下載中… ${status.done} / ${status.total}`}
        {status.kind === 'result' &&
          (status.failed === 0
            ? `完成：新存 ${status.downloaded} 個。`
            : `新存 ${status.downloaded} 個，失敗 ${status.failed} 個（${status.reason}）。再按一次只會補抓失敗的。`)}
      </output>
      {status.kind === 'error' && (
        <p className="error" role="alert">
          離線音檔發生錯誤：{status.message}
        </p>
      )}
    </section>
  );
}
