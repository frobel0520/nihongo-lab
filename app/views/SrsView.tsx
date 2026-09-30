import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { stages } from '../../curriculum/lessons.mjs';
import { isInteractive, isTextEntry, type KeyTarget } from '../../lib/keys.mjs';
import type { Progress } from '../../lib/progress.mjs';
import { viewHash } from '../../lib/route.mjs';
import {
  buildCards,
  buildQueue,
  schedule,
  summarize,
  toDateString,
  type Card,
  type Grade,
} from '../../lib/srs.mjs';
import { PlayButton } from '../components/AudioLine';
import { CheckIcon, CloseIcon } from '../components/Icons';
import { ProgressBar } from '../components/ProgressBar';

const CARDS = buildCards(stages);

// 評分：✕／✓ 圖示加文字；快捷鍵 1、2 依序對應，卡片翻開後也可以左右滑。
const GRADE_LABEL: Record<Grade, string> = {
  again: '還不會',
  good: '記得',
};
const GRADES: Grade[] = ['again', 'good'];

/** 滑動超過這個距離（px）就當成評分。 */
const SWIPE_DISTANCE = 90;
/** 滑到這個距離開始顯示「往哪邊評分」的顏色提示。 */
const SWIPE_HINT_DISTANCE = 30;

/** 把事件目標轉成 lib/keys.mjs 判斷用的形狀。 */
function keyTargetOf(target: EventTarget | null): KeyTarget | null {
  if (!(target instanceof HTMLElement)) return null;
  return {
    tagName: target.tagName,
    isContentEditable: target.isContentEditable,
    role: target.getAttribute('role'),
  };
}

function intervalText(days: number) {
  return days === 0 ? '今天再看' : `${days} 天後`;
}

/** 手機的輕微震動回饋；不支援（iOS、桌面）就什麼都不做。 */
function buzz() {
  try {
    navigator.vibrate?.(8);
  } catch {
    // 不支援或被瀏覽器擋下，沒有影響
  }
}

