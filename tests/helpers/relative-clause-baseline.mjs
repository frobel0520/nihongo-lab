import { readFileSync } from 'node:fs';
export const wordingBaseline = JSON.parse(readFileSync(new URL('../fixtures/curriculum-e356eb4-wording.json', import.meta.url), 'utf8'));

// Restore only T141's explanatory note when checking earlier content baselines.
export function beforeRelativeClauseWording(stages) {
  const historical = structuredClone(stages);
  const { lessonId, pointIndex, note } = wordingBaseline;
  historical.flatMap(s => s.lessons).find(l => l.id === lessonId).grammar[pointIndex].note = note;
  return historical;
}
