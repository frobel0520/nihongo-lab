import { readFileSync } from 'node:fs';
export const noteClarificationBaseline = JSON.parse(
  readFileSync(new URL('../fixtures/curriculum-04070ca-notes.json', import.meta.url), 'utf8'),
);

// Restore only the two authorized T193 notes for immutable earlier golden checks.
// The current scope test independently checks all authored data, IDs and catalogs.
export function beforeNoteClarifications(stages) {
  const historical = structuredClone(stages);
  for (const entry of noteClarificationBaseline.notes)
    historical.flatMap((s) => s.lessons)
      .find((l) => l.id === entry.lessonId).grammar[entry.index].note = entry.note;
  return historical;
}
