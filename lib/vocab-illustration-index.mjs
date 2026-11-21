/** 配圖對照的瀏覽器精簡版（T196）。作者資料 lib/vocab-illustrations.mjs 保留詞面、讀音與翻譯；
 * 瀏覽器只需要卡片 ID、內容雜湊與圖檔名，仍要求詞面、讀音與翻譯都和核實時一致才顯示圖。
 * 原神語音卡不顯示圖片（T178），不送到瀏覽器。 */

const GENSHIN_CARD = 'game-card:game:genshin:';
const PREFIX = 'images/vocab/';
const SUFFIX = '.svg';

/** FNV-1a 32 位元，base36；只用來偵測卡片內容改變，不作安全用途。
 * @param {Pick<import('./srs.mjs').Card, 'word' | 'reading' | 'zh'>} card */
export function illustrationContentKey(card) {
  const text = `${card.word}\u0000${card.reading}\u0000${card.zh}`;
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

/** @typedef {[id: string, contentKey: string, file: string]} IllustrationRow */

/** @param {readonly {id: string, word: string, reading: string, zh: string, src: string}[]} list
 * @returns {IllustrationRow[]} */
export function compactIllustrations(list) {
  return list
    .filter((item) => !item.id.startsWith(GENSHIN_CARD))
    .map((item) => {
      if (!item.src.startsWith(PREFIX) || !item.src.endsWith(SUFFIX))
        throw new Error(`配圖路徑格式不符：${item.src}`);
      return [
        item.id,
        illustrationContentKey(item),
        item.src.slice(PREFIX.length, -SUFFIX.length),
      ];
    });
}

/** @param {readonly IllustrationRow[]} rows */
export function createIllustrationLookup(rows) {
  const byId = new Map(rows.map((row) => [row[0], row]));
  /** @param {Pick<import('./srs.mjs').Card, 'id' | 'word' | 'reading' | 'zh'>} card */
  return (card) => {
    const row = byId.get(card.id);
    return row && row[1] === illustrationContentKey(card)
      ? { src: PREFIX + row[2] + SUFFIX }
      : undefined;
  };
}
