import { useRef, useState } from 'react';
import type {
  AnimeTraining as Training,
  ListeningClip,
} from '../../lib/anime-training.mjs';
import {
  checkListeningChoice,
  listeningRecordId,
} from '../../lib/anime-training.mjs';
import { recordDictation, type Progress } from '../../lib/progress.mjs';
import { AudioLine, PlayButton } from './AudioLine';
import { RubyText } from './Ruby';

function ListeningClipView({
  clip,
  lessonId,
  update,
  review,
}: {
  clip: ListeningClip;
  lessonId: string;
  update: (change: (prev: Progress) => Progress) => void;
  review: boolean;
}) {
  const [plays, setPlays] = useState(0);
  const [familiar, setFamiliar] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const submitted = useRef(new Set<string>());
  const [reading, setReading] = useState(false);
  const [result, setResult] = useState<{
    correct: boolean;
    plays: number;
    familiar: boolean;
  } | null>(null);
  const question = clip.questions.find((q) => answers[q.id] === undefined);
  const revealed = !question;

  const choose = (choice: number) => {
    if (!question || plays === 0 || submitted.current.has(question.id)) return;
    submitted.current.add(question.id);
    const correct = checkListeningChoice(question, choice);
    // 只有未揭示原文的作答記成聽力通過；看解說後的分析不冒充盲聽。
    update((prev) =>
      recordDictation(
        prev,
        listeningRecordId(lessonId, clip, question),
        correct,
        new Date().toISOString(),
      ),
    );
    setResult({ correct, plays, familiar });
    setAnswers((prev) => ({ ...prev, [question.id]: choice }));
  };

  return (
    <article className="grammar-point anime-clip">
      <p className="muted">
        {review ? '對照練習' : '先聽再看'} · 播放 {plays} 次
      </p>
      <PlayButton
        audio={clip.quote.audio}
        label="播放台詞"
        onPlayed={() => setPlays((n) => n + 1)}
        caption
      />
      {!revealed && (
        <>
          <label className="anime-familiar">
            <input
              type="checkbox"
              checked={familiar}
              onChange={(e) => setFamiliar(e.target.checked)}
            />
            我熟悉這句台詞
          </label>
          <p>
            <RubyText text={question.prompt} />
          </p>
          {plays === 0 && <p className="muted">先播放台詞，再選答案。</p>}
          <div className="anime-options">
            {question.options.map((option, i) => (
              <button
                key={option}
                type="button"
                className="btn block"
                disabled={plays === 0}
                onClick={() => choose(i)}
              >
                <RubyText text={option} />
              </button>
            ))}
          </div>
        </>
      )}
      {result && (
        <output className={result.correct ? 'answer' : 'notice'}>
          {result.correct ? '答對了' : '這次沒有答對'} · 作答前播放{' '}
          {result.plays} 次{result.familiar ? ' · 熟悉台詞' : ''}。
          {result.familiar && '這次結果可能包含對作品的記憶。'}
        </output>
      )}
      {revealed && (
        <>
          <AudioLine {...clip.quote} />
          <p className="muted">
            出處：
            <RubyText text={clip.quote.source} /> ·{' '}
            <a href={clip.referenceUrl} target="_blank" rel="noreferrer">
              台詞查證來源
            </a>
          </p>
          {clip.questions.map((q) => (
            <p key={q.id}>
              <strong>
                <RubyText text={q.options[q.answer]} />
              </strong>{' '}
              — <RubyText text={q.explanation} />
            </p>
          ))}
          <button
            type="button"
            className="btn"
            onClick={() => setReading(!reading)}
          >
            {reading ? '收起跟讀提示' : '跟讀這句'}
          </button>
          {reading && (
            <p className="notice">
              再播放一次，停下後跟著念；注意句子切分與句尾。可到「跟讀」頁選擇原有的名句課，循環練習這句台詞。
            </p>
          )}
        </>
      )}
    </article>
  );
}

export function AnimeTraining({
  training,
  lessonId,
  update,
}: {
  training: Training;
  lessonId: string;
  update: (change: (prev: Progress) => Progress) => void;
}) {
  return (
    <section className="card">
      <h2>動畫聽力特訓</h2>
      <p>
        <RubyText text={training.goal} />
      </p>
      <p className="muted">
        先聽 → 選意思 → 看原文與口語解說 → 跟讀 →
        對照練習。音檔是自製語音，不是作品原配音。
      </p>
      {training.clips.map((clip) => (
        <ListeningClipView
          key={clip.quote.audio}
          clip={clip}
          lessonId={lessonId}
          update={update}
          review={false}
        />
      ))}
      <h3>對照練習</h3>
      <p>
        換一段有出處的台詞，練習抓大意。即使看過作品也可以練；不以「沒看過」作為驗收條件。
      </p>
      {training.review.map((clip) => (
        <ListeningClipView
          key={clip.quote.audio}
          clip={clip}
          lessonId={lessonId}
          update={update}
          review
        />
      ))}
      <p className="muted">
        重播次數與熟悉程度只顯示於本次練習。通過紀錄會儲存及同步；代表曾答對，不代表已能聽懂原配音。
      </p>
    </section>
  );
}
