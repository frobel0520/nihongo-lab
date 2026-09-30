/**
 * 鍵盤快捷鍵的判斷（純邏輯，不碰 DOM；呼叫端把事件目標的幾個屬性傳進來）。
 * 全視窗攔截按鍵時，不能搶走使用者在輸入框打字、或在按鈕／連結上按空白鍵想「按下去」的操作。
 *
 * @typedef {{
 *   tagName?: string,
 *   isContentEditable?: boolean,
 *   role?: string | null,
 * }} KeyTarget
 */

const TEXT_ENTRY_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);
const ACTIVATABLE_TAGS = new Set(['BUTTON', 'A', 'SUMMARY']);
const ACTIVATABLE_ROLES = new Set([
  'button',
  'link',
  'checkbox',
  'radio',
  'switch',
  'tab',
  'menuitem',
  'option',
]);

/** @param {KeyTarget | null | undefined} target */
const tagOf = (target) => target?.tagName?.toUpperCase() ?? '';

/**
 * 目標是不是會吃掉字元的輸入元件（輸入框、下拉選單、可編輯區）。快捷鍵數字鍵在這裡不能攔截。
 *
 * @param {KeyTarget | null | undefined} target
 */
export function isTextEntry(target) {
  return (
    TEXT_ENTRY_TAGS.has(tagOf(target)) || target?.isContentEditable === true
  );
}

/**
 * 目標是不是本身就會回應空白鍵／Enter 的元件（按鈕、連結、核取方塊…）。
 * 空白鍵快捷鍵在這裡不能攔截，否則焦點在「播放」按鈕上按空白鍵會變成翻卡。
 *
 * @param {KeyTarget | null | undefined} target
 */
export function isInteractive(target) {
  return (
    isTextEntry(target) ||
    ACTIVATABLE_TAGS.has(tagOf(target)) ||
    ACTIVATABLE_ROLES.has(target?.role ?? '')
  );
}
