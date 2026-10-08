import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { stages } from '../curriculum/lessons.mjs';
import { buildCards, buildNewQueue } from '../lib/srs.mjs';
import { buildSentences } from '../lib/dictation.mjs';
import { allAudioPaths, lessonAudioPaths } from '../lib/offline.mjs';
import { listeningRecordId, trainingClips } from '../lib/anime-training.mjs';
import { emptyProgress, recordReview } from '../lib/progress.mjs';

const lessons = stages.flatMap((s) => s.lessons);
const core = lessons.filter((l) => /^anime-lesson-0[4567]$/.test(l.id));
const bank = lessons.flatMap((l) => l.quotes ?? []);

test('四課核心教材都有完整詞彙、句型、練習及可追溯的來源', () => {
  assert.equal(core.length, 4);
  for (const lesson of core) {
    assert.equal(lesson.vocab.length, 10);
    assert.equal(lesson.grammar.length, 4);
    assert.equal(lesson.practice.length, 6);
    for (const word of lesson.vocab) {
      assert.ok(word.note);
      assert.match(word.referenceNote, /JMdict 詞條 \d+/);
      assert.match(word.referenceUrl, /^https:\/\//);
      assert.ok(existsSync(`public/${word.audio}`));
    }
    for (const point of lesson.grammar) {
      assert.match(point.referenceUrl, /^https:\/\//);
      assert.ok(point.examples.length + point.quoteExamples.length > 0);
      for (const ex of point.examples) {
        assert.match(ex.source, /自行編寫.*非作品台詞/);
        assert.ok(existsSync(`public/${ex.audio}`));
      }
      for (const ex of point.quoteExamples) {
        assert.ok(
          bank.includes(ex.quote),
          '作品例句直接引用句庫，保留原文、選角與音檔',
        );
        assert.match(ex.referenceUrl, /^https:\/\//);
      }
    }
  }
});

test('既有 73 題大意的紀錄 id 完全保留，新題另存且每課新增四題', () => {
  const original = lessons.flatMap((l) =>
    l.training
      ? trainingClips(l.training).flatMap((c) =>
          c.questions
            .filter((q) => q.id === 'meaning')
            .map((q) => listeningRecordId(l.id, c, q)),
        )
      : [],
  );
  assert.equal(original.length, 73);
  assert.equal(
    createHash('sha256').update(original.sort().join('\n')).digest('hex'),
    'c8ba78c426b3462a5e034ec141939b35127a9613078321bc6ed55ce0d02cf202',
  );
  const oldIds = new Set(original);
  for (const lesson of core) {
    const extras = trainingClips(lesson.training).flatMap((c) =>
      c.questions.filter((q) => q.id !== 'meaning').map((q) => ({ c, q })),
    );
    assert.equal(extras.length, 4);
    for (const { c, q } of extras) {
      assert.ok(!oldIds.has(listeningRecordId(lesson.id, c, q)));
      assert.equal(new Set(q.options).size, q.options.length);
      assert.ok(q.answer >= 0 && q.answer < q.options.length);
      assert.ok(q.explanation);
    }
  }
});

test('四十個新詞直接進 FSRS；評新卡不改其他卡的進度', () => {
  const cards = buildCards(stages);
  const fresh = buildNewQueue(cards, {});
  const newCards = fresh.filter((c) => core.some((l) => l.id === c.lessonId));
  assert.equal(newCards.length, 40);
  assert.equal(new Set(newCards.map((c) => c.id)).size, 40);
  const old = recordReview(
    emptyProgress(),
    'stage0-day1:私',
    'good',
    '2026-10-07',
    '2026-10-07T03:00:00Z',
  );
  const next = recordReview(
    old,
    newCards[0].id,
    'good',
    '2026-10-07',
    '2026-10-07T03:01:00Z',
  );
  assert.equal(next.version, 3);
  assert.ok(next.srs[newCards[0].id].stability > 0);
  assert.deepEqual(next.srs['stage0-day1:私'], old.srs['stage0-day1:私']);
});

test('自編句進聽寫／跟讀；共用名句仍屬原名句課且 id 不重複', () => {
  const sentences = buildSentences(stages);
  const additions = sentences.filter((s) =>
    core.some((l) => l.id === s.lessonId),
  );
  assert.equal(additions.length, 15);
  assert.equal(new Set(sentences.map((s) => s.id)).size, sentences.length);
  for (const lesson of core)
    for (const point of lesson.grammar)
      for (const { quote } of point.quoteExamples) {
        const owner = sentences.find((s) => s.id === quote.audio);
        assert.equal(
          owner.lessonId,
          'stage2-quotes',
          '教材重用不能把既有聽寫紀錄改屬別課',
        );
      }
});

test('各課離線清單包含補充語音及跨課引用的名句', () => {
  const all = new Set(allAudioPaths(stages));
  for (const lesson of core) {
    const paths = new Set(lessonAudioPaths(lesson));
    for (const path of paths) assert.ok(all.has(path));
    for (const point of lesson.grammar)
      for (const { quote } of point.quoteExamples)
        assert.ok(paths.has(quote.audio), '單課下載也要帶入文法作品用例');
  }
});

const foundation = lessons.filter((l) => /^anime-lesson-0[1238]$/.test(l.id));

test('辨音、縮約、命令與綜合理解四課具備完整教材及來源', () => {
  assert.equal(foundation.length, 4);
  for (const lesson of foundation) {
    assert.equal(lesson.vocab.length, 10);
    assert.equal(lesson.grammar.length, 4);
    assert.equal(lesson.practice.length, 6);
    for (const word of lesson.vocab) {
      assert.match(word.referenceNote, /JMdict 詞條 \d+/);
      assert.match(word.referenceUrl, /^https:\/\//);
      assert.ok(existsSync(`public/${word.audio}`));
    }
    for (const point of lesson.grammar) {
      assert.match(point.referenceUrl, /^https:\/\//);
      assert.ok(point.examples.length > 0);
      assert.ok(point.quoteExamples.length > 0);
      for (const ex of point.examples) {
        assert.match(ex.source, /自行編寫.*非作品台詞/);
        assert.ok(existsSync(`public/${ex.audio}`));
      }
      for (const ex of point.quoteExamples) {
        assert.ok(bank.includes(ex.quote));
        assert.match(ex.referenceUrl, /^https:\/\//);
        assert.ok(lessonAudioPaths(lesson).includes(ex.quote.audio));
      }
    }
  }
});

test('既有 89 個理解題 id 保留，四課新增題另存且答案有效', () => {
  const original = [];
  const newIds = [];
  for (const lesson of lessons.filter((l) => l.training)) {
    for (const clip of trainingClips(lesson.training)) {
      for (const question of clip.questions) {
        const id = listeningRecordId(lesson.id, clip, question);
        if (foundation.includes(lesson) && question.id !== 'meaning') {
          newIds.push(id);
          assert.equal(new Set(question.options).size, question.options.length);
          assert.ok(question.options[question.answer]);
          assert.ok(question.explanation);
        } else original.push(id);
      }
    }
  }
  assert.equal(original.length, 89);
  assert.equal(
    createHash('sha256').update(original.sort().join('\n')).digest('hex'),
    'd6ebf31e9d0b0d372208d06bebe2e641ac135a677bf3dfbf2a980cdaf82c46e7',
  );
  assert.equal(newIds.length, 16);
  assert.equal(new Set([...original, ...newIds]).size, 105);
  for (const lesson of foundation) {
    assert.equal(
      trainingClips(lesson.training).flatMap((c) =>
        c.questions.filter((q) => q.id !== 'meaning'),
      ).length,
      4,
    );
  }
});

test('四課新增 40 張 FSRS 卡與 16 句聽寫／跟讀，不改名句歸屬', () => {
  const cards = buildCards(stages).filter((c) =>
    foundation.some((l) => l.id === c.lessonId),
  );
  assert.equal(cards.length, 40);
  assert.equal(new Set(cards.map((c) => c.id)).size, 40);
  const sentences = buildSentences(stages);
  assert.equal(
    sentences.filter((s) => foundation.some((l) => l.id === s.lessonId)).length,
    16,
  );
  assert.equal(new Set(sentences.map((s) => s.id)).size, sentences.length);
  for (const lesson of foundation)
    for (const point of lesson.grammar)
      for (const { quote } of point.quoteExamples)
        assert.equal(
          sentences.find((s) => s.id === quote.audio).lessonId,
          'stage2-quotes',
        );
});
