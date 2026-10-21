import { readFileSync } from 'node:fs';
export const reviewBaseline = JSON.parse(readFileSync(new URL('../fixtures/curriculum-edd78cd-review-closeout.json', import.meta.url), 'utf8'));

// Earlier golden checks see only the explicitly reviewed T149 fields restored.
// The new scope test compares all current content and identities independently.
export function beforeReviewCloseout(stages) {
  const historical = structuredClone(stages);
  const lessons = historical.flatMap(s => s.lessons);
  for (const entry of reviewBaseline.notes)
    lessons.find(l => l.id === entry.lessonId).grammar[entry.index].note = entry.note;
  const t = reviewBaseline.translation;
  lessons.find(l => l.id === t.lessonId).grammar[t.pointIndex].examples[t.exampleIndex].zh = t.zh;
  const j = reviewBaseline.jlpt;
  const lesson = lessons.find(l => l.id === j.lessonId);
  const point = lesson.grammar[j.pointIndex];
  // Restore the original key position as the historical hashes preserve order.
  lesson.grammar[j.pointIndex] = Object.fromEntries(Object.entries(point)
    .filter(([key]) => key !== 'jlpt')
    .flatMap(([key,value]) => key === 'note' ? [[key,value],['jlpt',[...j.old]]] : [[key,value]]));
  return historical;
}
