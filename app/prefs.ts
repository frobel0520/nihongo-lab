import { createContext, useContext, useLayoutEffect } from 'react';
import {
  defaultPrefs,
  parsePrefs,
  type Prefs,
  type Theme,
} from '../lib/prefs.mjs';

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

/** 讓整個 App 及瀏覽器工具列沿用相同的明暗模式。 */
export function useTheme(theme: Theme) {
  useLayoutEffect(() => {
    const system = window.matchMedia('(prefers-color-scheme: dark)');
    const root = document.documentElement;
    const toolbar = document.querySelector<HTMLMetaElement>('#app-theme-color');
    const apply = () => {
      root.dataset.theme =
        theme === 'system' ? (system.matches ? 'dark' : 'light') : theme;
      if (toolbar && theme !== 'system') {
        toolbar.content = getComputedStyle(root)
          .getPropertyValue('--bg')
          .trim();
      }
    };

    apply();
    if (toolbar) toolbar.media = theme === 'system' ? 'not all' : 'all';
    if (theme !== 'system') return;
    system.addEventListener('change', apply);
    return () => system.removeEventListener('change', apply);
  }, [theme]);
}
