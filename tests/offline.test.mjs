import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stages } from '../curriculum/lessons.mjs';
import {
  AUDIO_CACHE_NAME,
  AUDIO_ROUTE_PATTERN,
  allAudioPaths,
  countCached,
  downloadAudio,
  downloadUrl,
  lessonAudioPaths,
} from '../lib/offline.mjs';

/** 假的快取：saveImpl 可以指定哪些路徑失敗、並記錄同時進行的最大數量。 */
function fakeStore({ cached = [], fail = {} } = {}) {
  const stored = new Set(cached);
  const state = { saved: [], active: 0, maxActive: 0 };
  return {
    state,
    stored,
    async has(path) {
      return stored.has(path);
    },
    async save(path) {
      state.active++;
      state.maxActive = Math.max(state.maxActive, state.active);
      await new Promise((resolve) => setTimeout(resolve, 1));
      state.active--;
      if (fail[path]) throw new Error(fail[path]);
      stored.add(path);
      state.saved.push(path);
    },
  };
}

const lesson = {
  vocab: [{ audio: 'a/v1.mp3' }, { audio: 'a/v2.mp3' }],
  grammar: [{ examples: [{ audio: 'a/g1.mp3' }, { audio: 'a/v1.mp3' }] }],
  dialogue: [{ audio: 'a/d1.mp3' }],
};

test('快取名稱要與 service worker 設定一致', () => {
  assert.equal(AUDIO_CACHE_NAME, 'lesson-audio-v3');
});

test('下載網址不符合 service worker 的音檔路由（才會繞過它的 CacheFirst），一般播放網址則符合', () => {
  const play =
    'https://example.com/nihongo-lab/audio/stage-0/day1/vocab-kuni.mp3';
  assert.ok(AUDIO_ROUTE_PATTERN.test(play));
  assert.ok(!AUDIO_ROUTE_PATTERN.test(downloadUrl(play)));
  assert.equal(downloadUrl(play), `${play}?offline-download=1`);
  // 已有查詢字串時用 & 接上，仍然不符合路由
  assert.ok(!AUDIO_ROUTE_PATTERN.test(downloadUrl(`${play}?v=2`)));
  assert.equal(downloadUrl(`${play}?v=2`), `${play}?v=2&offline-download=1`);
});

test('lessonAudioPaths 收齊單字、例句、對話、名句的音檔並去重', () => {
  assert.deepEqual(lessonAudioPaths(lesson), [
    'a/v1.mp3',
    'a/v2.mp3',
    'a/g1.mp3',
    'a/d1.mp3',
  ]);
  assert.deepEqual(
    lessonAudioPaths({ ...lesson, quotes: [{ audio: 'a/q1.mp3' }] }).at(-1),
    'a/q1.mp3',
  );
});

test('allAudioPaths 略過 audioReady 為 false 的課程；實際教材的路徑都是相對路徑', () => {
  const paths = allAudioPaths([
    {
      lessons: [
        lesson,
        {
          ...lesson,
          audioReady: false,
          dialogue: [{ audio: 'x/pending.mp3' }],
        },
      ],
    },
  ]);
  assert.ok(!paths.includes('x/pending.mp3'));
  assert.equal(paths.length, 4);

  const real = allAudioPaths(stages);
  assert.ok(real.length > 0);
  assert.ok(real.every((p) => p.endsWith('.mp3') && !p.startsWith('/')));
});

test('countCached 只算已在快取裡的', async () => {
  const store = fakeStore({ cached: ['a/v1.mp3', 'a/d1.mp3'] });
  assert.equal(await countCached(lessonAudioPaths(lesson), store), 2);
  assert.equal(await countCached([], store), 0);
});

test('downloadAudio 只抓還沒有的檔案，已存在的略過', async () => {
  const store = fakeStore({ cached: ['a/v1.mp3'] });
  const result = await downloadAudio(lessonAudioPaths(lesson), store);
  assert.deepEqual(
    {
      total: result.total,
      skipped: result.skipped,
      downloaded: result.downloaded,
    },
    { total: 4, skipped: 1, downloaded: 3 },
  );
  assert.deepEqual(result.failed, []);
  assert.ok(!store.state.saved.includes('a/v1.mp3'));
  assert.equal(await countCached(lessonAudioPaths(lesson), store), 4);
});

test('單一檔案失敗不影響其他檔案，失敗原因會回報；再跑一次只補失敗的', async () => {
  const store = fakeStore({ fail: { 'a/g1.mp3': 'HTTP 404' } });
  const first = await downloadAudio(lessonAudioPaths(lesson), store);
  assert.equal(first.downloaded, 3);
  assert.deepEqual(first.failed, [{ path: 'a/g1.mp3', message: 'HTTP 404' }]);

  const healed = fakeStore({ cached: [...store.stored] });
  const second = await downloadAudio(lessonAudioPaths(lesson), healed);
  assert.deepEqual(
    {
      skipped: second.skipped,
      downloaded: second.downloaded,
      failed: second.failed.length,
    },
    { skipped: 3, downloaded: 1, failed: 0 },
  );
});

test('downloadAudio 遵守同時下載上限，並依序回報進度', async () => {
  const paths = Array.from({ length: 10 }, (_, i) => `a/${i}.mp3`);
  const store = fakeStore();
  const seen = [];
  await downloadAudio(paths, store, {
    concurrency: 3,
    onProgress: (p) => seen.push(`${p.done}/${p.total}`),
  });
  assert.ok(store.state.maxActive <= 3);
  assert.equal(seen[0], '0/10');
  assert.equal(seen.at(-1), '10/10');
  assert.equal(seen.length, 11);
});

test('沒有要下載的東西時直接完成；中止訊號會停止後續下載', async () => {
  const store = fakeStore({ cached: ['a/v1.mp3'] });
  const none = await downloadAudio(['a/v1.mp3'], store);
  assert.equal(none.downloaded, 0);

  const controller = new AbortController();
  controller.abort();
  const aborted = await downloadAudio(['a/1.mp3', 'a/2.mp3'], fakeStore(), {
    signal: controller.signal,
  });
  assert.equal(aborted.downloaded, 0);
});
