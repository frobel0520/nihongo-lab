import type { JmdictHit } from '../../lib/song-lookup.mjs';
import { KUROMOJI_FILES, SONG_ASSETS_CACHE } from '../../lib/song-tokens.mjs';
import type { Token } from '../../lib/songs.mjs';
import type { AnalyzedLine, WorkerRequest, WorkerResponse } from './songAnalyzerProtocol';

export type AnalyzeProgress = { loaded: number; total: number };
export type AnalyzeResult = {
  lines: AnalyzedLine[];
  timings: { buildMs: number | null; analyzeMs: number };
};

let worker: Worker | null = null;
let nextId = 1;
const pending = new Map<
  number,
  {
    resolve: (result: AnalyzeResult) => void;
    reject: (error: Error) => void;
    onProgress?: (progress: AnalyzeProgress) => void;
  }
>();
const lookups = new Map<
  number,
  { resolve: (hits: JmdictHit[]) => void; reject: (error: Error) => void }
>();

function getWorker(): Worker {
  if (worker) return worker;
  worker = new Worker(new URL('./songAnalyzer.worker.ts', import.meta.url), {
    type: 'module',
  });
  worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
    const message = event.data;
    const lookup = lookups.get(message.id);
    if (lookup) {
      lookups.delete(message.id);
      if (message.type === 'lookup') lookup.resolve(message.hits);
      else if (message.type === 'error') lookup.reject(new Error(message.message));
      return;
    }
    const job = pending.get(message.id);
    if (!job) return;
    if (message.type === 'progress') {
      job.onProgress?.({ loaded: message.loaded, total: message.total });
      return;
    }
    pending.delete(message.id);
    if (message.type === 'result') {
      job.resolve({ lines: message.lines, timings: message.timings });
    } else if (message.type === 'error') {
      job.reject(new Error(message.message));
    }
  };
  worker.onerror = (event) => {
    // Worker 本身載入失敗（例如離線且程式檔沒快取）：所有等待中的工作都回報錯誤，下次重建 Worker。
    const error = new Error(event.message || '分析程式無法啟動');
    for (const job of pending.values()) job.reject(error);
    for (const job of lookups.values()) job.reject(error);
    pending.clear();
    lookups.clear();
    worker?.terminate();
    worker = null;
  };
  return worker;
}

/** 在 Worker 裡分析這些行；第一次會下載並建立斷詞字典（onProgress 回報字典檔載入進度）。 */
export function analyzeLines(
  lines: string[],
  onProgress?: (progress: AnalyzeProgress) => void,
): Promise<AnalyzeResult> {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject, onProgress });
    const request: WorkerRequest = {
      kind: 'analyze',
      id,
      base: import.meta.env.BASE_URL,
      lines,
    };
    getWorker().postMessage(request);
  });
}

/** 查一個詞的 JMdict 英文釋義（第一次會下載約 2.5MB 的索引）。 */
export function lookupEnglish(token: Token): Promise<JmdictHit[]> {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    lookups.set(id, { resolve, reject });
    const request: WorkerRequest = { kind: 'lookup', id, base: import.meta.env.BASE_URL, token };
    getWorker().postMessage(request);
  });
}

/** 字典檔是否都已在快取裡（是的話自動分析不會再花行動數據下載 17MB）。 */
export async function isDictionaryCached(): Promise<boolean> {
  try {
    if (typeof caches === 'undefined') return false;
    if (!(await caches.has(SONG_ASSETS_CACHE))) return false;
    const cache = await caches.open(SONG_ASSETS_CACHE);
    const keys = await cache.keys();
    const names = new Set(keys.map((request) => request.url.split('/').pop()));
    return KUROMOJI_FILES.every((name) => names.has(name));
  } catch {
    return false;
  }
}
