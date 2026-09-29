// 從 curriculum/lessons.mjs 產生 scripts/synthesize.mjs --batch 用的 jobs.json
import { writeFile } from 'node:fs/promises';
import { stages } from '../curriculum/lessons.mjs';

const jobs = [];

for (const stage of stages) {
  for (const lesson of stage.lessons) {
    for (const item of lesson.vocab ?? []) {
      jobs.push({ voice: item.voice, text: item.word, out: `public/${item.audio}` });
    }
    for (const point of lesson.grammar ?? []) {
      for (const ex of point.examples) {
        jobs.push({ voice: ex.voice, text: ex.jp, out: `public/${ex.audio}` });
      }
    }
    for (const line of lesson.dialogue ?? []) {
      jobs.push({ voice: line.voice, text: line.jp, out: `public/${line.audio}` });
    }
  }
}

await writeFile('scripts/audio-jobs.json', JSON.stringify(jobs, null, 2));
console.log(`wrote ${jobs.length} jobs to scripts/audio-jobs.json`);
