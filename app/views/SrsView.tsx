import { useEffect, useState } from 'react';
import { stages } from '../../curriculum/lessons.mjs';
import { isInteractive, isTextEntry, type KeyTarget } from '../../lib/keys.mjs';
import { recordReviewFrom, type Progress } from '../../lib/progress.mjs';
import { srsHash, viewHash } from '../../lib/route.mjs';
import {
  applyGrade,
  baseState,
  createSession,
  currentCard,
  resolvedCount,
  step,
  type Session,
} from '../../lib/srs-session.mjs';
import {
  buildCards,
  buildDeck,
  schedule,
  summarize,
  toDateString,
  type Grade,
  type SrsMode,
} from '../../lib/srs.mjs';
import { PlayButton } from '../components/AudioLine';
import {
  BackIcon,
  CheckIcon,
  ChevronRightIcon,
  CloseIcon,
} from '../components/Icons';
import { ProgressBar } from '../components/ProgressBar';
import { RubyText } from '../components/Ruby';
import { useSwipeNavigation } from '../lib/useSwipeNavigation';

const CARDS = buildCards(stages);

// 評分：✕／✓ 圖示加文字；快捷鍵 1、2 依序對應。滑動只換卡。
const GRADE_LABEL: Record<Grade, string> = {
  again: '還不會',
  good: '記得',
};
const GRADES: Grade[] = ['again', 'good'];

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

/**
 * 單字卡分成兩區（T52）：複習（今天到期，含答「還不會」的）與新卡（還沒看過的），各自一輪。
 * 「還不會」的卡再多，也能直接切到新卡區，不會被擋住。
 */
function ModeSwitch({ mode, due, fresh }: { mode: SrsMode; due: number; fresh: number }) {
  const options: { id: SrsMode; label: string; count: number }[] = [
    { id: 'review', label: '複習', count: due },
    { id: 'new', label: '新卡', count: fresh },
  ];
  return (
    <fieldset className="segmented srs-modes" data-no-swipe>
      <legend className="sr-only">單字卡分區</legend>
      {options.map((option) => (
        <label key={option.id}>
          <input
            type="radio"
            name="srs-mode"
            checked={mode === option.id}
            // 用 replace 換區：切換分區不該在返回鍵的歷史裡留一堆紀錄。
            onChange={() => window.location.replace(srsHash(option.id))}
          />
          <span>
            {option.label} {option.count}
          </span>
        </label>
      ))}
    </fieldset>
  );
}

