import { useRef, useState } from 'react';
import type { Lesson, Line } from '../../curriculum/lessons.mjs';
import type { GrammarQuestion } from '../../curriculum/anime-grammar-study.mjs';
import type { Progress } from '../../lib/progress.mjs';
import {
  grammarRecordId,
  grammarReviewQueue,
  grammarStatus,
  grammarSummary,
  recordGrammarAnswer,
} from '../../lib/grammar-study.mjs';
import { useSwipeNavigation } from '../lib/useSwipeNavigation';
import { RubyText } from './Ruby';

type Unit = { pointIndex: number; questionIndex?: number };
const BOOKMARK_KEY = 'nihongo-lab:grammar-location:v1';

function readBookmark(lesson: Lesson, units: Unit[]): number | null {
  try {
    const data = JSON.parse(localStorage.getItem(BOOKMARK_KEY) ?? '{}')[
      lesson.id
    ];
    const index = units.findIndex(
      (u) =>
        lesson.grammar[u.pointIndex].study?.id === data?.point &&
        (u.questionIndex === undefined
          ? 'learn'
          : lesson.grammar[u.pointIndex].study?.questions[u.questionIndex]
              .id) === data?.step,
    );
    return index >= 0 ? index : null;
  } catch {
    return null;
  }
}
function saveBookmark(lesson: Lesson, unit: Unit) {
  try {
    const raw = JSON.parse(localStorage.getItem(BOOKMARK_KEY) ?? '{}');
    const saved =
      raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    const study = lesson.grammar[unit.pointIndex].study!;
    saved[lesson.id] = {
      point: study.id,
      step:
        unit.questionIndex === undefined
          ? 'learn'
          : study.questions[unit.questionIndex].id,
    };
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(saved));
  } catch {
    /* 閱讀位置只是本機便利設定；答題進度由 useProgress 保存。 */
  }
}

function SilentExample({
  line,
  referenceUrl,
}: {
  line: Line;
  referenceUrl?: string;
}) {
  const [reading, setReading] = useState(false);
  const [translation, setTranslation] = useState(false);
  return (
    <div className="grammar-example">
      <div className="line-jp" lang="ja">
        {line.jp}
      </div>
      <div className="row" data-no-swipe>
        <button
          type="button"
          className="btn"
          aria-expanded={reading}
          onClick={() => setReading(!reading)}
        >
          {reading ? '隱藏讀音' : '顯示讀音'}
        </button>
        <button
          type="button"
          className="btn"
          aria-expanded={translation}
          onClick={() => setTranslation(!translation)}
        >
          {translation ? '隱藏翻譯' : '顯示翻譯'}
        </button>
      </div>
      {reading && (
        <p className="line-reading" lang="ja">
          {line.reading}
        </p>
      )}
      {translation && (
        <p className="line-zh">
          <RubyText text={line.zh} />
        </p>
      )}
      {line.source && (
        <p className="muted">
          出處：
          <RubyText text={line.source} />
          {referenceUrl && (
            <>
              {' '}
              ·{' '}
              <a href={referenceUrl} target="_blank" rel="noreferrer">
                台詞查證來源
              </a>
            </>
          )}
        </p>
      )}
    </div>
  );
}

function QuestionView({
  question,
  onAnswer,
}: {
  question: GrammarQuestion;
  onAnswer: (choice: number) => void;
}) {
  const [choice, setChoice] = useState<number | null>(null);
  const submitted = useRef(false);
  const answer = (i: number) => {
    if (submitted.current) return;
    submitted.current = true;
    setChoice(i);
    onAnswer(i);
  };
  return (
    <div className="grammar-question">
      <h3>
        <RubyText text={question.prompt} />
      </h3>
      <div className="anime-options">
        {question.options.map((option, i) => (
          <button
            type="button"
            className={`btn block${choice === i ? ' primary' : ''}`}
            key={option}
            disabled={choice !== null}
            onClick={() => answer(i)}
          >
            <RubyText text={option} />
          </button>
        ))}
      </div>
      {choice !== null && (
        <div className={choice === question.answer ? 'answer' : 'notice'}>
          <output>
            <strong>
              {choice === question.answer ? '答對了' : '這題需要重練'}
            </strong>
          </output>
          <p>
            正確答案：
            <RubyText text={question.options[question.answer]} />
          </p>
          <p>
            <RubyText text={question.explanation} />
          </p>
          <button
            type="button"
            className="btn"
            onClick={() => {
              submitted.current = false;
              setChoice(null);
            }}
          >
            再答一次
          </button>
        </div>
      )}
    </div>
  );
}

