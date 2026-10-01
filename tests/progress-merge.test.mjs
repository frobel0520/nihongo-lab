import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeProgress } from '../lib/progress-merge.mjs';
import { emptyProgress } from '../lib/progress.mjs';

const card = (updatedAt, over = {}) => ({
  ease: 2.5,
  interval: 1,
  reps: 1,
  lapses: 0,
  due: '2026-10-01',
  firstSeen: '2026-09-30',
  updatedAt,
  ...over,
});
const withCards = (srs, dictation = {}) => ({ ...emptyProgress(), srs, dictation });
const rec = (attempts, passed, lastAt) => ({ attempts, passed, lastAt });

test('只有一邊有的卡與聽寫都保留（聯集），changes 只算相對 local 新增的', () => {
  const local = withCards({ a: card('2026-09-30T01:00:00.000Z') }, { 'x.mp3': rec(1, true, 't1') });
  const incoming = withCards({ b: card('2026-09-30T02:00:00.000Z') }, { 'y.mp3': rec(2, false, 't2') });
  const { progress, changes } = mergeProgress(local, incoming);
  assert.deepEqual(Object.keys(progress.srs).sort(), ['a', 'b']);
  assert.deepEqual(Object.keys(progress.dictation).sort(), ['x.mp3', 'y.mp3']);
  assert.deepEqual(changes, { srs: 1, dictation: 1 });
});

test('同一張卡兩邊都有：updatedAt 較晚的整張取代，不會欄位混搭', () => {
  const older = card('2026-09-30T01:00:00.000Z', { reps: 5, interval: 20, due: '2026-10-20' });
  const newer = card('2026-09-30T09:00:00.000Z', { reps: 0, interval: 0, lapses: 1, due: '2026-09-30' });

  const a = mergeProgress(withCards({ c: older }), withCards({ c: newer }));
  assert.deepEqual(a.progress.srs.c, newer);
  assert.deepEqual(a.changes, { srs: 1, dictation: 0 });

  // 反過來：local 較新，incoming 的舊紀錄不蓋掉它，也不算變動
  const b = mergeProgress(withCards({ c: newer }), withCards({ c: older }));
  assert.deepEqual(b.progress.srs.c, newer);
  assert.deepEqual(b.changes, { srs: 0, dictation: 0 });
});

test('聽寫：通過過就算通過、次數取較大、最後時間取較晚（兩邊的答錯不會洗掉另一邊的通過）', () => {
  const local = withCards({}, { s: rec(3, true, '2026-09-30T01:00:00.000Z') });
  const incoming = withCards({}, { s: rec(5, false, '2026-09-30T09:00:00.000Z') });
  const { progress, changes } = mergeProgress(local, incoming);
  assert.deepEqual(progress.dictation.s, rec(5, true, '2026-09-30T09:00:00.000Z'));
  assert.deepEqual(changes, { srs: 0, dictation: 1 });
});

test('合併自己、合併已經包含的內容，changes 為 0', () => {
  const p = withCards({ a: card('2026-09-30T01:00:00.000Z') }, { s: rec(1, true, 't') });
  assert.deepEqual(mergeProgress(p, p).changes, { srs: 0, dictation: 0 });
  assert.deepEqual(mergeProgress(p, p).progress, p);
  const once = mergeProgress(p, withCards({ b: card('2026-09-30T02:00:00.000Z') })).progress;
  assert.deepEqual(mergeProgress(once, once).progress, once);
});

test('不修改傳入的進度（回傳新物件）', () => {
  const local = withCards({ a: card('2026-09-30T01:00:00.000Z') });
  const incoming = withCards({ b: card('2026-09-30T02:00:00.000Z') });
  const before = JSON.stringify([local, incoming]);
  mergeProgress(local, incoming);
  assert.equal(JSON.stringify([local, incoming]), before);
});

test('updatedAt 完全相同時結果與傳入順序無關', () => {
  const same = '2026-09-30T01:00:00.000Z';
  const x = withCards({ c: card(same, { reps: 2, interval: 3 }) }, { s: rec(2, false, 't') });
  const y = withCards({ c: card(same, { reps: 4, interval: 9 }) }, { s: rec(2, false, 't') });
  assert.deepEqual(mergeProgress(x, y).progress, mergeProgress(y, x).progress);
});

/** 固定種子的亂數，隨機測試失敗時可以重現。 */
function lcg(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function randomProgress(rand) {
  const progress = emptyProgress();
  for (const id of ['a', 'b', 'c', 'd', 'e']) {
    if (rand() < 0.6) {
      const minute = Math.floor(rand() * 4); // 故意讓時間常常撞在一起
      progress.srs[id] = card(`2026-09-30T00:0${minute}:00.000Z`, {
        reps: Math.floor(rand() * 4),
        interval: Math.floor(rand() * 10),
      });
    }
    if (rand() < 0.6) {
      progress.dictation[`${id}.mp3`] = rec(
        Math.floor(rand() * 5),
        rand() < 0.5,
        `2026-09-30T00:0${Math.floor(rand() * 4)}:00.000Z`,
      );
    }
  }
  return progress;
}

test('隨機資料：交換律、結合律、冪等（任意順序、重複合併，各裝置最後會收斂到同一份）', () => {
  const rand = lcg(20260930);
  const merge = (a, b) => mergeProgress(a, b).progress;
  for (let i = 0; i < 200; i++) {
    const a = randomProgress(rand);
    const b = randomProgress(rand);
    const c = randomProgress(rand);
    assert.deepEqual(merge(a, b), merge(b, a), `交換律 #${i}`);
    assert.deepEqual(merge(merge(a, b), c), merge(a, merge(b, c)), `結合律 #${i}`);
    assert.deepEqual(merge(merge(a, b), b), merge(a, b), `冪等 #${i}`);
    assert.deepEqual(merge(a, a), a, `自己合併 #${i}`);
  }
});
