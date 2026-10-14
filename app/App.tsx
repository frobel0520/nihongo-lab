import { useEffect, useState, type ReactNode } from 'react';
import { stages } from '../curriculum/lessons.mjs';
import type { DictationMode } from '../lib/prefs.mjs';
import { parseRoute, stageHash, viewHash, type ViewId } from '../lib/route.mjs';
import {
  BackIcon,
  BookIcon,
  CardsIcon,
  HeadphonesIcon,
  MicIcon,
  SlidersIcon,
} from './components/Icons';
import { PrefsContext, loadPrefs, savePrefs } from './prefs';
import { RubyText } from './components/Ruby';
import { useProgress } from './useProgress';
import { useSwUpdate } from './useSwUpdate';
import { useSync } from './useSync';
import { DictationView } from './views/DictationView';
import { LessonListView } from './views/LessonListView';
import { LessonView } from './views/LessonView';
import { SettingsView } from './views/SettingsView';
import { ShadowingView } from './views/ShadowingView';
import { GameStudyView } from './views/GameStudyView';
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
  const { progress, getProgress, update, warning, saveError, dismissWarning } =
    useProgress();
  const sync = useSync({ progress, getProgress, update });
  const [prefs, setPrefs] = useState(loadPrefs);
  const { updated, dismiss: dismissUpdate, reload } = useSwUpdate();

  const setFurigana = (furigana: boolean) => {
    const next = { ...prefs, furigana };
    setPrefs(next);
    savePrefs(next);
  };
  const setDictationMode = (dictationMode: DictationMode) => {
    const next = { ...prefs, dictationMode };
    setPrefs(next);
    savePrefs(next);
  };

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseRoute(window.location.hash));
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const lesson =
    route.view === 'lessons' && route.lessonId
      ? LESSONS.find((l) => l.id === route.lessonId)
      : undefined;
  const stage = stages.find((s) => s.id === route.stageId);
  const parentStage =
    lesson && stages.find((s) => s.lessons.some((l) => l.id === lesson.id));
  const routeKey = `${route.view}/${stage?.id ?? ''}/${lesson?.id ?? ''}/${route.srsMode ?? ''}/${route.gameId ?? ''}/${route.characterId ?? ''}`;

  // 換頁時回到頁首，不停在上一頁滑到一半的位置。
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [routeKey]);

  const title =
    (route.view === 'games'
      ? '遊戲角色語音'
      : (lesson?.title ?? stage?.title)) ??
    (route.view === 'lessons'
      ? APP_NAME
      : TABS.find((t) => t.id === route.view)?.label);

  return (
    <PrefsContext.Provider value={prefs}>
      <header className="appbar">
        {(lesson || stage) && (
          <a
            className="icon-btn"
            aria-label={lesson ? '返回課程清單' : '返回課程首頁'}
            href={parentStage ? stageHash(parentStage.id) : viewHash('lessons')}
          >
            <BackIcon />
          </a>
        )}
        <h1 className="appbar-title">
          <RubyText text={title ?? ''} />
        </h1>
      </header>

      <main
        className={`screen${route.view === 'dictation' ? ' dictation-page' : ''}`}
        key={routeKey}
      >
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
        {sync.status.attention && (
          <div className="notice notice-row" role="alert">
            <span>{sync.status.attention}</span>
            <span className="row">
              <a className="btn primary" href={viewHash('settings')}>
                到設定
              </a>
              <button
                type="button"
                className="btn"
                onClick={sync.dismissAttention}
              >
                知道了
              </button>
            </span>
          </div>
        )}
        {saveError && (
          <p className="notice" role="alert">
            {saveError}
          </p>
        )}

        {route.view === 'lessons' &&
          (lesson ? (
            <LessonView lesson={lesson} progress={progress} update={update} />
          ) : (
            <LessonListView progress={progress} stageId={stage?.id} />
          ))}
        {route.view === 'games' && (
          <GameStudyView
            key={`${route.gameId ?? ''}:${route.characterId ?? ''}`}
            gameId={route.gameId}
            characterId={route.characterId}
            progress={progress}
            update={update}
          />
        )}
        {route.view === 'srs' && (
          <SrsView
            progress={progress}
            update={update}
            mode={route.srsMode ?? 'review'}
          />
        )}
        {route.view === 'shadowing' && <ShadowingView />}
        {route.view === 'dictation' && (
          <DictationView
            progress={progress}
            update={update}
            mode={prefs.dictationMode}
            setMode={setDictationMode}
          />
        )}
        {route.view === 'settings' && (
          <SettingsView
            progress={progress}
            update={update}
            sync={sync}
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
            aria-current={
              route.view === tab.id ||
              (route.view === 'games' && tab.id === 'lessons')
                ? 'page'
                : undefined
            }
          >
            {tab.icon}
            <span>{tab.label}</span>
          </a>
        ))}
      </nav>
    </PrefsContext.Provider>
  );
}
