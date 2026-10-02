import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { stages } from '../curriculum/lessons.mjs';
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

test('八課使用有來源的既有動畫台詞與實際音檔，對照台詞不與同課示範重複', () => {
  assert.equal(courses.length, 8);
  for (const lesson of courses) {
    const { training } = lesson;
    assert.doesNotMatch(lesson.title, /週/);
    assert.ok(training.clips.length >= 2 && training.review.length >= 1);
    const taught = new Set(training.clips.map((clip) => clip.quote.audio));
    for (const clip of trainingClips(training)) {
      assert.ok(
        bank.includes(clip.quote),
        '直接沿用已查證台詞，不能另造作品台詞',
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
  assert.deepEqual(summary.listening, { done: 1, total: 3 });
  assert.equal(summary.ratio, 1 / 3);
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
