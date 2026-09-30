import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { stages } from '../curriculum/lessons.mjs';
import { voices } from '../curriculum/voices.mjs';
import { buildSentences } from '../lib/dictation.mjs';

const lessons = stages.flatMap((s) => s.lessons);

/** 一課裡所有帶音檔的句子（單字、文法例句、對話、名句）。 */
function linesOf(lesson) {
  return [
    ...lesson.vocab,
    ...lesson.grammar.flatMap((g) => g.examples),
    ...lesson.dialogue,
    ...(lesson.quotes ?? []),
  ];
}

test('課程 id 唯一，且每課有標題與必要陣列', () => {
  assert.equal(new Set(lessons.map((l) => l.id)).size, lessons.length);
  for (const lesson of lessons) {
    assert.ok(lesson.title);
    assert.ok(Array.isArray(lesson.vocab));
    assert.ok(Array.isArray(lesson.grammar));
    assert.ok(Array.isArray(lesson.dialogue));
    assert.ok(Array.isArray(lesson.practice));
  }
});

test('每個句子都有內容、合法的語音角色，音檔路徑全域唯一且不帶開頭斜線', () => {
  const voiceKeys = new Set(voices.map((v) => v.key));
  const paths = [];
  for (const lesson of lessons) {
    for (const line of linesOf(lesson)) {
      const text = line.jp ?? line.word;
      assert.ok(text && line.reading && line.zh, `${lesson.id} 有空欄位`);
      assert.ok(
        voiceKeys.has(line.voice),
        `${lesson.id}: 未知角色 ${line.voice}`,
      );
      assert.ok(!line.audio.startsWith('/'), `${line.audio} 不可帶開頭斜線`);
      paths.push(line.audio);
    }
  }
  assert.equal(new Set(paths).size, paths.length);
});

test('audioReady 不是 false 的課程，音檔都必須真的存在於 public/', () => {
  for (const lesson of lessons.filter((l) => l.audioReady !== false)) {
    for (const line of linesOf(lesson)) {
      assert.ok(existsSync(`public/${line.audio}`), `缺音檔：${line.audio}`);
    }
  }
});

test('audioReady 為 false 的課程不會進入聽寫與跟讀句庫', () => {
  const pendingIds = new Set(
    lessons.filter((l) => l.audioReady === false).map((l) => l.id),
  );
  assert.ok(pendingIds.size > 0);
  for (const sentence of buildSentences(stages)) {
    assert.ok(!pendingIds.has(sentence.lessonId));
  }
});

test('名句必須標明出處與解說', () => {
  const withQuotes = lessons.filter((l) => l.quotes?.length);
  assert.ok(withQuotes.length > 0);
  for (const lesson of withQuotes) {
    for (const quote of lesson.quotes) {
      assert.ok(quote.source, `${quote.jp} 缺出處`);
      assert.ok(quote.note, `${quote.jp} 缺解說`);
    }
  }
});

test('buildSentences 只在課程音檔就緒時收錄名句', () => {
  const ready = [
    {
      lessons: [
        {
          id: 'q',
          title: 'q',
          grammar: [],
          dialogue: [],
          quotes: [{ jp: 'あ', reading: 'あ', zh: 'a', audio: 'q.mp3' }],
        },
      ],
    },
  ];
  const [only] = buildSentences(ready);
  assert.equal(only.source, 'quote');
  ready[0].lessons[0].audioReady = false;
  assert.equal(buildSentences(ready).length, 0);
});
