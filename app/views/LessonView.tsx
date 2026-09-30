import { useRef, useState } from 'react';
import { stages } from '../../curriculum/lessons.mjs';
import { AudioLine } from '../components/AudioLine';

const STAGE_ACCENT: Record<string, string> = {
  'stage-0': 's0',
  'stage-1': 's1',
  'stage-2': 's2',
  'stage-3': 's3',
};

const LESSONS = stages.flatMap((stage) =>
  stage.lessons.map((lesson) => ({ lesson, stageTitle: stage.title })),
);

type SectionId = 'vocab' | 'grammar' | 'dialogue' | 'quotes' | 'practice';

function PracticeItemView({ q, a }: { q: string; a: string }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <li className="practice-item">
      <p>{q}</p>
      {revealed ? (
        <p className="answer">{a}</p>
      ) : (
        <button type="button" onClick={() => setRevealed(true)}>
          看答案
        </button>
      )}
    </li>
  );
}

export function LessonView() {
  const [lessonId, setLessonId] = useState(LESSONS[0]?.lesson.id);
  const [sectionId, setSectionId] = useState<SectionId | null>(null);
  const articleRef = useRef<HTMLElement>(null);
  const index = Math.max(
    0,
    LESSONS.findIndex((l) => l.lesson.id === lessonId),
  );
  const lesson = LESSONS[index]?.lesson;
  const pending = lesson?.audioReady === false;

  // 一次只顯示一個區塊：一天的內容很多時，手機不用滑過整課，用上方的區塊列跳過去。
  const sections: { id: SectionId; label: string; count: number }[] = lesson
    ? [
        { id: 'vocab' as const, label: '單字', count: lesson.vocab.length },
        { id: 'grammar' as const, label: '文法', count: lesson.grammar.length },
        {
          id: 'dialogue' as const,
          label: '對話',
          count: lesson.dialogue.length,
        },
        {
          id: 'quotes' as const,
          label: '名句',
          count: lesson.quotes?.length ?? 0,
        },
        {
          id: 'practice' as const,
          label: '練習',
          count: lesson.practice.length,
        },
      ].filter((section) => section.count > 0)
    : [];
  const active = sections.find((s) => s.id === sectionId) ?? sections[0];

  // 切換後回到這一課的開頭，不留在上一個區塊滑到一半的位置。
  const toTop = () =>
    articleRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
  const goLesson = (nextId: string) => {
    setLessonId(nextId);
    setSectionId(null);
    toTop();
  };
  const goSection = (id: SectionId) => {
    setSectionId(id);
    toTop();
  };

  return (
    <>
      <ul className="stages">
        {stages.map((stage) => (
          <li key={stage.id} className={`stage-card ${STAGE_ACCENT[stage.id]}`}>
            <span className="stage-kind">{stage.id.toUpperCase()}</span>
            <h2>{stage.title}</h2>
            <span className="status">{stage.lessons.length} 課</span>
          </li>
        ))}
      </ul>

      {lesson && (
        <article ref={articleRef}>
          <div className="lesson-picker">
            <button
              type="button"
              className="btn"
              aria-label="上一課"
              disabled={index === 0}
              onClick={() => goLesson(LESSONS[index - 1].lesson.id)}
            >
              ‹
            </button>
            <select
              aria-label="選擇課程"
              value={lesson.id}
              onChange={(e) => goLesson(e.target.value)}
            >
              {stages
                .filter((stage) => stage.lessons.length > 0)
                .map((stage) => (
                  <optgroup key={stage.id} label={stage.title}>
                    {stage.lessons.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.title}
                      </option>
                    ))}
                  </optgroup>
                ))}
            </select>
            <button
              type="button"
              className="btn"
              aria-label="下一課"
              disabled={index === LESSONS.length - 1}
              onClick={() => goLesson(LESSONS[index + 1].lesson.id)}
            >
              ›
            </button>
          </div>

          <h2>{lesson.title}</h2>
          {pending && (
            <p className="notice">
              這一課的文字內容已完成，音檔還沒合成（需要在有 VOICEVOX
              的機器上產生），所以暫時沒有播放器，聽寫與跟讀也不會出現這課的句子。
            </p>
          )}

          <div className="section-tabs" role="tablist" aria-label="課程內容">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                role="tab"
                aria-selected={section.id === active?.id}
                onClick={() => goSection(section.id)}
              >
                {section.label}
                <small>{section.count}</small>
              </button>
            ))}
          </div>

          {active?.id === 'vocab' && (
            <section>
              <h3>單字</h3>
              <ul className="vocab-list">
                {lesson.vocab.map((v) => (
                  <li key={v.word}>
                    <AudioLine
                      jp={v.word}
                      reading={v.reading}
                      ruby={v.ruby}
                      zh={v.zh}
                      audio={v.audio}
                      pending={pending}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {active?.id === 'grammar' && (
            <section>
              <h3>文法</h3>
              {lesson.grammar.map((g) => (
                <div key={g.pattern} className="grammar-point">
                  <h4>{g.pattern}</h4>
                  <p>{g.note}</p>
                  {g.examples.map((ex) => (
                    <AudioLine
                      key={ex.audio}
                      jp={ex.jp}
                      reading={ex.reading}
                      ruby={ex.ruby}
                      zh={ex.zh}
                      audio={ex.audio}
                      pending={pending}
                    />
                  ))}
                </div>
              ))}
            </section>
          )}

          {active?.id === 'dialogue' && (
            <section>
              <h3>對話</h3>
              {lesson.dialogue.map((line) => (
                <AudioLine
                  key={line.audio}
                  jp={line.jp}
                  reading={line.reading}
                  ruby={line.ruby}
                  zh={line.zh}
                  audio={line.audio}
                  pending={pending}
                />
              ))}
            </section>
          )}

          {active?.id === 'quotes' && lesson.quotes && (
            <section>
              <h3>名句</h3>
              {lesson.quotes.map((q) => (
                <div key={q.audio} className="grammar-point">
                  <AudioLine
                    jp={q.jp}
                    reading={q.reading}
                    ruby={q.ruby}
                    zh={q.zh}
                    audio={q.audio}
                    pending={pending}
                  />
                  <p className="muted">出處：{q.source}</p>
                  <p>{q.note}</p>
                </div>
              ))}
            </section>
          )}

          {active?.id === 'practice' && (
            <section>
              <h3>練習</h3>
              <ul className="vocab-list">
                {lesson.practice.map((p) => (
                  <PracticeItemView key={p.q} q={p.q} a={p.a} />
                ))}
              </ul>
            </section>
          )}
        </article>
      )}
    </>
  );
}
