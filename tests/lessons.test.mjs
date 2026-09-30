import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { stages } from '../curriculum/lessons.mjs';
import { voices } from '../curriculum/voices.mjs';
import { buildSentences } from '../lib/dictation.mjs';
import { rubyParts } from '../lib/furigana.mjs';

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

test('audioReady 為 false 的課程不會進入聽寫與跟讀句庫（目前所有課程音檔都就緒，機制另由 dictation 測試涵蓋）', () => {
  const pendingIds = new Set(
    lessons.filter((l) => l.audioReady === false).map((l) => l.id),
  );
  for (const sentence of buildSentences(stages)) {
    assert.ok(!pendingIds.has(sentence.lessonId));
  }
});

test('文法點的 jlpt 若有標，必須是非空字串陣列且同一課內不重複', () => {
  for (const lesson of lessons) {
    const ids = lesson.grammar.flatMap((g) => g.jlpt ?? []);
    for (const g of lesson.grammar.filter((x) => x.jlpt)) {
      assert.ok(
        Array.isArray(g.jlpt) && g.jlpt.length > 0,
        `${g.pattern} 的 jlpt 是空的`,
      );
      assert.ok(
        g.jlpt.every((id) => typeof id === 'string' && id),
        `${g.pattern} 的 jlpt 有非字串`,
      );
    }
    assert.equal(new Set(ids).size, ids.length, `${lesson.id} 的 jlpt id 重複`);
  }
});

test('每個含漢字的句子都能標出讀音（自動對齊，或用 ruby 欄位手動標）', () => {
  for (const lesson of lessons) {
    for (const line of linesOf(lesson)) {
      const jp = line.jp ?? line.word;
      if (!/[\p{Script=Han}々]/u.test(jp)) continue;
      const parts = rubyParts({ jp, reading: line.reading, ruby: line.ruby });
      assert.ok(
        parts,
        `${lesson.id}「${jp}」對不起來：讀音「${line.reading}」與原文不一致，或漢字段之間缺少邊界；請修正讀音，或加 ruby 欄位手動標`,
      );
      assert.equal(parts.map((p) => p.text).join(''), jp);
      assert.ok(parts.every((p) => p.ruby === undefined || p.ruby !== ''));
    }
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

test('名句解說不用「前面的例句」這種相對位置的說法（順序一調整就失效），要對照別句就直接寫作品與台詞', () => {
  const relative =
    /(前面|後面|上面|下面|前一|後一|上一|下一)(的)?(例句|句子|一句|名句|台詞)/;
  for (const lesson of lessons) {
    for (const quote of lesson.quotes ?? []) {
      assert.ok(
        !relative.test(quote.note),
        `${quote.source}「${quote.jp}」的解說用了相對位置的說法：${quote.note}`,
      );
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
