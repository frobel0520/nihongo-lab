import { useCallback, useEffect, useRef, useState } from 'react';
import type { SongsDoc } from '../lib/songs.mjs';
import {
  SONGS_KEY,
  adoptExternalSongs,
  loadSongs,
  updateSongs,
} from '../lib/songs-store.mjs';
import { getStorage } from './lib/storage';

/**
 * 歌曲狀態 + 每次更新立刻寫入 localStorage（跟 useProgress 同一套做法）。
 * 歌詞只存在這個瀏覽器，不進跨裝置同步。
 */
export function useSongs() {
  const [initial] = useState(() => loadSongs(getStorage()));
  const [doc, setDoc] = useState<SongsDoc>(initial.doc);
  const [warning, setWarning] = useState<string | null>(initial.warning);
  const [saveError, setSaveError] = useState<string | null>(null);
  const latest = useRef(doc);

  const update = useCallback((change: (prev: SongsDoc) => SongsDoc) => {
    const result = updateSongs(getStorage(), latest.current, change);
    latest.current = result.doc;
    setDoc(result.doc);
    setSaveError(result.saveError);
    return result.saveError;
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== SONGS_KEY || event.newValue === null) return;
      const external = adoptExternalSongs(event.newValue);
      if (external) {
        latest.current = external;
        setDoc(external);
      } else {
        setWarning('另一個分頁寫入的歌曲格式異常，已忽略；這個分頁的歌曲不受影響。');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const dismissWarning = useCallback(() => setWarning(null), []);

  return { doc, update, warning, saveError, dismissWarning };
}

export type SongsState = ReturnType<typeof useSongs>;
