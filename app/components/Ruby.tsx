import { Fragment, useMemo } from 'react';
import { rubyParts, type RubyPart } from '../../lib/furigana.mjs';
import { usePrefs } from '../prefs';

/** 偏好開啟、而且這句對得起來時才回傳讀音標記；否則回傳 null，畫面退回純文字加讀音行。 */
export function useRuby({
  jp,
  reading,
  ruby,
}: {
  jp: string;
  reading: string;
  ruby?: string;
}): RubyPart[] | null {
  const { furigana } = usePrefs();
  return useMemo(
    () => (furigana ? rubyParts({ jp, reading, ruby }) : null),
    [furigana, jp, reading, ruby],
  );
}

export function Ruby({ parts }: { parts: RubyPart[] }) {
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part.ruby ? (
            <ruby>
              {part.text}
              <rp>(</rp>
              <rt>{part.ruby}</rt>
              <rp>)</rp>
            </ruby>
          ) : (
            part.text
          )}
        </Fragment>
      ))}
    </>
  );
}

/**
 * 一句日文：有讀音標記就把讀音標在漢字上方（動畫字幕的樣子），沒有就顯示原文再另起一行顯示讀音。
 */
export function JpLine({
  jp,
  reading,
  ruby,
  jpClass,
}: {
  jp: string;
  reading: string;
  ruby?: string;
  jpClass: string;
}) {
  const parts = useRuby({ jp, reading, ruby });
  return (
    <>
      <div className={jpClass} lang="ja">
        {parts ? <Ruby parts={parts} /> : jp}
      </div>
      {!parts && (
        <div className="line-reading" lang="ja">
          {reading}
        </div>
      )}
    </>
  );
}
