import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stages as realStages } from '../curriculum/lessons.mjs';
import { lessonProgress } from '../lib/lesson-progress.mjs';
import { emptyProgress } from '../lib/progress.mjs';

const line = (audio) => ({ jp: 'あ', reading: 'あ', zh: 'a', voice: 'v', audio });
const vocab = (word) => ({ word, reading: word, zh: word, voice: 'v', audio: `${word}.mp3` });

const stages = [
  {
    id: 's',
    title: 's',
    lessons: [
      {
        id: 'l1',
        title: 'l1',
        vocab: [vocab('a'), vocab('b')],
        grammar: [{ pattern: 'p', note: 'n', examples: [line('g1.mp3')] }],
        dialogue: [line('d1.mp3')],
        practice: [],
      },
      // 音檔還沒合成：沒有可聽寫的句子，但單字照算
      {
        id: 'l2',
        title: 'l2',
        audioReady: false,
        vocab: [vocab('c')],
        grammar: [],
        dialogue: [line('d2.mp3')],
        practice: [],
      },
      // 什麼都沒有：ratio 為 0，不能除以 0
      { id: 'l3', title: 'l3', vocab: [], grammar: [], dialogue: [], practice: [] },
    ],
  },
];

const state = (due = '2026-10-01') => ({
  stability: 2.3,
  difficulty: 2.1,
  state: 2,
  reps: 1,
  lapses: 0,
  due,
  firstSeen: '2026-09-30',
});

test('lessonProgress：沒有任何進度時全部為 0，總數照教材算', () => {
  const p = lessonProgress(stages, emptyProgress());
  assert.deepEqual(p.l1.vocab, { done: 0, total: 2 });
  assert.deepEqual(p.l1.dictation, { done: 0, total: 2 });
  assert.equal(p.l1.ratio, 0);
});

test('lessonProgress：單字算「已學」、聽寫算「已通過」，ratio 是兩者合計', () => {
  const progress = emptyProgress();
  progress.srs['l1:a'] = state();
  progress.dictation['g1.mp3'] = { attempts: 1, passed: true, lastAt: 'x' };
  progress.dictation['d1.mp3'] = { attempts: 3, passed: false, lastAt: 'x' };
  const p = lessonProgress(stages, progress);
  assert.deepEqual(p.l1.vocab, { done: 1, total: 2 });
  assert.deepEqual(p.l1.dictation, { done: 1, total: 2 });
  assert.equal(p.l1.ratio, 0.5);
});

test('lessonProgress：音檔未就緒的課沒有聽寫句子；空課 ratio 為 0', () => {
  const progress = emptyProgress();
  progress.srs['l2:c'] = state();
  const p = lessonProgress(stages, progress);
  assert.deepEqual(p.l2.dictation, { done: 0, total: 0 });
  assert.equal(p.l2.ratio, 1);
  assert.equal(p.l3.ratio, 0);
});

test('lessonProgress：教材已移除的卡片與句子進度不會讓程式出錯', () => {
  const progress = emptyProgress();
  progress.srs['gone:x'] = state();
  progress.dictation['gone.mp3'] = { attempts: 1, passed: true, lastAt: 'x' };
  const p = lessonProgress(stages, progress);
  assert.equal(p.l1.ratio, 0);
});

test('lessonProgress：實際教材每一課都有一筆，ratio 介於 0 與 1', () => {
  const p = lessonProgress(realStages, emptyProgress());
  for (const stage of realStages) {
    for (const lesson of stage.lessons) {
      assert.ok(p[lesson.id], `缺 ${lesson.id}`);
      assert.ok(p[lesson.id].ratio >= 0 && p[lesson.id].ratio <= 1);
    }
  }
});
