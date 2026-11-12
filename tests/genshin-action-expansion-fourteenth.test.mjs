import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { gameCharacterStudy, loadCategory } from '../curriculum/lessons.mjs';
import { genshinActionExpansionFourteenth } from '../curriculum/genshin-action-expansion-fourteenth.mjs';
import { collectInventoryCards } from '../scripts/vocab-illustration-inventory.mjs';
import { VOCAB_ILLUSTRATIONS, illustrationFor } from '../lib/vocab-illustrations.mjs';
import { gameListeningQuestion, gameRecordId } from '../lib/game-study.mjs';
import { AUDIO_PROSODY } from '../curriculum/audio-prosody.mjs';
import { beforeT188GameCharacterStudy, beforeT188Cards, beforeT188Prosody } from './helpers/before-t188-navia.mjs';

const hash = (x) => createHash('sha256').update(JSON.stringify(x)).digest('hex');

test('T188 leaves the published T187 corpus, cards, mappings and reading overrides unchanged', async () => {
  assert.equal(hash(beforeT188GameCharacterStudy), 'b6ba705ebedfb97398c95ae48013d46afeb7ec314c6d132d44087b38c44a1713');
  assert.equal(hash(beforeT188Cards(await collectInventoryCards())), '0ff2090bed77025342206f1e08fdea6e009b44be4e821ac6d4a1a3d767b8249c');
  assert.equal(hash(VOCAB_ILLUSTRATIONS), 'c2f4bab387213a6ca2b68ef8d043aa96d7164206d5d4206d70b45f2ab01a23de');
  assert.equal(hash(beforeT188Prosody), '5e5cb78a6a75a62b9a15a833e2745e34a0145014fb22626d74d706120a60ca9f');
});

test('T188 Navia team-join line uses the user-ruled reading and reaches listening, cards and audio', async () => {
  assert.equal(genshinActionExpansionFourteenth.length, 1);
  const [row] = genshinActionExpansionFourteenth;
  const navia = gameCharacterStudy.find((g) => g.id === 'genshin').characters.find((c) => c.id === 'navia');
  const line = navia.lines.find((l) => l.id === 'genshin:navia:join-91072');
  assert.equal(line.jp, '棘薔薇の会の出番よ！');
  assert.equal(line.reading, 'スピナ・ディ・ロースラの でばんよ！');
  assert.equal(line.ruby.replace(/\{([^|}]+)\|[^}]+\}/g, '$1'), line.jp);
  assert.equal(line.voicelineId, row.sourceItemId);
  assert.equal(line.voice, navia.voice);
  assert.equal(navia.lines.filter((l) => l.category === '編隊加入').length, 3);
  const override = AUDIO_PROSODY[line.audio];
  assert.equal(override.reading, line.reading);
  assert.match(override.reason, /^T188：.*使用者裁定.*未經人耳或原配音聽驗/);
  const question = gameListeningQuestion(line);
  assert.equal(question.options[question.answer], line.zh);
  assert.equal(new Set(question.options).size, 3);
  const catalog = await loadCategory('games');
  const card = catalog.cards.find((c) => c.id === 'game-card:' + gameRecordId(line));
  assert.ok(card);
  assert.equal(illustrationFor(card), undefined);
  assert.ok((await readFile(new URL('../public/' + line.audio, import.meta.url))).length > 1000);
});
