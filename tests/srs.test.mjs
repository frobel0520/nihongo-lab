import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stages } from '../curriculum/lessons.mjs';
import {
  GRADES,
  MAX_INTERVAL_DAYS,
  MIN_EASE,
  addDays,
  buildCards,
  buildQueue,
  isDateString,
  schedule,
  summarize,
  toDateString,
} from '../lib/srs.mjs';

const TODAY = '2026-09-30';

test('日期工具：本機日期字串、跨月加天數、格式驗證', () => {
  assert.equal(toDateString(new Date(2026, 8, 5)), '2026-09-05');
  assert.equal(addDays('2026-09-30', 1), '2026-10-01');
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(addDays('2026-03-01', -1), '2026-02-28');
  assert.ok(isDateString('2026-09-30'));
  assert.ok(!isDateString('2026-02-30'));
  assert.ok(!isDateString('2026-9-30'));
  assert.ok(!isDateString(20260930));
});

test('schedule：新卡 good 隔 1 天，之後 3 天，再依 ease 拉長', () => {
  const first = schedule(undefined, 'good', TODAY);
  assert.equal(first.interval, 1);
  assert.equal(first.due, '2026-10-01');
  assert.equal(first.firstSeen, TODAY);
  assert.equal(first.reps, 1);

  const second = schedule(first, 'good', '2026-10-01');
  assert.equal(second.interval, 3);
  assert.equal(second.due, '2026-10-04');

  const third = schedule(second, 'good', '2026-10-04');
  assert.equal(third.interval, Math.round(3 * 2.5));
  assert.equal(third.firstSeen, TODAY);
});

test('schedule：again 今天再看、清 reps、記 lapses、ease 有下限', () => {
  let card = schedule(undefined, 'good', TODAY);
  card = schedule(card, 'good', TODAY);
  const lapsed = schedule(card, 'again', TODAY);
  assert.equal(lapsed.due, TODAY);
  assert.equal(lapsed.interval, 0);
  assert.equal(lapsed.reps, 0);
  assert.equal(lapsed.lapses, 1);
  assert.ok(lapsed.ease < card.ease);

  let low = schedule(undefined, 'again', TODAY);
  for (let i = 0; i < 20; i++) low = schedule(low, 'again', TODAY);
  assert.equal(low.ease, 1.3);
});

test('只有兩級評分：還不會（again）與記得（good）', () => {
  assert.deepEqual([...GRADES], ['again', 'good']);
});

test('schedule：不認得的評分（舊版的 hard／easy）會丟錯，不默默當成 good', () => {
  assert.throws(() => schedule(undefined, 'hard', TODAY), /未知的評分/);
  assert.throws(() => schedule(undefined, 'easy', TODAY), /未知的評分/);
  assert.throws(() => schedule(undefined, undefined, TODAY), /未知的評分/);
});

test('schedule：good 不改 ease，again 之後 good 的間隔從頭算，且不改動傳入的舊狀態', () => {
  const first = schedule(undefined, 'good', TODAY);
  const second = schedule(first, 'good', '2026-10-01');
  assert.equal(second.ease, first.ease);

  const before = structuredClone(second);
  const lapsed = schedule(second, 'again', TODAY);
  assert.deepEqual(second, before);
  assert.equal(schedule(lapsed, 'good', TODAY).interval, 1);
});

test('schedule：連續答「記得」間隔只會變長、不超過上限，日期永遠是合法格式', () => {
  let card = undefined;
  let day = TODAY;
  let previous = 0;
  for (let i = 0; i < 40; i++) {
    card = schedule(card, 'good', day);
    assert.ok(card.interval >= previous, `第 ${i + 1} 次間隔變短了`);
    assert.ok(card.interval <= MAX_INTERVAL_DAYS);
    assert.ok(
      isDateString(card.due),
      `第 ${i + 1} 次到期日格式不合法：${card.due}`,
    );
    previous = card.interval;
    day = card.due;
  }
  assert.equal(card.interval, MAX_INTERVAL_DAYS);
});

