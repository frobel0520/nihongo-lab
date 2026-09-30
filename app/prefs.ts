import { createContext, useContext } from 'react';
import { defaultPrefs, parsePrefs, type Prefs } from '../lib/prefs.mjs';

const KEY = 'nihongo-lab:prefs:v1';

export const PrefsContext = createContext<Prefs>(defaultPrefs());

export const usePrefs = () => useContext(PrefsContext);

export function loadPrefs(): Prefs {
  try {
    return parsePrefs(localStorage.getItem(KEY));
  } catch {
    return defaultPrefs();
  }
}

/** 偏好只是便利設定：存不進去就只在這次瀏覽有效，不打斷使用者。 */
export function savePrefs(prefs: Prefs) {
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    // 儲存空間被停用或已滿
  }
}
