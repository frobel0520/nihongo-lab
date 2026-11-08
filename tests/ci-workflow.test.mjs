import test from 'node:test';
import assert from 'node:assert/strict';
import {
  readFileSync,
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runInNewContext } from 'node:vm';
import { parse } from 'yaml';
import { classifyChanges } from '../scripts/ci/classify.mjs';
import { makePlan, parseChanges } from '../scripts/ci/plan.mjs';
import { checkDocument } from '../scripts/ci/docs-check.mjs';
import { checkChangedAudio } from '../scripts/ci/media-check.mjs';

const classify = (paths, base = {}, head = {}) =>
  classifyChanges(
    paths.map((p) => (typeof p === 'string' ? { status: 'M', paths: [p] } : p)),
    (v, p) => (v === 'base' ? base : head)[p] ?? null,
  ).profile;
const expansion = 'curriculum/genshin-action-expansion-next.mjs';
const source = (value) =>
  `export const genshinActionExpansionNext = [{key: 'skill-1', jp: ${JSON.stringify(value)}}];`;

test('docs, served README, content and unknown/core changes have distinct scopes', () => {
  assert.equal(classify(['progress.md', 'docs/project-sd.md']), 'docs');
  assert.equal(classify(['public/images/vocab/README.md']), 'content');
  assert.equal(
    classify(['public/audio/games/new.mp3', 'public/images/vocab/new.svg']),
    'content',
  );
  for (const p of [
    'app/App.tsx',
    'worker/index.ts',
    'package-lock.json',
    'vite.config.ts',
    '.github/workflows/ci.yml',
    'new-script.mjs',
    'docs/runtime.json',
  ])
    assert.equal(classify(['progress.md', p]), 'full', p);
  assert.equal(classify([]), 'full');
  assert.equal(classify([{ status: 'T', paths: ['README.md'] }]), 'full');
  assert.equal(classify([{ status: 'D', paths: ['lib/offline.mjs'] }]), 'full');
});

test('literal expansion edits/additions are content, executable expressions fail closed', () => {
  assert.equal(
    classify(
      [expansion],
      { [expansion]: source('old') },
      { [expansion]: source('new') },
    ),
    'content',
  );
  assert.equal(
    classify(
      [{ status: 'A', paths: [expansion] }],
      {},
      { [expansion]: source('new') },
    ),
    'content',
  );
  for (const after of [
    source('new') + 'fetch("https://example.com");',
    'export const genshinActionExpansionNext = [run()];',
    'export const genshinActionExpansionNext = [{get jp(){return "x";}}];',
    'export const genshinActionExpansionNext = [{...injected}];',
    'export const genshinActionExpansionNext = [{__proto__: {polluted: true}}];',
    'export const genshinActionExpansionNext = [',
  ])
    assert.equal(
      classify(
        [expansion],
        { [expansion]: source('old') },
        { [expansion]: after },
      ),
      'full',
    );
});

test('mapping data may change while mapping execution and imports remain protected', () => {
  const file = 'lib/vocab-illustrations.mjs';
  const module = (word) =>
    `export const VOCAB_ILLUSTRATIONS = [{word: '${word}'}]; export function illustrationFor(card){return card.id;}`;
  assert.equal(
    classify([file], { [file]: module('old') }, { [file]: module('new') }),
    'content',
  );
  assert.equal(
    classify(
      [file],
      { [file]: module('old') },
      { [file]: module('new').replace('card.id', 'card.word') },
    ),
    'full',
  );
  assert.equal(
    classify(
      [file],
      { [file]: module('old') },
      { [file]: module('new').replace("'new'", 'compute()') },
    ),
    'full',
  );
});

test('controlled expansion wiring accepts only matching literal source exports', () => {
  const file = 'curriculum/game-character-study.mjs';
  const oldFile = 'curriculum/genshin-action-expansion.mjs';
  const oldModule = 'export const genshinActionExpansion = [];';
  const before =
    "import {genshinActionExpansion} from './genshin-action-expansion.mjs'; for(const row of [...genshinActionExpansion]) consume(row);";
  const after =
    "import {genshinActionExpansion} from './genshin-action-expansion.mjs'; import {genshinActionExpansionNext} from './genshin-action-expansion-next.mjs'; for(const row of [...genshinActionExpansion, ...genshinActionExpansionNext]) consume(row);";
  const base = { [file]: before, [oldFile]: oldModule };
  const head = { ...base, [file]: after, [expansion]: source('new') };
  assert.equal(classify([file, expansion], base, head), 'content');
  assert.equal(
    classify([file, expansion], base, {
      ...head,
      [expansion]: source('new') + 'run();',
    }),
    'full',
  );
  assert.equal(
    classify([file, expansion], base, {
      ...head,
      [file]: after.replace('consume(row)', 'consume(row, true)'),
    }),
    'full',
  );
  assert.equal(
    classify([file], base, {
      ...head,
      [file]: after.replace(
        'genshinActionExpansionNext}',
        'genshinActionExpansionNext as renamed}',
      ),
    }),
    'full',
  );
});

