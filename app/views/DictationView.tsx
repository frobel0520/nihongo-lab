import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { stages } from '../../curriculum/lessons.mjs';
import {
  buildSentences,
  compareDictation,
  type DictationResult,
  type Mark,
  type Sentence,
} from '../../lib/dictation.mjs';
import { pickChoices } from '../../lib/dictation-choice.mjs';
import { isTextEntry } from '../../lib/keys.mjs';
import type { DictationMode } from '../../lib/prefs.mjs';
import { recordDictation, type Progress } from '../../lib/progress.mjs';
import { PlayButton } from '../components/AudioLine';
import { CheckIcon, CloseIcon, NextIcon, PrevIcon } from '../components/Icons';
import { ProgressBar } from '../components/ProgressBar';
import { Ruby, RubyText, useRuby } from '../components/Ruby';

const SENTENCES = buildSentences(stages);

function Marks({ marks }: { marks: Mark[] }) {
  return (
    <span lang="ja">
      {marks.map((m, i) => (
        <span
          key={i}
          className={m.compared && !m.matched ? 'mark-bad' : undefined}
        >
          {m.ch}
        </span>
      ))}
    </span>
  );
}

/** 答案揭曉後的標準答案：讀音標在漢字上方，關掉偏好時維持「原文（讀音）」。 */
function Answer({ sentence }: { sentence: Sentence }) {
  const parts = useRuby(sentence);
  return parts ? (
    <p className="line-jp" lang="ja">
      <Ruby parts={parts} />
    </p>
  ) : (
    <p className="line-reading" lang="ja">
      {sentence.jp}（{sentence.reading}）
    </p>
  );
}

/** 選擇題的一個選項：日文句子（偏好開啟時讀音標在漢字上方）。 */
function ChoiceText({ sentence }: { sentence: Sentence }) {
  const parts = useRuby(sentence);
  return (
    <span className="choice-text" lang="ja">
      <span className="choice-jp">
        {parts ? <Ruby parts={parts} /> : sentence.jp}
      </span>
      {!parts && sentence.reading !== sentence.jp && (
        <span className="choice-reading">{sentence.reading}</span>
      )}
    </span>
  );
}

const MODE_LABEL: Record<DictationMode, string> = {
  choice: '選擇題',
  type: '輸入',
};

