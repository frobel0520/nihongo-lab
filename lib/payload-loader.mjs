/** Share successful payloads, but let a failed request be retried.
 * @param {Record<string,()=>Promise<{default:{data:unknown,notes:string[]}}>>} loaders
 * @param {(notes:string[])=>void} acceptNotes */
export function createPayloadLoader(loaders, acceptNotes) {
  /** @type {Map<string,Promise<unknown>>} */
  const pending = new Map();
  return async (/** @type {string} */ key) => {
    if (!loaders[key]) return undefined;
    if (!pending.has(key))
      pending.set(
        key,
        loaders[key]()
          .then((m) => {
            acceptNotes(m.default.notes);
            return m.default.data;
          })
          .catch((error) => {
            pending.delete(key);
            throw error;
          }),
      );
    return pending.get(key);
  };
}