test('content unit tests run with content; browser/tooling changes remain full', () => {
  const media = 'public/images/vocab/new.svg';
  assert.equal(
    classify([
      media,
      'tests/genshin-new.test.mjs',
      'tests/helpers/before-fifth-action-expansion.mjs',
    ]),
    'content',
  );
  assert.equal(classify(['tests/genshin-new.test.mjs']), 'full');
  assert.equal(classify([media, 'tests/helpers/static-file.mjs']), 'full');
  assert.equal(classify([media, 'tests/image-download-browser.mjs']), 'full');
});

test('renames inspect both ends and NUL diff parsing preserves special filenames', () => {
  const changes = parseChanges(
    Buffer.from('R100\0app/App.tsx\0docs/new.md\0M\0docs/a b\nc.md\0'),
  );
  assert.deepEqual(changes[1].paths, ['docs/a b\nc.md']);
  assert.equal(classify(changes), 'full');
  assert.throws(() => parseChanges('R100\0only-one\0'));
  assert.throws(() => parseChanges('M\0unterminated'));
});

test('manual/initial/missing/invalid history and symlinks require full validation', () => {
  const sha = 'a'.repeat(40);
  const git = (args) =>
    args[0] === 'diff' ? Buffer.from('M\0progress.md\0') : Buffer.from('');
  assert.equal(makePlan('push', { before: sha }, git).profile, 'docs');
  assert.equal(
    makePlan('pull_request', { pull_request: { base: { sha } } }, git).profile,
    'docs',
  );
  assert.equal(makePlan('workflow_dispatch', {}, git).profile, 'full');
  assert.equal(
    makePlan('push', { before: '0'.repeat(40) }, git).profile,
    'full',
  );
  assert.equal(
    makePlan('push', { before: '--upload-pack=bad' }, git).profile,
    'full',
  );
  assert.equal(
    makePlan('push', { before: sha }, () => {
      throw Error('unavailable');
    }).profile,
    'full',
  );
  assert.equal(
    makePlan('push', { before: sha }, (args) =>
      args[0] === 'ls-tree' ? '120000 blob abc\tprogress.md\0' : git(args),
    ).profile,
    'full',
  );
});

test('docs validate introduced links and conflicts without failing old known links', () => {
  checkDocument(
    'docs/a.md',
    '[old](missing.md)',
    '[old](missing.md)\n[new](../README.md)',
    (p) => p === 'README.md',
  );
  assert.throws(() =>
    checkDocument('docs/a.md', '', '[new](missing.md)', () => false),
  );
  assert.throws(() =>
    checkDocument('docs/a.md', '', '[new](../../outside)', () => true),
  );
  assert.throws(() =>
    checkDocument('docs/a.md', '', '<<<<<<< conflict\n', () => true),
  );
  checkDocument(
    'docs/a.md',
    '',
    '```md\n[example](not-a-file)\n```\n[web](https://example.com)',
    () => false,
  );
});

