import { useState } from 'react';
import { gameCharacterStudy } from '../../curriculum/lessons.mjs';
import type {
  GameLine,
  GameCharacter,
} from '../../curriculum/game-character-study.mjs';
import type { Progress } from '../../lib/progress.mjs';
import { recordDictation } from '../../lib/progress.mjs';
import { gameRecordId, gameDone, gameLines } from '../../lib/game-study.mjs';
import { gameHash } from '../../lib/route.mjs';
import { getVoice } from '../../curriculum/voices.mjs';
import { useSwipeNavigation } from '../lib/useSwipeNavigation';
import { JpLine, RubyText } from '../components/Ruby';
import { PlayButton } from '../components/AudioLine';
import { OfflineAudio } from '../components/OfflineAudio';

type Props = {
  gameId?: string;
  characterId?: string;
  progress: Progress;
  update: (change: (prev: Progress) => Progress) => void;
};
const ALL_AUDIO = gameCharacterStudy.flatMap((g) =>
  g.characters.flatMap((c) => c.lines.map((l) => l.audio)),
);

function StudyLine({
  line,
  character,
  listening,
  done,
  onDone,
}: {
  line: GameLine;
  character: GameCharacter;
  listening: boolean;
  done: boolean;
  onDone: () => void;
}) {
  const [revealed, setRevealed] = useState(!listening);
  const [reading, setReading] = useState(false);
  return (
    <section className="card game-line">
      <p className="muted">
        {character.name} · {line.category} ·{' '}
        {line.kind === 'quote' ? '作品短句' : '自編主題練習（非遊戲台詞）'}
      </p>
      {!revealed && (
        <>
          <p>先播放，試著抓出關鍵詞與意思。</p>
          <button
            type="button"
            className="btn"
            onClick={() => setRevealed(true)}
          >
            顯示原文與解說
          </button>
        </>
      )}
      {revealed && (
        <>
          <h3 className="line-jp" lang="ja">
            {line.jp}
          </h3>
          <button
            type="button"
            className="btn"
            aria-expanded={reading}
            onClick={() => setReading(!reading)}
          >
            {reading ? '收起讀音' : '顯示讀音'}
          </button>
          {reading && (
            <JpLine
              jpClass="line-jp"
              jp={line.jp}
              reading={line.reading}
              ruby={line.ruby}
            />
          )}
          <p className="line-zh">
            <RubyText text={line.zh} />
          </p>
          <h3>句型與語氣</h3>
          <p>
            <RubyText text={line.note} />
          </p>
          <button
            type="button"
            className="btn"
            disabled={done}
            onClick={onDone}
          >
            {done ? '已標記學過' : '標記已學'}
          </button>
        </>
      )}
      <p className="muted">
        <a href={line.referenceUrl} target="_blank" rel="noreferrer">
          {line.kind === 'quote' ? '台詞查證來源' : '角色名稱來源'}
        </a>{' '}
        · {line.referenceNote}
      </p>
      <p className="muted">
        自製語音：{getVoice(line.voice).credit ?? 'VOICEVOX'}{' '}
        {getVoice(line.voice).name} · 非遊戲原配音
      </p>
    </section>
  );
}

