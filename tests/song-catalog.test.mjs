import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SONG_CATALOG, catalogSong } from '../lib/song-catalog.mjs';

test('歌單固定兩首，id 不重複，查得到', () => {
  assert.equal(SONG_CATALOG.length, 2);
  assert.equal(new Set(SONG_CATALOG.map((s) => s.id)).size, 2);
  for (const song of SONG_CATALOG) assert.equal(catalogSong(song.id), song);
  assert.equal(catalogSong('nope'), undefined);
});

test('歌單只有歌名、出處與連結，不含歌詞', () => {
  for (const song of SONG_CATALOG) {
    assert.deepEqual(Object.keys(song).sort(), ['artist', 'from', 'id', 'lyricsLinks', 'title']);
    for (const link of song.lyricsLinks) {
      assert.match(link.url, /^https:\/\//);
      assert.ok(link.label.length > 0);
    }
  }
});
