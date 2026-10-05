/**
 * 歌曲閱讀器的靜態資產（npm run dev／build 之前自動執行）：
 *   - kuromoji 斷詞字典：從 node_modules/@patdx/kuromoji/dict 複製到 public/song-assets/kuromoji/
 * 這些檔案是套件提供的第三方資料，不提交進 Git（public/song-assets/ 在 .gitignore），
 * 每次建置從已安裝的套件產生。
 */
import { copyFile, mkdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { KUROMOJI_FILES, KUROMOJI_PATH } from '../lib/song-tokens.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'node_modules', '@patdx', 'kuromoji', 'dict');
const target = join(root, 'public', KUROMOJI_PATH);

/** @param {string} path */
async function sizeOf(path) {
  try {
    return (await stat(path)).size;
  } catch {
    return -1;
  }
}

await mkdir(target, { recursive: true });
let copied = 0;
let bytes = 0;
for (const name of KUROMOJI_FILES) {
  const from = join(source, name);
  const to = join(target, name);
  const size = await sizeOf(from);
  if (size < 0) {
    throw new Error(`找不到 ${from}；請先執行 npm install（@patdx/kuromoji）。`);
  }
  bytes += size;
  if ((await sizeOf(to)) !== size) {
    await copyFile(from, to);
    copied++;
  }
}
console.log(
  `song assets：kuromoji 字典 ${KUROMOJI_FILES.length} 檔（${(bytes / 1024 / 1024).toFixed(1)}MB），本次複製 ${copied} 檔 → public/${KUROMOJI_PATH}`,
);
