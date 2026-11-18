import { useLayoutEffect, useRef } from 'react';

/** 儲存失敗時保留可見提醒；只保留本分頁記憶體，不冒稱已落盤。 */
export function ProgressSaveNotice({
  error,
  retry,
}: {
  error: string | null;
  retry: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () =>
      document.documentElement.style.setProperty(
        '--save-notice-h',
        `${element.getBoundingClientRect().height}px`,
      );
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--save-notice-h');
    };
  }, [error]);
  if (!error) return null;
  return (
    <aside className="notice save-notice" ref={ref} aria-label="進度儲存狀態">
      <p role="alert">{error}</p>
      <p>勿重載或關閉。釋放空間或允許儲存後再試。</p>
      <button className="btn" type="button" onClick={retry} title="只寫入目前進度，不重新評分">
        重新儲存
      </button>
    </aside>
  );
}
