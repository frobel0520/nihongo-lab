/**
 * 歌曲閱讀器的資料（純邏輯）。歌詞由使用者自己貼上、只存在使用者的瀏覽器，這裡不含任何歌詞內容。
 * 時間與 id 由呼叫端注入，方便測試。
 *
 * @typedef {{
 *   s: string,
 *   r?: string,
 *   b?: string,
 *   p: string,
 *   pd?: string,
 *   cf?: string,
 *   o?: string,
 * }} Token
 *   s 表層形、r 讀音（平假名，只在含漢字時存）、b 原形、p 詞性、pd 詞性細分類 1、
 *   cf 活用形、o 使用者改過的讀音。
 * @typedef {{ text: string, note: string, tokens: Token[] | null }} SongLine
 *   text 為空字串代表段落之間的空行；tokens 為 null 代表還沒分析。
 * @typedef {{ analyzer: string, analyzedAt: string }} SongAnalysis
 * @typedef {{
 *   id: string,
 *   title: string,
 *   artist: string,
 *   createdAt: string,
 *   updatedAt: string,
 *   lines: SongLine[],
 *   analysis: SongAnalysis | null,
 * }} Song
 * @typedef {{ version: 1, songs: Song[] }} SongsDoc
 * @typedef {{ title: string, artist: string, lyrics: string }} SongInput
 * @typedef {{ ok: true, song: Song } | { ok: false, message: string }} SongResult
 */

export const SONGS_VERSION = 1;
/** 一首歌最多幾行；遠超過一般歌詞，只是擋掉誤貼整本書。 */
export const MAX_LINES = 400;
export const MAX_TITLE_LENGTH = 100;

/** @returns {SongsDoc} */
export const emptySongs = () => ({ version: SONGS_VERSION, songs: [] });

/**
 * 貼上的歌詞拆成逐行。行尾空白去掉；連續空行只留一行（當段落分隔）；開頭與結尾的空行去掉。
 *
 * @param {string} lyrics
 * @returns {string[]}
 */
export function splitLyrics(lyrics) {
  /** @type {string[]} */
  const lines = [];
  for (const raw of lyrics.replace(/\r\n?/g, '\n').split('\n')) {
    const text = raw.trim();
    if (text === '' && (lines.length === 0 || lines[lines.length - 1] === '')) {
      continue;
    }
    lines.push(text);
  }
  while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
  return lines;
}

/** 歌曲轉回貼上時的文字（編輯畫面用）。 @param {Song} song */
export const lyricsText = (song) => song.lines.map((l) => l.text).join('\n');

/**
 * 檢查輸入；有問題回傳給使用者看的訊息，沒問題回傳整理過的值。
 *
 * @param {SongInput} input
 * @returns {{ ok: true, title: string, artist: string, lines: string[] } | { ok: false, message: string }}
 */
function validateInput(input) {
  const title = input.title.trim();
  const artist = input.artist.trim();
  if (title === '') return { ok: false, message: '請輸入歌名。' };
  if (title.length > MAX_TITLE_LENGTH || artist.length > MAX_TITLE_LENGTH) {
    return { ok: false, message: `歌名與歌手各最多 ${MAX_TITLE_LENGTH} 個字。` };
  }
  const lines = splitLyrics(input.lyrics);
  if (!lines.some((l) => l !== '')) {
    return { ok: false, message: '請貼上歌詞（至少一行）。' };
  }
  if (lines.length > MAX_LINES) {
    return {
      ok: false,
      message: `歌詞有 ${lines.length} 行，超過上限 ${MAX_LINES} 行；請只貼一首歌。`,
    };
  }
  return { ok: true, title, artist, lines };
}

/**
 * @param {SongInput} input
 * @param {{ id: string, now: string }} meta
 * @returns {SongResult}
 */
export function createSong(input, { id, now }) {
  const checked = validateInput(input);
  if (!checked.ok) return checked;
  return {
    ok: true,
    song: {
      id,
      title: checked.title,
      artist: checked.artist,
      createdAt: now,
      updatedAt: now,
      lines: checked.lines.map((text) => ({ text, note: '', tokens: null })),
      analysis: null,
    },
  };
}

