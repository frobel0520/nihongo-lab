import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stages } from '../curriculum/lessons.mjs';
import {
  GRADES,
  MAX_INTERVAL_DAYS,
  addDays,
  SRS_MODES,
  buildCards,
  buildDeck,
  buildNewQueue,
  buildReviewQueue,
  daysBetween,
  daysUntilDue,
  fromLegacyCard,
  isDateString,
  schedule,
  scheduleSequence,
  summarize,
  toDateString,
} from '../lib/srs.mjs';

const TODAY = '2026-09-30';
/** 某一天早上 8 點（UTC）的評分時刻 */
const at = (day) => `${day}T08:00:00.000Z`;
/** 依序在到期日答「記得」n 次，回傳每次的間隔 */
function goodChain(n, start = TODAY) {
  let card = undefined;
  let day = start;
  const intervals = [];
  for (let i = 0; i < n; i++) {
    card = schedule(card, 'good', day, at(day));
    intervals.push(daysBetween(day, card.due));
    day = card.due;
  }
  return { card, intervals };
}

test('日期工具：本機日期字串、跨月加天數、相差天數、格式驗證', () => {
  assert.equal(toDateString(new Date(2026, 8, 5)), '2026-09-05');
  assert.equal(addDays('2026-09-30', 1), '2026-10-01');
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(addDays('2026-03-01', -1), '2026-02-28');
  assert.equal(daysBetween('2026-09-30', '2026-10-03'), 3);
  assert.equal(daysBetween('2026-12-31', '2027-01-01'), 1);
  assert.ok(isDateString('2026-09-30'));
  assert.ok(!isDateString('2026-02-30'));
  assert.ok(!isDateString('2026-9-30'));
  assert.ok(!isDateString(20260930));
});

test('schedule（FSRS）：新卡答記得至少明天以後，記下首次日期、評分時刻，穩定度與難度在合理範圍', () => {
  const first = schedule(undefined, 'good', TODAY, at(TODAY));
  assert.ok(daysBetween(TODAY, first.due) >= 1);
  assert.equal(first.firstSeen, TODAY);
  assert.equal(first.updatedAt, at(TODAY));
  assert.equal(first.reps, 1);
  assert.equal(first.lapses, 0);
  assert.ok(first.stability > 0);
  assert.ok(first.difficulty >= 1 && first.difficulty <= 10);
});

test('schedule（FSRS）：到期時連續答記得，間隔一次比一次長、不超過上限，日期永遠合法', () => {
  const { card, intervals } = goodChain(12);
  for (let i = 1; i < intervals.length; i++) {
    assert.ok(intervals[i] >= intervals[i - 1], `第 ${i + 1} 次間隔變短了：${intervals}`);
    assert.ok(intervals[i] <= MAX_INTERVAL_DAYS);
  }
  assert.ok(intervals[2] > intervals[1] && intervals[1] > intervals[0], '前幾次確實變長');
  assert.equal(intervals.at(-1), MAX_INTERVAL_DAYS);
  assert.ok(isDateString(card.due));
});

test('schedule（FSRS）：答還不會今天再看，穩定度下降、難度上升、記一次忘記，不改動傳入的舊狀態', () => {
  const { card } = goodChain(2);
  const before = structuredClone(card);
  const lapsed = schedule(card, 'again', card.due, at(card.due));
  assert.deepEqual(card, before);
  assert.equal(lapsed.due, card.due);
  assert.equal(daysUntilDue(lapsed, card.due), 0);
  assert.ok(lapsed.stability < card.stability);
  assert.ok(lapsed.difficulty > card.difficulty);
  assert.equal(lapsed.lapses, card.lapses + 1);
});

test('schedule（FSRS）：拖越久才複習（記得的機率越低）還答對，穩定度長得越多', () => {
  const { card } = goodChain(2);
  const onTime = schedule(card, 'good', card.due, at(card.due));
  const late = addDays(card.due, 20);
  const overdue = schedule(card, 'good', late, at(late));
  assert.ok(overdue.stability > onTime.stability);
});

test('schedule（FSRS）：答錯過好幾次的卡，答記得之後的間隔比一路答對的短', () => {
  const easy = goodChain(3);
  let hard = undefined;
  let day = TODAY;
  for (const grade of ['again', 'good', 'again', 'good', 'again', 'good']) {
    hard = schedule(hard, grade, day, at(day));
    day = hard.due;
  }
  assert.ok(hard.difficulty > easy.card.difficulty);
  assert.ok(daysBetween(day, hard.due) <= easy.intervals.at(-1));
});

test('只有兩級評分：還不會（again）與記得（good），不認得的評分丟錯', () => {
  assert.deepEqual([...GRADES], ['again', 'good']);
  for (const bad of ['hard', 'easy', undefined]) {
    assert.throws(() => schedule(undefined, bad, TODAY, at(TODAY)), /未知的評分/);
  }
});

