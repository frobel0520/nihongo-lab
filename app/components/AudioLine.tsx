import { useRef, useState } from 'react';
import { PlayIcon, SpeakerIcon, StopIcon } from './Icons';
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
        {failed ? '⚠' : playing ? <StopIcon /> : <PlayIcon />}
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
 * 大的圓形播放鈕（單字卡、聽寫用）；播放中再按一次就停，開始播放前先停掉頁面上其他正在播的音檔。
 * 音檔載入或播放失敗時顯示明確錯誤，而不是沒反應。
 * 錯誤記的是「哪一個音檔」失敗，所以換到下一句（同一個元件、不同音檔）時，上一句的錯誤不會殘留。
 * caption 為 true 時把 label 顯示在按鈕下方，否則只當作螢幕閱讀器的名稱。
 */
export function PlayButton({
  audio,
  label = '播放',
  caption = false,
}: {
  audio: string;
  label?: string;
  caption?: boolean;
}) {
  const ref = useRef<HTMLAudioElement>(null);
  const [failedAudio, setFailedAudio] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const failed = failedAudio === audio;

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
    setFailedAudio(null);
    el.currentTime = 0;
    el.play().catch(() => setFailedAudio(audio));
  };

  return (
    <span className="play">
      <button
        type="button"
        className="play-big"
        aria-label={playing ? `停止：${label}` : label}
        onClick={toggle}
      >
        {playing ? <StopIcon /> : <SpeakerIcon />}
      </button>
      {caption && <span className="muted">{label}</span>}
      <audio
        ref={ref}
        src={audioUrl(audio)}
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
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
