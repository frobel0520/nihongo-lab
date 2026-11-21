// T196：單字卡配圖對照的瀏覽器版由作者資料在 build 時產生，只含 ID、內容雜湊與圖檔名。
import { VOCAB_ILLUSTRATIONS } from '../lib/vocab-illustrations.mjs';
import { compactIllustrations } from '../lib/vocab-illustration-index.mjs';

const VIRTUAL_ID = 'virtual:vocab-illustration-index';
const RESOLVED_ID = '\0' + VIRTUAL_ID;

export function vocabIllustrationIndex() {
  return {
    name: 'vocab-illustration-index',
    /** @param {string} id */
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : null;
    },
    /** @param {string} id */
    load(id) {
      if (id !== RESOLVED_ID) return null;
      return `export const VOCAB_ILLUSTRATION_ROWS = ${JSON.stringify(compactIllustrations(VOCAB_ILLUSTRATIONS))};`;
    },
  };
}
