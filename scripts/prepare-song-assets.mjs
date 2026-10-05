/**
 * 歌曲閱讀器的靜態資產（npm run dev／build 之前自動執行）：
 *   - kuromoji 斷詞字典：從 node_modules/@patdx/kuromoji/dict 複製到 public/song-assets/kuromoji/
 *   - JMdict 英文釋義索引：下載固定版本的 jmdict-simplified（common、英文），存在 .cache/jmdict/，
 *     轉成精簡索引 public/song-assets/jmdict-eng-common.json
 * 這些都是第三方資料，不提交進 Git（public/song-assets/、.cache/ 在 .gitignore），每次建置重新產生。
 *
 * 用法：node scripts/prepare-song-assets.mjs [--require-jmdict]
 *   --require-jmdict：JMdict 下載或轉換失敗時讓建置失敗（正式建置用）；沒有這個旗標時只警告，
 *   開發版照樣能跑，只是詞卡顯示「英文字典沒有載入」。
 */
import { copyFile, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';
import { JMDICT_FILE, buildJmdictIndex } from '../lib/song-lookup.mjs';
import { KUROMOJI_FILES, KUROMOJI_PATH, SONG_ASSETS_PATH } from '../lib/song-tokens.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const requireJmdict = process.argv.includes('--require-jmdict');

/** 固定版本，換版時改這裡（並在 release-audit.md 記錄）。 */
export const JMDICT_VERSION = '3.6.2+20260928191014';
const JMDICT_ASSET = `jmdict-eng-common-${JMDICT_VERSION}.json.tgz`;
const JMDICT_URL = `https://github.com/scriptin/jmdict-simplified/releases/download/${encodeURIComponent(JMDICT_VERSION)}/${encodeURIComponent(JMDICT_ASSET)}`;

/** @param {string} path */
async function sizeOf(path) {
  try {
    return (await stat(path)).size;
  } catch {
    return -1;
  }
}

async function copyKuromoji() {
  const source = join(root, 'node_modules', '@patdx', 'kuromoji', 'dict');
  const target = join(root, 'public', KUROMOJI_PATH);
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
}

/**
 * 從 tar 檔裡取出第一個一般檔案的內容（jmdict-simplified 的 tgz 只有一個 JSON）。
 * @param {Buffer} tar
 */
function firstFileInTar(tar) {
  let offset = 0;
  while (offset + 512 <= tar.length) {
    const header = tar.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) break;
    /** tar 標頭的文字欄位以 NUL 結尾。 @param {number} from @param {number} to */
    const field = (from, to) => header.subarray(from, to).toString('utf8').split('\0')[0];
    const name = field(0, 100);
    const size = Number.parseInt(field(124, 136).trim(), 8);
    const type = String.fromCharCode(header[156]);
    const start = offset + 512;
    if ((type === '0' || type === '\0') && name.endsWith('.json')) {
      return tar.subarray(start, start + size);
    }
    offset = start + Math.ceil(size / 512) * 512;
  }
  throw new Error('JMdict 壓縮檔裡找不到 JSON');
}

async function buildJmdict() {
  const cacheDir = join(root, '.cache', 'jmdict');
  const archive = join(cacheDir, JMDICT_ASSET);
  const output = join(root, 'public', SONG_ASSETS_PATH, JMDICT_FILE);
  await mkdir(cacheDir, { recursive: true });

  if ((await sizeOf(archive)) <= 0) {
    console.log(`song assets：下載 JMdict ${JMDICT_VERSION} …`);
    const response = await fetch(JMDICT_URL);
    if (!response.ok) throw new Error(`JMdict 下載失敗（HTTP ${response.status}）`);
    await writeFile(archive, Buffer.from(await response.arrayBuffer()));
  }

  // 已經用同一個版本產生過就不重做
  try {
    const existing = JSON.parse(await readFile(output, 'utf8'));
    if (existing.version === JMDICT_VERSION) {
      console.log(`song assets：JMdict 索引已是 ${JMDICT_VERSION}`);
      return;
    }
  } catch {
    // 沒有或壞掉：重新產生
  }

  const json = firstFileInTar(gunzipSync(await readFile(archive)));
  const data = JSON.parse(json.toString('utf8'));
  const index = buildJmdictIndex({ ...data, version: JMDICT_VERSION });
  await mkdir(dirname(output), { recursive: true });
  const text = JSON.stringify(index);
  await writeFile(output, text);
  console.log(
    `song assets：JMdict 索引 ${index.entries.length} 詞、${Object.keys(index.forms).length} 個寫法（${(text.length / 1024 / 1024).toFixed(1)}MB）→ public/${SONG_ASSETS_PATH}${JMDICT_FILE}`,
  );
}

await copyKuromoji();
try {
  await buildJmdict();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  if (requireJmdict) throw error;
  console.warn(`song assets：JMdict 沒有產生（${message}）；詞卡將顯示「英文字典沒有載入」。`);
}