export function SrsView({
  progress,
  update,
  mode,
}: {
  progress: Progress;
  update: (change: (prev: Progress) => Progress) => void;
  mode: SrsMode;
}) {
  // 日期每次渲染都重算：畫面停在單字卡過了午夜，評分與預告仍用「現在」的日期，不會排出偏一天的到期日。
  const today = toDateString();
  // 牌組只在進入畫面（或換區）時排一次；一輪的流程（上一張／下一張、評分後跳到哪一張）見 lib/srs-session.mjs。
  const [session, setSession] = useState<Session>(() =>
    createSession(buildDeck(mode, CARDS, progress.srs, toDateString())),
  );
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const current = currentCard(session);
  const total = session.deck.length;
  // 進度 = 這一輪已評「記得」的張數，答「還不會」不會讓進度倒退。
  const done = resolvedCount(session);
  const currentGrade = current ? session.grades[current.id] : undefined;
  // 這張卡排程要用的狀態：這一輪第一次評分之前的（回頭改評分才不會把間隔推進兩次）。
  const baseOf = current
    ? baseState(session, current, progress.srs[current.id])
    : undefined;

  /** 換到另一張（或結束）：這一輪評過的卡直接顯示答案面，方便回頭看與改評分。 */
  const moveTo = (next: Session) => {
    if (next === session) return;
    setSession(next);
    const card = currentCard(next);
    setRevealed(card !== null && next.grades[card.id] !== undefined);
  };
  const swipe = useSwipeNavigation(
    () => moveTo(step(session, -1)),
    () => moveTo(step(session, 1)),
  );

  const grade = (g: Grade) => {
    if (!current) return;
    // 評分當下才取日期，畫面放了一夜再按也不會用到昨天的日期。
    const day = toDateString();
    const stamp = new Date().toISOString();
    update((prev) => recordReviewFrom(prev, current.id, baseOf, g, day, stamp));
    setReviewed((n) => n + 1);
    moveTo(applyGrade(session, g, progress.srs[current.id]));
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
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        if (isTextEntry(target)) return;
        moveTo(step(session, e.key === 'ArrowLeft' ? -1 : 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const stats = summarize(CARDS, progress.srs, today);

  if (CARDS.length === 0) {
    return (
      <section className="card empty">
        <p>教材還沒有單字。</p>
      </section>
    );
  }

  const modeSwitch = <ModeSwitch mode={mode} due={stats.due} fresh={stats.fresh} />;

  if (!current) {
    const other: SrsMode = mode === 'review' ? 'new' : 'review';
    const otherCount = other === 'new' ? stats.fresh : stats.due;
    const emptyLabel = mode === 'review' ? '目前沒有要複習的卡片' : '新卡都看過了';
    return (
      <>
        {modeSwitch}
      <section className="card hero">
        <p className="hero-label">{reviewed > 0 ? '完成！' : emptyLabel}</p>
        <p className="hero-number">
          {reviewed > 0 ? reviewed : stats.learned}
          <small>{reviewed > 0 ? '次評分' : `/ ${stats.total} 張已學`}</small>
        </p>
        <p className="muted">
          {reviewed > 0
            ? `已學 ${stats.learned} / ${stats.total} 張。`
            : mode === 'review'
              ? '答「記得」的卡會在幾天後到期回到這裡；答「還不會」的今天就會出現在這裡。'
              : '教材新增單字時，會出現在這裡。'}
        </p>
        {otherCount > 0 && (
          <a className="btn primary big block" href={srsHash(other)}>
            {other === 'new' ? `去學新卡（${otherCount} 張）` : `去複習（${otherCount} 張到期）`}
          </a>
        )}
        {total > 0 && (
          <button
            type="button"
            className="btn big block"
            onClick={() => moveTo(step(session, -1))}
          >
            回到最後一張
          </button>
        )}
        <a className="btn big block" href={viewHash('lessons')}>
          回課程
        </a>
      </section>
      </>
    );
  }

  const preview = (g: Grade) =>
    intervalText(schedule(baseOf, g, today).interval);

  return (
    <div className="srs-screen" {...swipe}>
      {modeSwitch}
      <div className="progress-head">
        <ProgressBar value={done} max={total} label="這一輪的進度" />
        <span className="muted">
          {done} / {total}
        </span>
      </div>

      <div className="stepper" data-no-swipe>
        <button
          type="button"
          className="icon-btn"
          aria-label="上一張"
          disabled={session.index === 0}
          onClick={() => moveTo(step(session, -1))}
        >
          <BackIcon />
        </button>
        <span className="stepper-label">
          <strong>
            第 {session.index + 1} / {total} 張
          </strong>
          {currentGrade && (
            <span className="muted">
              這一輪已評：{GRADE_LABEL[currentGrade]}
            </span>
          )}
        </span>
        <button
          type="button"
          className="icon-btn"
          aria-label="下一張"
          disabled={session.index >= total - 1}
          onClick={() => moveTo(step(session, 1))}
        >
          <ChevronRightIcon />
        </button>
      </div>

      <div className="flashcard-area">
        <div className="flashcard" aria-live="polite">
          <div className="flash-word" lang="ja">
            {current.word}
          </div>
          {current.audioReady ? (
            <PlayButton key={current.id} audio={current.audio} label="播放" />
          ) : (
            <span className="muted">音檔製作中</span>
          )}
          {revealed && (
            <div className="flash-back">
              <div className="flash-reading" lang="ja">
                {current.reading}
              </div>
              <div className="flash-zh">
                <RubyText text={current.zh} />
              </div>
              <span className="chip">
                <RubyText text={current.lessonTitle} />
              </span>
            </div>
          )}
        </div>
        <p className="muted swipe-hint">左滑下一張 · 右滑上一張</p>
      </div>

      <div className="actions" data-no-swipe>
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
