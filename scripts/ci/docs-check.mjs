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

/** @param {string} file @param {string} before @param {string} after @param {(p: string) => boolean} exists */
export function checkDocument(file, before, after, exists) {
  if (after.includes('\0') || /^(?:<{7}|={7}|>{7})(?: |$)/m.test(after))
    throw new Error(`${file}: binary data or conflict marker`);
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
    `Document gate passed: ${paths.length} changed paths; new local links, UTF-8 and conflict markers checked. External links not network-tested.`,
  );
}