/**
 * 編輯歌名、歌手、歌詞。沒改到的行保留筆記與分析結果（同一句出現多次時依序對應）；
 * 新增或改過的行要重新分析。
 *
 * @param {Song} song
 * @param {SongInput} input
 * @param {string} now
 * @returns {SongResult}
 */
export function editSong(song, input, now) {
  const checked = validateInput(input);
  if (!checked.ok) return checked;
  /** @type {Map<string, SongLine[]>} */
  const previous = new Map();
  for (const line of song.lines) {
    const queue = previous.get(line.text) ?? [];
    queue.push(line);
    previous.set(line.text, queue);
  }
  const lines = checked.lines.map((text) => {
    const kept = previous.get(text)?.shift();
    return kept ? { ...kept } : { text, note: '', tokens: null };
  });
  return {
    ok: true,
    song: {
      ...song,
      title: checked.title,
      artist: checked.artist,
      updatedAt: now,
      lines,
    },
  };
}

/**
 * @param {Song} song
 * @param {number} index
 * @param {string} note
 * @param {string} now
 * @returns {Song}
 */
export function setLineNote(song, index, note, now) {
  if (!song.lines[index]) throw new RangeError(`沒有第 ${index} 行`);
  const lines = song.lines.map((line, i) =>
    i === index ? { ...line, note: note.trim() } : line,
  );
  return { ...song, lines, updatedAt: now };
}

/** 還有沒分析的非空行。 @param {Song} song */
export const needsAnalysis = (song) =>
  song.lines.some((line) => line.text !== '' && line.tokens === null);

/** 非空行的數量。 @param {Song} song */
export const lineCount = (song) =>
  song.lines.filter((line) => line.text !== '').length;

/** @param {Song[]} songs */
export const sortSongs = (songs) =>
  [...songs].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

/** @param {SongsDoc} doc @param {Song} song @returns {SongsDoc} */
export const upsertSong = (doc, song) => ({
  ...doc,
  songs: [...doc.songs.filter((s) => s.id !== song.id), song],
});

/** @param {SongsDoc} doc @param {string} id @returns {SongsDoc} */
export const removeSong = (doc, id) => ({
  ...doc,
  songs: doc.songs.filter((s) => s.id !== id),
});

// ---- 解析與驗證（存檔與匯入檔都會經過這裡；資料來自瀏覽器或檔案，不信任） ----

/** @param {unknown} value @returns {value is Record<string, unknown>} */
const isObject = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** @param {unknown} value */
const isString = (value) => typeof value === 'string';

/** @param {unknown} value */
const optionalString = (value) => value === undefined || isString(value);

const ISO_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
/** @param {unknown} value */
const isTime = (value) => isString(value) && ISO_TIME.test(/** @type {string} */ (value));

/** @param {unknown} value @returns {value is Token} */
function isToken(value) {
  if (!isObject(value)) return false;
  return (
    isString(value.s) &&
    value.s !== '' &&
    isString(value.p) &&
    ['r', 'b', 'pd', 'cf', 'o'].every((key) => optionalString(value[key]))
  );
}

/** @param {unknown} value @returns {value is SongLine} */
function isLine(value) {
  if (!isObject(value)) return false;
  return (
    isString(value.text) &&
    isString(value.note) &&
    (value.tokens === null ||
      (Array.isArray(value.tokens) && value.tokens.every(isToken)))
  );
}

/** @param {unknown} value @returns {value is Song} */
export function isSong(value) {
  if (!isObject(value)) return false;
  const analysis = value.analysis;
  return (
    isString(value.id) &&
    value.id !== '' &&
    isString(value.title) &&
    value.title.trim() !== '' &&
    isString(value.artist) &&
    isTime(value.createdAt) &&
    isTime(value.updatedAt) &&
    Array.isArray(value.lines) &&
    value.lines.length <= MAX_LINES &&
    value.lines.every(isLine) &&
    (analysis === null ||
      (isObject(analysis) &&
        isString(analysis.analyzer) &&
        isTime(analysis.analyzedAt)))
  );
}

