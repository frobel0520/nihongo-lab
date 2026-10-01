import { useState } from 'react';
import { stages } from '../../curriculum/lessons.mjs';
import { allAudioPaths } from '../../lib/offline.mjs';
import type { Progress } from '../../lib/progress.mjs';
import type { Prefs } from '../../lib/prefs.mjs';
import { CACHE_CLEARED_FLAG, ClearCache } from '../components/ClearCache';
import { OfflineAudio } from '../components/OfflineAudio';
import { ProgressTransfer } from '../components/ProgressTransfer';

const ALL_AUDIO_PATHS = allAudioPaths(stages);
/** 設定頁只提供「全部課程」下載；模組層級的固定陣列，避免每次渲染都換新參考而重跑下載計數。 */
const NO_LESSON_PATHS: string[] = [];

/** 清完快取重新載入後只顯示一次；進度筆數讓使用者當場確認沒掉。 */
function readClearedFlag() {
  try {
    if (sessionStorage.getItem(CACHE_CLEARED_FLAG) === null) return false;
    sessionStorage.removeItem(CACHE_CLEARED_FLAG);
    return true;
  } catch {
    return false;
  }
}

export function SettingsView({
  progress,
  update,
  prefs,
  setFurigana,
}: {
  progress: Progress;
  update: (change: (prev: Progress) => Progress) => void;
  prefs: Prefs;
  setFurigana: (furigana: boolean) => void;
}) {
  const [justCleared, setJustCleared] = useState(readClearedFlag);

  return (
    <>
      {justCleared && (
        <output className="notice notice-row">
          <span>
            已清除快取並重新載入。學習進度都還在：單字卡{' '}
            {Object.keys(progress.srs).length} 張、聽寫{' '}
            {Object.keys(progress.dictation).length} 句的紀錄。
          </span>
          <button
            type="button"
            className="btn"
            onClick={() => setJustCleared(false)}
          >
            知道了
          </button>
        </output>
      )}

      <section className="card">
        <h3>顯示</h3>
        <label className="switch-row">
          <span>
            漢字上方標讀音（ふりがな）
            <small className="muted">課文、跟讀、聽寫答案都會標在漢字上方</small>
          </span>
          <input
            type="checkbox"
            className="switch"
            checked={prefs.furigana}
            onChange={(e) => setFurigana(e.target.checked)}
          />
        </label>
      </section>

      <ProgressTransfer progress={progress} update={update} />

      {ALL_AUDIO_PATHS.length > 0 && (
        <OfflineAudio
          lessonPaths={NO_LESSON_PATHS}
          allPaths={ALL_AUDIO_PATHS}
        />
      )}

      <ClearCache />
    </>
  );
}
