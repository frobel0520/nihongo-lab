import { useState } from 'react';
import { stages } from '../curriculum/lessons.mjs';

function AudioLine({
  jp,
  reading,
  zh,
  audio,
}: {
  jp: string;
  reading: string;
  zh: string;
  audio: string;
}) {
  return (
    <div className="line">
      <div className="line-jp">{jp}</div>
      <div className="line-reading">{reading}</div>
      <div className="line-zh">{zh}</div>
      <audio controls src={audio} preload="none" />
    </div>
  );
}

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

export function App() {
  const stage0 = stages.find((s) => s.id === 'stage-0');
  const lesson = stage0?.lessons[0];

  return (
    <main>
      <h1>日本語 Lab</h1>
      <nav>
        <ul>
          {stages.map((stage) => (
            <li key={stage.id}>
              {stage.title}（{stage.lessons.length} 課）
            </li>
          ))}
        </ul>
      </nav>

      {lesson && (
        <article>
          <h2>{lesson.title}</h2>

          <section>
            <h3>單字</h3>
            <ul className="vocab-list">
              {lesson.vocab.map((v) => (
                <li key={v.word}>
                  <AudioLine jp={v.word} reading={v.reading} zh={v.zh} audio={v.audio} />
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
                  <AudioLine key={ex.audio} jp={ex.jp} reading={ex.reading} zh={ex.zh} audio={ex.audio} />
                ))}
              </div>
            ))}
          </section>

          <section>
            <h3>對話</h3>
            {lesson.dialogue.map((line) => (
              <AudioLine key={line.audio} jp={line.jp} reading={line.reading} zh={line.zh} audio={line.audio} />
            ))}
          </section>

          <section>
            <h3>練習</h3>
            <ul>
              {lesson.practice.map((p) => (
                <PracticeItemView key={p.q} q={p.q} a={p.a} />
              ))}
            </ul>
          </section>
        </article>
      )}
    </main>
  );
}
