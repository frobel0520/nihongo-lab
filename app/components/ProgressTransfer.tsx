import { useRef, useState, type ChangeEvent } from 'react';
import { mergeProgress } from '../../lib/progress-merge.mjs';
import {
  MAX_IMPORT_BYTES,
  exportFilename,
  exportProgress,
  parseImport,
} from '../../lib/progress-transfer.mjs';
import type { Progress } from '../../lib/progress.mjs';

type Message = { kind: 'ok' | 'error'; text: string };

function download(text: string, filename: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * 學習進度的備份：匯出成 JSON 檔，之後（換手機、清除網站資料、另一台電腦）再匯入。
 * 匯入是「合併」不是覆蓋：逐筆保留較新的，所以匯入舊備份不會把現在的進度洗掉。
 */
export function ProgressTransfer({
  progress,
  update,
}: {
  progress: Progress;
  update: (change: (prev: Progress) => Progress) => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const cards = Object.keys(progress.srs).length;
  const sentences = Object.keys(progress.dictation).length;

  const onExport = () => {
    try {
      const now = new Date();
      const filename = exportFilename(now);
      download(exportProgress(progress, now.toISOString()), filename);
      setMessage({
        kind: 'ok',
        text: `已產生 ${filename}（單字卡 ${cards} 張、聽寫 ${sentences} 句）。請確認瀏覽器有把檔案存下來。`,
      });
    } catch (error) {
      setMessage({
        kind: 'error',
        text: `匯出失敗：${error instanceof Error ? error.message : String(error)}`,
      });
    }
  };

  const onPick = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ''; // 同一個檔案可以再選一次
    if (!file) return;
    if (file.size > MAX_IMPORT_BYTES) {
      setMessage({
        kind: 'error',
        text: '這個檔案太大，不像進度檔，沒有匯入任何東西。',
      });
      return;
    }
    let text: string;
    try {
      text = await file.text();
    } catch {
      setMessage({ kind: 'error', text: '讀不到檔案內容，沒有匯入任何東西。' });
      return;
    }
    const result = parseImport(text);
    if (!result.ok) {
      setMessage({ kind: 'error', text: result.message });
      return;
    }

    const { changes } = mergeProgress(progress, result.progress);
    update((prev) => mergeProgress(prev, result.progress).progress);
    const skipped =
      result.dropped > 0 ? `另有 ${result.dropped} 筆格式不正確，已略過。` : '';
    const inFile = `檔案內共單字卡 ${Object.keys(result.progress.srs).length} 張、聽寫 ${Object.keys(result.progress.dictation).length} 句`;
    setMessage({
      kind: 'ok',
      text:
        changes.srs + changes.dictation === 0
          ? `${inFile}，跟目前一樣或比較舊，沒有任何變動。${skipped}`
          : `已匯入，新增或更新單字卡 ${changes.srs} 張、聽寫 ${changes.dictation} 句（${inFile}；比現有紀錄舊的不會蓋掉現有的）。${skipped}`,
    });
  };

  return (
    <section className="card">
      <h3>學習進度備份</h3>
      <p className="muted">
        目前單字卡 {cards} 張、聽寫 {sentences} 句的紀錄，只存在這個瀏覽器裡；
        清除網站資料或換裝置就沒有了。匯出成檔案可以當備份，也可以拿到另一台裝置匯入。
        匯入會跟現有進度合併，逐筆保留較新的。
      </p>
      <div className="row">
        <button type="button" className="btn" onClick={onExport}>
          匯出進度
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => fileInput.current?.click()}
        >
          匯入進度
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={onPick}
        />
      </div>
      {message &&
        (message.kind === 'ok' ? (
          <output className="notice">{message.text}</output>
        ) : (
          <p className="error" role="alert">
            {message.text}
          </p>
        ))}
    </section>
  );
}
