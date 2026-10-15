/** Share repeated long strings inside one lazy payload without changing its JSON data.
 * Generated modules keep the existing default {data, notes} export and load boundary.
 * @param {unknown} value */
export function serializeCurriculumPayload(value) {
  const json = JSON.stringify(value);
  if (json === undefined)
    throw new TypeError('Curriculum payload must be JSON data');
  const data = JSON.parse(json);
  /** @type {Map<string,number>} */
  const counts = new Map();
  const visit = (/** @type {unknown} */ item) => {
    if (typeof item === 'string') counts.set(item, (counts.get(item) ?? 0) + 1);
    else if (Array.isArray(item)) item.forEach(visit);
    else if (item && typeof item === 'object')
      Object.values(item).forEach(visit);
  };
  visit(data);
  const strings = [...counts]
    .filter(
      ([text, count]) =>
        count > 1 && Buffer.byteLength(JSON.stringify(text)) >= 24,
    )
    .map(([text]) => text);
  const positions = new Map(strings.map((text, i) => [text, i]));
  /** @param {unknown} item @returns {string} */
  const encode = (item) => {
    if (typeof item === 'string' && positions.has(item))
      return `strings[${positions.get(item)}]`;
    if (Array.isArray(item)) return `[${item.map(encode).join(',')}]`;
    if (item && typeof item === 'object')
      return `{${Object.entries(item)
        .map(
          ([key, entry]) =>
            `${key === '__proto__' ? '["__proto__"]' : JSON.stringify(key)}:${encode(entry)}`,
        )
        .join(',')}}`;
    return JSON.stringify(item);
  };
  return `${strings.length ? `const strings=${JSON.stringify(strings)};` : ''}export default ${encode(data)};`;
}
