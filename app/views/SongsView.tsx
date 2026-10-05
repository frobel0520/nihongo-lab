import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  MAX_SONGS_IMPORT_BYTES,
  createSong,
  editSong,
  exportSongs,
  lineCount,
  lyricsText,
  mergeSongs,
  needsAnalysis,
  parseSongsImport,
  removeSong,
  setLineNote,
  songsExportFilename,
  sortSongs,
  upsertSong,
  type Song,
} from '../../lib/songs.mjs';
import {
  NEW_SONG_HASH,
  songEditHash,
  songHash,
  viewHash,
  type Route,
} from '../../lib/route.mjs';
import { applyAnalysis, setTokenReading } from '../../lib/song-tokens.mjs';
import { ChevronRightIcon, MusicIcon } from '../components/Icons';
import { GrammarChips, WordDetails } from '../components/SongInsights';
import { SongLineText, WordSheet, type WordRef } from '../components/SongWords';
import {
  analyzeLines,
  isDictionaryCached,
  type AnalyzeProgress,
} from '../lib/songAnalyzer';
import type { SongsState } from '../useSongs';

type Message = { kind: 'ok' | 'error'; text: string };

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/**
 * 歌曲閱讀器：使用者自己貼上歌詞，只存在這個瀏覽器（見 docs/song-reader.md）。
 * 依路由顯示清單、新增、單首歌曲或編輯畫面。
 */
export function SongsView({
  route,
  songs,
  goBack,
}: {
  route: Route;
  songs: SongsState;
  goBack: () => void;
}) {
  const song = route.songId
    ? songs.doc.songs.find((s) => s.id === route.songId)
    : undefined;

  if (route.mode === 'new') return <SongEditor songs={songs} goBack={goBack} />;
  if (route.songId && !song) {
    return (
      <section className="card empty">
        <p className="muted">找不到這首歌，可能已經刪除或是在另一台裝置上新增的。</p>
        <a className="btn" href={viewHash('songs')}>
          回歌曲清單
        </a>
      </section>
    );
  }
  if (song && route.mode === 'edit') {
    return <SongEditor songs={songs} song={song} goBack={goBack} />;
  }
  if (song) return <SongDetail song={song} songs={songs} />;
  return <SongList songs={songs} />;
}

function SongList({ songs }: { songs: SongsState }) {
  const list = sortSongs(songs.doc.songs);
  return (
    <>
      <section className="card">
        <h3>歌曲學習</h3>
        <p className="muted">
          貼上你從正版歌詞網站或歌詞本找到的歌詞，逐句寫筆記。歌詞只存在這台裝置的瀏覽器，
          不會上傳、也不會跨裝置同步；換裝置請用下方的匯出／匯入。
        </p>
        <a className="btn primary block" href={NEW_SONG_HASH}>
          新增歌曲
        </a>
      </section>

      {list.length === 0 ? (
        <p className="muted song-empty">還沒有歌曲。</p>
      ) : (
        <ul className="lesson-list">
          {list.map((s) => (
            <li key={s.id}>
              <a className="card lesson-card" href={songHash(s.id)}>
                <MusicIcon />
                <span className="lesson-card-body">
                  <span className="lesson-title" lang="ja">
                    {s.title}
                  </span>
                  <span className="muted">
                    {s.artist && (
                      <>
                        <span lang="ja">{s.artist}</span> ·{' '}
                      </>
                    )}
                    {lineCount(s)} 句
                  </span>
                </span>
                <ChevronRightIcon />
              </a>
            </li>
          ))}
        </ul>
      )}

      <SongsTransfer songs={songs} />
    </>
  );
}

function SongEditor({
  songs,
  song,
  goBack,
}: {
  songs: SongsState;
  song?: Song;
  goBack: () => void;
}) {
  const [title, setTitle] = useState(song?.title ?? '');
  const [artist, setArtist] = useState(song?.artist ?? '');
  const [lyrics, setLyrics] = useState(song ? lyricsText(song) : '');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const now = new Date().toISOString();
    const input = { title, artist, lyrics };
    const result = song
      ? editSong(song, input, now)
      : createSong(input, { id: newId(), now });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    const saveError = songs.update((prev) => upsertSong(prev, result.song));
    if (saveError) {
      setError(saveError);
      return;
    }
    if (song) goBack();
    // 新增後換成歌曲頁（取代掉「新增」這一頁），返回鍵回到清單而不是空白表單。
    else window.location.replace(songHash(result.song.id));
  };

  return (
    <form className="card song-form" onSubmit={onSubmit}>
      <label>
        歌名
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          lang="ja"
          autoComplete="off"
          required
        />
      </label>
      <label>
        歌手（選填）
        <input
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          lang="ja"
          autoComplete="off"
        />
      </label>
      <label>
        歌詞（一行一句，空一行代表換段）
        <textarea
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          lang="ja"
          rows={12}
          spellCheck={false}
        />
      </label>
      {song && (
        <p className="muted">沒改到的句子會保留筆記；改過或新增的句子要重新分析。</p>
      )}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="row">
        <button type="submit" className="btn primary">
          儲存
        </button>
        <button type="button" className="btn" onClick={goBack}>
          取消
        </button>
      </div>
    </form>
  );
}

