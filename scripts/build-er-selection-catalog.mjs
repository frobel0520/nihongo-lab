// Generate a privacy-safe public inventory from locally cached game metadata.
// Original audio, ASR transcripts, asset paths and hashes stay in .cache.
import { readFile, writeFile } from 'node:fs/promises';
import { eternalReturnRoster } from '../curriculum/game-character-roster.mjs';

/** @typedef {{ file: string, character_asset_name: string, skin_folder: string, clip: string, sha256: string }} AssetRecord */
/** @typedef {{ records: AssetRecord[] }} Manifest */
/** @typedef {{ skin_id: number | string, character_code: number, skin_name_zh: string, phrase_ja: string, source_key: string, matching_selection_assets: string[] }} SourceRow */
/** @typedef {{ onselect_rows: SourceRow[] }} SourceMap */
/** @typedef {{ status: string, skin_id: number | string, best_candidates: { file: string }[] }} AlignmentMatch */
/** @typedef {{ exact_source_asr_matches: number, matches: AlignmentMatch[] }} Alignment */
/** @typedef {{ language: string }[]} AsrRows */
/** @typedef {{ characterId: string, candidateAssets: number, selectedFamily: number, selected2Family: number, skinFolders: Set<string>, officialTextRows: number, exactAsrCandidates: number }} RoleCount */

const cacheRoot = '.cache/er-selection-all';
const [manifest, source, alignment, asr] = await Promise.all([
  readFile(cacheRoot + '/manifest.json', 'utf8').then(
    (text) => /** @type {Manifest} */ (JSON.parse(text)),
  ),
  readFile(cacheRoot + '/source-map.json', 'utf8').then(
    (text) => /** @type {SourceMap} */ (JSON.parse(text)),
  ),
  readFile(cacheRoot + '/source-audio-alignment.json', 'utf8').then(
    (text) => /** @type {Alignment} */ (JSON.parse(text)),
  ),
  readFile(cacheRoot + '/asr-candidates.json', 'utf8').then(
    (text) => /** @type {AsrRows} */ (JSON.parse(text)),
  ),
]);

if (manifest.records.length !== 316 || eternalReturnRoster.length !== 91)
  throw new Error('Unexpected game-build inventory; review the task contract.');
if (source.onselect_rows.length !== 57 || alignment.exact_source_asr_matches !== 18)
  throw new Error('Unexpected source alignment totals; review before generating.');
if (asr.length !== manifest.records.length)
  throw new Error('ASR result count differs from the local inventory.');
/** @type {Record<string, number>} */
const languageCounts = {};
for (const row of asr) {
  languageCounts[row.language] = (languageCounts[row.language] ?? 0) + 1;
}

const byCode = new Map(eternalReturnRoster.map((row) => [row.code, row]));
/** @type {Map<string, RoleCount>} */
const counts = new Map(
  eternalReturnRoster.map((row) => [
    row.id,
    {
      characterId: row.id,
      candidateAssets: 0,
      selectedFamily: 0,
      selected2Family: 0,
      skinFolders: new Set(),
      officialTextRows: 0,
      exactAsrCandidates: 0,
    },
  ]),
);
/** @type {Map<string, string>} */
const assetByFile = new Map();

for (const asset of manifest.records) {
  const role = eternalReturnRoster.find(
    (row) => row.id.toLowerCase() === asset.character_asset_name.toLowerCase(),
  );
  if (!role) throw new Error('Unmapped character asset in local manifest.');
  const row = counts.get(role.id);
  if (!row) throw new Error('Missing character count in local manifest.');
  row.candidateAssets += 1;
  row.skinFolders.add(asset.skin_folder);
  if (asset.clip.includes('_selected2_')) row.selected2Family += 1;
  else if (asset.clip.includes('_selected_')) row.selectedFamily += 1;
  else throw new Error('Unexpected clip family in local manifest.');
  assetByFile.set(asset.file, role.id);
}

