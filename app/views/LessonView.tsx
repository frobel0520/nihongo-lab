import { useState } from 'react';
import type { Lesson } from '../../curriculum/lessons.mjs';
import { AudioLine } from '../components/AudioLine';
import { RubyText } from '../components/Ruby';
import { AnimeTraining } from '../components/AnimeTraining';
import type { Progress } from '../../lib/progress.mjs';

type SectionId =
  | 'training'
  | 'vocab'
  | 'grammar'
  | 'dialogue'
  | 'quotes'
  | 'practice';

function PracticeItemView({ q, a }: { q: string; a: string }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <li className="practice-item">
      <p>
        <RubyText text={q} />
      </p>
      {revealed ? (
        <p className="answer">
          <RubyText text={a} />
        </p>
      ) : (
        <button type="button" className="btn" onClick={() => setRevealed(true)}>
          看答案
        </button>
      )}
    </li>
  );
}

/**
 * 單一課程。一次只顯示一個區塊（單字／文法／對話／名句／練習），區塊列貼在畫面上緣：
 * 一天的內容很多時，手機不用滑過整課，點區塊列就跳過去。課程本身的切換與返回在 App 的上方列與網址 hash。
 */
export function LessonView({
  lesson,
  update,
}: {
  lesson: Lesson;
  update: (change: (prev: Progress) => Progress) => void;
}) {
  const [sectionId, setSectionId] = useState<SectionId | null>(null);
  const pending = lesson.audioReady === false;

  const sections: { id: SectionId; label: string; count: number }[] = [
    {
      id: 'training' as const,
      label: '特訓',
      count: lesson.training
        ? lesson.training.clips.length + lesson.training.review.length
        : 0,
    },
    { id: 'vocab' as const, label: '單字', count: lesson.vocab.length },
    { id: 'grammar' as const, label: '文法', count: lesson.grammar.length },
    { id: 'dialogue' as const, label: '對話', count: lesson.dialogue.length },
    { id: 'quotes' as const, label: '名句', count: lesson.quotes?.length ?? 0 },
    { id: 'practice' as const, label: '練習', count: lesson.practice.length },
  ].filter((section) => section.count > 0);
  const active = sections.find((s) => s.id === sectionId) ?? sections[0];

  // 換區塊後回到內容開頭，不留在上一個區塊滑到一半的位置。
  const goSection = (id: SectionId) => {
    setSectionId(id);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <>
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

      {active?.id === 'training' && lesson.training && (
        <AnimeTraining
          training={lesson.training}
          lessonId={lesson.id}
          update={update}
        />
      )}

      {active?.id === 'vocab' && (
        <section className="card">
          <ul className="list">
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
        <section className="card">
          {lesson.grammar.map((g) => (
            <div key={g.pattern} className="grammar-point">
              <h4 lang="ja">
                <RubyText text={g.pattern} />
              </h4>
              <p>
                <RubyText text={g.note} />
              </p>
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
        <section className="card">
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
        <section className="card">
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
              <p className="muted">
                出處：
                <RubyText text={q.source} />
                {q.referenceUrl && (
                  <>
                    {' '}
                    ·{' '}
                    <a href={q.referenceUrl} target="_blank" rel="noreferrer">
                      台詞查證來源
                    </a>
                  </>
                )}
              </p>
              {q.referenceNote && (
                <p className="muted">
                  <RubyText text={q.referenceNote} />
                </p>
              )}
              <p>
                <RubyText text={q.note} />
              </p>
            </div>
          ))}
        </section>
      )}

      {active?.id === 'practice' && (
        <section className="card">
          <ul className="list">
            {lesson.practice.map((p) => (
              <PracticeItemView key={p.q} q={p.q} a={p.a} />
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
