import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stages } from '../curriculum/lessons.mjs';
import { voices } from '../curriculum/voices.mjs';
import { allAudioPaths, AUDIO_CACHE_NAME } from '../lib/offline.mjs';
import { AUDIO_PROSODY } from '../curriculum/audio-prosody.mjs';

test('使用者選角：保留五位原有角色及兩男聲，所有公開教材不再引用淘汰角色', () => {
  assert.deepEqual(
    voices.map((v) => v.key),
    ['tsumugi', 'hau', 'sayo', 'neko-vy', 'zunko', 'takehiro', 'ryusei'],
  );
  const allowed = new Set(voices.map((v) => v.key));
  const male = new Set(['takehiro', 'ryusei']);
  const quoteVoices = new Set();
  for (const stage of stages)
    for (const lesson of stage.lessons) {
      for (const line of [
        ...lesson.vocab,
        ...lesson.grammar.flatMap((g) => g.examples),
        ...lesson.dialogue,
      ]) {
        assert.ok(allowed.has(line.voice), line.voice);
        assert.ok(!male.has(line.voice), '男聲只加入動畫／遊戲名句');
      }
      if (lesson.dialogue.length > 1)
        assert.equal(
          new Set(lesson.dialogue.map((line) => line.voice)).size,
          2,
          lesson.id,
        );
      for (const quote of lesson.quotes ?? []) {
        assert.ok(allowed.has(quote.voice));
        quoteVoices.add(quote.voice);
      }
      for (const clip of [
        ...(lesson.training?.clips ?? []),
        ...(lesson.training?.review ?? []),
      ])
        assert.ok(allowed.has(clip.quote.voice));
    }
  assert.ok(quoteVoices.has('takehiro') && quoteVoices.has('ryusei'));
});

test('選角保留既有音檔／進度路徑與重音覆寫，升版離線快取', () => {
  const paths = new Set(allAudioPaths(stages));
  assert.equal(paths.size, 1506);
  assert.ok(paths.has('audio/stage-0/day1/gram-1-1.mp3'));
  assert.ok(paths.has('audio/stage-2/quotes/jojo-dio.mp3'));
  for (const path of Object.keys(AUDIO_PROSODY)) assert.ok(paths.has(path));
  assert.equal(AUDIO_CACHE_NAME, 'lesson-audio-v4');
});

test('選角試聽頁只列保留的七位配音角色', () => {
  const manifest = JSON.parse(
    readFileSync('public/voice-preview/manifest.json', 'utf8'),
  );
  assert.deepEqual(
    manifest.voices.map((v) => v.key),
    voices.map((v) => v.key),
  );
});
