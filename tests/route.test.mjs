import { test } from 'node:test';
import assert from 'node:assert/strict';
import { VIEWS, lessonHash, parseRoute, srsHash, viewHash } from '../lib/route.mjs';

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

test('單字卡兩區：#/srs 是複習區、#/srs/new 是新卡區', () => {
  assert.deepEqual(parseRoute(srsHash('review')), { view: 'srs' });
  assert.deepEqual(parseRoute(srsHash('new')), { view: 'srs', srsMode: 'new' });
  assert.equal(srsHash('review'), viewHash('srs'));
});
