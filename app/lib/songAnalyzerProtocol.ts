import type { JmdictHit } from '../../lib/song-lookup.mjs';
import type { Token } from '../../lib/songs.mjs';

/**
 * 主畫面 → Worker。base 是網站的 BASE_URL，用來組字典檔網址。
 * analyze：分析這些行；lookup：查一個詞的 JMdict 英文釋義。
 */
export type WorkerRequest =
  | { kind: 'analyze'; id: number; base: string; lines: string[] }
  | { kind: 'lookup'; id: number; base: string; token: Token };

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
  | { type: 'lookup'; id: number; hits: JmdictHit[] }
  | { type: 'error'; id: number; message: string };
