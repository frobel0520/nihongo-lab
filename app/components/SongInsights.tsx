import { useEffect, useState } from 'react';
import { stages } from '../../curriculum/lessons.mjs';
import { lessonHash } from '../../lib/route.mjs';
import { detectGrammar, grammarLessonIndex } from '../../lib/song-grammar.mjs';
import {
  buildVocabIndex,
  lookupVocab,
  posLabel,
  type JmdictHit,
} from '../../lib/song-lookup.mjs';
import type { Token } from '../../lib/songs.mjs';
import { lookupEnglish } from '../lib/songAnalyzer';
import { RubyText } from './Ruby';

const VOCAB_INDEX = buildVocabIndex(stages);
const GRAMMAR_LESSONS = grammarLessonIndex(stages);

/**
 * 一行底下的文法標籤（偵測到的常見句型）。點標籤展開一行說明，教材有教的附「到第 N 天看」連結。
 */
export function GrammarChips({ tokens }: { tokens: Token[] }) {
  const hits = detectGrammar(tokens);
  const [open, setOpen] = useState<string | null>(null);
  if (hits.length === 0) return null;
  const openHit = hits.find((hit) => hit.id === open);
  const lesson = openHit ? GRAMMAR_LESSONS.get(openHit.id) : undefined;
  return (
    <div className="grammar-chips">
      <div className="chip-row">
        {hits.map((hit) => (
          <button
            key={hit.id}
            type="button"
            className="chip"
            aria-expanded={open === hit.id}
            onClick={() => setOpen(open === hit.id ? null : hit.id)}
          >
            <span lang="ja">{hit.label}</span>
          </button>
        ))}
      </div>
      {openHit && (
        <p className="chip-note">
          <span lang="ja">{tokens.slice(openHit.start, openHit.end).map((t) => t.s).join('')}</span>
          ：{openHit.note}
          {lesson ? (
            <>
              {' '}
              <a href={lessonHash(lesson.lessonId)}>
                到「<RubyText text={lesson.title} />」看
              </a>
            </>
          ) : (
            '（教材還沒有這一課）'
          )}
        </p>
      )}
    </div>
  );
}

type English =
  | { kind: 'loading' }
  | { kind: 'done'; hits: JmdictHit[] }
  | { kind: 'error'; message: string };

/** 詞卡內容：原形、詞性、教材單字（中文）、JMdict 英文釋義。 */
export function WordDetails({ token }: { token: Token }) {
  const vocab = lookupVocab(VOCAB_INDEX, token);
  const [english, setEnglish] = useState<English>({ kind: 'loading' });
  const isWord = token.p !== '記号';

  useEffect(() => {
    if (!isWord) return;
    let cancelled = false;
    setEnglish({ kind: 'loading' });
    lookupEnglish(token)
      .then((hits) => {
        if (!cancelled) setEnglish({ kind: 'done', hits });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setEnglish({
            kind: 'error',
            message: error instanceof Error ? error.message : String(error),
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token, isWord]);

  return (
    <div className="word-details">
      <p className="muted">
        {posLabel(token)}
        {token.b && (
          <>
            ・原形 <span lang="ja">{token.b}</span>
          </>
        )}
      </p>

      {vocab.length > 0 && (
        <ul className="word-hits">
          {vocab.map((hit) => (
            <li key={`${hit.lessonId}:${hit.word}`}>
              <span lang="ja">{hit.word}</span>
              {hit.reading !== hit.word && (
                <span className="muted" lang="ja">
                  （{hit.reading}）
                </span>
              )}
              ：{hit.zh}{' '}
              <a href={lessonHash(hit.lessonId)}>
                <RubyText text={hit.lessonTitle} />
              </a>
            </li>
          ))}
        </ul>
      )}

      {isWord && english.kind === 'loading' && <p className="muted">查英文釋義中…</p>}
      {isWord && english.kind === 'done' && english.hits.length > 0 && (
        <ul className="word-hits" lang="en">
          {english.hits.slice(0, 3).map((hit, i) => (
            <li key={i}>
              <span lang="ja">{hit.kana}</span>：{hit.gloss}
            </li>
          ))}
        </ul>
      )}
      {isWord && english.kind === 'done' && english.hits.length === 0 && vocab.length === 0 && (
        <p className="muted">教材與英文字典（常用詞）都查不到這個詞。</p>
      )}
      {isWord && english.kind === 'error' && (
        <p className="muted">英文字典沒有載入（{english.message}）。</p>
      )}
      <p className="attribution">
        英文釋義：
        <a href="https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project" rel="noreferrer" target="_blank">
          JMdict
        </a>
        （EDRDG，CC BY-SA 4.0）
      </p>
    </div>
  );
}
