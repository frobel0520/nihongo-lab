import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  emptyProgress,
  recordDictation,
  recordReview,
} from '../lib/progress.mjs';
import {
  BACKUP_KEY,
  PROGRESS_KEY,
  adoptExternalProgress,
  loadProgress,
  saveProgress,
  updateProgress,
} from '../lib/progress-store.mjs';

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

const TODAY = '2026-09-30';
const NOW = '2026-09-30T01:00:00.000Z';
const withCard = (id) => recordReview(emptyProgress(), id, 'good', TODAY, NOW);
const stored = (progress) => JSON.stringify(progress);

test('loadProgress：沒存過就是空進度、沒有警告', () => {
  const result = loadProgress(fakeStorage());
  assert.deepEqual(result.progress, emptyProgress());
  assert.equal(result.warning, null);
});

test('loadProgress：儲存空間不可用（null 或讀取丟錯）時回空進度並警告', () => {
  for (const storage of [null, fakeStorage({}, { failGet: true })]) {
    const result = loadProgress(storage);
    assert.deepEqual(result.progress, emptyProgress());
    assert.match(result.warning, /無法讀取瀏覽器儲存空間/);
  }
});

test('loadProgress：存檔損毀或版本未知時備份原文並警告', () => {
  for (const [raw, pattern] of [
    ['{壞掉', /損毀/],
    [JSON.stringify({ version: 99, srs: {}, dictation: {} }), /較新的版本/],
  ]) {
    const storage = fakeStorage({ [PROGRESS_KEY]: raw });
    const result = loadProgress(storage);
    assert.deepEqual(result.progress, emptyProgress());
    assert.match(result.warning, pattern);
    assert.equal(storage.data.get(BACKUP_KEY), raw);
  }
});

test('loadProgress：單筆格式不對只略過那一筆，原文也會備份（否則下次存檔就永遠丟了）', () => {
  const good = withCard('l:a');
  const raw = JSON.stringify({
    ...good,
    srs: { ...good.srs, 'l:bad': { ease: 'x' } },
  });
  const storage = fakeStorage({ [PROGRESS_KEY]: raw });
  const result = loadProgress(storage);
  assert.deepEqual(Object.keys(result.progress.srs), ['l:a']);
  assert.match(result.warning, /1 筆進度格式不正確/);
  assert.match(result.warning, /備份/);
  assert.equal(storage.data.get(BACKUP_KEY), raw);
});

test('loadProgress：備份本身寫不進去時，警告要明說', () => {
  const storage = fakeStorage({ [PROGRESS_KEY]: '{壞掉' }, { failSet: true });
  assert.match(loadProgress(storage).warning, /無法備份/);
});

test('saveProgress：成功回 null，寫入失敗或沒有儲存空間回訊息', () => {
  const storage = fakeStorage();
  assert.equal(saveProgress(storage, withCard('l:a')), null);
  assert.ok(storage.data.has(PROGRESS_KEY));
  assert.match(
    saveProgress(fakeStorage({}, { failSet: true }), emptyProgress()),
    /無法儲存進度/,
  );
  assert.match(saveProgress(null, emptyProgress()), /無法儲存進度/);
});

test('updateProgress：兩個分頁各改不同的卡，後存的不會蓋掉先存的', () => {
  const storage = fakeStorage();
  // 分頁 A 與 B 一開始都載入了空進度
  const tabAMemory = emptyProgress();
  const tabBMemory = emptyProgress();

  const b = updateProgress(storage, tabBMemory, (prev) =>
    recordReview(prev, 'l:b', 'good', TODAY, NOW),
  );
  assert.equal(b.saveError, null);

  // 分頁 A 的記憶體裡沒有 l:b，但更新時會先重讀儲存空間
  const a = updateProgress(storage, tabAMemory, (prev) =>
    recordReview(prev, 'l:a', 'good', TODAY, NOW),
  );
  assert.deepEqual(Object.keys(a.progress.srs).sort(), ['l:a', 'l:b']);
  assert.deepEqual(
    Object.keys(JSON.parse(storage.data.get(PROGRESS_KEY)).srs).sort(),
    ['l:a', 'l:b'],
  );
});

test('updateProgress：聽寫進度同樣不會被另一個分頁蓋掉', () => {
  const storage = fakeStorage({
    [PROGRESS_KEY]: stored(
      recordDictation(emptyProgress(), 'a.mp3', true, '2026-09-30T00:00:00Z'),
    ),
  });
  const result = updateProgress(storage, emptyProgress(), (prev) =>
    recordDictation(prev, 'b.mp3', false, '2026-09-30T00:01:00Z'),
  );
  assert.deepEqual(Object.keys(result.progress.dictation).sort(), [
    'a.mp3',
    'b.mp3',
  ]);
  assert.equal(result.progress.dictation['a.mp3'].passed, true);
});

test('updateProgress：讀不到最新進度（讀取丟錯、損毀、還沒存過）就用這個分頁記憶體裡的', () => {
  const memory = withCard('l:mem');
  const change = (prev) => ({
    ...prev,
    dictation: { 'x.mp3': { attempts: 1, passed: true, lastAt: 't' } },
  });

  for (const storage of [
    fakeStorage({}, { failGet: true }),
    fakeStorage({ [PROGRESS_KEY]: '{壞掉' }),
    fakeStorage(),
    null,
  ]) {
    const result = updateProgress(storage, memory, change);
    assert.deepEqual(Object.keys(result.progress.srs), ['l:mem']);
    assert.equal(result.progress.dictation['x.mp3'].passed, true);
  }
});

test('updateProgress：寫入失敗時仍回傳套用後的進度（畫面照常運作），並回報錯誤', () => {
  const storage = fakeStorage({}, { failSet: true });
  const result = updateProgress(storage, emptyProgress(), () =>
    withCard('l:a'),
  );
  assert.deepEqual(Object.keys(result.progress.srs), ['l:a']);
  assert.match(result.saveError, /無法儲存進度/);
});

test('adoptExternalProgress：採用另一個分頁寫入的有效進度，壞資料或刪除則忽略', () => {
  const external = withCard('l:x');
  assert.deepEqual(adoptExternalProgress(stored(external)), external);
  assert.equal(adoptExternalProgress('{壞掉'), null);
  assert.equal(adoptExternalProgress(JSON.stringify({ version: 99 })), null);
  assert.equal(adoptExternalProgress(null), null);
});
