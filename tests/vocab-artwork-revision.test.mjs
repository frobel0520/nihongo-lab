import { nextCardIds, nextAssetNames } from './helpers/before-next-action-expansion.mjs';
import test from 'node:test';
import { genshinActionExpansion } from '../curriculum/genshin-action-expansion.mjs';
import { gameCharacterStudy } from '../curriculum/lessons.mjs';
import { gameRecordId } from '../lib/game-study.mjs';
const expansionIds = new Set(genshinActionExpansion.map(x => `genshin:${x.characterId}:${x.key}`));
const expansionCardIds = new Set(gameCharacterStudy.flatMap(g => g.characters.flatMap(c => c.lines)).filter(line => expansionIds.has(line.id)).map(line => 'game-card:' + gameRecordId(line)));

import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { VOCAB_ILLUSTRATIONS } from '../lib/vocab-illustrations.mjs';
import {
  buildVocabImageManifestRows,
  manifestFingerprint,
} from '../scripts/vocab-image-manifest.mjs';
const digest = (value) => createHash('sha256').update(value).digest('hex');

test('semantic follow-up retains exactly the six intended card-to-artwork relationships', () => {
  const expected = {
    genuine: ['general-listening-74:本物'],
    antidote: ['general-listening-126:解毒'],
    politeaddress: ['stage0-day1:〜さん'],
    absolutely: ['general-listening-49:絶対', 'general-listening-83:絶対'],
    rhetoricalquestion: ['general-listening-178:反問'],
  };
  for (const [name, ids] of Object.entries(expected)) {
    assert.deepEqual(
      VOCAB_ILLUSTRATIONS.filter(
        (card) => card.src === `images/vocab/${name}.svg`,
      )
        .map((card) => card.id)
        .sort(),
      [...ids].sort(),
    );
  }
});

test('artwork updates keep all card identities and split only incompatible shared senses', () => {
  assert.equal(
    digest(
      JSON.stringify(
        VOCAB_ILLUSTRATIONS.filter(card => !expansionCardIds.has(card.id) && !nextCardIds.has(card.id)).map(({ src: _src, ...identity }) => identity),
      ),
    ),
    'db0ca719f1a65972d41538a6894c9a614330c3982802ac08726fc5f15223e0bb',
  );
  const src = (id) => VOCAB_ILLUSTRATIONS.find((c) => c.id === id)?.src;
  assert.equal(
    src('general-listening-31:丁寧'),
    'images/vocab/carefulpolite.svg',
  );
  for (const id of [
    'general-listening-34:丁寧な',
    'general-listening-68:丁寧',
    'general-listening-168:丁寧',
  ])
    assert.equal(src(id), 'images/vocab/politegreeting.svg');
  const waste = VOCAB_ILLUSTRATIONS.filter(
    (c) => c.src === 'images/vocab/waste.svg',
  );
  assert.ok(
    waste.length > 0 && waste.every((c) => !c.id.startsWith('game-card:')),
  );
  for (const id of [
    'game-card:game:genshin:xiao:skill:5156a56463',
    'game-card:game:genshin:lohen:burst:c696cec4a8',
  ])
    assert.equal(src(id), 'images/vocab/futileattack.svg');
  assert.equal(src('stage0-day25:メートル'), 'images/vocab/meterunit.svg');
  const length = VOCAB_ILLUSTRATIONS.filter(
    (c) => c.src === 'images/vocab/length.svg',
  );
  assert.equal(length.length, 2);
  assert.ok(length.every((c) => c.word === '長さ'));
});

test('current artwork bytes generate content versions and preserve the approved complete asset set', async () => {
  const dir = new URL('../public/images/vocab/', import.meta.url);
  const files = (await readdir(dir)).filter((f) => f.endsWith('.svg')).sort();
  const publishedFiles = files.filter(f => !f.startsWith('action') && !nextAssetNames.has(f));
  assert.equal(publishedFiles.length, 2245);
  assert.equal(files.filter(f => f.startsWith('action')).length, 42);
  const entries = [];
  for (const file of publishedFiles)
    entries.push(
      file +
        ':' +
        digest(
          (await readFile(new URL(file, dir), 'utf8')).replace(/\r\n/g, '\n'),
        ),
    );
  // Integrity snapshot only: this is not a semantic or user-recognition test.
  assert.equal(
    digest(entries.join('\n')),
    '9c51738025666b68ede1e6636b02186db366ffa3e2dd1f56a9819ae0abdb98a8',
  );
  assert.equal(files.length, 2354);
  const rows = await buildVocabImageManifestRows(fileURLToPath(dir));
  assert.equal(rows.length, files.length);
  const actual = new Map(rows.map(([name, version]) => [name, version]));
  for (const file of files) {
    const bytes = await readFile(new URL(file, dir));
    assert.equal(actual.get(file.slice(0, -4)), digest(bytes).slice(0, 12));
  }
  const changed = rows.map((r) => [...r]);
  changed[0][1] = '000000000000';
  assert.notEqual(manifestFingerprint(changed), manifestFingerprint(rows));
});
