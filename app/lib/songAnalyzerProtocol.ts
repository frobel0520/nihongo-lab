import type { Token } from '../../lib/songs.mjs';

/** 主畫面 → Worker：分析這些行（base 是網站的 BASE_URL，用來組字典檔網址）。 */
export type WorkerRequest = { id: number; base: string; lines: string[] };

export type AnalyzedLine = { text: string; tokens: Token[] };

/** Worker → 主畫面。 */
export type WorkerResponse =
  | { type: 'progress'; id: number; loaded: number; total: number }
  | {
      type: 'result';
      id: number;
      lines: AnalyzedLine[];
      /** buildMs：這次才建立斷詞器時的耗時（已建立過為 null）；analyzeMs：分析這些行的耗時。 */
      timings: { buildMs: number | null; analyzeMs: number };
    }
  | { type: 'error'; id: number; message: string };
