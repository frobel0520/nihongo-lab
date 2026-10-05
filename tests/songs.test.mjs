import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  EXPORT_KIND,
  MAX_LINES,
  createSong,
  editSong,
  emptySongs,
  exportSongs,
  lineCount,
  lyricsText,
  mergeSongs,
  needsAnalysis,
  parseSongs,
  parseSongsImport,
  removeSong,
  serializeSongs,
  setLineNote,
  sortSongs,
  splitLyrics,
  upsertSong,
} from '../lib/songs.mjs';
import {
  SONGS_BACKUP_KEY,
  SONGS_KEY,
  adoptExternalSongs,
  loadSongs,
  saveSongs,
  updateSongs,
} from '../lib/songs-store.mjs';

// 測試用的句子都是自行撰寫的原創例句，不是任何歌曲的歌詞。
const LYRICS = '朝の駅で君を待つ\n  雨が少し降っている  \n\n\n\n空を見上げて歩こう\n朝の駅で君を待つ\n';
const NOW = '2026-10-05T01:00:00.000Z';
const LATER = '2026-10-05T02:00:00.000Z';

const make = (overrides = {}, meta = { id: 'song-1', now: NOW }) => {
  const result = createSong(
    { title: '練習曲', artist: '', lyrics: LYRICS, ...overrides },
    meta,
  );
  assert.equal(result.ok, true);
  return result.song;
};

test('splitLyrics：去掉行首尾空白、連續空行只留一行、去掉頭尾空行、相容 CRLF', () => {
  assert.deepEqual(splitLyrics('\n\n一行目\r\n\r\n\r\n二行目  \r\n\n'), [
    '一行目',
    '',
    '二行目',
  ]);
  assert.deepEqual(splitLyrics(LYRICS), [
    '朝の駅で君を待つ',
    '雨が少し降っている',
    '',
    '空を見上げて歩こう',
    '朝の駅で君を待つ',
  ]);
});

test('createSong：整理歌名與歌詞，每行空筆記、尚未分析', () => {
  const song = make({ title: '  練習曲  ', artist: ' 自作 ' });
  assert.equal(song.title, '練習曲');
  assert.equal(song.artist, '自作');
  assert.equal(song.lines.length, 5);
  assert.deepEqual(song.lines[0], { text: '朝の駅で君を待つ', note: '', tokens: null });
  assert.equal(song.analysis, null);
  assert.equal(needsAnalysis(song), true);
  assert.equal(lineCount(song), 4);
  assert.equal(lyricsText(song), splitLyrics(LYRICS).join('\n'));
});

test('createSong：歌名空白、歌詞空白、行數過多都回傳明確訊息', () => {
  const meta = { id: 'x', now: NOW };
  const noTitle = createSong({ title: '  ', artist: '', lyrics: '一行' }, meta);
  assert.deepEqual(noTitle, { ok: false, message: '請輸入歌名。' });
  const noLyrics = createSong({ title: 'a', artist: '', lyrics: ' \n \n' }, meta);
  assert.equal(noLyrics.ok, false);
  const tooMany = createSong(
    { title: 'a', artist: '', lyrics: Array(MAX_LINES + 1).fill('行').join('\n') },
    meta,
  );
  assert.equal(tooMany.ok, false);
  assert.match(tooMany.ok ? '' : tooMany.message, /超過上限/);
});

test('editSong：沒改的行保留筆記與分析，重複的句子依序對應，新行要重新分析', () => {
  const tokens = [{ s: '朝', r: 'あさ', p: '名詞' }];
  let song = make();
  song = {
    ...song,
    lines: song.lines.map((line, i) =>
      i === 0
        ? { ...line, note: '第一次', tokens }
        : i === 4
          ? { ...line, note: '第二次', tokens }
          : line,
    ),
  };
  const result = editSong(
    song,
    { title: '練習曲', artist: '', lyrics: '朝の駅で君を待つ\n新しい行\n朝の駅で君を待つ' },
    LATER,
  );
  assert.equal(result.ok, true);
  const edited = result.ok ? result.song : song;
  assert.deepEqual(
    edited.lines.map((l) => [l.text, l.note, l.tokens === null]),
    [
      ['朝の駅で君を待つ', '第一次', false],
      ['新しい行', '', true],
      ['朝の駅で君を待つ', '第二次', false],
    ],
  );
  assert.equal(edited.updatedAt, LATER);
  assert.equal(edited.createdAt, NOW);
});

test('setLineNote：去掉頭尾空白並更新時間；不存在的行丟錯', () => {
  const song = setLineNote(make(), 1, '  下雨的意思 ', LATER);
  assert.equal(song.lines[1].note, '下雨的意思');
  assert.equal(song.updatedAt, LATER);
  assert.throws(() => setLineNote(song, 99, 'x', LATER), RangeError);
});

test('upsertSong／removeSong／sortSongs：依 id 取代、刪除，最新修改的排前面', () => {
  const a = make({}, { id: 'a', now: NOW });
  const b = make({}, { id: 'b', now: LATER });
  let doc = upsertSong(upsertSong(emptySongs(), a), b);
  doc = upsertSong(doc, { ...a, title: '改名' });
  assert.equal(doc.songs.length, 2);
  assert.deepEqual(sortSongs(doc.songs).map((s) => s.id), ['b', 'a']);
  assert.deepEqual(removeSong(doc, 'b').songs.map((s) => s.title), ['改名']);
});

