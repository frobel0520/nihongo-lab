import { useEffect, useRef, useState, type ReactNode } from 'react';
import { stages } from '../curriculum/lessons.mjs';
import { parseRoute, viewHash, type ViewId } from '../lib/route.mjs';
import {
  BackIcon,
  BookIcon,
  CardsIcon,
  HeadphonesIcon,
  MicIcon,
  SlidersIcon,
} from './components/Icons';
import { PrefsContext, loadPrefs, savePrefs } from './prefs';
import { useProgress } from './useProgress';
import { useSwUpdate } from './useSwUpdate';
import { DictationView } from './views/DictationView';
import { LessonListView } from './views/LessonListView';
import { LessonView } from './views/LessonView';
import { SettingsView } from './views/SettingsView';
import { ShadowingView } from './views/ShadowingView';
import { SrsView } from './views/SrsView';

const APP_NAME = 'かなの日本語';

const TABS: { id: ViewId; label: string; icon: ReactNode }[] = [
  { id: 'lessons', label: '課程', icon: <BookIcon /> },
  { id: 'srs', label: '單字卡', icon: <CardsIcon /> },
  { id: 'dictation', label: '聽寫', icon: <HeadphonesIcon /> },
  { id: 'shadowing', label: '跟讀', icon: <MicIcon /> },
  { id: 'settings', label: '設定', icon: <SlidersIcon /> },
];

const LESSONS = stages.flatMap((stage) => stage.lessons);

export function App() {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  const { progress, update, warning, saveError, dismissWarning } =
    useProgress();
  const [prefs, setPrefs] = useState(loadPrefs);
  const { updated, dismiss: dismissUpdate, reload } = useSwUpdate();
  // 有沒有在 App 裡換過頁：沒有的話（直接開單一課程的網址），返回鍵不能用 history.back()，否則會離開 App。
  const navigated = useRef(false);

  const setFurigana = (furigana: boolean) => {
    const next = { ...prefs, furigana };
    setPrefs(next);
    savePrefs(next);
  };

  useEffect(() => {
    const onHashChange = () => {
      navigated.current = true;
      setRoute(parseRoute(window.location.hash));
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const lesson =
    route.view === 'lessons' && route.lessonId
      ? LESSONS.find((l) => l.id === route.lessonId)
      : undefined;
  const routeKey = `${route.view}/${lesson?.id ?? ''}`;

  // 換頁時回到頁首，不停在上一頁滑到一半的位置。
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [routeKey]);

  const goBack = () => {
    if (navigated.current) window.history.back();
    else window.location.replace(viewHash('lessons'));
  };

  const title =
    lesson?.title ??
    (route.view === 'lessons'
      ? APP_NAME
      : TABS.find((t) => t.id === route.view)?.label);

  return (
    <PrefsContext.Provider value={prefs}>
      <header className="appbar">
        {lesson && (
          <button
            type="button"
            className="icon-btn"
            aria-label="返回課程清單"
            onClick={goBack}
          >
            <BackIcon />
          </button>
        )}
        <h1 className="appbar-title">{title}</h1>
      </header>

      <main className="screen" key={routeKey}>
        {updated && (
          <output className="notice notice-row">
            <span>
              已更新到新版本，重新載入即可使用（目前的進度都已存好，不會遺失）。
            </span>
            <span className="row">
              <button type="button" className="btn primary" onClick={reload}>
                重新載入
              </button>
              <button type="button" className="btn" onClick={dismissUpdate}>
                稍後
              </button>
            </span>
          </output>
        )}
        {warning && (
          <div className="notice notice-row" role="alert">
            <span>{warning}</span>
            <button type="button" className="btn" onClick={dismissWarning}>
              知道了
            </button>
          </div>
        )}
        {saveError && (
          <p className="notice" role="alert">
            {saveError}
          </p>
        )}

        {route.view === 'lessons' &&
          (lesson ? (
            <LessonView lesson={lesson} />
          ) : (
            <LessonListView progress={progress} />
          ))}
        {route.view === 'srs' && <SrsView progress={progress} update={update} />}
        {route.view === 'shadowing' && <ShadowingView />}
        {route.view === 'dictation' && (
          <DictationView progress={progress} update={update} />
        )}
        {route.view === 'settings' && (
          <SettingsView
            progress={progress}
            update={update}
            prefs={prefs}
            setFurigana={setFurigana}
          />
        )}
      </main>

      <nav className="tabs" aria-label="功能">
        {TABS.map((tab) => (
          <a
            key={tab.id}
            href={viewHash(tab.id)}
            aria-current={route.view === tab.id ? 'page' : undefined}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </a>
        ))}
      </nav>
    </PrefsContext.Provider>
  );
}
