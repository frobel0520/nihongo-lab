import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { formatMegabytes } from '../../lib/vocab-image-offline.mjs';
import { offlineSupported } from '../lib/offlineAudio';
import { readImageStatus } from '../lib/offlineImages';
import {
  cancelImageDownload,
  getImageJob,
  startImageDownload,
  subscribeImageJob,
  type ImageJobState,
} from '../lib/imageDownloadJob';

type Counts = Awaited<ReturnType<typeof readImageStatus>>;

const errorText = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

/** 結果說明：「新存」只算實際寫入快取的張數；網路中斷沒存到的不算失敗。 */
function jobMessage(job: ImageJobState) {
  switch (job.kind) {
    case 'running':
      return job.cancelling
        ? `正在停止…本次已存 ${job.saved} 張。`
        : `下載中：本次已存 ${job.saved} / ${job.total} 張${job.failed ? `，失敗 ${job.failed} 張` : ''}。可以切到其他頁面繼續學習。`;
    case 'done':
      return job.failed === 0
        ? `完成：新存 ${job.saved} 張。`
        : `新存 ${job.saved} 張，失敗 ${job.failed} 張（${job.reason}）。再按一次只會補抓失敗與缺少的。`;
    case 'paused':
      return job.why === 'cancelled'
        ? `已取消：本次已存 ${job.saved} 張，已存的會保留；再按一次從缺少的接續。`
        : `網路中斷，下載已暫停：本次已存 ${job.saved} 張，已存的會保留。連上網路後再按一次，從缺少的接續。`;
    case 'offline':
      return '目前沒有網路，無法下載圖片。連上網路後再按一次。';
    case 'locked':
      return '另一個分頁正在下載圖片，完成後再按「重新檢查」。';
    default:
      return '';
  }
}

/**
 * 單字圖片（T161／T163）：不在安裝時預先下載。揭示時線上載入；要離線看圖請在這裡下載全部。
 * 下載工作不隨本頁卸載（imageDownloadJob）；這裡只顯示同一個工作的狀態。
 */
export function OfflineImages() {
  const supported = offlineSupported();
  const job = useSyncExternalStore(subscribeImageJob, getImageJob);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [checkError, setCheckError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setCounts(await readImageStatus());
      setCheckError(null);
    } catch (error) {
      setCheckError(errorText(error));
    }
  }, []);

  const running = job.kind === 'running';
  // 進入本頁與工作結束時重新讀實際快取，數字以快取為準。
  useEffect(() => {
    if (supported && !running) void refresh();
  }, [supported, running, refresh]);
  // 下載中才回到本頁：先讀一次總張數與大小。
  useEffect(() => {
    if (supported && getImageJob().kind === 'running') void refresh();
  }, [supported, refresh]);

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

  // 下載中以「開始時已有＋本次已存」顯示，不在途中反覆掃描快取。
  const live = running && job.images > 0;
  const downloaded = live ? job.before + job.saved : (counts?.downloaded ?? 0);
  const pending = live ? job.images - job.before - job.saved : (counts?.pending ?? 0);
  const allDone = counts !== null && !running && counts.pending === 0;
  const error = job.kind === 'error' ? job.message : checkError;

  return (
    <section className="card" id="offline-images">
      <h3>離線單字圖片</h3>
      <p className="muted">
        {'圖片不會在安裝時預先下載；有網路時翻開答案會載入並暫存最近看過的圖。要在沒有網路時看到所有圖片，請先在這裡下載。' +
          '沒下載的圖離線時只顯示文字，學習不受影響。下載期間可以切到其他頁面；重新整理或關閉本網站會中斷，下次再按會從缺少的接續。' +
          '已下載的圖片不會因瀏覽其他卡片而由本網站自動刪除；按下方「清除快取」或瀏覽器、系統清除儲存空間後需重新下載。'}
      </p>
      {counts && (
        <p className="muted">
          共 {counts.total} 張（{formatMegabytes(counts.totalBytes)}）：已下載 {downloaded} 張，待下載{' '}
          {pending} 張
          {!running && `（${formatMegabytes(counts.pendingBytes)}）`}
          {!running && counts.updates > 0 && `，其中 ${counts.updates} 張是更新過的新版`}。
        </p>
      )}
      <div className="row">
        {running ? (
          <button
            type="button"
            className="btn"
            disabled={job.cancelling}
            onClick={cancelImageDownload}
          >
            取消下載
          </button>
        ) : (
          <button
            type="button"
            className="btn"
            disabled={allDone}
            onClick={() => void startImageDownload()}
          >
            {allDone
              ? '單字圖片已全部存好'
              : counts && counts.downloaded > 0
                ? '下載其餘單字圖片'
                : '下載全部單字圖片'}
          </button>
        )}
        <button type="button" className="btn" disabled={running} onClick={() => void refresh()}>
          重新檢查圖片狀態
        </button>
      </div>
      <output className="muted status-line">{jobMessage(job)}</output>
      {error && (
        <p className="error" role="alert">
          離線圖片發生錯誤：{error}
        </p>
      )}
    </section>
  );
}
