import { useEffect, useState } from 'react';
import {
  VOCAB_IMAGE_FINGERPRINT,
  VOCAB_IMAGE_TOTAL,
} from 'virtual:vocab-image-fingerprint';
import { viewHash } from '../../lib/route.mjs';
import { IMAGE_CACHE_NAME } from '../../lib/vocab-image-offline.mjs';
import {
  adoptEarlierCompleteDownload,
  dismissImageUpdateHint,
  hasImageCompleteRecord,
  shouldShowImageUpdateHint,
} from '../lib/imageUpdateHint';

/**
 * 圖片有新版的提醒（T163）：只給曾經下載完全部圖片的人，一行、可關閉，同一版本按過「知道了」就不再出現。
 * 平常只讀 localStorage；沒有完成紀錄時才在載入後閒置時數一次快取筆數（見 adoptEarlierCompleteDownload）。
 * 不擋住學習。設定頁本身有圖片狀態，不重複顯示。
 */
export function ImageUpdateHint({ onSettings }: { onSettings: boolean }) {
  const [visible, setVisible] = useState(() =>
    shouldShowImageUpdateHint(VOCAB_IMAGE_FINGERPRINT),
  );

  useEffect(() => {
    if (hasImageCompleteRecord()) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void adoptEarlierCompleteDownload(VOCAB_IMAGE_TOTAL, IMAGE_CACHE_NAME).then((adopted) => {
        if (adopted && !cancelled) setVisible(shouldShowImageUpdateHint(VOCAB_IMAGE_FINGERPRINT));
      });
    }, 3000);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  if (!visible || onSettings) return null;
  const dismiss = () => {
    dismissImageUpdateHint(VOCAB_IMAGE_FINGERPRINT);
    setVisible(false);
  };
  return (
    <div className="notice notice-row">
      <span>單字圖片有新增或更新；要在離線時看到新圖，可到設定頁補下載。</span>
      <span className="row">
        <a className="btn primary" href={viewHash('settings')} onClick={dismiss}>
          前往下載
        </a>
        <button type="button" className="btn" onClick={dismiss}>
          知道了
        </button>
      </span>
    </div>
  );
}
