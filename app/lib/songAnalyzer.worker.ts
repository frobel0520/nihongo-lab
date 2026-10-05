/// <reference lib="webworker" />
/**
 * 歌詞斷詞的 Web Worker：載入 kuromoji 字典、建立斷詞器、分析每一行。字典約 17MB、建立斷詞器要數秒，
 * 放在 Worker 裡主畫面才不會凍結。字典檔第一次從網站下載後存進 Cache Storage（song-assets-v1），
 * 之後離線也能分析；設定頁的「清除快取」會一併清掉。
 */
import * as kuromoji from '@patdx/kuromoji';
import {
  KUROMOJI_FILES,
  KUROMOJI_PATH,
  SONG_ASSETS_CACHE,
  analyzeLine,
  gunzipIfNeeded,
} from '../../lib/song-tokens.mjs';
import type { WorkerRequest, WorkerResponse } from './songAnalyzerProtocol';

declare const self: DedicatedWorkerGlobalScope;

type Tokenizer = Awaited<ReturnType<kuromoji.TokenizerBuilder['build']>>;

let tokenizer: Promise<Tokenizer> | null = null;
let buildMs: number | null = null;

const post = (message: WorkerResponse) => self.postMessage(message);

async function gunzip(buffer: ArrayBuffer): Promise<ArrayBuffer> {
  const stream = new Blob([buffer]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Response(stream).arrayBuffer();
}

/** 先查快取，沒有才下載；只把成功、非空的回應存進快取。 */
async function fetchDictFile(url: string): Promise<ArrayBuffer> {
  const cache = typeof caches === 'undefined' ? null : await caches.open(SONG_ASSETS_CACHE);
  const cached = await cache?.match(url);
  if (cached) return cached.arrayBuffer();
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`字典檔下載失敗（${response.status}）：${url.split('/').pop()}`);
  }
  const buffer = await response.arrayBuffer();
  if (buffer.byteLength === 0) throw new Error(`字典檔是空的：${url.split('/').pop()}`);
  await cache?.put(url, new Response(buffer.slice(0)));
  return buffer;
}

function getTokenizer(base: string, id: number): Promise<Tokenizer> {
  if (tokenizer) return tokenizer;
  const started = performance.now();
  let loaded = 0;
  const loader: kuromoji.LoaderConfig = {
    async loadArrayBuffer(name: string) {
      const buffer = await fetchDictFile(`${base}${KUROMOJI_PATH}${name}`);
      const data = await gunzipIfNeeded(buffer, gunzip);
      loaded++;
      post({ type: 'progress', id, loaded, total: KUROMOJI_FILES.length });
      return data;
    },
  };
  tokenizer = new kuromoji.TokenizerBuilder({ loader })
    .build()
    .then((built) => {
      buildMs = Math.round(performance.now() - started);
      return built;
    })
    .catch((error: unknown) => {
      tokenizer = null; // 下次再試，不要卡在失敗的 Promise 上
      throw error;
    });
  return tokenizer;
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { id, base, lines } = event.data;
  try {
    const firstBuild = tokenizer === null;
    const built = await getTokenizer(base, id);
    const started = performance.now();
    const results = lines.map((text) => ({ text, tokens: analyzeLine(built, text) }));
    post({
      type: 'result',
      id,
      lines: results,
      timings: {
        buildMs: firstBuild ? buildMs : null,
        analyzeMs: Math.round(performance.now() - started),
      },
    });
  } catch (error) {
    post({
      type: 'error',
      id,
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
