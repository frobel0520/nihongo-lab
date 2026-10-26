import assert from 'node:assert/strict';
import test from 'node:test';
import { posix, win32 } from 'node:path';
import { readFile, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { assetPath, staticFile } from './helpers/static-file.mjs';

for (const [paths, root] of [
  [posix, '/site/dist'],
  [win32, 'C:\\site\\dist'],
]) {
  test(`${paths.sep} static root and nested assets reject traversal and sibling prefixes`, () => {
    assert.equal(staticFile(root, '', paths), paths.join(root, 'index.html'));
    assert.equal(
      staticFile(root, 'assets/app.js', paths),
      paths.join(root, 'assets', 'app.js'),
    );
    for (const invalid of [
      '../dist-secret/file',
      'assets/../../private',
      '..\\private',
      paths.resolve(root, '../dist-secret/file'),
    ])
      assert.throws(() => staticFile(root, invalid, paths));
    assert.throws(() => staticFile(root, '.', paths));
    assert.equal(assetPath('/nihongo-lab/assets/a.js?x=1'), 'assets/a.js');
    assert.throws(() => assetPath('/nihongo-lab-secret/a.js'));
    assert.throws(() =>
      staticFile(root, assetPath('/nihongo-lab/%2e%2e%2fprivate'), paths),
    );
    assert.throws(() =>
      staticFile(root, assetPath('/nihongo-lab/%2e%2e%5cprivate'), paths),
    );
  });
}
test('static fixture root and nested files are readable with native paths', async () => {
  const root = await mkdtemp(join(tmpdir(), 'nihongo-static-'));
  try {
    await mkdir(join(root, 'assets'));
    await writeFile(join(root, 'index.html'), 'root');
    await writeFile(join(root, 'assets', 'app.js'), 'nested');
    assert.equal(
      await readFile(staticFile(root, assetPath('/nihongo-lab/')), 'utf8'),
      'root',
    );
    assert.equal(
      await readFile(
        staticFile(root, assetPath('/nihongo-lab/assets/app.js')),
        'utf8',
      ),
      'nested',
    );
  } finally {
    await rm(root, { recursive: true });
  }
});
