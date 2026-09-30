import { useRef, useState } from 'react';
import { JpLine } from './Ruby';

export function audioUrl(audio: string) {
  return `${import.meta.env.BASE_URL}${audio}`;
}

/**
 * 課文每一行右邊的小播放鈕（取代原生 <audio controls>，那個在手機上每行要多佔一整列高度）。
 * 播放中再按一次就停；開始播放時會先停掉頁面上其他正在播的音檔，不會疊在一起。
 * preload="none"：一課有幾十行，不能一進頁面就全部載入。載入或播放失敗時圖示變 ⚠，不是沒反應。
 */
function LinePlay({ audio, label }: { audio: string; label: string }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (playing) {
      el.pause();
      el.currentTime = 0;
      return;
    }
    for (const other of document.querySelectorAll('audio')) {
      if (other !== el) other.pause();
    }
    setFailed(false);
    el.currentTime = 0;
    el.play().catch(() => setFailed(true));
  };

  return (
    <>
      <button
        type="button"
        className={`play-icon${failed ? ' failed' : ''}`}
        aria-label={
          failed
            ? `${label}（音檔無法播放：找不到檔案，或離線且尚未下載）`
            : `${playing ? '停止' : '播放'}：${label}`
        }
        title={
          failed ? '音檔無法播放（找不到檔案，或離線且尚未下載）' : undefined
        }
        aria-pressed={playing}
        onClick={toggle}
      >
        {failed ? '⚠' : playing ? '■' : '▶'}
      </button>
      <audio
        ref={ref}
        src={audioUrl(audio)}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => setFailed(true)}
      />
    </>
  );
}

export function AudioLine({
  jp,
  reading,
  ruby,
  zh,
  audio,
  pending = false,
}: {
  jp: string;
  reading: string;
  ruby?: string;
  zh: string;
  audio: string;
  pending?: boolean;
}) {
  return (
    <div className="line">
      <JpLine jp={jp} reading={reading} ruby={ruby} jpClass="line-jp" />
      <div className="line-zh">{zh}</div>
      {pending ? (
        <span className="muted pending">音檔待產生</span>
      ) : (
        <LinePlay audio={audio} label={jp} />
      )}
    </div>
  );
}

/**
 * 單顆播放鈕；音檔載入或播放失敗時顯示明確錯誤，而不是沒反應。
 * 錯誤記的是「哪一個音檔」失敗，所以換到下一句（同一個元件、不同音檔）時，上一句的錯誤不會殘留。
 */
export function PlayButton({
  audio,
  label = '播放',
}: {
  audio: string;
  label?: string;
}) {
  const ref = useRef<HTMLAudioElement>(null);
  const [failedAudio, setFailedAudio] = useState<string | null>(null);
  const failed = failedAudio === audio;

  const play = () => {
    const el = ref.current;
    if (!el) return;
    setFailedAudio(null);
    el.currentTime = 0;
    el.play().catch(() => setFailedAudio(audio));
  };

  return (
    <span className="play">
      <button type="button" className="btn" onClick={play}>
        ▶ {label}
      </button>
      <audio
        ref={ref}
        src={audioUrl(audio)}
        preload="auto"
        onError={() => setFailedAudio(audio)}
      />
      {failed && (
        <span className="error" role="alert">
          音檔無法播放（找不到檔案，或離線且尚未下載；可到「設定」頁下載音檔供離線使用）。
        </span>
      )}
    </span>
  );
}