test('changed audio audit rejects empty/broken files and ignores unrelated/removed assets', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'ci-audio-'));
  try {
    mkdirSync(path.join(root, 'public/audio'), { recursive: true });
    const file = path.join(root, 'public/audio/x.mp3');
    const paths = ['public/audio/x.mp3'];
    writeFileSync(file, '');
    assert.throws(
      () => checkChangedAudio(paths, root, () => {}),
      /Empty audio/,
    );
    writeFileSync(file, 'synthetic-decoder-input');
    assert.throws(
      () =>
        checkChangedAudio(paths, root, () => {
          throw Error('decode failed');
        }),
      /decode failed/,
    );
    let count = 0;
    const rows = checkChangedAudio(
      [...paths, 'public/audio/removed.mp3', 'README.md'],
      root,
      () => {
        count++;
      },
    );
    assert.equal(count, 1);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].bytes, 23);
    assert.match(rows[0].sha256, /^[a-f0-9]{64}$/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

const workflow = parse(
  readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8'),
);
function enabled(step, profile, ref = 'refs/heads/main', event = 'push') {
  if (!step.if) return true;
  const expression = step.if
    .replace(/^\$\{\{\s*|\s*\}\}$/g, '')
    .replaceAll('needs.changes.outputs.profile', JSON.stringify(profile))
    .replaceAll('github.ref', JSON.stringify(ref))
    .replaceAll('github.event_name', JSON.stringify(event));
  return runInNewContext(expression, {}, { timeout: 100 });
}

test('actual workflow docs/content/full branches retain the appropriate gates', () => {
  const steps = workflow.jobs.check.steps;
  const runs = (profile) =>
    steps
      .filter((s) => enabled(s, profile))
      .map((s) => s.run)
      .filter(Boolean);
  assert.ok(runs('docs').some((s) => s.includes('docs-check.mjs')));
  for (const command of [
    'npm run check',
    'npm run build',
    'npm run perf:bundle',
    'npm run test:images',
  ]) {
    assert.ok(!runs('docs').includes(command), command);
    assert.ok(runs('content').includes(command), command);
    assert.ok(runs('full').includes(command), command);
  }
  for (const command of [
    'test:quality',
    'test:inference',
    'test:pwa',
    'test:ux',
    'test:navigation',
    'test:srs-layout',
    'test:pwa:updates',
  ]) {
    assert.ok(!runs('content').includes('npm run ' + command), command);
    assert.ok(runs('full').includes('npm run ' + command), command);
  }
  assert.ok(
    runs('content').some((s) => s.includes('npm audit --audit-level=high')),
  );
  assert.ok(runs('content').some((s) => s.includes('media-check.mjs')));
  assert.deepEqual(workflow.jobs.check.needs, 'changes');
  assert.equal(workflow.jobs.check.if, '${{ !cancelled() }}');
  const scopeGuard = workflow.jobs.check.steps[0];
  assert.equal(scopeGuard.env.PLAN_RESULT, '${{ needs.changes.result }}');
  assert.ok(scopeGuard.run.includes('test "$PLAN_RESULT" = success'));
  assert.ok(scopeGuard.run.includes('docs|content|full'));
  assert.deepEqual(workflow.jobs['ux-windows'].needs, 'changes');
  assert.ok(
    workflow.jobs['ux-windows'].steps.some(
      (s) => enabled(s, 'content') && s.name === 'Report validation scope',
    ),
  );
  assert.ok(
    !workflow.jobs['ux-windows'].steps.some(
      (s) => enabled(s, 'content') && s.run?.startsWith('npm'),
    ),
  );
});

test('deployment needs all gates, docs never publish, and owner/main/permissions guards remain', () => {
  const deploy = workflow.jobs['deploy-worker'];
  assert.deepEqual(deploy.needs, ['changes', 'check', 'ux-windows']);
  assert.equal(enabled(deploy, 'docs'), false);
  assert.equal(enabled(deploy, 'content'), true);
  assert.equal(
    enabled(deploy, 'full', 'refs/pull/1/merge', 'pull_request'),
    false,
  );
  assert.equal(
    enabled(deploy, 'full', 'refs/heads/feature/test', 'workflow_dispatch'),
    false,
  );
  assert.equal(
    enabled(deploy, 'full', 'refs/heads/main', 'workflow_dispatch'),
    true,
  );
  assert.equal(deploy.environment, 'production');
  const guard = deploy.steps.find(
    (s) => s.name === 'Require owner and main',
  ).run;
  assert.ok(
    guard.includes('test "$GITHUB_ACTOR" = "$GITHUB_REPOSITORY_OWNER"'),
  );
  assert.ok(guard.includes('test "$GITHUB_REF" = refs/heads/main'));
  assert.equal(workflow.jobs['deploy-pages-redirect'].needs, 'deploy-worker');
  assert.deepEqual(workflow.permissions, { contents: 'read' });
  for (const job of Object.values(workflow.jobs))
    for (const step of job.steps)
      if (step.uses?.startsWith('actions/checkout@'))
        assert.equal(step.with['persist-credentials'], false);
  assert.equal(
    enabled(
      { if: workflow.concurrency['cancel-in-progress'] },
      'full',
      'refs/heads/main',
      'push',
    ),
    false,
  );
  assert.equal(
    enabled(
      { if: workflow.concurrency['cancel-in-progress'] },
      'full',
      'refs/pull/1/merge',
      'pull_request',
    ),
    true,
  );
});
