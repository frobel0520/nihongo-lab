import { readFileSync } from 'node:fs';
import { beforeRelativeClauseWording } from './relative-clause-baseline.mjs';
export const jlptBaseline = JSON.parse(readFileSync(new URL('../fixtures/curriculum-069b0f2-jlpt.json', import.meta.url), 'utf8'));

// Restore only the reviewed metadata additions for earlier content golden checks.
// Current authored data and progress identities have their own independent checks.
export function beforeJlptMetadata(stages) {
  const historical = beforeRelativeClauseWording(stages);
  for (const entry of jlptBaseline.approvedTags) {
    const lesson = historical.flatMap(s => s.lessons).find(l => l.id === entry.lessonId);
    delete lesson.grammar[entry.index].jlpt;
  }
  return historical;
}
