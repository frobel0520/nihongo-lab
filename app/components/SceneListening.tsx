import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { Lesson } from '../../curriculum/lessons.mjs';
import type { Progress } from '../../lib/progress.mjs';
import { recordDictation } from '../../lib/progress.mjs';
import {
  sceneRecordId,
  sceneSpeakerLabels,
} from '../../lib/scene-listening.mjs';
import { getVoice } from '../../curriculum/voices.mjs';
import { checkListeningChoice } from '../../lib/anime-training.mjs';
import { playFromStart } from '../../lib/playback.mjs';
import { AudioLine, audioUrl } from './AudioLine';
import { RubyText } from './Ruby';
import { OfflineAudio } from './OfflineAudio';
import { loadStageAudioPaths } from '../../curriculum/lessons.mjs';
import { lessonAudioPaths } from '../../lib/offline.mjs';

const CourseOfflineAudio = lazy(async () => {
  const paths = await loadStageAudioPaths('stage-1');
  return {
    default: ({ lessonPaths }: { lessonPaths: string[] }) => (
      <OfflineAudio
        lessonPaths={lessonPaths}
        allPaths={paths}
        allLabel="通用聽解全部課程"
      />
    ),
  };
});

export function SceneListening({
  lesson,
  update,
}: {
  lesson: Lesson;
  update: (change: (prev: Progress) => Progress) => void;
}) {
  const audio = useRef<HTMLAudioElement>(null);
  const control = useRef({ run: 0, cursor: null as number | null });
  const submitted = useRef(new Set<string>());
  const [lineIndex, setLineIndex] = useState<number | null>(null);
  const [heard, setHeard] = useState(false);
  const [error, setError] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [offlineOpened, setOfflineOpened] = useState(false);
  const scene = lesson.scene!;
  const lessonPaths = useMemo(() => lessonAudioPaths(lesson), [lesson]);
  const speakers = useMemo(
    () => sceneSpeakerLabels(lesson.dialogue, getVoice),
    [lesson],
  );
  const lineCount = lesson.dialogue.length;
  const questionCount = scene.questions.length;
  const question = scene.questions.find((q) => answers[q.id] === undefined);
  const revealed = !question;

  useEffect(() => {
    const el = audio.current;
    const state = control.current;
    return () => {
      state.run++;
      state.cursor = null;
      el?.pause();
    };
  }, []);

  const stop = () => {
    control.current.run++;
    control.current.cursor = null;
    audio.current?.pause();
    setLineIndex(null);
  };
  const playLine = async (i: number, ticket: number) => {
    const el = audio.current;
    if (!el || ticket !== control.current.run) return;
    control.current.cursor = i;
    setLineIndex(i);
    el.src = audioUrl(lesson.dialogue[i].audio);
    el.load();
    el.playbackRate = 1;
    const result = await playFromStart(el, {
      others: document.querySelectorAll('audio'),
      isCurrent: () =>
        ticket === control.current.run && control.current.cursor === i,
    });
    if (ticket !== control.current.run) return;
    if (result !== 'started') {
      stop();
      if (result === 'failed') setError(true);
    }
  };
  const start = () => {
    setError(false);
    control.current.run++;
    void playLine(0, control.current.run);
  };
  const ended = () => {
    if (!audio.current?.ended) return;
    const i = control.current.cursor;
    if (i === null) return;
    if (i + 1 < lesson.dialogue.length)
      void playLine(i + 1, control.current.run);
    else {
      control.current.cursor = null;
      setLineIndex(null);
      setHeard(true);
    }
  };
  const choose = (choice: number) => {
    if (!heard || !question || submitted.current.has(question.id)) return;
    submitted.current.add(question.id);
    const correct = checkListeningChoice(question, choice);
    update((prev) =>
      recordDictation(
        prev,
        sceneRecordId(lesson, question),
        correct,
        new Date().toISOString(),
      ),
    );
    setAnswers((prev) => ({ ...prev, [question.id]: choice }));
  };

  return (
    <section className="card scene-listening">
      <h2>整段聽解：先聽，再理解</h2>
      <p>
        <RubyText text={scene.goal} />
      </p>
      <p className="muted">
        原創情境 · {[...new Set(speakers)].join('／')}。先完整聽完 {lineCount}{' '}
        句，再回答 {questionCount} 題；全部作答後揭示原文。
      </p>
      <div className="row">
        <button
          type="button"
          className="btn primary"
          onClick={lineIndex === null ? start : stop}
        >
          {lineIndex === null ? '播放完整對話' : '停止對話'}
        </button>
      </div>
      <audio
        ref={audio}
        preload="none"
        onEnded={ended}
        onError={() => {
          if (audio.current?.error) {
            stop();
            setError(true);
          }
        }}
      />
      <output className="scene-status" aria-live="polite">
        {lineIndex !== null
          ? `正在播放第 ${lineIndex + 1}／${lineCount} 句`
          : heard
            ? '已完整聽過對話，可以作答或重播。'
            : '尚未完整聽完對話。'}
      </output>
      {error && (
        <p role="alert" className="notice">
          音檔無法播放，請連線後重試；離線前需先下載音檔。
        </p>
      )}
      {question && (
        <div className="scene-question">
          <h3>
            理解題 {Object.keys(answers).length + 1}／{questionCount}
          </h3>
          <p>
            <RubyText text={question.prompt} />
          </p>
          <div className="anime-options">
            {question.options.map((option, i) => (
              <button
                type="button"
                className="btn block"
                key={option}
                disabled={!heard}
                onClick={() => choose(i)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
      {Object.keys(answers).length > 0 && (
        <p className="muted">
          已作答 {Object.keys(answers).length} 題。答題完成後一起看解析。
        </p>
      )}
      {revealed && (
        <>
          <h3>答案與解析</h3>
          {scene.questions.map((q) => (
            <div key={q.id} className="grammar-point">
              <p className={answers[q.id] === q.answer ? 'answer' : 'notice'}>
                {answers[q.id] === q.answer ? '答對了' : '這次沒有答對'}：
                <RubyText text={q.prompt} />
              </p>
              <p>正確答案：{q.options[q.answer]}</p>
              <p>
                <RubyText text={q.explanation} />
              </p>
            </div>
          ))}
          <h3>原文、翻譯與逐句跟讀</h3>
          <ul className="list">
            {lesson.dialogue.map((line, i) => (
              <li key={line.audio}>
                <p className="muted">{speakers[i]}</p>
                <AudioLine {...line} />
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="btn"
            onClick={() => {
              stop();
              setHeard(false);
              setAnswers({});
              submitted.current.clear();
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
          >
            重新練習整段聽解
          </button>
        </>
      )}
      <p className="muted">
        答對紀錄會儲存與同步，代表曾答對這份練習。已讀過課文或解析的重練，也不代表已能聽懂陌生作品。音檔為自製語音。
      </p>
      <details
        onToggle={(e) => {
          if (e.currentTarget.open) setOfflineOpened(true);
        }}
      >
        <summary>下載本課音檔供離線使用</summary>
        {offlineOpened && (
          <Suspense fallback={<output>正在準備離線下載…</output>}>
            <CourseOfflineAudio lessonPaths={lessonPaths} />
          </Suspense>
        )}
      </details>
    </section>
  );
}
