import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clearAppCaches } from '../lib/clear-cache.mjs';

/** 假的 Cache Storage：deleteFails 裡的名稱刪除時丟錯。 */
function fakeCaches(names, deleteFails = []) {
  const alive = new Set(names);
  return {
    alive,
    async keys() {
      return [...alive];
    },
    async delete(name) {
      if (deleteFails.includes(name)) throw new Error('boom');
      return alive.delete(name);
    },
  };
}

function fakeServiceWorker(count, failAt = -1) {
  const unregistered = [];
  return {
    unregistered,
    async getRegistrations() {
      return Array.from({ length: count }, (_, i) => ({
        async unregister() {
          if (i === failAt) throw new Error('nope');
          unregistered.push(i);
          return true;
        },
      }));
    },
  };
}

test('clearAppCaches：刪光所有快取並取消所有 service worker 註冊', async () => {
  const caches = fakeCaches(['lesson-audio', 'workbox-precache-v2', 'fonts']);
  const serviceWorker = fakeServiceWorker(2);
  const result = await clearAppCaches({ caches, serviceWorker });
  assert.deepEqual(result, {
    cachesDeleted: 3,
    workersUnregistered: 2,
    failed: [],
  });
  assert.equal(caches.alive.size, 0);
  assert.deepEqual(serviceWorker.unregistered, [0, 1]);
});

test('clearAppCaches：沒有快取與註冊時回傳 0，不算失敗', async () => {
  const result = await clearAppCaches({
    caches: fakeCaches([]),
    serviceWorker: fakeServiceWorker(0),
  });
  assert.deepEqual(result, {
    cachesDeleted: 0,
    workersUnregistered: 0,
    failed: [],
  });
});

test('clearAppCaches：環境不支援（沒有 caches／serviceWorker）視為沒東西可清', async () => {
  assert.deepEqual(await clearAppCaches({}), {
    cachesDeleted: 0,
    workersUnregistered: 0,
    failed: [],
  });
});

test('clearAppCaches：單一項目失敗不中斷其他項目，失敗原因列在結果裡', async () => {
  const caches = fakeCaches(['a', 'bad', 'c'], ['bad']);
  const serviceWorker = fakeServiceWorker(3, 1);
  const result = await clearAppCaches({ caches, serviceWorker });
  assert.equal(result.cachesDeleted, 2);
  assert.equal(result.workersUnregistered, 2);
  assert.deepEqual(result.failed, ['快取 bad：boom', 'service worker：nope']);
  assert.deepEqual([...caches.alive], ['bad']);
});

test('clearAppCaches：列舉快取本身丟錯時不丟出例外，仍會繼續清 service worker', async () => {
  const caches = {
    async keys() {
      throw new Error('denied');
    },
    async delete() {
      return true;
    },
  };
  const serviceWorker = fakeServiceWorker(1);
  const result = await clearAppCaches({ caches, serviceWorker });
  assert.deepEqual(result.failed, ['快取：denied']);
  assert.equal(result.workersUnregistered, 1);
});
