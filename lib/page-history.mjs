/** 最近40個實際到訪項目；不持久化。返回已淘汰項目時由導航建立新的預設狀態。 */
export const PAGE_HISTORY_LIMIT = 40;

/** @template {{id: string}} T
 * @param {Map<string, T>} entries
 * @param {T} entry
 */
export function rememberPageEntry(entries, entry) {
  entries.delete(entry.id);
  entries.set(entry.id, entry);
  while (entries.size > PAGE_HISTORY_LIMIT) {
    const oldest = entries.keys().next().value;
    if (oldest !== undefined) entries.delete(oldest);
  }
}

/** Only walk the retained lineage of this actual browser entry, never a
 * same-URL entry from a different visit or an evicted/previous App session.
 * @template {{id:string,parentId:string|null,position:number}} T
 * @param {Map<string,T>} entries
 * @param {T} entry
 * @param {(parent:T)=>boolean} matches
 * @returns {number|null} Safe negative history.go delta, or a parent-page fallback.
 */
export function pageReturnDelta(entries, entry, matches) {
  let parent = entry.parentId;
  let position = entry.position;
  const visited = new Set([entry.id]);
  while (parent && !visited.has(parent)) {
    visited.add(parent);
    const candidate = entries.get(parent);
    if (!candidate || candidate.position >= position) return null;
    if (matches(candidate)) return candidate.position - entry.position;
    parent = candidate.parentId;
    position = candidate.position;
  }
  return null;
}
