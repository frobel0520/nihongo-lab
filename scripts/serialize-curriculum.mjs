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
  const visit = (/** @type {unknown} */ item) => {
    if (typeof item === 'string') counts.set(item, (counts.get(item) ?? 0) + 1);
    else if (Array.isArray(item)) item.forEach(visit);
    else if (item && typeof item === 'object')
      for (const [key, entry] of Object.entries(item)) {
        keyCounts.set(key, (keyCounts.get(key) ?? 0) + 1);
        visit(entry);
      }
  };
  visit(data);
  const strings = [...counts]
    .filter(
      ([text, count]) =>
        count > 1 && Buffer.byteLength(JSON.stringify(text)) >= 24,
    )
    .map(([text]) => text);
  const positions = new Map(strings.map((text, i) => [text, i]));
  // Repeated audio directories stay ordinary strings after module evaluation.
  // Count emitted occurrences: a shared value appears only once in its table.
  /** @type {Map<string,number>} */
  const pathCounts = new Map();
  for (const [text, count] of counts) {
    if (!text.startsWith('audio/')) continue;
    const prefix = text.slice(0, text.lastIndexOf('/') + 1);
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
    const prefix = text.slice(0, text.lastIndexOf('/') + 1);
    const index = pathPositions.get(prefix);
    return index === undefined
      ? JSON.stringify(text)
      : `paths[${index}]+${JSON.stringify(text.slice(prefix.length))}`;
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
        shared.push(template);
        for (; i < end; i++) {
          const head = encode(
            Object.fromEntries(suffix(items[i]).slice(0, -common)),
          );
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
    if (item && typeof item === 'object')
      return `{${Object.entries(item)
        .map(
          ([key, entry]) =>
            `${keyPositions.has(key) ? `[keys[${keyPositions.get(key)}]]` : key === '__proto__' ? '["__proto__"]' : JSON.stringify(key)}:${encode(entry)}`,
        )
        .join(',')}}`;
    return JSON.stringify(item);
  };
  const body = encode(data);
  const sharedSource = shared.map(encode).join(',');
  return `${paths.length ? `const paths=${JSON.stringify(paths)};` : ''}${strings.length ? `const strings=[${strings.map(encodePath).join(',')}];` : ''}${keys.length ? `const keys=${JSON.stringify(keys)};` : ''}${shared.length ? `const shared=[${sharedSource}];` : ''}export default ${body};`;
}
