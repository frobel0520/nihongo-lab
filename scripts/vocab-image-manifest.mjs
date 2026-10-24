// 單字圖片版本清單（T161）：由實際要發布的 SVG 位元組計算 SHA-256 前 12 碼與大小。
// Vite 以虛擬模組提供給 App；測試直接呼叫 buildVocabImageManifestRows。不提交產生物，避免與檔案不同步。
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { IMAGE_VERSION_LENGTH } from '../lib/vocab-image-offline.mjs';

const VIRTUAL_ID = 'virtual:vocab-image-manifest';
const RESOLVED_ID = '\0' + VIRTUAL_ID;

/** @param {string} [dir] @returns {Promise<import('../lib/vocab-image-offline.mjs').VocabImageRow[]>} */
export async function buildVocabImageManifestRows(dir = 'public/images/vocab') {
  const names = (await readdir(dir)).filter((f) => f.endsWith('.svg')).sort();
  return Promise.all(
    names.map(async (file) => {
      const bytes = await readFile(join(dir, file));
      const version = createHash('sha256').update(bytes).digest('hex').slice(0, IMAGE_VERSION_LENGTH);
      return /** @type {import('../lib/vocab-image-offline.mjs').VocabImageRow} */ ([
        file.slice(0, -4),
        version,
        bytes.length,
      ]);
    }),
  );
}

/** @returns {import('vite').Plugin} */
export function vocabImageManifest() {
  /** @type {string} */
  let dir = resolve('public/images/vocab');
  return {
    name: 'vocab-image-manifest',
    configResolved(config) {
      dir = resolve(config.publicDir, 'images/vocab');
    },
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : null;
    },
    async load(id) {
      if (id !== RESOLVED_ID) return null;
      const rows = await buildVocabImageManifestRows(dir);
      for (const [name] of rows) this.addWatchFile(join(dir, `${name}.svg`));
      return `export const VOCAB_IMAGE_ROWS = ${JSON.stringify(rows)};`;
    },
  };
}
