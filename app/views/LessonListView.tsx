import { stages, generalListeningRoadmap } from '../../curriculum/lessons.mjs';
import { lessonProgress } from '../../lib/lesson-progress.mjs';
import type { Progress } from '../../lib/progress.mjs';
import { lessonHash, srsHash, viewHash } from '../../lib/route.mjs';
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
            {/* 複習與新卡分開進（T52）：還不會的卡再多，也能直接學新卡。 */}
            <div className="hero-actions">
              {stats.due > 0 && (
                <a className="btn primary big" href={srsHash('review')}>
                  複習 {stats.due} 張
                </a>
              )}
              {stats.fresh > 0 && (
                <a
                  className={`btn big${stats.due > 0 ? '' : ' primary'}`}
                  href={srsHash('new')}
                >
                  學新卡 {stats.fresh} 張
                </a>
              )}
            </div>
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

      <section className="card" aria-label="動漫與遊戲通用聽解">
        <h2>動漫／遊戲通用聽解</h2>
        <p>
          初版 3 課：75 個單字、6 個文法重點、3 段男女聲對話與 9 題理解練習。
        </p>
        <p>
          每天 30～45 分鐘：先聽整段 → 學單字與句型 → 看解析並跟讀 →
          用單字卡複習。適合已有基本假名與 N5 概念的人；需要打底可先學「N5
          復健」。
        </p>
        <a className="btn primary" href={lessonHash('general-listening-01')}>
          開始通用聽解第一課
        </a>
        <ul className="list">
          {stages
            .find((s) => s.id === 'stage-1')
            ?.lessons.map((lesson) => (
              <li key={lesson.id}>
                <a href={lessonHash(lesson.id)}>{lesson.title}</a>
              </li>
            ))}
        </ul>
        <details>
          <summary>六階段學習路線（規劃 180 課）</summary>
          <p className="muted">
            目前完成起始 3
            課；其餘為擴充方向。目標是理解常見對話與任務大意，後期再練真實作品的速度、情緒與省略。
          </p>
          <ol>
            {generalListeningRoadmap.map((phase, i) => (
              <li key={phase.title}>
                <strong>{phase.title}</strong>：{phase.goal}。目標{' '}
                {phase.target} 課
                {i === 0 ? '，初版已提供 3 課。' : '，待擴充。'}
              </li>
            ))}
          </ol>
        </details>
      </section>

      <section className="card">
        <h2>遊戲角色語音</h2>
        <p>永恆輪迴與原神：角色台詞與學習教材，附自製音檔。</p>
        <a className="btn primary" href={viewHash('games')}>
          進入遊戲學習區
        </a>
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
                  p.listening.total > 0 &&
                    `理解 ${p.listening.done}/${p.listening.total}`,
                  p.grammar.total > 0 &&
                    `文法 ${p.grammar.done}/${p.grammar.total}`,
                  p.grammar.review > 0 && `文法待重練 ${p.grammar.review}`,
                  lesson.audioReady === false && '音檔製作中',
                ].filter(Boolean);
                const percent = Math.round(p.ratio * 100);
                return (
                  <li key={lesson.id}>
                    <a
                      className="card lesson-card"
                      href={lessonHash(lesson.id)}
                    >
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
