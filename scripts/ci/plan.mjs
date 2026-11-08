import { execFileSync } from 'node:child_process';
import { appendFileSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { classifyChanges } from './classify.mjs';

/** Parse NUL-separated paths. @param {Buffer | string} bytes */
export function parseChanges(bytes) {
  const fields = (
    typeof bytes === 'string' ? bytes : bytes.toString('utf8')
  ).split('\0');
  if (fields.pop() !== '') throw new Error('Unterminated git diff');
  const changes = [];
  for (let i = 0; i < fields.length;) {
    const status = fields[i++];
    const count = /^[RC]\d+$/.test(status) ? 2 : 1;
    const paths = fields.slice(i, i + count);
    if (paths.length !== count || paths.some((p) => !p))
      throw new Error('Incomplete git status');
    changes.push({ status, paths });
    i += count;
  }
  return changes;
}

/**
 * Unavailable history => full.
 * @param {string} eventName
 * @param {{before?: string, pull_request?: {base?: {sha?: string}}}} event
 * @param {(args: string[]) => Buffer | string} [git]
 */
export function makePlan(
  eventName,
  event,
  git = (args) =>
    execFileSync('git', args, {
      maxBuffer: 32 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
    }),
) {
  let base = '';
  try {
    if (eventName === 'pull_request')
      base = event.pull_request?.base?.sha ?? '';
    else if (eventName === 'push') base = event.before ?? '';
    else throw new Error('Explicit full validation');
    if (!/^[0-9a-f]{40}$/.test(base) || /^0+$/.test(base))
      throw new Error('Invalid comparison base');
    try {
      git(['cat-file', '-e', `${base}^{commit}`]);
    } catch {
      git(['fetch', '--no-tags', '--depth=1', 'origin', base]);
    }
    const changes = parseChanges(
      git(['diff', '--name-status', '-z', '--find-renames', base, 'HEAD']),
    );
    const paths = [...new Set(changes.flatMap((change) => change.paths))];
    for (const revision of [base, 'HEAD']) {
      const tree = git(['ls-tree', '-z', revision, '--', ...paths]).toString();
      if (
        tree
          .split('\0')
          .filter(Boolean)
          .some((row) => !/^100(?:644|755) blob /.test(row))
      )
        throw new Error('Symlink or submodule requires full validation');
    }
    /** @param {'base' | 'head'} version @param {string} file */
    const read = (version, file) => {
      try {
        return git([
          'show',
          `${version === 'base' ? base : 'HEAD'}:${file}`,
        ]).toString('utf8');
      } catch {
        return null;
      }
    };
    return { ...classifyChanges(changes, read), base };
  } catch {
    return {
      profile: 'full',
      paths: [],
      reasons: ['Manual run, missing history or unreadable diff'],
      base: '',
    };
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  if (!process.env.GITHUB_EVENT_PATH || !process.env.GITHUB_EVENT_NAME)
    throw new Error('Missing workflow event');
  const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  const plan = makePlan(process.env.GITHUB_EVENT_NAME, event);
  if (process.env.GITHUB_OUTPUT)
    appendFileSync(
      process.env.GITHUB_OUTPUT,
      `profile=${plan.profile}\nbase=${plan.base}\npaths=${JSON.stringify(plan.paths)}\n`,
    );
  const summary = `Validation profile: ${plan.profile}; changed paths: ${plan.paths.length}; ${plan.reasons.join('; ') || 'Verified change scope'}`;
  if (process.env.GITHUB_STEP_SUMMARY)
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + '\n');
  console.log(summary);
}
