import { stages } from '../../curriculum/lessons.mjs';
import { lessonProgress } from '../../lib/lesson-progress.mjs';
import type { Progress } from '../../lib/progress.mjs';
import { lessonHash, viewHash } from '../../lib/route.mjs';
import { buildCards, summarize, toDateString } from '../../lib/srs.mjs';
import { ChevronRightIcon } from '../components/Icons';
import { ProgressBar } from '../components/ProgressBar';
import { RubyText } from '../components/Ruby';

const CARDS = buildCards(stages);

const STAGE_ACCENT: Record<string, string> = {
  'stage-0': 's0',
  'stage-1': 's1',
  'stage-2': 's2',
  'stage-3': 's3',
};

/**
 * 首頁：上方是「今天的單字卡」大按鈕（最常做的事一鍵進去），下面依階段列出所有課程，
 * 每課顯示單字與聽寫的進度條，點進去才看到課文。
 */
export function LessonListView({ progress }: { progress: Progress }) {
  const stats = summarize(CARDS, progress.srs, toDateString());
  const todo = stats.due + stats.fresh;
  const byLesson = lessonProgress(stages, progress);

  return (
    <>
      <section className="card hero" aria-label="今天的單字卡">
        <p className="hero-label">今天的單字卡</p>
        {todo > 0 ? (
          <>
            <p className="hero-number">
              {todo}
              <small>張</small>
            </p>
            <p className="muted">
              到期 {stats.due} 張 · 新卡 {stats.fresh} 張
            </p>
            <a className="btn primary big block" href={viewHash('srs')}>
              開始複習
            </a>
          </>
        ) : (
          <>
            <p className="hero-number">都複習完了</p>
            <p className="muted">
              已學 {stats.learned} / {stats.total} 張。
            </p>
            <a className="btn big block" href={viewHash('dictation')}>
              去練聽寫
            </a>
          </>
        )}
      </section>

      {stages.map((stage) => (
        <section key={stage.id} className="stage">
          <h2 className={`stage-title ${STAGE_ACCENT[stage.id] ?? ''}`}>
            {stage.title}
          </h2>
          {stage.lessons.length === 0 ? (
            <p className="muted stage-empty">即將推出</p>
          ) : (
            <ul className="lesson-list">
              {stage.lessons.map((lesson) => {
                const p = byLesson[lesson.id];
                const meta = [
                  p.vocab.total > 0 && `單字 ${p.vocab.done}/${p.vocab.total}`,
                  p.dictation.total > 0 &&
                    `聽寫 ${p.dictation.done}/${p.dictation.total}`,
                  lesson.audioReady === false && '音檔製作中',
                ].filter(Boolean);
                const percent = Math.round(p.ratio * 100);
                return (
                  <li key={lesson.id}>
                    <a className="card lesson-card" href={lessonHash(lesson.id)}>
                      <span className="lesson-card-body">
                        <span className="lesson-title">
                          <RubyText text={lesson.title} />
                        </span>
                        <span className="muted">{meta.join(' · ')}</span>
                        <ProgressBar
                          value={percent}
                          max={100}
                          label={`${lesson.title} 的進度`}
                        />
                      </span>
                      <ChevronRightIcon />
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      ))}
    </>
  );
}
