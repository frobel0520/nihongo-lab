import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

/** Introduced relative links only. @param {string} text */
export function localLinks(text) {
  const withoutCode = text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`\n]*`/g, '');
  return [
    ...withoutCode.matchAll(
      /!?\[[^\]\n]*\]\((<[^>]+>|[^\s)]+)(?:\s+"[^"]*")?\)/g,
    ),
  ]
    .map((match) => match[1].replace(/^<|>$/g, ''))
    .filter((link) => !/^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(link));
}

/** 交接文件長度上限（AGENTS.md「交接文件長度」）。字數以 Unicode 字元計。 */
export const HANDOFF_LIMITS = {
  'progress.md': { lines: 120, chars: 10000, sectionChars: 2000 },
  'docs/release-audit.md': { sectionChars: 1500 },
};
export const AUDIT_LEGACY_MARKER = '<!-- handoff-length: 以下為舊紀錄，不受長度檢查 -->';

/** 依 `## ` 標題切段，回傳每段（含標題）的字元數。 @param {string} text */
export function sections(text) {
  return text
    .split(/^(?=## )/m)
    .filter((part) => part.startsWith('## '))
    .map((part) => ({ title: part.split('\n')[0], chars: [...part.trim()].length }));
}

/** @param {string} file @param {string} text @returns {string[]} 違規說明；空陣列代表通過 */
export function handoffLengthProblems(file, text) {
  const limit = HANDOFF_LIMITS[/** @type {keyof typeof HANDOFF_LIMITS} */ (file)];
  if (!limit) return [];
  const problems = [];
  let checked = text;
  if (file === 'docs/release-audit.md') {
    const at = text.indexOf(AUDIT_LEGACY_MARKER);
    if (at < 0) return [`${file}: missing legacy marker ${AUDIT_LEGACY_MARKER}`];
    checked = text.slice(0, at);
  }
  const lines = checked.split('\n').length;
  const chars = [...checked].length;
  if ('lines' in limit && lines > limit.lines)
    problems.push(`${file}: ${lines} lines > ${limit.lines}`);
  if ('chars' in limit && chars > limit.chars)
    problems.push(`${file}: ${chars} chars > ${limit.chars}`);
  for (const section of sections(checked))
    if (section.chars > limit.sectionChars)
      problems.push(`${file}: section "${section.title}" ${section.chars} chars > ${limit.sectionChars}`);
  return problems;
}

/** @param {string} file @param {string} before @param {string} after @param {(p: string) => boolean} exists */
export function checkDocument(file, before, after, exists) {
  if (after.includes('\0') || /^(?:<{7}|={7}|>{7})(?: |$)/m.test(after))
    throw new Error(`${file}: binary data or conflict marker`);
  const lengthProblems = handoffLengthProblems(file, after);
  if (lengthProblems.length) throw new Error(lengthProblems.join('\n'));
  const old = new Set(localLinks(before));
  for (const link of localLinks(after)) {
    if (old.has(link)) continue;
    const relative = decodeURIComponent(link.split(/[?#]/)[0]);
    if (!relative) continue;
    const resolved = path.posix.normalize(
      path.posix.join(path.posix.dirname(file), relative),
    );
    if (
      path.posix.isAbsolute(relative) ||
      resolved === '..' ||
      resolved.startsWith('../') ||
      !exists(resolved)
    )
      throw new Error(`${file}: unresolved new local link ${link}`);
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const paths = JSON.parse(process.env.CI_CHANGED_PATHS || '[]');
  const base = process.env.CI_BASE_SHA || '';
  if (!/^[0-9a-f]{40}$/.test(base) || !paths.length)
    throw new Error('Missing document comparison');
  for (const file of paths) {
    if (!existsSync(file)) continue; // Removed documents remain visible in the PR diff.
    let before = '';
    try {
      before = execFileSync('git', ['show', `${base}:${file}`], {
        stdio: ['ignore', 'pipe', 'ignore'],
      }).toString('utf8');
    } catch {
      /* Newly added document. */
    }
    const after = new TextDecoder('utf-8', { fatal: true }).decode(
      readFileSync(file),
    );
    checkDocument(file, before, after, existsSync);
  }
  console.log(
    `Document gate passed: ${paths.length} changed paths; new local links, UTF-8, conflict markers and handoff length checked. External links not network-tested.`,
  );
}
