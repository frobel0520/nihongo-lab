import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { sep } from 'node:path';
import { stages } from '../curriculum/lessons.mjs';

/** 課程資料引用的所有音檔（單字、文法例句、對話、名句）。 */
function referencedAudio() {
  const paths = new Set();
  for (const stage of stages) {
    for (const lesson of stage.lessons) {
      for (const line of [
        ...lesson.vocab,
        ...lesson.grammar.flatMap((g) => g.examples),
        ...lesson.dialogue,
        ...(lesson.quotes ?? []),
      ]) {
        paths.add(line.audio);
      }
    }
  }
  return paths;
}

test('public/audio 底下的 mp3 都有被課程引用（音檔路徑由內容雜湊決定，改文字後舊檔要刪掉）', () => {
  const referenced = referencedAudio();
  const files = readdirSync('public/audio', { recursive: true })
    .map((file) => `audio/${String(file).split(sep).join('/')}`)
    .filter((file) => file.endsWith('.mp3'));
  const orphans = files.filter((file) => !referenced.has(file));
  assert.deepEqual(orphans, [], `沒有被引用的音檔：${orphans.join('、')}`);
});
