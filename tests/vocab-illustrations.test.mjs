import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stages } from '../curriculum/lessons.mjs';
import { buildCards } from '../lib/srs.mjs';
import { VOCAB_ILLUSTRATIONS, illustrationFor } from '../lib/vocab-illustrations.mjs';

test('illustrations resolve only the 179 approved cards and their actual senses', () => {
  const cards = buildCards(stages);
  assert.equal(VOCAB_ILLUSTRATIONS.length, 179);
  assert.equal(new Set(VOCAB_ILLUSTRATIONS.map(x => x.id)).size, 179);
  assert.equal(new Set(VOCAB_ILLUSTRATIONS.map(x => x.src)).size, 114);
  assert.equal(cards.filter(illustrationFor).length, 179);
  for (const image of VOCAB_ILLUSTRATIONS) {
    const card = cards.find(c => c.id === image.id);
    assert.ok(card, image.id);
    assert.equal(illustrationFor(card), image);
    assert.equal(illustrationFor({ ...card, zh: '另一個義項' }), undefined);
    assert.equal(illustrationFor({ ...card, reading: '別の読み' }), undefined);
    assert.equal(illustrationFor({ ...card, word: '別の単語' }), undefined);
    assert.equal(illustrationFor({ ...card, id: `unreviewed:${card.word}` }), undefined);
  }
  // Different senses and unapproved contexts must stay unillustrated despite the same spelling.
  assert.equal(illustrationFor(cards.find(c => c.id === 'general-listening-168:冷たい')), undefined);
  assert.equal(illustrationFor(cards.find(c => c.id === 'general-listening-95:返す')), undefined);
  assert.equal(illustrationFor(cards.find(c => c.id === 'general-listening-87:少し')), undefined);
});

test('all reviewed images are local compact original vectors with no active or remote content', async () => {
  let pilotBytes = 0;
  let expansionBytes = 0;
  let prototypeBytes = 0;
  let batchBytes = 0;
  const assets = [...new Map(VOCAB_ILLUSTRATIONS.map(image => [image.src, image])).values()];
  for (const image of assets) {
    assert.match(image.src, /^images\/vocab\/[a-z]+\.svg$/);
    assert.ok(image.alt.length > 1);
    const svg = await readFile(new URL(`../public/${image.src}`, import.meta.url), 'utf8');
    if (assets.indexOf(image) < 12) pilotBytes += Buffer.byteLength(svg);
    else if (assets.indexOf(image) < 42) expansionBytes += Buffer.byteLength(svg);
    else if (assets.indexOf(image) < 54) prototypeBytes += Buffer.byteLength(svg);
    else batchBytes += Buffer.byteLength(svg);
    assert.match(svg, /viewBox="0 0 224 168"/);
    assert.doesNotMatch(svg, /<(script|foreignObject|text|image)\b|(?:href|onload|onclick)=/i);
  }
  assert.ok(pilotBytes < 12000, 'retain the original 12-image pilot budget');
  assert.ok(expansionBytes < 24000, 'retain the separate 30-image expansion budget');
  assert.ok(prototypeBytes < 12000, 'keep the separate 12-image semantic prototype compact');
  assert.ok(batchBytes < 60000, 'the sixty new assets remain within the planned 1000-byte average');
});

test('card fronts hide images and revealed auxiliary images do not repeat the accessible answer', async () => {
  const { createElement } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { createServer } = await import('vite');
  const { default: react } = await import('@vitejs/plugin-react');
  const server = await createServer({ configFile: false, plugins: [react()], appType: 'custom', logLevel: 'silent', server: { middlewareMode: true, hmr: false, watch: null }, optimizeDeps: { noDiscovery: true } });
  try {
    const { SrsView } = await server.ssrLoadModule('/app/views/SrsView.tsx');
    const { VocabIllustration } = await server.ssrLoadModule('/app/components/VocabIllustration.tsx');
    const { emptyProgress } = await server.ssrLoadModule('/lib/progress.mjs');
    const { schedule, toDateString } = await server.ssrLoadModule('/lib/srs.mjs');
    const card = buildCards(stages).find(c => c.id === 'stage0-day2:傘');
    for (const mode of ['new', 'review']) {
      const progress = emptyProgress();
      if (mode === 'review') progress.srs[card.id] = schedule(undefined, 'again', toDateString(), new Date().toISOString());
      const markup = renderToStaticMarkup(createElement(SrsView, { cards: [card], progress, update() {}, mode, categoryId: 'n5' }));
      assert.ok(markup.includes(card.word));
      assert.match(markup, /顯示答案/);
      assert.doesNotMatch(markup, /<img\b|images\/vocab\/|撐開的雨傘|かさ/);
      assert.doesNotMatch(markup, /<legend[^>]*>評分/);
    }
    for (const image of VOCAB_ILLUSTRATIONS) {
      const illustratedCard = buildCards(stages).find(c => c.id === image.id);
      const markup = renderToStaticMarkup(createElement(VocabIllustration, { card: illustratedCard }));
      assert.match(markup, /<img\b/);
      assert.match(markup, /\balt=""/);
      assert.ok(!markup.includes(image.alt), 'decorative image must not repeat its description');
    }
  } finally { await server.close(); }
});
