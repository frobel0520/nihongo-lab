import { readFileSync } from 'node:fs';
export const followupInferenceBaseline = JSON.parse(readFileSync(new URL('../fixtures/curriculum-8c0c02f-inference.json', import.meta.url), 'utf8'));

// Only restore the three T139 question revisions for earlier golden checks.
// The current curriculum has its own independent 8c0c02f scope and ID checks.
export function beforeFollowupInference(stages) {
  const historical = structuredClone(stages);
  for (const old of followupInferenceBaseline.lessons) {
    const lesson = historical.flatMap(s => s.lessons).find(l => l.id === old.id);
    const index = lesson.scene.questions.findIndex(q => q.id === 'understanding-3');
    lesson.scene.questions[index] = structuredClone(old.scene.questions[index]);
  }
  return historical;
}
