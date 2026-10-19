/** Share repeated strings, field names and audio directories within one JSON payload.
 * Generated modules keep the existing default {data, notes} export and load boundary.
 * @param {unknown} value */
export function serializeCurriculumPayload(value) {
  const json = JSON.stringify(value);
  if (json === undefined)
    throw new TypeError('Curriculum payload must be JSON data');
  const data = JSON.parse(json);
  /** @type {Map<string,number>} */
  const counts = new Map();
  /** @type {Map<string,number>} */
  const keyCounts = new Map();
  /** @type {Map<string, {keys:string[], count:number}>} */
  const shapes = new Map();
  const visit = (/** @type {unknown} */ item) => {
    if (typeof item === 'string') counts.set(item, (counts.get(item) ?? 0) + 1);
    else if (Array.isArray(item)) item.forEach(visit);
    else if (item && typeof item === 'object') {
      const keys = Object.keys(item);
      const signature = JSON.stringify(keys);
      const shape = shapes.get(signature) ?? { keys, count: 0 };
      shape.count++;
      shapes.set(signature, shape);
      for (const [key, entry] of Object.entries(item)) {
        keyCounts.set(key, (keyCounts.get(key) ?? 0) + 1);
        visit(entry);
      }
    }
  };
  visit(data);
  /** @type {string[]} */
  const strings = [];
  // Include both the table entry and every emitted reference. Short, frequent
  // readings can save bytes too; a fixed minimum length misses those repeats.
  for (const [text, count] of counts) {
    const literalBytes = Buffer.byteLength(JSON.stringify(text));
    const referenceBytes = 'strings[]'.length + String(strings.length).length;
    if (count > 1 && (count - 1) * literalBytes > count * referenceBytes + 1)
      strings.push(text);
  }
  const positions = new Map(strings.map((text, i) => [text, i]));
  // Share repeated inline ruby literally at build time. Concatenation evaluates
  // to the original string; this does not add a decoder or change load boundaries.
  /** @type {Map<string,number>} */
  const fragmentCounts = new Map();
  for (const [text, count] of counts)
    for (const match of text.matchAll(/\{[^{}|]+\|[^{}]+\}/g))
      fragmentCounts.set(match[0], (fragmentCounts.get(match[0]) ?? 0) +
        (positions.has(text) ? 1 : count));
  /** @type {string[]} */
  const fragments = [];
  for (const [text, count] of fragmentCounts) {
    const referenceBytes = 3 + String(fragments.length).length;
    // Allow for the extra quotes and concatenation around an inline fragment.
    if (count >= 3 && count * (Buffer.byteLength(text) - referenceBytes - 4) >
        Buffer.byteLength(JSON.stringify(text)) + 1) fragments.push(text);
  }
  const fragmentPositions = new Map(fragments.map((text, i) => [text, i]));
  /** @param {string} text */
  const encodeFragments = (text) => {
    const literal = JSON.stringify(text);
    /** @type {string[]} */
    const parts = [];
    let cursor = 0;
    for (const match of text.matchAll(/\{[^{}|]+\|[^{}]+\}/g)) {
      const index = fragmentPositions.get(match[0]);
      if (index === undefined) continue;
      if (match.index > cursor) parts.push(JSON.stringify(text.slice(cursor, match.index)));
      parts.push(`r[${index}]`);
      cursor = match.index + match[0].length;
    }
    if (!parts.length) return literal;
    if (cursor < text.length) parts.push(JSON.stringify(text.slice(cursor)));
    const source = parts.join('+');
    return Buffer.byteLength(source) < Buffer.byteLength(literal) ? source : literal;
  };
  // Repeated audio directories stay ordinary strings after module evaluation.
  // Count emitted occurrences: a shared value appears only once in its table.
  // Identifier namespaces use the same build-only prefix sharing as audio paths.
  const prefixOf = (/** @type {string} */ text) =>
    text.slice(0, Math.max(text.lastIndexOf('/'), text.lastIndexOf(':')) + 1);
  /** @type {Map<string,number>} */
  const pathCounts = new Map();
  for (const [text, count] of counts) {
    const prefix = prefixOf(text);
    if (prefix.length <= 6) continue;
    pathCounts.set(
      prefix,
      (pathCounts.get(prefix) ?? 0) + (positions.has(text) ? 1 : count),
    );
  }
  /** @type {string[]} */
  const paths = [];
  /** @type {Map<string,number>} */
  const pathPositions = new Map();
  for (const [prefix, count] of pathCounts) {
    const referenceBytes = 8 + String(paths.length).length;
    if (
      count * (Buffer.byteLength(prefix) - referenceBytes) <=
      Buffer.byteLength(JSON.stringify(prefix)) + 1
    )
      continue;
    pathPositions.set(prefix, paths.length);
    paths.push(prefix);
  }
  /** @param {string} text */
  const encodePath = (text) => {
    const prefix = prefixOf(text);
    const index = pathPositions.get(prefix);
    return index === undefined
      ? encodeFragments(text)
      : `paths[${index}]+${encodeFragments(text.slice(prefix.length))}`;
  };
  /** @type {string[]} */
  const keys = [];
  /** @type {Map<string,number>} */
  const keyPositions = new Map();
  // Include the table cost; short field names remain ordinary literal properties.
  for (const [key, count] of keyCounts) {
    const index = keys.length;
    const literalBytes = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key)
      ? Buffer.byteLength(key)
      : Buffer.byteLength(JSON.stringify(key));
    const referenceBytes = 5 + String(index).length;
    const tableBytes = Buffer.byteLength(JSON.stringify(key)) + 1;
    if (count * (literalBytes - referenceBytes) <= tableBytes) continue;
    keyPositions.set(key, index);
    keys.push(key);
  }
  // Share scalar field tails at build time; spread keeps row order and fresh objects.
  /** @type {Record<string,unknown>[]} */
  const shared = [];
  // Build-only constructors share field layout, never authored object values.
  // Each call creates its own object and preserves the original property order.
  const factories = [...shapes.entries()].filter(([, shape]) =>
    shape.count >= 5 && shape.keys.length >= 4,
  );
  const factoryPositions = new Map(factories.map(([signature], i) => [signature, i]));
  /** @type {string[][]} */
  const tailFactories = [];
  /** @type {Map<string,number>} */
  const tailFactoryPositions = new Map();
  /** @param {string} key */
  const encodeKey = (key) => keyPositions.has(key)
    ? `[keys[${keyPositions.get(key)}]]`
    : key === '__proto__' ? '["__proto__"]' : JSON.stringify(key);
  /** @param {object} item @returns {string} */
  const encodeObjectLiteral = (item) => `{${Object.entries(item)
    .map(([key, entry]) => `${encodeKey(key)}:${encode(entry)}`).join(',')}}`;
  /** @returns {Array<[string, unknown]>} */
  const suffix = (/** @type {unknown} */ row) =>
    row && !Array.isArray(row) && typeof row === 'object'
      ? Object.entries(row)
      : [];
  /** @param {unknown[]} items @returns {string} */
  const encodeArray = (items) => {
    /** @type {string[]} */
    const output = [];
    for (let i = 0; i < items.length;) {
      const first = suffix(items[i]),
        second = suffix(items[i + 1]);
      let common = 0;
      while (common < Math.min(first.length, second.length)) {
        const [key, value] = first[first.length - common - 1];
        const [otherKey, otherValue] = second[second.length - common - 1];
        if (
          key !== otherKey ||
          value !== otherValue ||
          (value !== null && typeof value === 'object')
        )
          break;
        common++;
      }
      const tail = first.slice(first.length - common);
      let end = i + 2;
      if (common)
        while (end < items.length) {
          const entries = suffix(items[end]);
          if (
            entries.length < common ||
            !tail.every(
              ([key, value], j) =>
                entries[entries.length - common + j][0] === key &&
                entries[entries.length - common + j][1] === value,
            )
          )
            break;
          end++;
        }
      const template = Object.fromEntries(tail);
      const encoded = common ? encode(template) : '';
      const reference = `...shared[${shared.length}]`;
      if (
        common &&
        end - i >= 3 &&
        (end - i) * (Buffer.byteLength(encoded) - 2 - reference.length) >
          Buffer.byteLength(encoded) + 1
      ) {
        const tailIndex = shared.length;
        shared.push(template);
        for (; i < end; i++) {
          const entries = suffix(items[i]).slice(0, -common);
          const headKeys = entries.map(([key]) => key);
          // Keep PR132's shared scalar values and also share the remaining
          // record layout. The spread still constructs an independent row.
          if (headKeys.length >= 4) {
            const signature = JSON.stringify(headKeys);
            let factory = tailFactoryPositions.get(signature);
            if (factory === undefined) {
              factory = tailFactories.length;
              tailFactoryPositions.set(signature, factory);
              tailFactories.push(headKeys);
            }
            output.push(`tailRow${factory}(${entries.map(([, value]) => encode(value)).join(',')},shared[${tailIndex}])`);
            continue;
          }
          const head = encodeObjectLiteral(Object.fromEntries(entries));
          output.push(
            head.slice(0, -1) + (head === '{}' ? '' : ',') + reference + '}',
          );
        }
      } else output.push(encode(items[i++]));
    }
    return `[${output.join(',')}]`;
  };
  /** @param {unknown} item @returns {string} */
  const encode = (item) => {
    if (typeof item === 'string' && positions.has(item))
      return `strings[${positions.get(item)}]`;
    if (typeof item === 'string') return encodePath(item);
    if (Array.isArray(item)) return encodeArray(item);
    if (item && typeof item === 'object') {
      const factory = factoryPositions.get(JSON.stringify(Object.keys(item)));
      if (factory !== undefined)
        return `row${factory}(${Object.values(item).map(encode).join(',')})`;
      return encodeObjectLiteral(item);
    }
    return JSON.stringify(item);
  };
  const body = encode(data);
  const sharedSource = shared.map(encode).join(',');
  const factorySource = factories.map(([, { keys }], i) =>
    `const row${i}=(${keys.map((_, j) => `v${j}`).join(',')})=>({${keys.map((key, j) => `${encodeKey(key)}:v${j}`).join(',')}});`,
  ).join('');
  const tailFactorySource = tailFactories.map((headKeys, i) =>
    `const tailRow${i}=(${headKeys.map((_, j) => `v${j}`).join(',')},tail)=>({${headKeys.map((key, j) => `${encodeKey(key)}:v${j}`).join(',')},...tail});`,
  ).join('');
  return `${paths.length ? `const paths=${JSON.stringify(paths)};` : ''}${fragments.length ? `const r=${JSON.stringify(fragments)};` : ''}${strings.length ? `const strings=[${strings.map(encodePath).join(',')}];` : ''}${keys.length ? `const keys=${JSON.stringify(keys)};` : ''}${factorySource}${tailFactorySource}${shared.length ? `const shared=[${sharedSource}];` : ''}export default ${body};`;
}
