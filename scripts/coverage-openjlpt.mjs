// 對照 curriculum/lessons.mjs 與 OpenJLPT 級別清單，算出單字／漢字／文法的涵蓋率。
// 用法：npm run coverage -- [--all-stages] [--missing] [--lessons=25] [--refresh]
//
// 資料來源：https://github.com/evanclan/OpenJLPT（CC BY-SA 4.0；級別出自 Jonathan Waller 的社群清單，
// 不是官方清單）。資料只在執行時下載到 .cache/（已列入 .gitignore），不放進 repo，
// 避免把 share-alike 授權帶進本專案。版本釘在下面的 commit，要換版時手動更新 REF。
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { stages } from '../curriculum/lessons.mjs';
import {
  extractKanji,
  grammarCoverage,
  japaneseTexts,
  kanjiCoverage,
  matchVocab,
  pacing,
  vocabCoverage,
} from '../lib/coverage.mjs';

const REPO = 'evanclan/OpenJLPT';
const REF = '88eaef9c589f787194903e733c7f7b6df9d6ebc0';
const CACHE_DIR = `.cache/openjlpt/${REF.slice(0, 10)}`;
const TARGET = 'N5';

// 單字與文法只載 N5、N4（N4 用來辨識「教材用到但屬於下一級」的字）；漢字五級都載，才知道每個字的級別。
const FILES = [
  ...[5, 4].flatMap((n) => [`vocab/n${n}`, `grammar/n${n}`]),
  ...[5, 4, 3, 2, 1].map((n) => `kanji/n${n}`),
];

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name, fallback) =>
  args.find((a) => a.startsWith(`${name}=`))?.split('=')[1] ?? fallback;

/** 讀快取；沒有（或加 --refresh）才下載一次，失敗就直接報錯，不重試、不略過。 */
async function load(name) {
  const cachePath = `${CACHE_DIR}/${name.replace('/', '-')}.json`;
  if (!flag('--refresh') && existsSync(cachePath)) {
    return JSON.parse(await readFile(cachePath, 'utf8'));
  }
  const url = `https://raw.githubusercontent.com/${REPO}/${REF}/data/json/${name}.json`;
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`下載失敗 ${response.status}：${url}`);
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error(`格式不是陣列：${url}`);
  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(cachePath, JSON.stringify(data));
  return data;
}

const pct = (part, whole) =>
  whole === 0 ? '—' : `${((part / whole) * 100).toFixed(1)}%`;

async function main() {
  const planned = Number(option('--lessons', '25'));
  if (!Number.isInteger(planned) || planned < 1) {
    throw new Error('--lessons 必須是正整數');
  }

  const data = Object.fromEntries(
    await Promise.all(FILES.map(async (name) => [name, await load(name)])),
  );
  const collect = (kind) =>
    Object.entries(data)
      .filter(([name]) => name.startsWith(`${kind}/`))
      .flatMap(([, rows]) => rows);
  const refVocab = collect('vocab');
  const refKanji = collect('kanji');
  const refGrammar = collect('grammar');

  const scoped = flag('--all-stages')
    ? stages
    : stages.filter((s) => s.id === 'stage-0');
  const lessons = scoped.flatMap((s) => s.lessons);
  const scopeLabel = flag('--all-stages') ? '全部階段' : '第 0 階段（N5 復健）';

  console.log(`# OpenJLPT 對照（${scopeLabel}，${lessons.length} 課；目標級別 ${TARGET}）`);
  console.log(`資料：${REPO}@${REF.slice(0, 7)}（CC BY-SA 4.0，僅本機快取於 ${CACHE_DIR}）\n`);

  // 單字
  const items = lessons.flatMap((l) => l.vocab);
  const matches = matchVocab(items, refVocab);
  const vocab = vocabCoverage(matches, refVocab, TARGET);
  const byLevel = { N5: 0, N4: 0, missing: 0 };
  for (const m of matches) byLevel[m.level ?? 'missing']++;
  console.log('## 單字');
  console.log(
    `  教材 ${matches.length} 個（去重）：N5 ${byLevel.N5}、N4 ${byLevel.N4}、不在 N5／N4 清單 ${byLevel.missing}`,
  );
  console.log(`  ${TARGET} 涵蓋 ${vocab.covered} / ${vocab.total}（${pct(vocab.covered, vocab.total)}）`);
  for (const m of matches.filter((x) => x.status === 'reading-diff')) {
    console.log(`  讀音不同：${m.word} 我們 ${m.reading}／清單 ${m.refReading}（${m.level}）`);
  }
  const absent = matches.filter((m) => m.status === 'missing').map((m) => m.word);
  if (absent.length) {
    console.log(`  不在清單（可能是教科書專用詞，或屬更高級別）：${absent.join('、')}`);
  }

  // 漢字
  const used = extractKanji(lessons.flatMap(japaneseTexts));
  const kanji = kanjiCoverage(used, refKanji, TARGET);
  console.log('\n## 漢字');
  console.log(`  教材日文用到 ${used.length} 個不同漢字`);
  for (const [level, chars] of Object.entries(kanji.byLevel).sort()) {
    console.log(`    ${level}：${chars.length} 個 ${chars.join('')}`);
  }
  console.log(`  ${TARGET} 漢字表涵蓋 ${kanji.covered} / ${kanji.total}（${pct(kanji.covered, kanji.total)}）`);

  // 文法
  const grammar = grammarCoverage(lessons, refGrammar, TARGET);
  console.log('\n## 文法（依文法點上標的 jlpt id）');
  console.log(`  ${TARGET} 涵蓋 ${grammar.covered} / ${grammar.total}（${pct(grammar.covered, grammar.total)}）`);
  if (grammar.untagged) console.log(`  還沒標 jlpt 的文法點：${grammar.untagged} 個`);
  if (grammar.unknown.length) {
    console.log(`  警告：清單裡找不到這些 id（打錯？）：${grammar.unknown.join('、')}`);
  }

  // 步調
  console.log(`\n## 步調（預計 ${planned} 課，已有 ${lessons.length} 課）`);
  for (const [label, total, covered] of [
    ['單字', vocab.total, vocab.covered],
    ['漢字', kanji.total, kanji.covered],
    ['文法', grammar.total, grammar.covered],
  ]) {
    const p = pacing(total, covered, planned, lessons.length);
    const rest = p.remainingPerLesson === null ? '已無剩餘課數' : `剩下的課每課要補 ${p.remainingPerLesson.toFixed(1)} 個`;
    console.log(`  ${TARGET} ${label} ${total}：全部平均每課 ${p.perLesson.toFixed(1)} 個；${rest}`);
  }

  if (flag('--missing')) {
    console.log(`\n## 還沒涵蓋的 ${TARGET} 項目`);
    console.log(`  單字（${vocab.uncovered.length}）：${vocab.uncovered.map((e) => `${e.word}（${e.reading}）`).join('、')}`);
    console.log(`  漢字（${kanji.uncovered.length}）：${kanji.uncovered.join('')}`);
    console.log(`  文法（${grammar.uncovered.length}）：${grammar.uncovered.map((g) => `${g.pattern}[${g.id}]`).join('、')}`);
  }
}

main().catch((error) => {
  console.error(`coverage-openjlpt 失敗：${error.message}`);
  process.exitCode = 1;
});