test('parseSongs：正常、損毀、版本較新、單首格式不對與重複 id', () => {
  const song = make();
  const doc = upsertSong(emptySongs(), song);
  assert.deepEqual(parseSongs(serializeSongs(doc)), { doc, problem: null, dropped: 0 });
  assert.equal(parseSongs('{oops').problem, 'corrupt');
  assert.equal(parseSongs('[]').problem, 'corrupt');
  assert.equal(parseSongs(JSON.stringify({ version: 2, songs: [] })).problem, 'version');
  const mixed = parseSongs(
    JSON.stringify({
      version: 1,
      songs: [song, { ...song }, { ...song, id: 'bad', createdAt: 'yesterday' }, 42],
    }),
  );
  assert.equal(mixed.problem, null);
  assert.equal(mixed.doc.songs.length, 1);
  assert.equal(mixed.dropped, 3);
});

test('parseSongs：token 格式不對的歌會被略過', () => {
  const song = make();
  const broken = {
    ...song,
    lines: [{ text: '朝', note: '', tokens: [{ s: '', p: '名詞' }] }],
  };
  const parsed = parseSongs(JSON.stringify({ version: 1, songs: [broken] }));
  assert.equal(parsed.doc.songs.length, 0);
  assert.equal(parsed.dropped, 1);
});

test('匯出／匯入：往返一致；不是歌曲檔、版本較新、壞 JSON 都拒絕', () => {
  const doc = upsertSong(emptySongs(), make());
  const parsed = parseSongsImport(exportSongs(doc, LATER));
  assert.deepEqual(parsed, { ok: true, songs: doc.songs, dropped: 0 });
  assert.equal(parseSongsImport('nope').ok, false);
  assert.equal(parseSongsImport(JSON.stringify({ version: 2, srs: {} })).ok, false);
  const newer = parseSongsImport(
    JSON.stringify({ kind: EXPORT_KIND, version: 2, songs: [] }),
  );
  assert.equal(newer.ok, false);
  assert.match(newer.ok ? '' : newer.message, /較新的版本/);
});

test('mergeSongs：新的加入、較新的取代、較舊的不蓋掉', () => {
  const a = make({}, { id: 'a', now: LATER });
  const b = make({}, { id: 'b', now: NOW });
  const doc = upsertSong(upsertSong(emptySongs(), a), b);
  const incoming = [
    { ...a, title: '舊版', updatedAt: NOW },
    { ...b, title: '新版', updatedAt: LATER },
    make({}, { id: 'c', now: NOW }),
  ];
  const merged = mergeSongs(doc, incoming);
  assert.equal(merged.added, 1);
  assert.equal(merged.updated, 1);
  const byId = Object.fromEntries(merged.doc.songs.map((s) => [s.id, s.title]));
  assert.deepEqual(byId, { a: '練習曲', b: '新版', c: '練習曲' });
});

/** 假的儲存空間：可指定讀或寫會丟錯。 */
function fakeStorage(initial = {}, { failGet = false, failSet = false } = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem(key) {
      if (failGet) throw new Error('blocked');
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      if (failSet) throw new Error('quota');
      data.set(key, value);
    },
  };
}

test('loadSongs：沒存過是空的；讀不到、損毀時提示並備份原文', () => {
  assert.deepEqual(loadSongs(fakeStorage()), { doc: emptySongs(), warning: null });
  assert.match(loadSongs(fakeStorage({}, { failGet: true })).warning ?? '', /無法讀取/);
  const storage = fakeStorage({ [SONGS_KEY]: '{broken' });
  const result = loadSongs(storage);
  assert.deepEqual(result.doc, emptySongs());
  assert.match(result.warning ?? '', /損毀/);
  assert.equal(storage.data.get(SONGS_BACKUP_KEY), '{broken');
});

test('saveSongs／updateSongs：寫入失敗回傳訊息；更新前重讀另一個分頁剛存的內容', () => {
  const failing = fakeStorage({}, { failSet: true });
  assert.match(saveSongs(failing, emptySongs()) ?? '', /無法儲存歌曲/);

  const storage = fakeStorage();
  const fromOtherTab = upsertSong(emptySongs(), make({}, { id: 'other', now: NOW }));
  storage.data.set(SONGS_KEY, serializeSongs(fromOtherTab));
  const mine = make({}, { id: 'mine', now: LATER });
  const result = updateSongs(storage, emptySongs(), (prev) => upsertSong(prev, mine));
  assert.equal(result.saveError, null);
  assert.deepEqual(result.doc.songs.map((s) => s.id).sort(), ['mine', 'other']);
  assert.deepEqual(parseSongs(storage.data.get(SONGS_KEY)).doc, result.doc);
});

test('adoptExternalSongs：格式正確才採用', () => {
  const doc = upsertSong(emptySongs(), make());
  assert.deepEqual(adoptExternalSongs(serializeSongs(doc)), doc);
  assert.equal(adoptExternalSongs('{bad'), null);
  assert.equal(adoptExternalSongs(null), null);
});
