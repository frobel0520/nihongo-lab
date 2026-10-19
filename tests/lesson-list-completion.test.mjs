import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

test('roadmap completion requires all180 lessons and audio; it never promises mastery or links181', async () => {
  const server = await createServer({ configFile: false, plugins: [react()], appType: 'custom', logLevel: 'silent', server: { middlewareMode: true, hmr: false, watch: null }, optimizeDeps: { noDiscovery: true } });
  try {
    const { LessonListView } = await server.ssrLoadModule('/app/views/LessonListView.tsx');
    const { curriculumSummary } = await server.ssrLoadModule('/curriculum/lessons.mjs');
    const { emptyProgress } = await server.ssrLoadModule('/lib/progress.mjs');
    const lessons = curriculumSummary.stages.find(s => s.id === 'stage-1').lessons;
    const flags = lessons.map(l => l.audioReady);
    const render = () => renderToStaticMarkup(createElement(LessonListView, { progress: emptyProgress(), stageId: 'stage-1' }));
    try {
      assert.equal(lessons.length, 180);
      lessons.forEach(l => { l.audioReady = true; });
      const ready = render();
      assert.match(ready, /六階段180課教材與配音已提供/);
      assert.match(ready, /不代表已掌握陌生作品/);
      assert.ok(ready.includes('href="#/lesson/general-listening-180"'));
      assert.ok(!ready.includes('href="#/lesson/general-listening-181"'));
      lessons.at(-1).audioReady = false;
      const pending = render();
      assert.doesNotMatch(pending, /六階段180課教材與配音已提供/);
      assert.match(pending, /音檔製作中/);
    } finally { lessons.forEach((l, i) => { l.audioReady = flags[i]; }); }
  } finally { await server.close(); }
});