test('scheduleSequence：同一天先還不會再記得 = 依序套用；沒有評分就是原狀態', () => {
  const { card } = goodChain(2);
  const day = card.due;
  const both = scheduleSequence(card, ['again', 'good'], day, at(day));
  const step = schedule(schedule(card, 'again', day, at(day)), 'good', day, at(day));
  assert.deepEqual(both, step);
  assert.ok(daysBetween(day, both.due) >= 1, '最後答記得：不會停在今天');
  const onlyGood = schedule(card, 'good', day, at(day));
  assert.ok(both.stability < onlyGood.stability, '中間忘記過，穩定度比直接答對低');
  assert.equal(scheduleSequence(card, [], day, at(day)), card);
});

test('fromLegacyCard：舊版 SM-2 進度轉換後到期日不變，接著用 FSRS 往下排', () => {
  const legacy = { ease: 2.5, interval: 8, reps: 3, lapses: 0, due: '2026-10-08', firstSeen: '2026-09-20', updatedAt: at('2026-09-30') };
  const converted = fromLegacyCard(legacy);
  assert.equal(converted.due, legacy.due);
  assert.equal(converted.stability, 8);
  const next = schedule(converted, 'good', converted.due, at(converted.due));
  assert.ok(daysBetween(converted.due, next.due) > 8, '答記得：比舊間隔更長');
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

test('buildCards：音檔未就緒的課程單字仍會收進來，但標成 audioReady: false（畫面不放播放鈕）', () => {
  const lesson = (id, audioReady) => ({
    id,
    title: id,
    ...(audioReady === undefined ? {} : { audioReady }),
    vocab: [{ word: 'あ', reading: 'あ', zh: 'a', audio: `${id}.mp3` }],
  });
  const cards = buildCards([
    {
      lessons: [
        lesson('ready'),
        lesson('explicit', true),
        lesson('pending', false),
      ],
    },
  ]);
  assert.deepEqual(
    cards.map((c) => [c.lessonId, c.audioReady]),
    [
      ['ready', true],
      ['explicit', true],
      ['pending', false],
    ],
  );

  // 實際教材：目前所有課程的音檔都已合成
  const real = buildCards(stages);
  assert.ok(real.length > 0);
  assert.ok(real.every((c) => c.audioReady));
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

test('複習區：只有看過且到期的卡（越舊越前），未到期與沒看過的不出現；新卡區：所有沒看過的、沒有每日上限', () => {
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
  assert.deepEqual(
    buildReviewQueue(cards, state, TODAY).map((c) => c.word),
    ['c', 'a'],
  );
  assert.deepEqual(
    buildNewQueue(cards, state).map((c) => c.word),
    ['d'],
  );

  // 新卡數量不受限：教材有幾張沒看過的，佇列就有幾張
  const many = Array.from({ length: 40 }, (_, i) => ({
    ...cards[0],
    id: `m:${i}`,
    word: `w${i}`,
  }));
  assert.equal(buildNewQueue(many, {}).length, 40);
  assert.equal(summarize(many, {}, TODAY).fresh, 40);
});

test('今天新學時答「還不會」的卡（今天到期）進複習區、離開新卡區，重整頁面不會漏掉也不會重複', () => {
  const state = {
    'l:a': {
      ease: 2.3,
      interval: 0,
      reps: 0,
      lapses: 1,
      due: TODAY,
      firstSeen: TODAY,
    },
  };
  assert.deepEqual(
    buildReviewQueue(cards, state, TODAY).map((c) => c.word),
    ['a'],
  );
  assert.deepEqual(
    buildNewQueue(cards, state).map((c) => c.word),
    ['b', 'c', 'd'],
  );
});

test('還不會的卡再多，新卡區的第一張仍是下一張沒看過的新卡（使用者回報的情境）', () => {
  const deck = Array.from({ length: 300 }, (_, i) => ({
    ...cards[0],
    id: `m:${i}`,
    word: `w${i}`,
  }));
  // 前 150 張都答過「還不會」，今天到期
  const state = Object.fromEntries(
    deck.slice(0, 150).map((c) => [
      c.id,
      { ease: 2.3, interval: 0, reps: 0, lapses: 1, due: TODAY, firstSeen: TODAY },
    ]),
  );
  assert.equal(buildDeck('review', deck, state, TODAY).length, 150);
  const fresh = buildDeck('new', deck, state, TODAY);
  assert.equal(fresh.length, 150);
  assert.equal(fresh[0].word, 'w150');
  assert.deepEqual(SRS_MODES, ['review', 'new']);
});

test('buildReviewQueue／buildNewQueue／summarize：教材已移除的卡片進度不會讓程式出錯', () => {
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
  assert.equal(buildReviewQueue(cards, state, TODAY).length, 0);
  assert.equal(buildNewQueue(cards, state).length, cards.length);
  assert.deepEqual(summarize(cards, state, TODAY), {
    total: 4,
    learned: 0,
    due: 0,
    fresh: 4,
  });
});
