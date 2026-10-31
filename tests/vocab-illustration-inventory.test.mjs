import { test } from 'node:test';
import assert from 'node:assert/strict';
import { collectInventoryCards, buildIllustrationInventory, inventoryCsv } from '../scripts/vocab-illustration-inventory.mjs';

const card = (id, word, reading, zh) => ({ id, word, reading, zh, audio: 'audio/example.mp3', audioReady: true, lessonId: 'synthetic', lessonTitle: 'Synthetic lesson', category: 'n5' });

test('inventory includes the real game sentence cards, not just stage vocabulary', async () => {
  const cards = await collectInventoryCards();
  const inventory = buildIllustrationInventory(cards, 'synthetic');
  assert.equal(inventory.total.cardEntries, 6089);
  assert.equal(inventory.byCategory.games.cardEntries, 798);
  assert.ok(cards.some(c => c.category === 'games' && c.id.startsWith('game-card:') && c.word.length > 12));
  assert.equal(inventory.total.distinctWordForms, 3139);
});

test('inventory separates readings and senses without extending exact image mappings', () => {
  const cards = [
    card('a', '開く', 'あく', '打開'),
    card('b', '開く', 'ひらく', '打開'),
    card('c', '開く', 'あく', '開始'),
    card('d', '開く', 'あく', '打開'),
    card('stage0-day6:パン', 'パン', 'パン', '麵包'),
    card('unreviewed:パン', 'パン', 'パン', '麵包'),
  ];
  const report = buildIllustrationInventory(cards, 'synthetic');
  assert.equal(report.total.cardEntries, 6);
  assert.equal(report.total.distinctWordForms, 2);
  assert.equal(report.total.senseSignatures, 4);
  assert.equal(report.total.illustratedEntries, 1);
  assert.equal(report.unmappedEntriesWithCandidateExistingAsset, 1);
  assert.ok(report.groups.every(g => g.semanticSharingApproved === false));
  assert.throws(() => buildIllustrationInventory([cards[0], cards[0]], 'synthetic'), /Duplicate card ID/);
  const csv = inventoryCsv(buildIllustrationInventory([card('e', '引用"例,次', 'れい', '第一行\n第二行')], 'synthetic'));
  assert.ok(csv.includes('"引用""例,次"'));
  assert.ok(csv.includes('"第一行\n第二行"'));
});
