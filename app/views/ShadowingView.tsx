import { useEffect, useRef, useState } from 'react';
import { stages } from '../../curriculum/lessons.mjs';
import { buildSentences } from '../../lib/dictation.mjs';
import { gapMs } from '../../lib/shadowing.mjs';
import { audioUrl } from '../components/AudioLine';
import { NextIcon, PlayIcon, PrevIcon, StopIcon } from '../components/Icons';
import { JpLine, RubyText } from '../components/Ruby';

const SENTENCES = buildSentences(stages);

type Phase = 'idle' | 'playing' | 'gap';

export function ShadowingView() {
  const [index, setIndex] = useState(0);
  const [showText, setShowText] = useState(true);
  const [phase, setPhase] = useState<Phase>('idle');
  const [round, setRound] = useState(0);
  const [failed, setFailed] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // 事件處理器要讀最新狀態，用 ref 避免閉包抓到舊值。
  const runRef = useRef({ running: false, round: 0 });

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
    // 沒有輪數上限：留白一段時間讓使用者念，然後再播，直到使用者按停止。
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
      <section className="card empty">
        <p>教材還沒有可跟讀的句子。</p>
      </section>
    );
  }

  const running = phase !== 'idle';

  return (
    <div className="shadow-screen">
      <div className="stepper">
        <button
          type="button"
          className="icon-btn"
          aria-label="上一句"
          onClick={() => go(index - 1)}
        >
          <PrevIcon />
        </button>
        <span className="stepper-label">
          <strong>
            第 {index + 1} / {SENTENCES.length} 句
          </strong>
          <span className="muted">
            <RubyText text={sentence.lessonTitle} />
          </span>
        </span>
        <button
          type="button"
          className="icon-btn"
          aria-label="下一句"
          onClick={() => go(index + 1)}
        >
          <NextIcon />
        </button>
      </div>

      <div className="card shadow-text" lang="ja">
        {showText ? (
          <>
            <JpLine
              jp={sentence.jp}
              reading={sentence.reading}
              ruby={sentence.ruby}
              jpClass="flash-word"
            />
            <div className="line-zh">
              <RubyText text={sentence.zh} />
            </div>
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

      <output className={`phase-pill${running ? ' active' : ''}`} data-phase={phase}>
        {phase === 'playing' && `第 ${round} 遍 · 聽`}
        {phase === 'gap' && `第 ${round} 遍 · 換你念`}
        {phase === 'idle' && '按「開始跟讀」會一直重複，按停止結束'}
      </output>
      {failed && (
        <p className="error" role="alert">
          音檔無法播放（找不到檔案，或離線且尚未快取）。
        </p>
      )}

      <div className="row options">
        <label className="chip-toggle">
          <input
            type="checkbox"
            checked={showText}
            onChange={(e) => setShowText(e.target.checked)}
          />
          <span>顯示原文</span>
        </label>
      </div>

      <div className="actions">
        {running ? (
          <button type="button" className="btn primary big block" onClick={stop}>
            <StopIcon />
            停止
          </button>
        ) : (
          <div className="row">
            <button
              type="button"
              className="btn primary big grow"
              onClick={start}
            >
              <PlayIcon />
              開始跟讀
            </button>
            <button
              type="button"
              className="btn big"
              onClick={() => {
                runRef.current.running = false;
                playClip();
              }}
            >
              聽一次
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
