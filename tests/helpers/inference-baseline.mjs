import { readFileSync } from 'node:fs';
import { beforeFollowupInference } from './followup-inference-baseline.mjs';
export const inferenceBaseline = JSON.parse(readFileSync(new URL('../fixtures/curriculum-5ee1dc2-inference.json', import.meta.url), 'utf8'));

// Preserve earlier golden hashes. Restore ONLY the three explicitly approved
// question revisions; current scope and identities are checked independently.
export function beforeInference(stages) {
  const historical = beforeFollowupInference(stages);
  for (const old of inferenceBaseline.lessons) {
    const lesson = historical.flatMap(s => s.lessons).find(l => l.id === old.id);
    const index = lesson.scene.questions.findIndex(q => q.id === 'understanding-3');
    lesson.scene.questions[index] = structuredClone(old.scene.questions[index]);
  }
  return historical;
}
