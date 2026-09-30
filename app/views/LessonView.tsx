import { useMemo, useState } from 'react';
import { stages } from '../../curriculum/lessons.mjs';
import { allAudioPaths, lessonAudioPaths } from '../../lib/offline.mjs';
import { AudioLine } from '../components/AudioLine';
import { OfflineAudio } from '../components/OfflineAudio';

const STAGE_ACCENT: Record<string, string> = {
  'stage-0': 's0',
  'stage-1': 's1',
  'stage-2': 's2',
  'stage-3': 's3',
};

const LESSONS = stages.flatMap((stage) =>
  stage.lessons.map((lesson) => ({ lesson, stageTitle: stage.title })),
);

const ALL_AUDIO_PATHS = allAudioPaths(stages);

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
  const current = LESSONS.find((l) => l.lesson.id === lessonId) ?? LESSONS[0];
  const lesson = current?.lesson;
  const pending = lesson?.audioReady === false;
  // 音檔還沒合成的課程沒有可下載的檔案。
  const lessonPaths = useMemo(
    () => (lesson && !pending ? lessonAudioPaths(lesson) : []),
    [lesson, pending],
  );

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
          <label className="inline-field">
            課程
            <select
              value={lesson.id}
              onChange={(e) => setLessonId(e.target.value)}
            >
              {LESSONS.map(({ lesson: l, stageTitle }) => (
                <option key={l.id} value={l.id}>
                  {stageTitle.split('：')[0]}｜{l.title}
                </option>
              ))}
            </select>
          </label>

          <h2>{lesson.title}</h2>
          {pending && (
            <p className="notice">
              這一課的文字內容已完成，音檔還沒合成（需要在有 VOICEVOX
              的機器上產生），所以暫時沒有播放器，聽寫與跟讀也不會出現這課的句子。
            </p>
          )}

          {ALL_AUDIO_PATHS.length > 0 && (
            <OfflineAudio
              key={lesson.id}
              lessonPaths={lessonPaths}
              allPaths={ALL_AUDIO_PATHS}
            />
          )}

          {lesson.vocab.length > 0 && (
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

          {lesson.grammar.length > 0 && (
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

          {lesson.dialogue.length > 0 && (
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

          {lesson.quotes && lesson.quotes.length > 0 && (
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

          {lesson.practice.length > 0 && (
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
