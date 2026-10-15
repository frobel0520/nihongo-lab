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
  /** @param {unknown} item @returns {string} */
  const encode = (item) => {
    if (typeof item === 'string' && positions.has(item))
      return `strings[${positions.get(item)}]`;
    if (typeof item === 'string') return encodePath(item);
    if (Array.isArray(item)) return `[${item.map(encode).join(',')}]`;
    if (item && typeof item === 'object')
      return `{${Object.entries(item)
        .map(
          ([key, entry]) =>
            `${keyPositions.has(key) ? `[keys[${keyPositions.get(key)}]]` : key === '__proto__' ? '["__proto__"]' : JSON.stringify(key)}:${encode(entry)}`,
        )
        .join(',')}}`;
    return JSON.stringify(item);
  };
  return `${paths.length ? `const paths=${JSON.stringify(paths)};` : ''}${strings.length ? `const strings=[${strings.map(encodePath).join(',')}];` : ''}${keys.length ? `const keys=${JSON.stringify(keys)};` : ''}export default ${encode(data)};`;
}
