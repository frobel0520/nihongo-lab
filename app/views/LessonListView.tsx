import { useRef } from 'react';
import { usePageState } from '../lib/pageContext';
import {
  curriculumSummary,
  generalListeningRoadmap,
  generalListeningGroupTitle,
  GENERAL_LISTENING_GROUP_SIZE,
} from '../../curriculum/lessons.mjs';
import {
  indexedLessonProgress,
  hasLessonActivity,
  summarizeIds,
} from '../../lib/curriculum-summary.mjs';
import type { LessonIndex } from '../../lib/curriculum-index.mjs';
import type { Progress } from '../../lib/progress.mjs';
import {
  lessonHash,
  stageHash,
  studyHash,
  viewHash,
} from '../../lib/route.mjs';
import { STUDY_CATEGORIES } from '../../lib/study-categories.mjs';
import { toDateString } from '../../lib/srs.mjs';
import { ChevronRightIcon } from '../components/Icons';
import { ProgressBar } from '../components/ProgressBar';
import { RubyText } from '../components/Ruby';

const stages = curriculumSummary.stages;
const TRACKS: Record<string, { title: string; description: string }> = {
  'stage-0': {
    title: 'N5 基礎復健',
    description: '從基本單字與文法開始，逐課找回日文基礎。',
  },
  'stage-1': {
    title: '動漫／遊戲通用聽解',
    description: '用原創男女聲對話練習請求、邀請、能力與條件，抓住行動和意思。',
  },
  'stage-2': {
    title: '口語與動畫日文',
    description: '學作品常見語氣、句型與短台詞，搭配聽解特訓。',
  },
};
const STAGE_ACCENT: Record<string, string> = {
  'stage-0': 's0',
  'stage-1': 's1',
  'stage-2': 's2',
  'stage-3': 's3',
};