export function DictationView({
  progress,
  update,
  mode,
  setMode,
}: {
  progress: Progress;
  update: (change: (prev: Progress) => Progress) => void;
  mode: DictationMode;
  setMode: (mode: DictationMode) => void;
}) {
  // 進入畫面時從第一句還沒通過的開始；全部通過就從頭。
  const [start] = useState(() => {
    const first = SENTENCES.findIndex((s) => !progress.dictation[s.id]?.passed);
    return first === -1 ? 0 : first;
  });
  const [index, setIndex] = useState(start);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<DictationResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  // 選擇題的選項在「換題」時抽好、存起來：作答前後與重新渲染時都要保持不變，下一題才重抽。
  const [options, setOptions] = useState<Sentence[]>(() =>
    SENTENCES[start] ? pickChoices(SENTENCES[start], SENTENCES) : [],
  );
  const [picked, setPicked] = useState<string | null>(null);
  const feedbackRef = useRef<HTMLOutputElement>(null);

  const sentence: Sentence | undefined = SENTENCES[index];

  const go = (next: number) => {
    const nextIndex = (next + SENTENCES.length) % SENTENCES.length;
    setIndex(nextIndex);
    setOptions(pickChoices(SENTENCES[nextIndex], SENTENCES));
    setInput('');
    setResult(null);
    setShowHint(false);
    setPicked(null);
  };

  const pick = (option: Sentence) => {
    if (!sentence || picked !== null) return;
    setPicked(option.id);
    update((prev) =>
      recordDictation(
        prev,
        sentence.id,
        option.id === sentence.id,
        new Date().toISOString(),
      ),
    );
  };

  // 作答後把回饋與「下一句」帶進畫面（選項很多、螢幕很矮時它在選項下面）。
  useEffect(() => {
    if (picked !== null) {
      feedbackRef.current?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [picked]);

  // 選擇題的鍵盤：數字鍵 1～4 選答案，作答後 Enter 或右方向鍵到下一句。
  useEffect(() => {
    if (mode !== 'choice' || !sentence) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target instanceof HTMLElement ? e.target : null;
      if (
        target &&
        isTextEntry({
          tagName: target.tagName,
          isContentEditable: target.isContentEditable,
          role: target.getAttribute('role'),
        })
      ) {
        return;
      }
      if (picked === null) {
        const option = options[Number(e.key) - 1];
        if (option) pick(option);
      } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        go(index + 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!sentence) {
    return (
      <section className="card empty">
        <p>教材還沒有可聽寫的句子。</p>
      </section>
    );
  }

  const passedCount = SENTENCES.filter(
    (s) => progress.dictation[s.id]?.passed,
  ).length;
  const record = progress.dictation[sentence.id];
  const answered = picked !== null;
  const correct = picked === sentence.id;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;
    const outcome = compareDictation(input, [sentence.jp, sentence.reading]);
    setResult(outcome);
    update((prev) =>
      recordDictation(
        prev,
        sentence.id,
        outcome.correct,
        new Date().toISOString(),
      ),
    );
  };

  // 日文輸入法選字時按 Enter 不該送出答案。
  const guardComposition = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && (e.nativeEvent.isComposing || e.keyCode === 229)) {
      e.preventDefault();
    }
  };

  return (
    <div className="dictation-screen">
      <div className="progress-head">
        <ProgressBar
          value={passedCount}
          max={SENTENCES.length}
          label="聽寫已通過的句數"
        />
        <span className="muted">
          已通過 {passedCount} / {SENTENCES.length}
        </span>
      </div>

      <div className="stepper">
        <button
          type="button"
          className="icon-btn"
          aria-label="上一句"
          onClick={() => go(index - 1)}
        >
          <PrevIcon />
        </button>
        <span className="stepper-label">
          <strong>
            第 {index + 1} / {SENTENCES.length} 句
          </strong>
          <span className="muted">
            <RubyText text={sentence.lessonTitle} />
            {record
              ? ` · 試過 ${record.attempts} 次${record.passed ? '，已通過' : ''}`
              : ''}
          </span>
        </span>
        <button
          type="button"
          className="icon-btn"
          aria-label="跳過這句"
          onClick={() => go(index + 1)}
        >
          <NextIcon />
        </button>
      </div>

      <fieldset className="segmented">
        <legend className="sr-only">作答方式</legend>
        {(['choice', 'type'] as const).map((m) => (
          <label key={m}>
            <input
              type="radio"
              name="dictation-mode"
              checked={mode === m}
              onChange={() => setMode(m)}
            />
            <span>{MODE_LABEL[m]}</span>
          </label>
        ))}
      </fieldset>

      <div className="listen">
        <PlayButton audio={sentence.audio} label="播放這句" caption />
        {!showHint && !result && !answered && (
          <button
            type="button"
            className="btn ghost"
            onClick={() => setShowHint(true)}
          >
            看中文提示
          </button>
        )}
        {showHint && !result && !answered && (
          <p className="line-zh">
            <RubyText text={sentence.zh} />
          </p>
        )}
      </div>

      {mode === 'choice' && (
        <>
          <fieldset className="choices">
            <legend className="sr-only">選出聽到的句子</legend>
            {options.map((option, i) => {
              const state = !answered
                ? undefined
                : option.id === sentence.id
                  ? 'correct'
                  : option.id === picked
                    ? 'wrong'
                    : 'dim';
              return (
                <button
                  key={option.id}
                  type="button"
                  className="choice"
                  data-state={state}
                  disabled={answered}
                  onClick={() => pick(option)}
                >
                  <span className="choice-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <ChoiceText sentence={option} />
                  {state === 'correct' && <CheckIcon />}
                  {state === 'wrong' && <CloseIcon />}
                </button>
              );
            })}
          </fieldset>

          {answered ? (
            <output
              ref={feedbackRef}
              className={`feedback ${correct ? 'ok' : 'bad'}`}
            >
              <p className="feedback-title">
                {correct ? <CheckIcon /> : <CloseIcon />}
                {correct ? '答對了！' : '不對，綠色的是正確答案'}
              </p>
              <p className="line-zh">
                <RubyText text={sentence.zh} />
              </p>
              <button
                type="button"
                className="btn primary big block"
                onClick={() => go(index + 1)}
              >
                下一句
              </button>
            </output>
          ) : (
            <p className="muted choice-hint">
              聽完選一個（鍵盤按 1～4）；聽不出來可以再播放。
            </p>
          )}
        </>
      )}

      {mode === 'type' && (
        <>
          <form
            className="dictation-form"
            id="dictation-form"
            onSubmit={submit}
          >
            <label htmlFor="dictation-input">
              聽到什麼就打什麼（漢字或假名都可以）
            </label>
            <input
              id="dictation-input"
              type="text"
              lang="ja"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              value={input}
              readOnly={result?.correct === true}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={guardComposition}
            />
          </form>

          {result ? (
            <output
              className={`actions feedback ${result.correct ? 'ok' : 'bad'}`}
            >
              <p className="feedback-title">
                {result.correct ? <CheckIcon /> : <CloseIcon />}
                {result.correct ? '全對！' : '有地方不一樣，標色的是差異'}
              </p>
              {!result.correct && (
                <>
                  <p className="muted">你打的</p>
                  <p className="dictation-line">
                    <Marks marks={result.actual} />
                  </p>
                  <p className="muted">標準答案</p>
                  <p className="dictation-line">
                    <Marks marks={result.expected} />
                  </p>
                </>
              )}
              <Answer sentence={sentence} />
              <p className="line-zh">
                <RubyText text={sentence.zh} />
              </p>
              <div className="row">
                {!result.correct && (
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setResult(null)}
                  >
                    再試一次
                  </button>
                )}
                <button
                  type="button"
                  className="btn primary grow"
                  onClick={() => go(index + 1)}
                >
                  下一句
                </button>
              </div>
            </output>
          ) : (
            <div className="actions">
              <button
                type="submit"
                form="dictation-form"
                className="btn primary big block"
                disabled={input.trim() === ''}
              >
                檢查
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
