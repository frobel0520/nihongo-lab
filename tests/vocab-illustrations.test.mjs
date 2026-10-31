import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { collectInventoryCards } from '../scripts/vocab-illustration-inventory.mjs';
import { VOCAB_ILLUSTRATIONS, illustrationFor } from '../lib/vocab-illustrations.mjs';

// T163: per-ID composition descriptions are authoring data, not part of the runtime mapping.
const DESCRIPTIONS = JSON.parse(await readFile(new URL('../docs/vocab-illustration-descriptions.json', import.meta.url), 'utf8'));

test('illustrations resolve all 5969 card identities through exact approved mappings', async () => {
  const cards = await collectInventoryCards();
  assert.equal(VOCAB_ILLUSTRATIONS.length, 5969);
  assert.equal(new Set(VOCAB_ILLUSTRATIONS.map(x => x.id)).size, 5969);
  assert.equal(new Set(VOCAB_ILLUSTRATIONS.map(x => x.src)).size, 2287);
  assert.equal(cards.filter(illustrationFor).length, cards.length, 'T162: every card has an approved picture');
  for (const image of VOCAB_ILLUSTRATIONS) {
    const card = cards.find(c => c.id === image.id);
    assert.ok(card, image.id);
    assert.equal(illustrationFor(card), image);
    assert.equal(illustrationFor({ ...card, zh: '另一個義項' }), undefined);
    assert.equal(illustrationFor({ ...card, reading: '別の読み' }), undefined);
    assert.equal(illustrationFor({ ...card, word: '別の単語' }), undefined);
    assert.equal(illustrationFor({ ...card, id: `unreviewed:${card.word}` }), undefined);
  }
  // Different senses keep different pictures despite the same spelling.
  assert.equal(illustrationFor(cards.find(c => c.id === 'general-listening-168:冷たい')).src, 'images/vocab/coldattitude.svg');
  assert.equal(illustrationFor(cards.find(c => c.id === 'general-listening-95:返す')).src, 'images/vocab/replymessage.svg');
  assert.notEqual(illustrationFor(cards.find(c => c.id === 'general-listening-87:少し')).src, 'images/vocab/little.svg', 'dimming slightly is not a small quantity');
});

test('all reviewed images are local compact original vectors with no active or remote content', async () => {
  let pilotBytes = 0;
  let expansionBytes = 0;
  let prototypeBytes = 0;
  let batchBytes = 0;
  let expansion300Bytes = 0;
  let second300Bytes = 0;
  let third300Bytes = 0;
  let fourth300Bytes = 0;
  let fifth300Bytes = 0;
  let t162Bytes = 0;
  const assets = [...new Map(VOCAB_ILLUSTRATIONS.map(image => [image.src, image])).values()];
  for (const image of assets) {
    assert.match(image.src, /^images\/vocab\/[a-z]+\.svg$/);
    assert.ok(DESCRIPTIONS[image.id].length > 1, `${image.id} keeps its authoring description`);
    const svg = await readFile(new URL(`../public/${image.src}`, import.meta.url), 'utf8');
    if (assets.indexOf(image) < 12) pilotBytes += Buffer.byteLength(svg);
    else if (assets.indexOf(image) < 42) expansionBytes += Buffer.byteLength(svg);
    else if (assets.indexOf(image) < 54) prototypeBytes += Buffer.byteLength(svg);
    else if (assets.indexOf(image) < 114) batchBytes += Buffer.byteLength(svg);
    else if (assets.indexOf(image) < 414) expansion300Bytes += Buffer.byteLength(svg);
    else if (assets.indexOf(image) < 714) second300Bytes += Buffer.byteLength(svg);
    else if (assets.indexOf(image) < 1014) third300Bytes += Buffer.byteLength(svg);
    else if (assets.indexOf(image) < 1314) fourth300Bytes += Buffer.byteLength(svg);
    else if (assets.indexOf(image) < 1614) fifth300Bytes += Buffer.byteLength(svg);
    else t162Bytes += Buffer.byteLength(svg);
    assert.match(svg, /viewBox="0 0 224 168"/);
    assert.doesNotMatch(svg, /<(script|foreignObject|text|image)\b|(?:href|onload|onclick)=/i);
  }
  assert.ok(pilotBytes < 12000, 'retain the original 12-image pilot budget');
  assert.ok(expansionBytes < 24000, 'retain the separate 30-image expansion budget');
  assert.ok(prototypeBytes < 12000, 'keep the separate 12-image semantic prototype compact');
  assert.ok(batchBytes < 60000, 'retain the published sixty-asset budget');
  assert.ok(expansion300Bytes < 300000, 'retain the T156 300-asset budget');
  assert.ok(second300Bytes < 300000, 'T157 remains within its separate 1000-byte average plan');
  assert.ok(third300Bytes < 300000, 'T158 remains within its separate 1000-byte average plan');
  assert.ok(fourth300Bytes < 300000, 'T159 remains within its separate 1000-byte average plan');
  assert.ok(fifth300Bytes < 300000, 'T160 remains within its separate 1000-byte average plan');
  assert.ok(t162Bytes < 628000, 'T162 stays within a 1000-byte average for its 628 pictures');
});

