import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  VIEWS,
  lessonHash,
  parseRoute,
  songEditHash,
  songHash,
  viewHash,
} from '../lib/route.mjs';

test('parseRoute：每個分頁的 hash 都能解回自己', () => {
  for (const view of VIEWS) {
    assert.deepEqual(parseRoute(viewHash(view)), { view });
  }
});

test('parseRoute：空 hash、未知 hash 一律回課程清單', () => {
  assert.deepEqual(parseRoute(''), { view: 'lessons' });
  assert.deepEqual(parseRoute('#'), { view: 'lessons' });
  assert.deepEqual(parseRoute('#/nope'), { view: 'lessons' });
  assert.deepEqual(parseRoute('#/srs/extra'), { view: 'lessons' });
});

test('lessonHash／parseRoute：課程 id 來回轉換，含需要編碼的字元', () => {
  for (const id of ['stage0-day1', 'stage2-quotes', '第 1 天/a?b#c']) {
    assert.deepEqual(parseRoute(lessonHash(id)), { view: 'lessons', lessonId: id });
  }
});

test('parseRoute：課程 id 為空或百分比編碼壞掉時退回課程清單', () => {
  assert.deepEqual(parseRoute('#/lesson/'), { view: 'lessons' });
  assert.deepEqual(parseRoute('#/lesson/%E0%A4%A'), { view: 'lessons' });
});

test('歌曲路由：清單、單首、編輯來回轉換，id 需要編碼也可以', () => {
  assert.deepEqual(parseRoute(viewHash('songs')), { view: 'songs' });
  // 歌曲固定兩首，沒有「新增歌曲」頁
  assert.deepEqual(parseRoute('#/songs/new'), { view: 'lessons' });
  for (const id of ['abc-123', '歌/1?#x', 'end/edit']) {
    assert.deepEqual(parseRoute(songHash(id)), { view: 'songs', songId: id });
    assert.deepEqual(parseRoute(songEditHash(id)), {
      view: 'songs',
      songId: id,
      mode: 'edit',
    });
  }
});

test('歌曲路由：id 為空或編碼壞掉時退回歌曲清單', () => {
  assert.deepEqual(parseRoute('#/song/'), { view: 'songs' });
  assert.deepEqual(parseRoute('#/song//edit'), { view: 'songs' });
  assert.deepEqual(parseRoute('#/song/%E0%A4%A'), { view: 'songs' });
});
