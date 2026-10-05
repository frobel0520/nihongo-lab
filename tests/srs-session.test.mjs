import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  emptyProgress,
  recordReview,
  recordReviewFrom,
  recordReviewSequence,
} from '../lib/progress.mjs';
import {
  applyGrade,
  baseState,
  createSession,
  currentCard,
  isFinished,
  isRevisit,
  nextHistory,
  resolvedCount,
  step,
} from '../lib/srs-session.mjs';
import { daysBetween } from '../lib/srs.mjs';

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
  const original = { stability: 3, difficulty: 2.1, state: 2, reps: 2, lapses: 0, due: '2026-10-05', firstSeen: '2026-09-20', updatedAt: '2026-10-02T00:00:00.000Z' };
  const changedByFirstGrade = { ...original, stability: 9, reps: 3 };

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
  const firstGap = daysBetween(day, first.srs.x.due);

  // 直接再評一次記得（舊做法）：被當成第二次複習
  const stacked = recordReview(first, 'x', 'good', day, '2026-10-01T01:01:00.000Z');
  assert.equal(stacked.srs.x.reps, 2);

  // 新做法：從評分前（沒有這張卡）重算
  const redone = recordReviewFrom(first, 'x', undefined, 'good', day, '2026-10-01T01:01:00.000Z');
  assert.equal(redone.srs.x.reps, 1);
  assert.equal(daysBetween(day, redone.srs.x.due), firstGap);
  assert.equal(redone.srs.x.updatedAt, '2026-10-01T01:01:00.000Z');

  const lapsed = recordReviewFrom(first, 'x', undefined, 'again', day, '2026-10-01T01:02:00.000Z');
  assert.equal(lapsed.srs.x.due, day);
  assert.equal(ids({ deck: deck('x') })[0], 'x');
});

test('這一輪的評分紀錄：還不會之後一輪繞回來是再考一次（接在後面、答案先蓋住），手動翻回去是改評分（換掉最後一個）', () => {
  // a 還不會 → b 記得 → 自動繞回 a
  let s = createSession(deck('a', 'b'));
  assert.deepEqual(nextHistory(s, card('a'), 'again'), ['again']);
  s = applyGrade(s, 'again', undefined);
  assert.equal(at(s), 'b');
  s = applyGrade(s, 'good', undefined);
  assert.equal(at(s), 'a');
  assert.equal(isRevisit(s, card('a')), true, '自動繞回來的卡');
  assert.deepEqual(nextHistory(s, card('a'), 'good'), ['again', 'good'], '再考一次：接在後面');
  s = applyGrade(s, 'good', undefined);
  assert.deepEqual(s.history.a, ['again', 'good']);
  assert.equal(isFinished(s), true);

  // 手動翻回 b 改成還不會：換掉最後一個，不是接在後面
  s = step(s, -1);
  assert.equal(at(s), 'b');
  assert.equal(isRevisit(s, card('b')), false);
  assert.deepEqual(nextHistory(s, card('b'), 'again'), ['again']);

  // 剛評完還不會、按上一張回去改成記得：換掉，不算忘記過
  let t2 = createSession(deck('x', 'y'));
  t2 = applyGrade(t2, 'again', undefined);
  t2 = step(t2, -1);
  assert.equal(at(t2), 'x');
  t2 = applyGrade(t2, 'good', undefined);
  assert.deepEqual(t2.history.x, ['good']);
});

test('只剩一張還不會的卡：自動停在它自己，也算再考一次', () => {
  let s = createSession(deck('solo'));
  s = applyGrade(s, 'again', undefined);
  assert.equal(at(s), 'solo');
  assert.equal(isRevisit(s, card('solo')), true);
  assert.deepEqual(nextHistory(s, card('solo'), 'good'), ['again', 'good']);
});

test('recordReviewSequence：依序套用這一輪的評分；沒有評分丟錯', () => {
  const day = '2026-10-01';
  const now = '2026-10-01T02:00:00.000Z';
  const recorded = recordReviewSequence(emptyProgress(), 'x', undefined, ['again', 'good'], day, now);
  const onlyGood = recordReviewSequence(emptyProgress(), 'x', undefined, ['good'], day, now);
  assert.ok(daysBetween(day, recorded.srs.x.due) >= 1);
  assert.ok(recorded.srs.x.stability < onlyGood.srs.x.stability, '中間忘記過，穩定度比較低');
  assert.throws(() => recordReviewSequence(emptyProgress(), 'x', undefined, [], day, now), /沒有評分/);
});