/**
 * 解析存檔。problem：'corrupt'（不是 JSON 或外層形狀不對）、'version'（來自較新的版本）；
 * 單首歌格式不對就略過並計入 dropped，其他歌照常使用。
 *
 * @param {string | null} raw
 * @returns {{ doc: SongsDoc, problem: 'corrupt' | 'version' | null, dropped: number }}
 */
export function parseSongs(raw) {
  if (raw === null) return { doc: emptySongs(), problem: null, dropped: 0 };
  /** @type {unknown} */
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return { doc: emptySongs(), problem: 'corrupt', dropped: 0 };
  }
  if (!isObject(data) || typeof data.version !== 'number') {
    return { doc: emptySongs(), problem: 'corrupt', dropped: 0 };
  }
  if (data.version !== SONGS_VERSION) {
    return { doc: emptySongs(), problem: 'version', dropped: 0 };
  }
  if (!Array.isArray(data.songs)) {
    return { doc: emptySongs(), problem: 'corrupt', dropped: 0 };
  }
  const songs = data.songs.filter(isSong);
  const unique = [...new Map(songs.map((s) => [s.id, s])).values()];
  return {
    doc: { version: SONGS_VERSION, songs: unique },
    problem: null,
    dropped: data.songs.length - unique.length,
  };
}

/** @param {SongsDoc} doc */
export const serializeSongs = (doc) => JSON.stringify(doc);

// ---- 匯出／匯入 ----

export const EXPORT_KIND = 'kana-nihongo-songs';
/** 匯入檔大小上限：一首歌含分析結果約數十 KB，5MB 足夠且擋掉選錯的大檔。 */
export const MAX_SONGS_IMPORT_BYTES = 5 * 1024 * 1024;

/** @param {Date} now */
export const songsExportFilename = (now) =>
  `kana-songs-${now.toISOString().slice(0, 10)}.json`;

/** @param {SongsDoc} doc @param {string} now */
export const exportSongs = (doc, now) =>
  JSON.stringify(
    { kind: EXPORT_KIND, version: SONGS_VERSION, exportedAt: now, songs: doc.songs },
    null,
    1,
  );

/**
 * @param {string} text
 * @returns {{ ok: true, songs: Song[], dropped: number } | { ok: false, message: string }}
 */
export function parseSongsImport(text) {
  /** @type {unknown} */
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, message: '這不是 JSON 檔，沒有匯入任何東西。' };
  }
  if (!isObject(data) || data.kind !== EXPORT_KIND) {
    return {
      ok: false,
      message: '這不是歌曲的匯出檔（學習進度要到設定頁匯入），沒有匯入任何東西。',
    };
  }
  if (data.version !== SONGS_VERSION) {
    return {
      ok: false,
      message: '這個檔案來自較新的版本，請先更新 App 再匯入。',
    };
  }
  if (!Array.isArray(data.songs)) {
    return { ok: false, message: '檔案內容不完整，沒有匯入任何東西。' };
  }
  const songs = data.songs.filter(isSong);
  return { ok: true, songs, dropped: data.songs.length - songs.length };
}

/**
 * 匯入的歌與現有的合併：同一個 id 留 updatedAt 較新的，沒有的就加進來。
 *
 * @param {SongsDoc} doc
 * @param {Song[]} incoming
 * @returns {{ doc: SongsDoc, added: number, updated: number }}
 */
export function mergeSongs(doc, incoming) {
  const byId = new Map(doc.songs.map((s) => [s.id, s]));
  let added = 0;
  let updated = 0;
  for (const song of incoming) {
    const current = byId.get(song.id);
    if (!current) {
      byId.set(song.id, song);
      added++;
    } else if (song.updatedAt > current.updatedAt) {
      byId.set(song.id, song);
      updated++;
    }
  }
  return { doc: { ...doc, songs: [...byId.values()] }, added, updated };
}
