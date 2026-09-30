import type { StorageLike } from '../../lib/progress-store.mjs';

/**
 * 取得 localStorage；隱私模式或被停用時存取本身就會丟錯，這時回傳 null，
 * 讀寫函式（lib/progress-store.mjs）會把它當成「儲存空間不可用」並明確提示。
 */
export function getStorage(): StorageLike | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
