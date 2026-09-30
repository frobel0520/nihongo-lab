import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { stages } from '../../curriculum/lessons.mjs';
import {
  buildSentences,
  compareDictation,
  type DictationResult,
  type Mark,
} from '../../lib/dictation.mjs';
import { recordDictation, type Progress } from '../../lib/progress.mjs';
import { PlayButton } from '../components/AudioLine';

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

export function DictationView({
  progress,
  update,
}: {
  progress: Progress;
  update: (change: (prev: Progress) => Progress) => void;
}) {
  // 進入畫面時從第一句還沒通過的開始；全部通過就從頭。
  const [index, setIndex] = useState(() => {
    const first = SENTENCES.findIndex((s) => !progress.dictation[s.id]?.passed);
    return first === -1 ? 0 : first;
  });
  const [input, setInput] = useState('');
  const [result, setResult] = useState<DictationResult | null>(null);
  const [showHint, setShowHint] = useState(false);

  const sentence = SENTENCES[index];
  if (!sentence) {
    return (
      <section>
        <h3>聽寫</h3>
        <p>教材還沒有可聽寫的句子。</p>
      </section>
    );
  }

  const passedCount = SENTENCES.filter(
    (s) => progress.dictation[s.id]?.passed,
  ).length;
  const record = progress.dictation[sentence.id];

  const go = (next: number) => {
    setIndex((next + SENTENCES.length) % SENTENCES.length);
    setInput('');
    setResult(null);
    setShowHint(false);
  };

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
    <section>
      <h3>聽寫</h3>
      <p className="muted">
        第 {index + 1} / {SENTENCES.length} 句 · 已通過 {passedCount} 句
        {record
          ? ` · 這句試過 ${record.attempts} 次${record.passed ? '，已通過' : ''}`
          : ''}
      </p>

      <div className="dictation-source muted">{sentence.lessonTitle}</div>

      <div className="dictation-play">
        <PlayButton audio={sentence.audio} label="播放這句" />
        {!showHint && !result && (
          <button
            type="button"
            className="btn"
            onClick={() => setShowHint(true)}
          >
            看中文提示
          </button>
        )}
      </div>
      {showHint && !result && <p className="line-zh">{sentence.zh}</p>}

      <form className="dictation-form" onSubmit={submit}>
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
        <button
          type="submit"
          className="btn primary"
          disabled={input.trim() === '' || result?.correct === true}
        >
          檢查
        </button>
      </form>

      {result && (
        <output className="dictation-result">
          <p className={result.correct ? 'answer' : 'error'}>
            {result.correct ? '全對！' : '有地方不一樣，標色的是差異：'}
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
          <p className="line-reading" lang="ja">
            {sentence.jp}（{sentence.reading}）
          </p>
          <p className="line-zh">{sentence.zh}</p>
          <div className="dictation-play">
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
              className="btn primary"
              onClick={() => go(index + 1)}
            >
              下一句
            </button>
          </div>
        </output>
      )}

      {!result && (
        <div className="dictation-play">
          <button type="button" className="btn" onClick={() => go(index - 1)}>
            上一句
          </button>
          <button type="button" className="btn" onClick={() => go(index + 1)}>
            跳過
          </button>
        </div>
      )}
    </section>
  );
}
