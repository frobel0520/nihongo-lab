import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { tokenReading, tokenRuby } from '../../lib/song-tokens.mjs';
import type { Token } from '../../lib/songs.mjs';
import { usePrefs } from '../prefs';
import { Ruby } from './Ruby';

export type WordRef = { line: number; token: number };

/**
 * 分析過的一行：每個詞是一個可以點的按鈕（點了開詞卡），讀音開關打開時漢字上方標讀音。
 */
export function SongLineText({
  tokens,
  lineIndex,
  selected,
  onSelect,
}: {
  tokens: Token[];
  lineIndex: number;
  selected: WordRef | null;
  onSelect: (word: WordRef) => void;
}) {
  const { furigana } = usePrefs();
  return (
    <div className="song-text" lang="ja">
      {tokens.map((token, i) => {
        const isSelected = selected?.line === lineIndex && selected.token === i;
        return (
          <button
            key={i}
            type="button"
            className={`tok${isSelected ? ' selected' : ''}${token.o ? ' edited' : ''}`}
            onClick={() => onSelect({ line: lineIndex, token: i })}
          >
            {furigana ? <Ruby parts={tokenRuby(token)} /> : token.s}
          </button>
        );
      })}
    </div>
  );
}

/**
 * 點詞後從底部升起的詞卡：顯示這個詞與讀音，讀音可以改（只改這首歌的這個位置）。
 * children 放查詞與文法的內容（T51）。
 */
export function WordSheet({
  token,
  onSaveReading,
  onClose,
  children,
}: {
  token: Token;
  onSaveReading: (reading: string) => void;
  onClose: () => void;
  children?: ReactNode;
}) {
  const [editing, setEditing] = useState(false);
  const [reading, setReading] = useState(tokenReading(token) ?? '');
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditing(false);
    setReading(tokenReading(token) ?? '');
  }, [token]);
  useEffect(() => {
    if (editing) field.current?.focus();
  }, [editing]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSaveReading(reading);
    setEditing(false);
  };

  const current = tokenReading(token);
  return (
    <section className="word-sheet" aria-label="詞卡">
      <div className="word-head">
        <p className="word-surface" lang="ja">
          {current ? <Ruby parts={tokenRuby(token)} /> : token.s}
        </p>
        <button type="button" className="link-btn" onClick={onClose}>
          關閉
        </button>
      </div>
      <p className="muted">
        讀音：
        <span lang="ja">{current ?? '（沒有漢字，不用標）'}</span>
        {token.o && <>（你改過；原本是 <span lang="ja">{token.r ?? '無'}</span>）</>}
      </p>
      {children}
      {editing ? (
        <form className="word-reading-form" onSubmit={onSubmit}>
          <input
            ref={field}
            value={reading}
            onChange={(e) => setReading(e.target.value)}
            lang="ja"
            aria-label="這個詞的讀音（平假名或片假名）"
            autoComplete="off"
          />
          <div className="row">
            <button type="submit" className="btn primary">
              存讀音
            </button>
            <button type="button" className="btn" onClick={() => setEditing(false)}>
              取消
            </button>
          </div>
          <p className="muted">清空或改回原本的讀音就會還原。只改這首歌的這個位置。</p>
        </form>
      ) : (
        <button type="button" className="link-btn" onClick={() => setEditing(true)}>
          讀音不對？改這個詞的讀音
        </button>
      )}
    </section>
  );
}
