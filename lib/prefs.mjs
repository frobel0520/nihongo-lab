/**
 * 顯示偏好（每台裝置各自的便利設定，不是學習進度，所以和 progress.mjs 分開存）。
 *
 * @typedef {{ furigana: boolean }} Prefs
 */

/** @returns {Prefs} */
export function defaultPrefs() {
  return { furigana: true };
}

/**
 * 解析 localStorage 存的字串；沒存過、壞掉或欄位型別不對，都退回預設值，不丟錯。
 *
 * @param {string | null} raw
 * @returns {Prefs}
 */
export function parsePrefs(raw) {
  const prefs = defaultPrefs();
  if (raw === null) return prefs;
  try {
    const data = JSON.parse(raw);
    if (typeof data?.furigana === 'boolean') prefs.furigana = data.furigana;
  } catch {
    // 壞掉的偏好直接用預設值
  }
  return prefs;
}
