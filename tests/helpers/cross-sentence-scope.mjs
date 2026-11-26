export const crossSentenceIds = [
  'cross-sentence-reschedule',
  'cross-sentence-lost-property',
  'cross-sentence-alternative-plan',
];

// Older golden manifests predate these three additions. Keep all their hashes.
export function beforeCrossSentence(stages) {
  return stages.map((stage) => ({
    ...stage,
    lessons: stage.lessons.filter(
      (lesson) => !crossSentenceIds.includes(lesson.id),
    ),
  }));
}