test('card fronts hide images and revealed auxiliary images do not repeat the accessible answer', async () => {
  const { createElement } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { createServer } = await import('vite');
  const { default: react } = await import('@vitejs/plugin-react');
  const { vocabImageManifest } = await import('../scripts/vocab-image-manifest.mjs');
  const server = await createServer({ configFile: false, plugins: [react(), vocabImageManifest()], appType: 'custom', logLevel: 'silent', server: { middlewareMode: true, hmr: false, watch: null }, optimizeDeps: { noDiscovery: true } });
  try {
    const { SrsView } = await server.ssrLoadModule('/app/views/SrsView.tsx');
    const { VocabIllustration } = await server.ssrLoadModule('/app/components/VocabIllustration.tsx');
    const { emptyProgress } = await server.ssrLoadModule('/lib/progress.mjs');
    const { schedule, toDateString } = await server.ssrLoadModule('/lib/srs.mjs');
    const cards = await collectInventoryCards();
    const card = cards.find(c => c.id === 'stage0-day2:傘');
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
      const illustratedCard = cards.find(c => c.id === image.id);
      const markup = renderToStaticMarkup(createElement(VocabIllustration, { card: illustratedCard }));
      assert.match(markup, /<img\b/);
      assert.match(markup, /\balt=""/);
      // T161: the source carries its content version, so a revised image never reuses a stale cache entry.
      assert.ok(markup.includes(`src="/${image.src}?v=`), image.src);
      assert.ok(!markup.includes(DESCRIPTIONS[image.id]), 'decorative image must not repeat its description');
    }
  } finally { await server.close(); }
});

test('T163 published revisions keep their bytes while later artwork revisions remain versioned', async () => {
  const { createHash } = await import('node:crypto');
  const { readdir } = await import('node:fs/promises');
  // Windows checkouts may use CRLF; recorded hashes are of the committed LF bytes.
  const sha = async (src) => createHash('sha256').update((await readFile(new URL(`../public/${src}`, import.meta.url), 'utf8')).replace(/\r\n/g, '\n')).digest('hex');
  const revised = {
    'images/vocab/minutehand.svg': 'a9729f63fe73453d77002fe866c36bbe5c3831c48766eb25712b5965214c4d66',
    'images/vocab/temporarily.svg': '9a22006d68667f303530b35274c9f51e2a3b0da9d7931caed05fe2e32a2bf4b0',
    'images/vocab/lifenotsmooth.svg': 'e1b3c3992a706bf919f46fccf1d623e4fd4dcfa775db1284a8066e8558487134',
  };
  // Complete current asset integrity is pinned in vocab-artwork-revision.test.mjs.
  for (const [src, expected] of Object.entries(revised)) assert.equal(await sha(src), expected, src);
  // Mappings stay: each redrawn picture still belongs to the same single card.
  assert.deepEqual(VOCAB_ILLUSTRATIONS.filter(x => revised[x.src]).map(x => x.id).sort(), [
    'game-card:game:er:aiden:selection-voice:eaea8b98f3:eaea8b98f3',
    'general-listening-144:一時',
    'stage0-day4:分',
  ]);
  // Redrawn pictures reuse colours that other pictures already use.
  const colours = (svg) => new Set((svg.match(/#[0-9a-f]{6}\b/gi) ?? []).map(c => c.toLowerCase()));
  const existing = new Set();
  for (const file of await readdir(new URL('../public/images/vocab/', import.meta.url))) {
    if (!file.endsWith('.svg') || revised[`images/vocab/${file}`]) continue;
    for (const c of colours(await readFile(new URL(`../public/images/vocab/${file}`, import.meta.url), 'utf8'))) existing.add(c);
  }
  for (const src of Object.keys(revised)) {
    const svg = await readFile(new URL(`../public/${src}`, import.meta.url), 'utf8');
    assert.ok(Buffer.byteLength(svg) < 1000, src);
    for (const c of colours(svg)) assert.ok(existing.has(c), `${src} uses existing colour ${c}`);
  }
});

test('T163: the runtime mapping carries no composition descriptions and the app never loads them', async () => {
  const { readdir } = await import('node:fs/promises');
  assert.ok(VOCAB_ILLUSTRATIONS.every(image => Object.keys(image).join() === 'id,word,reading,zh,src'));
  assert.deepEqual(Object.keys(DESCRIPTIONS).sort(), VOCAB_ILLUSTRATIONS.map(image => image.id).sort());
  const files = async (dir) => (await readdir(new URL(dir, import.meta.url), { recursive: true })).filter(f => /\.(ts|tsx|mjs)$/.test(f)).map(f => new URL(dir + f.replaceAll('\\', '/'), import.meta.url));
  for (const file of [...await files('../app/'), ...await files('../lib/')]) {
    assert.doesNotMatch(await readFile(file, 'utf8'), /(?:from\s*|import\(\s*|fetch\(\s*)['"`][^'"`]*vocab-illustration-descriptions/, String(file));
  }
});
