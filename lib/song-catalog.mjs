/**
 * 歌曲區固定的兩首歌（使用者 2026-10-05 指定）。這裡只有歌名、出處與歌詞網站連結，沒有歌詞：
 * 歌詞受著作權保護，由使用者自己從歌詞網站複製、貼進 App，只存在使用者的瀏覽器（見 docs/song-reader.md）。
 *
 * @typedef {{ label: string, url: string }} LyricsLink
 * @typedef {{
 *   id: string,
 *   title: string,
 *   artist: string,
 *   from: string,
 *   lyricsLinks: LyricsLink[],
 * }} CatalogSong
 *   artist 沒查證過就留空字串，不猜。
 */

/** @type {readonly CatalogSong[]} */
export const SONG_CATALOG = [
  {
    id: 'gekkouka',
    title: '月光花',
    artist: 'Janne Da Arc',
    from: '動畫《ブラック・ジャック》（怪醫黑傑克）片頭曲',
    lyricsLinks: [
      { label: 'J-Lyric.net', url: 'https://j-lyric.net/artist/a000725/l00369a.html' },
      { label: 'UtaTen（附假名）', url: 'https://utaten.com/lyric/ja00011847/' },
    ],
  },
  {
    id: 'get-over',
    title: 'GET OVER',
    artist: '',
    from: '動畫《ヒカルの碁》（棋靈王）主題曲',
    lyricsLinks: [],
  },
];

/** @param {string} id */
export const catalogSong = (id) => SONG_CATALOG.find((song) => song.id === id);
