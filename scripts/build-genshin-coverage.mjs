// Count locally supplied source tables; never copy dialogue text into this output.
// node scripts/build-genshin-coverage.mjs --source-dir .cache/genshin-source
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { genshinRoster } from '../curriculum/genshin-character-roster.mjs';
import { countGenshinActions } from '../lib/genshin-coverage.mjs';
const sourceDir = process.argv[process.argv.indexOf('--source-dir') + 1];
if (!process.argv.includes('--source-dir') || !sourceDir)
  throw new Error('請提供 --source-dir');
/** @type {Record<string, {sourceAvailable: boolean, sha256: string | null, categories: Record<string, {entries: number, voicefiles: number}>}>} */
const coverage = {};
try {
  for (const row of genshinRoster) {
    let actions = [];
    let sha256 = null;
    if (row.voiceReferenceUrl) {
      const file = row.voiceReferenceUrl.split('/').at(-1);
      if (!file) throw new Error('來源缺少檔名');
      const bytes = await readFile(join(sourceDir, file));
      const data = JSON.parse(bytes.toString());
      if (!Array.isArray(data.actionLines))
        throw new Error(`來源語音欄位無效：${row.id}`);
      actions = data.actionLines;
      sha256 = createHash('sha256').update(bytes).digest('hex');
    }
    coverage[row.id] = {
      sourceAvailable: !!row.voiceReferenceUrl,
      sha256,
      categories: countGenshinActions(actions),
    };
  }
  await writeFile(
    'curriculum/genshin-action-coverage.mjs',
    '/** Fixed-source counts and hashes only; no dialogue text or original audio. */\n' +
      '/** @type {Record<string, {sourceAvailable: boolean, sha256: string | null, categories: Record<string, {entries: number, voicefiles: number}>}>} */\n' +
      'export const genshinActionCoverage = ' +
      JSON.stringify(coverage, null, 2) +
      ';\n',
  );
} catch {
  console.error('來源表不完整或格式錯誤，未完成盤點；請檢查本機資料。');
  process.exit(1);
}
console.log(
  `核對 ${Object.keys(coverage).length} 筆角色；只輸出來源筆數與雜湊。`,
);
