import { useRef, useState } from 'react';
import { JpLine } from './Ruby';

export function audioUrl(audio: string) {
  return `${import.meta.env.BASE_URL}${audio}`;
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
        <audio controls src={audioUrl(audio)} preload="none" />
      )}
    </div>
  );
}

/** 單顆播放鈕；音檔載入或播放失敗時顯示明確錯誤，而不是沒反應。 */
export function PlayButton({
  audio,
  label = '播放',
}: {
  audio: string;
  label?: string;
}) {
  const ref = useRef<HTMLAudioElement>(null);
  const [failed, setFailed] = useState(false);

  const play = () => {
    const el = ref.current;
    if (!el) return;
    setFailed(false);
    el.currentTime = 0;
    el.play().catch(() => setFailed(true));
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
        onError={() => setFailed(true)}
      />
      {failed && (
        <span className="error" role="alert">
          音檔無法播放（找不到檔案，或離線且尚未快取）。
        </span>
      )}
    </span>
  );
}