export function GameStudyView({
  gameId,
  characterId,
  progress,
  update,
}: Props) {
  const game = gameCharacterStudy.find((g) => g.id === gameId);
  const [category, setCategory] = useState('');
  const [index, setIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const character = game?.characters.find((c) => c.id === characterId);
  const items = game
    ? gameLines(gameCharacterStudy, game.id, character?.id, category)
    : [];
  const at = Math.min(index, Math.max(0, items.length - 1));
  const current = items[at];
  const prev = () => {
    if (at > 0) {
      setIndex(at - 1);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };
  const next = () => {
    if (at + 1 < items.length) {
      setIndex(at + 1);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };
  const swipe = useSwipeNavigation(prev, next);
  if (!game)
    return (
      <>
        <section className="card">
          <h2>遊戲角色語音</h2>
          <p>
            從角色短句學日文。角色選擇、編隊加入與技能分開分類；所有音檔均為
            VOICEVOX 自製。
          </p>
          <p className="muted">
            首批用例供驗收，劇情尚未加入。作品短句與自編練習會分別標示。
          </p>
        </section>
        {gameCharacterStudy.map((g) => {
          const lines = g.characters.flatMap((c) => c.lines);
          return (
            <section className="card" key={g.id}>
              <h2>{g.title}</h2>
              <p>{g.scope}</p>
              <p className="muted">
                已收錄 {g.characters.length} 位角色 · 作品短句{' '}
                {lines.filter((l) => l.kind === 'quote').length} 句 · 主題練習{' '}
                {lines.filter((l) => l.kind === 'practice').length} 句 · 已學{' '}
                {gameDone(lines, progress)}/{lines.length}
              </p>
              <a className="btn primary" href={gameHash(g.id)}>
                進入{g.title}
              </a>
            </section>
          );
        })}
        <OfflineAudio
          lessonPaths={[]}
          allPaths={ALL_AUDIO}
          allLabel="全部遊戲"
        />
      </>
    );
  if (!character)
    return (
      <>
        <section className="card">
          <a href={gameHash()}>所有遊戲</a>
          <h2>{game.title}</h2>
          <p>{game.scope}</p>
          <p className="muted">
            點角色頭像進入學習 · {game.characters.length} 位角色
          </p>
        </section>
        <div className="character-grid" aria-label={`${game.title}角色頭像`}>
          {game.characters.map((c) => (
            <a
              className="character-tile"
              key={c.id}
              href={gameHash(game.id, c.id)}
              aria-label={`學習${c.name}`}
            >
              <span className="character-portrait">
                <img
                  src={`${import.meta.env.BASE_URL}${c.portrait}`}
                  alt={`${c.name}頭像`}
                  width="160"
                  height="160"
                  loading="lazy"
                />
              </span>
              <strong>{c.name}</strong>
              <small lang="ja">
                <RubyText text={c.nameJa} />
              </small>
              <small className="muted">
                {c.lines.length
                  ? `${c.lines.length} 句 · 已學 ${gameDone(c.lines, progress)}/${c.lines.length}`
                  : '語音待補'}
              </small>
            </a>
          ))}
        </div>
        <details className="card">
          <summary>頭像來源</summary>
          <p className="muted">
            頭像為遊戲角色圖像；僅作學習選單識別。作品權利屬於各遊戲權利人。
          </p>
          {game.characters.map((c) => (
            <a
              key={c.id}
              className="portrait-source"
              href={c.portraitReferenceUrl}
              target="_blank"
              rel="noreferrer"
            >
              {c.name}頭像來源
            </a>
          ))}
        </details>
      </>
    );
  if (!character.lines.length)
    return (
      <section className="card empty-character">
        <a href={gameHash(game.id)}>返回{game.title}角色清單</a>
        <img
          className="empty-character-portrait"
          src={`${import.meta.env.BASE_URL}${character.portrait}`}
          alt={`${character.name}頭像`}
          width="160"
          height="160"
        />
        <h2>
          {character.name}{' '}
          <small lang="ja">
            <RubyText text={character.nameJa} />
          </small>
        </h2>
        <p>此角色語音尚未收錄。</p>
        <p className="muted">
          角色與頭像已加入選單；核對日文台詞並製作音檔後，會在這裡提供學習內容。
        </p>
        <p>
          <a href={character.referenceUrl} target="_blank" rel="noreferrer">
            角色資料來源
          </a>{' '}
          ·{' '}
          <a
            href={character.portraitReferenceUrl}
            target="_blank"
            rel="noreferrer"
          >
            頭像來源
          </a>
        </p>
      </section>
    );
  const lines = character.lines;
  const categories = [...new Set(lines.map((l) => l.category))];
  const audio = lines.map((l) => l.audio);
  return (
    <div className="game-study" {...swipe}>
      <section className="card">
        <a href={gameHash(game.id)}>返回{game.title}角色清單</a>
        <h2>
          {character.name}{' '}
          <small lang="ja">
            <RubyText text={character.nameJa} />
          </small>
        </h2>
        <p className="muted">
          已學 {gameDone(lines, progress)}/{lines.length} · {at + 1}/
          {items.length} 句
        </p>
        <div className="row" data-no-swipe>
          <button
            type="button"
            className={`btn${!listening ? ' primary' : ''}`}
            aria-pressed={!listening}
            onClick={() => setListening(false)}
          >
            無聲閱讀
          </button>
          <button
            type="button"
            className={`btn${listening ? ' primary' : ''}`}
            aria-pressed={listening}
            onClick={() => setListening(true)}
          >
            聽力與跟讀
          </button>
        </div>
        <label data-no-swipe>
          語音情境
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setIndex(0);
            }}
          >
            <option value="">全部情境</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </section>
      {current && (
        <StudyLine
          key={`${current.line.id}:${listening}`}
          line={current.line}
          character={character}
          listening={listening}
          done={!!progress.dictation[gameRecordId(current.line)]?.passed}
          onDone={() =>
            update((prevProgress) =>
              recordDictation(
                prevProgress,
                gameRecordId(current.line),
                true,
                new Date().toISOString(),
              ),
            )
          }
        />
      )}
      <details className="card">
        <summary>下載此角色音檔供離線使用</summary>
        <OfflineAudio
          lessonPaths={audio}
          allPaths={ALL_AUDIO}
          lessonLabel="此角色"
          allLabel="全部遊戲"
        />
      </details>
      <p className="muted swipe-hint">左滑下一句 · 右滑上一句</p>
      <div className="game-controls" data-no-swipe>
        <button
          type="button"
          className="btn"
          disabled={at === 0}
          onClick={prev}
        >
          上一句
        </button>
        {listening && current && (
          <PlayButton
            key={current.line.audio}
            audio={current.line.audio}
            label="播放這句"
            caption={false}
          />
        )}
        <button
          type="button"
          className="btn"
          disabled={at + 1 >= items.length}
          onClick={next}
        >
          下一句
        </button>
      </div>
    </div>
  );
}
