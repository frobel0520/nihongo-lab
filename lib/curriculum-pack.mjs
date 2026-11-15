/** @typedef {number | [start: number, count: number]} PackedReference */

/** Consecutive table references need only a start and count on the wire.
 * Keep short runs literal; never sort or deduplicate an individual ID list.
 * @param {number[]} values
 * @returns {PackedReference[]} */
function packReferences(values) {
  /** @type {PackedReference[]} */
  const result = [];
  for (let i = 0; i < values.length;) {
    let end = i + 1;
    while (end < values.length && values[end] === values[end - 1] + 1) end++;
    if (end - i >= 3) result.push([values[i], end - i]);
    else result.push(...values.slice(i, end));
    i = end;
  }
  return result;
}

/** Deduplicate progress identifiers in the transmitted index without changing them.
 * @param {import('./curriculum-index.mjs').CurriculumIndex} index */
export function packCurriculumIndex(index) {
  /** @type {string[]} */
  const ids = [];
  /** @type {Map<string,number>} */
  const positions = new Map();
  const pack = (/** @type {string[]} */ values) =>
    packReferences(values.map((id) => {
      const known = positions.get(id);
      if (known !== undefined) return known;
      const position = ids.length;
      positions.set(id, position);
      ids.push(id);
      return position;
    }));
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
  const unpack = (/** @type {PackedReference[]} */ values) => {
    /** @type {string[]} */
    const result = [];
    for (const ref of values) {
      if (typeof ref === 'number') result.push(packed.ids[ref]);
      else
        for (let i = ref[0]; i < ref[0] + ref[1]; i++)
          result.push(packed.ids[i]);
    }
    return result;
  };
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
