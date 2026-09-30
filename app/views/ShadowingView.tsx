import { useEffect, useRef, useState } from 'react';
import { stages } from '../../curriculum/lessons.mjs';
import { buildSentences } from '../../lib/dictation.mjs';
import { DEFAULT_ROUNDS, ROUND_OPTIONS, gapMs } from '../../lib/shadowing.mjs';
import { audioUrl } from '../components/AudioLine';
import { JpLine } from '../components/Ruby';

const SENTENCES = buildSentences(stages);

type Phase = 'idle' | 'playing' | 'gap';

export function ShadowingView() {
  const [index, setIndex] = useState(0);
  const [rounds, setRounds] = useState(DEFAULT_ROUNDS);
  const [showText, setShowText] = useState(true);
  const [phase, setPhase] = useState<Phase>('idle');
  const [round, setRound] = useState(0);
  const [failed, setFailed] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // 事件處理器要讀最新狀態，用 ref 避免閉包抓到舊值。
  const runRef = useRef({ running: false, round: 0, rounds });
  runRef.current.rounds = rounds;

  const sentence = SENTENCES[index];

  const clearTimer = () => {
    clearTimeout(timerRef.current);
    timerRef.current = undefined;
  };

  const stop = () => {
    clearTimer();
    audioRef.current?.pause();
    runRef.current.running = false;
    setPhase('idle');
    setRound(0);
  };

  const playClip = () => {
    const el = audioRef.current;
    if (!el) return;
    setFailed(false);
    el.currentTime = 0;
    setPhase('playing');
    el.play().catch((error: unknown) => {
      // 使用者按停止時 play() 會被中斷（AbortError），不算錯誤。
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setFailed(true);
      stop();
    });
  };

  const start = () => {
    stop();
    runRef.current.running = true;
    runRef.current.round = 1;
    setRound(1);
    playClip();
  };

  const onEnded = () => {
    const run = runRef.current;
    if (!run.running) {
      setPhase('idle');
      return;
    }
    if (run.round >= run.rounds) {
      stop();
      return;
    }
    setPhase('gap');
    timerRef.current = setTimeout(
      () => {
        run.round += 1;
        setRound(run.round);
        playClip();
      },
      gapMs(audioRef.current?.duration ?? 0),
    );
  };

  const go = (next: number) => {
    stop();
    setFailed(false);
    setIndex((next + SENTENCES.length) % SENTENCES.length);
  };

  // 離開畫面時停掉計時器與播放，不留背景輪播。
  useEffect(
    () => () => {
      clearTimeout(timerRef.current);
    },
    [],
  );

  if (!sentence) {
    return (
      <section>
        <h3>跟讀</h3>
        <p>教材還沒有可跟讀的句子。</p>
      </section>
    );
  }

  const running = phase !== 'idle';

  return (
    <section>
      <h3>跟讀</h3>
      <p className="muted">
        第 {index + 1} / {SENTENCES.length} 句 · {sentence.lessonTitle}
      </p>

      <div className="shadow-text" lang="ja">
        {showText ? (
          <>
            <JpLine
              jp={sentence.jp}
              reading={sentence.reading}
              ruby={sentence.ruby}
              jpClass="flash-word"
            />
            <div className="line-zh">{sentence.zh}</div>
          </>
        ) : (
          <div className="muted">原文已隱藏，先靠耳朵聽。</div>
        )}
      </div>

      <audio
        ref={audioRef}
        src={audioUrl(sentence.audio)}
        preload="auto"
        onEnded={onEnded}
        onError={() => {
          setFailed(true);
          stop();
        }}
      />

      <div className="dictation-play">
        {running ? (
          <button type="button" className="btn primary" onClick={stop}>
            ■ 停止
          </button>
        ) : (
          <>
            <button type="button" className="btn primary" onClick={start}>
              ▶ 開始跟讀（{rounds} 輪）
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                runRef.current.running = false;
                playClip();
              }}
            >
              只聽一次
            </button>
          </>
        )}
      </div>

      <output className="muted status-line">
        {phase === 'playing' && `第 ${round} / ${rounds} 輪：聽`}
        {phase === 'gap' && `第 ${round} / ${rounds} 輪：換你念`}
      </output>
      {failed && (
        <p className="error" role="alert">
          音檔無法播放（找不到檔案，或離線且尚未快取）。
        </p>
      )}

      <div className="dictation-play">
        <label className="inline-field">
          輪數
          <select
            value={rounds}
            disabled={running}
            onChange={(e) => setRounds(Number(e.target.value))}
          >
            {ROUND_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="btn"
          onClick={() => setShowText((v) => !v)}
        >
          {showText ? '隱藏原文' : '顯示原文'}
        </button>
      </div>

      <div className="dictation-play">
        <button type="button" className="btn" onClick={() => go(index - 1)}>
          上一句
        </button>
        <button type="button" className="btn" onClick={() => go(index + 1)}>
          下一句
        </button>
      </div>
    </section>
  );
}