const exactSkinIds = new Set(
  alignment.matches
    .filter((row) => row.status === 'exact_source_asr_candidate')
    .map((row) => row.skin_id),
);
for (const match of alignment.matches) {
  if (match.status !== 'exact_source_asr_candidate') continue;
  const roleId = assetByFile.get(match.best_candidates[0].file);
  if (!roleId) throw new Error('Exact ASR candidate is absent from manifest.');
  const roleCount = counts.get(roleId);
  if (!roleCount) throw new Error('Missing character count for ASR candidate.');
  roleCount.exactAsrCandidates += 1;
}

const officialSelectionRows = source.onselect_rows.map((row) => {
  const role = byCode.get(row.character_code);
  if (!role) throw new Error('Unmapped character code in official source.');
  const roleCount = counts.get(role.id);
  if (!roleCount) throw new Error('Missing character count for official source.');
  roleCount.officialTextRows += 1;
  const raw = String(row.phrase_ja);
  const colorSegments = [...raw.matchAll(/<color=#([0-9a-fA-F]{6})>([\s\S]*?)<\/color>/g)];
  /** @param {string} text */
  const clean = (text) =>
    text
      .replace(/<[^>]*>/g, '')
      .replaceAll('&amp;', '&')
      .replaceAll('&lt;', '<')
      .replaceAll('&gt;', '>')
      .replace(/\\n/g, '\n')
      .trim();
  const segments = colorSegments.map((match) => ({
    color: match[1].toUpperCase(),
    jp: clean(match[2]),
  }));
  const exactMatch = exactSkinIds.has(row.skin_id);
  return {
    sourceKey: row.source_key,
    skinId: String(row.skin_id),
    characterId: role.id,
    skinName: row.skin_name_zh,
    jp: segments.length > 1 ? '' : clean(raw),
    segments,
    matchingAssetCount: row.matching_selection_assets.length,
    exactAsrCandidate: exactMatch,
  };
});

const candidateCounts = eternalReturnRoster.map((row) => {
  const value = counts.get(row.id);
  if (!value) throw new Error('Missing candidate count for character.');
  return {
    characterId: value.characterId,
    candidateAssets: value.candidateAssets,
    selectedFamily: value.selectedFamily,
    selected2Family: value.selected2Family,
    skinFolders: value.skinFolders.size,
    officialTextRows: value.officialTextRows,
    exactAsrCandidates: value.exactAsrCandidates,
  };
});
const totalSelected = candidateCounts.reduce((sum, row) => sum + row.selectedFamily, 0);
const totalSelected2 = candidateCounts.reduce((sum, row) => sum + row.selected2Family, 0);
if (totalSelected !== 163 || totalSelected2 !== 153)
  throw new Error('Unexpected selection-family totals.');

const output = [
  '/** Generated from local build 25617366 metadata. Candidate counts are files, not distinct spoken lines. */',
  'export const erSelectionInventory = Object.freeze(' +
    JSON.stringify(
      {
        gameBuild: 25617366,
        candidateAssets: manifest.records.length,
        candidateRoles: eternalReturnRoster.length,
        uniqueAudioHashes: new Set(manifest.records.map((row) => row.sha256)).size,
        selectedFamilyAssets: totalSelected,
        selected2FamilyAssets: totalSelected2,
        officialTextRows: officialSelectionRows.length,
        exactAsrCandidates: alignment.exact_source_asr_matches,
        japaneseAsrCandidates: languageCounts.ja ?? 0,
        englishAsrCandidates: languageCounts.en ?? 0,
        candidateCounts,
        officialSelectionRows,
      },
      null,
      2,
    ) +
    ');\n',
].join('\n');

if (/([A-Za-z]:\\|\/Users\/[^/]+\/)/.test(output))
  throw new Error('Generated catalog contains an absolute local path.');

await writeFile('curriculum/er-selection-catalog-data.mjs', output, 'utf8');
console.log(
  JSON.stringify({
    candidateAssets: manifest.records.length,
    candidateRoles: eternalReturnRoster.length,
    officialTextRows: officialSelectionRows.length,
    exactAsrCandidates: alignment.exact_source_asr_matches,
    japaneseAsrCandidates: languageCounts.ja ?? 0,
    englishAsrCandidates: languageCounts.en ?? 0,
  }),
);