export function SrsView({
  progress,
  update,
}: {
  progress: Progress;
  update: (change: (prev: Progress) => Progress) => void;
}) {
  // 日期每次渲染都重算：畫面停在單字卡過了午夜，評分與預告仍用「現在」的日期，不會排出偏一天的到期日。
  const today = toDateString();
  // 佇列只在進入畫面時排一次；答「還不會」的卡會排回佇列尾端，同一輪再看。
  const [initialQueue] = useState<Card[]>(() =>
    buildQueue(CARDS, progress.srs, toDateString()),
  );
  const [queue, setQueue] = useState<Card[]>(initialQueue);
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [drag, setDrag] = useState(0);
  const dragStart = useRef<number | null>(null);
  const current = queue[0];
  const total = initialQueue.length;
  // 佇列長度就是「還沒答對的不重複卡片數」（答錯的卡排回尾端，長度不變），所以進度不會因為答錯倒退。
  const done = total - queue.length;

  const grade = (g: Grade) => {
    if (!current) return;
    // 評分當下才取日期，畫面放了一夜再按也不會用到昨天的日期。
    const now = toDateString();
    update((prev) => ({
      ...prev,
      srs: {
        ...prev.srs,
        [current.id]: schedule(prev.srs[current.id], g, now),
      },
    }));
    setQueue((q) => (g === 'again' ? [...q.slice(1), q[0]] : q.slice(1)));
    setReviewed((n) => n + 1);
    setRevealed(false);
    setDrag(0);
    buzz();
  };

  useEffect(() => {
    if (!current) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = keyTargetOf(e.target);
      if (!revealed && e.key === ' ') {
        // 焦點在按鈕或連結上時，空白鍵是「按下去」，不能搶來翻卡。
        if (isInteractive(target)) return;
        e.preventDefault();
        setRevealed(true);
      } else if (revealed && ['1', '2'].includes(e.key)) {
        if (isTextEntry(target)) return;
        grade(GRADES[Number(e.key) - 1]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // 翻開後左右滑：往右「記得」、往左「還不會」。翻開前不處理，避免誤觸；按鈕上的按下不算滑動起點。
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!revealed || (e.target as HTMLElement).closest('button')) return;
    dragStart.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return;
    setDrag(e.clientX - dragStart.current);
  };
  const onPointerEnd = () => {
    if (dragStart.current === null) return;
    dragStart.current = null;
    if (drag > SWIPE_DISTANCE) grade('good');
    else if (drag < -SWIPE_DISTANCE) grade('again');
    else setDrag(0);
  };

  const stats = summarize(CARDS, progress.srs, today);

  if (CARDS.length === 0) {
    return (
      <section className="card empty">
        <p>教材還沒有單字。</p>
      </section>
    );
  }

  if (!current) {
    return (
      <section className="card hero">
        <p className="hero-label">{reviewed > 0 ? '完成！' : '目前沒有要複習的卡片'}</p>
        <p className="hero-number">
          {reviewed > 0 ? reviewed : stats.learned}
          <small>{reviewed > 0 ? '次複習' : `/ ${stats.total} 張已學`}</small>
        </p>
        <p className="muted">
          {reviewed > 0
            ? `已學 ${stats.learned} / ${stats.total} 張。`
            : '有新的單字或到期的卡片時，會出現在這裡。'}
        </p>
        <a className="btn primary big block" href={viewHash('lessons')}>
          回課程
        </a>
      </section>
    );
  }

  const preview = (g: Grade) =>
    intervalText(schedule(progress.srs[current.id], g, today).interval);

  const hint =
    drag > SWIPE_HINT_DISTANCE
      ? 'good'
      : drag < -SWIPE_HINT_DISTANCE
        ? 'again'
        : undefined;

  return (
    <div className="srs-screen">
      <div className="progress-head">
        <ProgressBar value={done} max={total} label="這一輪的進度" />
        <span className="muted">
          {done} / {total}
        </span>
      </div>

      <div className="flashcard-area">
        <div
          className="flashcard"
          aria-live="polite"
          data-hint={hint}
          data-dragging={dragStart.current !== null || undefined}
          style={{
            transform: drag
              ? `translateX(${drag}px) rotate(${drag / 25}deg)`
              : undefined,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
        >
          <div className="flash-word" lang="ja">
            {current.word}
          </div>
          {current.audioReady ? (
            <PlayButton audio={current.audio} label="播放" />
          ) : (
            <span className="muted">音檔製作中</span>
          )}
          {revealed && (
            <div className="flash-back">
              <div className="flash-reading" lang="ja">
                {current.reading}
              </div>
              <div className="flash-zh">{current.zh}</div>
              <span className="chip">{current.lessonTitle}</span>
            </div>
          )}
        </div>
        {revealed && (
          <p className="muted swipe-hint">← 還不會　記得 →（也可以左右滑動卡片）</p>
        )}
      </div>

      <div className="actions">
        {revealed ? (
          <fieldset className="grades">
            <legend className="sr-only">評分</legend>
            {GRADES.map((g, i) => (
              <button
                key={g}
                type="button"
                className={`grade grade-${g}`}
                aria-label={`${GRADE_LABEL[g]}，${preview(g)}（按 ${i + 1}）`}
                title={`${GRADE_LABEL[g]}（按 ${i + 1}）`}
                onClick={() => grade(g)}
              >
                {g === 'again' ? <CloseIcon /> : <CheckIcon />}
                <span>{GRADE_LABEL[g]}</span>
                <small>{preview(g)}</small>
              </button>
            ))}
          </fieldset>
        ) : (
          <button
            type="button"
            className="btn primary big block"
            onClick={() => setRevealed(true)}
          >
            顯示答案
          </button>
        )}
      </div>
    </div>
  );
}
