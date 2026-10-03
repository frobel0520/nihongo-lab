/**
 * 播放一個音檔的流程（不碰 DOM，元素與「其他音檔」由呼叫端傳入，方便測試）。
 * @typedef {{
 *   error: unknown,
 *   currentTime: number,
 *   play(): Promise<void>,
 *   pause(): void,
 *   load(): void,
 * }} PlayableAudio
 * @typedef {'started' | 'interrupted' | 'failed'} PlayResult
 */

/**
 * play() 被後來的 play()／pause()／換來源打斷時，會以 AbortError 拒絕。
 * 這是使用者操作（快速切換）造成的，不是音檔壞掉，不能顯示成「無法播放」。
 * @param {unknown} error
 */
export function isPlayInterruption(error) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    error.name === 'AbortError'
  );
}

/**
 * 停掉其他音檔，從頭播放 el。
 * - 'started'：播起來了。
 * - 'interrupted'：被使用者的下一個操作打斷，不是錯誤，畫面不顯示失敗。
 * - 'failed'：重新載入後仍播不出來（找不到檔案，或離線且沒下載）。
 *
 * 載入失敗過的 <audio> 之後每一次 play() 都會被拒絕，直到重新 load()；
 * 所以元素帶著錯誤、或第一次播放失敗時，會 load() 後再試一次，不必重新整理頁面。
 * @param {PlayableAudio} el
 * @param {{ others: Iterable<PlayableAudio>, isCurrent: () => boolean }} context
 *   isCurrent：這次播放是不是最新的一次；已經有更新的播放請求就不要再重試，免得疊在別的音檔上。
 * @returns {Promise<PlayResult>}
 */
export async function playFromStart(el, { others, isCurrent }) {
  for (const other of others) {
    if (other !== el) other.pause();
  }
  if (el.error) el.load();
  el.currentTime = 0;
  try {
    await el.play();
    return 'started';
  } catch (error) {
    if (isPlayInterruption(error) || !isCurrent()) return 'interrupted';
  }
  el.load();
  try {
    await el.play();
    return 'started';
  } catch (error) {
    return isPlayInterruption(error) || !isCurrent() ? 'interrupted' : 'failed';
  }
}