/** 課程首頁只呈現學習方向；進入方向後才列出該區課程。 */
export function LessonListView({
  progress,
  stageId,
  recentLessonId,
}: {
  progress: Progress;
  stageId?: string;
  recentLessonId: string | null;
}) {
  const [openGroups, setOpenGroups] = usePageState<number[]>(
    'lesson.groups',
    [0],
  );
  const directions = useRef<HTMLHeadingElement>(null);
  const byLesson = indexedLessonProgress(curriculumSummary, progress);
  const selected = stages.filter((stage) => stage.id === stageId);
  const generalTarget = generalListeningRoadmap.reduce(
    (sum, phase) => sum + phase.target,
    0,
  );
  const generalComplete = selected.some(
    (stage) =>
      stage.id === 'stage-1' &&
      stage.lessons.length === generalTarget &&
      stage.lessons.every((lesson) => lesson.audioReady !== false),
  );

  const lessonList = (lessons: LessonIndex[]) => (
    <ul className="lesson-list">
      {lessons.map((lesson) => {
        const p = byLesson[lesson.id];
        const meta = [
          p.vocab.total > 0 && `單字 ${p.vocab.done}/${p.vocab.total}`,
          p.dictation.total > 0 &&
            `聽寫 ${p.dictation.done}/${p.dictation.total}`,
          p.listening.total > 0 &&
            `理解 ${p.listening.done}/${p.listening.total}`,
          p.grammar.total > 0 && `文法 ${p.grammar.done}/${p.grammar.total}`,
          p.grammar.review > 0 && `文法待重練 ${p.grammar.review}`,
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
  );

  if (!selected.length) {
    const recentStage = stages.find((stage) =>
      stage.lessons.some((lesson) => lesson.id === recentLessonId),
    );
    const recent = recentStage?.lessons.find(
      (lesson) => lesson.id === recentLessonId,
    );
    const completed = recent && byLesson[recent.id].ratio === 1;
    const next =
      completed &&
      recentStage?.lessons
        .slice(recentStage.lessons.indexOf(recent) + 1)
        .find((lesson) => byLesson[lesson.id].ratio < 1);
    const trackComplete =
      completed &&
      recentStage?.lessons.every((lesson) => byLesson[lesson.id].ratio === 1);
    const startedByStage = stages.map(
      (stage) =>
        stage.lessons.filter((lesson) => hasLessonActivity(lesson, progress))
          .length,
    );
    const first =
      recentLessonId === null && !startedByStage.some(Boolean)
        ? stages[0]?.lessons[0]
        : undefined;
    const target = completed ? next : (recent ?? first);
    const today = toDateString();
    const reviews = STUDY_CATEGORIES.map((category) => ({
      ...category,
      due: summarizeIds(
        curriculumSummary.categories[category.id].cardIds,
        progress.srs,
        today,
      ).due,
    }));

    return (
      <>
        <section className="card home-continue" aria-labelledby="home-continue">
          <h2 id="home-continue">接續學習</h2>
          {target ? (
            <>
              <strong className="lesson-title">
                <RubyText text={target.title} />
              </strong>
              <a className="btn primary" href={lessonHash(target.id)}>
                {first ? '開始學習' : completed ? '開始下一課' : '繼續這一課'}
              </a>
            </>
          ) : (
            <>
              <p>
                {trackComplete
                  ? `${recentStage?.title}已完成。`
                  : completed
                    ? '已到這條學習路線的末尾。'
                    : '選一門課，開始這次的學習。'}
              </p>
              {recentStage ? (
                <a className="btn primary" href={stageHash(recentStage.id)}>
                  選擇課程
                </a>
              ) : (
                <button
                  className="btn primary"
                  onClick={() => directions.current?.focus()}
                >
                  選擇課程
                </button>
              )}
            </>
          )}
        </section>
        <section className="card" aria-label="今天的複習">
          <h2 className="home-reviews-heading">今天的複習</h2>
          <ul className="home-reviews">
            {reviews.map((category) => (
              <li key={category.id}>
                <a className="btn" href={studyHash('srs', category.id)}>
                  <span>{category.title}</span>
                  <span className="muted">到期 {category.due} 張</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="home-directions">
          <h2 id="home-directions" ref={directions} tabIndex={-1}>
            選擇學習方向
          </h2>
          <ul className="lesson-list">
            {stages.map((stage, index) => {
              if (!stage.lessons.length) return null;
              const track = TRACKS[stage.id];
              const started = startedByStage[index];
              return (
                <li key={stage.id}>
                  <a className="card lesson-card" href={stageHash(stage.id)}>
                    <span className="lesson-card-body">
                      <span className="lesson-title">
                        {track?.title ?? stage.title}
                      </span>
                      <span className="home-direction-description">
                        {track?.description}
                      </span>
                      <span className="muted">
                        {stage.lessons.length} 課 · 已開始 {started} 課
                      </span>
                    </span>
                    <ChevronRightIcon />
                  </a>
                </li>
              );
            })}
            <li>
              <a className="card lesson-card" href={viewHash('games')}>
                <span className="lesson-card-body">
                  <span className="lesson-title">遊戲角色語音</span>
                  <span className="home-direction-description">
                    依作品與角色選擇台詞，學單字、句型並練聽解。
                  </span>
                  <span className="muted">永恆輪迴 · 原神</span>
                </span>
                <ChevronRightIcon />
              </a>
            </li>
          </ul>
        </section>
        <details className="card">
          <summary>學習方向怎麼選？</summary>
          <p>
            需要打底先選「N5 基礎復健」；已有基本假名與 N5
            概念，可從「動漫／遊戲通用聽解」開始。想學作品口語或特定角色，再進入動畫日文或遊戲角色語音。
          </p>
          <p className="muted">N3 到 N1 課程尚待擴充。</p>
        </details>
      </>
    );
  }

  return (
    <>
      <section className="card" aria-label="課程介紹">
        <p>{TRACKS[stageId!]?.description ?? selected[0].title}</p>
        {stageId === 'stage-1' && (
          <>
            <p>
              目前 {selected[0].lessons.length} 課，建議按順序學習。每天 30～45
              分鐘：先聽整段 → 作答 → 學單字與句型 → 看解析並跟讀。
            </p>
            <details>
              <summary>
                六階段學習路線（{generalComplete ? '已提供' : '規劃'}{' '}
                {generalTarget} 課）
              </summary>
              <p className="muted">
                {generalComplete
                  ? '六階段180課教材與配音已提供；完成練習不代表已掌握陌生作品，可按需要重聽與複習。'
                  : `目前提供 ${selected[0].lessons.length} 課，其餘為擴充方向；音檔狀態以各課標示為準。`}
              </p>
              <ol>
                {generalListeningRoadmap.map((phase) => (
                  <li key={phase.title}>
                    <strong>{phase.title}</strong>：{phase.goal}。目標{' '}
                    {phase.target} 課。
                  </li>
                ))}
              </ol>
            </details>
          </>
        )}
      </section>
      {selected.map((stage) => (
        <section key={stage.id} className="stage">
          <h2 className={`stage-title ${STAGE_ACCENT[stage.id] ?? ''}`}>
            {stage.title}
          </h2>
          {stage.lessons.length === 0 ? (
            <p className="muted stage-empty">即將推出</p>
          ) : stage.id === 'stage-1' &&
            stage.lessons.length >= GENERAL_LISTENING_GROUP_SIZE ? (
            <>
              {Array.from(
                {
                  length: Math.ceil(
                    stage.lessons.length / GENERAL_LISTENING_GROUP_SIZE,
                  ),
                },
                (_, i) => i * GENERAL_LISTENING_GROUP_SIZE,
              ).map((start, i) => (
                <details
                  className="card"
                  key={start}
                  open={openGroups.includes(start)}
                  onToggle={(event) => {
                    const open = event.currentTarget.open;
                    setOpenGroups((previous) =>
                      open
                        ? previous.includes(start)
                          ? previous
                          : [...previous, start]
                        : previous.filter((group) => group !== start),
                    );
                  }}
                >
                  <summary>
                    第 {start + 1}～
                    {Math.min(
                      start + GENERAL_LISTENING_GROUP_SIZE,
                      stage.lessons.length,
                    )}{' '}
                    課：{generalListeningGroupTitle(i)}
                  </summary>
                  {lessonList(
                    stage.lessons.slice(
                      start,
                      start + GENERAL_LISTENING_GROUP_SIZE,
                    ),
                  )}
                </details>
              ))}
            </>
          ) : (
            lessonList(stage.lessons)
          )}
        </section>
      ))}
    </>
  );
}
