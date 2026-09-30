// 從 curriculum/lessons.mjs 產生 scripts/synthesize.mjs --batch 用的 jobs.json
// 加 --missing 只產生 public/ 底下還沒有音檔的項目（新增教材後補產用，不重做既有音檔）。
import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { stages } from '../curriculum/lessons.mjs';

const onlyMissing = process.argv.includes('--missing');
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
    for (const quote of lesson.quotes ?? []) {
      jobs.push({ voice: quote.voice, text: quote.jp, out: `public/${quote.audio}` });
    }
  }
}

const selected = onlyMissing ? jobs.filter((job) => !existsSync(job.out)) : jobs;
await writeFile('scripts/audio-jobs.json', JSON.stringify(selected, null, 2));
console.log(`wrote ${selected.length} jobs to scripts/audio-jobs.json`);
