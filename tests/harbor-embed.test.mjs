import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const EMBED = /<script\b[^>]*harbor-1wk\.pages\.dev\/embed\/maintenance\.js[^>]*><\/script>/;

test('index.html 載入 Harbor 的維護模式腳本，且 data-project 是這個專案的 slug', () => {
  const tag = html.match(EMBED)?.[0];
  assert.ok(tag, '找不到 Harbor 前端腳本');
  assert.match(tag, /data-project="nihongo-lab"/);
});

test('Harbor 腳本放在 <head>、不加 async／defer，且早於應用程式腳本', () => {
  const tag = html.match(EMBED)?.[0] ?? '';
  assert.doesNotMatch(tag, /\b(async|defer)\b/);
  const head = html.slice(html.indexOf('<head>'), html.indexOf('</head>'));
  assert.ok(head.includes(tag), '腳本必須在 <head> 裡');
  assert.ok(html.indexOf(tag) < html.indexOf('/app/main.tsx'));
});
