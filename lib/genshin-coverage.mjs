/** Category names are metadata, not game dialogue. */
export const genshinActionCategories = [
  { key: 'join', label: '編隊加入', prefix: 'チーム加入' },
  { key: 'skill', label: '元素技能', prefix: '元素スキル' },
  { key: 'burst', label: '元素爆發', prefix: '元素爆発' },
];
/** @param {string} title */
export function genshinActionCategory(title) {
  const normalized = title.normalize('NFKC');
  return (
    genshinActionCategories.find(
      ({ prefix }) =>
        normalized === prefix ||
        normalized.startsWith(prefix + '·') ||
        normalized.startsWith(prefix + '・'),
    )?.key ?? null
  );
}
/** @typedef {{title: string, voicefile: string}} ActionMetadata */
/** @param {ActionMetadata[]} actions */
export function countGenshinActions(actions) {
  return Object.fromEntries(
    genshinActionCategories.map(({ key }) => {
      const matches = actions.filter(
        (r) => genshinActionCategory(r.title) === key,
      );
      return [
        key,
        {
          entries: matches.length,
          voicefiles: new Set(matches.map((r) => r.voicefile)).size,
        },
      ];
    }),
  );
}
