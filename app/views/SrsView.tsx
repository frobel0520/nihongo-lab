import { useEffect, useState } from 'react';
import { stages } from '../../curriculum/lessons.mjs';
import type { Progress } from '../../lib/progress.mjs';
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
import { GradeIcon } from '../components/GradeIcon';

const CARDS = buildCards(stages);

// 評分以圖示呈現（✕／✓），文字只用在提示與螢幕閱讀器；快捷鍵 1、2 依序對應。
const GRADE_LABEL: Record<Grade, string> = {
  again: '還不會',
  good: '記得',
};
const GRADES: Grade[] = ['again', 'good'];

function intervalText(days: number) {
  return days === 0 ? '今天再看' : `${days} 天後`;
}

export function SrsView({
  progress,
  update,
}: {
  progress: Progress;
  update: (change: (prev: Progress) => Progress) => void;
}) {
  const [today] = useState(() => toDateString());
  // 佇列只在進入畫面時排一次；答「還不會」的卡會排回佇列尾端，同一輪再看。
  const [queue, setQueue] = useState<Card[]>(() =>
    buildQueue(CARDS, progress.srs, today),
  );
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const current = queue[0];

  const grade = (g: Grade) => {
    if (!current) return;
    update((prev) => ({
      ...prev,
      srs: {
        ...prev.srs,
        [current.id]: schedule(prev.srs[current.id], g, today),
      },
    }));
    setQueue((q) => (g === 'again' ? [...q.slice(1), q[0]] : q.slice(1)));
    setReviewed((n) => n + 1);
    setRevealed(false);
  };

  useEffect(() => {
    if (!current) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (!revealed && e.key === ' ') {
        e.preventDefault();
        setRevealed(true);
      } else if (revealed && ['1', '2'].includes(e.key)) {
        grade(GRADES[Number(e.key) - 1]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const stats = summarize(CARDS, progress.srs, today);

  if (CARDS.length === 0) {
    return (
      <section>
        <h3>單字卡</h3>
        <p>教材還沒有單字。</p>
      </section>
    );
  }

  if (!current) {
    return (
      <section>
        <h3>單字卡</h3>
        <p className="answer">
          {reviewed > 0
            ? `今天的複習完成，這一輪看了 ${reviewed} 次。`
            : '目前沒有要複習的卡片。'}
        </p>
        <p className="muted">
          已學 {stats.learned} / {stats.total} 張；今天還能學 {stats.fresh}{' '}
          張新卡。
        </p>
      </section>
    );
  }

  const preview = (g: Grade) =>
    intervalText(schedule(progress.srs[current.id], g, today).interval);

  return (
    <section>
      <h3>單字卡</h3>
      <p className="muted">
        剩 {queue.length} 張（到期 {stats.due}、新卡 {stats.fresh}）· 已學{' '}
        {stats.learned} / {stats.total}
      </p>

      <div className="flashcard" aria-live="polite">
        <div className="flash-word" lang="ja">
          {current.word}
        </div>
        <PlayButton audio={current.audio} />
        {revealed ? (
          <div className="flash-back">
            <div className="line-reading" lang="ja">
              {current.reading}
            </div>
            <div className="flash-zh">{current.zh}</div>
            <div className="muted">{current.lessonTitle}</div>
          </div>
        ) : (
          <button
            type="button"
            className="btn primary"
            onClick={() => setRevealed(true)}
          >
            顯示答案（空白鍵）
          </button>
        )}
      </div>

      {revealed && (
        <fieldset className="grades">
          <legend className="sr-only">評分</legend>
          {GRADES.map((g, i) => (
            <button
              key={g}
              type="button"
              className={`btn grade-${g}`}
              aria-label={`${GRADE_LABEL[g]}，${preview(g)}（按 ${i + 1}）`}
              title={`${GRADE_LABEL[g]}（按 ${i + 1}）`}
              onClick={() => grade(g)}
            >
              <GradeIcon grade={g} />
              <small>{preview(g)}</small>
            </button>
          ))}
        </fieldset>
      )}
    </section>
  );
}
