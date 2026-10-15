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
  assert.deepEqual(await evaluate(serializeCurriculumPayload(data)), data);
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
