import { useState } from 'react';
import { stages } from '../../curriculum/lessons.mjs';
import { AudioLine } from '../components/AudioLine';

const STAGE_ACCENT: Record<string, string> = {
  'stage-0': 's0',
  'stage-1': 's1',
  'stage-2': 's2',
  'stage-3': 's3',
};

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
  const stage0 = stages.find((s) => s.id === 'stage-0');
  const lesson = stage0?.lessons[0];

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
        <article>
          <h2>{lesson.title}</h2>

          <section>
            <h3>單字</h3>
            <ul className="vocab-list">
              {lesson.vocab.map((v) => (
                <li key={v.word}>
                  <AudioLine
                    jp={v.word}
                    reading={v.reading}
                    zh={v.zh}
                    audio={v.audio}
                  />
                </li>
              ))}
            </ul>
          </section>

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
                    zh={ex.zh}
                    audio={ex.audio}
                  />
                ))}
              </div>
            ))}
          </section>

          <section>
            <h3>對話</h3>
            {lesson.dialogue.map((line) => (
              <AudioLine
                key={line.audio}
                jp={line.jp}
                reading={line.reading}
                zh={line.zh}
                audio={line.audio}
              />
            ))}
          </section>

          <section>
            <h3>練習</h3>
            <ul className="vocab-list">
              {lesson.practice.map((p) => (
                <PracticeItemView key={p.q} q={p.q} a={p.a} />
              ))}
            </ul>
          </section>
        </article>
      )}
    </>
  );
}
