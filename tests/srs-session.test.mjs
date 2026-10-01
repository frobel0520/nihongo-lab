import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyProgress, recordReview, recordReviewFrom } from '../lib/progress.mjs';
import {
  applyGrade,
  baseState,
  createSession,
  currentCard,
  isFinished,
  resolvedCount,
  step,
} from '../lib/srs-session.mjs';

const card = (id) => ({ id, word: id, reading: id, zh: id, audio: `${id}.mp3`, audioReady: true, lessonId: 'l', lessonTitle: 'L' });
const deck = (...ids) => ids.map(card);
const ids = (session) => session.deck.map((c) => c.id);
const at = (session) => currentCard(session)?.id ?? null;

test('評「記得」：自動跳到下一張，全部記得就結束', () => {
  let s = createSession(deck('a', 'b', 'c'));
  assert.equal(at(s), 'a');
  s = applyGrade(s, 'good', undefined);
  assert.equal(at(s), 'b');
  assert.equal(resolvedCount(s), 1);
  s = applyGrade(s, 'good', undefined);
  s = applyGrade(s, 'good', undefined);
  assert.equal(isFinished(s), true);
  assert.equal(currentCard(s), null);
  assert.equal(resolvedCount(s), 3);
});

test('評「還不會」：這一輪還會再看，順序等同舊版（排到尾端）；記得之後才結束', () => {
  let s = createSession(deck('a', 'b', 'c'));
  s = applyGrade(s, 'again', undefined); // a 還不會
  assert.deepEqual([at(s)], ['b']);
  s = applyGrade(s, 'good', undefined); // b
  assert.equal(at(s), 'c');
  s = applyGrade(s, 'good', undefined); // c
  assert.equal(at(s), 'a', '繞回前面還沒完成的 a');
  assert.equal(isFinished(s), false);
  s = applyGrade(s, 'again', undefined); // a 又不會：只剩它，繼續停在它
  assert.equal(at(s), 'a');
  s = applyGrade(s, 'good', undefined);
  assert.equal(isFinished(s), true);
  assert.equal(resolvedCount(s), 3);
});

test('上一張／下一張：停在兩端、不繞圈；跳過的卡之後會回來', () => {
  let s = createSession(deck('a', 'b', 'c'));
  assert.equal(step(s, -1), s, '第一張往前不動（回傳同一個物件，畫面不用重繪）');
  s = step(s, 1);
  assert.equal(at(s), 'b');
  s = step(s, 1);
  assert.equal(at(s), 'c');
  assert.equal(step(s, 1), s, '最後一張往後不動');

  // 跳過 a、b，只評 c：自動繞回前面沒完成的 a
  s = applyGrade(s, 'good', undefined);
  assert.equal(at(s), 'a');
});

test('結束的畫面往回翻會回到最後一張；牌組是空的時什麼都不做', () => {
  let s = createSession(deck('a', 'b'));
  s = applyGrade(applyGrade(s, 'good', undefined), 'good', undefined);
  assert.equal(isFinished(s), true);
  s = step(s, -1);
  assert.equal(at(s), 'b');
  assert.equal(isFinished(s), false);

  const empty = createSession([]);
  assert.equal(currentCard(empty), null);
  assert.equal(isFinished(empty), true);
  assert.equal(step(empty, 1), empty);
  assert.equal(applyGrade(empty, 'good', undefined), empty);
});

test('回頭改評分：第一次評分前的狀態只記一次，之後固定用它', () => {
  const original = { ease: 2.5, interval: 3, reps: 2, lapses: 0, due: '2026-10-05', firstSeen: '2026-09-20', updatedAt: '2026-10-02T00:00:00.000Z' };
  const changedByFirstGrade = { ...original, interval: 8, reps: 3 };

  let s = createSession(deck('a', 'b'));
  assert.equal(baseState(s, card('a'), original), original, '還沒評過：用進度裡現在的');

  s = applyGrade(s, 'good', original); // a：記得（記下 original）
  s = step(s, -1); // 回到 a
  assert.equal(at(s), 'a');
  assert.equal(baseState(s, card('a'), changedByFirstGrade), original, '評過之後：不管進度現在怎樣，都用第一次評分前的');

  s = applyGrade(s, 'again', changedByFirstGrade); // 改成還不會
  assert.deepEqual(s.before.a, original, 'before 沒有被第二次覆蓋');
  assert.equal(s.grades.a, 'again');

  // 新卡（進度裡沒有）：before 記成 null，baseState 還原成 undefined
  const n = applyGrade(createSession(deck('n')), 'good', undefined);
  assert.equal(n.before.n, null);
  assert.equal(baseState(n, card('n'), { ...original }), undefined);
});

test('改評分不會把間隔推進兩次：從第一次評分前的狀態重算', () => {
  const day = '2026-10-01';
  const progress = emptyProgress();
  const first = recordReview(progress, 'x', 'good', day, '2026-10-01T01:00:00.000Z'); // 新卡評記得
  assert.equal(first.srs.x.interval, 1);

  // 直接再評一次記得（舊做法）：間隔被推進成第二階段
  const stacked = recordReview(first, 'x', 'good', day, '2026-10-01T01:01:00.000Z');
  assert.equal(stacked.srs.x.reps, 2);

  // 新做法：從評分前（沒有這張卡）重算
  const redone = recordReviewFrom(first, 'x', undefined, 'good', day, '2026-10-01T01:01:00.000Z');
  assert.equal(redone.srs.x.reps, 1);
  assert.equal(redone.srs.x.interval, 1);
  assert.equal(redone.srs.x.updatedAt, '2026-10-01T01:01:00.000Z');

  const lapsed = recordReviewFrom(first, 'x', undefined, 'again', day, '2026-10-01T01:02:00.000Z');
  assert.equal(lapsed.srs.x.reps, 0);
  assert.equal(lapsed.srs.x.lapses, 1);
  assert.equal(ids({ deck: deck('x') })[0], 'x');
});
