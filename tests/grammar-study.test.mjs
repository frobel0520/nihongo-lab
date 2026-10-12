import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stages } from '../curriculum/lessons.mjs';
import {
  practiceRecordCount,
  practiceChangeCount,
  grammarRecordId,
  grammarReviewQueue,
  grammarStatus,
  grammarSummary,
  recordGrammarAnswer,
} from '../lib/grammar-study.mjs';
import {
  emptyProgress,
  parseProgress,
  recordDictation,
  recordReview,
  serializeProgress,
} from '../lib/progress.mjs';
import { mergeProgress } from '../lib/progress-merge.mjs';
import { exportProgress, parseImport } from '../lib/progress-transfer.mjs';
import { lessonProgress } from '../lib/lesson-progress.mjs';
import { listeningRecordId } from '../lib/anime-training.mjs';

const anime = stages.flatMap((s) => s.lessons).filter((l) => l.training);
const lesson = anime[0],
  point = lesson.grammar[0],
  question = point.study.questions[0];
const id = grammarRecordId(lesson.id, point, question);
const stamp = (n) => `2026-10-08T02:00:${String(n).padStart(2, '0')}.000Z`;

test('八課 32 個文法重點，每點兩題且有接續、來源及可解釋的唯一答案', () => {
  assert.equal(anime.length, 8);
  const ids = new Set();
  for (const l of anime) {
    assert.equal(l.grammar.length, 4);
    for (const p of l.grammar) {
      assert.ok(p.study.formation);
      assert.match(p.referenceUrl, /^https:/);
      assert.equal(p.study.questions.length, 2);
      for (const q of p.study.questions) {
        assert.equal(q.options.length, 3);
        assert.equal(new Set(q.options).size, 3);
        assert.ok(Number.isInteger(q.answer) && q.options[q.answer]);
        assert.ok(q.explanation);
        const key = grammarRecordId(l.id, p, q);
        assert.ok(!ids.has(key));
        ids.add(key);
      }
    }
  }
  assert.equal(ids.size, 64);
  for (const l of stages[0].lessons)
    assert.equal(grammarSummary(l, emptyProgress()).total, 0);
});

test('文法進度不改 FSRS、聽力及聽寫；曾答對與最後答錯分開顯示', () => {
  const clip = lesson.training.clips[0],
    listening = listeningRecordId(lesson.id, clip, clip.questions[0]);
  let p = recordReview(
    emptyProgress(),
    'stage0-day1:私',
    'good',
    '2026-10-08',
    stamp(0),
  );
  p = recordDictation(p, listening, true, stamp(1));
  p = recordDictation(p, clip.quote.audio, true, stamp(2));
  const original = structuredClone(p);
  p = recordGrammarAnswer(p, id, false, stamp(3));
  assert.deepEqual(grammarStatus(p, id), {
    attempted: true,
    passed: false,
    review: true,
  });
  assert.equal(grammarReviewQueue(lesson, p).length, 1);
  assert.equal(practiceRecordCount(p), 3);
  assert.equal(practiceChangeCount(original, p), 1);
  p = recordGrammarAnswer(p, id, true, stamp(4));
  assert.deepEqual(grammarStatus(p, id), {
    attempted: true,
    passed: true,
    review: false,
  });
  p = recordGrammarAnswer(p, id, false, stamp(5));
  assert.deepEqual(grammarStatus(p, id), {
    attempted: true,
    passed: true,
    review: true,
  });
  assert.deepEqual(p.srs, original.srs);
  assert.deepEqual(p.dictation[listening], original.dictation[listening]);
  assert.deepEqual(
    p.dictation[clip.quote.audio],
    original.dictation[clip.quote.audio],
  );
  const summary = lessonProgress(stages, p)[lesson.id];
  assert.deepEqual(summary.grammar, {
    total: 8,
    attempted: 1,
    done: 1,
    review: 1,
  });
  assert.equal(summary.listening.done, 1);
  assert.equal(summary.dictation.done, 0, '文法例句不改共用名句的原課程歸屬');
});

test('舊同步的聯集合併保留文法最新錯題，之後答對才解除；鍵數固定', () => {
  const wrong = recordGrammarAnswer(emptyProgress(), id, false, stamp(1));
  const corrected = recordGrammarAnswer(wrong, id, true, stamp(2));
  const laterWrong = recordGrammarAnswer(corrected, id, false, stamp(3));
  for (const [a, b, review] of [
    [wrong, corrected, false],
    [corrected, laterWrong, true],
  ]) {
    const ab = mergeProgress(a, b).progress,
      ba = mergeProgress(b, a).progress;
    assert.deepEqual(ab, ba);
    assert.equal(grammarStatus(ab, id).review, review);
    assert.deepEqual(mergeProgress(ab, ab).progress, ab);
  }
  let p = laterWrong;
  for (let i = 4; i < 40; i++)
    p = recordGrammarAnswer(p, id, i % 2 === 0, stamp(i));
  assert.equal(Object.keys(p.dictation).length, 2);
  assert.equal(p.dictation[id].attempts, 39);
  assert.equal(grammarStatus(p, id).review, true);
});

test('版本 3 存檔、匯出匯入不需要格式升級，保留文法錯題紀錄', () => {
  const p = recordGrammarAnswer(emptyProgress(), id, false, stamp(1));
  const parsed = parseProgress(serializeProgress(p));
  assert.equal(parsed.problem, null);
  assert.equal(parsed.dropped, 0);
  assert.deepEqual(parsed.progress, p);
  const imported = parseImport(exportProgress(p, stamp(2)));
  assert.equal(imported.ok, true);
  assert.deepEqual(imported.progress, p);
  assert.equal(grammarStatus(imported.progress, id).review, true);
});

test('同毫秒重答也能解除錯題，時鐘回退不覆蓋自己的新結果', () => {
  let p = recordGrammarAnswer(emptyProgress(), id, false, stamp(2));
  p = recordGrammarAnswer(p, id, true, stamp(2));
  assert.equal(grammarStatus(p, id).review, false);
  assert.equal(p.dictation[id].lastAt, '2026-10-08T02:00:02.001Z');
  p = recordGrammarAnswer(p, id, false, stamp(1));
  assert.equal(grammarStatus(p, id).review, true);
  assert.throws(() =>
    recordGrammarAnswer(p, 'audio/example.mp3', true, stamp(3)),
  );
  assert.throws(() => recordGrammarAnswer(p, id, true, 'not-a-timestamp'));
});

test('文法重排不改 id，修改題目正文會另存，修改解說保留已有答案', () => {
  assert.equal(grammarRecordId(lesson.id, { ...point }, question), id);
  assert.equal(
    grammarRecordId(lesson.id, point, { ...question, explanation: '更新解說' }),
    id,
  );
  assert.notEqual(
    grammarRecordId(lesson.id, point, { ...question, prompt: '改版題目' }),
    id,
  );
  assert.notEqual(grammarRecordId('another-lesson', point, question), id);
});
