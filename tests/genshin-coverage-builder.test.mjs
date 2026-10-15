import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { genshinRoster } from '../curriculum/genshin-character-roster.mjs';

const script = fileURLToPath(
  new URL('../scripts/build-genshin-coverage.mjs', import.meta.url),
);
const sourced = genshinRoster.filter((row) => row.voiceReferenceUrl);
const filename = (row) => row.voiceReferenceUrl.split('/').at(-1);

async function fixture(t) {
  const cwd = await mkdtemp(join(tmpdir(), 'genshin-coverage-test-'));
  t.after(() => rm(cwd, { recursive: true, force: true }));
  const source = join(cwd, 'source');
  await mkdir(source);
  await mkdir(join(cwd, 'curriculum'));
  for (const row of sourced)
    await writeFile(
      join(source, filename(row)),
      JSON.stringify({ actionLines: [] }),
    );
  const output = join(cwd, 'curriculum/genshin-action-coverage.mjs');
  await writeFile(output, 'existing coverage must survive a failed build');
  return {
    source,
    output,
    run: () =>
      spawnSync(process.execPath, [script, '--source-dir', source], {
        cwd,
        encoding: 'utf8',
      }),
  };
}

for (const failure of ['missing', 'invalid-json', 'invalid-schema']) {
  test(`來源盤點 ${failure}：失敗退出且不以空資料覆寫既有輸出`, async (t) => {
    const f = await fixture(t);
    // 最後一個有來源角色才失敗，確保部分成功也不能寫出不完整盤點。
    const target = join(f.source, filename(sourced.at(-1)));
    if (failure === 'missing') await rm(target);
    else
      await writeFile(
        target,
        failure === 'invalid-json' ? '{' : '{"actionLines":null}',
      );
    const result = f.run();
    assert.equal(result.status, 1);
    assert.match(result.stderr, /未完成盤點/);
    assert.doesNotMatch(result.stdout, /核對 \d+ 筆角色/);
    assert.equal(
      await readFile(f.output, 'utf8'),
      'existing coverage must survive a failed build',
    );
  });
}

test('來源盤點成功：空語音表與沒有來源維持不同狀態', async (t) => {
  const f = await fixture(t);
  const result = f.run();
  assert.equal(result.status, 0, result.stderr);
  const text = await readFile(f.output, 'utf8');
  const coverage = JSON.parse(
    text.slice(text.indexOf(' = ') + 3, text.lastIndexOf(';')),
  );
  assert.equal(Object.keys(coverage).length, genshinRoster.length);
  assert.equal(coverage[sourced[0].id].sourceAvailable, true);
  assert.match(coverage[sourced[0].id].sha256, /^[a-f0-9]{64}$/);
  const absent = genshinRoster.find((row) => !row.voiceReferenceUrl);
  assert.equal(coverage[absent.id].sourceAvailable, false);
  assert.equal(coverage[absent.id].sha256, null);
  assert.equal(coverage[sourced[0].id].categories.join.entries, 0);
});