test('schedule：ease 降到下限（多次答錯後）的卡，答「記得」間隔仍會成長', () => {
  let card = schedule(undefined, 'good', TODAY);
  for (let i = 0; i < 10; i++) card = schedule(card, 'again', TODAY);
  assert.equal(card.ease, MIN_EASE);
  let previous = 0;
  for (let i = 0; i < 6; i++) {
    card = schedule(card, 'good', TODAY);
    assert.ok(card.interval > previous || i === 0);
    previous = card.interval;
  }
  assert.ok(previous >= 4);
});

test('schedule：舊版四級評分留下的進度（ease 較高、reps 1 但間隔 3）仍能正常往下排', () => {
  // 舊版第一次答 easy 會得到 reps 1、interval 3、ease 2.65；現在再答「記得」不應比 3 天短。
  const legacy = {
    ease: 2.65,
    interval: 3,
    reps: 1,
    lapses: 0,
    due: '2026-10-03',
    firstSeen: TODAY,
  };
  const next = schedule(legacy, 'good', '2026-10-03');
  assert.equal(next.interval, Math.round(3 * 2.65));
  assert.equal(next.ease, 2.65);
});

test('buildCards：id 含課程 id、涵蓋教材所有單字', () => {
  const cards = buildCards(stages);
  const vocabCount = stages
    .flatMap((s) => s.lessons)
    .reduce((n, l) => n + l.vocab.length, 0);
  assert.equal(cards.length, vocabCount);
  assert.equal(new Set(cards.map((c) => c.id)).size, cards.length);
  for (const card of cards) {
    assert.ok(card.id.startsWith(`${card.lessonId}:`));
    assert.ok(card.audio && card.reading && card.zh);
  }
});

const cards = ['a', 'b', 'c', 'd'].map((word) => ({
  id: `l:${word}`,
  word,
  reading: word,
  zh: word,
  audio: `${word}.mp3`,
  lessonId: 'l',
  lessonTitle: 'l',
}));

test('buildQueue：到期卡在前（越舊越前）、未到期不出現、新卡受每日額度限制', () => {
  const state = {
    'l:a': {
      ease: 2.5,
      interval: 1,
      reps: 1,
      lapses: 0,
      due: '2026-09-29',
      firstSeen: '2026-09-28',
    },
    'l:b': {
      ease: 2.5,
      interval: 3,
      reps: 2,
      lapses: 0,
      due: '2026-10-05',
      firstSeen: '2026-09-28',
    },
    'l:c': {
      ease: 2.5,
      interval: 1,
      reps: 1,
      lapses: 0,
      due: '2026-09-28',
      firstSeen: '2026-09-27',
    },
  };
  const queue = buildQueue(cards, state, TODAY, 1);
  assert.deepEqual(
    queue.map((c) => c.word),
    ['c', 'a', 'd'],
  );
});

test('buildQueue：今天已經新學過的卡會佔掉新卡額度，重整頁面不會多出新卡', () => {
  const state = {
    'l:a': {
      ease: 2.5,
      interval: 0,
      reps: 0,
      lapses: 1,
      due: TODAY,
      firstSeen: TODAY,
    },
  };
  assert.deepEqual(
    buildQueue(cards, state, TODAY, 2).map((c) => c.word),
    ['a', 'b'],
  );
  assert.deepEqual(
    buildQueue(cards, state, TODAY, 1).map((c) => c.word),
    ['a'],
  );
});

test('buildQueue／summarize：教材已移除的卡片進度不會讓程式出錯', () => {
  const state = {
    'gone:x': {
      ease: 2.5,
      interval: 1,
      reps: 1,
      lapses: 0,
      due: '2026-09-01',
      firstSeen: '2026-08-30',
    },
  };
  assert.equal(buildQueue(cards, state, TODAY, 10).length, cards.length);
  assert.deepEqual(summarize(cards, state, TODAY, 10), {
    total: 4,
    learned: 0,
    due: 0,
    fresh: 4,
  });
});
