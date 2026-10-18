import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

test('scene question renders registered Japanese readings and respects the furigana preference', async () => {
  const server = await createServer({
    configFile: false,
    plugins: [react()],
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true, hmr: false, watch: null },
    optimizeDeps: { noDiscovery: true },
  });
  try {
    const { SceneListening } = await server.ssrLoadModule('/app/components/SceneListening.tsx');
    const { PrefsContext } = await server.ssrLoadModule('/app/prefs.ts');
    const { registerRubyNotes } = await server.ssrLoadModule('/lib/ruby-note-store.mjs');
    const prompt = '隊長說彼女は先に行く是什麼意思？';
    registerRubyNotes(['隊長說{彼女|かのじょ}は{先|さき}に{行|い}く是什麼意思？', '目標：{前|まえ}に的時間順序']);
    const lesson = {
      id: 'synthetic-reading-scene',
      title: '合成練習',
      vocab: [], grammar: [], practice: [],
      dialogue: [{ jp: '私は先に行く。', reading: 'わたしは さきに いく。', zh: '我先走。', voice: 'hau', audio: 'audio/synthetic.mp3' }],
      scene: { goal: '目標：前に的時間順序', questions: [{ id: 'q', prompt, options: ['先走', '等待', '不明'], answer: 0, explanation: '合成解析' }] },
    };
    const render = (furigana) => renderToStaticMarkup(createElement(
      PrefsContext.Provider,
      { value: { furigana, dictationMode: 'choice' } },
      createElement(SceneListening, { lesson, update() {} }),
    ));
    const enabled = render(true);
    assert.match(enabled, /目標：<ruby>前<rp>\(<\/rp><rt>まえ<\/rt>/);
    assert.match(enabled, /隊長說<ruby>彼女<rp>\(<\/rp><rt>かのじょ<\/rt>/);
    assert.match(enabled, /<ruby>先<rp>\(<\/rp><rt>さき<\/rt>/);
    assert.doesNotMatch(enabled, /<ruby>隊長/);
    const disabled = render(false);
    assert.ok(disabled.includes(prompt));
    assert.doesNotMatch(disabled, /<ruby>/);
  } finally {
    await server.close();
  }
});
