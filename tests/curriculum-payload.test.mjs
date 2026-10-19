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
test('inline ruby sharing preserves surrounding escaped text and literal reference-like input', async () => {
  const rows = Array.from({ length: 60 }, (_, i) => ({
    text: `${i}:「{仲間|なかま}と{集合場所|しゅうごうばしょ}へ」\\\n"r[0]"`,
    ruby: `{集合場所|しゅうごうばしょ}で{仲間|なかま}を${i}分待つ。`,
    marker: 'r[0]+";throw new Error("unexpected");//',
  }));
  const source = serializeCurriculumPayload({ rows });
  assert.ok(source.includes('const r='), 'fixture must exercise inline sharing');
  assert.equal(JSON.stringify(await evaluate(source)), JSON.stringify({ rows }));
});
test('shared scalar tails and record heads preserve own keys, order and independent mutable values', async () => {
  const rows = Array.from({ length: 40 }, (_, i) => ({
    ['__proto__']: { value: i },
    id: `synthetic-row-${i}`,
    text: 'tailRow0(shared[0])',
    nested: Array.from({ length: 3 }, (_, j) => ({
      index: i + j,
      common: 'A long inner scalar tail also shared while encoding the outer head',
    })),
    flag: i % 2 === 0,
    lessonId: 'synthetic-shared-listening-lesson',
    lessonTitle: 'Shared long title with "quotes" and 日本語',
    source: 'dialogue',
  }));
  const source = serializeCurriculumPayload({ rows });
  assert.ok(source.includes('const tailRow'), 'fixture must exercise combined sharing');
  const result = await evaluate(source);
  assert.equal(JSON.stringify(result), JSON.stringify({ rows }));
  for (const row of result.rows) {
    assert.ok(Object.hasOwn(row, '__proto__'));
    assert.equal(Object.getPrototypeOf(row), Object.prototype);
    assert.deepEqual(Object.keys(row), Object.keys(rows[0]));
  }
  result.rows[0].nested[0].index = -1;
  result.rows[0].__proto__.value = -1;
  result.rows[0].lessonId = 'changed';
  assert.equal(result.rows[1].nested[0].index, 1);
  assert.equal(result.rows[1].__proto__.value, 1);
  assert.equal(result.rows[1].lessonId, rows[1].lessonId);
});
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
    reading: 'しんりょうじょ',
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

test('packed progress index keeps exact IDs and key order after build-only namespace sharing', async () => {
  const { curriculumSummary } = await import('../curriculum/lessons.mjs');
  const { packCurriculumIndex, unpackCurriculumIndex } = await import('../lib/curriculum-pack.mjs');
  const packed = packCurriculumIndex(curriculumSummary);
  const source = serializeCurriculumPayload(packed);
  const result = await evaluate(source);
  assert.equal(JSON.stringify(result), JSON.stringify(packed));
  assert.deepEqual(unpackCurriculumIndex(result), curriculumSummary);
  assert.ok(Buffer.byteLength(source) < Buffer.byteLength(JSON.stringify(packed)));
});

test('identifier prefix sharing leaves authored colons, slashes and prototype-like strings literal', async () => {
  const prefix = 'scene:synthetic-long-lesson-name/with\\escape:';
  const data = Array.from({ length: 30 }, (_, i) => ({
    id: prefix + i,
    value: '__proto__:literal/strings[0]',
    ['__proto__']: 'own:literal/paths[0]',
    note: '引用：https://example.com/a:b；不是程式碼',
  }));
  const source = serializeCurriculumPayload(data);
  const result = await evaluate(source);
  assert.equal(JSON.stringify(result), JSON.stringify(data));
  assert.ok(result.every(row => Object.hasOwn(row, '__proto__')));
  result[0].id = 'only-one-row';
  assert.equal(result[1].id, data[1].id);
  assert.ok(Buffer.byteLength(source) < Buffer.byteLength('export default ' + JSON.stringify(data)));
});

test('repeated record layouts preserve argument values, key order and fresh nested objects', async () => {
  const rows = Array.from({ length: 12 }, (_, i) => ({
    ['__proto__']: `own-${i}`,
    constructor: i,
    'quoted " key': [i, false, null, 'row0(strings[0])'],
    nested: { value: i },
    flag: i % 2 === 0,
    empty: '',
  }));
  // Reverse one layout so sharing a similar set of keys cannot reorder it.
  const reversed = rows.map((r) => Object.fromEntries(Object.entries(r).reverse()));
  const expected = { rows, reversed };
  const result = await evaluate(serializeCurriculumPayload(expected));
  assert.deepEqual(result, expected);
  assert.equal(JSON.stringify(result), JSON.stringify(expected));
  for (const row of [...result.rows, ...result.reversed]) {
    assert.ok(Object.hasOwn(row, '__proto__'));
    assert.equal(Object.getPrototypeOf(row), Object.prototype);
  }
  result.rows[0].nested.value = 100;
  result.rows[0]['quoted " key'].push('changed');
  assert.equal(result.reversed[0].nested.value, 0);
  assert.equal(result.rows[1].nested.value, 1);
  assert.equal(result.reversed[0]['quoted " key'].length, 4);
  assert.equal(rows[0].nested.value, 0);
});
