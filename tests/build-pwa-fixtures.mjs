// Create two real subsequent builds outside the source tree. Only the HTML
// release marker differs; Vite/Workbox generate each worker without test mocks.
import { cp, mkdtemp, readFile, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative, resolve, sep } from 'node:path';
import { execFileSync } from 'node:child_process';
const root = process.cwd();
const source = await mkdtemp(join(tmpdir(), 'nihongo-pwa-build-'));
const out = resolve('.cache/pwa-fixtures');
try {
  await cp(root, source, { recursive: true, filter: path => { const first = relative(root, path).split(sep)[0]; return !first.startsWith('.env') && !['.git', '.agents', '.codex', '.aws', '.cache', 'node_modules', 'dist', 'dev-dist'].includes(first); } });
  await symlink(join(root, 'node_modules'), join(source, 'node_modules'), 'dir');
  const html = await readFile(join(source, 'index.html'), 'utf8');
  for (const name of ['next', 'later']) {
    // outDir is outside the copied root, so Vite does not empty it itself.
    await rm(join(out, name), { recursive: true, force: true });
    await writeFile(join(source, 'index.html'), html + `\n<!-- synthetic production release ${name} -->\n`);
    execFileSync('npm', ['run', 'build', '--', '--outDir', join(out, name)], { cwd: source, env: { ...process.env, VITE_BASE_PATH: '/nihongo-lab/' }, stdio: 'inherit' });
    execFileSync(process.execPath, [join(root, 'scripts/perf-bundle.mjs'), '--dist', join(out, name), '--check'], { cwd: root, stdio: 'inherit' });
  }
} finally { await rm(source, { recursive: true, force: true }); }
