import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { test } from 'node:test';
import { audioVersionManifest } from '../scripts/audio-version-manifest.mjs';

test('同一路徑換音檔會改變可預快取的版本模組，其他音檔不變', async () => {
  const publicDir = await mkdtemp(join(tmpdir(), 'nihongo-audio-versions-'));
  try {
    const folder = join(publicDir, 'audio', 'sample');
    await mkdir(folder, { recursive: true });
    const changed = join(folder, 'first.mp3');
    const stable = join(folder, 'second.mp3');
    await Promise.all([
      writeFile(changed, 'old'),
      writeFile(stable, 'stable'),
      writeFile(join(folder, 'notes.txt'), 'ignored'),
    ]);
    const plugin = audioVersionManifest();
    plugin.configResolved({ publicDir });
    const id = plugin.resolveId('virtual:audio-versions');
    const read = async () => {
      const watched = [];
      const code = await plugin.load.call(
        { addWatchFile: (file) => watched.push(file) },
        id,
      );
      assert.deepEqual(watched.sort(), [changed, stable].sort());
      return {
        code,
        versions: JSON.parse(code.slice('export default '.length)),
      };
    };
    const before = await read();
    assert.equal((await read()).code, before.code);
    await writeFile(changed, 'new');
    const after = await read();
    const sha = (text) => createHash('sha256').update(text).digest('hex');
    assert.deepEqual(before.versions, {
      'audio/sample/first.mp3': sha('old'),
      'audio/sample/second.mp3': sha('stable'),
    });
    assert.deepEqual(after.versions, {
      'audio/sample/first.mp3': sha('new'),
      'audio/sample/second.mp3': sha('stable'),
    });
    assert.notEqual(before.code, after.code);
  } finally {
    await rm(publicDir, { recursive: true });
  }
});
