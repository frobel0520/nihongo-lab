import { useEffect, useState } from 'react';
import { PrefsContext, loadPrefs, savePrefs } from './prefs';
import { useProgress } from './useProgress';
import { DictationView } from './views/DictationView';
import { LessonView } from './views/LessonView';
import { ShadowingView } from './views/ShadowingView';
import { SrsView } from './views/SrsView';

type ViewId = 'lessons' | 'srs' | 'dictation' | 'shadowing';

const TABS: { id: ViewId; label: string; hash: string }[] = [
  { id: 'lessons', label: '課程', hash: '#/' },
  { id: 'srs', label: '單字卡', hash: '#/srs' },
  { id: 'dictation', label: '聽寫', hash: '#/dictation' },
  { id: 'shadowing', label: '跟讀', hash: '#/shadowing' },
];

function viewFromHash(): ViewId {
  return TABS.find((t) => t.hash === window.location.hash)?.id ?? 'lessons';
}

export function App() {
  const [view, setView] = useState<ViewId>(viewFromHash);
  const { progress, update, notice } = useProgress();
  const [prefs, setPrefs] = useState(loadPrefs);

  const setFurigana = (furigana: boolean) => {
    const next = { ...prefs, furigana };
    setPrefs(next);
    savePrefs(next);
  };

  useEffect(() => {
    const onHashChange = () => setView(viewFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <PrefsContext.Provider value={prefs}>
      <main className="wrap">
        <header>
          <p className="handle">Michael</p>
          <h1>日本語 Lab</h1>
          <p className="lede">N5 復健到 N1，聽得懂動畫與遊戲日文配音。</p>
        </header>

        <nav className="tabs" aria-label="功能">
          {TABS.map((tab) => (
            <a
              key={tab.id}
              href={tab.hash}
              aria-current={view === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </a>
          ))}
        </nav>

        <label className="inline-field furigana-toggle">
          <input
            type="checkbox"
            checked={prefs.furigana}
            onChange={(e) => setFurigana(e.target.checked)}
          />
          漢字上方標讀音（ふりがな）
        </label>

        {notice && (
          <p className="notice" role="alert">
            {notice}
          </p>
        )}

        {view === 'lessons' && <LessonView />}
        {view === 'srs' && <SrsView progress={progress} update={update} />}
        {view === 'shadowing' && <ShadowingView />}
        {view === 'dictation' && (
          <DictationView progress={progress} update={update} />
        )}

        <footer>
          <p>
            原始碼公開於{' '}
            <a href="https://github.com/frobel0520/nihongo-lab">
              github.com/frobel0520/nihongo-lab
            </a>
          </p>
        </footer>
      </main>
    </PrefsContext.Provider>
  );
}
