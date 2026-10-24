import { useCallback, useEffect, useRef, useState } from 'react';
import { downloadMissing } from '../../lib/offline.mjs';
import {
  IMAGE_DOWNLOAD_CONCURRENCY,
  IMAGE_DOWNLOAD_RETRIES,
  formatMegabytes,
} from '../../lib/vocab-image-offline.mjs';
import { offlineSupported } from '../lib/offlineAudio';
import {
  createImageStore,
  pruneImageCache,
  readImageStatus,
  storageShortfall,
  withDownloadLock,
} from '../lib/offlineImages';

type Counts = Awaited<ReturnType<typeof readImageStatus>>;
type Status =
  | { kind: 'idle' }
  | { kind: 'busy'; done: number; total: number }
  | { kind: 'result'; downloaded: number; failed: number; reason?: string }
  | { kind: 'notice'; message: string }
  | { kind: 'error'; message: string };

const errorText = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

/**
 * 單字圖片（T161）：不再於安裝時預先下載。揭示時線上載入；要離線看圖請在這裡下載全部。
 * 已是正確版本的略過，只抓缺少或修訂過的；中斷後再按一次從缺少的接續。
 */
export function OfflineImages() {
  const supported = offlineSupported();
  const [counts, setCounts] = useState<Counts | null>(null);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const alive = useRef(true);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      abort.current?.abort();
    };
  }, []);

  const refresh = useCallback(async () => {
    try {
      const next = await readImageStatus();
      if (alive.current) setCounts(next);
      return next;
    } catch (error) {
      if (alive.current) setStatus({ kind: 'error', message: errorText(error) });
      return null;
    }
  }, []);

  useEffect(() => {
    if (supported) void refresh();
  }, [supported, refresh]);

  const run = async () => {
    const current = await refresh();
    if (!current) return;
    const shortfall = await storageShortfall(current.pendingBytes);
    if (shortfall > 0) {
      setStatus({
        kind: 'error',
        message: `可用儲存空間可能不足（約差 ${formatMegabytes(shortfall)}），請清出空間後再下載。`,
      });
      return;
    }
    setStatus({ kind: 'busy', done: 0, total: current.pending });
    const controller = new AbortController();
    abort.current = controller;
    try {
      const outcome = await withDownloadLock(() =>
        downloadMissing(current.missing, createImageStore(), {
          concurrency: IMAGE_DOWNLOAD_CONCURRENCY,
          retries: IMAGE_DOWNLOAD_RETRIES,
          label: (image) => image.src,
          notRetainedMessage: '圖片未保留在快取中，請檢查可用儲存空間後重試。',
          signal: controller.signal,
          onProgress: ({ done, total }) => {
            if (alive.current) setStatus({ kind: 'busy', done, total });
          },
        }),
      );
      if (outcome === 'locked') {
        if (alive.current)
          setStatus({ kind: 'notice', message: '另一個分頁正在下載圖片，完成後再按「重新檢查」。' });
      } else {
        await pruneImageCache();
        if (alive.current)
          setStatus({
            kind: 'result',
            downloaded: outcome.downloaded,
            failed: outcome.failed.length,
            reason: outcome.failed[0]?.message,
          });
      }
    } catch (error) {
      if (alive.current) setStatus({ kind: 'error', message: errorText(error) });
    }
    await refresh();
  };

  if (!supported) {
    return (
      <section className="card">
        <h3>離線單字圖片</h3>
        <p className="muted">
          這個瀏覽器不支援離線快取（需要 HTTPS 或 localhost），離線時卡片只顯示文字。
        </p>
      </section>
    );
  }

  const busy = status.kind === 'busy';
  const allDone = counts !== null && counts.pending === 0;

  return (
    <section className="card">
      <h3>離線單字圖片</h3>
      <p className="muted">
        {'圖片不會在安裝時預先下載；有網路時翻開答案會載入並暫存最近看過的圖。要在沒有網路時看到所有圖片，請先在這裡下載。' +
          '沒下載的圖離線時只顯示文字，學習不受影響。已下載的圖片不會因瀏覽其他卡片而由本網站自動刪除；瀏覽器或系統清除儲存空間後需重新下載。'}
      </p>
      {counts && (
        <p className="muted">
          共 {counts.total} 張（{formatMegabytes(counts.totalBytes)}）：已下載{' '}
          {counts.downloaded} 張，待下載 {counts.pending} 張（
          {formatMegabytes(counts.pendingBytes)}）
          {counts.updates > 0 && `，其中 ${counts.updates} 張是更新過的新版`}。
        </p>
      )}
      <div className="row">
        <button
          type="button"
          className="btn"
          disabled={busy || allDone}
          onClick={() => void run()}
        >
          {allDone
            ? '單字圖片已全部存好'
            : counts && counts.downloaded > 0
              ? '下載其餘單字圖片'
              : '下載全部單字圖片'}
        </button>
        <button type="button" className="btn" disabled={busy} onClick={() => void refresh()}>
          重新檢查圖片狀態
        </button>
      </div>
      <output className="muted status-line">
        {status.kind === 'busy' && `下載圖片中… ${status.done} / ${status.total}`}
        {status.kind === 'result' &&
          (status.failed === 0
            ? `完成：新存 ${status.downloaded} 張。`
            : `新存 ${status.downloaded} 張，失敗 ${status.failed} 張（${status.reason}）。再按一次只會補抓失敗與缺少的。`)}
        {status.kind === 'notice' && status.message}
      </output>
      {status.kind === 'error' && (
        <p className="error" role="alert">
          離線圖片發生錯誤：{status.message}
        </p>
      )}
    </section>
  );
}
