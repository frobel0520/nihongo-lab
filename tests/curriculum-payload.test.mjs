import { test } from 'node:test';
import assert from 'node:assert/strict';
import { curriculumPayloads } from '../scripts/curriculum-chunks.mjs';
import { serializeCurriculumPayload } from '../scripts/serialize-curriculum.mjs';
import { RUBY_NOTES } from '../curriculum/ruby-notes.mjs';
import {
  annotateText,
  buildNotesIndex,
  displayedTexts,
} from '../lib/ruby-notes.mjs';
import { parseRuby } from '../lib/furigana.mjs';

const evaluate = async (source) =>
  (
    await import(
      'data:text/javascript;base64,' + Buffer.from(source).toString('base64')
    )
  ).default;
test('lazy payload modules preserve every lesson, category and audio list after string sharing', async () => {
  let originalBytes = 0,
    emittedBytes = 0;
  for (const [key, payload] of curriculumPayloads()) {
    const source = serializeCurriculumPayload(payload);
    assert.deepEqual(
      await evaluate(source),
      JSON.parse(JSON.stringify(payload)),
      key,
    );
    originalBytes += Buffer.byteLength(
      'export default ' + JSON.stringify(payload) + ';',
    );
    emittedBytes += Buffer.byteLength(source);
  }
  assert.ok(
    emittedBytes < originalBytes,
    'shared strings must reduce generated source',
  );
});
test('payload code generation preserves escaped text, repeated values and own special keys', async () => {
  const data = JSON.parse(
    '{"__proto__":"ordinary authored text","value":null}',
  );
  const repeated = 'Repeated "quoted" text with \\ and newline\n日本語';
  Object.assign(data, {
    nested: [repeated, repeated, false, 0],
    marker: 'strings[0]',
    quoted: '";throw new Error("unexpected");//',
  });
  // Repetition exercises shared field names, including an own __proto__ and a
  // quoted key. Authored text resembling generated references stays literal.
  data.repeatedRecords = Array.from({ length: 40 }, (_, index) => {
    const record = JSON.parse(
      String.raw`{"__proto__":{"authoredSpecialValue":"keys[0]"},"aLongRepeatedFieldName":"keys[0]","a long \"quoted\" field":"strings[0]"}`,
    );
    record.audio = String.raw`audio/quoted"folder\sub/clip-${index}.mp3`;
    record.pathMarker = 'paths[0]';
    return record;
  });
  const result = await evaluate(serializeCurriculumPayload(data));
  assert.deepEqual(result, data);
  for (const record of result.repeatedRecords) {
    assert.ok(Object.hasOwn(record, '__proto__'));
    assert.equal(Object.getPrototypeOf(record), Object.prototype);
  }
  assert.equal(Object.hasOwn(Object.prototype, 'authoredSpecialValue'), false);
  assert.throws(() => serializeCurriculumPayload(undefined), TypeError);
});
test('lazy annotations retain every actual ruby while author-only review entries stay in source', () => {
  const full = buildNotesIndex(RUBY_NOTES);
  assert.ok(
    RUBY_NOTES.some((note) => !parseRuby(note).some((part) => part.ruby)),
  );
  for (const [key, payload] of curriculumPayloads()) {
    const sent = buildNotesIndex(payload.notes);
    for (const text of displayedTexts(payload.data)) {
      const expected = annotateText(text, full);
      const actual = annotateText(text, sent);
      if (expected?.some((part) => part.ruby))
        assert.deepEqual(actual, expected, key + ': ' + text);
      else
        assert.equal(
          actual,
          null,
          key + ': review-only text should render as the same plain text',
        );
    }
  }
});

test('shared scalar metadata preserves key order, own special keys and independent records', async () => {
  const rows = Array.from({ length: 24 }, (_, index) => ({
    id: 'synthetic-' + index,
    nested: { index },
    lessonId: 'synthetic-listening-lesson',
    lessonTitle: 'A shared "quoted" title with \\ and 日本語',
    ['__proto__']: 'ordinary authored scalar',
    marker: 'shared[0]',
    audioReady: true,
  }));
  const result = await evaluate(serializeCurriculumPayload({ data: rows }));
  assert.equal(JSON.stringify(result), JSON.stringify({ data: rows }));
  for (const row of result.data) {
    assert.ok(Object.hasOwn(row, '__proto__'));
    assert.equal(Object.getPrototypeOf(row), Object.prototype);
    assert.equal(row.marker, 'shared[0]');
  }
  result.data[0].lessonId = 'changed-in-one-record';
  result.data[0].nested.index = -1;
  assert.equal(result.data[1].lessonId, rows[1].lessonId);
  assert.equal(result.data[1].nested.index, 1);
  assert.equal(Object.getPrototypeOf(result.data[0]), Object.prototype);
});
