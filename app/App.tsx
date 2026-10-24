import {
  lazy,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { curriculumSummary } from '../curriculum/lessons.mjs';
import { LoadBoundary } from './components/LoadBoundary';
import { useRouteData } from './useRouteData';
import type { DictationMode } from '../lib/prefs.mjs';
import {
  backNavigation,
  parseRoute,
  stageHash,
  viewHash,
  type ViewId,
} from '../lib/route.mjs';
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
import { LessonListView } from './views/LessonListView';
import { STUDY_CATEGORIES } from '../lib/study-categories.mjs';
import { StudyCategoryPicker } from './components/StudyCategoryPicker';
import { ImageUpdateHint } from './components/ImageUpdateHint';

const DictationView = lazy(() =>
  import('./views/DictationView').then((m) => ({ default: m.DictationView })),
);
const LessonView = lazy(() =>
  import('./views/LessonView').then((m) => ({ default: m.LessonView })),
);
const SettingsView = lazy(() =>
  import('./views/SettingsView').then((m) => ({ default: m.SettingsView })),
);
const ShadowingView = lazy(() =>
  import('./views/ShadowingView').then((m) => ({ default: m.ShadowingView })),
);
const GameStudyView = lazy(() =>
  import('./views/GameStudyView').then((m) => ({ default: m.GameStudyView })),
);
const SrsView = lazy(() =>
  import('./views/SrsView').then((m) => ({ default: m.SrsView })),
);

const APP_NAME = 'かなの日本語';

const TABS: { id: ViewId; label: string; icon: ReactNode }[] = [
  { id: 'lessons', label: '課程', icon: <BookIcon /> },
  { id: 'srs', label: '單字卡', icon: <CardsIcon /> },
  { id: 'dictation', label: '聽寫', icon: <HeadphonesIcon /> },
  { id: 'shadowing', label: '跟讀', icon: <MicIcon /> },
  { id: 'settings', label: '設定', icon: <SlidersIcon /> },
];

const stages = curriculumSummary.stages;
const LESSONS = stages.flatMap((stage) => stage.lessons);

export function App() {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  const { progress, getProgress, update, warning, saveError, dismissWarning } =
    useProgress();
  const sync = useSync({ progress, getProgress, update });
  const [prefs, setPrefs] = useState(loadPrefs);
  const { updated, changed, applying, error: updateError, dismiss: dismissUpdate, reload } = useSwUpdate();
  // 上一頁的 hash：返回鍵據此決定退回歷史或換頁（見 lib/route.mjs backNavigation）。
  const previousHash = useRef<string | null>(null);

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
    const onHashChange = (event: HashChangeEvent) => {
      previousHash.current = new URL(event.oldURL).hash;
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
  const category = STUDY_CATEGORIES.find((c) => c.id === route.category);

  const routeKey = `${route.view}/${category?.id ?? ''}/${stage?.id ?? ''}/${lesson?.id ?? ''}/${route.srsMode ?? ''}/${route.gameId ?? ''}/${route.characterId ?? ''}`;

  const data = useRouteData(
    routeKey,
    lesson?.id,
    ['srs', 'dictation', 'shadowing'].includes(route.view)
      ? category?.id
      : undefined,
  );
  const catalog = data.catalog;

  // 換頁時回到頁首，不停在上一頁滑到一半的位置。
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [routeKey]);

  const backTarget = parentStage
    ? stageHash(parentStage.id)
    : viewHash('lessons');
  const goBack = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (backNavigation(previousHash.current, backTarget) === 'back')
      window.history.back();
    else window.location.replace(backTarget);
  };

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
            href={backTarget}
            onClick={goBack}
          >
            <BackIcon />
          </a>
        )}
        <h1 className="appbar-title">
          <RubyText text={title ?? ''} />
        </h1>
      </header>

      <main
        className={`screen${route.view === 'dictation' && category ? ' dictation-page' : ''}${route.view === 'srs' && category ? ' srs-page' : ''}`}
        key={routeKey}
      >
        {updated && (
          <output className="notice notice-row">
            <span>
              {changed
                ? '版本已切換，請完成目前作答後重新載入。'
                : '有新版可用；可先完成目前作答，稍後再更新。更新前請關閉本網站其他分頁。'}
              已儲存的學習進度、下載的音檔與單字圖片會保留；新版若有新增或修訂的圖片，可到設定頁補下載。
              {updateError && <span role="alert">{updateError}</span>}
            </span>
            <span className="row">
              <button type="button" className="btn primary" disabled={applying} onClick={() => void reload()}>
                {applying ? '正在套用更新…' : changed ? '重新載入' : '更新並重新載入'}
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
        <ImageUpdateHint onSettings={route.view === 'settings'} />
        {saveError && (
          <p className="notice" role="alert">
            {saveError}
          </p>
        )}

        <LoadBoundary>
          {data.error && (
            <section className="card" role="alert">
              <p>教材載入失敗。請連線後重新載入；已快取的教材仍可離線使用。</p>
              <button className="btn" onClick={() => window.location.reload()}>
                重新載入
              </button>
            </section>
          )}
          {!data.ready && !data.error && (lesson || category) && (
            <output className="notice">正在載入教材…</output>
          )}
          {route.view === 'lessons' &&
            (lesson ? (
              data.lesson && (
                <LessonView
                  lesson={data.lesson}
                  progress={progress}
                  update={update}
                />
              )
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
          {['srs', 'dictation', 'shadowing'].includes(route.view) &&
            (category ? (
              <section className="study-context" aria-label="目前教材">
                <div className="row">
                  <strong>{category.title}</strong>
                  <a className="btn" href={viewHash(route.view)}>
                    更換教材類別
                  </a>
                </div>
                {category.id === 'games' && route.view === 'srs' && (
                  <p className="muted">
                    本類別使用角色短台詞卡，練習原句與意思。
                  </p>
                )}
              </section>
            ) : (
              <StudyCategoryPicker
                view={route.view}
                mode={route.srsMode}
                progress={progress}
              />
            ))}
          {route.view === 'srs' && catalog && category && (
            <SrsView
              progress={progress}
              update={update}
              mode={route.srsMode ?? 'review'}
              cards={catalog.cards}
              categoryId={category.id}
            />
          )}
          {route.view === 'shadowing' && catalog && (
            <ShadowingView sentences={catalog.sentences} />
          )}
          {route.view === 'dictation' && catalog && (
            <DictationView
              progress={progress}
              update={update}
              mode={prefs.dictationMode}
              setMode={setDictationMode}
              sentences={catalog.sentences}
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
        </LoadBoundary>
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
