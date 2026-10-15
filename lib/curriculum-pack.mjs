/** Deduplicate progress identifiers in the transmitted index without changing them.
 * @param {import('./curriculum-index.mjs').CurriculumIndex} index */
export function packCurriculumIndex(index) {
  /** @type {string[]} */
  const ids = [];
  /** @type {Map<string,number>} */
  const positions = new Map();
  const pack = (/** @type {string[]} */ values) =>
    values.map((id) => {
      const known = positions.get(id);
      if (known !== undefined) return known;
      const position = ids.length;
      positions.set(id, position);
      ids.push(id);
      return position;
    });
  const stages = index.stages.map((s) => ({
    ...s,
    lessons: s.lessons.map((l) => ({
      ...l,
      vocabIds: pack(l.vocabIds),
      dictationIds: pack(l.dictationIds),
      listeningIds: pack(l.listeningIds),
      grammarIds: pack(l.grammarIds),
    })),
  }));
  const categories = Object.fromEntries(
    Object.entries(index.categories).map(([k, c]) => [
      k,
      { cardIds: pack(c.cardIds), sentenceIds: pack(c.sentenceIds) },
    ]),
  );
  return { ids, stages, categories };
}
/** @param {ReturnType<typeof packCurriculumIndex>} packed
 * @returns {import('./curriculum-index.mjs').CurriculumIndex} */
export function unpackCurriculumIndex(packed) {
  const unpack = (/** @type {number[]} */ values) =>
    values.map((i) => packed.ids[i]);
  return {
    stages: packed.stages.map((s) => ({
      ...s,
      lessons: s.lessons.map((l) => ({
        ...l,
        vocabIds: unpack(l.vocabIds),
        dictationIds: unpack(l.dictationIds),
        listeningIds: unpack(l.listeningIds),
        grammarIds: unpack(l.grammarIds),
      })),
    })),
    categories: Object.fromEntries(
      Object.entries(packed.categories).map(([k, c]) => [
        k,
        { cardIds: unpack(c.cardIds), sentenceIds: unpack(c.sentenceIds) },
      ]),
    ),
  };
}
