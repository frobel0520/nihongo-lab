// Real production build and native audio; isolated synthetic progress only.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright-core';
import { loadLesson, loadLessonAudioPaths } from '../curriculum/lessons.mjs';
import { sceneRecordId } from '../lib/scene-listening.mjs';
import { emptyProgress, recordDictation } from '../lib/progress.mjs';
import { inferenceBaseline } from './helpers/inference-baseline.mjs';
import { followupInferenceBaseline } from './helpers/followup-inference-baseline.mjs';
const inference = process.argv.includes('--inference');
const arg = (name, fallback) => process.argv.includes(name) ? process.argv[process.argv.indexOf(name) + 1] : fallback;
const batches = { T138: inferenceBaseline, T139: followupInferenceBaseline };
const batch = arg('--batch', 'all');
assert.ok(batch === 'all' || Object.hasOwn(batches, batch), 'unknown inference batch');
const oldLessons = (batch === 'all' ? Object.values(batches) : [batches[batch]]).flatMap(b => b.lessons);
const lessonIds = inference ? oldLessons.map(l => l.id) : ['general-listening-51','general-listening-175'];
const root = resolve(arg('--dist', 'dist'));
const remote = arg('--base', '');
const server = !remote && createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/nihongo-lab\//, '');
    const file = resolve(root, path || 'index.html');assert.ok(file.startsWith(root + '/'));
    const bytes = await readFile(file);
    res.setHeader('content-type', ({ '.js':'text/javascript','.html':'text/html','.css':'text/css','.mp3':'audio/mp3','.webmanifest':'application/manifest+json','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon' })[extname(file)] || 'application/octet-stream');
    if (file.endsWith('.mp3')) res.setHeader('Vary', 'Accept-Encoding');
    res.setHeader('cache-control','no-cache');res.end(bytes);
  } catch { res.writeHead(404).end(); }
});
if (server) await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base = remote || `http://127.0.0.1:${server.address().port}/nihongo-lab/`;
const executablePath = process.env.CHROME_PATH || ['chromium','google-chrome'].map(name=>{try{return execFileSync('which',[name],{encoding:'utf8'}).trim();}catch{return '';}}).find(Boolean);
const browser = await chromium.launch({executablePath,headless:true,args:['--no-sandbox'],...(remote && process.env.HTTPS_PROXY ? {proxy:{server:process.env.HTTPS_PROXY}} : {})});
const errors=[];
try {
  const context=await browser.newContext({viewport:{width:375,height:667}});
  await context.addInitScript(()=>{Math.random=()=>0;});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'#/settings');await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await page.waitForFunction(()=>navigator.serviceWorker.controller);
  let originalProgress;
  if(inference) {
    originalProgress=emptyProgress();
    for(const old of oldLessons)for(const q of old.scene.questions)originalProgress=recordDictation(originalProgress,sceneRecordId(old,q),true,'2026-10-01T00:00:00.000Z');
    await page.evaluate(p=>localStorage.setItem('nihongo-lab:progress:v1',JSON.stringify(p)),originalProgress);
    await page.reload();await page.waitForFunction(()=>navigator.serviceWorker.controller);
  }
  const goto=async id=>{await page.evaluate(id=>{location.hash='#/lesson/'+id;},id);await page.getByRole('button',{name:'播放完整對話',exact:true}).waitFor();};
  let playedLines=0;
  for (const offline of [false,true]) {
    if(offline){await context.setOffline(true);await page.reload();assert.equal(await page.evaluate(()=>navigator.onLine),false);}
    for (const id of lessonIds) {
      const lesson=await loadLesson(id);
      await page.evaluate(()=>{Math.random=()=>0;});
      await goto(id);
      if(offline){
        await page.reload();
        await page.getByRole('button',{name:'播放完整對話',exact:true}).waitFor();
        assert.equal(await page.evaluate(()=>navigator.onLine),false);
      }
      if(inference){
        const savedBefore=await page.evaluate(()=>JSON.parse(localStorage.getItem('nihongo-lab:progress:v1')));
        if(offline)for(const q of lesson.scene.questions)assert.equal(savedBefore.dictation[sceneRecordId(lesson,q)]?.passed,true,'saved current answers must survive offline direct-URL reload before answering again');
        else assert.equal(savedBefore.dictation[sceneRecordId(lesson,lesson.scene.questions[2])],undefined,'old completion must not count as revised question');
      }
      const optionTexts=()=>page.locator('.scene-question .anime-options button').allTextContents();
      const expected=[lesson.scene.questions[0].options[1],lesson.scene.questions[0].options[2],lesson.scene.questions[0].options[0]];
      assert.deepEqual(await optionTexts(),expected,'old fixed-position UI must fail here');
      await page.getByText('下載本課音檔供離線使用',{exact:true}).click();
      if(!offline) await page.getByRole('button',{name:'下載本課音檔',exact:true}).click();
      await page.getByRole('button',{name:'本課音檔已全部存好',exact:true}).waitFor({timeout:120000});
      assert.deepEqual(await optionTexts(),expected,'download progress must not change order');
      await page.evaluate(()=>{window.qualityEnded=0;document.querySelector('.scene-listening audio').addEventListener('ended',()=>window.qualityEnded++);});
      await page.getByRole('button',{name:'播放完整對話',exact:true}).click();
      await page.waitForFunction(()=>{const a=document.querySelector('.scene-listening audio');return a&&!a.paused&&a.readyState>=2;});
      assert.equal(await page.locator('.scene-listening audio').evaluate(a=>a.playbackRate),1);
      assert.deepEqual(await optionTexts(),expected,'native playback repaint must not change order');
      await page.waitForFunction(()=>document.querySelector('.scene-status')?.textContent.includes('已完整聽過'),{},{timeout:180000});
      assert.equal(await page.evaluate(()=>window.qualityEnded),6);playedLines+=6;
      assert.deepEqual(await optionTexts(),expected);
      for(const q of lesson.scene.questions){
        assert.equal(await page.locator('.scene-question').evaluate((el,prompt)=>{const copy=el.cloneNode(true);copy.querySelectorAll('rt,rp').forEach(n=>n.remove());return copy.textContent.includes(prompt);},q.prompt),true);
        const labels=await optionTexts();assert.deepEqual(new Set(labels),new Set(q.options));
        await page.waitForTimeout(30);assert.deepEqual(await optionTexts(),labels,'progress repaint must keep current question stable');
        await page.locator('.scene-question .anime-options').getByRole('button',{name:q.options[q.answer],exact:true}).click();
      }
      await page.getByRole('heading',{name:'答案與解析',exact:true}).waitFor();
      assert.equal(await page.locator('.scene-listening .grammar-point p.answer').count(),3);
      const review=await page.locator('.scene-listening').evaluate(el=>{const copy=el.cloneNode(true);copy.querySelectorAll('rt,rp').forEach(n=>n.remove());return copy.textContent;});
      for(const q of lesson.scene.questions)assert.ok(review.includes(q.explanation),'full current explanation must render');
      const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('nihongo-lab:progress:v1')));
      assert.equal(saved.version,3);
      if(originalProgress)for(const [key,value] of Object.entries(originalProgress.dictation)){
        // Unchanged basic questions can receive another attempt; obsolete revised IDs must stay exactly intact.
        const retired=oldLessons.some(l=>sceneRecordId(l,l.scene.questions[2])===key);
        if(retired)assert.deepEqual(saved.dictation[key],value);else assert.equal(saved.dictation[key].passed,true);
      }
      for(const q of lesson.scene.questions)assert.equal(saved.dictation[sceneRecordId(lesson,q)].passed,true);
      await page.evaluate(()=>{Math.random=()=>.999;});
      await page.getByRole('button',{name:'重新練習整段聽解',exact:true}).click();
      assert.deepEqual(await optionTexts(),lesson.scene.questions[0].options,'new attempt may draw a new order');
      assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('nihongo-lab:progress:v1'))),saved,'retry must not erase saved progress');
      await page.getByRole('tab',{name:/^單字/}).click();assert.equal(await page.locator('.line-jp').count(),25);
      await page.getByRole('tab',{name:/^文法/}).click();assert.equal(await page.locator('.grammar-point').count(),2);assert.equal(await page.locator('.line-jp').count(),4);
      if(id.endsWith('-51'))await page.getByText(/名詞、な形容詞的非過去肯定不加だ/).waitFor();
      await page.getByRole('tab',{name:/^對話/}).click();assert.equal(await page.locator('.line-jp').count(),6);
      if(id.endsWith('-175'))await page.getByText('拜託了。搬運者和等待者已定，但還不知道送達時間，對吧。',{exact:true}).waitFor();
      await page.getByRole('tab',{name:/^練習/}).click();
      while(await page.getByRole('button',{name:'看答案',exact:true}).count())await page.getByRole('button',{name:'看答案',exact:true}).first().click();
      assert.equal(await page.locator('.practice-item p.answer').count(),3);
      if(id.endsWith('-175'))assert.ok((await page.locator('.practice-item p.answer').last().evaluate(el=>{const copy=el.cloneNode(true);copy.querySelectorAll('rt,rp').forEach(node=>node.remove());return copy.textContent;})).includes('時刻はまだ分からない'));
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
      for(const path of await loadLessonAudioPaths(id)) {
        const digest=await page.evaluate(async path=>{const r=await fetch(new URL(path,location.href));if(r.status!==200)throw Error('offline audio missing');const bytes=await r.arrayBuffer();return [...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join('');},path);
        assert.equal(digest,createHash('sha256').update(await readFile(resolve('public',path))).digest('hex'));
      }
      if(inference){
        await page.getByRole('tab',{name:/^聽解/}).click();
        await page.getByRole('button',{name:'播放完整對話',exact:true}).click();
        await page.waitForFunction(()=>{const a=document.querySelector('.scene-listening audio');return a&&!a.paused&&a.readyState>=2;});
        await page.evaluate(()=>{window.departingAudio=document.querySelector('.scene-listening audio');});
      }
      await page.evaluate(()=>{location.hash='#/settings';});await page.getByRole('button',{name:'重新檢查下載狀態',exact:true}).waitFor();
      if(inference){
        assert.equal(await page.evaluate(()=>window.departingAudio.paused),true,'route change must stop the detached native player');
        assert.equal(await page.locator('.scene-listening audio').count(),0);
      }
      console.log(JSON.stringify({id,offline,sections:5,nativeLines:6,questions:3,stableChoices:true,savedV3:true,audioShaVerified:35,routeStopChecked:inference}));
    }
  }
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({scenario:inference?'inference-production-build':'quality-production-build',remote:!!remote,playedLines,pageerrors:0,width:375,overflow:false}));
  await context.close();
} finally { await browser.close();if(server)await new Promise(r=>server.close(r)); }
