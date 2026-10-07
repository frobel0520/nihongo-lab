import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { stages } from '../curriculum/lessons.mjs';
import { pickDistractors } from '../curriculum/anime-training.mjs';
import {
  checkListeningChoice,
  listeningRecordId,
  trainingClips,
} from '../lib/anime-training.mjs';
import {
  emptyProgress,
  recordDictation,
  parseProgress,
  serializeProgress,
} from '../lib/progress.mjs';
import { mergeProgress } from '../lib/progress-merge.mjs';
import { lessonProgress } from '../lib/lesson-progress.mjs';
import { lessonAudioPaths, allAudioPaths } from '../lib/offline.mjs';

const courses = stages.flatMap((s) => s.lessons).filter((l) => l.training);
const bank = stages.flatMap((s) => s.lessons).flatMap((l) => l.quotes ?? []);

test('八課使用有來源的共用動畫台詞與實際音檔，對照台詞不與同課示範重複', () => {
  assert.equal(courses.length, 8);
  for (const lesson of courses) {
    const { training } = lesson;
    assert.doesNotMatch(lesson.title, /週/);
    assert.ok(training.clips.length >= 2 && training.review.length >= 1);
    const taught = new Set(training.clips.map((clip) => clip.quote.audio));
    for (const clip of trainingClips(training)) {
      assert.ok(
        bank.includes(clip.quote),
        '直接引用共用句庫，不能另造作品台詞',
      );
      assert.match(clip.referenceUrl, /^https:\/\//);
      assert.ok(clip.quote.source && clip.quote.note);
      assert.doesNotMatch(
        clip.quote.source,
        /原神|スターレイル|ドラゴンクエスト|スプラトゥーン/,
      );
      assert.ok(existsSync(`public/${clip.quote.audio}`));
      for (const question of clip.questions) {
        assert.equal(new Set(question.options).size, question.options.length);
        assert.ok(question.options.length >= 3);
        if (question.id === 'meaning')
          assert.equal(question.options[question.answer], clip.quote.zh);
        question.options.forEach((_, i) =>
          assert.equal(
            checkListeningChoice(question, i),
            i === question.answer,
          ),
        );
        assert.throws(() => checkListeningChoice(question, -1));
        assert.throws(() =>
          checkListeningChoice(question, question.options.length),
        );
      }
    }
    for (const clip of training.review)
      assert.ok(!taught.has(clip.quote.audio));
  }
});

const questions = courses
  .flatMap((lesson) => trainingClips(lesson.training))
  .flatMap((clip) =>
    clip.questions
      .filter((q) => q.id === 'meaning')
      .map((question) => ({ clip, question })),
  );
const wrongOptions = (question) =>
  question.options.filter((_, i) => i !== question.answer);
const workOf = (quote) => quote.source.split('（')[0];

test('錯誤選項依台詞而異：不是每題都出現同樣的兩個，不聽音檔無法靠消去法答對', () => {
  assert.ok(questions.length >= 60);
  const pairs = new Set(
    questions.map(({ question }) => wrongOptions(question).sort().join('／')),
  );
  assert.ok(
    pairs.size >= questions.length * 0.9,
    `錯誤選項組合只有 ${pairs.size} 種（共 ${questions.length} 題）`,
  );
  const counts = new Map();
  for (const { question } of questions)
    for (const option of wrongOptions(question))
      counts.set(option, (counts.get(option) ?? 0) + 1);
  const [mostUsed, times] = [...counts.entries()].sort(
    (a, b) => b[1] - a[1],
  )[0];
  assert.ok(
    times <= questions.length * 0.15,
    `「${mostUsed}」在 ${times}／${questions.length} 題都是錯誤選項`,
  );
});

test('pickDistractors：結果固定、兩個錯誤選項意思不同且不是正確答案，優先挑不同作品', () => {
  let sameWork = 0;
  for (const { clip, question } of questions) {
    const wrong = wrongOptions(question);
    assert.equal(wrong.length, 2);
    assert.notEqual(wrong[0], wrong[1]);
    assert.ok(!wrong.includes(clip.quote.zh));
    assert.deepEqual(pickDistractors(bank, clip.quote), wrong);
    for (const zh of wrong) {
      const owners = bank.filter((q) => q.zh === zh);
      assert.ok(owners.length >= 1, '錯誤選項必須是共用句庫裡已有的翻譯');
      if (owners.every((q) => workOf(q) === workOf(clip.quote))) sameWork++;
    }
  }
  assert.equal(sameWork, 0, '句庫夠大時，錯誤選項不該和正確台詞同一部作品');
});

test('特訓進度與聽寫分離；題目改版後舊的通過紀錄不計入新題目', () => {
  const lesson = courses[0];
  const clip = lesson.training.clips[0];
  const question = clip.questions[0];
  const id = listeningRecordId(lesson.id, clip, question);
  assert.notEqual(id, clip.quote.audio);
  assert.notEqual(
    id,
    listeningRecordId(lesson.id, clip, { ...question, prompt: '另一題' }),
  );
  assert.notEqual(id, listeningRecordId('another-lesson', clip, question));
  let progress = recordDictation(
    emptyProgress(),
    id,
    false,
    '2026-10-02T00:00:00.000Z',
  );
  assert.equal(lessonProgress(stages, progress)[lesson.id].listening.done, 0);
  progress = recordDictation(progress, id, true, '2026-10-02T00:01:00.000Z');
  const summary = lessonProgress(stages, progress)[lesson.id];
  const total = trainingClips(lesson.training).length;
  assert.deepEqual(summary.listening, { done: 1, total });
  assert.equal(summary.ratio, 1 / total);
  assert.equal(summary.dictation.done, 0);
  const loaded = parseProgress(serializeProgress(progress));
  assert.equal(loaded.problem, null);
  assert.deepEqual(
    mergeProgress(emptyProgress(), loaded.progress).progress.dictation[id],
    {
      attempts: 2,
      passed: true,
      lastAt: '2026-10-02T00:01:00.000Z',
    },
  );
});

test('特訓引用音檔可供離線下載；所有課程的清單去重', () => {
  const lesson = courses[0];
  assert.deepEqual(
    lessonAudioPaths(lesson),
    trainingClips(lesson.training).map((clip) => clip.quote.audio),
  );
  const all = allAudioPaths(stages);
  assert.equal(all.length, new Set(all).size);
  for (const path of lessonAudioPaths(lesson)) assert.ok(all.includes(path));
});
