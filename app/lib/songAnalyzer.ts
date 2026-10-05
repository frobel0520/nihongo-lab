import { KUROMOJI_FILES, SONG_ASSETS_CACHE } from '../../lib/song-tokens.mjs';
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

function getWorker(): Worker {
  if (worker) return worker;
  worker = new Worker(new URL('./songAnalyzer.worker.ts', import.meta.url), {
    type: 'module',
  });
  worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
    const message = event.data;
    const job = pending.get(message.id);
    if (!job) return;
    if (message.type === 'progress') {
      job.onProgress?.({ loaded: message.loaded, total: message.total });
      return;
    }
    pending.delete(message.id);
    if (message.type === 'result') {
      job.resolve({ lines: message.lines, timings: message.timings });
    } else {
      job.reject(new Error(message.message));
    }
  };
  worker.onerror = (event) => {
    // Worker 本身載入失敗（例如離線且程式檔沒快取）：所有等待中的工作都回報錯誤，下次重建 Worker。
    const error = new Error(event.message || '分析程式無法啟動');
    for (const job of pending.values()) job.reject(error);
    pending.clear();
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
    const request: WorkerRequest = { id, base: import.meta.env.BASE_URL, lines };
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