export function AnimeGrammarStudy({
  lesson,
  progress,
  update,
  onListening,
}: {
  lesson: Lesson;
  progress: Progress;
  update: (change: (prev: Progress) => Progress) => void;
  onListening: () => void;
}) {
  const units: Unit[] = lesson.grammar.flatMap((p, pointIndex) => [
    { pointIndex },
    ...(p.study?.questions ?? []).map((_, questionIndex) => ({
      pointIndex,
      questionIndex,
    })),
  ]);
  const [position, setPosition] = useState<number | null>(null);
  const [bookmark, setBookmark] = useState(() => readBookmark(lesson, units));
  const [review, setReview] = useState<number[] | null>(null);
  const summary = grammarSummary(lesson, progress);
  const activeIndex =
    position === null ? null : review ? review[position] : position;
  const unit = activeIndex === null ? null : units[activeIndex];
  const count = review ? review.length : units.length;
  const open = (index: number, reviewing: number[] | null = review) => {
    const actual = reviewing ? reviewing[index] : index;
    setReview(reviewing);
    setPosition(index);
    if (actual !== undefined) {
      saveBookmark(lesson, units[actual]);
      setBookmark(actual);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  const overview = () => {
    setPosition(null);
    setReview(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  const previous = () => {
    if (position !== null && position > 0) open(position - 1);
  };
  const next = () => {
    if (position === null) return;
    if (position < count - 1) open(position + 1);
    else overview();
  };
  const swipe = useSwipeNavigation(previous, next);
  const startReview = () => {
    const queue = grammarReviewQueue(lesson, progress).map((q) =>
      units.findIndex(
        (u) =>
          u.pointIndex === q.pointIndex && u.questionIndex === q.questionIndex,
      ),
    );
    if (queue.length) open(0, queue);
  };
  const nextUnfinished = units.findIndex(
    (u) =>
      u.questionIndex !== undefined &&
      !grammarStatus(
        progress,
        grammarRecordId(
          lesson.id,
          lesson.grammar[u.pointIndex],
          lesson.grammar[u.pointIndex].study!.questions[u.questionIndex],
        ),
      ).passed,
  );
  const start =
    bookmark ??
    (nextUnfinished >= 0
      ? units.findIndex(
          (u) => u.pointIndex === units[nextUnfinished].pointIndex,
        )
      : 0);

  if (!unit)
    return (
      <section className="card grammar-overview">
        <h2>動畫文法學習</h2>
        <p>不用播放音檔：看解說與用例，再做每個重點的兩題小測驗。</p>
        <p className="muted">
          已練 {summary.attempted}/{summary.total} 題 · 已答對 {summary.done}/
          {summary.total} 題 · 待重練 {summary.review} 題
        </p>
        <div className="row">
          <button
            type="button"
            className="btn primary"
            onClick={() => open(start, null)}
          >
            {bookmark === null ? '開始學習' : '繼續上次位置'}
          </button>
          <button
            type="button"
            className="btn"
            disabled={!summary.review}
            onClick={startReview}
          >
            重練錯題（{summary.review}）
          </button>
        </div>
        <ol className="list grammar-point-list">
          {lesson.grammar.map((point, pointIndex) => {
            const statuses = point.study!.questions.map((q) =>
              grammarStatus(progress, grammarRecordId(lesson.id, point, q)),
            );
            return (
              <li key={point.study!.id}>
                <h3>
                  <RubyText text={point.pattern} />
                </h3>
                <p className="muted">
                  已練 {statuses.filter((s) => s.attempted).length}/2 · 已答對{' '}
                  {statuses.filter((s) => s.passed).length}/2 · 待重練{' '}
                  {statuses.filter((s) => s.review).length}
                </p>
                <button
                  type="button"
                  className="btn"
                  onClick={() =>
                    open(
                      units.findIndex((u) => u.pointIndex === pointIndex),
                      null,
                    )
                  }
                >
                  學習重點 {pointIndex + 1}
                </button>
              </li>
            );
          })}
        </ol>
        <button type="button" className="btn" onClick={onListening}>
          練這一課的聽力
        </button>
      </section>
    );

  const point = lesson.grammar[unit.pointIndex];
  const study = point.study!;
  const question =
    unit.questionIndex === undefined
      ? null
      : study.questions[unit.questionIndex];
  return (
    <div className="grammar-study" {...swipe}>
      <section className="card">
        <p className="muted">
          {review
            ? `錯題重練 ${position! + 1}/${count}`
            : `重點 ${unit.pointIndex + 1}/${lesson.grammar.length}`}{' '}
          · {question ? `小測驗 ${unit.questionIndex! + 1}/2` : '解說與用例'}
        </p>
        <h2>
          <RubyText text={point.pattern} />
        </h2>
        {question ? (
          <QuestionView
            key={`${review ? 'review' : 'study'}:${activeIndex}`}
            question={question}
            onAnswer={(choice) => {
              const id = grammarRecordId(lesson.id, point, question);
              update((prev) =>
                recordGrammarAnswer(
                  prev,
                  id,
                  choice === question.answer,
                  new Date().toISOString(),
                ),
              );
            }}
          />
        ) : (
          <div className="grammar-lesson" key={study.id}>
            <h3>怎麼接</h3>
            <p>
              <RubyText text={study.formation} />
            </p>
            <h3>意思與容易混淆的地方</h3>
            <p>
              <RubyText text={point.note} />
            </p>
            <h3>用例</h3>
            {point.quoteExamples?.map(({ quote, referenceUrl }) => (
              <SilentExample
                key={quote.audio}
                line={quote}
                referenceUrl={referenceUrl}
              />
            ))}
            {point.examples.map((ex) => (
              <SilentExample
                key={ex.audio}
                line={ex}
                referenceUrl={ex.referenceUrl}
              />
            ))}
            <details>
              <summary>句型教學來源</summary>
              {point.referenceUrl && (
                <p>
                  <a href={point.referenceUrl} target="_blank" rel="noreferrer">
                    句型教學參考
                  </a>
                </p>
              )}
              {point.referenceUrls?.map((url, i) => (
                <p key={url}>
                  <a href={url} target="_blank" rel="noreferrer">
                    補充參考 {i + 1}
                  </a>
                </p>
              ))}
            </details>
          </div>
        )}
      </section>
      <p className="muted swipe-hint">左滑下一頁 · 右滑上一頁</p>
      <div className="grammar-controls" data-no-swipe>
        <button
          type="button"
          className="btn"
          disabled={position === 0}
          onClick={previous}
        >
          上一頁
        </button>
        <button type="button" className="btn" onClick={overview}>
          重點清單
        </button>
        <button type="button" className="btn primary" onClick={next}>
          {position === count - 1 ? '完成本輪' : '下一頁'}
        </button>
      </div>
    </div>
  );
}
