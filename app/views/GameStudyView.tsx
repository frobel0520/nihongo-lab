import { useRef, useState } from 'react';
import { gameCharacterStudy } from '../../curriculum/lessons.mjs';
import {
  erSelectionCoverage,
  erSelectionTotals,
} from '../../curriculum/er-selection-transcripts.mjs';
import type {
  GameLine,
  GameCharacter,
} from '../../curriculum/game-character-study.mjs';
import type { Progress } from '../../lib/progress.mjs';
import { recordDictation } from '../../lib/progress.mjs';
import {
  gameRecordId,
  gameDone,
  gameLines,
  gameListeningQuestion,
  gameListeningRecordId,
  gameListeningDone,
} from '../../lib/game-study.mjs';
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
const ALL_AUDIO = [
  ...new Set(
    gameCharacterStudy.flatMap((g) =>
      g.characters.flatMap((c) =>
        c.lines.filter((line) => line.audioReady !== false).map((l) => l.audio),
      ),
    ),
  ),
];

function StudyLine({
  line,
  character,
  listening,
  done,
  onDone,
  plays,
  onAnswer,
  onRestart,
}: {
  line: GameLine;
  character: GameCharacter;
  listening: boolean;
  done: boolean;
  onDone: () => void;
  plays: number;
  onAnswer: (correct: boolean) => void;
  onRestart: () => void;
}) {
  const [revealed, setRevealed] = useState(!listening);
  const [choice, setChoice] = useState<number | null>(null);
  const [peeked, setPeeked] = useState(false);
  const submitted = useRef(false);
  const [baseline, setBaseline] = useState(plays);
  const heard = Math.max(0, plays - baseline);
  const isSelectionLine = line.category === '角色選擇';
  const canListen = line.audioReady !== false;
  const question = isSelectionLine ? null : gameListeningQuestion(line);
  const choose = (answer: number) => {
    if (!question || !heard || peeked || submitted.current) return;
    submitted.current = true;
    setChoice(answer);
    setRevealed(true);
    onAnswer(answer === question.answer);
  };
  return (
    <section className="card game-line">
      <p className="muted">
        {character.name} · {line.category} ·{' '}
        {line.kind === 'quote'
          ? '作品短句'
          : line.kind === 'reference'
            ? '查證資料教材（非角色台詞）'
            : '自編主題練習（非遊戲台詞）'}
        {line.variant ? ` · ${line.variant}` : ''}
      </p>
      {!canListen && (
        <output className="notice">
          這句的 VOICEVOX 音檔還沒產製，可先直接看逐字稿；此頁不播放遊戲原音。
        </output>
      )}
      {!revealed && (
        <>
          <p>
            {isSelectionLine
              ? '先盲聽 → 顯示逐字稿、讀音、翻譯與解說'
              : '先聽 → 判斷大意 → 看原文與解說 → 跟讀'}
          </p>
          <p className="muted">
            播放 {heard} 次
            {canListen && !heard
              ? isSelectionLine
                ? ' · 先播放，再顯示台詞。'
                : ' · 先播放，再選答案。'
              : ''}
          </p>
          {question ? (
            <>
              <h3>{question.prompt}</h3>
              <div className="anime-options">
                {question.options.map((option, i) => (
                  <button
                    type="button"
                    className="btn block"
                    key={option}
                    disabled={!heard}
                    onClick={() => choose(i)}
                  >
                    <RubyText text={option} />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <button
              type="button"
              className="btn"
              disabled={canListen && !heard}
              onClick={() => setRevealed(true)}
            >
              顯示逐字稿與解說
            </button>
          )}
          <button
            type="button"
            className="btn"
            onClick={() => {
              setPeeked(true);
              setRevealed(true);
            }}
          >
            先看原文（不記聽力成績）
          </button>
        </>
      )}
      {choice !== null && question && (
        <output className={choice === question.answer ? 'answer' : 'notice'}>
          {choice === question.answer ? '答對了' : '這次沒有答對'} · 正確大意：
          <RubyText text={question.options[question.answer]} />
        </output>
      )}
      {peeked && <p className="muted">已先看原文，這次不記盲聽成績。</p>}
      {listening && revealed && canListen && (
        <button
          type="button"
          className="btn"
          onClick={() => {
            submitted.current = false;
            setBaseline(plays);
            setChoice(null);
            setPeeked(false);
            setRevealed(false);
            onRestart();
          }}
        >
          重新聽這句
        </button>
      )}
      {revealed && (
        <>
          <JpLine
            jpClass="line-jp"
            jp={line.jp}
            reading={line.reading}
            ruby={line.ruby}
          />
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
          {line.kind === 'quote'
            ? '台詞查證來源'
            : line.kind === 'reference'
              ? '角色／武器資料來源'
              : '角色名稱來源'}
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
  const [category, setCategory] = useState(gameId === 'er' ? '角色選擇' : '');
  const [index, setIndex] = useState(0);
  const [listening, setListening] = useState(true);
  const [plays, setPlays] = useState<Record<string, number>>({});
  const [attempt, setAttempt] = useState(0);
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
          const selectionLines = lines.filter(
            (line) => line.category === '角色選擇',
          );
          return (
            <section className="card" key={g.id}>
              <h2>{g.title}</h2>
              <p>{g.scope}</p>
              {g.id === 'er' && (
                <p className="muted">
                  selected／selected2 來源索引 {erSelectionTotals.clips}{' '}
                  段：有台詞 {erSelectionTotals.withText} 段、笑聲／喘氣{' '}
                  {erSelectionTotals.nonverbal} 段。非語詞僅列索引，播放器使用
                  VOICEVOX
                  重製台詞，沒有遊戲原配音。多數字面由語音辨識取得，未經人耳確認。
                </p>
              )}
              <p className="muted">
                {g.characters.length} 筆角色名冊 ·{' '}
                {g.id === 'er'
                  ? `選角台詞 ${selectionLines.length} 句`
                  : `作品短句 ${lines.length} 句`}{' '}
                · 已學 {gameDone(lines, progress)}/{lines.length}
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
        {character.voiceReferenceUrl && (
          <p>
            <a
              href={character.voiceReferenceUrl}
              target="_blank"
              rel="noreferrer"
            >
              日文語音文字來源
            </a>
          </p>
        )}
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
  const listeningLines = lines.filter((line) => line.category !== '角色選擇');
  const categories = [...new Set(lines.map((l) => l.category))];
  const audio = lines
    .filter((line) => line.audioReady !== false)
    .map((l) => l.audio);
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
          已學 {gameDone(lines, progress)}/{lines.length}
          {listeningLines.length > 0 && (
            <>
              {' '}
              · 理解 {gameListeningDone(lines, progress)}/
              {listeningLines.length}
            </>
          )}{' '}
          · {at + 1}/{items.length} 句
        </p>
        {game.id === 'er' && erSelectionCoverage[character.id] && (
          <p className="muted">
            選角原音 {erSelectionCoverage[character.id].clips} 段：有台詞{' '}
            {erSelectionCoverage[character.id].withText} 段、笑聲／喘氣{' '}
            {erSelectionCoverage[character.id].nonverbal} 段
          </p>
        )}
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
            聽力特訓
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
          plays={plays[current.line.id] ?? 0}
          onRestart={() => setAttempt((n) => n + 1)}
          onAnswer={(correct) =>
            update((prev) =>
              recordDictation(
                prev,
                gameListeningRecordId(current.line),
                correct,
                new Date().toISOString(),
              ),
            )
          }
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
        {listening && current && current.line.audioReady !== false ? (
          <PlayButton
            key={`${current.line.audio}:${attempt}`}
            audio={current.line.audio}
            label="播放這句"
            onPlayed={() =>
              setPlays((prev) => ({
                ...prev,
                [current.line.id]: (prev[current.line.id] ?? 0) + 1,
              }))
            }
            caption={false}
          />
        ) : listening && current ? (
          <span className="muted">VOICEVOX 待合成</span>
        ) : null}
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