type Analysis =
  | { kind: 'idle' }
  | { kind: 'ask' }
  | { kind: 'running'; progress: AnalyzeProgress | null }
  | { kind: 'error'; message: string };

/** 分析歌詞讀音：字典已在快取就自動開始；還沒下載過先問，避免默默用掉 17MB 行動數據。 */
function useSongAnalysis(song: Song, songs: SongsState) {
  const [state, setState] = useState<Analysis>({ kind: 'idle' });
  const pending = needsAnalysis(song);

  const start = () => {
    setState({ kind: 'running', progress: null });
    const targets = song.lines.map((line) => (line.tokens === null ? line.text : ''));
    analyzeLines(targets, (progress) => setState({ kind: 'running', progress }))
      .then(({ lines, timings }) => {
        // 效能量測用（只在開發版輸出）：建立斷詞器與分析的耗時，記錄見 release-audit.md「T50」。
        if (import.meta.env.DEV) console.info('[song-analyzer]', timings);
        const saveError = songs.update((prev) => {
          const current = prev.songs.find((s) => s.id === song.id);
          if (!current) return prev;
          // 只寫這次分析的行；已有結果的行（傳空字串）沿用原本的。
          const results = current.lines.map((line, i) =>
            line.tokens === null ? lines[i] : { text: line.text, tokens: line.tokens },
          );
          return upsertSong(prev, applyAnalysis(current, results, new Date().toISOString()));
        });
        setState(saveError ? { kind: 'error', message: saveError } : { kind: 'idle' });
      })
      .catch((error: unknown) =>
        setState({
          kind: 'error',
          message: `分析失敗：${error instanceof Error ? error.message : String(error)}`,
        }),
      );
  };

  useEffect(() => {
    if (!pending || state.kind !== 'idle') return;
    let cancelled = false;
    void isDictionaryCached().then((cached) => {
      if (cancelled) return;
      if (cached) start();
      else setState({ kind: 'ask' });
    });
    return () => {
      cancelled = true;
    };
    // start 每次渲染都是新的；只在「需要分析」狀態改變時判斷一次。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, state.kind]);

  return { pending, state, start };
}

function AnalysisCard({
  analysis,
}: {
  analysis: ReturnType<typeof useSongAnalysis>;
}) {
  const { pending, state, start } = analysis;
  if (!pending && state.kind !== 'error') return null;
  return (
    <section className="card" aria-live="polite">
      <h3>漢字讀音</h3>
      {state.kind === 'ask' && (
        <>
          <p className="muted">
            第一次使用要下載斷詞字典（約 17MB，只需一次，之後離線也能用），建議用 Wi-Fi。
          </p>
          <button type="button" className="btn primary" onClick={start}>
            下載字典並分析讀音
          </button>
        </>
      )}
      {state.kind === 'running' && (
        <p className="muted">
          {state.progress && state.progress.loaded < state.progress.total
            ? `載入字典 ${state.progress.loaded} / ${state.progress.total}…`
            : '分析中…'}
        </p>
      )}
      {state.kind === 'idle' && <p className="muted">準備分析…</p>}
      {state.kind === 'error' && (
        <>
          <p className="error" role="alert">
            {state.message}
          </p>
          <button type="button" className="btn" onClick={start}>
            再試一次
          </button>
        </>
      )}
    </section>
  );
}

function SongDetail({ song, songs }: { song: Song; songs: SongsState }) {
  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selected, setSelected] = useState<WordRef | null>(null);
  const analysis = useSongAnalysis(song, songs);
  const selectedToken =
    selected && song.lines[selected.line]?.tokens?.[selected.token];

  const saveReading = (word: WordRef, reading: string) => {
    songs.update((prev) => {
      const current = prev.songs.find((s) => s.id === song.id);
      return current
        ? upsertSong(
            prev,
            setTokenReading(current, word.line, word.token, reading, new Date().toISOString()),
          )
        : prev;
    });
  };

  const saveNote = (index: number, note: string) => {
    songs.update((prev) => {
      const current = prev.songs.find((s) => s.id === song.id);
      return current
        ? upsertSong(prev, setLineNote(current, index, note, new Date().toISOString()))
        : prev;
    });
    setEditingNote(null);
  };

  const onDelete = () => {
    songs.update((prev) => removeSong(prev, song.id));
    window.location.replace(viewHash('songs'));
  };

  return (
    <>
      {song.artist && (
        <p className="muted song-artist" lang="ja">
          {song.artist}
        </p>
      )}

      <AnalysisCard analysis={analysis} />

      <section className="card">
        <ol className="song-lines">
          {song.lines.map((line, index) =>
            line.text === '' ? (
              <li key={index} className="song-gap" aria-hidden="true" />
            ) : (
              <li key={index} className="song-line">
                {line.tokens && line.tokens.length > 0 ? (
                  <>
                    <SongLineText
                      tokens={line.tokens}
                      lineIndex={index}
                      selected={selected}
                      onSelect={setSelected}
                    />
                    <GrammarChips tokens={line.tokens} />
                  </>
                ) : (
                  <div className="song-text" lang="ja">
                    {line.text}
                  </div>
                )}
                {editingNote === index ? (
                  <NoteEditor
                    initial={line.note}
                    onSave={(note) => saveNote(index, note)}
                    onCancel={() => setEditingNote(null)}
                  />
                ) : (
                  <div className="song-note-row">
                    {line.note && <p className="song-note">{line.note}</p>}
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => setEditingNote(index)}
                    >
                      {line.note ? '改筆記' : '寫筆記'}
                    </button>
                  </div>
                )}
              </li>
            ),
          )}
        </ol>
      </section>

      {selected && selectedToken && (
        // 詞卡蓋在畫面下方：留一段空白，最後幾句才捲得到詞卡上面。
        <div className="word-sheet-spacer" aria-hidden="true" />
      )}
      {selected && selectedToken && (
        <WordSheet
          token={selectedToken}
          onSaveReading={(reading) => saveReading(selected, reading)}
          onClose={() => setSelected(null)}
        >
          <WordDetails token={selectedToken} />
        </WordSheet>
      )}

      <section className="card">
        <h3>這首歌</h3>
        <div className="row">
          <a className="btn" href={songEditHash(song.id)}>
            編輯歌詞
          </a>
          {!confirmDelete ? (
            <button type="button" className="btn" onClick={() => setConfirmDelete(true)}>
              刪除
            </button>
          ) : (
            <>
              <button type="button" className="btn danger" onClick={onDelete}>
                確定刪除（筆記一起刪掉）
              </button>
              <button type="button" className="btn" onClick={() => setConfirmDelete(false)}>
                不要刪
              </button>
            </>
          )}
        </div>
      </section>
    </>
  );
}

function NoteEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial: string;
  onSave: (note: string) => void;
  onCancel: () => void;
}) {
  const [note, setNote] = useState(initial);
  const field = useRef<HTMLTextAreaElement>(null);
  // 使用者剛按了「寫筆記」，游標直接放進輸入框。
  useEffect(() => field.current?.focus(), []);
  return (
    <div className="song-note-editor">
      <textarea
        ref={field}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        aria-label="這句的筆記"
        placeholder="這句的意思、文法或心得"
      />
      <div className="row">
        <button type="button" className="btn primary" onClick={() => onSave(note)}>
          存筆記
        </button>
        <button type="button" className="btn" onClick={onCancel}>
          取消
        </button>
      </div>
    </div>
  );
}

function download(text: string, filename: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** 歌曲的匯出／匯入：換裝置或備份用。匯入是合併，同一首歌留較新的。 */
function SongsTransfer({ songs }: { songs: SongsState }) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const count = songs.doc.songs.length;

  const onExport = () => {
    try {
      const now = new Date();
      const filename = songsExportFilename(now);
      download(exportSongs(songs.doc, now.toISOString()), filename);
      setMessage({
        kind: 'ok',
        text: `已產生 ${filename}（${count} 首）。檔案裡有歌詞，請自己保管，不要公開分享。`,
      });
    } catch (error) {
      setMessage({
        kind: 'error',
        text: `匯出失敗：${error instanceof Error ? error.message : String(error)}`,
      });
    }
  };

  const onPick = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > MAX_SONGS_IMPORT_BYTES) {
      setMessage({ kind: 'error', text: '這個檔案太大，不像歌曲匯出檔，沒有匯入任何東西。' });
      return;
    }
    let text: string;
    try {
      text = await file.text();
    } catch {
      setMessage({ kind: 'error', text: '讀不到檔案內容，沒有匯入任何東西。' });
      return;
    }
    const result = parseSongsImport(text);
    if (!result.ok) {
      setMessage({ kind: 'error', text: result.message });
      return;
    }
    const { added, updated } = mergeSongs(songs.doc, result.songs);
    const saveError = songs.update((prev) => mergeSongs(prev, result.songs).doc);
    const skipped = result.dropped > 0 ? `另有 ${result.dropped} 首格式不正確，已略過。` : '';
    setMessage(
      saveError
        ? { kind: 'error', text: saveError }
        : {
            kind: 'ok',
            text:
              added + updated === 0
                ? `檔案裡的 ${result.songs.length} 首跟目前一樣或比較舊，沒有變動。${skipped}`
                : `已匯入：新增 ${added} 首、更新 ${updated} 首。${skipped}`,
          },
    );
  };

  return (
    <section className="card">
      <h3>歌曲備份</h3>
      <p className="muted">目前 {count} 首。匯出的檔案含歌詞與筆記，只供自己備份或搬到另一台裝置。</p>
      <div className="row">
        <button type="button" className="btn" onClick={onExport} disabled={count === 0}>
          匯出歌曲
        </button>
        <button type="button" className="btn" onClick={() => fileInput.current?.click()}>
          匯入歌曲
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={onPick}
        />
      </div>
      {message &&
        (message.kind === 'ok' ? (
          <output className="notice">{message.text}</output>
        ) : (
          <p className="error" role="alert">
            {message.text}
          </p>
        ))}
    </section>
  );
}
