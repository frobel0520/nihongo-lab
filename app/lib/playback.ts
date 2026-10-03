import { playFromStart, type PlayResult } from '../../lib/playback.mjs';

/** 最近一次要求播放的元素；比它更新的請求出現後，舊請求的失敗不再重試或顯示。 */
let latest: HTMLAudioElement | null = null;

/** 停掉頁面上其他音檔，從頭播放 el；快速切換造成的中斷不算失敗。 */
export function playAudioFromStart(el: HTMLAudioElement): Promise<PlayResult> {
  latest = el;
  return playFromStart(el, {
    others: document.querySelectorAll('audio'),
    isCurrent: () => latest === el,
  });
}
