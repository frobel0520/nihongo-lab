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
