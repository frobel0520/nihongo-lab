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
import { lessonHash, stageHash, srsHash, viewHash } from '../../lib/route.mjs';
import { toDateString } from '../../lib/srs.mjs';
import { ChevronRightIcon } from '../components/Icons';
import { ProgressBar } from '../components/ProgressBar';
import { RubyText } from '../components/Ruby';

const stages = curriculumSummary.stages;
const CARD_IDS = Object.values(curriculumSummary.categories).flatMap(
  (c) => c.cardIds,
);
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
}: {
  progress: Progress;
  stageId?: string;
}) {
  const [openGroups, setOpenGroups] = usePageState<number[]>(
    'lesson.groups',
    [0],
  );
  const stats = summarizeIds(CARD_IDS, progress.srs, toDateString());
  const byLesson = indexedLessonProgress(curriculumSummary, progress);
  const selected = stages.filter((stage) => stage.id === stageId);
  const generalTarget = generalListeningRoadmap.reduce((sum, phase) => sum + phase.target, 0);
  const generalComplete = selected.some((stage) => stage.id === 'stage-1' &&
    stage.lessons.length === generalTarget &&
    stage.lessons.every((lesson) => lesson.audioReady !== false));

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

  if (!selected.length)
    return (
      <>
        <section className="card" aria-label="今天的複習">
          <h2>今天的複習</h2>
          <p className="muted">
            到期 {stats.due} 張 · 新卡 {stats.fresh} 張
          </p>
          <div className="row">
            {stats.due > 0 && (
              <a className="btn primary" href={srsHash('review')}>
                複習單字
              </a>
            )}
            {stats.fresh > 0 && (
              <a className="btn" href={srsHash('new')}>
                學新單字
              </a>
            )}
            {stats.due + stats.fresh === 0 && (
              <a className="btn" href={viewHash('dictation')}>
                練聽寫
              </a>
            )}
          </div>
        </section>
        <section aria-label="選擇學習方向">
          <h2>選擇學習方向</h2>
          <ul className="lesson-list">
            {stages
              .filter((stage) => stage.lessons.length > 0)
              .map((stage) => {
                const track = TRACKS[stage.id];
                const started = stage.lessons.filter((lesson) =>
                  hasLessonActivity(lesson, progress),
                ).length;
                return (
                  <li key={stage.id}>
                    <a className="card lesson-card" href={stageHash(stage.id)}>
                      <span className="lesson-card-body">
                        <span className="lesson-title">
                          {track?.title ?? stage.title}
                        </span>
                        <span>{track?.description}</span>
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
                  <span>依作品與角色選擇台詞，學單字、句型並練聽解。</span>
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
              <summary>六階段學習路線（{generalComplete ? '已提供' : '規劃'} {generalTarget} 課）</summary>
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
